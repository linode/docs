---
slug: uninstall-linode-api-cli-v3
author:
  name: Linode
  email: docs@linode.com
description: 'The new Linode API includes a number of additional features and changes from previous API versions. This guide is intended to help existing users uninstall the previous version of the CLI in preparation of upgrading to the new version of the CLI using APIv4.'
keywords: ["api","linode api", "cli"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-01-19
modified_by:
  name: Linode
title: 'Uninstalling the Deprecated Linode CLI using API v3'
published: 2021-01-19
external_resources:
 - '[Linode API Documentation](https://developers.linode.com)'
 - '[Deprecated CLI Github](https://github.com/linode/cli)'
tags: ["linode platform"]
aliases: ['/platform/api/upgrade-to-linode-api-v4/']
---

Following the release of [Version 4 of the Linode API](https://www.linode.com/docs/api/) both Version 3 of the Linode API and an [earlier version of the CLI](/docs/guides/using-the-linode-cli-api-v3/) have been deprecated. While the earlier version of the Linode CLI that relies on v3 of the Linode API has up to this point still been available to users, it has officially been deprecated and can not be leveraged to use the full extent of the Linode Platform.

In order to best ensure that all users are able to continue to use a working and current configuration of the Linode API in their production pipelines, it is recommended that users upgrade to the newest version of the Linode CLI as soon as they are able.

## In this Guide

This guide serves to empower you to remove the deprecated version of the Linode CLI and install the newest version.

## Uninstall the Linode CLI

### Debian and Ubuntu

In most cases, the Linode CLI was most likely installed using the `apt` package manager. If the package was installed via this method, the deprecated version of the Linode CLI can be similarly removed via the `apt` package manager using the following command:

        sudo apt remove linode-cli

### Fedora

If using Fedora, the Linode CLI was most likely installed using the `dnf` package manager. If the package was installed via this method, the deprecated version of the Linode CLI can be similarly removed via the `dnf` package manager using the following command:

        dnf remove linode-cli

### Mac OSx

If using Mac OSx, the Linode CLI was most likely installed using the `brew` package manager. If the package was installed via this method, the deprecated version of the Linode CLI can be similarly removed via the `brew` package manager using the following command:

        brew uninstall linode-cli

### Other Distros

If the Linode Cli was [installed manually](/docs/guides/using-the-linode-cli-api-v3/#manual-installation-for-linux-all-distros), then all configurations files and modules can also be removed manually. The primary relevant files can ususally be uninstalled using the following commands:

        unlink /usr/local/bin/linode
        unlink /usr/local/bin/linode-account
        unlink /usr/local/bin/linode-domain
        unlink /usr/local/bin/linode-linode
        unlink /usr/local/bin/linode-nodebalancer
        unlink /usr/local/bin/linode-stackscript
        unlink /usr/local/share/man/man1/linode-account.1
        unlink /usr/local/share/man/man1/linode-domain.1
        unlink /usr/local/share/man/man1/linode-linode.1
        unlink /usr/local/share/man/man1/linode-nodebalancer.1
        unlink /usr/local/share/man/man1/linode-stackscript.1
        unlink /usr/local/share/man/man1/linode.1
        unlink /usr/local/share/perl5/Linode/CLI.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object/Account.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object/Domain.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object/Linode.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object/Nodebalancer.pm
        unlink /usr/local/share/perl5/Linode/CLI/Object/Stackscript.pm
        unlink /usr/local/share/perl5/Linode/CLI/SystemInfo.pm
        unlink /usr/local/share/perl5/Linode/CLI/Util.pm
        unlink /usr/local/lib64/perl5/auto/Linode/CLI/.packlist

{{< note >}}
In some cases, the path of some configuration files installed manually may be along a slightly different than the ones outlined in this guide. An audit may be necessary to for complete removal of the Linode CLI in cases where a manual installation was performed.
{{< /note >}}

Additionally, if they are no longer needed, users may remove the following perl modules using their tooling of choice:

        JSON
        LWP:UserAgent
        Mozilla::CA
        Try::Tiny
        WebService::Linode


## Next Steps

Once the deprecated version of the Linode CLI has been safely removed, the newest version of the Linode CLI should be installed using Python3.
More information on this process can be found on our [Overview of the Linode CLI Guide](/docs/guides/linode-cli/).