---
description: "Learn how to create NS records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "NS Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## NS Overview

**NS** (*Name Server*) records specify the name servers used for a domain or subdomain. Name servers for the root domain (like *example.com*) are set directly on the domain's registrar, as well as through NS records. By default, five NS records are automatically created for you on Linode's DNS Manager, one for each of Linode's name servers (ns1.linode.com through ns5.linode.com). These can not be modified. Additional NS records can be created if you wish use a subdomain with a different DNS provider or manage it as a separate *Domain* (zone file) in Linode's DNS Manager.

The order of NS records does not matter. A random NS record for a domain will be provided when the domain is queried. If one name server fails to respond, another one will be queried.

## Properties

- **Name Server:** The name server you wish to use. This could be name server corresponding with a third-party DNS service. If you wish to still use Linode's DNS Manager but manage the subdomain as a separate *Domain* (zone file), enter Linode's name servers.

- **Subdomain:** The subdomain that you wish to manage as a separate *Domain* (zone file) or through another DNS provider.

    - Enter a string that's 1-63 characters in length and contains only letters, numbers, and underscores. Hyphens can also be used, but the string cannot start with one.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.