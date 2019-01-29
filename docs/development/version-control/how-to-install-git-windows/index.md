---
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
---

To install Git on Windows you will need to download the installer from the [Git](http://git-scm.com/downloads) website:

1. Download the most current version for your operating system by double clicking on the package name:

    ![Click to download version for Windows.](win-01-download-git.png)

2.  Select **Run** to begin the installation:

    ![Click Run to start the installer.](win-02-save-git.png)

3.  Click **Yes** to continue:

    ![Click Yes to continue.](win-03-run-git.png)

4.  Click **Next** to continue:

    ![Click Next to continue.](win-04-agree-license.png)

5.  If you need to change the installation folder, click **Browse** and select a new location. To accept the default location click on **Next**:

    ![Click Next for default or Browse to change.](win-05-select-folder.png)

6.  To accept the default components to be installed click **Next**. Otherwise, select the additional components to be installed before clicking the **Next** button:

    ![Accept the default or select additional components.](win-06-select-components.png)

7.  Accept the default Start Menu folder by clicking **Next**, or use **Browse** to select a new folder location:

    ![Select the start menu folder.](win-07-shortcut-folder.png)

8.  Select the default text editor for Git, then click **Next**:

    ![Select the default text editor for Git.](win-08-default-text-editor.png)

9.  Adjust your PATH environment, then click **Next**:

    ![Adjust Git's PATH](win-09-adjust-your-path.png)

10.  Choose which SSL/TLS library you'll use for HTTPS. Then, click **Next**:

    ![Choose your HTTPS backend.](win-10-choose-https-backend.png)

11. Keep the default *line ending conversion* by clicking **Next**. To change the default, choose one of the two other choices before clicking **Next**:

    ![Select line ending conversions.](win-11-configure-line-endings.png)

     {{< note >}}
It is strongly recommended that you keep the default settings for line ending conversions. Changing from the default may result in formatting problems when viewed on your Linode.
{{< /note >}}

12.  Choose the terminal emulator you'll use, and then click **Next**:

    ![Select the terminal emulator you'll use.](win-12-terminal-emulator.png)

13.  Configure the extra options, and then click **Next**:

    ![Configure the extra options.](win-13-extra-options.png)

14.  Check **Launch Git Bash** and complete the setup by selecting **Finish**:

    ![Complete the setup and launch the Git bash shell](win-14-complete-setup.png)

15.  You can launch the Git GUI from the bash shell. Type `git gui` at the command line and hit enter:

    ![Launch the Git GUI by typing 'git gui' at the command line.](win-15-run-gui.png)

16. Once you open Git you can select either **Create New**, **Clone Existing** or **Open Existing Repository**. In this example, we create new repository. Enter a directory name or click on **Browse** to navigate to a directory:

    ![Create New Repository.](win-16-create-new-project.png)

17. A blank repository is created:

    ![Blank repository.](win-17-new-project.png)
