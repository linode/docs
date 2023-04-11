---
description: 'Having problems with your DNS records? This guide to help get your DNS settings back on track. Follow these tips to troubleshoot DNS issues.'
keywords: ["dns manager", "linode dns", "Linode Cloud Manager dns", "dns configuration", "ttl", "domain zones", "domain name"]
tags: ["linode platform","resolving","cloud manager","dns"]
modified: 2020-07-09
modified_by:
  name: Linode
published: 2020-07-09
title: Diagnose & Resolve DNS Records in DNS Manager
title_meta: Troubleshooting DNS Records
aliases: ['/platform/manager/troubleshooting-dns/','/guides/troubleshooting-dns/']
authors: ["Linode"]
---

Having problems with your DNS records? This guide to help get your DNS settings back on track. Follow these tips to troubleshoot DNS issues.

## Before You Begin

The *Domains* section of the [Linode Cloud Manager](https://cloud.linode.com/domains) is a comprehensive DNS management interface that allows you to add DNS records for all of your domain names. For an introduction to DNS Manager including setting up DNS records, see the [DNS Manager](/docs/products/networking/dns-manager/) guide.

{{< note >}}
Linode's DNS service employs [Cloudflare](https://cloudflare.com) to provide denial of service (DDoS) mitigation, load balancing, and increased geographic distribution for our [name servers](/docs/guides/dns-overview/#name-servers). These factors make our service reliable, fast, and a great choice for your DNS needs.
{{</ note>}}

{{< note >}}
To use the Linode DNS Manager to serve your domains, you must have an active Linode on your account. If you remove all active Linodes, your domains will no longer be served.
{{< /note >}}

## Wait for Propagation

DNS updates will take effect, or *propagate*, within the time period set by your zone file's [TTL](#set-the-time-to-live-or-ttl). If you've just made a DNS change and aren't seeing it reflected yet, the new information may not be available for up to 48 hours.

While you can't control DNS caching at every point on the Internet, you do have control over your web browser. Try holding down the *Shift* key or the *Control* key (depending on your browser) while you refresh the page to bypass your browser's cache of the old DNS data. You can also try bringing up your site in an alternate browser or editing your hosts file to [preview your website without DNS](/docs/guides/previewing-websites-without-dns/).

## Set the Time To Live or TTL

In the context of DNS, Time to Live (TTL) tells internet servers how long to cache particular DNS entries. **The default TTL for Linode domain zone files is 24 hours**. This is fine for most situations because most people don't update their IP addresses often.

However, there are times when you'll want the TTL to be as low as possible. For instance, when you make a DNS change, you'll want that change to propagate quickly. Otherwise, some people will see the new site right away, and others (who had the old data cached) will still be visiting the website at your old server. Long caching times can be even more problematic when it comes to email, because some messages will be sent to the new server and some to the old one.

The solution is to lower your TTL before making a DNS change. You'll want to lower the TTL first, before making any other DNS changes. Here's a general overview of what should happen during a smooth DNS update:

{{< note >}}
TTL is always written out in seconds, so 24 hours = 86400 seconds.
{{< /note >}}

1. Check the TTL value for the DNS record you will be updating. Typically, this will be 24 or 48 hours.
1. Update the relevant DNS records 48 to 96 hours in advance (for a 24-48 hour record), taking into account any intermediate DNS servers. Lower the TTL to five minutes (300 seconds, or the lowest allowed value). Do not make any other changes at this time.
1. Wait out the original 48 to 96 hours.
1. Visit your domain's DNS records in the Linode Cloud Manager again to update your IP address and anything else needed.
1. The DNS changes should propagate within 30 minutes.

## Find Current DNS Information

Sometimes you may need to find the current DNS information for a domain. There are two great tools for doing this:

- **dig**: Look up individual DNS entries. For example, you can find the IP address where your domain resolves.

- **whois**: Find your registrar and nameserver information for your domain.

If you're using a computer that runs macOS or Linux, you can use these tools from the command line. To find your domain's IP (the primary A record), run:

```command
dig example.com
```

Look in the *answer* section of the output to locate your IP address. You can also query for other types of records. For example, to see the mail records for a domain, run:

```command
dig mx example.com
```

This returns all of your domain's MX records.

To find your domain's registrar and nameserver information, run:

```command
whois example.com
```

This generates a large amount of information about the domain. The basic information you need will be near the top of the output, so you might have to scroll back to see it.

For a web-based tool, you can also use [kloth.net](http://www.kloth.net/services/dig.php) for dig requests and [whois.net](http://whois.net/) for WHOIS requests. Note that since you're running these lookups from a third-party website, the information they find is not necessarily what your local computer has cached. There should be a difference only if you've made recent changes to your DNS information.

For more information and examples on how to use dig, see our [Use dig to Perform Manual DNS Queries](/docs/guides/use-dig-to-perform-manual-dns-queries/) guide.

## Name Resolution Failures

If you have DNSSEC enabled at your domain's registrar it will cause name resolution failures such as `NXDOMAIN` when an attempt is made to access the DNS. This is because the Linode DNS Manager does not support DNSSEC at this time.