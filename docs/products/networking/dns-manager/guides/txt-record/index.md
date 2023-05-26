---
description: "Learn how to create TXT records using Linode's DNS Manager"
published: 2022-10-28
modified_by:
  name: Linode
title: "TXT Records"
keywords: ["dns"]
tags: ["linode platform"]
authors: ["Linode"]
---

## TXT Record Overview

**TXT** (*text*) records stores text and can be used to provide information about the domain. It is the most flexible DNS record type and can serve many different purposes, including email security (SPF, DKIM, DMARC) or prove ownership of a domain to an outside service.

## Properties

- **Hostname:** The root domain or the subdomain that you wish to use.

    - For the root domain (such as *example.com*), leave the field blank.
    - For a subdomain (such as *text.example.com*), enter a string that's 1-63 characters in length and contains only letters, numbers, and underscores. Hyphens can also be used, but the string cannot start with one.

- **Value:** The text you wish to include.

    - TXT records are composed of 1 or more strings. Each string can have a maximum of 255 characters and are encapsulated by quotation marks. The Linode DNS Manager automatically splits the contents of the *Value* field into strings (including adding quotation marks). You do not need to manage this yourself.

- **TTL** (*Time To Live*): The length of time that DNS resolvers should store the DNS record *before* revalidating it with Linode's name servers. Setting the TTL to **5 minutes** is recommended for many use cases. If **Default** is selected, the TTL is set to **24 hours**.