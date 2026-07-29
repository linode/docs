---
slug: log-in-to-coreos-container-linux
title: Log in to CoreOS Container Linux
description: 'This quick answer guide will show you how to log in to CoreOS Container Linux.'
authors: ["Linode"]
contributors: ["Linode"]
published: 2017-05-08
keywords: ["coreos", "container linux", "login", "core"]
tags: ["container","linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: []
---

The `root` user is not active by default in Container Linux, so root login is not available. Instead, log in as the `core` user.

## Log in to CoreOS Over SSH

![Log in as core user SSH](container-linux-login-ssh.png)

1.  From your local terminal, enter:

        ssh core@<your_Linode_IP>

2.  At the `password:` prompt, enter the `core` user's password you assigned when first having deployed Container Linux.

## Log in to CoreOS Through the Console (Lish or Glish)

![Log in as core user Lish](container-linux-login-lish.png)

1.  At the `login:` prompt, enter `core`.

2.  At the `password:` prompt, enter the `core` user's password you assigned when first having deployed Container Linux.

{{< note >}}
If you are not already familiar with the serial and graphical Linode shells, see the [Using the Lish Console](https://techdocs.akamai.com/cloud-computing/docs/access-your-system-console-using-lish) and [Access Your Linux Desktop Using Glish](https://techdocs.akamai.com/cloud-computing/docs/access-your-desktop-environment-using-glish) guides.
{{< /note >}}
