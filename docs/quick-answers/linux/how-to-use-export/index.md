---
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: 'This Quick Answer guide will explain how to use export.'
keywords: ["linux", "how to", "export"]
aliases: ['quick-answers/how-to-use-export/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-06-08
modified_by:
  name: Linode
published: 2020-06-08
title: How to Use Export
h1_title: Using the export Command
---
Export command is used to pass variables to other processes.

When you open a new terminal session you set environment variables for the process. At any time if you change any of the variable values, the terminal does not pick that change. The export command updates the current terminal session about the change you made to the exported variable. You don’t have to open a new terminal session to use the value of the variable that you changed.

## Use Export command to pass variables

The following sections provide examples for using the most frequently used options with the command:

   -  `-p` : to list of all names that are exported in the current shell
   -  `-f` : to export names as functions
   -  `name[=value]`: to assign value before exporting
   -  `-n` : to remove names from export list

### List all variables

To view all the variables that are exported use the following command:

    export

  The output is similar to:

    declare -x HOME="/home/linode"
    declare -x LANG="C"
    declare -x LC_CTYPE="UTF-8"
    declare -x LOGNAME="Linode"
    declare -x MAIL="/var/mail/linode"
    declare -x OLDPWD
    declare -x PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/games"
    declare -x PWD="/home/linode"
    declare -x SHELL="/bin/bash"
    declare -x SHLVL="1"
    declare -x SSH_AGENT_PID="3277"
    declare -x SSH_AUTH_SOCK="/tmp/ssh-fbzHXgAEgf3I/agent.3239"
    declare -x SSH_TTY="/dev/pts/0"
    declare -x TERM="xterm-256color"
    declare -x USER="linode"

### List variables in the current terminal

To view all the variables exported in the current terminal:

    export -p

  The output is similar to:

    declare -x HOME="/home/linode"
    declare -x LANG="C"
    declare -x LANGUAGE="US_en"
    declare -x LOGNAME="Linode"
    declare -x MAIL="/var/mail/linode"
    declare -x OLDPWD
    declare -x PATH="/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/usr/local/sbin:/usr/games"
    declare -x PWD="/home/linode"
    declare -x SHELL="/bin/bash"
    declare -x SHLVL="1"
    declare -x SSH_AGENT_PID="3277"
    declare -x SSH_AUTH_SOCK="/tmp/ssh-fbzHXgAEgf3I/agent.3239"
    declare -x SSH_TTY="/dev/pts/0"
    declare -x TERM="xterm-256color"
    declare -x USER="linode"


### Export names as functions

To export names as functions use the following command syntax:

    export -f < function_name >

   If you do not use the option `-f` the names is treated as variables.

   Example:

   1. Export a function called `name`:

        name() { echo "Linode"; }

        export -f name

      To verify that the function is exported type:

        name

      The output is:

        Linode

   1. Change the value of the function `name`:

        name() { echo "Linode_Test"; }

      To verify that the value is passed:

        name

      The output is:

        Linode_Test

### Assign values before exporting

To assign values before exporting:

   Example:

   1. To set the `JAVA_HOME` variable:

        export JAVA_HOME=/usr/java/jre1.8.0_04

   1. To verify that the value is exported:

        export -p

     The following line appears in the output of the list of variables:

        declare -x JAVA_HOME="/usr/java/jre1.8.0_04"

### Remove a named variable or function

To remove named variables or functions from the export list:

   Example:

   1. To remove `JAVA_HOME` from the list:

        export -n JAVA_HOME
        export -p

      The following lines **does not** appear in the output of the list of variables:

        declare -x JAVA_HOME="/usr/java/jre1.8.0_04"
