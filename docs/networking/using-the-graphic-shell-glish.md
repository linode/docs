---
author:
  name: Alex Fornuto
  email: docs@linode.com
description: 'Learn how to use Glish as a shell for managing graphic environments on your Linode.'
keywords: 'Console,Shell,glish,graphic'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, August 19th, 2015
modified_by:
  name: Alex Fornuto
published: 'Wednesday, August 19th, 2015'
title: 'Using the Graphic Shell (Glish) - BETA'
---

Glish is the graphical version of the [Linode Shell](using-the-linode-shell-lish) (LISH). It allows you to use a graphic environment running natively on your Linode's operating system.

{: .note }
> Linode base distribution images do not have graphic environments installed. You will need to intall one, or use a [Custom Distro](/docs/tools-reference/custom-kernels-distros/custom-distro-on-kvm-linode) with a graphic environment pre-installed.

## Enabling Glish

If your Linode has been running since August 19th, 2015 or earlier, Glish is not yet enabled on your Linode. To enable you will need to either:

- Reboot the Linode with the `distro helper` option enabled in the Configuration Profile
- Launch a new `getty` on `tty1`. The command will differ depending on your distribution, but may look like this:

	  exec /sbin/getty -8 38400 tty1 &

## Accessing Glish

From your Linode Dashboard, click on the **Remote Access** Tab. Under **Console Access**, click on the "Launch Graphical Web Console" link:

[![Glish access link.](/docs/assets/glish-link_small.png)](/docs/assets/glish-link.png)


