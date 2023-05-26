---
slug: secure-web-server
description: 'Developers must know how to properly secure web servers. ✓ Read our guide to learn main security risks, how to secure web applications, and best practices.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-06
modified_by:
  name: Linode
title: "How to Secure Web Servers"
title_meta: "Security in Web Applications: Best Practices"
authors: ["David Strom"]
---

Making your web application portfolio used to be a lot easier, back when web servers, and web pages themselves, were relatively simple constructions. Web applications are more complex now. They integrate a broad collection of products that span advertising services, content staging, engagement tracking, and caching & proxying of page content and databases. They are a lot harder to secure and to prevent potential exploits from happening. Keeping bad actors from breaching your defenses and accessing your company’s data or taking over your websites is a process. It involves using a variety of tools, and ensuring they work together. This guide explains what web security servers are all about. It also describes some common web-based threats and exploits, and offers up some procedures, tools, and techniques on how to defend against these attacks.

## What is a Web Server?

By its very nature, a web server is designed to share data with the outside world. It presents your corporate identity, describes your products and services, provides connections to key personnel, and broadcasts your marketing messages, among various other tasks. Web servers are also a useful way to connect with your customers, answer FAQs, and other product support questions. They also provide links to a variety of other corporate information such as investor information, press releases, product fact sheets, and other documentation.

A security server takes this basic web server and adds various protective measures on top. One way to accomplish this is through cryptographic encryption to prevent unauthorized people from entry. Another is to add firewalls or other security devices on the external side of the web server to lock down particular ports.

The security server is not a single tool or product. It typically spans a series of tools, techniques, and approaches to monitor web traffic, and to protect the entire web applications infrastructure.

## How Does a Web Application Server Work?

The typical web server is no longer an isolated part of your network. Today’s web server is at the heart of a large, connected collection of applications, databases, and front-end services. Many of the common IT operations products today also embed web servers as a way to manage them via a browser, complicating things even further.

The web server itself includes:

-   The underlying operating system (typically Linux or Windows)
-   The server software (Apache, Nginx, or Microsoft’s IIS)
-   An application server (IBM WebSphere, Apache Tomcat, Oracle WebLogic, or RedHat JBoss)
-   Other related components to secure them.

Users generate requests from their web browsers and this entire software infrastructure responds with web pages and data. However, many other requests can come from other kinds of software products themselves. For example:

-   Generating the complex pages that display product inventory for an ecommerce website.
-   A collection of blog content, including assembling supporting pieces of content such as pictures, videos, and advertisements.
-   A view of a particular customer database, where information can be collected from a variety of other sources.

## Security Risks to Web Servers

Server security is just one aspect of overall digital security ethos. It includes using network firewalls to protect overall network infrastructure, and using anti-malware software to protect endpoint computers, among other tools. Security risks to web servers involve a series of [these general kinds of attacks](https://blog.avast.com/create-a-secure-web-server-avast), which are described in more detail in the next section.

First, be concerned if you are **not using the basic secure socket layer/transport layer security (SSL/TLS) protocols** to encrypt traffic across the internet. Hackers can launch various man-in-the-middle attacks and inject their own commands into the server control dialogues. They could also create backdoors to launch attacks against any online business. In a [report from the Synopsys Software Integrity Group](https://www.synopsys.com/software-integrity/resources/analyst-reports/software-vulnerability-trends.html), 80% of surveyed respondents said the most prevalent vulnerability was based on weak SSL/TLS configurations. Google already began forcing web servers to run HTTPS, which encrypts traffic between servers and browsers, rather than the unprotected HTTP protocol. For a basic tutorial about how and why to employ cryptography, [check out this guide](/docs/guides/what-is-cryptography/).

Second, do not ignore **weaknesses in other internet protocols that could lead to security issues, including the Domain Name System (DNS)**. Attacks leveraging DNS can lead to Distributed Denial of Service (DDoS), for example. According to the [2019 Global DNS Threat Report from IDC](https://www.efficientip.com/resources/idc-dns-threat-report-2019/), most survey respondents have suffered a DNS-related attack in the past two years. An average of nearly ten attacks per company were reported, affecting almost half of the respondents’ websites.

Next are risks that involve **stealing data from all sorts of servers**, using an insecure web server as an entry point. The data is stolen using a combination of techniques, such as traffic interception or key logging. One type of stealing involves an attacker **creating malicious code to redirect traffic** away from your web servers and towards hacker-controlled sites. Once a victim is connected to the hackers’ site, they are tricked into divulging private data and login details.

**Security misconfigurations**, such as open cloud storage containers, are also responsible for numerous risks. This situation continues to plague IT departments because of simple human error. After all, developers and other users do forget to secure things properly. According to [this study by Accurics](https://start.accurics.com/CT-2020-08-Research-Report_LP-Reg.html), storage services misconfigurations exist in a stunning 93% of their respondents. Chris Vickery of Upguard.com is well-known for these sorts of discoveries. Its blog features [a long list of them](https://www.upguard.com/breaches) stretching into the past. In one such example, an education software company exposed millions of student loan application files in 2021 from a public Google Cloud storage bucket. A more recent example happened in May 2022, when a [misconfigured storage container on Azure was found to be Microsoft’s own responsibility](https://www.csoonline.com/article/3617456/microsoft-azure-blob-leak-a-lesson-to-cisos-about-cloud-security-responsibility.html). The author called this “a self-inflicted wound” that exposed 63 GB of third-party data.

Finally, there are risks from various **software vulnerabilities**. Example include taking advantage of outdated or unpatched code, using poor access controls or passwords, and other operational IT aspects.

These methods can be, and are, combined in interesting ways in specific attacks.

## Common web application attacks

The [Open Web Application Security Project tracks the top ten exploits](https://owasp.org/www-project-top-ten/) and chronicles a broad consensus among application developers on the most critical security risks. It uses this as a reference to help eliminate these problems. The current list places **broken access controls** at the top of the list. One reason why it tops the list is because almost everyone has an application with faulty controls. They also appear more frequently than any other exploit in the [Mitre Common Weakness Enumeration data set](https://cwe.mitre.org/), an industry-wide collection of exploits. An example of this could be a server that has a simple or otherwise vulnerable administrative password, or an open storage container.

Another popular exploit method is [**SQL and other injection attacks**](/docs/guides/sql-injection-attack/). These are not new. The first mention of this attack was [back in 1998 in Phrack magazine](http://phrack.org/issues/54/8.html). The reason why injections remain popular is because it is relatively easy to fool a database server into thinking it is receiving a trusted query. This can lead towards eventual control over a web server and further data stealing. You don't need any specialized tools other than a web browser, and you don't need any specialized skills either. All a hacker has to do is use Google to search for the command sequence. It also doesn't take much time to launch an attack, and the payoffs can be huge. If successful, an intruder can easily obtain a copy of your most sensitive data in a few minutes.

**DDoS attacks** also continue to be popular. Much due of the proliferation of various hacking tools that can quickly set them up for less than $100 a month in many cases. The attacks are designed to flood your servers with random traffic so they can’t respond to legitimate user queries. The [A10 Networks DDoS Threat Report for 2022](https://www.a10networks.com/wp-content/uploads/A10-EB-2022-DDoS-Threat-Report.pdf) reports that more than 15 million unique DDoS weapons were discovered during 2021. That's a huge increase from before the pandemic began.

Finally, we mentioned a collection of attacks that are called [**malicious redirects**](https://blog.sucuri.net/2017/08/expired-domain-wordpress-plugin-redirects.html). This typically happens by injecting some code on a web page with the goal of redirecting browsers to a site under a hacker’s control. This latter site contains phishing malware or advertising that captures private user data, such as account passwords. More benignly, it just generates the ad click-through that is paid to the attacker’s account. The hacker gains access to various configuration files, such as .htaccess or .in, or makes modifications to the DNS settings.

## How to Secure Web Applications

Creating a secure web server and its associated applications is not a single or simple process, and involves a sequence of steps. None of these steps are particularly new or innovative, but they require a careful focus and a certain amount of rigor. Selecting the appropriate set of tools to perform the particular tasks involved is also key.

First, **properly segment your networks** among production or public-facing, development, and testing environments. Each should be logically isolated from the others to minimize potential exploits and network traversals from a breach. This includes segmenting your cloud servers with tools such as a VPC or VLAN. Part of this segmentation process involves deploying [web application firewalls](https://www.g2.com/categories/web-application-firewall-waf). Like network firewalls, they filter out and provide the logical separation of traffic. They are also a good first line of defense by preventing malicious traffic from reaching your web servers. However, they do have their differences. Web application firewalls don’t duplicate ordinary network firewalls. Network-based tools typically allow all web traffic on ports 80 and 443, and don't inspect this content for malware or other malicious intent. Web application firewalls are also essential if you are using your web server to conduct an online business or store private customer data.

Next, **understand the various roles and access permissions** for your users and adopt a "least privilege" strategy to limit this access. Avoid granting administrative access to non-administrative users. Call this "promiscuous provisioning". Twitter (according to its former security manager [Mudge’s testimony](https://www.judiciary.senate.gov/imo/media/doc/Testimony%20-%20Zatko%20-%202022-09-13.pdf) was a big counterexample in this department. At one point, half of its developers had administrator access to its complete code base. Companies need to reduce these over-privileged accounts to make themselves a less enticing target and improve their breach response times. Tools like privilege access managers from vendors such as Sailpoint, BeyondTrust, CyberArk, and Delinea/Thycotic can help. They are used to spot and lock down unauthorized users and how this authorization is granted. Another example of managing access rights has to do with how to handle “offboarding” employees, or when people leave the company.

Many IT managers readily admit that their [**Active Directories are outdated**](https://learn.microsoft.com/en-us/services-hub/health/remediation-steps-ad/regularly-check-for-and-remove-inactive-user-accounts-in-active-directory). Microsoft reports that 10% of accounts are inactive or don’t have sufficient resources, even for those presently employed by their companies. Again, not a new problem, and not exclusive to the web domain. However, this issue is made even more complicated when cloud resources and the complexities of web applications infrastructure are included. One additional complexity is inappropriate remote access permissions that have been granted to highly privileged accounts. Use the management tools cited above to ensure these users have been eliminated. The users who require such access should be secured with additional and strong password factors.

Next, **log all access events** and be able to highlight and then investigate unsuccessful attempts. Review your logs periodically. Don’t fall into the trap described in [Don Bowman's blog post, which shows how some attacks happen thanks to poor logging practice](https://blog.donbowman.ca/2018/09/17/they-got-in-via-the-logging-remote-exploits-and-ddos-using-the-security-logs/). There are a number of [log analyzers for Apache web servers](https://www.dnsstuff.com/apache-log-analyzer-tools), for example, that help you filter this data into more actionable intelligence.

**[**Minimize unused or unneeded services**](/docs/guides/remove-unused-network-facing-services/), plug-ins and other ancillary pieces of software** from your production servers. The unneeded plug-ins advice is particularly relevant to WordPress installations. Close down all unused ports and understand the purpose by which remaining IP ports are open. Read this [warning by the FBI about a 2017 breach](https://www.networkworld.com/article/3185873/fbi-warns-of-attacks-on-anonymous-ftp-servers.html) using FTP. This not only improves security but also increases overall server performance.

**Validate your inputs and strings** sent between your web and database servers, such as testing for range limits. Carefully scrutinize any inputs coming from web sources. This is typically done as part of the development environment that [you use to check your application code](/docs/guides/app-security-testing-tools/).

**Have a [comprehensive program to manage all of your secrets](/docs/guides/how-to-setup-and-use-a-vault-server/)**. Do not store your encryption keys, administrator passwords, and [API keys](https://www.csoonline.com/article/3527858/apis-are-becoming-a-major-target-for-credential-stuffing-attacks.html) in a local text file or on a Post-It note. You want to protect these pieces of data and share them with the fewest possible number of authorized developers. Services such as [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), [AWS Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), [Azure Key Vault](https://azure.microsoft.com/en-us/services/key-vault/), and [Hashicorp Vault](https://www.vaultproject.io/) are some examples of robust and scalable secrets management tools.

Finally, **protect your DNS infrastructure**. This is important, and a basic internet building block. As part of this process, you are protecting all of your internet applications, not just the web-related ones. To do this properly, assess where your DNS bottlenecks lie and where internet-sourced traffic comes from. There are a number of tools that help in this analysis, such as [these free or inexpensive tools and online services](https://geekflare.com/dns-cdn-performance-comparison/). For example, DNSPerf shows you various metrics over the last month. This data is assembled by testing each provider every minute from 200 locations around the world. There are several ways to harden your DNS, such as using a public DNS provider that supports DNS security extensions. These providers have memorable DNS configurations, including Cloudflare (1.1.1.1), Google (8.8.8.8), and Quad 9 (9.9.9.9.). The cloud providers also have specific DNS service offerings: [Google has its Cloud DNS](https://cloud.google.com/dns/docs), Amazon has [AWS Route 53](https://aws.amazon.com/route53/?nc2=h_m1), and Microsoft has [Azure DNS](https://azure.microsoft.com/en-us/services/dns/).

## Security in Web Applications: Best Practices

Here are several suggestions to implement best web applications security practices in your organization:

**Practice strong password hygiene**. Like many digital security initiatives, passwords lie at the heart of any best practice effort for web security. Passwords that are easily guessed and shared multiple times across different login accounts are a hacker’s best friend, and cause numerous data breaches. A survey by [Orca Security](https://orca.security/public-cloud-security-risks-research/) reports that a quarter of its respondents failed to use multi-factor authentication (MFA) to protect their administrative accounts. This should be standard operating procedure. Especially for developers, server administrators, and others who are especially valuable targets for hackers to gain entry to your applications. The strongest form of password protection is to employ FIDO2 or WebAuthn-based tokens as your MFA method. The US government calls these the “gold standard” in a [recent fact sheet](https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf). There is WebAuthn support in all of the major browsers, operating systems, and smartphones. WebAuthn authenticators can be separate hardware-based tokens that connect to a device via USB, NFC, or hardware directly embedded into end-user devices.

**Practice a careful backup and restore routine**, and periodically test your backups to ensure they have been done properly and completely. Automate this task to eliminate potential human error. The backups need to include all elements that contribute to your web infrastructure, including databases and other application servers.

**Create a patch management culture**. Keep up-to-date software on patches and versions, as many hackers count on exploiting older versions.

**Know your software supply chain**. As developers use more open source tools, they have lengthened their software supply chains. As a consequence, they need a better understanding of the various trust relationships involved. They also need to better protect the complete path that software takes through their entire development process and lifecycle. Recently, the Log4j series of attacks took advantage of a lack of insight into these supply chains to distribute malware to thousands of computers. Regularly check your own domain using one of the popular discovery tools, such as [Shodan.io](https://shodan.io) or [BinaryEdge.io](https://binaryedge.io). Routinely use one of the many [chain security tools mentioned here](https://www.softwaretestinghelp.com/best-software-supply-chain-security-solutions/), such as Chainalysis and Cybeats.

**Consider open source security tools**. There are a variety of time-tested, open source tools available that help boost your web server security, including:

-   [**Snort**](https://www.snort.org/) for network intrusion detection
-   [**OpenVAS**](https://www.openvas.org/) for vulnerability scanning
-   [**Metasploit**](https://www.metasploit.com/) for penetration testing
-   [**SQLmap**](https://sqlmap.org/) for detecting injection flaws
-   [**Nagios**](https://www.nagios.org/) for analyzing web server logs

Finally, use the [**most current encryption standards**](https://www.getastra.com/blog/security-audit/web-server-security/). According to the Astra blog: “Always use TLS v1.2 and AES ciphers to encrypt communication with web servers. Enable HTTPS protocol (SSL/TLS) to encrypt the information of the users that they send to your website and make sure that the certificate you use is valid.”

## Conclusion

Securing your web servers and web applications is a journey. It involves visiting many different parts of your digital infrastructure to ensure that hackers cannot access your networks and steal your data. There are numerous tools that cover these parts. Understanding how the tools fit together to provide a total security protection envelope is key. It can take some time and effort to get everything right and eliminate all the potential risks.
