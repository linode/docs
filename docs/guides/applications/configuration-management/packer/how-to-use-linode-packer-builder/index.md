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
modified_by:
  name: Linode
title: "How to Use the Linode Packer Builder"
h1_title: "Use the Linode Packer Builder to Create Linode Images"
contributor:
  name: Linode
aliases: ['/applications/configuration-management/how-to-use-linode-packer-builder/','/applications/configuration-management/packer/how-to-use-linode-packer-builder/']
---

## What is Packer?

Packer is a HashiCorp maintained open source tool that is used to create machine images. A machine image provides the operating system, applications, application configurations, and data files that a virtual machine instance will run once it's deployed. Using a single source configuration, you can generate identical machine images. Packer can be used in conjunction with common configuration management tools like Chef, Puppet, or Ansible to install software to your Linode and include those configurations into your image.

In this guide you will complete the following steps:

* [Install Packer](#install-packer-on-ubuntu-18-04) on your computer.
* [Create a Packer image template](#create-your-template). Optionally, the template will execute system configurations using Packer's Ansible provisioner.
* [Generate a Linode Image](#create-your-linode-image) from your Packer template.
* [Deploy a Linode](#deploy-a-linode-with-your-new-image) from your stored Packer image.

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

## The Linode Packer Builder

In Packer's ecosystem, *builders* are responsible for deploying machine instances and generating redeployable images from them. The Linode Packer builder can be used to create a Linode image that can be redeployed to other Linodes. You can share your image template across your team to ensure everyone is using a uniform development and testing environment. This process will help your team maintain an [immutable infrastructure](/docs/development/ci/what-is-immutable-infrastructure/) within your [continuous delivery](/docs/development/ci/introduction-ci-cd/#what-is-continuous-delivery) pipeline.

The Linode Packer builder works in the following way:

* You create a template to define the type of image you want Packer to build.
* Packer uses the template to build the image on a temporary Linode.
* A snapshot of the built image is taken and stored as a private [Linode image](/docs/platform/disk-images/linode-images/).
* The temporary Linode is deleted.
* You can then reuse the private Linode image as desired, for example, by using your image to create Linode instances with [Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/).

## Install Packer

The following instructions will install Packer on Ubuntu 18.04 from a downloaded binary. For more installation methods, including installing on other operating systems or compiling from source, see [Packer's official documentation](https://www.packer.io/intro/getting-started/install.html).

1. Make a Packer project directory in your home directory and then navigate to it:

        mkdir ~/packer
        cd ~/packer

1. Download the precompiled binary for your system from the Packer website. Example `wget` commands are listed using the latest version available at time of publishing (1.4.4). You should inspect the links on the [download page](https://www.packer.io/downloads.html) to see if a newer version is available and update the `wget` commands to use those URLs instead:

    * The 64-bit Linux `.zip` archive

            wget https://releases.hashicorp.com/packer/1.4.4/packer_1.4.4_linux_amd64.zip

    * The SHA256 checksums file

            wget https://releases.hashicorp.com/packer/1.4.4/packer_1.4.4_SHA256SUMS

    * The checksum signature file

            wget https://releases.hashicorp.com/packer/1.4.4/packer_1.4.4_SHA256SUMS.sig

### Verify the Download

1. Import the HashiCorp Security GPG key (listed on the [HashiCorp Security](https://www.hashicorp.com/security.html) page under Secure Communications):

        gpg --recv-keys 51852D87348FFC4C

    The output should show that the key was imported:

      {{< output >}}
gpg: keybox '/home/user/.gnupg/pubring.kbx' created
gpg: key 51852D87348FFC4C: 17 signatures not checked due to missing keys
gpg: /home/user/.gnupg/trustdb.gpg: trustdb created
gpg: key 51852D87348FFC4C: public key "HashiCorp Security <security@hashicorp.com>" imported
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:               imported: 1
{{</ output >}}

1. Verify the checksum file’s GPG signature:

        gpg --verify packer*.sig packer*SHA256SUMS

    The output should contain the `Good signature from "HashiCorp Security <security@hashicorp.com>"` confirmation message:

      {{< output >}}
gpg: Signature made Tue 01 Oct 2019 06:30:17 PM UTC
gpg:                using RSA key 91A6E7F85D05C65630BEF18951852D87348FFC4C
gpg: Good signature from "HashiCorp Security <security@hashicorp.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 91A6 E7F8 5D05 C656 30BE  F189 5185 2D87 348F FC4C
      {{</ output >}}

1. Verify that the fingerprint output matches the fingerprint listed in the *Secure Communications* section of the [HashiCorp Security](https://www.hashicorp.com/security.html) page.

1. Verify the .zip archive’s checksum:

        sha256sum -c packer*SHA256SUMS 2>&1 | grep OK

    The output should show the file's name as given in the `packer*SHA256SUMS` file:

      {{< output >}}
packer_1.4.4_linux_amd64.zip: OK
      {{</ output >}}

### Configure the Packer Environment

1. Unzip `packer_*_linux_amd64.zip` to your `~/packer` directory:

        unzip packer_*_linux_amd64.zip

    {{< note >}}
If you receive an error that indicates `unzip` is missing from your system, install the `unzip` package and try again.
    {{</ note >}}

1. Edit your `~./profile` shell configuration file to include the `~/packer` directory in your PATH. Then, reload the Bash profile:

        echo 'export PATH="$PATH:$HOME/packer"' >> ~/.profile
        source ~/.profile

    {{< note >}}
If you use a different shell, your shell configuration may have a different file name.
{{< /note >}}

1. Verify Packer can run by calling it with no options or arguments:

        packer

    {{< output >}}
Usage: packer [--version] [--help] <command> [<args>]

Available commands are:
    build       build image(s) from template
    console     creates a console for testing variable interpolation
    fix         fixes templates from old versions of packer
    inspect     see components of a template
    validate    check that a template is valid
    version     Prints the Packer version
    {{</ output >}}

## Use the Linode Packer Builder

Now that Packer is installed on your local system, you can create a Packer *template*. A template is a JSON formatted file that contains the configurations needed to build a machine image.

In this section you will create a template that uses the Linode Packer builder to create an image using Debian 9 as its base distribution. The template will also configure your system image with a new limited user account, and a public SSH key from your local computer. The additional system configuration will be completed using Packer's Ansible [*provisioner*](https://www.packer.io/docs/provisioners/index.html) and an example Ansible Playbook. A Packer provisioner is a built-in third-party integration that further configures a machine instance during the boot process and prior to taking the machine's snapshot.

{{< note >}}
The steps in this section will incur charges related to deploying a [1GB Linode]((https://www.linode.com/pricing) (Nanode). The Linode will only be deployed for the duration of the time needed to create and snapshot your image and will then be deleted. See our [Billing and Payments](/docs/platform/billing-and-support/billing-and-payments/) guide for details about [hourly billing](/docs/platform/billing-and-support/billing-and-payments/#how-hourly-billing-works).
{{</ note >}}

### Access Linode and Private Images

The Linode Packer Builder requires a Linode Image ID to deploy a disk from. This guide's example will use the image `linode/debian9`, but you can replace it with any other image you prefer. To list the official Linode images and your account's private images, you can curl the Linode API:

    curl -H "Authorization: Bearer $TOKEN" \
        https://api.linode.com/v4/images

### Create Your Template

{{< note >}}
The Packer builder does not manage images. Once it creates an image, it will be stored on your Linode account and can be accessed and used as needed from the Linode Cloud Manager, via Linode's API v4, or using third-party tools like Terraform. Linode Images are limited to 2GB per Image and 3 Images per account.
{{</ note >}}

Create a file named `example.json` with the following content:

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

If you would rather not use a provisioner in your Packer template, you can use the example file below:
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
  }]
}
{{</ file >}}

There are three sections to the Packer template file:

  * **variables**: This section allows you to further configure your template with [command-line variables, environment variables, Vault, or variable files](https://www.packer.io/docs/templates/user-variables.html). In the section that follows, you will use a command line variable to pass your Linode account's API token to the template.
  * **builders**: The builder section contains the definition for the machine image that will be created. In the example template, you use a single builder --the [Linode builder](https://www.packer.io/docs/builders/linode.html). The builder uses the `linode/debian9` image as its base and will assign the image a label of `my-private-packer-image`. It will deploy a 1GB Linode (Nanode), take a snapshot, and create a reusable Linode Image. Refer to Packer's official documentation for a complete [Linode Builder configuration reference](https://www.packer.io/docs/builders/linode.html).

    {{< note >}}
You can use multiple builders in a single template file. This process is known as a [parallel build](https://www.packer.io/intro/getting-started/parallel-builds.html) which allows you to create multiple images for multiple platforms from a single template.
{{</ note >}}

  * **provisioners**: (*optional*) with a provisioner you can further configure your system by completing common system administration tasks, like adding users, installing and configuring software, and more. The example uses Packer's built-in Ansible provider and executes the tasks defined in the local `limited_user_account.yml` playbook. This means your Linode image will also contain anything executed by the playbook on your Linode. Packer supports several other [provisioners](https://www.packer.io/docs/provisioners/index.html), like Chef, Salt, and shell scripts.

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

### Create your Linode Image

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

      {{< output >}}
linode output will be in this color.

==> linode: Running builder ...
==> linode: Creating temporary SSH key for instance...
==> linode: Creating Linode...
==> linode: Using ssh communicator to connect: 192.0.2.0
==> linode: Waiting for SSH to become available...
==> linode: Connected to SSH!
==> linode: Provisioning with Ansible...
==> linode: Executing Ansible: ansible-playbook --extra-vars packer_build_name=linode packer_builder_type=linode -o IdentitiesOnly=yes -i /tmp/packer-provisioner-ansible136766862 /home/user/packer/limited_user_account.yml -e ansible_ssh_private_key_file=/tmp/ansible-key642969643
    linode:
    linode: PLAY [all] *********************************************************************
    linode:
    linode: TASK [Gathering Facts] *********************************************************
    linode: ok: [default]
    linode:
    linode: TASK [Create a secondary, non-root user] ***************************************
    linode: changed: [default]
    linode:
    linode: TASK [Add remote authorized key to allow future passwordless logins] ***********
    linode: changed: [default]
    linode:
    linode: TASK [Add normal user to sudoers] **********************************************
    linode: changed: [default]
    linode:
    linode: PLAY RECAP *********************************************************************
    linode: default                    : ok=4    changed=3    unreachable=0    failed=0    skipped=0    rescued=0    ignored=0
    linode:
==> linode: Shutting down Linode...
==> linode: Creating image...
Build 'linode' finished.

==> Builds finished. The artifacts of successful builds are:
--> linode: Linode image: my-private-packer-image (private/7550080)
      {{</ output >}}

      The output will provide you with your new private image's ID. In the example output the image ID is `private/7550080`. This image is now available on your Linode account to use as you desire. As an example, in the next section you will use this newly created image to deploy a new 1GB Linode (Nanode) using Linode's API v4.

### Deploy a Linode with your New Image

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

## Next Steps

If you'd like to learn how to use Terraform to deploy Linodes using your Packer created image, you can follow our Terraform guides to get started:

* [A Beginner's Guide to Terraform](/docs/applications/configuration-management/beginners-guide-to-terraform/)
* [Create a Terraform Module](/docs/applications/configuration-management/create-terraform-module/)
* [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/)
* [Introduction to HashiCorp Configuration Language (HCL)](/docs/applications/configuration-management/introduction-to-hcl/)
