---
slug: how-to-use-echo
description: 'This quick answer guide explains how to use the echo command to view values, how to write to a file using the command, and how to use echo with other commands.'
keywords: ["linux", "how to", "echo"]
aliases: ['quick-answers/how-to-use-echo/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified_by:
  name: Linode
published: 2021-03-05
image: UseEchoCommand.png
title: Using the echo Command
title_meta: How to Use Echo
tags: ["linux"]
authors: ["Rajakavitha Kodhandapani"]
---

## What Is the Echo Command?

The `echo` command is you can use in the terminal to display the text or string that is passed to it as an argument.

When you assign a value to the variable and would like to know the value that you assigned to the variable, you can use the echo command. As the name suggests, the command echoes the text or string that you want it to display. You can also use the echo command to display the files or directories, write to a file, or use it with other commands.

## Use Echo command to pass arguments

The following sections provide examples for using the most frequently used options with the command:

   -  `-e` : to display the text in different formats
   -  `*` : to display files or directories
   -  `-n` : to remove the new line that trails when displaying the arguments

### Display the text or strings

To display text or a string you can use the echo command with the following options:

  - \a: Sound alert. This generates the default alert sound.

        echo -e "\aLinode"

    The output is (with a sound alert):

        Linode

  - \b: Writes a backspace character.

        echo -e "This is a\bLinode Server"

    The output is:

        This is Linode Server

  - \c: Abandons any further output.

        echo -e "This is a Linode \c Server"

    The output is similar to:

         This is a Linode [user@linode /]$

  - \e: Writes an escape character.

        echo -e "This is a dollar $\eSign"

    The output is:

        This is a dollar $ign

  - \f: Writes a form feed character.

        echo -e "The next page is: \f page2"

    The output is:

        The next page is:
                   page2

  - \n: Writes a new line.

        echo -e "This is a \nLinode Server"

    The output is:

        This is a
        Linode Server

  - \r: Writes a carriage return. In other words, it overwrites the value that is printed.

        echo -e "Server \r Linode"

    The output is:

        Linode

  - \t: Writes a horizontal tab.

        echo -e "This is a \tLinode Server"

    The output is:

        This is a 	Linode Server

  - \v: Writes a vertical tab.

        echo -e "This is a \vLinode Server"

    The output is:

        This is a
                  Linode Server
  - \\: Writes a backslash character.

        echo -e This is a backslash \\

    The output is:

        This is a backslash \

### Remove the trailing space
To remove the trailing space you can use the following command:

      echo -n "remove trailing space"

The output is similar to:

      remove trailing space[user@linode /]$


### List the files or directories

To view all the files and folders you can use the echo command as follows:

        echo *

  The output is similar to:

      bin boot dev etc home lib lib64 lost+found media mnt opt proc root run sbin srv swapdir sys tmp usr var

You can also use the echo command to list the files and directories that begin with *b* by using ``` echo b*```. To list the files of a particular format, use ``` echo *.txt``` .

### Writing to files

You can also use the echo command to write content to the files.

For example, to write some content to a `log.txt` file, you can use the following command:

      echo "Logfile started: $(date +'%D %T')" > log.txt

  To view the content of the file:

      cat log.txt

  The output is:

      Logfile started: 03/01/21 20:17:59


### Other commands with echo

You can also echo commands with other commands.

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

