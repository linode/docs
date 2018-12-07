---
author:
    name: Linode
    email: docs@linode.com
description: 'This guides provides an introduction to HCL syntax and commonly used HCL terminology.'
keywords: ["terraform", "hcl", "hashicorp", "orchestration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-11-26
modified_by:
    name: Linode
published: 2018-11-26
title: Introduction to HashiCorp Configuration Language (HCL)
---

HCL is a configuration language built by [HashiCorp](https://www.hashicorp.com/) and is used with their cloud infrastructure automation tools, like [Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/). This language was created with the goal of being both human and machine friendly. HCL is JSON-compatible, which means it is interoperable with other systems outside of the Terraform product line. This guide provides an introduction to HCL syntax and some commonly used HCL terminology.

## HCL Syntax

HashiCorp's configuration syntax is easy to read and write. It was created to have clearly visible and defined structure as an improvement upon other well known configuration languages, like YAML.

  {{< file "~/terraform/main.tf">}}
# Linode provider block. Installs Linode plugin.
provider "linode" {
    token = "${var.token}"
}

variable "region" {
  description = "This is the location where the Linode instance is deployed."
}

/* A multi
   line comment. */
resource "linode_instance" "example_linode" {
    image = "linode/ubuntu18.04"
    label = "example-linode"
    region = "${var.region}"
    type = "g6-standard-1"
    authorized_keys = [ "my-key" ]
    root_pass = "example-password"
}
    {{</ file >}}

  {{< note >}}
  You should not include sensitive data in your resource declarations. For more information on secrets management, see the Secrets Management with Terraform guide.
  {{</ note >}}

  Below are some key elements of HCL syntax:

  -  HCL syntax is composed of *stanzas* or *blocks* that define a variety of configurations available to Terraform. [Provider plugins](https://www.terraform.io/docs/configuration/providers.html) expand on the available base Terraform configurations.
  -  Stanzas or blocks are comprised of `key = value` pairs. Terraform accepts the following value types: `string`, `number`, `boolean`, `map`, and `list`.
  - Single line comments start with `#`, while multi-line comments use an opening `/*` and a closing `*/`.
  - [Interpolation syntax](https://www.terraform.io/docs/configuration/interpolation.html) can be used to reference values stored outside of a configuration block in places like an input variable or a module's output.

    A variable reference using interpolation syntax is constructed as follows: `"${var.region}"`. This example references a variable named `region`. The opening `${` and closing `}` indicate the start of interpolation syntax.
  - You can use multi-line strings using an opening `<<EOF` and a closing `EOF` on its own line.
  - Strings are wrappted in double quotes.
  - Lists of primitive types (`string`, `number`, `boolean`) are wrapped in square brackets: `["Andy", "Nate", "Chris"]`.
  - Maps use curly braces `{}` and colons `:`, as follows: `{ "password" : "my_password", "db_name" : "wordpress" }`.

  See Terraform's configuration syntax [documentation page](https://www.terraform.io/docs/configuration/syntax.html), for more details.

## Providers

In Terraform, a provider is used to interact with an Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) API, like the [Linode APIv4](https://developers.linode.com/api/v4). The provider determines which [resources](#resources) are exposed and available to create, read, update, and delete. A credentials set or token is usually required to interface with your service account. For example, the [Linode Terraform provider](https://www.terraform.io/docs/providers/linode/index.html) requires your [Linode API access token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token). A list of all official Terraform providers is available on their [site](https://www.terraform.io/docs/providers/).

Configuring a Linode provider block requires specifying Linode as the provider and supplying your Linode account's corresponding API token in a `.tf` file.

  {{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "my-token"
}
  {{</ file >}}

Once your provider is declared, you can begin configuring resources available from the provider.

{{< note >}}
Providers are written as Terraform plugins. Whenever declaring a new provider in your Terraform configuration files, the `terraform init` command should be run. This command will complete several initalization steps, like downloading new provider plugins, to prepare your working directory for use.
{{</ note >}}


## Resources

A Terraform resource is any component of your infrastructure that is manageable with your provider. Resources available with the Linode provider range from a Linode instance, to a block storage volume, to a DNS record. Terraform's [Linode Provider documentation](https://www.terraform.io/docs/providers/linode/index.html) contains a full listng of all supported resources.

Resources are declared using a resource block in a `.tf` configuration file. The following example deploys a Linode instance with an Ubuntu 18.04 image.

{{< file "~/terraform/main.tf" >}}
resource "linode_instance" "WordPress" {
    image = "linode/ubuntu18.04"
    label = "WPServer"
    region = "us-east"
    type = "g6-standard-1"
    authorized_keys = [ "example-key" ]
    root_pass = "example-root-pass"
}
{{</ file >}}

This example deploys a 2GB Linode instance located in the US East data center with an Ubuntu 18.04 image. Values are also provided for a label, Public SSH key and root password to assign to the Linode.

HCL-specific [meta-parameters](https://www.terraform.io/docs/configuration/resources.html#meta-parameters) are available to all resources and are independent of the provider you use. Meta-parameters allow you to do things like customize the lifecycle behavior of the resource, define the number of resources to create, or protect certain resources from being destroyed. See [Terraform's Resource Configuration](https://www.terraform.io/docs/configuration/resources.html) page for more information on meta-parameters.


## Modules

A module is an encapsulated set of Terraform configurations used to organize the creation of resources into reusable configurations. The [Terraform Module Registry](https://registry.terraform.io/) is a repository of community modules that can help you get started creating resources for various providers. You can also create your own modules to better organzie your Terraform configurations and make them available for reuse via remote version control systems, like GitHub.

A module block instructs Terraform to create an instance of a module that then instantiates any resources defined within that module. The only required configuration for a module block is the `source` paremeter that indicates the location of the module's source code. All other required configurations will vary from module to module. If you are using a local module you can use a relative path as the `source` value. The source path for a Terraform Registry module will be available on the module's registry page:

{{< file "~/terraform/main.tf" >}}
module "linode-module-example" {
    source = "/modules/linode-module-example"
}
{{</ file >}}

This example creates an instance of a module named `linode-example-module` and provides a relative path as the location of the module's source code.

Creating modules involves defining resource requirements and paremeterizing configurations using input [variables](#variables), variable files and outputs. To learn how to create your own Terraform modules, see the Create a Terraform Module guide.

## Input Variables

You can define *input variables* to serve as Terraform module parameters. All input variables are normally defined within a file named `variables.tf`, however, they can be declared inside any `.tf` configuration file.

- Terraform accepts the following variable types: `string`, `map`, `list`, `boolean`. If a variable type is not explicitly defined, Terraform will default to `type = "string"`.

- It is good practice to provide a meaningful `description` with all your input variables.

- If a variable does not contain a `default` value or if you would like to override a variable's default value, you must provide a value as an environment variable or with a variable values file.

  {{< file "~/terraform/variables.tf" >}}
variable "token" {
  description = "This is your Linode APIv4 Token."
}

variable "region" {
    description: " This is the location where the Linode instance is deployed."
    default = "us-east"
}
  {{</ file >}}

In the example `variables.tf` file two input variables named `token` and `region` are defined, respectively. The `region` variable defines a `default` value. Both variables will default to `type = "string"`, since a type is not explicitly declared.

Below, values for the previous example's input variables are provided in a variable values file and as environment variables, respectively.

- **Variable Values File**

    {{< file "~/terraform/terraform.tfvars" >}}
token = "my-token"
region = "us-west"
    {{</ file >}}

- **Environment Variable**

        TF_VAR_token=my-token-value TF_VAR_region=us-west terraform apply

      {{< note >}}
  Environment variables can only assign values to variables of `type = "string"`
      {{</ note >}}

You can call existing input variables within your configuration file using Terraform's interpolation syntax. Notice the value of the `linode_instace` resource's `region` parameter:

{{< file "~/terraform/main.tf" >}}
resource "linode_instance" "WordPress" {
    image = "linode/ubuntu18.04"
    label = "WPServer"
    region = "${var.region}"
    type = "g6-standard-1"
    authorized_keys = [ "example-key" ]
    root_pass = "example-root-pass"
}
{{</ file >}}

{{< note >}}
If a variable value is not provided in any of the ways discussed above and the variable is called in a resource configuration, Terraform will prompt you for the value when applying the configuration via a `terraform apply`.
{{</ note >}}

For more information on variables, see [Terraform's documentation](https://www.terraform.io/intro/getting-started/variables.html).

## Interpolation

HCL supports the [interpolation](https://en.wikipedia.org/wiki/String_interpolation) of values. Interpolations are wrapped in an opening `${` and a closing `}`:

  {{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "${var.token}"
}
  {{</ file >}}

  This simple example demonstrates a string variable interpolation used to provide a value for the `token` configuration key. Interpolation syntax is powerful and includes the ability to reference attributes of other resources, call built-in functions, and use conditionals and templates.

  {{< file "~/terraform/terraform.tf" >}}
resource "linode_instance" "web" {
    tags = ["${var.env == "production" ? var.prod_subnet : var.dev_subnet}"]
}
  {{< /file >}}

  This resource's configuration uses a conditional to provide a value for the `tag` parameter. If the `env` variable has the value `production`, then the `prod_subnet` variable is used. If not, then the variable `dev_subent` is used.

### Functions

Terraform has built-in computational functions that perform a variety of operations, like reading files, concatenating lists, encrypting or creating a checksum of an object, and search and replace capabilities.

{{< file "~/terraform/terraform.tf" >}}
resource "linode_sshkey" "main_key" {
    label = "foo"
    ssh_key = "${chomp(file("~/.ssh/id_rsa.pub"))}"
}
{{</ file >}}

In this example, `ssh_key = "${chomp(file("~/.ssh/id_rsa.pub"))}"` uses Terraform’s built-in function `file()` to provide a local file path to the public SSH key’s location. The `chomp()` function removes trailing new lines from the ssh key. Note that the nested functions are wrappted in opening `${` and closing `}` to indicate that the value should be interpolated.

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

For a full list of available functions, refer to [Terraform's documentation](https://www.terraform.io/docs/configuration/interpolation.html#supported-built-in-functions).

### Templates

Templates can be used to store large strings of data. The template provider exposes the data-sources for other Terraform resources or outputs to consume. The data-source can be a file or an inline template, while variables are defined to be used during interpolation.

{{< file >}}
data "template_file" "web" {
    template = "${file("${path.module}/ips.json")}"

    vars {
        web_ip = "${linode_instance.web.ip_address}"
    }
}
{{< /file >}}

This template resource assigns a value for `${web_ip}` anywhere it exists inside the template file `ips.json`. You could then define an output variable to view the genrated template on a `terraform apply`:

{{< file >}}
output "ip" {
  value = "${data.template_file.web.rendered}"
}
{{< /file >}}

For more information on all available components of interpolation syntax, see [Terraform's official documentation](https://www.terraform.io/docs/configuration/interpolation.html).

## Next Steps

Now that you are familiar with HCL, you can begin creating your own Linode instance with Terraform by following the [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.
