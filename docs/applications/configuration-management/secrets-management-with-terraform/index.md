---
author:
  name: Linode
  email: docs@linode.com
description: 'How to Manage Secrets with Terraform'
keywords: ['terraform','secrets','secrets management','backend','hcl']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-12
modified: 2019-08-09
modified_by:
  name: Linode
title: "Secrets Management with Terraform"
contributor:
  name: Linode
external_resources:
- '[Terraform Input Variable Configuration](https://www.terraform.io/docs/configuration/variables.html)'
- '[Terraform Backend Configuration](https://www.terraform.io/docs/backends/config.html)'
- '[Terraform Backend Types](https://www.terraform.io/docs/backends/types/index.html)'
- '[Terraform State Storage and Locking](https://www.terraform.io/docs/backends/state.html)'
- '[GitHub Discussion - Storing Sensitive Values in State Files](https://github.com/hashicorp/terraform/issues/516)'
---

Terraform is an Infrastructure as Code (IaC) tool that allows you to write declarative code to manage your infrastructure. In order to implement IaC with Terraform it is necessary to supply secrets, such as server passwords and API tokens, within your code. This guide will discuss methods for securing those secrets within Terraform.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12+.  To learn how to safely upgrade to Terraform version 0.12+, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.

The examples in this guide were written to be compatible with [Terraform version 0.11](https://www.terraform.io/docs/configuration-0-11/terraform.html) and will be updated in the near future.
{{</ note >}}

## Keeping Secrets Out of .tf Files

In Terraform, `.tf` files contain the declarative code used to create, manage, and destroy infrastructure. This code is often committed to a version control system like Git, using a platform like GitHub, and shared within a team. Because it is easy for this information to become public-facing, it is important that you make sure your committed code is free of secrets.

### Input Variables

Terraform configurations in `.tf` files can accept values from [*input variables*](https://www.terraform.io/docs/configuration/variables.html). These variables are included in your configuration using Terraform's [interpolation syntax](https://www.terraform.io/docs/configuration/interpolation.html).

For example, you might have a `linode-infrastructure.tf` file with a provider block that requires an API access token. The `token` variable definition is declared inside your `.tf` file and is then interpolated inside the provider declaration with the `"${var.token}"` syntax:

{{< file "linode-infrastructure.tf" >}}
variable "token" {
  description = "Your API access token"
}

provider "linode" {
    token = var.token
}
{{< /file >}}

Variable definitions are written in `.tf` files. In this example, it's the same file as your provider configuration, but the definition could have been in a separate `.tf` file too.

{{< note >}}
Your variable definitions can have default values assigned to them. Here's an example that encodes Linode's Newark data center as the default value for a `region` variable:

{{< file "variables.tf" >}}
variable "region" {
  description = "The region to deploy Linode instances in"
  default = "us-east"
}
{{< /file >}}

You could later use this variable when declaring your Linode instances.
{{< /note >}}

### Assigning Variable Values in a File

The values assigned to your variables (aside from default values) are not included in the variable definitions in your `.tf` files. Instead, the values are stored in separate files with the `.tfvars` extension. When Terraform runs a command like `plan` or `apply`, it automatically looks through the working directory for a file named `terraform.tfvars`, or for files with the `.auto.tfvars` extension.

Here's an example `terraform.tfvars` which supplies a value for the `token` variable from the previous example:

{{< file "terraform.tfvars" >}}
token = 'your-token-value'
{{< /file >}}

You would then add the `terraform.tfvars` file to your `.gitignore` file and keep it out of version control. This strategy allows you to safely commit the `linode-infrastructure.tf` file.

For ease of use with large `terraform.tfvars` files, it might be beneficial to include an example `terraform.tfvars.example` in your Git repository with all of the variable names recorded (but none of the values entered). Team members could then copy this example into their local repository's `terraform.tfvars` and enter the appropriate values.

{{< note >}}
Variable value files with names that don't match `terraform.tfvars` or `*.auto.tfvars` can be specified with the `-var-file` option:

    terraform apply -var-file=myvars.tfvars

Supplying multiple `.tfvars` files is another way to further separate secret variables and non-secret variables; e.g.:

    terraform apply \
    -var-file=non-secret-variables.tfvars \
    -var-file=secret-variables.tfvars

{{< /note >}}

### Assigning Values in Environment Variables

Terraform allows you to keep input variable values in environment variables. These variables have the prefix `TF_VAR_` and are supplied at the command line. Using the above example of an API access token, you could export the variable and use it like so:

    export TF_VAR_token=your-token-value
    terraform apply

You could also include the variable on the same line when running `terraform plan` or `terraform apply`:

    TF_VAR_token=your-token-value terraform apply

{{< caution >}}
This method commits the environment variable to your shell's history, so take care when using this method.
{{< /caution >}}

### Assigning Values in Command-Line Flags

Variable values can be set with the `-var` option:

    terraform apply -var 'token=your-token-value'

{{< caution >}}
This method commits the command-line variable to your shell's history, so take care when using this method.
{{< /caution >}}

### Supply Variables at Prompt

If Terraform does not find a default value for a defined variable; or a value from a `.tfvars` file, environment variable, or CLI flag; it will prompt you for a value before running an action:

{{< output >}}
$ terraform plan
var.token
  Your API access token

  Enter a value:
{{< /output >}}

This method is a bit easier to use than supplying environment variables, and has the added benefit of displaying the description you set up when defining your variable.

## How to Manage Your State File

While it is relatively easy to keep secrets out of `.tf` files using any of the above methods, there is another file you need to be aware of when managing secrets, and that is the `terraform.tfstate` file.

This *state file* contains a JSON object that holds your managed infrastructure's current state. This state is a snapshot of the various attributes of your infrastructure at the time it was last modified. It is generated on `terraform apply` and is a necessary part of the Terraform process, as it maps the declarative code of your `.tf` files to your real world infrastructure.

As of the writing of this guide, **sensitive information used to generate your Terraform state can be stored as plain text in the `terraform.tfstate` file.** For example, if you are working with the Linode provider and have supplied a root password for your Linode instance, that root password will be stored as plain text in the state file. **Avoid checking your `terraform.tfstate` file into your version control repository.** Instead, the following are some strategies for storing and sharing your state files.

### Remote Backends

Terraform [*backends*](https://www.terraform.io/docs/backends/index.html) allow the user to securely store their state in a remote location, such as a key/value store like [Consul](https://www.consul.io/), or an S3 compatible bucket storage like [Minio](https://www.minio.io/). This allows the Terraform state to be read from the remote store, and because the state only ever exists locally in memory, there is no worry about storing secrets in plain text.

Some backends, like Consul, also allow for state locking. If one user is applying a state, another user will be unable to make any changes.

Using a Terraform backend is the preferred way to share a Terraform state file.

### Encrypting Secrets

Third-party tools exist that allow you to encrypt your secrets. If you encrypt the secrets in your `terraform.tfstate` (or your `.tfvars` files), you can check them into version control securely:

-   [git-crypt](https://github.com/AGWA/git-crypt) allows you to encrypt files when they are committed to a Git repository. git-crypt also decrypts files when they are checked out.

    {{< note >}}
You must initialize git-crypt in a repository before committing your state file or variable value files, or they will not be eligible for encryption.
{{< /note >}}

-   [Terrahelp](https://github.com/opencredo/terrahelp) allows you to encrypt and decrypt a whole state file, or just the variables you have include in your `terraform.tfvars` file.

### Use a Dummy Password

It is possible to supply a dummy password to Terraform and later change that password manually to a more secure one. For instance, if you were to create a Linode instance with a dummy root password, you could later change that password from the command line or in the Linode Manager.

{{< note >}}
Any attempt to change the password in a `.tf` file will result in the creation of new resources on `terraform apply`.
{{< /note >}}

### Privatize Version Control

If you are unwilling or unable to use the above options to help manage your state file, and if you are using a platform like GitHub or GitLab to share your state files, then at minimum the repository should be private.
