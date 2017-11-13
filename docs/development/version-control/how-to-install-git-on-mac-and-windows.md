---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing git on GNU/Linux, MacOSX, and Windows'
keywords: ["git", "dvcs", "vcs", "scm", "gitweb"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/version-control/git/','applications/development/git-source-control-management/','development/version-control/git-source-control-management/']
modified: 2017-07-03
modified_by:
  name: Linode
published: 2009-09-04
title: How to Install Git on Mac and Windows
external_resources:
 - '[Refspec Information](http://git-scm.com/book/ch9-5.html)'
 - '[Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)'
 - '[Pro Git Book](https://git-scm.com/book/en/v2)'
 - '[Github Guides](https://guides.github.com/)'
---

# Introduction to Git

Git was designed and developed by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds) for Linux kernel development. Git provides support for non-linear, distributed development, allowing multiple contributors to work on a project simultaneously. Git is the most popular distributed version control and source code management system.

This guide explains how to install the latest, stable, prepackaged version `git` on GNU/Linux, Mac Osx, and Windows, using their respective package managers. Git can also be [compiled from source and installed](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git#_installing_from_source) on any operating system.

For more information about using and configuring Git, see our [Getting Started with Git](/docs/development/version-control/how-to-configure-git/) guide.

{{< note >}}
This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account.
{{< /note >}}

## Install Git on Linux

- Debian and Ubuntu:

        sudo apt-get install git

- CentOS:

        sudo yum install git

- Fedora:

        sudo yum install git-core

- Arch Linux:

        sudo pacman -Sy git

- Gentoo:

        sudo emerge --ask --verbose dev-vcs/git

## Install Git on Mac OS

There are different ways to install Git on Mac OS. You can install Git using Homebrew, MacPorts, or by downloading the Git installer package.

### Install Git via Homebrew

If Homebrew is already installed, begin with Step 6.

1.  Go to the [Homebrew](http://brew.sh/) website.
2.  Copy and paste the command on that page, under **Install Homebrew** into a terminal window:

    ![Enter the install command.](/docs/assets/1624-Homebrew-01-resized.png)

3.  At the next prompt enter your password and hit **Return**:

    ![Enter your password.](/docs/assets/1580-Homebrew-02-resized.png)

4.  You will receive an installation successful message when complete:

    ![Enter your password.](/docs/assets/1626-Homebrew-03-resized.png)

5.  To help diagnose Homebrew errors, install *Brew Doctor* before installing Git:

    ![Install brew doctor.](/docs/assets/1627-Homebrew-04-resized.png)

6.  Update Homebrew:

        brew update

    ![Update Homebrew.](/docs/assets/1628-Homebrew-05-resized.png)

7.  Install Git:

        brew install git

### Install Git via MacPorts

If MacPorts is already installed, proceed directly to Step 9.

1.  Go to [MacPorts](http://www.macports.org/) website.
2.  Click on the link for your operating system.
3.  After the download completes, click on the file to start the installer.
4.  Click the **Continue** button to begin the install:

    ![Begin MacPort install.](/docs/assets/1586-MacPorts_1.png)

5.  Click **Agree** to accept the license agreement:

    ![Agree to the license agreement.](/docs/assets/1589-MacPorts_4.png)

6.  To leave the default installation location click **Install**, or to change the default installation location, click **Change Install Location**:

    ![Change default location.](/docs/assets/1590-MacPorts_5.png)

7.  Enter your password when prompted and click **Install Software**:

    ![Enter your password.](/docs/assets/1591-MacPorts_6.png)

8.  After the installation completes, click **Close** to exit the installer:

    ![Click close to exit.](/docs/assets/1592-MacPorts_7.png)

9.  Open a terminal window.
10. Install Git:

        sudo port install git +svn +doc +bash_completion +gitweb

### Install Git via Package Installer

1.  Go to the [Git](http://git-scm.com/downloads) website and download the current installer for your operating system.
2.  Double click on the downloaded file to begin the install.
3.  Click on the **Continue** button to begin the install:

    ![Click on continue.](/docs/assets/1581-MacGit_1.png)

4.  Select **Install for all users of this computer** and click **Continue** to begin the installation:

    ![Click on install for all users of this computer.](/docs/assets/1582-MacGit_2.png)

5.  If you need to change the installation location click **Change Install Location** button. Click **Install** to continue with the default location:

    ![Click on change install location.](/docs/assets/1583-MacGit_3.png)

6.  Enter your username and password and click **Install Software** to continue:

    ![Enter username and password and click install software.](/docs/assets/1584-MacGit_4.png)

7.  Click the **Close** button to exit the installer:

    ![Click close to exit.](/docs/assets/1585-MacGit_5.png)

## Install Git on Windows

To install Git on Windows you will need to download the installer from the [Git](http://git-scm.com/downloads) website:

1. Download the most current version for your operating system by double clicking on the package name:

    ![Click to download version for Windows.](/docs/assets/1595-Git-Win-01.png)

2.  Select **Run** to begin the installation:

    ![Click Run to start the installer.](/docs/assets/1596-Git-Win-02.png)

3.  Click **Yes** to continue:

    ![Click Yes to continue.](/docs/assets/1597-Git-Win-03.png)

4.  Click **Next** to continue:

    ![Click Next to continue.](/docs/assets/1598-Git-Win-04.png)

5.  Click **Next** to continue:

    ![Click Next to continue.](/docs/assets/1599-Git-Win-05.png)

6.  If you need to change the installation folder, click **Browse** and select a new location. To accept the default location click on **Next**:

    ![Click Next for default or Browse to change.](/docs/assets/1600-Git-Win-06.png)

7.  To accept the default components to be installed click **Next**. Otherwise, select the additional components to be installed before clicking the **Next** button:

    ![Accept the default or select additional components.](/docs/assets/1601-Git-Win-07.png)

8.  Accept the default Start Menu folder by clicking **Next**, or use **Browse** to select a new folder location:

    ![Select the start menu folder.](/docs/assets/1602-Git-Win-08.png)

9.  Keep the default *line ending conversion* by clicking **Next**. To change the default, choose one of the two other choices before clicking **Next**:

    ![Select line ending conversions.](/docs/assets/1603-Git-Win-09.png)

     {{< note >}}
It is strongly recommended that you keep the default settings for line ending conversions. Changing from the default may result in formatting problems when viewed on your Linode.
{{< /note >}}

10. The program will now begin installing:

    ![Git is installing.](/docs/assets/1604-Git-Win-10.png)

11. Click **Finish** to exit the installer:

    ![Click Finish to exit.](/docs/assets/1605-Git-Win-11.png)

12. Once you open Git you can select either **Create New**, **Clone Existing** or **Open Existing Repository**. In this example, we create new repository:

    ![Create New Repository.](/docs/assets/1606-Git-Win-12.png)

13. Enter a directory name or click on **Browse** to navigate to a directory:

    ![Directory for a new repository.](/docs/assets/1607-Git-Win-13.png)

14. A blank repository is created:

    ![Blank repository.](/docs/assets/1608-Git-Win-14.png)

# Get Started with Git

Visit our guide on [Git configuration](/docs/development/version-control/how-to-configure-git/) for helpful commands to get you started with Git and repositories.
