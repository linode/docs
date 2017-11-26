---
author:
  name: Phil Zona
  email: docs@linode.com
description: 'Introduction to high availability concepts'
keywords: ["high availability", "hosting", "website", "failover"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-07-12
modified: 2016-07-12
modified_by:
  name: Phil Zona
title: 'Introduction to High Availability'
external_resources:
- '[Fault Tolerance](https://en.wikipedia.org/wiki/Fault_tolerance)'
---

## What is High Availability?

High availability (HA) is a term that describes a website or application with maximum potential uptime and accessibility for the content stored on it. While a more basic system will be adequate to serve content to a low or medium number of users, it may include a single point of failure. This means that if one server goes down, whether due to traffic overload or any number of other issues, the entire site or application could become unavailable.

Systems with high availability avoid this problem by eliminating single points of failure, which prevents the site or application from going down when one component fails.

## What High Availability is Not

High availability does **not** mean your site or application will never go down. Although it provides a number of failsafes, and aims for a 99.999% uptime, no system is perfect. Availability will still depend on the number of components, their configuration settings, and the resources allocated to each component. While high availability solutions offer your site or application greater uptime than a single host, remember that the system is only equal to the sum of its parts.

However, because highly available systems are made up of so many components, they can be scaled horizontally when needed, thus improving their ability to serve content.

## How High Availability Works

To create a highly available system, three characteristics should be present:

1.  Redundancy
2.  Monitoring
3.  Failover

In general, a high availability system works by having more components than it needs, performing regular checks to make sure each component is working properly, and if one fails, switching it out for one that is working.

### Redundancy

In computing, *redundancy* means that there are multiple components that can perform the same task. This eliminates the single point of failure problem by allowing a second server to take over a task if the first one goes down or becomes disabled. Because the same tasks are handled by multiple components, *replication* is also critical. In a replicated system, the components that handle the same tasks communicate with one another to ensure that they have the same information at all times.

For example, suppose you have a LAMP stack running a website hosted on a single Linode. If the database in the LAMP stack were to stop working, PHP may be unable to perform queries properly, and your website will be unavailable to display the requested content or handle user authentication.

In a highly available configuration, however, this problem is mitigated because the databases are distributed across several servers. If one of the database servers becomes disabled for any reason, data can still be read from one of the others, and because the databases are replicated, any one of them can serve the same information. Even if one database becomes disabled, another can take its place.

### Monitoring and Failover

In a highly available setup, the system needs to be able to *monitor* itself for failure. This means that there are regular checks to ensure that all components are working properly. *Failover* is the process by which a secondary component becomes primary when monitoring reveals that a primary component has failed.

To expand on the example above, suppose your database stops working, disabling your website. The reason the website becomes disabled in this example is because there is no backup database from which to read information. However, even if there were a backup database, the system needs a way to know that it failed, and to enable the backup for requests for information.

In a highly available setup, regular checks are performed to ensure that the primary database is working properly. If a check results in an error, meaning that the primary database has become disabled, the system fails over. This means that database requests are sent to a secondary database instead, and because the secondary database has been replicated to include the same information, there is no disruption in service.

## Elements of High Availability

In this section, we'll go over the function of each component of the high availability configuration, and explain how the pieces work together. There are a number of combinations of software to perform each task in a high availability configuration, and the software mentioned in this section serves as just one possible solution to creating a highly available site or application.

The concepts discussed here are specifically geared toward the configuration described in our guide on how to [host a website with high availability](/docs/websites/host-a-website-with-high-availability), but will apply to highly available systems in general. The  diagram below shows the configuration we use in our guide.

[![High availability server configuration](/docs/assets/high-availability-diagram.png)](/docs/assets/high-availability-diagram.png)

### File System

In order to store uploads and plugins, your site will need a networked file system. Our high availability guide uses [GlusterFS](https://www.gluster.org/).

In a high availability setup, a *distributed replicated volume* is used to store files. You can think of the volume as the entire shared file system across all servers. The volume is made up of *bricks*, which are the shared file directories on any one server.

In our configuration, a cluster of three GlusterFS nodes are configured to replicate data across a given volume, which is then mounted onto each Apache application server. Because the volume is replicated across three nodes, it is redundant. One of the advantages of using GlusterFS for the file system cluster is that it handles monitoring and failover by default, making it an excellent choice when building a highly available system.

### Database

The database stores the content and user credentials for your site. In our guide, we use [Percona XtraDB](https://www.percona.com/software/mysql-database/percona-server/xtradb), but other database management systems work in a similar way. A database is particularly important when using a CMS like Wordpress, as it stores the information that makes up your pages and posts.

In our configuration, the database nodes are a cluster of Percona XtraDB servers, using Galera for replication. Galera offers *synchronous replication*, meaning data is written to secondary database nodes at the same time as it's being written to the primary. This method of replication provides excellent redundancy to the database cluster because it avoids periods of time where the database nodes are not in matching states. Galera also provides *multi-master replication*, meaning any one of the database nodes can respond to client queries.

Our configuration also uses [XtraBackup](https://www.percona.com/software/mysql-database/percona-xtrabackup), an efficient method of *state snapshot transfer*. This means that when a new node joins the cluster, the node from which it's syncing data (the donor) is still available to handle queries. This not only helps with efficiency in the initial setup, it also allows nearly seamless horizontal scaling as your needs grow.

### Web Server

Web servers monitor for requests for web content, and serve them accordingly. Our guide uses [Apache HTTPD](https://www.apache.org/), but other web servers like nginx and lighttpd will fill this role as well.

In most setups, the web server will read from a database to generate its content and write to a database if a form is filled out. On a dynamic website or application, the database is crucial to fulfilling web requests. The web server also stores software, such as Wordpress, and plugins within the file system.

The Apache server in our configuration specifies its *document root*, or the location from which it serves content, as the mountpoint for our Gluster file system cluster. In doing this, Apache serves certain files (such as images and CMS assets) not from the server it is running on, but from a separate highly available cluster of nodes. Each Apache node works the same way, so there are three available web servers that can all read from any of three replicated file servers.

Apache's communication with the database nodes works in a similar way. Because the database cluster has multiple masters, any one of the databases can respond to queries from Apache. Because of its synchronous replication, when Apache writes to one database, the others are updated in real time to serve requests from any of the other Apache servers.

### Failover

*Failover* is the process by which one node takes over the job of another in the event that one becomes disabled. This comes as a result of monitoring for failures by the system.

While GlusterFS handles monitoring and failover itself, a separate service is needed for the database cluster. For this, we use [Keepalived](http://www.keepalived.org/) with a *floating IP address*. The floating (or virtual) IP address is simply a private IP address that can be reassigned between nodes as needed when one fails.

Keepalived uses *virtual router redundancy protocol*, or VRRP, to automatically assign the floating IP address to any of the database nodes. The keepalived service uses user-defined rules to monitor for a certain number of failures by a database node. When that failure threshold is met, keepalived assigns the floating IP address to a different node so that there is no interruption to the fulfillment of requests while the first node waits to be fixed.

### Load Balancing

The load balancing component of a high availability system is one of its most important components, acting as the first barrier to handle traffic from users to the application servers. Without a load balancer, your site would be hosted on three application servers that have no way of assigning priority among themselves.

Our solution to load balancing is the [NodeBalancer](/docs/platform/nodebalancer/getting-started-with-nodebalancers), a highly available component that will evenly distribute incoming traffic to one of the three application servers, ensuring that no single server experiences a much heavier load than the others.

The NodeBalancer is critical because it provides a single point of access without a single point of failure. It offers backend monitoring, and failover at the top level of the highly available system (the bottom level is handled by Gluster FS and Keepalived).

## Overview

A system must offer redundancy, monitoring, and failover on each service in order to be highly available. In our configuration, the NodeBalancer offers monitoring and failover for the three (redundant) application servers. The application servers read from clusters of three database and three file system nodes, which are replicated, making them redundant. Monitoring and failover are each handled separately for these clusters, ensuring that the failure of any one service does not affect the availability of the entire system.

Now that you understand high availability, you can begin to apply its concepts when designing your own systems and setting up your own hosting configurations. If you're ready to get started right away, check our guide to [hosting a website with high availability](/docs/websites/host-a-website-with-high-availability) for instructions on how to set up the system described above.
