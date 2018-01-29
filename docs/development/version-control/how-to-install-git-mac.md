---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Git'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["mac", "git", "version"]
modified: 2017-01-05
modified_by:
  name: Sam Foo
title: "How to install Git on Mac"
published: 2018-01-08
shortguide: true
show_on_rss_feed: false
---

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
