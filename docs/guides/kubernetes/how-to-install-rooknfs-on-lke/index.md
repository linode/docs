---
slug: how-to-install-rooknfs-on-lke
description: 'How to install Rook NFS on LKE.'
keywords: ['rooknfs','kubernetes', 'lke', 'linode kubernetes engine']
tags: ["docker","kubernetes","container","nginx","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-13
modified_by:
  name: Linode
title: "Setting Up Rook NFS for Persistent Storage on LKE"
title_meta: "How to Set Up Rook NFS for Persistent Storage on LKE"
aliases: ['/kubernetes/how-to-install-rooknfs-on-LKE/']
deprecated: true
authors: ["Todd Becker"]
---

Rook NFS allows remote hosts to mount filesystems over a network and interact with those filesystems as though they are mounted locally. When used with LKE, Rook can mount a Linode Block Storage PVC which uses `ReadWriteOnce` permissions. The volume can then be leveraged as NFS and exported as a storage class that uses `ReadWriteMany` permissions. This allows Linode's Block Storage to store persistent data for LKE clusters.

## Before you Begin

- This guide assumes that you already have an LKE cluster up and running. If that is not the case, please follow the instructions in our [LKE Tutorial](/docs/products/compute/kubernetes/).
- This guide relies on git wherever `kubectl` is installed. While git is installed on many Linux distributions, others may require manual installation. Git can be installed on most distributions by following our [Git Installation Guide](/docs/guides/how-to-install-git-on-linux-mac-and-windows/)

## Installing Rook NFS on LKE

1.  Rook has several manifests on their [github repository](https://github.com/rook/nfs) that are used within this guide. Clone the [latest release](https://github.com/rook/rook/releases/) from the project's repository to your machine:

    ```command
    git clone --single-branch --branch v1.7.3 https://github.com/rook/nfs.git
    ```

    {{< note >}}
    If you do not want to use git, the raw manifest files can alternatively be obtained via wget or curl.
    {{< /note >}}

1.  Apply the Rook operator and common manifests:

    ```command
    kubectl create -f ~/nfs/cluster/examples/kubernetes/nfs/crds.yaml
    kubectl create -f ~/nfs/cluster/examples/kubernetes/nfs/operator.yaml
    ```

1.  Validate that all pods are running as expected:

    ```command
    kubectl -n rook-nfs-system get pod
    ```

    You Should see the following output:

    ```output
    NAME                                 READY   STATUS    RESTARTS   AGE
    rook-nfs-operator-5cc679885d-88769   1/1     Running   0          45h
    ```

1. Overwrite the contents of the `webhook.yaml` file to the contents of the following file. This ensures that the webhook manifests will rely on a more up to date version of the Kubernetes API, ensuring that they're compatible with the latest versions of Kubernetes:

    ```file {title="/nfs/cluster/examples/kubernetes/nfs/webhook.yaml" lang=yaml}
    apiVersion: v1
    kind: ServiceAccount
    metadata:
      name: rook-nfs-webhook
      namespace: rook-nfs-system
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: Role
    metadata:
      name: rook-nfs-webhook
      namespace: rook-nfs-system
    rules:
      - apiGroups: [""]
        resources: ["secrets"]
        resourceNames:
          - "rook-nfs-webhook-cert"
        verbs: ["get", "list", "watch"]
    ---
    apiVersion: rbac.authorization.k8s.io/v1
    kind: RoleBinding
    metadata:
      name: rook-nfs-webhook
      namespace: rook-nfs-system
    roleRef:
      apiGroup: rbac.authorization.k8s.io
      kind: Role
      name: rook-nfs-webhook
    subjects:
      - apiGroup: ""
        kind: ServiceAccount
        name: rook-nfs-webhook
        namespace: rook-nfs-system
    ---
    apiVersion: cert-manager.io/v1
    kind: Certificate
    metadata:
      name: rook-nfs-webhook-cert
      namespace: rook-nfs-system
    spec:
      dnsNames:
        - rook-nfs-webhook.rook-nfs-system.svc
        - rook-nfs-webhook.rook-nfs-system.svc.cluster.local
      issuerRef:
        kind: Issuer
        name: rook-nfs-selfsigned-issuer
      secretName: rook-nfs-webhook-cert
    ---
    apiVersion: cert-manager.io/v1
    kind: Issuer
    metadata:
      name: rook-nfs-selfsigned-issuer
      namespace: rook-nfs-system
    spec:
      selfSigned: {}
    ---
    apiVersion: admissionregistration.k8s.io/v1
    kind: ValidatingWebhookConfiguration
    metadata:
      annotations:
        cert-manager.io/inject-ca-from: rook-nfs-system/rook-nfs-webhook-cert
      creationTimestamp: null
      name: rook-nfs-validating-webhook-configuration
    webhooks:
      - clientConfig:
          caBundle: Cg==
          service:
            name: rook-nfs-webhook
            namespace: rook-nfs-system
            path: /validate-nfs-rook-io-v1alpha1-nfsserver
        failurePolicy: Fail
        admissionReviewVersions: ["v1", "v1beta1"]
        sideEffects: None
        name: validation.nfsserver.nfs.rook.io
        rules:
          - apiGroups:
              - nfs.rook.io
            apiVersions:
              - v1alpha1
            operations:
              - CREATE
              - UPDATE
            resources:
              - nfsservers
    ---
    kind: Service
    apiVersion: v1
    metadata:
      name: rook-nfs-webhook
      namespace: rook-nfs-system
    spec:
      selector:
        app: rook-nfs-webhook
      ports:
        - port: 443
          targetPort: webhook-server
    ---
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: rook-nfs-webhook
      namespace: rook-nfs-system
      labels:
        app: rook-nfs-webhook
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: rook-nfs-webhook
      template:
        metadata:
          labels:
            app: rook-nfs-webhook
        spec:
          containers:
            - name: rook-nfs-webhook
              image: rook/nfs:v1.7.3
              imagePullPolicy: IfNotPresent
              args: ["nfs", "webhook"]
              ports:
                - containerPort: 9443
                  name: webhook-server
              volumeMounts:
                - mountPath: /tmp/k8s-webhook-server/serving-certs
                  name: cert
                  readOnly: true
          volumes:
            - name: cert
              secret:
                defaultMode: 420
                secretName: rook-nfs-webhook-cert
    ```

1.  Apply the Rook Admission Webhook and Cert Manager. Cert manager is a prerequisite for the webhook and applies an added layer of security:

    ```command
    kubectl apply -f https://github.com/jetstack/cert-manager/releases/download/v1.8.0/cert-manager.yaml
    kubectl apply -f  ~/nfs/cluster/examples/kubernetes/nfs/webhook.yaml
    ```

1.  Verify that the webhook and cert manager were set up correctly:

    ```command
    kubectl get -n cert-manager pod
    kubectl -n rook-nfs-system get pod
    ```

    Output similar to the following should appear:

    ```output
    kubectl get -n cert-manager pod
    NAME                                       READY   STATUS    RESTARTS   AGE
    cert-manager-cainjector-6d9776489b-wprdx   1/1     Running   0          45h
    cert-manager-d7d8fb5c9-wv66w               1/1     Running   0          45h
    cert-manager-webhook-544c44ccdc-stjjb      1/1     Running   0          45h
    kubectl -n rook-nfs-system get pod
    NAME                                 READY   STATUS    RESTARTS   AGE
    rook-nfs-operator-5cc679885d-88769   1/1     Running   0          45h
    rook-nfs-webhook-6ffb579d8c-wl59k    1/1     Running   0          45h
    ```

1.  There is an optional step in the Rook guide to add a Pod Security Policy. This is recommended for security.

    ```command
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/psp.yaml
    ```

1.  Create a service account user for Rook to run the NFS server with:

    ```command
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/rbac.yaml
    ```

1.  Edit the PVC portion of the default NFS server manifests in the `nfs.yaml` file before initializing the NFS server. The provided NFS manifest has two changes that need to be made. The first is the storage class for the PVC is left off, which assumes the default storage class. This can be explicitly defined to "linode-block-storage-retain" instead of assuming the default storage class. Secondly the accessModes is set to ReadWriteMany and the Linode block storage does not support ReadWriteMany. This should be changed to ReadWriteOnce.

    ```file {title="/nfs/cluster/examples/kubernetes/nfs/nfs.yaml" lang=yaml}
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
    ```

1.  Apply the updated nfs.yaml file, then add a Rook storage class that leverages the Rook NFS server.

    ```command
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/nfs.yaml
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/sc.yaml
    ```

## Testing the Server

To test the Rook NFS server, create two deployments that will leverage a singular storage class labeled as `rook-nfs-share1`.

1.  Deploy the PVC, busybox, and web-rc server using the following commands:

    ```command
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/pvc.yaml
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/busybox-rc.yaml
    kubectl apply -f ~/nfs/cluster/examples/kubernetes/nfs/web-rc.yaml
    ```

1.  Create a service that will allow the busybox container to update the timestamp in the `index.html` file:

    ```command
    kubectl apply -f  ~/nfs/cluster/examples/kubernetes/nfs/web-service.yaml
    ```

The following command can now be entered to list the files being stored for in the volume for the busybox workload:

```command
kubectl exec $(kubectl get pod -l app=nfs-demo,role=busybox -o jsonpath='{.items[0].metadata.name}') -- ls /mnt
```

This additional command can also be entered to list all of the files in the volume for the nginx workload:

```command
kubectl exec $(kubectl get pod -l app=nfs-demo,role=web-frontend -o jsonpath='{.items[0].metadata.name}') -- ls /usr/share/nginx/html