---
author:
  name: Linode
  email: scampbell@linode.com
description: Our quick start guide to adding DNS records
keywords: 'DNS,domain name system,'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['adding-dns-records/']
modified: Monday, April 7th, 2014
modified_by:
  name: Linode
published: 'Monday, July 29th, 2013'
title: Adding DNS Records
---

Now that you've set up a Linode and started hosting a website, it's time to point a domain name at your server and your website. To do that, you'll use something called the Domain Name System (DNS), which is the Internet's address book. DNS is responsible for directing web traffic to your Linode and emails to your inbox. It maps memorable domain names like *example.com* to IP addresses like `12.34.56.78`. This guide explains how to create basic DNS records for your website, introduces some advanced DNS configurations, and provides basic troubleshooting steps.

How DNS Works
-------------

Before adding any DNS records, you should learn the basics of DNS. This section explains how DNS and domain names work. You'll start by dissecting a domain name, and then you'll learn about the mechanics of DNS resolution, including name servers, zone files, and individual DNS records.

### Domain Names

Everyone's familiar with domain names, but there's more to some domain names than meets the eye. Domain names are best understood by reading from right to left. The broadest domain classification is on the right -- the classifications become more specific as you move to the left. In the examples below, the top-level domain, or *TLD*, is *.com*.

    example.com
    mail.hello.example.com

Every term to the left of the TLD and separated by a period is considered a more specific subdomain, although conventionally, first-level subdomains plus their TLDs (*example.com* as shown above) are referred to as "domains." Moving to the left, *hello* and *mail* are the second- and third-level subdomains, respectively. Typically, subdomains are used to uniquely identify specific machines or services, but this is left up to the domain owner.

### Name Servers

Choosing and specifying *name servers* is an essential part of domain ownership. If you don't, the Internet won't know where to find your DNS information, and your domain won't resolve. Name servers host a domain's DNS information in a text file called the *zone file*. They're are also known as Servers of Authority (SOAs). You can host your DNS information on name servers in one of several locations:

-   Linode (recommended)
-   Your registrar
-   Your own DNS server
-   Third-party DNS hosting

Using Linode's free name servers is the easiest approach, because Linode provides a default zone file with all the right IP addresses for your website and email. For basic DNS setups and many advanced ones, Linode's name servers will work beautifully. However, you can also look into the options offered by your registrar and third-party DNS hosts. You can host your own DNS if you want to take control of as much of the DNS process as possible.

You'll specify name servers on your domain registrar's website. They'll take care of publishing that information to the higher-level name servers. You'll want to specify at least two name servers. That way, if one of them is down, the next one can continue to serve your DNS information.

### DNS Records and Zone Files

The next aspect of DNS management is specifying DNS records, which actually match domain names to IP addresses. The DNS records are then automatically bundled up into a zone file, which is what allows the Internet to look up the correct IP address for your domain. If you decide to use Linode's name servers, our DNS Manager will help you create a default zone file. It contains the following records:

    ; example.com [448369]
    $TTL 86400
    @   IN  SOA ns1.linode.com. admin.example.com. 2013062147 14400 14400 1209600 86400
    @       NS  ns1.linode.com.
    @       NS  ns2.linode.com.
    @       NS  ns3.linode.com.
    @       NS  ns4.linode.com.
    @       NS  ns5.linode.com.
    @           MX  10  mail.example.com.
    @           A   12.34.56.78
    mail        A   12.34.56.78
    www         A   12.34.56.78

Every domain's zone file contains the admin's email address, the name servers, and the DNS records. Of course, you are not limited to these default entries. You can create a variety of DNS records for as many different subdomains as you wish. To learn how to add individual DNS records using the DNS Manager, read [this article](/docs/dns-manager).

### DNS Resolution

So how does DNS actually work? First, the domain name needs to get translated into your Linode's IP address. DNS matches human-friendly domain names like *example.com* to computer-friendly IP addresses like *12.34.56.78*. This happens in a special text file called a *zone file*, which lists domains and their corresponding IP addresses (and a few other things). A zone file is a lot like a phone book that matches names with street addresses.

Here's how the DNS lookup process works:

1.  You type a domain name like *example.com* in to the address bar.
2.  Your computer connects to the Internet through an Internet Service Provider (ISP).
3.  The ISP's *DNS resolver* queries a *root nameserver* for the proper TLD nameserver. In other words, it asks the root nameserver, "Where can I find the nameserver for *.com* domains?"
4.  The root nameserver responds with the IP address for the *.com* nameserver.
5.  The ISP's DNS resolver visits the *.com* nameserver, using the IP address it got from the root nameserver. It asks the *.com* nameserver, "Where can I find the nameserver for *example.com*?"
6.  The *.com* nameserver responds with the IP address for the *example.com* nameserver.
7.  The ISP's DNS resolver visits your domain's nameserver and reads the zone file.
8.  The zone file shows which IP address goes with the domain.
9.  Now that the ISP has the IP address for *example.com*, it connects you to your Linode.
10. Apache handles everything after that, ensuring that the correct files and folders get displayed in your visitor's browser.

[![This steps for DNS resolution, also displayed below.](/docs/assets/1330-dnsoverview.jpeg)](/docs/assets/1330-dnsoverview.jpeg)

The scenario described above is what happens if the ISP has no current information about the requested domain. In actuality, ISPs cache a lot of DNS information after they've looked it up the first time. This results in faster lookups and less strain on DNS servers. Usually caching is a good thing, but it can be a problem if you've recently made a change to your DNS information, like when you move to Linode from a different hosting provider. In those cases, you'll want to pay attention to your zone file's [time to live (TTL)](#setting-the-time-to-live-or-ttl) so that your DNS change happens as quickly as possible.

Creating DNS Records
--------------------

If you've [uploaded a website](/docs/hosting-website) to your Linode and registered a domain name, you'll need to point that domain at your Linode so visitors can actually see the new website. Fortunately, Linode provides customers with a comprehensive DNS management interface called the [DNS Manager](/docs/dns-manager). It's free and easy to use. This section provides step-by-step instructions for adding DNS records to the DNS Manager.

Here's how to add DNS records:

1.  Log in to the Linode Manager.
2.  Click the **DNS Manager** tab.
3.  Select the **Add a domain zone** link. The form shown below appears.

    [![Create a domain zone.](/docs/assets/1331-hosting-1-small.png)](/docs/assets/1332-hosting-1.png)

4.  In the **Domain** field, enter your website's domain name.
5.  In the **SOA Email** field, enter the administrative contact email address for your domain.
6.  Select the **Yes, insert a few records to get me started** button.
7.  Click **Add a Master Zone**. Several DNS records will be created for your domain, as shown below.

    [![The DNS records created for the domain.](/docs/assets/1333-hosting-2-small.png)](/docs/assets/1334-hosting-2.png)

8.  Log in to the control panel for your domain at your registrar (the company where you bought the domain).

	{: .note }
	>
	> If your domain is currently directing web traffic or email to another server, you'll want to make sure your transition to Linode is as smooth as possible. We recommend modifying the domain's current zone file to [lower the TTL (time to live)](#setting-the-time-to-live-or-ttl) on all of your DNS records. This will speed up any DNS changes you make later. We recommend that you wait 24-48 hours for the lower TTL to take effect before changing your name servers.

9.  Follow your registrar's instructions to set your desired name servers or Servers of Authority (SOA). "Name server" and "Server of Authority" mean the same thing. Linode's name servers are:
    -   ns1.linode.com
    -   ns2.linode.com
    -   ns3.linode.com
    -   ns4.linode.com
    -   ns5.linode.com

You've now added DNS records for your domain. DNS changes can take up to 24 hours to propagate through the Internet. Be patient! Once the DNS changes are completed, you'll be able to access your website by typing the domain name in to your browser's address bar.

Setting Reverse DNS
-------------------

You just finished setting up *forward* DNS resolution, which allows networks to determine the IP address associated with a domain name. Now you need to configure *reverse* DNS, which is the inverse process. Here's how to set the reverse DNS on your Linode:

1.  Verify that an A or AAAA record for your domain points to your Linode's IP address.
2.  Log in to the [Linode Manager](https://manager.linode.com/).
3.  Click the **Linodes** tab.
4.  Select your Linode.
5.  Click the **Remote Access** tab.
6.  Select the **Reverse DNS** link, as shown in the below image.

	[![The Reverse DNS link](/docs/assets/1705-remoteaccess_reversedns.png)](/docs/assets/1705-remoteaccess_reversedns.png)

7.  Enter a domain name in the **Hostname** field, as shown in the below image.

	[![Adding the domain name for reverse DNS](/docs/assets/1702-ptr_lookup_marked.png)](/docs/assets/1702-ptr_lookup_marked.png)

8.  Click **Look up**. A message appears indicating that a match has been found for both your IPv4 and IPv6 addresses.

	[![Reverse DNS Match found](/docs/assets/1703-ptr_lookup_match_found_small.png)](/docs/assets/1704-ptr_lookup_match_found.png)

9.  Click **Yes** beneath the desired address. Note that you can select only one address at a time. If you want to set up reverse DNS for both the IPv4 and IPv6 addresses, you can perform another lookup and select the other address.

You have successfully set up reverse DNS for your domain name. Visit the linked article to learn how to [reset your reverse DNS](/docs/remote-access#sph_resetting-reverse-dns).

 {: .note }
>
> It's possible to have different IPs (including both IPv4 and IPv6 addresses) that have the same domain set for reverse DNS. To do this, you will have to configure multiple A or AAAA records for that domain that point to the various IPs.

Advanced DNS Configurations
---------------------------

At this point, you've created DNS records and set up reverse DNS, but there's a lot more you can do with Linode's DNS Manager. Keep reading if you need to set up subdomains, multiple domains, multiple Linodes, or third-party email. If you need more information or step-by-step instructions on setting up these configurations, see our [DNS Manager guide](/docs/dns-manager#sph_common-dns-configurations).

### Subdomains

To configure DNS for a subdomain, [create an A record](/docs/dns-manager#sph_adding) with the hostname of the desired subdomain. For example, to create *hello.example.com*, you would enter *hello* as the subdomain. The A record should point to the IP address of the your Linode (or other server).

 {: .note }
>
> You can configure Apache to display websites for subdomains. For more information, see [Configuring Name-Based Virtual Hosts](/docs/hosting-website#sph_configuring-name-based-virtual-hosts).

### Multiple Domains on One Linode

You can host multiple domains on a single Linode. Just point A records for all of the domains to your Linode's IP address. You can set up [virtual hosts](/docs/hosting-website#sph_configuring-name-based-virtual-hosts) so the different websites are displayed correctly for the different domains.

### One Domain on Multiple Linodes

To point one domain at multiple Linodes, point your primary domain (e.g., *example.com*) to the IP address of one Linode. This machine will serve as the *front end* for all the others. Then, set up different subdomains (e.g., *database.example.com*) for the other Linodes, and point each subdomain to the appropriate IP address. The front-end Linode can serve as a proxy for services provided by the other Linodes.

### Third-Party Email

To use a third-party email service, such as Google Apps, create [MX records](/docs/dns-guides/introduction-to-dns-records#sph_mx) for your domain to point to the server hostnames they provide. We have a guide for setting up email with [Google Apps](/docs/email/google-mail). For other third-party email providers, follow the instructions they provide.

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

More Information
----------------

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [DNS Manager](/docs/dns-manager)
- [Introduction to DNS Records](/docs/dns-guides/introduction-to-dns)
- [DNS for Rocket Scientists](http://zytrax.com/books/dns/)



