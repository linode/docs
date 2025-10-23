---
slug: how-to-install-and-use-replibyte
title: "How to Install and Use Replibyte to Assist with Database Development"
description: "This guide explains how to use Replibyte to seed a database with transformed production data."
authors: ['Jeff Novotny']
contributors: ['Jeff Novotny']
published: 2023-02-24
modified: 2024-05-02
keywords: ['use Replibyte', 'install Replibyte', 'Replibyte Linux', 'transform database Replibyte']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Replibyte Introduction](https://www.replibyte.com/docs/introduction)'
- '[Replibyte GitHub page](https://github.com/Qovery/Replibyte)'
- '[Replibyte Database Support](https://www.replibyte.com/docs/databases)'
- '[Replibyte Datastore Support](https://www.replibyte.com/docs/datastores)'
- '[How to Use Replibyte Transformers](https://www.replibyte.com/docs/transformers)'
---

Database testing is a critical component of the quality-assurance cycle, but using production data is inherently insecure. Additionally, the sheer volume of data can be difficult to work with. Unfortunately, it is difficult to create realistic "fake" data, and the results might not be representative. [Replibyte](https://www.replibyte.com/docs/introduction) (also stylized as *RepliByte*) allows users to transform their production data and use the results to seed a test database. This guide explains how to install Replibyte and how to use it to transform a dataset.

## What is Replibyte?

Replibyte transforms existing production data into seed data suitable for non-production environments including development, testing, and customer demos. It prevents unauthorized personnel, such as research and development engineers, from obtaining access to the live data. This anonymous dataset also ensures the integrity of the original data, preventing it from being accidentally altered and then redeployed at a later time.

The transformation process obscures any sensitive real-world details to enhance security while retaining the essential characteristics of the original data set. This ensures the resulting database is based on real-world data. The new database should be roughly equivalent to the production database in terms of the number of rows and distribution of data it contains.

To help users effectively deal with very large databases, Replibyte can subset the original data. This operation restricts the new datastore to a subsection of the original data. A smaller database is easier to work with, requires less bandwidth to transfer, and takes less time to search.

The complete Replibyte process from source to destination database follows the following steps:

1.  Replibyte accesses the *source* database and takes a full SQL dump of the data. The source database can either be on the same system or on a remote system.
1.  Replibyte reads and parses the data.
1.  (Optional) For some database types, Replibyte can scale the original data down to a fractional subset. This process shrinks the number of database entries to a certain percentage of the original. The subset operation is currently only supported on PostgreSQL.
1.  Replibyte transforms the original database records, changing or hiding the values of one or more columns. These operations can obfuscate or trim the data, randomize strings, or auto-generate completely new values.
1.  (Optional) Replibyte can compress the data to reduce storage requirements. It can also encrypt the modified data.
1.  The modified data is known as the *dump data*. Replibyte writes this dump data to a *datastore*. A datastore can either reside on the local system or inside cloud storage. Along with the modified data, Replibyte creates an index file enumerating the conversions.
1.  When requested, Replibyte retrieves the modified data and the index file from the datastore. It parses the index file and decrypts or decompresses it as required, restoring the dump data.
1.  Replibyte copies the data to the destination database. The user can access this database like any other.

Some of the features and advantages of Replibyte include the following:

-   It is relatively easy to install and use. Replibyte is lightweight and stateless and does not require its own server or daemon.
-   It supports MySQL/MariaDB, PostgreSQL, and MongoDB as the source/destination database for the backup and restore procedures. The [Replibyte Database Documentation page](https://www.replibyte.com/docs/databases) provides full information.
-   It can store a datastore on either a local disk or in the cloud, including inside a Linode Object Storage solution. See the [Replibyte Datastore information](https://www.replibyte.com/docs/datastores) for more details about the possible cloud options.
-   It supports a full complement of transformers. It can randomize a string, keep the first character only, or obfuscate data. It can also auto-generate an email address, first name, phone number, or credit card number. Fields can also be left at their original values to enable specific tests. Users are permitted to create custom transformers.
-   It can work on large databases containing over 10GB of data.
-   For PostgreSQL only, a database subset feature allows users to limit the number of entries in a database. This feature is not yet supported on MySQL.
-   It uses Zlib for compression and AES-256 for encryption.

Replibyte does have a couple of limitations. As of this writing, it is not possible to copy the contents of the datastore directly into a local database, only a remote database. The only exception to this rule is if the local database instance is running inside a Docker container. The second limitation is the source database containing the original data and the destination database must have the same type. For instance, a transformed copy of a MySQL database can only be copied into another MySQL or MariaDB database.

## What are the Replibyte Transformer Types?

Each transformer operates on the data in a different way. In most cases, a transformer randomizes, redacts, or hides the original data. However, the `transient` transformer is a "no-op" that leaves the original data intact. The transformer types are as follows.

- `email`: Generates a valid email address.
- `first-name`: Changes the existing value to a valid first name.
- `phone-number`: Creates a valid phone number. This can only be applied to a string field, not an integer.
- `random`: Randomizes a string, maintaining the same string length.
- `keep-first-char`: Trims a value to its first letter only.
- `credit-card`: Generates a credit card number in the correct format. This transformer can only act on strings, not integers.
- `redacted`: Hides the original data using the `*` symbol.
- `transient`: Leaves the original data unaltered. This must be applied to keys and to other columns that must remain legible.

Transformers are applied on a per-column or per-key basis. The same transformer acts on the same column for all records inside a given table. For more information on transformers, along with examples of how to use them, see the [Replibyte transformer documentation](https://www.replibyte.com/docs/transformers).

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
The steps in this guide are written for non-root users. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Replibyte

Replibyte is fairly easy to install. Although Replibyte is available for Windows, Linux, and MacOS, these instructions are geared toward Ubuntu 22.04 LTS users. However, they are generally applicable to all Linux distributions. To install Replibyte, follow these steps.

1.  Update the system. Reboot it if necessary.

    ```command
    sudo apt-get update -y && sudo apt-get upgrade -y
    ```

1.  Install the `jq` utility.

    ```command
    sudo apt install jq
    ```

1.  Use `curl` to download the Replibyte archive. This command runs in the background and prints a message to the shell when it is done.

    ```command
    curl -s https://api.github.com/repos/Qovery/replibyte/releases/latest | jq -r '.assets[].browser_download_url' | grep -i 'linux-musl.tar.gz$' | wget -qi - &
    ```

1.  Extract the archive.

    ```command
    tar zxf *.tar.gz
    ```

1.  Make the Replibyte application executable.

    ```command
    chmod +x replibyte
    ```

1.  Move the program to a system directory.

    ```command
    sudo mv replibyte /usr/local/bin/
    ```

1.  Enter the `replibyte -V` command to view the release number and confirm the application is installed correctly.

    ```command
    replibyte -V
    ```

    ```output
    replibyte 0.10.0
    ```

1.  To display the Replibyte help information, enter the `replibyte` command without any arguments.

    ```command
    replibyte
    ```

    ```output
    Replibyte 0.10.0
    Replibyte is a tool to seed your databases with your production data while keeping sensitive data safe, just pass `-h`

    USAGE:
        replibyte [OPTIONS] --config <configuration file> <SUBCOMMAND>

    OPTIONS:
        -c, --config <configuration file>    Replibyte configuration file
        -h, --help                           Print help information
        -n, --no-telemetry                   disable telemetry
        -V, --version                        Print version information

    SUBCOMMANDS:
        dump           all dump commands
        help           Print this message or the help of the given subcommand(s)
        source         all source commands
        transformer    all transformer commands
    ```

## How to Configure Replibyte Using a YAML File

Before populating a new database, Replibyte must create a datastore from the source database. The source database contains the original data that serves as a template for the new data. The datastore contains the modified data. After a datastore is created, it can be used to seed a new database.

The `conf.yaml` file describes the source database along with a list of transformations to apply to the data. The transformations hide or sanitize any sensitive data in the original file. The YAML file also specifies information about the datastore. The datastore can be located either in the cloud or on the local disk. The destination database does not have to be specified when the datastore is created. The destination configuration is often added later when the data is required.

{{< note >}}
Before proceeding, a database application must be installed on the system. To access a remote source or destination database, the same database application must be installed locally. For instance, to use Replibyte to create a datastore based on a remote MySQL database, MySQL must also be installed locally. This guide uses MariaDB, but it includes instructions for the other database types. The source and destination database must use the same application, for instance, both have to be MySQL, or both have to be MongoDB.
{{< /note >}}

1.  Identify the database to be transformed into seed data. To properly identify the database, the user name, password, host, port, and database name are required. This guide uses the local MariaDB database `sourcedb`. This database contains a table named `patients`, which has the following table description.

    ```command
    use sourcedb;
    desc patients;
    ```

    ```output
    +------------+-------------+------+-----+---------+-------+
    | Field      | Type        | Null | Key | Default | Extra |
    +------------+-------------+------+-----+---------+-------+
    | userid     | char(8)     | YES  |     | NULL    |       |
    | first_name | varchar(20) | YES  |     | NULL    |       |
    | last_name  | varchar(20) | YES  |     | NULL    |       |
    | phone      | char(10)    | YES  |     | NULL    |       |
    | email      | varchar(30) | YES  |     | NULL    |       |
    | unit       | varchar(20) | YES  |     | NULL    |       |
    | credit     | char(16)    | YES  |     | NULL    |       |
    | socialnum  | char(9)     | YES  |     | NULL    |       |
    +------------+-------------+------+-----+---------+-------+
    8 rows in set (0.001 sec)
    ```

    The `patients` table currently contains the following records.

    ```command
    SELECT * FROM patients;
    ```

    ```output
    +----------+------------+-----------+------------+------------------+---------+------------------+-----------+
    | userid   | first_name | last_name | phone      | email            | unit    | credit           | socialnum |
    +----------+------------+-----------+------------+------------------+---------+------------------+-----------+
    | 13572468 | Bob        | Jones     | 1239876543 | bojones@isp1.com | Cardiac | 1122334455667788 | 222333444 |
    | 13572469 | Jack       | Smith     | 1239871234 | jacks@isp2.com   | Neuro   | 2232334344545565 | 343333666 |
    | 13572470 | John       | Doe       | 1234547359 | jjdoe43@isp4.com | Trauma  | 3579468024683579 | 454454454 |
    +----------+------------+-----------+------------+------------------+---------+------------------+-----------+
    ```

1.  Create a new `conf.yaml` file on the local system.

    ```command
    vi conf.yaml
    ```

1.  Add the `source` configuration, including the attribute `connection_uri`. This value specifies the location of the source database. The value of `connection_uri` must follow the format `mysql://[user]:[password]@[host]:[port]/[database]`. To access the local database, use `127.0.0.1` for the `host`. For MariaDB or MySQL, the default port is `3306`. The example in this section uses the `userid` account to access the source database `sourcedb` from the local MariaDB application. Ensure the user has been granted access to the database. Substitute their user name for `userid` and their actual password for `password`.

    {{< note >}}
    To access a PostgreSQL or MongoDB database, the syntax is similar. For PostgreSQL, the correct syntax is `connection_uri: postgres://[user]:[password]@[host]:[port]/[database]`. For MongoDB, use the format `connection_uri: mongodb://[user]:[password]@[host]:[port]/[database]`.
    {{< /note >}}

    ```file {title="conf.yaml"}
    source:
        connection_uri: mysql://userid:password@127.0.0.1:3306/sourcedb
    ```

1.  Replibyte typically transforms at least some data fields. Inside the source section, add a `transformers` key, which accepts an array. The first value in the array uses the `database` key to indicate the database to transform. The second key is the `table` key. It contains the name of the table to modify. The following example illustrates the first section of the `transformers` key. It stipulates the transformations to apply to the `patients` table inside the `sourcedb` database.

    {{< note >}}
    The file spacing and alignment must be very precise. If the alignment of the keys is not correct, Replibyte cannot parse the file. In the following example, the keys `database` and `table` must align. It is possible to specify multiple tables using this formatting.
    {{< /note >}}

    ```file {title="conf.yaml"}
    source:
    ...
        transformers:
            - database: sourcedb
              table: patients
    ```

1.  After this section, add the `columns` information. The value of `columns` is an array of columns along with the transformation to apply to each column. The name of each column is indicated by the `name` key, while the `transformer_name` key specifies the transformer to use. The `transformer_name` must reference one of the eight transformers mentioned in the "What are the Replibyte Transformer Types?" section of this guide.

    In the following example, Replibyte should apply the following transformations to the `patients` table inside the `sourcedb` database.
    - The `first-name` transformer is applied to the `first_name` column to generate a fake yet realistic first name.
    - The `random` transformer acts upon the `last_name` column to generate an anonymous last name.
    - The `phone-number` transformer converts the `phone` column to a new random phone number in the correct format.
    - The `email` transformer works on the `email` column to generate a fake email address.
    - The `keep-first-char` transformer is used on the `unit` column. It retains the first letter of the unit, dropping the rest of the unit name.
    - The `credit-card` alters the `credit` field, generating a series of digits in the correct credit card format.
    - The `redacted` field modifies the `socialnum` column. It obscures most of the digits using X's.
    - The `userid` field is left unchanged. To ensure this column is not altered, the `transient` transformer is applied.

    The following example demonstrates how to add the `columns` list to the `conf.yaml` file, along with a list of column names and the applicable transformers. Note the `columns` key must align with `database` and `table`, while the `name` and `transformer_name` keys must align inside each column.

    ```file {title="conf.yaml"}
    source:
    ...
        transformers:
            - database: sourcedb
              table: patients
              columns:
                - name: userid
                  transformer_name: transient
                - name: first_name
                  transformer_name: first-name
                - name: last_name
                  transformer_name: random
                - name: phone
                  transformer_name: phone-number
                - name: email
                  transformer_name: email
                - name: unit
                  transformer_name: keep-first-char
                - name: credit
                  transformer_name: credit-card
                - name: socialnum
                  transformer_name: redacted
    ```

1.  Add a section describing the `datastore`. This is where Replibyte stores the transformed SQL dump for later use. Begin this section with the keyword `datastore`. To instruct Replibyte to store the data locally, add the `local_disk` key. The value of `local_disk` is another key-value pair. The `dir` key indicates the name of the local directory. This directory must already exist before Replibyte is used. Within the YAML file, the `datastore` keyword must align with the `source` keyword.

    {{< note >}}
    For a full explanation of the configuration required to store the datastore in a cloud computing solution, see the [Replibyte Datastore documentation](https://www.replibyte.com/docs/datastores).
    {{< /note >}}

    ```file {title="conf.yaml"}
    source:
    ...
    datastore:
      local_disk:
        dir: /home/username/replibyte/data
    ```

1.  To verify the syntax is correct, run the following command. It should list all available transformers for the selected source and should not display any errors.

    ```command
    replibyte -c conf.yaml transformer list
    ```
1.  The entire `conf.yaml` file should appear similar to the following sample file.

    ```file {title="conf.yaml"}
    source:
      connection_uri: mysql://userid:password@127.0.0.1:3306/sourcedb
      transformers:
        - database: sourcedb
          table: patients
          columns:
            - name: userid
              transformer_name: transient
            - name: first_name
              transformer_name: first-name
            - name: last_name
              transformer_name: random
            - name: phone
              transformer_name: phone-number
            - name: email
              transformer_name: email
            - name: unit
              transformer_name: keep-first-char
            - name: credit
              transformer_name: credit-card
            - name: socialnum
              transformer_name: redacted
    datastore:
      local_disk:
        dir: /home/username/replibyte/data
    ```

## How to Use Replibyte to Create and Restore an Anonymous Database Dump

To create a database dump, the `conf.yaml` file must already exist. The `source` and `datastore` components of the file must be fully defined. Additionally, the local storage directory or cloud computing location must already exist. The destination database must be of the same type as the source database. For instance, if Replibyte extracted and transformed data from a MySQL database, the destination database must also be a MySQL/MariaDB database.

To create and then restore a transformed database, follow these steps.

{{< note >}}
Replibyte has several limitations. It cannot write the dump to a local database unless the database is running inside a Docker container. However, it is possible to write the database dump from the datastore to a local `dump.sql` file and then import the `sql` file into a database.
{{< /note >}}

1.  To create the transformed data and save it to the datastore, use the Replibyte `dump create` command. Replibyte displays a progress bar and indicates when it has finished.

    {{< note >}}
    This guide creates the datastore from the source database. This is the most usual approach. It is also possible to base the dump database on the output of `mysqldump` or another similar command. For more information on this approach, see the [Replibyte documentation](https://www.replibyte.com/docs/guides/create-a-dump).
    {{< /note >}}

    ```command
    replibyte -c conf.yaml dump create
    ```

    ```output
    [00:00:00] [#####################################################################] 2.76KiB/2.76KiB (0s)
    ```

1.  Confirm the `dump` and `metadata.json` files now exist inside the `datastore` target directory.

    ```command
    ls replibyte/data/
    ```

    ```output
    dump-1677767483822  metadata.json
    ```

1.  To restore a modified database, add the `destination` information to the `conf.yaml` file. Add the `connection_uri` key and value for the destination database the same way the `source` configuration is specified. The `connection_uri` for the destination also uses the format `mysql://<user>:<password>@<host>:<port>/<database>`. The following example writes the transformed data to the `seed` MariaDB database on another system. Replace `remote_ip_addr` with the IP address of the remote system. Replace `userid` and `password` with the account details for the remote user.

    ```file {title="conf.yaml"}
    source:
    ...
    destination:
      connection_uri: mysql://userid:password@remote_ip_addr:3306/seed
    ```

1.  Before restoring the database contents to the destination database, use the `dump list` command to see all versions of the file inside the datastore.

    ```command
    replibyte -c conf.yaml dump list
    ```

    ```output
    name               | size      | when           | compressed | encrypted
    --------------------+-----------+----------------+------------+-----------
    dump-1677767483822 | 982 Bytes | 28 minutes ago | true       | false
    ```

1.  To write the contents of the datastore to a remote database, use the `dump restore` command and the `remote` option. To restore based on the latest version in the datastore, use `-v latest`.

    {{< note >}}
    Replibyte cannot write to a local database unless it is running inside a Docker container. To write the SQL dump to a local file, use the command `replibyte -c conf.yaml dump restore local -v latest -o > dump.sql`.
    {{< /note >}}

    ```command
    replibyte -c conf.yaml dump restore remote -v latest
    ```

    ```output
    Restore successful!
    ```
1.  To confirm the sensitive data in the destination database is appropriately hidden, access the remote system. Launch the database, and dump the description and contents of the `patients` table. The table definition should be the same, but the contents should be transformed into unrecognizable data. As expected, the `userid` field remains unchanged.

    ```command
    SELECT * FROM patients;
    ```

    ```output
    +----------+------------+-----------+------------+---------------------+------+------------------+-----------+
    userid     | first_name | last_name | phone      | email               | unit | credit           | socialnum |
    ----------+------------+-----------+------------+---------------------+------+------------------+------------+
    | 13572468 | Stephany   | 9sxCe     | (761) 618- | alaina@example.net  | C    | 4574727772422    | 222****** |
    | 13572469 | Ola        | sREkQ     | 124-880-12 | sincere@example.org | N    | 4233777453337    | 343****** |
    | 13572470 | Sister     | nNo       | 1-590-599- | modesto@example.net | T    | 5185478832614352 | 454****** |
    +----------+------------+-----------+------------+---------------------+------+------------------+-----------+
    ```

1.  To delete a dump from the datastore, use the `dump delete` command and the name of the dump. It is also possible to keep only the ten most recent files using the command `replibyte -c conf.yaml dump delete --keep-last=10`.

    ```command
    replibyte -c conf.yaml dump delete [dumpid]
    ```

    ```output
    Dump deleted!
    ```

## Conclusion

Replibyte transforms the data in a production database to help protect sensitive data. Several databases are supported, including MySQL/MariaDB, PostgreSQL, and MongoDB. Replibyte can create random strings, redact information, and create valid fake names, emails, and credit card numbers. To install Replibyte, download the Replibyte archive from GitHub. Then create a YAML file indicating the source database and the transformations to perform. Replibyte transfers the transformed database dump to a datastore, which can be stored locally or in the cloud. Replibyte can later transfer the data from the datastore to a destination database. For more information on Replibyte, see the [Official Replibyte documentation](https://www.replibyte.com/docs/introduction).