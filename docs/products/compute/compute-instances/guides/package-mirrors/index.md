---
title: Package Mirrors
description: 'Linode offers public package mirrors for Ubuntu, Debian, and CentOS. This guide provides you with instructions on how to mirror those package repositories. '
keywords: ["package", "mirrors", "linode", "repository", "Debian", "Ubuntu", "CentOS", "yum", "apt-get"]
published: 2014-02-11
modified: 2023-03-14
modified_by:
  name: Linode
tags: ["linode platform"]
image: package_mirrors_smg.png
aliases: ['/package-mirrors/','/platform/package-mirrors/','/guides/package-mirrors/']
authors: ["Linode"]
---

Linode offers public package mirrors for Ubuntu, Debian, and CentOS. When you install updates and new packages, you must download them from package mirrors. The primary advantage of using the Linode package mirrors versus other public package mirrors is speed.

Linode package mirrors are available in all of our data centers. The mirrors can be found at:

- <http://atlanta.mirrors.linode.com/>
- <http://dallas.mirrors.linode.com/>
- <http://frankfurt.mirrors.linode.com/>
- <http://fremont.mirrors.linode.com/>
- <http://london.mirrors.linode.com/>
- <http://mum1.mirrors.linode.com/>
- <http://newark.mirrors.linode.com/>
- <http://singapore.mirrors.linode.com/>
- <http://syd1.mirrors.linode.com/>
- <http://tor1.mirrors.linode.com/>
- <http://shinagawa.mirrors.linode.com/>


## Package Mirror Settings

For best performance, you will want to use the mirror in the same data center as your Compute Instance. When using the Linode DNS resolvers, **mirrors.linode.com** will resolve to the mirror within the same data center. For public queries, mirrors.linode.com will return a round robin of the US locations.

Instructions for setting the package mirror location are provided in the following subsections.

### Ubuntu System Settings

For a Ubuntu system follow the instructions below:

1. Edit the `sources.list` file with the following command:

    ```command
    sudo nano /etc/apt/sources.list
    ```

1. Replace the line containing the address <http://us.archive.ubuntu.com/ubuntu/> with the new address location:

    ```command
    http://mirrors.linode.com/ubuntu/
    ```

1. Do not modify lines containing the address <http://security.ubuntu.com/ubuntu/>. These lines contain security updates for packages.

1. Save and exit the `sources.list` file.

### Debian System Settings

For a Debian system follow the instructions below:

1. Edit the `sources.list` file with the following command:

    ```command
    sudo nano /etc/apt/sources.list
    ```

1. Replace the line containing the address <http://ftp.us.debian.org/debian/> with the new address location:

    ```command
    http://mirrors.linode.com/debian/
    ```

1. Do not modify lines containing the address <http://security.debian.org/>. These lines contains security updates for packages.

1. Save and exit the `sources.list` file.

### CentOS System Settings

For a CentOS system follow the instructions below:

1. By default, `yum` will try using fastest mirror available. This need to be disabled to use Linode's mirror. Edit the `fastestmirror.conf` file with the following command:

    ```command
    sudo nano /etc/yum/pluginconf.d/fastestmirror.conf
    ```

1. Change the `enabled=` variable to **0**:

    ```file {title="/etc/yum/pluginconf.d/fastestmirror.conf"}
    ...
    enabled=0
    ...
    ```

1. Save and exit the `fastestmirror.conf` file.

1. Edit the `CentOS-Base.repo` file with the following command:

    ```command
    sudo nano /etc/yum.repos.d/CentOS-Base.repo
    ```

1. Comment each `mirrorlist` line by adding the **\#** sign before each line.

1. Uncomment each `baseurl` line by removing the **\#** sign before each line.

1. Edit all `baseurl` lines containing the address http://mirror.centos.org/centos/$releasever/os/$basearch/ to reflect the new address location:

    ```command
    http://mirrors.linode.com/centos/$releasever/os/$basearch/
    ```

1. Save and exit the `CentOS-Base.repo` file.
