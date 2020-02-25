---
author:
  name: Linode Community
  email: docs@linode.com
description: 'The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. This guide shows you how to use the Linode API to Deploy and Manage an LKE Cluster.'
og_description: 'The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. This guide shows you how to use the Linode API to Deploy and Manage an LKE Cluster.'
keywords: ["kubernetes", "linode kubernetes engine", "managed kubernetes", "lke", "kubernetes cluster"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-11
modified_by:
  name: Linode
title: "Deploy and Manage a Cluster with Linode Kubernetes Engine and the Linode API - A Tutorial"
h1_title: "A Tutorial for Deploying and Managing a Cluster with Linode Kubernetes Engine and the Linode API"
contributor:
  name: Linode
aliases: ['applications/containers/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/']
---

{{< note >}}
Linode Kubernetes Engine (LKE) is currently in Private Beta, and you may not have access to LKE through the Cloud Manager or other tools. To request access to the Private Beta, [sign up here](https://welcome.linode.com/lkebeta/). Beta access awards you $100/month in free credits for the duration of the beta, which is automatically applied to your account when an LKE cluster is in use. Additionally, you will have access to the `Linode Green Light` community, a new program connecting beta users with our product and engineering teams.

Additionally, because LKE is in Beta, there may be breaking changes to how you access and manage LKE. This guide will be updated to reflect these changes if and when they occur.
{{< /note >}}

## What is the Linode Kubernetes Engine (LKE)?

The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and [simple pricing](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) with the infrastructure efficiency of Kubernetes. When you deploy a LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers/) (load balancers), and [Block Storage Volumes](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/). Your LKE Cluster's Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

{{< disclosure-note "Additional LKE features">}}
* **etcd Backups** : A snapshot of your cluster's metadata is backed up continuously, so your cluster is automatically restored in the event of a failure.
* **High Availability** : All of your control plane components are monitored and will automatically recover if they fail.
{{</ disclosure-note>}}

You can easily deploy an LKE cluster in several ways:

- Via the [Linode Cloud Manager](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/)
- With the Linode API (as presented in this guide)

    {{< note >}}
The Linode API and the Kubernetes API are two separate interfaces, and both will be mentioned in this article. The Linode API allows you to manipulate your Linode infrastructure, while the Kubernetes API allows you to manage the software objects running in your cluster.
{{< /note >}}
- With the [Linode CLI](/docs/platform/api/linode-cli/)

These Linode-provided interfaces can be used to create, delete, and update the structural elements of your cluster, including:

- The number of nodes that make up a cluster's node pools.
- The region where your node pools are deployed.
- The hardware resources for each node in your node pools.
- The Kubernetes version deployed to your cluster's Master node and worker nodes.

The [Kubernetes API](/docs/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/#kubernetes-api) and [kubectl](/docs/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/#kubectl) are the primary ways you will interact with your LKE cluster once it's been created. These tools can be used to configure, deploy, inspect, and secure your Kubernetes workloads, deploy applications, create services, configure storage and networking, and define controllers.

### In this Guide

This guide will cover how to use the Linode API to:

* [Create an LKE cluster](#create-an-lke-cluster)
* [Connect kubectl to your LKE cluster](#connect-to-your-lke-cluster)
* [Inspect your LKE cluster](#inspect-your-lke-cluster)
* [Modify an existing LKE cluster](#modify-your-lke-cluster)
* [Delete an LKE cluster](#delete-an-lke-cluster)

## Before You Begin

1. [Familiarize yourself with the Linode Kubernetes Engine service](https://www.linode.com/products/kubernetes/). This information will help you understand the benefits and limitations of LKE.

1. [Create an API Token](https://linode.com/docs/platform/api/getting-started-with-the-linode-api/#create-an-api-token). You will need this to access the LKE service.

1. [Install kubectl](#install-kubectl) on your computer. You will use kubectl to interact with your cluster once it's deployed.

1. If you are new to Kubernetes, refer to our [A Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) series to learn about general Kubernetes concepts. This guide assumes a general understanding of core Kubernetes concepts.

### Enable Network Helper

In order to use the Linode Kubernetes Engine, you will need to have *Network Helper* enabled globally on your account. Network Helper is a Linode-provided service that automatically sets a static network configuration for your Linode when it boots. To enable this global account setting, follow [these instructions](/docs/platform/network-helper/#global).

If you don't want to use Network Helper on some Linodes that are not part of your LKE clusters, the service can also be disabled on a per-Linode basis; see instructions [here](/docs/platform/network-helper/#single-per-linode).

{{< note >}}
If you have already deployed an LKE cluster and did not enable Network Helper, you can [add a new node pool](#add-a-node-pool-to-your-lke-cluster) with the same type, size, and count as your initial node pool. Once your new node pool is ready, you can then [delete the original node pool](#delete-a-node-pool-from-an-lke-cluster).
{{</ note >}}

### Install kubectl

{{< content "how-to-install-kubectl" >}}

## Create an LKE Cluster

| **Required Parameters** | **Description** |
|-------|-------|
| `region` | The data center region where your cluster will be deployed. Currently, `us-central` is the only available region for LKE clusters. |
| `label` | A human readable name to identify your cluster. This must be unique. If no label is provided, one will be assigned automatically. Labels must start with an alpha [a-z][A-Z] character, must only consist of alphanumeric characters and dashes, and must not contain two dashes in a row.
| `node_pools` | The collections of Linodes that serve as the worker nodes in your LKE cluster. |
| `version` | The desired version of Kubernetes for this cluster. |

{{< note >}}
- While in [Private Beta](https://welcome.linode.com/lkebeta/), LKE is only available in the Dallas data center. Cluster region availability will expand when LKE goes into generally availability (GA).

- The available plan types for LKE worker nodes are [Standard](/docs/platform/how-to-choose-a-linode-plan/#2-standard), [Dedicated CPU](/docs/platform/how-to-choose-a-linode-plan/#4-dedicated-cpu), and [High Memory](/docs/platform/how-to-choose-a-linode-plan/#3-high-memory) plans.
{{< /note >}}

1. To create an LKE Cluster, send a `POST` request to the `/lke/clusters` endpoint. The example below displays all possible request body parameters. Note that `tags` is an optional parameter.

        curl -H "Content-Type: application/json" \
             -H "Authorization: Bearer $TOKEN" \
             -X POST -d '{
                "label": "cluster12345",
                "region": "us-central",
                "version": "1.16",
                "tags": ["ecomm", "blogs"],
                "node_pools": [
                  { "type": "g6-standard-2", "count": 2},
                  { "type": "g6-standard-4", "count": 3}
                ]
             }' https://api.linode.com/v4beta/lke/clusters


    You will receive a response similar to:

    {{< output >}}
{"version": "1.16", "updated": "2019-08-02T17:17:49", "region": "us-central", "tags": ["ecomm", "blogs"], "label": "cluster12345", "id": 456, "created": "2019-22-02T17:17:49"}%
    {{</ output >}}

1. Make note of your cluster's ID, as you will need it to continue to interact with your cluster in the next sections. In the example above, the cluster's ID is `"id": 456`. You can also access your cluster's ID by [listing all LKE Clusters](#list-lke-clusters) on your account.

    {{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
{{</ note >}}

### Connect to your LKE Cluster

Now that your LKE cluster is created, you can access and manage your cluster using kubectl on your computer. This will give you the ability to interact with the Kubernetes API, and to create and manage [Kubernetes objects](/docs/kubernetes/beginners-guide-to-kubernetes-part-3-objects/) in your cluster.

To communicate with your LKE cluster, kubectl requires a copy of your cluster's [*kubeconfig*](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). In this section, you will access the contents of your kubeconfig using the Linode API and then set up kubectl to communicate with your LKE cluster.

1. Access your LKE cluster's kubeconfig file by sending a `GET` request to the `/lke/clusters/{clusterId}/kubeconfig` endpoint. Ensure you replace `12345` with your cluster's ID that you recorded in the previous section:

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4beta/lke/clusters/12345/kubeconfig

    The API returns a [base64](https://en.wikipedia.org/wiki/Base64) encoded string (a useful format for automated pipelines) representing your kubeconfig. Your output will resemble the following:

    {{< output >}}
{"kubeconfig": "YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpRMEZVUlMwdExTMHRDazFKU1VONVJFTkRRV0pEWjBGM1NVSkJaMGxDUVVSQlRrSm5hM0ZvYTJsSE9YY3dRa0ZSYzBaQlJFRldUVkpOZDBWUldVUldVVkZFUlhkd2NtUlhTbXdLWTIwMWJHUkhWbnBOUWpSWVJGUkZOVTFFWjNkTmFrVXpUVlJqTVUxV2IxaEVWRWsx ... 0TFMwdExRbz0K"}%
{{</ output >}}

1.  Copy the `kubeconfig` field's value from the response body, since you will need it in the next step.

    {{< note >}}
Make sure you only copy the long string inside the quotes following `"kubeconfig":` in your output. Do not copy the curly braces or anything outside of them. You will receive an error if you use the full output in later steps.
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
You can also access a decoded version of your kubeconfig file in the [Linode Cloud Manager](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#access-and-download-your-kubeconfig).
{{</ note >}}

1. View all nodes in your LKE cluster using kubectl:

        kubectl get nodes

    Your output will resemble the following example, but will vary depending on your own cluster's configurations.

    {{< output >}}
NAME                      STATUS   ROLES  AGE     VERSION
lke166-193-5d44703cd092   Ready    none   2d22h   v1.14.0
lke166-194-5d44703cd780   Ready    none   2d22h   v1.14.0
lke166-195-5d44703cd691   Ready    none   2d22h   v1.14.0
lke166-196-5d44703cd432   Ready    none   2d22h   v1.14.0
lke166-197-5d44703cd211   Ready    none   2d22h   v1.14.0
{{</ output >}}

    Now that you are connected to your LKE cluster, you can begin using kubectl to deploy applications, [inspect and manage](/docs/kubernetes/troubleshooting-kubernetes/#kubectl-get) cluster resources, and [view logs](/docs/kubernetes/troubleshooting-kubernetes/#kubectl-logs).

### Persist the Kubeconfig Context

If you create a new terminal window, it will not have access to the context that you specified using the previous instructions. This context information can be made persistent between new terminals by setting the [`KUBECONFIG` environment variable](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) in your shell's configuration file.

{{< note >}}
If you are using Windows, review the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) for how to persist your context.
{{< /note >}}

These instructions will persist the context for users of the Bash terminal. They will be similar for users of other terminals:

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
CURRENT&nbsp;&nbsp;NAME&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CLUSTER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AUTHINFO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;NAMESPACE
*&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;kubernetes-admin@kubernetes&nbsp;&nbsp;kubernetes&nbsp;&nbsp;kubernetes-admin
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
        https://api.linode.com/v4beta/lke/clusters

The returned response body will display the number of clusters deployed to your account and general details about your LKE clusters:

{{< output >}}
{"results": 2, "data": [{"updated": "2019-08-02T17:17:49", "region": "us-central", "id": 456, "version": "1.16", "label": "cluster-12345", "created": "2019-08-02T17:17:49", "tags": ["ecomm", "blogs"]}, {"updated": "2019-08-05T17:00:04", "region": "us-central", "id": 789, "version": "1.16", "label": "cluster-56789", "created": "2019-08-05T17:00:04", "tags": ["ecomm", "marketing"]}], "pages": 1, "page": 1}%
{{</ output >}}

### View an LKE Cluster

You can use the Linode API to access details about an individual LKE cluster. You will need your cluster's ID to access information about this resource. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To view your LKE cluster, send a `GET` request to the the `/lke/clusters/{clusterId}` endpoint. In this example, ensure you replace `12345` with your cluster's ID:

    curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4beta/lke/clusters/12345

Your output will resemble the following:

{{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-02T17:17:49", "version": "1.16", "tags": ["ecomm", "blogs"], "label": "cluster-12345", "id": 456, "region": "us-central"}%
{{</ output >}}

### List a Cluster's Node Pools

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type. Your LKE cluster can have several node pools. Each pool is assigned its own plan type and number of nodes. To view a list of an LKE cluster's node pools, you need your cluster's ID. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To list your cluster's node pools, send a `GET` request to the `/lke/clusters/{clusterId}/pools` endpoint. In this example, replace `12345` with your cluster's ID:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4beta/lke/clusters/12345/pools

The response body will include information on each node pool's pool ID, Linode type, and node count; and each node's individual ID and status.

{{< output >}}
{"pages": 1, "page": 1, "data": [{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready "}, {"id": "13841933", "status": "ready"}]}, {"count": 3, "id": 194, "type": "g6-standard-4", "linodes": [{"id": "13841934", "status": "ready"}, {"id": "13841935", "status": "ready"}, {"id": "13841932", "status": "ready"}]}], "results": 2}%
{{</ output >}}

### View a Node Pool

You can use the Linode API to access details about a specific node pool in an LKE cluster. You will need your cluster’s ID and node pool ID to access information about this resource. To retrieve your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. To find a node pool's ID, see the [List a Cluster's Node Pools](#list-a-cluster-s-node-pools) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |

To view a specific node pool, send a `GET` request to the `/lke/clusters/{clusterId}/pools/{poolId}` endpoint. In this example, replace `12345` with your cluster's ID and `456` with the node pool's ID:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4beta/lke/clusters/12345/pools/456

The response body provides information about the number of nodes in the node pool, the node pool's ID, and type. You will also retrieve information about each individual node in the node pool, including the Linode's ID and status.

{{< output >}}
{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready"}, {"id": "13841933", "status": "ready"}]}%
{{</ output >}}

{{< note >}}
If desired, you can use your node pool's Linode ID(s) to get more details about each node in the pool. Send a `GET` request  to the `/linode/indstances/{linodeId}` endpoint. In this example, ensure you replace `13841932` with your Linode's ID.

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4beta/linode/instances/13841932

Although you have access to your cluster's nodes, it is recommended that you only interact with your nodes via the Linode's LKE interfaces (like the LKE endpoints in Linode's API, or the Kubernetes section in the Linode Cloud Manager), or via the Kubernetes API and kubectl.
{{< /note >}}

## Modify your LKE Cluster

Once an LKE cluster is created, you can modify two aspects of it: the cluster's label, and the cluster's node pools. In this section you will learn how to modify each of these parts of your cluster.

### Update your LKE Cluster Label

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |

To update your LKE cluster's label, send a `PUT` request to the `/lke/clusters/{clusterId}` endpoint. In this example, ensure you replace `12345` with your cluster's ID:

    curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "label": "updated-cluster-name"
            }' https://api.linode.com/v4beta/lke/clusters/12345

The response body will display the updated cluster label:

{{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-05T19:11:19", "version": "1.16", "tags": ["ecomm", "blogs"], "label": "updated-cluster-name", "id": 456, "region": "us-central"}%
{{</ output >}}

### Add a Node Pool to your LKE Cluster

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type and is identical to each other. Your LKE cluster can have several node pools, each pool with its own plan type and number of nodes.

You will need your cluster's ID in order to add a node pool to it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `type` | The Linode plan type to use for all the nodes in the pool. Linode plans designate the type of hardware resources applied to your instance.  |
| `count` | The number of nodes to include in the node pool. Each node will have the same plan type. |

To add a node pool to an existing LKE cluster, send a `POST` request to the `/lke/clusters/{clusterId}/pools` endpoint. The request body must include the `type` and `count` parameters. In the URL of this example, ensure you replace `12345` with your own cluster's ID:

    curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X POST -d '{
            "type": "g6-standard-1",
            "count": 5
            }' https://api.linode.com/v4beta/lke/clusters/12345/pools

The response body will resemble the following:

{{< output >}}
{"count": 5, "id": 196, "type": "g6-standard-1", "linodes": [{"id": "13841945", "status": "ready"}, {"id": "13841946", "status": "ready"}, {"id": "13841947", "status": "ready"}, {"id": "13841948", "status": "ready"}, {"id": "13841949", "status": "ready"}]}%
{{</ output >}}

{{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
{{</ note >}}

### Resize your LKE Node Pool

You can resize an LKE cluster's node pool to add or decrease its number of nodes. You will need your cluster's ID and the node pool's ID in order to resize it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. If you don’t know your node pool's ID, see the [List a Cluster’s Node Pools](#list-a-cluster-s-node-pools) section.

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
        }' https://api.linode.com/v4beta/lke/clusters/12345/pools/196

{{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
{{</ note >}}

### Delete a Node Pool from an LKE Cluster

When you delete a node pool you also delete the Linodes (nodes) and routes to them. The Pods running on those nodes are evicted and rescheduled. If you have [assigned Pods to the deleted Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node), the Pods might remain in an unschedulable condition if no other node in the cluster satisfies the [node selector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector).

| **Required Parameters** | **Description** |
|-------|-------|
| `clusterId` | ID of the LKE cluster to lookup. |
| `poolId` | ID of the LKE node pool to lookup. |

To delete a node pool from a LKE cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}/pools/{poolId}` end point. In the URL of this example, replace `12345` with your cluster's ID and `196` with your cluster's node pool ID:

{{< caution >}}
This step is permanent and will result in the loss of data.
{{</ caution >}}

    curl -H "Authorization: Bearer $TOKEN" \
        -X DELETE \
        https://api.linode.com/v4beta/lke/clusters/12345/pools/196

## Delete an LKE Cluster

Deleting an LKE cluster will delete the **Master node**, all **worker nodes**, and all **NodeBalancers** created by the cluster. However, it will **not delete any Volumes** created by the LKE cluster.

To delete an LKE Cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}` endpoint. In the URL of this example, replace `12345` with your cluster's ID:

{{< caution >}}
This step is permanent and will result in the loss of data.
{{</ caution >}}

    curl -H "Authorization: Bearer $TOKEN" \
        -X DELETE \
        https://api.linode.com/v4beta/lke/clusters/12345

## Where to Go From Here?

Now that you have created an LKE cluster, you can start deploying workloads to it. Review these guides for further help:

* [How to Install Apps on Kubernetes with Helm 3](/docs/kubernetes/how-to-install-apps-on-kubernetes-with-helm-3/)
* [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/kubernetes/deploy-container-image-to-kubernetes/)
* [Troubleshooting Kubernetes](/docs/kubernetes/troubleshooting-kubernetes/)
