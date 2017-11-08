---
author:
  name: Chris Walsh
  email: docs@linode.com
description: 'Node.js is a cross-platform runtime environment for server-side JavaScript applications. There are multiple ways to install and maintain Node.js and the decision of which installation method to use can quickly become a confusing one, so here are the main choices.'
keywords: ["linode guide", "hosting a website", "website", "linode quickstart guide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-02-15
modified_by:
  name: Linode
published: 2014-12-18
title: How to Set Up and Install Node.js
aliases: ['websites/nodejs/installing-nodejs/','websites/nodejs/a-nodejs-installation-crash-course/','development/nodejs/installing-nodejs/','development/nodjs/a-nodejs-installation-crash-course/']
external_resources:
 - '[NodeSchool](http://nodeschool.io/)'
 - '[Node Version Manager](https://github.com/creationix/nvm)'
 - '[npm](https://www.npmjs.com/)'
---

[Node.js](https://nodejs.org/) is a cross-platform runtime environment for server-side JavaScript applications. Node.js uses [V8](https://developers.google.com/v8/), Google's JavaScript engine, which is also found in Chromium and Chrome. Depending on the use case, Node.js can supplement or replace traditional web servers and tools such as Apache, nginx, or PHP.

![A Node.js Installation Crash Course](/docs/assets/nodejs-installation-crash-course.png "A Node.js Installation Crash Course")

Node.js can be installed and maintained multiple ways across the various platforms offered. [Multiple releases](https://github.com/nodejs/node#release-types) of Node.js are available, along with multiple versions within the [LTS branch](https://github.com/nodejs/LTS/#example). The decision about which of these versions to install can quickly become confusing, so this guide lists the main choices for installing Node.js on Linux, and some basic reasons why you may or may not want to use a certain method.

## Package Manager

**Linux Distro Repositories**

Your distro's repos will likely contain an LTS release of Node.js. This is a good solution if:

*   You won't need newer features.

*   You want the distro's package manager to handle core updates.

*   You want to easily maintain uniformity among multiple Node.js servers.

[NPM](#node-package-manager-npm) (Node Package Manager) is included with installations of Node.js by other methods, but not here; `npm` is a separate package from `nodejs` and must be installed separately.

{{< note >}}
Node.js from the distro's repositories in Debian 7 or 8, or Ubuntu 12.04 or 14.04 confict with the [Amateur Packet Radio Node program](https://packages.debian.org/jessie/node). In this scenario, calling Node.js requires that you use the command `nodejs -$option` instead of the standard `node -$option`. One workaround is to install the package `nodejs-legacy`, which maintains a symlink from `/usr/bin/node` to `/usr/bin/nodejs` so the normal `node` commands can be used.
{{< /note >}}

**NodeSource Repository**

The [NodeSource repository](https://github.com/nodesource/distributions) is a continuation and expansion of [Chris Lea's](https://nodesource.com/blog/chris-lea-joins-forces-with-nodesource/) Node.js Ubuntu PPA to offer both `.deb` and `.rpm` binaries for various Node.js release stages.  This is the option mentioned on [nodejs.org](https://nodejs.org/en/download/package-manager/) for those who would like to install using the operating system's package manager, and will generally provide more up-to-date packages than the distro's repositories.

## Node Version Manager

[NVM](https://github.com/creationix/nvm) is a separate project from Node.js and is one of the more common installation methods. NVM is installed using an [installation script](https://github.com/creationix/nvm#install-script) and it's primary benefit is easy management of Node.js versions, including updating to newer releases and migrating your Node packages.

## Official Binary Installer

Installers for all available platforms can be found at [nodejs.org](https://nodejs.org/en/download/.) A benefit of using the official installer is that [GPG checksums](https://github.com/nodejs/node#verifying-binaries) are offered to verify the installer's integrity.

## Build from Source

Compiling from source code is the most advanced installation method, though it can be a remarkably simple process. Installing from source can add flexibility with compiling flags and ensures that you have the absolute latest code base at the time of installation.

## Node Package Manager (NPM)

A typical installation of Node.js includes the [Node Package Manager](https://github.com/npm/npm) (NPM). However, an exception is any Linux-distro-supplied version of Nodejs which would need the package `npm` installed. NPM is a package manager for Nodejs packages in the NPM repository. You can find extensive NPM documentation at [npmjs.com](https://docs.npmjs.com/).

## Making a Quick Decision (the tl:dr)

Still not sure which installation method to use? Then [NVM](#node-version-manager) will probably be your best choice to start with. NVM faciliates easy installation and maintenance of Node.js and NPM, presents no naming issues with other software, and easily manages multple installations of Node.js that can test your application before you push a Node.js update into your production environment.
