---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-14
modified_by:
  name: Linode
title: "Adding NodeBalancers to a Linode Kubernetes Engine Cluster(LKE) - A Tutorial"
h1_title: "A Tutorial for Adding NodeBalancers to a Linode Kubernetes Engine (LKE) Cluster"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
The Linode Kubernetes Engine (LKE) is Linode's managed Kubernetes service. When you deploy an LKE cluster, you receive a Kubernetes Master which runs your cluster's control plane components, at no additional cost. The control plane includes [Linode's Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager/), which provides a way for your cluster to access additional Linode services. Linode's CCM provides access to Linode's load balancing service, [Linode NodeBalancers](/docs/platform/nodebalancer/).

NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. The LKE control plane handles the creation and deletion of the NodeBalancer, and correctly identifies the resources, and their networking, that the NodeBalancer will route traffic to. Whenever a Kubernetes Service of the `LoadBalancer` type is created, your Kubernetes cluster will create a Linode NodeBalancer service with the help of the Linode CCM.

{{< note >}}
Adding external load balancers to your LKE cluster will incur additional costs. See [Linode's Pricing page](https://www.linode.com/pricing/#row--networking) for details.
{{</ note >}}

{{< note >}}
All existing LKE clusters receive CCM updates automatically every two weeks when a new LKE release is deployed. See the [LKE Changelog](https://developers.linode.com/changelog/linode-kubernetes-engine/) for information on the latest LKE release.
{{</ note >}}

## In this Guide

This guide covers the following topics:

### Before You Begin

This guide assumes you have a working Kubernetes cluster that was deployed using the Linode Kubernetes Engine (LKE). You can deploy a Kubernetes cluster using LKE in the following ways:

- The [Linode Cloud Manager](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
- [Linode's API v4](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/).
- [Terraform](/docs/kubernetes/how-to-deploy-an-lke-cluster-using-terraform/), the popular infrastructure as code (IaC) tool.

    {{< note >}}
An LKE cluster will already have Linode's Cloud Controller Manager installed in the cluster's control plane. If you **did not** deploy your Kubernetes cluster using LKE and would like to make use of the Linode Cloud Controller Manager, see How to Add NodeBalancers to a Non-Linode Managed Kubernetes Cluster.
    {{</ note >}}


## Adding Linode NodeBalancers to your Kubernetes Cluster

To add an external load balancer to your Kubernetes cluster you can add the example lines to a new configuration file or more commonly, to a Service file. When the configuration is applied to your cluster, Linode NodeBalancers will be created, and added to your Kubernetes cluster. Your cluster will be accessible via a public IP address and the NodeBalancers will route external traffic to a Service running on healthy nodes in your cluster.

{{< note >}}
Billing for Linode NodeBalancers begin as soon as the example configuration is successfully applied to your Kubernetes cluster.
{{</ note >}}

{{< file >}}
spec:
  type: LoadBalancer
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
{{</ file >}}

 - The `spec.type` of `LoadBalancer` is responsible for telling Kubernetes to create a Linode NodeBalancer.
 - The remaining lines provide port definitions for your Service's Pods and maps an incoming port to a container's targetPort.

### Viewing Linode NodeBalancer Details

To view details about running NodeBalancers on your cluster:

1. Get the services running on your cluster:

        kubectl get services

    You will see a similar output:

      {{< output >}}
NAME            TYPE           CLUSTER-IP      EXTERNAL-IP    PORT(S)        AGE
kubernetes      ClusterIP      10.128.0.1      none           443/TCP        3h5m
example-service LoadBalancer   10.128.171.88   45.79.246.55   80:30028/TCP   36m
      {{</ output >}}

    - Viewing the entry for the `example-service`, you can find your NodeBalancer's public IP under the `EXTERNAL-IP` column.
    - The `PORT(S)` column displays the `example-service` incoming port and NodePort.

1. View details about the `example-service` to retrieve information about the deployed NodeBalancers:

        kubectl describe service example-service

      {{< output >}}
Name:                     nginx-service
Namespace:                default
Labels:                   app=nginx
Annotations:              service.beta.kubernetes.io/linode-loadbalancer-throttle: 4
Selector:                 app=nginx
Type:                     LoadBalancer
IP:                       10.128.171.88
LoadBalancer Ingress:     45.79.246.55
Port:                     http  80/TCP
TargetPort:               80/TCP
NodePort:                 http  30028/TCP
Endpoints:                10.2.1.2:80,10.2.1.3:80,10.2.2.2:80
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
      {{</ output >}}


## Configuring your Linode NodeBalancers with Annotations

The Linode CCM accepts annotations that configure the behavior and settings of your cluster's underlying NodeBalancers.

- The table below provides a list of all available annotation suffixes.
- Each annotation **must** be prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`. For example, the complete for the `throttle` annotation is `service.beta.kubernetes.io/linode-loadbalancer-throttle`.
- Annotation values such as `http` are case-sensitive.

#### Annotations Reference

| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `throttle` | &bull; integer <br>&bull; `0`-`20` <br> &bull; `0` disables the throttle | `20` | The client connection throttle limits the number of new connections-per-second from the same client IP. |
| `default-protocol` | &bull; string <br> &bull;`tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer to use. |
| `port-*`| A JSON object of port configurations<br> For example: <br> `{ "tls-secret-name": "prod-app-tls", "protocol": "https"})` | None | &bull;  Specifies a NodeBalancer port to configure, i.e. `port-443`. <br><br> &bull; Ports `1-65534` are available for balancing. <br><br> &bull; The available port configurations are: <br><br> `"tls-secret-name"` use this key to provide a Kubernetes secret name when setting up TLS termination for a service to be accessed over HTTPS. The secret type should be `kubernetes.io/tls`.  <br><br> `"protocol"` specifies the protocol to use for this port, i.e. `tcp`, `http`, `https`. The default protocol is `tcp`, unless you provided a different configuration for the `default-protocol` annotation. |
| `check-type` | &bull; string <br> &bull; `none`, `connection`, `http`, `http_body` | None | &bull; The type of health check to perform on Nodes to ensure that they are serving requests. The behavior for each check is the following: <br><br> `none` no check is performed <br><br> `connection` checks for a valid TCP handshake <br><br> `http` checks for a `2xx` or `3xx` response code <br><br> `http_body` checks for a specific string within the response body of the healthcheck URL. Use the `check-body` annotation to provide the string to use for the check. |
| `check-path` | string | None | The URL path that the NodeBalancer will use to check on the health of the back-end Nodes. |
| `check-body` | string | None | The string that must be present in the response body of the URL path used for health checks. You must have a `check-type` annotation configured for a `http_body` check. |
| `check-interval` | integer | None | The duration, in seconds, between health checks. |
| `check-timeout` | &bull; integer <br> &bull; value between `1`-`30` | None | Duration, in seconds, to wait for a health check to succeed before it is considered a failure. |
| `check-attempts` | &bull; integer <br> &bull; value between `1`-`30` | None | Number of health checks to perform before removing a back-end Node from service. |
| `check-passive` | boolean | `false` | When `true`, `5xx` status codes will cause the health check to fail. |
| `preserve` | boolean | `false` | When `true`, deleting a LoadBalancer service does not delete the underlying NodeBalancer |

{{< note >}}
To view a list of deprecated annotations, visit the [Linode CCM GitHub repository](https://github.com/linode/linode-cloud-controller-manager/blob/master/README.md#deprecated-annotations).
{{</ note >}}

### Configuring Linode NodeBalancers for TLS Encryption

This section describes how to set up TLS termination on your Linode NodeBalancers so a Kubernetes Service can be accessed over HTTPS.

#### Generating a TLS type Secret

Kubernetes allows you to store sensitive information in a Secret object for use within your cluster. This is useful for storing things like passwords and API tokens. In this section, you will create a Kubernetes secret to store Transport Layer Security (TLS) certificates and keys that you will then use to configure TLS termination on your Linode NodeBalancers.


In the context of the Linode CCM, Secrets are useful for storing Transport Layer Security (TLS) certificates and keys. The `linode-loadbalancer-tls` annotation requires TLS certificates and keys to be stored as Kubernetes Secrets with the type of `tls`. Follow the next steps to create a valid `tls` type Secret:

1.  Generate a TLS key and certificate using a TLS toolkit like [OpenSSL](https://www.openssl.org/). Be sure to change the `CN` and `O` values to those of your own website domain.

        openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.crt -subj "/CN=mywebsite.com/O=mywebsite.com"

2.  Create the secret using the `create secret tls` command. Ensure you substitute `$SECRET_NAME` for the name you'd like to give to your secret. This will be how you reference the secret in your Service manifest.

        kubectl create secret tls $SECRET_NAME --cert cert.crt --key key.pem

3.  You can check to make sure your Secret has been successfully stored by using `describe`:

        kubectl describe secret $SECRET_NAME

    You should see output like the following:

    {{< output >}}
kubectl describe secret docteamdemosite
Name:         my-secret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  kubernetes.io/tls

Data
====
tls.crt:  1164 bytes
tls.key:  1704 bytes
{{</ output >}}

    If your key is not formatted correctly you'll receive an error stating that there is no PEM formatted data within the key file.

#### Configuring TLS within a Service

In order to use `https` you'll need to instruct the Service to use the correct port using the required annotations. You can add the following code snippet to a Service file to enable TLS termination on your NodeBalancers:

{{< file "example-serivce.yaml" yaml >}}
...
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-default-protocol: http
    service.beta.kubernetes.io/linode-loadbalancer-port-443: '{ "tls-secret-name": "example-secret", "protocol": "https" }'
...
{{</ file >}}

- The `service.beta.kubernetes.io/linode-loadbalancer-default-protocol` configures the NodeBalancer's default protocol to use.

- `service.beta.kubernetes.io/linode-loadbalancer-port-443` specifies port `443` as the port to be configured. The value of this annotation is a JSON object designating the TLS secret name to use (`example-secret`) and the protocol to use for the port being configured (`https`).

If you have multiple Secrets and ports for different environments (testing, staging, etc.), you can define more than one secret and port pair:

{{< file "example-serivce.yaml" yaml >}}
...
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-default-protocol: http
    service.beta.kubernetes.io/linode-loadbalancer-port-443: '{ "tls-secret-name": "example-secret", "protocol": "https" }'
    service.beta.kubernetes.io/linode-loadbalancer-port-8443: '{ "tls-secret-name": "example-secret-staging", "protocol": "https" }'
...
{{</ file >}}

### Configuring Session Affinity for Cluster Pods

`kube-proxy` will always attempt to proxy traffic to a random backend Pod. To direct traffic to the same Pod, you can use the `sessionAffinity` mechanism. When set to `clientIP`, `sessionAffinity` will ensure that all traffic from the same IP will be directed to the same Pod.  You can add the example lines to a Service configuration file to

{{< file >}}
spec:
  type: LoadBalancer
  selector:
    app: nginx
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 100
{{</ file >}}

## Putting It All Together - Adding NodeBalancers to an LKE Cluster Running NGINX

This section provides a working example that makes use of the concepts outlined in this guide. For this example, you will create a Deployment that creates three NGINX Pods, and then create a Service to expose those Pods to the internet over HTTPS.

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
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 80
  selector:
    app: nginx
  type: LoadBalancer
  sessionAffinity: None
    {{</ file >}}

    The above Service manifest includes a few key concepts.

      - The first is the `spec.type` of `LoadBalancer`. The `LoadBalancer` type is responsible for telling LKE to create a Linode NodeBalancer, and will provide the Deployment it services a public facing IP address with which to access the NGINX Pods.
      - There is additional information being passed to the CCM in the form of metadata annotations (`service.beta.kubernetes.io/linode-loadbalancer-throttle` in the example above). See the [Configuring your Linode NodeBalancers with Annotations](#configuring-your-linode-nodebalancers-with-annotations) section for details on all available annotations.

1.  Use the `create` command to create the Service, and in turn, the NodeBalancer:

        kubectl create -f nginx-service.yaml

    To view your newly created NodeBalancer's, see the View [Linode NodeBalancer Details](#view-linode-nodebalancer-details) section of the guide.
