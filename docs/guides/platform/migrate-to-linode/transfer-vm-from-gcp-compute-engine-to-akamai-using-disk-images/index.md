---
slug: transfer-vm-from-gcp-compute-engine-to-akamai-using-disk-images
title: "Transfer VM From GCP Compute Engine to Akamai Using Disk Images"
description: "Two to three sentences describing your guide."
authors: ["Linode"]
contributors: ["Linode"]
published: 2025-05-28
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

In modern cloud computing, virtual machine (VM) migration is a process that enables organizations to transition workloads between cloud platforms to optimize costs, improve performance, or enhance flexibility. By migrating VMs, organizations can select the capabilities of various cloud providers that best satisfy their business needs.

This guide focuses on migrating a VM from Google Cloud Platform (GCP) to Akamai Linode and suggests how to plan, execute, and validate the migration.

## Prerequisites

To follow along in this walkthrough, you’ll need the following:

* An [account with Akamai Linode](https://www.linode.com/cfe)  
* A [Linode API token (personal access token)](https://www.linode.com/docs/products/platform/accounts/guides/manage-api-tokens/)  
* The [Linode CLI](https://www.linode.com/docs/products/tools/cli/guides/install/) installed and configured  
* A GCP account with sufficient permissions to work with Disks, Storage, and Build Jobs.  
* The [GCP CLI](https://cloud.google.com/sdk/docs/install-sdk) (gcloud) installed and configured  
* [QEMU](https://www.qemu.org/) installed and configured

## Preparing Your Compute Engine Image for Migration

Prepare your current GCP environment to ensure a smooth and efficient transition. As you assess your Compute Engine requirements, familiarize yourself with any limitations that Akamai Linode imposes on resources imported into its systems.

| Important note: [Images imported into Akamai Linode](https://techdocs.akamai.com/cloud-computing/docs/upload-an-image) must be smaller than 6 GB unzipped and 5 GB zipped. Larger images will be rejected and not imported. |
| :---- |

### Assess current Compute Engine requirements

Capture the current configuration of your Compute Engine VM so that you can select the appropriate [Akamai Connected Cloud plan](https://www.linode.com/pricing/#compute-shared) to ensure post-migration performance. In the GCP Console, navigate to **Compute Engine \> VM Instances**.

![][image2]

Note the name and zone of your running Compute Engine instance. Click on the name.

![][image3]

#### Machine type

Navigate to the **Machine Configuration** section of the details page to see the machine type for this VM instance. In the following example, the machine type is e2-medium.

![][image4]

Alternatively, the machine type can be found through the gcloud. First, configure the CLI by setting the project ID. The project ID can be found by clicking on the project name in the upper left of the page, which opens a modal.

![][image5]

Run the following command:

| $ gcloud config set project \<PROJECT ID\> Updated property \[core/project\]. |
| :---- |

To find the machine type for your instance, run this command, replacing the instance name and zone with your own:

| $ gcloud compute instances \\     describe instance-20250208-003502 \\     \--zone=us-west1-a \\     \--format="value(machineType)" https://www.googleapis.com/compute/v1/projects/gcp-vm-migration-450215/zones/us-west1-a/machineTypes/e2-medium |
| :---- |

#### CPU and memory usage

Use the CLI to determine the CPU and memory configurations for this Compute Engine machine type:

| $ gcloud compute machine-types \\    describe e2-medium \\    \--zone=us-west1-a \\    \--format="table(name, guestCpus, memoryMb)"NAME       GUEST\_CPUS  MEMORY\_MBe2-medium  2           4096 |
| :---- |

For this guide, the example Compute Instance VM has 2 CPUs and 4GB of memory.

#### Storage usage

The type and size of the storage disk associated with your VM are displayed in the **Storage (Boot disk)** section of the instance details page.

![][image6]

#### IP addresses

In the **Network Interfaces** section of the instance details, you will see the IP addresses listed in this instance:

![][image7]

To find the internal and external IP address of the running instance with gcloud, run the following command:

| $ gcloud compute instances list \\    \--filter="name=instance-20250208-003502" \\    \--format=\\ "table(name, networkInterfaces\[0\].accessConfigs\[0\].natIP, networkInterfaces\[0\].networkIP)"NAME                      NAT\_IP           NETWORK\_IP instance-20250208-003502  104.198.111.144  10.138.0.3 |
| :---- |

####  Security groups and firewall rules

Select the network name in the Network Interfaces section to see the current network resources and configurations, such as the firewall settings:

![][image8]

On the command line, to find all the firewall rules for a VM, run the following:

| $ gcloud compute firewall-rules list \--filter="network:default"NAME                    DIRECTION  PRIORITY   ALLOW                        default-allow-icmp      INGRESS    65534      icmpdefault-allow-internal  INGRESS    65534      tcp:0-65535,udp:0-65535,icmpdefault-allow-rdp       INGRESS    65534      tcp:3389default-allow-ssh       INGRESS    65534      tcp:22 |
| :---- |

Back up your Compute Engine Disk (optional)  
Before starting your migration, consider backing up the Compute Engine disk just in case a restoration is needed in the future. In the **Storage** section of your Compute Instance details, find the disk associated with the VM you wish to export and select it.

![][image9]

Click the **Create Snapshot**.

![][image10]

To achieve the same on the command line, run the following:

| $ gcloud compute snapshots \\     create my-vm-snapshot \\     \--source-disk=instance-20250208-003502 \\     \--source-disk-zone=us-west1-a \\     \--storage-location=us-west1  Creating gce snapshot my-vm-snapshot...done. |
| :---- |

## Migrating to Akamai Linode

Migrating a Google Compute Engine Image to Akamai Linode primarily involves capturing and exporting the instance image from GCP, then resizing and importing it when launching a new Linode Compute Instance. 

### Export your Compute Engine VM Disk image

First, export your VM to a Machine Image using the UI or the CLI. Navigate to **Compute Engine \> Images**.

![][image11]

Click **Create Image** at the top of the page. On the next page, specify a name for your image. Then, find the disk for your VM instance, specifying it as the source disk for the image.

![][image12]

Specify the remaining location and encryption options for your image. Then, click **Create**.

To create an image with the CLI, run the following equivalent command:

| $ gcloud compute images \\     create my-vm-image \\     \--source-disk=instance-20250208-003502 \\     \--source-disk-zone=us-west1-a \\     \--storage-location=us-west1 \\     \--project=gcp-vm-migration-450215Created \[https://www.googleapis.com/compute/v1/projects/gcp-vm-migration-450215/global/images/my-vm-image\].NAME         PROJECT                  FAMILY  DEPRECATED  STATUSmy-vm-image  gcp-vm-migration-450215                      READY |
| :---- |

You can verify the image was created with the following command, inserting the name you specified for the new image:

| $ gcloud compute images list \--filter="name=my-vm-image" NAME         PROJECT                  FAMILY  DEPRECATED  STATUSmy-vm-image  gcp-vm-migration-450215                      READY |
| :---- |

Next, create a Cloud Storage bucket to store your image for downloading. Google has [restrictions on which Cloud Storage bucket locations can export images](https://cloud.google.com/build/docs/locations#restricted_regions_for_some_projects). For bucket location, make sure to choose from the list of allowable regions.

| $ gcloud storage buckets create gs://\<BUCKET-NAME\> \--location=\<REGION\> |
| :---- |

Using the name of the image from above, fill in the following:

| $ gcloud compute images export \\    \--destination-uri=gs://\<BUCKET\_NAME\>/\<IMAGE\_NAME\> \\    \--image=\<IMAGE\_NAME\> \\    \--export-format=\<FORMAT\> \\    \--project=\<PROJECT\_NAME\> |
| :---- |

For \--export-format, use RAW, which is compatible with importing to Linode.

An example run of the export command looks like this:

| $ gcloud compute images export \\    \--destination-uri=gs://migration-vm-images/my-vm-image \\    \--image=my-vm-image \\    \--export-format=RAW \\    \--project=gcp-vm-migration-450215Created \[https://cloudbuild.googleapis.com/v1/projects/gcp-vm-migration-450215/builds/b6d6fbf5-bc51-4228-9ca5-c1b988477fe4\].Logs are available at \[https://console.cloud.google.com/cloud-build/builds/b6d6fbf5-bc51-4228-9ca5-c1b988477fe4?project=133697932277\].\[image-export\]: 2025-02-08T15:39:47Z Fetching image "my-vm-image" from project "gcp-vm-migration-450215".\[image-export-ext\]: 2025-02-08T15:39:48Z Validating workflow\[image-export-ext\]: 2025-02-08T15:39:48Z Validating step "setup-disks"\[image-export-ext\]: 2025-02-08T15:39:48Z Validating step "export-disk"\[image-export-ext.export-disk\]: 2025-02-08T15:39:48Z Validating step "setup-disks"\[image-export-ext.export-disk\]: 2025-02-08T15:39:48Z Validating step "run-export-disk"...\[image-export-ext\]: 2025-02-08T15:39:50Z Uploading sources\[image-export-ext\]: 2025-02-08T15:39:50Z Running workflow\[image-export-ext\]: 2025-02-08T15:39:50Z Running step "setup-disks" (CreateDisks)...\[image-export-ext\]: 2025-02-08T15:42:30Z Step "export-disk" (IncludeWorkflow) successfully finished.\[image-export-ext\]: 2025-02-08T15:42:30Z Running step "delete-disks" (DeleteResources)\[image-export-ext.delete-disks\]: 2025-02-08T15:42:30Z DeleteResources: Deleting disk "disk-image-export-ext".\[image-export-ext\]: 2025-02-08T15:42:30Z Step "delete-disks" (DeleteResources) successfully finished.\[image-export-ext\]: 2025-02-08T15:42:30Z Serial-output value \-\> source-size-gb:10\[image-export-ext\]: 2025-02-08T15:42:30Z Serial-output value \-\> target-size-gb:10\[image-export-ext\]: 2025-02-08T15:42:30Z Workflow "image-export-ext" cleaning up (this may take up to 2 minutes).\[image-export-ext\]: 2025-02-08T15:42:30Z Workflow "image-export-ext" finished cleanup. |
| :---- |

After the job completes, verify the image exists in the bucket:

| $ gcloud storage ls gs://migration-vm-images gs://migration-vm-images/my-vm-image |
| :---- |

Download the image from the command line:

| $ gsutil cp gs://migration-vm-images/my-vm-image . Copying gs://migration-vm-images/my-vm-image...| \[1 files\]\[ 10.0 GiB/ 10.0 GiB\]   22.8 MiB/s                                   Operation completed over 1 objects/10.0 GiB. |
| :---- |

### Resize disk image

The size of persistent disks from GCP have a minimum size of 10 GB. Therefore, your downloaded image file might be around this size.

| $ du \-BM my-vm-image 10241M	my-vm-image |
| :---- |

As noted earlier, images imported into Akamai Linode must be smaller than 6 GB unzipped and 5 GB zipped. If you know that your actual disk usage within the image is within those limits, then you can shrink the size of the disk image file by deallocating unused disk space and truncating the disk size.

Shrinking the disk image size involves using [GParted](https://gparted.org/), [fdisk](https://tldp.org/HOWTO/Partition/fdisk_partitioning.html), and [qemu-img](https://qemu-project.gitlab.io/qemu/tools/qemu-img.html) on your local machine.

1. Because GParted works on devices (not images), create a [loopback device](https://wiki.osdev.org/Loopback_Device) for the image. Run the following commands, using the path to the newly created loopback device and the name of your image file.

| \# Enable loopback $ sudo modprobe loop\# Create a loopback device, return its path$ sudo losetup \-f/dev/loop48 \# Create a device with the disk image$ sudo losetup /dev/loop48 my-vm-image \# Load the image partitions $ sudo partprobe /dev/loop48\# Backup the GUID Partition Table (GPT) $ sudo sgdisk \-b gpt-backup.bin my-vm-image |
| :---- |

2. Run GParted on the device.

| $ sudo gparted /dev/loop48 |
| :---- |

![][image13]

In GParted, notice how there is unused space in the file system partition. Select that partition, then select **Partition \> Resize/Move**.

![][image14]

Shrink down the data partition to remove most of the unused space. 

![][image15]

Click **Resize/Move**, and then click the green checkmark to apply this change.

![][image16]

Close GParted.

3. Shrink the partition table to match the last used partition:

| $ sudo sgdisk \--set-alternative-lba my-vm-image |
| :---- |

   

4. Use [qemu-img](https://qemu-project.gitlab.io/qemu/tools/qemu-img.html) to shrink the disk image file, eliminating the unallocated space while still fitting the partitions. A quick sum of the partition sizes from looking at GParted above shows the disk image will need approximately 5.5 GB of space. Shrink the image accordingly, adding some buffer space if desired.

| $ qemu-img resize \-f raw \--shrink my-vm-image 5.8G |
| :---- |

5. Recreate the partition table headers using [gdisk](https://linux.die.net/man/8/gdisk). Use the following commands:

* x: Navigate to extra functionality  
* e: Relocate the backup GPT structure to the back of the disk.  
* w: Write the partition table to disk and exit. (Then Y to confirm.)

| $ sudo gdisk my-vm-image…Command (? for help): x  Expert command (? for help): e Relocating backup data structures to the end of the disk Expert command (? for help): w  Final checks complete. About to write GPT data. THIS WILL OVERWRITE EXISTING PARTITIONS\!\! Do you want to proceed? (Y/N): Y OK; writing new GUID partition table (GPT) to gmy-vm-image. Warning: The kernel is still using the old partition table. The new table will be used at the next reboot or after you run partprobe(8) or kpartx(8) The operation has completed successfully. |
| :---- |

The resulting size of the disk image file is smaller, within the size constraints for importing into Akamai Linode.

| $ du \-BM my-vm-image 5940M	my-vm-image |
| :---- |

6. Unload the loopback device to clean up.

| $ sudo losetup \-d /dev/loop48 |
| :---- |

For a deeper dive into this image-shrinking technique, see “[Shrinking images on Linux](https://softwarebakery.com//shrinking-images-on-linux).”

### Import and deploy VM image on Akamai Linode

To provision a Linode Compute Instance by importing an existing VM image, ensure the image is in the proper format and compressed with gzip.

#### Prepare image file for import

You may have already named the image file above with the .raw file extension or nothing. Linode requires an image file to have a .img extension. The naming convention does not have a functional difference; simply rename the file to use the .img extension, and it will be ready for import.

| $ mv my-vm-image my-vm-image.img |
| :---- |

Compress the image using gzip to reduce its size:

| $ gzip my-vm-image.img$ du \-BM my-vm-image.img.gz  1060M	my-vm-image.img.gz |
| :---- |

#### Upload the compressed IMG file to Akamai Linode

Use the Linode CLI to upload the compressed image file. Replace the .gz file with your specific file name. Specify the label, description, and region based on your use case.

| $ linode-cli image-upload \\    \--label "gcp-vm-migration" \\    \--description "GCP VM Import" \\    \--region "us-lax" \\    ./my-vm-image.img.gz `┌-----------------------┬-----------┬----------------┐ │ label                 │ is_public │ status         │ ├-----------------------┼-----------┼----------------┤ │ gcp-vm-migration      │ False     │ pending_upload │ └-----------------------┴-----------┴----------------┘` |
| :---- |

The upload may take several minutes, depending on your image's size and internet speed.

#### Verify the successful image upload

After the upload, ensure the image is successfully processed and available for use. Run the following command to list your private images:

| $ linode-cli images list \--is\_public false  ┌------------------┬-----------------------┬-----------┬--------┐ │ id               │ label                 │ status    │ size   │ ├------------------┼-----------------------┼-----------┼--------┤ │ private/30127625 │ gcp-vm-migration      │ available │ 5940   │ └------------------┴-----------------------┴-----------┴--------┘ |
| :---- |

Verify that the status of the image is available. If the status is pending, wait a few minutes and then check again.

You can also watch the progress of the image ingestion via the Linode Images dashboard:

![][image17]

#### Launch a Linode Compute Instance from the uploaded image

Once the image is available, you can deploy it to a new Linode Compute instance. For this command, provide the ID of your uploaded image, which was displayed when running the previous command. In addition, provide the following:

* \--label: A unique label for your instance.  
* \--region: The region for your instance.  
* \--type: The size of the instance to deploy.  
* \--root\_pass: A unique, secure root password for your new instance.

The following example deploys a g6-standard-2 Linode with two cores, 80 GB disk, and 4 GB RAM with a 4000 Mbps transfer rate. Recall that the original GCP VM instance for this migration is a e2-medium, which has 2 CPUs and 4 GiB RAM. Therefore, the g6-standard-2 Linode instance is comparable.

See the [pricing page for Akamai Connected Cloud](https://www.linode.com/pricing/#compute-shared) for details on different Linode types.

| $ linode-cli linodes create \\    \--image \<image-id\> \\    \--label "migrated-from-gcp" \\    \--region "us-lax" \\    \--type "g6-standard-2" \\    \--root\_pass "thisismysecurerootpassword"  ┌-----------------------┬--------┬---------------┬--------------┐ │ label                 │ region │ type          │ status       │ ├-----------------------┼--------┼---------------┼--------------┤ │ migrated-from-gcp     │ us-lax │ g6-standard-2 │ provisioning │ └-----------------------┴--------┴---------------┴--------------┘ |
| :---- |

After several minutes, your Linode Compute Instance will be up and running based on the exported VM image from your original cloud provider.

By default, Linode boots instances with its own kernel. However, you should use the kernel inside your image when booting it up. This can be done in the Linode dashboard. Navigate to your Linode Compute Instance. Click the **Configurations** tab at the bottom. Then, click **Edit**.

![][image18]

Under **Boot Settings**, select **Direct Disk** as the kernel.

![][image19]

Click **Save Changes**. Then, **reboot** your Linode.

![][image20]

After several minutes, your Linode Compute Instance will be up and running, based on the exported VM image from your original cloud provider.

### Configure and validate the Linode instance

By migrating via a disk image that fully captures your GCP VM and disk, you ensure that the operating system and all installed software and services are on the newly provisioned Linode. This reduces the time needed to configure the Linode instance to closely match the environment of the original VM.

However, you must perform steps to configure networking to align with your needs. Recall the configurations from your original GCP Compute Engine VM:

* [IP addresses](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance)  
* [Firewall rules](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-cloud-firewalls)  
* [Load balancing](https://techdocs.akamai.com/cloud-computing/docs/nodebalancer)  
* [DNS](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-dns-manager)

Linode does not have a direct equivalent to GCP security groups. However, you can still implement a firewall with rules to control traffic. Options include:

* [Linode Cloud Firewall](https://techdocs.akamai.com/cloud-computing/docs/cloud-firewall), for setting up inbound and outbound rules on Linode Compute Instances, either through the Linode API or the Linode CLI.  
* [iptables](https://www.linode.com/docs/guides/control-network-traffic-with-iptables/) or [ufw](https://www.linode.com/docs/guides/configure-firewall-with-ufw/), which run from within the Linode instance to manage the Linux kernel firewall (Netfilter).

Akamai Linode provides [NodeBalancers](https://www.linode.com/products/nodebalancers/), which are equivalent to GCP’s HTTPS LoadBalancers. If you are migrating a Compute Engine VM with an HTTPS LoadBalancer, you can implement a similar configuration for your Linode.

If you used Cloud DNS to implement DNS rules to route traffic to your VM, then you will need to modify your DNS settings to ensure traffic routes to your new Linode instance. This may involve pointing nameservers to Akamai Linode and creating DNS rules within the Akamai Cloud Manager.

After completing your configurations, test your Linode instance to verify that the migration was successful. Validation steps may include:

* **Check running services**. Ensure that all critical services, such as web servers, databases, and application processes are running as expected and configured to start on boot.  
* **Test application functionality**. Access any applications on the new Linode through their web interface or API endpoints to confirm that they behave as expected, including core functionality and error handling.  
* **Inspect resource utilization**. Monitor CPU, memory, and disk usage on the Linode to ensure the system performs within acceptable thresholds post-migration.  
* **Validate DNS configuration**. Ensure DNS changes (if made) are propagating correctly, pointing to your Linode instance, and resolving to the expected IP addresses.  
* **Check external connectivity**. Verify that the instance can access any required external resources, such as third-party APIs, databases, or storage, and that outbound requests succeed.  
* **Review logs**. Examine system and application logs for errors or warnings that might indicate migration-related issues.  
* **Backup and snapshot functionality**. Confirm that backups and snapshots can be created successfully on Linode to safeguard your data post migration.  
* **Verify externally attached storage**: Ensure that any additional storage volumes, block devices, or network-attached storage are properly mounted and accessible. Check /etc/fstab entries and update disk mappings as needed.

## Additional Considerations

### Cost management

Review the pricing for your current GCP Compute Engine VM instance ([compute](https://cloud.google.com/compute/vm-instance-pricing?hl=en), [storage](https://cloud.google.com/compute/disks-image-pricing?hl=en#tg1-t0), and [bandwidth](https://cloud.google.com/vpc/network-pricing?hl=en)). Compare this with the [pricing plans for Akamai Connected Cloud](https://www.linode.com/pricing/). Use [Akamai’s Cloud Computing Calculator](https://www.linode.com/cloud-computing-calculator/) to estimate potential costs.

### Data consistency and accuracy

Verify that the Linode migrated from the image export contains all necessary files, configurations, and application data. Double-check for corrupted or missing files during the image export and upload process. Verification steps may include:

* **Generate and compare file checksums**: Use tools like md5sum to generate checksums of critical files or directories on both the source VM and the migrated Linode. Ensure the checksums match to confirm data integrity.  
* **Count files and directories**: Use find or ls commands to count the number of files and directories in key locations (for example: find /path \-type f | wc \-l). Compare these counts between the source and destination to identify any discrepancies.  
* **Check application logs and settings**: Compare configuration files, environment variables, and application logs between the source and the destination to confirm they are identical or appropriately modified for the new environment. Common locations to review may include:

| Application | Configuration | Location |
| :---- | :---- | :---- |
| **Apache Web Server** | Main | /etc/apache2/apache2.conf |
|  | Virtual hosts | /etc/apache2/sites-available /etc/apache2/sites-enabled |
| **NGINX Web Server** | Main | /etc/nginx/nginx.conf |
|  | Virtual hosts | /etc/nginx/sites-available/etc/nginx/sites-enabled |
| **Cron** | Application | /etc/cron.d |
|  | System-wide cron jobs | /etc/crontab |
|  | User-specific cron jobs | /var/spool/cron/crontabs |
| **MySQL/MariaDB** | Main | /etc/mysql |
| **PostgreSQL** | Main | /etc/postgresql |
| **SSH** | Main | /etc/ssh/sshd\_config |
| **Networking** | Hostname | /etc/hostname |
|  | Hosts file | /etc/hosts |
| **Rsyslog** | Main | /etc/rsyslog.conf |


* **Review symbolic links and permissions**: Use CLI tools and commands to confirm that symbolic links and file permissions on the migrated Linode match those on the source VM. Examples include:

| Description | Command |
| :---- | :---- |
| List all symbolic links in folder (recursive) | **ls \-Rla /path/to/folder | grep "\\-\>"** |
| Calculate md5 hash for all files in a folder, then sort by filename and write to file. Then, compare files from both VMs using diff. | **find /path/to/folder/ \-type f \\  \-exec md5sum {} \+ \\  | sort \-k 2 \> hashes.txt** |
| Write to file the folder contents (recursive) with permissions, owner name, and group name. Then, compare permissions files from both VMs using diff. | **tree /path/to/folder \-fpuig \> permissions.txt** |


After deploying your Linode, confirm that configurations (network settings, environment variables, and application dependencies) match the original VM to avoid runtime issues.

### Security and access controls

GCP IAM roles govern instance access. Migrate these roles and permissions to Linode by setting up Linode API tokens and fine-tuning user permissions.

Use the Linode Cloud Firewall or existing system firewall on your instance to restrict access. Ensure SSH keys are properly configured, and disable root login if not required. Map GCP security group policy rules to your firewall for consistent protection.

### Alternative migration options

This guide covered migrating a VM by creating a disk image of the original GCP Compute Engine VM instance and importing that image to Akamai Linode as the basis of a new Linode Compute Instance. When cloud provider restrictions or image size limits make this approach unavailable, consider other migration options, including:

* **Rclone**: For example, provision a Linode Compute Instance with resource levels comparable to your original VM. Then, use [rclone](https://rclone.org/)—a command line utility for managing files in cloud storage—to move all data from your original VM to your new Linode. This can effectively move your workloads from your GCP VM to your Linode.

* **IaC**: You can also leverage infrastructure-as-code (IaC) and configuration management tools to streamline your migration process. Tools like [Ansible](https://docs.ansible.com/ansible/latest/index.html), [Terraform](https://www.terraform.io/), [Chef](https://www.chef.io/products/chef-infra), and [Puppet](https://www.puppet.com/why-puppet/use-cases/continuous-configuration-automation) can help you automatically replicate server configurations, deploy applications, and ensure consistent settings across your source and destination VMs. By using these tools, you can create repeatable migration workflows that reduce manual intervention and minimize the risk of configuration errors during the transition.

* **Containerization**: Another option is to containerize any workloads on your original VM. These containerized images can be run in the Akamai Connected Cloud. For example, you can provision a [Linode Kubernetes Engine (LKE)](https://techdocs.akamai.com/cloud-computing/docs/linode-kubernetes-engine) cluster to host and run these containers, thereby removing the need for a VM.

## Resources

GCP

* [GCP CLI Documentation](https://cloud.google.com/sdk/docs)  
* [GCP Export Custom Image](https://cloud.google.com/compute/docs/images/export-image)  
* [VM Migration Guide](https://cloud.google.com/migrate/virtual-machines/docs/5.0/reference/rest/v1)  
* [Regions with Build Capabilities](https://cloud.google.com/build/docs/locations#restricted_regions_for_some_projects)  
* [Troubleshooting VM Export and Import](https://cloud.google.com/compute/docs/troubleshooting/troubleshooting-import-export-images)

Akamai Linode

* [Linode CLI and Object Storage](https://techdocs.akamai.com/cloud-computing/docs/using-the-linode-cli-with-object-storage)  
* [Uploading an image](https://techdocs.akamai.com/cloud-computing/docs/upload-an-image)  
* [Deploying an Image](https://techdocs.akamai.com/cloud-computing/docs/deploy-an-image-to-a-new-compute-instance)

Other helpful utilities

* [QEMU Disk Imaging Utility](https://www.qemu.org/download/)  
* [rclone](https://rclone.org/)  
* [Shrinking images on Linux](https://softwarebakery.com//shrinking-images-on-linux)