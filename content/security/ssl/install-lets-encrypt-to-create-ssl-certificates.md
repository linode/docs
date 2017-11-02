---
author:
  name: 'Linode Community'
  email: 'docs@linode.com'
description: "Let's Encrypt is an SSL certificate authority managed by the Internet Security Research Group. It utilizes the Automated Certificate Management Environment to automatically deploy browser-trusted SSL certificates to anyone for free."
keywords: "ACME,HTTPS,Let's Encrypt,SSL,SSL certificates"
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-02-25
modified: 2016-09-29
modified_by:
  name: 'Linode'
title: "Install Let's Encrypt to Create SSL Certificates"
contributor:
  name: 'Sean Webber'
  link: 'https://github.com/seanthewebber'
  external_resources:
    "[Let's Encrypt Homepage](https://letsencrypt.org/)"
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

![Let's Encrypt](/docs/assets/Install_Lets_Encrypt_to_Create_SSL_Certificates_smg.jpg)

[Let's Encrypt](https://letsencrypt.org/) is an SSL certificate authority managed by the Internet Security Research Group (ISRG). It utilizes the [Automated Certificate Management Environment](https://github.com/ietf-wg-acme/acme/) (ACME) to automatically deploy free SSL certificates that are trusted by nearly all major browsers.

This tutorial will cover the following:

*   Installing the Let's Encrypt ACME client.
*   Obtaining Let's Encrypt certificates.
*   Required attention and maintenance.
*   Technical details about Let's Encrypt and certificates issued by it.

## Before you Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Complete the steps in our [Securing Your Server](/docs/security/securing-your-server) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

3.  Update your server's software packages:

    **CentOS**

        sudo yum update && sudo yum upgrade

    **Debian / Ubuntu**

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Download and Install Let's Encrypt

1.  Install the `git` package:

    **CentOS**

        sudo yum install git

    **Debian / Ubuntu**

        sudo apt-get install git

2.  Download a clone of Let's Encrypt from the [official GitHub repository](https://github.com/letsencrypt/letsencrypt). `/opt` is a common installation directory for third-party packages, so let's install the clone to `/opt/letsencrypt`:

        sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt

3.  Navigate to the new `/opt/letsencrypt` directory:

        cd /opt/letsencrypt

## Create an SSL Certificate

Let's Encrypt automatically performs Domain Validation (DV) using a series of *challenges*. The Certificate Authority (CA) uses challenges to verify the authenticity of your computer's domain. Once your Linode has been validated, the CA will issue SSL certificates to you.

1.  Run Let's Encrypt with the `--standalone` parameter. For each additional domain name requiring a certificate, add `-d example.com` to the end of the command.

        sudo -H ./letsencrypt-auto certonly --standalone -d example.com -d www.example.com

    {{< note >}}
Let's Encrypt **does not** deploy wildcard certificates. Each subdomain requires its own certificate.
{{< /note >}}

2.  Specify an administrative email address. This will allow you to regain control of a lost certificate and receive urgent security notices if necessary. Press **TAB** followed by **ENTER** or **RETURN** to save.

    ![Let's Encrypt admin email prompt](/docs/assets/lets-encrypt-recovery-email-prompt.png)

3.  Agree to the Terms of Service.

    ![Let's Encrypt Terms of Service prompt](/docs/assets/lets-encrypt-agree-tos-prompt.png)

4.  If all goes well, a message similar to the one below will appear. Its appearance means Let's Encrypt has approved and issued your certificates.

    ~~~
    IMPORTANT NOTES:
    - If you lose your account credentials, you can recover them through
      e-mails sent to somebody@example.com.
    - Congratulations! Your certificate and chain have been saved at
      /etc/letsencrypt/live/example.com/fullchain.pem. Your
      cert will expire on 2016-03-31. To obtain a new version of the
      certificate in the future, simply run Let's Encrypt again.
    - Your account credentials have been saved in your Let's Encrypt
      configuration directory at /etc/letsencrypt. You should make a
      secure backup of this folder now. This configuration directory will
      also contain certificates and private keys obtained by Let's
      Encrypt, so making regular backups of this folder is ideal.
    - If you like Let's Encrypt, please consider supporting our work by:

      Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
      Donating to EFF:                    https://eff.org/donate-le
    ~~~

### Let's Encrypt Certificate Directory Structure

1.  List the `/etc/letsencrypt/live` directory:

        sudo ls /etc/letsencrypt/live

2.  Each domain name you specified in [Step 1](#create-an-ssl-certificate) of the **Create an SSL Certificate** section has its own directory. List any of these domain name directories:

        sudo ls /etc/letsencrypt/live/example.com

    Output:

        cert.pem
        chain.pem
        fullchain.pem
        privkey.pem

3.  Each key (`.pem`) file serves a different purpose:

    *   **cert.pem**: server certificate only.
    *   **chain.pem**: root and intermediate certificates only.
    *   **fullchain.pem**: combination of server, root and intermediate certificates (replaces `cert.pem` and `chain.pem`).
    *   **privkey.pem**: private key (do **not** share this with anyone!).

    Let's Encrypt issues certificates from intermediate certificate authorities. Intermediate certificates have been cross-signed by [Identrust](https://www.identrust.com/), which ensures compatibility between the end certificate and all major browsers. Refer to Let's Encrypt's [certificates](https://letsencrypt.org/certificates/) page for more information.

4.  For good measure, display the file status of `fullchain.pem`:

        sudo stat /etc/letsencrypt/live/example.com/fullchain.pem

    Output excerpt:

        File: ‘live/example.com/cert.pem’ -> ‘../../archive/example.com/cert1.pem’

    Notice how this file points to a different file, as do all four of the files listed in Step 3. They are *symbolic links* to the actual certificate files located in the `/etc/letsencrypt/archive` directory.

5.  If you forget to renew a domain name's certificate, Let's Encrypt will remove its directory (and symbolic links) from `/etc/letsencrypt/live`. However, the directory (and symbolic links) will be retained in the `/etc/letsencrypt/archive` and `/etc/letsencrypt/keys` directories for your future reference.

## Maintenance

### Renew SSL Certificates

1.  Return to the `/opt/letsencrypt` directory:

        cd /opt/letsencrypt

2.  Execute the command you used in [Step 1](#create-an-ssl-certificate) of the **Create an SSL Certificate** section, adding the `--renew-by-default` parameter:

        sudo -H ./letsencrypt-auto certonly --standalone --renew-by-default -d example.com -d www.example.com

3.  After a few moments, a confirmation similar to the one below should appear:

    ~~~
    IMPORTANT NOTES:
    - Congratulations! Your certificate and chain have been saved at
      /etc/letsencrypt/live/example.com/fullchain.pem. Your
      cert will expire on 2016-03-31. To obtain a new version of the
      certificate in the future, simply run Let's Encrypt again.
    - If you like Let's Encrypt, please consider supporting our work by:

      Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
      Donating to EFF:                    https://eff.org/donate-le
    ~~~

    Let's Encrypt has refreshed the lifespan of your certificates; in this example, March 31st, 2016 is the new expiration date.

{{< note >}}
Let's Encrypt certificates have a 90-day lifespan before they expire. [According to Let's Encrypt](https://letsencrypt.org/2015/11/09/why-90-days.html), this encourages automation and minimizes damage from key compromises. You can renew your certificates anytime during their lifespan.
{{< /note >}}

### Automatically Renew SSL Certificates (Optional)

We also recommend automating your certificate renewal since it can be easy to lose track of expiration dates, especially if you have them for several different domains. This will prevent your certificates from expiring, and can be accomplished with `cron`.

1.  Before we execute the following command, let's break it down and make some modifications:

        echo '@monthly root /opt/letsencrypt/letsencrypt-auto certonly --quiet --standalone --renew-by-default -d example.com -d www.example.com >> /var/log/letsencrypt/letsencrypt-auto-update.log' | sudo tee --append /etc/crontab

    *   **@monthly**: for simplicity, this command will execute at midnight on the first day of every month
    *   **root**: run the command as the **root** user
    *   **/opt/letsencrypt/letsencrypt-auto certonly --quiet --standalone --renew-by-default -d example.com -d www.example.com**: `letsencrypt-auto` renewal command. Again, add `-d example.com` for each domain name you need to renew
    *   **>> /var/log/letsencrypt/letsencrypt-auto-update.log**: record the *standard output* and *standard error* to a log file named `letsencrypt-auto-update.log`
    *   **tee --append /etc/crontab**: save the new cron job to the `/etc/crontab` file

    The above settings will be effective in most cases, but for more information about available cron job options, refer to the [Ubuntu Community Cron How-to](https://help.ubuntu.com/community/CronHowto) or the [CentOS Cron Documentation](https://www.centos.org/docs/5/html/5.2/Deployment_Guide/s2-autotasks-cron-configuring.html).

    {{< note >}}
The automatic renewal process requires access to port `443`, which would most likely be bound to your web server. You can configure your cron tasks to temporarily stop the web server, or use one of several methods documented [here](https://letsencrypt.readthedocs.io/en/latest/using.html#webroot).
{{< /note >}}

2.  Execute your modified command to add the cron job to your Linode.

{{< caution >}}
Once Let's Encrypt supports auto-renewal natively, open the `/etc/crontab` file and manually remove this entry to avoid future renewal conflicts.
{{< /caution >}}

### Update Let's Encrypt

1.  Return to the `/opt/letsencrypt` directory:

        cd /opt/letsencrypt

2.  Download any changes made to Let's Encrypt since you last cloned or pulled the repository, effectively updating it:

        sudo git pull

### Automatically Update Let's Encrypt (Optional)

You can also use `cron` to keep the `letsencrypt-auto` client up to date. The `@weekly` parameter will issue a `git pull` command in the `/opt/letsencrypt` directory every Sunday at midnight.

    echo '@weekly root cd /opt/letsencrypt && git pull >> /var/log/letsencrypt/letsencrypt-auto-update.log' | sudo tee --append /etc/crontab

To change the update frequency, choose a different parameter, for example, `@hourly`, `@daily`, or `@monthly`.

## Conclusion

Now that you have installed Let's Encrypt and obtained your free SSL certificates, you can configure any package that supports commercial or self-signed SSL certificates to use them.

- [Email with Postfix, Dovecot, and MySQL](https://www.linode.com/docs/email/postfix/email-with-postfix-dovecot-and-mysql)
- [How to Provide Encrypted Access to Resources Using SSL Certificates on Nginx](https://www.linode.com/docs/security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx)
- [SSL Certificates with Apache on Debian & Ubuntu](https://www.linode.com/docs/security/ssl/ssl-apache2-debian-ubuntu)
