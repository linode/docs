---
author:
    name: Linode
    email: docs@linode.com
description: 'This guides provides an introduction to HCL syntax and commonly used HCL terminology.'
keywords: ["terraform", "hcl", "hashicorp", "orchestration"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-12-12
modified_by:
    name: Linode
published: 2018-12-12
title: Introduction to HashiCorp Configuration Language (HCL)
external_resources:
    - '[HCL on GitHub](https://github.com/hashicorp/hcl)'
    - '[Terraform Official Documentation - Configuration Syntax](https://www.terraform.io/docs/configuration/syntax.html)'
---

HCL is a configuration language authored by [HashiCorp](https://www.hashicorp.com/). HCL is used with HashiCorp's cloud infrastructure automation tools, like [Terraform](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/). The language was created with the goal of being both human and machine friendly. It is JSON compatible, which means it is interoperable with other systems outside of the Terraform product line.

This guide provides an introduction to HCL syntax and some commonly used HCL terminology.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12+.  To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.

The examples in this guide were written to be compatible with [Terraform version 0.11](https://www.terraform.io/docs/configuration-0-11/terraform.html) and will be updated in the near future.
{{</ note >}}

## HCL Syntax Overview

HashiCorp's configuration syntax is easy to read and write. It was created to have a more clearly visible and defined structure when compared with other well known configuration languages, like YAML.

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
You should not include sensitive data in your resource declarations. For more information on secrets management, see [Secrets Management with Terraform](/docs/applications/configuration-management/secrets-management-with-terraform/).
{{</ note >}}

### Key Elements of HCL

-   HCL syntax is composed of *stanzas* or *blocks* that define a variety of configurations available to Terraform. [Provider plugins](https://www.terraform.io/docs/configuration/providers.html) expand on the available base Terraform configurations.

-   Stanzas or blocks are comprised of `key = value` pairs. Terraform accepts values of type string, number, boolean, map, and list.

-   Single line comments start with `#`, while multi-line comments use an opening `/*` and a closing `*/`.

-   [Interpolation syntax](https://www.terraform.io/docs/configuration/interpolation.html) can be used to reference values stored outside of a configuration block, like in an [input variable](#input-variables), or from a [Terraform module](#modules)'s output.

    An interpolated variable reference is constructed with the `"${var.region}"` syntax. This example references a variable named `region`, which is prefixed by `var.`. The opening `${` and closing `}` indicate the start of interpolation syntax.

-   You can include multi-line strings by using an opening `<<EOF`, followed by a closing `EOF` on its own line.

-   Strings are wrapped in double quotes.

-   Lists of primitive types (string, number, and boolean) are wrapped in square brackets: `["Andy", "Leslie", "Nate", "Angel", "Chris"]`.

-   Maps use curly braces `{}` and colons `:`, as follows: `{ "password" : "my_password", "db_name" : "wordpress" }`.

See Terraform's [Configuration Syntax](https://www.terraform.io/docs/configuration/syntax.html) documentation for more details.

## Providers

In Terraform, a *provider* is used to interact with an Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) API, like the [Linode APIv4](https://developers.linode.com/api/v4). The provider determines which [resources](#resources) are exposed and available to create, read, update, and delete. A credentials set or token is usually required to interface with your service account. For example, the [Linode Terraform provider](https://www.terraform.io/docs/providers/linode/index.html) requires your [Linode API access token](/docs/platform/api/getting-started-with-the-linode-api/#get-an-access-token). A list of [all official Terraform providers](https://www.terraform.io/docs/providers/) is available from HashiCorp.

Configuring a Linode as your provider requires that you include a block which specifies Linode as the provider and sets your Linode API token in one of your `.tf` files:

{{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "my-token"
}
{{</ file >}}

Once your provider is declared, you can begin configuring resources available from the provider.

{{< note >}}
Providers are packaged as plugins for Terraform. Whenever declaring a new provider in your Terraform configuration files, the `terraform init` command should be run. This command will complete several initialization steps that are necessary before you can apply your Terraform configuration, including downloading the plugins for any providers you've specified.
{{</ note >}}

## Resources

A Terraform *resource* is any component of your infrastructure that can be managed by your provider. Resources available with the Linode provider range from a Linode instance, to a block storage volume, to a DNS record. Terraform's [Linode Provider](https://www.terraform.io/docs/providers/linode/index.html) documentation contains a full listing of all supported resources.

Resources are declared with a resource block in a `.tf` configuration file. This example block deploys a 2GB Linode instance located in the US East data center from an Ubuntu 18.04 image. Values are also provided for the Linode's label, public SSH key, and root password:

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

HCL-specific [meta-parameters](https://www.terraform.io/docs/configuration/resources.html#meta-parameters) are available to all resources and are independent of the provider you use. Meta-parameters allow you to do things like customize the lifecycle behavior of the resource, define the number of resources to create, or protect certain resources from being destroyed. See Terraform's [Resource Configuration](https://www.terraform.io/docs/configuration/resources.html) documentation for more information on meta-parameters.

## Modules

A *module* is an encapsulated set of Terraform configurations used to organize the creation of resources in reusable configurations.

The [Terraform Module Registry](https://registry.terraform.io/) is a repository of community modules that can help you get started creating resources for various providers. You can also create your own modules to better organize your Terraform configurations and make them available for reuse. Once you have created your modules, you can distribute them via a remote version control repository, like GitHub.

### Using Modules

A module block instructs Terraform to create an instance of a module. This block instantiates any resources defined within that module.

The only universally required configuration for all module blocks is the `source` parameter which indicates the location of the module's source code. All other required configurations will vary from module to module. If you are using a local module you can use a relative path as the `source` value. The source path for a Terraform Module Registry module will be available on the module's registry page.

This example creates an instance of a module named `linode-module-example` and provides a relative path as the location of the module's source code:

{{< file "~/terraform/main.tf" >}}
module "linode-module-example" {
    source = "/modules/linode-module-example"
}
{{</ file >}}

Authoring modules involves defining resource requirements and parameterizing configurations using [input variables](#input-variables), variable files, and outputs. To learn how to write your own Terraform modules, see [Create a Terraform Module](/docs/applications/configuration-management/create-terraform-module/).

## Input Variables

You can define *input variables* to serve as Terraform configuration parameters. By convention, input variables are normally defined within a file named `variables.tf`. Terraform will load all files ending in `.tf`, so you can also define variables in files with other names.

-   Terraform accepts variables of type string, number, boolean, map, and list. If a variable type is not explicitly defined, Terraform will default to `type = "string"`.

-   It is good practice to provide a meaningful `description` for all your input variables.

-   If a variable does not contain a `default` value, or if you would like to override a variable's default value, you must provide a value as an environment variable or within a variable values file.

### Variable Declaration Example

{{< file "~/terraform/variables.tf" >}}
variable "token" {
  description = "This is your Linode APIv4 Token."
}

variable "region" {
    description: "This is the location where the Linode instance is deployed."
    default = "us-east"
}
{{</ file >}}

Two input variables named `token` and `region` are defined, respectively. The `region` variable defines a `default` value. Both variables will default to `type = "string"`, since a type is not explicitly declared.

### Supplying Variable Values

Variable values can be specified in `.tfvars` files. These files use the same syntax as Terraform configuration files:

{{< file "~/terraform/terraform.tfvars" >}}
token = "my-token"
region = "us-west"
{{</ file >}}

Terraform will automatically load values from filenames which match `terraform.tfvars` or `*.auto.tfvars`. If you store values in a file with another name, you need to specify that file with the `-var-file` option when running `terraform apply`. The `-var-file` option can be invoked multiple times:

    terraform apply \
    -var-file="variable-values-1.tfvars" \
    -var-file="variable-values-2.tfvars"

Values can also be specified in environment variables when running `terraform apply`. The name of the variable should be prefixed with `TF_VAR_`:

    TF_VAR_token=my-token-value TF_VAR_region=us-west terraform apply

{{< note >}}
Environment variables can only assign values to variables of `type = "string"`
{{</ note >}}

### Referencing Variables

You can call existing input variables within your configuration file using Terraform's interpolation syntax. Observe the value of the `region` parameter:

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
If a variable value is not provided in any of the ways discussed above, and the variable is called in a resource configuration, Terraform will prompt you for the value when you run `terraform apply`.
{{</ note >}}

For more information on variables, see Terraform's [Input Variables](https://www.terraform.io/intro/getting-started/variables.html) documentation.

## Interpolation

HCL supports the [interpolation](https://en.wikipedia.org/wiki/String_interpolation) of values. Interpolations are wrapped in an opening `${` and a closing `}`. Input variable names are prefixed with `var.`:

{{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "${var.token}"
}
{{</ file >}}

Interpolation syntax is powerful and includes the ability to reference attributes of other resources, call built-in functions, and use conditionals and templates.

This resource's configuration uses a conditional to provide a value for the `tags` parameter:

{{< file "~/terraform/terraform.tf" >}}
resource "linode_instance" "web" {
    tags = ["${var.env == "production" ? var.prod_subnet : var.dev_subnet}"]
}
{{< /file >}}

If the `env` variable has the value `production`, then the `prod_subnet` variable is used. If not, then the variable `dev_subent` is used.

### Functions

Terraform has built-in computational functions that perform a variety of operations, including reading files, concatenating lists, encrypting or creating a checksum of an object, and searching and replacing.

{{< file "~/terraform/terraform.tf" >}}
resource "linode_sshkey" "main_key" {
    label = "foo"
    ssh_key = "${chomp(file("~/.ssh/id_rsa.pub"))}"
}
{{</ file >}}

In this example, `ssh_key = "${chomp(file("~/.ssh/id_rsa.pub"))}"` uses Terraform’s built-in function `file()` to provide a local file path to the public SSH key’s location. The `chomp()` function removes trailing new lines from the SSH key. Observe that the nested functions are wrapped in opening `${` and closing `}` to indicate that the value should be interpolated.

{{< note >}}
Running `terraform console` creates an environment where you can test interpolation functions. For example:

    terraform console

{{< output >}}
> list("newark", "atlanta", "dallas")
[
  "newark",
  "atlanta",
  "dallas",
]
>
{{< /output >}}
{{< /note >}}

Terraform's official documentation includes a complete list of [supported built-in functions](https://www.terraform.io/docs/configuration/interpolation.html#supported-built-in-functions).

### Templates

Templates can be used to store large strings of data. The template provider exposes the data sources for other Terraform resources or outputs to consume. The data source can be a file or an inline template.

The data source can use Terraform's standard interpolation syntax for variables. The template is then rendered with variable values that you supply in the data block.

This example template resource substitutes in the value from `${linode_instance.web.ip_address}` anywhere `${web_ip}` appears inside the template file `ips.json`:

{{< file >}}
data "template_file" "web" {
    template = "${file("${path.module}/ips.json")}"

    vars {
        web_ip = "${linode_instance.web.ip_address}"
    }
}
{{< /file >}}

You could then define an [*output variable*](https://learn.hashicorp.com/terraform/getting-started/outputs.html) to view the rendered template when you later run `terraform apply`:

{{< file >}}
output "ip" {
  value = "${data.template_file.web.rendered}"
}
{{< /file >}}

Terraform's official documentation has a list of [all available components](https://www.terraform.io/docs/configuration/interpolation.html) of interpolation syntax.

## Next Steps

Now that you are familiar with HCL, you can begin creating your own Linode instance with Terraform by following the [Use Terraform to Provision Linode Environments](/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.
