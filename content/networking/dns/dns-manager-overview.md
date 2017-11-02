---
author:
  name: Linode
  email: docs@linode.com
description: 'Use DNS Manager to Direct Domains to Your Linode.'
keywords: ["dns manager", "linode dns", "linode manager dns", "dns configuration", "ttl", "domain zones", "domain name"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/', 'networking/dns/dns-manager/']
modified: 2017-05-24
modified_by:
  name: Angel Guarisma
published: 2009-07-16
title: DNS Manager Overview
---

The *DNS Manager* is a comprehensive DNS management interface available within the [Linode Manager](https://manager.linode.com) that allows you to add DNS records for all of your domain names. This guide covers the use of Linode's DNS Manager and basic domain zone setup. For an introduction to DNS in general, please see our [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) guide.

![DNS Manager Overview](/docs/assets/dns-manager-overview.png)

## Getting Started

The Domain Name System (DNS) attaches human-readable domain names to machine-usable IP addresses. In many ways, it is the phone book of the Internet. Just like a phone book can help you find the phone number of a business, DNS can take a domain name like `google.com` and translate it into an IP address like `74.125.19.147`, the IP address for Google's homepage. This global system allows users to remember the names of websites instead of their numeric IP addresses.

{{< note >}}
All steps within this guide are completed within the **[DNS Manager](https://manager.linode.com/dns)** tab of your Linode Manager.

DNS records are only actively hosted on accounts with at least one Linode.
{{< /note >}}

## DNS Set-Up Checklist

When setting up any domain name on your Linode, make sure you perform the following steps:

1.  Register (purchase) a domain name, if you haven't already.
2.  [Set your domain name to use Linode's name servers](#set-domain-names-to-use-linodes-name-servers). You'll need to do this on your domain registrar's website and then wait up to 24 hours for the change to take effect.
3.  Use the DNS Manager to [Add a domain zone](#add-a-domain-zone), and then start [adding some basic DNS records](#add-records).
4.  [Set reverse DNS](/docs/networking/dns/setting-reverse-dns).
5.  If you have any special DNS needs, such as using a third-party email server, add additional DNS records to [create a custom configuration](/docs/networking/dns/common-dns-configurations).

## Set Domain Names to Use Linode's Name Servers

After you purchase a domain, set your domain registrar to use Linode's name servers. Use your domain name registrar's interface to set the name servers for your domain name to the following entries:

-   `ns1.linode.com`
-   `ns2.linode.com`
-   `ns3.linode.com`
-   `ns4.linode.com`
-   `ns5.linode.com`

See the instructions on your domain name registrar's website for more information.

 {{< note >}}
DNS changes can take up to 24 hours to propagate throughout the Internet, although the changes are usually visible within a couple hours.
{{< /note >}}

## The DNS Manager

Log in to the [Linode Manager](https://manager.linode.com) and click the **DNS Manager** tab. It should resemble this:

![The DNS Manger](/docs/assets/1112-dns1-2.png)

1.  All of your domain zones are listed here. A *domain zone*, essentially synonymous with the term "domain," is a collection of DNS records for a single domain name. Click the name of a domain zone to add or edit DNS records within that zone.
2.  If you have a zone that can be exported from a server or another hosting provider, click **Import a zone** to import it.
3.  Click **Clone an existing zone** to duplicate an existing zone that you've already set up in the Linode Manager.
4.  Click **Add a domain zone** to create a new domain zone.
5.  Use the links to the far right of the domain zone link to edit DNS records within a zone, to delete a zone, check a zone, or view a zone's file.

## Domain Zones

Before you can add any DNS records, you must create a domain zone — a container for DNS records associated with a single domain name.

### Add a Domain Zone

If you're new to Linode, or if have just purchased a new domain name, the first step is to add a new domain zone in the DNS Manager. This creates a container for the DNS records for your domain name. If you don't know what records to add, the DNS Manager can insert some basic records when you create the new domain zone.

This video runs through the process of adding a new domain zone:

<iframe width="825" height="465" src="https://www.youtube.com/embed/-GHW8aPsyPI?controls=0&amp;showinfo=0&amp;rel=0&amp;loop=1" frameborder="0" allowfullscreen></iframe>

1.  From the DNS Manager tab, select the **Add a domain zone** link.

    [![This page lets you add a domain zone.](/docs/assets/1120-dns8.png)](/docs/assets/1332-hosting-1.png)

2.  Enter the domain name in the **Domain** field. An example is shown above.
3.  Enter an administrator's email address in the **SOA Email** field.
4.  If you are unfamiliar with DNS, the DNS Manager can automatically create some basic DNS records to get you started. To have it insert these records, select **Yes, insert a few records to get me started**, then select from the drop-down menu the Linode with which you want this domain zone associated.

    Alternatively, to keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.
5.  Click **Add a Master Zone**. The webpage shown below then appears, with your domain zone information.

6.  If you want to add a *slave zone* instead of a master zone, click the **I wanted a slave zone** link to the lower right.

    {{< note >}}
In order for Linode's DNS servers to function as slaves, your DNS master server must notify and allow AXFR requests from the following IP addresses:

104.237.137.10
65.19.178.10
75.127.96.10
207.192.70.10
109.74.194.10
2600:3c00::a
2600:3c01::a
2600:3c02::a
2600:3c03::a
2a01:7e00::a
{{< /note >}}

If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible, as shown above. If you elected to keep the zone empty, you can start adding DNS records now. Skip to the [Adding DNS Records](/docs/networking/dns/dns-manager-overview#add-records) section for instructions.

[![This page lets you add specific DNS records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)


If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible, as shown above. If you elected to keep the zone empty, you can start adding DNS records now.

### Add Records

When you first create a domain zone, you'll need to add some DNS records. The DNS Manager can create some basic records to get you started when you create your domain zone, but this section explains how to add your own records.

1.  Select a domain zone from within your DNS Manager.

	[![This page has seven sections showing seven different types of records: SOA, NS, MX, and A/AAAA, CNAME, TXT, and SRV. You can adjust the SOA record by clicking the "Settings" link in that section. The next six sections each have a corresponding link that lets you add a new record of that type. For example, to add an NS record, click the "Add a new NS record" link. There are similar links for MX, A, CNAME, TXT, and SRV records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

2.  The page is divided into different sections for each type of DNS record. Locate the section for the type of DNS record you want to add, and then click the **Add new [DNS] record** link.

	{{< note >}}
The exact form fields will vary depending on the type of DNS record you select.
{{< /note >}}

    ![This page allows you to create a new A/AAAA record.](/docs/assets/1122-dns10.png)

3.  Enter a hostname in the **Hostname** field.
4.  Enter the IP address of your server in the **IP Address** field. For instructions, see [Finding the IP Address](/docs/getting-started#find-the-ip-address-of-your-linode).
5.  From the **TTL** menu, select a time interval. *TTL*, which stands for "time to live," controls how long DNS records are cached by DNS resolvers before the resolver must query the authoritative name servers for new records.
6.  Click **Save Changes**.

You have successfully added the DNS record. It can take up to 30 minutes for new DNS records to become active.

### Edit Records

You can also modify existing DNS records in the DNS Manager.

1.  Select a domain zone. The DNS records for the selected domain zone will appear.
2.  Select the **Edit** link next to the DNS record you want to edit.
3.  Edit the DNS record by modifying the existing values in the fields.
4.  Click **Save Changes**.

You have successfully edited the DNS record. It can take up to 30 minutes for the record to be updated.

### Import Domain Zones with AXFR

If you're migrating domains to Linode from another hosting provider, and that provider allows zone transfers from its DNS server, it may be possible to import your existing domain zone and DNS records into the Linode Manager. If the import is successful, all of your existing DNS records will be available in the DNS Manager.

Here's how to import a zone file:

1.  Select **Import a zone**, from the DNS Manager tab.

	[![This page lets you import a domain zone.](/docs/assets/1658-axfr_sm.png)](/docs/assets/1659-axfr.png)

2.  Enter the domain name in the **Domain** field, as shown in the example above.
3.  Enter the name server in the **Remote Nameserver** field.

	{{< note >}}
The name server must allow zone transfers (AXFR) from: 96.126.114.97, 96.126.114.98, 2600:3c00::5e, and 2600:3c00::5f
{{< /note >}}

4.  Click **Import Zone**.

The Linode Manager will connect to the remote name server and import your existing DNS records.

### Clone Domain Zones

The *Clone a Zone* feature allows you to copy DNS records from an existing domain zone in your account to a new zone. Assuming you've already set up DNS records for one domain name, this is a good way to quickly create DNS records for another domain name that will be hosted on your existing Linode.

Here's how to clone an existing zone:

1.  Click **Clone an existing zone** from your DNS Manager tab.
2.  Select a zone from the **Clone this zone** menu.

    [![This page lets you clone a domain zone.](/docs/assets/1119-dns7.png)](/docs/assets/1119-dns7.png)

3.  Enter the name of the new zone in the **Into this zone** field.
4.  Click **Clone Zone**.

The DNS records will then be copied from the existing zone to the new zone.

### Check Domain Zones

Under normal circumstances, there's no reason to suspect a problem with your domain zone or DNS records, but sometimes things go wrong. You can use the *Check zone* feature to verify that your domain zone is working correctly.

In order to check the status of your domain zone, from within the DNS Manager, click the **Check** option to the far right of your chosen domain zone. A webpage with the results of the domain zone check will then appear.

If you see a message stating that your zone looks good, then everything is working correctly; otherwise, check that all of the DNS records in your domain zone are properly configured.

### View Domain Zones

The DNS Manager allows you to view the contents of a domain zone file. This is especially useful should you need to import the zone to a different server, or if you wish to inspect the file.

You can view the contents of the domain zone file through the DNS Manager tab of your Linode Manager. From there, select the **Zone file** link to the far right column of your chosen domain's name. An example of the file is provided below.

[![This page shows a text-only dump of the DNS zone file for this domain.](/docs/assets/1115-dns3.png)](/docs/assets/1115-dns3.png)

### Remove Domain Zones

If one of your domain names has expired or if you want to start hosting it on another DNS provider, you should permanently remove the domain zone and all of its associated DNS records.

Select the **Remove** link next to the zone you want to remove.

[![This page lets you remove a DNS zone.](/docs/assets/1117-dns5.png)](/docs/assets/1117-dns5.png)

Click **Yes, delete this sucker** to permanently delete the zone, including all associated records.

You have successfully removed the DNS record. It can take up to 30 minutes for the changes to be removed.

{{< caution >}}
Once removed, you **MUST** delete the Linode nameserver entries from the domain at the registrar level.
This is a very important step; if the entries are not removed, someone could use your domain without your
permission.
{{< /caution >}}

### Subdomains

The DNS Manager does not support addition of a subdomain on top of an existing subdomain in the same zone. For example, if you have `example.com` as a zone, with an A record for `subdomain.example.com`, you cannot create `another.subdomain.example.com` within that zone.

Instead, [add](#add-a-domain-zone) the subdomain as a separate zone in the DNS Manager, and then create your additional subdomain as an A record.

### Wildcards

The DNS Manager uses an asterisk (`*`) for wildcards.

## Troubleshoot

Having problems with your DNS records? We recommend reviewing this section to help get your DNS settings back on track. Follow these tips to troubleshoot DNS issues.

### Wait for Propagation

If you've just made a DNS change and aren't seeing it reflected yet, try waiting 48 hours. DNS updates will take effect, or *propagate*, within the time period set by your zone file's [TTL](#set-the-time-to-live-or-ttl). In some cases the new information may not be reflected for up to 48 hours.

While you can't control DNS caching at every point on the Internet, you do have control over your web browser. Try holding down the *Shift* key or the *Control* key (depending on your browser) while you refresh the page to bypass your browser's cache of the old DNS data. You can also try bringing up your site in an alternate browser, or [Previewing Your Website Without DNS](/docs/networking/dns/previewing-websites-without-dns).

### Set the Time To Live or TTL

Time to Live (TTL) tells Internet servers how long to cache particular DNS entries. The default TTL for Linode zone files is 24 hours. This is fine for normal DNS situations, because most people don't update their IP addresses all that often.

However, there are times when you'll want the TTL to be as low as possible. For instance, when you make a DNS change, you'll want that change to propagate quickly. Otherwise, some people will see the new site right away, and others (who had the old data cached) will still be visiting the website at your old server. Long caching times can be even more problematic when it comes to email, because some messages will be sent to the new server and some to the old one.

The solution is to lower your TTL before making a DNS change. You'll want to lower the TTL first, on its own, before making any other DNS changes. Here's a general overview of what should happen during a smooth DNS update:

{{< note >}}
TTL is always written out in seconds, so 24 hours = 86400 seconds.
{{< /note >}}

1.  Check the TTL on your current zone file. Typically, this will be 24 or 48 hours.
2.  Update your current zone file 48 (for a 24-hour record) to 96 (for a 48-hour record) hours early, taking into account any intermediate DNS servers. Lower the TTL to five minutes (300 seconds, or the lowest allowed value). Do not make any other changes at this time. If you're using Linode's DNS Manager, lower the TTL to 5 minutes for each entry you're going to change.
3.  Wait out the original 48 to 96 hours.
4.  Visit your zone file again to make all of your IP address - and other - updates.
5.  DNS changes should propagate within 30 minutes.

### Find Current DNS Information

Sometimes you may need to find the current DNS information for a domain. There are two great tools for doing this:

-   **dig**: Look up individual DNS entries. For example, you can find the IP address where your domain resolves.
-   **whois**: Find your registrar and nameserver information for your domain.

If you're using a computer that runs Mac OS X or Linux, you can use these tools from the command line. To find your domain's IP (the primary A record), run:

    dig example.com

Look in the *answer section* of the output to locate your IP address. You can also query for other types of records. For example, to see the mail records for a domain, run:

    dig mx example.com

This returns all of your domain's MX records.

To find your domain's registrar and nameserver information, run:

    whois example.com

This generates a large amount of information about the domain. The basic information you need will be near the top of the output, so you might have to scroll back to see it.

If you're on a Windows machine, or you're more comfortable using a web-based tool, you can also use [kloth.net](http://www.kloth.net/services/dig.php) for dig requests and [whois.net](http://whois.net/) for WHOIS requests. Note that since you're running these lookups from a third-party website, the information they find is not necessarily what your local computer has cached. There should be a difference only if you've made recent changes to your DNS information.

## Next Steps

Now that you are familiar with Linode's DNS Manager, you should set up your [reverse DNS configuration](/docs/networking/dns/setting-reverse-dns), and consider looking at our [Common DNS Configurations](/docs/networking/dns/common-dns-configurations) guide.
