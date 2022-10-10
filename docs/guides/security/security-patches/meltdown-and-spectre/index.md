---
slug: meltdown-and-spectre
author:
  name: Linode
  email: docs@linode.com
description: "This guide details the recent vulnerabilities disclosed by intel which affect processors installed in most devices from the last 23 years and what you can do about it."
keywords: ["meltdown", "spectre", "vulnerability", "kernel"]
aliases: ['/security/security-patches/meltdown-and-spectre/','/security/meltdown-and-spectre/','/platform/meltdown_statement/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-01-11
modified: 2018-11-08
modified_by:
  name: Linode
title: 'What You Need to Do to Mitigate Meltdown and Spectre'
promo_default: false
external_resources:
  - '[MeltdownAttack.com](https://meltdownattack.com/)'
  - '[How to Install Software Updates](/docs/guides/set-up-and-secure/#perform-system-updates)'
  - '[Reboot Survival Guide](/docs/guides/reboot-survival-guide/)'
  - '[Linode Blog: CPU Vulnerabilities: Meltdown & Spectre](https://blog.linode.com/2018/01/03/cpu-vulnerabilities-meltdown-spectre/)'
tags: ["security"]
---

## Summary

Virtually every processor manufactured in the last 23 years is potentially affected by two recently discovered processor vulnerabilities: Meltdown and Spectre. Linode is continuing to implement patches on data center equipment. In the meantime, update your Linux kernel and reboot to help protect your system.

## FAQ

### Can this maintenance be postponed or rescheduled?

No. Due to the critical nature and logistical requirements of these updates, we aren’t able to reschedule or push back the provided maintenance windows. Our team is working around the clock to have our infrastructure patched against the Meltdown and Spectre vulnerabilities as quickly as possible.

### Can I start this maintenance early?

No. Unlike our scheduled migrations, you won’t be able to initiate the maintenance early.

### What’s Linode’s current status on patching these vulnerabilities?

Our current infrastructure status for each vulnerability is listed in our Meltdown and Spectre document found [in the chart below](#linode-infrastructure-status).

### What does “Phase Complete” in the Linode Manager mean?

Maintenance for the Meltdown and Spectre vulnerabilities is happening in multiple phases, which are described in our Meltdown and Spectre document found here. As each phase is completed for the physical host on which your Linode resides, we will display progress updates in the Linode Manager.

To fully mitigate the Meltdown and Spectre vulnerabilities, additional maintenance will be required in the future. When the future maintenance has been scheduled, we will provide additional information.

You can find more information and stay updated on our progress by checking out the [What Should I Do?](#what-should-i-do) section below.

### When will the next maintenance phase take place?

We don't yet have an ETA on when the next round of maintenance will begin. Once we do, we'll provide additional information in the Linode Manager, as well as through Support tickets.

### Is there anything that I need to do?

Yes. To further protect your Linode, we strongly recommend that you verify it is configured to boot using the `4.14.11` or newer kernel, which includes patches to help address these vulnerabilities. If your Linode’s Configuration Profile is set to utilize our latest kernel, your kernel will automatically be updated to the patched version upon rebooting.

### Can I reboot my Linode with the new kernel to avoid the maintenance?

Yes, but while rebooting with the new kernel will help prepare your Linode for the upcoming maintenance and help protect you against Meltdown, it will not replace the need for this maintenance. In order to fully address the vulnerabilities, we will need to perform maintenance on our infrastructure as scheduled. We will update the status of our maintenance phases within the Linode Manager and [in the chart below](#linode-infrastructure-status).

## What Should I Do?

* Visit our [Reboot Survival Guide](/docs/guides/reboot-survival-guide/) to prepare for a graceful reboot.
* [Update your kernel](#how-to-reboot-into-an-updated-linode-kernel) and reboot.
* [Follow our blog for updates](https://blog.linode.com/2018/01/03/cpu-vulnerabilities-meltdown-spectre/).

### Linode Infrastructure Status

| **Exploit**    | **Fix**  | **Information**            |
|----------------|----------|----------------------------|
| **Meltdown**   | Deployed | Patching is complete.      |
| **Spectre-V1** |    Deployed    | Patching is complete. |
| **Spectre-V2** | Deployed    | Patching is complete. |


### Update: Spectre-V2 Patch

The patch for Spectre-V2 has been released for your Linode. You can deploy the Linode-level patch including the newly released [Retpoline](https://security.googleblog.com/2018/01/more-details-about-mitigations-for-cpu_4.html) fix by updating your Linode's kernel.

If you use a Linode-supplied kernel follow [these steps](#how-to-reboot-into-an-updated-linode-kernel) to make sure your Linode has the latest fix. If you use a distribution-supplied kernel, please check your distribution's website for more information.

Spectre-V2 mitigation is a two-stage process. The second stage is host-level fixes. Host-level patching has been completed across Linode's entire fleet as of May 22, 2018.

## What does this mean for Linode Customers?

Earlier this year, the tech world was buzzing about two processor vulnerabilities, *Meltdown* and *Spectre*. These are extremely complex vulnerabilities, and the extent of affected hardware is not yet fully known. In short, they allow cached information in your system’s memory to be read by an attacker.

Virtually all devices, including Linode servers, are potentially vulnerable to one or both of these exploits.

Intel processors are the most susceptible, though Meltdown affects ARM chips as well while Spectre can potentially be exploited on any processor type. See [meltdownattack.com](https://meltdownattack.com/) for the technical details on these vulnerabilities.

## Meltdown

The Linux kernel source code was [patched for Meltdown](https://cdn.kernel.org/pub/linux/kernel/v4.x/ChangeLog-4.14.11) on January 2, 2018 with the release of `4.14.11`. Earlier this week, Linode began updating its host systems with a patched kernel.

**For your Linode to be secure against Meltdown, both our hosts and your Linode need to be patched.**

The *Linode Latest* kernel was upgraded accordingly and `4.14.12` is currently available. If you use the Linode kernel, reboot into `4.14.11` or later to help secure your Linode against Meltdown.

### How to Reboot into an Updated Linode Kernel

1.  Go to your Linode's dashboard and edit your configuration profile.

2.  Under **Boot Settings**, select **Latest 64 Bit**.

3.  Reboot your Linode and verify your kernel version:

        root@localhost:~# uname -r
        4.14.12-x86_64-linode92

### How to Update a Distribution-Supplied Kernel

If you boot your Linode using the **GRUB** or **Direct Disk** boot setting, your kernel is supplied by your distribution’s maintainers, not Linode. If you’ve compiled your own kernel, you’ll need to recompile using the 4.14.11 or later source code.

1. Update your kernel to the latest available version using the distribution's package manager:

    **CentOS**

        sudo yum update kernel

    **Debian**

        sudo apt-get update
        sudo apt-get upgrade linux-base

    **Ubuntu**

        sudo apt-get update
        sudo apt-get upgrade linux-generic

2. Reboot your system. When it comes back up, use the command `uname -r` to verify you are running the new kernel against the patched version given in your distribution's security bulletin (see links below). This is also the recommended mitigation path for any hardware you use at home: your laptop, network hardware, and home servers.

    [CentOS 6](https://access.redhat.com/errata/RHSA-2018:0007) (see the *Overview* tab), [CentOS 7](https://access.redhat.com/errata/RHSA-2018:0007), [Debian](https://security-tracker.debian.org/tracker/CVE-2017-5754), [Ubuntu](https://people.canonical.com/~ubuntu-security/cve/2017/CVE-2017-5754.html).

## Spectre
Where Meltdown is a specific attack implementation, Spectre targets the way modern CPUs work, regardless of speculative execution. Nearly all computing platforms manufactured since 1995 are vulnerable to Spectre, including non-x86 systems such as ARM, IBM PowerSystems, and other architectures.

## How does the Meltdown patch affect me?

As a result of the mitigation put in place by the Linux kernel, there may be a small reduction in performance. The performance impact greatly depends on whether your workload is heavy on system calls and disk I/O.
This applies to any system with an affected CPU, regardless of whether it is cloud-based or not.

## How can I stay updated with Linode’s progress?

The [Linode blog](https://blog.linode.com/2018/01/03/cpu-vulnerabilities-meltdown-spectre/) will be updated daily with our progress of the fleet reboot, patches and other related issues.
