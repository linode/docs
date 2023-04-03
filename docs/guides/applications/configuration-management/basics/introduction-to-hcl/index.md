---
slug: introduction-to-hcl
description: 'This guide provides an introduction to HCL syntax and commonly used HCL terminology.'
keywords: ["terraform", "hcl", "hashicorp", "orchestration", "HashiCorp Configuration Language"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-02-22
modified_by:
    name: Linode
published: 2018-12-12
title: "An Introduction to HashiCorp Configuration Language (HCL)"
title_meta: Introduction to HashiCorp Configuration Language (HCL)
external_resources:
    - '[HCL on GitHub](https://github.com/hashicorp/hcl)'
    - '[Terraform Official Documentation - Configuration Syntax](https://www.terraform.io/docs/configuration/syntax.html)'
aliases: ['/applications/configuration-management/introduction-to-hcl/','/applications/configuration-management/basics/introduction-to-hcl/']
authors: ["Linode"]
---

The HashiCorp Configuration Language (HCL) is a configuration language authored by [HashiCorp](https://www.hashicorp.com/). HCL is used with HashiCorp's cloud infrastructure automation tools, such as [Terraform](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/). The language was created with the goal of being both human and machine friendly. It is JSON compatible, which means it is interoperable with other systems outside of the Terraform product line.

This guide provides an introduction to HCL syntax, some commonly used HCL terminology, and how it works with Terraform.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12 or later.  To learn how to safely upgrade to Terraform version 0.12 or later, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes. The examples in this guide were written to be compatible with [Terraform version 0.11](https://www.terraform.io/docs/configuration-0-11/terraform.html) and will be updated in the near future.
{{< /note >}}

## HCL Syntax Overview

HCL's configuration syntax is easy to read and write. It was created to have a more clearly visible and defined structure when compared to other well-known configuration languages, such as  YAML.

{{< file "~/terraform/main.tf">}}
# Linode provider block. Installs Linode plugin.
terraform {
  required_providers {
    linode = {
      source = "linode/linode"
      version = "1.16.0"
    }
  }
}
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
You should not include sensitive data in the resource declarations. For more information about secrets management, see [Secrets Management with Terraform](/docs/guides/secrets-management-with-terraform/).
{{< /note >}}

### Key Elements of HCL

-   HCL syntax comprises *stanzas* or *blocks* that define a variety of configurations available to Terraform. [Provider plugins](https://www.terraform.io/docs/configuration/providers.html) gives more details about the available base Terraform configurations.

-   Stanzas or blocks are comprised of `key = value` pairs. Terraform accepts values of type string, number, boolean, map, and list.

-   Single line comments start with `#`, while multi-line comments use an opening `/*` and a closing `*/`.

-   [Interpolation syntax](https://www.terraform.io/docs/configuration/interpolation.html) can be used to reference values stored outside of a configuration block in an [input variable](#input-variables), or from a [Terraform module](#modules)'s output.

    An interpolated variable reference is constructed with the `"${var.region}"` syntax. This example references a variable named `region`, which is prefixed by `var.`. The opening `${` and closing `}` indicates the start of interpolation syntax.

-   You can include multi-line strings by using an opening `<<EOF`, followed by a closing `EOF` on the line.

-   Strings are wrapped in double quotes.

-   Lists of primitive types (string, number, and boolean) are wrapped in square brackets: `["Andy", "Leslie", "Nate", "Angel", "Chris"]`.

-   Maps use curly braces `{}` and colons `:`, for example: `{ "password" : "my_password", "db_name" : "wordpress" }`.

See Terraform's [Configuration Syntax](https://www.terraform.io/docs/configuration/syntax.html) documentation for more details.

## Terraform Providers and HCL Syntax

In Terraform, a *provider* is used to interact with an Infrastructure as a Service (IaaS) or Platform as a Service (PaaS) API, like the [Linode APIv4](/docs/products/tools/api/). The provider determines which [resources](#resources) are exposed and available to create, read, update, and delete. A credentials set or token is usually required to interface with the service account. For example, the [Linode Terraform provider](https://www.terraform.io/docs/providers/linode/index.html) requires your [Linode API access token](/docs/products/tools/api/get-started/#get-an-access-token). A list of [all official Terraform providers](https://www.terraform.io/docs/providers/) is available from HashiCorp.

To configure Linode as the provider, you need to include a block which specifies Linode as the provider and sets your Linode API token in one of the `.tf` files:

{{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "my-token"
}
{{</ file >}}

After you declare the provider, you can configure resources available from the provider.

{{< note >}}
Providers are packaged as plugins for Terraform. Whenever you declare a new provider in the Terraform configuration files, run the `terraform init` command. This command completes several initialization steps that are necessary before you can apply the Terraform configuration, including downloading the plugins for any providers you've specified.
{{< /note >}}

## Terraform Resources and HCL Syntax

A Terraform *resource* is any component of the infrastructure that can be managed by the provider. Resources available with the Linode provider range from a Linode instance, to a block storage volume, to a DNS record. Terraform's [Linode Provider](https://www.terraform.io/docs/providers/linode/index.html) documentation contains a full listing of all supported resources.

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

HCL-specific [meta-parameters](https://www.terraform.io/docs/configuration/resources.html#meta-parameters) are available to all resources and are independent of the provider. Meta-parameters allow you to customize the lifecycle behavior of the resource, define the number of resources to create, or protect certain resources from being destroyed. See Terraform's [Resource Configuration](https://www.terraform.io/docs/configuration/resources.html) documentation for more information on meta-parameters.

## Terraform Modules and HCL Syntax

A *module* is an encapsulated set of Terraform configurations used to organize the creation of resources in reusable configurations.

The [Terraform Module Registry](https://registry.terraform.io/) is a repository of community modules that can help you get started creating resources for various providers. You can also create your own modules to better organize the Terraform configurations and make them available for reuse. After you have created the modules, you can distribute them through a remote version control repository, such as GitHub.

### Using Modules

A module block instructs Terraform to create an instance of a module. This block instantiates any resources defined within that module.

The only universally required configuration for all module blocks is the `source` parameter which indicates the location of the module's source code. All other required configurations vary from module to module. If you are using a local module you can use a relative path as the *source* value. The source path for a Terraform Module Registry module are available on the module's registry page.

This example creates an instance of a module named *linode-module-example* and provides a relative path as the location of the module's source code:

{{< file "~/terraform/main.tf" >}}
module "linode-module-example" {
    source = "/modules/linode-module-example"
}
{{</ file >}}

Authoring modules involves defining resource requirements and parameterizing configurations using [input variables](#input-variables), variable files, and outputs. To learn how to write Terraform modules, see [Create a Terraform Module](/docs/guides/create-terraform-module/).

## Input Variables

You can define *input variables* to serve as Terraform configuration parameters. By convention, input variables are normally defined within a file named `variables.tf`. Terraform loads all files ending in `.tf`, so you can also define variables in files with other names.

-   Terraform accepts variables of type string, number, boolean, map, and list. If a variable type is not explicitly defined, Terraform defaults to *type = "string"*.

-   It is a good practice to provide a meaningful *description* for all input variables.

-   If a variable does not contain a *default* value, or if you want to override a variable's default value, you must provide a value as an environment variable or within a variable values file.

### Variable Declaration Example

{{< file "~/terraform/variables.tf" >}}
variable "token" {
  description = "This is your Linode APIv4 Token."
}

variable "region" {
    description = "This is the location where the Linode instance is deployed."
    default     = "us-east"
}
{{</ file >}}

Two input variables named *token* and *region* are defined, respectively. The `region` variable defines a *default* value. Both variables default to *type = "string"*, because a type is not explicitly declared.

### Supplying Variable Values

Variable values can be specified in `.tfvars` files. These files use the same syntax as Terraform configuration files:

{{< file "~/terraform/terraform.tfvars" >}}
token = "my-token"
region = "us-west"
{{</ file >}}

Terraform automatically loads values from filenames which match `terraform.tfvars` or `*.auto.tfvars`. If you store values in a file with another name, you need to specify that file with the `-var-file` option when running `terraform apply`. The `-var-file` option can be invoked multiple times:

    terraform apply \
    -var-file="variable-values-1.tfvars" \
    -var-file="variable-values-2.tfvars"

Values can also be specified in environment variables when running `terraform apply`. The name of the variable should be prefixed with `TF_VAR_`:

    TF_VAR_token=my-token-value TF_VAR_region=us-west terraform apply

{{< note >}}
Environment variables can only assign values to variables of `type = "string"`
{{< /note >}}

### Referencing Variables

You can call existing input variables in the configuration file using Terraform's interpolation syntax. Observe the value of the *region* parameter:

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
If a variable value is not provided in any of the ways discussed above, and the variable is called in a resource configuration, Terraform prompts you for the value when you run `terraform apply`.
{{< /note >}}

For more information on variables, see Terraform's [Input Variables](https://www.terraform.io/intro/getting-started/variables.html) documentation.

## Interpolation

HCL supports the [interpolation](https://en.wikipedia.org/wiki/String_interpolation) of values. Interpolations are wrapped in an opening `${` and a closing `}`. Input variable names are prefixed with `var.`:

{{< file "~/terraform/terraform.tf" >}}
provider "linode" {
    token = "${var.token}"
}
{{</ file >}}

Interpolation syntax is powerful and enables you to reference attributes of other resources, call built-in functions, and use conditionals and templates.

The configuration of this resource uses a conditional to provide a value for the `tags` parameter:

{{< file "~/terraform/terraform.tf" >}}
resource "linode_instance" "web" {
    tags = ["${var.env == "production" ? var.prod_subnet : var.dev_subnet}"]
}
{{< /file >}}

If the `env` variable has the value *production*, then the `prod_subnet` variable is used. If not, then the variable `dev_subent` is used.

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
When you run `terraform console` creates an environment where you can test interpolation functions. For example:

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

The data source can use Terraform's standard interpolation syntax for variables. The template is then rendered with variable values that you provide in the data block.

This example template resource substitutes in the value from “${linode_instance.web.ip_address}” wherever “${web_ip}” appears inside the template file `ips.json`:

{{< file >}}
data "template_file" "web" {
    template = "${file("${path.module}/ips.json")}"

    vars {
        web_ip = "${linode_instance.web.ip_address}"
    }
}
{{< /file >}}

You can then define an [*output variable*](https://learn.hashicorp.com/terraform/getting-started/outputs.html) to view the rendered template when you run `terraform apply`:

{{< file >}}
output "ip" {
  value = "${data.template_file.web.rendered}"
}
{{< /file >}}

Terraform's official documentation has a list of [all available components](https://www.terraform.io/docs/configuration/interpolation.html) of interpolation syntax.

## Next Steps in Terraform

Now that you are familiar with HCL, you can begin creating a Linode instance with Terraform by following the [Use Terraform to Provision Linode Environments](/docs/guides/how-to-build-your-infrastructure-using-terraform-and-linode/) guide.
