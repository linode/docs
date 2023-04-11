---
description: "Learn how to create SRV records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "SRV Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## SRV Record Overview

An **SRV** (*service*) record provides the target hostname and port for a given service. This allows you to direct traffic for specific services to a server other than what is specified in corresponding DNS records. SRV records are required for some protocols, such as XMPP and SIP.

## Properties

- **Service:** The name of the service, such as *sip* or *xmpp*. The DNS Manager automatically includes a leading underscore character (`_`) and trailing period (`.`).

- **Protocol:** The name of the protocol you wish to use. Select from one of the supported protocols: *tcp*, *udp*, *xmpp*, *tls*, and *smtp*. The DNS Manager automatically formats this to conform to the SRV record standards.

- **Domain:** The name of the domain that will receive the original traffic for this service. This is generated automatically by Linode DNS Manager and is based on the root domain (the domain name specified when you created the *Domain* entry). If you wish to enable an SRV on a subdomain, you must create a separate zone (*Domain* entry) for that subdomain

- **Priority**: A number representing the priority of the target host, with lower numbers having higher priority. This value matters when you have more than one SRV record for the same service, allowing you to have one or more fallback hosts.

- **Weight**: A number representing the weight given to the target host. When multiple hosts have the *same* priority, clients should load balance them according to their weight. Hosts with larger weights are sent a larger portion of the traffic.

- **Port**: The port used by the service on the target host.

- **Target**: The target domain name where traffic should be redirected. This could be the root domain, a subdomain, or a separate domain entirely. Enter the `@` character to use the root domain. The target domain name must have a valid A or AAAA record to specify the IP address of the target host.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.