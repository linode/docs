---
slug: multiqueue-nic
author:
  name: Linode
  email: docs@linode.com
description: "Configuring multiqueue NICs (Network Interface Controllers) on a Linode to improve networking performance."
og_description: "Configuring multiqueue NICs (Network Interface Controllers) on a Linode to improve networking performance."
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-06-29
modified_by:
  name: Linode
title: "How To Configure Multi-Queue NICs"
h1_title: "Configuring Multi-Queue NICs"
enable_h1: true
---

Multi-queue NICs (network interface cards) are supported on Linode Compute Instances within all data centers. This feature allows network interrupts to be balanced across multiple vCPUs, not just processed on a single vCPU. Depending on the server's workload and network traffic, multi-queue can dramatically enhance network performance.

## Multi-Queue Compatibility

Multi-queue is automatically enabled on all Linode Compute Instances deployed on or after June 2nd, 2021. A restart may be required to utilize multi-queues for Compute Instances deployed prior to that date. That said, multi-queue needs to be supported by the kernel in use on your Compute Instance. Older kernels, like the one provided by default on Debian 8, does not support multi-queue NICs.

## Determining if Multi-Queue is Enabled

To check if multi-queue is already enabled on your network devices, perform the following set of instructions.

1.  Log in to your Linode Compute Instance through [Lish](/docs/guides/using-the-linode-shell-lish/) or [SSH](/docs/guides/networking/ssh/connect-to-server-over-ssh/).

1.  Install the `ethtool` utility if not already installed.

    **Ubuntu and Debian:**

        sudo apt-get update
        sudo apt-get install ethtool

    **Fedora, CentOS, and other RHEL-derivatives, such as AlmaLinux and Rocky Linux:**

        sudo yum install ethtool

1.  Run the following command, replacing *eth0* if you've configured a network device other than *eth0*.

        ethtool -l eth0

    This should result in output similar to the following:

    {{< output >}}
Channel parameters for eth0:
Pre-set maximums:
RX:             0
TX:             0
Other:          0
Combined:       8
Current hardware settings:
RX:             0
TX:             0
Other:          0
Combined:       2
{{</ output >}}

    The value under **Pre-set maximums > Combined** (8 in the example above) is the maximum number of vCPUs supported by the multi-queue feature on our platform, even if the vCPU count is higher on your Compute Instance.

    The value under **Current hardware settings > Combined** (2 in the example above) indicates the number of queues that are in effect. This value should match the number of vCPUs corresponding with your Linode Compute Instance plan, up to the maximum value stated above. If this value is less than the number of vCPUs, multi-queue needs to be manually enabled.

## Enabling Multi-Queue on Network Devices

For most Linux distributions on Compute Instances deployed after June 2nd, 2021, **no action is required to enable multi-queue NICs**. For Compute Instances deployed prior to that date, a reboot may be required. For distributions that do not natively support multi-queue NICs, you'll need to manually enable this feature through the following instructions.

1.  Review the number of vCPU cores available on your Compute Instance by finding your plan within the [Linode Pricing](https://www.linode.com/pricing/) page or by logging in to the Cloud Manager, selecting your Linode Compute Instance, and reviewing the *CPU Cores* value under **Summary**.

1.  Follow the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above. Proceed only if multi-queue is not yet enabled on your system.

1.  Log in to your Linode Compute Instance through [Lish](/docs/guides/using-the-linode-shell-lish/) or [SSH](/docs/guides/networking/ssh/connect-to-server-over-ssh/).

1.  Run the following command to enable multiple queues, replacing *[cpu-count]* with the number of vCPUs on your Compute Instance.

        ethtool -L eth0 combined [cpu-count]

1.  Verify that the feature is enabled by again following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Disabling Multi-Queue on Network Devices

If you start to see performance issues, such as CPU spikes related to network traffic that impact other software on your server, you can disable multi-queue NICs if desired.

1.  Log in to your Linode Compute Instance through [Lish](/docs/guides/using-the-linode-shell-lish/) or [SSH](/docs/guides/networking/ssh/connect-to-server-over-ssh/).

1.  Run the following command to disable multiple queues:

        ethtool -L eth0 combined 1

1.  Verify that the feature is disabled by following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Installing irqbalance

While network interrupts will be balanced across all vCPUs once multi-queue NICs are enabled, you may want to also install the [irqbalance](https://github.com/Irqbalance/irqbalance) utility if you have familiarity using it or wish to have additional configuration options. This additional utility is **not required** and, in our workloads, we did not notice a difference in performance.

1.  Log in to your Linode Compute Instance through [Lish](/docs/guides/using-the-linode-shell-lish/) or [SSH](/docs/guides/networking/ssh/connect-to-server-over-ssh/).

1.  Install irqbalance by running the following commands:

    **Ubuntu and Debian:**

        sudo apt-get update
        sudo apt-get install irqbalance

    **Fedora, CentOS, and other RHEL-derivatives, such as AlmaLinux and Rocky Linux:**

        sudo yum install irqbalance