---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Linode
  link: https://linode.com
description: 'How to deploy a cluster with Linode Kubernetes Engine.'
keywords: ["kubernetes", "linode kubernetes engine", "cluster", "lke"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-07-22
title: 'How to Deploy a Cluster with Linode Kubernetes Engine'
external_resources:
 - '[Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/)'
---
{{< note >}}
The Linode Kubernetes Engine (LKE) is currently in a closed early access Beta, and you may not have access to LKE through the Cloud Manager or other tools. To gain access to the Early Access Program (EAP), fill out the form on the [LKE Beta page](https://welcome.linode.com/lkebeta/) -- Beta access is completely free.

Additionally, because LKE is in Beta, there may be breaking changes to how you access and manage LKE. This guide will be updated to reflect these changes if and when they occur.
{{< /note >}}

## What is the Linode Kubernetes Engine (LKE)
The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and [simple pricing](https://www.linode.com/pricing/) with the infrastructure efficiency of Kubernetes. When you deploy a LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [Nodebalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers/) (load balancers), and [Block Storage](/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/) (Volumes) services. Your LKE cluster’s Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

In this guide you will Learn:

 - [How to deploy a Kubernetes cluster using the Linode Kubernetes Engine.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#create-a-cluster)

 - [How to modify your cluster.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#modify-a-cluster)

 - [How to delete your cluster.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#delete-a-cluster)

 - [Next Steps after deploying your cluster.](#next-steps)

{{< caution >}}
This guide's example instructions will create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to [remove it](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#delete-a-cluster) when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account.
{{< /caution >}}

## Create a LKE Cluster

1.  Log into your [Linode Cloud Manager](https://cloud.linode.com/) account.

    {{< note >}}
LKE is not available in the Linode Classic Manager
{{< /note >}}

1.  From the Linode dashboard, click the **Create** button in the top left-hand side of the screen and select **Kubernetes** from the dropdown menu.

    ![Create a Kubernetes Cluster Screen](create-lke-cluster.png "Create a Kubernetes Cluster screen.")

1. The **Create a Kubernetes Cluster** page will appear. Select the region where you would like your cluster to reside. In general, it's best to choose a location that's closest to you. [Use our speedtest page](https://www.linode.com/speedtest) to find the best region for your current location.

1. In the **Add Node Pools** section, select the [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions) for the Linode worker node(s) that make up your LKE cluster. If you decide that you need more or fewer hardware resources after you deploy your cluster, you can always [edit your Node Pool](#edit-or-remove-existing-node-pools).

1. Under **Number of Linodes**, input the number of Linode worker nodes you would like to add to your Node Pool. These worker nodes will have the hardware resources selected from the **Add Node Pools** section.

1. Click on the **Add Node Pool** button to add the pool to your cluster's configuration. You will see a **Cluster Summary** appear on the right-hand side of the Cloud Manager detailing your cluster's hardware resources and monthly cost.

    A list of pools also appears below the **Add Node Pool** button with quick edit **Node Count** fields. You can easily change the number of nodes by typing a new number in the field or use the up and down arrows to increment or decrement the number in the field. Each row in this table also has a **Remove** link if you want to remove the node pool.

1. In the **Cluster Label** field, provide a name for your cluster. The name must be unique between all of the clusters on your account. This name will be how you identify your cluster in the Cloud Manager’s Dashboard.

1. From the **Version** dropdown menu, select a Kubernetes version to deploy to your cluster.

1. When you are satisfied with the configuration of your cluster, click the **Create** button on the right hand side of the screen. Your cluster's detail page will appear where you will see your Node Pools listed. From this page, you can [edit your existing Node Pools](#edit-or-remove-existing-node-pools), [add new Node Pools](#add-node-pools) to your cluster, [access your Kubeconfig file](#access-and-download-your-kubeconfig), and view an overview of your cluster's resource details.

## Connect to your LKE Cluster with kubectl

After you've created your LKE cluster using the Cloud Manager, you can begin interacting with and managing your cluster by connecting to it using the kubectl client and your cluster's kubeconfig file. This section will show you how to access and download your kubeconfig file and connect your kubectl client to your cluster.

### Install kubectl

You will need to install the kubectl client to your computer before proceeding. Follow the steps corresponding to your computer's operating system.

{{< content "how-to-install-kubectl" >}}

### Access and Download your kubeconfig

Anytime after your cluster is created you can download its *kubeconfig*. The kubeconfig is a yaml file that will allow you to use kubectl to communicate with your cluster. Here is an example kubeconfig file:

{{< file "example-cluster-kubeconfig.yaml" yaml >}}
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUd...
    server: https://192.0.2.0:6443
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: kubernetes-admin
  name: kubernetes-admin@kubernetes
current-context: kubernetes-admin@kubernetes
kind: Config
preferences: {}
users:
- name: kubernetes-admin
  user:
    client-certificate-data: LS0tLS1CRUd...
    client-key-data: LS0tLS1CRUd...

{{< /file >}}

This configuration file defines your cluster, users, and contexts.

1. To access your cluster's kubeconfig, log into your Cloud Manager account and navigate to the **Kubernetes** section.

1. From the Kubernetes listing page, click on your cluster's more options ellipsis and select **Download kubeconfig**. The file will be saved to your computer's `Downloads` folder.

    ![Kubernetes Cluster More Options from Cluster List](X.png "Kubernetes cluster more options from cluster list.")

1. Open a terminal shell and save your kubeconfig file's path to the `$KUBECONFIG` environment variable. In the example command, the kubeconfig file is located in the `Downloads` folder.

        export KUBECONFIG=~/Downloads/test-create-flow-kubeconfig.yaml

    {{< note >}}
It is common practice to store your kubeconfig files in `~/.kube` directory. By default, kubectl will search for a kubeconfig file named `config` that is located in the  `~/.kube` directory. You can specify other kubeconfig files by setting the `$KUBECONFIG` environment variable, as done in the step above.
    {{</ note >}}

1. View your cluster's nodes using kubectl.

        kubectl get nodes

    {{< note >}}
If your kubectl commands are not returning the resources and information you expect, then your client may be assigned to the wrong cluster context. Visit our [Troubleshooting Kubernetes](/docs/applications/containers/kubernetes/troubleshooting-kubernetes/#troubleshooting-examples) guide to learn how to switch cluster contexts.
    {{</ note >}}

      You are now ready to manage your cluster using kubectl. For more information about using kubectl, see Kubernetes' [Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) guide. You can also refer to Kubernetes' [Configure Access to Multiple Clusters](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) guide for more information on managing multiple clusters with kubectl.

{{< disclosure-note "Downlaod and view your Kubeconfig from the cluster's detail page">}}
You can also download the `kubeconfig` from the Kubernetes cluster detail page.

1. Viewing your Kubernetes listing page, click on the cluster for which you'd like to download a kubeconfig file.

1. Viewing the cluster's detail page, under the **kubeconfig** section, click the **Download kubeconfig** button. The file will be saved to your `Downloads` folder.

    ![Kubernetes Cluster Download kubeconfig from Detail Page](X.png "Kubernetes cluster download kubeconfig from detail page.")

1. To view the contents of your kubeconfig file, click on the **View** button. A pane will appear with the contents of your cluster's kubeconfig file.
{{</ disclosure-note >}}

## Modify a Cluster's Node Pools

You can use the Linode Cloud Manager to modify a cluster's exiting Node Pools by adding or removing nodes. You can also add or remove entire Node Pools from your cluster. This section will cover completing those tasks. For any other changes to your LKE cluster, you should use kubectl.

### Access your Cluster's Detail Page

1.  Click the **Kubernetes** link in the sidebar. The Kubernetes detail page will appear and you will see all your clusters listed.

    ![Kubernetes Cluster Listing](X.png "Kubernetes cluster listing.")

1.  Click the cluster that you wish to modify. The Kubernetes cluster detail page will appear.

    ![Kubernetes Cluster Details](X.png "Kubernetes cluster details.")

### Edit or Remove Existing Node Pools

1.  Viewing your [cluster's detail page](#access-your-cluster-s-detail-page), click the **Edit** button at the upper right corner of the **Node Pools** panel.

    ![Kubernetes Cluster Editing Node Pools](X.png "Kubernetes cluster editing node pools.")

 - The **Node Count** fields are now editable text boxes.

 - To remove a node pool, click the **Remove** link to the right.

 - As you make changes you will see an **Updated Monthly Estimate**; contrast this to the current **Monthly Pricing** under the **Details** panel on the right.

    ![Kubernetes Cluster Editing Updated Pricing](X.png "Kubernetes cluster editing updated monthly estimate.")

1.  Click the **Save** button to save your changes; click the **Clear Changes** button to revert back to the cluster state before you started editing; or click the **Cancel** button to cancel editing.

### Add Node Pools

1.  Viewing your [cluster's detail page](#access-your-cluster-s-detail-page), in the **Add Node Pools** panel select they type and size of Linodes you want to add to your pool.

1. Under **Number of Linodes**, input the number of Linode worker nodes you'd like to add to the pool in the textbox; you can also use the arrow keys to increment or decrement this number. Click the **Add Node Pool** button.

    ![Kubernetes Cluster Editing Add Nodes](X.png "Kubernetes cluster editing add nodes.")

1.  The new node pool appears in the Node Pools list which you can now edit, if desired.

    ![Kubernetes Cluster New Node Pool Created](X.png "Kubernetes cluster new node pool created.")

## Delete a Cluster

 You can delete an entire cluster using the Linode Cloud Manager. These changes cannot be reverted once completed.

1.  Viewing your [cluster's detail page](#access-your-cluster-s-detail-page), click the **Delete Cluster** button at the bottom of the page.

    ![Kubernetes Delete Button](X.png "Kubernetes delete button on cluster detail page.")

1.  A confirmation pop-up will appear. Enter in your cluster's name and click the **Delete** button to confirm.

    ![Kubernetes Delete Confirmation Dialog](X.png "Kubernetes delete confirmation dialog.")

1.  The Kubernetes listing page will appear and you will no longer see your deleted cluster.

## Next Steps
Now that you have a running LKE cluster, you can refer to the following guides to learn how to start deploying a workload to your cluster:

 - [How to Support a Static Site with Linode Kubernetes Engine]()
 - [Create and Deploy a Docker Container Image to a Kubernetes Cluster](/docs/applications/containers/kubernetes/deploy-container-image-to-kubernetes/)
 - [Troubleshooting Kubernetes Guide](/docs/applications/containers/kubernetes/troubleshooting-kubernetes/)
 - [See all our Kubernetes guides](/docs/applications/containers/kubernetes/)
