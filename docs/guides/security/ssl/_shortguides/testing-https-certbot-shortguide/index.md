---
slug: testing-https-certbot-shortguide
author:
  name: Linode
  email: docs@linode.com
description: "Shortguide that outlines how to test the HTTPS connection."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-07-01
published: 2021-07-01
title: Testing HTTPS Shortguide
headless: true
show_on_rss_feed: false
---

## Testing the HTTPS Connection

The next step is to confirm the website is properly configured to use your new certificate and is accessible over HTTPS. To do this, navigate to your website on a web browser, making sure to specify the `https://` protocol when entering your URL. If a lock is visible to the left of the domain name on the browser's address bar, the certificate is likely working as expected. If the certificate is not installed properly, the browser displays a warning page.

You can also enter your domain into the [SSL Server Test](https://www.ssllabs.com/ssltest/) by Qualys SSL Labs to verify that the TLS/SSL certificate has been properly installed and configured. 