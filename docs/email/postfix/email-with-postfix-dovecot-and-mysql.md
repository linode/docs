---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up a mail server with Postfix, Dovecot, and MySQL.'
keywords: 'email,mail,postfix,dovecot,mysql,debian 7,ubuntu 14.04,dovecot 2'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Wednesday, October 1, 2014
modified_by:
  name: James Stewart
published: 'Monday, May 13th, 2013'
title: 'Email with Postfix, Dovecot, and MySQL'
---

This guide shows you how to set up a secure mail server on your Linode with Postfix, Dovecot, and MySQL. By the time you reach the end, you'll know how to create mailboxes for your users and send and receive email for your domains.

### Prerequisites

Before setting up your mail server, you'll need to set up your Linode as specified in the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/securing-your-server) guides. You'll also need to verify that you've completed the following steps:

-   [Deployed your Linode](/docs/getting-started#sph_deploying-a-linux-distribution).
-   Set a [root password](/docs/getting-started#sph_deploying-a-linux-distribution).
-   Set the [hostname](/docs/getting-started#sph_setting-the-hostname) and updated the [/etc/hosts](/docs/getting-started#sph_update-etc-hosts) file.
-   [Updated and upgraded](/docs/getting-started#sph_installing-software-updates) the operating system and all installed packages.
-   [Created a Linux user with sudo access](/docs/securing-your-server#sph_adding-a-new-user).
-   *Optional:* Created [SSH keys](/docs/securing-your-server#sph_using-ssh-key-pair-authentication) for secure SSH sessions.
-   Made sure that your [firewall](/docs/securing-your-server#sph_creating-a-firewall) is not blocking any of the standard mail ports (25, 465, 587, 110, 995, 143, and 993).

### Configuring DNS

When you're ready to switch the DNS and start sending mail to the server, edit your domain's MX record so it points to your Linode's domain or IP address, similar to the example below:

    example.com            MX       10      example.com
    example.com         MX      10      12.34.56.78
    mail.example.com    MX      10      12.34.56.78

Make sure you do this for all domains and subdomains that might receive email for your domain. These steps can be peformed prior to configuring your mailserver if you are setting up a brand new domain. If you use Linode's [DNS Manager](/docs/dns-manager), you will need to create an MX record that points to the desired domain or subdomain, and then create an A record for that domain or subdomain as well, that points to the correct IP address.

### Installing an SSL Certificate

In this guide, you'll use the default self-signed certificate that comes with Dovecot for free. This certificate encrypts your mail connections just like a purchased certificate, but your email users will receive warnings about the certificate when they attempt to set up their email accounts.  You may want to purchase and configure a commercial SSL certificate to avoid this.  For information about SSL certificates, see [these guides in the Linode Library](/docs/security/ssl/).

### Finding the Hostname

Ensure that your Linode's hostname and FQDN have been set before beginning. Here's how to find your Linode's hostname:

1.  Enter the following command via your SSH session to query your server's hostname:

        hostname

3.  Find your server's fully-qualified domain name (FQDN) by entering the following command:

        hostname -f

Save these hostnames - you'll need them later!

Installing Packages
-------------------

The next steps will walk through installing the required packages on the Linode.

1.  Log in as the root user by entering the following command:

        su

2.  Enter the password for the root user when prompted.

3.  Install the required packages.

        apt-get install postfix postfix-mysql dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql mysql-server

4.  When prompted, type a new secure password for the root MySQL user, as shown below.

    [![Set your root MySQL password.](/docs/assets/1234-mysql_setroot1.png)](/docs/assets/1234-mysql_setroot1.png)

5.  Type the password again, as shown below. Make sure you remember what it is - you'll need it later.

    [![Re-enter your root MySQL password.](/docs/assets/1235-mysql_setroot2.png)](/docs/assets/1235-mysql_setroot2.png)

6.  Select **Internet Site** when prompted for your Postfix configuration.

    [![Choose "Internet Site" for Postfix.](/docs/assets/1236-postfix_internetsite.png)](/docs/assets/1236-postfix_internetsite.png)

7.  Enter your FQDN as the *System Mail Name*

    [![Set the system mail name for Postfix.](/docs/assets/1237-postfix_systemmailname.png)](/docs/assets/1237-postfix_systemmailname.png)

MySQL
-----

### Creating the Database

Here's how to create the necessary database and tables in MySQL:

1.  Create a new database by entering the following command.

        mysqladmin -p create mailserver

2.  Enter the MySQL root password.

3.  Log in to MySQL by entering the following command:

        mysql -p mailserver

5.  Create your MySQL user and grant the new user permissions over your database.  Replace *mailuserpass* with a secure password.

        GRANT SELECT ON mailserver.* TO 'mailuser'@'127.0.0.1' IDENTIFIED BY 'mailuserpass';

6.  Flush the MySQL privileges to apply the change.

        FLUSH PRIVILEGES;

7.  Enter the following command to create a table for the domains that will receive mail on your Linode.

        CREATE TABLE `virtual_domains` (
          `id` int(11) NOT NULL auto_increment,
          `name` varchar(50) NOT NULL,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

8.  Enter the following command to create a table for all of the email addresses and passwords.

        CREATE TABLE `virtual_users` (
          `id` int(11) NOT NULL auto_increment,
          `domain_id` int(11) NOT NULL,
          `password` varchar(106) NOT NULL,
          `email` varchar(100) NOT NULL,
          PRIMARY KEY (`id`),
          UNIQUE KEY `email` (`email`),
          FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

9.  Enter the following command to create a table for your email aliases.

        CREATE TABLE `virtual_aliases` (
          `id` int(11) NOT NULL auto_increment,
          `domain_id` int(11) NOT NULL,
          `source` varchar(100) NOT NULL,
          `destination` varchar(100) NOT NULL,
          PRIMARY KEY (`id`),
          FOREIGN KEY (domain_id) REFERENCES virtual_domains(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

### Adding Data

Now that you've created the database and tables, let's add some data to MySQL. Here's how:

1.  Add your domains to the `virtual_domains` table.  Replace the values for *example.com* and *hostname* with your own settings.

        INSERT INTO `mailserver`.`virtual_domains`
          (`id` ,`name`)
        VALUES
          ('1', 'example.com'),
          ('2', 'hostname.example.com'),
          ('3', 'hostname'),
          ('4', 'localhost.example.com');

    {: .note }
    >
    > Make a note of which `id` goes with which domain - you'll need for the next two steps.

2.  Add email addresses to the `virtual_users` table.  Replace the email address values with the addresses that you wish to configure on your mailserver, and the `password` values with strong passwords. 

        INSERT INTO `mailserver`.`virtual_users`
          (`id`, `domain_id`, `password` , `email`)
        VALUES
          ('1', '1', ENCRYPT('password', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))), 'email1@example.com'),
          ('2', '1', ENCRYPT('password', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))), 'email2@example.com');

3.  If you want to set up an email alias, add it to the `virtual_aliases` table.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`id`, `domain_id`, `source`, `destination`)
        VALUES
          ('1', '1', 'alias@example.com', 'email1@example.com');

That's it! Now you're ready to verify that the data was successfully added to MySQL.

### Testing

Now that you've entered all of the information into MySQL, you need to double check that it's there. Here's how:

1.  Check the contents of the `virtual_domains` table by entering the following command:

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

3.  Check the `virtual_users` table by entering the following command:

        SELECT * FROM mailserver.virtual_users;

4.  Verify that you see the following output (the hashed passwords will be longer than they appear below):

        +----+-----------+-------------------------------------+--------------------+
        | id | domain_id | password                            | email              |
        +----+-----------+-------------------------------------+--------------------+
        |  1 |         1 | $6$574ef443973a5529c20616ab7c6828f7 | email1@example.com |
        |  2 |         1 | $6$030fa94bcfc6554023a9aad90a8c9ca1 | email2@example.com |
        +----+-----------+-------------------------------------+--------------------+
        2 rows in set (0.01 sec)

5.  Check the `virtual_users` table by entering the following command:

        SELECT * FROM mailserver.virtual_aliases;

6.  Verify that you see the following output:

        +----+-----------+-------------------+--------------------+
        | id | domain_id | source            | destination        |
        +----+-----------+-------------------+--------------------+
        |  1 |         1 | alias@example.com | email1@example.com |
        +----+-----------+-------------------+--------------------+
        1 row in set (0.00 sec)

7.  If everything looks good, you're done with MySQL! Enter the following command to exit MySQL:

        exit

Now you're ready to set up Postfix so your server can accept incoming messages for your domains.

Postfix
-------

Here's how to configure Postfix:

1.  Before doing anything else, enter the following command to make a copy of the default Postfix configuration file. This will come in handy if you mess up and need to revert to the default configuration.

        cp /etc/postfix/main.cf /etc/postfix/main.cf.orig

3.  Edit your `/etc/postfix/main.cf` file to match the following.  Ensure that occurances of `example.com` are replaced with your domain name, and `hostname` with your system's hostname.

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

      smtpd_tls_cert_file=/etc/dovecot/dovecot.pem
      smtpd_tls_key_file=/etc/dovecot/private/dovecot.pem
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

      myhostname = host.example.com
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
      virtual_alias_maps = mysql:/etc/postfix/mysql-virtual-alias-maps.cf
      ~~~

5. Create the file for virtual domains by entering the following command and enter the following values. Ensure that you change the password for the `mailuser` account. If you used a different user, database name, or table name, customize those settings as well.

    {: .file }
    /etc/postfix/mysql-virtual-mailbox-domains.cf
    : ~~~
    user = mailuser
    password = mailuserpass
    hosts = 127.0.0.1
    dbname = mailserver
    query = SELECT 1 FROM virtual_domains WHERE name='%s'
      ~~~

8. Edit the `/etc/postfix/mysql-virtual-domains.cf` file, and enter the following values. Make sure you use your own password, and make any other changes as needed.

    {: .file }
    /etc/postfix/mysql-virtual-mailbox-maps.cf
    : ~~~
    user = mailuser
    password = mailuserpass
    hosts = 127.0.0.1
    dbname = mailserver
    query = SELECT 1 FROM virtual_users WHERE email='%s'
      ~~~

11. Edit the `/etc/postfix/mysql-virtual-alias-maps.cf` file and enter the following values. Again, make sure you use your own password, and make any other changes as necessary.

      {: .file }
      /etc/postfix/mysql-virtual-alias-maps.cf
      : ~~~
      user = mailuser
      password = mailuserpass
      hosts = 127.0.0.1
      dbname = mailserver
      query = SELECT destination FROM virtual_aliases WHERE source='%s'
        ~~~

13. Save the changes you've made to the */etc/postfix/mysql-virtual-alias-maps.cf* file, and restart Postfix with the following command.

        sudo service postfix restart

14. Enter the following command to ensure that Postfix can find your first domain. Be sure to replace `example.com` with your first virtual domain. The command should return `1` if it is successful.

        postmap -q example.com mysql:/etc/postfix/mysql-virtual-mailbox-domains.cf

15. Test Postfix to verify that it can find the first email address in your MySQL table. Enter the following command, replacing `email1@example.com` with the first email address in your MySQL table. You should again receive `1` as the output:

        postmap -q email1@example.com mysql:/etc/postfix/mysql-virtual-mailbox-maps.cf

16. Test Postfix to verify that it can find your aliases by entering the following command. Be sure to replace `alias@example.com` with the actual alias you entered:

        postmap -q alias@example.com mysql:/etc/postfix/mysql-virtual-alias-maps.cf

    This should return the email address to which the alias forwards, which is `email1@example.com` in this example.

17. Make a copy of the `/etc/postfix/master.cf` file:

        cp /etc/postfix/master.cf /etc/postfix/master.cf.orig

18. Open the configuration file for editing, and uncomment the two lines starting with `submission` and `smtps`. The first section of your `/etc/postfix/master.cf` file should resemble the following:

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
	  ~~~

21. Restart Postfix by entering the following command:

        service postfix restart

Congratulations! You have successfully configured Postfix.

Dovecot
-------

Dovecot allows users to log in and check their email using POP3 and IMAP. In this section, you'll configure Dovecot to force users to use SSL when they connect so that their passwords are never sent to the server in plain text.

Here's how to configure Dovecot:

1.  Copy all of the configuration files so that you can easily revert back to them if needed. Enter the following commands, one by one:

        cp /etc/dovecot/dovecot.conf /etc/dovecot/dovecot.conf.orig
        cp /etc/dovecot/conf.d/10-mail.conf /etc/dovecot/conf.d/10-mail.conf.orig
        cp /etc/dovecot/conf.d/10-auth.conf /etc/dovecot/conf.d/10-auth.conf.orig
        cp /etc/dovecot/dovecot-sql.conf.ext /etc/dovecot/dovecot-sql.conf.ext.orig
        cp /etc/dovecot/conf.d/10-master.conf /etc/dovecot/conf.d/10-master.conf.orig
        cp /etc/dovecot/conf.d/10-ssl.conf /etc/dovecot/conf.d/10-ssl.conf.orig

2.  Enter the following command to open the main configuration file for editing:

        nano /etc/dovecot/dovecot.conf

3.  Edit the contents of the file to match the following:

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
    # these networks. Typically you'd specify your IMAP proxy servers here.
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

5.  Save your changes to the */etc/dovecot/dovecot.conf* file.
6.  Open the */etc/dovecot/conf.d/10-mail.conf* file for editing by entering the following command. This file allows us to control how Dovecot interacts with the server's file system to store and retrieve messages.

        nano /etc/dovecot/conf.d/10-mail.conf

    {:.note}
    >
    > Click this link to see the final, complete version of <a href="/docs/assets/1239-dovecot_10-mail.conf.txt" target="_blank">10-mail.conf</a> example file. This is a long file, so you may need to use your editor's search feature to find the values you need to edit.

7.  Modify the following variables within the configuration file.

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-mail.conf
	: ~~~
	  mail_location = maildir:/var/mail/vhosts/%d/%n
    ...
    mail_privileged_group = mail

	  ~~~

8.  Find the `mail_privileged_group` variable. Uncomment it, and then set it to the following value. This allows Dovecot to write to the */var/mail/* folder.

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-mail.conf
	: ~~~
	  mail_privileged_group = mail
	  ~~~

9.  Save your changes to the */etc/dovecot/conf.d/10-mail.conf* file.
10. Enter the following command to verify the permissions for */var/mail*:

        ls -ld /var/mail

11. Verify that the permissions for */var/mail* are as follows:

        drwxrwsr-x 2 root mail 4096 Mar  6 15:08 /var/mail

12. Create the */var/mail/vhosts/* folder and the folder(s) for each of your domains by entering the following command:

        mkdir -p /var/mail/vhosts/example.com

13. Create the `vmail` user with a user and group id of 5000 by entering the following commands, one by one. This user will be in charge of reading mail from the server.

        groupadd -g 5000 vmail
        useradd -g vmail -u 5000 vmail -d /var/mail

14. Change the owner of the */var/mail/* folder and its contents to belong to `vmail` by entering the following command:

        chown -R vmail:vmail /var/mail

15. Open the user authentication file for editing by entering the command below. You need to set up authentication so only authenticated users can read mail on the server. You also need to configure an authentication socket for outgoing mail, since we told Postfix that Dovecot was going to handle that. There are a few different files related to authentication that get included in each other.

        nano /etc/dovecot/conf.d/10-auth.conf

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1238-dovecot_10-auth.conf.txt" target="_blank">10-auth.conf<a/>.

16. Disable plain-text authentication by uncommenting this line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  disable_plaintext_auth = yes
	  ~~~

17. Set the `auth_mechanisms` by modifying the following line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  auth_mechanisms = plain login
	  ~~~

18. Add a hash tag (`#`) to comment out the system user login line:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-auth.conf
	: ~~~
	  #!include auth-system.conf.ext
	  ~~~

19. Enable MySQL authentication by uncommenting the `auth-sql.conf.ext` line. That section should look like this:

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

20. Save your changes to the */etc/dovecot/conf.d/10-auth.conf* file.
21. Now you need to create the */etc/dovecot/conf.d/auth-sql.conf.ext* file with your authentication information. Enter the following command to create the new file:

        nano /etc/dovecot/conf.d/auth-sql.conf.ext

22. Paste the following lines into in the new file:

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

    Explanation of parameters:

    -   `passdb` tells Dovecot how to look up users for authentication. We're telling Dovecot to use MySQL. In the `args` line, we're also specifying the file that contains the MySQL connection information.
    -   `userdb` tells Dovecot where to look for users' mail on the server. We're using a static driver since the path will be in the same format for everyone.

23. Save your changes to the */etc/dovecot/conf.d/auth-sql.conf.ext* file.
24. Update the */etc/dovecot/dovecot-sql.conf.ext* file with our custom MySQL connection information. Open the file for editing by entering the following command:

        nano /etc/dovecot/dovecot-sql.conf.ext

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1284-dovecot__dovecot-sql.conf.ext.txt" target="_blank">dovecot-sql.conf.ext</a>.

25. Uncomment and set the `driver` line as shown below:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  driver = mysql
	  ~~~

26. Uncomment the `connect` line and set your MySQL connection information. Make sure you use your own password and any other custom settings:

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  connect = host=127.0.0.1 dbname=mailserver user=mailuser password=mailuserpass
	  ~~~

27. Uncomment the `default_pass_scheme` line and set it to `SHA512-CRYPT`. This tells Dovecot to expect the passwords in an encrypted format (which is how they are stored in the database).

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  default_pass_scheme = SHA512-CRYPT
	  ~~~

28. Uncomment the `password_query` line and set it to the following. This is a MySQL query that Dovecot uses to retrieve the password from the database.

    {: .file-excerpt }
	/etc/dovecot/dovecot-sql.conf.ext
	: ~~~
	  password_query = SELECT email as user, password FROM virtual_users WHERE email='%u';
	  ~~~

	{:.note}
    >
    > This password query lets you use an email address listed in the `virtual_users` table as your username credential for an email account. The primary email address should still be used as the username, even if you have set up your email client for an alias. If you want to be able to use the alias as your username instead (listed in the `virtual_aliases` table), you should first add every primary email address to the `virtual_aliases` table (directing to themselves) and then use the following line in `/etc/dovecot/dovecot-sql.conf.ext` instead:
    >
    >     password_query = SELECT email as user, password FROM virtual_users WHERE email=(SELECT destination FROM virtual_aliases WHERE source = '%u');

29. Save your changes to the */etc/dovecot/dovecot-sql.conf.ext* file.
30. Change the owner and group of the */etc/dovecot/* directory to `vmail` and `dovecot` by entering the following command:

        chown -R vmail:dovecot /etc/dovecot

31. Change the permissions on the */etc/dovecot/* directory by entering the following command:

        chmod -R o-rwx /etc/dovecot

32. Open the sockets configuration file by entering the following command. You'll change the settings in this file to set up the LMTP socket for local mail delivery, and the auth socket for authentication. Postfix uses these sockets to connect to Dovecot's services.

        nano /etc/dovecot/conf.d/10-master.conf

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1240-dovecot_10-master.conf.txt" target="_blank">10-master.conf</a>. There are many nested blocks of code in this file, so please pay very close attention to your brackets. It's probably better if you edit line by line, rather than copying large chunks of code. If there's a syntax error, Dovecot will crash silently, but you can check `/var/log/upstart/dovecot.log` to help you find the error.

33. Disable unencrypted IMAP and POP3 by setting the protocols' ports to 0, as shown below. This will force your users to use secure IMAP or secure POP on 993 or 995 when they configure their mail clients:

    {: .file-excerpt }
	etc/dovecot/conf.d/10-master.conf
	: ~~~
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
	~~~

    {:.note}
    >
    > Make sure you leave the secure versions alone - `imaps` and `pop3s` - so their ports still work. The default settings for `imaps` and `pop3s` are fine. You can leave the `port` lines commented out, as the default ports are the standard 993 and 995.

34. Find the `service lmtp` section and use the configuration shown below. You'll need to add a few lines in the `unix_listener` block. This section makes the socket for LMTP in the place we told Postfix to look for it.

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

35. Locate the `service auth` section and use the configuration shown below. You'll need to create a new `unix_listener` block, modify the existing one, and then uncomment and set the `user`. This section makes the authorization socket where we told Postfix to look for it:

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

36. In the `service auth-worker` section, uncomment the `user` line and set it to `vmail`, as shown below.

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

37. Save your changes to the */etc/dovecot/conf.d/10-master.conf* file.
38. Verify that the default Dovecot SSL certificate and key exist by entering the following commands, one by one:

        ls /etc/dovecot/dovecot.pem
        ls /etc/dovecot/private/dovecot.pem

    {:.note}
    >
    > If you are using a different SSL certificate, you should upload the certificate to the server and make a note of its location and the key's location.

39. Open the SSL configuration file for editing by entering the following command. This is where we tell Dovecot where to find our SSL certificate and key, and any other SSL-related parameters.

        nano /etc/dovecot/conf.d/10-ssl.conf

    {:.note}
    >
    > Click the link to see the final, complete version of <a href="/docs/assets/1241-dovecot_10-ssl.conf.txt" target="_blank">10-ssl.conf</a>.

40. Verify that the `ssl_cert` setting has the path to your certificate, and that the `ssl_key` setting has the path to your key. The default setting here uses Dovecot's built-in certificate, so you can leave this as-is if you are using the Dovecot certificate. You should update the paths if you are using a different certificate and key.

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-ssl.conf
	: ~~~
	  ssl_cert = </etc/dovecot/dovecot.pem
	  ssl_key = </etc/dovecot/private/dovecot.pem
	  ~~~

41. Force your clients to use SSL encryption for all connections. Set `ssl` to `required`:

    {: .file-excerpt }
	/etc/dovecot/conf.d/10-ssl.conf
	: ~~~
	  ssl = required
	  ~~~

42. Save your changes to the */etc/dovecot/conf.d/10-ssl.conf* file. Dovecot has been configured!
43. Restart Dovecot by entering the following command:

        service dovecot restart

44. Set up a test account in an email client to make sure everything is working. You'll need to use the following parameters:
    -   Your full email address, including the `@example.com` part, is your username.
    -   Your password should be the one you added to the MySQL table for this email address.
    -   The incoming and outgoing server names must be a domain that resolves to your Linode.
    -   Both the incoming and outgoing servers require authentication and SSL encryption.
    -   You should use Port 993 for secure IMAP, Port 995 for secure POP3, and Port 25 with SSL for SMTP.

45. Try sending an email to this account from an outside email account and then reply to it. If it works, you're in business! You can check your mail log file in */var/log/mail.log*, where you should see something like this (the first block is for an incoming message, and the second block for an outgoing message):

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

Congratulations! You now have a functioning mail server that can securely send and receive email. If things are not working smoothly, you may also want to consult the [Troubleshooting Problems with Postfix, Dovecot, and MySQL](/docs/email/postfix/troubleshooting) guide. At this point, you may want to consider adding spam and virus filtering and a webmail client. If you haven't switched the DNS records for your mail server yet, you should be able to do so now. Once the DNS records have propagated, you will start receiving email for your domain on the server.

{: .note }
>If you encounter errors in your /var/log/syslog stating "Invalid settings: postmaster_address setting not given", you may need to append the following line to your /etc/dovecot/dovecot.conf file, replacing domain with your domain name.
>
>     postmaster_address=postmaster at DOMAIN

Adding New Domains, Email Addresses, and Aliases
------------------------------------------------

Now your mail server is up and running, but eventually you'll probably need to add new domains, email addresses, and aliases for your users. To do this, all you'll have to do is add a new line to the appropriate MySQL table. These instructions are for command-line MySQL, but you can just as easily use [phpMyAdmin](http://www.phpmyadmin.net/) to add new entries to your tables as well.

### Domains

Here's how to add a new domain to your Postfix and Dovecot setup:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#sph_logging-in-for-the-first-time).
2.  Log in to your MySQL server with an appropriately privileged user. In this example, we'll use the `root` user:

        mysql -u root -p mailserver

3.  Enter your root MySQL password when prompted.
4.  You should always view the contents of the table before adding new entries. Enter the following command to view the current contents of any table, replacing `virtual_domains` with your table:

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

6.  To add another domain, enter the following command, replacing `newdomain.com` with your domain name:

        INSERT INTO `mailserver`.`virtual_domains`
          (`name`)
        VALUES
          ('newdomain.com');

7.  Verify that the new domain has been added by entering the following command. You should see the new domain name in the output.

        SELECT * FROM mailserver.virtual_domains;

8.  To exit MySQL, enter the following command:

        quit

Congratulations! You have successfully added the new domain to your Postfix and Dovecot setup.

### Email Addresses

Here's how to add a new email address to your Postfix and Dovecot setup:

1.  Enter the following command in MySQL, replacing `newpassword` with the user's password, and `email3@newdomain.com` with the user's email address:

        INSERT INTO `mailserver`.`virtual_users`
          (`domain_id`, `password` , `email`)
        VALUES
          ('5', ENCRYPT('newpassword', CONCAT('$6$', SUBSTRING(SHA(RAND()), -16))) , 'email3@newdomain.com');

 {: .note }
>
> Be sure to use the correct number for the `domain_id`. In this case, we are using `5`, because we want to make an email address for `newdomain.com`, and `newdomain.com` has an `id` of `5` in the `virtual_domains` table.

2.  Verify that the new email address has been added by entering the following command. You should see the new email address in the output.

        SELECT * FROM mailserver.virtual_users;

3.  To exit MySQL, enter the following command:

        quit

Congratulations! You have successfully added the new email address to your Postfix and Dovecot setup.

### Aliases

Here's how to add a new alias to your Postfix and Dovecot setup:

1.  Enter the following command in MySQL, replacing `alias@newdomain.com` with the address from which you want to forward email, and `myemail@gmail.com` with the address that you want to forward the mail to. The `alias@newdomain.com` needs to be an email address that already exists on your server.

        INSERT INTO `mailserver`.`virtual_aliases`
          (`domain_id`, `source`, `destination`)
        VALUES
          ('5', 'alias@newdomain.com', 'myemail@gmail.com');

 {: .note }
>
> You will need to use the correct number for the `domain_id`. You should use the `id` of the domain for this email address; see the explanation in the email users section above.

2.  Verify that the new alias has been added by entering the following command. You should see the new alias in the output.

        SELECT * FROM mailserver.virtual_aliases;

3.  To exit MySQL, enter the following command:

        quit

Congratulations! You have successfully added the new alias to your Postfix and Dovecot setup.



