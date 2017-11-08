---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Load testing your web server with regression testing and benchmarking utility Siege'
keywords: ["siege", "load testing", "benchmarking"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-02-18
modified_by:
  name: Elle Krout
published: 2015-02-18
title: Load Testing Web Servers with Siege
external_resources:
 - '[Siege Home](http://www.joedog.org/siege-home)'
---

Siege is an HTTP load testing and benchmarking utility that can be used to measure the performance of a web server when under duress. It evaluates the amount of data transferred, response time of the server, transaction rate, throughput, concurrency, and times the program returned okay. Siege offers three modes of operation: Regression, internet simulation, and brute force.

![Load Testing Web Servers with Siege](/docs/assets/load-testing-web-servers-with-siege.png)

This guide is for Debian or Ubuntu systems.

## Download and Configure Siege

1.  Prior to installing any new programs, update your system:

		sudo apt-get update && sudo apt-get upgrade --show-upgraded

2.  Download the latest version of Siege (3.0.9 at the time of this publication), which is always available at [Siege's website](http://www.joedog.org/siege-home):

		wget http://download.joedog.org/siege/siege-latest.tar.gz

3.  Extract the program:

		tar -zxvf siege-latest.tar.gz

4.  Navigate to the Siege directory:

		cd siege-*/

5.  If the GNU Compiler Collection (gcc) is not installed, install now:

		sudo apt-get install build-essential

6.  Configure and complete the installation:

		./configure
		make
		sudo make install

7.  Generate a configuration file:

		siege.config

8.  Open the `.siegerc` file located in your home directory.

9.  The suggested Siege configuration is for 25 concurrent users over a period of 1 minute. Set a location for your log file. Be sure to uncomment the variables shown below, and any other commented settings you want to use by removing the pound sign (`#`):

	{{< file-excerpt "~/.siegerc" >}}
...

		#
		# Variable declarations. You can set variables here
		# for use in the directives below. Example:
		# PROXY = proxy.joedog.org
		# Reference variables inside ${} or $(), example:
		# proxy-host = ${PROXY}
		# You can also reference ENVIRONMENT variables without
		# actually declaring them, example:
		logfile = $(HOME)/siege.log

...

		#
		# Default number of simulated  concurrent users
		# ex: concurrent = 25
		#
		concurrent = 25

		#
		# Default duration of the siege.  The right hand argument has
		# a modifier which specifies the time units, H=hours, M=minutes,
		# and S=seconds. If a modifier is not specified, then minutes
		# are assumed.
		# ex: time = 50M
		#
		time = 1M


{{< /file-excerpt >}}


You are now ready to run Siege!

## Run Siege

To run Siege with the default settings, input the following command, replacing `www.example.com` with your domain name or IP address:

	siege www.example.com

Siege outputs the results:

	** SIEGE 2.70
	** Preparing 25 concurrent users for battle.
	The server is now under siege...
	Lifting the server siege...      done.
	Transactions:		        2913 hits
	Availability:		      100.00 %
	Elapsed time:		       59.51 secs
	Data transferred:	        0.41 MB
	Response time:		        0.00 secs
	Transaction rate:	       48.95 trans/sec
	Throughput:		        0.01 MB/sec
	Concurrency:		        0.04
	Successful transactions:        2913
	Failed transactions:	           0
	Longest transaction:	        0.01
	Shortest transaction:	        0.00

	FILE: /var/log/siege.log
	You can disable this annoying message by editing
	the .siegerc file in your home directory; change
	the directive 'show-logfile' to false.

If there are no failed connections and the availability remains at 100%, there are no problems.

## Further Configuring and Commands

###Creating a URL File

If you want Siege to hit a number of pages on your website at random, configure the program to read from a `urls.txt` file that lists the selected pages.

1.  Open the `urls.txt` file generally created at `/usr/local/etc/urls.txt`. Add a list of URLs or IP addresses to that file:

	{{< file "/usr/local/etc/urls.txt" >}}
# URLS file for siege
# --
# Format the url entries in any of the following formats:
# http://www.whoohoo.com/index.html
# http://www/index.html
# www/index.html
# http://www.whoohoo.com/cgi-bin/howto/display.cgi?1013
# Use the POST directive for pages that require it:
# http://www.whoohoo.com/cgi-bin/haha.cgi POST ha=1&ho=2
#      or POST content from a file:
# http://www.whoohoo.com/melvin.jsp POST </home/jeff/haha
# http://www.whoohoo.com/melvin.jsp POST <./haha
# You may also set and reference variables inside this file,
# for more information, man urls_txt
# -------------------------------------------------------

www.example.com
www.example.org
123.45.67.89


{{< /file >}}


2.  To run Siege with this file use the `siege` command:

		siege

	If using a separate file, run:

		siege -f your/file/path.txt

### Commands

Siege features a number of command line options to use when you want to deviate from the default configuration but do not wish to edit the file.

-  **`-c [num]`**: Set the number of concurrent users. Most web servers have less than a couple hundred users trying to access their website at the same time, so setting this to more than a few hundred is often not needed.

-  **`-t [num]`**: Set a time limit for which Siege runs. Siege can run with the modifiers `s` for seconds, `m` for minutes, or `h` for hours. There should be no space between the number and the modifier (`-t10s` not `-t10 s`).

- **`-d [num]`**: Set the delay for each Siege user. Each user is then delayed for a random amount of seconds in between 1 and the set number. The default value is 3.

-  **`-i`**: Used in conjunction with a URLs file, this causes each user to randomly hit one of the URLs, with no predetermined pattern. Similar to real life (the 'i' stands for "internet"), where you will not know where site visitors go, not all pages may be hit.

-  **`-v`**: Verbose output. This outputs the results Siege gets in real time before printing the final results.

-  **`-f [file]`**: Run Siege with a file containing a list of URLs that is not the default `urls.txt` file.
-  **`-g [url]`**: Pull down the HTTP headers.
-  **`-l`**: Generates a log file.
-  **`-m "[message]"`**: Include a message in the log file.
-  **`-C`**: Outputs Siege's current configuration profile.
-  **`-V`**: Outputs Siege's version information.
-  **`-h`**: Outputs help information.
