---
author:
  name: Josh Sager
  email: docs@linode.com
description: KVM Reference explains the differences when going from Xen to KVM virtualization.
keywords: ["kvm", "kvm reference", "virtual machine mode", "kvm linode", "xen"]
aliases: ['platform/kvm/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2016-09-14
modified_by:
  name: Alex Fornuto
published: 2015-06-15
title: 'KVM Reference'
---

Linode's current virtualization stack is built on KVM. Previously, Linode used Xen, and older Linodes may still be on the Xen platform. Along with the increased performance of KVM virtualization, several details are different between Xen and KVM Linodes.

## What's Changed?

### Block Device Assignment

Device assignments for Xen Linodes were labeled as:

 * */dev/xvda*
 * */dev/xvdb*
 * */dev/xvdc*


KVM Linodes use the "*sd*" naming convention:

 * */dev/sda*
 * */dev/sdb*
 * */dev/sdc*

### Console

On KVM Linodes, the console device moves from *hvc0* in Xen to *ttyS0* .

### Virtual Machine Mode

Virtual machine mode determines whether devices inside your virtual machine are *paravirtualized* or *fully virtualized*. The differences are listed below:

|         | Paravirtualization  | Full-virtualization   |
|---------|:--------------------|:----------------------|
| Block   | Virtio SCSI         | IDE                   |
| Net     | Virtio Net          | e1000                 |
| Serial  | ttyS0               | ttyS0                 |

{{< note >}}
If you're unfamiliar with these distinctions, choose paravirtualization
{{< /note >}}

### Custom Kernel Configuration

If you want to build your own guest kernel, you must include the following modules:

* KVM Guest
* Enable Virtio drivers
* IDE support (for full virtualization)
* e1000 support (for full virtualization)

For standard paravirtualized KVM Linodes, add the following to your kernel `.config` file:

    CONFIG_KVM_GUEST=y
    CONFIG_VIRTIO_PCI=y
    CONFIG_VIRTIO_PCI_LEGACY=y
    CONFIG_BLK_DEV_SD=y
    CONFIG_SCSI_VIRTIO=y
    CONFIG_VIRTIO_NET=y
    CONFIG_SERIAL_8250=y
    CONFIG_SERIAL_8250_CONSOLE=y

For full virtualization, use the following parameters:

    CONFIG_E1000=y
    CONFIG_ATA_PIIX=y
    CONFIG_SERIAL_8250=y
    CONFIG_SERIAL_8250_CONSOLE=y

You should also move your block device assignments to be sequential, without skipped block devices.

### Direct Disk Boot

An upgrade to KVM Linode includes the ability to do **Direct Disk** booting. Choosing Direct Disk means we will boot the Linode using the Master Boot Record on your boot device:

[![Direct Disk Boot Mode.](/docs/assets/config_direct_disk.png)](/docs/assets/config_direct_disk.png)

## How to Enable KVM

All new Linodes are created as KVM guests. Older Xen Linodes will need to migrate to KVM before receiving other plan upgrades.

If your Linode is currently running on Xen, go to the Linode's Dashboard page. In the bottom right of the sidebar is an "Upgrade to KVM" link. Click on the link and follow the instructions to upgrade:

  [![The KVM Upgrade Button.](/docs/assets/kvm_upgrade_context.png)](/docs/assets/kvm_upgrade_context.png)

## Troubleshooting

There have been a few minor issues reported when upgrading to KVM. If you're using any of the Linux distributions listed below and encounter an issue, please read on. If you are running a different distribution, or encounter an issue not listed here, please contact [Support](/docs/platform/support).

### Migration from Xen

If you are using a kernel other than the one provided by Linode and you migrate from Xen to KVM, you may encounter this error on boot:

![KVM Kernel Boot Error: "This isn't a KVM kernel! Fix your configuration profile."](/docs/assets/kvm-kernel-error.png "KVM Kernel Boot Error: "This isn't a KVM kernel! Fix your configuration profile."")

This means your Kernel doesn't have the necessary `virtio` drivers. To resolve:

1.  Edit your Linode's configuration profile to use the Linode-supplied kernel.

2.  Boot your Linode to update the kernel and regenerate `initramfs`. The steps will differ depending on your distribution. Assuming you're still using Grub 1 (Legacy Grub), refer to the [Run a Distribution-Supplied Kernel with PV-GRUB](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub) guide.

3.  Update `/boot/grub/menu.lst` to use your newly built kernel and `initramfs` file.

3.  Edit your Linode's configuration profile back to the previous setting.

{{< note >}}
Remember to check [Glish](/docs/networking/use-the-graphic-shell-glish) as well as Lish while testing. Without the grub terminal set to serial, your startup output may only appear on the Glish output.
{{< /note >}}

### CentOS 6

There are some reported cases of Linodes running CentOS 6.X that lose network connectivity after upgrading. To resolve this issue, open the [LISH Console](/docs/networking/using-the-linode-shell-lish) and run:

    rm -f /etc/udev/rules.d/70-persistent-net.rules

Then, reboot the Linode.

### Arch Linux

An upstream change to persistent device naming in systemd has resulted in broken connectivity for any Linode running Arch Linux on a KVM host. The latest version of systemd (226-1+) uses "Predictable Network Interface Names," which prevent the network interface on our platform from being brought online at boot.

You can disable the use of Predictable Network Interface Names with the command below.

    ln -s /dev/null /etc/udev/rules.d/80-net-setup-link.rules

If you have already upgraded and lost connectivity to your Linode, you will need to use the [LISH Console](/docs/networking/using-the-linode-shell-lish) to regain access to your Linode to run this command. Once you've done so, reboot your system.
