---
slug: what-is-dbaas
author:
  name: Pam Baker
description: 'DBaaS is a cloud computing service that provides fully-managed databases. This guide further explains what DBaaS is and gives you guidance on choosing a DBaaS provider.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['what is database as a service', 'dbaas', 'database as a service']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-01-18
modified_by:
  name: Linode
title: "An Introduction to Database as a Service"
h1_title: "What is DBaaS (Database-as-a-Service)?"
enable_h1: true
contributor:
  name: Pam Baker
---

Database-as-a-service (DBaaS) is a fully-managed database service offered by a cloud provider. A DBaaS database is much like a traditional on-premises database with the exception that the complexity of database administration is left to the cloud provider. Typically, this includes installing and setting up the database on a server and backing up and updating the database.

Like other cloud computing services, DBaaS reduces costs, allows developers to focus on their product, and removes the need to have in-house personnel with production database management skills. The primary disadvantages include a reduced control of the servers and complexity in large data transfers.

While DBaaS, and especially managed DBaaS, relieves customers of many database management duties, customers still need to determine their own workload's database storage requirements. For example, you should understand if your application requires a SQL or NoSQL database. Similarly, you need a team that can work with your chosen type of database. Relational databases, like MySQL, work with structured data, i.e., tabular schema with rows and columns. Non-relational databases such as MongoDB, and Redis work with unstructured data, i.e., documents, graphs, and objects. Many cloud providers offer databases that give access to both. Project requirements usually dictate which database configuration is needed and which type of database should serve as your primary or secondary data storage.

## Managed Database vs. Unmanaged Database

A managed database is a database provided by a third party, typically a cloud provider. The provider oversees the database’s infrastructure. A managed database means that the provider sets up and maintains storage, data, security, and compute services for its customer instead of the customer’s IT staff. Users can move data to a managed database for temporary or ongoing management. Typically, even data migration can be assisted or managed by the cloud provider.

An unmanaged database affords you more hands-on control. However, it also requires more effort from your IT staff. Your organization’s IT staff may layer additional services, such as added security, on top of the services provided by a managed database, if needed. An unmanaged database requires your IT staff to provide everything needed, from the operating system to the database infrastructure. More control is possible in unmanaged databases and prototyping can move to production using the same initial setup used during development.

Given the costs, IT talent, and constant demand on IT’s effort and time, many organizations find DBaaS to be the best choice for production databases as it enables developers to focus on application development and continuous releases rather than on database housekeeping. Developers do have access to controls for essential features such as autoscaling, using monitoring systems, and adding or dropping nodes from their database cluster.

## The Benefits of DBaaS

The general benefits of using DBaaS include the following:

1. **Reduced operational costs**: You don't need to buy hardware and software necessary to create and maintain a database infrastructure. Nor do you have to spend the time, effort and money in maintenance, support, and routine security updates.

1. **High availability**: DBaaS is noted for consistently providing high availability for even the most demanding workloads.

1. **Rapid Provisioning**: On-demand database provisioning is far faster than physical databases. A production-ready database can be made available in a few clicks. The increased speed gives users a competitive advantage by further cutting costs and reducing time to market.

1. **More server options**: Users have more options in everything from newly freed server space on-premises to the variety of types of servers, operating systems and data formats that are available in the cloud.

1. **Scalability**: Scaling up is faster as nodes can be added instantly or nearly so. That is a feat hard to achieve in on-premises data centers where everything from additional hardware to expanded licensing must be secured first.

1. **Elastic pricing**: DBaaS provides service elasticity meaning users can scale instances up or down as needed. This ties cost to actual usage amounts which in turn trims waste and expenses.

1. **Better data and usage tracking**: Database usage can be tracked at broad and granular levels using DBaaS. Time, space, availability guarantees, licensing use, and resource consumption are all trackable.

1. **Staff optimization**: Developers and IT staff can focus on high priority projects over routine database housekeeping. The resulting optimization of their time delivers more efficiencies and corresponding additions to ROI.

1. **Enhanced security**: Routine security measures such as patching, updating, and upgrading software and firmware are handled by the DBaaS provider. Additionally, security issues often are better addressed by deep-pocketed cloud providers than less cash-flushed SMBs and startups. IT decision makers hailing from larger organizations also benefit from striking these additional costs from already over-stretched IT budgets.

## DBaaS and IaaS

Infrastructure as a Service (IaaS) is the most fundamental category of cloud computing services. IaaS enables you to rent IT infrastructure, like virtual machines (VMs), storage, networking, and operating systems. With IaaS, you have full control over what you can deploy on your rented infrastructure. For example, you can deploy a Linux server, install and configure the MySQL database software on your server, and make the secured database available to an application. Using IaaS to host a database that you configure and maintain is an example of an *unmanaged database*. The database functions similarly to a traditional database at where you must manage the operating system (OS), and the installation, configuration, maintenance and runtime of your database software.

In general, IT staff must possess the skills, experience, and time available to manage these databases similarly to how an on-premises database is managed. However, users don’t have to requisition hardware and thus save on capex costs.

For some companies, IaaS is all that is needed. This type of database mirrors what the organization and the IT staff is used to operating. It also presents the best costs and scalability options and provides the means for the greatest control.

There is an additional advantage for this native cloud implementation. It is the ideal cloud infrastructure upon which to build a DBaaS service. IaaS providers are among the most experienced with cloud databases and their prime use cases. IaaS providers possess the know-how and infrastructure to provide a robust DBaaS product.

Additionally, users can opt to use IaaS unmanaged databases and DBaaS databases simultaneously on one platform as they wish. This provides an additional set of options in your company’s overall cloud strategy.

## How to Choose a DBaaS Provider

Not all DBaaS providers are created alike, and neither are the database features and capabilities that each provides. Therefore, there are several key areas an SMB may want to consider when choosing a DBaaS provider and database solution.

Here is a checklist to help SMBs focus on their needs and how those match with the offerings of various DBaaS providers:

1. How much user guidance is offered. It’s one thing to know that there are options in database types and quite another to know which type, or engine, a data set or workload requires and would perform best on. Look to see if the DBaaS offers automated guidance to help you match workloads and data sets with the options available.

1. Complexity and lag times in data transfers. Often migrating data to a cloud database is one of the most challenging steps. However, best of breed providers automate and guide users through the process. Options to speed up the transfer may also be available, like transferring only change data from IoT, instead of all the data that devices on the edge collect. Look for a DBaaS that simplifies the data transfer process and guides you through your options.

1. Look for automated backup and recovery. Most previously manual and repetitive database work should be fully automated or nearly so. That is especially true of data backups and recovery options. Look for a provider that sees data backup as a required security function. Further, carefully consider how the provider backs up their own systems to avoid unnecessary downtime from physical disasters and digital breaches.






