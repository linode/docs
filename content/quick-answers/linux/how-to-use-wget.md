---
author:
  name: Angel
  email: docs@linode.com
description: 'This Quick Answer guide will explain how to use wget.'
keywords: ["linux", "how to", "grep", "wget"]
aliases: ['quick-answers/how-to-use-wget/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-06-12
modified_by:
  name: Angel
published: 2017-06-19
title: How to Use Wget
external_resources:
 - '[Windows Wget Download](http://gnuwin32.sourceforge.net/packages/wget.htm)'
 - '[Arch Wiki](https://wiki.archlinux.org/index.php/wget)'
 - '[Gentoo](https://packages.gentoo.org/packages/net-misc/wget)'

---


[GNU Wget](https://www.gnu.org/software/wget/) is a non-interactive tool for downloading files from the internet. Wget is a mature package with a robust set of features. Typically wget is used to retrieve the latest packages from HTTP or FTP repositories.

The noninteractive nature of Wget makes it perfect for use in automatic scripts. This guide will walk you through downloading the [Linode Speed Test files](https://www.linode.com/speedtest) by using wget.


{{< note >}}
Depending on your operating system or distribution, you may need to download wget. Wget exists in every package manager and on every operating system. At the end of this guide
you will find resources for getting wget on your machine.
{{< /note >}}

## Use Wget to Download Speedtest Files

Picking the right location for your Linode is important, you have to decide what facility is closest to you and your clients. Linode offers a series of [Linode Speed test files](https://www.linode.com/speedtest). By using wget, you can test your connection speed with each of these clients.


1. To download one file using wget, use only `wget <url>`:

		wget http://speedtest.newark.linode.com/100MB-newark.bin

	As the download begins, a small progress bar will appear with information about the download:


		HTTP request sent, awaiting response... 200 OK
		Length: 104857600 (100M) [application/octet-stream]
		Saving to: ‘100MB-newark.bin’

		100%[======================================>] 104,857,600  202MB/s   in 0.5s

		2017-06-23 13:13:19 (202 MB/s) - ‘100MB-newark.bin’ saved [104857600/104857600]

2. Write the output of Wget to a file using the `-O` option.

		wget -O Newark http://speedtest.newark.linode.com/100MB-newark.bin

	After the download completes, you will receive this message:

		2017-06-23 13:24:21 (48.4 MB/s) - ‘newark’ saved [104857600/104857600]

	You can also log the output of a file with `-o` as in:

		wget -o newarkTest http://speedtest.newark.linode.com/100MB-newark.bin

	Wget will then make a file and log the download information inside of it:


	{{< file "newarkTest" >}}
02350K .......... .......... .......... .......... ..........100%  457M 0s
102400K                                                       100% 0.00 =0.6s

2017-06-23 13:31:54 (179 MB/s) - ‘100MB-newark.bin.2’ saved [104857600/104857600]

{{< /file >}}


3. If you are trying to download a large file, wget offers the `-b` option for downloading in the background:

	   wget -b http://speedtest.newark.linode.com/100MB-newark.bin
	   Continuing in background, pid 8764.
	   Output will be written to ‘wget-log’.

   If the file is too large, or you need to resume the download at a later time, you can use the `-c` option to `c`ontinue the download:

	   wget -c http://speedtest.newark.linode.com/100MB-newark.bin






