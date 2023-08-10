---
slug: zypper-package-manager
title: "Use Zypper to Manage Packages in openSUSE"
description: "In this guide, learn how to use Zypper, the default package manager on openSUSE. Follow along for the core commands in Zypper for installing, searching, and managing packages and working with repositories."
keywords: ['zypper','zypp','opensuse']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-08-10
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[openSUSE Wiki: Zypper Usage](https://en.opensuse.org/SDB:Zypper_usage)'
- '[openSUSE Wiki: Zypper Manual](https://en.opensuse.org/SDB:Zypper_manual)'
- '[openSUSE Docs: Managing Software with Command Line Tools](https://doc.opensuse.org/documentation/leap/reference/html/book-reference/cha-sw-cl.html)'
---

Zypper is a command-line package management system for the openSUSE and SUSE Linux Enterprise (SLE) distributions. Zypper builds on the software-management functions of ZYpp (libzypp) for installing, removing, and managing packages, as well as managing package repositories on your system.

ZYpp also underlies YaST, a graphical (GUI) tool that provides similar functions to command-line package managers like Zypper.

Learn in this guide how to use Zypper to execute common package management tasks from the command line on your openSUSE or other supported system. The guide covers Zypper's commands for installing, managing, and navigating packages. Additionally, the guide shows you how you can add and update repositories in Zypper.

## Before You Begin

Before running the commands within this guide, you will need:

1. **A system running on openSUSE.** Other Linux distributions that employ the Zypper package manager can also be used. Review the [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guide if you do not yet have a compatible system.

1. **Login credentials to the system** for either the root user (not recommended) or a standard user account (belonging to the `sudo` group) and the ability to access the system through [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/). Review the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide for assistance on creating and securing a standard user account.

{{< note respectIndent=false >}}
Some commands in this guide require elevated privileges and are prefixed with the `sudo` command. If you are logged in as the root use (not recommended), you can omit the `sudo` prefix if desired. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/#understanding-the-sudo-linux-group-and-user) guide.
{{< /note >}}

## Install Packages

Zypper's `install` command installs or updates a given package along with the package's associated dependencies. The command takes the package name as its argument. The example here installs the `php8` package.

```command
sudo zypper install php8
```

Zypper can also specify a particular version of a package. Take a look further on at the section on [viewing package information](/docs/guides/zypper-package-manager/#view-information-about-packages) for a method to get a list of available versions for a given package.

Once you have a specific version, append it after the package name using a comparison operator. The simplest form of this is using `=` to specify the exact version.

```command
sudo zypper install php8=8.0.29
```

Zypper also supports the use of greater-than and lesser-than comparisons. Just be sure to wrap the package name and version information in single quotes to avoid the shell interpreting the special characters.

```command
sudo zypper install 'php8>=8.0.29'
```

## Update Packages

Zypper has two kinds of updates for installed packages. The first, using the `update` command, updates packages to their latest versions. Usually this is what other package managers mean by "update," and with Zypper it is known as *package-wise* updating.

The other kind of update available in Zypper uses the `patch` command. Known as *patch-wise* updating, the process does not necessarily update a package to its latest version. Instead, a stable patches may be applied that addresses security issues or other vulnerabilities.

The addition of patch-wise updating can be especially helpful when maintaining a production environment. Such an environment places a premium on maintaining stability and compatibility. Patches help keep things stable while still ensuring protection against possible vulnerabilities in your installed packages.

### Package-wise Updates

The `update` command manages package-wise updates. Without any arguments, the command updates all installed packages to their latest versions.

```command
sudo zypper update
```

You can also provide a package name as an argument to target a specific package for updating.

```command
sudo zypper update python3
```

Before applying updates, you may want to preview what packages an update would impact. The `list-updates` command gives you a full list of installed packages with newer versions available.

```command
sudo zypper list-updates
```

### Patch-wise Updates

The `patch` command applies patch-wise updates. Running the command applies all necessary patch updates to your installed packages.

```command
sudo zypper patch
```

As with the package-wise updates, you can use a command — `list-patches` — to list necessary patch-wise updates. You can in this way get a preview of packages that would be impacted by a `patch` command.

```command
sude zypper list-patches
```

The `list-patches` command only lists necessary patches — that is, patches that are deemed applicable to you and have not otherwise been applied. But you can use the `patches` command to get a list of all patches for your installed packages.

```command
sudo zypper patches
```

## Uninstall Packages

Packages can be uninstalled with Zypper using the `remove` command. Doing so also uninstalls recommended packages that were installed with the named package.

```command
sudo zypper remove php8
```

You can add the `--clean-deps` option to ensure that the command also uninstalls package dependencies that are no longer needed by any other installed packages.

```command
sudo zypper remove --clean-deps php8
```

## Search through Packages

Zypper's `search` command allows you to query packages available in your Zypper repositories. The command takes the search string as an argument.

```command
sudo zypper search php
```

```output
S | Name                        | Summary                                                               | Type
--+-----------------------------+-----------------------------------------------------------------------+-----------
...
  | php8                        | Interpreter for the PHP scripting language version 8                  | package
...
```

You can add the `-i` option to the command to limit the search to installed packages.

```command
sudo zypper search -i python
```

```output
S | Name                       | Summary                                                                 | Type
--+----------------------------+-------------------------------------------------------------------------+--------
...
i | python3                    | Python 3 Interpreter                                                    | package
...
```

For any search, an `i` in the left-most column indicates that a given package is already installed. A `v` in that same column would indicate that the given package is installed in a different version.

## View Information About Packages

The Zypper command `info` can be used to get detailed information about a specific package. Using this can preview a package before installing it.

```command
sudo zypper info php8
```

```output
Information for package php8:
-----------------------------
Repository     : Update repository with updates from SUSE Linux Enterprise 15
Name           : php8
Version        : 8.0.29-150400.4.34.1
...
```

In some cases, the default (latest) version may not be what you need. For instance, the `info` command above shows that the `php8` package installs version `8.0.29`.

Use a honed version of the `search` command like the one below to get a list of available versions of a given package. The `--details` option provides detailed information in the results. The `--match-exact` option ensures that the results only include the named package.

``` command
sudo zypper search --details --match-exact php8
```

```output
S | Name | Type       | Version              | Arch   | Repository
--+------+------------+----------------------+--------+-------------------------------------------------------------
  | php8 | package    | 8.0.29-150400.4.34.1 | x86_64 | Update repository with updates from SUSE Linux Enterprise 15
  | php8 | package    | 8.0.28-150400.4.31.1 | x86_64 | Main Repository
...
```

## Add Package Repositories to Access More Packages

Zypper pulls packages, and package information, from its list of package repositories. Using the `repos` command gives you a list of Zypper's current repositories.

```command
sudo zypper repos
```

In some cases, a needed package may not be in one of the default repositories. For instance, examples above show that the default repositories have only up to version `8.0.29` of the `php8` package. But PHP has a version `8.2.8` available.

Using the `addrepo` command, you can add an additional repository by its URL. Extending the `php8` example, openSUSE has a dedicated PHP repository that includes the package's newer versions.

```command
sudo zypper addrepo --refresh https://download.opensuse.org/repositories/devel:/languages:/php/openSUSE_Leap_15.5/ php
```

The `--refresh` option enables autorefresh on the repository, which makes repository management easier. See the next section for more details.

Once you have added the repository, you can use the `search` command as shown earlier to see additional packages offered by the repository.

```command
sudo zypper search --details --match-exact php8
```

```output
S | Name | Type       | Version              | Arch   | Repository
--+------+------------+----------------------+--------+-------------------------------------------------------------
  | php8 | package    | 8.2.8-lp155.131.2    | x86_64 | php
  | php8 | package    | 8.0.29-150400.4.34.1 | x86_64 | Update repository with updates from SUSE Linux Enterprise 15
  | php8 | package    | 8.0.28-150400.4.31.1 | x86_64 | Main Repository
...
```

The `search` command also offers a `--repo` option that you can use to limit your search to a given repository.

```command
sudo zypper search --repo php -s php8
```

```output
S | Name                         | Type       | Version           | Arch   | Repository
--+------------------------------+------------+-------------------+--------+-----------
...
  | php8                         | package    | 8.2.8-lp155.131.2 | x86_64 | php
...
```

## Update Package Repositories

Zypper does not usually require you to manually refresh repository metadata. This contrasts some other package managers, like [APT](/docs/guides/apt-package-manager/), that require manual repository refreshes.

Zypper accomplishes this with its *autorefresh* feature. This feature is enabled on all of the default repositories, and it ensures that the repositories are automatically refreshed whenever necessary.

Unless you need manual control of the refresh process for a repository, you should enable autorefresh whenever you add a new repository. This is done by using the `--refresh` option with the `addrepo` command, just as shown in the previous section.

If, however, you want to add a repository without autorefresh, you can do so by omitting the `-r` option when adding the repository.

```command
sudo zypper addrepo https://download.opensuse.org/repositories/devel:/languages:/php/openSUSE_Leap_15.5/ php
```
Zypper includes a `refresh` command to allow you to manually refresh repositories for updated metadata. Doing so is an important step should you opt not to enable autorefresh on added repositories.

```command
sudo zypper refresh php
```
