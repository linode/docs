---
author:
  name: Linode
  email: docs@linode.com
description: 'Use the Linux command tail to view and follow the end of text files.'
keywords: ["tail", "linux commands", "linux", "common commands", "unix", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linux-tools/common-commands/tail/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-11-29
title: View and Follow the End of Text Files with tail
---

The `tail` command is a core Linux utility used to view the very end of a text file. Additionally, with `tail` you may "follow" a text file to see new lines as they're added to the file in real time. For related functionality that addresses the beginning of a file, consider the [head utility](/docs/tools-reference/tools/view-the-beginning-of-text-files-with-head).

![Title graphic](/docs/assets/view_and_follow_the_end_of_text_files_with_tail_smg.png)

## Using tail

Consider the following invocation:

    tail /etc/rc.conf

The above command prints the final ten lines of the `/etc/rc.conf` file to standard output on the terminal. The `tail` command is useful for reading files where the relevant content is always appended to the end of the file such as logs.

You may also use `tail` to print the final lines of a group of files. See the following example:

    $ tail error.log access.log
    ==> access.log <==
    12.34.56.78 - - [17/Jun/2010:20:25:28 -0400] "GET /local.css HTTP/1.1" 200 95 "http://example.com/" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100405 Firefox/3.6.3 (Swiftfox)"
    12.34.56.78 - - [17/Jun/2010:20:25:28 -0400] "GET /wikiicons/search-bg.gif HTTP/1.1" 200 74 "http://example.com/style.css" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100405 Firefox/3.6.3 (Swiftfox)"
    12.34.56.78 - - [17/Jun/2010:20:25:28 -0400] "GET /favicon.ico HTTP/1.1" 200 371 "-" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100405 Firefox/3.6.3 (Swiftfox)"
    12.34.56.78 - - [17/Jun/2010:20:25:59 -0400] "GET /tag/ HTTP/1.1" 403 143 "-" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100405 Firefox/3.6.3 (Swiftfox)"
    12.34.56.78 - - [17/Jun/2010:20:26:01 -0400] "GET /tag/song HTTP/1.1" 404 143 "-" "Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.2.3) Gecko/20100405 Firefox/3.6.3 (Swiftfox)"
    12.34.56.78 - - [30/Jun/2010:22:19:39 -0400] "GET / HTTP/1.1" 200 3273 "-" "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.11"
    12.34.56.78 - - [30/Jun/2010:22:19:39 -0400] "GET /style.css HTTP/1.1" 200 7684 "http://example.com/" "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.11"
    12.34.56.78 - - [30/Jun/2010:22:19:39 -0400] "GET /local.css HTTP/1.1" 200 95 "http://example.com/" "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.11"
    12.34.56.78 - - [30/Jun/2010:22:19:39 -0400] "GET /wikiicons/search-bg.gif HTTP/1.1" 200 74 "http://example.com/" "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.11"
    12.34.56.78 - - [30/Jun/2010:22:19:39 -0400] "GET /favicon.ico HTTP/1.1" 200 371 "http://example.com/" "Opera/9.80 (X11; Linux i686; U; en) Presto/2.2.15 Version/10.11"

    ==> error.log <==
    2010/06/17 20:25:59 [error] 20227#0: *1 directory index of "/srv/http/example.com/tag/" is forbidden, client: 12.34.56.78, server: example.com, request: "GET /tag/ HTTP/1.1", host: "example.com"
    2010/06/17 20:26:01 [error] 20227#0: *2 open() "/srv/http/example.com/tag/tycho" failed (2: No such file or directory), client: 12.34.56.78, server: example.com, request: "GET /tag/chris HTTP/1.1", host: "example.com"

### Control the Length of tail Output

In the default configuration, `tail` will only output the final ten lines of the file specified on the command line. You can use the `-n [number]` option to control the number of lines that the `tail` command prints. Consider the following examples:

    $ tail access.log -n 5
    19.63.193.55 - - [13/Sep/2010:12:27:36 -0400] "GET / HTTP/1.1" 200 355 "-" "Baiduspider+(+http://www.baidu.jp/spider/)"
    220.81.7.96 - - [13/Sep/2010:16:43:40 -0400] "GET / HTTP/1.1" 304 0 "-" "Baiduspider+(+http://www.baidu.com/search/spider.htm)"
    16.24.89.21 - - [14/Sep/2010:01:53:38 -0400] "GET /robots.txt HTTP/1.1" 500 193 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    166.29.4.23 - - [14/Sep/2010:03:52:12 -0400] "GET /robots.txt HTTP/1.1" 500 193 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    6.24.5.28 - - [14/Sep/2010:14:54:30 -0400] "GET /robots.txt HTTP/1.1" 500 193 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

    $ tail access.log -n 2
    166.29.4.23 - - [14/Sep/2010:03:52:12 -0400] "GET /robots.txt HTTP/1.1" 500 193 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
    6.24.5.28 - - [14/Sep/2010:14:54:30 -0400] "GET /robots.txt HTTP/1.1" 500 193 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

You may also use the `-n [number]` option when using `tail` with multiple files in a single invocation.

### Follow Logs with tail

With the `-f` option, `tail` operates in follow mode. Here, `tail` prints the final ten lines, or the number of lines specified, and watches the file for new additions to the end of the file. When new lines are added they are printed to the terminal.

`tail` will continue to follow a file until the user sends a break (e.g. `Control+c`) to the terminal. Additionally, if the file is deleted or renamed, `tail -f` will fail. Use the `-F` option to force `tail` to follow file names rather than file objects. This can prevent problems with [log rotation](/docs/linux-tools/utilities/logrotate) and other programs that may alter file names.

The "follow" mode of `tail` is very useful when troubleshooting issues because it allows you to watch logs in real time.

### Filter Lines in Followed Logs with grep

The [grep](/docs/tools-reference/search-and-filter-text-with-grep) tool can be combined with `tail` to filter the contents of a log file in real time. Consider the following examples:

    tail -F procmail.log | grep -e "^Subject"
    tail -F access.log | grep "404"

In the first command, only the lines of the `procmail.log` file that begin with the characters `Subject` are printed. All other lines are discarded.

In the second invocation, only entries from the access log that contain the characters `404` will be printed. All other lines are discarded.