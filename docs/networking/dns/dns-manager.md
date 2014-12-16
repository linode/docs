---
author:
  name: Linode
  email: docs@linode.com
description: 'Directing domains to your Linode.'
keywords: 'linode dns,linode manager dns,dns configuration'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/']
modified: Monday, April 7th, 2014
modified_by:
  name: Linode
published: 'Thursday, July 16th, 2009'
title: DNS Manager
---

The *DNS Manager* is a comprehensive DNS management interface available within the [Linode Manager](https://manager.linode.com) that allows you to add DNS records for all of your domain names. This guide introduces basic DNS concepts and explains how to set up DNS records for common configurations.

Getting Started
---------------

The Domain Name System (DNS) attaches human-usable domain names to machine-usable IP addresses. It's essentially the phone book of the Internet. Just like a phone book can help you find the phone number of a business, DNS can take a domain name like `google.com` and translate it into an IP address like `173.194.74.102`, the IP address for Google's homepage. This global system allows users to remember the names of websites instead of their IP addresses.

 {: .note }
>
> DNS is a complex system, and explaining *exactly* how it works is beyond the scope of this article. For a general introduction, see our [Introduction to the Domain Name System](/docs/dns-guides/introduction-to-dns).

### What You Need To Do

When setting up any domain name on your Linode, you'll need to perform the following steps to make it accessible to the world:

1.  Register (purchase) a domain name, if you haven't already.
2.  Set your domain name to use Linode's name servers. You'll need to do this on your domain registar's website and then wait up to 24 hours for the changes to take effect.
3.  Open the DNS Manager, add a domain zone, and then start adding some basic DNS records.
4.  Set reverse DNS.
5.  If you have any special DNS needs, such as using a third-party email server, add additional DNS records to create a custom configuration.

This guide walks you through all of the steps.

### Finding Your Way Around

Ready to add or edit DNS records? Log in to the [Linode Manager](https://manager.linode.com) and click the DNS Manager tab. It contains all of the DNS records for your Linode's domain names. When you open the DNS Manager, you'll see the webpage shown below.

[![1. All of the domain zones are listed in the Domain Zone column. 2. The "Import a zone" link lets you import zone files. 3. The "Clone an existing zone" link lets you duplicate another zone you already have set up in the Linode Manager. 4. The "Add a domain zone" link lets you create a new zone file for a domain. 5. In the Options column for each domain, you have the following links: "Edit," "Remove," "Check," and "Zone file."](/docs/assets/1112-dns1-2.png)](/docs/assets/1112-dns1-2.png)

1.  All of domain zones are listed here. A *domain zone*, which is essentially synonymous with the term "domain," is a collection of DNS records for a single domain name. Click domain zone to add or edit DNS records within that zone.
2.  If you have a zone file that can be exported from a server or another hosting provider, click this link to import it.
3.  Click this link to duplicate an existing zone that you've already set up in the Linode Manager.
4.  Click this link to create a new domain zone.
5.  Use these links to edit DNS records within a zone, delete a zone, check a zone, or view a zone's file.

When you select a domain zone, or select the **Edit** link next to a domain zone, the webpage shown below will appear.

[![1. The "Settings" link lets you edit the SOA record. 2. The "Add a new record" links in each section let you create new records of the appropriate type. 3. The "Edit" and "Remove" links next to each record let you edit and remove specific records.](/docs/assets/1114-dns2-2.png)](/docs/assets/1114-dns2-2.png)

1.  Click this link to edit the start of authority (SOA) record. This record contains the primary domain or name server, the email address of the domain administrator, and several settings relating to the refreshing of the zone.
2.  To add a new DNS record, click this link under the type of DNS record you want to create.
3.  Use the links in these columns to edit or remove DNS records.

When you click the **Edit** link next to a DNS record, the webpage shown below will appear.

### Types of DNS Records

Later in this guide, you'll learn how to add DNS records in Linode's DNS Manager. Some of the most common records, like NS and A/AAAA records, are necessary for every domain. Other records won't need to be added unless you have a specific need.

Here are the types of DNS records you can add in the DNS Manager:

-   **NS records** point a domain at an authoritative DNS nameserver. The nameserver will then publish authoritative records for that domain.
-   **A/AAAA records** are the "core" records of the DNS system that point domains controlled by the name server to an IP address.
-   **MX records**, or *mail exchange* records, provide information regarding mail servers for routing of SMTP traffic to appropriate mail servers.
-   **TXT records** provide human and machine readable values in the DNS record to support specialized functionality like the Sender Policy Framework (SPF).
-   **SRV records**, or *service records*, provide information about specific services that run on your domain.
-   **CNAME records** provide domain aliasing, which allows you to point one domain at another domain.

To learn more about the different types of DNS records, see our [Introduction to the Domain Name System](/docs/dns-guides/introduction-to-dns).

Setting Domain Names to Use Linode's Name Servers
-------------------------------------------------

After you purchase a domain, the next step is setting your domain registrar to use our name servers. Use your domain name registrar's interface to set the name servers for your domain name to the following entries:

-   `ns1.linode.com`
-   `ns2.linode.com`
-   `ns3.linode.com`
-   `ns4.linode.com`
-   `ns5.linode.com`

See the instructions on your domain name registrar's website for more information.

 {: .note }
>
> DNS changes can take up to 24 hours to propagate throughout the Internet, although the changes are usually visible within a couple hours.

Domain Zones
------------

As stated earlier, a *domain zone* is essentially synonymous with the term "domain." Before you can add any DNS records, you must create a domain zone — a container for DNS records associated with a single domain name. The Linode Manager allows you to import domain zones from other DNS servers, clone existing zones that you've already created in the DNS Manager, check to make sure that a zone is correctly loaded, view the raw output of a zone file, and permanently remove a zone and all associated DNS records.

### Adding

If you're new to Linode, or if you've just purchased a new domain name, the first step is to add a new domain zone in the DNS Manager. This creates a container for the DNS records for your domain name. And if you don't know what DNS records to add, the DNS Manager can insert some basic records when you create the new domain zone.

Here's how to add a new domain zone:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **DNS Manager** tab.
3.  Select the **Add a domain zone** link. The webpage shown below appears.

[![This page lets you add a domain zone.](/docs/assets/1120-dns8.png)](/docs/assets/1332-hosting-1.png)

 {: .note }
>
> If you want to add a *slave zone* instead of a master zone, click the **I wanted a slave zone** link.

4.  Enter the domain name in the **Domain** field.
5.  Enter an administer's email address in the **SOA Email** field.
6.  The DNS Manager can automatically create some basic DNS records to get you started. To have it insert these records, select **Yes, insert a few records to get me started.** We recommend that you select this option if you're unfamiliar with DNS.
7.  To keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.
8.  Click **Add a Master Zone**. The webpage shown below appears.

[![This page lets you add specific DNS records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible, as shown above. If you elected to keep the zone empty, you can start adding DNS records now. Skip to the [Adding DNS Records](#id4) section for instructions.

### Importing

If you're migrating domains to Linode from another hosting provider, and that provider allows zone transfers from their DNS server, it may be possible to import your existing domain zone and DNS records in to the Linode Manager. If the import is successful, all of your existing DNS records will be available in the DNS Manager.

Here's how to import a zone file:

1.  Click the **DNS Manager** tab.
2.  Click **Import a zone**. The webpage shown below appears.

	[![This page lets you import a domain zone.](/docs/assets/1658-axfr_sm.png)](/docs/assets/1659-axfr.png)

3.  Enter the domain name in the **Domain** field.
4.  Enter the name server in the **Remote Nameserver** field.

	{: .note }
	>
	> The name server must allow zone transfers (AXFR) from 96.126.114.97, 96.126.114.98, 2600:3c00::5e, and 2600:3c00::5f.

5.  Click **Import Zone**.

The Linode Manager will connect to the remote name server and import your existing DNS records.

### Cloning

The *Clone a Zone* feature allows you to copy DNS records from an existing domain zone in your account to a new zone. Assuming you've already set up DNS records for one domain name, this is a good way to quickly create DNS records for another domain name that will be hosted on your existing Linode.

Here's how to clone an existing zone:

1.  Click the **DNS Manager** tab.
2.  Click **Clone an existing zone**. The webpage shown below appears.

[![This page lets you clone a domain zone.](/docs/assets/1119-dns7.png)](/docs/assets/1119-dns7.png)

3.  Select a zone from the **Clone this zone** menu.
4.  Enter the name of the new zone in the **Into this zone** field.
5.  Click **Clone Zone**.

The DNS records will be copied from the existing zone to the new zone.

### Checking

Under normal circumstances, there's no reason to suspect a problem with your domain zone or DNS records. But sometimes things go wrong. You can use the *check zone* feature to verify that your domain zone is working correctly.

Here's how to check the status of a domain zone:

1.  Click the **DNS Manager** tab.
2.  Click the **Check** link next to the zone you want to check. The webpage shown below appears.

[![Checking the status of a domain zone, with the result "Your zone looks good!" and text "zone example.org/IN: loaded serial 2012022839 OK"](/docs/assets/1116-dns4.png)](/docs/assets/1116-dns4.png)

If you see a message stating that your zone looks good, everything is working correctly.

### Viewing

The DNS Manager allows you to view the contents of a domain zone file. This could come in handy if you need to import the zone into a different server, or just want to inspect the contents of the file.

Here's how to view the contents of a domain zone file:

1.  Click the **DNS Manager** tab.
2.  Click the **Zone file** link next to the zone you want to view. The webpage shown below appears.

[![This page shows a text-only dump of the DNS zone file for this domain.](/docs/assets/1115-dns3.png)](/docs/assets/1115-dns3.png)

You have successfully opened the domain zone file.

### Removing

If one of your domain names has expired, or if you want to start hosting it on another server, you should permanently remove the domain zone and all of its associated DNS records. Here's how:

1.  Click the **DNS Manager** tab.
2.  Click the **Remove** link next to the zone you want to check. The webpage shown below appears.

	[![This page lets you remove a DNS zone.](/docs/assets/1117-dns5.png)](/docs/assets/1117-dns5.png)

3.  Click **Yes, delete this sucker** to permanently delete the zone.

You have successfully removed the domain zone and all of its associated DNS records.

DNS Records
-----------

Once you've created a domain zone, you can start filling it with DNS records. This is where the pedal hits the metal — DNS records are the link between your domain and your virtual private server. This section shows you how to add, edit, and remove DNS records.

### Adding

When you first create a domain zone, you'll need to add some DNS records. Here's how:

1.  Click the **DNS Manager** tab.
2.  Select a domain zone. The webpage shown below appears.

	{: .note }
	>
	> If you haven't already created a domain zone, do that now. For instructions, see [Adding a Domain Zone](#adding). If you don't know which DNS records to create, the DNS Manager can automatically insert some basic DNS records when you create a domain zone to get you started.

	[![This page has seven sections showing seven different types of records: SOA, NS, MX, and A/AAAA, CNAME, TXT, and SRV. You can adjust the SOA record by clicking the "Settings" link in that section. The next six sections each have a corresponding link that lets you add a new record of that type. For example, to add an NS record, click the "Add a new NS record" link. There are similar links for MX, A, CNAME, TXT, and SRV records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

3.  This page is divided into different sections for each type of DNS record. Locate the section for the type of DNS record you want to add, and then click the **Add new record** link. The webpage shown below appears.

	{: .note }
	>
	> The exact form fields will vary depending on the type of DNS record you select.

	[![This page allows you to create a new A/AAAA record. In the "Hostname" field, enter any text you want for a subdomain. For example, you could type "www". "\*" will make a wildcard entry. Leave this field blank if this is the primary A record for the domain. The other fields for the A record screen are explained in the steps below.](/docs/assets/1122-dns10.png)](/docs/assets/1122-dns10.png)

4.  Enter a hostname in the **Hostname** field.
5.  Enter the IP address of your server in the **IP Address** field. For instructions, see [Finding the IP Address](/docs/getting-started#sph_finding-the-ip-address).
6.  From the **TTL** menu, select a time interval. *TTL*, which stands for "time to live," controls how long DNS records are cached by DNS resolvers before the resolver must query the authoritative name servers for new records. For more information, see [Controlling "Time To Live" or TTL](/docs/dns-guides/introduction-to-dns#sph_controlling-time-to-live-or-ttl).
7.  Click **Save Changes**.

You have successfully added the DNS record. It can take up to 30 minutes for new DNS records to become active.

### Editing

You can edit and modify existing DNS records in the DNS Manager. Here's how:

1.  Click the **DNS Manager** tab.
2.  Select a domain zone. The DNS records for the selected domain zone appear.
3.  Select the **Edit** link next to the DNS record you want to edit.
4.  Edit the DNS record by modifying the existing values in the fields.
5.  Click **Save Changes**.

You have successfully edited the DNS record. It can take up to 30 minutes for the record to be updated.

### Removing

If you no longer need a existing DNS record, you can remove it from the DNS manager. Here's how:

1.  Click the **DNS Manager** tab.
2.  Select a domain zone. The DNS records for the selected domain zone appear.
3.  Select the **Remove** link next to the DNS record you want to delete. A warning appears asking whether you want to delete the record.
4.  Click **Yes, delete this sucker**.

You have successfully removed the DNS record. It can take up to 30 minutes for the changes to be removed.

Setting Reverse DNS
-------------------

Your desktop computer uses DNS to determine the IP address associated with a domain name. *Reverse* DNS lookup does the opposite by resolving an IP address to a designated domain name. You should always set the reverse DNS, even if your Linode hosts more than one domain name.

Here's how to set the reverse DNS for your Linode:

1.  Click the **Linodes** tab. A list of your virtual private servers appears.
2.  Select your Linode. The Linode's dashboard appears.
3.  Click the **Remote Access** tab.
4.  Select the **Reverse DNS** link, as shown in the below image.

	[![The Reverse DNS link](/docs/assets/1709-remoteaccess_reversedns.png)](/docs/assets/1709-remoteaccess_reversedns.png)

5.  Enter a domain name in the **Hostname** field, as shown in the below image.

	[![Adding the domain name for reverse DNS](/docs/assets/1706-ptr_lookup_marked.png)](/docs/assets/1706-ptr_lookup_marked.png)

6.  Click **Look up**. A message appears indicating that a match has been found for both your IPv4 and IPv6 addresses.

	[![Reverse DNS Match found](/docs/assets/1708-ptr_lookup_match_found_small.png)](/docs/assets/1707-ptr_lookup_match_found.png)

7.  Click **Yes** beneath the desired address. Note that you can select only one address at a time. If you want to set up reverse DNS for both the IPv4 and IPv6 addresses, you can perform another lookup and select the other address.

You have set up reverse DNS for your domain name.

Common DNS Configurations
-------------------------

It's one thing to know how to use the DNS Manager to add domain zones and DNS records — it's another to know exactly *which* records you should add, and under which circumstances you should add them. This section discusses common DNS configurations that you can reference when creating your DNS records.

### Setting Up a Domain

Obviously, the most common DNS configuration is a single domain name on one Linode. You'll need to add an *SOA Record*, *NS Records* for all of your name servers, and *A/AAAA* records for your domain names. Use the screenshot below as a guide.

[![The SOA record is set to "ns1.linode.com". The NS records are set to "ns1.linode.com" through "ns5.linode.com", inclusive. The MX record is set to "mail.example.org". There are A records for [blank], which is the primary domain, and the "mail" and "www" subdomains. They are all set to the same IP.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

 {: .note }
>
> The DNS Manager can automatically add all of these records when you create a domain zone. For instructions, see [this section](#adding).

### Configuring Subdomains

To configure a subdomain, such as `staging.example.org`, create an A record with the hostname of the subdomain you want to create. Point the the record at the IP address of the server you want to host the subdomain, as shown below.

[![Create a new A record, following the instructions in the "Adding" section. Add the subdomain text to the "Hostname" field. For example, you could type "staging" - NOT "staging.example.org".](/docs/assets/1125-dns13.png)](/docs/assets/1125-dns13.png)

 {: .note }
>
> Of course, you'll also need to create a name-based virtual host for the subdomain. If you're using Apache, see [these instructions](/docs/hosting-website#sph_configuring-name-based-virtual-hosts) for more information.

### Hosting Multiple Domains on a Single Server

To host multiple domain names on a single server, create a separate domain zone for each domain name, as shown below. When creating the new domain zones, we recommend that you allow the DNS Manager to automatically [insert basic records](#adding). At a minimum, you'll need an A record for each domain name pointing to the server's IP address.

[![This page shows the DNS Manager tab with three different domain zones listed.](/docs/assets/1126-dns15.png)](/docs/assets/1126-dns15.png)

 {: .note }
>
> Of course, you'll also need to create a name-based virtual host for each domain name. If you're using Apache, see [these instructions](/docs/hosting-website#sph_configuring-name-based-virtual-hosts) for more information.

### Using One Domain on Multiple Servers

If you have more than one server, but only one domain name, you can point A records with server-specific hostnames to all servers that need domain names. One machine will be the "front end" for the domain, by virtue of the first-level domain's A record pointing to it, but if needed the domain can serve as a proxy for services provided by other machines. For example, if you wanted to create a development environment on another server, you could create an A record for `staging.example.org` and point it at another Linode's IP address.

### Routing Email to Third-Party Mail Services

To route email to a third-party email service, create MX records that associate your mail server (for example, `mail.example.org`) with a *hostname* provided by the third-party service. For instructions, see the website of your third-party email service.

### Using Wildcard DNS Records

A *wildcard* DNS record matches requests for non-existent domain names. For example, if you create an A record for `*.example.org`, and a user visits `nonexistantname.example.org`, that user will be redirected to `example.org`. An example wildcard DNS record is shown below.

[![Create a new A record, following the instructions in the "Adding" section. Add a single asterisk (\*) in the "Hostname" field. Set your IP address in the "IP Address" field. Then click the "Save Changes" button.](/docs/assets/1127-dns16.png)](/docs/assets/1127-dns16.png)



