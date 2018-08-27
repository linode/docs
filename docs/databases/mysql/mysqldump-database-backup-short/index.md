---
author:
  name: Linode
  email: docs@linode.com
description: "Shortguide for backing up a MySQL database with mysqldump."
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
keywords: []
modified: 2018-08-13
modified_by:
  name: Linode
title: "Back up a MySQL database with mysqldump - Shortguide"
published: 2018-08-13
headless: true
---

<!-- This shortguide assumes that there's a heading on the referring page -->

The `mysqldump` command’s general syntax is:

    mysqldump -u [username] -p [databaseName] > [filename]-$(date +%F).sql

* `mysqldump` prompts for a password before it starts the backup process.
* Depending on the size of the database, it could take a while to complete.
* The database backup will be created in the directory the command is run.
* `-$(date +%F)` adds a timestamp to the filename.

Example use cases include:

* Create a backup of an entire Database Management System (DBMS):

        mysqldump --all-databases --single-transaction --quick --lock-tables=false > full-backup-$(date +%F).sql -u root -p

* Back up a specific database. Replace `db1` with the name of the database you want to back up:

        mysqldump -u username -p db1 --single-transaction --quick --lock-tables=false > db1-backup-$(date +%F).sql

* Back up a single table from any database. In the example below, `table1` is exported from the database `db1`:

        mysqldump -u username -p --single-transaction --quick --lock-tables=false db1 table1 > db1-table1-$(date +%F).sql

Here's a breakdown of the `mysqldump` command options used above:

-  `--single-transaction`: Issue a BEGIN SQL statement before dumping data from the server.
-  `--quick`: Enforce dumping tables row by row. This provides added safety for systems with little RAM and/or large databases where storing tables in memory could become problematic.
-  `--lock-tables=false`: Do not lock tables for the backup session.
