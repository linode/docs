---
slug: ssl-apache2-debian-ubuntu
title: "SSL Certificates with Apache on Debian & Ubuntu"
description: "This guide shows you how to enable SSL to secure websites served through Apache on Debian 11, Debian 12, Ubuntu 22.04, and Ubuntu 24.04."
authors: ["Linode"]
contributors: ["Linode"]
published: 2014-11-19
modified: 2026-05-29
keywords: ['ssl','tls','apache','debian','ubuntu','certbot','https','let\'s encrypt']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
  - '[Apache HTTP Server Documentation](https://httpd.apache.org/docs/2.4/)'
  - '[Certbot Documentation](https://certbot.eff.org/)'
  - '[SSL Labs Server Test](https://www.ssllabs.com/ssltest/)'
---

This guide shows you how to enable HTTPS on websites served through Apache on Debian 11, Debian 12, Ubuntu 22.04, and Ubuntu 24.04. You can obtain a free TLS certificate from Let's Encrypt using Certbot, or configure Apache manually with a certificate you already have.

HTTPS encrypts traffic between your server and visitors, protects credentials and sensitive data, and improves security and SEO.

## System Versions and Kernel Requirements

This guide supports:

  - Debian 11 (Bullseye)
  - Debian 12 (Bookworm)
  - Ubuntu 22.04 (Jammy)
  - Ubuntu 24.04 (Noble)

Before continuing, update your system packages and reboot if a new kernel is installed. This ensures consistent behavior when installing Apache, Certbot, and related dependencies.

## Before You Begin

1. **Prepare your Compute Instance**. Ensure your system has a hostname, correct timezone, a non root user with sudo privileges, SSH access, and basic security configuration (such as a firewall). If you’re new to server setup, see the reliable external resources listed at the end of this section.
2. **Ensure Apache is installed and serving your site over HTTP**. HTTPS requires a working HTTP virtual host on port 80. If Apache is not already serving your site, configure a virtual host first. Helpful references:
   - Virtual Hosts Overview: https://httpd.apache.org/docs/2.4/vhosts/
   - Name Based Virtual Hosts: https://httpd.apache.org/docs/2.4/vhosts/name-based.html
3. **Verify DNS is configured correctly**. Your domain’s **A record** must point to your server’s public IP address. Certbot uses this during the HTTP-01 challenge.
4. **Update your system packages and reboot if a new kernel is installed**.

   ```command
   sudo apt update && sudo apt upgrade -y
   ```

{{< note >}} This guide uses example.com as a placeholder. Replace it with your actual domain name throughout. {{< /note >}}

## Reliable External Resources (Optional)

These resources provide accurate, distro specific guidance for initial server setup and security. They are stable, widely trusted, and safe to link to.

### Initial Server Setup

  - Ubuntu 22.04: https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-22-04
  - Debian 12: https://www.digitalocean.com/community/tutorials/initial-server-setup-with-debian-12

### SSH Hardening

  - Ubuntu Server SSH Security: https://ubuntu.com/server/docs/security-ssh

Firewall Basics

  - UFW (Uncomplicated Firewall): https://help.ubuntu.com/community/UFW

## Install Certbot

Certbot is the recommended tool for obtaining and renewing Let’s Encrypt certificates.

### Option 1: Install Certbot via Snap (Recommended)

Snap provides the most up to date Certbot version and is the preferred installation method on all supported distributions.

1. Install Snap (if not already installed):

```command
sudo apt install snapd -y
```

2. Ensure Snap’s core is up to date:

```command
sudo snap install core
sudo snap refresh core
```

3. Install Certbot:

```command
sudo snap install --classic certbot
```

4. Create a symlink so Certbot is available in your PATH:

```command
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

### Option 2: Install Certbot via apt (Fallback)

Use this only if Snap is unavailable or restricted in your environment.

```command
sudo apt install certbot python3-certbot-apache -y
```

{{< note >}} The apt version of Certbot may lag behind the Snap version. Use Snap when possible. {{< /note >}}

## Obtain a Let’s Encrypt Certificate

Certbot can automatically configure Apache for you, or you can obtain the certificate only and configure Apache manually.

### Option 1: Automatic Apache Configuration (Recommended)

```command
sudo certbot --apache -d example.com -d www.example.com
```
Certbot will:
  - verify DNS
  - obtain the certificate
  - update your Apache configuration
  - reload Apache

Follow the prompts to enable the HTTPS redirect.

### Option 2: Obtain Certificate Only (Manual Apache Configuration)

```command
sudo certbot certonly --apache -d example.com -d www.example.com
```

Your certificates will be stored in:

```Code
/etc/letsencrypt/live/example.com/
```

You will configure Apache manually in the next section.

## Configure Apache for HTTPS (Manual Method)

If you used certbot --apache, this section is already complete.

To configure Apache manually:

1. Open your site’s SSL virtual host file:

```command
sudo nano /etc/apache2/sites-available/example.com-le-ssl.conf
```

2. Ensure it contains:

```code
SSLEngine on
SSLCertificateFile /etc/letsencrypt/live/example.com/fullchain.pem
SSLCertificateKeyFile /etc/letsencrypt/live/example.com/privkey.pem
```

3. Enable the SSL module and the SSL site:

```command
sudo a2enmod ssl
sudo a2ensite example.com-le-ssl.conf
```

4. Reload Apache:

```command
sudo systemctl reload apache2
```
### Redirect HTTP to HTTPS

If Certbot did not configure the redirect automatically, enable it manually.

1. Open your HTTP virtual host:

```command
sudo nano /etc/apache2/sites-available/example.com.conf
```

2. Add this inside the <VirtualHost *:80> block:

```code
Redirect permanent / https://example.com/
```

3. Reload Apache:

```command
sudo systemctl reload apache2
```

## Test Your Configuration

1. Visit your site in a browser:

```Code
https://example.com
```

2. Verify:

  - the certificate is valid
  - the padlock icon appears
  - HTTP redirects to HTTPS

3. Test renewal:

```command
sudo certbot renew --dry-run
```

## Automatic Renewal

Certbot installs a systemd timer that runs twice daily.

To check its status:

```command
sudo systemctl status snap.certbot.renew.timer
```

To test renewal manually:

```command
sudo certbot renew --dry-run
```

{{< note >}} Apache is not reloaded during a dry-run test. A reload only occurs during a real certificate renewal, when Certbot installs a new certificate and triggers its deploy hook.{{< /note >}}

## Troubleshooting

**Certbot cannot bind to port 80**

Ensure Apache is running and serving your site over HTTP.

**DNS challenge fails**

Verify your A record points to your server’s public IP.

**Apache fails to reload**

Check for syntax errors:

```command
sudo apachectl configtest
```

**Mixed content warnings**

Update your site’s URLs to use HTTPS.


## Additional Resources

- Apache SSL/TLS Configuration: https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html
- Let’s Encrypt Documentation: https://letsencrypt.org/docs/
- Certbot User Guide: https://certbot.eff.org/docs/
