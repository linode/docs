---
slug: deploy-clustercontrol-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Manage the most popular open-source databases on-premise or in the cloud.'
og_description: 'Manage the most popular open-source databases on-premise or in the cloud.'
keywords: ['database','cluster','backups','configuration management']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-26
modified_by:
  name: Linode
title: "Deploy ClusterControl With Marketplace Apps"
h1_title: "How to Deploy ClusterControl With Marketplace Apps"
enable_h1: true
external_resources:
- '[Severalnines](https://severalnines.com/)'
---

## ClusterControl Marketplace App

A unified console (“single pane of glass”) to manage the full database lifecycle of the most popular open-source databases on-premise or in the cloud.
Provision, monitor and manage highly available database clusters in minutes with dashboards, backups, notifications, reports and automated recovery.

**Supported databases: MariaDB, MariaDB Galera Cluster, Percona, Percona XtraDB Cluster, MySQL Replication, MySQL Cluster (NDB), PostgreSQL, Redis, TimescaleDB and MongoDB ReplicaSet and Shards**

### Deploy a ClusterControl Marketplace App

{{< content "deploy-marketplace-apps">}}

### ClusterControl Options
<!-- The following table has three parts. The UDF name, in bold and in one column, followed by
     UDF description in the second column. The description is in normal text, with an optional
     "Required." tag at the end of the description, in italics, if the field is mandatory. -->
You can configure your ClusterControl App by providing values for the following fields:

| **Field** | **Description** |
|:--------------|:------------|
| **MySQL Root Password** | MySQL Root Password. *Required*. |
| **CMON User Password** | CMON user password. *Required*. |
| **Your Linode API Token** | Your Linode `API Token` is needed to create DNS records. If this is provided along with the `subdomain` and `domain` fields, the installation attempts to create DNS records via the Linode API. If you don't have a token, but you want the installation to create DNS records, you must [create one](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) before continuing. |
| **Subdomain** | The subdomain you wish the installer to create a DNS record for during setup. The suggestion given is `www`. The subdomain should only be provided if you also provide a `domain` and `API Token`. |
| **Domain** | The domain name where you wish to host your ClusterControl instance. The installer creates a DNS record for this domain during setup if you provide this field along with your `API Token`. |
| **SSL** | Would you like to use a free Let's Encrypt SSL certificate? (Uses the Linode's default rDNS if no domain is specified). |

### Linode Options

After providing the App-specific options, provide configurations for your Linode server:
<!-- Be sure to edit the Select an Image and Linode Plan to match app's needs -->

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Ubuntu 20.04 LTS is currently the only image supported by the ClusterControl Marketplace App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). ClusterControl can be supported on any size Linode, but we suggest you deploy your ClusterControl App on a Linode plan that reflects how you plan on using it. If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name is how you identify your server in the Cloud Manager Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

<!-- the following disclaimer lets the user know how long it will take
     to deploy the app -->
After providing all required Linode Options, click on the **Create** button. **Your ClusterControl App will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment
<!-- the following headings and paragraphs outline the steps necessary
     to access and interact with the Marketplace app. -->
### Access your ClusterControl App

To access your ClusterControl instance, Open a browser and navigate to the domain you created during in the beginning of your deployment or your Linode rDNS domain `https://li1234-555.members.linode.com`. Replace `https://li1234-555.members.linode.com` with your [Linode's RDNS domain](docs/guides/remote-access/#resetting-reverse-dns).

From there you will see the welcome screen where you can enter the requested information to setup your ClusterControl instance:

![Severalnines Welcome](ClusterControl-install.png)

Now that you’ve accessed your dashboard, checkout [the official ClusterControl documentation](https://docs.severalnines.com/docs/clustercontrol/) to learn how to further configure your instance.

{{< content "marketplace-update-note">}}