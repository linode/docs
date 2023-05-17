---
slug: custom-name-servers
description: "Learn how to configure custom nameservers on popular domain registrars."
keywords: ["dns"]
tags: ["dns","networking","cpanel","managed hosting"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-22
modified_by:
  name: Linode
title: Register Custom DNS Name Servers
authors: ["Linode"]
---

DNS **name servers** (also referenced as the single word *nameservers*) are the backbone of the Domain Name System. They are the servers that host a domain's DNS records, which map human-readable domain names to IP addresses.

When registering a new domain or configuring an existing domain, you must set the FQDN (fully qualified domain name) of each name server you intend to use. This is done through your domain's registrar. You can typically chose to use your registrar's name servers, a third party name server, or a self-hosted name server. If you decide to use your registrar's DNS service or a third party DNS service, that service provides you with the FQDNs for its name servers. For example, the name servers for Linode's [DNS Manager](/docs/products/networking/dns-manager/guides/authoritative-name-servers/) are ns1.linode.com through ns5.linode.com.

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

1. Obtain the public IPv4 addresses for each of your custom name servers. If they are hosted on a Linode Compute Instance, see [Managing IP Addresses on a Compute Instance](/docs/products/compute/compute-instances/guides/manage-ip-addresses/#viewing-ip-addresses).

1. Log in to your domain's registrar.

1. Configure a glue record for each custom name server. This maps the full domain of a name server to the IPv4 address for that server. The name of this feature and the instructions for setting a glue record depend on the registrar you are using. Here are the instructions for a few popular registrars, though any registrar that supports glue records can be used:

    - [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/768/10/how-do-i-register-personal-nameservers-for-my-domain/) (Personal DNS servers)
    - [GoDaddy](https://www.godaddy.com/help/add-my-custom-host-names-12320) (Host names)
    - [Hover](https://help.hover.com/hc/en-us/articles/217282437-Connecting-your-domain-using-private-nameservers-Glue-records-) (Glue records)

    Some registrars may require you enter the entire FQDN of the custom name server (such as *ns1.example.com*), while others only need the subdomain (such as *ns1*). Additionally, registrars like Namecheap pre-populate a dropdown list with common name server hostnames. In this case, you can likely select from the predefined list or type your own.

After this is complete, your registrar sends the glue records to the TLD name servers associated with your domain. This process can take up to 24 hours to complete, though it is generally finished within a few minutes to an hour. See [Verify DNS Changes](#verify-dns-changes).

## Create A Records

In tandem with setting up glue records at the registrar-level, you should also create A records within your custom name servers itself. Many self-hosted software applications that manage DNS records, such as cPanel and Plesk, do this automatically - provided they are configured to use a self-managed DNS service. If this is the case, you can skip this section - even if you have yet to install the software.

1. Log in to the administration panel or terminal for your DNS software on your custom name server.

1. Within the domain zone file, add an *A* record for each custom name server. This record should point the hostname of the custom name server (such as *ns1*.example.com) to the IPv4 address of the name server.

Since these steps vary greatly depending on your DNS software, please reference the official documentation for that software. For instance, for users of BIND9 (the most popular DNS software), see [Configurations and Zone Files](https://bind9.readthedocs.io/en/v9_18_7/chapter3.html#soa-rr).

DNS records can take up to 24 hours to fully propagate, depending on several factors - including the TTL setting, the DNS service you are using, and the caching system on the DNS resolver. In general, you can expect to see the updates within 5 minutes to an hour. See [Verify DNS Changes](#verify-dns-changes).

## Change the Name Servers for Your Domains

Once the custom name servers have been successfully registered, you can begin using them to host DNS records for your domains. To do this, add the domain inside your custom name server and then update the domain's registrar to reflect the new authoritative name servers.

1. Log in to your domain's registrar.

1. Update the domain's name servers to use your new custom name servers (such as *ns1.example.com* and *ns2.example.com*). The name for this setting various among registrars, but it is commonly called *external* or *custom* name servers.

    - [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/767/10/how-to-change-dns-for-a-domain/)
    - [GoDaddy](https://www.godaddy.com/help/change-nameservers-for-my-domains-664)
    - [Hover](https://help.hover.com/hc/en-us/articles/217282477--Changing-your-domain-nameservers)

After configuring the new authoritative name servers for a domain, they are sent to the TLD name servers associated with that domain. This process can take up to 24 hours to complete, though it is generally finished within a few minutes to an hour. See [Verify DNS Changes](#verify-dns-changes).

## Verify DNS Changes

Once you've made the changes that are needed, you can verify that the records are correct and have propagated to the appropriate servers by following the instructions below.

1.  Obtain the TLD name servers by running the following dig command, replacing *com* with the TLD for your domain.

        dig +short com NS

    This returns a list of TLD name servers.

1.  View the DNS records a particular TLD name server has for your domain by using the command below. Be sure to replace *a.gtld-servers.net.* with whichever TLD name server you wish to query (leaving the `@` and trailing `.`) and *example.com* with your domain.

        dig +norec @a.gtld-servers.net. example.com

1. **To verify the glue records**, examine the output's *ADDITIONAL* section. There should be an A record for each of the glue records you've configured, pointing your custom name server domain to your IP address.

    {{< output>}}
;; ADDITIONAL SECTION:
ns2.example.com.	3600	IN	A	192.0.2.36
ns1.example.com.	3600	IN	A	192.0.2.37
{{</ output >}}

    If you do not see a similar output, you can query other TLD name servers. It may be that the changes have not yet propagated to all of them.

1. **To verify your domain is using your new name servers**, examine the *AUTHORITY* section of the output. This should be a list of all NS (name server) records, which map your domain to one or more name servers. All of the name servers configured for your domain should appear here, though they are typically displayed in a somewhat random order.

    {{< output>}}
;; AUTHORITY SECTION:
example.com.		3600	IN	NS	ns2.example.com.
example.com.		3600	IN	NS	ns1.example.com.
{{</ output >}}

1.  Both the glue records and name servers can also be verified by running a `dig +trace` command, as shown below. Replace *example.com* with your domain and *ns1.example.com* with your custom name server. Repeat this command as needed for each name server.

        dig example.com +trace +additional | grep ns1.example.com

    Within the output, you should see at least one NS record that defines your custom name sever and an A record for your name server that points to the correct IP address of your server.

1.  **The A records for your custom name server's domain can be verified by running the following dig command**, which confirms the changes have propagated to the DNS resolver used by your system. Replace *ns1.example.com* with the domain of your name server.

        dig ns1.example.com A +short

    This should output the IP address configured within the A record for that domain.