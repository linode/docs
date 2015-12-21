---
author:
  name: Linode
  email: docs@linode.com
description: 'Node.js is a cross-platform runtime environment for server-side JavaScript applications. There are multiple ways to install and maintain Node.js and the decision of which installation method to use can quickly become a confusing one, so here are the main choices.'
keywords: 'linode guide,hosting a website,website,linode quickstart guide'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, December 21st, 2015
modified_by:
  name: Linode
published: 'Thursday, December 18th, 2014'
title: Node.js Installation Crash Course
external_resources:
 - '[NodeSchool](http://nodeschool.io/)'
 - '[Node Version Manager](https://github.com/creationix/nvm)'
 - '[npm](https://www.npmjs.com/)'
---

[Node.js](https://nodejs.org/) is a cross-platform runtime environment for server-side JavaScript applications. Node.js uses [V8](https://developers.google.com/v8/), Google's JavaScript engine also used in the Chrome browser. Depending on the use case, Node.js can supplement or replace tradidional web servers and tools such as Apache, nginx, or PHP.

There are multiple ways to install and maintain Node.js across the various plaforms offered. There are also [multiple releases](https://github.com/nodejs/node#release-types) of Node.js available, and multiple versions within the [LTS branch](https://github.com/nodejs/LTS/#example). The decision of which installation method to use can quickly become a confusing one, so here are the main choices for installing Node.js on Linux, and some reasons why you may or may not want to use each one.

## Package Manager

**Linux Distro Repositories**

Your disro's repos will likely contain an LTS release of Node.js. This is a good solution if newer features aren't needed, if you want the distro's package manager to handle updates, or where you want to easily maintain uniformity among multiple Nodejs servers.

[NPM](#node-package-manager-npm) (Node Package Manager) is included with installations of Nodejs by other methods, but not here; `npm` is a separate package from `nodejs` which must be installed separately.

{: .note}
>
>If you've installed Node.js from the repositories off Debian 7 or 8, or Ubuntu 12.04 or 14.04, then calling Node.js is different than normal, using the command `nodejs -$option` instead of `node -$option` This is because of a confict with the [Amateur Packet Radio Node program](https://packages.debian.org/jessie/node), and one workaround is to install the package `nodejs-legacy`. This maintains a symlink from `/usr/bin/node` to `/usr/bin/nodejs` so the normal `node` commands can be used.

**NodeSource Repository**

The [NodeSource repository](https://github.com/nodesource/distributions) is a continuation and expansion of [Chris Lea's](https://nodesource.com/blog/chris-lea-joins-forces-with-nodesource/) Node.js Ubuntu PPA to offer both `.deb` and `.rpm` binaries for various Node.js release stages.  This is the option mentioned on [nodejs.org](https://nodejs.org/en/download/package-manager/) if installing using a system package manager is desired, and will generally provide more up to date packages than the distro's repositories.

## Node Version Manager

[NVM](https://github.com/creationix/nvm#node-version-manager-) is a separate project from Node.js and is one of the more common installation methods. NVM is installed using an [installation script](https://github.com/creationix/nvm#install-script) and it's primary benefit is easy management of Node.js versions, including updating to newer releases and migrating your Node packages.

## Official Binary Installer

Installers for all available platforms can be found at [nodejs.org](https://nodejs.org/en/download/.) A benefit of using an official installer is that [GPG checksums](https://github.com/nodejs/node#verifying-binaries) are offered to verify the installer's integrity.

## Build from Source

The most advanced method of installing any software, compiling from source can add flexibility with compiling flags and security by eliminating the trust relationship required for pre-made binaries.

## Node Package Manager (NPM)
A typical installation of Node.js includes the [Node Package Manager](https://github.com/npm/npm) (NPM). An exception to this is is the Linux distro-supplied versions of Nodejs which would need the package `npm` installed. NPM is a package manager for Nodejs pacakges in the NPM repository. NPM has a significant amount of documentation at [npmjs.com](https://docs.npmjs.com/).
        
## Making a Decision (tl:dr)
Still not sure which installation method to use? Then [NVM](#node-version-manager) will probably be your best choice to start with. It's easy to install and maintain Node.js and NPM, no transitional naming issues are present and you can easily manage multpile installations of Node.js to test your application before pushing a Node.js update into your production environment.