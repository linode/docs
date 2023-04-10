---
slug: secrets-management-with-salt
description: 'Salt is a powerful configuration management tool. This guide provides you with an overview of available options to manage secrets with SaltStack.'
keywords: ['salt','saltstack','secret','secure','management','sdb','gpg','vault']
tags: ["security","automation","salt"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-06
modified: 2019-01-02
modified_by:
  name: Linode
image: SecretsManagementwithSalt.png
title: "Secrets Management with Salt"
external_resources:
  - '[Salt Pillar Walkthrough](https://docs.saltproject.io/en/latest/topics/tutorials/pillar.html)'
  - '[Using Environmental Variables in SLS Modules](https://docs.saltproject.io/en/latest/topics/tutorials/states_pt3.html#using-environment-variables-in-sls-modules)'
  - '[Salt GPG Renderer](https://docs.saltproject.io/en/latest/ref/renderers/all/salt.renderers.gpg.html)'
  - '[Salt SDB Documentation](https://docs.saltproject.io/en/latest/topics/sdb/)'
  - '[Salt SDB Modules](https://docs.saltproject.io/en/latest/ref/sdb/all/index.html)'
aliases: ['/applications/configuration-management/salt/secrets-management-with-salt/','/applications/configuration-management/secrets-management-with-salt/']
authors: ["Linode"]
---

Salt is a powerful configuration management tool which helps you manage your server deployments with configuration *state* files. These files are easily shared with others on your team and can be checked in to version control systems like Git.

A common problem when working with Salt's state files is the need access to sensitive data, like API keys and database passwords, within those files. Directly embedding that information as plain-text inside your state files can represent a security vulnerability, especially if you were to check those files into version control. This guide will explore some common methods for securing your secrets within Salt.

## Salt Pillar

A primary method for storing secrets in Salt is to keep them in Salt's [*Pillar*](https://docs.saltproject.io/en/latest/topics/pillar/) feature. Salt Pillar is designed to maintain secrets and other variable information in a single location (generally, on the Salt master) and then deliver that information to specific minions. If you separate your secrets out from your states and into pillar files, you can ignore those files in your version control system.

{{< note respectIndent=false >}}
In addition to storing secrets, Salt Pillar can also maintain non-sensitive data; for example, the versions of the packages you want to install on your minions. So, you may still want to track some pillar files in version control.

To handle this distinction, you could create a special directory at `/srv/pillar/secrets` and add set your version control system to ignore that directory (when using Git, list this directory in your `.gitignore` file). Keep all sensitive data inside pillar files within this directory, and maintain non-sensitive data in pillar files in `/srv/pillar` or another subfolder.
{{< /note >}}

### Anatomy of Pillar Data Files

Pillar data is kept in `.sls` files which are written in the same YAML syntax as states. These are generally stored within `/srv/pillar` on the Salt master, but this location can be configured via the `pillar_roots` option in your master's configuration.

For example, let's say your minion runs an application which accesses the [Linode API](/docs/products/tools/api/). This example pillar file records your API token in a variable called `linode_api_token`:

{{< file "/srv/pillar/app_secrets.sls" >}}
linode_api_token: YOUR_API_TOKEN
{{< /file >}}

As with state files, a top file (separate from your states’ top file) maps pillar data to minions. This example top file maps your `app_secrets` pillar data to your app server:

{{< file "/srv/pillar/top.sls" >}}
base:
  'appserver':
    - app_secrets
{{< /file >}}

{{< note respectIndent=false >}}
You may want to create a `pillar.example` file (like those provided by Salt formulas) that lists all the known variable keys for your pillar but does not contain the actual secrets. If you check this file into your version control, other users that clone your states' repository can duplicate this example pillar file and more quickly set up their own deployments.
{{< /note >}}

### Accessing Pillar Data inside Salt States

To inject pillar data into your states, use Salt's Jinja template syntax. While Salt uses the YAML syntax for state and pillar files, the files are first interpreted as Jinja templates (by default).

This example state embeds the API token in a file on your Linode; the data is accessed through the `pillar` dictionary:

{{< file "/srv/salt/setup_app.sls" >}}
api_token:
  file.managed:
    - name: /var/your_app/api_token
    - contents: {{ pillar['linode_api_token'] }}
{{< /file >}}

{{< note type="alert" respectIndent=false >}}
There are times when pillar data could show up in the output that Salt generates, like when `file.managed` displays diffs of a modified file. To avoid displaying these diffs, you can set `file.managed`'s `show_diff` flag to false.
{{< /note >}}

### Passing Pillar Data at the Command Line

You can also supply pillar values as a dictionary through the command line, and those values will override any values set in your pillar files. This example command would apply the `A_DIFFERENT_API_TOKEN` value instead of the original `YOUR_API_TOKEN` from the previous example:

    salt '*' state.apply pillar='{"linode_api_token": "A_DIFFERENT_API_TOKEN"}'

## Environment Variables

Another way to keep sensitive values out of version control is to use environment variables. The method for passing environment variables to your states is similar to how pillar data can be passed via the command line. The environment variable prefixes your salt command, as in this example:

    LINODE_API_TOKEN="YOUR_API_TOKEN" salt 'appserver' state.apply setup_app

The environment variable is referenced by a Salt state file through the `salt['environ.get']('ENVIRONMENT_VARIABLE_NAME')` syntax. The previous `setup_app` example state can be adapted to use an environment variable as follows:

{{< file "/srv/salt/setup_app.sls" >}}
api_token:
  file.managed:
    - name: /var/your_app/api_token
    - contents: {{ salt['environ.get']('LINODE_API_TOKEN') }}
{{< /file >}}

As with the previous pillar example, you'll want to keep `file.managed`'s diffs from appearing on screen when dealing with sensitive information by setting `show_diff: false`. For more information, see [Using Environment Variables in SLS Modules](https://docs.saltproject.io/en/latest/topics/tutorials/states_pt3.html#using-environment-variables-in-sls-modules).

## GPG Encryption

You can use Salt's [GPG renderer](https://docs.saltproject.io/en/latest/ref/renderers/all/salt.renderers.gpg.html) to decrypt GPG ciphers that are located in your pillar files. This decryption step happens before your pillar data is passed to your minions. As a result, any value in a pillar file can be encrypted. Because the values are encrypted, you can store your pillar files in version control securely.

This approach requires that the GPG secret key is stored on your Salt master. It also makes sense to include the public key in version control so that your team members can use it to encrypt new data for your pillar files.

## SDB

Salt comes with a database interface called *SDB* that was initially created to store non-minion-specific data, such as passwords. It was designed to connect to a package like Salt's [*keyring*](https://docs.saltproject.io/en/latest/ref/sdb/all/salt.sdb.keyring_db.html) module, but other options are available, such as [Consul](https://docs.saltproject.io/en/latest/ref/sdb/all/salt.sdb.consul.html) and [Vault](https://docs.saltproject.io/en/latest/ref/sdb/all/salt.sdb.vault.html#module-salt.sdb.vault).

These databases are set up using a configuration profile in `/srv/salt/master.d`. To access data, you supply an `sdb://` url, such as `password: sdb://mysecrets/mypassword`. For more information on SDB, reference the [Salt SDB documentation](https://docs.saltproject.io/en/latest/topics/sdb/).

{{< note respectIndent=false >}}
Salt also provides a module that allows [pillar data to be stored in Vault](https://docs.saltproject.io/en/latest/ref/pillar/all/salt.pillar.vault.html), as well as an execution module that includes [functions to interact with Vault](https://docs.saltproject.io/en/latest/ref/modules/all/salt.modules.vault.html#vault-setup).
{{< /note >}}
