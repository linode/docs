---
slug: create-a-multicloud-infrastructure-using-terraform
description: 'This guide shows you how to use Multicloud Terraform to provide a consistent workflow so you can manage infrastructure with only a few configuration files.'
keywords: ['Terraform','Linode','IaC','multicloud', 'automation', 'cloud manager']
tags: ['terraform','ubuntu', 'ssh', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-04-23
image: MulticloudInfra_Terraform.png
modified_by:
  name: Linode
title: "Creating a Multicloud Infrastructure Using Terraform"
title_meta: "How to Create a Multicloud Infrastructure Using Terraform"
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Terraform Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs)'
- '[Security page](https://www.hashicorp.com/security)'
- '[Terraforms download page](https://www.terraform.io/downloads.html)'
- '[resource types](https://www.terraform.io/docs/language/resources/index.html)'
- '[data sources](https://www.terraform.io/docs/language/data-sources/index.html)'
- '[HashiCorp Configuration Language](https://github.com/hashicorp/hcl)'
- '[Resources](https://www.terraform.io/docs/language/resources/syntax.html)'
- '[DynamoDB service](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html)'
- '[AWS Provider in the Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)'
- '[Build, update, or destroy AWS infrastructure with Terraform](https://learn.hashicorp.com/collections/terraform/aws-get-started)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

[*Terraform*](https://www.terraform.io/) is an open-source tool that is built by [*HashiCorp*](https://www.hashicorp.com). Using the *HashiCorp Configuration Language* (HCL), you can automate deploying your infrastructure, and provisioning its resources.

With only a few configuration files, you can build, manage, update, and delete your infrastructure using Terraform. This technique, enabled by Terraform, is known as *Infrastructure as Code* (IaC).

This guide explains how to use Terraform and HCL to define and deploy a multicloud environment that spans Linode and another vendor.

## What is Infrastructure as Code (IaC)?

Code that declares the final state of your desired infrastructure is referred to *Infrastructure as Code*.

**The Advantages of IaC:**

- **Reliability:** Your resources are configured exactly as they are declared.

- **Agility:** IaC reduces manual work and eliminates configuration errors and inconsistencies.

- **Increased speed & efficiency:** IaC allows you to spin up your entire infrastructure architecture with a few configuration files —you can launch cloud services, and storage systems in minutes.

- **Reusability:** DevOps teams can reuse existing IaC configuration files in various environments.

- **Collaboration:** You can version control your configuration files allowing you to collaborate with team members to maintain your infrastructure.

- **Reduced risk:** Adapting IaC provides low-cost disaster recovery. You can recover large systems (even at a different locations) using IaC.

## The Benefits of a Multicloud Terraform Environment

- **Cost-efficient infrastructure:** Build your infrastructure using a mix of the most cost-efficient services provided by different cloud providers.

- **Consistency and fault tolerance:** You can deploy similar infrastructures on different cloud providers or local data centers. Developers can use the same tools and configuration files to manage each cloud provider's resources, simultaneously. A single Terraform command can oversee deployments to multiple providers and even handle cross-cloud dependencies.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. You need a personal access token for [Linode’s API v4](/docs/api/) to use with Terraform and the Terraform Linode Provider. Follow the [Getting Started with the Linode API](/docs/products/tools/api/get-started/#get-an-access-token) to get a token.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Downloading Terraform on your Linode Server

In this section, you install Terraform on an Ubuntu 20.04 Linode. These steps are generally applicable to most Debian-based distributions. You can use the Linode server as the hub for your Terraform-managed infrastructure, however, you can also install Terraform on your computer.

To download Terraform on a Linode server, follow the steps below:

1. [Login to the Linode server via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance). This is the Linode server where you want to install Terraform. Replace `192.0.2.0` with your [Linode's IP address](/docs/guides/find-your-linodes-ip-address/).

       ssh username@192.0.2.0

1. Get the latest list of packages and update all installed packages.

        sudo apt-get update
        sudo apt-get upgrade

1. Create a new directory for Terraform, and change to this directory.

        mkdir terraform
        cd terraform

1. Download Terraform using the `wget` command or from [Terraform's download page](https://www.terraform.io/downloads.html). This guide is written for the latest Terraform version 0.15.0 (at the time of writing this guide).

        wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_linux_amd64.zip

    {{< note respectIndent=false >}}
  Previous versions of Terraform can be found on the [Terraform releases page](https://releases.hashicorp.com/terraform/).
  {{< /note >}}

1. Download the `SHA256SUMS` file, and checksum `sig` file for the most recent version of Terraform (0.15.0 in this case).

    - The SHA256 checksum file:

            wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_SHA256SUMS

    - The checksum signature file:

            wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_SHA256SUMS.sig

### Verify the Terraform Download

1. Locate HashiCorp's public GPG key on their [Security page](https://www.hashicorp.com/security) under the “Secure Communications” section. The key ID is `51852D87348FFC4C`.

        gpg --recv-keys 51852D87348FFC4C

    The following output confirms that the `gpg` key has been successfully imported.

    {{< output >}}
gpg: directory '/root/.gnupg' created
gpg: keybox '/root/.gnupg/pubring.kbx' created
gpg: /root/.gnupg/trustdb.gpg: trustdb created
gpg: key 51852D87348FFC4C: public key "HashiCorp Security <security@hashicorp.com>" imported
gpg: Total number processed: 1
gpg: imported: 1
{{< /output >}}

1. Use `gpg` to validate the signature file. Use the exact names of the `sig` and `SHA256` files.

          gpg --verify terraform_0.15.0_SHA256SUMS.sig terraform_0.15.0_SHA256SUMS

    The following output confirms that the `sig` file is a good signature from HashiCorp Security.

    {{< output >}}
gpg: Signature made Wed Apr 14 15:41:39 2021 UTC
gpg: using RSA key 91A6E7F85D05C65630BEF18951852D87348FFC4C
gpg: Good signature from "HashiCorp Security <security@hashicorp.com>" [unknown]
{{< /output >}}

1. Ensure the RSA key displayed in the output of the last step matches the fingerprint shown on the [Terraform Security page](https://www.hashicorp.com/security). The fingerprint is located in the same place as the GPG key in the "Secure Communications" section.

1. Verify the checksum of the `zip` archive. For the following command, use the exact name of the `SHA256SUMS` file.

        sha256sum -c terraform_0.15.0_SHA256SUMS 2>&1 | grep OK

    The `sha256sum` program displays the name of the `zip` file along with the status. If the status is **NOT** `OK`, then the `zip` file is corrupt and must be downloaded again.

    {{< output >}}

terraform_0.15.0_linux_amd64.zip: OK

  {{< /output >}}

### Installing and Configuring Terraform on the Linode Server

1. Unzip the `terraform_*_linux_amd64.zip` to your `terraform` directory.

        unzip terraform_0.15.0_linux_amd64.zip

    {{< note respectIndent=false >}}
  If you receive an error that indicates `unzip` is missing from your system, install the `unzip` package using the following command `sudo apt install unzip` and try again.
    {{< /note >}}

1. Edit your `~./profile` to include the `~/terraform` directory in your PATH. Then, reload the profile.

        echo 'export PATH="$PATH:$HOME/terraform" ' >> ~/.profile
        source ~/.profile

1. Verify Terraform installation by running the `terraform` command without any arguments. The Terraform usage information is displayed followed by the list of common commands.

        terraform

    {{< output >}}
Usage: terraform [global options] <subcommand> [args]
The available commands for execution are listed below.
The primary workflow commands are given first, followed by
less common or more advanced commands.

Main commands:
init Prepare your working directory for other commands
validate Check whether the configuration is valid
plan Show changes required by the current configuration
apply Create or update infrastructure
destroy Destroy previously-created infrastructure

All other commands:
...

  {{< /output >}}

## Define your Multicloud Infrastructure Using Terraform

Terraform depends on plugins called *Providers*. Each provider adds a set of [*resource types*](https://www.terraform.io/docs/language/resources/index.html) or [*data sources*](https://www.terraform.io/docs/language/data-sources/index.html) that are managed by Terraform.

Terraform configurations must declare which providers they require so that Terraform can use them. Terraform can understand two types of configuration files: JSON, and [HashiCorp Configuration Language](https://github.com/hashicorp/hcl) (HCL).

This guide uses the HCL format. HCL files end with the `.tf` extension.

### Defining the Linode Infrastructure

The following steps explain how you can construct a multicloud configuration consisting of one Linode, and one service form the Amazon Web Services (AWS) cloud. This section makes use of the [Terraform Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs) and the [Amazon Web Services (AWS) Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs).

1. Create a file `linode-terraform.tf` in your `terraform` directory.

        cd terraform
        vi linode-terraform.tf

1. At the top of the file, add a `terraform` block to define the [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs), followed by the declaration of the Linode provider itself. Within the provider block, add the `token` declaration. See Linode’s guide on [Getting Started with the Linode API](/docs/products/tools/api/get-started/#get-an-access-token) to learn how to create an API token, if you have not done so already.

    {{< file "~/terraform/linode-terraform.tf" >}}

terraform {
  required_providers {
      linode = {
        source = "linode/linode"
        version = "1.16.0"
      }
  }
}

# Linode Provider definition

provider  "linode" {
  token = var.token
}
  {{< /file >}}

1. Define the Linode [*Resources*](https://www.terraform.io/docs/language/resources/syntax.html). In this case, you define a new Linode instance as the resource to deploy. Then, you assign values for all the required resource configurations.

    {{< file "~/terraform/linode-terraform.tf" >}}

resource  "linode_instance"  "terraform" {
  image = "linode/ubuntu20.04"
  label = "Terraform-Example"
  group = "Terraform"
  region = "us-east"
  type = "g6-standard-1"
  authorized_keys = [ var.authorized_keys ]
  root_pass = var.root_pass
}
{{< /file >}}

1. The full `linode-terraform.tf` file, including both the `provider` and `resource` sections, is shown below.

    These configurations create a Linode 2GB labeled `terraform-example` and place it in the `terraform` Linodes group. You can replace the values with your own desired values. Lists of the allowable values for each of the fields, such as the `region`, are found in the [*Linode API*](/docs/api/linode-instances/).

    {{< file "~/terraform/linode-terraform.tf" >}}

terraform {
  required_providers {
  linode = {
    source = "linode/linode"
    version = "1.16.0"
    }
  }
}

# Linode Provider definition

provider  "linode" {
  token = var.token
}

resource  "linode_instance"  "terraform" {
  image = "linode/ubuntu20.04"
  label = "terraform-example"
  group = "terraform"
  region = "us-east"
  type = "g6-standard-1"
  authorized_keys = [ var.authorized_keys ]
  root_pass = var.root_pass
}

{{< /file >}}

1. Within the same `terraform` directory, create a second file named `variables.tf`, and declare all the variables from `linode-terraform.tf`, as shown below.

        vi variables.tf

    {{< file "~/terraform/variables.tf">}}
variable "token" {}
variable "authorized_keys" {}
variable "root_pass" {}
{{< /file >}}

1. Create a third file in the `terraform` directory named `terraform.tfvars`. This file is to define the actual values for each variable. For the variables - `token`,  `authorized_keys`, and  `root_pass`, substitute your Linode API token, your SSH key, and a secure password for the device, respectively.

        vi terraform.tfvars

    {{< file "~/terraform/terraform.tfvars">}}

token = "YOUR_LINODE_API_TOKEN"
authorized_keys = "YOUR_PUBLIC_SSH_KEY"
root_pass ="YOUR_ROOT_PASSWORD"

{{< /file >}}

    {{< note respectIndent=false >}}
It might also make sense to declare variables for fields where each resource has the same value. If each Linode uses the same image, define an `image` variable and assign `var.image` to the image parameter of each resource. This makes it easier to update the image information for all of the devices.
{{< /note >}}

### Defining the AWS Infrastructure

**Prerequisites to provision AWS resources using Terraform**

- An AWS account
- An AWS secret key

The following example demonstrates how you can configure a database table in the [DynamoDB service](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html). For more information on how to define AWS resources in Terraform, consult the [AWS Provider in the Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs). Follow the steps below to specify the AWS resources.

1. Create a new file named `aws-terraform.tf` inside the `terraform` directory.

        vi aws-terraform.tf

1. Declare the AWS provider by specifying an AWS region for the resource, along with variable references for the `aws_access_key`, and `aws_secret_key`.

    {{< file "~/terraform/aws-terraform.tf" >}}
# Initialize the AWS Provider

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = "eu-west-2"
}
  {{< /file >}}

1. Add a declaration for the AWS resource. The entire file, including the provider information, is shown below. This `aws_dynamodb_tabe` resource configures a database table in the DynamoDB service.

    {{< file "~/terraform/aws-terraform.tf" >}}

# Initialize the AWS Provider

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

1.  Edit the `variables.tf` file, and add the new variables used in `aws-terraform.tf` to the bottom of the file, as shown below.

    {{< note respectIndent=false >}}
If a large number of variables are used throughout the configuration files, each cloud vendor should have its own variables file.
  {{< /note >}}

    {{< file "~/terraform/variables.tf" >}}
...
variable "aws_access_key" {}
variable "aws_secret_key" {}
  {{< /file >}}

1.  Edit the `terraform.tfvars`, and add the actual values of your AWS keys.

    {{< file "~/terraform/terraform.tfvars" aconf >}}
...
aws_access_key = "YOUR_AWS_ACCESS_TOKEN"
aws_secret_key = "YOUR_AWS_SSH_KEY"
  {{< /file >}}

## Initialize, Review Plan, and Execute Terraform

To deploy Terraform, the following three steps are required.

1. Initializing Terraform directory
2. Reviewing an execution plan
3. Applying (executing) the Terraform plan

This guide describes all three steps in detail.

1. Initialize Terraform, so that Terraform can read the variables and load all the necessary providers.

        terraform init

    The following output confirms Terraform's successful initialization:

    {{< output >}}

* Finding linode/linode versions matching "1.16.0"...
* Finding latest version of hashicorp/aws...
* Installing linode/linode v1.16.0...
* Installed linode/linode v1.16.0 (signed by a HashiCorp partner, key ID F4E6BBD0EA4FE463)
* Installing hashicorp/aws v3.34.0...
* Installed hashicorp/aws v3.34.0 (signed by HashiCorp)
...
Terraform has been successfully initialized!

You may now begin working with Terraform. Try running "terraform plan" to see
any changes that are required for your infrastructure. All Terraform commands
should now work.
...
  {{< /output >}}

    {{< note respectIndent=false >}}
If Terraform displays an error, run the `init` command again with debug mode turned on using `TF_LOG=debug terraform init`.
  {{< /note >}}

1. Run the `terraform plan` command. This lists the resources that Terraform expects to create, change, or delete.

        terraform plan

    {{< output >}}
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:

* create

Terraform will perform the following actions:

# aws_dynamodb_table.inventory-dynamodb-table will be created

* resource "aws_dynamodb_table" "inventory-dynamodb-table" {
  * arn              = (known after apply)
  * billing_mode     = "PROVISIONED"
  * hash_key         = "ArtistName"
  * id               = (known after apply)
  * name             = "RecordInventory"
  * range_key        = "AlbumTitle"
  * read_capacity    = 20
  * stream_arn       = (known after apply)
  * stream_label     = (known after apply)
  * stream_view_type = (known after apply)
  * write_capacity   = 20

  * attribute {
    * name = "AlbumTitle"
    * type = "S"
        }
  * attribute {
    * name = "ArtistName"
    * type = "S"
        }

  * point_in_time_recovery {
    * enabled = (known after apply)
        }

  * server_side_encryption {
    * enabled     = (known after apply)
    * kms_key_arn = (known after apply)
        }
    }

# linode_instance.terraform-example will be created

* resource "linode_instance" "terraform-example" {
  * backups            = (known after apply)
  * backups_enabled    = (known after apply)
  * boot_config_label  = (known after apply)
  * group              = "Terraform"
  * id                 = (known after apply)
  * image              = "linode/ubuntu20.04"
  * ip_address         = (known after apply)
  * ipv4               = (known after apply)
  * ipv6               = (known after apply)
  * label              = "Terraform-Web-Example"
  * private_ip_address = (known after apply)
  * region             = "eu-west"
  * root_pass          = (sensitive value)
  * specs              = (known after apply)
  * status             = (known after apply)
  * swap_size          = (known after apply)
  * type               = "g6-standard-1"
  * watchdog_enabled   = true

  * alerts {
    * cpu            = (known after apply)
    * io             = (known after apply)
    * network_in     = (known after apply)
    * network_out    = (known after apply)
    * transfer_quota = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
  {{< /output >}}

        `terraform plan` won’t take any action or make any changes on your Linode account.

    {{< note respectIndent=false >}}
If the command generates an error or some other unexpected result, re-run the `terraform plan` in debug mode.

    TF_LOG=debug terraform plan
  {{< /note >}}

1. If there are no errors, start deploying new resources using the `apply` command.

        terraform apply

    Terraform displays the plan of action again and asks you for a confirmation. Enter `yes` to continue with the deployment.

    Terraform then provisions the resources in accordance with its plan. When Terraform has configured your multicloud infrastructure, it summarizes the results.

    {{< output >}}
Plan: 2 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

linode_instance.terraform-web: Creating...
  alerts.#:           "" => "<computed>"
  authorized_keys.#:  "" => "1"
  authorized_keys.0:  "" => "ssh-rsa ..."
  backups.#:          "" => "<computed>"
  backups_enabled:    "" => "<computed>"
  boot_config_label:  "" => "<computed>"
  group:              "" => "Terraform"
  image:              "" => "linode/ubuntu18.04"
  ip_address:         "" => "<computed>"
  ipv4.#:             "" => "<computed>"
  ipv6:               "" => "<computed>"
  label:              "" => "web"
  private_ip_address: "" => "<computed>"
  region:             "" => "us-east"
  root_pass:          "<sensitive>" => "<sensitive>"
  specs.#:            "" => "<computed>"
  status:             "" => "<computed>"
  swap_size:          "" => "<computed>"
  type:               "" => "g6-standard-1"
  watchdog_enabled:   "" => "true"
linode_instance.terraform-web: Still creating... (10s elapsed)
linode_instance.terraform-web: Still creating... (20s elapsed)
linode_instance.terraform-web: Still creating... (30s elapsed)
linode_instance.terraform-web: Still creating... (40s elapsed)
linode_instance.terraform-web: Still creating... (50s elapsed)
linode_instance.terraform-web: Creation complete after 52s (ID: 10975739)

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
    {{< /output >}}

1. Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes). You should see that the `terraform-example` Linode has been added to your account. Review the AWS Dashboard to verify the contents of the new database.

    {{< note respectIndent=false >}}
Terraform stores details about the state of your resources in the `terraform.tfstate` file within the same directory.
  {{< /note >}}

## Update the Terraform Configuration

Terraform can modify a resource without affecting the other elements of your infrastructure. Terraform gracefully handles configuration changes by comparing the current state of your infrastructure against the updated configuration files.

The following example illustrates how to simultaneously add a new Linode and change the AWS database table.

1. Edit the `linode-terraform.tf` file, and add the following snippet to the end of the file. This defines a 1GB Linode running Ubuntu 20.04 as a new resource.

    {{< file "~/terraform/linode-terraform.tf" aconf >}}
...
resource "linode_instance" "terraform2-example" {
  image = "linode/ubuntu20.04"
  label = "terraform-web-example-2"
  group = "terraform"
  region = "eu-west"
  type = "g6-nanode-1"
  authorized_keys = [var.authorized_keys]
  root_pass = var.root_pass
}
    {{< /file >}}

1. Edit the `aws-terraform.tf`, and alter one of the fields. In this case, change `AlbumTitle` to `RecordTitle`. Change the name of the `range_key` field to correspond to the new name.

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

3. Execute the `terraform plan` command again.

        terraform plan

    Terraform displays the new plan, which calls for two additions and one deletion of the your resources.

    {{< output >}}
linode_instance.terraform-example: Refreshing state... [id=25603885]
aws_dynamodb_table.inventory-dynamodb-table: Refreshing state... [id=RecordInventory]

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:

* create
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

* resource "linode_instance" "terraform2-example" {
  * backups            = (known after apply)
  * backups_enabled    = (known after apply)
  * boot_config_label  = (known after apply)
  * group              = "Terraform"
  * id                 = (known after apply)
  * image              = "linode/ubuntu18.04"
  * ip_address         = (known after apply)
  * ipv4               = (known after apply)
  * ipv6               = (known after apply)
  * label              = "Terraform-Web-Example-2"
  * private_ip_address = (known after apply)
  * region             = "eu-west"
  * root_pass          = (sensitive value)
  * specs              = (known after apply)
  * status             = (known after apply)
  * swap_size          = (known after apply)
  * type               = "g6-nanode-1"
  * watchdog_enabled   = true

  * alerts {
    * cpu            = (known after apply)
    * io             = (known after apply)
    * network_in     = (known after apply)
    * network_out    = (known after apply)
    * transfer_quota = (known after apply)
        }
    }

Plan: 2 to add, 0 to change, 1 to destroy.
    {{< /output >}}

1.  When the plan is finalized, run the `apply` command to deploy the changes. Enter `yes` when prompted to proceed with the changes.

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

1.  Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes), and the AWS dashboard to verify the updates were implemented correctly.

## Destroy the Terraform Configuration

Terraform includes a `destroy` command to completely delete your infrastructure's resources when they are no longer required.

1. Run the `plan` command with the `-destroy` flag to verify the list of resources that are scheduled for deletion.

        terraform plan -destroy
    {{< output >}}
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:

* destroy

Terraform will perform the following actions:

# aws_dynamodb_table.inventory-dynamodb-table will be destroyed

...

# linode_instance.terraform-example will be destroyed

...

# linode_instance.terraform2-example will be destroyed

...
Plan: 0 to add, 0 to change, 3 to destroy.
    {{< /output >}}

1.  Run the `terraform destroy` command to destroy (delete) your resources. Enter `yes` when Terraform asks you to confirm the changes.

        terraform destroy

    {{< note type="alert" respectIndent=false >}}
This command permanently deletes your resources. This operation cannot be undone or reversed.
    {{< /note >}}

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

1. Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes), and verify the devices and services have been removed.

## Learn More About Terraform

Terraform is revolutionizing the DevOps ecosystem by transforming the way infrastructure is managed. It offers many advanced techniques to help streamline common IaC tasks. For instance, Terraform modules can package frequently-used configuration tasks together.

See Linode's [Guide to Creating a Terraform Module](/docs/guides/create-terraform-module/) for instructions on how to create a module.

**Useful References:**

- Read the [Terraform documentation](https://www.terraform.io/docs/index.html) on how to use HCL and Terraform.

- [Build, update, or destroy AWS infrastructure with Terraform](https://learn.hashicorp.com/collections/terraform/aws-get-started).

- Check out the [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs) which offers more details about the Linode resources you can deploy using Terraform.