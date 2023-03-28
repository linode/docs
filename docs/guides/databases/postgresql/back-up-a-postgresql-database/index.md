---
slug: back-up-a-postgresql-database
description: "Learn how to back up your PostgreSQL database with this guide for single database, multiple databases, and automated backups. ✓ Click & read!"
og_description: "This guide shows how to create backups of your PostgreSQL databases using pg_dump and use them to restore a lost or broken database."
keywords: ['postgres', 'postgresql', 'backup', 'sql dump', 'pg_dump', 'psql']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-18
modified: 2022-01-14
modified_by:
  name: Jared Kobos
title: "Back up a PostgreSQL Database with pg_dump"
external_resources:
- '[PostgreSQL Documentation](https://www.postgresql.org/docs/9.1/static/)'
tags: ["database","postgresql"]
aliases: ['/databases/postgresql/how-to-back-up-your-postgresql-database/','/guides/how-to-back-up-your-postgresql-database/']
image: back-up-postgresql-database-title.jpg
authors: ["Jared Kobos"]
---

If you are using PostgreSQL in a production environment, it is important to take precautions to ensure that your users' data is not lost. By frequently backing up your database, automating backups with a cron task, you can restore your system when your database is lost or corrupted. Fortunately, PostgreSQL includes tools to make this task simple and easy to manage. Learn how to backup your PostgreSQL database in Linux, in this guide.

## Before You Begin

You should have a working installation of PostgreSQL on your system before beginning this guide. Go through our [How to Install PostgreSQL on Ubuntu guide](/docs/guides/how-to-install-postgresql-on-ubuntu-16-04/) to install PostgreSQL and create a sample database.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## One-Time SQL Dump

### Single Database

PostgreSQL provides the `pg_dump` utility to simplify backing up a single database. This command must be run as a user with read permissions to the database you intend to back up.

1.  Log in as the `postgres` user:

        su - postgres

1.  Dump the contents of a database to a file by running the following command. Replace `dbname` with the name of the database to be backed up.

        pg_dump dbname > dbname.bak

    After performing the PostgreSQL load dump into a file, the resulting backup file containing the database is `dbname.bak`. This file can be transferred to another host with `scp` or stored locally for later use.

1.  To demonstrate how to load a database in PostgreSQL and restore lost data, first delete your example database and then create an empty database:

        dropdb dbname
        createdb dbname

1.  Restore the database using `psql`:

        psql test < dbname.bak

    There are several options for the backup format:

     - `*.bak`: compressed binary format
     - `*.sql`: plaintext dump
     - `*.tar`: tarball

After you restore a database using `pg_dump`, you can query the database to collect statistics about the database using:

    analyze dbname

### Remote Database

Just as `psql` allows you to connect to a remote host, `pg_dump` can be run from a client computer to back up data on a remote server. Use the `-h` flag to specify the IP address of your Linode and `-p` to identify the port on which PostgreSQL is listening:

    pg_dump -h 198.51.100.0 -p 5432 dbname > dbname.bak

### All Databases

Because `pg_dump` only creates a backup of one database at a time, it does not store information about database roles or other cluster-wide configuration. To store this information, and back up all of your databases simultaneously, you can use `pg_dumpall`.

1.  Create a backup file:

        pg_dumpall > pg_backup.bak

1.  Restore all databases from the backup:

        psql -f pg_backup.bak postgres

## Automate Backups with a Cron Task

In this section, learn how to import a database in PostgreSQL and automate the process. To do this you need to set up a cron job so that your database backs up automatically at regular intervals. The steps in this section sets up a cron task that runs `pg_dump` once every week.

1.  Make sure you are logged in as the `postgres` user:

        su - postgres

1.  Create a directory in the `postgres` user's home to store the automatic backups:

        mkdir -p ~/backups

1.  Edit the crontab to create the new cron task:

        crontab -e

1.  Add the following line to the end of the crontab:

    {{< file crontab >}}
0 0 * * 0 pg_dump -U postgres dbname > ~/postgres/backups/dbname.bak
{{< /file >}}

1.  Save and exit from the editor. Your database is set to back up at midnight every Sunday. To change the time or frequency of the updates, see our [Schedule Tasks with Cron](/docs/guides/schedule-tasks-with-cron/) guide.

It is always a good idea to export a Postgres database before any major changes in structure or the installation of a new application. This applies to a Postgres import dump from a remote server.

## Check PostgreSQL Backup Status

You can set up error logging to check on the status of your PostgreSQL automated backups. If you aren’t creating a log file for your PostgreSQL, create one by adding the following at the end of your cron job.

1.  Make sure you are logged in as the `postgres` user:

        su - postgres

1.  Create a directory in the `postgres` user's home to store your error log files:

        mkdir -p ~/logs

1.  Edit the crontab to modify the cron task:

        crontab -e

1.  Modify the cron task line to output and append any backup errors to a log file:

    {{< file crontab >}}
0 0 * * 0 pg_dump -U postgres dbname > ~/backups/dbname.bak 2>> ~/logs/dbname.bak.log
{{< /file >}}

1. If your system is capable of sending emails, you can also configure your cron task to send an email alert whenever there is a PostgreSQL backup error. For example, if `mailx` is installed and enabled for the `postgres` user, the following cron task sends the last line of your log file whenever an error occurs:

    {{< file crontab >}}
0 0 * * 0 pg_dump -U postgres dbname > ~/backups/dbname.bak 2>> ~/logs/dbname.bak.log || tail -1 ~/logs/dbname.bak.log | mailx 'example@linode.com' -s "Postgresql backup failure!"
{{< /file >}}

    Now, if there are any issues with the backup, you should receive an email containing the error.

## Next Steps

PostgreSQL also offers more advanced ways to back up your databases. The [official docs](https://www.postgresql.org/docs/9.1/static/continuous-archiving.html) describe how to set up continuous archiving and point-in-time recovery. This is a much more complex process, but it can maintain a constant archive of your database. You can replay PostgreSQL's logs to recover the state of the database at any point in the past.

This method can also be helpful if you have a very large database although continuously archiving a large database consumes resources. Since the process is ongoing, there is no need to make frequent and time consuming full backups.
