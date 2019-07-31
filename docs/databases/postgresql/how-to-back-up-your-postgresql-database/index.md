---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide shows how to use pg_dump and pg_dumpall to make backups of your PostgreSQL databases.'
og_description: 'This guide shows how to create backups of your PostgreSQL databases using pg_dump and use them to restore a lost or broken database.'
keywords: ['postgres', 'postgresql', 'backup', 'sql dump', 'pg_dump', 'psql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-18
modified: 2017-12-18
modified_by:
  name: Jared Kobos
title: "How to Back Up Your PostgreSQL Database"
external_resources:
- '[PostgreSQL Documentation](https://www.postgresql.org/docs/9.1/static/)'
---

![How to Back Up Your PostgreSQL Database](back-up-postgresql-database-title.jpg "How to Back Up Your PostgreSQL Database")

If you are using PostgreSQL in a production environment, it is important to take precautions to ensure that your users' data is not lost. By frequently backing up your database, and/or automating backups with a cron task, you will be able to quickly restore your system in the event that your database is lost or corrupted. Fortunately, PostgreSQL includes tools to make this task simple and easy to manage.

## Before You Begin

You should have a working installation of PostgreSQL on your system before beginning this guide. Go through our [How to Install PostgreSQL on Ubuntu guide](/docs/databases/postgresql/how-to-install-postgresql-on-ubuntu-16-04/) to install PostgreSQL and create a sample database.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## One-Time SQL Dump

### Single Database

PostgreSQL provides the `pg_dump` utility to simplify backing up a single database. This command must be run as a user with read permissions to the database you intend to back up.

1.  Log in as the `postgres` user:

        su - postgres

2.  Dump the contents of a database to a file by running the following command. Replace `dbname` with the name of the database to be backed up.

        pg_dump dbname > dbname.bak

    The resulting backup file, `dbname.bak`, can be transferred to another host with `scp` or stored locally for later use.

3.  To demonstrate restoring lost data, delete your example database and create an empty database in its place:

        dropdb dbname
        createdb dbname

4.  Restore the database using `psql`:

        psql test < dbname.bak

    There are several options for the backup format:

     - `*.bak`: compressed binary format
     - `*.sql`: plaintext dump
     - `*.tar`: tarball


### Remote Database

Just as `psql` allows you to connect to a remote host, `pg_dump` can be run from a client computer to back up data on a remote server. Use the `-h` flag to specify the IP address of your Linode and `-p` to identify the port on which PostgreSQL is listening:

    pg_dump -h 198.51.100.0 -p 5432 dbname > dbname.bak

### All Databases

Because `pg_dump` only creates a backup of one database at a time, it does not store information about database roles or other cluster-wide configuration. To store this information, and back up all of your databases simultaneously, you can use `pg_dumpall`.

1.  Create a backup file:

        pg_dumpall > pg_backup.bak

2.  Restore all databases from the backup:

        psql -f pg_backup.bak postgres

## Automate Backups with a Cron Task

You may want to set up a cron job so that your database will be backed up automatically at regular intervals. The steps in this section will set up a cron task that will run `pg_dump` once every week.

1.  Make sure you are logged in as the `postgres` user:

        su - postgres

2.  Create a directory to store the automatic backups:

        mkdir -p ~/postgres/backups

3.  Edit the crontab to create the new cron task:

        crontab -e

4.  Add the following line to the end of the crontab:

    {{< file crontab >}}
0 0 * * 0 pg_dump -U postgres dbname > ~/postgres/backups/dbname.bak
{{< /file >}}

5.  Save and exit from the editor. Your database will be backed up at midnight every Sunday. To change the time or frequency of the updates, see our [Schedule Tasks with Cron](/docs/tools-reference/tools/schedule-tasks-with-cron/) guide.

## Next Steps

PostgreSQL also offers more advanced ways to back up your databases. The [official docs](https://www.postgresql.org/docs/9.1/static/continuous-archiving.html) describe how to set up continuous archiving and point-in-time recovery. This is a much more complex process, but it will maintain a constant archive of your database and make it possible replay PostgreSQL's logs to recover the state of the database at any point in the past.

This method can also be helpful if you have a very large database although continuously archiving a large database consumes resources. Since the process is ongoing, there is no need to make frequent and time consuming full backups.
