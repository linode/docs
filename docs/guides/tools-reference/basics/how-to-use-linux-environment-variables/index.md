---
slug: how-to-set-linux-environment-variables
author:
  name: Linode Community
  email: docs@linode.com
description: "This guide introduces you to Linux environment variables and explains the differences between shell variables and environment variables."
keywords: ['shell','bash','environment variables','command line','terminal','shell scripting']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-05-04
modified_by:
  name: Nathaniel Stickman
title: "How to Set and Use Linux Environment Variables"
h1_title: "Setting and Using Linux Environment Variables"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

Your Linux shell has access to an environment that stores configuration values and other information in *environment variables*. Accessing these variables can be useful when working with shell commands. You can also set environment variables that can be accessed and used by your scripts, and applications. This guide walks you through the fundamentals of accessing, creating, and using environment variables.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Are Environment Variables?

Environment variables are name-value pairs used by a system's shell to define default shell properties. Some of these include your shell's home directory, prompt, and current working directory. Environment variables are inherited by sub-shells, and are available to applications, and daemons. You can also create and set your own environment variables.

### Environment Variable Scope

A variable's *scope* refers to the parts of a program or environment that can access a given variable. An environment variable in Linux can have *global* or *local* scope.

- **Globally scoped environment variables** are accessible from anywhere in a particular environment bound by the terminal.

- **Locally scoped environment variables** can only be accessed by the terminal that defined the variable. It cannot be accessed by any program or script.

## Differences Between Environment and Shell Variables

Standard UNIX variables are classified into two categories—environment variables and shell variables.

**Environment variables:**

- An environment variable is available and valid system-wide.

- Environment variables can be used by scripts and applications.

- These variables are inherited by all spawned child processes and shells.

- By convention, environment variables are given upper case names.

**Shell variables:**

- Shell variables are available only in the current shell session.

- These variables are useful when you need to store values temporarily.

- Each shell such as `zsh` and `bash`, has its own set of internal shell variables.

This guide focuses on environment variables with references to shell variables.

## Commonly Used (Global) Environment Variables

The following environment variables are commonly available to most popular Linux system's by default.

- `USER`: The currently logged-in user name.
- `HOME`: The path to the current user's home directory.
- `SHELL`: The pathname of the current user's shell.
- `PATH`: A list of directories that the shell searches for executable files.
- `PWD`: The path to your current working directory (PWD stands for "Print Working Directory").
- `UID`: The current user's unique identifier.

Follow the steps below to view your system's values for the environment variables listed above.

1.  Create a new file named `variables.sh` and include the contents of the example file.

    {{< file "~/variables.sh" >}}
#! /bin/sh

echo 'The current logged-in User is:' $USER
echo 'Home directory of the current user is:' $HOME
echo 'Pathname of the current user'"'"'s shell is:' $SHELL
echo 'The Present Working Directory is:' $PWD
echo 'Users unique identifier is:' $UID
{{< /file >}}

1.  Make the script executable using the following command:

        chmod +x variables.sh

1.  Run the script to view its output:

        bash variables.sh

1.  The script displays the following output:

    {{< output >}}
The current logged-in User is: example_user
Home directory of the current user is: /home/example_user
Pathname of the current user's shell is: /bin/bash
The Present Working Directory is: /home/example_user
Users unique identifier is: 1000
{{< /output >}}

## How to Get and Set Environment Variables

### List All Environment Variables

To view a list of all (global) environment variables available to the current user, use the following command :

    printenv

{{< note >}}
You can pipe the output of the `printenv` command to the `less` utility to page through all your environment variables.

    printenv | less
{{</ note >}}

To get a more comprehensive list of (global and local) environment variables, use the `set` command. This list includes environment variables, shell variables, and functions.

    set

### Get the Value of an Environment Variable

To see the value of a single environment variable, use the following command and replace `VARIABLE_NAME` with your own variable.

    printenv VARIABLE_NAME

For example, you can pass the `HOME` variable as an argument to the command.

    printenv HOME

Alternatively, you can use the `echo` command, and prepend the variable’s name with the `$` symbol to output the value of the variable. This works for both environment variables and shell variables.

    echo $HOME

### How to Set Environment Variables

To set the value of an existing environment variable type the variable name followed by the value you want to assign.

    EXAMPLE_VARIABLE='example value'

{{< note >}}
If the environment variable does not already exist, it is created as a shell variable. You can promote the shell variable to an environment variable by exporting it. See the [How to Export Environment Variables](#how-to-export-environment-variables) section for details.
{{</ note >}}

Use the `set` command to view the variable and its value.

    set | grep EXAMPLE_VARIABLE

{{< output >}}
EXAMPLE_VARIABLE='example value'
{{</ output >}}

### How to Export Environment Variables

You can turn a shell variable into an environment variable using the `export` command. The example below creates a variable called `EXAMPLE_VARIABLE` and assigns it the value `new example value`.

    export EXAMPLE_VARIABLE='new example value'

Use the `printenv` to confirm that the variable is now a part of your environment.

{{< output >}}
New Example value

{{< /output >}}

### How to Assign Multiple Values to an Environment Variable

To assign multiple values to an environment variable use a list. Each value should be separated by a colon.

    export EXAMPLE_VARIABLE=/path/to/first/location:/path/to/second/location

You can also append new items to lists. The example appends the `example-directory` located in the user's home directory to the `PATH` environment variable.

    export PATH=$PATH:$HOME/example-directory

{{< note >}}
`PATH` is a default environment variable that defines directories where your shell can look for executables. This variable allows you to run an executable without having to specify its path.
{{</ note >}}

### How to Unset an Environment Variable

The `unset` command removes an environment or shell variable from the session. This example removes `EXAMPLE_VARIABLE`.

    unset EXAMPLE_VARIABLE

## Persisting Environment Variables

You can set an environment variable permanently between shell sessions and users. To do so, set your environment variable in your shell configuration file using the `export` command

The example in this section uses the Bash shell, since it is the default shell on most popular Linux distributions. If you are using any other shell, modify the steps accordingly.

Use the `SHELL` environment variable to check which shell you are using:

    echo $SHELL

**Set a persistent environment variable for a single user:**

Edit the user's `.bashrc` file located in their home directory and add a line that exports the environment variable that you want to persist. The example line appends the user's `/home/username/example-directory` to the `PATH` variable.

{{< file "~/.bashrc" >}}
export PATH=$PATH:$HOME/example-directory
{{< /file >}}

**Set a persistent environment variable for all system users:**

Create a new shell script file (`.sh`) in the `/etc/profile.d` directory. Add a line to your example file that exports the environment variable that you want to persist across all system users.

{{< file "/etc/profile.d/custom.sh">}}
export EXAMPLE_VARIABLE='example value'
{{< /file >}}

{{< note >}}
You can also add environment variables to the `/etc/profile` or the `/etc/bashrc` files. However, your variables may not persist after upgrades to your shell package.
{{< /note >}}

## Using Environment Variables in Application Development

In application development, you can use environment variables to distinguish between application environments and to store configuration information required by your app. The example below uses environment variables to distinguish between test and production application environments and to store URLs for each environment's corresponding API.

Create a `.sh` file to store your app's configuration values as environment variables. You can store the file in the `/etc/profile.d/` directory to make the configurations available to all system users. The `APP_ENV` variable can then act as a switch in your application code.

{{< file "/etc/profile.d/app-config-vars.sh" >}}
export APP_ENV="TEST"
export APP_TEST_API="https://api.test.example.com/v1/customers"
export APP_PROD_API="https://api.example.com/v1/customers"
{{</ file >}}

{{< note >}}
Ensure you reload your system's `profile` file to give your terminal session access to your new environment variables:

    source /etc/profile
{{</ note >}}

Create a new file named `main.py` with the example content below. The example application reads the `APP_ENV` variable and fetches the configurations from the appropriate variables. This method makes the application *environment agnostic* — the application responds appropriately depending on its current environment.

{{< file main.py >}}
import os
app_environ = "APP_" + os.environ["APP_ENV"]
app_api = os.environ[app_environ + "_API"]

print('Your current environment: ' + os.environ['APP_ENV'])
print('Your environment's API URL' + app_api)
{{< /file >}}

Execute the file to view which environment and API URL is currently detected by the example application.

    python main.py

{{< output >}}
Your current environment: TEST
Your APIs URL: https://api.test.example.com/v1/customers
{{</ output >}}
{{< note >}}
Depending on your system's configuration and installed version of Python, you may need to adjust the above command to explicitly use Python 3.

    python3 main.py
{{</ note >}}

When you need to change to the production environment, update the `APP_ENV` variable to `PROD`.

    APP_ENV="PROD"

Rerun the `main,py` file and your output should now indicate that you are using the configurations for your production environment.

    python main.py

{{< output >}}
Your current environment: PROD
Your APIs URL: https://api.example.com/v1/customers
{{</ output >}}

## Conclusion

The information covered in this guide should help you start using environment variables on your Linux server. They can be strong tools for scripting, developing applications, and having a better time working in the shell overall.
