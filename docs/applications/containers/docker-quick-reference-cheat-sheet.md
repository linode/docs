---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'A docker quick reference guide or cheat sheet.'
keywords: 'docker,quick reference,cheat sheet,commands'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, March 30th, 2015
modified_by:
  name: Joseph Dooley
published: 'Monday, March 30th, 2015'
title: Docker Quick Reference
---

##Installation

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| **curl -sSL https://get.docker.com/ \| sh**    | The Docker maintained installation script<br> for **Debian** or **Ubuntu**.   | 
| **sudo yum -y install docker** | The install command for **Centos 7**<br> or **Fedora 21** and up. | 
| **sudo service docker start** | For **Centos 7** and **Fedora 21** after install,<br> Docker must be started.      |


##Docker Hub

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| **sudo docker search** searchitem | Search Docker Hub for images. Replace <br>"searchitem" with a search-able term. |
| **sudo docker pull** user/image | Downloads an image from Docker Hub. |
| **sudo docker push** user/image | Uploads an image to Docker Hub. <br> A Docker Hub username is necessary. |


##Using Containers and Images


{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| **sudo docker run -t -i** user/image | Runs an image, creating a container.<br> Changing the command prompt<br> to within the container. |
| **sudo docker run -p 80:3000 -t -i** user/image | Similar to the command above<br> but with port forwarding. |
| **`ctrl+p` then `ctrl+q`** | From the container's command prompt,<br> detach and resume to the<br> host's command prompt. |
| **sudo docker attach** 1aa| Changes the command prompt<br> from the host's to a running container's.<br> Replace “1aa” with a container ID. |
| **sudo docker ps -a** | List all container instances, with their ID,<br> and status. |
| **sudo docker images** | Lists all images on the local machine. |
| **sudo docker rm -f** 1aa | Delete a container.<br> Replace "1aa" with a container ID. |
| **sudo docker commit** 1aa user/image | Save a container as an image.<br> Replace "1aa" with a container ID. |

##Image Creation

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| **FROM ubuntu:14.04 <br> MAINTAINER Sample User** <user.email@email.com> <br> **RUN apt-get update** | Create an empty directory <br> with a file named **"Dockerfile"**, <br> then insert this syntax. <br> From the new directory,<br> run the build command,<br> listed below.|
| **sudo docker build -t sampleuser/ubuntu .** | Builds a Docker image<br> from a Docker file,<br> as shown above. |





