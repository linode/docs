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

Percona Monitoring and Management (PMM) is a free open-source tool which provides a GUI powered by [Grafana](https://grafana.com/) for monitoring and managing MySQL, MariaDB, PostgreSQL, and MongoDB databases at scale. With PMM, you can easily observe important metrics, logging, and statistics related to the your databases. Additionally, it includes a number of tools which can help to optimize your database's performance, manage all database instances, and track and identify potential security threats.

The Percona PMM One-Click App will install the PMM server software on to your Linode. The [PMM Client Software](https://www.percona.com/doc/percona-monitoring-and-management/2.x/concepts/architecture.html#pmm-client) must then be separately and manually installed on your Database Linodes to begin reporting to your Server.


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

After the Percona PMM server has finished installing, you will be able to access it over `http://` with your Linode's IPv4 address. To find your Linode's IPv4 address:

  1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

  1. Find the Linode you just created when deploying your app and select it.

  1. Navigate to the **Networking** tab.

  1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

  1. Copy and paste the IPv4 address into a browser window. Ensure you are using `http://`.

1. On the following screen, you will see the PMM Home Dashboard actively monitoring your server:

    ![Percona Home Page](perconahome.png)

### Installing the PMM Client

The PMM client should be installed on a device that contains database software. First, the client itself must be installed, and then databases must be added individually. On most DEB-based distributions the client can be installed in the following steps:

1. First, ensure that your system is up to date:

        sudo apt-get update && sudo apt-get upgrade

1. Set up and configure the Percona repositories:

        wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
        sudo dpkg -i percona-release_latest.generic_all.deb

1. Update your system with the new repository, and install the PMM client:

        sudo apt-get update
        sudo apt-get install pmm-client

1. Finally, configure your server using the following command, replacing the `IP_ADDRESS` with your PMM Server's IPv4 address:

        pmm-admin config --server IP_ADDRESS

    Once complete, you should see output similar to the following:

        PMM Server      | 192.0.2.0
        Client Name     | li222-111
        Client Address  | 192.0.2.255

### Setting up Your Database

Once the Client and Server are communicating,the final step is to configure your database to be logged by Percona's monitoring. For MySQL, this can be completed from your client using the following command:

    pmm-admin add mysql --user root --password "mysecurepassword" --host 127.0.0.1

From there, your Percona dashboard should be fully monitoring your database. More databases can then be added as needed for additional monitoring.

![perconafinal.png](perconafinal.png)



### Software Included

The Percona PMM One-Click App will install the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker**](https://www.docker.com/) | Docker is used to containerize Percona PMM. |
| [**Grafana**](https://grafana.com/) | Grafana is a visualization tool that provides charts, graphs, and alerts. Provides these tools for Percona PMM |
| [**pmm-admin**](https://www.percona.com/doc/percona-monitoring-and-management/pmm-admin.html) | `pmm-admin` is a command-line tool used to managing PMM clients. |

{{< content "one-click-update-note">}}
