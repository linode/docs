---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Use Terraform to deploy Linodes containing pre-configured application environmets built using Docker or Packer, for example, or from manual configuration.'
og_description: 'Use Terraform to deploy Linodes containing pre-configured application environmets built using Docker or Packer, for example, or from manual configuration.'
keywords: 'Linode,terraform,plugin,infrastructure'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, November 6th, 2017'
modified: 'Monday, November 6th, 2017'
modified_by:
  name: Linode
title: 'Using Terraform to Provision Linode Environments'
contributor:
  name: Damaso Sanoja
external_resources:
 - '[Terraform Documentation](https://www.terraform.io/docs/index.html)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $300 per published guide.*

---

Infrastructure as code (IaC) is software that gives the developer the ability to build, manage, and provision computing environments with a high-level programming language. Some key benefits of this technology are: enforcing DevOps best practices, processes automation and the opportunity to version control systems for greater visibility and collaboration within a team.

Terraform stands out from other IaC solutions because it's an orchestration tool, which means *it's designed specifically for bare-metal server and virtual machines*. The configuration of the servers can be achieved using Terraform, but implementing specialized software for tasks like Puppet, Chef, or Ansible are easily done through a provisioner architecture.
This guide will showcase Terraform, and its benefits when used in conjuction with Linode's cloud technology.


{:.caution}
> The configurations and commands used in this guide, will result in multiple Linodes being added to your account. Be sure to monitor your account closely using the Linode Manager to avoid unwanted charges.

## Before You Begin

1.  You will need a Linode account. [Sign up](https://manager.linode.com/signup) here if you don't already have one.

2.  Follow the steps described in [this guide](https://www.linode.com/docs/platform/api/api-key) to create an API key for your Linode account. Be sure to write down the API key when it's displayed, it will only appear once.

    {: .note}
    >
    > Terraform automates the build process of an app's infrastructure, including creating the necessary amount Linodes for your project. As a result, unless otherwise specified, all commands in this guide should be run from a client machine. This guide will assume that your client machine is running Ubuntu 16.04, but similar procedures should work on other platforms.

# Installing Terraform on Ubuntu 16.04

Unlike other tools that require server agents (Chef & Puppet,) Terraform is a "Client-Only" architecture. In fact, Terraform is bundled as a single binary available for MacOS, FreeBSD, Linux, OpenBSD, Solaris and Windows. The binary file contains the core of the application; providers and plugins can be added as required by the user.

{:.note}
>
>In the particular case of Linode there is no official Terraform plugin yet.

## Install Golang

1.  Install Git if it's not already on your system:

       apt install git

2.  Download and extract `golang` to the appropriate location. Terraform requires Version 1.9:

       wget -c https://storage.googleapis.com/golang/go1.9.linux-amd64.tar.gz
       sudo tar -C /usr/local -xvzf go1.9.linux-amd64.tar.gz

3.  The language workspace (projects) demands that executables and source code have their own directories:

       mkdir -p ~/go_projects/{bin,src,pkg}

4.  Next step is to add `Go` to the `PATH`. For convenience the folder `~/go_projects/bin` will be included for Terraform and plugin packages. 

    {: .file-excerpt}
    ~/.profile
    :   ~~~ conf
        export PATH=$PATH:/usr/local/go/bin
        export PATH=$PATH:$HOME/go_projects/bin
        export GOPATH="$HOME/go_projects"
        export GOBIN="$GOPATH/bin"
        ~~~

5.  Reload your profile into memory:

       source ~/.profile

{:.note}
>
> You can change the variables to any location that suits you, just be sure to include it in the `PATH`.


<!---
## Building the Linode plugin

1.  Download Terraform repository, `Go` will save it in the appropriate location:

        go get github.com/hashicorp/terraform

2.  Download the custom `terraform-provider-linode` repository, once again `Go` will save it in the workspace location:

        go get github.com/LinodeContent/terraform-provider-linode

3.  By default source code is stored in `src` directory, go to the plugin `bin` location and build the package. Dependencies will be handled automatically by `godeps` that's already in the plugin folder.

        cd ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/bin/terraform-provider-linode

        go build -o terraform-provider-linode

4.  Move the newly created executable to `~/go_projects/bin`:

        mv ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/bin/terraform-provider-linode/terraform-provider-linode ~/go_projects/bin

5.  And now, move the `linode-template.tf` file to the same path:

        mv ~/go_projects/src/github.com/LinodeContent/terraform-provider-linode/linode-template.tf ~/go_projects/bin

{: .note}
>
> AT this point, you have all binaries needed, `terraform` which comes with the Terraform GitHub repository and will locate itself on `go_projects/bin` and `terraform-provider-linode` that you just built. If the rest of your clients use the same OS then you can distribute these files among them. There is no need for each client to install `Go` or build the same package.
--->

## Install Terraform 

1.  Download the Terraform repository:

        go get github.com/hashicorp/terraform

2.  Get the Linode plugin for Terraform:

      wget https://github.com/linode/docs-scripts/raw/master/hosted_scripts/terraform-linode-plugin/terraform-provider-linode 

3.  Move the plugin to `~go_projects/bin`:

       mv terraform-provider-linode ~/go_projects/bin/
       chmod 750 ~/go_projects/bin/terraform-provider-linode

# Configure the Linode Provider

Terraform can understand two types of configuration files: JSON and HashiCorp Configuration Language (HCL). This guide will use the HCL format, designated by the extension `.tf`.

1.  Open `linode-template.tf` in a text editor and add the following content. Fill in your Linode API key, public SSH key, and desired root password where indicated:

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

       The first block defines the provider-- in this case Linode, the second block describes the resource: what distribution will be used, kernel, name and group, region, memory, public ssh key and root password. This information is needed to create a Linode. 

      {: .note}
      >
      >For more specific information about Terraform [configuration syntax](https://www.terraform.io/docs/configuration/syntax.html) please read the documentation.

2.  Navigate to `~/go_projects/bin` and initialize the Terraform configuration:

       cd ~/go_projects/bin
       terraform init

    You should see something similar to:

    ![Terraform Init](/docs/assets/terraform/terraform-init.jpg)

3.  If an error is encountered you can run the command again in debug mode:

        TF_LOG=debug terraform init

That's it, the successful `init` output indicates that you are ready to create your Linodes.

##  Test and Deploy the Linode Infrastructure

This section will present three Terraform examples, ranging from a single Linode to a multi-server and multi-location infrastructure.

### Single Server Basic Linode

1.  Check your Terraform plan:

       terraform plan

    ![Terraform Plan](/docs/assets/terraform/terraform-plan-01.jpg)

    There shouldn't be any errors, but if you need to fix any problems you can activate debug mode again:

       TF_LOG=debug terraform plan

    The command above won't take any action or make any changes on your Linode account, yet. Terraform uses a declarative approach, that means that your configuration file specifies the desired end-state of the infrastructure. When you run `terraform plan`, an analysis is done to know which actions are required to achieve this state.

2.  If there are no errors you can create your infrastructure with the command:

       terraform apply

    ![Terraform Plan](/docs/assets/terraform/terraform-apply-01.jpg)

3.  Open the Linode Manager. You should see a new Linode, `linode-test`, that has been added to your account.

The most simple Terraform work flow is: *initialize* your configuration, *plan* to check for errors and *apply* the changes.

## Two Server Configuration

Now that you have a `linode-example` running, imagine you need to implement a typical "Web server / Database Server" deployment. If you want to add another Linode, the procedure to add another server is very straightforward:

1.  From the `linode-template.tf` create another file called `linode-www.tf` (don't delete `linode-template.tf`):

    {:.file}
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

    {:.note}
    > Remember:    
    >
    > * Terraform loads into memory all files with the ".tf" extension present in the working directory. As a result all files are "concatenated" (in memory). As a result you don't need to define the provider on this file, since it was declared in `linode-template.tf`.
    >
    > * Resources can't be duplicated, so you need to assign a unique name for each one.
    >
    > * In this example the same SSH key and root password is being used. You can change that easily for testing or production.
    >
    > * A new parameter `swap_size` is used to override the default value of 512Mb. You can check all available options for `terraform-provider-linode` in the plugin GitHub repository [readme.md](https://github.com/LinodeContent/terraform-provider-linode).
    
2.  Check your plan for errors:

       terraform plan

      ![Terraform Plan](/docs/assets/terraform/terraform-plan-02.jpg)

3.  The final step is to apply all changes:

       terraform apply

      ![Terraform Plan](/docs/assets/terraform/terraform-apply-02.jpg)

4.  Check the Linode Manager to ensure that another Linode, `www`, has been added to the `web` display group on your account.

## Adjust Architecture

To expand this example a bit further just imagine you want to change the first server name and tag to something more relevant and also you want to increase the size to match the newly created Linode.

1.  Modify the `linode-template.tf`

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

2.  Check your plan:

       terraform plan

     ![Terraform Plan](/docs/assets/terraform/terraform-plan-03.jpg)

3.  Apply your changes:

       terraform apply

    ![Terraform Plan](/docs/assets/terraform/terraform-apply-03.jpg)

    {: .caution}
    >
    >Changing the size of your Linode will force your server to be powered off and migrated to a different host in the same data center. The associated disk migration will take approximately 1 minute for every 3-5 gigabytes of data. For more information about resizing read [this article.](https://www.linode.com/docs/platform/disk-images/resizing-a-linode)

4.  Open the Linode Manager to verify the changes.


## Advanced Configuration Example

Up to this point, the procedure for adding a new node to your infrastructure was to create a new file and run the `terraform apply` command. But what happens when your planned infrastructure has dozens of servers? In this example, you will use a very simplistic version of a Terraform configuration file that uses variables.

1.  For the purpose of this example you will need to delete previous nodes:

        terraform plan -destroy

     ![Plan for destroy Linodes](/docs/assets/terraform/terraform-destroy-01.jpg)

2.  Similar to `terraform plan` the above command checks your infrastructure before doing any change. To perform the deletion run the command:

       terraform destroy

    ![Destroy Linodes](/docs/assets/terraform/terraform-destroy-02.jpg)

3.  Use the Linode Manager to verify the deletion.

4.  Delete (or move to a different location) all Terraform files.

       rm *.tf*

5.  Create a new file to define variables, you can use any name, for this example we'll use `variables.tf`:

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

6.  Create a file named `terraform.tfvars` to store your variables values *you can't change this name*:

    {:.file}
    ~/go_projects/bin/terraform.tfvars
    : ~~~ conf
      linode_key = "your-linode-API-key-here"
      ssh_key = "your-ssh-id_rsa.pub-here"
      root_password ="your-root-password-here"
      ~~~

7.  Create a new configuration file called `linode-mod-template.tf`

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

8.  Check your new deployment for errors:

       terraform plan

    ![Terraform Plan](/docs/assets/terraform/terraform-plan-04.jpg)

9.  Apply all changes:

       terraform apply

    ![Terraform Plan](/docs/assets/terraform/terraform-apply-04.jpg)

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

The idea behind any code-driven solution is to avoid repetitive blocks. Terraform uses a concept called *modules* to group common server requirements and configurations. You can think of modules as an equivalent to *functions* in programming languages. 

Take a look at the following file structure:

![Terraform Modules Tree](/docs/assets/terraform/terraform-modules-tree.jpg)

There is a directory called `modules` containing the reusable code blocks in this case `appserver` and a `testing` directory containing the specific configuration to implement. Is a minimal layout but enough to highlight benefits  modules.

### Basic Module structure

Module structure is flexible, you can use as many terraform files as needed to describe your infrastructure. This example contains just one main configuration file describing the reusable code:

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

Notice the use of variables, you can choose how many and where to use them. For this purposes the module will reproduce the same infrastructure used before consisting of only two servers. Once again both servers share the same SSH key and `root` password, remember that you can change that behavior using different variables. One parameter that's not present in this file is your Linode API key, besides that the code is very similar to the previous examples.

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

Finally, you need a "main" configuration file that uses the module you just created:

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

Using modules is easy, just call them by name with the command `module` and indicate the absolute path where they are saved. Then, you can assign values to each field defined by a variable. The final result would be the same as if you pasted in all of the reusable code in the main configuration file. Let's deploy this infrastructure:

    cd ~/go_projects/bin/testing/
    terraform init && terraform plan

![Terraform Modules Plan](/docs/assets/terraform/terraform-modules-plan.jpg)

    terraform apply

![Terraform Modules Apply](/docs/assets/terraform/terraform-modules-apply.jpg)


Modules possibilities are endless: you can use several modules at once, you can mix the use of modules with traditional `resource` definitions, you can even call modules from remote sources (version systems). For more information read Terraform [modules documentation](https://www.terraform.io/docs/modules/index.html).

## Server Configuration

Server configuration is beyond the scope of this guide, but it is worth mentioning that Terraform offers many ways to set up your Linode:

* Using custom scripts, that can be included on configuration file itself or called from a local or remote file.
* Using specialized software tools integrated with Terraform like Chef or Puppet.
* Using container-based solutions like Docker, Kubernetes.
* Using Terraform plugin-based solutions.

There are also plenty of [provisioners](https://www.terraform.io/docs/provisioners/index.html), [providers](https://github.com/terraform-providers) and even [modules](https://registry.terraform.io) available to use.
