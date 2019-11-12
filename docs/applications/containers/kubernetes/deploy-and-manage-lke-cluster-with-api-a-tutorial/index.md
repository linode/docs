---
author:
  name: Linode Community
  email: docs@linode.com
description: 'The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. This guide shows you how to use the Linode API to Deploy and Manage an LKE Cluster.'
og_description: 'The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. This guide shows you how to use the Linode API to Deploy and Manage an LKE Cluster.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-11
modified: 2019-08-05
modified_by:
  name: Linode
title: "Deploy and Manage a Linode Kubernetes Engine (LKE) Cluster with the Linode API - A Tutorial"
h1_title: "A Tutorial for Deploying and Managing a Linode Kubernetes Engine (LKE) Cluster with the Linode API"
contributor:
  name: Linode
---
## What is the Linode Kubernetes Engine (LKE)?

The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and [simple pricing](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) with the infrastructure efficiency of Kubernetes. When you deploy a LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers/) (load balancers), and [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/) (Volumes) services. Your LKE Cluster's Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

You can easily deploy an LKE cluster in several ways, via the [Linode Cloud Manager](/docs/applications/containers/how-to-deploy-a-cluster-with-lke/), the Linode API, or the [Linode CLI](/docs/platform/api/linode-cli/). These Linode provided interfaces to LKE can be used to create, delete, and update the structural elements of your cluster, like the number of nodes that make a cluster's node pool, the region where your node pool is deployed, the Linode plan type, and the Kubernetes version deployed to your cluster's Master node and worker nodes. The [Kubernetes API](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/#kubernetes-api) and [kubectl](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/#kubectl) are the primary ways you will interact with your LKE cluster once it's been created. These tools can be used to configure, deploy, inspect, and secure your Kubernetes workloads, deploy applications, create services, configure storage and networking, and define controllers.

This guide will cover how to use the Linode API to:

* [Create an LKE cluster](#create-a-lke-cluster)
* [Connect kubectl to your LKE cluster](#connect-to-your-lke-cluster)
* [Inspect your LKE cluster](#inspect-your-lke-cluster)
* [Modify an existing LKE cluster](#modify-your-lke-cluster)
* [Delete an LKE cluster](#delete-an-lke-cluster)

## Before you Begin

1. [Familiarize yourself with the Linode Kubernetes Engine service](https://www.linode.com/products/kubernetes/). This information will help you understand the benefits and limitations of LKE.

1. [Create an API Token](https://linode.com/docs/platform/api/getting-started-with-the-linode-api/#create-an-api-token). You will need this to access the LKE service.

1. [Install kubectl](/docs/applications/containers/kubernetes/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/#install-kubectl) on your computer. You will use kubectl to interact with your cluster once it's deployed.

1. If you are new to Kubernetes, refer to our guide series, [A Beginner's Guide to Kubernetes](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes/), to learn about general Kubernetes concepts. This guide assumes a general understanding of core Kubernetes concepts.

## Create an LKE Cluster

| **Required Parameters** | **Description** |
| ------- | -------|
| `region` | The data center region where your cluster will be deployed. Currently, `us-central` is the only available region for LKE clusters. |
| `label` | A human readable name to identify your cluster. This must be unique. If no label is provided, one will be assigned automatically. Labels must start with an alpha [a-z][A-Z] character, must only consist of alphanumeric characters and dashes, and must not contain two dashes in a row.
| `node_pools` | The collections of Linodes that will be members of your LKE cluster. |
| `version` | The desired version of Kubernetes for this cluster. |

1. To create an LKE Cluster, send a `POST` request to the `/lke/clusters` endpoint. The example displays all possible request body parameters. Note that `tags` is an optional parameter.

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
             }' https://api.linode.com/v4/lke/clusters


    You will receive a similar response:

    {{< output >}}
{"version": "1.16", "updated": "2019-08-02T17:17:49", "region": "us-central", "tags": ["ecomm", "blogs"], "label": "cluster12345", "id": 456, "created": "2019-22-02T17:17:49", "status": "running"}%
    {{</ output >}}

1. Make note of your cluster's ID, as you will need it to continue to interact with your cluster in the next sections. In the example above, the cluster's ID is `"id": 456`. You can also access your cluster's ID by [listing all LKE Clusters](#list-lke-clusters) on your account.

    {{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
    {{</ note >}}

### Connect to your LKE Cluster

Now that your LKE cluster is created, you can access and manage your cluster using kubectl on your computer. This will give you the ability to interact with the Kubernetes API and create and manage [Kubernetes objects](/docs/applications/containers/kubernetes/beginners-guide-to-kubernetes-part-3-objects/).

To communicate with your LKE cluster, kubectl requires a copy of your cluster's [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/). In this section, you will access the contents of your cluster's kubeconfig using the API and set up kubectl to communicate with your LKE cluster.

1. Access your LKE cluster's kubeconfig file by sending a `GET` request to the `/lke/clusters/{clusterId}/kubeconfig` endpoint. Ensure you replace `12345` with your cluster's `clusterId`.

        curl -H "Authorization: Bearer $TOKEN" \
          https://api.linode.com/v4/lke/clusters/12345/kubeconfig

The API returns a base64 encoded string representing your kubeconfig. This is a useful format for automated pipelines. Copy the `kubeconfig` field's value from the response body, since you will need it in the next step. Your output will resemble the following:

    {{< output >}}
{"kubeconfig": "YXBpVmVyc2lvbjogdjEKY2x1c3RlcnM6Ci0gY2x1c3RlcjoKICAgIGNlcnRpZmljYXRlLWF1dGhvcml0eS1kYXRhOiBMUzB0TFMxQ1JVZEpUaUJEUlZKVVNVWkpRMEZVUlMwdExTMHRDazFKU1VONVJFTkRRV0pEWjBGM1NVSkJaMGxDUVVSQlRrSm5hM0ZvYTJsSE9YY3dRa0ZSYzBaQlJFRldUVkpOZDBWUldVUldVVkZFUlhkd2NtUlhTbXdLWTIwMWJHUkhWbnBOUWpSWVJGUkZOVTFFWjNkTmFrVXpUVlJqTVUxV2IxaEVWRWsx ... 0TFMwdExRbz0K"}%
    {{</ output >}}

{{< note >}}
Make sure you only copy the long string in quotes following `"kubeconfig":` in your output. Do not copy the curly braces or anything outside of them. You will receive an error if you use the full output in later steps.
{{< /note >}}


1. The kubectl command-line tool uses kubeconfig files to find the information it needs to choose a cluster and communicate with the API server of a cluster. To connect to your LKE cluster using kubectl, save the base64 kubeconfig to an environment variable:

        KUBE_VAR='YXBpVmVyc2lvbjogdjEK ... 0TFMwdExRbz0K'

1. Navigate to your computer's `~/.kube` directory. This is where kubectl looks for kubeconfig files, by default.

        cd ~/.kube

1. Decode the contents of `$KUBE_VAR` and save it to a YAML file.

        echo $KUBE_VAR | base64 -D > cluster12345-config.yaml

1. Set kubectl to use your cluster as its current context. Replace the context name, with your cluster's name. You can find this value in your kubeconfig file, stored in the `current-context` field.

        kubectl config --kubeconfig=cluster12345-config.yaml use-context kubernetes-admin@kubernetes

1. Add the kubeconfig file to your `$KUBECONFIG` environment variable.

        export KUBECONFIG=cluster12345-config.yaml

1. Verify that your cluster is selected as kubectl's current context:

        kubectl config get-contexts

1. View the contents of the configuration:

        kubectl config view

    {{< note >}}
You can also access a decoded version of your kubeconfig file, via the [Linode Cloud Manager](/docs/applications/containers/how-to-deploy-a-cluster-with-lke/#access-and-download-your-kubeconfig).
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

    Now that you are connected to your LKE cluster, you can begin using kubectl to deploy applications, [inspect and manage](/docs/applications/containers/kubernetes/troubleshooting-kubernetes/#kubectl-get) cluster resources, and [view logs](/docs/applications/containers/kubernetes/troubleshooting-kubernetes/#viewing-master-and-worker-logs).


## Inspect your LKE Cluster

Once you have created an LKE Cluster, you can access information about its structural configuration using the Linode API.

### List LKE Clusters

1. To view a list of all your LKE clusters, send a `GET` request to the `/lke/clusters` endpoint.

        curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4/lke/clusters

    The returned response body will display the number of clusters deployed to your account and general details about your LKE clusters:

    {{< output >}}
{"results": 2, "data": [{"updated": "2019-08-02T17:17:49", "region": "us-central", "id": 456, "version": "1.16", "label": "cluster-12345", "status": "running", "created": "2019-08-02T17:17:49", "tags": ["ecomm", "blogs"]}, {"updated": "2019-08-05T17:00:04", "region": "us-central", "id": 789, "version": "1.16", "label": "cluster-56789", "status": "running", "created": "2019-08-05T17:00:04", "tags": ["ecomm", "marketing"]}], "pages": 1, "page": 1}%
{{</ output >}}

### View a LKE Cluster

You can use the Linode API to access details about an individual LKE cluster. You will need your cluster's ID to access information about this resource. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To view your LKE cluster, send a `GET` request to the the `/lke/clusters/{clusterId}` endpoint. Ensure you replace `12345` with your cluster's `clusterId`.

        curl -H "Authorization: Bearer $TOKEN" \
             https://api.linode.com/v4/lke/clusters/456

    Your output will resemble the following:

    {{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-02T17:17:49", "version": "1.16", "tags": ["ecomm", "blogs"], "label": "cluster-12345", "id": 456, "region": "us-central", "status": "running"}%
    {{</ output >}}

### List a Cluster's Node Pools

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type and is identical to each other. Your LKE cluster can have several node pools, each pool with its own plan type and number of nodes. To view a list of an LKE cluster's node pools, you need your cluster's ID. If you don't know your cluster's ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To list your cluster's node pools, send a `GET` request to the `/lke/clusters/{clusterId}/pools` endpoint.

        curl -H "Authorization: Bearer $TOKEN" \
            https://api.linode.com/v4/lke/clusters/456/pools

    The response body will include information on the number of nodes in each node pool, the node pool's Linode type, and id, and each node's own id and status.

    {{< output >}}
{"pages": 1, "page": 1, "data": [{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready "}, {"id": "13841933", "status": "ready"}]}, {"count": 3, "id": 194, "type": "g6-standard-4", "linodes": [{"id": "13841934", "status": "ready"}, {"id": "13841935", "status": "ready"}, {"id": "13841932", "status": "ready"}]}], "results": 2}%
    {{</ output >}}

### View a Node Pool

You can use the Linode API to access details about a specific node pool in an LKE cluster. You will need your cluster’s ID and node pool ID to access information about this resource. To retrieve your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section. To find a node pool's ID, see the [List a Cluster's Node Pools](#list-a-cluster-s-node-pools) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `poolId` | ID of the LKE node pool to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To view a specific node pool, send a `GET` request to the `/lke/clusters/{clusterId}/pools/{poolId}` endpoint. Replace `12345` with your cluster's `clusterId` and `456` with the node pool's `poolId`.

        curl -H "Authorization: Bearer $TOKEN" \
             https://api.linode.com/v4/lke/clusters/12345/pools/456

    The response body provides information about the number of nodes in the node pool, the node pool's id, and type. You will also retrieve information about each individual node in the node pool, including the Linode's ID and status.

    {{< output >}}
{"count": 2, "id": 193, "type": "g6-standard-2", "linodes": [{"id": "13841932", "status": "ready"}, {"id": "13841933", "status": "ready"}]}%
    {{</ output >}}

    If desired, you can use your node pool's Linode ID(s) to get more details about each node in the pool. Send a `GET` request  to the `/linode/indstances/{linodeId}` endpoint. Ensure you replace `13841932` with your Linode's `id`.

        curl -H "Authorization: Bearer $TOKEN" \
             https://api.linode.com/v4/linode/instances/13841932

      {{< note >}}
Although you have access to your cluster's nodes, it is recommended that you only interact with your nodes via LKE provided interfaces, like LKE API endpoints, or the Kubernetes API and kubectl.
        {{</ note >}}

## Modify your LKE Cluster

Once an LKE cluster is created, you can modify two aspects of the cluster; an LKE cluster's label and node pools. In this section you will learn how to modify each of these parts of your cluster.

### Update your LKE Cluster Label
| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To update your LKE cluster's label, send a `PUT` request to the `/lke/clusters/{clusterId}` endpoint. Ensure you replace `456` with your cluster's `clusterId`

        curl -H "Content-Type: application/json" \
             -H "Authorization: Bearer $TOKEN" \
             -X PUT -d '{
                "label": "updated-cluster-name"
             }' https://api.linode.com/v4/lke/clusters/12345

    The response body will display the updated cluster `label`:

    {{< output >}}
{"created": "2019-08-02T17:17:49", "updated": "2019-08-05T19:11:19", "version": "1.16", "tags": ["ecomm", "blogs"], "label": "updated-cluster-name", "id": 456, "region": "us-central", "status": "running"}%
    {{</ output >}}

### Add a Node Pool to your LKE Cluster

A node pool consists of one or more Linodes (worker nodes). Each node in the pool has the same plan type and is identical to each other. Your LKE cluster can have several node pools, each pool with its own plan type and number of nodes. You will need your cluster's ID in order to add a node pool to it. If you don’t know your cluster’s ID, see the [List LKE Clusters](#list-lke-clusters) section.

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
|`type` | The Linode plan type to use for all the nodes in the pool. Linode plans designate the type of hardware resources applied to your instance.  |
| `count` | The number of nodes to include in the node pool. Each node will have the same plan type. |

1. To add a node pool to an existing LKE cluster, send a `POST` request to the `/lke/clusters/{clusterId}/pools` endpoint. The request body must include the `type` and `count` parameters. Ensure you replace `456` with your own cluster's ID.

        curl -H "Content-Type: application/json" \
             -H "Authorization: Bearer $TOKEN" \
             -X POST -d '{
               "type": "g6-standard-1",
               "count": 5
             }' https://api.linode.com/v4/lke/clusters/456/pools

    The response body will resemble the following:

    {{< output >}}
{"count": 5, "id": 196, "type": "g6-standard-1", "linodes": [{"id": "13841945", "status": "ready"}, {"id": "13841946", "status": "ready"}, {"id": "13841947", "status": "ready"}, {"id": "13841948", "status": "ready"}, {"id": "13841949", "status": "ready"}]}%
    {{</ output >}}

      {{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
    {{</ note >}}

### Resize your LKE Node Pool

You can resize an LKE cluster's node pool to add or decrease its number of nodes.

{{< note >}}
You cannot modify an existing node pool's plan type. If you would like your LKE cluster to use a different node pool plan type, you can [add a new node pool](#add-a-node-pool-to-your-lke-cluster) to your cluster with the same number of nodes to replace the current node pool. You can then delete the node pool that is no longer needed.
{{</ note >}}

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `poolId` | ID of the LKE node pool to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `count` | The number of Linodes in the node pool.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To update your node pool's node count, send a `PUT` request to the `/lke/clusters/{clusterId}/pools/{poolId}` endpoint. Replace `456` with your cluster's `clusterId` and `196` with your node pool's `poolId`.

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
              "type": "g6-standard-4",
              "count": 6
            }' https://api.linode.com/v4/lke/clusters/456/pools/196

      {{< note >}}
Each Linode account has a limit to the number of Linode resources they can deploy. This includes services, like Linodes, NodeBalancers, Block Storage, etc. If you run into issues deploying the number of nodes you designate for a given cluster's node pool, you may have run into a limit on the number of resources allowed on your account. Contact [Linode Support](/docs/platform/billing-and-support/support/) if you believe this may be the case.
    {{</ note >}}

### Delete a Node Pool from a LKE Cluster

When you delete a node pool you also delete the Linodes (nodes) and routes to them. The Pods running on those nodes are evicted and rescheduled. If you have [assigned Pods to the deleted Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node), the Pods might remain in an unschedulable condition if no other node in the cluster satisfies the [node selector](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/#nodeselector).

| **Required Parameters** | **Description** |
| ------- | -------|
| `clusterId` | ID of the LKE cluster to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |
| `poolId` | ID of the LKE node pool to lookup.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; |

1. To delete a node pool from a LKE cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}/pools/{poolId}` end point. Ensure your replace `456` with your cluster's ID and `196` with your cluster's node pool ID.

    {{< caution >}}
This step is permanent and will result in the loss of data.
    {{</ caution >}}

        curl -H "Authorization: Bearer $TOKEN" \
             -X DELETE \
             https://api.linode.com/v4/lke/clusters/456/pools/196

## Delete an LKE Cluster

Deleting an LKE cluster will delete the **Master node**, all **worker nodes**, and all **NodeBallancers** created by the cluster. However, it will **not delete any Volumes** created by the LKE cluster.

1. To delete an LKE Cluster, send a `DELETE` request to the `/lke/clusters/{clusterId}` endpoint. Ensure you replace `456` with your cluster's ID.

    {{< caution >}}
This step is permanent and will result in the loss of data.
    {{</ caution >}}

        curl -H "Authorization: Bearer $TOKEN" \
             -X DELETE \
             https://api.linode.com/v4/lke/clusters/456

## Where to Go From Here?

Now that you have created an LKE cluster, you can continue with the following guides to start creating and deploying workloads to your cluster:

* [How to Install Apps on Kubernetes with Helm](/docs/applications/containers/kubernetes/how-to-install-apps-on-kubernetes-with-helm/)
* [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/applications/containers/kubernetes/deploy-container-image-to-kubernetes/)
* [Troubleshooting Kubernetes](/docs/applications/containers/kubernetes/troubleshooting-kubernetes/)