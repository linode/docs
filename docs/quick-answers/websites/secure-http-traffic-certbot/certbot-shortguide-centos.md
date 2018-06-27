---
author:
  name: Edward Angert
  email: docs@linode.com
description: "Install Certbot to obtain TLS certificates on a CentOS or Red Hat server."
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
modified_by:
  name: Linode
title: 'Install Certbot for TLS on CentOS'
shortguide: true
---

1.  Enable the EPEL repository

        sudo yum install epel-release
        sudo yum update

1.  Install the Certbot and web server-specific packages, change to the webroot parent directory, then run Certbot. If using Apache, change each instance of `nginx` to `apache` in the following example:

        sudo yum install python2-certbot-apache
        cd /var/www/html/example.com/
        sudo certbot --apache

1.  Certbot will ask for information about the site. The responses will be saved as part of the certificate:

    {{< output >}}
# sudo certbot --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator apache, Installer apache

Which names would you like to activate HTTPS for?
-------------------------------------------------------------------------------
1: example.com
2: www.example.com
-------------------------------------------------------------------------------
Select the appropriate numbers separated by commas and/or spaces, or leave input
blank to select all options shown (Enter 'c' to cancel):
{{< /output >}}

1.  Configure firewalld for HTTPS traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=https
