---
author:
  name: Linode
  email: docs@linode.com
description: 'Directing domains to your Linode.'
keywords: 'linode dns,linode manager dns,dns configuration'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias: ['dns-manager/','dns-guides/configuring-dns-with-the-linode-manager/']
modified: Tuesday, January 20, 2015
modified_by:
  name: Elle Krout
published: 'Thursday, July 16th, 2009'
title: DNS Manager
---

The *DNS Manager* is a comprehensive DNS management interface available within the [Linode Manager](https://manager.linode.com) that allows you to add DNS records for all of your domain names. This guide covers the use of Linode's DNS Manager and basic domain zone set-up. For an introduction to DNS in general, please see our [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) guide.

##Getting Started

The Domain Name System (DNS) attaches human-usable domain names to machine-usable IP addresses. In many ways, it is the phone book of the Internet. Just like a phone book can help you find the phone number of a business, DNS can take a domain name like `google.com` and translate it into an IP address like `74.125.19.147`, the IP address for Google's homepage. This global system allows users to remember the names of websites instead of their IP addresses.

{: .note}
>All steps within this guide are done within the **[DNS Manager](https://manager.linode.com/dns)** tab of your Linode Manager.

### DNS Set-Up Checklist

When setting up any domain name on your Linode, you'll need to perform the following steps to make it accessible to the world:

1.  Register (purchase) a domain name, if you haven't already.
2.  [Set your domain name to use Linode's name servers](#setting-domain-names-to-use-linodes-name-servers). You'll need to do this on your domain registrar's website and then wait up to 24 hours for the change to take effect.
3.  Open the DNS Manager, [add a domain zone](#adding), and then start [adding some basic DNS records](#adding-1).
4.  [Set reverse DNS](/docs/networking/dns/setting-reverse-dns).
5.  If you have any special DNS needs, such as using a third-party email server, add additional DNS records to [create a custom configuration](/docs/networking/dns/common-dns-configurations).

### The DNS Manager Page

Ready to add or edit DNS records? Log in to the [Linode Manager](https://manager.linode.com) and click the **DNS Manager** tab. The Domain Manager contains all of the DNS records for your Linode's domain names. When you open the DNS Manager, you'll see a webpage like the one below:

[![1. All of the domain zones are listed in the Domain Zone column. 2. The "Import a zone" link lets you import zone files. 3. The "Clone an existing zone" link lets you duplicate another zone you already have set up in the Linode Manager. 4. The "Add a domain zone" link lets you create a new zone file for a domain. 5. In the Options column for each domain, you have the following links: "Edit," "Remove," "Check," and "Zone file."](/docs/assets/1112-dns1-2.png)](/docs/assets/1112-dns1-2.png)

1.  All of your domain zones are listed here. A *domain zone*, essentially synonymous for the term "domain," is a collection of DNS records for a single domain name. Click the name of a domain zone to add or edit DNS records within that zone.
2.  If you have a zone that can be exported from a server or another hosting provider, click **Import a zone** to import it.
3.  Click **Clone an existing zone** to duplicate an existing zone that you've already set up in the Linode Manager.
4.  Click **Add a domain zone** to create a new domain zone.
5.  Use the links to the far right of the domain zone link to edit DNS records within a zone, delete a zone, check a zone, or view a zone's file.

### The Domain Zones Page

When you select the name of a domain zone, or select the **Edit** link next to a domain zone in your DNS Manager, a webpage like the one below will appear:

[![1. The "Settings" link lets you edit the SOA record. 2. The "Add a new record" links in each section let you create new records of the appropriate type. 3. The "Edit" and "Remove" links next to each record let you edit and remove specific records.](/docs/assets/1114-dns2-2.png)](/docs/assets/1114-dns2-2.png)

1.  Click **Settings** to edit the Start of Authority (SOA) record. This record contains the primary domain or name server, the email address of the domain administrator, and several settings relating to the refreshing of the zone.
2.  To add a new DNS record, click the **Add...** link under the type of DNS record you want to create.

    {: .note}
    >
    >You can add NS (name server), A/AAAA, MX (mail exchange), TXT (text), SRV (service record), and CNAME (Canonical Name) records in Linode's DNS Manager. To learn about these types of DNS records and more please see our [Introduction to DNS Records](/docs/networking/dns/introduction-to-dns-records) guide.
    >
    >Please note that NS and A/AAAA records are necessary for every domain.

3.  Use the links at the right columns to edit or remove DNS records.

##Setting Domain Names to Use Linode's Name Servers

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

##Domain Zones

Before you can add any DNS records, you must create a domain zone — a container for DNS records associated with a single domain name. The Linode Manager allows you to add new domain zones, import domain zones from other DNS servers, clone existing zones that you've already created in the DNS Manager, check to make sure that a zone is correctly loaded, view the raw output of a zone file, and permanently remove a zone and all associated DNS records.

### Adding

If you're new to Linode, or if have just purchased a new domain name, the first step is to add a new domain zone in the DNS Manager. This creates a container for the DNS records for your domain name. If you don't know what DNS records to add, the DNS Manager can insert some basic records when you create the new domain zone.

Here's how to add a new domain zone:

1.  From the DNS Manager tab, select the **Add a domain zone** link.

    [![This page lets you add a domain zone.](/docs/assets/1120-dns8.png)](/docs/assets/1332-hosting-1.png)

2.  Enter the domain name in the **Domain** field. An example is shown above.
3.  Enter an administer's email address in the **SOA Email** field.
4.  If you are unfamiliar with DNS, the DNS Manager can automatically create some basic DNS records to get you started. To have it insert these records, select **Yes, insert a few records to get me started**, then select the Linode you want this domain zone associated with from the drop-down menu.

    Alternatively, to keep the domain zone empty and prevent the DNS Manager from creating DNS records, select **No, I want the zone empty**.
5.  Click **Add a Master Zone**. The webpage shown below then appears, with your domain zone information.

     If you want to add a *slave zone* instead of a master zone, click the **I wanted a slave zone** link to the lower right.

    [![This page lets you add specific DNS records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

If you selected the option to have the DNS Manager insert basic DNS records, those records will be visible, as shown above. If you elected to keep the zone empty, you can start adding DNS records now. Skip to the [Adding DNS Records](#adding-1) section for instructions.

### Importing

If you're migrating domains to Linode from another hosting provider and that provider allows zone transfers from their DNS server, it may be possible to import your existing domain zone and DNS records into the Linode Manager. If the import is successful, all of your existing DNS records will be available in the DNS Manager.

Here's how to import a zone file:

1.  Select **Import a zone**, from the DNS Manager tab.

	[![This page lets you import a domain zone.](/docs/assets/1658-axfr_sm.png)](/docs/assets/1659-axfr.png)

2.  Enter the domain name in the **Domain** field, as shown in the example above.
3.  Enter the name server in the **Remote Nameserver** field.

	{: .note }
	>
	> The name server must allow zone transfers (AXFR) from 96.126.114.97, 96.126.114.98, 2600:3c00::5e, and 2600:3c00::5f.

4.  Click **Import Zone**.

The Linode Manager will connect to the remote name server and import your existing DNS records.

### Cloning

The *Clone a Zone* feature allows you to copy DNS records from an existing domain zone in your account to a new zone. Assuming you've already set up DNS records for one domain name, this is a good way to quickly create DNS records for another domain name that will be hosted on your existing Linode.

Here's how to clone an existing zone:

1.  Click **Clone an existing zone** from your DNS Manager tab.
2.  Select a zone from the **Clone this zone** menu.

    [![This page lets you clone a domain zone.](/docs/assets/1119-dns7.png)](/docs/assets/1119-dns7.png)

3.  Enter the name of the new zone in the **Into this zone** field.
4.  Click **Clone Zone**.

The DNS records will then be copied from the existing zone to the new zone.

### Checking

Under normal circumstances, there's no reason to suspect a problem with your domain zone or DNS records, but sometimes things go wrong. You can use the *Check zone* feature to verify that your domain zone is working correctly.

In order to check the status of your domain zone, from within the DNS Manager, click the **Check** option to the far right of your chosen domain zone. A webpage with the results of the domain zone check will then appear.

If you see a message stating that your zone looks good, everything is working correctly; otherwise, check that all of the DNS records in your domain zone are properly configured.

### Viewing

The DNS Manager allows you to view the contents of a domain zone file. This is especially useful should you need to import the zone to a different server, or if you wish to inspect the file.

You can view the contents of the domain zone file through the DNS Manager tab of your Linode Manager. From there, select the **Zone file** link to the far right column of your chosen domain's name. An example of the file is provided below.

[![This page shows a text-only dump of the DNS zone file for this domain.](/docs/assets/1115-dns3.png)](/docs/assets/1115-dns3.png)

### Removing

If one of your domain names has expired, or if you want to start hosting it on another server, you should permanently remove the domain zone and all of its associated DNS records.

Select the **Remove** link next to the zone you want to remove.

[![This page lets you remove a DNS zone.](/docs/assets/1117-dns5.png)](/docs/assets/1117-dns5.png)

Click **Yes, delete this sucker** to permanently delete the zone.

The domain zone and all of its associated records has now been removed.

##DNS Records

Once you've created a domain zone, you can start filling it with DNS records. DNS records are the link between your domain and your virtual private server. This section shows you how to add, edit, and remove DNS records.

{: .note }
>
> If you haven't already created a domain zone, please do so. For instructions, see [Adding a Domain Zone](#adding) above. If you don't know which DNS records to create, the DNS Manager can automatically insert some basic DNS records when you create a domain zone to get you started.

Should you remove your Linode(s), you will no longer be able to use Linode's DNS Manager to host your domain zones.

### Adding

When you first create a domain zone, you'll need to add some DNS records.

1.  Select a domain zone from within your DNS Manager.

	[![This page has seven sections showing seven different types of records: SOA, NS, MX, and A/AAAA, CNAME, TXT, and SRV. You can adjust the SOA record by clicking the "Settings" link in that section. The next six sections each have a corresponding link that lets you add a new record of that type. For example, to add an NS record, click the "Add a new NS record" link. There are similar links for MX, A, CNAME, TXT, and SRV records.](/docs/assets/1121-dns9.png)](/docs/assets/1121-dns9.png)

2.  The page is divided into different sections for each type of DNS record. Locate the section for the type of DNS record you want to add, and then click the **Add new [DNS] record** link.

	{: .note }
	>
	> The exact form fields will vary depending on the type of DNS record you select.

	[![This page allows you to create a new A/AAAA record. In the "Hostname" field, enter any text you want for a subdomain. For example, you could type "www". "\*" will make a wildcard entry. Leave this field blank if this is the primary A record for the domain. The other fields for the A record screen are explained in the steps below.](/docs/assets/1122-dns10.png)](/docs/assets/1122-dns10.png)

3.  Enter a hostname in the **Hostname** field.
4.  Enter the IP address of your server in the **IP Address** field. For instructions, see [Finding the IP Address](/docs/getting-started#finding-the-ip-address).
5.  From the **TTL** menu, select a time interval. *TTL*, which stands for "time to live," controls how long DNS records are cached by DNS resolvers before the resolver must query the authoritative name servers for new records.
6.  Click **Save Changes**.

You have successfully added the DNS record. It can take up to 30 minutes for new DNS records to become active.

### Editing

You can modify existing DNS records in the DNS Manager. Here's how:

1.  Select a domain zone. The DNS records for the selected domain zone will appear.
2.  Select the **Edit** link next to the DNS record you want to edit.
3.  Edit the DNS record by modifying the existing values in the fields.
4.  Click **Save Changes**.

You have successfully edited the DNS record. It can take up to 30 minutes for the record to be updated.

### Removing

If you no longer need an existing DNS record, you can remove it from the DNS manager. Here's how:

1.  Select a domain zone. The DNS records for the selected domain zone appear.
2.  Select the **Remove** link next to the DNS record you want to delete. A warning appears asking whether you want to delete the record.
3.  Click **Yes, delete this sucker**.

You have successfully removed the DNS record. It can take up to 30 minutes for the changes to be removed.

##Troubleshooting

Having problems with your DNS records? We recommend reviewing this section to help get your DNS settings back on track. Follow these tips to troubleshoot DNS issues.

### Waiting for Propagation

If you've just made a DNS change and aren't seeing it reflected yet, try waiting 48 hours. DNS updates will take effect, or *propagate*, within the time period set by your zone file's [TTL](#setting-the-time-to-live-or-ttl). In some cases the new information may not be reflected for up to 48 hours.

While you can't control DNS caching at every point on the internet, you do have control over your web browser. Try holding down the *Shift* key or the *Control* key (depending on your browser) while you refresh the page to bypass your browser's cache of the old DNS data. You can also try bringing up your site in an alternate browser, or [Previewing Your Website Without DNS](/docs/networking/dns/previewing-websites-without-dns).

### Setting the Time To Live or TTL

Time to Live (TTL) tells Internet servers how long to cache particular DNS entries. The default TTL for Linode zone files is 24 hours. This is fine for normal DNS situations, because most people don't update their IP addresses all that often.

However, there are times when you'll want the TTL to be as low as possible. For instance, when you make a DNS change, you'll want that change to propagate quickly. Otherwise, some people will see the new site right away, and others (who had the old data cached) will still be visiting the website at your old server. Long caching times can be even more problematic when it comes to email, because some messages will be sent to the new server, and some to the old one.

The solution is to lower your TTL before making a DNS change. You'll want to lower the TTL first, on its own, before making any other DNS changes. Here's a general overview of what should happen during a smooth DNS update:

{: .note}
>TTL is always written out in seconds, so 24 hours = 86400 seconds.

1.  Check the TTL on your current zone file. Typically, this will be 24 or 48 hours.
2.  Visit your current zone file 48 (for a 24 hour record) to 96 (for a 48 hour record) hours early, taking into account any intermediate DNS servers. Lower the TTL to five minutes (300 seconds, or the lowest allowed value). Do not make any other changes at this time. If you're using Linode's DNS Manager, lower the TTL to 5 minutes for each entry you're going to change.
3.  Wait out the original 48 to 96 hours.
4.  Visit your zone file again to make all of your IP address and other updates.
5.  DNS changes should propagate within fifteen minutes, meaning that your new website and/or email will now be live.

### Finding Current DNS Information

Sometimes you may need to find the current DNS information for a domain. There are two great tools for doing this:

-   **dig**: Look up individual DNS entries. For example, you can find the IP address where your domain resolves.
-   **WHOIS**: Find your registrar and nameserver information for your domain.

If you're using a computer that runs Mac OS X or Linux, you can use these tools from the command line. To find your domain's IP (the primary A record), run this command:

    dig example.com

Look in the *answer section* of the output to locate your IP address. You can also query for other types of records. For example, to see the mail records for a domain, run this command:

    dig mx example.com

This returns all of your domain's MX records.

To find your domain's registrar and nameserver information, run this command:

    whois example.com

This generates a large amount of information about the domain. The basic information you need will be near the top of the output, so you might have to scroll back to see it.

If you're on a Windows machine, or you're more comfortable using a web-based tool, you can also use [kloth.net](http://www.kloth.net/services/dig.php) for dig requests and [whois.net](http://whois.net/) for WHOIS requests. Note that since you're running these lookups from a third-party website, the information they find is not necessarily what your local computer has cached. (There should be a difference only if you've made recent changes to your DNS information.)

##Next Steps

Now that you are familiar with Linode's DNS Manager, you should set up your [reverse DNS configuration](/docs/networking/dns/setting-reverse-dns), and consider looking at our [Common DNS Configurations](/docs/networking/dns/common-dns-configurations) guide.



