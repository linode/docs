---
slug: how-to-install-git-mac
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
tags: ["version control system"]
aliases: ['/development/version-control/how-to-install-git-mac/']
---

There are different ways to install Git on Mac OS. You can install Git using Homebrew, MacPorts, or by downloading the Git installer package.

### Check if Git is already installed

1.  Check if Git is already installed on your Mac using:

        git --version

    If Git isn’t installed on your computer, the terminal will prompt you the following message:

    ![The "git" command requires the command line developer tools.](check-if-git-installed-mac-osx.png)

2.  Click on Install to install developer tools required

    These developer tools surrounding Xcode and Xcode app development utilities are available from Apple. Once you follow the prompts and agree to them, at the end of the process you will have a working Git installation system.


### Install Git using Homebrew on Mac OSX

1.  First, execute this command on your Mac terminal:

        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"

    ![Enter the install command.](1624-Homebrew-01-resized.png)

2.  Press return once you are prompted. You should see an installation success message once the installation is complete.

    ![Enter your password.](1626-Homebrew-03-resized.png)

3.  This Homebrew version you just installed may not be the most recent stable build. Therefore, a good practice to update it. To update Homebrew, enter the following in your terminal: 
    
        brew update

4.  Finally to install Git run:

        brew install git