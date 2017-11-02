---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Postfix MTA to work with Courier and MySQL for virtual domains on Ubuntu 9.04 (Jaunty).'
keywords: ["postfix", "courier", "mail server", "imap", "postfix on ubuntu", "postfix on linux", "postfix with courier", "postfix with mysql", "mysql virtual domains"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/courier-mysql-ubuntu-9-04-jaunty/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2009-09-14
title: 'Email with Postfix, Courier and MySQL on Ubuntu 9.04 (Jaunty)'
---



The Postfix mail transfer agent (MTA) is a high performance, open source email server system. This guide will help you get Postfix running on your Linode, using Courier for IMAP/POP3 service and MySQL to store information on virtual domains and users.

Secure IMAPS and POP3S services are supported with this configuration, along with support for encrypted SMTP connections. This guide is largely based on Falko Timme's excellent [Postfix and Courier guide](http://www.howtoforge.com/virtual-users-domains-postfix-courier-mysql-squirrelmail-ubuntu9.04), with some packages omitted (such as quota support, as this requires rebuilding Postfix and many organizations have no need for quotas). Other steps have been clarified with additional explanations. This guide does not cover SpamAssassin or webmail software installation, although you may reference other resources to add support for these features.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. This tutorial assumes you haven't already installed the MySQL database server; if you have, you will not be required to follow the initial steps related to MySQL installation.

**NOTE: Please read all information presented in this guide carefully.** There are many files and commands that will need to be edited as part of the setup process; please do not simply copy and paste the example blocks.

Install Required Packages
-------------------------

First, make sure you have the `universe` repositories enabled on your system. Your `/etc/apt/sources.list` should resemble the following (you may have to uncomment or add the `universe` lines):

{{< file >}}
/etc/apt/sources.list
{{< /file >}}

> \#\# main & restricted repositories deb <http://us.archive.ubuntu.com/ubuntu/> jaunty main restricted deb-src <http://us.archive.ubuntu.com/ubuntu/> jaunty main restricted
>
> deb <http://security.ubuntu.com/ubuntu> jaunty-security main restricted deb-src <http://security.ubuntu.com/ubuntu> jaunty-security main restricted
>
> \#\# universe repositories deb <http://us.archive.ubuntu.com/ubuntu/> jaunty universe deb-src <http://us.archive.ubuntu.com/ubuntu/> jaunty universe deb <http://us.archive.ubuntu.com/ubuntu/> jaunty-updates universe deb-src <http://us.archive.ubuntu.com/ubuntu/> jaunty-updates universe
>
> deb <http://security.ubuntu.com/ubuntu> jaunty-security universe deb-src <http://security.ubuntu.com/ubuntu> jaunty-security universe

If you had to enable new repositories, issue the following command to update your package lists:

    apt-get update
    apt-get upgrade

Issue the following command to get the required packages installed on your Linode:

    apt-get install postfix postfix-mysql postfix-doc mysql-client mysql-server courier-authdaemon \
            courier-authlib-mysql courier-pop courier-pop-ssl courier-imap courier-imap-ssl postfix-tls \
            libsasl2-2 libsasl2-modules libsasl2-modules-sql sasl2-bin libpam-mysql openssl

This will install the Postfix mail server, the MySQL database server, the Courier IMAP and POP daemons, and several supporting packages that provide services related to authentication. You will be prompted to choose a root password for MySQL; make sure you select a strong password comprised of letters, numbers, and non-alphanumeric characters. Write this password down and keep it in a safe place for later reference.

[![Setting the root password for MySQL on a Linode.](/docs/assets/435-postfix-courier-mysql-01-mysql-root-password.png)](/docs/assets/435-postfix-courier-mysql-01-mysql-root-password.png)

When prompted, select "No" for web-based administration.

[![Declining web-based administration for the Postfix mail server on an Ubuntu 9.04 (Jaunty) Linode.](/docs/assets/436-postfix-courier-mysql-02-mail-server-type-4.png)](/docs/assets/436-postfix-courier-mysql-02-mail-server-type-4.png)

Next, you'll be prompted to select the type of mail server configuration you want for your Linode. Select "Internet Site" and continue.

[![Selecting the Postfix mail server configuration type on an Ubuntu 9.04 (Jaunty) Linode.](/docs/assets/437-postfix-courier-mysql-02-mail-server-type-2.png)](/docs/assets/437-postfix-courier-mysql-02-mail-server-type-2.png)

Now you'll need to set the system mail name. This should be a fully qualified domain name (FQDN) that points to your Linode's IP address. In this example, we're using an example organization's domain for our mail server. You should set the reverse DNS for your Linode's IP address to the fully qualified domain name you assign as the system mail name, while other domains you wish to host email for will be handled through later virtual domain setup steps.

[![Selecting the Postfix system mail name on an Ubuntu 9.04 (Jaunty) Linode.](/docs/assets/438-postfix-courier-mysql-02-mail-server-type-3.png)](/docs/assets/438-postfix-courier-mysql-02-mail-server-type-3.png)

This completes the initial package configuration steps. Next, we'll set up a MySQL database to handle our virtual domains and users.

Set up MySQL for Virtual Domains and Users
------------------------------------------

Start the MySQL shell by issuing the following command. You'll be prompted to enter the root password for MySQL that you assigned during the initial setup.

    mysql -u root -p

You'll be presented with an interface similar to the following:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 33
    Server version: 5.0.75-0ubuntu10 (Ubuntu)

    Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

    mysql>

Issue the following command to create a database for your mail server and switch to it in the shell:

    CREATE DATABASE mail;
    USE mail;

Create a mail administration user called `mail_admin` and grant it permissions on the `mail` database with the following commands. Please be sure to replace "mail\_admin\_password" with a password you select for this user.

    GRANT SELECT, INSERT, UPDATE, DELETE ON mail.* TO 'mail_admin'@'localhost'
      IDENTIFIED BY 'mail_admin_password';
    GRANT SELECT, INSERT, UPDATE, DELETE ON mail.* TO 'mail_admin'@'localhost.localdomain'
      IDENTIFIED BY 'mail_admin_password';
    FLUSH PRIVILEGES;

Create the virtual domains table with the following command:

    CREATE TABLE domains (domain varchar(50) NOT NULL, PRIMARY KEY (domain) );

Create a table to handle mail forwarding with the following command:

    CREATE TABLE forwardings (source varchar(80) NOT NULL, destination TEXT NOT NULL,
      PRIMARY KEY (source) );

Create the users table with the following command:

    CREATE TABLE users (email varchar(80) NOT NULL, password varchar(20) NOT NULL,
      PRIMARY KEY (email) );

Create a transports table with the following command:

    CREATE TABLE transport (
    domain varchar(128) NOT NULL default '',
    transport varchar(128) NOT NULL default '',
    UNIQUE KEY domain (domain)
    );

Exit the MySQL shell by issuing the following command:

    quit

Check that MySQL is set up to bind to localhost (127.0.0.1) by looking at the file `/etc/mysql/my.cnf`. You should have the following line in the configuration file:

{{< file-excerpt >}}
/etc/mysql/my.cnf
{{< /file-excerpt >}}

> bind-address = 127.0.0.1

This is required for Postfix to be able to communicate with the database server. If you have MySQL set up to run on another IP address (such as an internal IP), you will need to substitute this IP address in place of `127.0.0.1` in later Postfix configuration steps. Please note that it is *not* advisable to run MySQL on a publicly-accessible IP address.

If you changed MySQL's configuration, restart the database server with the following command:

    /etc/init.d/mysql restart

Next, we'll perform additional Postfix configuration to set up communication with our database.

Configure Postfix to work with MySQL
------------------------------------

Create a virtual domain configuration file for Postfix called `/etc/postfix/mysql-virtual_domains.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file >}}
/etc/postfix/mysql-virtual\_domains.cf
{{< /file >}}

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT domain AS virtual FROM domains WHERE domain='%s' hosts = 127.0.0.1

Create a virtual forwarding file for Postfix called `/etc/postfix/mysql-virtual_forwardings.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file >}}
/etc/postfix/mysql-virtual\_forwardings.cf
{{< /file >}}

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT destination FROM forwardings WHERE source='%s' hosts = 127.0.0.1

Create a virtual mailbox configuration file for Postfix called `/etc/postfix/mysql-virtual_mailboxes.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user. Make sure the "query =" section is all on one line; it's broken up here to prevent issues with lower browser resolutions.

{{< file >}}
/etc/postfix/mysql-virtual\_mailboxes.cf
{{< /file >}}

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT CONCAT(SUBSTRING\_INDEX(email,<'@'>,-1),'/',SUBSTRING\_INDEX(email,<'@'>,1),'/') FROM users WHERE email='%s' hosts = 127.0.0.1

Create a virtual email mapping file for Postfix called `/etc/postfix/mysql-virtual_email2email.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file >}}
/etc/postfix/mysql-virtual\_email2email.cf
{{< /file >}}

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT email FROM users WHERE email='%s' hosts = 127.0.0.1

Set proper permissions and ownership for these configuration files by issuing the following commands:

    chmod o= /etc/postfix/mysql-virtual_*.cf
    chgrp postfix /etc/postfix/mysql-virtual_*.cf

Next, we'll create a user and group for mail handling. All virtual mailboxes will be stored under this user's home directory.

    groupadd -g 5000 vmail
    useradd -g vmail -u 5000 vmail -d /home/vmail -m

Issue the following commands to complete the remaining steps required for Postfix configuration. Please be sure to replace "server.example.com" with the fully qualified domain name you used for your system mail name. Please note that several commands are broken up into multiple lines here to prevent issues with lower browser resolutions; these lines must be combined into a single command to work properly, as the `postconf` command does not accept multi-line input.

    postconf -e 'myhostname = server.example.com'
    postconf -e 'mydestination = server.example.com, localhost, localhost.localdomain'
    postconf -e 'mynetworks = 127.0.0.0/8'
    postconf -e 'message_size_limit = 30720000'
    postconf -e 'virtual_alias_domains ='
    postconf -e 'virtual_alias_maps = proxy:mysql:/etc/postfix/mysql-virtual_forwardings.cf,
                 mysql:/etc/postfix/mysql-virtual_email2email.cf'
    postconf -e 'virtual_mailbox_domains = proxy:mysql:/etc/postfix/mysql-virtual_domains.cf'
    postconf -e 'virtual_mailbox_maps = proxy:mysql:/etc/postfix/mysql-virtual_mailboxes.cf'
    postconf -e 'virtual_mailbox_base = /home/vmail'
    postconf -e 'virtual_uid_maps = static:5000'
    postconf -e 'virtual_gid_maps = static:5000'
    postconf -e 'smtpd_sasl_auth_enable = yes'
    postconf -e 'broken_sasl_auth_clients = yes'
    postconf -e 'smtpd_sasl_authenticated_header = yes'
    postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated,
                 reject_unauth_destination'
    postconf -e 'smtpd_use_tls = yes'
    postconf -e 'smtpd_tls_cert_file = /etc/postfix/smtpd.cert'
    postconf -e 'smtpd_tls_key_file = /etc/postfix/smtpd.key'
    postconf -e 'virtual_create_maildirsize = yes'
    postconf -e 'virtual_maildir_extended = yes'
    postconf -e 'proxy_read_maps = $local_recipient_maps $mydestination $virtual_alias_maps
                 $virtual_alias_domains $virtual_mailbox_maps $virtual_mailbox_domains
                 $relay_recipient_maps $relay_domains $canonical_maps $sender_canonical_maps
                 $recipient_canonical_maps $relocated_maps $transport_maps $mynetworks
                 $virtual_mailbox_limit_maps'

This completes the configuration for Postfix. Next, we'll make an SSL certificate for the Postfix server that contains values appropriate for your organization.

Create an SSL Certificate for Postfix
-------------------------------------

Issue the following commands to create the SSL certificate (the `openssl` command spans two lines, but should be entered as a single command):

    cd /etc/postfix
    openssl req -new -outform PEM -out smtpd.cert -newkey rsa:2048 -nodes -keyout smtpd.key
            -keyform PEM -days 365 -x509

You will be asked to enter several values, similar to the output shown below. Be sure to enter the fully qualified domain name you used for the system mailname in place of "server.example.com".

    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Absecon
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:MyCompany, LLC
    Organizational Unit Name (eg, section) []:Email Services
    Common Name (eg, YOUR name) []:server.example.com
    Email Address []:support@example.com

Set proper permissions for the key file by issuing the following command:

    chmod o= /etc/postfix/smtpd.key

This completes SSL certificate creation for Postfix. Next, we'll configure `saslauthd` to use MySQL for user authentication.

Configure saslauthd to use MySQL
--------------------------------

Issue the following command to create a directory for `saslauthd`:

    mkdir -p /var/spool/postfix/var/run/saslauthd

Edit the file `/etc/default/saslauthd`, setting "START" to "YES" and changing the "OPTIONS" line to match the configuration shown below.

{{< file >}}
/etc/default/saslauthd
{{< /file >}}

> \# \# Settings for saslauthd daemon \# Please read /usr/share/doc/sasl2-bin/README.Debian for details. \#
>
> \# Should saslauthd run automatically on startup? (default: no) START=yes
>
> \# Description of this saslauthd instance. Recommended. \# (suggestion: SASL Authentication Daemon) DESC="SASL Authentication Daemon"
>
> \# Short name of this saslauthd instance. Strongly recommended. \# (suggestion: saslauthd) NAME="saslauthd"
>
> \# Which authentication mechanisms should saslauthd use? (default: pam) \# \# Available options in this Debian package: \# getpwent -- use the getpwent() library function \# kerberos5 -- use Kerberos 5 \# pam -- use PAM \# rimap -- use a remote IMAP server \# shadow -- use the local shadow password file \# sasldb -- use the local sasldb database file \# ldap -- use LDAP (configuration is in /etc/saslauthd.conf) \# \# Only one option may be used at a time. See the saslauthd man page \# for more information. \# \# Example: MECHANISMS="pam" MECHANISMS="pam"
>
> \# Additional options for this mechanism. (default: none) \# See the saslauthd man page for information about mech-specific options. MECH\_OPTIONS=""
>
> \# How many saslauthd processes should we run? (default: 5) \# A value of 0 will fork a new process for each connection. THREADS=5
>
> \# Other options (default: -c -m /var/run/saslauthd) \# Note: You MUST specify the -m option or saslauthd won't run! \# \# WARNING: DO NOT SPECIFY THE -d OPTION. \# The -d option will cause saslauthd to run in the foreground instead of as \# a daemon. This will PREVENT YOUR SYSTEM FROM BOOTING PROPERLY. If you wish \# to run saslauthd in debug mode, please run it by hand to be safe. \# \# See /usr/share/doc/sasl2-bin/README.Debian for Debian-specific information. \# See the saslauthd man page and the output of 'saslauthd -h' for general \# information about these options. \# \# Example for postfix users: "-c -m /var/spool/postfix/var/run/saslauthd" \#OPTIONS="-c -m /var/run/saslauthd" OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd -r"

Next, create the file `/etc/pam.d/smtp` and copy in the following two lines. For display purposes, each line is broken up into two lines, but these should be combined in your configuration file so that you have two lines beginning with "auth" and "account". Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file >}}
/etc/pam.d/smtp
{{< /file >}}

> auth required pam\_mysql.so user=mail\_admin passwd=mail\_admin\_password host=127.0.0.1
> :   db=mail table=users usercolumn=email passwdcolumn=password crypt=1
>
> account sufficient pam\_mysql.so user=mail\_admin passwd=mail\_admin\_password host=127.0.0.1
> :   db=mail table=users usercolumn=email passwdcolumn=password crypt=1
>
Create a file named `/etc/postfix/sasl/smtpd.conf` with the following contents. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file >}}
/etc/postfix/sasl/smtpd.conf
{{< /file >}}

> pwcheck\_method: saslauthd mech\_list: plain login allow\_plaintext: true auxprop\_plugin: mysql sql\_hostnames: 127.0.0.1 sql\_user: mail\_admin sql\_passwd: mail\_admin\_password sql\_database: mail sql\_select: select password from users where email = '%u'

Add the Postfix user to the `sasl` group and restart Postfix and `saslauthd` by issuing the following commands:

    adduser postfix sasl
    /etc/init.d/postfix restart
    /etc/init.d/saslauthd restart

This completes configuration for `saslauthd`. Next, we'll configure Courier to use MySQL for IMAP/POP3 user authentication.

Configure Courier to use MySQL
------------------------------

Edit the file `/etc/courier/authdaemonrc`, changing the "authmodulelist" line to read as follows.

{{< file-excerpt >}}
/etc/courier/authdaemonrc
{{< /file-excerpt >}}

> authmodulelist="authmysql"

Back up the current `/etc/courier/authmysqlrc` file and create an empty one as follows:

    cp /etc/courier/authmysqlrc /etc/courier/authmysqlrc_orig
    cat /dev/null > /etc/courier/authmysqlrc

Edit the file `/etc/courier/authmysqlrc`, copying in the following contents. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file >}}
/etc/courier/authmysqlrc
{{< /file >}}

> MYSQL\_SERVER localhost MYSQL\_USERNAME mail\_admin MYSQL\_PASSWORD mail\_admin\_password MYSQL\_PORT 0 MYSQL\_DATABASE mail MYSQL\_USER\_TABLE users MYSQL\_CRYPT\_PWFIELD password MYSQL\_UID\_FIELD 5000 MYSQL\_GID\_FIELD 5000 MYSQL\_LOGIN\_FIELD email MYSQL\_HOME\_FIELD "/home/vmail" MYSQL\_MAILDIR\_FIELD CONCAT(SUBSTRING\_INDEX(email,<'@'>,-1),'/',SUBSTRING\_INDEX(email,<'@'>,1),'/')

Delete the original certificates created by Courier by issuing the following commands:

    rm -f /etc/courier/imapd.pem
    rm -f /etc/courier/pop3d.pem

Edit the files `/etc/courier/imapd.cnf` and `/etc/courier/pop3d.cnf`, replacing the "CN=localhost" lines with the fully qualified domain name you used for your system mailname. You may also wish to edit other lines in these configuration files to set values appropriate for your organization.

Regenerate the certificates for Courier and restart its daemons by issuing the following commands:

    cd /etc/courier
    mkimapdcert
    mkpop3dcert
    /etc/init.d/courier-authdaemon restart
    /etc/init.d/courier-imap restart
    /etc/init.d/courier-imap-ssl restart
    /etc/init.d/courier-pop restart
    /etc/init.d/courier-pop-ssl restart

You can test your POP3 server to make sure it's running properly by issuing the following command. You may need to install the `telnet` utility first; if so, issue the command `apt-get install telnet`.

    telnet localhost pop3

You should see output similar to the following in your terminal:

    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    +OK Hello there.

Enter the command "quit" to return to your shell. This completes Courier configuration. Next, we'll make sure aliases are configured properly.

Configure Mail Aliases
----------------------

Edit the file `/etc/aliases`, making sure the "postmaster" and "root" directives are set properly for your organization.

{{< file >}}
/etc/aliases
{{< /file >}}

> postmaster: root root: <postmaster@example.com>

After modifying this file, you must run the following commands to update aliases and restart Postfix:

    newaliases
    /etc/init.d/postfix restart

This completes alias configuration. Next, we'll test Postfix to make sure it's operating properly.

Testing Postfix
---------------

To test Postfix for SMTP-AUTH and TLS, issue the following command:

    telnet localhost 25

While connected to Postfix, issue the following command:

    ehlo localhost

You should see output similar to the following, with the line "250-STARTTLS" included:

    root@archimedes:/etc/courier# telnet localhost 25
    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    220 archimedes.example.com ESMTP Postfix (Ubuntu)
    ehlo localhost
    250-archimedes.example.com
    250-PIPELINING
    250-SIZE 30720000
    250-VRFY
    250-ETRN
    250-STARTTLS
    250-AUTH PLAIN LOGIN
    250-AUTH=PLAIN LOGIN
    250-ENHANCEDSTATUSCODES
    250-8BITMIME
    250 DSN

Issue the command `quit` to terminate the Postfix connection. Next, we'll populate the MySQL database with domains and email users.

Setting up Domains and Users
----------------------------

Please note that you'll need to modify the DNS records for any domains for which you wish to handle email by adding an MX record that points to your mail server's fully qualified domain name. If MX records already exist for a domain you would like to handle the email for, you'll need to either delete them or set them to a larger priority number than your mail server. Smaller priority numbers indicate higher priority for mail delivery, with "0" being the highest priority.

We'll use the MySQL shell to add support for the domain "example.com", which will have an email account called "sales". You should substitute one of your domains for "example.com" in these statements, along with a strong password for the "password" entry in the second SQL statement.

    mysql -u root -p

    USE mail;
    INSERT INTO domains (domain) VALUES ('example.com');
    INSERT INTO users (email, password) VALUES ('sales@example.com', ENCRYPT('password'));

You'll need to send a welcome message to new email accounts before they can be accessed via IMAP or POP3. This is because the mailboxes for new users won't be created until an email is received for them. To send a welcome message from the command line, you may use the `mailx` utility. Issue the following commands to install it and send the message.

    apt-get install mailx
    mailx sales@example.com

Press `Ctrl+D` to complete the message. You can safely leave the field for "CC:" blank. This completes the configuration for a new domain and email user.

Congratulations, you've successfully configured Postfix, Courier, and MySQL to provide email services for virtual domains and users on your Linode. Please consult the "More Information" section for additional resources that may prove useful in the administration of your new email server.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Virtual Users And Domains With Postfix, Courier, MySQL And SquirrelMail (Ubuntu 9.04)](http://www.howtoforge.com/virtual-users-domains-postfix-courier-mysql-squirrelmail-ubuntu9.04)
- [Postfix MySQL Howto](http://www.postfix.org/MYSQL_README.html)
- [Postfix SASL Howto](http://www.postfix.org/SASL_README.html)
- [Courier imapd Documentation](http://www.courier-mta.org/imapd.html)
- [Courier pop3d Documentation](http://www.courier-mta.org/pop3d.html)
- [MySQL Documentation](http://dev.mysql.com/doc/)



