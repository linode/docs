---
slug: security-automation-business
description: 'This guide discusses the security needs of today''s software and DevOps landscape and provides resources to help you learn more about security automation.'
keywords: ['security automation']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-21
modified_by:
  name: Linode
title: "Security Automation for Today’s Modern Business"
tags: ["security"]
authors: ["David Strom"]
---

As developers [release their code more quickly](https://about.gitlab.com/developer-survey/), security threats have become more complex, more difficult to find, and more potent in their potential damage to your networks, your data, and your corporate reputation. Balancing these two megatrends isn’t easy. While developers are making an effort to improve the security of their code earlier in the software life cycle, what one blogger on Twilio [has called “shifting left](https://www.twilio.com/blog/changing-security-tool-requirements-in-the-new-devsecops-world),” there is still plenty of room for improvement.

In this guide, I describe what are some of the motivations needed to better protect your code.

Application security should be a cornerstone of your devops practice, but is often relegated to the back burner, if not ignored completely. The evidence isn’t just anecdotal, but nearly catastrophic: According to Veracode’s State of Software Security report, 76% of the 130,000 applications it tested had at least one security flaw. Many had much more, as their research found a total of 10 million flaws, and 24% of all apps had at least one high severity flaw. Not all of those flaws present a significant security risk, but the sheer number is troubling.

There are several trends that make this already difficult situation all the more dire:

- **Attacks continue to happen with regularity**, because bad actors are getting better at hiding inside networks without being detected. The [SolarWinds compromises happened months](https://www.csoonline.com/article/3613571/the-solarwinds-hack-timeline-who-knew-what-and-when.html) after the initial penetration of their networks, and was covered widely in the news. Other malware campaigns, such as [RotaJakiro that has remained hidden inside numerous Linux-based systems for years](https://www.zdnet.com/article/rotajakiro-a-linux-backdoor-that-has-flown-under-the-radar-for-years/), is also notable.

- **Enterprise apps are constantly being updated, creating protection challenges**. The days when an IT shop would take months to refine requirements and then build and test prototypes are a thing of the past. Now, daily and sometimes hourly builds are commonplace. This means that security tools have to work in this ever-changing world and find issues with code quickly. A delay of several hours is no longer effective. Take the example of a common error whereby a piece of code accepts unverified inputs. This can lead towards an [attack type called SQL injection](https://portswigger.net/web-security/sql-injection), something that has been around for decades, and which could lead to data leaks or account takeovers or lost revenues. Some of the common attack methods are discussed in the [Eight Common Types of Cyber Attacks and How to Prevent Them](/docs/guides/types-of-cyber-attacks/) guide.

- **Hacking tools are now commodities**. Almost anyone can download an attack tool from numerous online sources and target your business network with just a few clicks of the mouse. Gartner, in its [report on the app security hype cycle](https://www.gartner.com/doc/3884178/hype-cycle-application-security-) said that IT managers “need to go beyond identifying common application development security errors and protecting against common attack techniques.”

- **Protection tools need to be easier and better integrated with engineering processes**. “Tools integration is no longer a luxury. Making security a priority at every phase of development requires watching for incidents, changes, and new vulnerabilities in real time,” according to [Twilio](https://www.twilio.com/blog/changing-security-tool-requirements-in-the-new-devsecops-world). As part of this integration, tools should have application interfaces that enable automation and extensibility. [According the GitLab survey](https://www.twilio.com/blog/changing-security-tool-requirements-in-the-new-devsecops-world), more than 70% of the respondents said their teams have shifted left. But the previous year’s results was 65%, so there are still plenty of rooms for developers to make security a priority at every phase of development.

## Challenges to Enterprise Software Developers

Part of the problem is that developers have to take many things into consideration to secure their apps. They first have to keep up with the evolving security and application development tools market, but that is just the entry point.

They also have to anticipate their business needs as more enterprises dive deeper into digital products. Similarly, their application portfolio needs evolve to more complex infrastructure. They also have to understand how SaaS services are constructed and secured. This has been an issue, as a [recent survey of 500 IT managers has found the average level of software design knowledge has been lacking](https://globenewswire.com/news-release/2018/10/02/1588607/0/en/Survey-CIOs-Struggle-to-Understand-Legacy-Architecture-Reduce-Software-Maintenance-and-Fix-Costs.html). The report states, “CIOs may find themselves in the hot seat with senior leadership as they are held accountable for reducing complexity, staying on budget and how quickly they are modernizing to keep up with business demands.”

Next, protecting your apps isn’t just about being more vigilant during the build process. You also need to examine your apps after they have been deployed to ensure they haven’t been tampered with by a bad actor. (This is one of the methods that SolarWinds was compromised with through its supply chain.)
Finally, the responsibility for application security could be spread across several different teams inside and outside your devops groups: The network folks could be responsible for running the web app firewalls and other network-centric tools, the desktop folks could be responsible for running endpoint-oriented tests, and various application-specific groups could have other concerns. This makes it hard to suggest one tool that fits everyone’s needs, which is why the market has become so fragmented.

## The Answer is Automation

There is a simple solution to this problem: the faster and sooner in the software development process that you find and fix these flaws, the safer your enterprise is. Everyone makes coding mistakes – but if you find and fix them quickly, you limit your potential exposure.

Automated detection makes sense, particularly as attackers get better at hiding in plain sight.

There are numerous application security tools that integrate into your application development environment that can make the coding process and workflow simpler, more secure, and more effective. These tools are also useful if you are doing compliance audits, since they can save time and expense by catching problems before the auditors find them.  But they are also useful in protecting your application's infrastructure.

In the [Understanding Total App Security](/docs/guides/security-weaknesses-in-web-apps/) guide, you learn about the typical coding mistakes that can lend towards security breaches. In the [final guide of this series](/docs/guides/app-security-testing-tools), you learn about some of the tools that can be used to help automate applications security.


