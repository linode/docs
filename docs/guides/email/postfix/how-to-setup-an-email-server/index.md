---
slug: how-to-setup-an-email-server
title: "How to Set up an Email Server using Postfix and Dovecot"
description: "How to set up a mail server using Dovecot and Postfix. Understand what it takes, the benefits and challenges, of running an email server."
authors: ["David Robert Newman"]
contributors: ["David Robert Newman"]
published: 2023-06-12
keywords: ['Set up an email server', 'Dovecot and Postfix', 'MTA mail transfer agent', 'MDA Mail delivery Agent', 'IMAP/POP3 server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
tags: ['mariadb', 'email', 'postfix']
external_resources:
- '[Dovecot](https://dovecot.org/)'
- '[PostfixAdmin](https://postfixadmin.github.io/postfixadmin/)'
- '[GitHub page for PostfixAdmin](https://github.com/postfixadmin/postfixadmin/releases)'
- '[Simple Mail Transfer Protocol (SMTP)](https://www.rfc-editor.org/rfc/rfc5321)'
- '[Post Office Protocol (POP)](https://www.rfc-editor.org/rfc/rfc1939)'
---

Email may be the one true universal app, but no provider’s offering is really "free". Large-scale service providers mine user data for sale to advertisers. Others charge usage fees by the message, user, domain, and/or megabyte. To truly get control over your messaging, the best bet is to run your own email server.

While email server configuration is not trivial, it provides you with much greater privacy and flexibility. You have complete control over which domains and users you host, and how much storage you allot to each. You also gain a deeper knowledge of the key email protocols and how they work together.

This guide walks through how to build an email server at Akamai using [Postfix](https://www.postfix.org/) and [Dovecot](https://dovecot.org/), two popular open source email server packages. You also learn how to set up virtual domains, users, and aliases using [PostfixAdmin](https://postfixadmin.github.io/postfixadmin/), a web-based front end for managing Postfix and Dovecot.

Before delving into the details, first, consider why you wouldn’t want to run your own email server. Setup isn’t difficult, but it is time-consuming. You need to set aside a significant chunk of time (several hours, at minimum) to ensure your server functions properly. You also need to commit to ongoing maintenance of your server, both to keep it regularly patched and to troubleshoot any delivery issues. If you don’t have time for system administration tasks or don’t mind the privacy tradeoffs, consider using a commercial email service instead.

## A Quick Introduction to Email Systems

The email server built in this guide uses just four main protocols:

-   [Simple Mail Transfer Protocol (SMTP)](https://www.rfc-editor.org/rfc/rfc5321)
-   [message submission](https://www.rfc-editor.org/rfc/rfc6409)
-   [Internet Message Access Protocol (IMAP)](https://www.rfc-editor.org/rfc/rfc9051)
-   [Post Office Protocol (POP)](https://www.rfc-editor.org/rfc/rfc1939).

SMTP works for message delivery, optionally from client to server, and always between servers. Clients often use a separate protocol called submission to move messages from mail clients, called *mail user agents* (MUAs), to mail servers, called *mail transfer agents* (MTAs). MTAs always communicate over **SMTP**.

IMAP and POP are *message retrieval* protocols. They operate exclusively between a local mail server and an MUA.

None of the mail protocols encrypt data in transit by themselves. In this guide, learn how to use Transport Layer Security (TLS) mechanisms to build encrypted tunnels between MUAs and your mail server. While your server is capable of TLS-encrypting traffic with other servers, that's only if the remote servers also support TLS. The free [Let's Encrypt](https://letsencrypt.org/) service provides certificates and private keys on which TLS relies.

Postfix is a widely used open source SMTP server, and it’s included in most Linux distributions, including Ubuntu. Similarly, Dovecot is a common IMAP and POP server, and it too is available as an Ubuntu package.

## Before You Begin

Before you begin, it’s important to understand five key assumptions this guide makes:

1.  If you do not already have a virtual machine to use, create a Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

    Use **Ubuntu 24.04 LTS** to create the Linode instance. Ubuntu LTS distributions are a good choice for servers because [they are fully supported with security patches for five years following the release date](https://ubuntu.com/about/release-cycle).

    Select the **Dedicated 8 GB** plan with 4 CPUs, 160 GB storage, and a 5 TB transfer. This is a sane starting point for an email server for a small to medium enterprise.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. Also set the timezone, configure your hostname, create a limited user account, and harden SSH access.

    This guide sets up a mail server called `mail.{{< placeholder "example.tld" >}}`, but you should substitute your own domain name and configure the `/etc/hosts` file as shown:

    ```file {title="/etc/hosts"}
    127.0.0.1 localhost
    {{< placeholder "IPv4_ADDRESS" >}} mail.{{< placeholder "example.tld" >}}
    {{< placeholder "IPv6_ADDRESS" >}} mail.{{< placeholder "example.tld" >}}
    ```

1.  The commands, file contents, and other instructions provided throughout this guide may include example values. These are typically domain names, IP addresses, usernames, passwords, and other values that are unique to you. The table below identifies these example values and explains what to replace them with:

    | Example Values: | Replace With: |
    | -- | -- |
    | `{{< placeholder "example.tld" >}}`| Your custom domain name. |
    | `{{< placeholder "IPv4_ADDRESS" >}}` | Your system's public IPv4 address. |
    | `{{< placeholder "IPv4_ADDRESS" >}}` | Your system's public IPv6 address. |
    | `{{< placeholder "external@email.tld" >}}` | A working external email address. |
    | `{{< placeholder "POSTFIXADMIN_PASSWORD" >}}` | Your PostfixAdmin database user password. |

1.  As a developer, you should already be familiar with the Linux command line and basic networking concepts. Akamai has quick guides on [SMTP](/docs/guides/what-is-smtp/) and [IMAP/POP](/docs/guides/what-are-pop-and-imap/) to bring you up to speed on the way these protocols work.

1.  Although Postfix and Dovecot servers can operate in the *system* or *virtual* mode, only virtual mode is used here. In system mode, only users with local logins can send and receive emails. They do so with lookups against the operating system’s `/etc/passwd` file, and all system mode users reside in a single domain. In contrast, virtual mode allows an unlimited number of domains, users, and aliases, all unrelated to the underlying operating system.

With those caveats in mind, you can move on to building your email server.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Step 1: Configure DNS

1.  Configure the Domain Name System (DNS). Although this may seem unrelated to email, working DNS is the *single most important requirement in this guide*. DNS misconfiguration is a very common source of delivery problems.

1.  Email servers require at least two DNS records:

    -   An **A** record to bind a hostname like `mail.{{< placeholder "example.tld" >}}` to an IPv4 address.
    -   An **MX** (Mail eXchanger) record indicates this server handles email for this domain.
    -   **Optional**: An **AAAA** record to bind `mail.{{< placeholder "example.tld" >}}` to an IPv6 address.

1.  Follow these steps to use Akamai's free DNS service:

    -   Click the **Domains** menu at the left of the main dashboard.
    -   Create a domain with your domain name (e.g., {{< placeholder "example.tld" >}}).
    -   Add **A**, **MX**, and any other records as needed.
    -   Update your domain at your registrar to point to the **NS** records that Akamai provides.

    {{< note >}}
    Linode does not actually block SMTP ports in the us-west data center, so it’s safe to ignore this warning. If your data center does block inbound traffic on TCP ports `25`, `465`, or `587`, go ahead and open a support ticket asking that inbound and outbound access to these ports be opened for your server.
    {{< /note >}}

1.  **Optional**: Update the reverse DNS (RDNS) information so that at least one of your server’s IP addresses points back to the hostname `mail.{{< placeholder "example.tld" >}}`.

1.  Follow these steps to edit RDNS:

    -   Click on the **Linodes** tab of the main dashboard.
    -   Select the **Network** tab.
    -   In the **IP addresses** section, you can set RDNS for each IP address. Each RDNS setting creates a pointer (PTR) record that associates an IP address with a hostname.

1.  Before proceeding further, it's crucial to verify that the DNS records for your server are working correctly. You can use the `dig` tool to validate each record. Here are example commands to verify that the **A**, **AAAA**, **MX**, and **PTR** records exist for the server:

    -   Validate the **A** record for `mail.{{< placeholder "example.tld" >}}`:

        ```command
        dig +short -t a mail.{{< placeholder "example.tld" >}}
        ```

        ```output
        {{< placeholder "IPv4_ADDRESS" >}}
        ```

    -   Validate the **AAAA** record for `mail.{{< placeholder "example.tld" >}}`:

        ```command
        dig +short -t aaaa mail.{{< placeholder "example.tld" >}}
        ```

        ```output
        {{< placeholder "IPv6_ADDRESS" >}}
        ```

    -   Validate the **MX** record for {{< placeholder "example.tld" >}}:

        ```command
        dig +short -t mx {{< placeholder "example.tld" >}}
        ```

        ```output
        10 mail.{{< placeholder "example.tld" >}}.
        ```

    -   Validate the **PTR** record for you compute instance's IPv4 address:

        ```command
        dig +short -x {{< placeholder "IPv4_ADDRESS" >}}
        ```

        ```output
        mail.{{< placeholder "example.tld" >}}.
        ```

    -   Validate the PTR record for your compute instance's IPv6 address:

        ```command
        dig +short -x {{< placeholder "IPv6_ADDRESS" >}}
        ```

        ```output
        mail.{{< placeholder "example.tld" >}}.
        ```

## Step 2: Install Postfix

1.  Install the Postfix SMTP server package using the command below:

    ```command
    sudo apt install postfix
    ```

    The installer prompts you to pick a server type, the default option is **Internet Site**. Enter a hostname, such as `mail.{{< placeholder "example.tld" >}}` and optionally choose whether to restart services.

    {{< note >}}
    You may encounter the same setup screen again when upgrading Postfix in the future. If so, choose **No configuration** to retain your current settings.
    {{< /note >}}

1.  After the installation completes, verify that you have the correct version of Postfix:

    ```command
    sudo postconf mail_version
    ```

    The version displayed (`3.8.6`) is standard on Ubuntu 24.04 LTS:

    ```output
    mail_version = 3.8.6
    ```

1.  Verify that Postfix is listening for incoming connection attempts:

    ```command
    sudo ss -lnpt | grep master
    ```

    The following output is displayed:

    ```output
    LISTEN 0      100          0.0.0.0:25        0.0.0.0:*    users:(("master",pid=2157,fd=13))
    LISTEN 0      100             [::]:25           [::]:*    users:(("master",pid=2157,fd=14))
    ```

    The output above indicates that the Postfix server is listening for incoming connections on TCP port `25` for both IPv4 and IPv6 on any IP address.

1.  Verify that your server can make outbound SMTP connections:

    ```command
    sudo nc gmail-smtp-in.l.google.com 25
    ```

    You should see the following output:

    ```output
    220 mx.google.com ESMTP 00721157ae682-62ccae740b7si23680997b3.287 - gsmtp
    ```

    If not, check internal and/or firewall rules to ensure outbound TCP port `25` is allowed. You can exit this session and return to the terminal prompt by pressing <kbd>CTRL</kbd>+<kbd>C</kbd>.

1.  To set the hostname in Postfix, open the main Postfix configuration file:

    ```command
    sudo nano /etc/postfix/main.cf
    ```

    Find the `myhostname` parameter and set it to the desired hostname.

    ```file {title="/etc/postfix/main.cf" linenostart="37"}
    myhostname = {{< placeholder "mail.example.tld" >}}
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Reload Postfix:

    ```command
    sudo systemctl reload postfix
    ```

1.  Update the `/etc/aliases` file to receive messages from the system itself.

    ```command
    sudo nano /etc/aliases
    ```

    Edit the file to set `root` to a real email address where you can reliably receive mail.

    ```file {title="/etc/aliases" hl_lines="3"}
    # See man 5 aliases for format
    postmaster:    root
    root:   {{< placeholder "external@email.tld" >}}
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Rebuild the alias database:

    ```command
    sudo newaliases
    ```

1.  Verify that the system can send an outgoing message to the external address where you can receive email:

    ```command
    echo "test email" | sudo sendmail {{< placeholder "external@email.tld" >}}
    ```

    Verify that you received the message on the remote end. You should receive an email from `root` with no subject and `test email` as the body content. If not, you may need to check `/var/log/mail.log` for troubleshooting.

## Step 3: Let's Encrypt and Nginx

As configured so far, Postfix does not encrypt traffic in transit. To avoid having traffic intercepted, enable Transport Layer Security (TLS) to set up encrypted tunnels between mail clients and your server. TLS relies on certificates, which in turn require a working Web server and access to the free [Let's Encrypt](https://letsencrypt.org/) service.

1.  Install `certbot`, a tool that automates Let's Encrypt certificate creation and maintenance.

    ```command
    sudo apt install certbot
    ```

1.  Install the [Nginx](https://nginx.org/) web server, which is required for Let's Encrypt setup and later for PostfixAdmin:


    ```command
    sudo apt install nginx
    ```

1.  Install the Python3 Nginx `certbot` plugin:

    ```command
    sudo apt install python3-certbot-nginx
    ```

1.  Define a virtual host for Nginx by creating a file `/etc/nginx/conf.d/mail.{{< placeholder "example.tld" >}}`:

    ```command
    sudo nano /etc/nginx/conf.d/mail.{{< placeholder "example.tld" >}}.conf
    ```

    Add the following contents to the file, replacing {{< placeholder "example.tld" >}} with your domain name:

    ```file {title="/etc/nginx/conf.d/mail.{{< placeholder "example.tld" >}}.conf" lang="conf"}
    server {
      listen 80;
      listen [::]:80;
      server_name mail.{{< placeholder "example.tld" >}};

      root /usr/share/nginx/html/;

      location ~ /.well-known/acme-challenge {
        allow all;
      }
    }
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Ensure that the `/usr/share/nginx/html` directory exists by creating it:

    ```command
    sudo mkdir -p /usr/share/nginx/html
    ```

1.  Restart Nginx to load the new virtual host configuration:

    ```command
    sudo systemctl restart nginx
    ```

1.  Verify that Nginx is running:

    ```command
    sudo systemctl status nginx
    ```

    ```output
    ● nginx.service - A high performance web server and a reverse proxy server
         Loaded: loaded (/usr/lib/systemd/system/nginx.service; enabled; preset: enabled)
         Active: active (running) since Mon 2024-06-10 11:12:29 EDT; 4s ago
    ```

    You can exit this session and return to the terminal prompt by pressing <kbd>CTRL</kbd>+<kbd>C</kbd>.

1.  Before generating a Let's Encrypt certificate, test your setup by including the `--dry-run` parameter in the certificate request. Replace {{< placeholder "external@email.tld" >}} with a real email address where you can reliably receive mail and {{< placeholder "example.tld" >}} with your actual domain name:

    ```command
    sudo certbot certonly --dry-run -a nginx --agree-tos --no-eff-email --staple-ocsp --email {{< placeholder "external@email.tld" >}} -d mail.{{< placeholder "example.tld" >}}
    ```

    ```output
    Saving debug log to /var/log/letsencrypt/letsencrypt.log
    Account registered.
    Simulating a certificate request for mail.{{< placeholder "example.tld" >}}
    The dry run was successful.
    ```

1.  If the response indicates that the dry run was successful, proceed to obtain the certificate for real by running the same command without the `--dry-run` switch:

    ```command
    sudo certbot certonly -a nginx --agree-tos --no-eff-email --staple-ocsp --email {{< placeholder "external@email.tld" >}} -d mail.{{< placeholder "example.tld" >}}
    ```

    You should get a response indicating success:

    ```output
    Saving debug log to /var/log/letsencrypt/letsencrypt.log
    Account registered.
    Requesting a certificate for mail.{{< placeholder "example.tld" >}}

    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/fullchain.pem
    Key is saved at:         /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/privkey.pem
    This certificate expires on 2024-09-08.
    These files will be updated when the certificate renews.
    Certbot has set up a scheduled task to automatically renew this certificate in the background.
    ```

    Note the locations of the certificate and key files indicated in the success response.

1.  Open the Postfix configuration file to configure Postfix to use the newly created certificate and key:

    ```command
    sudo nano /etc/postfix/main.cf
    ```

    Scroll down to the `# TLS parameters` section. First, locate the `smtpd_tls_cert_file` and `smtpd_tls_key_file` parameters, and replace their values with the file locations from `certbot`. If not present, add the remaining highlighted lines to enable TLS transport and enforce TLSv1.2 or TLSv1.3:

    ```file {title="/etc/postfix/main.cf" linenostart="26" hl_lines="2-3,5-6,10-15"}
    # TLS parameters
    smtpd_tls_cert_file=/etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/fullchain.pem
    smtpd_tls_key_file=/etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/privkey.pem
    smtpd_tls_security_level=may
    smtpd_tls_loglevel = 1
    smtpd_tls_session_cache_database = btree:${data_directory}/smtpd_scache
    smtp_tls_CApath=/etc/ssl/certs
    smtp_tls_security_level=may
    smtp_tls_session_cache_database = btree:${data_directory}/smtp_scache
    smtp_tls_loglevel = 1
    # Enforce TLSv1.2 or TLSv1.3
    smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtpd_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtp_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    smtp_tls_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
    ```

    {{< note >}}
    TLS prior to version 1.2 and all versions of Secure Sockets Layer (SSL) are insecure, and you should disallow them.
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart Postfix to apply the changes:

    ```command
    sudo systemctl restart postfix
    ```

## Step 4: Submission

The steps below enable mail clients to submit outgoing mail to your server using the submission protocol instead of SMTP. This is necessary because many ISPs block SMTP (TCP port `25`) but allow outgoing submission connections (TCP ports `465` and/or `587`). Separating SMTP and submission functions can also help with troubleshooting.

1.  Open the `/etc/postfix/master.cf` file for editing.

    ```command
    sudo nano /etc/postfix/master.cf
    ```

    Add the following lines to the end of the file to enable the submission protocol:

    ```file {title="/etc/postfix/master.cf" linenostart="141"}
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

    If you or your users run Outlook and need to use the Secure SMTP (SMTPS) protocol on TCP port `465`, add the following lines as well:

    ```file {title="/etc/postfix/master.cf" linenostart="150"}
    smtps     inet  n       -       y       -       -       smtpd
        -o syslog_name=postfix/smtps
        -o smtpd_tls_wrappermode=yes
        -o smtpd_sasl_auth_enable=yes
        -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
        -o smtpd_recipient_restrictions=permit_mynetworks,permit_sasl_authenticated,reject
        -o smtpd_sasl_type=dovecot
        -o smtpd_sasl_path=private/auth
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart Postfix to apply the changes.

    ```command
    sudo systemctl restart postfix
    ```

1.  Verify that Postfix is now listening on port `587` (submission) and optionally on port `465` (SMTPS) on all IPv4 and IPv6 addresses.

    ```command
    sudo ss -lnpt | grep master
    ```

    The output should include lines similar to the following:

    ```output
    LISTEN 0      100          0.0.0.0:465       0.0.0.0:*    users:(("master",pid=25871,fd=99))
    LISTEN 0      100          0.0.0.0:25        0.0.0.0:*    users:(("master",pid=25871,fd=13))
    LISTEN 0      100          0.0.0.0:587       0.0.0.0:*    users:(("master",pid=25871,fd=95))
    LISTEN 0      100             [::]:465          [::]:*    users:(("master",pid=25871,fd=100))
    LISTEN 0      100             [::]:25           [::]:*    users:(("master",pid=25871,fd=14))
    LISTEN 0      100             [::]:587          [::]:*    users:(("master",pid=25871,fd=96))
    ```

## Step 5: Dovecot

The Postfix server allows your server to send outgoing messages and receive emails from others. However, you need a different server, *Dovecot*, for your clients to retrieve mail from the server.

1.  First, install Dovecot using the following command:

    ```command
    sudo apt install dovecot-core dovecot-imapd
    ```

    {{< note >}}
    POP3 support is optional. However, unless you have users who specifically require the older POP3 protocol, it's recommended to use IMAP. Should POP3 support be required, use the command below:

    ```command
    sudo apt install dovecot-pop3d
    ```
    {{< /note >}}

1.  You can verify the Dovecot installation by running the following command:

    ```command
    dovecot --version
    ```

    For Ubuntu 24.04 LTS, the Dovecot version is `2.3.21`:

    ```output
    2.3.21 (47349e2482)
    ```

1.  Open the `/etc/dovecot/dovecot.conf` file to configure IMAP and/or POP protocols:

    ```command
    sudo nano /etc/dovecot/dovecot.conf
    ```

    Add the following line directly under `# Enable installed protocols`:

    ```file {title="/etc/dovecot/dovecot.conf" lang="conf" linenostart="23" hl_Lines="2"}
    # Enable installed protocols
    protocols = imap lmtp
    !include_try /usr/share/dovecot/protocols.d/*.protocol
    ```

    LMTP is explained in the [next section](/docs/guides/how-to-setup-an-email-server/#step-6-local-message-storage-lmtp).

    {{< note >}}
    If using POP3, change the line to include `pop3`:

    ```file {title="/etc/dovecot/dovecot.conf" lang="conf" linenostart="23" hl_Lines="2"}
    # Enable installed protocols
    protocols = imap lmtp pop3
    !include_try /usr/share/dovecot/protocols.d/*.protocol
    ```
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Set the mail folder location and storage type by editing the file `/etc/dovecot/conf.d/10-mail.conf`.

    ```command
    sudo nano /etc/dovecot/conf.d/10-mail.conf
    ```

    Find the `mail_location = mbox:~/mail:INBOX=/var/mail/%u` line and change it to:

    ```file {title="/etc/dovecot/conf.d/10-mail.conf" lang="conf" linenostart="30"}
    mail_location = maildir:~/Maildir
    ```

    When done press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Add the Dovecot user to the `mail` group to ensure proper permissions.

    ```command
    sudo adduser dovecot mail
    ```

    It should display output similar to the following:

    ```output
    info: Adding user `dovecot' to group `mail' ...
    ```

1.  Verify that the `dovecot` user is added to the `mail` group:

    ```command
    groups dovecot
    ```

    ```output
    dovecot : dovecot mail
    ```

## Step 6: Local Message Storage (LMTP)

Because Postfix also uses `mbox` by default rather than `Maildir`, some additional configuration is necessary to ensure messages enter Dovecot in `Maildir` format. Instead of using Postfix’s built-in local delivery agent (LDA), which defaults to `mbox`, configure LMTP (a local version of SMTP) to deliver messages to Dovecot in `Maildir` format.

1.  First, install LMTP:

    ```command
    sudo apt install dovecot-lmtpd
    ```

1.  Now open the Dovecot `10-master.conf` file:

    ```command
    sudo nano /etc/dovecot/conf.d/10-master.conf
    ```

    -   Search for the following section:

        ```file {title="/etc/dovecot/conf.d/10-master.conf" lang="conf" linenostart="57"}
        service lmtp {
          unix_listener lmtp {
            #mode = 0666
          }

          # Create inet listener only if you can't use the above UNIX socket
          #inet_listener lmtp {
            # Avoid making LMTP visible for the entire internet
            #address =
            #port =
          #}
        }
        ```

        Replace it with the following code, ensuring the opening and closing braces match:

        ```file {title="/etc/dovecot/conf.d/10-master.conf" lang="conf" linenostart="57"}
        service lmtp {
          unix_listener /var/spool/postfix/private/dovecot-lmtp {
            mode = 0600
            user = postfix
            group = postfix
          }
        }
        ```

    -   At the end of the file, add the following section to allow PostfixAdmin to read statistics from Dovecot.

        ```file {title="/etc/dovecot/conf.d/10-master.conf" lang="conf" linenostart="129"}
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

    -   Enable Simple Authentication and Security Layer (SASL) communications between Postfix and Dovecot. Locate the `unix_listener auth-userdb {` line in the `service auth {` section:

        ```file {title="/etc/dovecot/conf.d/10-master.conf" lang="conf" linenostart="84"}
          unix_listener auth-userdb {
            #mode = 0666
            #user =
            #group =
          }

          # Postfix smtp-auth
          #unix_listener /var/spool/postfix/private/auth {
          #  mode = 0666
          #}
        ```

        Make the following adjustments::

        ```file {title="/etc/dovecot/conf.d/10-master.conf" lang="conf" linenostart="84"}
          #unix_listener auth-userdb {
            #mode = 0666
            #user =
            #group =
          #}

          # Postfix smtp-auth
          unix_listener /var/spool/postfix/private/auth {
            mode = 0660
            user = postfix
            group = postifx
          }
        ```

    {{< note type="warning" >}}
    Ensure the file maintains matching sets of opening and closing curly braces. If there is a mismatched set, dovecot does not start or restart. If you get an error when starting or restarting Dovecot, check `/var/log/syslog` to find the offending line in the `10-master.conf` configuration file.
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Add the Nginx user, `www-data`, to the dovecot group and grant permissions using ACLs:

    ```command
    sudo gpasswd -a www-data dovecot
    sudo apt install acl
    sudo setfacl -R -m u:www-data:rwx /var/run/dovecot/stats-reader /var/run/dovecot/stats-writer
    ```

1.  Restart the Dovecot service:

    ```command
    sudo systemctl restart dovecot
    ```

1.  Open the main Postfix configuration file:

    ```command
    sudo nano /etc/postfix/main.cf
    ```

    Add the following two lines to the end of the file:

    ```file {title="/etc/postfix/main.cf" linenostart="54"}
    mailbox_transport = lmtp:unix:private/dovecot-lmtp
    smtputf8_enable = no
    ```

    The first line tells Postfix to use a Unix socket to communicate over LMTP to the Dovecot service you just created. The second line disables [an extension for internationalized mail](https://www.rfc-editor.org/rfc/rfc6531) that Dovecot doesn’t support as of version 2.3.21, the version included with Ubuntu 24.04 LTS.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

## Step 7: Dovecot Authentication and Encryption

Just as you configured Postfix to use TLS to encrypt Postfix data in transit, you need to do the same for Dovecot traffic.

1.  Open the `/etc/dovecot/conf.d/10-auth.conf` file:

    ```command
    sudo nano /etc/dovecot/conf.d/10-auth.conf
    ```

    Uncomment the following line to disable plaintext authentication when TLS encryption is not used:

    ```file {title="/etc/dovecot/conf.d/10-auth.conf" lang="conf" linenostart="10"}
    disable_plaintext_auth = yes
    ```

    To add the `login` authentication method, find the line starting with `auth_mechanisms` and add a `login` to the list:

    ```file {title="/etc/dovecot/conf.d/10-auth.conf" lang="conf" linenostart="100"}
    auth_mechanisms = plain login
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Open the `/etc/dovecot/conf.d/10-ssl.conf` file:

    ```command
    sudo nano /etc/dovecot/conf.d/10-ssl.conf
    ```

    To enable the TLS encryption change the line `ssl = yes` into `ssl =required`:

    ```file {title="/etc/dovecot/conf.d/10-ssl.conf" lang="conf" linenostart="6"}
    ssl = required
    ```

    Point to the Let's Encrypt certificate and key files generated during Postfix configuration. Replace `mail.{{< placeholder "example.tld" >}}` with your hostname and domain name. Preserve the `<` character before each filename as Dovecot uses it to read each file.

    ```file {title="/etc/dovecot/conf.d/10-ssl.conf" lang="conf" linenostart="12"}
    ssl_cert = </etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/fullchain.pem
    ssl_key = </etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/privkey.pem
    ```

    Uncomment the following line to set the minimum TLS protocol version to `TLSv1.2`:

    ```file {title="/etc/dovecot/conf.d/10-ssl.conf" lang="conf" linenostart="62"}
    ssl_min_protocol = TLSv1.2
    ```

    Set the server to prefer its own ciphers to protect email. This ensures the server determines the order in which to attempt different ciphers. This means it's not at the mercy of a client that starts with a weak cipher. Uncomment the `ssl_prefer_server_ciphers` parameter and change it from `no` to `yes`.

    ```file {title="/etc/dovecot/conf.d/10-ssl.conf" lanf="conf" linenostart="75"}
    ssl_prefer_server_ciphers = yes
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Open the `/etc/ssl/openssl.cnf` file:

    ```command
    sudo nano /etc/ssl/openssl.cnf
    ```

    Find and comment out the line beginning with `providers` to disable support for Federal Information Processing Standards (FIPS), a set of US government security standards:

    ```file {title="/etc/ssl/openssl.cnf" linenostart="54"}
    #providers = provider_sect
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    {{< note >}}
    Version 3.0.2 of OpenSSL included with Ubuntu 22.04 LTS supports FIPS by default, but Dovecot doesn’t. If you leave FIPS enabled, you’re likely to see errors like the following in your log files:

    ```output
    imap-login: Error: Failed to initialize SSL server context: Can't load SSL certificate: error:25066067:DSO support routines:dlfcn_load:could not load the shared library: filename(libproviders.so)
    ```
    {{< /note >}}

1.  Restart Postfix and Dovecot using the following commands:

    ```command
    sudo systemctl restart postfix
    sudo systemctl restart dovecot
    ```

## Step 8: MariaDB

Since the server is running in virtual mode, with domains, users, and aliases existing independent of the underlying operating system, you need a place to store account data. This guide uses [MariaDB](https://mariadb.com/), an open source fork of the [MySQL](https://www.mysql.com/) database, for storing mail accounts and related info. MariaDB is also a requirement for PostfixAdmin, the graphical management tool installed in the next step.

1.  To begin, install the MariaDB server and client packages:

    ```command
    sudo apt install mariadb-server mariadb-client
    ```

1.  The installation routine should conclude by starting MariaDB. Verify this with a `status` command:

    ```command
    sudo systemctl status mariadb
    ```

    You should see output similar to the following:

    ```output
    ● mariadb.service - MariaDB 10.11.7 database server
         Loaded: loaded (/usr/lib/systemd/system/mariadb.service; enabled; preset: enable>
         Active: active (running) since Wed 2024-06-12 12:14:09 EDT; 6s ago
    ...
    ```

    Press the <kbd>Q</kbd> key to exit the status output and return to the terminal prompt.

    {{< note >}}
    If MariaDB isn't running, use the following command to launch it:

    ```command
    sudo systemctl start mariadb
    ```
    {{< /note >}}

1.  Enable MariaDB to start every time the system reboots:

    ```command
    sudo systemctl enable mariadb
    ```

    ```output
    Synchronizing state of mariadb.service with SysV service script with /usr/lib/systemd/systemd-sysv-install.
    Executing: /usr/lib/systemd/systemd-sysv-install enable mariadb
    ```

1.  It's important to secure the database, and the MariaDB server includes a script for this:

    ```command
    sudo mysql_secure_installation
    ```

    Answer the questions presented in the following manner. When prompted, set a strong and memorable root password for database access.

    -   **Enter current password for root (enter for none):** <kbd>Enter</kbd>
    -   **Switch to unix_socket authentication [Y/n]** <kbd>N</kbd>
    -   **Change the root password? [Y/n]** <kbd>Y</kbd>
    -   **Remove anonymous users? [Y/n]** <kbd>Y</kbd>
    -   **Disallow root login remotely? [Y/n]** <kbd>Y</kbd>
    -   **Remove test database and access to it? [Y/n]** <kbd>Y</kbd>
    -   **Reload privilege tables now? [Y/n]** <kbd>Y</kbd>

    ```output
    Cleaning up...

    All done!  If you've completed all of the above steps, your MariaDB
    installation should now be secure.

    Thanks for using MariaDB!
    ```

    Your database server is now secured against the most common attacks.

## Step 9: PostfixAdmin

PostfixAdmin is a simple management tool for Postfix/Dovecot that simplifies email administration tasks. After installing PostfixAdmin, you can manage your domains, users, and alias accounts from any web browser.

While PostfixAdmin makes email server management easy, installation takes multiple steps, though none are difficult. This guide breaks down the instructions into several subsections explained below. The configuration steps may seem daunting, but most of them are required for virtual email support, even without a graphical management interface.

### Step 9a: DNS Configuration

Even though PostfixAdmin runs on the same host, use a different hostname such as `postfixadmin.{{< placeholder "example.tld" >}}` for email management. To do so, you need to add DNS **A** and/or **AAAA** records for this new hostname. If you’re using Akamai as your DNS provider, access the **Domains** menu at the left of the Cloud dashboard, the same as in [Step 1](/docs/guides/how-to-setup-an-email-server/#step-1-linode-server-creation). You can point `postfixadmin.{{< placeholder "example.tld" >}}` to the same IP address(es) you are using for `mail.{{< placeholder "example.tld" >}}`.

### Step 9b: Download the Latest PostfixAdmin

To ensure the best experience with PostfixAdmin and avoid potential issues, it is recommended to install it from GitHub instead of the Ubuntu package. Here's why:

-   **Upgrades and Compatibility**: The included PostfixAdmin version in Ubuntu packages may not always be up-to-date with the latest features and bug fixes. Additionally, upgrades to the underlying Ubuntu operating system can potentially break the included version.

-   **Avoiding Login Errors**: The Ubuntu package version of PostfixAdmin may sometimes result in "Invalid token!" errors when attempting to log in. Installing from the GitHub repository can help mitigate these issues and provide a smoother experience.

-   **Consistency with Nginx**: Since Nginx is your web server, the Ubuntu package version of PostfixAdmin may attempt to install and use Apache. This can lead to conflicts and configuration issues. Installing from the GitHub repository ensures consistency and compatibility with Nginx.

To ensure the latest version of PostfixAdmin is installed, follow the steps below to download it from the GitHub repository:

1.  Change to the `/tmp` directory:

    ```command
    cd /tmp
    ```

1.  Install the `wget` package if it's not already installed:

    ```command
    sudo apt install wget
    ```

1.  Visit the [GitHub page for PostfixAdmin](https://github.com/postfixadmin/postfixadmin/releases) and note the latest release version. As of writing this guide, the current release is version **3.3.13**. If there is a newer release available, substitute `3.3.13` in the command below with the appropriate version for the latest release:

    ```command
    wget https://github.com/postfixadmin/postfixadmin/archive/refs/tags/postfixadmin-3.3.13.tar.gz
    ```

1.  Once the download is complete, use the following commands to extract the archive and move it to the `/var/www` directory:

    ```command
    sudo mkdir -p /var/www
    sudo tar xvf postfixadmin-3.3.13.tar.gz -C /var/www
    sudo mv /var/www/postfixadmin-postfixadmin-3.3.13 /var/www/postfixadmin
    ```

1.  Remove the downloaded archive file to clean up the `/tmp` directory.

    ```command
    sudo rm postfixadmin-3.3.13.tar.gz
    ```

You now have the latest version of PostfixAdmin downloaded and extracted to the `/var/www/postfixadmin` directory. This ensures you have the most up-to-date features and fixes for managing your email server.

### Step 9c: Install Required PHP Modules for PostfixAdmin

PostfixAdmin is a PHP-based application, and it requires several PHP modules to function properly. You can install all the necessary modules with a single command:

```command
sudo apt install php8.3-fpm php8.3-imap php8.3-mbstring php8.3-mysql php8.3-curl php8.3-zip php8.3-xml php8.3-bz2 php8.3-intl php8.3-gmp php8.3-redis
```

These modules provide essential functionality for PostfixAdmin to work properly.

### Step 9d: Database Initialization

To store email settings, you need to create a MariaDB database for PostfixAdmin and a corresponding user.

1.  First, log in to MariaDB as the root user:

    ```command
    sudo mysql -u root
    ```

    ```output
    Welcome to the MariaDB monitor.  Commands end with ; or \g.
    Your MariaDB connection id is 41
    Server version: 10.11.7-MariaDB-2ubuntu2 Ubuntu 24.04

    Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    MariaDB [(none)]>
    ```

1.  Next, create a PostfixAdmin database and name it `postfixadmin`:

    ```command
    create database postfixadmin;
    ```

    ```output
    Query OK, 1 row affected (0.000 sec)
    ```

1.  Now create a PostfixAdmin user and also name it `postfixadmin`. Remember to replace {{< placeholder "POSTFIXADMIN_PASSWORD" >}} with a strong password of your choice:

    ```command
    create user 'postfixadmin'@'localhost' identified by '{{< placeholder "POSTFIXADMIN_PASSWORD" >}}';
    ```

    ```output
    Query OK, 0 rows affected (0.001 sec)
    ```

    {{< note >}}
    While you can name the database and user anything, for consistency this guide use `postfixadmin` for both.
    {{< /note >}}

1.  Grant all privileges on the `postfixadmin` database to the user you just created:

    ```command
    grant all privileges on postfixadmin.* to 'postfixadmin'@'localhost';
    ```

    ```output
    Query OK, 0 rows affected (0.001 sec)
    ```

1.  Flush the MariaDB privileges to ensure the changes take effect:

    ```command
    flush privileges;
    ```

    ```output
    Query OK, 0 rows affected (0.001 sec)
    ```

1.  Exit the MariaDB prompt:

    ```command
    exit;
    ```

    ```output
    Bye
    ```

### Step 9e: Postfix-MariaDB Integration

Configure Postfix to send and receive mail on behalf of virtual users and domains, not just those with accounts on the local operating system. This requires installing a package that adds MySQL/MariaDB mapping support to Postfix.

1.  First, install the `postfix-mysql` package:

    ```command
    sudo apt install postfix-mysql
    ```

1.  Now edit the main Postfix configuration file:

    ```command
    sudo nano /etc/postfix/main.cf
    ```

    To allow Dovecot to deliver messages to virtual users, add the following lines to the end of the file:

    ```file {title="/etc/postfix/main.cf" linenostart="56"}
    virtual_mailbox_domains = proxy:mysql:/etc/postfix/sql/mysql_virtual_domains_maps.cf
    virtual_mailbox_maps =
      proxy:mysql:/etc/postfix/sql/mysql_virtual_mailbox_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf
    virtual_alias_maps =
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_maps.cf,
      proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf
    virtual_transport = lmtp:unix:private/dovecot-lmtp
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create a directory for the virtual domains, users, and aliases you just pointed to:

    ```command
    sudo mkdir -p /etc/postfix/sql
    ```

1.  Create the following six files in the `/etc/postfix/sql` directory, substituting the {{< placeholder "POSTFIXADMIN_PASSWORD" >}} you used in the previous step when setting up the `postfixadmin` database.

    -   Create the `mysql_virtual_domains_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_domains_maps.cf
        ```

        The `mysql_virtual_domains_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_domains_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT domain FROM domain WHERE domain='%s' AND active = '1'
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    -   Create the `mysql_virtual_mailbox_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_mailbox_maps.cf
        ```

        The `mysql_virtual_mailbox_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_mailbox_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT domain FROM domain WHERE domain='%s' AND active = '1'
        #query = SELECT domain FROM domain WHERE domain='%s'
        #optional query to use when relaying for backup MX
        #query = SELECT domain FROM domain WHERE domain='%s' AND backupmx = '0' AND active = '1'
        #expansion_limit = 100
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    -   Create the `mysql_virtual_alias_domain_mailbox_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf
        ```

        The `mysql_virtual_alias_domain_mailbox_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT maildir FROM mailbox,alias_domain WHERE alias_domain.alias_domain = '%d' and mailbox.username = CONCAT('%u', '@', alias_domain.target_domain) AND mailbox.active = 1 AND alias_domain.active='1'
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    -   Create the `mysql_virtual_alias_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_alias_maps.cf
        ```

        The `mysql_virtual_alias_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_alias_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT goto FROM alias WHERE address='%s' AND active = '1'
        #expansion_limit = 100
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    -   Create the `mysql_virtual_alias_domain_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_alias_domain_maps.cf
        ```

        The `mysql_virtual_alias_domain_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT goto FROM alias,alias_domain WHERE alias_domain.alias_domain = '%d' and alias.address = CONCAT('%u', '@', alias_domain.target_domain) AND alias.active = 1 AND alias_domain.active='1'
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

    -   Create the `mysql_virtual_alias_domain_catchall_maps.cf` file:

        ```command
        sudo nano /etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf
        ```

        The `mysql_virtual_alias_domain_catchall_maps.cf` file contents are as follows:

        ```file {title="/etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf"}
        user = postfixadmin
        password = {{< placeholder "POSTFIXADMIN_PASSWORD" >}}
        hosts = localhost
        dbname = postfixadmin
        query = SELECT goto FROM alias,alias_domain WHERE alias_domain.alias_domain = '%d' and alias.address = CONCAT('@', alias_domain.target_domain) AND alias.active = 1 AND alias_domain.active='1'
        ```

        When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Lock down the ownership and permissions of the files in the `/etc/postfix/sql` directory so that they are only readable by `postfix` and `root`:

    ```command
    sudo chmod 0640 /etc/postfix/sql/*
    sudo setfacl -R -m u:postfix:rx /etc/postfix/sql/
    ```

1.  During [Postfix installation in step 2](/docs/guides/how-to-setup-an-email-server/#step-2-install-postfix), the `mydestination` parameter may have been set to include the canonical hostname (e.g., `mail.{{< placeholder "example.tld" >}}`). However, since you've enabled virtual users and domains, the canonical hostname is no longer needed. Open the main Postfix configuration file:

    ```command
    sudo nano /etc/postfix/main.cf
    ```

    Locate the `mydestination` parameter and modify it to remove the canonical hostname entry (e.g., {{< placeholder "example.tld" >}}). Keep only the necessary entries, such as `localhost` or any other relevant entries.

    ```file {title="/etc/postfix/main.cf" linenostart="47"}
    mydestination = $myhostname, localhost.{{< placeholder "example.tld" >}}, localhost
    ```

    At the end of the file, add the following four lines to configure Postfix for virtual users, domains, and aliases:

    ```file {title="/etc/postfix/main.cf" linenostart="65"}
    virtual_mailbox_base = /var/vmail
    virtual_minimum_uid = 2000
    virtual_uid_maps = static:2000
    virtual_gid_maps = static:2000
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create a user named `vmail` with user and group ID `2000`, as defined in the previous step:

    ```command
    sudo adduser vmail --system --group --uid 2000 --disabled-login --no-create-home
    ```

    ```output
    info: Adding system user `vmail' (UID 2000) ...
    info: Adding new group `vmail' (GID 2000) ...
    info: Adding new user `vmail' (UID 2000) with group `vmail' ...
    useradd warning: vmail's uid 2000 is greater than SYS_UID_MAX 999
    info: Not creating `/nonexistent'.
    ```

1.  Create a base directory for virtual mail and assign ownership to the `vmail` user:

    ```command
    sudo mkdir -p /var/vmail
    sudo chown -R vmail:vmail /var/vmail
    ```

1.  Restart the Postfix service to apply the changes:

    ```command
    sudo systemctl restart postfix
    ```

### Step 9f: Dovecot-MariaDB Integration

As as with Postfix, you also need to configure Dovecot to work with the `postfixadmin` database.

1.  Start by installing the package that enables Dovecot-SQL integration:

    ```command
    sudo apt install dovecot-mysql
    ```

1.  Open the `10-mail.conf` file to reconfigure Dovecot to handle virtual users instead of users with system accounts:

    ```command
    sudo nano /etc/dovecot/conf.d/10-mail.conf
    ```

    Find the `mail_location` line and add a new `mail_home` parameter for virtual users below it:

    ```file {title="/etc/dovecot/conf.d/10-mail.conf" lang="conf" linenostart="30" hl_lines="2"}
    mail_location = maildir:~/Maildir
    mail_home = /var/vmail/%d/%n/
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Now open Dovecot's authentication file:

    ```command
    sudo nano /etc/dovecot/conf.d/10-auth.conf
    ```

    -   Uncomment the `auth_username_format` line:

        ```file {title="/etc/dovecot/conf.d/10-auth.conf" lang="conf" linenostart="51"}
        auth_username_format = %Lu
        ```

        By default, postfix uses the entire email address (e.g. `UserName@example.tld`) as the username. The `L` converts usernames to lowercase characters (e.g. `username@example.tld`) before sending them to the database.

    -   Uncomment the following line to enable SQL queries of the MariaDB database:

        ```file {title="/etc/dovecot/conf.d/10-auth.conf" lang="conf" linenostart="123"}
        !include auth-sql.conf.ext
        ```

    -   Add the following two lines at the bottom of the file for initial troubleshooting:

        ```file {title="/etc/dovecot/conf.d/10-auth.conf" lang="conf" linenostart="128"}
        auth_debug = yes
        auth_debug_passwords = yes
        ```

        These send login errors to `/var/log/mail.log`. Once you’ve verified that users can log in successfully, it’s OK to delete these lines.

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Now, open the `dovecot-sql.conf.ext` file.

    ```command
    sudo nano /etc/dovecot/dovecot-sql.conf.ext
    ```

    All lines in this file are commented out. You may want to keep the existing comments, which are useful as documentation. Add the following lines at the bottom of the file, making sure to replace the {{< placeholder "POSTFIXADMIN_PASSWORD" >}} in the `connect` line with the `postfixadmin` user's database password you created earlier. However, leave the word `password` as-is in the `password_query` line.

    ```file {title="/etc/dovecot/dovecot-sql.conf.ext" linenostart="145"}
    driver = mysql
    connect = host=localhost dbname=postfixadmin user=postfixadmin password={{< placeholder "POSTFIXADMIN_PASSWORD" >}}
    default_pass_scheme = ARGON2I
    password_query = SELECT username AS user, password FROM mailbox WHERE username = '%u' AND active='1'
    user_query = SELECT maildir, 2000 AS uid, 2000 AS gid FROM mailbox WHERE username = '%u' AND active='1'
    iterate_query = SELECT username AS user FROM mailbox
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart Dovecot to apply the changes.

    ```command
    sudo systemctl restart dovecot
    ```

### Step 9g: Access Control Lists (ACLs)

PostfixAdmin uses a `templates_c` directory, and the Nginx web server needs access to that directory. As in [step 6](/docs/guides/how-to-setup-an-email-server/#step-6-local-message-storage-lmtp), you can use ACLs to grant access.

1.  Create the `templates_c` directory and set the appropriate permissions:

    ```command
    sudo mkdir -p /var/www/postfixadmin/templates_c
    sudo setfacl -R -m u:www-data:rwx /var/www/postfixadmin/templates_c/
    ```

1.  Ensure that the Nginx web server can read the Let's Encrypt certificate and key you previously created:

    ```command
    sudo setfacl -R -m u:www-data:rx /etc/letsencrypt/live/ /etc/letsencrypt/archive/
    ```

### Step 9h: PostfixAdmin Configuration

By default, PostfixAdmin stores configuration data in the `/var/www/postfixadmin/config.inc.php` file. However, to avoid potential conflicts during upgrades, it is recommended to create a separate `config.local.php` file for server-specific settings.

Create and open the `config.local.php` file for editing:

```command
sudo nano /var/www/postfixadmin/config.local.php
```

Add the following content to the `config.local.php` file, replacing {{< placeholder "POSTFIXADMIN_PASSWORD" >}} with the actual `postfixadmin` user database password you previously created:

```file {title="/var/www/postfixadmin/config.local.php"}
<?php
  $CONF['configured'] = true;
  $CONF['database_type'] = 'mysqli';
  $CONF['database_host'] = 'localhost';
  $CONF['database_port'] = '3306';
  $CONF['database_user'] = 'postfixadmin';
  $CONF['database_password'] = '{{< placeholder "POSTFIXADMIN_PASSWORD" >}}';
  $CONF['database_name'] = 'postfixadmin';
  $CONF['encrypt'] = 'dovecot:ARGON2I';
  $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5";
  // @ to silence openbase_dir stuff; see https://github.com/postfixadmin/postfixadmin/issues/171
  if(@file_exists('/usr/bin/doveadm')) {
      $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5"; # debian
}
```

When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### Step 9i: Virtual Web Host

To create a virtual host for PostfixAdmin using Nginx, set up a separate Nginx configuration file for the domain.

1.  Use the following command create a new Nginx configuration file for PostfixAdmin, replacing {{< placeholder "example.tld" >}} with your actual domain name:

    ```command
    sudo nano /etc/nginx/sites-available/postfixadmin.{{< placeholder "example.tld" >}}.conf
    ```

    Insert the following contents into the file, again replacing {{< placeholder "example.tld" >}} with your actual domain name:

    ```file {title="/etc/nginx/sites-available/postfixadmin.{{< placeholder "example.tld" >}}.conf"}
    server {
      listen 80;
      listen [::]:80;

      server_name postfixadmin.{{< placeholder "example.tld" >}};

      root /var/www/postfixadmin/public/;
      index index.php index.html;

      access_log /var/log/nginx/postfixadmin_access.log;
      error_log /var/log/nginx/postfixadmin_error.log;

      location / {
          try_files $uri $uri/ /index.php;
      }

      location ~ ^/(.+\.php)$ {
            try_files $uri =404;
            fastcgi_pass unix:/run/php/php8.3-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include /etc/nginx/fastcgi_params;
        }
    }

    server {
      listen 443 ssl;
      listen [::]:443 ssl;

      server_name postfixadmin.{{< placeholder "example.tld" >}};

      root /var/www/postfixadmin/public/;
      index index.php index.html;

      access_log /var/log/nginx/postfixadmin_access.log;
      error_log /var/log/nginx/postfixadmin_error.log;

      location / {
          try_files $uri $uri/ /index.php;
      }

      location ~ ^/(.+\.php)$ {
            try_files $uri =404;
            fastcgi_pass unix:/run/php/php8.3-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include /etc/nginx/fastcgi_params;
      }
        ssl_certificate  /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/fullchain.pem;
        ssl_certificate_key  /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/privkey.pem;
        ssl_session_timeout  5m;
        ssl_protocols  TLSv1.2 TLSv1.3;
    }
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  You need to update the Let's Encrypt certificate and key. Create a symbolic link between the configuration file in `/etc/nginx/sites-available` and `/etc/nginx/sites-enabled`. Make sure to replace {{< placeholder "example.tld" >}} with your actual domain name in the configuration filename:

    ```command
    sudo ln -s /etc/nginx/sites-available/postfixadmin.{{< placeholder "example.tld" >}}.conf /etc/nginx/sites-enabled/
    ```

### Step 9j: Let's Encrypt Update

Update the Let's Encrypt certificate to include the virtual host you just created. Although it is possible to create different Let's Encrypt certificates for each virtual host, you can also use one certificate to validate all hostnames.

1.  Rerun the `certbot` command to update the Let's Encrypt certificate and include the virtual host you created. Replace {{< placeholder "example.tld" >}} with your actual domain name. Notice that this time, you're using the `-d` switch twice, once for each virtual host.

    ```command
    sudo certbot certonly -a nginx --staple-ocsp -d mail.{{< placeholder "example.tld" >}} -d postfixadmin.{{< placeholder "example.tld" >}}
    ```

    When prompted, select option `E` to expand the existing certificate to cover multiple hostnames. If the expansion succeeds, the new certificate and private key covers both hostnames:

    ```output
    Successfully received certificate.
    Certificate is saved at: /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/fullchain.pem
    Key is saved at:         /etc/letsencrypt/live/mail.{{< placeholder "example.tld" >}}/privkey.pem
    This certificate expires on 2024-09-12.
    These files will be updated when the certificate renews.
    Certbot has set up a scheduled task to automatically renew this certificate in the background.
    ```

1.  Verify the Nginx configuration using the following command:

    ```command
    sudo nginx -t
    ```

    Ensure that the output indicates a successful configuration as shown below:

    ```output
    nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
    nginx: configuration file /etc/nginx/nginx.conf test is successful
    ```

1.  Once you have validated your configuration and ensured there are no errors, reload Nginx to apply the changes:

    ```command
    sudo systemctl reload nginx
    ```

1.  Restart Postfix and Dovecot to load the updated certificate:

    ```command
    sudo systemctl restart postfix
    sudo systemctl restart dovecot
    ```

### Step 9k: Final PostfixAdmin Setup

1.  In your web browser, enter the following URL to access the PostfixAdmin setup screen, replacing {{< placeholder "example.tld" >}} with your domain name.

    ```command
    https://postfixadmin.{{< placeholder "example.tld" >}}/setup.php
    ```

    {{< note >}}
    Ensure that you have valid A and/or AAAA records in your DNS for `postfixadmin.{{< placeholder "example.tld" >}}`. If the page doesn't load, check the error log in the `/var/log/nginx` directory and/or the main `/var/log/syslog` file for any configuration errors.
    {{< /note >}}

1.  Once the setup page loads, enter a setup password to proceed:

    ![The PostFixAdmin initial setup page.](PostFixAdmin-Setup-Page.png)

1.  After entering the password, you see a hashed version of it. Copy the entire hashed string, which is used in the PostfixAdmin `config.local.php` file.

    ```output
    $CONF['setup_password'] = '$2y$10$d5COgAVA4qZtTJCo9znWaOB4c2bHjbtwwlr8TOLbIp6P3lidinH5W';
    ```

1.  Open the PostfixAdmin config file for editing.

    ```command
    sudo nano /var/www/postfixadmin/config.local.php
    ```

1.  Paste the setup password string as the last line of the config file.

    ```file {title="/var/www/postfixadmin/config.local.php"}
    <?php
      $CONF['configured'] = true;
      $CONF['database_type'] = 'mysqli';
      $CONF['database_host'] = 'localhost';
      $CONF['database_port'] = '3306';
      $CONF['database_user'] = 'postfixadmin';
      $CONF['database_password'] = 'adamo352';
      $CONF['database_name'] = 'postfixadmin';
      $CONF['encrypt'] = 'dovecot:ARGON2I';
      $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5";
      // @ to silence openbase_dir stuff; see https://github.com/postfixadmin/postfixadmin/issu>
      if(@file_exists('/usr/bin/doveadm')) {
          $CONF['dovecotpw'] = "/usr/bin/doveadm pw -r 5"; # debian
    }
    $CONF['setup_password'] = '$2y$10$d5COgAVA4qZtTJCo9znWaOB4c2bHjbtwwlr8TOLbIp6P3lidinH5W';
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  To allow the `www-data` user access to read the Let's Encrypt certificate and Dovecot stats, run the following commands:

    ```command
    sudo setfacl -R -m u:www-data:rx /etc/letsencrypt/live/ /etc/letsencrypt/archive/
    sudo setfacl -R -m u:www-data:rwx /var/run/dovecot/stats-reader /var/run/dovecot/stats-writer
    ```

    {{< note >}}
    If you encounter an ARGON2I error later on during the PostfixAdmin account setup, rerun these two commands.
    {{< /note >}}

1.  Reload the setup page in your browser, and if requested, log in using the setup password you entered earlier. You may encounter some database warnings, but you can ignore them as they pertain to database types not used in this setup.

1.  At the bottom of the page, enter the **Setup password** you just created, your external email address for **Admin**, and a new super-admin password:

    ![The PostFixAdmin super-admin creation page.](PostFixAdmin-SuperAdmin-Creation-Page.png)

1.  After entering the password, click the link at the bottom of the page to access the main login page. Alternatively, you can use the following login URL:

    ```command
    https://postfixadmin.{{< placeholder "example.tld" >}}/login.php
    ```

### Step 9l: Virtual Mail Setup in PostfixAdmin

1.  Open a web browser and navigate to `https://postfixadmin.{{< placeholder "example.tld" >}}/login.php` (replace `{{< placeholder "example.tld" >}}` with your domain name). Log in using the super-admin credentials you previously set up.

1.  In the top menu, click on **Domain List** and select **New Domain**. Enter the name of the domain you want to create under **Domain**. It is recommended to include your server's native domain since we are assuming all accounts on this system are virtual. For example, use `{{< placeholder "example.tld" >}}` instead of `mail.{{< placeholder "example.tld" >}}`.

    ![The PostFixAdmin ne domain creation page.](PostFixAdmin-New-Domain.png)

    Regarding the other settings on this page:

    -   **Aliases**: You can specify the maximum number of aliases and users per domain. The default is `10` for each, but you can set these values as desired. Use `0` to indicate an unlimited number.
    -   **Mail server is backup MX**: Since you are setting up a primary server, leave the option for this to be a backup mail exchanger (MX) unchecked.
    -   **Active**: Choose whether to enable or disable the virtual domain. It is recommended to enable the domain unless there are specific reasons to disable it, such as scheduling it to operate within certain dates.
    -   **Add default mail aliases** Keep this box checked to set up standard management aliases. These aliases are commonly used for administrative and troubleshooting purposes:

        -   `abuse@{{< placeholder "example.tld" >}}`
        -   `hostmaster@{{< placeholder "example.tld" >}}`
        -   `postmaster@{{< placeholder "example.tld" >}}`
        -   `webmaster@{{< placeholder "example.tld" >}}`

    -   **Pass expires**: sets a maximum age for users' passwords in that domain. The default setting of 365 days is recommended, but you can adjust it according to your preferences.

    When done, click **Add Domain**.

1.  Now, you can create your first user account. Click on the **Virtual Lists** menu at the top of the page and select **Add Mailbox**.

    ![The PostFixAdmin new mailbox creation page.](PostFixAdmin-Add-Mailbox.png)

    -   **Username**: Enter a username and select the domain from the dropdown menu. Since you have only created one virtual domain so far, there is only one option in the menu.
    -   **Password**: Choose a strong password and enter it twice.
    -   **Name**: This is a space for the user's full name.
    -   **Quota**: Optionally set a quota (maximum storage limit in megabytes) for the user.
    -   **Active**: Leave this box checked unless you have a specific reason to disable it.
    -   **Send Welcom email**: Leave this box checked unless you have a specific reason to disable it.
    -   **Other e-mail**: It is a good practice to enter an alternative email address (preferably from a separate domain on a separate server) for password recovery purposes.

### Step 9m: Client Setup and Server Validation

1.  To validate your email server, add a new account to an email client such as [Mozilla Thunderbird](https://www.thunderbird.net/en-US/), [GNOME Evolution](https://help.gnome.org/users/evolution/stable/), or [Microsoft Outlook](https://www.microsoft.com/en-us/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook). While the specific configuration of each client is beyond the scope of this guide, there are a few common settings to check:

    -   For sending and receiving emails, use the entire email address as the username (e.g., `username@example.com` instead of just `username`).
    -   For receiving email, specify IMAP on TCP port `993` using TLS/SSL.
    -   For sending email, specify either submission on TCP port `587` using STARTTLS or, for Microsoft Outlook clients, TCP port `465` using TLS/SSL.

1.  After configuring an account in your mail client, test your setup by sending and receiving emails to and from another address on a different server. You should be able to both receive and send emails using your new account. You now have a working email service.

1.  If you encounter any errors during the setup, don't worry. Instead of starting over, check the following log files for specific error messages: `/var/log/mail.log` and `/var/log/syslog`. These log entries should provide clues about the source of the problem. You can also search the web using the specific error message along with "dovecot postfix" to find relevant information and solutions.

1.  There are a few housekeeping tasks to complete:

    -   In PostfixAdmin, edit the four standard aliases created when you configured a domain. By default, these aliases point to dummy addresses such as `abuse@change-this-to-your.domain.tld`. Now that you have a working email address, you should edit these (under Virtual List/Virtual List) to point to your actual email address.

    -   In the `/etc/dovecot/conf.d/10-auth.conf` file, you added two lines for verbose debugging. Both lines begin with the string `auth_debug`. To avoid log bloat, you can comment out or delete both lines and then restart Dovecot.

    -   Consider configuring valid Sender Policy Framework (SPF) and DomainKeys Identified Mail (DKIM) records in your DNS to combat spam. Optionally, you can also set up a Domain Message Authentication, Reporting & Conformance (DMARC) record to specify how your server handles failed SPF and/or DKIM validations, as well as request reports from other servers. Linode provides a [separate email server guide](https://www.linode.com/docs/guides/configure-spf-and-dkim-in-postfix-on-debian-8/) for SPF, DKIM, and DMARC configuration.

    -   Stay vigilant about [security vulnerabilities](https://ubuntu.com/security/notices) by keeping your operating system and server software up to date. Regularly applying patches and updates is crucial for maintaining a secure server.

    -   Make regular backups of your server. Consider using [Akamai's Backups service](https://www.linode.com/docs/products/storage/backups/), which can automate your backups with a single click.

## Conclusion

You now know how to set up an email server. You know how to put key email protocols to work, and how to integrate them with DNS, databases, and graphical management tools. Properly configured, your new email server can run for years, making it a good pairing with Ubuntu’s LTS on an Akamai compute instance. Email represents one of the most useful services you can provide, the Akamai cloud offers an ideal platform on which to provision your next server.