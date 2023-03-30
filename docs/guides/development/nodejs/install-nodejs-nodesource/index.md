---
slug: install-nodejs-nodesource
description: 'Install an up to date Node.js binary from NodeSource on Debian or Ubuntu.'
keywords: []
tags: ["debian", "ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-03-06
modified: 2018-12-27
modified_by:
  name: Linode
title: 'Install Node.js from NodeSource on Debian or Ubuntu'
headless: true
aliases: ['/development/nodejs/install-nodejs-nodesource/']
authors: ["Jared Kobos"]
---

1.  Use `curl` to download the setup script provided by NodeSource. Replace the Node version in the `curl` command with the [version you would like to install](https://github.com/nodesource/distributions/tree/master/deb):

        curl -sL https://deb.nodesource.com/setup_9.x -o nodesource_setup.sh

2.  Run the script:

        sudo bash nodesource_setup.sh

3.  The setup script will run an `apt-get update` automatically, so you can install Node.js right away:

        sudo apt install nodejs npm

The Node Package Manager (NPM) will be installed alongside Node.js.
