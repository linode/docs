---
description: "Configuring multiqueue NICs (Network Interface Controllers) on a Linode to improve networking performance."
keywords: ['networking','multi-queue']
published: 2021-07-01
modified: 2023-03-03
modified_by:
  name: Linode
title: "Configuring Multi-Queue NICs"
title_meta: "How To Configure Multi-Queue NICs"
image: NICS.jpg
external_resources:
 - '[KVM Multi-Queue documentation and performance](https://www.linux-kvm.org/page/Multiqueue)'
 - '[HOWTO for multiqueue network device support](https://www.kernel.org/doc/html/latest/networking/multiqueue.html)'
tags: ["networking","linode platform"]
aliases: ['/guides/multiqueue-nic/']
authors: ["Linode"]
---

Multi-queue NICs (network interface cards) are supported on all Compute Instances that have 2 or more CPU cores (vCPUs). This feature provides multiple receive (RX) and transmit (TX) queues, assigns them to different network interrupts, and balances them over multiple vCPUs. Historically, this traffic was all handled by a single vCPU core. Depending on the server's workload and network traffic, multi-queue can dramatically enhance network performance.

**For most Compute Instances deployed after June 2nd, 2021, no action is needed to enable multi-queue NICs**. If your Compute Instance was deployed prior to that date, a reboot may be required. On older Linux distributions, such as Debian 8 and 9, multi-queue NICs needs to be manually enabled by following the instructions within this guide.

## Determining if Multi-Queue is Enabled

Check if multi-queue is already enabled on your network devices by using the [ethtool](https://en.wikipedia.org/wiki/Ethtool) command-line tool.

1.  Review the number of CPU cores (vCPUs) available on your Compute Instance by finding your plan within the [Linode Pricing](https://www.linode.com/pricing/) page or by logging in to the [Cloud Manager](https://cloud.linode.com/), selecting your Compute Instance, and reviewing the *CPU Cores* value under **Summary**.

1.  Log in to your Compute Instance through [Lish](/docs/products/compute/compute-instances/guides/lish/) or [SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Install the `ethtool` utility if not already installed.

    **Ubuntu and Debian:**

    ```command
    sudo apt-get update
    sudo apt-get install ethtool
    ```

    **Fedora, CentOS, and other RHEL-derivatives, such as AlmaLinux and Rocky Linux:**

    ```command
    sudo yum install ethtool
    ```

1.  Run the following command, replacing *eth0* if you've configured a network device other than *eth0*.

    ```command
    ethtool -l eth0
    ```

    This should result in output similar to the following:

    ```output
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
    ```

1.  In the output above, locate the **Combined** value under the **Current hardware settings** section. This indicates the number of queues that are in effect. If multi-queue is fully enabled, this value should equal the number of vCPUs equipped on your Compute Instance (which is determined by your instance plan and type).

## Enabling Multi-Queue on Network Devices

If multi-queue is not enabled and a reboot did not automatically enable it, you can manually enable this feature through the following instructions.

1.  Review the number of vCPU cores available on your Compute Instance by finding your plan within the [Linode Pricing](https://www.linode.com/pricing/) page or by logging in to the [Cloud Manager](https://cloud.linode.com/), selecting your Compute Instance, and reviewing the *CPU Cores* value under **Summary**.

1.  Run the following command to enable multiple queues, replacing *[cpu-count]* with the number of vCPUs on your Compute Instance.

    ```command
    ethtool -L eth0 combined [cpu-count]
    ```

1.  Verify that the feature is enabled by again following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Disabling Multi-Queue on Network Devices

If you start to see performance issues, such as CPU spikes related to network traffic that impact other software on your server, you can disable multi-queue NICs if desired.

1.  Run the following command on your Compute Instance to disable multiple queues:

    ```command
    ethtool -L eth0 combined 1
    ```

1.  Verify that the feature is disabled by following the instructions within the [Determining if Multi-Queue is Enabled](#determining-if-multi-queue-is-enabled) section above.

## Installing irqbalance

While network interrupts will be balanced across all vCPUs once multi-queue NICs are enabled, you may want to also install the [irqbalance](https://github.com/Irqbalance/irqbalance) utility if you have familiarity using it or wish to have additional configuration options. This additional utility is **not required** and, in our workloads, we did not notice a difference in performance.

To install irqbalance, run the following commands on your Compute Instance:

**Ubuntu and Debian:**

```command
sudo apt-get update
sudo apt-get install irqbalance
```

**Fedora, CentOS, and other RHEL-derivatives, such as AlmaLinux and Rocky Linux:**

```command
sudo yum install irqbalance
```