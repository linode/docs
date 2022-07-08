---
slug: transferring-a-mern-application-to-a-new-server
author:
  name: Linode
description: "This guide discusses guidelines for quickly transferring a MERN stack application over to Linode built with Linode's Marketplace App."
keywords: ['mern stack','node.js','javascript','mongodb']
tags: ['apache', 'nginx', 'ubuntu', 'centos']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-25
modified_by:
  name: Linode
title: "Transferring a MERN application to Linode's MERN Marketplace App"
h1_title: "How to transfer a MERN application to Linode's MERN Marketplace App"
enable_h1: true
external_resources:
- '[MongoDB MERN Stack Explained](https://www.mongodb.com/mern-stack)'
- '[Node.js](https://nodejs.org/en/)'
- '[NPM](https://www.npmjs.com/)'
---

The [Linode Marketplace App](/docs/products/tools/marketplace/guides/mern-stack/) for the MERN stack (MongoDB, Express, React, Node.js) is a great way to create the base configuration equipped with all the essentials for a MERN stack quickly, however the Marketplace APP itself will still require tuning to host your MERN application. Transferring an application to a new host for example, can be a complex process depending on the specifics of your configuration. This guide was designed to serve as reference for users currently undergoing the migration process, and aims to clear up potential confusion and common issues that can occur.

## Transferring the Application

Before proceeding with any migration, it is first recommended that the Marketplace APP for the MERN stack is fully deployed. This will install an up to date version of most of the essentials required for many working MERN applications including the following:

- UFW
- Fail2Ban
- MongoDB
- Node.js
- NPM

  {{< note >}}
Users who prefer building applications with alternative package Managers for Node.js like [Yarn](/docs/guides/install-and-use-the-yarn-package-manager/) will need to install the package manager manually.
{{< /note >}}

Additionally, this will install the default `hello-world` react application which you may opt to remove to.

## Removing the default Flask Application

The default `hello-world` Flask application included as part of the MERN Marketplace App can be removed manually from the command line. For some use cases and application,this step may be required to ensure that the necessary resources are available. The commands to remove this application are as follows:

    sudo systemctl disable hello-world
    sudo systemctl stop hello-world
    sudo systemctl daemon-reload
    npm uninstall -g create-react-app
    sudo pkill -f node
    sudo rm /lib/systemd/system/hello-world.service

## Preparing for The Transfer

Before, proceeding with any remote transfer, it is strongly recommended the original host that will be transferring data to the Linode has [Backups](/docs/guides/backing-up-your-data/) available to restore from. While standard backup solutions will work for the majority of the MERN Stack, a database dump for MongoDB should be performed by using the [mongodump](https://docs.mongodb.com/database-tools/mongodump/) command.

{{< note >}}
If using a Cloud-Native database like **MongoDB Atlas**, the steps for transferring your database may differ, and users should consult the documentation of their database host.
{{< /note >}}

A MongoDB database dump can therefore be performed from the home directory with the following command:

    cd && mongodump

Once completed, the database dump will be saved in the `/dump/` suc-directory by default from the working directory. The `.bak` file contained within this directory can then be used to restore your database to the new Linode. The full dump directory should next be transferred over to the MERN stack Linode. To do this, first SSH into the MERN stack Linode and enter the following command, using syntax similar to the following including the `-r` flag, which will recursively copy all files from the targeted directory on the remote system to the local path designated on the linode:

    scp -r your_linode_username@your_linode_ip:/path/to/dump/directory /path/to/your/local/directory

Next, the `scp` command can be used from the command line on the MERN stack Linode to copy the node project. Syntax for this command is as follows, and uses the `-r` flag to recursively copy all files within the targeted directory of the Node project being transferred:

    scp -r your_linode_username@your_linode_ip:/path/to/your/directory /path/to/your/local/directory

## Rebuilding the Application

Once the file transfer is completed, Rebuilding the MERN application is generally a simple process, completed through the following steps:

1. Change your working directory to the directory which contains your node project:

       cd mynodeproject

1. Install the node project using NPM or a package manager of your choice to install all node modules:

       npm install

    {{< note >}}
The packages installed using the `npm install` command will install all node modules included in the project directory. This does not include all modules in any subdirectory. If your project is reliant on additional underlying modules, you will need to navigate to the directory where their configuration information.
{{< /note >}}

1. Restore the MongoDB database by navigating to the install location of the `dump` folder containing your database dump. If this was installed in the `/home` directory, then the following commands will navigate to this directory, and then perform the database restore:

       cd
       sudo mongorestore

1. Start the database if it has been shut down for any reason:

       sudo service mongod start

1. Navigate back to the project directory, and direct node to run any .js files to activate and begin serving your content. Syntax for this command is usually as follows:

       cd mynodeproject
       sudo node server.js

Once these steps are completed, your node configuration should successfully be running.

{{< note >}}
Some MERN applications are dependent on a specific version of Node in order to serve content. If you encounter errors related to your version of Node, you can additionally install tools like the [Node Version Manager(NVM)](/docs/guides/how-to-install-use-node-version-manager-nvm/) in order to easily switch to your needed version of Node.

{{< /note >}}













