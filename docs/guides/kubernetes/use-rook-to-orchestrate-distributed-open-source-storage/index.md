---
slug: use-rook-to-orchestrate-distributed-open-source-storage
title: "Use Rook to Orchestrate Distributed Open Source Storage"
title_meta: "How to Use Rook to Orchestrate Distributed Open Source Storage"
description: "Two to three sentences describing your guide."
authors: ["Martin Heller"]
contributors: ["Martin Heller"]
published: 2024-06-28
keywords: ['use rook to orchestrate open source storage','rook','ceph','distributed open source storage','kubernetes','open source storage system','cloud native storage orchestrator','storage orchestration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Rook](https://rook.io/)'
- '[Ceph](https://ceph.com/en/)'
---

When writing content, please reference the [Linode Writer's Formatting Guide](https://www.linode.com/docs/guides/linode-writers-formatting-guide/). This provides formatting guidelines for YAML front matter, Markdown, and our custom shortcodes (like [command](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#commands), [file](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#files), [notes](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#note-shortcode), and [tabs](https://www.linode.com/docs/guides/linode-writers-formatting-guide/#tabs)).

## Before You Begin

In this section, list out any prerequisites necessary for the reader to complete the guide, including: services or products to be created beforehand, hardware and plan requirements, or software that needs to be preinstalled.

See: [Linode Writer's Formatting Guide: Before You Begin](http://www.linode.com/docs/guides/linode-writers-formatting-guide/#before-you-begin)

How to Use Rook to Orchestrate Distributed Open Source Storage

By Martin Heller

Rook provides cloud-native storage *orchestration*, in other words, automated configuration, coordination, and management, for the Ceph distributed open source storage system.  Ceph is used to provide object, block, and file interfaces from a single cluster. Ceph runs on Kubernetes, so the three together provide you with a method to automate and manage large blocks of storage, of the sort that appears in immense data storage centers. This guide leads you through a process that demonstrates how to use Rook to orchestrate open source storage.

## What is Rook? What problem does it solve?

Rook provides a means to automate deployment and management of Ceph to create self-managing, self-scaling, and self-healing storage services. The combination makes it much easier to manage large storage than trying to do it manually.

Ceph provides file system, object, and block storage on a single cluster that is controlled using the [Controlled Replication Under Scalable Hashing (CRUSH)](https://access.redhat.com/documentation/en-us/red_hat_ceph_storage/3/html/storage_strategies_guide/crush_administration) algorithm. CRUSH ensures that the load placed on storage locations such as rows, racks, chassis, hosts, and devices, remains consistent. A CRUSH map defines rules that specify how CRUSH stores and retrieves data.

[Object Storage Daemons (OSDs)](https://documentation.suse.com/ses/7/html/ses-all/admin-caasp-cephosd.html) each manage a single device. Rook simplifies device management and performs tasks such as verifying OSD health.

You can also use Rook to create and customize storage clusters through custom resource definitions (CRDs). There are primarily four different modes in which to create your cluster:

-   **Host Storage Cluster**: Consume storage from host paths and raw devices
-   **Persistent Volume Claim (PVC) Storage Cluster**: Dynamically provision storage underneath Rook by specifying the storage class for Rook to use to consume storage via PVCs.
-   **Stretched Storage Cluster**: Distribute Ceph mons across three zones, while storage (OSDs) is only configured in two zones
-   **External Ceph Cluster**: Connect your K8s applications to an external Ceph cluster

## Creating a Kubernetes Cluster with LKE

Before you can work with Ceph and Rook, you need a basic Kubernetes setup that you can create using [Linode Kubernetes Engine - Get Started](https://www.linode.com/docs/products/compute/kubernetes/get-started/). This guide assumes that you have the 1.26 or later version of Kubernetes installed. The recommended minimum Kubernetes setup for Rook has three nodes with 4 GB memory and 2 CPUs each. It takes a few minutes for Linode to provision and start the cluster.

[https://www.dropbox.com/s/gag3s0cseyg1m3t/linode%20create%20cluster%20Screenshot%202023-06-27%20at%204.38.06%20PM.png?dl=0 ]

[https://www.dropbox.com/s/3p4n4dlxmvwsboo/linode%20cluster%20running%20Screenshot%202023-06-27%20at%204.52.19%20PM.png?dl=0 ]


You need to have the `kubeconfig.yaml` file for your cluster on your local machine. Download it from this page. The filename is `rook-kubeconfig.yaml`, since Linode prefixes the filename with the name of the cluster. Save your kubeconfig file’s path to the `$KUBECONFIG` environment variable in your local console:

```command
export KUBECONFIG=~/Downloads/<clustername>-kubeconfig.yaml
```

Now list the nodes in your cluster:

```command
kubectl get nodes
```

```output
NAME                            STATUS   ROLES    AGE   VERSION
lke116411-172761-649b48bf69f8   Ready    <none>   18m   v1.26.3
lke116411-172761-649b48bf8af9   Ready    <none>   18m   v1.26.3
lke116411-172761-649b48bfab4b   Ready    <none>   19m   v1.26.3
```

If `kubectl` isn’t already installed on your local machine, follow the instructions [here](https://www.linode.com/docs/guides/kubernetes-reference/) for your OS and try the node list again.

Add the `KUBECONFIG` environment variable to your local `.bashrc` file, or the equivalent if you’re not using `bash`, such as `.zprofile` for `zsh`, so you don’t have to type it manually every time you open a new terminal window.

After creating your nodes and verifying you can access them, use these steps to create node volumes:

1.  Click a node with a name such as `lke116411-172761-649b48bf69f8` in the Cloud Manager.

1.  Click the Storage Link.

1.  Click Create Volume.

1.  Type a volume name.

1.  Set a volume size of at least 40 GB.

1.  Click Create Volume.

1.  Configure and mount the volume by accessing the node through a terminal window, which requires powering down the node, setting a root password for the node, and powering up the node. Next, you can log into the node using `ssh `or LISH. The Show Config link for the volume displays the commands you need to run in the console, and allows you to copy them. For editing `/etc/fstab`, `nano` is a good choice.

1.  Repeat Steps 1 through 7 for all of the nodes.

[https://www.dropbox.com/s/vnheggnwln6gp0a/volume%20running%20Screenshot%202023-06-27%20at%205.08.22%20PM.png?dl=0 ]

[https://www.dropbox.com/s/swpgoxcvhuzhxzr/volume%20config%20Screenshot%202023-06-27%20at%205.08.47%20PM.png?dl=0 ]

[https://www.dropbox.com/s/zznjqzeboggirlg/linode%20ssh%20Screenshot%202023-06-28%20at%2011.50.19%20AM.png?dl=0 ]

## Rook and Ceph Installation

[Install Rook](https://rook.io/docs/rook/v1.11/Getting-Started/quickstart/#tldr) and Ceph on your system using these steps in your local terminal:

```command
git clone --single-branch --branch v1.11.8 https://github.com/rook/rook.git
cd rook/deploy/examples
kubectl create -f crds.yaml -f common.yaml -f operator.yaml
kubectl create -f cluster.yaml
```

If all is well, you’ll see:

```command
cephcluster.ceph.rook.io/rook-ceph created
```

Now you can verify the status of the rook-ceph cluster:

```command
kubectl -n rook-ceph get pod
```

[https://www.dropbox.com/s/o2sqlhuodfm80tg/rook-ceph%20status%20Screenshot%202023-06-28%20at%2012.49.53%20PM.png?dl=0 ]

### Installing and using the Rook-Ceph Toolbox

Once you have Kubernetes installed and configured, you can [install and use the Ceph Toolbox](https://rook.io/docs/rook/v1.11/Troubleshooting/ceph-toolbox/):

```command
kubectl create -f toolbox.yaml
```

```output
deployment.apps/rook-ceph-tools created
```

```command
kubectl -n rook-ceph rollout status deploy/rook-ceph-tools
```

```output
deployment "rook-ceph-tools" successfully rolled out
```

```command
kubectl -n rook-ceph exec -it deploy/rook-ceph-tools -- bash
```

```output
bash-4.4$ ceph status
  cluster:
    id:     47dd7687-ce0b-4b68-9eb0-094185a826d0
    health: HEALTH_WARN
            OSD count 0 < osd_pool_default_size 3

  services:
    mon: 3 daemons, quorum a,b,c (age 58m)
    mgr: b(active, since 52m), standbys: a
    osd: 0 osds: 0 up, 0 in

  data:
    pools:   0 pools, 0 pgs
    objects: 0 objects, 0 B
    usage:   0 B used, 0 B / 0 B avail
    pgs:
```

```output
bash-4.4$ ceph osd status
bash-4.4$ ceph df
--- RAW STORAGE ---
CLASS  SIZE  AVAIL  USED  RAW USED  %RAW USED
TOTAL   0 B    0 B   0 B       0 B          0

--- POOLS ---
POOL  ID  PGS  STORED  OBJECTS  USED  %USED  MAX AVAIL
bash-4.4$ rados df
POOL_NAME  USED  OBJECTS  CLONES  COPIES  MISSING_ON_PRIMARY  UNFOUND  DEGRADED  RD_OPS  RD  WR_OPS  WR  USED COMPR  UNDER COMPR

total_objects    0
total_used       0 B
total_avail      0 B
total_space      0 B
```

When you want to remove the Rook-Ceph Toolbox, do so from your local terminal:

```command
kubectl -n rook-ceph delete deploy/rook-ceph-tools
```

According to the Ceph status shown above, this cluster is in the `HEALTH_WARN` state and has no storage objects. This doesn’t mean it won’t work, but if it goes into a `HEALTH_ERROR` state then I/O stops. To run diagnostics, you can consult the [Ceph common issues troubleshooting guide](https://rook.io/docs/rook/v1.11/Troubleshooting/ceph-common-issues/). Your Rook-Ceph cluster is in the `HEALTH_OK` state at this point, or if not, is going to be after you go through one or more of the walkthroughs mentioned in the following section.

## Example of Rook-Ceph in use

At this point you should be ready to try out your storage. There are three walkthroughs to go through, one each for [block](https://rook.io/docs/rook/v1.11/Storage-Configuration/Block-Storage-RBD/block-storage/) storage, [shared file system](https://rook.io/docs/rook/v1.11/Storage-Configuration/Shared-Filesystem-CephFS/filesystem-storage/), and [object stores](https://rook.io/docs/rook/v1.11/Storage-Configuration/Object-Storage-RGW/object-storage/). Start with the block storage walkthrough, which creates a storage class, starts `mysql` and `wordpress` in your K8s cluster, and has you use the `wordpress` app from a browser. You may need to expose the internal IP address of your service to one your local browser can see to make this work. You can accomplish this with the [`kubectl expose deployment`](https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/) command.

## Conclusion

This article helps you create a Ceph cluster and use Rook to manage it on a Linode Kubernetes setup. You are ready to perform tasks such as installing a database manager to provide various levels of application support. This kind of setup works with data centers of nearly any size, and scales well to huge data centers used by large organizations.