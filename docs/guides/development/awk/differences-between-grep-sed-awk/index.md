---
slug: differences-between-grep-sed-awk
author:
  name: Andy Lester
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-02
modified_by:
  name: Linode
title: "Differences Between Grep Sed Awk"
h1_title: "h1 title displayed in the guide."
enable_h1: true
contributor:
  name: Andy Lester
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Grep, Sed, and AWK are all standard Linux tools that work with text files in the filesystem.  They share a number of similarities.  Each of these tools operates on text files line-by-line and uses the power of regular expressions

However, they differ in complexity and their basic use cases. Grep is used for finding data, and is the simplest of the three. Sed finds and modifies data and is a bit more complex than grep. AWK finds and calculates based on data and is the most complex of the three.

This guide looks at each tool in turn, and provides common cases for when you would use each.

## Grep

Grep is used to find lines of text in files or input streams, and report on what it finds.

### Grep: Searching a Log File for Errors

Grep’s most common use is to search for a text pattern in a file, such as specific text in a log file. To find all the errors in the /blog directory in an Nginx error log, you could use:

    grep /blog /var/log/nginx/error.log

And get back results like this (lines have been shortened for display):

{{< output >}}
2021/03/15 19:45:06 [error] 18071#18071: *387537 open() "/srv/blog/favicon.ico" failed (2: No such file or directory)...
2021/03/15 19:45:06 [error] 18071#18071: *387537 open() "/srv/blog/apple-touch-icon.png" failed (2: No such file or directory)...
2021/03/15 19:45:06 [error] 18071#18071: *387537 open() "/srv/blog/apple-touch-icon-precomposed.png" failed (2: No such file or directory)...
2021/03/15 19:57:42 [error] 18071#18071: *387665 "/srv/blog/feed/index.html" is not found (2: No such file or directory)...
{{< /output >}}

In most Linux distributions, the search term is highlighted, so the "/blog" that grep found shows up in red.

You can specify multiple files for grep to search, and it shows the name of the file that each line is found in.

    grep /blog /var/log/nginx/error.log*

{{< output >}}
 /var/log/nginx/error.log-20210315:2021/03/15 02:17:46 [error] 18071#18071: *373750 "/srv/blog/tag/ruby/index.html" ...
/var/log/nginx/error.log-20210315:2021/03/15 02:38:25 [error] 18071#18071: *373959 "/srv/blog/2013/11/how-to-talk-...
/var/log/nginx/error.log-20210315:2021/03/15 02:45:30 [error] 18071#18071: *374070 open() "/srv/blog/favicon.ico" ...
{{< /output >}}

When you specify the `-h` option, grep also shows the line number of each line within the file:

    grep /blog -h /var/log/nginx/error.log*

{{< output >}}
/var/log/nginx/error.log-20210315:2458:2021/03/15 02:17:46 [error] 18071#18071: *373750 "/srv/blog/tag/ruby/index.html" ...
/var/log/nginx/error.log-20210315:2474:2021/03/15 02:38:25 [error] 18071#18071: *373959 "/srv/blog/2013/11/how-to-talk-...
/var/log/nginx/error.log-20210315:2486:2021/03/15 02:45:30 [error] 18071#18071: *374070 open() "/srv/blog/favicon.ico" ...
{{< /output >}}

### Grep: Recursive Search Through Trees of Text

Just as most Linux distributions have the matching search term highlighted to stand out, the filename and line numbers are usually highlighted in different colors.

Grep can search through trees of files with the `-R` option.  When you specify a starting directory and the `-R` option, grep searches through all the files in that directory.  If you want to find all the places in your blog posts where you mention the bash shell, you could use:

    grep bash blog/2019/ -R

{{< output >}}
blog/2019/08/22/ack-3-1-0-allows-searching-ranges/index.html:        <a class="next" href="/2019/10/02/bash-color-prompt-hostname/">Update your bash prompt to give each hostname a different color &raquo;</a>
blog/2019/08/22/ack-3-1-0-allows-searching-ranges/index.html:        <a class="next" href="/2019/10/02/bash-color-prompt-hostname/">Update your bash prompt to give each hostname a different color &raquo;</a>
blog/2019/10/02/bash-color-prompt-hostname/index.html:  <title>Update your bash prompt to give each hostname a different color</title>
blog/2019/10/02/bash-color-prompt-hostname/index.html:  <meta name="description" content="
{{< /output >}}

Sometimes you're only interested in what files had the text in then, and don't need to see what matching lines are.  The `-l` option tells grep to only show the filenames that contain the pattern that you pass to the command:

    grep bash blog/2019/ -R -l

{{< output >}}
blog/2019/08/22/ack-3-1-0-allows-searching-ranges/index.html
blog/2019/10/02/bash-color-prompt-hostname/index.html
blog/2019/10/31/tab-completion-for-ssh-scp/index.html
blog/2019/12/29/ack-3-3-0/index.html
{{< /output >}}

### Grep: View Context from Surrounding Lines of Text

Sometimes when searching for data in files, it's not just the line of data that matters but also the lines around it.  Say you're looking for all the
<h1>, <h2> or <h3> tags in a file of HTML.  You could call grep like this:

    grep '<h[123]' products.html

{{< output >}}
<h1>
<h2>
<h2>
<h2>
{{< /output >}}

The results aren't very useful because the text contained by the tag is on the next line in the file.

Call grep again with the `-A2` option, which prints the 2 lines after the match.

    grep '<h[123]' -A2 products.html

{{< output >}}
    <h1>
            Products We Carry
    </h1>
--
        <h2>
            Widgets
        </h2>
--
        <h2>
            Doodads
        </h2>
--
        <h2>
            Thingamabobs
        </h2>

{{< /output >}}

Similarly, you can use the `-B` option to show a number of lines before the match, and the -C option to show lines both before and after the match.

### Grep: List Files That Match a Pattern

One of the best uses for grep doesn't involve showing matches.  It's common to use grep to find a list of files that match a given pattern.  Say you wanted to find all the HTML files in a directory that contain the string "copyright", but you don't need to see the actual text being matched. Grep's `-l` option does that.

    grep -l -i copyright *.html

{{< output >}}
about.html
index.html
products.html
{{< /output >}}

Grep can also find files that do NOT match a pattern.  To find all the files that don't match the string "copyright" use the `-L` option:

    grep -L -i copyright *.html

{{< output >}}
contact.html
how-to-buy.html
{{< /output >}}

With the ability to create a list of files using `-l` you can use grep to perform complex searches.  Say you want to find all the files that have both the pattern "dogs" and the pattern "cats" somewhere in the file, although not necessarily on the same line.

To get a list of HTML files with the word "dogs" you use:

    grep -l dogs *.html

Then, you use the Linux shell to tell grep to search that list of files for the word "cats".

    grep -l cats $(grep -l dogs *.html)

This searches all the "dogs" files for "cats", giving you a list of files that contain both.

## Sed

Sed is short for Stream Editor and has much of the same functionality as grep, but is much more flexible in how it can select lines of input.  It lets you modify the data it finds.

It opens a file, reads it line by line, and acts on each line according to its instructions. Sed’s syntax can seem cryptic, but it's logical and well-defined. Once you're used to it you'll be able to save yourself hours of time.

### Sed Search and Replace

The most common use of sed is a search and replace operation for strings or patterns throughout a file.  For instance, to replace every instance of "Copyright 2020" in one of your HTML files to "Copyright 2021", you  use:

    sed -e's/Copyright 2020/Copyright 2021/g' index.html > modified.html

The `-e` option gives sed the instructions it should run on each line in the file.  In this case, the `s` is the command to substitute the first string, "Copyright 2020", with the second string "Copyright 2021". The modified output goes to the file `modified.html`.

To modify files in place, use the `-i` option.  You can tell sed to make a backup copy of the files it modifies by specifying an extension with the `-i` option, as in `-i.bak`.

Sed has the power of regular expressions, so to replace all occurrences of "Copyright 20XX", where the "XX" is any two digits, with "Copyright 2021",
in all your .html files, you would use:

    sed -e's/Copyright 20[0-9][0-9]/Copyright 2021/g' -i.bak *.html

### Create a Sed Program in a File

When your sed programs become too big to fit in the `-e` option, sed can accept sets of instructions from a program file.  For example, you might have many replacements you want to make, so you could put them in a file:

    replacements.sed

    s/I should of/I should have/;
    s/supposably/supposedly/;
    s/mute point/moot point/;
    s/one in the same/one and the same/;

Apply the changes to all your text files with:

    sed =f replacements.sed -i.bak *.txt







