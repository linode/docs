---
title: "TLS/SSL Termination on NodeBalancers"
description: 'This guide provides you with step-by step instructions on how to force all connections to your NodeBalancer to use the secure and encrypted SSL protocol.'
keywords: ["Linode", "NodeBalancer", "SSL", "redirect", "load balancing", "install", "certificate", "configuration"]
tags: ["linode platform","security","networking","ssl"]
published: 2015-09-01
modified: 2023-04-18
modified_by:
  name: Linode
aliases: ['/platform/nodebalancer/nodebalancer-ssl-configuration/','/guides/nodebalancer-ssl-configuration/']
image: nodebalancer-ssl-configuration.png
authors: ["Linode"]
---

This guide will help you install an SSL certificate on your NodeBalancer. It includes step-by-step instructions for configuring a NodeBalancer to redirect all web connections over port 443/HTTPS using SSL. The provided directions are designed to work with Apache and Nginx web servers, running on Debian and Red Hat-based distributions.

{{< note >}}
Throughout this guide we will offer several suggested values for specific configuration settings; some of these values will be set by default. These settings are shown in the guide as a reference and you may need to modify them to suit your application accordingly.
{{< /note >}}

## Before you Begin

- When first configuring back-end Linodes, you should set them up according to the instructions in our [Getting Started](/docs/products/platform/get-started/) guide. In addition, we recommend that you implement security precautions. For assistance with this, please see our guide on [Securing Your Server](/docs/products/compute/compute-instances/guides/set-up-and-secure/)

- Generate an [SSL certificate](/docs/guides/security/ssl/) for your domain name that supports TLS version 1.2 or later. This can be done through any Certificate Authority, including Let's Encrypt using the [Certbot](https://certbot.eff.org/) tool. Since Certbot cannot run directly on the NodeBalancer, run the following command on any Linode to generate the certificate (after following [Certbot's installation instructions](https://certbot.eff.org/instructions)). This allows you to manually verify ownership by updating a DNS record on your domain:

    ```command
    sudo certbot certonly --key-type rsa --manual --preferred-challenges dns
    ```

    Most Certificate Authorities will generate an SSL certificate using the RSA digital signature algorithm, which is fully supported by NodeBalancers. Certificates using the ECDSA algorithm are not supported.

- This guide assumes that you have already deployed two or more back-end Linodes and configured them with either a LAMP stack or a LEMP stack. If you have not, please review the following documentation for assistance with configuring your respective stack:

    - [LAMP Stack](/docs/guides/web-servers/lamp/)
    - [LEMP Stack](/docs/guides/web-servers/lemp/)

- In addition, this guide assumes that you have already deployed a NodeBalancer and have configured it with two or more back-end Linodes that make connections on port 80/HTTP. We recommend that you first verify that your NodeBalancer is configured correctly, prior to introducing the complexities of an encrypted connection over SSL. If you would like assistance with setting up a basic NodeBalancer configuration, please review the following documentation:

    - [Getting Started with NodeBalancers](/docs/products/networking/nodebalancers/get-started/)
    - [NodeBalancer Reference Guide](/docs/products/networking/nodebalancers/guides/configure/)

{{< note >}}
This guide has been written with the assumption that you are logged in as the root user. If you are using a limited user account, you will need to prefix some commands with `sudo`.
{{< /note >}}

## Install the SSL Certificate and Private Key on your NodeBalancer

1. On your NodeBalancer **Configurations** page, select **Add another Configuration**.

1. Under **Port Configuration**, fill out the values in the fields as shown below:

    | Field | Value |
    | -- | -- |
    | **Port** | 443 |
    | **Protocol** | HTTPS |
    | **Session Stickiness** | None |
    | **SSL Certificate** | Paste the PEM-formatted contents of your SSL certificate. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another. The certificate must be signed using the RSA algorithm, which is the default in most cases. ECDSA certificates are not supported.|
    | **Private Key** | Paste the PEM-formatted contents of your private key. Your private key must not have a passphrase. |
    | **Algorithm** | Round Robin |
    | **Health Check Type** | HTTP Status |
    | **Interval** | 5 |
    | **Timeout** | 3 |
    | **Attempts** | 2 |
    | **Check HTTP Path** | / |

1. Select **Save Changes** when you're finished.

1. Add as many nodes as you require for the port configuration by selecting **Add a Node**. Once selected, fill out the values in the fields as shown below, replacing `xxx.xxx.xxx.xxx` with your Linode's private IP address:

    - **Label**                   Backend Linode 1
    - **IP Address**              xxx.xxx.xxx.xxx
    - **Port**                    80
    - **Weight**                  100
    - **Mode**                    Accept

    Select **Save Changes** when you're finished.

### TLS Cipher Suites

If your NodeBalancer must support users accessing your application with older browsers such as Internet Explorer 6-8, you should select the **Legacy** option, which sets the following cipher suite profile:

```command
!RC4:HIGH:!aNULL:!MD5
```

However, bear in mind that by gaining backwards compatibility, your NodeBalancer will use weaker SSL/TLS cipher suites. For all other implementations, the default **Recommended** cipher suite option should be used, which includes:

```command
ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA
```

### Diffie-Hellman Parameters

[Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange) is a method for enabling [forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy) for SSL/TLS connections. [Configuring Diffie-Hellman](https://weakdh.org/sysadmin.html) is normally achieved by generating a `dhparams.pem` file and then updating your web server's cipher suites list.

A NodeBalancer's SSL/TLS settings can't be accessed in the same way you can view your web server configuration, but you can still use Diffie-Hellman with your SSL certificate. This is accomplished by concatenating your certificate file with the contents of your `dhparams.pem` file and then supplying that to the **Certificate** field of your NodeBalancer's HTTPS configuration. The result of this concatenation will look similar to the example:

```output
-----BEGIN CERTIFICATE-----
YOUR_CERTIFICATE_INFORMATION
-----END CERTIFICATE-----
-----BEGIN DH PARAMETERS-----
YOUR_DHPARAMS_INFORMATION
-----END DH PARAMETERS-----
```

{{< note type="alert" >}}
To avoid [security vulnerabilities](https://weakdh.org), it is recommended that you use at least 2048 bits when generating your Diffie-Hellman parameters:

```command
openssl dhparam -out dhparams.pem 2048
```
{{< /note >}}

## Configure the Apache Web Server

1. Enable `mod_rewrite` so that you can redirect all traffic back to the NodeBalancer over port 443/HTTPS:

    ```command
    a2enmod rewrite
    ```

    Or, you can load the module manually by appending the following to your Apache configuration file:

    ```command
    LoadModule rewrite_module modules/mod_rewrite.so
    ```

    {{< note >}}
    Depending on your distribution, this file's location may vary. For example, it can be found at the following paths on Debian and Red Hat based distributions, respectively:

    - `/etc/apache2/apache2.conf`
    - `/etc/httpd/httpd.conf`
    {{< /note >}}

1. Edit the Apache virtual host configuration file to establish the rewrite rules necessary to redirect all incoming traffic from port 80/HTTP back to the NodeBalancer on port 443/HTTPS:

    ```file {title="/etc/apache2/sites-available/example.com.conf" lang="apache"}
    <VirtualHost *:80>
        RewriteEngine    On
        RewriteCond      %{HTTP:X-Forwarded-Proto} !https
        RewriteRule      ^.*$ https://%{SERVER_NAME}%{REQUEST_URI} [L,R=301,NE]
        LogLevel alert rewrite:trace4  # Adjust log verbosity as required. ex. 1-8
    </VirtualHost>
    ```

    The rewrite configuration shown above is specific to Apache 2.4 or later. This means that logging gets recorded to Apache's `error.log` file. To view only the records specific to `mod_rewrite`, you can pipe the log file through grep:

    ```command
    tail -f error_log|fgrep '[rewrite:'
    ```

    If you are using Apache 2.2, then you will need to replace the `LogLevel alert rewrite:trace` directive with the following:

     ```file {title="/etc/apache2/sites-available/example.com.conf" lang="aconf"}
    RewriteLog       /var/log/apache2/rewrite.log
    RewriteLogLevel  5  # Adjust log verbosity as required. ex. 1-9
    ```

    {{< note type="alert" >}}
    On Red Hat-based distributions, change the `Rewritelog` path to `/var/log/httpd/rewrite.log`
    {{< /note >}}

1. Create the `RewriteLog` as referenced from above:

    - Debian / Ubuntu

        ```command
        touch /var/log/apache2/rewrite.log
        ```

    - CentOS

        ```command
        touch /var/log/httpd/rewrite.log
        ```

## Configure the Nginx Web Server

1. Edit the Nginx server block configuration file to establish the rewrite rules to redirect all incoming traffic from port 80/HTTP back to the NodeBalancer on port 443/HTTPS:

     ```file {title="/etc/nginx/sites-available/example.com.conf" lang="nginx"}
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
      ```

    In the above configuration, be sure to replace the values of `server_name` and `root` with your actual domain and document root, respectively.

1. Your configuration should now be complete. After reloading your web server, all requests made to your website that are not sent to port 443 should be redirected back to your NodeBalancer on a secure connection with SSL/TLS.

## Tips for Troubleshooting

- If you have difficulty getting the redirect to work properly or would like to see detailed information about how your SSL certificate is configured, you may wish to utilize the [Qualys online SSL Server Test](https://www.ssllabs.com/ssltest/)

- Every time you make changes to your web server's document root file or other configuration files, be sure to reload the server:

    - For Apache, choose from the following commands, depending on your distribution:

        ```command
        service apache2 reload
        service httpd reload
        systemctl restart apache2
        systemctl restart httpd
        ```

    - For Nginx, choose from the following commands, depending on your distribution:

        ```command
        service nginx reload
        systemctl restart nginx
        ```

- When testing behind a load balancer, using curl with the `-I` or `-L` flags can be very helpful when debugging:

    ```command
    curl -I example.com
    curl -L example.com
    ```

    The `-I` or `--head` options will fetch the HTTP-header only. The `-L` or `--location` option will detect and display if the server indicates that the requested page has moved to a different location. This option will make curl repeat the request at the new location. If used together with `-I`, headers from all requested pages will be displayed. This is particularly useful if your rewrite rules have created an infinite loop and your web page does not load. Refer to the [man pages](https://curl.haxx.se/docs/manual.html) for `curl` for more info.
