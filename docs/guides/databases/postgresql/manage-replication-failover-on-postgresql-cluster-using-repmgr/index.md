---
slug: manage-replication-failover-on-postgresql-cluster-using-repmgr
title: "Manage Replication and Failover on a PostgreSQL Cluster Using repmgr"
description: "This guide explains how to configure a two-node PostgreSQL cluster using the repmgr replication manager."
authors: ["Jeff Novotny"]
contributors: ["Jeff Novotny", "Adam Overa"]
published: 2023-10-11
modified: 2024-05-09
keywords: ['postgresql cluster','configure cluster postgresql repmgr','repmgr replication manager','repmgr replication failover']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[PostgreSQL](https://www.postgresql.org/)'
- '[PostgreSQL High Availability Documentation](https://www.postgresql.org/docs/current/high-availability.html)'
- '[PostgreSQL downloads page](https://www.postgresql.org/download/)'
- '[repmgr entry in PostgreSQL Wiki](https://wiki.postgresql.org/wiki/Repmgr)'
- '[repmgr](https://www.repmgr.org/)'
- '[repmgr installation documentation](https://www.repmgr.org/docs/current/installation.html)'
- '[repmgr documentation](https://www.repmgr.org/docs/current/getting-started.html)'
- '[repmgr configuration documentation on GibHub](https://raw.githubusercontent.com/EnterpriseDB/repmgr/master/repmgr.conf.sample)'
- '[repmgr Barman documentation](https://www.repmgr.org/docs/current/cloning-from-barman.html)'
- '[repmgr FAQ](https://www.repmgr.org/docs/current/faq-repmgr.html)'
---

Although [PostgreSQL](https://www.postgresql.org/) is very powerful and reliable, it does not include built-in *high availability* (HA) capabilities. Resiliency and reliability can be configured using a *replication manager*, such as [repmgr](https://www.repmgr.org/). This guide explains how to install and configure PostgreSQL and repmgr. It also describes the steps required to convert a two-node network into a functional *high availability cluster* (HA cluster).

## PostgreSQL and High Availability

High availability functionality is an important component for any production database. If an important database server crashes or becomes inaccessible due to network issues, it can adversely affect both customers and employees. It can also degrade other resources, such as corporate or e-commerce websites.

A high availability architecture addresses these concerns. In an HA network, multiple nodes maintain the same database schema and data. One node is designated the master or *primary node*. It processes all changes to the database and transmits a record of all transactions to the *standby nodes*. These nodes are also known as secondary nodes or replicas.

In most architectures, both the primary and standby nodes can respond to read requests. This capability assists with load balancing and increases the overall capacity of the system. However, if the primary node fails, one of the standby nodes is elevated to become the new primary. This ensures uninterrupted access to the data.

There are a few important terms to be aware of before configuring an HA cluster:

- **Data Replication**: Replication is the process of generating additional copies of the original database data. It logs all data and schema updates and transmits them to designated standby nodes. Replication can be synchronous or asynchronous and transmits updates using either a file or streaming-based format.
- **High Availability Cluster (HA Cluster)**: An HA Cluster is a collection of nodes, each hosting a copy of the same data and schemas. The different database instances are kept in sync by the replication algorithm. The HA Cluster is presented as a single database and external database users do not have any visibility into its composition.
- **Primary Node**: This is the master node within a PostgreSQL HA cluster. It receives all database changes and updates, so it always has the most current view of the data. It replicates these transactions to the other nodes in the HA cluster. Primary nodes also handle read requests, but these are typically distributed between the different nodes for load balancing purposes. In PostgreSQL, the primary node is registered based on the configuration files. However, after a failover event, a new primary can be chosen through a *primary election*.
- **Standby Node**: Also known as a *secondary node* or a *replica*, the standby receives database updates from the primary node. During regular operation, these nodes receive and process replication updates from the primary, but only respond to user read requests. Each HA cluster can contain additional standby nodes for added redundancy and load balancing.
- **Failover**: If the primary node fails, a failover occurs. One of the standby nodes is promoted to become the new primary node. It then handles all subsequent database updates. Administrators can initiate a manual failover for database maintenance purposes. This scheduled activity is sometimes known as a *manual switchover*.
- **Streaming Replication**: A streaming-based replication algorithm immediately transmits each update to the replicas, resulting in more timely updates on the replicas. It does not have to wait for a list of entries to build up before transmitting the updates. Streaming can be either synchronous or asynchronous.
- **Synchronous/Asynchronous Replication**: In synchronous replication, the primary node waits for confirmation from at least one standby before confirming the transaction. For asynchronous replication, the primary node does not wait for a response after transmitting an update. Synchronous mode guarantees the database is consistent across the HA cluster and eliminates potential data loss during a switchover. However, it introduces latency and can reduce throughput. Asynchronous mode is the default PostgreSQL and repmgr replication method.

All high availability solutions must be able to perform the following tasks:

- Designate one of the nodes as the primary node.
- Direct all write operations to the primary node.
- Replicate all changes on the primary to the standby nodes.
- Monitor the primary node and detect any failures.
- If the primary fails, choose one of the replicas as the new primary. This can be done either through deterministic means, including priority settings, or through an election process.

Some high availability solutions distribute read requests to all active nodes. In some cases, replication managers are able to repair failed nodes and reintegrate them into the HA cluster. However, repmgr is not able to do this.

Some database systems refer to the primary and all standby nodes as a cluster. However, in PostgreSQL a "cluster" refers to either a collection of databases sharing the same data storage area or a table index reorganization operation. In PostgreSQL a redundant computing cluster is a "high availability (HA) cluster".

For further information about high availability solutions for PostgreSQL and a comparison of the different replication managers, see Akamai's PostgreSQL high availability guide.

## What Is repmgr?

[Repmgr](https://www.repmgr.org/) is an open source suite for managing PostgreSQL HA clusters. It closely integrates with PostgreSQL to configure a primary node, clone replica nodes, monitor the HA cluster, and perform a failover. Repmgr supports a single read-write primary server and one or more read-only standby nodes, also known as replicas. This guide focuses on repmgr because it is an efficient and robust solution with long-standing popularity in the database management area.

Repmgr is installed from the `apt` package. It includes a command-line utility for configuring, administering, and monitoring the HA cluster nodes. Configuration is added to the PostgreSQL and repmgr configuration files.

Each node in the HA cluster must be registered as either a primary or standby node. The primary is registered first and used as a template to clone the standby nodes. Repmgr creates its own tables within the PostgreSQL database to store the information about the nodes and replication process. It requires SSH connections between the nodes to complete these tasks.

The other repmgr component is the `repmgrd` daemon. It actively monitors all nodes and detects any failures and helps coordinate a switchover to a new primary. If the primary fails, repmgr attempts to reconnect to it. If this does not succeed, it performs a failover and promotes one of the standby servers. It fences off the failed primary in case it unexpectedly comes online again. This helps avoid a contentious *split brain* scenario where multiple nodes believe they are the primary. Additionally, the daemon transmits relevant notifications and alerts.

Repmgr also supports manual transitions to one of the standby nodes. It can incorporate an independent *witness server* to assist with primary elections and manage split network scenarios. Repmgr permits a cascading configuration, allowing one or more replicas to receive updates from an upstream replica. A notable feature is the `dry run` option. It allows users to preview the results of certain commands.

A drawback of repmgr is that it cannot recover resources or restore the state of a cluster to its original condition. Restarting a failed node usually requires manual intervention. It is also unable to detect many common misconfigurations and might think a misconfigured node is a viable standby.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with the Akamai cloud computing platform](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  This guide requires at least two compute instances. The examples here only require Shared CPU instances with 4GB of RAM, to accommodate larger data sets, use High Memory instances. One system must be designated as the primary node and the other as a standby or backup node. Additional standby systems can be added depending upon business requirements. All servers within the same HA cluster must use the same release of the same Linux distribution. The steps that follow are geared towards Ubuntu 22.04 LTS users, but are generally applicable for earlier releases and other Linux distributions.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## An Overview of the PostgreSQL and repmgr HA Solution

This guide covers a full manual installation of PostgreSQL and repmgr. It also includes instructions on how to register the nodes and perform a switchover.

For simplicity, this guide uses a two-node HA cluster. For a setup with multiple standby servers, repeat the standby configuration on any additional standby nodes. Update the standby IP address with the local IP address as required.

Throughout this guide, execute some commands as the `postgres` user and others with a user account having `sudo` privileges. However, the `postgres` account does not have `sudo` rights by default. There are two approaches to dealing with this situation:

- Grant the `postgres` account sudo access. Run the command `adduser postgres sudo` as the `root` user. However, this extends additional powers to the `postgres` user. This might not be desirable, especially from a security standpoint.
- The preferred approach is to restrict the `postgres` account to PostgreSQL and repmgr configuration. Run `systemctl` and `apt` commands from a user account with `sudo` privileges. This can involve switching back and forth in one terminal, but it is usually easier to use two terminals. This guide indicates when to use the `postgres` account or the user account with `sudo` privileges.

The complete list of steps required to provision PostgreSQL and repmgr follows this sequence:

1.  Install PostgreSQL on both nodes.
1.  Access and secure PostgreSQL on both nodes.
1.  Install repmgr on both nodes.
1.  Enable SSH connectivity between the nodes.
1.  Create a repmgr user on the primary node.
1.  Configure the database replication settings in the PostgreSQL configuration file on the primary.
1.  Configure the PostgreSQL authentication settings on the primary.
1.  Configure the repmgr HA cluster settings on both nodes.
1.  Register the primary server.
1.  Clone and register the standby server.
1.  Activate the `repmgrd` daemon.

After the configuration process, it is important to verify the cluster status. Add some data to the primary database instance and ensure it is replicated to the standby. It is also possible to test a failover process, but the failed primary must be recovered manually afterwards.

{{< note >}}
An alternative to manual installation is the [Akamai Marketplace PostgreSQL cluster application](/docs/marketplace-docs/guides/postgresql-cluster/). The Marketplace application uses repmgr to manage a multi-node HA PostgreSQL cluster. While it's easy to provision this solution using the Akamai Cloud Compute Dashboard, you cannot choose the cluster size or customize the configuration. The Marketplace application is a reasonable option for a smaller organization looking for ease of use. It is currently only supported on Ubuntu 22.04 LTS (with all regions and plan types).
{{< /note >}}

## How to Install PostgreSQL and repmgr

### How to Install PostgreSQL

PostgreSQL can be installed using a variety of methods, but the easiest approach is to use `apt` to install the PostgreSQL package. For more information on installing and configuring PostgreSQL, including instructions on using the database, see the [How to install PostgreSQL guide](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/). The [PostgreSQL downloads page](https://www.postgresql.org/download/) has information on other install options, including how to build PostgreSQL from source code.

{{< note >}}
Users can choose to install PostgreSQL either from the default Ubuntu packages or from the PostgreSQL apt repository. Installing the PostgreSQL repository allows more control over which release to use. This guide demonstrates how to install the official PostgreSQL repository, which guarantees access to the current release.
{{< /note >}}

To install PostgreSQL, execute the instructions in this section on both the primary and standby nodes.

{{< note >}}
Instead of running the same commands on both nodes, users have the option of cloning the primary server configuration to the standby server. Users selecting this option must perform the clone operation before adding any primary-specific PostgreSQL or repmgr configuration. See the [Instance Cloning guide](/docs/products/compute/compute-instances/guides/clone-instance/) for more information.
{{< /note >}}

1.  Ensure the server is up to date. Use the `apt update` command to install any updates. Reboot the server if necessary.

    ```command {title="All Nodes as sudo User"}
    sudo apt update -y && sudo apt upgrade -y
    ```

1.  Add the PostgreSQL repository to the list of packages:

    ```command {title="All Nodes as sudo User"}
    sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    ```

1.  Import the signing key for the repository:

    ```command {title="All Nodes as sudo User"}
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    ```

1.  Update the list of `apt` packages:

    ```command {title="All Nodes as sudo User"}
    sudo apt update
    ```

1.  Install the latest release of PostgreSQL:

    ```command {title="All Nodes as sudo User"}
    sudo apt -y install postgresql
    ```

    {{< note >}}
    To install a specific release of PostgreSQL, add a dash `-` and the release number to the package. For example, to install PostgreSQL release 11, use the `postgresql-11` package.
    {{< /note >}}

1.  **Optional**: To install additional extensions that are not yet part of the official PostgreSQL, run the following command:

    ```command {title="All Nodes as sudo User"}
    sudo apt -y install postgresql-contrib
    ```

1.  PostgreSQL begins running immediately after installation. Verify the status of PostgreSQL is `active` using the `systemctl status` command:

    ```command {title="All Nodes as sudo User"}
    systemctl status postgresql
    ```

    ```output
    ● postgresql.service - PostgreSQL RDBMS
         Loaded: loaded (/lib/systemd/system/postgresql.service; enabled; vendor preset: enabled)
         Active: active (exited) since Mon 2023-11-20 10:38:10 EST; 1h 29min ago
       Main PID: 3516 (code=exited, status=0/SUCCESS)
            CPU: 1ms

    ```

    {{< note >}}
    The `active (exited)` status does not necessarily indicate a problem. The `postgresql` service is an umbrella service for several subprocesses. If `active` is displayed somewhere in the status, everything is running normally. To see the status of all subprocesses, use the command `sudo systemctl status 'postgresql*'`.
    {{< /note >}}

    Press the <kbd>Q</kbd> key to exit the `systemctl status` output and return to the terminal prompt.

1.  To automatically launch PostgreSQL at system boot time, `enable` the service:

    ```command {title="All Nodes as sudo User"}
    sudo systemctl enable postgresql
    ```

### How to Access and Secure the PostgreSQL Instance

PostgreSQL creates a default `postgres` user account at installation time. This account does not have Linux or database passwords. However, the account has full administration rights for PostgreSQL, so it is vitally important to secure it. This section explains how to access PostgreSQL and enhance security.

1.  Change the password for the `postgres` Linux account:

    ```command {title="All Nodes as sudo User"}
    sudo passwd postgres
    ```

    Choose a unique strong password and store it in a secure location.

    ```output
    passwd: password updated successfully
    ```

1.  Switch to the `postgres` user to access PostgreSQL:

    ```command {title="All Nodes as sudo User"}
    su - postgres
    ```

1.  To ensure the database is installed correctly and confirm the release number, run the following command:

    ```command {title="All Nodes as postgres User"}
    psql -c "SELECT version();"
    ```

    ```output
    PostgreSQL 16.1 (Ubuntu 16.1-1.pgdg22.04+1) on x86_64-pc-linux-gnu, compiled by gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0, 64-bit
    ```

    Press the <kbd>Q</kbd> key to close the output and return to the main `psql` prompt.

1.  Add a password for the `postgres` database account using the following command. Replace `EXAMPLE_PASSWORD` with a more secure password.

    ```command {title="All Nodes as postgres User"}
    psql -c "ALTER USER postgres WITH PASSWORD 'EXAMPLE_PASSWORD'"
    ```

    ```output
    ALTER ROLE
    ```

    {{< note >}}
    This password is only necessary when logging in remotely or over a network. The `postgres` user can always log in locally without a password. This grants administrative access for maintenance tasks and cron jobs.
    {{< /note >}}

1.  Log in to PostgreSQL to confirm the database is accessible. This command uses the `postgres` database, which was created at installation time:

    ```command {title="All Nodes as postgres User"}
    psql postgres
    ```

    PostgreSQL displays some information about the database along with the `postgres=#` prompt:

    ```output
    psql (16.1 (Ubuntu 16.1-1.pgdg22.04+1))
    Type "help" for help.

    postgres=#
    ```

1.  Type `quit` or `exit` to exit the PostgreSQL shell and return the Linux terminal prompt.

1.  Type `exit` again to log out as the `postgres` user and return to your Linux user account with `sudo` access.

1.  **Optional**: By default, local users can log into PostgreSQL without a password using `peer` authentication. For multi-user environments, this can create a security risk. To enforce password authentication for local users (other than the `postgres` account) edit the `pg_hba.conf` file. Change the `METHOD` attribute for `local` accounts from `peer` to `md5`. See the [How to install PostgreSQL guide](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/) for detailed instructions.

### How to Install repmgr

The repmgr software package must be added to all nodes. To install repmgr, follow these steps.

{{< note >}}
repmgr can also be installed from source. For more information, see the [repmgr installation documentation](https://www.repmgr.org/docs/current/installation.html).
{{< /note >}}

1.  Install the EDB repository, including the repmgr package:

    ```command {title="All Nodes as sudo User"}
    curl https://dl.enterprisedb.com/default/release/get/deb | sudo bash
    ```

    You may have to enter your password for the curl command to complete.

1.  Install the same repmgr release as the PostgreSQL release being used. For example, if PostgreSQL release 16 is installed, use `apt` to install `postgresql-16-repmgr`:

    ```command {title="All Nodes as sudo User"}
    sudo apt-get install postgresql-16-repmgr
    ```

## How to Configure a PostgreSQL HA Cluster

PostgreSQL and repmgr rely on a series of configuration files to set up and manage redundancy. Repmgr uses SSH to transfer files, so passwordless SSH must be configured in both directions. To configure the HA cluster, follow these steps.

### How to Configure SSH

The primary must be able to connect to all standby nodes through SSH to properly clone the replication settings. To complete this configuration, create a key on the primary and share it with all standbys. Then repeat these steps in the other direction: generate a key on the standby and copy it to the primary. To configure SSH, follow these steps.

1.  On the **primary** node, switch to the `postgres` user:

    ```command {title="Primary Node as sudo User"}
    su - postgres
    ```

1.  Generate an SSH key:

    ```command {title="Primary Node as postgres User"}
    ssh-keygen -t rsa -b 4096
    ```

    When prompted, enter the file to store the key in. To store the key in the default location `~/.ssh/id_rsa`, hit **ENTER**. For passwordless SSH, do not provide a password. The SSH utility saves the key to the selected location. Take note of the directory and filename for the key.

    {{< note >}}
    Passwordless SSH is less secure, but using a password can cause problems with automated repmgr processes.
    {{< /note >}}

    ```output
    Generating public/private rsa key pair.
    Enter file in which to save the key (/var/lib/postgresql/.ssh/id_rsa):
    Enter passphrase (empty for no passphrase):
    ...
    Your identification has been saved in ~/.ssh/id_rsa
    Your public key has been saved in ~/.ssh/id_rsa.pub
    ```

1.  Copy the key to each standby node in the HA cluster. In the following example, replace `STANDBY_IP` with the IP node of the standby node:

    ```command {title="Primary Node as postgres User"}
    ssh-copy-id postgres@STANDBY_IP
    ```

1.  SSH can now be used to access a standby node without a password from the primary. The following command, when run from the `postgres` account on the primary, places the user in the `postgres` user directory on the standby:

    ```command {title="Primary Node as postgres User"}
    ssh STANDBY_IP
    ```

    When done, type `exit` to log out of the secondary server.

1.  Repeat these steps to create a key on each standby node share it with the primary:

    ```command {title="Standby Node as sudo User"}
    su - postgres
    ```

    ```command {title="Standby Node as postgres User"}
    ssh-keygen -t rsa -b 4096
    ```

    ```command {title="Standby Node as postgres User"}
    ssh-copy-id postgres@PRIMARY_IP
    ```

### How to Create the repmgr User

To allow repmgr to manage PostgreSQL data replication, create a `repmgr` user on the primary server. Then create a new database for the repmgr data. The commands in this section must only be executed on the primary server. Do not create any database entries on the standby because this interferes with replication.

1.  While logged in as the `postgres` account, create the `repmgr` user:

    ```command {title="Primary Node as postgres User"}
    createuser -s repmgr
    ```

1.  Now create the `repmgr` database, with the `repmgr` user as the owner:

    ```command {title="Primary Node as postgres User"}
    createdb repmgr -O repmgr
    ```

### How to Configure the PostgreSQL Replication Settings

To configure the replication settings in `postgresql.conf`, follow these steps. This file must only be changed on the primary node. Repmgr copies it to the standby nodes in a later configuration stage.

1.  Edit the `/etc/postgresql/16/main/postgresql.conf` file as the `postgres` user:

    ```command {title="Primary Node as postgres User"}
    nano /etc/postgresql/16/main/postgresql.conf
    ```

    Change the settings in the following file sample to adjust the replication settings. In some cases, these lines only have to be uncommented. These lines are found in non-contiguous locations in the file. Use the text editor search utility (<kbd>CTRL</kbd>+<kbd>W</kbd> in `nano`)to find them.

    ```file {title="/etc/postgresql/16/main/postgresql.conf" lang="aconf"}
    shared_preload_libraries = 'repmgr'
    wal_level = replica
    archive_mode = on
    archive_command = '/bin/true'
    max_wal_senders = 10
    max_replication_slots = 10
    hot_standby = on
    listen_addresses = '*'
    ```

    {{< note >}}
    It is easiest to set `listen_addresses` to `*`. However, in some networks this might pose additional security concerns. For extra security, set this value to a comma-separated list consisting of `localhost` and the IP addresses of all nodes in the HA cluster.
    {{< /note >}}

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

### How to Configure the PostgreSQL Client Authentication Settings

Users must also add client authentication capabilities to the `pg_hba.conf` file. This file tells PostgreSQL what type of connections to trust and how to authenticate them. Add entries to trust `repmgr` connections from both the primary and standby servers. Edit this file on the primary server only.

1.  Open the `/etc/postgresql/16/main/pg_hba.conf` file for editing as the `postgres` user:

    ```command {title="Primary Node as postgres User"}
    nano /etc/postgresql/16/main/pg_hba.conf
    ```

    Edit the configuration settings for the `replication` database as follows. Replace `PRIMARY_IP` and `STANDBY_IP` with the actual IP addresses of the primary and the standby. If there are two or more standby nodes, add a similar line for each standby.

    ```file {title="/etc/postgresql/16/main/pg_hba.conf" lang="aconf"}
    local   replication   repmgr                                    trust
    host    replication   repmgr            127.0.0.1/32            trust
    host    replication   repmgr            PRIMARY_IP/32           trust
    host    replication   repmgr            STANDBY_IP/32           trust
    ```

    {{< note >}}
    If all nodes are on the same subnet, the separate node entries can be replaced with one entry for the entire subnet. Use the address format `NETWORK/SUBNET`, for example, `192.168.1.0/24`. This configuration trusts the entire subnet, so ensure it is not shared with other organizations.
    {{< /note >}}

    Add new entries for the `repmgr` database, following the same format:

    ```file {title="/etc/postgresql/16/main/pg_hba.conf" lang="aconf"}
    local   repmgr        repmgr                                    trust
    host    repmgr        repmgr            127.0.0.1/32            trust
    host    repmgr        repmgr            PRIMARY_IP/32           trust
    host    repmgr        repmgr            STANDBY_IP/32           trust
    ```

    The entire database file should resemble this example. Ensure the section for `all` databases is left unchanged.

    ```file {title="/etc/postgresql/16/main/pg_hba.conf" lang="aconf"}
    # "local" is for Unix domain socket connections only
    local   all           all                                       peer
    # IPv4 local connections:
    host    all           all               127.0.0.1/32            scram-sha-256
    # IPv6 local connections:
    host    all           all               ::1/128                 scram-sha-256
    # Allow replication connections from localhost, by a user with the
    # replication privilege.
    local   replication   repmgr                                    trust
    host    replication   repmgr            127.0.0.1/32            trust
    host    replication   repmgr            PRIMARY_IP/32           trust
    host    replication   repmgr            STANDBY_IP/32           trust
    local   repmgr        repmgr                                    trust
    host    repmgr        repmgr            127.0.0.1/32            trust
    host    repmgr        repmgr            PRIMARY_IP/32           trust
    host    repmgr        repmgr            STANDBY_IP/32           trust
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Restart the PostgreSQL process on the primary using an account with `sudo` privileges:

    ```command {title="Primary Node as sudo User"}
    sudo systemctl restart postgresql
    ```

1.  Ensure there are no error messages and PostgreSQL is still `active`:

    ```command {title="Primary Node as sudo User"}
    systemctl status postgresql
    ```

    Press the <kbd>Q</kbd> key to exit the `systemctl status` output.

1.  Ensure the primary database is accessible from the standby nodes. Run the following command on one of the *standby* nodes as the `postgres` user to generate a `psql` connection to the `repmgr` database on the primary. Substitute the actual IP address of the primary for `PRIMARY_IP` in the command below:

    ```command {title="Standby Node as postgres User"}
    psql 'host=PRIMARY_IP user=repmgr dbname=repmgr connect_timeout=2'
    ```

    The PostgreSQL prompt should appear, indicating the `repmgr` database context:

    ```output
    psql (16.1 (Ubuntu 16.1-1.pgdg22.04+1))
    SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, compression: off)
    Type "help" for help.

    repmgr=#
    ```

    When done, type `quit` or `exit` to leave the PostgreSQL prompt, then type `exit` again to return to the terminal shell as your standard Linux user with `sudo` privileges.

### How to Configure the repmgr Cluster Definition

Additional repmgr-specific configuration must be added to both nodes. The `/etc/repmgr.conf` file must contain the following information:

- `node_id`: A unique numeric identifier for the node within the HA cluster.
- `node_name`: An unique string-based identifier for the node.
- `conninfo`: Connection parameters for accessing the node. Other nodes must be able to connect using this string.
- `data_directory`: The storage directory for repmgr data.
- `failover`: This must be set to `automatic` to enable an automatic switchover to a standby when the primary fails.
- `promote_command`: A command to execute when promoting the node.
- `follow_command`: A command to execute when following a new primary node. This directive is optional for two-node networks.

For a complete list of all `repmgr.conf` settings, see the [repmgr.conf documentation on GibHub](https://raw.githubusercontent.com/EnterpriseDB/repmgr/master/repmgr.conf.sample).

Follow the steps below to configure the repmgr settings.

1.  Create a `etc/repmgr.conf` file on the *primary* node in your regular user account with `sudo` privileges:

    ```command {title="Primary Node as sudo User"}
    sudo nano /etc/repmgr.conf
    ```

    Add the following lines to the file, but replace `PRIMARY_IP` with the IP address of the primary node:

    ```file {title="/etc/repmgr.conf" lang="aconf"}
    node_id=1
    node_name=pg1
    conninfo='host=PRIMARY_IP user=repmgr dbname=repmgr connect_timeout=2'
    data_directory='/var/lib/postgresql/16/data'
    failover=automatic
    promote_command='repmgr -f /etc/repmgr.conf standby promote --log-to-file'
    follow_command='repmgr -f /etc/repmgr.conf standby follow --log-to-file'
    log_file='/var/log/postgresql/repmgr.log'
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Create an `etc/repmgr.conf` file on each standby node:

    ```command {title="Standby Node as sudo User"}
    sudo nano /etc/repmgr.conf
    ```

    The file should closely resemble the same file on the primary, with a few changes. `node_id` and `node_name` must be unique to each node. In `conninfo`, the `host` variable indicates the local IP address. Replace `STANDBY_IP` with the IP address of the standby node under configuration.

    ```file {title="/etc/repmgr.conf" lang="aconf"}
    node_id=2
    node_name=pg2
    conninfo='host=STANDBY_IP user=repmgr dbname=repmgr connect_timeout=2'
    data_directory='/var/lib/postgresql/16/data'
    failover=automatic
    promote_command='repmgr -f /etc/repmgr.conf standby promote --log-to-file'
    follow_command='repmgr -f /etc/repmgr.conf standby follow --log-to-file'
    log_file='/var/log/postgresql/repmgr.log'
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

## How to Initialize and Run a PostgreSQL HA Cluster

To initialize and run the HA cluster, register the master, clone the standby servers, then register the standbys.

{{< note >}}
By default, repmgr uses the `pg_basebackup` utility to clone the server. This is the best option for most users. Users wanting additional control over the installation can configure and use Barman. However, this procedure is much more complicated. See the [repmgr Barman documentation](https://www.repmgr.org/docs/current/cloning-from-barman.html) for more information.
{{< /note >}}

To start running the HA cluster, execute the following commands as the `postgres` user on the primary server only.

1.  If necessary, login as the `postgres` user:

    ```command {title="Primary Node as sudo User"}
    su - postgres
    ```

1.  Register the primary server using `repmgr`. Specify the repmgr configuration file using the `-f` option.

    ```command {title="Primary Node as postgres User"}
    repmgr -f /etc/repmgr.conf primary register
    ```

    The repmgr utility confirms the primary is registered:

    ```output
    INFO: connecting to primary database...
    NOTICE: attempting to install extension "repmgr"
    NOTICE: "repmgr" extension successfully installed
    NOTICE: primary node record (ID: 1) registered
    ```

1.  Confirm the primary is running using the `cluster show` command.

    ```command {title="Primary Node as postgres User"}
    repmgr -f /etc/repmgr.conf cluster show
    ```

    A node with an `ID` of `1` has the role of `primary` and a status of `running`.

    ```output
    ID | Name | Role    | Status    | Upstream | Location | Priority | Timeline | Connection string
    ----+------+---------+-----------+----------+----------+----------+----------+----------------------------------------------------------------
    1  | pg1  | primary | * running |          | default  | 100      | 1        | host=192.0.0.81 user=repmgr dbname=repmgr connect_timeout=2
    ```

1.  Move to the first *standby* node and switch to the `postgres` user if necessary:

    ```command {title="Standby Node as sudo User"}
    su - postgres
    ```

1.  Create a clone from the primary, and include the following options:

    - The `host` option `-h` must specify the IP address of the primary node. Replace `PRIMARY_IP` with the actual IP address.
    - Set the `user` option `-U` to `repmgr`.
    - Set the database option `-d` to `repmgr`.
    - The `file` option `-f` indicates the location of the repmgr configuration file.
    - Add the `--copy-external-config-files` flag to copy the PostgreSQL configuration files.

    Users should ideally test this command first using the `--dry-run`. This command indicates if there are any errors and provides a preview of what the `clone` command intends to do.

    ```command {title="Standby Node as postgres User"}
    repmgr -h PRIMARY_IP -U repmgr -d repmgr -f /etc/repmgr.conf standby clone --copy-external-config-files --dry-run
    ```

    The repmgr output confirms whether or not the standby can attach to the primary node. Search for the messages `NOTICE: standby will attach to upstream node` and `INFO: all prerequisites for "standby clone" are met`. It is safe to ignore the warning about data checksums because they are not used in this configuration.

    ```output
    NOTICE: standby will attach to upstream node 1
    ...
    INFO: all prerequisites for "standby clone" are met
    ```

1.  If the dry run is successful, run the command again without the `--dry-run` option:

    ```command {title="Standby Node as postgres User"}
    repmgr -h PRIMARY_IP -U repmgr -d repmgr -f /etc/repmgr.conf standby clone --copy-external-config-files
    ```

    ```output
    NOTICE: standby clone (using pg_basebackup) complete
    NOTICE: you can now start your PostgreSQL server
    ```

1.  Repeat the steps above to clone any other standby nodes.

1.  On the standby node, make a further adjustment to `postgresql.conf`:

    ```command {title="Standby Node as postgres User"}
    nano /etc/postgresql/16/main/postgresql.conf
    ```

    Change `data_directory` to the same directory as `data_directory` in the `repmgr.conf` file, for example, `/var/lib/postgresql/16/data`. The other file changes were copied to the standby during the clone operation.

    ```file {title="/etc/postgresql/16/main/postgresql.conf" lang="aconf"}
    data_directory = '/var/lib/postgresql/16/data'
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`. Type `exit` to log out of the `postgres` user and return to the terminal shell as your standard Linux user with `sudo` privileges.

1.  Restart PostgreSQL on all standby nodes:

    ```command {title="Standby Node as sudo User"}
    sudo systemctl restart postgresql
    ```

1.  Verify that PostgreSQL has a `status` of `active`:

    ```command {title="Standby Node as sudo User"}
    sudo systemctl status postgresql
    ```

    Press <kbd>Q</kbd> to close the output and return to the terminal shell.

1.  After PostgreSQL is restarted on the standby, it contacts the primary for the database contents. To confirm replication is active, access the PostgreSQL shell on the *primary* node as the `postgres` user:

    ```command {title="Primary Node as postgres User"}
    psql
    ```

1.  Run the following command to list the standby nodes that have contacted the primary:


    ```command {title="Primary Node as postgres User in PostgreSQL Shell"}
    SELECT * FROM pg_stat_replication;
    ```

    Each active standby node should have its own entry. Scan for the following details in the output:

    - `application_name` should contain the `node_name` of the standby.
    - The `client_addr` should indicate the IP address of the standby node.
    - The `state` should be `streaming`.
    - The `sync_state` is `async`.

    ```output
    pid  | usesysid | usename | application_name |   client_addr   | client_hostname | client_port |         backend_start         | backend_xmin |   state   | sent_lsn  | write_lsn | flush_lsn | replay_lsn | write_lag | flush_lag | replay_lag | sync_priority | sync_state |          reply_time
    -------+----------+---------+------------------+-----------------+-----------------+-------------+-------------------------------+--------------+-----------+-----------+-----------+-----------+------------+-----------+-----------+------------+---------------+------------+-------------------------------
    41968 |    16388 | repmgr  | pg2              | 192.0.0.82  |                 |       36820 | 2023-10-16 21:32:21.955465+00 |              | streaming | 0/30002D8 | 0/30002D8 | 0/30002D8 | 0/30002D8  |           |           |            |             0 | async      | 2023-10-16 21:33:21.994021+00
    ```

    Although updates are being sent to the standby, it is still not registered with repmgr. Until it is registered, it is not able to take over from the primary.

    {{< note >}}
    If replication is not working, access the `psql` shell on the standby and run the command `SELECT * FROM pg_stat_wal_receiver;`. This command is less intuitive, but the `status` column should be `streaming` and `sender_host` should be the IP address of the primary. It also displays the timestamp of the most recent update.
    {{< /note >}}

    When done, type `quit` or `exit` to leave the `psql` shell and return to the Linux terminal prompt as the `postgres` user.

1.  Return to the standby server and log in as the `postgres` account if not already:

    ```command {title="Standby Node as sudo User"}
    su - postgres
    ```

1.  Register the node as a standby with the `repmgr standby register` command, specifying the location of the repmgr configuration file using the `-f` option.

    ```command {title="Standby Node as postgres User"}
    repmgr -f /etc/repmgr.conf standby register
    ```

    ```output
    INFO: standby registration complete
    NOTICE: standby node "pg2" (ID: 2) successfully registered
    ```

1.  Repeat this operation on each standby node.

1.  Run the `cluster show` command on the standby to confirm it is registered:

    ```command {title="Standby Node as postgres User"}
    repmgr -f /etc/repmgr.conf cluster show
    ```

    ```output
    ID | Name | Role    | Status    | Upstream | Location | Priority | Timeline | Connection string
    ----+------+---------+-----------+----------+----------+----------+----------+------------------------------------------------------------------
    1  | pg1  | primary | * running |          | default  | 100      | 1        | host=192.0.0.81 user=repmgr dbname=repmgr connect_timeout=2
    2  | pg2  | standby |   running | pg1      | default  | 100      | 1        | host=192.0.0.82 user=repmgr dbname=repmgr connect_timeout=2
    ```

1.  Register **all** nodes, including the primary and all standby nodes, with `repmgrd`. The daemon monitors the node and quickly responds to any failures.

    ```command {title="All Nodes as postgres User"}
    repmgrd -f /etc/repmgr.conf -d
    ```

    The primary should display messages similar to the following ones:

    ```output
    [2023-10-17 17:06:23] [NOTICE] starting monitoring of node "pg1" (ID: 1)
    [2023-10-17 17:06:23] [NOTICE] monitoring cluster primary "pg1" (ID: 1)
    [2023-10-17 17:06:23] [INFO] child node "pg2" (ID: 2) is attached
    ```

    The standby should display a slightly different set of messages:

    ```output
    [2023-10-17 17:08:04] [NOTICE] starting monitoring of node "pg2" (ID: 2)
    [2023-10-17 17:08:04] [INFO] monitoring connection to upstream node "pg1" (ID: 1)
    ```

## Testing a Failover Event

To verify the solution is working, first confirm the data is being replicated. If the output of the various debug commands in the previous section is correct, replication is probably working. Then shut down PostgreSQL on the active. After a timeout, one of the standby nodes should become the new primary. Users can then write data to it.

To confirm the HA cluster is working, follow these steps.

1.  On the primary node, access the `postgres` database as the `postgres` database user:

    ```command {title="Primary Node as postgres User"}
    psql postgres
    ```

1.  Create a new `customers` table inside the `postgres` database:

    ```command {title="Primary Node as postgres User in PostgreSQL Shell"}
    CREATE TABLE customers (customer_id int, first_name varchar(80), last_name varchar(80));
    ```

    {{< note >}}
    For an explanation of the most common `psql` commands, see the [How to Install and Use PostgreSQL guide](/docs/guides/how-to-install-use-postgresql-ubuntu-20-04/).
    {{< /note >}}

1.  Ensure the table is successfully created:

    ```command {title="Primary Node as postgres User in PostgreSQL Shell"}
    \dt
    ```

    The new table appears in the output:

    ```output
               List of relations
     Schema |   Name    | Type  |  Owner
    --------+-----------+-------+----------
     public | customers | table | postgres
    (1 row)
    ```

    When done, type `quit` or `exit` to leave the `psql` shell and return to the Linux terminal prompt as the `postgres` user. Type `exit` to log out of the `postgres` user and return to the terminal shell as your standard Linux user with `sudo` privileges.

1.  Access PostgreSQL on the *standby* node:

    ```command {title="Standby Node as postgres User"}
    psql postgres
    ```

1.  List the tables inside the `postgres` database:

    ```command {title="Standby Node as postgres User in PostgreSQL Shell"}
    \dt
    ```

    The same table appears in the output. The update on the primary is replicated to this node.

    ```output
    List of relations
     Schema |   Name    | Type  |  Owner
    --------+-----------+-------+----------
     public | customers | table | postgres
    ```

    When done, type `quit` or `exit` to leave the `psql` shell and return to the Linux terminal prompt as the `postgres` user.

1.  To initiate a switchover, stop the `postgresql` process on the primary node. Run this command using an account with `sudo` privileges:

    ```command {title="Primary Node as sudo User"}
    sudo systemctl stop postgresql
    ```

1.  The standby node makes a few attempts to reconnect to the primary. After this fails, it takes over as the new primary node. A similar list of trace messages should appear in the console of the standby node.

    {{< note >}}
    If there is more than one standby node, the nodes hold a primary election to determine the new primary.
    {{< /note >}}

    ```output
    [2023-10-17 17:13:10] [WARNING] unable to ping "host=192.0.0.81 user=repmgr dbname=repmgr connect_timeout=2"
    [2023-10-17 17:13:10] [DETAIL] PQping() returned "PQPING_NO_RESPONSE"
    [2023-10-17 17:13:10] [WARNING] unable to connect to upstream node "pg1" (ID: 1)
    [2023-10-17 17:13:10] [INFO] checking state of node "pg1" (ID: 1), 1 of 6 attempts
    ...
    2023-10-17 17:14:00] [WARNING] unable to reconnect to node "pg1" (ID: 1) after 6 attempts
    [2023-10-17 17:14:00] [INFO] 0 active sibling nodes registered
    [2023-10-17 17:14:00] [INFO] 2 total nodes registered
    [2023-10-17 17:14:00] [INFO] primary node  "pg1" (ID: 1) and this node have the same location ("default")
    [2023-10-17 17:14:00] [INFO] no other sibling nodes - we win by default
    [2023-10-17 17:14:00] [NOTICE] this node is the only available candidate and will now promote itself
    ...
    [2023-10-17 17:14:00] [NOTICE] promoting standby to primary
    [2023-10-17 17:14:00] [DETAIL] promoting server "pg2" (ID: 2) using pg_promote()
    [2023-10-17 17:14:00] [NOTICE] waiting up to 60 seconds (parameter "promote_check_timeout") for promotion to complete
    [2023-10-17 17:14:01] [NOTICE] STANDBY PROMOTE successful
    [2023-10-17 17:14:01] [DETAIL] server "pg2" (ID: 2) was successfully promoted to primary
    ...
    [2023-10-17 17:14:01] [INFO] original connection is still available
    [2023-10-17 17:14:01] [INFO] 0 followers to notify
    [2023-10-17 17:14:01] [INFO] switching to primary monitoring mode
    [2023-10-17 17:14:01] [NOTICE] monitoring cluster primary "pg2" (ID: 2)
    ```

1.  Use the `cluster show` command to indicate the previous standby `pg2` is now the primary. The old primary now has a status of `failed`.

    ```command {title="Standby Node as postgres User"}
    repmgr -f /etc/repmgr.conf cluster show
    ```

    The new table appears in the output:

    ```output
    ID | Name | Role    | Status    | Upstream | Location | Priority | Timeline | Connection string
    ----+------+---------+-----------+----------+----------+----------+----------+------------------------------------------------------------------
    1  | pg1  | primary | - failed  | ?        | default  | 100      |          | host=192.0.0.81 user=repmgr dbname=repmgr connect_timeout=2
    2  | pg2  | primary | * running |          | default  | 100      | 2        | host=92.0.0.82 user=repmgr dbname=repmgr connect_timeout=2
    ```

1.  Ensure the new primary allows write operations. Create a new table in the `postgres` database to verify this:

    ```command {title="Standby Node as postgres User"}
    psql
    ```

    ```command {title="Standby Node as postgres User in PostgreSQL Shell"}
    CREATE TABLE customers2 (customer_id int, first_name varchar(80), last_name varchar(80));
    ```

    ```command {title="Standby Node as postgres User in PostgreSQL Shell"}
    \dt
    ```

    The new `customers2` table is listed alongside the previous table:

    ```output
               List of relations
     Schema |    Name    | Type  |  Owner
    --------+------------+-------+----------
     public | customers  | table | postgres
     public | customers2 | table | postgres
    (2 rows)
    ```

{{< note >}}
Unfortunately, repmgr cannot fix failed nodes. The old primary must be repaired manually and reconfigured as a standby. See the [repmgr FAQ](https://www.repmgr.org/docs/current/faq-repmgr.html) for more information on how to convert a failed primary into a standby.
{{< /note >}}

## Conclusion

To add high availability capabilities to PostgreSQL, use the repmgr replication manager. In this architecture, a master primary node replicates all changes to one or more standby nodes. The primary handles all write operations, while read operations are shared between all nodes in the HA cluster. To implement this solution, install PostgreSQL and repmgr, then edit several configuration files. Register the primary node and clone and register the standby nodes. For more information, see the [repmgr documentation](https://www.repmgr.org/docs/current/getting-started.html).