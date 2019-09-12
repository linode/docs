---
author:
  name: Mihalis Tsoukalos
  email: mihalistsoukalos@gmail.com
description: 'An introduction to lsof.'
keywords: ["UNIX", "lsof", "TCP/IP", "network", "utility"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-16
modified_by:
  name: Linode
title: 'How to List Open Files with lsof'
contributor:
  name: Mihalis Tsoukalos
  link: https://www.mtsoukalos.eu/
external_resources:
  - '[lsof on Wikipedia](https://en.wikipedia.org/wiki/Lsof)'
  - '[lsof Manual Page on die.net](https://linux.die.net/man/8/lsof)'
---

## Introduction

`lsof` was created by [Victor A. Abell](https://people.freebsd.org/~abe/) and is a utility that lists open files. As everything in Linux can be considered a file, this means that `lsof` can gather information on the majority of activity on your Linode, including network interfaces and network connections. `lsof` by default will output a list of all open files and the processes that opened them.

The two main drawbacks of `lsof` are that it can only display information about the local machine (`localhost`), and that it requires administrative privileges to print all available data. Additionally, you usually do not execute `lsof` without any command line parameters because it outputs a large amount of data that can be difficult to parse. This happens because `lsof` will natively list all open files belonging to all active processes – for example, the output of `wc(1)` (a word count utility) when applied to `lsof` on a test instance shows the size of the output is extremely large:

    sudo lsof | wc

{{< output >}}
    7332   68337 1058393
{{< /output >}}

## Before You Begin

{{< note >}}
Running `lsof` without root privileges will only return
the results available to the current user. If you are not familiar with the `sudo` command,
see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

On most major distributions, `lsof` will come pre-installed and you can begin using it immediately. If for any reason it is not found, you can install `lsof` using your preferred package manager.

## Command Line Options

The `lsof(8)` binary supports a large number of command line options, including the following:

| **Option** | **Description** |
| ---------- | --------------- |
| `-h` and `-?` | Both options present a help screen. Please note that you will need to properly escape the `?` character for `-?` to work. |
| `-a` | This option tells `lsof` to logically ADD all provided options. |
| `-b` | This option tells `lsof` to avoid kernel functions that might block the returning of results. This is a very specialized option. |
| `-l` | If converting a user ID to a login name is working improperly or slowly, you can disable it using the `-l` parameter. |
| `–P` | The `-P` option prevents the conversion of port numbers to port names for network files. |
| `-u list` | The `-u` option allows you to define a list of login names or user ID numbers whose files will be returned. The `-u` option supports the `^` character for excluding the matches from the output. |
| `-c list` | The `-c` option selects the listing of files for processes executing the commands that begin with the characters in the `list`. This supports regular expressions, and also supports the `^` character for excluding the matches from the output. |
| `-p list` | The `-p` option allows you to select the files for the processes whose process IDs are in the `list`. The `-p` option supports the `^` character for excluding the matches from the output. |
| `-g list` | The `-g` option allows you to select the files for the processes whose optional process group IDs are in the `list`. The `-g` option supports the `^` character for excluding the matches from the output. |
| `-s` | The `-s` option allows you to select the network protocols and states that interest you. The `-s` option supports the `^` character for excluding the matches from the output. The correct form is `PROCOTCOL:STATE`. Possible protocols are `UDP` and `TCP`. Some possible TCP states are: `CLOSED`, `SYN-SENT`, `SYN-RECEIVED`, `ESTABLISHED`, `CLOSE-WAIT`, `LAST-ACK`, `FIN-WAIT-1`, `FIN-WAIT-2`, `CLOSING`, and `TIME-WAIT`. Possible UDP states are `Unbound` and `Idle`. |
| `+d s` | The `+d` option option tells `lsof` to search for all open instances of directory `s` and the files and directories it contains at its top level. |
| `+D directory` | The `+D` option tells `lsof` to search for all open instances of directory `directory` and all the files and directories it contains to its complete depth. |
| `-d list` | The `-d` option specifies the `list` of file descriptors to include or exclude from the output. `-d 1,^2` means include file descriptor `1` and exclude file descriptor `2`. |
| `-i4` | This option is used for displaying IPv4 data only. |
| `-i6` | This option is used for displaying IPv6 data only. |
| `-i` | The `-i` option without any values tells `lsof` to display network connections only. |
| `-i ADDRESS` | The `-i` option with a value will limit the displayed information to match that value. Some example values are `TCP:25` for displaying TCP data that listens to port number 25, `@google.com` for displaying information related to `google.com`, `:25` for displaying information related to port number `25`, `:POP3` for displaying information related to the port number that is associated to `POP3` in the `/etc/services` file, etc. You can also combine hostnames and IP Addresses with port numbers and protocols. |
| `-t` | The `-t` option tells `lsof` to display process identifiers without a header line. This is particularly useful for feeding the output of `lsof` to the `kill(1)` command or to a script. Notice that `-t` automatically selects the `-w` option. |
| `-w` | The `-w` option disables the suppression of warning messages. |
| `+w` | The `+w` option enables the suppression of warning messages. |
| `-r TIME` | The `-r` option causes the `lsof` command to repeat every `TIME` seconds until the command is manually terminated with an interrupt. |
| `+r TIME` | The `+r` command, with the `+` prefix, acts the same as the `-r` command, but will exit its loop when it fails to find any open files. |
| `-n` | The `-n` option prevents network numbers from being converted to host names. |
| `-F CHARACTER` | The `-F` command instructs `lsof` to produce output that is suitable as input for other programs. For a complete explanation, consult the `lsof` manual entry. |

{{< note >}}
By default, the output of `lsof` will include the output of each one of its command line options,
like a big logical expression with multiple OR logical operators between all the command line
options. However, this default behavior can change with the use of the `-a` option.
{{< /note >}}

{{< note >}}
For the full list of command line options supported by `lsof` and a more detailed
explanation of the presented command line options, you should consult its manual page:

    man lsof
{{< /note >}}

## Anatomy of lsof Output

The following command uses the `-i` option to display all open UDP files/connections:

    sudo lsof -i UDP

{{< output >}}
COMMAND&nbsp;&nbsp;&nbsp;PID&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;&nbsp;TYPE DEVICE SIZE/OFF NODE NAME
rpcbind&nbsp;&nbsp;&nbsp;660  root&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;&nbsp;IPv4  20296&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:sunrpc
rpcbind&nbsp;&nbsp;&nbsp;660  root&nbsp;&nbsp;7u&nbsp;&nbsp;&nbsp;&nbsp;IPv4  20298&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:836
rpcbind&nbsp;&nbsp;&nbsp;660  root&nbsp;&nbsp;9u&nbsp;&nbsp;&nbsp;&nbsp;IPv6  20300&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:sunrpc
rpcbind&nbsp;&nbsp;&nbsp;660  root&nbsp;&nbsp;10u&nbsp;&nbsp;&nbsp;IPv6  20301&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:836
avahi-dae 669 avahi   12u&nbsp;&nbsp;&nbsp;IPv4  20732&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:mdns
avahi-dae 669 avahi   13u&nbsp;&nbsp;&nbsp;IPv6  20733&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:mdns
avahi-dae 669 avahi   14u&nbsp;&nbsp;&nbsp;IPv4  20734&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:54087
avahi-dae 669 avahi   15u&nbsp;&nbsp;&nbsp;IPv6  20735&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:48582
rsyslogd&nbsp;&nbsp;675  root&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;&nbsp;IPv4  20973&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;li10-121.members.linode.com:syslog
dhclient&nbsp;&nbsp;797  root&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;&nbsp;IPv4  21828&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:bootpc
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;16u&nbsp;&nbsp;&nbsp;IPv6  22807&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;&nbsp;IPv4  22810&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;&nbsp;IPv4  22814&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;&nbsp;IPv4  22816&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;li10-121.members.linode.com:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;20u&nbsp;&nbsp;&nbsp;IPv6  22818&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;24u&nbsp;&nbsp;&nbsp;IPv6  24916&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;[2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848   ntp&nbsp;&nbsp;&nbsp;25u&nbsp;&nbsp;&nbsp;IPv6  24918&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;[fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

The output of `lsof` has various columns.

- The `COMMAND` column contains the first nine
characters of the name of the UNIX command associated with the process.
- The `PID` column
shows the process ID of the command.
- The `USER` column displays the name of the
user that owns the process.
- The `TID` column shows the task ID. A blank `TID` indicates a
process. Note that this column will not appear in the output of many `lsof` commands.
- The `FD` column stands for file descriptor. Its values can be `cwd`, `txt`, `mem`, and
`mmap`.
- The `TYPE` column displays the type of the file: regular file, directory, socket, etc.
- The `DEVICE` column contains the device numbers separated by commas.
- The value of the `SIZE/OFF`
column is the size of the file or the file offset in bytes. The value of the `NODE` column
is the node number of a local file.
- Lastly, the `NAME` column shows the name of the mount point
and file system where the file is located, or the Internet address.

## The Repeat Mode

Running `lsof` with the `–r` option puts `lsof` in repeat mode, re-running the command in a loop every few seconds. This mode is useful for monitoring for a process or a connection that might only exist for a short time. The `-r` command will run forever, so when you are finished you must manually terminate the command.

The `+r` option will also put `lsof` in repeat mode – the difference between `-r` and `+r` is that `+r` will
automatically terminate `lsof` when a loop has no new output to print.

When `lsof`
is in repeat mode, it prints new output every `t` seconds (*a loop*); the default value
of `t` is 15 seconds, which you can change by typing an integer value after `-r` or `+r`.

The following command tells `lsof` to display all UDP connections every 10 seconds:

    sudo lsof -r 10 -i UDP

## Choosing Between IPv4 and IPv6

`lsof` lists both IPv4 and IPv6 connections by default, but you can choose the kind
of connections you want to display. The following command displays IPv4 connections
only:

    sudo lsof -i4

Therefore, the next command will display all TCP connections of the IPv4 protocol:

    sudo lsof -i4 -a -i TCP

An equivalent command to the above is the following command that uses `grep`:

    sudo lsof -i4 | grep TCP

On the other hand, the following command will display IPv6 connections only:

    sudo lsof -i6

Therefore, the next command will display all UDP connections of the IPv6 protocol:

    sudo lsof -i6 | grep UDP

{{< output >}}
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;avahi&nbsp;&nbsp;13u&nbsp;&nbsp;IPv6&nbsp;&nbsp;20733&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;*:mdns
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;avahi&nbsp;&nbsp;15u&nbsp;&nbsp;IPv6&nbsp;&nbsp;20735&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;*:48582
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;16u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22807&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;20u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22818&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;24u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24916&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;[2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;25u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24918&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;[fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

## Logically ADD All Options

In this section of the guide you will learn how to logically ADD the existing options
using the `-a` flag. This provides you enhanced filtering capabilities. Take the following command as an example:

    sudo lsof -Pni -u www-data

The above command would print out all network connections (`-i`), suppressing network number conversion (`-n`) and the conversion of port numbers to port names (`-P`), and it would *also* print out all files pertaining to the `www-data` user, without combining the two options into one logical statement.

The following command combines these two options with the `-a` logical AND option and finds all open sockets belonging to the `www-data` user:

    lsof -Pni -a -u www-data

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
apache2&nbsp;&nbsp;6385&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;6385&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;6386&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;6386&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;6387&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;6387&nbsp;&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24567&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24567&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24570&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24570&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24585&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24585&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;25431&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;25431&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;27827&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;27827&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;27828&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;27828&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;27829&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;27829&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
{{< /output >}}

{{< note >}}
You are allowed to place the `-a` option wherever you like as `lsof` will still detect the relevant options.
{{< /note >}}

## Using Regular Expressions

`lsof` has support for regular expressions. Regular expressions begin and end with a
forward slash (`/`) character. The `^` character denotes the beginning of a line whereas `$`
denotes the end of the line. Each dot (`.`) character represents a single character in
the output.

The following `lsof` command will find all commands that have precisely five characters:

    lsof -c /^.....$/
{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
netns&nbsp;&nbsp;&nbsp;&nbsp;18&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;cwd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
netns&nbsp;&nbsp;&nbsp;&nbsp;18&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;rtd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
netns&nbsp;&nbsp;&nbsp;&nbsp;18&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;unknown&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/proc/18/exe
jfsIO&nbsp;&nbsp;&nbsp;&nbsp;210&nbsp;&nbsp;root&nbsp;&nbsp;cwd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
jfsIO&nbsp;&nbsp;&nbsp;&nbsp;210&nbsp;&nbsp;root&nbsp;&nbsp;rtd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
jfsIO&nbsp;&nbsp;&nbsp;&nbsp;210&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;unknown&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/proc/210/exe
kstrp&nbsp;&nbsp;&nbsp;&nbsp;461&nbsp;&nbsp;root&nbsp;&nbsp;cwd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
kstrp&nbsp;&nbsp;&nbsp;&nbsp;461&nbsp;&nbsp;root&nbsp;&nbsp;rtd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
kstrp&nbsp;&nbsp;&nbsp;&nbsp;461&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;unknown&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/proc/461/exe
{{< /output >}}

## Output For Other Programs

Using the `-F` option, `lsof` generates output that is suitable for processing by scripts
written in programming languages such as `awk`, `perl` and `python`.

The following command will display each field of the `lsof` output in a separate line:

    sudo lsof -n -i4 -a -i TCP:ssh -F

{{< output >}}
p812
g812
R1
csshd
u0
Lroot
f3
au
l
tIPv4
.
.
.
{{< /output >}}

Providing various arguments to the `-F` option allows you to generate less output – notice that the process ID
and the file descriptor are always printed in the output. As an example, the following command
will only print the process ID, which is preceded by the `p` character, the file descriptor, which
is preceded by the `f` character, and the protocol name of each entry, which is preceded by
the `P` character:

    sudo lsof -n -i4 -a -i TCP:ssh -FP

{{< output >}}
p812
f3
PTCP
p22352
f3
PTCP
p22361
f3
PTCP
{{< /output >}}

{{< note >}}
For the full list of options supported by `-F`, you should visit the manual page of `lsof`.
{{< /note >}}

## Additional Examples

### Show All Open TCP Files

Similar to the aforementioned UDP command, the following command will display all open TCP files/connections:

    sudo lsof -i TCP

{{< output >}}
COMMAND&nbsp;&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;NODE&nbsp;NAME
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;&nbsp;IPv4&nbsp;&nbsp;23674&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:ssh (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;23686&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:ssh (LISTEN)
mysqld&nbsp;&nbsp;&nbsp;&nbsp;1003&nbsp;&nbsp;&nbsp;&nbsp;mysql&nbsp;&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;24217&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;localhost:mysql (LISTEN)
master&nbsp;&nbsp;&nbsp;&nbsp;1245&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13u&nbsp;&nbsp;IPv4&nbsp;&nbsp;24480&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:smtp (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22352&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;li10-121.members.linode.com:ssh->ppp-2-8-23-19.home.otenet.gr:60032 (ESTABLISHED)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22361&nbsp;&nbsp;&nbsp;mtsouk&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;li10-121.members.linode.com:ssh->ppp-2-8-23-19.home.otenet.gr:60032 (ESTABLISHED)
apache2&nbsp;&nbsp;&nbsp;24565&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24565&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24567&nbsp;&nbsp;&nbsp;www-data&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24567&nbsp;&nbsp;&nbsp;www-data&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24568&nbsp;&nbsp;&nbsp;www-data&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24568&nbsp;&nbsp;&nbsp;www-data&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24569&nbsp;&nbsp;&nbsp;www-data&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24569&nbsp;&nbsp;&nbsp;www-data&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24570&nbsp;&nbsp;&nbsp;www-data&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24570&nbsp;&nbsp;&nbsp;www-data&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24571&nbsp;&nbsp;&nbsp;www-data&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:http (LISTEN)
apache2&nbsp;&nbsp;&nbsp;24571&nbsp;&nbsp;&nbsp;www-data&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157      0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;*:https (LISTEN)
{{< /output >}}

### Listing All ESTABLISHED Connections

#### Internet Connections

If you process the output of `lsof` with some traditional UNIX command line tools, like [grep](/docs/quick-answers/linux/how-to-use-grep/) and `awk`,
you can list all active network connections:

    sudo lsof -i -n -P | grep ESTABLISHED | awk '{print $1, $9}' | sort -u

{{< output >}}
sshd 109.74.193.253:22->2.86.23.29:60032
{{< /output >}}

{{< note >}}
The `lsof -i -n -P` command can be also written as `lsof -i -nP` or alternatively as
`lsof -nPi` – writing it as `lsof -inP` would generate a syntax error because `lsof`
thinks that `np` is a parameter to `-i`.
{{< /note >}}

#### SSH Connections

The following command finds all established SSH connections to the local machine:

    sudo lsof | grep sshd | grep ESTABLISHED

{{< output >}}
253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
sshd&nbsp;&nbsp;22361&nbsp;&nbsp;mtsouk&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

The following command produces the same output as the previous command, but will do so more quickly because the `-i TCP`
option limits the amount of information `lsof` prints, which mean that `grep` will have less data
to process:

    sudo lsof -i TCP | grep ssh | grep ESTABLISHED

Alternatively, you can execute the following command to find all established SSH
connections:

    sudo lsof -nP -iTCP -sTCP:ESTABLISHED | grep SSH

### Showing Processes that are Listening to a Particular Port

The following command shows all network connections that listen to port number `22`
(ssh) using either UDP or TCP:

    sudo lsof -i :22

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4&nbsp;&nbsp;23674&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:ssh (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;4u&nbsp;&nbsp;IPv6&nbsp;&nbsp;23686&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:ssh (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22352&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22361&nbsp;&nbsp;mtsouk&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

### Determine Which Program Listens to a TCP port

One of the most frequent uses of `lsof` is determining which program listens to a given TCP port.
The following command will print TCP processes that are in the `LISTEN` state by using the `-s` option to provide a protocol and protocol state:

    sudo lsof -nP -i TCP -s TCP:LISTEN

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;&nbsp;IPv4&nbsp;&nbsp;23674&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:22 (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;812&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;23686&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:22 (LISTEN)
mysqld&nbsp;&nbsp;&nbsp;1003&nbsp;&nbsp;&nbsp;mysql&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;24217&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;127.0.0.1:3306 (LISTEN)
master&nbsp;&nbsp;&nbsp;1245&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13u&nbsp;&nbsp;IPv4&nbsp;&nbsp;24480&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:25 (LISTEN)
apache2&nbsp;&nbsp;24565&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24565&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24567&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24567&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24568&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24568&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24569&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24569&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24570&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24570&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24571&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24571&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
apache2&nbsp;&nbsp;24585&nbsp;&nbsp;www-data&nbsp;&nbsp;4u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626153&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:80 (LISTEN)
apache2&nbsp;&nbsp;24585&nbsp;&nbsp;www-data&nbsp;&nbsp;6u&nbsp;&nbsp;&nbsp;IPv6&nbsp;&nbsp;8626157&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;*:443 (LISTEN)
{{< /output >}}

Other possible states of a TCP connection are `CLOSED`, `SYN-SENT`, `SYN-RECEIVED`,
`ESTABLISHED`, `CLOSE-WAIT`, `LAST-ACK`, `FIN-WAIT-1`, `FIN-WAIT-2`, `CLOSING`, and `TIME-WAIT`.

### Finding Information on a Given Protocol

The next `lsof` command shows open UDP files that use the NTP (Network Time Protocol) port only:

    sudo lsof -i UDP:ntp

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;16u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22807&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22810&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22814&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22816&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;20u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22818&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;24u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24916&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;[2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;25u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24918&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;[fe80::f03c:91ff:fe69:1381]:ntp
{{< /output >}}

The output displays connections that use either IPv4 or IPv6. If you want to display
the connections that use IPv4 only, you can run the following command:

    sudo lsof -i4 -a -i UDP:ntp

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22810&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22814&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22816&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:ntp
{{< /output >}}

## Disabling DNS and port Number Resolving

`lsof` uses the data found in the `/etc/services` file to map a port number to a
service. You can disable this functionality by using the `–P` option as follows:

    lsof -P -i UDP:ntp -a -i4

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22810&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;*:123
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22814&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;localhost:123
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22816&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:123
{{< /output >}}

In a similar way, you can disable DNS resolving using the `-n` option:

    lsof -P -i UDP:ntp -a -i4 -n

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22810&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;*:123
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22814&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;127.0.0.1:123
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22816&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;UDP&nbsp;&nbsp;&nbsp;109.74.193.253:123
{{< /output >}}

The `-n` option can be particularly useful when you have a problem with your DNS
servers or when you are interested in the actual IP address.

### Find Network Connections From or To an External Host

The following command finds all network connections coming from or going to `ppp-2-86-23-29.home.example.com`:

    sudo lsof -i @ppp-2-86-23-29.home.example.com

{{< output >}}
sshd&nbsp;&nbsp;22352&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4 8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.example.com:60032 (ESTABLISHED)
sshd&nbsp;&nbsp;22361&nbsp;&nbsp;mtsouk&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4 8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.example.com:60032 (ESTABLISHED)
{{< /output >}}

You can also specify the range of ports that interest you as follows:

    sudo lsof -i @ppp-2-86-23-29.home.example.com:200-250

### Determine Which Processes are Accessing a Given File

With `lsof` you can find the processes that are accessing a given file. For example, by running the `lsof` command on it's own file you can determine the processes that are accessing it:

    sudo lsof `which lsof`

{{< output >}}
lsof&nbsp;&nbsp;25079&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;REG&nbsp;&nbsp;8,0&nbsp;&nbsp;163136 5693 /usr/bin/lsof
lsof&nbsp;&nbsp;25080&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;REG&nbsp;&nbsp;8,0&nbsp;&nbsp;163136 5693 /usr/bin/lsof
{{< /output >}}

There are two lines in the above output because the `/usr/bin/lsof` file is being accessed twice, by
both `which(1)` and `lsof`.

If you are only interested in the process ID of the processes that are accessing
a file, you can use the `-t` option to suppress header lines:

    sudo lsof -t `which lsof`

{{< output >}}
25157
25158
{{< /output >}}

A process ID can commonly be used for easily killing a process using the `kill(1)` command,
however this is something that should only be executed with great care.

### List Open Files Under a Given Directory

The `+D` `lsof` command will display all open files under a given directory,
which in this case is `/etc`, as well as the name of the process that keeps a
file or a directory open:

    sudo lsof +D /etc

{{< output >}}
COMMAND&nbsp;&nbsp;&nbsp;&nbsp;PID&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;&nbsp;&nbsp;NAME
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;avahi&nbsp;&nbsp;cwd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;745751&nbsp;&nbsp;/etc/avahi
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;avahi&nbsp;&nbsp;rtd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;745751&nbsp;&nbsp;/etc/avahi
{{< /output >}}

### List Files that are Opened by a Specific User

Another option is to locate the files opened by
any user, including web and database users.

The following command lists all open files opened by the `www-data` user:

    sudo lsof -u www-data

{{< output >}}
COMMAND&nbsp;&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
php5-fpm&nbsp;&nbsp;1066&nbsp;&nbsp;www-data&nbsp;&nbsp;cwd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
php5-fpm&nbsp;&nbsp;1066&nbsp;&nbsp;www-data&nbsp;&nbsp;rtd&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/

...
{{< /output >}}

The next variation finds all `ESTABLISHED` connections owned by the `www-data` user:

    sudo lsof -u www-data | grep -i ESTABLISHED
{{< output >}}
apache2  24571&nbsp;&nbsp;www-data&nbsp;&nbsp;29u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8675584&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61383 (ESTABLISHED)
apache2  24585&nbsp;&nbsp;www-data&nbsp;&nbsp;29u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8675583&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61381 (ESTABLISHED)
apache2  27827&nbsp;&nbsp;www-data&nbsp;&nbsp;29u&nbsp;&nbsp;IPv6&nbsp;&nbsp;8675582&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:https->ppp-2-86-23-29.home.otenet.gr:61382 (ESTABLISHED)
{{< /output >}}

Last, the next command will find all processes except the ones owned by `www-data` by using the `^` character:

    sudo lsof -u ^www-data

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;TID&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;FD&nbsp;&nbsp;&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NAME
systemd&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;cwd&nbsp;&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
systemd&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;rtd&nbsp;&nbsp;&nbsp;DIR&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4096&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/
systemd&nbsp;&nbsp;1&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;root&nbsp;&nbsp;txt&nbsp;&nbsp;&nbsp;REG&nbsp;&nbsp;&nbsp;8,0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1120992&nbsp;&nbsp;&nbsp;1097764&nbsp;&nbsp;/lib/systemd/systemd

...
{{< /output >}}

If the user name you are trying to use does not exist, you will get an error message
similar to the following:

    sudo lsof -u doesNotExist

{{< output >}}
lsof: can't get UID for doesNotExist
lsof 4.89
 latest revision: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/
 latest FAQ: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/FAQ
 latest man page: ftp://lsof.itap.purdue.edu/pub/tools/unix/lsof/lsof_man
 usage: [-?abhKlnNoOPRtUvVX] [+|-c c] [+|-d s] [+D D] [+|-E] [+|-e s] [+|-f[gG]]
 [-F [f]] [-g [s]] [-i [i]] [+|-L [l]] [+m [m]] [+|-M] [-o [o]] [-p s]
 [+|-r [t]] [-s [p:s]] [-S [t]] [-T [t]] [-u s] [+|-w] [-x [fl]] [--] [names]
Use the ``-h'' option to get more help information.
{{< /output >}}

### Kill All Processes Owned by a User

The following command will kill all of the processes owned by the `www-data` user:

{{< caution >}}
Please be careful when combining `lsof` with the `kill(1)` command. Do not try to
test similar commands on a live server unless you are absolutely certain you will not experience issues – for testing purposes you can use a disposable Docker image or something similar.
{{</ caution >}}

    sudo kill -9 `lsof -t -u www-data`

### Find All Network Activity from a Given User

The following command lists all network activity by a user named  `mtsouk`:

    lsof -a -u mtsouk -i

{{< output >}}
COMMAND&nbsp;&nbsp;PID&nbsp;&nbsp;&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;FD&nbsp;&nbsp;TYPE&nbsp;&nbsp;DEVICE&nbsp;&nbsp;&nbsp;SIZE/OFF&nbsp;&nbsp;NODE&nbsp;&nbsp;NAME
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22361&nbsp;&nbsp;mtsouk&nbsp;&nbsp;3u&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TCP&nbsp;&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

On the other hand, the following command lists all network activity from processes not owned by
the `root` or the `www-data` user:

    lsof -a -u ^root -i -u ^www-data
{{< output >}}
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;&nbsp;&nbsp;avahi&nbsp;&nbsp;&nbsp;12u&nbsp;&nbsp;IPv4&nbsp;&nbsp;20732&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP &nbsp;&nbsp;*:mdns
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;&nbsp;&nbsp;avahi&nbsp;&nbsp;&nbsp;13u&nbsp;&nbsp;IPv6&nbsp;&nbsp;20733&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP &nbsp;&nbsp;*:mdns
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;&nbsp;&nbsp;avahi&nbsp;&nbsp;&nbsp;14u&nbsp;&nbsp;IPv4&nbsp;&nbsp;20734&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP &nbsp;&nbsp;*:54087
avahi-dae&nbsp;&nbsp;669&nbsp;&nbsp;&nbsp;&nbsp;avahi&nbsp;&nbsp;&nbsp;15u&nbsp;&nbsp;IPv6&nbsp;&nbsp;20735&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP &nbsp;&nbsp;*:48582
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;16u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22807&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22810&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;*:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;18u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22814&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;19u&nbsp;&nbsp;IPv4&nbsp;&nbsp;22816&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;li140-253.members.linode.com:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20u&nbsp;&nbsp;IPv6&nbsp;&nbsp;22818&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;localhost:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;24u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24916&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;[2a01:7e00::f03c:91ff:fe69:1381]:ntp
ntpd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;848&nbsp;&nbsp;&nbsp;&nbsp;ntp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;25u&nbsp;&nbsp;IPv6&nbsp;&nbsp;24918&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;UDP&nbsp;&nbsp;[fe80::f03c:91ff:fe69:1381]:ntp
mysqld&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1003&nbsp;&nbsp;&nbsp;mysql&nbsp;&nbsp;&nbsp;17u&nbsp;&nbsp;IPv4&nbsp;&nbsp;24217&nbsp;&nbsp;&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;localhost:mysql (LISTEN)
sshd&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;22361&nbsp;&nbsp;mtsouk&nbsp;&nbsp;3u&nbsp;&nbsp;&nbsp;IPv4&nbsp;&nbsp;8613370&nbsp;&nbsp;0t0&nbsp;&nbsp;TCP&nbsp;&nbsp;li140-253.members.linode.com:ssh->ppp-2-86-23-29.home.otenet.gr:60032 (ESTABLISHED)
{{< /output >}}

### Find the Total Number of TCP and UDP Connections

If you process the output of `lsof` with some traditional UNIX command line tools, like `grep` and `awk`,
you can calculate the total number of TCP and UDP connections:

    sudo lsof -i | awk '{print $8}' | sort | uniq -c | grep 'TCP\|UDP'

{{< output >}}
     28 TCP
     13 UDP
{{< /output >}}

The `lsof –i` command lists all Internet connections whereas `awk` extracts the 8th
field, which is the value of the `NODE` column and `sort` sorts the output. Then, the
`uniq –c` command counts how many times each line exists. Last, the `grep –v 'TCP\|UDP'`
command displays the lines that contain the `TCP` or the `UDP` word in them.

## Summary

`lsof` is a powerful diagnostic tool capable of a significant number of ways that you can combine its command line options to troubleshoot various issues administrators can find themselves facing. As this guide has only provided a few examples of how to use this tool, additional options can be combined for various effects that can be specifically suited to your needs.
