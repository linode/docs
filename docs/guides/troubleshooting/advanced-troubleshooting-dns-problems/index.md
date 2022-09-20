---
slug: advanced-troubleshooting-dns-problems
author:
  name: Tom Henderson
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['troubleshooting','dns','dns troubleshooting']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-20
modified_by:
  name: Linode
title: "Advanced Troubleshooting DNS Problems"
h1_title: "Advanced Troubleshooting DNS Problems"
enable_h1: true
contributor:
  name: Tom Henderson
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}



The most common DNS error is the simple typo, whether it’s from the client or the server. Typos and other incorrect local and upstream DNS data cause many problems. Even when data is correct, DNS can still be a difficult protocol to troubleshoot. There are a variety of tools available in Windows, macOS, and Linux used to troubleshoot DNS problems.

The DNS process starts at the client, which queries a specified upstream DNS server. The upstream server either already has the answer in its cache, or queries further upstream until an IP address is answered, and the query is resolved. The IP address can be pulled from the answering DNS server as answers are cached until a successive answer is given by the server, which is authoritative for the query. The Top Level Domain (TLD) authority may be the root authority for a query, such as a .com, .org, .eu or other TLD server. Authoritative servers on a local network may also be the correct resolver.

There are several causes of unsatisfied queries, where errors begin. Possible errors include no network circuit path to the specified DNS server, or the specified DNS server may have no upstream path to a TLD server. The specified DNS server might not have the query credentials needed. The cached information on the specified server could be out of date and render a result that is incorrect.

There are both simple and complex tools to test DNS queries. Often, the problem is a typo, but there are many situations that can render unusable results.

## Troubleshooting Tools

Most DNS troubleshooting tools focus on two activities:
racing the circuits to a desired/default DNS resolver.
Querying specific DNS servers for correct response.

Tools are available for troubleshooting, but may not be included in Windows, macOS, or Linux distributions.

### Tracing the Resolver Network Circuit

Client instances must be able to reach the server with a query. The most common failure is an interruption in the network circuit between the client app making the query (a browser, app, or tool), through the host’s networking stack, then through a working network circuit to the desired DNS server.

Each client operating system configuration declares a default DNS server used for DNS queries. A second, optional DNS server is also often available for queries. The IP address of the preferred/default/primary DNS server must be known to troubleshoot further. If the address of the DNS default server is incorrect, or points to an unavailable resource, there can be no resolution to the request, and the requesting application receives an error or simply hangs.

Most operating systems support the command line app nslookup. The default DNS server IP address is found in the property sheet of the network adapter in use.

Right-click the currently connected adapter, and its DNS address is revealed.

In Windows,ight-click the network icon in the Notification Area of the Taskbar, choose Network and Internet Settings, and the settings for each network adapter known to Windows is revealed.

In macOS, the DNS server listing is found in the System Preferences app under Networkby clicking the network icon on the top status bar and choosing Network Preferences.

In Linux, the location of the desired DNS server depends on the values set either in the GUI, or by using in the resolver configuration file located at /etc/resolve.conf. This value can be found on the command-line:

cat /etc/resolve.conf

Click network icon, choose device/connection, click Wired Settings, click gear icon next to chosen device/connection, scroll down.
Or in systems using systemd control:

systemd-resolve –status

Knowing the desired address helps trace the circuit to determine if the desired DNS server can be reached through the network circuit.

Troubleshooting the network communications circuit uses common tools like ping. Many queries fail because there is no network circuit to the desired DNS server. ping command line tool does not require administrative rights.

From Windows, open a command line and use ping to determine if the IP address responds. In this case, the public DNS server for Cloudflare is cited (1.1.1.1):

ping 1.1.1.1

Or:

ping cloudflare.com

When a reply is returned, queries can be made to the server. See the next section.

If there is no reply using ping, then the circuit is unusable and the requested resolver is not responding. This can be because it’s under attack, dead, or offline. Specify another resolver/DNS server and repeat the attempt.

An unusable circuit, or route to a DNS server, means that an Internet connection is down for the host making queries unless the host knows all the IP addresses of the desired servers. If the circuit is up, another DNS server can be used, and must be placed in the settings appropriate for the host. Restart the network stack to read the new DNS server entry. This usually requires resetting the host. Such alternate DNS Internet servers are 1.1.1.1 for Cloudflare, and 8.8.8.8 for Google’s resolver.

In macOS, the ping command is used from the Terminal. Go to Finder>Applications>Utilities>Terminal or locate Terminal in Launchpad.

In Linux, open a terminal, often Alt-F2, using the same method to determine if a reply works.

The traceroute command line tool is also handy in network circuit analysis. Traceroute uses either an IP address or a Fully Qualified Domain Name (FQDN) to show latencies in network circuits between the host and the desired IP address/FQDN.

### Testing Resolvers

Windows, macOS, and Linux contain the command line tool, NSLookup (Name Server Lookup) tool. This tool performs a query on a known address, using the default DNS resolver, unless another resolver is specified.

nslookup google.com
Renders:

C:\Users\henry10>nslookup google.com
Server:  one.one.one.one
Address:  1.1.1.1

Non-authoritative answer:
Name:	google.com
Addresses:  2607:f8b0:4004:c19::8a
      	2607:f8b0:4004:c19::71
      	2607:f8b0:4004:c19::8b
      	2607:f8b0:4004:c19::64
      	64.233.177.138
      	64.233.177.139
      	64.233.177.102
      	64.233.177.101
      	64.233.177.100
      	64.233.177.113

In the example above, the default nameserver, (one.one.one.one, also known as Cloudflare.com’s public DNS server) whose IP address is 1.1.1.1, uses a cached (AKA Non-Authoritative) answer, for the queried server named google.com, and renders three lines of IPv6 addresses and six lines of IPv4 addresses.

When there’s a working network circuit available, nslookup permits changing the nameserverso that entries among differing nameservers can be compared. When a TLD FQDN entry is changed, it can take as long as 48 hours to be uniform among nameservers/resolvers. This is because non-authoritative servers cache entries using a Time-To-Live (TTL) variable for speedier response. The answer is delivered from cache, without looking up the answer on the next higher-level server. When the cache expires on DNS servers/resolvers/nameservers between the initial server queried, a request from a higher authority renews the cached and delivered answer.

## Start of Authority (SOA) and Domain Transfers

Every domain used publicly in DNS has a registrar. The registrar keeps a record of ownership, which may not be visible to the public. The entry in this record that must be made public is the IP address(es) of its nameservers. The nameservers/resolvers, in turn, are the guardians of the DNS for TLDs.

Generally, an organization that hosts a domain, also contains its nameserver, and is the SOA for the domain and any subdomains underneath it. TLD resolvers such as .com, .uk, .org, are highly controlled, and are accessible only through other servers using the DNS Security Extensions (DNSSEC) authentication and security protocol.

Hosting organizations like Linode may also use other Content Distribution Networks (CDNs) who provide a presence where heavily-used sites manage IP and DNS access. CDNs and other theories of DNS and IP access are not covered by this troubleshooting guide, because their troubleshooting often requires tools that only the CDNs can provide. Nonetheless, these sites must respond appropriately when a host makes a query.

The most popular client-side DNS query tool beyond nslookup is dig (Domain Information Groper). The dig app must be downloaded to Windows as part of the bind package. The bind9 package also includes an optional DNS server. The dig command line app is included with most versions of macOS and Linux.

The dig tool allows specific DNS records to be queried, such as MX (mail), A records (domain), TXT records (specifically recorded details), and other host records included in the SOA nameserver.

An example of the dig output shows its command-line configuration:

dig linode.com

The output looks similar to:

; <<>> DiG 9.16.30 <<>> linode.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 54592
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 1232
;; QUESTION SECTION:
;linode.com.                	IN  	A

;; ANSWER SECTION:
linode.com.         	300 	IN  	A   	69.164.200.202
linode.com.         	300 	IN  	A   	72.14.191.202
linode.com.         	300 	IN  	A   	72.14.180.202

;; Query time: 62 msec
;; SERVER: 1.1.1.1#53(1.1.1.1)
;; WHEN: Thu Jul 14 17:11:03 Eastern Daylight Time 2022
;; MSG SIZE  rcvd: 87

Dig options include +trace, which queries DNS servers to the SOA, ANY (finds ALL records, not just the default A record), and +f <filename> which calls the hosts listed in <filename>.

The SOA can be found, and the path to it queried, to see if records match. This allows DNS resolvers along the path to the SOA to be adjusted for longer/shorter TTL caching. This accommodates records that change frequently, such as DynamicDNS records in Active Directory environments.

When a domain transfer occurs between nameserver registrations, the changed information takes time to propagate to the hundreds of thousands of resolvers that might be contacted. Dig is the handiest tool to find incorrect cache or entries.

## The Hosts File

Windows, macOS, and Linux look to a hosts file before trying to resolve a DNS address. The hosts file pre-dates DNS in many ways, and takes precedence over DNS or attempts to use a resolver.

When present and filled in, the hosts file is the the first resolver in any host. In Windows, this file is located in the \system32\hosts entry. On macOS and Linux, it’s located in the /etc/host file. Some organizations use this as a “private DNS”, or a safety method to catch typos, so that typo-based malware sites are avoided.

If present, it is canonical, meaning that it won’t be violated. When tracing odd DNS access problems, look for the presence of this file, and use a text editor to examine its contents. It overrides any resolver call, is sometimes used to control system behavior, and also prevents typos from permitting access to typo-based malware sites. Entries for specific hosts may be administratively placed to prevent access to specific sites. The hosts file must be altered to allow subsequent access through a resolver to that site.

## Walled Gardens and Captive Portals

Walled Gardens and Captive Ports are terms for the same environment and also barriers presented by network access providers, such as “Free WiFi” services found deployed in public spaces, retailers, malls, and schools/government facilities. These offerings are controlled through an access control host/router to a network, whether wired or wireless. All DNS or IP address calls are intercepted, and focused to an authorization device.

After supplying sufficient credentials, a user is provided either confined or open access. Within the Captive Portal or Walled Garden, DNS calls are often intercepted and routed through local or cloud-based DNS servers/resolvers. They resolve requests using their own entries, which may not be the public DNS entry for a user.

The “wall” in the Walled Garden provides confined access, typically limiting access to social media, porn, or other sites chosen by the provider. Although browser DNS-over-HTTPS protocols can sometimes “leap” over, or bypass, these walls, some browsers do not support this protocol.

To regain access, re-load the network stack and use a public resolver like Cloudflare’s 1.1.1.1 or Google’s 8.8.8.8.

## DNS Poisoning

The answers provided by DNS servers are listed in the DNS server/resolver’s tables. Access to these tables is usually highly limited. When DNS is correctly configured for host security, it limits how DNS entries can be changed.

It’s possible to poison DNS servers intentionally with spurious entries in an attempt to hijack browser activity. When performed by those having illegal access to a DNS server host, these entries can focus browser requests to places that may do harm, are infected with malware, crypto routines, or competitors.

Administrators use the dig app, along with a file of test hosts, and compare the change in entries as a regularly-executed routine. The value of the test is to show when the list of hosts has changed, and for what reason. The reason for a changed address in a popular site may mean that its entry has been hijacked upstream, locally, or even in a TLD server. It may also mean that the IP address has simply been changed administratively. Poisoned entries must be deleted where possible.

## Hosting Provider Problems

A hosting provider, or the domain registrar, can flush DNS cache, including informing upstream/downstream providers where they’re connected. Administrators making changes in DNS entries face the problem with the cache TTL/life in both up and downstream servers. Changes can be quick to propagate where CDN and other services, such as Akamai and Cloudflare, are the stored address for downstream servers.

### Records

Each host provides a mandatory A record that points to the IP of the receiver of domain targets. The CNAME record provides an alias for queries, allowing aliases for “www” or other common domain prefixes.

DNS MX records point to mail. Most hosting providers run mail through an application, such as cpanel. Email entries for a domain are rejected because of missing mail-focused domain keys used in encrypted Transport Layer Security (TLS) or DomainKeys Identified Mail (DKIM) mail, Sender Policy Framework (SPF (a protocol of mail server interaction policies), and Domain Message Authentication Reporting and Conformance (DMARC) date. These entries must be valid, and the mail engine used must comply with the DNS records for the domain.

Where a host provider provides email, these records are entered in the host provider’s DNS record for a domain, or they are maintained separately by a domain administrator.

## Alterations

Some host providers and registrars lock DNS records so that they can not be changed by fraudulent or unauthorized access. The locks placed on records require obtaining a key, providing credentials, or other verification obstacles to prevent hijacking and fraud.

The authentication credentials needed to change DNS records should be stored carefully. A re-authentication attempt usually requires time and multiple methods of authentication to obtain. Domain hijacks occur when credentials are guessed, spoofed, or heavily attacked.

## Conclusion

Simple typos are a huge problem. So are network outages that initially appear to be DNS problems. Verifying accuracy and the network path fixes many DNS outages. User/host configuration problems, especially an incorrect default DNS/resolver, can also be quickly checked.

When resolvers must be checked, the toolkit can be simple. Much information can be revealed about the listings inside resolvers using nslookup and dig. Data can be compared from period to period.

The ability to keep complete records that cooperate with a hosting provider, their services, and email, is often a function of complying with a hosting provider’s documentation for the services in use.

DNS servers are not invulnerable. They can be poisoned. It’s good practice to check important records on a periodic basis to test listing integrity, especially before users fill the support email box.