---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Using Linode terraform provider.'
keywords: 'Linode,terraform,plugin,infrastructure'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: '... 2017'
modified: '... 2017'
modified_by:
  name: Linode
title: 'How to Build your Infrastructure Using Terraform and Linode'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Terraform Documentation](https://www.terraform.io/docs/index.html)'

---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $300 per published guide.*
<hr>

# Terraform Overview

Infrastructure as code (IaC) can be defined as the software that gives the developer the ability to build, manage and provision computer data centers through a high-level language. Some key benefits of this technology are: enforcing DevOps best practices, processes automation and the opportunity of using version control systems for greater visibility and collaboration among the team.
Terraform stands out from other IaC solutions because is an orchestration tool, which means *its designed specifically for bare-metal servers as well as virtual machines*. The configuration of the servers can be also achieved using Terraform, but implementing specialized software for such tasks as Puppet, Chef or Ansible is easily done through its provisioner architecture.
Another benefit of Terraform is its great flexibility. Due to its open source nature, the software is not bound to a specific vendor, you can use it on Linode, Amazon AWS, Google Cloud, Digital Ocean or any other custom cloud provider by means of plugins.
The main goal of this guide is to showcase Terraform benefits using Linode cloud technology.

{: .note}
>
>In order to focus on Terraform alone, the guide won't cover post configuration processes.

# Setup a Linode account

For the purpose of this guide, you will need to [Sign Up](https://manager.linode.com/signup) a Linode account. Enter your billing and account information. Most accounts are activated instantly, but some require manual review prior to activation. If your account is not immediately activated, you will receive an email with additional instructions.
Once you activate your account the Linode Manager Dashboard will show available plans:

![Linode Plans](/docs/assets/linode-manager-select-plan.png)

Congratulations, you are ready to start deploying your infrastructure.

# Creating Linode API keys

In order to start working with Terraform you you will need to generate Linode API keys. There are two ways to create your keys:

* Using Linode Manager.
* Using Linode CLI (Command Line Interface).

If you prefer using Linode Manager GUI then you can follow the steps described in [this guide](https://www.linode.com/docs/platform/api/api-key), *just be careful to take note of your API key because will show up only once*. In this guide we will be using Linode CLI on a Ubuntu 16.04 Workstation. For complete instructions of how to install Linode CLI on Linux and MacOS you can read [this guide](https://www.linode.com/docs/platform/linode-cli).

During Linode CLI configuration isn't necessary to specify any server default value (hit enter on each prompt) you will only need to enter the current path of your SSH public key. When finished your default API key will be saved to `/home/<user>/.linodecli/config`.

{: .note}
>
>You can create as many API keys as needed and tag them accordingly using your Linode Manager. You can also use Linode CLI passing the key value as an environment variable or directly in the command line with the `--api-key` flag if you don't want Linode CLI to have persistent access to your key. If you are working in a team just remember that your API key is linked to your Linode account, you can generate several keys and all of them are still linked to same single account.

# Installing Terraform on Ubuntu 16.04

First thing you need to understand is how Terraform works. Unlike other tools that require server agents (Chef, Puppet) Terraform is a "Client-Only" architecture. Matter of fact, Terraform is bundled as a single binary available for MacOS, FreeBSD, Linux, OpenBSD, Solaris and Windows. As mentioned before in this guide the chosen client is Ubuntu 16.04 but similar procedures should work in other platforms. The binary file contains the core of the application, providers and plugins can be added as required by the user.

In the particular case of Linode there is no official Terraform provider yet, that's why we'll be using a custom plugin and an installation from a developer's perspective, so is not necessary to download the pre-packaged binary.

## Install Go version 1.9

1. Download and extract `golang` in the appropriate location. Version 1.9 is required by Terraform:

        wget -c https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz
        sudo tar -C /usr/local -xvzf go1.9.linux-amd64.tar.gz

2. The language workspace (projects) demands that executables and source code have its own directories:

        mkdir -p ~/go_projects/{bin,src,pkg}

3. Next step is to add `Go` to the `PATH`, also for convenience the folder `~/go_projects/bin` will be included for Terraform and plugin packages usage. You can change it to any locaton that suits you, just be sure to include it in the `PATH`.

{: .file}
~/.profile
:   ~~~ conf

export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:$HOME/go_projects/bin
export GOPATH="$HOME/go_projects"
export GOBIN="$GOPATH/bin"
    ~~~

4. Reload your profile into memory:

        source ~/.profile

## Building the Linode plugin

1. Download Terraform repository, `Go` will save it in the appropriate location:

        go get github.com/hashicorp/terraform

2. Download the custom `terraform-provider-linode` repository, once again `Go` will save it in the workspace location:

        go get github.com/LinodeContent/terraform-provider-linode

3. By default source code is stored in `src` directory, go to the plugin `bin` location and build the package. Dependencies will be handled automatically by `godeps` that is already in the plugin folder.

        cd ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/bin/terraform-provider-linode

        go build -o terraform-provider-linode

4. Move the newly created executable to `~/go_projects/bin`:

        mv ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/bin/terraform-provider-linode/terraform-provider-linode ~/go_projects/bin

5. And now, move the `linode-template.tf` file to the same path:

        mv ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/linode-template.tf ~/go_projects/bin

{: .note}
>
>Up to this point, you have all binaries needed, `terraform` which comes with the Terraform GitHub repository and will locate itself on `go_projects/bin` and `terraform-provider-linode` that you just built. If the rest of your clients use the same OS then you can distribute these files among them. There is no need for each client to install `Go` or build the same package.

# Configuring Linode Provider

Terraform can understand two types of configuration files: JSON (meant for a server-friendly approach) and HashiCorp Configuration Language (HCL),designed to be human readable and editable. The provided file `linode-template.tf` is written in HCL, you can identify this kind of files because its characteristic extension `.tf`

{: .file}
~/go_projects/bin/linode-template.tf
:   ~~~ conf

provider "linode" {
  key = "your-linode-API-key-here"
}

resource "linode_linode" "your-terraform-name-here" {
        image = "Ubuntu 16.04 LTS"
        kernel = "Latest 64 bit"
        name = "your-linode-name-here"
        group = "your-linode-group-name-here"
        region = "Atlanta, GA, USA"
        size = 1024
        ssh_key = "your-ssh-id_rsa.pub-here"
        root_password = "your-root-password-here"
}
    ~~~

As you can see the content is self-explanatory. The first block of code defines the provider, in this case Linode, and the second block describes the resource itself: what distro will be used, kernel, name and group, region, memory, public ssh key and root password. That is the most basic information you will need to create a Linode. Let's start editing your Terraform plugin.

{: .note}
>For more specific information about Terraform [configuration syntax](https://www.terraform.io/docs/configuration/syntax.html) please read the documentation.

1. From the client command console check your Linode account (should be empty right now):

        linode list

![Linode Servers List](/docs/assets/linode-cli-list-01.jpg)

2. Modify `linode-template.tf`, remember to write your Linode API key, public SSH key and desired root password:

{: .file}
~/go_projects/bin/linode-template.tf
:   ~~~ conf

provider "linode" {
  key = "your-linode-API-key-here"
}

resource "linode_linode" "terraform-example" {
        image = "Ubuntu 16.04 LTS"
        kernel = "Latest 64 bit"
        name = "linode-example"
        group = "terraform-test"
        region = "Atlanta, GA, USA"
        size = 1024
        ssh_key = "your-ssh-id_rsa.pub-here"
        root_password = "your-server-password-here"
}
    ~~~

3. Assuming you are in `~/go_projects/bin` type the following command to initialize Terraform configuration:

        terraform init

You should see something similar to:

![Terraform Init](/docs/assets/terraform-init.jpg)

If any error is encountered you can run again the command in debug mode:

        TF_LOG=debug terraform init

That's it, the successful `init` output indicates you are ready to create your Linode servers!


#  Testing and deploying your Linode infrastructure

This section will present three Terraform examples, ranging from a single server Linode to a multi-server and multi-location infrastructure.

## Single Server Basic Linode

1. From your previous `linode-template.tf` run the following command to start testing Terraform:

        terraform plan

![Terraform Plan](/docs/assets/terraform-plan-01.jpg)

There shouldn't be any errors, but if you need to fix any problem you can activate the debug mode again:

        TF_LOG=debug terraform plan

The command above won't change anything in your Linode yet. Terraform uses a declarative approach, which means that your configuration file specifies the desired end state of the infrastructure. When you run `terraform plan` an analysis is done to know which actions are required to achieve such state.

2. In case your plan is free from errors you can create your infrastructure with the command:

        terraform apply

![Terraform Plan](/docs/assets/terraform-apply-01.jpg)

3. Now you can check the end result on your Linode:

        linode list

![Linode Servers List](/docs/assets/linode-cli-list-02.jpg)

The first example was something very easy, just to familiarize with the most simple Terraform work flow: *initialize* your configuration, *plan* to check for errors and *apply* the changes.

## Two Server Configuration

Now that you have a `linode-example` running just imagine you need to implement a typical "Web server / Database Server" deployment. Let's assume you want to use the current Linode, the procedure to add another server is very straightforward:

1. From the `linode-template.tf` create another file called `linode-www.tf` (don't delete `linode-template.tf`):

{: .file}
~/go_projects/bin/linode-www.tf
:   ~~~ conf

resource "linode_linode" "terraform-www" {
        image = "CentOS 7"
        kernel = "Latest 64 bit"
        name = "www"
        group = "web"
        region = "Dallas, TX, USA"
        size = 2048
        swap_size = 1024
        ssh_key = "your-ssh-id_rsa.pub-here"
        root_password = "your-server-password-here"
}
	~~~

Some aspects you need to be aware:

* Terraform loads into memory all files with the ".tf" extension present in the working directory. As a result all files are "concatenated" (in memory). That's the reason because you don't need to define the provider on this file, it was declared on `linode-template.tf`.
* Resources can't be duplicated, so you need to assign a unique name for each one.
* In this example the same SSH key and root password is being used. You can change that easily for testing or production.
* A new parameter `swap_size` is used to override the default value of 512Mb. You can check all available options for `terraform-provider-linode` in the plugin GitHub repository [readme.md](https://github.com/LinodeContent/terraform-provider-linode).

2. Time to check that your plan has no errors:

        terraform plan

![Terraform Plan](/docs/assets/terraform-plan-02.jpg)

3. The final step is to apply all changes:

        terraform apply

![Terraform Plan](/docs/assets/terraform-apply-02.jpg)

To check the new server you can do it from command console:

![Linode Servers List](/docs/assets/linode-cli-list-03.jpg)

To expand this example a bit further just imagine you want to change the first server name and tag to something more relevant and also you want to increase the size to match the newly created Linode.

1. Modify the `linode-template.tf`

{: .file}
~/go_projects/bin/linode-template.tf
:   ~~~ conf

provider "linode" {
  key = "your-linode-API-key-here"
}

resource "linode_linode" "terraform-example" {
        image = "Ubuntu 16.04 LTS"
        kernel = "Latest 64 bit"
        name = "database"
        group = "web"
        region = "Atlanta, GA, USA"
        size = 2048
        swap_size = 1024
        ssh_key = "your-ssh-id_rsa.pub-here"
        root_password = "your-server-password-here"
}
	~~~

2. Check again your plan:

        terraform plan

![Terraform Plan](/docs/assets/terraform-plan-03.jpg)

3. And apply your changes:

        terraform apply

![Terraform Plan](/docs/assets/terraform-apply-03.jpg)

{: .caution}
>
>Changing the size of your Linode will force your server to be powered off and migrated to a different host in the same data center. The associated disk migration will take approximately 1 minute for every 3-5 gigabytes of data. For more information about resizing read [this article.](https://www.linode.com/docs/platform/disk-images/resizing-a-linode)

4. Check your account as usual:

        linode list

![Linode Servers List](/docs/assets/linode-cli-list-04.jpg)


## More Advanced Configuration example

Up to this point, the procedure for adding a new node to your infrastructure was to create a new file and run the `terraform apply` command. But what happens when your planned infrastructure have dozens of servers? In this example, you will use a very simplistic version of a Terraform configuration file that uses variables.

1.  For the purpose of this example you will need to delete previous nodes:

        terraform plan -destroy

![Plan for destroy Linodes](/docs/assets/terraform-destroy-01.jpg)

2. Similar to `terraform plan` the above command checks your infrastructure before doing any change. To perform the deletion run the command:

        terraform destroy

![Destroy Linodes](/docs/assets/terraform-destroy-02.jpg)

3. Let's check your Linode account:

        linode list

![Linode Servers List](/docs/assets/linode-cli-list-01.jpg)

4. Delete (or move to a different location) all Terraform files.

        rm *.tf*

5. Create a new file to define variables, you can use any name, for this example we'll use `variables.tf`:

{: .file}
~/go_projects/bin/variables.tf
:   ~~~ conf

variable "linode_key" {}
variable "ssh_key" {}
variable "root_password" {}
variable "region" {
      default = "Atlanta, GA, USA"
}
	~~~

6. Create a file named `terraform.tfvars` to store your variables values *you can't change this name*:

{: .file}
~/go_projects/bin/terraform.tfvars
:   ~~~ conf

linode_key = "your-linode-API-key-here"
ssh_key = "your-ssh-id_rsa.pub-here"
root_password ="your-root-password-here"
	~~~

7. Create a new configuration file called `linode-mod-template.tf`

{: .file}
~/go_projects/bin/linode-mod-template.tf
:   ~~~ conf

# Linode Provider definition

provider "linode" {
  key = "${var.linode_key}"
}

# Example Web Server

resource "linode_linode" "www-01" {
        image = "CentOS 7"
        kernel = "Latest 64 bit"
        name = "www"
        group = "web"
        region = "Dallas, TX, USA"
        size = 2048
        swap_size = 1024
        ssh_key = "${var.ssh_key}"
        root_password = "${var.root_password}"
}

# Example Database Server

resource "linode_linode" "db-01" {
        image = "Ubuntu 16.04 LTS"
        kernel = "Latest 64 bit"
        name = "database"
        group = "web"
        region = "${var.region}"
        size = 2048
        swap_size = 1024
        ssh_key = "${var.ssh_key}"
        root_password = "${var.root_password}"
}
	~~~

8. Check your new deployment for errors:

        terraform plan

![Terraform Plan](/docs/assets/terraform-plan-04.jpg)

9. Apply all changes:

        terraform apply

![Terraform Plan](/docs/assets/terraform-apply-04.jpg)

10. Finally check your Linode account:

        linode list

![Linode Servers List](/docs/assets/linode-cli-list-04.jpg)

As you can see the end result is the same as before. The use of variables gives Terraform great flexibility, not only it allow to store repetitive data (as keys) but also you can assign default values to any field.

{: .note}
>
>Before reading next section take a moment to experiment with Terraform commands, create new servers, change names, resize. Once you are done please destroy all Linodes and delete associated files.

# Managing your infrastructure

So far, the guide has covered the tip of the iceberg of what Terraform can do. This final section will cover briefly:

* The ability to reuse your code.
* How to overcome the limitation of hard-coded values.
* An introduction to Terraform server configuration solutions.

## Terraform Modules 

The idea behind any code-driven solution is to avoid repetitive blocks. Terraform uses a concept called *modules* to group common server requirement, configurations and provisioning. You can think of modules as an equivalent to *functions* in programming languages. Modules implementation can't be easier: as discussed before Terraform loads by default any file with the extension **.tf** into memory, what was not mentioned is that this feature applies to sub-folders as well.

Take a look at the following file structure:

![Terraform Modules Tree](/docs/assets/terraform-modules-tree.jpg)

There is a directory called `modules` containing the reusable code blocks in this case `appserver` and a `testing` directory containing the specific configuration to implement. Is a minimal layout but enough to highlight modules benefits.

### Basic Module structure

Modules structure is totally flexible, you can use as many terraform files as needed to describe your infrastructure. As mentioned above this example will use the easier template possible, just one main configuration file describing the reusable code:

{: .file}
~/go_projects/bin/modules/appserver/main.tf
:   ~~~ conf

# Application Server

resource "linode_linode" "appserver" {
        image = "Ubuntu 16.04 LTS"
        kernel = "Latest 64 bit"
        name = "${var.appserver_name}"
        group = "web"
        region = "${var.region}"
        size = 2048
        swap_size = 1024
        ssh_key = "${var.ssh_key}"
        root_password = "${var.root_password}"

}

# Database Server

resource "linode_linode" "dbserver" {
        image = "CentOS 7"
        kernel = "Latest 64 bit"
        name = "${var.dbserver_name}"
        group = "web"
        region = "${var.region}"
        size = "${var.db_size}"
        swap_size = 1024
        ssh_key = "${var.ssh_key}"
        root_password = "${var.root_password}"
}
	~~~

Notice the widespread use of variables, you can choose how many and where to use them. For simplicity purposes the module will reproduce the same infrastructure used before consisting on only two servers. Once again both servers share the same SSH key and `root` password, remember that you can change that behavior using different variables. One parameter that is not present in this file is the Linode API key, besides that the code is very similar to the previous examples.

The next file contains variables definitions:

{: .file}
~/go_projects/bin/modules/appserver/variables.tf
:   ~~~ conf

variable "appserver_name" {
    description = "The name for the Application Server"
	default = "default-app"
}

variable "dbserver_name" {
    description = "The name for the Database Server"
	default = "default-db"
}

variable "db_size" {
    description = "The size (plan) for your Database Linode"
	default = "1024"
}

variable "region" {
    description = "The default Linode region to deploy the infrastructure"
	default = "default-region"
}

variable "ssh_key" {
    description = "The Public id_rsa.pub key used for secure SSH connections"
	default = "default-ssh-key"
}

variable "root_password" {
    description = "The default root password for the Linode server"
	default = "default-root-pwd"
}
	~~~

{: .note}
>
>It's necessary to assign a default value for each variable. That value will be used if you don't override it when you call the module.

Finally, you need a "main" configuration file (or any other name that suits you) that uses the module you just created:

{: .file}
~/go_projects/bin/testing/main.tf
:   ~~~ conf

# Newark Testing Environment Infrastructure

provider "linode" {
  key = "your-linode-API-key-here"
}

module "appserver" {
  source = "/your/absolute/path/to/modules/appserver"

# Variables Specific to this Deployment

region = "Newark, NJ, USA"
ssh_key = "your-ssh-id_rsa"
root_password ="your-root-password-here"

# Variables Specific to Servers

appserver_name = "NJ-app"
dbserver_name = "NJ-db"
db_size = "8192"

}
	~~~

As you can see using modules is very easy, just call them by name with the commad `module` and indicate the absolute path where they are saved. Then, you can assign values to each field defined by a variable. The final result would be the same as if you copy-paste all reusable code in the main configuration file. Let's deploy this infrastructure.

        cd ~/go_projects/bin/testing/
        terraform init && terraform plan

![Terraform Modules Plan](/docs/assets/terraform-modules-plan.jpg)

        terraform apply

![Terraform Modules Apply](/docs/assets/terraform-modules-apply.jpg)

        linode list

![Terraform Modules List](/docs/assets/terraform-modules-list.jpg)

Modules possibilities are endless: you can use several modules at once, you can mix the use of modules with traditional `resource` definitions, you can even call modules from remote sources (version systems). For more information read Terraform [modules documentation](https://www.terraform.io/docs/modules/index.html).

## Server Configuration

It's out of the scope of this guide explain server configuration but is worth mentioning that Terraform offers many ways to set up your Linode:

* Using custom scripts, that can be included on configuration file itself or called from a local or remote file.
* Using specialized software tools integrated with Terraform like Chef or Puppet.
* Using container-based solutions like Docker, Kubernetes.
* Using Terraform plugin-based solutions.

The options doesn't end here, there are plenty of [provisioners](https://www.terraform.io/docs/provisioners/index.html), [providers](https://github.com/terraform-providers) and even [modules](https://registry.terraform.io) available to use.
