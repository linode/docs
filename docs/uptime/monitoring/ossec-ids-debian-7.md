---
author:
  name: Sunday Ogwu-Chinuwa
  email: finid@vivaldi.net
contributor:
  name: Sunday Ogwu-Chinuwa
  link: https://github.com/finid
description: 'Install and configure OSSEC HIDS on Debian 7'
keywords: ["IDS", " Intrusion Detection System"]
aliases: ['security/ossec-ids-debian-7']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-02-05
modified_by:
  name: James Stewart
title: Install and Configure OSSEC on Debian 7
external_resources:
 - '[http://www.ossec.net/](http://www.ossec.net)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

---

OSSEC is an open-source, host-based intrusion detection system (**HIDS**) that performs log analysis, integrity checking, rootkit detection, time-based alerting, and active response, making it an ideal choice for server monitoring.

When installed and configured, OSSEC will provide a real-time view of what's taking place in your server or servers in a server/agent mode.

This guide covers how to install and configure OSSEC on a single Linode running Debian 7 in such a manner that if a file is modified, added or deleted, OSSEC will notify you by email in real-time. OSSEC can also provide notifications for other acitivies.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

1.  Complete the [Getting Started](/docs/getting-started) guide.

2.  Follow the [Securing Your Server](/docs/security/securing-your-server/) guide. It is especially important to create and enable a firewall. On Linux, OSSEC needs an active iptables firewall for its active response feature to work.

3.  Install `inotify-tools` and `build-essential`. OSSEC needs the first for real-time alerts and alerts on file deletions, while the latter is for compiling OSSEC. You can install both packages using:

        sudo apt-get install inotify-tools build-essential

## Download and Verify OSSEC

Debian 7 does not have an installation candidate for OSSEC in its repository, so it will need to be downloaded from the project's [download page](http://ossec.github.io/downloads.html).

1.  Download the latest OSSEC tarball (2.8.3 at the time of this guide's publication):

        wget -U https://bintray.com/artifact/download/ossec/ossec-hids/ossec-hids-2.8.3.tar.gz

2.  Download the checksum file:

        wget -U http://ossec.wazuh.com/vm/ossec-vm-2.8.3-checksum.txt

3.  Verify that the downloaded tarball has not been tampered with using the MD5 checksum:

        md5sum -c ossec-vm-2.8.3-checksum.txt

    The expected output is:

        ossec-hids-2.8.3.tar.gz: OK
        md5sum: WARNING: 1 line is improperly formatted

4.  Verify the SHA1 checksum:

        sha1sum -c ossec-hids-2.8.3-checksum.txt

    The expected output is:

        ossec-hids-2.8.3.tar.gz: OK
        sha1sum: WARNING: 1 line is improperly formatted


    {{< note >}}
In both outputs, ignore the **WARNING** line. As long as the first line reads **OK**, the file is good.
{{< /note >}}

## Install OSSEC

1.  Untar the file:

        tar xf ossec-hids-2.8.3.tar.gz

2.  Change to the newly-created directory, then run the install:

        cd ossec-hids-2.8.3
        sudo ./install.sh

3.  Select your language. If your language is the default (English - [en]), press `Return`; otherwise, type in the 2-letter code for your language from the list of supported languages:

        OSSEC HIDS v2.8 Installation Script - http://ossec.github.io/

         You are about to start the installation process of the OSSEC HIDS.
         You must have a C compiler pre-installed in your system.
         If you have any questions or comments, please send an e-mail
         to dcid@ossec.net (or daniel.cid@gmail.com).

          - System: Linux deft 3.18.3-x86_64-linode51
          - User: root
          - Host: deft

          -- Press ENTER to continue or Ctrl-C to abort. --

4.  Press **ENTER**. You should now see:

        1- What kind of installation do you want (server, agent, local, hybrid or help)?

        You have these installation options: server, agent, local, or hybrid.

         ...

        1- What kind of installation do you want (server, agent, local, hybrid or help)? local

5.  Choose **local**, which enables OSSEC to monitor the server it has been installed on. Select the defaults for subsequent options. Note that the email you specify has to be a valid one, because all OSSEC alerts will be sent to it. If installation is successful, you should see:

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

    Press **ENTER** to finish. OSSEC is now installed, and ready to be configured.

## Configure OSSEC

OSSEC is chrooted to the `/var/ossec` directory, and its configuration file is `ossec.conf`, in the `/var/ossec/etc` directory. There are several modifications that you will need to make in `ossec.conf`, including:

-   Email Settings

-   Configure OSSEC to alert on new files

-   Directories to monitor

-   Files and directories to ignore

-   Active response block times

-   Rules for new files


Use the `sudo su` command to gain root access to the directory:

    sudo su

Switch to the `/var/ossec/etc` directory.

### Customize Email Settings

Although you specified an email and OSSEC auto-discovered the SMTP server, there are a few changes that can be made to the email settings.

1.  Open `ossec.conf`. The email settings are at the top of the file:

    {{< file-excerpt "ossec.conf" >}}
<global>
  <email_notification>yes</email_notification>
  <email_to>loginName@example.com</email_to>
  <smtp_server>mail.example.com.</smtp_server>
  <email_from>ossecm@hostname</email_from>
</global>

{{< /file-excerpt >}}


    The `< email_to >` entry is the email specified during installation. That is the address in which OSSEC will send alerts, and can be changed at any time. The `< email_from >` entry is where OSSEC's alerts will appear to be sent from. If you do not change the default, some SMTP servers will mark the email alerts as spam.

2.  Modify the `< email_from >` line:

    {{< file-excerpt "ossec.conf" >}}
<global>
  <email_notification>yes</email_notification>
  <email_to>loginName@example.com</email_to>
  <smtp_server>mail.example.com.</smtp_server>
  <email_from>loginName@example.com</email_from>
</global>

{{< /file-excerpt >}}


    {{< note >}}
The `< email_to >` and `< email_from >` values can be the same. If you are running your own mail server and it's on the same server that OSSEC is installed, you may change the `< smtp_server >` value to `localhost`.
{{< /note >}}

    After making changes to the email settings, save and close the file.

3.  Start OSSEC:

        /var/ossec/bin/ossec-control start

    If the current working directory is `/var/ossec/etc`, you can use:

        ../bin/ossec-control start

4.  After OSSEC has started, check your inbox for the first alert from OSSEC:

        OSSEC HIDS Notification.
        2015 Jan 30 08:22:52

        Received From: deft->ossec-monitord
        Rule: 502 fired (level 3) -> "Ossec server started."
        Portion of the log(s):

        ossec: Ossec started.

         --END OF NOTIFICATION

    If the email is received, then the settings are working and subsequent alerts will also hit your inbox.


### Configure OSSEC to Alert on New Files

By default OSSEC will not send out an alert when a new file is added to the system.

1.  Open `ossec.conf` and scroll  down to the following section:

    {{< file-excerpt "ossec.conf" >}}
<syscheck>
  <!-- Frequency that syscheck is executed - default to every 22 hours -->
  <frequency>79200</frequency>

{{< /file-excerpt >}}


2.  Modify the file:

    {{< file-excerpt "ossec.conf" >}}
<syscheck>
  <!-- Frequency that syscheck is executed - default to every 22 hours -->
  <frequency>79200</frequency>

  <alert_new_files>yes</alert_new_files>

{{< /file-excerpt >}}


    Note that the `< frequency >` is the interval that OSSEC performs a system check. During testing, you may reduce that setting to a lower number, like 900. Afterwards, it can be changed back to the default.


### Modify Directories to Monitor

1.  Open `ossec.conf`. Below the `< frequency >` setting is a list of system directories that OSSEC has been configured to monitor:

    {{< file-excerpt "ossec.conf" >}}
<!-- Directories to check  (perform all possible verifications) -->
<directories check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories check_all="yes">/bin,/sbin</directories>

{{< /file-excerpt >}}


2.  OSSEC can check the home directory and, if hosting a website on the server, monitor the website's data directory. For the specified directories, OSSEC can be configured to report changes in real-time:

    {{< file-excerpt "ossec.conf" >}}
<!-- Directories to check  (perform all possible verifications) -->
<directories report_changes="yes" realtime="yes" check_all="yes">/etc,/usr/bin,/usr/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/bin,/sbin</directories>
<directories report_changes="yes" realtime="yes" check_all="yes">/home/username,/var/www</directories>

{{< /file-excerpt >}}


3.  Another directory you may want to configure OSSEC to monitor is `/var/ossec`, OSSEC's installation directory. However, if monitored, OSSEC **must** be configured to ignore certain directories within `/var/ossec`, otherwise you risk running out of disk space.

### Modify Files and Directories to Ignore

For a Linux system, the default list of files and directories to ignore are:

{{< file-excerpt "ossec.conf" >}}
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

{{< /file-excerpt >}}


If OSSEC is configured to monitor `/var/ossec`, include the additional lines:

{{< file-excerpt "ossec.conf" >}}
<ignore>/var/ossec/logs</ignore>
<ignore>/var/ossec/queue</ignore>
<ignore>/var/ossec/var</ignore>
<ignore>/var/ossec/tmp</ignore>
<ignore>/var/ossec/stats</ignore>

{{< /file-excerpt >}}


### Modify Active Response Block Times

OSSEC uses tcpwrappers (`host.deny`) and iptables to ban any IP addresses that trigger an alert. By default, such IP addresses are blocked for 600 seconds, or 10 minutes. This can be changed to a longer timeframe.

To alter the timeframe of a ban, change the  `< timeout >` setting to suit. Note that it has to be in **seconds**:

{{< file-excerpt "ossec.conf" >}}
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

{{< /file-excerpt >}}


After making changes, save and close the file.

### Modify Rule for New Files

1.  Move to the `/var/ossec/rules` directory:

        cd /var/ossec/rules

    The rules are located in a series of XML files and all rule definitions are found in `ossec_rules.xml`, which should not be modified. All rule modifications must be made in `local_rules.xml`.

2.  The rule that fires on new files is rule number **554**. The chunk of code that defines that rule in `ossec_rules.xml` is:

    {{< file-excerpt "ossec_rules.xml" >}}
<rule id="554" level="0">
  <category>ossec</category>
  <decoded_as>syscheck_new_entry</decoded_as>
  <description>File added to the system.</description>
  <group>syscheck,</group>
</rule>

{{< /file-excerpt >}}


3.  Since OSSEC does not alert on rules that are **level 0**, that rule has to be modified in `local_rules.xml` so that OSSEC can fire when a new file is added to the system. The rule modification should be located between the `< group > ... < /group >` tags:

    {{< file-excerpt "local_rules.xml" >}}
<rule id="554" level="7" overwrite="yes">
  <category>ossec</category>
  <decoded_as>syscheck_new_entry</decoded_as>
  <description>File added to the system.</description>
  <group>syscheck,</group>
</rule>

        </group> <!-- SYSLOG,LOCAL -->


        <!-- EOF -->

{{< /file-excerpt >}}


5.  Save and close the file.

## Restarting OSSEC

After any modification is made to OSSEC, it has to be restarted:

    /var/ossec/bin/ossec-control restart

If it restarts with no errors, it will output the following:

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

Otherwise, you will receive a configuration error:

    Starting OSSEC HIDS v2.8 (by Trend Micro Inc.)...
    ossec-analysisd: Configuration error. Exiting.

If this happens, check OSSEC's error log. It is advised to check the error log even if OSSEC restarts successfully, because may contain other errors that don't prevent OSSEC from restarting, but may need your attention. The error log file is `ossec.log` under the `/var/ossec/logs` directory.

## What to Expect

After making any final modifications and restarting OSSEC, you should receive another alert saying that OSSEC has started. If any rule is triggered after that, you will also receive similar alerts in your inbox:

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

---

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

---

    OSSEC HIDS Notification.
    2015 Jan 30 09:57:54

    Received From: deft->syscheck
    Rule: 553 fired (level 7) -> "File deleted. Unable to retrieve checksum."
    Portion of the log(s):

    File '/home/user5/footer.php' was deleted. Unable to retrieve checksum.

     --END OF NOTIFICATION

---

    OSSEC HIDS Notification.
    2015 Jan 30 09:19:16

    Received From: deft->/var/log/dpkg.log
    Rule: 2902 fired (level 7) -> "New dpkg (Debian Package) installed."
    Portion of the log(s):

    2015-01-30 09:19:14 status installed nginx-common:all 1.2.1-2.2+wheezy3


     --END OF NOTIFICATION
