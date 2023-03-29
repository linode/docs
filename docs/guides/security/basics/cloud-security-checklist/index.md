---
slug: cloud-security-checklist
description: 'Searching for a cloud security checklist? We have the essential cloud security checklist that will ensure you’re following best practices.'
keywords: ['it security checklist best practices','it security best practices checklist','cloud assessment checklist']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-03-04
modified_by:
  name: Linode
title: "An Essential Cloud Security Checklist (Plus Best Practices)"
title_meta: "Cloud Security Best Practices Checklist"
authors: ["Andy Patrizio"]
---

Cloud security is complex. Some people have admirable recall, but things are bound to be forgotten. A best practices security checklist for cloud security serves as a reminder of every important step and task. Cloud security requirements can cover hardware, software, configurations, physical location of data, and regulatory compliance.

## What Makes for a Good Cloud Security Checklist?

A proper cloud security assessment checklist helps you understand the stakes for your company. It delineates the risks, protects your company’s data, and establishes appropriate security response measures.

A good cloud security best practices checklist is one that multiple people, from the IT worker to the CISO, can follow, understand, and use to determine if security requirements are being met.

Connecting to the cloud means opening your security firewall to the outside world and all of its bad actors so cloud security must be a tier one priority.

## Cloud Security Assessment Checklist

A cloud security assessment checklist covers every area of your network and business. It involves input from the entire security team and often department heads: not just one or two people. It must cover technology and business angles equally. There are many ways to create this checklist, however the fundamental criteria are much the same, although some may vary depending on your business.

### Establish a Shared Responsibility Agreement With Your Provider

Security requires shared responsibility between the customer and its cloud services provider (CSP). Each has responsibilities to establish and delineate up front.

Delegating responsibility means different teams within the organization are responsible for cloud security. These teams: the apps security team, the network team, the security and infrastructure team(s), and compliance team, all have a say in security.

In a private cloud setting, the organization bears responsibility for everything, since the private cloud is hosted in the organization’s own data center(s). In public clouds, the CSP owns the infrastructure, physical network, and hypervisor. The customer owns the workload OS, apps, virtual network, access to their tenant environment/account, and the data.

When organizations transition from private clouds to public clouds or a hybrid mix, they rely on their CSP to the infrastructure, while security of its data remains with the organization.

### Establish Cloud Policies

Responsibility for a secure hybrid cloud environment falls on both the cloud provider and the customer, but according to Gartner research, customers are not stepping to that plate. In 2019 it stated that, “through 2025, 99% of cloud security failures will be the customer’s fault.” Even more alarming, Gartner forecasts, “through 2025, 90% of the organizations that fail to control public cloud use will inappropriately share sensitive data.”

Companies also have to contend with shadow IT. Shadow IT is defined as unsanctioned and unrecognized public cloud use, and creates unnecessary risk exposure. For example, employees putting sensitive data in a Dropbox account.

The first thing CIOs/CSOs/CISOs must do is establish rules. Employees can’t abide by rules they don’t know or that don’t exist. Sit down with all stakeholders and establish them. All members must agree on the importance of cloud computing on par with on-premises IT, and that cloud computing is to be governed through planning and policy, not on spur-of-the-moment need.

### Understand Cloud Risks

There is inherent risk in opening your firewall to the outside world and the risk must be evaluated. This is especially true if you are in a highly regulated industry like finance or health care. Part of any cloud risk assessment checklist includes regulatory compliance.

### Protect Your Data in Your Cloud Environment

Once you have defined your acceptable levels of risk, strategically apply protections to your cloud services based on them. Good CSPs offer assistance setting up those security measures. Many cloud protections are similar to good on-premise practices you already have in place.

### Get a Grip on Access Management

Controlling identity and access management is as vital in securing your cloud environment as your on-premises environment. Perhaps more so because data is outside of your firewall. Consider how you want to identify and authenticate users, decide who has permissions to assign and remove access rights, and control who can move data.

### Identify Application Risks

Misconfigurations are the most common reason for breaches, but not the only one. A 2020 [report from Verizon](https://www.verizon.com/business/resources/reports/2020-data-breach-investigations-report.pdf) found 43% of all data breaches are the result of a web application vulnerability. This rate more than doubled over the previous year. Operating systems and web browsers are the most common sources of leaks and vulnerabilities but not the only ones.

### Have a Comprehensive Data Backup and Recovery Plan

Data can be lost on-premise as well as in the cloud due to a variety of reasons, from hardware failure to malicious actions such as ransomware. A comprehensive backup and restoration plan spanning on-premise to the cloud is an essential part of an organization’s data protection plan to survive and recover from a security event. Create an extensive backup strategy that defines which data must be backed up, how often that data must be backed up, and monitor backup and recovery tasks. Backups can be done on-premise, off-site, or through your CSP. See the [How to Prevent a Ransomware Attack](/docs/guides/ransomware-attack/#how-to-prevent-a-ransomware-attack) section of our guide on preventing ransomware attacks for more information.

### Security Patches and Updates

In a hybrid-cloud model that uses both cloud-based and on-premises servers, it is crucial that the organization update, manage, and secure their end of the cloud. CSPs are on top of the latest security issues but that doesn't mean the customer can abrogate their obligations for security and patch management. Most of the data breaches in the last few years have been exploits of unpatched systems. Hold up your end of the security obligation the same way you secure your on-premise systems.

### Use Comprehensive Logging and Monitoring

Logging is an absolute must for all enterprises, even those not in the cloud. A good log shows you signs of a security compromise or hardware failure, but a great logging system alerts you when a cyberattack happens, or before the hardware fails. It is essential to ensure that your system activity is logged and stored for both real-time and future analysis.

It is difficult to keep an eye on everything due to the ever-expanding number of systems, servers, endpoints, plus IoT devices. Certainly manual analysis is difficult. Cloud computing adds to the complexity due to the massive volume of data points and network traffic.

### Regularly Engage in a Variety of Testing

To maintain your cloud environment, engage in regularly testing both your on-premise and cloud networks. Problems on-premise can manifest in the cloud, so run a variety of tests. These range from stress tests to recovery drills.

## Cloud Security Best Practices Checklist

This part of the checklist is a collection of best practices for each of the checklist items.

### Establish the Shared Responsibility With Your Provider

1. Provide visibility into activity within cloud applications.
1. Provide detailed analytics on usage to offer everything from security to compliance.
1. Offer context-aware policy controls to drive enforcement and remediation if violations occur.
1. Offer real-time threat intelligence on known threats and detection of unknown threats to protect against malware.

### Establish Cloud Policies

1. Make sure all security policies and procedures have been updated to include the cloud.
1. Ensure employees are fully informed of security procedures and policies.
1. Make sure the company has a timely process of informing employees of new or changing policies.
1. Are there adequate security procedures in place for on-boarding employees? If not, establish them.
1. Is there adequate security procedures in place when employees leave or change roles within the company? If not, establish them.
1. Do you have procedures, including penalties, to deal with any security violations? If not, establish them. There are fewer infractions when an employee understands there are penalties.

### Get a Grip on Access Management

In all things, ask and confirm:

1. Who has access to your systems? What can they do to the sensitive data?
1. Have you trained all of your employees on issues of security awareness?
1. Are you using multi-factor authentication for very sensitive data?
1. Is your guest access controlled? Don’t give guests access to sensitive material and ensure the data is protected from them, so they can’t access it.

### Identify Application Risks

1. Digital transformation initiatives means developers are delivering apps faster than ever using Agile and DevOps. When you rush, mistakes are made. The continuous delivery (CD) ideology of Agile gives more opportunity for mistakes.
1. Legacy security testing like line-by-line code scanning and black-box testing cannot scale with increased use. They rely on signature-based engines to identify application vulnerabilities, much like the way antivirus programs work, miss false negatives, and also incur large numbers of false positives.
1. As the interconnectivity between web applications increases, the number of application programming interfaces (APIs) that provide various bridges for data flows between applications grows. This means hundreds and even thousands of APIs are exposed externally to customers and partners. The chances for an API vulnerability go up with each new API added to the mix.

### Have a Comprehensive Data Backup and Recovery Plan

1. Conduct an in-depth review of your cloud provider’s data backup, recovery plans, and procedures. Ensure they have a comprehensive set of services for all circumstances.
1. Backup and recovery plans include multiple physical storage locations, physical access to server facilities, and disaster recovery plans.
1. Follow the 3-2-1 Rule: keep three copies of your data, on two different devices, with one off-site storage solution.
1. Encrypt your backups, since data can be stolen while it is in transit. Encrypted stolen data is useless to the thief.
1. Don’t forget mobile devices. Smartphones and tablets carry an increasing amount of sensitive data, so make sure your CSP includes mobile devices in addition to PCs for backup.

### Security Patches and Updates

1. Assess your cybersecurity with an across the board check and test of all security systems.
1. Run frequent system diagnostics and checks for updates.
1. Use automated patching across all systems: on-premise and cloud.
1. Use a single cloud patch management software tool across all your cloud providers. Good tools are not limited to just a few CSPs.
1. Regularly update your system inventory: from servers to endpoints.
1. Review the patch process and the results. Not every patch is perfect.

### Use Comprehensive Logging and Monitoring

Cloud logging services provide an interface for analysis of all cloud activities and should be used regularly. There are several things to keep in mind:

1. Does your log span both on-premise and the cloud?
1. How long do you keep your logs?
1. Do you record what apps touch sensitive data?
1. Do you log change activities, such as changes in policy, network security, and overall security policies?
1. Do you monitor your system for suspected security breaches?
1. Do you monitor for potential hardware failure?

### Understand Cloud Risks

1. Identify your sensitive data and the implications if it is lost, stolen, or otherwise compromised. There are tools worth using called *[Data Classification Engines](https://www.varonis.com/blog/data-classification/)* that examine data and categorize them based on sensitivity to exposure.
1. Understand how your sensitive data is accessed and shared. Storage isn’t the real issue with data, it’s when the data is in transit and in use that it is most vulnerable. Keep track of who has access to it and where it can go. Evaluate permissions on files and folders in your cloud and access contexts such as user roles, user location, and device type.
1. Get your arms around shadow IT. Make shadow IT policy clearly communicated. Most people don’t ask their IT department before signing up for a cloud storage account or don’t think it’s a big deal. It is.
1. Check configurations for infrastructure as a service (IaaS). Misconfigurations are a common problem and cause of data leaks. Start by checking identity and access management configuration, network configuration, and encryption. Talk to your provider. They have experts in-house to help.

### Protect Your Data and Your Cloud Environment

1. Set rules that control what data can be stored in the cloud. Industry regulation dictates what can go in the cloud and what must stay on-premise.
1. Encrypt sensitive data. Many CSPs offer encryption keys to protect data.
1. Set restrictions on how data is shared and accessed once it enters the cloud. Designate the appropriate people as either viewers with read-only access, or editors able to write data.
1. Don’t allow data access or movement from unknown devices. Require system security authentication before moving, erasing, or downloading.
1. Use two-factor or other additional validation for high-risk data access scenarios.
1. Adjust cloud access policies as new services emerge. CSPs are forever changing, adding, and modifying their services. Stay on top of these changes and adjust your policies accordingly.

### Regularly Engage in a Variety of Testing

1. Perform penetration tests on your cloud security controls to see how well they stand up to a cyberattack. These practices involve you, your provider, or a hired third party attacking your own cloud infrastructure to identify any potential weaknesses or exploits.
1. You can hire testing companies that employ ethical hackers called “red teams,” who simulate bad actor behavior and attempt to compromise your systems.
1. Perform regular tests to ensure a proper backup and successful restoration. You don’t want to discover issues with your backups or CSP recovery agreement after an incident when you need to recover critical data.
1. Do application layer testing to evaluate whether users can access data that they are not supposed to access.
1. Do network layer testing to reveal misconfigurations and vulnerabilities and identify a service or a software version. This can be done using automation tools.
1. Since most networks engage in segmentation to divide their network into isolated subnets, perform a segmentation test to ensure that each network segment is isolated correctly, and the most secure subnets are fully isolated.

## Conclusion

Security is not a fire-and-forget process, it must be ongoing and continuous. The best security policies necessarily address a wide array of security issues and concerns because as you move to the cloud, a whole new list of issues arise. Checklists are necessary to maintain visualization of them all.

The challenges are both technological and human: hardware breaks and people make mistakes. Human challenges are both malice (hackers) and negligence (employees), but do not treat them alike. These lists cover risks from both hackers and workers, as well as the inevitable hardware failure, and provide a checklist of tasks, or best practices, to secure your cloud environment.




