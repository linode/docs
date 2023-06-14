---
slug: terraform-vs-pulumi
description: 'This guide compares Terraform and Pulumi, with an explanation of how each tool works and what purpose it serves.'
og_description: 'TThis guide compares Terraform and Pulumi, with an explanation of how each tool works and what purpose it serves.'
keywords: ['IaC','Terraform','Pulumi','comparison', 'service orchestration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-22
image: ComparingTerraform_Pulumi.png
modified_by:
  name: Linode
title: "Pulumi vs Terraform"
title_meta: "Comparing Pulumi and Terraform"
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Pulumi](https://www.pulumi.com/)'
authors: ["Jeff Novotny"]
---

*Infrastructure as Code* (IaC) is a modern methodology that provisions and deploys Cloud resources using automation rather than through manual or ad-hoc configuration. Most IaC tools automate infrastructure configuration and management through the use of scripts or configuration files. Numerous solutions have been developed to implement Infrastructure as Code, each with their own strengths and weaknesses. Two IaC tools often used for service orchestration are [*Terraform*](https://www.terraform.io/) from HashiCorp and [*Pulumi*](https://www.pulumi.com/) from a venture-backed start up. This guide analyzes Terraform and Pulumi, explains how both products work, and describes scenarios where each tool might be useful.

## The Basics of Infrastructure as Code

Infrastructure as Code manages infrastructure strictly through automation. IaC cleanly integrates into the software development pipeline and is central to the concept of *DevOps*, which refers to a combination of development and operations. IaC speeds up network deployments, reduces operational costs, eliminates errors, and ensures consistency across the network. Using a IaC philosophy, the DevOps team methodically plans the structure, layout, and configuration of the network as part of the development process.

It is important to carefully decide which IaC tool to use before proceeding with any implementation. Pulumi and Terraform are both Infrastructure as Code tools, and they both focus on service orchestration, but they work quite differently. Pulumi allows developers to use familiar programming languages and tools, whereas Terraform enforces the use of its own declarative language. Therefore, they are suited to somewhat different environments, even though many DevOps teams could technically use either. Both tools could even be used together as part of a transitional or risk management process, at the cost of increased complexity. To assist with this decision, this guide first introduces and explains the two applications. It then compares and contrasts them on several dimensions, and wraps up with a summary and a high-level decision making framework.

## An Introduction to Terraform

Terraform is an open source IaC tool for building and scaling a network and managing its operational state. Terraform is not a software configuration tool, and it does not install and manage software on any target devices. Instead, Terraform is designed to create, modify, and destroy servers. It is well suited to data centers and *software-defined networking* (SDN) environments where equipment is likely standardized and virtualized. Terraform can handle lower-level elements, such as storage and networking devices, as well as higher-level components, including DNS entries. To implement state management, Terraform maps the actual resources back to the original configuration, stores network metadata, and improves network performance. Terraform is straightforward, easy to use, and requires little to no programming experience.

### The Main Uses for Terraform

Terraform is typically used to manage external service providers, including cloud networks, but it can also be used on in-house solutions. Terraform models dependencies between applications and add-ons, so it can ensure the database layer is completely operational before any web servers are launched. This makes it especially useful for multi-tier applications. Terraform is independent of any particular cloud provider, and can control multiple clouds, thereby increasing fault tolerance. Multiple providers and clouds can be managed using a single configuration file. The ease of assembling a quick cloud network in Terraform makes it a good choice for demos and other disposable environments. Terraform is also convenient when testing, validating bug fixes, and certifying formal acceptance.

### How Terraform Works

Terraform uses a declarative approach to automation. Terraform files describe the end state of the system, but not the steps taken to get there. Terraform works at a high level of abstraction, and no low-level programming is required. You only have to provide a description of the cloud resources and the services that must be created or changed. The end state is specified using either the *HashiCorp Configuration Language* (HCL), which Terraform recommends, or JSON. HCL is a very simple language, and previous programming experience is not required to use it.

The service providers and resources within the network are all specified using HCL. A resource describes a particular piece of infrastructure, such as a virtual network. To simplify the structure of the configuration, HCL provides blocks, arguments, and expressions. A block is used to logically group tasks or items together. Arguments assign either a fixed value or an expression to an identifier. HCL does not have any complex data or control structures.

To accomplish the actual configuration, Terraform uses *providers*, which can be official or community-developed. Providers are APIs that are used for declaring a collection of resource types and data sources. They allow Terraform to manage a specific type of device or component. Although providers are usually associated with a specific infrastructure vendor, some are general utilities, such as password generators. Terraform providers, including the [*Linode Provider*](https://registry.terraform.io/providers/linode/linode/latest), are accessed through the [*Terraform Registry*](https://registry.terraform.io/). It is also possible to create your own modules. A Terraform file, which has a `.tf` extension, usually contains provider blocks and at least one resource block.

Here is an example illustrating how Terraform might work in conjunction with the Linode provider:

{{< file "~/terraform/linode-terraform-web.tf" >}}
provider "linode" {
  token = "YOUR_LINODE_API_TOKEN"
}

resource "linode_instance" "terraform-web" {
        image = "linode/ubuntu20.04"
        label = "Terraform-Web-Example"
        group = "Terraform"
        region = "us-east"
        type = "g6-standard-1"
        authorized_keys = [ "YOUR_PUBLIC_SSH_KEY" ]
        root_pass = "YOUR_ROOT_PASSWORD"
}
{{< /file >}}

### The Terraform Workflow

There are three steps to the regular Terraform workflow:
1.  Write - Write the configuration files using HCL. The configuration should fully describe the required components and the final state of the system.
2.  Plan - Preview the end result using `terraform plan`. This command prompts Terraform to analyze the files and generate an action plan, which explains exactly what it intends to do. The plan graphs all dependencies, and lists the components that can be configured in parallel.
3.  Apply - When the plan is finalized, use `terraform apply` to push the configuration to the devices.

It is not uncommon for users to go back and forth between the writing and planning stages, until the plan aligns with their expectations. This is an easy, no-risk way to validate and refine the configuration. When the configuration is applied, Terraform uses a series of *create, read, update, and delete* (CRUD) operations to move the network into its final state. It is easy to make changes to the network configuration. Terraform determines exactly what has changed and creates an incremental plan that minimizes disruption. As a first step, `terraform init` is used to pre-allocate the necessary providers, and when the network is no longer required, `terraform destroy` can tear it down.

### Terraform and Other Products

Although Terraform is not a configuration management tool, it can be used in conjunction with one to provide an end-to-end solution. Terraform provides the higher-level layout of the network, while the configuration management tool operates on the individual devices. Another approach to integrate these components is to have Terraform bootstrap a configuration management service. Terraform offers the paid Terraform Cloud service, which is free for up to five people. Cloud streamlines the Terraform workflow and adds workspaces. It is designed for teams who are working together on the same network.

Linode offers several [Terraform guides](/docs/applications/configuration-management/terraform), which explain how to install and use Terraform.

## An Introduction to Pulumi

Similar to Terraform, Pulumi is an open source IaC tool that is mainly used for service orchestration. It can deploy, manage, and update cloud infrastructure, containers, databases, and hosted services. Pulumi can provision both lower-end components such as storage and networking, and higher-level elements. The biggest difference is Pulumi allows users to describe the network state using traditional programming languages and familiar tools. Infrastructure can be defined using JavaScript, Typescript, Python, Go, or any .NET language, including C#. Likewise, it is possible to use existing IDEs, test frameworks, and tools with Pulumi.

### The Main Uses for Pulumi

Pulumi is designed to allow organizations to manage their infrastructure using their existing skill sets and tools. This permits better integration of legacy systems, which interact with the network cloud through the Pulumi *software development kit* (SDK). This approach fits nicely into DevOps culture, because the development team can specify the infrastructure using well-known imperative programming languages. It is not necessary to learn any new languages.

With Pulumi, teams can deploy to any cloud, integrate with a CI/CD system, and review changes before making them. Pulumi provides many advanced features such as audit capabilities, built-in encryption services, and integration with identity providers. It can take checkpoints or snapshots, and store sensitive configuration items, such as passwords, as secrets.

### How Pulumi Works

Pulumi follows a "desired state model". It first computes the final state of the network. Pulumi's deployment engine then compares this state to the current state and determines what must be created or changed. A language host, such as Python, executes the program, while the Pulumi deployment engine uses its resource providers to manage the individual components. After the deployment, Pulumi updates its view of the current infrastructure to reflect the new state. Each resource provider consists of a resource plug-in along with a set of programmable bindings for the resources. The deployment engine uses the plug-in to manage the target. The configuration changes are applied using the `pulumi up` command. Pulumi executes the configuration in sequential order, while attempting to manage all of the dependencies. Pulumi does not require a dedicated server, and it can be deployed from a local device.

### The Architecture of Pulumi

Some of the key architectural concepts underpinning Pulumi include projects, programs, stacks, states, and resources. Each network is associated with a Pulumi *project*. This is a directory that contains one or more programs, and the metadata required to run them. Each project must contain a `pulumi.yaml` configuration file in either the project folder or in a parent directory. The YAML file indicates the runtime environment and the list of the essential binaries. The `pulumi new` command creates a new project and generates a default configuration file.

*Programs* are written in a popular programming language, most commonly JavaScript or Python. A program describes the layout of the cloud network, and allocates resource objects to create the new elements. A *resource* is a fundamental infrastructure component, such as a CPU, storage device, or database instance. It is also possible to create a *custom resource* such as Google Cloud, or a *component resource*, which is a logical grouping of other resources. A good example of a component resource is a Kubernetes Cluster. The Pulumi SDK contains libraries for each custom resource. Each resource has a cluster of properties, which correspond to the attributes and states of the target device.

You can create a configurable instance of your program, known as a *stack*, using the `pulumi up` command. A stack represents a distinct deployment environment. Pulumi creates a default stack for each new project, but it is possible to have several stacks within the same project. Secondary stacks can be created using the `pulumi stack init <stackName>` command, where `<stackname>` is a unique name for the new stack. Each stack must have its own YAML file containing stack-specific information. Pulumi operations reference the active environment, so `pulumi up` always creates a deployment instance based on the current program and metadata.

Different stacks can be used for testing and for pushing out application updates. For example, an organization could have development and production stacks. Stacks can export values, which can then be incorporated into other stacks and tools, while stack references allow for inter-stack access. You can list all the stacks using the `stack ls` command, or run `pulumi stack` to view the stack details.
The `pulumi destroy` command is used to delete any remaining stack resources. The stack itself can then be deleted using `plum stack rm`.

Pulumi stores the metadata as a *state*, which is used to manage the cloud resources. A state is stored in a backend of your choosing. Pulumi recommends storing the state using their Pulumi Service utility, which can be self-hosted or used as an online service. However, other storage solutions are available. Pulumi Service allows you to import resources, take checkpoints and snapshots, encrypt states, and store sensitive configuration, such as passwords, as secrets. To use Pulumi, you must be logged in to a Pulumi account.

Here is an example illustrating how to use Pulumi and JavaScript to create a Linode:

{{< file "linode.js" javascript>}}
const linode = require("@pulumi/linode")
const domain = new linode.Domain("my-domain", {
  domain: "foobar.example",
  soaEmail: "example@foobar.example",
  type: "master",
});
{{< /file >}}

Here is how a similar program would appear in Python:

{{< file "linode.py" python>}}
import pulumi_linode as linode
domain = linode.Domain("my-domain",
  domain='foobar.example',
  soa_email='example@foobar.example',
  type='master',
)
{{< /file >}}

### Pulumi and Other Products

Pulumi is not a configuration management tool. It works best in conjunction with another tool that can configure specific applications on top of the cloud resources. Pulumi has the ability to deploy Docker containers, potentially eliminating the need for a configuration management tool.

Pulumi requires a paid account for more than one user. The paid Pulumi for Teams product delivers code sharing features, Git and Slack integration, and support for CI/CD deployments. Pulumi uses the Pulumi Console web-based service to manage concurrency, which reduces some complexity and helps with the learning curve. The Pulumi CLI uses this service by default, but you are allowed to manage the state yourself.

Linode provides a guide explaining how to [get started with Pulumi](/docs/guides/deploy-in-code-with-pulumi/). The guide explains how to install and use the tool.

## Comparing Terraform and Pulumi

Terraform and Pulumi share similar goals. They are service orchestration tools which excel in handling cloud and multi-cloud networks. Both tools ensure the infrastructure network is in the desired configuration, remember the current state, and efficiently handle any updates. Neither Terraform nor Pulumi handle configuration management, but both tools integrate with Docker, which mitigates this concern.

The main difference between the two applications relates to how they are used. In Terraform, the end state of the system is specified using the HCL declarative language. When using Pulumi, the details are specified in a traditional programming language such as Python, Go, or C#. Terraform and the HCL language impose stricter code guidelines, while Pulumi provides greater coding freedom. Because Pulumi works with powerful programming languages, it provides access to common data structures, algorithms, and classes. Some reports suggest it is easy to get started with HCL, but more difficult to master the tool. Unfortunately, it is difficult to use some advanced features without more advanced knowledge. The Pulumi Console application makes it a bit easier and more intuitive to manage concurrency and the deployment state. Terraform Cloud must be used to obtain the same functionality. Otherwise, Terraform's state information must be stored on a local hard drive.

Pulumi is considered to have better testing support. It can be used in conjunction with legacy scripts because it supports unit tests in any framework. Different stacks can be used in each environment to assist in development efforts. Terraform has no official test functionality, but many find it easier to troubleshoot and debug. Terraform is also more modular, and does more to enable component reuse.

Pulumi can integrate with Terraform providers to help organizations move away from Terraform. It even offers the `tf2pulumi` utility to convert HCL to a Pulumi-compatible format.

Several basic properties are typically used to discuss the various IaC tools. Terraform and Pulumi can be further compared and contrasted along the following dimensions.

### Open Source Versus Commercial Availability

Both Pulumi and Terraform are available in free open source formats. However, they both have premium paid services which include enhancements for team work and automation. Terraform Cloud streamlines certain processes, and is marketed towards larger companies. Some Cloud functionality is free, while other features are only available for paid accounts. Pulumi for Teams is similarly geared towards larger teams.

### Technologies Used

Terraform is written in the Go language. However, it only accepts configuration files written in its own HCL language or in JSON. Pulumi is written in Typescript, Python, and Go, and accepts resources written in JavaScript, Typescript, Python, Go, or a .NET language. It does not have a custom declarative language of its own.

Terraform providers are accessed through the Terraform Registry. The Pulumi SDK contains libraries for most major providers.

### Declarative Versus Imperative Approaches

Although Pulumi files are written in an imperative language, such as Python, both tools actually take a declarative approach. The Terraform situation is straightforward. Files are written in a declarative manner. The files specify how the infrastructure is constructed, but not how to configure it. In Pulumi, the purpose of the resource files is similarly to indicate the network layout. The code does not tell Pulumi what commands to run to deploy the network.

### Mutable Versus Immutable Configuration

Both tools support mutable configuration. This means components can be modified after they are created. However, both Pulumi and Terraform work better using an immutable approach that destroys and re-creates elements rather than reconfiguring them. This is a more elegant and efficient process for managing cloud elements, because it enforces consistency and avoids network drift.

### Push Versus Pull Distribution

Both Terraform and Pulumi use push distribution. They deliver the configuration to the target devices.

### External Resources

This is an area where Terraform has an advantage. Terraform has been around for a longer time, it has a larger community, and it is more comprehensively documented. Pulumi also has a community of users, but it is much smaller. Pulumi is a much newer tool, however, so it could catch up in the near future.

## Choosing Between Terraform and Pulumi

Although Terraform and Pulumi have their relative strengths and weaknesses, they both accomplish very similar IaC objectives. Therefore, a final decision between the two tools might depend on how your DevOps team is structured. If you are developing a network environment from scratch and do not mind learning a new declarative language, Terraform is a solid choice. But if you want to leverage existing scripts, test tools, and programming skills, you might be better off using Pulumi. If you have to incorporate control structures such as loops and conditionals into the code, then Pulumi is the best choice. If either approach is acceptable, you could consider the relative maturity level and community depth of the tools, which favors Terraform. However, Pulumi is growing fast and is self-consciously competing with Terraform, so it is likely to rapidly improve. IaC technology is always evolving, and the competitive landscape could be different in a year or two.

Because Pulumi integrates with Terraform to provide a smooth upgrade path, it is also possible to use both tools together. You could conceivably delegate the lower-level network components to Terraform, while placing higher-level devices under the watch of Pulumi. As always, the correct choice depends upon your circumstances and the precise nature of your network.