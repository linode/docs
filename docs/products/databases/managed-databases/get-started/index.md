---
title: Get Started
title_meta: "Getting Started with Managed Databases"
description: "Learn how to quickly get up and running with the Managed Database service."
tab_group_main:
    weight: 20
modified: 2022-06-06
---

Linode's Managed Database service is a convenient and reliable way to host your database workloads in the cloud. Quickly get up and running by following the instructions within this guide.

## Create a Managed Database

A Managed Database can be deployed using the Cloud Manager, the Linode API, or the Linode CLI. For instructions on deploying it through the Cloud Manager, see the following guide:

- [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/)
- [Choosing a Database Engine and Plan](/docs/products/databases/managed-databases/guides/database-engines/)

## Connect to Your Database

Once a Managed Database has been provisioned, you can connect to it from any compatible system or applications. Before you do so, the system's IP address needs to be added to the database cluster's access control list.

- [Manage Access Controls](/docs/products/databases/managed-databases/guides/manage-access-controls/)
- [Connect to a MySQL Managed Database](/docs/products/databases/managed-databases/guides/mysql-connect/)
- [Connect to a PostgreSQL Managed Database](/docs/products/databases/managed-databases/guides/postgresql-connect/)

## Migrate an Existing Database

If you are replacing an existing database with Linode's Managed Database service, you will need to migrate that data after the database cluster has been fully provisioned. The guide [Migrate a MySQL or MariaDB Database to a Managed Database](/docs/products/databases/managed-databases/guides/migrate-mysql/) walks you through migrating a MySQL database.

## Integrate the Database into an Application

While its possible to add data directly to a database using CLI or GUI tools, it's much more common to integrate the database into an existing application. For instance, you can use the database with any web stack that utilizes your chosen database engine (DBMS) such as [LEMP](/docs/guides/web-servers/lemp/) / [LAMP](/docs/guides/web-servers/lamp/) for MySQL and MERN / [MEAN](/docs/guides/mean-stack-tutorial/) for MongoDB. When using a Managed Database, you can forgo installing the database locally on the system and instead use the credentials and connection details for your Managed Database. The instructions for connecting to a remote database vary by application. For example, here's a guide for WordPress: [Configure WordPress to use a Remote Database](/docs/guides/configure-wordpress-remote-database/).