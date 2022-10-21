---
slug: how-to-deploy-an-lke-cluster-using-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: "In this tutorial, you'll deploy a Kubernetes cluster using the Linode Kubernetes Engine (LKE) and Terraform."
og_description: "In this tutorial, you'll deploy a Kubernetes cluster using the Linode Kubernetes Engine (LKE) and Terraform."
keywords: ['kubernetes','terraform','infrastructure as code','container orchestration']
tags: ["linode platform","kubernetes","automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-05-05
modified_by:
  name: Linode
title: "How to Deploy an LKE Cluster Using Terraform"
h1_title: "Deploying a Linode Kubernetes Engine Cluster Using Terraform"
enable_h1: true
image: deploy-lke-cluster-with-terraform.png
contributor:
  name: Linode
external_resources:
- '[Setting Up a Private Docker Registry with Linode Kubernetes Engine and Object Storage](/docs/guides/how-to-setup-a-private-docker-registry-with-lke-and-object-storage/)'
- '[Deploying a Static Site on Linode Kubernetes Engine](/docs/guides/how-to-deploy-a-static-site-on-linode-kubernetes-engine/)'
- '[Linode Provider Terraform Documentation](https://www.terraform.io/docs/providers/linode/index.html)'
aliases: ['/kubernetes/how-to-deploy-an-lke-cluster-using-terraform/']
---

## What is the Linode Kubernetes Engine (LKE)?

The Linode Kubernetes Engine (LKE) is a fully-managed container orchestration engine for deploying and managing containerized applications and workloads. LKE combines Linode’s ease of use and [simple pricing](/docs/platform/billing-and-support/billing-and-payments/#linode-cloud-hosting-and-backups) with the infrastructure efficiency of Kubernetes. When you deploy a LKE cluster, you receive a Kubernetes Master at no additional cost; you only pay for the Linodes (worker nodes), [NodeBalancers](/docs/guides/getting-started-with-nodebalancers/) (load balancers), and [Block Storage Volumes](/docs/products/storage/block-storage/). Your LKE Cluster’s Master node runs the Kubernetes control plane processes – including the API, scheduler, and resource controllers.

## In this Guide

This guide will walk you through the steps needed to deploy a Kubernetes cluster using LKE and the popular *infrastructure as code (IaC)* tool, [Terraform](https://www.terraform.io/). Throughout the guide you will:

- [Prepare your local environment by installing Terraform](#prepare-your-local-environment) and [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/).
- [Create reusable Terraform configuration files to define your Kubernetes cluster's resources](#create-your-terraform-configuration-files).
- [Optionally, you will destroy the cluster you create using Terraform](#destroy-your-kubernetes-cluster-optional).

## Before you Begin

1. Create a personal access token for [Linode's API v4](https://developers.linode.com/api/v4). Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) to get a token. You will need a token to be able to create Linode resources using Terraform.

    {{< note >}}
Ensure that your token has, at minimum, Read/Write permissions for Linodes, Kubernetes, NodeBalancers, and Volumes.
    {{</ note >}}

1. Review the [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/) to familiarize yourself with Terraform concepts if you have not used the tool before. This guide assumes familiarity with Terraform and its native [HCL syntax](https://www.terraform.io/docs/configuration/syntax.html).

## Prepare your Local Environment

### Install Terraform

Install Terraform on your computer by following the [Install Terraform](/docs/applications/configuration-management/terraform/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) section of our [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) guide.

### Install kubectl

{{< content how-to-install-kubectl >}}

## Create your Terraform Configuration Files

In this section, you will create Terraform configuration files that define the resources needed to create a Kubernetes cluster. You will create a `main.tf` file to store your [resource declarations](https://www.terraform.io/docs/configuration/resources.html), a `variables.tf` file to store your [input variable](https://www.terraform.io/docs/configuration/variables.html) definitions, and a `terraform.tfvars` file to [assign values](https://www.terraform.io/docs/configuration/variables.html#variable-definitions-tfvars-files) to your input variables. Setting up your Terraform project in this way will allow you to reuse your configuration files to deploy more Kubernetes clusters, if desired.

### Create your Resource Configuration File

 Terraform defines the elements of your Linode infrastructure inside of configuration files. Terraform refers to these infrastructure elements as *resources*. Once you declare your Terraform configuration, you then *apply* it, which results in the creation of those resources on the Linode platform. The Linode Provider for Terraform exposes the Linode resources you will need to deploy a Kubernetes cluster using LKE.

1. Navigate to the directory where you installed Terraform. Replace `~/terraform` with the location of your installation.

        cd ~/terraform

1. Create a new directory to store your LKE cluster's Terraform configurations. Replace `lke-cluster` with your preferred directory name.

        mkdir lke-cluster

1. Using the text editor of your choice, create your cluster’s main configuration file named `main.tf` which will store your resource definitions. Add the following contents to the file, replacing the `version` number which can be found on [Terraform's Registry Website](https://registry.terraform.io/providers/linode/linode/latest/docs):

    {{< file "~/terraform/lke-cluster/main.tf" >}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.27.1"
    }
  }
}
//Use the Linode Provider
provider "linode" {
  token = var.token
}

//Use the linode_lke_cluster resource to create
//a Kubernetes cluster
resource "linode_lke_cluster" "foobar" {
    k8s_version = var.k8s_version
    label = var.label
    region = var.region
    tags = var.tags

    dynamic "pool" {
        for_each = var.pools
        content {
            type  = pool.value["type"]
            count = pool.value["count"]
        }
    }
}

//Export this cluster's attributes
output "kubeconfig" {
   value = linode_lke_cluster.foobar.kubeconfig
   sensitive = true
}

output "api_endpoints" {
   value = linode_lke_cluster.foobar.api_endpoints
}

output "status" {
   value = linode_lke_cluster.foobar.status
}

output "id" {
   value = linode_lke_cluster.foobar.id
}

output "pool" {
   value = linode_lke_cluster.foobar.pool
}
    {{</ file >}}

    This file contains your cluster’s main configuration arguments and output variables. In this example, you make use of Terraform’s input variables so that your `main.tf` configuration can be easily reused across different clusters.

    Variables and their values will be created in separate files later on in this guide. Using separate files for variable declaration allows you to avoid hard-coding values into your resources. This strategy can help you reuse, share, and version control your Terraform configurations.

    This configuration file uses the Linode provider to create a Kubernetes cluster. All arguments within the `linode_lke_cluster.foobar` resource are required, except for `tags`. The `pool` argument accepts a list of pool objects. In order to read their input variable values, the configuration file makes use of Terraform's [dynamic blocks](https://www.terraform.io/docs/configuration/expressions.html#dynamic-blocks). Finally, [output values](https://www.terraform.io/docs/configuration/outputs.html) are declared in order to capture your cluster's attribute values that will be returned to Terraform after creating your cluster.

    {{< note >}}
You should set any output value as being sensitive in order to prevent Terraform from printing its value to your terminal after running `terraform apply`. In the example configuration for example, the `kubeconfig` output value is listed as sensitive.

See [Terraform's output value documentation](https://www.terraform.io/docs/configuration/outputs.html#sensitive-suppressing-values-in-cli-output) for more details on the behavior of the `sensitive` argument.
    {{</ note >}}

    {{< note >}}
 For a complete `linode_lke_cluster` resource argument reference, see the [Linode Provider Terraform documentation](https://www.terraform.io/docs/providers/linode/r/lke_cluster.html). You can update the `main.tf` file to include any additional arguments you would like to use.
    {{</ note >}}

### Define your Input Variables

You are now ready to define the input variables that were referenced in your `main.tf` file.

1. Create a new file named `variables.tf` in the same directory as your `main.tf` file. Add the following contents to the file:


    {{< file "~/terraform/lke-cluster/variables.tf" >}}
    variable "token" {
      description = "Your Linode API Personal Access Token. (required)"
    }

    variable "k8s_version" {
      description = "The Kubernetes version to use for this cluster. (required)"
      default = "1.23"
    }

    variable "label" {
      description = "The unique label to assign to this cluster. (required)"
      default = "default-lke-cluster"
    }

    variable "region" {
      description = "The region where your cluster will be located. (required)"
      default = "us-east"
    }

    variable "tags" {
      description = "Tags to apply to your cluster for organizational purposes. (optional)"
      type = list(string)
      default = ["testing"]
    }

    variable "pools" {
      description = "The Node Pool specifications for the Kubernetes cluster. (required)"
      type = list(object({
        type = string
        count = number
      }))
      default = [
        {
          type = "g6-standard-4"
          count = 3
        },
        {
          type = "g6-standard-8"
          count = 3
        }
      ]
    }
    {{</ file >}}

    This file describes each variable and provides them with default values. You should review and update the file with your own preferred default values, ensuring that they match currently available [versions of Kubernetes on LKE](https://developers.linode.com/changelog/linode-kubernetes-engine/), as well as [Available Plans](/docs/guides/choosing-a-compute-instance-plan/) and [Data Centers](/docs/guides/how-to-choose-a-data-center/)

### Assign Values to your Input Variables

You will now need to define the values you would like to use in order to create your Kubernetes cluster. These values are stored in a separate file named `terraform.tfvars`. This file should be the only file that requires updating when reusing the files created in this guide to deploy a new Kubernetes cluster or to add a new node pool to the cluster.

1. Create a new file named `terraform.tfvars` to provide values for all the input variables declared in the previous section.

    {{< note >}}
If you leave out a variable value in this file, Terraform will use the variable's default value that you provided in your `variables.tf` file.
    {{</ note >}}

      {{< file "$~/terraform/lke-cluster/terraform.tfvars" >}}
label = "example-lke-cluster"
k8s_version = "1.23"
region = "us-west"
pools = [
  {
    type : "g6-standard-2"
    count : 3
  }
]
      {{</ file >}}

    Terraform will use the values in this file to create a new Kubernetes cluster with one node pool that contains three 4 GB nodes. The cluster will be located in the `us-west` data center (Dallas, Texas, USA). Each node in the cluster's node pool will use Kubernetes version `1.23` and the cluster will be named `example-lke-cluster`. You can replace any of the values in this file with your own preferred cluster configurations.

## Deploy your Kubernetes Cluster

Now that all your Terraform configuration files are ready, you can deploy your Kubernetes cluster.

1. Ensure that you are in your `lke-cluster` project directory which should contain all of your Terraform configuration files. If you followed the naming conventions used in this guide, your project directory will be `~/terraform/lke-cluster`.

        cd ~/terraform/lke-cluster

1. Install the Linode Provider to your Terraform project directory. Whenever a new provider is used in a Terraform configuration, it must be initialized before you can create resources with it.

        terraform init

    You will see a message that confirms that the Linode provider plugins have been successfully initialized.

1. Export your API token to an environment variable. Terraform environment variables have the prefix `TF_VAR_` and are supplied at the command line. This method is preferable over storing your token in a plain text file. Replace the example's token value with your own.

        export TF_VAR_token=70a1416a9.....d182041e1c6bd2c40eebd

    {{< caution >}}
This method commits the environment variable to your shell’s history, so take care when using this method.
    {{</ caution >}}

1. View your Terraform's execution plan before deploying your infrastructure. This command won't take any actions or make any changes on your Linode account. It will provide a report displaying all the resources that will be created or modified when the plan is executed.

        terraform plan \
        -var-file="terraform.tfvars"

1. Apply your Terraform configurations to deploy your Kubernetes cluster.

        terraform apply \
        -var-file="terraform.tfvars"

    Terraform will begin to create the resources you’ve defined throughout this guide. This process will take several minutes to complete. Once the cluster has been successfully created the output will include a success message and the values that you exposed as output when creating your `main.tf` file (the example output has been truncated for brevity).

    {{< output >}}
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

api_endpoints = [
  "https://91132f3d-fd20-4a70-a171-06ddec5d9c4d.us-west-2.linodelke.net:443",
  "https://91132f3d-fd20-4a70-a171-06ddec5d9c4d.us-west-2.linodelke.net:6443",
  "https://192.0.2.0:443",
  "https://192.0.2.0:6443",
]
...
          {{</ output >}}

### Connect to your LKE Cluster

Now that your Kubernetes cluster is deployed, you can use kubectl to connect to it and begin defining your workload. In this section, you will access your cluster's kubeconfig and use it to connect to your cluster with kubectl.

1. Use Terraform to access your cluster's kubeconfig, decode its contents, and save them to a file. Terraform returns a [base64](https://en.wikipedia.org/wiki/Base64) encoded string (a useful format for automated pipelines) representing your kubeconfig. Replace `lke-cluster-config.yaml` with your preferred file name.

        export KUBE_VAR=`terraform output kubeconfig` && echo $KUBE_VAR | base64 -di > lke-cluster-config.yaml

    {{< note >}}
Depending on your local operating system, to decode the kubeconfig's base64 format, you may need to replace `base64 -di` with `base64 -D` or just `base64 -d`. To determine which `base64` option to use, issue the following command:

    base64 --help
    {{</ note >}}

1. Add the kubeconfig file to your `$KUBECONFIG` environment variable. This will give kubectl access to your cluster's kubeconfig file.

        export KUBECONFIG=lke-cluster-config.yaml

1. Verify that your cluster is selected as kubectl’s current context:

        kubectl config get-contexts

1. View all nodes in your Kubernetes cluster using kubectl:

        kubectl get nodes

    Your output will resemble the following example, but will vary depending on your own cluster’s configurations.

    {{< output >}}
NAME                        STATUS   ROLES    AGE   VERSION
lke4377-5673-5eb331ac7f89   Ready    <none>   17h   v1.17.0
lke4377-5673-5eb331acab1d   Ready    <none>   17h   v1.17.0
lke4377-5673-5eb331acd6c2   Ready    <none>   17h   v1.17.0
    {{</ output >}}

      Now that you are connected to your LKE cluster, you can begin using kubectl to deploy applications, [inspect and manage](/docs/kubernetes/troubleshooting-kubernetes/#kubectl-get) cluster resources, and [view logs](/docs/kubernetes/troubleshooting-kubernetes/#kubectl-logs).

## Destroy your Kubernetes Cluster (optional)

Terraform includes a `destroy` command to remove resources managed by Terraform.

1. Run the `plan` command with the `-destroy` option to verify which resources will be destroyed.

        terraform plan -destroy

    Follow the prompt to enter your Linode API v4 access token and review the report to ensure the resources you expect to be destroyed are listed.

1. Destroy the resources outlined in the above command.

        terraform destroy

    Follow the prompt to enter your Linode API v4 access token and type in `yes` when prompted to destroy your Kubernetes cluster.