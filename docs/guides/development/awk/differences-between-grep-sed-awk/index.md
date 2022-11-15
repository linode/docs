---
slug: differences-between-grep-sed-awk
author:
  name: Andy Lester
description: 'This guide introduces you to Grep, sed, and AWK, which are Linux tools used for text processing. It explains the differences between grep, sed, and AWK and provides beginner examples for each.'
og_description: 'This guide introduces you to Grep, sed, and AWK, which are Linux tools used for text processing. It explains the differences between grep, sed, and AWK and provides beginner examples for each.'
keywords: ['difference between sed awk grep']
tags: ['linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-27
modified_by:
  name: Linode
title: "Text Processing in Linux: Understanding Grep, sed, and AWK"
h1_title: "Learn to Process Text in Linux using Grep, sed, and AWK"
enable_h1: true
contributor:
  name: Andy Lester
---

## The Differences Between Grep, sed, and AWK

Grep, sed, and AWK are all standard Linux tools that are able to process text. Each of these tools can read text files line-by-line and use regular expressions to perform operations on specific parts of the file. However, each tool differs in complexity and what can be accomplished. Grep is used for finding text patterns in a file and is the simplest of the three. Sed can find and modify data, however, its syntax is a bit more complex than grep. AWK is a full-fledged programming language that can process text and perform comparison and arithmetic operations on the extracted text. This guide provides an overview of each tool with examples and includes links to guides in our library that go deeper into each tool.

## The Grep Command-Line Utility

Grep is a Linux utility used to find lines of text in files or input streams using regular expressions. It's name is short for *Global Regular Expression Pattern*

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

To search multiple files using grep, separate each filename with a whitespace character. When grep searches multiple files, its output displays the location of each file where the search term is found.

    grep "rollover" /var/log/fail2ban.log /var/log/fail2ban.log.1

{{< output >}}
/var/log/fail2ban.log:2021-08-22 00:00:17,281 fail2ban.server      [2467]: INFO    rollover performed on /var/log/fail2ban.log
/var/log/fail2ban.log.1:2021-08-15 00:00:10,103 fail2ban.server    [2467]: INFO    rollover performed on /var/log/fail2ban.log
{{< /output >}}

### Grep: Viewing a Search Term's Context

Grep provides several command-line options to control the amount of text surrounding your search term results. The list below contains the available options:

- `-B num`: displays the lines **before** the search term match. Replace `num` with the number of lines to display.
- `-A num`: displays the lines **after** the search term match. Replace `num` with the number of lines to display
- `-C num`: displays the lines **before** and **after** the search term match. Replace `num` with the number of lines to display. The default value for `num` is 2.

For example, the command will display the 4 lines "before" the pattern match.

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

### Grep: List Files that Match a Pattern

To find a list of files that match a given pattern, use the `-l` option. The example below finds all HTML files in a directory that contain the string "copyright". The output returns the list of filenames that contain the matched search term.

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

You can use grep's `-l` option to perform more complex searches. For example, you can use it to find all files in a directory that contain the pattern "dogs" and "cats". To do so, get a list of the HTML files that contain the word "dogs":

    grep -l "dogs" *.html

Then, search for "cats" in the existing list of files containing the word "dogs":

    grep -l cats $(grep -l dogs *.html)

The output displays a list of files that contain both.

To learn more about grep and its command-line options, see our [How to Grep for Text in Files](/docs/guides/how-to-grep-for-text-in-files/) guide. The guide also shows you other useful operations, like [piping command outputs to grep](/docs/guides/how-to-grep-for-text-in-files/#piping-command-outputs-to-grep) and how to [recursively search through a directory tree](/docs/guides/how-to-grep-for-text-in-files/#the-grep-command).

## Sed Command

Sed is short for *Stream Editor* and has much of the same functionality as grep. However, sed is much more flexible in how it can select lines of input. It also lets you modify the data it finds. Sed opens a file, reads it line by line, and acts on each line according to its instructions. If you are new to sed, it's syntax can may seem difficult to understand. Once you're used to sed's syntax, you can accomplish powerful operations on your text files and data.

### Create a Search and Replace sed Script

The most common usage of sed is to search for strings or patterns throughout a file and replace them with different strings. For instance, to replace every instance of "Copyright 2020" with "Copyright 2021" in a group of HTML files, use the following command:

    sed -e' s/Copyright 2020/Copyright 2021/g' index.html > modified.html

When your sed programs become too big to easily fit on the command line, sed can accept sets of instructions from a program file. For example, you might have many replacements you want to make. Place them in a file named `replacements.sed`, as follows:

{{< file "replacements.sed" >}}
s/I should of/I should have/;
s/supposably/supposedly/;
s/mute point/moot point/;
s/one in the same/one and the same/;
{{< /file >}}

Apply the changes to all your text files with the following command:

    sed -f replacements.sed -i.bak *.txt

### sed: Prepend and Append Lines

The `i` option in sed inserts text *before* a given line. The `a` option places text *after* a given line. For example, the command below inserts a line before line number 4.

    sed '4 i #This is the extra line' sedtest.txt

You should see a similar output after the command executes:

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

To save the output to a new file named `newsedtest.txt`, use a redirection operator, as follows:

    sed '4 i #This is the extra line' sedtest.txt > newsedtest.txt

To insert the line before every line where a pattern match is found, use the following command:

    sed '/8/ i #This line is inserted using sed' sedtest.txt

To learn more about sed, see our [Manipulate Text from the Command Line with sed](/docs/guides/manipulate-text-from-the-command-line-with-sed/#finding-and-replacing-strings-within-files-using-sed) guide. The guide shows you [how to change file extensions with sed](/docs/guides/manipulate-text-from-the-command-line-with-sed/#finding-and-replacing-strings-within-files-using-sed), [delete lines from files using sed](/docs/guides/manipulate-text-from-the-command-line-with-sed/#deleting-lines-from-files-using-sed), and more.


## AWK Command

AWK is the most powerful of the three tools explored in this guide. It is a full-featured programming language with functions, variables, flow control, and support for different data types.

AWK's primary use cases are the following:

- Processing field-oriented data
- Numeric comparisons and calculations
- Modifying data based on calculations

### AWK: Process Data in Multiple Fields

The examples in this section rely on the data in the `names.txt` file below. The data contains information about cars owned by a group of different people.

{{< file "names.txt" >}}
Vince       Lombardi    Toyota      Fordham     1913
Betty       Ford        Chevrolet   Bennington  1918
Harrison    Ford        Toyota      Ripon       1942
Mike        Rowe        Ford        Towson      1962
{{< /file >}}

You can use AWK to find all the people that drive a Toyota. AWK automatically breaks up each line into fields and columns using whitespaces as the delimiter. The first field is stored in variable `$1`, the second in `$2`, and so on. To search for the people who own a "Toyota", use the field stored in the `$3` variable, as follows:

    awk '($3 == "Toyota") {print}' names.txt

You should see a similar output:

{{< output >}}
Vince       Lombardi    Toyota      Fordham     1913
Harrison    Ford        Toyota      Ripon       1942
{{< /output >}}

The part between the single quotes, `($3 == "Toyota") {print}` is a very simple program in the AWK language. It consists of a condition to test against, and an action to take. This is similar to how sed programs match each line against a pattern.

### AWK: Numeric Comparisons and Calculations Using AWK

You can accomplish much more with AWK when searching for text patterns, because it supports comparison and arithmetic operators. For example, to print the last name of people who were born before 1945 (using the data in `names.txt`) use the following command:

    awk '($5 < 1945) {print $2}' names.txt

You should see a similar output:

{{< output >}}
Lombardi
Ford
Ford
{{< /output >}}

AWK can also perform arithmetic on the fields it works with. To find the birth year average for all people in the `names.txt` file, use the following AWK command:

    awk '{total += $5} END {print total/NR}' names.txt

The output returns the following average:

{{< output >}}
1933.75
{{< /output >}}

On each line, AWK adds the value of the fifth column to the variable `total`. At the end of the file, it prints `total` divided by `NR`, a special variable where AWK keeps the number of records it has read.

To take a deep dive into the AWK programming language, refer to our [Learn the AWK Programming Language](/docs/guides/introduction-to-awk/) guide.

## Conclusion

Grep, sed, and AWK can each be used to search for and process text on a Linux system. However, each tool provides its own strengths. For simple text pattern searches within a directory, grep can complete the task. It's syntax is uncomplicated and it also provides many useful command-line options to enhance its search capabilities. Sed can search for text in files and can also replace the text. This provides you with more out-of-the-box functionality than grep. Finally, AWK is a full-fledged programming language, so you can accomplish a lot more with it. However, it does require a higher learning curve.
