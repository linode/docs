---
slug: information-security-risk-management
description: 'This guide discusses information security risk management and how to develop a plan for effectively managing risk and information security.'
keywords: ['security and risk management','it security risk management','risk management in information technology']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-18
modified_by:
  name: Linode
title: "Build an Information Security Risk Management Program"
title_meta: "A Guide to Risk Management in Information Technology"
authors: ["David Strom"]
---

Understanding and quantifying information security risks lies at the heart of many security issues. If you can’t quantify risks, you can’t address how to protect your data assets, corporate secrets, and employees’ and customers’ privacy and information. Managing these risks and improving security is everyone’s responsibility, not just the province of the IT department. Businesses are moving in this direction in part because of the Covid pandemic, and also because more companies are becoming dependent on digital technologies, thus increasing their potential attack surface. More sophisticated attack methods make the world of security risk management more complex and important to understand.

## What is Information Security Risk Management (ISRM)?

Thanks to Covid challenges, there is a more complicated business environment and a higher collection of risks. Supply chains are more stressed, component transportation is more complex, and new software is needed to manage these changes. Businesses have more complex compliance requirements, which also ups the risk ante, especially if they run afoul of regulations or experience a data breach. Attackers are more clever at penetrating corporate networks with stealthier methods that often go without any detection for weeks or months.

This is the world of Information Security Risk Management (ISRM). The field involves discovering security issues and figuring out how to assess and then fix them to prevent data compromises and loss. This happens by quantifying the value of various digital resources, multiple types of data, and across both cloud and on-premises locations of IT assets. ISRM requires appropriate policies and procedures to mitigate potential threats and reduce an organization’s vulnerability in its business operations. An ISRM plan should identify confidential data, ensure that only authorized users have access to it, and provide controls to ensure its continued integrity.

## Risk Management in Information Technology: Why it Matters

Information security is now the concern of the entire enterprise, and no longer the exclusive domain of the IT department. “It really is the ultimate cross-functional challenge for today’s business,” says Sean Convery, vice president and general manager for the Security Business Unit at risk management vendor ServiceNow. “This means managing risk has gotten more complex than when everything was wholly contained within the IT department. Services are now managed by different parts of the organization, which means that data silos are ending and risks are getting more complex.”

## Developing an ISRM plan

Every effective ISRM plan has several components and must be both comprehensive and effective. At the start, consider who the various stakeholders are and their roles in terms of creating and mitigating risks. This includes the process owners, such as a finance team or the IT department, who own the risk assessment itself. There are also owners of particular risks, such as those that manipulate private or business-confidential data.

### Get Management Buy-In

The top levels of the business, including the board of directors, need to be completely onboard with the plan and the need to have one. Security consultant David Froud suggests a multiple-step procedure to map your business assets to processes as a way to establish a “risk register” that all stakeholders can agree on. “We need to separate risk management from the day-to-day operational job of the CISO.”

Businesses have to learn to tell the story of how risk impacts their operations and why ISRM is essential to their business itself. The way to do this is to think about selling risk reduction in a language everyone understands – what Froud calls the **language of money**. Instead of shaming someone because of a breach, anticipate the business impact of the breach and how you can maintain a better cybersecurity posture and make continual improvements to it.

### Identify Vulnerabilities with Periodic Assessments

The modern business environment is online and continuously updates their software. This means doing regular vulnerability assessments, because the app that they rolled out three hours ago isn’t the same as yesterday’s code. A good starting place is the [NIST cybersecurity framework](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.04162018.pdf) that was developed several years ago. Its authors state that the framework, “focuses on using business drivers to guide cybersecurity activities and considering cybersecurity risks as part of the organization’s risk management processes,” and can serve as a model blueprint for quantifying your risks.

Many times, users don’t necessarily see the risky consequences of their actions – nor should they; that really isn’t part of their job description. Here is an example: Look at this 2019 [Tweet stream from @SwiftOnSecurity](https://twitter.com/SwiftOnSecurity/status/1129932935770103813) about what is going on in one corporation. Their users pick evergreen user ID accounts for their VPN sign-ons. Rather than have unique IDs that match a specific and actual person, they reuse the same account name (and of course, password) and pass it along to the various users that need access. Needlessly risky, right? The users don’t see it in this light. Instead, they do this because of a failure for IT to deliver a timely solution, and one that is convenient and simple.

Part of the challenge is in changing underlying behavior just because it “has always been done this way.” [A 2020 survey](https://www.yubico.com/blog/yubico-releases-2020-state-of-password-and-authentication-security-behaviors-report/) by Yubico found that more than half of those IT managers who have been phished have still not changed their password behavior. Developers aren’t much better: [a recent survey found a third of them](https://www.shiftleft.io/press-news/press/secure-software-summit-findings-shifting-security-left-a-work-in-progress/) still haven’t adopted secure coding practices. If neither of these groups can’t change to improve their own security, who will?

These assessments need to cover the three basic areas of any business: its supply chains (both software and hard goods), its IT assets (both in the cloud and on premises) and any compliance issues as a result of various regulations. Each of these requires periodic surveys of what is considered valuable and essential to your business, how it is protected, and how data can become compromised. Have the security controls you have already put in place been effective, or are they in need of updating or changing because of new potential threats?

### Analyze Data and Calculate Risks

There is a difference between doing risk analysis and assessment. IT has to change its vocabulary to the language of business and stop being the enemy of the convenient. IT also needs to share best practices with risk managers and listen carefully to what users really need. For this step, you need to distinguish between low and higher risks and focus your attention appropriately. For example, your marketing literature on your corporate website might be considered low risk, but specific strategies for how to craft competitive messages might be a higher risk, particularly if this information becomes public as a result of being placed on that public website.

Part of this confusion has to do with the words we choose rather than any actual activity. When an IT person says some practice is risky, oftentimes what our users hear us say is, “No, you can’t do that.” That gets to the heart of the historical IT/user conflict. We must do a better job of moving away from being the “party of no” to understanding what our users want to do and enabling their success. This means if they are suggesting doing something that is inherently risky, we must work with them and guide them to the more secure and less risky promised land.

### Respond to Risks

Next up is figuring out how your organization is going to respond to what you’ve learned. Do you remediate the identified vulnerabilities by patching them to current versions? Or do you try to mitigate the problem and build a firewall rule or upgrade to another more modern system or segment your network to isolate the affected resource? Maybe the consequences of each risky situation isn’t worth the cost to replace the equipment, or you need to push this issue down your priorities stack and take care of more pressing needs.

Part of this process is to put in place a **recovery playbook**. This includes all operational elements necessary for an organization to survive any potential attack or security incident. It serves as a ready reference so that DevOps teams and business stakeholders aren’t scrambling to assemble this information in real time under duress. It should include a variety of incident response plans, and specify the order by which you bring back critical systems from a known and hopefully working state.

### Protect Against Threats and Develop Best Practices

Once your risk profile is identified and you know how to respond to these risks, it is important to put a program in place to protect your organization from future threats and develop some best security practices. [Dragos has one five-step program described here](https://www.dragos.com/year-in-review/#section-vulnerabilities) that includes building a defensible security architecture, monitoring assets, improving remote access authentication, managing key vulnerabilities, and creating a dedicated incident response team.

Here are a few suggestions:

- **Use native multi-factor authentication capabilities** wherever possible to protect email and other logins, especially if you can implement the Fast Identity Alliance (FIDO) protocols to strengthen your authentications.
- As we have said in other guides, make sure **you really understand your backups** and how you can recover your files and servers from any attack or compromise.
- **Avoid being promiscuous with your access privileges**, both for your apps and for your users. Avoid granting administrative access for everyone just because it is convenient. These accounts are targeted by cyber criminals, and by separating roles and permissions properly, you reduce the surface area in which an attacker can cause damage.
- **Use security automation whenever possible**. Human nature is error-prone and automation can help fix common mistakes and close security loopholes. This type of automation is also very useful when your code changes and insecure elements are introduced inadvertently.
- Understand the **changing nature of data privacy and compliance regulations**. As state legislatures introduce new privacy laws (this annotated map from Husch Blackwell documents the proposed changes for example), your business could be at risk.
- Finally, do **share best practices between the IT security and risk management teams**. The more these two teams communicate, the better and more coordinated your response.

## Conclusion

Understanding risk management is an on-going task. It isn’t just a simple project with a beginning and an end.  It requires a wide collection of tools, techniques, policies, and procedures, all of which need to be constantly assessed as your business evolves. Some of these are easier and less costly to implement than others. Identify the critical people and processes involved in creating and mitigating these risks. All of this requires careful attention to the necessary details across the entire organization and the entire network. Linode can help you understand and mitigate these risks.