---
slug: linux-cat-command
description: "The cat command is one of the most frequently used commands in Linux, noteworthy for its versatility for viewing and creating file contents. Get your introduction to this must-know tool in this tutorial, covering everything you need to start using the Linux cat command."
keywords: ['linux cat command','cat linux','what is cat command linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-16
modified_by:
  name: Nathaniel Stickman
title: "The Linux cat Command"
external_resources:
- '[phoenixNAP: How to Use Linux Cat Command (with Examples)](https://phoenixnap.com/kb/linux-cat-command)'
- '[Tecmint: 13 Basic Cat Command Examples in Linux](https://www.tecmint.com/13-basic-cat-command-examples-in-linux/)'
- '[GeeksforGeeks: Cat Command in Linux with Examples](https://www.geeksforgeeks.org/cat-command-in-linux-with-examples/)'
authors: ["Nathaniel Stickman"]
---

You may sometimes find yourself wanting to quickly view text files from the command line. The most frequently used tool for doing so is the *cat* command. Short for "con*cat*enate," the command shows the contents of text files as output to the command line.

But the *cat* command also comes with numerous options for how files are displayed and even for creating files and manipulating their contents. This makes it more than just a simple file-viewing tool. It is all around a powerful command for working with files without leaving the command prompt.

Better still, *cat* is part of the GNU core utilities — typically distributed as `coreutils` — and so it comes by default on almost every Linux distribution.

In this guide, you learn how to start working effectively with this popular and useful command. See what the *cat* command is and what it is capable of, from viewing files to creating them.

## How to View File Contents with cat

One of the most common uses for *cat* is viewing the contents of files. These next sections show you how you can use *cat* to output text from files.

These examples uses the text files and contents created in the next section. So look ahead if you want to see how to create these files to follow along.

### View a Single File

The *cat* command can take a filename as input, and it outputs the file's text contents as a result.

    cat example-file.txt

{{< output >}}
This is text is an example file.
{{< /output >}}

For long files, the output can be difficult to navigate. Fortunately, there is a built-in solution with Linux that is covered in this guide.

### View Multiple Files

One of the perks of *cat* is that it can readily adapt its commands for multiple files. This means, for one, that you can output the contents of multiple files simultaneously.

The *cat* command for doing this is similar to the command for a single file. You simply provide multiple filenames instead of just one filename as shown in the command below:

    cat example-file.txt another-example-file.txt

{{< output >}}
This is text is an example file.
Another example file, with more text.
{{< /output >}}

### Manage the cat View Using more and less Commands

As noted above, the output from *cat* can become cumbersome with large files, or when working with multiple files with significant amounts of content.

To help navigate the output from *cat*, you can pipe the results into the *less* command. *Less* is a built-in Linux command that makes long results scrollable using the arrow keys.

    cat example-file.txt | less

You can exit *less*, stopping the output from *cat*, by pressing the **Q** key.

## How to Create a New File With cat

You can use the *cat* command to create a file from scratch. Doing so uses the `>` symbol followed by the filename:

    cat > example-file.txt

Once this command is issued, *cat* prompts the user to enter some text. Pressing the **Ctrl** + **D** keys after a new line (**Enter**) completes the text entry and fills the newly created file with the entered text.

    This is text is an example file.

The same symbol, `>`, can also be used to create a new file out of an existing one, using *cat* to copy the contents of the file. This works by redirecting the output from first file's contents into a new file.

The example below uses the *cat* command to redirect or copy the `example-file.txt` file's contents into a new file, `another-example-file.txt`:

    cat example-file.txt > another-example-file.txt
    cat another-example-file.txt

{{< output >}}
This is text is an example file.
{{< /output >}}

The same can be accomplished with the contents of multiple files. The *cat* command takes the output of those files as a continuous text and redirects, or copies, those contents into a new file.

Here, the *echo* command changes the content of the `another-example-file.txt` created above. Then, the *cat* command copies the contents of `example-file.txt` and `another-example-file.txt` together into the new `bigger-example-file.txt`:

    echo "Another example file, with more text." > another-example-file.txt
    cat example-file.txt another-example-file.txt > bigger-example-file.txt
    cat bigger-example-file.txt

{{< output >}}
This is text is an example file.
Another example file, with more text.
{{< /output >}}

## How to Append Text to a File With cat

The *cat* command can be similarly used to append lines of text to existing files. This uses the `>>` symbol followed by the filename.

    cat >> example-file.txt

Like with the process of creating a new file from scratch, the *cat* command prompts the user to enter text after issuing the command. Pressing the **Ctrl** + **D** keys after a new line (*Enter*) completes the text entry and adds the entered text to the end of the file.

    One more line of text to the example file.

Also like with creating a file, this same feature can be used to redirect the contents of one file to another. In this case, you can use the `>>` symbol to copy text from one file and append it to the end of another file.

    cat example-file.txt >> another-example-file.txt
    cat another-example-file.txt

{{< output >}}
Another example file, with more text.
This is text is an example file.
One more line of text to the example file.
{{< /output >}}

The same can be done with multiple files, just by listing the filenames before the `>>` symbol. The files' outputs are concatenated, and then the collective result is added to the end of the designated file — in this case, `bigger-example-file.txt` as shown in the example below:

    cat example-file.txt another-example-file.txt >> bigger-example-file.txt
    cat bigger-example-file.txt

{{< output >}}
This is text is an example file.
Another example file, with more text.
This is text is an example file.
One more line of text to the example file.
Another example file, with more text.
This is text is an example file.
One more line of text to the example file.
{{< /output >}}

## How to Apply Display Options in cat

The *cat* command comes with several display options. These alter how the output is presented, which can make files easier to read or can fit specific use cases.

{{< note respectIndent=false >}}
These options affect the contents of files created (using `>`) or appended to (using `>>`) with the *cat* command. They modify the output of *cat*, and that output is what *cat* uses to give files content.

For instance, take a case where you use the option for line numbers below (`-n`) while copying the contents of `example-file.txt` to a new file. This results in the line numbers being saved as part of the contents of the new file.
{{< /note >}}

- Show line numbers in *cat* output using the `-n` option. With this option, *cat* displays each line with spaces and the line number at the beginning:

        cat -n example-file.txt

  {{< output >}}
1	This is text is an example file.
2	One more line of text to the example file.
  {{< /output >}}

- Show line-ending markers for *cat* output using the `-e` option. This has *cat* print a `$` symbol at the end of each line.

        cat -e example-file.txt

    {{< output >}}
This is text is an example file.$
One more line of text to the example file.$
    {{< /output >}}

- Show tabs as `^I` symbols using the `-t` option. You can see this by adding a line with a tab to the `example-file.txt`.

        cat >> example-file.txt
        This is a line	with a tab.

    Then, view the file with *cat* using the `-t` option:

        cat -t example-file.txt

    {{< output >}}
This is text is an example file.
One more line of text to the example file.
This is a line^Iwith a tab.
    {{< /output >}}

- Show the text with repeated blank lines removed by using the `-s` option. To see this, add several consecutive blank lines to the `example-file.txt` using the append function in the *cat* command.

        cat >> example-file.txt

    Then, use the `-s` option when viewing the file via *cat* to see the file without the repeated blank lines. The output should show one blank line rather than several consecutive blank lines.

        cat -s example-file.txt

    {{< output >}}
This is text is an example file.
One more line of text to the example file.
This is a line	with a tab.

    {{< /output >}}

## Conclusion

This guide gave you the know-how you need to start using *cat* for viewing and even working with text-based files from the command line. Having a good basis in this frequently-used Linux command can make working with files on the command line smoother and easier.