---
slug: deploy-packer-image-with-terraform
description: "Packer automates the process of developing machine images, and Terraform automates the provisioning of infrastructure. Not surprisingly, combining the two can give you a full and robust chain for automating deployments, including CI/CD. Through this tutorial, learn what you need to put these tools together for your infrastructure."
keywords: ['packer terraform provider','terraform packer resource','linode packer']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-27
modified: 2022-11-28
modified_by:
  name: Nathaniel Stickman
title: "Deploy a Packer Image with Terraform"
title_meta: "How to Deploy a Packer Image with Terraform"
external_resources:
- '[Terraform - HashiCorp Learn: Provision Infrastructure with Packer](https://learn.hashicorp.com/tutorials/terraform/packer)'
- '[Packer - Use Cases: Integrate with Terraform](https://www.packer.io/use-cases/integrate-with-terraform)'
authors: ["Nathaniel Stickman"]
tags: ["saas"]
---

Both the Packer and Terraform tools by HashiCorp stand out for remarkable infrastructure-automating. Despite some overlap, the tools have distinct and complimentary features. This makes them an effective pair, with Packer used to create images that Terraform then deploys as a complete infrastructure.

Learn more about Packer in our [Using the Linode Packer Builder to Create Custom Images](/docs/guides/how-to-use-linode-packer-builder/) guide. Discover how you can leverage Terraform in our [Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/).

In this tutorial, find out how to use Packer and Terraform together to deploy Linode instances. The tutorial uses the Linode Terraform provider to deploy several instances based on a Linode image built with Packer.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install the Prerequisites

To get started, install both Packer and Terraform on the same system. Below you can find links to installation guides for the two tools, as well as steps covering most Linux operating systems.

### Installing Packer

Packer's installation process varies substantially depending on your operating system. Refer to the [official installation guide](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli) for instructions if your system is not covered here.

```command {title="Debian / Ubuntu"}
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -\
sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
sudo apt-get update && sudo apt-get install packer
```

```command {title="AlmaLinux / CentOS Stream / Rocky Linux"}
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install packer
```

```command {title="Fedora"}
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
sudo dnf -y install packer
```

Afterward, verify your installation and display the installed version with the following command:

```command
packer --version
```

```output
1.8.4
```

### Installing Terraform

Terraform's installation process also varies depending on your operating system. Refer to HashiCorp's [official documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli) on installing the Terraform CLI for systems that are not covered here. You can also refer to the section on installing Terraform in our guide [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform).


```command {title="Debian / Ubuntu"}
sudo apt-get update && sudo apt-get install -y gnupg software-properties-common
wget -O- https://apt.releases.hashicorp.com/gpg | gpg --dearmor | sudo tee /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

```command {title="AlmaLinux / CentOS Stream / Rocky Linux"}
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
sudo yum -y install terraform
```

```command {title="Fedora"}
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/fedora/hashicorp.repo
sudo dnf -y install terraform
```

Afterward, verify your installation with:

```command
terraform -version
```

```output
Terraform v1.3.3
on linux_amd64
```

## How to Build a Packer Image

Packer automates the creation of machine images. These images are helpful when looking to streamline your process for provisioning infrastructure. Such images give you a consistent basis for deploying instances.

Moreover, images are much more efficient. Rather than executing a series of installations and commands with each provisioned instance, the provisioning tool can deploy ready-made images.

The examples in this tutorial uses a Linode image built with Packer. Linode has a builder available for Packer, which lets you put together images specifically for a Linode instance.

To do so, follow along with our guide on [Using the Linode Packer Builder to Create Custom Images](/docs/guides/how-to-use-linode-packer-builder/). By the end, you should have a Packer-built image on your Linode account.

The remaining steps in this tutorial should work no matter what kind of image you built following the guide linked above. However, the Packer image used in the examples to follow has the label `packer-linode-image-1`, runs on an Ubuntu 20.04 base, and has NGINX installed.

## How to Configure Terraform

Terraform focuses on automating the provisioning process, allowing you to deploy your infrastructure entirely from code.

To learn more about deploying Linode instances with Terraform, see our tutorial on how to [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/).

This tutorial covers a similar series of steps, but specifically demonstrates how you can work with custom Linode images.

Before moving ahead, create a directory for your Terraform scripts, and change that to your working directory. This tutorial uses the `linode-terraform` directory in the current user's home directory:

```command
mkdir ~/linode-terraform
cd ~/linode-terraform
```

The rest of the tutorial assumes you are working out of this directory.

### Setting Up the Linode Provider

Terraform's providers act as abstractions of APIs, giving Terraform an interface for working with various resources on host platforms.

Linode has its own Terraform provider, which you can learn more about from its Terraform [provider registry page](https://registry.terraform.io/providers/linode/linode/).

To use the provider, you just need a couple of short blocks in a Terraform script.

Create a new Terraform file named `packer-linode.tf`, which acts as the base for this tutorial's Terraform project:

```command
nano packer-linode.tf
```

Give it the contents shown here:

```file {title="packer-linode.tf"}
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
```

The `terraform` block starts the project by indicating its required providers (e.g. Linode). The `provider` block then starts the Linode provider. The `token` argument allows the provider to authenticate its connection to the Linode API.

When done, press <kbd>Ctrl</kbd> + <kbd>X</kbd> to exit nano, <kbd>Y</kbd> to save, and <kbd>Enter</kbd> to confirm.

### Assigning Terraform Variables

Above, you can see that the `token` value for the Linode provider uses the `var.token` variable. Although not required, variables make Terraform scripts much more adaptable and manageable.

This tutorial handles variables using two files.

1. First, create a `variables.tf` file:

    ```command
    nano variables.tf
    ```

    Now fill it with the contents shown below. This file defines all the variables for the Terraform project. Some of these variables have default values, which Terraform automatically uses if not otherwise assigned. Other variables need to be assigned, which you can see in the next file.

    ```file {title="variables.tf"}
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
    ```

    When done, press <kbd>Ctrl</kbd> + <kbd>X</kbd> to exit nano, <kbd>Y</kbd> to save, and <kbd>Enter</kbd> to confirm.

1. Now create a `terraform.tfvars` file:

    ```command
    nano terraform.tfvars
    ```

    This file, with the `.tfvars` ending, is a place for assigning variable values. Give the file the contents below, replacing the values in arrow brackets (`<...>`) with your actual values:

    ```file {title="terraform.tfvars"}
    token = "<LinodeApiToken>"
    password = "<RootPassword>"
    node_count = 2
    image_id = "private/<LinodeImageId>"
    ```

    The `<LinodeApiToken>` needs to be an API token associated with your Linode account. You can follow our [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/) guide to generate a personal access token. Be sure to give the token "Read/Write" permissions.

    Above, you can see a value of `private/<LinodeImageId>` for the `image_id`. This value should match the image ID for the Linode image you created with Packer. All custom Linode images are prefaced with `private/` and conclude with the image's ID. In these examples, `private/17691867` is assumed to be the ID for the Linode image built with Packer.

    There are two main ways to get your image ID:

    - The Linode image ID appears at the end of the output when you use Packer to create the image. For instance, in the guide on creating a Linode image with Packer linked above, you can find the output:

        ```output
        ==> Builds finished. The artifacts of successful builds are:
        --> linode.example-linode-image: Linode image: packer-linode-image-1 (private/17691867)
        ```

    - The Linode API has an endpoint for listing available images. The list includes your custom images if you call it with your API token.

        You can use a cURL command to list all images available to you, public and private. Replace `$LINODE_API_TOKEN` with your Linode API token:

        ```command
        curl -H "Authorization: Bearer $LINODE_API_TOKEN" \https://api.linode.com/v4/images
        ```

        The output can be overwhelming in the command line, so you may want to use another tool to prettify the JSON response. This has been done with the result shown here:

        ```output
        {
            "pages": 1,
            "data": [{
                "id": "private/17691867",
                "label": "packer-linode-image-1",
                "description": "Example Packer Linode Image",
                // [...]
        ```

    When done, press <kbd></kbd> + <kbd>X</kbd> to exit nano, <kbd>Y</kbd> to save, and <kbd>Enter</kbd> to confirm.

### Defining the Linode Resource

The next step for the Terraform script is to define the actual resource to be provisioned. In this case, the script needs to provision Linode instances, which can be done using the `linode_instance` resource.

Open the `packer-linode.tf` file created earlier and add the details shown here to the end:

```file {title="packer-linode.tf" linenostart="14"}
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
```

And with that, the Terraform project is ready to provision two Linode instances based on your Packer-built image. Most of the configuration details for the `resource` block are managed by variables. So you shouldn't need to fiddle with much of the `resource` block to adjustment things like the number of instances to provision.

The `remote-exec` provisioner, and specifically the `inline` list within it, is where much of the customization comes in. This block defines shell commands to be executed on the newly provisioned instance. The commands here are relatively simple, but this provisioner can give you fine-grained control of operations on the instance.

## How to Provision a Packer Image with Terraform

From here, a handful of Terraform commands are all you need to provision and manage Linode instances from the Packer-built image.

First, Terraform needs to run some initialization around the script. This installs any prerequisites, specifically the `linode` provider in this example, and sets up Terraform's lock file.

```command
terraform init
```

Running Terraform's `plan` command is also good practice. Here, Terraform checks your script for immediate errors and provides an outline of the projected resources to deploy. You can think of it as a light dry run.

```command
terraform plan
```

Review the plan, and when ready, provision your instances with the `apply` command. This may take several minutes to process, depending on your systems and the number of instances being deployed.

```command
terraform apply
```

```output
linode_instance.packer_linode_instance[0] (remote-exec): Connected!
linode_instance.packer_linode_instance[0] (remote-exec): ● nginx.service - A high performance web server and a reverse proxy server
linode_instance.packer_linode_instance[0] (remote-exec):      Loaded: loaded (/lib/systemd/system/nginx.service; enabled; vendor preset: enabled)
linode_instance.packer_linode_instance[0] (remote-exec):      Active: active (running) since Thu 2022-10-27 15:56:42 UTC; 9s ago
[...]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

In the future, whenever you want to remove the instances created with Terraform, you can use the `destroy` command from within your Terraform script directory.

```command
terraform destroy
```

As with the `apply` command, you get a preview of the instances and are asked to confirm before the instances are destroyed.

## Conclusion

This tutorial outlined how to use Terraform to deploy Linode instances built with a Packer image. This arrangement provides an efficient setup for provisioning and managing Linode instances. Terraform streamlines the process of provisioning infrastructure, and it is made even more efficient using pre-built images from Packer.

The example covered in this tutorial is fairly simple. But the setup can be readily adapted and expanded on to deploy more robust and complex infrastructures.