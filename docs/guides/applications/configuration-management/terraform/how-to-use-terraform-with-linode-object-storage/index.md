---
slug: how-to-use-terraform-with-linode-object-storage
description: 'This guide provides a brief introduction to Terraform, and explains how to use it to configure Linode Object Storage.'
keywords: ['Linode Terraform','Terraform Linode Object Storage','Install Terraform']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-25
modified: 2022-11-28
modified_by:
  name: Linode
title: "Use Terraform With Linode Object Storage"
title_meta: "How to Use Terraform With Linode Object Storage"
external_resources:
- '[Terraform](https://www.terraform.io/)'
- '[Terraform Downloads Portal](https://www.terraform.io/downloads)'
- '[Terraform Provider Tutorials](https://developer.hashicorp.com/terraform/tutorials)'
- '[Introduction to Terraform](https://developer.hashicorp.com/terraform/intro)'
- '[HashiCorp Security page](https://www.hashicorp.com/security)'
- '[Terraform documentation](https://developer.hashicorp.com/terraform/docs)'
- '[Terraform Configuration Syntax](https://developer.hashicorp.com/terraform/language/syntax/configuration)'
- '[Linode Namespace in Terraform Registry](https://registry.terraform.io/namespaces/linode)'
- '[Linode Overview and Documentation in Terraform Registry](https://registry.terraform.io/providers/linode/linode/latest/docs)'
- '[Linode Object Storage Cluster data source](https://registry.terraform.io/providers/linode/linode/latest/docs/data-sources/object_storage_cluster)'
- '[Linode Object Storage Bucket documentation](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_bucket)'
- '[Linode Object Storage Objects documentation](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_object)'
authors: ["Jeff Novotny"]
tags: ["saas"]
---

[Terraform](https://www.terraform.io/) is a powerful *Infrastructure as Code* (IaC) application for deploying and managing infrastructure. It can be used to add, modify, and delete resources including servers, networking elements, and storage objects. Linode has partnered with Terraform to provide an API to configure common Linode infrastructure items. This guide provides a brief introduction to Terraform and explains how to use it to create [Linode Object Storage](/docs/products/storage/object-storage/) solutions.

## What is Terraform?

Terraform is an open source product that is available in free and commercial editions. Terraform configuration files are declarative in form. The files describe the end state of the system and explain what to configure, but not how to configure it. Terraform files use either Terraform's *HashiCorp Configuration Language* (HCL) or the *JavaScript Object Notation* (JSON) format to define the infrastructure. Both languages work well with Terraform because they are easy to use and read. Terraform uses a modular and incremental approach to encourage reuse and maintainability. It is available for macOS, Windows, and most Linux distributions.

Terraform uses providers to manage resources. A provider, which is very similar to an API, is typically created in conjunction with the infrastructure vendor. Terraform's provider-based system allows users to create, modify, and destroy network infrastructure from different vendors. Developers can import these providers into their configuration files to help declare and configure their infrastructure components. Providers are available for most major vendors, including [Linode](https://registry.terraform.io/providers/linode/linode/latest). Terraform users can browse through a complete listing of the various providers in the [*Terraform Registry*](https://registry.terraform.io/browse/providers).

Linode offers a useful [Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/) as an introduction to the main Terraform concepts. Additionally, Terraform documentation includes a number of [Tutorials](https://developer.hashicorp.com/terraform/tutorials), including guides to the more popular providers.

## How to Use Terraform

To use Terraform, create a file that defines the intended configuration of all network elements. This file includes a list of all required providers and data sources. A data source object provides access to a variety of methods and attributes about a particular infrastructure component. The file also fully describes the various resources, including servers and storage objects, that Terraform should create, manage, or delete.

Terraform files are written using either HCL or JSON as a text file with the `.tf` extension. It is possible to use input variables, functions, and modules for greater flexibility, modularity, and maintainability. Users develop their configuration files on their own workstations, and use the Terraform client to push the configuration out to their network. The client relies upon implementation details from the providers to execute the changes.

Before applying the configuration, users should execute the `terraform plan` command. This command generates a summary of all the intended changes. At this point, the changes have not yet been applied. This means the document can be safely revised or even abandoned if necessary.

When the Terraform plan is ready to implement, the `terraform apply` command is used to deploy the changes. Terraform keeps track of all changes in an internal state file. This results in increased efficiency because only changes to the existing configuration are executed. New changes and modifications can be added to existing Terraform files without deleting the pre-existing resources. Terraform also understands the various dependencies between resources, and creates the infrastructure using the proper sequence.

Terraform can be used in a multi-developer environment in conjunction with a versioning control system. Developers can also build their own provider infrastructure for use instead of, or alongside, third-party providers. Terraform provides more details about how the product works and how to use it in their [Introduction to Terraform summary](https://developer.hashicorp.com/terraform/intro).

{{< note >}}
Terraform is very powerful, but it can be a difficult tool to use. Syntax errors can be hard to debug. Before attempting to create any infrastructure, it is a good idea to read the [Linode Introduction to the HashiCorp Configuration Language](/docs/guides/introduction-to-hcl/). The documentation about the [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest/docs) in the Terraform Registry is also essential. Consult Linode's extensive collection of [Terraform guides](/docs/guides/applications/configuration-management/terraform/) for more examples and explanations.
{{< /note >}}

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

1. Ensure all Linode servers are updated. The following commands can be used to update Ubuntu systems.

    ```command
    sudo apt update && sudo apt upgrade
    ```

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you are not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Download and Install Terraform

These instructions are geared towards Ubuntu 22.04 users, but are generally applicable to earlier Ubuntu releases. Instructions for other Linux distributions and macOS are available on the [Terraform Downloads Portal](https://www.terraform.io/downloads). The following example demonstrates how to download and install the latest release of Terraform.

1. Install the system dependencies for Terraform.

    ```command
    sudo apt install software-properties-common gnupg2 curl
    ```

1. Import the GPG key.

    ```command
    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
    ```

1. Add the Hashicorp repository to `apt`.

    ```command
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
    ```

1. Download the updates for Terraform and install the application. This installs Terraform release 1.3.4, the most recent release.

    ```command
    sudo apt update && sudo apt install terraform
    ```

    ```output
    Get:1 https://apt.releases.hashicorp.com jammy/main amd64 terraform amd64 1.3.4 [19.5 MB]
    Fetched 19.5 MB in 0s (210 MB/s)
    Selecting previously unselected package terraform.
    (Reading database ... 109186 files and directories currently installed.)
    Preparing to unpack .../terraform_1.3.4_amd64.deb ...
    Unpacking terraform (1.3.4) ...
    Setting up terraform (1.3.4) ...
    ```

1. Confirm the application has been installed correctly. Use the `terraform` command without any parameters and ensure the Terraform help information is displayed.

    ```command
    terraform
    ```

    ```output
    Usage: terraform [global options] <subcommand> [args]

    The available commands for execution are listed below.
    The primary workflow commands are given first, followed by
    less common or more advanced commands.

    Main commands:
    init          Prepare your working directory for other commands
    ...
    -version      An alias for the "version" subcommand.
    ```

1. To determine the current release of Terraform, use the `terraform -v` command.

    ```command
    terraform -v
    ```

    ```output
    Terraform v1.3.4
    on linux_amd64
    ```

1. Create a directory for the new Terraform project and change to this directory.

    ```command
    mkdir ~/terraform
    cd ~/terraform
    ```

## Creating a Terraform File to Create Linode Object Storage

To deploy the necessary infrastructure for a Linode Object Storage solution, create a Terraform file defining the final state of the system. This file must include the following sections:

- The `terraform` definition, which includes the required providers. In this case, only the Linode provider is included.
- The Linode provider.
- The `linode_object_storage_cluster` data source.
- At least one `linode_object_storage_bucket` resource. A storage bucket provides a space to store files and text objects.
- (**Optional**) A `linode_object_storage_key`.
- A list of `linode_object_storage_object` items. An object storage object can be a text file or a string of text. All storage objects are stored in a particular object storage bucket.

To construct the Terraform file, execute the following instructions. For more information on how to create a Terraform file, see the [Terraform documentation](https://developer.hashicorp.com/terraform/docs).

1. Create the file `linode-terraform-storage.tf` inside the `terraform` directory.

    ```command
    nano linode-terraform-storage.tf
    ```

1. At the top of the file, add a `terraform` section, including all `required_providers` for the infrastructure. In this case, the only required provider is `linode`. Set the source to `linode/linode`. Use the current `version` of the `linode` provider. At publication time, the version is `1.29.4`. To determine the current version, see the [Linode Namespace](https://registry.terraform.io/namespaces/linode) in the Terraform Registry.

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf"}

    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.29.4"
        }
      }
    }
    ```

1. Define the `linode` provider. Include the [Linode v4 API](/docs/api/) `token` for the account. See the [Getting Started with the Linode API guide](/docs/products/tools/api/get-started/#get-an-access-token) for more information about tokens.

    {{< note respectIndent=false >}}
To hide sensitive information, such as API tokens, declare a `variables.tf` file and store the information there. Retrieve the variables using the `var` keyword. See the [Linode introduction to HCL](/docs/guides/introduction-to-hcl/#input-variables) for guidance on how to use variables.
    {{< /note >}}

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" hl_lines="2" linenostart="10"}
    provider "linode" {
      token = "THE_LINODE_API_TOKEN"
    }
    ```

1. Create a `linode_object_storage_cluster` data source. In the following code sample, the new cluster object is named `primary`. Designate a region for the cluster using the `id` attribute. In the following example, the region is `eu-central-1`. The cluster object provides access to the domain, status, and region of the cluster. See the Terraform registry documentation for the [Linode Object Storage Cluster data source](https://registry.terraform.io/providers/linode/linode/latest/docs/data-sources/object_storage_cluster) for more information.

    {{< note respectIndent=false >}}
Not all regions support storage clusters. For a full list of all data centers where a storage cluster can be configured, see the Linode [Object Storage Product Information](/docs/products/storage/object-storage/).
    {{< /note >}}

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" linenostart="14"}
    data "linode_object_storage_cluster" "primary" {
        id = "eu-central-1"
    }
    ```

1. **Optional:** Create a `linode_object_storage_key` to control access to the storage objects. Provide a name for the key and a `label` to help identify it.

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" linenostart="18"}
    resource "linode_object_storage_key" "storagekey" {
        label = "image-access"
    }
    ```

1. Create a `linode_object_storage_bucket` resource. The `cluster` attribute for the bucket must contain the `id` of the cluster data source object. In this example, the cluster identifier can be retrieved using the `data.linode_object_storage_cluster.primary.id` attribute. Assign a unique `label` to the storage bucket. This label must be unique within the region, so ensure the label name is reasonably distinctive and unique. The following example sets the `label` to `mybucket-j1145`.

    Set the `access_key` and `secret_key` attributes to the `access_key` and `secret_key` fields of the storage key. In the following example, the name of the key is `linode_object_storage_key.storagekey`. If you skipped the previous step and are not using an object storage key, do not include these attributes.

    {{< note respectIndent=false >}}
The Linode Object Storage Bucket resource contains many other configurable attributes. It is possible to set life cycle rules, versioning, and access control rules, and to associate the storage bucket with TLS/SSL certificates. For more information, see the [Linode Object Storage Bucket documentation](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_bucket) in the Terraform registry.
    {{< /note >}}

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" linenostart="22"}
    resource "linode_object_storage_bucket" "mybucket-j1145" {
      cluster = data.linode_object_storage_cluster.primary.id
      label = "mybucket-j1145"
      access_key = linode_object_storage_key.storagekey.access_key
      secret_key = linode_object_storage_key.storagekey.secret_key
    }
    ```

1. Add items to the storage bucket. To add a file or a block of text to the bucket, create a `linode_object_storage_object` resource. Specify a `cluster` and `bucket` to store the object in and a `key` to uniquely identify the storage object within the cluster. To use a storage key, include the `secret_key` and `access_key` of the storage key.

    To add a text file to storage, specify the file path as the `source` attribute using the following example as a guide. This example adds the file `terraform_test.txt` to the bucket `mybucket-j1145` in cluster `primary`. For more information on adding storage objects, see the [Linode Storage Object resource documentation](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_object).

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" linenostart="29"}
    resource "linode_object_storage_object" "object1" {
        bucket  = linode_object_storage_bucket.mybucket-j1145.label
        cluster = data.linode_object_storage_cluster.primary.id
        key     = "textfile-object"

        secret_key = linode_object_storage_key.storagekey.secret_key
        access_key = linode_object_storage_key.storagekey.access_key

        source = pathexpand("~/terraform_test.txt")
    }
    ```

1. **Optional:** The storage bucket can also hold strings of text. To store a string, declare a new `linode_object_storage_object`, including the `bucket`, `cluster`, and storage key information as before. Choose a new unique key for the text object. The `content` attribute should be set to the text string. Fill in the `content_type` and `content_language` to reflect the nature of the text.

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" linenostart="40"}
    resource "linode_object_storage_object" "object2" {
        bucket  = linode_object_storage_bucket.mybucket-j1145.label
        cluster = data.linode_object_storage_cluster.primary.id
        key     = "freetext-object"

        secret_key = linode_object_storage_key.storagekey.secret_key
        access_key = linode_object_storage_key.storagekey.access_key

        content          = "This is the content of the Object..."
        content_type     = "text/plain"
        content_language = "en"
    }
    ```

1. When all sections have been added, the `.tf` file should resemble the following example.

    ```file {title="/terraform/linode-terraform-storage.tf" lang="aconf" hl_lines="11"}
    terraform {
      required_providers {
        linode = {
          source = "linode/linode"
          version = "1.29.4"
        }
      }
    }

    provider "linode" {
      token = "THE_LINODE_API_TOKEN"
    }

    data "linode_object_storage_cluster" "primary" {
        id = "eu-central-1"
    }

    resource "linode_object_storage_key" "storagekey" {
        label = "image-access"
    }

    resource "linode_object_storage_bucket" "mybucket-j1145" {
      cluster = data.linode_object_storage_cluster.primary.id
      label = "mybucket-j1145"
      access_key = linode_object_storage_key.storagekey.access_key
      secret_key = linode_object_storage_key.storagekey.secret_key
    }

    resource "linode_object_storage_object" "object1" {
        bucket  = linode_object_storage_bucket.mybucket-j1145.label
        cluster = data.linode_object_storage_cluster.primary.id
        key     = "textfile-object"

        secret_key = linode_object_storage_key.storagekey.secret_key
        access_key = linode_object_storage_key.storagekey.access_key

        source = pathexpand("~/terraform_test.txt")
    }

    resource "linode_object_storage_object" "object2" {
        bucket  = linode_object_storage_bucket.mybucket-j1145.label
        cluster = data.linode_object_storage_cluster.primary.id
        key     = "freetext-object"

        secret_key = linode_object_storage_key.storagekey.secret_key
        access_key = linode_object_storage_key.storagekey.access_key

        content          = "This is the content of the Object..."
        content_type     = "text/plain"
        content_language = "en"
    }
    ```

1. When done, press <kbd></kbd> + <kbd>X</kbd> to exit nano, <kbd>Y</kbd> to save, and <kbd>Enter</kbd> to confirm.

## Using Terraform to Configure Linode Object Storage

Terraform commands act upon the `linode-terraform-storage.tf` file to analyze the contents and deploy the correct infrastructure. To create the Linode object storage infrastructure items in the file, run the following commands.

1. Initialize Terraform using the `terraform init` command. Terraform confirms it is initialized.

    ```command
    terraform init
    ```

    ```output
    Initializing the backend...

    Initializing provider plugins...
    - Finding linode/linode versions matching "1.29.4"...
    - Installing linode/linode v1.29.4...
    - Installed linode/linode v1.29.4 (signed by a HashiCorp partner, key ID F4E6BBD0EA4FE463)
    ...
    Terraform has been successfully initialized!
    ...
    ```

1. Run the `terraform plan` command to gain an overview of the anticipated infrastructure changes. This plan catalogs the components Terraform intends to add, modify, or delete. It is important to review the output carefully to ensure the plan is accurate and there are no unexpected changes. If the results are not satisfactory, change the `.tf` file and try again.

    ```command
    terraform plan
    ```

    ```output
    data.linode_object_storage_cluster.primary: Reading...
    data.linode_object_storage_cluster.primary: Read complete after 0s [id=eu-central-1]

    Terraform used the selected providers to generate the following execution plan. Resource actions are indicated
    with the following symbols:
      + create

    Terraform will perform the following actions:

      # linode_object_storage_bucket.mybucket-j1145 will be created
      + resource "linode_object_storage_bucket" "mybucket-j1145" {
          + access_key   = (known after apply)
          + acl          = "private"
          + cluster      = "eu-central-1"
          + cors_enabled = true
          + hostname     = (known after apply)
          + id           = (known after apply)
          + label        = "mybucket-j1145"
          + secret_key   = (sensitive)
          + versioning   = (known after apply)
        }

      # linode_object_storage_key.storagekey will be created
      + resource "linode_object_storage_key" "storagekey" {
          + access_key = (known after apply)
          + id         = (known after apply)
          + label      = "image-access"
          + limited    = (known after apply)
          + secret_key = (sensitive value)
        }

      # linode_object_storage_object.object1 will be created
      + resource "linode_object_storage_object" "object1" {
          + access_key    = (known after apply)
          + acl           = "private"
          + bucket        = "mybucket-j1145"
          + cluster       = "eu-central-1"
          + content_type  = (known after apply)
          + etag          = (known after apply)
          + force_destroy = false
          + id            = (known after apply)
          + key           = "textfile-object"
          + secret_key    = (sensitive)
          + source        = "/home/username/terraform_test.txt"
          + version_id    = (known after apply)
        }

      # linode_object_storage_object.object2 will be created
      + resource "linode_object_storage_object" "object2" {
          + access_key       = (known after apply)
          + acl              = "private"
          + bucket           = "mybucket-j1145"
          + cluster          = "eu-central-1"
          + content          = "This is the content of the Object..."
          + content_language = "en"
          + content_type     = "text/plain"
          + etag             = (known after apply)
          + force_destroy    = false
          + id               = (known after apply)
          + key              = "freetext-object"
          + secret_key       = (sensitive)
          + version_id       = (known after apply)
        }

    Plan: 4 to add, 0 to change, 0 to destroy.
    ```

1. When all further changes to the `.tf` file have been made, use `terraform apply` to deploy the changes. If any errors appear, edit the `.tf` file and run `terraform plan` and `terraform apply` again. Terraform displays a list of the intended changes and asks whether to proceed.

    ```command
    terraform apply
    ```

    ```output
    Plan: 4 to add, 0 to change, 0 to destroy.

    Do you want to perform these actions?
      Terraform will perform the actions described above.
      Only 'yes' will be accepted to approve.

      Enter a value:
    ```

1. Enter `yes` to continue. Terraform displays a summary of all changes and confirms the operation has been completed. If any errors appear, edit the `.tf` file and run the commands again.

    ```command
    yes
    ```

    ```output
    linode_object_storage_key.storagekey: Creating...
    linode_object_storage_key.storagekey: Creation complete after 3s [id=367232]
    linode_object_storage_bucket.mybucket-j145: Creating...
    linode_object_storage_bucket.mybucket-j1145: Creation complete after 6s [id=eu-central-1:mybucket-j1145]
    linode_object_storage_object.object1: Creating...
    linode_object_storage_object.object2: Creating...
    linode_object_storage_object.object1: Creation complete after 0s [id=mybucket-j1145/textfile-object]
    linode_object_storage_object.object2: Creation complete after 0s [id=mybucket-j1145/freetext-object]

    Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
    ```

1. View the [Object Storage summary](https://cloud.linode.com/object-storage/buckets) page of the Linode Dashboard to ensure all objects have been correctly created and configured. Select the name of the Object Storage Bucket to view a list of all object storage objects inside the bucket. This page also allows you to download any files and text objects in the bucket.

## Deleting and Editing the Linode Storage Objects

To delete the storage object configuration, use the `terraform destroy` command. This causes Terraform to delete any objects listed in the Terraform files in the directory. For example, running `terraform destroy` against the `linode-terraform-storage.tf` file deletes all the storage clusters, buckets, keys, and storage objects. To delete only a subset of the configuration, edit the file so it only includes the objects to delete. Any objects that Terraform should retain must be removed from the file. Run the command `terraform plan -destroy` first to obtain a summary of the objects Terraform intends to delete.

```command
terraform plan -destroy
terraform destroy
```

To modify the contents of an object storage object, edit the `.tf` file containing the configuration so it reflects the new configuration. Run `terraform plan` to review the changes, then run `terraform apply`. Terraform automatically makes the necessary changes. Use this command with caution because it might cause an object to be deleted and re-created rather than modified.

```command
terraform plan
terraform apply
```

## Conclusion

Terraform is a powerful and efficient *Infrastructure as Code* (IaC) application. It automates the process of deploying infrastructure. To use Terraform, use the HCL or JSON formats to describe the final state of the network. Use the `terraform plan` command from the Terraform client to preview the changes and `terraform apply` to deploy the configuration.

The [Linode Provider](https://registry.terraform.io/providers/linode/linode/latest) includes an API for configuring [Linode Object Storage infrastructure](/docs/products/storage/object-storage/). First declare the Linode provider and the [Linode Object Storage Cluster](https://registry.terraform.io/providers/linode/linode/latest/docs/data-sources/object_storage_cluster) data source. Define the object storage infrastructure using [Linode object storage buckets](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_bucket), [object storage keys](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_key), and [object storage objects](https://registry.terraform.io/providers/linode/linode/latest/docs/resources/object_storage_object). The object storage objects are the files or strings of text to be stored. For more information on using Terraform, consult the [Terraform documentation](https://developer.hashicorp.com/terraform/docs).