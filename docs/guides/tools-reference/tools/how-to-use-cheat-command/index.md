---
slug: linux-cheat-command
author:
  name: Nathaniel Stickman
description: "Learn how to install and use the cheat command to view and manage cheat sheets from the command line. The cheat command gives you quick access to a repository of community cheat sheets and also allows you to easily create your own."
keywords: ['cheat linux commands','cheat linux install','linux cheat sheet app']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-23
modified_by:
  name: Nathaniel Stickman
title: "Installing and Using the cheat Command on Linux"
h1_title: "How to Install and Use the cheat Command on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

`cheat` is a command-line tool that lets you view, create, and manage cheat sheets. This tool is ideal for Linux system administrators because you can access your cheat sheets directly from the command line. This minimizes your need to hunt down a refresher for a command you haven't used in while. You can find what you need without leaving your terminal.

In this guide you learn more about the `cheat`command-line tool, including how to install and get started using it.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is cheat?

[`cheat`](https://github.com/cheat/cheat) is a command-line tool for using and managing cheat sheets. The tool was designed for Linux administrators. This tool is especially handy to help you remember details about commands you don't use very often.

With `cheat`, you can easily access refreshers for those commands right from the command-line. `cheat` supports community-sourced cheat sheets like the ones in the [`cheatsheets` project](https://github.com/cheat/cheatsheets), giving you a ready resource to get started. The `cheat` Linux command-line tool also supports the creation of your own cheat sheets, letting you make the exact resource that you need.

## How to Install cheat

1. Visit the `cheat` [releases page](https://github.com/cheat/cheat/releases), find the latest release, and identify the `.gz` file appropriate for your machine. Then, copy the URL for that file.

    To do identify the right file, you need to know your system's CPU architecture, which you can get via the command below:

        lscpu | grep Architecture

    {{< output >}}
Architecture:        x86_64
    {{< /output >}}

    - For `x86_64` (like in the example output above), use the file with a name ending in `linux-amd64`.
    - For `i386` or `i686`, use the file ending in `linux-386`.
    - For `arm`, use the `getconf LONG_BIT` command to determine if you system is 64- or 32-bit. If it is 64-bit, use the file ending in `linux-arm64`. Otherwise, use the file ending in `linux-arm7`.

    So, for example, on a system with an **x86_64** (AMD64) architecture, use the `cheat-linux-amd64.gz` file.

1. Download the `.gz` file using a command like the following, replacing the URL with the one you copied in the step above:

        curl -LO https://github.com/cheat/cheat/releases/download/4.2.2/cheat-linux-amd64.gz

1. Extract the file's contents using `gzip`. Replace the filename below with the one for the file you downloaded:

        gzip -dk cheat-linux-amd64.gz

1. Move the extracted binary file to your `PATH`. Again, be sure to replace the `amd64` filename below with the name of the file you extracted:

        sudo mv cheat-linux-amd64 /usr/local/bin/cheat

1. Give the binary file executable permission:

        sudo chmod +x /usr/local/bin/cheat

1. Verify your installation by checking the installed version:

        cheat --version

    {{< output >}}
4.2.3
    {{< /output >}}

### Setting Up cheat

On its own, `cheat` does not come with any cheat sheets. However, you can have `cheat` download a collection of community-sourced cheat sheets from the [`cheatsheets` project](https://github.com/cheat/cheatsheets). When you first run `cheat`, it prompts you about downloading the collection, as well as about creating a default configuration file.

{{< note >}}
To automatically download the community cheat sheets, `cheat` uses Git. If your system does not have Git installed, install it prior to following the steps below.

    sudo apt-get install git
{{</ note >}}

Run a `cheat` command like the one below, and answer **Yes** (**Y**) to the prompts to download the community cheat sheet collection and create the default configuration file:

    cheat ls

Here is what your output may look like:

{{< output >}}
A config file was not found. Would you like to create one now? [Y/n]: Y
Would you like to download the community cheatsheets? [Y/n]: Y
Cloning into '/home/example-user/.config/cheat/cheatsheets/community'...
[...]
Created config file: /home/example-user/.config/cheat/conf.yml
Please read this file for advanced configuration information.
{{< /output >}}

If you initially skipped downloading the `cheatsheets` project, you can download it later by cloning the repository to the appropriate directory. Here is an example, which assumes the current user is your `cheat` user:

    git clone https://github.com/cheat/cheatsheets.git ~/.config/cheat/cheatsheets/community

Likewise, if you initially skipped creating your `cheat` configuration file, you can download it to the appropriate directory:

    cd ~/.config/cheat
    curl -LO https://raw.githubusercontent.com/cheat/cheat/master/configs/conf.yml

### Setting Up cheatsheets

The `cheat` maintainers provide a script to help you manage community-sourced cheat sheets. Use the following commands to download the script and add it to your user's `PATH`:

    curl -LO https://raw.githubusercontent.com/cheat/cheat/master/scripts/git/cheatsheets
    sudo mv cheatsheets /usr/local/bin/
    sudo chmod +x /usr/local/bin/cheatsheets

## How to Use cheat

The sections below show you how to get started using `cheat`. They help you learn how to find the sheets you need, create new ones, and manage existing ones.

### Viewing and Navigating Cheat Sheets

To view a cheat sheet, provide the `cheat` command with the name of the cheat sheet. Usually, this is the name of a command for which you want to view its cheat sheet:

    cheat ls

{{< output >}}
# To display everything in <dir>, excluding hidden files:
ls <dir>

# To display everything in <dir>, including hidden files:
ls -a <dir>

# To display all files, along with the size (with unit suffixes) and timestamp
ls -lh <dir>

# To display files, sorted by size:
ls -S <dir>

# To display directories only:
ls -d */ <dir>

# To display directories only, include hidden:
ls -d .*/ */ <dir>
{{< /output >}}

There are some cheat sheets, like the `markdown` one, that don't correspond to a command, but to a topic that you may want to learn more about.

You can get a list of all of the cheat sheets you have installed with the `-l` option:

    cheat -l

Each cheat sheet should have one or more tags. These can be helpful in narrowing down the sheets when you need to find one on a particular subject. With the following command, `cheat` lists all sheets related to "compression":

    cheat -l -t compression

{{< output >}}
title:  file:                                                          tags:
7z      /home/example-user/.config/cheat/cheatsheets/community/7z      community,compression
bzip2   /home/example-user/.config/cheat/cheatsheets/community/bzip2   community,compression
gzip    /home/example-user/.config/cheat/cheatsheets/community/gzip    community,compression
tar     /home/example-user/.config/cheat/cheatsheets/community/tar     community,compression
tarsnap /home/example-user/.config/cheat/cheatsheets/community/tarsnap community,compression
unzip   /home/example-user/.config/cheat/cheatsheets/community/unzip   community,compression
{{< /output >}}

Cheat sheets also each have a path. By default, community-sourced sheets are on the `community` path and custom sheets (see the next section) are on the `personal` path. You can use the `-p` option to see sheets only on a given path:

    cheat -l -p community

Using the `-s` option, you can bring up all cheat sheets matching a given search phrase:

    cheat -s '.gz'

The search option supports regular expression (regex) searches if you add the `-r` option. Here, `cheat` returns cheat sheets with HTTPS URLs ending in some of the more common domain extensions:

    cheat -r -s 'https\:\/\/(\w*\.\w*|\w*)\.(com|org|net|gov|edu)'

You can combine query options, too, to make fine-tuned searches:

    cheat -t compression -p community -s 'tar.gz'

### Creating Your Own Cheat Sheets

You can also use `cheat` to create cheat sheets of your own. The steps below create a cheat sheet for the `bat` command, a more-readable and modern clone of `cat`, as an example.

{{< note >}}
If you think you may be interested in `bat`, check out our guide [How to Install and Use the Linux bat Command](/docs/guides/how-to-install-and-use-the-bat-command-on-linux/) to learn more.
{{</ note >}}

1. Use the `-e` option to start creating the new cheat sheet:

        cheat -e bat

    Be aware that, if a cheat sheet with the given name already exists, this command starts editing that sheet instead of creating a new sheet. You can learn more about editing sheets in the next section.

1. `cheat` opens an editor for you to enter the contents of the cheat sheet. Here are example contents for `bat`:

    {{< file "~/.config/cheat/cheatsheets/personal/bat" >}}
---
tags: [ files, reader ]
---
# To view a file:
bat path/to/file

# To show non-printing characters:
bat --show-all path/to/file

# To list available themes:
bat --list-themes

# To use a theme to view a file:
bat --theme="{theme-name}" path/to/file
    {{< /file >}}

1. When you have finished entering contents for your cheat sheet, save the file and exit the editor.

1. Take a look at the cheat sheet you just made:

        cheat bat

### Managing Cheat Sheets

You can use the same option you used to create a cheat sheet (`-e`) to edit an existing cheat sheet. Moreover, you can edit not only personal cheat sheets but also community sheets you have downloaded. This can be useful when you want to add personalized reminders for a command.

The command below opens an editor for the (community) cheat sheet file on `ls`:

    cheat -e ls

In the [Setting Up cheatsheets](/docs/guides/linux-cheat-command/#setting-up-cheatsheets) section near the start of this guide, you got steps for installing a script for managing community cheat sheets. One of the primary benefits of this script is its ability to easily and automatically make sure your community sheets are up to date:

    cheatsheets pull

The script also allows you to easily push your local cheat sheets to a remote repository. This requires that you first connect your cheat sheet directory to a Git repository. You can do that either by creating a Git repository from the directory or by downloading your own fork of the `cheatsheets` repository when setting up `cheat`.

Once you have that done, you can simply use this command to push you local changes:

    cheatsheets push

## Conclusion

This guide gives you the most useful features of `cheat`, but, if you are looking for more control, you can view the `cheat` configuration file to customize your experience even further.

Do you see something that could use a cheat sheet, or did you think of some handy command for an existing sheet? Jump into the [`cheatsheets` repository](https://github.com/cheat/cheatsheets) and contribute your own cheat sheets
