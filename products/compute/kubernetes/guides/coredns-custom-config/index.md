---
slug: coredns-custom-config
title: "Create A Custom CoreDNS Configuration"
description: "Learn how to create a custom CoreDNS configuration for your cluster hosted through LKE."
published: 2024-03-12
aliases: ['/guides/create-a-custom-coredns-configuration-in-linode-kubernetes-engine/']
keywords: ['CoreDNS','Corefile','DNS']
external_resources:
- '[CoreDNS](https://coredns.io/)'
- '[Corefile Explained](https://coredns.io/2017/07/23/corefile-explained/)'
- '[Server Block](https://coredns.io/manual/configuration/#server-blocks)'
---

## CoreDNS In LKE

Linode Kubernetes Engine (LKE) provides out of the box intra-cluster domain name resolution via [CoreDNS](https://coredns.io/), the *DNS server*. Every new cluster is provided with a minimal, default CoreDNS configuration, which can be customized to suit your workload's needs.

## Before You Begin

This guide assumes you have a working [Linode Kubernetes Engine (LKE)](https://www.linode.com/products/kubernetes/) cluster running on Linode and you are familiar with Corefile, the *CoreDNS configuration file*.

1.  [Install the Kubernetes CLI](/docs/products/compute/kubernetes/guides/kubectl/) (`kubectl`) on the local computer.

1.  Follow the instructions in [Deploying and Managing a Cluster with Linode Kubernetes Engine Tutorial](/docs/products/compute/kubernetes/) to connect to an LKE cluster.

    {{< note >}}
    Ensure that the `KUBECONFIG` context is [persistent](/docs/products/compute/kubernetes/guides/kubectl/#persist-the-kubeconfig-context)
    {{< /note >}}

1.  Ensure that Kubernetes CLI is using the right cluster context. Run the `get-contexts` subcommand to check:

    ```command
    kubectl config get-contexts
    ```

## Default CoreDNS Configuration

You can view your cluster's default CoreDNS configuration by using the following command:

```command
kubectl get configmap -n kube-system coredns-base -o yaml
```

The output will resemble the following:

```output
apiVersion: v1
data:
  Corefile: |
    .:53 {
        errors
        health {
           lameduck 5s
        }
        ready
        kubernetes cluster.local in-addr.arpa ip6.arpa {
           pods insecure
           fallthrough in-addr.arpa ip6.arpa
           ttl 30
        }
        prometheus :9153
        forward . /etc/resolv.conf {
           max_concurrent 1000
        }
        cache 30
        loop
        reload
        loadbalance
        import custom/*.include
    }
    import custom/*.server
kind: ConfigMap
metadata:
  name: coredns-base
  namespace: kube-system
  [...]
```

The default CoreDNS configuration is located under the `Corefile` field in the above ConfigMap.

{{< note type="warning" >}}
Do not modify the `kube-system/coredns-base` ConfigMap that comes with your LKE cluster. It may be restored to its original state at any time and without notice.
{{< /note >}}

## Custom CoreDNS Configuration

The default CoreDNS configuration leverages the CoreDNS [`import`](https://coredns.io/plugins/import/) plugin to enable customization. Configuration extensions are added through fields in the `kube-system/coredns-custom` ConfigMap:

```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: coredns-custom
      namespace: kube-system
    data:
      sample.include: |
        # Added to the .:53 default Server Block.
      sample_a.server: |
        # Additional Server Block.
      sample_b.server: |
        # Another Server Block.
```

- Fields suffixed with `.include` are added to the default [*Server Block*](https://coredns.io/manual/configuration/#server-blocks).
- Fields suffixed with `.server` are added as new Server Blocks.

### Create A Custom Configuration

1.  Create a manifest for a ConfigMap named `coredns-custom` in the `kube-system` namespace, with the desired configuration. For the purpose of this guide, an example custom configuration is used. Save it as the `coredns-custom.yaml` file.

    ```yaml
    apiVersion: v1
    kind: ConfigMap
    metadata:
      name: coredns-custom
      namespace: kube-system
    data:
      # Log all incoming DNS queries.
      log.include: |
        log
      # Private DNS resolution example. Handles FQDN resolutions for *.mydomain.com
      # Replace <dns-private-ip> with the target IP address.
      mydomain.server: |
        mydomain.com.:53 {
          forward . <dns-private-ip>
        }
    ```

2.  Apply the above ConfigMap manifest:

    ```command
    kubectl apply -f coredns-custom.yaml
    ```

    {{< note >}}
    CoreDNS will attempt to reload the configuration within 45 seconds after the last modification.
    {{< /note >}}

3.  Ensure the custom configuration has been loaded:

    ```command
    kubectl logs -n kube-system -l k8s-app=kube-dns
    ```

    For the custom configuration shown above, the output will resemble the following, after the reload is complete:

    ```output
    [INFO] Reloading
    [INFO] plugin/health: Going into lameduck mode for 5s
    [INFO] 127.0.0.1:60399 - 40866 "HINFO IN 349145763287755047.2816822520842364744. udp 56 false 512" NXDOMAIN qr,rd,ra 131 0.000980597s
    [INFO] plugin/reload: Running configuration SHA512 = 868c96ccca274c442fefc8db8e98b1f4a5cd05c655db1d990803d4019e5d28af101b24a78f85bae7ab3a3f8894f2791fda9d2b4d9c6ae1aa942080e1a88ce3e6
    [INFO] Reloading complete
    ```

    The custom configuration is now in effect.

{{< note >}}
The `kube-system/coredns-custom` ConfigMap is persistent and will not be affected by LKE maintenance operations.
{{< /note >}}

### Restore The Defaults

1. To restore the default CoreDNS configuration, simply delete the `coredns-custom` ConfigMap:

   ```command
   kubectl delete -n kube-system coredns-custom
   ```

1.  Check the logs to make sure the reload was successful:
  
    ```command
    kubectl logs -n kube-system -l k8s-app=kube-dns
    ```

    The output looks similar to the one emitted after applying the custom configuration.

    ```output
    [INFO] Reloading
    [INFO] plugin/health: Going into lameduck mode for 5s
    [WARNING] No files matching import glob pattern: custom/*.include
    [WARNING] No files matching import glob pattern: custom/*.server
    [INFO] plugin/reload: Running configuration SHA512 = 591cf328cccc12bc490481273e738df59329c62c0b729d94e8b61db9961c2fa5f046dd37f1cf888b953814040d180f52594972691cd6ff41be96639138a43908
    [INFO] Reloading complete
    ```

    The emitted warning messages are now to be expected, and should not be a concern.
