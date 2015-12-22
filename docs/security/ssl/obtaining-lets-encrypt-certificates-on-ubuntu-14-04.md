---
author:
    name: 'Sean Webber'
    email: 'swebber@yazzielabs.com'
description: 'Installing Let's Encrypt and obtaining SSL certificates on Ubuntu 14.04 LTS'
keywords: '14.04,ACME,free,HTTPS,Let's Encrypt,LTS,SSL,Ubuntu'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'N/A'
modified: 'Tuesday, December 22nd, 2015'
title: 'Obtaining Let's Encrypt Certificates on Ubuntu 14.04'
contributor:
    name: 'Sean Webber'
    link: 'https://github.com/seanthewebber'
---

## Introduction

Let's Encrypt is an SSL certificate authority managed by the Internet Security Research Group (ISRG). It utilizes the Automated Certificate Management Environment (ACME) to automatically deploy browser-trusted SSL certificates to anyone for free.

This tutorial will cover the following on Ubuntu 14.04:
- Installing the Let's Encrypt ACME client
- Obtaining Let's Encrypt certificates
- Required attention and maintenance
- Technical details about Let's Encrypt and certificates issued by Let's Encrypt

{: .caution}
>
> As of 2015-12-19, Let's Encrypt is still in *public beta*. Although most users have reported success with Ubuntu 14.04, the ACME client is still being debugged and developed. **Do not deploy Let's Encrypt Public Beta in a production environment without testing it beforehand.**

## Prerequisites

- A Linode server running Ubuntu 14.04. We recommend following our [Getting started](/docs/getting-started) guide if you need help setting up your Linode
- The `git` package. If it is not installed on your Linode, execute the `sudo apt-get install git` command to install it

## Downloading and Installing Let's Encrypt

1. Download a clone of Let's Encrypt from the [official GitHub repository](https://github.com/letsencrypt/letsencrypt). `/opt` is a common installation directory for third party packages, so we will install the clone to `/opt/letsencrypt`.

        sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt

2. Position your Bash prompt in the new `/opt/letsencrypt` directory.

        cd /opt/letsencrypt

## Obtaining SSL Certificates

Let's Encrypt performs automatic Domain Validation (DV) using a series of *challenges*. The Certificate Authority (CA) uses challenges to prove your server is telling the truth. Once your Linode's truth is proven, the CA will issue you SSL certificates.

1. Run Let's Encrypt with the `--standalone` parameter. Add `-d example.com` to the end of the command for each additional domain name requiring a certificate.

        sudo ./letsencrypt-auto --standalone -d example.com -d www.example.com

{: .note}
>
> Let's Encrypt **does not** deploy wildcard certificates. Each subdomain requires its own certificate.

2. Agree to the Terms of Service by positioning your cursor over the **YES** prompt and pressing the **ENTER** key.

3. (?) Confirm HTTPS activation for the domain names you specified in step two. Use your **ENTER** key to check the checkboxes and select **OK**.

4. <Add certificate confirmation here>

## Exploring Let's Encrypt Certificate Directory Structure

1. List the `/etc/letsencrypt/live` directory.

        ls /etc/letsencrypt/live

2. Each domain name you specified in step one of the **Obtaining SSL Certificates** section has its own directory. List any one of these domain name directories.

        ls /etc/letsencrypt/live/example.com

Output:

        cert.pem
        chain.pem
        fullchain.pem
        privkey.pem

3. Each key (`.pem`) file serves a different purpose:

- **cert.pem**: server certificate only
- **chain.pem**: root and intermediate certificates only
- **fullchain.pem**: combination of server, root, and intermediate certificates (replaces `cert.pem` and `chain.pem`)
- **privkey.pem**: private key (**do not** share this with anyone!)

4. For good measure, display the file status of `fullchain.pem`.

        stat /etc/letsencrypt/live/example.com/fullchain.pem

Output excerpt:

        File: ‘live/example.com/cert.pem’ -> ‘../../archive/example.com/cert1.pem’

Notice how this file points to a different file. All four of the files in step three do. They are *symbolic links* to the "real" files located in the `/etc/letsencrypt/archive` directory.

5. If you forget to renew a domain name's certificate, Let's Encrypt will remove its directory (and symbolic links) from `/etc/letsencrypt/live`. However, they will be retained in the `/etc/letsencrypt/archive` and `/etc/letsencrypt/keys` directories for your future reference.

## Maintenance

### Renewing SSL Certificates

1. Return your Bash prompt to the `/opt/letsencrypt` directory.

        cd /opt/letsencrypt

2. Execute the same command you used to obtain your certificate in the **Obtaining SSL Certificates** section with the `certonly` parameter.

        sudo ./letsencrypt-auto certonly --standalone --renew-by-default -d example.com -d www.example.com

3.

{: .note}
>
> Let's Encrypt certificates have a 90 day lifespan before they expire. According to Let's Encrypt, this encourages automation and minimizes damage from key compromises. We recommend that you renew your certificates every 60 days.

### Automating SSL Certificate Renewal (Optional)

Since it's easy to forget about logging into a remote server, we also recommend automating your certificate renewal. This will prevent your certificates from expiring and can be accomplished with `cron`.

1. Before we execute the following command, let's break it down and make some modifications:

        echo '@monthly root /opt/letsencrypt/letsencrypt-auto certonly --standalone --renew-by-default -d example.com -d www.example.com >> /var/log/letsencrypt/letsencrypt-auto-update.log' | sudo tee --append /etc/crontab

- **@monthly**: for simplicity, this command will execute at midnight on the first day of every month
- **root**: run the command as the **root** user
- **/opt/letsencrypt/letsencrypt-auto certonly --standalone --renew-by-default -d example.com -d www.example.com**: `letsencrypt-auto` renewal command. Again, add `-d example.com` for each domain name you need to renew
- **>> /var/log/letsencrypt/letsencrypt-auto-update.log**: record the *standard output* and *standard error* to a log file named `letsencrypt-auto-update.log`
- **tee --append /etc/crontab**: save the new cron job to the `/etc/crontab` file

2. Execute your modified command to add the cron job to your Linode.

{: .note}
>
> Once Let's Encrypt leaves public beta and supports auto-renewal natively, you need to open the /etc/crontab file and manually remove this entry.

## Updating Let's Encrypt

1. Return your Bash prompt to the `/opt/letsencrypt` directory.

        cd /opt/letsencrypt

2. Download any changes made to Let's Encrypt since you last cloned (or pull'd) the repository, effectively updating it.

        sudo git pull

## More Information

Now that you installed Let's Encrypt and obtained SSL certificates, you can configure any package that supports commercial or self-signed SSL certificates to use them.

-[Email with Postfix, Dovecot, and MySQL](https://www.linode.com/docs/email/postfix/email-with-postfix-dovecot-and-mysql)
- [How to Provide Encrypted Access to Resources Using SSL Certificates on Nginx](https://www.linode.com/docs/security/ssl/how-to-provide-encrypted-access-to-resources-using-ssl-certificated-on-nginx)
- [SSL Certificates with Apache on Debian & Ubuntu](https://www.linode.com/docs/security/ssl/ssl-apache2-debian-ubuntu)
