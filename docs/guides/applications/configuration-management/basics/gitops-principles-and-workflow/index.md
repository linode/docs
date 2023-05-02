---
slug: gitops-principles-and-workflow
description: 'This guide provides an overview of GitOps, describes its workflow, and compares GitOps to DevOps and Kubernetes.'
keywords: ['gitops vs devops', 'gitops and kubernetes', 'gitops workflow']
tags: ['kubernetes', 'container', 'monitoring']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-12-17
modified_by:
  name: Linode
title: "GitOps: An Overview of Its Principles and Workflow"
title_meta: "An Overview of GitOps Principles and Workflow"
authors: ["Jack Wallen"]
tags: ["saas"]
---

If you're a developer, chances are you know what [Git](/docs/guides/a-beginners-guide-to-github/) is. However, you may not be as familiar with *GitOps*. This guide gives you an understanding of GitOps, compares GitOps to DevOps, describes the GitOps workflow, and the tools often used with this methodology.

## What is GitOps?

GitOps is a paradigm that empowers developers to undertake tasks that might otherwise be handled by operations. Operations are the processes and services that are overseen by a company's IT department. This may include technology and infrastructure management (including software), quality assurance, network administration, and device management.

Traditionally, developers don't function under the operations umbrella. This can place development and operations in their own silos. GitOps aims to remove those silos, and enable operations to employ the same tools and methodologies that developers use for efficient collaboration. GitOps, as its name implies, relies on Git as the only source of truth; even for code related to IT operations. GitOps is possible due to [Infrastructure as Code (IaC)](/docs/guides/introduction-to-infrastructure-as-code/) tools that allow you to create and manage your infrastructure using declarative configuration files.

## GitOps Principles

GitOps relies on version control tools like [Git](/docs/guides/how-to-use-git/), [GitHub](/docs/guides/a-beginners-guide-to-github/), [GitLab](/docs/guides/install-gitlab-on-ubuntu-18-04/), and Bitbucket. These platforms serve as the centralized repository for your IaC and orchestration files.

Another central idea behind GitOps is that the desired state of a system is described using declarative specifications for every environment in the software development lifecycle. Some of these environments include testing, staging, and production. Declarative configuration files are housed within the same repository as the code, so they can be accessed by all relevant members of your project.

The next crucial element of GitOps is *observability*. Observability is the ability to measure the internal state of a system by examining the output given by that system. Monitoring is the act of observing a system over time, whereas observability is the measure of how well a system state can be understood or inferred from external outputs. Monitoring requires you to know what to monitor and observability lets the user determine what to monitor based on how the system performs over time.

The three basic components of GitOps are the following:

- [Infrastructure as Code](/docs/guides/introduction-to-infrastructure-as-code/) (IaC), a methodology that stores all infrastructure configuration as code.
- [Merge Requests](/docs/guides/resolving-git-merge-conflicts/) (MRs) to serve as a change mechanism for infrastructure updates.
- [Continuous Integration/Continuous Delivery](/docs/guides/introduction-ci-cd/) (CI/CD) that automates building, testing, and deploying applications, and services.

## GitOps vs. DevOps

GitOps borrows best practices from DevOps and applies them to infrastructure automation. This includes version control, collaboration, compliance, and CI/CD. Tools like Kubernetes have helped automate the software development lifecycle. Because so many businesses use container deployment to scale applications and services, they often depend upon third-party, cloud-based services to host their infrastructure. This has led to the rise of infrastructure automation to achieve a level of elasticity not possible with traditional infrastructure.

DevOps assists in the automation of the software development lifecycle, while GitOPs contributes to the automation of infrastructure. There are a few key differences between GitOps and DevOps. First, GitOps uses Git to manage infrastructure provisioning and software deployment. DevOps, on the other hand, focuses primarily on CI/CD and does not focus on any one tool. The primary focus of GitOps is to ensure that DevOps is done correctly, whereas DevOps focuses less on correctness. GitOps is also less flexible than DevOps. It is also much easier to adopt GitOps in a business that already employs DevOps.

## GitOps and Kubernetes

GitOps focuses on automating infrastructure, so it's a perfect workflow for businesses that employ Kubernetes. When you employ GitOps and Kubernetes:

- GitOps ensures everything operates as it was intended.
- Kubernetes ensures stability and availability.

[Kubernetes](/docs/products/compute/kubernetes/get-started/) always makes sure a deployed application or service remains in a stable state and scales as needed. When GitOps is along for the ride, it ensures everything runs as it should, including the infrastructure necessary for the deployments. GitOps serves as the glue between application build/delivery (Kubernetes) and where the application is to run.

## The GitOps Workflow

The traditional application lifecycle resembles the following:

- Design
- Build
- Image
- Test
- Deploy

When you add GitOps into the mix, that lifecycle looks as follows:

- Design
- Build
- Image
- Test
- Monitor
- Log changes/events
- Alert when a change has occurred
- Update

With a Kubernetes workflow as your source of truth all necessary code is stored in a Git repository with the help of automation. Anyone with Kubernetes management rights can create pull requests, edit code, and issue merge requests to the repository. Once a merge request is complete, the automated GitOps operator detects the changes, another automator declares if the change is operational, and the change is automatically deployed to the cluster.

Within the GitOps workflow you not only have a high level of automation, but there's also a much higher probability that every deployment works exactly as expected.

## GitOps Tools

There are several tools useful to GitOps, some of those tools include:

- [Git](https://git-scm.com/) - a version control system.
- [GitHub](https://github.com/) - a code repository for housing your code.
- [Cloud Build](https://cloud.google.com/build) - a service that executes the build step of your deployment lifecycle using pre-packaged docker containers that include all of the appropriate tooling.
- [CircleCI](https://circleci.com/) - a SaaS-style build engine that simplifies the build steps and can serve as a CI/CD engine.
- [Jenkins X](https://jenkins-x.io/) - an open-source automation server that pushes tagged images to an app registry and provides testing tools as well as a Kubernetes Operator.
- [Kubernetes](https://kubernetes.io/) - a container orchestration platform that can be seamlessly integrated with GitOps.
- [Helm](https://helm.sh/) - a robust tool for configuring Kubernetes resources.
- [Flagger](https://flagger.app/) - automates the detection of errors in code and prevents those errors from being deployed.
- [Prometheus](https://prometheus.io/) - a powerful GitOps monitoring tool that can generate alerts that are detected by Flagger.
- [Quay](https://quay.io/) - an application registry and container image manager.
- [Flux](https://fluxcd.io/) - the GitOps operator for Kubernetes which automatically adjusts the Kubernetes cluster configuration based on the configurations found in your Git repo.

## Conclusion

GitOps is the next phase of infrastructure management. In conjunction with DevOps and Kubernetes, your business can achieve a higher lever of stability, efficiency, and reliability in the software development lifecycle. GitOps ensures that the software and deployment lifecycle is more predictable and repeatable, which makes your business more profitable.