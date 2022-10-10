---
slug: how-to-use-linode-packer-builder
author:
  name: Linode Community
  email: docs@linode.com
description: "Packer is a HashiCorp maintained open source tool for creating machine images. Here's how to use it."
og_description: "Packer is a HashiCorp maintained open source tool for creating machine images. Here's how to use it."
keywords: ['packer hashicorp','hashicorp packer','image','machine image','immutable infrastructure','continuous delivery','ansible','ansible playbook','hashicorp terraform','hashicorp']
tags: ["automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified: 2021-05-21
modified_by:
  name: Linode
title: "How to Use the Linode Packer Builder"
h1_title: "Using the Linode Packer Builder to Create Custom Images"
enable_h1: true
contributor:
  name: Linode
aliases: ['/applications/configuration-management/how-to-use-linode-packer-builder/','/applications/configuration-management/packer/how-to-use-linode-packer-builder/']
---

## Introduction to Packer

[Packer](https://www.packer.io/) is a HashiCorp maintained open source tool that is used to create machine images. A machine image provides the operating system, applications, application configurations, and data files that a virtual machine instance will run once it's deployed. Packer can be used in conjunction with common configuration management tools like Chef, Puppet, or Ansible to install software to your Linode and include those configurations into your image.

Packer *templates* store the configuration parameters used for building an image. This standardizes the imaging building process and ensures that everyone using that template file will always create an identical image. For instance, this can help your team maintain an [immutable infrastructure](/docs/guides/what-is-immutable-infrastructure/) within your [continuous delivery](/docs/development/ci/introduction-ci-cd/#what-is-continuous-delivery) pipeline.

## The Linode Packer Builder

In Packer's ecosystem, [builders](https://www.packer.io/docs/builders) are responsible for building a system and generating an image from that system. Packer has multiple different types of builders, with each one being used to create images for a specific platform.

The [Linode builder](https://www.packer.io/docs/builders/linode) integrates Packer with the Linode platform. This allows Packer to deploy a temporary Linode on your account (using an APIv4 token), configure the system on the Linode according to the parameters in the provided template file, and then create an image based on that Linode. Essentially, this is a convenient way to automatically create [Linode Images](/docs/products/tools/images/) on your account that can be used for rapidly deploying new Linodes.

## Before You Begin

This guide will walk you through the process of installing Packer, creating a  template file, building the image, and then deploying that image onto a new Linode. Going further, it will also cover how to use the Ansible tool with Packer. Before you begin, review the following:

1. Ensure you have access to [cURL](https://en.wikipedia.org/wiki/CURL) on your computer.

1. Generate a Linode API v4 access token with read/write permission for both *Linodes* and *Images*. You can follow the [Get an Access Token](/docs/guides/getting-started-with-the-linode-api/#get-an-access-token) section of the [Getting Started with the Linode API](/docs/guides/getting-started-with-the-linode-api/) guide if you do not already have one.

1. *Optional:* Set a variable named `TOKEN` in your shell environment by running the following command. Replace *x* with your own API token.

       export TOKEN=x

    {{< note >}}
Some of the example commands provided in this guide will use this variable. If you do not set this variable, you will need to modify these commands by replacing `$TOKEN` with your API token.
{{< /note >}}

## Installing Packer

The following instructions will install the latest version of Packer on Mac, Ubuntu, or CentOS. For more installation methods, including installing on other operating systems or compiling from source, see [Packer's official documentation](https://www.packer.io/intro/getting-started/install.html) and the [Download Packer](https://www.packer.io/downloads) web page.

### Mac

To install Packer on Mac, [Homebrew](https://brew.sh/) will be used. Run the following commands on your terminal:

    brew tap hashicorp/tap
    brew install hashicorp/tap/packer

### Ubuntu

    curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -
    sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"
    sudo apt-get update && sudo apt-get install packer

### CentOS/RHEL

    sudo yum install -y yum-utils
    sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo
    sudo yum -y install packer

### Verifying the Installation

Verify that Packer was successfully installed by running the command `packer --version`. This should output the version number for this installation of Packer. For reference, this guide was last tested using version 1.7.2.

## Constructing a Template for Packer

Now that Packer is installed, you can make a Packer [template](https://www.packer.io/docs/templates). A template is a file that contains the configurations needed to build a machine image. A template can be formatted in [JSON](https://www.packer.io/docs/templates/legacy_json_templates) or [HCL2](https://www.packer.io/docs/templates/hcl_templates) (Hashicorp Configuration Language). As of Packer v1.7.0, the HCL2 template format is preferred and, as such, will be used in the examples within this guide.

{{< note >}}
The steps in this section will incur charges related to deploying a [1GB Linode](https://www.linode.com/pricing) (Nanode). The Linode will only be deployed for the duration of the time needed to create and snapshot your image and will then be deleted. See our [Billing and Payments](/docs/guides/understanding-billing-and-payments/) guide for details about how hourly billing works.
{{</ note >}}

### Creating the Template File

Create a file named `example.pkr.hcl`. The file can be stored anywhere, though you may want to create a folder called `packer` in your home directory where you can store all of your template files. Edit this file and type or paste in the following content:

{{< file "~/packer/example.pkr.hcl">}}
variable "linode_api_token" {
  type    = string
  default = ""
}

source "linode" "example" {
  image             = "linode/debian10"
  image_description = "This image was created using Packer."
  image_label       = "packer-debian-10"
  instance_label    = "temp-packer-debian-10"
  instance_type     = "g6-nanode-1"
  linode_token      = "${var.linode_api_token}"
  region            = "us-east"
  ssh_username      = "root"
}

build {
  sources = ["source.linode.example"]
}
{{</ file >}}

### Understanding Template Blocks

An HCL2 formatted template file typically contains several [blocks](https://www.packer.io/docs/templates/hcl_templates/blocks). A block can define a variable, specify the exact parameters for a builder plugin, or outline what should happen when the template is built. Here's a few blocks that will be used most templates:

- [Variable Block](#variable-block)
- [Source Block](#source-block-the-linode-builder)
- [Build Block](#build-block)

### Variable Block

A `variable` block contains a single user-defined variable along with any additional parameters or values. There can be multiple variable blocks in a template to define multiple variables. The value of a variable can be used elsewhere in the template through the syntax `${var.variable_name}`, where *variable_name* is the name given to the variable.

This example only contains one variable: `linode_api_token`. The value of this variable is intentionally left blank (`default = ""`). Instead of setting the variable within the template, it will be set through the command-line when running the `packer build` command: `packer build -var linode_api_token=x example.pkr.hcl`, where *x* is your API token.

Learn more about Packer template variables on the [Variables](https://www.packer.io/docs/templates/hcl_templates/variables) page of Packer's documentation.

### Source Block (the Linode Builder)

A `source` block defines the parameters for a builder plugin. These sources can then be used within the `build` block. Multiple sources can be defined in a template, allowing you to potentially create multiple images for multiple platforms. A full list of available builders can be found on the [Builders](https://www.packer.io/docs/builders) page of Packer's documentation.

The starting line of each `source` block will contain the builder plugin to be used as well as the name given to this particular source in the template. For instance, the starting line for the source in this example (`source "linode" "example" {`) specifies that the Linode builder will be used and this source will be named "example".

#### Parameters for the Linode Builder

This example uses the Linode Packer builder as a source. Each of the parameters within the `source` block are outlined on the [Linode Builder](https://www.packer.io/docs/builders/linode) page within Packer's documentation.

- `image`: The ID of the "starter" image to use. This can be one of the official Linode images or any private custom images on your account. In this example, we'll use `linode/debian10` to specify the official Linode Debian 10 image. You can view all the images available to you by running the following curl command:

      curl -H "Authorization: Bearer $TOKEN" https://api.linode.com/v4/images

- `image_label` (optional): The label for the new custom image this template will generate.
- `image_description` (optional): A brief description for the new custom image.
- `instance_label` (optional): The label for the temporary Linode that Packer will deploy in order to create the new image.
- `instance_type` The ID of the instance type for this temporary Linode. This template specifies `g6-nanode-1`, which is the ID for a 1GB Linode (a Nanode). In most cases, a Nanode should work well for generating images as it comes with 25GB of disk space. You can view all of the Linode types by running the following curl command:

      curl https://api.linode.com/v4/linode/types

- `linode_token`: The Linode API Personal Access Token that is used to provider Packer with access to your account. This is set to `${var.linode_api_token}` in the template since we're going to use a command-line variable to provide this token rather than saving it directly in the template.
- `region`: The ID of the data center. In this template, the ID for the Newark data center is used: `us-east`. You can view all of the regions by running the following curl command:

      curl https://api.linode.com/v4/regions

### Build Block

The `build` block tells Packer what to do when the template is built. This will reference a `source` and optionally specify a `provisioner` or `post-processor`.

## Building the Image

After the template file has been saved with your desired parameters, you're now ready to build the image.

1. First, validate the template by running the `packer validate` command below. If you did not set TOKEN as a variable in your shell environment, replace *$TOKEN* with your own Linode API token. If successful, no errors will be given.

       packer validate -var linode_api_token=$TOKEN example.pkr.hcl

      {{< note >}}
  To learn how to securely store and use your API v4 token, see the [Vault](https://www.packer.io/docs/templates/hcl_templates/functions/contextual/vault) section of Packer's documentation.
      {{</ note >}}

1. Build the image by running the `packer build` command below. Just like in the last step, if you did not set TOKEN as a variable in your shell environment, replace *$TOKEN* with your own Linode API token. This process may take a few minutes to complete.

       packer build -var linode_api_token=$TOKEN example.pkr.hcl

      The output of this command will outline each process that Packer goes through. Once finished, the last line will provide you with the ID for the new custom image.

## Deploying a Linode with the New Image

Once the Packer build process completes, a new [Custom Image](/docs/products/tools/images/) will appear on your account. This image can be deployed a few ways:

- **Cloud Manager:** Use the Cloud Manager to deploy a Custom Image by following the [Deploy an Image to a New Compute Instance](/docs/products/tools/images/guides/deploy-image-to-new-linode/) guide.

- **Linode CLI:** Use the Linode CLI through the command-line by following the [Using the Linode CLI](/docs/products/tools/cli/get-started/) guide. The [Linode Instances](/docs/products/tools/cli/guides/linode-instances/) guide provides example commands. The command below will deploy a new Linode in the Newark data center. Replace *mypassword* with the root password you'd like to use and *linode/debian10* with the ID of your new image.

      linode-cli linodes create --root_pass mypassword --region us-east --image linode/debian10

- **Linode APIv4:** Use the Linode API to programmatically create a new Linode by reviewing the documentation outlined under [API > Linode Instances > Linode Create](/docs/api/linode-instances/#linode-create). The following example curl command will deploy a 1GB Linode (Nanode) to the Newark data center. Ensure you replace any necessary parameters, including replacing `linode/debain10` with your Custom Image's ID and assigning your own `root_pass` and `label`.

      curl -H "Content-Type: application/json" \
          -H "Authorization: Bearer $TOKEN" \
          -X POST -d '{
            "image": "private/7550080",
            "root_pass": "aComplexP@ssword",
            "booted": true,
            "label": "my-example-label",
            "type": "g6-nanode-1",
            "region": "us-east"
          }' \
          https://api.linode.com/v4/linode/instances

## Going Further with Ansible

Packer is extremely powerful and customizable tool for creating images. The first template outlined in this guide is a minimalist example and doesn't showcase the true potential of Packer. To take things further, this section will cover integrating Packer with Ansible. Ansible is one of many different options available for customizing an image in Packer.

Ansible is an automation tool for server provisioning, configuration, and management. Before continuing, follow the [Getting Started With Ansible - Basic Installation and Setup](/docs/guides/getting-started-with-ansible/) guide to install Ansible and familiarize yourself with basic Ansible concepts.

### Creating the Ansible Playbook

An Ansible playbook outlines the tasks and scripts to be run when provisioning a server. You will create a playbook that adds a limited user account on the Linode _before_ Packer creates the final image.

1. Use the [mkpasswd](https://linux.die.net/man/1/mkpasswd) utility (available on many Linux systems) to generate a hashed password. This will be used when configuring Ansible's [user module](https://docs.ansible.com/ansible/latest/modules/user_module.html) for your limited user account.

       mkpasswd --method=sha-512

    You will be prompted to enter a plain-text password and the utility will return a hash of the password.

1. Create the playbook file with the following content. Replace *username* with the username you'd like to add and replace `password` with the password hash generated in the previous step.

    {{< file "~/packer/limited_user_account.yml">}}
---
- hosts: all
  remote_user: root
  vars:
    NORMAL_USER_NAME: 'username'
  tasks:
    - name: "Create a secondary, non-root user"
      user: name={{ NORMAL_USER_NAME }}
            password='$6$eebkauNy4h$peyyL1MTN7F4JKG44R27TTmbXlloDUsjPir/ATJue2bL0u8FBk0VuUvrpsMq6rSSOCm8VSip0QHN8bDaD/M/k/'
            shell=/bin/bash
    - name: Add remote authorized key to allow future passwordless logins
      authorized_key: user={{ NORMAL_USER_NAME }} key="{{ lookup('file', '~/.ssh/id_rsa.pub') }}"
    - name: Add normal user to sudoers
      lineinfile: dest=/etc/sudoers
                  regexp="{{ NORMAL_USER_NAME }} ALL"
                  line="{{ NORMAL_USER_NAME }}"
{{</ file >}}

    This playbook will also add the public SSH key stored on your local computer. If the public key you'd like to use is stored in a location other than `~/.ssh/id_rsa.pub`, you can update that value. Finally, the playbook adds the new system user to the `sudoers` file.

### Modifying or Creating a New Template File

Edit your existing template file or create a new template file with the following content. Specifically, you'll add a `provisioner` block within the `build` block, setting `ansible` as the type of provisioner and providing the location of the playbook file you created.

{{< file "~/packer/ansible-example.pkr.hcl">}}
variable "linode_api_token" {
  type    = string
  default = ""
}

source "linode" "ansible-example" {
  image             = "linode/debian10"
  image_description = "This image was created using Packer."
  image_label       = "packer-advanced-debian-10"
  instance_label    = "temp-packer-debian-10"
  instance_type     = "g6-nanode-1"
  linode_token      = "${var.linode_api_token}"
  region            = "us-east"
  ssh_username      = "root"
}

build {
  sources = ["source.linode.ansible-example"]

  provisioner "ansible" {
    playbook_file = "./limited_user_account.yml"
  }
}
{{</ file >}}

### Understanding the Provisioner Block

A provisioner allows you to further configure your system by completing common system administration tasks, like adding users, installing and configuring software, and more. The example uses Packer's built-in Ansible provider and executes the tasks defined in the local `limited_user_account.yml` playbook. This means your Linode image will also contain anything executed by the playbook. Packer supports several other provisioners, like Chef, Salt, and shell scripts. Learn more about Packer provisioners on the [Provisioner](https://www.packer.io/docs/templates/hcl_templates/blocks/build/provisioner) page of Packer's documentation.

### Building and Deploying the Image

Follow the previous sections for [building the image](#building-the-image) and [deploying the image](#deploying-a-linode-with-the-new-image). Once a new Linode is deployed using the newly created image, you should be able to log in to that Linode over ssh by running the following command. Replace *username* with the username you specified in the Ansible playbook and replace *192.0.2.0* with the IPv4 address of your new Linode.

    ssh username@192.0.2.0

## Next Steps

If you'd like to learn how to use Terraform to deploy Linodes using your Packer created image, you can follow our Terraform guides to get started:

* [A Beginner's Guide to Terraform](/docs/guides/beginners-guide-to-terraform/)
* [Create a Terraform Module](/docs/guides/create-terraform-module/)
* [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/)
* [Introduction to HashiCorp Configuration Language (HCL)](/docs/applications/configuration-management/introduction-to-hcl/)
