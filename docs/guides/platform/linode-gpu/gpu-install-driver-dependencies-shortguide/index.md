---
slug: gpu-install-driver-dependencies-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to install NVIDIA driver dependencies for Linode GPU Instances.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Install NVIDIA driver dependencies for Linode GPU Instances
keywords: ["gpu"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/linode-gpu/gpu-install-driver-dependencies-shortguide/']
---

Prior to installing the driver, you should install the required dependencies. Listed below are commands for installing these packages on many popular distributions.

1. Find your Linode's distribution from the list below and install the NVIDIA driver's dependencies:

    **Ubuntu 18.04:**

        sudo apt-get install build-essential

    **Debian 9:**

        sudo apt-get install build-essential
        sudo apt-get install linux-headers-`uname -r`

    **CentOS 7:**

        sudo yum install kernel-devel-$(uname -r) kernel-headers-$(uname -r)
        sudo yum install wget
        sudo yum -y install gcc

    **OpenSUSE:**

        zypper install gcc
        zypper install kernel-source

1. After installing the dependencies, reboot your Linode from the [Cloud Manager](https://cloud.linode.com). Rebooting will ensure that any newly installed kernel headers are available for use.
