---
slug: modifying-text-sed-regex
author:
  name: Lars Kotthoff
  email: lars@larsko.org
modified_by: Lars Kotthoff
description: 'This guide will give you a basic understanding of how to use sed and regular expressions to modify text from the command line and in scripts.'
og_description: 'This guide will give you a basic understanding of how to use sed and regular expressions to modify text from the command line and in scripts.'
keywords: ['linux','pipes','command line']
tags: ["linux","pipes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: "Changing Text with Sed"
h1_title: "Changing Text with Sed"
enable_h1: true
external_resources:
- '[Ubuntu Manual page for sed](https://manpages.ubuntu.com/manpages/focal/en/man1/sed.1.html)'
- '[Ubuntu Manual page for grep](https://manpages.ubuntu.com/manpages/focal/en/man1/grep.1.html)'
---

You have probably used `grep` to search for text in files and maybe complex regular expressions to find text that meets multiple requirements (e.g. "find words that start with capital letters at the beginning of a line"). There are many other tools that use these regular expressions; `sed` is one of them. While you can also use it to find text, much like `grep`, its main purpose is to modify text, and that's what you will have a look at in this guide. If you need a refresher on regular expressions, [the guide to filtering data using AWK](https://www.linode.com/docs/guides/filter-data-using-awk-regex/) has lots of examples and explanations.

## Working with Complex Text

Changing small amounts of text is often so straightforward that it is easiest to quickly do it with an editor of your choice, but there are cases when this is not easily possible. For example, consider the ASCII art/Markdown table below:

    | city           | state      | area code |
    |----------------|------------|-----------|
    | New york       | New york   | 718/212   |
    | San francisco  | California | 415       |
    | Chicago        | Illinois   | 773/312   |
    | Denver         | Colorado   | 720       |
    | Honolulu       | Hawaii     | 808       |

This table has a very specific structure that makes changing it difficult in a text editor, e.g. swapping two columns is a tedious task. This is true for many other text formats, e.g. CSV and TSV files. Ideally, a table like this would be automatically generated from a database and swapping columns a matter of swapping two values in the process that generates it, but sometimes all you have is the output.

First, let's have a look at what this table renders as in Markdown:

| city           | state      | area code |
|----------------|------------|-----------|
| New york       | New york   | 718/212   |
| San francisco  | California | 415       |
| Chicago        | Illinois   | 773/312   |
| Denver         | Colorado   | 720       |
| Honolulu       | Hawaii     | 808       |

## Replacing Words

As a warm-up, let's replace "Hawaii" with "Hawai'i", assuming that our Markdown table is in a file called "table.md":

    sed -e "s/Hawaii /Hawai'i/" table.md

You're telling `sed` to evaluate the expression given after `-e` for the file `table.md`, where the expression instructs `sed` to search (`s`) for `Hawaii ` (note the space at the end, which you want to delete in the replaced text to keep the formatting of the table) and replace it with `Hawai'i`. This will output the changed file. To change the file in place (without producing any output), you can give `sed` the `-i` flag.

So far so good, but this is very straightforward and can be done just as easily with a text editor. Let's move on to something more complex and realistic.

## Changing Text

You may have noticed that the capitalisation in our table is inconsistent and wrong in some cases, e.g. the "York" in "New York" should be capitalised. For this small example, it's easily fixed with a series of replacement commands like the above, but if the file was much larger with many more values, you don't want to keep iterating until you've fixed everything. Fortunately, you can use `sed` to capitalise each word, regardless of what it is:

    sed -e "s/\b\([A-Za-z']\+\)/\u\1/g" table.md

Let's take this apart. You are instructing `sed` to search for the regular expression `\b\([A-Za-z']\+\)` (the part after the `s/` and before the second `/`). `\b` is the regular expression for word boundary, i.e. any character that is not part of a word. This is followed by `\(`, which opens a so-called capture group. This does not match anything on its own, but instructs the regular expression engine to keep track of anything matched inside it for later reference (remember that you want to capitalise each word, regardless of what it is). Inside this group, you match one or more (`\+`) characters from the set `A-Za-z'`, so any upper- or lower-case letters, along with the apostrophe (to capture "Hawai'i"). Then you close the capture group with `\)`. Note that the backslashes in front of the opening and closing parentheses and the `+` sign are only required here because they have special meaning in the shell, and it you don't escape them with backslashes they will not be passed to `sed`.

### Capture Groups

You have matched individual words, now you need to change them. This is what the part of the `sed` expression after the second forward slash and before `/g`; `\u\1`. This instructs `sed` to take what's contained in the first capture group (`\1`, a backreference to the word you matched before) and change the first letter to upper-case (`\u`). That is, each word matched is replaced by a version of itself that has the first letter in upper-case. The `g` flag at the end of the `sed` expression instructs the regular expression engine to do this for each word on a line, not just the first one (`g` for "global").

Capture groups are a very powerful concept that allows us to "mark" arbitrary parts of text matched by a regular expression for later use when assembling replacement text. A regular expression can have any number of matching groups (although in `sed` you can use only the first 9 in backreferences) and they can be nested arbitrarily.

Note that this requires the GNU version of `sed` to work; if you are on Mac OS X or FreeBSD, this will not work. The `\u` expression to upper-case letters is not supported in the non-GNU version of `sed`.

Our table now looks like this:

| City           | State      | Area Code |
|----------------|------------|-----------|
| New York       | New York   | 718/212   |
| San Francisco  | California | 415       |
| Chicago        | Illinois   | 773/312   |
| Denver         | Colorado   | 720       |
| Honolulu       | Hawai'i    | 808       |

## Swapping Columns

Finally, let's swap the first two columns of our table, which would be very tedious in a text editor. With `sed` and what you've learned so far, it's straightforward:

    sed -e "s/|\([^|]\+\)|\([^|]\+\)|/|\2|\1|/" table.md

You need two capture groups here, one for each column. You want to swap them, i.e. output the second capture group followed by the first. This is what our replacement expression (between the second and third forward slash) does -- `\2` followed by `\1`, with `|` characters outside and in between. The regular expression part has two identical capture groups, `\([^|]\+\)`, also with `|` characters outside and in between. It matches a group of at least one (`\+`) character that is not a `|` character, as that would indicate the start of the next column (`[^|]`, using the `^` at the start of a character class to instruct the regular expression engine to match everything except this character). Other columns can be matched and swapped similarly.

And here is the final table:

| State      | City           | Area Code |
|------------|----------------|-----------|
| New York   | New York       | 718/212   |
| California | San Francisco  | 415       |
| Illinois   | Chicago        | 773/312   |
| Colorado   | Denver         | 720       |
| Hawai'i    | Honolulu       | 808       |
