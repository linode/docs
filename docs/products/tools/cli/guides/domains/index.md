---
title: "Linode CLI Commands for the DNS Manager"
description: "How to use the Linode CLI to create and manage Domains and DNS records."
published: 2020-07-20
modified: 2022-05-02
authors: ["Linode"]
---

1.  List the Domains on your account:

        linode-cli domains list

1.  View all domain records in a specific Domain:

        linode-cli domains records-list $domain_id

1.  Delete a Domain:

        linode-cli domains delete $domain_id

1.  Create a Domain:

        linode-cli domains create --type master --domain www.example.com --soa_email email@example.com

1.  Create a new A record in a Domain:

        linode-cli domains records-create $domain_id --type A --name subdomain --target 192.0.2.0