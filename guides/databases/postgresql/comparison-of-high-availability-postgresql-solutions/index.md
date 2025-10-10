---
slug: comparison-of-high-availability-postgresql-solutions
title: "A Comparison of High Availability PostgreSQL Solutions"
description: 'This guide describes the high availability and resiliency options for PostgreSQL, with a survey of the three most common replication managers.'
authors: ["Jeff Novotny"]
contributors: ["Jeff Novotny"]
published: 2024-03-19
keywords: ['PostgreSQL high availability','high availability comparison PostgreSQL','PostgreSQL patroni','PostgreSQL repmgr','PostgreSQL paf']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[PostgreSQL](https://www.postgresql.org/)'
- '[PostgreSQL High Availability Documentation](https://www.postgresql.org/docs/current/high-availability.html)'
- '[Google Cloud Architecture Center PostgreSQL high availability survey](https://cloud.google.com/architecture/architectures-high-availability-postgresql-clusters-compute-engine#comparison_between_the_ha_options)'
- '[repmgr](https://www.repmgr.org/)'
- '[repmgr documentation](https://www.repmgr.org/docs/current/getting-started.html)'
- '[Patroni](https://patroni.readthedocs.io/en/latest/)'
- '[Patroni GitHub](https://github.com/zalando/patroni)'
- '[pg_auto_failover](https://pg-auto-failover.readthedocs.io/en/main/)'
- '[pg_auto_failover GitHub](https://github.com/hapostgres/pg_auto_failover/blob/main/docs/index.rst)'
---

[PostgreSQL](https://www.postgresql.org/) database instances can be configured into a high-availability cluster to increase reliability and resiliency. This technique permits the member nodes to act together as one virtual database. In the event of a failure, one of the backups can take over as the leader (primary node). This guide introduces the high availability options available for PostgreSQL and includes an overview of the main alternatives.

## Why is High Availability Critical for Production Databases?

Customer and employee expectations for websites, databases, and other resources have evolved over the last two decades. In the past, a certain amount of downtime was tolerated, but current standards are way more stringent. A database is a key IT component of a corporate website, so if it becomes unavailable, the entire company can be affected. In particular, customer-facing resources, such as e-commerce websites, are likely to be degraded.

Frequent outages can have negative effects on a company. Visitors often assume an organization hosting an unreliable service is itself unreliable. Customers quickly move over to a competitor, resulting in a loss of business. There can also be a considerable cost when internal databases are down. Employees might not be able to do their jobs and business-critical outages might occur. For example, production lines and orders can be halted. In addition to reducing efficiency, database outages can introduce legal liabilities and reduce employee morale.

Adding redundancy to a database in the form of a *high availability* (HA) architecture helps address these issues. This typically involves provisioning additional database instances to maintain duplicate copies of the data. All databases in the set function as a single logical instance of the database and all instances store the same data. Data changes can only be made on a single system designated as the primary node, but in most cases, any instance can handle a read request. This capability enhances throughput and enables load balancing and data redundancy.

{{< note >}}
The term *cluster* has different meanings in different products. It does not always mean a redundant set of databases. Sometimes it only refers to a group of databases in the same network or at the same location. "Cluster" also has a variety of meanings in PostgreSQL, but it does not refer to redundant databases. This is discussed more thoroughly in the following section.
{{< /note >}}

Organizations typically define a *Maximum Tolerable Downtime* (MTD) for each resource, including websites and databases. MTD indicates the amount of unavailability the business can tolerate. For websites and key databases, an uptime metric of about 99.9 to 99.95% satisfies prevailing industry standards. This amounts to between five to ten hours of downtime a year. The tolerable downtime for a database can be higher or lower depending on its importance. Critical databases might have an extremely low downtime tolerance. An internal human resources database likely has less stringent requirements. However, a high-availability solution has a role to play in both cases.

Most high-availability architectures, including the solutions for PostgreSQL redundancy, incur additional costs for an organization. These costs include deploying more servers and configuring and managing a more complex network. For some smaller organizations, the additional cost might not make sense. Even within larger organizations, not all systems need high availability infrastructure, such as for test or staging environments.

## High Availability Concepts for PostgreSQL

PostgreSQL is a powerful, flexible, and reliable relational database system. However, it does not automatically implement high availability. This means it remains vulnerable to network outages or server failures. Users must take additional steps to enable resiliency and ensure their databases are consistently operational.

This task is typically accomplished through the use of specialized replication manager applications. A replication manager works in conjunction with the existing PostgreSQL infrastructure, handling system monitoring and automatically initiating switchover events when necessary. If the primary copy of the database goes offline, the replication manager redirects users to a backup copy. Some applications can even take steps to restore a failed system or database process.

Users must understand some basic concepts to properly evaluate the different PostgreSQL high availability alternatives. Potential architectures can be divided into categories based on how updates are handled across the set of member databases.

Unfortunately, the term "cluster" has a variety of meanings in PostgreSQL, which can confuse the discussion.

- It most typically refers to a collection of databases sharing the same data storage area. All databases in the cluster have the same buffer and connection pool sizes.
- Cluster can be used as a verb to describe the process of reordering the data around a specified index. A PostgreSQL table can be reorganized in this manner using the `CLUSTER` command.
- Clustering also refers to splitting a data set into many groups based on the characteristics of the data.
- Finally, "cluster" is used informally to refer to a "computing cluster", although this is technically an inaccurate use of the word. This definition maps to the typical industry usage of a group of machines working together for a common purpose such as redundancy or increased throughput. A cluster in this sense of the word is known as a *high-availability* database in PostgreSQL. The set of all nodes participating in the HA solution is known as a *node group*.

{{< note >}}
In PostgreSQL terms, high availability is considered an attribute of a single cluster of databases, making the entire system a *high-availability cluster*. To avoid confusion, this guide uses the term "high availability/HA cluster" to refer to the collection of distinct database instances containing the same data.
{{< /note >}}

Irrespective of implementation details and terminology, all database high-availability solutions must perform the following tasks.

- Elect a primary node as the leader.
- Direct all write operations to the primary node.
- Replicate all changes on the primary to all active replica/secondary nodes.
- Monitor the status of the primary node and identify any failures.
- In the event of a primary failure, promote one of the replicas to become the new primary.

Most solutions implement some additional optional features. They are usually able to distribute read requests across the HA cluster for load-balancing purposes. Many replication applications also perform repairs to the individual nodes to bring them back to an active state.

The PostgreSQL site contains a general discussion of high availability along with a list of configurable settings. Consult the [PostgreSQL high availability documentation](https://www.postgresql.org/docs/current/high-availability.html) for more information.

### PostgreSQL High Availability Components

A complete high-availability architecture involves a number of components and processes working together to replicate data. Any organization implementing a high-availability solution should define target metrics for database uptime, switchover recovery time, and acceptable data loss.

Some of the most important concepts involving database high availability are as follows:

- **Data Replication**: Data replication generates multiple copies of the original database data. It logs any database additions and updates and transmits them to all nodes in the HA Cluster. These changes can be database data transactions or alterations to the database schema or table structure. Replication can be either synchronous or asynchronous.

- **High Availability Cluster (HA Cluster)**: A HA Cluster is a collection of nodes that each have a copy of the same underlying data. Having multiple copies of the dataset is essential for data redundancy. Any one of the database servers can respond to queries, and any node can potentially become the master node. From the user's point of view, the HA Cluster appears as a single database. In most cases, users do not know which node responded to their query.

- **Primary Node**: This is the master node for the HA cluster. It is the recipient of all database changes, including writes and schema updates. Therefore, it always has the most current data set. It replicates these changes to the other instances in the HA cluster, sending them the transactions in either list or stream format. Primary nodes can also handle read requests, but these are typically distributed between the different nodes for load-balancing purposes. The primary node is elected through a *primary election*.

- **Replica Node**: Also known as a *secondary node*, a replica receives updates from the primary node. During regular operation, these nodes can handle read requests. However, depending on the HA architecture, the data in the replica data set might not be completely up to date. Each HA cluster can contain multiple replica nodes for added redundancy and load balancing.

- **Failover**: In the event of a primary node failure, a failover event occurs. One of the secondary nodes becomes the primary node and supervises database updates. Administrators can initiate a manual failover for database maintenance purposes. This scheduled activity is sometimes known as a *manual switchover*. A switch back to the original master is known as a *fallback*.

- **Write-ahead log (WAL)**: This log stores a record of all changes to the database. A unique sequence number identifies each WAL record. In PostgreSQL, the WAL is stored in a *segment file*. A segment file typically contains a large number of records.

### Methods for Implementing Database Replication

There are two main forms of data replication and two methods of implementing it. The two main approaches are as follows:

- **Synchronous replication**: In this approach, the primary node waits for confirmation from at least one replica before confirming the transaction. This guarantees the database is consistent across the HA cluster in the event of a failure. Consistency eliminates potential data loss and is vital for organizations that demand transactional data integrity. However, it introduces latency and can reduce throughput.
- **Asynchronous replication**: In asynchronous replication, the primary node sends updates to the replicas without waiting for a response. It immediately confirms a successful commit after updating its own database, reducing latency. However, this approach increases the chances of data loss in the event of an unexpected failover. This is the default PostgreSQL replication method.

The following algorithms are used to implement replication:

- **File-based log shipping**: In this replication method, the primary node asynchronously transmits segment files containing the WAL logs to the replicas. This method cannot be used synchronously because the WAL files build up over a large number of transactions. The primary node continually records all transactions, but the replicas only process the changes after they receive a copy of the file. This is a good approach for latency-sensitive loss-tolerant applications.

- **Streaming replication**: A streaming-based replication algorithm immediately transmits each update to the replicas. The primary node does not have to wait for transactions to build up in the WAL before transmitting the updates. This results in more timely updates on the replicas. Streaming can be either asynchronous, which is the default setting, or synchronous. In both cases, the updates are immediately sent over to the replicas. However, in synchronous streaming, the primary waits for a response from the replicas before confirming the commit. Users can enable synchronous streaming on PostgreSQL through the `sychronous_commit` configuration option.

Another relevant set of concepts relates to how the HA cluster handles a split-brain condition. This occurs when multiple segments of the HA cluster are active but are not able to communicate with each other. In some circumstances, more than one node might attempt to become the primary. To handle this situation, the replication manager structures the rules for a primary election or adds a *quorum*. This problem can also be eliminated through the use of an external monitor.

## Deploying a PostgreSQL HA Cluster on Akamai Cloud Computing

There are two main methods of deploying a PostgreSQL high-availability cluster on Akamai. There is the traditional manual configuration method and the [Akamai Marketplace](/docs/marketplace-docs/guides/postgresql-cluster/) solution.

For a concise discussion and comparison of the three main alternatives, see the Akamai blog about PostgreSQL's high availability.

### The Marketplace PostgreSQL HA Cluster

Akamai allows users to configure a PostgreSQL HA cluster as a [Marketplace application](/docs/marketplace-docs/guides/postgresql-cluster/). Using this technique, database administrators can set up an HA cluster from the Linode Dashboard. This solution is supported on Ubuntu 22.04 LTS distribution on any plan type.

The Akamai Marketplace solution uses the [*repmgr*](https://www.repmgr.org/) replication manager to control the PostgreSQL high availability cluster. The Marketplace application automatically configures a three-node HA cluster. Users only have to create users, roles, schemas, and tables before deploying the database.

This solution has some limitations. It is not possible to choose the size of the HA cluster or manually edit any application variables. It is a viable option for a smaller organization with less technical expertise. However, it might not meet the specific requirements of a more complicated network.

It is also possible to configure redundancy using the [IP failover](/docs/products/compute/compute-instances/guides/failover/) option. This feature allows multiple computing instances to share an IP address. If the primary system becomes inaccessible, the secondary server can take over. This enables some level of redundancy, although it is more limited than a full high-availability solution. Adding this enhancement involves configuring the [Lelastic](https://github.com/linode/lelastic) utility on your instances.

### Manual Deployment Using a Replication Manager

PostgreSQL can be manually installed using a package manager from the command line. The user then has the option of configuring one of the three replication manager solutions mentioned below. Administrators are responsible for configuring users, databases, tables, and other database elements on the primary node.

This method is more complicated and requires additional user configuration. However, it allows administrators to have full control over the PostgreSQL HA Cluster configuration, including the choice of replication manager. The most common choices are [*Patroni*](https://patroni.readthedocs.io/en/latest/), [repmgr](https://www.repmgr.org/), also known as *Replication Manager*, and [*pg_auto_failover*](https://pg-auto-failover.readthedocs.io/en/main/) (PAF).

## Specific High Availability Solutions

A specialized replication manager application is almost always used to configure PostgreSQL HA Clusters. These applications automatically handle data replication and node monitoring, which are otherwise very difficult to implement. There are a number of different choices. Each alternative has its own series of strengths and drawbacks. This section explains each of the three most common solutions and compares them.

### Patroni

[Patroni](https://patroni.readthedocs.io/en/latest/) is a Python-based software template for enabling high availability in PostgreSQL databases. This framework requires some template customization to work most effectively. It also requires a *distributed configuration store* (DCS) but supports a number of different storage solutions. Patroni works well on a two-node HA cluster consisting of a primary node and a single replica.

Patroni configures a set of nodes into an HA cluster and configures streaming replication to share updates. It runs an agent on each node in the HA cluster to share node health updates between the members. The primary node is responsible for regularly updating the *leader key*, which is stored in the DCS. If it fails to do so, it is evicted as the primary and another node is elected to take over. After a switchover, the replicas coordinate their position with respect to the database updates. The most up-to-date node typically takes over. In the event of a tie, the first node to create a new leader key wins. Only one node can hold the leader key at any time. This reduces any ambiguity about the identity of the primary node and avoids a split-brain scenario.

Patroni can be installed on Linux nodes using `pip`. Mandatory configuration settings can be configured globally, locally using a YAML file, or through environment variables. The global settings are dynamic and are applied asynchronously to all nodes in the HA cluster. However, local configuration always takes precedence over any global settings. Patroni supports a REST API, which is useful for monitoring and automation purposes. This API is used to determine the status and role of each node in the HA cluster.

**Advantages:**

- It is a mature open-source product.
- It performs very well in standard high-availability test scenarios. It is able to handle more failure scenarios than the alternatives.
- In some circumstances, it is able to restore a failed PostgreSQL process. It also includes a fallback function to restore the HA cluster to a healthy state after failures. This involves initializing the affected node as a replica.
- It enables a standard end-to-end solution on all nodes in the HA cluster based on global configuration settings.
- It has a wide set of features and is highly configurable.
- It includes monitoring functionality.
- The associated REST API permits script access to all attributes.
- It includes watchdog support and callbacks for event notifications.
- It can be integrated with HaProxy, a popular high-performance load balancer.
- Patroni works well with Kubernetes as part of an automated pipeline.
- Storing the leader key in the DCS enforces consensus about the primary node and avoids multiple masters.

**Drawbacks:**

- It is unable to detect a misconfigured replica node.
- It requires manual intervention in a few cases, such as when the Patroni process itself fails.
- It requires a separate DCS application, which must be configured by the user. DCS requires two open communications ports in addition to the main Patroni port.
- Configuration is more complex than the other solutions.
- It uses more memory and CPU than the alternatives.

For more information on Patroni, see the [Patroni website and documentation](https://patroni.readthedocs.io/en/latest/) or [Patroni GitHub](https://github.com/zalando/patroni).

### Repmgr

[Repmgr](https://www.repmgr.org/) (stylized as repmgr) is a suite of open-source tools for managing PostgreSQL HA clusters. It works in conjunction with existing PostgreSQL functionality to configure replica nodes, monitor the HA cluster, and perform a failover when required. Like other solutions, repmgr supports one primary server for reads and writes and one or more read-only secondary nodes. In repmgr, the replicas are called *standby nodes*. Repmgr allows a cascading configuration, allowing one or more replicas to receive updates from another replica. The node providing the updates is known as an *upstream node* no matter what its role is.

Repmgr can be installed using the `apt` package. It includes a command line tool to configure the HA cluster, manually administer the nodes, and determine the status of each server. Configuration is provided using the repmgr configuration file. Each node in the HA cluster must be registered as a primary or standby server. The primary should be registered first. This allows for the cloning of standby nodes. Repmgr creates its own schema within the PostgreSQL database to store all information about the nodes and HA cluster. It requires SSH connections between the nodes to manage these activities.

The other repmgr component is a daemon to actively monitor the servers and performs a switch when necessary. The daemon is also in charge of sending notifications and alerts. It is able to detect failures of a primary or standby node. If the primary fails, repmgr attempts to reconnect to it. If this fails, it performs a failover and promotes one of the standby servers. It fences off a failed primary in case it unexpectedly comes online again. Repmgr uses a *witness server* to cast a deciding vote for the primary server election in certain situations after a switchover.

**Advantages:**

- It is a free open-source suite.
- It provides full administrative control over the HA cluster. Users can promote a standby to become the primary node, perform a manual switchover, and use the dry run option.
- The repmgr daemon can perform an automatic switch to one of the standbys.
- It supports automatic notification for a series of predefined events.
- It uses a `location` parameter to handle split-brain events. In the event of a failure, repmgr attempts to promote a standby in the same location as the primary.
- It uses an independent witness server to optimize the primary election process and avoid contention.
- It does not require additional ports for communication.
- It is robust and features good performance.

**Drawbacks:**

- It cannot fully manage all resources and might require manual intervention to restart a failed node after some failures.
- It cannot detect misconfigured nodes and can sometimes believe a misconfigured node is an available standby node.
- It cannot automatically restore a node to a healthy state.
- If the primary server is isolated from the other nodes in the same location, two nodes can both be designated the master. This can result in a split-brain situation, requiring manual intervention.

For more information on repmgr, see the [repmgr documentation](https://www.repmgr.org/docs/current/getting-started.html).

### pg_auto_failover (PAF)

The [PAF](https://pg-auto-failover.readthedocs.io/en/main/) project is a PostgreSQL extension for monitoring and managing high availability. Unlike the other HA cluster managers, it requires at least three nodes to work properly. The network requires a primary node, at least one secondary node, and a monitor node. The monitoring node verifies the condition of each node using regular health checks. It manages any switchover events using a finite state machine. PAF refers to the combination of the three nodes as a *formation*. The primary and secondary nodes are responsible for advertising any status changes to the monitor.

PAF leverages PostgreSQL functionality, implementing a *keeper agent* process on each node. It uses the Pacemaker resource manager to monitor the system resources and database health. However, users must initialize and configure all nodes in the formation before using PAF. They must also provide a recovery template file for each node. The multi-standby solution supports a more granular configuration, including a replication quorum and a candidate priority for each node. PAF mandates synchronous replication to eliminate the possibility of data loss in the event of a switchover. If the monitor server becomes inactive, replication can still occur, but the replication process changes to asynchronous mode.

**Advantages:**

- It accounts for latency in determining node status. Secondary nodes with significant lag cannot be considered as potential primaries. This helps prevent data loss.
- It uses synchronous streaming to guarantee a lossless switchover.
- The use of a monitor allows PAF to avoid split-brain scenarios.
- It allows administrators to assign each node a candidate priority value, allowing some control over the primary election.
- It can enforce a quorum before enabling high availability.
- It allows users to initiate a manual switchover.
- It automatically restores the HA cluster to a stable state after a failure is resolved.
- It does not depend on any external components other than PostgreSQL.
- It uses IP address failover to manage a manual switchover, which does not involve rebooting the current primary.
- It is a fully-distributed solution, allowing administrative actions from any node.
- It does not require manual intervention in most failure scenarios. PAF can automatically restart a failed or stopped PostgreSQL process.
- It allows users to manage service dependencies.

**Drawbacks:**

- The monitor node is a single point of failure. If it fails, an automatic failover can no longer occur.
- It requires a monitor node. This increases the cost and complexity of the solution.
- It requires extra UDP ports to be opened.
- It does not automate the initial PostgreSQL configuration.
- It does not include a REST API.
- It cannot detect a misconfigured standby node.
- It does not support *Network Address Translation* (NAT).

Additional information can be found on the [pg_auto_failover site](https://pg-auto-failover.readthedocs.io/en/main/) or [pg_auto_failover GitHub](https://github.com/hapostgres/pg_auto_failover/blob/main/docs/index.rst).

## Comparing the Replication Managers

Despite their differences, all three alternatives are credible PostgreSQL replication managers. They enable high availability, demonstrating good performance in various failure scenarios. Many businesses could successfully deploy any of these applications. For larger organizations, the correct choice depends on network and business requirements. These include configurability, usability, performance, and ease of integration into automated pipelines.

Patroni has the most features and is the most powerful replication manager. It is highly configurable and customizable, does not require much manual intervention, and has good performance in most failure scenarios. Due to its powerful REST API, it is the best choice for large organizations and for integration into an automated infrastructure pipeline. However, some users might find it difficult to configure and use. It also requires an additional distributed configuration store, which increases complexity.

PAF has fewer features, but it is easier to use and performs very well in a wide range of failover and manual switchover scenarios. It automatically recovers from most failures and rarely requires manual intervention. PAF does not automate PostgreSQL installation and configuration, so it is not as useful in an automated setting. In addition, the requirement for a monitor node increases infrastructure costs and configuration demands. Overall, it is a well-balanced solution and a solid choice for a smaller organization in search of a reliable solution.

The repmgr suite is a robust solution that has been around for a longer period of time. As a result, it is well-hardened and its capabilities are well-known. It does not require extra servers or additional network components. This makes it a good choice for administrators who want to deploy a streamlined solution. Unfortunately, it can be difficult to use and there are some scenarios where it requires manual intervention. Repmgr is the application used by the Akamai Marketplace PostgreSQL HA cluster solution. This is a good choice for users who want an easy hands-off GUI-driven deployment.

## Conclusion

PostgreSQL databases often benefit from a high availability architecture, which adds resiliency and redundancy to the primary database host. Several architectures are available, but synchronous streaming replication minimizes data loss and is the most reliable. A PostgreSQL high availability solution using the repmgr tool suite can be easily configured through the Akamai marketplace. For a manual deployment, three replication management solutions are available. Patroni is the most powerful and fully-featured of the options. However, the flexible and intuitive pg_auto_failover framework and repmgr are also good choices.