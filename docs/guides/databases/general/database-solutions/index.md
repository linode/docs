---
slug: database-solutions
title: "Determine the Best Database and Cloud Hosting Solution for Your Next Application"
description: "Learn about the most popular database management systems and how to host them on the Akamai cloud computing platform."
authors: ["Linode"]
contributors: ["Linode"]
published: 2023-07-11
modified: 2024-11-14
keywords: ['DBMS', 'managed database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

Most applications use databases to store and organize the information they handle. When building a custom application or deploying an existing application, deciding what database software to use is often one of the most important decisions. This guide outlines some of the most popular database software and includes advice on both selecting the database and hosting it on Akamai.

1. [Select a Database Management System](#select-a-database-management-system)
1. [Select a Database Hosting Solution](#select-a-database-hosting-solution)

## Select a Database Management System

Before determining how to deploy and host a database on the Akamai cloud computing platform, you should first determine *which* database management system (DBMS) to use. This section covers many different databases (including both [relational](#relational-databases) and [non-relational](#non-relational-nosql-databases) database), as well as the factors that should inform you decision.

{{< note >}}
For an in-depth comparison of database management systems (DBMSs) and to learn which DBMS is right for you and your application, review the [Comparing DBMSs: The 8 Most Popular Databases](/docs/guides/list-of-databases/) guide.
{{< /note >}}

### Determining Factors

When selecting a database, consider the following factors:

- **Application support:** If you are integrating your database with an off-the-shelf application or tool, you are likely limited to whichever databases are supported by that application. When building your own application, there may be more flexibility.
- **Data structure (or model):** Outside of application support, how the data is structured is one of the primary factors for selecting a DBMS. Data with a consistent structure that's well suited to tables and rows should likely use a relational database. Unstructured data and some complex data models require a NoSQL database. Additionally, some databases may offer increased performance or usability benefits when working with particular data models.
- **Performance and efficiency:** After you narrowed down your choice based on application support and your data models, consider which of the viable database solutions offer the most performance and/or the more efficiency for your use case. You may want to consult benchmarks of similar applications or run your own benchmarks.
- **Cost:** Some database management systems are free, while others offer various products, pricing tiers, and service contracts. The ability of the DBMS to handle your particular data models and workloads efficiently can increase or decrease infrastructure fees and impact the total cost.

Additional factors like usability, security, portability, and data consistency should also be considered.

### Relational Databases

A relational database, also called a relational database management system (RDBMS), is one that stores information in tables (columns and rows). As its name suggests, RDBMSs enable data to maintain relationships --- even when stored in separate tables. The relationships correlate rows belonging to two different tables into a third table. Relational databases are suitable for *most* database workloads, especially when the data they contain doesn’t often change and when the accuracy of the data is crucial.

| <div class="w-48">Database</div> | Description |
| -- | -- |
| [MySQL](https://www.mysql.com/) (and [MariaDB](https://mariadb.org/)) | MySQL is an extremely popular and well known open-source relational DBMS, used in many common applications (such as WordPress). It is free, has an easy to use GUI (MySQL Workbench), and is widely supported. MariaDB is a MySQL fork and is 100% compatible with MySQL 5.7 and earlier. As both DBMSs continue to develop, their feature set has diverged --- though MySQL and MariaDB have many more commonalities than differences. [Learn more &rarr;](/docs/guides/list-of-databases/#mysql)<br><br>*Best for many common PHP applications and general workloads.* |
| [PostgreSQL](https://www.postgresql.org/) | PostgreSQL (also called Postgres) is another extremely popular free and open-source DBMS. While it can be slower and more complicated than MySQL, it can handle more complex data and even includes NoSQL support. [Learn more &rarr;](/docs/guides/list-of-databases/#postgresql)<br><br>*Best for complex enterprise-level applications.* |
| [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server) | Microsoft SQL Server (also called MSSQL) is a very popular proprietary DMBS regarded for its Windows support (though it does now include Linux support), .NET integration, relative ease of use, and extensive first party management tools. [Learn more &rarr;](/docs/guides/list-of-databases/#microsoft-sql-server)<br><br>*Best for .NET and Windows applications.* |
| [Oracle Database](https://www.oracle.com/database/technologies/) | Oracle Database is highly scalable (for a relational DMBS) and is very widely used for enterprise workloads. It offers high performance, efficient memory caching, and high availability and scalability (through Oracle RAC clusters), though this comes at higher costs and increased complexity compared with other relational DBMSs. [Learn more &rarr;](/docs/guides/list-of-databases/#oracle)<br><br>*Best for enterprise applications that require scalability.* |

### Non-Relational (NoSQL) Databases

Non-relational databases (also referred to as [NoSQL Databases](/docs/guides/what-is-nosql/)) do not store their information within tables, like RDBMSs. Data is instead stored as JSON documents, key-value pairs, or one of the following data models. This generally makes NoSQL databases more flexible as they can store a wide variety of data types.

- **Document-oriented:** data is stored as JSON documents.
- **Key-value:** data is stored in key pairs.
- **Graph:** data is stored in a node-edge-node structure.
- **Wide-column:** data is stored in a tabular format with flexible columns that can vary from row to row.

| <div class="w-48">Database</div> | Description |
| -- | -- |
| [MongoDB](https://www.mongodb.com/) | MongoDB is an extremely flexible general-purpose NoSQL database. Data is stored within BSON documents as JSON formatted key-value pairs. It is schema-less and it does not enforce a data structure. You can query MongoDB data using its own [MongoDB Query API](https://www.mongodb.com/docs/v6.0/query-api/). [Learn more &rarr;](/docs/guides/list-of-databases/#mongodb)<br><br>*Best for compatible general-purpose workloads, content management, analytics, and prototyping. Not ideal for large amounts of related data.* |
| [Redis](https://redis.com/) | Redis is a relatively simple NoSQL solution and stores data as key-value pairs within system memory. This enables high performance data retrieval, but it isn't suitable for many complex workloads. Due to this, Redis is often used as part of a caching system instead of a primary database. [Learn more &rarr;](/docs/guides/list-of-databases/#redis)<br><br>*Best for caching systems. Not ideal for an application's primary database.* |
| [Apache Cassandra](https://cassandra.apache.org/_/index.html) | Apache Cassandra is a wide column NoSQL database. While it can be compared to relational databases, it is schema-less and supports both structured and unstructured data. Its distributed nature (all nodes serve the same role) makes it scalable and fault tolerant. [CQL (Cassandra Query Language)](https://cassandra.apache.org/doc/latest/cassandra/cql/), Apache Cassandra own query language, is similar to SQL. [Learn more &rarr;](/docs/guides/list-of-databases/#apache-cassandra)<br><br>*Best for transaction logging, event logging, time-series data, and for high-write low-read applications. Not ideal for an application's primary database* |
| [Apache CouchDB](https://couchdb.apache.org/) | CouchDB is another document-oriented database, similar to MongoDB. CouchDB is known for its reliability and scalability. You can interact with data using its unique HTTP REST-like API and data is stored in JSON format. [Learn more &rarr;](/docs/guides/list-of-databases/#couchdb)<br><br>*Best for compatible general-purpose workloads and mobile applications.* |

## Select a Database Hosting Solution

After determining which database management system to use for your application, you need to decide how to deploy, configure, and manage that system in the cloud. The Akamai cloud computing platform offers the following solutions:

- [Managed Databases](#managed-databases)

    {{% content "dbass-eos" %}}

- [Marketplace Apps (and Clusters)](#marketplace-apps-and-clusters)
- [Self or custom deployment on Compute Instances](#custom-deployment)

{{< note >}}
Many users employ provisioning tools like Terraform and configuration management tools like Puppet and Ansible to automate application deployment on the cloud. While these tools are outside the scope of this guide, you can use them to deploy any of the database solutions outlined.
{{< /note >}}

### Managed Databases

*Use Managed Databases when you want to offload database software and infrastructure management and do not require full root control or setting customization.*

The [Managed Database](https://techdocs.akamai.com/cloud-computing/docs/managed-databases) service is an easy-to-use and fully-managed database solution. When a database is deployed through Managed Databases, the infrastructure, software, firewall, and high availability systems are configured automatically. This saves you time and resources. Once provisioned, you can add your application's IP addresses to allow traffic and then connect to the database directly from your application.

Managed Databases can be deployed with a single node (1 underlying machine) or a cluster of 3 nodes. Using 3 nodes provides you with a highly available database cluster, complete with data redundancy and automatic failover. Further, you can customize the size of the nodes and select from [Dedicated CPU](/docs/products/compute/compute-instances/plans/dedicated-cpu/) or [Shared CPU](/docs/products/compute/compute-instances/plans/shared-cpu/) Compute Instance plans. Since the underlying machines are fully-managed, direct root or console access is not provided and there is limited customization options for the database software.

Currently, the following databases are supported. Click on each database below to learn more and to view the available software versions.

- [MySQL](https://techdocs.akamai.com/cloud-computing/docs/mysql-managed-database)
- [PostgreSQL](https://techdocs.akamai.com/cloud-computing/docs/postgresql-managed-databases)

{{< note >}}
Updates and security patches are automatically applied to the underlying operating system but *not* to the database software. For more details, review the [Automatic Updates and Maintenance Windows](/docs/products/databases/managed-databases/guides/updates-and-maintenance/) guide.
{{< /note >}}

### Marketplace Apps and Clusters

*Use Marketplace Apps when you want to automatically install popular databases but need to retain full control over the software and underlying system.*

Another solution available on our platform is Marketplace Apps, which can greatly simplify application provisioning. When deploying a Marketplace App, a Compute Instance is created on your account. When the Compute Instance first boots up, a script runs to automatically install and configure the application. Beyond this automatic installation, you have root access and full control over the Compute Instance. This means that you are also responsible for managing and configuring the application, as well as installing updates and security patches.

The following Marketplace Apps (and Clusters) are available on the Akamai cloud computing platform.

**Marketplace Apps** (single instance): Deploys a single Compute Instance. Additional manual configuration is needed for applications that require high availability and scalability.

- [MySQL/MariaDB](https://www.linode.com/marketplace/apps/linode/mysql-mariadb/)
- [PostgreSQL](https://www.linode.com/marketplace/apps/linode/postgresql/)
- [Redis](https://www.linode.com/marketplace/apps/linode/redis/)

**Marketplace App Clusters** (multi-instance): Deploys multiple Compute Instances as part of a database cluster. This offers high availability, better fault tolerance, and increased scalability.

- [Galera cluster](https://www.linode.com/marketplace/apps/linode/galera-cluster/) (MariaDB)
- [PostgreSQL cluster](https://www.linode.com/marketplace/apps/linode/postgresql-cluster/)
- [Redis Sentinel cluster](https://www.linode.com/marketplace/apps/linode/redis-sentinel-cluster/)

Other [database-related Marketplace Apps](https://www.linode.com/marketplace/category/databases/) are available, including [ClusterControl](https://www.linode.com/marketplace/apps/severalnines/clustercontrol/).

### Custom Deployment or Self-Install {#custom-deployment}

*Directly provision your databases on Compute Instances to have full control over the installation and configuration, ideal for applications that require extensive database customization or complex configurations.*

Beyond Managed Databases and Marketplace Apps, you can deploy any of your database workloads to the cloud using Compute Instances. Since Compute Instances are Linux-based virtual machines, any compatible database software packages that are available on your chosen  Linux distribution can be installed. When manually hosting your database workloads, you are responsible for installation, configuration, and all aspects of database management (including applying regular security updates).

There are many installation and configuration guides available on our docs site for the database management system discussed above. Click on the links below to view guides for the corresponding database:

- [MySQL guides](/docs/guides/databases/mysql/)
- [MongoDB guides](/docs/guides/databases/mongodb/)
- [Apache Cassandra guides](/docs/guides/databases/cassandra/)
- [Redis guides](/docs/guides/databases/redis/)
- [PostgreSQL guides](/docs/guides/databases/postgresql/)
- [CouchDB guides](/docs/guides/databases/couchdb/)