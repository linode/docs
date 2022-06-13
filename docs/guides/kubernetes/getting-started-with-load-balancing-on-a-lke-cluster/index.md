---
slug: getting-started-with-load-balancing-on-a-lke-cluster
author:
  name: Linode Community
  email: docs@linode.com
description: "We will walk you through everything you need to know about the usage of Linode NodeBalancers in Kubernetes, including adding them to a Kubernetes Service."
og_description: "The Linode Kubernetes Engine (LKE) provides access to Linode''s load balancing service, NodeBalancers. NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. This guide contains details about the usage of Linode NodeBalancers, including adding NodeBalancers to a Kubernetes Service, and information on various NodeBalancer configurations."
keywords: ['load balancers','kubernetes','nodebalancers','services']
tags: ["http","kubernetes","container","networking","linode platform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-14
image: GetStartLoadBal_LKECluster.png
aliases: ['/kubernetes/deploy-nodebalancers-with-linode-ccm/','/kubernetes/getting-started-with-load-balancing-on-a-lke-cluster/']
modified_by:
  name: Linode
title: "How to Get Started with Load Balancing on an LKE Cluster"
h1_title: "Getting Started with Load Balancing on an LKE Cluster"
enable_h1: true
contributor:
  name: Linode
---

The Linode Kubernetes Engine (LKE) is Linode's managed Kubernetes service. When you deploy an LKE cluster, you receive a Kubernetes Master which runs your cluster's control plane components, at no additional cost. The control plane includes [Linode's Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager/), which provides a way for your cluster to access additional Linode services. Linode's CCM provides access to Linode's load balancing service, [Linode NodeBalancers](/docs/platform/nodebalancer/).

NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. The LKE control plane handles the creation and deletion of the NodeBalancer, and correctly identifies the resources, and their networking, that the NodeBalancer will route traffic to. Whenever a Kubernetes Service of the `LoadBalancer` type is created, your Kubernetes cluster will create a Linode NodeBalancer service with the help of the Linode CCM.

{{< note >}}
Adding external Linode NodeBalancers to your LKE cluster will incur additional costs. See [Linode's Pricing page](https://www.linode.com/pricing/#row--networking) for details.
{{</ note >}}

{{< note >}}
All existing LKE clusters receive CCM updates automatically every two weeks when a new LKE release is deployed. See the [LKE Changelog](https://developers.linode.com/changelog/linode-kubernetes-engine/) for information on the latest LKE release.
{{</ note >}}

{{< note >}}
The [Linode Terraform K8s module](/docs/guides/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/) also deploys a Kubernetes cluster with the Linode CCM installed by default. Any Kubernetes cluster with a Linode CCM installation can make use of Linode NodeBalancers in the ways described in this guide.
{{</ note>}}

## In this Guide

This guide will show you:

- manifest file configurations needed to [add Linode NodeBalancers to your LKE cluster](#adding-linode-nodebalancers-to-your-kubernetes-cluster).
- [annotations](#annotations-reference) available to further configure your Linode NodeBalancers behavior and how to incorporate them into a manifest file.
- prerequisites and annotations needed to configure [TLS termination](#configuring-linode-nodebalancers-for-tls-encryption) on your cluster's NodeBalancers.
- how to [configure session affinity](#configuring-session-affinity-for-cluster-pods) for the Pods in a cluster.

### Before You Begin

This guide assumes you have a working Kubernetes cluster that was deployed using the Linode Kubernetes Engine (LKE). You can deploy a Kubernetes cluster using LKE in the following ways:

- The [Linode Cloud Manager](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
- [Linode's API v4](/docs/guides/deploy-and-manage-lke-cluster-with-api-a-tutorial/).
- [Terraform](/docs/guides/how-to-deploy-an-lke-cluster-using-terraform/), the popular infrastructure as code (IaC) tool.

    {{< note >}}
An LKE cluster will already have Linode's Cloud Controller Manager installed in the cluster's control plane. If you **did not** deploy your Kubernetes cluster using LKE and would like to make use of the Linode Cloud Controller Manager, see [Installing the Linode CCM on an Unmanaged Kubernetes Cluster - A Tutorial](/docs/guides/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/).
    {{</ note >}}

## Adding Linode NodeBalancers to your Kubernetes Cluster

To add an external load balancer to your Kubernetes cluster you can add the example lines to a new configuration file, or more commonly, to a Service file. When the configuration is applied to your cluster, Linode NodeBalancers will be created, and added to your Kubernetes cluster. Your cluster will be accessible via a public IP address and the NodeBalancers will route external traffic to a Service running on healthy nodes in your cluster.

{{< note >}}
Billing for Linode NodeBalancers begin as soon as the example configuration is successfully applied to your Kubernetes cluster.

In any NodeBalancer configuration, users should keep in mind that NodeBalancers have a maximum connection limit of 10,000 concurrent connections.
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
LoadBalancer Ingress:     192.0.2.0
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
- Each annotation **must** be prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`. For example, the complete value for the `throttle` annotation is `service.beta.kubernetes.io/linode-loadbalancer-throttle`.
- Annotation values such as `http` are case-sensitive.

#### Annotations Reference

| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `throttle` | &bull; integer <br>&bull; `0`-`20` <br> &bull; `0` disables the throttle | `20` | The client connection throttle limits the number of new connections-per-second from the same client IP. |
| `default-protocol` | &bull; string <br> &bull;`tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer to use. |
| `default-proxy-protocol` | &bull; string <br> &bull;`none`, `v1`, `v2` | `none` | Enables Proxy Protocol on the underlying NodeBalancer and specifies the version of Proxy Protocol to use. The Proxy Protocol allows TCP client connection information, like IP address and port number, to be transferred to cluster nodes. See the [Using Proxy Protocol with NodeBalancers](/docs/platform/nodebalancer/nodebalancer-proxypass-configuration/#what-is-proxy-protocol) guide for details on each Proxy Protocol version. |
| `port-*`| A JSON object of port configurations<br> For example: <br> `{ "tls-secret-name": "prod-app-tls", "protocol": "https"})` | None | &bull;  Specifies a NodeBalancer port to configure, i.e. `port-443`. <br><br> &bull; Ports `1-65534` are available for balancing. <br><br> &bull; The available port configurations are: <br><br> `"tls-secret-name"` use this key to provide a Kubernetes secret name when setting up TLS termination for a service to be accessed over HTTPS. The secret type should be `kubernetes.io/tls`.  <br><br> `"protocol"` specifies the protocol to use for this port, i.e. `tcp`, `http`, `https`. The default protocol is `tcp`, unless you provided a different configuration for the `default-protocol` annotation. |
| `check-type` | &bull; string <br> &bull; `none`, `connection`, `http`, `http_body` | None | &bull; The type of health check to perform on Nodes to ensure that they are serving requests. The behavior for each check is the following: <br><br> `none` no check is performed <br><br> `connection` checks for a valid TCP handshake <br><br> `http` checks for a `2xx` or `3xx` response code <br><br> `http_body` checks for a specific string within the response body of the healthcheck URL. Use the `check-body` annotation to provide the string to use for the check. |
| `check-path` | string | None | The URL path that the NodeBalancer will use to check on the health of the back-end Nodes. |
| `check-body` | string | None | The string that must be present in the response body of the URL path used for health checks. You must have a `check-type` annotation configured for a `http_body` check. |
| `check-interval` | integer | None | The duration, in seconds, between health checks. |
| `check-timeout` | &bull; integer <br> &bull; value between `1`-`30` | None | Duration, in seconds, to wait for a health check to succeed before it is considered a failure. |
| `check-attempts` | &bull; integer <br> &bull; value between `1`-`30` | None | Number of health checks to perform before removing a back-end Node from service. |
| `check-passive` | Boolean | `false` | When `true`, `5xx` status codes will cause the health check to fail. |
| `preserve` | Boolean | `false` | When `true`, deleting a LoadBalancer service does not delete the underlying NodeBalancer |
| `nodebalancer-id` | string | None | The ID of the NodeBalancer to front the service. When not specified, a new NodeBalancer will be created. This can be configured on service creation or patching. |
| `hostname-only-ingress` | Boolean | `false` | When `true`, the LoadBalancerStatus for the service will only contain the Hostname. This is useful for bypassing kube-proxy's rerouting of in-cluster requests originally intended for the external LoadBalancer to the service's constituent Pod IPs. |

{{< note >}}
To view a list of deprecated annotations, visit the [Linode CCM GitHub repository](https://github.com/linode/linode-cloud-controller-manager/blob/master/README.md#deprecated-annotations).
{{</ note >}}

### Configuring Linode NodeBalancers for TLS Encryption

This section describes how to set up TLS termination on your Linode NodeBalancers so a Kubernetes Service can be accessed over HTTPS.

#### Generating a TLS type Secret

Kubernetes allows you to store sensitive information in a Secret object for use within your cluster. This is useful for storing things like passwords and API tokens. In this section, you will create a Kubernetes secret to store Transport Layer Security (TLS) certificates and keys that you will then use to configure TLS termination on your Linode NodeBalancers.

In the context of the Linode CCM, Secrets are useful for storing Transport Layer Security (TLS) certificates and keys. The `linode-loadbalancer-tls` annotation requires TLS certificates and keys to be stored as Kubernetes Secrets with the type `tls`. Follow the steps in this section to create a Kubernetes TLS Secret.

{{< note >}}
The steps in this section will create a self-signed TLS certificate. To learn how to create a TLS certificate from the [Let's Encrypt](https://letsencrypt.org/) certificate authority (CA) and apply it to an application running on Kubernetes, see the [Configuring Load Balancing with TLS Encryption on a Kubernetes Cluster](/docs/guides/how-to-configure-load-balancing-with-tls-encryption-on-a-kubernetes-cluster/).
{{</ note >}}

1.  Generate a TLS key and certificate using a TLS toolkit like [OpenSSL](https://www.openssl.org/). Be sure to change the `CN` and `O` values to those of your own website domain.

        openssl req -newkey rsa:4096 \
            -x509 \
            -sha256 \
            -days 3650 \
            -nodes \
            -out tls.crt \
            -keyout tls.key \
            -subj "/CN=mywebsite.com/O=mywebsite.com"

2.  Create the secret using the `create secret tls` command. Ensure you substitute `$SECRET_NAME` for the name you'd like to give to your secret. This will be how you reference the secret in your Service manifest.

        kubectl create secret tls $SECRET_NAME --cert tls.crt --key tls.key

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

By default, Kubernetes does not expose Services with TLS termination over HTTPS. In order to use `https` you'll need to instruct the Service to use the correct port using the required annotations. You can add the following code snippet to a Service file to enable TLS termination on your NodeBalancers:

{{< file "example-service.yaml" yaml >}}
...
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-default-protocol: http
    service.beta.kubernetes.io/linode-loadbalancer-port-443: '{ "tls-secret-name": "example-secret", "protocol": "https" }'
...
{{</ file >}}

- The `service.beta.kubernetes.io/linode-loadbalancer-default-protocol` annotation configures the NodeBalancer's default protocol.

- `service.beta.kubernetes.io/linode-loadbalancer-port-443` specifies port `443` as the port to be configured. The value of this annotation is a JSON object designating the TLS secret name to use (`example-secret`) and the protocol to use for the port being configured (`https`).

If you have multiple Secrets and ports for different environments (testing, staging, etc.), you can define more than one secret and port pair:

{{< file "example-service.yaml" yaml >}}
...
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-default-protocol: http
    service.beta.kubernetes.io/linode-loadbalancer-port-443: '{ "tls-secret-name": "example-secret", "protocol": "https" }'
    service.beta.kubernetes.io/linode-loadbalancer-port-8443: '{ "tls-secret-name": "example-secret-staging", "protocol": "https" }'
...
{{</ file >}}

### Configuring Session Affinity for Cluster Pods

`kube-proxy` will always attempt to proxy traffic to a random backend Pod. To direct traffic to the same Pod, you can use the `sessionAffinity` mechanism. When set to `clientIP`, `sessionAffinity` will ensure that all traffic from the same IP will be directed to the same Pod. You can add the example lines to a Service configuration file to

{{< file >}}
spec:
  type: LoadBalancer
  selector:
    app: example-app
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 100
{{</ file >}}

## Removing Linode NodeBalancers from your Kubernetes Cluster

To delete a NodeBalancer and the Service that it represents, you can use the Service manifest file you used to create the NodeBalancer. Simply use the `delete` command and supply your file name with the `f` flag:

    kubectl delete -f example-service.yaml

Similarly, you can delete the Service by name:

    kubectl delete service example-service

After deleting your service, its corresponding NodeBalancer will be removed from your Linode account.

{{< note >}}
If your Service file used the `preserve` annotation, the underlying NodeBalancer will not be removed from your Linode account. See the [annotations reference](#annotations-reference) for details.
{{</ note >}}
