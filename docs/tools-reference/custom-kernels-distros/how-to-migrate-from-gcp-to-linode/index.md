---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will help you migrate GCP instances to Linode by exporting raw images from Google and importing them into Linode.'
og_description: 'This guide will help you migrate GCP instances to Linode by exporting raw images from Google and importing them into Linode.'
keywords: ["migrate","GCP","linode","migrate from GCP","migrate to linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-12-20
modified_by:
  name: Linode
title: 'How to Migrate from GCP to Linode'
h1_title: 'Migrating from GCP to Linode'
contributor:
  name: Linode
---

Moving from cloud to cloud can be a tricky task. Migrations typically involve manual steps such as spinning up an identical server, recreating the same users and networking, and then carefully copying over your data and apps. This has become the standard method due to proprietary services and operating systems running on the instances that make it difficult or impossible to move them to another platform. With GCP it's possible to disable these services, create an image to export, and then import it to another cloud provider. This guide will walk you through those steps and help you make the move from GCP to Linode simple.

## In This Guide
You will take the following steps to prepare your migration and then make the move from GCP to Linode.

- [Prepare your GCP instance](#prepare-your-gcp-instance) for export.
- [Create and Export an Image](#create-and-export-image).
- [Prepare your Linode](#prepare-your-linode) for image import.
- [Import your image](#import-the-image).
- [Optional: transfer your disk to allow](#optional-transfer-disk-to-ext4) for advance features.
- [Cleaning Up](#cleaning-up)

## Prepare Your GCP Instance
The first step to migration is preparing your GCP instance for the move.

### Root Password
GCP instances don't have root or user passwords setup by default, you will want to create these so that you can log into your machine after you move it. To do this, ssh into your instance and set up the user accounts.

1.  Once you're logged into your account with ssh, run the following command to set a root password:

        sudo passwd

1.  If you want to set a password for your user account, switch to root and then set user account passwords, replacing username with the username you wish to set a password for:

        su
        passwd username

### Turn Off Google Daemons
Before you migrate the instance you will want to turn off some daemons that try to reach out to Google servers. If you don't do this, once you move to Linode, these services will continually try to call to Google and fail if they are still running.

1.  Navigate to `/etc/default` with the text editor of your choice, create a new file called `instance_configs.cfg.template` with the following:

    {{< file "instance_configs.cfg.template" >}}
[Daemons]
accounts_daemon = false
clock_skew_daemon = false
network_daemon = false
ip_forwarding_daemon = false
{{</ file >}}

1.  Regenerate the `instance_configs.cfg` file with your changes by running the following script:

        sudo /usr/bin/google_instance_setup

1.  Stop and disable the daemons:

        sudo systemctl stop google-accounts-daemon
        sudo systemctl disable google-accounts-daemon
        sudo systemctl stop google-clock-skew-daemon
        sudo systemctl disable google-clock-skew-daemon
        sudo systemctl stop google-network-daemon
        sudo systemctl disable google-network-daemon
        sudo systemctl stop google-ip-forwarding-daemon
        sudo systemctl disable google-ip-forwarding-daemon

### Create a GCP Object Storage Bucket
When you create the image to export you will use a GCP object storage bucket to store it temporarily.

1.  In the Google Cloud Platform dashboord, on the left side menu under *Storage*, click **Storage**.

1.  Create an object storage bucket.

### Stop Your GCP Instance

1.  In the Google Cloud Platform dashboard, on the left side menu under *Compute*, click **Compute Engine**.

1.  Select your instance from the list.

1.  In the detail screen, select **Stop** from the top.

### Setup gcloud compute
You will use gcloud compute to create your image and export it.

1.  Download and install the latest gcloud SDK for your [operating system](https://cloud.google.com/sdk/docs/).

1.  Setup [gcloud compute](https://cloud.google.com/compute/docs/gcloud-compute/) by running the following command:

        gcloud init

    {{< note >}}
This will guide you through a set-up process and will ask to use your browser to log-in to your google account. If you do not have access to a browser, you can use the following command to force console only setup. This method will give you a URL to paste into a browser for verification, which in turn, will give you a verification code to paste back into your console:

    gcloud init --console-only
{{< /note >}}

The set-up will ask you for your `project id`, `region`, and `zone`. You can find these in the Google Cloud Platform. Check [this site](https://cloud.google.com/compute/docs/regions-zones/) for a full list of Google regions and zones.

### Create and Export Image

1.  Once you have setup gcloud compute you can create an image with the following command:

        gcloud compute images create migrate-gcp-img --source-disk test-gcp-instance --source-disk-zone us-east1-b --family debian-9 --storage-location us-east1

    Replace `migrate-gcp-img` with a name you want to give your image, `test-gcp-instance` with the name of your instance, `us-east1-b` with the zone for your instance, `debian-9` with the distribution [image family](https://cloud.google.com/compute/docs/images) for your instance, and `us-east1` with the region where you want your image to be stored.

1.  The output will look similar to the following:

    {{< output >}}
Created [https://www.googleapis.com/compute/v1/projects/speedy-area-263218/global/images/migrate-gcp-img].
NAME             PROJECT             FAMILY    DEPRECATED  STATUS
migrate-gcp-img  speedy-area-263218  debian-9              READY
{{</ output >}}

1.  Export the image to object storage with the following command:

        gcloud compute images export --destination-uri gs://lin-docs-test-bucket/migrate-gcp-img.tar.gz --image migrate-gcp-img --project speedy-area-263218

    Replace `lin-docs-test-bucket` with your bucket name, `migrate-gcp-img` with your image name, and `speedy-area-263218` with your project id.

1.  The output will look similar to the following:

    {{< output >}}
...
[image-export]: 2020-01-03T18:05:46Z Step "image-export-export-disk" (IncludeWorkflow) successfully finished.
[image-export]: 2020-01-03T18:05:46Z Serial-output value -> source-size-gb:10
[image-export]: 2020-01-03T18:05:46Z Serial-output value -> target-size-gb:1
[image-export]: 2020-01-03T18:05:46Z Workflow "image-export" cleaning up (this may take up to 2 minutes).
[image-export]: 2020-01-03T18:05:52Z Workflow "image-export" finished cleanup.
{{</ output >}}

    {{< disclosure-note >}}
Click for full output.
{{< output >}}
Created [https://cloudbuild.googleapis.com/v1/projects/speedy-area-263218/builds/50c714e8-0127-4d33-b7cb-890b54972c21].
Logs are available at [https://console.cloud.google.com/gcr/builds/50c714e8-0127-4d33-b7cb-890b54972c21?project=385393969362].
[image-export]: 2020-01-03T17:57:23Z Validating workflow
[image-export]: 2020-01-03T17:57:23Z Validating step "setup-disks"
[image-export]: 2020-01-03T17:57:23Z Validating step "image-export-export-disk"
[image-export.image-export-export-disk]: 2020-01-03T17:57:23Z Validating step "setup-disks"
[image-export.image-export-export-disk]: 2020-01-03T17:57:23Z Validating step "run-image-export-export-disk"
[image-export.image-export-export-disk]: 2020-01-03T17:57:24Z Validating step "wait-for-inst-image-export-export-disk"
[image-export.image-export-export-disk]: 2020-01-03T17:57:24Z Validating step "copy-image-object"
[image-export.image-export-export-disk]: 2020-01-03T17:57:24Z Validating step "delete-inst"
[image-export]: 2020-01-03T17:57:24Z Validation Complete
[image-export]: 2020-01-03T17:57:24Z Cloud Build ID:
[image-export]: 2020-01-03T17:57:24Z Workflow Project: speedy-area-263218
[image-export]: 2020-01-03T17:57:24Z Workflow Zone: us-east1-b
[image-export]: 2020-01-03T17:57:24Z Workflow GCSPath: gs://speedy-area-263218-daisy-bkt-us-east1/
[image-export]: 2020-01-03T17:57:24Z Daisy scratch path: https://console.cloud.google.com/storage/browser/speedy-area-263218-daisy-bkt-us-east1/daisy-image-export-20200103-17:57:22-1gml9
[image-export]: 2020-01-03T17:57:24Z Uploading sources
[image-export]: 2020-01-03T17:57:24Z Running workflow
[image-export]: 2020-01-03T17:57:24Z Running step "setup-disks" (CreateDisks)
[image-export.setup-disks]: 2020-01-03T17:57:24Z CreateDisks: Creating disk "disk-image-export-image-export-1gml9".
[image-export]: 2020-01-03T17:57:36Z Step "setup-disks" (CreateDisks) successfully finished.
[image-export]: 2020-01-03T17:57:36Z Running step "image-export-export-disk" (IncludeWorkflow)
[image-export.image-export-export-disk]: 2020-01-03T17:57:36Z Running step "setup-disks" (CreateDisks)
[image-export.image-export-export-disk.setup-disks]: 2020-01-03T17:57:36Z CreateDisks: Creating disk "disk-image-export-export-disk-image-export-image-export--1gml9".
[image-export.image-export-export-disk.setup-disks]: 2020-01-03T17:57:38Z CreateDisks: Falling back to pd-standard for disk disk-image-export-export-disk-image-export-image-export--1gml9. It may be caused by insufficient pd-ssd quota. Consider increasing pd-ssd quota to avoid using ps-standard for better performance.
[image-export.image-export-export-disk]: 2020-01-03T17:58:02Z Step "setup-disks" (CreateDisks) successfully finished.
[image-export.image-export-export-disk]: 2020-01-03T17:58:02Z Running step "run-image-export-export-disk" (CreateInstances)
[image-export.image-export-export-disk.run-image-export-export-disk]: 2020-01-03T17:58:02Z CreateInstances: Creating instance "inst-image-export-export-disk-image-export-image-export--1gml9".
[image-export.image-export-export-disk]: 2020-01-03T17:58:08Z Step "run-image-export-export-disk" (CreateInstances) successfully finished.
[image-export.image-export-export-disk]: 2020-01-03T17:58:08Z Running step "wait-for-inst-image-export-export-disk" (WaitForInstancesSignal)
[image-export.image-export-export-disk.run-image-export-export-disk]: 2020-01-03T17:58:08Z CreateInstances: Streaming instance "inst-image-export-export-disk-image-export-image-export--1gml9" serial port 1 output to https://storage.cloud.google.com/speedy-area-263218-daisy-bkt-us-east1/daisy-image-export-20200103-17:57:22-1gml9/logs/inst-image-export-export-disk-image-export-image-export--1gml9-serial-port1.log
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:08Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": watching serial port 1, SuccessMatch: "ExportSuccess", FailureMatch: ["ExportFailed:"] (this is not an error), StatusMatch: "GCEExport:".
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: <serial-output key:'source-size-gb' value:'10'>"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Running export tool."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Disk /dev/sdb is 10 GiB, compressed size will most likely be much smaller."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Beginning export process..."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Copying \"/dev/sdb\" to gs://speedy-area-263218-daisy-bkt-us-east1/daisy-image-export-20200103-17:57:22-1gml9/outs/image-export-export-disk.tar.gz."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Using \"/root/upload\" as the buffer prefix, 1.0 GiB as the buffer size, and 4 as the number of workers."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:18Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Creating gzipped image of \"/dev/sdb\"."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 962 MiB of 10 GiB (192 MiB/sec), total written size: 311 MiB (62 MiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 1.8 GiB of 10 GiB (30 MiB/sec), total written size: 490 MiB (5.9 MiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:59:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 2.5 GiB of 10 GiB (24 MiB/sec), total written size: 561 MiB (2.4 MiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:59:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 3.2 GiB of 10 GiB (24 MiB/sec), total written size: 564 MiB (98 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:00:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 3.9 GiB of 10 GiB (24 MiB/sec), total written size: 567 MiB (98 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:00:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 4.6 GiB of 10 GiB (24 MiB/sec), total written size: 575 MiB (290 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:01:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 5.3 GiB of 10 GiB (24 MiB/sec), total written size: 578 MiB (98 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:01:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 6.0 GiB of 10 GiB (24 MiB/sec), total written size: 582 MiB (126 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:02:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 6.7 GiB of 10 GiB (24 MiB/sec), total written size: 625 MiB (1.4 MiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:02:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 7.4 GiB of 10 GiB (24 MiB/sec), total written size: 628 MiB (98 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:03:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 8.1 GiB of 10 GiB (24 MiB/sec), total written size: 638 MiB (339 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:03:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 8.9 GiB of 10 GiB (24 MiB/sec), total written size: 663 MiB (872 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:04:28Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Read 9.6 GiB of 10 GiB (24 MiB/sec), total written size: 666 MiB (98 KiB/sec)"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:04:48Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Finished creating gzipped image of \"/dev/sdb\" in 6m30.910683672s [26 MiB/s] with a compression ratio of 15."
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:04:48Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: Finished export in  6m30.910846447s"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:04:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": StatusMatch found: "GCEExport: <serial-output key:'target-size-gb' value:'1'>"
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T18:04:58Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": SuccessMatch found "ExportSuccess"
[image-export.image-export-export-disk]: 2020-01-03T18:04:58Z Step "wait-for-inst-image-export-export-disk" (WaitForInstancesSignal) successfully finished.
[image-export.image-export-export-disk]: 2020-01-03T18:04:58Z Running step "copy-image-object" (CopyGCSObjects)
[image-export.image-export-export-disk]: 2020-01-03T18:04:58Z Running step "delete-inst" (DeleteResources)
[image-export.image-export-export-disk.delete-inst]: 2020-01-03T18:04:58Z DeleteResources: Deleting instance "inst-image-export-export-disk".
[image-export.image-export-export-disk]: 2020-01-03T18:04:58Z Step "copy-image-object" (CopyGCSObjects) successfully finished.
[image-export.image-export-export-disk]: 2020-01-03T18:05:46Z Step "delete-inst" (DeleteResources) successfully finished.
[image-export]: 2020-01-03T18:05:46Z Step "image-export-export-disk" (IncludeWorkflow) successfully finished.
[image-export]: 2020-01-03T18:05:46Z Serial-output value -> source-size-gb:10
[image-export]: 2020-01-03T18:05:46Z Serial-output value -> target-size-gb:1
[image-export]: 2020-01-03T18:05:46Z Workflow "image-export" cleaning up (this may take up to 2 minutes).
[image-export]: 2020-01-03T18:05:52Z Workflow "image-export" finished cleanup.
{{</ output >}}
{{</ disclosure-note >}}

1.  The image will be stored in your [object storage bucket](#create-a-gcp-object-storage-bucket). In the Google Cloud Platform, navigate to the object storage bucket.

1.  Click on the more options ellipses and select **Edit Permissions** from the drop down menu.

    ![Google Object Storage Bucket Edit Permissions](migrate-gcp-to-linode-image-export-bucket.png "Google Object Storage Bucket Edit Permissions")

1.  In the dialog box popup click the **Add Item** button to add a new row to the table. Select `User` for Entity, `all Users` for Name, and `Reader` for Access. Then click the **Save** link.

    ![Google Object Storage Bucket Permissions Add Item](migrate-gcp-to-linode-image-export-edit-permissions.png "Google Object Storage Bucket Permissions Add Item")

1.  Now you will see that the status under the **Public access** column for this bucket item is set to *Public* with a link icon.

    ![Google Object Storage Bucket Public](migrate-gcp-to-linode-image-export-bucket-public.png "Google Object Storage Bucket Public")

1.  Right click the link icon and click **Copy Link Address** to copy this link's address. Paste it into a text file somewhere to save for later. It will be something like the following:

        https://storage.googleapis.com/lin-docs-test-bucket/migrate-gcp-img.tar.gz

## Prepare Your Linode
In this section you will create a new Linode, make new disks and configurations for the image, and import the image. You will be importing your image onto a *raw* disk with the *direct disk* boot option.

{{< note >}}
This will result in a woking custom installation; however, it will not support advanced features such as disk resizing within Cloud Manager or Backup Service by default.

To enable these features:

- Create a Linode with twice the space of your original image, you can always resize it down later.
- Follow the steps in the optional section [Transfer Disk to ext4](#optional-transfer-disk-to-ext4).
{{</ note >}}

### Create a Linode

1.  Log into the [Cloud Manager](https://cloud.linode.com). Create a new Linode by clicking Create at the top of the screen and selecting Linode.

1.  Create a Linode by selecting a distribution, region, and plan; assign a lable and root password; and add an SSH key and add-ons if desired.

    {{< note >}}
When selecting a plan, if you want to enable the advanced features like resizing within Cloud Manager and Backup Service, choose one that will be large enough to hold twice the size of entire expanded image that you exported, not just the compressed tar file. You can always resize down to a smaller plan later.
{{</ note >}}

1.  Once the Linode is finished provisioning, power it down by clicking on the **Running** status and selecting *Power Off* from the drop down menu.

1.  Click the **Settings** tab, then **Shutdown Watchdog**. This is also known as *Lassie*, turn this switch to *Disabled*.

1.  Click the **Resize** tab. Scroll to the bottom of the screen and uncheck the box for *Auto Resize Disk*.

### Create New Disks and Configurations

1.  Click the **Advanced** tab. You are now going to create new disks and boot configurations.

1.  Under the **Disks** panel click the more options ellipses next to the main disk and select **Resize** from the drop down menu. Resize this disk to make room for your new image (or twice the size for the optional advanced options).

1.  Click **Add a Disk** and create a new `Empty Disk`.

    ![Linode Create New Raw Disk](migrate-gcp-to-linode-new-raw-disk.png "Linode Create New Raw Disk")

    Give it a lable like "New Google", for filesystem, select `raw`, and for size, enter a size that will accomodate the entire extracted image. Click the **Add** button.

1.  Click **Add a Configuration** and setup a new Linode Configuration with the following settings:

    - Label: Google
    - Kernel: Direct Disk
    - /dev/sda: New Google (your new disk)
    - /dev/sdb: whatever was the default swap disk when the Linode was created
    - Root Device: /dev/sda
    - Filesystem/Boot Helpers: turn these all off

## Import the Image

1.  Click the **Rescue** tag.

1.  Set `/dev/sda` to your new disk, in this example "New Google", set all other options to "None".

1.  Click the **Submit** button. The Linode will reboot into *Rescue* mode.

1.  Once booting is complete, click **Launch Console** at the top of the screen. This opens the `Weblish` and `Glish` console window. You will be presented with a `Finnix` rescue terminal and root prompt.

1.  Run the following command to pull your image from Google cloud storage, unpack it, and copy it to the Linode. Replace the link with the one you copied from your bucket.

        curl -k https://storage.googleapis.com/lin-docs-test-bucket/migrate-gcp-img.tar.gz | tar -xzO  | dd of=/dev/sda

1.  The output will look similar to the following:

    {{< output >}}
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  667M  100  667M    0     0  1156k      0  0:09:51  0:09:51 --:--:-- 81996
20971520+0 records in
20971520+0 records out
10737418240 bytes (11 GB) copied, 593.648 s, 18.1 MB/s
{{</ output >}}

1.  When this completes, close the terminal window and return to the Cloud Manager. Click the **Running** status, select *Reboot* and choose the Google configuration that you created above.

    ![Cloud Manager Reboot Into New Configuration](migrate-gcp-to-linode-reboot-custom-config.png "Cloud Manager Reboot Into New Configuration")

1.  Once booting is complete, click **Launch Console** at the top of the screen. Again, this opens the `Weblish` and `Glish` console window. This time, you should have a regular [Lish shell](/docs/platform/manager/using-the-linode-shell-lish/). You should also be able to SSH to your Linode at this time.

{{< note >}}
If you are having trouble with ssh starting, you may have to run the following command to start the service from Lish:

    start ssh service
See the [SSH guide](/docs/troubleshooting/troubleshooting-ssh/) for more SSH troubleshooting tips.
{{</ note >}}

### Remove Google Packages

You disabled the Google services from calling out before creating and migrating your image, however, there are a few Google packages that you may want to remove. From the console run the following commands:

    dpkg -r google-osconfig-agent
    dpkg -P google-osconfig-agent
    dpkg -r --force-depends google-compute-engine-oslogin
    dpkg -r google-cloud-sdk
    dpkg -r google-cloud-packages-archive-keyring

## Optional: Transfer Disk to ext4

As stated above, to take advantage of features like resizing your disks in Cloud Manager and Backup Service, you'll need to move your new disk to an ext4 formatted disk. To do this, follow the proceedures in the Linode Manager Compatibility section of the [Install a Custom Distribution on a Linode guide](/docs/tools-reference/custom-kernels-distros/install-a-custom-distribution-on-a-linode/#linode-manager-compatibility).

## Cleaning Up

When you're done:

- Delete the original disk that was created when you first created the Linode, as well as the raw disk you created to import the GCP image if you chose to transfer it to the ext4 disk.
- Resize your Linode to a smaller plan or resize your remaining ext4 disk or raw disk to take up the rest of the disk space.
- Delete the Configurations for the original Linode when it was created and optionally for the raw disk if you created a new one for the ext4 boot disk.
- Turn Shutdown Watchdog (Lassie) back on under the **Settings** tab.
