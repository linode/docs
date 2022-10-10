---
slug: create-a-nodebalancer-with-terraform
author:
  name: Linode
  email: docs@linode.com
description: 'This guide provides you with step-by-step instructions for installing Terraform and utilizing the tool to create a NodeBalancer and Nodes for your Linodes.'
keywords: ['terraform','nodebalancer','node','balancer','provider','linode']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-12
modified: 2021-12-29
modified_by:
  name: Linode
image: CreateaNodeBalancerwitTerraform.png
title: "Create a NodeBalancer with Terraform"
contributor:
  name: Linode
external_resources: 
- '[Terraform Linode Provider Reference](https://www.terraform.io/docs/providers/linode/index.html)'
- '[linode_nodebalancer Resource Reference](https://www.terraform.io/docs/providers/linode/r/nodebalancer.html)'
- '[linode_nodebalancer_config Resource Reference](https://www.terraform.io/docs/providers/linode/r/nodebalancer_config.html)'
- '[linode_nodebalancer_node Resource Reference](https://www.terraform.io/docs/providers/linode/r/nodebalancer_node.html)'
- '[linode_instance Resource Reference](https://www.terraform.io/docs/providers/linode/r/instance.html)'
- '[Terraform Random Provider Reference](https://www.terraform.io/docs/providers/random/index.html)'
- '[Terraform Built-In Function Reference](https://www.terraform.io/docs/configuration/interpolation.html#supported-built-in-functions)'
aliases: ['/applications/configuration-management/create-a-nodebalancer-with-terraform/','/applications/configuration-management/terraform/create-a-nodebalancer-with-terraform/']
---

Terraform allows you to represent Infrastructure as Code (IaC). You can use it to manage infrastructure, speed up deployments, and share your infrastructure's configuration files within a team. In this guide you will use Terraform to create a NodeBalancer that distributes traffic between two Linodes.

{{< caution >}}
The configurations and commands used in this guide will result in multiple billable resources being added to your account. Be sure to monitor your account closely in the Linode Cloud Manager to avoid unwanted charges. See the [Billings and Payments](/docs/guides/understanding-billing-and-payments/) guide for more details.

If you would like to stop billing for the resources created in this guide, [remove them](#optional-remove-the-nodebalancer-resources) when you have finished your work.
{{< /caution >}}

## Before You Begin

1.  You should have Terraform installed in your development environment, and have a working knowledge of Terraform resource configuration and the [Linode provider](https://www.terraform.io/docs/providers/linode/index.html). For more information on how to install and use Terraform, check out our [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.

    {{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12+.  To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.

The examples in this guide were written to be compatible with [Terraform version 0.11](https://www.terraform.io/docs/configuration-0-11/terraform.html) and will be updated in the near future.
    {{</ note >}}

1.  Terraform requires an API access token. Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) guide to obtain a token.

1.  Create a `terraform_nodebalancer` directory on your computer for the Terraform project you will create in this guide. All files you create in this guide should be placed in this directory, and you should run all commands from this directory. This new project should not be created inside another Terraform project directory, including the one you may have made when previously following [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/).

## Create a Terraform Configuration File

### Create a Provider Block

The first step to take when creating a Terraform configuration file is to create a *provider block*. This block lets Terraform know which provider to use. The only configuration value that the Linode provider needs is an API access token.

Create a file named `nodebalancer.tf` in your Terraform project directory. You will be adding to this file throughout the guide. Add the provider blocks to the file:

{{< file "nodebalancer.tf" >}}

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
{{< /file >}}

This provider block uses variable interpolation to access the value of your API token. You will create input variables in a separate `variables.tf` file later in the [Define Terraform Variables](#define-terraform-variables) section of this guide. Any input variables you define within the `variables.tf` file are available from the `var` dictionary using dot notation. You will be using variable interpolation and referencing variables with dot notation throughout this guide.

### Create a NodeBalancer Resource

Create a NodeBalancer resource in the `nodebalancer.tf` file:

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer" "example-nodebalancer" {
    label = "examplenodebalancer"
    region = var.region
}

...
{{< /file >}}

The `linode_nodebalancer` resource supplies two labels. The first label, `example-nodebalancer`, is used internally by Terraform. The second label, `examplenodebalancer`, is used to reference your NodeBalancer in tools like the Manager and the Linode CLI. The region for this NodeBalancer is supplied with the variable `region`.

### Create NodeBalancer Config Resources

In addition to the NodeBalancer resource, you must supply at least one NodeBalancer Configuration resource. This resource defines ports, protocol, health checks, and session stickiness, among other options, that the NodeBalancer might use. For this example, you will create a NodeBalancer configuration for HTTP access on port 80, but you could also create one for HTTPS access on port 443 if you have [SSL/TLS certificates](/docs/guides/install-lets-encrypt-to-create-ssl-certificates/):

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer_config" "example-nodebalancer-config" {
    nodebalancer_id = linode_nodebalancer.example-nodebalancer.id
    port = 80
    protocol = "http"
    check = "http_body"
    check_path = "/healthcheck/"
    check_body = "healthcheck"
    check_attempts = 30
    check_timeout = 25
    check_interval = 30
    stickiness = "http_cookie"
    algorithm = "roundrobin"
}

...
{{< /file >}}

The NodeBalancer Config resource requires a NodeBalancer ID, which is populated in the first line with the variable `linode_nodebalancer.example-nodebalancer.id`. Because the `nodebalancer_id` argument references a NodeBalancer that has not been created yet, you can use this variable as a placeholder to reference the NodeBalancer ID. Terraform will automatically know to create the NodeBalancer resource before it creates any other resources that reference it. In this way you can craft intricate infrastructure that references its own parts, without having to worry about the order the resources appear in the Terraform configuration or whether or not the resources already exist.

As far as settings go, the health check is set to `http_body`, meaning that the health check will look for the string set by `check_body` within the body of the page set at `check_path`. The NodeBalancer will take a node out of rotation after 30 failed check attempts. Each check will wait for a response for 25 seconds before it is considered a failure, with 30 seconds between checks. Additionally, the session stickiness setting has been set to `http_cookie`. This means that the user will continue to be sent to the same server by the use of a session cookie. The algorithm has been set to `roundrobin`, which will sort users evenly across your backend nodes based on which server was accessed last.

{{< note >}}
Review the [NodeBalancer Reference Guide](/docs/platform/nodebalancer/nodebalancer-reference-guide) for a full list of NodeBalancer configuration options.
{{< /note >}}

### Create NodeBalancer Node Resources

The third part of setting up a NodeBalancer in Terraform is creating the NodeBalancer Node resource. This resource contains information about the individual Nodes and how they pertain to the NodeBalancer and NodeBalancer Configuration resources.

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer_node" "example-nodebalancer-node" {
    count = var.node_count
    nodebalancer_id = linode_nodebalancer.example-nodebalancer.id
    config_id = linode_nodebalancer_config.example-nodebalancer-config.id
    label = "example-node-${count.index + 1}"
    address = "${element(linode_instance.example-instance.*.private_ip_address, count.index)}:80"
    mode = "accept"
}

...
{{< /file >}}

This resource's `count` argument will be populated with the `node_count` input variable you will define later on in this guide. The `count` argument tells Terraform that it should provision `node_count` number of Nodes.

Because provisioning more than one node creates a loop in the Terraform process, where the step for creating a node is repeated, you can use the `count.index` variable to keep track of which iteration Terraform is on in the loop. The interpolation `{count.index + 1}` in the node's `label` argument tells Terraform that you'd like each of the nodes to be labeled sequentially, and because `count.index` starts at zero, you'd like the count to begin at one.

`linode_instance.example-instance.*.private_ip_address` references the private IP addresses of the yet-to-be-created Linode instances. In the next step, the Linode Instance resources will be labeled `example-instance`. Terraform has access to some attributes for each of the resources it creates, and `private_ip_address` is one of the available attributes from a Linode Instance resource. Because there will be two Linode instances created during the same step, Terraform groups these sets of attributes in a list. The `element()` function allows you to grab a single item from a list based on the item index. Here, instead of providing a hard-coded number for the index you can instead provide `count.index`. In this way the first NodeBalancer Node will reference the private IP address of the first Linode instance, and the second NodeBalancer Node will reference the private IP address of the second instance.

### Create a Linode Instance Resource

Now that you have the NodeBalancer configured, you need to supply it with a Linode Instance resource. This resource will allow Terraform to know which instances it needs to create to meet the demand of our NodeBalancer example.

{{< file "nodebalancer.tf" >}}
...

resource "linode_instance" "example-instance" {
    count  = var.node_count
    label  = "example-instance-${count.index + 1}"
    group = "nodebalancer-example"
    tags = ["nodebalancer-example"]
    region = var.region
    type = "g6-nanode-1"
    image = "linode/ubuntu18.10"
    authorized_keys = [chomp(file(var.ssh_key))]
    root_pass = random_string.password.result
    private_ip = true

    provisioner "remote-exec" {
        inline = [
            # install NGINX
            "export PATH=$PATH:/usr/bin",

            "apt-get -q update",
            "mkdir -p /var/www/html/",
            "mkdir -p /var/www/html/healthcheck",
            "echo healthcheck > /var/www/html/healthcheck/index.html",
            "echo node ${count.index + 1} > /var/www/html/index.html",
            "apt-get -q -y install nginx",
        ]

        connection {
            type = "ssh"
            user = "root"
            password = random_string.password.result
            host = self.ip_address
        }
    }
}

...
{{< /file >}}

The above resource uses the same `count` argument as the NodeBalancer Node resource that was configured in the previous step. Also, the `label` argument is being sequentially incremented in a similar fashion to the NodeBalancer Node.

The `authorized_keys` argument is supplied an SSH key input variable that will be defined later in this guide. It is passed to the `file()` function, which reads the contents of a file into a string. That string is then passed to the `chomp()` function, which strips any extra whitespace.

`root_pass` is given the result of the `random_string` resource that will be defined later in this guide.

The last thing of note in this Linode Instance resource is the `remote-exec` Provisioner block. This block contains two other components, the `inline` list and `connection` block. `inline` is a list of commands that Terraform will execute on the Linode instance once the Linode instance has booted. In this example, the inline commands will: update the Linode instance, create the necessary directory structure for NGINX, create the health check file and the more generalized `index.html` file, and install NGINX.

The `connection` block explains to Terraform how it should gain access to the Linode instance in order to run the commands supplied by the `inline` list. In this case, Terraform will gain access over SSH, logging in as the `root` user.

### Create an Output

The last step that you'll take in creating `nodebalancer.tf` is adding an output. Terraform will add this information to the end of it's output in the terminal. Outputs can be any information from your configuration you would like to expose. Below is an example that will display the public IP address of the NodeBalancer:

{{< file "nodebalancer.tf" >}}
...

output "nodebalancer_ip_address" {
    value = linode_nodebalancer.example-nodebalancer.ipv4
}
{{< /file >}}

## Define Terraform Variables

You will now declare all variables required by your Terraform configuration in a `variables.tf` file.

1.  Create a file called `variables.tf`. This file will create the variables referenced in the configuration of your NodeBalancer and Nodes. You will supply values to the variables in another step.

    {{< file "variables.tf" >}}
variable "token" {
    description = "Your APIv4 Access Token"
}

variable "region" {
    description = "The data center where your NodeBalancer and Nodes will reside. E.g., 'us-east'."
    default = "us-west"
}

variable "node_count" {
    description = "The amount of backend Nodes to create."
}

variable "ssh_key" {
    description = "The local file location of the SSH key that will be transferred to each Linode."
    default = "~/.ssh/id_rsa.pub"
}

resource "random_string" "password" {
    length = 32
    special = true
    upper = true
    lower = true
    number = true
}
{{< /file >}}

    Terraform allows each variable to have its own description and default value. These variables will have their values populated through the use of a `terraform.tfvars` file that you will create in the next step. Separating the variable definitions from their values helps to keep sensitive data from entering your Terraform code, should you choose to include your code in a version control system like Git.

    In addition to the variables you defined above, there is also a `random_string` resource with the label `password`. This resource is provided by the [Random provider](https://www.terraform.io/docs/providers/random/index.html), and will generate a random string of 32 characters, including uppercase characters, lowercase characters, and numbers. This string will be the root password for your backend Nodes. If you would rather have exact control over your passwords, you can define a password here in `variables.tf` and set the value for that password in `terraform.tfvars` in the next step.

1.  Create the `terraform.tfvars` file and supply values for the `token`, `region`, and `node_count` variables. This example uses the `us-east` regional datacenter, and the `node_count` is two.

    {{< file "terraform.tfvars" >}}
token = "your_api_token"
region = "us-east"
node_count = 2
{{< /file >}}

    When Terraform runs, it looks for a file named `terraform.tfvars`, or files with the extension `*.auto.tfvars`, and populates the Terraform variables with those values. If your SSH key is at a file location that is different than the default value, i.e., it does not exist at `~/.ssh/id_rsa.pub`, then you will need to add that value to `terraform.tfvars`.

    {{< note >}}
If you want to use an input variable's default value defined in the `variables.tf` file, you can omit providing a value for that variable in the `terraform.tfvars` file.
    {{</ note >}}

    Feel free to change any of the values in the `terraform.tfvars` file to your liking. For a list of regional datacenter IDs, you can use the cURL command to query the API:

        curl https://api.linode.com/v4/regions

## Initializing, Planning, and Applying the Terraform State

Because this guide employs two providers (Linode and Random) that you might not have installed on your local development environment, you'll need to run the `init` command to install them.

    terraform init

You should see a message that Terraform has been successfully initialized.

To review the Terraform plan of action defined in the `nodebalancer.tf` file, run the `plan` command:

    terraform plan

You should see a lengthy output with all the `create` actions that will take place. Review the output, taking note that the `<computed>` values you see will be defined on creation. Once you are satisfied with the proposed actions, it's time to apply them.

Run the `apply` command:

    terraform apply

You will be prompted to approve the `apply` action. Type *yes* and hit **Enter**. Terraform will begin to create the resources you have configured in the previous steps. This will take a few minutes, after which you will start to see the output of the `remote-exec` commands you defined in your Linode instance resource. Once all of the actions are completed you should see output like the following:

{{< output >}}
Apply complete! Resources: 7 added, 0 changed, 0 destroyed.

Outputs:

NodeBalancer IP Address = 104.237.148.131
{{< /output >}}

Navigate to your NodeBalancer IP address and view your NodeBalancer in action. You have successfully created a NodeBalancer and backend nodes in Terraform.

### (Optional) Remove the NodeBalancer Resources

If you are done with the resources you just created, you can remove them with the `destroy` command

    terraform destroy

This command will prompt you to confirm the action.
