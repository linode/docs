---
slug: getting-started-with-crossplane
title: "How to Use Crossplane"
description: "Crossplane extends Kubernetes as a universal control plane, meaning that you can use the familiar tools and features of Kubernetes to orchestrate and manage all of your infrastructure needs. Learn more about what Crossplane has to offer and how you can start with it in this tutorial."
keywords: ['crossplane kubernetes','crossplane examples','crossplane vs terraform']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-04-26
modified_by:
  name: Nathaniel Stickman
external_resources:
- '[Crossplane: Documentation](https://docs.crossplane.io/)'
---

Crossplane offers an open-source extension to Kubernetes for creating a universal control plane. With Crossplane, you can orchestrate and manage your broader infrastructure entirely with Kubernetes tools. Crossplane can interface with just about any cloud platform API, including Linode's, and provides features like API abstractions and Kubernetes's access control.

Find out all you need to know to get started with Crossplane in this tutorial. Learn more about what Crossplane is and how it compares to similar tools. And get step-by-step instructions to set up your own Crossplane instance.

## What Is Crossplane?

[Crossplane](https://www.crossplane.io/) creates cloud control planes across conceivably any cloud platform. Crossplane essentially extends Kubernetes into a universal control plane. With it, you can provision and manage your broader infrastructure needs using familiar Kubernetes manifests and APIs.

Crossplane's extension of Kubernetes as a universal control plane actually lets it interface with virtually any external API. That is the case whether you are deploying to a major cloud platform, [ordering a pizza](https://blog.crossplane.io/providers-101-ordering-pizza-with-kubernetes-and-crossplane/), or even leveraging another orchestration tool [like Terraform](https://github.com/upbound/provider-terraform).

### What Are Control Planes?

In the context of cloud resources, a *control plane* provides an interface to create resources and manage their lifecycles. A control plane thus corresponds with resource orchestration for cloud infrastructures.

Kubernetes itself is an example. A Kubernetes setup deploys and monitors resources, managing the state of each resource toward a given configuration.

Crossplane takes the Kubernetes control plane and extends it to a wider context. Whereas Kubernetes acts as a control plane for resources on a Kubernetes cluster, Crossplane acts as a *universal control plane*. Crossplane can be the interface for resources on virtually any cloud platform.

### Crossplane vs Terraform: What Are the Differences?

[Terraform](https://www.terraform.io/) stands as perhaps the most popular tool for infrastructure-as-code. Like Crossplane, Terraform lets you manage that infrastructure across a range of services. So what sets Crossplane apart from Terraform, and when should you use Crossplane instead of Terraform?

Fundamentally, the differences come down to the tool's intended uses. Terraform is a command-line tool for deploying infrastructure using declarative configurations. By contrast, Crossplane is a control plane that uses declarative configurations for creating and providing ongoing management of infrastructure.

Additionally, two significant functional differences stand out between the two tools. These differences primarily affect how the tools fit into an organization and team structure.

- Terraform's configurations do not update with changes on the deployed infrastructure. Terraform is oriented around deploying infrastructure, and changes to a Terraform configuration require reapplying the whole configuration.

    As a control plane, Crossplane uses its declarative configurations to actively maintain and modify the state of infrastructure. This means that Crossplane is not subject to the configuration "drift" that can occur with Terraform configurations.

- With Terraform, a collaborating developer needing some infrastructure access has to know both Terraform and the underlying API. Not only that, but the developer also needs granular access to the underlying resources.

    Crossplane can, by contrast, provide self-service interfaces. Crossplane uses operators that handle credentials and expose simple, abstracted interfaces for collaborating developers. That way, developers only need access to and a simple knowledge of the interface itself, rather than the granular aspects.

Finally, Crossplane's use of Kubernetes also makes it a favorable solution for teams already using Kubernetes. Crossplane takes advantage both of existing Kubernetes infrastructure as well as familiarity.

## How to Install Crossplane

Crossplane deploys to a Kubernetes cluster similar to many other Kubernetes applications. Once you have Crossplane installed on your cluster, you can take advantage of your kubectl tool to create and manage Crossplane resources.

Follow along with the steps in this section of the tutorial to set up your Kubernetes cluster and get Crossplane up and running on it.

### Setting Up a Kubernetes Cluster

Crossplane runs on a Kubernetes cluster, so you need one available to get started with it.

With Linode, you can readily deploy a Kubernetes cluster from the Cloud Manager. To do so, follow along with our guide [Linode Kubernetes Engine - Getting Started](/docs/products/compute/kubernetes/get-started/). Within a short while, you can have a fully-operational Kubernetes cluster deployed and configured.

The next steps for installing Crossplane require that you have an active Kubernetes cluster and a kubectl instance configured to manage it. All of which you can find covered in the LKE guide linked just above.

Once you have your Kubernetes cluster up and running, you additionally need to install [Helm](https://helm.sh/). Helm is a tool for installing and managing applications on Kubernetes clusters, and it is used to install Crossplane to your cluster.

To install Helm on your system, you can follow the relevant section of our guide [Installing Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/#install-helm).

### Deploying Crossplane with Helm

With Kubernetes running and Helm installed, you can now proceed to install Crossplane. Here you can see the necessary steps to install Crossplane via Helm and verify that Crossplane is running on your cluster.

1. Add the Crossplane repository to your Helm instance.

    ```command
    helm repo add crossplane-stable https://charts.crossplane.io/stable
    helm repo update
    ```

1. (Optional) Consider whether you want to customize your Crossplane installation. This tutorial does not leverage any custom settings, but you can see configuration options in the [official installation](https://docs.crossplane.io/v1.11/software/install/#installation-options) guide.

    Should you want to customize your installation, follow the link above to create a values file with the options — with the name `values.yml` for this example. Then add `-f values.yml` to the end of the installation command below to apply your configuration to the installation.

1. Install Crossplane. Following the official recommendations, this command sets up Crossplane in its own Kubernetes namespace.

    ```command
    helm install crossplane --namespace crossplane-system --create-namespace crossplane-stable/crossplane
    ```

1. Confirm the installation by checking on the Crossplane pods deployed to your cluster. It may take a short while for the pods to start up fully, so you may have to wait to see the `Running` status.

    ```command
    kubectl get pods --namespace crossplane-system
    ```

    ```output
    NAME                                      READY   STATUS    RESTARTS   AGE
    crossplane-766d6647bc-b57lz               1/1     Running   0          44s
    crossplane-rbac-manager-f94699c7c-zvvtb   1/1     Running   0          44s
    ```

## How to Use Crossplane

Crossplane is now running on your cluster, and you are ready to start using its control planes to deploy your own infrastructure. There are myriad options here — Crossplane is a universal control plane, with the ability to control an almost limitless range of external APIs.

To get you started, this section walks you through a fully-functioning example. The example shows you how to use the Linode provider for Crossplane to deploy a new Linode Compute instance.

While relatively simple, the example elaborated here provides a strong base model. You can readily build off of the configurations here to make Crossplane work for a diverse range of infrastructure needs.

{{< caution >}}
The configurations and commands used in this guide add one or more Linode instances to your account. Be sure to monitor your account closely in the Linode Cloud Manager to avoid unwanted charges.
{{< /caution >}}

1. The  provider allows you to deploy Linode instances with Crossplane.

1. Create a deployment manifest for installing the Linode provider, [provider-linode](https://marketplace.upbound.io/providers/linode/provider-linode/), to your Crossplane instance.

    ```file{title="provider.yml" lang="yaml"}
    apiVersion: pkg.crossplane.io/v1
    kind: Provider
    metadata:
      name: provider-linode
    spec:
      package: linode/provider-linode:v0.1.0
    ```

    *Providers* are Crossplane's tools for interfacing with external APIs. The Linode provider interfaces with the Linode API, allowing Crossplane to create and manage your Linode resources.

    You can see more of the wide range of providers available for Crossplane on the [Upbound Marketplace](https://marketplace.upbound.io/providers). (Upbound are the founders of Crossplane, and they maintain this provider repository.)

1. Apply the manifest you just created to install `provider-linode` onto the Kubernetes cluster.

    ```command
    kubectl apply -f provider.yml
    ```

    You can verify the installation with a kubectl command to list `provider` resources.

    ```command
    kubectl get providers
    ```

    ```output
    NAME              INSTALLED   HEALTHY   PACKAGE                                         AGE
    provider-linode   True        True      xpkg.upbound.io/linode/provider-linode:v0.0.7   15s
    ```

1. Create a Kubernetes manifest for deploying a new Linode Compute instance. This is where you start leveraging Crossplane and the Linode provider to provision resources.

    In this example manifest, you need to replace a few values with ones specific to your needs and your Linode account credentials.

    - Replace `${ROOT_PASSWORD}` with a root password to be used for the new Linode Compute instance

    - Replace `${LINODE_API_TOKEN}` with your Linode API personal access token, which you can get by following the relevant section of our guide on [Getting Started with the Linode API](/docs/products/tools/api/get-started/#get-an-access-token)

    - Replace `${SSH_PUBLIC_KEY}` with an SSH public key to be used to access the Linode Compute instance; learn more about SSH keys in our guide [Using SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/)

    ```file{title="deployment.yml" lang="yaml"}
    apiVersion: v1
    kind: Secret
    metadata:
      name: crossplane-secrets
      namespace: crossplane-system
    type: Opaque
    stringData:
      linodeRootPass: ${ROOT_PASSWORD}
      linodeCredentials: |
        {
          "token": "${LINODE_API_TOKEN}"
        }
    ---
    apiVersion: linode.upbound.io/v1beta1
    kind: ProviderConfig
    metadata:
      name: default
    spec:
      credentials:
        source: Secret
        secretRef:
          name: crossplane-secrets
          namespace: crossplane-system
          key: linodeCredentials
    ---
    apiVersion: instance.linode.upbound.io/v1alpha1
    kind: Instance
    metadata:
      annotations:
        meta.upbound.io/example-id: instance/v1alpha1/instance
      labels:
        testing.upbound.io/example-name: web
      name: web
    spec:
      forProvider:
        authorizedKeys:
        - ssh-rsa ${SSH_PUBLIC_KEY}
        image: linode/ubuntu20.04
        type: g6-standard-1
        label: crossplane-deployment-example
        region: us-southeast
        rootPassSecretRef:
          key: linodeRootPass
          name: crossplane-secrets
          namespace: crossplane-system
    ```

    This manifest consists of three parts, which perform these functions:

    - The `Secret` resource, `crossplane-secrets`, stores variables for your instance's root password and your Linode API token. Later resources can then use these.

    - The `ProviderConfig` resource provides initial configurations to be used by the upcoming resource. For the Linode provider, that just means pointing to the secret value with the Linode API token.

    - The `Instance` resource, `web`, articulates the details of the new Linode Compute instance to be created. This example creates a *Linode 2GB* instance in Atlanta and running Ubuntu 20.04.

        You can use the API endpoints to learn more about available instance [types](https://api.linode.com/v4/linode/types), [regions](https://api.linode.com/v4/regions), and [images](https://api.linode.com/v4/images).

1. Apply the deployment manifest, just as you would for deploying standard resources to a Kubernetes cluster.

    ```command
    kubectl apply -f deployment.yml
    ```

1. Verify that the instance has been deployed by using kubectl to fetch a list of `instance` resources.

    ```command
    kubectl get instances
    ```

    At first, you should see output like this, indicating that the instance provisioning has not yet completed.

    ```output
    NAME   READY   SYNCED   EXTERNAL-NAME   AGE
    web    False   True                     33s
    ```

    Try the command again shortly, and you should see the instance become `READY`, indicating that your Compute instance has been successfully provisioned.

    ```output
    NAME   READY   SYNCED   EXTERNAL-NAME   AGE
    web    True    True     45521497        2m46s
    ```

You can further verify the successful deployment through your Linode Cloud Manager. Navigate to the **Linodes** section, and you should see the new Compute instance listed. Using the example `deployment.yml` above, the new instance would be named `crossplane-deployment-example`, as shown here.

[![Linode Compute instance deployed with Crossplane](linode-crossplane-compute_small.png)](linode-crossplane-compute.png)

## Conclusion

With that, you have everything set up to start using Crossplane for as a universal control plane. Deploying the Linode instance in the example above shows you the basics of Crossplane's infrastructure management. And messing around with that deployment manifest can give you more ideas about how Crossplane manages its infrastructure.

But Crossplane is also a highly flexible tool, sure to have the features to accommodate your particular infrastructure needs. One valuable area to explore is actually Kubernetes's [role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) features. Crossplane can utilize these robust access-control features for its control planes, too.

To learn more about the concepts behind your Crossplane instance, take a look at Crossplane's [introduction](https://docs.crossplane.io/v1.12/getting-started/introduction/) documentation. This covers some of the most important concepts for making the most of your control planes. And for even more, follow the link below to the full Crossplane documentation.
