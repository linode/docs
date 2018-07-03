---
author:
  name: Linode
  email: docs@linode.com
description: 'A quick answer for why you should use Linux for development.'
og_description: 'A quick answer for why you should use Linux for development.'
keywords: ['linux', 'development', 'dev', 'develop', 'developing']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-07
modified: 2018-07-07
modified_by:
  name: Linode
title: Why Use Linux for Development?
---

Ever wonder what operating system would be best to develop your projects in? It can surely seem a daunting decision, or maybe it's one you never really considered before. The playing field between Linux, Windows, and macOS has become more level in recent years than ever, but Linux still has a lot to offer the developer looking for a system to call home.


## So Why Use Linux Over {other_system}? The TL:DR.

- Most Linux-based operating systems are free and the user experience has improved drastically over the years--this ain't your daddy's Linux.

- Some Linux distributions have very low minimum system resource requirements. These can be used to rescue aging computers from obsolescence so you don't need to buy a separate machine if you a want bare-metal workstation.

- Very customizable, from configuration files, to multiple shell choices, to desktop environments ranging from minimal window managers to a full-featured GUI.

- Native package management--many tools and libraries available for free from trusted sources.

- Native access to the [GNU toolchain](https://en.wikipedia.org/wiki/GNU_toolchain).

- It's often desirable to develop web applications in the environment that would be used in production. Since most web applications are deployed to Linux servers, writing your site and application on that same Linux variant can minimize deployment surprises.

- Most Linux distributions are are unofficially [POSIX](https://en.wikipedia.org/wiki/POSIX) compliant, meaning they adhere to the standards but haven't gone through POSIX certifications because of the fee involved.

-  Linux distributions don't collect user data.


## Let Us Consult the Internet

Online you'll find opinionated and polarized responses from all sides and of all degrees. While discussion may point you in one direction or another, this is a subjective and personal topic. You need to choose what works best for you, and that's a mixture of your preferences and requirements, exacted by light (or heavy) experimentation.

Some people just prefer Linux; others love Apple products. Others are heavily invested in Windows.

Some people feel the operating system they use daily is the best fit for them to work in. They're already comfortable and familiar with it, it provides everything they need, and they don't want to buy a separate machine or mess with containers or virtualization.

Others see OS platforms merely as tools and are impartial to switching between them for various tasks. If you don't have platform-specific requirements, then the platform you should choose is wherever you feel you can work efficiently and enjoyably.


## A Development Scenario

1.  Code is written in a text editor and/or IDE. This happens on a local machine--be a laptop, desktop, tablet or even a smartphone.

2.  That code is then pushed up to the cloud. For example, a remote repository, from which an automation system builds the application and runs some basic tests (the CI/CD pipeline).

3.  The application is further tested in a remote staging environment.

4.  The application is then deployed to production.

The above is just one scenario. It may be an oversimplification for yours, or may be slightly different, but it's meant to highlight that code is mostly written locally, not on remote servers.

This is usually done in a text editor or [integrated development environment](https://en.wikipedia.org/wiki/Integrated_development_environment) (IDE). This means the local system--the operating system you're writing your code in--needs very little in terms of hardware resources or special features, and unless you have strict requirements for the dev environment (like Visual Studio or Xcode), then the OS on that local machine can be whatever your preference.

You have even more configuration options if you take virtual machines and containers into consideration. It's possible to run, for example, Windows, Linux, macOS, and BSD from a single laptop if you choose. Compiling code locally is of course a trade-off of hardware performance versus time, but the principle is the same. If you're not locked to a specific IDE or build toolchain, then hardware upgrades are independent of the operating system and what to use for an OS is your choice.
