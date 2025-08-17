pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        ECR_REPO_NAME = 'ecommerce'
    }

    stages {
        stage('Checkout Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Gokul167167/ecrpush.git'
            }
        }

        stage('Fetch ECR Repo URL') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS Access Key']]) {
                    sh '''
                        ECR_REPO=$(aws ecr describe-repositories --repository-names ecommerce --query "repositories[0].repositoryUri" --output text)
                        echo "✅ ECR Repo: $ECR_REPO"
                        echo "ECR_REPO=$ECR_REPO" > ecr_env
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                dir('E-commerce Application/client') {
                    sh "npm ci"
                    sh "npm run build"
                    sh "docker build -t frontend:latest ."
                }

                dir('E-commerce Application/backend') {
                    sh "npm ci"
                }

                dir('E-commerce Application') {
                    sh "docker build -t backend:latest -f backend/Dockerfile ."
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'AWS Access Key']]) {
                    script {
                        def ECR_REPO = readFile('ecr_env').trim().split('=')[1]
                        sh """
                            aws ecr get-login-password --region ${env.AWS_DEFAULT_REGION} | \
                            docker login --username AWS --password-stdin ${ECR_REPO}
                        """
                    }
                }
            }
        }

        stage('Tag & Push Docker Images') {
            steps {
                script {
                    def ECR_REPO = readFile('ecr_env').trim().split('=')[1]
                    sh """
                        # Tag and push frontend
                        docker tag frontend:latest ${ECR_REPO}:frontend-latest
                        docker push ${ECR_REPO}:frontend-latest

                        # Tag and push backend
                        docker tag backend:latest ${ECR_REPO}:backend-latest
                        docker push ${ECR_REPO}:backend-latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Frontend & Backend images pushed successfully to single ECR repo!'
        }
        failure {
            echo '❌ Pipeline failed. Check logs.'
        }
    }
}
