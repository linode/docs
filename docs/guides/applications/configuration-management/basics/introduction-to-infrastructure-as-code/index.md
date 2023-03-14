---
slug: introduction-to-infrastructure-as-code
description: 'This guide discusses the history, concepts, rationale behind Infrastructure as Code, as well as investigating the main design decisions and the available tools.'
keywords: ['IaC','infrastructure','configuration','automation']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-03
image: IntroInfastructureAsCode.png
modified_by:
  name: Linode
title: "An Introduction to Infrastructure as Code"
title_meta: "Introducing Infrastructure as Code"
external_resources:
- '[Infrastructure as Code on Wikipedia](https://en.wikipedia.org/wiki/Infrastructure_as_code)'
authors: ["Jeff Novotny"]
---

*Infrastructure as Code* (IaC) is a technique for deploying and managing infrastructure using software, configuration files, and automated tools. This strategy can be used for devices such as web servers, routers, databases, load balancers, and personal computers, as well as on cloud services. It differs from traditional infrastructure management, which relies upon manual or interactive configuration, one device at a time. IaC encompasses a high-level approach to infrastructure, and does not refer to a specific technique, tool, or protocol. This guide discusses the history, concepts, and rationale behind IaC. It also explores the main implementation decisions and the available software tools.

## The History and Main Concepts Behind Infrastructure as Code

Infrastructure as Code originated out of a sense of frustration with the way equipment was traditionally managed in large networks. With the older methods, technicians must configure a device manually, perhaps with the aid of an interactive tool. Information is added to configuration files by hand or through the use of ad-hoc scripts. Configuration wizards and similar utilities are helpful, but they still require hands-on management. A small group of experts owns the expertise, the process is typically poorly defined, and errors are common.

This approach is minimally adequate for a small organization that does not habitually add, upgrade, or reconfigure equipment. But it is time consuming, costly, haphazard, and does not scale. It cannot be made to work efficiently for an organization operating thousands of servers.

Later on, advances in virtual and cloud computing and new software tools led to an environment with far fewer dependencies on physical devices. Servers can now be created, deleted, or reconfigured on demand, without manual intervention. The development of the *continuous integration and continuous delivery* (CI/CD) pipeline made the idea of treating infrastructure as software much more attractive.

With IaC, infrastructure is provisioned exclusively through automation. IaC processes make use of configuration files, definition files, and scripts, as part of a pre-planned, tightly-managed process. The development and operations teams, known collectively as *DevOps*, work together to define a strategy for the network. Infrastructure as Code takes advantage of the software development process, making use of quality assurance and test automation techniques. Changes to the configuration are made through alterations to the software and not through manual changes to the infrastructure.

## Reasons for Deploying Infrastructure as Code

Infrastructure as Code is motivated by several key business objectives. The most significant of these goals are cost containment, risk reduction, rapid deployment, and the enforcement of a consistent standardized approach.

### Cost

Manual configuration is a costly activity. It requires the presence of a skilled technician, who is paid a professional salary. Each employee can only configure one component at a time, and each setup must be debugged individually. The only way to speed things up is to hire more people.

In contrast, the automation-driven methodology of IaC initially costs more but saves money in the long run. IaC techniques eliminate mundane and repetitive tasks, allowing professional staff to concentrate on more profitable and higher-margin activities. Firms can get more done with the same budget.

### Speed

In addition to being expensive, manual configuration is also very slow. There is no way to instantaneously deploy hundreds of new devices, and it is impossible to change or upgrade a network in a timely manner.

With IaC, scripts and configuration files allow for rapid activation of infrastructure and near-instantaneous changes to existing networks. It is much easier and quicker to develop and test small changes to the codebase and proactively distribute updates. Systems can be set up on an as-needed basis, reducing overhead for prototyping and compliance testing. Because changes can be pushed out so quickly, maintenance windows can be much smaller and more frequent.

### Risk

No matter how careful people are, errors in configuration are much more likely with a manual approach. If problems are found later on, the configuration might be further altered in an attempt to fix the problem. Irrelevant details might be added, or important features accidentally deleted. At the end of the operation, the configuration might be very different from what was intended.

Because it enforces a methodical and well-tested approach, IaC greatly minimizes the chance of errors and reduces risk. Any obvious problems are caught much earlier in the development cycle. IaC also makes it easier to fix bugs, allowing developers to quickly change, test, and deploy source code.

### Consistency/Standardization

Without a standardized procedure, technicians could configure things in a different order or use different approaches to get the same result. Each node in the network becomes what is known as a *snowflake*, with its own unique settings. This leads to a system state that cannot easily be reproduced and is difficult to debug. Configuration changes could be made without sufficient understanding or discussion of the original design or the implications. The deployment approach can change over time, leading to large disparities between older and newer equipment. This tendency of a network to diverge over time is known as *network drift*, which can be a significant source of instability in the network.

With standard configuration files and software-based configuration, there is greater consistency between all equipment of the same type. A key IaC concept is *idempotence*. This means a given device always moves into the same state given the same pre-conditions. Idempotence makes it easy to troubleshoot, test, stabilize, and upgrade all the equipment. The network is likely to behave in predictable ways under stress or in response to changing conditions. A consistent setup is also likely to standardize logging and error handling to assist with troubleshooting, and to minimize security gaps. IaC reduces interactions between equipment with mismatched configurations or running different software versions. It allows teams to share code, and makes it easier to divide and compartmentalize tasks.

## Infrastructure as Code and DevOps

Infrastructure as Code is central to the culture of DevOps, which is a mix of development and operations. A tighter integration between software and infrastructure teams aligns practices throughout the organization and connects network deployments back into the CI/CD pipeline. IaC provides a high payoff to large organizations that install hundreds of devices a day, and those specializing in providing equipment and network services. However, even smaller software development companies can make use of these techniques to establish and maintain their own labs.

One of the most significant advantages of IaC is the connection to automation, quality assurance, and versioning control. It is very difficult to integrate these activities any other way. Software changes can first be verified through regression scripts and automated testing, allowing for confident upgrades. Production models and prototypes can be tested earlier, before widespread deployment. Automation allows for full validation of corner cases, as well as special situations such as teardown, reconfiguration, and stress testing.

If a problem occurs, it is trivial to roll production back to the most recent stable version. In the case of problems, edits are always made to the source configuration files, never on the target. A patch is rolled out only when it is ready and QA has signed off on the changes. Configuration files are typically added to the same versioning control systems used for software development. This makes it easy to back out software and configuration changes together, or to create a branch for early development or prototyping.

## Infrastructure as Code Design Decisions

The Infrastructure as Code philosophy specifies a certain high-level process, but provides more flexibility regarding specific details. However, a successful plan must address several low-level factors. These decisions might vary between companies based on their specific requirements and resources.

### Declarative Versus Imperative Approaches

A declarative approach describes the final state of a device, but does not mandate how it should get there. The specific IaC tool makes all the procedural decisions. The end state is typically defined through a configuration file, a JSON specification, or a similar encoding.

An imperative approach defines specific functions or procedures that must be used to configure the device. It focuses on what must happen, but does not necessarily describe the final state. Imperative techniques typically use scripts for the implementation. This approach can be used to leverage legacy tools and software, and might be a good first step towards IaC for a traditional organization.

### Push Versus Pull Distribution

With a push configuration, the central server pushes the configuration to the destination device. In a pull configuration, each device requests its own configuration from a central distribution point.

### Mutable Versus Immutable Infrastructure

If a device is mutable, its configuration can be changed while it is active. This approach allows for in-service upgrades and changes. Immutable devices cannot be changed. They must be decommissioned or rebooted and then completely rebuilt. This might seem dramatic, but an immutable approach makes sense for virtual infrastructure. By eliminating the possibility of partial or incomplete changes, an immutable approach ensures consistency and avoids drift. However, it usually takes more time to remove or rebuild a configuration than it does to change it. So this might not be the right choice in time-sensitive scenarios.

## Risks and Downsides of Infrastructure as Code

The advantages of Infrastructure as Code vastly outweigh the downsides. However, there are a few disadvantages. All the necessary code and configurations must be maintained and updated. This adds to organizational overhead and technical debt. Deployment is a joint DevOps decision, so this can pull developers away from other high-priority design tasks. The code could be complex, and it might not always be obvious how to change it.

Because all devices share a common and consistent configuration, this could make the network an easier target for hackers. Additionally, several IaC tools have known vulnerabilities. System administrators should consider security issues as part of the development process. For software development, system standardization could lead to untested corner cases as certain combinations of features are never configured together, even incidentally.

## Tools for Implementing Infrastructure as Code

Several *Continuous Configuration Automation* (CCA) software tools are available to assist with IaC deployments. Many of these tools are open source, and dependent on community content.

*   [*Ansible*](https://www.ansible.com/) is a very popular open source IaC application from Red Hat. Although it is primarily used on, and with, Linux environments, it also supports Windows. Ansible is often used in conjunction with Kubernetes and Docker. Ansible supplies its own declarative language to define infrastructure, and operates without agents by connecting remotely using SSH. It uses configurable "inventory" text files, along with YAML playbooks, to express the configuration. Ansible is designed to be minimalist, secure, and reliable, and have low resource usage. Ansible's own declarative language is easy to learn and use and features the use of templates. Linode offers a collection of [several Ansible guides](/docs/applications/configuration-management/ansible) for a more comprehensive overview.
*   [*Chef*](https://www.chef.io/) is an open source tool allowing clients to write configuration recipes in a Ruby-based *Domain Specific Language* (DSL). It is commonly used on Linux machines and interacts with most cloud platforms. Users specify the packages, services, and files for each device, and Chef configures, corrects, and validates the resources.
*   [*Otter*](https://inedo.com/otter) is a tool for modelling infrastructure and configuration on Windows platforms.
*   [*Pulumi*](https://www.pulumi.com/) permits the use of a variety of programming languages to deploy and manage infrastructure within a cloud environment. This free open source IaC tool uses familiar IDEs and tools and facilitates sharing and collaboration. Linode has a [good introduction](/docs/guides/deploy-in-code-with-pulumi/) to this application.
*   [*Puppet*](https://puppet.com/) provides its own declarative language to describe configuration outcomes. Its model-driven solution allows for easy management of the entire IT-lifecycle, including deployment, configuration, and updates. Puppet uses high-level modelling, requires little programming knowledge, and works with most Linux distributions as well as Windows. A free open source version of this popular tool is available, along with a more powerful and advanced commercial version. Linode offers many [guides and resources for Puppet](/docs/applications/configuration-management/puppet).
*   [*Salt*](https://www.saltproject.io/), also known as SaltStack, is an open source solution for most platforms. Salt handles IT automation, configuration management, and remote-task execution. Its compartmentalized Python modules can be modified for specific use cases. In addition to the usual IaC tasks, SaltStack also supports security management and vulnerability mitigation. Linode offers a number of [Salt resources](/docs/applications/configuration-management/salt), including a useful [introduction](/docs/guides/beginners-guide-to-salt/).
*   [*Terraform*](https://www.terraform.io/) allows users to provision data center infrastructure using either JSON or Terraform's own declarative language. Rather than offer its own configuration management services, Terraform manages resources through the use of providers, which are similar to APIs. Providers declare resources and requisition data sources, and are available for most major vendors. Providers are usually accessed through the [*Terraform Registry*](https://registry.terraform.io/browse/providers). The open source Terraform is available in free and commercial versions, and uses a modular approach to encourage reuse and maintainability. Consult Linode's extensive collection of [Terraform guides](/docs/applications/configuration-management/terraform) for more information.

Wikipedia has summarized the main Infrastructure as Code CCA tools into [*a handy chart*](https://en.wikipedia.org/wiki/Comparison_of_open-source_configuration_management_software). It includes comparisons of basic properties and supported platforms, as well as a brief description of each tool. Linode also offers a guide that [compares Terraform and Ansible](/docs/guides/terraform-vs-ansible), two of the most common IaC solutions.