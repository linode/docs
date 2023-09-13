---
slug: how-to-add-linux-alias-command-in-bashrc-file
description: "Permanent Linux alias commands are saved to the shell configuration file for every new session you create. Here''s how that process works."
keywords: ["alias command bashrc"]
aliases: ['/quick-answers/linux/how-to-add-linux-alias-command-in-bashrc-file/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-11-06
modified_by:
  name: Heather Zoppetti
published: 2020-11-17
title: Adding the Linux alias Command in the .bashrc File
title_meta: "How to Add the Linux alias Command in the .bashrc File"
tags: ["linux"]
authors: ["Linode"]
---

The command line terminal is a convenient and fast tool for interfacing with the Linux operating system. However, you may find yourself sending the same commands again and again while issuing instructions to your system. This may cost you a significant amount of time, especially if your commands are lengthy, hard to remember, or just repetitive. To help save time and reduce frustration, aliasing commands can be used to create customizable shortcuts.

This guide covers two ways to alias commands:

*   [Creating a permanent alias](#permanent-alias) using the `alias` command.
*   [Creating a function for aliases](#function-alias-with-arguments) that can accept arguments.

## Permanent Alias

There are two ways to create aliases for your use, temporary and permanent. Temporary aliases are only available to use until you close your current terminal session. Permanent aliases are saved to the shell configuration file and are available for every new session you create.

Again, temporary aliases are only good for the current terminal session. Once you close that session, they are no longer available. To make them permanent, you can save your aliases in the shell configuration file. You can read more about temporary aliases in our general guide on aliases, [How to Use the Linux alias Command](/docs/guides/how-to-use-the-linux-alias-command/).

In the Bash shell, you can save aliases directly in a configuration file. There are several files you can save aliases to:

*   the main Bash configuration file `~/.bashrc`,
*   a Bash profile file `~/.bash_profile`,
*   the general shell profile file `~/.profile`,
*   or you can create a separate aliases file `~/.bash_aliases`.

### ~/.bashrc

The `~/.bashrc` file is the main configuration file for the Bash shell. When Bash is used as an interactive non-login shell, it uses the `~/.bashrc` file commands. The commands in this file are run every time a new shell is launched.

With your preferred text editor, open the configuration file. Enter one alias per line. While you can add your aliases anywhere in this file, grouping them together makes them easier to reference and adjust.

{{< file "~/.bashrc" >}}
...

#aliases
alias update="sudo apt update && sudo apt upgrade"
alias top="htop"

...
{{</ file >}}

Any newly added aliases are available for use in your next terminal session; they are not immediately available for any current sessions.

If you wish to use them right away in a current session, use the following command:

    source ~/.bashrc

### ~/.bash_profile

When Bash is used as an interactive login shell, `~/.bash_profile` is used. The commands in this file are only run once. This is useful for scripts that you want to run when first logging into your machine directly or via SSH. For scripts that you want to run for every new terminal window you open, use `~/.bashrc` instead. Typically, you would also place commands such as setting `$PATH` environment variables in `~/.bash_profile`; setting aliases in this file is common as well.

Setting aliases in `~/.bash_profile` is the same as setting them in `~/.bashrc`.

If you want all the commands in `~/.bashrc` to also be run at login, you can add the following lines to your `~/.bash_profile` file to ensure the `~/.bashrc` file is also run at startup.

{{< file "~/.bash_profile" >}}
...

if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi

...
{{</ file >}}

### ~/.profile

Commands in `~/.profile` are available to all shells and are not limited to the Bash shell. This file works just like the commands in the `~/.bash_profile` file.

If you find yourself using different shells or ever desire to change shells, put your aliases here.

### ~/.bash_aliases

If you have a lot of aliases, you may consider creating a separate file just for aliases called `~/.bash_aliases`. This is not a standard configuration file and it is not run by default. To run it you need to reference it from another Bash configuration file like `~/.bashrc`.

{{< file "~/.bashrc" >}}
...

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

...
{{</ file >}}

This `if` statement checks for a `~/.bash_aliases` file and runs its contents if the file is present.

If you already have a terminal session open, the aliases are not available until a new session is opened unless you run the following command:

    source ~/.bashrc

### Exception for MacOS

The macOS terminal app runs a login shell for each new terminal window. Therefore it runs the `~/.bash_profile` for each new terminal instance.

## Function Alias with Arguments

If you need to create an alias that accepts arguments, a Bash function is the way to go. These can be placed in any of the above mentioned files. The syntax can be either of the following:

    function_name () {
        command1
        command2
    }

This can also be written in one line. However, if you compress it as such, you must use semicolons after each command.

    function_name () { command1; command2; }

You can also write a Bash function like this:

    function function_name {
        command1
        command2
    }

To use the function with arguments, the syntax is function_name followed by arguments separated with spaces.

Let's make a simple function that changes into a specified directory and then lists the directory contents.

{{< file "~/.bashrc" >}}
...

function cdl {
    cd $1 && ls -lah
}

...
{{</ file >}}

  - The `$1` references the first argument. If you have a function that takes more than one, you use `$1`, `$2`, `$3`, etc. referencing arguments as they appear after the function name when you call the function from the command line.
  - The `&&` ensures that the `ls` command only runs if the `cd` command was successful. Feel free to use the `ls` options you prefer here.

To use this function open a new terminal; or, if you want to use an open terminal, you need to first source the shell with the following command:

    source ~/.bashrc

Then run the function with the following syntax:

    cdl /path/to/directory

You are changed into that directory and get a directory listing with common options with a single command.

These are a simplistic examples meant to illustrate what you can achieve with aliasing. Bash functions are powerful and allow you to do much more complex operations. For more on Bash shell scripting, see the guide series starting with [Introduction to Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/).
