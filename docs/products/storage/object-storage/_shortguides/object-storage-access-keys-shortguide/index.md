---
slug: object-storage-access-keys-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how to generate an Access Key for the Linode Object Storage service.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-05-26
modified_by:
  name: Linode
published: 2020-07-22
title: How to Generate an Access Key for the Linode Object Storage Service
keywords: ["object storage"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
aliases: ['/platform/object-storage/object-storage-access-keys-shortguide/']
---

To use Object Storage with any compatible client or command-line tool, you'll need to generate an Access Key. This can be done directly in the Cloud Manager.

1.  Log into the [Linode Cloud Manager](https://cloud.linode.com).

1.  Click the **Object Storage** link in the sidebar, click the **Access Keys** tab, and then click the **Create an Access Key** link.

    ![Click the 'Access Keys' tab](object-storage-access-keys-tab.png "Click the 'Access Keys' tab")

1.  If this is your first bucket and you have not enabled Object Storage previously, a prompt appears asking you to confirm that you'd like to enable Object Storage. Click **Enable Object Storage**.

    ![Enable Object Storage](object-storage-enable-object-storage.png "Enable Object Storage")

1.  The **Create an Access Key** menu appears.

    ![The 'Create an Access Key' menu](object-storage-create-key.png "The 'Create an Access Key' menu")

1.  Enter a label for the Access Key.

  - This label is how you reference the Access Key in the Linode Cloud Manager.

  - You can also toggle the **Limited Access** switch on this panel. This allows you to limit certain permissions on a per bucket level for this access key.

    ![The Create an Access Key menu with limited permissions](object-storage-create-key-permissions.png "The Create an Access Key menu with limited permissions")

    {{< note >}}
Regardless of access, all keys can create new buckets and list all buckets. However, after creating a bucket, depending on what you select here, a limited access key may not be able to access those buckets, add items, remove items, and other actions.
{{</ note >}}

1.  When you have entered the Label, and optionally selected the desired permissions, click the **Submit** button.

1.  A window appears displaying the Access Key and the Secret Key. Write these down somewhere secure. The access key is visible in the Linode Cloud Manager, but **you can not retrieve the secret key again after you close the window!**

    ![The access key and secret key](object-storage-access-keys.png "The access key and secret key")

    You now have the credentials needed to connect to Linode Object Storage.

1.  Check the permissions you gave this key by clicking on the **more options elipsis** link to the right of the key in the Access Keys list. Then, select **View Permissions** from the menu.

    An access key with limited permissions displays all the buckets and their selected permissions. An access key that has full permissions displays a statement about unlimited access.