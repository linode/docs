---
title: Managed Databases
linkTitle: Databases
description: "Learn about Linode's new Managed Database service, currently in beta."
tab_group_main:
    is_root: true
    title: Overview
    weight: 10
cascade:
    date: 2022-02-23
    product_description: "Fully managed cloud database clusters built on top of Linode’s trusted and reliable platform."
aliases: ['/products/database/']
---

{{< content "managed-databases-beta-notice-shortguide" >}}

Linode's Managed Databases combine performance, reliability, and high availability into a fully managed database solution. Databases are used by most organizations to store their business and operational data, including customer information, financial details, application content, ecommerce transactions, and much more. Managing the database infrastructure to store and safeguard this data can put additional stress on the resources you have available. **Managed Databases** take care of managing this critical infrastructure for you, providing you with an easy to use DBaaS (database-as-a-service) solution built on top of Linode's trusted and reliable platform.

## Simplified deployment and maintenance

- **Automated deployment:** When a database is deployed through Managed Databases, the infrastructure, software, and firewall, and high availability systems are configured automatically. This can save hours of time compared to manually setting up a database.

- **Access controls:** Prevent unauthorized database access by only allowing connections from specific IP addresses (or ranges).

- **Daily Backups:** Automatic daily backups are provided at no additional cost and are retained for 7 days. This provides you with a recovery point for each day over the last 7 days.

## High availability

Managed Databases can be configured with either 1 or 3 underlying machines, also called *nodes*. Using 3 nodes provides you with a highly available database cluster, complete with data redundancy and automatic failover. Your data is replicated across every other node in the cluster. If one goes down, any traffic is redirected to the other available nodes.

## Database Engines

The following database management systems (DBMSs) are available (or coming soon) to Managed Databases:

- **MySQL:** An industry standard relational database management system that uses the SQL query language. Many popular applications (including WordPress) require MySQL or MySQL compatible databases. See [An Overview of MySQL](/docs/guides/an-overview-of-mysql/). The following major releases are available (each with one or more available minor releases):

    - MySQL 8.0
    - MySQL 5.7

    *If the applications using your database support it, you may want to select the latest available release of MySQL 8. It's more performant and includes additional features. MySQL 5.7 is available for legacy applications.*

- **PostreSQL** *(Coming in June 2022)*: An object-relational database management system that can use either SQL or JSON queries. It's generally more flexible and feature-rich than MySQL, though it's not a drop-in replacement and applications need to have built-in support for it. See [An Introduction to PostreSQL](/docs/guides/an-introduction-to-postgresql/)

- **MongoDB** *(Coming in June 2022)*: A document-oriented database software that uses JSON files to store data. It is one of the most popular NoSQL databases and, as such, it is *unstructured* and very flexible. [MongoDB and Its Use Cases](/docs/guides/mongodb-and-its-use-cases/)

- **Redis** *(Coming soon)*: An in-memory NoSQL database that stores its data as key-value pairs. It's most commonly used as a caching system.

## Recommended Workloads

- Any production application that utilizes a database, especially one with high-traffic or one that stores critical data.
- Medium to high traffic websites using WordPress, CraftCMS, Drupal, or other database-enabled application.
- E-commerce sites
- Organizations that don't want to commit IT resources towards managing a database cluster.

See the [Use Cases for Managed Databases](/docs/products/databases/managed-databases/guides/use-cases/) guide to learn more about these use cases.

## Availability

Managed Databases can be created and deployed across [all regions](https://www.linode.com/global-infrastructure/).

## Plans and Pricing

| Resource | Available Plans |
| -- | -- |
| Cluster size | 1 - 3 nodes |
| vCPU cores | 1 - 64 cores (shared or dedicated) |
| Memory | 1 GB - 512 GB |
| Storage | 25 GB - 7200 GB |

Pricing starts at $15/mo for a 1 GB instance with a single node. Review the [pricing page](https://www.linode.com/pricing/#databases) for additional plans and their associated costs.

{{<note>}}
The free and open beta ends on May 1st 2022. During this time, Managed Databases will not incur any costs. Starting on May 2nd, 2022, billing begins for all active Managed Database clusters. If you do not wish to continue using Managed Database, delete any active database clusters before this date to avoid charges.
{{</note>}}

Managed Databases do not consume [network transfer](/docs/guides/network-transfer/) or include a monthly transfer allowance. Transfer is consumed when connecting to a Managed Database from a Compute Instance when that instance is located in a different data center.

## Additional Technical Specifications

In addition to the resources allocated to each available plan (outlined above), Managed Databases have the following specifications:

- Fully-managed, including automated deployment and maintenance
- Multiple database engines and versions
- Customize access controls to allow connections from trusted sources
- Automatic backups are taken daily and retained for 7 days
- Root-level access to the database
- 100% SSD (Solid State Disk) storage
- 40 Gbps inbound network bandwidth
- Free inbound network transfer
- Provisioning and management through the [Cloud Manager](https://cloud.linode.com/), [Linode CLI](https://www.linode.com/products/cli/), or programmatically through the [Linode API](https://www.linode.com/products/linode-api/)

## Limits and Considerations

- Managed Databases cannot be resized to a different plan or cluster size after they are created.

- The default user cannot be changed or removed, though the password can be reset at any time.

- You are not able to access the underlying operating system of a database cluster.

- It is not possible to upgrade the database software or underlying operating system after the Managed Database has been deployed.
