---
author:
  name: Linode
  email: docs@linode.com
description: "Deploy Kali Linux on a Linode Compute Instance. The most popular Linux distribution and tool suite for penetration testing and security research."
keywords: ['kali','security','pentest']
tags: ["marketplace", "linode platform", "cloud manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-06-28
title: "Deploying Kali Linux through the Linode Marketplace"
contributor:
  name: Holden Morris
  link: https://github.com/hmorris3293
---

[Kali Linux](https://www.kali.org/) is an open source, Debian-based Linux distribution that has become an industry-standard tool for penetration testing and security audits. Kali includes hundreds of free tools for reverse engineering, penetration testing and more. Kali prioritizes simplicity, making security best practices more accessible to everyone from cybersecurity professionals to hobbyists.

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

- **Kali Headless Package** *(required)*: Would you like to install the Kali Headless package?
- **Kali Everything Package** *(required)*: Would you like to install the Kali Everything package?
- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.
- **Sudo/VNC Username** *(required)*: The VNC username created for this Linode with sudo permissions. This is used for your VNC session.
- **Sudo/VNC User Password** *(required)*: Password for your sudo/VNC user. This is used for your VNC session.

{{< content "marketplace-custom-domain-fields-shortguide">}}

## Getting Started after Deployment

1. If you choose the [Kali Headless package](https://www.kali.org/tools/kali-meta/#kali-linux-headless), you can log in to your Compute Instance over SSH using the `root` user. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance. 

1.  If you choose the [Kali Everything package](https://www.kali.org/tools/kali-meta/#kali-linux-everything), Open your web browser and navigate to the domain entered during the creation of the Linode instance. If you did not enter a domain, you can also use your Compute Instance's rDNS, which may look like `123-0-123-0.ip.linodeusercontent.com`. See the [Managing IP Addresses](/docs/guides/managing-ip-addresses/) guide for information on viewing and setting the rDNS value.


1.  The credentials to the Apache Guacamole remote desktop can be found by running the command below:

            cat /root/kali.info

    {{<output>}}
##############################
#   KALI INSTALLATION CREDS  #
##############################

* Apache Guacamole User: 4yRtG2384FH3
* Apache Guacamole Password: eDE4FYp5tZ2pCIFhieho384jg3

    {{</output>}}

1. Once you've completed the login process, you have full access to your Kali Linux instance from your Guacamole remote desktop. Check out [the official Kali Linux documentation](https://www.kali.org/docs/) to learn how to further utilize your Kali Linux instance.

{{< content "marketplace-update-note-shortguide">}}