---
slug: types-of-cyber-attacks
author:
  name: Andy Patrizio
description: 'What are the most common types of cyber attacks? This guide explains what they are, how they happen, and how to prevent them.'
keywords: ['network attacks','types of cyber security attacks','system attack','cyber attack types']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-15
modified_by:
  name: Linode
title: "What are the Most Common Cyber Attacks?"
h1_title: "Eight Common Types of Cyber Attacks and How to Prevent Them"
enable_h1: true
contributor:
  name: Andy Patrizio
  link: https://twitter.com/apatrizio
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










