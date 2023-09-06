---
slug: migrate-from-centos-8-to-centos-stream
description: 'This guide describes CentOS Stream and its benefits and drawbacks. It also explains how to migrate from CentOS 8 to CentOS Stream.'
keywords: ['CentOS','CentOS Stream','Migration','Advantages and Drawbacks']
tags: ['centos', 'linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-02
image: MIGRATE.jpg
modified_by:
  name: Linode
title: "Migrate From CentOS 8 to CentOS Stream"
title_meta: "How to Migrate From CentOS 8 to CentOS Stream"
external_resources:
- '[CentOS Stream Main Page](https://www.centos.org/centos-stream/)'
- '[The CentOS Documentation Page](https://docs.centos.org/en-US/docs/)'
- '[CentOS Project Contribution Page](https://wiki.centos.org/Contribute)'
authors: ["Jeff Novotny"]
---

[*CentOS Stream*](https://www.centos.org/centos-stream/) is a free, open-source Linux distribution that replaces CentOS version 8. CentOS Stream serves a different purpose than previous CentOS releases because it is now a development build for *Red Hat Enterprise Linux* (RHEL). It allows developers early access to new features and gives them a chance to influence the CentOS software development process. This guide describes CentOS Stream, its benefits and drawbacks, and explains how to migrate from CentOS 8 to CentOS Stream.

## What is CentOS Stream?

CentOS Stream 8 marks a dramatic shift in philosophy for the CentOS Project team. While CentOS has traditionally been a rebuild of RHEL, CentOS Stream is positioned midway between Fedora Linux and Red Hat. CentOS Stream is intended to serve as the build/development platform for RHEL, so RHEL can now be considered a rebuild of CentOS Stream. However, there are no significant changes in functionality or behavior, and CentOS Stream works much the same way CentOS did.

This decision repositions CentOS Stream as a community-based development platform where users can create new technologies and tools. Developers have more input into the direction of CentOS and RHEL, and all contributors have the opportunity to prioritize the features they need. CentOS Stream continuously delivers new features, improvements, and bug fixes, and provides a "first look" at upcoming RHEL versions.

The current version of CentOS Stream is version 8. However, CentOS Stream 9 is currently expected to be ready in mid-2021. The maintenance life cycle for legacy CentOS releases is changing as well. CentOS 8 updates continue until December 31, 2021, which is much earlier than previously planned. CentOS Linux 9 is canceled. However, updates for CentOS 7 continue as planned until mid-2024.

{{< note respectIndent=false >}}
In software engineering terms, the *upstream* direction is closer to the original source code, while *downstream* components are typically forks, rebuilds, or customizations. Previously, CentOS was built from RHEL and was downstream of it. However, CentOS is now upstream of RHEL. New versions of RHEL are based on CentOS Stream.
{{< /note >}}

## Advantages and Disadvantages of CentOS Stream

CentOS Stream has different benefits and risks compared to legacy CentOS. Depending on your use case, CentOS Stream may be suitable for you. However, if you require a high degree of production stability, CentOS Stream might not be the appropriate choice.

### Advantages of CentOS Stream Compared to CentOS

Software developers and engineers should appreciate the flexibility of CentOS Stream. Those who are using CentOS for storage, gaming, data analysis, and localized web hosting might not notice any differences.

- CentOS Stream does not change CentOS behavior. There is no learning curve and no integration work required. Utilities, applications, and scripts should work the same way they did in CentOS.

- CentOS allows early access to cutting-edge technology, bug fixes, and new features. It allows users to obtain an early preview of future versions of RHEL, allowing for pre-qualification and faster, smoother deployments.

- The software development life cycle (SDLC) is more agile and new features can be delivered more quickly.

- It allows highly motivated and proactive users to influence both CentOS Stream and RHEL. Developers can bend development plans in the direction of their own requirements.

- The new strategy increases transparency and collaboration in the development process.

- At its best, CentOS Stream combines reliability and innovation. Strict quality requirements are still applied, and rigorous testing is performed. The CentOS Project has no intention of sacrificing stability and performance simply to accelerate feature development.

### Drawbacks of CentOS Stream Compared to CentOS

The disadvantages of CentOS Stream are more likely to concern organizations with large-scale deployments or stringent stability requirements.

- CentOS has gained a large user base due to its reputation as a dependable enterprise-class product. However, CentOS Stream is more of a build and development stream. It might not be quite as stable, or as suitable for production systems requiring a very high degree of dependability.

- The continuous-delivery strategy of CentOS Stream could cause difficulties for organizations with strict planning and validation/acceptance requirements. Changes could happen at any time and a larger amount of churn is inevitable. Any bugs that are introduced due to this churn must be found, fixed, and cycled into a later build.

- The predictability of new features and software changes is reduced. Users should closely scrutinize the release notes and community feedback to determine if and when to upgrade their software.

- CentOS Stream has not been around for very long. It is difficult to predict its long-term performance and any side effects.

In response to these changes, [AlmaLinux](https://almalinux.org/) and [RockyLinux](https://rockylinux.org/) are branding themselves as CentOS replacements. Users who have concerns about CentOS Stream could potentially move to one of these new options, or the commercial RHEL product. It is also possible to move to another Linux distribution. However, this is more complicated because there are considerable differences between the operating systems.

## Migrate from CentOS 8 to CentOS Stream

The `dnf` utility provides a simple, convenient, and trouble-free way to migrate from CentOS 8 to CentOS Stream. You can use `dnf` to download the new packages, swap and sync the streams, and remove any outdated components.

{{< note respectIndent=false >}}
Alternatively, ISO images or RPM packages can be downloaded from [The CentOS Downloads Page](https://www.centos.org/download/). This page also describes alternative download sources, cloud and container images, export regulations, and explains how to download the raw source code.
{{< /note >}}

1. Update and reboot the Linode.

        sudo dnf update -y
        sudo reboot

1. Ensure the Linode is running a recent version of CentOS 8. If it is still running CentOS 7, [upgrade to version 8](/docs/guides/how-to-upgrade-from-centos-7-to-centos-8/) first.

        cat /etc/centos-release
    {{< output >}}
CentOS Linux release 8.3.2011
    {{< /output >}}

1. Install the CentOS Stream packages.

        sudo dnf install centos-release-stream -y

    {{< output >}}
Last metadata expiration check: 0:45:22 ago on Thu 20 May 2021 11:17:49 AM UTC.
Dependencies resolved.
================================================================================
 Package                   Arch       Version                  Repository  Size
================================================================================
Installing:
 centos-release-stream     x86_64     8.1-1.1911.0.7.el8       extras      11 k

Transaction Summary
================================================================================

Install  1 Package

Total download size: 11 k
Installed size: 6.6 k
Downloading Packages:
centos-release-stream-8.1-1.1911.0.7.el8.x86_64 308 kB/s |  11 kB     00:00
--------------------------------------------------------------------------------

Total                                           296 kB/s |  11 kB     00:00
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1
  Installing       : centos-release-stream-8.1-1.1911.0.7.el8.x86_64        1/1
  Verifying        : centos-release-stream-8.1-1.1911.0.7.el8.x86_64        1/1

Installed:
  centos-release-stream-8.1-1.1911.0.7.el8.x86_64

Complete!
    {{< /output >}}

1. Swap the repository files and remove the CentOS 8 repository files from the system.

        sudo dnf swap centos-{linux,stream}-repos -y
    {{< output >}}
CentOS-Stream - AppStream                       6.0 MB/s | 8.5 MB     00:01
CentOS-Stream - Base                            1.1 MB/s | 2.7 MB     00:02
CentOS-Stream - Extras                           66 kB/s |  13 kB     00:00
Dependencies resolved.
================================================================================
 Package                    Arch        Version        Repository          Size
================================================================================
Installing:
 centos-stream-release      noarch      8.5-3.el8      Stream-BaseOS       22 k
     replacing  centos-linux-release.noarch 8.3-1.2011.el8
     replacing  centos-release-stream.x86_64 8.1-1.1911.0.7.el8
 centos-stream-repos        noarch      8-2.el8        extras              19 k
Removing:
 centos-linux-repos         noarch      8-2.el8        @anaconda           26 k

Transaction Summary
================================================================================

Install  2 Packages
Remove   1 Package

Total download size: 40 k
Downloading Packages:
(1/2): centos-stream-repos-8-2.el8.noarch.rpm   481 kB/s |  19 kB     00:00
(2/2): centos-stream-release-8.5-3.el8.noarch.r 181 kB/s |  22 kB     00:00
--------------------------------------------------------------------------------

Total                                           236 kB/s |  40 kB     00:00
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1
  Running scriptlet: centos-stream-release-8.5-3.el8.noarch                 1/1
  Installing       : centos-stream-release-8.5-3.el8.noarch                 1/5
  Installing       : centos-stream-repos-8-2.el8.noarch                     2/5
  Obsoleting       : centos-release-stream-8.1-1.1911.0.7.el8.x86_64        3/5
  Obsoleting       : centos-linux-release-8.3-1.2011.el8.noarch             4/5
  Erasing          : centos-linux-repos-8-2.el8.noarch                      5/5
warning: /etc/yum.repos.d/CentOS-Linux-PowerTools.repo saved as /etc/yum.repos.d/CentOS-Linux-PowerTools.repo.rpmsave
...

  Running scriptlet: centos-linux-repos-8-2.el8.noarch                      5/5
  Verifying        : centos-stream-repos-8-2.el8.noarch                     1/5
  Verifying        : centos-stream-release-8.5-3.el8.noarch                 2/5
  Verifying        : centos-linux-release-8.3-1.2011.el8.noarch             3/5
  Verifying        : centos-release-stream-8.1-1.1911.0.7.el8.x86_64        4/5
  Verifying        : centos-linux-repos-8-2.el8.noarch                      5/5

Installed:
  centos-stream-release-8.5-3.el8.noarch   centos-stream-repos-8-2.el8.noarch

Removed:
  centos-linux-repos-8-2.el8.noarch

Complete!
    {{< /output >}}

1. Sync all components to the new version. This performs all necessary upgrades and downgrades. This procedure might take a substantial amount of time to complete, depending on the speed of your connection. Remove any mounted packages from `/mnt` before running this command. Otherwise, the upgrade might fail.

        sudo dnf distro-sync -y
    {{< output >}}
CentOS Stream 8 - AppStream                      29 MB/s | 8.5 MB     00:00
CentOS Stream 8 - BaseOS                        3.7 MB/s | 2.7 MB     00:00
CentOS Stream 8 - Extras                         93 kB/s |  13 kB     00:00
Dependencies resolved.
================================================================================
 Package                 Arch   Version                         Repo       Size
================================================================================
Installing:
 kernel                  x86_64 4.18.0-301.1.el8                baseos    5.9 M
 kernel-core             x86_64 4.18.0-301.1.el8                baseos     36 M
 kernel-modules          x86_64 4.18.0-301.1.el8                baseos     28 M
Upgrading:
 NetworkManager          x86_64 1:1.32.0-0.2.el8                baseos    2.6 M
...
Installing dependencies:
 grub2-tools-efi         x86_64 1:2.02-99.el8                   baseos    473 k
...

Transaction Summary
================================================================================

Install    9 Packages
Upgrade  194 Packages

Total download size: 329 M
Downloading Packages:
(1/203): grub2-tools-efi-2.02-99.el8.x86_64.rpm 811 kB/s | 473 kB     00:00
(2/203): kernel-4.18.0-301.1.el8.x86_64.rpm     2.9 MB/s | 5.9 MB     00:02
...
(203/203): linux-firmware-20201218-102.git05789 5.7 MB/s | 123 MB     00:21
--------------------------------------------------------------------------------

Total                                           8.7 MB/s | 329 MB     00:37
Running transaction check
Transaction check succeeded.
Running transaction test
Transaction test succeeded.
Running transaction
  Preparing        :                                                        1/1
  Running scriptlet: libselinux-2.9-5.el8.x86_64                            1/1
  Upgrading        : libselinux-2.9-5.el8.x86_64                          1/397
  Running scriptlet: libselinux-2.9-5.el8.x86_64                          1/397
...
  Verifying        : grub2-tools-efi-1:2.02-99.el8.x86_64                 1/397
...

Upgraded:
  NetworkManager-1:1.32.0-0.2.el8.x86_64
...

Installed:
  grub2-tools-efi-1:2.02-99.el8.x86_64  kernel-4.18.0-301.1.el8.x86_64
...

Complete!
    {{< /output >}}

1. Reboot the Linode and verify the CentOS Stream version. It should now be running `CentOS Stream release 8`.

        sudo reboot
        cat /etc/centos-release
    {{< output >}}
CentOS Stream release 8
    {{< /output >}}

## Learn More About CentOS Stream

CentOS has a large and vibrant community. The [CentOS Forum](https://forums.centos.org/) is a good place to ask questions and get support. There is also an explanation on [how and where to contribute](https://wiki.centos.org/Contribute) to the CentOS project, along with [extensive documentation](https://docs.centos.org/en-US/docs/).
