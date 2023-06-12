---
slug: ansible-adhoc-commands
description: 'In this tutorial, you will learn about several Ansible adhoc commands which are used by system and devops engineers to perform quick tasks and administer playbooks.'
keywords: ["ansible", "commands", "adhoc", "ansible adhoc commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-11
image: Learning_Adhoc_Commands_in_Ansible_1200x631.png
modified_by:
  name: Linode
title: 'A Tutorial for Learning Adhoc Commands in Ansible'
title_meta: 'Ansible Adhoc Commands - A Tutorial'
aliases: ['/applications/configuration-management/ansible-adhoc-commands/','/applications/configuration-management/ansible/ansible-adhoc-commands/']
tags: ["automation"]
authors: ["Avi"]
---

In this tutorial, you'll learn about several Ansible adhoc commands which are used by system and devops engineers.

Adhoc commands are commands which you run from the command line, outside of a playbook. These commands run on one or more managed nodes and perform a simple/quick task--most often, these will be tasks that you don't need to repeat. For example, if you want to reload Apache across a cluster of web servers, you can run a single adhoc command to achieve that task.

{{< note >}}
In Ansible, all modules can be executed in either a playbook or through an adhoc command.
{{< /note >}}

The basic syntax for invoking an adhoc command is:

    ansible host_pattern -m module_name -a "module_options"

## Before You Begin

To run the commands in this tutorial, you'll need:

- A workstation or server with the Ansible command line tool installed on it that will act as the control node. The [Set Up the Control Node](/docs/guides/getting-started-with-ansible/#set-up-the-control-node)
 section of the [Getting Started With Ansible](/docs/guides/getting-started-with-ansible/) guide has instructions for setting up a Linode as a control node. Installation instructions for non-Linux distributions can be found on the [Ansible documentation site](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html).

- At least one other server that will be managed by Ansible. Some commands in this guide will target a non-root user on this server. This user should have sudo privileges. There are a couple options for setting up this user:

    - You can use Ansible to create the user, which is outlined in the [Add a Limited User Account](/docs/guides/running-ansible-playbooks/#add-a-limited-user-account) section of the [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) guide.

    - Alternatively, you can manually add the user, which is outlined in the [Add a Limited User Account](/docs/products/compute/compute-instances/guides/set-up-and-secure/#add-a-limited-user-account) section of the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide.

{{< note >}}
Follow the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide for help with creating Linodes.
{{< /note >}}

The commands in this guide will be run from the control node and will target a host named `Client`. Your control node's Ansible inventory should be configured so that at least one of your managed nodes has this name. The [Create an Ansible Inventory](/docs/guides/getting-started-with-ansible/#create-an-ansible-inventory) section of the [Getting Started With Ansible](/docs/guides/getting-started-with-ansible/) guide outlines how to set up an inventory file.

{{< note >}}
Alternatively, you can modify the commands in this guide to use a different host name.
{{< /note >}}

## Basic Commands

### Ping

To check that you can reach your managed node, use the [`ping` module](https://docs.ansible.com/ansible/latest/modules/ping_module.html):

    ansible -m ping Client

{{< output >}}
node1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}
{{< /output >}}

### Run with Privilege Escalation

This adhoc command demonstrates how a non-root user on the managed node can gain the privileges of a root user when executing a module. Specifically, this example shows how to use [privilege escalation](https://docs.ansible.com/ansible/latest/user_guide/become.html) to run the `fdisk` command through the [`shell` module](https://docs.ansible.com/ansible/latest/modules/shell_module.html):

    ansible Client -m shell -a 'fdisk -l' -u non_root_user --become -K

{{< output >}}
BECOME password:
node1 | CHANGED | rc=0 >>
Disk /dev/sda: 79.51 GiB, 85362475008 bytes, 166723584 sectors
Disk model: QEMU HARDDISK
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk /dev/sdb: 512 MiB, 536870912 bytes, 1048576 sectors
Disk model: QEMU HARDDISK
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
{{< /output >}}

- The `-u` option is used to specify the user on the managed node.

    {{< note respectIndent=false >}}
By default, Ansible will try to establish a connection to the managed node under the same user that you execute the Ansible CLI with on the control node.
{{< /note >}}

- The `--become` option is used to execute the command with the privileges of the root user.
- The `-K` option is used to prompt for the privilege escalation password of the user.

### Reboot a Managed Node

Below is a command that reboots the managed node:

    ansible Client -a "/sbin/reboot" -f 1

This command omits the `-m` option that specifies the module. When the module is not specified, the [`command` module](https://docs.ansible.com/ansible/latest/modules/command_module.html) is the default that's used.

The `command` module is similar to the `shell` module in that both will execute a command that you pass to it. The `shell` module will run the command through a shell on the managed node, while the `command` module will not run it through a shell.

{{< note >}}
The `-f` option is used to define number of [forks](https://docs.ansible.com/ansible/latest/user_guide/playbooks_strategies.html#setting-the-number-of-forks) that Ansible will use on the control node when running your command.
{{< /note >}}

{{< note >}}
If your managed node is a Linode, then [Linode's shutdown watchdog *Lassie*](/docs/products/compute/compute-instances/guides/monitor-and-maintain/#configure-shutdown-watchdog) needs to be enabled for the reboot to succeed. This is because a Linode is not able to turn itself on--instead, Linode's host environment must boot the Linode.
{{< /note >}}

## Collecting System Diagnostics

### Check Free Disk Space

This command is used to check the free disk space on all of a managed node's mounted disks. It lists all the filesystems present on the managed node along with the filesystem size, space used, and space available in a human-readable format:

    ansible Client -a "df -h"

{{< output >}}
node1 | CHANGED | rc=0 >>
Filesystem      Size  Used Avail Use% Mounted on
udev            1.9G     0  1.9G   0% /dev
tmpfs           394M  596K  394M   1% /run
/dev/sda         79G  2.6G   72G   4% /
tmpfs           2.0G  124K  2.0G   1% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
tmpfs           394M     0  394M   0% /run/user/0
{{< /output >}}

This command checks the available and used space on a specific filesystem:

    ansible Client -m shell -a 'df -h /dev/sda'

{{< output >}}
node1 | CHANGED | rc=0 >>
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         79G  2.6G   72G   4% /
{{< /output >}}

### Check Memory and CPU Usage

Use the `free` command with the `shell` module to see the free and used memory of your managed node in megabytes:

    ansible Client -m shell -a 'free -m'

{{< output >}}
node1 | CHANGED | rc=0 >>
              total        used        free      shared  buff/cache   available
Mem:           3936         190        3553           0         192        3523
Swap:           511           0         511
{{< /output >}}

Use the `mpstat` command with the `shell` module to check CPU usage:

    ansible Client -m shell -a 'mpstat -P ALL'

{{< output >}}
node1 | CHANGED | rc=0 >>
Linux 5.3.0-40-generic (localhost)      03/21/2020      _x86_64_        (2 CPU)

07:41:27 PM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
07:41:27 PM  all    0.96    0.00    0.72    0.08    0.00    0.02    0.01    0.00    0.00   98.21
07:41:27 PM    0    0.93    0.00    0.73    0.06    0.00    0.03    0.01    0.00    0.00   98.24
07:41:27 PM    1    1.00    0.00    0.71    0.09    0.00    0.01    0.01    0.00    0.00   98.17
{{< /output >}}

### Check System Uptime

This Ansible command will show how long your managed nodes have been up and running:

    ansible Client -a "uptime"

{{< output >}}
node1 | CHANGED | rc=0 >>
 19:40:11 up 8 min,  2 users,  load average: 0.00, 0.02, 0.00
{{< /output >}}

## File Transfer

### Copy Files

The [`copy` module](https://docs.ansible.com/ansible/latest/modules/copy_module.html) is used to transfer a file or directory from the control node to your managed nodes by defining the source and destination paths. You can define the file owner and file permissions in the command:

    cd ~
    echo "Hello World" > test.txt
    ansible Client -m copy -a 'src=test.txt dest=/etc/ owner=root mode=0644' -u non_root_user --become -K

{{< output >}}
BECOME password:
node1 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "checksum": "13577023221e91069c21d8f10a4b90f8192d6a26",
    "dest": "/etc/test",
    "gid": 0,
    "group": "root",
    "md5sum": "eb662c21e683b643f0fcb5997d7bbccf",
    "mode": "0644",
    "owner": "root",
    "size": 18,
    "src": "/root/.ansible/tmp/ansible-tmp-1584820375.14-54524496813834/source",
    "state": "file",
    "uid": 0
}
{{< /output >}}

You can also use Ansible to check whether your file got copied to your destination location:

    sudo ansible Client -m shell -a 'ls -l /etc/test*'

{{< output >}}
node1 | CHANGED | rc=0 >>
-rw-r--r-- 1 root root 12 Jun  1 22:35 /etc/test.txt
{{< /output >}}

### Fetch Files

The [`fetch` module](https://docs.ansible.com/ansible/latest/modules/fetch_module.html) is used to transfer a file from a managed node to the control node. After the command runs successfully, the `changed` variable in Ansible's output will be set to `true`.

    ansible Client -m fetch -a 'src=/etc/test.txt dest=/etc/'

{{< output >}}
node1 | CHANGED => {
    "changed": true,
    "checksum": "648a6a6ffffdaa0badb23b8baf90b6168dd16b3a",
    "dest": "/etc/192.0.2.4/etc/test.txt",
    "md5sum": "e59ff97941044f85df5297e1c302d260",
    "remote_checksum": "648a6a6ffffdaa0badb23b8baf90b6168dd16b3a",
    "remote_md5sum": null
}
{{< /output >}}

Note that the fetched file was placed into `/etc/192.0.2.4/etc/test.txt`. By default, the `fetch` module will put fetched files into separate directories for each hostname that you're fetching from. This prevents a file from one managed node from overwriting the file from another managed node.

To avoid creating these directories, include the `flat=yes` option:

    ansible Client -m fetch -a 'src=/etc/test.txt dest=/etc/ flat=yes'

{{< output >}}
node1 | SUCCESS => {
    "changed": false,
    "checksum": "648a6a6ffffdaa0badb23b8baf90b6168dd16b3a",
    "dest": "/etc/test.txt",
    "file": "/etc/test.txt",
    "md5sum": "e59ff97941044f85df5297e1c302d260"
}
{{< /output >}}

### Create Directories

The [`file` module](https://docs.ansible.com/ansible/latest/modules/file_module.html) is used to create, remove, and set permissions on files and directories, and create symlinks. This command will create a directory at `/root/linode/new/` on the managed node with the owner and permissions defined in the options:

    ansible Client -m file -a "dest=/root/linode/new/ mode=755 owner=root group=root state=directory" -u non_root_user --become -K

{{< output >}}
node1 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "gid": 0,
    "group": "root",
    "mode": "0755",
    "owner": "root",
    "path": "/root/linode/new",
    "size": 4096,
    "state": "directory",
    "uid": 0
}
{{< /output >}}

Note that all intermediate directories that did not exist will also be created. In this example, if the `linode/` subdirectory did not already exist, then it was created.

## Managing Packages

### Install a Package

The [`package` module](https://docs.ansible.com/ansible/latest/modules/package_module.html) can be used to install a new package on the managed node. This command installs the latest version of NGINX:

    ansible Client -m package -a 'name=nginx state=present' -u non_root_user --become -K

{{< output >}}
node1 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "cache_update_time": 1584821061,
    "cache_updated": false,
    "changed": true,
    "stderr": "",
    "stderr_lines": [],
    "stdout": "Reading package lists...\nBuilding dependency tree...
        "Unpacking nginx (1.16.1-0ubuntu2.1) ...",
        "Setting up libxpm4:amd64 (1:3.5.12-1) ...",
        "Setting up nginx-common (1.16.1-0ubuntu2.1) ...",
        "Setting up nginx-core (1.16.1-0ubuntu2.1) ...",
        "Setting up nginx (1.16.1-0ubuntu2.1) ...",
    ]
}
{{< /output >}}

{{< note >}}
The `package` module works across distributions. There are also modules for specific package managers (e.g. the [`apt` module](https://docs.ansible.com/ansible/latest/modules/apt_module.html) and the [`yum` module](https://docs.ansible.com/ansible/latest/modules/yum_module.html)). These modules offer more options that are specific to those package managers.
{{< /note >}}

### Uninstall a Package

To uninstall a package, set `state=absent` in the command's options:

    ansible Client -m package -a 'name=nginx state=absent' -u non_root_user --become -K

{{< output >}}
node1 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "stderr": "",
    "stderr_lines": [],
    "stdout": "Reading package lists...\nBuilding dependency tree …
        "  nginx-core",
        "Use 'sudo apt autoremove' to remove them.",
        "The following packages will be REMOVED:",
        "  nginx*",
        "Removing nginx (1.16.1-0ubuntu2.1) ..."
    ]
}
{{< /output >}}

## Managing Services

### Start a Service

Use the [`service` module](https://docs.ansible.com/ansible/latest/modules/service_module.html) to start a service on the managed node. This command will start and enable the NGINX service:

    ansible Client -m service -a 'name=nginx state=started enabled=yes' -u non_root_user --become -K

{{< output >}}
node1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "enabled": true,
    "name": "nginx",
    "state": "started",
    "status": {
        "ActiveEnterTimestamp": "Sat 2020-03-21 20:04:35 UTC",
        "ActiveEnterTimestampMonotonic": "1999615481",
        "ActiveExitTimestampMonotonic": "0",
        "ActiveState": "active",
        "After": "system.slice systemd-journald.socket network.target sysinit.target basic.target",
        "AllowIsolate": "no",
        "AmbientCapabilities": "",
        "AssertResult": "yes",
        "AssertTimestamp": "Sat 2020-03-21 20:04:35 UTC",
        "AssertTimestampMonotonic": "1999560256",
        "Before": "multi-user.target shutdown.target",
    }
}
{{< /output >}}

### Stop a Service

When you change the state to *stopped*, the service will stop running.

    ansible Client -m service -a 'name=nginx state=stopped' -u non_root_user --become -K

{{< output >}}
node1 | CHANGED => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": true,
    "name": "nginx",
    "state": "stopped",
    "status": {
        "ActiveEnterTimestamp": "Sat 2020-03-21 20:04:35 UTC",
        "ActiveEnterTimestampMonotonic": "1999615481",
        "ActiveExitTimestampMonotonic": "0",
        "ActiveState": "active",
        "After": "system.slice systemd-journald.socket network.target sysinit.target basic.target",
        "AllowIsolate": "no",
        "AmbientCapabilities": "",
        "AssertResult": "yes",
        "AssertTimestamp": "Sat 2020-03-21 20:04:35 UTC",
}
}
{{< /output >}}

## Gathering Facts

The [`setup` module](https://docs.ansible.com/ansible/latest/modules/setup_module.html) can be used to gather information about your managed nodes:

    ansible Client -m setup

{{< output >}}
node1 | SUCCESS => {
    "ansible_facts": {
        "ansible_all_ipv4_addresses": [
            "192.0.2.4"
        ],
        "ansible_all_ipv6_addresses": [
            "2400:8904::f03c:92ff:fee9:dcb3",
            "fe80::f03c:92ff:fee9:dcb3"
        ],
        "ansible_apparmor": {
            "status": "enabled"
        },
        "ansible_architecture": "x86_64",
        "ansible_bios_date": "04/01/2014",
        "ansible_bios_version": "rel-1.12.0-0-ga698c8995f-prebuilt.qemu.org",
        "ansible_cmdline": {
            "BOOT_IMAGE": "/boot/vmlinuz-5.3.0-40-generic",
            "console": "ttyS0,19200n8",
            "net.ifnames": "0",
            "ro": true,
            "root": "/dev/sda"
        },
        "ansible_date_time": {
            "date": "2020-03-21",
            "day": "21",
            "epoch": "1584821656",
            "hour": "20",
            "iso8601": "2020-03-21T20:14:16Z",
            "iso8601_basic": "20200321T201416267047",
            "iso8601_basic_short": "20200321T201416",
            "iso8601_micro": "2020-03-21T20:14:16.267127Z",
            "minute": "14",
            "month": "03",
            "second": "16",
            "time": "20:14:16",
            "tz": "UTC",
            "tz_offset": "+0000",
            "weekday": "Saturday",
            "weekday_number": "6",
            "weeknumber": "11",
            "year": "2020"
        },
        "ansible_default_ipv4": {
            "address": "192.0.2.4",
            "alias": "eth0",
            "broadcast": "192.0.2.255",
            "gateway": "192.0.2.1",
            "interface": "eth0",
            "macaddress": "f2:3c:92:e9:dc:b3",
            "mtu": 1500,
            "netmask": "255.255.255.0",
            "network": "192.0.2.0",
            "type": "ether"
        },
        "gather_subset": [
            "all"
        ],
        "module_setup": true
    },
    "changed": false
}
{{< /output >}}

### Filtering Facts

Using the `filter` option with the `setup` module will limit what is returned by the module. This command lists the details of your managed nodes' installed distributions:

    ansible Client -m setup -a "filter=ansible_distribution*"

{{< output >}}
node1 | SUCCESS => {
    "ansible_facts": {
        "ansible_distribution": "Ubuntu",
        "ansible_distribution_file_parsed": true,
        "ansible_distribution_file_path": "/etc/os-release",
        "ansible_distribution_file_variety": "Debian",
        "ansible_distribution_major_version": "19",
        "ansible_distribution_release": "eoan",
        "ansible_distribution_version": "19.10",
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false
}
{{< /output >}}
