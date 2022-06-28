---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Kali Linux, a popular Linux distribution for penetration testing and security research, on a Linode Compute Instance."
keywords: ['kali','security','pentest']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-28
title: "Deploying Kali Linux through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
---

[Kali Linux](https://www.kali.org/) is a specialized Debian-based Linux distribution that has become an industry-standard tool for penetration testing. Kali Linux includes hundreds of free tools for reverse engineering, penetration testing, computer forensics, security audits, and more. It is open source and prioritizes simplicity. To learn more about Kali Linux and determine if its a viable solution for your workloads, see the following resources from its official documentation site:

- [What is Kali Linux?](https://www.kali.org/docs/introduction/what-is-kali-linux/)
- [Should I Use Kali Linux?](https://www.kali.org/docs/introduction/should-i-use-kali-linux/)

{{< note >}}
This Marketplace App extends Linode's Kali Linux distribution image by allowing the user to preinstall one of the availabe metapackages, along with [TigerVNC](https://tigervnc.org/) and [Apache Guacamole](https://guacamole.apache.org/) in the case of the `kali-linux-everything` metapackage.
{{</ note >}}

## Deploying a Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

{{< content "marketplace-verify-standard-shortguide">}}

{{<note>}}
**Estimated deployment time:** Kali Linux should be fully installed within 45-60 minutes after the Compute Instance has finished provisioning.
{{</note>}}

## Configuration Options

- **Supported distributions:** Kali Linux
- **Recommended plan:** All plan types and sizes can be used.

### Kali Options

- **Kali Headless Package** *(required)*: This installs the [kali-linux-headless](https://www.kali.org/tools/kali-meta/#kali-linux-headless) meta-package, which includes all non-GUI packages.
- **Kali Everything Package** *(required)*: This installs the [kali-linux-everything](https://www.kali.org/tools/kali-meta/#kali-linux-everything) meta-package, which includes all available Kali packages, and also installs [TigerVNC](https://tigervnc.org/) and [Apache Guacamole](https://guacamole.apache.org/) for remotely accessing Kali's desktop environment.

    {{< note >}}
If both packages are selected, only the [kali-linux-everything](https://www.kali.org/tools/kali-meta/#kali-linux-everything) package is installed (which includes everything in [kali-linux-headless](https://www.kali.org/tools/kali-meta/#kali-linux-headless)).
{{</ note >}}

- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **Sudo/VNC Username** *(required)*: The VNC username you wish to create for this Compute Instance. This is used for your VNC session and will have elevated privileges (`sudo`).
- **Sudo/VNC User Password** *(required)*: The password you wish to use for your VNC user.

{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

After Kali Linux has been fully deployed, you can log in through an SSH session as the `root` user and perform your workloads as needed. See the [Kali Linux documentation](https://www.kali.org/docs/) to learn how to further utilize your instance.

### Remote Desktop Connection with Apache Guacamole

If you selected to install the [Kali Everything package](https://www.kali.org/tools/kali-meta/#kali-linux-everything), [Apache Guacamole](https://guacamole.apache.org/) is also installed. This allows you to connect remotely to the desktop environment and access Kali's GUI tools. Perform the steps below to access your Kali Linux desktop through Apache Guacamole.

1. Log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1.  View the `/root/.kali.info` file to access the automatically generated credentials for Apache Guacamole.

        cat /root/.kali.info

    {{< output >}}
##############################
#   KALI INSTALLATION CREDS  #
##############################

* Apache Guacamole User: 4yRtG2394RH3
* Apache Guacamole Password: eDE4Fzp5tZ2ICIFhieho384jg3
{{</ output >}}

1. Access Apache Guacamole by opening your web browser and navigating to the domain entered during the creation of the Linode instance. If you did not enter a domain, you can also use your Compute Instance's rDNS, which may look like `192-0-2-1.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing the rDNS value.

1. Once you've completed the login process, you have full access to your Kali Linux instance from your Guacamole remote desktop.

{{< content "marketplace-update-note-shortguide">}}