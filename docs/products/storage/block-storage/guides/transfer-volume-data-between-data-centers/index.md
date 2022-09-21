---
author:
  name: Linode
  email: docs@linode.com
title: "Transfer Block Storage Data between Data Centers"
description: "Learn how to transfer data on a Block Storage Volume to a different data center."
modified: 2022-08-24
---

Block Storage Volumes cannot be directly migrated to a different data center. These steps will outline how to transfer a Volume's data to a different data center via the [SCP](/docs/guides/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) tool.

{{< note >}}
Consult our [Network Transfer Usage and Costs](/docs/guides/network-transfer/) guide for information on charges related to outbound traffic when transferring data over the public internet.
{{</ note >}}

1. [Attach and mount](/docs/products/storage/block-storage/guides/manage-volumes/) your existing Volume to a Compute Instance, if you have not already.

1. [Create, attach, and mount](/docs/products/storage/block-storage/guides/manage-volumes/) a Volume to a Compute Instance within the new data center you wish to use.

1. Log in to your new receiving Compute Instance using [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/guides/using-the-lish-console/).

1.  [Use the Secure Copy Protocol (SCP)](/docs/guides/download-files-from-your-linode/#download-specific-files-or-directories-over-ssh) to download your Volume's data to the receiving Compute Instance.

        scp [source-user]@[source-ip]:[source-path] [destination-path]

    Replace the above values with your own. In the example below, the user is `root`, the IP of the original Compute Instance is `192.0.2.1`, the path to the Volume's data on the source machine is `/mnt/source-volume/`, and the path to the new Volume on the new Compute Instance in the other data center is `/mnt/destination-volume/`.

        scp root@192.0.2.1:/mnt/source-volume/ /mnt/destination-volume/

    {{< note >}}
You will need a Volume or device that has enough storage capacity to receive the entirety of your source data.
{{</ note >}}

1. Once the transfer is complete and you have confirmed the original data is now located on the new Volume in your desired data center, the original Volume can be deleted to avoid further charges for that Volume.