pipeline {
    agent any

    environment {
        registryCredentials = "nexuslogin" 
        registry = "192.168.1.4:8083" 
        }
    
    stages {

        stage('Remove node_modules') {
            steps {
                script {
                    sh 'find /var/lib/jenkins/workspace/node-pipeline -name "node_modules" -type d -prune -exec rm -rf {} +'
                }
            }
        }

        stage('Install dependencies') {
            steps {
                script {
                    
                    // Install dependencies
                    sh 'npm install'
                    sh 'chmod +x ./node_modules/.bin/nyc' // Update permissions for nyc executable
                    sh 'chmod +x ./node_modules/.bin/mocha'
                }
            }
        }
        
        
        stage('Unit Test') {
            steps {
                script {
                    sh 'npm test'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // Define the SonarQube scanner tool
                    def scannerHome = tool 'scanner'

                    // Run the SonarQube scanner with specified parameters
                    sh """
                        ${scannerHome}/bin/sonar-scanner \
                        -Dsonar.projectKey=spartacusBackend \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://192.168.1.4:9000/ \
                        -Dsonar.login=211394fdac05c478a8ea27ded41480fa47cbdb75
                    """
                }
            }
        }

        stage('Building images (node and mongo)') {
            steps{
                script {
                    sh('docker-compose build')
                }
            }
        }

        stage('Build application') {
            steps{
                script {
                    withCredentials([
                        usernamePassword(credentialsId: registryCredentials, passwordVariable: 'REGISTRY_PASSWORD', usernameVariable: 'REGISTRY_USERNAME')
                    ]) {
                        sh '''
                            echo "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin $registry
                            docker push $registry/nodemongoapp:6.0
                        '''
                    }
                }
            }
        }


        // Uploading Docker images into Nexus Registry 
        stage('Deploy to Nexus') { 
            steps{ 
                script { 
                    docker.withRegistry("http://"+registry, registryCredentials ) {
                        sh('docker push $registry/nodemongoapp:6.0 ') 
                    } 
                } 
            } 
        }

        stage('Run application ') {
            steps{ 
                script { 
                    docker.withRegistry("http://"+registry, registryCredentials ) { 
                        sh('docker pull $registry/nodemongoapp:6.0 ') 
                        sh('docker-compose up -d ') 
                    } 
                } 
            } 
        }

        stage("Run Prometheus"){
            steps{
                script{
                    sh('docker start 08379f2285eb')
                }
            }
        }

        stage("Run Grafana"){ 
            steps{
                script{
                    sh('docker start 39d45a3996ed')
                }
            }
        }


    }
}


