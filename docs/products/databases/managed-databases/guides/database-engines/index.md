---
author:
  name: Linode
  email: docs@linode.com
title: "Database Engines and Plans"
description: "Learn the differences between the database engines offered by Linode's Managed Database service."
published: 2022-06-06
modified: 2022-08-09
---

When deploying a Managed Database, you are able to select from a variety of database engines and plans. While each database engine enables you to store data, application compatibility and the way in which they store and access data can vary greatly. This guide aims to provide more information on each database engine, the reasons you might choose one over the other, and advice on selecting an appropriate plan size.

## Database Engines

The following database engines are available on Linode's platform:

- [MySQL](#mysql)
- [PostgreSQL](#postgresql)
- [MongoDB](#mongodb)

### MySQL

**Starting at $15 ($0.0225/hr) for a single node and $35 ($0.0525/hr) for a 3 node high availability cluster.**

MySQL is an industry standard relational database management system (RDMBS) that uses the SQL query language. Compared to other databases, it's relatively easy to use and its large community means there are lots of online resources available. MySQL values performance and accessibility over pure SQL compliance, so its syntax can slightly differ from strict SQL. Many popular applications (including WordPress) require MySQL or a MySQL compatible database.

*Best for general-purpose websites and applications, e-commerce sites, applications employing LAMP or LEMP stacks, and for beginner database developers looking for robust online resources*

**Available versions:**

- MySQL 8.0
- MySQL 5.7

### PostgreSQL

**Starting at $15 ($0.0225/hr) for a single node and $35 ($0.0525/hr) for a 3 node high availability cluster.**

PostgreSQL is an object-relational database management system (ORDBMS) that can use SQL. It's generally more flexible and feature-rich than MySQL, though it's not a drop-in replacement and applications need to have built-in support for it. It also has support for more data types, including JSON, and adopts some features of NoSQL databases. While PostgreSQL is generally more challenging to implement, it can support more advanced queries and is a popular choice for enterprise applications.

*Best for experienced SQL developers, applications that perform complex queries, using PostgreSQL-specific features, and for business users looking for dedicated commercial support.*

**Available versions:**

- PostgreSQL 13.2
- PostgreSQL 12.6
- PostgreSQL 11.11
- PostgreSQL 10.14

### MongoDB

**Starting at $15 ($0.0225/hr) for a single node and $45 ($0.0675/hr) for a 3 node high availability cluster.**

MongoDB is a document-oriented *NoSQL* database software that uses JSON files to store data. It is one of the most popular NoSQL databases and, as such, it is *unstructured* and very flexible.

*Best for caching systems, log storage, and for storing data that is too complex, too large, or too variable to be used within a traditional relational database*

**Available versions:**

- MongoDB 4.4
- MongoDB 4.2
- MongoDB 4.0
- MongoDB 3.6

## Database Plans

Each Managed Database can be deployed with a specific set of resources. This collection of resources is called the *plan*. Linode offers two plan types for Managed Databases:

- [Shared CPU](#shared-cpu-instances)
- [Dedicated CPU](#dedicated-cpu-instances)

### Shared CPU Instances

**1 GB - 192 GB Memory, 1 - 32 Shared vCPU Cores, 25 GB - 2840 GB Storage**<br>

[Shared CPU Instances](/docs/products/compute/shared-cpu/) offer a balanced array of resources coupled with shared CPUs that can burst up to 100% for short intervals. This keeps costs down while still supporting a wide variety of cloud applications. Your processes are scheduled on the same CPU cores as processes from other Compute Instances and Managed Databases. This shared scheduling is done in a secure and performant manner and Linode works to minimize competition for CPU resources between your server and other servers.

*Best for development servers, staging servers, low traffic websites, personal blogs, and production applications that may not be affected by resource contention.*

### Dedicated CPU Instances

**4 GB - 512 GB Memory, 2 - 64 Dedicated vCPUs, 80 GB - 7200 GB Storage**<br>

[Dedicated CPU Instances](/docs/products/compute/dedicated-cpu/) reserve physical CPU cores that you can utilize at 100% load 24/7 for as long as you need. This provides competition free guaranteed CPU resources and ensures your software can run at peak speed and efficiency. With Dedicated CPU instances, you can run your software for prolonged periods of maximum CPU usage, and you can ensure the lowest latency possible for latency-sensitive operations. These instances offer a perfectly balanced set of resources for most production applications.

*Best for production websites, enterprise applications, high traffic databases, and any application that requires 100% sustained CPU usage or may be impacted by resource contention.*

{{< note >}}
Once a Managed Database cluster is created, it cannot be resized to a different plan. To modify the resources allocated to your database, you will need to create a new Managed Database with the desired plan, migrate your data, and delete the original Managed Database.
{{</ note >}}