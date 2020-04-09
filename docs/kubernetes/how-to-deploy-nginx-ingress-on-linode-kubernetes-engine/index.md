---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Learn how to deploy the NGINX Ingress Controller on LKE. After creating a cluster on LKE, this guide will walk through how to: deploy the NGINX Ingress Controller on your Linode Kubernetes Engine.'
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

In Kubernetes, an **Ingress** is an API object that manages the routing of external requests to one of the many possible internal services in a Kubernetes cluster. In the majority of cases, the ingress will rely on an external Load Balancer to accept initial traffic before being routed.

An ingress is one of the most powerful ways to control external access to your resources, granting the ability to add multiple services under the same IP address, and use plugins like [cert-manager](https://github.com/jetstack/cert-manager) to assist with the management of SSL/TLS certificates.

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

- Use [HELM](https://helm.sh/) to install an NGINX ingress controller.
- Create two instances of sample application deployments to create two separate mock websites on a single Kubernetes cluster served over port 80.
- Create an Ingress and a Nodebalancer to route traffic from the internet to Kubernetes services.





## Before You Begin

- You should have a working knowledge of Kubernetes' key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) series.

- You will also need to prepare your workstation with some prerequisite software:

    - [Install kubectl](#install-kubectl) (your client's version should be at least 1.13)
    - [Install Helm](#install-helm)

- Ensure that you have access to your own unique domain name. This guide requires you to create two unique subdomains. For more information on domain names, see our guide to [DNS Records](https://www.linode.com/docs/networking/dns/dns-records-an-introduction/).

- Finally, you will need to create a cluster on LKE if you do not already have one:

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

### Install Helm

To perform some of the commands in this guide you will need to have [Helm](https://helm.sh/) installed on your workstation. Helm assists with the installation and management of applications on kubernetes, and in this case will be responsible for installing the ingress controller for nginx. Follow the [Installing the Helm Client](https://www.linode.com/docs/kubernetes/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm) section of our guide on using Helm 3 to complete the installation.

## Creating a Sample Application

In order to be able to confirm that the NGINX ingress you create is working as expected in later steps, deploy a sample application which will respond with data confirming the connection to backend services. Our application will be built from an official NGINX [Docker image](https://hub.docker.com/r/nginxdemos/hello/), though this application can be replaced with any you prefer.

### Configure and Create the Deployment

Wherever you've installed `kubectl`, create two `yaml` files using a text editor of your choice. These files will be responsible for creating our deployments and an associated service for each. Each instance of the deployment will be called `hello-one` and `hello-two` respectively, and will be replicated three times each:

    sudo vim hello-one.yaml

{{< file "hello-one.yaml" >}}
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
    app: hello-ingress
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

{{< file >}}
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

    kubectl create -f hello-one.yaml
    kubectl create -f hello-two.yaml

## Install the NGINX Ingress Controller

Next, we'll use Helm to install an ingress controller. While there are a few different versions of NGINX Ingress controllers,we'll be installing the Kubernetes maintained [NGINX Ingress controller](https://github.com/kubernetes/ingress-nginx) for this guide.

    helm install nginx-ingress stable/nginx-ingress --set controller.publishService.enabled=true

Once installation is completed, your LoadBalancer will be deployed, and an external IP will be available. To find this external IP, enter the following command and note the IP address in the output under `EXTERNAL-IP`:

        kubectl get svc -A -owide

    {{< output >}}
NAMESPACE       NAME            TYPE           CLUSTER-IP       EXTERNAL-IP    PORT(S)                      AGE   SELECTOR
default         kubernetes      ClusterIP      10.128.0.1       <none>         443/TCP                      31d   <none>
kube-system     kube-dns        ClusterIP      10.128.0.10      <none>         53/UDP,53/TCP,9153/TCP       31d   k8s-app=kube-dns
nginx-ingress   nginx-ingress   LoadBalancer   10.128.236.245   45.79.62.128   80:30625/TCP,443:32654/TCP   27m   app=nginx-ingress
{{</ output >}}

#### Setup Your Domain in Cloud Manager

 To create a brief example to demonstrate how an ingress controller can divide traffic between two different subdomains and multiple replicated pods, you will need to create A records for `blog.example.com` and `shop.example.com` pointing to the NodeBalancer you created when installing your Ingress controller. In all cases in this guide, ensure that you replace `example.com` with your own unique primary domain.

### Configuring Your Ingress

  Once your ingress controller is installed and DNS records are created pointing to your NodeBalancer, you need to create a configuration file you can use to create a new ingress resource and define how traffic coming from the load balancer we deployed earlier is handled. In this case, NGINX will accept these connections over port 80, diverting traffic to both of our services via `hostname`, or domain names:

  {{< file >}}
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

Next, deploy your ingress using the following command:

  kubectl create -f my-new-ingress.yaml

Once this is completed, try accessing `blog.example.com` and `shop.example.com` through a web browser. Each time you navigate to the page, you'll see one of three different instances of the replicated server as the active node is rotated. While the application has been deployed to the same cluster, at no point will `blog.example.com` display the same three hostnames as `shop.example.com`, as all requests are being routed correctly.

## Next Steps

If you would like to secure your site with TLS encryption, try using [cert-manager](https://cert-manager.io/docs/) to easily generate and manage your certificates.

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
