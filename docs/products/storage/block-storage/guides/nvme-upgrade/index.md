---
author:
  name: Linode
  email: docs@linode.com
title: "NVMe Block Storage Upgrade"
description: "Information about the new NVMe Block Storage product and how to upgrade a Volume."
---

## Overview of NVMe Block Storage

We’re rolling out an ultra-fast, better-performing, and more reliable NVMe-backed Block Storage service across all 11 of our global data centers. NVMe is the hardware interface for next-generation SSDs (solid-state devices). The technology is a significant improvement over traditional spinning hard disk drives, with a 10-20x increase in throughput and up to 2000x improvement in IOPS. With NVMe-backed Block Storage, you can experience a significant performance upgrade for database storage and other tasks where high storage speeds and consistency are critical.

The table below displays the performance you can expect from NVMe-backed Block Storage. Performance is automatically increased in 60 second bursts for even faster real-world speeds.

| | IOPS | Throughput |
| -- | -- | -- |
| **Standard** | 8,000 | 350 MB/s |
| **Burst** | 12,000 | 525 MB/s |

## Availability

Currently, **NVMe Block Storage** has been deployed in the Atlanta (USA) and Newark (USA) data centers. NVMe Block Storage infrastructure upgrades will soon be deployed across the remaining data centers in our fleet.

| Data Center | Upgraded to NVMe Block Storage |
| -- | -- |
| **Atlanta (Georgia, USA)** | **Yes** |
| Dallas (Texas, USA) | *Coming soon* |
| Frankfurt (Germany) | *Coming soon* |
| Fremont (California, USA) | *Coming soon* |
| London (United Kingdom) | *Coming soon* |
| Mumbai (India) | *Coming soon* |
| **Newark (New Jersey, USA)** | **Yes** |
| Singapore | *Coming soon* |
| Sydney (Australia) | *Coming soon* |
| Tokyo (Japan) | *Coming soon* |
| Toronto (Canada) | *Coming soon* |

## Upgrading a Volume to NVMe Block Storage

Existing Block Storage Volumes will soon be eligible for a free upgrade to the newer NVMe-only Block Storage solution. If you have a Block Storage Volume attached to a Linode, you will be notified with instructions to initiate the upgrade soon after NVMe Block Storage becomes available in your data center. This page will also be updated to reflect those instructions. Unattached Volumes will automatically be upgraded at a later date.