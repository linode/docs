---
author:
  name: Linode
  email: docs@linode.com
description: "Shortguide for restoring a mysqldump database with MySQL."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
modified: 2018-08-13
modified_by:
  name: Linode
title: "Restore a MySQL database from mysqldump - Shortguide"
published: 2018-08-13
shortguide: true
---

<!-- This shortguide assumes that there's a heading on the referring page -->

The restoration command's general syntax is:

    mysql -u [username] -p [databaseName] < [filename].sql

* Restore an entire DBMS backup. You will be prompted for the MySQL root user's password:\
  **This will overwrite all current data in the MySQL database system**

        mysql -u root -p < full-backup.sql

* Restore a single database dump. An empty or old destination database must already exist to import the data into, and the MySQL user you're running the command as must have write access to that database:

        mysql -u [username] -p db1 < db1-backup.sql

* Restore a single table, you must have a destination database ready to receive the data:

        mysql -u dbadmin -p db1 < db1-table1.sql
