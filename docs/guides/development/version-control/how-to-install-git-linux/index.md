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

Installing Git on Linux depends upon what Linux distribution you are using. Here’s how you can install Git on Ubuntu, CentOS, Fedora and Arch Linux.

### Check if Git is already installed on Linux

Before you begin, check whether git is already installed on your computer. As for some Linux builds Git comes preinstalled:

        git --version

If the output shows a git version (see example below), you already have git installed on your Linux.

        git version 2.17.1

But, if Git is not installed Terminal will show the following error:

        -bash: git: command not found

If Terminal confirms there’s no pre-installed git version, follow step 2.

### Installing Git on Ubuntu or Debian

To install git run the following command:

        sudo apt-get install git

If you see an error, consider running the following command before installing git:

        sudo apt update

### Installing Git on CentOS

#### Option 1: Installing Git on CentOS using Yum

To install Git on CentOS using Yum, run the following command:

        sudo yum install git

#### Option 2: Installing Git on CentOS from Source

1. 	In order to install Git from source install dependencies first using:

        sudo yum group install “Development tools”
        sudo yum install gettext-devel openssl-devel perl-CPAN perl-devel zlib-devel

2. 	Now, go to Git’s release page and select the version that you prefer to install https://github.com/git/git/releases. Find a stable Git version; select the one without an -rc suffix:

	![Git release page.](git-release-page.png)

3. 	After selecting the right Git version click on it, you should see two files inside(with .zip and tar.gz extensions).

	![Git release page.](git-release-zipped-files.png)

4. 	Right click and copy link to the file with tar.gz extension. In case of v2.29.1 it will be https://github.com/git/git/archive/v2.29.1.tar.gz

5. 	Use this command to download your selected Git version on CentOS:

        wget https://github.com/git/git/archive/v2.29.1.tar.gz -O gitdownloadversion.tar.gz

 	This command downloads v2.29.1.tar.gz as gitdownloadversion.tar.gz.

6. 	Unpack this file using ‘tar’. Decompress it and extract files using ‘zxf’. Use the following command to do it:

        tar -zxf gitdownloadversion.tar.gz

7. 	Then, change your directory to the unpacked folder:

        cd gitdownloadversion-*

8.	Now, create a Makefile in this directory to help compile the downloaded Git files:

        make configure
        ./configure --prefix=/usr/local

9.	Once your Makefile is in place, compile your Git files using:

        sudo make install

10.	Once successfully completed, check the git version.

        git --version


### Installing Git on Fedora

Similar to CenOS, installing Git on Fedora can be done using two options:
	1. Install CentOS using Yum
	2. Install CentOS using source 

The process to install using source is similar to CentOS installation above. But to install CentOS using Yum, enter the command: 

        sudo yum install git-core

Once successful, run git --version to confirm:

        git --version

### Installing Git on Arch Linux

To install Git on Arch Linux using pacman, run the following command:

        sudo pacman -Sy git

### Installing Git on Gentoo

You can install Git on Gentoo using emerge:

        sudo emerge --ask --verbose dev-vcs/git
