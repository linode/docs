---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy NodeBalancers with the Linode Cloud Controller Manager.'
keywords: ['ccm','cloud','controller','manager','kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-04-25
modified: 2019-04-25
modified_by:
  name: Linode
title: "Deploy NodeBalancers with the Linode Cloud Controller Manager"
---

The Linode Cloud Controller Manager (CCM) allows Kubernetes users to deploy Linode NodeBalancers whenever creating a Service of the "LoadBalancer" type. This provides the cluster a reliable way to expose resources to the public internet. The CCM handles the creation and deletion of the NodeBalancer, and correctly identifies the Linode resources, and their networking, that the NodeBalancer will service. This guide will discuss how to use the Linode CCM.

## Before You Begin

When using the CCM, this guide suggests that you create a new Kubernetes cluster, as there are a number of issues that prevent the CCM from running on Nodes that are in the "Ready" state. Instead, for a completely automated install, this guide suggests that you use the [Linode CLI's k8s command line tooling](https://developers.linode.com/kubernetes/). The Linode CLI's k8s command line tool utilizes Terraform and SSH to fully boostrap a Kubernetes cluster on Linode, including the Linode Container Storage Interface (CSI) Driver, and the Linode CCM.

## Apply the Linode CCM

## Using the Linode CCM

For this example, you create a Deployment that deploys three Drupal containers, and then create a NodeBalancer for those pods using the Linode CCM.

1.  Create a Deployment manifest:

    {{< file "drupal-deployment.yaml" yaml >}}
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

1.  Create a Service for the Deployment:

    {{< file "drupal-service.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
  labels:
    app: nginx
spec:
  type: LoadBalancer
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  sessionAffinity: None
{{</ file >}}

The above Service manifest includes a few important key concepts. The first is the `spec.type` of `LoadBalancer`. This LoadBalancer type is what is responsible for telling the Linode CCM to create a NodeBalancer, and will provide the Deployment it services a public facing IP address with which to access the nginx Pods.

It is also worth noting that the there is additional information being passed to the CCM in the form of metadata annotations, which are discussed in the next section.

## Annotations

There are a number of settings, called annotations, that you can use to further customize the functionality of your NodeBalaner. Each annotation should be included in the `annotations` section of the Service manifest file's metadata, and all are prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`.