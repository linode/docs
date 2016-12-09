---
author:
  name: Phil Zona
  email: docs@linode.com
description: Install OpenVAS to scan your system for vulnerabilities.
keywords: 'openvas,debian,ubuntu'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, December 7th, 2016
modified_by:
  name: Linode
published: 'Wednesday, December 7th, 2016'
title: Install OpenVAS on Debian 8 and Ubuntu 16.04
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. 

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

