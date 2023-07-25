---
slug: beginners-guide-to-terraform
description: 'A look into Terraform''s primary components, features, and configurations for the new Terraform user'
keywords: ['terraform', 'orchestration', 'linode provider']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-21
modified: 2019-08-07
modified_by:
  name: Linode
image: ABeginnersGuidetoTerraform.png
title: "A Beginner's Guide to Terraform"
external_resources:
- '[Terraform Documentation](https://www.terraform.io/docs/index.html)'
aliases: ['/applications/configuration-management/terraform/beginners-guide-to-terraform/','/applications/configuration-management/beginners-guide-to-terraform/']
authors: ["Linode"]
tags: ["saas"]
---

[Terraform](https://www.terraform.io) by HashiCorp is an orchestration tool that allows you to represent your Linode instances and other resources with declarative code inside configuration files, instead of manually creating those resources via the Linode Manager or API. This practice is referred to as *Infrastructure as Code*, and Terraform is a popular example of this methodology. The basic workflow when using Terraform is:

1.  Write configuration files on your computer in which you declare the elements of your infrastructure that you want to create.

2.  Tell Terraform to analyze your configurations and then create the corresponding infrastructure.

Terraform's primary job is to create, modify, and destroy servers and other resources. Terraform generally does not configure your servers' software. Configuring your software can be performed with scripts that you [upload to and execute on your new servers](#provisioners), or via configuration management tools or container deployments.

## The Linode Provider

Terraform is a general orchestration tool that can interface with a number of different cloud platforms. These integrations are referred to as *providers*. The Terraform provider for Linode was [officially released](https://blog.linode.com/2018/10/30/now-available-linode-terraform-provider/) in October 2018.

{{< note >}}
The Linode provider relies on Linode's [APIv4](/docs/products/tools/api/), so an API access token is needed to use it. See [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) for instructions on getting an API token and installing Terraform and the Linode provider on your computer.
{{< /note >}}

The Linode provider can be used to create Linode instances, Images, domain records, Block Storage Volumes, StackScripts, and other resources. Terraform's [official Linode provider documentation](https://www.terraform.io/docs/providers/linode/index.html) details each resource that can be managed.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/linode/terraform-provider-linode) has been updated and now requires Terraform version 0.12+.  To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.
{{< /note >}}

## Infrastructure as Code

Terraform's representation of your resources in configuration files is referred to as *Infrastructure as Code* (IAC). The benefits of this methodology and of using Terraform include:

-   **Version control of your infrastructure.** Because your resources are declared in code, you can track changes to that code over time in version control systems like Git.

-   **Minimization of human error.** Terraform's analysis of your configuration files will produce the same results every time it creates your declared resources. As well, telling Terraform to repeatedly apply the same configuration will not result in extra resource creation, as Terraform tracks the changes it makes over time.

-   **Better collaboration among team members.** Terraform's [backends](#backends) allow multiple team members to safely work on the same Terraform configuration simultaneously.

### HashiCorp Configuration Language

Terraform's configuration files can be written in either the [*HashiCorp Configuration Language*](https://github.com/hashicorp/hcl) (HCL), or in JSON. HCL is a configuration language authored by HashiCorp for use with its products, and it is designed to be human readable and machine friendly. It is recommended that you use HCL over JSON for your Terraform deployments.

The next sections will illustrate core Terraform concepts with examples written in HCL. For a more complete review of HCL syntax, see [Introduction to HashiCorp Configuration Language (HCL)](/docs/guides/introduction-to-hcl/).

### Resources

Here's a simple example of a complete Terraform configuration in HCL:

{{< file "example.tf" >}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
  }
}

provider "linode" {
    token = "your-linode-api-token"
}

resource "linode_instance" "example_instance" {
    label = "example_instance_label"
    image = "linode/ubuntu18.04"
    region = "us-central"
    type = "g6-standard-1"
    authorized_keys = ["ssh-rsa AAAA...Gw== user@example.local"]
    root_pass = "your-root-password"
}
{{< /file >}}

{{< note >}}
The SSH key in this example was truncated for brevity.
{{< /note >}}

This example Terraform file, with the Terraform file extension `.tf`, represents the creation of a single Linode instance labeled `example_instance_label`. This example file is prefixed with a mandatory `provider` block, which sets up the Linode provider and which you must list somewhere in your configuration.

The `provider` block is followed by a *resource* declaration. Resource declarations correspond with the components of your Linode infrastructure: Linode instances, Block Storage Volumes, etc.

Resources can accept arguments. `region` and `type` are required arguments for the `linode_instance` resource. A root password must be assigned to every Linode, but the `root_pass` Terraform argument is optional; if it is not specified, a random password will be generated.

{{< note >}}
The `example_instance` string that follows the `linode_instance` resource type declaration is Terraform's name for the resource. You cannot declare more than one Terraform resource with the same name and resource type.

The `label` argument specifies the label for the Linode instance in the Linode Manager. This name is independent of Terraform's name for the resource (though you can assign the same value to both). The Terraform name is only recorded in Terraform's [state](#state) and is not communicated to the Linode API. Labels for Linode instances in the same Linode account must be unique.
{{< /note >}}

### Data Sources

In Terraform, data sources represent read-only values that can be retrieved and then used elsewhere in a terraform configuration. Using the Linode Provider gives users access to a number of [Linode Specific Data Sources](https://registry.terraform.io/providers/linode/linode/latest/docs/data-sources/account) that can be used for this purpose.

Data sources are accessed by declaring a `data` block which contains any required information. Once the data block has been declared, the data source provides access to a number of attributes which can be called on as part of the terraform configuration. In the example below, the `linode_account` data source is called on in the `data` block, and is used later in the `output` block to output the `email` attribute:

{{< file "example.tf" >}}
...
data "linode_account" "account" {}

output "linode_account_email" {
        value = "${data.linode_account.account.email}"
}
{{< /file >}}

### Dependencies

Terraform resources can depend on each other. When one resource depends on another, it will be created after the resource it depends on, even if it is listed before the other resource in your configuration file.

The following snippet expands on the previous example. It declares a new domain with an A record that targets the Linode instance's IP address:

{{< file "example.tf" >}}
terraform {
...
}

provider "linode" {
    # ...
}

resource "linode_instance" "example_instance" {
    # ...
}

resource "linode_domain" "example_domain" {
    domain = "example.com"
    soa_email = "example@example.com"
    type = "master"
}

resource "linode_domain_record" "example_domain_record" {
    domain_id = linode_domain.example_domain.id
    name = "www"
    record_type = "A"
    target = linode_instance.example_instance.ip_address
}
{{< /file >}}

The domain record's `domain_id` and `target` arguments use HCL's [interpolation syntax](/docs/guides/introduction-to-hcl/#interpolation) to retrieve the ID of the domain resource and the IP of the Linode instance, respectively. Terraform creates an *implicit dependency* on the `example_instance` and `example_domain` resources for the `example_domain_record` resource. As a result, the domain record will not be created until after the Linode instance and the domain are created.

{{< note >}}
[Explicit dependencies](https://www.terraform.io/docs/configuration/resources.html#explicit-dependencies) can also be declared.
{{< /note >}}

### Input Variables

The previous example hard-coded sensitive data in your configuration, including your API token and root password. To avoid this practice, Terraform allows you to provide the values for your resource arguments in *input variables*. These variables are declared and referenced in your Terraform configuration (using interpolation syntax), and the values for those variables are assigned in a separate file.

Input variables can also be used for non-sensitive data. The following example files will employ variables for the sensitive `token` and `root_pass` arguments and the non-sensitive `authorized_keys` and `region` arguments:

{{< file "example.tf" >}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
  }
}

provider "linode" {
    token = var.token
}

resource "linode_instance" "example_instance" {
    label = "example_instance_label"
    image = "linode/ubuntu18.04"
    region = var.region
    type = "g6-standard-1"
    authorized_keys = [var.ssh_key]
    root_pass = var.root_pass
}

variable "token" {}
variable "root_pass" {}
variable "ssh_key" {}
variable "region" {
  default = "us-southeast"
}
{{< /file >}}

{{< file "terraform.tfvars" >}}
token = "your-linode-api-token"
root_pass = "your-root-password"
ssh_key = "ssh-rsa AAAA...Gw== user@example.local"
{{< /file >}}

{{< note >}}
Place all of your Terraform project's files in the same directory. Terraform will automatically load input variable values from any file named `terraform.tfvars` or ending in `.auto.tfvars`.
{{< /note >}}

The `region` variable is not assigned a specific value, so it will use the default value provided in the variable's declaration. See [Introduction to HashiCorp Configuration Language](/docs/guides/introduction-to-hcl/#input-variables) for more detailed information about input variables.

## Terraform CLI

You interact with Terraform via its command line interface. After you have created the configuration files in your Terraform project, you need to run the `init` command from the project's directory:

    terraform init

This command will download the Linode provider plugin and take other actions needed to initialize your project. It is safe to run this command more than once, but you generally will only need to run it again if you are adding another provider to your project.

### Plan and Apply

After you have declared your resources in your configuration files, you create them by running Terraform's `apply` command from your project's directory. However, you should always verify that Terraform will create the resources as you expect them to be created before making any actual changes to your infrastructure. To do this, you can first run the `plan` command:

    terraform plan

This command will generate a report detailing what actions Terraform will take to set up your Linode resources.

If you are satisfied with this report, run `apply`:

    terraform apply

This command will ask you to confirm that you want to proceed. When Terraform has finished applying your configuration, it will show a report of what actions were taken.

### State

When Terraform analyzes and applies your configuration, it creates an internal representation of the infrastructure it created and uses it to track the changes made. This *state* information is recorded in JSON in a local file named `terraform.tfstate` by default, but it can also be stored in other [backends](#backends).

{{< note type="alert" >}}
Your sensitive infrastructure data (like passwords and tokens) is visible in plain-text in your `terraform.tfstate` file. Review [Secrets Management with Terraform](/docs/guides/secrets-management-with-terraform/#how-to-manage-your-state-file) for guidance on how to secure these secrets.
{{< /note >}}

### Other Commands

Other useful commands are available, like `terraform show`, which reports a human-readable version of your Terraform state. A full list of [Terraform commands](https://www.terraform.io/docs/commands/index.html) is available in the official Terraform documentation.

## Provisioners

In addition to resource declarations, Terraform configurations can include *provisioners*. You declare provisioners to run scripts and commands in your local development environment or on your Terraform-managed servers. These actions are performed when you apply your Terraform configuration.

The following example uploads a setup script to a newly created Linode instance and then executes it. This pattern can be used to bootstrap the new instance or enroll it in configuration management:

{{< file "example.tf" >}}
resource "linode_instance" "example_instance" {
  # ...

  connection {
      type     = "ssh"
      user     = "root"
      password = var.root_pass
      host     = self.ip_address
  }

  provisioner "file" {
      source      = "setup_script.sh"
      destination = "/tmp/setup_script.sh"
  }

  provisioner "remote-exec" {
    inline = [
      "chmod +x /tmp/setup_script.sh",
      "/tmp/setup_script.sh",
    ]
  }
}
{{< /file >}}

When a provisioner is assigned, it should also include the addition of a [connection block](https://www.terraform.io/docs/language/resources/provisioners/connection.html) nested within the resource block to describe how terraform will connect to the remote resource.

Most provisioners are declared inside of a resource declaration. When multiple provisioners are declared inside a resource, they are executed in the order they are listed. For a full list of [provisioners](https://www.terraform.io/docs/provisioners/index.html), review the official Terraform documentation.

{{< note >}}
Linode [StackScripts](https://www.terraform.io/docs/providers/linode/r/stackscript.html) can also be used to set up a new Linode instance. A distinction between using StackScripts and the `file` and `remote-exec` provisioners is that those provisioners will run and complete synchronously before Terraform continues to apply your plan, while a StackScript will run in parallel while Terraform creates the rest of your remaining resources. As a result, Terraform might complete its application before a StackScript has finished running.
{{< /note >}}

## Modules

Terraform allows you to organize your configurations into reusable structures called *modules*. This is useful if you need to create multiple instances of the same cluster of servers. Review [Create a Terraform Module](/docs/guides/create-terraform-module/) for more information on authoring and using modules.

## Backends

By default, Terraform maintains its state in your project's directory. Terraform also supports storing your state in non-local [*backends*](https://www.terraform.io/docs/backends/index.html). The benefits of including your state in another backend include:

-   **Better collaboration with your team.** Backends let you share the same state as other team members that have access to the backend.

-   **Better security.** The state information stored in and retrieved from backends is only kept in memory on your computer.

-   **Remote operations.** When working with a large infrastructure, `terraform apply` can take a long time to complete. Some backends allow you to run the `apply` remotely, instead of on your computer.

The [kinds of backends available](https://www.terraform.io/docs/backends/types/index.html) are listed in Terraform's official documentation.

## Importing

It is possible to import Linode infrastructure that was created outside of Terraform into your Terraform plan. Review [Import Existing Infrastructure to Terraform](/docs/guides/import-existing-infrastructure-to-terraform/) for instructions on this subject.

## Next Steps

To get started with installing Terraform and creating your first projects, read through our [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.
