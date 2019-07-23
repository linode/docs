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
The Linode Kubernetes Engine (LKE) is currently in a closed early access Beta, and you may not have access to LKE through the Cloud Manager or other tools. To gain access to the Early Access Program (EAP), open up a Customer Support ticket noting that you'd like to be included in the program, or email lke@linode.com -- Beta access is completely free.

Additionally, because LKE is in Beta, there may be breaking changes to how you access and manage LKE. This guide will be updated to reflect these changes if and when they occur.
{{< /note >}}

What is the LKE.

{{< caution >}}
This guide's example instructions will create several billable resources on your Linode account. If you do not want to keep using the example cluster that you create, be sure to [remove it](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#delete-a-cluster) when you have finished the guide.

If you remove the resources afterward, you will only be billed for the hour(s) that the resources were present on your account.
{{< /caution >}}

In this guide you will Learn:

 - [How to deploy a Kubernetes cluster using the Linode Kubernetes Engine.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#create-a-cluster)

 - [How to modify your cluster.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#modify-a-cluster)

 - [How to delete your cluster.](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#delete-a-cluster)

## Before You Begin

Kubernetes ...
Clusters...

## Create a Cluster

1.  Log into your [Linode Cloud Manager](https://cloud.linode.com/) account.

    {{< note >}}
LKE is not available in the Linode Classic Manager
{{< /note >}}

1.  From the Linode dashboard, click the **Create** button in the top left-hand side of the screen and select **Kubernetes** from the dropdown menu. The Create a Kubernetes Cluster screen will appear.

    ![Create a Kubernetes Cluster Screen](X.png "Create a Kubernetes Cluster screen.")

  - Select a region.

  - Add the type and size of Linodes for the pool.

  - Input the number of nodes in the textbox; you can also use the arrow keys to increment or decrement this number.

  - You can add multiple pools to your cluster. For example, you can add a Dedicated 4GB CPU and then a group of three 3GB Standard Linodes by clicking the **Add Node Pool** button between each selection.

    ![Kubernetes Cluster Creation Add Nodes](X.png "Kubernetes cluster creation add nodes.")

1.  As you add nodes and node pools, a summary appears in the **Details** panel to the right with a total monthly price estimate.

    ![Kubernetes Cluster Creation Detail Summary](X.png "Kubernetes cluster creation detail summary.")

1.  A list of pools also appears below the **Add Node Pool** button with quick edit **Node Count** fields. You can easily change the number of nodes by typing a new number in the field or use the up and down arrows to increment or decrement the number in the field. Each row in this table also has a **Remove** link if you want to remove the node pool.

    ![Kubernetes Cluster Add Node Pool List Quick Edit](X.png "Kubernetes cluster add node pool list quick edit.")

1.  Give your cluster a label, select a version of Kubernetes for this cluster, and add or select any tags that you wish. Tags are optional.

    ![Kubernetes Cluster Creation Add Details](X.png "Kubernetes cluster creation add details.")

1.  When you are satisfied with the configuration of your cluster, click the **Create** button on the right. The Kubernetes detail page will appear. You will see your cluster listed.

    ![Kubernetes Create Cluster Details Listed](X.png "Kubernetes cluster creation details listed on right side panel.")

1.  Click the *cluster label* for the cluster you just created.

    ![Kubernetes Cluster Listing](X.png "Kubernetes cluster listing.")

    On the Details panel to the right, you will see the details of your cluster including:

   - The version of Kubernetes,

   - How much RAM,

   - How many cores,

   - The API Endpoint,

   - The datacenter region,

   - And the estimated monthly pricing.

1. Click the **Linodes** link in the sidebar. The Linodes detail page will appear. You will see all the nodes in your cluster listed as individual servers. (Or are they grouped in a Kubernetes Cluster panel? This is how it appears in the slides)

    ![Kubernetes Cluster Details](X.png "Kubernetes cluster details.")

### kubeconfig

Anytime after your cluster is created you can download the `kubeconfig.yaml` file. This is a yaml file that will allow you to use [kubectl](/docs/applications/containers/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/#install-kubectl) to communicate with your cluster. Here is an example `kubeconfig` file:

{{< file "kubeconfig.yaml" yaml >}}
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: LS0tLS1CRUdJTiBDR...
    server: https://207.192.68.14:6443
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
    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSU...
    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFUR...
{{< /file >}}

This configuration file defines the cluster, users, and contexts.

For more information about using kubectl and configuration files see the official [Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

1.  From the Kubernetes page, click the more options ellipsis to the right of the cluster you wish to download the `kubeconfig` file for.

    ![Kubernetes Cluster More Options from Cluster List](X.png "Kubernetes cluster more options from cluster list.")

1.  Select *Download kubeconfig*. The file will be saved to your `Downloads` folder.

    ![Kubernetes Cluster Download kubeconfig from More Options](X.png "Kubernetes cluster download kubeconfig from more options.")

1.  You can also download the `kubeconfig` from the Kubernetes cluster detail page. Click the **Download kubeconfig** button in the upper right hand corner. The file will be saved to your `Downloads` folder.

    ![Kubernetes Cluster Download kubeconfig from Detail Page](X.png "Kubernetes cluster download kubeconfig from detail page.")

## Modify a Cluster

1.  Click the **Kubernetes** link in the sidebar. The Kubernetes detail page will appear and you will see all your clusters listed.

    ![Kubernetes Cluster Listing](X.png "Kubernetes cluster listing.")

1.  Click the cluster that you wish to modify. The Kubernetes cluster detail page will appear.

    ![Kubernetes Cluster Details](X.png "Kubernetes cluster details.")

### Edit or Remove Existing Node Pools

1.  Click the **Edit** button at the upper right corner of the **Node Pools** panel.

    ![Kubernetes Cluster Editing Node Pools](X.png "Kubernetes cluster editing node pools.")

 - The **Node Count** fields are now editable text boxes.

 - To remove a node pool, click the **Remove** link to the right.

 - As you make changes you will see an Updated Monthly Estimate; contrast this to the current Monthly pricing on the right.

    ![Kubernetes Cluster Editing Updated Pricing](X.png "Kubernetes cluster editing updated monthly estimate.")

1.  Click the **Save** button to save your changes; click the **Clear Changes** button to revert back to the cluster state before you started editing; or click the **Cancel** button to cancel editing.

### Add Node Pools

1.  In the **Add Node Pools** panel select they type and size of Linodes you want to add to your pool. Input the number in the textbox; you can also use the arrow keys to increment or decrement this number. Click the **Add Node Pool** button.

    ![Kubernetes Cluster Editing Add Nodes](X.png "Kubernetes cluster editing add nodes.")

1.  The new node pool appears in the Node Pools list which you can now edit.

    ![Kubernetes Cluster New Node Pool Created](X.png "Kubernetes cluster new node pool created.")

1.  Add any other node pools and [edit existing node pools](/docs/applications/containers/kubernetes/how-to-deploy-a-cluster-with-lke/#edit-or-remove-existing-node-pools).

1.  Click the **Save** button to save your changes; click the **Clear Changes** button to revert back to the cluster state before you started editing; or click the **Cancel** button to cancel editing.

### Add and Remove Tags

At anytime you can add tags to a cluster.

1.  In the **Cluster Tags** panel on the right, click the **Add New Tag** link.

    ![Kubernetes Cluster Tags Panel](X.png "Kubernetes cluster tags panel")

1.  Select existing tags from the dropdown; or create a new one by typing into the text field, then clicking *Create "new-tag"*, where "new-tag" is the text you entered.

    ![Kubernetes Cluster Tags Dropdown](X.png "Kubernetes cluster tags dropdown.")

1.  The tag appears in the Cluster Tag panel.

    ![Kubernetes Cluster Added Tag in Tag Panel](X.png "Kubernetes cluster added tag in tag panel")

1.  You can remove a tag by clicking on the `x` to the right of the tag name.

## Delete a Cluster

1.  Click the Kubernetes link in the sidebar. The Kubernetes detail page will appear and you will see all your clusters listed.

    ![Kubernetes Page](X.png "Kubernetes page showing cluster list.")

1.  Click the cluster that you wish to delete. The Kubernetes cluster detail page will appear.

    ![Kubernetes Cluster Detail Page](X.png "Kubernetes cluster detail page showing cluster details.")

1.  Click the Delete Cluster button at the bottom of the page.

    ![Kubernetes Delete Button](X.png "Kubernetes delete button on cluster detail page.")

1.  A confirmation pop-up will appear. Click the Delete button to confirm.

    ![Kubernetes Delete Confirmation Dialog](X.png "Kubernetes delete confirmation dialog.")

1.  The Kubernetes page will appear. If you have any clusters they will be listed, if not, you can create a cluster.

## Next Steps

 - [How to Support a Static Site with Linode Kubernetes Engine]()
 - [Create and Deploy a Docker Container Image to a Kubernetes Cluster]()
 - [Troubleshooting Kubernetes Guide]()
 - [See all our Kubernetes guides]()