---
slug: multicloud-with-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: 'Terraform can easily manage multi-tier and multi-cloud networks using only a couple of configuration files. This guide explains how to use Terraform and HCL to define and deploy a multicloud network that spans across Linode and another cloud vendor.'
og_description: 'Terraform can easily manage multi-tier and multi-cloud networks using only a couple of configuration files. This guide explains how to use Terraform and HCL to define and deploy a multicloud network that spans across Linode and another cloud vendor.'
keywords: ['Terraform','Linode','IaC','multicloud']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-25
modified_by:
  name: Linode
title: "Using Terraform to Deploy a Multicloud Network"
h1_title: "How to Use Terraform to Deploy a Multicloud Network."
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Terraform Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs)'
---

[*Terraform*](https://www.terraform.io/) is a popular tool for *Infrastructure as Code* (IaC). IaC is a technique for deploying infrastructure exclusively through automation, without any manual configuration. Terraform describes networks through a declarative approach, using either JSON or the *HashiCorp Configuration Language* (HCL). Terraform can easily manage a multi-tier or multicloud network using only a couple of configuration files. This guide explains how to use Terraform and HCL to define and deploy a multicloud network that spans Linode and another vendor.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide uses `sudo` wherever possible. Complete the sections of the [Securing Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

3.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## An Introduction to Infrastructure as Code and Terraform

Infrastructure as Code tools manage the infrastructure through the use of configuration files, scripts, and automated tools. IaC reduces the time required to deploy networks and minimizes operational costs. It eliminates configuration errors and avoids network inconsistency because it enforces standard configuration procedures across all devices. A DevOps team, which includes members from development and operations, usually manages the IaC process. This group proactively plans the structure, layout, and configuration of the network beforehand, and optimizes the deployment.

Terraform is a popular free, open source IaC tool that builds and scales network services and manages the state of the network. Terraform is considered a service orchestration tool that can create or modify servers and network services. It is also used to configure other virtual services such as database tables. This means it is most commonly used in data centers and cloud-based networks. Terraform does not manage software configuration, and it does not install or manage software on existing devices. To perform state management, Terraform retrieves the actual configuration of each resource and stores the network metadata information. Terraform is easy to use and does not require previous programming experience.

Terraform uses a declarative approach to define a network. Although it is possible to use JSON, Terraform recommends the HCL language for this task. Terraform configuration files use HCL to specify what the final network should look like, in terms of the *resources* used and the configuration specifics. Each resource describes a particular piece of the infrastructure, for example, a table in a virtual database. HCL is a fairly simple language. It contains blocks, arguments, variables, and expressions, but it does not have any control structures. Terraform does not dictate how to provision the network and does not express any commands. It delegates this task to the *providers*, which help manage the individual resources.

Providers are APIs that declare a collection of resource types and data sources. They allow Terraform to manage the various devices or perform some task. Users must declare the providers they are using upfront so Terraform can install them during the initialization phase. Most providers are associated with specific platforms and vendors, but some are general utilities. You can access an extensive list of providers, including a [*Linode Provider*](https://registry.terraform.io/providers/linode/linode/latest/docs), through the [*Terraform Registry*](https://registry.terraform.io/). Terraform files, which must have a `.tf` extension, generally contain both a provider block and resource blocks, with separate files for variables.

Terraform can manage both external service providers and in-house solutions. However, it is especially useful for N-tier applications, for example, web servers that require a database layer. Terraform contains mechanisms to track the dependencies between applications, so it ensures the databases are ready before the web servers are launched. To increase fault tolerance and handle migrations, Terraform can manage multiple clouds. A single Terraform command can oversee deployments to multiple providers and even handle cross-cloud dependencies. Because it is so easy to create a cloud network from scratch using Terraform, it is handy for demos and other disposable environments. Terraform is also a good choice for testing, validating bug fixes, and formal acceptance.

## Downloading and Verifying Terraform

A central server is not required to run Terraform, and theoretically any Linode server with Terraform installed could provision other devices. However, the most efficient option is to install Terraform on one central Linode server and then use it to deploy the remaining devices. This Linode can provision the other Linode devices as well as the other cloud networks. The following installation instructions are geared towards Ubuntu 20.04, but are generally applicable to most Linux distributions.

To install Terraform on a Linode server, follow these steps:

1.  Choose a Linode to serve as the main Terraform host and upgrade it.

        sudo apt-get update
        sudo apt-get upgrade
2.  Create a new directory for Terraform, and change to this directory.

        mkdir ~/terraform
        cd ~/terraform
3.  Download the Linux `.zip` archive, `SHA256` file, and checksum `sig` file for the most recent version of Terraform. Either download the files from the [*Terraform download page*](https://www.terraform.io/downloads.html) and transfer them to the Linode server, or transfer them directly using `wget` commands. Download the 64-bit version of the archive, not the 32-bit one. The current version of Terraform is 0.14.9, and the following commands refer to this version.

        wget https://releases.hashicorp.com/terraform/0.14.9/terraform_0.14.9_linux_amd64.zip
        wget https://releases.hashicorp.com/terraform/0.14.9/terraform_0.14.9_SHA256SUMS
        wget https://releases.hashicorp.com/terraform/0.14.9/terraform_0.14.9_SHA256SUMS.sig
4.  Locate Terraform's public GPG key on their [*Security page*](https://www.hashicorp.com/security) under the "Secure Communications" section. Use this value to import the key.

        gpg --recv-keys 51852D87348FFC4C
    The `gpg` program confirms the key has been successfully imported.
    {{< output >}}
gpg: key 51852D87348FFC4C: public key "HashiCorp Security <security@hashicorp.com>" imported
gpg: Total number processed: 1
gpg:               imported: 1
    {{< /output >}}
5.  Use `gpg` to validate the signature file. Use the exact names of the `sig` and `SHA256` files.

        gpg --verify terraform_0.14.9_SHA256SUMS.sig terraform_0.14.9_SHA256SUMS
    The output confirms the `sig` file is a good signature.
    {{< output >}}
gpg: Signature made Wed Mar 24 18:50:18 2021 UTC
gpg:                using RSA key 91A6E7F85D05C65630BEF18951852D87348FFC4C
gpg: Good signature from "HashiCorp Security <security@hashicorp.com>" [unknown]
    {{< /output >}}
6.  Ensure the RSA key displayed in the output of the last step matches the fingerprint shown on the[*Terraform Security page*](https://www.hashicorp.com/security). The fingerprint is located in the same place as the GPG key in the "Secure Communications" section.
7.  Verify the checksum of the `zip` archive. For the following command, use the exact name of the `SHA256` file.

        sha256sum -c terraform_0.14.9_SHA256SUMS  2>&1 | grep OK
    The `sha256sum` program displays the name of the `zip` file along with the status. If the status is not `OK`, the `zip` file is corrupt and must be downloaded again.
    {{< output >}}
terraform_0.14.9_linux_amd64.zip: OK
    {{< /output >}}

{{< note >}}
Previous versions of Terraform can be found on the [*Terraform releases page*](https://releases.hashicorp.com/terraform/).
{{< /note >}}

## Installing Terraform on the Linode Server

To install Terraform on the Linode server and configure all the necessary environment variables, follow these steps:

1.  While still inside the Terraform directory, `unzip` the Terraform file. Substitute the exact name of the `zip` file.

        unzip terraform_0.14.9_linux_amd64.zip
2.  Append the path for the Terraform executable to the `.profile` file in your home directory. Source the file to apply the changes.

        echo 'export PATH="$PATH:$HOME/terraform"' >> ~/.profile
        source ~/.profile
3.  Run the `terraform` command without any arguments to verify the installation. Terraform displays some usage information along with a list of common commands.

        terraform
    {{< output >}}
Usage: terraform [global options] <subcommand> [args]

The available commands for execution are listed below.
The primary workflow commands are given first, followed by
less common or more advanced commands.

Main commands:
  init          Prepare your working directory for other commands
  validate      Check whether the configuration is valid
  plan          Show changes required by the current configuration
  apply         Create or update infrastructure
  destroy       Destroy previously-created infrastructure

All other commands:
...
    {{< /output >}}

## Defining the Infrastructure Using the HashiCorp Configuration Language (HCL)

You must first define the final state of the network using the HCL language. This specification lists each new device or service along with the relevant configuration details. Although you can describe the entire network using only one file, in practice this is usually unwieldy. For security reasons and for ease of maintenance, variable definitions should be split out into a different file. It is also a good idea to define each individual cloud network inside a separate file. For large networks, the files could be subdivided even further. For example, an individual subnet or a particular device could be described its own file. The [*Terraform documentation*](https://www.terraform.io/docs/language/index.html) contains more information about HCL and the Terraform syntax.

For each vendor, first define the provider and then define all the resources from the provider. This example explains how to construct a multicloud configuration consisting of one Linode and one service on the Amazon Web Services (AWS) cloud.

### Defining the Linode Infrastructure

The Terraform Registry already contains a [*Linode Provider*](https://registry.terraform.io/providers/linode/linode/latest/docs), which provides examples describing a sample Linode configuration. You must generate a Linode Token before you can use the Linode API. The Linode API Token allows Terraform to configure devices in the Linode cloud. See Linode's guide on [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) to learn how to create a token.

{{< note >}}
The Linode token must be compatible with the v4 version of the API. Older tokens no longer work.
{{< /note >}}

1.  Create a new file named `linode-terraform.tf` inside the Terraform directory.

        cd terraform
        vi linode-terraform.tf
2.  At the top of the file, add a Terraform block to define the Linode provider, followed by the declaration of the Linode provider itself. Within the provider block, add the `token` declaration. For security reasons, the token value references a variable rather than the actual API token. The variables are defined in a subsequent step.

    {{< file "~/terraform/linode-terraform.tf" aconf >}}
terraform {
  required_providers {
    linode = {
        source = "linode/linode"
        version = "1.16.0"
    }
  }
}
# Linode Provider definition
provider "linode" {
  token = var.token
}
    {{< /file >}}
3.  Immediately following the provider declaration, define the Linode resources. In this case, the `terraform-example` resource is a standard 2GB Linode running Ubuntu 20.04. You must assign values for the image, region, and type of the Linode server, along with a password. Lists of the allowable values for each of the fields, such as the region, are found in the [*Linode API*](https://www.linode.com/docs/api/). Expand the **API** section of the left-hand menu and locate the relevant submenu, such as **images**.

    The full `linode-terraform.tf` file, including both the provider and resource sections, is shown below.
    {{< file "~/terraform/linode-terraform.tf" aconf >}}
terraform {
  required_providers {
    linode = {
        source = "linode/linode"
        version = "1.16.0"
    }
  }
}
# Linode Provider definition
provider "linode" {
  token = var.token
}
resource "linode_instance" "terraform-example" {
        image = "linode/ubuntu20.04"
        label = "Terraform-Web-Example"
        group = "Terraform"
        region = "eu-west"
        type = "g6-standard-1"
        authorized_keys = [var.authorized_keys]
        root_pass = var.root_pass
}
    {{< /file >}}
4.  Create a file in the same directory named `variables.tf`, and declare all the variables from `linode-terraform.tf`, as shown below.

        vi variables.tf
    {{< file "~/terraform/variables.tf" aconf >}}
variable "token" {}
variable "authorized_keys" {}
variable "root_pass" {}
    {{< /file >}}
5.  Create a third file in the directory to define the actual values for each variable. Name the file `terraform.tfvars`. For the following variables, substitute your Linode API token, your SSH key, and a secure password for the device.

        vi terraform.tfvars
    {{< file "~/terraform/terraform.tfvars" aconf >}}
token = "YOUR_LINODE_API_TOKEN"
authorized_keys = "YOUR_PUBLIC_SSH_KEY"
root_pass ="YOUR_ROOT_PASSWORD"
{{< /file >}}

{{< note >}}
It might also make sense to declare variables for fields where each resource has the same value. If each Linode uses the same image, define an `image` variable and assign `var.image` to the image parameter of each resource. This makes it easier to update the image information for all of the devices.
{{< /note >}}

### Defining the AWS Infrastructure

Specify the AWS network in much the same way as the Linode device. To provision an AWS device using Terraform, you must already have an AWS account and an AWS secret key.
1.  Create a new file named `aws-terraform.tf` inside the Terraform directory.

        vi aws-terraform.tf
2.  Add the following information to declare the AWS provider. Specify an AWS region for the resource, along with variable references for the `aws_access_key` and `aws_secret_key`.

    {{< file "~/terraform/aws-terraform.tf" aconf >}}
#Initialize the AWS Provider
provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = "eu-west-2"
}
    {{< /file >}}
3.  Add a declaration for the AWS resource. This example demonstrates how to configure a database table in the DynamoDB service. For more information on how to define AWS resources in Terraform, consult the [*AWS Provider in the Terraform Registry*](https://registry.terraform.io/providers/hashicorp/aws/latest/docs). The entire file, including the provider information, is shown here.
    {{< file "~/terraform/aws-terraform.tf" aconf >}}
#Initialize the AWS Provider
provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = "eu-west-2"
}
resource "aws_dynamodb_table" "inventory-dynamodb-table" {
  name           = "RecordInventory"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "ArtistName"
  range_key      = "AlbumTitle"

  attribute {
    name = "ArtistName"
    type = "S"
  }

  attribute {
    name = "AlbumTitle"
    type = "S"
  }
}
    {{< /file >}}
4.  Edit the `variables.tf` file, and add the new variables used in `aws-terraform.tf` to the bottom of the file, as shown here.
    {{< note >}}
If a large number of variables are used throughout the configuration files, each cloud vendor should have its own variables file.
    {{< /note >}}

    {{< file "~/terraform/variables.tf" aconf >}}
...
variable "aws_access_key" {}
variable "aws_secret_key" {}
    {{< /file >}}
5.  Edit the `terraform.tfvars` and add the actual values of your AWS keys.

    {{< file "~/terraform/terraform.tfvars" aconf >}}
...
aws_access_key = "YOUR_AWS_ACCESS_TOKEN"
aws_secret_key = "YOUR_AWS_SSH_KEY"
{{< /file >}}

## Validating and Applying the Terraform Configuration

To deploy the new configuration, first initialize Terraform and generate the proposed plan. Then run the `apply` command to push the configuration out to the network.

1.  Initialize Terraform, so it can read the variables and load all the necessary providers. If the providers are defined correctly and there are no syntax errors, the initialization should succeed. If Terraform displays an error, and the problem is not obvious, run the `init` command again with debug information turned on using `TF_LOG=debug terraform init`.

        terraform init
    {{< output >}}
- Finding linode/linode versions matching "1.16.0"...
- Finding latest version of hashicorp/aws...
- Installing linode/linode v1.16.0...
- Installed linode/linode v1.16.0 (signed by a HashiCorp partner, key ID F4E6BBD0EA4FE463)
- Installing hashicorp/aws v3.34.0...
- Installed hashicorp/aws v3.34.0 (signed by HashiCorp)
...
Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
...
    {{< /output >}}
2.  Run the `terraform plan` command. Terraform analyses the configuration and the current state of the network, if any, and responds with a summary of the proposed changes. The plan lists the resources that Terraform expects to create, change, or delete. Terraform does not apply the configuration yet, and this command does not result in any changes to the network. Review the plan and ensure it matches your network strategy. If the plan does not seem right, make any necessary changes to the Terraform files and run `terraform plan` again. You can edit and refine the plan as many times as you want.

        terraform plan
    {{< note >}}
If the command generates an error, or some other unexpected result, run `terraform plan` again in debug mode.

        TF_LOG=debug terraform plan
    {{< /note >}}

    {{< output >}}
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_dynamodb_table.inventory-dynamodb-table will be created
  + resource "aws_dynamodb_table" "inventory-dynamodb-table" {
      + arn              = (known after apply)
      + billing_mode     = "PROVISIONED"
      + hash_key         = "ArtistName"
      + id               = (known after apply)
      + name             = "RecordInventory"
      + range_key        = "AlbumTitle"
      + read_capacity    = 20
      + stream_arn       = (known after apply)
      + stream_label     = (known after apply)
      + stream_view_type = (known after apply)
      + write_capacity   = 20

      + attribute {
          + name = "AlbumTitle"
          + type = "S"
        }
      + attribute {
          + name = "ArtistName"
          + type = "S"
        }

      + point_in_time_recovery {
          + enabled = (known after apply)
        }

      + server_side_encryption {
          + enabled     = (known after apply)
          + kms_key_arn = (known after apply)
        }
    }

  # linode_instance.terraform-example will be created
  + resource "linode_instance" "terraform-example" {
      + backups            = (known after apply)
      + backups_enabled    = (known after apply)
      + boot_config_label  = (known after apply)
      + group              = "Terraform"
      + id                 = (known after apply)
      + image              = "linode/ubuntu20.04"
      + ip_address         = (known after apply)
      + ipv4               = (known after apply)
      + ipv6               = (known after apply)
      + label              = "Terraform-Web-Example"
      + private_ip_address = (known after apply)
      + region             = "eu-west"
      + root_pass          = (sensitive value)
      + specs              = (known after apply)
      + status             = (known after apply)
      + swap_size          = (known after apply)
      + type               = "g6-standard-1"
      + watchdog_enabled   = true

      + alerts {
          + cpu            = (known after apply)
          + io             = (known after apply)
          + network_in     = (known after apply)
          + network_out    = (known after apply)
          + transfer_quota = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
    {{< /output >}}
3.  When the planning process is complete, deploy the new resources using the `apply` command.

        terraform apply
    Terraform displays the plan of action again and asks for a confirmation.
    {{< output >}}
Plan: 2 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value
    {{< /output >}}
4.  Enter `yes` to continue with the deployment.

        yes
    Terraform then provisions the network in accordance with its plan. Depending on the number of devices, and the resource type, this might take several minutes. When Terraform has configured the network, it summarizes the results.
    {{< output >}}
linode_instance.terraform-example: Creating...
aws_dynamodb_table.inventory-dynamodb-table: Creating...
aws_dynamodb_table.inventory-dynamodb-table: Creation complete after 6s [id=RecordInventory]
linode_instance.terraform-example: Still creating... [10s elapsed]
linode_instance.terraform-example: Still creating... [20s elapsed]
linode_instance.terraform-example: Still creating... [30s elapsed]
linode_instance.terraform-example: Still creating... [40s elapsed]
linode_instance.terraform-example: Still creating... [50s elapsed]
linode_instance.terraform-example: Still creating... [1m0s elapsed]
linode_instance.terraform-example: Creation complete after 1m4s [id=25603885]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
    {{< /output >}}
5.  Visit the Linode Cloud Manager to confirm the new Linode is operational. Review the AWS Dashboard to verify the contents of the new database.
6.  Terraform stores details about the state of the network in the `terraform.tfstate` file within the same directory. Review this file to learn more about the network, including details such as the IP address of the new Linode. You can also use the Linode Cloud Manager to find this information.

## Updating the Terraform Configuration

Most networks grow and change over time. Terraform gracefully handles configuration changes by comparing the current state of the network against the updated configuration files. It then prepares a plan, with the goal of minimizing disruption to the network. New deployments do not necessarily affect pre-existing devices that are not being updated, and Terraform can modify a service without affecting the other services. The following example illustrates how to simultaneously add a new Linode and change the AWS database table.

1.  Edit the `linode-terraform.tf` file and add the following information to the end of the file. This defines a 1GB Linode running Ubuntu 18.04 as a new resource.

    {{< file "~/terraform/linode-terraform.tf" aconf >}}
...
resource "linode_instance" "terraform2-example" {
        image = "linode/ubuntu18.04"
        label = "Terraform-Web-Example-2"
        group = "Terraform"
        region = "eu-west"
        type = "g6-nanode-1"
        authorized_keys = [var.authorized_keys]
        root_pass = var.root_pass
}
    {{< /file >}}
2.  Edit the `aws-terraform.tf` and alter one of the fields. In this case, change `AlbumTitle` to `RecordTitle`. Change the name of the `range_key` field to correspond to the new name.
    {{< file "~/terraform/aws-terraform.tf" aconf >}}
...
  range_key      = "RecordTitle"
...
  attribute {
    name = "RecordTitle"
    type = "S"
  }
...
    {{< /file >}}
3.  Execute the `terraform plan` command again.

        terraform plan
    Terraform displays the new plan, which calls for two additions and one deletion. In order to apply the new database schema, Terraform plans to delete and re-create the table. This potentially surprising change illustrates why it is important to run the `plan` command. If the table contains important data that must be preserved, re-edit the files and remove this change.
    {{< output >}}
linode_instance.terraform-example: Refreshing state... [id=25603885]
aws_dynamodb_table.inventory-dynamodb-table: Refreshing state... [id=RecordInventory]

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create
-/+ destroy and then create replacement

Terraform will perform the following actions:

  # aws_dynamodb_table.inventory-dynamodb-table must be replaced
-/+ resource "aws_dynamodb_table" "inventory-dynamodb-table" {
      ~ arn              = "arn:aws:dynamodb:eu-west-2:836653344247:table/RecordInventory" -> (known after apply)
      ~ id               = "RecordInventory" -> (known after apply)
        name             = "RecordInventory"
      ~ range_key        = "AlbumTitle" -> "RecordTitle" # forces replacement
      + stream_arn       = (known after apply)
      - stream_enabled   = false -> null
      + stream_label     = (known after apply)
      + stream_view_type = (known after apply)
      - tags             = {} -> null
        # (4 unchanged attributes hidden)

      - attribute {
          - name = "AlbumTitle" -> null
          - type = "S" -> null
        }
      + attribute {
          + name = "RecordTitle"
          + type = "S"
        }

      ~ point_in_time_recovery {
          ~ enabled = false -> (known after apply)
        }

      + server_side_encryption {
          + enabled     = (known after apply)
          + kms_key_arn = (known after apply)
        }

      - ttl {
          - enabled = false -> null
        }
        # (1 unchanged block hidden)
    }

  # linode_instance.terraform2-example will be created
  + resource "linode_instance" "terraform2-example" {
      + backups            = (known after apply)
      + backups_enabled    = (known after apply)
      + boot_config_label  = (known after apply)
      + group              = "Terraform"
      + id                 = (known after apply)
      + image              = "linode/ubuntu18.04"
      + ip_address         = (known after apply)
      + ipv4               = (known after apply)
      + ipv6               = (known after apply)
      + label              = "Terraform-Web-Example-2"
      + private_ip_address = (known after apply)
      + region             = "eu-west"
      + root_pass          = (sensitive value)
      + specs              = (known after apply)
      + status             = (known after apply)
      + swap_size          = (known after apply)
      + type               = "g6-nanode-1"
      + watchdog_enabled   = true

      + alerts {
          + cpu            = (known after apply)
          + io             = (known after apply)
          + network_in     = (known after apply)
          + network_out    = (known after apply)
          + transfer_quota = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 1 to destroy.
    {{< /output >}}
4.  When the plan is finalized, run the `apply` command to deploy the changes. Enter `yes` when prompted to proceed with the changes.

        terraform apply
   {{< output >}}
linode_instance.terraform2-example: Creating...
aws_dynamodb_table.inventory-dynamodb-table: Destroying... [id=RecordInventory]
aws_dynamodb_table.inventory-dynamodb-table: Destruction complete after 2s
aws_dynamodb_table.inventory-dynamodb-table: Creating...
aws_dynamodb_table.inventory-dynamodb-table: Creation complete after 7s [id=RecordInventory]
linode_instance.terraform2-example: Still creating... [10s elapsed]
linode_instance.terraform2-example: Still creating... [20s elapsed]
linode_instance.terraform2-example: Still creating... [30s elapsed]
linode_instance.terraform2-example: Still creating... [40s elapsed]
linode_instance.terraform2-example: Creation complete after 48s [id=25624349]

Apply complete! Resources: 2 added, 0 changed, 1 destroyed.
    {{< /output >}}
5.  Visit the Linode Cloud Manager and the AWS dashboard to verify the updates were implemented correctly.

## Destroying the Terraform Configuration

It is easy to completely delete a network when it is no longer required. The `terraform destroy` command uses Terraform's state information to delete all the devices.

1.  Run the `plan` command with the `-destroy` flag. Verify the list of resources that are scheduled for deletion.

        terraform plan -destroy
    {{< output >}}
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  # aws_dynamodb_table.inventory-dynamodb-table will be destroyed
...
  # linode_instance.terraform-example will be destroyed
...
  # linode_instance.terraform2-example will be destroyed
...
Plan: 0 to add, 0 to change, 3 to destroy.
    {{< /output >}}
2.  Run the `terraform destroy` command to delete the network. Enter `yes` when Terraform asks you to confirm the changes.

        terraform destroy
    {{< caution >}}
This command permanently deletes the network. This operation cannot be undone or reversed.
    {{< /caution >}}
    {{< output >}}
Plan: 0 to add, 0 to change, 3 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

linode_instance.terraform-example: Destroying... [id=25603885]
linode_instance.terraform2-example: Destroying... [id=25624349]
aws_dynamodb_table.inventory-dynamodb-table: Destroying... [id=RecordInventory]
aws_dynamodb_table.inventory-dynamodb-table: Destruction complete after 3s
linode_instance.terraform2-example: Destruction complete after 4s
linode_instance.terraform-example: Destruction complete after 4s

Destroy complete! Resources: 3 destroyed.

    {{< /output >}}
3.  Verify the devices and services have been removed using the Linode Cloud Manager and the dashboard for the other network.

## Learning More About Terraform

Terraform is useful for more complicated networks and complex configuration tasks. It offers many advanced techniques to help streamline common IaC tasks. For instance, Terraform modules can package frequently-used configuration tasks together. See Linode's [Guide to Creating a Terraform Module](/docs/applications/configuration-management/terraform/create-terraform-module) for instructions on how to create a module. For more details on how to use HCL and Terraform along with some useful tutorials, reference the [*Terraform documentation*](https://www.terraform.io/docs/index.html). Find out more details about the individual providers and their APIs at the [*Terraform Registry*](https://registry.terraform.io/), which contains resources dedicated to the [*Linode Provider*](https://registry.terraform.io/providers/linode/linode/latest/docs).