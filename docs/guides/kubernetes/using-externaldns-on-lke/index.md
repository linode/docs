---
slug: using-external-dns-on-linode
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: 'This guide describes the process of using ExternalDNS to create Kubernetes ready DNS records on LKE'
og_description: 'Describes the process of using ExternalDNS to create Kubernetes ready DNS records on LKE'
keywords: ["Kubernetes", "cluster", "LKE", "ExternalDNS", "permissions"]
tags: ["nginx", "linode platform", "kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-05-31
modified_by:
  name: Linode
title: 'Using ExternalDNS on LKE to Create Kubernetes Aware DNS Records'
concentrations: ["Kubernetes"]
external_resources:
  - '[Kubernetes Documentation](https://kubernetes.io/docs/home)'
  - '[Kubernetes Changelog](https://github.com/kubernetes/kubernetes/tree/master/CHANGELOG)'
---

In Kubernetes, networking is a diverse topic, covering a range of configuration options to handle traffic internally for communication between worker nodes, deployments, services and more. This includes the configuration of [Kubernetes DNS](https://kubernetes.io/docs/concepts/services-networking/dns-pod-service/) an internal cluster DNS server for hostnames and subdomains resolving to both pods and services on the cluster. While Kubernetes DNS is a great solution for nearly all internal use cases, it is not able to address DNS resolution that originates outside of the cluster to nodes and applications on the cluster themselves. For example, if you have an application that requires a domain name to resolve to a Node, NodeBalancer, or other alternative Load Balancing solution, Kubernetes does not _by default_ support your configuration as a part of Kubernetes. This issue is further complicated by the fact that DNS resolution on Kubernetes generally relies on third party DNS providers while still requiring interactivity with the cluster itself.

To help solve this issue, a Kubernetes Special Interest Group (Kubernetes SIG) created **ExternalDNS**, a DNS provider agnostic tool specifically created to be aware of internal Kubernetes networking resources (i.e Service, Ingress, LoadBalancer etc...) to be able to dynamically create external DNS records through a third party DNS provider.

## In This Guide

This guide will describe how to use ExternalDNS to leverage  Linode's [DNS Manager](https://www.linode.com/docs/guides/dns-manager/) and the [Linode API](https://www.linode.com/docs/guides/getting-started-with-the-linode-api/) to create working DNS configurations that dynamically point to Kubernetes applications. Configuration examples will be provided that can then be applied and adjusted for your own cluster's unique configuration.

## Before you Begin

- [Create an API access token](https://www.linode.com/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) and securely save the token to be used in a later step.
- Register (purchase) a domain name if you haven’t already.
- Set your domain name to use Linode’s name servers . You’ll need to do this on your domain registrar’s website and then wait up to 24 hours for the change to take effect.
- Create a Kubernetes Cluster. While external DNS will work with Kubernetes by default, the examples in this guide were created specifically to address the [Linode Kubernetes Engine](https://www.linode.com/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).

## Installing and Configuring ExternalDNS

When using Linode DNS, ExternalDNS is deployed as a pod and service in your Kubernetes cluster created by a simple deployment manifest. The application is hosted on a standard container image maintained by the Kubernetes SIG to maintain parity with all releases in their [public repo](https://github.com/kubernetes-sigs/external-dns/releases). A basic configuration can be isolated as a `Deployment`, `ServiceAccounts`, `ClusterRoleBindings`, and `ClusterRoles`, configured with a few arguments that define exactly how External DNS will leverage the domain, DNS provider, and the desired Kubernetes networking resource. When RBAC is enabled, such as in default LKE configurations, the manifest used to deploy ExternalDNS will additionally require a `ClusterRole`, `ServiceAccount` and a `ClusterRoleBinding` to allow access to allow critical resources from the external-dns deployment.

### A Basic ExternalDNS Deployment

The following Deployment manifest will create all the necessary resources for an LKE cluster, and should be created in it's own file using a text editor of your choice:

{{< file "~/deploymentmanifest.yaml" >}}

apiVersion: v1
kind: ServiceAccount
metadata:
  name: external-dns
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: external-dns
rules:
- apiGroups: [""]
  resources: ["services","endpoints","pods"]
  verbs: ["get","watch","list"]
- apiGroups: ["extensions","networking.k8s.io"]
  resources: ["ingresses"]
  verbs: ["get","watch","list"]
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: external-dns-viewer
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: external-dns
subjects:
- kind: ServiceAccount
  name: external-dns
  namespace: default
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: external-dns
spec:
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: external-dns
  template:
    metadata:
      labels:
        app: external-dns
    spec:
      serviceAccountName: external-dns
      containers:
      - name: external-dns
        image: k8s.gcr.io/external-dns/external-dns:v0.11.0
        args:
        - --source=service # ingress is also possible
        - --provider=linode
        env:
        - name: LINODE_TOKEN
          value: "xxxxxxxxxxxxxxxxxxxxxxx"
{{< /file >}}

Once the deployment manifest has been created, apply the necessary resources on your cluster using the following command:

    kubectl apply -f deploymentmanifest.yaml

{{ note }}
To ensure the deployment was successful or otherwise troubleshoot, the following commands will enable you to inspect the created resources:

    kubectl get all | grep external-dns
    kubectl get clusterrole | grep external-dns
    kubectl get clusterrolebinding | grep external-dns-viewer
    kubectl get sa | grep external-dns
{{< /note >}}

### Testing with an example Nginx Deployment

ExternalDNS can create configurations both imperatively and declaratively depending on your team's needs and preferences. Both approaches will be outlined in this section, leveraging the same basic configuration created in parity with eachother. In the following examples, note that DNS records are always created using service annotations, prefixed with `external-dns.alpha.kubernetes.io/hostname=` before the fully qualified domain name that will be configured.

## Using the Imperative Approach

An example NGINX deployment and relevant DNS records can be easily created imperatively by following the steps below:

1. Create an example NGINX application pod that uses port 80:

    kubectl run nginx --image=nginx --port=80

1. Expose the NGINX application on port 80 using a LoadBalancer:

    kubectl expose pod nginx --port=80 --target-port=80 --type=LoadBalancer

1. Add a service annotation to the NGINX application, replacing `nginx.example.org` with your own fully qualified domain name to ensure that the application successfully resolves to your domain:

    kubectl annotate service nginx "external-dns.alpha.kubernetes.io/hostname=nginx.example.org."

## Using the Declarative Approach

An example NGINX deployment and relevant DNS records can be created Declaratively by leveraging a deployment manifest resembling the following. Create this manifest file using a text editor of your choice, replaceing `my-app.example.com` with your own fully qualified domain name:

{{< file "nginxmanifest.yaml">}}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - image: nginx
        name: nginx
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx
  annotations:
    external-dns.alpha.kubernetes.io/hostname: my-app.example.com
spec:
  selector:
    app: nginx
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
{{< /file >}}

Once the deployment manifest file has been created, enter the following command to apply it to your cluster:

    kubectl apply -f nginxmanifest.yaml
