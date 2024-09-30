---
title: "Deploy LinuxGSM through the Linode Marketplace"
description: "Deploy LinuxGSM on a Linode Compute Instance. LinuxGSM is a command line utility for managing multiplayer game servers."
published: 2024-03-19
modified: 2024-03-22
keywords: ['game servers','multiplayer','game']
tags: ["marketplace", "linode platform", "cloud manager"]
external_resources:
- '[LinuxGSM](https://linuxgsm.com/)'
aliases: ['/products/tools/marketplace/guides/linuxgsm/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[LinuxGSM](https://linuxgsm.com/) is a command-line tool for managing game servers.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** LinuxGSM should be fully installed within 10-15 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 22.04 LTS
- **Suggested plan:** All plan types and sizes can be used.

### LinuxGSM Options

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **Game Server Name**: Enter the code for the server you want to install. See the [LinuxGSM Server List](https://github.com/GameServerManagers/LinuxGSM/blob/master/lgsm/data/serverlist.csv).

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Getting Started after Deployment

### Obtaining the Admin Password

The password for the sudo user account was automatically generated during the initial install process. To find this password, log in to your Compute Instance through the [LISH Console](/docs/products/compute/compute-instances/guides/lish/#through-cloud-manager-weblish), or with SSH if you provided an [Account Key](/docs/products/platform/accounts/guides/manage-ssh-keys/). The credentials are available in the file `/home/$USERNAME/.credentials`:

```command
cat /home/$USERNAME/.credentials
```

```output
Sudo Username: $USERNAME
Sudo Password: 0oVSsWmkbGesmtuTlOEgFl7t
LinuxGSM User: linuxgsm
LinuxGSM User Password: nc023n30cal-3kd
```

The LinuxGSM user is a member of the sudo group.

To complete the server installation process run `su linuxgsm && chdir /home/linuxgsm` followed by `./$GAMEERVERNAME install`.

### More Information

Additional information is available from LinuxGSM.

- [LinuxGSM](https://linuxgsm.com/)
- [LinuxGSM Documentation](https://docs.linuxgsm.com/)

{{% content "marketplace-update-note-shortguide" %}}