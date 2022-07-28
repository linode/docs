---
slug: using-rbac-to-secure-an-lke-cluster
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: 'This guide describes how to create roles and set contexts for specific users to create an environment with limited kubernetes permissions.'
keywords: ["Kubernetes", "cluster", "docker", "security", "permissions"]
tags: ["security","nginx","kubernetes","container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-02-28
modified_by:
  name: Linode
title: 'Securing an LKE Cluster Through User Permissions and RBAC'
aliases: ['/kubernetes/securing-an-LKE-cluster/']
concentrations: ["Kubernetes"]
external_resources:
  - '[Kubernetes Documentation](https://kubernetes.io/docs/home)'
---

## Securing Kubernetes Users

In Linux administration, the application of [Users, Groups, and Permissions](/docs/guides/linux-users-and-groups/) is a tried and tested method for improving a security posture for a number of use cases. Kubernetes administration similarly applies the same concepts using **RBAC** (Role Based Access Control), **Service Accounts**, and more. For example, when interacting with a standard Kubernetes installation, the default behavior is for a singular `kubeconfig` file to provide unlimited access to the relevant cluster. With RBAC and Service accounts, kubeconfig files can be created for specific individuals in an organization, giving them access only to the parts of the cluster that they need.

## In This Guide

While the Linode Kubernetes Engine(LKE) is a managed Platform as a Service solution providing a base level of security, it does not by default handle the creation of roles and service accounts for any users that are configured on LKE. This guide will serve as a tutorial for creating a role and role binding for an example user in the example user's own namespace, so that users can export a custom Kubeconfig file for users to authenticate with for limited permissions. This way, all users in a specific cluster will not be required to have full administrator permissions.

### Before You Begin

This guide assumes you have a working Kubernetes cluster that was deployed using the Linode Kubernetes Engine (LKE). You can deploy a Kubernetes cluster using LKE in the following ways:

- The [Linode Cloud Manager](/docs/guides/deploy-and-manage-a-cluster-with-linode-kubernetes-engine-a-tutorial/).
- [Linode's API v4](/docs/guides/deploy-and-manage-lke-cluster-with-api-a-tutorial/).
- [Terraform](/docs/guides/how-to-deploy-an-lke-cluster-using-terraform/), the popular infrastructure as code (IaC) tool.

    {{< note >}}
An LKE cluster will already have Linode's Cloud Controller Manager installed in the cluster's control plane. If you **did not** deploy your Kubernetes cluster using LKE and would like to make use of the Linode Cloud Controller Manager, see [Installing the Linode CCM on an Unmanaged Kubernetes Cluster - A Tutorial](/docs/guides/installing-the-linode-ccm-on-an-unmanaged-kubernetes-cluster/).
    {{</ note >}}


## Create a new User

The following steps will provide a secure method for limiting user access to a cluster. An SSL certificate will be created for a user, approved by an administrator, and then applied to a limited `kubeconfig` for the user to use to gain access instead of the primary administrator kubeconfig file.

### Create Certificates and approve CSRs for a new user

In order for a user to securely authenticate to the Kubernetes server, an `x.509` certificate will be used, similar to how SSL/TLS is applied on a web browser. A **Certificate Signing Request** or CSR, allows the `.x.509` certificate to be approved and signed for use with Kubernetes. To apply a certificate and create a CSR, the following steps can be followed:

1. Create a new directory labeled `auth` to store any new user certificates that will be created. Navigate to this new directory following it's creation.:

       mkdir auth
       cd auth

1. Generate a new certificate for your user:

       openssl genrsa -out exampleuser.key 2048

    {{< note >}}
  The text `user` can be replaced with a username of your choice.
    {{< /note >}}

1. Generate a new certificate signing request file:

       openssl req -new -key exampleuser.key -out exampleuser.csr -subj "/CN=exampleuser"

1. Copy the key to the directory where kubectl is installed. This is usually the parent folder:

       cp exampleuser.key ..

1. Navigate back to the directory where kubectl is installed. From here, a generate a BASE64 string using the `.csr` file:

       cd ..
       less auth/exampleuser.csr | base64 | tr -d '\n'

   A base64 string will be outputted. Copy the output to be used in the next step.

1. Using a text editor of your choice, create a new CSR YAML file:

       sudo nano exampleusercsr.yaml

   The CSR YAML should reflect the following. Replace the string in the `request` field with the base64 string that was generated for your own csr file:

   {{< file >}}
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: exampleuser-csr
spec:
  groups:
    - system:authenticated
  request: OGY4d1pQRGlqT21NV2VXCjM4dFdjRmJrQXRyTXJ6YWZnWGRZS1VYb2Z2ZDhLalVPeUJEaFdoWTFJbjZ6NGpEZ2RTbm94K21SdlJxQTFOUEwKN2k0QVd4OFlKcEdVS0Uvb1VKREZDcHVYcE9SZVdUMnY3enhFTzE5QUpRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBRDg5T3JlUC
  signerName: kubernetes.io/kube-apiserver-client
  usages:
    - digital signature
    - key encipherment
    - client auth
  {{< /file >}}

1. Create the certificate signing request:

       kubectl create -f exampleusercsr.yaml

   You should see output resembling the following:

   {{< output >}}
   certificatesigningrequest.certificates.k8s.io/user1-csr created
   {{< /output >}}

   {{< note >}}
   If at any point the status of a CSR needs to be checked, the following command can be entered:

       kubectl get csr

   Additionally, although CSR's will be automatically deleted after enough time has passed, they can be manually deleted so that a new CSR can be attempted at any time using the following syntax:

       kubectl delete csr user1-csr
   {{< /note >}}

1. Through kubectl, approve the certificate for use with your Kubernetes cluster:

       kubectl certificate approve user1-csr

1. Export the `.crt` file from the Kubernetes API to receive a copy of your signed certificate, and save it to the `/auth/` directory:

       kubectl get csr user1-csr -o jsonpath='{.status.certificate}' | base64 --decode > ~/auth/exampleuser.crt

### Create a Limited Kubeconfig File

In order for a new limited user to interact with Kubernetes, they will need their own `Kubeconfig` file that does not include administrative permissions. The following steps will describe how to create this file.

1. To ensure that the original kubeconfig file is not overwritten without a backup, create a backup now:

       cp kubeconfig.yaml kubeconfigbackup.yaml

1. Add the new user to the `kubeconfig.yaml` file:

       kubectl config set-credentials exampleuser --client-certificate=/home/user/auth/exampleuser.crt --client-key=/home/user/auth/exampleuser.key

   Your Kubeconfig file should now reflect the following:

   {{< file >}}
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: oaiedjaoiu9833ed98whfc9h
    server: https://def4624b-5fbb-4ac6-ae70-77f28eb131fe.us-east-1.linodelke.net:443
  name: lke1111
contexts:
- context:
    cluster: lke1111
    namespace: default
    user: lke1111-admin
  name: lke1111-ctx
current-context: lke1111-ctx
kind: Config
preferences: {}
users:
- name: exampleuser
  user:
    client-certificate: exampleuser.crt
    client-key: exampleuser.key
- name: lke1111-admin
  user:
    token: OIAWHF09W08R08w4f0hs0efch8q088080HEHSC
   {{< /file >}}

1. To ensure that only a second limited user can access the cluster with limited permissions, an additional `kubeconfig` file must be created without administrative control:

       cp kubeconfig.yaml exampleuser_kubeconfig.yaml

1. The new `kubeconfig` file should **only** include configuration options for the limited user. Delete all administrative user lines of the new kubeconfig file, until the  `exampleuser_kubeconfig.yaml` file reflects the following:

   {{< file >}}
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: iuawhefIDWIDHI23EW98HICUH
    server: https://def4624b-5fbb-4ac6-ae70-77f28eb131fe.us-east-1.linodelke.net:443
  name: lke1111
contexts:
- context:
    cluster: lke1111
    user: exampleuser
  name: lke1111-ctx
current-context: lke1111-ctx
kind: Config
preferences: {}
users:
- name: exampleuser
  user:
    client-certificate: /home/user/auth/exampleuser.crt
    client-key: /home/user/auth/exampleuser.key
   {{< /file >}}

1. To test, switch the current context to the new `kubeconfig` file:

       export KUBECONFIG=exampleuser_kubeconfig.yaml

  Once exported, attempt to list all nodes in the cluster:

    kubectl get nodes

  If the configuration worked, the new user's kubeconfig should make the request fail with the following error:

{{< output >}}
Error from server (Forbidden): nodes is forbidden: User "exampleuser" cannot list resource "nodes" in API group "" at the cluster scope
{{< /output >}}

  The failure is expected, since the user currently does not have any roles or permissions defined. By default, new Kubernetes users will be unable to access any resources.

## Setting Permissions with RBAC

Permissions can be applied to a new user by creating a `role.yaml` and `rolebinding.yaml` file. In Kubernetes, a **Role** defines the permissions that are given to a specific group of users, and the **Rolebinding** applies the roles to specific users. For example, if you wanted to a give the `exampleuser` user created previously the ability to interact with pods in the `examplenamespace` namespace, a good configuration would be as follows:

1. Create a role.yaml file with the following contents:

{{< file >}}
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
 name: example-role
 namespace: examplenamespace
rules:
 - apiGroups: [""]
   resources: ["pods"]
   verbs: ["get", "watch", "list"]
{{< /file >}}

  The above example would allow any user with the assigned role to `get`, `watch`, and `list` resources in the `examplenamespace` namespace. The `name` `example-role` is a unique identifier which can be called when applying the `rolebinding` in the next step.

1. Once the role is created, create a `rolebinding.yaml` file to bind the role to your user:

{{< file >}}
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
 name: example-role-binding
 namespace: default
subjects:
 - apiGroup: rbac.authorization.k8s.io
   kind: User
   name: exampleuser
roleRef:
 apiGroup: rbac.authorization.k8s.io
 kind: Role
 name: example-role
{{< /file >}}

1. Apply both the `role.yaml` and the `rolebinding.yaml` to grant permission to the new user:

       kubectl apply -f role.yaml
       kubectl apply -f rolebinding.yaml

1. To test, switch the active kubeconfig and namespace to the ones created for the limited example user:

       export KUBECONFIG=exampleuser_kubeconfig.yaml
       kubectl config set-context --current --namespace=examplenamespace

1. If the configuration works, you should not see any errors when requesting information on active pods in the namespace:

       kubectl get pods

  However, if the user attempts to get information on nodes, or any other request that has not been explicitly configured, the request will fail with an error similar to the following:

  {{< output >}}
  Error from server (Forbidden): nodes is forbidden: User "exampleuser" cannot list resource "nodes" in API group "" at the cluster scope
  {{< /output >}}


## Next Steps

Now that the user has been successfully installed, the user's `kubeconfig` file may be exported for other users to use from their own `kubectl` clients, and the user can access the cluster with the limited permissions set by the administrator in their own namespace. Additionally security controls may still be applied, however will vary depending on your use case. **Admission Controllers** for example, are a great way to implement additional controls on authenticated and authorized requests. Applications on an LKE cluster can additionally be put behind a NodeBalancer and ingress with TLS enabled.  For more information, the following resources may be helpful:

- [Configuring Load Balancing with TLS Encryption](/docs/guides/how-to-configure-load-balancing-with-tls-encryption-on-a-kubernetes-cluster/)
- [Admission Controllers](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/)


















