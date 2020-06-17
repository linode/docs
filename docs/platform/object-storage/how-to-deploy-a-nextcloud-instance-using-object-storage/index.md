---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-06-16
modified_by:
  name: Linode
title: "How to Configure Nextcloud to use Linode Object Storage as an External Storage Mount"
h1_title: "Configuring Nextcloud to use Linode Object Storage as an External Storage Mount"
contributor:
  name: Linode
external_resources:
- '[Nextcloud Configuring Extern Storage Documentation](https://docs.nextcloud.com/server/15/admin_manual/configuration_files/external_storage_configuration_gui.html#)'
---
[Nextcloud](https://nextcloud.com/) is an open source solution for file hosting and sharing. With Nextcloud, you can synchronize files from your local computer to your Linode server and share them with your collaborators. Nextcloud’s customizable security features and intuitive user interface help keep your files safe and easy to manage.

You can configure Nextcloud to enable external storage devices and services, like [Linode Object Storage](https://www.linode.com/products/object-storage/), to use as a secondary place to keep your files. Using Linode Object Storage to store your files will prevent you from running out of storage space limited by your Linode's plan size. When using Nextcloud's graphical user interface (GUI) to manage your files, your external storage device will show up just like any other folder.

## Before You Begin

1. Deploy a Nextcloud server instance. You can use the [Linode Nextcloud One-Click App] for an easy and quick deployment.

1. [Enable the Object Storage service on your Linode account](/docs/platform/object-storage/how-to-use-object-storage/#enable-object-storage).

1. [Generate Object Storage access keys](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair).

1. If you are not familiar with Linode Object Storage, review the [How to Use Linode Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide.

## Nextcloud Configurations
### Enable the External Storage App

In this section you will enable the *External Storage Support* Nextcloud app in order to use external storage sources.

{{< note >}}
You must belong to the `admin` user group in order to install the External storage support app.
{{</ note >}}

1. Log into your Nextcloud instance.

1. Click on your user icon in the top navigation menu and select **Apps**.

1. In the left-hand navigation menu, click on **Files** to access all Nextcloud apps related to file management.

1. Use the search field in the top navigation to narrow down the visible apps. You can enter *external* as your search term.

1. Viewing the *External storage support* app, click on its **Downlaod and enable** button in order to install it to your Nextcloud instance.

### Create a New Linode Object Storage External Storage Mount

After enabling the External Storage Support app, you are now ready to add a new external storage mount. You will configure your new external storage mount to use the Linode Object Storage service.

{{< note >}}
If you have not yet [enabled Object Storage on your Linode account](/docs/platform/object-storage/how-to-use-object-storage/#enable-object-storage) and [created Object Storage access keys](/docs/platform/object-storage/how-to-use-object-storage/#generate-a-key-pair), you should do so now before proceeding with this section.
{{</ note >}}

1. Click on your user icon in the top navigation menu and select **Settings**.

1. In the left-hand navigation menu, under the **Administration** heading, click on **External Storages**. You will be brought to the *External Storages* administration page.

1. In the **Folder name** text entry box, provide a name for your external storage directory.

1. From the **External Storage** dropdown menu, select the **Amazon S3** option.

    {{< note >}}
Linode Object Storage is *S3-compatible*. Nextcloud will connect to Amazon's Object Storage service by default, however, in the next step you will override the default behavior to use Linode Object Storage hosts instead.
    {{</ note >}}

1. Select **Access Key** from the **Authentication** dropdown menu.

1. Under the **Configuration** heading, provide the following configurations:

    | **Configuration** | **Description** |
    | :------: | :------: |
    | Bucket | The name to assign to your Object Storage bucket. If this bucket name already exists in the data center region you select, you will encounter an error. |
    | Hostname | The hostname used for the Object Storage region where your bucket will be stored. Refer to the *Linode Object Storage Region and Hostname Values* note located below this table for available hostname values. |
    | Port | The port number to use to access the Object Storage host. This value must be `443`. |
    | Region | The data center region to store your Object Storage bucket. Refer to the *Linode Object Storage Region and Hostname Values* note located below this table for available data center region IDs. |
    | Enable SSL | A configuration to enable secure sockets layer (SSL). This configuration must be enabled. |
    | Enable Path Style | This configuration will change the default path format used by Nextcloud to access your Object Storage bucket. **Do not** enable this configuration. |
    | Legacy (v2) Authentication | This configuration will enable version 2 authentication to your Object Storage service. By default Nextcloud will use version 4 authentication, which is compatible with Linode Object Storage. **Do not** enable this configuration.|
    | Access Key | The value of the Access Key you created using the Linode Cloud Manager. |
    | Secret Key | The value of the Secret Key you created using the Linode Cloud Manager. |

      {{< disclosure-note "Linode Object Storage Region and Hostname Values">}}

| **Region** | **Region ID** | **Hostname** |
|:------:|:------:|:------:|
| Newark, NJ, USA | `us-east-1` | us-east-1.linodeobjects.com |
| Frankfurt, Germany | `eu-central-1` | eu-central-1.linodeobjects.com |
      {{</ disclosure-note >}}

1. In the **Available for** text entry box, enter the group name(s) you would like to give access to your Linode Object Storage external storage. To learn more about user and group permissions related to external storage, see [Nextcloud's documentation](https://docs.nextcloud.com/server/15/admin_manual/configuration_files/external_storage_configuration_gui.html#user-and-group-permissions).

    If all your configurations are valid, you should see a green check box appear next to your external storage entry.

1. Using the top navigation menu, click on the **Files** menu item. You should see your external storage folder in your list of folders.

1. Click on your external storage folder to view its contents. You should not see anything stored there yet.

1. Test out the external storage mount by adding a file to the folder. Click on the **+** button in the top breadcrumbs area of the screen and select **Upload file**.

1. Your local file browser will appear. Select a test file to add to the external storage folder and click **Open**. You should see the file appear in the folder.

    {{< note >}}
The file you uploaded will also be available through the [Linode Cloud Manager](https://cloud.linode.com/). You can verify this by following the steps in the [View Bucket Objects](/docs/platform/object-storage/how-to-use-object-storage/#view-bucket-objects) section  of our [How to Use Linode Object Storage](/docs/platform/object-storage/how-to-use-object-storage/) guide. You should not use the Linode Cloud Manager to remove or add files from your Nextcloud external storage Object Storage bucket.
    {{</ note >}}