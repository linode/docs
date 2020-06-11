---
author:
  name: Linode
  email: docs@linode.com
description: 'Deploy Percona on Linode using One-Click Apps.'
keywords: ['percona','one-click apps','monitoring', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-11
modified: 2020-06-11
modified_by:
  name: Linode
title: "Deploy Percona with One-Click Apps"
contributor:
  name: Linode
external_resources:
- '[Percona PMM Documentation](https://www.percona.com/doc/percona-monitoring-and-management/index.html)'
---
## Percona PMM One-Click App

Percona Monitoring and Management (PMM) is a free open-source tool which provides a GUI powered by [Grafana](https://grafana.com/) for monitoring and managing MySQL, MariaDB, PostgreSQL, and MongoDB. With PMM, you can easily observe important metrics, logging, and statistics related to the your databases. Additionally, it includes a number of tools which can optimize your database's performance, manage all database instances, and track and identify potential security threats.


### Deploy a GitLab One-Click App

{{< content "deploy-one-click-apps">}}

### Linode Options

The following configuration options are possible for your Linode server:

| **Configuration** | **Description** |
|--------------|------------|
| **Hostname** | The [hostname](https://www.linode.com/docs/getting-started/#set-the-hostname) you'll use for the new Linode. |
| **Select an Image** | Debian and Ubuntu are currently the only images supported by the Percona PMM One-Click App. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). We recommend that you use, at minimum, an **@GB Linode plan** at minimum for your Percona PMM server. For more information on Percona's system requirements see their [official documentation](https://www.percona.com/doc/percona-monitoring-and-management/faq.html#what-are-the-minimum-system-requirements-for-pmm). If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Percona app will complete installation anywhere between 1-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your PPM Server

After the Percona PMM has finished installing, you will be able to access it over `http://` with your Linode's IPv4 address. To find your Linode's IPv4 address:

  1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

  1. Find the Linode you just created when deploying your app and select it.

  1. Navigate to the **Networking** tab.

  1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

  1. Copy and paste the IPv4 address into a browser window. Ensure you are using `http://`.

1. On the following screen, you will see the PMM Home Dashboard actively monitoring your server:

    ![Percona Home Page](perconahome.png)

### Software Included

The Percona PMM One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker**](https://www.docker.com/) | Docker is used to containerize Percona PMM. |
| [**Grafana**](https://grafana.com/) | Grafana is a visualization tool that provides charts, graphs, and alerts. Provides these tools for Percona PMM |
| [**pmm-admin**](https://www.percona.com/doc/percona-monitoring-and-management/pmm-admin.html) | `pmm-admin` is a command-line tool used to managing PMM clients. |

{{< content "one-click-update-note">}}
