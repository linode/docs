---
author:
  name: Josh Sager
  email: docs@linode.com
description: What changes when you switch from Xen to KVM virtualization.
keywords: 'xen,kvm,linode,virtualization'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, June 15th, 2015
modified_by:
  name: Josh Sager
published: 'Monday, June 15, 2015'
title:  KVM Reference
---

Linode's virtualization stack supports KVM as well as Xen. Along with the increased performance of KVM virtualization, several details are different between Xen and KVM Linodes.

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

Virtual machine mode determines wether devices inside your virtual machine are *paravirtualized* or *fully virtualized*. The differences are listed below:

{: .table .table-striped .table-bordered}
|         | Paravirtualization  | Full-virtualization   |
|---------|:--------------------|:----------------------|
| Block   | Virtio SCSI         | IDE                   |
| Net     | Virtio Net          | e1000                 |
| Serial  | ttyS0               | ttyS0                 |

{: .note }
> If you're unfamiliar with these distinctions, choose paravirtualization

### Custom Kernel Configuration

If you want to build your own guest kernel, you must include the following modules:

* KVM Guest
* Enable Virtio drivers
* IDE support (for full virtualization)
* e1000 support (for full virtualization)

You should also move your block device assignments to be sequential, without skipped block devices.

### Direct Disk Boot

An upgrade to KVM Linode includes the ability to do **Direct Disk** booting. Choosing Direct Disk means we will boot the Linode using the Master Boot Record on your boot device:

[![Direct Disk Boot Mode.](/docs/assets/config_direct_disk.png)](/docs/assets/config_direct_disk.png)

## How to Enable KVM

There are two ways to enable KVM mode for your Linodes:

* **Existing Linode:** If your Linode is currently running on Xen, go to the Linode's Dashboard page. In the bottom right of the sidebar is an "Upgrade to KVM" link. Click on the link and follow the instructions to upgrade:

  [![The KVM Upgrade Button.](/docs/assets/kvm_upgrade_context.png)](/docs/assets/kvm_upgrade_context.png)

* **Future Linodes:** You can configure your user account to automatically create new Linodes using KVM. To do this, go to your [Linode Manager](https://manager.linode.com), then the **Account** tab, and then click on the **Account Settings** link. On the Account Settings page is a section called **Hypervisor Preference**. Set the preference to *KVM* and submit the form.

  [![Setting the account settings for the KVM hypervisor.](/docs/assets/kvm_account_setting_small.png)](/docs/assets/kvm_account_setting.png)
