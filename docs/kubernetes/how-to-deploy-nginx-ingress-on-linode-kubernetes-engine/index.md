---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to deploy NGINX Ingress Controller on LKE. After creating a cluster on LKE, this guide will walk through how to: deploy the NGINX Ingress Controller on your Linode Kubernetes Engine.'
og_description: 'Learn how to deploy NGINX Ingress Controller on LKE. After creating a cluster on LKE, this guide will walk through how to: deploy the NGINX Ingress Controller on your Linode Kubernetes Engine.'
keywords: ['kubernetes','kubernetes tutorial','lke','linode kubernetes engine', 'ingress','nginx']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified_by:
  name: Linode
title: "How to Deploy NGINX Ingress on Linode Kubernetes Engine"
h1_title: "Deploy NGINX Ingress on Linode Kubernetes Engine"
contributor:
  name: Linode
external_resources:
- '[Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)'
---

What is Ingress
Why do you need Ingress
Why NGINX Ingress

{{< note >}}
Linode Kubernetes Engine (LKE) is currently in Private Beta, and you may not have access to LKE through the Cloud Manager or other tools. To request access to the Private Beta, [sign up here](https://welcome.linode.com/lkebeta/). Beta access awards you $100/month in free credits for the duration of the beta, which is automatically applied to your account when an LKE cluster is in use. Additionally, you will have access to the `Linode Green Light` community, a new program connecting beta users with our product and engineering teams.

Because LKE is in Beta, there may be breaking changes to how you access and manage LKE. This guide will be updated to reflect these changes if and when they occur.
{{< /note >}}

*Linode Kubernetes Engine (LKE)* allows you to easily create, scale, and manage Kubernetes clusters to meet your application's demands, reducing the often complicated cluster set-up process to just a few clicks. Linode manages your Kubernetes master node, and you select how many Linodes you want to add as worker nodes to your cluster.

{{< caution >}}
Following the instructions in this guide will create billable resources on your account in the form of Linodes and NodeBalancers. You will be billed an hourly rate for the time that these resources exist on your account. Be sure to follow the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) at the end of this guide if you do not wish to continue using these resources.
{{</ caution >}}

## In this Guide

This guide will show you how to:



## Before You Begin

- You should have a working knowledge of Kubernetes' key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) series.

- You will also need to prepare your workstation with some prerequisite software:

    - [Install kubectl](#install-kubectl) (your client's version should be at least 1.13)
    - [Install Git](#install-git)

- Finally, you will need to create a cluster on LKE, if you do not already have one:

    - To create a cluster in the Linode Cloud Manager, review the [Deploy a Cluster with Linode Kubernetes Engine](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) guide.

        {{< note >}}
Specifically, follow the [Create an LKE Cluster](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#create-an-lke-cluster) and [Connect to your LKE Cluster with kubectl](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#connect-to-your-lke-cluster-with-kubectl) sections.
{{< /note >}}

    - To create a cluster from the Linode API, review the [Deploy and Manage a Cluster with Linode Kubernetes Engine and the Linode API](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/) tutorial.

        {{< note >}}
Specifically, follow the [Create an LKE Cluster](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/#create-an-lke-cluster) section.
{{< /note >}}

### Install kubectl

You should have `kubectl` installed on your local workstation. `kubectl` is the command line interface for Kubernetes, and allows you to remotely connect to your Kubernetes cluster to perform tasks.

{{< content "how-to-install-kubectl" >}}

### Install Git

To perform some of the commands in this guide you will need to have Git installed on your workstation. Git is a version control system that allows you to save your codebase in various states to ease development and deployment. Follow our [How to Install Git on Linux, Mac or Windows](/docs/development/version-control/how-to-install-git-on-linux-mac-and-windows/) guide for instructions on how to install Git.

## Install NGINX Ingress Controller

There are two ways to install the Ingress Controller, with manifests or with Helm.

### Install with Manifests

This method uses git to pull the Ingress Controller from dockerhub. This will allow you full access to the configuration files so that you can customize your deployment. There are farster approaches to deploying this ingress controller but you would lose the ability for customization.

1.  Clone the repository from github:

        git clone https://github.com/nginxinc/kubernetes-ingress/

1.  Checkout the latest version; update the version to the latest:

        git checkout v1.6.3

1.  Change into the deployments directory:

        cd kubernetes-ingress/deployments

1.  Configure RBAC:

        kubectl apply -f common/ns-and-sa.yaml

    {{< output >}}
namespace/nginx-ingress created
serviceaccount/nginx-ingress created
{{</ output >}}

		kubectl apply -f rbac/rbac.yaml

    {{< output >}}
clusterrole.rbac.authorization.k8s.io/nginx-ingress created
clusterrolebinding.rbac.authorization.k8s.io/nginx-ingress created
{{</ output >}}

1.   apply secret TLS certificate - update this file first with the certificate? Can this be a lets encrypt?

        kubectl apply -f common/default-server-secret.yaml

    {{< output >}}
secret/default-server-secret created
{{</ output >}}

1.  config map - what kind of custom settings does this need?

        kubectl apply -f common/nginx-config.yaml

    {{< output >}}
configmap/nginx-config created
{{</ output >}}

1.  create a CRD

        kubectl apply -f common/custom-resource-definitions.yaml

    {{< output >}}
customresourcedefinition.apiextensions.k8s.io/virtualservers.k8s.nginx.org created
customresourcedefinition.apiextensions.k8s.io/virtualserverroutes.k8s.nginx.org created
{{</ output >}}

1.  Now you have the option of creating a deployment or a daemonset. Use a Deployment if you plan to dynamically change the number of Ingress controller replicas. Use a DaemonSet for deploying the Ingress controller on every node or a subset of nodes.

    1. For a deployment:

            kubectl apply -f deployment/nginx-ingress.yaml

    1.  For a daemonset:

            kubectl apply -f daemon-set/nginx-ingress.yaml

1.  Check that it's running:

        kubectl get pods —namespace=nginx-ingress

    {{< output >}}
NAME                             READY   STATUS    RESTARTS   AGE
nginx-ingress-57cdc75bdb-n8ph5   1/1     Running   0          13s
{{</ output >}}

### Access The Ingress Conroller

Now that your Ingress Controller is up and running, you need to access it.

#### Access for Daemon Set

If you chose to create a daemon set, ports 80 and 443 of the Ingress controller container are mapped to the same ports of the node where the container is running. To access the Ingress controller, use those ports and an IP address of any node of the cluster where the Ingress controller is running.

#### Access for Deployment

1.  Create a Nodeport service:

        kubectl create -f service/nodeport.yaml

    {{< output >}}
service/nginx-ingress created
{{</ output >}}

1.  Kubernetes will randomly allocate two ports on every node of the cluster. To access the Ingress controller, use an IP address of any node of the cluster along with the two allocated ports.

1.  Create a loadbalancer service:

        kubectl apply -f service/loadbalancer.yaml

    {{< output >}}
Warning: kubectl apply should be used on resource created by either kubectl create --save-config or kubectl apply
service/nginx-ingress configured
{{</ output >}}

1.  Get the IP Address of the loadbalancer:

        kubectl get svc -A -owide

    {{< output >}}
NAMESPACE       NAME            TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE   SELECTOR
default         kubernetes      ClusterIP      10.128.0.1       <none>         443/TCP                      31d   <none>
kube-system     kube-dns        ClusterIP      10.128.0.10      <none>         53/UDP,53/TCP,9153/TCP       31d   k8s-app=kube-dns
nginx-ingress   nginx-ingress   LoadBalancer   10.128.236.245   45.79.62.128   80:30625/TCP,443:32654/TCP   27m   app=nginx-ingress
{{</ output >}}

### Install with Helm

## Next Steps

If you'd like to continue using the static site that you created in this guide, you may want to assign a domain to it. Review the [DNS Records: An Introduction](/docs/networking/dns/dns-records-an-introduction/) and [DNS Manager](/docs/platform/manager/dns-manager/) guides for help with setting up DNS. When setting up your DNS record, use the external IP address that you noted at the end of the previous section.

If you would rather not continue using the cluster you just created, review the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) to remove the billable Linode resources that were generated.

## Tear Down your LKE Cluster and NodeBalancer

- To remove the NodeBalancer you created, all you need to do is delete the underlying Service. From your workstation:

        kubectl delete service static-site-service

    Alternatively, you can use the manifest file you created to delete the Service. From your workstation:

        kubectl delete -f static-site-service.yaml

-   To remove the LKE Cluster and the associated nodes from your account, navigate to the [Linode Cloud Manager](https://cloud.linode.com):

    1.  Click on the **Kubernetes** link in the sidebar. A new page with a table which lists your clusters will appear.

    1.  Click on the **more options elipsis** next to the cluster you would like to delete, and select **Delete**.

    1.  You will be prompted to enter the name of the cluster to confirm the action. Enter the cluster name and click **Delete**.

-  Lastly, remove the `KUBECONFIG` line you added to your Bash profile to remove the LKE cluster from your [available contexts](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#persist-the-kubeconfig-context).
