---
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'A guide to testing a website for a domain before the DNS records are adjusted.'
keywords: ["dns", " website", " preview"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['dns-guides/preview-websites/']
modified: 2015-06-22
modified_by:
  name: Steve Piercy
published: 2014-01-16
title: Previewing Websites Without DNS
external_resources:
 - '[Wikipedia](http://en.wikipedia.org/wiki/Hosts_(file))'
---

Sometimes, you may want to preview your website here at Linode before you update its DNS settings. For example, if you are in the process of [migrating your website to Linode](/docs/migrate-from-shared), you might want to make sure everything looks good on the Linode side before you redirect your viewers from your old host. This can also be useful when you're creating a brand new website, or want to test your name-based virtual hosting configuration or another DNS-related feature. By making the changes described below, you can test your Linode setup from your local computer without affecting global access to your domain's current location.

## What Is a Hosts File?

The hosts file exists on all major operating systems. You can use the hosts file to force your local computer to look for your domain at Linode, rather than its current location on the Internet. From a technical perspective, the hosts file is used to associate specific hostnames to IP addresses, and takes precedence over the association provided by DNS queries. By manually specifying a specific IP address/hostname pair, web traffic sent to a domain can be directed to a server other than what's specified in the domain's A records. If these terms are unfamiliar, you might want to take a look at our [DNS](/docs/networking/dns/introduction-to-dns-records) guide.

 {{< note >}}
As an aside, hosts files are sometimes altered on computers infected by malware in order to bring you to malicious servers under the guise of a trusted domain name. It's a good idea to make sure your hosts file isn't altered by anyone but you.
{{< /note >}}

## Finding Your Hosts File

The first step is to find and open the hosts file on your local computer. Please note that to edit the file on Linux and Mac OS X systems you will need root access. For Windows systems you will need administrative privileges.

### Windows

1.  Begin by opening Windows Explorer. Navigate to `C:\Windows\System32\Drivers\etc`.

    [![The path to the hosts file in Windows.](/docs/assets/1530-windows_hosts_small.png)](/docs/assets/1529-windows_hosts.png)

2.  Open the `hosts` file. Unless you've opened it before and created a file association, it will ask you what program to open it in. Any text editor will work. In the image below we have selected WordPad, which comes by default with Windows.

    [![Windows asks what program to open the file in.](/docs/assets/1532-windows_hosts_wordpad_small.png)](/docs/assets/1531-windows_hosts_wordpad.png)

### Mac OS X and Linux

Open a terminal or terminal emulator. You can use your preferred text editor to access your hosts file. This example will use **nano**, which is installed by default on the latest Mac OS X and most Linux operating systems:

    nano /etc/hosts

{{< file "/etc/hosts" >}}
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
fe80::1%lo0     localhost

{{< /file >}}


Don't be surprised if your hosts file looks slightly different. The default configuration will vary depending on your OS.

## Finding Your IP Address

Next, you'll need your Linode's IP address.

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Linodes** tab.
3.  Select your Linode.
4.  Click the **Remote Access** tab. The webpage shown below appears.

	[![Select a data center.](/docs/assets/1534-linode-manager-6-1-small.png)](/docs/assets/1535-linode-manager-6-1.png)

5.  Copy the addresses in the Public IPs section.

In this example, the Linode's IPv4 address is 96.126.108.183 and its IPv6 address is 2600:3c03::f03c:91ff:fedf:d693. Unless your Internet service provider supports IPv6, you'll want to the use the IPv4 address.

## Updating the Hosts File

Add a new line to your hosts file. It should contain the IP address of your Linode followed by a tab, followed by the domain you want to test. For example:

    1.2.3.4     example.com

Please note that on some systems pressing tab will align to the previous lines, and may not appear as a full tabbed whitespace. This is OK.

On OS X systems, you will need to flush the DNS cache if you've already visited or looked up the domain before. The [command to do so varies according to your version of Mac OS X](https://support.apple.com/en-us/HT202516). In Terminal from a shell prompt:

    # Yosemite, El Capitan, Sierra (10.10.4 and later)
    killall -HUP mDNSResponder
    # Yosemite (up to 10.10.3)
    discoveryutil mdnsflushcache
    # Mavericks, Mountain Lion, and Lion (10.7 - 10.9)
    killall -HUP mDNSResponder
    # Snow Leopard (10.6 and older)
    dscacheutil -flushcache

On Linux systems the need to flush local DNS cache will vary.

## Testing

The effect from editing a hosts file should be immediate. In your browser, navigate to your domain:

![Our specified domain directed to our Linode.](/docs/assets/1533-hosts_test.png)

Once testing is complete or you no longer need the specific direction, you should comment out the new line in your hosts file by adding a `#` in front of it, or delete the line entirely.
