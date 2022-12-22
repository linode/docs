---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Superinsight DB, a relational database for unstructured data, on the Linode platform."
keywords: ['superinsight','database','relational','unstructured','postgresql']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 
modified: 
modified_by:
  name: Linode
title: "Deploy Superinsight DB through the Linode Marketplace"
contributor:
  name: Linode
external_resources:
- '[Superinsight DB](https://github.com/superinsight/superinsight-db)'
aliases: ['/guides/deploying-superinsight-marketplace-app/','/guides/superinsight-marketplace-app/']
---

[Superinsight DB](https://github.com/superinsight/superinsight-db) is a Relational Database for Unstructured Data, its main purpose is to provide a simple SQL interface to store and search unstructured data. Superinsight is build on top of PostgreSQL so you can take advantage of everything in PostgreSQL plus the ability to run machine learning operations using SQL statements.

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Superinsight DB should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS and 20.04 LTS
- **Recommended plan:** All plan types and sizes can be used. 

## Getting Started after Deployment 

1. Log into your new compute instance through LISH or SSH using the root user and associated password you entered when creating the instance. 

2. The Admin password is generated and printed to the Message of the Day. This displays on login, or through the `cat` command: 

    ```command
    cat /etc/motd
    ```
    The file contains the credentials you will use to connect to the Superinsight DB. 
    ```file {title="/etc/motd"}
    Superinsight created the user admin with password: 1d892e9d3584a39471b76121
    You can can connect using a database client with the following connection string postgres://admin:1d892e9d3584a39471b76121@45.33.112.229:5432/superinsight
    For complete source code and information, visit: https://github.com/superinsight/superinsight-db
    ```

For more information on configuration and use-cases please see the [Superinsight DB Documentation](https://docs.superinsight.ai). 
