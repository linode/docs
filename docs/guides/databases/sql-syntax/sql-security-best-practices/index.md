---
slug: sql-server-security
author:
  name: Doug Hayman for NanoHertz Solutions Inc.
description: "Learn about the SQL Server security best practices and guidelines to keep your server and data safe. For example, disable unused ports and SQL Server features."
keywords: ['sql server security']
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)"
published: 2022-05-27
modified_by:
  name: Linode
title: SQL Server Security Best Practices
h1_title: "Part 1: SQL Server Security Best Practices"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

SQL Server security is perhaps one of the most overlooked facets of database server maintenance. Without taking the necessary precautions, an instance of SQL Server can be ripe for abuse and failure.

The [SQL Database Security: User Management](/docs/guides/sql-security/) guide discussed the logical implementation of users, groups, roles, and permissions, to enhance, or limit database user security. This guide is part one in a series of SQL Server security best practices, and it discusses a variety of important additional maintenance security topics.

{{< note >}}
To review the second set of security recommendations in this series, visit [Part 2: SQL Server Security Best Practices](/docs/guides/sql-server-security-part-2/).
{{< /note >}}

## SQL Server Security: Infrastructure

A very big part of SQL Server security is the physical security associated with the location of the SQL Server database. For SQL Server physical security, you consider things such as the safety and access of the data center, and other physical aspects associated with the server that the database resides on. For example, data center access can be controlled by things like human guards, keys, smart card access, face recognition software, and fingerprint readers.

Data centers not only need to protect the servers where SQL Server resides, but other pieces of infrastructure. It may include things like modems, hubs, routers, storage arrays, and physical firewall devices. Physical security requires dealing with hardware devices, software (firewalls, operating systems, layered products), and network infrastructure, and keeping them at arms-length from humans, hackers, and any potential natural disasters (floods, hurricanes, power outages, etc).

A person in charge of physical security must deal with things such as 24x7 security guards, climate control monitoring (extreme hot or extreme cold can affect equipment adversely), fire detection and suppression systems, water leakage detection mechanisms, ensuring that necessary equipment is plugged into Uninterruptible Power Supply (UPS), and the scheduling of both hardware and software preventative maintenance.

One advantage to hosting a SQL Server in the cloud is that the cloud infrastructure provider is responsible for the physical security of the server hardware.

## SQL Server Security: Operating System and Applications

Next on the list of security issues is the operating system that SQL Server resides on. SQL Server supports both Microsoft Windows and several flavors of Linux. There are many precautions that you must take to protect your operating system from hackers, viruses, and bugs. This could otherwise affect the functioning, access to, and integrity of SQL Server.

First and foremost, operating system upgrades and (security) patches should always be applied whenever they become available. Before applying them to production-level machines, it may be prudent to apply them first to test or development environments, and allow them to run for a period of time. This ensures that the upgrades and patches are stable and are not problematic. Moreover, when an operating system goes end-of-life, it should always be replaced with a supported operating system version.

It is a good practice to disable public internet access on your servers, to mitigate outside hacking interference. This can be followed by implementing robust firewalls on your operating system. By defining the appropriate firewall rules, you can restrict access to and from database servers that run on your server. You can also limit database access only to specific applications. Some popular firewall options for Linux servers are [UFW](/docs/guides/configure-firewall-with-ufw/), [nftables](/docs/guides/how-to-use-nftables/), and [FirewallD](/docs/guides/introduction-to-firewalld-on-centos/). You can also [add the free Linode Cloud Firewalls service](/docs/products/networking/cloud-firewall/guides/create-a-cloud-firewall/) to the Linode Compute Instance that hosts SQL Server.

Additionally, it is extremely good practice to remove unnecessary and unused applications from your server. This includes unwanted operating system features (for example, email or FTP) that could potentially lend itself to a security threat.

Finally, you can make use of SQL Server’s [*Extended Protection for Authentication*](https://docs.microsoft.com/en-us/dotnet/framework/wcf/feature-details/extended-protection-for-authentication-overview) option to prevent an authentication relay attack that exploits service and channel binding.

{{< disclosure-note >}}
By default, SQL Server's Extended Protection is turned off. You can enable it on a Windows-based client that is connected to the SQL Server by following the steps below:
1. Select All Programs.
1. Select Microsoft SQL Server 200X.
1. Select **Configuration Tools** and select **SQL Server Configuration Tools**.
1. Select **SQL Server Configuration Manager**.
1. Click **SQL Server Network Configuration** and right-click on **Protocols for MYSQLServer**.
1. Go to **Advanced** and from the **Extended protection**, select **Allowed**.
{{< /disclosure-note >}}

## Securing Server Ports

Another important security measure is to close all unnecessary server ports via your firewall, and open up select ports, as necessary. For example, by default, SQL Server runs on port `1433`. Therefore, you can allow TCP port `1433` (and `3389` for remote server access) if no other application runs on the server. Similarly, the [Microsoft Analysis Service](https://en.wikipedia.org/wiki/Microsoft_Analysis_Services) uses default port `2383` as a standard port. You should also audit any ports that are used by your development stack and make sure that only the necessary ports are enabled.

You may also consider changing SQL Server’s default listening port (`1433`) to another port number. By not changing it, this well-documented port number can be an invitation to hackers to infiltrate a SQL Server instance. For this reason, use a non-default port to solidify your SQL Server security. You can modify this very easily using the [SQL Server Configuration Manager](https://docs.microsoft.com/en-us/sql/relational-databases/sql-server-configuration-manager) tool.

## SQL Server Add-on Features

SQL Server consists of database engine features that may not be needed by every installation. Some of these components can be a potential target used by hackers to gain access to a SQL Server instance. Therefore, it is good common practice to disable the add-on components and features in SQL Server that are not used. This limits the chances of any potential hacker attack. Some of the features you may consider disabling are the following:

- **OLE Automation Procedures**: they enable SQL Server to leverage [Object Linking and Embedding (OLE)](https://en.wikipedia.org/wiki/OLE_DB) to interact with other [Component Object Model (COM)](https://en.wikipedia.org/wiki/Component_Object_Model) objects. From the data security standpoint, this area is more prone to attack.

- **Database Mail XPs**: enables the Database Mail extended stored procedures in the MSDB database.

- **Scan for startup procs**: an option to scan for automatic execution of stored procedures at Microsoft SQL Server startup time.

- **Common language runtime (CLR) integration feature**: provides various functions and services required for program execution, including just-in-time (JIT) compilation, allocating and managing memory, enforcing type safety, exception handling, thread management, and security.

- **Windows (not Linux) process spawned by xp_cmdshell**: Has the same security rights as the SQL Server service account, and spawns a Windows command shell and passes in a string for execution. Any output is returned as rows of text.

- **Cross-database Ownership Chaining**  (also known as cross-database chaining): A security feature of SQL Server that allows users of databases access to other databases besides the one they are currently using. Again, if you do not need a particular SQL Server feature, you can disable it.

## SQL Server Encryption

A huge area of security for SQL Server is encryption. SQL Server supports several different encryption mechanisms to protect sensitive data in a database. The different encryption options available are as follows:

- **Always Encrypted Option** - The *Always Encrypted* option helps to encrypt sensitive data inside client applications. The *always encrypted-enabled* driver automatically encrypts and decrypts sensitive data in the client applications. The encryption keys are never revealed to the SQL Server database engine. It does an excellent job of protecting confidential data.

- **Transparent Data Encryption (TDE)** - TDE offers encryption at the file level. TDE solves the problem of protecting data at rest, and encrypting databases both on the hard drive and consequently on backup media. It does not protect data in transit or data in use. It helps to secure the data files, log files, and backup files.

- **Column-Level Encryption** - Column-level encryption helps to encrypt specific column data; for example, credit card numbers, bank account numbers, and social security numbers.

## Data Masking

Data masking is a technique used to create a version of data that looks structurally similar to the original, but hides (masks) sensitive information. The version with the masked information can then be used for a variety of purposes, such as offline reporting, user training, or software testing.

Specifically, there are two types of data masking supported by SQL Server:

- **Static Data Masking** - Static Data Masking is designed to help organizations create a sanitized copy of their databases where all sensitive information has been altered in a way that makes the copy shareable with non-production users. With Static Data Masking, the user configures how masking operates for each column selected inside the database. Static Data Masking then replaces data in the database copy with new, masked data generated according to that configuration. Original data cannot be unmasked from the masked copy. Static Data Masking performs an irreversible operation.

- **Dynamic Data Masking** - Dynamic data masking helps to limit sensitive data exposure to non-privileged users. It can be used to greatly simplify the design and coding of security in your application. Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to specify how much sensitive data to reveal with minimal impact on the application layer.

## Conclusion

Database security is an extremely important part of database design, operations, and maintenance. It includes things such as physical security, operating system and application maintenance, disabling of superfluous features, port maintenance, encryption, and data masking. Collectively, and if addressed properly, these measures help keep a SQL Server database free from attack, operationally sound, and ensure database integrity.

This guide was the first in a series of articles concerning SQL Server security best practices. Visit [Part 2: SQL Server Security Best Practices](/docs/guides/sql-server-security-part-2/) for the next security recommendations in this series.
