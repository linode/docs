---
title: "Certificates"
description: 'This guide provides you with step-by step instructions on how to force all connections to your Cloud Load Balancer to use the secure and encrypted TLS protocol.'
keywords: ["Linode", "Load Balancer", "SSL", "redirect", "load balancing", "install", "certificate", "configuration"]
tags: ["linode platform","security","networking","ssl","TLS"]
published: 2015-09-01
modified: 2023-11-07
authors: ["Akamai"]
---

## TLS Certificates

TLS termination certificates create an encrypted link between your clients and Cloud Load Balancer and terminate incoming traffic on the load balancer. Once the load balancing policy is applied, traffic is forwarded to your service targets over encrypted TLS connections. Responses from your service targets to your clients are also encrypted.

### Add TLS Termination Certificates (HTTPS)

When the HTTPS protocol is selected, you need to install TLS certificates on your Cloud Load Balancer so that the correct certificates are delivered to your downstream clients.

1. Click Add to provide TLS termination certificates and enter the following information.

    - **Certificate Name:** Enter a label for this certificate.

    - **TLS Certificate:** Paste the PEM-formatted contents of your TLS certificate. If you have linked multiple segments of a chained certificate, be sure to copy all of its contents into the text field, appearing one after another. The certificate must be signed using the RSA algorithm, which is the default in most cases.

    - **Private Key:** Paste the PEM-formatted contents of your private key. Your private key must not have a passphrase.

    - **SNI Hostname:** Enter the Server Name Indication to ensure that client devices are able to see the correct TLS certificate for the website they are trying to reach.

## Service Target Certificates

Service target CA certificates are installed on your endpoints. Cloud Load Balancer uses these certificates to verify responses from your service targets to your clients.