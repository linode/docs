---
slug: security-auditing-with-lynis
author:
  name: Hackersploit
description: 'Learn to perform a security audit on your system using Lynis, an extensible security audit tool.'
og_description: 'Learn to perform a security audit on your system using Lynis, an extensible security audit tool.'
keywords: ["linux log monitor", "linux system monitoring tools", "system monitor linux"]
tags: ["monitoring","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-10-29
modified: 2020-10-29
modified_by:
  name: Linode
title: 'Automated Security Auditing with Lynis'
h1_title: 'Security Auditing with Lynis'
image: Security_auditing_with_Lynis.png
---

## Before you Begin

This guide was written specifically for Debian and Ubuntu operating systems, however can be adapted to apply to all other operating systems that [Lynis currently supports](https://cisofy.com/documentation/lynis/get-started/).

Ensure that you have followed our [Getting Started](/docs/guides/getting-started/) guide before proceeding.

## Installing Lynis

Lynis is an extensible security audit tool for computer systems running Linux, FreeBSD, macOS, OpenBSD, Solaris, and other Unix derivatives. It assists system administrators and security professionals with scanning a system and its defenses, with the final goal being system hardening.

To ensure that you have the latest version of Lynis installed it's important to manually set up the [CISOfy repository](https://packages.cisofy.com/). While a version of Lynis is available in most repositories by default, the CISOfy repositories will always be the most up to date, ensuring that any auditing performed is based on the best information available. To add the CISOfy repository to your list of repos, enter the following command:

    echo "deb https://packages.cisofy.com/community/lynis/deb/ stable main" | sudo tee /etc/apt/sources.list.d/cisofy-lynis.list


Then, import a public GPG key for a secure Lynis installation:

    sudo wget -O - https://packages.cisofy.com/keys/cisofy-software-public.key | sudo apt-key add -

{{< note >}}
You may need to manually install gnupg2 on some systems in order for GPG to successfully import keys. This can be completed with the following command:

    sudo apt-get install gnupg2
{{< /note >}}

Update and upgrade to ensure that your system is prepared to use all packages available in the CISOfy repository:

    sudo apt-get update && sudo apt-get upgrade

Lynis is available as a package for most Linux distributions, we can install it on Debian by running the following command:

    sudo apt install lynis

To display all the options and commands available, we can run the following command:

    lynis show options

Before we get started with scanning, we need to ensure that Lynis is up to date. To check if we are running the latest version we can run the following command:

    sudo lynis update info

{{< output >}}

 == Lynis ==

  Version            : 3.0.1
  Status             : Up-to-date
  Release date       : 2020-10-05
  Project page       : https://cisofy.com/lynis/
  Source code        : https://github.com/CISOfy/lynis
  Latest package     : https://packages.cisofy.com/


2007-2020, CISOfy - https://cisofy.com/lynis/

{{< /output >}}

## System Auditing With Lynis

To perform a system audit with Lynis we run the following command:

    sudo lynis audit system


Lynis will output a lot of information that will also be stored under the /var/log/lynis.log file for easier access. The summary of the system audit will reveal important information about your system’s security posture and various security misconfigurations and vulnerabilities.

Lynis will also generate output on how these vulnerabilities and misconfigurations can be fixed or tweaked.

{{< output >}}

  Lynis security scan details:

  Hardening index : 61 [############        ]
  Tests performed : 233
  Plugins enabled : 0

  Components:
  - Firewall               [V]
  - Malware scanner        [X]

  Scan mode:
  Normal [V]  Forensics [ ]  Integration [ ]  Pentest [ ]

  Lynis modules:
  - Compliance status      [?]
  - Security audit         [V]
  - Vulnerability scan     [V]

  Files:
  - Test and debug information      : /var/log/lynis.log
  - Report data                     : /var/log/lynis-report.dat

{{< /output >}}

The output also contains a hardening index score that is rated out of 100, this is used to give you a trackable tangible score of your system’s current security posture.

Also found in the report, Linus will display any potential warnings that will indicate a severe security vulnerability or misconfiguration that needs to be fixed or patched. In this case, we should add rules to the firewall:

{{< output >}}
      -[ Lynis 3.0.1 Results ]-

      Warnings (1):
  ----------------------------
      ! iptables module(s) loaded, but no rules active [FIRE-4512]
          https://cisofy.com/lynis/controls/FIRE-4512/
{{< /output >}}

To increase our hardening index score, Lynis provides us with helpful suggestions that detail the various security configurations we need to make.

After following the suggestions and making the necessary changes, we can run the system audit with Lynis again.

Once all the changes are made, you can expect to see a significant improvement in the hardening index score that confirms the changes and configurations we've applied are effective.

## Pentest With Lynis

Lynis also has the ability to simulate a privileged/internal pentest on the system, this can be invoked by using the following command:


    sudo lynis --pentest

This will perform a pentest on the system and will output a hardening index score that reflects the overall security posture of the system. It will also output similar recommendations and patches that we can apply to improve our score.

{{< output >}}
  Lynis security scan details:

  Hardening index : 61 [############        ]
  Tests performed : 233
  Plugins enabled : 0

  Components:
  - Firewall               [V]
  - Malware scanner        [X]

  Scan mode:
  Normal [ ]  Forensics [ ]  Integration [ ]  Pentest [V] (running privileged)

  Lynis modules:
  - Compliance status      [?]
  - Security audit         [V]
  - Vulnerability scan     [V]

  Files:
  - Test and debug information      : /var/log/lynis.log
  - Report data                     : /var/log/lynis-report.dat
{{< /output >}}

