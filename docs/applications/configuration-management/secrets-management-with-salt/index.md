---
author:
  name: Linode Community
  email: docs@linode.com
description: 'An overview of available options to manage secrets with SaltStack'
keywords: ['salt','saltstack','secret','secure','management','sdb','gpg','vault']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-11-06
modified: 2018-11-06
modified_by:
  name: Linode
title: "Secrets Management with Salt"
contributor:
  name: Linode
external_resources:
  - '[Using Environmental Variables in SLS Modules](https://docs.saltstack.com/en/latest/topics/tutorials/states_pt3.html#using-environment-variables-in-sls-modules)'
  - '[Salt GPG Renderer](https://docs.saltstack.com/en/latest/ref/renderers/all/salt.renderers.gpg.html)'
  - '[Salt SDB Documentation](https://docs.saltstack.com/en/latest/topics/sdb/)'
  - '[Salt SDB Modules](https://docs.saltstack.com/en/latest/ref/sdb/all/index.html)'
---

Salt is a powerful configuration management tool. It allows you to control your server configurations with flat files that are easily shared with others on your team. However, it is common to need access to sensitive data like API keys and database passwords within these state files. Because this information is typically stored as plain text, this creates a serious security flaw, especially when this data could be stored in a remote repository. This guide will explore the known methods for securing your secrets within Salt.

## Pillar Files

The most obvious method for storing secrets in Salt is to employ a Pillar. Pillars are designed to house global values that are intended for specific minions. By putting your secrets into Pillars and not into state files you can effectively remove those secrets from version control by not committing your Pillars. This method requires some extra planning however, especially because not *all* Pillar data is sensitive, and so some Pillar files might still make it into version control. You could create a special directory at `/srv/pillar/secrets` and add that folder to your `.gitignore` file to separate your sensitive and non-sensitive data. For quick reference, it might also be necessary to create a `pillar.example` file, like those provided by Salt formulas, that lists all the known variable keys so that you can shorten the time it takes to set up a Salt system.

You can also supply Pillar values as a dictionary through the command line, and these files will override any Pillar values set in your Pillar files.

    salt '*' state.apply pillar='{"mysecret": "secret"}'

The downside of this approach is that there are times when Pillar data could show up in the output that Salt generates, like when `file.managed` displays diffs of a modified file. To avoid displaying these diffs, you can set `file.managed`'s `show_diff` flag to false.

## Environment Variables

Similar to passing in Pillar data via the command line, another way to keep sensitive values out of version control is to use environment variables. For example, you might issue the following command:

    SUPERSECRET="secret" salt '*' state.apply example.sls

The environment variable is referenced by a Salt state file through `salt['environ.get']('SUPERSECRET')`.

{{< file "/srv/salt/example.sls" >}}
my_managed_file:
  file.managed:
    - name: /tmp/example
    - contents: {{ salt['environ.get']('SUPERSECRET') }}
{{</ file >}}

As it is with the Pillar example mentioned above, you'll want to keep `file.managed`'s diffs from appearing on screen when dealing with sensitive information by setting `show_diff: false`. For more information, see [Using Environment Variables in SLS Modules](https://docs.saltstack.com/en/latest/topics/tutorials/states_pt3.html#using-environment-variables-in-sls-modules).

## GPG Encryption

You can use the [GPG renderer](https://docs.saltstack.com/en/latest/ref/renderers/all/salt.renderers.gpg.html) to decrypt GPG ciphers that are located in your Pillar files before those values are passed to Salt minions. This means that any value in a Pillar file can be encrypted, allowing state files to be stored in version control. This approach requires that the GPG secret key is stored on your Salt master, and it makes sense to include the public key in version control so that is available to your team.

## SDB

Salt comes with a database interface called SDB that was initially created to store non minion-specific data, such as passwords. It was designed to connect to a package like [keyring](https://docs.saltstack.com/en/latest/ref/sdb/all/salt.sdb.keyring_db.html), but other options are available, such as [Consul](https://docs.saltstack.com/en/latest/ref/sdb/all/salt.sdb.consul.html) and [Vault](https://docs.saltstack.com/en/latest/ref/sdb/all/salt.sdb.vault.html#module-salt.sdb.vault). These databases are set up using a configuration profile in `/srv/salt/master.d`. To access data, you supply an `sdb://` url, such as `password: sdb://mysecrets/mypassword`. For more information on SDB, reference the [Salt SDB documentation](https://docs.saltstack.com/en/latest/topics/sdb/).

{{< note >}}
Salt also provides a module that allows [pillar data to be stored in Vault](https://docs.saltstack.com/en/latest/ref/pillar/all/salt.pillar.vault.html) and a module that includes [functions to interact with Vault](https://docs.saltstack.com/en/latest/ref/modules/all/salt.modules.vault.html#vault-setup).
{{</ note >}}

