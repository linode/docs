
author:
 name: Sunday Ogwu
 email: finid@vivaldi.net
contributor:
 name: Sunday Ogwu
description: 'Install and configure OSSEC HIDS on Debian 7'
keywords: 'IDS, Intrusion Detection System'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Friday, February 5th, 2015
modified_by:
 name: James Stewart
published: ''
title: Install and configure OSSEC HIDS on Debian 7
---


# How to Install and Configure OSSEC HIDS on Debian 7

# Introduction

OSSEC is an open-source, host-based intrusion detection system (HIDS) that performs log analysis, integrity checking, Windows registry monitoring, rootkit detection, time-based alerting, and active response. If you want to keep an eye on what's happening in your server (and you should), OSSEC is the tool you need to install.

When installed and properly configured, OSSEC will give you a real-time view of what's taking place in your server. And it can be used to monitor one server or thousands of servers in a server/agent mode.

In this tutorial, I'll show you how to install and configure OSSEC to monitor one Linode server running Debian 7 in such a manner that if a file is modified, added or deleted, OSSEC will notify you by email - in real-time. OSSEC will also send an alert if the server starts listening on a new port, aside from other activities that OSSEC will alert on.

Here, for example, are sample email alerts from OSSEC sent from the test server used to write this tutorial:


```
OSSEC HIDS Notification.
2015 Jan 30 09:57:54

Received From: deft->syscheck
Rule: 553 fired (level 7) -> "File deleted. Unable to retrieve checksum."
Portion of the log(s):

File '/home/user5/footer.php' was deleted. Unable to retrieve checksum.

 --END OF NOTIFICATION

```

Or this:

```
OSSEC HIDS Notification.
2015 Jan 30 09:19:16

Received From: deft->/var/log/dpkg.log
Rule: 2902 fired (level 7) -> "New dpkg (Debian Package) installed."
Portion of the log(s):

2015-01-30 09:19:14 status installed nginx-common:all 1.2.1-2.2+wheezy3


 --END OF NOTIFICATION

```

# Prerequisites

To install OSSEC on a Linode server running Debian 7, you, of course, need to have access to such a server. If that requirement has been met, you then need to:

- Complete the relevant tasks in this [Getting Started](https://www.linode.com/docs/getting-started) guide

- Follow that up by also completing the relevant tasks in [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/). Especially important in that guide is the part on enabling the firewall. On Linux, OSSEC needs an active IPTables firewall for its active response feature to work.

- Install `inotify-tools` and `build-essential`. OSSEC needs the first for real-time alerts and alerting on file deletions, while the latter is for compiling OSSEC. You can install both packages using:

```
sudo apt-get install inotify-tools build-essential
```


# Download and Verify OSSEC

Debian 7 does not have an installation candidate for OSSEC in its repository, so you'll have to download the latest OSSEC package and its checksum file from the project's download page. To download the latest OSSEC tarball, use:


```
wget -U http://www.ossec.net/files/ossec-hids-2.8.1.tar.gz
```

To download the checksum file, type:

```
wget -U http://www.ossec.net/files/ossec-hids-2.8.1-checksum.txt
```

**NOTE: Check the project's download page for the latest version.**

To verify that the downloaded tarball has not been tampered with, first verify the MD5 checksum using:


```
md5sum -c ossec-hids-2.8.1-checksum.txt
```

You should get an output of this sort:

```
ossec-hids-2.8.1.tar.gz: OK
md5sum: WARNING: 1 line is improperly formatted
```

Then verify the SHA1 checksum using:


```
sha1sum -c ossec-hids-2.8.1-checksum.txt
```

The expected output is:

```
ossec-hids-2.8.1.tar.gz: OK
sha1sum: WARNING: 1 line is improperly formatted
```

In both outputs, ignore the **WARNING** line. What you're really looking for is the **OK** line. If that's present in the output, then you're good to go.



# Install OSSEC

After downloading and verifing OSSEC, the next task is to install it. Since it's a tarball, untar it using:


```
tar xf ossec-hids-2.8.1.tar.gz
```

It will be unpacked into a directory called `ossec-hids-2.8.1` or whatever the version number of OSSEC you downloaded. Change (`cd`) into that directory, then start the installation process using:


```
sudo ./install.sh
```

The first installation step will prompt you to select the language. If your language is the default (English - [en]), then just press **ENTER**. Otherwise, type in the 2-letter code for your language from the list of supported languages. After that, you should see:


```
OSSEC HIDS v2.8 Installation Script - http://www.ossec.net

 You are about to start the installation process of the OSSEC HIDS.
 You must have a C compiler pre-installed in your system.
 If you have any questions or comments, please send an e-mail
 to dcid@ossec.net (or daniel.cid@gmail.com).

  - System: Linux deft 3.18.3-x86_64-linode51
  - User: root
  - Host: deft


  -- Press ENTER to continue or Ctrl-C to abort. --
```

Press **ENTER**. You should now see:


```
1- What kind of installation do you want (server, agent, local, hybrid or help)?

You have these installation options: server, agent, local, or hybrid.

 ...

1- What kind of installation do you want (server, agent, local, hybrid or help)? local
```

The right choice is **local**, which enables OSSEC to monitor the server it is been installed on.  After that, select the defaults for subsequent options. Note that the email you specify has to be a valid one, because all OSSEC alerts will be sent to it. If installation is successful, you should see:


```
- System is Debian (Ubuntu or derivative).
 - Init script modified to start OSSEC HIDS during boot.

 - Configuration finished properly.

 - To start OSSEC HIDS:
                /var/ossec/bin/ossec-control start

 - To stop OSSEC HIDS:
                /var/ossec/bin/ossec-control stop

 - The configuration can be viewed or modified at /var/ossec/etc/ossec.conf


    Thanks for using the OSSEC HIDS.
    If you have any question, suggestion or if you find any bug,
    contact us at contact@ossec.net or using our public maillist at
    ossec-list@ossec.net
    ( http://www.ossec.net/main/support/ ).

    More information can be found at http://www.ossec.net

    ---  Press ENTER to finish (maybe more information below). ---
```

Press **ENTER** to finish. OSSEC is now installed. The next task is to configure it.


# Configure OSSEC

OSSEC is chrooted to the `/var/ossec` directory, and its configuration file is `ossec.conf` in the `/var/ossec/etc` directory. There are several modifications that you'll need to make in `ossec.conf`. They are:

1. Email Settings

2. Configure OSSEC to alert on new files

3. Directories to monitor

4. Files and directories to ignore

5. Active response block times

6. Rules for new files


Since you need to be root to access the installation directory, type:


```
sudo su
```

After that, `cd` into `/var/ossec/etc`.


## Customize Email Settings

Though you specified an email and OSSEC auto-discovered the SMTP server, there are a few changes you can make to the email settings. To start open `ossec.conf` with `nano` or your favorite text editor. The email settings are at the top of that file. The Default settings should be:


```
<global>
    <email_notification>yes</email_notification>
    <email_to>loginName@emailprovider.com</email_to>
    <smtp_server>mail.emailprovider.com.</smtp_server>
    <email_from>ossecm@hostname</email_from>
</global>

```

The **< email_to >** entry is the email you specified during installation. That's the address OSSEC will send alerts to. Like every setting in the file, it can be changed at any time. The **< email_from >** is where OSSEC's alerts would appear to be coming from. If you don't change the default, some SMTP servers will mark email alerts as Spam, so this is one setting you want to modify. The code block below shows what a modified email settings should appear:


```
<global>
    <email_notification>yes</email_notification>
    <email_to>loginName@emailprovider.com</email_to>
    <smtp_server>mail.emailprovider.com.</smtp_server>
    <email_from>loginName@emailprovider.com</email_from>
</global>

```

That just shows that the **< email_to >** and **< email_from >** can be the same. If you are running your own mail server and it's on the same server as the one OSSEC is installed, you may change the **< smtp_server >** setting to **localhost**, so that it appears like this:

```
<global>
    <email_notification>yes</email_notification>
    <email_to>loginName@emailprovider.com</email_to>
    <smtp_server>localhost</smtp_server>
    <email_from>loginName@emailprovider.com</email_from>
</global>

```

After making changes to the email settings, save and close the file. Follow that up by starting OSSEC using:


```
/var/ossec/bin/ossec-control start

```

If your current working directory is `/var/ossec/etc`, you may just type:


```
../bin/ossec-control start

```

After OSSEC has started, check your Inbox for the first alert from OSSEC. The body should contain:


```
OSSEC HIDS Notification.
2015 Jan 30 08:22:52

Received From: deft->ossec-monitord
Rule: 502 fired (level 3) -> "Ossec server started."
Portion of the log(s):

ossec: Ossec started.


 --END OF NOTIFICATION

```

If you get that first email, then you know that your email settings are working and subsequent alerts will also hit your Inbox.


## Configure OSSEC to Alert on New Files

By default OSSEC will not send out an alert when a new file is added to the system. To change that, open `ossec.conf` and scroll  down to the section that contains:


```
<syscheck>
    <!-- Frequency that syscheck is executed - default to every 22 hours -->
    <frequency>79200</frequency>

```

Modify it to:


```
<syscheck>
    <!-- Frequency that syscheck is executed - default to every 22 hours -->
    <frequency>79200</frequency>

    <alert_new_files>yes</alert_new_files>
```

Note that the **< frequency >** is the interval that OSSEC performs a system check. During testing, you may reduce that setting to a lower number, like 900. Afterwards, you can change it back to the default. That's one setting that OSSEC needs to alert on new files. The other setting is in a different file, but we'll get to that later. The next two sections that you'll need to modify are also in `ossec.conf`, so keep it open.


## Modify Directories to Monitor

Below the **< frequency >** setting is a list of system directories that OSSEC has been configured to monitor. By default, they are:


```
<!-- Directories to check  (perform all possible verifications) -->
<directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories check_all="yes">/bin,/sbin</directories>
```

You can tell OSSEC to check your home directory and, if you're hosting a website on the server, to also monitor the website's data directory. For the specified directories, you may also tell OSSEC to report changes and to do so in real-time. When finished, that section should appear like this:

```
<!-- Directories to check  (perform all possible verifications) -->
<directories report_changes="yes" realtime="yes" check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/bin,/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/home/username,/var/www</directories>

```

Another directory you may configure OSSEC to monitor is `/var/ossec`, OSSEC's installation directory. However, if you do that, you **must** configure OSSEC to ignore certain directories within `/var/ossec`. Otherwise, your 24 GB system will run out of disk space in less than an hour.

If you've finished with the directories to monitor, scroll down to the **Files/directories to ignore** section.


## Modify Files and Directories to Ignore

For a Linux system, the default list of files and directories to ignore are:


```
<!-- Files/directories to ignore -->
    <ignore>/etc/mtab</ignore>  
    <ignore>/etc/mnttab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore>/etc/mail/statistics</ignore>
    <ignore>/etc/random-seed</ignore>
    <ignore>/etc/adjtime</ignore>
    <ignore>/etc/httpd/logs</ignore>
    <ignore>/etc/utmpx</ignore>
    <ignore>/etc/wtmpx</ignore>
    <ignore>/etc/cups/certs</ignore>
    <ignore>/etc/dumpdates</ignore>
    <ignore>/etc/svc/volatile</ignore>
```


That's comprehensive, but if you configured OSSEC to monitor `/var/ossec`, modify that section to:


```
<!-- Files/directories to ignore -->
    <ignore>/etc/mtab</ignore>  
    <ignore>/etc/mnttab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore>/etc/mail/statistics</ignore>
    <ignore>/etc/random-seed</ignore>
    <ignore>/etc/adjtime</ignore>
    <ignore>/etc/httpd/logs</ignore>
    <ignore>/etc/utmpx</ignore>
    <ignore>/etc/wtmpx</ignore>
    <ignore>/etc/cups/certs</ignore>
    <ignore>/etc/dumpdates</ignore>
    <ignore>/etc/svc/volatile</ignore>

    <ignore>/var/ossec/logs</ignore>
    <ignore>/var/ossec/queue</ignore>
    <ignore>/var/ossec/var</ignore>
    <ignore>/var/ossec/tmp</ignore>
    <ignore>/var/ossec/stats</ignore>
```

The last five lines are OSSEC's directories that change too often. After finishing with that section, scroll down to the **Active Response Config** section.


## Modify Active Response Block Times

OSSEC uses tcpwrappers (`host.deny`) and the firewall (IPTables in Linux) to ban an IP address that triggers an alert. By default, such IP addresses are blocked for 600 seconds, or 10 minutes. You may change that to a much longer timeframe. My response to criminals that try to access my server is to block them for as long as possible, so on my systems, the block times are usually much longer, close to 24 hours.

If you're like that too, you may change the **< timeout >** setting to suit. Note that it has to be in **seconds**. The defaults are shown in this code block:


```
<!-- Active Response Config -->
<active-response>

    <command>host-deny</command>
    <location>local</location>
    <level>6</level>
    <timeout>600</timeout>
  </active-response>


<active-response>

    <command>firewall-drop</command>
    <location>local</location>
    <level>6</level>
    <timeout>600</timeout>
</active-response>
```

after making those changes, save and close the file.



# Modify Rule for New Files

OSSEC's rules are in the `/var/ossec/rules` directory, so you'll have to `cd` into it. The rules are in a bunch of XML files and all rule definitions are in the `ossec_rules.xml` file, which, like most of the other files under that directory, are not supposed to be modified. All rule modifications must be made in `local_rules.xml`.

The rule that fires on new files is rule number **554**. The chunk of code that defines that rule in `ossec_rules.xml` is:


```
<rule id="554" level="0">
<category>ossec</category>
<decoded_as>syscheck_new_entry</decoded_as>
<description>File added to the system.</description>
<group>syscheck,</group>
</rule>
```

Since OSSEC does not alert on rules that are of **level 0**, that rule has to be modified so that OSSEC can fire when a new file is added to the system. The modified chunk of code should be:


```
<rule id="554" level="7" overwrite="yes">
<category>ossec</category>
<decoded_as>syscheck_new_entry</decoded_as>
<description>File added to the system.</description>
<group>syscheck,</group>
</rule>
```

Copy that into the `local_rules.xml` file. Paste it at the end of the file and within the **< group > ... < /group >** tag. When finished, the end of the file should look like this:


```
<rule id="554" level="7" overwrite="yes">
    <category>ossec</category>
    <decoded_as>syscheck_new_entry</decoded_as>
    <description>File added to the system.</description>
    <group>syscheck,</group>
  </rule>


</group> <!-- SYSLOG,LOCAL -->


<!-- EOF -->

```

Save and close the file.


# Restarting OSSEC

After any modification is made to OSSEC, it has to be restarted, which you accomplish by typing:


```
/var/ossec/bin/ossec-control restart
```

If it restarts, you'll see this type of output:


```
Killing ossec-monitord ..
Killing ossec-logcollector ..
Killing ossec-syscheckd ..
Killing ossec-analysisd ..
Killing ossec-maild ..
Killing ossec-execd ..
OSSEC HIDS v2.8 Stopped
Starting OSSEC HIDS v2.8 (by Trend Micro Inc.)...
Started ossec-maild...
Started ossec-execd...
Started ossec-analysisd...
Started ossec-logcollector...
Started ossec-syscheckd...
Started ossec-monitord...
Completed.

```

Otherwise, you'll see an output of this sort:


```
Starting OSSEC HIDS v2.8 (by Trend Micro Inc.)...
ossec-analysisd: Configuration error. Exiting.
```

If that happens, check OSSEC's error log. Entries in there will tell you exactly why it failed to restart. Even if OSSEC restarts successfully, check the error log. It might contain other errors that don't prevent OSSEC from restarting, but which needs your attention. The error log file is `ossec.log` under the `/var/ossec/logs` directory.



# What to Expect

After you've made the final modification and OSSEC has been restarted, you should get another alert saying that OSSEC has started. You will, in fact, get an alert every time OSSEC is restarted. And if any rule is triggered after that, you'll also be getting this type of alert in your Inbox:


```
OSSEC HIDS Notification.
2015 Jan 30 09:57:06

Received From: deft->syscheck
Rule: 550 fired (level 7) -> "Integrity checksum changed."
Portion of the log(s):

Integrity checksum changed for: '/home/finid/sidebar.php'
Size changed from '0' to '19'
What changed:
0a1

    this is a php file

Old md5sum was: 'd41d8cd98f00b204e9800998ecf8427e'
New md5sum is : 'df4f22f84b5ceb2c31cbb391883f2c83'
Old sha1sum was: 'da39a3ee5e6b4b0d3255bfef95601890afd80709'
New sha1sum is : '297b920c943134074690344a3da83f19483a93ef'

 --END OF NOTIFICATION

```

And like this:


```
OSSEC HIDS Notification.
2015 Jan 30 09:26:02

Received From: deft->netstat -tan |grep LISTEN |grep -v 127.0.0.1 | sort
Rule: 533 fired (level 7) -> "Listened ports status (netstat) changed (new port opened or closed)."
Portion of the log(s):

ossec: output: 'netstat -tan |grep LISTEN |grep -v 127.0.0.1 | sort':
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:43157           0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp6       0      0 :::111                  :::*                    LISTEN
tcp6       0      0 ::1:25                  :::*                    LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
tcp6       0      0 :::53262                :::*                    LISTEN
Previous output:
ossec: output: 'netstat -tan |grep LISTEN |grep -v 127.0.0.1 | sort':
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:43157           0.0.0.0:*               LISTEN
tcp6       0      0 :::111                  :::*                    LISTEN
tcp6       0      0 ::1:25                  :::*                    LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
tcp6       0      0 :::53262                :::*                    LISTEN


 --END OF NOTIFICATION

```


# More Information

There's more to OSSEC than I've covered in this tutorial, but this should give you a taste of what OSSEC has to offer. More complex configurations  are possible, but we'll save that for another tutorial. For more information about OSSEC, visit the projects website at [http://www.ossec.net/](http://www.ossec.net).

