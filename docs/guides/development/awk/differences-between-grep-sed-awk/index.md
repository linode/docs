---
slug: differences-between-grep-sed-awk
author:
  name: Andy Lester
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['difference between sed awk grep']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-02
modified_by:
  name: Linode
title: "The Differences Between Grep, sed, and AWK"
h1_title: "An Introduction to the Differences Between Grep, sed, and AWK"
enable_h1: true
contributor:
  name: Andy Lester
---

Grep, Sed, and AWK are all standard Linux tools that work with text files in the filesystem. They share a number of similarities. Each of these tools operates on text files line-by-line and uses the power of regular expressions

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

### Create a Sed Script

When your sed programs become too big to fit in the `-e` option, sed can accept sets of instructions from a program file. For example, you might have many replacements you want to make, so you could put them in a file named `replacements.sed` and add the following contents:

{{< file "replacements.sed" >}}
s/I should of/I should have/;
s/supposably/supposedly/;
s/mute point/moot point/;
s/one in the same/one and the same/;
{{< /file >}}

Apply the changes to all your text files with the following command:

    sed -f replacements.sed -i.bak *.txt

### Sed: Inserting, Appending, and Deleting Lines

Sed can insert and append lines in files. In the context of Sed, "insert" means to put a line before a given line, and "append" means after.

For example, to put a dividing line of equals signs before and after every line with the word "TOTALS", create a file named `totals.sed` with the following contents:

{{< file "totals.sed" >}}
/TOTALS/ i\
==================================

/TOTALS/ a\
==================================
{{< file >}}

The example file, `notices.sed`, adds notices to the beginning and end of a file. It adds a privacy warning at the top of each file and a copyright notice at the end of the file. You can refer to the first line with the number `1`, and the last line with the symbol `$`.

{{< file "notices.sed" >}}
1 i\
    *THIS FILE IS PRIVATE AND CONFIDENTIAL.*

$ a\
Copyright 2021 Yoyodyne Industries
{{< /file >}}

To delete lines from a text file, you can add the following to a Sed script:

{{< file "delete-copyright.sed" >}}
/Copyright/d
{{< /file >}}

In the example file, any line that matches the pattern `/Copyright/` is deleted.

## AWK

The AWK program is the most powerful of the three.  It lets you write full programs in the AWK language, a fully featured programming language with functions, flow control, and so on.

AWK's main use cases are:

- Processing field-oriented data
- Numeric comparisons and calculations
- Accumulating things by name
- Modifying data based on calculations

### AWK: Processing Data in Multiple Fields

Say you have a list of people and it includes their first and last name, the make of car they drive, the college they attended, and their year of birth.  Your file `names.txt` might look like:

{{ file "names.txt" }}
Vince       Lombardi    Toyota      Fordham     1913
Betty       Ford        Chevrolet   Bennington  1918
Harrison    Ford        Toyota      Ripon       1942
Mike        Rowe        Ford        Towson      1962
{{< /file >}}

You can use AWK to find all the people in the text file's data that drive a Ford. AWK takes care of this by automatically breaking up the fields of each line of input into fields, delimited by whitespace.  The first field is in variable `$1`, the second in `$2` and so on.  Now, you can look only for the people where the third field matches "Ford", like so:

    awk '($3 == "Ford") {print}' names.txt

The part between the single quotes, `($3 == "Ford") {print}` is a very simple program in the AWK language. It consists of a condition to test, and an action to take.  It's similar to how sed programs match each line against a pattern.

You can use regular expressions to find anyone who attended a college that starts with the letter `T`:

    awk '($4 ~ /^T/)' names.txt

Since `print` is the default action to take on a match, in this example it’s left out.

### Numeric and Comparisons and Calculations Using AWK

Grep and Sed are great for finding patterns in text, but they don't understand what the data represents.  You might tell Grep to match a number that has between 2 and 4 digits by matching the pattern `[0-9]{2,4}`, but Grep can't compare numbers or strings against one another.

If you want to print the last names of everyone in your list of people who were born before 1945, you couldn't do it in Grep or Sed, but for AWK it's simple:

    awk '($5 < 1945) {print $2}' names.txt

AWK can also do arithmetic on the fields it works with.  If you want to find the average of the birth years of each of the people in the file, it's simple for AWK:

    awk '{total += $5} END {print total/NR}' names.txt
    1933.75

On each line, AWK adds the value of the fifth column to the variable `total`. At the end of the file, it prints `total` divided by `NR`, a special variable where AWK keeps the number of records it has read.

### AWK Associative Arrays

The AWK language has powerful arrays that can be indexed by strings.  This is called an associative array, or some languages call it a hash or a lookup table.

If you want to get a list of all the different car makes in our name list, and count how many of each appear,  tell AWK to increment a counter array, indexed by the make of car, and then print out a summary of the totals at the end.

    awk '{++count[$3]} END {for (make in count) print make, count[make]}' names.txt

{{< output >}}
Ford 1
Chevrolet 1
Toyota 2
{{< /output >}}

### AWK: Modifying Data Based on Calculations

Using sed, you were able to make substitutions based on patterns, but not based on calculations.  With AWK, you can make calculations using the power of the AWK programming language.

Say you have a list of temperatures in Fahrenheit in a file, as follows:

{{< file "temperature.txt">}}
Chicago     40
Sandusky    36
Miami       80
Bemidji     46
{{< /file >}}

With AWK, you can print the file out with the Celsius equivalent:

    awk '{print $0, " ", int(($2-32)*5/9)}' temps.txt

{{< output >}}
Chicago     40   4
Sandusky    36   2
Miami       80   26
Bemidji     46   7
{{< /output >}}

In the command, the special variable `$0` refers to the entire input line.  As you've seen before, `$2` refers to the second field in the file.













