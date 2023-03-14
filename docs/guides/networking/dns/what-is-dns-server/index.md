---
slug: what-is-dns-server
description: 'What is a DNS server and how does it work? Read our guide to learn about types of DNS servers, why they’re important, and how they work. ✓ Click here!'
keywords: ['what is dns server','dns traffic','dns stands for','dns name resolution','dns requests','example of dns','what is the importance of using dns','domain name ip address','how dns works step by step','what is dns host']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-03-08
modified_by:
  name: Linode
title: "What Is a DNS Server?"
title_meta: "How DNS Works: Step-by-Step Explanation"
authors: ["Jack Wallen"]
---

Without DNS, the internet cannot function. The effects of downed DNS servers around the world lead to outages such that business cannot happen. Websites are unreachable, apps don't work, and data cannot be sent or received.

DNS is the internet’s directory. It takes a request from a web browser (or app) and makes that address routable through a vast expanse of sites.

It’s important for developers to understand what DNS is because they use it in apps. While most people might not hard-code DNS entries, working with DNS is needed for container and cloud-native development, web apps, SPAs, and more.

## What Is a DNS Server?

DNS stands for Domain Name Search. DNS makes it possible to use a name instead of an internet protocol (IP) address. This makes it unnecessary to type in `198.35.26.96`, but instead simply type `wikipedia.org`.

There are different DNS servers available. Generally, a DNS server doesn't need to be configured because IT departments, hosting providers, or ISPs set up Local Area Network (LAN) devices. This automatically assigns desktops, laptops, and other end-user devices to whatever DNS service they use. However, this doesn't mean that they *must* be used. Standard DNS, such as what's provided by ISP's DNS servers, is often considered less secure.

There are new forms of DNS that encrypt DNS traffic so that a third party, or hacker, cannot intercept that information.

Companies like Google and Cloudflare use Secure DNS, which can easily be configured on a desktop. Examples of those servers are:

-   **Google**: `8.8.8.8`, `8.8.4.4`

-   **Cloudflare**: `1.1.1.1`, `1.0.0.1`

### Primary Versus Secondary DNS Servers

Both Google and Cloudflare have two entries each. The first address is the primary and the second is the secondary. Companies do this so there's always a fallback. If Google's `8.8.8.8` server goes down, `8.8.4.4` picks up the slack. As long as both are configured, users do not notice if the primary is down.

If both aren't configured and the primary goes down, no app that requires internet connectivity can work.

### DNS Records

There are three primary types of DNS Records:

-   The **A** Record is the basic DNS record and points a domain (such as `wikipedia.org`) to an IP address.

-   The **CNAME** Record points one domain (such as `www.wikipedia.org`) to another (such as `wikipedia.org`).

-   The **TXT** Record verifies that you own the domain.

## Why Is DNS so Important?

DNS isn't just about making web browsers function properly. DNS also affects any app that communicates with a web server. Take, for instance, an email client. When configuring an email account, non-IP address must be entered for both the incoming and outgoing servers. If DNS isn't working, and the email client requires those servers to translate `mail.example.com` into a valid IP address, emails cannot be received.

This trickles down to nearly every app on a typical end-user device. Without DNS, a lot of work simply cannot be done. Development efforts come to a halt, especially if relying on services like GitHub. This all translates to an absolutely crucial component of the internet.

## Types of DNS Servers

There are three primary types of DNS servers (also referred to as "name servers"):

-   **Primary**: The first point of contact, where names are translated to addresses. It is also called the "authoritative name server".

-   **Secondary**: The second point of contact, should the first point go down. Secondary DNS servers receive all of their information from the Primary DNS servers, so the information is always the same.

-   **Caching**: Stores a list of names to address resolutions, so DNS can happen faster than it would when only using Primary and Secondary servers.

One of the biggest differences between Primary, Secondary, and Caching DNS servers is that only the Primary server is capable of generating zone files. These are plain text files that contain all the records of every domain within a zone. The Secondary DNS server gets the zone file handed down from the Primary. The Caching DNS server doesn't use zone files. Instead, Caching name servers perform queries and store the results.

There are five other types of DNS servers:

-   **DNS Resolver**: Receives DNS queries from web browsers and other types of applications.

-   **DNS Recursor**: Handles queries directly from client machines via web browsers, to prevent those queries from going directly to the Authoritative (Primary or Secondary) DNS server.

-   **Root Name Server**: Translates human-readable names into IP addresses.

-   **Top Level Domain (TLD) Nameserver**: Categorizes websites based on type. The different TLDs include `.com`, `.net`, `.org`, etc.

-   **Authoritative Nameserver**: Attempts to access the record a user queries, and should it have access, delivers the IP address to the DNS recursor.

## Types of DNS Queries

There are three different types of DNS queries:

-   **Recursive** is when a DNS server has to respond with a requested resource record. If the record cannot be located, the user sees an error message.

-   **Iterative** is when a client repeatedly requests a response from numerous DNS servers until either the best response is found, an error occurs, or the query times out. If no match is found, the query is sent to a lower-level DNS client so the process can continue until a match is found.

-   **Non-Recursive** is when queries are resolved by a DNS Resolver when a resource is available because of either a server being authoritative or because the information is already cached.

There are a lot of moving pieces involved in such a simple act. Here is how that flow breaks down in real time:

1.  The user types a name in a web browser, such as `wikipedia.org`.

2.  The name is sent to a DNS resolver, which is usually provided by the ISP or IT department.

3.  The DNS Resolver forwards the request to a DNS Root Name Server.

4.  The DNS Resolver also forwards the request again, to the TLD Name Servers that match the last section of the name, such as `.com`, `.net`, or `.org`.

5.  The DNS Resolver for the ISP chooses a Name Server and forwards the request to that server.

6.  The new Name Server compares the name to its zone file to find a match. If it finds one, it returns the IP address to the DNS resolver.

7.  The Resolver forwards the IP address to the browser, so it then knows where to find `wikipedia.org`.

8.  The web browser then displays the contents of `wikipedia.org`.

It's a complicated process, but one most users don't have to worry about. In fact, when any computer has problems resolving a name, it usually means the network is down. If the network is up, it could mean both Primary and Secondary DNS servers are experiencing trouble. This can be common when an ISP uses its DNS servers. Often, the easy fix is to exchange the ISP server addresses with either Google's (`8.8.8.8`, `8.8.4.4`) or Cloudflare's (`1.1.1.1`, `1.0.0.1`). Given the added security of encrypted DNS, that is generally the best way to go. In some cases, ISPs are already using one or the other.

## How to Troubleshoot DNS Problems

There are a few ways to troubleshoot DNS problems.

The first is to **try using a different web browser**. Sometimes a browser's cache is corrupt, and even if DNS services are working properly, DNS does not work on corrupt data. To resolve this issue, clear the browser's cache or use a different browser.

Another option is to **reboot the computer**. This might also clear a corrupted DNS cache and set things right.

Also try **temporarily disabling the firewall**. If that works, then the problem isn't on the DNS server side, but on the local machine side.

**Clear the DNS cache**. If the web browser isn't capable of finding `wikipedia.org`, clear the OS DNS cache. Note that the procedure may vary, depending on operating system. After clearing the DNS cache, websites may load a bit slower until those address mappings (from name to IP address) are stored in the cache.

## Conclusion

DNS is critical to the functioning of the internet. When any one of the servers goes down, things simply cannot get done. Web browsers don't function, email clients can't send and receive an email, and apps generally don't work. Fortunately, DNS servers rarely go down, so when these types of problems occur, it's usually on the computer or app side of things.