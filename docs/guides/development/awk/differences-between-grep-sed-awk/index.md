---
slug: differences-between-grep-sed-awk
author:
  name: Andy Lester
description: 'This guide explains the differences between grep, sed, and AWK for different use cases'
og_description: 'This guide explains the differences between grep, sed, and AWK for different use cases'
keywords: ['difference between sed awk grep']
tags: ['linux']
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

Grep, sed, and AWK are all standard Linux tools that are able to work with text files. Each of these tools can read text files line-by-line and use regular expressions to perform operations on specific parts of the file. However, each tool differs in complexity and their basic use cases. Grep is used for finding data and is the simplest of the three. Sed finds and modifies data and is a bit more complex than grep. AWK can process text and extract data from text files. Of the three tools, AWK is the most complex and powerful. This guide provides an overview of each tool with examples.

## The Grep Command-Line Utility

Grep is a Linux utility used to to find lines of text in files or input streams using regular expressions. It's name is short for *Global Regular Expression Pattern*

### Grep: Search a Log File for Errors

Grep is a good tool to use when you need to search for a text pattern in a file. For example, you may need to search for specific text in a system log file.

Grep's syntax uses the following format:

    grep [OPTIONS] PATTERN [FILES...]

For example, to find the exact location of your system's Apache error log file, use grep to search for `ErrorLog` in the Apache configuration file.

    grep "ErrorLog" /etc/apache2/apache2.conf

{{< output >}}
# ErrorLog: The location of the error log file.
# If you do not specify an ErrorLog directive within a <VirtualHost>
ErrorLog ${APACHE_LOG_DIR}/error.log
{{< /output >}}

Grep is able to find the configuration named `ErrorLog` in your Apache configuration file and returns the text as output. The output returned by most Linux distributions highlights the search term in red.

To search multiple files using grep, separate each filename with a space character. When grep searches multiple files, its output displays the location of each file where the search term is found.

    grep "rollover" /var/log/fail2ban.log /var/log/fail2ban.log.1

{{< output >}}
/var/log/fail2ban.log:2021-08-22 00:00:17,281 fail2ban.server      [2467]: INFO    rollover performed on /var/log/fail2ban.log
/var/log/fail2ban.log.1:2021-08-15 00:00:10,103 fail2ban.server    [2467]: INFO    rollover performed on /var/log/fail2ban.log
{{< /output >}}

### Grep: Recursive Search Through Trees of Text

Grep can search through the files in a directory tree with the `-R` option. When you specify a starting directory and the `-R` option, grep searches through all the files in that directory. The example below displays the syntax to recursively search for a particular term within a specific directory tree.

    grep -R "keyword" /path/to/directory/

To make a grep search case insensitive, add the `-i` option to the command. In the following example, the grep command searches for the keyword "virtualhost" and returns the files that contain the "virtualhost".

    grep -iR "virtualhost" /etc/apache2/

{{< output >}}
/etc/apache2/conf-enabled/localized-error-pages.conf:# even on a per-VirtualHost basis...
/etc/apache2/conf-enabled/other-vhosts-access-log.conf:# Define an access log for VirtualHosts...
/etc/apache2/sites-available/000-default.conf: <VirtualHost *:80>
/etc/apache2/sites-available/000-default.conf: </VirtualHost>
/etc/apache2/sites-available/default-ssl.conf: <VirtualHost _default_:443>
/etc/apache2/sites-available/default-ssl.conf: </VirtualHost>
/etc/apache2/sites-available/canvas.conf: <VirtualHost *:80>
/etc/apache2/sites-available/canvas.conf: </VirtualHost>
/etc/apache2/sites-available/canvas.conf: <VirtualHost *:443>
/etc/apache2/sites-available/canvas.conf: </VirtualHost>
{{< /output >}}

To suppress the default grep output and print only the names of files containing the matched pattern, use the `-l` option. The `-l` option is usually used in combination with the recursive option `-R`.

The command below searches through all files ending with `.conf` in the `/etc/apache2/` directory. The output prints only the names of the files that contain the search term.

    grep -Rl ".com" /etc/apache2/ *.conf

{{< output >}}
/etc/apache2/mods-enabled/mime.conf
/etc/apache2/mods-enabled/status.conf
/etc/apache2/mods-enabled/alias.conf
/etc/apache2/mods-enabled/php7.4.conf
/etc/apache2/mods-enabled/access_compat.load
/etc/apache2/mods-enabled/autoindex.conf
/etc/apache2/envvars
...
...
{{< /output >}}

### Grep: Viewing a Search Terms Context (Lines Surrounding Matches)

Grep provides several command-line options to control the amount of text surrounding your search term results. The list below contains the available options:

- `-B num`: displays the lines **before** the search term match. Replace `num` with the number of lines to display.
- `-A num`: displays the lines **after** the search term match. Replace `num` with the number of lines to display
- `-C num`: displays the lines **before** and **after** the search term match. Replace `num` with the number of lines to display. The default value for `num` is 2.

For example, the grep command below  The `-B 4` in the following example tells grep to show the 4 lines "before" the match.

    grep -B 4 "fonts" /var/log/apache2/access.log

The output returns the 4 lines before the search term match:

{{< output >}}
192.0.2.0 - - [17/May/2015:10:05:47 +0000] "GET /presentations/logstash-monitorama-2013/plugin/highlight/highlight.js HTTP/1.1" 200 26185 "http://semicomplete.com/presentations/logstash-monitorama-2013/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/198.51.100.0 Safari/537.36"
192.0.2.0 - - [17/May/2015:10:05:12 +0000] "GET /presentations/logstash-monitorama-2013/plugin/zoom-js/zoom.js HTTP/1.1" 200 7697 "http://semicomplete.com/presentations/logstash-monitorama-2013/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/198.51.100.0 Safari/537.36"
192.0.2.0 - - [17/May/2015:10:05:07 +0000] "GET /presentations/logstash-monitorama-2013/plugin/notes/notes.js HTTP/1.1" 200 2892 "http://semicomplete.com/presentations/logstash-monitorama-2013/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/198.51.100.0 Safari/537.36"
192.0.2.0 - - [17/May/2015:10:05:34 +0000] "GET /presentations/logstash-monitorama-2013/images/sad-medic.png HTTP/1.1" 200 430406 "http://semicomplete.com/presentations/logstash-monitorama-2013/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/198.51.100.0 Safari/537.36"
192.0.2.0 - - [17/May/2015:10:05:57 +0000] "GET /presentations/logstash-monitorama-2013/css/fonts/Roboto-Bold.ttf HTTP/1.1" 200 38720 "http://semicomplete.com/presentations/logstash-monitorama-2013/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/198.51.100.0 Safari/537.36"
{{< /output >}}

{{< note >}}
To highlight your search term, add the `--color` option to your grep command.
{{< /note >}}

### Grep: List Files That Match a Pattern

To find a list of files that match a given pattern, use the `-l` option. The example below finds all HTML files in a directory that contain the string "copyright". The output only returns the list of filenames that contain the matched search term.

    grep -l -i copyright *.html

{{< output >}}
about.html
index.html
products.html
{{< /output >}}

Grep can also find files that **do not** match a pattern. To find all the files that don't contain the string "copyright", use the `-L` option.

    grep -L -i copyright *.html

{{< output >}}
contact.html
how-to-buy.html
{{< /output >}}

With the ability to create a list of files using `-l` you can use grep to perform complex searches. Say you want to find all the files that have both the pattern "dogs" and the pattern "cats" somewhere in the file, although not necessarily on the same line.

To get a list of HTML files with the word "dogs" you use:

    grep -l dogs *.html

Then, you use the Linux shell to tell grep to search that list of files for the word "cats".

    grep -l cats $(grep -l dogs *.html)

This searches all the "dogs" files for "cats", giving you a list of files that contain both.

## Sed Command

sed is short for *Stream Editor* and has much of the same functionality as grep, but is much more flexible in how it can select lines of input. It lets you modify the data it finds.

It opens a file, reads it line by line, and acts on each line according to its instructions. Sed’s syntax can seem cryptic, but it's logical and well-defined. Once you're used to it you can save yourself hours.

### sed Search and Replace

The most common use of sed is a search and replace operation for strings or patterns throughout a file. For instance, to replace every instance of "Copyright 2020" in one of your HTML files with "Copyright 2021", you use:

    sed -e's/Copyright 2020/Copyright 2021/g' index.html > modified.html

The `-e` option gives sed the instructions it should run on each line in the file. In this case, the `s` is the command to substitute the first string, "Copyright 2020", with the second string "Copyright 2021". The modified output goes to the file `modified.html`.

To modify files in place, use the `-i` option. You can tell sed to make a backup copy of the files it modifies by specifying an extension with the `-i` option, as in `-i.bak`.

sed has the power of regular expressions, so to replace all occurrences of "Copyright 20XX", where the "XX" is any two digits, with "Copyright 2021",
in all your .html files, you would use:

    sed -e's/Copyright 20[0-9][0-9]/Copyright 2021/g' -i.bak *.html

### Create a sed Script

When your sed programs become too big to fit in the `-e` option, sed can accept sets of instructions from a program file. For example, you might have many replacements you want to make, so you could put them in a file named `replacements.sed` and add the following contents:

{{< file "replacements.sed" >}}
s/I should of/I should have/;
s/supposably/supposedly/;
s/mute point/moot point/;
s/one in the same/one and the same/;
{{< /file >}}

Apply the changes to all your text files with the following command:

    sed -f replacements.sed -i.bak *.txt

### sed: Insert, Append, and Delete Lines

sed can insert and append lines in files. In the context of sed, "insert" (`i`) means to add a line before a given line, and "append" (`a`) means to append to the line after a given line.

For example, the below command inserts a line before the line number "4".

    sed '4 i #This is the extra line' sedtest.txt

After running the above command, you should see a similar output:

{{< output >}}
This is line #1
This is line #2
This is line #3
#This is the extra line
This is line #4
This is line #5
This is line #6
This is line #7
This is line #8
This is line #9
This is line #10
{{< /output >}}

To insert a line before the last line, use the following sed command:

    sed '$ i #Next line will be the last line' sedtest.txt

After running the above command, you should see a similar output:

{{< output >}}
This is line #1
This is line #2
This is line #3
This is line #4
This is line #5
This is line #6
This is line #7
This is line #8
This is line #9
#Next line will be the last line
This is line #10
{{< /output >}}

To insert the line before every line where pattern match is found, use the following command:

    sed '/8/ i #This line is inserted using sed' sedtest.txt

After running the above command, you should see a similar output:

{{< output >}}
This is line #1
This is line #2
This is line #3
This is line #5
This is line #6
This is line #7
#This line is inserted using sed
This is line #8
This is line #9
This is line #10
{{< /output >}}

The following example file, `notices.sed`, adds notices to the beginning and end of a file. It adds a privacy warning at the top of each file and copyright notice at the end of the file. You can refer to the first line with the number `1`, and the last line with the symbol `$`.

{{< file "notices.sed" >}}
1 i\
    *THIS FILE IS PRIVATE AND CONFIDENTIAL.*

$ a\
Copyright 2021 Yoyodyne Industries
{{< /file >}}

To delete lines from a text file, you can add the following to a sed script:

{{< file "delete-copyright.sed" >}}
/Copyright/d
{{< /file >}}

In the above example file, any line that matches the pattern `/Copyright/` is deleted.

## AWK Command

The AWK command is the most powerful of the three. It lets you write full programs in the AWK language, a fully-featured programming language with functions, flow control, and so on.

AWK's main use cases are:

- Processing field-oriented data
- Numeric comparisons and calculations
- Accumulating things by name
- Modifying data based on calculations

### AWK: Process Data in Multiple Fields

Say you have a list of people and it includes their first and last name, the make of car they drive, the college they attended, and their year of birth. Create an example `names.txt` file with the following contents:

{{< file "names.txt" >}}
Vince       Lombardi    Toyota      Fordham     1913
Betty       Ford        Chevrolet   Bennington  1918
Harrison    Ford        Toyota      Ripon       1942
Mike        Rowe        Ford        Towson      1962
{{< /file >}}

You can use AWK to find all the people in the text file's data that drive a Ford. AWK takes care of this by automatically breaking up the fields of each line of input into fields, delimited by whitespace. The first field is in variable `$1`, the second in `$2`, and so on. Now, you can look only for the people where the third field i.e., "make of car" that matches "Ford", using the below command:

    awk '($3 == "Toyota") {print}' names.txt

You should see the similar output like the following:

{{< output >}}
Vince       Lombardi    Toyota      Fordham     1913
Harrison    Ford        Toyota      Ripon       1942
{{< /output >}}

The part between the single quotes, `($3 == "Toyota") {print}` is a very simple program in the AWK language. It consists of a condition to test, and an action to take. It's similar to how sed programs match each line against a pattern.

You can use regular expressions to find anyone who attended a college that starts with the letter `T`:

    awk '($4 ~ /^T/)' names.txt

Following would be the output since `print` is the default action to take on a match, in this example, it’s left out.

{{< output >}}
Mike        Rowe        Ford        Towson      1962
{{< /output >}}

### AWK: Numeric Comparisons and Calculations Using AWK

Grep and sed are great for finding patterns in text, but they don't understand what the data represents. You might tell Grep to match a number that has between 2 and 4 digits by matching the pattern `[0-9]{2,4}`, but Grep can't compare numbers or strings against one another.

If you want to print the last names of everyone in your list of people who were born before 1945, you couldn't do it in Grep or sed, but for AWK it's simple:

    awk '($5 < 1945) {print $2}' names.txt

AWK can also do arithmetic on the fields it works with. If you want to find the average of the birth years of each of the people in the file, you can do so with AWK using the following command:

    awk '{total += $5} END {print total/NR}' names.txt
    1933.75

On each line, AWK adds the value of the fifth column to the variable `total`. At the end of the file, it prints `total` divided by `NR`, a special variable where AWK keeps the number of records it has read.

### AWK Associative Arrays

The AWK language has powerful arrays that can be indexed by strings. This is called an associative array, or some languages call it a hash or a lookup table.

If you want to get a list of all the different car makes in our name list, and count how many of each appear, tell AWK to increment a counter array, indexed by the make of car, and then print out a summary of the totals at the end.

    awk '{++count[$3]} END {for (make in count) print make, count[make]}' names.txt

After running the command, you should see a similar output:

{{< output >}}
Ford 1
Chevrolet 1
Toyota 2
{{< /output >}}

### AWK: Modify Data Based on Calculations

Using sed, you were able to make substitutions based on patterns, but not based on calculations. With AWK, you can make calculations using the power of the AWK programming language.

Create a file `temperature.txt` with a list of temperatures in Fahrenheit as follows:

{{< file "temperature.txt">}}
Chicago     40
Sandusky    36
Miami       80
Bemidji     46
{{< /file >}}

With AWK, you can print the file out with the Celsius equivalent:

    awk '{print $0, " ", int(($2-32)*5/9)}' temperature.txt

{{< output >}}
Chicago     40   4
Sandusky    36   2
Miami       80   26
Bemidji     46   7
{{< /output >}}

In the command, the special variable `$0` refers to the entire input line. As you've seen before, `$2` refers to the second field in the file.
