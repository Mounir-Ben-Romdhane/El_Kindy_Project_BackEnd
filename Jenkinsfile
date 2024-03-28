pipeline {
    agent any
    
    stages {
        stage('Install dependencies') {
            steps {
                script {
                    
                    // Clean npm cache to avoid potential issues
                    sh 'npm cache clean --force'
                    
                    // Remove the problematic directory if it exists
                    sh 'rm -rf /var/lib/jenkins/workspace/node-pipeline/node_modules/mongoose/node_modules/gaxios'
                    sh 'rm -rf /var/lib/jenkins/workspace/node-pipeline/node_modules/multer-gridfs-storage/node_modules/debug'
                    sh 'rm -rf /var/lib/jenkins/workspace/node-pipeline/node_modules/mongoose/node_modules/https-proxy-agent'
                    sh 'rm -rf /var/lib/jenkins/workspace/node-pipeline/node_modules/multer-gridfs-storage/node_modules/agent-base'
                    sh 'rm -rf /var/lib/jenkins/workspace/node-pipeline/node_modules/mongoose/node_modules/node-fetch'
                    
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

        stage('Build application') {
            steps{
                script {
                    sh('npm run build-dev')
                }
            }
        }

    }
}


