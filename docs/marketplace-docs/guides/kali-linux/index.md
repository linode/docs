---
title: "Deploy Kali Linux through the Linode Marketplace"
description: "Deploy Kali Linux, a popular Linux distribution for penetration testing and security research, on a Linode Compute Instance."
published: 2022-07-05
keywords: ['kali','security','pentest']
tags: ["marketplace", "linode platform", "cloud manager"]
aliases: ['/products/tools/marketplace/guides/kali-linux/','/products/tools/marketplace/guides/kalilinux/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 1017300
marketplace_app_name: "Kali Linux"
---

[Kali Linux](https://www.kali.org/) is a specialized Debian-based Linux distribution that has become an industry-standard tool for penetration testing. Kali Linux includes hundreds of free tools for reverse engineering, penetration testing, computer forensics, security audits, and more. It is open source and prioritizes simplicity. To learn more about Kali Linux and determine if its a viable solution for your workloads, see the following resources from its official documentation site:

- [What is Kali Linux?](https://www.kali.org/docs/introduction/what-is-kali-linux/)
- [Should I Use Kali Linux?](https://www.kali.org/docs/introduction/should-i-use-kali-linux/)

{{< note >}}
This Marketplace App extends Linode's Kali Linux distribution image by allowing the user to preinstall one of the available metapackages.
{{< /note >}}

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Kali Linux should be fully installed within 45-60 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Kali Linux
- **Recommended plan:** We recommend a 4GB Dedicated CPU or Shared Compute Instance.

### Kali Options

- **Kali Headless Package** *(required)*: This installs the [kali-linux-headless](https://www.kali.org/tools/kali-meta/#kali-linux-headless) metapackage, which includes all non-GUI packages.
- **Kali Everything Package** *(required)*: This installs the [kali-linux-everything](https://www.kali.org/tools/kali-meta/#kali-linux-everything) metapackage, which includes all available Kali packages.

    {{< note >}}
    If both packages are selected, only the [kali-linux-everything](https://www.kali.org/tools/kali-meta/#kali-linux-everything) package is installed (which includes everything in [kali-linux-headless](https://www.kali.org/tools/kali-meta/#kali-linux-headless)).
    {{< /note >}}

- **VNC Installation** *(required)*: This option installs and starts [TigerVNC](https://tigervnc.org/) and [XFCE Desktop package](https://www.xfce.org/).
- **Sudo/VNC Username** *(required)*: The VNC username you wish to create for this Compute Instance. This is used for your VNC session and will have elevated privileges (`sudo`).
- **Sudo/VNC User Password** *(required)*: The password you wish to use for your VNC user.

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

## Getting Started after Deployment

After Kali Linux has been fully deployed, you can log in through an SSH session as the `root` user and perform your workloads as needed. See the [Kali Linux documentation](https://www.kali.org/docs/) to learn how to further use your instance.

### Remote Desktop Connection with VNC

If you selected the VNC installation option, [TigerVNC](https://tigervnc.org/) is installed. This lets you connect remotely to the desktop environment and access Kali's GUI tools. Perform the steps below to access your Kali Linux desktop through a VNC client. While there are many options for OS X and Windows, this guide will use [RealVNC Viewer](https://www.realvnc.com/en/connect/download/viewer/).

1. From your desktop, create an SSH tunnel to your Compute Instance with the following command. Be sure to replace *[username]* with the VNC username you created and *[ip]* with the IPv4 address of your Compute Instance. See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing IP addresses.

    ```output
    ssh -L 61000:localhost:5901 -N -l [username] [ip]
    ```

2. Open your preferred VNC viewer application and connect to your Compute Instance through the SSH tunnel you created. The format is `localhost:61000`

    ![Screenshot of RealVNC connection detail](realvnc-connection.jpg)

3. A warning may appear notifying you that the connection is unencrypted. Since you are using an SSH tunnel, your connection is encrypted over the internet. You can safely ignore this warning and continue.

    ![Screenshot of RealVNC unencrypted connection warning](realvnc-warning.jpg)

4. You are then prompted to enter the password you created for the VNC user.

    ![Screenshot of RealVNC password prompt](realvnc-password.jpg)

After connecting, the Kali Linux desktop should appear.

{{% content "marketplace-update-note-shortguide" %}}
