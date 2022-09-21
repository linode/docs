---
slug: manually-upgrading-to-latest-distribution-version
author:
  name: Linode
  email: docs@linode.com
description: "Outlines options when upgrading a Linux distribution to the next latest version and provides instructions for performing a clean installation."
keywords: ["upgrading", "ubuntu", "centos","debian"]
tags: ["security","ubuntu"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-09-03
modified_by:
  name: Linode
published: 2021-09-03
title: "How to Upgrade a Linux System to the Latest Distribution"
h1_title: "Upgrading to the Latest Distribution (Clean Install)"
enable_h1: true
aliases: ['/security/upgrading/manually-upgrading-to-latest-distribution-version/']
---

Software updates play a pivotally role in maintaining a Linux system. On a daily or weekly basis, this may involve performing a quick command to upgrade your existing packages (and their dependencies) as well as obtain any minor distribution releases (such as upgrading from Ubuntu 18.04.4 to 18.04.5). Every few years, however, Linux distributions reach their EOL (end of life) and the developers stop releasing regular security patches and software updates. When this happens, its highly recommended to upgrade to the newest major release for your distribution.

This guide covers upgrading your existing system through performing a *clean installation* of your preferred distribution. In many cases, this is the upgrade path that's recommended by Linode, as it avoids many issues that arise during *inline* upgrades and allows you to skip directly to the newest distribution release (even if your system is several releases behind).

{{< note >}}
Regardless of your chosen upgrade path ([inline upgrade](#inline-upgrade) or [clean install](#clean-install)), knowledge of your application, your application stack, and general systems administration is important and will help contribute to a seamless and successful upgrade.
{{</ note >}}

## Reasons to Upgrade to a Newer Major Distribution Version

- **Updated Kernel:** Many Linux distributions withhold major kernel updates until the next major distribution release.
- **Security patches:** Most distributions (aside from rolling-release distributions like Arch) have a defined EOL (end of life) date in which no additional security patches are released. If you are running a distribution beyond this date, you will become more vulnerable to security threats over time.
- **New features:** Each new major release of a Linux distribution is an opportunity for the developers to include new features and enhancements. These may enable new workflows or make the system more efficient. To learn more about what might be included, review the release notes for the distribution you're interested in upgrading to.
- **Application support:** Most Linux applications are distributed through repositories that are specific to each distribution version. Repositories for EOL distributions are typically not updated to include the latest software. In addition, some applications require features or components only found on newer operating systems.

## Consider the Available Upgrade Paths

### Inline Upgrade

An inline (or in-place) upgrade involves upgrading your existing Linux system (or a copy of that existing system). All of your data remains and the operating system upgrades itself to the latest version. The viability of this process depends on several factors, including if your Linux distribution supports it, how reliable the process is for your distribution, and how complex your system configuration is. When this process works smoothly, its quicker and easier compared to other options as it typically just involves running a few commands. This guide does not cover inline upgrades, though the following guides do:

- [How to Upgrade to Ubuntu 18.04 LTS (Bionic Beaver)](/docs/guides/upgrade-to-ubuntu-18-04/)
- [Upgrade Debian to the Newest Release](/docs/guides/upgrade-debian-to-the-newest-release/)

*Consider an inline upgrade when your system is just one release behind your distribution's latest version and the built-in method for inline upgrades for your distribution is reliable.*

### Clean Install

This entails deploying the desired distribution version to a new server, potentially manually installing any required packages, and then copying over your application data. Although upgrading through a clean installation is much more involved, it can be easier to troubleshoot any issues that arise. Another main benefit is that the new system will not have any extra packages or "digital residue" that may have accumulated over years of operating the original system. It also allows you to skip ahead to the newest distribution release, even if you are several releases behind. If you wish to upgrade through a clean installation, continue following this guide.

*Consider a clean install when your system is several releases behind your distribution's latest version, when switching to a different distribution altogether, or when making major changes to your software stack.*

{{< note >}}
DevOps provisioning tools (such as [Terraform](/docs/guides/beginners-guide-to-terraform/) and [Ansible](/docs/guides/getting-started-with-ansible/)), container platforms ([Docker](/docs/guides/introduction-to-docker/)), and orchestration systems ([Kubernetes](/docs/guides/beginners-guide-to-kubernetes/)) generally make deploying system updates much easier. If your application or DevOps process uses one of these tools, upgrading to the latest operating system may be as simply as adjusting a line in a configuration file. In those cases, consult the tool's documentation to learn more about targeting a newer Linux distribution.
{{</ note >}}

## Before you Begin

- **Ensure you have login credentials to the original system** for either the root user or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

    {{< note >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

- **Back up any important data stored on your Linode.** If your Linode has the [Backups](https://www.linode.com/products/backups/) service enabled, consider taking a manual snapshot before upgrading your system. If you use a different backup service or application, you should verify that a recent backup is available. See [Backing Up Your Data](/docs/guides/backing-up-your-data/).

## Steps for Performing an Upgrade through a Clean Install

1. [Create a new Linode](#create-a-new-linode) in the same data center as the original Linode, making sure to select the distribution image you wish to use for the base of the upgraded system.
1. [Install the required packages](#install-required-packages-on-the-new-linode) on the new Linode.
1. [Copy over your data](#copy-data-and-configuration-files) and configuration files to the new Linode.
1. [Transfer the IPv4 addresses](#transfer-ipv4-addresses) of the original Linode to the new Linode.
1. [Start using the new system](#start-using-the-new-linode) by rebooting the new Linode and verifying that all of your applications work as expected.

## Create a New Linode

To get started, create a new Linode by following the instructions within the [Getting Started](/docs/guides/getting-started/) and [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guides. Keep the following considerations in mind:

-  **Distribution:** Select the distribution image you wish to use for the base of the upgraded system. For most cases, you should likely select the latest LTS (long term support) release of the same distribution as the original system. For instance, if the original system is Ubuntu 18.04 LTS, select the latest Ubuntu LTS release (20.04 at the time of this writing). You might also wish to upgrade to a new distribution that's based on (or similar to) your current system. As an example, you can upgrade a CentOS 7 (or 8) system to AlmaLinux 8 (or RockyLinux 8). See [Choosing a Linux Distribution](/docs/guides/choosing-a-distribution/) for a full list of the distribution images available on Linode.
-  **Region:** The new Linode must reside in the same region (data center) as the original Linode.
-  **Linode Plan:** Chose a plan that accommodates the applications you wish to run and meets any storage requirements you may have. In many cases, selecting the same (or larger) plan is a safe choice.

## Install Required Packages on the New Linode

Linux packages contain the software and applications needed for your Linux system to work as you intend it to. Your original Linode likely contains a multitude of packages, each corresponding with a software or dependency. For instance, if you are running a WordPress website, your original system likely contains many different packages for php, mysql (or mariadb), and your web server (such as Apache or NGINX).

As part of this upgrade process, all packages required for the applications you are running need to be installed on the newer system. There are a few ways to determine which packages are needed.

### Review the Documentation for Your Applications (Recommended)

This approach involves reviewing the installation instructions (and requirements) for each application you wish to use. This approach may be the cleanest approach, as only packages that are currently required by your application will be installed. You can review the official documentation for a given application or take a look at our own guides for installing certain software stacks and applications. Here are a few of our popular guides. While Ubuntu versions of the guides are linked, other distributions are available.

- [How to Install the LEMP Stack on Ubuntu 18.04](/docs/guides/how-to-install-the-lemp-stack-on-ubuntu-18-04/)
- [How to Install a LAMP Stack on Ubuntu 20.04](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-20-04/)
- [Install WordPress on Ubuntu 20.04](/docs/guides/how-to-install-wordpress-ubuntu-2004/)

Whichever documentation you review, follow the installation steps to install all required software.

The downside to this approach is that you may need to do a bit of research if you are running many different applications (with many different plugins or third party tools). There's also the possibility that a package may be missed, though most applications provide descriptive error messages with details of the missing packages.

### Manually Review Packages that are Installed on the Original Linode

You can also view the packages that are currently installed on the original system and then install them on the new system. This process can be more tedious, as there are often hundreds or thousands of packages (including obscure dependencies that you might not recognize). The commands needed to view and install packages depend on the distribution and package manager you are using. Below are example commands for finding all installed packages using popular default package managers:

-   [**APT**](/docs/guides/apt-package-manager/) - Debian and Ubuntu

        sudo apt list --installed

-   [**DNF**](/docs/guides/dnf-package-manager/) - RHEL/CentOS 8, other RHEL 8 derivatives (including AlmaLinux 8 and Rocky Linux 8), and Fedora 22 (and later)

        sudo dnf list installed

-   [**YUM**](/docs/guides/yum-package-manager/) - RHEL/CentOS 7

        sudo yum list installed

Next, install all the required packages onto the new system. Again, here are some example commands based on common package managers:

-   [**APT**](/docs/guides/apt-package-manager/) - Debian and Ubuntu

        sudo apt install [package-name]

-   [**DNF**](/docs/guides/dnf-package-manager/) - RHEL/CentOS 8, other RHEL 8 derivatives (including AlmaLinux 8 and Rocky Linux 8), and Fedora 22 (and later)

        sudo dnf install [package-name]

-   [**YUM**](/docs/guides/yum-package-manager/) - RHEL/CentOS 7

        sudo yum install [package-name]

If you are using a different distribution or a different package manager, review the [Overview of Package Management in Linux](/docs/guides/linux-package-management-overview/) guide, as well as the individual pages for each package manager, to determine how to list currently installed packages.

## Copy Data and Configuration Files

Now that all required packages are installed on the new system, you need to copy over your configuration files and application data. The location of this data entirely depends on the applications you are using, the distribution you are running, and the way your system is configured. That said, here are a few common directories where data is stored:

- **Website data:** `/var/[website]`, `/var/www/[website]`, `/var/www/html`
- **User files:** `~/`, `/home/[username]`
- **NGINX configuration files:** `/etc/nginx/`
- **APACHE configuration files:** `/etc/apache2/`
- **Let's Encrypt certificates:** `/etc/letsencrypt/live/[website]/`

These files can be copied over SCP, sFTP, another preferred file transfer utility, or even by using Block Storage Volumes. It's typically safe to copy the entire directory for websites and applications directly into the new system. For configuration files, however, consider if they already exist on the new server. If they do, you may wish to review each file *before overriding* them. These files may contain newer best practices or new required parameters. It is often best to import any of your changes into the newer configuration files instead of overriding them.

{{< caution >}}
Before transferring data, you may want to place any applications in a *maintenance* mode to prevent changes to files or databases. If files do change during the transfer, there may be a chance of corruption or other undesired behavior.
{{</ caution >}}

### SFTP (SSH File Transfer Protocol)

SFTP is a standard protocol for securely listing, downloading, and uploading files on remote systems. This is a very user-friendly approach to file transfers. Many desktop applications are available and can be used to transfer data between the original Linode and the new Linode. These applications include [FileZilla](https://filezilla-project.org/) (free, cross-platform), [WinSCP](https://winscp.net/eng/index.php) (free, Windows-only), [Transmit](https://panic.com/transmit/) (paid, macOS-only), and [Forklift](https://binarynights.com/) (paid, macOS-only). See our [FileZilla guide](/docs/guides/filezilla/) for more information.

### SCP (Secure Copy Protocol)

SCP is a common file transfer command line tool available on most macOS and Linux systems, including WSL on Windows 10. Review the [Download Files from Your Linode > Secure Copy Protocol (SCP)](/docs/guides/download-files-from-your-linode/#secure-copy-protocol-scp) guide for more details.

## Copy any Databases

Databases can be copied in much the same way as files. The major difference is that most databases first require a *database dump*, which writes all of the data stored within the database to a backup file. This database backup file can then be copied to the new system and used to restored the data.

-   To create a dump of a MySQL (or MariaDB) database, use the `mysqldump` command. See [Use mysqldump to Back Up MySQL or MariaDB](/docs/guides/mysqldump-backups/) for instructions on backing up and restoring a database. **You can only use this tool if your database process is accessible and running.**

-   If your MySQL database won't run for some reason, follow the instructions for creating [physical backups](/docs/guides/create-physical-backups-of-your-mariadb-or-mysql-databases/).

-   If you use PostgreSQL, follow the [How to Back Up Your PostgreSQL Database](/docs/guides/how-to-back-up-your-postgresql-database/) guide.

## Transfer IPv4 Addresses

After you've configuring the new Linode, copied over the data, and have performed any tests needed to ensure the system is working as expected, you are just about ready to start using the new system. To make the switch over quick and relatively seamless, you can retain the IPv4 addresses from your original Linode by transferring them to your new Linode. To do this, follow the instructions within the [Managing IP Addresses](/docs/guides/managing-ip-addresses/#transferring-ip-addresses)

{{< note >}}
The Transfer IP functionality only works with IPv4 addresses and cannot transfer IPv6 addresses. If any of your systems, applications, or tools reference the IPv6 address of your original Linode, you will need to update those references with the new IPv6 address. Commonly, this means modifying the [AAAA DNS records](/docs/guides/dns-records-an-introduction/#a-and-aaaa) on your domain(s).
{{< /note >}}

## Start Using the New Linode

Once you've transferred the IP address and/or adjusted any necessary DNS records (or other systems), you can reboot the new Linode. After the Linode has fully powered back on, verify that all of your applications and websites are working as expected. You can delete the original Linode once you're comfortable that it is no longer needed.

If you notice any issues, you may want to consider transferring the IPv4 addresses back to the original Linode rather than attempting to troubleshoot the issue while your applications are using the new Linode. This should avoid further disruption and allow you to thoroughly investigate any issues with the new system.