---
slug: install-mongodb-on-ubuntu-20-04
description: 'This guide explains how to install MongoDB on Ubuntu 20.04'
keywords: ['install MongoDB','use MongoDB','configure MongoDB','what is MongoDB']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2023-01-12
modified_by:
  name: Linode
title: "Installing MongoDB on Ubuntu 20.04"
title_meta: "How to Install MongoDB on Ubuntu 20.04"
external_resources:
- '[MongoDB](https://www.mongodb.com/)'
- '[MongoDB Documentation](https://www.mongodb.com/docs/manual/introduction/)'
- '[Getting Started tutorial](https://www.mongodb.com/docs/manual/tutorial/getting-started/)'
- '[MongoDB Configuration File documentation](https://www.mongodb.com/docs/manual/reference/configuration-options/)'
- '[SQL to MongoDB Mapping Chart](https://www.mongodb.com/docs/manual/reference/sql-comparison/)'
- '[MongoDB Troubleshooting Guide](https://www.mongodb.com/docs/manual/reference/installation-ubuntu-community-troubleshooting/)'
relations:
    platform:
        key: how-to-install-mongodb
        keywords:
           - distribution: Ubuntu 20.04
authors: ["Jeff Novotny"]
---

[MongoDB](https://www.mongodb.com/) is a *NoSQL* database that provides an alternative to *Relational DataBase Management System* (RDBMS) applications such as MySQL and MariaDB. This guide introduces MongoDB and explains how to install the latest release on Ubuntu 20.04.

## What is MongoDB?

MongoDB is a *document-oriented database*. It stores data in a more flexible manner than a traditional relational database. It aligns well with object-oriented models and is a good choice for unstructured or semi-structured data. MongoDB is considered easy to learn and use compared to SQL-based databases. It is designed as a distributed database for easy scalability and additional redundancy.

MongoDB is considered a NoSQL database because it does not use the *Structured Query Language* (SQL) to store and retrieve data. Administrators typically use the MongoDB Query API instead to modify documents and retrieve document data. They can also base queries on regular expressions or JavaScript functions. Additionally, MongoDB does not add an entry as a row inside a table. It stores data in documents using the *Binary JSON* (BSON) file format. BSON is a variation of *JavaScript Object Notation* (JSON) format that encodes a sequence of attribute-value pairs into binary data. This format reduces storage space and increases efficiency at the expense of readability.

The format of MongoDB documents is relatively unstructured, so each document can be different. The only real restriction is that a document must consist of a list of fields, each containing a key-value pair. The document schema does not have to be defined beforehand and users can adjust the format at any time. MongoDB can group multiple documents together into a *collection*. Because MongoDB is not a relational database, there are no implied connections between any documents or collections.

The MongoDB Community Edition, which is designed for individuals or small businesses, is free to use. The application can be used under the *Server Side Public License* (SSPL), and the source code is freely available. However, the SSPL differs from standard open source licenses and is somewhat more restrictive. Users are advised to thoroughly understand the license before developing any software around it. MongoDB is available for most Linux distributions along with Windows and macOS.

For a more in-depth introduction to MongoDB, including a comparison between MongoDB and SQL, see the Linode [Introduction to MongoDB guide](/docs/guides/mongodb-introduction/).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install MongoDB

The MongoDB installation process is fairly straightforward. First add the official MongoDB package and then use `apt` to install the application. To install MongoDB, follow these steps.

{{< note >}}
The `mongodb` package provided with the standard Ubuntu repository is not the official package and is often not up to date. It might not work properly with other applications. The instructions in this section demonstrate how to install the official MongoDB package. To verify whether the unofficial `mongodb` package is installed, run the command `which mongodb`. If Ubuntu displays a path to the application, uninstall it using `apt`.
{{< /note >}}

1.  Install the `gnupg` utility.

    ```command
    sudo apt-get install gnupg
    ```

1.  Import the public MongoDB GPG signing key. Verify the key is imported successfully.

    ```command
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    ```

    ```output
    OK
    ```

1.  Add details about the official MongoDB repository to the list of Ubuntu packages.

    ```command
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    ```

1.  Update the list of packages using `apt`.

    ```command
    sudo apt-get update
    ```

1.  Install the latest release of MongoDB.

    ```command
    sudo apt-get install -y mongodb-org
    ```

    {{< note >}}
    To install a specific release of MongoDB, use the command following command, replacing `release` with the actual release to install.

    ```command
    sudo apt-get install -y mongodb-org=release mongodb-org-database=release mongodb-org-server=release mongodb-org-mongos=release mongodb-org-tools=release
    ```
    {{< /note >}}

1.  **Optional** With the current configuration, the `apt-get` command always upgrades MongoDB whenever a new release becomes available. To prevent automatic upgrades, run the following commands.

    ```command
    echo "mongodb-org hold" | sudo dpkg --set-selections
    echo "mongodb-org-database hold" | sudo dpkg --set-selections
    echo "mongodb-org-server hold" | sudo dpkg --set-selections
    echo "mongodb-mongosh hold" | sudo dpkg --set-selections
    echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
    echo "mongodb-org-tools hold" | sudo dpkg --set-selections
    ```

## How to Run MongoDB

The MongoDB task is typically controlled using the `systemctl` tools. To start and enable MongoDB, follow these steps.

1.  Reload the `systemctl` daemon.

    ```command
    sudo systemctl daemon-reload
    ```

1.  Start the `mongod` process using `systemctl start`.

    ```command
    sudo systemctl start mongod
    ```

1.  Use `systemctl status` to ensure the MongoDB service is `active`.

    ```command
    sudo systemctl status mongod
    ```

    ```output
    mongod.service - MongoDB Database Server
    Loaded: loaded (/lib/systemd/system/mongod.service; disabled; vendor preset: enabled)
    Active: active (running) since Mon 2023-01-16 12:08:37 UTC; 1min 0s ago
    ```

1.  To configure Ubuntu to launch MongoDB at system boot time, enter the following command.

    ```command
    sudo systemctl enable mongod
    ```

    ```output
    Created symlink /etc/systemd/system/multi-user.target.wants/mongod.service → /lib/systemd/system/mongod.service.
    ```

1.  **Optional** If necessary, stop and restart MongoDB using the following commands.

    ```command
    sudo systemctl stop mongod
    sudo systemctl restart mongod
    ```

1.  To confirm MongoDB is working properly, enter `mongosh` to access the shell. Because authentication is not yet enabled, no password is required.

    {{< note >}}
    Without additional parameters, this command connects to the MongoDB instance running on default port `27017` on the local server. If network access is enabled, or if MongoDB has been moved to a different port, append `--host 127.0.0.1:27017` to the command.
    {{< /note >}}

    ```command
    mongosh
    ```

    ```output
    Connecting to:		mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2
    Using MongoDB:		6.0.3
    Using Mongosh:		1.6.2
    ```

## How to Configure MongoDB

The application settings for MongoDB are stored in the `/etc/mongod.conf` file. Most of these values can remain at the default values. However, it is important to enable user authentication for better security. To use MongoDB remotely, further changes must be made. For a full list of configuration file options, see the [MongoDB Configuration File documentation](https://www.mongodb.com/docs/manual/reference/configuration-options/).

### How to Enable Authentication on MongoDB

To enable authentication, create an administrator and then configure the authentication setting in the main configuration file. Follow these steps to secure the database.

1.  Access the MongoDB shell.

    ```command
    mongosh
    ```

1.  Switch to the `admin` database.

    ```command
    use admin
    ```

    ```output
    switched to db admin
    ```

1.  Use the `db.createUser` command to create an administrator. Provide a user name for the `user` and a password for `pwd`. For better security, use the command `passwordPrompt()` as the value for the `pwd` field. This tells MongoDB to prompt for the password. Grant two roles to the administrator, `userAdminAnyDatabase` and `readWriteAnyDatabase`. Enter the command in the MongoDB shell as follows, substituting the actual administrator name in place of `userAdmin`.

    ```command
    db.createUser(
        {
            user: "userAdmin",
            pwd: passwordPrompt(), // or cleartext password
            roles: [
                { role: "userAdminAnyDatabase", db: "admin" },
                { role: "readWriteAnyDatabase", db: "admin" }
            ]
        }
    )
    ```

1.  After entering the command, MongoDB prompts for the administrative password. Enter the password when requested. If the password is accepted, MongoDB returns `ok`.

    ```output
    Enter password
    ********{ ok: 1 }
    ```

1.  Use the `db.adminCommand` command to shut down the `mongod` instance.

    ```command
    db.adminCommand( { shutdown: 1 } )
    ```

1.  Exit the shell.

    ```command
    exit
    ```

1.  Edit the `/etc/mongod.conf` configuration file to add the configuration settings.

    ```command
    sudo vi /etc/mongod.conf
    ```

1.  Uncomment the line `security:` and add the line `authorization: enabled` directly below it. Save and close the file.

    ```file {title="/etc/mongod.conf"}
    ...
    security:
        authorization: enabled
    ...
    ```

1.  Restart MongoDB.

    ```command
    sudo systemctl restart mongod
    ```

1. All subsequent attempts to access MongoDB must specify the user and the name of the authentication database. Substitute the name for the administrator account in place of `userAdmin` and enter the administrator password when prompted. Use the following command to enter the MongoDB shell.

    {{< note >}}
    This command demonstrates how to authenticate at connection time. To connect first and authenticate afterwards, use the `mongosh` command without any options. Inside the shell, enter `use admin` to switch to the `admin` database. Then use the command `db.auth("userAdmin", passwordPrompt())` to authenticate. Substitute the actual user name for `userAdmin`. Users can enter the MongoDB shell without authentication, but cannot access anything without the proper roles.
    {{< /note >}}

    ```command
    mongosh --authenticationDatabase "admin" -u "userAdmin" -p
    ```

### How to Enable Remote Access for MongoDB

Unless otherwise specified, MongoDB only provides local access. To enable remote access to the database, make the following changes to the configuration file.

1.  Edit the main MongoDB configuration file.

    ```command
    sudo vi /etc/mongod.conf
    ```

1.  Under the `net` heading, change the value of `bindIp` to `0.0.0.0` to allow connections from all addresses. Enter a specific address to limit connectivity to that address.

    ```file {title="/etc/mongod.conf"}
    ...
    net:
        port: 27017
        bindIp: 0.0.0.0
    ...
    ```

1.  Restart MongoDB.

    ```command
    sudo systemctl restart mongod
    ```

1.  If the `ufw` firewall is enabled, allow connections to port `27017` through.

    ```command
    sudo ufw allow 27017
    ```

## How to Use MongoDB

MongoDB is quite different from other database systems in many ways and can be confusing to RDBMS users. Although this guide focuses on installation and configuration, here are a few additional tips. Before running any commands, use the `mongosh` command to enter the MongoDB shell. Add the authentication credentials if necessary. For more information on how to use MongoDB, review the [MongoDB documentation](https://www.mongodb.com/docs/manual/introduction/). MongoDB also provides a short [Getting Started tutorial](https://www.mongodb.com/docs/manual/tutorial/getting-started/) which covers most of the basics.

To see all available databases, use the `show dbs` command.

```command
show dbs
```

```output
admin   132.00 KiB
config   60.00 KiB
local    72.00 KiB
```

To change context to a different database, apply the `use` command.

```command
use admin
```

```output
switched to db admin
```

There is no special command to create a new database. The `use` command either switches to an existing database or creates a new one, depending on whether the database already exists or not. To create a new database, enter `use newdatabase`, where `newdatabase` is the name of the database to add.

```command
use testguidedb
```

A MongoDB collection has a similar function to a table in a relational database. To create a collection, use the `db.collectionname.insertOne` function, where `collectionname` is the name of the collection. Within the `{}` braces, enter a series of key-value pairs. Separate each pair, except the last one, with a comma. To insert several entries at once, use the `insertMany` command instead. Use the following format to add data to the `testdata` collection.

```command
db.testdata.insertOne(
    {Value_one: "30",
    Value_two: "40",
    Value_three: "Test"
    }
)
```

To retrieve the data from a collection, use the `db.find` command. The following command returns all the pairs from the `testdata` collection.

```command
db.testdata.find( {} )
```

```output
{
    _id: ObjectId("63c56d3dd4cb6182bed3fac3"),
    Value_one: '30',
    Value_two: '40',
    Value_three: 'Test'
}
```

To list all collections inside a particular database, execute the `show collections` command.

```command
show collections
```

```output
testdata
```

## Conclusion

MongoDB is a document-oriented database that permits great flexibility in how data is stored. Each database contains one or more collections, consisting of a free-form series of key-value pairs. To install MongoDB, add the official repository, then use `apt` to install it. Use `systemctl` to operate the MongoDB daemon and add authentication or remote access support to the configuration file. For more information, see the [MongoDB website](https://www.mongodb.com/).