---
slug: migrate-disk-image-using-cloud-init
title: "Migrate a Disk Image to Akamai Cloud Using Cloud-Init"
description: "This guide provides steps and configurations for migrating and deploying a disk image to a new Linode instance using cloud-init."
authors: ["John Dutton","Abe Massry"]
contributors: ["John Dutton","Abe Massry"]
published: 2025-07-30
keywords: ['cloud-init','migrate','migration','disk image','aws','azure','google cloud','gcp','metadata']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Linode API & CLI Documentation](https://techdocs.akamai.com/linode-api/reference/api)'
- '[Akamai Cloud-Init Guides](/docs/guides/applications/configuration-management/cloud-init/)'
- '[Cloud-Init Official Documentation](https://cloudinit.readthedocs.io/en/latest/)'
---

The ability to migrate a virtual machine’s disk image across cloud providers is essential to cloud architecture durability and a key component of multi-cloud portability. There are numerous methods of migrating a disk image, several of which can be found in our documentation library: [Migrate to Linode](/docs/guides/platform/migrate-to-linode/)

This tutorial includes steps for deploying a disk image to a new compute instance using *cloud-init* and the Ubuntu 24.04 LTS distribution. Cloud-init is an industry standard configuration tool that helps automate the configuration of new compute instances upon initial boot.

The method in this guide uses Object Storage on Akamai Cloud for disk image storage, and provides a custom cloud-init configuration compatible with Akamai’s Metadata service.

## How It Works

Cloud-init configuration files act as a setup script that a compute instance reads during the initial boot process. During this process, metadata or other user-provided data (i.e. a custom disk image) is sourced and applied to the instance.

The cloud-init configuration provided in this guide uses the Linux `pivot_root` function to swap the standard root file system for the new instance’s RAM disk, where it can temporarily store a custom disk image sourced from an object storage bucket via signed URL. The original root disk is remounted upon reboot.

In order for the cloud-init script to function, the RAM disk of your new instance must be larger than the provided custom disk image file. Once the Linode is booted and the disk image is successfully loaded, the instance can be optionally downsized to a smaller plan with less RAM.

## Before You Begin

The following prerequisites are required for completing the steps in this guide:

-   An Akamai Cloud account with permissions in place for managing Object Storage and Compute Instances

-   Access to your AWS cloud platform account with sufficient permissions to work with AWS EC2 instances, IAM (Identity and Access Management), Images, and s3. The AWS CLI must also be installed and configured.

-   The [Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/getting-started-with-the-linode-cli) installed and configured for use with your Akamai Cloud account

-   An Object Storage bucket and valid access key for storing and accessing your disk image file

-   The [s3cmd](https://techdocs.akamai.com/cloud-computing/docs/using-s3cmd-with-object-storage) command line utility installed and configured to interact with your Object Storage bucket and region

### Disk Image Requirements

There are several requirements that must be met for your disk image to successfully run on a Linode instance. See our documentation for guidance on [setting up](https://techdocs.akamai.com/cloud-computing/docs/upload-an-image#set-up-an-image-file) or obtaining an image file. The process for acquiring a disk image may vary depending on the cloud provider you are migrating from (i.e. AWS, Azure, Google Cloud, etc.).

-   **Image size**: The total size of your disk image should be lower than the RAM disk size of your new compute instance. For example, if your disk image file is 12GB, your new instance should have 16GB of RAM available. If necessary, your new instance can be resized to a smaller plan size afterwards.

-   **Linux kernel**: It is recommended to use a platform-agnostic kernel such as the distro-provided kernel with GRUB 2 as the bootloader - rather than a provider-optimized kernel (i.e. [Amazon Linux](https://docs.aws.amazon.com/linux/) kernels). This helps avoid any platform-based dependencies or compatibility issues.

-   **Disk format and partitions**: The disk must use the ext3 or ext4 file system in order to be compatible. The cloud-init configuration provided in this guide only supports non-partitioned disk images.

-   **File type**: Your disk image can be either in uncompressed `.img` or compressed `.gz` (gzip) format. At the time of this writing, `.iso` image files are not supported.

{{< note >}}
The provided cloud-init configuration uses a file’s metadata to gather information and does not look for specific file extensions.
{{< /note >}}

If you are using a disk image that requires direct disk to boot (i.e. an image with partitioned disks or a Master Boot Record, or MBR), you may need to take additional steps to configure your system before image creation or after deployment for full compatibility with the Akamai Cloud platform. See our guide on [Installing a Custom Distribution](/docs/guides/install-a-custom-distribution/#make-the-system-compatible-with-the-linode-platform) for guidance and configuration options for a direct disk image.

## Upload a Disk Image to Object Storage

{{< note title ="Create an Object Storage Bucket" >}}
If you haven’t done so already, [create an Object Storage bucket](https://techdocs.akamai.com/cloud-computing/docs/create-and-manage-buckets) in which to store your disk image.
{{< /note >}}

The Object Storage item upload limit is 5GB. This is the same as our [Custom Image upload limit](https://techdocs.akamai.com/cloud-computing/docs/upload-an-image). If using an uncompressed or compressed disk image larger than 5GB, you must use an alternative tool such as s3cmd when uploading your image file.

You can optionally compress your disk image file using the following gzip command. The `-9` flag [regulates the speed](https://linux.die.net/man/1/gzip) of compression by running at a slower speed while maintaining the highest quality:

```command
gzip -9 {{< placeholder "exampleimage.img" >}}
```

### Upload Using Cloud Manager

1.  While logged into Cloud Manager, select **Object Storage** from the side bar.

1.  Select your bucket.

1.  Drop and drag your disk image file, or click **Browse Files** to select the file from your local machine.

### Upload Using the Linode CLI

1.  Confirm access to your account by viewing a list of available buckets. If prompted, specify your bucket region (i.e. `us-east-1`):

    ```command
    linode-cli obj ls
    ```

    ```output
    2025-07-16 18:37  {{< placeholder "bucket1" >}}
    ```

1.  Upload your disk image file to your bucket, replacing {{< placeholder "exampleimage.img" >}} with the your disk image and {{< placeholder "bucket1" >}} with your bucket name:

    ```command
    linode-cli obj put --acl-public {{< placeholder "exampleimage.img" >}} {{< placeholder "bucket1" >}}
    ```

1.  Confirm the upload using the `ls` function:

    ```command
    linode-cli obj ls {{< placeholder "bucket1" >}}
    ```

### Upload Using s3cmd

1.  Confirm your s3cmd utility is configured to interact with your destination bucket by listing the available buckets:

    ```command
    s3cmd ls
    ```

    ```output
    2025-07-16 18:37  s3://{{< placeholder "bucket1" >}}
    ```

1.  Upload your disk image using the `s3cmd put` command:

    ```command
    s3cmd put {{< placeholder "exampleimage.img" >}} s3://{{< placeholder "bucket1" >}}/
    ```

    s3cmd uses multi-part uploading for objects over a certain size. Allow this process to complete for the upload to finish:

    ```output
    upload: '/path/to/image/{{< placeholder "exampleimage.img" >}}' -> 's3:/{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}}'  [part 1 of 80, 15MB] [1 of 1]
    15728640 of 15728640   100% in    1s    10.46 MB/s  done
    upload: '/path/to/image/{{< placeholder "exampleimage.img" >}}' -> 's3://{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}}'  [part 2 of 80, 15MB] [1 of 1]
    15728640 of 15728640   100% in    1s    13.66 MB/s  done
    upload: '/path/to/image/{{< placeholder "exampleimage.img" >}}' -> 's3:/{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}}'  [part 3 of 80, 15MB] [1 of 1]
    15728640 of 15728640   100% in    1s    14.60 MB/s  done
    ...
    ```

1.  Confirm presence of the disk image file in your bucket:

    ```command
    s3cmd ls s3://{{< placeholder "bucket1" >}}
    ```

    ```output
    2025-07-16 22:11  26289897472  s3://{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}}
    ```

## Create a Signed URL for the Disk Image

Signed URLs create a web link to specific objects in a bucket while limiting permission and applying a defined time limit for access.

Use the following command to create a signed URL for your disk image [with the Linode CLI](https://techdocs.akamai.com/cloud-computing/docs/using-the-linode-cli-with-object-storage#create-a-signed-url-with-the-cli). Replace `{{< placeholder "bucket1" >}}` with your bucket name, and `{{< placeholder "exampleimage.img" >}}` with the name of your disk image. Replace `1000` (~16 minutes) with the number of seconds you wish to allow access to your object:

```command {title="Linode CLI"}
linode-cli obj signurl {{< placeholder "bucket1" >}} {{< placeholder "exampleimage.img" >}} +1000
```

Alternatively, if you wish to create a signed URL for your disk image [using s3cmd](https://techdocs.akamai.com/cloud-computing/docs/using-s3cmd-with-object-storage#create-a-signed-url-with-s3cmd), use the following command, replacing the same values as above:

```command {title="s3cmd"}
s3cmd signurl s3://{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}} +1000
```

This generates output in the form of a signed URL. Note that the below URL has been scrubbed of identifying information and is invalid:

```output
https://us-east-1.linodeobjects.com/{{< placeholder "bucket1" >}}/{{< placeholder "exampleimage.img" >}}?AWSAccessKeyId=ABCNLJNAESNMPEE8N123&Signature=2cxU6qOKE2%2BjADFNRrdb1lMWubI%3D&Expires=1752849789
```

Save your signed URL somewhere secure so that it can be used in the cloud-init configuration in the following section.

## Deploy an Instance Using Your Disk Image

1.  While in Cloud Manager, select **Linodes** from the side bar, and click **Create Linode**.

1.  Use the following parameters as guidelines when creating your Linode instance:

    - **Region**: The same region as your Object Storage bucket (optional).
    - **Linux Distribution**: Ubuntu 24.04 LTS
    - **Linode Plan**: Select a compute plan with a larger RAM disk than your disk image size. For example, if your disk image is 25GB, select a Linode plan with 32GB RAM. The cloud-init script used in this guide swaps out the root boot disk and uses your new instance’s RAM disk to temporarily house your uploaded disk image. After your new instance is up and running, you can optionally downsize your Linode to a smaller plan with less RAM.

    {{< note title="Linode Plan Size Minimum" >}}
    A [Linode plan](https://www.linode.com/pricing/) with a minimum of 16GB RAM is recommended for the cloud-init configuration to successfully run.
    {{< /note >}}

1.  Under **Add User Data**, insert the following cloud-init config file contents in the **User Data** field. Make sure the config appears exactly as displayed below with no leading or trailing spaces.

    In the line `mount none /tmp/tmproot -t tmpfs -o size=30G` (row 9), adjust the temporary disk size in accordance with your chosen RAM disk size. Make sure to specify a smaller `tempfs` (temporary file system) than your total RAM. It must be large enough to hold the cloud-init Ubuntu OS and disk image coming from Object Storage, and small enough that it doesn’t use up all the RAM available. Generally this means a `tempfs` 2-4GB smaller than your total plan RAM size.

    For example, if your Linode plan has 64GB of RAM and your disk image size is between 30GB and 60GB (i.e. 48GB), change the disk size to `60G`. This allows for some extra room between your disk image size and the total RAM disk. The `30G` example in the script assumes your disk image is large enough to require a plan size of 32GB.

    Replace the `SIGNED_URL` placeholder in the `wget` command (row 13) with the signed URL for your disk image generated in the previous section:

    ```file {title="cloud-init config" hl_lines="9 13"}
    #cloud-config
    write_files:
        - path: /run/scripts/test-script.sh
          content: |
            #!/bin/bash
            echo 'making directory /tmp/tmproot' >&2
            mkdir /tmp/tmproot
            echo 'mounting tmpfs to /tmp/tmproot' >&2
            mount none /tmp/tmproot -t tmpfs -o size={{< placeholder "30G" >}}
            echo 'changing directory to /tmp/tmproot' >&2
            cd /tmp/tmproot
            echo 'downloading signed image from object storage' >&2
            wget "{{< placeholder "SIGNED_URL" >}}" -O /tmp/tmproot/signed_image.img
            filename="signed_image.img"
            if [[ $(file -b signed_image.img) == *gzip* ]]; then
                echo 'detected a compressed file gzip' >&2
                mv signed_image.img signed_image.img.gz
                filename="signed_image.img.gz"
            fi
            echo 'running telinit 2 to switch to runlevel 2' >&2
            telinit 2
            echo 'making directories in /tmp/tmproot' >&2
            mkdir /tmp/tmproot/{proc,sys,usr,var,oldroot}
            echo 'copying files to /tmp/tmproot' >&2
            cp -ax /{bin,etc,mnt,sbin,lib} /tmp/tmproot/
            echo 'copying directories to /tmp/tmproot/usr' >&2
            cp -ax /usr/{bin,sbin,lib} /tmp/tmproot/usr/
            echo 'copying directories to /tmp/tmproot/var etc.' >&2
            cp -ax /var/{account,empty,lib,local,lock,nis,opt,preserve,run,spool,tmp,yp} /tmp/tmproot/var/
            echo 'copying directories to /tmp/tmproot/dev' >&2
            cp -a /dev /tmp/tmproot/dev
            echo 'copying directories to /tmp/tmproot/run' >&2
            cp -ax /run /tmp/tmproot/
            echo 'copying directories to /tmp/tmproot/lib64 and /tmp/tmproot/usr/lib64' >&2
            cp -ax /lib64 /tmp/tmproot/
            cp -ax /usr/lib64 /tmp/tmproot/usr/
            echo 'mount make-rprivate /' >&2
            mount --make-rprivate /
            echo 'pivoting root to /tmp/tmproot' >&2
            pivot_root /tmp/tmproot/ /tmp/tmproot/oldroot
            echo 'mounting none /proc -t proc' >&2
            mount none /proc -t proc
            echo 'mounting none /sys -t sysfs' >&2
            mount none /sys -t sysfs
            echo 'mounting none /dev/pts -t devpts' >&2
            mount none /dev/pts -t devpts
            echo 'moving mounts from /oldroot to /' >&2
            for i in dev proc sys run; do mount --move /oldroot/$i /$i; done
            echo 'telinit u to switch to runlevel 1' >&2
            telinit u
            echo 'systemctl isolate rescue.target' >&2
            systemctl isolate default.target
            echo '#!/bin/bash' > /tmp/test-script-cont.sh
            chmod +x /tmp/test-script-cont.sh
            echo 'exec >/dev/ttyS0 2>&1' >> /tmp/test-script-cont.sh
            echo 'cd /' >> /tmp/test-script-cont.sh
            echo 'echo "started sub script"' >> /tmp/test-script-cont.sh
            echo 'pids=$(fuser -vm /oldroot | xargs | sed "s/kernel //") >> /tmp/test-script-cont.sh'
            echo 'echo "got pids: $pids"' >> /tmp/test-script-cont.sh
            echo 'kill $pids' >> /tmp/test-script-cont.sh
            echo 'echo "killed pids"' >> /tmp/test-script-cont.sh
            echo 'umount /oldroot' >> /tmp/test-script-cont.sh
            echo 'echo "umounted /oldroot"' >> /tmp/test-script-cont.sh
            # if filename matches gzip, decompress it
            if [[ $filename == "signed_image.img.gz" ]]; then
                echo 'echo "detected a compressed file gzip"' >> /tmp/test-script-cont.sh
                echo 'which gzip' >> /tmp/test-script-cont.sh
                echo 'gzip -cd signed_image.img.gz | dd of=/dev/sda status=progress' >> /tmp/test-script-cont.sh
            else
                echo 'dd if=signed_image.img of=/dev/sda status=progress' >> /tmp/test-script-cont.sh
            fi
            echo 'echo "dd finished about to reboot"' >> /tmp/test-script-cont.sh
            echo 'reboot' >> /tmp/test-script-cont.sh
            nohup bash -c /tmp/test-script-cont.sh &
          permissions: '0755'

    runcmd:
      - [ bash, "/run/scripts/test-script.sh" ]
    ```

1.  Finish selecting your Linode instance parameters, and click **Create Linode**. Depending on the contents and configuration of your disk image, this may take some time to complete. You can monitor the status of your instance’s deployment using the [Lish console](https://techdocs.akamai.com/cloud-computing/docs/access-your-system-console-using-lish).

1.  Once fully booted, log into your new Linode instance using the default user (`root`), replacing {{< placeholder "IP_ADDRESS" >}} with the IPv4 of your Linode:

    ```command
    ssh root@{{< placeholder "IP_ADDRESS" >}}
    ```

1.  Complete the steps in our [Set Up and Secure a Linode](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to secure your instance, including updating your system, adding a limited sudo user, hardening SSH access with public key authentication, and configuring a firewall.

{{< note title="Disk Name" >}}
Once the process is complete, the Linode instance's configuration displays the disk name as “Ubuntu 24.04” in Cloud Manager upon first boot regardless of the incoming operating system used by the origin disk. The *actual* operating system on the instance will match that of the incoming disk image. The configuration can be renamed within the Cloud Manager interface.
{{< /note >}}

## Resizing the Instance

Since the cloud-init script initially requires a larger amount of RAM, you may find yourself with more RAM than your use case requires. You can optionally resize your instance to a smaller Linode plan size to reduce unnecessary compute resources and lower billing cost. When downsizing, remember to select a Linode plan with enough CPU, RAM, and storage to support your original workload.

See our [Resize a Linode](https://techdocs.akamai.com/cloud-computing/docs/resize-a-compute-instance) guide for instructions on how to change your Linode plan.