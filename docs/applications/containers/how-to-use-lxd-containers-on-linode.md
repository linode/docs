---
author:
  name: Linode Community
  email: docs@linode.com
description: 'LXD is a container hypervisor that manages Linux Containers. Compared to other uses of Linux Containers, LXD manages machine containers which each work just like typical servers. This guide covers how to install, configure and use LXD on Linode.'
keywords: ["container", "lxd", "lxc"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-29
modified: 2017-11-30
modified_by:
  name: Linode
title: 'How to use LXD containers on Linode'
contributor:
  name: Simos Xenitellis
  link: https://blog.simos.info/
external_resources:
  - '[LXD Introduction](https://linuxcontainers.org/lxd/)'
  - '[Blog post series on LXD 2.0](https://stgraber.org/2016/03/11/lxd-2-0-blog-post-series-012/)'
  - '[LXD support community](https://discuss.linuxcontainers.org/)'
  - '[Try LXD Online](https://linuxcontainers.org/lxd/try-it/)'
---

## Introduction

[LXD](https://linuxcontainers.org/lxd/) (pronounced LexDee) is a container hypervisor that manages Linux Containers. Compared to other implementations of Linux Containers, the LXD containers are *machine containers*. A machine container works and feels just like a typical server. Compared to virtual machines, an installation with LXD can accomodate more than ten times the density of KVM on the same hardware. As virtual machines can consolidate physical servers, machine containers can consolidate virtual machines. In constrast to virtual machines, a machine container reuses the running Linux kernel of the host and when it boots up, it only runs the rest of the software of a Linux distribution.

For simplicity, in the following we use the term *container* to describe the machine containers of LXD.

The main benefits of LXD are the high density of containers that it can support and the performance it delivers. A computer with 2GB RAM can adequately support half a dozen containers. In addition, LXD officially supports the [container images of several major Linux distributions](https://us.images.linuxcontainers.org/). We can pick and choose the Linux distribution and exact version of that distribution to run in the container. 

Once deployed, LXD allows the administrator to create separate containers for each website, for the database server, for the reverse-proxy and other services. Most services can be installed in a container. 

This guide covers how to setup a Linode to work with LXD, how LXD works in practice and how to troubleshoot common issues.


## Before You Begin

When setting up LXD, we decide where to store the data of the containers. In this guide, we cover two options. 

1. The use of a Volume (through Block Storage).  See [How to Use Block Storage with Your Linode](/docs/platform/how-to-use-block-storage-with-your-linode/) for the list of datacenters that support Block Storage. Select this option if your preferred datacenter is in the list.

2. The use of a Disk by resizing down the main disk of the Linode and creating a new disk from the free space. Select this option if it is not possible to use a Volume of Block Storage.


Subsequently, follow the following steps to set up the Linode.

1.  Complete the [Getting Started](/docs/getting-started) guide. If you are using a Volume, **select** the image `Ubuntu 16.04 LTS` from the drop-down menu according to the instructions. If you are using a Disk, perform the tasks in the section below labeled *How to resize a Linode to make space for LXD*, then skip to Step 4.

2. If you are using a Volume, follow the [Run a Distribution-Supplied Kernel on a KVM Linode](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm/) guide and in the `Kernel` dropdown-menu, select `GRUB 2`. Then, reboot your server in order to activate the new kernel selection.

3.  Follow the [How to Use Block Storage with Your Linode](/docs/platform/how-to-use-block-storage-with-your-linode/) guide and create a block storage volume with size at least 20GB and attach to this Linode. Note down the device name. **Do not** format the volume and do not add it to /etc/fstab. ![Add a volume for Disk Storage](/docs/assets/lxd/add-volume-for-disk-storage.png "Add a volume for Disk Storage")

4.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. 

    This guide will use `sudo` wherever possible. In addition, *make sure* the standard user account has the username `ubuntu`.

5.  Update your packages:

        sudo apt update && sudo apt upgrade


## Setting up for LXD

1. Log in as the `ubuntu` user:

        ssh ubuntu@your_server_IP

2. Install the packages `lxd` and `zfsutils-linux`:

        sudo apt install lxd zfsutils-linux

3. Add the user `ubuntu` to the `lxd` group.

        sudo usermod -a -G lxd ubuntu

4. Log out and log in again in order to activate the membership to the new group.

        logout
        ssh ubuntu@your_server_IP

5. Run `lxd init` to initialize LXD. Use the following table when answering the questions.

        sudo lxd init


| Question                        | Answer   | Comments                                 |
| ----------------                |:--------:|:---------------------------------------- |
| Configure new storage pool?     | yes      |                                          |
| Name of storage backend?        | zfs      |                                          |
| Create new ZFS pool?            | yes      |                                          |
| Name of new ZFS pool/dataset?   | lxd      |                                          |
| Use existing block device?      | yes      |                                          |
| Path to existing block device?  |          | Type the device name. See examples below.|
| Available over the network?     | no       | No required in this guide.               |
| Configure LXD bridge?           | yes      | Then accept all the subsequent defaults. |

If you are using Block Storage, the device name of the volume looks like below.
![Volumes - Volume Attached](/docs/assets/lxd/volumes-volume-attached.png "Volumes - Volume Attached")

If you are using part of the Linode disk, the device name looks like below for the entry LXD.
![Block Device Assignement](/docs/assets/lxd/block-device-assignment.png "Block Device Assignment")


## Using LXD

In the following, we see common tasks in the lifetime of a container. 

To get a list of the containers,

        lxc list
 
{{< output >}}
Generating a client certificate. This may take a minute...
If this is your first time using LXD, you should also run: sudo lxd init
To start your first container, try: lxc launch ubuntu:16.04

+------+-------+------+------+------+-----------+
| NAME | STATE | IPV4 | IPV6 | TYPE | SNAPSHOTS |
+------+-------+------+------+------+-----------+
{{< /output >}}

{{< note >}}
There are no containers yet and the list is empty. 
{{< /note >}}

To get a list of the available container images,

        lxc image list images:

{{< output >}}
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
|              ALIAS              | FINGERPRINT  | PUBLIC |               DESCRIPTION                |  ARCH   |   SIZE   |          UPLOAD DATE          |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.4 (3 more)             | 39a3bf44c9d8 | yes    | Alpine 3.4 amd64 (20180126_17:50)        | x86_64  | 2.04MB   | Jan 26, 2018 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.4/armhf (1 more)       | 9fe7c201924c | yes    | Alpine 3.4 armhf (20170111_20:27)        | armv7l  | 1.58MB   | Jan 11, 2017 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.4/i386 (1 more)        | d39f2f2ba547 | yes    | Alpine 3.4 i386 (20180126_17:50)         | i686    | 1.88MB   | Jan 26, 2018 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.5 (3 more)             | 5533a5247551 | yes    | Alpine 3.5 amd64 (20180126_17:50)        | x86_64  | 1.70MB   | Jan 26, 2018 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.5/i386 (1 more)        | 5e93d5f4cae1 | yes    | Alpine 3.5 i386 (20180126_17:50)         | i686    | 1.73MB   | Jan 26, 2018 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
| alpine/3.6 (3 more)             | 5010616d9a24 | yes    | Alpine 3.6 amd64 (20180126_17:50)        | x86_64  | 1.73MB   | Jan 26, 2018 at 12:00am (UTC) |
+---------------------------------+--------------+--------+------------------------------------------+---------+----------+-------------------------------+
.....................................................................
{{< /output >}}

{{< note >}}
The first two columns for the alias and the fingerprint provide an identifier that can be used to specify the container image when launching it.
{{< /note >}}

To launch a new container with the name `mycontainer`,

        lxc launch ubuntu:16.04 mycontainer
 
{{< output >}}
Creating mycontainer
Starting mycontainer 
{{< /output >}}


To get a new list of the containers,

        lxc list
 
{{< output >}}
+-------------+---------+-----------------------+---------------------------+------------+-----------+
|    NAME     |  STATE  |         IPV4          |          IPV6             |    TYPE    | SNAPSHOTS |
+-------------+---------+-----------------------+---------------------------+------------+-----------+
| mycontainer | RUNNING | 10.142.148.244 (eth0) | fde5:5d27:...:1371 (eth0) | PERSISTENT | 0         |
+-------------+---------+-----------------------+---------------------------+------------+-----------+
{{< /output >}}


To execute a command in a container called mycontainer,

        lxc exec mycontainer -- apt update
        lxc exec mycontainer -- apt upgrade

{{< note >}}
The characters `--` instruct the `lxc` command not to parse any more command-line parameters. It would be necessary to use `--` if the line was `lxc exec mycontainer -- ls -l` because otherwise the `lxc` command would try to interpret first the `-l` parameter and fail. It is good habit to use `--` in any case. 
{{< /note >}}

To get a shell in a container,

        lxc exec mycontainer -- sudo --login --user ubuntu

Sample output
{{< output >}}
To run a command as administrator (user "root"), use "sudo <command>".
See "man sudo_root" for details.

ubuntu@mycontainer:~$
{{< /output >}}

{{< note >}}
The Ubuntu container images have by default a non-root account with username `ubuntu`. This account can use `sudo` to perform administrative tasks. It does not require any password to perform administrative tasks. The `sudo` command is instructed to provide a login shell under the existing account `ubuntu`.
{{< /note >}}

To stop a container,

        lxc stop mycontainer

To remove a container,

        lxc delete mycontainer


## Testing LXD

We are going to create a container, install the Apache2 Web server and then add the appropriate `iptables` rules in order to expose the Web server to the Internet.

1. Launch a new container.

        lxc launch ubuntu:16.04 web

2. Update the package list in the container.

        lxc exec web -- apt update

3. Install the Apache2 Web server.

        lxc exec web -- apt install apache2

4. Add the `iptables` rule to expose the port 80 (www) to the Internet. When someone connects to port 80 on the server, this rule redirects them to port 80 of the container. You need to update in this command both your public IP address and the IP address of this container.

        PORT=80 PUBLIC_IP=your_public_ip CONTAINER_IP=your_container_ip sudo -E bash -c 'iptables -t nat -I PREROUTING -i eth0 -p TCP -d $PUBLIC_IP --dport $PORT -j DNAT --to-destination $CONTAINER_IP:$PORT -m comment --comment "forward to the Apache2 container"'

5. Make permanent this `iptables` rule by installing `iptables-persistent`. When prompted to save the IPv4 and IPv6 rules, click **Yes** in order to save them. Then, during a reboot, the above rules will be automatically reapplied.

        sudo apt install iptables-persistent

Finally, verify that the Web server is accessible from the Internet by connecting from your own computer and visiting with a Web browser the public IP address of the server. The web page should look as follows.

[![Web page of Apache server running in a container](/docs/assets/lxd/apache-server-running-in-lxd-container.png)](/docs/assets/lxd/apache-server-running-in-lxd-container.png "Web page of Apache server running in a container.")


## Troubleshooting

### How to check how much free space is available

Run the following command.

        sudo zpool list

In the following example output, the storage is 20GB and is almost all available.

{{< output >}}
NAME   SIZE  ALLOC   FREE  EXPANDSZ   FRAG    CAP  DEDUP  HEALTH  ALTROOT
lxd   19,9G   408M  19,5G         -     0%     2%  1.00x  ONLINE  -
{{< /output >}}


## Next Steps

If you plan to use a single website, then a single `iptables` rule to the website container would suffice. However, if you plan to use several websites, you need to set up [a reverse proxy like nginx](https://linode.com/docs/web-servers/nginx/nginx-reverse-proxy/) in a container. The `iptables` rule would then redirect to this container.

## How to resize a Linode to make space for LXD

An alternative to using block storage for LXD is to use instead some of the free space of the Linode. 
You can do so by rebuilding the Linode and allocating less space for the Linux distribution. Then, the resulting free space is used for LXD. 

{{< caution >}}
The following steps will destroy all data and wipe your Linode clean. Make sure that you have took backups of any important data. 
{{< /caution >}}

1. Visit the **Dashboard** of your Linode and click on the **Shut down** button to shutdown.

2. Click on the **Rebuild** link to rebuild the server.  Select the **Image** Ubuntu 16.04 LTS. For the **Deployment Disk Size** specify 5000MB. Set the **Swap Disk** to 512MB and assign a **Root password**. Finally click on the **Rebuild** button to deploy the new image. ![Deploy an Image by specifying 5000MB deployment disk size](/docs/assets/lxd/deploy-image-in-5gb.png "Deploy an Image by specifying 5000MB deployment disk size")

3. Visit the **Dashboard** of your Linode. At the **Disks** section, click on **Create a new Disk**. In **Label**, type `LXD`. Accept the type and size given and click on the **Save Changes** button. ![Edit Disk for LXD](/docs/assets/lxd/edit-disk-for-lxd.png "Edit Disk for LXD")

4. Visit the **Dashboard** of your Linode. Click **Edit** on the configuration profile. In the **Configuration Profile**/**Boot Settings**, select in the **Kernel** drop-down menu the entry **GRUB 2**. In the **Configuration Profile**/**Block Device Assignment**, at the device name **/dev/sdc** click on the drop-down menu to select the **LXD** disk that was created earlier. Finally, at the end of the page, click on the button **Save Changes**.
![Block Device Assignement](/docs/assets/lxd/block-device-assignment.png "Block Device Assignment")

5. Visit the **Dashboard** of your Linode. Click on the **Boot** button to boot your Linode. 

Note that the device name of the disk with name **LXD** is `/dev/sdc`. This device name will be used when initializing LXD.
