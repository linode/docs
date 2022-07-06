---
slug: securely-store-mysql-credentials
author:
  name: Linode
  email: docs@linode.com
description: "Learn how to securely store MySQL crentials and connection details using the mysql_config_editor utility."
keywords: ["mysql", "mariadb", "mysql_config_editor", "secure", "security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-07-01
modified: 2022-07-01
modified_by:
  name: Linode
title: "Securely Storing MySQL Credentials using mysql_config_editor"
external_resources:
 - '[mysql_config_editor documentation](https://dev.mysql.com/doc/refman/8.0/en/mysql-config-editor.html)'
tags: ["mariadb","database","mysql"]
---

MySQL includes the [mysql_config_editor](https://dev.mysql.com/doc/refman/8.0/en/mysql-config-editor.html) utility, which is used to store your MySQL credentials inside of an encrypted file in your home directory: `~/.mylogin.cnf`. The file is obfuscated and cannot be viewed in plaintext unless running the [print](#view-stored-credentials) command. Any stored passwords are never made visible. This arrangement adds a layer of security and convenience when connecting to your database using command-line tools like mysql or [mysqldump](/docs/guides/mysqldump-backups).

Each set of credentials is stored in option groups called *login paths*. You can create your own custom login paths, which you can then specify when connecting to your database.

## Create or Edit Credentials

Run the `set` command to store your credentials and database connection details. Replace *[name]* with whatever name you wish to use for your custom login path, *[username]* with your MySQL username, and *[host]* with the remote host IP or domain (if you are connecting to a remote database). You can also specify the port (`--port`) and socket (`-socket`) if needed.

    mysql_config_editor set --login-path=[name] --user=[username] --host=[host] --password --warn

{{< note >}}
You can also use special login path names, which are used by default in certain commands without needing to specify it. These special login paths include `client` and `mysql` for the mysql command and `mysqldump` for the mysqldump command.
{{</ note >}}

## View Stored Credentials

Run the `print` command to view all login paths (`--all`). You can also view a specific login path by adding the `--login-path=[name]` option, replacing *[name]* with the name of your login path.

    mysql_config_editor print --all

In the example output below, there is a single login path called *example-path* that is storing the user (*admin*), the password (which cannot be viewed), and the host.

{{< output >}}
[example-path]
user = "admin"
password = *****
host = "db-server.example.com"
{{</ output>}}

## Remove Stored Credentials

If you don't want your system user to be able to access the database, it's recommended that you delete any stored credentials. In addition to being able to remove the entire login path, you can also remove an individual option if needed.

To remove the entire login path, run the following command. Replace *[name]* with the name of your login path.

    mysql_config_editor remove --login-path=[name]

To only remove a specific option from the login path, append the option you wish to remove. For example, the command below removes the `--host` option from the stored login path.

    mysql_config_editor remove --login-path=[name] --host


## Connecting to a Database Using Stored Credentials

To specify a set of stored credentials in the mysql or mysqldump command, use the `--login-path=[]` (or `-G []`) option as show below. Replace *[name]* with the name of your login path.

    mysqldump --login-path=[name] exampledatabase > backup.sql