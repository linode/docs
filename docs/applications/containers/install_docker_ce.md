---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Docker CE'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "containers", "docker CE"]
modified: 2018-01-05
modified_by:
  name: Sam Foo
title: "How to Install Docker CE"
published: 2018-01-08
shortguide: true
show_on_rss_feed: false
---

<!-- Install Docker CE using the official Docker repositories. -->

1.  At the time of writing, the recommended Docker installation is Docker CE. Remove any older installations of Docker that may be on your system:

        apt remove docker docker-engine docker.io

2.  Make sure you have the necessary packages to allow the use of Docker's repository:

        apt install apt-transport-https ca-certificates curl software-properties-common

3.  Add Docker's GPG key:

        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

4.  Verify the fingerprint of the GPG key:

        apt-key fingerprint 0EBFCD88

    You should see output similar to the following:

        pub   4096R/0EBFCD88 2017-02-22
              Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
        uid                  Docker Release (CE deb) <docker@docker.com>
        sub   4096R/F273FCD8 2017-02-22

5.  Add the `stable` Docker repository:

        add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

6.  Update your package index and install Docker CE:

        apt update
        apt install docker-ce

7.  Add your limited user account to the `docker` group:

        usermod -aG docker exampleuser

    You will need to restart your shell session for this change to take effect.

8.  Check that the installation was successful by running the built-in "Hello World" program:

        docker run hello-world

