---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'Basic Node.js Server in a Docker Container.'
keywords: 'docker, nodejs, node.js, node, debian, ubuntu, server, web server, js, javascript'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Thursday, March 19th, 2015
modified_by:
  name: Joseph Dooley
published: 'Thursday, March 19th, 2015'
title: Basic Node.js Web Server with Docker
---


Node.js is a server-side JavaScript package, often used for various cloud applications. Docker is a container platform that allows users to download pre-configured apps without the hassle of the installation and configuration process.

##Install Docker
Use the Docker-maintained install script for Debian or Ubuntu. For other operating systems, see the [Docker Installation](https://docs.docker.com/en/latest/installation/) guides.

1.  Install Docker:

        curl -sSL https://get.docker.com/ | sh

2.  If necessary, add the non-root user to the "docker" group:

        sudo usermod -aG docker example_user

##Download the Docker Node.js Server Image
The Docker Hub user page for Linode can be accessed [here](https://hub.docker.com/u/linode/). Select the **nodejs-server** image for configuration information.

{: .note}
>
>Docker containers made for one operating system can be used on servers running a different OS.

1.  Search for **linode** user images:

        sudo docker search linode

2.  Download the **linode/nodejs-server** image:

        sudo docker pull linode/server-node-js

##Run a Docker Container, Node.js, and the Web Server

{: .note}
>
>When an image downloads, there are no image containers running. 

1.  Run, create, or turn on a new container. Forward the Linode's port 80 to port 3000 of the container:

        sudo docker run -p 80:3000 -t -i linode/server-node-js /bin/bash 

     {: .caution }
    >
    > This command also changes the terminal prompt to the root user within the new container.

2.  From the container's command prompt, change to the home directory, list the present files, and look at the server configuration:

        cd
        ls
        cat server.js

3.  Using the Node Version Manager, activate Node.js:

        nvm use 0.10

4.  Using the forever module, start the web server:

        forever start server.js

5.  To exit the container while leaving it running, press `ctrl + p` then `ctrl + q`.

6. Test the server at `123.45.67.89/test.htm`, replacing `123.45.67.89` with your Linode's IP address. A page with "Test File" should appear.

To learn more about that the Docker image contains, visit the [Docker Hub image page](https://registry.hub.docker.com/u/linode/server-node-js/).

## For More Information
 - [Linode Docker Hub Page](https://hub.docker.com/u/linode/)
 - [Docker Docs](http://docs.docker.com/)
 - [Docker Try it Tutorial](https://www.docker.com/tryit/)
 - [Docker Hub](https://hub.docker.com/)


