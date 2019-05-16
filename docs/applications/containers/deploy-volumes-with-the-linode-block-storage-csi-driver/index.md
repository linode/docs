---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy Persistent Volume Claims with the Linode Block Storage CSI Driver.'
keywords: ['container','kubernetes','block','storage','volume','csi','interface','driver']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-18
modified: 2019-04-18
modified_by:
  name: Linode
title: "Deploy Persistent Volume Claims with the Linode Block Storage CSI Driver"
external_resources:
- '[Kubernetes PersistentVolumeClaims Documentation](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims)'
- '[Container Storage Interface (CSI) Spec](https://github.com/container-storage-interface/spec/blob/master/spec.md)'
---

## What is the Linode Block Storage CSI Driver?

The [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) defines a standard that storage providers can use to expose block and file storage systems to container orchestration systems. Linode's Block Storage CSI driver follows this specification to allow container orchestration systems, like Kubernetes, to use [Block Storage Volumes](https://www.linode.com/docs/platform/block-storage/) to persist data despite a Pod's lifecycle. A Block Storage Volume can be attached to any Linode to provide additional storage.

## Before You Begin

- This guide assumes you have a working Kubernetes cluster running on Linode. You can deploy a Kubernetes cluster on Linode in the following ways:

    1. Use [Linode's k8s-alpha CLI](/docs/applications/containers/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) to deploy a Kubernetes cluster via the command line.

    1. Deploy a cluster using Terraform and the [Linode Kubernetes Terraform installer](https://registry.terraform.io/modules/linode/k8s/linode/0.1.1).

    1. Use kubeadm to manually deploy a Kubernetes cluster on Linode. You can follow the [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/applications/containers/getting-started-with-kubernetes/) guide to do this.

    {{< note >}}
  - If using the k8s-alpha CLI or the Linode Kubernetes Terraform installer methods to deploy a cluster, you can skip the [Installing the CSI Driver](#installing-the-csi-driver) section of this guide, since it will be automatically installed when you deploy a cluster.

    Move on to the [Attach a Pod to the Persistent Volume Claim](#attach-a-pod-to-the-persistent-volume-claim) section to learn how to consume a Block Storage volume as part of your deployment.

    {{</ note >}}

- The Block Storage CSI supports Kubernetes version 1.13 or higher. To check the version of Kubernetes you are running, you can issue the following command:

        kubectl version

## Installing the CSI Driver
### Create a Kubernetes Secret

A secret in Kubernetes is any token, password, or credential that you want Kubernetes to store for you. In the case of the Block Storage CSI, you'll want to store an API token, and for convenience, the region you would like your Block Storage Volume to be placed in.

{{< note >}}
Your Block Storage Volume must be in the same data center as your Kubernetes cluster.
{{</ note >}}

To create an API token:

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Navigate to your account profile by clicking on your username at the top of the page and selecting **My Profile**. On mobile screen resolutions, this link is in the sidebar navigation.

1.  Click on the **API Tokens** tab.

1.  Click on **Add a Personal Access Token**. The *Add Personal Access Token* menu appears.

1.  Provide a label for the token. This is how you will reference your token within the Cloud Manager.

1.  Set an expiration date for the token with the **Expiry** dropdown.

1.  Set your permissions for the token. You will need Read/Write access for Volumes, and Read/Write access for Linodes.

1.  Click **Submit**.

Your access token will appear on the screen. Copy this down somewhere safe, as once you click **OK** you will not be able to retrieve the token again, and will need to create a new one.

Once you have your API token, it's time to create your secret.

1.  Run the following command to enter your token into memory:

        read -s -p "Linode API Access Token: " LINODE_TOKEN

    Press enter, and then paste in your API token.

1.  Run the following command to enter your region into memory:

        read -p "Linode Region of Cluster: " LINODE_REGION

    You can retrieve a full list of regions by using the [Linode CLI](/docs/platform/api/using-the-linode-cli/):

        linode-cli regions list

    For example, if you want to use the Newark, NJ, USA data center, you would use `us-east` as your region.

1.  Create the secret by piping in the following secret manifest to the `kubectl create` command. Issue the following here document:

        cat <<EOF | kubectl create -f -

1.  Now, paste in the following manifest and press enter:

        apiVersion: v1
        kind: Secret
        metadata:
          name: linode
          namespace: kube-system
        stringData:
          token: "$LINODE_TOKEN"
          region: "$LINODE_REGION"
        EOF

You can check to see if the command was successful by running the `get secrets` command in the `kube-system` namespaces and looking for `linode` in the NAME column of the output:

    kubectl -n kube-system get secrets

You should see output similar to the following:

    NAME                                             TYPE                                  DATA   AGE
    ...
    job-controller-token-6zzkw                       kubernetes.io/service-account-token   3      43h
    kube-proxy-token-td7k8                           kubernetes.io/service-account-token   3      43h
    linode                                           Opaque                                2      42h
    ...

You are now ready to install the Block Storage CSI driver.

### Apply CSI Driver to your Cluster

To install the Block Storage CSI driver, use the `apply` command and specify the following URL:

    kubectl apply -f https://raw.githubusercontent.com/linode/linode-blockstorage-csi-driver/master/pkg/linode-bs/deploy/releases/linode-blockstorage-csi-driver-v0.0.3.yaml

The above file concatenates a few files needed to run the Block Storage CSI driver, including the volume attachment, driver registration, and provisioning sidecars. To see these files individually, visit the project's [GitHub repository](https://github.com/linode/linode-blockstorage-csi-driver/tree/master/pkg/linode-bs/deploy/kubernetes/).

Once you have the Block Storage CSI driver installed, you are ready to provision a Persistent Volume Claim.

## Create a Persistent Volume Claim

{{< caution >}}
The instructions in this section will create a Block Storage volume billable resource on your Linode account. A single volume can range from 10 GiB to 10,000 GiB in size and costs $0.10/GiB per month or $0.00015/GiB per hour. If you do not want to keep using the Block Storage volume that you create, be sure to delete it when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account. Consult the [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for detailed information about how hourly billing works and for a table of plan pricing.
{{</ caution >}}

A *Persistent Volume Claim* (PVC) consumes a Block Storage Volume. To create a PVC, create a manifest file with the following YAML:

{{< file "pvc.yaml" yaml >}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-example
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  storageClassName: linode-block-storage
{{</ file >}}

This PVC represents a Block Storage Volume. Because Block Storage Volumes have a minimum size of 10 gigabytes, the storage has been set to `10Gi`. If you choose a size smaller than 10 gigabytes, the PVC will default to 10 gigabytes.

Currently the only mode supported by the Linode Block Storage CSI driver is `ReadWriteOnce`, meaning that it can only be connected to one Kubernetes node at a time.

To create the PVC in Kubernetes, issue the `create` command and pass in the `pvc.yaml` file:

    kubectl create -f pvc.yaml

After a few moments your Block Storage Volume will be provisioned and your Persistent Volume Claim will be ready to use.

You can check the status of your PVC by issuing the following command:

    kubectl get pvc

You should see output like the following:

    NAME          STATUS   VOLUME                 CAPACITY   ACCESS MODES   STORAGECLASS           AGE
    pvc-example   Bound    pvc-0e95b811652111e9   10Gi       RWO            linode-block-storage   2m

Now that you have a PVC, you can attach it to a Pod.

## Attach a Pod to the Persistent Volume Claim

Now you need to instruct a Pod to use the Persistent Volume Claim. For this example, you will create a Pod that is running an [ownCloud](https://owncloud.org/) container, which will use the PVC.

To create a pod that will use the PVC:

1.  Create a manifest file for the Pod and give it the following YAML:

    {{< file "owncloud-pod.yaml" yaml >}}
apiVersion: v1
kind: Pod
metadata:
  name: owncloud
  labels:
    app: owncloud
spec:
  containers:
    - name: owncloud
      image: owncloud/server
      ports:
        - containerPort: 8080
      volumeMounts:
      - mountPath: "/mnt/data/files"
        name: pvc-example
  volumes:
    - name: pvc-example
      persistentVolumeClaim:
        claimName: pvc-example
{{</ file >}}

    This Pod will run the `owncloud/server` Docker container image. Because ownCloud stores its files in the `/mnt/data/files` directory, this `owncloud-pod.yaml` manifest instructs the ownCloud container to create a mount point at that file path for your PVC.

    In the `volumes` section of the `owncloud-pod.yaml`, it is important to set the `claimName` to the exact name you've given your PersistentVolumeClaim in its manifest's metadata. In this case, the name is `pvc-example`.

1.  Use the `create` command to create the ownCloud Pod:

        kubectl create -f owncloud-pod.yaml

1.  After a few moments your Pod should be up and running. To see the status of your Pod, issue the `get pods` command:

        kubectl get pods

    You should see output like the following:

        NAME       READY   STATUS    RESTARTS   AGE
        owncloud   1/1     Running   0          2m

1.  To list the contents of the `/mnt/data/files` directory within the container, which is the mount point for your PVC, issue the following command on your container:

        kubectl exec -it owncloud -- /bin/sh -c "ls /mnt/data/files"

    You should see output similar to the following:

        admin  avatars	files_external	index.html  owncloud.db  owncloud.log

    These files are created by ownCloud, and those files now live on your Block Storage Volume. The `admin` directory is the directory for the default user, and any files you upload to the `admin` account will appear in this folder.

To complete the example, you should be able to access the ownCloud Pod via your browser. To accomplish this task, you will need to create a Service.

1.  Create a Service manifest file and copy in the following YAML:

    {{< file "owncloud-service.yaml" yaml >}}
kind: Service
apiVersion: v1
metadata:
  name: owncloud
spec:
  selector:
    app: owncloud
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: NodePort
{{</ file >}}

    {{< note >}}
The service manifest file will use the `NodePort` method to get external traffic to the ownCloud service. NodePort opens a specific port on all cluster Nodes and any traffic that is sent to this port is forwarded to the service. Kubernetes will choose the port to open on the nodes if you do not provide one in your service manifest file. It is recommended to let Kubernetes handle the assignment. Kubernetes will choose a port in the default range, `30000-32767`.

Alternatively, you could use the `LoadBalancer` service type, instead of NodePort, which will create Linode NodeBalancers that will direct traffic to the ownCloud Pods. Linode's Cloud Controller Manager (CCM) is responsible for provisioning the Linode NodeBalancers. For more details, see the [Kubernetes Cloud Controller Manager for Linode](https://github.com/linode/linode-cloud-controller-manager/blob/master/README.md) repository.
    {{</ note >}}

1.  Create the service in Kubernetes by using the `create` command and passing in the `owncloud-service.yaml` file you created in the previous step:

        kubectl create -f owncloud-service.yaml

1.  To retrieve the port that the ownCloud Pod is listening on, use the `describe` command on the newly created Service:

        kubectl describe service owncloud

    You should see output like the following:

        Name:                     owncloud
        Namespace:                default
        Labels:                   <none>
        Annotations:              <none>
        Selector:                 app=owncloud
        Type:                     NodePort
        IP:                       10.106.101.155
        Port:                     <unset>  80/TCP
        TargetPort:               8080/TCP
        NodePort:                 <unset>  30068/TCP
        Endpoints:                10.244.1.17:8080
        Session Affinity:         None
        External Traffic Policy:  Cluster
        Events:                   <none>

    Find the `NodePort`. In this example the port is `30068`.

1.  Now you need to find out which Node your Pod is running on. Use the `describe` command on the Pod to find the IP address of the Node:

        kubectl describe pod owncloud

    You should see output like the following:

        Name:               owncloud
        Namespace:          default
        Priority:           0
        PriorityClassName:  <none>
        Node:               kube-node/192.0.2.155
        Start Time:         Mon, 22 Apr 2019 17:07:20 +0000
        Labels:             app=owncloud
        Annotations:        <none>
        Status:             Running
        IP:                 10.244.1.17

    The IP address of the Node in this example is `192.0.2.155`. Your ownCloud Pod in this example would be accessible from `http://192.9.2.155:30068`.

1.  Navigate to the URL of the Node, including the NodePort you looked up in a previous step. You will be presented with the ownCloud log in page. You can log in with the username `admin` and the password `admin`.

1.  Upload a file. You will use this file to test the Persistent Volume Claim.

1.  The Persistent Storage Claim has been created and is using your Block Storage Volume. To prove this point, you can delete the ownCloud Pod and recreate it, and the Persistent Storage Claim will continue to house your data:

        kubectl delete pod owncloud

        kubectl create -f owncloud-pod.yaml

    Once the Pod has finished provisioning you can log back in to ownCloud and view the file you previously uploaded.

You have successfully
You have successfully created a Block Storage Volume tied to a Persistent Volume Claim and have mounted it with a container in a Pod.

## Delete a Persistent Volume Claim

To delete the Block Storage volume created in this guide:

1. First, delete the ownCloud Pod:

        kubectl delete pods owncloud

1.  Then, delete the persistent volume claim:

        kubectl delete pvc pvc-example

