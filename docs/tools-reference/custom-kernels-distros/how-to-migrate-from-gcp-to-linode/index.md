---
author:
  name: Linode
  email: docs@linode.com
description: 'This guide will help you migrate GCP instances to Linode by exporting raw images from Google and importing them to your Linode.'
og_description: 'This guide will help you migrate GCP instances to Linode by exporting raw images from Google and importing them to your Linode.'
keywords: ["migrate","GCP","linode","migrate from GCP","migrate to linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2019-12-20
modified_by:
  name: Linode
title: 'How to Migrate from Google Cloud Platform to Linode'
h1_title: 'Migrating a Google Cloud Platform VM Instance to Linode'
contributor:
  name: Linode
---
This guide will walk you through the steps needed to migrate a Google Cloud Platform (GCP) VM instance to Linode. While there are several ways you can approach migrating your GCP instance to Linode, in this guide you will create a disk image of your primary boot disk, export it to GCP's object storage, and then import the disk image to your new Linode.

{{< note >}}
Alternatively, you can transfer your GCP instance's data to a new Linode using the command line utility, Rsync. See our [Best Practices when Migrating to Linode](/docs/platform/migrate-to-linode/best-practices-when-migrating-to-linode/#use-rsync-to-transfer-your-data-to-your-linode) guide for best practices when using Rsync.
{{</ note >}}

## In This Guide
You will complete the following steps to migrate your GCP VM instance to Linode:

- [Prepare your GCP instance](#prepare-your-gcp-instance) for export.
- [Create and Export an Image](#create-and-export-image).
- [Prepare your Linode](#prepare-your-linode) for image import.
- [Import your image](#import-the-image).
- [Optional: transfer your disk to allow](#optional-transfer-disk-to-ext4) for advance features.
- [Cleaning Up](#cleaning-up)

## GCP Prerequisites

This section contains all of the preparation steps that you will need to complete on the Google Cloud Platform and on your GCP instance in order to migrate it to Linode. At a high-level, you will disable Google specific daemons running on your GCP instance, create and export an image of your instance, and store the image in a GCP object storage bucket.

### Install and Set Up gcloud

{{< note >}}
If you have already installed the Google Cloud SDK on your computer, you can skip this section.
{{</ note >}}

The [Google Cloud SDK](https://cloud.google.com/sdk/docs/) gives you access to the `gcloud` command-line tool. You will need `gcloud` to create and export an image of your GCP instance. You will [create the instance image](#create-and-export-image) later on in this guide.

1.  Download and install the latest [Google Cloud SDK](https://cloud.google.com/sdk/docs/) for your operating system.

1.  Setup [gcloud compute](https://cloud.google.com/compute/docs/gcloud-compute/) by running the following command:

        gcloud init

    {{< note >}}
`gcloud init` will guide you through a setup process and ask to use your browser to log in to your Google account. If you do not have access to a browser, you can use the following command to force console only setup. This method will give you a URL to paste into a browser for verification, which in turn, will give you a verification code to paste back into your console:

    gcloud init --console-only
    {{< /note >}}

    The setup will ask you for your `project id`, `region`, and `zone`. You can find these values from your Google Cloud Platform account. Check [the GCP documentation](https://cloud.google.com/compute/docs/regions-zones/) for a full list of Google regions and zones.

### Create a GCP Object Storage Bucket

When you create an image of your GCP instance you will temporarily store it in a [GCP object storage bucket](#create-and-export-a-disk-image). Follow the steps in this section to create the GCP object storage bucket.

{{< note >}}
Using the GCP object storage service will incur additional charges outside of the cost of your GCP instance.
{{</ note >}}

1. Navigate to your [GCP dashboard](https://console.cloud.google.com/home/dashboard). From the left sidebar menu, under the *Storage* section, click **Storage**.

1.  Create an object storage bucket. You can follow GCP's inline steps to complete this process. For more information on GCP object storage access control options, see their [official documentation](https://cloud.google.com/storage/docs/access-control/).

### Prepare Your GCP Instance

Now that you have completed the prerequisite steps, you are ready to prepare your GCP instance for its migration to Linode. This will require creating a root password, turning off Google daemons, and creating and exporting a GCP image.

#### Root Password
GCP instances don't have root or user passwords setup by default, you will create these so that you can log into your machine after you migrate it.

1. [SSH into your GCP instance](https://cloud.google.com/compute/docs/instances/connecting-to-instance).

1.  Once you're logged into your GCP instance with ssh, run the following command to set a root password:

        sudo passwd

1.  If you want to set a password for your user account, switch to root and then set user account passwords. Ensure you replace `username` with the username for which you want to set a password:

        su
        passwd username

1. Return to your normal user, if desired:

        exit

#### Inspect your GCP Instance's Disks

Before continuing with the preparation to migrate, you should inspect your GCP instance for the following information:

- The number of non-volatile disks located on your instance.
- The amount of storage space each disk takes up. In the [Prepare Your Linode](#prepare-your-linode) section, you will need to know the size of each disk you would like to migrate in order to select the appropriate plan size for the Linode you will be migrating to.
- Determine which disk(s) you would like to migrate to your new Linode. You will need to repeat the steps in the [Create and Export Image](#create-and-export-image) and the [Create New Disks and Configurations](#create-new-disks-and-configurations) sections for each non-volatile disk on your GCP instance that you would like to migrate to your Linode.

    {{< note >}}
At minimum, you will migrate your GCP instance's boot disk. On a Linux system, without a custom boot disk configured, this is likely `/dev/sda1`.
    {{</ note >}}

1. To inspect your GCP instance's disks, [ssh into your GCP instance](https://cloud.google.com/compute/docs/instances/connecting-to-instance#gcetools) and issue the following command to view disk size on each mounted disk:

    {{< note >}}
  The usable disk space that is reported by `df` reflects only 90 percent of full capacity.
    {{</ note >}}

        df -h

      You should see a similar output:

      {{< output >}}
Filesystem      Size  Used Avail Use% Mounted on
udev            3.7G     0  3.7G   0% /dev
tmpfs           749M  9.9M  739M   2% /run
/dev/sda1       9.8G  1.2G  8.2G  13% /
tmpfs           3.7G     0  3.7G   0% /dev/shm
tmpfs           5.0M     0  5.0M   0% /run/lock
tmpfs           3.7G     0  3.7G   0% /sys/fs/cgroup
      {{</ output >}}

    You can also issue the following command, which displays all available block devices:

        lsblk

    Your output should resemble the following:

    {{< output >}}
NAME   MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
sda      8:0    0  10G  0 disk
└─sda1   8:1    0  10G  0 part /
    {{</ output >}}

    In this example, the you will create a disk image for `/dev/sda1` and you will need, at minimum, 10GB of storage. For more details related to Linode plan size considerations see the [Create a Linode](/docs/tools-reference/custom-kernels-distros/how-to-migrate-from-gcp-to-linode/#create-a-linode) section.

#### Turn Off Google Daemons
Before you migrate the instance, turn off the daemons that communicate with Google servers. If you don't do this, once you move to Linode, these services will continually try to access Google servers and fail if the daemons are still running.

1. With the text editor of your choice, create a new file called `/etc/default/instance_configs.cfg.template` file. Copy and paste the configurations in the example file:

        sudo nano /etc/default/instance_configs.cfg.template

    {{< file "/etc/default/instance_configs.cfg.template" >}}
[Daemons]
accounts_daemon = false
clock_skew_daemon = false
network_daemon = false
ip_forwarding_daemon = false
    {{</ file >}}

1.  Regenerate the `instance_configs.cfg` file with your changes by running the following script:

        sudo /usr/bin/google_instance_setup

    Verify that the changes took effect by viewing the contents of the `/etc/default/instance_configs.cfg` file. The `[Daemons]` section should resemble the file you created in step 1.

        cat /etc/default/instance_configs.cfg

1.  Stop and disable the daemons:

        sudo systemctl stop google-accounts-daemon
        sudo systemctl disable google-accounts-daemon
        sudo systemctl stop google-clock-skew-daemon
        sudo systemctl disable google-clock-skew-daemon
        sudo systemctl stop google-network-daemon
        sudo systemctl disable google-network-daemon
        sudo systemctl stop google-ip-forwarding-daemon
        sudo systemctl disable google-ip-forwarding-daemon

      {{< note >}}
If your GCP instance was not created with IP forwarding enabled, then you may see a similar message after attempting to stop and disable the `google-ip-forwarding-daemon`:

    sudo systemctl disable google-ip-forwarding-daemon
    Failed to disable unit: No such file or directory
    user@test-instance:~$ sudo systemctl --status
    systemctl: unrecognized option '--status'
    user@test-instance:~$ sudo systemctl status
      {{</ note >}}

#### Stop Your GCP Instance
In order to create your instance's disk image in the next section, you will first need to stop the instance. This will prevent any new data from being written to the persistent disk.

{{< note >}}
GCP recommends stopping your instance prior to creating a disk image, however, it is possible to keep the instance running while you create your image. See their [official documentation](https://cloud.google.com/compute/docs/images/create-delete-deprecate-private-images#prepare_instance_for_image) for details.
{{</ note >}}

1.  Navigate to your [GCP dashboard](https://console.cloud.google.com/home/dashboard). From the left sidebar menu, under *Compute*, click **Compute Engine**.

1.  Viewing your VM instances, click on the more options ellipsis for your instance and select **Stop**.

#### Create and Export a Disk Image

You are now ready to create and export an instance image using the `gcloud` command-line tool. If you have not [installed the Google Cloud SDK](#install-and-set-up-gcloud), you will need to do so before proceeding.

1.  Create an instance disk image with the command below. Replace `migrate-gcp-img` with a name you want to give your image, `test-gcp-instance` with the name of your instance's disk, `us-east1-b` with the zone for your instance, `debian-9` with the distribution [image family](https://cloud.google.com/compute/docs/images) for your instance, and `us-east1` with the region where you want your image to be stored.

        gcloud compute images create migrate-gcp-img --source-disk test-gcp-instance --source-disk-zone us-east1-b --family debian-9 --storage-location us-east1

1.  The output will look similar to the following:

    {{< output >}}
Created [https://www.googleapis.com/compute/v1/projects/speedy-area-263218/global/images/migrate-gcp-img].
NAME             PROJECT             FAMILY    DEPRECATED  STATUS
migrate-gcp-img  speedy-area-263218  debian-9              READY
{{</ output >}}

1.  Export the image to object storage with the command below. Replace `lin-docs-test-bucket` with your bucket name, `migrate-gcp-img` with your image name, and `speedy-area-263218` with your project id. This process may take a few minutes to complete.

        gcloud compute images export --destination-uri gs://lin-docs-test-bucket/migrate-gcp-img.tar.gz --image migrate-gcp-img --project speedy-area-263218

    {{< note >}}
You may need to respond to some command-line prompts before the image is exported.
    {{</ note >}}

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
Click for full example output.
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
[image-export.image-export-export-disk.wait-for-inst-image-export-export-disk]: 2020-01-03T17:58:08Z WaitForInstancesSignal: Instance "inst-image-export-export-disk-image-export-image-export--1gml9": watching serial port 1, SuccessMatch: "ExportSuccess", FailureMatch: ["ExportFailed:"]: (this is not an error), StatusMatch: "GCEExport:".
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

1. From your [GCP dashboard](https://console.cloud.google.com/home/dashboard), navigate to your **Storage Browser** and click on the GCP object storage bucket that you exported your instance image to.

1.  You will see your instance image listed. Click on its corresponding more options ellipses and select **Edit Permissions** from the drop down menu.

    {{< note >}}
  If you do not see the **Edit Permissions** option, then your bucket may have been created with uniform access controls. To make the image publicly accessible, see GCP's [official documentation](https://cloud.google.com/storage/docs/access-control/making-data-public) for information on making data public. When you have completed the steps listed in the GCP documentation proceed to step 8 of this section.
    {{</ note >}}

    ![Google Object Storage Bucket Edit Permissions](migrate-gcp-to-linode-image-export-bucket.png "Google Object Storage Bucket Edit Permissions")

1.  In the dialog box popup, click the **Add Item** button to add a new row to the table. Select `User` for Entity, `all Users` for Name, and `Reader` for Access. Then click the **Save** link.

    ![Google Object Storage Bucket Permissions Add Item](migrate-gcp-to-linode-image-export-edit-permissions.png "Google Object Storage Bucket Permissions Add Item")

1.  Now you will see that the status under the **Public access** column for this bucket item is set to *Public* with a link icon.

    ![Google Object Storage Bucket Public](migrate-gcp-to-linode-image-export-bucket-public.png "Google Object Storage Bucket Public")

1.  **Right click** the link icon and click **Copy Link Address** to copy this object's link address. Paste it into a text file somewhere to save for later. It will resemble the following link:

        https://storage.googleapis.com/lin-docs-test-bucket/migrate-gcp-img.tar.gz

## Prepare Your Linode
In this section you will create a new Linode, add a new disk and configuration profile in order to boot the Linode from your GCP instance's image, import the GCP image to your Linode, and finally, boot your Linode using your GCP instance's image.

{{< note >}}
You will be importing your GCP image onto a *raw* disk with the *direct disk* boot option. This will result in a working custom installation; however, it will not support advanced Linode features such as [disk resizing](/docs/platform/disk-images/resizing-a-linode/) or the [Backup Service](/docs/platform/disk-images/linode-backup-service/) by default. These features require an `ext4` formatted disk.

If you would like access to these features after completing your migration, ensure you complete the following steps:

- Create a Linode with **twice the storage space** of your [original disk image](#inspect-your-gcp-instances-disks). You can always resize it down later. See the [How Linode Billing Works](/docs/platform/billing-and-support/how-linode-billing-works/#how-hourly-billing-works) guide for details on how hourly billing works.

- Follow the steps in the optional section [Transfer Disk to ext4](#optional-transfer-disk-to-ext4).
{{</ note >}}

### Create a Linode

You will first create a new Linode to import your GCP image to and then, boot the Linode from that image. Before creating your Linode, verify the storage size of your original GCP disk if you have not already.

1.  Log into the [Cloud Manager](https://cloud.linode.com).

1. Access the Linode create page by clicking **Create** at the top of the screen and selecting **Linode** from the dropdown menu.

1. Create a Linode by making the desired selections on the Linode create page. For more detailed steps, see the [Create a Linode](/docs/getting-started/#create-a-linode) section in our [Getting Started](/docs/getting-started/) guide.

    {{< note >}}
When selecting your Linode's plan, if you want to have access to advanced features like resizing your Linode and our [Backup Service](/docs/platform/disk-images/linode-backup-service/), choose one that will be large enough to hold twice the size of the entire expanded [disk image](#inspect-your-gcp-instances-disks) that you created from your GCP instance (not just the size of the compressed tar file). This is needed so that later you can  move your installation over to an ext4 formatted disk. Once the move to an ext4 formatted disk is complete, you can delete the raw disk and [resize to a smaller plan](/docs/platform/disk-images/resizing-a-linode/).
  {{</ note >}}

1.  Once the Linode is finished provisioning, power it down. Click on the **Running** status at the top of the Cloud Manager and select **Power Off** from the drop down menu.

1.  [Disable *Watchdog*](/docs/uptime/monitoring-and-maintaining-your-server/#configure-shutdown-watchdog), also known as *Lassie*, which is a Linode Cloud Manager feature capable of automatically rebooting your Linode if it powers off unexpectedly. Click the **Settings** tab, then **Shutdown Watchdog**. Toggle the **Enabled** switch to **Disabled**.

1.  Disable your Linode's Auto Resize capability. Click the **Resize** tab and scroll to the bottom of the screen. Uncheck the box for **Auto Resize Disk**.

### Create New Disks and Configurations

In this section you will create a new disk and boot configuration in order to be able to boot your Linode from your GCP image.

1.  Access your Linode's **Disks/Configs** tab.

1.  Under the **Disks** panel click the more options ellipses next to the main disk (for example, `Debian 9 Disk`) and select **Resize** from the drop down menu. Resize this disk to make room for the new raw disk you will create in the next step. The new raw disk is where your GCP image will be installed.

    {{< note >}}
If, for example, your GCP disk image's size is 10GB, ensure that you resize the main disk to make enough room for a a new disk that is slightly larger than 10 GB (11 GB, for example). This will ensure that you can safely reboot your Linode from the extracted image (you will complete that step in a later section).
    {{</ note >}}

1.  Click **Add a Disk** and create a new `Empty Disk`. Give it a label like "New Google", for filesystem, select `raw`, and for size, enter a size that will accommodate the entire extracted image. Click the **Add** button.

    ![Linode Create New Raw Disk](migrate-gcp-to-linode-new-raw-disk.png "Linode Create New Raw Disk")

1.  Click **Add a Configuration** and setup a new Linode Configuration with the following settings:

    - Label: Google
    - Kernel: Direct Disk
    - /dev/sda: New Google (your new disk)
    - /dev/sdb: select the default swap disk when the Linode was created
    - Root Device: /dev/sda
    - Filesystem/Boot Helpers: disable all of these settings

1. Click on the **Submit** button to complete creating the new configuration.

### Import the Image

1.  Click the **Rescue** tab.

1.  Set `/dev/sda` to your **new disk**. In this example, the disk is named "New Google". Set all remaining options to **None**.

1.  Click the **Reboot into Rescue Mode** button. The Linode will reboot into *Rescue* mode.

1.  Once booting is complete, click **Launch Console** at the top of the screen. This opens the `Weblish` and `Glish` console window. You will be presented with a `Finnix` rescue terminal and root prompt.

1.  Run the following command to pull your image from Google cloud storage, unpack it, and copy it to the Linode. Replace the URL with the one you copied from your [GCP object storage bucket](#create-a-gcp-object-storage-bucket).

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

1.  When this completes, close the console and return to the Cloud Manager. Click the **Running** status, select **Reboot**, choose the Google configuration that you created above, and click on **Submit**.

    ![Cloud Manager Reboot Into New Configuration](migrate-gcp-to-linode-reboot-custom-config.png "Cloud Manager Reboot Into New Configuration")

1.  Once booting is complete, click **Launch Console** at the top of the screen. Again, this opens the `Weblish` and `Glish` console window. This time, you should have a regular [Lish shell](/docs/platform/manager/using-the-linode-shell-lish/). You should also be able to SSH to your Linode at this time.

    {{< note >}}
If you are having trouble with ssh starting, you may have to run the following command to start the service from Lish:

    sudo service ssh start
See the [SSH guide](/docs/troubleshooting/troubleshooting-ssh/) for more SSH troubleshooting tips.
    {{</ note >}}

### Remove Google Packages

You disabled the Google services from calling out before creating and migrating your image, however, there are a few Google packages that you may want to remove. From the console run the following commands:

    sudo dpkg -r google-osconfig-agent
    sudo dpkg -P google-osconfig-agent
    sudo dpkg -r --force-depends google-compute-engine-oslogin
    sudo dpkg -r google-cloud-sdk
    sudo dpkg -r google-cloud-packages-archive-keyring

## Optional: Transfer Disk to ext4

As stated above, to take advantage of features like resizing your disks in Cloud Manager and Backup Service, you'll need to move your new disk to an ext4 formatted disk. To do this, follow the procedures in the Linode Manager Compatibility section of the [Install a Custom Distribution on a Linode guide](/docs/tools-reference/custom-kernels-distros/install-a-custom-distribution-on-a-linode/#linode-manager-compatibility).

## Cleaning Up

When you're done:

- [Delete the original disk](/docs/platform/disk-images/disk-images-and-configuration-profiles/#removing-a-disk) that was created when you first deployed the Linode. If you chose to transfer your disk to ext4, delete the raw disk you created to import the GCP image.
- [Resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a smaller plan or resize your remaining ext4 disk or raw disk to take up the rest of the storage space.
- [Delete the Configurations for the original Linode](/docs/platform/disk-images/disk-images-and-configuration-profiles/#removing-a-configuration-profile) when it was created. Optionally, delete the configuration for the raw disk if you created a new one for the ext4 boot disk.
- [Enable Shutdown Watchdog](/docs/uptime/monitoring-and-maintaining-your-server/#configure-shutdown-watchdog) (Lassie) under the **Settings** tab.
