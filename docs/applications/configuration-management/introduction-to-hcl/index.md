---
author:
    name: Linode
    email: docs@linode.com
description: 'This guides provides an introduction to some commonly used HCL terminology.'
keywords: ["terraform", "hcl", "hashicorp"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-11-26
modified_by:
    name: Linode
published: 2018-11-26
title: Introduction to HashiCorp Configuration Language (HCL)
---

HCL is a configuration language developed by [HashiCorp](https://www.hashicorp.com/) to use in their product lineup. It was created with the goal of being both human and machine friendly, and to allow for use of command line tools but also JSON compatibility. This guides provides an introduction to some commonly used HCL terminology.

## Providers

A provider is a piece of software used to interact with an Infrastructure as a Service (IaaS) or  Platform as a Service (PaaS) API, and Terraform can manage multiple providers in a single configuration. A provider usually requires a credentials set or token to interface with your service account such as your [Linode API access token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token). You can see a list of all officially available providers [here](https://www.terraform.io/docs/providers/).

Configuring a provider block can be as minimal as simply specifying the Linode provider and your API access token.

{{< file "terraform.tf" config >}}
provider "linode" {
    token = ". . ."
}
{{< /file >}}


## Resources

A Terraform resource can be any component of your infrastructure which is manageable with Terraform, from a Linode instance to a block storage volume, to a DNS record. Resources are indicated by a resource block in a `.tf` file and look similar to below:

{{< file "terraform.tf" config >}}
resource "linode_instance" "WordPress" {
    image = "linode/ubuntu18.04"
    label = "WPServer"
    region = "us-east"
    type = "g6-standard-1"
    authorized_keys = [ ". . ." ]
    root_pass = ". . ."
}
{{< /file >}}

HCL-specific [meta-parameters](https://www.terraform.io/docs/configuration/resources.html#meta-parameters) exist for resources and are independent of the provider you use. Meta-parameters allow you to do things such as define which provider to use or the number of resources to create, or protect certain resources from being destroyed upon running `terraform apply`. See [Terraform's docs](https://www.terraform.io/docs/configuration/resources.html) for more information on resources.


## Modules

A module is a Terraform block, or set of blocks, used to organize the creation of resources into reusable configurations. Use of a module is denoted by a module block, which will point to a source file containing all modules parameters.

For example, to turn the resource block above into a module, put it into its own `.tf` file:

{{< file "/modules/linode-vm/main.tf" config >}}
resource "linode_instance" "WordPress" {
    image = "linode/ubuntu18.04"
    label = "WPServer"
    region = "us-east"
    type = "g6-standard-1"
    authorized_keys = "${var.authorized_keys}"
    root_pass = "${var.root_pass}
}
{{< /file >}}

If you're using variables in the module, create a file to define them in:

{{< file "/modules/linode-vm/variables.tf" config >}}
variable "authorized_keys" {
    description = "SSH pubkey."
    default = [". . ."]
}

variable "root_pass" {
    description = "The Linode's root password on creation."
    default = ". . ."
}
{{< /file >}}

Then specify the module using the `source` parameter in a module block:

{{< file "terraform.tf" config>}}
module "linode-vm" {
    source = "/modules/linode-vm"
}
{{< /file >}}

See [Terraform's documentation](https://www.terraform.io/docs/modules/index.html) for more info on modules.


## Variables

Variables in Terraform are similar to other language's concept of the term. A parameter is set, and that parameter can be subsequently referred to throughout a project's configuration files.

In the example below, variables are defined in `variables.tf` and their values assigned in `terraform.tfvars`.

{{< file "variables.tf" >}}
variable "token" {}
variable "authorized_keys" {}

variable "region" {
    default = "us-east"
}
{{< /file >}}

{{< file "terraform.tfvars" >}}
token = ". . ."
authorized_keys = [ ". . ." ]
{{< /file >}}

Those variables are then used elsewhere, such as your project's main `.tf` file:

{{< file "terraform.tf" >}}
provider "linode" {
    token = "${var.token}"
}

resource "linode_instance" "my_instance" {
    authorized_keys = "${var.authorized_keys}"
    region = "${var.region}"

    . . .
}
{{< /file >}}

{{< note >}}
Variables in `variables.tf` which have a default value do not rely on the `.tfvars` file, but empty variables do. However, if, for example, a token's value was not defined in a `.tfvars` file and there is no default value, Terraform would ask for it during a `terraform apply` and you would need to enter it manually. If you prefer, you could define default values in `variables.tf` and omit using a `.tfvars` file.
{{< /note >}}

See [Terraform's documentation](https://www.terraform.io/intro/getting-started/variables.html) for more information.


## Functions

Terraform has built-in computational functions you can use to manipulate string data. Some examples are reading a file path into a string , encrypting or creating a checksum of an object, and search and replace capabilities.

[Terraform's documentation](https://www.terraform.io/docs/configuration/interpolation.html#supported-built-in-functions) gives a full list of available functions and what they do.

{{< note >}}
Running `terraform console` creates an environment where you can test interpolation functions. For example:

{{< output >}}
root@system:~$ terraform console
> list("newark", "atlanta", "dallas")
[
  "newark",
  "atlanta",
  "dallas",
]
>
{{< /output >}}
{{< /note >}}


## Interpolation

Terraform supports [interpolation](https://en.wikipedia.org/wiki/String_interpolation) of [variables](https://www.terraform.io/docs/configuration/interpolation.html#available-variables), conditionals, and other values into your configuration file's string data.

For example, when Terraform parses the example below, if the `env` variable has the value `production`, then the `prod_subnet` variable is used. If not, then the variable `dev_subent` is used.

{{< file >}}
resource "linode_instance" "web" {
    tags = ["${var.env == "production" ? var.prod_subnet : var.dev_subnet}"]
}
{{< /file >}}


## Templates

[Templates](https://www.terraform.io/docs/configuration/interpolation.html#templates) can be used to contain large data strings which are either self-contained in a [data source](https://www.terraform.io/docs/configuration/data-sources.html) block or called as a separate file. Templates can use variables and [meta-parameters](https://www.terraform.io/docs/configuration/resources.html#meta-parameters) just like modules and resources.

For example, the following template assigns a value for `${web_ip}` anywhere it exists inside the template file `ips.json`.


{{< file >}}
data "template_file" "web" {
    template = "${file("${path.module}/ips.json")}"

    vars {
        web_ip = "${linode_instance.web.ip_address}"
    }
}
{{< /file >}}

You could then define an Output to view the template on `terraform apply`:

{{< file >}}
output "ip" {
  value = "${data.template_file.web.rendered}"
}
{{< /file >}}
