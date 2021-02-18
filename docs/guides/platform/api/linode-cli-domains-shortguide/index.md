---
slug: linode-cli-domains-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that displays the Domains section of the CLI guide.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-20
modified_by:
  name: Heather Zoppetti
published: 2020-07-20
title: How to manage Domains with the CLI
keywords: ["domains"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/api/linode-cli-domains-shortguide/']
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
