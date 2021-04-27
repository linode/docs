---
slug: linux-how-to-set-environment-variables
author:
  name: Linode Community
  email: docs@linode.com
description: 'You can interact with your server through a Linux shell to access its resources. The Linux shell keeps track of and maintains this information in an area called an environment. This guide helps you interact with the Linux shell environment and understand how you can set environment variables.'
og_description: 'You can interact with your server through a Linux shell to access its resources. The Linux shell keeps track of and maintains this information in an area called the environment. This guide helps you interact with the Linux shell environment and understand how you can set environment variables.'
keywords: ['shell','bash','environment variables','command line','terminal','shell scripting']
tags: ['linux','linode platform', 'database', 'ssh']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-10
modified_by:
  name: Nathaniel Stickman
title: "Linux: How to Set Environment Variables"
h1_title: "How to Set and Use Environment Variables in Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

Your Linux shell maintains an environment where configuration and other information are stored in environment variables. Accessing these variables can be useful when working with shell commands. More than that, you can set your environment variables, which can be used by your scripts and applications.

This guide walks you through the fundamentals of accessing, creating, and using environment variables. By the end, you should know to make your variables and use them on your server.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Environment Variables

Environment Variables or ENVs are variables that contain dynamic named values stored within the system that are used by applications or programs launched in shells or subshells.

### Scope of the Environment Variables

Scope of any variable is the region from where it can be accessed over which it is defined. An environment variable in Linux can have **global** or **local** scope.

*Globally scoped environment variables* are accessible from anywhere in that particular environment bound by that terminal.

*Locally scoped environment variable* defined in a terminal cannot be accessed by any program running in the terminal.

## Difference Between Environment and Shell Variables

Standard UNIX variables are classified into two categories — Environment variables and Shell variables.

**Environment variables:**

1. An environment variable is available and valid system-wide, in a program, and its child programs.

1. Environment variables can be readily used by scripts and applications.

1. These variables are inherited by all spawned child processes and shells.

1. By convention, Environment Variables are given UPPER CASE names.

**Shell variables:**

1. Shell variables are available only in the current shell instance.

1. These variables are useful when you only need to store values temporarily.

1. Each shell such as `zsh` and `bash`, has its own set of internal shell variables.

This guide is focused on environment variables with references to shell variables.

## Commonly Used (Global) Environment Variables

Below are some of the Environment Variables that are commonly used.

* `USER`: Provides the name of the currently logged-in user.
* `HOME`: Gives the Home directory location of the current user. When you are working in the shell, you can use the `~` shorthand. However, the `HOME` variable can be useful in shell scripting, where you are more likely to encounter cases that do not support the shorthand.
* `SHELL`: Displays the pathname of the current user's shell.
* `PATH`: A list of directories that the shell will search when executing commands.
* `PWD`: Provides the path to your current working directory. (PWD stands for "Print Working Directory")
* `UID`: User's unique identifier.

You can test the usage of some of these environment variables by following the below steps.

1. Create a file with `.sh` extension using the following command.

        vi variables.sh

1. Write the following script in the file.

    {{< file "~/variables.sh" >}}

#! /bin/sh

echo 'The current logged-in User is:' $USER

echo 'Home directory of the current user is:' $HOME

echo 'Pathname of the current user's shell is:' $SHELL

echo 'The Present Working Directory is:' $PWD

echo 'Users unique identifier is:' $UID

{{< /file >}}

1. Save the `variables.sh` file, and make the script executable using the following command.

        chmod +x variables.sh

1. Run the script using the following command:

        ./variables.sh

1. The script displays the following output:

    {{< output >}}
The current logged-in User is: new-user-1

Home directory of the current user is: /home/new-user-1

Pathname of the current user's shell is: /bin/bash

The Present Working Directory is: /home/new-user-1

Users unique identifier is: 1001
{{< /output >}}

## How to Check Environment Variables

### View All Environment Variables

1. To view the list of all (global) environment variables applicable to the current user, use the following command :

        printenv

    Since `printenv` displays all the environment variables, you can use the `less` command to control the view.

        printenv | less

1. To get a more comprehensive list of (global and local) environment variables, use the following command. This list not only includes environment variables but also shell variables and functions.

        set

### Search a Single Environment Variable

1. To see the value of a single environment variable, use the following command.

        printenv VARIABLE NAME

    For example, you can pass the `HOME` variable as an argument to the command.

        printenv HOME
1. Alternatively, you can also use the `echo` command, and prepend the variable’s name with the `$` symbol to output the value of the variable. This works for both environment variables and shell variables.

        echo $HOME

## How to Set (Assign) Value to an Environment Variable

1. You can set the value to the environment variable by typing the name of the variable followed by a value.

        EXAMPLE_VARIABLE='Example value'

1. The `set` command confirms that the variable has been created. You can check the variable created using the following command.

    {{< output >}}
linode@test-main:~$ set | grep EXAMPLE

EXAMPLE_VARIABLE='Example value'

{{< /output >}}

    {{< note >}}
The variable created this way is a Shell variable. Hence, if you use the `printenv` command, it does not return any output.
    {{< /note >}}

**Other ways to assign values to Environment Variables:**

1. Environment variables can be assigned list values, with each item separated by a colon.

        export EXAMPLE_VARIABLE=/path/to/first/location:/path/to/second/location

1. You can also append new items to lists.

The following example appends new items to lists using the `PATH` variable, adding the `example-directory` from the user's home directory.

        export PATH=$PATH:$HOME/example-directory

`PATH` is a default environment variable defining directories where your shell looks for executables. It is the variable that lets you run an executable without having to specify its path.

### How to Export an Environment Variable

1. You can turn a Shell variable into an environment variable using the `export` command. The below example creates a variable called `EXAMPLE_VARIABLE` and assigns it the value `New Example value`.

        export EXAMPLE_VARIABLE='New Example value'

1. Use the `printenv` to confirm the export.

    {{< output >}}
linode@test-main:~$ export EXAMPLE_VARIABLE='New Example value'

linode@test-main:~$ printenv EXAMPLE_VARIABLE

New Example value

{{< /output >}}

### How to Unset an Environment Variable

The `unset` command removes a designated environment or shell variable from the session. This example removes the `EXAMPLE_VARIABLE`.

        unset EXAMPLE_VARIABLE

## Persisting Environment Variables

If you want your variable to persist even after you close the shell session — maybe even between users, then you can set that environment variable permanently.

To do so, you need to add the appropriate `export` command to one of the shell configuration files.

The following example uses (default) Bash shell. If you are using any other shell, you need to modify the steps accordingly.

You can usually check what shell you are using via the `SHELL` environment variable.
    {{< output >}}
linode@test-main:~$ echo $SHELL

/bin/bash
{{< /output >}}

**To set the permanent environment variable for a single user:**

Edit the `.bashrc` file, and at the end of the file, write a line that appends the user's `example-directory` to the `PATH` variable.

{{< file "~/.bashrc" >}}
export PATH=$PATH:$HOME/example-directory
{{< /file >}}

**To set the permanent environment variable for all users:**

Create a custom shell script (`.sh`) file in the `/etc/profile.d` directory, and add the `EXAMPLE_VARIABLE`.
    {{< file "/etc/profile.d/custom.sh">}}
export EXAMPLE_VARIABLE='Example value'
{{< /file >}}

{{< note >}}
You can, instead, add environment variables to the `/etc/profile` or the `/etc/bashrc` file. However, doing so is not recommended because your variables could be affected, possibly wiped, by upgrades to the shell package.
{{< /note >}}

## Using Environment Variables in Application Development

In application development, environment variables come in handy while distinguishing between application environments and storing authentication credentials.

The following steps illustrate a simple use case. Here, the environment variables distinguish between test and production application environments and store the database credentials for each.

{{< note >}}
The example application code below uses pseudocode loosely based on Python. It needs to be adjusted according to the language you are using for your application.
{{< /note >}}

1. Configure the application for testing. Here, the configuration is set up in the `/etc/profile.d/example-application.sh` file.
Set up credentials for both test and production, and provide an `APP_ENV` variable that can act as a switch.

    {{< file "/etc/profile.d/example-application.sh" >}}
export APP_ENV="TEST"

export APP_TEST_DB_HOST="example-test-db-host"
export APP_TEST_DB_USERNAME="example-test-db-username"
export APP_TEST_DB_PASSWORD="example-test-db-password"

export APP_PROD_DB_HOST="example-prod-db-host"
export APP_PROD_DB_USERNAME="example-prod-db-username"
export APP_PROD_DB_PASSWORD="example-prod-db-password"
    {{< /file >}}

1. The application reads the `APP_ENV` variable and fetches the credentials from the appropriate variables. This method makes the application environment agnostic — whatever the environment is set to, the application responds appropriately.

    {{< file main.code >}}
import os

app_environment = "APP_" + os.environment["APP_ENV"]

app_db_host = os.environment[app_environment + "_DB_HOST"]
app_db_username = os.environment[app_environment + "_DB_username"]
app_db_password = os.environment[app_environment + "_DB_password"]
    {{< /file >}}

1. When you need to change to the production environment, just change the `APP_ENV` variable to "PROD".

    {{< file "/etc/profile.d/example-application.sh" >}}
export APP_ENV="PROD"
    {{< /file >}}

## Conclusion

With the information above, you should be off to a good start for using environment variables on your Linux server. They can be strong tools for scripting, developing applications, and having a better time working in the shell overall.
