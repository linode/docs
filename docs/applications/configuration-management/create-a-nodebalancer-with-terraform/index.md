---
author:
  name: Linode
  email: docs@linode.com
description: 'How to create a NodeBalancer and Nodes with Terraform.'
keywords: ['terraform','nodebalancer','node','balancer','provider','linode']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-21
modified: 2018-11-21
modified_by:
  name: Linode
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
---

Terraform allows you to represent Infrastructure as Code (IaC). You can use it to manage infrastructure, speed deployments, and share your infrastructure's state within a team. In this guide you will be using Terraform to create a NodeBalancer that distributes traffic between two Linodes.

{{< caution >}}
The configurations and commands used in this guide will result in multiple billable resources being added to your account. Be sure to monitor your account closely in the Linode Manager to avoid unwanted charges.
{{< /caution >}}

## Before You Begin

1.  You should have Terraform installed in your development environment, and have a working knowledge of Terraform resource configuration and the Linode Provider. For more information on how to install and use Terraform, check out our [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.

2.  Terraform requires an API access token. Follow the [Getting Started with the Linode API](/docs/platform/api/getting-started-with-the-linode-api-new-manager/#get-an-access-token) guide to obtain a token.

## Define Terraform Variables

1.  Begin by creating a file called `variables.tf`. This file will create the variables you will use in the configuration of your NodeBalancer and Nodes. You will supply values to the variables in another step.

    {{< file "variables.tf" >}}
variable "token" {
    description = "Your APIv4 Access Token"
}

variable "region" {
    description = "The datacenter where your NodeBalancer and Nodes will reside. E.g., 'us-east'."
    default = "us-east"
}

variable "node_count" {
    description = "The amount of backend Nodes to create."
    default = 2
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

    In addition to the variables you defined above, there is also a `random_string` resource with the label "password." This resource is provided by the [Random provider](https://www.terraform.io/docs/providers/random/index.html), and will generate a random string of characters, including uppercase characters, lowercase characters, and numbers, that is 32 characters long. This string will be the root password for your backend Nodes. If you would rather have exact control over your passwords, you can define a password here in `variables.tf` and set the value for that password in `terraform.tfvars` in the next step.

1.  Create Your `terraform.tfvars` file, and supply the `token`, `region`, and `node_count` values. This example uses the `us-east` regional datacenter, and the `node_count` is two. Feel free to change these values to your liking. For a list of regional datacenter IDs, you can use the cURL command to query the API:

        curl https://api.linode.com/v4/regions

    {{< file "terraform.tfvars" >}}
token = "your_api_token"
region = "us-east"
node_count = 2
{{< /file >}}

    When Terraform runs, it looks for a file named `terraform.tfvars`, or files with the extention of `*.auto.tfvars`, and populates the Terraform variables with those values. If your SSH key is at a file location that is different than the default value, i.e., it does not exist at `~/.ssh/id_rsa.pub`, then you will need to add that value to `terraform.tfvars`.

## Create a Terraform Configuration File

### Create a Provider Block

The first step to take when creating a Terraform configuration file is to create a Provider block. This block lets Terraform know which provider to use. The only configuration value that the Linode Provider needs needs is an API access token. Create a file with the file ending of `.tf` and add the following code. We will be adding to this file throughout the guide. In the below example, the file is named `nodebalancer.tf`.

{{< file "nodebalancer.tf" >}}
provider "linode" {
    token = "${var.token}"
}
{{< /file >}}

This provider block uses variable interpolation to include the API access token you provided within the configuration file's text. As you can see from this example, all the variables you defined in your `variables.tf` file are available within the `var` dictionary, using dot notation. You will be using variable interpolation and referencing variables with dot notation throughout this guide.

### Create a NodeBalancer Resource

Create a NodeBalancer resource:

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer" "example-nodebalancer" {
    label = "examplenodebalancer"
    region = "${var.region}"
}

...
{{< /file >}}

Here two labels are supplied. The first label, the label used internally by Terraform, is simply `example-nodebalancer`. The second label, the one that Linode will use to reference your NodeBalancer in tools like the Manager and the Linode CLI, is `examplenodebalancer`. The region for this NodeBalancer is supplied with the variable `region`, which you chose in the previous section.

### Create NodeBalancer Config Resources

In addition to the NodeBalancer resource configuration, you must supply at least one NodeBalancer Configuration resource. This resource defines ports, protocol, healtch checks, and session stickiness, among other options, that the NodeBalancer might use. For this example we will create a NodeBalancer configuration for HTTP access on port 80, but you might also want to create one for HTTPS access on port 443 if you have SSL/TLS certificates:

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer_config" "example-nodebalancer-config" {
    nodebalancer_id = "${linode_nodebalancer.example-nodebalancer.id}"
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

As far as settings go, the health check has been set to `http_body`, meaning that the health check will look for the string set by `check_body` within the body of the page set at `check_path`. The check will issue 30 health check attempts, waiting for a response for 25 seconds each time, with 30 seconds between checks. Additionally, the session stickiness setting has been set to `http_cookie`, meaning that the user will continue to be sent to the same server by the use of a session cookie. The algorithm has been set to `roundrobin`, which means that users will be sorted evenly across your backend nodes based on which server was accessed last.

### Create NodeBalancer Node Resources

The third part of setting up a NodeBalancer in Terraform is the NodeBalancer Node resource. This resource contains information about the individual Nodes and how they pertain to the NodeBalancer and NodeBalancer Configuration resources.

{{< file "nodebalancer.tf" >}}
...

resource "linode_nodebalancer_node" "example-nodebalancer-node" {
    count = "${var.node_count}"
    nodebalancer_id = "${linode_nodebalancer.example-nodebalancer.id}"
    config_id = "${linode_nodebalancer_config.example-nodebalancer-config.id}"
    label = "example-node-${count.index + 1}"
    address = "${element(linode_instance.example-instance.*.private_ip_address, count.index)}:80"
    mode = "accept"
}

...
{{< /file >}}

Here the Node configuration's `count` argument is populated with the `node_count` variable you defined at the beginning of this guide. The `count` argument simply tells Terraform that it should provision X number of Nodes, where X is `node_count`. The `node_count` for this example is two.

Because provisioning more than one Node creates a loop in the Terraform process, where the step for creating a Node is repeated, you can use the `count.index` variable to keep track of which iteration Terraform is on in the loop. The interpolation `{count.index + 1}` in the node's `label` argument tells Terraform that you'd like each of the of nodes to be labeled sequentially, and because `count.index` starts at zero, you'd like the count to begin at one.

Similar to how you were able to provide the NodeBalancer ID to the NodeBalancer Configuration resource before you had access to the NodeBalancer's ID value, you can supply the private IP addresses of the yet-to-be-created Linode Instances that the NodeBalancer Nodes reference. In the above example this is accomplished by using `linode_instance.example-instance.*.private_ip_address`. (As you will see in the next step, the Linode Instances will be labeled "example-instance"). Terraform has access to some attributes for each of the resources it creates, and `private_ip_address` is one of the available attributes from a Linode Instance. Because there will be two Linode Instances created during the same step, Terraform groups these sets of attributes in a list. The `element()` function allows you to grab a single item from a list based on the item index. Here, instead of providing a hard-coded number for the index you can instead provide `count.index`. In this way the first NodeBalancer Node will reference the private IP address of the first Linode Instance, and the second NodeBalancer Node will reference the private IP address of the second Instance.

### Create a Linode Instance Resource

Now that you have the NodeBalancer configured, you need to supply it with a Linode Instance resource configuration. This resource will allow Terraform to know which Instances it needs to create to meet the demand of our NodeBalancer example.

{{< file "nodebalancer.tf" >}}
...

resource "linode_instance" "example-instance" {
    count  = "${var.node_count}"
    label  = "example-instance-${count.index + 1}"
    group = "nodebalancer-example"
    tags = ["nodebalancer-example"]
    region = "${var.region}"
    type = "g6-nanode-1"
    image = "linode/ubuntu18.10"
    authorized_keys = ["${chomp(file(var.ssh_key))}"]
    root_pass = "${random_string.password.result}"
    private_ip = true

    provisioner "remote-exec" {
        inline = [
            # install nginx
            "export PATH=$PATH:/usr/bin",

            "apt-get -q update",
            "mkdir -p /var/www/html/",
            "mkdir -p /var/www/html/healthcheck",
            "echo health check > /var/www/html/healthcheck/index.html",
            "echo node ${count.index + 1} > /var/www/html/index.html",
            "apt-get -q -y install nginx",
        ]

        connection {
            type = "ssh"
            user = "root"
            password = "${random_string.password.result}"
        }
    }
}

...
{{< /file >}}

The above resource uses the same `count` argument as the NodeBalancer Node resource that was configured in the previous step. Also, the `label` argument is being sequentially incremented in a similar fashion to the NodeBalancer Node.

The `authorized_keys` argument is supplied the SSH key variable that was defined in the first section of this guide, and is passed to the `file()` function. The `file()` function reads the contents of a file into a string. That string is then passed to the `chomp()` function, which strips any extra whitespace.

`root_pass` is given the result of the `random_string` resource that was also defined at the beginning of this guide.

The last thing of note in this Linode Instance resource is the "remote-exec" Provisioner block. This block contains two other components, the `inline` list and `connection` block. `inline` is a list of commands that Terraform will execute on the Linode Instance once the Linode Instance has booted. In this example, the inline commands will: update the Linode Instance, create the necessary directory structure for NGINX, create the health check file and the more generalized `index.html` file, and install nginx.

The `connection` block explains to Terraform how it should gain access to the Linode Instance in order to run the commands supplied by the `inline` list. In this case, Terraform will gain access over SSH, logging in as the `root` user with the password that was generated at the beginning of this guide.

### Create an Output

The last step that you'll take in creating `nodebalancer.tf` is adding an output, which Terraform will add to the end of it's output in the terminal. Outputs can be any information available to Terraform. Below is an example that will display the public IP address of NodeBalancer:

{{< file "nodebalancer.tf" >}}
...

output "NodeBalancer IP Address" {
    value = "${linode_nodebalancer.example-nodebalancer.0.ipv4}"
}
{{< /file >}}

## Initializing, Planning, and Applying the Terraform State

Because this guide employs two Providers (Linode and Random) that you might not have installed on your local development environment, you'll need to run the `init` command to install them.

    `terraform init`

You should see a message that Terraform has been successfully initialized.

With the crafting of `nodebalancer.tf` complete, it's time to review the Terraform plan of action. Run the `plan` command:

    terraform plan

You should see a lengthy output with all the `create` actions that will take place. Review the output, taking note that the `<computed>` values you see will be defined on creation. Once you are satified with the proposed actions, it's time to apply them.

Run the `apply` command:

    terraform apply

You will be prompted to approve the `apply` action. Type 'yes' and hit enter. Terraform will begin to create the resources you have configured in the previous steps. This will take a few minutes, after which you will start to see the output of the the `remote-exec` commands you defined in your Linode Instance resource. Once all of the actions are completed you should see output like the following:

{{< output >}}
Apply complete! Resources: 7 added, 0 changed, 0 destroyed.

Outputs:

NodeBalancer IP Address = 104.237.148.131
{{< /output >}}

You can now navigate to your NodeBalancer IP address and view your NodeBalancer in action. You have successfully created a NodeBalancer and backend nodes in Terraform.