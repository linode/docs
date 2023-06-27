---
slug: secrets-management-with-terraform
description: 'Learn everything you need to know about secrets management with Terraform.'
keywords: ['terraform','secrets','secrets management','backend','hcl']
tags: ["security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-12-12
modified: 2021-08-13
modified_by:
  name: Linode
image: SecretsManagementwithTerraform.png
title: "Managing Secrets with Terraform"
title_meta: "Secrets Management with Terraform"
external_resources:
- '[Terraform Input Variable Configuration](https://www.terraform.io/docs/configuration/variables.html)'
- '[Terraform Backend Configuration](https://www.terraform.io/docs/backends/config.html)'
- '[Terraform Backend Types](https://www.terraform.io/docs/backends/types/index.html)'
- '[Terraform State Storage and Locking](https://www.terraform.io/docs/backends/state.html)'
- '[GitHub Discussion - Storing Sensitive Values in State Files](https://github.com/hashicorp/terraform/issues/516)'
aliases: ['/applications/configuration-management/terraform/secrets-management-with-terraform/','/applications/configuration-management/secrets-management-with-terraform/']
authors: ["Linode"]
tags: ["saas"]
---

Terraform is an Infrastructure as Code (IaC) tool that allows you to write declarative code to manage your infrastructure. In order to implement IaC with Terraform it is necessary to supply secrets, such as server passwords and API tokens, in the code. This guide discusses methods for securing those secrets within Terraform.

{{< note >}}
[Terraform’s Linode Provider](https://github.com/terraform-providers/terraform-provider-linode) has been updated and now requires Terraform version 0.12 or later. To learn how to safely upgrade to Terraform version 0.12 or later, see [Terraform’s official documentation](https://www.terraform.io/upgrade-guides/0-12.html). View [Terraform v0.12’s changelog](https://github.com/hashicorp/terraform/blob/v0.12.0/CHANGELOG.md) for a full list of new features and version incompatibility notes.

The examples in this guide were written to be compatible with [Terraform version 0.11](https://www.terraform.io/docs/configuration-0-11/terraform.html).
{{< /note >}}

## Keeping Secrets Out of .tf Files

In Terraform, `.tf` files contain the declarative code used to create, manage, and destroy infrastructure. This code is often committed to a version control system such as Git, using a platform such as GitHub, and shared within a team. Because it is easy for this information to become public-facing, it is important that you make sure your committed code is free of secrets.

### Input Variables

Terraform configurations in `.tf` files can accept values from [*input variables*](https://www.terraform.io/docs/configuration/variables.html). These variables are included in your configuration using Terraform's [interpolation syntax](https://www.terraform.io/docs/configuration/interpolation.html).

For example, you might have a `linode-infrastructure.tf` file within a provider block that requires an API access token. The `token` variable definition is declared inside the `.tf` file and is then interpolated inside the provider declaration with the `"${var.token}"` syntax:

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

You can later use this variable when declaring your Linode instances.
{{< /note >}}

### Assigning Variable Values in a File

The values assigned to your variables apart from default values are not included in the variable definitions in the `.tf` files. Instead, the values are stored in separate files with the `.tfvars` extension. When Terraform runs a command such as `plan` or `apply`, it automatically looks through the working directory for a file named `terraform.tfvars`, or for files with the `.auto.tfvars` extension.

Here's an example `terraform.tfvars` which supplies a value for the `token` variable from the previous example:

{{< file "terraform.tfvars" >}}
token = 'your-token-value'
{{< /file >}}

You can then add the `terraform.tfvars` file to the `.gitignore` file and keep it out of version control. This strategy allows you to safely commit the `linode-infrastructure.tf` file.

For ease of use with large `terraform.tfvars` files, it might be beneficial to include an example `terraform.tfvars.example` in your Git repository. The variable names can be recorded, but none of the values need to be entered. Team members could then copy this example into their local repository's `terraform.tfvars` and enter the appropriate values.

{{< note >}}
Variable value files with names that don't match `terraform.tfvars` or `*.auto.tfvars` can be specified with the `-var-file` option:

    terraform apply -var-file=myvars.tfvars

Supplying multiple `.tfvars` files is another way to further separate secret variables and non-secret variables; e.g.:

    terraform apply \
    -var-file=non-secret-variables.tfvars \
    -var-file=secret-variables.tfvars

{{< /note >}}

#### Marking Variables as Sensitive

You have so far defined variables in the following format:

{{< file >}}
variable "database_username" {
    description = "Username of database administrator"
    type = string
}
{{< /file >}}

Defining a variable in this format also brings an issue where certain variables that you like to keep out of the logs are still logged.

But with the option to mark variables as sensitive, any variable that you mark as sensitive is automatically excluded from the logs. Adding `sensitive = true` helps you mark variables as sensitive. Now, mark `database_username` as a sensitive variable by editing the variable definition to the following:

{{< file >}}
variable "database_username" {
    description = "Username of database administrator"
    type = string
    sensitive = true
}
{{< /file >}}

Define another variable here named "data_password" that you intend to use later in this guide.

{{< file >}}
variable "database_password" {
    description = "Password of database administrator"
    type = string
    sensitive = true
}
{{< /file >}}

### Assigning Values in Environment Variables

Terraform allows you to keep input variable values in environment variables. These variables have the prefix `TF_VAR_` and are supplied at the command line. Using the above example of an API access token, you can export the variable and use it as follows:

    export TF_VAR_token=your-token-value
    terraform apply

You can also include the variable on the same line when running `terraform plan` or `terraform apply`:

    TF_VAR_token=your-token-value terraform apply

{{< note type="alert" >}}
This method commits the environment variable to your shell's history, so take care when using this method.
{{< /note >}}

### Assigning Values in Command-Line Flags

Variable values can be set with the `-var` option:

    terraform apply -var 'token=your-token-value'

{{< note type="alert" >}}
This method commits the command-line variable to your shell's history, and exposes it to other users on the system running `ps`.
{{< /note >}}

### Supply Variables at Prompt

If Terraform does not find a default value for a defined variable, a value from a `.tfvars` file, environment variable, or CLI flag, it prompts you for a value:

{{< output >}}
$ terraform plan
var.token
  Your API access token

  Enter a value:
{{< /output >}}

This method is a bit easier to use than supplying environment variables. It also displays the description you set up when defining your variable.

## How to Manage Your State File

It is relatively easy to keep secrets out of `.tf` files using any of the above methods. However, you also need to be aware of the `terraform.tfstate` file to manage secrets.

This *state file* contains a JSON object that holds your managed infrastructure's current state. This state is a snapshot of the various attributes of your infrastructure when it was last modified. It is generated on `terraform apply` and is a necessary part of the Terraform process. Because it maps the declarative code of your `.tf` files to your real world infrastructure.

As of the writing of this guide, **sensitive information used to generate your Terraform state can be stored as plain text in the `terraform.tfstate` file**. For example, if you are working with the Linode provider and have supplied a root password for your Linode instance. This root password is stored as plain text in the state file. **Avoid checking your `terraform.tfstate` file into your version control repository**. Instead, the following are some strategies for storing and sharing your state files.

### Remote Backends

Terraform [*backends*](https://www.terraform.io/docs/backends/index.html) allow the user to securely store their state in a remote location. For example, a key/value store like [Consul](https://www.consul.io/), or an S3 compatible bucket storage like [Minio](https://www.minio.io/). This allows the Terraform state to be read from the remote store. Because the state only ever exists locally in memory, there is no worry about storing secrets in plain text.

Some backends, like Consul, also allow for state locking. If one user is applying a state, another user cannot make any changes.

Using a Terraform backend is the preferred way to share a Terraform state file.

### Encrypting Secrets

Third-party tools exist that allow you to encrypt your secrets. If you encrypt the secrets in your `terraform.tfstate` or `.tfvars` files, you can check them into version control securely:

-   [git-crypt](https://github.com/AGWA/git-crypt) allows you to encrypt files when they are committed to a Git repository. git-crypt also decrypts files when they are checked out.

    {{< note respectIndent=false >}}
You must initialize git-crypt in a repository before committing the state file or variable value files, else the files are encrypted.
{{< /note >}}

-   [Terrahelp](https://github.com/opencredo/terrahelp) allows you to encrypt and decrypt a whole state file, or just the variables you have include in the  `terraform.tfvars` file.

### Use a Dummy Password

It is possible to supply a dummy password to Terraform and later change it to a more secure password. For instance, if you create a Linode instance with a dummy root password, you can later change that password from the command line, or in the Linode Manager.

{{< note >}}
Any attempt to change the password in a `.tf` file results in the creation of new resources on `terraform apply`.
{{< /note >}}

### Privatize Version Control

If you are not able to use the above options to manage the state file, and using a platform like GitHub or GitLab to share your state files, then at minimum the repository should be private.

## Using `pass` For Secret Management With Terraform

After you have defined your secrets properly in a variable, you can pass these variables to your Terraform resources.

{{< file >}}
# Configure the Linode provider
provider "linode" {
  token = "$LINODE_TOKEN"
}

resource "linode_instance_1" "linode" {
    type = "simple"
    domain = "linode.example"
    soa_email = "linode@linode.example"
    tags = ["tag1", "tag2"]

    #Here we set secrets from the variables
    username = var.database_username
    password = var.database_password
}

resource "linode_instance_2" "linode_2" {
    domain_id = "${linode_domain.linode_2.id}"
    name = "www"
    record_type = "CNAME"
    target = "linode_2.example"
}
{{< /file >}}

You can also set secrets directly in your environment variables. And you can define environmental variables that are automatically picked up every time you run Terraform.

To do so, first you need to set these secrets as environment variables. You can do that by:

        export TF_VAR_database_username=("Username of database administrator")
        export TF_VAR_database_password=("Password of database administrator")

{{< note >}}
After the variables are properly defined, the next time you run Terraform, it automatically picks up secrets
terraform apply
{{< /note >}}

### Installing `pass`

If you don't already have `pass` installed on your machine, run the following command to install it:

      sudo apt install pass

After `pass` is installed, you can store your secrets by running `pass insert` for all of your secrets. In this illustration run `pass insert` on secrets `database_username` and `database_password`.

        pass insert database_username

Enter password for database_username: admin

        pass insert database_password

Enter password for database_password: password

Now run the following command : `pass <your secret>`

This makes it easier to manage secrets in Terraform, and reduces the maintainability of your codebase. Because secret management is defined outside of Terraform's code.

## Secret Management Using Vaults

You can also use a secret store for Terraform secret management. Use an open source, and cross-platform secret management store like HashiCorp Vault helps to store sensitive data and limit who can access it.

HashiCorp vaults leverage a token to authenticate access, a policy that defines what actions can be taken. It also uses the paths that allow a secret engine which serves secrets to HashiCorp Vault.

Terraform's `valut_generic_secret` allows us to read secrets with HashiCorp Vault.

{{< file >}}
data "vault_generic_secret" "linode_auth" {
  path = "secret/linode_auth"
}
{{< /file >}}

{{< note >}}
For this example, in Vault there is a key named "auth_token" and the value is the token we need to keep secret.

In general usage, replace "auth_token" with the key you wish to extract from Vault.

{{< file >}}
provider "linode" {
  url        = "http://auth1-ssw.linode.com/"
  auth_token = "${data.vault_generic_secret.linode_auth.data["auth_token"]}"
}
{{< /file >}}

{{< /note >}}

You now can manage secrets with the Terraform code.

{{< file >}}
resource "linode_instance" "linode" {
    type = "simple"
    domain = "linode.example"
    soa_email = "linode@linode.example"
    tags = ["tag1", "tag2"]

    #Here we set secrets from the variables
    username = var.database_username
    password = var.database_password
}
{{< /file >}}

Managing Terraform secrets with HashiCorp, you can reap the following benefits:
1. No plain text secrets within your code, with highly controlled access to secrets
2. You gain a high degree of maintainability as you don't have to write or update wrappers
3. You can also leverage APIs for secret management, which makes it easy to re-use these secrets with other services or applications
4. You can view logs and run audits to see what data someone accessed and who requested that data.
5. Secret rotation with HashiCorp Vault is another key security advantage for Terraform secret management

### HashiCorp Key Rotation For Better Terraform Secret Management

With fixed keys, it gets hard to develop a robust and reliable security layer that keeps your system safe. Secure secret management can also rely on rotating or periodically changing your HashiCorp Vault's encryption keys.

NIST has provided directions on how you can implement vault key rotation to safeguard your secrets. After every 2^32 encryptions, we should rotate our vault encryption keys. Parameters like `vault.barrier.put`, `vault.token.creation` and `merkle.flushDirty.num_pages`, WAL index help calculate the number of encryptions.
