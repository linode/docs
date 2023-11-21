---
slug: firewall-best-practices-for-securing-your-cloud-based-applications
title: "Firewall Best Practices for Securing Your Cloud Based Applications"
description: 'Explore the firewall best practices to secure cloud-based applications, from security policy and network design to rule sets, audits, logs, and updates.'
keywords: ['cloud-based firewall','block malicious traffic','stop ddos attacks','unified threat manager','security tool','network security','application security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["David Robert Newman"]
published: 2023-11-20
modified_by:
  name: Linode
---

Moving to the cloud has many advantages, including flexibility, reduced management overhead, performance, and security. [Cloud-based firewalls](/docs/products/networking/cloud-firewall/) can offer finer-grained access control and more comprehensive threat mitigation than their traditional hardware-based counterparts.

This guide outlines best practices for cloud-based firewall deployment. This includes network design review, creation of a security policy, firewall rule ordering, log analysis, and regular auditing.

## What Is a Firewall?

A common misperception is that firewalls are just access-control devices that limit reachability to hosts and applications. While firewalls do provide access control, they also mitigate security threats in many other ways. In the broadest sense, a firewall is a device that enforces a security policy.

Because firewalls often sit between network segments, they may also function as routers. Many commercial firewall products include some form of unified threat management (UTM). UTM bundles antivirus, anti-phishing, intrusion detection/prevention, and DDoS protection features along with access control.

Over time, firewalls have moved up the application stack. The first implementations were simple filters that blocked or allowed individual packets based on IP address and port number. The next wave of products added stateful inspection, which monitor flows instead of individual packets.

Modern firewalls, including so-called next-generation firewalls (NGFWs), operate at the application layer (L7). They may control access based on HTTP URLs, specific types of SQL queries, or other application-layer criteria.

As part of a UTM bundle, some also perform deep-packet inspection (DPI). DPI peers into each packet’s application headers or body content to make forwarding/blocking decisions. This can be especially important given that poorly written web applications are often the weakest link in any security chain.

At the heart of any firewall is its rule set, the configuration that determines how the firewall implements a given security policy.

## Develop a Security Policy

Before deploying a cloud-based firewall, it’s important to first write a security policy. Think of this document as a set of specifications defining exactly what you expect your networks and firewalls to do.

A security policy should be as specific as possible. Include network diagrams showing which resources you need to protect, and list all permitted applications, services, hosts, and networks.

Understanding your cloud-based applications is critical. If a custom web application requires access to a non-standard set of ports, or if your back-end servers only need to respond to certain types of SQL queries, your security policy and firewall rules must reflect that.

The document may also cover user groups by defining which resources different teams can reach. For example, marketing can reach DNS, email, and web servers, but only engineering can reach build servers.

Once you have a clear and comprehensive security policy, you’re ready to review your cloud network design and configure your firewall(s).

## Segment Your Network

For decades, information security professionals have warned about the "M&M" approach to network design, which wraps "a hard crunchy shell around a soft chewy center".

Researchers Bill Cheswick and Steve Bellovin famously [warned](https://www.wilyhacker.com/) that a firewall at the network perimeter "only provides security if there is no way to get to the interior. Today, that may be unrealistic." That was in 1994, and yet perimeter-only use of firewalls persists today, even in some cloud deployments.

Before you decide on firewall placement for your cloud-based applications, first consider how to segment your network design to protect against unauthorized access.

Cloud-based firewalls have an advantage because they allow *microsegmentation*. Here, virtual boundaries between trusted and untrusted resources can exist at many places in the network. This is an advantage over hardware-based firewalls, where cost and management overhead may limit firewall deployment to the network edge.

Many cloud-based services use multi-tier network designs. Here, an Internet-facing tier of web servers are backed by one or more additional tiers of content and database servers. Access control is important not only for the front-line web servers but also for communications between tiers.

A best practice is to use IP subnetting to segment each server tier and use firewall rules that enforce access policies between tiers. This is the opposite of the M&M model as it protects against unauthorized traffic at every tier, not just at the perimeter.

## Block All Traffic by Default

"Live and let live" may be excellent advice in real life, but when it comes to information security the opposite is true. The general principle of building a firewall rule set is that everything is prohibited except that which is explicitly permitted.

Many firewall implementations read rules from first to last. Your very first firewall rule needs to deny all traffic by default. After that, you can add rules that allow the specific users and applications your security policy allows. The initial default-deny rule drops everything else.

## Allow Specific Traffic Only as Needed

The firewall rules you add after the default-deny policy need to forward only that traffic your security policy explicitly allows. This is known as the "principle of least privilege", where firewall rules implement the exact specifications from the security policy, and nothing more.

For example, if DNS lookups go through a firewall, its rules must permit access for UDP port 53 traffic, but not TCP port 53, which is usually reserved for zone transfers. The least-privileged approach applies to servers or server groups as well as traffic types. The same rule that allows DNS lookups could also permit forwarding only to an authorized set of DNS servers rather than to any host.

The opposite of the principle of the least privilege is a very common error in firewall rule set design. This is the idea that "my network can do no wrong" and thus it’s okay to allow all outbound traffic.

Allowing unlimited outbound access is a common attack vector because it can allow internal hosts to send unauthorized and possibly malicious traffic.

Many applications use "phone home" features where a client behind a firewall initiates connections. Benign examples include remote-control applications used by IT teams for troubleshooting and the telemetry services built into many operating systems and applications. A malicious example is malware installed on a client. Benign or not, these applications bypass firewall rules governing inbound traffic.

This is where the principle of least privilege comes in. It’s important to define a security policy that covers the *exact* user groups, hosts, and traffic types allowed. Then let the default-deny policy drop everything else. For example, networks that use proxy servers need to have firewall rules that permit HTTP and HTTPS traffic to, and only to, the proxy servers. The default-deny rule then drops any client’s attempt to reach outside web servers.

## Run Frequent Audits

The axiom "security is a process, not a product" means that all security policies and firewall rule sets must change over time. Network administrators may poke holes through firewalls for web applications that require access on non-standard ports. Users may require access to work from home, something perhaps not contemplated in the original security policy. New classes of threats regularly appear.

As a result, your organization’s security readiness weakens over time unless you regularly review the policies and rules in place.

Regular audits of security policies and firewall rule sets can help answer questions like:

- Which applications and services are running on the network right now?
- Does the security policy cover every application and user group, both new and existing?
- Do firewall rule sets contain entries that cover everything in the current security policy?
- Do firewall rule sets contain stale entries for applications, services, or host groups that are no longer in use? Many firewalls have the ability to show how many times network traffic invokes a particular rule. A rule that’s never invoked might no longer belong in the rule set.
- Do firewall rule sets allow access to external hosts for services provided internally?

Regular policy and rule set audits can answer these questions. They can also help ensure your security posture comprehensively and adequately reflects current conditions in your cloud network.

## Monitor Security Logs

Most firewalls produce voluminous logging about network traffic, and this information often goes unchecked. Ignore the logs, and you’re likely to miss important security breaches. However, triggering an alert for every firewall rule violation is likely to leave you swamped, and unable to respond when a serious incident does occur. Prioritization and automation is key when it comes to making effective use of log data.

When determining which log entries are most important, outbound connection attempts are a good place to start. Internal hosts attempting email or SSH connections with external hosts should trigger log entries. For firewalls with application-layer access controls such as URL filtering, look for attempts to reach known malware and hacking sites.

In other cases, log entries may be noteworthy depending on who initiates a connection. A developer uploading source code onto GitHub from a cloud-based build server is one thing. The same code coming from a user in marketing or HR is quite another.

Once you’ve picked the most critical log entries to watch, automation can reduce a firehose of log data into a trickle of useful and actionable alerts. A monitoring system that automatically triggers an alert for each and every attempt to reach a blocked site would be useless. However, a system that automatically alerts you only for high-severity events, based on log criteria you define, can help you spot attempted attacks as they happen.

This advice applies tenfold for firewalls with UTM capabilities, especially those with intrusion detection/prevention systems (IDS/IPS). A well-known issue with IDS/IPS devices is that they require extensive tuning of rule sets. Many products help by classifying attack signatures into high-, medium-, and low-priority buckets. At least at first, enabling only the high-priority signatures can help prevent overloading your logs and alerting systems.

## Update Firewall Software

While it’s best practice to keep all cloud-based hosts, containers, and applications updated, it’s especially important to apply patches to firewalls as soon as they’re available. Any security policy carries an implicit assumption that firewalls and related security tools are capable of protecting users and hosts. However, that assumption becomes false if the firewall itself is vulnerable.

An important corollary is that firewalls with UTM features must keep their antivirus and IDS/IPS signature libraries up to date. Security researchers uncover new attacks on a daily basis. Additionally, many attackers "fuzz" a given attack, slightly altering it in the hope of eluding a matching IDS/IPS signature. If your firewall provider offers an automatic update service, use it.

This is one area where some cloud-based firewalls have a major advantage over their hardware-based counterparts. Many cloud firewalls operate on a firewall-as-a-service (FWasS) model. You don’t need to perform updates because your provider handles that for you.

If you do use a cloud-based version of a standalone firewall, be sure it’s hardened as well as updated. Disable unused services and accounts. Limit management access. Make regular backups of all configurations and databases. Securely send logs to a centralized security information and event management (SIEM) server that is itself hardened.

## Conclusion

Cloud-based firewalls allow fine-grained control over all your platforms and applications. With the right combination of best practices, including microsegmentation, logical rule ordering, monitoring, auditing, and updating, you can ensure equal or better protection of your resources than a conventional hardware-based firewall provides.