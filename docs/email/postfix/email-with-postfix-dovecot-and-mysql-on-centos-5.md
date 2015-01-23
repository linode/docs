---
author:
  name: Peter Sandin
  email: psandin@linode.com
description: 'Installing Postfix with Dovecot and MySQL on CentOS.'
keywords: 'postfix centos 5,dovecot centos 5,linux mail server,email,centos5'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['email/postfix/dovecot-mysql-centos-5/']
modified: Friday, June 24th, 2011
modified_by:
  name: Linode
published: 'Friday, June 24th, 2011'
title: 'Email with Postfix, Dovecot and MySQL on CentOS 5'
---

The Postfix Mail Transfer Agent (MTA) is a high performance open source e-mail server system. This guide will help you get Postfix running on your CentOS 5 Linode, using Dovecot for IMAP/POP3 service and MySQL to store information on virtual domains and users. This guide is largely based on Christoph Haas's great [ISP-style Email Server with Debian-Lenny and Postfix 2.5 guide](http://workaround.org/ispmail/lenny) and HowtoForge [Groupware Server With Group-Office, Postfix, Dovecot And SpamAssassin On Debian Lenny (5.0)](http://www.howtoforge.com/groupware-server-with-group-office-postfix-dovecot-spamassassin-on-debian-lenny), with some packages omitted.

It is assumed that you have followed the steps outlined in our [getting started guide](/docs/getting-started/). All configuration will be performed in a terminal session; make sure you're logged into your Linode as root via SSH.

**NOTE: Please read all of the information presented in this guide carefully.** There are many files and commands that will need to be edited as part of the setup process: please do not simply copy and paste the example blocks.

Set the Hostname
----------------

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#sph_set-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

Install Required Packages
-------------------------

Issue the following commands to install any outstanding package updates:

    yum update

The version of Postfix included in the main CentOS repository does not include support for MySQL. Therefore, you will need install Postfix from the CentOS Plus repository. Before doing so, you will need to add exclusions to the `base` and `updates` repositories for the Postfix package to prevent it from being overwritten with updates that do not have MySQL support. Edit `/etc/yum.repos.d/CentOS-Base.repo` to include the `exclude` directives as shown below:

{: .file-excerpt }
/etc/yum.repos.d/CentOS-Base.repo

> [base] name=CentOS-\$releasever - Base ... exclude=postfix\*
>
> \#released updates [updates] name=CentOS-\$releasever - Updates ... exclude=postfix\*

Issue the following command to install the required packages on your VPS:

    yum --enablerepo=centosplus install postfix
    yum install dovecot mysql-server

This will install the Postfix mail server, the MySQL database server, the Dovecot IMAP and POP daemons, and several supporting packages that provide services related to authentication. Next, you'll set up a MySQL database to handle virtual domains and users.

Set up MySQL for Virtual Domains and Users
------------------------------------------

First, you will need to configure MySQL to start on boot and start it for the first time. You can do this by running the following commands:

    chkconfig mysqld on
    service mysqld start

After installing MySQL, it's recommended that you run mysql\_secure\_installation, a program that helps secure MySQL. While running `mysql_secure_installation`, you will be presented with the opportunity to change the MySQL root password, remove anonymous user accounts, disable root logins outside of localhost, and remove test databases. It is recommended that you answer yes to these options. If you are prompted to reload the privilege tables, select yes. Run the following command to execute the program:

    mysql_secure_installation

Next, start the MySQL shell by issuing the following command. You'll be prompted to enter the root password for MySQL that you assigned during the initial setup.

    mysql -u root -p 

You'll be presented with an interface similar to the following:

    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 33
    Server version: 5.0.77 Source distribution

    Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

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

Check that MySQL is set up to bind to localhost (127.0.0.1) by looking at the file `/etc/my.cnf`. You will want to add the following line to the `mysqld` section of the configuration file:

{: .file-excerpt }
/etc/my.cnf

> [mysqld] ... bind-address = 127.0.0.1

This is required for Postfix to be able to communicate with the database server. If you have MySQL set up to run on another IP address (such as an internal IP), you will need to substitute this IP address in place of `127.0.0.1` during the Postfix configuration steps. Please note that it is *not* advisable to run MySQL on a publicly-accessible IP address.

If you changed MySQL's configuration, restart the database server with the following command:

    service mysqld restart 

Next, you'll perform additional Postfix configuration to set up communication with the database.

Configure Postfix to work with MySQL
------------------------------------

Create a virtual domain configuration file for Postfix called `/etc/postfix/mysql-virtual_domains.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{: .file }
/etc/postfix/mysql-virtual\_domains.cf

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT domain AS virtual FROM domains WHERE domain='%s' hosts = 127.0.0.1

Create a virtual forwarding file for Postfix called `/etc/postfix/mysql-virtual_forwardings.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{: .file }
/etc/postfix/mysql-virtual\_forwardings.cf

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT destination FROM forwardings WHERE source='%s' hosts = 127.0.0.1

Create a virtual mailbox configuration file for Postfix called `/etc/postfix/mysql-virtual_mailboxes.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{: .file }
/etc/postfix/mysql-virtual\_mailboxes.cf

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT CONCAT(SUBSTRING\_INDEX(email,<'@'>,-1),'/',SUBSTRING\_INDEX(email,<'@'>,1),'/') FROM users WHERE email='%s' hosts = 127.0.0.1

Create a virtual email mapping file for Postfix called `/etc/postfix/mysql-virtual_email2email.cf` with the following contents. Be sure to replace "mail\_admin\_password" with the password you chose earlier for the MySQL mail administrator user.

{: .file }
/etc/postfix/mysql-virtual\_email2email.cf

> user = mail\_admin password = mail\_admin\_password dbname = mail query = SELECT email FROM users WHERE email='%s' hosts = 127.0.0.1

Set proper permissions and ownership for these configuration files by issuing the following commands:

    chmod o= /etc/postfix/mysql-virtual_*.cf 
    chgrp postfix /etc/postfix/mysql-virtual_*.cf 

Next, create a user and group for mail handling. All virtual mailboxes will be stored under this user's home directory.

    groupadd -g 5000 vmail 
    useradd -g vmail -u 5000 vmail -d /home/vmail -m 

Issue the following commands to complete the remaining steps required for Postfix configuration. Please be sure to replace "server.example.com" with the fully qualified domain name you used for your system mail name.

    postconf -e 'myhostname = server.example.com'
    postconf -e 'mydestination = $myhostname, localhost, localhost.localdomain'
    postconf -e 'mynetworks = 127.0.0.0/8'
    postconf -e 'inet_interfaces = all'
    postconf -e 'message_size_limit = 30720000'
    postconf -e 'virtual_alias_domains ='
    postconf -e 'virtual_alias_maps = proxy:mysql:/etc/postfix/mysql-virtual_forwardings.cf, mysql:/etc/postfix/mysql-virtual_email2email.cf'
    postconf -e 'virtual_mailbox_domains = proxy:mysql:/etc/postfix/mysql-virtual_domains.cf'
    postconf -e 'virtual_mailbox_maps = proxy:mysql:/etc/postfix/mysql-virtual_mailboxes.cf'
    postconf -e 'virtual_mailbox_base = /home/vmail'
    postconf -e 'virtual_uid_maps = static:5000'
    postconf -e 'virtual_gid_maps = static:5000'
    postconf -e 'smtpd_sasl_type = dovecot'
    postconf -e 'smtpd_sasl_path = private/auth'
    postconf -e 'smtpd_sasl_auth_enable = yes'
    postconf -e 'broken_sasl_auth_clients = yes'
    postconf -e 'smtpd_sasl_authenticated_header = yes'
    postconf -e 'smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination'
    postconf -e 'smtpd_use_tls = yes'
    postconf -e 'smtpd_tls_cert_file = /etc/pki/dovecot/certs/dovecot.pem'
    postconf -e 'smtpd_tls_key_file = /etc/pki/dovecot/private/dovecot.pem'
    postconf -e 'virtual_create_maildirsize = yes'
    postconf -e 'virtual_maildir_extended = yes'
    postconf -e 'proxy_read_maps = $local_recipient_maps $mydestination $virtual_alias_maps $virtual_alias_domains $virtual_mailbox_maps $virtual_mailbox_domains $relay_recipient_maps $relay_domains $canonical_maps $sender_canonical_maps $recipient_canonical_maps $relocated_maps $transport_maps $mynetworks $virtual_mailbox_limit_maps'
    postconf -e 'virtual_transport = dovecot'
    postconf -e 'dovecot_destination_recipient_limit = 1'

Edit the file `/etc/postfix/master.cf` and add the dovecot service to the bottom of the file.

{: .file-excerpt }
/etc/postfix/master.cf

> dovecot unix - n n - - pipe
> :   flags=DRhu user=vmail:vmail argv=/usr/libexec/dovecot/deliver -f \${sender} -d \${recipient}
>
Now that Postfix is configured, you will want to configure it to start on boot and then start the service for the first time. You can do so by running the following commands.

    service sendmail stop
    chkconfig sendmail off
    chkconfig postfix on
    service postfix start

This completes the configuration for Postfix.

Configure Dovecot
-----------------

Issue the following command to make a backup copy of your `/etc/dovecot.conf` file.

    cp -a /etc/dovecot.conf /etc/dovecot.conf-backup

Replace the contents of the file with the following example, substituting your system's domain name for example.com.

{: .file }
/etc/dovecot.conf

> protocols = imap imaps pop3 pop3s log\_timestamp = "%Y-%m-%d %H:%M:%S " mail\_location = maildir:/home/vmail/%d/%n/Maildir
>
> ssl\_cert\_file = /etc/pki/dovecot/certs/dovecot.pem ssl\_key\_file = /etc/pki/dovecot/private/dovecot.pem
>
> namespace private {
> :   separator = . prefix = INBOX. inbox = yes
>
> }
>
> protocol lda {
> :   log\_path = /home/vmail/dovecot-deliver.log auth\_socket\_path = /var/run/dovecot/auth-master postmaster\_address = <postmaster@example.com>
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
>     :   args = /etc/dovecot-sql.conf
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

MySQL will be used to store password information, so `/etc/dovecot-sql.conf` must be created. Insert the following contents into the file, making sure to replace "main\_admin\_password" with your mail password.

{: .file }
/etc/dovecot-sql.conf

> driver = mysql connect = host=127.0.0.1 dbname=mail user=mail\_admin password=mail\_admin\_password default\_pass\_scheme = CRYPT password\_query = SELECT email as user, password FROM users WHERE email='%u';

Since the mail database username and password are stored in `/etc/dovecot-sql.conf` you will want to restrict access to the file by changing the permissions to allow users in the `dovecot` group to access it, while denying access to other users. You can restrict access to `/etc/dovecot-sql.conf` by running the following commands:

    chgrp dovecot /etc/dovecot-sql.conf
    chmod o= /etc/dovecot-sql.conf

Now that Dovecot has been configured. Will want to configure it to start on boot, and start it for the first time by running:

    chkconfig dovecot on
    service dovecot start

Now check your /var/log/maillog to make sure dovecot started without errors. Your log should have lines similar to the following:

{: .file-excerpt }
/var/log/maillog

> Jan 21 20:00:18 li181-194 dovecot: Dovecot v1.0.15 starting up Jan 21 20:00:18 li181-194 dovecot: auth-worker(default): mysql: Connected to 127.0.0.1 (mail)

You can test your POP3 server to make sure it's running properly by issuing the following command.

    telnet localhost pop3 

You should see output similar to the following in your terminal:

    Trying 127.0.0.1...
    Connected to localhost.localdomain.
    Escape character is '^]'.
    +OK Dovecot ready.

Enter the command "quit" to return to your shell. This completes the Dovecot configuration. Next, you'll make sure aliases are configured properly.

Configure Mail Aliases
----------------------

Edit the file `/etc/aliases`, making sure the "postmaster" and "root" directives are set properly for your organization.

{: .file }
/etc/aliases

> postmaster: root root: <postmaster@example.com>

After modifying this file, you must run the following commands to update aliases and restart Postfix:

    newaliases
    service postfix restart

This completes alias configuration. Next, we'll test Postfix to make sure it's operating properly.

Testing Postfix
---------------

To test Postfix for SMTP-AUTH and TLS, issue the following command:

    telnet localhost 25 

While connected to Postfix, issue the following command:

    ehlo localhost 

You should see output similar to the following:

    Trying 127.0.0.1...
    Connected to localhost.
    Escape character is '^]'.
    220 plato.example.com ESMTP Postfix
    ehlo localhost
    250-plato.example.com
    250-PIPELINING
    250-SIZE 30720000
    250-VRFY
    250-ETRN
    250-STARTTLS
    250-AUTH PLAIN
    250-AUTH=PLAIN
    250-ENHANCEDSTATUSCODES
    250-8BITMIME
    250 DSN

Issue the command `quit` to terminate the Postfix connection. Next, we'll populate the MySQL database with domains and email users.

Setting up Domains and Users
----------------------------

Please note that you'll need to modify the DNS records for any domains that you wish to handle email by adding an MX record that points to your mail server's fully qualified domain name. If MX records already exist for a domain you would like to handle the email for, you'll need to either delete them or set them to a larger priority number than your mail server. Smaller priority numbers indicate higher priority for mail delivery, with "0" being the highest priority.

In the following example, the MySQL shell is used to add support for the domain "example.com", which will have an email account called "sales". You should substitute one of your domains for "example.com" in these statements, along with a strong password for the "password" entry in the second SQL statement.

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

After you have sent the test mail, you'll want to check your error logs to make sure the mail was delivered. First check your `maillog` located in `/var/log/maillog`. You should see something similar to the following:

{: .file-excerpt }
/var/log/maillog

> Jan 21 20:03:19 li181-194 postfix/cleanup[5877]: E1D148908: message-id=\<<20110121200319.E1D148908@plato.example.com>\> Jan 21 20:03:19 li181-194 postfix/qmgr[5867]: E1D148908: from=\<<root@plato.example.com>\>, size=377, nrcpt=1 (queue active) Jan 21 20:03:19 li181-194 postfix/pipe[5883]: E1D148908: to=\<<sales@example.com>\>, relay=dovecot, delay=0.05, delays=0.04/0.01/0/0.01, dsn=2.0.0, status=sent (delivered via dovecot service) Jan 21 20:03:19 li181-194 postfix/qmgr[5867]: E1D148908: removed

Next you should check the Dovecot delivery log located in `/home/vmail/dovecot-deliver.log`. The contents should look similar to the following:

{: .file-excerpt }
/home/vmail/dovecot-deliver.log

> deliver(<sales@example.com>): 2011-01-21 20:03:19 Info: msgid=\<<20110121200319.E1D148908@plato.example.com>\>: saved mail to INBOX

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

Now you can test using a mail client. When configuring your local email client, use the full email address for the mailbox you wish to connect to as the username. For this test, we recommend `mutt`. It is not installed by default so you may need to install it (`yum install mutt`). Type the following command to view user's mail:

    mutt -f .

You may be prompted to create the root mailbox. This is not required. If you see an e-mail in the inbox, you've successfully configured Postfix, Dovecot, and MySQL to provide email services for virtual domains and users on your Linode. Please consult the "More Information" section for additional resources that may prove useful in the administration of your new email server.

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [ISP-style Email Server with Debian-Lenny and Postfix 2.5 guide](http://workaround.org/ispmail/lenny)
- [Postfix MySQL Howto](http://www.postfix.org/MYSQL_README.html)
- [Postfix SASL Howto](http://www.postfix.org/SASL_README.html)
- [Dovecot Documentation Wiki](http://wiki.dovecot.org/)
- [MySQL Documentation](http://dev.mysql.com/doc/)



