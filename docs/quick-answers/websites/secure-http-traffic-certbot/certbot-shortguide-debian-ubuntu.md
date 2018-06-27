---
author:
  name: Edward Angert
  email: docs@linode.com
description: "Install Certbot to obtain TLS certificates on a Debian or Ubuntu server."
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
modified_by:
  name: Linode
title: 'Install Certbot for TLS on Debian or Ubuntu'
shortguide: true
---

1.  Install the Certbot and web server-specific packages, change to the webroot parent directory, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

        sudo apt install certbot python-certbot-nginx
        cd /var/www/html/example.com/
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

1.  Configure the firewall for HTTPS traffic:

        ufw allow https
