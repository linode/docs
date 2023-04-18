---
slug: what-is-kubernetes-cert-manager
description: "Learn how cert-manager works, a tool on Kubernetes designed to assist with the deployment, configuration, and management of certificates on Kubernetes."
keywords: ["kubernetes", "linode kubernetes engine", "managed kubernetes", "lke", "kubernetes cluster", "ssl", "certbot", "lets-encrypt", "tls"]
tags: ["secuity","kubernetes"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-13
modified_by:
  name: Linode
title: 'Understanding Kubernetes cert-manager'
title_meta: 'What is Kubernetes cert-manager?'
aliases: ['/kubernetes/deploy-and-manage-kubernetes-certificates-with-cert-manager/','/kubernetes/what-is-kubernetes-cert-manager/']
external_resources:
 - '[Cert-Manager Documentation](https://cert-manager.io/docs/)'
authors: ["Linode"]
---

## What is cert manager?

Cert-manager is a Kubernetes add-on designed to assist with the creation and management of TLS certificates. Similar to [Certbot](/docs/guides/secure-http-traffic-certbot/), cert-manager can automate the process of creating and renewing self-signed and signed certificates for a large number of use cases, with a specific focus on container orchestration tools like Kubernetes.

{{< note >}}
This guide assumes a working knowledge of Kubernetes key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes/) series.
{{< /note >}}

## Understanding Cert Manager Concepts

Cert-Manager is divided into a number of components and microservices that are each designed to perform specific tasks necessary for the certificate lifecycle.

### Issuers and ClusterIssuers

Certificate creation begins with `Issuers` and `ClusterIssuers`, resources that represent certificate authorities and are able to generate signed certificates using a specific issuer `type`. An issuer `type` represents the method used to create your certificate, such as `SelfSigned` for a [Self-Signed Certificate](/docs/guides/create-a-self-signed-tls-certificate/) and `ACME` for requests for certificates from ACME servers, typically used by tools like [Let's Encrypt](https://letsencrypt.org/). All supported issuer types are listed in [Cert-Manager's Documentation](https://cert-manager.io/docs/configuration/).

While `Issuers` resources are only able to create certificates in the namespace they were created in, `ClusterIssuers` can create certificates for all namespaces. This guide provides an example that demonstrates how `ClusterIssuers` creates certificates for all namespaces in the cluster.

### Certificates and CertificateRequests

Although Issuers are responsible for defining the method used to create a certificate, a `Certificate` resource must also be created to define how a certificate is renewed and kept up to date.

After a `Certificate` resource is created, changed, or a certificate referenced needs renewal, cert-manager creates a corresponding `CertificateRequest` resource, which contains the base64 encoded string of an `x509` certificate request (CSR). Additionally, if successful, it contains the signed certificate where one is successfully returned and updates the `Ready` condition status to `True`.

{{< note >}}
A `CertificateRequest` resource is not designed to interact with a user directly, and instead is utilized through controllers or similar methods where needed.
{{< /note >}}

### ACME Orders and Challenges

For external certificates from ACME servers, cert-manager must be able to solve ACME challenges in order to prove ownership of DNS names and addresses being requested.

An `Order` resource represents and encapsulates the multiple ACME challenges the certificate request requires for domain validation. The `Order` resource is created automatically when a `CertificateRequest` referencing an ACME `Issuer` or  has been created.

`Challenge` resources represent all of the steps in an ACME challenge that must be completed for domain validation. Although defined by the `Order`, a separate `Challenge` resource is created for each DNS name that is being validated, and each are scheduled separately.

ACME `Order` and `Challenge` resources are **only** created for `Issuers` and `ClusterIssuers` with a `type` of `ACME`.

{{< note >}}
An `order` or `challenge` resource is never manually created directly by a user and are instead defined through `CertificateRequest` resources and the `Issuers` type. After it is issued, `order` and `challenge` resources cannot be changed.
{{< /note >}}

This feature includes the ability to request certificates through Let's Encrypt.

## Installing Cert-Manager

Cert-Manager can be easily installed through a single command as follows:

```command
kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.yaml
```

As the installation completes, you should see a number of required resources created, including a `cert-manager` namespace, RBAC rules, CRD's, and a webhook component. To confirm that the installation was a success, enter the following:

```command
kubectl get pods --namespace cert-manager
```

The output is similar to the following:

```output
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-766d5c494b-l9sdb              1/1     Running   0          19m
cert-manager-cainjector-6649bbb695-bz999   1/1     Running   0          19m
cert-manager-webhook-68d464c8b-86tqw       1/1     Running   0          19m
```

## Next Steps

To learn how to apply some of the concepts learned in this guide, see the [Configuring Load Balancing with TLS Encryption on a Kubernetes Cluster](/docs/guides/how-to-configure-load-balancing-with-tls-encryption-on-a-kubernetes-cluster/) guide.