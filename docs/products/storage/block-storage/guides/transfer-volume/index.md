---
author:
  name: Linode
  email: docs@linode.com
title: "Transfer a Volume to a Different Compute Instance"
description: "Learn how to transfer a Block Storage Volume to a different Compute Instance within the same data center."
modified: 2022-08-24
---

Follow these steps to move a Block Storage Volume to a different Compute Instance *within the same data center*.

{{< note >}}
Volumes can only be attached to Compute Instances located in the same data center. To migrate data to a different data center, see the [Transfer Block Storage Data between Data Centers](/docs/products/storage/block-storage/guides/transfer-volume-data-between-data-centers/) guide.
{{< /note >}}

1. Detach the Volume from the original Compute Instance. See [Attach and Detach Volumes > Detach a Volume](/docs/products/storage/block-storage/guides/attach-and-detach/#detach-a-volume) for instructions.

1. Attach the Volume to the desired Compute Instance within the same data center as the Volume. See [Attach and Detach Volumes > Attach a Volume](/docs/products/storage/block-storage/guides/attach-and-detach/#attach-a-volume) for instructions.
