---
slug: terraform-vs-ansible
description: 'This guide compares Ansible and Terraform, two utilities which automate the deployment of infrastructure using only code contained in playbooks or scripts.'
keywords: ['IaC','Terraform','Ansible','configuration management', 'service orchestration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-11
image: ComparingTerraform_Ansible.png
modified_by:
  name: Linode
title: "Terraform vs Ansible"
title_meta: "Comparing Terraform and Ansible"
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Ansible](https://www.ansible.com/)'
authors: ["Jeff Novotny"]
---

To eliminate the problems associated with manual configuration, many tech firms have turned to *Infrastructure as Code* (IaC) tools to manage their networks. These tools use either scripts or configuration files to automate the provisioning and deployment of networks. The IaC market is very crowded, with many competitive products. Two of the most popular IaC tools are [*Terraform*](https://www.terraform.io/) from HashiCorp and Red Hat's [*Ansible*](https://www.ansible.com/). This guide compares Ansible and Terraform, with an explanation of how each product works and what purpose it serves.

## The Basics of Infrastructure as Code

Infrastructure as Code is a method of managing infrastructure through automation. IaC speeds up Cloud deployments and reduces operational costs. It helps avoid potentially costly errors and enforces consistency and standardization across the Cloud. Infrastructure as Code is central to the concept of DevOps, which is an alliance of the development and operations teams. These groups work together to plan the structure, layout, and configuration of the network. Linode's [Introduction to Infrastructure as Code](/docs/guides/introduction-to-infrastructure-as-code) offers a more comprehensive overview of this subject.

An important step in this planning process is deciding which IaC tool to use. Although the various products have considerable overlap, they each have different strengths. Some are easier to use than others. Some are geared towards different programming approaches. Some are optimized for configuration management while others are better for service orchestration.

Both Ansible and Terraform are tools for implementing Infrastructure as Code, although they focus on different components. Ansible is geared towards configuration management whereas Terraform's strength lies in service and cloud orchestration. There is considerable overlap between the two applications as well as differences, and many DevOps teams could use either. There could also be situations where the two tools are best used together. To assist you in making a decision, this guide first introduces Terraform and Ansible and then compares and contrasts them across several criteria. It then provides a summary and provides a framework upon which to base a decision.

## An Introduction to Terraform

Terraform is an open source IaC tool that is very straightforward to use. Its main purpose is to build and scale Cloud services and to manage the state of the network. Terraform does not specialize in software configuration, and does not install and manage software on existing devices. Instead, it is geared towards creating, modifying, and destroying servers and other Cloud resources. This means it is most commonly found in data centers and in *software-defined networking* (SDN) environments. It works effectively with both lower-level elements, including storage and networking devices, and higher-level *Software as a Service* (SaSS) entries. In terms of state management, it maps the actual resources back to the configuration, stores metadata, and improves network performance.

### The Main Uses for Terraform

Terraform can manage external service providers, including cloud networks, and in-house solutions. It is especially useful for multi-tier or N-tier applications, such as web servers that use a database layer. Because Terraform models the dependencies between applications and add-ons, it ensures the database layer is ready before any web servers are launched. Terraform is cloud agnostic, and can manage multiple clouds to increase fault tolerance. A single configuration file can oversee multiple providers and handle cross-cloud dependencies. Terraform is very efficient for demos or other disposable environments due to the ease of creating a network on a cloud provider. It helps manage parallel environments, so it is a good choice for testing, validating bug fixes, and formal acceptance.

### How Terraform Works

Terraform follows a declarative approach. This means it describes the end state of the system without specifying the steps required to get there. Terraform works at a high level of abstraction to describe what cloud resources and services should be created and combined. It is not focused on low-level programming. The end state is specified in either the *HashiCorp Configuration Language* (HCL) or JSON, with HCL preferred. HCL is a very simple language and no programming experience is required to use it.

HCL is used to declare the service providers and resources within the network. Each resource describes a particular infrastructure item, for example, a virtual network. HCL provides blocks, arguments, and expressions to simplify the configuration. Blocks can be used to logically group tasks and to handle errors. Arguments are used to assign either a static value or the result of an expression to an identifier. However, HCL does not have any complex data or control structures.

Terraform uses *providers* to accomplish the actual configuration. Providers, which can be official or community-developed, are like plug-ins. These APIs declare a collection of resource types and data sources, and allow Terraform to manage the various devices. Users must initially specify the necessary providers so Terraform can install them. Most providers are associated with a specific infrastructure platform, such as cloud providers, but some are general utilities. All providers, including a [*Linode Provider*](https://registry.terraform.io/providers/linode/linode/latest), can be accessed through the [*Terraform Registry*](https://registry.terraform.io/). Users can also create their own modules. Terraform files have a `.tf` extension, and generally contain both provider blocks and a resource block.

Here is an example of how Terraform might work with the Linode provider:

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

The basic workflow of Terraform consists of a few basic steps:
1.  Write - First write configuration files in HCL using any text editor. These files describe the required components and indicate the final state of the system.
2.  Plan - Execute the `terraform plan` command to get Terraform to review the project files and generate an action plan. This plan provides dependency graphing, allows for parallel configuration of non-dependent sections, and displays exactly what Terraform intends to do. This step allows technicians to review the plan and determine whether it precisely meets their needs or requires further adjustments.
3.  Apply - When the plan is finalized, use `terraform apply` to push the configuration out to all the devices.

Operators typically move back and forth between the writing and planning stages as they validate and refine the configuration. Upon application, Terraform uses *create, read, update, and delete* (CRUD) actions to move the target components into their intended states. If the configuration files change, Terraform can determine exactly what has changed and create an incremental plan that minimizes disruption. The `terraform init` command is used to pre-allocate the necessary providers, while `terraform destroy` tears down the network.

### Terraform and Other Products

Although Terraform is not a configuration management tool, it can be used with one for a more comprehensive solution. Terraform can provide the higher-level abstraction of the network, while a configuration management application can be used on the individual devices. Terraform can additionally be used to bootstrap configuration management software. Terraform Cloud is a commercial application that streamlines processes and supplies workspace capabilities. It is very handy for teams working together on the same network.

Linode has an extensive collection of [Terraform guides](/docs/applications/configuration-management/terraform). These guides cover specific scenarios and explain how to install and use Terraform.

## An Introduction to Ansible

The main purpose of Red Hat's Ansible is IT automation. Ansible automates software provisioning, configuration management, application deployment, and *continuous integration* (CI) pipelines. It can integrate with cloud networks, and provides support for Linode. Ansible runs on most Linux distributions, and can provision both Linux and Windows-based devices. The design goals of Ansible are to be minimal, consistent, secure, reliable, and easy to learn. It is straightforward to install, and no special programming skills are necessarily required to use it.

### The Main Uses for Ansible

Ansible handles all types of infrastructure platforms, including bare metal, virtualized devices such as hypervisors, and cloud networks. It integrates well with legacy applications and existing automated scripts, and is designed to manage the complex, multi-faceted facilities found in large businesses. Ansible supports idempotent behavior, which means it can place the node into the same state every time. This is necessary for consistency and standardized behavior.

### How Ansible Works

Ansible does not use agents and does not have to run on the target node. Instead it connects using SSH or another authentication method and temporarily installs Python modules on the target using JSON. These modules are simple programs that run on the target. Ansible executes these modules and then removes them when they are done. This strategy ensures resources are not consumed on a target when it is not being managed. Python must be installed on both the controlling and target nodes. However, Ansible does not require a central server for orchestration. Any machine with Ansible installed can configure another node. Authorization keys can be used to control what machines can access what targets. Ansible is text based and does not require any databases, daemons, or external servers. This strategy facilitates recovery after a large-scale failure.

Ansible includes its own declarative language, but it can operate in either declarative or procedural mode. In other words, a system can be described in terms of its final state, or by using instructions on how to get to that state. Ansible uses editable, versioned *inventory* files, written in either INI or YAML format, to store the infrastructure information in plain text. These files identify the target nodes to be managed, listed by hostname or IP address. Many inventory files can be used together, and inventories can be dynamically pulled from another system or location. Within an inventory file, nodes can be grouped together and nested for easier management. Ranges, variables, and aliases can all be used to simplify the list. A typical inventory file in INI format might be similar to this:

{{< file "/etc/ansible/hosts" >}}
mail.example.com

[webservers]
web1.example.com
web2.example.com

[dbservers]
dbone.example.com
dbtwo.example.com
dbthree.example.com
{{< /file >}}

### Ansible Tasks, Modules, and Playbooks

The main configuration activities in Ansible are expressed as tasks. These are the operations that take place on the target. A task can be either a one-off ad hoc command, or a call to a *module*. Modules are stand-alone script files that are usually written in Python, although Perl and Ruby can also be used. A module typically has a specific purpose, for example, managing a particular application. They are frequently grouped together into [*collections*](https://docs.ansible.com/ansible/latest/collections/index.html#list-of-collections) for easier access. Ansible ships with many default modules, and for easy deployment of your Linodes, there is a [Linode Ansible module](/docs/guides/deploy-linodes-using-ansible/) too.

Ansible *Playbooks* group together related tasks, along with associated variables, for easier implementation. Playbooks are usually written in an easy, descriptive, human-readable language like YAML, or with a Jinja template. They might contain the desired layout of the network, configurations, deployment details, user IDs, and logins. Playbooks can map the hosts from the inventory files to roles, which are a special type of self-contained playbook consisting of Ansible functions. A playbook runs in sequential order, but can contain loops, control operators, and event handlers. It allows administrators to prompt for values, set variables and defaults, and use command results to determine the flow of the configuration. Playbooks have a mode for dry-run testing.

Here is an example of a snippet from a playbook that updates an Apache server:

{{< file "user_account.yml" >}}
- name: update web servers
  hosts: webservers
  remote_user: root

  tasks:
  - name: ensure apache is at the latest version
    yum:
      name: httpd
      state: latest
  - name: write the apache configuration file
    template:
      src: /srv/httpd.j2
      dest: /etc/httpd.conf
{{< /file >}}

### Ansible and Other Products

Ansible can be used in one of several ways. It can work in a very simple manner, using ad-hoc commands. However it is more common to run Ansible Playbooks, which allow for a more extensive mix of instructions. Finally, there is the commercial Ansible Tower product. Tower offers features including a REST API, a web service console, scheduling operations, an access-control list (ACL), and one-button execution. Tower makes Ansible easier to use, and can serve as a hub for automation. Other commercial products include Ansible Galaxy, a repository of ready-to-use roles, and Ansible Vault, to enable encryption.

Linode has several [guides](/docs/applications/configuration-management/ansible) to help you install Ansible and start using it to run ad hoc commands and deploy Linodes.

## A Comparison Between Ansible and Terraform

Terraform is a service orchestration tool which is optimized for cloud and multi-cloud networks. It ensures an environment is in its desired state, stores this state, and restores the system after it is reloaded. It does not focus on configuration management.

Ansible is a configuration management tool. It excels in provisioning software and devices, and deploying the applications that run on top of the infrastructure. It operates on a particular device in isolation from the network and ensures it is functioning normally.

There is some overlap between the tools because Ansible can perform some service orchestration. Its playbooks can be extended to deploy applications in a cloud, and it features modules for most major cloud providers. But it is not as good at orchestrating services and interconnected, dependent applications.

Several basic properties are typically used to distinguish the various IaC tools. Terraform and Ansible can be further evaluated using these indicators.

### Open Source Versus Commercial Availability

Both Ansible and Terraform are free open source tools. However, both provide more advanced enterprise versions or extensions at a cost. Ansible has Ansible Tower, which adds more features and is optimized for automation. Terraform Cloud streamlines and enhances the configuration process and is marketed towards larger companies. Certain features of Cloud are free, but others are only available for paid accounts.

### Technologies Used

Terraform is written in the Go language and accepts configuration files in its own TCL language or in JSON. Ansible is written in Python, and uses this language to configure the target node. It allows modules scripted in Python, Perl, or Ruby. However the declarative configuration files are created in YAML or INI format. Neither Terraform nor Ansible use agents.

### Declarative Versus Imperative Approaches

Terraform is exclusively a declarative tool. It accepts a description of the final state of the system and makes its own decisions regarding how the configuration is built. Ansible also allows for a declarative approach, but it permits imperative procedures with specific instructions and commands inside scripted modules. This approach adds flexibility, but also increases complexity. The final state of the network is not captured anywhere inside Ansible.

### Mutable Versus Immutable Configuration

If a configuration is mutable, it can be changed. With immutable configuration, the target must be either rebooted or destroyed and then re-created. It cannot be changed. Both tools support mutability, but this approach is better suited for Ansible. Ansible is re-entrant and can easily repair or modify configurations. In fact, this is one of its strengths. Because it operates in a cloud environment, Terraform works best using an immutable approach. It is often easier to tear a cloud resource down and rebuild it with a fresh configuration than to reconfigure it.

### Push Versus Pull Distribution

Both Ansible and Terraform use push distribution. They proactively configure the target devices.

### External Resources

Terraform has a more developed and mature module library. Ansible offers the Galaxy repository, but this requires more manual intervention. Both applications have large and active user communities.

### GUI Availability

Neither tool has a great GUI. Ansible offers a basic GUI in its enterprise Ansible Tower application, but it has some limitations. Terraform does not have a native GUI.

## Making a Decision Between Terraform and Ansible

Each tool has its own unique strengths. Terraform is very user friendly, and has good scheduling capabilities. It integrates nicely with Docker, because Docker handles a lot of the configuration management, which Terraform lacks. Terraform has a lot of overhead, however, and can be opaque in its behavior. It is not clear how the target devices are brought into their final state, and even the final configuration is not always obvious.

Ansible has better security policies and ACL functionality. Overall, it is a more mature tool and fits more comfortably into traditional automation frameworks. It is lightweight in terms of coding, and is more intuitive and straightforward in its operations. Unfortunately, it is not as successful at orchestrating services, interconnected applications, and logical dependencies.

In spite of their differences, there is considerable overlap between Terraform and Ansible. In many situations, either could be used. Ansible and Terraform are not mutually exclusive, and it is quite possible to use both in the same network. However, certain layouts are better suited for one or the other.

The right choice depends upon your circumstances. You are more likely to make a good decision if you understand your current network and what goals you are trying to achieve. If you are using a containerized solution to provision software within a cloud network, then Terraform likely meets most of your needs. However, Ansible provides more flexibility and control for mixed legacy networks running a variety of different applications. It is handy for those who want to maintain some control over their devices and can find another way to deploy the underlying services. Because both tools continue to evolve, it is possible they could converge or provide more comprehensive solutions in the future. The right answer for your network could be quite different in a year or two.