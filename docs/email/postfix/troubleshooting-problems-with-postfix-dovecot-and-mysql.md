---
author:
  name: Linode
  email: docs@linode.com
description: 'Our guide to testing and troubleshooting Postfix, Dovecot, and MySQL'
keywords: ["postfix", "dovecot", "mysql"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/troubleshooting/']
modified: 2014-03-24
modified_by:
  name: Linode
published: 2013-07-22
title: 'Troubleshooting Problems with Postfix, Dovecot, and MySQL'
---

![Troubleshooting Problems with Postfix, Dovecot, and MySQL](/docs/assets/troubleshooting-problems-with-postfix-dovecot-and-mysql.jpg "Troubleshooting Problems with Postfix, Dovecot, and MySQL")

This guide is a companion to the [Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) installation guide. Because setting up a mail server is tricky, we've created this companion troubleshooting guide to help you work through and resolve any problems you might be experiencing. By the time you reach the end of this guide, you'll know how to debug problems with your Postfix, Dovecot, and MySQL mail server.

The first section, Troubleshooting Checklist, has a top-down approach to troubleshooting that will help you find specific errors for your mail server. The second section, Step-by-Step Configuration, uses a bottom-up approach that shows you how to get a basic mail server functioning and then gradually add more features.

## Troubleshooting Checklist

Correctly diagnosing a problem is the first step in solving it. At first glance, many mail server errors can seem quite general. Usually the first sign of a problem is that you try to create a test mail account and can't connect. This section is a crash course in finding mail server errors. We recommend reading through the following sections in order, because they progress from general to more specific troubleshooting techniques.

### Are Postfix and Dovecot Running?

Sometimes your mail server is not functioning correctly because the needed services are not running. For a mail server that has been running for a long time, [resource overuse](/docs/troubleshooting/memory-networking#diagnosing-and-fixing-memory-issues) is the most likely cause of stopped services. It doesn't hurt to check your resource use to rule out that problem. However, when you're just setting up a new mail server, it's more likely that your service startup problems are being caused by configuration errors. Some configuration errors - particularly syntax errors - are serious enough that they can prevent a service from starting.

To check that Postfix and Dovecot are running and to find startup errors, follow these steps:

1.  Run this command to check that Postfix is running:

        service postfix status

    You should see the following output:

        * postfix is running

2.  Next, run this command to check that Dovecot is running:

        service dovecot status

    You should see output similar to the following:

        dovecot start/running, process 2241

3.  Examine the results. If you see no output, or output that says `stop/waiting` or `not running`, the service is not running. The next step is to try restarting the services.
4.  Try to restart the services. Restarting Postfix and Dovecot is also a good troubleshooting procedure even if they're currently running, because then you can examine the startup messages, which can give you troubleshooting clues. Enter the following command to restart Postfix:

        service postfix restart

    You should see the following messages:

        * Stopping Postfix Mail Transport Agent postfix                    [ OK ]
        * Starting Postfix Mail Transport Agent postfix                    [ OK ]

5.  Execute the following command to restart Dovecot:

        service dovecot restart

    You should see the following messages:

        dovecot stop/waiting
        dovecot start/running, process 31171

6.  Examine the results. If you get an error, or the restart message for Dovecot doesn't include a new process ID, there's something preventing the service from starting.
7.  If you received a specific error from the restart attempt, search for it online.
8.  Check the applications' startup logs to see more detailed messages. Postfix's stop and start messages are logged in `/var/log/mail.log` (along with all its other messages). Enter the following command to view the most recent lines in the log:

        tail /var/log/mail.log

    On a normal restart, you should see the following:

    {{< file-excerpt "/var/log/mail.log" >}}
May 22 15:41:59 godel postfix/master[19624]: terminating on signal 15
May 22 15:41:59 godel postfix/master[20232]: daemon started -- version 2.9.6, configuration /etc/postfix

{{< /file-excerpt >}}


9.  Dovecot's default startup log is also in `/var/log/mail.log`. On a normal restart, you should see the following:

    {{< file-excerpt "/var/log/mail.log" >}}
May 22 17:46:54 master: Warning: Killed with signal 15 (by pid=1 uid=0 code=kill)
May 22 17:48:09 master: Info: Dovecot v2.0.19 starting up (core dumps disabled)

{{< /file-excerpt >}}


    {{< note >}}
If you moved the Dovecot logs, the normal Dovecot startup messages will be in `/var/log/dovecot.log` instead. If you can't find the Dovecot logs, locate them with the following command:

doveadm log find
{{< /note >}}

10. If you don't see these normal startup messages, check for errors instead. Search for errors online.
11. If there's a problem during Dovecot's startup, you should also check `/var/log/upstart/dovecot.log`. On a normal startup, nothing will be logged to this file. However, if there is a startup problem, an entry will be added in this log which can be quite helpful. To view this file, run the following command:

        tail /var/log/upstart/dovecot.log

    Here's an example where a syntax error in the `/etc/dovecot/conf.d/10-master.conf` file has been identified:

    {{< file-excerpt "/var/log/upstart/dovecot.log" >}}
doveconf: Fatal: Error in configuration file /etc/dovecot/conf.d/10-master.conf line 36: Unexpected '}'

{{< /file-excerpt >}}


12. If you find a syntax error, open up the offending file and look at the line mentioned (Line 36 in the example above). It's actually fairly common to get syntax errors during the Dovecot setup process, because there are so many different files and a lot of nested brackets.
13. Use [Notepad++](http://notepad-plus-plus.org) or some other program that can easily match brackets to help you fix the error. Or, you could restore the appropriate default configuration file (named with .orig, if you were following the main setup guide).

### Check the Logs

If Postfix, Dovecot, and MySQL are running, the next troubleshooting step is to check the mail logs. By default, all of the incoming and outgoing connections and any associated errors get logged in `/var/log/mail.log`. One of the most helpful ways to view the log file is with the `tail` command, which when combined with the `-f` flag, shows you the most recent part of the log live as it's updated.

1.  Start tailing the log by entering the following command:

        tail -f /var/log/mail.log

2.  Send yourself a test message or make a connection to the mail server.
3.  View the log as it updates with the relevant information.
4.  To stop tailing, press **CTRL-C**.

If you see an error or warning in the log, copy it. Search for that exact error online (without the details specific to your server), and you'll likely be able to find a solution or additional troubleshooting help.

### Enable Verbose Logs

The default mail log may not contain all the information you need. In that case, the next step is to enable verbose logging for Postfix and Dovecot, and to separate the Postfix and Dovecot logs into two separate files so they're easier to sort through. The Postfix log will document messages that are relayed to or from outside servers, and the Dovecot log will record authorization attempts.

#### Dovecot

Follow these instructions to enable verbose logging for Dovecot and change the log location to `/var/log/dovecot.log`:

1.  Open the /etc/dovecot/conf.d/10-logging.conf file for editing by entering the following command:

        nano /etc/dovecot/conf.d/10-logging.conf

2.  Add this line to set the new file path for the log:

    {{< file-excerpt "/etc/dovecot/conf.d/10-logging.conf" >}}
log_path = /var/log/dovecot.log

{{< /file-excerpt >}}


3.  Uncomment the `auth_verbose` and `mail_debug` lines, and then set them to `yes`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-logging.conf" >}}
auth_verbose = yes

mail_debug = yes

{{< /file-excerpt >}}


4.  Save your changes.
5.  Restart Dovecot by entering the following command:

        service dovecot restart

The Dovecot log will now display more information about authorization attempts and inbox connections. You can view the new log at `/var/log/dovecot.log`. Remember to disable verbose logging when you're done troubleshooting so your server doesn't fill up with logs.

#### Postfix

Follow these instructions to enable verbose logging for Postfix:

1.  Open the `/etc/postfix/master.cf` files for editing by entering the following command:

        nano /etc/postfix/master.cf

2.  Add a `-v` to the `smtp` line to enable verbose logging:

    {{< file-excerpt "/etc/postfix/master.cf" >}}
# ==========================================================================
# service type  private unpriv  chroot  wakeup  maxproc command + args
#               (yes)   (yes)   (yes)   (never) (100)
# ==========================================================================
smtp      inet  n       -       -       -       -       smtpd -v

{{< /file-excerpt >}}


3.  Save your changes.
4.  Restart Postfix by entering the following command:

        service postfix restart

The Postfix log will now display more information about messages that are coming from or going to outside servers. You can still view the log at `/var/log/mail.log`. Remember to disable verbose logging when you're done troubleshooting so your server doesn't fill up with logs.

### Check Port Availability

Sometimes email problems occur because the mail server and mail client aren't talking to each other on the same ports. For mail to get from client to server, or vice versa, both have to be using the same ports, and those ports also have to be open along the internet route between the two. If you are following the accompanying [Postfix, Dovecot, and MySQL](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) installation guide, you should be using the following ports:

-   25, 465, or 587 with TLS encryption for outgoing mail (SMTP)
-   993 with SSL encryption for incoming IMAP
-   995 with SSL encryption for incoming POP3

First, check your mail client settings and make sure that you have the correct ports and security settings selected.

Next, use the Telnet tool to check that ports are open both on your Linode and on the route between your client and your Linode. The same test should be run on both your Linode and your home computer. First we'll present how to run the test from both locations, and then we'll discuss the implications.

#### Checking from a Linode

To test on your Linode, follow these steps:

1.  Establish an SSH connection to your Linode.
2.  Run the following command, replacing `12.34.56.78` with your Linode's IP address:

        telnet 12.34.56.78 25

3.  Exit Telnet by pressing **CTRL-]**, then enter `quit`.
4.  Repeat Step 2 for ports 465, 587, 993, and 995.

Read the discussion of Telnet outcomes below, and use the output shown at the end of this section to analyze your results.

#### Checking from a Mac

To run a Telnet test on a Mac, follow these steps:

1.  Open the Terminal application.
2.  Run the following command, replacing `12.34.56.78` with your Linode's IP address:

        telnet 12.34.56.78 25

3.  Exit Telnet by pressing **CTRL-]**, then enter `quit`.
4.  Repeat Step 2 for ports 465, 587, 993, and 995.

Read the discussion of Telnet outcomes below, and use the output shown at the end of this section to analyze your results.

#### Checking from a PC

To run a Telnet test on a Windows computer, follow these steps. You will need to start by installing Telnet, since it doesn't come with Windows by default:

1.  Open the Control Panel.
2.  Select **Programs**.
3.  From **Programs and Features**, select **Turn Windows features on or off**.
4.  Select **Telnet Client** from the menu.
5.  Click **OK**.
6.  Wait while the changes are applied.
7.  Open the command prompt.
8.  Run the following command, replacing `12.34.56.78` with your Linode's IP address:

        telnet 12.34.56.78 25

9.  Exit Telnet by pressing **CTRL-]**, then enter `quit`.
10. Repeat Step 8 for ports 465, 587, 993, and 995.

Read the discussion of Telnet outcomes below, and analyze your results according to the output shown below.

#### Analyzing the Results

If the test is successful, you should see output similar to the following:

    Trying 12.34.56.78...
    Connected to li468-222.members.linode.com.
    Escape character is '^]'.
    220 host.example.com ESMTP Postfix (Ubuntu)

To cancel the connection, press **CTRL-]**, then enter `quit`. If the test fails, you will see a `Connection refused` message and Telnet will quit on its own.

If you run the test on your Linode and it fails, you should check that you've configured the ports properly in your mail server setup (see Steps 33-34 in the [Dovecot section](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#dovecot) of the setup guide), that you've enabled ports 465 and 587 (see Steps 26-30 in the [Postfix section](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#postfix) of the setup guide), and that you don't have any [Firewall rules](/docs/security/firewalls/iptables) in place that block them.

If you run the test on your Linode and it succeeds, but the test from your home computer fails, that indicates that the ports are being blocked somewhere on the network between your home computer and your Linode. It could be at your router, your ISP (Internet Service Provider), someone else's ISP, etc. The best way to diagnose networking issues is to generate an [MTR report](/docs/linux-tools/mtr).

If the Telnet tests on your Linode and your home computer both succeed, and your mail client settings are correct, you can probably rule out any problems with ports.

### Verifying Your Login Credentials

Next we'll focus on your login credentials. If they aren't configured properly, this can cause problems:

-   Username and password are not accepted in your mail client
-   Prompted for your password over and over again
-   Unable to connect to the mail server

The first and easiest step is re-entering your username and password in your mail client. Make sure you use the full username, including the `@example.com` part. Usernames and passwords are case-sensitive. If you're sure that you've entered the information correctly in your mail client, authorization may not be configured properly on the server side.

The next thing to check is that your username and password are entered properly in the correct MySQL table. You can run the [MySQL tests](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#testing) from the main setup article to make sure your tables are set up appropriately. You can also delete and re-add the appropriate row from the **mailserver.virtual\_users** table to make sure the password was entered correctly. If the information is correct in the MySQL table, it may be that Dovecot is not configured to look up authorization credentials in the right location.

Dovecot includes an administrative tool which is very helpful in troubleshooting issues with login credentials. The `doveadm user` command lets you see the user database result for the username, user ID, group ID, and mailbox location for each email user. Reading the output from this tool tells you the database where Dovecot is looking for authorized users. If Dovecot is not looking for the expected database, you'll need to change the authorization-related settings in Dovecot so that it is using MySQL to look up users, and not some other user database.

1.  Run the `doveadm` command to look up your email user (including the `@example.com` part):

        doveadm user email1@example.com

    If everything is working correctly, you should see output like this:

        userdb: email1@example.com
          uid       : 5000
          gid       : 5000
          home      : /var/mail/vhosts/example.com/email1

    If instead you get:

        userdb lookup: user email1@example.com doesn't exist

    This could indicate that 1) You didn't enter the email address correctly in the MySQL table - but we just checked that, so it could also be that 2) Dovecot is not looking for your user database in the right place.

2.  If Dovecot can't find the users in MySQL, it may still be looking for system users rather than virtual users. See if you get a response for your own SSH user:

        doveadm user myuser

    Dovecot should **not** find output for your system user. If it does, it will look like this:

        userdb: myuser
          system_groups_user: myuser
          uid       : 1000
          gid       : 1000
          home      : /home/myuser

3.  If you do get this type of output, you need to adjust your Dovecot settings related to virtual users. If you don't get output for the system users either, this still indicates that you have some kind of error in the Dovecot settings related to users. Go back to the [Dovecot section](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#dovecot) of the main setup guide and pay special attention to the sections having to do with virtual users and the MySQL settings.

## Step-by-Step Configuration

For some troubleshooting scenarios, you may find that a top-down approach doesn't help you find the root cause of the problem. Sometimes, what you need is a bottom-up approach.

The bottom-up approach presented here breaks up the complex task of building a mail server into smaller chunks. This has two benefits. First, each section focuses on just a few mail server functions and includes fewer details, which makes it easier to understand. By the end of the project, you should have a deep understanding of how the mail server works. Second, each chunk adds a discrete amount of testable functionality to the mail server. This makes it easier to find errors by limiting the scope of their possible locations. For example, if your mail server was working after you completed "Basic Dovecot," but is failing its tests after "Virtual Domains and Users," you know that the error is related to something you did in that section.

The second part of this guide presents a step-by-step mail server build organized by function, progressing from core functions to more peripheral ones, with tests at each step. You should have the [main setup guide](/docs/email/postfix/email-with-postfix-dovecot-and-mysql) open at the same time, because we will be referring back to it. As you read the main setup guide, you'll notice that we are installing items in a different order here. The main guide is designed for a streamlined approach that avoids editing the same file multiple times. This guide is focused on a deeper understanding of each component, so you will sometimes need to jump around to different sections of the main guide for reference. Once you successfully complete a stage, I suggest that you make a [system-level backup](/docs/platform/backup-service) so you can get back to that point easily!

{{< caution >}}
Keep in mind that the earlier builds presented here are functional, but should not be considered production-ready for security and functionality reasons, mainly because passwords are sent in plain text, and/or outgoing SMTP is not enabled.
{{< /caution >}}

Throughout this section, we will provide links to the appropriate [Postfix](http://www.postfix.org/documentation.html) and [Dovecot](http://wiki2.dovecot.org/) documentation. These are great jumping-off points.

### Setting Up

Read the [Getting Started](/docs/getting-started) guide. Follow the steps outlined in that section before installing your mail server.

You may also want to log into your server as the root user, so you don't have to type "sudo" for each command. You can log in as root by entering the following command:

    su

### Basic Postfix

In this section, you'll install Postfix and configure it to deliver mail for your system user at your domain, which is the most basic configuration. You'll also send a test message and view it using Mailutils.

1.  Install Postfix by entering the following command:

        apt-get install postfix

2.  When prompted, select **Internet Site** for the configuration. (See Steps 6 & 7 from the [Installing Packages](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#installing-packages) section of the primary guide, for this step and the next.)
3.  Enter your fully-qualified domain name or any domain name that resolves to the server.
4.  Open `/etc/postfix/main.cf` for editing, and add your domain(s) to the `mydestination` line. If your hostname and hosts files were set up correctly before installing Postfix, this list should already include your full-qualified domain name and several references to localhost, which you can leave as they are.

    {{< file-excerpt "/etc/postfix/main.cf" >}}
mydestination = example.com, localhost

{{< /file-excerpt >}}


5.  Restart Postfix by entering the following command:

        service postfix restart

    {{< note >}}
Use that command whenever the instructions tell you to restart Postfix. Substitute `dovecot` for `postfix` when the instructions tell you to restart Dovecot.
{{< /note >}}

6.  Send your Linux system user a test message. This is the same user that you use for SSH. You should use the format <**myuser@example.com**>.
7.  Install Mailutils by entering the following command:

        apt-get install mailutils

8.  Check your messages with Mailutils by entering the following command. You must be logged in as your own user, so drop out of root for now if you logged in as root earlier.

        mail

9.  Type the number of the message you want to read.
10. Type `quit` when you want to exit your system user's inbox.

If you succeeded in sending your system user a test message, you have successfully installed Postfix and configured it for the most basic mail delivery. By default, it delivers mail only for system users, and mail is stored in a file called `/var/mail/myuser`.

### Basic Dovecot

In this section, you'll install Dovecot and set it up so you can check your email for your system user over an IMAP or POP3 connection, which is the most basic configuration. This section is based on Dovecot's [Basic Configuration Guide](http://wiki2.dovecot.org/BasicConfiguration), which is a great reference.

1.  Install Dovecot and its IMAP and POP3 packages by entering the following command:

        apt-get install dovecot-core dovecot-imapd dovecot-pop3d

2.  Open `/etc/dovecot/conf.d/10-mail.conf` for editing, and set the `mail_location` to the line shown below. This setting should direct Dovecot to look for mail in the same location where Postfix stores the mail, which should be `/var/mail/myuser` by default (Dovecot uses the variable `%u` so the correct username is used in the path). The mailbox format is designated as `mbox`.

    {{< file-excerpt "/etc/dovecot/conf.d/10-mail.conf" >}}
mail_location = mbox:~/mail:INBOX=/var/mail/%u

{{< /file-excerpt >}}


3.  Also in `/etc/dovecot/conf.d/10-mail.conf`, set the `mail_privileged_group` to `mail`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-mail.conf" >}}
mail_privileged_group = mail

{{< /file-excerpt >}}


4.  In `/etc/dovecot/conf.d/10-auth.conf`, allow plain-text authentication by setting `disable_plaintext_auth` to `no`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
disable_plaintext_auth = no

{{< /file-excerpt >}}


5.  In `/etc/pam.d/dovecot`, tell Dovecot to use standard UNIX authentication. This means that your SSH username and password will also work for mail. Edit the file so it contains only the following:

    {{< file-excerpt "/etc/pam.d/dovecot" >}}
auth required pam_unix.so nullok account required pam_unix.so

{{< /file-excerpt >}}


6.  Restart Dovecot.
7.  Send yourself another test message.
8.  Check your email. You can use either Telnet or a mail client. At this stage, your email address will be for your system user (<myuser@example.com>), and your username and password will be the same as they are for SSH (no `@example.com` part in the username at this stage). Your connection type will be standard (non-secure) and your password will be plain. You will probably have to set up your mail client manually, rather than through a wizard.

{{< note >}}
The Telnet and mail client tests will not work for `root`. Use a different system user.
{{< /note >}}

If you succeeded in checking your mail over an IMAP or POP3 connection, you have successfully installed Dovecot and configured it for the most basic inbox access.

### Virtual Domains and Users

Now that Postfix and Dovecot are working, you should set up virtual domains and users. Having virtual users for mail is an important step forward in the security and convenience of your mail server, because it eliminates the need to create a system user for everyone who needs a mailbox. It also makes it easier to add new domains and users to the mail server.

You'll need to make quite a few configuration changes related to virtual domains and users in both Postfix and Dovecot. Postfix and Dovecot both need to be configured for virtual domains and users at the same time, because you're changing the mailbox location, which needs to be coordinated between them. Here's a general checklist of what you'll be configuring in this section:

-   Make two new static files with the virtual user information (usernames, passwords, mailbox locations), one for Postfix and one for Dovecot. (You can't use the same file because they require different parameters and formatting.) You didn't need to write out your own authentication information before, because Postfix and Dovecot were just reading from the system authentication, but you need it now for virtual user authentication. Eventually you'll be saving this information in MySQL databases, but it's simpler to set it up in flat files for now.
-   Tell Postfix and Dovecot to use the virtual users.
-   List the virtual domains in the Postfix configuration file, instead of using the `mydestination` line.
-   Create the new mailboxes in their new locations. They used to be at `/var/mail/myuser`, but now they will be at `/var/mail/vhosts/example.com/user/`. This has the added bonus of letting you have the same username at different domains: for example, you can now have <jane@example.com> and <jane@example.net> be two different mailboxes.
-   Tell Postfix and Dovecot to use the new mailbox locations.
-   Grant one system user, called `vmail`, access to all the mailboxes, rather than having each system user own its own mailbox.

You may want to reference [Postfix's Virtual Readme](http://www.postfix.org/VIRTUAL_README.html) and [Dovecot's wiki page on virtual users](http://wiki2.dovecot.org/VirtualUsers) as you work through this section.

1.  Create a virtual users file for Postfix. This will list all the email addresses and their delivery locations relative to the `virtual_mailbox_base` parameter (which gets configured in `/etc/postfix/main.cf`, which we'll get to momentarily). We're calling the file `/etc/postfix/virtual_users_list`, and it should look something like this:

    {{< file-excerpt "/etc/postfix/virtual_users_list" >}}
email1@example.com example.com/email1/
email2@example.com example.com/email2/

{{< /file-excerpt >}}

2.  Create a virtual users file for Dovecot. This will list all your email usernames (just use the email addresses) and their passwords in plain text (obviously this is not production-ready). It should look something like this:

    {{< file-excerpt "/etc/dovecot/users" >}}
email1@example.com:{Plain}firstpassword
email2@example.com:{Plain}secondpassword

{{< /file-excerpt >}}


    This list allows Dovecot to check the usernames and passwords for virtual users before granting them access to their inboxes.

3.  Edit Postfix's main configuration file, `/etc/postfix/main.cf`. Remove every domain except `localhost` from the `mydestination` parameter. Create a new parameter called `virtual_mailbox_domains` and add your domains:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
virtual_mailbox_domains = example.com, hostname, hostname.example.com, localhost.example.com

{{< /file-excerpt >}}


    {{< note >}}
There can be no overlap between the `mydestination` and `virtual_mailbox_domains` lists.
{{< /note >}}

4.  Also in `/etc/postfix/main.cf`, add the line `virtual_mailbox_base` and set it to `/var/mail/vhosts` so mail gets delivered to the new mailboxes. The final part of the path for each user is in the `virtual_users_list` file from Step 1.

    {{< file-excerpt "/etc/postfix/main.cf" >}}
virtual_mailbox_base = /var/mail/vhosts

{{< /file-excerpt >}}


5.  Also in `/etc/postfix/main.cf`, add the line `virtual_mailbox_maps` and set it to the virtual users file you created in Step 1. It is a "hash" type file. If you're following this example exactly, it will be:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
virtual_mailbox_maps = hash:/etc/postfix/virtual_users_list

{{< /file-excerpt >}}


    However, you can name this file anything you want, and set the `virtual_mailbox_maps` parameter accordingly.

6.  The last change for `/etc/postfix/main.cf` in this section is to set up the new `vmail` system user. This user will own the virtual mailboxes. Add the following new lines:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

{{< /file-excerpt >}}

7.  Let's take a moment to sum up all the changes that you just made in `/etc/postfix/main.cf`. You removed all the domains except `localhost` from the `mydestination` parameter, and added several new lines for the virtual domains and users, which should look like this (add the `#Virtual domains` comment if desired):

    {{< file-excerpt "/etc/postfix/main.cf" >}}
#Virtual domains
virtual_mailbox_domains = example.com, host
virtual_mailbox_base = /var/mail/vhosts
virtual_mailbox_maps = hash:/etc/postfix/virtual_users_list
virtual_minimum_uid = 100
virtual_uid_maps = static:5000
virtual_gid_maps = static:5000

{{< /file-excerpt >}}


8.  Now that you've made all the changes in the Postfix configuration files, you should make sure Postfix is reading the new settings with the following command:

        postmap /etc/postfix/virtual_users_list

9.  Make the `vmail` user and group:

        groupadd -g 5000 vmail
        useradd -g vmail -u 5000 vmail -d /var/mail

10. Make the directory `/var/mail/vhosts/example.com/email1` for every email address. You'll have to start by making the `vhosts` directory and then work your way down. You can use `mkdir` with the `-p` flag if desired.
11. Change the ownership of the `/var/mail` directory and everything below it to the `vmail` user and group:

        chown -R vmail:vmail /var/mail

    Great! Now the proper folders actually exist for mail delivery, and the user that owns those folders matches the one we told Postfix to use when writing new mail to the server.

12. Restart Postfix.
13. Try sending yourself a test message. Check `/var/log/mail.log`; you should see something like this:

    {{< file-excerpt "/var/log/mail.log" >}}
Mar  8 18:01:27 host postfix/virtual[4418]: E2C7528420: to=<email1@example.com>, relay=virtual, delay=0.01, delays=0.01/0/0/0, dsn=2.0.0, status=sent (delivered to maildir)

{{< /file-excerpt >}}

    The part that says `relay=virtual` means you've got virtual domains and users set up properly.

14. Next up is Dovecot. First, update the `mail_location` in `/etc/dovecot/conf.d/10-mail.conf`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-mail.conf" >}}
passdb {
  driver = passwd-file
  args = username_format=%u /etc/dovecot/users
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n
}

{{< /file-excerpt >}}


    {{< note >}}
The `passdb` section details how email users can authenticate. The `driver` line tells Dovecot you're using a flat file, and the `args` line tells it where it is and what format to expect. (This is the `/etc/dovecot/users` file you made in Step 2.)

The `userdb` line tells Dovecot where to find the mail on the server and which system user it should use to access the mail files. Since the format for each mailbox's location is the same, the `userdb` can be static. You're telling it to use the `vmail` user to access the mailboxes. Finally, the `home=` parameter tells Dovecot to look for mail in `var/mail/vhosts/example.com/user`. This setting MUST match the `virtual_mailbox_base` + `/etc/postfix/virtual_users_list` relative path in Postfix's settings. You have to tell Dovecot to look for mail in the same place you told Postfix to put the mail.
{{< /note >}}

16. Now you just need to tell Dovecot to use `auth-passwdfile.conf.ext` instead of `auth-system.conf.ext`, so it uses that lovely new password file you created in Step 2. In `/etc/dovecot/conf.d/10-auth.conf`, add `#` to comment out the system user file, and remove `#` to enable the passwdfile config file:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
#!include auth-system.conf.ext
!include auth-passwdfile.conf.ext

{{< /file-excerpt >}}


17. Restart Dovecot.
18. Send yourself another test message.
19. See if you can check your email with IMAP or POP3; you can use a mail client or Telnet. You should now be able to use your email address and email password to log in, rather than your system username and password.

    {{< note >}}
Remember that these three paths have to match: the `virtual_mailbox_base` + `/etc/postfix/virtual_users_list` relative path in Postfix's settings, the `mail_location` in Dovecot, and the `home=` in Dovecot.
{{< /note >}}

If your most recent test worked, you have now set up both Postfix and Dovecot successfully with virtual domains and users.

### Dovecot's LMTP for Local Delivery

Now that you have virtual domains and users working, it's time to update the local delivery agent. By default, Postfix uses its own built-in LDA. We're going to switch to using Dovecot's LMTP (Local Mail Transfer Protocol) service instead. To do this, we have to set up a socket in Dovecot which Postfix can use.

See [Dovecot's wiki article about LMTP](http://wiki2.dovecot.org/HowTo/PostfixDovecotLMTP) for the official documentation.

1.  Install `dovecot-lmtpd` by entering the following command:

        apt-get install dovecot-lmtpd

2.  In `/etc/dovecot/dovecot.conf`, add or modify the `protocols` line to look like the following. If you need to add the line, you can add it below `!include_try /usr/share/dovecot/protocols.d/*.protocol`.

    {{< file-excerpt "/etc/dovecot/dovecot.conf" >}}
protocols = imap pop3 lmtp

{{< /file-excerpt >}}


3.  Carefully edit the existing `service lmtp` section of `/etc/dovecot/conf.d/10-master.conf` to look like the following, which will enable the socket:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service lmtp {
 unix_listener /var/spool/postfix/private/dovecot-lmtp {
   mode = 0600
   user = postfix
   group = postfix
  }
  # Create inet listener only if you can't use the above UNIX socket
  #inet_listener lmtp {
    # Avoid making LMTP visible for the entire internet
    #address =
    #port =
  #}
}

{{< /file-excerpt >}}


    {{< note >}}
Make sure you count your brackets. An extra or missing bracket in this section will produce a syntax error that prevents Dovecot from starting.
{{< /note >}}

4.  Restart Dovecot.
5.  Make sure the socket exists:

        ls /var/spool/postfix/private/dovecot-lmtp

6.  Now, tell Postfix to use the new socket for local delivery. In `/etc/postfix/main.cf`, set this line:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
virtual_transport = lmtp:unix:private/dovecot-lmtp

{{< /file-excerpt >}}


7.  Restart Postfix.
8.  Send yourself a test message. Make sure you can still receive mail.

### Authentication Hand-off from Postfix to Dovecot

By default, Postfix won't let you send email unless you're logged into the server directly. This is a good default, because you don't want to become a spam hub. However, you want to loosen a production server's settings slightly to let authenticated email users send mail. As a precursor to that, you need to set up authentication for Postfix. Since Dovecot already does a great job handling authentication when users want to check their email, you'll let it handle authentication for Postfix as well.

This process is very similar to the one for LMTP, because you're first creating a socket in Dovecot and then telling Postfix to use it. For more information, see [Dovecot's wiki article about Postfix and SASL](http://wiki2.dovecot.org/HowTo/PostfixAndDovecotSASL).

1.  Carefully edit `/etc/dovecot/conf.d/10-master.conf` to look like the following, which will enable the socket:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service auth {
  # auth_socket_path points to this userdb socket by default. It's typically
  # used by dovecot-lda, doveadm, possibly imap process, etc. Its default
  # permissions make it readable only by root, but you may need to relax these
  # permissions. Users that have access to this socket are able to get a list
  # of all usernames and get results of everyone's userdb lookups.
  unix_listener /var/spool/postfix/private/auth {
    mode = 0666
    user = postfix
    group = postfix
  }

  unix_listener auth-userdb {
    mode = 0600
    user = vmail
    #group =
  }

  # Postfix smtp-auth
  #unix_listener /var/spool/postfix/private/auth {
  #  mode = 0666
  #}

  # Auth process is run as this user.
  #user = $default_internal_user
}

{{< /file-excerpt >}}


    {{< note >}}
Again, watch your brackets.
{{< /note >}}

2.  In the `service auth-worker` section, set `user` to `vmail`.

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service auth-worker {
  # Auth worker process is run as root by default, so that it can access
  # /etc/shadow. If this isn't necessary, the user should be changed to
  # $default_internal_user.
  user = vmail
}

{{< /file-excerpt >}}

3.  Restart Dovecot.
4.  Check that /var/spool/postfix/private/auth exists by entering the following command:

        ls /var/spool/postfix/private/auth

5.  Now you'll configure Postfix to use Dovecot's authentication. For more information, see [Postfix's Dovecot SASL guide](http://www.postfix.org/SASL_README.html#server_dovecot) and [Postfix's guide on enabling SASL](http://www.postfix.org/SASL_README.html#server_sasl_enable). Add the following lines to `/etc/postfix/main.cf`. This tells Postfix the authentication type, the location of the socket, and that SASL authentication should be enabled:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

{{< /file-excerpt >}}

6.  Restart Postfix.
7.  Send yourself a test message and make sure you can still receive it.

If your test succeeds, you've just finished setting up Dovecot's LMTP service as your local delivery agent.

### SSL Encryption

Now that authentication is set up, let's make sure the authentication process is secure. To do this, you'll require all authentication attempts to be encrypted with SSL or STARTTLS. For more information, see [Dovecot's wiki article on SSL encryption](http://wiki2.dovecot.org/SSL).

1.  Open `/etc/dovecot/conf.d/10-ssl.conf` for editing, and then set `ssl` to `required`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-ssl.conf" >}}
ssl = required

{{< /file-excerpt >}}


2.  Also in `/etc/dovecot/conf.d/10-ssl.conf`, check the paths to the SSL certificate and key. They should be set to Dovecot's certificate and key by default. If that's what you're using, leave these settings be. Otherwise, update the paths to the certificate and key you want to use.

    {{< file-excerpt "/etc/dovecot/conf.d/10-ssl.conf" >}}
ssl_cert = </etc/ssl/certs/dovecot.pem
ssl_key = </etc/ssl/private/dovecot.pem

{{< /file-excerpt >}}

3.  Verify that your SSL certificate and key are in the locations specified in the previous step.
4.  Disable plain-text authentication. In `/etc/dovecot/conf.d/10-auth.conf`, set the following line:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
disable\_plaintext\_auth = yes

{{< /file-excerpt >}}

5.  Disable the unencrypted ports for IMAP and POP3 so that the server won't accept unencrypted connections. In `/etc/dovecot/conf.d/10-master.conf`, set:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service imap-login {
   inet_listener imap {
     port = 0
   }
 ...
 }

 service pop3-login {
   inet_listener pop3 {
     port = 0
   }
 ...
 }

{{< /file-excerpt >}}

6.  Leave the `imaps` and `pop3s` ports alone (they're commented out). Their default settings are fine; you'll be able to use 993 for secure IMAP and 995 for secure POP3.
7.  Restart Dovecot.
8.  Try to connect to your server on Ports 110 and 143 (we recommend using Telnet). This should fail, because we just disabled the unencrypted ports.
9.  Try to check your mail with SSL encryption turned on and Port 993 or 995. This should succeed.

If you can't connect on 110 and 143, and you can connect on 993 and 995 with SSL turned on, you've succeeded in forcing encryption for all your authentication connections. Note that you will not be able to log in via Telnet at this point - you're just testing the ports.

### SMTP

Now that you've got authentication set up securely, you need to configure SMTP. Right now, Postfix will relay emails only if they're addressed to a domain on the server or they're sent by system users, which is sufficient for incoming mail. For outgoing mail, though, you'll want to ease the relaying restrictions so that authenticated users can send email anywhere.

1.  Open `/etc/postfix/main.cf` for editing, and then add the `smtpd_recipient_restrictions` line as shown below:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
smtpd_recipient_restrictions = permit_sasl_authenticated, permit_mynetworks, reject_unauth_destination

{{< /file-excerpt >}}


    {{< note >}}
The `smtpd_recipient_restrictions` line lists the criteria Postfix uses to decide which emails it can relay. `permit_sasl_authenticated` allows authenticated users to send mail. It should be listed first. Next we have `permit_mynetworks`, which allows users who are already logged into the server to send mail. Finally, `reject_unauth_destination` prevents your server from delivering mail for domains for which it is not configured. **Never remove this last setting!** Basically, this means that authenticated users and local users are always allowed to send mail anywhere. Non-authenticated and non-local users are allowed to send mail only to domains for which this server is responsible. These restrictions prevent your server from being used as an open relay that can send spam from anyone to anywhere.
{{< /note >}}

2.  You'll also want to force outgoing authentication to be encrypted. Still in `/etc/postfix/main.cf`, set the following lines:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
smtpd_tls_cert_file=/etc/ssl/certs/dovecot.pem
smtpd_tls_key_file=/etc/ssl/private/dovecot.pem
smtpd_use_tls=yes
smtpd_tls_auth_only = yes

{{< /file-excerpt >}}


    {{< note >}}
First, you're going to tell Postfix to use Dovecot's SSL certificate and key, because some mail clients will choke if the certificates for the incoming and outgoing servers don't match. Then you're telling Postfix to use (only) TLS encryption. This means that users can connect on the standard port (25), but before they are allowed to send any authentication information, they have to establish an encrypted connection.
{{< /note >}}

3.  Make a copy of the `/etc/postfix/master.cf` file:

        cp /etc/postfix/master.cf /etc/postfix/master.cf.orig

4.  Open the configuration file for editing by entering the following command:

        nano /etc/postfix/master.cf

5.  Locate and uncomment the two lines starting with `submission` and `smtps`. This will allow you to send mail securely on ports 587 and 465, in addition to port 25 (which is also secure with our SSL setup). The first section of your `/etc/postfix/master.cf` file should resemble the following:

    {{< file-excerpt "/etc/postfix/master.cf" >}}
#
# Postfix master process configuration file.  For details on the format
# of the file, see the master(5) manual page (command: "man 5 master").
#
# Do not forget to execute "postfix reload" after editing this file.
#
# ==========================================================================
# service type  private unpriv  chroot  wakeup  maxproc command + args
#               (yes)   (yes)   (yes)   (never) (100)
# ==========================================================================
smtp      inet  n       -       -       -       -       smtpd
#smtp      inet  n       -       -       -       1       postscreen
#smtpd     pass  -       -       -       -       -       smtpd
#dnsblog   unix  -       -       -       -       0       dnsblog
#tlsproxy  unix  -       -       -       -       0       tlsproxy
submission inet n       -       -       -       -       smtpd
#  -o syslog_name=postfix/submission
#  -o smtpd_tls_security_level=encrypt
#  -o smtpd_sasl_auth_enable=yes
#  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
#  -o milter_macro_daemon_name=ORIGINATING
smtps     inet  n       -       -       -       -       smtpd
#  -o syslog_name=postfix/smtps
#  -o smtpd_tls_wrappermode=yes
#  -o smtpd_sasl_auth_enable=yes
#  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
#  -o milter_macro_daemon_name=ORIGINATING

{{< /file-excerpt >}}


6.  Save the changes you've made to the `/etc/postfix/master.cf` file.
7.  Restart Postfix.
8.  Set up your mail client to connect to your Linode as an outgoing mail server. You should use TLS encryption, or STARTTLS if you have that option, over ports 25, 465, or 587. Your username and password are the same as they are for incoming mail. Try sending a test message.

{{< note >}}
You will no longer be able to use Telnet for testing. If you want to run a manual test for troubleshooting purposes, you can use [openssl](http://www.openssl.org/docs/apps/s_client.html) instead. Your command should look like this (you can test on ports 465 and 587 as well):

openssl s_client -connect example.com:25 -starttls smtp
{{< /note >}}

Your mail server is now perfectly viable and secure. If you're happy storing all your domains and users in flat files, you can stop here. However, for the sake of making long-term maintenance easier, we suggest that you store your lists of domains, users, and aliases in MySQL databases instead.

### MySQL for Virtual Domains, Users, and Aliases

The final step in getting your mail server up to speed is to make it compatible with MySQL.

1.  Install MySQL and the necessary components for Postfix and Dovecot:

        apt-get install mysql-server postfix-mysql dovecot-mysql

2.  Create the three MySQL tables `virtual_domains`, `virtual_users`, and `virtual_aliases` and populate them with your data, by following the entire [MySQL section](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#mysql) in the main setup guide. If you prefer not to use the MySQL command line, you can install phpMyAdmin and use that instead.
3.  Open `/etc/postfix/main.cf` for editing. Comment out the existing `virtual_mailbox_domains` and `virtual_mailbox_maps` lines and add these instead:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
#Virtual domains, users, and aliases
virtual_mailbox_domains = mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf
virtual_mailbox_maps = mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf
virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-alias-maps.cf

{{< /file-excerpt >}}


4.  Follow Steps 11-25 in the [Postfix section](/docs/email/postfix/email-with-postfix-dovecot-and-mysql#postfix) of the main setup guide to create the `/etc/postfix/mysql-virtual-mailbox-domains.cf`, `/etc/postfix/mysql-virtual-mailbox-maps.cf`, and `/etc/postfix/mysql-virtual-alias-maps.cf` files. You will also test that Postfix can find all of this information, using the `postmap` commands.
5.  Now for Dovecot. Create the file `/etc/dovecot/conf.d/auth-sql.conf.ext`. You will make a new `passdb` section that directs Dovecot to use MySQL for authentication. The `userdb` section will be identical to the one we had before, since the mailboxes aren't moving.

    {{< file-excerpt "/etc/dovecot/conf.d/auth-sql.conf.ext" >}}
passdb {
  driver = sql
  args = /etc/dovecot/dovecot-sql.conf.ext
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n
}

{{< /file-excerpt >}}


6.  Open `/etc/dovecot/dovecot-sql.conf.ext` for editing, uncomment the lines shown below, and update them with the appropriate MySQL connection information:

    {{< file-excerpt "/etc/dovecot/dovecot-sql.conf.ext" >}}
driver = mysql
connect = host=127.0.0.1 dbname=mailserver user=mailuser password=mailuserpass
default_pass_scheme = SHA512-CRYPT
password_query = SELECT email as user, password FROM virtual_users WHERE email='%u';

{{< /file-excerpt >}}


7.  Open `/etc/dovecot/conf.d/10-auth.conf` for editing. Comment out the `!include auth-passwdfile.conf.ext` line and uncomment the `!include auth-sql.conf.ext` line. This switches your authentication from the flat file to the database:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
#!include auth-system.conf.ext
!include auth-sql.conf.ext
#!include auth-ldap.conf.ext
#!include auth-passwdfile.conf.ext
#!include auth-checkpassword.conf.ext
#!include auth-vpopmail.conf.ext
#!include auth-static.conf.ext

{{< /file-excerpt >}}


8.  Change the owner and group of the `/etc/dovecot/` directory to `vmail` and `dovecot`, recursively:

        chown -R vmail:dovecot /etc/dovecot

9.  Change the permissions on the `/etc/dovecot/` directory recursively:

        chmod -R o-rwx /etc/dovecot

10. Open `/etc/dovecot/conf.d/10-master.conf` for editing and, in the `service auth` section, set `user = dovecot`, below the line `# Auth process is run as this user.`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service auth {
...
  # Auth process is run as this user.
  user = dovecot
}

{{< /file-excerpt >}}


11. Restart Dovecot.
12. Verify that you can still send and receive mail. Check your logs if you run into any errors.

Now you should be caught up with the main guide and have a fully functioning Postfix, Dovecot, and MySQL mail server. Congratulations!
