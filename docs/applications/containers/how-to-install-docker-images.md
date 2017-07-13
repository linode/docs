---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Jack Wallen
  link: https://twitter.com/jlwallen
description: 'An introduction to using Docker, containers, and dockerfiles on your Linode.'
keywords: 'docker,container,dockerfile'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, June 28, 2017
modified_by:
  name: Linode
published: 'Wednesday, June 28, 2017'
title: 'How to Install Docker and Pull Images '
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Try it Tutorial](https://www.docker.com/tryit/)'
 - '[Docker Hub](https://hub.docker.com/)'
 

---


### Installing Docker and Pulling Images from Docker Hub

This tutorial will walk you through the installation of Docker, and the first steps of pulling down images with the intention of spinning them up as containers. 


### Getting Started

In order to install Docker, you must first gain shell access to your Linux deployment. To do this, you must know your Linode IP address. To find that, log into your Linode account and click on the Linodes tab. Within this window, you'll see the **Remote Access tab**; click on that tab to reveal the public IP of your Linode. 

![Remote_Access](/docs/assets/Docker/dockerisntall_a.jpg)

Use the IP to `ssh` into your Linode: 

	ssh root@public_ip

Update and upgrade your Linode: 

	apt update
	apt upgrade 

Now, Install Docker: 

	apt install docker.io 
	
You will be presented with all of the necessary dependencies and asked to accept the installation. Type `y` and the installation will start and finish without issue. Docker is now installed. 

{:.note}
>
>If you are using CentOS7, the installation of Docker is a bit different. Use `sudo yum check-update` followed by, `curl-fsSL https://get.docker.com/| sh

Docker has added the group `docker` to your Linode, let's make a user `user`, give it `sudo` privildges, and add it to the Docker group. 

	adduser user
	usermod -aG docker user

### Enabling Docker

However, the Docker engine is not running. We need to start and enable it, such that it will run at boot. Using these two commands we can start and initialize the Docker daemon: 

	systemctl start docker
	systemctl enable docker
	
	
### Pulling Images

The first thing you are going to want to do is pull down an image to be used as the basis for your Docker containers. The default registry to pull images from is the [Docker Hub](https://hub.docker.com/). Check to se what images already exist on our system:

	docker images

![docker_image](/docs/assets/Docker/dockerinstall_b.jpg)

This output shows that no images are installed. 

You can pull the [Nginx web server](https://nginx.org/en/), using the `docker pull` command: 

	docker pull nginx

This will pull the latest **official** nginx Docker image

![docker_image](/docs/assets/Docker/dockerinstall_c.jpg)

Now, `docker images` will return: 

![docker_image](/docs/assets/Docker/dockerinstall_d.jpg)

If you don't want to install the official Nginx Image, you will be surprised to find there are quite a lot of variants to be found by using `docker search`. To find out what other Nginx images can be pulled, use: 

	docker search nginx
	
This will list all of the variant images along with a description, and whether or not they are official.

![docker_image](/docs/assets/Docker/dockerinstall_e.jpg)

If you want to pull one of the other images, simply use: 

	docker pull blacklabelops/nginx

### Ready to Keep Going? 

At this point, you should know how to install Docker and pull down images. With those images, you can then deploy containers. Use `man docker` to dive into the manual and learn more. 
