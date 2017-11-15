---
author:
  name: Linode
  email: docs@linode.com
description: 'A quick reference cheat sheet on Docker commands for installation, containers, images and more.'
keywords: ["docker", "quick reference", "cheat sheet", "commands"]
aliases: ['applications/containers/docker-quick-reference-cheat-sheet/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-03-30
modified_by:
  name: Linode
published: 2015-03-30
title: A Docker Commands Quick Reference Cheat Sheet
---
Docker is becoming increasingly popular among software developers, operators and enterprises as a software container platform. Containers package software in a format that can run isolated on a shared operating system. Bundled with only essential libraries and settings, Docker renders lightweight, efficient self-contained systems that run identically wherever deployed.

Optimizing the platform's functionality begins with mastery of requisite Docker commands, especially those listed on this cheat sheet that address installation, Hub interaction, and container and image creation and use.


## Installation

| Docker Syntax | Description |
|:-------------|:---------|
| **curl -sSL https://get.docker.com/ \| sh**    | The Docker maintained installation script<br> for **Debian** or **Ubuntu**.   |
| **sudo yum -y install docker** | The install command for **Centos 7**<br> or **Fedora 21** and up. |
| **sudo service docker start** | For **Centos 7** and **Fedora 21** after install,<br> Docker must be started.      |


## Docker Hub

| Docker Syntax | Description |
|:-------------|:---------|
| **sudo docker search** searchitem | Search Docker Hub for images. Replace <br>`searchitem` with a search-able term. |
| **sudo docker pull** user/image | Downloads an image from Docker Hub. |
| **sudo docker push** user/image | Uploads an image to Docker Hub. <br> A Docker Hub username is necessary. |


## Use Containers and Images

| Docker Syntax | Description |
|:-------------|:---------|
| **sudo docker run -t -i** user/image | Runs an image, creating a container and<br> changing the command prompt<br> to within the container. |
| **sudo docker run -p 80:3000 -t -i** user/image | Similar to the command above<br> but with port forwarding. |
| **`ctrl+p` then `ctrl+q`** | From the container's command prompt,<br> detach and return to the host's prompt. |
| **sudo docker attach** 1aa| Changes the command prompt<br> from the host to a running container.<br> Replace `1aa` with a container ID. |
| **sudo docker ps -a** | List all container instances, with their ID,<br> and status. |
| **sudo docker images** | Lists all images on the local machine. |
| **sudo docker rm -f** 1aa | Delete a container.<br> Replace `1aa` with a container ID. |
| **sudo docker commit** 1aa user/image | Save a container as an image.<br> Replace `1aa` with a container ID. |

## Image Creation

| Docker Syntax | Description |
|:-------------|:---------|
| **FROM ubuntu:14.04 <br> MAINTAINER Sample User** <user.email@email.com> <br> **RUN apt-get update** | Create an empty directory <br> with a file named **`Dockerfile`**, <br> then insert this syntax. <br> From the new directory,<br> run the build command,<br> listed below.|
| **sudo docker build -t sampleuser/ubuntu .** | Builds a Docker image<br> from a Docker file,<br> as shown above. |




