---
slug: dns-and-user-privacy
title: "An Introduction to DNS and User Privacy"
description: 'Discover how DNS impacts user privacy and explore solutions such as DNS over HTTPS (DoH) and DNS over TLS (DoT) to enhance security, protect data, and safeguard traffic.'
keywords: ['dns and user privacy','dns','domain name service','user privacy','dns over tls','dns over http','dot/doh dns server']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-06-09
modified_by:
  name: Linode
external_resources:
- '[RFC 9076: DNS Privacy Considerations](https://www.rfc-editor.org/rfc/rfc9076.html)'
- '[DNS Privacy Project: Why Is DNS a Privacy Concern?](https://dnsprivacy.org/the_problem/)'
---

You can do everything you can to secure your Web traffic. Use a VPN when you travel. Enable multi-factor authentication where possible. And yet, for all these precautions, an attacker may still be able to access your online behavior.

That’s because the Domain Name System (DNS), the key protocol underlying most Internet services, doesn’t encrypt user traffic by default. It’s virtually impossible to access any website without a DNS lookup. Therefore anyone with access to your DNS queries can know where you go online.

This personally identifiable information is a potential gold mine for advertisers, data brokers, law enforcement, intelligence agencies, and criminals. DNS traffic gives such actors the ability to build profiles about where you visit, and how often. All without the need to see the actual contents of your web traffic.

In response to this privacy risk, the Internet Engineering Task Force (IETF) developed two standards for authenticating and encrypting DNS traffic: [DNS over Transport Layer Security (DoT)](https://www.rfc-editor.org/rfc/rfc7858) and [DNS over HTTP (DoH)](https://www.rfc-editor.org/rfc/rfc8484). Although both use TLS tunneling, they have different implications when it comes to user privacy.

This guide explains why DoT or DoH are needed, how each mechanism works, and how to enable them.

## What About Existing Security Mechanisms?

There are many security technologies already available, but they don’t really protect the privacy of DNS traffic.

HTTPS establishes encrypted tunnels between web browsers and servers using TLS, shielding data in flight from interception. HTTPS protects most user data, but not DNS. That’s because an unencrypted DNS lookup occurs *before* a browser sets up a TLS tunnel. Even with HTTPS in use, an attacker may still be able to intercept or alter unencrypted DNS traffic.

VPNs offer somewhat better protection from snooping, since they usually tunnel all traffic, including DNS. The potential downside is that VPN security rests on the assumption that the DNS servers are trusted. Many commercial VPN services perform data mining on customers’ DNS traffic. There’s no guarantee that a commercial service isn’t monetizing or otherwise sharing DNS data.

Commercial VPN providers, and some cloud DNS providers, may even redirect DNS traffic, sending users places other than intended. In fact, Google started its popular 8.8 cloud-DNS service after another provider, OpenDNS, [began redirecting queries for Google sites to its own search engine](https://www.dnsfilter.com/blog/paul-vixie-and-peter-lowe-on-why-doh-is-politically-motivated). DNSSEC would have prevented this, but that requires a nontrivial amount of server configuration (see our guide [How to Secure DNS With DNSSEC](/docs/guides/dnssec)).

In short, a VPN does not guarantee DNS privacy. Only mechanisms intended to authenticate and encrypt DNS, coupled with the use of a trusted DNS server, can do that.

## What Is DNS over TLS (DoT)?

DoT authenticates and encrypts DNS traffic to protect it from interception or forgery. It uses TLS, the same tunneling method used by HTTPS. DoT sets up TLS tunnels over UDP, just like unencrypted DNS traffic. DoT uses UDP port 853, allowing network managers to identify it distinctly from other applications.

## What Is DNS over HTTP (DoH)?

DoH works at the application layer, typically in a Web browser. It encrypts DNS queries and responses by TLS-tunneling them over [HTTP](https://www.rfc-editor.org/rfc/rfc9110) or [HTTP/2](https://www.rfc-editor.org/rfc/rfc9113). Like DoT, DoH’s encrypted tunnels prevent an attacker from intercepting or forging DNS traffic in flight.

Because DoH works at the application layer, [it may require more coding and more libraries to implement](https://www.dnsfilter.com/blog/dns-over-tls). Also, the added HTTP encapsulation overhead very slightly increases network latency.

DoH traffic uses TCP port 443, the same as other tunneled web traffic. On the wire, a network manager isn’t able to distinguish DoH from any other HTTPS traffic. Neither does any sort of middlebox such as a next-generation firewall or intrusion detection/prevention system.

## DoT vs. DoH Considerations

In terms of user privacy, DoH may seem preferable because it encrypts all traffic, including DNS, from client to server. If the greatest concern is interception at an airport or coffee shop, either DoT or DoH offer adequate safeguards. In practice, choosing between DoT and DoH is somewhat more complicated. It may involve economic and even political tradeoffs.

DoH hides DNS traffic from all intermediary "on-path devices". This includes the user’s underlying operating system, ad blockers, the security policy of the user’s organization, the user’s ISP, and all middleware boxes. Because DoH appears to be regular HTTPS traffic, an on-path device can’t easily block it without also dropping all other HTTPS traffic.

However, DoH’s protection may be illusory. The operator of the DNS server still sees DNS queries. If that operator is an ISP, hosting provider, or cloud-based DNS service, it may be data-mining traffic for monetary or (in the case of state-run ISPs) political gain.

While Google is a major DoH proponent, the company derives most of its revenue from data-mining user traffic for resale to advertisers and other data brokers. This includes DNS traffic. In its defense, Google offers opt-out mechanisms and other privacy safeguards. Other actors engaged in customer data-mining do not offer the same protections.

In this regard, DoH critics say the technology’s real aim isn’t privacy, but rather disintermediation of all other on-path actors. Paul Vixie, a DNS pioneer and DoT advocate, describes DoH as ["an economic and political project masquerading as a technical project"](https://www.dnsfilter.com/blog/paul-vixie-and-peter-lowe-on-why-doh-is-politically-motivated).

Many organizations want total control of their DNS traffic. Some do an end-run around DoH by setting up proxy servers at their perimeters that decrypt and re-encrypt all HTTPS traffic for inspection. A relatively benign example would be a corporation using proxies to block access to malware sites. A less benign example would be an authoritarian government using proxies to block access to DNS servers it does not operate.

From a network management standpoint, DoT is arguably the preferable approach. It uses a separate, well-known port number (UDP port 853). This lets network administrators choose to enable or disable access to encrypted DNS as their policies require.

For users, DoT offers greater transparency. Any attempt to block or tamper with encrypted DNS traffic is immediately apparent (because the DNS query fails). DoT’s dedicated port number also allows measurement of DNS traffic, which can be useful in both troubleshooting and capacity planning.

## Server Support for DoT/DoH

[Bind 9](https://www.isc.org/bind/), the most widely used DNS server software, natively supports both DoT (starting in version 9.17.7) and DoH (starting in version 9.17.10). This support covers Linodes running Ubuntu 22.04 LTS, since this distribution includes Bind version 9.18.1.

To add DoT support to a recursive server running Bind 9, add these lines to `/etc/bind/named.conf`. This example assumes you’ve used [Let’s Encrypt to generate a TLS certificate and key for your DNS server](/docs/guides/install-lets-encrypt-to-create-ssl-certificates/). Substitute the full paths and names of your certificate and key files as appropriate:

```file {title="/etc/bind/named.conf" lang="aconf"}
tls mytls {
  cert-file "/path/to/fullchain.pem";
  key-file "/path/to/privkey.pem";
};

options {
  ..
  listen-on port 53 { any; };
  listen-on-v6 { any; };
  listen-on port 853 tls mytls { any; };
  allow-transfer { none; };
  allow-recursion { 127.0.0.1; ::1; };
  recursion yes;
};
```

This configuration listens for DNS requests on any IP address and allows recursion only on the `localhost` addresses. It also allows both unencrypted and encrypted DNS queries on ports 53 and 853, respectively. To configure Bind to support only DoT queries, omit the port 53 line. However, since client support for DoT or DoH is not yet widely implemented by default, that omission would likely cause many queries to fail.

[Configuration of DoH support in Bind is similar to that for DoT](https://www.isc.org/blogs/bind-implements-doh-2021/#:~:text=The%20February%202021%20development%20release,analyse%2C%20intercept%2C%20and%20modify.). The main difference is that Bind listens for encrypted queries on TCP port 443 instead of UDP port 853. These sections in `/etc/bind/named.conf` add support for DoH by running a web server on TCP ports 80 and 443. Substitute the full paths and names of your certificate and key files as appropriate.

```file {title="/etc/bind/named.conf" lang="aconf"}
tls mytls {
  cert-file "/path/to/fullchain.pem";
  key-file "/path/to/privkey.pem";
};

# HTTP endpoint description
http local-http-server {
  # multiple paths can be specified
  endpoints { "/dns-query";  };
};

options {
  listen-on port 53 {any;};
  listen-on-v6 port 53 {any;};
  allow-recursion {any;};
  # default ports for HTTP and HTTPS
  http-port 80;
  https-port 443;

  # example for encrypted and unencrypted DoH
  # listening on all IPv4 addresses.
  # port number can be omitted
  listen-on port 443 tls mytls http local-http-server {any;};
  listen-on port 80 http local-http-server {any;};


  # the same for IPv6
  listen-on-v6 port 443 tls mytls http local-http-server {any;};
  listen-on-v6 port 80 http local-http-server {any;};
};
```

The [Name Server Daemon (NSD)](https://www.nlnetlabs.nl/projects/nsd/about/), another widely used DNS server, supports DoT but not DoH because it is an authoritative-only name server. DoH’s end-to-end encryption model requires recursion, which NSD doesn’t support. For example, the NSD server isn’t able to provide a response to a DNS query for Amazon.com because the underlying query requires recursion. Instead, use NSD’s companion server, [Unbound](https://nlnetlabs.nl/projects/unbound/about/), which supports recursion, DoT, and DoH.

To configure NSD for DoT, modify `/etc/nsd/nsd.conf` as follows:

```file {title="/etc/nsd/nsd.conf" lang="aconf"}
server:
    ip-address: 192.0.2.2
    ip-address: 192.0.2.2@853
    tls-service-pem: "/path/to/fullchain.pem"
    tls-service-key: "/path/to/privkey.pem"
```

As with the Bind examples, this configuration listens for unencrypted queries on UDP port 53 and encrypted DoT queries on UDP port 853. The other sections of `nsd.conf` do not need to be altered to support DoT.

To support DoT in Unbound, point to forwarding servers over UDP port 853. In Ubuntu 22.04 LTS, configure `/etc/unbound/unbound.conf` to include this section:

```file {title="/etc/unbound/unbound.conf" lang="aconf"}
forward-zone:
  name: "."
  forward-tls-upstream: yes		# use DNS-over-TLS forwarder
  forward-first: no			# do NOT send direct
#	# the hostname after "#" is not a comment, it is used for TLS checks:
  forward-addr: 9.9.9.9@853#dns9.quad9.net
  forward-addr: 149.112.112.112@853#dns.quad9.net
```

This example forwards encrypted recursive queries to servers at [Quad9](https://www.quad9.net/), a privacy-focused DNS cloud provider.

Unbound also supports DoH, but only over HTTP/2 and only in versions 1.13.1 or later. [Earlier releases also support DoH](https://bugs.launchpad.net/ubuntu/+source/unbound/+bug/1927877), but require manual compiling with support for the `nghttp2-dev` library enabled.

[To configure Unbound for DoH](https://unbound.docs.nlnetlabs.nl/en/latest/topics/privacy/dns-over-https.html), change `/etc/unbound/unbound.conf` to listen on port 443 and point to your certificate, key paths, and files as appropriate:

```file {title="/etc/unbound/unbound.conf" lang="aconf"}
server:
    interface: 192.0.2.2@443
    tls-service-pem: "/path/to/fullchain.pem"
    tls-service-key: "/path/to/privkey.pem"
```

## Client Support for DoT/DoH

[Ubuntu Linux](https://support.quad9.net/hc/en-us/articles/4409119438349-DNS-over-TLS-Ubuntu-20-04-Linux-Mint-20-3-Native-), [Android](https://www.techrepublic.com/article/how-to-enable-dns-over-tls-in-android-pie/), and [macOS](https://support.quad9.net/hc/en-us/articles/4814293189773-Setup-MacOS-and-DNS-over-HTTPS-or-DNS-over-TLS) natively support DoT, without the need for additional software, though [each requires configuration](https://support.quad9.net/hc/en-us/categories/360002571772-Configuration) to enable it.

[macOS](https://support.quad9.net/hc/en-us/articles/4814293189773-Setup-MacOS-and-DNS-over-HTTPS-or-DNS-over-TLS) and [Windows 11](https://support.quad9.net/hc/en-us/articles/4409803338765-DNS-over-HTTPS-Windows-11-Native-) also natively support DoH, although neither enables it by default. Other operating systems can use DoT or DoH via add-on resolver software such as Unbound or [Stubby](https://dnsprivacy.org/dns_privacy_daemon_-_stubby/).

So far, no major web browser natively supports DoT. Two of the most popular browsers, [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/browsers/) and [Google Chrome](https://www.google.com/chrome/), natively support DoH by default. Other Chrome-derivative browsers, such as [Brave](https://brave.com/), [Chromium](https://www.chromium.org/Home/), [Microsoft Edge](https://www.microsoft.com/en-us/edge?exp=e00&ch&form=MA13FJ), and [Vivaldi](https://vivaldi.com/), support DoH [by enabling a **Use secure DNS** toggle](https://www.ghacks.net/2021/10/23/how-to-enable-dns-over-https-secure-dns-in-chrome-brave-edge-firefox-and-other-browsers/). Virtually all other major browsers except [Apple Safari](https://www.apple.com/safari/) have [configurable support for DoH](https://dnsleaktest.org/dns-over-https).

## Conclusion

Effective DNS security depends on four elements: hardening of DNS servers, cryptographic signing of DNS zones, protection of DNS queries and responses in flight, and use of a trusted DNS server.

DNS server security requires one or more secondary servers, keys to authenticate zone updates, and possibly a hidden primary server (see How to [Configure Primary and Secondary Servers](/docs/guides/dns-primary-and-secondary-server-setup)). Signing zones with DNSSEC ensures that the sites you visit really are what they claim to be (see [How to Secure DNS With DNSSEC](/docs/guides/dnssec)).

Either DoT or DoH work well to authenticate and encrypt DNS traffic in flight. If the greatest concern is interception or forgery of DNS traffic, either mechanism protects traffic. DoH has the advantage of being enabled by default in some widely used software (e.g. Windows 11 and Google Chrome). Meanwhile, DoT has the advantage of being easier to identify and control.

But what happens after a DNS query arrives at a DNS server? This is as much a policy question as a technical one. If the DNS server operator cannot provide a clear explanation of its privacy policy, or doesn’t have opt-out mechanisms from data-mining of customer traffic, it’s probably time to find a different operator.

Self-hosting DNS helps, but only up to a point. Almost all DNS servers point to larger forwarding servers for recursive queries. The same concerns about data-mining apply for these forwarding servers.

In the end, DNS privacy relies on an end-to-end combination of tools and trust. This includes DNSSEC to validate zone contents, DoT or DOH to protect DNS traffic in flight, and trusted privacy-focused DNS services to handle both authoritative and recursive queries.
