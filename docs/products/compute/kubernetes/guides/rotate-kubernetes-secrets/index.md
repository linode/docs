---
slug: rotate-kubernetes-secrets
title: "Rotate Kubernetes Secrets"
published: 2023-12-10
authors: ["Linode"]
description: "Learn how to secure your cluster by rotating Kubernetes secrets."
keywords: ["kubernetes", "linode kubernetes engine", "lke", "cluster", "cluster security", "secret", "secrets", "token", "tokens"]
tags: ["Kubernetes", "Linode Kubernetes Engine", "LKE"]
---

## Kubernetes Secrets

A Kubernetes secret is a special file within a cluster that stores sensitive authentication information like passwords, tokens, or keys. Anyone with root-level access to a cluster has access to the "secrets" for that cluster. It is a best practice to rotate secrets on a regular basis or otherwise as-needed (i.e. an employee leaves a company or roll, general security practices, etc.).

Note that the instructions in this guide only apply to the namespaces included in the examples; there may be additional secrets in additional namespaces you may want to delete or rotate.

{{< note >}}
The steps covered in this guide apply primarily to **Kubernetes version 1.26** unless stated otherwise.
{{< /note >}}

## Before You Begin

You will need to have the kubectl command line tool installed and your local system configured to communicate with your cluster. To do this, you must download your cluster's kubeconfig file and save its file path to your `$KUBECONFIG` environment variable. Instructions can be found here: [Access and Download your kubeconfig](/docs/products/compute/kubernetes/get-started/#access-and-download-your-kubeconfig)

## Rotate Your Cluster's Secrets

### Rotate a Secret in the kube-system Namespace

Once your local `$KUBECONFIG` environment variable is configured with your cluster's kubeconfig file, follow these steps to rotate a secrete within your cluster.

1. List out the secrets in your cluster's kube-system namespace:

    ```command
    kubectl -n kube-system get secrets
    ```
    You should see output similar to the following:
    ```output
    NAME                                TYPE                                  DATA   AGE
    sample1-token-z6mb2                 kubernetes.io/service-account-token   3      59d
    sample2-token-tltwm                 kubernetes.io/service-account-token   3      59d
    sample3-token-pkt8h                 kubernetes.io/service-account-token   3      59d
    sample4-token-vzvjx                 kubernetes.io/service-account-token   3      59d
    ```
1. From the list of secrets, identify the secret you wish to rotate.

1. Delete the secret. A new secret will automatically be generated in its place after it is deleted.

    ```command
    kubectl -n kube-system delete secret sample1-token-z6mb2
    ```
    You should receive a confirmation the secret is deleted:
    ```output
    secret "sample1-token-z6mb2" deleted
    ```
1. View your secrets again:

    ```command
    kubectl -n kube-system get secrets
    ```
    You should see a new secret in place of the one you just deleted. The new secret should be identifiable by the new `AGE` value and new random-suffix trailing the secret name.
    ```output
    NAME                                TYPE                                  DATA   AGE
    sample1-token-rm2dx                 kubernetes.io/service-account-token   3      34s
    ```
1. Your secret is now rotated.

{{< note title="Additional details for Kubernetes version 1.27 and later" >}}
In Kubernetes version 1.27 and later, new secrets are not automatically created after the old one is deleted. In order for a new secret to populate, you must regenerate your cluster's kubeconfig file as described in [Rotate your lke-admin-token](#rotate-your-lke-admin-token) below. Note that the below steps should still be completed in order to also rotate your lke-admin-token.
{{< /note >}}

### Rotate Your lke-admin-token

Rather than being rotated within the cluster, the lke-admin-token must be regenerated via the Linode API or CLI. These steps use the Linode CLI and follow the [Kubernetes Cluster Regenerate](/docs/api/linode-kubernetes-engine-lke/#kubernetes-cluster-regenerate) instructions from our API documentation. See our API documentation for correlating API commands.

1. View your list of Kubernetes clusters to get the ID number (clusterId) of the cluster you wish to target:

    ```command
    linode-cli lke clusters-list
    ```
    The clusterId can be found in the `id` column:
    ```output
    ┌────────┬─────────────────┬────────┬─────────────┬─────────────────────────────────┐
    │ id     │ label           │ region │ k8s_version │ control_plane.high_availability │
    ├────────┼─────────────────┼────────┼─────────────┼─────────────────────────────────┤
    │ 12345  │ example-cluster │ us-iad │ 1.26        │ True                            │
    └────────┴─────────────────┴────────┴─────────────┴─────────────────────────────────┘
    ```
1. Identity your current lke-admin-token by viewing your list of secrets:

    ```command
    kubectl get secrets -nkube-system
    ```
    The lke-admin-token will look similar to the following:
    ```output
    NAME                                TYPE                                  DATA   AGE
    lke-admin-token-vnjv2               kubernetes.io/service-account-token   3      59d
    ```
1. Regenerate your cluster's kubeconfig file using the clusterId obtained in step 1. Replace {{< placeholder "12345" >}} with your cluster's ID number:

    ```command
    linode-cli lke regenerate {{< placeholder "12345" >}} --kubeconfig=true
    ```
1. Download your new kubeconfig file from Cloud Manager by navigating to the **Kubernetes** section, clicking on your cluster's **more options ellipsis**, and selecting **Download Kubeconfig**. It may take a few minutes for the new kubeconfig file to become available.

1. Reconfigure your new new kubeconfig file by saving the file path to your `$KUBECONFIG` environment variable. Replace {{< placeholder "~/Downloads/kubeconfig.yaml" >}} with the file path for your kubeconfig file:

    ```command
    export KUBECONFIG={{< placeholder "~/Downloads/kubeconfig.yaml" >}}
    ```
1. Confirm the rotation of your lke-admin-token:

    ```command
    kubectl get secrets -nkube-system
    ```
    You should see a new lke-admin-token identified by a new random-suffix and a new `AGE` value:
    ```output
    NAME                                TYPE                                  DATA   AGE
    lke-admin-token-7tqmz               kubernetes.io/service-account-token   3      4m33s
    ```

## Additional Best Practices

Depending on your specific use case and configuration, there may be additional security steps you wish to take once your secrets have been rotated, including restarting pods and recycling nodes.

### Restart Your Pods

1. View your pods:

    ```command
    kubectl get pods
    ```
1. Restart your pods:

    ```command
    kubectl rollout restart
    ```

### Recycle Your Nodes

When recycling a worker node, the corresponding Compute Instance is deleted and replaced with a new one. Nodes can be recycled via Cloud Manager using the instructions in our **Manage Nodes and Node Pools** guide here: [Recycle Nodes](/docs/products/compute/kubernetes/guides/manage-node-pools/#recycle-nodes)