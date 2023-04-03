---
slug: how-to-add-directory-to-path
description: "What is the PATH variable in Linux, and how does it work? Better still, how can you add your own directories to it? Find out in this tutorial, covering everything you need to know about the PATH variable and adding directories to it."
keywords: ['linux path variable','linux path directory','add to linux path']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-14
modified_by:
  name: Nathaniel Stickman
title: "Add a Directory to the PATH on Linux"
title_meta: "How to Add a Directory to the PATH on Linux"
external_resources:
- '[Linuxize: How to Add a Directory to PATH in Linux](https://linuxize.com/post/how-to-add-directory-to-path-in-linux/)'
- "[It's FOSS: How to Add a Directory to PATH in Linux](https://itsfoss.com/add-directory-to-path-linux/)"
- '[How-to Geek: How to Add a Directory to Your $PATH in Linux](https://www.howtogeek.com/658904/how-to-add-a-directory-to-your-path-in-linux/)'
authors: ["Nathaniel Stickman"]
---

Have you ever wondered how certain executables on Linux can be accessed as simple commands from the command line? Have you wanted to be able to run a program on Linux without having to provide the entire path?

These are the problems the `PATH` variable is designed to solve. In this tutorial, learn more about what the `PATH` variable is and how it works. Then, see how you can add your own directories to the `PATH`, allowing you to run programs as simple commands.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/products/platform/get-started/) guide and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On **Debian** and **Ubuntu**, use the following command:

            sudo apt update && sudo apt upgrade

    - On **AlmaLinux**, **CentOS** (8 or later), or **Fedora**, use the following command:

            sudo dnf upgrade

1. You may want to take a refresher on environmental variables. You can get everything you need to know from our guide [How to Set and Use Linux Environmental Variables](/docs/guides/how-to-set-linux-environment-variables/).

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is the PATH Variable?

The `$PATH` environmental variable contains a colon-separated list of directories. These directories are where Linux looks for executables, allowing you to run these using only the executable names.

For instance, say you have an executable called `program-to-run` in the `/usr/local/bin` directory. Without that directory in your `PATH`, you would have to run the executable with:

    /usr/local/bin/program-to-run

Or by changing into the directory first and then running the executable:

    cd /usr/local/bin
    ./program-to-run

However, if you have the directory in your `PATH`, you can run the executable by simply giving its name as a command:

    program-to-run

The `PATH` variable becomes especially useful when running specialized developer or system administrator tools as well as in-development applications. It allows you to run tools and applications efficiently while keeping them stored wherever best fits your needs.

### View the PATH Variable

It can be useful to know what directories are already assigned to the `PATH` on your Linux system. You can do this easily with the `echo` command, like this:

    echo $PATH

{{< output >}}
/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games
{{< /output >}}

As you can see from the output above, Linux systems come by default with several convenient directories already on the `PATH`.

But sometimes these directories alone do not meet your needs. That is when you should look to customizing the `PATH` variable's contents.

## How to Add a Directory to the PATH

Linux comes with several directories in the `PATH` by default, like you can see in the output above. Typically, these are enough. Most programs you install on Linux put their executables in one of the default directories, making them easy to start using immediately.

But sometimes this is not the case. The `PATH` variable does not cover executables that you download or create and store in non-default directories. But that kind of storage is often the case when using one-off programs, working with particular system administrator tools, or when developing executables.

In such cases and similar ones, you likely want the ability to add additional directories to the `PATH` variable to make executables easier to work with.

Fortunately, you can do just that using the `export` command. Here is an example, adding the `/etc/custom-directory` directory to the `PATH`:

    export PATH="$PATH:/etc/custom-directory"

After the above command, you can run executables stored in the `custom-directory` simply by providing the executables' names as commands.

How exactly does the `export` command achieve this? Follow along with this breakdown of the command to understand how each part works:

- `export PATH=` starts to define the `PATH` variable.

- `$PATH` ensures that the new definition of `PATH` begins with all of the contents of the existing `PATH`. In other words, including the `PATH` variable here is how you expand on the variable's contents rather than overwrite them.

- `:/etc/custom-directory` adds the new directory. Notice the placement of the colon, which is necessary because the `PATH` list is colon-separated.

You can verify the updated contents of `PATH` using the `echo` command as shown above:

    echo $PATH

{{< output >}}
/usr/local/bin:/usr/bin:/bin:/usr/local/games:/usr/games:/etc/custom-directory
{{< /output >}}

### PATH Variable Scope

Executing the `export` command above only updates the `PATH` variable for the current session. Logging out and logging back into your Linux system results in the `PATH` being reset.

There are two methods available should you want to have your directory added to the `PATH` in a more permanent way.

- You can alter the `PATH` variable for a given user by adding the `export` command to that user's shell configuration file. The location of the configuration file varies depending on the shell program. For Bash, the configuration file is typically `~/.bashrc`:

    {{< file "~/.bashrc" sh >}}
# [...]

export PATH="$PATH:/etc/custom-directory"
    {{< /file >}}

- You can alter the global `PATH` variable for your Linux system by adding the `export` command to your system's configuration file. That file is typically `/etc/profile`:

    {{< file "/etc/profile" sh >}}
# [...]

export PATH="$PATH:/etc/custom-directory"
    {{< /file >}}

Of the two options above, the option for modifying the `PATH` for the current user is preferred most of the time. Typically, you should only modify the global `PATH` when you have a directory with executables needed by most or every user on the system.

In either case, you can expect the same output as with the plain `export` command above. They function just the same except these options make it so that the extended `PATH` persists between sessions.

## Conclusion

This tutorial has given you the tools to start using the `PATH` variable effectively. Not only explaining what the `PATH` variable is and what it does, but also showing you how to add more directories to it. The change can be simple, but adding directories to the `PATH` can make life easier and your tasks go ahead more smoothly.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
