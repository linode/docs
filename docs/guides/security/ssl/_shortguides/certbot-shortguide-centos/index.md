---
slug: certbot-shortguide-centos
description: "Install Certbot to obtain TLS certificates on a CentOS 7 or Red Hat server."
keywords: []
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-06-28
modified: 2018-06-28
aliases: ['/quick-answers/websites/certbot-shortguide-centos/']
modified_by:
  name: Linode
title: 'Install Certbot for TLS on CentOS'
headless: true
authors: ["Edward Angert"]
---

1.  Enable the EPEL repository:

        sudo yum install epel-release
        sudo yum update

1.  Install the Certbot and web server-specific packages, then run Certbot:

        sudo yum install python2-certbot-nginx nginx
        sudo certbot --nginx

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

1.  Certbot will also ask if you would like to automatically redirect HTTP traffic to HTTPS traffic. It is recommended that you select this option.

1.  When the tool completes, Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step.

    {{< note respectIndent=false >}}
Certbot recommends pointing your web server configuration to the default certificates directory or creating symlinks. Keys and certificates should not be moved to a different directory.
{{< /note >}}

    Finally, Certbot will update your web server configuration so that it uses the new certificate, and also redirects HTTP traffic to HTTPS if you chose that option.

1. If you have a firewall configured on your Linode, you may need to add [Firewall Rules](/docs/products/compute/compute-instances/guides/set-up-and-secure/#configure-a-firewall) to allow incoming and outgoing connections to the HTTPS service. On CentOS, *firewalld* is the default tool for managing firewall rules. Configure firewalld for HTTP and HTTPS traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload
