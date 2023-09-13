---
slug: app-security-testing-tools
description: 'This guide provides an overview of different types of security testing tools with links to various application testing and shielding products. The testing tools discussed in this guide are use for static code security, dynamic code security, and mobile testing.'
og_description:  'This guide provides an overview of different types of security testing tools with links to various application testing and shielding products. The testing tools discussed in this guide are use for static code security, dynamic code security, and mobile testing.'
keywords: ['application security test tools']
tags: ['security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-21
modified_by:
  name: Linode
title: "An Overview of App Security Testing Tools"
title_meta: "Getting Started with App Security Testing Tools "
authors: ["David Strom"]
---

Application security testing products come in two basic groups and you need more than one. The umbrella groups: testing and shielding. The former run various automated and manual tests on your code to identify security weaknesses. The application shielding products are used to harden your apps to make attacks more difficult to implement. These products go beyond the testing process and are used to be more proactive in your protection and flag bad spots as you write the code within your development environment.

The two previous guides in this series explained [why automation is useful for application developers](/docs/guides/security-automation-business) and what are two common app security problems that can lead towards security issues. This guide delves into the differences between the tools and reviews and recommends a series of application security testing products.

The testing tools fall into three different categories:

- Static code security tests analyze code at fixed points during development. This helps developers check their code as they are writing it to ensure that security issues are not being introduced during development. A typical product is [Perforce’s Klocwork](https://www.perforce.com/products/klocwork).

- Dynamic code security tests analyze running code and simulate attacks on production systems. These include tools such as [CA/Veracode App Security platform](https://www.veracode.com/products) and [Checkmarx](https://www.checkmarx.com/) that combine both static and dynamic testing methods.

- Mobile testing products focus exclusively on these devices and how attackers can leverage mobile operating systems and other running apps that are typically found on phones and tablets. A typical product is [MicroFocus’ Fortify](https://www.microfocus.com/en-us/cyberres/application-security/fortify-on-demand).

The shielding products fall into four different types:

- Runtime application self-protection (RASP): These tools are considered a combination of testing and shielding. They provide a measure of protection against possible reverse-engineering attacks. RASP tools are continuously monitoring the behavior of the app. This is useful particularly in mobile environments when apps can be rewritten, run on a rooted phone or have privilege abuse to turn them into doing nefarious things. RASP tools send alerts, terminate errant processes, or terminate the app itself if found compromised. RASP will likely become the default on many mobile development environments and built-in as part of other mobile app protection tools. Typical products include [Imperva’s RASP](https://www.imperva.com/products/runtime-application-self-protection-rasp/) and [OneSpan’s Mobile App Shielding](https://www.onespan.com/products/application-shielding).

- Code obfuscation, encryption and anti-tampering tools: Hackers often use obfuscation methods to hide their malware, and now tools allow developers to do this to protect their code from being attacked. One example is [Morphisec’s Moving Target](https://www.morphisec.com/) which is used to keep the malicious actors from gaining insights into your code.

- Chaos engineering tools: This is an interesting area whereby developers look for potential points of failure across their applications and network infrastructure and continuously perform tests. Tools such as [WebGoat](https://owasp.org/www-project-webgoat/), [AttackIQ’s Security Optimization Platform](https://attackiq.com/), and [Netflix’s Chaos Monkey](https://netflix.github.io/chaosmonkey/) are examples.

- Threat detection/investigation tools: These tools examine the environment or network where your apps are running and make an assessment about potential threats and misused trust relationships. Some tools can provide device “fingerprints” to determine whether a mobile phone has been rooted or otherwise compromised. These tools usually cover several areas and include [Digital.AI’s Application Protection](https://digital.ai/application-protection) suite and [PortSwagger’s Burp Suite](https://portswigger.net/burp).

Both kinds of products can be delivered via some on-premise software or a SaaS-based subscription service online, and in some cases come in both forms. Some tools are limited to just a few programming languages (such as Java or .Net), while others are designed to be used with specific integrated development environments as plug-ins or extensions to make tests easier to perform.

## Recommended Research and Evaluation Sources

There are a lot of products to choose from. If you are new to the security field and want to look at a few trusted sources, start with the links below:

- [IT Central Station list of security application testing tools](https://www.itcentralstation.com/categories/application-security-testing). This resource is based on its large community of IT professionals who personally use and rate the various products.

- [Gartner’s Market Guide for Application Shielding](https://www.gartner.com/reviews/market/application-shielding)

- [Gartner’s Magic Quadrant for Application Security Testing](https://www.gartner.com/doc/3984345) (March 2020). Checkmarx, Veracode and MicroFocus were all chosen as market leaders in this report.

[Developers and security professionals are overlapping more](https://www.cybersecuritydive.com/news/developer-security-gitlab-devsecops/599599/), as the linked article discusses. More than a third of developers and security professionals are crossing previous lines, according to surveys cited in the article. Clearly, the time has come to learn some new skills and balance both roles accordingly.