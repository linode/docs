---
slug: upload-image-shortguide
author:
  name: Linode
  email: docs@linode.com
description: 'Shortguide that shows you how upload an image with Linode Images.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2021-04-28
modified_by:
  name: Linode
published: 2021-04-28
title: How to Upload a Custom Image
keywords: ["images"]
headless: true
show_on_rss_feed: false
tags: ["linode platform"]
---

1. Log in to the Cloud Manager and open the **[Upload Image](https://cloud.linode.com/images/create/upload)** form by navigating to the **Images** page, clicking the **Create Image** button, and selecting the **Upload Image** tab.

1. Type in the *Label* of the new Image along with an optional *Description*. Select the *Region* you would like the Image to be created within. Since Images can be deployed to any data center (regardless of where they are located), it's recommended that you select the one closest to you geographically for the fastest upload speed.

1. Click the **Generate URL** button to create the Image and generate a custom URL. The URL, which is displayed both separately and within an example curl command, is used to upload your image file. Click **Copy curl Request** to copy the curl command. Alternatively, copy the URL by clicking **Copy URL**, which allows you to write a custom curl command or use a different upload tool altogether.

1. Open your preferred terminal application on the system where your image is currently located, likely your local computer.

1. Upload the image file by pasting the curl command into the terminal window, updating the `--upload-file` option to reference the file name and path of your image. Alternatively, copy the `curl` command below, replacing *example.img* with the file name and path of your image and replacing *url* with the URL that was generated from the previous step.

        curl -H "Content-Type: application/octet-stream" --upload-file example.img.gz "url" --progress-bar --output /dev/null

    This command may take a while to complete, depending on the size of the image file and the transfer speed. During this time, a progress bar will be displayed. By default, curl is already preinstalled on most Linux, Mac, and updated Windows 10 systems using the latest PowerShell terminal. If curl is not installed, install it now by following the recommended instructions for your operating system or package manager.

1. Confirm the image file has been uploaded and is available by navigating to the main **Images** page, finding the new Image in the **Manual Images** table, and looking at the *Status* column. If the Image has been uploaded and processed, the status should be set to *Ready*. If the status is still *Pending Upload* but the curl command completed successfully, wait a few more minutes for the Image to be processed.

    [![Image status](images-upload-status.png)](images-upload-status.png "Image status")

    If there is an error when processing the uploaded image file, the newly created Image may be deleted and an error message will be written to the [Events](https://cloud.linode.com/events) log. See [What Are the Cloud Manager Events and Activity Feeds](/docs/guides/what-are-the-cloud-manager-events-and-activity-feeds/) for more details on viewing Cloud Manager Events.