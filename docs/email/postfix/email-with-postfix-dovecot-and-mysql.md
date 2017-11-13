---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up a mail server with Postfix, Dovecot, and MySQL.'
keywords: ["email", " mail", " server", " postfix", " dovecot", " mysql", " debian", " ubuntu", " dovecot 2"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-04-29
modified_by:
  name: Phil Zona
published: 2013-05-13
title: 'Email with Postfix, Dovecot, and MySQL'
---

In this guide, you'll learn how to set up a secure mail server with Postfix, Dovecot, and MySQL on Debian or Ubuntu. Specifically, we'll explain how to create new user mailboxes and send or receive email to and from configured domains.

![Email with Postfix, Dovecot, and MySQL](/docs/assets/email_with_postfix_dovecot_and_mysql.png "Setting up a mail server with Postfix, Dovecot, and MySQL")

For a different Linux distribution or different mail server, review our [email tutorials](/docs/email).

### Before You Begin

1.  Set up the Linode as specified in the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

2.  Ensure that the iptables [firewall](/docs/securing-your-server#configure-a-firewall) is not blocking any of the standard mail ports (`25`, `465`, `587`, `110`, `995`, `143`, and `993`). If using a different form of firewall, confirm that it is not blocking any of the needed ports either.

### Configure DNS

When ready to update the DNS and to start sending mail to the server, edit the domain's MX record so that it points to the Linode's domain or IP address, similar to the example below:

    example.com         MX      10      example.com
    example.com         MX      10      12.34.56.78
    mail.example.com    MX      10      12.34.56.78

Ensure that the MX record is changed for all domains and subdomains that might receive email. If setting up a brand new domain, these steps can be performed prior to configuring the mail server. When using Linode's [DNS Manager](/docs/dns-manager), create an MX record that points to the desired domain or subdomain, and then create an A record for that domain or subdomain, which points to the correct IP address.

### Installing an SSL Certificate

Dovecot offers a default self-signed certificate for free. This certificate encrypts the mail connections similar to a purchased certificate. However, the email users receive warnings about the certificate when they attempt to set up their email accounts. Optionally, you can purchase and configure a commercial SSL certificate to avoid the warnings. For information about SSL certificates, see [Linode's SSL Certificate guides](/docs/security/ssl/).

{{< note >}}
As of version 2.2.13-7, Dovecot no longer provides a default SSL certificate. This affects Debian 8 users, and means that if you wish to use SSL encryption (recommended), you must generate your own self-signed certificate or use a trusted certificate from a Certificate Authority.

Many email service providers such as Gmail will only accept commercial SSL certificates for secure IMAP/POP3 connections. To communicate with these providers, follow our guide for obtaining a commercial SSL certificate for [Debian and Ubuntu](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-debian-and-ubuntu) or [CentOS and Fedora](/docs/security/ssl/obtain-a-commercially-signed-ssl-certificate-on-centos-and-fedora).
{{< /note >}}

## Installing Packages

The next steps are to install the required packages on the Linode.

1.  Log in as the root user via SSH. Replace `example` with your domain name or IP address:

        ssh root@example

2.  Install the required packages:

        apt-get install postfix postfix-mysql dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql mysql-server

    Follow the prompt to type in a secure MySQL password and to select the type of mail server you wish to configure. Select **Internet Site**. The *System Mail Name* should be the FQDN.

    [![Set the root MySQL password.](/docs/assets/1234-mysql_setroot1.png)](/docs/assets/1234-mysql_setroot1.png)

    [![Choose "Internet Site" for Postfix.](/docs/assets/1236-postfix_internetsite.png)](/docs/assets/1236-postfix_internetsite.png)

    [![Set the system mail name for Postfix.](/docs/assets/1237-postfix_systemmailname.png)](/docs/assets/1237-postfix_systemmailname.png)

## MySQL

1.  Create a new database:

        mysqladmin -p create mailserver

2.  Enter the MySQL root password.

3.  Log in to MySQL:

        mysql -p mailserver

4.  Create the MySQL user and grant the new user permissions over the database. Replace `mailuserpass` with a secure password:

        GRANT SELECT ON mailserver.* TO 'mailuser'@'127.0.0.1' IDENTIFIED BY 'mailuserpass';

5.  Flush the MySQL privileges to apply the change:

        FLUSH PRIVILEGES;

6.  Create a table for the domains that will receive mail on the Linode:

        CREATE TABLE `virtual_domains` (
          `id` int(11) NOT NULL auto_increment,
          `name` varchar(50) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

7.  Create a table for all of the email addresses and passwords:

        CREATE TABLE `virtual_users` (
          `id` int(11) NOT NULL auto_increment,
          `domain_id` int(11) NOT NULL,
          `password` varchar(106) NOT NULL,
          `email` varchar(100) NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `email` (`email`),
          FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

8.  Create a table for the email aliases:

        CREATE TABLE `virtual_aliases` (
          `id` int(11) NOT NULL auto_increment,
          `domain_id` int(11) NOT NULL,
          `source` varchar(100) NOT NULL,
          `destination` varchar(100) NOT NULL,
          PRIMARY KEY (`id`),
          FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

### Adding Data

Now that the database and tables have been created, add some data to MySQL.

1.  Add the domains to the `virtual_domains` table. Replace the values for `example.com` and `hostname` with your own settings.

        INSERT INTO `mailserver`.`virtual_domains`
          (`id` ,`name`)
        VALUES
          ('1', 'example.com'),
          ('2', 'hostname.example.com'),
          ('3', 'hostname'),
          ('4', 'localhost.example.com');

    {{< note >}}
Note which `id` goes with which domain, the `id` is necessary for the next two steps.
{{< /note >}}

2.  Add email addresses to the `virtual_users` table. Replace the email address values with the addresses that you wish to configure on the mailserver. Replace the `password` values with strong passwords.

        INSERT INTO `mailserver`.`virtual_users`
          (`id`, `domain_id`, `password` , `email`)
        VALUES
          ('1', '1', ENCRYPT('password', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))), 'email1@example.com'),
          ('2', '1', ENCRYPT('password', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))), 'email2@example.com');

3.  To set up an email alias, add it to the `virtual_aliases` table.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`id`, `domain_id`, `source`, `destination`)
        VALUES
          ('1', '1', 'alias@example.com', 'email1@example.com');

That's it! Now you're ready to verify that the data was successfully added to MySQL.

### Testing

Since all of the information has been entered into MySQL, check that the data is there.

1.  Check the contents of the `virtual_domains` table:

        SELECT * FROM mailserver.virtual_domains;

2.  Verify that you see the following output:

        +----+-----------------------+
        | id | name                  |
        +----+-----------------------+
        |  1 | example.com           |
        |  2 | hostname.example.com  |
        |  3 | hostname              |
        |  4 | localhost.example.com |
        +----+-----------------------+
        4 rows in set (0.00 sec)

3.  Check the `virtual_users` table:

        SELECT * FROM mailserver.virtual_users;

4.  Verify the following output, the hashed passwords are longer than they appear below:

        +----+-----------+-------------------------------------+--------------------+
        | id | domain_id | password                            | email              |
        +----+-----------+-------------------------------------+--------------------+
        |  1 |         1 | $6$574ef443973a5529c20616ab7c6828f7 | email1@example.com |
        |  2 |         1 | $6$030fa94bcfc6554023a9aad90a8c9ca1 | email2@example.com |
        +----+-----------+-------------------------------------+--------------------+
        2 rows in set (0.01 sec)

5.  Check the `virtual_aliases` table:

        SELECT * FROM mailserver.virtual_aliases;

6.  Verify the following output:

        +----+-----------+-------------------+--------------------+
        | id | domain_id | source            | destination        |
        +----+-----------+-------------------+--------------------+
        |  1 |         1 | alias@example.com | email1@example.com |
        +----+-----------+-------------------+--------------------+
        1 row in set (0.00 sec)

7.  If everything outputs correctly, you're done with MySQL! Exit MySQL:

        exit

## Postfix

Next, set up Postfix so the server can accept incoming messages for the domains.

1.  Before making any changes, make a copy of the default Postfix configuration file in case you need to revert to the default configuration:

        cp /etc/postfix/main.cf /etc/postfix/main.cf.orig

2.  Edit the `/etc/postfix/main.cf` file to match the following. Ensure that occurrences of `example.com` are replaced with the domain name. Also, replace `hostname` with the system's hostname on line 44.

    {{< file "/etc/postfix/main.cf" >}}
# See /usr/share/postfix/main.cf.dist for a commented, more complete version

# Debian specific:  Specifying a file name will cause the first
# line of that file to be used as the name.  The Debian default
# is /etc/mailname.
#myorigin = /etc/mailname

smtpd_banner = $myhostname ESMTP $mail_name (Ubuntu)
biff = no

# appending .domain is the MUA's job.
append_dot_mydomain = no

# Uncomment the next line to generate "delayed mail" warnings
#delay_warning_time = 4h

readme_directory = no

# TLS parameters
#smtpd_tls_cert_file=/etc/ssl/certs/ssl-cert-snakeoil.pem
#smtpd_tls_key_file=/etc/ssl/private/ssl-cert-snakeoil.key
#smtpd_use_tls=yes
#smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
#smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

smtpd_tls_cert_file=/etc/dovecot/dovecot.pem
smtpd_tls_key_file=/etc/dovecot/private/dovecot.pem
smtpd_use_tls=yes
smtpd_tls_auth_only = yes
smtp_tls_security_level = may
smtpd_tls_security_level = may

# Enabling SMTP for authenticated users, and handing off authentication to Dovecot
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes

smtpd_recipient_restrictions =
        permit_sasl_authenticated,
        permit_mynetworks,
        reject_unauth_destination

# See /usr/share/doc/postfix/TLS_README.gz in the postfix-doc package for
# information on enabling SSL in the smtp client.

myhostname = hostname.example.com
alias_maps = hash:/etc/aliases
alias_database = hash:/etc/aliases
myorigin = /etc/mailname
#mydestination = example.com, hostname.example.com, localhost.example.com, localhost
mydestination = localhost
relayhost =
mynetworks = 127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128
mailbox_size_limit = 0
recipient_delimiter = +
inet_interfaces = all

# Handing off local delivery to Dovecot's LMTP, and telling it where to store mail
virtual_transport = lmtp:unix:private/dovecot-lmtp

# Virtual domains, users, and aliases
virtual_mailbox_domains = mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf
virtual_mailbox_maps = mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf
virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-alias-maps.cf,
        mysql:/etc/postfix/mysql-virtual-email2email.cf

{{< /file >}}


3.  Create the file for virtual domains. Ensure that you change the password for the `mailuser` account. If you used a different user, database name, or table name, change those settings as well.

    {{< file "/etc/postfix/mysql-virtual-mailbox-domains.cf" >}}
user = mailuser
password = mailuserpass
hosts = 127.0.0.1
dbname = mailserver
query = SELECT 1 FROM virtual_domains WHERE name='%s'

{{< /file >}}


4.  Create the `/etc/postfix/mysql-virtual-mailbox-maps.cf` file, and enter the following values. Make sure you use the `mailuser`'s password and make any other changes as needed.

    {{< file "/etc/postfix/mysql-virtual-mailbox-maps.cf" >}}
user = mailuser
password = mailuserpass
hosts = 127.0.0.1
dbname = mailserver
query = SELECT 1 FROM virtual_users WHERE email='%s'

{{< /file >}}


5.  Create the `/etc/postfix/mysql-virtual-alias-maps.cf` file and enter the following values. Again, make sure you use the mailuser's password, and make any other changes as necessary.

    {{< file "/etc/postfix/mysql-virtual-alias-maps.cf" >}}
user = mailuser
password = mailuserpass
hosts = 127.0.0.1
dbname = mailserver
query = SELECT destination FROM virtual_aliases WHERE source='%s'

{{< /file >}}


6.  Create the `/etc/postfix/mysql-virtual-email2email.cf` file and enter the following values. Again, make sure you use the mailuser's password, and make any other changes as necessary.

    {{< file "/etc/postfix/mysql-virtual-email2email.cf" >}}
user = mailuser
password = mailuserpass
hosts = 127.0.0.1
dbname = mailserver
query = SELECT email FROM virtual_users WHERE email='%s'

{{< /file >}}


7.  Save the changes you've made to the `/etc/postfix/mysql-virtual-email2email.cf` file, and restart Postfix:

        sudo service postfix restart

8.  Enter the following command to ensure that Postfix can find the first domain. Be sure to replace `example.com` with the first virtual domain. The command should return `1` if it is successful.

        postmap -q example.com mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf

9.  Test Postfix to verify that it can find the first email address in the MySQL table. Enter the following command, replacing `email1@example.com` with the first email address in the MySQL table. You should again receive `1` as the output:

        postmap -q email1@example.com mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf

10. Test Postfix to verify that it can find the aliases by entering the following command. Be sure to replace `alias@example.com` with the actual alias you entered:

        postmap -q alias@example.com mysql:/etc/postfix/mysql-virtual-alias-maps.cf

    This should return the email address to which the alias forwards, which is `email1@example.com` in this example.

11. Make a copy of the `/etc/postfix/master.cf` file:

        cp /etc/postfix/master.cf /etc/postfix/master.cf.orig

12. Open the configuration file for editing and uncomment the two lines starting with `submission` and `smtps` and the block of lines starting with `-o` after each. The first section of the `/etc/postfix/master.cf` file should resemble the following:

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
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
smtps     inet  n       -       -       -       -       smtpd
  -o syslog_name=postfix/smtps
  -o smtpd_tls_wrappermode=yes
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_client_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING


{{< /file-excerpt >}}


13. Change the permissions on the `/etc/postfix` directory to restrict permissions to allow only its owner and the corresponding group:

        chmod -R o-rwx /etc/postfix

14. Restart Postfix:

        service postfix restart

Congratulations! You have successfully configured Postfix.

## Dovecot

Dovecot allows users to log in and check their email using POP3 and IMAP. In this section, configure Dovecot to force users to use SSL when they connect so that their passwords are never sent to the server in plain text.

1.  Copy all of the configuration files so that you can easily revert back to them if needed:

        cp /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf.orig
        cp /etc/dovecot/conf.d/10-mail.conf /etc/dovecot/conf.d/10-mail.conf.orig
        cp /etc/dovecot/conf.d/10-auth.conf /etc/dovecot/conf.d/10-auth.conf.orig
        cp /etc/dovecot/dovecot-sql.conf.ext /etc/dovecot/dovecot-sql.conf.ext.orig
        cp /etc/dovecot/conf.d/10-master.conf /etc/dovecot/conf.d/10-master.conf.orig
        cp /etc/dovecot/conf.d/10-ssl.conf /etc/dovecot/conf.d/10-ssl.conf.orig

2.  Open the main configuration file and edit the contents to match the following. Specifically, add the line beginning with `protocols` under the section beginning with "Enable installed protocols."

    {{< file "/etc/dovecot/dovecot.conf" >}}
## Dovecot configuration file

# If you're in a hurry, see http://wiki2.dovecot.org/QuickConfiguration

# "doveconf -n" command gives a clean output of the changed settings. Use it
# instead of copy&pasting files when posting to the Dovecot mailing list.

# '#' character and everything after it is treated as comments. Extra spaces
# and tabs are ignored. If you want to use either of these explicitly, put the
# value inside quotes, eg.: key = "# char and trailing whitespace  "

# Default values are shown for each setting, it's not required to uncomment
# those. These are exceptions to this though: No sections (e.g. namespace {})
# or plugin settings are added by default, they're listed only as examples.
# Paths are also just examples with the real defaults being based on configure
# options. The paths listed here are for configure --prefix=/usr
# --sysconfdir=/etc --localstatedir=/var

# Enable installed protocols
!include_try /usr/share/dovecot/protocols.d/*.protocol
protocols = imap pop3 lmtp

# A comma separated list of IPs or hosts where to listen in for connections.
# "*" listens in all IPv4 interfaces, "::" listens in all IPv6 interfaces.
# If you want to specify non-default ports or anything more complex,
# edit conf.d/master.conf.
#listen = *, ::

# Base directory where to store runtime data.
#base_dir = /var/run/dovecot/

# Name of this instance. Used to prefix all Dovecot processes in ps output.
#instance_name = dovecot

# Greeting message for clients.
#login_greeting = Dovecot ready.

# Space separated list of trusted network ranges. Connections from these
# IPs are allowed to override their IP addresses and ports (for logging and
# for authentication checks). disable_plaintext_auth is also ignored for
# these networks. Typically you'd specify the IMAP proxy servers here.
#login_trusted_networks =

# Sepace separated list of login access check sockets (e.g. tcpwrap)
#login_access_sockets =

# Show more verbose process titles (in ps). Currently shows user name and
# IP address. Useful for seeing who are actually using the IMAP processes
# (eg. shared mailboxes or if same uid is used for multiple accounts).
#verbose_proctitle = no

# Should all processes be killed when Dovecot master process shuts down.
# Setting this to "no" means that Dovecot can be upgraded without
# forcing existing client connections to close (although that could also be
# a problem if the upgrade is e.g. because of a security fix).
#shutdown_clients = yes

# If non-zero, run mail commands via this many connections to doveadm server,
# instead of running them directly in the same process.
#doveadm_worker_count = 0
# UNIX socket or host:port used for connecting to doveadm server
#doveadm_socket_path = doveadm-server

# Space separated list of environment variables that are preserved on Dovecot
# startup and passed down to all of its child processes. You can also give
# key=value pairs to always set specific settings.
#import_environment = TZ

##
## Dictionary server settings
##

# Dictionary can be used to store key=value lists. This is used by several
# plugins. The dictionary can be accessed either directly or though a
# dictionary server. The following dict block maps dictionary names to URIs
# when the server is used. These can then be referenced using URIs in format
# "proxy::<name>".

dict {
  #quota = mysql:/etc/dovecot/dovecot-dict-sql.conf.ext
  #expire = sqlite:/etc/dovecot/dovecot-dict-sql.conf.ext
}

# Most of the actual configuration gets included below. The filenames are
# first sorted by their ASCII value and parsed in that order. The 00-prefixes
# in filenames are intended to make it easier to understand the ordering.
!include conf.d/*.conf

# A config file can also tried to be included without giving an error if
# it's not found:
!include_try local.conf

{{< /file >}}


3.  Save the changes to the `/etc/dovecot/dovecot.conf` file.

4.  Open the `/etc/dovecot/conf.d/10-mail.conf` file. This file controls how Dovecot interacts with the server's file system to store and retrieve messages.

    {{< note >}}
Click [this link](/docs/assets/1239-dovecot_10-mail.conf.txt) to see the final, complete version of `10-mail.conf` example file. This is a long file, so you may need to use your text editor's search feature to find the values you need to edit.
{{< /note >}}

    Modify the following variables within the configuration file:

    {{< file-excerpt "/etc/dovecot/conf.d/10-mail.conf" >}}
mail_location = maildir:/var/mail/vhosts/%d/%n
...
mail_privileged_group = mail

{{< /file-excerpt >}}


    Save your changes and exit.

5.  Enter the following command to verify the permissions for `/var/mail`:

        ls -ld /var/mail

6.  Verify that the permissions for `/var/mail` are as follows. The date and time will likely be different in your output:

        drwxrwsr-x 2 root mail 4096 Mar  6 15:08 /var/mail

    If your permissions do not match the above, go back and ensure you've completed the above steps correctly.

7.  Create the `/var/mail/vhosts/` directory and a subdirectory for your domain, replacing `example.com`:

        mkdir -p /var/mail/vhosts/example.com

    This directory will serve as storage for mail sent to your domain.

8.  Create the `vmail` user with a user and group id of 5000 by entering the following commands, one by one. This user will be in charge of reading mail from the server.

        groupadd -g 5000 vmail
        useradd -g vmail -u 5000 vmail -d /var/mail

9.  Change the owner of the `/var/mail/` folder and its contents to belong to `vmail`:

        chown -R vmail:vmail /var/mail

10. Open the user authentication file, located in `/etc/dovecot/conf.d/10-auth.conf` and disable plain-text authentication by uncommenting this line:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
disable_plaintext_auth = yes

{{< /file-excerpt >}}


    Set the `auth_mechanisms` by modifying the following line:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
auth_mechanisms = plain login


{{< /file-excerpt >}}


    Comment out the system user login line:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
#!include auth-system.conf.ext


{{< /file-excerpt >}}


    Enable MySQL authentication by uncommenting the `auth-sql.conf.ext` line:

    {{< file-excerpt "/etc/dovecot/conf.d/10-auth.conf" >}}
#!include auth-system.conf.ext
!include auth-sql.conf.ext
#!include auth-ldap.conf.ext
#!include auth-passwdfile.conf.ext
#!include auth-checkpassword.conf.ext
#!include auth-vpopmail.conf.ext
#!include auth-static.conf.ext


{{< /file-excerpt >}}


    {{< note >}}
[Here](/docs/assets/1238-dovecot_10-auth.conf.txt) is an example of a complete `10-auth.conf` file.
{{< /note >}}

    Save the changes to the `/etc/dovecot/conf.d/10-auth.conf` file.

11. Edit the `/etc/dovecot/conf.d/auth-sql.conf.ext` file with the authentication information. Ensure your file contains the following lines and that they are uncommented:

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


    Save the changes to the `/etc/dovecot/conf.d/auth-sql.conf.ext` file.

12. Update the `/etc/dovecot/dovecot-sql.conf.ext` file with our custom MySQL connection information.

    Uncomment and set the `driver` line as shown below:

    {{< file-excerpt "/etc/dovecot/dovecot-sql.conf.ext" >}}
driver = mysql


{{< /file-excerpt >}}


    Uncomment the `connect` line and set the MySQL connection information. Use the `mailuser`'s password and any other custom settings:

    {{< file-excerpt "/etc/dovecot/dovecot-sql.conf.ext" >}}
connect = host=127.0.0.1 dbname=mailserver user=mailuser password=mailuserpass


{{< /file-excerpt >}}


    Uncomment the `default_pass_scheme` line and set it to `SHA512-CRYPT`:

    {{< file-excerpt "/etc/dovecot/dovecot-sql.conf.ext" >}}
default_pass_scheme = SHA512-CRYPT


{{< /file-excerpt >}}


    Uncomment the `password_query` line and set it to the following:

    {{< file-excerpt "/etc/dovecot/dovecot-sql.conf.ext" >}}
password_query = SELECT email as user, password FROM virtual_users WHERE email='%u';


{{< /file-excerpt >}}


    {{< note >}}
This password query lets you use an email address listed in the `virtual_users` table as the username credential for an email account. If you want to be able to use the alias as the username instead (listed in the `virtual_aliases` table), first add every primary email address to the `virtual_aliases` table (directing to themselves) and then use the following line in `/etc/dovecot/dovecot-sql.conf.ext` instead:

password_query = SELECT email as user, password FROM virtual_users WHERE email=(SELECT destination FROM virtual_aliases WHERE source = '%u');
{{< /note >}}

    {{< note >}}
[Here](/docs/assets/1284-dovecot__dovecot-sql.conf.ext.txt) is an example of a complete `dovecot-sql.conf.ext` file.
{{< /note >}}

    Save the changes to the `/etc/dovecot/dovecot-sql.conf.ext` file.

13. Change the owner and group of the `/etc/dovecot/` directory to `vmail` and `dovecot`:

        chown -R vmail:dovecot /etc/dovecot

14. Change the permissions on the `/etc/dovecot/` directory:

        chmod -R o-rwx /etc/dovecot

15. Open the sockets configuration file, located at `/etc/dovecot/conf.d/10-master.conf`

    {{< note >}}
[Here](/docs/assets/1240-dovecot_10-master.conf.txt) is an example of a complete `10-master.conf` file. There are many nested blocks of code in this file, so please pay close attention to the brackets. It's probably better if you edit line by line, rather than copying large chunks of code. If there's a syntax error, Dovecot will crash silently, but you can check `/var/log/upstart/dovecot.log` to help you find the error.
{{< /note >}}

16. Disable unencrypted IMAP and POP3 by setting the protocols' ports to 0, as shown below. Ensure that the entries for port and ssl below the IMAPS and pop3s entries are uncommented:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service imap-login {
  inet_listener imap {
    port = 0
  }
inet_listener imaps {
  port = 993
  ssl = yes
  }
        ...
          service pop3-login {
inet_listener pop3 {
  port = 0
}
  inet_listener pop3s {
    port = 995
    ssl = yes
  }
          ...
          }


{{< /file-excerpt >}}


    {{< note >}}
Leave the secure versions unedited, specifically the `imaps` and `pop3s`, so that their ports still work. The default settings for `imaps` and `pop3s` are fine. Optionally, leave the `port` lines commented out, as the default ports are the standard 993 and 995.
{{< /note >}}

    Find the `service lmtp` section and use the configuration shown below:

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


    Locate the `service auth` section and configure it as shown below:

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
  user = dovecot
}


{{< /file-excerpt >}}


    In the `service auth-worker` section, uncomment the `user` line and set it to `vmail` as shown below:

    {{< file-excerpt "/etc/dovecot/conf.d/10-master.conf" >}}
service auth-worker {
  # Auth worker process is run as root by default, so that it can access
  # /etc/shadow. If this isn't necessary, the user should be changed to
  # $default_internal_user.
  user = vmail
}


{{< /file-excerpt >}}


    Save the changes to the `/etc/dovecot/conf.d/10-master.conf` file.

17. Verify that the default Dovecot SSL certificate and key exist:

        ls /etc/dovecot/dovecot.pem
        ls /etc/dovecot/private/dovecot.pem

    {{< note >}}
As noted above, these files are not provided in Dovecot 2.2.13-7 and above, and will not be present on Debian 8 and other newer systems, as well as some older ones.

If using a different SSL certificate, upload the certificate to the server and make a note of its location and the key's location.
{{< /note >}}

18. Open `/etc/dovecot/conf.d/10-ssl.conf`.

    {{< note >}}
[Here](/docs/assets/1241-dovecot_10-ssl.conf.txt) is an example of a complete `10-ssl.conf` file.
{{< /note >}}

19. Verify that the `ssl_cert` setting has the correct path to the certificate, and that the `ssl_key` setting has the correct path to the key. The default setting displayed uses Dovecot's built-in certificate, so you can leave this as-is if using the Dovecot certificate. Update the paths accordingly if you are using a different certificate and key.

    {{< file-excerpt "/etc/dovecot/conf.d/10-ssl.conf" >}}
ssl_cert = </etc/dovecot/dovecot.pem
ssl_key = </etc/dovecot/private/dovecot.pem


{{< /file-excerpt >}}


    Force the clients to use SSL encryption by uncommenting the `ssl` line and setting it to `required`:

    {{< file-excerpt "/etc/dovecot/conf.d/10-ssl.conf" >}}
ssl = required

{{< /file-excerpt >}}


    Save the changes to the `/etc/dovecot/conf.d/10-ssl.conf` file.

20. Finally, restart Dovecot:

        service dovecot restart


## Test Email

1.  Set up a test account in an email client to ensure that everything is working. Many clients detect server settings automatically. However, manual configuration requires the following parameters:

    -   the full email address, including the `@example.com` part, is the username.
    -   the password should be the one you added to the MySQL table for this email address.
    -   The incoming and outgoing server names must be a domain that resolves to the Linode.
    -   Both the incoming and outgoing servers require authentication and SSL encryption.
    -   You should use Port 993 for secure IMAP, Port 995 for secure POP3, and Port 587 with SSL for SMTP.

2.  Try sending an email to this account from an outside email account and then reply to it. Check the mail log file in */var/log/mail.log* for the following output (the first block is for an incoming message, and the second block for an outgoing message):

    {{< file-excerpt "/var/log/mail.log" >}}
Mar 22 18:18:15 host postfix/smtpd[22574]: connect from mail1.linode.com[96.126.108.55]
Mar 22 18:18:15 host postfix/smtpd[22574]: 2BD192839B: client=mail1.linode.com[96.126.108.55]
Mar 22 18:18:15 host postfix/cleanup[22583]: 2BD192839B: message-id=<D4887A5E-DEAC-45CE-BDDF-3C89DEA84236@example.com>
Mar 22 18:18:15 host postfix/qmgr[15878]: 2BD192839B: from=<support@linode.com>, size=1156, nrcpt=1 (queue active)
Mar 22 18:18:15 host postfix/smtpd[22574]: disconnect from mail1.linode.com[96.126.108.55]
Mar 22 18:18:15 host dovecot: lmtp(22587): Connect from local
Mar 22 18:18:15 host dovecot: lmtp(22587, email1@example.com): 5GjrDafYTFE7WAAABf1gKA: msgid=<D4887A5E-DEAC-45CE-BDDF-3C89DEA84236@linode.com>: saved mail to INBOX
Mar 22 18:18:15 host dovecot: lmtp(22587): Disconnect from local: Client quit (in reset)
Mar 22 18:18:15 host postfix/lmtp[22586]: 2BD192839B: to=<email1@example.com>, relay=host.example.com[private/dovecot-lmtp], delay=0.09, delays=0.03/0.02/0.03/0.01, dsn=2.0.0, status=sent (250 2.0.0 <email1@example.com> 5GjrDafYTFE7WAAABf1gKA Saved)
Mar 22 18:18:15 host postfix/qmgr[15878]: 2BD192839B: removed


{{< /file-excerpt >}}


    {{< file-excerpt "/var/log/mail.log" >}}
Mar 22 18:20:29 host postfix/smtpd[22590]: connect from 173-161-199-49-Philadelphia.hfc.comcastbusiness.net[173.161.199.49]
Mar 22 18:20:29 host dovecot: auth-worker: mysql(127.0.0.1): Connected to database mailserver
Mar 22 18:20:29 host postfix/smtpd[22590]: AA10A2839B: client=173-161-199-49-Philadelphia.hfc.comcastbusiness.net[173.161.199.49], sasl_method=PLAIN, sasl_username=email1@example.com
Mar 22 18:20:29 host postfix/cleanup[22599]: AA10A2839B: message-id=<FB6213FA-6F13-49A8-A5DD-F324A4FCF9E9@example.com>
Mar 22 18:20:29 host postfix/qmgr[15878]: AA10A2839B: from=<email1@example.com>, size=920, nrcpt=1 (queue active)
Mar 22 18:20:29 host postfix/smtp[22601]: AA10A2839B: to=<support@linode.com>, relay=mail1.linode.com[96.126.108.55]:25, delay=0.14, delays=0.08/0.01/0.05/0.01, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as C4232266C9)
Mar 22 18:20:29 host postfix/qmgr[15878]: AA10A2839B: removed


{{< /file-excerpt >}}


You now have a functioning mail server that can securely send and receive email. If things are not working smoothly, try consulting the [Troubleshooting Problems with Postfix, Dovecot, and MySQL](/docs/email/postfix/troubleshooting) guide. At this point, consider adding spam and virus filtering and a webmail client. If DNS records have not been created for the mail server yet, do so now. Once the DNS records have propagated, email will be delivered via the new mail server.

{{< note >}}
If errors are encountered in the /var/log/syslog stating "Invalid settings: postmaster_address setting not given", you may need to append the following line to the /etc/dovecot/dovecot.conf file, replacing domain with the domain name.

postmaster_address=postmaster at DOMAIN
{{< /note >}}

## Adding New Domains, Email Addresses, and Aliases

Although the mail server is up and running, eventually you'll probably need to add new domains, email addresses, and aliases for the users. To do this, simply add a new line to the appropriate MySQL table. These instructions are for command-line MySQL, but you can also use [phpMyAdmin](http://www.phpmyadmin.net/) to add new entries to the tables.

### Domains

1.  To add a new domain, open a terminal window and [log in to the Linode via SSH](/docs/getting-started#logging-in-for-the-first-time).

2.  Log in to the MySQL server with an appropriately privileged user. For this example, use the `root` user:

        mysql -u root -p mailserver

3.  Enter the root MySQL password when prompted.
4.  Always view the contents of the table before adding new entries. Enter the following command to view the current contents of any table, replacing `virtual_domains` with the table:

        SELECT * FROM mailserver.virtual_domains;

5.  The output should resemble the following:

        +----+-----------------------+
        | id | name                  |
        +----+-----------------------+
        |  1 | example.com           |
        |  2 | hostname.example.com  |
        |  3 | hostname              |
        |  4 | localhost.example.com |
        +----+-----------------------+

6.  To add another domain, enter the following command, replacing `newdomain.com` with the domain name:

        INSERT INTO `mailserver`.`virtual_domains`
          (`name`)
        VALUES
          ('newdomain.com');

7.  Verify that the new domain has been added. The output should display the new domain name.

        SELECT * FROM mailserver.virtual_domains;

8.  Exit MySQL:

        quit

You have successfully added the new domain to the Postfix and Dovecot setup.

### Email Addresses

1.  To add a new email address, enter the following command in MySQL, replacing `newpassword` with the user's password, and `email3@newdomain.com` with the user's email address:

        INSERT INTO `mailserver`.`virtual_users`
          (`domain_id`, `password` , `email`)
        VALUES
          ('5', ENCRYPT('newpassword', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))) , 'email3@newdomain.com');

    {{< note >}}
Be sure to use the correct number for the `domain_id`. In this case, we are using `5`, because we want to make an email address for `newdomain.com`, and `newdomain.com` has an `id` of `5` in the `virtual_domains` table.
{{< /note >}}

2.  Verify that the new email address has been added.  The new email address should be displayed in the output.

        SELECT * FROM mailserver.virtual_users;

3.  Exit MySQL:

        quit

You have successfully added the new email address to the Postfix and Dovecot setup.

### Aliases

1.  To add a new alias, enter the following command in MySQL, replacing `alias@newdomain.com` with the address from which you want to forward email, and `myemail@gmail.com` with the address that you want to forward the mail to. The `alias@newdomain.com` needs to be an email address that already exists on the server.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`domain_id`, `source`, `destination`)
        VALUES
          ('5', 'alias@newdomain.com', 'myemail@gmail.com');

    {{< note >}}
Ensure that the correct number is entered for the `domain_id` value. Use the `id` of the domain for this email address. For an explanation of `id` us, see the email users section above.
{{< /note >}}

    You can also add a "catch-all" alias which will forward all emails sent to a domain which do not have matching aliases or users by specifying `@newdomain.com` as the source of the alias.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`domain_id`, `source`, `destination`)
        VALUES
          ('5', '@newdomain.com', 'myemail@gmail.com');

2.  Verify that the new alias has been added. The new alias will be displayed in the output.

        SELECT * FROM mailserver.virtual_aliases;

3.  Exit MySQL:

        quit

You have now successfully added the new alias to the Postfix and Dovecot setup.

