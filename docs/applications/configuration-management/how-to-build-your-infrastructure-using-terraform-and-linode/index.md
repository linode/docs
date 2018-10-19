---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use Terraform to deploy Linodes containing pre-configured application environments such as Docker or from a manual configuration.'
og_description: 'Use Terraform to deploy Linodes containing pre-configured application environments such as Docker or from a manual configuration.'
keywords: ["terraform", "infrastructure", "IaC"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-11-06
modified: 2018-10-19
aliases: ['platform/how-to-build-your-infrastructure-using-terraform-and-linode/']
modified_by:
  name: Linode
title: 'Use Terraform to Provision Linode Environments'
contributor:
  name: Damaso Sanoja
---

Infrastructure as code (IaC) is software that gives developers the ability to build, manage, and provision computing environments with a high-level [configuration syntax](https://www.terraform.io/docs/configuration/syntax.html). Some benefits include the ability to enforce DevOps best practices, process automation, and the opportunity to use version control systems for greater visibility and collaboration within a team.

[Terraform](https://www.terraform.io) stands out from other IaC solutions because it's an orchestration tool, meaning it's designed specifically for bare-metal server and virtual machines.

Terraform offers many ways to set up and provision your Linode using:

* Custom scripts, which can be included in a configuration file itself or called from a local or remote file.
* Specialized software tools integrated with Terraform like Chef or Puppet.
* Container-based solutions like Docker or Kubernetes.
* Terraform plugin-based solutions.

There are also plenty of [provisioners](https://www.terraform.io/docs/provisioners/index.html), [providers](https://github.com/terraform-providers), and [modules](https://registry.terraform.io) available, one of which is the official [Linode-maintained provider](https://github.com/terraform-providers/terraform-provider-linode/).

{{< caution >}}
The configurations and commands used in this guide will result in multiple Linodes being added to your account. Be sure to monitor your account closely in the Linode Manager to avoid unwanted charges.
{{< /caution >}}

## Before You Begin

-  You will need root access to the system and a standard user account with sudo privileges.

-  Create an API token for your Linode account. It will only appear once on the screen, so be sure to take a screen capture of the token while it's displayed. See our guide [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) if you need help.

{{< note >}}
The Linode provider uses [Linode's API v4](https://developers.linode.com/api/v4#section/Access-and-Authentication). To generate an API v4 Personal Access Token, you will need to use the [new Linode Manager](https://cloud.linode.com/). Any Personal Access Tokens generated from the previous Linode Manager are API v3 tokens and will not work with Terraform's Linode provider.
{{</ note >}}

## Install Terraform

 1.  Make a Terraform project directory to work from and `cd` into it:

         mkdir terraform
         cd terraform

 1.  Download the following files from [Terraform's website](https://www.terraform.io/downloads.html):

     - The 64-bit Linux `.zip` archive.
     - The SHA256 checksums file.
     - The checksum signature file.


### Verify Download

1.  Import the HashiCorp Security [GPG key](https://www.hashicorp.com/security.html):

        gpg --recv-keys *keyID*

    The output should show that the key was imported:

    {{< output >}}
user@localhost:~# gpg --recv-keys 51852D87348FFC4C
gpg: /home/user/.gnupg/trustdb.gpg: trustdb created
gpg: key 51852D87348FFC4C: public key "HashiCorp Security <security@hashicorp.com>" imported
gpg: no ultimately trusted keys found
gpg: Total number processed: 1
gpg:               imported: 1
{{</ output >}}

    {{< note >}}
If you recieve an error to the effect of `No dirmngrnupg/S.dirmngr'`, install the package `dirmngr` and run the GPG command again.
{{< /note >}}

1.  Verify the checksum file's GPG signature:

        gpg --verify terraform*.sig terraform*SHA256SUMS

    The output should confimr `Good signature from "HashiCorp Security <security@hashicorp.com>"`:

    {{< output >}}
user@localhost:~# gpg --verify terraform*.sig terraform*SHA256SUMS
gpg: Signature made Wed 15 Aug 2018 10:07:05 PM UTC
gpg:                using RSA key 51852D87348FFC4C
gpg: Good signature from "HashiCorp Security <security@hashicorp.com>" [unknown]
gpg: WARNING: This key is not certified with a trusted signature!
gpg:          There is no indication that the signature belongs to the owner.
Primary key fingerprint: 91A6 E7F8 5D05 C656 30BE  F189 5185 2D87 348F FC4C
{{</ output >}}

1.  Verify that the fingerprint matches what's on [HashiCorp's security page](https://www.hashicorp.com/security.html).

1.  Verify the `.zip` archive's checksum:

        sha256sum -c terraform*SHA256SUMS 2>&1 | grep OK

    The output should show the file's name as given in the `terraform*SHA256SUMS` file:

    {{< output >}}
terraform_0.11.8_linux_amd64.zip: OK
{{< /output >}}

### Configure Terraform Environment

1.  Unzip `terraform_*_linux_amd64.zip` to your desired working directory:

        unzip terraform_*_linux_amd64.zip

    {{< note >}}
If you recieve the error: `-bash: /usr/bin/unzip: No such file or directory`, install the `unzip` package and try again.
    {{< /note >}}

1.  Add your working directory to `~/.profile` so it's available to your user's PATH. Then reload the Bash profile.

        echo 'export PATH="$PATH:$HOME/terraform"' >> ~/.profile
        source ~/.profile

1.  Verify Terraform can run by simply calling it with no options or arguments:

        terraform

    You should see the output below:

    {{< output >}}
user@terraform-example:~$ terraform
Usage: terraform [-version] [-help] <command> [args]

The available commands for execution are listed below.
The most common, useful commands are shown first, followed by
less common or more advanced commands. If you're just getting
started with Terraform, stick with the common commands. For the
other commands, please read the help and docs before usage.

Common commands:
    apply              Builds or changes infrastructure
    console            Interactive console for Terraform interpolations
    destroy            Destroy Terraform-managed infrastructure
    env                Workspace management
    fmt                Rewrites config files to canonical format
    get                Download and install modules for the configuration
    graph              Create a visual graph of Terraform resources
    import             Import existing infrastructure into Terraform
    init               Initialize a Terraform working directory
    output             Read an output from a state file
    plan               Generate and show an execution plan
    providers          Prints a tree of the providers used in the configuration
    push               Upload this Terraform module to Atlas to run
    refresh            Update local state file against real resources
    show               Inspect Terraform state or plan
    taint              Manually mark a resource for recreation
    untaint            Manually unmark a resource as tainted
    validate           Validates the Terraform files
    version            Prints the Terraform version
    workspace          Workspace management

All other commands:
    debug              Debug output management (experimental)
    force-unlock       Manually unlock the terraform state
    state              Advanced state management
{{< /output >}}


## Building with the Linode Provider

Terraform can understand two types of configuration files: JSON and HashiCorp Configuration Language (HCL). This guide [used the HCL format](https://github.com/hashicorp/hcl), designated by the extension `.tf`.

1.  Create the file `linode-template.tf` and add the snippet below. Fill in your Linode API key, public SSH key, and desired root password where indicated. See [Terraform's documentation](https://www.terraform.io/docs/configuration/syntax.html) for more information on configuration syntax.

    {{< file "~/terraform/linode-template.tf" aconf >}}
provider "linode" {
  token = "LINODE_API_KEY_HERE"
}

resource "linode_instance" "terraform-example" {
        image = "linode/ubuntu18.04"
        label = "Terraform-Example"
        group = "Terraform"
        region = "us-east"
        type = "g6-standard-1"
        authorized_keys = [ "PUBLIC_SSH_KEY_HERE" ]
        root_pass = "ROOT_PASSWORD_HERE"
}
{{< /file >}}

1.  Initialize the Terraform configuration:

        terraform init

    Terraform will confirm successful initialization:

    {{< output >}}
Initializing provider plugins...
- Checking for available provider plugins on https://releases.hashicorp.com...
- Downloading plugin for provider "linode" (1.0.0)...

The following providers do not have any version constraints in configuration,
so the latest version was installed.

To prevent automatic upgrades to new major versions that may contain breaking
changes, it is recommended to add version = "..." constraints to the
corresponding provider blocks in configuration, with the constraint strings
suggested below.

* provider.linode: version = "~> 1.0"
Terraform has been successfully initialized!
{{</ output >}}

1.  If an error occurs, run the command again in debug mode:

        TF_LOG=debug terraform init

### Provision a Single Server

1.  Check your Terraform plan:

        terraform plan

    You will see:

    {{< output >}}
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.


------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + linode_instance.terraform-example
      id:                 <computed>
      alerts.#:           <computed>
      authorized_keys.#:  "1"
      authorized_keys.0:  "ssh-rsa . . ."
      backups.#:          <computed>
      backups_enabled:    <computed>
      boot_config_label:  <computed>
      group:              "Terraform"
      image:              "linode/ubuntu18.04"
      ip_address:         <computed>
      ipv4.#:             <computed>
      ipv6:               <computed>
      label:              "Terraform-Example"
      private_ip_address: <computed>
      region:             "us-east"
      root_pass:          <sensitive>
      specs.#:            <computed>
      status:             <computed>
      swap_size:          <computed>
      type:               "g6-standard-1"
      watchdog_enabled:   "true"


Plan: 1 to add, 0 to change, 0 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
{{</ output >}}

    The `terraform plan` command won't take any action or make any changes on your Linode account. Terraform uses a declarative approach in which your configuration file specifies the desired end-state of the infrastructure. When you run `terraform plan`, an analysis is done to determine which actions are required to achieve this state.

    If you need to fix any issues, activate debug mode:

        TF_LOG=debug terraform plan

1.  If there are no errors, start the deployment:

        terraform apply

    You'll be asked to confirm the action, enter `yes` and press **Enter**:

    {{< output >}}
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + linode_instance.terraform-example
      id:                 <computed>
      alerts.#:           <computed>
      authorized_keys.#:  "1"
      authorized_keys.0:  "ssh-rsa . . ."
      backups.#:          <computed>
      backups_enabled:    <computed>
      boot_config_label:  <computed>
      group:              "Terraform"
      image:              "linode/ubuntu18.04"
      ip_address:         <computed>
      ipv4.#:             <computed>
      ipv6:               <computed>
      label:              "Terraform-Example"
      private_ip_address: <computed>
      region:             "us-east"
      root_pass:          <sensitive>
      specs.#:            <computed>
      status:             <computed>
      swap_size:          <computed>
      type:               "g6-standard-1"
      watchdog_enabled:   "true"


Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value:
{{</ output >}}

1.  Return to the Linode Manager. You should see the `linode-test` Linode has been added to your account.

### Provision Additional Servers

Now imagine you need to implement a web and database server deployment in addition to the Linode created above.

It's important to remember that:

* Terraform loads into memory all files present in the working directory which have a `.tf` extension. As a result, all files are concatenated (in memory). This means you don't need to define the provider in new `.tf` files, since it was already declared in `linode-template.tf`.

* Resources can't be duplicated, so you need to assign a unique name for each new Linode.

* In this example the same SSH key and root password are being used. In production environments, these values should be unique for each resource.

* A new parameter `swap_size` is used to override the default value of 512Mb. You can check all available options for `terraform-provider-linode` in the plugin GitHub repository [readme.md](https://github.com/LinodeContent/terraform-provider-linode).

1.  Create another file called `linode-www.tf`. **Do not delete `linode-template.tf`**.

    {{< file "~/terraform/linode-www.tf" aconf >}}
resource "linode_instance" "terraform-www" {
  image = "linode/centos7"
  label = "www"
  group = "web"
  region = "us-south"
  type = "g6-standard-1"
  swap_size = 1024
  authorized_keys = [ "PUBLIC_SSH_KEY_HERE" ]
  root_pass = "ROOT_PASSWORD_HERE"
}
{{< /file >}}

1.  Check your plan for errors:

        terraform plan

1.  Apply all changes:

        terraform apply

1.  Check the Linode Manager to ensure that the `www` Linode was added to your account.


### Provision Multiple Servers Using Variables

Up to this point, the procedure for adding a new node to your infrastructure was to create a new file and run `terraform apply`. But what happens when your planned infrastructure has dozens of servers? In this example, you will use a very simplistic version of a Terraform configuration file that uses variables.

1.  For the purpose of this example you will need to delete the previous nodes created above:

        terraform plan -destroy

    That should return:

    {{< output >}}
Refreshing Terraform state in-memory prior to plan...
The refreshed state will be used to calculate this plan, but will not be
persisted to local or remote state storage.

linode_instance.terraform-example: Refreshing state... (ID: 10948649)

------------------------------------------------------------------------

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  - linode_instance.terraform-example


Plan: 0 to add, 0 to change, 1 to destroy.

------------------------------------------------------------------------

Note: You didn't specify an "-out" parameter to save this plan, so Terraform
can't guarantee that exactly these actions will be performed if
"terraform apply" is subsequently run.
{{</ output >}}

1.  Similar to `terraform plan`, the above command checks your infrastructure before performing any changes. To destroy the Linodes, run:

        terraform destroy

    That should return:

    {{< output >}}
linode_instance.terraform-example: Refreshing state... (ID: 10948649)

An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  - destroy

Terraform will perform the following actions:

  - linode_instance.terraform-example


Plan: 0 to add, 0 to change, 1 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

linode_instance.terraform-example: Destroying... (ID: 10948649)
linode_instance.terraform-example: Still destroying... (ID: 10948649, 10s elapsed)
linode_instance.terraform-example: Still destroying... (ID: 10948649, 20s elapsed)
linode_instance.terraform-example: Destruction complete after 21s

Destroy complete! Resources: 2 destroyed.
{{</ output >}}

1.  Verify the deletion in the Linode Manager.

1.  Delete (or move to a different location) all Terraform files.

        rm *.tf

1.  Create a new file to define variables. You can use any name but for this example use `variables.tf`:

    {{< file "~/terraform/variables.tf" aconf >}}
variable "token" {}
variable "authorized_keys" {}
variable "root_pass" {}
variable "region" {
  default = "us-south"
}
{{< /file >}}

1.  Create the file `terraform.tfvars` to store your variables. **You can't change this filename** after creating it.

    {{< file "~/terraform/terraform.tfvars" aconf >}}
token = "LINODE_API_KEY_HERE"
authorized_keys = "PUBLIC_SSH_KEY_HERE"
root_pass ="ROOT_PASSWORD_HERE"
{{< /file >}}

1.  Create a new configuration file called `linode-mod-template.tf`:

    {{< file "~/terraform/linode-mod-template.tf" aconf >}}
# Linode Provider definition

provider "linode" {
  token = "${var.token}"
}

# Example Web Server

resource "linode_instance" "www-01" {
        image = "linode/centos7"
        label = "www"
        group = "web"
        region = "us-south"
        type = "g6-standard-1"
        swap_size = 1024
        authorized_keys = [ "${var.authorized_keys}" ]
        root_pass = "${var.root_pass}"
}

# Example Database Server

resource "linode_instance" "db-01" {
        image = "linode/ubuntu18.04"
        label = "database"
        group = "web"
        region = "${var.region}"
        type = "g6-standard-1"
        swap_size = 1024
        authorized_keys = [ "${var.authorized_keys}" ]
        root_pass = "${var.root_pass}"
}
{{< /file >}}

1.  Check your new deployment for errors:

        terraform plan

1.  Apply all changes:

        terraform apply

    The end result is the same as before. The use of variables gives Terraform great flexibility, not only to store repetitive data (like keys) but also to assign default values to any field.


## Modify Live Deployments

Imagine you want to change the first server's name and size without needing to destroy and rebuild it. Simply change the values in the `.tf` file.

{{< caution >}}
Changing the size of your Linode will force your server to be powered off and migrated to a different host in the same data center. The associated disk migration will take approximately 1 minute for every 3-5 gigabytes of data. See our [Resizing a Linode](/docs/platform/disk-images/resizing-a-linode/) guide for more information.
{{< /caution >}}

1.  Modify the `linode-mod-template.tf` and update the `type` value to `g6-standard-4` for the `db-01` resource.

    {{< file "~/terraform/linode-mod-template.tf" aconf >}}
# Linode Provider definition

provider "linode" {
  token = "${var.token}"
}

# Example Web Server

resource "linode_instance" "www-01" {
        image = "linode/centos7"
        label = "www"
        group = "web"
        region = "us-south"
        type = "g6-standard-1"
        swap_size = 1024
        authorized_keys = [ "${var.authorized_keys}" ]
        root_pass = "${var.root_pass}"
}

# Example Database Server

resource "linode_instance" "db-01" {
        image = "linode/ubuntu18.04"
        label = "database"
        group = "web"
        region = "${var.region}"
        type = "g6-standard-4"
        swap_size = 2048
        authorized_keys = [ "${var.authorized_keys}" ]
        root_pass = "${var.root_pass}"
}
{{< /file >}}

1.  Check your plan:

        terraform plan

1.  Apply your changes:

        terraform apply

1.  Verify the changes in the Linode Manager.


## Terraform Modules

Terraform uses a concept called *modules* to group common server requirements and configurations. Think of modules as similar to *functions* in programming languages.

Take a look at the following file structure:

![Terraform Modules Tree](terraform-modules-tree.jpg)

There is a directory called `modules` containing the reusable code blocks (in this case `appserver`) and a `testing` directory containing the specific configuration to implement. It's a minimal layout but enough to highlight benefits.

Create the directory structure for the module files below:

    cd ~/terraform
    mkdir -p modules/appserver
    mkdir testing

### Basic Module Structure

The module structure is flexible, so you can use as many Terraform files as needed to describe your infrastructure. This example contains just one main configuration file describing the reusable code:

{{< file "~/terraform/modules/appserver/main.tf" aconf >}}
# Application Server

resource "linode_instance" "appserver" {
        image = "linode/ubuntu18.04"
        label = "${var.appserver_label}"
        group = "web"
        region = "${var.region}"
        type = "g6-standard-1"
        swap_size = 1024
        authorized_keys = "${var.authorized_keys}"
        root_pass = "${var.root_pass}"
}

# Database Server

resource "linode_instance" "dbserver" {
        image = "linode/centos7"
        label = "${var.dbserver_label}"
        group = "web"
        region = "${var.region}"
        type = "${var.db_type}"
        swap_size = 1024
        authorized_keys = "${var.authorized_keys}"
        root_pass = "${var.root_pass}"
}
{{< /file >}}

The configuration above reproduces the previous examples using variables. The next file contains variable definitions. Assign a default value for each variable. That value will be used if you don't override it when you call the module.

{{< file "~/terraform/modules/appserver/variables.tf" aconf >}}
variable "appserver_label" {
    description = "The name for the Application Server"
    default = "default-app"
}

variable "dbserver_label" {
    description = "The name for the Database Server"
    default = "default-db"
}

variable "db_type" {
    description = "The size (plan) for your Database Linode"
    default = "g6-standard-1"
}

variable "region" {
    description = "The default Linode region to deploy the infrastructure"
    default = "us-east"
}

variable "authorized_keys" {
    description = "The Public id_rsa.pub key used for secure SSH connections"
    default = ["default-ssh-public-key"]
}

variable "root_pass" {
    description = "The default root password for the Linode server"
    default = "default-root-password"
}

{{< /file >}}

### Working with Modules

1.  Create a `main.tf` configuration file that uses the module you just created. Ensure you replace the values for `authorized_keys` and `root_pass`:

    {{< file "~/terraform/testing/main.tf" aconf >}}
# Newark Testing Environment Infrastructure

provider "linode" {
  token = "LINODE_API_KEY_HERE"
}

module "appserver" {
  source = "../modules/appserver"

# Variables Specific to this Deployment

region = "us-east"
authorized_keys = [ "PUBLIC_SSH_KEY_HERE" ]
root_pass ="ROOT_PASSWORD_HERE"

# Variables Specific to Servers

appserver_label = "NJ-app"
dbserver_label = "NJ-db"
db_type = "g6-standard-8"

}
{{< /file >}}

1.  To use a module, call it by name with the command `module` and indicate the absolute path where it is saved. Then you can assign values to each field defined by a variable. The final result will be the same as if you pasted in all of the reusable code in the main configuration file.

        cd ~/terraform/testing/
        terraform init
        terraform plan
        terraform apply

    The possibilities of modules are endless. You can use several modules at once, you can mix the use of modules with traditional `resource` definitions, or you can even call modules from remote sources. For more information read the [Terraform modules documentation](https://www.terraform.io/docs/modules/index.html).
