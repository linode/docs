---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy NodeBalancers with the Linode Cloud Controller Manager.'
keywords: ['ccm','cloud','controller','manager','kubernetes']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-08-28
modified_by:
  name: Linode
title: "Deploy NodeBalancers with the Linode Cloud Controller Manager"
---

The [Linode Cloud Controller Manager (CCM)](https://github.com/linode/linode-cloud-controller-manager) allows Kubernetes to deploy [Linode NodeBalancers](/docs/platform/nodebalancer/) whenever a Service of the "LoadBalancer" type is created. This provides the Kubernetes cluster with a reliable way of exposing resources to the public internet. The CCM handles the creation and deletion of the NodeBalancer, and correctly identifies the resources, and their networking, the NodeBalancer will service.

This guide will explain how to:

- Create a service with the type "LoadBalancer."
- Use annotations to control the functionality of the NodeBalancer.
- Use the NodeBalancer to terminate TLS encryption.

{{< caution >}}
Using the Linode Cloud Controller Manager to create NodeBalancers will create billable resources on your Linode account. A NodeBalancer costs $10 a month. Be sure to follow the instructions at the end of the guide if you would like to delete these resources from your account.
{{</ caution >}}

## Before You Begin

You should have a working knowledge of Kubernetes and familiarity with the `kubcetl` command line tool before attempting the instructions found in this guide. For more information about Kubernetes, consult our [Kubernetes Beginner's Guide](/docs/applications/containers/beginners-guide-to-kubernetes/) and our [Getting Started with Kubernetes](/docs/applications/containers/getting-started-with-kubernetes/) guide.

When using the CCM for the first time, it's highly suggested that you create a new Kubernetes cluster, as there are a number of issues that prevent the CCM from running on Nodes that are in the "Ready" state. For a completely automated install, you can use the [Linode CLI's k8s-alpha command line tool](https://developers.linode.com/kubernetes/). The Linode CLI's k8s-alpha command line tool utilizes [Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/) to fully bootstrap a Kubernetes cluster on Linode. It includes the [Linode Container Storage Interface (CSI) Driver](https://github.com/linode/linode-blockstorage-csi-driver) plugin, the [Linode CCM plugin](https://github.com/linode/linode-cloud-controller-manager), and the [ExternalDNS plugin](https://github.com/kubernetes-incubator/external-dns/blob/master/docs/tutorials/linode.md). For more information on creating a Kubernetes cluster with the Linode CLI, review our [How to Deploy Kubernetes on Linode with the k8s-alpha CLI](/docs/applications/containers/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) guide.

{{< note >}}
To manually add the Linode CCM to your cluster, you must start `kubelet` with the `--cloud-provider=external` flag. `kube-apiserver` and `kube-controller-manager` must NOT supply the `--cloud-provider` flag. For more information, visit the [upstream Cloud Controller documentation](https://kubernetes.io/docs/tasks/administer-cluster/running-cloud-controller/).
{{</ note >}}

If you'd like to add the CCM to a cluster by hand, and you are using macOS, you can use the `generate-manifest.sh` file in the `deploy` folder of the CCM repository to generate a CCM manifest file that you can later apply to your cluster. Use the following command:

    ./generate-manifest.sh $LINODE_API_TOKEN us-east

Be sure to replace `$LINODE_API_TOKEN` with a valid Linode API token, and replace `us-east` with the region of your choosing.

To view a list of regions, you can use the [Linode CLI](/docs/platform/api/using-the-linode-cli/), or you can view the [Regions API endpoint](https://api.linode.com/v4/regions).

If you are not using macOS, you can copy the `ccm-linode-template.yaml` file and change the values of the `data.apiToken` and `data.region` fields manually.

## Using the CCM

To use the CCM, you must have a collection of Pods that need to be load balanced, usually from a [Deployment](/docs/applications/containers/kubernetes-reference/#deployment). For this example, you will create a Deployment that deploys three NGINX Pods, and then create a Service to expose those Pods to the internet using the Linode CCM.

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

2.  Create a Service for the Deployment:

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

    The above Service manifest includes a few key concepts.

    - The first is the `spec.type` of `LoadBalancer`. This LoadBalancer type is responsible for telling the Linode CCM to create a Linode NodeBalancer, and will provide the Deployment it services a public facing IP address with which to access the NGINX Pods.
    - There is additional information being passed to the CCM in the form of metadata annotations (`service.beta.kubernetes.io/linode-loadbalancer-throttle` in the example above), which are discussed in the [next section](#annotations).

1.  Use the `create` command to create the Service, and in turn, the NodeBalancer:

        kubectl create -f nginx-service.yaml

You can log in to the [Linode Cloud Manager](https://cloud.linode.com) to view your newly created NodeBalancer.

## Annotations

There are a number of settings, called annotations, that you can use to further customize the functionality of your NodeBalancer. Each annotation should be included in the `annotations` section of the Service manifest file's metadata, and all of the annotations are prefixed with `service.beta.kubernetes.io/linode-loadbalancer-`.

| Annotation (suffix) | Values | Default Value | Description |
|---------------------|--------|---------------|-------------|
| `throttle` | `0`-`20` (`0` disables the throttle) | `20` | Client Connection Throttle. This limits the number of new connections-per-second from the same client IP. |
| `protocol` | `tcp`, `http`, `https` | `tcp` | Specifies the protocol for the NodeBalancer. |
| `tls`| Example value: `[ { "tls-secret-name": "prod-app-tls", "port": 443} ]` | None | A JSON array (formatted as a string) that specifies which ports use TLS and their corresponding secrets. The secret type should be `kubernetes.io/tls`. Fore more information, see the [TLS Encryption section](#tls-encryption). |
| `check-type` | `none`, `connection`, `http`, `http_body` | None | The type of health check to perform on Nodes to ensure that they are serving requests. `connection` checks for a valid TCP handshake, `http` checks for a `2xx` or `3xx` response code, `http_body` checks for a certain string within the response body of the healthcheck URL. |
| `check-path` | string | None | The URL path that the NodeBalancer will use to check on the health of the back-end Nodes. |
| `check-body` | string | None | The text that must be present in the body of the page used for health checks. For use with a `check-type` of `http_body`. |
| `check-interval` | integer | None | The duration, in seconds, between health checks. |
| `check-timeout` | integer (a value between `1`-`30`) | None | Duration, in seconds, to wait for a health check to succeed before it is considered a failure. |
| `check-attempts` | integer (a value between `1`-`30`) | None | Number of health checks to perform before removing a back-end Node from service. |
| `check-passive` | boolean | `false` | When `true`, `5xx` status codes will cause the health check to fail. |

To learn more about checks, please see our reference guide to [NodeBalancer health checks](/docs/platform/nodebalancer/nodebalancer-reference-guide/#health-checks).

## TLS Encryption

This section will describe how to set up TLS termination for a Service so that the Service can be accessed over `https`.

### Generating a TLS type Secret

Kubernetes allows you to store secret information in a Secret object for use within your cluster. This is useful for storing things like passwords and API tokens. In the context of the Linode CCM, Secrets are useful for storing Transport Layer Security (TLS) certificates and keys. The `linode-loadbalancer-tls` annotation requires TLS certificates and keys to be stored as Kubernetes Secrets with the type of `tls`. Follow the next steps to create a valid `tls` type Secret:

1.  Generate a TLS key and certificate using a TLS toolkit like [OpenSSL](https://www.openssl.org/). Be sure to change the `CN` and `O` values to those of your own website domain.

        openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.crt -subj "/CN=mywebsite.com/O=mywebsite.com"

2.  To create the secret, you can issue the `create secret tls` command, being sure to substitute `$SECRET_NAME` for the name you'd like to give to your secret. This will be how you reference the secret in your Service manifest.

        kubectl create secret tls $SECRET_NAME --key key.pem --cert cert.crt

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

### Defining TLS within a Service

In order to use `https` you'll need to instruct the Service to use the correct port through the proper annotations. Take the following code snippet as an example:

{{< file "nginx-serivce.yaml" yaml >}}
...
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-protocol: https
    service.beta.kubernetes.io/linode-loadbalancer-tls: '[ { "tls-secret-name": "my-secret",
      "port": 443 } ]'
...
{{</ file >}}

The `linode-loadbalancer-protocol` annotation identifies the `https` protocol. Then, the `linode-loadbalancer-tls` annotation defines which Secret and port to use for serving `https` traffic. If you have multiple Secrets and ports for different environments (testing, staging, etc.), you can define more than one secret and port pair:

{{< file "nginx-service-two-environments.yaml" yaml >}}
...
    service.beta.kubernetes.io/linode-loadbalancer-tls: |
      [ { "tls-secret-name": "my-secret", "port": 443 }. {"tls-secret-name": "my-secret-staging", "port": 8443} ]'
...
{{</ file >}}

Next, you'll need to set up your Service to expose the `https` port. The whole example might look like the following:

{{< file "nginx-service.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/linode-loadbalancer-protocol: https
    service.beta.kubernetes.io/linode-loadbalancer-throttle: "4"
    service.beta.kubernetes.io/linode-loadbalancer-tls: '[ { "tls-secret-name": "my-secret",
      "port": 443 } ]'
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
{{< /file >}}

Note that here the NodeBalancer created by the Service is terminating the TLS encryption and proxying that to port 80 on the NGINX Pod. If you had a Pod that listened on port `443`, you would set the `targetPort` to that value.

## Session Affinity

`kube-proxy` will always attempt to proxy traffic to a random backend Pod. To ensure that traffic is directed to the same Pod, you can use the `sessionAffinity` mechanism. When set to `clientIP`, `sessionAffinity` will ensure that all traffic from the same IP will be directed to the same Pod:

{{< file "session-affinity.yaml" yaml >}}
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  labels:
    app: nginx
spec:
  type: LoadBalancer
  selector:
    app: nginx
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 100
{{</ file >}}

You can set the timeout for the session by using the `spec.sessionAffinityConfig.clientIP.timeoutSeconds` field.

## Troubleshooting

If you are having problems with the CCM, such as the NodeBalancer not being created, you can check the CCM's error logs. First, you'll need to find the name of the CCM Pod in the `kube-system` namespaces:

    kubcetl get pods -n kube-system

The Pod will be named `ccm-linode-` with five random characters at the end, like `ccm-linode-jrvj2`. Once you have the Pod name, you can view its logs. The `--tail=n` flag is used to return the last `n` lines, where `n` is the number of your choosing. The below example returns the last 100 lines:

    kubectl logs ccm-linode-jrvj2 -n kube-system --tail=100

{{< note >}}
Currently the CCM only supports `https` ports within a manifest's spec when the `linode-loadbalancer-protocol` is set to `https`. For regular `http` traffic, you'll need to create an additional Service and NodeBalancer. For example, if you had the following in the Service manifest:

{{< file "unsupported-nginx-service.yaml" yaml >}}
...
spec:
  ports:
  - name: https
    port: 443
    protocol: TCP
    targetPort: 80
  - name: http
    port: 80
    protocol: TCP
    targetPort: 80
...
{{</ file >}}

The NodeBalancer would not be created and you would find an error similar to the following in your logs:

    ERROR: logging before flag.Parse: E0708 16:57:19.999318       1 service_controller.go:219] error processing service default/nginx-service (will retry): failed to ensure load balancer for service default/nginx-service: [400] [configs[0].protocol] The SSL private key and SSL certificate must be provided when using 'https'
    ERROR: logging before flag.Parse: I0708 16:57:19.999466       1 event.go:221] Event(v1.ObjectReference{Kind:"Service", Namespace:"default", Name:"nginx-service", UID:"5d1afc22-a1a1-11e9-ad5d-f23c919aa99b", APIVersion:"v1", ResourceVersion:"1248179", FieldPath:""}): type: 'Warning' reason: 'CreatingLoadBalancerFailed' Error creating load balancer (will retry): failed to ensure load balancer for service default/nginx-service: [400] [configs[0].protocol] The SSL private key and SSL certificate must be provided when using 'https'

Removing the `http` port would allow you to create the NodeBalancer.
{{</ note >}}

## Delete a NodeBalancer

To delete a NodeBalancer and the Service that it represents, you can use the Service manifest file you used to create the NodeBalancer. Simply use the `delete` command and supply your file name with the `f` flag:

    kubectl delete -f nginx-service.yaml

Similarly, you can delete the Service by name:

    kubectl delete service nginx-service

## Updating the CCM

The easiest way to update the Linode CCM is to edit the DaemonSet that creates the Linode CCM Pod. To do so, you can run the `edit` command.

    kubectl edit ds -n kube-system ccm-linode

The CCM Daemonset manifest will appear in vim. Press `i` to enter insert mode. Navigate to `spec.template.spec.image` and change the field's value to the desired version tag. For instance, if you had the following image:

    image: linode/linode-cloud-controller-manager:v0.2.2

You could update the image to `v0.2.3` by changing the image tag:

    image: linode/linode-cloud-controller-manager:v0.2.3

For a complete list of CCM version tags, visit the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags).

{{< caution >}}
The CCM Daemonset manifest may list `latest` as the image version tag. This may or may not be pointed at the latest version. To ensure the latest version, it is recommended to first check the [CCM DockerHub page](https://hub.docker.com/r/linode/linode-cloud-controller-manager/tags), then use the most recent release.
{{</ caution>}}

Press escape to exit insert mode, then type `:wq` and press enter to save your changes. A new Pod will be created with the new image, and the old Pod will be deleted.

## Next Steps

To further take advantage of Linode products through Kubernetes, check out our guide on how to use the [Linode Container Storage Interface (CSI)](/docs/applications/containers/deploy-volumes-with-the-linode-block-storage-csi-driver/), which allows you to create persistent volumes backed by Linode Block Storage.