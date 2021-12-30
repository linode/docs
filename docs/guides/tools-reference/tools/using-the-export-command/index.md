---
slug: using-the-export-command
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: "This Quick Answer guide explains how to use the export command to view terminal variables, how to assign variable values, and how to pass functions to other processes."
keywords: ["linux", "how to", "export"]
aliases: ['quick-answers/how-to-use-export/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-12-30
modified_by:
  name: Linode
published: 2021-12-30
title: "How to Use the Export Command"
h1_title: "Using the Export Command"
enable_h1: true
---

The **export** command is used to pass variables to other processes. When you open a new terminal session, you set environment variables for the process. If you change any of those defined variable values, the terminal does not automatically pick up that change. The export command updates the current terminal session with the change you made to the exported variable. You don’t have to open a new terminal session to use the value of the variable that you changed.

{{<note>}}
For more details on environmental variables in Linux (including using the export command), see the [Setting and Using Linux Environment Variables](/docs/guides/how-to-set-linux-environment-variables/) guide.
{{</note>}}

## Export Command Options

The following sections provide examples for using the most frequently used options with the command:

   -  `-p` : to list of all names that are exported in the current shell
   -  `-f` : to export names as functions
   -  `name[=value]`: to assign value before exporting
   -  `-n` : to remove names from export list

## Export a New Variable

To export a variable, run the following command. Replace *[variable]* with the name you'd like to give your new variable and *[value]* with its value.

    export [variable]=[value]

In the example below, we'll create a variable named `JAVA_HOME` and assign it the path to our java directory:

    export JAVA_HOME=/usr/java/jre1.8.0_04

## List All Variables

To view all the variables that are exported use the following command:

    export

The output is similar to:

{{< output >}}
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
{{</ output >}}

## List Variables in the Current Terminal Session

To view all the variables exported in the current terminal:

    export -p

The output is similar to:

{{< output >}}
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
{{</ output >}}

## Export Names as Functions

To export names as functions, use the following command syntax. Replace *[function_name]* with the name you'd like to give (or have given) to the function.

    export -f [function_name]

If you do not use the option `-f`, the names are treated as variables.

### Create a New Function

Export a function called `name`:

    name() { echo "Linode"; }
    export -f name

To verify that the function is exported type:

    name

The output is:

{{< output >}}
Linode
{{</ output >}}

### Update an Existing Function

Change the value of the function `name`:

    name() { echo "Linode_Test"; }

To verify that the value is passed:

    name

The output is:

{{< output >}}
Linode_Test
{{</ output >}}

### Remove a Named Variable or Function

To remove named variables or functions from the export list, run the following command. Replace *[variable]* with the name of the variable you'd like to remove.

    export -n [variable]

For example, to remove the `JAVA_HOME` variable, run:

    export -n JAVA_HOME