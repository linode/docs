---
slug: software-security-best-practices
description: 'This guide to software security best practices teaches you about types of application security and how to secure a web application.'
keywords: ['web application security best practices','application security best practices','software development security best practices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-17
modified_by:
  name: Linode
title: "The 14 Top Software Security Best Practices you Need to Implement Today"
title_meta: "Software Security Best Practices"
authors: ["David Strom"]
---

The days where software developers wrote their application code in isolation of any security implications are over. Applications are exploited every minute of the day, thanks to the internet that connects them to any hacker around the planet. Application security doesn't have to be overwhelming: there are dozens if not hundreds of tools to help you improve your security posture, prevent exploits, and reduce configuration errors that let bad actors gain unauthorized access to your network.

## What is Software Security and Why Is It Important?

Application security finds, fixes, and improves the inherent security of all of your applications; both those that you purchase and those that you build yourself. These actions happen mostly during the development process, although they can include various tools and methods that are used after your apps are deployed. They can also include any cloud-based public apps and services that are part of your stack. There are hundreds of tools available in this particular category, including tools that monitor unauthorized code changes, enforce various encryption options, and audit access rights and user permissions.

Application security should be a cornerstone of your devops practice, but is often overlooked. The evidence isn’t just anecdotal, but nearly catastrophic: According to [Veracode’s State of Software Security](https://www.veracode.com/state-of-software-security-report) report, 76% of the 130,000 applications it tested had at least one security flaw. Many had more, as their research found a total of 10 million flaws, and 24% of all apps had at least one high severity flaw. Not all of those flaws present a significant security risk, but the sheer number is troubling.

## Types of Application Security

There are two basic types of application security tools: those that are used for testing various weak spots in your code, through automated and manual tests; and shielding products that are used to harden your apps to prevent potential attacks.

The testing tools fall into three broad categories:

- **Static code security tests**, which analyze code at fixed points during its development. This is useful for developers to check their code as they are writing it to ensure that security issues are being introduced during development. A typical product is [Perforce’s Klocwork](https://www.perforce.com/products/klocwork).

- **Dynamic code security tests**, which analyze running code and simulate attacks on production systems. These also include tools such as [CA/Veracode App Security](https://www.veracode.com/products) platform and [Checkmarx](https://www.checkmarx.com/products/iast-interactive-application-security-testing/) that combine both static and dynamic testing methods.

- **Mobile testing products** that focus exclusively on these devices and how attackers can leverage mobile operating systems and other running apps that are typically found on phones and tablets. A typical product is [MicroFocus’ Fortify](https://www.microfocus.com/en-us/cyberres/application-security/fortify-on-demand).

The shielding products fall into five different types:

- **Runtime application self-protection (RASP)**: These tools could be considered a combination of testing and shielding. They provide a measure of protection against possible reverse-engineering attacks. RASP tools continuously monitor the app behavior, which is useful particularly in mobile environments when apps can be rewritten, run on a rooted phone, or have privilege abuse to turn them into doing nefarious things. RASP tools can send alerts, terminate errant processes, or terminate the app itself if found compromised. RASP is likely to become the default on many mobile development environments and built-in as part of other mobile app protection tools. Typical products include [Imperva’s RASP](https://www.imperva.com/products/runtime-application-self-protection-rasp/?redirect=Prevoty) and [OneSpan’s Mobile App Shielding](https://www.onespan.com/products/application-shielding).

- **Code obfuscation and anti-tampering tools**: Hackers often use obfuscation methods to hide their malware, and now tools allow developers to do this to help protect their code from being attacked. One example is [Morphisec’s Moving Target](https://www.morphisec.com/) which can be used to keep bad actors from gaining insights into your code.

- **General encryption tools**: These can be used to protect sensitive data from being seen by criminals or unintended staffers, especially as data traverses the public internet or if private data is stored on one of your own servers. Examples include [Digicert](https://www.digicert.com/) and [OpenSSL](https://www.openssl.org/).

- **Chaos engineering tools**: This is an interesting area whereby developers look for potential points of failure across their applications and network infrastructure and continuously perform tests. Tools such as [WebGoat](https://owasp.org/www-project-webgoat/), [AttackIQ’s Security Optimization Platform](https://attackiq.com/) and [Netflix’ Chaos Monkey](https://netflix.github.io/chaosmonkey/) are examples.

- **Threat detection/investigation tools**: These tools examine the environment or network where your apps are running and make an assessment about potential threats and misused trust relationships. Some tools can provide device “fingerprints” to determine whether a mobile phone has been rooted or otherwise compromised. These tools usually cover several areas and include [Digital.AI’s Application Protection suite](https://digital.ai/application-protection) and [PortSwigger’s Burp Suite](https://portswigger.net/burp).

## Software Security Best Practices

There are a number of best practices you can employ to access the highest application security possible:

- **Always patch everything** and do so as soon as new patches are available. Hackers pay attention when new vulnerabilities are discovered and can put in place exploits to take advantage of them within hours. To delay is to be at risk.

- **Segment your network appropriately**. Having a single flat network is an invitation to be hacked, since an attacker only needs to find and compromise a single endpoint to enter your network and find vulnerable computers. Separate your different departments and different user collections into their own networks that are protected with firewalls and access control rules.

- Speaking of such rules, **keep track of privileges and access rights** to ensure that everyone and every system has the minimum possible access. This reduces your overall attack surface significantly. Not everyone needs administrative rights to all your applications. Periodically audit these rights to ensure they match the intended user populations.

- **Catalog your software assets** and how they are protected. This exercise isn’t trivial, because it can help you quickly locate a compromised computer and have you block any future unauthorized access.

- **Use encryption often**. Use hashes to store private data, [use HTTPS to encrypt your web traffic](/docs/guides/enabling-https-using-certbot/) everywhere, and choose the strongest possible encryption algorithms whenever possible.

- On a related note, **secure your secrets**. Ensure that your tokens for third-party encryption services are secured properly and managed by the right trusted staffers.

- **Manage your containers** and other cloud storage repositories. Scan them for any vulnerabilities regularly, such as containers that don’t require any authentication whatsoever. There are a number of tools that are available for this purpose including [Docker Content Trust](https://docs.docker.com/engine/security/trust/) and [Bench Security](https://github.com/docker/docker-bench-security).

- **End user training is a journey**, not a destination. Regularly schedule ongoing security training sessions to raise awareness about potential phishing lures and common misconfigured computers.

- **Plan for disasters carefully and conduct regular drills**. Test your playbooks and responses and ensure you have created conditions that stress the failed systems. You can’t anticipate everything, but the more often you examine what went wrong and revise these procedures, the better.

- **Plan for a security incident too**. Perform regular penetration tests that show potential weak spots in your security, physical access controls, and compromises to personal equipment. More employees work from home now and are not using corporate-owned devices so these personal devices need to be secured as well.

- **Use security automation where you can**. Manual methods are subject to error, or forgetful staffers. Better to have automated routines that check for vulnerable resources, areas open to the internet, or containers and online storage repositories without any authentication restrictions. Shift left with your security implementation in your app dev frameworks, meaning always consider security as early as possible during the development process. Do not treat it as an afterthought when the application is nearly written.

- **Validate your inputs**. SQL and other injections happen because developers don’t properly vet all inputs and screen them from attackers. If developers don’t check the origins of all queries, an attacker can take control of your servers, and by entering commands, could collect the data on your server. The validation should check for appropriate length and that it is within expected boundaries and semantic conditions.

- **Make sure your security policies are reflected in your documentation**. When you have to change a policy, track down where you have this documented to match the change.

- **Know your software supply chains** and ensure your sources are genuine and secure. Monitor your source code repositories for any vulnerabilities or recent exploits, and patch them as quickly as possible.

A more complete catalog of these tools can be found in these sources:

- [IT Central Station list of security application testing tools](https://www.itcentralstation.com/categories/application-security-testing). This is based on its large community of IT professionals who personally use and rate the various products.

- [Gartner’s Market Guide for Application Shielding](https://www.gartner.com/en/documents/3880128/market-guide-for-application-shielding).

- [Gartner’s Magic Quadrant for Application Security Testing](https://www.gartner.com/doc/3984345) (March 2020). Checkmarx, Veracode and MicroFocus were all chosen as market leaders in this report.

## Conclusion

To learn more about application security, [check out this guide which discusses two of the more common application exploits](/docs/guides/security-weaknesses-in-web-apps/) that can be prevented by using some of the above tools. You can also refer to this author's [more in depth discussion about the need for application security](/docs/guides/security-weaknesses-in-web-apps/). For more details about best practices in container security, read the [How to Improve Container Security](https://www.csoonline.com/article/3388025/how-to-improve-container-security.html) article.

You can also checkout our [documentation library's security section](/docs/guides/security/) to find guides on installing and using popular open source security tools.
