---
slug: deploy-nginx-ingress-on-lke
description: "Learn how to deploy an NGINX Ingress Controller on an LKE Kubernetes Cluster"
keywords: ['kubernetes','kubernetes tutorial','lke','linode kubernetes engine', 'ingress','nginx']
tags: ["nginx","networking","linode platform","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified: 2023-03-14
modified_by:
  name: Linode
title: "Deploying NGINX Ingress on Linode Kubernetes Engine"
title_meta: "How to Deploy NGINX Ingress on Linode Kubernetes Engine"
image: nginx-ingress.png
external_resources:
- '[Install and Set Up kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/)'
aliases: ['/kubernetes/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/','/guides/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/']
authors: ["Linode"]
---

In Kubernetes, an **Ingress** is an API object that manages the routing of external requests to one of the many possible internal services in a Kubernetes cluster. In the majority of cases, the Ingress will rely on an external Load Balancer to accept initial traffic before being routed.

An Ingress is one of the most powerful ways to control external access to your resources, granting the ability to add multiple services under the same IP address, and use plugins like [cert-manager](https://github.com/jetstack/cert-manager) to assist with the management of SSL/TLS certificates.

*Linode Kubernetes Engine (LKE)* allows you to easily create, scale, and manage Kubernetes clusters to meet your application's demands, reducing the often complicated cluster set-up process to just a few clicks. Linode manages your Kubernetes master node, and you select how many Linodes you want to add as worker nodes to your cluster.

{{< note >}}
Following the instructions in this guide will create billable resources on your account in the form of Linodes and NodeBalancers. You will be billed an hourly rate for the time that these resources exist on your account. Be sure to follow the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) at the end of this guide if you do not wish to continue using these resources.
{{< /note >}}

## In This Guide

This guide will show you how to:

- Use [HELM](https://helm.sh/) to install an NGINX Ingress Controller.
- Create two instances of sample application Deployments to create two separate mock websites on a single Kubernetes cluster served over port 80.
- Create an Ingress and a NodeBalancer to route traffic from the internet to Kubernetes Services.

## Before You Begin

1. Review the [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) series to gain an understanding of key concepts within Kubernetes, including master and worker nodes, Pods, Deployments, and Services.

1. Purchase a domain name from a reliable domain registrar. In a later section, you will use Linode's DNS Manager to [create a new Domain](/docs/products/networking/dns-manager/guides/create-domain/) and to [add a DNS "A" record](/docs/products/networking/dns-manager/guides/manage-dns-records/) for two subdomains: one named `blog` and another named `shop`. Your subdomains will point to the example Kubernetes Services you will create in this guide. The example domain names used throughout this guide are `blog.example.com` and `shop.example.com`.

    {{< note >}}
    Optionally, you can create a Wildcard DNS record, `*.example.com` and point your NodeBalancer's external IP address to it. Using a Wildcard DNS record, will allow you to expose your Kubernetes services without requiring further configuration using the Linode DNS Manager.
    {{< /note >}}

## Creating and Connecting to a Kubernetes Cluster

1. **Create a Kubernetes cluster** through the [Linode Kubernetes Engine](https://www.linode.com/products/kubernetes/) (LKE) using either the Cloud Manager, the Linode API, or Terraform:

    - [Cloud Manager LKE instructions](/docs/products/compute/kubernetes/)
    - [Linode API LKE instructions](/docs/products/compute/kubernetes/guides/deploy-and-manage-cluster-with-the-linode-api/)
    - [Terraform instructions](/docs/products/compute/kubernetes/guides/deploy-cluster-using-terraform/)

    You can also use an unmanaged Kubernetes cluster (that's not deployed through LKE). The instructions within this guide depend on the Linode Cloud Controller Manager (CCM), which is installed by default on LKE clusters but needs to be manually installed on unmanaged clusters. To learn how to install the Linode CCM on a cluster that was not deployed through LKE, see the [Installing the Linode CCM on an Unmanaged Kubernetes Cluster](/docs/guides/install-the-linode-ccm-on-unmanaged-kubernetes/) guide.

1. **Setup your local environment** by installing [Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm) and [kubectl](/docs/products/compute/kubernetes/guides/kubectl/) on your computer (or whichever system you intend to use to manage your Kubernetes Cluster).

1. **Configure kubectl** to use the new Kubernetes cluster by downloading the kubeconfig YAML file and adding it to kubectl. See the instructions within the [Download Your kubeconfig](/docs/products/compute/kubernetes/guides/kubectl/) guide.

## Creating a Sample Application

In order to be able to confirm that the NGINX Ingress you create is working as expected in later steps, deploy a sample application which will confirm the connection to your backend Services. Our application will be built from an official NGINX [Docker image](https://hub.docker.com/r/nginxdemos/hello/), though this application can be replaced with any you prefer.

### Configure and Create the Deployment

Wherever you've installed `kubectl`, create two `yaml` manifest files using a text editor of your choice. These manifests will be responsible for creating our Deployments their associated Services. The Deployments will be called `hello-one` and `hello-two` respectively, and will be replicated three times each:

1. Using a text editor, create a new file named `hello-one.yaml` with the contents of the example file.

    ```file {title="hello-one.yaml" lang="yaml"}
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
    ```

1. Create a second Service and Deployment manifest file named `hello-two.yaml` with the contents of the example file.

    ```file {title="hello-two.yaml" lang="yaml"}
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
    ```

1. Use kubectl to create the Services and Deployments for your example applications.

    ```command
    kubectl create -f hello-one.yaml
    kubectl create -f hello-two.yaml
    ```

    You should see a similar output:

    ```output
    service/hello-one created
    deployment.apps/hello-one created
    service/hello-two created
    deployment.apps/hello-two created
    ```

1. Verify that the Services are running.

    ```command
    kubectl get svc
    ```

    You should see a similar output:

    ```output
    NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
    hello-one    ClusterIP   10.128.94.166    <none>        80/TCP    6s
    hello-two    ClusterIP   10.128.102.187   <none>        80/TCP    6s
    kubernetes   ClusterIP   10.128.0.1       <none>        443/TCP   18m
    ```

## Install the NGINX Ingress Controller

In this section you will use Helm to install the NGINX Ingress Controller on your Kubernetes Cluster. Installing the NGINX Ingress Controller will create Linode NodeBalancers that your cluster can make use of to load balance traffic to your example application.

1. Add the following Helm ingress-nginx repository to your Helm repos.

    ```command
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    ```

1. Update your Helm repositories.

    ```command
    helm repo update
    ```

1. Install the NGINX Ingress Controller. This installation will result in a Linode NodeBalancer being created.

    ```command
    helm install ingress-nginx ingress-nginx/ingress-nginx
    ```

    You will see a similar output:

    ```output
    NAME: ingress-nginx
    LAST DEPLOYED: Fri Apr  9 21:29:47 2021
    NAMESPACE: default
    STATUS: deployed
    REVISION: 1
    TEST SUITE: None
    NOTES:
    The ingress-nginx controller has been installed.
    It may take a few minutes for the LoadBalancer IP to be available.
    You can watch the status by running 'kubectl --namespace default get services -o wide -w ingress-nginx-controller'
    ...
    ```

## Create a Subdomain DNS Entries for your Example Applications

Now that Linode NodeBalancers have been created by the NGINX Ingress Controller, you can point a subdomain DNS entries to the NodeBalancer's public IPv4 address. Since this guide uses two example applications, it will require two subdomain entries.

1. Access your NodeBalancer's assigned external IP address.

    ```command
    kubectl --namespace default get services -o wide -w ingress-nginx-controller
    ```

    The command will return a similar output:

    ```output
    NAME                          TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)                      AGE     SELECTOR
    my-ingress-nginx-controller   LoadBalancer   10.128.169.60   192.0.2.0   80:32401/TCP,443:30830/TCP   7h51m   app.kubernetes.io/instance=cingress-nginx,app.kubernetes.io/name=ingress-nginx
    ```

1. Copy the IP address of the `EXTERNAL IP` field and navigate to [Linode's DNS manager](https://cloud.linode.com/domains) and [add two "A" records](/docs/products/networking/dns-manager/guides/manage-dns-records/) for the `blog` and `shop` subdomains. Ensure you point each record to the NodeBalancer's IPv4 address you retrieved in the previous step.

## Configuring the Ingress Controller

Once your Ingress Controller is installed and DNS records have been created pointing to your NodeBalancer, you need to create a manifest file to create a new Ingress resource. This resource will define how traffic coming from the LoadBalancer service we deployed earlier is handled. In this case, NGINX will accept these connections over port 80, diverting traffic to both of our services via their `hostname` or domain names:

1. Create an Ingress resource manifest file named `my-new-ingress.yaml`.

    ```file {title="my-new-ingress.yaml" lang="yaml"}
    apiVersion: networking.k8s.io/v1
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
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: hello-one
                port:
                  number: 80
      - host: shop.example.com
        http:
          paths:
          - pathType: Prefix
            path: "/"
            backend:
              service:
                name: hello-two
                port:
                  number: 80
    ```

1. Create the Ingress resource using the following command:

    ```command
    kubectl create -f my-new-ingress.yaml
    ```

1. Once the Ingress has been created, try accessing your subdomains from a browser. As a reminder, this example uses `blog.example.com` and `shop.example.com`. Each time you navigate to the page, you'll see one of three different instances of the replicated server as the active node is rotated. While the application has been deployed to the same cluster, at no point will `blog.example.com` display the same three hostnames as `shop.example.com`, as all requests are being routed correctly.

    ![Screenshot of the web browser displaying an NGINX website](ingress-complete.png "Successful NGINX website")

## Next Steps

If you would like to secure your site with TLS encryption, you can follow the [Getting Started with Load Balancing on a Linode Kubernetes Engine (LKE) Cluster](/docs/kubernetes/getting-started-with-load-balancing-on-a-lke-cluster/).

If you would rather not continue using the cluster you just created, review the [tear-down section](#tear-down-your-lke-cluster-and-nodebalancer) to remove the billable Linode resources that were generated.

## Tear Down your LKE Cluster and NodeBalancer

- To remove the NodeBalancer you created, delete the corresponding Kubernetes service using one of the commands below and then remove the NodeBalancer from your Linode account.

    ```command
    kubectl delete service nginx-ingress-controller
    ```

    Alternatively, you can use the manifest file you created to delete the Service. From your workstation:

    ```command
    kubectl delete -f my-new-ingress.yaml
    ```

    {{< note type="warning" >}}
    If you do not also remove the NodeBalancer from your Linode account, you will continue to be billed for the service. See [Manage NodeBalancers > Delete a NodeBalancer](/docs/products/networking/nodebalancers/guides/manage/#delete-a-nodebalancer) for instructions on removing the NodeBalancer in the Cloud Manager.
    {{< /note >}}

- To remove the LKE Cluster and the associated nodes from your account, follow the instructions within [Manage Kubernetes Clusters > Delete a Cluster](/docs/products/compute/kubernetes/guides/manage-clusters/#delete-a-cluster).

- Lastly, remove the `KUBECONFIG` line you added to your Bash profile to remove the LKE cluster from your [available contexts](/docs/products/compute/kubernetes/guides/kubectl/#persist-the-kubeconfig-context).
