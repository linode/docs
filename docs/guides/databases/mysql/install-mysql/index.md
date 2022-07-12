---
slug: install-mysql
author:
  name: Linode
description: "Learn how to install MySQL on Linux (through your distribution's native repositories or by using MySQL's own), Windows, and macOS."
keywords: ['mysql','repository','database']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-01
modified: 2022-07-01
modified_by:
  name: Linode
title: "Installing MySQL: A Definitive Guide"
external_resources:
- '[Installing and Upgrading MySQL](https://dev.mysql.com/doc/refman/8.0/en/installing.html)'
---

[MySQL](/docs/guides/an-overview-of-mysql/) is one of the most popular SQL-based relational databases. The Community Edition is available at no charge and is widely used across the industry. This guide walks you through installing and updating MySQL Community on Windows, macOS, and Linux (either through the native repositories or MySQL's own repositories).

- [Windows](#installing-mysql-on-windows)
- [macOS](#installing-mysql-on-macos)
- [Linux through your distribution's native repositories](#installing-mysql-on-linux-native-repositories)
- [Linux through MySQL's APT and YUM repositories](#installing-mysql-on-linux-mysqls-repositories) (recommended)

When installing MySQL, you can either install *MySQL Server* or *MySQL client utilities*. Installing the entire MySQL Server software is the most common option. This allows you to run a full database server on your system. It also installs all of the client utilities that you might need when working with any MySQL instances (a locally installed one or one on a remote system). If you want to reduce disk usage or know you only need the client utilities, you can install the MySQL client package. Alternatively, consider installing and using the [MySQL Shell](https://dev.mysql.com/doc/mysql-shell/8.0/en/).

Currently, there are two primary MySQL releases to consider: MySQL 5.7 and MySQL 8.0. Both are still receiving support and updates (until October 2023 and April 2026 respectively). You should likely install MySQL 8.0 unless your application does not yet support it.

{{< note >}}
For additional instructions on installing MySQL on any supported operating system, see the [Installing and Upgrading MySQL](https://dev.mysql.com/doc/refman/8.0/en/installing.html) guide in the official documentation.
{{</ note >}}

## Before You Begin

-   **Consider other deployment options, such as fully managed solutions or automated installations.**

    - [Linode MySQL Managed Databases](https://www.linode.com/products/mysql/): Fully managed database clusters, complete with automatic updates and backups, hosted on Linode's reliable platform.
    - [MySQL/MariaDB Marketplace App](https://www.linode.com/marketplace/apps/linode/mysql-mariadb/): Deploy a new Compute Instance with either MySQL or MariaDB preinstalled.

-   **Check to see if MySQL is already installed on your system.** To determine if MySQL is already installed, run the following command:

        mysql --version

    The above command should inform you which version you are using. If this command is not found, continue with the installation steps below. If the installed version differs from the release you want to use, consider first uninstalling it and then continuing with the instructions below.

{{< note >}}
The steps in this guide are written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Installing MySQL on Windows

1. Open a web browser and navigate to the [MySQL Installer Downloads](https://dev.mysql.com/downloads/installer/) page. By default, the latest version of MySQL is displayed. You can also view the installer files for [8.0](https://dev.mysql.com/downloads/windows/installer/8.0.html) or [5.7](https://dev.mysql.com/downloads/windows/installer/5.7.html) directly. Alternatively, you can navigate to the **Archives** tab and select any MySQL release and version you wish.

1. Select your operating system version, click the **Download** link corresponding with the package you'd like to install, and then click the **No thanks, just start my download** link. The file should now start downloading.

1. Open the downloaded file and follow the prompts to install MySQL on your system.

## Installing MySQL on macOS

1. Open a web browser and navigate to the [MySQL Community Server Downloads](https://dev.mysql.com/downloads/mysql/) page. By default, the latest version of MySQL is displayed. You can also view the installer files for [8.0](https://dev.mysql.com/downloads/mysql/8.0.html) or [5.7](https://dev.mysql.com/downloads/mysql/5.7.html) directly. Alternatively, you can navigate to the **Archives** tab and select any MySQL release and version you wish.

1. Select your operating system version, click the **Download** link corresponding with the package you'd like to install, and then click the **No thanks, just start my download** link. The file should now start downloading.

1. Open the downloaded file and follow the prompts to install MySQL on your system.

## Installing MySQL on Linux: Native Repositories

One of the fastest ways to quickly install MySQL on *most* common Linux distributions is to use the distribution's default/native repositories. For greater control over the release and version that's installed, and to get the latest versions faster, you may want to consider using [MySQL's own YUM or APT repositories](#installing-mysql-on-linux-mysqls-repositories).

### CentOS Stream 8 (and 9), CentOS/RHEL 8 (and 9)

    sudo dnf upgrade && sudo dnf install mysql-server

- **MariaDB Server package:**  `mysql-server`

- **MariaDB Client package:**  `mysql`

### CentOS/RHEL 7

MySQL is not available through CentOS 7's native repositories (see [CentOS 7 Packages list](http://mirror.centos.org/centos/7/os/x86_64/Packages/)). Installing the `mysql` package actually installs the `mariadb` package. While MariaDB can be used as a drop-in replacement in some cases, it may be preferable to install MySQL through the [MySQL YUM repository](#installing-mysql-on-linux-mysqls-repositories).

    sudo yum update && sudo yum install mariadb-server

- **MariaDB Server package:**  `mariadb-server`

- **MariaDB Client package:**  `mariadb`

### Debian

MySQL is not available through Debian's native repositories. Instead, Debian includes MariaDB. While MariaDB can be used as a drop-in replacement in some cases, it may be preferable to install MySQL through the [MySQL APT repository](#installing-mysql-on-linux-mysqls-repositories).

    sudo apt update && sudo apt install mariadb-server

- **MariaDB Server package:**  `mariadb-server`

- **MariaDB Client package:**  `mariadb-client`


### Fedora

    sudo dnf update && sudo dnf install mysql-community-server

- **MySQL Server package:**  `mysql-community-server`

- **MySQL Client package:**  `mysql-community`

### Ubuntu

    sudo apt update && sudo apt install mysql-server

Replace *mysql-server* with one of the available packages below. If no version is specified in the package name, the default version is installed.

- **MySQL Server packages:**  `mysql-server`

    Target a specific version with `mysql-server-5.7` or `mysql-server-8.0`. See [Ubuntu Package Search](https://packages.ubuntu.com/search?keywords=mysql-server) for more.

- **MySQL Client packages:**  `mysql-client`

    Target a specific version with `mysql-client-5.7` or `mysql-client-8.0`. See [Ubuntu Package Search](https://packages.ubuntu.com/search?keywords=mysql-client) for more.

## Installing MySQL on Linux: MySQL's Repositories

Using MySQL's own repositories provides the latest MySQL versions faster than most native repositories. It also allows you more control over the version that is installed.

### Ubuntu and Debian (APT Repository)

1.  Download the release package for your distribution. Currently, all compatible distributions are combined into a single release package.

        wget https://dev.mysql.com/get/mysql-apt-config_0.8.22-1_all.deb

    If you'd like to download the latest version of this file or to select a different distribution, visit the [MySQL APT Repository Downloads](https://dev.mysql.com/downloads/repo/apt/) page. To obtain the URL for the file, click the **Downloads** button next to the package you wish to download, right click on the **No thanks, just start my download** link, and select **Copy Link Address** (or similar).

1.  Install the downloaded release package. If you downloaded a different file than featured in the previous step, adjust the filename as needed.

        sudo dpkg -i ./mysql-apt-config_0.8.22-1_all.deb

1.  The repository configuration tool should automatically start. If not, you can run it using the following command:

        sudo dpkg-reconfigure mysql-apt-config

1.  Within the configuration tool, you can select from the options below to adjust how the repository is configured in your system:

    - **MySQL Server & Cluster:** Select **mysql** to add MySQL Server packages, **mysql-cluster** to add the [MySQL NDB Cluster](https://dev.mysql.com/doc/refman/8.0/en/mysql-cluster.html), or **None** to forgo adding either option.

    - **MySQL Tools & Connectors:** When enabled, this option adds all of the additional tools and utilities included with the MySQL software.

    - **MySQL Preview Packages:** Leave this option as disabled in production, though non-production environments can enable this to test unreleased features and products.

1.  Run the update command to obtain updated package version and dependency information:

        sudo apt update

1.  Install MySQL Server or just the MySQL client tools:

    -   **MySQL Server:**

            sudo apt install mysql-server

    -   **MySQL Client Utilities:**

            sudo apt install mysql-client

    Additional information about the packages available within MySQL's APT repository can be found by exploring the repository for your distribution: [Ubuntu](https://repo.mysql.com/apt/ubuntu/dists/) or [Debian](https://repo.mysql.com/apt/debian/dists/).

### CentOS/RHEL and Fedora (YUM Repository)

1.  Download the release package for your distribution.

        curl -OL [file-url]

    - **CentOS/RHEL 8:** `https://dev.mysql.com/get/mysql80-community-release-el8-4.noarch.rpm`
    - **CentOS/RHEL 7:** `https://dev.mysql.com/get/mysql80-community-release-el7-6.noarch.rpm`
    - **Fedora 35:** `https://dev.mysql.com/get/mysql80-community-release-fc35-3.noarch.rpm`
    - **Fedora 34:** `https://dev.mysql.com/get/mysql80-community-release-fc34-4.noarch.rpm`

    If you'd like to download the latest file or to select a different distribution, visit the [MySQL YUM Repository Downloads](https://dev.mysql.com/downloads/repo/yum/) page. To obtain the URL for the desired file, click the **Downloads** button next to the package you wish to download, right click on the **No thanks, just start my download** link, and select **Copy Link Address** (or similar).

1.  Install the downloaded release package, replacing *[filename]* with the file you just downloaded.

        sudo yum install [filename]

    Once installed, you can view all available packages and all enabled packages by running the commands below:

        yum repolist all | grep mysql
        yum repolist enabled | grep mysql

1.  By default, the MySQL 8.0 release will be installed. To switch this to MySQL 5.7 or any other available release, run the following commands:

    -   **CentOS Stream 8 (and 9), CentOS/RHEL 8 (and 9)**

            sudo dnf config-manager --disable mysql80-community
            sudo dnf config-manager --enable mysql57-community

    -   **CentOS/RHEL 7:**

            sudo yum-config-manager --disable mysql80-community
            sudo yum-config-manager --enable mysql57-community

1.  Within CentOS/RHEL 8 distributions, disable the default MySQL module.

        sudo dnf module disable mysql

1.  Install MySQL Server or just the MySQL client tools:

    -   **MySQL Server:**

            sudo yum install mysql-community-server

    -   **MySQL Client Utilities:**

            sudo yum install mysql-community-client

    Additional information about the packages available within MySQL's YUM repository can be found by [exploring the repository](https://repo.mysql.com/yum/).