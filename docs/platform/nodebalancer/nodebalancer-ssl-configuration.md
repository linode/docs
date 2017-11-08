---
author:
  name: Joel Kruger
  email: jkruger@linode.com
description: 'Forcing all connections to use SSL with NodeBalancers.'
keywords: ["Linode", "NodeBalancer", "SSL", "redirect", "load balancing", "install", "certificate", "configuration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2017-04-06
modified_by:
  name: Nick Brewer
published: 2015-09-01
title: NodeBalancer SSL Configuration
---

This guide will help you install an SSL certificate on your NodeBalancer. It includes step-by-step instructions for configuring a NodeBalancer to redirect all web connections over port 443/HTTPS using SSL. The provided directions are designed to work with Apache and Nginx web servers, running on Debian and Red Hat-based distributions.

![Forcing all connections to use SSL with NodeBalancers.](/docs/assets/NodeBalancer_SSL_Configuration_smg.png "Forcing all connections to use SSL with NodeBalancers.")

{{< note >}}
Throughout this guide we will offer several suggested values for specific configuration settings; some of these values will be set by default. These settings are shown in the guide as a reference and you may need to modify them to suit your application accordingly.
{{< /note >}}

## Before you Begin

- When first configuring back-end Linodes, you should set them up according to the instructions in our [Getting Started](/docs/getting-started) guide. In addition, we recommend that you implement security precautions. For assistance with this, please see our guide on [Securing Your Server](https://linode.com/docs/security/securing-your-server)

- Install a commercial or self-signed [SSL certificate](/docs/security/ssl) using the appropriate guide for your distribution.

- This guide assumes that you have already deployed two or more back-end Linodes and configured them with either a LAMP stack or a LEMP stack. If you have not, please review the following documentation for assistance with configuring your respective stack:

    - [LAMP Stack](/docs/websites/lamp/)
    - [LEMP Stack](/docs/websites/lemp/)

- In addition, this guide assumes that you have already deployed a NodeBalancer and have configured it with two or more back-end Linodes that make connections on port 80/HTTP. We recommend that you first verify that your NodeBalancer is configured correctly, prior to introducing the complexities of an encrypted connection over SSL. If you would like assistance with setting up a basic NodeBalancer configuration, please review the following documentation:

    - [Getting Started with NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers)
    - [NodeBalancer Reference Guide](/docs/platform/nodebalancer/nodebalancer-reference-guide)

{{< note >}}
This guide has been written with the assumption that you are logged in as the root user. If you are using a limited user account, you will need to prefix some commands with `sudo`.
{{< /note >}}

## Install the SSL Certificate and Private Key on your NodeBalancer

1.  Go to your NodeBalancer's configuration page. If you select the HTTPS protocol, the **Certificate** and **Private Key** fields will appear.

    [![The NodeBalancer SSL Certificate Fields.](/docs/assets/nodebalancer-ssl-cert.png)](/docs/assets/nodebalancer-ssl-cert.png)

2.  Copy the contents of your SSL certificate into the **Certificate** field. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another.

3.  Copy your private key into the **Private Key** field. Your private key must not have a passphrase.

4.  On your NodeBalancer **Configurations** page, select **Create Configuration** to configure each port/protocol that you would like to use, i.e. `80` and `443`.

5.  Under **Edit Configuration,**  once selected, fill out the values in the fields as shown below:

    - **Port**                    443
    - **Protocol**                HTTPS
    - **Algorithm**               Round Robin
    - **Session Stickiness**      None
    - **Certificate**             Insert your signed SSL Certificate
    - **Private Key**             Insert your Private Key
    - **Health Check Type**       HTTP Valid Status
    - **Check Interval**          5
    - **Check Timeout**           3
    - **Check Attempts**          2
    - **Check HTTP Path**         /

    Select **Save Changes** when you're finished.

6.  Add as many nodes as you require for the port configuration by selecting **Add Node**. Once selected, fill out the values in the fields as shown below, replacing `xxx.xxx.xxx.xxx` with your Linode's private IP address:

    - **Label**                   Backend Linode 1
    - **Address**                 xxx.xxx.xxx.xxx:80
    - **Weight**                  100
    - **Mode**                    Accept

    Select **Save Changes** when you're finished.


## Configure the Apache Web Server

1.  Enable `mod_rewrite` so that you can redirect all traffic back to the NodeBalancer over port 443/HTTPS:

        a2enmod rewrite

    Or, you can load the module manually by appending the following to your Apache configuration file:

        LoadModule rewrite_module modules/mod_rewrite.so

    {{< note >}}
Depending on your distribution, this file's location may vary. For example, it can be found at the following paths on Debian and Red Hat based distributions, respectively:

/etc/apache2/apache2.conf

/etc/httpd/httpd.conf
{{< /note >}}

2.  Edit the Apache virtual host configuration file to establish the rewrite rules necessary to redirect all incoming traffic from port 80/HTTP back to the NodeBalancer on port 443/HTTPS:

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" apache >}}
<VirtualHost *:80>

     RewriteEngine    On
     RewriteCond      %{HTTP:X-Forwarded-Proto} !https
     RewriteRule      ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R=301,NE]
     LogLevel alert rewrite:trace4  # Adjust log verbosity as required. ex. 1-8
 </VirtualHost>

{{< /file-excerpt >}}


    The rewrite configuration shown above is specific to Apache 2.4 or later. This means that logging gets recorded to Apache's `error.log` file. To view only the records specific to `mod_rewrite`, you can pipe the log file through grep:

        tail -f error_log|fgrep '[rewrite:'

    If you are using Apache 2.2, then you will need to replace the `LogLevel alert rewrite:trace` directive with the following:

    {{< file-excerpt "/etc/apache2/sites-available/example.com.conf" aconf >}}
RewriteLog       /var/log/apache2/rewrite.log
RewriteLogLevel  5  # Adjust log verbosity as required. ex. 1-9

{{< /file-excerpt >}}


    {{< caution >}}
On Red Hat-based distributions, change the `Rewritelog` path to `/var/log/httpd/rewrite.log`
{{< /caution >}}

3.  Create the `RewriteLog` as referenced from above:

     - Debian / Ubuntu

           touch /var/log/apache2/rewrite.log

     - CentOS

           touch /var/log/httpd/rewrite.log

## Configure the Nginx Web Server

1.  Edit the Nginx server block configuration file to establish the rewrite rules to redirect all incoming traffic from port 80/HTTP back to the NodeBalancer on port 443/HTTPS:

    {{< file-excerpt "/etc/nginx/sites-available/example.com.conf" nginx >}}
server {
    listen   80;
    server_name example.com;
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    proxy_set_header X-Forwarded-Proto $scheme;
    location / {
        root   /srv/www/example.com/public_html;
        index  index.html index.htm;
        if ($http_x_forwarded_proto = "http") {
            rewrite  ^/(.*)$  https://example.com/$1 permanent;
            }
        }
    }

{{< /file-excerpt >}}


    In the above configuration, be sure to replace the values of `server_name` and `root` with your actual domain and document root, respectively.

2. Your configuration should now be complete. After reloading your web server, all requests made to your website that are not sent to port 443 should be redirected back to your Nodebalancer on a secure connection with SSL/TLS.

## Tips for Troubleshooting

- If you have difficulty getting the redirect to work properly or would like to see detailed information about how your SSL certificate is configured, you may wish to utilize the [Qualys online SSL Server Test](https://www.ssllabs.com/ssltest/)

- Every time you make changes to your web server's document root file or other configuration files, be sure to reload the server:

    -   For Apache, choose from the following commands, depending on your distribution:

            service apache2 reload
            service httpd reload
            systemctl restart apache2
            systemctl restart httpd

    -   For Nginx, choose from the following commands, depending on your distribution:

            service nginx reload
            systemctl restart nginx

- When testing behind a load balancer, using curl with the `-I` or `-L` flags can be very helpful when debugging:

        curl -I example.com
        curl -L example.com

  The `-I` or `--head` options will fetch the HTTP-header only. The `-L` or `--location` option will detect and display if the server indicates that the requested page has moved to a different location. This option will make curl repeat the request at the new location. If used together with `-I`, headers from all requested pages will be displayed. This is particularly useful if your rewrite rules have created an infinite loop and your web page does not load. Refer to the [man pages](https://curl.haxx.se/docs/manual.html) for `curl` for more info.
