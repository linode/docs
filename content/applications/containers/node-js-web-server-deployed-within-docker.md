---
author:
  name: Joe D.
  email: docs@linode.com
description: 'Deploy a Node.js Server in a Docker Container.'
keywords: ["docker", "node.js", "node", "debian", "ubuntu", "web server", "javascript", "container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-03-23
modified_by:
  name: Linode
published: 2015-03-23
title: 'Node.js Web Server deployed within Docker'
aliases: ['applications/containers/nodejs-node-js-web-server-docker-container/']
---

Node.js is a server-side, JavaScript package, often used for various cloud applications. Docker is a container platform. With Docker, users can download applications without the hassle of the installation and configuration process.

## Install Docker
Use the Docker-maintained install script for Debian or Ubuntu. For other operating systems, see the [Docker Installation](https://docs.docker.com/en/latest/installation/) guides.

1.  Install Docker:

        curl -sSL https://get.docker.com/ | sh

    {{< note >}}
The current version of the Docker script checks for AUFS support and displays the warning below if support is not found:

Warning: current kernel is not supported by the linux-image-extra-virtual
          package.  We have no AUFS support.  Consider installing the packages
          linux-image-virtual kernel and linux-image-extra-virtual for AUFS support.
          + sleep 10

This message can be safely ignored, as the script will continue the installation using DeviceMapper or OverlayFS. If you require AUFS support, you will need to configure a [distribution supplied](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub) or [custom compiled](/docs/tools-reference/custom-kernels-distros/custom-compiled-kernel-with-pvgrub-debian-ubuntu) kernel.
{{< /note >}}

2.  If necessary, add the non-root user to the "docker" group:

        sudo usermod -aG docker example_user

## Download the Docker Node.js Server Image
The Docker Hub user page for Linode can be accessed [here](https://hub.docker.com/u/linode/). Select the **server-node-js** image for configuration information.

{{< note >}}
Docker images made for one operating system can be used on servers running a different OS. The **server-node-js** Ubuntu 14.04 image was tested on Debian 7, Ubuntu 14.04, Centos 7 and Fedora 21. After Docker installation on Centos and Fedora, run the `sudo service docker start` command.
{{< /note >}}

1.  Search for **linode** images:

        sudo docker search linode

2.  Download the **linode/server-node-js** image:

        sudo docker pull linode/server-node-js

## Run the Docker Container, Node.js, and the Web Server
Note that when an image downloads, no image containers run.

1.  Run, create or activate a new container. Forward the Linode's port 80 to port 3000 of the container:

        sudo docker run -p 80:3000 -t -i linode/server-node-js /bin/bash

     {{< caution >}}
This command also changes the terminal prompt to the root user within the new container.
{{< /caution >}}

2.  From the container's command prompt, change to the home directory, list the present files, and look at the server configuration:

        cd
        ls
        cat server.js

3.  Using the Node Version Manager, activate Node.js:

        nvm use 0.10

4.  Using the forever module, start the web server:

        forever start server.js

5.  To exit the container while leaving it running, press `ctrl + p` and then `ctrl + q`.

6. Test the server at `123.45.67.89/test.htm`, replacing `123.45.67.89` with your Linode's IP address. A page with "Test File" should appear.

The [Docker Hub image page](https://registry.hub.docker.com/u/linode/server-node-js/) has information explaining what the Docker image contains.

## For More Information
 - [Linode Docker Hub Page](https://hub.docker.com/u/linode/)
 - [Docker Docs](http://docs.docker.com/)
 - [Docker Try it Tutorial](https://www.docker.com/tryit/)
 - [Docker Hub](https://hub.docker.com/)


