```bash
---
author:
  name: Linode
  email: docs@linode.com
description: 'Guide about Linux kernel modules, what they do and how to use Modprobe to manage them.'
keywords: ["linux", "modprobe", "kernel"]
tags: ["quick-answers", "linux"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-29
modified_by:
  name: Linode
title: 'How To Use The Modprobe Command to manage Linux kernel modules'
contributor:
  name: Jan Slezak
  link: https://github.com/scumdestroy
external_resources:
  - '[Linux Man Page for modprobe](https://linux.die.net/man/8/modprobe)'
  - '[Wikipedia Page for modprobe](https://en.wikipedia.org/wiki/Modprobe)'
  - '[Linux Man Page for modprobe.conf](https://linux.die.net/man/5/modprobe.conf)'
---
```

Linux's `modprobe` is a command-line utility, used to add or remove loadable modules from the Linux kernel manually.    

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
Most uses of `modprobe` require elevated privileges. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Understanding Modules in the Linux Kernel

The Linux kernel is the central core of any Linux system.  The kernel fulfils many crucial roles, including managing the system's resources and providing a bridge between a computer's physical hardware and its software.  To manage the system's services, processes, memory and hardware, the kernel was designed to be dynamic and modular.  

Modules, sometimes called drivers, are object files that can be loaded into the kernel automatically or manually to extend a system's functionality.  Typically, `modprobe` is succesful in locating the modules and configuration files required by a Linux system by looking in `/lib/modules/$(uname -r)`. However, some situations may require certain modules to load with additional parameters or to prevent them from loading automatically.  Whether fine-tuning or troubleshooting, `modprobe` provides a simple solution for adding or removing modules manually.  

{{< note >}}

The presence of `/etc/modprobe.conf` or `/etc/modprobe.d` will supersede the default configuration file.  

{{< /note >}}

## Accessing the Linux Module Infrastructure

Kernel modules are stored at `/lib/modules` and can only be managed by administrative privileged users.  List them via the following command.

        sudo ls /lib/modules/$(uname -r)

To list all device drivers, type the following command.

        sudo ls /lib/modules/$(uname -r)/kernel/drivers/  

Kernel modules usually possess `.ko` extensions.  To list all files with the `.ko` extension on your system, input the following command.

        find /lib/modules/$(uname -r) -type f -name *.ko*

List all modules available with the `lsmod` command.  

        sudo lsmod

To filter installed kernel modules and only list loadable modules, use `egrep`.

        sudo lsmod | egrep -v "\s0"

## Using `modprobe` 

### Loading modules 

To manually Load modules, along with their dependencies, invoke `modprobe` followed by the modules name.

        sudo modprobe module_name

Ideally, modules should be loaded by the kernel during system boot.  Configuration options can be set by creating a file in `/etc/modules` with any name, followed by the `.conf` suffix.  
The required syntax is demonstrated below, using `ipv6` as a module and `disable=1` as an optional parameter.  

{{< file "/etc/modules-load.d/ipv6.conf" > }}
# Local module settings
# Created by the Debian installer
# syntax: options module_name parameter_name=parameter_value

options ipv6 disable=1

{{< /file >}}

{{< note >>}}
Module names must be prefaced with the word `options`, module parameters are optional and any empty lines and lines that begin with `;` or `#` will be ignored.
{{< /note >}}

### Unloading, Removing and Blacklisting Modules

To unload a module, use the following command.

        sudo modprobe -r module_name

To check if a module was succesfully unloaded, enter the following command.

        sudo modprobe -r module_name --first-time

To remove a module, use the `rmmod` command, followed by one or more modules you wish to remove.  This command will only remove a module until the next time the system is rebooted.

        sudo rmmod module_name
        sudo rmmod module_name another_module_name 

{{< note >}}
Don't worry, `rmmod` will not let you remove a module that is in use by another currently loaded module to prevent system-breaking changes.
{{< /note >}}

To permanently disable a Kernel module from being loaded, create a file with the `.conf` suffix inside `/etc/modprobe.d/` with the following syntax.

{{< file "/etc/modprobe.d/example.conf" >}}
# Remember to swap "module_name" with the module you are trying to disable
#

blacklist module_name
{{< /file >}}

To blacklist additional modules, specify them on a new line or use another `.conf` file.

### Common flags used with modprobe

To add multiple modules in one command, use the `-a` flag with the following syntax

        sudo modprobe -a module_name another_module_name yet_another_module_name

To see dependencies a module requires, use the `--show-depends` flag.

        sudo modprobe --show-depends module_name

To see an extensive and comprehensive list of configuration settings for all loaded modules, use the `-c` flag.

        sudo modprobe -c | less

To display the configuration settings for a particular module, use the following command.

        sudo modprobe -c | grep module_name 

## Troubleshooting

To force a module addition or removal, use the `-f` or `--force` flags.

        sudo modprobe -f module_name

{{< caution >}}
The use of the `-f` flag to bypass "version-check" errors displayed by modprobe can cause a kernel to crash or exhibit undefined and unprecedented behavior due to incompatibility issues.
{{< /caution >}}

If a broken module prevents your system from booting, it is possible to load modules from the kernel command line.  The required syntax for all common bootloaders is displayed below.

        module_name.parameter_name=parameter_value
        ipv6.disable=1

Similarly, it is possible to blacklist modules by entering the following syntax into the bootloader's kernel command line. 

        module_blacklist=module_name,another_module_name

{{< note >}}
If blacklisting more than one module, spaces or anything more than a comma will break the syntax.
{{< /note >}}
 
More information about modules can be found in Linode's guide on using `modinfo` and `lsmod` [here](https://www.linode.com/docs/guides/lsmod-and-modinfo-commands-in-linux/).