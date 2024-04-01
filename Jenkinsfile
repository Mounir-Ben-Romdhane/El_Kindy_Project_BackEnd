pipeline {
    agent any

    environment {
        // Define credentials for Nexus registry
        //registryCredentials = "nexuspi" 
        registryCredentials = "nexuslogin" 
        // Define the URL of the Nexus registry
        //registry = "localhost:8083"
        registry = "172.20.10.2:8083"
        // Define Docker Hub credentials
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
    }
    
    stages {

        stage('Remove node_modules') {
            steps {
                script {
                    sh 'find /var/lib/jenkins/workspace/pipeline_pi -name "node_modules" -type d -prune -exec rm -rf {} +'
                }
            }
        }


        stage('Install dependencies') {
            steps {
                script {
                    // Install Node.js dependencies
                    sh 'npm install'
                    // Update permissions for NYC and Mocha executables
                    sh 'chmod +x ./node_modules/.bin/nyc'
                    sh 'chmod +x ./node_modules/.bin/mocha'
                }
            }
        }
        
        stage('Unit Test') {
            steps {
                script {
                    // Run unit tests
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') { 
            steps{ 
                script { 
                    def scannerHome = tool 'sonar' 
                    withSonarQubeEnv { 
                        sh "${scannerHome}/bin/sonar-scanner" 
                    } 
                } 
            } 
        }

        stage('Build application') {
            steps {
                script {
                    // Build the Node.js application
                    sh 'npm run build-dev'
                }
            }
        }

        stage('Building images (node and mongo)') {
            steps {
                script {
                    // Build Docker images using docker-compose
                    sh 'docker-compose build'
                }
            }
        }

        stage('Build application & push registry') {
            steps {
                script {
                    // Push Docker image to the Nexus registry
                    withCredentials([
                        usernamePassword(credentialsId: registryCredentials, passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')
                    ]) {
                        sh '''
                            echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USERNAME" --password-stdin $registry
                            docker push $registry/nodemongoapp:6.0
                        '''
                    }
                }
            }
        }

        // Uploading Docker images into Nexus Registry 
       stage('Deploy to Nexus') {
           steps {
               script {
                    Push Docker image to Nexus registry
                   docker.withRegistry("http://"+registry, registryCredentials) {
                       sh('docker push $registry/nodemongoapp:6.0') 
                   } 
               }
           }
       }

        stage('Run application') {
            steps {
                script {
                    // Pull Docker image and run the application
                    docker.withRegistry("http://"+registry, registryCredentials) {
                        sh('docker pull $registry/nodemongoapp:6.0')
                        sh('docker-compose up -d')
                    }
                }
            }
        }

        stage("Run Prometheus") {
            steps {
                script {
                    // Start Prometheus container
                    sh('docker start prometheus')
                }
            }
        }

        stage("Run Grafana") {
            steps {
                script {
                    // Start Grafana container
                    sh('docker start grafana')
                }
            }
        }
    }
}
