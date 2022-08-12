---
slug: sql-server-security-part-2
author:
  name: Doug Hayman for NanoHertz Solutions Inc.
description: 'Learn about the SQL Server security best practices and guidelines to keep your server and data safe. For example, selecting a SQL Server authentication mode.'
keywords: ['SQL server authentication', 'Restrict SQL traffic', 'SQL Server Patches', 'Backups', 'Auditing']
tags: ['database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-08-12
modified_by:
  name: Linode
title: "SQL Server Security Best Practices, Part 2"
h1_title: "Part 2: SQL Server Security Best Practices"
enable_h1: true
contributor:
  name: Doug Hayman for NanoHertz Solutions Inc.
  link: http://nhzsolutions.com/
---

This guide is the second in a series of articles that covers SQL Server security best practices. [Part 1 of this series](/docs/guides/sql-server-security/) discussed a SQL Server installation's physical security, operating system security, and application maintenance. Additionally, the previous guide outlined how to disable unnecessary features, enable encryption, and implement data masking.

The second part of this series describes how and why you should:

- Choose an [authentication mode](#sql-server-authentication),

- Restrict the [System Administrator account](#system-administrator-sa-account)

- Assign [security-friendly accounts to SQL Server](#high-privileged-operating-system-accounts)

- [Restrict SQL traffic](#restrict-sql-traffic)

- Apply [patch updates](#sql-server-patches-service-packs)

- Implement [backup strategies](#backups)

- Implement [auditing](#auditing)

## SQL Server Authentication

Protection of data stored with SQL Server depends upon the ability to authenticate access to specific sets of data. SQL Server provides two options for database authentication in a Windows or Linux environment:

- [*Windows/Linux Authentication*](#windows-or-linux-authentication-mode)
- [*SQL Server and Windows/Linux Authentication*](#sql-server-and-windowslinux-authentication-mode-mixed-mode) (also known as Mixed-mode)

You are prompted to select one of these SQL Server authentication modes during SQL Server setup.

{{< note >}}
You can change the SQL Server authentication mode even after the initial installation decision has been made.
{{< /note >}}

### Windows or Linux Authentication Mode

In this mode, an installer logs into SQL Server using their Windows or Linux account. SQL Server validates the account name and password via the Windows or Linux operating system. SQL Server does not prompt for a password and does not perform the validation.

Windows or Linux authentication uses Active Directory (AD) accounts. As a result, you can have centralized policy control for authentication. Policies can govern password strength and complexity, password expiration, account lockout, and active directory groups in the active directory.

Windows or Linux-based authentication is the default authentication mode and is much more secure than [SQL Server Authentication](#sql-server-and-windowslinux-authentication-mode-mixed-mode) (discussed in the next section). Windows or Linux Authentication uses the Kerberos security protocol to support the above-mentioned security features. A connection made using Windows or Linux Authentication is sometimes called a trusted connection because SQL Server trusts the credentials provided by the underlying Windows or Linux operating system.

### SQL Server and Windows/Linux Authentication Mode (Mixed-Mode)

When using SQL Server Authentication, logins are created in SQL Server and are not based on Windows or Linux user accounts. Both the username and the password are created
by SQL Server and are stored within SQL Server. Users connecting using SQL Server Authentication must provide their credentials (username and password) every time that they connect to SQL Server.

This mode does not use the Windows or Linux Kerberos security protocol, and it is considered to be inferior to [Windows or Linux Authentication mode](#windows-or-linux-authentication-mode).

## System Administrator (SA) Account

If you are using [SQL Server (mixed-mode) authentication](#sql-server-and-windowslinux-authentication-mode-mixed-mode), SQL Server automatically creates a *System Administrator* (SA) user login with sysadmin privileges and permissions. To increase the security of your SQL Server, you should perform the following:

1. Rename the SA login account to a different, more obscure, name.
1. Disable the account entirely, if you do not plan on using it.
1. For the SA (or renamed) account, select a complex password, consisting of lower/upper case letters, numbers, and punctuation symbols.
1. Do not allow applications to use the SA (or equivalently renamed) account in any of the application connection strings.

{{< note >}}
Any other user-based (lower-privileged) SQL Server accounts should also use complex, unique passwords.
{{< /note >}}

## High-Privileged Operating System Accounts

SQL Server uses a Windows or Linux account to run its services. Typically one should not assign high-privileged, built-in accounts (or equivalents) such as *Network Service* or *Local System* to the various SQL Server services. This can increase the risk of nefarious database/server activity, should someone be able to log into these types of accounts.

Only assign the appropriate level of security-required accounts to SQL Server services. If not needed, any high-privileged operating system accounts on the server housing the SQL Server should be disabled as appropriate.

## Restrict SQL Traffic

Database servers typically have one or more servers connecting to them. Access to these servers must be allowed only to and from designated IP addresses. Doing this can potentially prevent a nefarious user from accessing the server. In certain cases, a user of SQL Server may need to connect directly to the database. Restricting those SQL connections to the specific IP addresses (or at least IP class block or segment) that require it should be implemented.

These IP restrictions can be managed with different solutions on different platforms:

- [*iptables*](/docs/guides/control-network-traffic-with-iptables/) can control traffic on Linux operating systems. Other popular firewall options are also available, including [UFW](/docs/guides/configure-firewall-with-ufw/), [nftables](/docs/guides/how-to-use-nftables/), and [FirewallD](/docs/guides/introduction-to-firewalld-on-centos/).

- Use the Windows firewall (or any dedicate hardware firewall) on Microsoft platforms.

- You can also [add the free Linode Cloud Firewalls service](/docs/products/networking/cloud-firewall/guides/add-firewall/) to a Linode Compute Instance that hosts SQL Server.

## SQL Server Patches (Service Packs)

Microsoft regularly releases SQL Server service packs and/or cumulative packs for fixing known issues, bugs, and security issues. It is highly advisable to apply SQL Server patching on production instances of SQL Server. However, before applying a security patch to production systems, it is advisable to apply these patches in a test environment. This is done to validate the changes in the patch and ensure that your database operates as expected under the patch.

## Backups

When dealing with production instances of SQL Server, it is important to regularly backup the server's databases. A database backup creates a copy of the operational state, architecture, and stored data of a database. Backups help guard against potential database failures. These failures can happen because of corruption, disk array failure, power outages, disasters, and other scenarios.

Backups can also assist with non-failure scenarios where a rollback of your database to a particular date may be necessary. Full database backups (on a regularly scheduled basis) and incremental backups (on a daily or running time basis) should be performed and maintained.

Securing your backups is critical, and database professionals sometimes do not consider all of the requirements for securing database backups. This work includes:

- Restriction of access to backup files. Do not provide all people in your organization the access rights (create, view, modify, and delete) to backup files.

- Encrypting backup files properly.

- Storing backups in an off-site facility. Depending on the organization and the critical nature of the database data, backups of a certain age should be preserved and archived.

## Auditing

Auditing is another key component of SQL Server security. A designated database administrator or database security team should regularly review SQL Server auditing logs for failed logins.

SQL Server provides a default login audit mechanism for reviewing all of the login accounts. These audit facilities record incoming requests by username and client IP address. Login failures can assist in discovering and eliminating suspicious database activity. The following types of activity can show up in the SQL Server audit logs:

- **Extended Events:** Extended Events is a lightweight performance monitoring system that enables users to collect data needed to monitor and troubleshoot problems in SQL Server.

- **SQL Trace:** SQL Trace is SQL Server's built-in utility that monitors and records SQL Server database activity. This utility can display server activity, create filters that focus on the actions of users, applications, or workstations, and can filter at the SQL command level.

- **Change Data Capture:** Change Data Capture (CDC) uses a SQL Server agent to record insert, update, and delete activity that applies to a specific table.

- **Triggers:** Application-based SQL Server Triggers can be written specifically to populate a user-defined audit table to store changes to existing records in specific tables.

- **SQL Server-Level Audit Specifications:** A Server Audit Specification defines which *Audit Action Groups* can be audited for the entire server (or *instance*). Some audit action groups consist of server-level actions such as the creation of a table or modification of a server role. These are only applicable to the server itself.

Hardware and/or software firewall logs (that is, external to SQL Server) should be regularly examined to monitor and detect any nefarious attempts at server penetration.

## Conclusion

In part two of this article series, you reviewed additional methods of enhancing the security of SQL Server databases. These included choosing an [authentication mode](#sql-server-authentication), restricting the [System Administrator account](#system-administrator-sa-account), assignment of [security-friendly accounts](#high-privileged-operating-system-accounts) to SQL Server, [restricting SQL traffic](#restrict-sql-traffic), application of [patch updates](#sql-server-patches-service-packs), [backup strategies](#backups), and use of [auditing](#auditing). To review earlier security recommendations, revisit [Part 1: SQL Server Security Best Practices](/docs/guides/sql-server-security/).
