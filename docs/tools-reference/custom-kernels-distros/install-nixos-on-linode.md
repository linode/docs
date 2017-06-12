---
author:
  name: Andrew Miller
  email: docs@linode.com
published: 'xxx'
description: 'Install NixOS on your Linode.'
keywords: 'custom distro,custom distribution,advanced Linux,kvm'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['tools-reference/custom-kernels-distros/install-nixos-on-linode/']
modified_by:
  name: Andrew Miller
modified: 'xxxx'
title: Install NixOS on a Linode
---

## Introduction

[NixOS](https://nixos.org) is a Linux distribution built on top of the [Nix](https://nixos.org/nix) package manager. Nix is a package manager with a focus on functional programming concepts, such as immutability and determinism, that enable some very powerful system management techniques. While Nix can be installed on any Linux system, NixOS takes these ideas a step further by extending them to the entire system, allowing configuration files and active state to be managed as well. This unique approach to system management has many advantages which can make deploying software and updates to applications much easier.

{: .caution}
>
>NixOS is not officially supported by Linode at this time. This means that issues with NixOS on your Linode would be outside the scope of Linode Support. In addition certain Linode tools, such as Network Helper may not work with NixOS.


## Before You Begin

You should familiarize yourself with connecting to your Linode through [LISH](/docs/networking/using-the-linode-shell-lish) and [GLISH](/docs/networking/use-the-graphic-shell-glish) as you will need to do this a few times throughout this guide.

### Recommended Reading

NixOS is powerful and enables a lot of cool system administration strategy, but it is also pretty unique. This means that there is some degree of Nix specific knowledge that you should have to run an effective system. You shouldn't try to learn everything upfront, as some things only become useful once you are actively using it, but you should get familiar with some of the high level concepts.

The [NixOS manual](https://nixos.org/nixos/manual/) is the main reference for NixOS. It explores the concepts at a high level and serves as a reference for some system configuration concepts.  This should have everything you need to know to get started, but there may be some deeper concepts that are glossed over. For more in depth information you may want to check the [Nix](https://nixos.org/nixos/manual/) and [Nixpkgs](https://nixos.org/nixpkgs/manual/) manuals.


## Preparing Your Linode

Begin by creating the Linode in your preferred data center. 

### Creating Disks

You will need to [create three disk images](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk); One for the installer, one for a swap partition, and one for the root partition.

* A disk labeled *Installer*. This disk should be of type `ext4` and 1024 MB in size.
* A disk labeled *Swap*. This disk should be of type `swap` and shouldn't be larger than 512 MB.
* A disk labeled *NixOS*. This disk should be of type `ext4` and should take up all remaining space.

### Creating Configuration Profiles

You will need to [create two configuration profiles](/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles#configuration-profiles/); one for the installer and one to boot NixOS. For each profile, you will need to disable all of the options under **Filesystem/Boot Helpers**

  * **Installer profile**
    * Label: Installer
    * Kernel: Direct Disk
    * /dev/sda: *NixOS*
    * /dev/sdb: *Swap*
    * /dev/sdc: *Installer*
    * root / boot device: Standard: /dev/sdc

  * **Boot profile**
    * Label: NixOS
    * Kernel: GRUB 2
    * /dev/sda: *NixOS*
    * /dev/sdb: *Swap*
    * root / boot device: Standard: /dev/sda

### Preparing The Installer

You will need to boot into [rescue mode](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) with the installer disk mounted as `/dev/sda`. Once in rescue mode, run the following command replacing $latest with the latest 64-bit minimal installation image from the [NixOS download page](https://nixos.org/nixos/download.html):

    curl $latest | dd of=/dev/sda

As of this guides writing, the latest release is 17.03. The following command will download the 17.03 image to your Linode:

    curl http://d3g5gsiof5omrk.cloudfront.net/nixos/17.03/nixos-17.03.1123.4a7a03913d/nixos-minimal-17.03.1123.4a7a03913d-x86_64-linux.iso | dd of=/dev/sda

## Installing NixOS

Now it's time to boot the installer and configure the system.

### Booting The Installer

Go to your Linode's dashboard and boot into your *Installer* configuration profile. You will need to connect to your Linode using [Glish](/docs/networking/use-the-graphic-shell-glish) here, as the installer image isn't configured to support SSH or the LISH console.

From here we mostly follow the steps for a [standard install](https://nixos.org/nixos/manual/index.html#sec-installation) from the NixOS manual. The rest of this guide focuses on Linode specific changes you will need to make.

### Setting Up The Install Environment

You will need to mount the disk you are installing to as `/mnt`. You can run this command to mount the NixOS disk:

    mount /dev/sda /mnt

You will also want to enable the swap disk you created earlier:

    swapon /dev/sdb

Once all of that is squared away you can generate a skeleton configuration using the following command:

    nixos-generate-config --root /mnt

### Editing Your Configuration

Now it's time to edit your Nix configuration files. To make this easier we will change to the configuration directory:

    cd /mnt/etc/nixos

Within this directory there are two files: `configuration.nix` and `hardware-configuration.nix`. NixOS only ever uses `configuration.nix` when realizing its configuration, but it is common practice to keep a separate Nix file with hardware specific configuration and have the `configuration.nix` file source its contents. 

#### Editing `hardware-configuration.nix`

The first set of changes we are going to make will allow NixOS to boot on Linode's virtual hardware. Since these changes aren't related to the software configuration, they will be made in the `hardware-configuration.nix` file.

##### Rewrite Device Identifiers

The `nixos-generate-config` command we ran earlier, generated the configuration from hardware details it gathered automatically. It prefers to use UUIDs to identify disks, but since Linode is a virtual platform you get to choose the device identifiers disks get attached to. Since you can switch these at will, it is better to use the `/dev/sdX` identifiers to allow you to easily swap in backup disks without having to go into rescue mode and rewrite the UUID to match the new disk:

You will want to replace the `filesystems` and `swapDevices` section with the following:

    filesystems."/" =
      { device = "/dev/sda";
        fsType = "ext4";
      };

    swapDevices =
      [ { device = "/dev/sdb"; }
      ];

##### Enabling LISH

The LISH console requires certain kernel and GRUB options to be configured, so we will need to add the following lines to our hardware configuration:

    boot.kernelParams = [ "console=ttyS0,19200n8" ];
    boot.loader.grub.extraConfig = ''
      serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1;
      terminal_input serial;
      terminal_output serial
    '';

You can place them anywhere within the curly braces that contain most of the existing configuration. Order doesn't matter for Nix files, so you can group settings in a way that makes sense to you.

##### Configuring GRUB

With a partitionless disk GRUB will complain about the unreliability of blocklists. In order to make NixOS ignore that and continue we need to use the `forceInstall` option. While the warning GRUB gives might be alarming, it is fine to ignore it. GRUB will run from the host machine and will read the grub file from the disk, so the GRUB on disk will never be used. We will also want to set the timeout for GRUB to be long enough that we can choose boot options. LISH can sometimes take a few seconds to connect, so we recommend setting this to ten seconds. To make all this happen we need to add the following to our hardware configuration:

    boot.loader.grub.device = "/dev/sda";
    boot.loader.grub.forceInstall = true;
    boot.loader.timeout = 10;

#### Editing `configuration.nix`

Now we are going to modify the software configuration. Even if you have an existing Nix configuration or know the kind of server you would like to make, I would encourage you to follow only these steps. At the end of the guide we are going to create an image from this disk, which will allow us to deploy NixOS on Linode like any other distribution. For this purpose it is better to make a general all-purpose image, so we won't make any system specific configuration changes like adding users and SSH keys.

Most of the changes we will make here will bring the NixOS defaults in line with how Linode's standard images work for most distributions. These aren't necessarily best practices, but they make a system that works as expected for the most part.

##### Configuring the SSH daemon

Since this is a server, we will need a SSH daemon to be running. We don't have any users other than root, so we will also need to allow root logins which are disabled by default. To do this, make sure the following is somewhere in your `configuration.nix`:

    services.openssh = {
      enable = true;
      permitRootLogin = "yes";
    };

##### Disabling the firewall

NixOS has a firewall that blocks all incoming connections and unexpected packets by default. Certain services, such as SSH, will open the ports they use automatically when enabled. However, this behavior isn't consistent across services in NixOS. To avoid confusion and to make troubleshooting easier, we will disable this firewall. You can do this by adding the following:

    networking.firewall.enable = false;

It isn't recommended to run a production system without a firewall, but it is usually best to run your test system without one to figure out which ports need to be open. Once you understand which parts are being used by your application you can enable the firewall and use the `networking.firewall.allowedTCPPorts` and `networking.firewall.allowedUDPPorts` options to enable your application ports.

##### Disabling Predictable Interface Names

Most of Linode's default images have systemd's predictable interface names disabled. Because of this, most of Linode's networking guides assume an interface of `eth0`. Since your Linode will run in a virtual environment and will have a single interface, it won't encounter the issues that predictable interface names were designed to solve. This change is mostly to be consistent with Linode's guides, but you can leave this option enabled if you prefer:

    networking.usePredictableInterfaceNames = false;

##### Installing Diagnostic Tools

You will also want to install some diagnostic tools. These are used frequently by Linode's support when troubleshooting networking and host level issues. They are included on most Linode images to prevent you from getting stuck with no networking and no networking diagnostic tools. You should add the following to your configuration to ensure these tools are installed:

    environment.systemPackages = with pkgs; [
        inetutils
        mtr
        sysstat
    ];

### Running The Installer

Now that we've finished editing the system configuration, you can have NixOS realize your configuration and install the system using the following:

    nixos-install

Once it finishes it will prompt you to set a root password. You now have a NixOS system running on your Linode, you can boot into it using the **Boot** profile you created earlier.

## Next Steps

Now that we have a bootable disk, we should create a deployable disk image so we can deploy NixOS like any other distribution on Linode. There are also some things we should do to clean up after the installation process.

### Creating An Image

Linode offers a service called [*Linode Images*](https://www.linode.com/docs/platform/linode-images) that allows you to take snapshots of your system. These snapshots are meant for deployment, not storage so they are limited to 2GB in size. NixOS should fit within that space, but we can still take a few steps to reduce the size of our image.

When NixOS was installed it had to use some packages that were essential for the installation process, but aren't needed for the running system. These can pretty easily be removed from the disk by running the following command:

    nix-collect-garbage -d

This command tells Nix to garbage collect, that is to remove, any packages that aren't depended on by the running system. Usually when you upgrade or install packages Nix will leave old versions intact, so that you can easily roll back to them. This is nice as it allows you to easily recover from any issues with upgrades, but it does end up leaving some cruft in the system over time. The `nix-collect-garbage` command invokes Nix's garbage collector which automatically cleans up old packages.

You may also want to go through and remove any log files that may be in `/var/log`. These are usually pretty small, but since we are creating an image it's good to have as blank of a disk as possible.

Once you get all that squared away you can create an image of the **NixOS** disk using the [*Linode Images* guide](https://www.linode.com/docs/platform/linode-images#capturing-your-image). You will want to label the image according to the release of NixOS you installed. At the time of writing the latest release is NixOS 17.03 which is codenamed "Gorilla".

Once you have that image, you should be able to select it in the distribution menu whenever you deploy a Linode. This will let you easily roll out a whole fleet of NixOS Linodes, without having to go through this guide for each one.

### Deleting The Installer Disk and Profile

You will want to delete the installer disk and profile from your Linode now that you have NixOS installed. You can use this [guide](https://www.linode.com/docs/platform/disk-images/disk-images-and-configuration-profiles#removing-a-configuration-profile) to remove the **Installer** profile.

Removing the **Installer** disk is a little more complicated as we will want to reclaim the storage that was used for our NixOS disk. Here is how you would do this:

  1. Go to your Linode's dashboard and shutdown your Linode.
  2. Follow this [guide](https://www.linode.com/docs/platform/disk-images/disk-images-and-configuration-profiles#removing-a-disk) to remove the **Installer** disk.
  3. Follow this [guide](https://www.linode.com/docs/platform/disk-images/disk-images-and-configuration-profiles#resizing-a-disk) to resize the **NixOS** disk to the maximum possible size.
