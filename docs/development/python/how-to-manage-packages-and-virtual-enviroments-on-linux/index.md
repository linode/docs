---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-06
modified_by:
  name: Linode
title: "How to Manage Python Packages and Virtual Environments on Linux"
contributor:
  name: Angel Guarisma
  link: https://github.com/guaris
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
Python 

## Before You Begin

This guide will cover the basic concepts of using Python Virtual Environments, and installing Python packages. This guide will use Python 3. If you want to install Python 3 on your system, please refer to the following guides:

- [How to Install Python on Ubuntu 20.04](/docs/development/python/how-to-install-python-on-ubuntu)
- [How to Install Python on Debian](/docs/development/python/how-to-install-python-on-debian)
- [How to Install Python on CentOS](/docs/development/python/how-to-install-python-on-centos)


{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}
