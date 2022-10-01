---
slug: deploy-and-manage-lke-cluster-with-api-a-tutorial
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to deploy a cluster on Linode Kubernetes Engine (LKE) through the Linode API."
og_description: "The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. This guide shows you how to use the Linode API to Deploy and Manage an LKE Cluster."
keywords: ["kubernetes", "linode kubernetes engine", "managed kubernetes", "lke", "kubernetes cluster"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-11
modified: 2020-12-03
modified_by:
  name: Linode
image: deploy-and-manage-cluster-copy.png
title: "Deploy and Manage a Cluster with  Kubernetes Engine"
h1_title: "Deploying and Managing a Cluster with LKE and the Linode API Tutorial"
enable_h1: true

title: "Deploy and Manage a Kubernetes Cluster with the Linode API"
h1_title: "Deploying and Managing a Cluster on Linode Kubernetes Engine (LKE) with the Linode API"

contributor:
  name: Linode
aliases: ['/applications/containers/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/','/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/']
tags: ["kubernetes"]
---

The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and simple pricing with the infrastructure efficiency of Kubernetes. When you deploy a LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [NodeBalancers](/docs/guides/getting-started-with-nodebalancers/) (load balancers), and [Block Storage Volumes](/docs/products/storage/block-storage/). Your LKE Cluster's Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

**Additional LKE features:**

- **etcd Backups**: A snapshot of your cluster's metadata is backed up continuously, so your cluster is automatically restored in the event of a failure.
- **High Availability**: All of your control plane components are monitored and automatically recover if they fail.

You can easily deploy an LKE cluster in several ways:

- Via the [Linode Cloud Manager](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/)
- With the Linode API (as presented in this guide)

    {{< note >}}
The Linode API and the Kubernetes API are two separate interfaces, and both are mentioned in this article. The Linode API allows you to manipulate your Linode infrastructure, while the Kubernetes API allows you to manage the software objects running in your cluster.
{{< /note >}}
- With the [Linode CLI](/docs/products/tools/cli/get-started/)

These Linode-provided interfaces can be used to create, delete, and update the structural elements of your cluster, including:

- The number of nodes that make up a cluster's node pools.
- The region where your node pools are deployed.
- The hardware resources for each node in your node pools.
- The Kubernetes version deployed to your cluster's Master node and worker nodes.

The [Kubernetes API](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/#kubernetes-api) and [kubectl](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/#kubectl) are the primary ways you interact with your LKE cluster once it's been created. These tools can be used to configure, deploy, inspect, and secure your Kubernetes workloads, deploy applications, create services, configure storage and networking, and define controllers.

## In this Guide

This guide covers how to use the Linode API to:

* [Create an LKE cluster](#create-an-lke-cluster)
* [Connect kubectl to your LKE cluster](#connect-to-your-lke-cluster)
* [Inspect your LKE cluster](#inspect-your-lke-cluster)
* [Modify an existing LKE cluster](#modify-your-lke-cluster)
* [Delete an LKE cluster](#delete-an-lke-cluster)

## Before You Begin

1. [Familiarize yourself with the Linode Kubernetes Engine service](https://www.linode.com/products/kubernetes/). This information helps you understand the benefits and limitations of LKE.

1. [Create an API Token](/docs/guides/getting-started-with-the-linode-api/#create-an-api-token). You need this to access the LKE service.

1. [Install kubectl](#install-kubectl) on your computer. You use kubectl to interact with your cluster once it's deployed.

1. If you are new to Kubernetes, refer to our [A Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) series to learn about general Kubernetes concepts. This guide assumes a general understanding of core Kubernetes concepts.

### Install kubectl

{{< content "how-to-install-kubectl" >}}

## Create an LKE Cluster

| **Required Parameters** | **Description** |
|-------|-------|
| `region` | The data center region where your cluster is deployed. Currently, `us-central` is the only available region for LKE clusters. |
| `label` | A human readable name to identify your cluster. This must be unique. If no label is provided, one is assigned automatically. Labels must start with an alpha [a-z][A-Z] character, must only consist of alphanumeric characters and dashes, and must not contain two dashes in a row.
| `node_pools` | The collections of Linodes that serve as the worker nodes in your LKE cluster. |
| `k8s_version` | The desired version of Kubernetes for this cluster. |

{{< note >}}
The available plan types for LKE worker nodes are [Shared](/docs/guides/how-to-choose-a-linode-plan/#1-shared), [Dedicated CPU](/docs/guides/how-to-choose-a-linode-plan/#3-dedicated-cpu), and [High Memory](/docs/guides/how-to-choose-a-linode-plan/#2-high-memory) plans.
{{< /note >}}

1. To create an LKE Cluster, send a `POST` request to the `/lke/clusters` endpoint. The example below displays all possible request body parameters. Note that `tags` is an optional parameter.

        curl -H "Content-Type: application/json" \
             -H "Authorization: Bearer $TOKEN" \
             -X POST -d '{
                "label": "cluster12345",
                "region": "us-central",
                "k8s_version": "1.16",
                "tags": ["ecomm", "blogs"],
                "node_pools": [
                  { "type": "g6-standard-2", "count": 2},
                  { "type": "g6-standard-4", "count": 3}
                ]
             }' https://api.linode.com/v4/lke/clusters


    You receive a response similar to:

    {{< output >}}
{"k8s_version": "1.16", "updated": "2019-08-02T17:17:49", "region": "us-central", "tags": ["ecomm", "blogs"], "label": "cluster12345", "id": 456, "created": "2019-22-02T17:17:49"}%
    {{</ output >}}

1. Make note of your cluster's ID, as you need it to continue to interact with your cluster in the next sections. In the example above, the cluster's ID is `"id": 456`. You can also access your cluster's ID by [listing all LKE Clusters](#list-lke-clusters) on your account.

    {{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/guides/support/) if you believe this may be the case.
{{</ note >}}

### Connect to your LKE Cluster

Now that your LKE cluster is created, you can access and manage your cluster using kubectl on your computer. This gives you the ability to interact with the Kubernetes API, and to create and manage [Kubernetes objects](/docs/guides/beginners-guide-to-kubernetes-part-3-objects/) in your cluster.

To communicate with your LKE cluster, kubectl requires a copy of your cluster's [*kubeconfig*](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). In this section, you access the contents of your kubeconfig using the Linode API and then set up kubectl to communicate with your LKE cluster.

1. Access your LKE cluster's kubeconfig file by sending a `GET` request to the `/lke/clusters/{clusterId}/kubeconfig` endpoint. Ensure you replace `12345` with your cluster's ID that you recorded in the previous section:

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/lke/clusters/12345/kubeconfig

    The API returns a [base64](https://en.wikipedia.org/wiki/Base64) encoded string (a useful format for automated pipelines) representing your kubeconfig. Your output resembles the following:

    {{< output >}}
{"kubeconfig": "YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpRMEZVUlMwdExTMHRDazFKU1VONVJFTkRRV0pEWjBGM1NVSkJaMGxDUVVSQlRrSm5hM0ZvYTJsSE9YY3dRa0ZSYzBaQlJFRldUVkpOZDBWUldVUldVVkZFUlhkd2NtUlhTbXdLWTIwMWJHUkhWbnBOUWpSWVJGUkZOVTFFWjNkTmFrVXpUVlJqTVUxV2IxaEVWRWsx ... 0TFMwdExRbz0K"}%
{{</ output >}}

1.  Copy the `kubeconfig` field's value from the response body, since you need it in the next step.

    {{< note >}}
Make sure you only copy the long string inside the quotes following `"kubeconfig":` in your output. Do not copy the curly braces or anything outside of them. You receive an error if you use the full output in later steps.
{{< /note >}}

1. Save the base64 kubeconfig to an environment variable:

        KUBE_VAR='YXBpVmVyc2lvbjogdjEK ... 0TFMwdExRbz0K'

1. Navigate to your computer's `~/.kube` directory. This is where kubectl looks for kubeconfig files, by default.

        cd ~/.kube

1.  Create a directory called `configs` within `~/.kube`. You can use this directory to store your kubeconfig files.

        mkdir configs
        cd configs

1. Decode the contents of `$KUBE_VAR` and save it to a new YAML file:

        echo $KUBE_VAR | base64 -D > cluster12345-config.yaml

    {{< note >}}
The YAML file that you decode to (`cluster12345-config.yaml` here) can have any name of your choosing.
{{< /note >}}

1. Add the kubeconfig file to your `$KUBECONFIG` environment variable.

        export KUBECONFIG=cluster12345-config.yaml

1. Verify that your cluster is selected as kubectl's current context:

        kubectl config get-contexts

1. View the contents of the configuration:

        kubectl config view

    {{< note >}}
You can also access a decoded version of your kubeconfig file in the [Linode Cloud Manager](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-and-download-your-kubeconfig).
{{</ note >}}

1. View all nodes in your LKE cluster using kubectl:

        kubectl get nodes

    Your output resembles the following example, but varies depending on your own cluster's configurations.

    {{< output >}}
NAME                      STATUS   ROLES  AGE     VERSION
lke166-193-5d44703cd092   Ready    none   2d22h   v1.14.0
lke166-194-5d44703cd780   Ready    none   2d22h   v1.14.0
lke166-195-5d44703cd691   Ready    none   2d22h   v1.14.0
lke166-196-5d44703cd432   Ready    none   2d22h   v1.14.0
lke166-197-5d44703cd211   Ready    none   2d22h   v1.14.0
{{</ output >}}

    Now that you are connected to your LKE cluster, you can begin using kubectl to deploy applications, [inspect and manage](/docs/guides/troubleshooting-kubernetes/#kubectl-get) cluster resources, and [view logs](/docs/guides/troubleshooting-kubernetes/#kubectl-logs).

### Persist the Kubeconfig Context

If you create a new terminal window, it does not have access to the context that you specified using the previous instructions. This context information can be made persistent between new terminals by setting the [`KUBECONFIG` environment variable](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) in your shell's configuration file.

{{< note >}}
If you are using Windows, review the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) for how to persist your context.
{{< /note >}}

These instructions persist the context for users of the Bash terminal. They are similar for users of other terminals:

1.  Open up your Bash profile (e.g. `~/.bash_profile`) in the text editor of your choice and add your configuration file to the `$KUBECONFIG` PATH variable.

    If an `export KUBECONFIG` line is already present in the file, append to the end of this line as follows; if it is not present, add this line to the end of your file:

        export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config:$HOME/.kube/configs/cluster12345-config.yaml

    {{< note >}}
Alter the `$HOME/.kube/configs/cluster12345-config.yaml` path in the above line with the name of the file you decoded to in the previous section.
{{< /note >}}

1.  Close your terminal window and open a new window to receive the changes to the `$KUBECONFIG` variable.

1.  Use the `config get-contexts` command for `kubectl` to view the available cluster contexts:

        kubectl config get-contexts

    You should see output similar to the following:

    {{< output >}}
CURRENT  NAME                         CLUSTER     AUTHINFO          NAMESPACE
*        kubernetes-admin@kubernetes  kubernetes  kubernetes-admin
{{</ output >}}

1.  If your context is not already selected, (denoted by an asterisk in the `current` column), switch to this context using the `config use-context` command. Supply the full name of the cluster (including the authorized user and the cluster):

        kubectl config use-context kubernetes-admin@kubernetes

    You should see output like the following:

    {{< output >}}
Switched to context "kubernetes-admin@kubernetes".
{{</ output>}}

1.  You are now ready to interact with your cluster using `kubectl`. You can test the ability to interact with the cluster by retrieving a list of Pods in the `kube-system` namespace:

        kubectl get pods -n kube-system

## Inspect your LKE Cluster

Once you have created an LKE Cluster, you can access information about its structural configuration using the Linode API.

### List LKE Clusters

To view a list of all your LKE clusters, send a `GET` request to the `/lke/clusters` endpoint.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/lke/clusters

The returned response body displays the number of clusters deployed to your account and general details about your LKE clusters:

{{< output >}}
{"results": 2, "data": [{"updated": "2019-08-02T17:17:49", "region": "us-central", "id": 456, "k8s_version": "1.16", "label": "cluster-12345", "created": "2019-08-02T17:17:49", "tags": ["ecomm", "blogs"]}, {"updated": "2019-08-05T17:00:04", "region": "us-central", "id": 789, "k8s_version": "1.16", "label": "cluster-56789", "created": "2019-08-05T17:00:04", "tags": ["ecomm", "marketing"]}], "pages": 1, "page": 1}%
{{</ output >}}

### View an LKE Cluster

You can use the Linode API to access details about an individual LKE cluster. You need your cluster's ID to access information about this resource. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To view your LKE cluster, send a `GET` request to the `/lke/clusters/{clusterId}` endpoint. In this example, ensure you replace `12345` with your cluster's ID:

    curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4/lke/clusters/12345

Your output resembles the following:

{{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-02T17:17:49", "k8s_version": "1.16", "tags": ["ecomm", "blogs"], "label": "cluster-12345", "id": 456, "region": "us-central"}%
{{</ output >}}

### List a Cluster's Node Pools

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type. Your LKE cluster can have several node pools. Each pool is assigned its own plan type and number of nodes. To view a list of an LKE cluster's node pools, you need your cluster's ID. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To list your cluster's node pools, send a `GET` request to the `/lke/clusters/{clusterId}/pools` endpoint. In this example, replace `12345` with your cluster's ID:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/lke/clusters/12345/pools

The response body includes information on each node pool's pool ID, Linode type, and node count; and each node's individual ID and status.

{{< output >}}
{"pages": 1, "page": 1, "data": [{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready "}, {"id": "13841933", "status": "ready"}]}, {"count": 3, "id": 194, "type": "g6-standard-4", "linodes": [{"id": "13841934", "status": "ready"}, {"id": "13841935", "status": "ready"}, {"id": "13841932", "status": "ready"}]}], "results": 2}%
{{</ output >}}

### View a Node Pool

You can use the Linode API to access details about a specific node pool in an LKE cluster. You need your cluster’s ID and node pool ID to access information about this resource. To retrieve your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. To find a node pool's ID, see the [List a Cluster's Node Pools](#list-a-cluster-s-node-pools) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |

To view a specific node pool, send a `GET` request to the `/lke/clusters/{clusterId}/pools/{poolId}` endpoint. In this example, replace `12345` with your cluster's ID and `456` with the node pool's ID:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/lke/clusters/12345/pools/456

The response body provides information about the number of nodes in the node pool, the node pool's ID, and type. You also retrieve information about each individual node in the node pool, including the Linode's ID and status.

{{< output >}}
{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready"}, {"id": "13841933", "status": "ready"}]}%
{{</ output >}}

{{< note >}}
If desired, you can use your node pool's Linode ID(s) to get more details about each node in the pool. Send a `GET` request to the `/linode/indstances/{linodeId}` endpoint. In this example, ensure you replace `13841932` with your Linode's ID.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/linode/instances/13841932

Although you have access to your cluster's nodes, it is recommended that you only interact with your nodes via the Linode's LKE interfaces (like the LKE endpoints in Linode's API, or the Kubernetes section in the Linode Cloud Manager), or via the Kubernetes API and kubectl.
{{< /note >}}

## Modify your LKE Cluster

Once an LKE cluster is created, you can modify the cluster's label, node pools, and tags. In this section you learn how to modify each of these parts of your cluster.

### Update your LKE Cluster Label

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To update your LKE cluster's label, send a `PUT` request to the `/lke/clusters/{clusterId}` endpoint. In this example, ensure you replace `12345` with your cluster's ID:

    curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "label": "updated-cluster-name"
            }' https://api.linode.com/v4/lke/clusters/12345

The response body displays the updated cluster label:

{{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-05T19:11:19", "k8s_version": "1.16", "tags": ["ecomm", "blogs"], "label": "updated-cluster-name", "id": 456, "region": "us-central"}%
{{</ output >}}

### Add a Node Pool to your LKE Cluster

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type and is identical to each other. Your LKE cluster can have several node pools, each pool with its own plan type and number of nodes.

You need your cluster's ID in order to add a node pool to it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `type` | The Linode plan type to use for all the nodes in the pool. Linode plans designate the type of hardware resources applied to your instance.  |
| `count` | The number of nodes to include in the node pool. Each node has the same plan type. |

To add a node pool to an existing LKE cluster, send a `POST` request to the `/lke/clusters/{clusterId}/pools` endpoint. The request body must include the `type` and `count` parameters. In the URL of this example, ensure you replace `12345` with your own cluster's ID:

    curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
            "type": "g6-standard-1",
            "count": 5
            }' https://api.linode.com/v4/lke/clusters/12345/pools

The response body resembles the following:

{{< output >}}
{"count": 5, "id": 196, "type": "g6-standard-1", "linodes": [{"id": "13841945", "status": "ready"}, {"id": "13841946", "status": "ready"}, {"id": "13841947", "status": "ready"}, {"id": "13841948", "status": "ready"}, {"id": "13841949", "status": "ready"}]}%
{{</ output >}}

{{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/guides/support/) if you believe this may be the case.
{{</ note >}}

### Resize your LKE Node Pool

You can resize an LKE cluster's node pool to add or decrease its number of nodes. You need your cluster's ID and the node pool's ID in order to resize it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. If you don’t know your node pool's ID, see the [List a Cluster’s Node Pools](#list-a-cluster-s-node-pools) section.

{{< caution >}}
Shrinking a node pool results in deletion of Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) is erased.
{{< /caution >}}

{{< note >}}
You cannot modify an existing node pool's plan type. If you would like your LKE cluster to use a different node pool plan type, you can [add a new node pool](#add-a-node-pool-to-your-lke-cluster) to your cluster with the same number of nodes to replace the current node pool. You can then [delete the node pool](#delete-a-node-pool-from-an-lke-cluster) that is no longer needed.
{{</ note >}}

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |
| `count` | The number of Linodes in the node pool. |

To update your node pool's node count, send a `PUT` request to the `/lke/clusters/{clusterId}/pools/{poolId}` endpoint. In the URL of this example, replace `12345` with your cluster's ID and `196` with your node pool's ID:

    curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -X PUT -d '{
            "type": "g6-standard-4",
            "count": 6
        }' https://api.linode.com/v4/lke/clusters/12345/pools/196

{{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/guides/support/) if you believe this may be the case.
{{</ note >}}

### Recycle All Nodes Within a Cluster

You can recycle all nodes within an LKE cluster to upgrade the nodes to the most recent patch of the cluster's Kubernetes version and to otherwise replace the physical Linodes that comprise the cluster. Nodes are recycled on a rolling basis, meaning that only one node is down at a time throughout the recycling process. You need your cluster's ID in order to recycle it's nodes. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section.

{{< caution >}}
Recycling your cluster involves deleting each of the Linodes in the node pool and replacing them with new Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) is erased.
{{< /caution >}}

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To recycle all nodes within a cluster, send a `POST` request to the `/lke/clusters/{clusterId}/pools/{poolId}/recycle` endpoint. In the URL of this example, replace `12345` with your cluster's ID:

    curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -X POST \
        https://api.linode.com/v4/lke/clusters/12345/recycle

### Recycle your LKE Node Pool

You can recycle an LKE cluster's node pool to upgrade its nodes to the most recent patch of the cluster's Kubernetes version. Nodes are recycled on a rolling basis, meaning that only one node is down at a time throughout the recycling process. You need your cluster's ID and the node pool's ID in order to recycle it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. If you don’t know your node pool's ID, see the [List a Cluster’s Node Pools](#list-a-cluster-s-node-pools) section.

{{< caution >}}
Recycling your node pool involves deleting each of the Linodes in the node pool and replacing them with new Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) is erased.
{{< /caution >}}

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |

To recycle your node pool, send a `POST` request to the `/lke/clusters/{clusterId}/pools/{poolId}/recycle` endpoint. In the URL of this example, replace `12345` with your cluster's ID and `196` with your node pool's ID:

    curl -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -X POST \
        https://api.linode.com/v4/lke/clusters/12345/pools/196/recycle

### Recycle a Single Node within a Node Pool

You can recycle an individual node within a LKE Cluster's Node Pool. You need your cluster's ID and the node ID in order to recycle it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. If you don’t know your node ID, see the [List a Cluster’s Node Pools](#list-a-cluster-s-node-pools) section.

{{< caution >}}
Recycling your node pool involves deleting each of the Linodes in the node pool and replacing them with new Linodes. Any local storage on deleted Linodes (such as "hostPath" and "emptyDir" volumes, or "local" PersistentVolumes) is erased.
{{< /caution >}}

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `nodeId` | ID of the LKE node to lookup. |

 To recycle your node, send a `POST` request to the `/lke/clusters/{clusterId}/nodes/{nodeId}/recycle` endpoint. In the URL of this example, replace `12345` with your cluster's ID and `12345-6aa78910bc` with your node ID:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/lke/clusters/12345/nodes/12345-6aa78910bc


### Upgrade your LKE Cluster to the Next Minor Version

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `k8s_version` | The next minor version of Kubernetes |

To upgrade your LKE cluster's version, send a `PUT` request to the `/lke/clusters/{clusterId}` endpoint. In this example, ensure you replace `12345` with your cluster's ID, and `1.17` with whichever Kubernetes version is the next currently available:

    curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "k8s_version": "1.17"
            }' https://api.linode.com/v4/lke/clusters/12345

The response body displays the cluster version that will be applied following a [recycle](#recycle-your-lke-cluster):

{{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-05T19:11:19", "k8s_version": "1.17", "tags": ["ecomm", "blogs"], "label": "updated-cluster-name", "id": 456, "region": "us-central"}%
{{</ output >}}

{{< caution >}}
Nodes within the LKE cluster *must* be [recycled](#recycle-your-lke-cluster) before the cluster version will be successfully upgraded.
{{< /caution >}}

### Add New Tags to your LKE Cluster

Like many Linode resources, you can [add tags](/docs/guides/tags-and-groups/) to your LKE Cluster for organizational purposes. This section shows you how to add new tags to an existing LKE Cluster.

{{< disclosure-note "View all of your account's tags">}}
To view all of the tags existing on your account, issue the following request against the API:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/tags

  Your response resembles the example:

  {{< output >}}
{"data": [{"label": "blogs"}, {"label": "ecomm"}, {"label": "prod"}, {"label": "monitoring"}], "page": 1, "pages": 1, "results": 4}%
  {{</ output >}}

{{</ disclosure-note >}}

1. View the tags currently assigned to your cluster:

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/lke/clusters/12345

    The response body contains an array of your cluster's tags. In the example response, the cluster's tags are `blog`, and `ecomm`.

    {{< output >}}
{"id": 12345, "status": "ready", "created": "2020-04-13T20:17:22", "updated": "2020-04-13T20:17:22", "label": "cluster-12345", "region": "us-central", "k8s_version": "1.17", "tags": ["blog", "ecomm"]}%
    {{</ output >}}

1. To add new tags to your cluster's existing tags, your request must include a `tags` array with all **previous** and **new** tags. The example request adds the new tags `prod` and `monitoring` to the cluster.

        curl -H "Content-Type: application/json" \
              -H "Authorization: Bearer $TOKEN" \
              -X PUT -d '{
                "tags" : ["ecomm", "blog", "prod", "monitoring"]
              }' \
              https://api.linode.com/v4/lke/clusters/12345

    The response displays all of your cluster's tags. In the example response, the cluster's tags are now `blog`, `ecomm`, `prod`, and `monitoring`.

    {{< output >}}
{"id": 12345, "status": "ready", "created": "2020-04-13T20:17:22", "updated": "2020-04-13T20:17:22", "label": "cluster-12345", "region": "us-central", "k8s_version": "1.17", "tags": ["blog", "ecomm", "monitoring", "prod"]}%
    {{</ output >}}

### Delete Tags from your LKE Cluster

This section shows you how to delete tags from your LKE Cluster.

1. View the tags currently assigned to your cluster:

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/lke/clusters/12345

    The response body contains an array of your cluster's tags. In the example response, the cluster's tags are `blog`, `ecomm`, `prod`, and `monitoring`.

    {{< output >}}
{"id": 12345, "status": "ready", "created": "2020-04-13T20:17:22", "updated": "2020-04-13T20:17:22", "label": "cluster-12345", "region": "us-central", "k8s_version": "1.17", "tags": [["blog", "ecomm", "monitoring", "prod"]}%
    {{</ output >}}

1. To delete a tag from your cluster, issue a request with only the tags you would like to keep assigned to your cluster. In the example request, the tags `monitoring` and `prod` are excluded from the `tags` array and so are deleted from your cluster.

        curl -H "Content-Type: application/json" \
              -H "Authorization: Bearer $TOKEN" \
              -X PUT -d '{
                "tags" : ["ecomm", "blog"]
              }' \
              https://api.linode.com/v4/lke/clusters/12345

    The response displays all of your cluster's current tags. In the example response, the cluster's tags are now `blog`, and `ecomm`.

    {{< output >}}
{"id": 12345, "status": "ready", "created": "2020-04-13T20:17:22", "updated": "2020-04-13T20:17:22", "label": "cluster-12345", "region": "us-central", "k8s_version": "1.17", "tags": ["blog", "ecomm"]}%
    {{</ output >}}

### Delete a Node Pool from an LKE Cluster

When you delete a node pool you also delete the Linodes (nodes) and routes to them. The Pods running on those nodes are evicted and rescheduled. If you have [assigned Pods to the deleted Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node), the Pods might remain in an unschedulable condition if no other node in the cluster satisfies the [node selector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector).

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |

To delete a node pool from a LKE cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}/pools/{poolId}` end point. In the URL of this example, replace `12345` with your cluster's ID and `196` with your cluster's node pool ID:

{{< caution >}}
This step is permanent and results in the loss of data.
{{</ caution >}}

    curl -H "Authorization: Bearer $TOKEN" \
        -X DELETE \
        https://api.linode.com/v4/lke/clusters/12345/pools/196

## Delete an LKE Cluster

Deleting an LKE cluster deletes the **Master node**, all **worker nodes**, and all **NodeBalancers** created by the cluster. However, it does **not delete any Volumes** created by the LKE cluster.

To delete an LKE Cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}` endpoint. In the URL of this example, replace `12345` with your cluster's ID:

{{< caution >}}
This step is permanent and results in the loss of data.
{{</ caution >}}

    curl -H "Authorization: Bearer $TOKEN" \
        -X DELETE \
        https://api.linode.com/v4/lke/clusters/12345

## General Network and Firewall Information

{{< content "lke-network-firewall-information-shortguide" >}}

## Where to Go From Here?

Now that you have created an LKE cluster, you can start deploying workloads to it. Review these guides for further help:

* [How to Install Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/)
* [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/guides/deploy-container-image-to-kubernetes/)
* [Troubleshooting Kubernetes](/docs/guides/troubleshooting-kubernetes/)