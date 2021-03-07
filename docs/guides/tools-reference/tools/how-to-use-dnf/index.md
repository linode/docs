---
slug: how-to-use-dnf
author:
  name: Linode Community
  email: docs@linode.com
description: "DNF is the default package manager on Fedora and gives users an efficient tool for managing packages. This guide familiarizes you with DNF's capabilities and gets you started with its most commonly used features."
og_description: "DNF is the default package manager on Fedora and gives users an efficient tool for managing packages. This guide familiarizes you with DNF's capabilities and gets you started with its most commonly used features."
keywords: ['dnf','installing','updating','upgrading','uninstalling','removing','package repositories','fedora']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-07
modified_by:
  name: Nathaniel Stickman
title: "How to Use DNF"
h1_title: "How to Use DNF"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Fedora Wiki: DNF](https://fedoraproject.org/wiki/DNF)'
---

Dandified YUM, or simply DNF, is Fedora's default package manager and an upgrade to the popular Yellowdog Updater, Modified (YUM). Like YUM, DNF gives a user-friendly interface to the RPM Package Manager (RPM) that comes with Fedora, CentOS, and many other Linux distributions. YUM has remained a popular package manager — and the default on CentOS. But with DNF, Fedora set out to improve on YUM's performance and create its own contender.

This guide aims to familiarize you with the DNF commands you are most likely to encounter while working with your Fedora server. By the end, you should feel comfortable navigating all but the more advanced features DNF offers. And for those, you can find a few helpful resources at the end of this guide.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Upgrading Packages

1. Use the following command to upgrade your installed packages to their latest versions:

        sudo dnf upgrade

    It is usually a good idea to run this command before you begin a new installation to ensure your existing packages are up to date. In fact, you are likely to see this command at the beginning of many installation guides and the like where DNF is used.

1. You can list the installed packages for which updates are available. This command also lists any installed packages that are becoming obsolete:

        sudo dnf check-update

1. To upgrade a specific package, use a command like the following. This example upgrade the Apache package:

        sudo dnf upgrade httpd

## Installing Packages

1. Use a command like the following to install a package. This example installs the PHP package:

        sudo dnf install php

1. You can reinstall a package using a command like the following:

        sudo dnf reinstall php

## Uninstalling Packages

1. Use a command like the following to uninstall a package — the MariaDB package in this example:

        sudo dnf remove mariadb-server

1. To remove a package and all of the dependency packages that were installed alongside it, use a command like the following:

        sudo dnf autoremove mariadb-server

    Using the `autoremove` command without specifying a package identifies and removes any packages originally installed as dependencies but which are no longer needed:

        sudo dnf autoremove

1. DNF also provides an option to remove duplicate packages. The command removes any older versions installed and reinstalls the newest:

        sudo dnf remove --duplicates

## Useful Options

DNF provides numerous options in common between many of its commands. The examples below show the most commonly used of these options.

1. You can provide a list of packages, separated by spaces, where you would normally provide the package name. For instance, the following installs Apache, PHP, and MariaDB in a single command:

        sudo dnf install httpd php mariadb-server

1. To use a specific version of a package, follow the package name with `-` and the desired version number. This works with any of the commands where you designate a package name. This example installs version **0.4.4** of the NeoVim package:

        sudo dnf intall neovim-0.4.4

    To identify the available versions of a package, use the `--showdupicates` option with the `list` command and the specific package's name:

        sudo dnf list neovim --showduplicates

1. Use the `-y`, or `--assumeyes`, flag to automatically answer **Yes** to all prompts DNF would otherwise present. The following example installs NeoVim without prompting the user to confirm any steps in the installation process, such as when it needs to install dependencies:

        sudo dnf install neovim -y

## Navigating Packages

1. DNF's `list` command can fetch lists of packages. By itself, the command lists all of the packages in DNF's repositories, which is a massive list. Using the command with one of the following options, though, gives you a useful list of a specific group of packages.

    The `installed` option lists all of the packages currently installed on your system:

        sudo dnf list installed

    The `recent` option lists packages added to the DNF repositories in the past week:

        sudo dnf list recent

    Giving the name of a package along with the `--showduplicates` flag gives a list of available versions of the package. You can see a version of this command used in the [Useful Options](/docs/guides/how-to-use-dnf/#useful-options) section above. The example below shows all of the versions of Git available in DNF's repositories:

        sudo dnf list git --showduplicates

1. You can search DNF's available packages using a command like the following. Here, the command finds packages that have the term `git` in their metadata:

        sudo dnf search git

    The `search` command supports multiple arguments separated by spaces. You can use this to search for multiple keywords:

        sudo dnf search version control

1. If you want to find a package based on a specific command it provides, you can use a command like the following. This example finds packages that provide a `jupyter-notebook` command:

        sudo dnf provides jupyter-notebook

    In this case, the search comes up with the `python3-notebook` package.

1. Use a command like the following to get additional details about a package — here, the `python3-notebook` package found in the previous example:

        sudo dnf info python3-notebook

## Automating Package Updates

DNF has a supplemental package, [DNF Automatic](https://dnf.readthedocs.io/en/latest/automatic.html), which allows you to configure an automated process for updating packages. These steps show you how to install and get started using DNF Automatic.

1. Install the DNF Automatic package:

        sudo dnf install dnf-automatic

1. Using your preferred text editor, open the DNF Automatic configuration file, `/etc/dnf/automatic.conf`. Here, enter your configuration preferences. The following presents example values for some configuration options it is recommended that you change:

    {{< file "/etc/dnf/automatic.conf" >}}
[commands]
# ...

upgrade_type=default
# ...

donwload_update=yes
#...

apply_updates=yes
# ...

emit_via=motd
    {{< /file >}}

    You can switch `upgrade_type` to `security` if you want to limit the updates made to only those impacting system security. With `emit_via` set to `motd`, DNF Automatic's reports will be stored in the `/etc/motd` file. The `email` option can be used here, but be aware that the email can only be delivered to a local user unless you have configured an SMTP server.

1. When you have your configuration how you would like it, run the following command to start the DNF Automatic timer:

        sudo systemctl enable --now dnf-automatic.timer

1. You can verify that the timer has been created with the following command:

        sudo systemctl list-timers dnf-*

## Conclusion

With the information in this guide, you should be armed for the majority of cases in which you are likely to use DNF on your Fedora server. If you come to a situation where you need to use DNF's more advanced features, you can explore DNF with the `-h`, or `--help`, flag:

    sudo dnf -h

For more information on a specific DNF command and a list of the command's options, follow the command with the `-h` flag. This example gets information on the `autoremove` command:

    sudo dnf autoremove -h

You can also check out the official DNF [command reference documentation](https://dnf.readthedocs.io/en/latest/command_ref.html) to learn more about DNF.

