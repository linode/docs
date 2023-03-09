---
slug: mongodb-deployment-methods-shortguide
description: 'Shortguide that outlines methods for deploying MongoDB on Linode.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-02-28
modified_by:
  name: Linode
title: MongoDB Deployment Methods Shortguide
keywords: []
headless: true
show_on_rss_feed: false
aliases: ['/mongodb-deployment-methods-shortguide/']
authors: ["Linode"]
---

To perform the steps in the guide, you need to have a running MongoDB database as well as the [MongoDB Shell](/docs/guides/mongodb-community-shell-installation/) installed (either locally or on your remote instance). If needed, follow one of the methods below to deploy MongoDB on Linode:

- **Deploy a MongoDB Managed Database.** Use Linode's Managed Database service to deploy a fully-managed cloud-based MongoDB instance. See [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/). Then, follow the [Connect to a MongoDB Database](/docs/products/databases/managed-databases/guides/mongodb-connect/) guide to learn how to connect to your database using the MongoDB Shell.
- **Create a Compute Instance using the MongoDB Marketplace App.** To quickly deploy your own MongoDB instance on Linode, use the MongoDB Marketplace App. See [Deploy MongoDB through the Linode Marketplace](/docs/products/tools/marketplace/guides/mongodb/)
- **Manually install MongoDB on a Compute Instance.** If you prefer to have complete control over the software that's installed and the configuration of MongoDB, you can create a Compute Instance and manually install MongoDB. You can follow the instructions on [MongoDB's documentation site](https://www.mongodb.com/docs/manual/administration/install-on-linux/) or use one of the following Linode guides:

    - [Installing MongoDB on Ubuntu 20.04](/docs/guides/install-mongodb-on-ubuntu-20-04/)
    - [Installing MongoDB on CentOS 7](/docs/guides/install-mongodb-on-centos-7/)