---
slug: what-is-usermod-and-how-to-use-it
description: "This guide shows you how to use the usermod command in Linux. You learn how to change a user’s home directory, login name, groups, user shell, and more."
og_description:  "This guide shows you how to use the usermod command in Linux. You learn how to change a user’s home directory, login name, groups, user shell, and more."
keywords: ['usermod','usermod linux','usermod command']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-23
modified_by:
  name: Nathaniel Stickman
title: "An Overview of the usermod Command and How It's Used"
title_meta: "What is usermod, and How do I Use It?"
external_resources:
- '[usermod - Ubuntu Manpage](https://manpages.ubuntu.com/manpages/xenial/en/man8/usermod.8.html)'
authors: ["Nathaniel Stickman"]
---
## What is usermod?

### Tool Used to Modify a User's Linux Settings

The `usermod` command lets you change an existing Linux user's settings. Most things that get set up when you create a user — from a login name and home directory to the shell environment — can be altered using `usermod`. In addition, `usermod` can add a user to supplementary Linux groups, lock and unlock a user's account, and more. This guide covers how the usermod utility works, and how it relates to other Linux commands.

### Comparison to useradd and chmod

The difference between `useradd` and `usermod` is that the former is used for creating new users and the latter is used for modifying existing users. While `useradd` can define a Linux user's settings, it does so for new users, not existing users. See our [Linux Users and Groups](/docs/guides/linux-users-and-groups/#creating-and-deleting-user-accounts) guide for more on the `useradd` command.

On the other hand, `chmod`, like `usermod`, modifies existing resources. But where `usermod` modifies settings for an existing user, `chmod` modifies the permissions on a given file or directory. For instance, while `usermod` allows you to change a user's home directory, `chmod` lets you give a file in that directory executable permissions. Learn more about what `chmod` is and how to use it in our guide [Modify File Permissions with chmod](/docs/guides/modify-file-permissions-with-chmod/).

## Using usermod to Add a User to a Group

### How to Change a User's Primary Group with usermod

You can use `usermod` to change a user's primary group with the `-g` option. Here is an example:

    sudo usermod -g example-group example-user

Take a look at the results with the `id` command.

    sudo id example-user

{{< output >}}
uid=1001(example-user) gid=1002(example-group) groups=1002(example-group)
{{< /output >}}

{{< note respectIndent=false >}}
The Linux user group must exist before `usermod` allows you to assign a user to the groups.
{{< /note >}}


### How to Add a User to a Group with usermod

To assign a user to one or more supplementary groups, use the `-aG` option. This option can assign multiple groups at once, separating each with a comma (no space):

    sudo usermod -aG groupA,groupB,groupC example-user

The `-a` option is used to have these groups appended to the user's list of supplementary groups. Without it (using only the `-G` option) the user gets removed from any supplementary groups that are not listed in the command.

Below is an example of what the user's `id` information may look like after the command above is executed.

{{< output >}}
uid=1001(example-user) gid=1002(example-group) groups=1002(example-group),1003(groupA),1004(groupB),1005(groupC)
{{< /output >}}

## How do I Use usermod to Change a User's Home Directory?

Use the `-d` option to change the user's home directory.

    sudo usermod -d /home/example-user-new-home example-user

You can add the `--move-home` option to also have the contents of the user's existing home directory moved to the new directory.

    sudo usermod --home /home/example-user-new-home --move-home example-user

You can verify the change by echoing the user's home directory.

    echo ~example-user

{{< output >}}
/home/example-user-new-home
{{< /output >}}

## How to Change a User's Login Name with usermod

`usermod` allows you to change a user's login name with the `-l` option, for example:

    sudo usermod -l new-example-user example-user

Changing a user's login name does not change the name of that user's home directory. Reference the [previous section](#how-do-i-use-usermod-to-change-a-users-home-directory) if you want to change the user's home directory to match its login name.

Running the `sudo id example-user` command should now output an error since the user's login name has changed.

{{< output >}}
id: ‘example-user’: no such user
{{< /output >}}

## How to Lock and Unlock a User's Account with usermod

You can lock and unlock user accounts with `usermod`. Locking an account allows you to prevent logins on it without completely removing the account.

### Locking a User's Account with usermod

To lock a user's account, use the `-L` option.

    sudo usermod -L example-user

Locked users display with an exclamation point after their login names, right at the start of their encrypted passwords, in the `/etc/shadow` file. The example below displays what an entry for `example-user` may look like.

    sudo cat /etc/shadow | grep example-user

{{< output >}}
example-user:![encrypted_password]:[...]
{{< /output >}}

### Unlocking a User's Account with usermod

To unlock a user's account, use the `-U` option.

    sudo usermod -U example-user

Now the entry for `example-user` in the `/etc/shadow` file should lose its exclamation point.

    sudo cat /etc/shadow | grep example-user

{{< output >}}
example-user:[encrypted_password]:[...]
{{< /output >}}

## How to Set an Expiration Date for a User's Account with usermod

To set an expiration date for a user's account, use the example command. Ensure you replace `example-user` with your own user.

    sudo usermod example-user -e 2021-07-30

In the above example, the `example-user` user account automatically deactivates on July 30, 2021.

    sudo chage -l example-user

{{< output >}}
Last password change     : Jun 30, 2021
Password expires     : never
Password inactive     : never
Account expires      : Jul 30, 2021
Minimum number of days between password change  : 0
Maximum number of days between password change  : 99999
Number of days of warning before password expires : 7
{{< /output >}}

## How to Change a User's Shell with usermod

Use the `-s` option with `usermod` to define a user's shell. This option takes a path to the shell's binary. Leaving the options blank assigns the user the default shell for the system.

Here is an example that assigns the user the Bash shell.

    sudo usermod -s /bin/bash example-user

You can then verify the user's default shell with the following command:

    sudo getent passwd example-user

{{< output >}}
example-user:[...]:/bin/bash
{{< /output >}}

## How to Change a User's UID or GID with usermod

### Changing a User's UID with usermod

You can change a user's user ID (UID) number with the `-u` option. The UID needs to be a unique, non-negative number. Additionally, the number should not fall between 0 and 999, since that range tends to be reserved for system accounts.

    sudo usermod -u 1234 example-user

Verify the change with the `id` command:

    sudo id example-user

{{< output >}}
uid=1234(example-user) gid=1002(example-group) groups=1002(example-group)
{{< /output >}}

### Changing a User's GID with usermod

Changing a user's group ID (GID) number takes the same `usermod` option as changing a user's primary group, `-g`. Simply provide the group's GID number instead of its name, as in:

    sudo usermod -g 5678 example-user

Remember that the group must already exist — with the intended GID — for this option to work.

Again, you can verify the change with the `id` command.

    sudo id example-user

{{< output >}}
uid=1234(example-user) gid=5678(another-example-group) groups=5678(another-example-group)
{{< /output >}}
