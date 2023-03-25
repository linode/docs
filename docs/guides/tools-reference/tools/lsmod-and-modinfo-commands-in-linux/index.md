---
slug: lsmod-and-modinfo-commands-in-linux
description: 'Learn how to use the lsmod and modinfo command on your Linux system. These commands provide information on the Linux kernel modules installed on your desktop or server.'
keywords: ['kernel module','lsmod','modinfo']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-07
modified_by:
  name: Linode
title: "​​How to Use the lsmod and modinfo Commands in Linux"
title_meta: "Using The lsmod and modinfo Commands in Linux"
authors: ["Jack Wallen"]
---

The Linux kernel is modular in nature, which means it's possible to add and remove modules as needed. This makes for a lightweight, secure, and lightweight kernel. Its flexibility enables you to add and remove the features you need to make an operating system fit your use case and preferences.

It is important to inspect a Linux system's kernel modules, especially when troubleshooting a hardware or software installation. For example, you may encounter an issue if a kernel module for a specific piece of hardware or software has not loaded. In this scenario, you use the `lsmod` command to view the available modules on your Linux system. If a module is loaded, you can further troubleshoot by listing out the details of the module. This is achieved using the `modinfo` command. This tutorial shows you how to use the `lsmod` and `modinfo` commands to inspect your Linux system's kernel modules.

## What are Linux Kernel Modules (LKM)?

Linux kernel modules are pieces of code that can be added to or removed from the Linux Kernel as required. Kernel modules often enable certain hardware or system features. Some modules are built directly into the kernel and cannot be removed. *Loadable* modules, on the other hand, can be added and removed without having to reboot your Linux system.

Loadable kernel modules allow you to extend the functionality of your system. Without modules, Linux would have to depend on a monolithic kernel which isn't nearly as agile and secure. Another issue with a monolithic kernel is when new functionality is needed it must be built directly into the kernel image. This means the kernel is not only larger, but takes considerably longer to build. With monolithic kernels, every time new functionality is added, a system has to be rebooted.

Linux Kernel Modules are all stored in the `/lib/modules` directory. By keeping kernel modules housed in a centralized, local directory, it is more efficient to load and unload kernel modules. If you inspect the `/lib/modules` directory, you can find subdirectories for every kernel that has been installed on your system. For example, your Linux server might display the following installed kernels:

     ls /lib/modules/

{{< output >}}
4.19.0-18-amd64         grub-2.04-19-linode.img
     {{</ output >}}

If you view the contents of one the `kernel` directory stored in the `4.19.0-18-amd64` directory, for example, you can view module files related to your system.

    ls /lib/modules/4.19.0-18-amd64/

{{< output >}}
kernel         modules.alias.bin  modules.builtin.bin  modules.dep.bin  modules.order    modules.symbols
modules.alias  modules.builtin    modules.dep          modules.devname  modules.softdep  modules.symbols.bin
    {{</ output >}}

## List Kernel Modules with lsmod

The `lsmod` command stands for "list modules," and lists out every loaded kernel module on a system. From a terminal, use the `lsmod` command to list all of your system's kernel modules.

    lsmod

The output of the command can be very long and displays the output in three columns:

- **Module** - the name of the module.
- **Size** - the size of the module in bytes.
- **Used by** - how many instances of the module are in use and what system is using the module.

The example below displays what a system might return when you issue the `lsmod` command. The output displays every module that is loaded and the associated details.

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

The `nfnetlink` module displayed above is used as a transport layer for all user space communication of the `netfilter` subsystems. The module is 16,384 bytes in size and is used twice by the `nf_conntrack_netlink` system. This system enables support for a netlink-based user space interface. The `lsmod` command helps to identify this information about the `nfnetlink` module and can similarly provide information about all other modules installed on your Linux system.

## Display Information About a Linux Kernel Module with modinfo

You can uncover even more information about a specific kernel module using the `modinfo` command. Continuing with the example above, you can view more information about the `nfnetlink` module, with the following command:

    modinfo nfnetlink

The output for the `modinfo nfnetlink` command displays the following information.

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
- **intree** - if the module is maintained in the kernel Git repository
- **name** - the name of the module.
- **vermagic** - the version of the kernel module.
- **sig_id**, **signer**, **sig_key**, **sig_hashalgo**, and **signature** - all display information about the module's key signature.

If the `modinfo nfnetlink` command displays too much information for your needs, you can specify which field you want to be displayed using the `--field` option. For example, if you only need to view the `filename` field, issue the following command:

    modinfo --field filename nfnetlink

{{< output >}}
/lib/modules/5.11.0-41-generic/kernel/net/netfilter/nfnetlink.ko
{{</ output >}}

By default, `modinfo` lists information for modules used by the current running kernel. You can also find information about a module for a specific kernel that may not be running on your system. Perhaps you want information about the `nfnetlink` module from the previous kernel. To do so, issue the following command:

    modinfo -k 5.11.0-40-generic nfnetlink

The output for the above command only lists information for the module from the `5.11.0-40-generic` kernel, instead of the currently running kernel.

## Conclusion

Whenever you need information about a particular Linux kernel module, `lsmod` and `modinfo` are commands you can rely on. Using the combination of `lsmod` and `modinfo`, you can gather plenty of details for each available module. If you're looking for more information on managing your Linux kernel, check out our [Managing the Kernel on a Linode](/docs/products/compute/compute-instances/guides/manage-the-kernel/) guide.