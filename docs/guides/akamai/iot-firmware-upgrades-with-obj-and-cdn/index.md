---
slug: iot-firmware-upgrades-with-obj-and-cdn
title: "IoT Firmware Upgrades With Object Storage and Akamai CDN"
description: "Using Linode's Object Storage and Akamai's CDN to push IoT device firmware upgrades."
authors: ["Andy Stevens"]
contributors: ["Andy Stevens", "Justin Cobbett"]
published: 2024-06-27
keywords: ['object storage','CDN','Akamai connected cloud','IoT','firmware','egress']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

## Overview
As more and more consumer electronics join the Internet of Things (IoT), the need to deliver feature and security firmware updates to these devices becomes more critical for IoT device manufacturers. One of the main aspects of delivery manufacturers need to plan for is how much egress data these systems will use. At scale, the price of keeping both consumers and the business happy and secure can be enormous. Using Linode Object Storage on Akamai Connected Cloud as an origin for this data, and connecting that service to Akamai CDN, can provide a huge cost savings over other competing hyperscalers.

## Firmware Update Workflow
1.  A manufacturer uploads a new firmware package to an Object Storage bucket.
1.  A client requests new firmware.
1.  Firmware is served to the client from the Object Storage bucket via Akamai CDN.

## Overcoming Challenges

### Challenge: Moving Away from Amazon EFS

An IoT manufacturer found themselves struggling to send OS and firmware updates to customer devices with AWS’ high egress costs. Amazon Elastic File Service (EFS) allows customers to upload and share files with EC2 instances without the need for upgrading or migrating storage volumes, all while preserving file system access to those files. However, this can come at a steep cost.

**Solution**: The open source project s3fs allows a virtual machine to mount any Object Storage bucket, so Linode Object Storage buckets can be mounted to the EC2 Volume using the s3fs utility. This allowed the IoT manufacturer's developers to remove their dependency on Amazon EFS while preserving network file system access and cutting costs.

### Challenge: Cut Egress Costs

Another challenge the IoT manufacturer encountered was supporting more IoT devices worldwide. This resulted in the scale of their firmware delivery service growing in both storage and delivery costs. The IoT manufacturer was looking for a service that could help them save money on egress and improve their bottom line.

**Solution**: Because Linode Object Storage on Akamai Connected Cloud has much lower egress rates than AWS’ offerings, and because it can be set as an origin for Akamai CDN, the IoT manufacturer was not only able to keep file system access to firmware objects, but decrease egress costs by 90%.

## Architecture

This solution creates a streamlined delivery pipeline that allows developers to update firmware quickly across a fleet of customer devices at a reduced cost.

### Systems and Components

- **Linode Object Storage:** An S3 compatible Object Storage bucket

- **Linode VM:** A Dedicated 16GB Linode virtual machine

- **Akamai CDN:** A global CDN running on Akamai’s industry leading backbone

- **AWS Elastic Load Balancer (ELB):** This load balancer splits traffic between the firmware check module that verifies clients have the right request, as well as the EC2 group that the main Object Storage bucket is mounted to.

- **AWS Direct Connect:** A dedicated connection from the IoT manufacturer developers to the ELB

- **AWS EFS:** Elastic file storage that provides file system access to uploaded files

- **Amazon Relational Database (RDS):** A database used to verify firmware version information

### Steps

1.  **Developers upload new firmware.** The IoT manufacturer developers use Direct Connect to easily send the firmware to an Elastic Load Balancer (ELB).

1.  **Pass firmware to an EC2 instance.** The ELB transfers the new firmware to an EC2 instance, where it can be validated by a version check module.

1.  **Transfer checked firmware to Object Storage.** Mounted to an EC2 Group using s3fs, a Linode Object Storage bucket is used to store the new firmware.

1.  **Sync new firmware to backup bucket.** Using rclone, an open source application, on a Dedicated 16GB Linode, the new firmware is synced to a backup Object Storage bucket. Rclone intelligently only synchronizes new and changed firmware, reducing needless operations.

1.  **System returns requested firmware to the IoT device.** Using Akamai CDN with its origin as the  Object Storage bucket, the requested or required firmware is delivered to the IoT device.
