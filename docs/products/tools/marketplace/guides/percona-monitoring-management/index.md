---
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to deploy Percona Monitoring & Management with Marketplace Apps and basic configuration steps to get you started monitoring your database."
keywords: ['percona','marketplace apps','monitoring', 'database']
tags: ["database","monitoring","cloud-manager","linode platform","marketplace"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-11
modified: 2022-03-08
modified_by:
  name: Linode
title: "Deploying Percona Monitoring and Management (PMM) through the Linode Marketplace"
contributor:
  name: Linode
image: 'deploy-percona-marketplace.png'
aliases: ['/platform/marketplace/how-to-deploy-percona-monitoring-management-with-marketplace-apps/', '/platform/one-click/how-to-deploy-percona-monitoring-management-with-one-click-apps/','/guides/how-to-deploy-percona-monitoring-management-with-one-click-apps/','/guides/how-to-deploy-percona-monitoring-management-with-marketplace-apps/','/guides/percona-marketplace-app/']
---

Percona Monitoring and Management (PMM) is an open-source tool which provides a GUI powered by [Grafana](https://grafana.com/) for monitoring and managing MySQL, MariaDB, PostgreSQL, and MongoDB databases. You can use PMM to easily observe important metrics, logging, and statistics related to your databases and the hosts they run on. Additionally, it includes a number of tools which can help to optimize your database's performance, manage all database instances, and track and identify potential security threats. Linode's Percona (PMM) Marketplace App deploys a Linode with PMM installed and ready for you to begin monitoring your databases.

## PMM Architecture Overview

The PMM tool uses a client-server model which makes it easy to scale monitoring across several databases hosted on various remote hosts. See the table below to better understand how each PMM component fits into the context of Linode's Percona (PMM) Marketplace App.

| **Component** | **Description** |
|:-------:|:--------:|
| **PMM Server** | The Percona (PMM) Marketplace App deploys an instance of the PMM Server, which includes the Grafana web interface to visualize all the data collected from the databases it monitors.|
| **PMM Client** | You will need to install the PMM Client on any Linode that hosts a database that you would like to monitor. The PMM Client will help you connect to the PMM Server and relay host and database performance metrics to the PMM Server. |

{{< note >}}
For a more detailed information on PMM's architecture see [Percona's official documentation](https://www.percona.com/doc/percona-monitoring-and-management/2.x/concepts/architecture.html).
{{</ note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** PMM should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used. Percona recommends roughly 1 GB of storage on your PMM Server for each database node you would like to monitor. For more information on Percona's system requirements see their [official documentation](https://www.percona.com/doc/percona-monitoring-and-management/2.x/faq.html#what-are-the-minimum-system-requirements-for-pmm).

### Percona (PMM) Options

- **Admin Password** *(required)*: The password you will use to log in to the monitoring dashboard.

## Getting Started after Deployment

### Access your PMM Server's Grafana Dashboard

After the [PMM Server](https://www.percona.com/doc/percona-monitoring-and-management/2.x/concepts/architecture.html#pmm-server) has finished installing, you will be able to access its Grafana dashboard over `http://` and your Linode's IPv4 address. To find your Linode's IPv4 address:

1. Click on the **Linodes** link in the sidebar. You will see a list of all your Linodes.

1. Find the Linode you just created when deploying your app and select it.

1. Navigate to the **Networking** tab.

1. Your IPv4 address will be listed under the **Address** column in the **IPv4** table.

1. Copy and paste the IPv4 address into a browser window. Ensure you are using `http://`.

1. You will see the Grafana login screen:

    ![Grafana Login Screen](grafana-login-screen.png "Grafana Login Screen.")

1. Enter the following default values for username and password, then click the **Log In** button:

    | **Entry** | **Default Value** |
    |:---:|:---:|
    | Username | admin |
    | Password | The admin password you selected when you create the app. |

1. You will then see the PMM Home Dashboard actively monitoring your server:

    ![Percona Home Page](perconahome.png "Percona Home Page.")

### Installing the PMM Client

To begin monitoring a database node, you will need to install the [PMM Client](https://www.percona.com/doc/percona-monitoring-and-management/2.x/concepts/architecture.html#pmm-client) on the Linode that hosts your database and connect the node to the PMM Server. For instructions on setting up a database on Linode that you can connect to your PMM Server, see our guides on:

-   [Deploying MySQL/MariaDB with Marketplace Apps](/docs/products/tools/marketplace/guides/mysql/)
-   [Deploying PostgreSQL with Marketplace Apps](/docs/products/tools/marketplace/guides/postgresql/)
-   [Deploying MongoDB with Marketplace Apps](/docs/products/tools/marketplace/guides/mongodb/)

{{< note >}}
The PMM Server deployed with Linode's Percona (PMM) Marketplace App is compatible with [**PMM Client version 2**](https://www.percona.com/doc/percona-monitoring-and-management/2.x/index.html).
{{</ note >}}

1.  [Connect to your database Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) via SSH.

1.  Update your system's software.

    **Debian or Ubuntu**:

        sudo apt-get update && apt-get upgrade

    **CentOS**:

        sudo yum update

1.  Configure Percona repositories using the [percona-release](https://www.percona.com/doc/percona-repo-config/percona-release.html) tool. First you’ll need to download and install the official `percona-release` package from Percona::

    **Debian or Ubuntu**:

        wget https://repo.percona.com/apt/percona-release_latest.generic_all.deb
        sudo dpkg -i percona-release_latest.generic_all.deb

    **CentOS**:

        sudo yum install https://repo.percona.com/yum/percona-release-latest.noarch.rpm

    {{< note >}}
If you have previously enabled the experimental or testing Percona repository, don’t forget to disable them and enable the release component of the original repository as follows:

    sudo percona-release disable all
    sudo percona-release enable original release
    {{</ note >}}

1.  Install the PMM Client (version 2):

    **Debian or Ubuntu**:

        sudo apt-get update
        sudo apt-get install pmm2-client

    **CentOS**:

        sudo yum install pmm2-client

1.  Connect your database node to the PMM Server. Replace `admin_password` with your PMM Server's [Grafana password](#access-your-PMM-server-s-grafana-dashboard), and `192.0.2.0` with your PMM Server's IPv4 address.

      {{< note >}}
Follow the steps in [Find Your Linode's IP Address](/docs/guides/find-your-linodes-ip-address/) to retrieve your PMM Server's IPv4 address.
      {{</ note >}}

        pmm-admin \
        config \
        --server-insecure-tls \
        --server-url=https://admin:admin_password@192.0.2.0:443

    Once complete, you should see a similar output:

      {{< output >}}
Checking local pmm-agent status...
pmm-agent is running.
Registering pmm-agent on PMM Server...
Registered.
Configuration file /usr/local/percona/pmm2/config/pmm-agent.yaml updated.
Reloading pmm-agent configuration...
Configuration reloaded.
Checking local pmm-agent status...
pmm-agent is running.
      {{</ output >}}

### Monitor a Database Instance

Once your database node and your PMM Server are communicating, the final step is to add your database instance to be monitored by your PMM Server. These steps are completed on your database node.

1. [Connect to your Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) via SSH.

1. Add your database instance to be monitored by your PMM Server. This command will add a MySQL database instance to be monitored. Replace `db_user` with your database's user name, and `db_user_password` with that user's password. You can also replace `mysql` with the database type that your node is hosting (i.e. `postgresql` or `mongodb`). See Percona's [Using PMM Client](https://www.percona.com/doc/percona-monitoring-and-management/2.x/manage/index-using-pmm-client.html) documentation for details.

        pmm-admin \
        add mysql \
        --username=db_user \
        --password=db_user_password

    Your Percona dashboard should now be monitoring your MySQL service.

    ![perconafinal.png](perconafinal.png "Percona Dashboard with Database Monitoring.")

    {{< note >}}
You can also [add a database remote instance node using the Grafana interface](https://www.percona.com/doc/percona-monitoring-and-management/remote-instance.html). In order to do this, your node must be configured with a public DNS name. This method of adding a remote database instance will not provide host-level metrics.
    {{</ note >}}

## Software Included

The Percona (PMM) Marketplace App installs the following required software on your Linode:

| **Software** | **Description** |
|:--------------|:------------|
| [**Docker**](https://www.docker.com/) | Docker is used to containerize PMM. |
| [**PMM Server**](https://www.percona.com/doc/percona-monitoring-and-management/2.x/install/docker.html) | PMM Server is the central part of PMM that aggregates collected data and presents it in the form of tables, dashboards, and graphs in a web interface.  |
| [**Grafana**](https://grafana.com/) | Grafana is the visualization tool used by PMM to provides charts, graphs, and alerts for the databases that are being monitored. |

{{< content "marketplace-update-note-shortguide">}}

## Next Steps

The Percona Monitoring Management Tool is very powerful and can be configured to monitor and display various pieces of your database instances. Once you have completed the basic configurations outlined in this guide, you should review Percona's documentation to learn more about the PMM tool. Here are some suggested topics:

- [Tools of PMM](https://www.percona.com/doc/percona-monitoring-and-management/tool.html)
- [Percona Monitoring and Management Documentation](https://www.percona.com/doc/percona-monitoring-and-management/2.x/index.html)
- [Configuring PMM Server](https://www.percona.com/doc/percona-monitoring-and-management/2.x/manage/index-server.html)
- [Using PMM Client](https://www.percona.com/doc/percona-monitoring-and-management/2.x/manage/index-using-pmm-client.html)
- [Using PMM Metrics Monitor](https://www.percona.com/doc/percona-monitoring-and-management/2.x/index-using-pmm-metrics-monitor.html)
