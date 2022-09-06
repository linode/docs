---
slug: how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to use kubectl, Terraform, and the Linode Terraform K8s module to create and configure Terraform configuration files and deploy a Kubernetes cluster.'
keywords: ['terraform','kubernetes','orchestration','containers','k8s','kubectl','Kubernetes Terraform installer for Linode Instances','terraform-linode-k8s']
tags: ["kubernetes", "terraform", "container"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-03
image: UnmanagedKubernetesCluster_Terraform.png
modified: 2021-03-11
modified_by:
  name: Linode
title: "Provision an Unmanaged Kubernetes Cluster using Terraform"
h1_title: "Provision Unmanaged Kubernetes Cluster using Terraform"
contributor:
  name: Linode
external_resources:
- '[Kubernetes Terraform installer for Linode Instances](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2)'
aliases: ['/applications/configuration-management/terraform/how-to-provision-an-unmanaged-kubernetes-cluster-using-terraform/']
deprecated: true
---

[Terraform](https://www.terraform.io/), the orchestration tool by [HashiCorp](https://www.hashicorp.com/), can be used to deploy a Kubernetes cluster on Linode. [Linode's Terraform K8s module](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2) creates a Kubernetes(K8s) cluster running on Ubuntu, and simplifies many of the steps involved in deploying a Kubernetes cluster with [kubeadm](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/). After creating master and worker nodes, the module connects over SSH to these instances and installs kubeadm, [kubectl](https://kubernetes.io/docs/reference/kubectl/overview/), and other Kubernetes binaries to the `/opt/bin` directory. It also initializes kubeadm, joins the worker nodes to the master, and configures kubectl to control the cluster. Calico is installed for the container networking interface of the cluster. A kubectl config file is installed to the local environment which connects to the API server of the cluster.



{{< note >}}
Development work on the module is active. For the latest updates and validated Terraform configurations, see the module’s [GitHub repository](https://github.com/linode/terraform-linode-k8s).
{{</ note >}}

## Before You Begin

Before starting to deploy a Kubernetes cluster with Terraform, make sure:

1. You are familiar with Terraform. You can read through [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/) to familiarize yourself with key concepts.

2. You are familiar with Kubernetes concepts. For an introduction, see the [A Beginner's Guide to Kubernetes](/docs/guides/beginners-guide-to-kubernetes-part-1-introduction/) series. Read through [Getting Started with Kubernetes: Use kubeadm to Deploy a Cluster on Linode](/docs/guides/getting-started-with-kubernetes/) to get familiar with kubeadm.

3. You have a personal access token for [Linode’s v4 API](https://developers.linode.com/api/v4) to use with Terraform. Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) to get a token.
   {{< note >}}When creating a personal access token, ensure it is set to **Read/Write** access as new Linode servers are being created.
    {{</ note >}}

4. Terraform is installed on your computer. See [Install Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) for more information.

    {{< note >}}
This guide was written using [Terraform version 0.12.24](https://www.hashicorp.com/blog/announcing-terraform-0-12/). The module requires at least Terraform 0.10.
    {{</ note >}}

5. And, lastly, kubectl is installed on your computer. The kubectl is necessary to connect to and manage the Kubernetes cluster; deployment using the Terraform module fails if kubectl is not installed locally. See [Install kubectl](#install-kubectl) for more information.


## Configure the Local Environment

Deploying a Kubernetes cluster with Linode's K8s Terraform module requires:
-  a local environment with a kubectl instance
-  a system-wide installation of Python
-  SSH keys, SSH keys configured with the SSH agent
-  the `sed` and `scp` command-line utilities
The module's script `preflight.sh` verifies these requirements are installed on the local environment and generates a `$var not found` error if any of the tools are missing. In this section learn how to:
-  install and configure kubectl
-  set up the SSH agent
-  create an environment variable to store the API v4 token

If there is an error stating the system is missing Python, scp, or sed, use the operating system's [package manager](/docs/guides/linux-package-management/) to install the missing utilities.

  {{< disclosure-note "Create a Python Alias" >}}
If Python is invoked using `python3`, alias the command so Terraform can [execute scripts locally](https://www.terraform.io/docs/provisioners/local-exec.html) using Python as its interpreter. Using a text editor, edit `~/.bashrc` file to include the following alias:

    alias python=python3
Then, reinitialize `~/.bashrc` file for the changes to take effect.

    source ~/.bashrc
  {{</ disclosure-note >}}

### Install kubectl

{{< content "how-to-install-kubectl" >}}

### SSH Agent

By default, Terraform uses the SSH agent of the operating system to connect to a Linode instance through SSH. In this section learn how to run the SSH agent and add the necessary SSH keys to it.

1. Run the SSH agent with the following command:

        eval `ssh-agent`

    The output is similar to:

    {{< output >}}
Agent pid 11308
   {{</ output >}}

2. Add the SSH keys to the agent. For more information, see [creating an authentication key-pair](/docs/guides/set-up-and-secure/#create-an-authentication-key-pair). This command adds keys from the default location, `~/.ssh/`

        ssh-add

    The output is similar to:

    {{< output >}}
Identity added: /home/example_user/.ssh/id_rsa (/home/example_user/.ssh/id_rsa)
   {{</ output >}}

### Linode API Token

Before running the project, create an access token for Terraform to connect to the Linode API.
Using the token and your access key, create the `LINODE_TOKEN` environment variable:

```bash
read -sp "Linode Token: " TF_VAR_linode_token # Enter your Linode Token (it will be hidden)
export TF_VAR_linode_token
```

This variable needs to be supplied to every Terraform `apply`, `plan`, and `destroy` command using `-var linode_token=$LINODE_TOKEN` unless a `terraform.tfvars` file is created with this secret token.

## Create Terraform Configuration Files

1. In the directory where Terraform was installed, create a new directory to store the configuration files of the K8s cluster.

        cd terraform
        mkdir k8s-cluster

2. Using a text editor, create the main configuration file of the cluster and name it `main.tf`. Add the following contents to the file.

      {{< file "~/terraform/k8s-cluster/main.tf">}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
  }
}
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

    This file contains the main configuration arguments of the cluster. The only required configurations are `source` and `linode_token`. `source` calls Linode's k8s module, while the `linode_token` gives access to viewing, creating, and destroying Linode resources.

    The rest of the configurations are [optional](https://registry.terraform.io/modules/linode/k8s/linode/0.1.2?tab=inputs#optional-inputs) and have some default values. In this example, however, [Terraform's input variables](/docs/guides/beginners-guide-to-terraform/#input-variables) are used, so the `main.tf` configuration can be reused across different clusters.

1. Create an input variables file, named `variables.tf`, with the example content.

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

    The example file creates input variables referenced in the main configuration file that was created. The values for those variables are assigned in a separate file in the next step. The default values of the k8s module can be overridden, as in the example file. For more details about input variables, see the [Input Variables](/docs/guides/beginners-guide-to-terraform/#input-variables) section in the [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/).

1. Create an input variables values file to provide the main configuration file with values that differ from the defaults in input variable file.

      {{< file "~/terraform/k8s-cluster/terraform.tfvars">}}
server_type_master = "g6-standard-4"
cluster_name = "example-cluster-2"
      {{</ file >}}

      In this example, the master node of the cluster uses a `g6-standard-4` Linode plan, instead of the default `g6-standard-2`, and the `cluster_name` is set to `example-cluster-2`, instead of `example-cluster-1`.

### Deploy the Kubernetes Cluster using Terraform

1. Change to the `~/terraform/k8s-cluster/` directory and initialize Terraform to install the Linode K8s module.

        terraform init

1. Verify Terraform creates the resources of the cluster as expected before making any actual changes to the infrastructure. To do this, run the `plan` command:

        terraform plan

    This command generates a report detailing what actions Terraform takes to set up the Kubernetes cluster.

1. If satisfied with the generated report, run the `apply` command to create the Kubernetes cluster. This command prompts confirmation to proceed.

        terraform apply -var-file="terraform.tfvars"

    After a few minutes, when Terraform has finished applying the configuration, it displays a report of the actions were taken. And the Kubernetes cluster is ready for you to connect to it.

### Connect to the Kubernetes cluster with kubectl

After Terraform finishes deploying the Kubernetes cluster, the `~/terraform/k8s-cluster/` directory should contain a file named `default.conf`. This file contains the [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file. Use kubectl, along with this file, to gain access to the Kubernetes cluster.

1. Save the path of the kubeconfig file to the `$KUBECONFIG` environment variable. In the example command, the kubeconfig file is located in the Terraform directory created at the beginning of this guide. Ensure the command is updated with the location of the `default.conf` file:

        export KUBECONFIG=~/terraform/k8s-cluster/default.conf

    {{< note >}}
It is common practice to store kubeconfig files in `~/.kube` directory. By default, kubectl searches for a kubeconfig file named `config` that is located in the  `~/.kube` directory. Other kubeconfig files can also be specified by setting the `$KUBECONFIG` environment variable.
{{</ note >}}

1. View the nodes in the cluster using kubectl.

        kubectl get nodes

    {{< note >}}
If the kubectl commands are not returning the resources and information you expect, then the client may be assigned to the wrong cluster context. Visit the [Troubleshooting Kubernetes](/docs/kubernetes/troubleshooting-kubernetes/#troubleshooting-examples) guide to learn how to switch cluster contexts.
{{</ note >}}

You are now ready to manage the cluster using kubectl. For more information about using kubectl, see the Kubernetes [Overview of kubectl](https://kubernetes.io/docs/reference/kubectl/overview/).

### Persist the Kubeconfig Context

A new terminal window does not have access to the context specified using the previous instructions. This context information can be made persistent between new terminals by setting the [`KUBECONFIG` environment variable](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) in the configuration file of the shell.

{{< note >}}
If you are using Windows, review the [official Kubernetes documentation](https://kubernetes.io/docs/tasks/access-application-cluster/configure-access-multiple-clusters/#set-the-kubeconfig-environment-variable) to persist a context.
{{< /note >}}

These instructions are for the Bash shell and they are similar to other shells:

1.  Navigate to the `$HOME/.kube` directory:

        cd $HOME/.kube

1.  Create a directory named `configs` within `$HOME/.kube`. This directory can be used to store the kubeconfig files.

        mkdir configs

1. Copy the `default.conf` file to the `$HOME/.kube/configs` directory.

        cp ~/terraform/k8s-cluster/default.conf $HOME/.kube/configs/default.conf

    {{< note >}}
Optionally, you can provide the copied file a different name to help distinguish it from other files in the `configs` directory.
{{< /note >}}

1.  Open up the Bash profile (`~/.bashrc`) in a text editor and add the configuration file to the `$KUBECONFIG` PATH variable.

    If an `export KUBECONFIG` line is already present in the file, append to the end of this line as follows; if it is not present, add this line to the end of the file:

        export KUBECONFIG=$KUBECONFIG:$HOME/.kube/config:$HOME/.kube/configs/default.conf

1.  Close the terminal window and open a new window to receive the changes to the `$KUBECONFIG` variable.

1. Use the `config get-contexts` command for `kubectl` to view the available cluster contexts:

        kubectl config get-contexts

    The output should be similar to the following:

    {{< output >}}
CURRENT   NAME                                 CLUSTER             AUTHINFO           NAMESPACE
*         kubernetes-admin@example-cluster-1   example-cluster-1   kubernetes-admin
{{</ output >}}

1.  If your context is not already selected, which is denoted by an asterisk in the `current` column, switch to this context using the `config use-context` command. Supply the full name of the cluster including the authorized user and the cluster:

        kubectl config use-context kubernetes-admin@example-cluster-1

    The output should be similar to the following:

    {{< output >}}
Switched to context "kubernetes-admin@example-cluster-1".
{{</ output>}}

1.  You are now ready to interact with the cluster using `kubectl`. Test the ability to interact with the cluster by retrieving a list of Pods. Use the `get pods` command with the `-A` flag to see all pods running across all namespaces:

        kubectl get pods -A

    The output should be similar to the following:

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
