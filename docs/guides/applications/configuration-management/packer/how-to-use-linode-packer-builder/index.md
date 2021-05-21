---
slug: how-to-use-linode-packer-builder
author:
  name: Linode Community
  email: docs@linode.com
description: 'Packer is a HashiCorp maintained open source tool that is used to create machine images. Using a single source configuration, you can generate identical machine images. Packer can then be used to install those images to your Linode.'
og_description: 'Packer is a HashiCorp maintained open source tool that is used to create machine images. Using a single source configuration, you can generate identical machine images. Packer can then be used to install those images to your Linode.'
keywords: ['packer hashicorp','hashicorp packer','image','machine image','immutable infrastructure','continuous delivery','ansible','ansible playbook','hashicorp terraform','hashicorp']
tags: ["automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-11-12
modified: 2021-05-21
modified_by:
  name: Linode
title: "How to Use the Linode Packer Builder"
h1_title: "Use the Linode Packer Builder to Create Linode Images"
contributor:
  name: Linode
aliases: ['/applications/configuration-management/how-to-use-linode-packer-builder/','/applications/configuration-management/packer/how-to-use-linode-packer-builder/']
---

## Introduction

### What is Packer?

Packer is a HashiCorp maintained open source tool that is used to create machine images. A machine image provides the operating system, applications, application configurations, and data files that a virtual machine instance will run once it's deployed. Using a single source configuration, you can generate identical machine images. Packer can be used in conjunction with common configuration management tools like Chef, Puppet, or Ansible to install software to your Linode and include those configurations into your image.

You can share your image template across your team to ensure everyone is using a uniform development and testing environment. This process will help your team maintain an [immutable infrastructure](/docs/development/ci/what-is-immutable-infrastructure/) within your [continuous delivery](/docs/development/ci/introduction-ci-cd/#what-is-continuous-delivery) pipeline.

In this guide you will complete the following steps:

* [Install Packer](#install-packer-on-ubuntu-18-04) on your computer.
* [Create a Packer image template](#create-your-template). Optionally, the template will execute system configurations using Packer's Ansible provisioner.
* [Generate a Linode Image](#create-your-linode-image) from your Packer template.
* [Deploy a Linode](#deploy-a-linode-with-your-new-image) from your stored Packer image.

### What is the Linode Packer Builder?

In Packer's ecosystem, [builders](https://www.packer.io/docs/builders) are responsible for *building* a system and then generating an image from that system. Packer has multiple different types of builders, with each one being used to create images for a specific platform. For integration with [Linode Images](/docs/products/tools/images/), this guide will use the [Linode builder](https://www.packer.io/docs/builders/linode).

When the Linode Packer builder runs, it's able to access your Linode account through the API token you created. It will use the template specified in the `build` command to create a Linode based on the image, plan type, scripts, and other parameters defined within that template. After Packer has successfully built and configured the Linode, a custom image based on that Linode's main disk will be created. This custom image is stored privately on your Linode account and can be used when creating new Linodes.

{{< note >}}
The Packer builder does not manage images. Once it creates an image, it will be stored on your Linode account and can be accessed and used as needed from the Linode Cloud Manager, via Linode's API v4, or using third-party tools like Terraform. Linode Images are limited to 2GB per Image and 3 Images per account.
{{</ note >}}

## Before You Begin

1. Ensure you have access to [cURL](https://en.wikipedia.org/wiki/CURL) on your computer.

1. Generate a Linode API v4 access token with permission to read and write Linodes. You can follow the [Get an Access Token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token) section of the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api/) guide if you do not already have one.

    {{< note >}}
The example cURL commands in this guide will refer to a `$TOKEN` environment variable. For example:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/images

To set this variable up in your terminal, run:

    export TOKEN='<your-Linode-APIv4-token>'

If you do not do this, you will need to alter these commands so that your API token is inserted wherever `$TOKEN` appears.
{{< /note >}}

1. [Create an SSH authentication key-pair](/docs/security/securing-your-server/#create-an-authentication-key-pair) if your computer does not already have one. Your SSH public key will be added to your image via an Ansible module.

1. Install Ansible on your computer and familiarize yourself with basic Ansible concepts (optional). Using the [Getting Started With Ansible - Basic Installation and Setup](/docs/applications/configuration-management/getting-started-with-ansible/) guide, follow the steps in the [Install Ansible](/docs/applications/configuration-management/getting-started-with-ansible/#install-ansible) section.

## Installing Packer

The following instructions will install the latest version of Packer on Mac, Ubuntu, or CentOS. For more installation methods, including installing on other operating systems or compiling from source, see [Packer's official documentation](https://www.packer.io/intro/getting-started/install.html) and the [Download Packer](https://www.packer.io/downloads) webpage.

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

### Verifing the Installation

Verify that Packer was successfully installed by running the command `packer --version`. This should output the version number for this installation of Packer. For reference, this guide was last tested using version 1.7.2.

## Creating a Template for Packer

Now that Packer is installed, you can make a Packer [template](https://www.packer.io/docs/templates). A template is a file that contains the configurations needed to build a machine image. A template can be formatted in [JSON](https://www.packer.io/docs/templates/legacy_json_templates) or [HCL2](https://www.packer.io/docs/templates/hcl_templates) (Hashicorp Configuration Language). As of Packer v1.7.0, the HCL2 template format is preferred and, as such, will be used in the examples within this guide.

In this section, you will create a template that uses the Linode Packer builder to generate an image using Debian 10 as its base distribution. The template will also configure your system image with a new limited user account and a public SSH key from your local computer.

{{< note >}}
The steps in this section will incur charges related to deploying a [1GB Linode]((https://www.linode.com/pricing) (Nanode). The Linode will only be deployed for the duration of the time needed to create and snapshot your image and will then be deleted. See our [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for details about [hourly billing](/docs/platform/billing-and-support/billing-and-payments/#how-hourly-billing-works).
{{</ note >}}

### Template Blocks

An HCL2 formatted template file typically contains several [blocks](https://www.packer.io/docs/templates/hcl_templates/blocks). A block can define a variable, specify the exact parameters for a builder plugin, or outline what should happen when the template is built. Here's a few blocks that will be used in this tutorial:

- **Variable:** A `variable` block contains a single user-defined variable along with any additional parameters or values. In the section that follows, you will use a command line variable to pass your Linode account's API token to the template. A command line variable is a user-defined variable that's intentionally left blank in the template but will be defined when running the packer `build` command (ex: `-var api_token=x`, where `x` is your API Token).
- **Source:** A `source` block defines the parameters for a builder plugin, such as the Linode Packer builder used in the example below. These sources can then be used within the `build` block. Multiple sources can be defined in a template, along you to potentially create multiple images for multiple platforms.
- **Build:** The `build` block tells Packer what to do when the template is built. This will reference a `source` and optionally specify a `provisioner` or `post-processor`.

    - **provisioners**: (*optional*) with a provisioner you can further configure your system by completing common system administration tasks, like adding users, installing and configuring software, and more. The example uses Packer's built-in Ansible provider and executes the tasks defined in the local `limited_user_account.yml` playbook. This means your Linode image will also contain anything executed by the playbook on your Linode. Packer supports several other [provisioners](https://www.packer.io/docs/provisioners/index.html), like Chef, Salt, and shell scripts.

### Access Linode and Private Images

The Linode Packer Builder requires a Linode Image ID to deploy a disk from. This guide's example will use the image `linode/debian10`, but you can replace it with any other image you prefer. To list the official Linode images and your account's private images, you can curl the Linode API:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/images

### Create the Template File

Create a file named `example.pkr.hcl` with the following content:

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

## Building the Image

You should now have your completed template file and your Ansible Playbook file (optional) and can validate the template and finally, build your image.

1. Validate the template before building your image. Replace the value of `my_linode_token` with your own Linode API v4 token.

        packer validate -var 'my_linode_token=myL0ngT0kenStr1ng' example.json

      If successful, you will see the following:

      {{< output >}}
Template validated successfully.
      {{</ output >}}

      {{< note >}}
  To learn how to securely store and use your API v4 token, see the [Vault Variables](https://www.packer.io/docs/templates/user-variables.html#vault-variables) section of Packer's documentation.
      {{</ note >}}

1. You can now build your final image. Replace the value of `my_linode_token` with your own Linode API v4 token. This process may take a few minutes to complete.

        packer build -var 'my_linode_token=myL0ngT0kenStr1ng' example.json

      The output will provide you with your new private image's ID. In the example output the image ID is `private/7550080`. This image is now available on your Linode account to use as you desire. As an example, in the next section you will use this newly created image to deploy a new 1GB Linode (Nanode) using Linode's API v4.

### Deploy a Linode with the New Image

1. Issue the following curl command to deploy a 1GB Linode (Nanode) to the us-east data center using your new Image to your Linode account. Ensure you replace `private/7550080` with your own Linode Image's ID and assign your own `root_pass` and `label`.

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

    You should receive a similar response from the API:

    {{< output >}}
{"id": 17882092, "created": "2019-10-23T22:47:47", "group": "", "specs": {"gpus": 0, "transfer": 1000, "memory": 1024, "disk": 25600, "vcpus": 1}, "label": "my-example-linode", "updated": "2019-10-23T22:47:47", "watchdog_enabled": true, "image": null, "ipv4": ["192.0.2.0"], "ipv6": "2600:3c03::f03c:92ff:fe98:6d9a/64", "status": "provisioning", "tags": [], "region": "us-east", "backups": {"enabled": false, "schedule": {"window": null, "day": null}}, "hypervisor": "kvm", "type": "g6-nanode-1", "alerts": {"cpu": 90, "network_in": 10, "transfer_quota": 80, "io": 10000, "network_out": 10}}%
    {{</ output >}}

1.  If you used the Ansible provisioner, once your Linode is deployed, you should be able to SSH into your newly deployed Linode using the limited user account you created with the Ansible playbook and your public SSH key. Your Linode's IPv4 address will be available in the API response returned after creating the Linode.

        ssh my-user-name@192.0.2.0

## (Optional) Using Ansible as a Provisioner

Edit your tempalte file and add a `provisioners` section, specifing `ansible` as the type of provisioner as well as the location of the playbook file.

{{< file "~/packer/example.json">}}
{
  "variables": {
    "my_linode_token": ""
  },
  "builders": [{
    "type": "linode",
    "image": "linode/debian9",
    "linode_token": "{{user `my_linode_token` }}",
    "region": "us-east",
    "instance_type": "g6-nanode-1",
    "instance_label": "temp-linode-packer",
    "image_label": "my-private-packer-image",
    "image_description": "My private packer image",
    "ssh_username": "root"
  }],
  "provisioners": [
    {
      "type": "ansible",
      "playbook_file": "./limited_user_account.yml"
    }
  ]
}
{{</ file >}}

The additional system configuration will be completed using Packer's Ansible [*provisioner*](https://www.packer.io/docs/provisioners/index.html) and an example Ansible Playbook. A Packer provisioner is a built-in third-party integration that further configures a machine instance during the boot process and prior to taking the machine's snapshot.

### Create your Ansible Playbook (Optional)

In the previous section you created a Packer template that makes use of an Ansible Playbook to add system configurations to your image. Prior to building your image, you will need to create the referenced `limited_user_account.yml` Playbook. You will complete those steps in this section. If you chose not to use the Ansible provider, you can skip this section.

1. The example Ansible Playbook makes use of Ansible's [user module](https://docs.ansible.com/ansible/latest/modules/user_module.html). This module requires that a hashed value be used for its `password` parameter. Use the `mkpasswd` utility to generate a hashed password that you will use in the next step.

        mkpasswd --method=sha-512

      You will be prompted to enter a plain-text password and the utility will return a hash of the password.

      {{< output >}}
Password:
$6$aISRzCJH4$nNJ/9ywhnH/raHuVCRu/unE7lX.L9ragpWgvD0rknlkbAw0pkLAwkZqlY.ahjj/AAIKo071LUB0BONl.YMsbb0
          {{</ output >}}

1. In your `packer` directory, create a file with the following content. Ensure you replace the value of the `password` parameter with your own hashed password:

    {{< file "~/packer/limited_user_account.yml">}}
---
- hosts: all
  remote_user: root
  vars:
    NORMAL_USER_NAME: 'my-user-name'
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

    * This Playbook will created a limited user account named `my-user-name`. You can replace `my-user-name`, the value of the variable `NORMAL_USER_NAME`, with any system username you'd like to create. It will then add a public SSH key stored on your local computer. If the public key you'd like to use is stored in a location other than `~/.ssh/id_rsa.pub`, you can update that value. Finally, the Playbook adds the new system user to the `sudoers` file.

## Next Steps

If you'd like to learn how to use Terraform to deploy Linodes using your Packer created image, you can follow our Terraform guides to get started:

* [A Beginner's Guide to Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/)
* [Create a Terraform Module](/docs/applications/configuration-management/create-terraform-module/)
* [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/)
* [Introduction to HashiCorp Configuration Language (HCL)](/docs/applications/configuration-management/introduction-to-hcl/)
