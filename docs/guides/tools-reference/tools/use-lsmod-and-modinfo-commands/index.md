---
slug: using-the-lsmod-and-modinfo-commands-in-linux
author:
  name: Jack Wallen
description: 'Learn how to use the lsmod and modinfo command on your Linux system. These commands provide information on the Linux kernel modules installed on your desktop or server.'
og_description: 'Learn how to use the lsmod and modinfo command on your Linux system. These commands provide information on the Linux kernel modules installed on your desktop or server.'
keywords: ['kernel module','lsmod','modinfo']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-23
modified_by:
  name: Linode
title: "Using The lsmod and modinfo Commands in Linux"
h1_title: "​​How to Use the lsmod and modinfo Commands in Linux"
enable_h1: true
contributor:
  name: Jack Wallen
---

The Linux kernel is modular in nature, which means it's possible to add and remove modules as needed. This makes for a lightweight and secure kernel. Even more important, it means the kernel is flexible, so you can add, and remove whatever you need to make a system work as required. Beyond the actual loading or unloading of kernel modules, you may have added new hardware or installed a new piece of software, only to discover it's not working.

This could happen because the kernel module for that hardware or software isn't loaded. If that's the case, you use the `lsmod` command to find out. If a module is loaded, you can list out the details of the module, which is a task handled by the `modinfo` command. This tutorial shows you how to make use of these two powerful, information-gathering tools.

## What are Linux Kernel Modules (LKM)?

Think of kernel modules as drivers that enable certain hardware or features. Some modules are built directly into the kernel and cannot be removed. Not all modules can be loaded or unloaded into and out of the kernel. Loadable modules on the other hand can be added, and removed without having to reboot your system.

Loadable kernel modules are added or removed from a kernel, on-demand when you need to extend the functionality of a system. Without modules, Linux would have to depend on a monolithic kernel which isn't nearly as agile and secure. Another issue with the monolithic kernel is when new functionality is needed it must be built directly into the kernel image. This means the kernel is not only larger but takes considerably longer to build. With monolithic kernels, every time new functionality is added, a system has to be rebooted.

Linux Kernel Modules are all stored in the `/lib/modules` directory. By keeping them housed in a centralized, local directory, they are more efficient to load, and unload. If you issue the command `ls /lib/modules`, you find subdirectories for every kernel that has been installed on a given system. If you peek into one of those sub-directories, you find another sub-directory, called `kernel`, which houses every available kernel module (in various subdirectories).

## List Kernel Modules with lsmod

The `lsmod` command stands for "list modules," and lists out every loaded kernel module on a system. From a terminal, use the `lsmod` command to list all of your system's kernel modules.

    lsmod

The output of the command can get very long (depending on your system) and displays the output in three columns:

- *Module* - the name of the module.
- *Size* - the size of the module in bytes.
- *Used by* - how many instances of the module are in use and what system is using the module.

The following is an example output when you issue the `lsmod` command where you see every module that is loaded and the associated details.

{{< output >}}
Module                  Size  Used by
nfnetlink              16384  2 nf_conntrack_netlink
xt_MASQUERADE          20480  1
nf_nat                 49152  2 nft_chain_nat,xt_MASQUERADE
nf_conntrack_netlink   49152  0
xfrm_user              40960  1
...
...
{{</ output >}}

In the above output, the `nfnetlink` module. This module is used as a transport layer for all user space communication of the `netfilter` subsystems. The module is 16,384 bytes in size and is used twice by the `nf_conntrack_netlink` system. This system enables support for a netlink-based user space interface.

## Display Information about a Linux Kernel Module with modinfo

You can uncover even more information about a specific kernel module. From the example above, to extract more information on the `nfnetlink` module, issue the following command:

    modinfo nfnetlink

The output for the `modinfo nfnetlink` command displays all of the following information.

{{< output >}}
filename:       /lib/modules/5.11.0-41-generic/kernel/net/netfilter/nfnetlink.ko
description:    Netfilter messages via netlink socket
alias:          net-pf-16-proto-12
author:         Harald Welte <laforge@netfilter.org>
license:        GPL
srcversion:     EFA3D70B6EF087871934E84
depends:
retpoline:      Y
intree:         Y
name:           nfnetlink
vermagic:       5.11.0-41-generic SMP mod_unload modversions
sig_id:         PKCS#7
signer:         Build time autogenerated kernel key
sig_key:        0A:76:69:99:20:71:05:D9:91:E8:8C:EC:C7:61:22:0B:A5:B5:70:EF
sig_hashalgo:   sha512
signature:      5F:F3:5C:6B:B4:7A:...
{{</ output >}}

The output includes:

- **filename** - the specific path housing the module (in this case, `/lib/modules/5.11.0-41-generic/kernel/net/netfilter/nfnetlink.ko`).
- **alias** - the module alias used within the kernel.
- **author** - the author of the module.
- **license** - the module license.
- **srcversion** - the specific version of the module source.
- **depends** - any dependencies a module might have.
- **retpoline** - if the module is `retpoline` enabled.
- **intree** - if the module is maintained in the kernel git repository
- **name** - the name of the module.
- **vermagic** - the version of the kernel module.
- **sig_id**, **signer**, **sig_key**, **sig_hashalgo**, and **signature** - all display information about the module's key signature.


If the `modinfo nfnetlink` command displays too much information for your needs, you can specify which field you want to be displayed using the `--field` option. For example, if you only need to see the `filename` field, issue the following command:

    modinfo --field filename nfnetlink

{{< output >}}
/lib/modules/5.11.0-41-generic/kernel/net/netfilter/nfnetlink.ko
{{</ output >}}

By default, `modinfo` lists information for modules used by the current running kernel. You can also find information about a module for a specific kernel. Perhaps you want information about the `nfnetlink` module from the previous kernel. To do so, issue the following command:

    modinfo -k 5.11.0-40-generic nfnetlink

The output for the above command only lists information for the module from the `5.11.0-40-generic` kernel (instead of the running `5.11.0-41-generic` kernel).

## Conclusion

Whenever you need information about a particular Linux kernel module, it's only a couple of commands away. Using the combination of `lsmod` and `modinfo`, you can gather plenty of details for each module available. And if you're looking for more information on managing a Linux kernel, check out [Managing the Kernel on a Linode](/docs/guides/managing-the-kernel-on-a-linode/).