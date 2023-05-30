---
slug: surrealdb-for-web-applications
title: "Building an Web Application on Top of SurrealDB"
description: "Two to three sentences describing your guide."
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-01-01
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Link Title 1](http://www.example.com)'
---

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## OUTLINE

- Complete Getting Started and Managing Access guides

    - In this case:

        1. Install SurrealDB

        1. Start it up with a root user and a persistent location

        1. Create a limited user on `exampleDb` in `exampleNs`

        1. Restart SurrealDB without the root user

- Provision base schema and data

    - The example application provides a to-do list, so create a `todo` table with three items

    - Associate each `todo` record with a user via an `assigned` relational table

    - Define a scope for user accounts, `users`

- Create a web application to interface with the to-do list
