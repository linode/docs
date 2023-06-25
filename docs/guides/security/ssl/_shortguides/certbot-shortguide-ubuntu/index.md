---
slug: certbot-shortguide-ubuntu
description: "Install Certbot to obtain TLS certificates on an Ubuntu server."
keywords: []
aliases: ['/quick-answers/websites/certbot-shortguide-ubuntu/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
modified_by:
  name: Linode
headless: true
title: 'Install Certbot for TLS on Ubuntu'
authors: ["Edward Angert"]
---

1. Install the Certbot and web server-specific packages, then run Certbot:

        sudo apt update
        sudo apt install certbot python3-certbot-nginx
        sudo certbot --nginx

1. Certbot will ask for information about the site. The responses will be saved as part of the certificate:

    {{< output >}}
# sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx

Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: example.com
2: www.example.com
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
{{< /output >}}

1. Certbot will also ask if you would like to automatically redirect HTTP traffic to HTTPS traffic. It is recommended that you select this option.

1. When the tool completes, Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step.

    {{< note respectIndent=false >}}
Certbot recommends pointing your web server configuration to the default certificates directory or creating symlinks. Keys and certificates should not be moved to a different directory.
{{< /note >}}

    Finally, Certbot will update your web server configuration so that it uses the new certificate, and also redirects HTTP traffic to HTTPS if you chose that option.

1. If you have a firewall configured on your Linode, you can add a firewall rule to allow incoming and outgoing connections to the HTTPS service. On Ubuntu, *UFW* is a commonly used and simple tool for managing firewall rules. Install and configure UFW for HTTP and HTTPS traffic:

        sudo apt install ufw
        sudo systemctl start ufw && sudo systemctl enable ufw
        sudo ufw allow http
        sudo ufw allow https
        sudo ufw enable
