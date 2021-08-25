---
# Shortguide: How to attach a Block Storage Volume that was previously created and configured to a Linode.

headless: true
show_on_rss_feed: false
---

Follow these steps to attach an existing Block Storage Volume.

1.  Log in to the [Cloud Manager](https://cloud.linode.com/linodes) and click on the **Volumes** link in the sidebar.

1.  Locate the desired Volume within the list, click the **more options ellipsis** dropdown menu, and select **Attach**.

1.  Complete the **Attach Volume** form that appears.

    - **Linode:** Use the dropdown menu to select the Linode you'd like to use. The Volume will be attached to this Linode.
    - **Config:** If the Linode has multiple Configuration Profiles, select which one the Block Storage Volume should be assigned to. This field will not be displayed if the Linode has only a single profile.

    {{< note >}}
The Linode must be located within the same data center as the Block Storage Volume.
{{< /note >}}

    {{< note >}}
If the Linode's data center has been upgraded to NVMe Block Storage and your Linode was deployed prior to August 24th, 2021, you may need to reboot your Linode for it to properly work with a NVMe Block Storage Volume.
{{</ note >}}

1.  Click the **Save** button to attach the Volume.

1.  To start using the Volume on the Linode, additional internal configuration is required. This includes creating the file system (if the Volume hasn't been used before), mounting the Volume, and configuring your Linode to automatically mount the Volume at boot. To learn more about these configuration steps, see [Configuring and Mounting a Volume](/docs/products/storage/block-storage/guides/configure-volume/).