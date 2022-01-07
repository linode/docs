---
author:
  name: Linode
  email: docs@linode.com
title: Install NVIDIA Driver Dependencies
description: "How to install GPU NVIDIA driver dependencies."
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