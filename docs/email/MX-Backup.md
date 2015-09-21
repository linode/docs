---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Quick introduction into hosting a Email Backup server with imapsync.'
keywords: 'email, backup, postfix, dovecot, mysql, imapsync, mx, email backup'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Weekday, September 21st, 2015'
modified: Weekday, September 21st, 2015
modified_by:
    name: Linode
title: 'Creating a E-Mail Backup Server'
contributor:
    name: Constantin Jacob
    link: https://www.twitter.com/Tzeejay
external-resources:
	- '[IMAPSYNC](http://imapsync.lamiral.info/)'
	- '[IMAPSYNC Github](https://github.com/imapsync/imapsync)'
---

{: .note}
>
> This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


Before beginning this guide you should ask yourself two questions:

1. Why would I want this?

and

2. Do I actually need this even if I don't run my own email servers?


The answers to these are  
you would want this in order to have control over your own destiny  
and  
yes you do want this even if you do not host your own email servers data corruption can happen even in the best systems. There is no number of engineers high enough to prevent any of that. 

This guide is for everyone who has critical information in any shape or form in their email inbox. From technical documentation you can never get a hold on again to your photos you can't afford to loose (kids, family you name it). The very first answer to all of this would and should be: don't leave stuff that is this important on any email server, ever. It's not the right medium and or system to store data indefinability. But as we all know this isn't always possible, or we forget about it or your server might even crash or corrupt files before you get a chance to do so.  
This is why automated email backups are important to everyone!

And it isn't even that hard to do. Thanks to IMAP being a standart and everyone supporting it as the legacy access to their email servers next to their fancy new http based APIs it is possible for us to use great open source tools like imapsync to quickly create a copy.

## Prerequesities
In order to setup a backup MX Server you should first consult the guides on how [Getting Started](/docs/gettings-started) how to secure your linode and how to setup a working email server with [mySQL, Dovecot and Postfix](/docs/email/email-with-postfix-dovecot-and-mysql).

### Bonus
If you want to make your life easier you should go and take a look at how to setup [phpmyadmin](/docs/databases/mysql/mysql-phpmyadmin-ubuntu-14-04) in order to more easily maintain your TLDs and users.
If you would like to have easier access to the emails, for quick check ups for example, having something like [Roundcube](https://roundcube.net) or [Horde](http://www.horde.org/apps/webmail) installed is also a bonus. It will make everything easier and you don't waste more than 15 minutes on it.


## IMAPSYNC
[imapsync](http://imapsync.lamiral.info) is a command line tool written in Perl by Gilles Lamiral from France. You can buy it off of his [website](http://imapsync.lamiral.info/) and get lifetime instant updates and support (not instant) or you could use the open source version off of Github.com which he updates to the latest version usually a couple days or weeks later. So it is pretty fair use.


{: .note}
>
> For this guide we will use the Github version. You should really go and buy it though if you really like it. It's a great tool and the maintainer is really nice.


### Installing imapsync

We will get a copy of imapsync off of Github with the help of git which comes pre-installed with a lot of Linux distributions nowadays.

	`git clone https://github.com/imapsync/imapsync.git`
	
At this point we would just run the programm but it depends on a couple of perl libraries which might have to be installed first. Monsieur Lammiral has a list with a couple of Linux distributions and how to install the dependencies in his Github repo.

{: .note}
>
> You should take a look at it if you use something different than Debian/Ubuntu. [Here](https://github.com/imapsync/imapsync/tree/master/INSTALL.d)

	sudo apt-get install \ 
	libauthen-ntlm-perl \ 
	libcrypt-ssleay-perl \ 
	libdigest-hmac-perl \ 
	libfile-copy-recursive-perl \ 
	libio-compress-perl \ 
	libio-socket-inet6-perl \ 
	libio-socket-ssl-perl \ 
	libio-tee-perl \ 
	libmail-imapclient-perl \ 
	libmodule-scandeps-perl \ 
	libnet-ssleay-perl \ 
	libpar-packer-perl \ 
	libterm-readkey-perl \ 
	libtest-pod-perl \ 
	libtest-simple-perl \ 
	libunicode-string-perl \ 
	liburi-perl

After that run 

	`cpan Data:Uniqid`
	
Now you can run the smoke test. If it succeeds it will print some useful information about the imapsync version you are using and then the help page just as if you used `imapsync`.

	`./imapsync`

If all is working fine copy it into the right directory so that it is accessible from everywhere 

	`cp imapsync /usr/bin/`
	
Test your installation of imapsync by typing `imapsync` in order to get a full printout of the features it offers (there are a lot of features).



## Automate your backup
If you have read through the feature list you might have noticed that   
a. there are quite some information you have to enter in order to get it to work   
and  
b. it doesn't say anything about repetitive syncing or automation. So how does this work?

The answer to this is quite easy: Bash scripts and Cron jobs. That might be a little "primitive" but truth be told both are very reliable and easy to setup. If you do not already know about Cron you should take a look at the intro guide in the [Linode library](/docs/tools-reference/tools/schedule-tasks-with-cron).

All Cron does is basically wake up every minute, check all tasks, see if they apply to the current minute in time and if so it runs them.

### Writing the script

First we need to write our little shell script. In it we will only put the imapsync command which will sync the emails and the prints all of it into a single log file and after that enters a couple of line breaks and info into the given log file.

{: .caution}
>
> You might have to create the imapsync folder under `/var/log` first using `mkdir /var/log/imapsync`. Otherwise you will not be able to get the logging working.

{: .file}
~/cron-imapsync.sh 
:	~~~ bash
	#! /bin/bash
	
	# This will sync your first email account automatically.
	
	imapsync --host1 youremailprovider.com --user1 youruser --password1 yourpassword --tls1 \
	--host2 backup.yourdomain.com --user2 yourbackupuser --password2 yourbackupuserpassword --tls2 \
	--nolog 2>&1 | tee -a /var/log/imapsync/imapsync.log
	
	echo "\n \n ///// \n \n End of the first transfer \n \n ///// \n \n" >> /var/log/imapsync/imapsync.log
	
	
	# Copy and paste the above block as many times as you need to and replace all the values for the email servers (--host1 / --host2), users (--user1 / --user2) and password flags (--password1 / --password2).
	~~~

After that we need to make the script executable with `chmod -x ~/cron-imapsync.sh`. You can move the script wherever you feel like but it needs to be accessible by cron.

### Cron

Setting up Cron is actually quite simple. Open the editor with  
	`crontab -e`  
if you have never opened Cron before it will prompt you to pick the editor you want to use. Pick the one you prefer and then add the following at the end of the file.

{: .file-excerpt}
:	~~~
	* 0 * * * sh /path-to-where-you-put-the-script
	~~~
	
This entry into the cron configuration file will execute the shell script every day at midnight. That way you will have a daily backup of all your email accounts.

{: .caution}
>
> imapsync should not be seen as a two way sync tool. It only copies all the emails that are new to it from the first server to the second server. Everything else is ignored. Alternatives to this are listed on [imapsyncs github page](https://github.com/imapsync/imapsync).
