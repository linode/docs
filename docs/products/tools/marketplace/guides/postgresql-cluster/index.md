---
title: "Deploy a PostgreSQL Cluster through the Linode Marketplace"
description: "PostgreSQL is a powerful, scalable, and standards-compliant open-source database. Here''s how to easily deploy PostgreSQL using Marketplace Apps."
published: 2023-03-20
modified_by:
  name: Linode
keywords: ['database','postgresql','rdbms','relational database']
tags: ["linode platform","postgresql","marketplace","cloud-manager"]
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
authors: ["Linode"]
---

The PostgreSQL relational database system is a powerful, scalable, and standards-compliant open-source database platform. It is designed to handle a range of workloads, from single machines to data warehouses or Web services with many concurrent users.

{{< note type="warning" title="Marketplace App Cluster Notice" >}}
This Marketplace App deploys 3 Compute Instances to create a highly available and redundant PostgreSQL cluster, each with the plan type and size that you select. Please be aware that each of these Compute Instances will appear on your invoice as separate items. To instead deploy PostgreSQL on a single Compute Instance, see [Deploy PostgreSQL through the Linode Marketplace](/docs/products/tools/marketplace/guides/postgresql/).
{{< /note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-app-cluster-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{< note >}}
**Estimated deployment time:** The PostgreSQL cluster should be fully deployed and configured within 5-10 minutes after the first Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Recommended minimum plan:** All plan types and sizes can be used.

### PostgreSQL Options

- **Linode API Token** *(required)*: Your API token is used to deploy additional Compute Instances as part of this cluster. At a minimum, this token must have Read/Write access to *Linodes*. If you do not yet have an API token, see [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) to create one.

- **Limited sudo user** *(required)*: A limited user account with sudo access is created as part of this cluster deployment. Enter your preferred username for this limited user. Please note that the password is automatically created. See [Obtaining Usernames and Passwords](#obtaining-usernames-and-passwords).

- **Domain** *(required)*: The domain name you wish to use, such as *example.com*. This domain name is only used to identify your cluster and as part of the system's hostname. No domain records are created within Linode's [DNS Manager](/docs/products/networking/dns-manager/).

- **Add SSH Keys to all nodes?** If you select *yes*, any SSH Keys that are added to the root user account (in the **SSH Keys** section), are also added to your limited user account on all deployed Compute Instances.

- **PostgreSQL cluster size:** This field cannot be edited, but is used to inform you of the number of Compute Instances that are created as part of this cluster.

{{< content "marketplace-special-character-limitations-shortguide">}}

## Getting Started after Deployment

### Obtaining Usernames and Passwords

After your cluster has been fully provisioned, use the instructs below to obtain and save passwords that were generated on your behalf during deployment.

1. Log in to your new Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/) using the `root` user and the associated password you entered when creating the instance. If you opted to include your SSH keys as part of this deployment, you can also log in using those keys as either the `root` user or the limited user account you specified during deployment.

1. The passwords have been saved in a `.deployment-secrets.txt` file located in your user's home directory. You can view this file in your preferred text editor or through the `cat` command. In the command below, replace *[username]* with the limited sudo user you created during deployment.

    ```command
    cat /home/[username]/.deployment-secrets.txt
    ```

    The file contains your system's limited username and password.

    ```file {title="/home/[user]/.deployment-secrets.txt"}
    # BEGIN ANSIBLE MANAGED BLOCK
    # system user

    user: example-user
    password: v[[<]xw`pm/]:I+F2:$|1je!nqw|%V2h
    # END ANSIBLE MANAGED BLOCK
    ```

## Using PostgreSQL

### Modify the Postgres Users

By default, PostgreSQL will create a Linux user named `postgres` to access the database software.

{{< note type="alert" >}}
The `postgres` user should not be used for other purposes (e.g. connecting to other networks). Doing so presents a serious risk to the security of your databases.
{{< /note >}}

1.  Change the `postgres` user's Linux password:

    ```command
    sudo passwd postgres
    ```

2.  Issue the following commands to set a password for the `postgres` database user. Be sure to replace `newpassword` with a strong password and keep it in a secure place.

    ```command
    su - postgres
    psql -d template1 -c "ALTER USER postgres WITH PASSWORD 'newpassword';"
    ```

    This user is distinct from the `postgres` Linux user. The Linux user is used to access the database, and the PostgreSQL user is used to perform administrative tasks on the databases.

    The password set in this step will be used to connect to the database via the network. Peer authentication will be used by default for local connections. See the [Secure Local PostgreSQL Access section](#secure-local-postgresql-access) for information about changing this setting.

### Create a Database

Run the commands in this section as the `postgres` Linux user.

1.  Create a sample database called `mytestdb`:

    ```command
    createdb mytestdb
    ```

2.  Connect to the test database:

    ```command
    psql mytestdb
    ```

3.  You will see the following output:

    ```output
    psql (12.2 (Debian 12.2-2.pgdg90+1))
    Type "help" for help.

    mytestdb=#
    ```

    This is the PostgreSQL client shell, in which you can issue SQL commands. To see a list of available commands, use the `\h` command. You may find more information on a specific command by adding it after `\h`.

### Create Tables

This section contains examples which create a test database with an employee's first and last name, assigning each a unique key. When creating your own tables, you may specify as many parameters (columns) as you need and name them appropriately. Run the commands in this section from the PostgreSQL client shell that you opened to create `mytestdb` database.

1.  Create a table called "employees" in your test database:

    ```command
    CREATE TABLE employees (employee_id int PRIMARY KEY, first_name varchar, last_name varchar);
    ```

2.  Insert a record into the table:

    ```command
    INSERT INTO employees VALUES (1, 'John', 'Doe');
    ```

3.  View the contents of the "employees" table:

    ```command
    SELECT * FROM employees;
    ```

    This produces the following output:

    ```output
    employee_id | first_name | last_name
    -------------+------------+-----------
                1 | John       | Doe
    (1 row)
    ```

4.  Exit the PostgreSQL shell by entering the `\q` command.

### Create PostgreSQL Roles

PostgreSQL grants database access through *roles* which are used to specify privileges. Roles can be understood as having a similar function to Linux "users." In addition, roles may also be created as a set of other roles, similar to a Linux "group." PostgreSQL roles apply globally, so you will not need to create the same role twice if you'd like to grant it access to more than one database on the same server.

The example commands in this section should be run as the `postgres` Linux user.

1.  Add a new user role, then a password at the prompt:

    ```command
    createuser examplerole --pwprompt
    ```

    If you need to delete a role, you can use the `dropuser` command in place of `createuser`.

2.  Connect to the database:

    ```command
    psql mytestdb
    ```

    You'll be connected as the `postgres` database user by default.

3.  From the PostgreSQL shell, enter the following to grant all privileges on the table `employees` to the user `examplerole`:

    ```command
    GRANT ALL ON employees TO examplerole;
    ```

4.  Exit the PostgreSQL shell by entering `\q`.

## Next Steps

{{< content "marketplace-update-note-shortguide">}}

For more on PostgreSQL, checkout the following guides:

- [Securely Manage Remote PostgreSQL Servers](/docs/guides/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/)
