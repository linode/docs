---
author:
  name: Linode
  email: docs@linode.com
description: 'Installing git on GNU/Linux, MacOSX, and Windows' 
keywords: 'git,dvcs,vcs,scm,gitweb'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
alias: ['linux-tools/version-control/git/','applications/development/git-source-control-management/']
modified: Thursday, June 6, 2017
modified_by:
  name: Linode
published: 'Friday, September 4th, 2009'
title: How to Install Git
---

# Introduction to Git

**Git** was designed and developed by Linus Torvalds for Linux kernel development. Git Provides support for non-linear and distributed development. It's the most popular distributed version control and source code management system. See the [Git documentation website](http://git-scm.com/) for more information. You can also read our guide to [Git Source Control Management](/docs/linux-tools/version-control/git).

This guide explains how to install `git` on GNU/Linux, Mac Osx, and Windows. 

## Install Git

Git can be installed on any operating systemcompiled from source, but your distributions latest package will contain the most stable version for your environment.

 {: .note }
> 
> This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account.


### Install Git on Linux

For Debian and Ubuntu systems, the command is as follows:

    sudo apt install git

For a CentOS system, the command is as follows:

    sudo yum install git

For a Fedora system, the command is as follows:

    sudo yum install git-core

For an Arch Linux system, the command is as follows:

    sudo pacman -Sy git 

For a Gentoo system, the command is as follows:

    sudo emerge --ask --verbose dev-vcs/git


### Install Git on Mac OS X

There are different ways to install Git on OS X. You can install Git using Homebrew or MacPorts or by downloading the Git installer package.


##### Install Git via Homebrew

1.  Go to the [Homebrew](http://brew.sh/) website.
2.  Copy and paste the command on that page, under **Install Homebrew** into a terminal window.

    ![Enter the install command.](/docs/assets/1624-Homebrew-01-resized.png)

3.  At the next prompt enter your password and hit **Return**.

    ![Enter your password.](/docs/assets/1580-Homebrew-02-resized.png)

4.  You will receive an installation successful message when complete.

    ![Enter your password.](/docs/assets/1626-Homebrew-03-resized.png)

5.  We recommend that you install *Brew Doctor* to repair HomeBrew errors, before installing Git. 

    ![Install brew doctor.](/docs/assets/1627-Homebrew-04-resized.png)

6.  To update Homebrew, enter the following command:

        brew update

    ![Update Homebrew.](/docs/assets/1628-Homebrew-05-resized.png)

7.  To install Git with Homebrew, enter the following command:

        brew install git

##### Install Git via MacPorts

1.  Go to [MacPorts](http://www.macports.org/) website.
2.  Click on the link for your operating system.
3.  Click on the file after it downloads to start the installer.
4.  Click on the **Continue** button to begin the install.

    ![Begin MacPort install.](/docs/assets/1586-MacPorts_1.png)

5.  Click on the **Agree** button to accept the license agreement.

    ![Agree to the license agreement.](/docs/assets/1589-MacPorts_4.png)

6.  To leave the default installation location click on the **Install** button or click the **Change Install Location** button to change the default location.

    ![Change default location.](/docs/assets/1590-MacPorts_5.png)

7.  Enter your password when prompted and click on the **Install Software** button.

    ![Enter your password.](/docs/assets/1591-MacPorts_6.png)

8.  After the install finishes, click the **Close** button to exit the installer.

    ![Click close to exit.](/docs/assets/1592-MacPorts_7.png)

9.  Open a terminal window.
10. To install Git use the following command:

        $ sudo port install git +svn +doc +bash_completion +gitweb

##### Install Git via Package Installer

1.  Go to the [Git](http://git-scm.com/downloads) website and download the current installer for your operating system.
2.  Double click on the downloaded file to begin the install.
3.  Click on the **Continue** button to begin the install.

    ![Click on continue.](/docs/assets/1581-MacGit_1.png)

4.  Select **Install for all users of this computer** button and click **Continue** to begin the installation.

    ![Click on install for all users of this computer.](/docs/assets/1582-MacGit_2.png)

5.  Click **Install** to continue with the default location. If you need to change the installation location click **Change Install Location** button.

    ![Click on change install location.](/docs/assets/1583-MacGit_3.png)

6.  Enter your username and password and click **Install Software** to continue.

    ![Enter username and password and click install software.](/docs/assets/1584-MacGit_4.png)

7.  Click the **Close** button to exit the installer.

    ![Click close to exit.](/docs/assets/1585-MacGit_5.png)

### Install Git on Windows

To install Git on Windows you will need to download the installer from the [Git](http://git-scm.com/downloads) website:

1. Download the most current version for your operating system by double clicking on the package name.

    ![Click to download version for Windows.](/docs/assets/1595-Git-Win-01.png)

2.  Select **Run** to begin the installation.

    ![Click Run to start the installer.](/docs/assets/1596-Git-Win-02.png)

3.  Click **Yes** to continue.

    ![Click Yes to continue.](/docs/assets/1597-Git-Win-03.png)

4.  Click **Next** to continue.

    ![Click Next to continue.](/docs/assets/1598-Git-Win-04.png)

5.  Click **Next** to continue.

    ![Click Next to continue.](/docs/assets/1599-Git-Win-05.png)

6.  To accept the default location click on **Next**. If you need to change the installation folder, click on the **Browse** button and select a new location.

    ![Click Next for default or Browse to change.](/docs/assets/1600-Git-Win-06.png)

7.  To accept the default components to be installed click **Next**. Otherwise, select the additional components to be installed before clicking the **Next** button.

    ![Accept the default or select additional components.](/docs/assets/1601-Git-Win-07.png)

8.  Accept the default start menu folder by clicking **Next** or use **Browse** to select a new folder location.

    ![Select the start menu folder.](/docs/assets/1602-Git-Win-08.png)

9.  Keep the default line ending conversion by clicking **Next**. To change the default, choose one of the two other choices before clicking **Next**.

    ![Select line ending conversions.](/docs/assets/1603-Git-Win-09.png)

10. The program will now begin installing.

    ![Git is installing.](/docs/assets/1604-Git-Win-10.png)

11. Click **Finish** to exit the installer.

    ![Click Finish to exit.](/docs/assets/1605-Git-Win-11.png)

     {: .note }
    >
    > It is strongly recommended that you keep the default settings for line ending conversions. Changing from the default may result in formatting problems when viewed on your Linode.

12. Once you open Git you can select either **Create New**, **Clone Existing** or **Open Existing Repository**. In this example, create new repository was selected.

    ![Create New Repository.](/docs/assets/1606-Git-Win-12.png)

13. Enter a directory name or click on **Browse** to navigate to a directory.

    ![Directory for a new repository.](/docs/assets/1607-Git-Win-13.png)

14. A blank repository has been created.

    ![Blank repository.](/docs/assets/1608-Git-Win-14.png)


## More Information

Git is complicated. Luckily, there are plenty of resources to help you find your way. 
Consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.


- [Refspec Information](http://git-scm.com/book/ch9-5.html)
- [Learn Git with Bitbucket Cloud](https://www.atlassian.com/git/tutorials/learn-git-with-bitbucket-cloud)
- [Pro Git Book](https://git-scm.com/book/en/v2)
- [Github Guides](https://guides.github.com/)