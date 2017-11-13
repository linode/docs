---
deprecated: true
author:
  name: Linode
  email: docs@linode.com
description: 'Installing and configuring the Postfix MTA to work with Courier and MySQL for virtual domains on Fedora 12.'
keywords: ["postfix", "courier", "mail server", "imap", "postfix on fedora 12", "postfix on linux", "postfix with courier", "postfix with mysql", "mysql virtual domains"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/courier-mysql-fedora-12/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-05-26
title: 'Email with Postfix, Courier and MySQL on Fedora 12'
---



The Postfix mail transfer agent (MTA) is a high performance, open source email server system. This guide will help you get Postfix running on your Linode, using Courier for IMAP/POP3 service and MySQL to store information on virtual domains and users.

Secure IMAPS and POP3S services are supported with this configuration, along with support for encrypted SMTP connections. This guide is largely based on Falko Timme's excellent [How To Install courier-imap, courier-authlib, And maildrop On Fedora, RedHat, CentOS guide](http://www.howtoforge.com/installing-courier-imap-courier-authlib-maildrop-fedora-redhat-centos), with some packages omitted (such as quota support, as this requires rebuilding Postfix and many organizations have no need for quotas). Other steps have been clarified with additional explanations. This guide does not cover SpamAssassin or webmail software installation, although you may reference other resources to add support for these features.

We assume you've followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH. This tutorial assumes you haven't already installed the MySQL database server; if you have, you will not be required to follow the initial steps related to MySQL installation.

**NOTE: Please carefully read all information presented in this guide.** There are many files and commands that will need to be edited as part of the setup process; please do not simply copy and paste the example blocks.

# Install Required Packages

Make sure your package repositories and installed programs are up to date by issuing the following command:

    yum update

Issue the following command to get the required packages installed on your Linode:

    yum install rpm-build make libtool openldap-devel cyrus-sasl-devel mysql-devel zlib-devel postgresql-devel  \
    gdbm-devel pam-devel expect gcc-c++ redhat-rpm-config libtool-ltdl-devel libidn-devel gamin-devel \
    pam_mysql cyrus-sasl-sql cyrus-sasl cyrus-sasl-plain postfix mysql-server

This will install the Postfix mail server, the MySQL database server, and several supporting packages needed to build Courier and provide services related to authentication. Once these services are installed you will want to configure them to start on boot, and then start them for the first time by issuing the following commands:

    /sbin/chkconfig --levels 235 mysqld on
    /sbin/chkconfig --levels 235 saslauthd on

    service mysqld start
    service saslauthd start

If you have not already set a MySQL root password you will want to do so now by running:

    mysql_secure_installation

Make sure you select a strong password comprised of letters, numbers, and non-alphanumeric characters. Write this password down and keep it in a safe place for later reference.

This completes the initial package configuration steps. Next, we'll build the Courier IMAP server.

# Building and Installing Courier

The Courier build process needs to be completed as a non root user. To simplify the number of users created we will build Courier as the virtual mail user that will store the users' mailboxes when the installation is complete. To create the new account run:

    groupadd -g 5000 vmail
    useradd -g vmail -u 5000 vmail -d /home/vmail -m

Once the new user is created you will want to log in to the account by running:

    su - vmail

After you have logged in as the mail user you will set up the build environment for Courier by running:

    mkdir rpmbuild
    echo "%_topdir /home/vmail/rpmbuild" >> /home/vmail/.rpmmacros
    mkdir source
    cd /home/vmail/source/

Next you will need to fetch the source code to build Courier from with:

    wget http://downloads.sourceforge.net/project/courier/authlib/0.63.0/courier-authlib-0.63.0.tar.bz2
    wget http://downloads.sourceforge.net/project/courier/imap/4.7.0/courier-imap-4.7.0.tar.bz2

You will need to build the Courier authentication library first by running:

    rpmbuild -ta courier-authlib-0.63.0.tar.bz2

The building process may take a few minutes. After Courier finishes building you will need to install the newly built RPM packages. The packages can be found in `/home/vmail/rpmbuild/RPMS/i686/`. To install the new packages you will need to switch back to your root session. You can install the packages with the following commands:

    exit
    rpm -ivh /home/vmail/rpmbuild/RPMS/i686/courier-authlib-0.63.0-1.fc12.i686.rpm
    rpm -ivh /home/vmail/rpmbuild/RPMS/i686/courier-authlib-mysql-0.63.0-1.fc12.i686.rpm
    rpm -ivh /home/vmail/rpmbuild/RPMS/i686/courier-authlib-devel-0.63.0-1.fc12.i686.rpm

Once the packages have in been installed you will want to return to your session as the vmail user. To build the Courier IMAP server you will need to run:

    su - vmail
    cd /home/vmail/source/
    rpmbuild -ta courier-imap-4.7.0.tar.bz2

As with building the authentication library for Courier, the build process could take a few minutes. The Courier-IMAP package will be placed in `/home/vmail/rpmbuild/RPMS/i686/` with your existing packages. To finish installing Courier you will need to run:

    exit
    rpm -ivh /home/vmail/rpmbuild/RPMS/i686/courier-imap-4.7.0-1.12.i686.rpm

You have now installed of the software needed to serve mail from your Linode. Now we will set up MySQL to handle our virtual domains and users.

# Set up MySQL for Virtual Domains and Users

Start the MySQL shell by issuing the following command. You'll be prompted to enter the root password for MySQL that you assigned during the initial setup.

    mysql -u root -p

You'll be presented with an interface similar to the following:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 22
    Server version: 5.1.46 Source distribution

    Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
    This software comes with ABSOLUTELY NO WARRANTY. This is free software,
    and you are welcome to modify and redistribute it under the GPL v2 license

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

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

Configure MySQL to bind to 127.0.0.1 by editing the file `/etc/my.cnf`. You will need to add the `bind-address = 127.0.0.1` directive to the `[mysqld]` block as show below:

{{< file-excerpt "/etc/my.cnf" >}}
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Default to using old password format for compatibility with mysql 3.x
# clients (those using the mysqlclient10 compatibility package).
old_passwords=1
bind-address = 127.0.0.1

{{< /file-excerpt >}}


This is required for Postfix to be able to communicate with the database server. If you have MySQL set up to run on another IP address (such as an internal IP), you will need to substitute this IP address in place of `127.0.0.1` in later Postfix configuration steps. Please note that it is *not* advisable to run MySQL on a publicly-accessible IP address.

After you have changed MySQL's configuration, restart the database server with the following command:

    service mysqld restart

Next, we'll perform additional Postfix configuration to set up communication with our database.

# Configure Postfix to work with MySQL

Create a virtual domain configuration file for Postfix called `/etc/postfix/mysql-virtual_domains.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file "/etc/postfix/mysql-virtual_domains.cf" >}}
user = mail_admin
password = mail_admin_password
dbname = mail
query = SELECT domain AS virtual FROM domains WHERE domain='%s'
hosts = 127.0.0.1

{{< /file >}}


Create a virtual forwarding file for Postfix called `/etc/postfix/mysql-virtual_forwardings.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file "/etc/postfix/mysql-virtual_forwardings.cf" >}}
user = mail_admin
password = mail_admin_password
dbname = mail
query = SELECT domain AS virtual FROM domains WHERE domain='%s'
hosts = 127.0.0.1

{{< /file >}}


Create a virtual mailbox configuration file for Postfix called `/etc/postfix/mysql-virtual_mailboxes.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file "/etc/postfix/mysql-virtual_mailboxes.cf" >}}
user = mail_admin
password = mail_admin_password
dbname = mail
query = SELECT destination FROM forwardings WHERE source='%s'
hosts = 127.0.0.1

{{< /file >}}


Create a virtual email mapping file for Postfix called `/etc/postfix/mysql-virtual_email2email.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{{< file "/etc/postfix/mysql-virtual_email2email.cf" >}}
user = mail_admin
password = mail_admin_password
dbname = mail
query = SELECT email FROM users WHERE email='%s'
hosts = 127.0.0.1

{{< /file >}}


Set proper permissions and ownership for these configuration files by issuing the following commands:

    chmod o= /etc/postfix/mysql-virtual_*.cf
    chgrp postfix /etc/postfix/mysql-virtual_*.cf

Issue the following commands to complete the remaining steps required for Postfix configuration. Please be sure to replace "server.example.com" with the fully qualified domain name you used for your system mail name.

    postconf -e 'myhostname = server.example.com'
    postconf -e 'mydestination = server.example.com, localhost, localhost.localdomain'
    postconf -e 'inet_interfaces = all'
    postconf -e 'mynetworks = 127.0.0.0/8'
    postconf -e 'message_size_limit = 30720000'
    postconf -e 'virtual_alias_domains ='
    postconf -e 'virtual_alias_maps = proxy:mysql:/etc/postfix/mysql-virtual_forwardings.cf, mysql:/etc/postfix/mysql-virtual_email2email.cf'
    postconf -e 'virtual_mailbox_domains = proxy:mysql:/etc/postfix/mysql-virtual_domains.cf'
    postconf -e 'virtual_mailbox_maps = proxy:mysql:/etc/postfix/mysql-virtual_mailboxes.cf'
    postconf -e 'virtual_mailbox_base = /home/vmail'
    postconf -e 'virtual_uid_maps = static:5000'
    postconf -e 'virtual_gid_maps = static:5000'
    postconf -e 'smtpd_sasl_auth_enable = yes'
    postconf -e 'broken_sasl_auth_clients = yes'
    postconf -e 'smtpd_sasl_authenticated_header = yes'
    postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'
    postconf -e 'smtpd_use_tls = yes'
    postconf -e 'smtpd_tls_cert_file = /etc/postfix/smtpd.cert'
    postconf -e 'smtpd_tls_key_file = /etc/postfix/smtpd.key'
    postconf -e 'virtual_create_maildirsize = yes'
    postconf -e 'virtual_maildir_extended = yes'
    postconf -e 'proxy_read_maps = $local_recipient_maps $mydestination $virtual_alias_maps $virtual_alias_domains $virtual_mailbox_maps $virtual_mailbox_domains $relay_recipient_maps $relay_domains $canonical_maps $sender_canonical_maps $recipient_canonical_maps $relocated_maps $transport_maps $mynetworks $virtual_mailbox_limit_maps'

This completes the configuration for Postfix. Next, we'll make an SSL certificate for the Postfix server that contains values appropriate for your organization.

# Create an SSL Certificate for Postfix

Issue the following commands to create the SSL certificate (the `openssl` command spans two lines, but should be entered as a single command):

    cd /etc/postfix
    openssl req -new -outform PEM -out smtpd.cert -newkey rsa:2048 -nodes -keyout smtpd.key -keyform PEM -days 365 -x509

You will be asked to enter several values, similar to the output shown below. Be sure to enter the fully qualified domain name you used for the system mail name in place of "server.example.com".

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

# Configure saslauthd to use MySQL

Edit the file `/etc/sysconfig/saslauthd`, setting "FLAGS" to "-r" as shown below.

{{< file "/etc/sysconfig/saslauthd" >}}
# Directory in which to place saslauthd's listening socket, pid file, and so
# on.  This directory must already exist.
SOCKETDIR=/var/run/saslauthd

# Mechanism to use when checking passwords.  Run "saslauthd -v" to get a list
# of which mechanism your installation was compiled with the ability to use.
MECH=pam

# Options sent to the saslauthd. If the MECH is other than "pam" uncomment the next line.
# DAEMONOPTS=--user saslauth

# Additional flags to pass to saslauthd on the command line.  See saslauthd(8)
# for the list of accepted flags.
FLAGS="-r"

{{< /file >}}


Next, edit the file `/etc/pam.d/smtp` and copy in the following two lines. You will want to comment out the existing configuration options be adding a `#` to the beginning of each line. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file "/etc/pam.d/smtp" >}}
auth    required   pam_mysql.so user=mail_admin passwd=mail_admin_password host=127.0.0.1 db=mail table=users usercolumn=email passwdcolumn=password crypt=1
account sufficient pam_mysql.so user=mail_admin passwd=mail_admin_password host=127.0.0.1 db=mail table=users usercolumn=email passwdcolumn=password crypt=1

{{< /file >}}


Next, edit the file `/usr/lib/sasl2/smtpd.conf` to match the following example. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file "/usr/lib/sasl2/smtpd.conf" >}}
pwcheck_method: saslauthd
mech_list: plain login
allow_plaintext: true
auxprop_plugin: mysql
sql_hostnames: 127.0.0.1
sql_user: mail_admin
sql_passwd: mail_admin_password
sql_database: mail
sql_select: select password from users where email = '%u'

{{< /file >}}


Finally, restart Postfix and `saslauthd` by issuing the following commands:

    service postfix restart
    service saslauthd restart

This completes configuration for `saslauthd`. Next, we'll configure Courier to use MySQL for IMAP/POP3 user authentication.

# Configure Courier to use MySQL

Edit the file `/etc/authlib/authdaemonrc`, changing the "authmodulelist" line to read as follows.

{{< file "/etc/authlib/authdaemonrc" >}}
...
authmodulelist="authmysql"
...

{{< /file >}}


Back up the current `/etc/authlib/authmysqlrc` file and create an empty one as follows:

    cp /etc/authlib/authmysqlrc /etc/authlib/authmysqlrc_orig
    cat /dev/null > /etc/authlib/authmysqlrc

Edit the file `/etc/authlib/authmysqlrc`, copying in the following contents. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file "/etc/authlib/authmysqlrc" >}}
MYSQL_SERVER localhost
MYSQL_USERNAME mail_admin
MYSQL_PASSWORD mail_admin_password
MYSQL_PORT 0
MYSQL_DATABASE mail
MYSQL_USER_TABLE users
MYSQL_CRYPT_PWFIELD password
MYSQL_UID_FIELD 5000
MYSQL_GID_FIELD 5000
MYSQL_LOGIN_FIELD email
MYSQL_HOME_FIELD "/home/vmail"
MYSQL_MAILDIR_FIELD CONCAT(SUBSTRING_INDEX(email,'@',-1),'/',SUBSTRING_INDEX(email,'@',1),'/')

{{< /file >}}


Edit the files `/usr/lib/courier-imap/etc/imapd.cnf` and `/usr/lib/courier-imap/etc/pop3d.cnf`, replacing the "CN=localhost" lines with the fully qualified domain name you used for your system mail name. You may also wish to edit other lines in these configuration files to set values appropriate for your organization. Courier will automatically generate SSL certificates using the provided information the first time it starts.

Now that Courier has been configured you can start it by issuing the following commands:

    service courier-authlib start
    service courier-imap start

To configure Courier to start on boot you will need to run:

    /sbin/chkconfig --levels 235 courier-authlib on
    /sbin/chkconfig --levels 235 courier-imap on

You can test your POP3 server to make sure it's running properly by issuing the following command. You may need to install the `telnet` utility first; if so, issue the command `yum install telnet`.

    telnet localhost pop3

You should see output similar to the following in your terminal:

    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    +OK Hello there.

Enter the command "quit" to return to your shell. This completes Courier configuration. Next, we'll make sure aliases are configured properly.

# Configure Mail Aliases

Edit the file `/etc/aliases`, making sure the "postmaster" and "root" directives are set properly for your organization.

{{< file "/etc/aliases" >}}
postmaster: root
root: <postmaster@example.com>

{{< /file >}}


After modifying this file, you must run the following commands to update aliases and restart Postfix:

    newaliases
    service postfix restart

This completes alias configuration. Next, we'll test Postfix to make sure it's operating properly.

# Testing Postfix

To test Postfix for SMTP-AUTH and TLS, issue the following command:

    telnet localhost smtp

While connected to Postfix, issue the following command:

    ehlo localhost

You should see output similar to the following, with the line "250-STARTTLS" included:

    archimedes:/etc/courier# telnet localhost 25
    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    220 archimedes.example.com ESMTP Postfix
    ehlo localhost
    250-archimedes.example.com
    250-PIPELINING
    250-SIZE 30720000
    250-VRFY
    250-ETRN
    250-STARTTLS
    250-AUTH CRAM-MD5 NTLM PLAIN LOGIN DIGEST-MD5
    250-AUTH=CRAM-MD5 NTLM PLAIN LOGIN DIGEST-MD5
    250-ENHANCEDSTATUSCODES
    250-8BITMIME
    250 DSN

Issue the command `quit` to terminate the Postfix connection. Next, we'll populate the MySQL database with domains and email users.

# Setting up Domains and Users

Please note that you'll need to modify the DNS records for any domains for which you wish to handle email by adding an MX record that points to your mail server's fully qualified domain name. If MX records already exist for a domain you would like to handle the email for, you'll need to either delete them or set them to a larger priority number than your mail server. Smaller priority numbers indicate higher priority for mail delivery, with "0" being the highest priority.

We'll use the MySQL shell to add support for the domain "example.com", which will have an email account called "sales". You should substitute one of your domains for "example.com" in these statements, along with a strong password for the "password" entry in the second SQL statement.

    mysql -u root -p

    USE mail;
    INSERT INTO domains (domain) VALUES ('example.com');
    INSERT INTO users (email, password) VALUES ('sales@example.com', ENCRYPT('password'));

You'll need to send a welcome message to new email accounts before they can be accessed via IMAP or POP3. This is because the mailboxes for new users won't be created until an email is received for them. To send a welcome message from the command line, you may use the `mailx` utility. Issue the following commands to install it and send the message.

    yum install mailx
    mailx sales@example.com

Press `Ctrl+D` to complete the message. This completes the configuration for a new domain and email user.

Congratulations, you've successfully configured Postfix, Courier, and MySQL to provide email services for virtual domains and users on your Linode. When configuring your local email client, use the full email address for the mailbox you wish to connect to as the username. Please consult the "More Information" section for additional resources that may prove useful in the administration of your new email server.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [How To Install courier-imap, courier-authlib, And maildrop On Fedora, RedHat, CentOS](http://www.howtoforge.com/installing-courier-imap-courier-authlib-maildrop-fedora-redhat-centos)
- [Postfix MySQL Howto](http://www.postfix.org/MYSQL_README.html)
- [Postfix SASL Howto](http://www.postfix.org/SASL_README.html)
- [Courier imapd Documentation](http://www.courier-mta.org/imapd.html)
- [Courier pop3d Documentation](http://www.courier-mta.org/pop3d.html)
- [MySQL Documentation](http://dev.mysql.com/doc/)



