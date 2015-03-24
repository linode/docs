---
author:
  name: Joseph Dooley
  email: jdooley@linode.com
description: 'A docker quick reference guide or cheat sheet.'
keywords: 'docker,quick reference,cheat sheet,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, February 23rd, 2015
modified_by:
  name: Joseph Dooley
published: 'Monday, February 23rd, 2015'
title: Docker Quick Reference
---

Docker is a Linux based container platform. Docker images and containers can be pulled down from or pushed up to Docker Hub for quick installation of applications.

##Docker


###Installation

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| curl -sSL https://get.docker.com/ \| sh    | The docker maintained installation script<br> for **Debian** or **Ubuntu**.   | 
| sudo yum -y install docker | The install command for **Centos 7**<br> or **Fedora 21** and up. | 
| sudo service docker start | For **Centos 7** and **Fedora 21** after install,<br> docker must be started.      |

###Image Creation

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| FROM ubuntu:14.04 <br> MAINTAINER Sample User <user.email@email.com> <br> RUN apt-get update | Create an empty directory with a file named "Docker", <br> insert this text. From the new directory,<br> run the build command, listed below.|
| sudo docker build -t sampleuser/ubuntu . | Builds a Docker image from a Docker file, as shown above. |
| sudo docker images | Lists all images on the local machine. |

###Docker Hub

{: .table .table-striped .table-bordered} 
| Docker Syntax | Description | 
|:-------------|:---------| 
| sudo docker search SearchItem | Search Docker Hub for images. Replace <br>"SearchItem" with a search-able term. |
| sudo docker build -t sampleuser/ubuntu . | Builds a Docker image from a Docker file, as shown above. |
| sudo docker images | Lists all images on the local machine. |