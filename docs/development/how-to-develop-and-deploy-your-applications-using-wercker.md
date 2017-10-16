---
author:
  name: Linode Community
  email: docs@linode.com
description: 'DESCRIPTION.'
keywords: 'wercker,docker,development'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Tuesday, April 4th, 2017'
modified: 'Tuesday, April 4th, 2017'
modified_by:
  name: Linode
title: 'How to develop and deploy your applications using Wercker'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Wercker Developer Documentation](http://devcenter.wercker.com/docs/home)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $300 per published guide.*
<hr>

Wercker is an automation software that aims to improve the Continuous-Integration and Continuous-Delivery (CI/CD) process of developers and organizations.The main goal of this guide is to highlight Wercker importance as part of DevOps toolchain.

## Before You Begin

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services.

    This guide will use `sudo` wherever possible.

3.  Update your packages:

        sudo apt update && sudo apt upgrade

4. This guide requires Docker installed in your Linode, for detailed instructions please read [How to Install Docker and pull images for container deployment.](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment)

## Workflow basic assumptions

For pedagogical purposes, this guide will use the most simple developing paradigm:
* Pull & Push Version Control.
* Build - Test - Release philosophy.

Some assumptions are being made:

- You have a GitHub account (similar procedures should work on Bitbucket and any git variant).
- You have a Docker account (other services might work with minor changes).
- You have `Go` installed and configured locally (you can use any programming language of your choice, but the examples are written in Go).
- The examples used are very simple, just for learning purposes.
- Your workstation is running Ubuntu 16.04.

## Setup application version control

Install `git` in your local workstation:

        sudo apt install git

For the purpose of this guide, you'll need to fork three repositories in GitHub:

* [jClocksGMT](https://github.com/mcmastermind/jClocksGMT) a very basic jQuery collection of digital and analog clocks.
* [golang/example](https://github.com/golang/example) a minimal set of `Go` examples made by `golang` Project.
* [Getting Started golang](https://github.com/wercker/getting-started-golang) a sample `Go` application for Wercker.

Clone your forks locally:

        git clone https://github.com/<GITHUB_USER>/jClocksGMT.git
        git clone https://github.com/<GITHUB_USER>/example.git
        git clone https://github.com/<GITHUB_USER>/getting-started-golang.git

That's it, all examples are set for versioning.

{: .note}
>
>You will need `Go` properly registered in the $PATH, for simplification purposes directory structure conventions are not being used.

## Setting-up Wercker account

Next step is to Sign Up a free Wercker account.

![Wercker Main Page](/docs/assets/wercker-main.png)

The easiest way to register is using your GitHub account.

![Wercker Registration](/docs/assets/wercker-registration.png)

Once finished the Wercker Dashboard will show up. Now you are ready to start creating your applications, but before jumping into that first you will need to properly configure each one.

## Configuring wercker.yml

One of the main advantages of Wercker is its simplicity. You only need one configuration file: `wercker.yml`. That file describes your automation **pipelines** through one or more **steps**. You can think of steps as the "call to action processes" and pipelines as the collection of one or more steps.

### jClocksGMT example

Create your `wercker.yml` file in the root of `jClocksGMT` example:

{: .file}
/path/to/jClocksGMT/wercker.yml
:   ~~~ yml
box: debian
# Build definition
build:
  # The steps that will be executed on build
  steps:
    # Installs openssh client and server.
    - install-packages:
        packages: openssh-client openssh-server
    # Adds Linode server to the list of known hosts.
    - add-to-known_hosts:
            hostname: 45.79.208.239
            local: true
    # Adds the Wercker SSH key.
    - add-ssh-key:
            keyname: linode    
    # Custom code to be executed on remote Linode
    - script:
        name: Update code on remote Linode
        code: |
          ssh root@<Linode IP or hostname> git -C ~/jClocksGMT pull
~~~

`box`: Defines the Docker image to be used. In this case a global "debian" image is called.
`install-packages`: this step is a shortcut to `apt-get install`, all packages listed will be installed in your container.
`add-to-known_hosts`: this is a self-explanatory step that add our Linode IP or Domain to the known hosts file.
`add-ssh-key`: this step adds the Wercker generated Public SSH key to your container.
`script`: scripts are custom steps that can execute almost any command, in this case on your remote Linode.

If you study the file will notice that is very easy to understand each action:

1. A Debian image is loaded in the container.
2. The necessary packages `openssh-client` and `openssh-server` are installed.
3. The SSH connection between the Wercker container and your Linode is setup.
4. Now the Debian container runs a `git pull` command on your remote Linode.

In other words, the `build` pipeline updates your remote Linode repository where the project resides. For simplicity the repository is located in the `home` directory.

### Hello example

Go to the root folder of your `example` fork and copy the `hello.go` file there:

        cp ./hello/hello.go .

Next create the `wercker.yml` file on the same root folder:

{: .file}
/path/to/example/wercker.yml
:   ~~~ yml
box: google/golang

build:

    steps:
    # Sets the go workspace and places you package
    # at the right place in the workspace tree
    - setup-go-workspace

    # Build the project
    - script:
        name: Build application
        code: |
            go get github.com/<user>/example
            go build -o myapp

    - script:
        name: Copy binary
        code: |
          cp myapp "$WERCKER_OUTPUT_DIR"

### Docker Deployment
deploy:

    #This deploys to DockerHub
    steps:
    - internal/docker-scratch-push:
        username: $DOCKER_USERNAME
        password: $DOCKER_PASSWORD
        repository: <docker-username>/myapp

### Linode Deployment from Docker
linode:

    steps:
    # Installs openssh client and other dependencies.
    - install-packages:
        packages: openssh-client openssh-server
    # Adds Linode server to the list of known hosts.
    - add-to-known_hosts:
        hostname: 45.79.217.99
        local: true
    # Adds SSH key created by Wercker
    - add-ssh-key:
        keyname: linode
    # Custom code to pull image
    - script:
        name: pull latest image
        code: |
            ssh root@45.79.217.99 docker rmi -f <docker-username>/myapp:current
            ssh root@45.79.217.99 docker pull <docker-username>/myapp:latest          
            ssh root@45.79.217.99 docker tag <docker-username>/myapp:latest damasosanoja/myapp:current
            ssh root@45.79.217.99 docker rmi <docker-username>/myapp:latest
            ~~~

This configuration file is more complex than the last one. As you can notice there are three pipelines:

1. `build`: the obligatory pipeline that is used in this case to build your application. Since this second example uses a `Go` language the most convenient `box` is the official `google/golang` that comes with all necessary toolbox configured. The steps performed by this pipeline are:
- `setup-go-workspace`: prepares your `Go` environment.
- `Build application`: runs the actual building process for your sample application named `myapp`. The application is saved in the corresponding workspace.
- `Copy binary`: remember that you are working on a temporally pipeline, this step saves your application binary as a predefined environmental variable called `$WERCKER_OUTPUT_DIR` that way you can use it on the next pipeline.

2. `deploy`: this pipeline will take your binary from `$WERCKER_OUTPUT_DIR` and then push it to your Docker account.
- `internal/docker-scratch-push`: this special step makes all the magic, using the environmental variables `$DOCKER_USERNAME` and `$DOCKER_PASSWORD` saves your binary to a light-weight `scratch` image. The `repository` parameter specifies the desired Docker repository to use.

3. `linode`: the fist three steps, `install-packages`, `add-to-known_hosts` and `add-ssh-key` were explained in the previous example, they are responsible for the SSH communication between your pipeline's container and your Linode. The custom script `pull latest image` is actually more interesting to analyze:
- The first line remotely erases your previous image tagged "current".
- Second line pulls (from Docker Hub) your most recent image build. By default this image is tagged "latest" unless specified otherwise.
- Third line clones your latest image and tag it "current".
- Four line removes the pulled image tagged "latest" in preparation for your next update.
That is one simple way to have a "current" application running all the time. Remember this is only an example you can define your own process.

What this second example does is "Dockerize" your application and then save it on your Linode.

{: .note}
>
>This example uses a very basic application, remember that statically building your application could be needed in real life production.

### Getting Started golang example

The last example will introduce you a special development tool called **The Wercker CLI**. This this tool requires the local installation of Docker, you can use the same guide as for your Linode [here](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment) but also requires the "Docker-machine" that can be installed using the following command:

        curl -L https://github.com/docker/machine/releases/download/v0.12.2/docker-machine-`uname -s`-`uname -m` >/tmp/docker-machine && chmod +x /tmp/docker-machine && sudo cp /tmp/docker-machine /usr/local/bin/docker-machine

Now go to your fork root directory:

        cd /path/of/your/getting-started-golang

You will notice that a `wercker.yml` file is already present:

{: .file}
/path/to/getting-started-golang/wercker.yml
:   ~~~ yml
box:
id: golang
ports:
  - "5000"

dev:
steps:
  - internal/watch:
      code: |
        go build ./...
        ./source
      reload: true

# Build definition
build:
# The steps that will be executed on build
steps:

  # golint step!
  - wercker/golint
  ~~~

Only two pipelines are present: `dev` and `build`. Please notice that in this example the port 5000 is exposed.

`dev`: this is an special type of pipeline, that can only be used locally, and serves the purpose of application testing.
- `internal/watch` this step is watching for source code changes, and if any occurs then builds your application again (reload: true). This is very useful for debugging processes.
- `build`: this was usually your first step for building your application. But now you can use it to check your code for any errors during the `build` step (wercker/golint).

The resulting application `getting-started-golang` will serve a basic web page on port 5000 listing five cities. We'll return to this shortly.

Up to this point you have three different projects configured for automation. Now is time to start checking the true power of Wercker.


## Adding your applications to Wercker

As the name implies, Wercker applications correspond to each of your projects. Because of its versioning scheme, you can think of each application as a specific working repository. Let's register your three forked repositories, first click in the "plus" button upper right:

![Application creation](/docs/assets/wercker-app-button.jpg)

Now select the first example repository: <GITHUB_USER>/jClocksGMT, and click the button.

![Choose repository](/docs/assets/wercker-choose-repository.png)

The next step is to configure the access to your repository, for most cases the recommended option is the best unless you use submodules.

![Configure access](/docs/assets/wercker-conf-access.jpg)

Finally you can choose if your application is private (default) or public. Mark the example as public and click the Finish button.

A greeting message indicates you are almost ready to start building your application and offers the option to start a wizard to help you create the application `wercker.yml` file, but that won't be necessary because you already did that in the previous section.

![YML Wizard](/docs/assets/wercker-yml-wizard.jpg)

Repeat the same procedure for the other two example projects.

### Setting-up your application in Wercker

If you remember your configuration files, you have several environmental variables to setup. For the first example you need a SSH key pair for communication with your Linode. Click on the "Environment" tab:

![jClocksGMT variables](/docs/assets/wercker-global-environment-variables.jpg)

Now click on "Generate SSH Keys", a pop-up window will appear asking for a key name (you need to use the same name present on your `wercker.yml` file: "linode") it also asks for RSA encryption level, choose 4096 bit:

![jClocksGMT SSH Keys](/docs/assets/wercker-ssh-key-creation.jpg)

That's it, you generated a key pair: `linode_PUBLIC` and `linode_PRIVATE`. The suffix is automatically added and is not needed in the configuration file. Now it's time to copy the Public key into your Linode. There're several ways to do it but for this guide we'll save it locally (for convenience) and then copy it to your remote server:

        cat ~/.ssh/jclock.pub | ssh root@<Linode IP or hostname> "mkdir -p ~/.ssh && cat >>  ~/.ssh/authorized_keys"

{: .note}
>
>Environmental variables created in this section are available within all pipelines, they are global.

Your first example is ready to be deployed, the application is configured on Wercker and your local repository contains the `wercker.yml` file explaining the steps to be executed. To trigger the automation you just need to commit your changes and watch then working on Wercker's Runs tab. From your jClocksGMT root run the command:

        git add . && git commit -m "initial commit" && git push origin master

An animation will show each step progress, allowing you to debug any problem. On purpose a critical error was triggered:

![jClocksGMT build error](/docs/assets/wercker-jclocks-error-01.jpg)

The hint says "Update code on remote Linode failed" click on the build pipeline for more information:

![jClocksGMT build error](/docs/assets/wercker-jclocks-error-02.jpg)

As you can see everything went perfect until the step "Update code on remote Linode" this is due to the fact the repository was not cloned on the remote Linode on first place. Correct the inconvenient cloning your repository to appropriate location. There is no need to make another commit on the same screen click the "Retry" button:

![jClocksGMT build error](/docs/assets/wercker-jclocks-retry.jpg)

And now your remote Linode repository is updated. This basic example can be useful for many scenarios. If you are hosting a static website you can configure Wercker for updating your remote server each time you commit a change (an article) taking from you the manual work of doing so.

Moving on to our next example go to "example" application. Click on "Workflows" tab. The Editor will show a single pipeline `build` created automatically by Wercker and nothing else. It's time to create the rest of your pipelines, click on "Add new pipeline" button:

![Add pipeline](/docs/assets/wercker-add-pipeline.jpg)

Fill in the fields as follows:

- Name: you can use any name to describe your pipeline, for this example `deploy-docker` and `deploy-linode` will be used.
- YML Pipeline name: is the name declared in the `wercker.yml` file. You need to fill in with `deploy` and `linode` respectively.
- Hook type: we will use the default behavior which is to "chain" this pipeline to another. You can select "Git push" when you want to run different pipelines in parallel each time a push is commited.

Once you configure your pipelines you can start chaining them. Click on the "Plus button" right of `build` pipeline:

![Chain pipeline](/docs/assets/wercker-chain-pipeline.jpg)

You have the option to define an specific branch (or branches) to trigger the pipeline. By default Wercker will monitor all branches and start executing the steps if any commit is made, this is the case for our example. Select `deploy-docker` in the drop-down list and then click Add. Repeat this procedure to chain `deploy-linode` after this pipeline. The end result will look similar to this:

![Workflow screen](/docs/assets/wercker-workflow-01.jpg)

Next you need to define the environmental variables, but this time you will do it inside each pipeline and not globally. Still on Workflows tab click on `deploy-docker` pipeline at the botton of the screen. Here you can create the variables. From the configuration file, this pipeline uses two variables: `DOCKER_USERNAME` and `DOCKER_PASSWORD`. Create them and don't forget to mark the password as "protected". Now head to `deploy-linode` pipeline and create the SSH key pair similar to the last example. Remember to copy the Public key to your remote server as well.

Everything is set. Test your workflow by committing `wercker.yml` file, from your local fork root directory run:

        git add . && git commit -m "initial commit" && git push origin master

You will end up with a result similar to:

![example workflow](/docs/assets/wercker-example-final.jpg)

You can test your application on the remote server by login remotely and run `docker images`:

![Docker images](/docs/assets/wercker-hello-images.jpg)

Notice that only "current" is present, now run the application with the command:

        docker run <docker-username>/myapp:current

If you want to test your automation a bit further, edit your `hello.go` inside the `/example` folder. Add some text to the message (remember is reversed). Commit your changes and wait for the process to end. Run again your application, you should see the modified message:

![Changed text](/docs/assets/wercker-hello-run-02.jpg)

As you can see is working as expected. The final example involves the Wercker CLI. Head to the root directory of `getting-started-golang` fork. Once there run the following command:

        wercker build

![Wercker CLI build](/docs/assets/wercker-cli-build.jpg)

The difference now is that you can check each step locally and detect any error early in the process. The Wercler CLI replicates the SaaS behavior, it downloads specified images, build, test and shows errors. The only limitation is the ability to deploy the end result, but remember this is a Development tool intended for local testing. Let's try to build our application:

        go build

The application `getting-started-golang` is built in the root directory. Run the program:

        ./getting-started-golang

Head to `localhost:5000/cities.json` in your browser, you should see:

![Cities JSON](/docs/assets/wercker-cities-JSON.png)

Now open another terminal and run the command:

        wercker dev

![Wercker Dev](/docs/assets/wercker-dev.jpg)

That just triggered the auto-build function present in the `dev` pipeline. If you make any change to the `main.go` file and reload your browser you will see those changes updated instantly, without building again your application.

From a developer point of view there are infinite possibilities to play with using Wercker:

* You can specify "local boxes", meaning you can use specialized images depending on your pipeline goals. Docker hub has many images ready to use for this matter.
* You are not limited to use "chained" workflows, you can start pipelines in parallel (as many as needed) and chain only when necessary. This is useful if you need to build a complex application that consumes a lot of time to compile. You can start the compilation pipeline early in parallel with other tasks or better yet you can divide your application into several pipelines to reduce the time of each process and isolate problems.
* Wercker is language agnostic, process agnostic and platform agnostic. Your imagination is the limit for the possible uses of the Wercker tool.
