---
author:
  name: Linode Community
  email: docs@linode.com
description: 'This guide provides a simple working Kubernetes Deployment example to show you how to add and configure Linode NodeBalancers to expose a Service externally. You will create a Deployment running three NGINX Pods and a Service that will expose those pods to the internet over HTTPS.'
og_description:  'This guide provides a simple working Kubernetes Deployment example to show you how to add and configure Linode NodeBalancers to expose a Service externally. You will create a Deployment running three NGINX Pods and a Service that will expose those pods to the internet over HTTPS.'
keywords: ['load balancers','kubernetes','pods','cloud controller manager']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-17
modified_by:
  name: Linode
title: "How to Add and Configure Linode NodeBalancers on your Kubernetes Cluster"
h1_title: "How to Add and Configure Linode NodeBalancers on your Kubernetes Cluster"
contributor:
  name: Linode
---
This guide will show you how to add Linode NodeBalancers with TLS termination over HTTPS to a Kubernetes Service manifest file. It will use a simple Kubernetes deployment that runs three Pods with NGINX installed as its example. This guide is meant to provide you with a working example of the steps and concepts outlined in the [A Tutorial for Adding NodeBalancers to a Linode Kubernetes Engine (LKE) Cluster](/docs/kubernetes/how-to-add-nodebalancers-to-linode-kubernetes-engine-clusters/#configuring-your-linode-nodebalancers-with-annotations).

### Before you Begin

1. Review the [A Tutorial for Adding NodeBalancers to a Linode Kubernetes Engine (LKE) Cluster](#configuring-your-linode-nodebalancers-with-annotations) guide for an introduction to using Linode NodeBalancers on a Kubernetes cluster.

1. This guide assumes that your Kubernetes cluster has the Linode Cloud Controller Manager (CCM) installed on your Kubernetes cluster. The Linode CCM is installed by default on clusters deployed with the [Linode Kubernetes Engine](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/) and the [Linode Terraform K8s module](http://localhost:1313/docs/applications/configuration-management/terraform/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/).

    To learn how to install the Linode CCM on a cluster that was not installed in the two ways mentioned above, see the [Installing the Linode CCM on an Unmanaged Kubernetes Cluster](/docs/kubernetes/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/) guide.

## Adding NodeBalancers to an LKE Cluster Running NGINX

In this section, you will create a Deployment that creates three NGINX Pods, and then create a Service to expose those Pods to the internet over HTTPS.

1.  Create a Deployment manifest describing the desired state of the three replica NGINX containers:

    {{< file "nginx-deployment.yaml" yaml >}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
        ports:
        - containerPort: 80
{{</ file >}}

1.  Use the `create` command to apply the manifest:

        kubectl create -f nginx-deployment.yaml

1.  Create a Service for the Deployment:

    {{< file "nginx-service.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-default-protocol: https
    service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
    service.beta.kubernetes.io/linode-loadbalancer-port-443: '{ "tls-secret-name": "my-secret",
      "protocol": "https" }'
  labels:
    app: nginx
  name: nginx-service
spec:
  type: LoadBalancer
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  sessionAffinity: None
    {{</ file >}}

    The above Service manifest includes a few key concepts.

      - The first is the `spec.type` of `LoadBalancer`. The `LoadBalancer` type is responsible for telling LKE to create a Linode NodeBalancer, and will provide the Deployment it services a public facing IP address with which to access the NGINX Pods.
      - There is additional information being passed to the CCM in the form of metadata annotations (`service.beta.kubernetes.io/linode-loadbalancer-throttle` in the example above). See the [Configuring your Linode NodeBalancers with Annotations](#configuring-your-linode-nodebalancers-with-annotations) section for details on all available annotations.

1.  Use the `create` command to create the Service, and in turn, the NodeBalancer:

        kubectl create -f nginx-service.yaml

    To view your newly created NodeBalancer's, see the View [Linode NodeBalancer Details](#view-linode-nodebalancer-details) section of the guide.
