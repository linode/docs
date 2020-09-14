---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy a Zabbix server 5.0 on Linode using One-Click Apps.'
keywords: ['monitoring','networking','zabbix']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-09-10
modified: 2020-09-10
modified_by:
  name: 
title: "Deploy Zabbix server 5.0 with One-Click Apps"
contributor:
  name: 
external_resources:
- '[Support URL](https://www.zabbix.com/support)'
---
## Zabbix One-Click App

Zabbix is an enterprise-class open source distributed monitoring solution designed to monitor and track performance and availability of network servers, devices, services and other IT resources.

Zabbix is an all-in-one monitoring solution that allows users to collect, store, manage and analyze information received from IT infrastructure, as well as display on-screen, and alert by e-mail, SMS or Jabber when thresholds are reached.

Zabbix allows administrators to recognize server and device problems within a short period of time and therefore reduces the system downtime and risk of system failure. The monitoring solution is being actively used by SMBs and large enterprises across all industries and almost in every country of the world.

### Deploy a Zabbix One-Click App

{{< content "deploy-one-click-apps">}}

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|--------------|------------|
| **Select an Image** | CentOS 7 is currently the only image supported by the Zabbix One-Click App, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). We recommend that you use, at minimum, an **1GB Linode plan** for your Zabbix server. For more information on Zabbix system requirements see their [official documentation](https://www.zabbix.com/documentation/5.0/manual/installation/requirements). If you decide that you need more or fewer hardware resources after you deploy your app, you can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. It must be at least 6 characters long and contain characters from two of the following categories: lowercase and uppercase case letters, numbers, and punctuation characters. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Zabbix app will complete installation anywhere between 3-7 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment

### Access your Zabbix Site

After Zabbix has finished installing, you will be able to access Zabbix from the console via ssh with your Linode's IPv4 address:

1. [SSH into your Linode](/docs/getting-started/#connect-to-your-linode-via-ssh).

1. Copy the randomly generated Admin password from the welcome text to access the Zabbix frontend

        Zabbix frontend credentials:

        Username: Admin

        Password: 2mZW2YgqgIxdWco3HoQ


        To learn about available professional services, including technical suppport and training, please visit https://www.zabbix.com/services

        Official Zabbix documentation available at https://www.zabbix.com/documentation/current/

        Note! Do not forget to change timezone PHP variable in /etc/php.d/99-zabbix.ini file.

1. Copy and paste the IPv4 address into a browser window. You should see your Zabbix login page.

{{< content "one-click-update-note">}}

For more on Zabbix, checkout the following guides:

- [Learn from documentation](https://www.zabbix.com/documentation/5.0/manual)
- [Purchase Technical Support contract](https://www.zabbix.com/support)
- [Zabbix official Forum](https://www.zabbix.com/forum)
