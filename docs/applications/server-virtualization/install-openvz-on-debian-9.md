---
 author:
 name: Linode Community
 email: docs@linode.com
description: 'OpenVZ is a software based OS virtualization tool enabling the deployment, management, and modification of isolated virtual Linux environments from within a host Linux distribution. An extensive array of pre-built OS templates in a variety of Linux distributions allow users to rapidly download and deploy virtual environments with ease.'
keywords: 'openvz, virtualization'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published:
modified:
modified_by:
  name: Linode
title: 'Install OpenVZ On Debian 9'
contributor:
   name: Andrew Lescher
   link: [Andrew Lescher](https://www.linkedin.com/in/andrew-lescher-87027940/)
external_resources:
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn up to $300 per published guide.*

---

## Introduction To This Tutorial

Upon completing this guide, you will have installed OpenVZ on your Linode and learned how to download and deploy a virtual environment.

## Before You Begin

1. Working through this tutorial requires the use of a limited user account. If you have yet to create one, follow the steps in the [Securing Your Server](/docs/security/securing-your-server) guide.

2. The instructions in this guide were written for and tested on Debian 9 only. They are unlikely to work for other Debian or Ubuntu distributions.

3. Certain essential modifications to your Debian 9 system are required to run OpenVZ. They include the removal and replacement of Systemd with SystemV, and the use of a custom Linux kernel. 
