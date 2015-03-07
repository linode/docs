---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Basic Node.js Server in a Docker Container on Linode'
keywords: 'docker, nodejs, node.js, debian, ubuntu, server, web server, js, javascript'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, March 19th, 2015
modified_by:
  name: Joseph Dooley
published: 'Thursday, March 19th, 2015'
title: Basic Node.js Web Server with Docker
external_resources:
 - '[Linode Docker Hub Page](https://hub.docker.com/u/linode/)'
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
---


Docker is a container platform for applications. With Docker, users can download pre-configured apps without the hassle of the installation and configuration process. Docker containers can also build on each other.

Node.js, commonly referred to as node, node js, or nodejs, is a JavaScript platform for the cloud. Compared to typical browser-side JavaScript, Node.js is server-side JavaScript, often used for various cloud related applications. 

##Install Docker
Use the Docker-maintained install script for Debian or Ubuntu. For other operating systems, see the [Docker Installation](https://docs.docker.com/en/latest/installation/) guides.

1.  Run:

        curl -sSL https://get.docker.com/ | sh

2.  If necessary, add the non-root user to the "docker" group:

        sudo usermod -aG docker example_user

##Download the Docker Node.js Server Image
The Docker Hub user page for Linode can be accessed [here](https://hub.docker.com/u/linode/). Select the **nodejs-server** image for configuration information.

1.  Search for **linode** user images:

        sudo docker search linode

2.  Download the **linode/nodejs-server** image:

        sudo docker pull linode/nodejs-server


