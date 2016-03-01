---
author:
  name: Linode
  email: docs@linode.com
description: 'An introduction to using git, managing git repositories, and gitolite.'
keywords: 'git,dvcs,vcs,scm,gitweb,gitolite,ubuntu,debian,arch,gentoo'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['linux-tools/version-control/git/']
modified: Tuesday, March 1, 2016
modified_by:
  name: Phil Zona
published: 'Friday, September 4th, 2009'
title: Git Source Control Management
---

Git is version control software, which is used to keep track of changes to a file or group of files. Version control is usually associated with source code, but can be used on any file type. For example, a technical document may be placed in version control in order to keep track of changes made to the document. Version control can also be applied to graphics. You can rollback to a previous version to keep track of the changes made on a particular file.

This document will provide rudimentary installation instructions as well as some basics for getting started. However, the way you use Git is entirely up to you.

## Installing Git

Git can be installed on a variety of operating systems. It can also be downloaded and compiled. However, it is recommended that you use your Linux distribution's repository installer as this is usually the most reliable installation method.

 {: .note }
>
> The steps in this guide are written using a non-root user. If you are logged in as root you will not need `sudo` for certain steps.

### Linux Installation

For Debian and Ubuntu systems, the command is as follows:

    sudo apt-get install git

For a CentOS system, the command is as follows:

    sudo yum install git

For a Fedora system, the command is as follows:

    sudo yum install git-core

For an Arch Linux system, the command is as follows:

    sudo pacman -Sy git 

For a Gentoo system, the command is as follows:

    sudo emerge ask --verbose dev-util/git

### Local System Installation

Git may also be installed on a local machine. The installation procedure for both Mac OS X and Windows operating systems is outlined below.

#### Mac OS X

There are different ways to install Git on OS X. This may be achieved by installing Homebrew or MacPorts before Git or by downloading the Git installer package. Regardless of the method you choose, make sure you verify which operating system version you are currently running.

##### Installing Git via Homebrew

1.  Go to [Homebrew](http://brew.sh/) website.
2.  Copy and paste the command listed under **Install Homebrew** into a terminal window.

    ![Enter the install command.](/docs/assets/1624-Homebrew-01-resized.png)

3.  At the next prompt enter your password and hit **Return**.

    ![Enter your password.](/docs/assets/1580-Homebrew-02-resized.png)

4.  You will receive an installation successful message when complete.

    ![Enter your password.](/docs/assets/1626-Homebrew-03-resized.png)

5.  It is recommended that you install *Brew Doctor* to fix any errors before installing Git, using the command `brew doctor`. If any errors appear, they will be fixed, and you will see a message stating what was repaired.

    ![Install brew doctor.](/docs/assets/1627-Homebrew-04-resized.png)

6.  To update Homebrew, enter the following command:

        brew update

    ![Update Homebrew.](/docs/assets/1628-Homebrew-05-resized.png)

7.  To install Git with Homebrew, enter the following command:

        brew install git

##### Installing Git via MacPorts

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

##### Installing Git via Package Installer

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

#### Windows

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

## Configuring Git

After the installation is complete, you will need to configure Git for first time use. There is a built-in tool called `git config` that obtains and sets configuration variables for how Git functions and appears. These configuration variables are located in three different places on a Linux system:

-   /etc/gitconfig file - stores the information for all system users and their respective repositories
-   ~/.gitconfig file - pertains to your user
-   .git/config - this is the configuration file of your current working repository.

For a Windows system, the `.gitconfig` file is located in the `$HOME` directory of the user's profile. The full path is `C:\Document and Settings\$USER` or `C:\Users\$USER`

After installing Git make sure your username and email address are set correctly. To verify, use the command:

    git config --list

If your name and email are not listed in the output, you may set them manually. Use the following command to set your name, replacing `name` with your name:

    git config --global user.name name

Use the following command to set your email address, replacing `user@email.com` with your email address:

    git config --global user.email user@email.com

Set your default text editor with the command, replacing `editor-name` with the text editor of your choice:

    git config --global core.editor editor-name

Your output should show the information you entered. Sample output is below:

    MacBook-Pro:~ user$ git config --list
    user.name=user
    user.email=user@email.com
    core.editor=editor-name

## Working with the Repository

There are two ways to obtain a Git repository, either by importing or copying. If you have an existing project and you want to start using Git to keep track of its changes, you will need to run the command from the existing project's directory:

    git init

This will create a new subdirectory called `.git`. In order to start tracking changes made to this project, you will first use the following command, replacing `filename` with the name of the file you would like to track:

    git add filename

After adding the files you wish to track, use the command:

    git commit

Enter the commit message using your favorite file editor, then save and quit to finish writing the commit.

To copy an existing Git repository use the command:

    git clone

Remember that every file will be copied when the git clone command is used. When using a URL, use the following command, replacing `url` with the URL you wish to clone from:

    git clone url

To check the status of the files within your repository use the command:

    git status

The status command will also display the status of your submodules. When this command is run it will tell you what branch you are on, and if any tracked files have been modified.

### Setup a Local Empty Repository

A newly created repository contains only the .git folder. For this example, we will use a repository named `practice`. Keep the naming convention simple e.g. lowercase, short names, etc. To create a new repository use the command:

    git init practice.git

If you already have a repository on your local machine and want to push it to your new Git server, use the command:

    git remote set-url origin git@<IP address>:practice.git

Now you should be able to push and pull files from your local PC to your Linode.

### Basic File Commands

The most basic commands you will need to know to start using Git are in the table below:

{: .table .table-striped }
| Command              | Description                                                                           | Example                        |
|:---------------------|:--------------------------------------------------------------------------------------|:-------------------------------|
| `git add`            | adds a file to a repository                                                           | `git add filename`           |
| `git rm`             | removes a file from a repository                                                      | `git rm filename`            |
| `git mv`             | moves or renames a tracked file, directory, or symlink                                | `git mv file_from file_to` |
| `git branch`         | lists all the local and remote branches                                               | `git branch branch_name`     |
| `git commit`         | commits all staged objects                                                            | N/A                            |
| `git pull`           | downloads all changes from the remote repo and merges them in a specified repository  | `git pull repository refspec`    |
| `git push`           | publishes the changes to the remote repository                                              | `git push remote_repository`              |
| `git log`            | creates a log of all commits, includes: person, commit, date, time, and msg           | N/A                            |
| `gitk`               | displays a visual commit history in a graphical tool                                  | N/A                            |
| `git commit --amend` | replaces the latest commit in the current branch with a new commit, rewriting history | N/A                            |
|----------------------|---------------------------------------------------------------------------------------|--------------------------------|

{:.note}
>
> When using the `git pull` command, `refspec` is used to configure which remote branch or branches should be used, and how the local branch or branches should be named. The syntax is `git pull name source-branch:destination-branch`. 
>
> Remember to replace `name`, `source-branch`, and `destination-branch` with their respective values.

### Branches

Branches are made up of individual code changes. For example, by default the main branch is called "master". The core idea is that branches are created for each feature, implementation, or bug fix. So to use a simplified example, the first or master branch is the trunk of the tree and each branch is a new iteration. In this example, there might be branches broken out by new feature names or specific bug fixes. Git can also be used to track document changes, as well as code.

The basic options used with the `git branch` command are listed below:

{: .table .table-striped}
| Option   | Description                          |
|:---------|:-------------------------------------|
| -r       | lists the remote branches            |
| -a       | shows both local and remote branches |
| -m       | renames an old branch                |
| -d       | deletes a branch                     |
| -r -d    | deletes a remote branch              |
|----------|--------------------------------------|

## Working with Remote Repositories

Remote repositories are hosted on a network or another location on the Internet. You can have several remote repositories. This section will provide some basics for working with remote repositories.

To view which remote servers are configured, use the command:

    git remote

This will display the short names of your remote repositories. If your repository was cloned, you will see a repository called `origin`. The default name origin comes from the cloned repository. To view more information about the remote repositories, use the command:

    git remote -v

Below are some basic commands for working with remote repositories:

{: .table .table-striped }
| Command                                   | Description                                                         |
|:------------------------------------------|:--------------------------------------------------------------------|
| `git remote add [remote-name] [url]`      | adds a new remote repository                                        |
| `git fetch [repository [refspec]]`        | gathers all the data from a remote project that you do not have yet |
| `git pull`                                | obtains and merges a remote branch into your current branch         |
| `git push [remote-name] [branch-name]`    | moves your data from your branch to your server                     |
| `git remote show [remote-name]`           | displays information about the remote you specified                 |
| `git remote rename [old-name] [new-name]` | renames a remote                                                    |
| `git remote rm [name]`                    | removes the remote you specified                                    |
|-------------------------------------------|---------------------------------------------------------------------|

## Installing Gitolite

1.  Gitolite works on top of Git, and allows access to remote users without having to give them shell access. Install Gitolite with the command:

        sudo apt-get install gitolite

2.  A Linux user needs to be created in order for Gitolite to manage its configuration. This Gitolite user works through Git so do not set a password. The command to create the git user is as follows:

        sudo adduser --system --group --disabled-password git

### Create an SSH Keypair

1.  If you have not already created SSH keys, you will need to do this now. The keys must be created on your local machine. In a terminal window enter the command:

        ssh-keygen -t rsa

2.  Accept the defaults and do not enter a password. The public key will need to be copied up to your Git server. Use the command:

        scp ~/.ssh/id_rsa.pub <username>@<git-server-IP>:/<location><key-name>

The location is where you copied your key. For example:

    scp ~/.ssh/id_rsa.pub <git@192.168.0.1>:/tmp/git.pub

The private key remains on your local system and should not be copied anywhere else.

For Windows users consult the [Windows Operating System](/docs/security/ssh-keys#sph_id8) section in our Public Key guide.

### Configure Gitolite

1.  Log in to your Git server with you normal user account. Enter the command:

        gl-setup <key-location> 

2.  Depending on your distribution you may see a warning about the `gitolite.rc` file. Press **enter** to continue.

    ![Enable SSH key.](/docs/assets/1609-gitolite-gl-setup.png)

3.  You will be prompted to enter a number to select a text editor. In this example option 2 was selected, which corresponds with **Nano**.

    ![Select a text editor.](/docs/assets/1611-select-txt-editor.png)

4.  The `gitolite.rc` file will now open in your preferred text editor. The default settings should be used, so exit the file to continue.

    ![Viewing the gitolite.rc file.](/docs/assets/1610-gitolite.rc.png)

### Adding Users 

#### Prerequisites

Before users may be added to any of your projects, you will need to clone the Gitolite information from your server to your local machine. Enter the following command on your Git server:

    git clone <user>@<IP address>:gitolite-admin

This will create a new directory called `gitolite-admin`. Navigate to the newly created directory; if you run `ls` you will see two files inside `conf` and `keydir`. The keydir is the directory where the user keys are stored.

#### How to Add Users

In order to add a new user, you will need their name, email, and public key. For this example, the name `example_user` will be used. The procedure is as follows:

1.  Copy the user's public key:

        cp /path/<user>/public/key.pub ~/gitolite-admin/keydir/<example_user>.pub

2.  Configure the user's name:

        git config --global user.name <example_user>

3.  Configure the user's email:

        git config --global user.email <example_user@email.com>

4.  Configure the text editor:

        git config --global core-editor <editor-name>

5.  Now add the user's public key:

        git add keydir/<example_user>.pub

6.  Commit the change:

        git commit -a -m "New user example_user added"

7.  Finally push the changes up to the server:

        git push

## More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Git on the Server - Gitolite](http://git-scm.com/book/en/Git-on-the-Server-Gitolite)
- [Refspec Information](http://git-scm.com/book/ch9-5.html)
- [Gitolite](http://gitolite.com/gitolite/glssh.html)
- [Gitolite Quick Install](http://gitolite.com/gitolite/qi.html)
