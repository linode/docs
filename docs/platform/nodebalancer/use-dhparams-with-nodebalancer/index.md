---
author:
  name: Nathan Melehan
  email: nmelehan@linode.com
description: 'Shortguide for using Diffie-Hellman Parameters with a NodeBalancer'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: ["diffie-hellman", "forward secrecy", "nodebalancer"]
modified: 2018-07-11
modified_by:
  name: Nathan Melehan
title: "How to Use Diffie-Hellman Parameters with a NodeBalancer"
published: 2018-07-11
shortguide: true
show_on_rss_feed: false
---

<!-- How to Use Diffie-Hellman Parameters with a NodeBalancer -->

[Diffie-Hellman key exchange](https://en.wikipedia.org/wiki/Diffie–Hellman_key_exchange) is a method for enabling [forward secrecy](https://en.wikipedia.org/wiki/Forward_secrecy) for SSL/TLS connections. [Configuring Diffie-Hellman](https://weakdh.org/sysadmin.html) is normally achieved by generating a `dhparams.pem` file and then updating your web server's cipher suites list.

A NodeBalancer's SSL/TLS settings can't be accessed in the same way you can view your web server configuration, but you can still use Diffie-Hellman with your SSL certificate. This is accomplished by concatenating your certificate file with the contents of your `dhparams.pem` file and then supplying that to the **Certificate** field of your NodeBalancer's HTTPS configuration. The result of this concatenation will look similar to the example:

{{< output >}}
-----BEGIN CERTIFICATE-----
YOUR_CERTIFICATE_INFORMATION
-----END CERTIFICATE-----
-----BEGIN DH PARAMETERS-----
YOUR_DHPARAMS_INFORMATION
-----END DH PARAMETERS-----
{{< /output >}}

{{< caution >}}
To avoid [security vulnerabilities](https://weakdh.org), it is recommended that you use at least 2048 bits when generating your Diffie-Hellman parameters:

    openssl dhparam -out dhparams.pem 2048
{{< /caution >}}