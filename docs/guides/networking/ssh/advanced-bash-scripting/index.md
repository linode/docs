---
slug: guide-to-advanced-bash-scripting-part-2
author:
  name: Linode Community
  email: docs@linode.com
description: 'The part two series of the advanced bash scripting guide expands on the previous Bash guides. In this guide, you learn advanced bash scripting, commands, debugging, and more.'
keywords: ['Advanced bash scripting', 'Bash expressions', 'Bash functions', 'bash aliases', 'Bash debugging']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-03
modified_by:
  name: Linode
title: "Guide to Advanced Bash Scripting Part 2"
h1_title: "Part 2: A Software Engineer's Guide to Advanced Bash Scripting"
enable_h1: true
contributor:
  name: John Mueller
external_resources:
- '[GNU Bash](https://www.gnu.org/software/bash/)'
- '[Debugging Bash scripts](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_02_03.html)'
---

The previous part of this guide, **Guide to Advanced Bash Scripting: Part 1**, describes the advanced Bash scripting concepts of Bash functions, list constructs, arrays, aliases, and regular expressions. The second part of this series explains even more advanced topics that include here documents, Bash I/O redirection, subshells, restricted shells, process substitution, indirect references, and network programming. You also discover some Bash debugging techniques. Make sure you get the basics down ([Introduction to Bash Shell Scripting](/docs/guides/intro-bash-shell-scripting/)) and work through some of the more common tasks found in any scripting language ([An Intermediate Guide to Bash Scripting](/docs/guides/an-intermediate-guide-to-bash-scripting/)) before you tackle this guide.

## I/O Redirection

Bash I/O redirection captures output from a file, command, program, script, or even code blocks within a script to perform additional processing by sending it as input to another file, command, program, or script. You can use I/O redirection directly at the command prompt; placing it in a Bash I/O redirection script merely automates the process. This avoids you to repeat typing all those long code sequences. To get an idea of how I/O redirection works, type `ls -lR > dirlist.txt` at the command prompt and press **Enter**. The `>` operator performs I/O redirection by taking the output of `ls` and sending it to `dirlist.txt` after truncating any content currently found in `dirlist.txt`. When you type `cat dirlist.txt` and press **Enter**, you see that `dirlist.txt` contains a directory listing of the current directory. The Bash equivalent of these actions is:

    #!/bin/bash

    ls -lR > dirlist.txt
    cat dirlist.txt

    exit

{{< note >}}
Bash script doesn’t contain anything different from what you typed at the command line. If you want to append the new content to the file rather than truncate it, use the `>>` operator instead. Appending the output allows you to perform multiple commands and place all of the content in a single file.
{{< /note >}}

You can also use the pipe (`|`) operator in your scripts to redirect output from one program to another program, and then finally into a file if desired. For example, the script below creates a listing of file sizes and filenames. It then sorts them in file size order and sends the result to `dirlist.txt`. The result is sent to the display.

{{< file "example.sh" bash >}}
#!/bin/bash

ls -h -s | sort > dirlist.txt
cat dirlist.txt

exit
{{< /file >}}

Linux supports three default files: stdin (the keyboard), stdout (the display), and stderr (error output to the display). Files have a number between 0 and 9 associated with them where stdin is file 0, stdout is file 1, and stderr is file 2. Knowing the number for a particular default file can have redirection advantages. For example, the following script redirects the stderr output to a file instead of the display so that you can detect any issues with running commands later. Following is an example of file redirection that creates an error log:

{{< file "example_file_redirection.sh" bash >}}
#!/bin/bash

echo "Test 1"
ls -lR 2>error.log > dirlist.txt
cat error.log
cat dirlist.txt

echo
echo "Test 2"
ls *.x 2>>error.log > dirlist.txt
cat error.log
cat dirlist.txt

exit

{{< /file >}}

The example performs two tests: one that doesn’t produce an error and another that does (unless you have files with a `.x` extension). In each case, the example outputs the error log first, then the directory. Always append to an error log when running a script using the `>>` operator or any new error information is overwritten. Error logs help in debugging Bash scripts. During the second run, the output looks like the following. This shows that there is an error and that the `dirlist.txt` file is empty as a result (displaying a cat error message):

{{< output >}}
Test 2
ls: cannot access '*.x': No such file or directory
root@localhost:~/myprojectdir/bash_scripts# cat error_redirect.sh
{{< /output >}}

## Here Documents

A *here* document is a specialized code block that feeds a command list using a form of input I/O redirection to an interactive program or a command, such as FTP or `cat`. You can employ them with text editors such as Vi or to send broadcast messages with commands like `wall`. Following is an example of a script that works with `wall` command:

{{< file "example_here_document.sh" bash >}}
#!/bin/bash

# This comment line is not printed.

wall << AMessage
Submit all vacation requests to your manager today!
# Note: 'wall' prints comment lines within the message.
AMessage

# This comment line is not printed either.

exit

{{< /file >}}

The example above sends a message string to `wall` named `AMessage`. The message begins and ends with `AMessage` as shown. `Wall` prints any text, including comments, that appear between the starting, and ending `AMessage` entries, so exercise care as to where you put comments in the script file.

## Process Substitution

You use process substitution to feed the output of one or more processes into the `stdin` of another process. This is an especially useful technique when you have multiple commands to feed into `stdin`. The process is akin to I/O redirection, but you rely on the `<` operator instead of using the `|` operator. In addition, the `|` operator is limited to sending the output of just one process to another process, whereas process substitution allows piping of multiple processes to the `stdin` of a single process as shown below:

    #!/bin/bash

    comm <(ls -l) <(ls -al)

    exit

In this case, the script compares the output of two different directory listing commands using the `comm` command. The `stdin` of `comm` receives both outputs, not just one.


## Subshells, and Restricted Shells and Subshells

A shell is a specialized piece of software that takes input, determines what the input intends, and then runs any tasks requested by the input. A subshell is a shell that is running as a subprocess of another shell. The subshell allows the performance of tasks in parallel with the host shell. A restricted shell or subshell is a kind of shell or subshell with constraints placed on it to ensure that the environment is more secure than normal. You use parentheses within a Bash script to create a subshell like:

    #!/bin/bash

    echo "Subshell level OUTSIDE subshell = $BASH_SUBSHELL"
    (
        echo "Subshell level INSIDE subshell = $BASH_SUBSHELL"
        (
            echo "A subshell within a subshell LEVEL = $BASH_SUBSHELL"
        )
    )

    exit

It’s possible to nest subshells as deeply as needed to perform various tasks in parallel. Each level is nested within a pair of parentheses as shown in the example above. Even though Bash doesn’t require it, indenting the code makes it easier for humans to see the nesting level and doesn’t affect the output. Following is the output from this example:

    Subshell level OUTSIDE subshell = 0
    Subshell level INSIDE subshell = 1
    A subshell within a subshell LEVEL = 2

Whenever you run a script or create a subshell, the associated shell or subshell has the same rights and privileges as the parent environment. You can change this behavior to enforce security within your scripts by using Bash-restricted shells and subshells. Following is an example of a Bash restricted shell:

{{< file "bash_restricted_shell_example.sh" bash >}}
#!/bin/bash

# Change the working directory.
cur_dir=$(pwd)
pwd
cd ..
pwd
cd $cur_dir
pwd

# Try to change the working directory with restrictions in place.
set -r
cd ..
pwd
cd

exit
{{< /file >}}

In the example above, the first set of commands to change and restore the working directory work fine because there are no restrictions. However, after issuing the set `-r` command, any attempt to change the working directory fails. The restrictions affect these actions within the script:

- Using `cd` to change the working directory
- Changing the values of the `$PATH`, `$SHELL`, `$BASH_ENV`, or `$ENV` environment variables
- Reading or modifying the `$SHELLOPTS` environment variable
- Output redirection
- Invoking external commands that don’t appear in the current directory and aren’t on the `PATH`
- Using the `exec` command to create a new shell
- Employing any command to subvert any of the Bash restrictions
- Exiting restricted mode

The last restriction is why you may want to use `set -r` in a subshell, rather than the shell itself. The restrictions remain in place while the subshell runs, but aren’t in place for the actual shell, so you can perform sensitive tasks within the subshell and then return to normal operations.


## Indirect References

An indirect reference occurs when a Bash script retrieves the value pointed to by another value. The easiest way to understand this concept is through the following script:

    #!/bin/bash

    a="Hello"
    b=a

    echo "a = $a"
    echo "b = $b"
    eval b=\$$b
    echo "b now = $b"

    exit

In the example above, `a` begins by containing the value "Hello" and `b` points to (contains the name of) `a`. When you initially output the two variables, you see the expected results. However, when you run `eval` on `b` to obtain an indirect reference (`\$$`) to `a`, the content of `b` changes to that of `a`. Following is the output from the script above:

{{< output >}}
a = Hello
b = a
b now = Hello
{{< /output >}}

## Network Programming

A script uses network programming techniques and tools to access, manipulate and troubleshoot network connections. For example, the following script displays a list of TCP connections for the current system:

    #!/bin/bash

    lsof "-ni" | grep TCP | grep -v LISTEN

    exit

The example relies on the list of open files (lsof) command to display a list of open network files that rely on the TCP protocol.

## Debugging

Every script of any complexity contains bugs of some sort, even if those bugs relate to differences in perspective between the developer and user. A bug occurs any time the script behaves in a manner that conflicts with its original design parameters. Removing bugs from scripts is termed *debugging*. The Guide to Advanced Bash Scripting series provides you with some ideas on how to debug your scripts using techniques like logging. In addition, you have the traditional methods of checking variable values using `echo`. By echoing variable values at various points during script execution, you can see where inappropriate changes take place. Bash also provides the following switches to use when debugging Bash scripts:

- `set -f`: Disables filename generation using metacharacters (globbing)
- `set -v`: Outputs shell lines as Bash reads them in verbose mode
- `set -x`: Prints command traces before Bash executes a command

To understand how these switches work, add them to the various examples in this guide. For example, when you add `set -v` to the script in the [Indirect References](/docs/guides/guide-to-advanced-bash-scripting-part-2/#indirect-references) section of the article, the output changes to look like the following (with each command printed along with the outputs):

{{< output >}}
a="Hello"
b=a

echo "a = $a"
a = Hello
echo "b = $b"
b = a
eval b=\$$b
b=$a
echo "b now = $b"
b now = Hello

Exit
{{< /output >}}

## Conclusion

You can do a great deal more with here documents, I/O redirection, subshells, restricted shells, process substitution, indirect references, and network programming than what you see here. However, you now know the essentials. The [GNU Bash](https://www.gnu.org/software/bash/) resource provides you with a great deal more information about the wonders of working with Bash scripting. Some sites specialize in [debugging Bash scripts](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_02_03.html).
