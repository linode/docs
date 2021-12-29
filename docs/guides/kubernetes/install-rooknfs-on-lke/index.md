---
slug: how-to-install-rooknfs-on-lke
author:
  name: Linode
  email: docs@linode.com
description: 'How to install Rook NFS on LKE.'
keywords: ['rooknfs','kubernetes', 'lke', 'linode kubernetes engine']
tags: ["docker","kubernetes","container","nginx","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified_by:
  name: Linode
title: "How to Set Up Rook NFS for Persistent Storage on LKE"
h1_title: "Setting Up Rook NFS for Persistent Storage on LKE"
enable_h1: true
contributor:
  name: Todd Becker
aliases: ['/kubernetes/how-to-install-rooknfs-on-LKE/']
---

Rook NFS allows remote hosts to mount filesystems over a network and interact with those filesystems as though they are mounted locally. When used with LKE, Rook can mount a Linode Block Storage PVC which uses `ReadWriteOnce` permissions. The volume can then be leveraged as NFS and exported as a storage class that uses `ReadWriteMany` permissions. This allows Linode's Block Storage to store persistent data for LKE clusters.

## Before you Begin

- This guide assumes that you already have an LKE cluster up and running. If that is not the case, please follow the instructions in our [LKE Tutorial](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
- This guide relies on git wherever `kubectl` is installed. While git is installed on many Linux distributions, others may require manual installation. Git can be installed on most distributions by following our [Git Installation Guide](/docs/guides/how-to-install-git-on-linux-mac-and-windows/)

## Installing Rook NFS on LKE

1.  Rook has several manifests on their [github repository](https://github.com/rook/rook) that are used within this guide. Clone the project's repository to your machine:

        git clone --single-branch --branch v1.6.7 https://github.com/rook/rook.git
        cd rook/cluster/examples/kubernetes/nfs

    {{< note >}}
    If you do not want to use git, the raw manifest files can alternatively be obtained via wget or curl.
    {{< /note >}}

1.  Apply the Rook operator and common manifests:

        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/common.yaml
        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/operator.yaml

1.  Validate that all pods are running as expected:

        kubectl -n rook-nfs-system get pod

    You Should see the following output:

    {{< output >}}
NAME                                 READY   STATUS    RESTARTS   AGE
rook-nfs-operator-5cc679885d-88769   1/1     Running   0          45h
rook-nfs-webhook-6ffb579d8c-wl59k    1/1     Running   0          45h
{{< /output >}}

1.  Apply the Rook Admission Webhook and Cert Manager. Cert manager is a prerequisite for the webhook and applies an added layer of security:

        kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v0.15.1/cert-manager.yaml
        kubectl apply -f webhook.yaml

1.  Verify that the webhook and cert manager were set up correctly:

        kubectl get -n cert-manager pod
        kubectl -n rook-nfs-system get pod

    Output similar to the following should appear:

    {{< output >}}
kubectl get -n cert-manager pod
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-cainjector-6d9776489b-wprdx   1/1     Running   0          45h
cert-manager-d7d8fb5c9-wv66w               1/1     Running   0          45h
cert-manager-webhook-544c44ccdc-stjjb      1/1     Running   0          45h
kubectl -n rook-nfs-system get pod
NAME                                 READY   STATUS    RESTARTS   AGE
rook-nfs-operator-5cc679885d-88769   1/1     Running   0          45h
rook-nfs-webhook-6ffb579d8c-wl59k    1/1     Running   0          45h
{{< /output >}}

1.  There is an optional step in the Rook guide to add a Pod Security Policy. This is recommended for security.

        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/psp.yaml

1.  Create a service account user for Rook to run the NFS server with:

        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/rbac.yaml

1.  Edit the PVC portion of the default NFS server manifests before initializing the NFS server. The provided NFS manifest has two changes that need made. The first is the storage class for the PVC is left off, which assumes the default storage class. This can be explicitly defined to "linode-block-storage-retain" instead of assuming the default storage class. Secondly the accessModes is set to ReadWriteMany and the Linode block storage does not support ReadWriteMany. This should be changed to ReadWriteOnce.

    {{< file=rook/cluster/examples/kubernetes/nfs/nfs.yaml >}}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nfs-default-claim
  namespace: rook-nfs
spec:
  storageClassName: linode-block-storage-retain # Add this line to specify the storage class to be used
  accessModes:
  - ReadWriteOnce # Edit this line to ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
# Additionally this manifest contains the Rook NFSServer below the PVC
# This is not displayed as there are no modifications to that portion of the manifest
{{< /file >}}

1.  Apply the updated nfs.yaml file, then add a Rook storage class that leverages the Rook NFS server.

        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/nfs.yaml
        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/sc.yaml

## Testing the Server

To test the Rook NFS server, create two deployments that will leverage a singular storage class labeled as `rook-nfs-share1`.

1. Deploy the PVC, busybox, and web-rc server using the following commands:

        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/pvc.yaml
        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/busybox-rc.yaml
        kubectl apply -f ~/rook/cluster/examples/kubernetes/nfs/web-rc.yaml

1. Create a service that will allow the busybox container to update the timestamp in the `index.html` file:

        kubectl apply -f  ~/rook/cluster/examples/kubernetes/nfs/web-service.yaml

The following command can now be entered to list the files being stored for in the volume for the busybox workload:

    kubectl exec $(kubectl get pod -l app=nfs-demo,role=busybox -o jsonpath='{.items[0].metadata.name}') ls /mnt

This additional command can also be entered to list all of the files in the  volume for the nginx workload:

    kubectl exec $(kubectl get pod -l app=nfs-demo,role=web-frontend -o jsonpath='{.items[0].metadata.name}') ls /usr/share/nginx/html








