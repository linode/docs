---
title: "Deploy a Galera Cluster through the Linode Marketplace"
description: "This guide shows how to deploy a MySQL/MariaDB Galera Cluster through the Linode Marketplace."
published: 2023-03-20
modified_by:
  name: Linode
keywords: ['database','mysql','rdbms','relational database','mariadb']
tags: ["database","cloud-manager","linode platform","mysql","marketplace","mariadb"]
external_resources:
- '[MySQL 5.6 Reference Manual](https://dev.mysql.com/doc/refman/5.6/en/index.html)'
- '[PHP MySQL Manual](http://us2.php.net/manual/en/book.mysql.php)'
- '[MySQLdb User''s Guide](http://mysql-python.sourceforge.net/MySQLdb.html)'
authors: ["Linode"]
---

Galera provides a performant MariaDB database solution with synchronous replication to achieve high availability. Galera is deployed with MariaDB, which is an open-source database management system that uses a relational database and SQL (Structured Query Language) to manage its data. MariaDB was originally based off of MySQL and maintains backwards compatibility.

{{< note type="warning" title="Marketplace App Cluster Notice" >}}
This Marketplace App deploys 3 Compute Instances to create a highly available and redundant MeriaDB Galera cluster, each with the plan type and size that you select. Please be aware that each of these Compute Instances will appear on your invoice as separate items. To instead deploy MariaDB on a single Compute Instance, see [Deploy MySQL/MariaDB through the Linode Marketplace](/docs/products/tools/marketplace/guides/mysql/).
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-app-cluster-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The Galera cluster should be fully deployed and configured within 5-10 minutes after the first Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended plan:** Depends on the size of your MySQL database and the amount of traffic you expect.

### Galera Options

- **Cluster Name** *(required)*: Enter the name you wish to use for this cluster deployment.

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) to create one.

- **Add SSH Keys to all nodes** *(required)*: If you select *yes*, any SSH Keys that are added to the root user account (in the **SSH Keys** section), are also added to your limited user account on all deployed Compute Instances.

- **Galera cluster size:** This field cannot be edited, but is used to inform you of the number of Compute Instances that are created as part of this cluster.

#### TLS/SSL Certificate Options

The following fields (in addition to the domain field above) are used when creating your self-signed TLS/SSL certificate.

- **Country or region** *(required)*: Enter the country or region for you or your organization.
- **State or province** *(required)*: Enter the state or province for you or your organization.
- **Locality** *(required)*: Enter the town or other locality for you or your organization.
- **Organization** *(required)*: Enter the name of your organization.
- **Email address** *(required)*: Enter the email address you wish to use for your certificate file. This email address may receive notifications about the state of your certificate, including when it is expired.
- **CA Common name:** This is the common name for the self-signed Certificate Authority.
- **Common name:** This is the common name that is used for the domain.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

## Using MySQL/MariaDB

The standard tool for interacting with MariaDB is the `mysql` client which installs with the `mysql-server` package. The MariaDB client is used through a terminal.

### Root Login

1.  To log in to MySQL as the root user:

    ```command
    sudo mysql -u root -p
    ```

1.  When prompted, enter the MySQL root password that you set when launching the Marketplace App. You'll then be presented with a welcome header and the MySQL prompt as shown below:

    ```command
    MariaDB [(none)]>
    ```

1.  To generate a list of commands for the MySQL prompt, enter `\h`. You'll then see:

    ```output
    List of all MySQL commands:
    Note that all text commands must be first on line and end with ';'
    ?         (\?) Synonym for `help'.
    clear     (\c) Clear command.
    connect   (\r) Reconnect to the server. Optional arguments are db and host.
    delimiter (\d) Set statement delimiter. NOTE: Takes the rest of the line as new delimiter.
    edit      (\e) Edit command with $EDITOR.
    ego       (\G) Send command to mysql server, display result vertically.
    exit      (\q) Exit mysql. Same as quit.
    go        (\g) Send command to mysql server.
    help      (\h) Display this help.
    nopager   (\n) Disable pager, print to stdout.
    notee     (\t) Don't write into outfile.
    pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
    print     (\p) Print current command.
    prompt    (\R) Change your mysql prompt.
    quit      (\q) Quit mysql.
    rehash    (\#) Rebuild completion hash.
    source    (\.) Execute an SQL script file. Takes a file name as an argument.
    status    (\s) Get status information from the server.
    system    (\!) Execute a system shell command.
    tee       (\T) Set outfile [to_outfile]. Append everything into given outfile.
    use       (\u) Use another database. Takes database name as argument.
    charset   (\C) Switch to another charset. Might be needed for processing binlog with multi-byte charsets.
    warnings  (\W) Show warnings after every statement.
    nowarning (\w) Don't show warnings after every statement.

    For server side help, type 'help contents'

    MariaDB [(none)]>
    ```

1.  Grant access to the database that you created when launching the Marketplace App for **MySQL User**. In this example, the database is called `webdata`, the user `webuser`, and password of the user is `password`. Be sure to enter your own password. This should be different from the root password for MySQL:

    ```command
    GRANT ALL ON webdata.* TO 'webuser' IDENTIFIED BY 'password';
    ```

1.  To Exit MySQL/MariaDB type:

    ```command
    exit
    ```

### Create a Sample Table

1.  Log back in as **MySQL User** that you set when launching the Marketplace App. In the following example the **MySQL User** is `webuser`.

    ```command
    sudo mysql -u webuser -p
    ```

2.  Create a sample table called `customers`. This creates a table with a customer ID field of the type `INT` for integer (auto-incremented for new records, used as the primary key), as well as two fields for storing the customer's name. In the following example `webdata` is the database that you created when launching the Marketplace App.

    ```command
    use webdata;
    create table customers (customer_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, first_name TEXT, last_name TEXT);
    ```

3.  To view the contents of the table that you created:

    ```command
    describe customers;
    ```

    The output would be:

    ```output
    +-------------+---------+------+-----+---------+----------------+
    | Field       | Type    | Null | Key | Default | Extra          |
    +-------------+---------+------+-----+---------+----------------+
    | customer_id | int(11) | NO   | PRI | NULL    | auto_increment |
    | first_name  | text    | YES  |     | NULL    |                |
    | last_name   | text    | YES  |     | NULL    |                |
    +-------------+---------+------+-----+---------+----------------+
    ```

4. Then exit MySQL/MariaDB.

    ```command
    exit
    ```

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on MySQL/MariaDB, checkout the following guides:

- [MariaDB Clusters with Galera](/docs/guides/set-up-mariadb-clusters-with-galera-debian-and-ubuntu/)
