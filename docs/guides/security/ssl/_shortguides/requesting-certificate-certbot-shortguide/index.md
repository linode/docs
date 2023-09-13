---
# Shortguide: Requesting a Certificate Using Certbot

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: requesting-certificate-certbot-shortguide
title: "Shortguide"
description: "Shortguide"
keywords: ["shortguide"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
modified_by:
  name: Linode
authors: ["Linode"]
---

## Requesting a TLS/SSL Certificate Using Certbot

During the certificate granting process, Certbot asks a series of questions about the domain so it can properly request the certificate. You must agree to the terms of service and provide a valid administrative email address. Depending upon the server configuration, the messages displayed by Certbot might differ somewhat from what is shown here.

1.  **Run Certbot to start the certificate request.** When Certbot runs, it requests and installs certificate file along with a private key file. Certbot can also automatically edit the configuration files for NGINX and Apache, which dramatically simplifies configuring HTTPS for your web server. If you are using a web server other than NGINX or Apache, or if you prefer to manually adjust the configuration files, you can run Certbot using the `certonly` option.

    -  **NGINX:** Using this command, Certbot automatically edits NGINX configuration files to enable HTTPS.

            sudo certbot --nginx

    -  **Apache:** Using this command, Certbot automatically edits Apache configuration files to enable HTTPS.

            sudo certbot --apache

    -  **Other web servers**, such as OpenLiteSpeed: Certbot will request the certificate and install it on the server.

            sudo certbot certonly --standalone

        When using a web server other than NGINX or Apache, you need to manually configure your web server to enable HTTPS and direct it to the certificate and private key files that Certbot installed. For instructions, see the documentation for your web server.

    During the installation process, Certbot will prompt you for some basic information including your email address and domain name.

1.  **Enter email address.** The first prompt is to request an email address where Certbot can send urgent notices about the domain or registration. This should be the address of the web server administrator.

1.  **Accept terms of service.** Certbot next asks you to agree to the Let's Encrypt terms of service. Use the link in the output to download the PDF file and review the document. If you agree with the terms, enter `Y`. Entering `N` terminates the certificate request.

1.  **Optionally subscribe to mailing list.** Certbot asks if you want to subscribe to the EFF mailing list. You can answer either `Y` or `N` without affecting the rest of the installation.

1.  **Enter domain name(s).** Certbot now requests a domain name for the certificate. If there is a virtual host file for the domain, Certbot displays the names of the eligible domains. Select the numbers corresponding to the domains you are requesting certificates for, separated by spaces. If the domain doesn't appear, you can enter the name for each domain without the `http` or `https` prefix. For each domain name, you should request separate certificates with and without the `www` prefix. If you have more than one domain to certify, separate the names with either a space or a comma.

        www.example.com example.com

    {{< note respectIndent=false >}}
If there is a virtual host file for the domain, Certbot displays the names of the eligible domains. Select the numbers corresponding to the domains you are requesting certificates for, separated by spaces.
    {{< /note >}}

1.  Certbot proceeds to request and install the certificates, performing any necessary challenges. If the operation is successful, Certbot confirms the certificates are enabled. It also displays some information about the directories where the certificates and key chains are stored, along with the expiration date. Certificates typically expire in 90 days.

    {{< output >}}
Requesting a certificate for www.example.com
Performing the following challenges:
http-01 challenge for www.example.com
Waiting for verification...
Cleaning up challenges
Deploying Certificate to VirtualHost /etc/nginx/sites-enabled/default
Redirecting all traffic on port 80 to ssl in /etc/nginx/sites-enabled/default

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Congratulations! You have successfully enabled https://www.example.com
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
...
- Congratulations! Your certificate and chain have been saved at:
/etc/letsencrypt/live/www.example.com/fullchain.pem
Your key file has been saved at:
/etc/letsencrypt/live/www.example.com/privkey.pem
our certificate will expire on 2021-05-29.
    {{< /output >}}