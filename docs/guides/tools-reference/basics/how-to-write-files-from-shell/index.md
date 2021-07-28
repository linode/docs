---
slug: write-to-a-file-from-the-shell
author:
  name: Linode Community
  email: docs@linode.com
description: "Want to be able to write and edit files right from the command line? This guide shows you convenient, built-in commands for doing just that. It even walks you through some practical examples to get you started."
og_description: "Want to be able to write and edit files right from the command line? This guide shows you convenient, built-in commands for doing just that. It even walks you through some practical examples to get you started."
keywords: ['shell write to file', 'append to file', 'bash write output to file', 'zsh write to file', 'write to file command', 'write variable to file']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-30
modified_by:
  name: Nathaniel Stickman
title: "Write to a File From the Shell"
h1_title: "How to Write to a File From the Shell"
enable_h1: true
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Here Documents](https://tldp.org/LDP/abs/html/here-docs.html)'
- '[Sed](https://www.gnu.org/software/sed/manual/sed.html)'
---

Sometimes, when working in the command line, it can be helpful to be able to write to files without needing to open an editor like Nano, or Vim. Fortunately, Linux has some handy operators and commands to make this simple and convenient.

This guide shows you key operators and commands for writing to files from the shell and walks you through how to use them. These work with Bash and Zsh as well as many other Unix shells, so they are good to know for almost any Linux environment.

## Write to a File

### The `>` Operator

The `>` operator can be used to write text to a file, and it creates the file if it does not exist already.

{{< caution >}}
Using the `>` operator on an existing file overwrites that file's contents.
{{< /caution >}}

Following is an example:

1. Write text to a file, creating the file in the process.

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

### The `>>` Operator

The `>>` operator works much like the `>` operator. It writes the preceding text to a designated file, creating the file if it does not already exist. However, the important distinction is that `>>` appends contents to an already existing file rather than overwriting them.

Following is an example:

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

## Use the Here Document Redirection

The [*Here Document* (Heredoc)](https://tldp.org/LDP/abs/html/here-docs.html) redirection allows you to easily give multi-line input to a shell command. This can be especially helpful for quickly writing multiple lines to a file without having to use multiple commands.

Here is an example of a Heredoc redirect that writes multiple lines to a file.

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

In the above command, the `<<` is the redirection operator, and the text immediately following it defines the delimiter. The command allows you to continue writing lines until it receives a line with the delimiter.

Once the lines have been given the closing delimiter, they are redirected to the command given before the `<<` operator. Above, this means that the lines are redirected to the `cat` command, which then writes the lines to a file using the `>` operator.

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

Notice that the above defines a different delimiter text and that a shell variable and command are also mixed in. In this case, the variable and the command get evaluated before the content is written to the file.

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

{{< file "example-heredoc.txt" >}}
These lines include the $PWD variable
and the $(date '+%m/%d/%Y') command
without evaluating either.
{{< /file >}}

## Advanced Editing with Sed

[Sed](https://www.gnu.org/software/sed/manual/sed.html) is a command-line stream editor, giving you access to advanced file writing features while still working from the shell.

The operators in the sections above give you ways to write files and append content to them. Sed, on the other hand, shines in the tools it provides for editing those files.

### Find and Replace

One of the most common uses for Sed is in replacing text in a file, as in this example, which edits the example file created in the Heredoc section above.

    sed -i 's/$PWD/$HOME/g' example-heredoc.txt

{{< file "example-heredoc.txt" >}}
These lines include the $HOME variable
and the $(date '+%m/%d/%Y') command
without evaluating either.
{{< /file >}}

The quoted portion of the command — the Sed expression — tells Sed to substitute (`s`) occurrences of `$PWD` with `$HOME`. The `g` tells Sed to replace all instances on each line.

The `-i` option has Sed write the changes in place, meaning directly to the file. Without this option, Sed simply outputs the results, which can be useful for trying out Sed commands before committing to them. You can also provide a backup extension with the `-i` option to have Sed back your file up before writing changes.

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

Sed can also delete lines for you. The syntax for determining which lines to delete is the same used for selecting lines. You just replace the `p` with `d` to have Sed delete the matching lines.

The following example combines a substitute expression with a delete expression and writes the results directly to the file.

    sed -i -e 's/either/it/g' -e '/date/d' example-heredoc.txt

{{< file "example-heredoc.txt" >}}
These lines include the $HOME variable
without evaluating it.
{{< /file >}}

## Conclusion

With the operators and commands above, you should be able to accomplish all of your file writing needs right from the command line.

More than that, they can be especially helpful when you need to work with files in Bash scripts and other shell scripts. If you are interested in learning more about Bash scripts, check out our [series of guides on Bash scripting](https://www.linode.com/docs/guides/development/bash/).
