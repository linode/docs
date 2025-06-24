---
slug: introduction-to-high-availability
title: 'Intro to High Availability and Disaster Recovery'
description: 'This guide provides you with an introduction to concepts and terminology relating to high availability, a method of keeping your web servers up with maximum uptime.'
authors: ["Phil Zona", "Kazuki Fukushima", "Nathan Melehan"]
contributors: ["Phil Zona", "Kazuki Fukushima", "Nathan Melehan"]
published: 2016-07-12
keywords: ["high availability", "hosting", "website", "failover", "ssd ha"]
tags: ["web server","monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Fault Tolerance](https://en.wikipedia.org/wiki/Fault_tolerance)'
aliases: ['/websites/introduction-to-high-availability/','/websites/hosting/introduction-to-high-availability/']
---

Designing applications with *high availability (HA)* and *disaster recovery* strategies in mind is essential for minimizing downtime and maintaining business continuity during infrastructure maintenance, upgrades, or temporary outages. This guide provides **Akamai Cloud Computing customers** with actionable strategies and architectural guidance to build resilient and highly available systems using Akamai.

## What is High Availability?

High availability (HA) is a term that describes a website or application with maximum potential uptime and accessibility for the content stored on it. While a more basic system will be adequate to serve content to a low or medium number of users, it may include a single point of failure. This means that if one server goes down (because of traffic overload, application failures, etc) the entire site or application could become unavailable. Systems with high availability avoid this problem by eliminating single points of failure, which prevents the site or application from going down when one component fails.

High availability does **not** mean your site or application will never experience downtime. The safeguards in a highly available system can offer protection in a number of scenarios, but no system is perfect. The uptime provided by an HA architecture is often measured in percentages, like 99.99%, 99.999%, and so on. These tiers of uptime depend on variables in your architecture, like the number of redundant components, their configuration settings, and the resources allocated to each component. Some of these variables, like the compute resources for a given server, can be [scaled](#scaling) to accomodate spikes in traffic.

Some scenarios, like natural disasters or cyber attacks, may disrupt a highly-available system entirely. In these situations, [disaster recovery](#disaster-recovery) strategies should be implemented.

### How High Availability Works

To create a highly available system, three characteristics should be present:

1.  [Redundancy](#redundancy)
1.  [Monitoring](#monitoring-and-failover)
1.  [Failover](#monitoring-and-failover)

In general, a high availability system works by having more components than it needs, performing regular checks to make sure each component is working properly, and if one fails, switching it out for one that is working.

## What is Disaster Recovery?

Disaster recovery is a process that is employed in the event of a wider-ranging outage of an organization's systems. These might occur because of cyber attacks, natural disasters, human error, and other reasons. An organization follows a disaster recovery plan to restore service and data for the systems that have experienced downtime and/or data loss.

A disaster recovery plan documents key information and procedures that should be adhered to in these scenarios. This can include lists of staff that are responsible for the plan, inventories of systems and software, activation of backup sites and systems, criteria that should be met during the recovery operation (including [RTO and RPO](#rtorpo)), and other considerations.

## High Availability Architecture

This section describes an example of a high availability architecture that features a WordPress website running in a single data center. There are redundant copies of each component in the architecture, and the health of each set of components is continually monitored. If any component fails, automatic failover is triggered and other healthy components are promoted.

{{< note >}}
This specific architecture is implemented in the [host a website with high availability](/docs/guides/host-a-website-with-high-availability/) guide. While some of the technologies used are specific to this example, the concepts can be more broadly applied to other HA systems.
{{< /note >}}

![High availability server configuration](high-availability-diagram.png)

1. A user requests a page from the WordPress website. The user's DNS servers return the address of a NodeBalancer in an Akamai Cloud compute region.

1. The NodeBalancer routes traffic to a cluster of application servers running the Apache web server and WordPress.

1. Apache serves a file from the document root (e.g. `/srv/www/`). These files are not stored on the application server, but are instead retrieved from the networked GlusterFS filesystem cluster.

1. When a WordPress plugin is installed, or when an image or other asset is uploaded to WordPress, it is added to the document root. When this happens in this architecture, the application server actually adds these files to one (and only one) of the servers in the GlusterFS cluster. GlusterFS then replicates these changes across the GlusterFS cluster.

1. WordPress PHP files from the document root are executed by the application server. These PHP files make requests on a database to retrieve website data. These database requests are fulfilled by a cluster of database servers running Percona XtraDB. One database server within the cluster is the master, and requests are routed to this server.

1. The database servers use the Galera software to replicate data across the database cluster.

1. The Keepalived service runs on each database server and monitors for database failures. If the master database server fails, the Keepalived service reassigns its private IP address to one of the other databases in the cluster, and that database starts responding to requests from WordPress.

### Systems and Components

- **NodeBalancer**: An [Akamai load balancer service](https://techdocs.akamai.com/cloud-computing/docs/nodebalancer). NodeBalancers can evenly distribute incoming traffic to a set of backend application servers.

    The NodeBalancer in this architecture continually monitors the health of the application servers. If one of the application servers experiences downtime, the NodeBalancer stops sending traffic to it. The NodeBalancer service has an internal high-availability mechanism that reduces downtime for the service itself.

- **Application server cluster**: A set of three servers running Apache and WordPress. WordPress relies on a database to dynamically render posts and pages.

    Apache's `/srv/www/` document root folder on each application server is *mounted* to a *volume* from the GlusterFS cluster. This means that the files in the document root folder are not stored on the application server itself, but are instead stored on a separate cluster of servers running a networked filesystem called GlusterFS. When such a file is requested, it is retrieved from the GlusterFS cluster.

- **GlusterFS cluster**: A set of three servers running GlusterFS, a networked filesystem. The servers store a GlusterFS *volume*, the contents of which are replicated across the cluster. GlusterFS handles monitoring and failover by default.

    GlusterFS continually monitors the contents of the volume across the GlusterFS cluster. If any files are added/removed/modified files to the volume on one of the servers, those changes are automatically replicated to the other GlusterFS servers.

- **Database cluster**: A set of servers running the Percona XtraDB database cluster software, Galera, Xtrabackup, and Keepalived.

    Galera is used for replication, and it offers *synchronous replication*, meaning data is written to secondary database nodes at the same time as it's being written to the primary. This method of replication provides excellent redundancy to the database cluster because it avoids periods of time where the database nodes are not in matching states. Galera also provides *multi-master replication*, meaning any one of the database nodes can respond to client queries.

    [XtraBackup](https://www.percona.com/software/mysql-database/percona-xtrabackup) is used for *state snapshot transfer*. This means that when a new node joins the cluster, the node from which it's syncing data (the donor) is still available to handle queries. This not only helps with efficiency in the initial setup, it also allows nearly seamless horizontal scaling as your needs grow.

    Keepalived uses *virtual router redundancy protocol*, or VRRP, to automatically assign the failover IP address to any of the database nodes. The keepalived service uses user-defined rules to monitor for a certain number of failures by a database node. When that failure threshold is met, keepalived assigns the failover IP address to a different node so that there is no interruption to the fulfillment of requests while the first node waits to be fixed.

## Disaster Recovery Architecture

![Disaster recovery architecture](disaster-recovery-architecture.jpg)

1. EdgeDNS resolves client request's domain to CNAME in Akamai GTM
1. Client DNS requests route/addresses from Akamai GTM
1. Traffic to Kubernetes cluster in one of two regions
1. NodeBalancer acts as Kubernetes ingest
1. Directs traffic to a pod within the cluster
1. Pod makes DB requests on DB
1. DB contents are replicated to DB in second region

### Systems and Components

## High Availability and Disaster Recovery Concepts

### Redundancy

In computing, *redundancy* means that there are multiple components that can perform the same task. This eliminates the single point of failure problem by allowing a second server to take over a task if the first one goes down or becomes disabled. Some redundant components, like databases, need to also maintain equivalent sets of data in order to fulfill requests. To maintain equivalent data, [*replication*](#replication) is continually performed between those components.

Redundant components can work together through mechanisms like [load balancing](#load-balancing) and [monitoring and failover](#monitoring-and-failover).

Different kinds of redundancy can be considered:

- **Application redundancy**:

    Multiple instances of application servers that fulfill the same function can be run in parallel. These servers can collectively share the traffic service receives, which reduces the probability that a given server fails from being overburdened. If a server fails, the other servers can continue operating and maintain operation of the service.

    Multiple application server clusters can exist in a single HA system, including web server clusters, database clusters, and networked filesystems.

    **Kubernetes** offers a number of tools that make it simpler to maintain redundant components:

    - **Containerized applications**: Applications are packaged as *containers* that run in *pods*, and Kubernetes can quickly scale up and down the number of running pods.

    - **StatefulSets** maintain state consistency during restarts. [More on StatefulSets](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/).

    - **Deployments** provide a way to configure stateless applications. [More on Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

- **Data center infrastructure redundancy**:

    Each Akamai Cloud region corresponds to a single physical data center and does not provide built-in multi-site high availability. This means that in the rare event of a full data center outage, such as a total network failure, Linodes within that Cloud region may become temporarily inaccessible.

    Having said that, Akamai Cloud data centers are built with internal redundancy for critical infrastructure. For example:

    - **Power**: Facilities are equipped with backup generators and UPS systems to ensure power continuity during outages.

    - **Networking**: Core network components such as routers, switches, and BOLTs are designed with redundancy, allowing traffic to reroute automatically if a component fails.

- **Geography/region redundancy**:

    Highly available applications can be architected with redundancy *across multiple regions/data centers*. This can be useful for a number of reasons:

    - Running your application in multiple regions can distribute the load for your service across those regions.

    - If your system's user base is located across different regions, you can run your application in data centers closer to your users, reducing latency.

    - Maintaining backups in multiple regions protects against localized outages, data loss, and corruption.

### Monitoring and Failover

In a highly available setup, the system needs to be able to *monitor* itself for failure. This means that there are regular *health checks* to ensure that all components are working properly. *Failover* is the process by which a secondary component becomes primary when monitoring reveals that a primary component has failed.

There are different kinds of health checks that can be performed, including:

- **ICMP (Ping) checks**: Monitors basic network connectivity.
- **TCP checks**: Ensures responsiveness for most application-layer protocols.
- **HTTP(S) checks**: Used for web applications, and can verify that specific strings are present in the response body from a web server.

Akamai offers multiple tools to assist with monitoring and failover, including:

- **[NodeBalancers]()** performs health checks on a set of backend application servers within a data center, and can route traffic around backend servers that experience downtime.

- **Global Traffic Management (GTM)** continuously monitors the health of application clusters running in multiple regions. If a cluster fails health checks, GTM updates DNS routes for users in real-time and redirects traffic to healthy clusters.

### Load Balancing

The load balancing component of a high availability system acts as the first barrier to handle traffic from users to the application servers. Load balancing evenly distributes traffic among multiple backend servers, which reduces the chance that any given server fails from being overburdened.

Akamai offers multiple tools to assist with load balancing, including:

- Use [**Node Balancers**](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-nodebalancers#putting-the-nodebalancer-in-charge) to distribute traffic evenly across clusters within a data center.

- [LKE](https://techdocs.akamai.com/cloud-computing/docs/linode-kubernetes-engine) and Kubernetes-based load balancing simplifies traffic management and ensures consistent performance.

- [Akamai GTM](https://techdocs.akamai.com/gtm/docs/welcome-to-global-traffic-management) enables dynamic traffic routing based on real-time health checks and failover policies:

    - **Round-Robin** – Distributes traffic evenly between clusters.
    - **Weighted Traffic** – Directs more traffic to preferred clusters.
    - **Geo-Location Routing** – Routes traffic to the nearest cluster for reduced latency.
    - **Failover Mode** – Automatically redirects traffic if a cluster becomes unhealthy.

### Replication

- [**Akamai Object Storage**](https://techdocs.akamai.com/cloud-computing/docs/object-storage):  Enhance redundancy by [synchronizing bucket data across regions using rclone](https://www.linode.com/docs/guides/replicate-bucket-contents-with-rclone/) for robust data replication.

- [**Block Storage**](https://techdocs.akamai.com/cloud-computing/docs/block-storage): Use multi-attach or cross-AZ replication for persistent data.

- **Database Replication**:  Ensure automated backups and replication. Although known for its stability, MySQL is even more reliable if [source-replica replication is configured](https://www.linode.com/docs/guides/configure-source-replica-replication-in-mysql/)

- **Networked filesystems**, like GlusterFS.

### Distributed Application Design

* Use microservices and distributed architectures to minimize the impact of individual component failures.
* Design for **graceful degradation** so unaffected services remain available even if one component fails.

### RTO/RPO

Align your architecture with **Recovery Time Objective** (RTO) and **Recovery Point Objective** (RPO) requirements:

| Approach | RTO | RPO | Complexity | Cost | Use Case |
| ----- | ----- | ----- | ----- | ----- | ----- |
| **Backup & Restore** | Minutes to hours | Minutes to hours | Low | $ | Non-critical apps, dev/test environments |
| **Light/Warm Standby** | Tens of minutes | Seconds to minutes | Moderate | $$ | Faster recovery with minimal data loss |
| **Multi-Site Active-Active** | Near zero | Near zero | High | $$$$ | Mission-critical apps requiring real-time data sync |

For mission-critical apps, use **Multi-Site Active-Active** with Akamai GTM for real-time failover.

|  | Backup & Restore | Light | Warm Standby | Multi-Site |
| ----- | :---: | :---: | :---: | :---: |
| **RTO** | Minutes to Hours | Tens of minutes | Minutes | **Zero downtime** |
| **RPO** | Minutes to Hours | Seconds to Tens of minute | Seconds to Tens of Minute(s) | Near zero loss |
| **Cost** | **$** | **$$** | **$$$** | **$$$$** |
| **Architecture Complexity** | \* | \*\* | \*\*\* | \*\*\*\* |
| **Use Case** | Non-critical apps with tolerable downtime and data loss | Apps require faster recovery with minimal data loss | Critical apps require quick recovery with minimal data loss | Mission-critical apps requiring continuous availability and real-time data sync |
| **Auto-scaling** | None, manual provision | None, manual resizing | Yes, post-disaster | Yes |
| **Failover** | Manual restoration | Automated failover | Automated failover | Active-active  |
| **Data Replication** | Periodic backups | Log shipping or block-level replication | Async replication or block-level replication | Real-time multi-master replication |
| **Linodes Solutions** | Linode Backup Service (VM), Linode Object Storage for data backups | Linode Backup Service (VM) with scheduled automated backup, data replication at DB level | Warm standby VMs or standby LKE clusters. VM with cross-region data replication | Multi-region LKE clusters, Akamai GTM for traffic management |


### Anti-Affinity Groups

Use anti-affinity rules to spread workloads across multiple devices within the same data center, reducing the risk of correlated failures. In Akamai Cloud regions, these rules can be expressed with [placement groups](https://techdocs.akamai.com/cloud-computing/docs/work-with-placement-groups).

### Live Migrations

Akamai Cloud Computing supports [**Linode live migrations**](https://techdocs.akamai.com/cloud-computing/docs/compute-migrations) to minimize downtime during maintenance.

### Scaling

Scaling ensures performance and availability during increased demand:

* **Horizontal Scaling**  \- Add more instances of an application to handle load.
* **Vertical Scaling** \- Increase resource limits per instance.
* **Auto-Scaling** \- Configure LKE/Kubernetes to adjust resources based on load.

## Best Practices for Linode Maintenance

* Configure Akamai GTM for automated failover and geo-routing.
* Use Kubernetes StatefulSets and Deployments for resilience.
* Set up health checks and real-time monitoring.
* Implement multi-region storage- and database replication.
* Regularly test failover and disaster recovery plans

**References & further reading:**

* [https://www.linode.com/docs/guides/introduction-to-high-availability/](https://www.linode.com/docs/guides/introduction-to-high-availability/)
* [https://www.linode.com/docs/guides/host-a-website-with-high-availability/](https://www.linode.com/docs/guides/host-a-website-with-high-availability/)
* [https://www.linode.com/docs/guides/high-availability-wordpress/](https://www.linode.com/docs/guides/high-availability-wordpress/)
* [https://techdocs.akamai.com/cloud-computing/docs/configure-failover-on-a-compute-instance](https://techdocs.akamai.com/cloud-computing/docs/configure-failover-on-a-compute-instance)
* https://techdocs.akamai.com/cloud-computing/docs/high-availability-ha-control-plane-on-lke
* [https://techdocs.akamai.com/cloud-computing/docs/monitor-and-maintain-a-compute-instance](https://techdocs.akamai.com/cloud-computing/docs/monitor-and-maintain-a-compute-instance)