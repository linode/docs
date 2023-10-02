---
slug: disaster-recovery
description: 'Disaster recovery allows for the continued use of IT infrastructure in the case of a human or natural disaster. Develop a recovery plan with the help of this guide.'
keywords: ['disaster recovery plan','define disaster recovery','disaster recovery definition']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-02-18
modified_by:
  name: Linode
title: "Creating a Disaster Recovery Plan: A Definitive Guide"
title_meta: "Disaster Recovery: What It Is and How to Create a Plan"
authors: ["Wayne Rash"]
---

A disaster recovery (DR) plan is a series of instructions that leads your organization through the process of restoring operations following an unplanned event that prevents the use of its IT infrastructure. Such plans allow recovery from a broad range of events, and are tailored to the needs of a specific organization. Because disasters occur without warning, and because they may include substantial damage to existing infrastructure, DR plans must be developed and tested in advance of a disaster.

## What is Disaster Recovery?

In relation to IT, disaster recovery means restoring the IT environment to operation or to accessibility. Depending on the type or disaster, the IT environment, including computers, networking equipment and storage, may be intact and inaccessible, or they may be totally or partially destroyed. Restoring access may mean simply restoring electrical power or internet access; or it may mean repairs to access roads or bridges. In some types of disasters, it means environmental clean up.

A more complex form of disaster recovery is required when IT infrastructure is damaged or destroyed. Then, recovery probably requires finding a new temporary or permanent site, new networking access and new equipment. Recovery includes full operation of the data center, all software, and support services.

The types of disasters may be anything from fire and floods, to terrorist attacks and employee sabotage, to cyber attacks. The amount of damage can range from minimal to total. Regardless of the cause and type, each requires recovery for the organization to continue operations.

## Disaster Recovery Plan vs. Business Continuity Plan

Disaster recovery plans are a subset of a business continuity plan. A business continuity plan helps an organization recover from disruptions, be they disasters, work stoppages and security events, and anything else that prevents a business from operating as usual. A business continuity plan consists of a business resumption plan, occupant emergency plans, and continuity of operations plans, in addition to a disaster recovery plan.

## The Importance of Disaster Recovery

Without some means of recovery, a disaster can destroy your business. Without access to your data, you can find yourself unable to bill your customers, reach out to new customers, or conduct day-to-day operations. The legal documents that allow your company to operate could be gone, so could your intellectual property, your designs and procedures. You could lose access to your funds, your employee records, and your accounting records.

In some cases, these losses are temporary. In which case, you have to determine how long your organization can exist without access to basic information. Some companies survive a few days, but most companies begin to see operational losses, not to mention reputational losses, almost immediately.

If the data you need to operate is permanently lost, your business probably is as well. Although your data is still available somewhere, there’s more to disaster recovery than just data. You need to have a way to resume operations and conduct business, which means access to the internet, phone lines, and other aspects of IT. This includes computers required for business processes and manufacturing. Without disaster recovery, you have no means of resuming operations.

## Developing a Disaster Recovery Plan

A disaster recovery plan is unique to the organization that uses it. Each organization has different requirements, different areas of responsibility, and different functions that need to be recovered in a specific and unique order. It is possible to find pre-written disaster recovery plans, but they need to be modified to meet your organization’s needs.

There are specific steps that all organizations must take as they develop their DR plan. Take each of those steps and fit them to your organization's requirements.

It’s critical to know that developing a plan does not complete the process. Each step of the plan must be tested before it can be considered for use, and each plan must be changed as conditions change. Those conditions include changes in the company’s business, in the organization and staffing, in the level or type of risk, and changes in the recovery infrastructure such as new cloud services.

### Setting your Goals

Goal setting is done by a team in your IT department, but it’s more effective to create a committee that includes your IT and security staff, as well as major departments in your organization. The committee needs to have buy-in from C-level managers to be effective and to have the authority to implement the plan once created and approved by upper management. Start with some primary goals:

- **Recovery time objective** - This is the acceptable time your systems can be down before recovery must be accomplished. For example, can your systems be offline for one day before the business is impacted?

- **Recovery point objective** - How much data can your organization afford to lose? If you can afford to lose no more than 15 minutes of data, then your backups must take place at least every 15 minutes.

- **Full restoration objective** - Your initial recovery isn’t complete, even if it allows you to resume business operations. Full restoration means how much time you can afford for your organization to be fully functional.

- **Risk Analysis** - Before you start on your disaster recovery plan, it’s important to determine what sort of risks you’re facing. For example, you probably don’t need to plan for recovery from hurricane damage if you’re located in Denver. However, you can’t simply decide to eliminate risks because you think they’re unlikely. All organizations should consider risks from cyber attacks, sabotage, extreme weather, flooding, power loss or terrorism, along with more mundane risks such as broken water pipes or HVAC systems, or even the loss of internet access. If necessary, consult weather records or news archives to determine what types of disasters occurred in your location in the past, and take those into account in your planning.

## Components of a Disaster Recovery Plan

After your goals are set, define how you plan to achieve them. Be aware that the details of these steps need to be updated on a regular and frequent basis.

- **Personnel** - These are the specific individuals or roles who carry out the recovery process. Most of these people are part of your IT staff, but you may want to include others who have specific skills or responsibilities necessary to the recovery. You must also include alternates in place of members of the recovery team who are lost as a result of the disaster, or who simply cannot get access to the recovery site.

- **IT inventory** - This is a complete list of all IT equipment and software assets, along with all cloud services necessary for the organization’s operation. The list should indicate which are critical to business operation, and which are owned, leased, or used as a service. The list should include all applications, and it should include configuration information.

- **Backup Procedures** - The backup procedures list includes how each IT asset is backed up, specifically where the backups are stored, including specific directories and folders, how the backups are accomplished, and how often. The backup procedures list should include recovery instructions for each backup.

- **Recovery Procedures** - This is a set of instructions for recovery that consists of your emergency responses to protect people involved, limit damage, and mitigate loss. This can include any last-minute backups where possible and any other steps such as taking removable media off-site. The recovery procedures must also include instructions for recovering your data and applications to the recovery site once it’s operational.

- **Choosing a Recovery Site** - The type of disaster dictates the location of your recovery site. An area-wide disaster such as a hurricane or major earthquake makes your normal operations site inaccessible, or worse, destroyed, and nearby areas unavailable. A more local disaster, such as a fire, may only make the building containing your IT equipment unavailable. This means you need to identify a location where operations can be moved, and any necessary IT equipment and software installed. It must include working space for employees conducting the recovery and the operations of the company afterwards. Typical sites may consist of a remote office that can be expanded to host the recovery, or even a dedicated recovery hot site. Which type of site you choose to use depends on accessibility for your staff, and the amount of time it takes to resume operations at the recovery site.

- **Recovery Coordination** - In addition to the procedures above, your DR plan must include the following items:

    - **Detailed contact information** - You need a list of the home and mobile phone numbers for each member and alternate recovery team, senior management and the legal team. List the email addresses, including personal emails, and physical addresses of each person.

    - **Emergency Services** - You need contact information for all your local and state emergency services during the course of the disaster because you are likely to need their help during recovery. This includes fire departments, law enforcement, and possibly the Coast Guard and federal agencies, depending on the type of business you’re in. You also need the information for the utilities you use, including the power company, and municipal services such as water and sewer. Make sure you include account numbers where needed.

    - **Business Services** - You need contact and account information for your phone and internet provider to arrange a transfer of their services to your recovery site. You may also need to engage consulting services, or to activate previously arranged services to assist in the recovery. Include that contact and engagement information.

    - **Rebuilding Plan** - You’re going to need a new data center, even if it’s only a temporary arrangement. To minimize your restoration time, a detailed floor plan of the new data center, complete with a list of all physical and software assets, and their planned location allows you to resume operations as quickly as possible.

    - **Notification Plan** - Your employees need to be notified of the disaster and the recovery effort as quickly as possible, so develop a plan, whether it’s a phone tree or a public announcement, to communicate with your employees. Make sure they’re aware of the plan well in advance of any disaster. Your public relations team needs to create a media communications plan to let your community know about your recovery. The sales and marketing departments also need to develop a plan to inform customers and suppliers about the disaster and your recovery plans so their confidence level in your business remains high.

## Mitigating the Effects of Disasters

There are steps your organization can take to help reduce the impact of a disaster, making a successful disaster recovery more likely. These steps may require some adjustment in how your IT department works, but they may also make routine operations more efficient

- **Use Cloud Services** - Cloud service providers typically have robust backup practices, and they store your data and operate your virtual machines in remote locations. In many cases, this data storage is spread across multiple geographically diverse locations to eliminate any chance of a single event impacting your data or your VMs. In addition, cloud service providers typically provide advanced security to protect your data, and they employ robust malware protection and advanced physical security practices.

- **Review Your Backup Practices** - It’s critical that you know where your backups are going and how they’re going there. Proper backups should have at least two levels: One that’s local so you can recover something quickly and easily and one that’s remote, meaning in the cloud. You can use your existing cloud service provider to host your backups, or you can use a specialized cloud backup provider. Whichever you use, document the location of your backups and how to restore them. In addition, you must test and verify that you can restore your data from those backups on a regular basis.

- **Train and Practice** - Each person assigned a role in disaster recovery has to be trained in that specific role, and they must practice the recovery. This is more than just handing them a page of instructions. They have to learn to perform the actions required of them and they must practice those actions with the disaster recovery team. During the practice sessions, any problems with the disaster recovery procedures should be identified, and adjustments made to the practice or to the procedures. Document the changes. As new people join the organization or positions change, update the training, and if necessary, repeat it.

## Conclusion

Successful disaster recovery takes planning and practice. But when a disaster happens, good planning saves your business. A well designed plan that’s kept current and is well rehearsed helps ensure the survival of your organization. A key component in that survival are business practices that protect critical assets, your IT systems, and the associated data from loss. By keeping your data, and where possible, your applications in the cloud, such as [Linode's cloud services](https://www.linode.com/), you can take significant steps to protect your organization against the risks of a disaster.