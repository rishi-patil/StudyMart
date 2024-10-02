pipeline {
	agent any
	tools {
		nodejs 'NodeJS'
	}
	environment {
		SONAR_PROJECT_KEY = 'study'
		SONAR_SCANNER_HOME = tool 'sonar-scanner'
	}

	stages {
		stage('Checkout Github'){
			steps {
				 script {
                   			bat 'git config --global http.postBuffer 1048576000' 
					bat 'git config --global http.lowSpeedLimit 1000'
                    			bat 'git config --global http.lowSpeedTime 60'
               		 }
				git branch: 'main', credentialsId: 'github-credentials', url: 'https://github.com/rishi-patil/StudyMart.git'
			}
		}

		stage('Install node dependencies'){
			steps {
				// Use 'bat' for Windows instead of 'sh'
				bat 'npm install'
			}
		}
		stage('Tests'){
			steps {
				// Use 'bat' for running tests on Windows
			 bat 'npm test'
			}
		}
		stage('SonarQube Analysis'){
			steps {
				withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
					withSonarQubeEnv('sonarqube') {
					
						bat """
                  				${SONAR_SCANNER_HOME}\\bin\\sonar-scanner.bat ^
                  				-Dsonar.projectKey=${SONAR_PROJECT_KEY} ^
                   				-Dsonar.sources=. ^
                   				-Dsonar.host.url=http://localhost:9000 ^
                   				-Dsonar.login=%SONAR_TOKEN%
                    		"""
					}	
				}
			}
		}
	}
	post {
		success {
			echo 'Build completed successfully!'
		}
		failure {
			echo 'Build failed. Check logs.'
		}
	}
}
