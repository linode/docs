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
| Docker Command | Description | 
|:-------------|:---------| 
| curl -sSL https://get.docker.com/ \| sh    | The docker maintained installation script for Debian or Ubuntu.   | 
| sudo yum -y install docker | The install command for Centos 7 or Fedora 21 and up. | 
| by the hypens| above.      |

###Image Creation

{: .table .table-striped .table-bordered} 
| Docker Command | Description | 
|:-------------|:---------| 
| curl -sSL https://get.docker.com/     | The docker maintained|