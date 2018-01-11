---
author:
  name: Linode
  email: docs@linode.com
description: "Intel recently disclosed two vulnerabilities that affect processors in most devices over the last 23 years. Here's how that affects you and what you can do about it."
keywords: ["meltdown", "spectre", "vulnerability", "kernel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-11
modified: 2018-01-11
modified_by:
  name: Linode
title: 'What You Need to do to Mitigate Meltdown and Spectre'
promo: false
external_resources:
  - '[MeltdownAttack.com](https://meltdownattack.com/)'
  - '[How to Install Software Updates](/docs/getting-started/#install-software-updates)'
  - '[Reboot Survival Guide](/docs/uptime/reboot-survival-guide/)'
---

## Summary

Virtually every processor manufactured in the last 23 years is potentially affected by two recently discovered processor vulnerabilities: Meltdown and Spectre. Linode is continuing to implement patches on datacenter equipment. In the meantime, update your Linux kernel and reboot to help protect your system.

### What Should I Do?

* Visit our [Reboot Survival Guide](/docs/uptime/reboot-survival-guide/) to prepare for a graceful reboot.
* [Update your kernel](/docs/platform/meltdown_statement/#how-to-reboot-into-an-updated-kernel) and reboot.
* [Follow our blog for updates](https://blog.linode.com/2018/01/03/cpu-vulnerabilities-meltdown-spectre/).

### Linode Infrastructure Status

| **Exploit**  | **Fix**  | **Information**  |
|---|---|---|
| **Meltdown**  | In progress   | Patching in progress.   |
| **Spectre-V1**  |  No | No patch is available yet.   |
| **Spectre-V2**   |  No | No patch is available yet.   |

## What does this mean for Linode Customers?

The last two weeks have seen the tech world buzzing about two recently revealed processor vulnerabilities, *Meltdown* and *Spectre*. These are extremely complex vulnerabilities, and the extent of affected hardware is not yet fully known. In short, they allow cached information in your system’s memory to be read by an attacker.

Virtually all devices, including Linode servers, are potentially vulnerable to one or both of these exploits.

Intel processors are the most susceptible, though Meltdown affects ARM chips as well while Spectre can potentially be exploited on any processor type. See [meltdownattack.com](https://meltdownattack.com/) for the technical details on these vulnerabilities.

## Meltdown

The Linux kernel source code was [patched for Meltdown](https://cdn.kernel.org/pub/linux/kernel/v4.x/ChangeLog-4.14.11) on January 2, 2018 with the release of `4.14.11`. Earlier this week, Linode began updating its host systems with a patched kernel.

**For your Linode to be secure against Meltdown, both our hosts and your Linode need to be patched.**

The *Linode Latest* kernel was upgraded accordingly and `4.14.12` is currently available. If you use the Linode kernel, reboot into `4.14.11` or later to help secure your Linode against Meltdown.

### How to Reboot into an Updated Kernel

1.  Shut down your Linode.

2.  Go to your Linode's dashboard and edit your configuration profile.

3.  Under **Boot Settings**, select **Latest 64 Bit**.

4.  Boot your Linode and verify your kernel version:

        root@localhost:~# uname -r
        4.14.12-x86_64-linode92

If you boot your Linode using **GRUB** or **Direct Disk** boot setting, your kernel is supplied by your distribution’s maintainers, not Linode. You should [update your kernel](/docs/tools-reference/linux-package-management/) to the latest available version using the distribution's package manager. This is also the recommended mitigation path for any hardware you use at home–from your laptop, to network hardware, to home servers. If you’ve compiled your own kernel, you’ll need to recompile using the 4.14.11 or later source code.

For more information about about rebooting your Linode, visit our [Reboot Survival Guide](/docs/uptime/reboot-survival-guide/).

## Spectre
Where Meltdown is a specific attack implementation, Spectre targets the way modern CPUs work, regardless of speculative execution. Nearly all computing platforms manufactured since 1995 are vulnerable to Spectre, including non-x86 systems such as ARM, IBM PowerSystems, and other architectures.

Intel is currently developing microcode updates to mitigate Spectre, and there is a Linux kernel patch ([IBRS](https://lwn.net/Articles/743019/)) also in development. When these are available, we’ll apply both to our hosts and notify customers of the updates.

## How does the Meltdown patch affect me?

As a result of the mitigation put in place by the Linux kernel, there may be a small reduction in performance. The performance impact greatly depends on whether your workload is heavy on system calls and disk I/O.
This applies to any system with an affected CPU, regardless of whether it is cloud-based or not.

## How can I stay updated with Linode’s progress?

The [Linode blog](https://blog.linode.com/2018/01/03/cpu-vulnerabilities-meltdown-spectre/) will be updated daily with our progress of the fleet reboot, patches and other related issues.
