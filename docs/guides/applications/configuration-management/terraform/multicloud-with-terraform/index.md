---
slug: deploy-multiple-environments-using-multicloud-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: 'The Terraform provides a consistent workflow that can easily manage multi-tier and multi-cloud networks using only a couple of configuration files. This guide explains how to deploy multiple environments using HCL and Multicloud Terraform that spans across Linode and another cloud vendor.'
og_description: 'The Terraform provides a consistent workflow that can easily manage multi-tier and multi-cloud networks using only a couple of configuration files. This guide explains how to deploy multiple environments using HCL and Multicloud Terraform that spans across Linode and another cloud vendor.'
keywords: ['Terraform','Linode','IaC','multicloud', 'automation', 'cloud manager']
tags: ['terraform','ubuntu', 'ssh', 'security']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-03-25
modified_by:
  name: Linode
title: "Deploy Multiple Environments Using Multicloud Terraform"
h1_title: "How to Deploy Multiple Environments using Multicloud Terraform."
contributor:
  name: Jeff Novotny
  link: Github/Twitter Link
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Terraform Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs)'
- '[Security page](https://www.hashicorp.com/security)'
- '[Terraforms download page](https://www.terraform.io/downloads.html)'
- '[resource types](https://www.terraform.io/docs/language/resources/index.html)'
- '[data sources](https://www.terraform.io/docs/language/data-sources/index.html)'
- '[HashiCorp Configuration Language](https://github.com/hashicorp/hcl)'
- '[Resources](https://www.terraform.io/docs/language/resources/syntax.html)'
- '[Java](https://www.oracle.com/java/technologies/javase-downloads.html)'
- '[DynamoDB service](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html)'
- '[AWS Provider in the Terraform Registry](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)'
- '[Build, update, or destroy AWS infrastructure with Terraform](https://learn.hashicorp.com/collections/terraform/aws-get-started)'

---

[*Terraform*](https://www.terraform.io/) is an open-source tool that is built by [*Hashicorp*](https://www.hashicorp.com) (which relies on the *HashiCorp Configuration Language* (HCL)) to automate the infrastructure deployment and provisioning of its resources.

With Terraform you can build, manage, update, and delete infrastructures with a couple of configuration files. You can achieve this using the *Infrastructure as Code* (IaC) technique.

## What is Infrastructure as Code (IaC)?

IaC means writing the code to provision, manage, and deploy IT infrastructure by automating manual tasks. In simple terms it means, you can code what you want to build with the necessary credentials and start the provisioning process.

**Advantages of IaC:**

1. **Reliability:** The resources are configured exactly as it is declared.
2. **Agility:** IaC ensures fewer dependencies on manual work by eliminating configuration errors and avoids network inconsistency.
3. **Increased speed & efficiency:** IaC can spin up an entire network infrastructure architecture, and launch cloud services and storage systems in minutes.
4. **Reusability:** DevOps teams can reuse existing IaC scripts in various environments.
5. **Collaboration:** Thanks to the version control which allows many people to collaborate in the same environment.
6. **Reduced risk:** Adapting IaC is low-cost disaster recovery. You can recover large systems (even at a different location) using IaC.

## Benefits of using Terraform cloud platform

1. **Multi-cloud infrastructure deployment:** With Multicloud Terraform you can deploy similar infrastructures on cloud providers or local data centers. Developers can use the same tools and configuration files to manage the resources of the cloud providers simultaneously. To increase fault tolerance and handle migrations, Terraform can manage multiple clouds. A single Terraform command can oversee deployments to multiple providers and even handle cross-cloud dependencies.

2. **Immutable infrastructure:** Majority of the infrastructure-as-a-code services are *mutable infrastructures* where a change in infrastructure does not result in a change in the current configuration. Terraform addresses this issue by using an Immutable Infrastructure approach, wherein for every new update, a new snapshot is created. This makes updating the deployment environment experience smooth.

3. **Reduced time to provision:** Traditional deployment methods used by organizations can take days or weeks in addition to being error-prone. By using Terraform, full deployment can happen in minutes, and you can also provision multiple cloud services at a time.

4. **Infrastructure as code:** With Multicloud Terraform, you can use scripts to manage resources. It allows you to store the infrastructure status so that you can track the changes in different components of the system (infrastructure as code) and share these configurations with others.

This guide explains how to deploy multiple environments using HCL and Multicloud Terraform that spans Linode and another cloud vendor.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide and complete the steps for setting your Linode's hostname and timezone.

2. This guide uses `sudo` wherever possible. Complete all the sections in [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.
3. Do **not** follow the "Configure a Firewall" section as this guide includes firewall rules specifically for an OpenVPN server.

4. Update your system using the following commands:

       sudo apt-get update
       sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Download Terraform on the Linode Server

Terraform is a declarative language which means you don't have to define every step on how the automation and management are done.
The architecture of Terraform is simple. You just need to download the Terraform library and install it on your central Linode server.
This guide shows you how to install Terraform on Ubuntu 20.10, but is generally applicable to most Linux distributions.

To download Terraform on a Linode server, follow the below steps:

1. Login to the Linode server via SSH. This is the Linode server where you want to install Terraform.
       ssh root@linode_ip_address

2. Get the latest list of packages and update all installed packages to their latest ones.

        sudo apt-get update

        sudo apt-get upgrade

3. Create a new directory for Terraform, and change to this directory.

        mkdir terraform

        cd terraform

4. Download Terraform using the following `wget` command or from the [*Terraform's download page*](https://www.terraform.io/downloads.html).
   This guide is written for the latest Terraform version 0.15.0 (at the time of writing this guide).

        wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_linux_amd64.zip

  {{< note >}}
  Previous versions of Terraform can be found on the [*Terraform releases page*](https://releases.hashicorp.com/terraform/).
  {{< /note >}}
5. Download the `SHA256` file, and checksum `sig` file for the most recent version of Terraform (0.15.0 in this case).

* The SHA256 checksums file

        wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_SHA256SUMS

* The checksum signature file

        wget https://releases.hashicorp.com/terraform/0.15.0/terraform_0.15.0_SHA256SUMS.sig

### Verify the downloaded Terraform

1. Secure the communications by fetching the *HashiCorp's GPG key* by importing the key ID - `51852D87348FFC4C`.
Terraform’s public GPG key can be found on their [Security page](https://www.hashicorp.com/security) under the “Secure Communications” section.

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
2. Use `gpg` to validate the signature file. Use the exact names of the `sig` and `SHA256` files.

          gpg --verify terraform_0.15.0_SHA256SUMS.sig terraform_0.15.0_SHA256SUMS

  The following output confirms that the `sig` file is a good signature from HashiCorp Security.

  {{< output >}}

gpg: Signature made Wed Apr 14 15:41:39 2021 UTC
gpg: using RSA key 91A6E7F85D05C65630BEF18951852D87348FFC4C
gpg: Good signature from "HashiCorp Security <security@hashicorp.com>" [unknown]

  {{< /output >}}
3. Ensure the RSA key displayed in the output of the last step matches the fingerprint shown on the [*Terraform Security page*](https://www.hashicorp.com/security). The fingerprint is located in the same place as the GPG key in the "Secure Communications" section.
4. Verify the checksum of the `zip` archive. For the following command, use the exact name of the `SHA256` file.

        sha256sum -c terraform_0.15.0_SHA256SUMS 2>&1 | grep OK

The `sha256sum` program displays the name of the `zip` file along with the status. If the status is **Not** `OK`, then the `zip` file is corrupt and must be downloaded again.

  {{< output >}}

terraform_0.15.0_linux_amd64.zip: OK

  {{< /output >}}

### Configure the Terraform on the Linode Server

Configure the Terraform for all the necessary environment variables by following the below steps:

1. Unzip the `terraform_*_linux_amd64.zip` to your `terraform` directory.

        unzip terraform_0.15.0_linux_amd64.zip

    {{< note >}}
  If you receive an error that indicates `unzip` is missing from your system, install the `unzip` package using the following command `apt install unzip` and try again.
    {{< /note >}}

2. Edit your `~./profile` to include the `~/terraform` directory in your PATH. Then, reload the profile.

        echo 'export PATH="$PATH:$HOME/terraform" ' >> ~/.profile
        source ~/.profile

3. Verify Terraform installation by running the `terraform` command without any arguments. The Terraform usage information is displayed followed by the list of common commands.

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

## Build Terraform with Linode Provider

Terraform depends on plugins called *Providers*. Each provider adds a set of [*resource types*](https://www.terraform.io/docs/language/resources/index.html) or [*data sources*](https://www.terraform.io/docs/language/data-sources/index.html) that is managed by the Terraform.

Terraform configurations must declare which providers they require so that Terraform can use them. Terraform can understand two types of configuration files: JSON, and [HashiCorp Configuration Language](https://github.com/hashicorp/hcl) (HCL).

This guide uses the HCL format, and HCL files end with the `.tf` extension.

### Defining the Linode Infrastructure

The following steps explain how you can construct a multi-cloud configuration consisting of one Linode, and one service on the Amazon Web Services (AWS) cloud.

1. Create a file `linode-terraform.tf` in your `terraform` directory.

        cd terraform

        vi linode-terraform.tf

2. At the top of the file, add a `terraform` block to define the [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs), followed by the declaration of the Linode provider itself. Within the provider block, add the `token` declaration. See Linode’s guide on [Getting Started with the Linode API](http://localhost:1313/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) to learn how to create an API token.

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
  token = "YOUR_LINODE_API_TOKEN"
  }
  {{< /file >}}
3. Define the Linode [*Resources*](https://www.terraform.io/docs/language/resources/syntax.html). Resources are the important element in the Terraform which describes objects like `group`, `region`, `authorized_keys`, etc.
Fill in your public SSH key, and desired root password where ever indicated.

{{< file "~/terraform/linode-terraform.tf" >}}

resource  "linode_instance"  "terraform" {
  image = "linode/ubuntu20.04"
  label = "Terraform-Example"
  group = "Terraform"
  region = "us-east"
  type = "g6-standard-1"
  authorized_keys = [ "YOUR_PUBLIC_SSH_KEY" ]
  root_pass = "YOUR_ROOT_PASSWORD"
}
{{< /file >}}
4. The full `linode-terraform.tf` file, including both the `provider` and `resource` sections, is shown below.

This snippet creates a Linode 2GB labeled `Terraform-Example` in a `Terraform` Linodes group.

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
  token = "YOUR_LINODE_API_TOKEN"
}

resource  "linode_instance"  "terraform" {
  image = "linode/ubuntu20.04"
  label = "Terraform-Example"
  group = "Terraform"
  region = "us-east"
  type = "g6-standard-1"
  authorized_keys = [ "YOUR_PUBLIC_SSH_KEY" ]
  root_pass = "YOUR_ROOT_PASSWORD"
}

{{< /file >}}
5. Within the same `terraform` directory, create a second file named `variables.tf`, and declare all the variables from `linode-terraform.tf`, as shown below.

        vi variables.tf

  {{< file "~/terraform/variables.tf">}}

variable "token" {}
variable "authorized_keys" {}
variable "root_pass" {}
  {{< /file >}}
6. Create a third file in the `terraform` directory named `terraform.tfvars`. This file is to define the actual values for each variable. For the variables - `token`,  `authorized_keys`, and  `root_pass`, substitute your Linode API token, your SSH key, and a secure password for the device respectively.

        vi terraform.tfvars

{{< file "~/terraform/terraform.tfvars">}}

token = "YOUR_LINODE_API_TOKEN"
authorized_keys = "YOUR_PUBLIC_SSH_KEY"
root_pass ="YOUR_ROOT_PASSWORD"

{{< /file >}}

{{< note >}}

It might also make sense to declare variables for fields where each resource has the same value. If each Linode uses the same image, define an `image` variable and assign `var.image` to the image parameter of each resource. This makes it easier to update the image information for all of the devices.

{{< /note >}}

### Defining the AWS Infrastructure

**Prerequisites to provision an AWS device using Terraform**

* Ensure you have [Java](https://www.oracle.com/java/technologies/javase-downloads.html) installed and running on your machine.
* An AWS account
* An AWS secret key

The following example demonstrates how you can configure a database table in the [*DynamoDB service*](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SettingUp.DynamoWebService.html). For more information on how to define AWS resources in Terraform, consult the [*AWS Provider in the Terraform Registry*](https://registry.terraform.io/providers/hashicorp/aws/latest/docs). Follow the below steps to specify the AWS network.

1. Create a new file named `aws-terraform.tf` inside the `terraform` directory.

        vi aws-terraform.tf
2. Declare the AWS provider by specifying an AWS region for the resource, along with variable references for the `aws_access_key`, and `aws_secret_key`.

  {{< file "~/terraform/aws-terraform.tf" >}}

# Initialize the AWS Provider

provider "aws" {
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
  region = "eu-west-2"
}
  {{< /file >}}
3. Add a declaration for the AWS resource. The entire file, including the provider information, is shown below.
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
4.  Edit the `variables.tf` file, and add the new variables used in `aws-terraform.tf` to the bottom of the file, as shown below.

  {{< note >}}
  If a large number of variables are used throughout the configuration files, each cloud vendor should have its own variables file.
  {{< /note >}}

  {{< file "~/terraform/variables.tf" >}}
  ...
  variable "aws_access_key" {}
  variable "aws_secret_key" {}
  {{< /file >}}
5.  Edit the `terraform.tfvars`, and add the actual values of your AWS keys.

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

  {{< note >}}
  If Terraform displays an error, run the `init` command again with debug mode turned on using `TF_LOG=debug terraform init`.
  {{< /note >}}
2. Run the `terraform plan` command. This lists the resources that Terraform expects to create, change, or delete.

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
    {{< note >}}
  If the command generates an error or some other unexpected result, re-run the `terraform plan` in debug mode.

      TF_LOG=debug terraform plan
  {{< /note >}}
3. If there are no errors, start deploying new resources using the `apply` command.

        terraform apply

  Terraform displays the plan of action again and asks you for a confirmation. Enter `yes` to continue with the deployment.

  Terraform then provisions the network in accordance with its plan. When Terraform has configured the network, it summarizes the results.
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
4. Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes). You should see that the `Terraform-Example` Linode has been added to your account. Review the AWS Dashboard to verify the contents of the new database.

  {{< note >}}
  Terraform stores details about the state of the network in the `terraform.tfstate` file within the same directory.
  {{< /note >}}

## Update the Terraform Configuration

Terraform can modify a service without affecting the other services.

The following example illustrates how to simultaneously add a new Linode and change the AWS database table.

1. Edit the `linode-terraform.tf` file, and add the following snippet to the end of the file. This defines a 1GB Linode running Ubuntu 20.04 as a new resource.

    {{< file "~/terraform/linode-terraform.tf" aconf >}}
...
resource "linode_instance" "terraform2-example" {
        image = "linode/ubuntu20.04"
        label = "Terraform-Web-Example-2"
        group = "Terraform"
        region = "eu-west"
        type = "g6-nanode-1"
        authorized_keys = [var.authorized_keys]
        root_pass = var.root_pass
}
    {{< /file >}}
2. Edit the `aws-terraform.tf`, and alter one of the fields. In this case, change `AlbumTitle` to `RecordTitle`. Change the name of the `range_key` field to correspond to the new name.
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
    Terraform displays the new plan, which calls for two additions and one deletion of the network resource.
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
5.  Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes), and the AWS dashboard to verify the updates were implemented correctly.

## Destroy the Terraform Configuration

Terraform includes a `destroy` command to completely delete a network when it is no longer required.

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
2.  Run the `terraform destroy` command to destroy (delete) the network. Enter `yes` when Terraform asks you to confirm the changes.

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
3. Visit the [Linode Cloud Manager](https://cloud.linode.com/linodes), and verify the devices and services have been removed.

## Learn More About Terraform

Terraform is revolutionizing the DevOps ecosystem by transforming the way infrastructure is managed.
It offers many advanced techniques to help streamline common IaC tasks. For instance, Terraform modules can package frequently-used configuration tasks together.

See Linode's [Guide to Creating a Terraform Module](/docs/applications/configuration-management/terraform/create-terraform-module) for instructions on how to create a module.

**Useful References:**

* Read the [Terraform documentation](https://www.terraform.io/docs/index.html) on how to use HCL and Terraform.
* [Build, update, or destroy AWS infrastructure with Terraform](https://learn.hashicorp.com/collections/terraform/aws-get-started).
* Check out more details about the individual providers and their APIs that contains resources dedicated to the [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs).
