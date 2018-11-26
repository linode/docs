---
author:
  name: Linode
  email: docs@linode.com
description: 'A look into Terraform''s primary components, features, and configurations for the new Terraform user'
keywords: ["terraform", "orchestration", "linode provider"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-11-26
modified_by:
  name: Linode
published: 2018-11-26
title: A Beginner's Guide to Terraform
external_resources:
 - '[Terraform Documentation](https://www.terraform.io/docs/index.html)'
---

EDITOR'S NOTE: There's a decent amount of overlap with the existing `Use Terraform to Provision Linode Environments` guide here, which I think is ok. The HCL section here includes a healthy amount of example syntax, which I consider to be a good idea so that readers brand-new to Terraform have a more concrete sense of what using it actually looks like.

Intro paragraph: define Terraform, e.g.:

    Terraform is an orchestration tool that provides a method for declaring your server infrastructure in code, instead of manually creating them via the Linode Manager or API.

Paragraph (or include in previous paragraph): What Terraform does vs what it doesn't do, e.g.:

    Terraform creates and destroys servers and other elements of your infrastructure. Terraform generally does not configure your servers' software, which is the responsibility of configuration management (link down to #salt-and-chef subsection in Provisioners section).

EDITOR'S NOTE: Using the intro to the beginners guide to salt as an analog for the content of this section.

## The Linode Provider

Paragraph:

- What are Terraform providers
- When was the Linode Terraform provider first made officially available
- Note about how the Linode provider uses APIv4 and requires an access token
- What infrastructure elements can be created with the Linode provider

## HashiCorp Configuration Language

Paragraph: What is HCL, how is it used by Terraform.

Simple example to illustrate syntax (make a better example than this):

{{< file >}}
provider "linode" {
  token = "$LINODE_TOKEN"
}

resource "linode_instance" "foobar" {
  # ...
}
{{< /file >}}

Link to full HCL syntax reference (https://www.terraform.io/docs/configuration/syntax.html) or Linode's separate HCL guide (currently being written).

### Infrastructure as Code

Paragraph: elaborate on the infrastructure-as-code metaphor from the intro paragraph. Contrast with using the API to create infrastructure. List benefits of infrastructure-as-as code, e.g.:

-   Being able to version control IaC
-   Minimization of human error
-   Better collaboration among team members
-   Idempotent application of Terraform configuration

EDITOR'S NOTE: see `Benefits of States and Configuration Management` section of Beginner's Guide to Salt for example benefits, which are similar to benefits of Terraform

### Resources

Paragraph: define Resources in the context of HCL and the Linode Provider, e.g.: Resource declarations correspond with the components of your Linode infrastucture: Linode instances, Block Storage Volumes, etc.

Simple example that creates a Linode:

{{< file >}}
resource "linode_instance" "web" {
    label = "simple_instance"
    group = "foo"
    image = "linode/ubuntu18.04"
    region = "us-central"
    type = "g6-standard-1"
    authorized_keys = ["ssh-rsa AAAA...Gw== user@example.local"]
    root_pass = "terr4form-test"
}
{{< /file >}}

{{< note >}}
Note about how the `root_pass` declaration is mandatory, as Linode instances require a root password assignment at creation.
{{< /note >}}

#### Dependencies

Paragraph: explain how resources can have implicit or explicit dependencies between each other.

Simple example file: Create a domain resource that uses the IP address from the previous example's Linode instance resource.

{{< file >}}
Insert syntax for that example here.
{{< /file >}}

### Variables

Paragraph: explain how variables can be used to fill in parameters in a Terraform configuration.

New example that sets variables for the `region`, `root_pass`, and `authorized_keys` declarations in the first Resources example.

{{< file >}}
Insert example here
{{< /file >}}

## Terraform CLI

Paragraph: Introduce the CLI as the primary method for interacting with Terraform.

## Plan and Apply

Paragraph: Define the Plan command and show how it works.

Paragraph: Define the Apply command and show how it works.

### State

Paragraph: Explain how Terraform maintains a state file (not to be confused with Salt states) in order to keep track of what infrastructure has been provisioned via Terraform.

Paragarph: Explain how this state information is stored locally by default (in a terraform.tfstate file). Note that it can be stored in other backend for better collaboration with teams (link to #backends section further down in guide)

### Other Commands

Link out to Terraform reference doc for other commands (https://www.terraform.io/docs/commands/index.html)

## Provisioners

Paragraph: define Provisioners, similar to Terraform docs' definition. EDITOR'S NOTE: This is a direct copy from their docs, avoid plagiarizing it in our actual guide:

    Provisioners are used to execute scripts on a local or remote machine as part of resource creation or destruction. Provisioners can be used to bootstrap a resource, cleanup before destroy, run configuration management, etc.

Link out to Terraform provisioners reference: https://www.terraform.io/docs/provisioners/index.html

Paragraph: describe how provisioners (except for `null_resource` are added to resource declaration, that multiple provisioners can be added to a resource, and that they will be run in the order they are listed in inside a resource declaration.

### Uploading Files and Executing Commands

Paragraph: introduce the `file`, `local-exec`, and `remote-exec` provisioners.

Simple example: use the `remote-exec` provisioner to install Apache

{{< file >}}
Insert example here
{{< /file >}}

{{< note >}}
Make a note that Stackscripts (which can be assigned in a Linode instance resource) are an alternative to using the `remote-exec` provisioner.
{{< /note >}}

### Salt and Chef

Paragraph: introduce the `chef` and `salt-masterless` provisioners as a means of integrating those two configuration management softwares.

## Modules

Define Modules and show an example similar to the Module section of the current Terraform guide:
https://linode.com/docs/applications/configuration-management/how-to-build-your-infrastructure-using-terraform-and-linode/#terraform-modules

The Module section could technically be a subsection of the HCL section, but if we did that I feel like the guide would be a little 'top-heavy'. I think segueing into Terraform commands (Plan and Apply) faster is worth it.

## Backends

Paragraph: introduce Terraform Backends and their benefits as described here:
https://www.terraform.io/docs/backends/index.html

List backend types: https://www.terraform.io/docs/backends/types/index.html

## Importing?

Possible section introducing that existing infrastructure can be added to Terraform (don't go far into detail, maybe just link out to the guide we write on that subject, if we do).

## Next Steps