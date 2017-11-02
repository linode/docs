---
author:
  name: Linode
  email: docs@linode.com
description: 'Setting up Google Apps with the Linode DNS Manager to handle email for your domains.'
keywords: ["google email", "google apps", "google apps linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['email/google-mail/']
modified: 2014-08-05
modified_by:
  name: Linode
title: Using Google Apps for Email
---

There are many options for running your own email server, and with applications like [Citadel](/docs/email/citadel/), hosting your own email stack can be quite straightforward. Nevertheless, managing independent email servers can be daunting, given email's importance and potential for complexity. This is particularly true when you have multiple users and/or complex filtering schemes. Many people prefer to delegate their email to a third-party email service like Google so they can better concentrate on the administration of other, more mission critical services.

The process for forwarding your email to Google's servers is a matter of redirecting the MX [DNS records](/docs/dns-guides/introduction-to-dns) which govern email routing to Google's email servers. Note that there are a number of third-party email service providers, and Linode does not specifically endorse any of them.

For more information about the [Standard Edition of Google Apps](http://www.google.com/apps/), visit their site. This is a subscription-based service that costs \$50 per year, per user. This document assumes that you are using the [Linode DNS Manager](/docs/dns-guides/configuring-dns-with-the-linode-manager) to manage the DNS records for your domain name, and that you've already signed up for a Google Apps account.

## Creating MX Records

To direct your email to Google Apps, you need to set up five MX records for your domain. When you click on "Add/Edit a MX Record," you will find a form that looks like this:

[![Adding an MX record for Google Apps in the Linode DNS Manager.](/docs/assets/97-google-mail-01-create-mx-record.png)](/docs/assets/97-google-mail-01-create-mx-record.png)

Create the following MX records:

1.  `ASPMX.L.GOOGLE.COM`
    -   Priority = `1`

2.  `ALT1.ASPMX.L.GOOGLE.COM`
    -   Priority = `5`

3.  `ALT2.ASPMX.L.GOOGLE.COM`
    -   Priority = `5`

4.  `ALT3.ASPMX.L.GOOGLE.COM`
    -   Priority = `10`

5.  `ALT4.ASPMX.L.GOOGLE.COM`
    -   Priority = `10`

Please note that although the Google Apps documentation states that there must be a trailing dot after each hostname, this is not required in the Linode DNS Manager. The trailing dot will be added to our DNS records automatically, and should not be specified in the hostname.

## Verify Domain Ownership

During the sign up process, Google will need you to verify that you have authority over the domain that you're setting up with their servers. They provide two ways to accomplish this.

The first option involves creating an HTML file with specific content at a particular location on your domain. During the sign up process, select "Upload an HTML" file. You will then be provided with a code to include in the contents of a `googlehostedservice.html` file. Simply issue the following command in the "DocumentRoot" for that domain at the terminal:

    echo "[code]" > googlehostedservice.html

If you don't have a web server set up, you can create a temporary CNAME record in the Linode DNS Manager by clicking on the "Add a new CNAME Record" link in the relevant domain record. Fill out the form with the information provided by the Google sign up process. The Linode DNS manager refreshes its records every quarter hour, so it may take some time for the CNAME record to be accessible to Google.

At this point the configuration is complete. You may have to wait several hours; Google says that it could take 24 to 48 hours for DNS to redirect correctly. After that window, however, all of your email should be successfully directed at Google's servers.