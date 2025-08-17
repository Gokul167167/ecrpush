pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'us-east-1'
        ECR_REPO_NAME = 'ecommerce'
    }

    stages {
        stage('Checkout Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/Gokul167167/EKS-Blue-Green-Deployment.git'
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
                    sh "npm ci || npm install"
                    sh "npm run build"
                    sh "docker build -t frontend:latest ."
                }
                // Backend npm install
                dir('E-commerce Application/backend') {
                    sh "npm ci || npm install"
                }

                // Backend Docker build
                dir('E-commerce Application') {
                    sh "docker build -t backend:latest -f backend/Dockerfile ."
                }
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh """
                    aws ecr get-login-password --region ${env.AWS_DEFAULT_REGION} | \
                    docker login --username AWS --password-stdin ${env.ECR_REPO}
                """
            }
        }

        stage('Tag & Push Docker Images') {
            steps {
                sh """
                    # Tag and push frontend
                    docker tag frontend:latest ${env.ECR_REPO}:frontend-latest
                    docker push ${env.ECR_REPO}:frontend-latest

                    # Tag and push backend
                    docker tag backend:latest ${env.ECR_REPO}:backend-latest
                    docker push ${env.ECR_REPO}:backend-latest
                """
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
