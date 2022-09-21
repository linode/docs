---
slug: custom-name-servers
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to configure custom nameservers on popular domain registrars."
keywords: ["dns"]
tags: ["dns","networking","cpanel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-21
modified_by:
  name: Linode
title: Register Custom DNS Name Servers
---

DNS **name servers** (also referenced as the single word *nameservers*) are the backbone of the Domain Name System. They are the servers that host a domain's DNS records, which map human-readable domain names to IP addresses.

When registering a new domain or configuring an existing domain, you must set the FQDN (fully qualified domain name) of each name server you intend to use. This is done through your domain's registrar. You can typically chose to use your registrar's name servers, a third party name server, or a self-hosted name server. If you decide to use your registrar's DNS service or a third party DNS service, that service provides you with the FQDNs for its name servers. For example, the name servers for Linode's [DNS Manager](/docs/guides/dns-manager/#use-linodes-name-servers-with-your-domain) are ns1.linode.com through ns5.linode.com.

If you instead decide to use your own custom name servers, you first need to create glue records on your registrar for the FQDN you wish to use with each name server. In tandem with glue records, you must also set corresponding A records with your domain's DNS records. The last step is to configure your domain to use your new custom name servers.

1. [Configure Glue Records](#configure-glue-records)
1. [Create A Records](#create-a-records)
1. [Change the Name Servers for Your Domains](#change-the-name-servers-for-your-domains)

This guide covers how to register a custom name server and assumes you have already configured a self-hosted DNS software on each system you intend to use.

## Before You Begin

- You must have at least one registered domain name and be able to access the domain's registrar. Within this domain name, determine the FQDNs you'd like to use for your custom name servers. Many applications and registrars require at least two name servers and they are typically formatted as *ns1.example.com*, *ns2.example.com*, and so on, replacing *example.com* with the domain you'd like to use.

- For each name server you wish to configure, deploy your preferred DNS software on a Compute Instance or any publicly accessible server. If you are using cPanel, Plesk, or other software that automatically configures your DNS software, make sure it is properly installed.

## Why Use Custom Name Servers?

Third-party DNS services, like Linode's DNS Manager, are very reliable, feature-rich, highly available, and protected against attacks. For most applications, these services are preferable to self-hosting custom name servers. As with many custom self-hosted solutions, the effort to build and maintain a custom DNS name server might not be worthwhile. That said, there are some compelling reasons to chose self-hosting your own custom name servers over utilizing an existing DNS service.

- **Software integration:** Many popular self-hosted software solutions, including cPanel and Plesk, can deploy their own custom name servers to automatically manage DNS records. When a user makes a change in the software, the associated DNS records are automatically created or updated without a user needing to manually configure them.

- **Greater control:** A primary reason for using any self-hosted solution is to gain more granular control over a system. In the case of name servers, you can use any [name server software](https://en.wikipedia.org/wiki/Comparison_of_DNS_server_software) supported by your system and take advantage of all of its features.

- **Vanity/Branded domain:** Some third-party DNS services allow you to use your own domain instead of their standard name server domains for branding purposes, but not all have this feature. When self-hosting your own name servers, you can use whichever domain name you wish.

## Configure Glue Records

When a domain name is resolved, your system's DNS resolvers first query the root name server. The root then provides the name servers for the domain's top-level domain (TLD), such as `.com` or `.net`. Then, a query is sent to the TLD name servers, which returns the authoritative name servers for the domains. The DNS resolver can then finally query an authoritative name server for the DNS record it needs. This works fine for most domain queries, such as when the DNS records for *example.com* are hosted on the name server *ns1.linode.com*. But this breaks down for name server domain resolution, where the record for *ns1.example.com* is hosted on the *ns1.example.com* authoritative name server.

To overcome this circular resolution, glue records are needed. Glue records are set within the domain's registrar and can map the custom domain of a name server to the IP address of that name server. To configure glue records, follow the instructions below.

1. Obtain the public IPv4 addresses for each of your custom name servers. If they are hosted on a Linode Compute Instance, see [Managing IP Addresses on a Compute Instance](/docs/guides/managing-ip-addresses/#viewing-ip-addresses).

1. Log in to your domain's registrar.

1. Configure a glue record for reach custom name server. This maps the full domain of a name server to the IPv4 address for that server. The name of this feature and the instructions for setting a glue record depend on the registrar you are using. Here are the instructions for a few popular registrars, though any registrar that supports glue records can be used:

    - [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/768/10/how-do-i-register-personal-nameservers-for-my-domain/) (Personal DNS servers)
    - [GoDaddy](https://www.godaddy.com/help/add-my-custom-host-names-12320) (Host names)
    - [Hover](https://help.hover.com/hc/en-us/articles/217282437-Connecting-your-domain-using-private-nameservers-Glue-records-) (Glue records)

    Some registrars may require you enter the entire FQDN of the custom name server (such as *ns1.example.com*), while others only need the subdomain (such as *ns1*). Additionally, registrars like Namecheap pre-populate a dropdown list with common name server hostnames. In this case, you can likely select from the predefined list or type your own.

## Create A Records

In tandem with setting up glue records, you must also create A records within your custom name servers. Many self-hosted software applications that manage DNS records, such as cPanel and Plesk, do this automatically - provided they are configured to use a self-managed DNS service. If this is the case, you can skip this section.

1. Log in to the administration panel or terminal for your DNS software on your custom name server.

1. Within the domain zone file, add an *A* record for each custom name server. This record should point the hostname of the custom name server (such as *ns1*.example.com) to the IPv4 address of the name server.

Since these steps vary greatly depending on your DNS software, please reference the official documentation for that software. For instance, for users of BIND9 (the most popular DNS software), see [Configurations and Zone Files](https://bind9.readthedocs.io/en/v9_18_7/chapter3.html#soa-rr).

## Change the Name Servers for Your Domains

Once the custom name servers have been successfully registered, you can begin using them to host DNS records your domains. To do this, add the domain inside your custom name server and then update the domain's registrar to reflect the new authoritative name servers.

1. Log in to your domain's registrar.

1. Update the domain's name servers to use your new custom name servers (such as *ns1.example.com* and *ns2.example.com*). The name for this setting various among registrars, but it is commonly called *external* or *custom* name servers.

    - [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
    - [GoDaddy](https://www.godaddy.com/help/change-nameservers-for-my-domains-664)
    - [Hover](https://help.hover.com/hc/en-us/articles/217282477--Changing-your-domain-nameservers)

Make sure your domain's DNS records have been properly configured with your custom name server. Changes to DNS records can take up to 24 hours to fully propagate.