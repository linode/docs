---
slug: install-cassandra-across-multiple-data-centers
title: "How to Install Cassandra Across Multiple Data Centers"
description: 'This guide introduces the Cassandra distributed database and explains how to install, configure, and use it.'
keywords: ['install Cassandra','configure Cassandra','Cassandra CQL','create keyspace Cassandra']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Jeff Novotny"]
published: 2023-08-22
modified_by:
  name: Linode
external_resources:
- '[Cassandra](https://cassandra.apache.org/_/index.html)'
- '[Cassandra Documentation](https://cassandra.apache.org/doc/latest/)'
- '[Cassandra Install Documentation](https://cassandra.apache.org/doc/latest/cassandra/getting_started/installing.html)'
- '[Cassandra FAQ](https://cassandra.apache.org/doc/latest/cassandra/faq/index.html)'
- '[Cassandra CQL documentation](https://cassandra.apache.org/doc/latest/cassandra/cql/index.html)'
- '[Cassandra Quick Start](https://cassandra.apache.org/_/quickstart.html)'
- '[cassandra.yaml configuration guide](https://cassandra.apache.org/doc/latest/cassandra/configuration/cass_yaml_file.html)'
- '[Data modeling in Cassandra](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/intro.html)'
- '[Production Concerns for Cassandra](https://cassandra.apache.org/doc/latest/cassandra/operating/index.html)'
---

[Apache Cassandra](https://cassandra.apache.org/_/index.html) is a distributed database designed for low-latency replication across geographically remote *data centers*. It allows users to define the number of copies to store in each center and determines the level of resiliency. This guide provides a brief introduction to Cassandra and demonstrates how to install and configure the software. It also explains how to define a keyspace and add tables and data to Cassandra.

## What is Cassandra?

Cassandra is an open source *NoSQL* database originally built by Facebook. NoSQL databases are an alternative to traditional *relational database management systems* (RDBMS) systems. They model data in a simple and flexible style without the rigid tabular constraints of RDBMS applications. NoSQL applications are generally faster than RDBMS systems, with higher throughput. However, they often duplicate data and are less consistent than RDBMS applications. NoSQL databases are designed to work in data centers consisting of distributed data and user sessions. They use the *horizontal scaling* strategy to increase the capacity of the system through the addition of new servers.

Due to its architecture and design, Cassandra minimizes latency and provides true real-time capabilities. Low latency is critical, as even small delays can dramatically decrease client satisfaction. Poor performance can also interfere with important tasks such as transaction processing and fraud detection. Cassandra is highly scalable, robust, and responsive. It quickly replicates data and continues to provide good performance even when handling a large number of user requests.

Cassandra is designed to run on multiple machines in a cluster-based architecture. The cluster can be topologically conceptualized as a ring of individual nodes. Although the nodes are independent of each other, they are also interconnected and share data. Using a hash function, the Cassandra replication process distributes records equally among the different nodes in the cluster. The cluster does not have a master node. Any system can handle read and write requests, and individual node failure does not affect the rest of the cluster. Cassandra can detect and correct data inconsistencies and automatically manage node additions and removals.

The nodes within a Cassandra cluster can be geographically distributed across multiple data centers and around the world. This brings the database closer to the end user, reducing routing delays. Users in Europe can access a data center in London, while American customers use the Chicago data center. Because both data centers are part of the same cluster, the entries are automatically integrated, reconciled, and replicated.

Each Cassandra cluster includes one or more data centers, and each data center contains multiple *racks*. A rack can include multiple servers, but they must share the same IP address. Within a data center, racks might be physically separated, but they are generally in the same vicinity. Some architectures define a logical data center, consisting of two or more data centers or a single geographically dispersed data center.

### Data Management in Cassandra

Cassandra uses a lightweight variant of SQL called the *Cassandra Query Language* (CQL). Like most NoSQL languages, CQL is simpler and easier to use than SQL. The Cassandra CQL shell can be accessed using the `cqlsh` command. The base-level CQL object is a keyspace, which groups related data together. A keyspace is similar to a *database* in an RDBMS application. It defines the replication details for all of its tables. A Cassandra table differs somewhat from its RDBMS equivalent. It stores a list of key-value pairs (which can be nested many levels deep) and is typically not normalized.

Cassandra requires a different approach to data modeling compared to an RDBMS application. To efficiently model tables and columns, follow these principles:

-   Map each Cassandra table to one or more queries.
-   Inside the table, add all columns required to address the queries.
-   If necessary, include the same information inside different tables, even though this duplicates data. Rapid query processing takes precedence over data normalization.
-   In every table, include a primary key to uniquely identify the entry. This key enables replication, allowing Cassandra to partition the data across multiple nodes.

Cassandra is a complex application with many options and parameters. It is important to have a basic understanding of its architecture before using it in production. For more information, review the [Cassandra Documentation](https://cassandra.apache.org/doc/latest/). Consult the [Data Modelling Guidelines](https://cassandra.apache.org/doc/latest/cassandra/data_modeling/intro.html) before proceeding with the database design.

### Advantages and Disadvantages of Cassandra

In addition to data distribution and replication, there are many advantages and use cases for Cassandra:

-   It can gracefully handle traffic spikes.
-   It features highly flexible data management.
-   It is an excellent choice whenever redundancy and enhanced reliability are required.
-   It greatly reduces latency across different geographical regions.
-   It can assist with disaster recovery and unexpected outages of an entire data center.
-   It includes enhanced analytics and logs.
-   It efficiently handles sparse data, in which not all columns appear in all records.

Cassandra is usually not the best choice for small or little-used data sets, or if replication and high availability are not important. In these cases, it introduces unnecessary complexity and overhead. Cassandra does not support table joins, so it is not a good choice for heavily normalized data. Finally, it can be complex and difficult to learn, and it might require considerable tuning before being put into production.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Each data center should have at least two nodes. Cassandra recommends at least 4GB of memory for all nodes.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Cassandra

This guide is intended for Ubuntu 22.04 LTS users but is generally applicable for other Ubuntu releases and Linux distributions. All nodes in the cluster should use the same software release to avoid unexpected interoperability issues.

To install Cassandra, follow these steps. Unless otherwise specified, execute the following commands on every node in the Cassandra cluster.

1.  Ensure the system is up to date. Reboot the system if necessary:

    ```command
    sudo apt update -y && sudo apt upgrade -y
    ```

1.  Cassandra requires the use of a Java runtime. There are several different versions of Java to choose from, including OpenJDK and Oracle Java. This guide uses OpenJDK 11. Install OpenJDK using `apt`:

    ```command
    sudo apt install default-jre
    ```

1.  Use the `java -version` command to confirm that OpenJDK 11 is installed:

    {{< note type="secondary" title="Optional" >}}
    Cassandra does not require the Java compiler or JDK, but many administrators choose to install it anyway. Optionally install the default JDK using the following command:

    ```command
    sudo apt install default-jdk
    ```
    {{< /note >}}

    ```command
    java -version
    ```

    ```output
    openjdk version "11.0.19" 2023-04-18
    ```

1.  Cassandra supports several installation methods. This guide uses `apt` to install Cassandra. First add the Cassandra repository to the list of packages. The following example adds the package for release 4.1. To install a different release, replace `41x` with the actual major and minor release numbers.

    {{< note >}}
    A Cassandra Docker image and a binary file installation are also available. For information on these approaches, see the [Cassandra Install Documentation](https://cassandra.apache.org/doc/latest/cassandra/getting_started/installing.html).
    {{< /note >}}

    ```command
    echo "deb https://debian.cassandra.apache.org 41x main" | sudo tee -a /etc/apt/sources.list.d/cassandra.sources.list
    ```

    ```output
    deb https://debian.cassandra.apache.org 41x main
    ```

1.  Add the repository GPG keys to the list of trusted keys:

    ```command
    curl https://downloads.apache.org/cassandra/KEYS | sudo tee /etc/apt/trusted.gpg.d/cassandra.asc
    ```

1.  Update the list of packages:

    ```command
    sudo apt-get update
    ```

1.  Use `apt` to install the application:

    ```command
    sudo apt-get install cassandra
    ```

1.  Confirm that the status of the Cassandra service is `active`:

    ```command
    sudo systemctl status cassandra
    ```

    ```output
    ● cassandra.service - LSB: distributed storage system for structured data
         Loaded: loaded (/etc/init.d/cassandra; generated)
         Active: active (running) since Wed 2023-06-21 11:43:53 EDT; 41s ago
    ```

1.  Confirm that the `cqlsh` command connects to the database and displays the `cqlsh` prompt.

    {{< note >}}
    Cassandra takes about a minute to fully initialize. Before it is ready, it rejects any connection attempts.
    {{< /note >}}

    ```command
    cqlsh
    ```

    ```output
    [cqlsh 6.1.0 | Cassandra 4.1.2 | CQL spec 3.4.6 | Native protocol v5]
    Use HELP for help.
    cqlsh>
    ```

1.  Use the `exit` command to quit the CQL shell:

    ```command
    exit
    ```

1.  Repeat the steps in this section for each node in the cluster.

## How to Configure Cassandra to Run in Multiple Data Centers

After all nodes in the cluster are operational, they can be configured together into the same group. For each node, determine its data center and rack name. Each rack name must be unique within the data center.

A Cassandra node derives its configuration from the `cassandra.yaml` file. Although this file is quite extensive, only a few attributes are required to add a node to a cluster. For more information on the different configuration options, see the [cassandra.yaml configuration guide](https://cassandra.apache.org/doc/latest/cassandra/configuration/cass_yaml_file.html).

To fully configure a cluster, follow these steps.

1.  Configure the `ufw` firewall on each node to allow SSH connections, open ports `7000`, `9042`, and `9160`, and activate the firewall:

    ```command
    sudo ufw allow OpenSSH
    sudo ufw allow 7000/tcp
    sudo ufw allow 9042/tcp
    sudo ufw allow 9160/tcp
    sudo ufw enable
    ```

    ```output
    Rules updated
    Rules updated (v6)
    Rules updated
    Rules updated (v6)
    Rules updated
    Rules updated (v6)
    Rules updated
    Rules updated (v6)
    Command may disrupt existing ssh connections. Proceed with operation (y|n)? y
    Firewall is active and enabled on system startup
    ```

    {{< note type="secondary" title="Optional">}}
    For extra security, only allow connections from the other nodes in the cluster. The format for these commands is:

    ```command
    sudo ufw allow OpenSSH
    sudo ufw allow from remote-IP to local-IP proto tcp port 7000
    sudo ufw allow from remote-IP to local-IP proto tcp port 9042
    sudo ufw allow from remote-IP to local-IP proto tcp port 9160
    sudo ufw enable
    ```

    Replace `remote-IP` with the IP address of one of the other nodes, and `local-IP` with the IP address of the current node. Add an entry for each of the other nodes in the cluster, changing `remote-IP` to the actual IP address of the remote node.

    Unfortunately, this can become cumbersome for large clusters, and it is easy to accidentally omit a connection.
    {{< /note >}}

1.  Confirm the configuration:

    ```command
    sudo ufw status
    ```

    ```output
    Status: active
    To                         Action      From
    --                         ------      ----
    OpenSSH                    ALLOW       Anywhere
    9160/tcp                   ALLOW       Anywhere
    7000/tcp                   ALLOW       Anywhere
    9042/tcp                   ALLOW       Anywhere
    OpenSSH (v6)               ALLOW       Anywhere (v6)
    9160/tcp (v6)              ALLOW       Anywhere (v6)
    7000/tcp (v6)              ALLOW       Anywhere (v6)
    9042/tcp (v6)              ALLOW       Anywhere (v6)
    ```

1.  Shut down all nodes in the cluster to avoid data corruption or connection problems. If one of the nodes is currently used in production, this action should be performed within a maintenance window.

    ```command
    sudo systemctl stop cassandra
    ```

1.  Delete the application test data. This avoids any unnecessary data replication.

    ```command
    sudo rm -rf /var/lib/cassandra/*
    ```

1.  Repeat the above steps for each node in the cluster.

1.  Determine the architecture for the cluster.

    -   Choose a name for the entire cluster.
    -   Divide the nodes into data centers based on their proximity to each other.
    -   Decide on a meaningful name for each data center.
    -   Within each data center, supply a rack name for each system. Finally, determine the seed order within each data center. Seed nodes manage cluster discovery and activation. Choose at least two seeds for the cluster, one of which should be the primary seed.

    {{< note >}}
    For more information about seeds, see the [Cassandra FAQ](https://cassandra.apache.org/doc/latest/cassandra/faq/index.html).
    {{< /note >}}

1.  On the first node, edit the main Cassandra YAML file:

    ```command
    sudo nano /etc/cassandra/cassandra.yaml
    ```

1.  Make the following changes:

    -   For the `cluster_name` attribute, enter the cluster name. This entry must be the same for every node in the cluster.

    -   Inside the `parameters` record in the `seed_provider` attribute, add a comma-separated list of seeds to the `seeds` variable. Enter the primary seed for the local data center first, followed by the other seed nodes in the data center. Then append any seeds from the other data centers.

        For example, data center `dc1` might have the primary seed `node1` and the secondary seed `node2`. Another data center in the cluster has `node3` and `node4` as its seeds. For this cluster, the value of `seeds` should be `node1_ip, node2_ip, node3_ip, node4_ip`.

    -   The `listen_address` field must contain the IP address of the system. For additional security, use the private IP address, if one is configured.

    -   The `rpc_address` can be changed to the `127.0.0.1` loopback address. If the server hostname is configured, it can be left as `localhost`.

    -   Set the `endpoint_snitch` field to `GossipingPropertyFileSnitch`.

    The following file sample provides a template for the file changes. Follow the system architecture defined earlier and replace placeholder values (such as `NODE1_IP`) with the IP addresses corresponding to the associated node. Leave the remainder of the file unchanged.

    ```file {title="/etc/cassandra/cassandra.yaml" lang="yaml"}
    cluster_name: 'Main Cluster'
    ...
    seed_provider:
      - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
        - seeds: "NODE1_IP, NODE2_IP, NODE3_IP, NODE4_IP"
    ...
    listen_address: NODE1_IP
    ...
    rpc_address: 127.0.0.1
    ...
    endpoint_snitch: GossipingPropertyFileSnitch
    ```

    {{< note >}}
    Ensure `start_native_transport` is set to `true` and `native_transport_port` is `9042`. Depending on the Cassandra release, these values might already be set correctly.
    {{< /note >}}

1.  When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  On the same node, edit the `/etc/cassandra/cassandra-rackdc.properties` file:

    ```command
    sudo nano /etc/cassandra/cassandra-rackdc.properties
    ```

1.  Specify the data center and rack name of the system. The following example configures a node inside the `london` data center with the rack name `rack1`:

    ```file {title="/etc/cassandra/cassandra-rackdc.properties"}
    dc=london
    rack=rack1
    ```

1.  Configure `cassandra.yaml` and `cassandra-rackdc.properties` on the remaining nodes in the first data center.

    -   Start with the `cassandra.yaml` changes. Each system must have the same value for the `cluster_name` attribute.
    -   `seeds` must have the same value on each node in the same data center. The node addresses must appear in the same order each time.
    -   Set `listen_address` to the IP address of the system.
    -   For `cassandra-rackdc.properties`, `dc` remains the same for all nodes in the data center. But each system must have its own unique rack name.

    The following example illustrates how to configure the two files on a second node in the `london` data center.

    ```file {title="/etc/cassandra/cassandra.yaml" lang="yaml"}
    cluster_name: 'Main Cluster'
    ...
    seed_provider:
      - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
        - seeds: "NODE1_IP, NODE2_IP, NODE3_IP, NODE4_IP"
    ...
    listen_address: NODE2_IP
    ...
    rpc_address: 127.0.0.1
    ...
    endpoint_snitch: GossipingPropertyFileSnitch
    ```

    ```file {title="/etc/cassandra/cassandra-rackdc.properties"}
    dc=london
    rack=rack2
    ```

1.  Configure each additional node in the first data center in this manner, changing the value of `listen_address` as required.

1.  Now configure the nodes in the second data center.

    -   In `/etc/cassandra/cassandra.yaml`, The `cluster_name` must be the same for all nodes in all data centers.
    -   The `seeds` attribute must list the seed nodes for the local data center first, then the seeds for the remote centers.
    -   Change `listen_address` to the system IP address.
    -   In `/etc/cassandra/cassandra-rackdc.properties`, change the value of `dc` to the name of the second data center.
    -   Ensure each `rack` is unique within the center.

    The following example applies to a node in the `singapore` data center.

    ```file {title="/etc/cassandra/cassandra.yaml" lang="yaml"}
    cluster_name: 'Main Cluster'
    ...
    seed_provider:
      - class_name: org.apache.cassandra.locator.SimpleSeedProvider
      parameters:
        - seeds: "NODE3_IP, NODE4_IP, NODE1_IP, NODE2_IP"
    ...
    listen_address: NODE3_IP
    ...
    rpc_address: 127.0.0.1
    ...
    endpoint_snitch: GossipingPropertyFileSnitch
    ```

    ```file {title="/etc/cassandra/cassandra-rackdc.properties"}
    dc=singapore
    rack=rack1
    ```

## How to Activate a Cassandra Cluster

Nodes must be brought online in a certain order when activating the Cassandra cluster. Follow these steps to properly activate the cluster.

1.  Restart Cassandra on the primary seed in one of the data centers. This is the node listed first in `seeds`.

    ```command
    sudo systemctl start cassandra
    ```

1.  Ensure the Cassandra service is `active`:

    ```command
    sudo systemctl status cassandra
    ```

    ```output
    ● cassandra.service - LSB: distributed storage system for structured data
         Loaded: loaded (/etc/init.d/cassandra; generated)
         Active: active (running) since Wed 2023-06-21 14:05:57 EDT; 19s ago
    ```

1.  Restart the primary seed nodes in all remaining data centers. Wait for `cassandra` to become `active`.

1.  Restart all remaining nodes in the cluster, then wait two or three minutes to allow all systems to synchronize.

1.  Confirm the status of the cluster:

    ```command
    sudo nodetool status
    ```

    Each node appears in the output. The `Status/State` of each node should be `UN`, which stands for `Up` and `Normal`:

    ```output
    Datacenter: london
    ==================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address         Load        Tokens  Owns (effective)  Host ID                               Rack
    UN  192.168.1.5  132.68 KiB  16      47.9%             e6905cf5-5a97-447a-b57f-f22f9613510e  rack1
    UN  192.168.1.15 25.56 KiB   16      51.6%             672f85de-3eee-4971-b981-f6dd2c844f52  rack2

    Datacenter: singapore
    =====================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address         Load        Tokens  Owns (effective)  Host ID                               Rack
    UN  192.168.2.10  132.7 KiB   16      49.5%             c8a9accb-7df7-41ed-8062-7eba46faaa10  rack2
    UN  192.168.2.20  137.83 KiB  16      51.0%             8dd52e5b-4fcb-463f-9c2a-b71158663385  rack1
    ```

    {{< note >}}
    If a node is not `Up` and `Normal`, ensure the `cassandra` service is stable. Verify the details in `cassandra-rackdc.properties` and confirm the node is part of the correct data center. The rack name must be unique within the data center. After changing any configuration files, stop and restart Cassandra.
    {{< /note >}}

## How to Add Tables and Data to Cassandra

Cassandra uses the CQL language to alter database contents. Cassandra can read data from a file or users can add entries manually using the `cqlsh` utility. Create a *keyspace* before adding any tables or data. A keyspace defines the replication style, indicating how many times to replicate the data. Database tables are only meaningful within the context of their parent keyspace. For more information on CQL, consult the [Cassandra CQL documentation](https://cassandra.apache.org/doc/latest/cassandra/cql/index.html).

To add a keyspace, table, and data to Cassandra, follow these steps.

1.  Enter the CQL shell on one of the nodes.

    ```command
    cqlsh
    ```

1.  Create a keyspace using the `CREATE KEYSPACE` statement and define the replication procedure.

    -   For a cluster containing multiple data centers, use `NetworkTopologyStrategy` for the `class`.
    -   Specify a replication factor for each data center in the cluster. This indicates how many copies of the data to store in the data center.
    -   The syntax for the statement is `CREATE KEYSPACE IF NOT EXISTS keyspacename WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'datacenter1' : 2, 'datacenter2' : 2  };`.

    The following example saves two copies of each table entry in the `store` keyspace to the `london` data center, and two to the `singapore` center.

    ```command
    CREATE KEYSPACE IF NOT EXISTS store WITH REPLICATION = { 'class' : 'NetworkTopologyStrategy', 'london' : 2, 'singapore' : 2  };
    ```

1.  Confirm the keyspace is successfully created:

    ```command
    desc keyspaces;
    ```

    The new `store` keyspace is listed alongside any existing keyspaces:

    ```output
    store   system_auth         system_schema  system_views
    system  system_distributed  system_traces  system_virtual_schema
    ```

1.  Add a table to the keyspace. The table name is indicated using the syntax `keyspacename.tablename`. The definition defines the schema of columns, including the names and data types. Each table in a Cassandra keyspace must have a primary key. This key is used to partition the table entries.

    ```command
    CREATE TABLE IF NOT EXISTS store.shopping_cart (
    userid text PRIMARY KEY,
    item_count int
    );
    ```

1.  Use the `INSERT` command to add an entry to the table.

    ```command
    INSERT INTO store.shopping_cart (userid, item_count) VALUES ('59', 12);
    ```

1.  Use the `SELECT * FROM` command to view all data in the table.

    ```command
    SELECT * FROM store.shopping_cart;
    ```

    ```output
     userid | item_count
    --------+------------
     59     |         12
    (1 rows)
    ```

1.  To confirm the data has been replicated correctly, access the CQL shell on another node. Run the same `SELECT` command and ensure the same data is displayed. Validate all data centers to ensure Cassandra correctly adheres to the keyspace replication factor.

    {{< note >}}
    Cassandra creates the minimum number of copies to satisfy the keyspace requirements. If the replication factor for a data center is two, only two nodes in the center receive the table data. Depending on the network latency, it might take a second or so for data to appear in a distant data center. This is especially likely for batch reads of data from a file.
    {{< /note >}}

    ```command
    SELECT * FROM store.shopping_cart;
    ```

    ```output
     userid | item_count
    --------+------------
     59     |         12
    (1 rows)
    ```

{{< note >}}
Before deploying Cassandra into production, consider aspects including authorization, security, encryption, compression, monitoring, and making backups. The [Operating Cassandra](https://cassandra.apache.org/doc/latest/cassandra/operating/index.html) section of the official documentation covers a wide range of production concerns.
{{< /note >}}

## Conclusion

Apache Cassandra is a distributed database designed for low latency, high throughput, and high redundancy. It can replicate data across different data centers, with each center containing locally proximate nodes. Cassandra can be installed using either `apt` or Docker, and configured using several YAML and text files. To add data to Cassandra, first define a keyspace to indicate how to replicate data within the cluster. Then add tables to the keyspace and add data to the tables. For more information on Cassandra, see the [Cassandra Documentation](https://cassandra.apache.org/doc/latest/).