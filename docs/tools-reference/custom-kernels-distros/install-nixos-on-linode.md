---
author:
  name: Andrew Miller
  email: docs@linode.com
published: 2017-06-16
description: 'Install NixOS, which is known for its declarative approach to configuration management, configuration rollback, reliability, and for being DevOps-friendly.'
keywords: ["custom distro", "NixOS", "advanced Linux", "kvm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Andrew Miller
modified: 2017-06-16
title: Install and Configure NixOS on a Linode
external_resources:
 - '[NixOS](https://nixos.org/nixos/manual/)'
 - '[Nixpkgs](https://nixos.org/nixpkgs/manual/)'
---

![How to Install NixOS on Linode](/docs/assets/nixos-title.png "How to Install NixOS on Linode")

[NixOS](https://nixos.org) is a Linux distribution built on the [Nix](https://nixos.org/nix) package manager. Nix focuses on functional programming concepts, such as immutability and determinism, that enable powerful system management techniques.

While Nix can be installed on any Linux system, NixOS takes these ideas a step further by extending them to the entire system, allowing configuration files and active state to be managed as well. This unique approach to system management has many advantages that can make deploying software and application updates easier.

{{< caution >}}
NixOS is not officially supported by Linode at the time of publishing this guide. Any issues with NixOS on your Linode are outside the scope of Linode Support. In addition, certain Linode tools, such as Network- and Boot-Helpers, will not work with NixOS.
{{< /caution >}}

## Before You Begin

Familiarize yourself with [LISH](/docs/networking/using-the-linode-shell-lish) and [GLISH](/docs/networking/use-the-graphic-shell-glish) to connect to your Linode. You will use them throughout this guide.

The [NixOS manual](https://nixos.org/nixos/manual/) is the main reference for NixOS. It explores the concepts at a high level and serves as a reference for some system configuration concepts. This should have everything you need to know to get started, but there may be some deeper concepts that are not thoroughly addressed. For more in-depth information, visit the [NixOS](https://nixos.org/nixos/manual/) and [Nixpkgs](https://nixos.org/nixpkgs/manual/) manuals.

## Prepare Your Linode

### Create Disks for Nix

[Create three disk images](/docs/platform/disk-images/disk-images-and-configuration-profiles/#creating-a-blank-disk): One for the installer, one for a swap partition, and one for the root partition. Label them:

* **Installer**: A type `ext4` disk, 1024 MB in size.
* **Swap**: A `swap` disk no larger than 512 MB.
* **NixOS**: A type `ext4` disk which takes up all remaining space.

### Create Configuration Profiles

[Create two configuration profiles](/docs/platform/disk-images/disk-images-and-configuration-profiles/#configuration-profiles), one for the installer and one to boot NixOS. For each profile, disable all of the options under **Filesystem/Boot Helpers** and set the **Configuration Profile** to match the following:

  * **Installer profile**
    * **Label:** Installer
    * **Kernel:** Direct Disk
    * **/dev/sda:** *NixOS*
    * **/dev/sdb:** *Swap*
    * **/dev/sdc:** *Installer*
    * **root / boot device:** Standard: /dev/sdc

  * **Boot profile**
    * **Label:** NixOS
    * **Kernel:** GRUB 2
    * **/dev/sda:** *NixOS*
    * **/dev/sdb:** *Swap*
    * **root / boot device:** Standard: /dev/sda

### Prepare the Installer

In your browser, navigate to the [NixOS download page](https://nixos.org/nixos/download.html) and copy the URL from the **Minimal installation CD, 64-bit Intel/AMD** link.

[Boot your Linode into rescue mode](/docs/troubleshooting/rescue-and-rebuild#booting-into-rescue-mode) with the installer disk mounted as `/dev/sda`. Once in rescue mode, run the following command, replacing the URL with the latest 64-bit minimal installation image copied from the [NixOS download page](https://nixos.org/nixos/download.html). This example installs NixOS 17.03:

    # Bind the URL you grabbed from the download page to a bash variable
    iso=<URL for nixos download>

    # Update SSL certificates to allow HTTPS connections
    update-ca-certificates

    # Download the ISO and write it to the installer disk
    curl $iso | dd of=/dev/sda

## Install NixOS

### Boot the Installer

In your Linode's dashboard, boot into your *Installer* configuration profile. Since the installer image isn't configured to support SSH or the LISH console, connect to your Linode using [GLISH](/docs/networking/use-the-graphic-shell-glish).

### Set up the Install Environment

Mount the NixOS disk to which you are installing the distro as `/mnt`:

    mount /dev/sda /mnt

Enable the swap disk you created earlier:

    swapon /dev/sdb

Generate a starter configuration:

    nixos-generate-config --root /mnt

## Configure NixOS

Change to the configuration directory:

    cd /mnt/etc/nixos

Within this directory there are two files: `configuration.nix` and `hardware-configuration.nix`. When realizing its configuration, NixOS only uses `configuration.nix`. It is common practice to keep a separate Nix file with hardware specific configuration and have the `configuration.nix` file source its contents.

### Rewrite Device Identifiers

The `nixos-generate-config` command in the [Set up the Install Environment](#set-up-the-install-environment) section generated the configuration from hardware details it gathered automatically. It prefers to use UUIDs to identify disks, but since Linode is a virtual platform you can choose the device identifiers that disks get attached to.

Since you can modify these later, it is better to use the `/dev/sdX` identifiers (where `X` is the assigned volume, like `sda` or `sdb`) to allow you to easily swap in backup disks without having to boot into rescue mode and rewrite the UUID to match the new disk:

Replace the contents of the `filesystems` and `swapDevices` sections with the following:

{{< file-excerpt "/mnt/etc/nixos/hardware-configuration.nix" aconf >}}
filesystems."/" =
  { device = "/dev/sda";
    fsType = "ext4";
  };

swapDevices =
  [ { device = "/dev/sdb"; }
  ];

{{< /file-excerpt >}}


### Enable LISH

The LISH console requires certain kernel and GRUB options to be configured in the hardware configuration. Place these lines anywhere within the curly braces `{ }` that contain most of the existing configuration. Order doesn't matter for Nix files, so group settings in a way that makes sense to you:

    boot.kernelParams = [ "console=ttyS0,19200n8" ];
    boot.loader.grub.extraConfig = ''
      serial --speed=19200 --unit=0 --word=8 --parity=no --stop=1;
      terminal_input serial;
      terminal_output serial
    '';

### Configure GRUB

When GRUB detects a partitionless disk, it will warn about the unreliability of blocklists. To force NixOS to ignore the warning and then continue, configure GRUB to use the `forceInstall` option. GRUB will run from the host machine and will read the GRUB file from the disk, so the GRUB on disk will never be used.

Set the timeout for GRUB to be lengthy enough to accommodate LISH connection delays. The following hardware configuration example sets a 10 second timeout:

    boot.loader.grub.device = "nodev";
    boot.loader.timeout = 10;

### Edit NixOS Configuration

At the end of the guide, you will create an image from this disk, which will allow us to deploy NixOS on Linode like any other distro. For this purpose it is better to make a general all-purpose image, so you won't make any system-specific configuration changes, like adding users and SSH keys.

Most of these changes bring the NixOS defaults in line with how Linode's standard images work for most distributions. These aren't necessarily best practices, but they make a system that works as expected.

### Configure the SSH daemon

Root logins via SSH are disabled by default. To access your Linode, enable root login during installation:

{{< file-excerpt "/mnt/etc/nixos/configuration.nix" aconf >}}
services.openssh = {
  enable = true;
  permitRootLogin = "yes";
};

{{< /file-excerpt >}}


After installation, create a user with limited permissions, then set `permitRootLogin` to `"no"`.

### Disable Predictable Interface Names

Most of Linode's default images have had systemd's predictable interface names disabled. Because of this, most of [Linode's networking guides](/docs/networking/) assume an interface of `eth0`. Since your Linode runs in a virtual environment and will have a single interface, it won't encounter the issues that predictable interface names were designed to solve. This change is optional, but may help troubleshooting later:

    networking.usePredictableInterfaceNames = false;

### Install Diagnostic Tools

These tools are included on most Linode images, and are frequently used by Linode support when troubleshooting networking and host level issues. Add the following to your configuration to ensure these tools are installed:

    environment.systemPackages = with pkgs; [
        inetutils
        mtr
        sysstat
    ];

## Run the NixOS Installer

Install NixOS using the settings you configured:

    nixos-install

Once complete, the installer will prompt you to set a root password.

NixOS is now installed and can be booted from the **Boot** profile created in [Create Configuration Profiles](#create-configuration-profiles).

## Create an Image of your Linode

In this optional section, you'll create a deployable disk image of NixOS.

[*Linode Images*](/docs/platform/linode-images) allows you to take snapshots of your system. These snapshots are limited to 2GB in size. The NixOS installation includes packages that were essential for the installation process, but aren't needed for the running system. These can be removed after installation:

    nix-collect-garbage -d

The `nix-collect-garbage` command tells Nix to "garbage collect," to remove any packages that the running system isn't depending on. Usually when you upgrade or install packages, Nix will leave old versions intact so that you can easily roll back to them. The `nix-collect-garbage` command invokes Nix's garbage collector which automatically cleans up old packages.

You may also want to go through and remove any log files that may be in `/var/log`. While these are usually pretty small, because you are creating an image, it's good to have as blank of a disk as possible:

    cd /var/log

Create an image of the **NixOS** disk using the [Linode Images](/docs/platform/linode-images#capturing-your-image) guide. Label the image according to the release of NixOS you installed. Now that you have created an image, you can select it in the distribution menu whenever you deploy a Linode.

## Delete the Installer Disk and Profile

Delete the installer disk and profile from your Linode using the [removing a configuration profile](/docs/platform/disk-images/disk-images-and-configuration-profiles#removing-a-configuration-profile) section of the Disk Images guide to remove the **Installer** profile.

Remove the **Installer** disk and reclaim the storage that the NixOS installation was using:

  1. Go to your Linode's dashboard and shutdown your Linode.
  2. [Remove the *Installer* disk](/docs/platform/disk-images/disk-images-and-configuration-profiles#removing-a-disk).
  3. [Resize the *NixOS* disk](/docs/platform/disk-images/disk-images-and-configuration-profiles#resizing-a-disk) to the maximum possible size.
