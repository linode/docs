---
 author:
 name: Linode Community
 email: docs@linode.com
description: ‘The Apache Solr search platform provides web administrators with a customizable and scalable open source solution for managing online content.
keywords: 'vim, editor'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Search With Solr'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

Upon completing the steps in this guide, you will have a fully installed Solr instance ready to integrate with your website, as well as performed some basic configuration.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

{: .note}
> Some of the commands below require elevated privilidges to execute, and must be prefixed with `sudo` when necessary.

# Install Solr

While various ways of installing Solr exist, downloading from the Apache website ensures you will receive the latest version.

## Update System And Install Pre-requisites

1. Update system packages.

    **Debian-based**

        apt update -y && apt upgrade -y

    **Fedora & RHEL based**

        yum update -y && yum upgrade -y

    **Arch linux**

        pacman -Syu

    **OpenSuse**

        zypper dup

2. Install Java

    **Debian-based**

    a.

        echo "deb http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee /etc/apt/sources.list.d/webupd8team-java.list

        echo "deb-src http://ppa.launchpad.net/webupd8team/java/ubuntu xenial main" | tee -a /etc/apt/sources.list.d/webupd8team-java.list

        apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys EEA14886

        apt-get update

        apt-get install oracle-java8-installer 

    **Fedora & RHEL based**

        yum install java-1.8.0-openjdk.x86_64

    **Arch linux**

        pacman -Syu

    **OpenSuse**
