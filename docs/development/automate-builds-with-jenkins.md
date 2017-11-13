---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Damaso Sanoja
  link: https://twitter.com/damasosanoja
description: 'Creating easy automation workflows with Jenkins.'
keywords: ''
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, October 23, 2017'
modified: Monday, October 23, 2017
modified_by:
  name: Linode
title: 'Automate builds with Jenkins'
external_resources:
 - '[Jenkins User Documentation](https://jenkins.io/doc/)'
 - '[Blue Ocean Documentation](https://jenkins.io/doc/book/blueocean/)'

---



In this guide, you will learn the basic workflow to speed up your Continuous Integration and Continuous Delivery process with Jenkins automation server.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode’s hostname and timezone.

2.  Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system (this guide uses Ubuntu 16.04):

        sudo apt update && sudo apt upgrade

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Preliminary Assumptions

This guide is oriented toward DevOps professionals and thus presumes:

1. A Workstation machine will be used for local development and testing.

2. A remote Linode Server will be used for the Jenkins Server.

3. Both will use Ubuntu 16.04 Operating System.

4. Jenkins will be used mainly through the newer [Blue Ocean](https://jenkins.io/projects/blueocean/) web interface.

5. The Workstation and the remote Linode will need Docker installed beforehand, please read our [guide](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment) for detailed instructions.

6. For the purpose of this guide only a Jenkins Master Server will be used.

7. You will need a GitHub account already created, similar procedures can be used for Bitbucket and GitLab.

8. You will also need a Docker Hub or similar registry account. 

## Understanding How Jenkins Works

Before starting automating your entire workflow, it's necessary to understand the basic CI/CD process. The following image illustrates it:

![Blue Ocean Workflow](/docs/assets/jenkins-workflow.jpg)

As you can see the most basic process consist of three phases: build - test - deploy. Each time you make changes on your distributed version control system you trigger an automation cycle on the Jenkins server. The entire set of instructions for running the process is on the `Jenkinsfile` located at the root of your source repository. That single file tells the server "what" to do, "when" to do it and "how" you want those tasks to be performed.

## Writing your example nodeJS application

As mentioned in the previous section the automation process starts by making a commit to a Control Version System. Let's create a new repository in GitHub, this guide will use a simple nodeJS application to showcase how Jenkins Pipelines works, select your `.gitignore` accordingly and don't forget to initialize it with a `README`:

![New GitHub repository](/docs/assets/jenkins-gh-new-repo.png)

Clone the new repository to your local Workstation:

        git clone git@github.com:<GITHUB_USERNAME>/jenkins-guide.git

Let's begin writing the web application code, open your favorite text editor and save the file `app.js` in the root of your repository.

{:.file}
~/<path/to/your/repository/app.js>
:   ~~~ conf
'use strict';

const express = require('express');
const app = express();

// Server connection
const PORT = 9000;
const HOST = '0.0.0.0';

// Application content
const os = ['Windows','macOS','Linux']

// Web Server 
app.get('/',function(req,res) {
  res.json(os);
});

// Console output
app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
    ~~~

This application uses `express` web server to deliver a single JSON output to the browser on port 9000. Next, save the `test.js` file to the same location on the root of your folder.

{:.file}
~/<path/to/your/repository/test.js>
:   ~~~ conf
var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://nodeapp-dev:9000");

// Unit Test

describe("Webapp Status",function(){

  // Test 1 - HTTP status
  it("Expect HTTP status 200",function(done){
    server
    .get("/")
    .expect("Content-type",/text/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      done();
    });
  });

  // Test 2 - Control Tests
  it("Mocha Control Test",function(done){
      (1).should.be.exactly(1).and.be.a.Number();
        done();
  });

});
    ~~~

This is a simplified "test suite" that uses `supertest` and `should`. It has only two test, the first checks HTTP status expecting to be 200. The second is not a real test but a "control" that always trows "true". 

This example will use two Docker containers, one to serve the `app.js` using `express` and the other exclusively for the test suite using `mocha`. Each image will have its own folder containing the respective `Dockerfile` and `package.json`.

Create the images folders:

        mkdir express-image testing image

Now write the `Dockerfile` and `package.json` for the `express-image`.

{:.file}
~/<path/to/your/repository/express-image/Dockerfile>
:   ~~~ conf
FROM node:6-alpine

# Create server working directory
RUN mkdir -p /home/node/app
WORKDIR /home/node/app

# Install server dependencies
COPY /express-image/package.json /home/node/app
RUN npm install

# Copy node Application
COPY app.js /home/node/app

# Open port
EXPOSE 9000

CMD ["npm", "start"]
    ~~~

This image runs by default `app.js` when launched. You can think of it as the "dockerized" version of the web application.

{:.file}
~/<path/to/your/repository/express-image/package.json>
:   ~~~ conf
{
  "name": "express-image",
  "version": "1.0.0",
  "description": "Example Node Application",
  "author": "Your name",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/<YOUR_USERNAME>/<REPOSITORY_NAME>.git"
  },
  "license": "ISC",
  "scripts": {
    "start": "node app.js"
  },
  "dependencies": {
    "express": "^4.13.3"
  }
}
    ~~~

The `express-image` uses as its only dependency `express` as mentioned before. Now write the `Dockerfile` and `package.json` for the `testing-image`.


{:.file}
~/<path/to/your/repository/testing-image/Dockerfile>
:   ~~~ conf
FROM node:6-alpine

# Create Reports directory
RUN mkdir -p /JUnit

# Create server working directory
RUN mkdir -p /home/node/tests
WORKDIR /home/node/tests

# Install app dependencies
COPY /testing-image/package.json /home/node/tests
RUN npm install

# Copy test source
COPY test.js /home/node/tests

EXPOSE 9000

CMD ["npm", "test"]
    ~~~

This image creates a Report folder (that will be used later) and installs dependencies from `package.json`. On start, it executes the Mocha tests.

{:.file}
~/<path/to/your/repository/testing-image/package.json>
:   ~~~ conf
{
  "name": "testing-image",
  "version": "1.0.0",
  "description": "This is a Mocha Test Server",
  "scripts": {
    "mocha": "mocha --reporter spec test.js",
    "test": "mocha --reporter mocha-junit-reporter --reporter-options mochaFile=/JUnit/reports.xml test.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git"
  },
  "author": "Your name",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>/issues"
  },
  "homepage": "https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>#readme",
    "dependencies": {
    "mocha": "^4.0.1",
    "mocha-junit-reporter": "^1.15.0",
    "should": "^13.1.3",
    "supertest": "^3.0.0"
  }
}
    ~~~

This JSON file contains all the necessary dependencies, including `mocha-junit-reporter` that will be needed by Jenkins for tests storage. Notice that the test script is configured with the `mochaFile` option that uses the image's report folder specified in the `Dockerfile`.

Your final project distribution will be similar to this:

    ![Project tree view](/docs/assets/jenkins-nodejs-tree.png)

{: .note}
> The unusual approach of the folder structure as well as the implementation of two Docker containers is used for pedagogical reasons to showcase Jenkins Pipelines features.

### Running your application manually

You have all set, but before starting the real automation process you first need to understand what to automate in the first place. 

1. Assuming you are on the root of your repository start by building your images:

        sudo docker build -f express-image/Dockerfile -t nodeapp-dev:trunk .
        sudo docker build -f testing-image/Dockerfile -t testing-image:latest .

2. You will need to start your `nodeapp-dev` container first. The flag `--network` is used to avoid conflicts with the other container network, notice that port 9000 is opened and  `-d` flag is used to run it in detached mode. Once started you can open your browser and enter the address: http://localhost:9000 to check it.

        sudo docker run --name nodeapp-dev --network="bridge" -d -p 9000:9000 nodeapp-dev:trunk

        ![app.js Mozilla output](/docs/assets/jenkins-app-mozilla-output.png)

3. Time to start the `testing-image` container. It's important to use the same network along with the `--link` flag in order to communicate with `nodeapp-dev`. You will notice that a volume will be mounted: the container's report folder `JUnit` will be mounted on the current repository root of the host. This is necessary to write the `reports.xml` in the host machine. First run it in interactive mode using the `-it` flag to output the results to `stdout`.

        sudo docker run --name testing-image -v $PWD:/JUnit --network="bridge" --link=nodeapp-dev -it -p 9001:9000 testing-image:latest npm run mocha

        ![Mocha test console output](/docs/assets/jenkins-testing-console-output.png)

4. Now remove the container (you may need `sudo -i`) and run it again in detached mode to test the `JUnit` output. The `reports.xml` file should be saved afterwards.

        sudo docker rm -f testing-image
        sudo docker run --name testing-image -v $PWD:/JUnit --network="bridge" --link=nodeapp-dev -d -p 9001:9000 testing-image:latest

5. After testing your application you can publish it in a public registry. First change its tag to something more appropriate.

        sudo docker tag nodeapp-dev:trunk <YOUR_DOCKERHUB_USERNAME>/nodeapp-prod:latest

6. Assuming your are already logged to Docker Hub, push your image to the registry.
    
        sudo docker push <YOUR_DOCKERHUB_USERNAME>/nodeapp-prod:latest

7. Alternatively, you could save your compressed image for further distribution.

        sudo docker save <YOUR_DOCKERHUB_USERNAME>/nodeapp-prod:latest | gzip > nodeapp-prod-golden.tar.gz

8. Do some clean-up stop both containers, use `sudo -i` if necessary.
        
        sudo docker stop testing-image nodeapp-dev

9. And finally prune your system.

        sudo docker system prune -f

You just finished the entire "Build - Test - Deploy" process for this fictional web application. It's time to automate it.

## Install Jenkins and Blue Ocean Plugin

Jenkins offers many installation options:

* You can download the self-executable `jenkins.war` from project's site. This is a quick and effective solution to work with Jenkins with few pre-requisites, but if harder to maintain and update.
* You can pull the official Docker image and run Jenkins from there. But that requires extra configuration, especially for "Docker in Docker" functionality.
* Finally, you can use the project-maintained package. This offers the benefit of easier upgrading.

This guide will explain briefly the first two methods and will use the third one for the remote Linode installation.

### Option 1: using `jenkins.war`

1. Download the `jenkins.war` to a suitable location, in this example the `home` directory is being used:

        cd ~
        wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war

2. Run the executable with the following command (you can change the port as needed):

        java -jar jenkins.war --httpPort=8080

3. In your browser load Jenkins using the address: http://<LINODE_IP_OR_HOSTNAME>:8080

### Option 2: using the Official Docker Image

1. Pull the official Jenkins image:

        sudo docker pull jenkins/jenkins

2. Run your image, remember that you will need to mount a volume for persistent storage.

        sudo docker run --name=jenkins -d -p 8080:8080 jenkins/jenkins

This container will be accessible using the same address on your browser http://<LINODE_IP_OR_HOSTNAME>:8080

### Option 3: using Jenkins maintained packages

As mentioned earlier, this option offers the advantage that all dependencies would be managed by `apt-get` and updates should be easier to apply. However, is preferable to install the project-maintained package instead of Ubuntu's provided version.

1. If you want to use the recommended stable version then download and add the Jenkins repository key:

        wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -

2. Now include the new repository to your `sources.list`:

        sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'

3. Update your system using `apt` as usual:

        sudo apt update

4. Install Jenkins in your Linode:

        sudo apt install jenkins

On the other hand, if you prefer to install the most recent Jenkins build then use the following key and repository instead:

        wget -q -O - https://pkg.jenkins.io/debian/jenkins.io.key | sudo apt-key add -
        sudo sh -c 'echo deb https://pkg.jenkins.io/debian binary/ > /etc/apt/sources.list.d/jenkins.list'

{: .note}
> Using the edge versions of Jenkins requires that you explicitly install Java runtime environment, because **Jenkins does not work with Java 9**. Please check  [JENKINS-40689](https://issues.jenkins-ci.org/browse/JENKINS-40689) for more information about compatibility issues.

5. Now that you have Jenkins installed you will need to give its user permissions to run Docker commands:

        sudo usermod -aG docker jenkins

6. Controlling your daemon is straightforward using: `sudo service jenkins start | stop | restart | status`. Start your service to check the installation:

        sudo service jenkins start

7. If everything work as expected then enable the service on start-up.

        sudo systemctl enable jenkins

8. Reboot your server to apply all changes, specially group permissions.

        sudo reboot

9. Use your browser to navigate to default server address:

        http://<LINODE_IP_OR_HOSTNAME>:8080

{: .caution}
> It's out of the scope of this guide to establish security parameters for Jenkins remote installation. However, be aware of these critical points that need to be addressed in a production environment:
- When you add `jenkins` user to the Docker group you are technically giving it `root` permissions.
- You must enforce Firewall policies for Jenkins connections.
- It's extremely important to secure the connection between your local Workstation and your remote Linode running Jenkins. You can achieve this using SSL and a reverse Proxy (like Apache or Nginx), using a VPN, or using any other secure remote technology.

## Setting up Jenkins

1. Up to this point, you end up with Jenkins web application running at port `8080`. The first screen you should see would be similar to this:

    ![Unlocking Jenkins](/docs/assets/jenkins-unlock.png)

2. Copy the temporally administrator password.

        sudo cat /var/lib/jenkins/secrets/initialAdminPassword

3. Paste the password and click **Continue**, you will be presented with the following screen:

    ![Customize Jenkins](/docs/assets/jenkins-customize.png)

4. Choose **Install suggested plugins** to start downloading the standard plugins:

    ![Standard Plugins](/docs/assets/jenkins-standard-plugins.png)

5. Once the plugins installation finishes you will be asked to create a new administrative user:

    ![First Admin User](/docs/assets/jenkins-admin-user.png)

6. If everything goes without errors you will see:

    ![Jenkins Ready](/docs/assets/jenkins-ready.png)

7. Click on **Start using Jenkins** to display the application dashboard:

    ![Jenkins Main Dashboard](/docs/assets/jenkins-dashboard.png)

8. As mentioned earlier, this guide will use the new Blue Ocean interface so you will need to click in the **Manage Jenkins** link on the sidebar:

    ![Manage Jenkins link](/docs/assets/jenkins-manage-sidebar.png)

9. A new menu with Jenkins configuration options will appear, click on **Manage Plugins** to  install Blue Ocean.

    ![Manage Plugins link](/docs/assets/jenkins-manage-plugins.png)

10. Now click on **Available** tab and filter the results searching for Blue Ocean.

    ![Filter Plugins](/docs/assets/jenkins-filter-plugins.png)

11. Check the box corresponding to Blue Ocean plugin and then click at the botton on **Install without restart**.

    ![Install Blue Ocean](/docs/assets/jenkins-bo-box.png)

12. You should see the installation progress. Once is finished click the **Go back to the top page** link and then click on the **Open Blue Ocean** link on the sidebar.

    ![Blue Ocean link](/docs/assets/jenkins-bo-link.png)

13. The new Blue Ocean Dashboard will greet you.

    ![Blue Ocean Dashboard](/docs/assets/jenkins-bo-dashboard.png)

## Declarative vs Scripted Pipeline Syntax

Jenkins offers two kind of approaches for the `Jenkinsfile` syntax:

* The legacy Scripted Pipeline syntax.
* The newer Declarative Pipeline syntax.

Both have support for continuous delivery and Jenkins plugins. Scripted syntax is based on Groovy programming environment so is more complete and offer almost no limitations, on the other hand Declarative syntax "was created to offer a simpler and more opinionated syntax for authoring Jenkins Pipeline" and thus is intended for everyday automation builds. You can learn more about syntax comparison on the Jenkins documentation [here.](https://jenkins.io/doc/book/pipeline/syntax/#compare)

This guide will use the Declarative syntax to illustrate Jenkins processes because it's designed to be easier to implement and understand.  

## Jenkinsfile structure

Declarative Pipeline syntax is very intuitive, the most basic layout would be as the one shown below:

![Basic Declarative Syntax](/docs/assets/jenkins-declarative-syntax-basics.png)

`pipeline`: all files should start with this declaration at the top. Indicates the start of the new Pipeline.
`agent`: defines the working environment, usually a Docker image. The `any` statement indicates the pipeline can use any available agent.
`stages`: this block is a collection of `stage` directives.
`stage`: groups one or more "steps". You can use as many stages as needed, this is useful when you are working in complex models that need detailed debugging "per stage".
`steps`: here you define your actions. A stage can group many steps, each step is usually linked to one specific task/command.

Code blocks are delimited by brackets {}. No semi-colons are used, each statement has to be in its own line. The heart of the `Jenkinsfile` are the steps you perform, because they represent a "call to action". Common steps are:

* Running scripts or code commands.
* Compile code.
* Run tests.
* Push or pull from your source control.
* Transfer archives.
* Create Docker images, dockerize applications, pull images.
* Almost any action you can think of its doable through steps.

All this actions can be executed inside your `agent` or you can also instruct Jenkins to remotely perform any of them via SSH. As you can see there are endless automation possibilities. In a simple scenario only one pipeline executing his stages sequentially is enough to achieve the desired final state, but you can also define pipelines to run in parallel if needed.

{: .note}
> For detailed information about Jenkins Declarative Pipeline Syntax please read the official [documentation.](https://jenkins.io/doc/book/pipeline/syntax/)

## Start working with Pipelines

1. Create your first `Jenkinsfile`.

{:.file}
~/<path/to/your/repository/Jenkinsfile>
:   ~~~ conf
pipeline {
    agent any
        stages {
            stage('Build') {
                steps {
                    echo 'This is the Build Stage'
                }
            }
            stage('Test') {
                steps {
                    echo 'This is the Testing Stage'
                }
            }
            stage('Deploy') {
                steps {
                    echo 'This is the Deploy Stage'
                }
            }
        }
    } 
    ~~~

2. As you can see, is only a template but have all the necessary code to start your Pipeline. Push your commit to GitHub:

        git add . && git commit -m "Jenkinsfile template" && git push origin master

3. Return to your Blue Ocean Dashboard and click on **Create a new Pipeline** button:

    ![Blue Ocean Dashboard](/docs/assets/jenkins-bo-dashboard.png)

4. Select GitHub as your CVS.

    ![GitHub pipeline](/docs/assets/jenkins-bo-gh-pipeline.png)

5. You will be asked to connect with your GitHub account by means of an access key, click on the link to create that key.

    ![GitHub connect](/docs/assets/jenkins-bo-gh-connect.png)

6. Next you will need to login to your GitHub account, give a description to the Token and generate it. You will be presented with a screen similar to this.

    ![GitHub token](/docs/assets/jenkins-bo-gh-token.png)

7. Copy the token value and then paste it on the Blue Ocean tab, click on **Connect** button.

    ![GitHub authentication BO](/docs/assets/jenkins-bo-token.png)

8. If you have Organizations along with your personal account then you will need to choose where is your repository.

    ![GitHub Organization](/docs/assets/jenkins-bo-organizations.png)

9. After choosing your repository location, click on the **Create Pipeline** button. That will trigger your first build automatically.

    ![First Build](/docs/assets/jenkins-bo-first-build-01.png)

10. Click on the build to see your detailed Pipeline.

    ![First Build](/docs/assets/jenkins-bo-first-build-02.png)

Congratulations, you just built your first successful Pipeline! From here you can obtain valuable information regarding (1) your build number, (2) the console output for each step, (3) select each stage for further analysis, (4) browse through tabs with information about commit changes, tests results and artifacts stored, (5) replay your build, (6) edit your pipeline visually, (7) go to your pipeline settings.

### Automating your entire process with Jenkins

The `Jenkinsfile` template has the most basic Pipeline structure with only three stages. You can customize it to accommodate as many stages as needed. The final Pipeline structure is dictated by the project complexity and the development guidelines you need to follow. As you already walked through the nodeJS example you can design a Pipeline that automates each stage. For the purpose of this guide the resulting Pipeline should:

* Build Stage:
    - Create both images and abort any further testing or deployment if any error is encountered.
    - Inform the appropriate department in case of failure.
* Test Stage:
    - Perform the automatic Mocha test suite.
    - Publish the `nodeapp-dev` image for easier distribution and manual Quality Tests.
    - Inform the appropriate department depending on the outcome of the automatic tests: success, unstable (failure of any automatic test) or total failure of the stage.
* Deploy Stage:
    - Will run if and only if the commit is performed on the `master` branch and tests were successfully completed. 
    - Changes the image tag before publish.
    - Deploys the dockerized application to Docker Hub.
    - Save a compressed "golden" image for further distribution.
* Reports Stage:
    - Saves the `JUnit` file `reports.xml` for detailed analysis.
    - Saves the `nodeapp-prod-golden.tar.gz` compressed image to a persistent location.
* Clean-up Stage:
    - Stop all containers.
    - Prune the system.
    - Cleans the Jenkins workspace.

### Committing changes to your Pipeline

1. Start by editing your `Jenkinsfile` and pasting the following Pipeline:

{:.file}
~/<path/to/your/repository/Jenkinsfile>
:   ~~~ conf
pipeline {
    environment {
      DOCKER = credentials('docker-hub')
    }
  agent any
  stages {
// Building your Test Images
    stage('BUILD') {
      parallel {
        stage('Express Image') {
          steps {
            sh 'docker build -f express-image/Dockerfile \
            -t nodeapp-dev:trunk .'
          }
        }
        stage('Test-Unit Image') {
          steps {
            sh 'docker build -f testing-image/Dockerfile \
            -t testing-image:latest .'
          }
        }
      }
      post {
        failure {
            echo 'I failed :('
// Uncomment this lines for email notifications on failure
//          mail(from: "jenkins-bot@example.com",
//           to: "devops@example.com",
//           subject: "This build failed! ${env.BUILD_TAG}",
//           body: "Check the failure ${env.BUILD_URL}")
        }
      }
    }
// Performing Software Tests
    stage('TEST') {
      parallel {
        stage('Mocha Tests') {
          steps {
            sh 'docker run --name nodeapp-dev --network="bridge" -d \
            -p 9000:9000 nodeapp-dev:trunk'
            sh 'docker run --name testing-image -v $PWD:/JUnit --network="bridge" \
            --link=nodeapp-dev -d -p 9001:9000 \
            testing-image:latest'
          }
        }
        stage('Quality Tests') {
          steps {
            sh 'docker login --username $DOCKER_USR --password $DOCKER_PSW'
            sh 'docker tag nodeapp-dev:trunk damasosanoja/nodeapp-dev:latest'
            sh 'docker push damasosanoja/nodeapp-dev:latest'
          }
        }
      }
      post {
        success {
            echo 'Success!'
// Uncomment this lines for email notifications on success
//            mail(from: "jenkins-bot@example.com",
//             to: "QA-testing@example.com",
//             subject: "New test image available ${env.BUILD_TAG}",
//             body: "Please review")
        }
        unstable {
            echo 'I am unstable'
// Uncomment this lines for email notifications when marked as unstable (failed tests)
//            mail(from: "jenkins-bot@example.com",
//             to: "QA-testing@example.com",
//             subject: "Unstable Test Results ${env.BUILD_TAG}",
//             body: "The ${env.JOB_NAME} Project had an unstable test result \
//              ${env.BUILD_URL} Branch: ${env.GIT_BRANCH} Commit: ${env.GIT_COMMIT}")
        }
        failure {
            echo 'I failed :('
// Uncomment this lines for email notifications on failure
//            mail(from: "jenkins-bot@example.com",
//             to: "devops@example.com",
//             subject: "Test Stage failed! ${env.BUILD_TAG}",
//             body: "Check the failure ${env.BUILD_URL}")
        }
      }
    }
// Deploying your Software
    stage('DEPLOY') {
          when {
           branch 'master'  //only run these steps on the master branch
          }
            steps {
                    retry(3) {
                        timeout(time:10, unit: 'MINUTES') {
                            sh 'docker tag nodeapp-dev:trunk damasosanoja/nodeapp-prod:latest'
                            sh 'docker push damasosanoja/nodeapp-prod:latest'
                            sh 'docker save damasosanoja/nodeapp-prod:latest | gzip > nodeapp-prod-golden.tar.gz'
                        }
                    }

            }
            post {
                failure {
                    sh 'docker stop nodeapp-dev testing-image'
                    sh 'docker system prune -f'
                    deleteDir()
                }
            }
    }
// JUnit reports and artifacts saving
    stage('REPORTS') {
      steps {
        junit 'reports.xml'
        archiveArtifacts(artifacts: 'reports.xml', allowEmptyArchive: true)
        archiveArtifacts(artifacts: 'nodeapp-prod-golden.tar.gz', allowEmptyArchive: true)
      }
    }
// Doing containers clean-up to avoid conflicts in future builds
    stage('CLEAN-UP') {
      steps {
        sh 'docker stop nodeapp-dev testing-image'
        sh 'docker system prune -f'
        deleteDir()
      }
    }
  }
}
    ~~~

This larger and most complete `Jenkinsfile` is written in Declarative Syntax, and if you read it carefully you will notice that is only describing the same procedure used during the application deployment done in a previous section. Let's analyze it in more detail.

### Agent and Environmental Variables

The first block defines a globally available environmental variable called `DOCKER`. You can tell its "global" because is inside the pipeline block but outside the stages block. Next comes the `agent` any statement that means Jenkins can use any (server) agent.

{:.file-excerpt}
~/<path/to/your/repository/Jenkinsfile>
:   ~~~ conf
pipeline {
    environment {
      DOCKER = credentials('docker-hub')
    }
  agent any
    ~~~

The `DOCKER` definition is done through the "credentials" feature. This allows you to use any secret without passing it to the `Jenkinsfile`. To configure this "key: value" pair you must click on the gear icon (Pipeline Settings). You will see the project's settings page, click on the **Credentials** link at the bottom of the sidebar menu.

![Project Pipeline Settings](/docs/assets/jenkins-pipeline-settings-sidebar.png)

In the next screen you can choose the scope of the credentials you want to configure. This can be limited to the current project or can be defined to be global. In this case you want Docker Hub login information to be global.

![Global Credentials](/docs/assets/jenkins-global-credentials.png)

Click on the **Add Credentials** link on the left sidebar and you will be redirected to a screen similar to this.

![Username and Password](/docs/assets/jenkins-user-pwd.png)

There you need to enter your Docker Hub username, password and enter an unique identifier (ID) for this credential. The chosen one for this example was `docker-hub`. Once you save your credentials you can use them anywhere in the Pipeline. 

Back to our example, when you declare the `DOCKER` variable you are creating two more environmental values: `DOCKER_USER` and `DOCKER_PWD` that can be used to login your Docker Hub account.

### Build Stage

The first thing you will notice is the `parallel` code block that actually is self-explanatory: it will run sub-stages in Parallel. This is very useful to build your two Docker images at the same time using the `sh` for injecting the very same shell commands you used before. Each image is declared in its own step which is also part of an independent stage.

{:.file-excerpt}
~/<path/to/your/repository/Jenkinsfile>
:   ~~~ conf
// Building your Test Images
    stage('BUILD') {
      parallel {
        stage('Express Image') {
          steps {
            sh 'docker build -f express-image/Dockerfile \
            -t nodeapp-dev:trunk .'
          }
        }
        stage('Test-Unit Image') {
          steps {
            sh 'docker build -f testing-image/Dockerfile \
            -t testing-image:latest .'
          }
        }
      }
      post {
        failure {
            echo 'I failed :('
// Uncomment this lines for email notifications on failure
//          mail(from: "jenkins-bot@example.com",
//           to: "devops@example.com",
//           subject: "This build failed! ${env.BUILD_TAG}",
//           body: "Check the failure ${env.BUILD_URL}")
        }
      }
    }
    ~~~

After closing the parallel stage you encounter the `post` conditionals. That means the definitions applies to the whole `BUILD` stage. In this case only the `failure` condition is set, so it will only run if any part of the `BUILD` stage fails. Is out of the scope of this guide configuring the different tools that Jenkins provide for communications. As an example the mail function is included but you can also install Plugins for SLACK, HipChat and others. Inside the mail example you can find more global environmental variables. You can check system predefined variables [here](https://wiki.jenkins.io/display/JENKINS/Building+a+software+project).

### Test Stage

As you can see, the testing stage is also using the Pipeline Parallel execution.

{:.file-excerpt}
~/<path/to/your/repository/Jenkinsfile>
:   ~~~ conf
// Performing Software Tests
    stage('TEST') {
      parallel {
        stage('Mocha Tests') {
          steps {
            sh 'docker run --name nodeapp-dev --network="bridge" -d \
            -p 9000:9000 nodeapp-dev:trunk'
            sh 'docker run --name testing-image -v $PWD:/JUnit --network="bridge" \
            --link=nodeapp-dev -d -p 9001:9000 \
            testing-image:latest'
          }
        }
        stage('Quality Tests') {
          steps {
            sh 'docker login --username $DOCKER_USR --password $DOCKER_PSW'
            sh 'docker tag nodeapp-dev:trunk damasosanoja/nodeapp-dev:latest'
            sh 'docker push damasosanoja/nodeapp-dev:latest'
          }
        }
      }
      post {
        success {
            echo 'Success!'
// Uncomment this lines for email notifications on success
//            mail(from: "jenkins-bot@example.com",
//             to: "QA-testing@example.com",
//             subject: "New test image available ${env.BUILD_TAG}",
//             body: "Please review")
        }
        unstable {
            echo 'I am unstable'
// Uncomment this lines for email notifications when marked as unstable (failed tests)
//            mail(from: "jenkins-bot@example.com",
//             to: "QA-testing@example.com",
//             subject: "Unstable Test Results ${env.BUILD_TAG}",
//             body: "The ${env.JOB_NAME} Project had an unstable test result \
//              ${env.BUILD_URL} Branch: ${env.GIT_BRANCH} Commit: ${env.GIT_COMMIT}")
        }
        failure {
            echo 'I failed :('
// Uncomment this lines for email notifications on failure
//            mail(from: "jenkins-bot@example.com",
//             to: "devops@example.com",
//             subject: "Test Stage failed! ${env.BUILD_TAG}",
//             body: "Check the failure ${env.BUILD_URL}")
        }
      }
    }
    ~~~

The `Mocha Tests` stage starts the two images and performs the automatic tests resulting in a `reports.xml` file saved into Jenkins workspace. The `Quality Tests` stage on the other hand publishes the `trunk` version of your application to Docker Hub. First, issues the Docker login command (using the pre-defined credentials) and then changes the image tag and push it.

Once again, you have the `post` code block but this time it has notifications for successful completion, unstable and failure. Keep in mind you can use any code here not just notifications.

### Deploy Stage

This stage introduces a different type of block: `when`. As the name implies, this is a different kind of clause that executes the code only if certain condition is meet. In the case of this example the code only runs if the master branch is detected. This means that commits from other branches won't trigger the `DEPLOY` stage.

Inside the steps you can optionally configure the `retry` and `timeout` arguments. Our current example shows a nested usage where the image build process have a timeout of 10 minutes and a total of three retries in case the timer expires.

The `post` block has been designed to run a "clean-up" in case of failure. No notifications are set for this stage.

### Reports and Clean-up Stages

The final two stages of your pipeline are even easier to understand. The `junit` statement allow Jenkins to use the `reports.xml` file generated by your Mocha image and the `archiveArtifacts` command saves the report and application file in a persistent location. By default, that location is `JENKINS_HOME/var/lib/jenkins/jobs/<REPOSITORY>/branches/master/builds/lastStableBuild`. You can configure a custom location in Jenkins General Settings if needed.

### Working with branches

Now that the `Jenkinsfile` was analyzed in detail it's time to commit the changes to your Jenkins Server. But in order to test your new Pipeline the changes will be issued under a different branch.

1.  Create a new branch on your local repository.

        git checkout -b trunk

2. Stage, commit and push the files to the Jenkins Server.

        git add . && git commit -m "Jenkinsfile complete Pipeline" && git push origin trunk

3. On your Blue Ocean Dashboard click on the gear icon (Pipeline settings) and then click on **Scan Repository Now** link.

        ![Scan Repository Now](/docs/assets/jenkins-scan-repository.png)

4. Back to your Pipeline view you can watch how your stages run in parallel.

        ![Parallel Execution](/docs/assets/jenkins-parallel-execution.png)

5. Once finished you will see your entire Pipeline. Notice that this commit was submitted as branch, and because of that, the `DEPLOY` stage was skipped as expected.

        ![Successful Pipeline 01](/docs/assets/jenkins-successful-trunk-01.png)

6. If you navigate through the menu tabs you can check the test results and the artifacts stored.

        ![Test Results](/docs/assets/jenkins-all-test-passing.png)

        ![Artifacts Stored](/docs/assets/jenkins-artifacts.png)

### Configuring automatic triggers

You can set Jenkins to scan your repository periodically. To do so just click again in the gear icon on the Pipeline view and then click in the **Configure** link. There are many options available. Find **Scan Repository Triggers** and check the box "Periodically if not otherwise run". You can chose any amount of time, for this example one minute will be selected.

    ![Respository Triggers](/docs/assets/jenkins-bo-scan-gh.png)

### Failing Tests (Unstable Pipeline)

Up to this point everything work as expected with no errors. But what happens when an error is encountered? 

1. Edit `app.js` in your local Workstation. On the Web Server change the root address `/` with `/ERROR`. This will cause an error 404 on the `express` server (page not found) so the test will fail.

{:.file-except}
~/<path/to/your/repository/app.js>
:   ~~~ conf

// Web Server 
app.get('/ERROR',function(req,res) {
  res.json(os);
});
    ~~~

2. Commit your changes to the Jenkins Server.

        git add . && git commit -m "404 error" && git push origin trunk

3. There is no need to manually scan your repository because you already setup Jenkins to do it automatically every minute. Wait for the trigger. After running you should see something similar to this.

        ![Unstable Pipeline](/docs/assets/jenkins-unstable-pipeline.png)

4. Navigate to the **Tests** tab and click on the chevron for a complete console output.

        ![Test Unstable](/docs/assets/jenkins-unstable-results.png)

5. Close your view (upper right "X") and you will return to the Repository view.

        ![Unstable repository view](/docs/assets/jenkins-repo-view.png)

6. Before continuing, fix the `app.js` and save.

### Failing Stages

It's time to induce an error on the `BUILD` stage.

1. Edit your `express-image/package.json`. Change the express package name to `express-ERROR` to simulate a mistyping.


{:.file-except}
~/<path/to/your/repository/express-image/package.json.js>
:   ~~~ conf
"dependencies": {
    "express-ERROR": "^4.13.3"
  }

2. Push your changes to the Jenkins Server.

        git add . && git commit -m "express-image Build error" && git push origin trunk

3. In the pipeline view click on `BUILD` stage and the on **Shell Script** so see the console output.

        ![Failed BUild](/docs/assets/jenkins-bo-failed-build.png)

4. Scroll down and check the error.

        ![Failed Build Msg](/docs/assets/jenkins-bo-failed-build-msg.png)

5. Before continuing fix the error in the  `express-image/package.json`.

### Pull requests and merging

Login to your GitHub account and make a Pull Request then merge `trunk` with `master` branch. This will trigger the Pipeline in the Jenkins Server.

            ![Successful Trunk Merge](/docs/assets/jenkins-successful-master.png)

Now you have your Pipeline tested, including the `DEPLOY` stage. 

## Outside Blue Ocean Dashboard

Blue Ocean interface is still under development that means many aspects of Jenkins are not managed by the new interface. In this Section you will discover some of the most common screens.

1. Click on the gear icon to enter at your Repository Menu. Once there click on the **Status** link in the left sidebar. You will see your branches and some general information.

    ![Project Status](/docs/assets/jenkins-project-status.png)

2. If you click on `master` branch you can check a more detailed dashboard.

    ![Master Details](/docs/assets/jenkins-master-details.png) 

From this view you can review a lot of useful information like logs, artifacts, changes, Test Results Trends and much more.


## The Road Ahead

This guide has covered the basic automation Workflow with Jenkins/Blue Ocean, that's like the tip of the iceberg regarding Jenkins power. There a lot more you can do. Just to mention a few possibilities:

* JUnit plugin has the ability to publish XML formatted test reports (generated by test tools) and integrate those trends and reports into Blue Ocean Dashboard for analysis.
* Besides Jenkins GUI and new Blue Ocean GUI you can work with Jenkins CLI if that suits you best.
* Pipelines have support for custom functions, that can be used for complex data validation, testing, monitoring and more.
* Parallel pipelines can be executed to accelerate certain processes as well as "branch triggering" that runs the pipeline only if a specific branch is checked.
* The `post` (or any other section) can benefit from useful built-in functions like: email notifications, slack notifications and HipChat notifications. As usual you decide what triggers the notifications (a successful build, a failure, a change, a custom condition).
* You can also use different `agent` for specific `stages`, for example one for database tasks, one for compiling code, one for webapp updating, etc.
