---
slug: terraform-vs-helm
title: "Comparing Terraform vs Helm: When to Use Each Tool"
title_meta: "Terraform vs Helm (Comparison Guide): When to Use Each Tool"
published: 2023-07-26
modified_by:
  name: Linode
description: "Learn how Terraform and Helm can be used to manage your Kubernetes clusters, including the benefits (and downsides) of each and when to use each tool."
keywords: ['terraform vs helm', 'helm charts vs terraform', 'kubernetes helm vs terraform']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributors: ["Nathaniel Stickman"]
---

Containerization, for all its efficiencies, often brings additional overhead --- especially when it comes to Kubernetes. Keeping up with infrastructure needs can be a major effort as your application grows.

Numerous tools have risen in response, promising to help you manage this growing complexity. Among these are Terraform and Helm, two options for making life with Kubernetes clusters easier. What sets these two tools apart? How do they compare and which one should you use? This guide aims to answer those questions. Through an overview of the two tools and a comparison of their roles, the guide helps you decide which tool to use (and when to use them both).

## What is Terraform?

Terraform is an open-source infrastructure as code (IaC) tool. With IaC, developers can provision environments using code instead of manually provisioning each piece of infrastructure, saving considerable time.

Terraform stands out as a leading IaC option, capable of creating cloud resources (such as virtual machines) from any one of its [providers](https://registry.terraform.io/browse/providers), including the [Linode provider](https://registry.terraform.io/providers/linode/linode/latest/docs). Additionally, it handles user and permission management, as well as security schemes.

One feature that sets Terraform apart is its use of a declarative language for provisioning environments. Developers do not need to script environment setup, which can be time-consuming and difficult to maintain. Instead, developers *declare* their infrastructure needs within [configuration files](https://developer.hashicorp.com/terraform/language/syntax/configuration), which are processed by Terraform so that the proper resources are deployed on the selected cloud provider.

Terraform is also cloud-agnostic, which has led to wide-spread use among teams that employ a multi-cloud strategy. Many competitors are first-party tools developed by the cloud providers themselves, like AWS CloudFormation and Google Cloud Deployment Manager. These tools only operate within their particular cloud environments (e.g., AWS and Google Cloud). Terraform, by contrast, can work with nearly all cloud providers and environments.

### Key Features

-   Set up and manage virtual machines, Kubernetes, and other cloud resources using declarative code.

-   Configure and maintain security schemes, users, and user permissions to ensure robust infrastructure security.

-   Simplify the process of modifying and/or enhancing infrastructure, allowing you to more easily adjust to your application's needs.

-   Understands software relationships, making it easier to monitor them and potentially reduce errors.

### Benefits

-   Declarative language for configuring infrastructure lets you represent your resource needs as code instead of manually creating infrastructure.

-   Immutable infrastructure that replaces servers rather than modifying them, streamlining maintenance.

-   Kubernetes provider to smoothly and easily provision and maintain Kubernetes clusters.

### Downsides

-   Does not always support the latest API from each cloud provider.

-   Since it uses a [state file](https://developer.hashicorp.com/terraform/language/state) to manage the state of each cloud resource, manually modifying a resource _outside_ of Terraform (like deleting a virtual machine manually) can cause issues.

## What is Helm?

Helm is a package manager for Kubernetes. Using Helm Charts, developers can package files and templates for applications and services. Helm can then convert your Charts to Kubernetes manifests and deploy them to Kubernetes clusters.

Helm uses a client-server architecture. A *Tiller* server lives on the Kubernetes cluster and interacts with the Kubernetes API to deploy and manage Kubernetes resources. Developers can then use Helm's command-line client to interact with the cluster via the Tiller server.

Helm stands out for letting developers deploy and manage Kubernetes manifests across multiple environments. It makes it possible to deploy Kubernetes packages to multiple Kubernetes environments simultaneously, from a single command.

Pairing that with its ability to package even complex applications for deployment, Helm is an excellent choice for continuous integration/continuous deployment (CI/CD).

### Key Features

-   Deploy and maintain Kubernetes resources across multiple environments. Helm can even deploy to multiple environments simultaneously with a single command.

-   Package applications into convenient bundles, simplifying deployments even for complex Kubernetes applications and services.

-   Efficient methods for rolling back and upgrading Kubernetes resources.

### Benefits

-   The use of a Tiller server grants full access to the Kubernetes API, facilitating effective management of run-time resources.

-   Provides a robust and easy-to-manage system for rollbacks.

-   Provides access to a repository of pre-built Helm Charts for a range of applications and services, simplifying integration into your cluster.

### Downsides

-   Adds an additional (and relatively complex) tool to your current workflows.

-   Helm's dependence on the Tiller server can pose security risks if not properly configured, potentially granting unauthorized access to the Kubernetes API.

## Determine When to Use Terraform vs Helm

Both Terraform and Helm can be used to make life easier when working with Kubernetes clusters. But each is a different tool for a different job. It's important to understand the roles of each application so that you can be equipped to choose the right one when managing your clusters.

### When to Use Terraform

Terraform, being an IaC tool, can be used to stand up the infrastructure for Kubernetes clusters through the use of its Kubernetes provider. However, Terraform does not operate inside the cluster. It can create and manage Kubernetes clusters, but it does not interact with anything that goes on within these clusters.

*Use Terraform if you need a tool for putting infrastructure in the hands of developers and lowering the effort for provisioning environments. Terraform should be your tool of choice for standing up Kubernetes clusters and preparing and managing environments.*

### When to Use Helm

Helm, on the other hand, is a Kubernetes package manager. It gives you tools for deploying manifests and managing Kubernetes resources on Kubernetes clusters. Helm Charts allow you to craft Kubernetes packages that can then be deployed as applications and services on a cluster. As such, Helm's purview ends at the boundaries of the cluster. It operates entirely within Kubernetes clusters and it cannot manage the setup and management of the cluster's infrastructure.

*Use Helm when you need a tool for deploying and managing Kubernetes resources or when you need to be able to package complex Kubernetes applications. Helm helps you when it comes to creating, deploying, and managing Kubernetes applications and services. It is especially useful when these applications and services get complex.*

### Using Both Helm and Terraform Together

As Terraform and Helm serve different roles, you can use them both together. The following outline covers how to use both tools in conjunction with your Kubernetes clusters. This is not the only way, but represents a common approach and gives you an idea of their capabilities.

-   Use Terraform to plan out and build your team's infrastructure. Terraform's Kubernetes provider gives you an effective tool for provisioning your cluster. In addition, Terraform includes a Helm provider that can even set up initial states for your Helm applications.

-   Terraform then stands as your tool for managing that infrastructure. As your applications scale or their environmental requirements change, use Terraform's declarative configuration to put the necessary changes into effect.

-   Use Helm to plan out and execute deployments within the cluster. Package your Kubernetes applications and services using Helm Charts. Helm then provides you with an effective means of rolling out your applications and services across the infrastructure, regardless of their complexity.

-   Helm becomes your resource for managing your Kubernetes applications and services. Its smoothed-out process for rolling out Kubernetes manifests can help you whenever you need to deploy new or updated resources.

One caveat to using Helm and Terraform together is the added complexity that may complicate your work. The combination leaves developers working to manage a tool for infrastructure and a tool for Kubernetes application deployments. Despite this complexity, using both tools together remains a solid choice for complex environments where both infrastructure and deployments need to be able to scale and adapt to developing needs.

## Going Further

With the information provided in this guide, you should now be equipped to make an informed decision between Terraform and Helm, or even consider using them in tandem. To learn more about these tools, review some of our other resources:

-   Navigate to the [Terraform](/docs/guides/applications/configuration-management/terraform/) section for a list of related guides.

-   For Helm, you can start with our [Introduction to Helm | LKE Workshop](https://www.linode.com/content/introduction-to-helm-lke-workshop-with-jerome-petazzoni/) video. Then, dive deeper with our [How to Install Apps on Kubernetes with Helm 3](/docs/guides/how-to-install-apps-on-kubernetes-with-helm-3/) guide.