---
slug: use-carvel-with-kubernetes
title: "Deploy and Manage Resources on Kubernetes With Carvel"
title_meta: "How to Use Carvel to Deploy and Manage Kubernetes Resources"
description: "Extend Kubernetes using Carvel tools. Discover how to create custom resources and manage them effectively in your Kubernetes environment."
authors: ["Cameron Laird"]
contributors: ["Cameron Laird"]
published: 2024-05-30
keywords: ['carvel','Kubernetes','Gitops','Yaml','Package management','Images','docker','Continuous delivery (CD)']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

The [Carvel toolkit](https://carvel.dev/) is a collection of open source command-line executables designed to use with [Kubernetes](/docs/guides/kubernetes/) and its components. Kubernetes is the most popular platform for [orchestration](/docs/guides/cloud-containers/) of [containers](/docs/guides/applications/containers/), and focuses on automation of deployment, scaling, and management of containerized applications.

`kbld`, the [Kubernetes Build Tool](https://github.com/carvel-dev/kbld), is a command-line utility that builds container images and populates image references within Kubernetes resource files. Before `kbld`, devops practitioners would often "manually" construct images. `kbld` conveniently automates most of these common operations. As of this writing, Carvel includes seven such utilities.

## Before You Begin

To follow the examples presented in this guide, you need a Compute Instance to serve as your `kubectl` workstation and a Kubernetes cluster. Follow the steps outlined in the links below to set up the test environment.

1.  If you have not already done so, create a Linode account and Compute Instance to serve as your `kubectl` workstation. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides. A Nanode 1GB, Shared CPU instance is sufficient for the examples in this article. This guide uses 24.04 LTS but the steps should be broadly applicable on most Linux distributions.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1.  Follow our [Linode Kubernetes Engine - Get Started](/docs/products/compute/kubernetes/get-started/) guide to install `kubectl` on your workstation and deploy a Kubernetes cluster.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Package Manager

Package management generally refers to automating installation, upgrading, configuration, and removal of dependencies. For instance, a particular financial Web application might be written in Java. In this case, successful deployment depends several factors. These include the application-specific JAR files, coordination with an appropriate Java run-time asset, and proper license confirmation. Package management undertakes all of these responsibilities.

One of Carvel's seven tools is [`kapp-controller`](https://github.com/carvel-dev/kapp-controller), which manages packages through Custom Resource Definitions (CRDs).

## Manage Deployments as "Apps"

`kapp` is more than just package management. It organizes Kubernetes assets into "apps". In a Carvel context, an "app" collects Kubernetes resources into a cohesive application stack. `kapp` then simplifies and streamlines deployment and management of these stacks.

In a conventional Kubernetes installation, an application is a set of related resources, all of which appear in individual resource files. In contrast, `kapp`'s app manifest is a single file that captures the desired state of the application. This includes secrets, configuration maps, deployments, services, and other Kubernetes resources. Consolidation of these elements in a single manifest simplifies their maintenance.

This consolidated manifest makes it possible to deploy the application as a single "app" using the following command:

```command
kapp deploy -a myapp -f app-manifest.yml
```

`kapp` includes versioning intelligence, so when the same command is invoked later, it checks the state of all resources then deploys any necessary changes.

## Immutable Containers

Think of [immutability](https://www.techtarget.com/searchitoperations/definition/immutable-infrastructure) this way: a few computing generations ago, updating the operating system of a server was as a skilled task for an experienced system administrator. The administrator updated or *mutated* the installation so that it moved from the older release to the newer release. Standard practice of the time avoided wiping the machine clean and installing "from scratch", generally because it was deemed too time-consuming.

The alternative approach to migration involves completely removing the old software and installing the new version "on bare metal". This avoids any contamination from the previous installation."

This latter *immutable* approach yields results that are both more *reproducible* and less expensive.

Operational immutability applies this general approach specifically to [container technologies](/docs/guides/applications/containers/). To achieve immutability for a particular run-time environment: start with a standard container, apply specific declarative enhancements to it, and produce a highly-reproducible result. Containerization, and reliance on immutable containers, is central to Kubernetes, and Carvel inherits the same attitude in favor of immutability. It is also one of *GitOps* principles.

## Building Images

Along with building container images, `kbld` manages image references in Kubernetes manifests. This simplifies one of the many error-prone aspects of manual management of Kubernetes.

`kbld` typically appears in command-line invocations as follows:

```command
kbld -f images.yml -f other-manifests.yml -o bundle.yml
```

For example:
-   `images.yml` specifies managed images, their locations in the filesystem, and their intended tags.
-   `other-manifests.yml` is an optional Kubernetes manifest that also references the images.
-   `bundle.yml` is `kbld`'s output. It conforms to existing Kubernetes practices and can be applied using `kubectl apply -f bundle.yml` to update the Kubernetes installation with the images built by `kbld`.

`kbld` streamlines image management in Kubernetes environments by decoupling image building from deployment. It also promotes GitOps values, especially in managing image references in manifests.

## Secrets Management

Secrets encompass everything from your Akamai account password to the birthdate in one of your customer’s profiles. Protection and management of these secrets is important in commercial computing, and Carvel offers considerable benefits.

### Simplified Management

Carvel helps provide unified, consistent access to secrets. Even in isolation, the reduced need to interact directly with low-level Kubernetes objects, and the rationalization of necessary interactions, improves the security profile of a Kubernetes project.

### IaC

Carvel promotes secrets management in version-controlled configuration files. This is consistent with the [Infrastructure as Code](/docs/guides/introduction-to-infrastructure-as-code/) (IaC) philosophy, and makes secrets management easier to audit, safer for collaboration, and versioned. IaC enables software operations such as rollback, rollforward, and rotation. Git workflows, including integrated [Continuous Integration/Continuous Deployment](/docs/guides/introduction-ci-cd/) (CI/CD) pipelines, can be applied to secrets. This helps ensure that humans can only view secrets in accord with explicit policy. All of these qualities contribute towards compliance.

### Overlays, Templating, Parametrization, and Re-Use

The `ytt` YAML templating tool encourages secrets templating. This brings opportunities to manage secrets more consistently across environments, projects, and applications. `ytt` overlays are smart enough to allow for re-use of secrets in development environments, while keeping production secrets strictly separate.

### Decoupled Secrets

Overlays and other Carvel mechanisms also help move secrets out of application manifests. The result is that secrets management is kept separate from applications management, reducing accidental leaks. The decrease in likelihood that secrets may turn up in code reviews is a considerable benefit on its own.

### Reproducibility

Handling secrets through IaC boosts confidence that secrets are applied correctly. In turn, this minimizes the likelihood of delays in debugging, forensic, or other investigations. These security advantages are important enough to make Carvel use compelling.

## What is GitOps?

[GitOps](/docs/guides/gitops-principles-and-workflow/) is a collection of attitudes and practices about how best to manage software deployments. Understanding GitOps requires basic knowledge of several underlying concepts.

First, GitOps largely focuses on continuous deployment (CD) in [*cloud-native*](/docs/guides/what-is-cloud-native-computing/) contexts. This Guide treats "continuous deployment" and "continuous delivery" synonymously. "Cloud-native" expresses that programmers and operators are focused on the Cloud as a delivery environment. This is in contrast to an "on-premises" model, for example, where software is installed on individual workstations.

In cloud-native context, GitOps emphasizes [Git](/docs/guides/how-to-configure-git/) [version control](/docs/guides/introduction-to-version-control/) as the "single source of truth" for defining, deploying, and maintaining applications and their underlying infrastructure. GitOps maintains all configuration in declarative sources that are captured in Git. Modern computing boasts a wealth of knowledge about how such sources are managed. For example, changes to state are achieved by updating configurations, often through detailed procedures involving review, *branch* coordination, and allied concepts. GitOps further emphasizes *immutability*, in the sense that changes are achieves by the creation of new reproducible assets, rather than modification of existing state. The concept and benefits of immutability apply to many infrastructure assets.

Carvel fits this framework. Carvel's tools manage declarative configuration sources. They integrate fully with Git and CI/CD pipelines. They are highly regular across desktop development and cloud delivery environments. They encourage best practices with secrets. Carvel can help make the most of Kubernetes in any GitOps initiative.

## Carvel vs. Helm

Carvel and Helm are simultaneously competitors and teammates. Each Carvel tool has clearly defined functionality, making them useful for small chores in a larger Helm-dominated project. At the same time, `ytt` and other Carvel tools also serve as *replacements* for Helm.

Both have enough strengths and weaknesses that a full analysis is outside the scope of this guide. Whatever your commitment to Helm is, learn enough Carvel to analyze the smartest ways to apply it to make your overall Kubernetes project more powerful.

## Installation of Carvel Tools

How to [install Carvel tools](https://carvel.dev/#install) depends on your computing environment. However, many macOS and Linux users already manage their development desktops with [Homebrew](https://brew.sh/). If this is your situation, the installation of Carvel tools is very straightforward:

```command
brew tap carvel-dev/carvel
brew install ytt kbld kapp imgpkg kwt vendir kctrl
```

Verify the installations with the following command:

```command
ytt version
kbld version
kapp version
imgpkg version
kwt version
vendir version
kctrl version
```

## What is a Custom Resource Definition (CRD)?

Users define their own resource types using an extension mechanism in Kubernetes called a [custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) definition (CRD). These new resources are native to Kubernetes and can be managed using the Kubernetes *[Application Programming Interface](https://kubernetes.io/docs/concepts/overview/kubernetes-api/) (API)*. CRDs provide a way to extend Kubernetes’ basic functionality by defining new types of resources with their own behavior and schema. They can be created, updated, and deleted, just like any other built-in resource. CRDs enable users to extend Kubernetes to fit their specific use cases and domain-specific requirements.

### CRDs in Kubernetes

A Kubernetes resource is an endpoint in the Kubernetes API. The API is the service which communicates with end users and components involved in Kubernetes. Communications are commonly about API objects such as [*pods*](https://kubernetes.io/docs/concepts/workloads/pods/) and [*events*](https://kubernetes.io/docs/reference/kubernetes-api/cluster-resources/event-v1/).

Within this framework, a custom resource extends or customizes the base API. Useful API work typically starts with the command-line utility [`kubectl`](https://kubernetes.io/docs/reference/kubectl/). Just as `kubectl` is fundamental to basic Kubernetes operations, the same `kubectl` equally manages CRDs as well-behaved extensions. In the cloud vernacular, "extension" means that enhanced or customized functionality is available using the same techniques as for basic or default operations.

### Carvel Uses CRDs to Extend Kubernetes

Carvel leverages CRDs to extend the functionality of Kubernetes. Users define higher-level abstractions and control application behavior declaratively. Complex configurations, such as deployment and management of *Helm* charts and manifests, can be defined using CRDs. This makes CRDs a natural medium for productive work with Carvel.

#### The Website Example

*Website* provides an example of this extensibility. Kubernetes builds in resources like *clusters*, *secrets*, and *events*. Base Kubernetes does not support *website* as a recognized resource. These instructions demonstrate how to use Carvel to extend Kubernetes with a *Website* CRD.

This task is well-suited for [`ytt`](https://carvel.dev/ytt/), Carvel's YAML templating tool. [YAML](/docs/guides/yaml-reference/) is Kubernetes' standard format for configuration information.

1.  Create a YAML file named `website-crd.yml`:

    ```command
    nano website-crd.yml
    ```

    Give the file the following CRD content:

    ```file {title="website-crd.yml" lang="yaml"}
    apiVersion: apiextensions.k8s.io/v1
    kind: CustomResourceDefinition
    metadata:
      name: websites.example.com
    spec:
      group: example.com
      versions:
        - name: v1
          served: true
          storage: true
          schema:
            openAPIV3Schema:
              type: object
              properties:
                spec:
                  type: object
                  properties:
                    domain:
                      type: string
                    backendService:
                      type: string
      scope: Namespaced
      names:
        plural: websites
        singular: website
        kind: Website
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  With Carvel installed, you can apply `ytt`:

    ```command
    ytt -f website-crd.yml > generated-website-crd.yml
    ```

1.  The generated CRD specification allows for immediate creation of custom instances. For example, create another file called `website-instance.yml`:

    ```command
    nano website-instance.yml
    ```

    Give the file the following contents:

    ```file {title="website-instance.yml" lang="yaml"}
    apiVersion: example.com/v1
    kind: Website
    metadata:
      name: my-website
    spec:
      domain: www.example.com
      backendService: my-backend-service
    ```

    When done, press <kbd>CTRL</kbd>+<kbd>X</kbd>, followed by <kbd>Y</kbd> then <kbd>Enter</kbd> to save the file and exit `nano`.

1.  Deploy this CRD and its example instance with:

    ```command
    kubectl apply -f generated-website-crd.yml
    ```

    ```output
    customresourcedefinition.apiextensions.k8s.io/websites.example.com created
    ```

    ```command
    kubectl apply -f website-instance.yml
    ```

    ```output
    website.example.com/my-website created
    ```

1.  Verify that the custom resource instance is created:

    ```command
    kubectl get websites
    ```

    ```output
    NAME         AGE
    my-website   2m
    ```

At this point, your Kubernetes installation manages the *website* custom resource type just like any other Kubernetes resource type.

## Conclusion

Carvel use is a great return-on-investment. The cost in effort and licensing to introduce a single tool is low. Meanwhile, the gain in efficient control of a Kubernetes application is potentially high. You're likely to profit from even your first experiments.