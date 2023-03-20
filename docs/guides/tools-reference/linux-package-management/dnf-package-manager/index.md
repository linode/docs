---
slug: dnf-package-manager
description: "DNF is the default package manager on RHEL 8, CentOS 8, and Fedora 22 (and later). This guide walks you through the core features of DNF and common commands for using DNF to install, upgrade, and remove packages."
keywords: ['dnf','installing','updating','upgrading','uninstalling','removing','package repositories','fedora']
tags: ['yum','dnf','centos','fedora']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-21
modified: 2021-07-15
modified_by:
  name: Linode
title: "Using DNF to Manage Packages in CentOS/RHEL 8 and Fedora"
title_meta: "How to Use DNF to Manage Packages in CentOS/RHEL 8 and Fedora"
aliases: ['/guides/how-to-use-yum-dnf/','/guides/how-to-use-dnf/']
external_resources:
- '[Fedora Wiki: DNF](https://fedoraproject.org/wiki/DNF)'
- '[DNF Automatic](https://dnf.readthedocs.io/en/latest/automatic.html)'
- '[DNF Command Reference](https://dnf.readthedocs.io/en/latest/command_ref.html)'
authors: ["Nathaniel Stickman"]
---

*Dandified YUM*, or simply **DNF**, is the successor to the popular *Yellowdog Updater, Modified* package manager, more commonly known as **YUM**. Both DNF and YUM provide a user-friendly interface to the RPM Package Manager (RPM) that comes with CentOS, RHEL, Fedora, and many other Linux distributions. As the successor to YUM, DNF has several enhancements including increased performance, faster dependency resolution, and more complete documentation for its API.

DNF has replaced YUM as the default package manager on most newer RPM-based distributions, including:

- RHEL (Red Hat Enterprise Linux) 8
- CentOS 8 and other RHEL derivatives (such as AlmaLinux 8 and Rocky Linux 8)
- Fedora 22 (and later)

While the YUM package manager is no longer used on these distributions, the `yum` command still works in many cases. Most distributions link the `yum` command to the DNF software and, since DNF maintains compatibility with much of YUM's CLI, most commands still function as intended. This is why some documentation for these distributions still reference the `yum` command to install or update software.

This guide aims to familiarize you with the DNF commands you are most likely to encounter while working with your CentOS 8 or Fedora server. By the end, you should feel comfortable navigating all but the more advanced features DNF offers. You can also find a few helpful resources at the end of this guide.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running on CentOS/RHEL 8, AlmaLinux 8, Rocky Linux 8, Fedora 22, or later versions of these distributions.** Other Linux distributions that employ the DNF package manager can also be used. Review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Upgrade Packages

1.  Use the following command to upgrade your installed packages to their latest versions:

        sudo dnf upgrade

    It is usually a good idea to run this command before you begin a new installation to ensure your existing packages are up to date. You are likely to see this command at the beginning of many installation guides and wherever DNF is used.

1.  You can list the installed packages for which updates are available. This command also lists any installed packages that are becoming obsolete.

        sudo dnf check-update

1.  To upgrade a specific package, use the following command.

        sudo dnf upgrade <package-name>

   The following example upgrades the Apache package.

        sudo dnf upgrade httpd

## Install Packages

1.  You can install a package using the following command. This example installs the PHP package:

        sudo dnf install php

1.  You can reinstall a package using the following command:

        sudo dnf reinstall php

## Uninstall Packages

1.  Use the following command to uninstall a package. This example uninstalls the MariaDB package.

        sudo dnf remove mariadb-server

1.  To remove a package and all of the dependency packages that were installed alongside it, use the following command.

        sudo dnf autoremove mariadb-server

    Using the `autoremove` command without specifying a package identifies and removes any packages originally installed as dependencies but which are no longer needed.

        sudo dnf autoremove

1.  DNF also provides an option to remove duplicate packages. The following command removes any older versions installed and reinstalls the newest version.

        sudo dnf remove --duplicates

## Useful Options

DNF provides numerous options in common between many of its commands. The examples below show the most commonly used of these options.

1.  You can provide a list of packages, separated by spaces, where you would normally provide the package name. For instance, the following install Apache, PHP, and MariaDB in a single command:

        sudo dnf install httpd php mariadb-server

1.  To use a specific version of a package, follow the package name with `-` and the desired version number. This works with any of the commands where you designate a package name. This example installs version **0.4.4** of the *NeoVim* package:

        sudo dnf intall neovim-0.4.4

    To identify the available versions of a package, use the `--showdupicates` option with the `list` command and the specific package's name.

        sudo dnf list neovim --showduplicates

1.  Use the `-y`, or `--assumeyes`, flag to automatically answer **Yes** to all prompts DNF would otherwise present. The following example installs *NeoVim* without prompting the user to confirm any steps in the installation process, such as when it needs to install dependencies.

        sudo dnf install neovim -y

## Navigate Packages

1.  To list all packages in DNF's repositories, you can use DNF's `list` command. But, this gives you a massive list of all packages.

    You can use the following options that give you a useful list of a specific group of packages.

    -   The `installed` option lists all of the packages currently installed on your system.

            sudo dnf list installed

    -   The `recent` option lists packages added to the DNF repositories in the past week.

            sudo dnf list recent

    -   You can also give the name of a package along with the `--showduplicates` flag. This gives a list of available versions of the package. You can see a version of this command used in the [Useful Options](/docs/guides/dnf-package-manager/#useful-options) section above. The example below shows all of the versions of Git available in DNF's repositories:

            sudo dnf list git --showduplicates

1.  You can search DNF's available packages using the following command. Here, the command finds packages that have the term `git` in their metadata.

        sudo dnf search git

    The `search` command supports multiple arguments separated by spaces. You can use this to search for multiple keywords.

        sudo dnf search version control

1.  If you want to find a package based on a specific command it provides, you can use a command like the following. This example finds packages that provide a `jupyter-notebook` command.

        sudo dnf provides jupyter-notebook

    In this case, the search comes up with the `python3-notebook` package.

1.  You can also get additional details about a package. For example, the `python3-notebook` package was found in the previous example.

        sudo dnf info python3-notebook

## Automate Package Updates

DNF has a supplemental package, [DNF Automatic](https://dnf.readthedocs.io/en/latest/automatic.html), which allows you to configure an automated process for updating packages. These steps show you how to install and get started using DNF Automatic.

1.  Install the DNF Automatic package.

        sudo dnf install dnf-automatic

1.  Using your preferred text editor, open the DNF Automatic configuration file which is located at: `/etc/dnf/automatic.conf`. Here, enter your configuration preferences.

    The following presents example values for some configuration options. It is recommended that you change these values.

    ```file {title="/etc/dnf/automatic.conf"}
    [commands]
    #
    upgrade_type=default
    #
    download_update=yes
    # ...
    apply_updates=yes
    #
    emit_via=motd
    ```

    You can switch `upgrade_type` to `security` if you want to limit the updates made to only those impacting system security. With `emit_via` set to `motd`, DNF Automatic's reports will be stored in the `/etc/motd` file.

    {{< note >}}
    The `email` option can be used here, but that the email can only be delivered to a local user unless you have configured an SMTP server.
    {{< /note >}}

1.  You can start the DNF Automatic timer by running the following command:

        sudo systemctl enable --now dnf-automatic.timer

1.  You can verify that the timer has been created with the following command:

        sudo systemctl list-timers dnf-*

## Conclusion

-   With the information in this guide, you should be armed for the majority of cases in which you are likely to use DNF on your Fedora webserver. If you come to a situation where you need to use DNF's more advanced features, you can explore DNF with the `-h`, or `--help`, flag.

        sudo dnf -h

-   For more information on a specific DNF command and a list of the command's options, follow the command with the `-h` flag. This example gets information on the `autoremove` command:

        sudo dnf autoremove -h

-   You can also check out the official [DNF Command Reference](https://dnf.readthedocs.io/en/latest/command_ref.html) documentation to learn more about DNF.
