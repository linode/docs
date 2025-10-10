---
title: "Choosing a Linux Distribution"
title_meta: "How to Choose a Linux Distribution"
description: "A list of all the Linux distributions provided on the Linode Platform and advice for how to select a distribution for your next project."
published: 2019-07-15
modified: 2023-12-19
keywords: ["distro", "distribution", "operating system", "Linux"]
tags: ["linux"]
aliases: ['/quick-answers/linux/choosing-a-distribution/','/guides/choosing-a-distribution/']
---

## What is a Distribution?

**Distributions**, also called *distros*, can be described as different operating system versions built on top of the underlying Linux Kernel to support a variety of use-cases and preferences. Since all distributions are built on Linux, most are similar and can be used interchangeably. Ubuntu, for example, is the most popular for it's ease of use and the ability to abstract smaller configuration tasks for you by default. Arch Linux, on the other hand, favors a high level of control over simplicity so that you can fine tune the way that your system functions.

## List of Distributions Available on Linode

Below is a full list of distributions. Once you've decided on a distribution, it's typically recommended to select the latest *LTS* (Long Term Support) release on systems intended for production use. This ensures that the system receives security updates for as long as possible. For release and version information, see [Supported Distributions](https://www.linode.com/distributions/).

| Distribution | Description |
|------|-------|
| [AlmaLinux](https://almalinux.org/) | A nearly binary compatible derivative of RHEL intended to provide a long-term stable replacement for CentOS. Made by the same team as [CloudLinux OS](https://www.cloudlinux.com/) |
| [Alpine](https://alpinelinux.org/) | **Recommended for advanced Linux users only.** Lightweight distribution popular with [Docker](https://www.docker.com/) and security minded users. |
| [Arch](https://www.archlinux.org/) | **Recommended for advanced Linux users only.** Powerful and detail oriented, empowers more advanced users to fine tune their configuration. |
| [CentOS](https://www.centos.org) | Widely popular in professional and business settings while still being accessible to the average user. Versions 8 and earlier are binary equivalents of their corresponding RHEL (Red Hat Enterprise Linux) release. [CentOS Stream](https://www.redhat.com/en/topics/linux/what-is-centos-stream) has replaced CentOS and receives updates *just* ahead of the corresponding RHEL version. |
| [Debian](https://www.debian.org/) | A popular and stable distribution that's been actively maintained longer than most other distributions. |
| [Fedora](https://getfedora.org/) | Implements bleeding edge software. Fedora is similar though more advanced than CentOS and great for users who want to use the newest of the new and don't mind an added layer of complexity.  |
| [Gentoo](https://www.gentoo.org/) | **Recommended for advanced Linux users only.** Advanced distribution designed for power users who want more control over their configuration and are comfortable compiling everything from source. |
| [Kali Linux](https://www.kali.org/) | **Recommended for advanced Linux users only.** A specialized and advanced Debian-based distribution designed for penetration testing and security auditing. This is a [minimum installation](https://www.kali.org/docs/troubleshooting/common-minimum-setup/), allowing you to install only the tools and metapackages you require. |
| [openSUSE Leap](https://www.opensuse.org/) | Provides powerful tools specific to system administration tasks. Starting with version 15.3, this distribution maintains parity with SLE (SUSE Linux Enterprise), making it a great choice for users of SLE or those looking to benefit from enterprise-grade stability. |
| [Rocky Linux](https://rockylinux.org/) | A nearly binary compatible derivative of RHEL intended to provide a long-term stable replacement for CentOS. Built by a community team led by the founder of the CentOS project. |
| [Slackware](http://www.slackware.com/) | **Recommended for advanced Linux users only.** The oldest actively maintained distribution. One of the most UNIX-like Linux distributions available. |
| [Ubuntu](https://ubuntu.com/) | Arguably the most popular Linux distribution, widely regarded for it's ease of use. The LTS versions of Ubuntu are featured heavily in Linode's guides and across the community. |

{{< note >}}
Though this list covers most popular distributions, creating a Linode using a distribution that we do not provide is possible. Feel free to follow our [Custom Distribution Guide](/docs/guides/install-a-custom-distribution/) for more information.
{{< /note >}}