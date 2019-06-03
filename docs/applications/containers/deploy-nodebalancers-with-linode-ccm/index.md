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

The [Linode Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager) allows Kubernetes to deploy Linode NodeBalancers whenever you create a Service of the "LoadBalancer" type. This provides the cluster with a reliable way to expose resources to the public internet. The CCM handles the creation and deletion of the NodeBalancer, and correctly identifies the Linode resources, and their networking, that the NodeBalancer will service. This guide will discuss how to use the Linode CCM.

## Before You Begin

When using the CCM for the first time, this guide suggests that you create a new Kubernetes cluster, as there are a number of issues that prevent the CCM from running on Nodes that are in the "Ready" state. Instead, for a completely automated install, this guide suggests that you use the [Linode CLI's k8s-alpha command line tool](https://developers.linode.com/kubernetes/). The Linode CLI's k8s-alpha command line tool utilizes Terraform to fully boostrap a Kubernetes cluster on Linode, including the [Linode Container Storage Interface (CSI) Driver](https://github.com/linode/linode-blockstorage-csi-driver) plugin, the Linode CCM plugin, and the [ExternalDNS plugin](https://github.com/kubernetes-incubator/external-dns/blob/master/docs/tutorials/linode.md).

For more information on creating a Kubernetes cluster with the Linode CLI, review our [How to Deploy Kubernetes on Linode with the k8s-alpha CLI](/docs/applications/containers/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) guide.

## Using the Linode CCM

For this example, you will create a Deployment that deploys three nginx Pods, and then create a Service to expose those Pods to the internet using the Linode CCM.

1.  Create a Deployment manifest, describing the desired state of the three nginx containers:

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

1.  Create a Service for the Deployment:

    {{< file "nginx-service.yaml" yaml >}}
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

There is additional information being passed to the CCM in the form of metadata annotations, which are discussed in the next section.

## Annotations

There are a number of settings, called annotations, that you can use to further customize the functionality of your NodeBalaner. Each annotation should be included in the `annotations` section of the Service manifest file's metadata, and all of the annotations are prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`.

| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `throttle` | `0`-`20` (`0` disables the throttle) | `20` | Client Connection Throttle. This limits the number of new connections per second from the same client IP. |
| `protocol` | `tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer. The protocol is overwritten to `https` if the `linode-loadbalancer-tls-ports` annotation is in use. |
| `tls`| Example value: `[ { "tls-secret-name": "prod-app-tls", "port": 443}, {"tls-secret-name": "dev-app-tls", "port": 8443} ]` | None | A JSON array that specifies which ports use TLS and their corresponding secrets. The secret type should be `kubernetes.io/tls`. |
| `check-type` | `none`, `connection`, `http`, `http_body` | None | The type of health check to perform on your Nodes to ensure that they are serving requests. |
| `check-path` | string | None | The URL path that the NodeBalancer will use to check on the health of the back-end Nodes. |
| `check-body` | string | None | The text that must be present in the body of the page used for health checks. |
| `check-interval` | integer | None | The duration, in seconds, between health checks. |
| `check-timeout` | integer (a value between 1-30) | None | Duration, in seconds, to wait for a health check to suceed before it is considered a failure. |
| `check-attempts` | integer (a value between 1-30) | None | Number of health checks to perform before removing a back-end Node from service. |
| `check-passive` | boolean | `false` | When `true`, `5xx` status codes will cause the health check to fail. |

### A Note about the linode-loadbalancer-tls Annotation

In Kubernetes, you can store secret information in a Secret object. This is useful for storing things like passwords and API tokens. In the case of the Linode CCM, it is useful for storing TLS certificates and keys. The `linode-loadbalancer-tls` annotation requires TLS certificates and keys be stored as Kubernetes Secrets. To create the secret, you can issue the following command, being sure to substitute $SECRET_NAME for the name you'd like to give to your secret, $KEY_FILE for the name of the TLS key file name, and $CERT_FILE for the name of the TLS certificate file:

    kubectl create secret tls $SECRET_NAME --key $KEY_FILE --cert $CERT_FILE

