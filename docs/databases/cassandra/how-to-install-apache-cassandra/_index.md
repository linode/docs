---
author:
  name: Linode
  email: docs@linode.com
description: 'The Cassandra NoSQL database is ideal for situations that require maximum data redundancy and uptime, ease of horizontal scaling across multiple unique servers, and rapidly evolving project demands during the development life cycle which would otherwise be heavily restricted by traditional relational database implementations. Apache Cassandra is an open-source application that is managed in a simple command line interface using the Cassandra Query Language, or CQL. CQL is syntactically similar to the Structured Query Language, making it easy to pick up for those already familiar with SQL.'
keywords: ["Cassandra", "NoSQL", "database", "MapReduce"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
title: How to Install Apache Cassandra
show_in_lists: true
---

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

<!-- Include one of the following notes if appropriate. --->

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}
