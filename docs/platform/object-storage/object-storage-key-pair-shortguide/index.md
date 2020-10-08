---
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to generate a key pair for the Linode Object Storage service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-07-22
modified_by:
  name: Heather Zoppetti
published: 2020-07-22
title: How to Generate a Key Pair for the Linode Object Storage Service
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar, click the **Access Keys** tab, and then click the **Create an Access Key** link.

    {{< image src="object-storage-access-keys-tab.png" alt="Click the 'Access Keys' tab" title="Click the 'Access Keys' tab" >}}

1.  If this is your first bucket and you have not enabled Object Storage previously, a prompt appears asking you to confirm that you'd like to enable Object Storage. Click **Enable Object Storage**.

    {{< image src="object-storage-enable-object-storage.png" alt="Enable Object Storage" title="Enable Object Storage" >}}

1.  The **Create an Access Key** menu appears.

    {{< image src="object-storage-create-key.png" alt="The 'Create an Access Key' menu" title="The 'Create an Access Key' menu" >}}

1.  Enter a label for the key pair.

  - This label is how you reference the key pair in the Linode Cloud Manager.

  - You can also toggle the **Limited Access** switch on this panel. This allows you to limit certain permissions on a per bucket level for this access key.

    {{< image src="object-storage-create-key-permissions.png" alt="The Create an Access Key menu with limited permissions" title="The Create an Access Key menu with limited permissions" >}}

    {{< note >}}
Regardless of access, all keys can create new buckets and list all buckets. However, after creating a bucket, depending on what you select here, a limited access key may not be able to access those buckets, add items, remove items, and other actions.
{{</ note >}}

1.  When you have entered the Label, and optionally selected the desired permissions, click the **Submit** button.

1.  A window appears displaying the Access Key and the Secret Key. Write these down somewhere secure. The access key is visible in the Linode Cloud Manager, but **you can not retrieve the secret key again after you close the window!**

    {{< image src="object-storage-access-keys.png" alt="The access key and secret key" title="The access key and secret key" >}}

    You now have the credentials needed to connect to Linode Object Storage.

1.  Check the permissions you gave this key by clicking on the **more options elipsis** link to the right of the key in the Access Keys list. Then, select **View Permissions** from the menu.

    {{< image src="object-storage-view-key-permissions.png" alt="View access key permissions menu" title="View access key permissions menu" >}}

    An access key with limited permissions displays all the buckets and their selected permissions.

    {{< image src="object-storage-display-key-permissions-limited.png" alt="Display limited access key permissions" title="Display limited access key permissions" >}}

    An access key that has full permissions displays a statement about unlimited access.

    {{< image src="object-storage-view-key-permissions-full.png" alt="Display full access key permissions" title="Display full access key permissions" >}}
