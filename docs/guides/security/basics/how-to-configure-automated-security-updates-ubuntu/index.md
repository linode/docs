---
slug: how-to-configure-automated-security-updates-ubuntu
description: "In this tutorial, you will learn how to configure automated updates on Ubuntu by using the dnf-automatic tool or the Cockpit web application."
keywords: ["ubuntu unattended-upgrades", "configuring unattended-upgrades"]
tags: ["ubuntu", "security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-10-22
modified_by:
  name: Linode
published: 2020-10-22
title: "Configuring Automated Security Updates on Ubuntu"
title_meta: "How to Configure Automated Security Updates on Ubuntu"
aliases: ['/security/basics/how-to-configure-automated-security-updates-ubuntu/']
relations:
    platform:
        key: automated-security-upgrades
        keywords:
            - distribution: Ubuntu
image: Configuring_automated_security_updates_ubuntu.png
authors: ["Hackersploit"]
---

Keeping your system up-to-date with the latest packages and security updates can be a tedious task. Most users forget to do it, leaving them vulnerable to countless threats. Automate security (and other package) updates with the utility [Unattended Upgrades](https://wiki.debian.org/UnattendedUpgrades) on Ubuntu.

## Before You Begin

1.  Complete the [Getting Started](/docs/products/platform/get-started/) guide.

1.  Follow the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, and harden SSH access.

1.  Log into your Linode via SSH and update and upgrade.

        sudo apt update && sudo apt upgrade

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](/docs/guides/linux-users-and-groups) guide.
{{< /note >}}

## Install Unattended Upgrades

You can set up automated security updates on Ubuntu by installing a helpful utility called `unattended-upgrades`.

1.  Install it running the following command:

        sudo apt install unattended-upgrades

1.  After the installation completes, you can enable and start the `unattended-upgrades` service by running the following commands:

        sudo systemctl enable unattended-upgrades

        sudo systemctl start unattended-upgrades

    This ensures that the service runs on system startup and is persistent throughout.

1.  You now need to make changes to the configuration file. The default configuration file can be found here at `/etc/apt/apt.conf.d/50unattended-upgrades`. Open it with the text editor of your choice.

{{< note respectIndent=false >}}
The unattended-upgrades package ignores lines that start with `//`, as that line is considered to be a comment. Therefore, if you want a repository to update automatically, you need to remove `//` from that line.
{{< /note >}}

1.  In our example, remove `//` from the “security” line if it's there, `"${distro_id}:${distro_codename}-security";`. This section should look like the following:

    {{< file "/etc/apt/apt.conf.d/50unattended-upgrades" >}}
...

Unattended-Upgrade::Allowed-Origins {
        "${distro_id}:${distro_codename}";
        "${distro_id}:${distro_codename}-security";
        // Extended Security Maintenance; doesn't necessarily exist for
        // every release and this system may not have it installed, but if
        // available, the policy for updates is such that unattended-upgrades
        // should also install from here by default.
        "${distro_id}ESMApps:${distro_codename}-apps-security";
        "${distro_id}ESM:${distro_codename}-infra-security";
//      "${distro_id}:${distro_codename}-updates";
//      "${distro_id}:${distro_codename}-proposed";
//      "${distro_id}:${distro_codename}-backports";
};

...
{{</ file >}}

### Blacklisting Packages

The `Unattended-Upgrade::Package-Blacklist` section of the configuration file allows you to block upgrades for specific packages.

To block upgrades for specific packages, add the desired package name to the list. In this example, add "apache2" and "vim":

{{< file "/etc/apt/apt.conf.d/50unattended-upgrades" >}}
...

Unattended-Upgrade::Package-Blacklist {
    // The following matches all packages starting with linux-
//  "linux-";
    "apache2";
    "vim";
    // Use $ to explicitely define the end of a package name. Without
    // the $, "libc6" would match all of them.
//  "libc6$";
//  "libc6-dev$";
//  "libc6-i686$";

    // Special characters need escaping
//  "libstdc\+\+6$";

    // The following matches packages like xen-system-amd64, xen-utils-4.1,
    // xenstore-utils and libxenstore3.0
//  "(lib)?xen(store)?";

    // For more information about Python regular expressions, see
    // https://docs.python.org/3/howto/regex.html
};

...
{{</ file >}}

### Deleting Dependencies

You can explicitly set up the unattended-upgrades service to remove unused dependencies by changing the `Remove-Unused-Kernel-Packages`, `Remove-New-Unused-Dependencies`, and `Remove-Unused-Dependencies` options to true. Remember to remove `//` to uncomment these lines.

{{< file "/etc/apt/apt.conf.d/50unattended-upgrades" >}}
...

// Remove unused automatically installed kernel-related packages
// (kernel images, kernel headers and kernel version locked tools).
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";

// Do automatic removal of newly unused dependencies after the upgrade
Unattended-Upgrade::Remove-New-Unused-Dependencies "true";

// Do automatic removal of unused packages after the upgrade
// (equivalent to apt-get autoremove)
Unattended-Upgrade::Remove-Unused-Dependencies "true";

...
{{</ file >}}

## Enabling Automatic Upgrades

To enable automatic updates create a new auto-upgrades file: `/etc/apt/apt.conf.d/20auto-upgrades` using text editor of your choice.

This file allows you to define how often the auto updates take place.

{{< file "/etc/apt/apt.conf.d/20auto-upgrades" >}}
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
{{</ file >}}

- **Update-Package-Lists**: `1` enables auto-update, `0` disables.
- **Unattended-Upgrade**: `1` enables auto-upgrade, `0` disables.
- **AutocleanInterval**: Enables auto clean packages for `X` days. The above configuration displays 7 days
  - For example, APT::Periodic::AutocleanInterval “7”; means that the system clears the download archive every seven days.

## Testing The Configuration

You can perform a dry run to test the configuration. The dry run command runs a test update but no actual changes take place.

You can run the dry run test by using the command:

    sudo unattended-upgrades --dry-run --debug
