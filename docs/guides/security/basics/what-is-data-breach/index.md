---
slug: what-is-data-breach
description: 'What is a data breach? And what causes a data breach? We provide the answers you need and explain the importance of data breach security.'
keywords: ['what is data leak','data breach definition','what is data breach']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-25
modified_by:
  name: Linode
title: "What is a Data Breach?"
title_meta: "Data Breach Definition and Protection Protocols"
authors: ["David Chernicoff"]
---

If you follow any form of tech media, you rarely go more than a day or two without hearing about some sort of data breach and its impact on business. Even mainstream media often finds itself reporting on data breaches because of the sometimes spectacular nature of the problem. The term data breach, however, is an exceptionally broad one. In essence, it refers to any action that results in the exposure of information to anyone who isn’t authorized to view or access that data.

From a well-publicized massive data breach that happens to a company like [Target](https://www.nbcnews.com/business/business-news/target-settles-2013-hacked-customer-data-breach-18-5-million-n764031) or [Home Depot](https://www.reuters.com/article/us-home-depot-cyber-settlement/home-depot-reaches-17-5-million-settlement-over-2014-data-breach-idUSKBN2842W5), to a user who leaves their laptop logged in when they walk away from it in a public setting, data breaches, also known as *data leaks*, come in many shapes and sizes. This guide's focus is on the data breaches that are most common in business environments, how to identify them, and how to mitigate and prevent them.

## What Causes a Data Breach?

In a well-protected corporate environment, the most common causes of data breaches are some forms of brute force attacks, malware, and IT errors, such as improperly configured or unpatched operating systems or applications. These are often referred to as zero-day vulnerabilities.

The major threat is social engineering. In fact, a study titled [“The Psychology of Human Error”](https://www.tessian.com/research/the-psychology-of-human-error/) by Stanford University Professor Jeff Hancock and the security firm Tessian found that in nine out of ten data breach incidents reviewed, the cause was human error; both engineered attacks and simple human error.

Phishing is the most common form of attack on your corporate network. Users get lackadaisical about how they handle email, and clicking on the wrong file or attachment easily results in a compromised network. Just because a message looks familiar doesn't mean that it isn’t a carefully crafted attack on your corporate network.

It gets even worse. A technique known as *spear phishing*, often uses publicly available corporate information to craft targeted emails that appear to come from a manager or someone in authority within a business asking for information that they are entitled to have. The email may have a link attached that downloads malicious software, or might be delivering malware in the form of usually benign sources such as spreadsheet or word processor documents. The fact that email spoofing (where the sender appears to be a familiar one) is simple to accomplish, makes these attacks even more compelling.

While it is considered a vector for brute force attacks, despite the on-going efforts of IT, weak passwords remain a significant attack surface for bad actors intent on gaining access to your data. Despite years of commentary on poor password security being trumpeted to IT and users alike, there are still a huge number of users [that select very common passwords that can be easily hacked](https://cybernews.com/security/three-quarters-of-the-most-popular-passwords-can-be-cracked-instantly/).

Keep in mind, these aren’t the actual data breaches; these are the methodologies used to gain access to your corporate computing environment so that the attackers can inject malware, ransomware, and all sorts of nasty spyware that enables them to get value from your data.

## The Importance of Data Breach Security

What happens if you fail to adequately protect your environment from data breaches? In the aforementioned Target and Home Depot cases, millions of customer credit card numbers were exposed, and both companies paid out millions of dollars to settle lawsuits brought against them. But money wasn’t the only thing lost by those big box stores. Reputational damage caused by the publicity surrounding the breaches lasted long past the discovery and eventual resolution of the attack damage. It still lingers on, almost a decade after the events. Equifax, for example, was breached via an unpatched vulnerability on a consumer facing web portal, resulting in the private financial information of over 150 million people being compromised. A few years later it cost Equifax $575 million in fines on top of the $1.4 billion they spent to upgrade their system security.

While credit card information is the most obvious target for malicious attacks, any type of confidential information can be at risk. Do you want a spreadsheet containing salary information loose in the wild? Customer lists and associated spending information? Vendor payment data? These items collectively represent the tip of the iceberg.

Intellectual property theft is often the goal of these attacks. Actual attacks on your business processes, where databases are corrupted and line-of-business applications are shut down or infected and used as vectors to deploy and hide additional malware, present clear targets. The injection of ransomware into your environment is now an ever-present danger.

Some businesses invest in [ransomware insurance](https://www.techtarget.com/searchsecurity/tip/How-to-find-ransomware-cyber-insurance-coverage) or simply set aside a part of their budget to pay off a ransomware attackers. But especially in the SMB space, the costs to do so can be ruinous, so planning to protect your data is a much more cost effective solution. Beyond simply doing all you can to prevent breaches, investing in strong data protection and [backup schemes](/docs/products/storage/backups/) designed to protect your data from threats (including ransomware), is simply a good idea.

Keep in mind these attacks cause additional damage to your business if you are in a highly regulated business such as finance or healthcare. According to [reports made to the federal government](https://www.healthcareitnews.com/news/biggest-healthcare-data-breaches-2021) in 2021, over 40 million patient records were exposed in data breaches, just in this single industry.

Another factor to consider is that data breaches are rarely obvious. A [report from IBM](https://www.ibm.com/account/reg/us-en/signup?formid=urx-46542) in 2020, reveals that the average length of time to identify that a data breach has happened is 228 days. This means that the malicious actor may have had free reign to access your confidential information for over seven months. The same report points out that containing and remediating a data breach takes an average of an additional 80 days. The [Equifax attack](https://www.csoonline.com/article/3444488/equifax-data-breach-faq-what-happened-who-was-affected-what-was-the-impact.html) took 76 days to discover; in that time the attackers pulled terabytes of data from what were supposed to be secure systems.

The longer an attacker has unfettered access, the longer it is going to take you to resolve the consequences of a data breach. Just to add insult to injury, that IBM  report noted that healthcare attacks took an average of 320 days to identify, and another 230 days to remediate.

## Responding to a Data Breach

Despite all your good intentions, a data breach can still happen. What should you do upon discovering a data breach? Don’t panic.

When a data breach is reported to IT, be ready to implement your incident response plan. For most businesses this means [ramping up the incident response team](/docs/guides/information-security-risk-management/#developing-an-isrm-plan), your group of IT personnel who have specific roles focused on quickly shutting down potential problems. The speed of your response may have a major impact on the effects of the breach.

Specific roles and plans to make use of personnel should already be in place. Networking teams should be ready to identify and isolate impacted systems, and data management specialists should be in place to secure company databases and data repositories. IT staff responsible for backup and data protection should be checking that data backups are intact and uncorrupted. Cloud specialists should be in a position to check on the integrity of cloud stored data.

Fixing the problem doesn't happen immediately and that needs to be accepted. Making sure that the breach is contained is the primary task, however. This means that systems need to be quarantined, malware removed, checked for any potential problems, and carefully restored back to an operational state once you can guarantee that any malware or unpatched vulnerabilities have been addressed. Then you can start to restore data or network access to compromised systems.

Concurrently, make sure that you have identified the attack vector. Was it a compromised user account, a brute force attack, an unpatched vulnerability or a successful fishing expedition? Once the source is identified you can adjust your response to make sure that particular security hole is addressed. Remember that phishing and human error make up the majority of attack surfaces for corporate data breaches.

## Data Breach Protection Options

The simplest approach to prevent data breaches is to think security first. What does security first mean?

- Make sure that IT and end users have a security-focused mindset.
- Educate and train your users on the common types of human engineering scams that put their workplace at risk.
- Implement a solid set of security practice standards regarding how data is kept secure.
- Make sure there are secure access controls in place. Implement a multi-factor authentication process beyond simple password access to corporate resources.
- Limit access to secure resources to only those who need access. Simply logging into the corporate net should not expose any resources beyond those necessary for the user to do their job.
- Be proactive in addressing operating system and software patching. Bad actors are aggressive about using publicized security holes so you need to be aggressive about testing and applying software patches as they become available.
- Consider implementing a [zero-trust security model](https://www.hpe.com/us/en/insights/articles/zero-trust-informs-all-enterprise-security-2112.html). In this environment access is via the never trust, always verify process. No user or software action is trusted by default. This is the most ambitious, and difficult approach that can be taken because it requires rethinking the traditional approaches to IT security and security management.

## Conclusion

Unfortunately, there are no simple options to prevent data breaches. Taking all the steps you can to educate your users so they understand they are a critical part of your business security model is an important first step. Making sure that you have secure data backups that are disconnected from your active network to prevent ransomware from corrupting them, solves only that single problem. If you do take this step, regularly test the backup and the restore processes so that there are no surprises when you need this data. Look at every aspect of your business operations and examine each of them for potential security leaks. Understanding your business workflow and how IT touches each part is often the best place to start.

Lastly, it is important for your business to find trusted partners that possess the expertise that your internal IT may lack. Make sure they have a proactive approach to maintaining secure environments, that they keep their partners informed about any potential problems, and that you understand how they are keeping their own environment safe from malicious events.