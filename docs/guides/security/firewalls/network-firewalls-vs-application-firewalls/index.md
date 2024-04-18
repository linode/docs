---
slug: network-firewalls-vs-application-firewalls
title: "Network Firewalls vs. Application Firewalls"
description: 'Learn the differences between network and WAF firewalls that developers and administrators need to know when using firewalls to secure their workloads.'
keywords: ['cloud-based firewall','web application firewall','network firewall','block malicious traffic','stop ddos attacks','unified threat manager','security tool','network security','application security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
contributors: ["David Robert Newman"]
published: 2024-01-03
---

When it comes to network security, the age-old question is whether to deploy firewalls near your network perimeter, or close to your application servers. You can and should do both.

This guide describes the difference between firewalls that protect networks and those that guard applications. It also recommends which use cases make the most sense for each firewall type, and which attacks they’re best at stopping.

## The Evolution of Firewalls

Firewalls have matured over time from simple packet filters to sophisticated cloud-based multilayer, multifunction security services. The earliest firewalls were standalone devices that inspected each incoming packet and made forwarding decisions based on network or transport-layer criteria. Newer firewalls provide "statefulness", the capacity to track connections rather than individual packets. This prevents entire classes of attacks, such as those that inject out-of-sequence TCP datagrams into an existing connection.

Today, there are three new types of firewalls, with considerable overlap between them:

- **Next-Generation Firewalls (NGFWs)** add some form of application-layer filtering and other security functions such as virtual private networking, antivirus/anti-malware controls, and/or intrusion detection/prevention systems.

- **Web Application Firewalls (WAFs)** offer very granular control over application behavior, especially for web-based applications. Many WAFs use deep-packet inspection (DPI) and other techniques to peer into user traffic.

- **Cloud-Based Firewalls** may be an NGFW, WAF, or some combination of the two. You typically deploy cloud-based NGFWs at the perimeter of cloud deployments, and WAFs close to application servers. Importantly, this is not an either/or scenario, as the two working together provide more defense than either working alone.

Regardless of type, you may provision a cloud-based firewall as a firewall-as-a-service (FWaaS) or an application running on a VM. [Akamai offers FWaaS products](/docs/products/networking/cloud-firewall/) that protect hosts anywhere in the cloud, even across multiple data centers. FWaaS offerings have the advantage of offloading system maintenance onto the provider.

Firewall applications may be software versions of commercial firewalls or open source packages included with Linux or BSD distributions. As applications running on a VM, these firewalls work similarly to their non-cloud versions.

## Network Firewalls

Some of the confusion between network and application-centric firewalls stems from misunderstanding the meaning of these terms. NGFW and WAF are marketing terms. The technical definition of a firewall from [RFC 2647](https://www.rfc-editor.org/rfc/rfc2647#section-3.16) simply refers to "a device or group of devices that enforces an access policy between networks".

There are two key differences between network and application firewalls: how they enforce an access policy, and where they enforce it.

A useful metaphor is that of a large office building, with network firewalls playing the role of security staff at the building entrances. In contrast, application firewalls are more like the locks or badge readers on interior doors. Here, network firewalls cover the entire building, while application firewalls cover specific rooms.

Network firewalls generally make access-control decisions using criteria at the network and/or transport layers, or Layers 3 and 4 of [the seven-layer OSI model](/docs/guides/introduction-to-osi-networking-model/).

It’s best practice to place network firewalls at or close to the perimeter of each data center in your cloud network. Think of these as gatekeepers, blocking malicious traffic before it enters your network.

Just as importantly, a firewall at the network edge also manages which traffic can leave. A common error in firewall configuration is to allow all outbound traffic from protected hosts. To protect against malware and rogue applications that "phone home", your firewalls should only allow the minimal amount of outbound traffic your security policy permits. See [Firewall Best Practices for Securing Your Cloud-based Applications](/docs/guides/firewall-best-practices-for-securing-your-cloud-based-applications/) for more information.

Because cloud-based firewalls allow for microsegmentation, it’s best practice to deploy network firewalls *between* network segments in addition to the periphery. This is a defense-in-depth approach to network design.

Even though a network firewall lacks application-layer knowledge, it can protect hosts and apps from many types of vulnerabilities. Here are some examples:

- **Known Bad Sources**: Network firewalls can block traffic to and from known malware and phishing sites and reject email from known spam sites.

- **Spoofing Attacks**: Network firewalls can prevent IP spoofing by dropping traffic from the Internet that appears to originate from internal addresses. Further, stateful firewalls can protect against man-in-the-middle attacks where an intruder tries to hijack an existing connection.

- **Brute-Force Attacks**: A network firewall can track TCP connection establishment rates to block intruders attempting SSH brute-force login attempts or similar attacks.

- **Malformed Traffic Attacks**: Network firewalls also can block traffic with malformed packet headers, preventing attacks that can result in denial of service.

In all these cases, the firewall works to protect the entire network before an attacker can reach any of your apps.

## Application Firewalls

As the name suggests, application firewalls inspect traffic at Layer 7 of the OSI model, the application layer. A simple example would be a firewall that allows outbound web traffic but blocks employees from reaching Facebook or other social networks. This is possible because the firewall is capable of parsing HTTP URLs at the application layer.

Layer-7 visibility matters because web applications often represent the weakest link in the security chain. Verizon’s [2023 Data Breach Investigations Report](https://www.verizon.com/business/resources/reports/dbir/) found that web apps represent the most commonly compromised asset, accounting for more than 60% of all breaches. This is ahead of other assets like email servers, desktops and laptops, databases, and phones.

The prevalence of web application vulnerabilities is as much cultural as technical. Engineering models like continuous integration/continuous delivery (CI/CD) and DevOps enable much faster deployment. However, this is often done without collaboration between web application developers and IT or network engineering teams responsible for security. Application firewalls can help fill this void.

Although they’re often called web application firewalls (WAFs), Layer-7 firewalls can protect many types of applications, not just those running over HTTP. You can use these firewalls to protect SQL databases, email hosts, VoIP PBXs, messaging servers, and other applications that don’t necessarily use HTTP.

For example, an application firewall may be able to block SQL injection attacks by identifying malformed database queries. Queries in inappropriate places such as login and password fields may likewise be caught.

Application-layer inspection allows firewalls to block multiple classes of attacks that network firewalls don’t see. Here are some examples:

- **Vulnerable Code Libraries**: Many web applications rely on external libraries with known vulnerabilities. Because it inspects application-layer headers, and in some cases the body content, an application-based firewall can identify and block attempts to exploit weak libraries.

- **Deserialization Attacks**: Many applications reassemble blocks of data sent across the network before using them, a process known as *deserialization*. Despite generations of computer-science professors teaching students that they must *always* validate input data, too many web applications accept input blocks unchecked. This results in deserialization triggering an attacker’s malicious code sent across multiple blocks. Application-based firewalls mitigate this threat by "pre-assembling" and inspecting blocks before it reaches the web application.

- **Layer-7 DDoS Attacks**: Unlike lower-layer distributed denial-of-service attacks that tie up network resources such as TCP ports, an application-layer DDoS attack works by exhausting application-specific attributes such as login attempts. Because application-based firewalls can keep state on existing sessions and track the rate of new connection attempts, they can shut down DDoS attempts before they reach application servers.

- **Cross-Site Scripting Attacks**: Similar to an SQL injection exploit, an attacker in a cross-site scripting (XSS) attack inputs malicious client-side code into web pages. Viewing the web page then triggers the malicious code, leading to disclosure of login credentials and other vulnerabilities. Although XSS attacks date to the late 1990s, they keep recurring regularly because many web applications inadequately screen input before processing. Application firewalls can help by identifying and blocking malicious code embedded in input fields.

All these capabilities require significant processing power on the part of application firewalls, and point to one use case where they might not be appropriate. An application firewall may be overkill in organizations that use well-known hostnames and/or IP addresses for internal access. Here, a network firewall may be sufficient to restrict access for internal users.

In other cases, especially when rapidly evolving web applications are Internet-facing, application firewalls are the way to go. Read [Level Up Application Security with a Web Application Firewall](https://www.linode.com/blog/security/level-up-application-security-web-application-firewall/) to learn when to use a WAP and how to choose one.

## Unified Threat Management (UTM)

In addition to making access-control decisions, many application firewalls use the term unified threat management (UTM) to indicate other security functions bundled on the same platform. However, UTM is a marketing term, not a technical one. Broadly speaking, UTM is shorthand for "firewall bundled with virtual private networking, intrusion detection/protection, and antivirus software".

Some UTM products also include anti-phishing modules, which is very important given the ever-increasing success of social engineering attacks. Some products also offer deep-packet inspection to look into packet payloads, rather than just application headers.

## Conclusion

The choice between network and application firewalls isn’t an either/or decision. Both are useful tools in developing an effective defense-in-depth strategy. A solid understanding of firewalls helps protect your network perimeter and your application servers to provide safer access to your cloud-based services.