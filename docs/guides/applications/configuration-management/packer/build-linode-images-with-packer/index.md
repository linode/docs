---
slug: build-linode-images-with-packer
author:
  name: Linode Community
  email: docs@linode.com
description: "Hashicorp’s Packer lets you automate the process of creating images. And with the Linode Builder, Packer can take care of the process of building images for your Linode instances. In this tutorial, learn how to build Linode images with Packer."
og_description: "Hashicorp’s Packer lets you automate the process of creating images. And with the Linode Builder, Packer can take care of the process of building images for your Linode instances. In this tutorial, learn how to build Linode images with Packer."
keywords: ['packer tutorial','hashicorp packer','packer image builder']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-22
modified_by:
  name: Nathaniel Stickman
title: "How to Use Packer to Build Linode Images"
h1_title: "How to Use Packer to Build Linode Images"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Hashicorp Learn: Packer Tutorials](https://learn.hashicorp.com/packer)'
- '[Packer by Hashicorp: Linode - Builders](https://www.packer.io/plugins/builders/linode)'
---

Packer automates machine image creation, whether for containers or for server instances. These images can serve as ready-made bases for deployments. And with Linode's Packer builder, you have a ready tool for creating images for Linode instances.

Learn in this tutorial how to create a Linode image using Packer. The tutorial covers designing an image using a Packer template and the Linode builder. Then, see how you can build and deploy your image as a new and ready Linode instance.

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

## What Is Packer?

Hashicorp's [Packer](https://www.packer.io/) is an open-source tool for automating the process of creating machine images. Using source configurations, Packer gives you a declarative interface for managing all aspects of an image. Packer sets up the operating system, installs and configures applications, and can have your system's files and data ready in place.

Packer is capable of rendering images for tools like Docker and services like AWS. And, with Linode's custom Packer builder, Packer can create images that are ready to deploy as Linode instances.

Packer accomplishes image creation through templates. Templates, using the Hashicorp Configuration Language, let you define your image through a declarative language. Import plugins, configure sources, and articulate commands to execute. It gives you a highly adaptable process for creating images.

### Packer vs Terraform

Packer and Terraform may seem similar at first. However, each ideally serves a different role in the process of designing, provisioning, and deploying infrastructure. And, in fact, the two tools work exceedingly well when used together.

Packer automates the process of rendering machine images. With Packer, you define the operating system and initial software and configuration for an instance. But once you have done that, the built Packer image can be readily and quickly used to build multiple similar instances.

Terraform, meanwhile, automates the building, provisioning, and altering of infrastructure. It can make use of "provisioners" to take many of the steps taken within a typical Packer template. However, doing so tends to be much less efficient, with the script needing to be executed over and over, for each instance deployed.

Instead, Terraform ideally serves to deploy ready systems. And for that reason Terraform works excellently paired with Packer. Create a Packer image, and Terraform can quickly deploy an infrastructure with numerous instances based on it.

## How to Install Packer

Before getting started with the practical steps in this tutorial, you need to install Packer on a system from which you plan to build the Linode images.

The process for installing Packer varies depending on your operating system. Refer to the [official installation guide](https://learn.hashicorp.com/tutorials/packer/get-started-install-cli) for instructions particular to your operating system.

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

## How to Build a Linode Image with Packer

The rest of this tutorial is devoted to walking your through the process of using Packer to create a Linode image. From creating a basic image to provisioning resources to building and deploying the image, you can find the steps outlined and broken down here.

### Creating a Template with the Linode Builder

Packer images are built using templates. These templates follow the Hashicorp Configuration Language (HCL) format also used by tools like Terraform.

Within the Packer template, you can add plugins, define variables, and create a source. It is from these sources that, ultimately, a template's image is built.

The Linode builder for Packer gives you a plugin for constructing Linode images. After importing the plugin, you can craft a Linode source, defining the characteristics of your Linode image.

To start, the `packer` block imports your required plugins. This is where you import the Linode builder plugin, as shown here:

{{< file "example-linode-image.pkr.hcl" >}}
packer {
  required_plugins {
    linode = {
      version = ">= 1.0.1"
      source  = "github.com/hashicorp/linode"
    }
  }
}
{{< /file >}}

This gives you access to the `linode` source. Below, you can see an example of how you could make an image from it.

{{< file "example-linode-image.pkr.hcl" >}}
# [...]

source "linode" "example-linode-image" {
  image                 = "linode/ubuntu20.04"
  image_description     = "Example Packer Linode Image"
  image_label           = "packer-linode-image-1"
  instance_label        = "packer-linode-1"
  instance_type         = "g6-standard-1"
  linode_token          = "LINODE_API_TOKEN"
  region                = "us-east"
  ssh_username          = "root"
  ssh_private_key_file  = "~/.ssh/id_rsa"
}

build {
  sources = ["source.linode.example-linode-image"]
}
{{< /file >}}

Each field within the `linode` source block defines a component of the image built from the template. Some of these are more apparent than others, and you can see the documentation for all of them on the [Linode builder](https://www.packer.io/plugins/builders/linode) page.

What follows highlights some of the more useful and less apparent of these fields:

- `image` gives the base operating system image to use. Here, the image corresponds to Ubuntu 20.04. See the full list of images [here](https://api.linode.com/v4/linode/images).

- `instance_type` articulates the specification type for the Linode instance used. This example creates a "Linode 2GB" shared CPU instance. Alternatively, you could use `g6-dedicated-4` for a "Dedicated 8GB" instance. See the full list of instance types [here](https://api.linode.com/v4/linode/types).

- `linode_token` provides your Linode API token. Packer needs this to be able to access your Linode account to create the image. You can follow our [Get an API Access Token](/docs/products/tools/linode-api/guides/get-access-token/) guide to generate a personal access token. Be sure to give the token "Read/Write" permissions.

- `region` designates the server region for the resulting Linode instance. The example above puts the instance at the Newark, NJ location. See the full list of regions [here](https://api.linode.com/v4/regions).

Finally, the example above also includes a build block. This block tells packer what sources, and other provisioning features, to pull together to create the template's image.

Right now, this only references the `example-linode-image` designated in the source block. However, you can see what more this block can do in the section on provisioning further on in this tutorial.

For right now, the tutorial holds off on building the image. You can see how to do that a little further on. But first, there is much more that Packer can do to make this image ready to meet your needs.

Initialize your Packer template. This downloads any plugins, etc. you have defined in your template:

    packer init .

{{< output >}}
Installed plugin github.com/hashicorp/linode v1.0.3 in "/home/example-user/.config/packer/plugins/github.com/hashicorp/linode/packer-plugin-linode_v1.0.3_x5.0_linux_amd64"
{{< /output >}}

### Using Variables in a Packer Template

Packer templates can utilize variables. Configuring these can make your template more adaptable and readable.

Each variable first needs to be defined. In this case, you can add the definitions right to the main template file, after the `packer` block. The example below also immediately makes use of these variables within two lines in the `source` block.

{{< file "example-linode-image.pkr.hcl" >}}
# [...]

variable "api_token" {
  type = string
}

variable "ssh_key_location" {
  type      = string
  default   = "~/.ssh/id_rsa"
}

source "linode" "example-linode-image" {
  # [...]
  linode_token          = var.api_token
  # [...]
  ssh_private_key_file  = var.ssh_key_location
}
{{< /file >}}

Each variable declaration has a `description` field to explain the variable and its role. Variables can then have an optional `default` field to define the default value for the variable.

The `ssh_key_location` variable, in this case, has a default that does not need to be changed. So, the template just needs the `api_token` variable assigned.

Variables can be assigned in the command line when building the Packer image from the template. But the typically the more practical approach is to assign variable values in a dedicated file.

Packer automatically reads variables from any files in the template directory named using the `*.auto.pkrvars.hcl` format. For this tutorial, you can add a file named `vars.auto.pkrvars.hcl` to the directory with your Linode image template. Then, give the file a value for the `api_token` variable, like this:

{{< file "vars.auto.pkrvars.hcl" >}}
api_token = "<LINODE_API_TOKEN>"
{{< /file >}}

### Provisioning on the Linode Image

The above is enough to build a basic Linode image, and you could skip to the next two section to see how to do that.

But often you want to build an image with software and configurations provisioning already. Packer can handle such provisioning, which you can lay out in the `build` block.

For this example, the tutorial expands on the Packer template defined in the previous sections. It uses the `shell` provisioner to execute a series of shell commands on the instance before rendering the image.

The commands here install NGINX and provide some basic configuration for running it on the image. Follow along with the comments in the code below to get a breakdown of what each part is doing.

{{< file "example-linode-image.pkr.hcl" >}}
# [...]

build {
  sources = ["source.linode.example"]

  provisioner "shell" {
    inline = [
      # Update the system.
      "apt-get update -qq",

      # Configure the firewall rules.
      "ufw allow http",
      "ufw enable --force",
      "ufw reload",

      # Install NGINX.
      "apt-get install -qq nginx",

      # Ensure NGINX runs at system startup.
      "systemctl enable nginx",

      # Restart the NGINX service; this loads any configuration changes you
      # choose to implement above.
      "systemctl restart nginx",
    ]
  }
}
{{< /file >}}

Because this runs shell commands on the instance, you have a high level of control and flexibility in defining how the image gets constructed.

### Verifying and Building the Linode Image

At this point, you are about ready to build a Linode image from your Packer template. First, however, it is good practice to check the template formatting and verify the template against errors.

Packer comes with a function for automatically checking and correcting the format of your template. Packer's template standard is designed to make your templates more readable and, consequently, easier to maintain. If Packer makes any changes to your template files, it outputs the names of each changed file:

    packer fmt .

Now you can check the templates for errors automatically using the `validate` command. Packer notifies you of any errors, giving the files, the locations, and descriptions of the errors:

    packer validate .

{{< output >}}
The configuration is valid.
{{< /output >}}

To finally build your Linode images, you can issue Packer's `build` command in your template directory:

    packer build .

You may see output like the following as the process goes on. And the process itself may take several minutes, depending on the image, the instance, and the kind of provisioning being done.

{{< output >}}
linode.example-linode-image: output will be in this color.

==> linode.example-linode-image: Running builder ...
==> linode.example-linode-image: Using existing SSH private key
==> linode.example-linode-image: Creating Linode...
[...]
==> linode.example-linode-image: Shutting down Linode...
==> linode.example-linode-image: Creating image...
[...]
==> Builds finished. The artifacts of successful builds are:
--> linode.example-linode-image: Linode image: packer-linode-image-1 (private/17691867)
{{< /output >}}

Be sure to keep an eye on the output for any errors or for the process having stalled. You can stop the process with the **Ctrl** + **C** key combination.

Afterward, you can find the new Linode image from the **Images** menu within the Linode Cloud Manager interface.

![Linode manager with the Packer image](linode-packer-image.png)

## How to Deploy a Packer Image to Linode

With the Packer image available on your Linode dashboard, you can deploy the image straight from there.

- To deploy the image to a new instance, follow our guide [Deploy an Image to a New Compute Instance](/docs/products/tools/images/guides/deploy-image-to-new-linode/).

- To deploy the image over an existing instance, follow our guide [Deploy an Image to an Existing Compute Instance](/docs/products/tools/images/guides/deploy-image-to-existing-linode/).

The process is straightforward, and after a short while your instance should be running with the image built from Packer.

Navigate to your **Linodes** dashboard to see the instance listed, along with its status and remote IP address.

![Linode instance up and running from the Packer image](linode-packer-instance.png)

The example image created using the code above sets up an instance of NGINX. And, because of that, you can immediately, with no further setup, see that NGINX configuration in action. In a web browser, visit the new instance's public IP address. You should be greeted by the NGINX welcome screen.

![NGINX welcome screen from the Packer image Linode instance](linode-packer-nginx.png)

## Conclusion

You now have a completed, provisioned Linode image built with Packer. Check out the link below to Hashicorp's repository of Packer tutorial to continue learning what Packer is capable of. This tutorial has covered what you need to set up a Linode image with Packer. Diving into the rest of Packer's features can give you an excellent toolset for fine tuning your images.

The steps above also cover deploying Packer images to Linode. However, when you need to mobilize numerous instances, you could use a tool to automate the process of building an infrastructure from pre-built images.

Terraform works well for that, and Terraform synergizes with Packer to streamline the process of deploying and managing an infrastructure. Take a look at our guide [How to Deploy a Packer Image with Terraform](docs/guides/deploy-packer-with-terraform/) to learn how these two tools can be used effectively together.

Have more questions or want some help getting started? Feel free to reach out to our [Support](https://www.linode.com/support/) team.
