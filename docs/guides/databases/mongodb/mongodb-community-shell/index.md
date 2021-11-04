---
slug: mongodb-community-shell
author:
  name: Tom Henderson
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-11-03
modified_by:
  name: Linode
title: "Install and Use the MongoDB Community Shell"
h1_title: "How to Install and Use the MongoDB Community Shell"
enable_h1: true
contributor:
  name: Tom Henderson
---

MongoDB is a NoSQL database that can operate over many hosts, database shards, and collections. It supports non-relational, document-oriented databases. A key feature of MongoDB is it's ability to associate disparate data types and sources into quickly returned results that link data together. The MongoDB shell can be used to perform queries, update records, and find useful correlations among collections. The MongoDB Shell provides a command-line interface to areas of your database. It can run all MondoDB queries, prints error messages, modifies data, and provides access to JavaScript using JSON queries. This tutorial explains how to install the MongoDB Community Shell on macOS, Windows, and Debian-derivative Linux systems. It also shows you how to connect to a MongoDB deployment, provides tips on using the MongoDB Shell with examples.

## Install the MongoDB Shell on Windows, macOS, and Linux

### Prerequisites

- Ensure you have deployed a MongoDB server instance. You can use the [Linode Marketplace App](/docs/guides/mongodb-marketplace-app/) to deploy a MongoDB server instance.

- You must have access to your MongoDB server instance and the necessary credentials to connect to your database.

### Install the MongoDB Shell for macOS

The steps in this section work on macOS 13.0 and above.

1. [Download the MongoDB Shell for macOS 11+](https://www.mongodb.com/try/download/shell?jmp=docs) from the MongoDB website.

1. Unzip the downloaded zip file onto the host and extract the binaries. Replace `mongosh-1.0.5-darwin-x64.zip` with the name of your own download.

        unzip mongosh-1.0.5-darwin-x64.zip

1. Copy the binaries after unzipping the library to a location available to your system's PATH.

        cp ~/bin/mongosh /usr/local/bin
        cp ~/bin/mongocryptd-mongosh /usr/local/bin

1. Under some circumstances, the unzipping/extraction process does not correctly set the binaries (mongosh and mongocryptd-mongosh) as executable. These files are contained in the /usr/bin/ directory. Set them as executable with these two commands:

        chmod +x ~/bin/mongosh
        chmod +x ~/bin/mongocryptd

1. A shared version on the same host must similarly have these settings changed; an example using the shared location `/usr/local/bin` is shown below:

        chmod +x /usr/local/bin/mongosh
        chmod +x /usr/local/mongocryptd

    Depending on where you are placing the unzipped files, the location cited can change, and you need to change the directory argument to suit your file installation location.

1. Add the `mongosh` and `mongocryptd` binaries to your PATH.

{{< note >}}
If, upon invocation, `mongosh` doesn't execute, it may be necessary (depending on the version of macOS) to navigate to *Application Security* in *System Preferences*. Then, verify that `mongosh` and `mongocryptd` have the correct permissions.
{{</ note >}}

### Install the MongoDB Shell for Linux

{{< note >}}
MongoDB server instances installed with a Linux package manager (`apt` or `rpm`) often have the MongoDB Shell already installed. This also includes the [Linode Marketplace MondoDB Server instance](/docs/guides/mongodb-marketplace-app/). To verify that `mongosh` is installed, connect to your MongoDB server and issue the following command:

        mongosh

If `mongosh` is already installed, you can skip this section.
{{</ note >}}

1. [Download the MongoDB Linux](https://downloads.mongodb.com/compass/mongosh-1.0.6-linux-x64.tgz) tarball.

1. Install the MongoDB by extracting the tarball.

        tar -zxvf mongosh-1.0.6-linux-x64.tgz

    This installs the tarball into your home directory, `/home/<user>/mongosh-1.0.6-linux-x64/`.

1. Copy the binaries after unzipping the library to a shareable place:

        cp ~/mongosh-1.0.6-linux-x64/bin/mongosh /usr/local/bin
        cp ~/mongosh-1.0.6-linux-x64/bin/mongocryptd-mongosh /usr/local/bin

1. Under some circumstances, the unzipping/extraction process does not correctly set the binaries (`mongosh` and `mongocryptd-mongosh`) as executable. These files are contained in the `/usr/bin/` directory. Set them as executable with these two commands:

        chmod +x ~/bin/mongosh
        chmod +x ~/bin/mongocryptd

    A shared version on the same host must similarly have the following settings changed:

        chmod +x /usr/local/bin/mongosh
        chmod +x /usr/local/mongocryptd

    Depending on where you place the unzipped files, the location cited can change, and you need to change the directory argument to suit your file installation location.

### Install MongoDB Shell on Windows

1. Assure that all upgrades, patches, and fixes have been applied to the Windows host.

1. Open a web browser and navigate to `https://www.mongodb.com/try/download/shell?jmp=docs`.

1. Choose the Windows 64 MSI download link. Follow the instructions to install MongoDB SHell.

1. Add the path where MongoDB Shell is installed to your environmental variables:

    - Open the **Control Panel**
    - Choose **System and Security**, then choose **Security** in the Windows UI
    - Choose **Advanced** system settings, then **System Properties**
    - Choose **Environmental Variables**
    - Choose **Path**, then choose **New**, then add the path you chose for MongoDB Shell into the path arguments.
    - Click **OK** to finish this step.

1. To confirm the path variable has been modified, invoke MongoDB Shell by typing the **Windows Key**, and in the blank box in the lower left of the **Applications** window, enter:

        mongosh --help

1. If no listing of MongoDB Shell commands is displayed, then check the path variable in a Windows **CMD** window by typing:

        set

    The path should be listed where you placed the directory folder containing `mongosh`. You can search for a missing location with **Explorer**, and re-enter the path variable as described above.

## Connect to the MongoDB Shell

MongoDB Shell requires a database to connect to; its installation does not include a working MongoDB database instance unless this was installed on a Linode Marketplace MongoDB Server instance.

Connecting to the database requires access credentials. The information required is the host to connect to, and optionally, the username and password, and options where needed. For all MongoDB instances, there is also a port where the MongoDB instance listens for connections. This port is normally, by default, `27017`.

- To connect to a MongoDB instance that is located on the same host as the MongoDB shell instance, issue the following command:

        mongosh

    This uses the default port.

- If the MongoDB instance is on another host, use the following command:

        mongosh "mongodb://mongodb0.example.com”

    This command uses the default port of `27017`.

    If the port is different, the command must match the listening port on the remote host. For example:

        mongosh “mongodb://mongodb5.example.com:14033”

    In this example, MongoDB is located at port `14033`. It is recommended that remote host transport layer security/TLS connectivity is used. Append the string `/?tls=true` to the host URL to add TLS encryption to the connection.

## Using The MongoDB Shell

Once successfully installed, the MongoDB shell connects to one or more MongoDB instances, shards, replicas, or clusters. The shell is used for a wide number of tasks. This section describes the most common tasks like connecting and authenticating, changing and configuring, querying, and ending a session.

While you’re working inside the `mongosh`, you can use the **tab** key to complete commands as a shortcut. When multiple options are available, you can scroll through these to choose the correct choice. Then type the **tab** key until your syntax is correct.

### Show Databases with the MongoDB Shell

1. Connect to the desired database.

        use <database>

1. To show the databases in the instance, use the `dbs` command:

        dbs

    The example below displays the output for a freshly installed MongoDB instance:

    {{< output >}}
To be filled in
    {{</ output >}}

### Change Database with MongoDB Shell

To change which database is in use in the MongoDB shell use the following command:

        use <name of database>

### Add A Record To A Collection

To add a record to a collection, use the `insert` or `insertOne` command. For example, viewing a database named `UsedCars`, insert a new record with the following command:

        UsedCars> db.inventory.insertOne({"usedCarLot" : "Northeast NJ", modelName: "Yaris", "year" : 2004,})
        {
          acknowledged: true,
          insertedId: ObjectId("6176fdafde3be0a0eebf7917")
        }

### List Collections with the MongoDB Shell

1. To list collections in MongoDB from the MongoDB Shell, switch to the desired database using the following command

        use <database>

1. Then list all the databases collections:

        show collections

## Uninstall the MongoDB Shell

### Linux

To remove MongoDB shell, remove the executable files from where they were placed during installation. For example:

    rm -r /usr/local/mongosh
    rm -r /usr/local/mongocryptd

### macOS

To remove MongoDB Shell, remove the executable files from where they were placed during installation. For example:

    rm -r /usr/local/mongosh
    rm -r /usr/local/mongocryptd

### Windows

- Using the **CMD** command running on an **Administrator** account.

- Invoke the `set` command to expose where the MongoDB Shell is located:
    set

- Determine the location of the executable files, and delete them.

