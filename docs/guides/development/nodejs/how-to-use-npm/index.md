---
slug: install-and-use-npm-on-linux
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to install and use the Node Package Manager (NPM) to install JavaScript packages on Linux."
og_description: "Learn how to install and use the Node Package Manager (NPM) to install JavaScript packages on Linux."
keywords: ['npm','npm install','npm update']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-05
modified_by:
  name: Nathaniel Stickman
title: "Install and Use the Node Package Manager (NPM) on Linux"
h1_title: "How to Install and Use the Node Package Manager (NPM) on Linux"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[NPM Docs](https://docs.npmjs.com/)'
- '[NPM dependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies)'
---

The Node Package Manager (NPM) comes by default with Node.js and is the most widely-used package manager for JavaScript projects. This guide walks you through installing NPM and getting started using it on your Linux system.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux and CentOS, use:

            sudo yum update

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What is NPM?

NPM is the default and the most popular package manager for Node.js projects. It encompasses not only a command-line tool (CLI) — which is what the guide discusses below — but also a package registry and a [website](https://npmjs.com/).

The registry holds the numerous JavaScript packages made available through the NPM CLI, along with their metadata. NPM's website gives you an easy way to search for JavaScript packages and read information about them.

The NPM CLI itself is more than a way to install packages. Its `package.json` makes it a powerful tool for managing project dependencies ensuring consistent project installations across environments.

### NPM vs Yarn

You may already have heard of the Yarn package manager which has become a popular alternative to NPM itself. (You can learn more about Yarn in our [How to Install and Use the Yarn Package Manager](/docs/guides/how-to-use-yarn/) guide).

Both NPM and Yarn use the NPM registry to get packages and package information, and the commands in each tool are pretty similar. So what sets NPM apart?

One of the most immediate advantages of NPM is that it is the default. If you have Node.js, you have NPM. (And, if you do not have Node.js yet, see the [How to Install NPM](/docs/guides/how-to-use-npm/#how-to-install-npm) section below to see how to get it). This means that you can easily and immediately start working with NPM for your Node.js projects.

NPM is also the most popular Node.js package manager. With that popularity comes a wide range of coverage. You are more likely to find Node.js projects and examples that use NPM than you are to find ones using Yarn.

Yarn was originally designed to address performance and security concerns in NPM. And while Yarn still outshines NPM in terms of speed, NPM has made vast security improvements that put it about even with Yarn.

## How to Install or Update NPM

The steps in this section show you how you can get started by installing NPM along with Node.js. It also gives you methods for updating your NPM installation.

### How to Install NPM

Since NPM comes with Node.js, you just need to decide on the best method for you to use to install Node.js. The path recommended by NPM is using a Node version manager, which helps you avoid permissions issues with NPM.

You can get Node.js using the Node Version Manager (NVM) by following the steps in our [How to Install and Use the Node Version Manager NVM](/docs/guides/how-to-install-use-node-version-manager-nvm/#installing-and-configuring-nvm) guide.

Using NVM, you can install the current stable version of Node.js, and its accompanying version of NPM using the following command:

    nvm install node

You can then verify your NPM installation.

    npm -v

{{< output >}}
7.20.3
{{< /output >}}

### How to Update NPM

Using NVM, your NPM version updates with the version of Node.js you are using. So, whenever you want to make sure you are on the latest version, you can use NVM's `install` command to get the current stable Node.js version. Then, tell NVM to use that version.

    nvm install node
    nvm use node

If you just want to update NPM, without updating Node.js, you can use NVM's dedicated command.

    nvm install-latest-npm

## How to Install Packages with NPM

The sections that follow show you how to start working with packages using NPM.

Most often, you want NPM to work with packages for a specific project. You can use the commands below to create an example NPM project following along with this guide.

    mkdir ~/example-app
    cd ~/example-app
    npm init

NPM requests information for your project. You can use the defaults for this example. The result is an initial `package.json` file representing your project.

### Install Packages to a Project

NPM provides two main ways for installing specific packages to your project.

- You can install a specific package with NPM's `install` command. Here, NPM installs the latest stable version of the package.

      npm install express

- Alternatively, you can explicitly specify the package version you want to be installed.

      npm install express@4.17.1

    You can even specify a version range for the package you want to be installed. Put the version expression in the quotes, and precede the version number with the comparison operator you want to use. You can use multiple version constraints, separating them with spaces.

      npm install express@">=4.1.0 <4.17.1"

    The above command installs the latest available version of the Express JS package that is equal to or greater than **4.1.0** and less than **4.17.1**.

### Package.json

The `npm init` command creates a `package.json` file in the project's base directory. Any packages installed to the project are reflected in this file, meaning that the `package.json` becomes a reflection of your project's dependency structure.

Here is an example `package.json` resulting from the basic `install` command above.

{{< file "package.json" >}}
{
  "name": "example-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  }
}
{{< /file >}}

Notice that the `express` package is listed under `dependencies`. Here, the `^` indicates that a package version compatible with version **4.17.1** must be installed for this project.

Take a look at NPM's `package.json` documentation, specifically [on dependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies) for more information about the syntax used for parsing package versions. The same syntax can be used when specifying a version, or a version range, for the `install` command.

### Install Dependencies for an Existing Project

You may come across an existing project, with its own `package.json`, that you want to get up and running. Typically, you first need to install the project's dependencies. You can do this by running the `install` command from that base directory without specifying a package, as in:

    npm install

NPM uses the project's `package.json` to determine which packages are needed and which versions of those packages are compatible with the project. If the project has a `package-lock.json`, NPM also uses that to further ensure compatibility in the dependencies that get installed.

### Install Packages Globally

Some packages you may want to install globally. Packages installed in this way are available anywhere on the system, not just in a particular project.

You can accomplish this with NPM's global (`-g`) flag, as in:

    npm install -g express

You can additionally use the `-g` flag with the other commands shown below, allowing you to also uninstall and update global packages.

## How to Remove Packages with NPM

You can uninstall an NPM package with the `uninstall` command.

    npm uninstall express

Like with the `install` command, the `package.json` gets updated to reflect that the project no longer depends on the uninstalled package.

{{< file "package.json" >}}
{
  "name": "example-app",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}
{{< /file >}}

## How to Update Packages with NPM

You can use the command below to update all of a project's packages to their latest compatible versions.

    npm update

NPM references the version constraints given in the project's `package.json` to ensure that updates do not contradict your project's specified version compatibility.
