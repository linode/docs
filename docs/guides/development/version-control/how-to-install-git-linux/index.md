---
slug: how-to-install-git-linux
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Git on Linux'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["linux", "git", "version"]
modified: 2017-01-05
modified_by:
  name: Sam Foo
title: "How to install Git on Linux"
published: 2018-01-08
headless: true
show_on_rss_feed: false
tags: ["version control system"]
aliases: ['/development/version-control/how-to-install-git-linux/']
---

The steps for installing Git on Linux depend on which Linux distribution you are using. This section shows you how you can install Git on Ubuntu, CentOS, Fedora, and Arch Linux.

### Check if Git is already installed on Linux

Before you begin, check whether Git is already installed on your computer by issuing the example command in your terminal. Some Linux distributions have Git preinstalled:

        git --version

If the output shows a Git version (see example below), you already have Git installed on your Linux machine.

{{< output >}}
git version 2.17.1
{{</ output >}}

If Git is not installed, your terminal shows the following error:

{{< output >}}
-bash: git: command not found
{{</ output >}}

If your terminal confirms that there’s no pre-installed version of Git, move on to the next section that is appropriate for your Linux system's distribution.

### Installing Git on Ubuntu or Debian

To install Git run the following command:

        sudo apt-get install git

If you see an error, consider running the following command before installing Git:

        sudo apt update

### Installing Git on CentOS

#### Option 1: Installing Git on CentOS using Yum

To install Git on CentOS using Yum, run the following command:

        sudo yum install git

#### Option 2: Installing Git on CentOS from Source

1. 	In order to install Git from source install its dependencies first using the following commands:

        sudo yum group install “Development tools”
        sudo yum install gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel

2. 	Now, go to [Git’s release page](https://github.com/git/git/releases) and select the version that you prefer to install. Find a stable Git version (select the one without an `-rc` suffix):

    ![Git release page.](git-release-page.png)

3. 	After finding the right Git version, click on it. You should see two files included in the release version you selected (with `.zip` and `tar.gz` extensions).

    ![Git release page.](git-release-zipped-files.png)

4. 	Right click and copy the link for the file with the `tar.gz` extension. For example, if you selected the version v2.29.1, your download link is `https://github.com/git/git/archive/v2.29.1.tar.gz`.

5. 	Use `wget` to download your selected Git version on CentOS. Replace the example URL with the one you copied in the previous step.

        wget https://github.com/git/git/archive/v2.29.1.tar.gz -O gitdownloadversion.tar.gz

    This command downloads `v2.29.1.tar.gz` as `gitdownloadversion.tar.gz`.

6. 	Unpack the file using `tar`. Decompress it and the extract files using the `-zxf` option. Use the following command to do it:

        tar -zxf gitdownloadversion.tar.gz

7. 	Change your directory to the unpacked folder:

        cd gitdownloadversion-*

8.	Create a Makefile in this directory to help compile the downloaded Git files:

        make configure
        ./configure --prefix=/usr/local

9.	Once your Makefile is in place, compile your Git files using:

        sudo make install

10.	When completed, check the Git version to ensure the installation was successful.

        git --version


### Installing Git on Fedora

Similar to CentOS, installing Git on Fedora can be done using two options:

    1. Install Git using Yum

    2. Install Git from source

The process to install Git from source is similar to the CentOS installation above. To install Git using Yum on Fedora, enter the following command:

        sudo yum install git-core

Once successful, view the Git version that is running to confirm the installation:

        git --version

### Installing Git on Arch Linux

To install Git on Arch Linux using pacman, run the following command:

        sudo pacman -Sy git

### Installing Git on Gentoo

You can install Git on Gentoo using emerge:

        sudo emerge --ask --verbose dev-vcs/git
