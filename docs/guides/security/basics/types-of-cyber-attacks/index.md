---
slug: types-of-cyber-attacks
description: 'What are the most common types of cyber attacks? This guide explains what they are, how they happen, and how to prevent them.'
keywords: ['network attacks','types of cyber security attacks','system attack','cyber attack types']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-17
modified_by:
  name: Linode
title: "Eight Common Types of Cyber Attacks and How to Prevent Them"
title_meta: "What are the Most Common Cyber Attacks?"
authors: ["Andy Patrizio"]
---

As long as there have been personal computers, there have been cyber attacks, even in the pre-Internet days of the 1980s. Malware started out simple; they damaged your data, apps, or floppy disks. Malware authors did it for no other reason than to be mean.

With the evolution of the PC and the Internet, came a broadening of the types of cyber attacks as theft became the most common form of cyber attacks causing damage. The most common goal of a cyber attack is to steal information – banking and credit card, primarily – but there are other types of cyber attacks as well.

Another common element behind cyber attacks is criminal syndicates. Stealing bank account numbers and credit cards is big business, especially in countries where such behavior is rarely punished.

It’s not just individuals who are targeted. Companies and other institutions are subject to various types of cyber attacks, from phishing attacks to steal information to distributed denial of service (DDoS) designed to overwhelm a government’s or company’s servers and crash them.

Bad actors are determined, but so are the developers who fight all forms of cyber attacks with anti-malware software, firewalls, intrusion detection, and more. The most common cyber attacks are listed below, along with means of prevention, and mitigation.

## Common Mitigation Techniques

There are many types of malware and the same solutions often apply to all of them. Rather than repeat them every time, they appear in the list once.

1. Emphasize to your employees: NEVER click on an attachment from an unknown sender. Security experts have been saying this for twenty years. This advice holds true to every form of malware in this list. Do not double-click on a file from an unknown sender. If it’s from a known sender, verify they did indeed send the file if you didn't ask for it.

1. Use a comprehensive antivirus solution. Antivirus products have multiple tiers of malware protection. The less-expensive ones protect you from virus infection and the more comprehensive ones check email to block malicious payloads and prevent you from visiting web pages with known malicious code. Do your homework on security software. AV-TEST is the Consumer Reports of antivirus, where you can research the different products and how effective they are.

1. Use a firewall to secure your server's network. A firewall allows you to allow network traffic only on ports, protocols, and IP addresses that you specify. This greatly reduces your network's available attack surface. You can use open-source tools like UFW, FirewallD, and iptables. You can also consider using cloud-based firewalls, like [Linode Cloud Firewall](https://www.linode.com/products/cloud-firewall/), to protect your Linode servers.

1. Deep scan your PC regularly. Boot your PC into safe mode and run a deep scan on the antivirus program. This checks every single file on the computer. Do this once a month.

1. Disable AutoRun. The Windows autorun feature automatically installs software. Disable it to prevent operating systems from launching commands from unknown sources without your approval.

## The Major Cyber Attacks

This is a list of the eight most common forms of cyber attack. The term “Trojans”, like the mythical horse, appears benign but carries a malicious payload. Most of the cyber attacks on this list are delivered via Trojans. Because it is a delivery system, it is not included as a cyber attack here.

### Ransomware

Ransomware tops the list because it is currently the most dominant form of cyber attack, as well as the
most potentially expensive. Ransomware is a specific type of malware that completely takes over a computer and renders it unusable until the user or organization pays a ransom. Recently, ransoms are soaring into the millions of dollars.

Not only does it lock you out of the PC, the ransomware software looks through your computer for vital files like Word Docs and Excel tables, then encrypts them with an unbreakable key. Even if you do get at the files you can’t open them.

Ransomware is most often spread through phishing emails and through drive-by downloading. A phishing email is one where a malicious payload is attached and executed when the unwitting user double-clicks on it. Drive-by downloading occurs when a user visits an infected website and downloads malware which is installed without the user realizing it.

#### Ransomware Mitigation

Much of the effort around ransomware is recovery and rollback. An admin can roll back the infected computers to a time before infection, by taking constant snapshots of client and server environments. This is expensive and time consuming.

Strong security at the firewall and endpoint is key. Ransomware is detectable just like any other form of malware. A detection signature database can recognize known ransomware payloads and is a core component of Intrusion Detection and Prevention (IDP).

### Keyloggers & Spyware

Keyloggers and spyware both fall into the same category. They lurk in your computer, monitoring your every move. They log web activity and typing to steal credit cards, e-commerce and bank accounts, and other password-protected accounts. They keep track of your keystrokes on your keyboard and record them on a log. That log is then sent to a server, usually outside the country.

#### Keyloggers and Spyware Mitigation

Common sense is key in not opening emails from unknown sources. Regular antivirus scans pick up spyware. Network monitoring tools watch for suspicious outbound traffic. You can also check for unusual activity using a [system monitoring tool like gtop](/docs/guides/installing-and-using-gtop-on-linux/).

### Rootkits

Rootkits are a particularly nasty form of malware because they hide in the system internals of your computer and enjoy system-level protection. Rootkits are used to get full access to the system for stealing information or other malicious activity, like botnets, and keyloggers. Rootkits hide a large number of files and even system processes that might give it away.

#### Rootkit Mitigation

Rootkits are frequently delivered by email attachments and drive-by attacks, so standard cautions apply here as well. The problem is once they get into a system they are difficult to remove. Standard antivirus programs don’t remove them. You need specific anti-rootkit programs from vendors like [Malwarebytes](https://www.malwarebytes.com/antirootkit), [Avast](https://www.avast.com/c-rootkit-scanner-tool), [AVG](https://www.avg.com/en/signal/rootkit-scanner-tool), and [Lynis](https://github.com/CISOfy/lynis).

## Man-in-the-Middle Attack

Every connection on the Internet is a point-to-point connection, such as your connection to this page. There are many hops in between, but in the end, there is a direct connection between your client/endpoint and the server hosting this page.

A man-in-the-middle attack is carried out by a particularly skilled hacker to get between you and a legitimate connection. For example; you forget the password to your bank account and request a change. An email comes in from your bank with a link to change the password. But the link doesn't go to your bank, it goes to a phishing site made to look like your bank. Now they have your account and password.

That’s a man-in-the-middle attack. They intercept a legitimate connection, like an email, and redirect you to a theft site.

### Man-in-the-Middle Attack Mitigation

MITM attacks are traditionally done over unsecured routers, like public wi-fi spots. Home PC connections are considerably more secure due to the hardwired connection. Make sure to use the strongest encryption available for your home Wi-Fi network, WPA3 if possible or WPA2. Always use secure browsing, make sure there is `HTTPS://` in the URL and not `HTTP://`. Finally, don’t use the Starbucks wi-fi to access your bank or anything else vital. Wait until you are connected to the Internet over a trusted and secure network.

## Botnet

A botnet isn’t so much an attack as a takeover. The malicious payload is often a spam program designed to use a compromised computer to send out thousands of spam emails that can’t be traced back to the true source. They are also used to launch denial of service (DoS) attacks and other remote attacks.

### Botnet Mitigation

Standard security measures usually catch a botnet. Botnets are network-oriented attacks, so network security best practices apply. Use a firewall with outbound scanning, use *least privilege* on client PCs to prevent unauthorized installs, monitor for excessive outbound traffic, use a proxy server to filter outbound traffic, and if you can, adopt a [Zero Trust](https://www.crowdstrike.com/cybersecurity-101/zero-trust-security/) network.

## Denial of Service (DOS) and Distributed Denial of Service (DDoS)

These attacks are against organizations rather than individuals. Both are attacks where a web site, service, or online app is overloaded with connection requests so the service is taken down. The difference between a DoS and a DDoS attack is that the DoS attack is launched by a single machine or user while the DDoS attack is launched by multiple machines. This makes DDoS attacks more difficult to prevent than DoS attacks because the attack is considerably more powerful.

### DOS and DDoS Mitigation

DoS/DDoS attacks are the most expensive to mitigate because they require costly and comprehensive technology solutions, and the talent and expertise to go with it. It’s rare for SMBs and some enterprises to be hit because many DDoS attacks are against opportunistic or disliked corporate targets. Companies like Google and Amazon have been targeted, while the Pentagon is often the target of DDoS attacks originating outside of the USA.

DoS/DDoS attacks require a strong, effective response plan, with a strategy to mitigate these attacks for your unique network. This includes hiring consultants with expertise in the field.

The first active step to take is to increase bandwidth, since the attack affects the normal flow of traffic between the website and its server. A temporary increase in bandwidth may help. Adding redundancy to the servers is another key step. Content Delivery Networks (CDN) specialize in this so there is no single squeeze point. Concurrent with that is the use of load balancers to distribute your traffic equally among the servers on your host.

## Worms

Once one of the most common types of malware, worms do what their name implies. They spread across computer networks by exploiting operating system vulnerabilities and misconfigurations. A worm is a standalone program that replicates itself to infect other computers, without requiring action from anyone. Some are benign and simply want to see how far they can spread. Others are more malignant, acting as Trojans to deliver dangerous payloads.

### Worms Mitigation

Standard security practices apply here, with one additional step: zero trust networks. One of the inherent weaknesses of network design is that once a bad actor gets past the firewall, they are free to roam the network. Zero trust networks, as the name describes, require verification and credentials at every step of the way. They are designed that way to halt the actions of worms and human interlopers.

## Basic Viruses

The original malware, basic computer viruses are designed to damage the target computer or device by corrupting data, destroying the hard disk tables, or completely shutting down your system. They are written for no other purpose than malice.

### Basic Viruses Mitigation

Standard practices work here, with an addendum. Viruses replicate through disk transfer. They wreaked havoc in the era of the floppy disk. Today, thumb drives are the new floppy disk and a virus can easily travel via thumb drives. Antivirus programs detect when a thumb drive has been inserted in a USB port and pop up a window asking if you would like to scan it. Click yes. The minute or so a scan takes can make all the difference.

## Conclusion

The security industry tends to focus on “zero-day” malware, meaning newly discovered attacks. The fact is much of what is out there has been in the wild for months, if not years. Most common infections are not zero-day, but malware that has been known for months.

Why does it persist? Because people are complacent about keeping their OS patched and computer checked. Large enterprises are better at keeping their endpoints locked down, but SMBs have a greater challenge.

Much of what happens is not difficult to address. It’s no burden to run a full virus scan of your computer. Security experts should not have to continue to warn against clicking on an attachment from an unknown source.

For all the anti-malware software and network security, the first and last line of defense is the staff, and with the proper information, it is not difficult to keep your computer safe.













