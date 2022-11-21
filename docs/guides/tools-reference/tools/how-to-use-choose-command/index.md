---
slug: use-linux-choose-command
author:
  name: Nathaniel Stickman
description: "In this guide, learn about the Linux choose command. It’s a fast and intuitive alternative to other command-line tools for text processing like awk and cut."
keywords: ['awk command unix','linux text processing commands','linux cut command']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-30
modified_by:
  name: Nathaniel Stickman
title: "Use the choose Command for Text Processing on Linux"
h1_title: "How to Use the choose Command for Text Processing on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
---

`choose` offers command-line text processing, like `cut` and `awk`, but with an emphasis on making the basics simple and intuitive. This Linux command is built on Rust, so it has fast performance. This guide shows you how to get started using the `choose` command on your Linux system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is the Linux choose Command?

`choose` is a command-line text processing tool, similar to `cut` and `awk`. But where those two tools are very powerful text and data processing tools, `choose` focuses on being a simpler solution for most everyday text-processing tasks.

Compared to `cut`, `choose` has a more intuitive syntax, letting you generate text selections quickly. Likewise, for basic, everyday tasks, `choose` comes with a much lower syntactic overhead than `awk`. In short, `choose` doesn't come with features to replace everything you can do in `cut` and `awk`. But, if you're reaching for a tool for basic text processing, `choose` is quicker to pick up and gives you a smoother experience.

Moreover, `choose` is built on Rust which gives it exceptional performance. It comes in faster than both of its counterparts, making it a great choice for long files and other cases when performance is crucial.

## How to Install choose

1. Install `gcc`.

    - On **Debian** and **Ubuntu**, you can do so with:

            sudo apt install build-essential

    - On **AlmaLinux** and **CentOS** (8 or later), use:

            sudo dnf install gcc

1. Install [Rust](https://www.rust-lang.org/). The Rust installation includes the Cargo package manager, which you will use to install `choose`:

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    When prompted, select `1` for the default installation path.

1. Either restart your shell session (exiting and logging back in) or run the following command:

        source $HOME/.cargo/env

1. Install `choose` via the Cargo package manager:

        cargo install choose

1. You can then verify your installation with the following command:

        choose --version

    {{< output >}}
choose 1.3.3
    {{< /output >}}

## How to Use the choose Command

`choose` is meant to be a tool that's easy to pick up when you need it, without the need to do research and extensive experimenting to get your syntax right. The next sections show you what you need to know to get started using `choose`.

### The Linux choose Command vs. AWK and cut

To pick out pieces of text with `choose`, provide the indices for the words you want. Like `awk`, `choose` uses the space character as a delimiter for the input text by default:

    echo 'With this text, we conduct a test of various command-line text-processing tools' | choose 0 10

{{< output >}}
With text-processing
{{< /output >}}

`choose` is different from the other tools here in that it starts its count at `0`. But, otherwise, you can see that it works similarly to `awk` in this case. The `awk` command just requires more boilerplate:

    echo 'With this text, we conduct a test of various command-line text-processing tools' | awk '{print $1,$11}'

For this kind of text selection, `cut`, on the other hand, requires you to explicitly define the delimiter and use a flag before giving word indices:

    echo 'With this text, we conduct a test of various command-line text-processing tools' | cut -d " " -f 1,11

The divide between the commands' syntaxes grows as the needs get a little more complex. The example below demonstrates the syntax for selecting a range using the `choose` command. `choose`'s syntax takes inspiration from Python's slice syntax, so `-1` refers to the last word, `-2` to the next-to-the-last word, etc.:

    echo 'With this text, we conduct a test of various command-line text-processing tools' |choose 4:-1

{{< output >}}
conduct a test of various command-line text-processing tools
{{< /output >}}

Meanwhile, `awk` doesn't come with a simple way of selecting a range. You need to either indicate each index in the range (e.g., `5,6,7,8,9,10,11,12`) or use a conditional loop like the following one:

    echo 'With this text, we conduct a test of various command-line text-processing tools' | awk '{for(i=5;i<=NF;i++) printf $i" "; print ""}'

The syntax for `cut` is simpler, but still not as intuitive as the `choose` command. Moreover, `cut` doesn't support a means for moving backwards, to select the next-to-last word, for instance:

    echo 'With this text, we conduct a test of various command-line
    text-processing tools' |
    cut -d " " -f 5-

With `choose`, it's also straightforward to combine the concepts above into a simple and, again, intuitive command to recombine text, like so:

    echo 'With this text, we conduct a test of various command-line text-processing tools' | choose 0 10 4:-3 -1

{{< output >}}
With text-processing conduct a test of various command-line tools
{{< /output >}}

### The choose Command's Syntax

As mentioned above, `choose`'s syntax takes inspiration from Python's slice syntax. Its brevity and consistency make it an intuitive system once you get the fundamentals down. Once you're familiar with `choose`, you can apply it to a wide range of circumstances without having to consult the documentation again.

The list below includes a run down of some core elements of the `choose` command's syntax.

- The index begins at `0`. This means that, to select the first word of each line, use `choose 0`, and, to select the second, use `choose 1`, etc.

- The `:` character is used to define a range. Thus, `choose 0:4` selects the first five words of each line.

- Negative numbers let you move backward through the text. The last word in a line is `-1`, the next-to-last word is `-2`, etc. So, a command like `choose -5:-1` selects the last five words of each line.

### Advanced choose Command Examples and Options

While `choose` doesn't provide the complex features offered by `cut` and `awk`, it does have some options to give you a bit more control. Here, the guide takes a look at some of these while providing you with some more advanced examples of how you can use `choose`.

These examples use the CSV file shown below, which lets you see how `choose` handles custom delimiters as well as multi-line content:

{{< file "example-text.csv" csv >}}
first,second,third,fourth,fifth,sixth,seventh,eighth,ninth,tenth
21,30,37,3,22,2,20,16,11
19,39,20,31,25,16,40,11,32
3,25,34,16,10,4,6,28,38
27,6,20,40,18,41,3,9,7
8,36,38,1,5,26,7,1,27
35,22,12,19,29,24,2,27,33
28,8,37,37,14,14,15,19,2
12,26,6,19,37,41,10,21,18
12,41,9,10,8,39,4,29,15
{{< /file >}}

With `choose`, you can use the `-f` flag to define the delimiter to use on your input text. For a CSV file like this, typically this would be a `,`:

    cat example-text.csv | choose -f ',' 5:8

{{< output >}}
sixth seventh eighth ninth
2 20 16 11
16 40 11 32
4 6 28 38
41 3 9 7
26 7 1 27
24 2 27 33
14 15 19 2
41 10 21 18
39 4 29 15
{{< /output >}}

`choose` also includes the `-o` flag to define the output delimiter, which is used in the next example to make the output easier to read:

    cat example-text.csv | choose -f ',' -o '\t\t' 0 5

{{< output >}}
first		sixth
21		2
19		16
3		4
27		41
8		26
35		24
28		14
12		41
12		39
{{< /output >}}

As you can see from the example above, `choose` allows regular expression (regex) syntax when you're defining delimiters. This gives you helpful and easy access to any character set you can specify in regex.

If you want the ranges in `choose` to be exclusive, you can use the `-x` option. Doing so, the last index given (`8` in the example below) is actually excluded from the results:

    cat example-text.csv | choose -f ',' -o '\t\t' -x 5:8

{{< output >}}
sixth		seventh		eighth
2		20		16
16		40		11
4		6		28
41		3		9
26		7		1
24		2		27
14		15		19
41		10		21
39		4		29
{{< /output >}}

## Conclusion

If you want to see more examples or learn more about the project, check out the [GitHub page for `choose`](https://github.com/theryangeary/choose).
