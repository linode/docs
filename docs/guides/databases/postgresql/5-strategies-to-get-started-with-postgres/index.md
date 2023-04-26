---
slug: 5-strategies-to-get-started-with-postgres
title: "Five Strategies to Get Started with Postgres"
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Cameron Laird"]
published: 2023-04-25
modified_by:
  name: Linode
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Database work typically involves professional database administrators, expensive hardware, and complicated configuration. However, it's possible to launch a proof-of-concept, portable development environment, or low-cost embedded solution while retaining full compatibility with industrial-strength Postgres installations.

For example, a practice database may be required, but the maintained ones are off-limits as that violates the organization's security policies. In commercial situations, databases are installed and maintained by specialized database administrators, and their priorities do not include setting up practice databases.

This guide covers different techniques to help create a small, yet fully-capable Postgres database instance on a desktop in just a few minutes.

## Comparisons to MySQL, Oracle, and DB2

["The world's most valuable resource is … data"](https://www.economist.com/leaders/2017/05/06/the-worlds-most-valuable-resource-is-no-longer-oil-but-data), as The Economist famously put it in 2017. Most organizational data is maintained in a [Relational Database Management System (RDBMS)](https://www.g2.com/articles/relational-databases). Leading RDBMS include [DB2](https://www.ibm.com/db2), [MySQL](https://www.linode.com/docs/guides/databases/mysql/), [Oracle](https://www.linode.com/docs/guides/databases/oracle/), and [PostgreSQL](https://www.linode.com/docs/guides/databases/postgresql/), often abbreviated as "Postgres". DB2 and Oracle are commercially licensed, while MySQL and Postgres are free and [Open Source](https://www.linode.com/docs/blog/open%20source/).

The theory and [standards of RDBMS](https://blog.ansi.org/2018/10/sql-standard-iso-iec-9075-2016-ansi-x3-135/#gref) use are large. DB2, MySQL, Oracle, and Postgres all adhere to a large percentage of applicable standards, and all four have small gaps in their coverage. The similarities between them are far greater than the differences. DB2 and Oracle are generally chosen by organizations that put a premium on commercial service contracts. MySQL is widely used by millions of applications worldwide, and is many developers' first RDBMS of choice. Conventional thought is that Postgres databases are larger and arguably more capable, or at least fulfill more complicated requirements than corresponding MySQL ones. Although MySQL is tuned for data **retrieval**, Postgres is better at supporting [high-performance updates](https://www.sumologic.com/blog/postgresql-vs-mysql/) and concurrent write operations.

## Five Postgres Quick-Starts

First, prepare a couple of preliminaries to reuse for each quick-start:

1.  Establish a working directory for the Postgres examples in this guide. This might have a value such as `/home/example-user/Postgres` in Linux, `/Users/example-user/Postgres` in macOS, or `C:\Users\example-user\Postrges` in Windows.

1.  In your working directory, create a small practice script called `example.sql` with the following content:

    ```file{title="example.sql" lang="sql"}
    CREATE DATABASE first_database;

    CREATE TABLE customers (
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(30),
        age INT
    );

    INSERT INTO customers (first_name, last_name, age)
    VALUES ('Jane', 'Smith', 44);
    INSERT INTO customers (first_name, last_name)
    VALUES ('Juan', 'Fulano');
    INSERT INTO customers (first_name, age)
    VALUES ('Bakti', 23);
    SELECT * FROM customers ORDER BY last_name;
    ```

    All of the examples below use this same `example.sql` script.

1.  Open a terminal window and navigate to your working directory. Use the following command to interact with the `example.sql` script through the Postgres interpreter command line interface:

    ```command
    psql -U postgres
    ```

1.  Enter the quit command to leave the Postgres interpreter and return to the usual terminal shell:

    ```command
    \q
    ```

### Connect to an Organizational Instance

1.  To connect to a company-wide virtual private network (VPN) and invoke Postgres's `psql` command line interface, launch `psql` as follows:

    ```command
    psql -h $SERVER -U $YOUR_ACCOUNT
    ```

1.  Once at the `psql` command prompt, run the following request:

    ```command
    \i /app/common/example.sql
    ```

    ```output
    CREATE DATABASE
       CREATE TABLE
       INSERT 0 1
       INSERT 0 1
       INSERT 0 1
        first_name | last_name | age
       ------------+-----------+-----
        Juan       | Fulano    |
        Jane       | Smith     |  44
        Bakti      |           |  23
       (3 rows)
    ```

At this point, data can be added to and retrieved from the remote database.

This approach requires working values for `$SERVER`, `$YOUR_ACCOUNT`, and most likely `$YOUR_PASSWORD` before the connection is established.

When providing a small database instance to use for development experiments, it’s common to act as your own database administrator.

It's advantageous to know these possibilities even for those who typically never touch a database directly. For example, a developer may be assigned to program Python, TypeScript, or Rust with no explicit database component. A Quality Assurance (QA) specialist may also need a quick "live" database, instead of waiting for someone to set up a mock production one.

### Instantaneous Postgres in a Container

For quick results when dealing with an unusual platform, work inside a [container](https://www.linode.com/docs/guides/applications/containers/). To experiment with a specific version of a particular language, it's not necessary to learn the peculiarities of that version and that language. Instead, retrieve a standard, tested container that implements that language. With containers, it doesn't matter whether the desktop is Linux, MacOS, or Windows. There's no risk of corrupting language installations, of any version. Working inside a Docker-based container guarantees consistent results whatever the host operating system is, and without destabilizing the existing configuration.

Containers are generally a good fit for database management systems, and that includes Postgres. Thanks to the PostgreSQL Docker community, the [official Docker image for PostgreSQL](https://hub.docker.com/_/postgres) is a trustworthy, convenient resource for practical Postgres work. Here's how to make the most of it:

1.  Confirm the file `postgres/example.sql` (or `postgres\example.sql`) in the file system of your desktop with content mentioned earlier is still present.

1.  Install and launch the Docker engine on your desktop.

1.  With the Docker Engine running, launch a standard Postgres container

    ```
    SOURCE="source=$(pwd)/postgres"
    TARGET=/app/common
    docker run -dit --name postgres1 --rm -it \
               -p 5432:5432 \
               -e POSTGRES_PASSWORD=my_password \
               -e PGDATA=/var/lib/postgresql/data/pgdata \
               -v /tmp:/var/lib/postgresql/data \
               --mount "type=bind,$SOURCE,$TARGET" \
               Postgres
    ```

    Launching this way prints a long hash, something that looks like:

    ```output
    2e1abf0b77caaafe54989ebc51db5c36ed2697c55de98ef4af493
    ```

in your terminal, and returns you to your usual command interpreter.

At this point, you're executing at the command prompt as usual, but a Postgres container named `postgres` is running in the background.

{{< note >}}
If your desktop is based on Windows, your launch looks more like:

```ouput
SET SOURCE="source=%cd%\postgres"
   …
```
{{< /note >}}

1.  Connect to the postgres instance with:

    ```command
    docker exec -it postgres1 /bin/sh
    ```

    You're again at a command prompt, but it's the shell interpreter of the Postgres container, rather than your own usual desktop.

1.  From the container's prompt, run:

    ```command
    psql -U postgres
    ```

    The user or account `postgres` is present by default.

    The psql command line application responds with:

    ```output
    psql (14.4 (Debian 14.4-1.pgdg110+1))
    Type "help" for help.

    postgres=#
    ```

    You're now at the `psql` prompt, within the container, which itself is running in a terminal of your desktop. Keeping these different contexts straight is essential.

    You can immediately enter such commands as `\l` or `\d` which list active databases and active tables, respectively.

1.  Even more meaningful, request:

    ```command
    \i /app/common/example.sql
    ```

    and you see output:

    ```output
    CREATE DATABASE
    CREATE TABLE
    INSERT 0 1
    INSERT 0 1
    INSERT 0 1
     first_name | last_name | age
    ------------+-----------+-----
     Juan       | Fulano    |
     Jane       | Smith     |  44
     Bakti      |           |  23
    (3 rows)
    ```

as in the earlier remote example.

Now you have data in a table of a database container running on your desktop. You have all Postgres' capabilities "containerized" conveniently, and can run your own queries, and updates.

One of the advantages of working inside a container is that you can launch multiple containers on your desktop. If you have long-running experiments to run, or multiple distinct projects, configuration of several different containers is a handy way to keep the different databases from interfering with each other.

### Rapid Installation on Your Operating System of Choice

Another entry point for Postgres work is to create a dedicated virtual machine, and assign it database duties. This is similar to the first example in that the desktop connects to a local database server instead of a remote database server.

Linode supports several operating systems, and provides instructions for standard installations of Postgres on Ubuntu 20.04 LTS, CentOS 8, and several others. With the proper know-how, re-purposing an existing physical machine could also be a cost effective solution.

### Postgres on Raspberry Pi

Another variation is to set up a local testing database server on a Raspberry Pi or similar tiny PC. A capable Linux server with a few dozen gigabytes of mass storage can be purchased for well under $100. Postgres is available through the Raspberry Pi OS package repository, and a standard local system install is well-documented.

That's not to say that quick setups are unique to Raspberry Pi. Most Debian-derived Linux distributions only require a single installation command:

```command
apt install postgresql
```

A small amount of networking configuration and user management can transform many low-end hardware configurations into database servers. Once that first `psql` connection is installed, all of Postgres' capabilities are at hand.

## Conclusion

Postgres is highly portable and easy to set up. Many developers only require small database instances with just a few gigabytes of storage. This requires considerably less infrastructure than a production database that manages many terabytes of data. Because Postgres is consistent across environments, developers can work in their own development-specific instances and simply concentrate on the functions and features. Whatever the circumstances, there's likely an efficient way create a low-cost database server to support programming work.



---

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}


{{< caution >}}
Highlight warnings that could adversely affect a user's system with the Caution style.
{{< /caution >}}

{{< file "/etc/hosts" aconf >}}
192.0.2.0/24      # Sample IP addresses
198.51.100.0/24
203.0.113.0/24
{{< /file >}}
