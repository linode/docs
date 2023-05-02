---
slug: email-warning-shortguide
description: 'Shortguide that displays the warning note that email ports are blocked on all new Compute Instances by default.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-10-31
modified: 2023-01-24
modified_by:
  name: Linode
title: Email Port Blocking Alert
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/email-warning-shortguide/']
authors: ["Linode"]
---

{{< note type="warning" title="Email restrictions on the Linode Platform" >}}
In an effort to fight spam originating from our platform, outbound connections on ports 25, 465, and 587 are blocked by default on Compute Instances for *some* new accounts. These restrictions prevent applications from sending email. If you intend to send email from a Compute Instance, review the [Send Email on the Linode Platform](/docs/products/platform/get-started/guides/send-email/) guide to learn more about our email policies and to request the removal of these restrictions.
{{< /note >}}