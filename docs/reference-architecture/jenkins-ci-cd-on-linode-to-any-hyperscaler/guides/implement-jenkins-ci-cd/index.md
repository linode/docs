---
slug: implement-jenkins-ci-cd
title: "How to Implement Jenkins CI/CD on Linode to Any Hyperscaler"
description: "Jenkins allows you to effectively automate your building, testing, deployment, and more. Its many plugins and its flexible pipeline capabilities make Jenkins exceptional for CI/CD in any context and with any cloud providers. Learn how to implement a Jenkins CI/CD architecture on Linode, capable of builds and deployments to any hyperscaler."
keywords: ['jenkins ci/cd pipeline','jenkins kubernetes deployments','jenkins tutorial']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-04-05
modified_by:
  name: Nathaniel Stickman
external_resources:
  - '[Jenkins Blog: Create a New Jenkins Node, and Run Your Jenkins Agent as a Service](https://www.jenkins.io/blog/2022/12/27/run-jenkins-agent-as-a-service/)'
---

With Jenkins, you can implement a robust continuous integration and continuous delivery (CI/CD) setup for automating application builds, tests, and deployments. Linode's Jenkins CI/CD reference architecture ensures a scalable setup capable of deploying applications to Linode or any of many other hosting providers.

Get started by taking a look at the overview and diagrams for the architecture in our [Jenkins CI/CD on Linode to Any Hyperscaler](/docs/reference-architecture/jenkins-ci-cd-on-linode-to-any-hyperscaler/).

The present tutorial walks you through a complete implementation of our Jenkins CI/CD architecture. Throughout, follow along to provision the base setup and see extensive examples to help you get started using the architecture for your particular needs.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is Jenkins?

[Jenkins](https://www.jenkins.io/) is an open-source tool for automating deployments. Jenkins utilizes build pipelines to allow you to define build, test, and deployment processes. Throughout, you have access to shell commands, a dynamic user interface, and an array of plugins.

All this makes Jenkins an exceptional tool for automating CI/CD workflows. Jenkins handles continuous integration through features like Git repository monitoring, where pipelines can be triggered by Git commits. Jenkins' continuous delivery is supported by its ability to pull repositories and build, test and deploy from them.

Further plugins mean that you can adapt Jenkins to your needs — whether using a particular test suite, storing artifacts, or deploying to cloud providers.

Learn more about CI/CD principles in our guide [Introduction to Continuous Integration and Continuous Deployment](/docs/guides/introduction-ci-cd/).

You can also learn more particulars about automating builds with Jenkins through our guide [How to Automate Builds with Jenkins on Ubuntu 22.04](/docs/guides/automate-builds-with-jenkins-on-ubuntu/).

## How to Provision Jenkins for CI/CD

To start using Jenkins for CI/CD, you need at least a Jenkins server. The Jenkins server runs a dashboard from which you can manage and monitor your instance, and the server also orchestrates your Jenkins pipelines.

Jenkins additionally needs build agents to actually implement the steps given in its pipelines. For moderate needs, Jenkins can actually run one or more agents alongside the server, on the same machine. However, this tutorial covers a more robust implementation, with a suite of machines deployed specifically for running Jenkins build agents.

Follow along with this section of the tutorial to get both the Jenkins server and Jenkins build agents running. See how to install and start running the server on your current machine, and how to use Terraform to deploy your build agents automatically.

### Creating the Jenkins Server

You need to start by installing Jenkins on a central server. This central Jenkins server then gives you access to the Jenkins dashboard, where you can manage everything from build agents to pipelines to plugins.

1. Install Java 11. You can do so through the OpenJDK package. For this tutorial, you just need the Java runtime (JRE), not the development kit.

    - On Debian and Ubuntu:

        ```command
        sudo apt install openjdk-11-jre
        ```

    - On CentOS and Fedora:

        ```command
        sudo dnf install java-11-openjdk
        ```

1. Install Jenkins. First, you need to add the Jenkins repository to your system's package manager. Then, after updating the package manager, you can install Jenkins directly from there.

    - On Debian and Ubuntu:

        ```command
        wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
        sudo sh -c 'echo deb http://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
        sudo apt update
        sudo apt install jenkins
        ```

    - On CentOS and Fedora:

        ```command
        sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
        sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
        sudo dnf upgrade
        sudo dnf install jenkins
        sudo systemctl daemon-reload
        ```

1. Start the Jenkins service if it is not already started, and enable the service for system startup.

    ```command
    sudo systemctl start jenkins
    sudo systemctl enable jenkins
    ```

1. In a web browser, navigate to port `8080` on your system's public IP address. You may first need to open the port in your system's firewall, which you can learn how to do from our guide on [securing a Linode Compute instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall).

1. Follow the installation steps you are presented with. Select to **Install suggested plugins**, and complete the form to create an initial administrator user.

At this point, you have a Jenkins server up and running and ready to start using. In fact, the Jenkins server includes a built-in build agent, which you could configure to use for building, testing, and deploying.

### Creating Jenkins Build Agents

While your Jenkins server is capable of running build pipelines, your setup becomes more scalable when you leverage separate build agents. With the architecture covered in this tutorial, your central Jenkins server is dedicated to managing your CI/CD configurations. Pipeline tasks are then handled by dedicated build agents.

Dedicated agents give you a more scalable setup as well as more adaptability for a wider range of build and deployment needs.

Follow along here to deploy a set of three build agents for the Jenkins server setup above. These steps use [Terraform](https://www.terraform.io/) to deploy the agent instances, making it relatively easy and convenient to horizontally scale your agents.

#### Configure Agents within Jenkins

To start, you need to configure your Jenkins server to enable the agents and facilitate their connections to the server.

1. Open port `8081` on the system running your Jenkins server. Refer to the link above for securing compute instances to see how to open ports on your system.

1. Within Jenkins, enable TCP port usage for agents. To do so, open the Jenkins web interface, and navigate to **Manage Jenkins** > **Configure Global Security**. Under **Agents**, locate the **TCP port for inbound agents** setting, and set it to *Fixed*. Give `8081` as the port.

1. Create each of the agents from within the Jenkins dashboard. For each, navigate to **Manage Jenkins** > **Manage Nodes and Clouds**. Select the **New Node** button, and complete the agent configurations with the settings here.

    This tutorial starts you off with three agents. So to follow along be sure to create three agents using this configuration.

    - **Node name**: `docker-node-agent-1`, `docker-node-agent-2`, and then `docker-node-agent-3`

    - **Type**: *Permanent*

    - **Number of executors**: 1

    - **Remote root directory**: `/home/jenkins`

    - **Labels**: `docker-node-agent-instances`

    - **Usage**: *Use this node as much as possible*

    - **Launch method**: *Launch agent by connecting it to the controller*

    - **Availability**: *Keep this agent online as much as possible*

    The `docker-node` naming can later help to distinguish these agents as ones with Docker and Node.js installed. The label field adds a tag to each agent, providing a convenient way to designate specific sets of agent for executing pipelines.

    [![Example Jenkins configuration for an agent](jenkins-config-agent_small.png)](jenkins-config-agent.png)

1. Disable the built-in agent node. Navigate to **Manage Jenkins** > **Nodes** > **Built-In Node**. Choose **Configure**, and set the **Number of executors** to `0`.

#### Provision Agent Instances

Now you have what you need to support three build agents. This tutorial deploys a Linode Compute instance for each of these build agents, using Terraform to automate the process. This also makes it relatively easy to horizontally scale the number of agents as needed later.

{{< note >}}
The Terraform script here requires credentials for your Linode Object Storage instance. This is so that the script can automatically prepare the agents with configurations for leveraging object storage later.

For this reason, you should complete the section further below on [Provisioning Linode Object Storage](/docs/reference-architecture/jenkins-ci-cd-on-linode-to-any-hyperscaler/guides/implement-jenkins-ci-cd/#provisioning-linode-object-storage) before proceeding.
{{< /note >}}

{{< caution >}}
The configurations and commands used in this guide add multiple Linode instances to your account. Be sure to monitor your account closely in the Linode Cloud Manager to avoid unwanted charges.
{{< /caution >}}

1. Install Terraform. Follow the relevant section of our [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) guide to do so.

1. Download our Terraform package for deploying Jenkins build agents [here](jenkins-agents-terraform.zip). This includes scripts for deploying a set of Linode Compute instances, each running Ubuntu, Docker, Node.js, and a Jenkins agent service.

1. Extract the package's contents, and change into the resulting directory. You may first need to install the unzip utility, which you can generally do through your system's package manager.

    ```command
    unzip jekins-agents-terraform.zip
    cd jenkins-agents-terraform/
    ```

1. Open the `terraform.tfvars` file, and customize the variables there to your setup. Specifically, you need to provide:

    - A Linode personal access token, which you can learn about in our guide  [Linode API - Get Started](/docs/products/tools/api/get-started/#get-an-access-token)

    - A root password to be used for the deployed instances

    - One or more SSH public keys for SSH access into the instances

    - A number of instances to deploy; this tutorial uses three instances

    - The URL for your Jenkins server, including the protocol and port, as in: `https://jenkins.example.com:8080`

    - A list of secrets corresponding to each of your Jenkins agents; these are given after you create each agent within the Jenkins web interface

    - The access and secret keys for your Linode Object Storage instance

    - The region designation for your Linode Object Storage instance

    The information for your Linode Object Storage instance you can get by following the section on provisioning object storage further on.

1. From within the directory with the `main.tf` file, run the following command to initialize the Terraform project and start deploying the instances.

    ```command
    terraform init
    terraform apply
    ```

This runs the `main.tf` script, which provisions the agents. The script additionally delivers and executes a shell script on each instance, which you can see as `scripts/initial_setup.sh`. That script does most of the set-up work, specifically the following:

- Updates and secures the system, including enabling the firewall

- Installs Docker, Node.js, rclone, and kubectl

- Installs Java 11, and sets up the Jenkins user

- Creates a script for downloading and running the Jenkins agent from the Jenkins server

- Creates and starts up a service to run the Jenkins agent

### Provisioning a Hyperscaler

The architecture covered here aims to use Jenkins to build an application and deploy it to a hyperscaler. To follow through with the examples provided here, you should thus have a target cloud you want your application deployed to.

Because this tutorial builds its example application into a Docker image, it makes sense to deploy the application to a Kubernetes cluster. This is what the example pipeline and Jenkins configuration in the rest of this tutorial do.

You can most readily follow along with the tutorial by deploying a Linode Kubernetes Engine (LKE) cluster. Learn how in our [Linode Kubernetes Engine - Get Started](/docs/products/compute/kubernetes/get-started/).

However, the "Deploy" step in the pipeline elaborated below uses kubectl. This means that the setup can readily be adapted to deployments for almost any cloud Kubernetes provide.

And in fact you can adapt the commands in the "Deploy" portion of the pipeline for deployments to whatever cloud platform you need. Whatever you would normally use to script the deployment you can implement here. Or you could leverage one of the plugins you can find within the Jenkins dashboard, which you can see examples of further on.

#### Preparing a Docker Registry

Because this tutorial uses Kubernetes for its deployment, you need to have a Docker registry. This allows you to push built Docker images from the Jenkins agents and pull them onto the Kubernetes cluster.

The easiest solution here is [Docker Hub](https://hub.docker.com/), where you can add images after registering an account. Learn more, with a full-functioning example, in our guide [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/guides/deploy-container-image-to-kubernetes/).

You can also self-host a registry solution. One such solution is [Harbor](https://goharbor.io/), and you can deploy your own Harbor server readily through the Linode Marketplace. See our guide [Deploy Harbor through the Linode Marketplace](/docs/products/tools/marketplace/guides/harbor/) to see how.

Whatever solution you choose, you need later to provide the registry's path to the Jenkins pipeline.

- For Docker Hub, the path is your Docker Hub username; for instance, `example-docker-hub-user`

- For self-hosted solutions like Harbor, the path is the URL (minus the protocol); for Harbor, this might look like `harbor.example.com/library`

### Provisioning Linode Object Storage

Part of the architecture covered in this tutorial has logs and build artifacts stored on Linode Object Storage. Setting this up is optional — you can skip the related portions of the tutorial and remove or adjust the "Package" section of the pipeline. But object storage does provide an efficient and accessible way to backup artifacts from you CI/CD pipelines.

To start, you need to have a Linode Object Storage bucket prepared to store your logs and artifacts. Follow our [Object Storage - Get Started](/docs/products/storage/object-storage/get-started/) guide to do so.

The rest of this tutorial assumes that you have provisioned a Linode Object Storage bucket and generated an access key. You need to save both the access key and secret access key for use later.

You also need to have your bucket's region designation, which is given beside the region name. For instance, if you chose the *Atlanta* region, your region designation would be `us-southeast-1`.

### Securing the Jenkins Instances

Each Jenkins instance, from the server to the agents, uses a system firewall. However, you can further safeguard and manage traffic on these instances by adding Linode Cloud Firewalls for each.

To get started, see our guide [Create a Cloud Firewall](/docs/products/networking/cloud-firewall/guides/create-a-cloud-firewall/). Then follow our [Manage Firewall Rules](/docs/products/networking/cloud-firewall/guides/manage-firewall-rules/) to add the individual rules you need.

The following is a basic example setup that you can expand on.

1. Create a `jenkins-server-firewall`. Select the Jenkins server instance as the **Linode** for this firewall, and give the firewall the following rules.

    - `accept-inbound-SSH`: Use the *SSH* rule preset

    - `accept-inbound-web-interface`: Use the *TCP* protocol, with a custom port of `8080`, and sources from *All IPv4, All IPv6* addresses

    - `accept-inbound-agents`: Use the *TCP* protocol, with a custom port of `8081`, and sources from *All IPv4, All IPv6* addresses

    - Set the **Default inbound policy** to *Drop*

    - Set the **Default outbound policy** to *Accept*

1. Create a `jenkins-agent-firewall`. Select each of the Jenkins agent instances as the **Linode** options for this firewall, and give the firewall the following rules.

    - `accept-inbound-SSH`: Use the *SSH* rule preset

    - Set the **Default inbound policy** to *Drop*

    - Set the **Default outbound policy** to *Accept*

## How to Use Jenkins CI/CD

All of the above sets you up with Jenkins and resources for it to deploy and store artifacts to. But how you go about setting up a Jenkins pipeline and deploying a project with it varies widely from project to project.

This section aims to give you a thorough example, with a basic functioning application using Node.js and Docker. Though your setup may not be the same, the example covers a wide ground to help you more readily learn and build from it.

### Setting Up a Project

To demonstrate Jenkins's deployment pipeline, you should set up a project to build and deploy. This tutorial includes a basic application, along with a Docker definition, to test your Jenkins setup with.

You can download a package with the example application [here](jenkins-example-app.zip). This example project includes the following.

- A Node.js application for a simple RESTful service

- A Dockerfile to later create a Docker image

- A Jenkinsfile defining the project's pipeline

- A Kubernetes deployment file for deploying the application to a cluster

Go ahead now and extract the package and change into the resulting directory.

```command
unzip jenkins-example-application.zip
cd jenkins-example-application/
```

The steps in this tutorial do not require you to run the application locally. But if you want to try it out before going forward, you need to install Docker and run the following commands. You can find the results on your system's port `3000`.

```command
docker build -t example-app-image .
docker run -p 3000:3000 example-app-image
```

#### Starting a Repository

Jenkins shines when connected to a project on a version control repository. One of Jenkins more powerful features is its ability to watch for changes in a repository and automatically run the relevant pipeline. So for this tutorial you need to check the example application into a Git repository, and you can follow along here to do that.

1. Create a Git repository on a remote source. This can be whatever Git provider you want, but here are two useful examples.

    - GitHub. Perhaps the most popular solution. You can learn more in our guide [Getting Started with GitHub](/docs/guides/a-beginners-guide-to-github/).

    - GitLab. A similar solution to GitHub, but with a potential for self-hosted repositories. Learn more about self-hosting a GitLab instance through our guides [Deploy Gitlab through the Linode Marketplace](/docs/products/tools/marketplace/guides/gitlab/) and [Install GitLab with Docker](/docs/guides/install-gitlab-with-docker/).

    Whichever option you choose, you should additionally set up an access token with the ability to read and write to the repository.

    - For GitHub, see this [GitHub documentation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

    - For GitLab, see this [GitLab documentation](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

1. Initialize a Git project within the application directory. You first need to have Git installed, which you can generally do from your system's package manager.

    Replace `GIT_USER` with your username for the remote repository, and replace `GIT_TOKEN` with your token for that repository. Replace `REMOTE_REPO_URL` with the remote repository's URL.

    ```command
    git init
    git add -A
    git commit -m "Initial commit."
    git branch -M main
    git remote add origin https://GIT_USER:GIT_TOKEN@REMOTE_REPO_URL
    git push -u origin main
    ```

Your example project is now ready for use with the Jenkins CI/CD setup. Keep hold of the `https://GIT_USER:GIT_TOKEN@REMOTE_REPO_URL` address, as you need to use it again within the Jenkins server interface.

#### Setting Up the Pipeline

Jenkins provides two main ways of configuring pipelines.

- Within the Jenkins interface, whenever you add the pipeline item further on in this tutorial

- Within a `Jenkinsfile` on a remote repository

For convenience, this tutorial opts to use a `Jenkinsfile` included within the project repository. This file comes with a full pipeline script fit for the needs of this tutorial. You can review the script yourself, but, in summary, it provides the five stages outlined here.

- *Build*, where the application's Docker images is built and the Node.js dependencies installed for code analysis

- *Test*, where the Docker image is run and a shell script implements two simple test cases

- *Code Analysis*, where the [ESLint](https://eslint.org/) tool runs a standard JavaScript static code analysis

- *Package*, where artifacts are prepared and stored on Linode Object Storage

- *Deploy*, where a kubectl command deploys the built Docker image to the Kubernetes cluster

The example pipeline uses ESLint for a simple JavaScript code analysis, but there are more options to choose from depending on your codebase and needs. You can learn more about code analysis tools in our guide [What is Static Code Analysis?](/docs/guides/what-is-static-code-analysis/).

Before going on, you need to specify a few variables in the `Jenkinsfile`. These variables are assigned within the `environment` block near the top of the pipeline file.

- `DOCKER_REGISTRY` should correspond to the URL of your Docker registry, as discussed further above

- `LINODE_S3_BUCKET` should correspond to the name of the object storage bucket you created for your Jenkins artifacts; this tutorial uses `jenkins-artifact-bucket` as an example

- `SLACK_CHANNEL` should correspond to an existing Slack channel to which you want Jenkins to send pipeline progress messages

The Slack implementation is optional, and if you are not planning to implement Slack messaging you should go through and remove the `slackSend` lines within the `Jenkinsfile`. You may instead want to replace these with another messaging task or simple `echo` commands to post output to the Jenkins log.

### Configuring the Jenkins Server

From here, the project needs to be added into Jenkins. Along with the project, you need to add the Jenkins plugins used in the pipeline, as well as the particular configurations to match your needs.

#### Adding the Jenkins Pipeline

The project gets added to Jenkins as a pipeline item, which you can create from the Jenkins dashboard using the steps here. These steps include configuring the project in Jenkins as well, setting up Jenkins to monitor the Git repository.

1. Within the Jenkins interface, select the **New Item** option. Jenkins presents a form, where you can enter a name for the project and should select the **Pipeline** option. This tutorial names the project `jenkins-example-app`.

1. This directs you to the project configuration form. Complete this form as follows, leaving any unmentioned options at their default values.

    - Select **GitHub project**, whether you used GitHub or GitLab. In the resulting **Project url** field, enter your remote repository's URL, as shown in the project set up steps above as `https://GIT_USER:GIT_TOKEN@REMOTE_REPO_URL`.

    - Select one of the push trigger options.

        - For GitHub projects, use the **GitHub hook trigger for GITScm polling** option.

        - For GitLab projects, use the **Build when a change is pushed to GitLab** option. Complete the resulting fields to your liking, but you should at least select **Push events**.

            Make note of the **GitLab webhook URL** here, as you need to input it in your GitLab setup, as discussed below.

    - Under **Pipeline** > **Definition**, select *Pipeline script from SCM*. Complete the resulting fields as shown here.

        - Select the *Git* option for **SCM**.

        - For **Repository URL**, enter the full URL for your project's remote repository, as above: `https://GIT_USER:GIT_TOKEN@REMOTE_REPO_URL`.

        - Enter `main` for **Branches to build**.

        - As the **Repository browser**, choose *githubweb* for GitHub and *gitlab* for GitLab.

        - For the **Repository browser** > **URL** field, enter the remote repository directory URL. Following the examples above, this would be `https://REMOTE_REPO_URL` without the ending `.git`.

        - Enter `Jenkinsfile` for the **Script path**.

1. If you are using GitLab, you need to provide your GitLab project with the webhook URL from Jenkins, as noted above. Navigate to your GitLab project page, select **Settings** > **Integrations**, and search for *Jenkins*. In the form for this integration:

    - Select the **Push** trigger

    - Enter the webhook URL from Jenkins in the **Jenkins server URL** field

    - Enter your Jenkins project name, as shown in the URL, in the **Project name** field

    - Provide the username and password for a Jenkins user with access to the project

![Example of the first few fields for configuring a project in Jenkins](jenkins-config-project.png)

#### Adding the Plugins and Credentials to Jenkins

Jenkins has a host of available plugins that can support a wide range of pipeline tasks. All of these plugins can be added to your Jenkins instance from **Manage Jenkins** > **Plugin Manager** > **Available Plugins**.

The example pipeline used in this tutorial leverages three such plugins, which you can add using the steps here. And you can use a similar set of steps for any other plugins you want to add.

These steps also include credential configuration for the plugins and commands from the pipeline to interface with the necessary resources.

- Install the [Kubernetes CLI](https://plugins.jenkins.io/kubernetes-cli/) plugin by searching for it on the **Available Plugins** page. Then complete the following steps to configure the plugin.

    1. Within the Jenkins interface, navigate to **Manage Jenkins** > **Manage Credentials** > **System** > **Global credentials**. Select the **Add Credentials** button.

    1. Complete the resulting form as described here.

        - For **Kind**, select *Secret file*

        - For **File**, use the file browser to select a downloaded copy of your kubeconfig file

        - For **ID**, give a name for the credentials; this tutorial uses `jenkins-example-lke`

- Add credentials for the Docker registry. Within the Jenkins interface, navigate to **Manage Jenkins** > **Manage Credentials** > **System** > **Global credentials**. Select the **Add Credentials** button. Complete the resulting form as described here.

    - For **Kind**, select *Username with password*

    - Enter your registry username and password in the relevant fields

    - For **ID**, give a name for the credentials; this tutorial uses `jenkins-example-docker`

- Install the [Warnings Next Generation](https://plugins.jenkins.io/warnings-ng/) plugin by searching for it on the **Available Plugins** page.

    This plugin does not require any additional set up for this tutorial. The pipeline leverages this plugin with its `recordIssues` command, which tells the plugin to look for the `eslint.xml` file. *Warnings Next Generation* parses the CheckStyle file output from ESLint and presents the results within a **CheckStyle Warnings** option on the project page.

- Install the [Slack Notifications](https://plugins.jenkins.io/slack/) plugin by searching for it on the **Available Plugins** page. Then complete the following steps to configure the plugin.

    1. Navigate to the [Slack API](https://api.slack.com/) page, and select the **Create App** button. Sign into Slack, select your workspace, and choose to create an application from scratch. Finally, name your application.

    1. This takes you to a page for the Slack application. Select **OAuth & Permissions** from the left menu, and under the **Bot Token Scopes** section of the next page select **Add an OAuth Scope**. Choose the *chat:write* option and then the *chat:write.public* option. These allow your Slack application to send messages.

    1. From the left menu, select **Install App**, and then use the **Install to Workspace** button to deploy the Slack application.

        You should be shown an OAuth token, which you need to enter into Jenkins in the next step. You can access this token again by visiting the Slack application's **Install App** page again.

    1. Within the Jenkins interface, navigate to **Manage Jenkins** > **Manage Credentials** > **System** > **Global credentials**. Select the **Add Credentials** button. Complete the resulting form as described here.

        - For **Kind**, select *Secret text*

        - For **Secret**, paste or enter the Slack application token from above

        - For **ID**, give a name for the credentials; this tutorial uses `jenkins-example-slack`

    1. Navigate to **Manage Jenkins** > **Configure System**, and find the **Slack** section. Complete the form in this section as follows.

        - For **Workspace**, enter the workspace name portion of your Slack URL

        - For **Credential**, select the credential created above, `jenkins-example-slack`

### Running the Pipeline

Everything is now in place to run the Jenkins CI/CD pipeline on the example project. You can do this manually within Jenkins by navigating to the project's page and selecting the **Build Now** option.

However, you can also trigger the build by making a Git push to the `main` branch on the example project's repository. This is the most illustrative example, as it is likely to be what triggers your builds most of the time.

To trigger the build from Git, you can use commands like the following. This adds changes within the project to a commit and pushes the commit to the `main` branch.

```command
git add .
git commit -m "Adjustments to the Jenkins pipeline."
git push -u origin main
```

You can follow along with the build's progress from the project's page in Jenkins. Selecting the entry for the build itself, you can also choose the **Console Output** option to see the pipeline in detail.

[![Example output from a Jenkins pipeline execution](jenkins-pipeline-output_small.png)](jenkins-pipeline-output.png)

Once deployment has finished, you can access the **CheckStyle Warnings** option from the project's page to see the results of the static code analysis.

![Example output from the code analysis portion of the Jenkins pipeline](jenkins-pipeline-checkstyle.png)

Navigating to your Slack workspace, you should see messages from the Jenkins bot in the appropriate channel. The example pipeline has Jenkins send messages to the `#jenkins-cicd-testing` channel, giving the status as each stage in the pipeline completes.

![Notifications on the Jenkins pipeline's progress posted to a Slack channel](slack-jenkins-bot.png)

Finally, to see the deployed example application in action, you can forward the port on the Kubernetes cluster. With kubectl installed, use the following command from your Jenkins server to make the application's service available on port `3000`.

```command
kubectl port-forward service/example-app-service 3000:3000 --address='0.0.0.0'
```

{{< note >}}
You may first need to allow inbound TCP traffic on port `3000` before you can test the deployed example application in this manner.
{{< /note >}}

Then, navigate to that port on the server's public IP address to see the output. For instance, if your server's IP address is `192.0.2.0`, navigating to `http://192.0.2.0:3000` should get you this.

```output
{"message":"Hello, World!"}
```

And navigating to `http://192.0.2.0:3000/Jenkins%20User` should get you this.

```output
{"message":"Hello, Jenkins User!"}
```

## Conclusion

This covers a full example and model for implementing the Jenkins CI/CD reference architecture.

Numerous features are likely to vary for your particular setup. Your build, for example, may employ a static-site generator and deploy the built static site to Linode Object Storage. Or you may be using a language like Java and want a different code analysis tool, like SonarQube.

But whatever the case, this tutorial gives you a set of implementation examples and tools that are sure to get you well on your way. Adapt the Terraform script and example pipeline, find the right Jenkins plugins, and the rest should follow readily from what has been covered here.
