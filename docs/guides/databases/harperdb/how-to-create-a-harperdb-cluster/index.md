---
slug: how-to-create-a-harperdb-cluster
title: "How to Create a HarperDB Cluster"
description: 'This guide explains how to configure HarperDB and how to create a multi-node cluster for data replication.'
og_description: 'This guide explains how to configure HarperDB and how to create a multi-node cluster for data replication.'
keywords: ['install HarperDB','configure HarperDB','HarperDB cluster','data replication HarperDB']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["Jeff Novotny"]
published: 2023-07-17
modified_by:
  name: Linode
external_resources:
- '[HarperDB](https://www.harperdb.io/)'
- '[HarperDB API reference](https://api.harperdb.io/)'
- '[HarperDB Developer Documentation](https://docs.harperdb.io/docs/)'
- '[Installing HarperDB](https://docs.harperdb.io/docs/install-harperdb)'
- '[HarperDB Linux install documentation](https://docs.harperdb.io/docs/install-harperdb/linux)'
- '[Mozilla btoa documentation](https://developer.mozilla.org/en-US/docs/Web/API/btoa)'
---

[HarperDB](https://www.harperdb.io/) is a versatile database solution that combines SQL and NoSQL functionality. It includes a comprehensive built-in API for easy integration with other applications. This guide provides a brief introduction to HarperDB and explains how to install it. It also explains how to configure multiple database instances into a cluster and replicate data.

## What is HarperDB?

HarperDB combines a flexible database, built-in API, and distribution logic into a single backend. This solution, known as an *embedded database*, allows developers to more quickly and easily create integrated web applications. HarperDB allows both NoSQL and SQL tables to be mixed together in the same database and schema. SQL tables are highly structured and normalized, while NoSQL permits more freeform data. This combination enables access to legacy data and operational systems in the same place as new business intelligence analytics.

HarperDB is available through the HarperDB Cloud or as a self-hosted solution. The optional HarperDB Studio provides a visual GUI for storing or retrieving data, but requires registration. Users can configure HarperDB through either the comprehensive API or the HarperDB CLI. Unfortunately, the CLI only supports a subset of the current functionality. API calls can be embedded into an application or sent as stand-alone requests using `curl` or a similar utility.

{{< note >}}
Users can send most SQL commands to HarperDB using the API. A full SQL parser is still under development, but should be available in an upcoming release.
{{< /note >}}

HarperDB is optimized for fast performance and scalability, with sub-millisecond latency between the API and data layer. NoSQL data can be accessed as quickly as SQL tables in traditional *relational database management systems* (RDBMS). HarperDB is particularly useful for gaming, media, manufacturing, status reporting, and real-time updates.

HarperDB also supports clustering and per-table data replication. Data replication can be configured in one or both directions. Administrators have full control over how the data is replicated within the cluster. A HarperDB instance can both send table updates to a second node and receive updates from it in return. But it can simultaneously transmit changes to a second table to another node in a unidirectional manner. HarperDB minimizes data latency between nodes, allowing clusters encompassing different regions and different continents. Clusters can grow very large, permitting virtually unlimited horizontal scaling.

Some advantages of HarperDB are:

* The HarperDB API provides applications with direct database access. This allows the application and its data to be bundled together in a single distribution.
* Each HarperDB node is atomic and guarantees "exactly-once" delivery. It avoids unnecessary data duplication.
* Every node in the cluster can read, write, and replicate data.
* HarperDB features a fast and resilient caching mechanism.
* Connections are self-healing, allowing for fast replication even in an unstable network.
* HarperDB support data streaming and *edge processing*. This technique pre-processes data, only storing or transmitting the most important information.
* NoSQL tables support dynamic schemas, which can seamlessly change as new data arrives. HarperDB provides an auto-indexing function for more efficient hashing.
* HarperDB allows SQL queries on both structured and unstructured data.
* HarperDB's Custom Functions allow developers to add their own API endpoints and manage authentication and authorization.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  On a multi-user system, it is best to create a dedicated HarperDB user account with `sudo` access. Use this account for the instructions in this guide.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How To Install HarperDB

Run these instructions on every node in the cluster. These guidelines are designed for Ubuntu 22.04 LTS users, but are similar on other Linux distributions. HarperDB is also available as a Docker container or as a `.tgz` file for offline installation. For more details on these options and on the standard installation procedure, see the [HarperDB installation instructions](https://docs.harperdb.io/docs/install-harperdb).

1.  Ensure the system is up to date.

    ```command
    sudo apt-get update -y && sudo apt-get upgrade -y
    ```

1.  HarperDB requires Node.js to run properly. To install Node.js, first install the *Node Version Manager* (NVM). To download and install NVM, use the following command.

    ```command
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
    ```

1.  Log out and log back in to the terminal to activate NVM.

    ```command
    exit
    ssh username@system_IP
    ```

1.  Use NVM to install Node.js. This command installs Node.js release 18, the current LTS release. It also installs the NPM package manager for Node.js.

    {{< note >}}
    HarperDB requires Node.js release 14 or higher.
    {{< /note >}}

    ```command
    nvm install 18
    ```

    NVM sets release `18.17` as the default Node.js release.

    ```output
    Now using node v18.17.0 (npm v9.6.7)
    Creating default alias: default -> 18 (-> v18.17.0)
    ```

1.  Create a swap file for the system.

    ```command
    sudo dd if=/dev/zero of=/swapfile bs=128M count=16
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab
    ```

1.  Increase the open file limits for the account. Replace `accountname` with the name of the actual account.

    ```command
    echo "accountname soft nofile 500000" | sudo tee -a /etc/security/limits.conf
    echo "accountname hard nofile 1000000" | sudo tee -a /etc/security/limits.conf
    ```

1.  Use NPM to install HarperDB.

    ```command
    npm install -g harperdb
    ```

## How To Configure and Initialize the HarperDB Cluster

This section explains the steps required to initialize and run HarperDB. It also describes the additional configuration required to create and enable a HarperDB cluster. Each cluster must contain at least two nodes.

Some cluster attributes can be passed as parameters to the initial `harperdb start` command. If the system is initially configured as a stand-alone instance, it can be added to a cluster later on. However, further changes cannot be made through the command line. They must be implemented in either the `harperdb-config.yaml` file or through API calls.

For simplicity and consistency, this guide appends most of the required cluster configuration to the initial `harperdb start` command. It then completes the configuration process using API calls. For more information on the HarperDB API, see the [HarperDB API documentation](https://api.harperdb.io/).

{{< note >}}
Configuration tasks can also be accomplished through the HarperDB Studio GUI. HarperDB Studio requires a HarperDB user account and registration.
{{< /note >}}

Replication occurs on a per-table basis and is configured after the schema and table are defined. See the following section for a more complete explanation. Follow these steps to enable clustering on your HarperDB nodes.

1.  On the first node, use `harperdb start` to launch the application. Provide the following configuration attributes in the command.

    - For `TC_AGREEMENT`, indicate `yes` to accept the terms of agreement.
    - Define the `ROOTPATH` directory for persistent data. This example sets the directory to `/home/user/hdb`. Replace `user` with the actual name of the user account.
    - Set the `HDB_ADMIN_USERNAME` to the name of the administrative user.
    - Provide a password for the administrative account in `HDB_ADMIN_PASSWORD`. Replace `password` with a more secure password.
    - Set `OPERATIONSAPI_NETWORK_PORT` to `9925`.
    - Choose a name for the `CLUSTERING_USER` and provide a password for the user in `CLUSTERING_PASSWORD`. These values must be the same for all nodes in the cluster.
    - Set `CLUSTERING_ENABLED` to `true`.
    - Identify the node using `CLUSTERING_NODENAME`. This name must be unique within the cluster.

    {{< note >}}
    HTTPS is recommended for better security on production systems or with sensitive data. To use HTTPS, add the parameters `--OPERATIONSAPI_NETWORK_HTTPS "true"` and `--CUSTOMFUNCTIONS_NETWORK_HTTPS "true"`.
    {{< /note >}}

    ```command
    harperdb start \
    --TC_AGREEMENT "yes" \
    --ROOTPATH "/home/user/hdb" \
    --OPERATIONSAPI_NETWORK_PORT "9925" \
    --HDB_ADMIN_USERNAME "HDB_ADMIN" \
    --HDB_ADMIN_PASSWORD "password" \
    --CLUSTERING_ENABLED "true" \
    --CLUSTERING_USER "cluster_user" \
    --CLUSTERING_PASSWORD "password" \
    --CLUSTERING_NODENAME "hdb1"
    ```

    ```output
    |------------- HarperDB 4.1.2 successfully started ------------|
    ```

1.  **Optional** To launch HarperDB at bootup, create a crontab entry for the application. Substitute the name of the administrative account for `user` and ensure the path reflects the release of NVM being used. In this example, the path entry reflects release `18.17` of NVM.

    {{< note >}}
    To integrate HarperDB with `systemd` and start/stop it using `systemctl`, see the [HarperDB Linux documentation](https://docs.harperdb.io/docs/install-harperdb/linux).
    {{< /note >}}

    ```command
    (crontab -l 2>/dev/null; echo "@reboot PATH=\"/home/user/.nvm/versions/node/v18.17.0/bin:$PATH\" && harperdb start") | crontab -
    ```

1.  Start HarperDB on the remaining nodes. Change the value of `CLUSTERING_NODENAME` to a different value. In this example, it is set to `hdb2`. The remaining attributes are the same as on the first node.

    ```command
    harperdb start \
    --TC_AGREEMENT "yes" \
    --ROOTPATH "/home/user/hdb" \
    --OPERATIONSAPI_NETWORK_PORT "9925" \
    --HDB_ADMIN_USERNAME "HDB_ADMIN" \
    --HDB_ADMIN_PASSWORD "password" \
    --CLUSTERING_ENABLED "true" \
    --CLUSTERING_USER "cluster_user" \
    --CLUSTERING_PASSWORD "password" \
    --CLUSTERING_NODENAME "hdb2"
    ```

1.  Run `harperdb status` on each node to confirm HarperDB is active. The `status` field should indicate `running`.

    ```command
    harperdb status
    ```

    ```output
    harperdb:
      status: running
      pid: 1726
    clustering:
      hub server:
        status: running
        pid: 1698
      leaf server:
        status: running
        pid: 1715
      network:
        - name: hdb1
        response time: 6
        connected nodes: []
        routes: []
      replication:
        node name: hdb1
        is enabled: true
        connections: []
    ```

1.  Determine the network topology for the cluster. A full mesh of connections is not required. Data can be replicated to any cluster node provided it is connected to the rest of the cluster. Design some measure of resiliency into the network. If a hub-and-spoke architecture is configured, the remaining nodes would be isolated if the central node suffers an outage. As a general guideline, connect each node to two other nodes. It is not necessary to add the route in both directions. For instance, a connection between `node1` and `node2` can be added to either `node1` or `node2`. Successful negotiation establishes a bidirectional route.

1.  Authentication is required to send messages to HarperDB using the API. To derive the `AuthorizationKey` from the name and password of the administrator account, use the JavaScript `btoa()` function. Run the command `btoa("HDB_ADMIN:password")` to convert the account credentials into a Base64 string. Replace `password` with the actual password.

    {{< note >}}
    JavaScript commands can be executed in a web browser console. On Firefox, select **Tools->Browser Tools->Web Developer Tools** to access the console. Choose the **Console** option within the developer window, then enter the command. Alternatively, online JavaScript emulators are widely available for the same purpose. Use the result for the `AuthorizationKey` values in the following API calls. See the [Mozilla documentation](https://developer.mozilla.org/en-US/docs/Web/API/btoa) for more information.
    {{< /note >}}

    ```command
    btoa("HDB_ADMIN:password")
    ```

1.  Add routes until the network architecture is fully implemented. If a cluster consists of `node`, `node2`, and `node3`, add a route on `node1` to reach `node2` and another on `node2` to `node3`. On node `hdb1`, run the `curl` command shown below to install a route to `hdb2`. Include the following information:

    * In the `POST` header, send the command to the local HarperDB process at `http://localhost:9925`.
    * Include an `Authorization` header. Use the `AuthorizationKey` derived from the administrator account and password in the previous step.
    * Inside the `data` header, set the `operation` to `cluster_set_routes` and set `server` to `hub`.
    - Use `routes` to specify a list of one or more routes to install. Each route consists of a `host` and a `port`, which is typically `9932`. The `host` is the IP address of the peer system. In the following example, replace `192.0.2.10` with the actual IP address of the peer.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "cluster_set_routes",
        "server": "hub",
        "routes":[ {"host": "192.0.2.10", "port": 9932} ]
    }'
    ```

    ```output
    {"message":"cluster routes successfully set","set":[{"host":"192.0.2.10","port":9932}],"skipped":[]}
    ```

1.  Stop and start the HarperDB instance to quickly negotiate the route.

    ```command
    harperdb stop
    harperdb start
    ```

1.  Run the `harperdb status` command again. Ensure the route is displayed under `routes`.

    ```command
    harperdb status
    ```

    ```output
    harperdb:
      status: running
            pid: 20926
    clustering:
      hub server:
        status: running
        pid: 20899
      leaf server:
        status: running
        pid: 20914
      network:
        - name: hdb1
        response time: 18
        connected nodes:
          - hdb2
        routes:
          - host: 192.0.2.10
            port: 9932
        - name: hdb2
        response time: 92
        connected nodes:
          - hdb1
        routes: []
      replication:
        node name: hdb1
        is enabled: true
        connections: []
    ```

## How to Add and Replicate Data on HarperDB

The cluster is now ready for replication. Replication occurs on a per-table basis in HarperDB, so data is not automatically replicated. Instead, one or more subscriptions define how to manage the table data. The schema and table must be created first before adding any subscriptions. Each subscription references a single peer node. To replicate data to multiple nodes, multiple subscriptions must be added.

A subscription contains the name of the `schema` and `table` to replicate, along with Boolean values for `publish` and `subscribe`. When `publish` is set to `true`, transactions on the local node are replicated to the remote node. Setting `subscribe` to `true` means any changes to the remote table are sent to the local node. Both values can be set to `true`, resulting in bidirectional replication. In all cases, the local node is the one receiving the subscription request.

The following example demonstrates how to create a schema, table, and subscription on node `hdb1`. The subscription both publishes and subscribes to the `dog` table, resulting in two-way replication between nodes `hdb1` and `hdb2`.

1.  Create the `dev` schema on node `hdb1` through the HarperDB API using the `create_schema` operation. Provide the correct value for the `AuthorizationKey` as described earlier.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "create_schema",
        "schema": "dev"
    }'
    ```

    ```output
    {"message":"schema 'dev' successfully created"}
    ```

2.  Create the `dog` table within the `dev` schema. This API call invokes the `create_table` operation and sets the `hash_attribute` to `id`. This is a NoSQL table, so columns and types are not defined.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "create_table",
        "schema": "dev",
        "table": "dog",
        "hash_attribute": "id"
    }'
    ```

    ```output
    {"message":"table 'dev.dog' successfully created."}
    ```

3.  Add a subscription to the `dog` table using the API `add_node` operation. Add the following information to the request.

    * Set `node_name` to `hdb2` to designate it as the peer for the purpose of replication.
    * Specify the schema and table to replicate. In this example, the `schema` is `dev` and the `table` is `dog`.
    * To transmit updates to `hdb2` set `publish` to `true`. This configures replication in one direction only.

    {{< note >}}
    The `add_node` operation can create multiple subscriptions for several schemas/tables at the same time. However, all subscriptions in the request must relate to the same peer. Separate each subscription using a comma and enclose it with the `[]` brackets. To replicate more tables to a different node, call the `add_node` API again and provide the new `node_name`.
    {{< /note >}}

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "add_node",
        "node_name": "hdb2",
        "subscriptions": [
            {
                "schema": "dev",
                "table": "dog",
                "subscribe": false,
                "publish": true
            }
        ]
    }'
    ```

    ```output
    {"message":"Successfully added 'hdb2' to manifest","added":[{"schema":"dev","table":"dog","publish":true,"subscribe":false}],"skipped":[]}
    ```

1.  Use `harperdb status` to confirm HarperDB is aware of the subscription.

    ```command
    harperdb status
    ```

    ```output
    ...
      replication:
        node name: hdb1
        is enabled: true
        connections:
          - node name: hdb2
            status: open
            ports:
              clustering: 9932
              operations api: 9925
            latency ms: 132
            uptime: 6h 49m 43s
            subscriptions:
            - schema: dev
              table: dog
              publish: true
              subscribe: false
    ```

1.  To subscribe to updates to the `dog` table from `hdb2`, use the `update_node` operation. Set both `subscribe` and `publish` to `true` in the API call.

    {{< note >}}
    `subscribe` and `publish` could have been both set to `true` in the original `add_node` operation. This method demonstrates how to update an existing subscription. To completely remove the subscription, use the `remove_node` operation and include the name of the node under `node_name`.
    {{< /note >}}

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "update_node",
        "node_name": "hdb2",
        "subscriptions": [
            {
                "schema": "dev",
                "table": "dog",
                "subscribe": true,
                "publish": true
            }
        ]
    }'
    ```

    ```output
    {"message":"Successfully updated 'hdb2'","updated":[{"schema":"dev","table":"dog","publish":true,"subscribe":true}],"skipped":[]}
    ```

1.  Add a record to the table to ensure replication is working. Either SQL or NoSQL can be used to add data to the `dog` table. This example adds a record using the NoSQL `insert` operation. Specify `dev` as the `schema` and `dog` as the table. Use the `records` attribute to add one or more entries to the table. Because NoSQL is very free-form, a variable number of key-value fields can be appended to the record. The `hash_attribute` is set to `id` in the table, so each new record must provide a unique value for the `id` field.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "insert",
        "schema": "dev",
        "table": "dog",
        "records": [
            {
                "id": 1,
                "dog_name": "Penny",
                "age": 7,
                "weight": 38
            }
        ]
    }'
    ```

    ```output
    {"message":"inserted 1 of 1 records","inserted_hashes":[1],"skipped_hashes":[]}
    ```

1.  To confirm the record has been added, retrieve the data using an SQL query. To send an SQL query to HarperDB, specify `sql` for the `operation` and set `sql` to the desired SQL statement. The query `"SELECT * FROM dev.dog` retrieves all records from the table. The output confirms `Penny` has been added to the table.

    {{< note >}}
    NoSQL data is not normalized or columnar, so the key-value pairs do not necessarily appear in any particular order.
    {{< /note >}}

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "sql",
        "sql": "SELECT * FROM dev.dog"
    }'
    ```

    ```output
    [{"weight":38,"id":1,"dog_name":"Penny","__updatedtime__":1690742615459.453,"__createdtime__":1690742615459.453,"age":7}]
    ```

1.  Change to the console of the `hdb2` node and run the same command. The output should be the same, indicating the record has been replicated to this node.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "sql",
        "sql": "SELECT * FROM dev.dog"
    }'
    ```

    ```output
    [{"id":1,"age":7,"__createdtime__":1690742615459.453,"weight":38,"dog_name":"Penny","__updatedtime__":1690742615459.453}]
    ```

1.  Confirm replication works in the opposite direction. Using the console for the `hdb2` node, add a second entry to the `dev.dog` table. Increment the `id` to `2` to ensure it is unique within the table.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "insert",
        "schema": "dev",
        "table": "dog",
        "records": [
            {
                "id": 2,
                "dog_name": "Rex",
                "age": 2,
                "weight": 68
            }
        ]
    }'
    ```

    ```output
    {"message":"inserted 1 of 1 records","inserted_hashes":[2],"skipped_hashes":[]}
    ```

1.  Return to the first node and retrieve all records from the `dev.dog` table. The reply should now list two dogs, including the entry added on `hdb2`. This confirms data is replicating in both directions.

    ```command
    curl --location --request POST 'http://localhost:9925' \
    --header 'Authorization: Basic AuthorizationKey' \
    --header 'Content-Type: application/json' \
    --data '{
        "operation": "sql",
        "sql": "SELECT * FROM dev.dog"
    }'
    ```

    ```output
    [{"weight":38,"id":1,"dog_name":"Penny","__updatedtime__":1690742615459.453,"__createdtime__":1690742615459.453,"age":7},{"weight":68,"id":2,"dog_name":"Rex","__updatedtime__":1690744053074.6084,"__createdtime__":1690744053074.6084,"age":2}]
    ```

## Conclusion

HarperDB is a flexible database solution with support for SQL and NoSQL tables. It allows individual database instances to be configured in a cluster, supporting data replication. Data replication operates on a per-table and per-node basis using either bidirectional or one-way updates. To install HarperDB, use the `npm install` command, then configure it from the command line. Schemas, tables, and subscriptions are managed using the HarperDB API. For more information on HarperDB, consult the [HarperDB developer documentation](https://docs.harperdb.io/docs/).