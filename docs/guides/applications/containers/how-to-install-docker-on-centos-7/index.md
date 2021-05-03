---
slug: how-to-install-docker-on-centos-7
author:
  name: Linode Community
  email: docs@linode.com
description: 'A guide on how to install Docker Engine and grant privileges to users on a CentOS 7 Linux system using a Linode as the example.'
keywords: ['docker','centos','docker engine','centos 7','install docker on centos 7']
tags: ["docker","containers"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-26
modified_by:
  name: Linode
title: "How to Install Docker Engine on CentOS 7"
h1_title: "How to Install Docker Engine on CentOS 7."
contributor:
external_resources:
- '[Docker main page](https://www.docker.com/)'
- '[Docker Docs](https://docs.docker.com/)'
- '[containerd main page](https://containerd.io/)'
---
Docker allows you to create, deploy, and manage lightweight, stand-alone packages (called "containers") containing the code, libraries, runtime, system settings, and dependencies needed to run an application. Each one has resources for CPU, memory, block I/O, and network without depending on a kernel or operating system. This all starts by installing the Docker Engine. This article covers installing the Docker Engine from the stable repository (as that's the easiest way to keep it updated in the future) on a Linode running CentOS 7 (it should apply to Red Hat and Red Hat Enterprise Linux derivatives, as well).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Before You Begin

{{< note >}}
This is a more extensive "Before You Begin" section than many of our other guides. Be sure to follow these directions closely to prepare your CentOS 7 system for installing Docker Engine properly.
{{< /note >}}

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and have a Linode (or other system) running CentOS 7.

2.  Update your CentOS system:
    - enter `sudo yum check-update` and let it run;
    - then enter `sudo yum clean all`;
    - to clear YUM fully, reboot the system by entering `sudo reboot` (or reboot in the Linode Manager);
    - lastly, once the system reboots, enter `sudo yum update` and let it run.

3.  The "CentOS-7 - Extras" YUM repository must be enabled (it is installed and enabled by default).
    - check to see what YUM repositories are enabled by entering `yum repolist`.
        The output should look like this (if you do not see the line that starts "!updates/7/x86_64," you need to re-enable the repository):
        {{< output >}}
repo id                              repo name                            status
!base/7/x86_64                       CentOS-7 - Base                      10,072
!extras/7/x86_64                     CentOS-7 - Extras                       468
!updates/7/x86_64                    CentOS-7 - Updates                    1,964
repolist: 12,504
{{< /output >}}
    - re-enable the repository by entering `sudo yum-config-manager --enable extras`.

4.  The yum-utils package is necessary. Add it by entering `sudo yum install -y yum-utils`.

## Install and Start Docker Engine on CentOS 7

Once the steps in [Before You Begin](#before-you-begin) are complete and your CentOS 7 system is prepared, you can start installing the Docker Engine itself.

To install and start Docker Engine (and containerd) on CentOS 7:

1.  At the command prompt (either via SSH or Lish in the Linode Manager), enter `sudo yum install docker-ce docker-ce-cli containerd.io`.
    - If you're prompted with a GPG key, verify `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35` and accept it.

2.  Start Docker by entering `sudo systemctl start docker`.

3.  Verify Docker is correctly installed by running the "hello-world" image by entering `sudo docker run hello-world`. The output should look like this:
    {{< output >}}
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
b8dfde127a29: Pull complete
Digest: sha256:f2266cbfc127c960fd30e76b7c792dc23b588c0db76233517e1891a4e357d519
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
{{< /output >}}

The Docker Engine is now installed on your CentOS 7 system.

### Configure Docker to Start at System Boot

To have Docker and containerd start on boot, enter `sudo systemctl enable docker.service && sudo systemctl enable containerd.service`.

## Managing Docker with a Non-Root User

By default, `sudo` is required to run Docker commands, but a "docker" group was created during installation. When the Docker daemon starts, it opens a Unix socket for the "docker" group members.

{{< caution >}}
The "docker" group grants privileges equivalent to those of a root user. See [Docker Daemon Attack Surface](https://docs.docker.com/engine/security/#docker-daemon-attack-surface) on Docker's docs site for more information about how that can affect system security. To run the Docker daemon without using root privileges, see [Run the Docker daemon as a non-root user (Rootless mode)](https://docs.docker.com/engine/security/rootless/).
{{< /caution >}}

To grant a user access to the docker group:

1.  At the command prompt (either via SSH or Lish in the Linode Manager), enter `sudo usermod -aG docker example_user` (substitute the correct username for "example_user").

2.  Log out and log back in as the other user (or have them log in).

3.  Verify the user can run `docker` commands without `sudo` by entering `docker run hello-world` (the output should look similar to the output above).

### Resolving Errors with Loading Config Files

If the user had run `sudo docker` commands before joining the group, they might be presented with a failure loading the config file, like this:
    {{< output >}}
WARNING: Error loading config file: /home/user/.docker/config.json -
stat /home/user/.docker/config.json: permission denied
{{< /output >}}

The issue is the .docker directory in their home directory (~/.docker) was created with permissions granted by `sudo`.

There are two possible fixes. Either:

1.  Remove the .docker directory from their home directory. Docker will automatically recreate it, but any custom settings will be lost.

2.  Change the permissions on the directory with `sudo chown example_user:example_user /home/example_user/.docker -R` and then `sudo chmod g+rwx "/home/example_user/.docker" -R`.