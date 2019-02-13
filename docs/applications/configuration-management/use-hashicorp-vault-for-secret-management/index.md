---
author:
  name: Tyler Langlois
  email: ty@tjll.net
description: 'How to configure, deploy, and use HashiCorp Vault to manage application secrets'
keywords: ['vault','secrets','secrets management','hcl','token','authentication']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-02-12
modified: 2019-02-12
modified_by:
  name: Linode
title: "Use HashiCorp Vault to Manage Secrets"
contributor:
  name: Linode
external_resources:
- '[Terraform Input Variable Configuration](https://www.terraform.io/docs/configuration/variables.html)'
---

[HashiCorp Vault](https://www.vaultproject.io/) is a secrets management tool that helps to provide secure, automated access to sensitive data. Vault meets these use cases by coupling authentication methods (such as application tokens) to secret engines (such as simple key/value pairs) using policies to control how access is granted. In this guide, you will deploy, configure, and access Vault in an example application to illustrate Vault's features and API.

## Why Use Vault?

A service such as Vault requires operational effort to run and secure. Given the added complexity of running Vault for use in an application, in what way does it add value?

Consider a simple application that must use an API token or other secret value. How should this sensitive credential be given to the application at runtime?

- Committing the secret alongside the rest of the application code in a version control system such as `git` is a poor security practice for a number of reasons, including that the sensitive value is recorded in plaintext and not protected in any way.
- Recording a secret in a file that is passed to an application requires that the file be securely populated in the first place and strictly access-controlled.
- In the case of a compromised application, static credentials are challenging to rotate or restrict access to.

## Concepts

Before continuing, you should familiarize yourself with important Vault terms and concepts that will be used later in this guide.

- A **token** is the the underlying mechanism that underpins access to Vault resources. Whether a user authenticates to Vault using a GitHub token or a service authenticates using an [AppRole](https://www.vaultproject.io/docs/auth/approle.html) RoleID and SecretID, all forms of authentication are eventually normalize to a **token**. Tokens are typically short-lived (that is, expire after a period of time) and have one or more *policies* attached to them.
- A Vault **policy** dictates certain actions that may be performed upon a Vault **path**. Capabilities such as the ability to read a secret, write secrets, and delete them are all examples of actions that are defined in a policy for a particular **path**.
- **path**s in Vault are similar in form to Unix filesystem paths (like `/etc`) or URLs (such as `/blog/title`). Users and machine accounts interact with Vault over particular paths in order to retrieve secrets, change settings, or otherwise interact with a running Vault service. All Vault access is performed over a REST interface, so these paths eventually take the form of an HTTP URL. While some paths interact with the Vault service itself to manage resources such as policies or settings, many important paths serve as an endpoint to either authenticate to Vault or interact with a **secret engine**.
- A **secret engine** is a backend used in Vault to provide secrets to Vault users. The simplest example of a **secret engine**

{{< caution >}}
Example caution.
{{< /caution >}}

{{< output >}}
Example textual output.
{{< /output >}}

    {{< note >}}
Example indented note.
{{< /note >}}

{{< note >}}
Example note.
{{< /note >}}
