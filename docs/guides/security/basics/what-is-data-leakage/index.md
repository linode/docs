---
slug: what-is-data-leakage
description: 'Data leakage detection in machine learning involves leaking information results in overestimation of scores. Get examples plus detection and prevention tips.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['what is data leak','dta leakage','data leakage machine learning']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-04
modified_by:
  name: Linode
title: "What is Data Leakage? (Plus Detection and Protection Tips)"
title_meta: "Data Leakage: Definition, Examples, & Protection Tips"
external_resources:
- '[Cybersecurity & Infrastructure Security Agency](https://www.cisa.gov/defining-insider-threats)'
- '[Enterprise Data Loss Prevention (DLP) Reviews and Ratings](https://www.gartner.com/reviews/market/enterprise-data-loss-prevention)'
authors: ["Wayne Rash"]
---

Despite what many may think, a data leak isn’t the result of a cyber-attack. In fact, it’s the opposite. A data leak is the unplanned or unauthorized release of data outside of where it’s supposed to be in an organization. This can mean that payroll data is leaked outside of the accounting department. Or, it can mean that your customer list is exposed to the public through an oversight or due to the intentional actions of a disgruntled employee. In a machine learning environment, a different type of data leakage occurs when data is shared between test and training data sets skewing performance in the test set. Regardless of the source, data leaks cause serious problems for an organization, either because of the security issues or the unreliable performance results.

## What is Data Leakage?

In its most basic form, data leakage happens when data ends up somewhere it’s not supposed to be. In machine learning, data leakage may cause overly optimistic or invalid predictive models. Data leaks can also cause significant data security issues when data that’s supposed to be protected, is instead exposed.

Data leaks of both types are the result of errors made during model creation or during configuration. An example is when data from the test dataset is shared with the training dataset, causing a machine learning model to perform better than it should, because it already knows the data that’s being presented. Then, when working with real data, the performance is worse or may produce inaccurate results.

Configuration errors also allow data to be exposed, either because of an oversight or because dependent systems are improperly configured. This can happen, for example, when personal information is sent to an area of your stack that’s open to public view. In some cases, the obfuscation or anonymization process can be improperly configured so that the data isn’t properly protected.

Because data leaks expose sensitive information, they often lead to significant problems for an organization, even if the leak is unintentional. These leaks are violations of privacy and consumer protection laws in the US, the EU, and elsewhere. They often lead to lawsuits, damage to the organization’s reputation, and a loss of confidence by customers and business partners. They are every bit as damaging as a data breach caused by hackers.

## Types of Data Leakage

Some data leaks are unintentional, and persist for a very long time before they’re discovered. However, some are malicious. Unfortunately, data leakage is very common. Most users don’t know they’re leaking data, and most enterprises don’t realize that they’re leaking data. They only notice after they suffer poor performance in a machine learning application, a cyber attack, or they’re warned by law enforcement. Because such leaks are frequently unintentional and are the result of errors, they are hard to find. Worse, they are frequently harder to fix, because just knowing that a data leak exists isn’t enough. The source of the leak must be located. These data leakage examples provide a starting point.

- **Configuration errors**: Setting up and configuring networked data systems is complex. When you include machine learning, application software, and cloud services, it’s even more complex. Add the process of data configuration and preparation so that machine learning algorithms have access to the data they need, but no extraneous data, and ensuring that protected data isn’t inadvertently being exposed, the complexity grows even more. Fortunately, there are automated tools to handle many of the steps, but those tools also need to be configured. Depending on the specific network, even one misconfigured router can cause a leak.

- **User errors**: The user error you probably hear about most often is the “Reply All” mistake in sending email, but there are plenty of others. A common error is feeding machine learning the wrong data, typically data which is outside the scope for the intended use. It can also include providing data from the test set to the training set. Email errors happen when you intend to communicate with one recipient on a list, but instead hit the wrong button in your email client. Depending on who is on the reply list, you inadvertently send inappropriate information to one of the recipients. But it goes beyond email to include sending documents to the wrong printer, or even having sensitive information on the wall behind you in a Zoom call.

- **Social engineering**: This can be malicious, but doesn't need to be. There are plenty of instances in which a criminal tries to convince an employee to provide information, or access to information, that they shouldn't have. This includes deception, such as pretending to be a staffer in the IT department or claiming to be a co-worker pretending that they’re locked out of the network. These may also be attempts to get login information or phone numbers and names of other employees with access. But sometimes it’s just another employee trying to access information they’re not supposed to know.

- **Carelessness**: When someone copies sensitive information to a USB flash drive and then carries it off-premises that’s a potential leak. When they then leave that USB flash drive lying around somewhere, that’s a data leak. Similar data leaks can happen if they log into the company network from a coffee shop without using encryption, or when they leave their laptop running with the screen open while they go get another latte. When they take their laptop home, and let their family members use it, it’s another data leak, and likely a lot more, including an open invitation for malware.

    A head-shaking example of carelessness was a senior official for the US Department of Justice who was observed traveling through a major international airport for an overseas flight. Pasted to his laptop were the access details, usernames and passwords he would need to use while traveling. They were on the outside of that laptop where they were clearly visible and easily photographed. Equally thoughtless are Post-it Notes with usernames and passwords.

- **Disgruntled employees**: Data theft by disgruntled employees is well-known, as is data theft by employees who are paving their way to another job. Depending on your organization, such data theft can be far more sinister. Nation state actors frequently use blackmail to get governmental organization employees or contractors to provide sensitive or classified information. Of course there are plenty of cases where those employees simply provide the information for money.

- **Software vulnerabilities**: Unfortunately, zero-day vulnerabilities are more common than they should be. Organizations using the software may not have any way to know that the vulnerability exists before it’s too late. This type of data leak may persist for years before anyone notices. When they do, it’s frequently because it appears in the news as a major data breach.

- **Loss or theft of a device**: When an employee leaves their phone in a cab, or has their laptop stolen from their car or home, that’s a potential data leak. Even if the device doesn't contain any sensitive data, it contains the login information for the company network that a criminal can use to access whatever the employee had access to. This can include printers, which in some cases can retain copies of the last few pages printed on an internal hard disk, or other persistent storage.

- **Poor security practices**: Perhaps one of the most egregious causes of data leaks is the use of default passwords. This happens when network equipment such as firewalls, routers or servers, is placed into service, but the default passwords are left in place. These devices are all equipped with passwords that are there for initial use, but which are supposed to be changed before they’re placed into service. Unfortunately, untrained or complacent personnel leave them as they are. The default passwords are well known among cyber criminals who use them to access your systems. A similar problem exists with recycled, reused or poorly chosen login credentials. It’s already a common practice to use email addresses as the username for systems. A poor password, such as “password” or “1234” means that you have no security at all. The same is true if a user uses the same password for everything, because if it’s discovered for one login, criminals attempt to use it everywhere they can.

## Data Leakage Detection

The fact is, data leaks often go undetected, at least until it’s too late and you get a call from law enforcement or a call from a lawyer who is suing your organization for leaking private data. One reason some data leaks last for years is that they’re not obvious.

Data leakage in machine learning shows up differently. Here data leakage is detected when performance is much better than expected during testing because the data has already been seen in the training set. In such cases, performance using real data will be much worse than in testing.

The best approach is to assume that you have data leaks. Move to contain them, while also doing what you can to protect the information from being misused or exploited.

Fortunately, there are tools to detect and prevent data loss. These tools spot data exfiltration when it happens. Those tools often include data loss prevention capabilities along with data detection software, and are available from several vendors. In addition, some types of network monitoring software can detect when data is sent out where and when it shouldn't be. And then there are firewalls.

A properly configured, next generation firewall does more than keep intruders out. It monitors any data leaving the network for the outside world. This type of firewall can be used on any network, but perhaps most importantly, they are offered as a service by cloud vendors. One of the basic setup tasks when implementing your cloud service is to choose a firewall and configure it so that it performs the kind of traffic monitoring you require. The cloud vendor staff can assist in this configuration.

Once it’s configured, the combination of your data loss prevention software and your firewall prevent the exfiltration of unauthorized data. The firewall alerts the IT or security staff that these events are taking place and locate where on the network the data loss is happening. This allows the IT staff to take corrective action.

## Preventing Data Leakage

Firewalls and data loss prevention software are important tools, but they can’t do everything. You still need to take steps to prevent data leakage and to prevent the use of data if it manages to find its way out of the network. In addition, it’s crucial to prevent data leaks from impacting the performance of machine learning applications, or worse, having them generate flawed predictions. Here are some steps to consider.

- **Patch and update everything**: Software vulnerabilities, zero-day vulnerabilities and other security updates are usually available as soon as the companies that made them are aware that they need to be fixed. Updates should include the software for your clients and servers, as well as your other network devices. Promptness is key because once a vulnerability is known, you can be sure it will be exploited.

- **Split Your Data Sets**: Split your datasets into training, validation, and test datasets, and hold back the validation dataset for a final check of your developed models. In addition, extract the right features of the machine learning model, making sure that the features are not correlated with the given output value. Don’t hold information about the output that isn’t otherwise available at the time of the output.

- **Simplify access where possible**: If it’s too hard for employees to access the systems they need to do their work, they find ways around the security, including such things as downloading sensitive data to work offline. To make things manageable for your employees, reduce complexity. One way is to implement a single-sign-on system, with the users’ permissions for access being part of the sign-on process. Configured properly, employees log into the network once, and only have access to the resources they’re supposed to have. Having only one username and password helps because users don’t need to write their credentials down to remember all of them.

- **User multi-factor authentication**: Using more than just a username and password protects against credential loss, and it also simplifies password management and other access controls. This multi-factor authentication includes steps such as sending a security code to a device such as a cell phone. However, for a more secure approach, use a token such as an encryption key on a USB device, or a smart card along with a reader. Another factor could include biometric authentication using finger prints, facial identification, or eye scans.

- **Train your staff**: Your employees need to understand what data leakage is, why preventing it is important, and what they can do to stem it. Training should cover topics including why it’s not a good idea to copy data onto unauthorized devices, why they shouldn't write their credentials on notes, and why they need to check the addresses of the emails they send out. In addition, they need to recognize social engineering attempts and what to look for in the way of poor practices among their co-workers. Train them about how to handle a situation if they think a co-worker might be trying to take data with them.

- **Enforce good security practices**: If you make it reasonably easy to follow good practices, and if employees understand why it’s important, then enforcing those practices is relatively straightforward. Set requirements for passwords in terms of length and complexity, but those requirements need not be onerous. Requiring a 30 digit password of random letters, numbers and symbols only means that your employees will write them down. Instead, encourage the use of pass phrases and don’t require changes more often than necessary. Depend on multi-factor authentication to do most of the heavy lifting instead.

- **Consider email content filtering**: Security appliances designed to examine and detect unauthorized material in outgoing email work in conjunction with your firewall to prevent sensitive data from being exfiltrated. This can be part of a data loss prevention solution.

## Conclusion

Data leaks can be a serious problem for an organization. They can lead to cyber-attacks and other malicious breaches, damage to your organization, its reputation and its legal standing. In addition to the security consequences, data leaks in machine learning can lead to inaccurate predictions, poor performance and in some cases data loss. Preventing data leaks is crucial to your company’s security, and needs to be addressed with urgency.