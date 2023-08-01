---
slug: node-js-web-server-deployed-within-docker
description: 'This guide shows you how to deploy a Node.js server inside of a Docker container, which is a technology platform for running containerized applications.'
keywords: ["docker", "node.js", "node", "debian", "ubuntu", "web server", "javascript", "container"]
tags: ["container","docker","web server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-01-18
modified_by:
  name: Linode
published: 2015-03-23
title: 'Node.js Web Server Deployed within Docker'
aliases: ['/applications/containers/node-js-web-server-deployed-within-docker/','/applications/containers/nodejs-node-js-web-server-docker-container/']
external_resources:
- '[Linode Docker Hub Page](https://hub.docker.com/u/linode/)'
- '[Docker Docs](http://docs.docker.com/)'
- '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
- '[Docker Hub](https://hub.docker.com/)'
authors: ["Joe D."]
---

Node.js is a server-side, JavaScript package, often used for various cloud applications. Docker is a container platform. With Docker, users can download applications without the hassle of the installation and configuration process.

## Install Docker

{{< content "installing-docker-shortguide" >}}

## Download the Docker Node.js Server Image
The Docker Hub user page for Linode can be accessed [here](https://hub.docker.com/u/linode/). Select the **server-node-js** image for configuration information.

{{< note >}}
Docker images made for one operating system can be used on servers running a different OS. The **server-node-js** Ubuntu 14.04 image was tested on Debian 7, Ubuntu 14.04, CentOS 7 and Fedora 21. After Docker installation on CentOS and Fedora, run the `sudo service docker start` command.
{{< /note >}}

1.  Search for **linode** images:

        docker search linode

2.  Download the **linode/server-node-js** image:

        docker pull linode/server-node-js

## Run the Docker Container, Node.js, and the Web Server

1.  Run the Linode container. Forward the Linode's port 80 to port 3000 of the container:

        docker run -d -p 80:3000 linode/server-node-js

    {{< note respectIndent=false >}}
This command runs the docker image as a daemon.
{{< /note>}}

2.  Test the server at `example.com/test.htm`, replacing `example.com` with your Linode's IP address. A page with "Test File" should appear.

The [Docker Hub image page](https://registry.hub.docker.com/u/linode/server-node-js/) has information explaining what the Docker image contains.
