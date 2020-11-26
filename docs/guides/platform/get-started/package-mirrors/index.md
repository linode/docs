---
slug: package-mirrors
author:
  name: Linode
  email: docs@linode.com
description: Setting Linode Package Mirrors.
keywords: ["package", "mirrors", "linode", "repository", "Debian", "Ubuntu", "CentOS", "yum", "apt-get"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/package-mirrors/','/platform/package-mirrors/']
modified: 2016-11-21
modified_by:
  name: Linode
published: 2014-02-11
title: Package Mirrors
tags: ["linode platform"]
---

Linode offers public package mirrors for Ubuntu, Debian, and CentOS. When you install updates and new packages, you must download them from package mirrors. The primary advantage of using the Linode package mirrors versus other public package mirrors is speed.

![Setting Linode Package Mirrors.](package_mirrors_smg.png "Setting Linode Package Mirrors.")

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

For best performance, you will want to use the mirror in the same data center as your Linode. When using the Linode DNS resolvers, **mirrors.linode.com** will resolve to the mirror within the same data center. For public queries, mirrors.linode.com will return a round robin of the US locations.

Instructions for setting the package mirror location are provided in the following subsections.

### Ubuntu System Settings

For a Ubuntu system follow the instructions below:

1.  Edit the `sources.list` file with the following command:

        sudo nano /etc/apt/sources.list

2.  Replace the line containing the address <http://us.archive.ubuntu.com/ubuntu/> with the new address location:

    <http://mirrors.linode.com/ubuntu/>

3.  Do not modify lines containing the address <http://security.ubuntu.com/ubuntu/>. These lines contain security updates for packages.

4.  Save and exit the `sources.list` file.

### Debian System Settings

For a Debian system follow the instructions below:

1.  Edit the `sources.list` file with the following command:

        sudo nano /etc/apt/sources.list

2.  Replace the line containing the address <http://ftp.us.debian.org/debian/> with the new address location:

    <http://mirrors.linode.com/debian/>

3.  Do not modify lines containing the address <http://security.debian.org/>. These lines contains security updates for packages.

4.  Save and exit the `sources.list` file.

### CentOS System Settings

For a CentOS system follow the instructions below:

1.  By default, `yum` will try using fastest mirror available. This need to be disabled to use Linode's mirror. Edit the `fastestmirror.conf` file with the following command:

        sudo nano /etc/yum/pluginconf.d/fastestmirror.conf

2.  Change the `enabled=` variable to **0**:

    {{< file "/etc/yum/pluginconf.d/fastestmirror.conf" >}}
enabled=0

{{< /file >}}

3.  Save and exit the `fastestmirror.conf` file.
4.  Edit the `CentOS-Base.repo` file with the following command:

        sudo nano /etc/yum.repos.d/CentOS-Base.repo

5.  Comment each `mirrorlist` line by adding the **\#** sign before each line.
6.  Uncomment each `baseurl` line by removing the **\#** sign before each line.
7.  Edit all `baseurl` lines containing the address http://mirror.centos.org/centos/$releasever/os/$basearch/ to reflect the new address location:

        http://mirrors.linode.com/centos/$releasever/os/$basearch/

8.  Save and exit the `CentOS-Base.repo` file.
