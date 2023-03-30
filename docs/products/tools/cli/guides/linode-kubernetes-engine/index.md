---
title: "Linode CLI Commands for LKE"
description: "How to use the Linode CLI to create and manage Linode Kubernetes Engine (LKE) clusters."
published: 2020-07-20
modified: 2022-05-02
authors: ["Linode"]
---

1.  Lists current Kubernetes Clusters available on your account:

        linode-cli lke clusters-list

1.  Create a Kubernetes Cluster. The Kubernetes Cluster will be created asynchronously. You can use the events system to determine when the Kubernetes Cluster is ready to use:

        linode-cli lke cluster-create \
          --label cluster12345 \
          --region us-central \
          --k8s_version 1.16 \
          --node_pools.type g6-standard-4 --node_pools.count 6 \
          --node_pools.type g6-standard-8 --node_pools.count 3 \
          --tags ecomm

1.  Update Kubernetes Cluster:

        linode-cli lke cluster-update $cluster_id \
          --label lkecluster54321 \
          --tags ecomm \
          --tags blog \
          --tags prod \
          --tags monitoring

1.  Delete a Cluster you have permission to `read_write`:

        linode-cli lke cluster-delete $cluster_id

1.  List all active Node Pools on a Kubernetes Cluster:

        linode-cli lke pools-list $cluster_id

1.  Create a Node Pool on a Kubernetes Cluster:

        linode-cli lke pool-create $cluster_id \
          --type g6-standard-4 \
          --count 6

1.  Update Node Pool in a Kubernetes Cluster. When a Node Pool's count is changed, the Nodes in that pool will be replaced in a rolling fashion.

        linode-cli lke pool-update $cluster_id $pool_id \
          --count 6

1.  Delete a Node Pool from a Kubernetes Cluster:

        linode-cli lke pool-delete $cluster_id $pool_id

1.  View the Kubeconfig file for the Kubernetes Cluster:

        linode-cli lke kubeconfig-view $cluster_id

Other actions are available. Use `linode-cli lke --help` for a complete list.