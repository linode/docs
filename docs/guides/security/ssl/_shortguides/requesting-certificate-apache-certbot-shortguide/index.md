---
# Shortguide: Requesting a Certificate Using Certbot with Apache

headless: true
show_on_rss_feed: false

# Ignore the below front matter. It is included to comply with existing tests.

slug: requesting-certificate-apache-certbot-shortguide
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

1.  **Run Certbot to start the certificate request.** When Certbot runs, it requests and installs certificate file along with a private key file. When used with the [Apache plugin](https://certbot.eff.org/docs/using.html#apache) (`--apache`), Certbot also automatically edits the configuration files for Apache, which dramatically simplifies configuring HTTPS for your web server. If you prefer to manually adjust the configuration files, you can run Certbot using the `certonly` command.

    -  **Request a certfifcate and automatically configure it on Apache (recommended):**

            sudo certbot --apache

    -  **Request a certificate without configuring Apache:**

            sudo certbot certonly --apache

        To request the certificate without relying on your Apache installation, you can instead use the [standalone plugin](https://certbot.eff.org/docs/using.html#standalone) (`--standalone`).

    During the installation process, Certbot will prompt you for some basic information including your email address and domain name.

1.  **Enter email address.** The first prompt is to request an email address where Certbot can send urgent notices about the domain or registration. This should be the address of the web server administrator.

1.  **Accept terms of service.** Certbot next asks you to agree to the Let's Encrypt terms of service. Use the link in the output to download the PDF file and review the document. If you agree with the terms, enter `Y`. Entering `N` terminates the certificate request.

1.  **Optionally subscribe to mailing list.** Certbot asks if you want to subscribe to the EFF mailing list. You can answer either `Y` or `N` without affecting the rest of the installation.

1.  **Enter domain name(s).** Certbot now requests a domain name for the certificate. If there is a virtual host file for the domain, Certbot displays the names of the eligible domains. Select the numbers corresponding to the domains you are requesting certificates for, separated by spaces. If the domain doesn't appear, you can enter the name for each domain without the `http` or `https` prefix. For each domain name, you should request separate certificates with and without the `www` prefix. If you have more than one domain to certify, separate the names with either a space or a comma.

        www.example.com example.com

    {{< note respectIndent=false >}}
Certbot displays the names of domains configured in the virtual host files within Apache. Select the numbers corresponding to the domains you are requesting certificates for, separated by spaces.
{{< /note >}}

1.  Certbot then communicates with Let's Encrypt to request the certificate(s) and perform any necessary challenges as defined in the ACME standard (see [Challenge Types](https://letsencrypt.org/docs/challenge-types/)). In most cases, ownership can be proven through the HTTP challenge, which automatically adds a file on your web server. If you wish to change the challenge type or perform challenge manually, see the [Manual](https://certbot.eff.org/docs/using.html#manual) section in the Certbot documentation.

If the operation is successful, Certbot confirms the certificates are enabled and outputs the details. It also displays some information about the directories where the certificates and key chains are stored, along with the expiration date. Certificates typically expire in 90 days.