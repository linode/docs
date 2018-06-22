---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Docker CE'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "containers", "docker CE"]
modified: 2018-04-24
modified_by:
  name: Sam Foo
title: "How to Install Docker CE"
published: 2018-01-08
shortguide: true
show_on_rss_feed: false
---

<!-- Install Docker CE using the official Docker repositories. -->

These steps install Docker Community Edition (CE) using the official Ubuntu repositories. To install on another distribution, see the official [installation page](https://docs.docker.com/install/).

{{< note >}}
Docker CE is not officially supported on Ubuntu 18.04 LTS. You can install a testing candidate by replacing `stable` in the `add-apt-repository` command below with `test`.
{{< /note >}}

1.  Remove any older installations of Docker that may be on your system:

        sudo apt remove docker docker-engine docker.io

2.  Make sure you have the necessary packages to allow the use of Docker's repository:

        sudo apt install apt-transport-https ca-certificates curl software-properties-common

3.  Add Docker's GPG key:

        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

4.  Verify the fingerprint of the GPG key:

        sudo apt-key fingerprint 0EBFCD88

    You should see output similar to the following:

        pub   4096R/0EBFCD88 2017-02-22
              Key fingerprint = 9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
        uid                  Docker Release (CE deb) <docker@docker.com>
        sub   4096R/F273FCD8 2017-02-22

5.  Add the `stable` Docker repository:

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

6.  Update your package index and install Docker CE:

        sudo apt update
        sudo apt install docker-ce

7.  Add your limited Linux user account to the `docker` group:

        sudo usermod -aG docker exampleuser

    You will need to restart your shell session for this change to take effect.

8.  Check that the installation was successful by running the built-in "Hello World" program:

        docker run hello-world
