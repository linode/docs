---
slug: deploy-packer-image-with-terraform
author:
  name: Linode Community
  email: docs@linode.com
description: "Packer automates the process of developing machine images, and Terraform automates the provisioning of infrastructure. Not surprisingly, combining the two can give you a full and robust chain for automating deployments, including CI/CD. Through this tutorial, learn what you need to put these tools together for your infrastructure."
og_description: "Packer automates the process of developing machine images, and Terraform automates the provisioning of infrastructure. Not surprisingly, combining the two can give you a full and robust chain for automating deployments, including CI/CD. Through this tutorial, learn what you need to put these tools together for your infrastructure."
keywords: ['packer terraform provider','terraform packer resource','linode packer']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-10-25
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

### Installing Packer

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

### Installing Terraform

Terraform's installation process likewise varies depending on your operating system. Refer to HashiCorp's [official documentation](https://learn.hashicorp.com/tutorials/terraform/install-cli) on installing the Terraform CLI.

You can also refer to the section on installing Terraform in our guide [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform).

Afterward, you can verify your installation with:

    terraform -version

{{< output >}}
{{< /output >}}

## How to Build a Packer Image

This tutorial relies on using a Linode image built with Packer. That gives you a ready system configuration, streamlining the provisioning process.

To get started, follow along with our guide on [How to Use Packer to Build Linode Images](/docs/guides/build-linode-images-with-packer/). By the end, you should have a Packer-built image deployed to your Linode account.

The remaining steps in this tutorial should work no matter what kind of image you built following the guide linked above. However, the example outputs here assume the basic image shown as an example in that guide.

## How to Configure Terraform
Steps for creating a Terraform script
Provisions two Linodes from a Packer image



## How to Provision a Packer Image with Terraform
Execute the steps to deploy the images

## Conclusion
