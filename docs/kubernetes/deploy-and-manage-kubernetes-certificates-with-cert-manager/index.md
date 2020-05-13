---
author:
  name: Linode
  email: docs@linode.com
contributor:
  name: Linode
  link: https://linode.com
description: "Deploying Cert-Manager on Kubernetes"
keywords: ["kubernetes", "linode kubernetes engine", "managed kubernetes", "lke", "kubernetes cluster", "ssl", "certbot", "lets-encrypt", "tls"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-13
modified_by:
  name: Linode
title: 'Deploy and Manage Cert-Manager on Kubernetes'
h1_title: A Tutorial for Deploying and Managing TLS Certificates on Kubernetes with Cert-Manager.
external_resources:
 - '[Cert-Manager Documentation](https://cert-manager.io/docs/)'
---

## What is cert manager

Cert-manager is a Kubernetes add-on designed to assist with the creation and management of TLS certificates. Similar to [Certbot](https://www.linode.com/docs/quick-answers/websites/secure-http-traffic-certbot/), cert-manager can automate the process of creating and renewing self-signed and signed certificates for a large number of use cases, with a specific focus on container orchestration tools like Kubernetes.

## In This Guide

In this guide you will learn about how cert-manager works to create certificates, many of the options available for creating certificates, and then use cert Manager to create two public signed certificates using only Kubernetes and cert-manager tooling.

## Before you Begin

- Follow our guide to [Deploying an Ingress](/docs/kubernetes/how-to-deploy-nginx-ingress-on-linode-kubernetes-engine/). The final example of this guide will use the same configuration, cluster, and domains.
- You should have a working knowledge of Kubernetes' key concepts, including master and worker nodes, Pods, Deployments, and Services. For more information on Kubernetes, see our [Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes/) series.

## Understanding Cert Manager Concepts

Cert-Manager is divided into a number of components and microservices that are each designed to perform specific tasks necessary for the certificate lifecycle.


### Issuers and ClusterIssuers

Certificate creation begins at the `Issuers` and `ClusterIssuers` resources that represent certificate authorities and are able to generate signed certificates using a specific issuer `type`. An issuer `type` represents the method that will be used to create your certificate, such as `SelfSigned` for a [Self-Signed Certificate](/docs/security/ssl/create-a-self-signed-tls-certificate/) and `ACME` for requests for certificates from ACME servers, typically used by tools like [Let's Encrypt](https://letsencrypt.org/). A full list of supported issuer types can be found in [Cert-Manager's Documentation](https://cert-manager.io/docs/configuration/).

While `Issuers` resources are only able to create certificates in the namespace they were created in, `ClusterIssuers` can create certificates for all namespaces.


### Certificates and CertificateRequests

Although Issuers are responsible for defining the method used to create a certificate, a `Certificate` resource must also be created to define how a certificate will be renewed and kept up to date.

Once a `Certificate` resource is created, changed, or a certificate referenced needs renewal, cert-manager will create a corresponding `CertificateRequest` resource, created by cert-manager which contains the base64 encoded string of an `x509` certificate request (CSR). Additionally, if successful, it will contain the signed certificate where one is successfully returned and cause the `Ready` condition to be updated with a status of `True`.

{{< note >}}
A `CertificateRequest` resource is not designed to be interacted with directly by a user, and instead is utilized through controllers or similar methods where needed.
{{< /note >}}

### ACME Orders and Challenges

For external certificates from ACME servers, cert-manager must be able to solve ACME challenges in order to prove ownership of DNS names and addresses being requested.

An `Order` resource represents and encapsulates the multiple ACME challenges the certificate request requires for domain validation. The `Order` resource is created automatically when a `CertificateRequest` referencing an ACME `Issuer` or  has been created.

`Challenge` resources represent all of the steps in an ACME challenge that must be completed for domain validation. Although defined by the `Order`, a separate `Challenge` resource is created for each DNS name that is being validated, and each are scheduled separately.

ACME `Order` and `Challenge` resources are **only** created for `Issuers` and `ClusterIssuers` with a `type` of `ACME`.

{{< note >}}
An `order` or `challenge` resource is never manually created directly by a user and are instead defined through `CertificateRequest` resources and the `Issuers` type. Once issued, `order` and `challenge` resources cannot be changed.
{{< /note >}}

This feature includes the ability to request certificates through Let's Encrypt.

## Installing Cert-Manager

Cert-Manager can be easily installed through a single command as follows:

    kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.15.0/cert-manager.yaml

As the installation completes, you should see a number of required resources created, including a `cert-manager` namespace, RBAC rules, CRD's, and a webhook compononent. To confirm that the installation was a success, enter the following:

    kubectl get pods --namespace cert-manager

This should return output similar to the following:

{{< output >}}
NAME                                       READY   STATUS    RESTARTS   AGE
cert-manager-766d5c494b-l9sdb              1/1     Running   0          19m
cert-manager-cainjector-6649bbb695-bz999   1/1     Running   0          19m
cert-manager-webhook-68d464c8b-86tqw       1/1     Running   0          19m
{{< /output >}}

### Using Cert-Manager to Create Certificates

The following example will create an ACME certificate signed using let's encrypt.

To begin, define a [ClusterIssuer](#issuers-and-clusterissuers) resource manually, replacing `myemail@website.com` with your own personal email address which will be used for ACME registration:

{{< file "my-new-issuer.yaml" yaml >}}
apiVersion: cert-manager.io/v1alpha2
kind: ClusterIssuer
metadata:
  name: letsencrypt-certmanager
spec:
  acme:
    # Replace this e-mail with your own to be used for ACME registration
    email: myemail@website.com
    server: https://acme-v02.api.letsencrypt.org/directory
    privateKeySecretRef:
      name: letsencrypt-private-key
    # Add a single challenge solver, HTTP01 using nginx
    solvers:
    - http01:
        ingress:
          class: nginx
{{< /file >}}

In the above example, note that we've also referenced a `privateKeySecretRef` attribute, which will create a secret resource using the specified name for storing the account's private key.

Then enter the following to create the resource:

    kubectl create -f my-new-issuer.yaml

You should see a confirmation message that the resource was successfully created.

Finally, edit your Ingress to include the annotation for the cert-manager resource, add the `tls` block to define the domains that need certificates, and the  name of the `privateKeySecretRef ` in the `secretName` field.

{{< file "my-new-ingress.yaml" yaml >}}
metadata:
  name: my-new-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-certmanager
spec:
  tls:
  - hosts:
    - shop.example.com
    - blog.example.com
    secretName: letsencrypt-private-key
  rules:
  - host: shop.example.com
    http:
      paths:
      - backend:
          serviceName: hello-one
          servicePort: 80
  - host: blog.example.com
    http:
      paths:
      - backend:
          serviceName: hello-two
          servicePort: 80
{{< /file >}}

Once you're satisfied with your configuration, apply it with the following:

    kubectl apply -f my-new-ingress.yaml

{{< note >}}
In the above example, the `http01` stanza makes it clear that you will be performing the ACME challenge via the HTTP-01 challenge type. For more information on how this works, see Let's Encrypt's [documentation](https://letsencrypt.org/docs/challenge-types/#http-01-challenge)
{{< /note >}}

Now that the resource has been applied, you may now navigate to your subdomains `https://blog.example.com` and `https://shop.example.com` to see them resolve using SSL/TLS encryption.


