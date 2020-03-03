---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-03
modified_by:
  name: Linode
title: "How to Provision an Unmanaged Kubernetes Cluster using Terraform"
h1_title: "Provision an Unmanaged Kubernetes Cluster using Terraform"
contributor:
  name: Linode
  link: Github/Twitter Link
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

## Before You Begin

1. If you are new to Terraform, read through our [A Beginner's Guide to Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/) guide to familiarize yourself with key concepts.

1. For an introduction to Kubernetes concepts, see our [A Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/) series of guides.

1. You will need a personal access token for [Linode’s v4 API](https://developers.linode.com/api/v4) to use with Terraform. Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) to get a token.

1. [Install Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) on your computer.

1. [Install kubectl](#install-kubectl) on your computer.

## In this Guide

- Links to key sections and topics in this guide
- Links to key sections and topics in this guide

## Configure your Local Environment

### Install kubectl

{{< content "how-to-install-kubectl" >}}

### Create an API Token Environment Variable
When you run terraform commands that need to communicate with Linode's API v4, you will need to issue the command along with your Linode token. In this section, you will create an environment variable to store the token for easy reuse.

1. Create the `TF_VAR_linode_token` environment variable to store your Linode API v4 token. Enter your token after the prompt.

        read -sp "Linode Token: " TF_VAR_linode_token # Enter your Linode Token (it will be hidden)
        export TF_VAR_linode_token

    {{< note >}}
To use your environment variable, add the `-var` flag. For example, when you run the `terraform apply` command, you would do so in the following way:

    terraform apply -var linode_token=$LINODE_TOKEN
    {{</ note >}}

## Create your Terraform Configuration

[Terraform Workspaces](https://www.terraform.io/docs/state/workspaces.html) are a good way to use the same
1. In the directory where you installed terraform, create a new directory to store your Kubernetes cluster's configuration files.

        cd terraform
        mkdir k8s-cluster

1. Initialize Terraform in order to install the Linode K8s module.

        terraform init

### Create Your Workspace



### Create your Main.tf file

* Pin to a specific module version using version = "..." to avoid upgrading to a version with breaking changes. Upgrades to this module could potentially replace all master and worker nodes resulting in data loss. The terraform plan will report this, but it may not be obvious.

{{< note >}}
Ensure you have a public key in your home folder, otherwise you'll receive an error
{{</ note >}}

{{< note >}}
After running `terraform plan`, you may see a similar note:

{{< output >}}
Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
{{</ output >}}
https://www.terraform.io/docs/commands/plan.html#out-path
{{</ note >}}

1. Run `terraform apply`

    Respond `yes` to the prompt to apply your configurations:

    {{< output >}}
Do you want to perform these actions in workspace "linode"?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.
    {{</ output >}}

    {{< note >}}
Ensure you have Python installed
    {{</ note >}}