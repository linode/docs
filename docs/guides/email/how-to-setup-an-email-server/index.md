---
slug: how-to-setup-an-email-server
title: "How to Set up an Email Server using Postfix and Dovecot"
description: 'How to set up a mail server using Dovecot and Postfix. Understand what it takes, the benefits and challenges, of running an email server.'
keywords: ['Set up an email server', 'Dovecot and Postfix', 'MTA mail transfer agent', 'MDA Mail delivery Agent', 'IMAP/POP3 server']
tags: ['mariadb', 'email', 'postfix']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-06-12
modified_by:
  name: Linode
external_resources:
- '[Dovecot](https://dovecot.org/)'
- '[PostfixAdmin](https://postfixadmin.github.io/postfixadmin/)'
- '[GitHub page for PostfixAdmin](https://github.com/postfixadmin/postfixadmin/releases)'
- '[Simple Mail Transfer Protocol (SMTP)](https://www.rfc-editor.org/rfc/rfc5321)'
- '[Post Office Protocol (POP)](https://www.rfc-editor.org/rfc/rfc1939)'
---

Email may be the one true universal app, but no provider’s offering is truly “free.” Large-scale service providers mine users’ data for sale to advertisers. Others charge usage fees by the message, user, domain, and/or megabyte. To truly get control over your messaging, your best bet is to run your own email server.

While email server configuration is not trivial, it provides you with much greater privacy and flexibility. You have complete control over which domains and users you host, and how much storage you allot to each. You also gain a deeper knowledge of the key email protocols and how they work together.

This guide walks you through how to build an email server at Linode using [Postfix](https://www.postfix.org/) and [Dovecot](https://dovecot.org/), two popular open-source email server packages. You also learn how to set up virtual domains, users, and aliases using [PostfixAdmin](https://postfixadmin.github.io/postfixadmin/), a web-based front end for managing Postfix and Dovecot.

Before delving into the details, first, consider why you wouldn’t want to run your own email server. Setup isn’t difficult, but it is time-consuming; you need to set aside a significant chunk of time (several hours, at minimum) to ensure your server functions properly. You also need to commit to ongoing maintenance of your server, both to keep it regularly patched and to troubleshoot any delivery issues. If you don’t have time for system administration tasks or don’t mind the privacy tradeoffs, consider using a commercial email service instead.

## Email Systems: A Quick Introduction

The email server you are going to build uses three and possibly four main protocols: [Simple Mail Transfer Protocol (SMTP)](https://www.rfc-editor.org/rfc/rfc5321), [message submission](https://www.rfc-editor.org/rfc/rfc6409), [Internet Message Access Protocol (IMAP)](https://www.rfc-editor.org/rfc/rfc9051), and possibly the older [Post Office Protocol (POP)](https://www.rfc-editor.org/rfc/rfc1939).

SMTP works for message delivery, optionally from client to server and always between servers. Clients often use a separate protocol called submission to move messages from mail clients, called mail user agents (MUAs), to mail servers, called mail transfer agents (MTAs). MTAs always communicate over **SMTP**.

IMAP and POP are *message retrieval* protocols. They operate exclusively between a local mail server and an MUA.

None of the mail protocols, by themselves, encrypt data in transit. In this guide, you learn how to use Transport Layer Security (TLS) mechanisms to build encrypted tunnels between MUAs and your mail server. Your server is going to be capable of TLS-encrypting traffic with other servers, but only if remote servers also support TLS. The free [Letsencrypt](https://letsencrypt.org/) service provides certificates and private keys on which TLS relies.

Postfix is one of the most widely used open-source SMTP servers available. It’s included in most Linux/Unix distributions, including Ubuntu, which you are using here. Similarly, Dovecot is among the most common IMAP and POP servers. It too is available as an Ubuntu package.


## First, Some Assumptions

Before you begin, it’s important to understand five key assumptions this guide makes:

1. As a developer, you should already be familiar with the Linux command line, the vi text editor (or any other editor capable of editing plain text files), and basic networking concepts. Linode has technical guides on SMTP and IMAP/POP to bring you up to speed on the way these protocols work.

1. Although Postfix and Dovecot servers can operate in the _system_ or _virtual_ mode*, you only use virtual mode here.

In system mode, only users with local logins can send and receive emails. They do so with lookups against the operating system’s `/etc/passwd` file. Also, all system-mode users reside in a single domain. In contrast, the virtual mode allows an unlimited number of domains, users, and aliases, all unrelated to the underlying operating system.

1. This guide sets up a mail server called "`mail.linoderocks.com`", but you should substitute your own hostname and domain name for each step that calls for one. Same thing with passwords; anywhere you see a password in a configuration file, be sure to substitute it with your own. This guide reminds you to do so along the way.

1. Use Ubuntu 22 LTS to create the Linode instance. Ubuntu LTS distributions are a good choice for servers because [they are fully supported with security patches for five years following the release date](https://ubuntu.com/about/release-cycle), or longer with an extended service subscription from Canonical, which develops and maintains Ubuntu.

1. You should execute all commands here as a non-privileged user using "sudo" to gain access to privileged commands. It’s much safer to use sudo than execute commands as root since the former gives you an audit trail of each privileged command. [Make sure sudo is properly configured to allow root access before beginning this guide](https://www.linode.com/docs/guides/how-to-add-and-remove-sudo-access-in-ubuntu/).

With those caveats in mind, you can move on to building your email server.


### Step 1: Linode Server Creation

1. [Log in to your Linode account](https://login.linode.com/login) and click **Create** to set up a virtual server.

    This project uses the following specifications, all of which are sane starting points for an email server serving a small to medium enterprise:

    - Ubuntu 22.04 LTS image
    - us-west region (For this one, choose the Linode location closest to your users)
    - Dedicated CPU plan of 8GB Linode / 8 GB RAM / 4 vCPUs / 160 GB disk / 5 TB transfer

1. For the Linode label, this project uses `mail.linoderocks.com`. Substitute your hostname here.


1. Set a strong root password and add an ssh key. [This allows you to log in without a password using key authentication](https://www.linode.com/docs/guides/use-public-key-authentication-with-ssh/).

4. [Set the system's timezone using timedatectl](https://www.hostinger.com/tutorials/how-to-change-timezone-in-ubuntu/) so you can read logs in your local timezone. Without this step, the server timestamps all log entries using UTC.

1. You can skip the virtual LAN (VLAN) setup unless you're adding the server to an existing private-cloud instance at Linode.

1. Enable backups for your server. This is strongly recommended.

1. Once you've made all your configuration choices and clicked provision, you may see a warning message as shown below:

    {{< note type="warning" >}}
    SMTP ports may be restricted on this Linode. Need to send email? Review our [mail server guide](https://www.linode.com/docs/email/best-practices/running-a-mail-server/), then [open a support ticket](https://cloud.linode.com/support/tickets).
    {{< /note >}}

    **<--Screenshot here-->**

1. Once setup completes, choose SSH or LISH virtual console access.

1. You should now be at the root command line. In case the Ubuntu setup routine did not ask you to create an ordinary user account, you can do so now. Ubuntu has both `adduser` and `useradd` commands. This guide uses both, but for now, you should know that of the two, `useradd` is a lower-level option and offers the simplest way to add a user to a second group.

    To add an account for "jane" (or whomever) to the sudo group, allowing privileged commands from a non-privileged account, use the following command:

    ```command
    useradd -m jane -G sudo
    ```

1. Reboot the server and log in as user "jane".

1. Update installed packages and the operating system using the following command:

    ```command
    sudo apt update && sudo apt upgrade -y && sudo apt dist-upgrade -y && sudo apt autoremove -y
    ```

1. Configure the Domain Name System (DNS). Although this may seem unrelated to email, working DNS is the *single most important requirement in this guide*. DNS misconfiguration is a very common source of delivery problems.

1. Email servers require at least two DNS records:

    - An "A" record to bind a hostname like `mail.linoderocks.com` to an IPv4 address.
    - An "MX" (Mail eXchanger) record indicates this server handles email for this domain.

    You probably also want to add an "AAAA" record to bind `mail.linoderocks.com` to an IPv6 address.

1. Linode offers free DNS service. Follow these steps:

    - Click the **Domains** menu at the left of the main dashboard.
    - Create a domain with your domain name (e.g., `linoderocks.com`).
    - Add A, MX, and any other records as needed.
    - Update your domain registration (at Linode or another registrar) to point to the NS records Linode provides.

    **<--Screenshot here-->**

    Linode does not actually block SMTP ports in the us-west data center, so it’s safe to ignore this warning. If your data center does block inbound traffic on TCP ports `25`, `465`, or `587`, go ahead and open a support ticket asking that inbound and outbound access to these ports be opened for your server.

1. (Optional, but recommended) You can update your reverse DNS (RDNS) information so that at least one of your server’s IP addresses points back to the hostname `mail.linoderocks.com`.

1. To edit RDNS, follow these steps:

    - Click on the Linodes tab of the main Linode dashboard.
    - Select the **Network** tab.
    - In the **IP addresses** section on the right, you can set RDNS for each IP address. Each RDNS setting creates a pointer (PTR) record that associates an IP address with a hostname.

1. Before proceeding further, it's crucial to verify that the DNS records for your server are working correctly. You can use the "dig" tool to validate each record. Here are example commands to verify the A, AAAA, MX, and PTR records exist for the server:


    - To validate the A record for `mail.linoderocks.com`:

        ```command
        dig +short -t a mail.linoderocks.com
        ```

    - To validate the AAAA record for `mail.linoderocks.com`:

        ```command
        dig +short -t aaaa mail.linoderocks.com
        ```

    - To validate the MX record for `linoderocks.com`:

        ```command
        dig +short -t mx linoderocks.com
        ```

    - To validate the PTR record for the IPv6 address, `2600:3c01::f03c:93ff:fefd:e763`:

        ```command
        dig +short -x 2600:3c01::f03c:93ff:fefd:e763
        ```


### Step 2: Install Postfix

1. Install the Postfix SMTP server package using the command below:

    ```command
    sudo apt install postfix
    ```

    The installer prompts you to pick a server type, the default option is **Internet Site**. Enter a hostname, such as `mail.linoderocks.com`, and optionally choose whether to restart services.

1. As an aside: When you upgrade Postfix in the future, you may encounter the same setup screen again. Choose **No configuration** this time to retain your current settings.

   **<--Screenshot here-->**

1. After the installation completes, verify that you have the correct version of Postfix:

    ```command
    sudo postconf mail_version
    ```

    The version, 3.6.4, is displayed which is standard on Ubuntu 22 LTS.

    ```output
    mail_version = 3.6.4
    ```

1. Verify that Postfix is listening for incoming connection attempts:

    ```command
    sudo ss -lnpt | grep master
    ```

    The following output is displayed:

    ```output
    $ sudo ss -lnpt | grep master
    LISTEN 0      100          0.0.0.0:25        0.0.0.0:*    users:(("master",pid=79013,fd=13))
    LISTEN 0      100             [::]:25           [::]:*    users:(("master",pid=79013,fd=14))
    ```

    The lines in the output above indicate that the Postfix server is listening for incoming connections on TCP port `25` for both IPv4 and IPv6 on any IP address.

1. Verify that your server can make outbound SMTP connections:

    ```command
    sudo nc gmail-smtp-in.l.google.com 25
    ```

    You should see the following output:

    ```output
    $ sudo nc gmail-smtp-in.l.google.com 25
    220 mx.google.com ESMTP s4-20020a17090ad48400b0022bb99803d9si6350891pju.164 - gsmtp
    ```

    If you see the above response, you're all set. If not, check internal and/or firewall rules to ensure outbound TCP port `25` is allowed. You can exit this session by pressing <kbd>Ctrl</kbd> + <kbd>C</kbd>.

1. Set the hostname in Postfix. Open the main Postfix configuration file:

    ```command
    sudo vi /etc/postfix/main.cf
    ```

    Find the `myhostname` parameter and set it to the desired hostname.

    ```command
    myhostname = mail.linoderocks.com
    ```

    Save and close the file. Then reload Postfix:

    ```command
    sudo systemctl reload postfix
    ```

1. Update the `/etc/aliases` file to receive messages from the system itself.

    ```command
    sudo vi /etc/aliases
    ```

    Edit the file to set `root` to a real address where you can receive mail.

    ```command
    root:   david@linoderocks.com
    ```

    Save and close the file. Then rebuild the alias database:

    ```command
    sudo newaliases
    ```

1. Verify that the system can send an outgoing message to an external address where you can receive email.

    ```command
    echo "test email" | sudo sendmail someuser@gmail.com
    ```

    Verify that you received the message on the remote end. If not, you may need to check `/var/log/mail.log` for troubleshooting.


### Step 3: Letsencrypt and Nginx

As configured so far, Postfix does not encrypt traffic in flight. To avoid having traffic intercepted, enable Transport Layer Security (TLS) to set up encrypted tunnels between mail clients and your server. TLS relies on certificates, which in turn require a working Web server and access to the free [Letsencrypt](https://letsencrypt.org/) service.

1. Install `certbot`, a tool that automates Letsencrypt certificate creation and maintenance.

    ```command
    sudo apt install certbot
    ```

1. Install the Nginx web server, which is required for Letsencrypt setup and later for PostfixAdmin. This guide uses the [Nginx](https://nginx.org/) web server:


    ```command
    sudo apt install nginx python3-certbot-nginx
    ```

1. Define a virtual host for Nginx by creating a file `/etc/nginx/conf.d/mail.linoderocks.com.conf`.

    ```command
    sudo vi /etc/nginx/conf.d/mail.linoderocks.com.conf
    ```

    Add the following contents to the file, replacing `linoderocks.com` with your domain name:

    {{< file "/etc/nginx/conf.d/mail.linoderocks.com.conf" conf >}}
    server {
      listen 80;
      listen [::]:80;
      server_name mail.linoderocks.com;

      root /usr/share/nginx/html/;

      location ~ /.well-known/acme-challenge {
        allow all;
      }
    }
    {{< /file >}}

    Ensure that the `/usr/share/nginx/html` directory exists by creating it if necessary.

    ```command
    sudo mkdir -p /usr/share/nginx/html
    ```

1. Restart Nginx to load the new virtual host configuration and verify that it is running.

    ```command
    sudo systemctl restart nginx
    sudo systemctl status nginx
    ```

1. Generate a Letsencrypt certificate. Test your setup by including the `--dry-run` parameter in the certificate request, replacing `linoderocks.com` with your domain name.

    ```command
    sudo certbot certonly --dry-run -a nginx --agree-tos --no-eff-email --staple-ocsp --email postmaster@linoderocks.com -d mail.linoderocks.com
    ```

    If the response indicates that the dry run was successful, proceed to obtain the certificate for real by running the same command without the `--dry-run` switch.

    ```command
    sudo certbot certonly -a nginx --agree-tos --no-eff-email --staple-ocsp --email postmaster@linoderocks.com -d mail.linoderocks.com
    ```

    You should get a response indicating success. Note the locations of the certificate and key files indicated in the success response.

    ```output
    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/mail.linoderocks.com/fullchain.pem
    Key is saved at:         /etc/letsencrypt/live/mail.linoderocks.com/privkey.pem
    This certificate expires on 2023-05-09.
    These files will be updated when the certificate renews.
    Certbot has set up a scheduled task to automatically renew this certificate in the background.
    ```

1. Configure Postfix to use the newly created certificate and key. Open the Postfix configuration file.

    ```command
    sudo vi /etc/postfix/main.cf
    ```

    Find the `smtpd_tls_cert_file` parameter and replace the next two lines as follows, replacing `linoderocks.com` with your domain name.

    ```command
    # TLS parameters
    smtpd_tls_cert_file=/etc/letsencrypt/live/mail.linoderocks.com/fullchain.pem
    smtpd_tls_key_file=/etc/letsencrypt/live/mail.linoderocks.com/privkey.pem
    smtpd_tls_loglevel = 1
    smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
    ```

    If the following lines are not already present, add these lines to `main.cf` to enable TLS transport and enforce TLSv1.2 or TLSv1.3.

    {{< note >}}
    TLS prior to version 1.2 and all versions of Secure Sockets Layer (SSL) are insecure, and you should disallow them.
    {{< /note >}}

    ```command
    # Enable TLS Encryption when Postfix sends outgoing emails
    smtp_tls_security_level = may
    smtp_tls_loglevel = 1
    smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache

    # Enforce TLSv1.2 or TLSv1.3
    smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtp_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtp_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    ```

1. Restart Postfix to apply the changes.

    ```command
    sudo systemctl restart postfix
    ```

### Step 4: Submission

To enable mail clients to submit outgoing mail to your server using the submission protocol instead of SMTP, follow the steps below. This is necessary because many ISPs block SMTP (TCP port `25`) but allow outgoing submission connections (TCP ports `465` and/or `587`). Additionally, separating SMTP and submission functions can help with troubleshooting.

1. Open the `/etc/postfix/master.cf` file for editing.

    ```command
    sudo vi /etc/postfix/master.cf
    ```

1. Add the following lines to enable the submission protocol.

    ```command
    submission     inet     n    -    y    -    -    smtpd
    -o syslog_name=postfix/submission
    -o smtpd_tls_security_level=encrypt
    -o smtpd_tls_wrappermode=no
    -o smtpd_sasl_auth_enable=yes
    -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
    -o smtpd_recipient_restrictions=permit_mynetworks,permit_sasl_authenticated,reject
    -o smtpd_sasl_type=dovecot
    -o smtpd_sasl_path=private/auth
    ```

    If you or your users run Outlook and need to use the Secure SMTP (smtps) protocol on TCP port `465`, add the following lines as well:

    ```command
    smtps     inet  n       -       y       -       -       smtpd
    -o syslog_name=postfix/smtps
    -o smtpd_tls_wrappermode=yes
    -o smtpd_sasl_auth_enable=yes
    -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
    -o smtpd_recipient_restrictions=permit_mynetworks,permit_sasl_authenticated,reject
    -o smtpd_sasl_type=dovecot
    -o smtpd_sasl_path=private/auth
    ```

1. Save and close the file.

1. Restart Postfix to apply the changes.

    ```command
    sudo systemctl restart postfix
    ```

1. Verify that Postfix is now listening on port `587` (submission) and optionally on port `465` (smtps) on all IPv4 and IPv6 addresses.

    ```command
    sudo ss -lnpt | grep master
    ```

    The output should include lines similar to the following:

    ```output
    LISTEN 0      100          0.0.0.0:25        0.0.0.0:*    users:(("master",pid=83541,fd=13))
    LISTEN 0      100          0.0.0.0:587       0.0.0.0:*    users:(("master",pid=83541,fd=18))
    LISTEN 0      100          0.0.0.0:465       0.0.0.0:*    users:(("master",pid=83541,fd=22))
    LISTEN 0      100             [::]:25           [::]:*    users:(("master",pid=83541,fd=14))
    LISTEN 0      100             [::]:587          [::]:*    users:(("master",pid=83541,fd=19))
    LISTEN 0      100             [::]:465          [::]:*    users:(("master",pid=83541,fd=23))
    ```

### Step 5: Dovecot

The Postfix server allows your new server to send outgoing messages, and to receive emails from others. However, you need a different server – *Dovecot* – for your clients to retrieve mail from the server. Follow the steps below:

1. Install Dovecot using the following command:

    ```command
    sudo apt install dovecot-core dovecot-imapd
    sudo apt install dovecot-core dovecot-imapd dovecot-pop3d
    ```

    The `dovecot-pop3d` package is optional. Unless you have users who specifically require the older POP3 protocol, it's recommended to use IMAP instead.


1. You can verify the Dovecot installation by running the following command:

    ```command
    dovecot --version
    ```

    For Ubuntu 22 LTS, the Dovecot version is 2.3.16.

1. Configure IMAP and/or POP protocols by opening the file `/etc/dovecot/dovecot.conf` and adding the following line under `Enable installed protocols`:

    ```command
    protocols = imap lmtp pop3
    ```

    LMTP is explained in the [next section](/docs/guides/how-to-setup-an-email-server/#step-6-local-message-storage-lmtp). You can omit `pop3` if you're only running IMAP. Save and close the file.


1. Set the mail folder location and storage type by editing the file `/etc/dovecot/conf.d/10-mail.conf`.

    ```command
    sudo vi /etc/dovecot/conf.d/10-mail.conf
    ```

    - Find the line below:

      ```command
      mail_location = mbox:~/mail:INBOX=/var/mail/%u
      ```

    - Change mbox to `Maildir`:

      ```command
      mail_location = maildir:~/Maildir
      ```

    - Save and close the file.

1. Add the Dovecot user to the `mail` group to ensure proper permissions.

    ```command
    sudo adduser dovecot mail
    ```

    It should display the following output:

    ```output
    Adding user `dovecot' to group `mail' ...
    Adding user dovecot to group mail
    Done.
    ```

### Step 6: Local Message Storage (LMTP)

Because Postfix also uses `mbox` and not `Maildir` by default, you need to do some additional configuration to ensure messages land in Dovecot in `Maildir` format. Instead of using Postfix’s built-in local delivery agent (LDA), which by default uses mbox, instead configure LMTP, a local version of SMTP, to deliver messages to Dovecot in `Maildir` format.

1. Install LMTP by running the following command:

    ```command
    sudo apt install dovecot-lmtpd
    ```

1. Open the Dovecot 10-master.conf file:

    ```command
    sudo vi /etc/dovecot/conf.d/10-master.conf
    ```

1. Search for the following section:

    ```command
    service lmtp {
      unix_listener lmtp {
        #mode = 0666
      }
    }
    ```

    Replace it with the following code, ensuring the opening and closing braces match.

    ```command
    service lmtp {
      unix_listener /var/spool/postfix/private/dovecot-lmtp {
        mode = 0600
        user = postfix
        group = postfix
      }
    }
    ```

1. At the end of the file, add the following section to allow PostfixAdmin to read statistics from Dovecot.

    ```command
    service stats {
      unix_listener stats-reader {
        user = www-data
        group = www-data
        mode = 0660
      }
      unix_listener stats-writer {
        user = www-data
        group = www-data
        mode = 0660
      }
    }
    ```

1. Enable Simple Authentication and Security Layer (SASL) communications between Postfix and Dovecot. In the same file, `/etc/dovecot/conf.d/10-master.conf`, locate the line beginning with `service auth` and comment out the existing `unix_listener` line. Add the following section for Postfix:

    ```command
    service auth {
      unix_listener /var/spool/postfix/private/auth {
        mode = 0660
        user = postfix
        group = postfix
      }
    }
    ```

    **<--Screenshot here-->**

    {{< note type="warning" >}}
    Ensure the file maintains matching sets of opening and closing curly braces. The vi editor’s `%` key can help with this by jumping between sets of matched braces. If there is a mismatched set, dovecot does not start or restart. If you get an error when starting or restarting Dovecot, check `/var/log/syslog` to find the offending line in the `10-master.conf` configuration file.
    {{< /note >}}

1. Save and close the file.

1. Add the Nginx user, `www-data`, to the dovecot group and grant permissions using ACLs.

    ```command
    sudo gpasswd -a www-data dovecot
    sudo apt install acl
    sudo setfacl -R -m u:www-data:rwx /var/run/dovecot/stats-reader /var/run/dovecot/stats-writer
    ```

1. Restart the Dovecot service using the following command:

    ```command
    sudo systemctl restart dovecot
    ```

1. Open the main Postfix configuration file using the vi editor:

    ```command
    sudo vi /etc/postfix/main.cf
    ```

1. At the end of the file, add the following two lines:

    ```command
    mailbox_transport = lmtp:unix:private/dovecot-lmtp
    smtputf8_enable = no
    ```

    The first line tells Postfix to use a Unix socket to communicate over LMTP to the Dovecot service you just created. The second line disables [an extension for internationalized mail](https://www.rfc-editor.org/rfc/rfc6531) that Dovecot doesn’t support as of version 2.3.16, the version included with Ubuntu 22 LTS.


1. Save and close the file.

### Step 7: Dovecot Authentication and Encryption

Just as you configured Postfix to use TLS to encrypt Postfix data in transit, you also need to do the same for Dovecot traffic. Follow the below steps:

1. Open the `/etc/dovecot/conf.d/10-auth.conf` file:

    ```command
    sudo vi /etc/dovecot/conf.d/10-auth.conf
    ```

1. Disable plaintext authentication when TLS encryption is not used.

    - Uncomment the following line:

        ```command
        disable_plaintext_auth = yes
        ```

    - Add the `login` authentication method. Find the line starting with `auth_mechanisms` and add a `login` to the list:

        ```command
        auth_mechanisms = plain login
        ```

    - Save and close the file.

1. Enable the TLS encryption.

    - Open the `/etc/dovecot/conf.d/10-ssl.conf` file.

        ```command
        sudo vi /etc/dovecot/conf.d/10-ssl.conf
        ```


        ```command
        ssl = required
        ```

    - Point to the Let's Encrypt certificate and key files generated during Postfix configuration. Replace `mail.linoderocks.com` with your hostname and domain name. Preserve the `<` character before each filename; Dovecot uses it to read each file.

        ```command
        ssl_cert = </etc/letsencrypt/live/mail.linoderocks.com/fullchain.pem
        ssl_key = </etc/letsencrypt/live/mail.linoderocks.com/privkey.pem
        ```

1. Set the server to prefer its own ciphers to protect email. With this change, the server determines the order in which to attempt different ciphers. This way, you are not at the mercy of a client that starts with a weak cipher.

    - Find the `ssl_prefer_server_ciphers` parameter and change it from `no` to `yes`.

        ```command
        ssl_prefer_server_ciphers = yes
        ```

    - Set the minimum TLS protocol version to TLSv1.2. Uncomment the following line:

        ```command
        ssl_min_protocol = TLSv1.2
        ```

    - Save and close the file.

1. Disable support for Federal Information Processing Standards (FIPS), a set of US government security standards.


    - Open the `/etc/ssl/openssl.cnf` file.

        ```command
        sudo vi /etc/ssl/openssl.cnf
        ```

    - Find and comment the line that begins with `providers`:

        ```command
        #providers = provider_sect
        ```

    - Save and close the file.

    The version of OpenSSL included with Ubuntu 22 LTS, 3.0.2, supports FIPS by default – but Dovecot doesn’t support these standards. If you leave FIPS enabled, you’re likely to see errors like the following in your log files:

    ```output
    imap-login: Error: Failed to initialize SSL server context: Can't load SSL certificate: error:25066067:DSO support routines:dlfcn_load:could not load the shared library: filename(libproviders.so)
    ```

1. Restart Postfix and Dovecot using the following commands:

    ```command
    sudo systemctl restart postfix
    sudo systemctl restart dovecot
    ```

### Step 8: MariaDB

Since you are running your server in virtual mode – with domains, users, and aliases existing independent of the underlying operating system – you need a place to store account data. This guide uses [MariaDB](https://mariadb.com/), an unencumbered, open-source fork of the venerable [MySQL](https://www.mysql.com/) database, for storing mail accounts and related info. MariaDB is also a requirement for PostfixAdmin, the graphical management tool you install in the next step.

1. To begin, install the MariaDB server and client packages.

    ```command
    sudo apt install mariadb-server mariadb-client
    ```

1. The installation routine should conclude by starting MariaDB. You can verify this with a `status` command.

    ```command
    sudo systemctl status mariadb
    ```

    You should see output something like the below:

    ```output
    ● mariadb.service - MariaDB 10.5.12 database server
      Loaded: loaded (/lib/systemd/system/mariadb.service; enabled; vendor preset: enabled)
      Active: active (running) since Wed 2023-06-21 14:30:00 PDT; 3s ago
        Docs: man:mariadbd(8)
              https://mariadb.com/kb/en/library/systemd/
    Main PID: 12345 (mariadbd)
      Status: "Taking your SQL requests now..."
        Tasks: 31 (limit: 2345)
      Memory: 51.2M
      CGroup: /system.slice/mariadb.service
              └─12345 /usr/sbin/mariadbd
    ```

    If MariaDB isn't running, you can launch it using the following command:

    ```command
    sudo systemctl start mariadb
    ```

1. Enable MariaDB to start every time the system reboots.

    ```command
    sudo systemctl enable mariadb
    ```

1. It's important to secure the database. The MariaDB server includes a script for this.

    ```command
    sudo mysql_secure_installation
    ```

1. When prompted for a password, press Enter as there isn't one set yet. You can safely answer `no` to the next question about unix_socket authentication since this is already set. However, reply `Y` to the next question to set a root password for database access. Choose a strong and memorable password; a password manager program can help with this.

    <**--Screenshot here**-->

1. Answer `Y` to all remaining questions, which disable anonymous access, disable remote access (so logins only work from the same server), drop the test database, and flush database privileges. Your database server is now secured against the most common attacks.


### Step 9: PostfixAdmin

PostfixAdmin is a simple management tool for Postfix/Dovecot that simplifies email administration tasks. After installing PostfixAdmin, you can manage your domains, users, and alias accounts from any web browser.

While PostfixAdmin makes email server management easy, installation takes multiple steps. None of them are difficult. This guide breaks down the instructions into several subsections explained below. Although the configuration steps may seem like a lot, bear in mind that most of the following steps are required for virtual email support, with or without a graphical management interface.

#### Step 9a: DNS Configuration

Even though PostfixAdmin runs on the same host, use a different hostname such as `postfixadmin.linoderocks.com` for email management. If you do this, you also need to add DNS A and/or AAAA records for this new hostname. If you’re using Linode as your DNS provider, you can do this in the **Domains** menu at the left of the Linode dashboard, the same as you did in [Step 1](/docs/guides/how-to-setup-an-email-server/#step-1-linode-server-creation). You can point `postfixadmin.linoderocks.com` to the same IP address(es) you are using for `mail.linoderocks.com`.

#### Step 9b: Download the Latest PostfixAdmin

To ensure the best experience with PostfixAdmin and avoid potential issues, it is recommended to install it from the GitHub repository instead of using the Ubuntu package. Here's why:

- Upgrades and compatibility: The included PostfixAdmin version in Ubuntu packages may not always be up-to-date with the latest features and bug fixes. Additionally, upgrades to the underlying Ubuntu operating system can potentially break the included version.

- Avoiding login errors: The Ubuntu package version of PostfixAdmin may sometimes result in "Invalid token!" errors when attempting to log in. Installing from the GitHub repository can help mitigate these issues and provide a smoother experience.

- Consistency with Nginx: Since you have already installed Nginx as your web server, the Ubuntu package version of PostfixAdmin may attempt to install and use Apache, which can lead to conflicts and configuration issues. Installing from the GitHub repository ensures consistency and compatibility with Nginx.

To ensure the latest version of PostfixAdmin is installed, follow the steps below to download it from the GitHub repository:

1. Open a terminal or SSH session to your server.

1. Change to the `/tmp` directory using the following command:

    ```command
    cd /tmp
    ```

1. Install the `wget` package if it's not already installed. Run the following command to install it:

    ```command
    sudo apt install wget
    ```

1. Visit the [GitHub page for PostfixAdmin](https://github.com/postfixadmin/postfixadmin/releases) and note the latest release version. As of writing this guide, the current release is version **3.3.13**. If there is a newer release available, substitute `postfixadmin-3.3.13.tar.gz` in the command below with the appropriate filename for the latest release.

    ```command
    wget https://github.com/postfixadmin/postfixadmin/archive/refs/tags/postfixadmin-3.3.13.tar.gz
    ```

1. Once the download is complete, extract the archive and move it to the `/var/www` directory. Use the following commands:

    ```command
    sudo mkdir -p /var/www
    sudo tar xvf postfixadmin-3.3.13.tar.gz -C /var/www
    sudo mv /var/www/postfixadmin-postfixadmin-3.3.13 /var/www/postfixadmin
    ```

1. Remove the downloaded archive file to clean up the `/tmp` directory.

    ```command
    sudo rm postfixadmin-3.3.13.tar.gz
    ```

You now have the latest version of PostfixAdmin downloaded and extracted to the `/var/www/postfixadmin` directory. This ensures you have the most up-to-date features and fixes for managing your email server.

#### Step 9c: Install Required PHP Modules for PostfixAdmin

PostfixAdmin is a PHP-based application and requires several PHP modules to function properly. You can install all the necessary modules with a single command. Run the following command:

```command
sudo apt install php8.1-fpm php8.1-imap php8.1-mbstring php8.1-mysql php8.1-curl php8.1-zip php8.1-xml php8.1-bz2 php8.1-intl php8.1-gmp php8.1-redis
```

These modules provide essential functionality for PostfixAdmin to work properly.

#### Step 9d: Database Initialization

To store email settings, you need to create a MariaDB database for PostfixAdmin and a corresponding user. Follow the steps below:

1. Log in to MariaDB as the root user. Run the following command:

    ```command
    mysql -u root
    ```

1. Create a PostfixAdmin database and user. You can choose any name for the database and user, but for consistency in this guide, use `postfixadmin` for both. Remember to replace `postfixadmin_password` with a strong password of your choice. Execute the following commands:

    ```command
    create database postfixadmin;
    create user 'postfixadmin'@'localhost' identified by 'postfixadmin_password';
    ```

1. Grant all privileges on the `postfixadmin` database to the user you just created. Execute the following command:

    ```command
    grant all privileges on postfixadmin.* to 'postfixadmin'@'localhost';
    ```

1. Flush the MariaDB privileges to ensure that your changes take effect.

    ```command
    flush privileges;
    ```

1. Exit the MariaDB prompt.

    ```command
    exit;
    ```

#### Step 9e: Postfix-MariaDB Integration

In this step, you configure Postfix to send and receive mail on behalf of virtual users and domains, not just those with accounts on the local operating system. This requires installing a package that adds MySQL/MariaDB mapping support to Postfix.

1. Install the postfix-mysql package:

    ```command
    sudo apt install postfix-mysql
    ```

1. Edit the main Postfix configuration file:

    ```command
    sudo vi /etc/postfix/main.cf
    ```

1. Add the following lines to the end of the file:

    ```command
    virtual_mailbox_domains = proxy:mysql:/etc/postfix/sql/mysql_virtual_domains_maps.cf
    virtual_mailbox_maps =
      proxy:mysql:/etc/postfix/sql/mysql_virtual_mailbox_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf
    virtual_alias_maps =
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf
     ```

1. Allow Dovecot to deliver messages to virtual users by adding the following line to the end of the `Postfix main.cf` file.

    ```command
    virtual_transport = lmtp:unix:private/dovecot-lmtp
    ```

    Save and close the `main.cf` file.

1. Create a directory for the virtual domains, users, and aliases you just pointed to using the following command:

    ```command
    mkdir -p /etc/postfix/sql
    ```

1. Create the following six files in the `/etc/postfix/sql` directory, substituting the password you used in the previous step when setting up the `postfixadmin` database. Use appropriate commands such as vi to create and edit each file.

    - The `mysql_virtual_domains_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_domains_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT domain FROM domain WHERE domain='%s' AND active = '1'
      ```

    - The `mysql_virtual_mailbox_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_mailbox_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT domain FROM domain WHERE domain='%s' AND active = '1'
      #query = SELECT domain FROM domain WHERE domain='%s'
      #optional query to use when relaying for backup MX
      #query = SELECT domain FROM domain WHERE domain='%s' AND backupmx = '0' AND active = '1'
      #expansion_limit = 100
      ```

    - The `mysql_virtual_alias_domain_mailbox_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT maildir FROM mailbox,alias_domain WHERE alias_domain.alias_domain = '%d' and mailbox.username = CONCAT('%u', '@', alias_domain.target_domain) AND mailbox.active = 1 AND alias_domain.active='1'
      ```

    - The `mysql_virtual_alias_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_alias_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT goto FROM alias WHERE address='%s' AND active = '1'
      #expansion_limit = 100
      ```

    - The `mysql_virtual_alias_domain_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT goto FROM alias,alias_domain WHERE alias_domain.alias_domain = '%d' and alias.address = CONCAT('%u', '@', alias_domain.target_domain) AND alias.active = 1 AND alias_domain.active='1'
      ```

    - The `mysql_virtual_alias_domain_catchall_maps.cf` file contents are as follows:

      ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf"}
      user = postfixadmin
      password = password
      hosts = localhost
      dbname = postfixadmin
      query = SELECT goto FROM alias,alias_domain WHERE alias_domain.alias_domain = '%d' and alias.address = CONCAT('@', alias_domain.target_domain) AND alias.active = 1 AND alias_domain.active='1'
      ```

1. Lock down the ownership and permissions of the files in the `/etc/postfix/sql` directory so that they are only readable by postfix and root.

    ```command
    sudo chmod 0640 /etc/postfix/sql/*
    sudo setfacl -R -m u:postfix:rx /etc/postfix/sql/
    ```

    During [Postfix installation in step 2](/docs/guides/how-to-setup-an-email-server/#step-2-install-postfix), the `mydestination` parameter may have been set to include the canonical hostname (e.g., `mail.linoderocks.com`). However, since you've enabled virtual users and domains, the canonical hostname is no longer needed.

    - Open the main Postfix configuration file for editing.

      ```command
      sudo vi /etc/postfix/main.cf
      ```

    - Locate the `mydestination` parameter and modify it to remove the canonical hostname entry (e.g., `linoderocks.com`). Keep only the necessary entries, such as `localhost` or any other relevant entries. Save the file and close the editor.

      ```command
      mydestination = $myhostname, localhost.linoderocks.com, localhost
      ```

    - At the end of `main.cf`, add the following four lines to configure Postfix for virtual users, domains, and aliases.

      ```command
      virtual_mailbox_base = /var/vmail
      virtual_minimum_uid = 2000
      virtual_uid_maps = static:2000
      virtual_gid_maps = static:2000
      ```

    - Save and close the `main.cf` file.


1. Create a user named `vmail` with user and group ID `2000`, as defined in the previous step.

    ```command
    sudo adduser vmail --system --group --uid 2000 --disabled-login --no-create-home
    ```

1. Create a base directory for virtual mail and assign ownership to the `vmail` user.

    ```command
    sudo mkdir -p /var/vmail
    sudo chown -R vmail:vmail /var/vmail
    ```

1. Restart the Postfix service to apply the changes.

    ```command
    sudo systemctl restart postfix
    ```


#### Step 9f: Dovecot-MariaDB Integration

As you just did with Postfix, you need to configure Dovecot to work with the `postfixadmin` database. Start by installing the package that enables Dovecot-SQL integration.

1. Install the package by running the following command:

    ```command
    sudo apt install dovecot-mysql
    ```

1. Reconfigure Dovecot to handle virtual users instead of users with system accounts. Open the `10-mail.conf` file.

    ```command
    sudo vi /etc/dovecot/conf.d/10-mail.conf
    ```

    - Find the `mail_location` line and modify it as follows, adding a new `mail_home` parameter for virtual users.

      ```command
      mail_location = maildir:~/Maildir
      mail_home = /var/vmail/%d/%n/
      ```

    - Save and close the file. Now open and edit Dovecot's authentication file.

      ```command
      sudo vi /etc/dovecot/conf.d/10-auth.conf
      ```

    - Locate the `auth_username_format` parameter. If it is set to `%n`, change it to `%Lu` to convert usernames to lowercase characters. This is because, by default, postfix uses the entire email address (e.g., `SomeUser@example.com`) as the username. The `L` converts usernames to lowercase characters (e.g., `someuser@example.com`) before sending them to the database.

      ```command
      auth_username_format = %Lu
      ```

    - Uncomment the following line to enable SQL queries of the MariaDB database.

      ```command
      !include auth-sql.conf.ext
      ```

    - Add the following two lines at the bottom of the file for initial troubleshooting, and then save and close the file. These send login errors to `/var/log/mail.log`. Once you’ve verified that users can log in successfully, it’s OK to delete these lines.


      ```command
      auth_debug = yes
      auth_debug_passwords = yes
      ```

    - Save and close the file.

1. Now, open the `dovecot-sql.conf.ext` file.

    ```command
    sudo vi /etc/dovecot/dovecot-sql.conf.ext
    ```

    - All lines in this file are commented out. You may want to keep the existing comments, which are useful as documentation. Add the following lines at the bottom of the file, making sure to replace the `password` in the `connect` line with the `postfixadmin` database password you created earlier. It’s OK to leave the word `password` as is in the `password_query` line.

      ```command
      driver = mysql

      connect = host=localhost dbname=postfixadmin user=postfixadmin password=password

      default_pass_scheme = ARGON2I

      password_query = SELECT username AS user, password FROM mailbox WHERE username = '%u' AND active='1'

      user_query = SELECT maildir, 2000 AS uid, 2000 AS gid FROM mailbox WHERE username = '%u' AND active='1'

      iterate_query = SELECT username AS user FROM mailbox
      ```

    - Save and close the file. Then restart Dovecot to apply the changes.

      ```command
      sudo systemctl restart dovecot
      ```

#### Step 9g: Access Control Lists (ACLs)

PostfixAdmin uses a `templates_c` directory, and the Nginx web server needs access to that directory. As in [step 6](/docs/guides/how-to-setup-an-email-server/#step-6-local-message-storage-lmtp), you can use ACLs to grant access.


1. Create the `templates_c` directory and set the appropriate permissions.

    ```command
    sudo mkdir -p /var/www/postfixadmin/templates_c
    sudo setfacl -R -m u:www-data:rwx /var/www/postfixadmin/templates_c/
    ```

1. Ensure that the Nginx web server can read the Letsencrypt certificate and key you previously created.

    ```command
    sudo setfacl -R -m u:www-data:rx /etc/letsencrypt/live/ /etc/letsencrypt/archive/
    ```

#### Step 9h: PostfixAdmin Configuration

By default, PostfixAdmin stores configuration data in the `/var/www/postfixadmin/config.inc.php` file. However, to avoid potential conflicts during upgrades, it is recommended to create and edit a separate `config.local.php` file for server-specific settings.

1. Create and open the `config.local.php` file for editing:

    ```command
    sudo vi /var/www/postfixadmin/config.local.php
    ```

1. Add the following content to the `config.local.php` file, replacing `password` with the actual `postfixadmin` database password you previously created.

    ```file {title="/var/www/postfixadmin/config.local.php"}
    <?php
      $CONF['configured'] = true;
      $CONF['database_type'] = 'mysqli';
      $CONF['database_host'] = 'localhost';
      $CONF['database_port'] = '3306';
      $CONF['database_user'] = 'postfixadmin';
      $CONF['database_password'] = 'password';
      $CONF['database_name'] = 'postfixadmin';
      $CONF['encrypt'] = 'dovecot:ARGON2I';
      $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5";
      // @ to silence openbase_dir stuff; see https://github.com/postfixadmin/postfixadmin/issues/171
      if(@file_exists('/usr/bin/doveadm')) {
          $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5"; # debian
    }
    ```

1. Save and close the file.

#### Step 9i: Virtual Web Host

To create a virtual host for PostfixAdmin using Nginx, you can set up a separate Nginx configuration file for the domain. Follow the steps below:

1. Create a new Nginx configuration file for PostfixAdmin.

    ```command
    sudo vi /etc/nginx/sites-available/postfixadmin.linoderocks.com.conf
    ```

1. Insert the following contents into the file, replacing `linoderocks.com` with your actual domain name.

    ```command
    server {
      listen 80;
      server_name postfixadmin.linoderocks.com;

      root /var/www/postfixadmin/public/;
      index index.php index.html;

      access_log /var/log/nginx/postfixadmin_access.log;
      error_log /var/log/nginx/postfixadmin_error.log;

      location / {
          try_files $uri $uri/ /index.php;
      }

      location ~ ^/(.+\.php)$ {
            try_files $uri =404;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include /etc/nginx/fastcgi_params;
        }
    }

    server {
      listen 443 ssl;
      server_name postfixadmin.linoderocks.com;

      root /var/www/postfixadmin/public/;
      index index.php index.html;

      access_log /var/log/nginx/postfixadmin_access.log;
      error_log /var/log/nginx/postfixadmin_error.log;

      location / {
          try_files $uri $uri/ /index.php;
      }

      location ~ ^/(.+\.php)$ {
            try_files $uri =404;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include /etc/nginx/fastcgi_params;
      }
        ssl_certificate  /etc/letsencrypt/live/mail.linoderocks.com/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/mail.linoderocks.com/privkey.pem;
        ssl_session_timeout  5m;
        ssl_protocols  TLSv1.2 TLSv1.3;
    }

    ```

1. Save and close the file.

1. First, you need to update the Letsencrypt certificate and key. Create a symbolic link between the configuration file in `/etc/nginx/sites-available` and `/etc/nginx/sites-enabled`.

    ```command
    sudo ln -s /etc/nginx/sites-available/postfixadmin.linoderocks.com.conf /etc/nginx/sites-enabled/
    ```

   Make sure to replace `linoderocks.com` with your actual domain name in the configuration file.


#### Step 9j: Letsencrypt Update

Update the Let's Encrypt certificate to include the virtual host you just created. Although it is possible to create different Let's Encrypt certificates for each virtual host, you can also use one certificate to validate all hostnames.

1. Rerun the `certbot` command to update the Let's Encrypt certificate and include the virtual host you created. Replace `linoderocks.com` with your domain name. Notice that this time, you're using the `-d` switch twice, once for each virtual host.

    ```command
    sudo certbot certonly -a nginx --staple-ocsp -d mail.linoderocks.com -d postfixadmin.linoderocks.com
    ```

    When prompted, select option `E` to expand the existing certificate to cover multiple hostnames. If the expansion succeeds, the new certificate and private key covers both hostnames.

1. Verify the Nginx configuration using the following command:

    ```command
    sudo nginx -t
    ```

    Ensure that the output indicates a successful configuration as shown below:

    ```output
    nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
    nginx: configuration file /etc/nginx/nginx.conf test is successful
    ```

1. Once you have validated your configuration and ensured there are no errors, reload Nginx to apply the changes.

    ```command
    sudo systemctl reload nginx
    ```

1. Restart Postfix and Dovecot to load the updated certificate.

    ```command
    sudo systemctl restart postfix
    sudo systemctl restart dovecot
    ```

#### Step 9k: Final PostfixAdmin Setup

1. In your web browser, enter the following URL to access the PostfixAdmin setup screen, replacing `linoderocks.com` with your domain name.

    ```command
    https://postfixadmin.linoderocks.com/setup.php
    ```

    Ensure that you have valid A and/or AAAA records in your DNS for `postfixadmin.linoderocks.com`. If the page doesn't load, check the error log in the `/var/log/nginx` directory and/or the main `/var/log/syslog` file for any configuration errors.

1. Once the setup page loads, enter a setup password to proceed.

    <**Screenshot here**>

1. After entering the password, you see a hashed version of it. Copy the entire hashed string, which is used in the PostfixAdmin `config.local.php` file.

    ```command
    $CONF['setup_password'] = '$2y$10$vAuLxxX382702NfI/v8DYu7FQFGji/2nAqzEuLIdR3VTj2otP/Lsa';
    ```

1. Open the PostfixAdmin config file for editing.

    ```command
    sudo vi /var/www/postfixadmin/config.local.php
    ```

1. Paste the setup password string as the last line of the config file.

     <**Screenshot here**>


1. To allow the `www-data` user access to read the Letsencrypt certificate and Dovecot stats, run the following commands:

    ```command
    sudo setfacl -R -m u:www-data:rx /etc/letsencrypt/live/ /etc/letsencrypt/archive/
    sudo setfacl -R -m u:www-data:rwx /var/run/dovecot/stats-reader /var/run/dovecot/stats-writer
    ```

    If you encounter an ARGON2I error later on during the PostfixAdmin account setup, rerun these two commands.

1. Reload the setup page in your browser, and if requested, log in using the setup password you entered earlier. You may encounter some database warnings, but you can ignore them as they pertain to database types not used in this setup.

1. Enter a super-admin password, along with a valid email address, and the new super-admin password.

    <**Screenshot here**>

1. After entering the password, click the link at the bottom of the page to access the main login page. Alternatively, you can use the following login URL:

    ```command
    https://postfixadmin.linoderocks.com/login.php
    ```

#### Step 9l: Virtual Mail Setup in PostfixAdmin

1. Open a web browser and navigate to `https://postfixadmin.linoderocks.com/login.php` (replace `linoderocks.com` with your domain name). Log in using the credentials you previously set up.

1. In the top menu, click on **Domain List** and select **New Domain**. Enter the name of the domain you want to create. It is recommended to include your server's native domain since we are assuming all accounts on this system are virtual. For example, use `linoderocks.com` (replace with your server's domain).

     <**Screenshot here**>

1. You can specify the maximum number of aliases and users per domain. The default is `10` for each, but you can set these values as desired. Use `0` to indicate an unlimited number. Regarding other settings on this page:

    - Since you are setting up a primary server, leave the option for this to be a backup mail exchanger (MX) unchecked.
    - Choose whether to enable or disable the virtual domain. It is recommended to enable the domain unless there are specific reasons to disable it, such as scheduling it to operate within certain dates.
    - Keep the **Default mail aliases** box checked to set up standard management aliases. These aliases are commonly used for administrative and troubleshooting purposes:

        - `abuse@linoderocks.com`
        - `hostmaster@linoderocks.com`
        - `postmaster@linoderocks.com`
        - `webmaster@linoderocks.com`

    - The **Pass Expire** field sets a maximum age for users' passwords in that domain. The default setting of 365 days is recommended, but you can adjust it according to your preferences.

1. Now, you can create your first user account. Click on the **Virtual Lists** menu at the top of the page and select **New Mailbox**.

    <**Screenshot here**>

1. Enter a username and select the domain from the dropdown menu. Since you have only created one virtual domain so far, there is only one option in the menu.

1. Choose a strong password and enter it twice, along with the user's full name.

1. (Optional) Set a quota (maximum storage limit in megabytes) for the user. Leave the **active** and **welcome email** boxes checked unless you have a specific reason to disable them. It is a good practice to enter an alternative email address (preferably from a separate domain on a separate server) for password recovery purposes.


#### Step 9m: Client Setup and Server Validation

1. To validate your email server, add a new account to an email client such as [Mozilla Thunderbird](https://www.thunderbird.net/en-US/), [GNOME Evolution](https://help.gnome.org/users/evolution/stable/), or [Microsoft Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook). While the specific configuration of each client is beyond the scope of this guide, there are a few common settings to check:

    - For sending and receiving emails, use the entire email address as the username (e.g., `someuser@example.com` instead of just `someuser`).
    - For receiving email, specify IMAP on TCP port `993` using TLS/SSL.
    - For sending email, specify either submission on TCP port `587` using STARTTLS or, for Microsoft Outlook clients, TCP port `465` using TLS/SSL.

1. After configuring an account in your mail client, test your setup by sending and receiving emails to and from another address on a different server. You should be able to both receive and send emails using your new account. You now have a working email service.

1. If you encounter any errors during the setup, don't worry. Instead of starting over, check the following log files for specific error messages: `/var/log/mail.log` and `/var/log/syslog`. These log entries should provide clues about the source of the problem. You can also search the web using the specific error message along with "dovecot postfix" to find relevant information and solutions.

1. There are a few housekeeping tasks to complete:

    - In PostfixAdmin, edit the four standard aliases created when you configured a domain. By default, these aliases point to dummy addresses such as `abuse@change-this-to-your.domain.tld`. Now that you have a working email address, you should edit these (under Virtual List/Virtual List) to point to your actual email address.

    - In the `/etc/dovecot/conf.d/10-auth.conf` file, you added two lines for verbose debugging. Both lines begin with the string “auth_debug”. To avoid log bloat, you can comment out or delete both lines and then restart Dovecot.

    - Consider configuring valid Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records in your DNS to combat spam. Optionally, you can also set up a Domain Message Authentication, Reporting & Conformance (DMARC) record to specify how your server handles failed SPF and/or DKIM validations, as well as request reports from other servers. Linode provides a [separate email server guide](https://www.linode.com/docs/guides/configure-spf-and-dkim-in-postfix-on-debian-8/) for SPF, DKIM, and DMARC configuration.

    - Stay vigilant about [security vulnerabilities](https://ubuntu.com/security/notices) by keeping your operating system and server software up to date. Regularly applying patches and updates is crucial for maintaining a secure server.

    - Make regular backups of your server. Consider using [Linode's Backups service](https://www.linode.com/docs/products/storage/backups/), which can automate your backups with a single click.

## Conclusion

You now know how to set up an email server. You know how to put key email protocols to work, and how to integrate them with DNS, databases, and graphical management tools. Properly configured, your new email server can run for years, making it a good pairing with Ubuntu’s LTS run on a Linode. Email represents one of the most useful services you can provide, and Linode’s cloud platform offers an ideal platform on which to provision your next server.