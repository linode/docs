---
author:
  name: Linode
  email: docs@linode.com
description: 'This quick answer guide will show you how to log in to CoreOS Container Linux.'
keywords: ["coreos", " container linux", " login", " core"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-05-08
modified_by:
  name: Linode
published: 2017-05-08
title: Log in to CoreOS Container Linux
---

The `root` user is not active by default in Container Linux, so root login is not available. Instead, log in as the `core` user.

<div class="wistia_responsive_padding" style="padding:56.25% 0 0 0;position:relative;"><div class="wistia_responsive_wrapper" style="height:100%;left:0;position:absolute;top:0;width:100%;"><iframe src="//fast.wistia.net/embed/iframe/5vtavtxheq?videoFoam=true" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="100%" height="100%"></iframe></div></div><script src="//fast.wistia.net/assets/external/E-v1.js" async></script>

## Log in to CoreOS Over SSH

![Log in as core user SSH](/docs/assets/container-linux-login-ssh.png)

1.  From your local terminal, enter:

        ssh core@<your_linode's_IP>

2.  At the `password:` prompt, enter the `core` user's password you assigned when first having deployed Container Linux.

## Log in to CoreOS Through the Console (Lish or Glish)

![Log in as core user Lish](/docs/assets/container-linux-login-lish.png)

1.  At the `login:` prompt, enter `core`.

2.  At the `password:` prompt, enter the `core` user's password you assigned when first having deployed Container Linux.

{{< note >}}
If you are not already familiar with the serial and graphical Linode shells, see the [Using the Linode Shell (Lish)](/docs/networking/using-the-linode-shell-lish) and [Use the Graphic Shell, Glish, to Manage Graphic Environments on Your Linode](/docs/networking/use-the-graphic-shell-glish) guides.
{{< /note >}}
