
pipeline {
    agent any

    options {
        disableConcurrentBuilds()
    }

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        ECR_REPO = '541293890816.dkr.ecr.ap-south-1.amazonaws.com/sample-web'
        APP_NAME = 'sample-web'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Validate Files') {
            steps {
                sh '''
                    test -f index.html
                    test -f Dockerfile
                    echo "Website files verified"
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build -t "$ECR_REPO:build-$BUILD_NUMBER" .
                '''
            }
        }

        stage('Test Docker Image') {
            steps {
                sh '''
                    docker run --rm "$ECR_REPO:build-$BUILD_NUMBER" nginx -t

                    docker run --rm \
                      --entrypoint sh \
                      "$ECR_REPO:build-$BUILD_NUMBER" \
                      -c 'test -f /usr/share/nginx/html/index.html'

                    echo "Docker image tests passed"
                '''
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh '''
                    aws ecr get-login-password \
                      --region "$AWS_DEFAULT_REGION" |
                    docker login \
                      --username AWS \
                      --password-stdin \
                      "${ECR_REPO%/*}"
                '''
            }
        }

        stage('Push Image to ECR') {
            steps {
                sh '''
                    docker push "$ECR_REPO:build-$BUILD_NUMBER"

                    docker tag \
                      "$ECR_REPO:build-$BUILD_NUMBER" \
                      "$ECR_REPO:latest"

                    docker push "$ECR_REPO:latest"
                '''
            }
        }

        stage('Deploy on EC2') {
            steps {
                sh '''
                    docker pull "$ECR_REPO:build-$BUILD_NUMBER"

                    docker rm -f "$APP_NAME" || true

                    docker run -d \
                      --name "$APP_NAME" \
                      --restart unless-stopped \
                      -p 80:80 \
                      "$ECR_REPO:build-$BUILD_NUMBER"

                    sleep 3
                    curl --fail --retry 5 --retry-delay 2 \
                      http://127.0.0.1/

                    echo "Deployment successful"
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline SUCCESS!'
        }
        failure {
            echo 'CI/CD Pipeline FAILED!'
        }
    }
}
