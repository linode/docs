---
author:
  name: Linode
  email: docs@linode.com
title: "Migrate a MongoDB Database to a Managed Database"
description: "Learn how to migrate an existing MongoDB database to Linode's Managed Database service."
published: 2022-06-17
---

This guide covers how to migrate an existing MongoDB database to a Managed Database using the `mongodump` and `mongorestore` utilities.

When migrating a database, there are two important terms to keep in mind: the *source* database and the *target* database.

- **Source database:** The original database running on a software, system, or machine that you wish to decommission. This could be MongoDB running within your own Linux server, a development database on your local machine, or even a cloud database.
- **Target database:** The new replacement database that you wish to use. For this guide, the target database will be a Managed Database running on Linode's platform.

Your individual migration workflow could deviate from the instructions provided here. You may need to consult with your developers or your application's documentation to learn how to perform some of these steps and to gather any best practices. You should also perform the migration on a staging server first and/or during a time when downtime least affects your users and/or business.

## Before You Begin

-   **Create a Managed Database:** To minimize downtime, make sure to create your Managed Database database cluster *before* continuing. This ensures that your database has been fully provisioned (which can take up to 30 minutes) and that you have the new database credentials available. See [Create a Managed Database](/docs/products/databases/managed-databases/guides/create-database/).

-   **Verify the MongoDB Database Tools are installed** on whichever system you intend to use when exporting and importing the database. MongoDB Database Tools include the `mongodump` and `mongorestore` utilities, alongside other tools that can be used for working with MongoDB deployments. Starting with MongoDB v4.4, these tools have been packaged separately from the database software itself. They are compatible with MongoDB v4.0 and above. To determine if the tools are installed on your system, run the following command.

        mongodump --version

    If you receive an output with the version number, the tools are installed. If not, follow the instructions in the [Install MongoDB Database Tools](#install-mongodb-database-tools) section.

## Install MongoDB Database Tools

MongoDB Database Tools can be downloaded directly from the [MongoDB Download](https://www.mongodb.com/try/download/database-tools) page by selecting your platform and clicking the **Download** button. The latest installation instructions can be found in the [Installing the Database Tools](https://www.mongodb.com/docs/database-tools/installation/installation/) guide.

-   **Windows:**

    Follow the instructions above to download the appropriate package directly from MongoDB's website.

-   **macOS:**

    On macOS, MongoDB Database Tools can be installed through [Homebrew](https://brew.sh/). For more instructions, see [Installing the Database Tools on macOS](https://www.mongodb.com/docs/database-tools/installation/installation-macos/).

    1.  Add the [MongoDB formulae repository](https://github.com/mongodb/homebrew-brew) to Homebrew:

            brew tap mongodb/brew

    1.  Install the `mongodb-database-tools` package:

            brew install mongodb-database-tools

-   **Linux:**

    The toolset is available as a .deb (for Ubuntu 20.04 and 18.04), .rpm (for CentOS/RHEL), or as a compressed tarball for nearly any Linux distribution. For more instructions, see [Installing the Database Tools on Linux](https://www.mongodb.com/docs/database-tools/installation/installation-linux/).

    1.  In the [MongoDB Download Center](https://www.mongodb.com/try/download/database-tools) under the **MongoDB Database Tools** section, select the corresponding x86_64 package for your Linux distribution. Verify that the package is either a *deb* or *rpm*, not *tgz*. Click the **Copy Link** text next to the **Download** button.

    1.  Download the file to your Linux system. In the command below, replace *[download-url]* with url you copied in the previous step.

            curl -O [download-url]

    1.  Install the package through your system's package manager. Replace *[filename]* with the name of the file you just downloaded.

        **apt (.deb)** (Ubuntu and Debian):

            sudo apt install ./[filename]

        **yum (.rpm)** (CentOS Stream, CentOS, AlmaLinux, Rocky Linux)

            sudo yum install -y [filename]

## Export from the Source Database

Exporting the data from the original database is facilitated through the [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) utility. The following commands create a BSON export of the contents of a specified database. Replace *[username]* with your database user, *[database-name]* with the name of your database, and *[host]* with the hostname/domain of your source database. For Linode Managed Databases, see [Connect to a MongoDB Database](/docs/products/databases/managed-databases/guides/mongodb-connect/#view-connection-details) for connection details.

-   **Standalone cluster (single node)**

        mongodump --username=[username] --host=[host]:27017 --db=[database-name] --gzip --archive=database.archive

-   **High availability cluster (3 nodes)**

    When connecting to a high availability cluster, input each host (along with the port) separated by a comma. You must also replace *[replica-set]* with the replica set of your source database.

        mongodump --username=[username] --host=[replica-set]/[host1]:27017,[host2]:27017,[host3]:27017 --db=[database-name] --gzip --archive=database.archive

{{< note >}}
If your source database is also a Linode Managed Database, add the following options to either of the above commands: `--authenticationDatabase=admin --ssl --sslCAFile=[certificate-file]`. Replace *[certificate-file]* with the filename and path of your CA Certificate (see [Connection Details](/docs/products/databases/managed-databases/guides/mongodb-connect/#view-connection-details)).
{{</ note >}}

See the [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) documentation to learn more about the [options](https://www.mongodb.com/docs/database-tools/mongodump/#options) available for this utility and to view common [examples](https://www.mongodb.com/docs/database-tools/mongodump/#examples).

## Import to the Target Managed Database

Once you've successfully backed up the source database, you can import your data into your Managed Database (the *target* database). To import the database, this guide covers the [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/) utility, which is the counterpart to mongodump. It restores a BSON dump created by mongodump to a MongoDB database instance. In the below commands, replace *[database-name]* with the name of your database and replace *[host]* with the hostname of your Managed Database (see [Connection Details](/docs/products/databases/managed-databases/guides/mongodb-connect/#view-connection-details)).

-   **Standalone cluster (single node)**

        mongorestore --username=linroot --host=[host]:27017 --nsInclude="[database-name].*" --ssl --sslCAFile=[certificate-file] --gzip --archive=database.archive

-   **High availability cluster (3 nodes)**

    When restoring to a high availability cluster, input each host (along with the port) separated by a comma. You must also replace *[replica-set]* with the replica set defined for your Managed Database and replace *[host1]*, *[host2]*, and *[host3]* with the hostnames of your Managed Database (see [Connection Details](/docs/products/databases/managed-databases/guides/mongodb-connect/#view-connection-details)).

        mongorestore --username=linroot --host=[replica-set]/[host1]:27017,[host2]:27017,[host3]:27017 --nsInclude="[database-name].*" --ssl --sslCAFile=[certificate-file] --gzip --archive=database.archive

This assumes your database backup file is called *database.archive* and is located in your current directory (as per previous steps in this guide). If you used a different filename or path for your backup, replace *database.archive* as needed in the above command.

See the [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/) documentation to learn more about the [options](https://www.mongodb.com/docs/database-tools/mongorestore/#options) available for this utility and to view common [examples](https://www.mongodb.com/docs/database-tools/mongorestore/#examples).