---
author:
  name: Edward Angert
  email: docs@linode.com
description: "Install Certbot to obtain TLS certificates on a CentOS 7 or Red Hat server."
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
modified_by:
  name: Linode
title: 'Install Certbot for TLS on CentOS'
shortguide: true
---

1.  Enable the EPEL repository:

        sudo yum install epel-release
        sudo yum update

1.  Install the Certbot and web server-specific packages, then run Certbot. If using Nginx, change each instance of `apache` to `nginx` in the following example:

        sudo yum install python2-certbot-apache
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

    Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step. Certbot recommends pointing your web server configuration to the default directory or creating symlinks. Keys and certificates should not be moved to a different directory.

1.  If you have a firewall configured on your Linode, you can add a firewall rule to allow incoming and outgoing connections to the HTTPS service. On CentOS 7, *firewalld* is the default tool for managing firewall rules. Configure firewalld for HTTPS traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=https
