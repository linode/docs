---
author:
  name: Linode
  email: docs@linode.com
description: 'Configurations for common DNS records.'
keywords: 'linode dns,linode manager dns,dns configuration'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/']
modified: Monday, April 7th, 2014
modified_by:
  name: Linode
published: 'Thursday, July 16th, 2009'
title: Common DNS Configurations
---

After familiarizing yourself with Linode's Domain Manager, the next step is determining which DNS records should be added. This guide discusses common DNS configurations that you can reference when creating your DNS records. If you are still unfamiliar with DNS and Linode's DNS Manager, please see our [DNS Manager](/docs/networking/dns/dns-manager) guide.

Setting Up a Domain
-------------------

The most common DNS configuration is a single domain name on one Linode. For this, you'll need to add *SOA* and *NS records* for all of your name servers, and *A/AAAA* records for your domain names. Use the screenshot below as a guide.

[![The SOA record is set to "ns1.linode.com". The NS records are set to "ns1.linode.com" through "ns5.linode.com", inclusive. The MX record is set to "mail.example.org". There are A records for [blank], which is the primary domain, and the "mail" and "www" subdomains. They are all set to the same IP.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

 {: .note }
>
> The DNS Manager can automatically add all of these records when you create a domain zone. For instructions, see [Adding Domain Zones](/docs/networking/dns/dns-manager#adding) in the [DNS Manager](/docs/networking/dns/dns-manager) guide.

Configuring Subdomains
----------------------

To configure a subdomain, such as `staging.example.org`, create an A record with the hostname of the subdomain you want to create. Point the the record at the IP address of the server you want to host the subdomain, as shown below.

[![Create a new A record, following the instructions in the "Adding" section. Add the subdomain text to the "Hostname" field. For example, you could type "staging" - NOT "staging.example.org".](/docs/assets/1125-dns13.png)](/docs/assets/1125-dns13.png)

 {: .note }
>
> You will also need to create a name-based virtual host for the subdomain. If you're using Apache, see [Configuring Name-Based Virtual Hosts](/docs/hosting-website#configuring-name-based-virtual-hosts) for more information.

Hosting Multiple Domains on a Single Server
-------------------------------------------

To host multiple domain names on a single server, create a separate domain zone for each domain name, as shown below. When creating the new domain zones, we recommend that you allow the DNS Manager to automatically [insert basic records](/docs/networking/dns/dns-manager#adding). At a minimum, you'll need an A record for each domain name pointing to the server's IP address.

[![This page shows the DNS Manager tab with three different domain zones listed.](/docs/assets/1126-dns15.png)](/docs/assets/1126-dns15.png)

 {: .note }
>
> You will also need to create a name-based virtual host for each domain name. If you're using Apache, see [Configuring Name-Based Virtual Hosts](/docs/hosting-website#configuring-name-based-virtual-hosts) for more information.

Using One Domain on Multiple Servers
------------------------------------

If you have more than one server, but only one domain name, you can point A records with server-specific hostnames to all servers that need domain names. One machine will be the "front end" for the domain, by virtue of the first-level domain's A record pointing to it, but if needed the domain can serve as a proxy for services provided by other machines. For example, if you wanted to create a development environment on another server, you could create an A record for `staging.example.org` and point it at another Linode's IP address.

Routing Email to Third-Party Mail Services
------------------------------------------

To route email to a third-party email service, create MX records that associate your mail server (for example, `mail.example.org`) with a *hostname* provided by the third-party service. For instructions, see the website of your third-party email service.

Using Wildcard DNS Records
--------------------------

A *wildcard* DNS record matches requests for non-existent domain names. For example, if you create an A record for `*.example.org`, and a user visits `nonexistantname.example.org`, that user will be redirected to `example.org`. An example wildcard DNS record is shown below.

[![Create a new A record, following the instructions in the "Adding" section. Add a single asterisk (\*) in the "Hostname" field. Set your IP address in the "IP Address" field. Then click the "Save Changes" button.](/docs/assets/1127-dns16.png)](/docs/assets/1127-dns16.png)

Troubleshooting
---------------

Having problems with your DNS records? We recommend reviewing this section to help get your DNS settings back on track. Follow these tips to troubleshoot DNS issues.

### Waiting for Propagation

If you've just made a DNS change and aren't seeing it reflected yet, try waiting 48 hours. DNS updates will take effect, or *propagate*, within the time period set by your zone file's [TTL](#setting-the-time-to-live-or-ttl). In some cases, though, the new information may not be reflected for up to 48 hours.

While you can't control DNS caching at every point on the internet, you do have control over your web browser. Try holding down the *Shift* key or the *Control* key (depending on your browser) while you refresh the page to bypass your browser's cache of the old DNS data. You can also try bringing up your site in an alternate browser.

### Setting the Time To Live or TTL

Time to Live (TTL) tells Internet servers how long to cache particular DNS entries. The default TTL for Linode zone files is 24 hours, which is pretty typical. (TTL is always written out in seconds, so 24 hours = 86400 seconds.) This is fine for normal DNS situations, because most people don't update their IP addresses all that often.

However, there are times when you'll want the TTL to be as low as possible. For instance, when you make a DNS change, you'll want that change to propagate quickly. Otherwise, some people will see the new site right away, and others (who had the old data cached) will still be visiting the website at your old server. Long caching times can be even more problematic when it comes to email, because some messages will be sent to the new server, and some to the old one.

The solution is to lower your TTL before making a DNS change. You'll want to lower the TTL first, on its own, before making any other DNS changes. Here's a general overview of what should happen during a smooth DNS update:

1.  Check the TTL on your current zone file. Typically, this will be 24 or 48 hours.
2.  Visit your current zone file 24 or 48 hours early, and lower the TTL to five minutes (300 seconds, or the lowest allowed value). Do not make any other changes at this time. If you're using Linode's DNS Manager, [lower the TTL](/docs/dns-manager#sph_dns-records) to 5 minutes for each entry you're going to change.
3.  Wait out the original 24 or 48 hours.
4.  Visit your zone file again to make all of your IP address and other updates.
5.  DNS changes should propagate within five minutes, meaning that your new website and/or email will now be live.

### Finding Current DNS Information

Sometimes, you just need to find the current DNS information for a domain. There are two great tools for doing this:

-   **dig**: Look up individual DNS entries. For example, you can find the IP address where your domain resolves.
-   **WHOIS**: Find your registrar and nameserver information for your domain.

If you're using a computer that runs Mac OS X or Linux, you can use these tools from the command line. To find your domain's IP (the primary A record), run this command:

    dig example.com

Look in the *answer section* of the output to locate your IP address. You can also query for other types of records. For example, to see the mail records for a domain, run this command:

    dig mx example.com

This returns all of your domain's MX records.

To find your domain's registrar and nameserver information, run this command:

    whois example.com

This generates a large amount of information about the domain. The basic information you need will be near the top of the output, so you might have to scroll back to see it.

If you're on a Windows machine, or you're just more comfortable using a web-based tool, you can also use [kloth.net](http://www.kloth.net/services/dig.php) for dig requests and [whois.net](http://whois.net/) for WHOIS requests. Note that since you're running these lookups from a third-party website, the information they find is not necessarily what your local computer has cached. (There should be a difference only if you've made recent changes to your DNS information.)

### DNS Manager Tools

The Linode [DNS Manager](/docs/dns-manager) also contains tools that you can use to check your DNS setup. Visit that article for Linode-specific information and troubleshooting tips.



