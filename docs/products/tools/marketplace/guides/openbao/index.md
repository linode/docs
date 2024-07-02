---
title: "Deploy OpenBao through the Linode Marketplace"
description: "Openbao is a open source tool secrets management tool that helps to provide secure, automated access to sensitive data."
published: 2024-04-26
keywords: ['openbao','marketplace', 'vault']
tags: ["ubuntu","marketplace", "web applications","linode platform", "cloud manager", "secrets", "education"]
external_resources:
- '[About OpenBao](https://openbao.org/)'
- '[OpenBao] Documentation](https://openbao.org/docs/)'
---

OpenBao is an open source solution to manage, store, and distribute sensitive data including secrets, certificates, and keys. This project is a forked alternative to Vault managed by the Linux Foundation, and development is driven by the community. 

{{< note type="warning" title="OpenBao is still early in development" >}}
While Openbao is a fork of a production ready 1.14.x release of Hashicorp Vault, the Openbao codebase is still early in development and is subject to change as development takes place, we recommend following the [release cycles](https://github.com/openbao/openbao/releases) for any breaking changes to minimize any downtime on a production environment.
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** OpenBao should be fully installed within 5-7 minutes after the Compute Instance has finished provisioning. 
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Suggested minimum plan:** All plan types and sizes can be used. For best results, use a 8GB Dedicated CPU or Shared Compute Instance.

### Openbao Options

{{% content "marketplace-custom-domain-fields-shortguide" %}}
- **List of IP addresses to whitelist:** A list of IP address that will be whitelisted for OpenBao. These should be client IPs that will need to obtain secrets from your OpenBao instance. 
- **Country or region** *(required)*: Enter the country or region for you or your organization.
- **State or province** *(required)*: Enter the state or province for you or your organization.
- **Locality** *(required)*: Enter the town or other locality for you or your organization.
- **Organization** *(required)*: Enter the name of your organization.
- **Email address** *(required)*: Enter the email address you wish to use for your certificate file. 
{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started After Deployment

Once the deployment is complete, OpenBao is now installed and ready to use! You can now SSH into your machine and obtain the credentials which can be found in a .credentials file in the sudo users home directory (`/home/$SUDO_USER/.credentials`)

1.  `bao` commands can now run to continue setting up your OpenBao instance. To confirm, you can run the `bao status` command:

        bao status

{{< note >}}
If you receive an error when running the `bao status` command, you may need to reload the environment variable by sources your servers bashrc file. You can do so by running the following command:

        source /root/.bashrc
{{< /note >}}

1. The OpenBao instance has already been initialized as part of the deployment, the unseal keys along with the root token can be found in the .credentials file in the sudo users home directory (`/home/$SUDO_USER/.credentials`).

These unseal keys should be stored in separate locations. For example, store one in a password manager such as 1Password, encrypted one with gpg, and store another offline on a USB key. Doing so ensures that compromising one storage location is not sufficient to recover the number of unseal keys required to decrypt the OpenBao database.

The `Initial Root Token` is equivalent to the "root" or superuser account for the OpenBao API. Record and protect this token in a similar fashion. Like the `root` account on a Unix system, this token should be used to create less-privileged accounts to use for day-to-day interactions with OpenBao and the root token should be used infrequently due to its widespread privileges.

### Unseal OpenBao

After the deployment is complete, OpenBao will be sealed. The following unseal steps must be performed any time the `openbao` service is brought down and then brought up again, such as when performing `systemctl restart openbao` or restarting the host machine.

1.  With `VAULT_ADDR` set appropriately, execute the unseal command.

        bao operator unseal

    A prompt will appear:

{{< output >}}
Unseal Key (will be hidden):
{{< /output >}}

2.  Paste or enter one unseal key and press **Enter**. The command will finish with output similar to the following:

{{< output >}}
Unseal Key (will be hidden):
Key                Value
---                -----
Seal Type          shamir
Initialized        true
Sealed             true
Total Shares       3
Threshold          2
Unseal Progress    1/2
Unseal Nonce        n/a
Version            2.0.0-alpha20240329
Storage Type       raft
HA Enabled         false
{{< /output >}}

    Notice that the output indicates that the one out of two required unseal keys have been provided.

3.  Perform the `unseal` command again.

        bao operator unseal

4.  Enter a _different_ unseal key when the prompt appears.

    {{< output >}}
Unseal Key (will be hidden):
{{< /output >}}

5.  The resulting output should indicate that OpenBao is now unsealed (notice the `Sealed false` line).

    {{< output >}}
Unseal Key (will be hidden):
Key                     Value
---                     -----
Seal Type               shamir
Initialized             true
Sealed                  false
Total Shares            3
Threshold               2
Version                 2.0.0-alpha20240329
Build Date              2024-03-29T21:37:50Z
Storage Type            raft
Cluster Name            vault-cluster-9b0549a6
Cluster ID              4cb3e7c0-6ce5-2d54-2549-f88d29cb9691
HA Enabled              true
HA Cluster              n/a
HA Mode                 standby
Active Node Address     <none>
Raft Committed Index    27
Raft Applied Index      27
{{< /output >}}

OpenBao is now operational.

### More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [OpenBao](https://openbao.org/)
- [OpenBao Documentation](https://openbao.org/docs/)
 
{{% content "marketplace-update-note-shortguide" %}}