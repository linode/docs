---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Use unison to synchronize files between two machines.'
keywords: ["backup", "syncronize files", "unison", "debian", "debian lenny"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/unison/']
modified: 2017-08-23
modified_by:
  name: Linode
published: 2010-04-20
title: Synchronize Files with Unison
external_resources:
 - '[Unison Project Home Page](http://www.cis.upenn.edu/~bcpierce/unison/)'
---

Unison is a file synchronization tool that allows users to maintain two instances of a given file set on two systems up to date and identical. The tool is designed for maximum usability in a variety of contexts and uses protocols like SSH to securely transfer data between folders. Furthermore, the system is designed to be fault tolerant in the case of interruptions and modifications to both "source" and "remote," and aims to always leave both instances of a file or directory tree in a known working state. Unison can be deployed to synchronize files between systems running disparate operating systems, to backup systems, or as part of a content deployment system, among a plethora of other use cases.

Before beginning this guide, we assume you have completed the [getting started guide](/docs/getting-started/). If you're new to Linux system administration, we recommend considering the [introducing Linux concepts](/docs/tools-reference/introduction-to-linux-concepts) guide and the [administration basics](/docs/using-linux/administration-basics) guide. If you're simply looking to gain access to your Linode on your local system, you may want to consider deploying a [remote file system](/content/networking/ssh-filesystems/). Conversely, if you need a more complex backup system, your needs may be better served by an incremental backup system.

## Install Unison on a Linode

{{< caution >}}
Unison is no longer [maintained under active development](https://www.cis.upenn.edu/~bcpierce/unison/status.html).
{{< /caution >}}

### Debian 5 (Lenny)

Begin by installing the required software for Unison on the remote machine. Issue the following sequence of commands to ensure that your system's package database is up to date, that all installed packages are up to date, and install Unison:

    apt-get update
    apt-get upgrade
    apt-get install unison

Debian also includes packages for Unison version 2.13 (packaged as `unison2.13.16`) if you need to use this older version of the software to interact with a specific client. Otherwise, install the more recent version of Unison, packaged as `unison`.

### Ubuntu 10.04 (Lucid)

Edit the `/etc/apt/sources.list` to enable to the Universe repositories, so that it resembles the following:

{{< file "/etc/apt/sources.list" >}}
## main & restricted repositories deb <http://us.archive.ubuntu.com/ubuntu/> lucid main restricted deb-src <http://us.archive.ubuntu.com/ubuntu/> lucid main restricted

deb <http://security.ubuntu.com/ubuntu> lucid-security main restricted deb-src <http://security.ubuntu.com/ubuntu> lucid-security main restricted

## universe repositories deb <http://us.archive.ubuntu.com/ubuntu/> lucid universe deb-src <http://us.archive.ubuntu.com/ubuntu/> lucid universe deb <http://us.archive.ubuntu.com/ubuntu/> lucid-updates universe deb-src <http://us.archive.ubuntu.com/ubuntu/> lucid-updates universe

deb <http://security.ubuntu.com/ubuntu> lucid-security universe deb-src <http://security.ubuntu.com/ubuntu> lucid-security universe

{{< /file >}}


Finally, issue the following sequence of commands to: ensure that your system's package database is up to date, that all installed packages are up to date, and install Unison:

    apt-get update
    apt-get upgrade
    apt-get install unison

### CentOS 5

The unison packages for CentOS are not included in the base distribution, but are included in the [EPEL](https://fedoraproject.org/wiki/EPEL) repositories. Enable the EPEL repository, and ensure that your system is up to date and install unison with the following commands:

    rpm -Uvh http://download.fedora.redhat.com/pub/epel/5/i386/epel-release-5-4.noarch.rpm
    yum update
    yum install unison227

The EPEL repository also includes a package for Unison version 2.13 in the `unison213` package. This may be helpful if you need to use this version of the client, otherwise use the more recent version of the software.

### Fedora

On Fedora systems issue the following sequence of commands to ensure that your system is up to date and then install Unison:

    yum update
    yum install unison

### Arch Linux

Ensure that your local copy of the package database is up to date before installing Unison by issuing the following commands:

    pacman -Sy
    pacman -S unison

## Install Unison on Local Machines

In order to function properly, the major and minor version numbers of Unison used by the remote and local system must match. Test the version of Unison that was installed by the package manager on your Linode by issue the following command:

    unison -version

Use the information provided by the output of this command to aid in your decision on the appropriate version of your client.

If you are running a Linux-based system on your local machine you can install unison tools using the above procedures. If you're running Debian or Ubuntu systems, you can issue the following command to install a graphical front-end for Unison:

    apt-get install unison-gtk

Debian 5 (Lenny) also includes a graphical user interface for Unison version 2.13, packaged as `unison2.13.16-gtk`.

If you're running OS X or Windows, download an appropriate [Unison client](http://alan.petitepomme.net/unison/index.html). When successfully installed, provide the client with the resolvable address of the remote server, SSH keys or other authentication credentials, and the *absolute* paths to the local and remote folders that you want to synchronize. From now on, when you run Unison from the client app, changes to either or both of the specified file systems will be updated and reflected in both instances. Congratulations!
