---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-16
modified_by:
  name: Linode
title: ""
h1_title: "Configuring Your Nextcloud Server to use Linode Object Storage"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
[Nextcloud](https://nextcloud.com/) is an open source solution to file hosting and sharing. With Nextcloud, you can synchronize files from your local computer to your Linode server and share them with your collaborators. Nextcloud’s customizable security features and intuitive user interface help keep your files safe and easy to manage.

You can configure Nextcloud to enable external storage services, like [Linode Object Storage](https://www.linode.com/products/object-storage/), to use as a secondary place to keep your files. Using an Linode Object Storage to store your files will prevent you from running out of storage space limited by your Linode's plan size. When using Nextcloud's graphical user interface (GUI) to manage your files, your external storage device will show up just like any other folder.

## Before You Begin

1. Deploy a Nextcloud server instance. You can use the Linode Nextcloud One-Click App for an easy and quick deployment.

1. [Enable Linode Object Storage on your account](/docs/platform/object-storage/how-to-use-object-storage/#enable-object-storage).

1. [Generate Object Storage access keys](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair).

## Nextcloud Settings
### Enable the External Storage App

In this section you will enable the *External storage support* Nextcloud app in order to gain access to a GUI
### Create a New S3 External Storage Mount

#### Test your External Storage Mount
## Next Steps


{{< disclosure-note "Linode Object Storage Regions and Hostnames">}}
| Region |Region ID | Hostname |
|:------:|:------:|:------:|
| Newark, NJ, USA | `us-east-1` | us-east-1.linodeobjects.com |
| Frankfurt, Germany | `eu-central-1` | eu-central-1.linodeobjects.com |
{{</ disclosure-note >}}