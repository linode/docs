---
slug: how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use Terraform, the popular orchestration tool by HaschiCorp, and Linode''s Terraform K8s module to deploy a Kubernetes cluster on Linode. The steps you''ll complete in this guide will include configuring your local environment to run Linode''s Terraform k8s module and kubectl, and creating your Terraform configuration files and using them to deploy a Kubernetes cluster. Finally, you will connect to your Kubernetes cluster using kubectl. Using Linode''s Terraform k8s module simplifies many of the steps involved in manually deploying a Kubernetes cluster with kubeadm.'
keywords: ['terraform','kubernetes','orchestration','containers']
tags: ["kubernetes", "container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-03
modified_by:
  name: Linode
title: "How to Provision an Unmanaged Kubernetes Cluster using Terraform"
h1_title: "Provisioning an Unmanaged Kubernetes Cluster using Terraform"
contributor:
  name: Linode
external_resources:
- '[Kubernetes Terraform installer for Linode Instances](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2)'
aliases: ['/applications/configuration-management/terraform/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/']
---

Use [Terraform](https://www.terraform.io/), the popular orchestration tool by [HaschiCorp](https://www.hashicorp.com/), to deploy a Kubernetes cluster on Linode. [Linode's Terraform K8s module](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2) creates a Kubernetes cluster running on the [CoreOS ContainerLinux operating system](https://coreos.com/os/docs/latest/). After creating a Master and worker nodes, the module connects through SSH to these instances and installs [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/), [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and other Kubernetes binaries to `/opt/bin`. It also handles initializing kubeadm, joining worker nodes to the master, and configuring kubectl. For the cluster's container networking interface, Calico is installed. Finally, a kubectl admin config file is installed to the local environment, which you can use to connect to your cluster's API server.

Using Linode's Terraform k8s module simplifies many of the steps involved in manually deploying a Kubernetes cluster with kubeadm. To learn more about kubeadm, see our [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/kubernetes/getting-started-with-kubernetes/) guide.

{{< note >}}
Currently, Linode's Terraform k8s module only supports Kubernetes version 1.1.14. Development work to update this module is currently in progress. The latest updates can be found in the project's corresponding [GitHub repository](https://github.com/linode/terraform-linode-k8s).
{{</ note >}}
## Before You Begin

1. If you are new to Terraform, read through our [A Beginner's Guide to Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/) guide to familiarize yourself with key concepts.

1. For an introduction to Kubernetes concepts, see our [A Beginner's Guide to Kubernetes](/docs/kubernetes/beginners-guide-to-kubernetes-part-1-introduction/) series of guides.

1. You need a personal access token for [Linode’s v4 API](https://developers.linode.com/api/v4) to use with Terraform. Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) to get a token.
   {{< note >}}When you create a personal access token ensure that you set **Read/Write** access because you are creating new Linode servers.
    {{</ note >}}

1. [Install Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) on your computer.

    {{< note >}}
This guide was written using [Terraform version 0.12.24](https://www.hashicorp.com/blog/announcing-terraform-0-12/).
    {{</ note >}}

1. [Install kubectl](#install-kubectl) on your computer. You need kubectl to connect to and manage your Kubernetes cluster. Deployment of your cluster using this Terraform module fails if kubectl is not installed locally.

## In this Guide

You will complete the following tasks:

- [Configure your local environment to run Linode's Terraform k8s module and kubectl](#configure-your-local-environment).
- [Create your Terraform configuration files and use them to deploy a Kubernetes cluster](#create-your-terraform-configuration-files).
- [Connect to your Kubernetes cluster using kubectl](#connect-to-your-kubernetes-cluster-with-kubectl).

## Configure your Local Environment

Linode's k8s Terraform module requires a local environment with a kubectl instance, a system-wide installation of Python, SSH keys, SSH keys configured with your SSH agent, and the `sed` and `scp` command line utilities. The module's script `preflight.sh` verifies that all these requirements are installed on your local environment and generates a `$var not found` error if any of the tools are missing. This section shows how to install and configure kubectl, set up your SSH agent, and create an environment variable to store your API v4 token for easy reuse.

If you receive an error that your system is missing Python, scp, or sed, use your operating system's [package manager](https://www.linode.com/docs/tools-reference/linux-package-management/) to install the missing utilities.

  {{< disclosure-note "Create a Python Alias" >}}
If your Python installation is invoked using `python3`, you can alias the command so that Terraform can [execute scripts locally](https://www.terraform.io/docs/provisioners/local-exec.html) using Python as its interpreter.

Using the text editor of your choice, edit your `~/.bashrc` file to include the following alias:

  {{< file >}}
alias python=python3
  {{</ file >}}

Then, reinitialize your `~/.bashrc` file for the changes to take effect.

    source ~/.bashrc

  {{</ disclosure-note >}}

### Install kubectl

{{< content "how-to-install-kubectl" >}}

### SSH Agent

By default, Terraform uses your operating system's SSH agent to connect to a Linode instance through SSH. This section shows how to run the SSH agent and add your SSH keys to it.

1. Run your SSH agent with the following command:

        eval `ssh-agent`

    The output is similar to:

    {{< output >}}
Agent pid 11308
   {{</ output >}}

1. Add your SSH keys to the agent. For more information, see [creating an authentication key-pair](/docs/security/securing-your-server/#create-an-authentication-key-pair). This command adds keys from the default location, `~/.ssh/`

        ssh-add

    The output is similar to:

    {{< output >}}
Identity added: /home/example_user/.ssh/id_rsa (/home/example_user/.ssh/id_rsa)
   {{</ output >}}

### Create an API Token Environment Variable
When you run terraform commands that need to communicate with Linode's API v4, you need to issue the command along with your Linode token. In this section, you create an environment variable to store the token for easy reuse.

1. Create the `TF_VAR_linode_token` environment variable to store your Linode API v4 token. Enter your token after the prompt.

        read -sp "Linode Token: " TF_VAR_linode_token # Enter your Linode Token (it will be hidden)
        export TF_VAR_linode_token

    {{< note >}}
To use your environment variable, add the `-var` flag. For example, when you run the `terraform apply` command, you would do so using:

    terraform apply -var linode_token=$LINODE_TOKEN
    {{</ note >}}

## Create your Terraform Configuration Files

1. In the directory where you installed terraform, create a new directory to store your Kubernetes cluster's configuration files.

        cd terraform
        mkdir k8s-cluster

1. Using the text editor of your choice, create your cluster's main configuration file named `main.tf`. Add the following contents to the file.

      {{< file "~/terraform/k8s-cluster/main.tf">}}
module "k8s" {
  source             = "linode/k8s/linode"
  version            = "0.1.2"
  linode_token       = var.linode_token
  server_type_master = var.server_type_master
  server_type_node   = var.server_type_node
  cluster_name       = var.cluster_name
  k8s_version        = var.k8s_version
  region             = var.region
  nodes              = var.nodes
}
      {{</ file >}}

    This file contains your cluster's main configuration arguments. The only required configurations are `source` and `linode_token`. `source` calls Linode's k8s module, while the `linode_token` will give you access to viewing, creating, and destroying Linode resources.

    The rest of the configurations are [optional](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2?tab=inputs#optional-inputs) and have sane default values. In this example, however, you make use of [Terraform's input variables](https://www.linode.com/docs/applications/configuration-management/beginners-guide-to-terraform/#input-variables) so that your `main.tf` configuration can be easily reused across different clusters, if desired.

1. Create your input variables file, named `variables.tf`, with the example content.

      {{< file "~/terraform/k8s-cluster/variables.tf">}}
variable "linode_token" {
  description = " Linode API token"
}

variable "server_type_master" {
  default     = "g6-standard-2"
  description = " Linode API token"
}

variable "cluster_name" {
  description = " Linode API token"
  default     = "example-cluster-1"
}

variable "server_type_node" {
  description = " Linode API token"
  default     = "g6-standard-1"
}

variable "k8s_version" {
  description = " Linode API token"
  default     = "v1.14.0"
}

variable "region" {
  description = "Values: us-east, ap-west, etc."
  default     = "us-east"
}

variable "nodes" {
  description = " Linode API token"
  default     = 3
}
      {{</ file >}}

    The example file creates input variables which are referenced in your main configuration file that you created in the previous step. The values for those variables are assigned in a separate file in the next step. You can override the k8s module's default values and provide your own defaults, as done in the example file. For more details about input variables, see the [Input Variables](https://www.linode.com/docs/applications/configuration-management/beginners-guide-to-terraform/#input-variables) section in our [A Beginner's Guide to Terraform](https://www.linode.com/docs/applications/configuration-management/beginners-guide-to-terraform/) guide.

1. Create your input variables values file to provide your main configuration file with values that differ from your input variable file's defaults.

      {{< file "~/terraform/k8s-cluster/terraform.tfvars">}}
server_type_master = "g6-standard-4"
cluster_name = "example-cluster-2"
      {{</ file >}}

      In this example, your cluster's master node uses a `g6-standard-4` Linode plan, instead of the default `g6-standard-2`, and the `cluster_name` is set to `example-cluster-2`, instead of `example-cluster-1`.

### Deploy Your Kubernetes Cluster

1. Change to `~/terraform/k8s-cluster/` directory and initialize Terraform to install the Linode K8s module.

        terraform init

1. Verify that Terraform creates your cluster's resources as you expect them to be created before making any actual changes to your infrastructure. To do this, run the `plan` command:

        terraform plan

    This command generates a report detailing what actions Terraform will take to set up your Kubernetes cluster.

1. If you are satisfied with the generated report, run the `apply` command to create your Kubernetes cluster. This command prompts you to confirm that you want to proceed.

        terraform apply -var-file="terraform.tfvars"

    After a few minutes, when Terraform has finished applying your configuration, it displays a report of what actions were taken and your Kubernetes cluster is ready for you to connect to it.

### Connect to Your Kubernetes Cluster with kubectl

After Terraform finishes deploying your Kubernetes cluster, your `~/terraform/k8s-cluster/` directory should have a file named `default.conf`. This file contains your [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. You can use kubectl, along with this file, to gain access to your Kubernetes cluster.

1. Save your kubeconfig file's path to the `$KUBECONFIG` environment variable. In the example command, the kubeconfig file is located in the Terraform directory you created at the beginning of this guide.  Ensure that you update the command with the location of your `default.conf` file

        export KUBECONFIG=~/terraform/k8s-cluster/default.conf

    {{< note >}}
It is common practice to store your kubeconfig files in `~/.kube` directory. By default, kubectl searches for a kubeconfig file named `config` that is located in the  `~/.kube` directory. You can specify other kubeconfig files by setting the `$KUBECONFIG` environment variable, as done in the step above.
{{</ note >}}

1. View your cluster's nodes using kubectl.

        kubectl get nodes

    {{< note >}}
If your kubectl commands are not returning the resources and information you expect, then your client may be assigned to the wrong cluster context. Visit our [Troubleshooting Kubernetes](/docs/kubernetes/troubleshooting-kubernetes/#troubleshooting-examples) guide to learn how to switch cluster contexts.
{{</ note >}}

      You are now ready to manage your cluster using kubectl. For more information about using kubectl, see Kubernetes' [Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/) guide.

### Persist the Kubeconfig Context

If you open a new terminal window, it does not have access to the context that you specified using the previous instructions. This context information can be made persistent between new terminals by setting the [`KUBECONFIG` environment variable](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) in your shell's configuration file.

{{< note >}}
If you are using Windows, review the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) about how to persist your context.
{{< /note >}}

These instructions are for the Bash terminal. They are similar for other terminals that you may use:

1.  Navigate to the `$HOME/.kube` directory:

        cd $HOME/.kube

1.  Create a directory called `configs` within `$HOME/.kube`. You can use this directory to store your kubeconfig files.

        mkdir configs

1. Copy your `default.conf` file to the `$HOME/.kube/configs` directory.

        cp ~/terraform/k8s-cluster/default.conf $HOME/.kube/configs/default.conf

    {{< note >}}
Optionally, you can give the copied file a different name to help distinguish it from other files in the `configs` directory.
{{< /note >}}

1.  Open up your Bash profile (e.g. `~/.bashrc`) in the text editor of your choice and add your configuration file to the `$KUBECONFIG` PATH variable.

    If an `export KUBECONFIG` line is already present in the file, append to the end of this line as follows; if it is not present, add this line to the end of your file:

        export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config:$HOME/.kube/configs/default.conf

1.  Close your terminal window and open a new window to receive the changes to the `$KUBECONFIG` variable.

1.  Use the `config get-contexts` command for `kubectl` to view the available cluster contexts:

        kubectl config get-contexts

    You should see output similar to the following:

    {{< output >}}
CURRENT   NAME                                 CLUSTER             AUTHINFO           NAMESPACE
*         kubernetes-admin@example-cluster-1   example-cluster-1   kubernetes-admin
{{</ output >}}

1.  If your context is not already selected, (denoted by an asterisk in the `current` column), switch to this context using the `config use-context` command. Supply the full name of the cluster (including the authorized user and the cluster):

        kubectl config use-context kubernetes-admin@example-cluster-1

    You should see output similar to the following:

    {{< output >}}
Switched to context "kubernetes-admin@example-cluster-1".
{{</ output>}}

1.  You are now ready to interact with your cluster using `kubectl`. You can test the ability to interact with the cluster by retrieving a list of Pods. Use the `get pods` command with the `-A` flag to see all pods running across all namespaces:

        kubectl get pods -A

    You should see output like the following:

    {{< output >}}
NAMESPACE            NAME                                               READY   STATUS    RESTARTS   AGE
kube-system          calico-node-5bkc6                                  2/2     Running   0          17m
kube-system          calico-node-gp5ls                                  2/2     Running   0          17m
kube-system          calico-node-grpnj                                  2/2     Running   0          17m
kube-system          calico-node-qd85t                                  2/2     Running   0          17m
kube-system          ccm-linode-mjgzz                                   1/1     Running   0          17m
kube-system          coredns-fb8b8dccf-5tlbm                            1/1     Running   0          17m
kube-system          coredns-fb8b8dccf-7tpgf                            1/1     Running   0          17m
kube-system          csi-linode-controller-0                            3/3     Running   0          17m
kube-system          csi-linode-node-gfd8m                              2/2     Running   0          17m
kube-system          csi-linode-node-hrfnd                              2/2     Running   0          16m
kube-system          csi-linode-node-q6fmd                              2/2     Running   0          17m
kube-system          etcd-mytestcluster-master-1                        1/1     Running   0          16m
kube-system          external-dns-7885f88564-tvpjf                      1/1     Running   0          17m
kube-system          kube-apiserver-mytestcluster-master-1              1/1     Running   0          16m
kube-system          kube-controller-manager-mytestcluster-master-1     1/1     Running   0          16m
kube-system          kube-proxy-cs9tm                                   1/1     Running   0          17m
kube-system          kube-proxy-qljn5                                   1/1     Running   0          17m
kube-system          kube-proxy-sr5h8                                   1/1     Running   0          17m
kube-system          kube-proxy-ww2tx                                   1/1     Running   0          17m
kube-system          kube-scheduler-mytestcluster-master-1              1/1     Running   0          16m
kube-system          kubernetes-dashboard-5f7b999d65-jk99z              1/1     Running   0          17m
kube-system          metrics-server-58db9f9647-tz8f8                    1/1     Running   0          17m
reboot-coordinator   container-linux-update-agent-6kgqm                 1/1     Running   0          16m
reboot-coordinator   container-linux-update-agent-7nck5                 1/1     Running   0          17m
reboot-coordinator   container-linux-update-agent-nhlxj                 1/1     Running   0          17m
reboot-coordinator   container-linux-update-agent-vv8db                 1/1     Running   0          17m
reboot-coordinator   container-linux-update-operator-5c9d67d4cf-78wbp   1/1     Running   0          17m
{{</ output >}}
