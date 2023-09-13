---
slug: create-terraform-module
description: 'This guide shows you how to create a Terraform module with nested root, linode_instance, and stackscripts modules using a Linode StackScripts installer.'
keywords: ['terraform','resource','modules','provider']
tags: ["terraform"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-12
modified: 2021-06-01
modified_by:
  name: Linode
image: create-a-terraform-module.png
title: "Create a Terraform Module"
title_meta: "How to Create a Terraform Module"
external_resources:
- '[Linode Terraform Provider](https://www.terraform.io/docs/providers/linode/r/instance.html)'
- '[Terraform - Creating Modules](https://www.terraform.io/docs/modules/create.html)'
- '[Terraform - Module Sources](https://www.terraform.io/docs/modules/sources.html)'
aliases: ['/applications/configuration-management/create-terraform-module/','/applications/configuration-management/terraform/create-terraform-module/']
authors: ["Linode"]
---

Terraform is a popular orchestration tool by [HashiCorp](https://www.hashicorp.com/). It's used to build, maintain, and version infrastructure safely. Terraform modules allow you to better organize your configuration code and make the code reusable.

In this guide you will create a *Linode StackScripts* module. This module will deploy a Linode instance from a StackScript you will create. This module will include nested modules that split up the required resources between the *root module*, a `linode_instance` module, and a `stackscripts` module.

## Terraform Modules

### What is a Terraform Module?

Officially, a Terraform module contains multiple resources that are used with each other, but if you look at one, it's a directory with a set of Terraform configuration files contained within. Modules can create lightweight abstractions so your infrastructure can be described in terms of its architecture, as opposed to direct terms of physical objects. You can also host your Terraform modules on remote version control services, like Git, for others to use. The [Terraform Module Registry](https://registry.terraform.io/) hosts community modules that you can reuse for your own Terraform configurations, or you can publish your own modules for consumption by the Terraform community. Reading the ["Modules" section](https://www.terraform.io/docs/language/modules/develop/index.html) of the Terraform Language Documentation is suggested for more details.

### How do I create a Terraform Module?

This guide covers the creation of a Terraform module used to deploy a Linode instance. However, if you still have questions, HashiCorp has posted a [series of tutorials on Terraform modules](https://learn.hashicorp.com/collections/terraform/modules) on HashiCorp Learn, and [the "Build a Module" section](https://learn.hashicorp.com/tutorials/terraform/module-create?in=terraform/modules) is timed to take only about 15 minutes. We recommend taking that lesson to learn more.

## Before You Begin

1. Install Terraform on your local computer using the steps found in the **Install Terraform** section of the [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/#install-terraform) guide. Your Terraform project directory should be named `linode_stackscripts`.

    {{< note respectIndent=false >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12+.  To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.
    {{< /note >}}

2. Terraform requires an API access token. Follow the [Getting Started with the Linode API](/docs/products/tools/api/get-started/#get-an-access-token) guide to obtain a token.

3. Complete the steps in the **Configure Git** section of the [Getting Started with Git](/docs/guides/how-to-configure-git/#configure-git) guide.

4. Review [Deploy a WordPress Site using Terraform and StackScripts](/docs/guides/deploy-a-wordpress-site-using-terraform-and-linode-stackscripts/) to familiarize yourself with the Linode provider's StackScript resource.

## Standard Terraform Module Structure

Terraform's standard module structure provides guidance on file and directory layouts for reusable modules. If you would like to make your module public to the Terraform community, the recommended layout allows Terraform to generate documentation and index modules for the [Terraform Module Registry](https://registry.terraform.io/).

- The primary module structure requirement is that a *root module* must exist. The root module is the directory that holds the Terraform configuration files that are applied to build your desired infrastructure. These files provide an entry point into any nested modules you might utilize.

- Any module should include, at minimum, a `main.tf`, a `variables.tf`, and an `outputs.tf` file.  This naming convention is recommended, but not enforced.

    - If using nested modules to split up your infrastructure's required resources, the `main.tf` file holds all your module blocks and any needed resources not contained within your nested modules. A simple module's `main.tf` file, without any nested modules, declares all resources within this file.

    - The `variables.tf` and `outputs.tf` files contain input variable and output variable declarations. All variables and outputs should include descriptions.

- If using nested modules, they should be located in a root module's subdirectory named `modules/`.

- If your modules will be hosted on Terraform's Module Registry, root modules and any nested modules should contain a `README.MD` file with a description that explains the module's intended use.

- You can provide examples in a subdirectory named `examples` of the root module directory.

## Create the Linode StackScripts Module

The Linode StackScripts module will include two nested modules that split up the required resources between the **root module**, a `linodes` module, and a `stackscripts` module. When you are done creating all required Terraform files your directory structure will look as follows:

{{< output >}}
linode_stackscripts/
├── main.tf
├── outputs.tf
├── secrets.tfvars
├── terraform
├── terraform.tfvars
├── variables.tf
└── modules/
    ├── linodes/
    |   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── stackscripts/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
{{</ output >}}

{{< note >}}
Your `linode_stackscripts` directory will likely contain other files related to the Terraform installation you completed prior to beginning the steps in this guide.
{{< /note >}}

### Create the Linodes Module

In this section, you will create the `linodes` module which will be in charge of creating your Linode instance. This module contains a `main.tf` file and corresponding `variables.tf` and `outputs.tf` files.

1. If your Terraform project directory is not named `linode_stackscripts`, rename it before beginning and move into that directory:

        mv terraform linode_stackscripts
        cd linode_stackscripts

    {{< note>}}
You may need to edit your `~/.profile` directory to include the `~/linode_stackscripts` directory in your PATH.

    echo 'export PATH="$PATH:$HOME/linode_stackscripts"' >> ~/.profile
    source ~/.profile
    {{< /note >}}

1. Create the `modules` and `linodes` subdirectories:

        mkdir -p modules/linodes

1. Using your preferred text editor, create a `main.tf` file in `modules/linodes/` with the following resources:

      {{< file "~/linode_stackscripts/modules/linodes/main.tf" >}}
locals {
    key = var.key
}

resource "linode_sshkey" "main_key" {
    label = var.key_label
    ssh_key = chomp(file(local.key))
}

resource "linode_instance" "linode_id" {
    image = var.image
    label = var.label
    region = var.region
    type = var.type
    authorized_keys = [ linode_sshkey.main_key.ssh_key ]
    root_pass = var.root_pass
    stackscript_id = var.stackscript_id
    stackscript_data = {
       "my_password" = var.stackscript_data["my_password"]
       "my_userpubkey" = var.stackscript_data["my_userpubkey"]
       "my_hostname" = var.stackscript_data["my_hostname"]
       "my_username" = var.stackscript_data["my_username"]
    }
}
{{</ file >}}

      The `main.tf` file declares a `linode_instance` resource that deploys a Linode using a StackScript. Notice that all argument values use interpolation syntax to access variable values. You will declare the variables next and provide the variable values in the root module's `terraform.tfvars` file. Using separate files for variable declaration and assignment parameterizes your configurations and allows them to be reused as modules.

      Let’s take a closer look at each block in the `main.tf` configuration file.

      {{< file >}}
locals {
    key = var.key
}

resource "linode_sshkey" "main_key" {
    label = var.key_label
    ssh_key = chomp(file(local.key))
}
{{</ file >}}

      - The `locals` stanza declares a local variable `key` whose value will be provided by an input variable.

      - The `linode_sshkey` resource will create Linode SSH Keys tied to your Linode account. These keys can be reused for future Linode deployments once the resource has been created. `ssh_key = chomp(file(local.key))` uses Terraform’s built-in function `file()` to provide a local file path to the public SSH key’s location. The location of the file path is the value of the local variable `key`. The `chomp()` built-in function removes trailing new lines from the SSH key.

        {{< note respectIndent=false >}}
If you do not already have SSH keys, follow the steps in the **Create an Authentication Key-pair** section of the our guide [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/#create-an-authentication-key-pair).
{{< /note >}}

      {{< file >}}
resource "linode_instance" "linode_id" {
    image = var.image
    label = var.label
    region = var.region
    type = var.type
    authorized_keys = [ linode_sshkey.main_key.ssh_key ]
    root_pass = var.root_pass
    stackscript_id = var.stackscript_id
    stackscript_data = {
       "my_password" = var.stackscript_data["my_password"]
       "my_userpubkey" = var.stackscript_data["my_userpubkey"]
       "my_hostname" = var.stackscript_data["my_hostname"]
       "my_username" = var.stackscript_data["my_username"]
    }
}
{{</ file >}}

      The `linode_instance` resource creates a Linode instance with the listed arguments. Please note the following information:

      - The `authorized_keys` argument uses the SSH public key provided by the `linode_sshkey` resource in the previous stanza. This argument expects a value of type list, so the value must be wrapped in brackets.

      - To use an existing Linode StackScript you must use the `stackscript_id` argument and provide a valid ID as a value. Every StackScript is assigned a unique ID upon creation. Later on in the guide, you will create your own StackScript and expose its ID as an output variable in order to use its ID to deploy your Linode instance.

      - StackScripts support user-defined data. This means a StackScript can use the `UDF` tag to create a variable whose value must be provided by the user of the script. This allows users to customize the behavior of a StackScript on a per-deployment basis. Any required `UDF` variable can be defined using the `stackscript_data` argument.

1. Create the `variables.tf` file to define your resource's required variables:

      {{< file "~/linode_stackscripts/modules/linodes/variables.tf">}}
variable "key" {
  description = "Public SSH Key's path."
}

variable "key_label" {
  description = "new SSH key label"
}

variable "image" {
  description = "Image to use for Linode instance"
  default = "linode/ubuntu18.04"
}

variable "label" {
  description = "The Linode's label is for display purposes only, but must be unique."
  default = "default-linode"
}

variable "region" {
  description = "The region where your Linode will be located."
  default = "us-east"
}

variable "type" {
  description = "Your Linode's plan type."
  default = "g6-standard-1"
}

variable "authorized_keys" {
  description = "SSH Keys to use for the Linode."
  type = "list"
}

variable "root_pass" {
  description = "Your Linode's root user's password."
}

variable "stackscript_id" {
  description = "StackScript ID."
}

variable "stackscript_data" {
  description = "Map of required StackScript UDF data."
  type = "map"
  default = {}
}
{{</ file >}}

    - Modules must include a description for each input variable to help document your configuration’s usage. This will make it easier for anyone else to use this module.

    - Every variable can contain a default value. The default value is only used if no other value is provided. For example, if you have a favorite Linux distribution, you may want to provide it as your image variable’s default value. In this case, `linode/ubuntu18.04` is set as the default value.

    - You can declare a `type` for each variable. If no `type` is provided, the variable will default to `type = "string"`.

    - Notice that the `stackscript_data` variable is of `type = "map"`. This will allow you to provide values for as many `UDF` variables as your StackScript requires.

1. Create the `outputs.tf` file:

      {{< file "~/linode_stackscripts/modules/linodes/outputs.tf" >}}
output "sshkey_linode" {
  value = linode_sshkey.main_key.ssh_key
}
{{</ file >}}

      The `outputs.tf` file exposes any values from the resources you declared in the `main.tf` file. Any exposed values can be used by any other module within the root module. The `sshkey_linode` output variable exposes the `linode_sshkey` resource's public key.

Now that the `linodes` module is complete, in the next section, you will create the `stackscripts` module.

### Create the StackScripts Module

In this section, you will create the StackScripts module. This module creates a `linode_stackscripts` resource which you can use to create and modify your own Linode StackScript.

1. Ensure you are in the `linode_stackscripts` directory and create the `stackscripts` subdirectory:

        mkdir modules/stackscripts

1. Using your preferred text editor, create a `main.tf` file in `modules/stackscripts/` with the following resource:

      {{< file "~/linode_stackscripts/modules/stackscripts/main.tf">}}
resource "linode_stackscript" "default" {
  label = var.stackscript_label
  description = var.description
  script = var.stackscript
  images = var.stackscript_image
  rev_note = var.rev_note
}
{{</ file >}}

      The `main.tf` file creates the `linode_stackscript` resource and provides the required configurations. All argument values use interpolation syntax to access input variable values. You will declare the input variables next and provide the variable values in the root module’s `terraform.tfvars` file. For more information on StackScripts see the [StackScripts product page](/docs/products/tools/stackscripts/) and the [Linode APIv4 StackScripts reference](/docs/api/stackscripts).

1. Create the `variables.tf` file to define your resource's required variables:

    {{< file "~/linode_stackscripts/modules/stackscripts/variables.tf" >}}
variable "stackscript_label" {
  description = "The StackScript's label is for display purposes only."
}

variable "description" {
  description = "A description for the StackScript."
}

variable "stackscript" {
  description = "The script to execute when provisioning a new Linode with this StackScript."
}
variable "stackscript_image" {
  description = " A list of Image IDs representing the Images that this StackScript is compatible for deploying with."
}
variable "rev_note" {
  description = "This field allows you to add notes for the set of revisions made to this StackScript."
}
{{</ file >}}

1. Create the `outputs.tf` file:

    {{< file "~/linode_stackscripts/modules/stackscripts/output.tf" >}}
output "stackscript_id" {
  value = linode_stackscript.default.id
}
{{</ file >}}

    The `outputs.tf` file exposes the value of the `linode_stackscript` resource's ID. Every StackScript is assigned a unique ID upon creation. You will need this ID when creating your root module.

You have now created the StackScripts module and are ready to use both modules within the root module. You will complete this work in the next section.

### Create the Root Module

The root module will call the `linode` and `stackscripts` modules, satisfy their required variables and then apply those configurations to build your desired infrastructure. These configurations deploy a Linode based on a StackScript you will define in this section. When using nested modules, the modules will be hidden from your root configuration, so you'll have to re-expose any variables and outputs you require.

1. Ensure you are in the `linode_stackscripts` directory and create the `main.tf` file:

    {{< file "~/linode_stackscripts/main.tf">}}
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
  }
}
provider "linode" {
    token = var.token
}

module "stackscripts" {
    source = "./modules/stackscripts"
    stackscript_label = var.stackscript_label
    description = var.description
    stackscript = var.stackscript
    stackscript_image = var.stackscript_image
    rev_note = var.rev_note
}

module "linodes" {
    source = "./modules/linodes"
    key = var.key
    key_label = var.key_label
    image = var.image
    label = var.label
    region = var.region
    type = var.type
    root_pass = var.root_pass
    authorized_keys = [ module.linodes.sshkey_linode ]
    stackscript_id = module.stackscripts.stackscript_id
    stackscript_data = {
       "my_password" = var.stackscript_data["my_password"]
       "my_userpubkey" = var.stackscript_data["my_userpubkey"]
       "my_hostname" = var.stackscript_data["my_hostname"]
       "my_username" = var.stackscript_data["my_username"]
    }
}
{{</ file >}}

    The `main.tf` file uses the `linodes` and `stackscripts` modules that were created in the previous sections and provides the required arguments. All argument values use interpolation syntax to access variable values, which you will declare in a `variables.tf` file and then provide corresponding values for in a `terraform.tfvars` file.

    Let's review each block:

    {{< file >}}
provider "linode" {
    token = var.token
}
{{</ file >}}

    The first stanza declares Linode as the provider that will manage the lifecycle of any resources declared throughout the configuration file. The Linode provider requires your Linode APIv4 token for authentication.

    {{< file >}}
module "stackscripts" {
    source = "./modules/stackscripts"
    stackscript_label = var.stackscript_label
    description = var.description
    stackscript = var.stackscript
    stackscript_image = var.stackscript_image
    rev_note = var.rev_note
}
{{</ file >}}

    The next stanza instructs Terraform to create an instance of the `stackscripts` module and instantiate any of the resources defined within the module. The `source` attribute provides the location of the child module's source code and is required whenever you create an instance of a module. All other attributes are determined by the module. Notice that all the attributes included in the module block correspond to the `linode_stackscript` resource's arguments declared in the `main.tf` file of the `stackscripts` module.

    {{< file >}}
module "linodes" {
    source = "./modules/linodes"
    key = var.key
    key_label = var.key_label
    image = var.image
    label = var.label
    group = var.group
    region = var.region
    type = var.type
    root_pass = var.root_pass
    authorized_keys = [ module.linodes.sshkey_linode ]
    stackscript_id = module.stackscripts.stackscript_id
    stackscript_data = {
       "my_password" = var.stackscript_data["my_password"]
       "my_userpubkey" = var.stackscript_data["my_userpubkey"]
       "my_hostname" = var.stackscript_data["my_hostname"]
       "my_username" = var.stackscript_data["my_username"]
    }
}
{{</ file >}}

    This stanza creates an instance of the `linodes` module and then instantiates the resources you defined in the module. Notice that `authorized_keys = [ module.linodes.sshkey_id ]` and `stackscript_id = "module.stackscripts.stackscript_id"` both access values exposed as output variables by the `linodes` and `stackscripts` modules. Any module's exposed output variables can be referenced in your root module's `main.tf` file.

1. Create the `variables.tf` file to declare the input variables required by the module instances:

    {{< file "~/linode_stackscripts/variables.tf">}}
variable "token" {
  description = " Linode API token"
}

variable "stackscript_label" {
  description = "The StackScript's label is for display purposes only."
}

variable "description" {
  description = "A description for the StackScript."
}

variable "stackscript" {
  description = "The script to execute when provisioning a new Linode with this StackScript."
}

variable "stackscript_image" {
  description = "A list of Image IDs representing the Images that this StackScript is compatible for deploying with."
}

variable "rev_note" {
  description = "This field allows you to add notes for the set of revisions made to this StackScript."
}

variable "key" {
  description = "Public SSH Key's path."
}

variable "key_label" {
  description = "New SSH key label."
}

variable "image" {
  description = "Image to use for Linode instance."
  default = "linode/ubuntu18.04"
}

variable "label" {
  description = "The Linode's label is for display purposes only, but must be unique."
  default = "default-linode"
}

variable "region" {
  description = "The region where your Linode will be located."
  default = "us-east"
}

variable "type" {
  description = "Your Linode's plan type."
  default = "g6-standard-1"
}

variable "root_pass" {
  description = "Your Linode's root user's password."
}

variable "stackscript_data" {
  description = "Map of required StackScript UDF data."
  type = "map"
  default = {}
}

variable "stackscript_id" {
  description = "Hold the stackscript id output value."
}
{{</ file >}}

1. Create the `outputs.tf` file:

    {{< file "~/linode_stackscripts/outputs.tf" >}}
output "stackscript_id" {
  value = module.stackscripts.stackscript_id
}
{{</ file >}}

    In the `outputs.tf` file you will re-expose the output variables exposed by the `stackscripts` module.

1. Create the `terraform.tfvars` file to provide values for all input variables defined in the `variables.tf` file. This file will exclude any values that provide sensitive data, like passwords and API tokens. A file containing sensitive values will be created in the next step:

    {{< file "~/linode_stackscripts/terraform.tfvars " >}}
key = "~/.ssh/id_rsa.pub"
key_label = "my-ssh-key"
label = "my-linode"
stackscript_id = "base-ubuntu-deployment"
stackscript_label = "base-ubuntu-deployment"
description = "A base deployment for Ubuntu 18.04 that creates a limited user account."
stackscript = <<EOF
#!/bin/bash
# <UDF name="my_hostname" Label="Linode's Hostname" />
# <UDF name="my_username" Label="Limited user account" />
# <UDF name="my_password" Label="Limited user account's password" />
# <UDF name="my_userpubkey" Label="Limited user account's public key" />

source <ssinclude StackScriptID="1">

set -x

MY_IP=system_primary_ip
system_set_hostname "$MY_HOSTNAME"
system_add_host_entry "$MY_IP" "$MY_HOSTNAME"
user_add_sudo "$MY_USERNAME" "$MY_PASSWORD"
user_add_pubkey "$MY_USERNAME" "$MY_USERPUBKEY"
ssh_disable_root
goodstuff
EOF
stackscript_image = ["linode/ubuntu18.04"]
rev_note = "First revision of my StackScript created with the Linode Terraform provider."
{{</ file >}}

    The `terraform.tfvars` file supplies all values required by the `linodes` and `stackscripts` modules. Ensure you replace any values with your own values when using this example file.

    The `stackscript` variable provides the actual contents of the StackScript you create. This example StackScript requires four `UDF` values: `my_hostname`, `my_username`, `my_password`, and `my_userpubkey`. The `my_hostname` and `my_username` values are supplied by the `stackscript_data` map. The `my_password` and `my_userpubkey` values will be provided in the next step.

    The StackScript will then use these values to create a limited user account; set a hostname; add a host entry; add the created user to the `sudo` group; disable SSH access for the root user; and install vim, wget, and less. This StackScript uses bash functions defined in the Linode Community [StackScript Bash Library](https://www.linode.com/stackscripts/view/1).

1. Create a file named `secrets.tfvars` to hold any sensitive values:

    {{< file "~/linode_stackscripts/secrets.tfvars">}}
token = "my-linode-api-token"
root_pass = "my-secure-root-password"
stackscript_data = {
  "my_password" = "my-limited-users-password"
  "my_userpubkey" = "my-public-ssh-key"
  "my_username" = "username"
  "my_hostname" = "linode-hostname"
}
{{</ file >}}

    This file contains all the sensitive data needed for your Linode deployment. Ensure you replace all values with your own secure passwords and your Linode account's APIv4 token. This file should never be tracked in version control software and should be listed in your `.gitignore` file if using [GitHub](https://github.com/).

    {{< note respectIndent=false >}}
In Terraform 0.12, variables with map and object values will use the last value found and override previous values. This is different from previous versions of Terraform, which would merge map values instead of overriding them. For this reason, the `stackscript_data` map and its values are defined in a single variable definitions file.
    {{< /note >}}

    {{< note respectIndent=false >}}
  There are several other options available for secrets management with Terraform. For more information on this subject, see [Secrets Management with Terraform](/docs/guides/secrets-management-with-terraform).
    {{< /note >}}

You are now ready to apply your `linode_stackscripts` module's Terraform configuration. These steps will be completed in the next section.

## Initialize, Plan and Apply the Terraform Configuration

Whenever a new provider is used in a Terraform configuration, it must first be initialized. The initialization process downloads and installs the provider’s plugin and performs any other steps needed for its use. Before applying your configuration, it is also useful to view your configuration’s execution plan before making any actual changes to your infrastructure. In this section, you will complete all these steps.

1. Initialize the Linode provider. Ensure you are in the `linode_stackscripts` directory before running this command:

        terraform init

    You will see a message that confirms that the provider plugins have been successfully initialized.

1. Run the Terraform plan command:

        terraform plan -var-file="secrets.tfvars" -var-file="terraform.tfvars"

    Terraform plan won’t take any action or make any changes to your Linode account. Instead, an analysis is done to determine which actions (i.e. Linode instance creations, deletions, or modifications) are required to achieve the state described in your configuration.

1. You are now ready to create the infrastructure defined in your root module's `main.tf` configuration file:

        terraform apply -var-file="secrets.tfvars" -var-file="terraform.tfvars"

    Since you are using multiple variable value files, you must call each file individually using the `var-file` argument. You will be prompted to confirm the `apply` action. Enter *yes*. Terraform will begin to create the resources you’ve defined throughout this guide. This process will take a couple of minutes to complete. Once the infrastructure has been successfully built you will see a similar output:

    {{< output >}}
  Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
    {{</ output >}}

1. To verify the deployment, retrieve your Linode instance's IP address:

        terraform show | grep 'ip_address'

      You should see a similar output:

      {{< output >}}
        ip_address = 192.0.2.0
      {{</ output >}}

1. Open a new shell session and SSH into your Linode using the IP address you retrieved in the previous step and the username you defined in the `terraform.tfvars` file's `my_username` variable:

        ssh username@192.0.2.0

      You should be able to access your Linode and then verify that what you defined in the StackScript was executed.

## Version Control Your Terraform Module

To make the `linode_stackscripts` module available to other team members, you can version control it using [GitHub](https://github.com/). Before completing the steps in this section, ensure you have completed the steps in the **Configure Git** section of the [Getting Started with Git](/docs/guides/how-to-configure-git/#configure-git) guide.

1. In the `linode_stackscripts` directory create a `.gitignore` file:

    {{< file "~/linode_stackscripts/.gitignore" >}}
secrets.tfvars
.terraform/
terraform/
terraform.tfstate
{{</ file >}}

    {{< note respectIndent=false >}}
If there are any files related to the Terraform installation steps completed before beginning this guide (such as the zip files and checksum files), you can remove these files from the `linode_stackscripts` directory, since you should not track them in version control and they are no longer necessary.
{{< /note >}}

1. Initialize the git repository:

        git init

    Stage all the files you’ve created so far for your first commit:

        git add -A

1. Commit all the `linode_stackscripts` files:

        git commit -m "Initial commit"

1. Navigate to your GitHub account and [create a new repository](https://help.github.com/articles/creating-a-new-repository/). Ensure you name the repository the same name as that of your Terraform module. In this example, the GitHub repository will be named `linode_stackscripts`.

1. At the top of your GitHub repository's **Quick Setup** page, copy the remote repository URL.

1. Return to your local computer's `linode_stackscripts` directory and add the URL for the remote repository:

        git remote add origin https://github.com/my-github/linode_stackscripts.git

1. Push your local `linode_stackscripts` repository to your remote GitHub repository:

        git push -u origin master

Your Terraform module is now tracked via GitHub and can be used, shared, and modified by anyone who has access to your GitHub account.

### Invoking Your GitHub-Hosted Module

In the future, you can source this module from GitHub within your Terraform module declarations. You would write your module block like the following:

{{< file >}}
module "linode_stackscripts" {
    source = "github.com/username/linode_stackscripts"

    VARIABLES HERE
    . . .
}
{{< /file >}}