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
title: Domain Name System (DNS)
external_resources:
- '[DNS Manager](/docs/networking/dns/dns-manager)'
- '[Introduction to DNS Records](/docs/dns-guides/introduction-to-dns)'
- '[DNS for Rocket Scientists](http://zytrax.com/books/dns/)'
---

Now that you've set up a Linode and started hosting a website, it's time to point a domain name at your server and website. To do that, you'll use something called the *Domain Name System (DNS)*, which is the Internet's address book. DNS is responsible for directing web traffic to your Linode and emails to your inbox. It maps memorable domain names like *example.com* to IP addresses like `12.34.56.78`. This guide provides users a greater understanding of DNS concepts. To set up your DNS records please see our [DNS Manager](/docs/networking/dns/dns-manager), [Reverse DNS](/docs/networking/dns/setting-reverse-dns), and [Common DNS Configurations](/docs/networking/dns/common-dns-configurations) guides.

How DNS Works
-------------

Before adding any DNS records, you should learn the basics of DNS. You'll start by dissecting a domain name, and then you'll learn about the mechanics of DNS resolution, including name servers, zone files, and individual DNS records.

### Domain Names

Domain names are best understood by reading from right to left. The broadest domain classification is on the right, and become more specific as you move to the left. In the examples below, the top-level domain, or *TLD*, is *.com*.

    example.com
    mail.hello.example.com

Every term to the left of the TLD and separated by a period is considered a more specific subdomain, although conventionally, first-level subdomains plus their TLDs (*example.com*) are referred to as "domains." Moving to the left, *hello* and *mail* are the second- and third-level subdomains, respectively. Typically, subdomains are used to uniquely identify specific machines or services, but this is left up to the domain owner.

### Name Servers

Choosing and specifying *name servers* is an essential part of domain ownership. If you don't, the Internet won't know where to find your DNS information, and your domain won't resolve. Name servers host a domain's DNS information in a text file called the *zone file*. They're are also known as Servers of Authority (SOAs). You can host your DNS information on name servers in one of several locations:

-   Linode (recommended)
-   Your registrar
-   Your own DNS server
-   Third-party DNS hosting

Using Linode's free name servers is the easiest approach, because Linode provides a default zone file with all the right IP addresses for your website and email. For basic DNS setups and many advanced ones, Linode's name servers will work beautifully. However, you can also look into the options offered by your registrar and third-party DNS hosts, or host your own DNS if you want to take control of as much of the DNS process as possible.

You'll specify name servers on your domain registrar's website. They'll take care of publishing that information to the higher-level name servers. You'll want to specify at least two name servers. That way, if one of them is down, the next one can continue to serve your DNS information.

### DNS Records and Zone Files

The next aspect of DNS management is specifying DNS records, which actually match domain names to IP addresses. The DNS records are then automatically bundled up into a zone file, which is what allows the Internet to look up the correct IP address for your domain. If you decide to use Linode's name servers, our DNS Manager will help you create a default zone file. It contains records similar to the following:

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

The scenario described above is what happens if the ISP has no current information about the requested domain. In actuality, ISPs cache a lot of DNS information after they've looked it up the first time. This results in faster lookups and less strain on DNS servers. Usually caching is a good thing, but it can be a problem if you've recently made a change to your DNS information, like when you move to Linode from a different hosting provider. In those cases, you'll want to pay attention to your zone file's [time to live (TTL)](/docs/networking/dns/dns-manager#setting-the-time-to-live-or-ttl) so that your DNS change happens as quickly as possible.

Next Steps
----------

Now that you are familiar with how DNS works, you will want to set up your domain zone and DNS records. You can do this by following our [DNS Manager](/docs/networking/dns/dns-manager) and [Reverse DNS](/docs/networking/setting-reverse-dns) guides. To learn basic configurations, please review [Common DNS Configurations](/docs/networking/dns/common-dns-configurations).





