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

1. A Workstation machine will be used for local testing.

2. A remote Linode Server will be used for centralized automation services.

3. Both will use Ubuntu 16.04 Operating System.

4. Jenkins will be used through the newer [Blue Ocean](https://jenkins.io/projects/blueocean/) web interface.

5. Docker installation will be needed, please read our [guide](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment) for detailed instructions.

6. Java installation might be needed, please read our guide [Install Java on Ubuntu 16.04](https://www.linode.com/docs/development/install-java-on-ubuntu-16-04) for more information.

7. For the purpose of this guide a basic Python application will be used to showcase Jenkins automation, similar procedures can be used for other development languages.


## Install Jenkins and Blue Ocean Plugin

Jenkins offers many installation options:

* You can download the self-executable `jenkins.war` from project's site.
* Alternatively, you can pull an official Docker image and run Jenkins from there.
* A third option would be to use the project-maintained package (in this case Ubuntu .deb).

### Workstation Installation

For local development and testing the first two options make a lot of sense because they need very little extra configuration. To install Jenkins self-executable just:

1. Download the `jenkins.war` to a suitable location, in this example the `home` directory is being used:

        cd ~
        wget http://mirrors.jenkins.io/war-stable/latest/jenkins.war

2. Run the executable with the following command (you can change the port as needed):

        java -jar jenkins.war --httpPort=8080

3. In your browser load Jenkins using the address: [http://localhost:8080](http://localhost:8080)

If you prefer to use a Docker image then:

1. Pull the official Jenkins image to your local Workstation:

        sudo docker pull jenkins/jenkins

2. Run your image, remember that you would need to mount a volume if you want persistent storage.

        sudo docker run --name=jenkins -d -p 8080:8080 jenkins/jenkins

This container will be accessible using the same address on your browser [http://localhost:8080](http://localhost:8080

### Linode Installation

Arguably, the best option for a stand-alone Linode installation is using the server's package system. All dependencies would be managed by `apt-get` and updates should be easy to apply. However, is preferable to use the project-maintained package instead of Ubuntu's provided version.

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

### Setting up Jenkins

1. Up to this point, you end up with Jenkins web application running at port `8080`. The first screen you should see would be similar to this:

    ![Unlocking Jenkins](/docs/assets/jenkins-unlock.png)

2. Copy the temporally administrator password.

        sudo cat /var/lib/jenkins/secrets/initialAdminPassword

3. Paste the password and click **Continue**, you will be presented with the following screen:

    ![Customize Jenkins](/docs/assets/jenkins-customize.png)

4. Choose **Install suggested plugins** to start downloading the standard plugins:

    ![Standard Plugins](/docs/assets/jenkins-standard-plugins.png)

5. Once the plugin process is finished you will be asked to create a new administrative user:

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

## Understanding How Jenkins Works

Before starting using your newly installed Blue Ocean Dashboard, it's necessary to understand the basic CI/CD work flow. The following image illustrates it:

![Blue Ocean Workflow](/docs/assets/jenkins-workflow.jpg)

As you can see the most basic process consist of three phases: build - test -deploy. Each time you make changes on your distributed version control system you trigger an automation cycle on the Jenkins server. The entire set of instructions for running the process is on the `Jenkinsfile` located at the root of your source repository. That single file tells the server "what" to do, "when" to do it and "how" you want those tasks to be performed.

### Declarative vs Scripted Pipeline Syntax

Jenkins offers two kind of approaches for the `Jenkinsfile` syntax:

* The legacy Scripted Pipeline syntax.
* The newer Declarative Pipeline syntax.

Both have support for continuous delivery and Jenkins plugins. Scripted syntax is based on Groovy programming environment so is more complete and offer almost no limitations, on the other hand Declarative syntax "was created to offer a simpler and more opinionated syntax for authoring Jenkins Pipeline" and thus is intended for less complex everyday automation builds. You can learn more about syntax comparison on the Jenkins documentation [here.](https://jenkins.io/doc/book/pipeline/syntax/#compare)

This guide will use the Declarative syntax to illustrate Jenkins processes because it's designed to be easier to implement and understand.  

### Jenkinsfile structure

Declarative Pipeline syntax is very intuitive, the most basic layout would be as the one shown below:

![Basic Declarative Syntax](/docs/assets/jenkins-declarative-syntax-basics.png)

`pipeline`: all files should start with this declaration at the top. Indicates the start of the new Pipeline.
`agent`: defines the working environment, usually a Docker image. The `any` statement indicates the pipeline can use any available agent.
`stages`: this block is a collection of `stage` directives.
`stage`: groups one or more "steps". You can use as many stages as needed, this is useful when you are working in complex models that need detailed debugging "per stage".
`steps`: here you define your actions. A stage can group many steps, each step is usually linked to one specific task/command.

Code blocks are delimited by brackets {}. No semi-colons are used, each statement has to be in its own line. The heart of the `Jenkinsfile` are the steps you perform, because they represent a "call to action". Common steps are:

* Run scripts or code commands.
* Compile code.
* Run tests.
* Push or pull from your source control.
* Transfer archives.
* Create Docker images, dockerize applications, pull images.
* Almost any action you can think of its doable through steps.

All this actions can be executed inside your `agent` or you can also instruct Jenkins to remotely perform any of them via SSH. As you can see there are endless automation possibilities. In a simple scenario only one pipeline executing his stages sequentially is enough to achieve the desired final state, but you can also define pipelines to run in parallel if needed.

{: .note}
> For detailed information about Jenkins Declarative Pipeline Syntax please read the official [documentation.](https://jenkins.io/doc/book/pipeline/syntax/)

## Automation Example

This guide will use a Python application to illustrate the Jenkins workflow. Please take in consideration the following assumptions:

* Common Python development tools like `virtualenv` will be used. You can install this tool following our [guide.](https://www.linode.com/docs/development/create-a-python-virtualenv-on-ubuntu-1610)
* GitHub will be used for source control, other `git` platforms can be used as well.
* For application distribution [PyPi](https://testpypi.python.org/pypi) will be used, which means that an account will be required.
* The application is intentionally simple and easy to understand.
* Other languages like Go, Ruby, NodeJS, Javascript, might use similar procedures.

### Development Environment Preparation

1. Create an empty repository "pythonapp-example" in GitHub and copy the corresponding `clone` address.

2. Clone your repository in the `home` folder of your local Workstation.

        cd ~
        git clone <GIT_REPOSITORY_ADDRESS>

3. Still in the `home` folder create a new virtual environment for testing purposes.

        virtualenv -p python3 pythonapp-venv

4. And while in `home` directory download the example files.

        wget <ARCHIVE_LINK>

### Local debugging

The Python example used for this guide has the classic structure:

![Application Structure](/docs/assets/jenkins-application-tree)

- Consists in only one module.
- Have its own basic test suite.

The easier way to debug this simple application is using a virtual environment `pythonapp-venv`.

1. Copy the archive `pythonapp.zip` inside the `pythonapp-venv` directory.

        cp pythonapp.zip pythonapp-venv/

2. Extract the example files (you will need `unzip` installed beforehand):

        cd pythonapp-venv
        unzip pythonapp.zip

3. Activate your virtual environment.

        source bin/activate

4. Change to the example directory and run the test suite.

        cd pythonapp
        python setup.py test

5. Install the application in your `pythonapp-venv`.

        python setup.py install

6. Proceed to execute the application.

        pythonapp-msg

    ![Application Output](/docs/assets/jenkins-app-msg.png)

Now you have a tested application ready for deployment. You can deactivate your virtual environment and return to home folder.

        deactivate
        cd ~

### The Jenkinsfile

It's time to design your automation process. The first priority is defining objectives. Let's say your main objective is to distribute your application through PyPi. In such case you can write a basic `Jenkinsfile` like the one included in the example files:

{:.file}
~/pythonapp/Jenkinsfile
:   ~~~ conf
pipeline {
        agent {
            dockerfile true
        }
        stages {
            stage('Build') {
                steps {
                    sh '''
                    echo "This is your building Block"
                    python -V
                    python setup.py build sdist bdist_wheel --universal
                    '''
                }
            }
            stage('Test') {
                steps {
                    sh '''
                    echo "This is your testing Block"
                    python setup.py test
                    '''
                }
            }
            stage('Deploy') {
                environment {
                    TWINE_USERNAME = 'your_username'
                    TWINE_PASSWORD = 'your_password'
                }
                steps {
                    sh '''
                    echo "This is your deployment Block"
                    twine upload --repository-url https://test.pypi.org/legacy/ dist/*
                    '''
                }
            }
        }
        post {
            always {
                echo 'Actions here will always happen.'
                cleanWs()

            }

            success {
                echo 'If you see this is because we succeed'

            }

            unstable {
                echo 'Sorry, I am unstable :/'

            }

            failure {
                echo 'You have to try again, because Pipeline failed :('

            }

            changed {
                echo 'Things were different before...'

            }

        }
    }
    ~~~

As simple as it is, this template shows Jenkins flexibility when you need to automate tasks. It's also easy to understand, let's analyze it:

* You declare the pipeline and then assign a docker `agent`. You can use any image from Docker Hub or create your own custom image using a `Dockerfile`. Agent can be defined as global or per stage. In this example a global agent built from a `Dockerfile` will be used.
* Next you have a three-stage process: Build > Test > Deploy, where "Deploy" uses environment variables needed for `twine` authentication.
* Finally you have a `post` conditional block, which is an special section with many options at your disposal:
    - `always`: as the name implies, actions within this block will **always** execute. In this example `cleanWs()` is used for "workspace cleanup".
    - `success`: this code will only run if your pipeline **succeed**.
    - `unstable`: this condition is meet when your pipeline fail the tests has code violations, etc.
    - `failure`: is the opposite of the `success` condition, this code will only run if the pipeline **fails**.
    - `changed`: this handy option let you execute code only if any **build status** change. For example, a build that previously succeeded and now changed to unstable.


{: .caution}
> You should avoid including plain text credentials in your `Jenkinsfile`, instead you can use global environment variables or any of the available plugins to bind secrets in your configuration. The reason for using this method is merely pedagogical for easier understanding of the environmental statement.

## Blue Ocean Dashboard

Right now you only have an empty repository. To start working with Blue Ocean you need to:

1. Assuming you are on your `home` directory, then move the content of `pythonapp` folder to your repository root:

        unzip pythonapp.zip
        mv pythonapp/* pythonapp-example/

2. It's a good idea to change the permissions to avoid unwanted problems downstream:

        sudo chown jenkins: -R pythonapp-example

3. Commit your changes to the remote repository (this assumes you configured your GitHub account details beforehand).

        cd pythonapp-example
        git add . && git commit -m "Initial commit" && git push origin master

4. On your remote (or local) Jenkins installation use your browser to open Blue Ocean Dashboard.

        http://<localhost, or remote IP address/hostname>:8080/blue

5. Click on "Create New Pipeline".

    ![Create new pipeline](/docs/assets/jenkins-bo-dashboard.png)

6. A new screen will load asking which SCM you want to use, choose GitHub.

    ![GitHub pipeline](/docs/assets/jenkins-bo-gh-pipeline.png)

7. You will be asked to connect with your GitHub account by means of an access key, click on the link to create that key.

    ![GitHub connect](/docs/assets/jenkins-bo-gh-connect.png)

8. Next you will need to login to your GitHub account, give a description to the Token and generate it. You will be presented with a screen similar to this.

    ![GitHub token](/docs/assets/jenkins-bo-gh-token.png)

9. Copy the token value and then paste it on the Blue Ocean tab, click on **Connect** button.

    ![GitHub authentication BO](/docs/assets/jenkins-bo-token.png)

10. If you have Organizations along with your personal account then you will need to choose where is your repository.

    ![GitHub Organization](/docs/assets/jenkins-bo-organizations.png)

11. After choosing your repository location, click on the **Create Pipeline** button. That will trigger your first build automatically.

    ![First Build](/docs/assets/jenkins-bo-first-build.png)

You now can review each stage, and click on any step to view the details. You can also edit your pipeline directly through Blue Ocean and commit the changes back to your GitHub repository.

### Pipeline Basic Settings

Jenkins application has many options to play with. And if what you need is customization then you can extend its functionality by installing plugins (like Blue Ocean). In this guide only few basic settings will be explained.

First setting to change should be the time interval for scanning GitHub repository. Click on the gear icon right to the Pipeline name.

![Interval Time](/docs/assets/jenkins-bo-gear.png)

A new tab will open showing you many Pipeline settings. Scroll down to the section **Scan Repository Triggers** and check the box "Periodically if not otherwise run"

![Scan interval](jenkins-bo-scan-gh.png)

In the case of this example the chosen interval is one minute. Click save to apply changes.

### Application Testing

Jenkins support a wide array of testing tools for many languages. For Python in particular there are plugins for [nose2](https://github.com/nose-devs/nose2) and [pytest](https://docs.pytest.org/en/latest) but also the standard library `unittest` can be used. You can combine those testing tools with [pylint](http://www.pylint.org/) for trending and report purposes. Is out of the scope of this guide explaining the extended Jenkins capability (plugins) but the supplied example have many test to play with. Since those tests are not integrated to Jenkins report tool (you should install and configure adequate plugins for that) you can review the results through the console output in the Test stage.

### Application Deployment and Distribution.

![Example application uploaded](jenkins-pypi-warehouse.png)

The example used in this guide uploaded the resulting Python application to the PyPi library. Therefore, the distribution of the application is done by means of `pip install` command on any client with an Internet connection. You could use any other distribution method, like Docker. Just by editing the Deploy stage with proper Docker credentials and build instructions is enough to achieve that.

But Jenkins flexibility doesn't end there you could also start a parallel process in the Deploy stage to upload the Python application to PyPi **and** to Docker Hub at the same time.

## The Road Ahead

This guide has covered the basic automation Workflow with Jenkins/Blue Ocean, that's like the tip of the iceberg regarding Jenkins power. There a lot more you can do. Just to mention a few possibilities:

* JUnit plugin has the ability to publish XML formatted test reports (generated by test tools) and integrate those trends and reports into Blue Ocean Dashboard for analysis.
* Besides Jenkins GUI and new Blue Ocean GUI you can work with Jenkins CLI if that suits you best.
* Pipelines have support for custom functions, that can be used for complex data validation, testing, monitoring and more.
* Parallel pipelines can be executed to accelerate certain processes as well as "branch triggering" that runs the pipeline only if a specific branch is checked.
* The `post` (or any other section) can benefit from useful built-in functions like: email notifications, slack notifications and HipChat notifications. As usual you decide what triggers the notifications (a successful build, a failure, a change, a custom condition).
* You can also use different `agent` for specific `stages`, for example one for database tasks, one for compiling code, one for webapp updating, etc.
