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
title: "How to Add NodeBalancers to Linode Kubernetes Engine Clusters"
h1_title: "Adding NodeBalancers to Linode Kubernetes Engine (LKE) Clusters"
contributor:
  name: Your Name
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---
The Linode Kubernetes Engine is Linode's managed Kubernetes service. When you deploy an LKE cluster, you receive a Kubernetes Master which runs your cluster's control plane components, at no additional cost. The control plane includes Linode's Cloud Controller Manager (CCM), which provides a way for your cluster to access additional Linode services. Linode's CCM provides access to Linode's Load Balancing service, [Linode NodeBalancers](/docs/platform/nodebalancer/).

NodeBalancers provide your Kubernetes cluster with a reliable way of exposing resources to the public internet. The CCM handles the creation and deletion of the NodeBalancer, and correctly identifies the resources, and their networking, that the NodeBalancer will service will make use of. Whenever a Kubernetes Service of the `LoadBalancer` type is created, your Kubernetes cluster will create a Linode NodeBalancer service with the help of the Linode CCM.

{{< note >}}
Adding external load balancers to your LKE cluster will incur additional costs. See [Linode's Pricing page](https://www.linode.com/pricing/#row--networking) for details.
{{</ note >}}

## In this Guide
## Before You Begin

This guide assumes you have a working Kubernetes cluster that was deployed using the Linode Kubernetes Engine (LKE). You can deploy a Kubernetes cluster using LKE in the following ways:

- The [Linode Cloud Manager](/docs/kubernetes/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
- [Linode's API v4](/docs/kubernetes/deploy-and-manage-lke-cluster-with-api-a-tutorial/).
- [Terraform](/docs/kubernetes/how-to-deploy-an-lke-cluster-using-terraform/), the popular infrastructure as code (IaC) tool.

    {{< note >}}
An LKE cluster will already have Linode's Cloud Controller Manager installed in the cluster's control plane. If you **did not** deploy your Kubernetes cluster using LKE and would like to make use of the Linode Cloud Controller Manager, see How to Add NodeBalancers to a Non-Linode Managed Kubernetes Cluster.
    {{</ note >}}

## Configuring your Linode NodeBalancers with Annotations

The Linode CCM accepts annotations that configure the behavior and settings of your cluster's underlying NodeBalancers.

- The table below provides a list of all available annotation suffixes.
- Each annotation **must** be prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`. For example, the complete for the `throttle` annotation is `service.beta.kubernetes.io/linode-loadbalancer-throttle`.
- Annotation values such as `http` are case-sensitive.

### Annotations Table

| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `throttle` | &bull; `0`-`20` <br> &bull; `0` disables the throttle | `20` | The client connection throttle limits the number of new connections-per-second from the same client IP. |
| `default-protocol` | `tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer. |
| `port-*`| &bull; A JSON object of port configurations.<br> For example: <br> `{ "tls-secret-name": "prod-app-tls", "protocol": "https"})` | None | &bull;  Specifies a NodeBalancer port to configure, i.e. `port-443`. <br><br> &bull; Ports `1-65534` are available for balancing. <br><br> &bull; The available port configurations are: <br><br> `"tls-secret-name"` Use this key when configuring port 443 for HTTPS. The secret type should be `kubernetes.io/tls`  <br><br> `"protocol"` Use this key to specify the protocol to use for this port, i.e. `tcp`, `http`, `https`. The default protocol is `tcp` or the protocol set with the `default-protocol` annotation. |
| `check-type` | `none`, `connection`, `http`, `http_body` | None | The type of health check to perform on Nodes to ensure that they are serving requests. `connection` checks for a valid TCP handshake, `http` checks for a `2xx` or `3xx` response code, `http_body` checks for a certain string within the response body of the healthcheck URL. |
| `check-path` | string | None | The URL path that the NodeBalancer will use to check on the health of the back-end Nodes. |
| `check-body` | string | None | The text that must be present in the body of the page used for health checks. For use with a `check-type` of `http_body`. |
| `check-interval` | integer | None | The duration, in seconds, between health checks. |
| `check-timeout` | integer (a value between `1`-`30`) | None | Duration, in seconds, to wait for a health check to succeed before it is considered a failure. |
| `check-attempts` | integer (a value between `1`-`30`) | None | Number of health checks to perform before removing a back-end Node from service. |
| `check-passive` | boolean | `false` | When `true`, `5xx` status codes will cause the health check to fail. |
| `preserve` | boolean | `false` | When `true`, deleting a LoadBalancer service does not delete the underlying NodeBalancer |

{{< disclosure-note "Deprecated Annotations">}}
| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `default-protocol` | `tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer. |
| `tls`| Example value: `[ { "tls-secret-name": "prod-app-tls", "port": 443} ]` | None | A JSON array (formatted as a string) that specifies which ports use TLS and their corresponding secrets. The secret type should be `kubernetes.io/tls`. Fore more information, see the [TLS Encryption section](#tls-encryption). |
{{</ disclosure-note >}}

### Adding NodeBalancers to your Kubernetes Cluster

| `port-*` | JSON Object <br> For example: <br> `{ "tls-secret-name": "prod-app-tls", "protocol": "https"})` | None | &bull;  Specifies a NodeBalancer port to configure, i.e `port-443`. <br> &bull; Use `"secret-name"` name key to specify the port's Kubernetes secret to use. The secret type should be `kubernetes.io/tls` <br> &bull; Use the `protocol` key to specify the protocol to use for this port, i.e. `tcp`, `http`, `https`. |