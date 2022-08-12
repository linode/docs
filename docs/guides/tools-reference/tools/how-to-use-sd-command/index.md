---
slug: linux-sd-command
author:
  name: Nathaniel Stickman
description: "Learn how to use the sd command, an intuitive find-and-replace tool. It uses a standard regex syntax, and this among other features makes it an exceptional alternative to the sed command."
keywords: ['sd command','sed alternative','sd command linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-17
modified_by:
  name: Nathaniel Stickman
title: "Use the sd Command for Find and Replace on Linux"
h1_title: "How to Use the sd Command for Find and Replace on Linux"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[GitHub: chmln/sd](https://github.com/chmln/sd)'
---

`sd` is a command-line tool for finding and replacing text, similar to `sed`. But, unlike `sed`, `sd` focuses on substitution only, allowing it to use simpler and easier to read commands. `sd` also uses a common regex syntax, giving you more familiar, well-documented, and powerful search options.

In this guide you learn more about `sd` and how it compares to `sed`. You also learn how to install `sd` and get started using it on your Linux system.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What is sd?

`sd` is a find-and-replace tool that uses a common regular expression (regex) syntax. This makes `sd` adaptable to pretty much any text search need. `sd`'s common regex is popular and well-documented, so you also avoid the headaches of potentially quirky regex variants like the one used by `sed`.

For that reason, `sd` stands out as an alternative for the most common use of the `sed` command, finding and replacing text. And, by focusing exclusively on that function, `sd` additionally streamlines its command structure. `sd` commands are much more intuitive and readable than `sed` commands, letting you put more focus on constructing your search patterns.

`sd` was built using Rust, and, like many tools taking advantage of the Rust environment, it shows in `sd`'s remarkable performance. In the [developer's benchmarks](https://github.com/chmln/sd#benchmarks), `sd` handily outperforms `sed` on complex substitution tasks.

## How to Install sd

1. Install `gcc`.

    - On **Debian** and **Ubuntu**, you can do so with:

            sudo apt install build-essential

    - On **AlmaLinux**, **CentOS** (8 or later), and **Fedora**, use:

            sudo dnf install gcc

1. Install [Rust](https://www.rust-lang.org/), which includes the Cargo package manager used to install `sd`:

        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

    When prompted, select `1` for the default installation path.

1. Either restart your shell session (exiting and logging back in) or run the following command:

        source $HOME/.cargo/env

1. Install `sd` via the Cargo package manager:

        cargo install sd

1. You can then verify your installation with:

        sd --version

    {{< output >}}
sd 0.7.6
    {{< /output >}}

## How to Use sd

The `sd` command's syntax is straightforward. The sections below discuss the basics of using `sd`, and how its commands compare to `sed` commands. You also learn how you can take advantage of regex syntax in `sd` for more advanced searches.

### Basic Usage Compared to sed

Because it's only focused on finding and replacing strings, the essential syntax for `sd` is considerably simpler than the syntax for `sed`. In `sed`, here's what the skeleton of a substitution command looks like:

    sed -e 's/{string to find}/{string to substitute}/g'

Whereas, in `sd`, the same function works as follows:

    sd '{string to find}' '{string to substitute}'

The difference may not look too big, but `sed` only adds complexity as you start working with the actual strings. For instance, to substitute a literal URL with `sed`, you need the following commands:

    echo 'Learn about a great find-and-replace tool here: https://www.gnu.org/software/sed/manual/sed.html' \
    | sed -e 's/https\:\/\/www\.gnu\.org\/software\/sed\/manual\/sed\.html/https\:\/\/github\.com\/chmln\/sd/g'

{{< output >}}
Learn about a great find-and-replace tool here: https://github.com/chmln/sd
{{< /output >}}

You can use `sed`'s option to change delimiters, using a `,` instead of a `/`, as in:

    echo 'Learn about a great find-and-replace tool here: https://www.gnu.org/software/sed/manual/sed.html' \
    | sed -e 's,https://www.gnu.org/software/sed/manual/sed.html,https://github.com/chmln,g'

But the long, unbroken string still comes across as difficult to parse.

Meanwhile, the same substitution in `sd` is much more concise:

    echo 'Learn about a great find-and-replace tool here: https://www.gnu.org/software/sed/manual/sed.html' \
    | sd -s 'https://www.gnu.org/software/sed/manual/sed.html' 'https://github.com/chmln/sd'

The `-s` option tells `sd` to read the input strings literally, special characters and all. It's a great option for simple substitutions, when you don't need the robust power of regex.

### More Advanced Usage with Regex

Of course, use of a common regex syntax is one of the major advantages of `sd`. It allows for complicated and elegant search patterns with a widely-used and well-documented syntax, without particular quirks.

To give you a practical example, this guide uses a code file from the [NeoVim](https://github.com/neovim/neovim) project. You can use the following command to download the file and follow along:

    curl -O https://raw.githubusercontent.com/neovim/neovim/master/src/nvim/main.c

You can now have `sd` find all functions/methods that return `void` and that have their initial curly braces on a new line. Then, have `sd` move those curly braces onto the same line as the method declaration:

    cat nvim-main.c | sd '(void .*)\((.*)\).*\n\s*\{' '$1($2) {'

{{< output >}}
void event_init(void) {
// [...]
static void command_line_scan(mparm_T *parmpo) {
// [...]
static void check_swap_exists_action(void gogogo) {
// [...]
{{< /output >}}

Notice that the regex pattern above has several additional parentheses. These allow `sd` to select certain parts of the pattern for reuse in the replacement text. You can see these numbered `$1` and `$2` based on their order of occurrence.

The above pipes input text to `sd`, and `sd` outputs its results to the command line. This approach is great for trying out search patterns and seeing what works before committing to it.

But, when you're ready, you can easily have `sd` make its substitutions directly to the file, like this:

    sd '(void .*)\((.*)\).*\n\s*\{' '$1($2) {' main.c

Again for comparison, the equivalent of the above in `sed` comes out to:

    sed -i -e ':q;N;s/\(void .*\)(\(.*\)).*\n\s*{/\1(\2 gogogo) {/g' main.c

Which is not only significantly less readable, but also significantly different than standard regex patterns. Thus, more complicated search patterns in `sed` tend to take a lot more research and experimentation to get right. And the above `sed` command still fails to recognize many of the instances it was expected to.

## Conclusion

At its core, `sd` is simple and consistent, and yet also powerful and capable of handling a variety of complex substitutions. Because it uses common regex, you have a wealth of comments and documentation around to help you work out whatever patterns you need.

To get started learning more about regex syntax, take a look at the [regex cheat sheet](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet) provided by Mozilla.
