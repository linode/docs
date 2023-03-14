---
slug: advanced-troubleshooting-dns-problems
description: 'Sometimes DNS problems require advanced troubleshooting techniques. This guide covers helpful command line tools like dig, nslookup, and ping, along with hosts files and A records. ✓ Click here!'
keywords: ['troubleshooting','dns','dns troubleshooting']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-20
modified_by:
  name: Linode
title: "Troubleshooting DNS Issues"
bundles: ['troubleshooting']
authors: ["Tom Henderson"]
---

The most common DNS error is a simple typo, whether it’s from the client or the server. Typos and other incorrect DNS data cause many problems. Even when data is correct, DNS can still be a difficult protocol to troubleshoot.

The DNS process starts at the client, which queries a specified upstream DNS server. The upstream DNS server could already have the answer in its cache. In which case, an IP address is answered and the query is resolved. If not, it queries further upstream until a successive answer is given, which is authoritative for the query. The Top Level Domain (TLD), such as a .com, .net, or org, may be the root authority for a query. Authoritative servers on a local network may also be the correct resolver.

Possible causes of unsatisfied queries include:

-   No network circuit path from the client to the specified DNS server.
-   The specified DNS server might not have the query credentials needed.
-   The cached information on the specified DNS server could be out of date.
-   The specified DNS server may have no upstream path to a TLD server.

Fortunately, there are a variety of tools available for Windows, macOS, and Linux used to troubleshoot DNS problems. Most DNS troubleshooting tools focus on tracing the circuits to a DNS resolver or querying DNS servers for a correct response.

## Tracing the Resolver Network Circuit

Clients must be able to reach the DNS server with a query. The most common failure is an interruption in the network circuit between the client app and the desired DNS server.

Each client declares a default DNS server for DNS queries. If the address of the default DNS server is incorrect, or points to an unavailable resource, there can be no resolution to the request. In this case, the requesting application receives an error, or simply hangs. The IP address of the default DNS server must be known to troubleshoot further.

The IP address of the default DNS server is found in the properties of the network adapter in use. To find yours, follow the instructions below for your operating system:

### Windows

1.  Right-click the network icon in the **Notification Area** of the **Taskbar**.

2.  Choose **Network and Internet Settings**.

3.  Select your network adapter.

4.  Scroll down to reveal the settings for that network adapter.

### macOS

1.  Click the network icon in the **Menu Bar**.

2.  Click **Network Preferences**.

3.  Select your network adapter.

4.  Click **Advanced**.

5.  Click **DNS** to reveal the settings for that adapter.

### Linux

In Linux, the location of the desired DNS server depends on the values set in the resolver configuration file located at `/etc/resolve.conf`.

To find these values via the command line, enter:

    cat /etc/resolve.conf

To find these values via the GUI in Ubuntu 22.04 LTS:

1.  Click network icon in the GNOME Panel.

2.  Select your network adapter.

3.  Click **<adapter/connection/device> Settings**.

4.  Click the gear icon next to your chosen adapter/connection/device

Knowing the desired address helps trace the circuit to determine if the desired DNS server can be reached.

## Circuit Testing with Ping

Troubleshooting the network communications circuit uses common tools like `ping`. Many queries fail because there is no network circuit to the desired DNS server. The `ping` command line tool is universal to all operating systems and does not require administrative rights.

Open a command line and use `ping` to determine if the IP address responds. In this case, the public DNS server for Cloudflare (`1.1.1.1`) is cited:

    ping 1.1.1.1

Or:

    ping cloudflare.com

When a reply is returned, queries can be made to the server, in which case, skip to the next section.

If there is no reply using `ping`, then the circuit is unusable and the requested resolver is not responding. This can be because it’s under attack, dead, or offline. Specify another resolver/DNS server and repeat the attempt.

An unusable circuit, or route to a DNS server, means that an Internet connection is down for the host making queries. If the circuit is up, another DNS server can be used, and must be placed in the host's settings. Reset the host to restart the network stack and read the new DNS server entry. Such alternate DNS Internet servers are `1.1.1.1` for Cloudflare, and `8.8.8.8` for Google.

{{< note respectIndent=false >}}
The `traceroute` command line tool is also handy in network circuit analysis. It uses either an IP address or a Fully Qualified Domain Name (FQDN) to show latencies between the host and the desired IP address/FQDN.
{{< /note >}}

## Tracing Resolvers with NSLookup

Windows, macOS, and Linux contain the command line tool, `nslookup` (Name Server Lookup). It performs a query on a known address, using the default DNS resolver, unless another resolver is specified.

    nslookup google.com

Renders:

{{< output >}}
    nslookup google.com
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
{{< /output >}}

Here, the default nameserver is Cloudflare.com’s public DNS server (one.one.one.one), with an IP address of `1.1.1.1`. It uses a cached (non-authoritative) answer for the queried server (google.com). It then renders three lines of IPv6 addresses and six lines of IPv4 addresses.

When there’s a working network circuit available, `nslookup` permits changing the nameserver so that entries among differing nameservers can be compared. When a TLD FQDN entry is changed, it can take as long as 48 hours to be uniform among nameservers/resolvers. This is because non-authoritative servers cache entries using a Time-To-Live (TTL) variable for speedier response. The answer is delivered from cache, without looking up the answer on the next higher-level server. When the cache expires on DNS servers/resolvers/nameservers, a request from a higher authority renews the cached and delivered answer.

## Start of Authority (SOA)

Every domain used publicly in DNS has a registrar. The registrar keeps a record of ownership, which may not be visible to the public. The entry in this record that must be made public is the IP address(es) of its nameservers. The nameservers/resolvers, in turn, are the guardians of the DNS for TLDs.

An organization that hosts a domain generally also contains its nameserver, and is the SOA for the domain and any subdomains underneath it. TLD resolvers such as .com, .net, and .org, are highly controlled. They are only accessible through other servers using the DNS Security Extensions (DNSSEC) authentication and security protocol.

Hosting organizations like Linode may also use other Content Distribution Networks (CDNs) who provide a presence where heavily-used sites manage IP and DNS access. CDNs are not covered by this guide, because their troubleshooting often requires tools that only the CDNs can provide. Nonetheless, these sites must respond appropriately when a host makes a query.

### Dig

The most popular client-side DNS query tool beyond `nslookup` is `dig` (Domain Information Groper). The `dig` app must be downloaded to Windows as part of the [bind package](https://www.isc.org/download/), which also includes an optional DNS server. The `dig` command is included with most versions of macOS and Linux.

The `dig` tool allows specific DNS records to be queried. This includes MX (mail), A records (domain), TXT records (specifically recorded details), and other host records included in the SOA nameserver.

An example of the `dig` output shows its command line configuration:

    dig linode.com

The output looks similar to:

{{< output >}}
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
{{< /output >}}

Options for the `dig` command include:

-   `+trace`, which queries DNS servers to the SOA.
-   `ANY`, which finds ALL records, not just the default A record.
-   `+f <filename>` which calls the hosts listed in the specified file.

The SOA can be found, and the path to it queried, to see if records match. This allows DNS resolvers along the path to the SOA to be adjusted for longer/shorter TTL caching. This accommodates records that change frequently, such as DynamicDNS records in Active Directory environments.

### Domain Transfers

When a domain transfer occurs between nameserver registrations, it takes time to propagate to the hundreds of thousands of resolvers that might be contacted. The `dig` command is the handiest tool to find outdated cache or incorrect entries.

## The Hosts File

Windows, macOS, and Linux look to a hosts file before trying to resolve a DNS address. The hosts file pre-dates DNS in many ways, and takes precedence over DNS or attempts to use a resolver.

When present and filled in, the hosts file is the first resolver in any host. In Windows, this file is located in the `\system32\hosts` entry. On macOS and Linux, it’s located in the `/etc/host` file.

The hosts file is canonical, meaning that it overrides any resolver and cannot be violated. When tracing odd DNS access problems, look for the presence of this file, and use a text editor to examine its contents. Entries may be administratively placed to prevent access to specific sites. It is sometimes used as a “private DNS” to control system behavior and prevent typos from permitting access to typo-based malware sites. The hosts file must be altered to allow subsequent access through a resolver to such sites.

## Walled Gardens and Captive Portals

Walled Gardens and Captive Ports are terms for the same environment. Essentially, barriers presented by network access providers, such as “Free WiFi” services deployed in public spaces, shops, schools, and government facilities. These offerings are controlled through an access control host/router to a network, whether wired or wireless. All DNS or IP address calls are intercepted, and focused to an authorization device.

After supplying sufficient credentials, a user is provided either confined or open access. Within the Captive Portal or Walled Garden, DNS calls are often intercepted and routed through local or cloud-based DNS servers/resolvers. They resolve requests using their own entries, which may not be the public DNS entry for a user.

The “wall” in the Walled Garden provides confined access, typically limiting access to social media, adult websites, or other sites chosen by the provider. Although browser DNS-over-HTTPS protocols can sometimes “leap” over, or bypass, these walls, some browsers do not support this protocol.

To regain access, re-load the network stack and use a public resolver like Cloudflare’s `1.1.1.1` or Google’s `8.8.8.8`.

## DNS Poisoning

The answers provided by DNS servers are listed in the DNS server/resolver’s tables. Access to these tables is usually highly limited. When DNS is correctly configured for host security, it limits how DNS entries can be changed.

It’s possible to poison DNS servers intentionally with spurious entries in an attempt to hijack browser activity. When performed by bad actors, these entries can focus browser requests to malware, crypto routines, or competitors.

Administrators regularly use `dig` and a file of test hosts to compare changes in entries. The value of the test is to show when the list of hosts has changed, and for what reason. A changed address in a popular site may mean its entry has been hijacked upstream, locally, or even at a TLD server. It may also mean the IP address has simply been changed administratively. Poisoned entries must be deleted where possible.

## Hosting Provider Problems

A hosting provider, or the domain registrar, can flush DNS cache, including informing upstream/downstream providers where they’re connected. Administrators making changes in DNS entries face a problem with the cache TTL/life in both up and downstream servers. Changes can be quick to propagate where CDN and other services, such as Akamai and Cloudflare, are the stored address for downstream servers.

### Records

Each host provides a mandatory A record that points to the IP of the receiver of domain targets. The CNAME record provides an alias for queries, allowing aliases for “www” or other common domain prefixes.

DNS MX records point to mail. Most hosting providers run mail through an application, such as cpanel. Email entries for a domain are rejected because of missing mail-focused domain keys used in:

-   Transport Layer Security (TLS)
-   DomainKeys Identified Mail (DKIM)
-   Sender Policy Framework (SPF)
-   Domain Message Authentication Reporting and Conformance (DMARC)

These entries must be valid, and the mail engine used must comply with the DNS records for the domain.

Host provider email records are entered in the provider’s DNS record for a domain, or maintained separately by a domain administrator.

### Alterations

Some host providers and registrars lock DNS records so that they cannot be changed by fraudulent or unauthorized access. To prevent hijacking and fraud, the locks placed on records require obtaining a key, providing credentials, or other verification obstacles.

The authentication credentials needed to change DNS records should be stored carefully. A re-authentication attempt usually requires time and multiple methods of authentication to obtain. Domain hijacks occur when credentials are guessed, spoofed, or heavily attacked.

## Conclusion

Simple typos are a huge problem. So are network outages that initially appear to be DNS problems. Verifying accuracy and the network path fixes many DNS outages. User/host configuration problems, especially an incorrect default DNS/resolver, can also be quickly checked.

When resolvers must be checked, the toolkit can be simple. Much information can be revealed about the listings inside resolvers using `nslookup` and `dig`. Data can be compared from period to period.

Complying with a hosting provider’s documentation allows you to keep complete records that cooperate with the provider, their services, and email.

DNS servers are not invulnerable. They can be poisoned. It’s good practice to check important records on a periodic basis to test listing integrity, especially before users fill the support email box.
