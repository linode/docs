---
slug: deploy-packer-image-with-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: "Packer automates the process of developing machine images, and Terraform automates the provisioning of infrastructure. Not surprisingly, combining the two can give you a full and robust chain for automating deployments, including CI/CD. Through this tutorial, learn what you need to put these tools together for your infrastructure."
og_description: "Packer automates the process of developing machine images, and Terraform automates the provisioning of infrastructure. Not surprisingly, combining the two can give you a full and robust chain for automating deployments, including CI/CD. Through this tutorial, learn what you need to put these tools together for your infrastructure."
keywords: ['packer terraform provider','terraform packer resource','linode packer']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-27
modified_by:
  name: Nathaniel Stickman
title: "How to Deploy a Packer Image with Terraform"
h1_title: "How to Deploy a Packer Image with Terraform"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Terraform - HashiCorp Learn: Provision Infrastructure with Packer](https://learn.hashicorp.com/tutorials/terraform/packer)'
- '[Packer - Use Cases: Integrate with Terraform](https://www.packer.io/use-cases/integrate-with-terraform)'
---

Both the Packer and Terraform tools by HashiCorp stand out for remarkable features around automating infrastructure. Packer automates the process of creating machine images, while Terraform automates the process of provisioning infrastructure.

Learn more about Packer in our [How to Use Packer to Build Linode Images](/docs/guides/build-linode-images-with-packer/) guide. And discover how you can leverage Terraform in our [Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/).

Despite some overlap, the tools have distinct and complimentary emphases. This makes them an effective pair, with Packer used to create image that Terraform then deploys as a complete infrastructure.

In this tutorial, find out how to use Packer and Terraform together for deploying Linode instances. The tutorial use a Linode image built with Packer, deploying several instances based on that image through Linode's Terraform provider.

## Before You Begin

1. Familiarize yourself with our [Getting Started with Linode](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1. This guide uses `sudo` wherever possible. Complete the sections of our [How to Secure Your Server](/docs/security/securing-your-server/) guide to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Update your system.

    - On Debian and Ubuntu, you can do this with:

            sudo apt update && sudo apt upgrade

    - On AlmaLinux, CentOS (8 or later), or Fedora, use:

            sudo dnf upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install the Prerequisites

To get started, you should have a system where you can install both Packer and Terraform. It is from this system that you create the Packer image and orchestrate the Terraform provisioning.

These next sections provide steps for installing both tools on most Linux operating systems, and they provide links to official documentation with instructions for other operating systems.

### Installing Packer

The process for installing Packer depends on your operating system. Refer to the [official installation guide](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli) for instructions particular to your operating system.

On a Debian or Ubuntu system, you should be able to install Packer with the following series of commands:

    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
    sudo apt-get update && sudo apt-get install packer

On a CentOS, Fedora, or other RHEL system, you should be able to install Packer with this series of commands instead:

    sudo dnf install -y dnf-plugins-core
    sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
    sudo dnf -y install packer

In any case, you can afterward verify your installation with the following command to check your Packer version:

    packer --version

{{< output >}}
1.8.3
{{< /output >}}

### Installing Terraform

Terraform's installation process likewise varies depending on your operating system. Refer to HashiCorp's [official documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli) on installing the Terraform CLI.

You can also refer to the section on installing Terraform in our guide [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform).

On Debian and Ubuntu distributions of Linux, you can typically install Terraform with the following series of commands:

    wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
    sudo apt update && sudo apt install terraform

On CentOS, Fedora, and other RHEL systems, on the otherhand, you can usually install Terraform with the commands:

    sudo yum install -y yum-utils
    sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
    sudo yum -y install terraform

Afterward, you can verify your installation with:

    terraform -version

{{< output >}}
Terraform v1.3.3
on linux_amd64
{{< /output >}}

## How to Build a Packer Image

This tutorial relies on using a Linode image built with Packer. That gives you a ready system configuration, streamlining the provisioning process.

Follow along with our guide on [How to Use Packer to Build Linode Images](/docs/guides/build-linode-images-with-packer/). By the end, you should have a Packer-built image deployed to your Linode account.

The remaining steps in this tutorial should work no matter what kind of image you built following the guide linked above.

However, to keep the illustrations clear and consistent, the examples throughout this tutorial assume an image exactly like the one produced by the guide above.

Thus, the image here has the label `packer-linode-image-1`, runs on an Ubuntu 20.04 base, and has NGINX installed.

## How to Configure Terraform

With a Packer image deployed to your Linode account, you can start working on a Terraform script for provisioning an infrastructure with that image.

To more generally learn about deploying Linode instances with Terraform, see our tutorial on how to [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/).

The steps covered in this tutorial are similar, but specifically demonstrate how you can work with custom Linode images.

Before moving ahead, create a directory for your Terraform scripts, and change that to your working directory. This tutorial uses a `linode-terraform` directory in the current user's home directory:

    mkdir ~/linode-terraform
    cd ~/linode-terraform

The rest of the tutorial assumes you are still working out of this directory.

### Setting Up the Linode Provider

Terraform uses providers give you abstractions of APIs. These can facilitate working with various resources on hosts.

Linode has its own Terraform provider, which you can learn more about from its Terraform [provider registry page](https://registry.terraform.io/providers/linode/linode/).

To use the provider, you need to do two things at the start of your Terraform script.

- First, create a `terraform` block, and define the provider as a required provider within it. Terraform uses this to download the requisite files.

- Second, define the provider itself using a `provider` block. The Linode provider here only needs a Linode API token.

Here is what that looks like in practice. This creates a `terraform` and `provider` block in a new `packer-linode.tf` file, which acts as the base of the Terraform process in the rest of this tutorial.

{{< file "packer-linode.tf" >}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.29.3"
    }
  }
}

provider "linode" {
  token = var.token
}
{{< /file >}}

### Assigning Terraform Variables

Above, you can see that the `token` value for the Linode provider uses a variable, `var.token`. Variables, though not required here, make Terraform scripts much more adaptable and manageable.

This tutorial handles the Terraform variables needed by the script with two files.

- Create a `variables.tf` file with the contents shown here. This file defines all of the variables used by the Terraform script. Some of these variables have default values, which Terraform automatically uses if the variables are not otherwise assigned. All of the other variables need to be assigned, which you can see in the next file.

    {{< file "variables.tf" >}}
variable "token" {
  description = "The Linode API Personal Access Token."
}

variable "password" {
  description = "The root password for the Linode instances."
}

variable "ssh_key" {
  description = "The location of an SSH key file for use on the Linode instances."
  default = "~/.ssh/id_rsa.pub"
}

variable "node_count" {
  description = "The number of instances to create."
  default = 1
}

variable "region" {
  description = "The name of the region in which to deploy instances."
  default = "us-east"
}

variable "image_id" {
  description = "The ID for the Linode image to be used in provisioning the instances"
  default = "linode/ubuntu20.04"
}
    {{< /file >}}

- Create a `terraform.tfvars` file. This file, with the `.tfvars` ending, is a place for assigning variable values. Give the file the contents below, replacing the values in arrow brackets (`<...>`) with your actual values.

    {{< file "terraform.tfvars" >}}
token = "<LinodeApiToken>"
password = "<RootPassword>"
node_count = 2
image_id = "private/<LinodeImageId>"
    {{< /file >}}

    The `<LinodeApiToken>` needs to be an API token associated with your Linode account. You can follow our [Get an API Access Token](/docs/products/tools/linode-api/guides/get-access-token/) guide to generate a personal access token. Be sure to give the token "Read/Write" permissions.

Above, you can see a value of `private/<LinodeImageId>` for the `image_id`. This value should identify the ID for the Linode image you created with Packer. All custom Linode images are prefaced with `private/` and conclude with the image's ID.

There are a few ways to get the image ID, and below you can see them listed from most intuitive to least. In all of these examples, `private/17691867` is assumed to be the image ID.

- The image ID appears at the end of the output when you use Packer to create a Linode image. For instance, in the guide on creating a Linode image with Packer, you can find the output:

    {{< output >}}
==> Builds finished. The artifacts of successful builds are:
--> linode.example-linode-image: Linode image: packer-linode-image-1 (private/17691867)
    {{< /output >}}

- The Linode API has an endpoint for listing available images. Using your API token for authentication, the endpoint also lists your custom Linode images.

    A cURL command like the following can be used to list all images available to you, public and private. Replace `$LINODE_API_TOKEN` with your Linode API token:

        curl -H "Authorization: Bearer $LINODE_API_TOKEN" \
            https://api.linode.com/v4/images

    On the command line, the output can be overwhelming, so you may want to use another tool to prettify the JSON response. This has been done with the result shown here.

    {{< output >}}
{
	"pages": 1,
	"data": [{
		"id": "private/17691867",
		"label": "packer-linode-image-1",
		"description": "Example Packer Linode Image",
        // [...]
    {{< /output >}}

- The Linode Cloud Manager does have the image ID, although it is somewhat hidden. Navigate to the **Images** section, from the left menu. In the **Custom Images** list, locate the row for the Packer image. Right-click the row, and use your browser's tool to inspect it.

    You should there find a `<tr>` element with a `data-qa-image-cell` field, which identifies the image's ID:

        <tr class="MuiTableRow-root" aria-label="View Details" data-qa-image-cell="private/<LinodeImageId>" [...]

### Defining the Linode Resource

The next step for the Terraform script is to define the actual resource to be provisioned. In this case, the script needs to provision Linode instances, which can be done using the `linode_instance` resource.

In the `packer-linode.tf` file, below the `provider` block, add a `resource` block using the details shown here.

{{< file "packer-linode.tf" >}}
# [...]

resource "linode_instance" "packer_linode_instance" {
  count = var.node_count
  image = var.image_id
  label = "packer-image-linode-${count.index + 1}"
  group = "packer-image-instances"
  region = var.region
  type = "g6-standard-1"
  authorized_keys = [ chomp(file(var.ssh_key)) ]
  root_pass = var.password

  connection {
    type = "ssh"
    user = "root"
    password = var.password
    host = self.ip_address
  }

  provisioner "remote-exec" {
    inline = [
      # Update the system.
      "apt-get update -qq",

      # Disable password authentication; users can only connect with an SSH key.
      "sed -i '/PasswordAuthentication/d' /etc/ssh/sshd_config",
      "echo \"PasswordAuthentication no\" >> /etc/ssh/sshd_config",

      # Check to make sure NGINX is running.
      "systemctl status nginx --no-pager"
    ]
  }
}
{{< /file >}}

And that covers what you need to provision two Linode instances based on the Packer image. This resource primarily uses the variables configured in the previous section. Through those variables, you have control of things like region and number of instances without having to fiddle with the main script.

The `remote-exec` provisioner, and specifically the `inline` list within it, defines shell commands to be executed on the newly-provisioned instance. The commands here are relatively simple, but this provisioner can give you fine-grained control of operations on the instance.

## How to Provision a Packer Image with Terraform

From here, a handful of Terraform commands are all you need to provision and manage your Linode instances.

Terraform first needs to run some initialization around the script. This installs any prerequisites — specifically the `linode` provider in this case — and sets up Terraform's lock file:

    terraform init

Usually, running Terraform's `plan` command is good practice. With this, Terraform checks your script for immediate errors and provides an outline of the deployment results from it. You can think of it as a light dry run.

    terraform plan

Review the plan, and then, when you are ready, you can provision your instances with the `apply` command. This may take several minutes to process, depending on your systems and the number of instances you are deploying.

    terraform apply

{{< output >}}
linode_instance.packer_linode_instance[0] (remote-exec): Connected!
linode_instance.packer_linode_instance[0] (remote-exec): ● nginx.service - A high performance web server and a reverse proxy server
linode_instance.packer_linode_instance[0] (remote-exec):      Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
linode_instance.packer_linode_instance[0] (remote-exec):      Active: active (running) since Thu 2022-10-27 15:56:42 UTC; 9s ago
[...]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
{{< /output >}}

In the future, whenever you want to remove the instances created with Terraform, you can use the `destroy` command from within your Terraform script directory.

    terraform destroy

As with the `apply` command, you get a preview of the instances and are asked to confirm before the instances are destroyed.

## Conclusion

This tutorial has outlined how you can create a Linode image with Packer and then deploy Linode instances using that image with Terraform. The arrangement provides an efficient setup for provisioning and managing Linode instances. Terraform streamlines the process of provisioning infrastructure, and it is made more efficient using pre-built images from Packer.

The example covered in this tutorial is fairly simple. But the setup can be readily adapted and expanded on to deploy more robust and complex infrastructures. And the automation provided by Packer a Terraform ensure a smoother and more reliable process.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
