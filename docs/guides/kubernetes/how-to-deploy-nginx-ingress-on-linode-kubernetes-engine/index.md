---
slug: how-to-deploy-nginx-ingress-on-linode-kubernetes-engine
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to deploy the NGINX Ingress Controller on LKE. After creating a cluster on LKE, this guide will walk through how to: deploy the NGINX Ingress Controller on your Linode Kubernetes Engine.'
og_description: 'Learn how to deploy NGINX Ingress Controller on LKE. After creating a cluster on LKE, this guide will walk through how to: deploy the NGINX Ingress Controller on your Linode Kubernetes Engine.'
keywords: ['kubernetes','kubernetes tutorial','lke','linode kubernetes engine', 'ingress','nginx']
tags: ["nginx","networking","linode platform","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified_by:
  name: Linode
title: "How to Deploy NGINX Ingress on Linode Kubernetes Engine"
h1_title: "Deploying NGINX Ingress on Linode Kubernetes Engine"
image: nginx-ingress.png
contributor:
  name: Linode
external_resources:
- '[Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)'
aliases: ['/kubernetes/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/']
---
In Kubernetes, an **Ingress** is an API object that manages the routing of external requests to one of the many possible internal services in a Kubernetes cluster. In the majority of cases, the Ingress will rely on an external Load Balancer to accept initial traffic before being routed.

An Ingress is one of the most powerful ways to control external access to your resources, granting the ability to add multiple services under the same IP address, and use plugins like [cert-manager](https://github.com/jetstack/cert-manager) to assist with the management of SSL/TLS certificates.

*Linode Kubernetes Engine (LKE)* allows you to easily create, scale, and manage Kubernetes clusters to meet your application's demands, reducing the often complicated cluster set-up process to just a few clicks. Linode manages your Kubernetes master node, and you select how many Linodes you want to add as worker nodes to your cluster.

{{< caution >}}
Following the instructions in this guide will create billable resources on your account in the form of Linodes and NodeBalancers. You will be billed an hourly rate for the time that these resources exist on your account. Be sure to follow the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) at the end of this guide if you do not wish to continue using these resources.
{{</ caution >}}

## In this Guide

This guide will show you how to:

- Use [HELM](https://helm.sh/) to install an NGINX Ingress Controller.
- Create two instances of sample application Deployments to create two separate mock websites on a single Kubernetes cluster served over port 80.
- Create an Ingress and a NodeBalancer to route traffic from the internet to Kubernetes Services.

## Before You Begin

- You should have a working knowledge of Kubernetes' key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) series.

- You will also need to prepare your workstation with some prerequisite software:

    - [Install kubectl](#install-kubectl) (your client's version should be at least 1.13)
    - [Install Helm](#install-helm)

- Ensure that you have access to your own unique domain name. This guide requires you to create two unique subdomains. For more information on domain names, see our guide on [DNS Records](https://www.linode.com/docs/networking/dns/dns-records-an-introduction/).

- Finally, you will need to create a cluster on LKE if you do not already have one:

    - To create a cluster in the Linode Cloud Manager, review the [Deploy a Cluster with Linode Kubernetes Engine](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) guide.

        {{< note >}}
Specifically, follow the [Create an LKE Cluster](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#create-an-lke-cluster) and [Connect to your LKE Cluster with kubectl](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#connect-to-your-lke-cluster-with-kubectl) sections.
{{< /note >}}

    - To create an LKE cluster from the Linode API, review the [Deploy and Manage a Cluster with Linode Kubernetes Engine and the Linode API](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/) tutorial.

        {{< note >}}
Specifically, follow the [Create an LKE Cluster](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/#create-an-lke-cluster) section.
{{< /note >}}

### Install kubectl

You should have `kubectl` installed on your local workstation. `kubectl` is the command line interface for Kubernetes, and allows you to remotely connect to your Kubernetes cluster to perform tasks.

{{< content "how-to-install-kubectl" >}}

### Install Helm

To perform some of the commands in this guide you will need to have [Helm](https://helm.sh/) installed on your workstation. Helm assists with the installation and management of applications on Kubernetes, and in this case will be responsible for installing the Ingress Controller for NGINX. Follow the [Installing the Helm Client](https://www.linode.com/docs/kubernetes/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm) section of our guide on using Helm 3 to complete the installation.

## Creating a Sample Application

In order to be able to confirm that the NGINX Ingress you create is working as expected in later steps, deploy a sample application which will confirm the connection to your backend Services. Our application will be built from an official NGINX [Docker image](https://hub.docker.com/r/nginxdemos/hello/), though this application can be replaced with any you prefer.

### Configure and Create the Deployment

Wherever you've installed `kubectl`, create two `yaml` manifest files using a text editor of your choice. These manifests will be responsible for creating our Deployments their associated Services. The Deployments will be called `hello-one` and `hello-two` respectively, and will be replicated three times each:

    sudo vim hello-one.yaml

{{< file "hello-one.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  name: hello-one
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: hello-one
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-one
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-one
  template:
    metadata:
      labels:
        app: hello-one
    spec:
      containers:
      - name: hello-ingress
        image: nginxdemos/hello
        ports:
        - containerPort: 80
{{< /file >}}

    sudo vim hello-two.yaml

{{< file "hello-two.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  name: hello-two
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 80
  selector:
    app: hello-two
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hello-two
spec:
  replicas: 3
  selector:
    matchLabels:
      app: hello-two
  template:
    metadata:
      labels:
        app: hello-two
    spec:
      containers:
      - name: hello-ingress
        image: nginxdemos/hello
        ports:
        - containerPort: 80
{{< /file >}}

Create the Deployments and Services with the `create` command:

    kubectl create -f hello-one.yaml
    kubectl create -f hello-two.yaml

## Install the NGINX Ingress Controller

Next, use Helm to install an Ingress Controller. While there are a few different versions of NGINX Ingress Controllers,this guide will be installing the Kubernetes maintained [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) for this guide.

First, add the `stable` Helm repository if you have not yet:

    helm repo add stable https://charts.helm.sh/stable

Next, install the NGINX Ingress Controller:

    helm install my-release ingress-nginx/ingress-nginx

Once installed, a LoadBalancer Service will be deployed, which creates a NodeBalancer, and an external IP address will be available. To find this external IP address, list your cluster's Services with following command and note the IP address for the `nginx-ingress-controller` in the output under `EXTERNAL-IP`. You will need this IP address for the next step.

       kubectl get svc -A -owide

{{< output >}}
NAMESPACE     NAME                            TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE    SELECTOR
default       hello-one                       ClusterIP      10.128.134.154   <none>         80/TCP                       18m    app=hello-ingress
default       hello-two                       ClusterIP      10.128.164.145   <none>         80/TCP                       18m    app=hello-two
default       kubernetes                      ClusterIP      10.128.0.1       <none>         443/TCP                      26h    <none>
default       my-release-nginx-server-nginx-controller        LoadBalancer   10.128.15.94     45.79.61.112   80:31512/TCP,443:32562/TCP   4m3s   app.kubernetes.io/component=controller,app=nginx-ingress,release=nginx-ingress
default       my-release-ingress-nginx-controller-admission   ClusterIP      10.128.211.178   <none>         443/TCP                       4m3s   app.kubernetes.io/component=default-backend,app=nginx-ingress,release=nginx-ingress
kube-system   kube-dns                        ClusterIP      10.128.0.10      <none>         53/UDP,53/TCP,9153/TCP       26h    k8s-app=kube-dns
{{</ output >}}

#### Setup Your Domain in Cloud Manager

 To create a brief example of how to demonstrate how an Ingress Controller can divide traffic between two different subdomains and multiple replicated Pods, you will need to create A records for two subdomains. This guide uses `blog.example.com` and `shop.example.com`, both pointing to the IP address of the NodeBalancer you created when installing your Ingress Controller. In the following manifest examples, be sure to replace instances of `example.com` with the domain name your have chosen to use.

### Configuring Your Ingress

Once your Ingress Controller is installed and DNS records have been created pointing to your NodeBalancer, you need to create a manifest file to create a new Ingress resource. This resource will define how traffic coming from the LoadBalancer service we deployed earlier is handled. In this case, NGINX will accept these connections over port 80, diverting traffic to both of our services via their `hostname`, or domain names:

  {{< file "my-new-ingress.yaml" yaml >}}
apiVersion: networking.k8s.io/v1beta1
kind: Ingress
metadata:
  name: my-new-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
  - host: blog.example.com
    http:
      paths:
      - backend:
          serviceName: hello-one
          servicePort: 80
  - host: shop.example.com
    http:
      paths:
      - backend:
          serviceName: hello-two
          servicePort: 80
{{< /file >}}

Next, create your Ingress using the following command:

    kubectl create -f my-new-ingress.yaml

Once the Ingress has been created, try accessing your subdomains from a browser. As a reminder, this example uses `blog.example.com` and `shop.example.com`. Each time you navigate to the page, you'll see one of three different instances of the replicated server as the active node is rotated. While the application has been deployed to the same cluster, at no point will `blog.example.com` display the same three hostnames as `shop.example.com`, as all requests are being routed correctly.

![Kubernetes on Linode](ingress-complete.png)

## Next Steps

If you would like to secure your site with TLS encryption, you can follow the [Getting Started with Load Balancing on a Linode Kubernetes Engine (LKE) Cluster](/docs/kubernetes/getting-started-with-load-balancing-on-a-lke-cluster/).

If you would rather not continue using the cluster you just created, review the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) to remove the billable Linode resources that were generated.

## Tear Down your LKE Cluster and NodeBalancer

- To remove the NodeBalancer you created, all you need to do is delete the underlying Service. From your workstation:

        kubectl delete service nginx-ingress-controller

    Alternatively, you can use the manifest file you created to delete the Service. From your workstation:

        kubectl delete -f my-new-ingress.yaml

-   To remove the LKE Cluster and the associated nodes from your account, navigate to the [Linode Cloud Manager](https://cloud.linode.com):

    1.  Click on the **Kubernetes** link in the sidebar. A new page with a table which lists your clusters will appear.

    1.  Click on the **more options elipsis** next to the cluster you would like to delete, and select **Delete**.

    1.  You will be prompted to enter the name of the cluster to confirm the action. Enter the cluster name and click **Delete**.

-  Lastly, remove the `KUBECONFIG` line you added to your Bash profile to remove the LKE cluster from your [available contexts](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/#persist-the-kubeconfig-context).
