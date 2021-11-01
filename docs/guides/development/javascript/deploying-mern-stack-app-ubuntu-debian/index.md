---
slug: deploying-mern-stack-app-ubuntu-debian
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to deploy a locally developed MERN stack app to Linode two different ways."
og_description: "Learn how to deploy a locally developed MERN stack app to Linode two different ways."
keywords: ['deploy react app','mern stack','how to deploy react app']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-01
modified_by:
  name: Nathaniel Stickman
title: "How to Deploy a MERN Stack App to Linode on Ubuntu 20.04 or Debian 10"
h1_title: "How to Deploy a MERN Stack App to Linode on Ubuntu 20.04 or Debian 10"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[MongoDB: MERN Stack Explained](https://www.mongodb.com/mern-stack)'
- '[GitHub: rfdickerson/mern-example: MERN Stack Starter](https://github.com/rfdickerson/mern-example)'
---

MERN is a stack for modern web applications. It consists of MongoDB, Express JS, React, and Node.js — all well-established open-source technologies that make a solid foundation for new web applications.

This guide helps you get started using your MERN stack project. It walks you through two methods for deploying your MERN project to an Ubuntu 20.04 or Debian 10 server:

- Using the Linode Marketplace one-click app
- Using a standard server instance, without any pre-configuring

Along the way, see how to copy your existing MERN app project to your server instance so you are ready to start running it.

Looking to create a new MERN application? Take a look at our guide [How to Create a MERN Stack App on Ubuntu 20.04 or Debian 10](/docs/guides/creating-mern-stack-app-ubuntu-debian).

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system:

        sudo apt update && sudo apt upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Is MERN Stack?

A MERN architecture is a full-stack framework for developing modern web applications. It is a variation of the MEAN stack, but replaces Angular (the **A**) with React.

A MERN stack is made up of the following components:

- [MongoDB](https://www.mongodb.com/) document database
- [Express JS](https://expressjs.com/) server-side framework
- [React](https://reactjs.org/) client-side framework
- [Node](https://nodejs.org/en/about/) web server

Each of these technologies are well-supported and offer robust features. This makes a MERN stack a good choice for developing new web applications.

As noted above, other variants exist, like the MEAN stack (which uses Angular) and the MEVN stack (which uses Vue). But MERN uses React, so you get the advantages of its server-side rendering and improved availability for web crawlers.

## How to Deploy a MERN App to Using the One-Click App

You have two options for deploying a MERN application on your server. The most painless of one is to use the one-click app from the Linode Marketplace. Find out how to deploy your MERN stack from the Linode Marketplace below, along with instructions for moving an existing MERN project to your server.

The other option is to install each of the components of the MERN application manually. Steps for this option are covered further on, in the [How to Deploy a MERN App to a Non-Preconfigured Instance](/docs/guides/deploying-mern-stack-app-ubuntu-debian/#how-to-deploy-a-mern-app-to-a-non-preconfigured-instance).

### Deploying the Instance through the Marketplace

Refer to our guide [Deploying the MERN Stack Marketplace App](/docs/guides/mern-stack-marketplace-app/#deploying-the-mern-stack-marketplace-app) to set up your MERN stack instance through the Linode Marketplace.

Once you have done so, take a look below to learn ways you can move an existing MERN project to your new instance.

### Copying Files to Your Instance

There are two recommended methods for getting your locally-developed MERN project onto your server instance:

- Copy your code to the server over SSH. You can use the `scp` command to do so, even on Windows. This method works well if you subsequently intend to work with the project files on the server exclusively.
- House your MERN stack code in a remote Git repository. Then, pull your code down from the remote repository to your server. While requiring more effort to set up, this method helps keep your project consistent as you work on it across multiple machines.

Below, you can find instructions for each of these methods.

#### Copying a Project to a Server Using SCP

To follow along, you can download the [MERN stack starter](https://github.com/rfdickerson/mern-example) project, a small project demonstrating how a MERN stack application works.

1. Using `scp`, copy your project's directory to the server.

    - On Linux and macOS, execute a command like the one below. Replace the path to your MERN project directory with the actual path. Likewise, replace `example-user` with your user on the server instance and `192.0.2.0` with the instance's IP address:

            scp -r ~/mern-example example-user@192.0.2.0:~/

    - On Windows, you first need to open port **22** on the server instance. Log into your server instance, and use UFW to open port **22**:

            sudo ufw allow 22
            sudo ufw reload

        The above requires you to have the UFW utility installed. It comes pre-installed if you used the Linode Marketplace one-click app. Otherwise, you can learn how to use UFW from our [How to Secure Your Server](/docs/security/securing-your-server/) guide discussed above.

        You can now use `scp` from your Windows machine, with a command like the one below. Replace the path to your MERN project folder with the actual path. Likewise, replace `example-user` with your user on the server instance and `192.0.2.0` with the instance's IP address:

            scp -r "C:\mern-example" example-user@192.0.2.0:~/

1. Delete the `node_modules` directory from the copy of the project on your server. It is best to reinstall these due to potential system differences affecting the modules. Replace the path given below with the actual path to your project's `node_modules` directory.

        rm -r ~/mern-example/node_modules

    Your project may have more than one such directory, depending on whether the Express JS and React portions were created as separate NPM/Yarn projects. Be sure to remove each `node_modules` directory.

#### Setting Up Git Version Control for Your Project

Take a look at our guide [Introduction to Version Control](/docs/guides/introduction-to-version-control/#installing-git) to learn more about using Git for version control.

The examples in the steps below use GitHub. They assume you have a GitHub account and have created a blank repository on GitHub for pushing your MERN project to. You can learn how to create a repository on GitHub using the steps in GitHub's [official documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository).

This first set of steps needs to be taken on your local machine. It sets up your project as a Git repository and pushes it to the remote repository on GitHub.

1. Ensure that Git is installed.

    - On Linux systems, you can use your package manager. For instance, on Debian and Ubuntu:

            sudo apt install git

    - On macOS, running the Git command should prompt you to install Git if it is not already installed:

            git --version

    - On Windows, download the Git binary from the [official website](https://git-scm.com/download/win).

1. Change into your project's directory, and make your project a Git repository if it is not already one. This example assumes your project is in the `mern-example` directory in your current user's home directory:

        cd ~/mern-example
        git init

1. Create a `.gitignore` file in the base of your project. If there are files or directories you do not want added to the remote Git repository, add patterns matching those files/directories to the `.gitignore` file. This should include a `/node_modules` pattern to ensure that the Node.js modules do not get carried over.

    As an example, here is a typical `.gitignore` for a Node.js project:

    {{< file ".gitignore" >}}
.DS_STORE
/node_modules
/build
logs
*.log
npm-debug.log*
    {{< /file >}}

1. Add your project's files for staging to your first Git commit:

        git add .

1. Commit the files. It is recommended that you add a brief descriptive comment to each commit you make, like below:

        git commit -m "Initial commit."

1. Add the remote repository. Replace the URL in the example below with the URL for your remote repository:

        git remote add origin https://github.com/example-user/example-repository.git

1. Push your local project to the remote repository:

        git push -u origin master

These next steps then need to be taken on the server instance to pull down the project from the remote repository. You can use these steps with the [MERN stack starter](https://github.com/rfdickerson/mern-example) project to have a working example of how pulling down a repository works.

1. Ensure that Git is installed:

        sudo apt install git

1. Change into a directory where you want the project to live. Here, the current user's home directory is used:

        cd ~

1. Clone the remote GitHub repository. As above, replace the URL here with the actual URL for your repository:

        git clone https://github.com/rfdickerson/mern-example.git

### Configuring Your MERN Application

1. Now that the files are on your server instance, you need to reinstall the project's Node.js modules. To do so, change into the project directory, and execute one of the commands below.

    - If you used NPM to install modules, use:

            npm install

    - If you used Yarn to install modules, use:

            yarn

    You can tell which one your project uses by searching its base directory. If you find a `yarn.lock` file, it should be a Yarn project. Otherwise, it should be an NPM project.

    You may need to run the above commands in multiple directories within your project. This depends again on whether you set up Express JS and React as two separate NPM/Yarn projects.

1. Depending on your Node.js and React versions, you may need to enable the legacy OpenSSL provider in Node.js. If you get an OpenSSL error when trying to run React, use the following command:

        export NODE_OPTIONS=--openssl-legacy-provider

    To make this configuration persistent, add the line above to your `~/.bashrc` file.

You can refer to the [Starting MERN Stack Services](/docs/guides/deploying-mern-stack-app-ubuntu-debian/#starting-mern-stack-services) section below for more on getting your MERN stack up and running.

## How to Deploy a MERN App to a Non-Preconfigured Instance

To install the components for a MERN stack yourself, you can follow the steps below. These walk you through installing MongoDB and Node.js and adding Express JS and React to your project if they are not already added.

Further on, you can also see how to start up your MERN stack application once all of the components have been installed. By the end, you have a functioning MERN application running on your server.

### Installing the MERN Stack

To get started, you need to install each of the components that makes up a MERN stack. For Express JS and React, this typically means starting a Node.js project and setting up Express JS and React as dependencies.

#### Installing MongoDB

1. Install `gnupg`:

        sudo apt install gnupg

1. Import the GPG key for MongoDB:

        wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

1. Add the MongoDB package list to APT.

    - On Debian (Buster):

            echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/5.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

    - On Ubuntu (Focal):

            echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

1. Update the APT package index:

        sudo apt update

1. Install MongoDB:

        sudo apt install mongodb-org

See the official documentation for more on installing MongoDB [on Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) and [on Ubuntu](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/). You can also refer to our guide [How To Install MongoDB on Ubuntu 16.04](/docs/guides/install-mongodb-on-ubuntu-16-04/).

#### Installing Node.js

1. Install the Node Version Manager, the preferred method for installing Node.js:

        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

1. Restart your shell session (logging out and logging back in), or run the following commands:

        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

1. Install the current version of Node.js:

        nvm install node

1. If your project uses the Yarn package manager instead of NPM, you need to install Yarn as well. You can do so with:

        npm install -g yarn

You can additionally refer to our [How to Install and Use the Node Package Manager (NPM) on Linux](/docs/guides/install-and-use-npm-on-linux/#how-to-install-or-update-npm) guide. If you are interested in using Yarn instead of NPM, take a look at our [How to Install and Use the Yarn Package Manager](/docs/guides/install-and-use-the-yarn-package-manager/) guide.

#### Installing Express JS

If you have an existing MERN project using Express JS, you only need to install the project's Node.js dependencies. Doing so is covered in the [Copying Files to Your Instance](/docs/guides/deploying-mern-stack-app-ubuntu-debian/#copying-files-to-your-instance) section above.

Otherwise, you can add Express JS as a dependency to your NPM project using this command. This also adds the Mongoose module, which is typically the module used for connecting to MongoDB from Express JS:

    npm install --save express mongoose

If you are working on a Yarn project, use this instead:

    yarn add express mongoose

Learn more about getting started with Express JS in our guide [Express JS Tutorial: Get Started Building a Website](/docs/guides/express-js-tutorial/).

#### Installing React (if necessary for server-side rendering)

As with Express JS, you only need to install your Node.js dependencies if you already have React in your existing MERN project. This guide covers installing those dependencies in the [Copying Files to Your Instance](/docs/guides/deploying-mern-stack-app-ubuntu-debian/#copying-files-to-your-instance) section above.

Otherwise, you can add React to your NPM project with a command like the one here. This also includes the Axios module, typically used for communications between React and the Express JS server:

    npm install --save react react-dom axios

Alternatively, use a command like the next one if your project uses Yarn instead of NPM:

    yarn add react react-dom axios

Find out more about building applications with React from the [official documentation](https://reactjs.org/docs/getting-started.html) and in our guide [Deploying a React Application on Debian 10](/docs/guides/how-to-deploy-a-react-app-on-debian-10/#create-an-example-react-app).

### Starting MERN Stack Services

1. Start the MongoDB service:

        sudo systemctl start mongod

1. Change into the project's `server` directory, and start up the Express JS and React servers. The commands for this vary depending on your project configuration.

    Typically, you can run an NPM project with a command like:

        npm start

    Or, if your project uses an NPM script, you might run it with something like this, replacing `mern-project` with the name of the script:

        npm run mern-project

    For the [MERN stack starter](https://github.com/rfdickerson/mern-example) project referenced as an example above, use:

        yarn start-dev

You can then visit your application in a browser. By default, React runs on `localhost:3000`, and that is the case for the example application referenced above. To access it remotely, you can use an SSH tunnel:

- On Windows, use the PuTTY tool to set up your SSH tunnel. Follow the appropriate section of the [Setting up an SSH Tunnel with Your Linode for Safe Browsing](/docs/guides/setting-up-an-ssh-tunnel-with-your-linode-for-safe-browsing/#windows) guide, replacing the example port number there with **3000**.

- On macOS or Linux, use the following command to set up the SSH tunnel. Replace `example-user` with your username on the application server and `192.0.2.0` with the server's IP address:

        ssh -L3000:localhost:3000 example-user@192.0.2.0

![Example MERN stack application](mern-app-example.png)
