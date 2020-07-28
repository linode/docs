---
title: Jump Start
description: "The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and simple pricing with the infrastructure efficiency of Kubernetes. When you deploy an LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), NodeBalancers (load balancers), and Block Storage Volumes. Your LKE cluster’s Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers."
tab_group_main:
    weight: 20
---

## Install kubectl

**macOS:**

Install via [Homebrew](https://brew.sh):

      brew install kubernetes-cli

**Linux:**

1.  Download the latest kubectl release:

      curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl

1.  Make the downloaded file executable:

      chmod +x ./kubectl

1.  Move the command into your PATH:

      sudo mv ./kubectl /usr/local/bin/kubectl

**Windows:**

Visit the [Kubernetes documentation](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-windows) for a link to the most recent Windows release.

### Create an LKE Cluster

1.  Log into your [Linode Cloud Manager](https://cloud.linode.com/) account.

1.  From the Linode dashboard, click the **Create** button in the top right-hand side of the screen and select **Kubernetes** from the dropdown menu.

1. The **Create a Kubernetes Cluster** page will appear. At the top of the page, you'll be required to select the following options:

  - In the **Cluster Label** field, provide a name for your cluster. The name must be unique between all of the clusters on your account. This name will be how you identify your cluster in the Cloud Manager’s Dashboard.

  - From the **Region** dropdown menu, select the **Region** where you would like your cluster to reside.

  - From the **Version** dropdown menu, select a Kubernetes version to deploy to your cluster.

1. In the **Add Node Pools** section, select the [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions) for the Linode worker node(s) that make up your LKE cluster. To the right of each plan, select the plus `+` and minus `-` to add or remove a Linode to a node pool one at time.

1.  Once you're satisfied with the number of nodes in a node pool, select **Add** to include it in your configuration. If you decide that you need more or fewer hardware resources after you deploy your cluster, you can always [edit your Node Pool](#edit-or-remove-existing-node-pools).

1. Once a pool has been added to your configuration, you will see it listed in the **Cluster Summary** on the right-hand side of the Cloud Manager detailing your cluster's hardware resources and monthly cost. Additional pools can be added before finalizing the cluster creation process by repeating the previous step for each additional pool.

1. When you are satisfied with the configuration of your cluster, click the **Create Cluster** button on the right hand side of the screen. Your cluster's detail page will appear on the following page where you will see your Node Pools listed. From this page, you can [edit your existing Node Pools](#edit-or-remove-existing-node-pools), [access your Kubeconfig file](#access-and-download-your-kubeconfig), and view an overview of your cluster's resource details.

### Access and Download your kubeconfig

1. To access your cluster's kubeconfig, log into your Cloud Manager account and navigate to the **Kubernetes** section.

1. From the Kubernetes listing page, click on your cluster's **more options ellipsis** and select **Download kubeconfig**. The file will be saved to your computer's `Downloads` folder.

1. Open a terminal shell and save your kubeconfig file's path to the `$KUBECONFIG` environment variable. In the example command, the kubeconfig file is located in the `Downloads` folder, but you should alter this line with this folder's location on your computer:

        export KUBECONFIG=~/Downloads/kubeconfig.yaml

1. View your cluster's nodes using kubectl.

        kubectl get nodes
