---
author:
  name: Rajakavitha Kodhandapani
  email: docs@linode.com
description: "Install Certbot to obtain TLS certificates on a CentOS 8 or Red Hat server."
og_description: "Install Certbot to obtain TLS certificates on a CentOS 8 or Red Hat server."
keywords: [centos, certbot, TLS]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-22
modified: 2020-03-22
modified_by:
  name: Linode
title: 'How to Install Certbot for TLS on CentOS 8'
h1_title: 'Installing Certbot for TLS on CentOS 8'
---
## What is Certbot?

Certbot is a tool that automates the process of getting a signed certificate via [Let's Encrypt](https://letsencrypt.org/how-it-works/) to use with TLS.

For most operating system and web server configurations, Certbot creates signed certificates, manages the web server to accept secure connections, and can automatically renew certificates it has created. In most cases, Certbot can seamlessly enable HTTPS without causing server downtime.

## Before You Begin

Make sure you have registered a Fully Qualified Domain Name (FQDN) and set up [A and AAAA](/docs/networking/dns/dns-records-an-introduction/#a-and-aaaa) DNS records that point to your Linode's public [IPv4 and IPv6 addresses](/docs/getting-started/#find-your-linode-s-ip-address). Consult our [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) and [DNS Manager](/docs/platform/manager/dns-manager/) guides for help with setting up a domain.

{{< note >}}
If you're using Apache, change each instance of `nginx` to `apache` in the following sections.
{{< /note >}}

1.  Enable the EPEL repository:

        sudo yum install epel-release
        sudo yum update

1.  Download and install the Certbot and web server-specific packages:

        sudo curl -O https://dl.eff.org/certbot-auto
        sudo mv certbot-auto /usr/local/bin/certbot-auto
        chmod 0755 /usr/local/bin/certbot-auto

1. Run Certbot:

        sudo /usr/local/bin/certbot-auto --nginx

1.  Certbot will ask for information about the site. The responses will be saved as part of the certificate:

    {{< output >}}
# sudo /usr/local/bin/certbot-auto --nginx
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator nginx, Installer nginx
No names were found in your configuration files. Please enter in your domain
name(s) (comma and/or space separated)  (Enter 'c' to cancel): www.example.com
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for www.example.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/nginx.conf

Please choose whether or not to redirect HTTP traffic to HTTPS, removing HTTP access.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: No redirect - Make no further changes to the webserver configuration.
2: Redirect - Make all requests redirect to secure HTTPS access. Choose this for
new sites, or if you're confident your site works on HTTPS. You can undo this
change by editing your web server's configuration.
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 2
Redirecting all traffic on port 80 to ssl in /etc/nginx/nginx.conf

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

{{< /output >}}

1.  Certbot will also ask if you would like to automatically redirect HTTP traffic to HTTPS traffic. It is recommended that you select this option.

1.  When the tool completes, Certbot will store all generated keys and issued certificates in the `/etc/letsencrypt/live/$domain` directory, where `$domain` is the name of the domain entered during the Certbot certificate generation step.

    {{< note >}}
Certbot recommends pointing your web server configuration to the default certificates directory or creating symlinks. Keys and certificates should not be moved to a different directory.
{{< /note >}}

    Finally, Certbot will update your web server configuration so that it uses the new certificate, and also redirects HTTP traffic to HTTPS if you chose that option.

1.  If you have a firewall configured on your Linode, you may need to add a firewall rule to allow incoming and outgoing connections to the HTTPS service. On CentOS 8, *firewalld* is the default tool for managing firewall rules. Configure firewalld for HTTP and HTTPS traffic:

        sudo firewall-cmd --zone=public --permanent --add-service=http
        sudo firewall-cmd --zone=public --permanent --add-service=https
        sudo firewall-cmd --reload
