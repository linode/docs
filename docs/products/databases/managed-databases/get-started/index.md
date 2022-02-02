---
title: Get Started
description: "Get started with the Managed Database service."
tab_group_main:
    weight: 20
---

{{< content "managed-databases-beta-notice-shortguide" >}}

Linode's Managed Database service is a convenient and reliable way to host your database workloads in the cloud. Quickly get up and running by following the instructions within this guide.

## Create a Managed Database

A Managed Database can be deployed using the Cloud Manager, the Linode API, or the Linode CLI. For instructions on deploying it through the Cloud Manager, see the following guide:

- [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/)

## Connect to Your Database

Once a Managed Database has been provisioned, you can connect to it from any compatible system. Before you do so, the system's IP address needs to be added to the database cluster's access control list.

- [Manage Access Controls](/docs/products/databases/managed-databases/guides/manage-access-controls/)
- [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/connect-to-mysql/)

## Integrate the Database into an Application

While its possible to add data directly to a database using CLI or GUI tools, it's much more common to integrate the database into an existing application. For instance, you can use the database with any web stack that utilizes your chosen database engine (DBMS) such as [LEMP](/docs/guides/web-servers/lemp/) / [LAMP](/docs/guides/web-servers/lamp/) for MySQL and MERN / [MEAN](/docs/guides/mean-stack-tutorial/) for MongoDB. Simply forgo installing the database manually and instead use the credentials and connection details for your Managed Database.