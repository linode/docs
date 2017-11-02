---
deprecated: true
author:
  name: Brett Kaplan
  email: docs@linode.com
description: 'Installing Postfix with Dovecot and MySQL on Ubuntu 9.10 (Karmic).'
keywords: ["postfix ubuntu 9.10", "postfix karmic", "postfix dovecot", "ubuntu mail server", "linux mail server"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/postfix/dovecot-mysql-ubuntu-9-10-karmic/']
modified: 2011-05-17
modified_by:
  name: Linode
published: 2010-02-26
title: 'Email with Postfix, Dovecot and MySQL on Ubuntu 9.10 (Karmic)'
---



The Postfix Mail Transfer Agent (MTA) is a high performance open source e-mail server system. This guide will help you get Postfix running on your Linode, using Dovecot for IMAP/POP3 service and MySQL to store information on virtual domains and users. This guide is largely based on Christoph Haas's great [ISP-style Email Server with Debian-Lenny and Postfix 2.5 guide](http://workaround.org/ispmail/lenny) and HowtoForge [Groupware Server With Group-Office, Postfix, Dovecot And SpamAssassin On Debian Lenny (5.0)](http://www.howtoforge.com/groupware-server-with-group-office-postfix-dovecot-spamassassin-on-debian-lenny), with some packages omitted.

It is assumed that you have followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH.

**NOTE: Please read all of the information presented in this guide carefully.** There are many files and commands that will need to be edited as part of the setup process: please do not simply copy and paste the example blocks.

Basic System Configuration
--------------------------

Edit your `/etc/hosts` file to resemble the following example, replacing "12.34.56.78" with your Linode's IP address, "hostname.example.com" with your fully qualified domain name, and "hostname" with your short hostname.

{{< file "/etc/hosts" >}}
## main & restricted repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic main restricted
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic main restricted

deb http://security.ubuntu.com/ubuntu karmic-security main restricted
deb-src http://security.ubuntu.com/ubuntu karmic-security main restricted

## universe repositories
deb http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic universe
deb http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe
deb-src http://us.archive.ubuntu.com/ubuntu/ karmic-updates universe

deb http://security.ubuntu.com/ubuntu karmic-security universe
deb-src http://security.ubuntu.com/ubuntu karmic-security universe

{{< /file >}}


Make sure your package repositories and installed programs are up to date by issuing the following commands:

    apt-get update
    apt-get upgrade --show-upgraded

Install Required Packages
-------------------------

Issue the following command to get the required packages installed on your Linode:

    apt-get install postfix postfix-mysql postfix-doc mysql-client mysql-server dovecot-common dovecot-imapd dovecot-pop3d postfix libsasl2-2 libsasl2-modules libsasl2-modules-sql sasl2-bin libpam-mysql openssl telnet mailutils

This will install the Postfix mail server, the MySQL database server, the Dovecot IMAP and POP daemons, and several supporting packages that provide services related to authentication. You will be prompted to choose a root password for MySQL; make sure you select a strong password comprised of letters, numbers, and non-alphanumeric characters. Write this password down and keep it in a safe place for later reference.

[![Setting the root password for MySQL on a Linode.](/docs/assets/428-postfix-courier-mysql-01-mysql-root-password.png)](/docs/assets/428-postfix-courier-mysql-01-mysql-root-password.png)

Next, you'll be prompted to select the type of mail server configuration you want for your Linode. Select "Internet Site" and continue.

[![Selecting the Postfix mail server configuration type on an Ubuntu 9.10 (Karmic) Linode.](/docs/assets/429-postfix-courier-mysql-02-mail-server-type-2.png)](/docs/assets/429-postfix-courier-mysql-02-mail-server-type-2.png)

Now you'll need to set the system mail name. This should be a fully qualified domain name (FQDN) that points to your Linode's IP address. This example uses an example organization's domain. You should set the reverse DNS for your Linode's IP address to the fully qualified domain name you assign as the system mail name, while other domains you wish to host email for will be handled later through virtual domain setup steps.

[![Selecting the Postfix system mail name on an Ubuntu 9.10 (Karmic) Linode.](/docs/assets/430-postfix-courier-mysql-02-mail-server-type-3.png)](/docs/assets/430-postfix-courier-mysql-02-mail-server-type-3.png)

This completes the initial package configuration steps. Next, you'll set up a MySQL database to handle virtual domains and users.

Set up MySQL for Virtual Domains and Users
------------------------------------------

Start the MySQL shell by issuing the following command. You'll be prompted to enter the root password for MySQL that you assigned during the initial setup.

    mysql -u root -p

You'll be presented with an interface similar to the following:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 55
    Server version: 5.1.37-1ubuntu5.4 (Ubuntu)

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql>

Issue the following command to create a database for your mail server and switch to it in the shell:

    CREATE DATABASE mail;
    USE mail;

Create a mail administration user called `mail_admin` and grant it permissions on the `mail` database with the following commands. Please be sure to replace "mail\_admin\_password" with a password you select for this user.

    GRANT SELECT, INSERT, UPDATE, DELETE ON mail.* TO 'mail_admin'@'localhost' IDENTIFIED BY 'mail_admin_password';
    GRANT SELECT, INSERT, UPDATE, DELETE ON mail.* TO 'mail_admin'@'localhost.localdomain' IDENTIFIED BY 'mail_admin_password';
    FLUSH PRIVILEGES;

Create the virtual domains table with the following command:

    CREATE TABLE domains (domain varchar(50) NOT NULL, PRIMARY KEY (domain) );

Create a table to handle mail forwarding with the following command:

    CREATE TABLE forwardings (source varchar(80) NOT NULL, destination TEXT NOT NULL, PRIMARY KEY (source) );

Create the users table with the following command:

    CREATE TABLE users (email varchar(80) NOT NULL, password varchar(20) NOT NULL, PRIMARY KEY (email) );

Create a transports table with the following command:

    CREATE TABLE transport ( domain varchar(128) NOT NULL default '', transport varchar(128) NOT NULL default '', UNIQUE KEY domain (domain) );

Exit the MySQL shell by issuing the following command:

    quit

Check that MySQL is set up to bind to localhost (127.0.0.1) by looking at the file `/etc/mysql/my.cnf`. You should have the following line in the configuration file:

{{< file-excerpt >}}
/etc/mysql/my.cnf
{{< /file-excerpt >}}

> bind-address = 127.0.0.1

This is required for Postfix to be able to communicate with the database server. If you have MySQL set up to run on another IP address (such as an internal IP), you will need to substitute this IP address in place of `127.0.0.1` during the Postfix configuration steps. Please note that it is *not* advisable to run MySQL on a publicly-accessible IP address.

If you changed MySQL's configuration, restart the database server with the following command:

    /etc/init.d/mysql restart

Next, you'll perform additional Postfix configuration to set up communication with the database.

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

Create a virtual mailbox configuration file for Postfix called `/etc/postfix/mysql-virtual_mailboxes.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

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

Issue the following commands to complete the remaining steps required for Postfix configuration. Please be sure to replace "server.example.com" with the fully qualified domain name you used for your system mail name.

    postconf -e 'myhostname = server.example.com'
    postconf -e 'mydestination = server.example.com, localhost, localhost.localdomain'
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
    postconf -e virtual_transport=dovecot
    postconf -e dovecot_destination_recipient_limit=1

This completes the configuration for Postfix. Next, you'll make an SSL certificate for the Postfix server that contains values appropriate for your organization.

Create an SSL Certificate for Postfix
-------------------------------------

Issue the following commands to create the SSL certificate (the `openssl` command spans two lines, but should be entered as a single command):

    cd /etc/postfix
    openssl req -new -outform PEM -out smtpd.cert -newkey rsa:2048 -nodes -keyout smtpd.key -keyform PEM -days 365 -x509

You will be asked to enter several values similar to the output shown below. Be sure to enter the fully qualified domain name you used for the system mailname in place of "server.example.com".

    Country Name (2 letter code) [AU]:US
    State or Province Name (full name) [Some-State]:New Jersey
    Locality Name (eg, city) []:Absecon
    Organization Name (eg, company) [Internet Widgits Pty Ltd]:MyCompany, LLC
    Organizational Unit Name (eg, section) []:Email Services
    Common Name (eg, YOUR name) []:server.example.com
    Email Address []:support@example.com

Set proper permissions for the key file by issuing the following command:

    chmod o= /etc/postfix/smtpd.key

This completes SSL certificate creation for Postfix. Next, you'll configure `saslauthd` to use MySQL for user authentication.

Configure saslauthd to use MySQL
--------------------------------

Issue the following command to create a directory for `saslauthd`:

    mkdir -p /var/spool/postfix/var/run/saslauthd

Make a backup copy of the `/etc/default/saslauthd` file by issuing the following command.

    cp -a /etc/default/saslauthd /etc/default/saslauthd.bak

Edit the file `/etc/default/saslauthd` to match the configuration shown below.

{{< file >}}
/etc/default/saslauthd
{{< /file >}}

> START=yes DESC="SASL Authentication Daemon" NAME="saslauthd" MECHANISMS="pam" MECH\_OPTIONS="" THREADS=5 OPTIONS="-c -m /var/spool/postfix/var/run/saslauthd -r"

Next, create the file `/etc/pam.d/smtp` and copy in the following two lines. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file >}}
/etc/pam.d/smtp
{{< /file >}}

> auth required pam\_mysql.so user=mail\_admin passwd=mail\_admin\_password host=127.0.0.1 db=mail table=users usercolumn=email passwdcolumn=password crypt=1 account sufficient pam\_mysql.so user=mail\_admin passwd=mail\_admin\_password host=127.0.0.1 db=mail table=users usercolumn=email passwdcolumn=password crypt=1

Create a file named `/etc/postfix/sasl/smtpd.conf` with the following contents. Be sure to change "mail\_admin\_password" to the password you chose for your mail administration MySQL user earlier.

{{< file >}}
/etc/postfix/sasl/smtpd.conf
{{< /file >}}

> pwcheck\_method: saslauthd mech\_list: plain login allow\_plaintext: true auxprop\_plugin: mysql sql\_hostnames: 127.0.0.1 sql\_user: mail\_admin sql\_passwd: mail\_admin\_password sql\_database: mail sql\_select: select password from users where email = '%u'

Set proper permissions and ownership for these configuration files by issuing the following commands:

    chmod o= /etc/pam.d/smtp
    chmod o= /etc/postfix/sasl/smtpd.conf

Add the Postfix user to the `sasl` group and restart Postfix and `saslauthd` by issuing the following commands:

    adduser postfix sasl
    /etc/init.d/postfix restart
    /etc/init.d/saslauthd restart

This completes configuration for `saslauthd`. Next, you'll configure Dovecot to use MySQL for IMAP/POP3 user authentication.

Configure Dovecot
-----------------

Edit the file `/etc/postfix/master.cf` and add the dovecot service to the bottom of the file.

{{< file-excerpt >}}
/etc/postfix/master.cf
{{< /file-excerpt >}}

> dovecot unix - n n - - pipe
> :   flags=DRhu user=vmail:vmail argv=/usr/lib/dovecot/deliver -d \${recipient}
>
Issue the following command to make a backup copy of your `/etc/dovecot/dovecot.conf` file.

    cp -a /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf.bak

Replace the contents of the file with the following example, substituting your system's domain name for example.com.

{{< file >}}
/etc/dovecot/dovecot.conf
{{< /file >}}

> protocols = imap imaps pop3 pop3s log\_timestamp = "%Y-%m-%d %H:%M:%S " mail\_location = maildir:/home/vmail/%d/%n/Maildir
>
> ssl\_cert\_file = /etc/ssl/certs/ssl-cert-snakeoil.pem ssl\_key\_file = /etc/ssl/private/ssl-cert-snakeoil.key
>
> namespace private {
> :   separator = . prefix = INBOX. inbox = yes
>
> }
>
> protocol lda {
> :   log\_path = /home/vmail/dovecot-deliver.log auth\_socket\_path = /var/run/dovecot/auth-master postmaster\_address = <postmaster@example.com> mail\_plugins = cmusieve global\_script\_path = /home/vmail/globalsieverc
>
> }
>
> protocol pop3 {
> :   pop3\_uidl\_format = %08Xu%08Xv
>
> }
>
> auth default {
> :   user = root
>
>     passdb sql {
>     :   args = /etc/dovecot/dovecot-sql.conf
>
>     }
>
>     userdb static {
>     :   args = uid=5000 gid=5000 home=/home/vmail/%d/%n allow\_all\_users=yes
>
>     }
>
>     socket listen {
>     :   master {
>         :   path = /var/run/dovecot/auth-master mode = 0600 user = vmail
>
>         }
>
>         client {
>         :   path = /var/spool/postfix/private/auth mode = 0660 user = postfix group = postfix
>
>         }
>
>     }
>
> }

MySQL will be used to store password information, so `/etc/dovecot/dovecot-sql.conf` must be edited. Issue the following command to make a backup copy of the existing file.

    cp -a /etc/dovecot/dovecot-sql.conf /etc/dovecot/dovecot-sql.conf.bak

Replace the contents of the file with the following example, making sure to replace "main\_admin\_password" with your mail password.

{{< file >}}
/etc/dovecot/dovecot-sql.conf
{{< /file >}}

> driver = mysql connect = host=127.0.0.1 dbname=mail user=mail\_admin password=mail\_admin\_password default\_pass\_scheme = CRYPT password\_query = SELECT email as user, password FROM users WHERE email='%u';

Dovecot has now been configured. You must restart it to make sure it is working properly:

    /etc/init.d/dovecot restart

Now check your /var/log/mail.log to make sure dovecot started without errors. Your log should have lines similar to the following:

{{< file-excerpt >}}
/var/log/mail.log
{{< /file-excerpt >}}

> Sep 27 17:41:10 hostname dovecot: Dovecot v1.0.15 starting up Sep 27 17:41:10 hostname dovecot: auth-worker(default): mysql: Connected to 127.0.0.1 (mail)

Before testing dovecot, you must change the permissions on `/etc/dovecot/dovecot.conf` to allow the `vmail` user to access them:

    chgrp vmail /etc/dovecot/dovecot.conf
    chmod g+r /etc/dovecot/dovecot.conf

You can test your POP3 server to make sure it's running properly by issuing the following command.

    telnet localhost pop3

You should see output similar to the following in your terminal:

    Trying 127.0.0.1...
    Connected to localhost.
    Escape character is '^]'.
    +OK Dovecot ready.

Enter the command "quit" to return to your shell. This completes the Dovecot configuration. Next, you'll make sure aliases are configured properly.

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

    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    220 hostname.example.com ESMTP Postfix (Ubuntu)
    ehlo localhost
    250-hostname.example.com
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

Please note that you'll need to modify the DNS records for any domains that you wish to handle email by adding an MX record that points to your mail server's fully qualified domain name. If MX records already exist for a domain you would like to handle the email for, you'll need to either delete them or set them to a larger priority number than your mail server. Smaller priority numbers indicate higher priority for mail delivery, with "0" being the highest priority.

We'll use the MySQL shell to add support for the domain "example.com", which will have an email account called "sales". You should substitute one of your domains for "example.com" in these statements, along with a strong password for the "password" entry in the second SQL statement.

    mysql -u root -p

    USE mail;
    INSERT INTO domains (domain) VALUES ('example.com');
    INSERT INTO users (email, password) VALUES ('sales@example.com', ENCRYPT('password'));
    quit

You'll need to send a welcome message to new email accounts before they can be accessed via IMAP or POP3. This is because the mailboxes for new users won't be created until an email is received for them. To send a welcome message from the command line, you may use the `mailx` utility. Issue the following command to send the message.

    mailx sales@example.com

Press `Ctrl+D` to complete the message. You can safely leave the field for "CC:" blank. This completes the configuration for a new domain and email user.

Given the possibility for virtual hosting a large number of virtual domains on a single mail system, the username portion of an email address (i.e. before the `@` sign) is not sufficient to authenticate to the mail server. When email users authenticate to the server, they must supply their email clients with the *entire* email address created above as their username.

Check Your Logs
---------------

After you have sent the test mail, you'll want to check your error logs to make sure the mail was delivered. First check your `mail.log` located in `/var/log/mail.log`. You should see something similar to the following:

{{< file-excerpt >}}
/var/log/mail.log
{{< /file-excerpt >}}

> Sep 27 17:46:22 hostname postfix/cleanup[6108]: 544A88450: message-id=\<<20100927174622.544A88450@hostname.example.com>\> Sep 27 17:46:22 hostname postfix/qmgr[6032]: 544A88450: from=\<<root@hostname.example.com>\>, size=368, nrcpt=1 (queue active) Sep 27 17:46:22 hostname postfix/pipe[6114]: 544A88450: to=\<<pparadis@example.com>\>, relay=dovecot, delay=0.04, delays=0.03/0.01/0/0.01, dsn=2.0.0, status=sent (delivered via dovecot service) Sep 27 17:46:22 hostname postfix/qmgr[6032]: 544A88450: removed

Next you should check the Dovecot delivery log located in `/home/vmail/dovecot-deliver.log`. The contents should look similar to the following:

{{< file-excerpt >}}
/home/vmail/dovecot-deliver.log
{{< /file-excerpt >}}

> deliver(<pparadis@example.com>): 2010-09-27 17:46:22 Info: msgid=\<<20100927174622.544A88450@hostname.example.com>\>: saved mail to INBOX

Now you can test to see what the users of your email server would see with their email clients.

Test the Mailbox
----------------

To test the `sales@example.com` mail box, navigate to the mailbox directory `/home/vmail/example.com/sales/Maildir` and type the following command:

    find

You should see output similar to the following:

    .
    ./dovecot-uidlist
    ./cur
    ./new
    ./new/1285609582.P6115Q0M368794.li172-137
    ./dovecot.index
    ./dovecot.index.log
    ./tmp

Now you can test using a mail client. When configuring your local email client, use the full email address for the mailbox you wish to connect to as the username. For this test, we recommend `mutt`. It is not installed by default so you may need to install it (`apt-get install mutt`). Type the following command to view user's mail:

    mutt -f .

You may be prompted to create the root mailbox. This is not required. If you see an e-mail in the inbox, you've successfully configured Postfix, Dovecot, and MySQL to provide email services for virtual domains and users on your Linode. Please consult the "More Information" section for additional resources that may prove useful in the administration of your new email server.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Postfix MySQL Howto](http://www.postfix.org/MYSQL_README.html)
- [Postfix SASL Howto](http://www.postfix.org/SASL_README.html)
- [Dovecot Documentation Wiki](http://wiki.dovecot.org/)
- [MySQL Documentation](http://dev.mysql.com/doc/)



