---
slug: network-security-tools
description: 'What are network security tools and how can you use them? We answer these questions and highlight the best network security tools available.'
keywords: ['network security tools ','networking security tools','network security software tools']
tags: ['security']
bundles: ['network-security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-19
modified_by:
  name: Linode
title: "Network Security Tools and How They Help You"
title_meta: "Network Security Software Tools and Devices"
authors: ["David Strom"]
---

Security starts with having a well-protected network. This means keeping intruders out, and continuously scanning for potential breaches and flagging attempted compromises. Sadly, there is no single product that will protect everything, but the good news is that over the years a number of specialized tools have been developed to help you protect your enterprise network. Your burden is to ensure that there are no gaps in between these various tools, and that you have covered all the important bases to keep your network secure and protect yourself against potential harm from cyber criminals. New security threats happen daily as attackers target your business, make use of inexpensive services designed to uncover weaknesses across your network or in the many online services that you use to run your business.

## What is Network Security?

Network security involves protecting the communication pathways and connections from becoming potentially harmful, either from being used by intentional hackers or unintentional configuration errors. This protection means installing both hardware and software to a wide range of devices and protocols, including computers, servers, printers and industrial equipment that uses network controls.

## How Can Network Security Tools Help?

A big challenge is first considering the scope of "your network." The reason for the quotes is because what is part of your corporate domain has expanded. Gone are the days where a data center sitting on a raised floor could have its own physical entry security to protect the equipment within its walls. Today’s networks extend to various clouds, where you might not even know their exact physical location. There you find software and service providers that run particular applications, such as email servers and customer management software. This configuration presents additional protective challenges. Your security apparatus needs to cover all of this gear, no matter if it is sitting inside your corporate headquarters or halfway across the world.

This places an additional burden on securing your network, because your security tools and services have to distinguish between a legitimate employee who happens to be working on some project while visiting their family in some far-flung corner of the planet with a bad actor who is trying to compromise and collect your data. The benefit of having the right network security tool set is that you are able to eliminate the latter without putting obstacles in the way of your remote workers from doing their jobs. Another goal is to keep your online operations up and running without having to take down your servers after an attack and spend days or weeks offline repairing the problem and removing any malware or compromised systems.

A second use case for network security devices and tools is to correct problems of your own making that slow down your network throughput – either by accident or by some mistake – or prevent particular applications from running due to some configuration error. These mistakes can become serious by harming your overall reputation, or disrupt, or create ill will with your customers, having future implications for your business. For both situations, having this security in place helps to keep your company’s confidential data private and also keeps your business operational. It also helps to centralize control over your network operations to ensure that things are running as efficiently as possible.

## Types of Network Security Tools and Specific Products

This section reviews the many different kinds of network security products that you need, and also points out tools that are available to protect your own Linode-based services.

###  Network Firewalls

**Network firewalls** are your first line of defense because they segregate your corporate network – and corporate computing resources -- from the rest of the world. As businesses become more centered and connected online, you need this segregation to prevent unauthorized people from accessing your most sensitive data and customers’ private information. Firewalls use various access control rules to determine who and what applications are allowed and prohibited. These tools can also be used to separate different departments into virtual networks or VLANs, so that the sales team can’t view data that is in the accounting domain, and vice-versa. You might recall the [Home Depot breach from 2014](https://ir.homedepot.com/news-releases/2014/11-06-2014-014517315), which resulted from having a single network that allowed attackers to steal payment data from their point-of-sale systems, even though they compromised other systems initially.

#### Network Firewall Products

Typical network firewalls include products from Palo Alto Networks, Check Point Software, Sophos, Fortinet and others. Linode has two relevant tools in this area ([Cloud Firewall](https://www.linode.com/products/cloud-firewall/) and our own [VLAN service](https://www.linode.com/products/vlan/)) that are used to protect your computing resources across our cloud services.

### Virtual Private Networks (VPN) and Remote Access Control Products

A second aspect of network security is also essential these days during the pandemic when more workers are accessing company resources remotely, either from their homes or from outside locations. This is the job of **virtual private networks (VPNs)** and **remote access control products**. These tools provide logical separation of your network data traffic by using encrypted communication channels. While your computer may be sitting in a coffee shop in Seattle, your fellow coffee drinkers won’t be able to snoop and view your data or network communications.

#### Virtual Private Network Vendors

Typical vendors in this market include Juniper, F5 Networks and Cisco. There are also specialized VPNs for the cloud services providers from Amazon, Google, and Microsoft Azure that can be used to segment your resources and ensure that no one else can connect to them. And to ensure that you have configured your cloud VPN services appropriately, there are several different tools that check for potential data leaks. Amazon, for example, has three different tools that work together called Inspector, GuardDuty and CloudWatch. There are also third-party leak-checkers from Shodan.io and BinaryEdge that determine if you have set up a cloud storage repository that has insecure credentials.

### Data Loss Prevention Tools (DLP)

A third set of network security software tools keeps track of a very important situation: despite firewalls and VPNs, some information may leak out, either deliberately (think of a recently fired employee) or accidentally (through some well-crafted attack or through a manual misconfiguration error). These leaks can include credit card and Social Security numbers for personal data, or more targeted attacks that reveal bank accounts or customer data. These **data loss prevention (DLP)** tools monitor and flag these leaks in a timely fashion, so the leak can be stopped or prevented entirely. The news is filled with data leaks caused by a single person’s mistake (such as the [Equifax 2017 breach](https://www.ftc.gov/enforcement/cases-proceedings/refunds/equifax-data-breach-settlement) or [Veeam’s 2018 breach](https://brite.com/botw-veeam-exposed-records/#:~:text=What%20happened%3A,open%20database%20on%20September%205.)).

#### Data Loss Prevention (DLP) Vendors

Typical vendors include McAfee and Safend, along with some of the previous vendors mentioned previously that have complementary tools.

### Network Data Inspection

A fourth set of tools detects and then stops invading malware and other intrusions into your network. These tools **inspect your network data traffic** – either inside your premises or across your various cloud providers – and ensure that your firewalls and other network security gear are functioning properly and haven’t been compromised. These inspections happen via a variety of methods, including matching particular traffic patterns using previously identified threats and methods collected from public sources or identifying the misuse of specific protocols.

#### Network Data Inspection Vendors and Products

Typical vendors include Snort, Suricata, Trend Micro, Cisco and FireEye.

### Integrated Unified Threat Appliances

These are just four network security product categories. Many small businesses choose to combine these first four types of product into an **integrated unified threat appliance**. These appliances, or network security devices, are designed for non-security specialists and have numerous default settings that allow them to be quickly deployed on the network.

#### Integrated Unified Threat Appliance Products

Typical vendors include Check Point, Sonicwall and WatchGuard Technologies. The advantage of using an appliance is that you have a single management interface and that the various protective elements work together without you having to worry about integrating them on your own.

### Security Information and Event Management (SIEM) Tools

The next set of tools handles **various monitoring tasks**, including sending out real-time alerts when they find problems in protocol or application misuse, abnormal log entries, and other signs that your network is either compromised or operating inefficiently. They are called security information and event management, or SIEM tools. They usually aggregate a variety of data points from software agents that are running on your servers and endpoints into various reports that security analysts examine to determine what went wrong and where on your network.

#### SIEM Vendors

Typical products include Nagios, IBM QRadar, RSA NetWitness, Exabeam and Splunk.

### Endpoint Detection and Response Software

There are two complementary products to your remote access tools. The first is software that is specifically designed to protect each network endpoint, called **endpoint detection and response software**. There is a growing remote workforce, and cyber attacks have focused on this population, taking advantage of using devices that aren’t necessarily ones that have been purchased by an IT department and that are shared by other members of your family. These tools prevent malware from compromising the specific endpoint, such as when an attacker sends you an email with malware hidden in an attachment. The ideal tool enforces a series of security policies, watches out for malware infections, discovers and reports and mitigates violations, and integrates into other security products such as the event managers mentioned above.

#### Endpoint Detection and Response Software

Vendors include Tanium, VMware, Sophos, and CrowdStrike.

### Privileged Identity Management Tools

Endpoint protection products don’t work against attackers who are adept at figuring out ways to worm their way into your network by leveraging administrative privileges or escalating their rights on critical servers. This is the domain of **privileged identity management tools** that audits these access rights and determines when something is amiss, such as from BeyondTrust, Thycotic or CyberArk.

### Vulnerability Scanners

Related to the intrusion detection products mentioned above are products that scan to see if your systems are vulnerable to known attack methods. These **vulnerability scanners**, as they are called, are proactive tools that can be used to determine if you have patched your systems to the most current levels to fix known bugs or have misconfigured them to allow hackers to easily compromise them. Two common products are Nessus and Burp suite. A related type of tool is Wireshark, which is used to **analyze the actual network protocols and packets** that are sent across your network. These are typically useful to debug particular problems, such as slow responses or dropped connections.

### Wireless Network Connection Scanners

There are additional specialized tools for scanning wireless network connections. These serve a variety of purposes: first, they audit who is using your wireless networks to ensure that an attacker isn’t sitting in their car in your company’s parking lot and using your network to launch a potential attack or steal data. Or worse -- sometimes attackers set up unauthorized wireless access points on your network. Second, they also examine whether you have set up your wireless network properly and with the right level of security and encryption. The products include Netstumbler and Aircrack.

### Domain Name System (DNS) Managers

The difference between the equipment you own and the services that you connect to across the internet is getting less distinct, particularly as businesses avail themselves of more cloud-based computing. The next type of tool concerns how you manage one of the more important internet protocols, the **Domain Name System or DNS**. This is the internet’s directory, translating a domain name such as “google.com” into a series of numbers. Every time you type in a domain name in your browser, this conversion happens automatically. Managing the DNS is important for several reasons. First, because hackers can take control over the conversion process and direct your query to a server that they control and infect you with malware. Often a misconfigured DNS is an early warning that you are experiencing a phishing attack. Second, if you have not set up DNS properly, your internet access is slower and your users start to complain. There are a variety of ways to improve DNS access. Linode has our [own DNS manager](https://www.linode.com/products/dns-manager/), and there are a number of tools that protect your DNS from being compromised, including free services from Google, Amazon, Cloudflare and Quad9.

Another online protective measure is concerned with a very specific attack called **distributed denial of service (DDoS) attacks**. These attacks are targeted at your internet servers, including web and database servers, and are designed to flood random traffic so that the servers can’t respond to legitimate users’ queries. The typical victims of DDoS attacks are higher-profile organizations such as banks, government agencies, or media companies, but any business can become a target. By crashing or stopping a web server, they are designed to cost the target business time and money to repair the server and bring it back online. The DDoS attack is assembled from an army of automated bots that is orchestrated by the attacker, often from many thousands of computers located across the world. The distribution of attackers makes it harder to stop the attack and also harder to identify the source and identity of the coordinator. These attacks are growing in popularity. For example, one security researcher has found them increasing by 25% from last year.

#### Domain Name System (DNS) Manager Vendors

[Linode has our own DDoS protection](https://www.linode.com/products/ddos/), and you can purchase this from other vendors, including Cloudflare, Sophos and Google.

### Web Application Firewalls

Web servers have their own domain protection called **web application firewalls** that are designed to prevent hackers from gaining control or defacing their site pages. These tools watch requests for web pages and block those that are malicious or don’t comply with a series of specific rules. Their goal is to catch these attempts to begin an attack or to manipulate a website into providing confidential data. Unlike network firewalls, this category of products isn’t always a distinct toolset and the features can be integrated into the web servers themselves or in other tools such as web proxies or intrusion prevention products.

### Email Security Solutions

Email still remains the soft underbelly of enterprise, mid-market, and SMB cybersecurity, and this requires yet another protective tool. This is because it is the most tempting target for hackers: they just need one victim to succumb to a phishing lure to enter your network. And phishing is just one of many other attacks that can leverage a poorly protected email infrastructure: account takeovers (due to reused passwords), business email compromises (where the hacker fakes an email that looks like it is coming from one of your executives), payment fraud, specialized mobile malware and last but not least, ordinary spam messages that contain hidden malware or poisoned web links. That places a heavy burden on having a rock-solid email security solution that can also automatically encrypt messages traversing the internet to keep them private. Vendors include Cisco, Zix, FireEye and Area 1 Security.

## Conclusion

Having the right collection of tools isn’t a matter of making a single purchase. Linode offers suggestions on how to best protect your network from hackers and mistaken configurations, including your Linode-based applications.