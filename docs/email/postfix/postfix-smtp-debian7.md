---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to use Postfix to send mail through an external SMTP server.'
keywords: ["Postfix", " Debian 7", " SMTP", " Email", " Mail"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
location: ['email/postfix/postfix-smtp-debian7/']
contributor:
    name: Santiago Ti
modified: 2014-05-30
modified_by:
  name: Linode
published: 2014-05-30
title: Configure Postfix to Send Mail Using an External SMTP Server
image: https://linode.com/docs/assets/external_smtp_tg.png
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

There are many reasons why you would want to configure Postfix to send email using an external SMTP provider such as Mandrill, SendGrid, Amazon SES, or any other SMTP server. One reason is to avoid getting your mail flagged as spam if your current server's IP has been added to a spam list.

![Configure Postfix to Send Mail Using an External SMTP Server](/docs/assets/external_smtp_tg.png "Configure Postfix to Send Mail Using an External SMTP Server")

In this tutorial, you will learn how to install and configure a Postfix server to send email through Mandrill, or SendGrid.

## Updated Guide for Gmail and Google Apps

We've got an updated version of this guide that works with Gmail's new security features!

If you're using Gmail or Google Apps, see our [Configure Postfix to Send Mail Using Gmail and Google Apps on Debian or Ubuntu](/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu) guide instead.

## Prerequisites

Before starting this tutorial, you should have:

-   Debian 7 installed on your Linode
-   Your fully qualified domain name (FQDN)
-   All updates installed :

        sudo apt-get update

-   A valid username and password for the SMTP mail provider, such as Mandrill, or SendGrid
-   Make sure the libsasl2-modules package is installed and up to date:

        sudo apt-get install libsasl2-modules

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Installing Postfix

In this section, you will install Postfix and set the domain and hostname.

1.  Install Postfix with the following command:

        sudo apt-get install postfix

2.  During the installation, a prompt will appear asking for your **General type of mail configuration**.

    [![Postix configuration, General type of mail configuration options](/docs/assets/1737-postfixsmtp1_sm.png)](/docs/assets/1736-postfixsmtp1.png)

    Select **Internet Site**.

3.  Enter the fully qualified name of your domain, **fqdn.example.com**.

    [![Postix configuration, System mail name prompt](/docs/assets/1738-postfixsmtp2_sm.png)](/docs/assets/1739-postfixsmtp2.png)

4.  Once the installation is finished, open the `/etc/postfix/main.cf` file with your favorite text editor:

        sudo nano /etc/postfix/main.cf

5.  Make sure that the **myhostname** parameter is configured with your server's FQDN:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
myhostname = fqdn.example.com

{{< /file-excerpt >}}


## Configuring SMTP Usernames and Passwords

Usernames and passwords are generally stored in a file called `sasl_passwd` in the `/etc/postfix/` directory. In this section, you'll add your external mail provider credentials to this file and to Postfix.

If you want to use [Mandrill](#settings-for-mandrill), or [SendGrid](#settings-for-sendgrid) as your SMTP provider, you may want to reference the appropriate example while working on this section. For Google Apps and Gmail-specific settings, check out our [Configure Postfix to Send Mail Using Gmail and Google Apps on Debian or Ubuntu](/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu) guide.

1.  Open or create the `/etc/postfix/sasl_passwd` file, using your favorite text editor:

        sudo nano /etc/postfix/sasl_passwd

2.  Add your destination (SMTP Host), username, and password in the following format:

    {{< file "/etc/postfix/sasl\\_passwd" >}}
[mail.isp.example] username:password

{{< /file >}}


    {{< note >}}
If you want to specify a non-default TCP Port (such as 587), then use the following format:

{{< file "> /etc/postfix/sasl\\_passwd" >}}
[mail.isp.example]:587 username:password
{{< /note >}}

{{< /file >}}

3.  Create the hash db file for Postfix by running the `postmap` command:

        sudo postmap /etc/postfix/sasl_passwd

If all went well, you should have a new file named `sasl_passwd.db` in the `/etc/postfix/` directory.

## Securing Your Password and Hash Database Files

The `/etc/postfix/sasl_passwd` and the `/etc/postfix/sasl_passwd.db` files created in the previous steps contain your SMTP credentials in plain text.

For security reasons, you should change their permissions so that only the **root** user can read or write to the file. Run the following commands to change the ownership to root and update the permissions for the two files:

    sudo chown root:root /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db
    sudo chmod 0600 /etc/postfix/sasl_passwd /etc/postfix/sasl_passwd.db

## Configuring the Relay Server

In this section, you will configure the `/etc/postfix/main.cf` file to use the external SMTP server.

1.  Open the `/etc/postfix/main.cf` file with your favorite text editor:

        sudo nano /etc/postfix/main.cf

2.  Update the **relayhost** parameter to show your external SMTP relay host. **Important**: If you specified a non-default TCP port in the `sasl_passwd` file, then you must use the same port when configuring the **relayhost** parameter.

    {{< file-excerpt "/etc/postfix/main.cf" >}}
# specify SMTP relay host
relayhost = [mail.isp.example]:587

{{< /file-excerpt >}}


    {{< note >}}
Check the appropriate [Google Apps](/docs/email/postfix/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu), [Mandrill](#settings-for-mandrill), or [SendGrid](#settings-for-sendgrid) section for the details to enter here.
{{< /note >}}

3.  At the end of the file, add the following parameters to enable authentication:

    {{< file-excerpt "/etc/postfix/main.cf" >}}
# enable SASL authentication
smtp_sasl_auth_enable = yes
# disallow methods that allow anonymous authentication.
smtp_sasl_security_options = noanonymous
# where to find sasl_passwd
smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd
# Enable STARTTLS encryption
smtp_use_tls = yes
# where to find CA certificates
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt

{{< /file-excerpt >}}


4.  Save your changes.
5.  Restart Postfix:

        sudo service postfix restart

## Testing Postfix

The fastest way to test your configuration is to send an email to any unrelated email address, using the `mail` command:

    echo "body of your email" | mail -s "This is a Subject" -a "From: you@example.com" recipient@elsewhere.com

Alternatively, you can use Postfix's own sendmail implementation, by entering lines similar to those shown below:

    sendmail recipient@elsewhere.com
    From: you@example.com
    Subject: Test mail
    This is a test email
    .

## Examples of Postfix Configurations with Different Providers

This section shows you settings for some popular mail services you can use as external SMTP servers. You may have to do some fine-tuning on your own to avoid Postfix logins being flagged as suspicious.

### Settings for Mandrill

Use these settings for Mandrill.

1.  For `/etc/postfix/sasl_passwd`, use the following configuration with your own credentials:

    {{< file "/etc/postfix/sasl\\_passwd" >}}
[smtp.mandrillapp.com]:587 USERNAME:API_KEY

{{< /file >}}


2.  For `/etc/postfix/main.cf`, use the following **relayhost**:

    {{< file "/etc/postfix/main.cf" >}}
relayhost = [smtp.mandrillapp.com]:587

{{< /file >}}


3.  Create the hash db file for Postfix by running the `postmap` command:

        sudo postmap /etc/postfix/sasl_passwd

4.  Restart Postfix:

        sudo service postfix restart

### Settings for SendGrid

Use these settings for SendGrid.

1.  For `/etc/postfix/sasl_passwd`, use the following configuration with your own credentials:

    {{< file "/etc/postfix/sasl\\_passwd" >}}
[smtp.sendgrid.net]:587 USERNAME:PASSWORD

{{< /file >}}


2.  For `/etc/postfix/main.cf`, use the following **relayhost**:

    {{< file "/etc/postfix/main.cf" >}}
relayhost = [smtp.sendgrid.net]:587

{{< /file >}}


3.  Create the hash db file for Postfix by running the `postmap` command:

        sudo postmap /etc/postfix/sasl_passwd

4.  Restart Postfix:

        sudo service postfix restart
