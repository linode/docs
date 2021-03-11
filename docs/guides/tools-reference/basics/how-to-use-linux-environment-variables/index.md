---
slug: how-to-use-linux-environment-variables
author:
  name: Linode Community
  email: docs@linode.com
description: 'Environment variables store configuration and other information about your Linux shell environment. They can even store information for use in scripts and applications. This guide helps you understand how these variables work and how you can make use of them.'
og_description: 'Environment variables store configuration and other information about your Linux shell environment. They can even store information for use in scripts and applications. This guide helps you understand how these variables work and how you can make use of them.'
keywords: ['shell','bash','environment variables','command line','terminal','shell scripting']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-10
modified_by:
  name: Nathaniel Stickman
title: "How to Set Up and Use Linux Environment Variables"
h1_title: "How to Set Up and Use Linux Environment Variables"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

Your Linux shell maintains an environment where configuration and other information is stored in environment variables. Accessing these variables can be useful when working with shell commands. More than that, you can add your own environment variables, which can be used by your scripts and applications.

This guide walks you through the fundamentals of accessing, creating, and using environment variables. By the end, you should have the knowledge to make your own variables and use them on your server.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Difference Between Environment and Shell Variables

This guide is focused on environment variables, but throughout there are references to shell variables. It helps to get a quick overview of each kind of variable.

**Environment variables** apply to a shell session and all of its children. That means you can reference an environment variable from any shell or process spawned from the shell session. Environment variables can be readily used by scripts and applications.

**Shell variables**, meanwhile, apply only to the current shell. Spawned shells and processes do not have access to their parents' shell variables. These variables are useful when you only need to store values temporarily. An example is when you want an easy way to reference a path while running a series of shell commands.

## Viewing Environment Variables

1. Use the following command to view a list of environment variables applicable to the current user:

        printenv

1. You can use the command below to get a more comprehensive list. This list includes not only environment variables but also shell variables and functions:

        set

1. The `printenv` command can also be used to see the value of a specific environment variable. Just pass the variable — `HOME` in this example — as an argument to the command:

        printenv HOME

1. You can also use the `echo` command to output a variable's value. This works for both environment variables and shell variables:

        echo $HOME

    Most shell commands require that you preface variables with the `$` symbol. The exceptions are environment-related commands like `printenv` and `set`, seen above, and `export` and `unset`, shown further on below.

## Assigning Variables

1. Assign an environment variable using the `export` command. This example creates a variable called `EXAMPLE_VARIABLE` and assigns it the value `Example value`:

        export EXAMPLE_VARIABLE='Example value'

    Alternatively, you can create a shell variable first and then export it as an environment variable. Shell variables are created in the same manner as environment variables but without the `export` command. This example results in the same environment variable as the example above:

        EXAMPLE_VARIABLE='Example value'
        export EXAMPLE_VARIABLE

1. Environment variables can be assigned list values, with each item separated by a colon:

        export EXAMPLE_VARIABLE=/path/to/first/location:/path/to/second/location

1. You can also append new items to lists. The following example does so with the `PATH` variable, adding the `example-directory` from the user's home directory:

        export PATH=$PATH:$HOME/example-directory

    `PATH` is a default environment variable defining directories where your shell looks for executables. It is the variable that lets you run an executable without having to specify its path.

1. The `unset` command removes a designated environment or shell variable from the session. This example removes the `EXAMPLE_VARIABLE`:

        unset EXAMPLE_VARIABLE

## Persisting Environment Variables

The above create environment variables temporarily — the variables dissolve with the shell session. But often you want to make these variables persistent between sessions — maybe even between users. To do so, you need to add the appropriate `export` command to one of the shell configuration files.

The locations of these configuration files vary based on the kind of shell you are using. Because Bash is the default shell on most popular Linux distributions, the examples that follow assume you are using it. But there are other shells out there, and you may need to modify these steps accordingly. You can usually check what shell you are using via the `SHELL` environment variable:

    echo $SHELL

1. Most often, the environment variables only need to exist for the current user. In this case, add the `export` command for the variable to the `~/.bashrc` file. The example that follows appends the user's `example-directory` to the `PATH` variable:

    {{< file "~/.bashrc" >}}
export PATH=$PATH:$HOME/example-directory
    {{< /file >}}

1. If the environment variable needs to be available for all users, create a custom shell script (`.sh`) file in the `/etc/profile.d` directory. In this example, the `EXAMPLE_VARIABLE` is added to the `custom.sh` file:

    {{< file "/etc/profile.d/custom.sh">}}
export EXAMPLE_VARIABLE='Example value'
    {{< /file >}}

    {{< note >}}
You can, instead, add environment variables to the `/etc/profile` or the `/etc/bashrc` file. However, doing so is not recommended because your variables could be affected, possibly wiped, by upgrades to the shell package.
    {{< /note >}}

## Useful Default Environment Variables

Several environment variables are automatically set at login. A few of these can be especially helpful. The selection here aims to give some usage examples for the most commonly used of these environment variables.

1. The `USER` variable provides the name of the current user. You can use this to easily insert the current username in shell commands.

    As an example, the commands below create a PostgreSQL super user with the same username as the current Linux user:

        sudo -u postgres createuser $USER
        sudo -u postgres psql -c "alter user $USER with superuser" postgres

    {{< note >}}
The `USER` variable provides the current username even while using `sudo`. For instance, if logged in as `example-user`, the above commands result in a PostgreSQL user named `example-user`, not `root`.
    {{< /note >}}

1. The `PWD` variable provides your current working directory. (PWD stands for "Print Working Directory.") This variable provides a convenient shorthand when working with files and directories.

    The example below copies an `example-directory` from the current directory by first assigning the `PWD` value to a shell variable then changing to the destination directory:

        TEMP_PWD=$PWD
        cd path/to/destination
        cp -r $TEMP_PWD/example-directory $PWD

1. The `HOME` variable gives the location of the current user's home directory. Generally, you can use the `~` shorthand instead when you are working in the shell. However, the `HOME` variable can be useful in shell scripting, where you are more likely to encounter cases that do not support the shorthand.

    This example shell script adds a log entry to a file. If the directory for the file does not already exist, the script creates it. The `echo` line automatically creates the file if necessary, but only if the directory already exists:

    {{< file example-script.sh >}}
#!/bin/bash

DIRECTORY=$HOME/example-directory
FILE=$DIRECTORY/example-file.log
DATETIME=`date`

if [ ! -f "$DIRECTORY" ]; then
    mkdir $DIRECTORY
fi

echo "Log entry: $DATETIME" >> $FILE
    {{< /file >}}

## Using Environment Variables in Application Development

In application development, environment variables come in handy for distinguishing between application environments and storing authentication credentials. Keeping this application information in environment variables not only makes it easier to manage but is also often more secure than using application files.

The following steps illustrate a simple use case. Here, the environment variables distinguish between test and production application environments and store the database credentials for each.

{{< note >}}
The example application code below uses a pseudocode loosely based on Python. It needs to be adjusted according to the language you are using for your application.
{{< /note >}}

1. Initially, the application needs to be configured for testing. Here, the configuration is set up in the `/etc/profile.d/example-application.sh` file.

    The best approach is to ensure that changing environments changes as few variables as possible and does not require changes in the application. For that reason, the example here sets up credentials for both test and production and provides an `APP_ENV` variable that can act as a switch:

    {{< file "/etc/profile.d/example-application.sh" >}}
export APP_ENV="TEST"

export APP_TEST_DB_HOST="example-test-db-host"
export APP_TEST_DB_USERNAME="example-test-db-username"
export APP_TEST_DB_PASSWORD="example-test-db-password"

export APP_PROD_DB_HOST="example-prod-db-host"
export APP_PROD_DB_USERNAME="example-prod-db-username"
export APP_PROD_DB_PASSWORD="example-prod-db-password"
    {{< /file >}}

1. The application reads the `APP_ENV` variable and fetches the credentials from the appropriate variables. This method makes the application environment agnostic — whatever the environment is set to, the application responds appropriately:

    {{< file main.code >}}
import os

app_environment = "APP_" + os.environment["APP_ENV"]

app_db_host = os.environment[app_environment + "_DB_HOST"]
app_db_username = os.environment[app_environment + "_DB_username"]
app_db_password = os.environment[app_environment + "_DB_password"]
    {{< /file >}}

1. When it comes time to change to a production environment, just change the `APP_ENV` variable to "PROD":

    {{< file "/etc/profile.d/example-application.sh" >}}
export APP_ENV="PROD"
    {{< /file >}}

## Conclusion

With the information above, you should be off to a good start for using environment variables on your Linux server. Used well, they can be strong tools for scripting, developing applications, and having a better time working in the shell overall.
