---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up a mail server with Postfix, Dovecot, and MySQL.'
keywords: 'email, mail, server, postfix, dovecot, mysql, debian, ubuntu, dovecot 2'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, April 29th, 2015
modified_by:
  name: James Stewart
published: 'Monday, May 13th, 2013'
title: 'Email with Postfix, Dovecot, and MySQL'
---

Learn how to set up a secure mail server with Postfix, Dovecot, and MySQL on Debian or Ubuntu. Specifically, create new user mailboxes and send or receive email for configured domains.

For a different Linux distribution or different mail server, <a href="/docs/" target="_blank">search our tutorials</a>. 

### Prerequisites

1.  Set up the Linode as specified in the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides.

2.  Ensure that the iptables [firewall](/docs/securing-your-server#creating-a-firewall) is not blocking any of the standard mail ports (25, 465, 587, 110, 995, 143, and 993). If using a different form of firewall, confirm that it is not blocking any of the needed ports either.

### Configuring DNS

When ready to update the DNS and to start sending mail to the server, edit the domain's MX record so that it points to the Linode's domain or IP address, similar to the example below:

    example.com         MX      10      example.com
    example.com         MX      10      12.34.56.78
    mail.example.com    MX      10      12.34.56.78

Ensure that the MX record is changed for all domains and subdomains that might receive email. If setting up a brand new domain, these steps can be performed prior to configuring the mail server. When using Linode's [DNS Manager](/docs/dns-manager), create an MX record that points to the desired domain or subdomain, and then create an A record for that domain or subdomain, which points to the correct IP address.

### Installing an SSL Certificate

Dovecot offers a default self-signed certificate for free. This certificate encrypts the mail connections similar to a purchased certificate. However, the email users receive warnings about the certificate when they attempt to set up their email accounts. Optionally, purchase and configure a commercial SSL certificate to avoid the warnings. For information about SSL certificates, see <a href="/docs/security/ssl/" target="_blank">Linode's SSL Certificate guides</a>.

{: .note}
>
> As of version 2.2.13-7, Dovecot no longer provides a default SSL certificate. This affects Debian 8 users, and means that if you wish to use SSL encryption (reccomended), you must generate your own self-signed certificate or use a trusted certificate from a Certificate Authority.
>
> Many email service providers such as Gmail will only accept commercial SSL certificates for secure IMAP/POP3 connections. To communicate with these providers, follow our guide for [Obtaining a Commercial SSL Certificate](https://www.linode.com/docs/security/ssl/obtaining-a-commercial-ssl-certificate).

## Installing Packages

The next steps are to install the required packages on the Linode.

1.  Log in as the root user:

        su

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

    {: .note }
    >
    > Note which `id` goes with which domain, the `id` is necessary for the next two steps.

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

1.  Immediately make a copy of the default Postfix configuration file in case you need to revert to the default configuration:

        cp /etc/postfix/main.cf /etc/postfix/main.cf.orig

2.  Edit the `/etc/postfix/main.cf` file to match the following, with these changes:(a) Replace occurrences of `example.com` are replaced with your domain name. (b) on line 44, replace `hostname` with the system's hostname.  (c) On lines 26 and 27, enter the indicated paths.  Regarding the certificate file, usually SSL providers will give you two files: one containing your cert and a second file containing one or more certs of the certificate authority.  Unlike Apache, Postfix only reads one cert file, so you must contatenate these two files into a "chained SSL certificate", and enter its path here.  (You will use this same file for Dovecot later.)

    {:.file }
    /etc/postfix/main.cf
    : ~~~
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

      smtpd_tls_cert_file=/path/to/your-(chained)-SSL-cert-file.pem
      smtpd_tls_key_file=/path/to/your-SSL-private-key-file.pem
      smtpd_use_tls=yes
      smtpd_tls_auth_only = yes

      #Enabling SMTP for authenticated users, and handing off authentication to Dovecot
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

      #Handing off local delivery to Dovecot's LMTP, and telling it where to store mail
      virtual_transport = lmtp:unix:private/dovecot-lmtp

      #Virtual domains, users, and aliases
      virtual_mailbox_domains = mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf
      virtual_mailbox_maps = mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf
      virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-alias-maps.cf,
              mysql:/etc/postfix/mysql-virtual-email2email.cf
      ~~~

3.  Create the file for virtual domains. Ensure that you change the password for the `mailuser` account. If you used a different user, database name, or table name, customize those settings as well.

    {: .file }
    /etc/postfix/mysql-virtual-mailbox-domains.cf
    : ~~~
      user = mailuser
      password = mailuserpass
      hosts = 127.0.0.1
      dbname = mailserver
      query = SELECT 1 FROM virtual_domains WHERE name='%s'
      ~~~

4.  Create the `/etc/postfix/mysql-virtual-mailbox-maps.cf` file, and enter the following values. Make sure you use the `mailuser`'s password and make any other changes as needed.

    {: .file }
    /etc/postfix/mysql-virtual-mailbox-maps.cf
    : ~~~
      user = mailuser
      password = mailuserpass
      hosts = 127.0.0.1
      dbname = mailserver
      query = SELECT 1 FROM virtual_users WHERE email='%s'
      ~~~

5.  Create the `/etc/postfix/mysql-virtual-alias-maps.cf` file and enter the following values. Again, make sure you use the mailuser's password, and make any other changes as necessary.

      {: .file }
      /etc/postfix/mysql-virtual-alias-maps.cf
      : ~~~
        user = mailuser
        password = mailuserpass
        hosts = 127.0.0.1
        dbname = mailserver
        query = SELECT destination FROM virtual_aliases WHERE source='%s'
        ~~~

6.  Create the `/etc/postfix/mysql-virtual-email2email.cf` file and enter the following values. Again, make sure you use the mailuser's password, and make any other changes as necessary.

      {: .file }
      /etc/postfix/mysql-virtual-email2email.cf
      : ~~~
        user = mailuser
        password = mailuserpass
        hosts = 127.0.0.1
        dbname = mailserver
        query = SELECT email FROM virtual_users WHERE email='%s'
        ~~~

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

12. Open the configuration file for editing and uncomment the two lines starting with `submission` and `smtps`, and all of the twenty or so lines starting with `-o`.  The first section of the `/etc/postfix/master.cf` file should resemble the following:

    {: .file-excerpt }
	/etc/postfix/master.cf
	: ~~~
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
	    ...
	  smtps     inet  n       -       -       -       -       smtpd
	    -o syslog_name=postfix/smtps
	    -o smtpd_tls_wrappermode=yes
	    ...
	  ~~~

13. Restart Postfix by entering the following command:

        service postfix restart

Congratulations! You have configured Postfix.

## Dovecot

Dovecot allows users to log in and check their email using POP3 and IMAP. In this section, configure Dovecot to force users to use SSL when they connect so that their passwords are never sent to the server in plain text.

1.  Copy all of the configuration files so that you can easily revert back to them if needed:

        cp /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf.orig
        cp /etc/dovecot/conf.d/10-mail.conf /etc/dovecot/conf.d/10-mail.conf.orig
        cp /etc/dovecot/conf.d/10-auth.conf /etc/dovecot/conf.d/10-auth.conf.orig
        cp /etc/dovecot/dovecot-sql.conf.ext /etc/dovecot/dovecot-sql.conf.ext.orig
        cp /etc/dovecot/conf.d/10-master.conf /etc/dovecot/conf.d/10-master.conf.orig
        cp /etc/dovecot/conf.d/10-ssl.conf /etc/dovecot/conf.d/10-ssl.conf.orig

2.  Open the main configuration file `/etc/dovecot/dovecot.conf`and, in the #Enable installed protocols section, add a line to specify that the protocols are imap, pop3 and lmtp:

    {:.file }
    /etc/dovecot/dovecot.conf
    : ~~~
       # Enable installed protocols
      !include_try /usr/share/dovecot/protocols.d/*.protocol
      protocols = imap pop3 lmtp

      ~~~

3.  Save the changes to the `/etc/dovecot/dovecot.conf` file.

4.  Open the `/etc/dovecot/conf.d/10-mail.conf` file. This file controls how Dovecot interacts with the server's file system to store and retrieve messages.

    Modify the following variables within the configuration file.

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-mail.conf
	: ~~~
	  mail_location = maildir:/var/mail/vhosts/%d/%n
    ...
    mail_privileged_group = mail
    ~~~

    Save the changes.

5.  Enter the following command to verify the permissions for `/var/mail`:

        ls -ld /var/mail

6.  Verify that the permissions for `/var/mail` are as follows:

        drwxrwsr-x 2 root mail 4096 Mar  6 15:08 /var/mail

7.  Create the `/var/mail/vhosts/` folder and the folder for the domain:

        mkdir -p /var/mail/vhosts/example.com

8.  Create the `vmail` user with a user and group id of 5000 by entering the following commands, one by one. This user will be in charge of reading mail from the server.

        groupadd -g 5000 vmail
        useradd -g vmail -u 5000 vmail -d /var/mail

9.  Change the owner of the `/var/mail/` folder and its contents to belong to `vmail`:

        chown -R vmail:vmail /var/mail

10. Open the user authentication file, located in `/etc/dovecot/conf.d/10-auth.conf` and disable plain-text authentication by uncommenting this line:

    {: .file-excerpt }
    /etc/dovecot/conf.d/10-auth.conf
    : ~~~
      disable_plaintext_auth = yes
      ~~~

    Set the `auth_mechanisms` by modifying the following line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  auth_mechanisms = plain login
	  ~~~

    Comment out the system user login line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  #!include auth-system.conf.ext
	  ~~~

    Enable MySQL authentication by uncommenting the `auth-sql.conf.ext` line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  #!include auth-system.conf.ext
	  !include auth-sql.conf.ext
	  #!include auth-ldap.conf.ext
	  #!include auth-passwdfile.conf.ext
	  #!include auth-checkpassword.conf.ext
	  #!include auth-vpopmail.conf.ext
	  #!include auth-static.conf.ext
	  ~~~

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1238-dovecot_10-auth.conf.txt" target="_blank">10-auth.conf<a/>.

    Save the changes to the `/etc/dovecot/conf.d/10-auth.conf` file.

11. Edit the `/etc/dovecot/conf.d/auth-sql.conf.ext` file with the authentication information. Paste the following lines into in the file:

    {: .file-excerpt }
	/etc/dovecot/conf.d/auth-sql.conf.ext
	: ~~~
	  passdb {
	    driver = sql
	    args = /etc/dovecot/dovecot-sql.conf.ext
	  }
	  userdb {
	    driver = static
	    args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n
	  }
	  ~~~

    Save the changes to the `/etc/dovecot/conf.d/auth-sql.conf.ext` file.

12. Update the `/etc/dovecot/dovecot-sql.conf.ext` file with our custom MySQL connection information.

    Uncomment and set the `driver` line as shown below:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  driver = mysql
	  ~~~

    Uncomment the `connect` line and set the MySQL connection information. Use the `mailuser`'s password and any other custom settings:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  connect = host=127.0.0.1 dbname=mailserver user=mailuser password=mailuserpass
	  ~~~

    Uncomment the `default_pass_scheme` line and set it to `SHA512-CRYPT`:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  default_pass_scheme = SHA512-CRYPT
	  ~~~

    Uncomment the `password_query` line and set it to the following:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  password_query = SELECT email as user, password FROM virtual_users WHERE email='%u';
	  ~~~

	{:.note}
    >
    > This password query lets you use an email address listed in the `virtual_users` table as the username credential for an email account. If you want to be able to use the alias as the username instead (listed in the `virtual_aliases` table), first add every primary email address to the `virtual_aliases` table (directing to themselves) and then use the following line in `/etc/dovecot/dovecot-sql.conf.ext` instead:
    >
    >     password_query = SELECT email as user, password FROM virtual_users WHERE email=(SELECT destination FROM virtual_aliases WHERE source = '%u');

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1284-dovecot__dovecot-sql.conf.ext.txt" target="_blank">dovecot-sql.conf.ext</a>.

    Save the changes to the `/etc/dovecot/dovecot-sql.conf.ext`  file.

13. Change the owner and group of the `/etc/dovecot/` directory to `vmail` and `dovecot`:

        chown -R vmail:dovecot /etc/dovecot

14. Change the permissions on the `/etc/dovecot/` directory:

        chmod -R o-rwx /etc/dovecot

15. Open the sockets configuration file, located at `/etc/dovecot/conf.d/10-master.conf`

    {:.note}
    >
    > Click this link to see the final version of <a href="/docs/assets/1240-dovecot_10-master.conf.txt" target="_blank">10-master.conf</a>. There are many nested blocks of code in this file, so please pay close attention to the brackets. It's probably better if you edit line by line, rather than copying large chunks of code. If there's a syntax error, Dovecot will crash silently, but you can check `/var/log/upstart/dovecot.log` to help you find the error.

16. Disable unencrypted IMAP and POP3 by setting the protocols' ports to 0, as shown below. Ensure that the entries for port and ssl below the IMAPS and pop3s entries are uncommented:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-master.conf
	: ~~~
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
	~~~

    {:.note}
    >
    > Leave the secure versions unedited, specifically the `imaps` and `pop3s`, so that their ports still work. The default settings for `imaps` and `pop3s` are fine. Optionally, leave the `port` lines commented out, as the default ports are the standard 993 and 995.

    Find the `service lmtp` section and use the configuration shown below:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-master.conf
	: ~~~
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
	  ~~~

    Locate the `service auth` section and configure it as shown below:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-master.conf
	: ~~~
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
	  ~~~

    In the `service auth-worker` section, uncomment the `user` line and set it to `vmail` as shown below:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-master.conf
	: ~~~
	  service auth-worker {
	    # Auth worker process is run as root by default, so that it can access
	    # /etc/shadow. If this isn't necessary, the user should be changed to
	    # $default_internal_user.
	    user = vmail
	  }
	  ~~~

    Save the changes to the `/etc/dovecot/conf.d/10-master.conf` file.

17. Open `/etc/dovecot/conf.d/10-ssl.conf`.

18. Find the `ssl_cert` and `ssl_key` settings and change them to the same paths that you used previously, when configuring Postfix. Leave the "<" less-than characters as shown.

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-ssl.conf
	: ~~~
	  ssl_cert = </path/to/your-(chained)-SSL-cert-file.pem
	  ssl_key = </path/to/your-SSL-private-key-file.pem
	  ~~~

    Force the clients to use SSL encryption by uncommenting the `ssl` line and setting it to `required`:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-ssl.conf
	: ~~~
	  ssl = required
	  ~~~

    Save the changes to the `/etc/dovecot/conf.d/10-ssl.conf` file.

20. Finally, restart Dovecot:

        service dovecot restart


## Test Email

1.  Set up a test account in an email client to ensure that everything is working. Many clients detect server settings automatically. However, manual configuration requires the following parameters:
    -   the full email address, including the `@example.com` part, is the username.
    -   the password should be the one you added to the MySQL table for this email address.
    -   The incoming and outgoing server names must be a domain that resolves to the Linode.
    -   Both the incoming and outgoing servers require authentication and SSL encryption.
    -   You should use Port 993 for secure IMAP, Port 995 for secure POP3, and Port 25 with SSL for SMTP.

2.  Try sending an email to this account from an outside email account and then reply to it. Check the mail log file in */var/log/mail.log* for the following output (the first block is for an incoming message, and the second block for an outgoing message):

    {: .file-excerpt }
	/var/log/mail.log
	: ~~~
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
	  ~~~

    {: .file-excerpt }
	/var/log/mail.log
	: ~~~
	  Mar 22 18:20:29 host postfix/smtpd[22590]: connect from 173-161-199-49-Philadelphia.hfc.comcastbusiness.net[173.161.199.49]
	  Mar 22 18:20:29 host dovecot: auth-worker: mysql(127.0.0.1): Connected to database mailserver
	  Mar 22 18:20:29 host postfix/smtpd[22590]: AA10A2839B: client=173-161-199-49-Philadelphia.hfc.comcastbusiness.net[173.161.199.49], sasl_method=PLAIN, sasl_username=email1@example.com
	  Mar 22 18:20:29 host postfix/cleanup[22599]: AA10A2839B: message-id=<FB6213FA-6F13-49A8-A5DD-F324A4FCF9E9@example.com>
	  Mar 22 18:20:29 host postfix/qmgr[15878]: AA10A2839B: from=<email1@example.com>, size=920, nrcpt=1 (queue active)
	  Mar 22 18:20:29 host postfix/smtp[22601]: AA10A2839B: to=<support@linode.com>, relay=mail1.linode.com[96.126.108.55]:25, delay=0.14, delays=0.08/0.01/0.05/0.01, dsn=2.0.0, status=sent (250 2.0.0 Ok: queued as C4232266C9)
	  Mar 22 18:20:29 host postfix/qmgr[15878]: AA10A2839B: removed
	  ~~~

You now have a functioning mail server that can securely send and receive email. If things are not working smoothly, try consulting the [Troubleshooting Problems with Postfix, Dovecot, and MySQL](/docs/email/postfix/troubleshooting) guide. At this point, consider adding spam and virus filtering and a webmail client. If DNS records have not been created for the mail server yet, do so now. Once the DNS records have propagated, email will be delivered via the new mail server.

{: .note }
>If errors are encountered in the /var/log/syslog stating "Invalid settings: postmaster_address setting not given", you may need to append the following line to the /etc/dovecot/dovecot.conf file, replacing domain with the domain name.
>
>     postmaster_address=postmaster at DOMAIN

## Adding New Domains, Email Addresses, and Aliases

Although the mail server is up and running, eventually you'll probably need to add new domains, email addresses, and aliases for the users. To do this, simply add a new line to the appropriate MySQL table. These instructions are for command-line MySQL, but you can also use [phpMyAdmin](http://www.phpmyadmin.net/) to add new entries to the tables.

### Domains

1.  To add a new domain, open a terminal window and [log in to the Linode via SSH](/docs/getting-started#sph_logging-in-for-the-first-time).

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

    {: .note }
    >
    > Be sure to use the correct number for the `domain_id`. In this case, we are using `5`, because we want to make an email address for `newdomain.com`, and `newdomain.com` has an `id` of `5` in the `virtual_domains` table.

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

    {: .note }
    >
    > Ensure that the correct number is entered for the `domain_id` value. Use the `id` of the domain for this email address. For an explanation of `id` us, see the email users section above.

    You can also add a "catch-all" alias which will forward all emails sent to a domain which do not have matching aliases or users by specifying `@newdomain.com` as the source of the alias.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`domain_id`, `source`, `destination`)
        VALUES
          ('5', '@newdomain.com', 'myemail@gmail.com');

2.  Verify that the new alias has been added. The new alias will be displayed in the output.

        SELECT * FROM mailserver.virtual_aliases;

3.  Exit MySQL:

        quit

You have successfully added the new alias to the Postfix and Dovecot setup.

