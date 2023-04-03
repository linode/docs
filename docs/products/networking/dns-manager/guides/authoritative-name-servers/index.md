---
title: "Configure Your Domain's Authoritative Name Servers"
description: "Instructions on configuring a domain's registrar so that you can use the Linode DNS Manager"
published: 2022-01-03
---

To use Linode's DNS Manager, you must add our name servers as the authoritative name servers for your domain. To do this, log in to your domain registrar's control panel and set the name servers for your domain name to the entries below. See the instructions on your domain name registrar's website for more information.

- `ns1.linode.com`
- `ns2.linode.com`
- `ns3.linode.com`
- `ns4.linode.com`
- `ns5.linode.com`

The name for this setting various among registrars, but it is commonly called *external* or *custom* name servers. Follow the instructions for your registrar:

- [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
- [GoDaddy](https://www.godaddy.com/help/change-nameservers-for-my-domains-664)
- [Hover](https://help.hover.com/hc/en-us/articles/217282477--Changing-your-domain-nameservers)

{{< note >}}
DNS changes can take up to 24 hours to propagate throughout the internet, although the changes are usually visible within several hours.
{{< /note >}}