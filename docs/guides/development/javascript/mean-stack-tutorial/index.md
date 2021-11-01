---
slug: mean-stack-tutorial
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-01
modified_by:
  name: Linode
title: "Mean Stack Tutorial"
h1_title: "h1 title displayed in the guide."
enable_h1: true
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

In web development, the term *full stack* refers to all the programmed parts of a web application. This includes the front end, which is seen by end-users, and  the back end, where data. The *MEAN* stack is one particular combination of technologies that cover the front end and the back end of an application. MEAN is widely regarded as particularly capable for large-scale, complex applications. This tutorial shows you how to build a basic model application that illustrates communication between Angular, on the front end, and MongoDB, on the back end.

## What is the MEAN Stack?

MEAN is an acronym for the combination of [MongoDB](/docs/guides/databases/mongodb/), [Express.js](/docs/guides/express-js-tutorial/), Angular, and Node.js. MongoDB is a persistent datastore, Node.js scripts back-end actions, Express.js is a web application framework based on Node, and Angular is a web framework for the front end.

{{< note >}}
You can learn about each piece of the MEAN stack in our guides on [Angular](/docs/guides/angular-tutorial-for-beginners/), [Node.js](/docs/guides/how-to-install-nodejs/), [MongoDB](https://www.linode.com/docs/topresults/?q=mongodb), and [Express.js](/docs/guides/express-js-tutorial/).
{{</ note >}}

## Installing the MEAN Stack

This section shows you how to install the Node.js, Express, Angular, and MongoDB on an Ubuntu 20.04 system.

### Node.js Installation

1. Choose the appropriate operating system for your own situation; Use the following command to install Node.js on an Ubuntu system:

        sudo apt install nodejs -y

Validate your installation by creating and running your first Node application:

1. Use a text editor of your choice to create a file named `my-app.js` and add the following content to it:

        console.log(“Hello, world.”); then

1. Run the file using Node.js with the following command:

        node my-app.js

    Your output should display:

    {{< output >}}
Hello, world
    {{</ output >}}

You have now installed Node.js and confirmed that it is working on your Ubuntu system.

### Express Installation

1. Install Express.js using the Node Package Manager:

        sudo npm init -y; sudo npm install express --save

    Your local directory should now also have a file named `package.json` with the following content:

        {{< file "package.json" >}}
    ...
  "dependencies": {
	"express": "^4.17.1"
  }
    ...
        {{</ file >}}

### Angular Installation