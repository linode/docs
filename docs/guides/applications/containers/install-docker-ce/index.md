---
slug: install-docker-ce
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Docker CE'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["docker", "containers", "docker CE"]
tags: ["container","docker"]
modified: 2018-04-24
modified_by:
  name: Sam Foo
title: "How to Install Docker CE"
published: 2018-01-08
headless: true
show_on_rss_feed: false
aliases: ['/applications/containers/install-docker-ce/']
---

<!-- Install Docker CE using the official Docker repositories. -->

These steps install Docker Community Edition (CE) using the official Ubuntu repositories. To install on another distribution, or to install on Mac or Windows, see the official [installation page](https://docs.docker.com/install/).

1.  Remove any older installations of Docker that may be on your system:

        sudo apt remove docker docker-engine docker.io

1.  Make sure you have the necessary packages to allow the use of Docker's repository:

        sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg

1.  Add Docker's GPG key:

        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

1.  Verify the fingerprint of the GPG key:

        sudo apt-key fingerprint 0EBFCD88

    You should see output similar to the following:

    {{< output >}}
pub   rsa4096 2017-02-22 [SCEA]
      9DC8 5822 9FC7 DD38 854A  E2D8 8D81 803C 0EBF CD88
uid           [ unknown] Docker Release (CE deb) <docker@docker.com>
sub   rsa4096 2017-02-22 [S]
{{< /output >}}

1.  Add the `stable` Docker repository:

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

    {{< note >}}
For Ubuntu 19.04, if you get an `E: Package 'docker-ce' has no installation candidate` error, this is because the stable version of docker is not yet available. Therefore, you will need to use the edge / test repository.

    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable edge test"
{{< /note >}}

1.  Update your package index and install Docker CE:

        sudo apt update
        sudo apt install docker-ce

1.  Add your limited Linux user account to the `docker` group:

        sudo usermod -aG docker $USER

    {{< note >}}
After entering the `usermod` command, you will need to close your SSH session and open a new one for this change to take effect.
{{< /note >}}

1.  Check that the installation was successful by running the built-in "Hello World" program:

        docker run hello-world
