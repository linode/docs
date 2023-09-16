---
slug: install-and-update-software-with-cloud-init
title: "Use Cloud-init to Install and Update Software on New Servers"
description: 'Learn how you can use cloud-init to upgrade and install software automatically when initializing new servers.'
og_description: 'Learn how you can use cloud-init to upgrade and install software automatically when initializing new servers.'
keywords: ['cloud-init','cloudinit','apt','yum']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Nathaniel Stickman"]
published: 2023-09-15
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Cloud-init Documentation - Module Reference: Package Update Upgrade Install](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#package-update-upgrade-install)'
- '[Cloud-init Documentation - Cloud-config Examples: Install Arbitrary Packages](https://cloudinit.readthedocs.io/en/latest/reference/examples.html#install-arbitrary-packages)'
---

[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) offers a cross-platform, cross-distribution approach to automating server initialization. With Akamai's [Metadata](/docs/products/compute/compute-instances/guides/metadata/) service, you can leverage cloud-init to deploy Compute Instances, employing custom user data scripts to define your desired setup.

In this guide, learn how to manage packages on new servers using cloud-init. Whether you want to upgrade system packages, install packages during initialization, or managing your repositories, this tutorial shows you how.

Before getting started, you should review our guide on how to [Use Cloud-init to Automatically Configure and Secure Your Servers](/docs/guides/configure-and-secure-servers-with-cloud-init/). There, you can see how to create a cloud-config file, which you need to follow along with the present guide. And when you are ready to deploy your cloud-config the guide linked above shows you how.

## Upgrade Packages

Cloud-init includes a module for managing package updates and upgrades during initialization. To start, the `package_update` option, when set to `true`, applies updates to installed packages and updates the package repositories. This option is generally useful to ensure the server is working from the most up-to-date package references.

```file {title="cloud-config.yaml" lang="yaml"}
package_update: true
```

The `package_upgrade` option upgrades installed packages to their latest versions. Unless you need specific package versions, running this option during initialization keeps your system more stable and secure.

```file {title="cloud-config.yaml" lang="yaml"}
package_upgrade: true
```

Additionally, cloud-config has an option to ensure that the system reboots for any package upgrades or installations that require it. With this option, you ensure that any package upgrades — and installations — are ready to use immediately after the cloud-init process has finished.


```file {title="cloud-config.yaml" lang="yaml"}
package_update: true
package_upgrade: true
package_reboot_if_required: true
```

## Install Packages

To install packages with cloud-init, you can use the `packages` option in your cloud-config. Provide the option a list of package names, and cloud-init handles installation during the initialization.

Below are examples installing the main components of a LAMP stack, a popular web application setup. Cloud-config requires exact package names, which can vary between distributions — as can the overall prerequisites for a setup. So, to demonstrate, these examples show you how the setup would look between two different distributions.

If you are interested, you can learn more about the LAMP stack, and its package prerequisites, in our guide on [How to Install a LAMP Stack](/docs/guides/how-to-install-a-lamp-stack-on-ubuntu-22-04/). Use the drop down at the top of that guide to see different distributions.

{{< tabs >}}
{{< tab "Ubuntu 22.04" >}}
```file {title="cloud-config.yaml" lang="yaml"}
packages:
  - apache2
  - mysql-server
  - php
  - libapache2-mod-php
  - php-mysql
```
{{< /tab >}}
{{< tab "CentOS 8" >}}
```file {title="cloud-config.yaml" lang="yaml"}
packages:
  - httpd
  - mariadb-server
  - php
  - php-pear
  - php-mysqlnd
```
{{< /tab >}}
{{< /tabs >}}

{{< note >}}
The `package_reboot_if_required` option covered in the previous section also affects package installations. If set to `true`, it ensures that the system restarts if any newly-installed packages require that.
{{< /note >}}

## Add Software Repositories

Among the more advanced package manager tools within cloud-init, you have the ability to add custom repositories during initialization. Cloud-init uses specific modules for managing different package managers, so the steps vary depending on your distribution. What follows covers two of the most popular: [APT](/docs/guides/apt-package-manager/), most often found on Debian and Ubuntu systems, and [Yum](/docs/guides/yum-package-manager/)/[DNF](/docs/guides/dnf-package-manager/), mostly found on CentOS, Fedora, and other RHEL-based distributions.

Other than these, cloud-init also supports the [Zypper](/docs/guides/zypper-package-manager/) package manager, used on openSUSE distributions. You can learn about adding repositories for Zypper in cloud-init's [Zypper Add Repo](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#zypper-add-repo) module reference documentation.

{{< tabs >}}
{{< tab "APT" >}}
Within cloud-config, the `apt` option allows for fine-grained management of the APT package manager. You can learn more about the range of features through cloud-init's [APT Configure](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#apt-configure) module reference.

To add third-party repositories to APT, you can use the `sources` option within an `apt` block. The `sources` option is a dictionary, with one or more repository entries. Each repository entry needs a `source` string, indicating the repository location, and a set of key-related options, providing the GPG key for the repository.

You have two means of adding the repository, based on how you want to supply the GPG key. To use a GPG key server, you can supply the key ID and the server location, as in this example.

```file {title="cloud-config.yaml" lang="yaml"}
apt:
  sources:
    docker:
      source: deb [arch="amd64"] https://download.docker.com/linux/ubuntu $RELEASE stable
      keyid: 8D81803C0EBFCD88
      keyserver: 'https://download.docker.com/linux/ubuntu/gpg'
```

In this case, the key ID was obtained from the GPG public key using this set of commands.

```command
wget https://download.docker.com/linux/ubuntu/gpg -O docker.gpg.pub.key
gpg --list-packets docker.gpg.pub.key | awk '/keyid:/{ print $2 }'
```

The other option is to manually add the GPG key, using the `key` option, as shown in this example. Replace the example GPG string with a full GPG public key, like the one retrieved with the `wget` command above.

```file {title="cloud-config.yaml" lang="yaml"}
apt:
  sources:
    docker:
      source: deb [arch="amd64"] https://download.docker.com/linux/ubuntu $RELEASE stable
      key: |
        -----BEGIN PGP PUBLIC KEY BLOCK-----

        mQINBFit2ioBEADhWpZ8/wvZ6hUTiXOwQHXMAlaFHcPH9hAtr4F1y2+OYdbtMuth
        lqqwp028AqyY+PRfVMtSYMbjuQuu5byyKR01BbqYhuS3jtqQmljZ/bJvXqnmiVXh
        38UuLa+z077PxyxQhu5BbqntTPQMfiyqEiU+BKbq2WmANUKQf+1AmZY/IruOXbnq
        ...
        jCxcpDzNmXpWQHEtHU7649OXHP7UeNST1mCUCH5qdank0V1iejF6/CfTFU4MfcrG
        YT90qFF93M3v01BbxP+EIY2/9tiIPbrd
        =0YYh
        -----END PGP PUBLIC KEY BLOCK-----
```

With either method, you can verify the added repository on the new system with a command like the one here.

```command
sudo apt-cache policy
```

```output
Package files:
 100 /var/lib/dpkg/status
     release a=now
 500 https://download.docker.com/linux/ubuntu jammy/stable amd64 Packages
     release o=Docker,a=jammy,l=Docker CE,c=stable,b=amd64
     origin download.docker.com
...
```

{{< /tab >}}
{{< tab "Yum/DNF" >}}
Cloud-config uses a dedicated `yum_repos` option for managing repositories in Yum and DNF. Each repository to be added to the package manager gets an entry beneath the `yum_repos` option, with an identifier, URL, and other information.

The example here adds the Extra Packages for Enterprise Linux (EPEL) repository, a popular repository for accessing a wider range of packages on RHEL-based systems.

```file {title="cloud-config.yaml" lang="yaml"}
yum_repos:
  epel-release:
    name: Extra Packages for Enterprise Linux 8 - Release
    baseurl: http://download.fedoraproject.org/pub/epel/8/Everything/$basearch
    enabled: true
    failovermethod: priority
    gpgcheck: true
    gpgkey: http://download.fedoraproject.org/pub/epel/RPM-GPG-KEY-EPEL-8
```

The first three options — `name`, `baseurl`, and `enabled` — are specific to cloud-init's `yum_repos`. But `yum_repos` also supports the use of Yum's own repository configuration options, which the rest of the options above leverage.

Once initialization has finished, you can verify the added repository using the `repolist` command for Yum/DNF.

```command
sudo dnf repolist
```

```output
repo id                                                                  repo name
...
epel-release                                                             Extra Packages for Enterprise Linux 8 - Release
...
```

Learn more about the option and the various features the `yum_repos` option can manage in cloud-init's [Yum Add Repo](https://cloudinit.readthedocs.io/en/latest/reference/modules.html#yum-add-repo) module reference documentation.
{{< /tab >}}
{{< /tabs >}}

## Verify Update and Installation

Cloud-init stores a log at `/var/log/cloud-init-output.log`. In it you can see all of the output from cloud-init's initialization steps. For instance, the example output below shows the portion of the logs for APT installing the `apache2` package.

```command
sudo cat /var/log/cloud-init-output.log
```

```output
...
The following additional packages will be installed:
  apache2-bin apache2-data apache2-utils libapache2-mod-php8.1 libapr1
  libaprutil1 libaprutil1-dbd-sqlite3 libaprutil1-ldap libcgi-fast-perl
  libcgi-pm-perl libclone-perl libencode-locale-perl libevent-pthreads-2.1-7
  libfcgi-bin libfcgi-perl libfcgi0ldbl libhtml-parser-perl
  libhtml-tagset-perl libhtml-template-perl libhttp-date-perl
  libhttp-message-perl libio-html-perl liblua5.3-0 liblwp-mediatypes-perl
  libmecab2 libprotobuf-lite23 libtimedate-perl liburi-perl mecab-ipadic
  mecab-ipadic-utf8 mecab-utils mysql-client-8.0 mysql-client-core-8.0
  mysql-common mysql-server-8.0 mysql-server-core-8.0 php-common php8.1
  php8.1-cli php8.1-common php8.1-mysql php8.1-opcache php8.1-readline
  ssl-cert
Suggested packages:
  apache2-doc apache2-suexec-pristine | apache2-suexec-custom www-browser
  php-pear libdata-dump-perl libipc-sharedcache-perl libbusiness-isbn-perl
  libwww-perl mailx tinyca
The following NEW packages will be installed:
  apache2 apache2-bin apache2-data apache2-utils libapache2-mod-php
  libapache2-mod-php8.1 libapr1 libaprutil1 libaprutil1-dbd-sqlite3
  libaprutil1-ldap libcgi-fast-perl libcgi-pm-perl libclone-perl
  libencode-locale-perl libevent-pthreads-2.1-7 libfcgi-bin libfcgi-perl
  libfcgi0ldbl libhtml-parser-perl libhtml-tagset-perl libhtml-template-perl
  libhttp-date-perl libhttp-message-perl libio-html-perl liblua5.3-0
  liblwp-mediatypes-perl libmecab2 libprotobuf-lite23 libtimedate-perl
  liburi-perl mecab-ipadic mecab-ipadic-utf8 mecab-utils mysql-client-8.0
  mysql-client-core-8.0 mysql-common mysql-server mysql-server-8.0
  mysql-server-core-8.0 php php-common php-mysql php8.1 php8.1-cli
  php8.1-common php8.1-mysql php8.1-opcache php8.1-readline ssl-cert
0 upgraded, 49 newly installed, 0 to remove and 11 not upgraded.
...
```

However, while the logs' high level of detail is useful for debugging, it makes verifying upgraded and installed packages cumbersome. So, instead, you should use commands specific to your system's package manager to verify package upgrades and installations. Below you can find steps for doing that on Debian/Ubuntu systems (using APT) and RHEL-based systems like CentOS and Fedora (using DNF or Yum).

{{< tabs >}}
{{< tab "Debian, Ubuntu" >}}
The APT package manager includes a `list` command that provides useful functions for reviewing packages. Using the `--upgradable` option with the command gives you a list of packages on your system that have available upgrades.

``` command
sudo apt list --upgradable
```

Ideally, the output would be empty. However, in practice, usually your system has a few packages that do not get upgraded with `apt upgrade`. Typically, this is due to those packages' dependencies. If this is the case, the `upgrade` command, and the cloud-init logs, should indicate the un-upgraded packages.

```file {title="/var/log/cloud-init-output.log"}
...
0 upgraded, 0 newly installed, 0 to remove and 11 not upgraded.
...
```

The `list` command's `--installed` option provides a comprehensive list of packages installed with the APT package manager. But for verification this list can be a lot to navigate — it includes all packages installed as dependencies too. To see just the packages that have been installed explicitly, you can use the `--manual-installed` option instead.

```command
sudo apt list --manual-installed
```

The package installation example earlier in this guide only had a few packages, so a short text filter could even further shorten the output. The command below does this by piping to `grep`. Each `\|` separates a search term, and each search term identifies one or more of the packages indicated in the cloud-config.

```command
sudo apt list --manual-installed | grep 'apache2\|mysql-server\|php'
```

```output
apache2/jammy-updates,now 2.4.52-1ubuntu4.6 amd64 [installed]
libapache2-mod-php/jammy,now 2:8.1+92ubuntu1 all [installed]
mysql-server/jammy-updates,jammy-security,now 8.0.34-0ubuntu0.22.04.1 all [installed]
php-mysql/jammy,now 2:8.1+92ubuntu1 all [installed]
php/jammy,now 2:8.1+92ubuntu1 all [installed]
```

{{< /tab >}}
{{< tab "CentOS, Fedora, RHEL-based" >}}
With the Yum/DNF package manager, the dedicated `check-update` command shows any packages with available upgrades. After the cloud-init initialization, the output should be empty, indicating that all installed packages are up to date.

{{< note >}}
The examples in this section explicitly use `dnf`, as newer systems most often use the DNF package manager rather than Yum. However, if your system uses Yum instead, the same commands should work; just replace `dnf` with `yum`.
{{< /note >}}

```command
sudo dnf check-update
```

Typically, just after initialization, the most straightforward way to verify installed packages is through the `history` command. The output shows recent commands run by the package manager, including updates and installations.

```command
sudo dnf history
```

```output
ID     | Command line                                                                                                                  | Date and time    | Action(s)      | Altered
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
     2 | -y install httpd mariadb-server php php-pear php-mysqlnd                                                                      | 2023-08-09 12:12 | Install        |   76
     1 | -y upgrade                                                                                                                    | 2023-08-09 12:11 | I, U           |  132
```

With Yum/DNF, you can also more specifically check on installed packages with the `list installed` command. Below is an example that also pipes the results to a `grep` text search, allowing you to narrow the output to just matching package names. (Here, each search term is separated by `\|`.) This may be useful when you only want to verify a limited range of installed packages.

``` command
sudo dnf list installed | grep 'httpd\|mariadb-server\|php'
```

```output
httpd.x86_64                       2.4.37-62.module_el8+657+88b2113f       @appstream
httpd-filesystem.noarch            2.4.37-62.module_el8+657+88b2113f       @appstream
httpd-tools.x86_64                 2.4.37-62.module_el8+657+88b2113f       @appstream
mariadb-server.x86_64              3:10.3.28-1.module_el8.3.0+757+d382997d @appstream
mariadb-server-utils.x86_64        3:10.3.28-1.module_el8.3.0+757+d382997d @appstream
php.x86_64                         7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-cli.x86_64                     7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-common.x86_64                  7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-fpm.x86_64                     7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-mysqlnd.x86_64                 7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-pdo.x86_64                     7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-pear.noarch                    1:1.10.5-9.module_el8.2.0+313+b04d0a66  @appstream
php-process.x86_64                 7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
php-xml.x86_64                     7.2.24-1.module_el8.2.0+313+b04d0a66    @appstream
```

{{< /tab >}}
{{< /tabs >}}
