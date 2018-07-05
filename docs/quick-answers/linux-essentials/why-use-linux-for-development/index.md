---
author:
  name: Linode
  email: docs@linode.com
description: 'A quick answer for why you should use Linux for development.'
og_description: 'A quick answer for why you should use Linux for development.'
keywords: ['linux', 'development', 'dev', 'develop', 'developing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-05
modified: 2018-07-05
modified_by:
  name: Linode
title: Why Use Linux for Development?
---

Ever wonder what operating system would be best to develop your projects in? It can surely seem a daunting decision, or maybe it's one you never really considered before. The playing field between Linux, Windows, and macOS has become more level in recent years than ever, but Linux still has a lot to offer the developer looking for a system to call home.

## Why Use Linux over Another Operating System?

-   Most Linux-based operating systems are free, and the user experience has improved drastically over time.

-   Linux is used for a large majority of cloud server deployments, which is where new internet-connected services are frequently hosted.

-   It can be desirable to develop applications in the environment that will be used in production. If you are going to ultimately host your application on a cloud-based Linux server, writing your site and application on that same Linux variant can minimize deployment surprises.

-   Linux distributions offer native package management--many tools and libraries are available for free from trusted sources. Because Linux is so popular, there is usually already a robust solution for any development tools that you may need. As well, Linux is often where many new server technologies are first made available.

-   Linux is very customizable, from configuration files, to multiple shell choices, to desktop environments ranging from minimal window managers to a full-featured GUI.

-   Some Linux distributions have very low minimum system resource requirements. These can be used to rescue aging computers from obsolescence so you don't need to buy a separate machine if you a want bare-metal workstation. Or, you can buy a low-cost [Raspberry Pi](https://www.raspberrypi.org) to start experimenting.

-   Most Linux distributions are are unofficially [POSIX](https://en.wikipedia.org/wiki/POSIX) compliant. This basically means that much of the way Linux behaves is very similar to other operating systems, so the knowledge you gain from using it is often transferable to other environments.

-   Linux distributions don't collect user data.

## How to Get Started with Linux

There are a number of pathways to adopting Linux in your work, and you don't need to immediately reinstall the operating system on your desktop or laptop computer. Instead, you can progressively include it in your development flow:

-   If you have an older spare computer you don't use anymore, consider installing it on that instead. Some Linux distributions, like Ubuntu and Linux Mint, market themselves as more beginner-friendly. These include basic installation guides provided by those distributions:

    -   [Install Ubuntu desktop](https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop#0)
    -   [Linux Mint Installation Guide](https://linuxmint-installation-guide.readthedocs.io/en/latest/)

-   Purchase a [Raspberry Pi](https://www.raspberrypi.org/). Raspberry Pis are small, affordable computers that run Linux and are designed to facilitiate learning about the platform and programming in general. There is a very active Raspberry Pi community, and there are lots of [example projects](https://projects.raspberrypi.org/en/) to follow along and learn from.

-   Create a Linode and work with Linux remotely. The Linode platform offers a fast way to create Linux servers, and you are only billed for the time between when you create a server and when you remove it. If you create a Linode and test something out, you can remove it after the test finishes to save money. Or, if your test doesn't work out the way you'd hoped, you can remove the Linode, create a new one, and start fresh. Linode provides a [Getting Started](docs/getting-started/) guide for beginners on the platform.

## A Development Scenario

The following scenario is one way (out of many possibilities) to adopt Linux in your development; this example could apply to writing a web application:

1.  Write your code in a text editor and/or [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment). This happens on a local machine--a laptop, desktop, tablet or even a smartphone. This can be on the platform you're used to, including Macs and Windows PCs. If you eventually decide that you prefer Linux on your desktop computer, you could choose that too.

1.  Push your code to a Linode running a self-hosted [Git](https://www.linode.com/docs/development/version-control/how-to-configure-git/) repository, like [GitLab](https://about.gitlab.com). [Connect your GitLab repo](https://docs.gitlab.com/ee/integration/jenkins.html) with a [CI/CD tool](https://linode.com/docs/development/ci/introduction-ci-cd/) like [Jenkins](https://jenkins.io) to perform automatic testing of the code.

1.  Use Jenkins or a similar tool to also [deploy your application](https://jenkins.io/doc/pipeline/tour/deployment/) to another Linode used as your staging environment.

1.  Use that tool again to later push the application to a third Linode representing your production environment.

In this workflow, a lot of the heavy lifting is being done by cloud servers running Linux, but you can still enjoy the creature-comforts of the desktop OS you enjoy most. At the same time, the work of setting up the Git repository and staging/production servers would be an efficient method for learning Linux.