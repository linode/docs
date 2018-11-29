---
author:
  name: Linode
  email: docs@linode.com
description: 'How to Manage Secrets with Terraform'
keywords: ['terraform','secrets','secrets management','backend','hcl']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-26
modified: 2018-11-26
modified_by:
  name: Linode
title: "Secrets Management with Terraform"
contributor:
  name: Linode
external_resources:
- '[Terraform Variables](https://www.terraform.io/docs/configuration/variables.html)'
- '[Terraform Backend Configuration](https://www.terraform.io/docs/backends/config.html)'
- '[Terraform Backend Types](https://www.terraform.io/docs/backends/types/index.html)'
- '[Terraform State Storing and Locking](https://www.terraform.io/docs/backends/state.html)'
- '[GitHub Discussion on Storing Sensitive Information with Terraform](https://github.com/hashicorp/terraform/issues/516)'

---

Terraform is an Infrastructure as Code (IaC) tool that allows you to write declarative code to manage your infrastructure. However, in order to implement IaC with Terraform it is necessary to supply secrets such as server passwords and API tokens within your code. This guide will discuss the known methods for securing those secrets within Terraform.

## Keeping Secrets Out of .tf Files

In Terraform, `.tf` files contain the declarative code used to create, manage, and destroy infrastructure. This code is often committed to a version control system like Git, using a platform like GitHub, and shared within a team. Because it is easy for this information to become public-facing, it is important that you make sure your committed code is free of secrets. There are currently a few ways to keep your secrets out of your `.tf` files.

### Variable Files

Terraform employs *variable files* to help separate variable values from `.tf` files. When Terraform runs a command like `plan` or `apply`, it looks through the working directory for a file named `terraform.tfvars`, or for files with the `.auto.tfvars` extension, and populates the variable values they contain wherever they are [interpolated](https://www.terraform.io/docs/configuration/interpolation.html). This means that you can provide variable definitions in a `.tf` file and the values for those variables in a `.tfvars` file. For example, you might have a `linode-infrastructure.tf` file with a Provider block that requires an API access token:

{{< file "linode-infrastructure.tf" >}}
variable "token" {
  description = "Your API Access Token"
}

provider "linode" {
    token = "${var.token}"
}
{{< /file >}}

You would then provide a `terraform.tfvars` file with the following value:

{{< file "terraform.tfvars" >}}
token = 'a1b2c3d4e5f6g7h8i9j0'
{{< /file >}}

The `terraform.tfvars` file would then be added added to a `.gitignore` file and kept out of version control, allowing you to safely commit the `linode-infrastructure.tf` file. For ease of use with large `terraform.tfvars` files, it might be beneficial to include an example file (`terraform.tfvars.example`) in your Git repository with all of the variable names defined, so that it is easier for a team member to recreate this file locally.

Additionally, you can supply any file with a `.tfvars` extension to Terraform by using the `-var-file` option.

    terraform apply -var-file=myvars.tfvars

Supplying multiple `.tfvars` file is another way to further separate secret variables and non-secret variables.

### Environmental Variables

Terraform allows for the use of environmental variables. These variables have the prefix `TF_VAR_` and are supplied at the command line. Using the above example of an API access token, you could export the variable like so:

    export TF_VAR_token=a1b2c3d4e5f6g7h8i9j0

You could then interpolate the value as normal:

    ${var.token}

You could also include the variable when running `terraform plan` or `terraform apply`:

    TF_VAR_token=a1b2c3d4e5f6g7h8i9j0 terraform apply

This method does commit the environmental variable to your shell's history, so take care when using this method.

### Supply Variables at Prompt

If Terraform does not find a value for a defined variable in a `.tf` file, in a `.tfvars` file, or in an environmental variable, it will prompt you for a value before running an action.

{{< output >}}
$ terraform plan
var.token
  Your API Access Token

  Enter a value:
{{< /output >}}

This method is a bit easier to use than supplying environmental variables, and has the added benefit of using the description you set up when defining your variable to ease deployment.

## How to Manage Your State File

While it is relatively easy to keep secrets out of `.tf` files using any of the above methods, there is another file you need to be aware of when managing secrets, and that is the `terraform.tfstate` file. This *state file* contains a JSON object that holds your managed infrastructure's current state, i.e., a snapshot of the various attributes of your infrastructure at the time it was last modified. It is generated on `terraform apply` and is a necessary part of the Terraform process, as it matches the declarative code of the `.tf` file to real world infrastructure.

However, as of the writing of this guide, **sensitive information used to generate your Terraform state can be stored as plain text in the `terraform.tfstate` file**. For example, if you are working with the Linode Provider and have supplied a root password for your Linode Instance, that root password will be stored as plain text in the state file. The following are some strategies for storing and sharing your state files.

### Remote Backends

Terraform [Backends](https://www.terraform.io/docs/backends/index.html) allow the user to securely store their state in a remote location, such as a key/value store like [Consul](https://www.consul.io/), or an S3 compatible bucket storage like [Minio](https://www.minio.io/). This allows the Terraform state to be read from the remote store, and because the state only ever exists locally in memory, there is no worry about storing secrets in plain text. Some Backends, like Consul, also allow for state locking, so that if one user is applying a state another user will be unable to make any changes.

Using a Backend is the preferred way to share a Terraform state file.


### Use a Dummy Password

It is possible to supply a dummy password to Terraform and later change that password manually to a more secure one. For instance, if you were to create a Linode Instance with a dummy root password, you could later change that password from the command line or in the Linode Manager. Note, however, that any attempt to change the password in a `.tf` file will result in the creation of new resources on `terraform apply`.

### Encrypting Secrets

There are some third-party tools that allow you to encrypt your secrets.

[git-crypt](https://github.com/AGWA/git-crypt) allows you to encrypt files when they are committed to a Git repository, and decrypt files when they are checked out. With `git-crypt` you could encrypt your `terraform.tfstate` file and securely commit it to version control. Note that for this option, you must initialize `git-crypt` in a repository before committing your state file or the state file will not be eligible for encryption.

Another option is [Terrahelp](https://github.com/opencredo/terrahelp). Terrahelp allows you to encrypt and decrypt a whole state file, or just the variables you have include in your `terraform.tfvars` file.

### Privatize Version Control

If you are unwilling or unable to use the above options to help manage your state file, and if you are using a platform like GitHub or GitLab to share your state files, then at the very least the repository should be private.


