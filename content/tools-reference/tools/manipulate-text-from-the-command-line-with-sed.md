---
author:
  name: Linode
  email: docs@linode.com
description: 'Practical examples for using sed to transform text files and streams.'
keywords: ["sed", "find and replace", "regular expression", "unix"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/sed/']
modified: 2017-03-23
modified_by:
  name: Linode
published: 2010-07-01
title: Manipulate Text from the Command Line with sed
external_resources:
 - '[Administration Basics](/docs/using-linux/administration-basics)'
---

The traditional Unix utility `sed` makes it possible to manipulate strings and streams of text from the command line without using a text editing application. `sed` is useful in a number of different contexts, including finding and replacing strings of text in a large number of files, manipulating text for [Stack Scripts](http://linode.com/stackscripts/) and other kinds of scripts, as well as a component in basic shell scripting.

![Manipulate Text from the Command Line with sed](/docs/assets/manipulate_text_from_the_command_line_with_sed.png "Manipulate Text from the Command Line with sed")

This document provides a gentle overview of `sed` usage, accompanied by a number of practical applications of `sed`. If you find this guide helpful, please consider our guide to [basic administration practices](/docs/using-linux/administration-basics) or the rest of the [Tools & Reference section](/docs/tools-reference/).

## Using Sed

In this guide, `sed` refers to recent versions of "GNU sed" which are included by default in all images provided by Linode, and as part of the common "base" selection of packages provided in nearly all distributions of Linux-based operating systems.

### The Sed Command

`sed` commands take a particular form. Consider the following example:

    sed -i -r 's/^(billy|tom)@.*example\.org/\1@example.com/' ~/roster.txt

This command begins with the invocation (`sed`) followed by the `-i` option. `-i` allows sed to perform the modification "in place" on the file specified. The `-r` option forces `sed` to use an extended regular syntax. The next argument enclosed in single quotes (e.g. `'`) specifies the "substitution" or search and replace function. The final term of a `sed` command specifies the file object that the substitution function will be applied to.

`sed` can also be used to modify streams of text rather than files, so often a command might take the form of:

    cat ~/input-file | sed -r 's/^(billy|tom)@.*example\.org/\1@example.com/' > ~/output-file

In this case, the contents of the stream of data which is created by running the `cat` command on the `~/input-file` is filtered through the `sed` operation. The result is written to the `~/output-file`. Generally, the left-hand side of the pipe would contain some other form of input, but you do not need to `cat` files into `sed` as the above command is equivalent to the following:

    sed -r 's/^(billy|tom)@.*example\.org/\1@example.com/' ~/input-file > ~/output-file

Unless otherwise directed, `sed` will output the transformed text to standard output.

### Sed Substitutions

The basic `'s///'` form provides the core of `sed` functionality in common use. The `s` indicates that the script will perform a substitution. The next character introduces a character to separate the "find" and "replace" strings and to terminate the substitution script. By convention the separation characters are `/` characters, but in cases where you are searching for data that contains `/` characters, it is possible to use another separating character. Thus, the following two strings are functionally identical:

    's/look for \/ characters/I found several \//'
    's;look for / characters;I found several /;'

Sed uses regular expressions in the "search" part of the substitution syntax. Most characters in regular expressions match with input data literally; however, there are some sequences that carry special significance. If you want to match these characters literally you can use the escape character `\` to transform the *next* character into a literal match. Consider the following characters with special significance in `sed` substitution scripts:

-   The `.` symbol matches any character.
-   The `*` symbol causes the character immediately proceeding this character to successfully match to *zero* or more instances of that character in the data set.
-   The `+` symbol causes the character immediately proceeding this character to successfully match to *one* or more instances of that character in the data set.
-   Square brackets (`[]`) enclose a set of characters that match against any member of the set of specified characters. When prefaced with a caret, as in `[^abc]`, it matches *none* of the characters specified in the set.
-   Parenthetical characters (left `(` or right `)`) both allow you to write more complex expressions and also create "captures" that allow you to use sequences from the matched text in the replacement string. Captured sequences are available in the order that they were captured with `\[number]` where `[number]` corresponds to the number of the capture.
-   The `^` character matches the beginning of a line.
-   The `$` character matches the end of a line.
-   The `\` character, as previously stated, escapes the following character for literal matching if it caries additional meaning.
-   The `|` character provides an "OR" operator, so the sequence `^(www|ftp)\.` would match a line that began with the characters `www` or `ftp`.

While these characters provide the foundation of writing matching patterns, there are other significant characters and powerful matching abstractions. Documenting the full capabilities of the `sed` regular expression syntax is beyond the scope of this guide; however you can learn more about `sed` commands using the `info sed` command.

## Finding and Replacing Strings within files Using Sed

In some cases, the "in place" substitution with the `-i` argument provides the desired behavior. However, if you want to test a sed operation, or provide a "safety net", consider the following command:

    sed -r -i.bak 's/example/example/g' ~/roster.txt

In this case, the existing file is copied to `~/roster.txt.bak` and the replacements are made automatically to `~/roster.txt`. If you want to reverse the changes, issue a command similar to `mv ~/roster.txt.bak ~/roster.txt`.

The `g` option appended to the substitution statement sets a "global" mode that forces `sed` to replace multiple instances of the match on the same line.

## Changing File Extensions with Sed

It's possible to use `sed` to modify streams of text in shell scripts. Consider the following bash function:

{{< file "bash function" bash >}}
txt2text (){
    for i in `ls -1`
    do
        mv $i `echo $i | sed 's/.*\.txt$/.text/'`
    done
}

{{< /file >}}


When this function is called, the following operations are performed: for every item `i` (the file names in the current directory,) the move command (`mv`) is issued with the existing file name and the old file name filtered through a `sed` function. The `sed` function matches for the string of characters `.txt` at the end of the file name, and replaces that with `.text`. If the sed script fails to match, the original file name will be output and the move will fail.

## Deleting Lines From Files Using Sed

Consider the following expression:

    sed -i '56d' ~/.ssh/known_hosts

In this command, the 56th line of the ssh "known hosts" file will be deleted. Commands in this form are useful for deleting a host key for a host that has changed from the `known_hosts` file, as is the case after redeploying a system or moving an IP or domain to a new host.
