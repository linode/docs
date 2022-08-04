---
slug: how-to-migrate-from-k8s-alpha-to-terraform
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: "The Linode k8s-alpha CLI tool is deprecated. This guide will help you migrate from the k8s-alpha CLI to Terraform."
keywords: ['kubernetes','k8s','beginner','architecture','migrate','terraform','k8s-alpha']
tags: ["linode platform","kubernetes","automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-01-14
modified_by:
  name: Linode
image: L_Migratefromk8s-alphaCLItoTerraform.png
title: "How to Migrate from k8s-alpha CLI to Terraform"
h1_title: "Migrating from k8s-alpha CLI to Terraform"
enable_h1: true
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
- '[Beginners Guide to Terraform](/docs/guides/beginners-guide-to-terraform/)'
- '[Using Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/)'
aliases: ['/kubernetes/how-to-migrate-from-k8s-alpha-to-terraform/']
---

The [k8s-alpha CLI](/docs/guides/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) is deprecated. On **March 31st, 2020**, it will be **removed** from the [linode-cli](https://github.com/linode/linode-cli). After March 31, 2020, you will no longer be able to create or manage clusters created by the k8s-alpha CLI plugin, however, you will still be able to successfully manage your clusters using the [Kubernetes Terraform installer for Linode Instances](https://github.com/linode/terraform-linode-k8s).

## In This Guide
You will use the Kubernetes Terraform installer for Linode Instances to continue to manage and support clusters created using the k8s-alpha CLI plugin following the EOL date and beyond. You will learn how to:

- [Manage clusters](#manage-k8s-alpha-clusters) created with the k8s-alpha CLI following its deprecation.
- [Delete clusters](#delete-a-cluster) using Terraform.
- [Create clusters](#create-a-cluster) using Terraform.

## Manage k8s-alpha Clusters

The k8s-alpha CLI plugin was based on [Terraform](https://www.terraform.io). As a result, it created a number of Terraform configuration files whenever it created a cluster. These Terraform files are found within the `.k8s-alpha-linode` directory. You can change into this directory using the following syntax:

    cd $HOME/.k8s-alpha-linode

If you list the contents of this directory, you will see a subdirectory for each of the clusters you've created with the k8s-alpha CLI plugin. For any of your clusters, contents of these subdirectories will be as follows:

{{< output >}}
drwxr-xr-x  5 username  staff   160 Dec 11 08:10 .terraform
-rw-r--r--  1 username  staff   705 Dec 11 08:10 cluster.tf
-rw-r--r--  1 username  staff  5456 Dec 11 08:14 example-cluster.conf
-rw-r--r--  1 username  staff  5488 Dec 11 08:16 example-cluster_new.conf
drwxr-xr-x  3 username  staff    96 Dec 11 08:10 terraform.tfstate.d
{{</ output >}}

- Both of the `.conf` files are kubeconfig files for this cluster.
- `terraform.tfstate.d` is a Terraform state directory.
- `.terraform` is a hidden directory which contains Terraform configuration files.
- `cluster.tf` is the Terraform module file. This is the most important file here because it will allow you to scale, upgrade, and delete your cluster.

{{< note >}}
For more information regarding these files and directories and their contents, see our [Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/)
{{< /note >}}

### Scale a Cluster

1.  Open `cluster.tf` with the text editor of your choice. The contents will be similar to the following:

    {{< file "cluster.tf" >}}
variable "server_type_node" {
  default = "g6-standard-2"
}
variable "nodes" {
  default = 3
}
variable "server_type_master" {
  default = "g6-standard-2"
}
variable "region" {
  default = "us-east"
}
variable "ssh_public_key" {
  default = "/Users/username/.ssh/id_rsa.pub"
}
module "k8s" {
  source  = "git::https://github.com/linode/terraform-linode-k8s.git?ref=for-cli"

  linode_token = "<your api token>"

  linode_group = "kabZmZ3TA0r-mycluster"

  server_type_node = "${var.server_type_node}"

  nodes = "${var.nodes}"

  server_type_master = "${var.server_type_master}"

  region = "${var.region}"

  ssh_public_key = "${var.ssh_public_key}"
}
{{< /file >}}

1.  To scale your cluster, edit the value of the `nodes` variable. To resize the number of nodes from `3` to `5`, make the following edit and save your changes:

        variable "nodes" {
          default = 5
        }

1.  Once your edit is made, move back to the `/.k8s-alpha-linode/clustername` directory and apply your changes with Terraform:

        terraform apply

    {{< note >}}
You may need to use the original Terraform version used to deploy the cluster (either Terraform 0.11.X or Terraform 0.12.X). If you do not, you will see syntax errors.
{{< /note >}}

1.  Once this is completed, you'll see a prompt reviewing your changes and asking if you would like to accept them. To proceed, type `yes` and Terraform will proceed to make the changes. This process may take a few moments.

    {{< note >}}
When prompted, you may notice that one item in your plan is marked as `destroy`. This is generally a "null resource" or a local script execution and is not indicative of an unintended change.
{{</ note >}}

1.  After Terraform has finished, your cluster will be resized. To confirm, enter the following command to list all nodes in your cluster, replacing the string `mycluster` with the name of the cluster you edited:

        kubectl --kubeconfig=mycluster.conf get nodes

1.  The output will then list an entry for each node:

    {{< output >}}
kubectl --kubeconfig=mycluster.conf get nodes
NAME             	STATUS   ROLES	  AGE 	  VERSION
mycluster-master-1      Ready	 master   21m 	  v1.13.6
mycluster-node-1 	Ready	 &lt;none&gt;   18m 	  v1.13.6
mycluster-node-2 	Ready	 &lt;none&gt;   18m 	  v1.13.6
mycluster-node-3 	Ready	 &lt;none&gt;   18m 	  v1.13.6
mycluster-node-4 	Ready	 &lt;none&gt;   4m26s   v1.13.6
mycluster-node-5 	Ready	 &lt;none&gt;   4m52s   v1.13.6
{{< /output >}}

### Upgrade a Cluster

You may have noticed that the Terraform module file, `cluster.tf`, refers to a specific branch or git commit hash referencing the remote Kubernetes Terraform installer for Linode Instances module on GitHub. The following section will outline how to upgrade your cluster to the latest version.

For example, your `source` variable may have a value that points to the git branch ref `for-cli`. To perform an upgrade this must point to the latest commit history hash.

1.  Visit the branch of the Terraform module you're using on [Github](https://github.com/linode/terraform-linode-k8s/commits/for-cli). Note the commit history and copy the latest hash by clicking on the clipboard next to the hash of the most recent commit. At the time of this writing, the most recent hash is as follows:

    {{< output >}}
5e68ff7beee9c36aa4a4f5599f3973f753b1cd9e
{{< /output >}}

1.  Edit `cluster.tf` to prepare for the upgrade. Update the following section using the hash you copied to appear as follows:

    {{< file "cluster.tf" >}}
source = "git::https://github.com/linode/terraform-linode-k8s.git?ref=5e68ff7beee9c36aa4a4f5599f3973f753b1cd9e"
{{< /file >}}

1.  To apply these changes, re-initialize the module by running the following command:

        terraform init

1.  Once this has completed, apply your changes with the following command:

        terraform apply

    {{< note >}}
Depending on the changes that have been configured, you may or may not see the upgrade perform actions. For example, in this case, because the only change was to the Kubernetes version, no actions were taken.
{{< /note >}}

### Delete a Cluster

To destroy a cluster, navigate to the directory containing your cluster's files, and enter the `terraform destroy` command:

    cd ~/.k8s-alpha-linode/mycluster
    terraform destroy

Terraform will prompt you to confirm the action, and on confirmation will proceed to destroy all associated resources. If this process is interrupted for any reason, you can run the command again at any time to complete the process.

## Create a Cluster

1.  Create a new directory to house the new cluster's configuration files in the `~/.k8s-alpha-linode` directory. In this example the cluster name is `mynewcluster`:

        cd ~/.k8s-alpha-linode
        mkdir mynewcluster

1.  Create a Terraform module file in this new directory called `cluster.tf` with your desired configuration. Replace the values for the variables `ssh_public_key` and `linode_token` with your own unique values and feel free to change the configuration values for the cluster itself. The example configuration below will create a cluster with a 4GB master, with a node pool with three 4GB Linodes, hosted in the us-east region:

    {{< file "cluster.tf" >}}
variable "server_type_node" {
  default = "g6-standard-2"
}
variable "nodes" {
  default = 3
}
variable "server_type_master" {
  default = "g6-standard-2"
}
variable "region" {
  default = "us-east"
}
variable "ssh_public_key" {
  default = "/Users/username/.ssh/id_rsa.pub"
}
module "k8s" {
  source  = "git::https://github.com/linode/terraform-linode-k8s.git?ref=for-cli"

  linode_token = "<your api token>"

  linode_group = "mynewcluster"

  server_type_node = "${var.server_type_node}"

  nodes = "${var.nodes}"

  server_type_master = "${var.server_type_master}"

  region = "${var.region}"

  ssh_public_key = "${var.ssh_public_key}"
}
{{< /file >}}

1.  Initialize and apply your new Terraform configuration:

        terraform workspace new mynewcluster
        terraform init
        terraform apply

1.  When prompted, review your changes and enter `yes` to continue.

1.  Once completed, you'll see a kubeconfig file, `mynewcluster.conf`, in this directory.

1.  To complete your deployment, you will use this kubeconfig file and export it using the following syntax:

        export KUBECONFIG=$(pwd)/mynewcluster.conf
        kubectl get pods --all-namespaces

1.  Once completed, you should see your new cluster active and available with similar output:

    {{< output >}}
NAMESPACE     NAME                                            READY   STATUS    RESTARTS   AGE
kube-system   calico-node-4kp2d                               2/2     Running   0          22m
kube-system   calico-node-84fj7                               2/2     Running   0          21m
kube-system   calico-node-nnns7                               2/2     Running   0          21m
kube-system   calico-node-xfkvs                               2/2     Running   0          23m
kube-system   ccm-linode-c66gk                                1/1     Running   0          23m
kube-system   coredns-54ff9cd656-jqszt                        1/1     Running   0          23m
kube-system   coredns-54ff9cd656-zvgbd                        1/1     Running   0          23m
kube-system   csi-linode-controller-0                         3/3     Running   0          23m
kube-system   csi-linode-node-2tbcd                           2/2     Running   0          21m
kube-system   csi-linode-node-gfvgx                           2/2     Running   0          21m
kube-system   csi-linode-node-lbt5s                           2/2     Running   0          21m
kube-system   etcd-mynewcluster-master-1                      1/1     Running   0          22m
kube-system   external-dns-d4cfd5855-25x65                    1/1     Running   0          23m
kube-system   kube-apiserver-mynewcluster-master-1            1/1     Running   0          22m
kube-system   kube-controller-manager-mynewcluster-master-1   1/1     Running   0          22m
kube-system   kube-proxy-29sgx                                1/1     Running   0          21m
kube-system   kube-proxy-5w78s                                1/1     Running   0          22m
kube-system   kube-proxy-7ptxp                                1/1     Running   0          21m
kube-system   kube-proxy-7v8pr                                1/1     Running   0          23m
kube-system   kube-scheduler-mynewcluster-master-1            1/1     Running   0          22m
kube-system   kubernetes-dashboard-57df4db6b-rtzvm            1/1     Running   0          23m
kube-system   metrics-server-68d85f76bb-68bl5                 1/1     Running   0          23m
{{</ output >}}
