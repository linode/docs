---
slug: ssl
author:
  name: Tom Henderson
  email: thenderson@extremelabs.com
description: 'TLS is a core security protocol that underlies many types of Internet connectivity. This guide explains in-depth how TLS works and how it is used.'
og_description: 'TLS is a core security protocol that underlies many types of Internet connectivity. This guide explains in-depth how TLS works and how it is used.'
keywords: ['what is tls certificate']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-23
modified_by:
  name: Linode
title: "Understanding how TLS works and secures traffic"
h1_title: "Understanding how TLS works and secures traffic"
contributor:
  name: Tom Henderson
  link: http://www.twitter.com/extremelabs
external_resources:
- '[Obtain a Commercially Signed TLS Certificate](https://www.linode.com/docs/guides/obtain-a-commercially-signed-tls-certificate/)'
- '[Install Let's Encrypt to Create SSL Certificates](https://www.linode.com/docs/guides/install-lets-encrypt-to-create-ssl-certificates/)'
---

# Understanding how TLS works and secures internet traffic

The Transportation Layer Security protocol (TLS) is a widely-deployed method to protect and encrypt telecommunications. TLS protects many services, including web traffic, email, and many forms of Instant Messaging (IM). TLS elements may also vet degrees of hosts&#39; authenticity using chains-of-authority while processing communication of many forms. Mutually negotiable certificates are commonly exchanged promoting traceable trust between two hosts.

TLS operates at the Transport Layer (Layer 4) in the ISO/OSI stack. Other popular communications protection mechanisms operate at the Network Layer (IPSec) or the Application Layer (SSH) and even the Presentation Layer (SOCKS). TLS is a TCP-focused protocol, although variants use the Datagram TLS protocol ((D)TLS), which works with out-of-order packet arrival or connections with high error rates and/or jitter. (D)TLS functionality almost completely mimes TLS, however, so the two can be considered synonymous for purposes of discussion.

TLS is operating system agnostic. The supported ciphers and certificate management characteristics of each host is usually a combination of the foundation operating system, in combination with library and/or application resources used with the application and responding service. The applications, host operating systems, and libraries used with two hosts under TLS can be from completely different resources. Yet the connections achieves privacy, encryption, session management, and trust under TLS/(D)TLS.

The TLS trust relationship is established by one host evaluating an offer from another host. The host inspects a certificate for validity, perhaps against a stored reference certificate, a Certificate Authority, or another desired trust fact (such as another factor of security seen in Multi Factor Authentication). The verification process uses weights against a trust score that must be met. Once the host accepts the trust score it proceeds to the next step, encryption selection and establishment; after that&#39;s achieved, the hosts permit encrypted traffic.

The highest-denominator trust and strength of encryption are the most desirable. It can be dangerous to use older cipher suites. Yet some responding hosts may only negotiate a combination that is weaker, and hence more undesirable. Many modern browsers refuse to negotiate `https` with websites using older, more vulnerable cipher suite combinations.

Protocol types have different negotiation methods. TLS for https web surfing is used differently than starttls used for mail exchange. Generally, users don&#39;t see the construction and operational characteristics of TLS used unless an application advises them of a stipulation problem (such as trust or a weak cipher request) and then (in the case of email as an example) only the system administrator may see an error.

Most modern web browsers include a visual indication for users that TLS is working, such as a lock icon seen in the URL address bar. When the lock hasp is in the lock position, often colored green, the connection is protected by TLS, as is the case when `https` works. When it doesn&#39;t work, there is often a hash through the lock symbol, and it&#39;s colored red. When the user clicks on the lock symbol, the browser shows the certificate and encryption relationship between the browser, its host, and the webserver to which it&#39;s connected.

Traffic continues until the certificate expiration time occurs, or until there is an error indicating an alarm condition. Many conditions can trigger an alarm; only a few are considered cause for a recovery. Instead, a new TLS relationship is built between hosts to continue communications, if the conditions causing the error can be successfully removed.

The widest use of TLS trust is used on the Internet between web browsers and applications, and (web) servers. Browsers are provisioned with an initial store of certificate authorities, who are proxy parts of the certificate verification chain. When modern browsers encounter a certificate that is self-signed (self-authoritative), the browser warns the user.

Email exchanges can be covered by TLS, and most are, but this is not a guarantee. Some SMTP hosts are simple, and do not have a TLS mechanism for exchanging mail, or a TLS mechanism used may support weak trust methods or weak ciphers for mail exchange. Email servers supporting TLS aren&#39;t held to as high a standard as web surfing, where `https` has become the mandated default communications privacy protocol.

Encryption requires doing math to solve the formulas used to encrypt and decrypt TLS conversations. This math used to place a high load on CPUs, and this was often poised as the resistance against using TLS, especially in servers where such encryption CPU load was concentrated. Numerous CPU families now offer encryption/decryption optimizations which allow load capacity and scalability for server applications implementing TLS.

TLS has been used for many years, and it is the successor to Secure Sockets Layer/SSL. The Internet Engineering Task Force&#39;s [IETF TLS Working Group](https://datatracker.ietf.org/wg/tls/charter/) is chartered with considering and evolving any changes. Each of the TLS Requests For Comments (RFCs) are published, building to the currently used RFC for TLS 1.3. Backwards compatibility with prior versions is necessary, although the reasons that prior versions of SSL and TLS were deprecated were because they had vulnerabilities with varying degrees of danger.

## The process of TLS encryption and trust

TLS connections are a multi-step process. Here&#39;s how it works.

- An application initiates a TLS connection by connecting to a webserver with https as preamble rather than `http`; TLS is intentional.
- The application and web server do a &quot;hand shake&quot; that initially encrypts the conversation.
- A negotiation begins regarding what cipher suites/encryption methods are to be used.
- Trust credentials are asked for, exchanged, and once established, a session starts in full.

Need more detail?

To initiate a TLS link, a host application requests TLS coverage of another host. In web conversations, that&#39;s accomplished by a browser making a URL request to a webserver specifying the preamble URL of https. As the `https` protocol has become the default with many browsers, so also has it become the default of many servers.

The `https` invocation specifically requests TLS/SSL (although SSL is usually discouraged) with the &quot;s&quot; appended to the http call to the server. A server may mandate or &quot;force&quot; a request for subsequent mandated TLS by taking an https address request call, and answering back with an https connection. If the browser cannot complete the TLS/https protocol, the server &quot;hangs up.&quot;

Once the initiation TLS transaction is done, a relationship between the two hosts occurs, as a stateful entity called a _session_. A series of messages constituting a _handshake_ occurs between the hosts. This establishes message encryption (and therefore privacy), and in TLS 1.3, a single request-and-answer then causes the next parts of the TLS protocol to be encrypted.

Next, the authenticity of the server&#39;s credentials is checked. These are checked against either a local browser certificate cache or against a chain-of-authorities to a [Certificate Authority](https://www.linode.com/docs/guides/obtain-a-commercially-signed-tls-certificate/). If all matches correctly, a session is established. It may have a stated maximum lifetime/expiration.

Once the TLS connection is made between the two hosts, it&#39;s time to pick common encryption mechanisms/ciphers (and hopefully the highest common denominator between the two hosts). In the web service example, a browser has trust information presented by the web service. The browser looks to either its own cache of certificates, or to a chain-of-authorities statement made by the webserver to prove its trust. If trust can be proven satisfactorily, and multiple options are possible, then a trust relationship is established (or rejected, ending the conversation).

Subsequent communications within the session is monitored by both hosts for out-of-normal conditions during exchanges until the authentication method chosen expires or has an alarm condition. Either host may tear down the session when it perceives that the session finishes, the session expires (the certificate is no longer valid or dies in other ways), or an alarm condition causes session termination.

Canonically, the TLS conversation proceeds thusly:

1. A host makes a request to another host to begin a TLS conversation. This often uses an established IP address at a specific port (as ports represent application portals). Common ports are `443`, `80`, `8080`.

2. The responding host replies to the requesting host, offering a choice of cipher or hash options.

3. The requesting host chooses a hash option offered, and then responds with a credentials request, now encrypted under the chosen option. Each side may have a minimum satisfactory option for a cipher and hash option set. The highest denominator between them is preferred, as older cipher options are sometimes vulnerable.

4. A series of communications between the hosts ensues. Among the offers-and-acceptance negotiation are the site&#39;s credentials. The session ends if the requesting host refuses the credentials. This can occur for many reasons, but most commonly they&#39;re refused because they&#39;ve expired.

If the credentials are not trusted, the requestee asks the requesting host if the stipulation it found is acceptable to the user. This might occur if, say, the responding host offers a self-signed certificate. Self-signed certificates require trust that cannot be verified by either the certificates stored locally (cached certificates, or using the chain of authorities stated in the credentials. A certificate authority is a third party that could vet the proposed credentials. If it is unavailable, the proposition is, &quot;You just have to believe I am who I say I am.&quot; That conundrum of trust is usually placed upon the user as an exception handling of trust responsibility. If the application using that requested TLS balks, it forces the user to accept this possibly-dubious trust in order to continue. In a browser request to a webserver under TLS, the browser stops cold, waiting for an acknowledgement by the user of this (and other) credential problems proposed by certificate exchange problems.

5. TLS sessions expire. Certificates propose a lifetime for which the site is trusted. The session expires automatically when the certificate does; a new session must be established, using a certificate that&#39;s not expired. Some websites become suddenly and oddly available because their web administrators did not do the maintenance work of renewing an expired certificate.

There may be other limitations, such as session activity timeouts. These may or may not be part of the TLS protocol. Whatever the reason, these timeouts end the session for the requestor. Sessions may need to be renegotiated or re-authenticated, depending upon TLS protocols or (more often) policy limitations at the responding host.

A session may also terminate for other reasons unrelated to TLS. Among the reasons is that the requesting host&#39;s IP address changed; an MTU changed; or the requestor is now (oddly) using a different cipher or packet type. Any alarm condition that doesn&#39;t have an administratively-managed remedy terminates a TLS session (when the responding host is watching, that is, and some do not).

Ultimately, TLS is a multi-vendor, agnostic method of encrypting communications. It ensures trust in conversations between hosts, whether at the application level (as in web conversations) or as part of communications plumbing (email exchanges and more). Although older versions have proven to be vulnerable, more modern versions coupled to oversite by the IETF make TLS the widest choice in privacy and trust on the Internet.
