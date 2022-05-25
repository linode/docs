---
slug: sql-security-best-practices-part-2
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide you learn how to enhance the security of SQL server databases.'
keywords: ['SQL server authenication', 'Restrict SQL traffic', 'SQL Server Patches', 'Backups', 'Auditing']
tags: ['database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-24
modified_by:
  name: Linode
title: "SQL Security Best Practices Part 2"
h1_title: "Part 2: SQL Security Best Practices"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

SQL Server Security is perhaps one of the most overlooked facets of database server maintenance. In part one of the SQL Security Best Practices article, you learnt about the SQL server's physical security, operating system or application maintenance. You also learnt how to disable unnecessary features, encryption, and data masking to further enhance security.

In part two of this article series, you can further learn the additional security measures that can be taken to enhance SQL Server security.

## SQL Server Authentication

Protection of SQL Server data depends upon the ability to authenticate access to specific data. SQL Server provides two options for database authentication in a Windows or Linux environment: *Windows/Linux Authentication* and *SQL Server and Windows/Linux Authentication* (also known as Mixed-mode).

You are prompted to select one of the below SQL Server authentication modes during SQL Server setup.

**Windows or Linux Authentication Mode**:

In this mode, when an installer logs in using his Windows, or Linux account, SQL Server validates the account name, and password using the Windows, or Linux operating system. The
Windows or Linux authentication uses Active Directory (AD)accounts for authentications. Hence, you can have a centralized policy control for strong password complexity, password expiration, account lockout, and active directory groups in the active directory.

SQL Server does not prompt for the password and does not perform the validation. Windows or Linux-based authentication is the default authentication mode and is much more robustly secure than SQL Server Authentication (discussed below). Windows or Linux Authentication uses Kerberos security protocol to support the above-mentioned security features.

A connection made using Windows or Linux Authentication is sometimes called a trusted connection because SQL Server trusts the credentials provided by the underlying Windows or Linux operating system.

**SQL Server and Windows/Linux Authentication Mode (Mixed-mode)**:

When using SQL Server Authentication, logins are created in SQL Server and are not based on Windows or Linux user accounts. Both the user name and the password are created
by using SQL Server and stored within SQL Server. Users connecting using SQL Server Authentication must provide their credentials (login and password) every time that they connect to SQL Server.

Since this mode does not avail the Windows or Linux Kerberos security protocol, it is considered to be inferior to Windows or Linux Authentication mode.

{{< note >}}
You can change the SQL Server authentication mode even after the initial installation decision has been made.
{{< /note >}}

## Passwords

If you are using SQL Server (Mixed-mode) authentication, it automatically creates a user login of System Administrator (SA) with the sysadmin privileges and permissions. To increase the security of your SQL Server, you should perform the following:

1. Rename the SA login account to a different, more obscure, name
1. Disable the account entirely, if you do not plan on using it
1. For the SA (or renamed) account, select a complex password, consisting of lower/upper case letters, numbers, and punctuation symbols
1. Do not allow applications to use the SA (or equivalently renamed) account in any of the application connection strings

Any other user-based (lower-privileged) SQL Server accounts, should also use complex passwords, as noted above.

## High-Privileged Operating System Accounts

SQL Services uses a Windows or Linux account to run its services. Typically one should not assign high-privileged, built-in accounts (or equivalents) such as *Network Service* or Local System to the various SQL Services. This can increase the risk of nefarious database/server activity, should someone be able to log into these types of accounts.

Only assign the appropriate level of security-required accounts to SQL services. Moreover, if not needed, any high-privileged operating system accounts on the server housing the SQL server should be disabled as appropriate.

## Restrict SQL Traffic

Database servers typically have one or more servers connecting to them. Access to these servers must be allowed only to and from designated IP addresses. Doing this can potentially prevent a nefarious user from accessing the server. In certain cases, a user SQL Server may need to connect directly to the database server. Restricting those SQL connections to the specific IP addresses (or at least IP class block or segment) that require it, should be implemented.

Because these are endpoints, they need to be secured properly, since infiltrated malware can scan, and attack SQL servers. These IP restrictions can be managed via *iptables* on Linux operating systems, and via the Windows firewall (or any dedicate hardware firewall) on Microsoft platforms.

## SQL Server Patches (Service Packs)

Microsoft regularly releases SQL Server service packs and/or cumulative packs for fixing known issues, bugs, and security issues. It is extremely advisable to apply SQL Server patching on production instances of SQL Server. However, before applying the security patch to production systems, it is highly advisable to apply, and test these patches in a test, or development environment. This is to validate the ramifications of the changes in the patch.

## Backups

When dealing with production instances of SQL Server, it is important to regularly backup the databases, to guard against database failure. It can be due to corruption, disk array failure, power outages, disasters, etc.

Full database backups (on a regularly scheduled basis) and incremental backups (on a daily or running time basis) are all very advisable and should be scheduled accordingly. In addition to guarding against database failure, retaining of backups can be very crucial. Due to a particular business requirement, rollback of a database to a particular date is may be necessary.

Further, securing your backups is critical. Typically, database professionals do not consider all the requirements for securing database backups. Performing database backups are the process of creating a copy of the operational state, architecture, and stored data of a database. Therefore, it is essential to protect it. This requires the restriction of access to backup files and encrypting them properly to minimize the ability to read the offline data. Additionally, do not provide all people in you organization the access rights (create, view, modify, and delete) to backup files.

It is imperative to store these backups in an off-site facility, as a safeguard of preserving snapshots of the data. Depending on the organization and critical nature of the database data, backups from months to perhaps years, should be preserved, and archived.

## Auditing

Auditing is another key component/tool when it comes to SQL Server security. A designated database administrator or database security team should regularly review SQL Server auditing logs for failed logins. SQL Server provides a default login audit mechanism for reviewing all of the login accounts. These audit facilities record incoming requests by username and client IP address. So any login failures can assist in discovering and eliminating any suspicious database activity. The following types of activity can show up in the SQL Server audit logs:

- **Extended events:** Extended events is a lightweight performance monitoring system that enables users to collect data needed to monitor and troubleshoot problems in SQL Server.

- **SQL Trace:** SQL Trace is SQL Server's built-in utility that monitors and records SQL Server database activity. This utility can display server activity, create filters that focus on the actions of users, applications, or workstations, and can filter at the SQL command level.

- **Change Data Capture:** Change Data Capture (CDC) uses a SQL Server agent to record insert, update, and delete activity that applies to a specific table.

- **Triggers:** Application-based SQL Server Triggers can be written specifically to populate a user-defined audit table to store changes to existing records in specific tables.

- **SQL Server-Level Audit Specifications:** A Server Audit Specification defines which *Audit Action Groups* can be audited for the entire server (or "instance"). Some audit action groups consist of server-level actions such as the creation of a table or modification of a server role and hence are only applicable to the server itself.

Additionally, hardware and/or software firewall logs (that is, external to SQL Server) should be regularly examined to monitor and detect any nefarious attempts at server penetration.

## Conclusion

In part two of this article series, you reviewed additional methods of enhancing the security of SQL Server databases.

Judicious choice of authentication modes, SQL account naming, password choices, restricting SQL traffic, application of patch updates, assignment of security-friendly accounts to SQL Services, disabling of superfluous operating system accounts, backup strategies, and use of auditing, further increases the security associated with SQL Server instances.
