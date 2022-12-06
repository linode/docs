---
slug: secrets-management-with-ansible
author:
  name: Linode Community
  email: docs@linode.com
description: "Two to three sentences describing your guide."
og_description: "Two to three sentences describing your guide when shared on social media."
keywords: ['ansible secrets manager','ansible vault tutorial','ansible secrets best practices']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-07
modified_by:
  name: Nathaniel Stickman
title: "Secrets Management with Ansible"
h1_title: "Secrets Management with Ansible"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Red Hat - Enable Sysadmin: Handling Secrets in Your Ansible Playbooks](https://www.redhat.com/sysadmin/ansible-playbooks-secrets)'
- '[Ansible Documentation: Protecting Sensitive Data with Ansible Vault](https://docs.ansible.com/ansible/latest/vault_guide/index.html)'
---

## Before You Begin

1. If you have not already done so, create a Linode account. See our [Getting Started with Linode](/docs/guides/getting-started/) guide.

1. Follow our guide on [Getting Started With Ansible: Basic Installation and Setup](/docs/guides/getting-started-with-ansible/). Specifically, follow the sections on setting up a control node, configuring Ansible, and creating an Ansible inventory.

1. Ensure that you create enough instances to have one as an Ansible control node and the rest as Ansible managed nodes. For examples, this tutorial assumes three nodes, one control and two managed.

1. Refer to our guide [Automate Server Configuration with Ansible Playbooks](/docs/guides/running-ansible-playbooks/) for an overview of Ansible playbooks and their operations.

## Secrets in Ansible

First, a secret here refers to a key or other credential that allows access to a resource or a system. Secrets include things like access tokens, API keys, and also database and system passwords.

Often when managing nodes with Ansible you need to provide it with secrets. You can provide these secrets within your Ansible playbooks, but doing so exposes the secrets to possible interception and exploitation.

To secure your secrets, you should implement secret management with your Ansible playbooks. Secret management refers to the ways in which you can keep secrets stored safely, with storage methods balancing between accessibility and security.

## Managing Secrets in Ansible

Several options exist for managing secrets with your Ansible playbooks. The option that fits your needs depends on your setup. How accessible you need your secrets to be and how secure you want to make them determine which solutions work best for you.

The upcoming sections outline some of the most useful options for managing secrets with Ansible. These attempt to cover a range of use cases as well, from interactive and manual to automated and integrated.

### Using Prompts to Manually Enter Secrets

Ansible playbooks include the option to prompt users for variables. And this is actually an option for managing secrets within your Ansible setup.

With this option, you configure your Ansible playbook to prompt users to manually input secrets. The secrets never need to be persisted on the system, allowing you to safeguard them otherwise. And the setup is the easiest of all of the options covered here.

Of course, this option comes with some significant drawbacks. By not storing the secrets, you also prevent Ansible from accessing them automatically. Additionally, leaving the secrets to manual entry introduces its own risks, as users can mishandle secrets.

For these reasons this option is best when:

- You are manually running Ansible playbooks

- You are only using the playbooks within a small team

**[SHOW THIS OPTION IN ACTION]**



### Using the Ansible Vault to Manage Secrets

Ansible has its own tool that can facilitate secrets management, Ansible Vault. The Vault encrypts information, which you can then use within your Ansible playbooks.

Ansible requires the Vault password to decrypt information, and it provides two ways to supply passwords. Ansible can prompt the user for manual password entry, or you can point Ansible to a password file.

With some setup, Ansible Vault can make secrets both secure and accessible. Secrets are encrypted, meaning that no one can get to them without your password. The secrets are, at the same time, made accessible to Ansible. A password file can give Ansible everything it needs to run in an automated setup.

A password file may not provide the level of security you need. However, you can alternatively use an external password manager, implementing a script or other solution to retrieve the password.

**[SHOW THIS OPTION IN ACTION]**

```command
echo "access_token: <SECRET_ACCESS_TOKEN>" > secrets.enc
ansible-vault encrypt secrets.enc
```

```file {title="ansible.yml" lang="yml"}
token: {{ access_token }}
```

```command
ansible-playbook -e @secrets.enc --ask-vault-pass ansible.yml
```

### Using a Secrets Manager

Dedicated solutions exist for managing secrets, with many password managers capable of doing so for your Ansible playbooks. In terms of their underlying methods, many of these tools function similarly to Ansible Vault. And despite being external tools, community plugins for Ansible exist to support several of these tools.

The primary advantage of an external secrets management solution is using a tool already adopted more widely among your team and/or organization. Ansible Vault may offer a default integration with Ansible, but likely you are not using it more widely for password management within your team/organization.

One of the more popular solutions for secret management is [HashiCorp's Vault](https://www.vaultproject.io/).

[Setting Up and Using a Vault Server](/docs/guides/how-to-setup-and-use-a-vault-server/)

**[SHOW THIS OPTION IN ACTION]**

## Conclusion
