---
author:
  name: Linode
  email: docs@linode.com
description: 'Log in to CoreOS Container Linux.'
keywords: 'coreos, container linux, login, core'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 'Monday, May 8th, 2017'
modified_by:
  name: Linode
published: 'Monday, May 8th, 2017'
title: How to Log in to CoreOS Container Linux on Linode
---

The `root` user is not active by default in Container Linux, so root log in is not available. Instead log in as the `core` user.

## Log in to CoreOS Over SSH

![Log in as core user SSH](/docs/assets/container-linux-login-ssh.png)

1.  From your local terminal, enter:

        ssh core@<your_linode's_IP>

2.  At the `password:` prompt, enter the `core` user's password you assigned when deploying Container Linux.

## Log in to CoreOS Through the Console (Lish or Glish)

![Log in as core user Lish](/docs/assets/container-linux-login-lish.png)

1.  At the `login:` prompt, enter `core`.

2.  At the `password:` prompt, enter the `core` user's password you assigned when deploying Container Linux.

{: .note}
>
> If you are not already familiar with the serial and graphical Linode shells, see the [Using the Linode Shell (Lish)](/docs/networking/using-the-linode-shell-lish) and [Use the Graphic Shell, Glish, to Manage Graphic Environments on Your Linode](/docs/networking/use-the-graphic-shell-glish) guides.