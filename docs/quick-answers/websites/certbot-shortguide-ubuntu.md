---
author:
  name: Edward Angert
  email: docs@linode.com
description: "Install Certbot to obtain TLS certificates on an Ubuntu server."
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
modified_by:
  name: Linode
title: 'Install Certbot for TLS on Ubuntu'
shortguide: true
---

1.  Install the Certbot and web server-specific packages, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

        sudo apt-get update
        sudo apt-get install software-properties-common
        sudo add-apt-repository ppa:certbot/certbot
        sudo apt-get update
        sudo apt-get install python-certbot-nginx
        sudo certbot --nginx

1.  Certbot will ask for information about the site. The responses will be saved as part of the certificate:

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

    Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step. Certbot recommends pointing your web server configuration to the default directory or creating symlinks. Keys and certificates should not be moved to a different directory.

1.  If you have a firewall configured on your Linode, you can add a firewall rule to allow incoming and outgoing connections to the HTTPS service. On Ubuntu, *UFW* is a commonly used and simple tool for managing firewall rules. Install and configure UFW for HTTPS traffic:

        sudo apt install ufw
        sudo systemctl start ufw && sudo systemctl enable ufw
        sudo ufw allow https
