---
slug: write-to-a-file-from-the-shell
description: "This guide shows you convenient and built-in commands for writing to a file direct from the shell, and walks you through some practical examples to get you started."
keywords: ['shell write to file', 'append to file', 'bash write output to file', 'zsh write to file', 'write to file command', 'write variable to file']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-12
image: HowtoWritetoaFileFromtheShell.jpg
modified_by:
  name: Nathaniel Stickman
title: "Write to a File From the Shell"
title_meta: "How to Write to a File From the Shell"
external_resources:
- '[Here Documents](https://tldp.org/LDP/abs/html/here-docs.html)'
- '[Sed](https://www.gnu.org/software/sed/manual/sed.html)'
authors: ["Nathaniel Stickman"]
---

When working from the command line, it can be convenient to write to files without the need to open a text editor like [Nano](/docs/guides/use-nano-to-edit-files-in-linux/), or Vim. There are some handy Linux operators and commands to make writing to files simple to accomplish. This guide shows you how to use key operators and commands to write to files from the shell. These commands work with [Bash](/docs/guides/intro-bash-shell-scripting/#bash-basics), [Zsh](https://www.zsh.org/) shells, and several other Unix shells.

## Writing to a File Using Redirection Operators

### The Regular Output Operator (`>`)

You can use the regular output operator (`>`) to write text to a file. If it does not exist already, it creates the file.

{{< note type="alert" respectIndent=false >}}
Using the `>` operator on an existing file overwrites that file's contents.
{{< /note >}}

Follow the steps below to learn how to use the `>` operator:

1. Issue the following command to write the text to a file. The command creates the file in the process.

        echo "This text is written to a file." > example-single-arrow.txt

    You can verify the file's contents using the `cat` command.

        cat example-single-arrow.txt

    {{< output >}}
This text is written to a file.
    {{< /output >}}

1. Write text to the same file again, and observe that the previous contents are overwritten.

        echo "This text overwrites the file's contents." > example-single-arrow.txt
        cat example-single-arrow.txt

    {{< output >}}
This text overwrites the file's contents.
    {{< /output >}}

### The Append Operator (`>>`)

The append operator (`>>`) works much like the regular output operator. It writes text you pass to it to a designated file, creating the file if it does not already exist. However, the important distinction is that `>>` appends contents to an already existing file rather than overwriting them.

Follow the steps below to learn how to use the `>>` operator:

1. Write text to a new file, creating the file in the process.

        echo "This text is written to a file." >> example-double-arrow.txt
        cat example-double-arrow.txt

    {{< output >}}
This text is written to a file.
    {{< /output >}}

1. Append additional text to the end of the file.

        echo "This text is appended to the file." >> example-double-arrow.txt
        cat example-double-arrow.txt

    {{< output >}}
This text is written to a file.
This text is appended to the file.
    {{< /output >}}

## Use Here Document (Heredoc) Redirection

[*Here Document* (Heredoc)](https://tldp.org/LDP/abs/html/here-docs.html) redirection allows you to pass multiline input to a shell command. This method helps you bypass the need to issue multiple commands when writing multiple lines to a file.

Below is an example of a heredoc redirect that writes multiple lines to a file.

    cat > example-heredoc.txt <<EOF
    These
    lines
    are
    written
    to
    a
    new
    file.
    EOF

In the above command, the `<<` is the redirection operator, and the text immediately following it defines the delimiter (`EOF`). The command allows you to continue writing lines until it receives a line with the delimiter.

Once the lines have been given the closing delimiter, they are redirected to the command given before the `<<` operator. In the example above, this means that the lines are redirected to the `cat` command, which then writes the lines to a file using the `>` operator.

    cat example-heredoc.txt

{{< output >}}
These
lines
are
written
to
a
new
file.
{{< /output >}}

You can also use the Heredoc redirect to append lines to an existing file by using the `>>` operator after the `cat` command instead of the `>` operator:

    cat >> example-heredoc.txt <<END

    These additional lines to the file in $PWD
    were added on $(date '+%m/%d/%Y').
    END

The above command defines different delimiter text, uses a shell variable, and the `date` command. In this case, the variable and the command get evaluated before the content is written to the file.

    cat example-heredoc.txt

{{< output >}}
These
lines
are
written
to
a
new
file.

These additional lines to the file in /home/example-user
were added on 06/30/2021.
{{< /output >}}

You can also prevent the Heredoc redirect from evaluating variables and commands by using quotes (single or double) around your delimiter definition.

    cat > example-heredoc.txt << "EOF"
    These lines include the $PWD variable
    and the $(date '+%m/%d/%Y') command
    without evaluating either.
    EOF

In this case, the `example-heredoc.txt` file contains the text of the unevaluated commands.

{{< file "example-heredoc.txt" >}}
These lines include the $PWD variable
and the $(date '+%m/%d/%Y') command
without evaluating either.
{{< /file >}}

## Advanced Editing with Sed

[Sed](/docs/guides/manipulate-text-from-the-command-line-with-sed/) is a command-line stream editor that gives you access to advanced file writing features while still working from the shell.

The operators in the sections above give you ways to write to files and append content to them. Sed can write to files, but also provides powerful tools for editing and manipulating files.

### Find and Replace

One of the most common uses for Sed is to replace text in a file. The example below edits the `example-heredoc.txt` file created in the Heredoc section above.

    sed -i 's/$PWD/$HOME/g' example-heredoc.txt

{{< file "example-heredoc.txt" >}}
These lines include the $HOME variable
and the $(date '+%m/%d/%Y') command
without evaluating either.
{{< /file >}}

The quoted portion of the command is the Sed expression. It tells Sed to substitute (`s`) occurrences of `$PWD` with `$HOME`. The `g` tells Sed to replace all instances on each line.

The `-i` option has Sed write the changes in place, meaning directly to the file. Without this option, Sed simply outputs the results. Omitting the `-i` option can be useful to try out Sed commands before committing to them. You can also provide a backup extension with the `-i` option to have Sed back your file up before writing changes.

    sed -i'.bak' 's/$PWD/$HOME/g' example-heredoc.txt

### Select Lines

You can also use Sed to select lines, which you can do by line number or by line contents.

For instance, the command below selects and outputs the third line of the file.

    sed -n '3p' example-heredoc.txt

{{< output >}}
without evaluating either.
{{< /output >}}

The `p` in the Sed expression tells Sed to print the line. Normally, Sed outputs all lines from the file, so the `-n` option is necessary here to have Sed only output the selected line.

You can select a range of lines by separating the beginning and ending line numbers with a comma.

    sed -n '1,2p' example-heredoc.txt

{{< output >}}
These lines include the $HOME variable
and the $(date '+%m/%d/%Y') command
{{< /output >}}

Selecting and outputting a line based on the text it contains works similarly.

    sed -n '/date/p' example-heredoc.txt

{{< output >}}
and the $(date '+%m/%d/%Y') command
{{< /output >}}

Finally, Sed also accepts multiple expressions, using the `-e` option before each expression.

    sed -n -e '1p' -e '/date/p' example-heredoc.txt

{{< output >}}
These lines include the $HOME variable
and the $(date '+%m/%d/%Y') command
{{< /output >}}

### Delete Lines

Sed can also delete lines for you. The syntax for determining which lines to delete is the same used for selecting lines. Replace the `p` portion of the command with `d` to have Sed delete the matching lines.

The following example combines a substitute expression with a delete expression and writes the results directly to the file.

    sed -i -e 's/either/it/g' -e '/date/d' example-heredoc.txt

{{< file "example-heredoc.txt" >}}
These lines include the $HOME variable
without evaluating it.
{{< /file >}}

## Conclusion

With the redirect operators and Sed commands above, you should be able to write to files directly right from the command line. The operators and commands used in this guide are also helpful when you need to work with files in Bash scripts and other shell scripts. If you are interested in learning more about Bash scripts, check out our [series of guides on Bash scripting](/docs/guides/development/bash/).
