---
slug: how-to-install-git-windows
author:
  name: Sam Foo
  email: sfoo@linode.com
description: 'Shortguide for installing Git on Windows'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["windows", "git", "version"]
modified: 2019-01-24
modified_by:
  name: Linode
title: "How to install Git on Windows"
published: 2018-01-08
headless: true
show_on_rss_feed: false
tags: ["version control system"]
aliases: ['/development/version-control/how-to-install-git-windows/']
---

1.  Go to the Git website: https://git-scm.com/download/win

    ![Click to download version for Windows.](how-to-download-git-for-windows.png)

2.  Double click on a recent version of Git to download it.


3.  When you see a prompt to install, click on Yes:

    ![Click Yes to install Git on Windows.](installing-git-on-windows.png)

4.  Agree to GNU license terms:
    
    ![Click Next to accept GNU License.](installing-git-accept-gnu-license.png)

5.  Select the directory you want to install Git in or use the default location:

    ![Click Next for default or Browse to change.](win-05-select-folder.png)

6.  Select the components that you want to install. If you are unsure, go ahead with the default selection.

    ![Accept the default or select additional components.](win-06-select-components.png)

7.  Choose the default editor for Git:

    ![Select the default text editor for Git.](win-08-default-text-editor.png)

8.  Select how you want to use Git from the command line from these options:
    
    ![Adjust Git's PATH](win-09-adjust-your-path.png)

9.  Select SSL/TLS library that you want Git to use for HTTPs connections

    ![Select the https transport backend.](git-https-transport-backend.png)

10. Select how Git should treat the line endings in text files:

    ![Select line ending conversions.](win-11-configure-line-endings.png)

11. Select your terminal emulator, default behavior of “git pull” and some extra configuring options.
    
    For the simplest installation - keep MinTTY for terminal emulator, use the default behavior (fast-forward or merge), and enable file system caching in configuring extra options. 

    And finally, click install at the end.

    ![Windows final Git installation screen.](windows-git-installation-completed.png)

12. Click on finish.

    You should have a working Git installed on your Windows machine.