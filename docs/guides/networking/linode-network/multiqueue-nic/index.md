---
slug: multiqueue-nic
author:
  name: Linode
  email: docs@linode.com
description: "Configuring multiqueue NICs (Network Interface Controllers) on a Linode to improve networking performance."
og_description: "Configuring multiqueue NICs (Network Interface Controllers) on a Linode to improve networking performance."
keywords: ['networking','multi-queue']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-07-01
image: NICS.jpg
modified_by:
  name: Linode
title: "How To Configure Multi-Queue NICs"
h1_title: "Configuring Multi-Queue NICs"
enable_h1: true
external_resources:
 - '[KVM Multi-Queue documentation and performance](https://www.linux-kvm.org/page/Multiqueue)'
 - '[HOWTO for multiqueue network device support](https://www.kernel.org/doc/html/latest/networking/multiqueue.html)'
tags: ["networking","linode platform"]
---

Multi-queue NICs (network interface cards) are supported on all Linode Compute Instances that have 2 or more CPU cores (vCPUs). This feature provides multiple receive (RX) and transmit (TX) queues, assigns them to different network interrupts, and balances them over multiple vCPUs. Historically, this traffic was all handled by a single vCPU core. Depending on the server's workload and network traffic, multi-queue can dramatically enhance network performance.

**For most Compute Instances deployed after June 2nd, 2021, no action is needed to enable multi-queue NICs**. If your Compute Instance was deployed prior to that date, a reboot may be required. On older Linux distributions, such as Debian 8 and 9, multi-queue NICs needs to be manually enabled by following the instructions within this guide.

## Determining if Multi-Queue is Enabled

Check if multi-queue is already enabled on your network devices by using the [ethtool](https://en.wikipedia.org/wiki/Ethtool) command-line tool.

1.  Review the number of CPU cores (vCPUs) available on your Compute Instance by finding your plan within the [Linode Pricing](https://www.linode.com/pricing/) page or by logging in to the [Cloud Manager](https://cloud.linode.com/), selecting your Linode Compute Instance, and reviewing the *CPU Cores* value under **Summary**.

1.  Log in to your Compute Instance through [Lish](/docs/guides/using-the-lish-console/) or [SSH](/docs/guides/connect-to-server-over-ssh/).

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

    - **Maximum combined queues/vCPUs:** The value under **Pre-set maximums > Combined** is the maximum number of queues (and therefore vCPUs) supported by the multi-queue feature on our platform. This value should always be 8.

    - **Current combined queues/vCPUs:** The value under **Current hardware settings > Combined** indicates the number of queues that are in effect. This is the number we'll use in the next step

1.  Compare the current combined queues to the total number of vCPUs on your Linode.

    - **Multi-queue is not enabled** if the number of current combined queues is 1.

    - **Multi-queue is partially enabled** if the number of current combined queues is between 2 and 7 but is less than number of vCPUs on your Compute Instance.

    - **Multi-queue is fully enabled** if the current combined queues matches the number of vCPUs on your Compute Instance, up to a maximum of 8.

## Enabling Multi-Queue on Network Devices

If multi-queue is not enabled and a reboot did not automatically enable it, you can manually enable this feature through the following instructions.

1.  Review the number of vCPU cores available on your Compute Instance by finding your plan within the [Linode Pricing](https://www.linode.com/pricing/) page or by logging in to the [Cloud Manager](https://cloud.linode.com/), selecting your Linode Compute Instance, and reviewing the *CPU Cores* value under **Summary**.

1.  Run the following command to enable multiple queues, replacing *[cpu-count]* with the number of vCPUs on your Compute Instance.

        ethtool -L eth0 combined [cpu-count]

1.  Verify that the feature is enabled by again following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Disabling Multi-Queue on Network Devices

If you start to see performance issues, such as CPU spikes related to network traffic that impact other software on your server, you can disable multi-queue NICs if desired.

1.  Run the following command on your Linode Compute Instance to disable multiple queues:

        ethtool -L eth0 combined 1

1.  Verify that the feature is disabled by following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Installing irqbalance

While network interrupts will be balanced across all vCPUs once multi-queue NICs are enabled, you may want to also install the [irqbalance](https://github.com/Irqbalance/irqbalance) utility if you have familiarity using it or wish to have additional configuration options. This additional utility is **not required** and, in our workloads, we did not notice a difference in performance.

To install irqbalance, run the following commands on your Linode Compute Instance:

**Ubuntu and Debian:**

    sudo apt-get update
    sudo apt-get install irqbalance

**Fedora, CentOS, and other RHEL-derivatives, such as AlmaLinux and Rocky Linux:**

    sudo yum install irqbalance