---
author:
  name: Avi
  email: avi.dunken1991@gmail.com
description: 'This blog talks about the various adhoc commands in Ansible'
keywords: ["ansible", "commands", "adhoc", "ansible adhoc commands"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-27
modified_by:
  name: Linode
title: 'Ansible Adhoc Commands'
contributor:
  name: Avi
  link: https://github.com/avidunken/
---

## Introduction
In this tutorial, I will talk about several Ansible adhoc commands which are used by System and DevOps engineers.

Adhoc commands are commands which run on the target host to perform a simple/quick task. For example, if you want to install a package on a system, you can just run a simple command to execute it.

In Ansible, there are multiple tasks which can be executed through ansible adhoc commands rather than running ansible playbook for it. Ansible uses /use/bin/ansible command line tool
So, here is a list of most important ansible adhoc commands.

## Basic Commands
Inventory file in ansible has all the hosts, the command below runs ping module on Client host. -m flag is used for ansible module.

root@localhost:~# ansible -m ping Client
node1 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python"
    },
    "changed": false,
    "ping": "pong"
}

Below is an ansible adhoc command which runs setup module on the hosts (Client) to filter all the details of an installed ansible distribution.

root@localhost:~# ansible Client -m setup -a "filter=ansible_distribution*"
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

This adhoc command provides non-root users privileges of a root user using shell module. --become is used to give root user privileges and -K flag for asking password.

root@localhost:~# ansible Client -m shell -a 'fdisk -l' -u root --become -K
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

Below ansible command reboots the system. -f is used to define number of forks.

root@localhost:~# ansible Client -a "/sbin/reboot" -f 1

## Checking System
This ansible adhoc command is used to check the free disk space on the mounted disk. It lists all the filesystem present on the system with the used and available spaces on it.

root@localhost:~# ansible Client -a "df -h"
node1 | CHANGED | rc=0 >>
Filesystem      Size  Used Avail Use% Mounted on
udev            1.9G     0  1.9G   0% /dev
tmpfs           394M  596K  394M   1% /run
/dev/sda         79G  2.6G   72G   4% /
tmpfs           2.0G  124K  2.0G   1% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup
tmpfs           394M     0  394M   0% /run/user/0

The commands check the available and used space on the defined filesystem in the command. In this case, shell module is checking for root partition space.

root@localhost:~# ansible Client -m shell -a 'df -h /dev/sda' --become
node1 | CHANGED | rc=0 >>
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda         79G  2.6G   72G   4% /

This ansible adhoc command frees the memory (RAM) in the system.

root@localhost:~# ansible Client -m shell -a 'free -m' --become
node1 | CHANGED | rc=0 >>
              total        used        free      shared  buff/cache   available
Mem:           3936         190        3553           0         192        3523
Swap:           511           0         511

*mpstat* is used to check CPU usage, I am checking it for all the servers.

root@localhost:~# ansible Client -m shell -a 'mpstat -P ALL' --become
node1 | CHANGED | rc=0 >>
Linux 5.3.0-40-generic (localhost)      03/21/2020      _x86_64_        (2 CPU)

07:41:27 PM  CPU    %usr   %nice    %sys %iowait    %irq   %soft  %steal  %guest  %gnice   %idle
07:41:27 PM  all    0.96    0.00    0.72    0.08    0.00    0.02    0.01    0.00    0.00   98.21
07:41:27 PM    0    0.93    0.00    0.73    0.06    0.00    0.03    0.01    0.00    0.00   98.24
07:41:27 PM    1    1.00    0.00    0.71    0.09    0.00    0.01    0.01    0.00    0.00   98.17

This ansible adhoc command gives the information on how long the servers has been up and running.

root@localhost:~# ansible Client -a "uptime"
node1 | CHANGED | rc=0 >>
 19:40:11 up 8 min,  2 users,  load average: 0.00, 0.02, 0.00

## File Transfer
Let me talk about few ansible adhoc commands related to file transfer.

*copy* module is used to transfer a file from host to server by defining the source and destination paths. You can define the file owner and file permission in the command.

root@localhost:~# ansible Client -m copy -a 'src=/root/test dest=/etc/ owner=root mode=0644' -u root --become -K
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

Check whether your file got copied at your destination location or not.

root@localhost:~# ls /etc/te*
/etc/test

*fetch* module is used to transfer the file from the server to host machine. After the command runs successfully, *changed* variable will become true.

root@localhost:~# pwd
/root
root@localhost:~# ansible Client -m fetch -a 'src=/etc/ansible/ansible.cfg dest=/root/ flat=yes'
node1 | CHANGED => {
    "changed": true,
    "checksum": "7a54e03066c8161403a24645fa4071e6ee7b1369",
    "dest": "/root/ansible.cfg",
    "md5sum": "bfb5f2820229f9d6f67afc6c5b421ce8",
    "remote_checksum": "7a54e03066c8161403a24645fa4071e6ee7b1369",
    "remote_md5sum": null
}

Check whether the file got copied to host or not.

root@localhost:~# ls
ansible.cfg  test

*file* module is used create file or directory with owner and permission defined in the command.

root@localhost:~/dir1/dir2# ansible Client -m file -a "dest=/root/linode/new mode=755 owner=root group=root state=directory"
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

You can see, both directory and file got created.

root@localhost:~# ls
ansible.cfg  linode  test
root@localhost:~# cd linode/
root@localhost:~/linode# ls
new

## Managing Packages
This section has commands which can be used to manage packages using ansible.

*apt* module is used to install a new package on ubuntu machine. This command installs the latest version of nginx on a machine with ubuntu os.

root@localhost:~/linode/new# ansible Client -m apt -a 'name=nginx state=latest' --become
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

To install a package, you need to use a very similar command as the previous one but in this case the state will be *absent*. The mentioned package in the command will immediately get  uninstalled.

root@localhost:~# ansible Client -m apt -a 'name=nginx state=absent purge=yes' --become
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

## Managing Services
Hundreds of services run on a machine, managing them can be a difficult task. Ansible make it easy to manage services by simple commands.

*service* module with name and state as *started* is used to start a service. Here, I am starting a nginx service.

root@localhost:~# ansible Client -m service -a 'name=nginx state=started enabled=yes' --become
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

When you change the state to *stopped*, the service will stop running.

root@localhost:~# ansible Client -m service -a 'name=nginx state=stopped' --become
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

## Gathering Facts
This ansible adhoc command is used to get all the information of the system. Its lists all the system variables with its value.

root@localhost:~# ansible all -m setup
node1 | SUCCESS => {
    "ansible_facts": {
        "ansible_all_ipv4_addresses": [
            "172.105.42.246"
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
            "address": "172.105.42.246",
            "alias": "eth0",
            "broadcast": "172.105.42.255",
            "gateway": "172.105.42.1",
            "interface": "eth0",
            "macaddress": "f2:3c:92:e9:dc:b3",
            "mtu": 1500,
            "netmask": "255.255.255.0",
            "network": "172.105.42.0",
            "type": "ether"
        },
        "gather_subset": [
            "all"
        ],
        "module_setup": true
    },
    "changed": false
}

So, that was all about adhoc command, hope it was useful. Go ahead and try out these commands on your setup.
