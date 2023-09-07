---
slug: mongodb-community-shell-installation
description: 'This tutorial explains how to install the MongoDB Community Shell on macOS, Windows 10, and Debian-based Linux systems.'
keywords: ['mongodb community shell', 'mongosh', 'mongodb']
tags: ['debian', 'database']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-10
modified_by:
  name: Linode
title: "Install and Use the MongoDB Community Shell"
authors: ["Tom Henderson"]
tags: ["saas"]
---

MongoDB is a non-relational, document-oriented database that can operate over many hosts, database shards, and collections. A key feature of MongoDB is its ability to associate disparate data types and sources into quickly returned results that link data together. The MongoDB shell can be used to perform queries, update records, and find useful correlations among collections. The MongoDB Shell provides a command-line interface to your database and can run all MongoDB queries. It prints error messages, modifies data, and provide access to JavaScript using JSON queries. This tutorial explains how to install the MongoDB Community Shell on macOS, Windows 10, and Debian. It also shows you how to connect to a MongoDB deployment and provides tips on using the MongoDB Shell with examples.

## Install the MongoDB Shell on Windows 10, macOS, and Linux

### Prerequisites

- Ensure you have deployed a MongoDB server instance.

- You must have access to your MongoDB server instance and the necessary credentials to connect to your database.

### Install the MongoDB Shell on macOS

The steps in this section work on macOS 13.0 and above.

1.  [Download the MongoDB Shell for macOS 11+](https://www.mongodb.com/try/download/shell?jmp=docs) from the MongoDB website.

1.  Unzip the downloaded zip file onto the host and extract the binaries. Replace `mongosh-1.0.5-darwin-x64.zip` in the command below with the name of the file you downloaded.

        unzip mongosh-1.0.5-darwin-x64.zip

1.  Copy the binaries (`mongosh` and `mongocryptd-mongosh`) to a location available to your system's PATH.

        cp ~/bin/mongosh /usr/local/bin
        cp ~/bin/mongocryptd-mongosh /usr/local/bin

1.  Under some circumstances, the extraction process does not correctly set the binaries (`mongosh` and `mongocryptd-mongosh`) as executable. These files are contained in the `/usr/bin/` directory. Set them as executable using the commands below:

        chmod +x ~/bin/mongosh
        chmod +x ~/bin/mongocryptd-mongosh

1.  A shared version on the same host must similarly have these settings changed; an example using the shared location `/usr/local/bin` is shown below:

        chmod +x /usr/local/bin/mongosh
        chmod +x /usr/local/bin/mongocryptd-mongosh

    Depending on where you are placing the unzipped files, the location cited can change. You should change the directory argument to suit your file installation location.

1.  Add the `mongosh` and `mongocryptd` binaries to your PATH.

{{< note >}}
If, upon invocation, `mongosh` doesn't execute, it may be necessary (depending on the version of macOS) to navigate to *Application Security* in *System Preferences*. Then, verify that `mongosh` and `mongocryptd` have the correct permissions.
{{< /note >}}

### Install the MongoDB Shell on Debian Linux

MongoDB server instances installed with a Linux package manager (`apt` or `rpm`) often have the MongoDB Shell already installed. To verify that `mongosh` is installed, issue the following command to connect to your MongoDB server:

    mongosh

If `mongosh` is already installed, you can skip this section. To proceed with the installation follow the steps below.

1.  Download the MongoDB Linux tarball using the `wget` command.

        wget tar -zxvf mongosh-1.0.6-linux-x64.tgz

1.  Install MongoDB by extracting the tarball.

        tar -zxvf mongosh-1.0.6-linux-x64.tgz

    This installs the tarball into your home directory, `/home/<user>/mongosh-1.0.6-linux-x64/`.

1.  Copy the binaries after unzipping the library to a shareable place:

        cp ~/mongosh-1.0.6-linux-x64/bin/mongosh /usr/local/bin
        cp ~/mongosh-1.0.6-linux-x64/bin/mongocryptd-mongosh /usr/local/bin

1.  Under some circumstances, the unzipping/extraction process does not correctly set the binaries (`mongosh` and `mongocryptd-mongosh`) as executable. These files are contained in the `/usr/bin/` directory. Set them as executable using the commands below:

        chmod +x ~/bin/mongosh
        chmod +x ~/bin/mongocryptd-mongosh

    A shared version on the same host must similarly have the following settings changed:

        chmod +x /usr/local/bin/mongosh
        chmod +x /usr/local/bin/mongocryptd-mongosh

    Depending on where you place the unzipped files, the location cited can change. You should change the directory argument to suit your file installation location.

### Install MongoDB Shell on Windows 10

1.  Ensure that all upgrades, patches, and fixes have been applied to the Windows 10 host.

1.  Open a web browser and navigate to `https://www.mongodb.com/try/download/shell?jmp=docs`.

1.  Choose the **Windows 64-bit (8.1+) (MSI)** download link.

1.  Go to the path where `mongosh` binary is installed and copy the path.

1.  Using the following steps, add the `mongosh` binary path to the Windows 10 environment variables.

    - On the Windows 10 search bar, search for *environment variable* and select the **Edit the system environment variables** option.
    - The **System Properties** modal is displayed. Click **Environment Variables**.
    - Under the **System variables** section, select **Path** and click **New**.
    - Add the `mongosh` binary path that you copied earlier and click **OK** to finish the setup.

1.  To confirm the path variable has been modified, open the Windows 10 command prompt and enter the `mongosh --help` command. If your Windows 10 path is configured correctly, a list of valid commands is displayed.

1.  If no listing of MongoDB Shell commands is displayed, then check the path variable in a Windows command prompt by entering the command below:

        set

    The path should be listed where you placed the directory folder containing `mongosh`. You can search for a missing location with **Explorer**, and re-enter the path variable as described above.

## Connect to the MongoDB Shell

MongoDB Shell requires a database to connect to; its installation does not include a working MongoDB database instance. If you already created a database on your MongoDB Server instance, then you don't need to create a new database.

Connecting to the database requires access credentials. The information required is the host to connect to, and optionally, username, password, and options where needed. You also need the port number that your MongoDB instance listens to for connections. By default, the port number is `27017`.

-   To connect to a MongoDB instance that is located on the same host as the MongoDB shell instance, issue the following command:

        mongosh

-   If the MongoDB instance is on another host, use the following command:

        mongosh "mongodb://mongodb0.example.com”

    This command uses the default port of `27017`.

    If the port is different, the command must match the listening port on the remote host. For example:

        mongosh “mongodb://mongodb5.example.com:14033”

    In this example, MongoDB is listening on port `14033`. It is recommended that remote host transport layer security (TLS) connectivity is used. Append the string `/?tls=true` to the host URL to add TLS encryption to the connection.

## Using The MongoDB Shell

Once MongoDB Shell is successfully installed, it can connect to one or more MongoDB instances, shards, replicas, or clusters. The MongoDB shell is used for a wide number of tasks. This section describes the most common tasks like connecting and authenticating, changing and configuring, querying, and ending a session.

While you’re working inside `mongosh`, you can use the **tab** key to complete commands as a shortcut. When multiple options are available, you can scroll through these to choose the correct choice. Then type the **tab** key until your syntax is correct.

### Show Databases with the MongoDB Shell

1.  Connect to the desired database.

        use <database>

1.  To show the databases in the instance, use the `dbs` command.

        dbs

    The example below displays the output for a freshly installed MongoDB instance.

    {{< output >}}
Current Mongosh Log ID: 6176fbfecf18bc0a0556370f
Connecting to:          mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
Using MongoDB:          4.4.10
Using Mongosh:          1.0.6

For `mongosh` info see: https://docs.mongodb.com/mongodb-shell/


To help improve our products, anonymous usage data is collected and sent to MongoDB periodically (https://www.mongodb.com/legal/privacy-policy).
You can opt-out by running the `disableTelemetry()` command.

------
   The server generated these startup warnings when booting:
   2021-10-25T18:38:23.243+00:00: Using the XFS filesystem is strongly recommended with the WiredTiger storage engine. See http://dochub.mongodb.org/core/prodnotes-filesystem
   2021-10-25T18:38:24.211+00:00: Access control is not enabled for the database. Read and write access to data and configuration is unrestricted
------

test> show dbs
admin     41 kB
config  12.3 kB
local     41 kB
    {{</ output >}}

### Change Databases with the MongoDB Shell

To change or switch to a different database in the MongoDB shell:

1.  First, list all the databases available on MongoDB using the command below:

        show dbs

1.  Then, connect to the desired database.

        use <name of database>

### Add a Record to a Collection

To add a record to a collection, use the `insert` or `insertOne` command. For example, viewing a database named `UsedCars`, insert a new record with the following command:

    UsedCars> db.inventory.insertOne({"usedCarLot" : "Northeast NJ", modelName: "Yaris", "year" : 2004,})
    {
      acknowledged: true,
      insertedId: ObjectId("6176fdafde3be0a0eebf7917")
    }

### List Collections with the MongoDB Shell

1.  To list collections in MongoDB from the MongoDB Shell, switch to the desired database using the following command.

        use <database>

1.  Then list all the databases collections:

        show collections

## Uninstall the MongoDB Shell

{{< note type="alert" >}}
When using the `rm` command ensure you are removing the desired file and directory. You cannot recover files or directories once they are removed.
{{< /note >}}

### Linux

To remove MongoDB shell, remove the executable files from where they were placed during installation. For example:

    rm -ri /usr/local/bin/mongosh
    rm -ri /usr/local/bin/mongocryptd-mongosh

### macOS

To remove MongoDB Shell, remove the executable files from where they were placed during installation. For example:

    rm -r /usr/local/bin/mongosh
    rm -r /usr/local/bin/mongocryptd-mongosh

### Windows

- As a Windows 10 administrator, open the command prompt.

- Invoke the `set` command to expose where the MongoDB Shell is located.

- Determine the location of the executable files, and delete them.

