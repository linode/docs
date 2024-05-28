---
title: 'Uninstalling the Deprecated Linode CLI using API v3'
description: 'The new Linode API includes a number of additional features and changes from previous API versions. This guide is intended to help existing users uninstall the previous version of the CLI in preparation of upgrading to the new version of the CLI using APIv4.'
published: 2022-02-25
modified: 2022-11-30
external_resources:
 - '[Linode API Documentation](https://developers.linode.com)'
 - '[Deprecated CLI Github](https://github.com/linode/cli)'
keywords: ["api","linode api", "cli"]
tags: ["linode platform"]
aliases: ['/guides/uninstall-linode-api-cli-v3/']
---

Following the release of the [Linode API v4](/docs/api/), both the Linode API v3 and [earlier versions of the CLI](/docs/products/tools/cli/guides/cli-v3/) using that API version have been deprecated. While earlier versions remained functional for some time, they have officially been deprecated and can not be leveraged to use the full extent of the Linode Platform.

To ensure that all users continue to use a currently supported version of the API in their production pipelines, it is recommended that users upgrade to the newest version of the Linode CLI as soon as they are able. This guide walks you through uninstalling the old version of the CLI. After the old version has been removed, you can follow the instructions within the [Linode CLI Overview](/docs/products/tools/cli/guides/install/) guide to install the latest version.

## Uninstall the Linode CLI

### Uninstall Through a Package Manager

If the Linode CLI was installed through a package manager, it can be uninstalled through the same package manager. Follow the instructions below for your operating system.

- **Ubuntu and Debian:** Use the following command to uninstall the Linode CLI through the [APT package manager](/docs/guides/apt-package-manager/):

    ```command
    sudo apt remove linode-cli
    ```

- **Fedora:** Use the following command to uninstall the Linode CLI through the [DNF package manager](/docs/guides/dnf-package-manager/):

    ```command
    sudo dnf remove linode-cli
    ```

- **MacOS:** Use the following command to uninstall the Linode CLI through brew:

    ```command
    brew uninstall linode-cli
    ```

### Uninstall Manually

If the Linode CLI was [installed manually](/docs/products/tools/cli/guides/cli-v3/#manual-installation-for-linux-all-distros), then all configurations files and modules can also be removed manually. The primary relevant files can usually be uninstalled using the following commands:

```command
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
unlink /usr/local/share/perl5/Linode/CLI/Object/StackScript.pm
unlink /usr/local/share/perl5/Linode/CLI/SystemInfo.pm
unlink /usr/local/share/perl5/Linode/CLI/Util.pm
unlink /usr/local/lib64/perl5/auto/Linode/CLI/.packlist
```

{{< note >}}
In some cases, the path of some configuration files installed manually may be slightly different than the ones outlined in this guide. An audit may be necessary to for complete removal of the Linode CLI in cases where a manual installation was performed.
{{< /note >}}

Additionally, if they are no longer needed, users may remove the following Perl modules using their tooling of choice:

```command
JSON
LWP:UserAgent
Mozilla::CA
Try::Tiny
WebService::Linode
```

## Install the Latest Linode CLI Version

Once the deprecated version of the Linode CLI has been safely removed, the newest version of the Linode CLI should be installed using Python 3. More information on this process can be found on our [Overview of the Linode CLI Guide](/docs/products/tools/cli/get-started/).