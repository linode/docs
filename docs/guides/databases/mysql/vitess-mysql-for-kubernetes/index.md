---
slug: vitess-mysql-for-kubernetes
title: "Using Vitess on Akamai Cloud: MySQL for Kubernetes"
description: "This guide teaches you how to deploy and scale Vitess, which provides automatic sharding and other improvements for MySQL, on Akamai Cloud LKE."
authors: ["Martin Heller"]
contributors: ["Martin Heller"]
published: 2023-08-14
modified: 2024-05-08
keywords: ['Vitess', 'Percona Server', 'Kubernetes', 'Open source database cluster management']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

## What is Vitess?

Vitess is a database clustering system for horizontal scaling of MySQL (and Percona Server for MySQL) through generalized sharding. Sharding allows you to break up your database into partitions, which lets the sharded database store more data and offer higher performance.

Manual sharding is a fragile, time-consuming process for database developers and administrators, because the original database needs to be split up into multiple databases with the same schema, and the client software needs to know which shard(s) to query for any given SQL statement. Historically, when open source databases grew to the point where sharding was needed, many teams took that as a cue to migrate their data to an enterprise database, as the costs and effort of manual sharding were likely to exceed the costs and effort of the migration.

Vitess started at YouTube in 2010 as a way to solve its MySQL scalability challenges, after going through an evolution involving read replicas, then more replicas, and then manual sharding. Vitess served all YouTube database traffic for over five years.

Eventually, YouTube released Vitess to open source and it was adopted by the Cloud Native Compute Foundation (CNCF) in 2018. Kubernetes (*k8s*) is also a CNCF project, and Vitess supports deployment and scaling on Kubernetes.

## Vitess Features and Use Cases

Vitess helps with 3 major use cases:

-   Scale a SQL database by sharding it while keeping application changes to a minimum.
-   Migrate from bare-metal or VMs to a private or public cloud.
-   Deploy and manage a large number of SQL database instances.

Vitess features fall into 5 major areas.

-   **Performance**

    - **Connection pooling:** Multiplex front-end application queries onto a pool of MySQL connections to optimize performance.
    - **Query de-duping:** Reuse the results of an in-flight query for any identical requests it receives while the in-flight query is still executing.
    - **Transaction manager:** Limit the number of concurrent transactions and manage timeouts to optimize overall throughput.

-   **Protection**

    - **Query rewriting and sanitization:** Add limits and avoid non-deterministic updates.
    - **Query blocking:** Customize rules to prevent potentially problematic queries from hitting your database.
    - **Query killing:** Terminate queries that take too long to return data.
    - **Table ACLs:** Specify access control lists (ACLs) for tables based on the connected user.

-   **Monitoring**

    Performance analysis tools let you monitor, diagnose, and analyze your database performance.

-   **Topology Management Tools**

    - Cluster management tools that handle planned and unplanned failovers
    - Web-based management GUI
    - Designed to work in multiple data centers/regions

-   **Sharding**

    - Virtually seamless dynamic re-sharding
    - Vertical and Horizontal sharding support
    - Multiple sharding schemes, with the ability to plug in custom ones

## Prerequisites

Before you install Vitess on LKE, you need to create a basic Kubernetes cluster. Follow the generic instructions in our [LKE getting started guide](/docs/products/compute/kubernetes/get-started/). You also need to install `kubectl`, the `mysql client`, and `vtctldclient` locally.

### Create an LKE (Kubernetes) Cluster

The size of the [LKE cluster you create for Vitess](https://cloud.linode.com/kubernetes/create) depends on your planned database size and load. As a guideline, Vitess recommends 250 GB of storage per shard. Translated to LKE nodes, that corresponds to 16 GB shared CPU Linodes for a development database, which has 320 GB of storage and 6 CPUs. For a production database, that corresponds to 16 GB dedicated or premium CPU Linodes, which have 320 GB of storage and 8 CPUs. Start with 3 nodes in the cluster, and allow the cluster to add nodes as needed, whether for more speed or more storage capacity. Pick a region that is close to your client application or users; that may or may not be the region that has the lowest latency from your local computer.

When you create your LKE cluster, name it something meaningful to you. This guide uses "Vitess", but that might be too generic for you. It takes a few minutes for all the nodes to start, but you can download the YAML file for the cluster sooner than that. Save your `kubeconfig` file’s path to the` $KUBECONFIG` environment variable in your local console using the following command:

```command
export KUBECONFIG=~/Downloads/<clustername>-kubeconfig.yaml
```

Now list the nodes in your cluster using the following command:

```command
kubectl get nodes
```

The output looks like the following:

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke116411-172761-649b48bf69f8   Ready    <none>   18m   v1.26.3
lke116411-172761-649b48bf8af9   Ready    <none>   18m   v1.26.3
lke116411-172761-649b48bfab4b   Ready    <none>   19m   v1.26.3

```

If `kubectl` isn’t already installed on your local machine, follow the instructions in our [Kubernetes Reference Guide](/docs/guides/kubernetes-reference/) for your OS and try the node list again.

Add the `KUBECONFIG` environment variable to your local `.bashrc` file, or the equivalent if you’re not using **bash**, such as `.zprofile` for **zsh**, so you don’t have to type it manually every time you open a new terminal window.


### Install a MySQL Client Locally

You need at least one MySQL client on your local machine. This example uses the [MySQL command line shell](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-install.html), but you might prefer a graphical client, such as [MySQL Workbench](https://www.mysql.com/products/workbench/). On a Mac, consider using [Homebrew](https://brew.sh/), to install the command line shell, which installs the server as well as the client.

### Install `vtctldclient` Locally

The simplest way to get the Vitess client is to install Vitess locally.

- On **Ubuntu**, follow the [upstream installation guide](https://vitess.io/docs/17.0/get-started/local/#install-vitess).

- On a **Mac**, use the command, `brew install vitess`.

- On another kind of system, either use [Docker](https://vitess.io/docs/17.0/get-started/local-docker/) or build Vitess from the source.

## Installing Vitess on LKE

To install Vitess on LKE, follow the steps below:

1.  Clone the Vitess repository locally using the following command:

    ```command
    ~ % git clone https://github.com/vitessio/vitess
    ```

    ```output
    Cloning into 'vitess'...
    remote: Enumerating objects: 387168, done.
    remote: Counting objects: 100% (745/745), done.
    remote: Compressing objects: 100% (319/319), done.
    remote: Total 387168 (delta 524), reused 546 (delta 415), pack-reused 386423
    Receiving objects: 100% (387168/387168), 327.07 MiB | 18.20 MiB/s, done.
    Resolving deltas: 100% (274143/274143), done.
    ```

1.  Use the `kubectl` command to install the Vitess k8s operator on your LKE cluster.

    ```command
    ~ % cd vitess/examples/operator
    operator % kubectl apply -f operator.yaml
    ```

    ```output
    customresourcedefinition.apiextensions.k8s.io/etcdlockservers.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitessbackups.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitessbackupstorages.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitesscells.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitessclusters.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitesskeyspaces.planetscale.com created
    customresourcedefinition.apiextensions.k8s.io/vitessshards.planetscale.com created
    serviceaccount/vitess-operator created
    role.rbac.authorization.k8s.io/vitess-operator created
    rolebinding.rbac.authorization.k8s.io/vitess-operator created
    deployment.apps/vitess-operator created
    priorityclass.scheduling.k8s.io/vitess-operator-control-plane created
    priorityclass.scheduling.k8s.io/vitess created
    ```

1.  Bring up an initial cluster using the following commands:

    -   List the files in the current directory that have the `.yaml` extension.

        ```command
        operator % ls *.yaml
        ```

        ```output
        101_initial_cluster.yaml	302_new_shards.yaml		operator.yaml
        201_customer_tablets.yaml	306_down_shard_0.yaml
        ```

    -   Use the `apply` subcommand to update the resources defined in the `101_initial_cluster.yaml` file:

          ```command
          operator % kubectl apply -f 101_initial_cluster.yaml
          ```

          ```output
          vitesscluster.planetscale.com/example created
          secret/example-cluster-config created
          ```

          From the output above, `vitesscluster.planetscale.com/example created` indicates that a custom resource of kind, `VitessCluster` with the name `example` was successfully created. Similarly, `secret/example-cluster-config created` indicates that a Kubernetes Secret named `example-cluster-config` was created as a part of the VitessCluster setup.

1.  Wait a few minutes for the installation to finish, then check that all pods are running using the following command:

    ```command
    operator % kubectl get pods
    ```

    The output lists the status and information about the pods running in the cluster.

    ```output
    operator % kubectl get pods
    NAME                                                         READY   STATUS    RESTARTS        AGE
    example-commerce-x-x-zone1-vtorc-c13ef6ff-58595d4597-lq6mv   1/1     Running   3 (2m11s ago)   3m9s
    example-etcd-faf13de3-1                                      1/1     Running   0               3m10s
    example-etcd-faf13de3-2                                      1/1     Running   1 (71s ago)     3m10s
    example-etcd-faf13de3-3                                      1/1     Running   1 (2m10s ago)   3m10s
    example-vttablet-zone1-2469782763-bfadd780                   3/3     Running   1 (99s ago)     3m9s
    example-vttablet-zone1-2548885007-46a852d0                   3/3     Running   1 (109s ago)    3m9s
    example-zone1-vtadmin-c03d7eae-85bdb79566-rxqqh              2/2     Running   0               3m10s
    example-zone1-vtctld-1d4dcad0-f69f4b48c-v6rvc                1/1     Running   3 (2m24s ago)   3m10s
    example-zone1-vtgate-bc6cde92-76c484f679-rkzw9               1/1     Running   2 (2m4s ago)    3m10s
    vitess-operator-59fd89bb55-xngll                             1/1     Running   0               11m
    ```

## Scaling Vitess on LKE

To scale Vitess, you need to add nodes to your cluster. To do this manually, use the Resize Pool command for the cluster in the Cloud Manager. To do this automatically, use the Autoscale Pool command for the cluster. Turn on Autoscale, leave the minimum number of nodes at 3, and increase the maximum number of nodes.

## Example: Testing Initial Connectivity and Functionality of Vitess Cluster

Before delving into the functionality of your Vitess cluster, it's essential to perform initial tests to ensure proper connectivity and functionality. This involves forwarding Kubernetes ports to your local machine, setting up aliases for convenient access, creating a schema, and establishing connections to the cluster services. The example below provides the comprehensive steps to test the capabilities of your Vitess deployment.

1.  To begin, establish a connection between the Kubernetes environment and your local machine. This allows you to interact with the cluster's services as if they were running on your local system.

1.  Use the `pf.sh` script [provided by Vitess](https://vitess.io/docs/17.0/get-started/operator/#setup-port-forward) to set up port forwarding from Kubernetes to your local machine by executing the following command:

    ```command
    operator % ./pf.sh &
    ```

1.  Configure some convenient aliases for frequently used commands:

    ```command
    alias vtctldclient="vtctldclient --server=localhost:15999"
    alias vtctlclient="vtctlclient --server=localhost:15999"
    alias mysql="mysql -h 127.0.0.1 -P 15306 -u user"
    ```

    After executing the aliases above, you see an output similar to the following:

    ```output
    [1] 64634
    operator % Forwarding from 127.0.0.1:15000 -> 15000
    Forwarding from [::1]:15000 -> 15000
    ... (other forwarding lines)
    You may point your browser to http://localhost:15000, use the following aliases as shortcuts:
    alias vtctlclient="vtctlclient --server=localhost:15999 --logtostderr"
    alias vtctldclient="vtctldclient --server=localhost:15999 --logtostderr"
    alias mysql="mysql -h 127.0.0.1 -P 15306 -u user"
    Hit Ctrl-C to stop the port forwards
    ```

1.  Create a schema using the `vtctldclient` tool by executing the following commands:

    ```command
    operator % vtctldclient ApplySchema --sql-file="create_commerce_schema.sql" commerce
    vtctldclient ApplyVSchema --vschema-file="vschema_commerce_initial.json" commerce
    ```

    The output includes the details of the newly created `VSchema` object.

    ```output
    Handling connection for 15999

    Handling connection for 15999
    New VSchema object:
    {
      "sharded": false,
      "vindexes": {},
      "tables": {
        "corder": {
          "type": "",
          "column_vindexes": [],
          "auto_increment": null,
          "columns": [],
          "pinned": "",
          "column_list_authoritative": false,
          "source": ""
        },
        "customer": {
          "type": "",
          "column_vindexes": [],
          "auto_increment": null,
          "columns": [],
          "pinned": "",
          "column_list_authoritative": false,
          "source": ""
        },
        "product": {
          "type": "",
          "column_vindexes": [],
          "auto_increment": null,
          "columns": [],
          "pinned": "",
          "column_list_authoritative": false,
          "source": ""
        }
      },
      "require_explicit_routing": false
    }
    If this is not what you expected, check the input data (as JSON parsing will skip unexpected fields).

    ```

1.  Establish a connection to the Vitess cluster's MySQL server by executing the following command:

    ```command
    operator % mysql
    ```

    Upon successful execution, the MySQL monitor welcomes you, providing access to various database operations. You can then interact with the MySQL monitor as shown below:

    ```output
    Handling connection for 15306
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 1
    Server version: 8.0.30-Vitess Version: 18.0.0-SNAPSHOT (Git revision 122ee758cf4f20f20e8703fcb21dea93765e3e2b branch 'main') built on Fri Jun 30 07:57:51 UTC 2023 by vitess@buildkitsandbox using go1.20.5 linux/amd64

    Copyright (c) 2000, 2023, Oracle and/or its affiliates.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql> show databases;
    +--------------------+
    | Database           |
    +--------------------+
    | commerce           |
    | information_schema |
    | mysql              |
    | sys                |
    | performance_schema |
    +--------------------+
    5 rows in set (0.02 sec)

    ```

1.  At this stage, you have successfully tested the connectivity and basic functionality of your Vitess cluster. You can proceed with more advanced workflows, such as [MoveTables](https://vitess.io/docs/17.0/user-guides/migration/move-tables/) to optimize data placement within your Vitess cluster. After installation, you can forward the ports to your local machine and work with it as though it is an ordinary MySQL database.

1.  If necessary, you can also tear down the cluster using the following command:

    ```command
    kubectl delete -f 101_initial_cluster.yaml
    ```

    For complete removal of the underlying Akamai Cloud Kubernetes Engine infrastructure, you can utilize the **Delete Cluster** option within the LKE control panel.