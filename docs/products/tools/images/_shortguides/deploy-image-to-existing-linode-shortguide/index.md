---
# Shortguide: How to deploy an image to an existing Linode

headless: true
show_on_rss_feed: false
---

1. Log in to the Cloud Manager and navigate to the **Images** page.

1. On this page, locate the Image you wish to deploy and click the corresponding **ellipsis** options menu. Select **Rebuild an Existing Linode**.

    ![Rebuild an existing Linode with an Image](images-deploy-existing-linode.png "Rebuild an existing Linode with an Image")

1. You are redirected to the dashboard page for that Linode and the **Rebuild** form is displayed with the chosen Image preselected. Complete the remainder of this form, making sure to select your desired **Root Password**, and any other options that may be needed. See [Rescue and Rebuild → Rebuilding](/docs/guides/rescue-and-rebuild/#rebuilding) for full instructions on rebuilding a Linode.

1. Click the **Rebuild Linode** button to rebuild the Linode. All existing disks will be deleted and a new disk will be created using the selected Image.