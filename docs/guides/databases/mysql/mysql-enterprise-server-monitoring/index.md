---
slug: mysql-enterprise-server-monitoring
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide introduces MySQL Enterprise Server Monitoring and it's features.'
keywords: ['MySQL Enterprise Monitor', 'Replication Monitoring', 'Disk Monitoring', 'Backup Monitoring']
tags: ['mysql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-13
modified_by:
  name: Linode
title: "MySQL Enterprise Server Monitoring"
h1_title: "Introduction to the MySQL Enterprise Server Monitoring"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

Once a MySQL **Enterprise Edition** version is installed and placed into use, the monitoring of a MySQL instance becomes extremely important. Monitoring establishes important vital statistics about your application, network, and database server, and allows system administration teams to resolve issues much more rapidly. Monitoring application and system metrics such as memory allocation, disk utilization, and CPU usage enhance a system administrator’s ability to resolve bottlenecks and root causes of the problems.

## Available Tools

To monitor MySQL Enterprise Edition (commercial edition), you can use the *Enterprise Monitor*, which is available with this Edition. For all users of the free MySQL community-based version, MariaDB or Percona Server, MySQL Enterprise Edition is not available. The less robust *ClusterControl* product can provide access to the monitoring of MySQL in its free community version. The use of ClusterControl is not discussed in this article.

Most importantly, the MySQL Enterprise Monitor serves as an automated assistant for MySQL database administrators. This application/service is designed to help administrators with their day-to-day responsibilities by monitoring MySQL servers and identifying potential key problems. The monitor’s features are designed to save the database administrator time and effort by providing the information he or she needs through a simplified interface.

## Features of MySQL Enterprise Monitor

MySQL Enterprise Monitor runs on a variety of Linux, Microsoft Windows, and Apple macOS platforms. It is one of the oldest monitoring products for MySQL on the market and is available as part of a commercial enterprise subscription agreement from Oracle Corporation.

MySQL Enterprise Monitor offers a plethora of robust monitoring features including cloud-based remote monitoring, real-time health, and availability monitoring, real-time performance monitoring, visual query analysis, MySQL cluster monitoring, InnoDB (storage engine) monitoring, replication monitoring, memory monitoring, disk monitoring, operating systems monitoring, security monitoring, security administration, and backup monitoring. Each of the aforementioned features is described in the following sections.

### Easy to Setup and Configure

Enterprise Monitor works "right out of the box" and does not require any configuration of client agents to be installed. Global policies can be specified, and then tweaked for custom groups. An artificial intelligence-like set of 14 Advisor Groups and 225+ Advisors provide automated expert guidance in a myriad of areas, such as *poor indexing*, *blocking*, *concurrency*, *long-running processes*, etc. User-defined custom advisors can also easily be created as well.

Additionally, trends for individual servers, groups, or entire topologies are historically recorded and can be accessed at any time, which lends itself as a source for problem resolution. Rules and alerts dynamically adapt to infrastructure changes, using both SMTP and SNMP with customizable thresholds. Finally, role-based access control allows one to fine-tune who has access to a particular set of monitoring assets available.

Once the monitored MySQL instances are configured, you can begin to look at the collected data that is aggregated. This makes it easier to find any unexpected patterns, which can subsequently be drilled down, to determine specific problems or display metrics.

### Cloud-Based Remote Monitoring

MySQL Enterprise Monitor can monitor any or all cloud-based, "mysqld" instances without the requirement for a remote agent.

### Real-Time Health and Availability Monitoring

This feature of MySQL Enterprise Monitor determines the ability to meet time-based SLAs, and monitors the health of the database server with configurable alerts for important events, using both SMTP and SNMP with customizable thresholds. Following is one of the more standard monitoring screens:

[![enterprise_server_monitoring](Real_time_Health.png “Real-time Health and Availability Monitoring")](Real_time_Health.png)

### Real-Time Performance Monitoring

Real-time performance monitoring allows one to obtain database performance metrics, alerting of queries that do not meet certain thresholds, user resource utilization, maximum connection alerts, alerts of processes taking too long to complete, alerts of too many concurrent queries executing on a given server, and alerts as to when queries block other queries. The following screen describes connection and query information:

[![enterprise_server_monitoring](real_time_performance.png “Real-time Performance Monitoring")](real_time_performance.png)

**Visual Query Analysis:**

The *Query Analyzer* portion of the MySQL Enterprise Monitor enables one to monitor the statements being executed on a server and retrieve information about the query, the number of executions, and the execution times of each query. This helps identify problematic queries and bottlenecks. Query Analyzer works by intercepting the SQL statements that your MySQL client application sends to the MySQL server. Queries are routed through the MySQL Enterprise Monitor Agent, the agent/proxy forwards the queries to the server and sends the reply back to the client application. In addition to forwarding the queries, the agent/proxy also normalizes the queries and then supplies the execution information about each query to the monitor. The following is a sample high-level query screen where you can subsequently drill each row:

[![enterprise_server_monitoring](visual_query_analysis.png “Visual Query Analysis")](visual_query_analysis.png)

**MySQL Cluster Monitoring:**

MySQL Enterprise Cluster Monitoring includes key metrics on cluster operations such as cluster topology, cluster health, data and index memory utilization on a per cluster node basis, and usage of cluster files and buffers as they pertain to logs. Following is a sample screen view of overall cluster utilization:

[![enterprise_server_monitoring](mySQL_Cluster_Monitoring.png “mySQL Cluster Monitoring")](mySQL_Cluster_Monitoring.png)

### InnoDB Monitoring

MySQL Enterprise Monitor provides detailed InnoDB monitoring, which is the storage engine for MySQL. InnoDB monitoring includes engine metric performance, suggestions on the configuration of InnoDB based on current and historical performance, identification of any locking issues, buffer pool management, and alerts when index usage requires revamping. Following is a sample InnoDB monitoring screen:

[![enterprise_server_monitoring](innoDB_Monitoring.png “innoDB Monitoring")](innoDB_Monitoring.png)

### Replication Monitoring

Replication Monitoring includes displaying MySQL Replication Instrumentation and the latest replication enhancements including *Group Replication*, InnoDB clusters, multi-source replication, global transaction identifier (GTID), and semi-synchronous replication. It also displays replication topology monitoring of live performance and detection of bottlenecks, the health of all replicated environments, and detection of replication lag, where a replicated node has fallen significantly behind the source node. Following is a sample screen that displays a replication topology:

[![enterprise_server_monitoring](Replication_Monitoring.png “Replication Monitoring")](Replication_Monitoring.png)

### Memory Monitoring

Memory Monitoring is extremely valuable in identifying MySQL memory usage and also displaying memory utilization at the operating system level. It issues alerts when memory utilization is overly high, and also provides advice on reducing memory footprints based on current and historical data points. Following is a portion of a sample Memory Utilization screen:

[![enterprise_server_monitoring](Memory_Monitoring.png “Memory Monitoring")](Memory_Monitoring.png)

### Disk Monitoring

Disk I/O Monitoring provides a window into the live disk I/O being performed, and the longer-term analysis based on usage. Additionally, it provides suggestions on possible configuration changes that can be made to reduce disk I/O and the amount of disk space consumed on the disk.

### Operating System Monitoring

MySQL Enterprise Monitor offers a significant window into overall operating system performance. This includes auto-discovery of any MySQL instances, the monitoring of key performance metrics(current and trend) for host machines, overall CPU utilization with alerts, memory swapping with alerts, network traffic associated with all ethernet devices, and memory threshold detection.

### Security Monitoring

MySQL Enterprise Monitor offers security monitoring of firewall activities, by alerting potential security concerns to guard against any possible infiltration of data.

### Security Administration

MySQL Enterprise Monitor provides account management alerts for database accounts that have weak or no passwords, or for accounts that have overly wide-open attributes. Additionally, alerts are provided when network connectivity problems occur, or if there are any indications of a potential system intrusion.

### Backup Monitoring

Backup scheduling and monitoring are necessary aspects of any database installation, to preserve data in the event of database corruption or required rollbacks. MySQL Enterprise Monitor offers a comprehensive backup solution, as it provides Monitor backup status, and history and archive details by group or instance. Additionally, it provides alerts if a backup fails or if the last database backup is arbitrarily (user-defined) too old. Moreover, alerts are generated if a backup attempt causes any locking or performance issues for MySQL. Finally, the ability to provide backup history including the backup type (full, partial, etc.), its completion status, and the completion timestamp is accessible. Following is a sample screen from the Database Backup dashboard:

[![enterprise_server_monitoring](Backup_monitoring.png “Backup monitoring")](Backup_monitoring.png)

## Conclusion

MySQL Enterprise Monitor is a diverse and robust tool that enables any MySQL Enterprise Edition installation to be configured, monitored, and fine-tuned. Many high-level metrics can be observed and managed through the use of Enterprise Monitor, as well as the detailed aspects of
database utilization down to the user or query level.
