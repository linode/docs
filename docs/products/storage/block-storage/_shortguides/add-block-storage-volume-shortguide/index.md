---
# Shortguide: Sescribes how to create a new Block Storage Volume, attach it to your Linode, create a filesystem, and mount your Volume.

headless: true
show_on_rss_feed: false
---

Follow these steps to create a new Block Storage Volume, attach it to your Linode, create a filesystem, and mount your Volume.

{{< note >}}
If the Linode's data center has been upgraded to NVMe Block Storage and your Linode was deployed prior to August 24th, 2021, you may need to reboot your Linode for it to properly work with a NVMe Block Storage Volume.
{{</ note >}}

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Linodes** link in the sidebar.

1.  Select the Linode to which you want to attach a Block Storage Volume. The detail page for the Linode will appear.

1.  Navigate to the **Storage** tab and then click the **Add a Volume** button (within the *Volumes* section).

1.  Complete the **Create a Volume** form.

    - Select **Create and Attach Volume** to create a new Volume. Otherwise select **Attach Existing Volume** to attach a Volume that's already on your account and in the same data center as the Linode.
    - **Label:** A string up to 32 characters long and consisting only of ASCII characters `a-z; 0-9.-_`.
    - **Size:** The desired size for the new Volume. See the [Limits and Considerations](/docs/products/storage/block-storage/#limits-and-considerations) section for the minimum and maximum size.
    - **Config:** If the Linode has multiple Configuration Profiles, select which one the Block Storage Volume should be assigned to.
    - **Tags:** Optionally add or assign tags to help label and organize your services.

1.  When finished, click **Create Volume**.

1.  A **Volume Configuration** panel appears, which contains the instructions needed to start using the new Volume with your Linode. These instructions include commands for creating the file system, mounting the Volume, and configuring your Linode to automatically mount the Volume at boot. To learn more about these commands, see [Configuring and Mounting a Volume](/docs/products/storage/block-storage/guides/configure-volume/).

1.  Once created, the Volume is listed under the *Volumes* table.