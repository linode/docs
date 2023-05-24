---
slug: how-to-use-cd
description: "Learn how to use the cd command to navigate to different directories inside of a Linux or macOS terminal."
keywords: ["linux", "how to", "cd", "change directory"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-04-23
modified_by:
  name: Linode
published: 2020-06-22
image: UseTheCDCommand.png
title: "Using the cd Command to Navigate the Terminal"
title_meta: "How to Use the cd Command to Navigate the Terminal"
tags: ["linux"]
aliases: ['/quick-answers/linux/how-to-use-cd/']
authors: ["Linode"]
---

## What is cd?

On Linux systems, `cd` is a command that changes the directory you are in when working in the terminal. The `cd` command is one of the most used commands in Linux and has several shortcuts as well as two options.

## Using the cd command

To change directories using `cd`:

    cd [option] [directory]

For example, to navigate to the directory `/usr/local`, you would use the following syntax:

    cd /usr/local

In the previous example an absolute path name was used. However you can also use a path relative to your current location. For example, if you are in `/usr/local` and want to change into `/usr/local/share`, you can do so with the following relative path:

    cd share

### Shortcuts in cd

Several shortcuts are available for `cd` which makes navigating between directories quicker and easier.

To navigate to the parent directory relative to where you are currently, use two consecutive dots (`..`):

    cd ..

These dots can also be stacked to move up multiple levels:

    cd ../../..

To change into the root directory, no matter your current location, use a forward slash `/`:

    cd /

To change into your home directory, no matter your current location, use a tilde `~`:

    cd ~

You can also change into your home directory by using the `cd` command without any arguments:

    cd

To change to the last location, use a hyphen `-`:

    cd -

{{< output >}}
~/usr/local/share
{{</ output >}}

This shortcut is helpful to toggle between two locations with long absolute paths to type. Note that it also returns the last location's absolute pathname.

### Options in cd

`cd` has two options, `-L` and `-P`.

The `-L` option forces symbolic links to be followed. This means if you tell the `cd` command to change into a directory that is a symbolic link, it will follow it and move you into the directory it's pointing at instead of the directory specified. This is the standard behavior of `cd` and does not need to be specified. For example, if you want to change into `/var/example.com` but that's a symbolic link to `/var/www/example.com` by issuing the following command, you will change into `/var/www/example.com`:

    cd -L /var/example.com

The `-P` option tells `cd` to use the physical directory structure and not to follow symbolic links. If you use this option, instead of navigating to where the symbolic link points to, you will change into the physical directory, if it exists. If the directory does not exist, the system will alert you with a `directory does not exist error` and you will remain in the current directory. For example, say you want to `cd` to a symbolic link `/var/example.com` that points to `/var/www/example.com`, you will simply change into the directory and not follow the link:

    cd -P /var/example.com

{{< note respectIndent=false >}}
If both `-L` and `-P` are specified, the `-P` option will be ignored.
{{< /note >}}
