---
author:
  name: Ryan Syracuse
  email: docs@linode.com
description: 'Migrating From k8s to Terraform '
keywords: ['kubernetes','k8s','beginner','architecture']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-01-14
modified_by:
  name: Linode
title: "Migrating From k8s to Terraform"
contributor:
  name: Linode
concentrations: ["Kubernetes"]
external_resources:
- '[Kubernetes Concepts Documentation](https://kubernetes.io/docs/concepts/)'
- '[Beginners Guide to Terraform](https://www.linode.com/docs/applications/configuration-management/beginners-guide-to-terraform)'
- '[Using Terraform to Provision Linode Environments](https://www.linode.com/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/)'
---

## k8s Deprecation

On **March 31st, 2020**, the [k8s-alpha CLI](https://www.linode.com/docs/kubernetes/how-to-deploy-kubernetes-on-linode-with-k8s-alpha-cli/) will be **removed and deprecated** from the linode-cli. Once this deprecation date has passed, you will no longer be able to create or manage clusters created by the linode-cli, however you  can still successfully manage your clusters using [Terraform](https://www.terraform.io/) directly to the same effect.

In this guide, we'll focus on how you can use Terraform to continue managing and supporting clusters created using the k8s-alpha CLI following the EOL date and beyond. You will learn how to:

- Manage clusters created with the k8s-alpha CLI following it's deprecation.
- Create Clusters using Terraform
- Delete Clusters using Terraform

## Manage Clusters created with k8s-alpha CLI

The k8s-alpha CLI is based on Terraform, and as a result creates a number of Terraform configuration files whenever creating a cluster using it. Any of these terraform files can be found within the `.k8s-alpha` directory. You can change into this directory using the following syntax:

    cd $HOME/.k8s-alpha-linode

If you list the contents of this directory, you will see a subdirectory for each of the clusters you've created with the k8s-alpha CLI. For any of your clusters, contents of these subdirectories will be as follows:

- `example-cluster.conf`
- `example-cluster_new.conf`
- `terraform.tfstate.d`
- `cluster.tf`
- `.terraform`

Both of the `.conf` files are kubeconfig files for this cluster, `terraform.tfstate.d`  is a terraform state directory, `.terraform` is a hidden directory which contains terraform configuration files, and `cluster.tf` contains the terraform module file. The most important file to take note of is `cluster.tf` which will allow you to scale, upgrade, or delete your cluster.

{{< note >}}
For more information regarding these files and directories and their contents, see our [Beginner's Guide to Terraform](/applications/configuration-management/beginners-guide-to-terraform/)
{{< /note >}}

## Scaling Your Cluster

To scale your cluster, we'll want to edit `cluster-tf` with a code editor of your choice. The contents will be similar to the following:

{{< file "rbac-config.yaml" >}}

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

To scale your cluster, you can change the value of the "nodes" variable. To resize the number of nodes from `3` to `5`, you would just need to make the following edit and save your changes:

    variable "nodes" {
    default = 5
    }

Once your edit is made, move back to your `/.k8s-alpha-linode/clustername` directory and apply your changes with terraform:

    terraform apply

{{< note >}}
You may need to use the terraform version originally used to deploy the cluster (either Terraform 0.11.X or Terraform 0.12.X) If you do not, you will see syntax errors.
{{< /note >}}

Once this is completed, you'll see a prompt reviewing your changes and asking if you would like to accept them. To proceed, type `yes`and terraform will proceed to make changes. This process may take a few moments.

{{< note >}}
When prompted, you may notice that one item in your plan is marked as `destroy`. This is generally a "null resource" or a local script execution and is not indicative of an unintended change.
{{</ note >}}

After terraform has finished, your cluster will be resized. To confirm, enter the following command to list all nodes in your cluster, replacing the string `mycluster` with the name of the cluster you edited:

    kubectl --kubeconfig=mycluster.conf get nodes

The output will then list an entry for each node:

{{< output >}}
kubectl --kubeconfig=mycluster.conf get nodes
NAME             	STATUS   ROLES	AGE 	VERSION
mycluster-master-1   Ready	master   21m 	v1.13.6
mycluster-node-1 	Ready	<none>   18m 	v1.13.6
mycluster-node-2 	Ready	<none>   18m 	v1.13.6
mycluster-node-3 	Ready	<none>   18m 	v1.13.6
mycluster-node-4 	Ready	<none>   4m26s   v1.13.6
mycluster-node-5 	Ready	<none>   4m52s   v1.13.6
{{< /output >}}


## Upgrading Your Cluster

You may have noticed that the Terraform module `cluster.tf` refers to a specific branch and git commit hash referencing a remote Terraform module on GitHub. The following section will outline how to upgrade your cluster to the latest version of this module.

To begin, visit the branch of the Terraform module you're using on [Github](https://github.com/linode/terraform-linode-k8s/tree/for-cli). Note the commit history and copy the latest hash by clicking on the clipboard next to the hash of the most recent commit. At the time of this writing, the most recent hash is as follows:

{{< output >}}
5e68ff7beee9c36aa4a4f5599f3973f753b1cd9e
{{< /output >}}

You can now edit `cluster.tf` to prepare for the upgrade. We'll want to edit the following section using our hash to appear as follows:

{{< file "cluster.tf" >}}
source  = "git::https://github.com/linode/terraform-linode-k8s.git?ref=5e68ff7beee9c36aa4a4f5599f3973f753b1cd9e"
{{< /file >}}

To succesfully apply these changes, we'll need to re-init the modules by running the following:

    terraform init

Finally, once this has completed, enter terraform apply:

    terraform apply

{{< note >}}
Depending on the changes that have been configured, you may or may not see the upgrade perform actions. For example, in this case, because the only change was to the kubernetes version, no actions were taken.
{{< /note >}}


## Deleting a Cluster

To destroy a cluster, you just need to navigate to the directory containing your cluster's files, and enter the `terraform destroy` command:

    cd ~/.k8s-alpha-linode/mycluster
    terraform destroy

Terraform will then  prompt you to confirm the action, and on confirmation will proceed to destroy all associated resources. If this process is interrupted for any reason, you can run the command again at any time to complete the process.

## Creating a Cluster

To begin creating a new cluster, create a new directory to house it's configuration files in the `~/.k8s-alpha-linode` directory. In this case we'll name our cluster `mynewcluster`:

    cd ~/.k8s-alpha-linode
    mkdir mynewcluster

Create a Terraform module file in this directory called `cluster.tf` with your desired configuration, replacing the pathh to the public key and your API token with your own unique values. The example configuration below will create a cluster made up of 3 Linodes on our 4GB plan:

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

Initialize and apply your new Terraform configuration:

    terrform workspace new mynewercluster
    terraform init
    terraform apply

When prompted, review your changes and enter `yes` to continue.

Once completed, you'll see a kubeconfig file in this directory. To complete your deployment, we need to take this kubeconfig file and export it using the following syntax:

    export KUBECONFIG=$(pwd)/mynewercluster.conf
    kubectl get pods --all-namespaces

Once completed, you should see your new cluster active and available.







































