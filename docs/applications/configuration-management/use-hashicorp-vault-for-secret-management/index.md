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

A service such as Vault requires operational effort to run securely and effectively. Given the added complexity of using Vault as part of an application, in what way does it add value?

Consider a simple application that must use an API token or other secret value. How should this sensitive credential be given to the application at runtime?

- Committing the secret alongside the rest of the application code in a version control system such as `git` is a poor security practice for a number of reasons, including that the sensitive value is recorded in plaintext and not protected in any way.
- Recording a secret in a file that is passed to an application requires that the file be securely populated in the first place and strictly access-controlled.
- In the case of a compromised application, static credentials are challenging to rotate or restrict access to.

Vault solves these and other problems in a number of ways:

- Services and applications that run without operator interaction can authenticate to Vault using values that can be rotated, revoked, and permission-controlled.
- Some secret engines, such as the [AWS Secret Engine](https://www.vaultproject.io/docs/secrets/aws/index.html), can generate temporary, dynamically-generated secrets to ensure that credentials expire after a period of time.
- Policies for users and machine accounts can be strictly controlled for specific types of access to particular paths.

## Concepts

Before continuing, you should familiarize yourself with important Vault terms and concepts that will be used later in this guide.

- A **token** is the the underlying mechanism that underpins access to Vault resources. Whether a user authenticates to Vault using a GitHub token or an application-driven service authenticates using an [AppRole](https://www.vaultproject.io/docs/auth/approle.html) RoleID and SecretID, all forms of authentication are eventually normalize to a **token**. Tokens are typically short-lived (that is, expire after a period of time or time-to-live, or `ttl`) and have one or more *policies* attached to them.
- A Vault **policy** dictates certain actions that may be performed upon a Vault **path**. Capabilities such as the ability to read a secret, write secrets, and delete them are all examples of actions that are defined in a policy for a particular **path**.
- **path**s in Vault are similar in form to Unix filesystem paths (like `/etc`) or URLs (such as `/blog/title`). Users and machine accounts interact with Vault over particular paths in order to retrieve secrets, change settings, or otherwise interact with a running Vault service. All Vault access is performed over a REST interface, so these paths eventually take the form of an HTTP URL. While some paths interact with the Vault service itself to manage resources such as policies or settings, many important paths serve as an endpoint to either authenticate to Vault or interact with a **secret engine**.
- A **secret engine** is a backend used in Vault to provide secrets to Vault users. The simplest example of a **secret engine** is the [key/value backend](https://www.vaultproject.io/docs/secrets/kv/index.html), which simply returns plain text values that may be stored at particular paths (these secrets remain encrypted on the backend). Other examples of secret backends include the [PKI backend](https://www.vaultproject.io/docs/secrets/pki/index.html), which can generate and manage TLS certificates, and the [TOTP backend](https://www.vaultproject.io/docs/secrets/totp/index.html), which can generate temporary one-time passwords for web sites that require multi-factor authentication (including the Linode Manager).

## Installation

This guide will use Docker to install Vault in a simple, local filesystem-only configuration. The steps listed here apply equally to any distribution that supports Docker.

The installation steps will be to:

- Procure a TLS certificate to ensure that all communications between Vault and clients are encrypted.
- Configure Vault for local filesystem storage.
- Run Vault as a Docker container.

{{< note >}}
The configuration outlined in this guide is suitable for small deployments. In situations that call for highly-available or fault-tolerant services, consider running more than one Vault instance with a highly-available storage backend such as [Consul](https://www.vaultproject.io/docs/configuration/storage/consul.html).
{{< /note >}}

### Acquire a TLS Certificate

1.  Follow the steps in our [Secure HTTP Traffic with Certbot](/docs/quick-answers/websites/secure-http-traffic-certbot/) guide to acquire a TLS certificate.

### Configure Vault

1.  Create a directory for Vault configuration files.

        sudo mkdir /etc/vault

1.  Create a configuration file for Vault with the following contents:

    {{< file "/etc/vault/vault.hcl" aconf >}}
storage "file" {
  path = "/vault/file"
}
{{< /file >}}

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
