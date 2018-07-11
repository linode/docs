---
author:
  name: Linode
  email: docs@linode.com
description: 'A quick answer for why you should use Linux for development.'
og_description: 'A quick answer for why you should use Linux for development.'
keywords: ['linux', 'development', 'dev', 'develop', 'developing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-11
modified: 2018-07-11
modified_by:
  name: Linode
title: Why Use Linux for Development?
---

Ever wonder what operating system would be best to develop your projects in? It can seem a daunting decision, or maybe it's one you never really considered before. The playing field between Linux, Windows, and macOS has become more level in recent years than ever, but Linux still has a lot to offer the developer looking for a system to call home.

This is a subjective and personal topic. You need to choose what works best for you, and that's a mixture of your preferences and requirements, exacted by experimentation. Some people just prefer Linux; others love Apple products. Others are heavily invested in Windows.

Some people feel the operating system they use daily is the best to work in. They're already comfortable and familiar with it, it provides everything they need, and they don't want to buy a separate machine or involve containers or virtualization.

Others see OS platforms merely as tools and are impartial to switching between them for various tasks. If you don't have platform-specific requirements, then the platform you should choose is wherever you feel you can work efficiently and enjoyably.

## A Development Scenario

1. Code is written in a text editor and/or [integrated development environment](https://en.wikipedia.org/wiki/Integrated_development_environment) (IDE). This happens on a local machine--be a laptop, desktop, tablet or even a smartphone.

1. That code is then pushed up to the cloud. For example, a remote repository, from which an automation system builds the application and runs some basic tests (the CI/CD pipeline).

1. The application is further tested in a remote staging environment.

1. The application is then deployed to production.

The above is just one scenario. It may be differ from yours but it's meant to highlight that code is mostly written locally, not on remote servers.

The local system--the operating system you're writing your code in--needs very little in terms of hardware resources or special features, and unless you have strict requirements for the dev environment (like Visual Studio or Xcode), then the OS on that local machine can be whatever your preference.

You have even more configuration options if you take virtual machines and containers into consideration. It's possible to run, for example, Windows, Linux, macOS, and BSD from a single laptop if you choose. Compiling code locally is of course a trade-off of hardware performance versus time, but the principle is the same. If you're not locked to a specific IDE or build toolchain, then hardware upgrades are independent of the operating system and what to use for an OS is your choice.

## Why Use Linux over Another Operating System?

- Most Linux-based operating systems are free, and the user experience has improved drastically over time.

- Linux is used for a large amount of cloud server deployments. It can be desirable to develop applications in the environment that will be used in production. If you are going to ultimately host your application on a cloud-based Linux server, writing your site and application on that same Linux variant can minimize deployment surprises.

- Linux distributions offer native package management--many tools and libraries are available for free from trusted sources.

- Linux is often where many new server technologies are first made available.

- Native access to the [GNU toolchain](https://en.wikipedia.org/wiki/GNU_toolchain).

- Linux is very customizable, from configuration files, to multiple shell choices, to desktop environments ranging from minimal window managers to a full-featured GUI.

- Some Linux distributions have very low minimum system resource requirements. These can be used to rescue aging computers from obsolescence so you don't need to buy a separate machine if you a want bare-metal workstation.

- Most Linux distributions are are unofficially [POSIX](https://en.wikipedia.org/wiki/POSIX) compliant. This basically means that much of the way Linux behaves is very similar to other operating systems, so the knowledge you gain from using it is often transferable to other environments.

- Linux distributions don't collect user data.

## How to Get Started with Linux

There are a number of ways to adopt Linux in your work, and it's not necessary to immediately reinstall your computer's operating system. Instead, you can progressively include Linux in your development flow:

- Consider installing Linux on an older spare computer if you have one. Some Linux distributions, like Ubuntu and Linux Mint, market themselves as more beginner-friendly. These include basic installation guides provided by those distributions:

    - [Install Ubuntu desktop](https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop#0)
    - [Linux Mint Installation Guide](https://linuxmint-installation-guide.readthedocs.io/en/latest/)

- Purchase a [Raspberry Pi](https://www.raspberrypi.org/). Raspberry Pis are small, affordable computers which and an easy introduction to Linux. There is an active Raspberry Pi community, and many [example projects](https://projects.raspberrypi.org/en/) to follow and learn from.

- Create a Linode and work with the Linux command line remotely. The Linode platform offers a fast way to create Linux servers, and you are only billed for the time between when you create a server and when you remove it. If you create a Linode and test something out, you can remove it after the test finishes to save money. Or, if your test doesn't work out the way you'd hoped, you can remove the Linode, create a new one, and start fresh.