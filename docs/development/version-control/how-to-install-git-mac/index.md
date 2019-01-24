---
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Git'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["mac", "git", "version"]
modified: 2019-01-24
modified_by:
  name: Linode
title: "How to install Git on Mac"
published: 2018-01-08
headless: true
show_on_rss_feed: false
---

There are different ways to install Git on Mac OS. You can install Git using Homebrew, MacPorts, or by downloading the Git installer package.

### Install Git via Homebrew

If Homebrew is already installed, begin with Step 6.

1.  Go to the [Homebrew](http://brew.sh/) website.
2.  Copy and paste the command on that page, under **Install Homebrew** into a terminal window:

    ![Enter the install command.](1624-Homebrew-01-resized.png)

3.  At the next prompt enter your password and hit **Return**:

    ![Enter your password.](1580-Homebrew-02-resized.png)

4.  You will receive an installation successful message when complete:

    ![Enter your password.](1626-Homebrew-03-resized.png)

5.  To help diagnose Homebrew errors, install *Brew Doctor* before installing Git:

    ![Install brew doctor.](1627-Homebrew-04-resized.png)

6.  Update Homebrew:

        brew update

    ![Update Homebrew.](1628-Homebrew-05-resized.png)

7.  Install Git:

        brew install git

### Install Git via MacPorts

If MacPorts is already installed, proceed directly to Step 9.

1.  Go to [MacPorts](http://www.macports.org/) website.
2.  Click on the link for your operating system.
3.  After the download completes, click on the file to start the installer.
4.  Click the **Continue** button to begin the install:

    ![Begin MacPort install.](macports-01-install.png)

5.  Click **Continue** and then **Agree** to accept the license agreement:

    ![Agree to the license agreement.](macports-02-agree.png)

6.  Click **Continue** to continue the installation:

    ![Click continue to continue the installation](macports-03-setup.png)

7.  To leave the default installation location click **Install**, or to change the default installation location, click **Change Install Location**:

    ![Change default location.](macports-04-disk-space.png)

8.  Enter your password when prompted and click **Install Software**:

    ![Enter your password.](macports-06-enter-password.png)

9.  After the installation completes, click **Close** to exit the installer:

    ![Click close to exit.](macports-05-complete-install.png)

10. Open a terminal window.
11. Install Git:

        sudo port install git +svn +doc +bash_completion +gitweb

### Install Git via Package Installer

1.  Go to the [Git](http://git-scm.com/downloads) website and download the current installer for your operating system.
2.  Double click on the downloaded file to begin the install.
3.  Double click the `.pkg` file. A dialog window may appear stating that the file cannot be opened:

    ![A dialog may appear stating that the file cannot be opened](macgit-01-cant-open.png)

4.  Click on the Apple icon in the top left of the screen, and go to **System Preferences > Security & Privacy**. Click **Open Anyway**:

    ![Click on "Open Anyway" in the Security & Privacy preference window.](macgit-02-open-anyway.png)

5.  Click on **Open**:

    ![Click on "Open"](macgit-03-open.png)

6.  Click **Continue** button to begin the install:

    ![Click Continue](macgit-04-install.png)

7.  To leave the default installation location click **Install**, or to change the default installation location, click **Change Install Location**:

    ![Click "Continue" to use the default installation location.](macgit-05-disk-space.png)

8.  Enter your password when prompted, and then select **Install Software**:

    ![Enter your password](macgit-07-enter-password.png)

9.  After the installation completes, click **Close** to exit the installer:

    ![Click on "Close" to complete the install](macgit-06-complete-install.png)
