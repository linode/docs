---
slug: data-loss-prevention-best-practices
description: 'What is a data loss prevention (DLP)? This guide explains what it is and why a DLP policy is important for businesses. Learn how to develop a DLP strategy with this guide.'
keywords: ['dlp policy','data loss prevention policy','dlp controls']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-11
modified_by:
  name: Linode
title: "Data Loss Prevention Best Practices: An In-Depth Guide"
title_meta: "Data Loss Prevention Best Practices (with Examples)"
authors: ["Andy Patrizio"]
---

An organization's data is everything because it gives market and customer insight. Data tells you where the market is going, where your customers are going, and where your company is going.

It is important that you protect your data as readily as you protect the perimeter of your office building. Data needs to be protected from outright loss, an ages-old problem, system failure, or theft, a newer threat.

An organization needs a set of policies that defines how data is to be protected and safely shared. These policies are known as data loss prevention (DLP) policies. Data loss prevention (DLP) is a set of software tools and business processes that support DLP policies.

## What is a Data Loss Prevention (DLP) Policy?

DLP policies protect data in use, in motion, and at rest. They govern both the safety of data and the integrity of data, plus they ensure that the right people have access to the right data. They also provide reporting functions to meet compliance and auditing requirements, and identify areas of weakness and anomalies for forensics and [incident response](https://digitalguardian.com/blog/keep-calm-and-be-prepared-building-effective-incident-response-plan-infographic).

The “loss” in data loss prevention has multiple definitions. Loss may mean completely lost, erased, due to a catastrophic system failure and no available backups. It might mean data is lost to theft by hackers or insiders. In the case of the latter, you still have the data, but so does someone else who is not authorized to possess it.

Data leaks fall under the greater umbrella of data loss, because a leak is a loss. They occur with, or without intent. A leak occurs when employees access sensitive data in public, such as over public Wi-Fi, or fail to restrict access by not using a VPN. Here there is no malice, only negligence.

But there is also theft, and this often results in the greatest amount of damage: both to your reputation and financially. The culprit may be a malicious insider, or an outside attacker who has compromised the network or gained access to a privileged user account.

DLP policies are also driven by regulatory compliance, such as HIPAA, PCI-DSS, and GDPR, among others. In case of violation, DLP policies enforce remediation with alerts, [encryption](https://digitalguardian.com/blog/what-data-encryption), and other protective actions to minimize exposure and risk.

## Why is a DLP Policy Important for Businesses and Organizations?

Here’s one reason: There were more than [3,800 breaches](https://pages.riskbasedsecurity.com/2019-midyear-data-breach-quickview-report) in the first half of 2019 alone. Often it is regulated data such as financial information that is compromised, and federal regulators take a dim view of these types of data losses.

Perhaps the biggest breach of all was Equifax. In 2017, Equifax lost the personal and financial information of nearly 150 million people due to an unpatched piece of software. In 2019, the credit agency agreed to pay $575 million in a settlement with the Federal Trade Commission and other entities, one of the largest penalties ever for a data leak.

There is also damage to your reputation, which is harder to quantify in a dollar figure. In 2015, the UK telecommunications firm TalkTalk disclosed that the personal details of over 150,000 customers had been stolen. As a result, the company lost over 100,000 customers, and over a third of its company value.

Then there is actual data loss. Backup and recovery specialist Lost Data [estimates](https://lostdata.com.sa/en/2021/06/07/the-most-common-reasons-for-data-loss/) that 42% of all data losses occur due to hardware failure. Another backup and recovery specialist, UniTrends, [says that 40% of users lose data](https://www.unitrends.com/blog/dont-let-hardware-failures-cripple-business) due to hardware and system malfunctions. Most ominous: it notes 93% of businesses that experienced data center outages for 10 days or more filed for bankruptcy within a year.

## Developing a Data Loss Prevention Strategy

When you suffer a data loss from a database or hardware failure, you know it instantly. In the cases of data leaks, however, all too often the company has no idea that it suffered a leak, where the data went, or who took it until well after the fact. And not surprisingly, there was no data loss prevention strategy in place within the organization.

The steps below cover loss from equipment or software failure, and loss via leak. There is overlap between the two, so many of the steps are common to both types of loss.

### Define and Prioritize Sensitive Data and Locations

The most important thing in a DLP strategy is to identify and prioritize the data to protect, because if an organization simply puts DLP processes across the whole organization, then it is wasting considerable resources on data that is not sensitive, therefore does not need protection. You also run the risk of false positives because so much data is being covered.

Know and understand the organization’s business model. Knowledge of where the most critical data is stored and how it is accessed is key to the success of a DLP strategy.

Not all data is equally critical or sensitive. Identify and sort all data in descending order of sensitivity and criticality. Map sensitive data across the whole organization, where it is located both on premises and in the cloud, and across the three channels: in-transit, in-store, and in-use.

### Identify the Business Owners of Data

Identify who owns what data, so when that data is potentially compromised or lost, the business owner can be informed and take appropriate actions.

### Define DLP Policies

Once sensitive data is identified, build appropriate policies to protect the data. Every policy must consist of some rules: such as encryption or restriction of access. Start by defining your control objectives, and how they apply across each respective workload. Then implement policy in test mode to see the impact of the controls on the data and on the users. Monitor outcomes and fine-tune the policy as you go along.

### Define Workflow and Incident Handling

Anticipate workarounds to limits. In other words, if email rules prevent large files from being attached, are employees going to find other ways to transfer files? Examine workflows to make sure data loss prevention policies do not get in the way of employees legitimately doing their jobs.

### Have a Clear Backup Strategy

Develop a clear strategy of conducting regular backups, and defining what gets backed up and when. Clearly delineate between what should be backed up daily, weekly, and monthly.

Don’t spend time backing up data that is non-critical. It tacks on gigabytes or even terabytes of data to your backups, making the backup and restore process take longer than is necessary. Not to mention taking up more space than is necessary.

Also, do not do backups in the same physical location as the data stores. Backup to a separate physical location, or better yet the cloud.

### Match the Software to Your Policies

Gartner lists [20 DLP software vendors](https://www.gartner.com/reviews/market/enterprise-data-loss-prevention) and there are undoubtedly more. Some of them are general-purpose, others are specific to industries. Take time to compare them and find which ones best align with your policies.

### Bring in the Experts

While your IT staff may be talented and capable, data loss prevention is a deep heart. You can do it on a shallow level or you can really go into depth. IT staff may not have the knowledge to go into depth. Major consultancies like Accenture and IBM offer such programs, as do most of the major DLP software providers. You can also find assistance from your cloud services provider. Make a list of questions to ask each candidate so you can compare objectively.

## Data Loss Prevention Policy Template

1. Define and prioritize sensitive data types and locations.
1. Identify the business owners of data
1. Define DLP Policies
1. Define Workflow and Incident Handling
1. Have a clear backup strategy
1. Match the software to your policies
1. Bring in the experts

## Data Loss Prevention: Best Practices

### Monitor All Data Movement

All data movement, within and in and out of the network, must be continually monitored. To properly monitor all data movement, pay attention to how critical data is used to identify unusual behavior.

Unusual data movement is not just a sign of potential theft. It could mean imminent hardware failure. For example, if data movement from a storage array drops precipitously, that could mean that the hardware is failing and needs to be investigated.

### Employ Firm Patch Policies

While the security industry has focused recently on zero day vulnerabilities, data breaches are often the results of vulnerabilities that have been known and fixed for months, if not years. And hardware makers regularly issue firmware updates designed to address system flaws that lead to hardware failure.

So it is imperative that you keep everything up to date: the firmware in your hardware, the operating system(s), and the applications. Many of these fixes are rolled out automatically, which leads to our next step.

### Use Automation Wherever Possible

The more automation you can add to the distribution of DLP processes, the more broadly you’ll be able to deploy them across your enterprise. That covers patching as well as the application of policies and other security measures. Manual DLP is feasible for a small to midsize business, where the computing environment is restricted to a small room. For an enterprise with multiple data centers across multiple physical locations, doing things by hand is not practical.

### Involve Leadership

Management involvement is crucial to the success of a DLP program. You need the support of top management not only financially, but strategically. This is not usually a hard sell. If anyone recognizes data’s value, the importance of securing it, and the potential impact of its loss, it is management.

### Educate the Workforce

All too often, employees are the weak link in data loss prevention. Malware typically finds its way into corporate networks because an employee clicked on an attachment to an email from an unknown source. There are also cases of malicious intent, such as absconding with trade secrets to take to a new employer.

In the case of the former, education is key. Don’t assume people are mind readers, or as sophisticated as the IT staff. Teach them best practices, whether it’s not opening mail from unknown sources or how to properly use public Wi-Fi while out of the office.

### Use Metrics Regularly

Measuring DLP success is done over time, with repeated tests, to develop trends and look for patterns. Using metrics, including the number of incidents and percentage of false positives, show how efficient your policies are.

### Continuously Monitor and Refine Policies

Data loss prevention policies are not fire and forget; they must be constantly monitored, refined, and updated. Policy changes must be communicated to employees. As long as you have data, the task of protecting it and preventing its loss is ongoing. Your DLP strategy evolves with your business. If your business changes, so does your strategy.

## Conclusion

In short: your data is everything. It is what your business is built on, and your second most valuable asset after your employees. It must be guarded as though it were gold. A successful DLP program depends on a well-planned DLP strategy and deployment.

There are several myths surrounding DLP projects: it may get too big, it may slow down my network, it’s too complicated. Some of them are legitimate concerns such as the complexity, but that can be addressed by seeking the advice of a good consultant, one who has experience with these kinds of deployments. You can avoid overwhelming your network by starting small and gradually expanding the breadth and scope of the project. The most successful projects invariably start small.

By understanding the basic principles and components of DLP, you can craft a strategy that leads to a successful program that provides security and governance for your vital data now and for years to come.
