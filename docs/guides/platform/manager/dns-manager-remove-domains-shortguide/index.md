---
slug: dns-manager-remove-domains-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to remove domains.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-21
modified_by:
  name: Heather Zoppetti
published: 2020-07-21
title: Remove Domains in Cloud Manager
keywords: ["dns"]
headless: true
show_on_rss_feed: false
tags: ["linode platform","cloud manager"]
aliases: ['/platform/manager/dns-manager-remove-domains-shortguide/']
---

If one of your domain names has expired or if you want to start hosting it on another DNS provider, you should permanently remove the domain and all of its associated DNS records.

1.  From the **Domains** section of the Cloud Manager, find the domain you would like to remove and click its **more options ellipsis**.

1.  Select **Remove** to permanently delete the domain, including all associated DNS records. It will only take a few minutes for the changes to take effect.

    ![This menu lets you remove a DNS zone](domain-remove-a-zone.png "This menu lets you remove a DNS zone")

    {{< caution >}}
Once removed, you **MUST** delete the Linode nameserver entries from the domain at the registrar level. This is a very important step; if the entries are not removed, someone could use your domain without your permission.
{{< /caution >}}
