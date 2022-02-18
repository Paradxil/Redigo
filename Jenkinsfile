pipeline {
  agent any
  stages {
    stage('Install Deps') {
      parallel {
        stage('Install Admin Deps') {
          steps {
            nodejs('17') {
              sh '''cd admin
npm -v
npm i'''
            }

          }
        }

        stage('Install App Deps') {
          steps {
            sh '''cd app
npm i'''
          }
        }

      }
    }

    stage('Build') {
      steps {
        sh '''cd admin
npm build'''
      }
    }

    stage('Migrate') {
      steps {
        sh '''cd admin
npx keystone prisma migrate deploy'''
      }
    }

    stage('Deploy') {
      steps {
        sh '''cd admin
npm run start'''
      }
    }

  }
  environment {
    PORT = '4060'
    DB_PROVIDER = 'postgresql'
    DB_URL = 'postgres://redigo:ncit7zNVatke4M6MdM9eXW0vslT5OHtb@localhost:5432/redigo'
    SESSION_SECRET = '[k&qf9?cQ}@OsVUJgzz:W$~{hFx*QneE3J[~=gQ0OSW,CPakz6M#.2hi4<d*o7'
  }
}