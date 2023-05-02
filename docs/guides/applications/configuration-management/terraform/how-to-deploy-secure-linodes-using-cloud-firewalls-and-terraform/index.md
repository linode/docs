---
slug: how-to-deploy-secure-linodes-using-cloud-firewalls-and-terraform
description: 'This guide will show you how to use the Terraform application to deploy Linode instances with pre-configured Cloud Firewalls assigned to them.'
keywords: ['terraform','infrastructure','firewalls','orchestration']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-07-29
modified: 2022-11-29
modified_by:
  name: Linode
title: "Deploy Secure Linodes using Cloud Firewalls and Terraform"
image: feature.png
external_resources:
- '[Terraform Linode Provider Official Documentation](https://registry.terraform.io/providers/linode/linode/latest/docs)'
aliases: ['/applications/configuration-management/terraform/how-to-deploy-secure-linodes-using-cloud-firewalls-and-terraform/']
authors: ["Leslie Salazar"]
tags: ["saas"]
---

Terraform modules allow you to better organize your configuration code and to distribute and reuse it. You can host your Terraform modules on remote version control services, like GitHub, for others to use. The Terraform Module Registry hosts community modules that you can reuse for your own Terraform configurations, or you can publish your own modules for consumption by the Terraform community.

In this guide, you will create a Linode Firewalls module which declares commonly used Cloud Firewall configurations. You will then use the module to create a Linode instance and assign the Linode to the Cloud Firewall. You can adopt the example configurations in this guide to create your own reusable Cloud Firewall configurations. For more information on Cloud Firewalls, see the [Cloud Firewalls documentation](/docs/products/networking/cloud-firewall/).

## Before You Begin

1. If you are new to Terraform, read through our [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/) guide to familiarize yourself with key concepts.

1. See [Create a Terraform Module](/docs/guides/create-terraform-module/) for a deeper dive into Terraform's standard module structure and other helpful details.

1. You need a Linode API personal access token to use with Terraform. This token will allow you to create, update, and destroy Linode resources. See the [Manage Personal Access Tokens](/docs/products/tools/api/guides/manage-api-tokens/) guide for steps to create a token.

    {{< note respectIndent=false >}}
    When you create a personal access token ensure that you set **Read/Write** access permissions for Linode instances and Cloud Firewalls.
    {{< /note >}}

1. [Install Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) on your local computer.

    {{< note respectIndent=false >}}
This guide was written using [Terraform version 0.13.0](https://github.com/hashicorp/terraform/releases).
    {{< /note >}}

1. Install Git on your computer and complete the steps in the **Configure Git** section of the [Getting Started with Git guide](/docs/guides/how-to-configure-git/#configure-git).

## Create Your Cloud Firewalls Module

The following steps will create the Cloud Firewalls module, which includes several child modules that split up the required resources between the *root module*, an `inbound_ssh` module, a `mysql` module, and a `web-server` module. The root module is the directory that holds the Terraform configuration files that are applied to build your desired infrastructure. These files provide an entry point into any child modules. Each child module uses the `linode_firewall` resource to create reusable Cloud Firewall rules for specific use cases.

{{< note >}}
You can apply up to three Cloud Firewalls per Linode instance.
{{< /note >}}

{{< note >}}
You can view the files created throughout this tutorial in the [author's GitHub repository](https://github.com/leslitagordita/main-firewalls). You can clone the repository and use it as a foundation to create your own custom Cloud Firewalls module.
{{< /note >}}

### Create Your Module's Directory Structure

In this section, you will create the directory structure outlined below, which will contain the module and child module configuration files that you will create in later steps.

```output
main_firewalls/
├── main.tf
├── outputs.tf
├── secrets.tfvars
├── terraform
├── terraform.tfvars
├── variables.tf
└── modules/
    ├── inbound_ssh/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
    └── mysql/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
    └── web_server/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

1. Move into your `terraform` directory.

    ```command
    cd ~/terraform
    ```

1. From your `terraform` directory, create the directory structure outlined above.

    ```command
    mkdir -p main_firewalls/modules/{inbound_ssh,mysql,web_server}
    ```

    {{< note respectIndent=false >}}
    If you followed our [install Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) steps, then your Terraform executable will be located in the `terraform` directory. If this is not the case, ensure that you can execute Terraform commands from the `main_firewalls` directory.
    {{< /note >}}

### Create the Inbound SSH Child Module

When applied to a Terraform configuration, the `inbound_ssh` module will create a Cloud Firewall with inbound rules to allow `TCP` connections to port `22` from all sources. Port `22` is typically used for secure shell (SSH) connections, secure logins, file transfers (scp, sftp), and port forwarding.

1. Using your preferred text editor, create the `inbound_ssh` module's `main.tf` file. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/inbound_ssh/main.tf"}
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.16.0"
        }
      }
    }
    resource "linode_firewall" "ssh_inbound" {
      label = var.firewall_label
      tags  = var.tags

      inbound {
        protocol = "TCP"
        ports = ["22"]
        addresses = ["0.0.0.0/0"]
      }

      linodes = var.linodes
    }
    ```

    - This file uses the Terraform Linode Provider's `linode_firewall` resource to create a Cloud Firewall with the inbound rules described above.
    - The `linodes` argument expects a list of Linode IDs. When a Linode ID is passed to the `linodes` argument, the `inbound_ssh` firewall will be assigned to it.
    - The arguments `label`, `tags`, and `linodes` make use of [input variables](https://www.terraform.io/docs/configuration/variables.html), which allow these values to be customized when using the module for your resource configurations.

1. Create the `variables.tf` file to declare the `inbound_ssh` module's input variables. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/inbound_ssh/variables.tf"}
    variable "linodes" {
      description = "List of Linode ids to which the rule sets will be applied"
      type        = list(string)
      default     = []
    }

    variable "firewall_label" {
      description = "This firewall's human-readable firewall_label"
      type = string
      default = "my-firewall"
    }

    variable "tags" {
      description = "List of tags to apply to this Firewall"
      type        = list(string)
      default     = []
    }
    ```

    The input variables declared in this file correspond to the `linode_firewalls` resource arguments that the `inbound_ssh` module exposes for customization. In a similar way, you can expose different arguments for your Cloud Firewall child modules as needed.

### Create the MySQL Child Module

The `mysql` child module creates a Cloud Firewall with an inbound rule commonly suited for client connections to a MySQL database server. The inbound rule allows `TCP` connections to port `3306`. The `addressses` argument accepts an input variable so that it can be customized to restrict access to a specific IP address(es) or CIDR block.

1. Using your preferred text editor, create the `inbound_ssh` module's `main.tf` file. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/mysql/main.tf"}
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.16.0"
        }
      }
    }

    resource "linode_firewall" "mysql" {
      label = var.firewall_label
      tags  = var.tags

      inbound {
        protocol = "TCP"
        ports = ["3306"]
        addresses = var.addresses
      }
      linodes = var.linodes
    }
    ```

    - This file uses the Terraform Linode Provider's `linode_firewall` resource to create a Cloud Firewall with the inbound rules described above.
    - The `linodes` argument expects a list of Linode IDs. When a Linode ID is passed to the `linodes` argument, the `mysql` firewall will be assigned to it.
    - The arguments `label`, `tags`, `linodes`, and `addresses` make use of [input variables](https://www.terraform.io/docs/configuration/variables.html), which allow these values to be customized when using the module for your resource configurations.

1. Create the `variables.tf` file to declare the `inbound_ssh` module's input variables. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/mysql/variables.tf"}
    variable "linodes" {
      description = "List of Linode ids to which the rule sets will be applied"
      type        = list(string)
      default     = []
    }

    variable "firewall_label" {
      description = "This firewall's human-readable firewall_label"
      type = string
      default = "my-firewall"
    }

    variable "tags" {
      description = "List of tags to apply to this Firewall"
      type        = list(string)
      default     = []
    }

    variable "addresses" {
      description = "A list of IP addresses, CIDR blocks, or 0.0.0.0/0 (to allow all) this rule applies to."
      type        = list(string)
      default     = ["0.0.0.0/0"]
    }
    ```

    The input variables declared in this file correspond to the `linode_firewalls` resource arguments that the `mysql` module exposes for customization.

### Create the Web Server Child Module

The `web_server` child module, when applied, creates a Cloud Firewall with inbound and outbound rules allowing incoming and outgoing connections from all sources and destinations to ports `80` and `443` over `TCP`. These ports are commonly associated with [HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) and [HTTPS](https://en.wikipedia.org/wiki/HTTPS), respectively.

1. Using your preferred text editor, create the `web_server` module's `main.tf` file. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/web_server/main.tf"}
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.16.0"
        }
      }
    }

    resource "linode_firewall" "web_server" {
      label = var.firewall_label
      tags  = var.tags

      inbound {
        protocol = "TCP"
        ports = ["80"]
        addresses = ["0.0.0.0/0"]
      }

      outbound {
        protocol  = "TCP"
        ports     = ["80"]
        addresses = ["0.0.0.0/0"]
      }

      inbound {
        protocol = "TCP"
        ports = ["443"]
        addresses = ["0.0.0.0/0"]
      }

      outbound {
        protocol  = "TCP"
        ports     = ["443"]
        addresses = ["0.0.0.0/0"]
      }

      linodes = var.linodes
    }
    ```

    - This file uses the Terraform Linode Provider's `linode_firewall` resource to create a Cloud Firewall with the inbound and outbound rules described above.

    - The `linodes` argument expects a list of Linode IDs. When a Linode ID is passed to the `linodes` argument, the `web_server` firewall will be assigned to it.

    - The arguments `label`, `tags`, and `linodes` make use of [input variables](https://www.terraform.io/docs/configuration/variables.html), which allow these values to be customized when using the module for your resource configurations.

1. Create the `variables.tf` file to declare the `web_server` module's input variables. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/web_server/variables.tf"}
    variable "linodes" {
      description = "List of Linode ids to which the rule sets will be applied"
      type        = list(string)
      default     = []
    }

    variable "firewall_label" {
      description = "This firewall's human-readable firewall_label"
      type = string
      default = "my-firewall"
    }

    variable "tags" {
      description = "List of tags to apply to this Firewall"
      type        = list(string)
      default     = []
    }
    ```

    The input variables declared in this file correspond to the `linode_firewalls` resource arguments that the `web_server` module exposes for customization.

### Create the Root Module

Now that all the Cloud Firewalls child modules have been created, you can create your root module. The root module is in charge of defining the infrastructure to be built by Terraform. The root module has access to all the child modules and can make use of all or none of them. In this section, you will create a root module that can create a Cloud Firewall using the rules defined in the `web_server` child module. It also creates two Linode instances and assigns the Cloud Firewall to both Linode instances.

1. Using your preferred text editor, create the root module's `main.tf` file. Copy and save the contents of the example below.

    ```file {title="~/main_firewalls/main.tf"}
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.16.0"
        }
      }
    }

    provider "linode" {
        api_version = "v4beta"
        token = var.token
    }

    locals {
        key = var.key
        linode_ids = linode_instance.linode_base[*].id
    }

    module "firewalls_web" {
        source = "./modules/web_server"
        firewall_label = var.firewall_label_map["web"]
        tags = var.tags
        linodes = local.linode_ids
    }

    resource "linode_sshkey" "main_key" {
        label = var.key_label
        ssh_key = chomp(file(local.key))
    }

    resource "linode_instance" "linode_base" {
        count = var.linode_count
        image = var.image
        label = "${var.label}_${count.index}"
        region = var.region
        type = var.type
        authorized_keys = [ linode_sshkey.main_key.ssh_key ]
        root_pass = var.root_pass
    }
    ```

    - The `provider` block is a requirement to use the Linode provider. Since Cloud Firewalls is currently in an open beta, you must use the `api_version` argument to tell Terraform to use Linode's beta [API v4 endpoints](/docs/api/).

    - The `locals` block declares a local variable `key` whose value will be provided by an input variable. The `linode_ids` local variable is used by the `web_server` module instance in the next block to retrieve the Linode ids for the Linodes to be assigned to the Cloud Firewall that will be created.

    - The `module "firewalls_web"` block creates an instance of the `web_server` child module, which when applied will create a new Cloud Firewall with the configurations provided by the child module and input variable values you will provide in a later step.

    - The `source` argument provides the location of the child module’s source code and is required whenever you create an instance of a module.

    - All other arguments are determined by the child module. Since the `web_server` child module exposes the `firewall_label`, `tags`, and `linodes`, values must be provided for them. Input variables are used in the root module to make it reusable. Depending on the child module that you are using, and the label you'd like to assign to the Cloud Firewall, you should replace the key value for the  `var.firewall_label_map["web"]`. Refer to the `variables.tf` file for details.

    - The `linodes` argument retrieves its value from the local variable defined in the previous block.

    - The `linode_sshkey` resource will create Linode SSH Keys tied to your Linode account. These keys can be reused for future Linode deployments once the resource has been created.

    - `ssh_key = chomp(file(local.key))` uses Terraform’s built-in function `file()` to provide a local file path to your public SSH key’s location. The location of the file path is the value of the local variable `key`. The `chomp()` built-in function removes trailing new lines from the SSH key.

    - The `linode_instance` resource creates two Linode instances with configurations provided by its arguments.

    - The `count` argument controls how many Linode instances will be created with the configurations provided in the resource block's arguments.

    - Since Linode labels must be unique, the `label` argument will create a label based on a value provided to the `var.label` input variable and the index number representing the Linode instance that is created.

    - The `authorized_keys` argument uses the SSH public key provided by the `linode_sshkey` resource in the previous resource block.

1. Create the `variables.tf` file to declare the root module's input variables. These input variables are a combination of the all the values required by the various resources used in the `main.tf` file. You can update the default values to your own preferences.

    ```file {title="~/main_firewalls/variables.tf"}
    variable "token" {
      description = " Linode API token"
    }

    variable "key" {
      description = "Public SSH Key's path."
    }

    variable "key_label" {
      description = "New SSH key label."
    }

    variable "linode_count" {
      description = "The number of Linode instances to deploy."
      type = number
      default = 1
    }

    variable "image" {
      description = "Image to use for Linode instance."
      default = "linode/ubuntu18.04"
    }

    variable "label" {
      description = "The Linode's label is for display purposes only, but must be unique."
      default = "default-linode"
    }

    variable "region" {
      description = "The region where your Linode will be located."
      default = "us-east"
    }

    variable "type" {
      description = "Your Linode's plan type."
      default = "g6-standard-1"
    }

    variable "root_pass" {
      description = "Your Linode's root user's password."
    }

    variable "linodes" {
      description = "List of Linode ids to which the rule sets will be applied"
      type        = list(string)
      default     = []
    }

    variable "firewall_label_map" {
      type = "map"
      default = {
        "web" = "firewall_web_server"
        "mysql" = "firewall_mysql"
        "ssh" = "firewall_ssh"
      }
    }

    variable "tags" {
      description = "List of tags to apply to this Firewall"
      type        = list(string)
      default     = []
    }
    ```

    The variable declaration for `firewall_label_map`, by default, creates a map with default keys `web`, `mysql`, and `ssh`. You can use these keys to provide the map's default values to the `firewall_label` argument. Alternatively, you can override the default values in the `terraform.tfvars` file that you will create in a later step.

1. Create the `outputs.tf` file.  This file exposes the IDs of the Linode instances that are created by the `linode_instance` resource block and will be printed to your console when the root module's configurations are applied.

    ```file {title="~/main_firewalls/output.tf"}
    output "linode_id" {
        value = linode_instance.linode_base[*].id
    }
    ```

1. Create the `terraform.tfvars` file to provide values for all input variables defined in the `variables.tf` file. This file will exclude any values that provide sensitive data, like passwords and API tokens. A file containing sensitive values will be created in the next step. You can replace any of these values with your own.

    ```file {title="~/main_firewalls/terraform.tfvars"}
    key = "~/.ssh/id_rsa.pub"
    linode_count = 3
    key_label = "my-ssh-key"
    label = "linode"
    tags = ["my-example-tag"]
    firewall_label_map = {
        "web" = "firewall_webserver_http_https"
    }
    ```

1. Create a file named `secrets.tfvars` to store any sensitive values. Replace the example values with your own.

    ```file {title="~/main_firewalls/secrets.tfvars"}
    token = "my-api-v4-token"
    root_pass = "my-super-strong-root-password"
    ```

    {{< note respectIndent=false >}}
This file should never be tracked in version control software and should be listed in your `.gitignore` file if using GitHub.
    {{< /note >}}

You are now ready to apply your `main_firewalls` module’s Terraform configuration. These steps will be completed in the next section.

## Initialize, Plan and Apply the Terraform Configuration

Whenever a new provider is used in a Terraform configuration, it must first be initialized. The initialization process downloads and installs the provider’s plugin and performs any other steps needed for its use. Before applying your configuration, it is also useful to view your configuration’s execution plan before making any actual changes to your infrastructure. In this section, you will complete all these steps.

1. Initialize the Linode provider. Ensure you are in the `linode_stackscripts` directory before running this command:

    ```command
    terraform init
    ```

    You will see a message that confirms that the provider plugins have been successfully initialized.

1. Run the Terraform plan command:

    ```command
    terraform plan -var-file="secrets.tfvars" -var-file="terraform.tfvars"
    ```

    Terraform plan won’t take any action or make any changes on your Linode account. Instead, an analysis is done to determine which actions (i.e. Linode instance creations, deletions, or modifications) are required to achieve the state described in your configuration.

1. You are now ready to create the infrastructure defined in your root module's `main.tf` configuration file:

    ```command
    terraform apply -var-file="secrets.tfvars" -var-file="terraform.tfvars"
    ```

    Since you are using multiple variable value files, you must call each file individually using the `var-file` argument. You will be prompted to confirm the `apply` action. Type *yes* and hit **enter**. Terraform will begin to create the resources you’ve defined throughout this guide. This process will take a couple of minutes to complete. Once the infrastructure has been successfully built you will see a similar output:

    ```output
    Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
    ```

1. You can verify that your Cloud Firewalls have been created and applied to your new Linode instances by logging into the [Linode Cloud Manager](https://cloud.linode.com/) and navigating to the **Firewalls** section of the manager.

## Next Steps

To learn how to [version control](/docs/guides/create-terraform-module/#version-control-your-terraform-module) the `main-firewalls` module that you created in this guide, see the [Create a Terraform Module](/docs/guides/create-terraform-module/) guide.