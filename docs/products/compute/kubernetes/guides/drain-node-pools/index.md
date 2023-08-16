---
description: "Learn how to drain a node pool in Linode Kubernetes Engine, create a Persistent Volume and copy the application data to a Persistent Volume."
keywords: [drain, node pool, maintenance, upgrade, pod disruption]
published: 2020-07-07
modified: 2023-02-09
modified_by:
  name: Linode
title: Drain a Node Pool
title_meta: How to Drain a Node Pool in Linode Kubernetes Engine
external_resources:
  - "[Kubernetes Documentation](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/)"
aliases: ['/guides/how-to-drain-a-node-pool-in-linode-kubernetes-engine/']
authors: ["Linode"]
---

## Draining a Node

You can use `kubectl drain` to safely evict all of the pods from a node before you perform maintenance on the node such as kernel upgrade, hardware maintenance, and others. Safe evictions allow the containers of the pods to gracefully terminate and respect the PodDisruptionBudgets that you specified. For more information see, [Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/).

Kubernetes workloads move around the cluster, which enables use cases like highly available distributed systems. Linode recommends you to move any data storage on the filesystem of the Compute Instances in an LKE cluster to Persistent Volumes with network attached storage. Avoid using local storage on LKE nodes whenever possible. If you are using Persistent Volume Claim for the application on an LKE cluster, skip the entire [Copy the application data to a Persistent Volume](#copy-the-application-data-to-a-persistent-volume) section and proceed directly to [Add a new node pool to the cluster and drain the nodes](#add-a-new-node-pool-to-the-cluster-and-drain-the-nodes).

This guide provides instructions to:

- Copy the application data to a Persistent Volume if you are using a local storage to store application data.
- Add a new node pool to the cluster and then drain the nodes.

## Before You Begin

This guide assumes you have a working [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/) cluster running on Linode and you are familiar with *PodDisruptionBudget* concept and Configured *PodDisruptionBudgets* for applications that need them.

1.  [Install the Kubernetes CLI](/docs/products/compute/kubernetes/guides/kubectl/) (`kubectl`) on the local computer.

1.  Follow the instructions in [Deploying and Managing a Cluster with Linode Kubernetes Engine Tutorial](/docs/products/compute/kubernetes/) to connect to an LKE cluster.

    {{< note >}}
    Ensure that the `KUBECONFIG` context is [persistent](/docs/products/compute/kubernetes/guides/kubectl/#persist-the-kubeconfig-context)
    {{< /note >}}

1.  Ensure that Kubernetes CLI is using the right cluster context. Run the `get-contexts` subcommand to check:

    ```command
    kubectl config get-contexts
    ```

## Copy the application data to a Persistent Volume

{{< note type="alert" >}}
The instructions in this section creates a Block Storage volume billable resource on your Linode account. A single volume can range from 10 GB to 10,000 GB in size and costs $0.10/GB per month or $0.00015/GB per hour. If you do not want to keep using the Block Storage volume that you create, be sure to delete it when you have finished the guide.

If you remove the resources afterward, you are only billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/products/platform/billing/) guide for detailed information about how hourly billing works and for a table of plan pricing.
{{< /note >}}

1.  Create a *Persistent Volume Claim* (PVC) that consumes a Block Storage Volume. To create a PVC, create a manifest file with the following YAML:

    ```file {title="pvc.yaml" lang=yaml}
    apiVersion: v1
    kind: PersistentVolumeClaim
    metadata:
      name: pvc-test
    spec:
      accessModes:
      - ReadWriteOnce
      resources:
        requests:
          storage: 10Gi
      storageClassName: linode-block-storage-retain
    ```

    {{< note >}}
    To retain the Block Storage Volume and its data, even after the associated PVC is deleted, use the `linode-block-storage-retain` StorageClass. If, instead, you prefer to have the Block Storage Volume and its data deleted along with its PVC, use the `linode-block-storage` StorageClass. For more information, see the [Delete a Persistent Volume Claim](/docs/guides/deploy-volumes-with-the-linode-block-storage-csi-driver/#delete-a-persistent-volume-claim).
    {{< /note >}}

    The PVC represents a Block Storage Volume. Because Block Storage Volumes have a minimum size of 10 gigabytes, the storage has been set to `10Gi`. If you choose a size smaller than 10 gigabytes, the PVC defaults to 10 gigabytes. Currently the only mode supported by the Linode Block Storage CSI driver is `ReadWriteOnce`, meaning that it can only be connected to one Kubernetes node at a time.

1.  Create the PVC in Kubernetes, and pass in the `pvc.yaml` file:

    ```command
    kubectl create -f pvc.yaml
    ```

    After a few moments the Block Storage Volume is provisioned and the Persistent Volume Claim is ready to use.

1.  Check the status of the PVC by typing the following command:

    ```command
    kubectl get pvc
    ```

    An output similar to the following appears:

    ```output
    NAME          STATUS     VOLUME                 CAPACITY     ACCESS MODES   STORAGECLASS                  AGE
    pvc-test      Bound      pvc-0e95b811652111e9    10Gi         RWO           linode-block-storage-retain   2m
    ```

    You can now attach the PVC to a Pod.

1.  Create a manifest file for the new Pod using the following YAML, where `application` is using local storage at `$MOUNTPATH`, `pvc-test` is a Persistent Volume Claim at `$CSIVolumePath`:

    ```file {title="new-pod.yaml" lang=yaml}
    apiVersion: v1
    kind: Pod
    metadata:
      name: new-pod
      labels:
        app: application
          volumes:
          - name: application
            hostPath:
              path: $HOSTPATH
          - name: pvc-test
            persistentVolumeClaim:
              claimName: pvc-test
        ........
          volumeMounts:
          - name: application
            mountPath: $MOUNTPATH
          - name: pvc-test
            mountPath: $CSIVolumePath
    ```

1.  Create a new Pod named `new-pod`:

    ```command
    kubectl create -f new-pod.yaml
    ```

1.  After a few moments the Pod should be up and running. To check the status of the Pod, type the following command:

    ```command
    kubectl get pods
    ```

    An output similar to following appears:

    ```output
    NAME       READY   STATUS    RESTARTS   AGE
    new-pod   1/1     Running   0          2m
    ```

1.  Connect to a shell in the new Pod, type the following command:

    ```command
    kubectl exec -it new-pod -- /bin/bash
    ```

1.  From the shell, copy the files from local storage to the PVC. In the following command `$MOUNTPATH` is the location of the local storage and `$CSIVolumePath` is the location on the PVC:

    ```command
    cp -P $MOUNTPATH $CSIVolumePath.
    ```

1. Delete the new Pod that you created, and then re-create it:

    ```command
    kubectl delete pod new-pod
    kubectl create -f new-pod.yaml
    ```

    You should now see that all the data is stored in the CSI Volume.

## Add a new node to the cluster and drain the node

1. Add an [additional Node Pool](/docs/products/compute/kubernetes/guides/manage-node-pools/#add-a-node-pool) to the LKE cluster, of a plan type and size which can accommodate the existing workloads.

1. After the new Compute Instances have joined the cluster, drain any instances that are scheduled for maintenance. This causes the workloads to be rescheduled to other Compute Instances in the cluster. Linode recommends draining one instance at a time to ensure that the workloads have been rescheduled to other instances. An example Node drain command:

    ```command
    kubectl drain lke9297-11573-5f3e357cb447
    ```

1. You can delete the old Node Pool or choose to keep it for after the maintenance is complete. Note, if you keep the Node Pool, you will be charged for it.

1. When the maintenance has been completed and if you kept your previous Compute Instances, after they have booted you can mark them as scheduled again by using the following command:

    ```command
    kubectl uncordon lke9297-11573-5f3e357cb447
    ```