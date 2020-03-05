---
author:
  name: Linode
  email: docs@linode.com
description: 'Install Docker CE on a Linode running Debain 10'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "containers", "docker CE"]
modified: 2020-03-06
modified_by:
  name: Linode
title: "How to Install Docker CE on Debian 10"
published: 2018-01-08

---

<!-- Install Docker CE using the official Docker repositories. -->

These steps install Docker Community Edition (CE) using the official Debian repositories. To install on another distribution, or to install on Mac or Windows, see the official [installation page](https://docs.docker.com/install/).

1.  Remove any older installations of Docker that may be on your system:

        sudo apt remove docker docker-engine docker.io

2.  Make sure you have the necessary packages to allow the use of Docker's repository:

        sudo apt install apt-transport-https ca-certificates curl software-properties-common

3.  Add Docker's GPG key:

        curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -

4.  Verify the fingerprint of the GPG key:

        sudo apt-key fingerprint 0EBFCD88

    You should see output similar to the following:

    {{< output >}}
pub   4096R/0EBFCD88 2017-02-22
        Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid                  Docker Release (CE deb) <docker@docker.com>
sub   4096R/F273FCD8 2017-02-22
{{< /output >}}

5.  Add the `stable` Docker repository:

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"

    {{< note >}}
If you get an `E: Package 'docker-ce' has no installation candidate` error, this is because the stable version of docker is not yet available. Therefore, you will need to use the edge / test repository.
{{< /note >}}

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable edge test"

6.  Update your package index and install Docker CE:

        sudo apt update
        sudo apt install docker-ce

7.  Add your limited Linux user account to the `docker` group:

        sudo usermod -aG docker $USER

    {{< note >}}
After entering the `usermod` command, you will need to close your SSH session and open a new one for this change to take effect.
{{< /note >}}

8.  Check that the installation was successful by running the built-in "Hello World" program:

        docker run hello-world
