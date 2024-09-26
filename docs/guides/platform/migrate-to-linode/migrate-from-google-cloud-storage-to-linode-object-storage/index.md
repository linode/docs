---
slug: migrate-from-google-cloud-storage-to-linode-object-storage
title: "How to Migrate From Google Cloud Storage to Linode Object Storage"
description: "This guide includes steps for how to migrate content from Google Cloud Storage to Linode Object Storage using rclone."
authors: ["John Dutton"]
contributors: ["John Dutton"]
published: 2024-09-23
keywords: ['migrate','migration','object storage','google cloud storage','rclone']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Linode Object Storage product documentation](https://techdocs.akamai.com/cloud-computing/docs/object-storage)'
- '[Linode Object Storage guides & tutorials](/docs/guides/platform/object-storage/)'
---

Linode Object Storage is an S3-compatible service used for storing large amounts of unstructured data. This guide includes steps on how to migrate less than 100TB of static content from Google Cloud Storage to Linode Object Storage using rclone, along with how to monitor your migration using rclone’s WebUI GUI.

## Migration Considerations

-   **Migration time:** Migration time varies depending on various factors, including: the size and type of data being copied, the number of overall objects, network conditions, and the hardware limits of the infrastructure involved (i.e. bandwidth and throughput limits, network interfaces, CPU cores, RAM, etc.).

-   **Egress:** Egress is the measurement of outbound data being transferred and often results in a cost to the user. Egress costs may vary depending on provider rates and the amount of data being transferred. See your provider for specific egress rates.

-   **Bucket architecture:** The example in this guide shows steps for migrating content from a single Google Cloud Storage bucket with a standard storage class to a single bucket on Akamai.

    Migrating content and changing over workloads intermittently is recommended to ensure maximum uptime and reliability.

-   **Multiple machines running in parallel:** This guide provides steps for initiating and monitoring a single rclone copy job for a single object storage bucket. One option for speeding up a distributed workload migration is to run multiple rclone instances to migrate multiple buckets at the same time.

    See Linode Object Storage’s [technical specifications](https://techdocs.akamai.com/cloud-computing/docs/object-storage#technical-specifications-and-considerations) for rate and bandwidth limits if you are running multiple virtual machines in parallel.

-   **Large amounts of data:** This guide assumes you are migrating less than 100 million objects and 100TB of static data. If you require a larger amount of data transferred, contact our [sales](https://www.akamai.com/why-akamai/contact-us/contact-sales) and [professional services](https://www.akamai.com/site/en/documents/akamai/akamai-professional-services-and-support.pdf) teams.

## Migration Architecture Diagram

There are two architecture options for completing a data migration from Google Cloud Storage to Linode Object Storage. One of these architectures is required to be in place prior to initiating the data migration:

**Architecture 1:** Utilizes a Google VM instance running rclone in the same region as the source Cloud Storage bucket. Data is transferred internally from the Cloud Storage bucket to the VM instance and then over the public internet from the VM instance to the target Linode Object Storage bucket.

-   **Recommended for:** speed of transfer, users with Google Cloud platform familiarity

**Architecture 2:** Utilizes a Linode instance running rclone in the same region as the target Object Storage bucket. Data is transferred over the public internet from the Google Cloud Storage bucket to the Linode instance and then internally via IPv6 to the Linode Object Storage bucket.

-   **Recommended for:** ease of implementation, users with Akamai platform familiarity

{{< note title="Rclone performance" >}}
Rclone generally performs better when placed closer to the source data being copied. During testing for both architectures, Architecture 1 consistently achieved a higher transfer speed than Architecture 2.
{{< /note >}}

### Architecture 1

1.  A source Google Cloud Storage bucket with the content to be transferred.

1.  A Google VM instance running rclone in the same region as the source Cloud Storage bucket. The Cloud Storage bucket communicates with the VM instance via VPC within the Google region.

    By default, Google Cloud offers a global VPC with pre-established subnets by region. Your VPC must be configured with [Private Google Access](https://cloud.google.com/vpc/docs/private-google-access) to establish a private connection between Google Cloud Storage and your VM instance

1.  Data is copied across the public internet from the Google VM instance to a target Linode Object Storage bucket. This results in egress (outbound traffic) being calculated by Google Cloud.

1.  The target Linode Object Storage bucket receives data from the Google VM instance. The migration status can be monitored using rclone’s WebUI.

![GCS-to-OBJ-Arch1](GCS-to-OBJ-Arch1.png)

### Architecture 2

1.  A source Google Cloud Storage bucket with the content to be transferred.

1.  A Compute Instance running rclone in the same Akamai core compute region as the target Linode Object Storage bucket.

1.  Data is copied across the public internet from the Google Cloud Storage bucket to the target Linode instance. This results in egress being calculated by Google Cloud.

1.  The target Linode Object Storage bucket receives the data via IPv6 from the Compute Instance on the region’s private network. Inbound, private IPv6 data to Linode Object Storage is free of charge. The migration status can be monitored using rclone’s WebUI.

![GCS-to-OBJ-Arch2](GCS-to-OBJ-Arch2.png)

## Prerequisites and Required Information

-   **A virtual machine with rclone installed**. This guide recommends a 16GB dedicated virtual machine with 8 CPU cores. The plan you require may vary depending on your workload.

-   The **public IPv4 address** of your virtual machine.

-   As a security best practice, **use a firewall to only allow inbound port 5572**. This is the default port used by rclone and enables secure access to the WebUI since it is served over HTTP.

-   **An up-to-date web browser**. This is used to access the rclone WebUI while monitoring the migration.

-   **SSH access to the virtual machine** with sudo user privileges.

-   A **Google Cloud [Service Account](https://cloud.google.com/iam/docs/service-account-overview)**, including:

    -   A preconfigured [Role](https://cloud.google.com/iam/docs/roles-overview) with GET and LIST objects and bucket privileges.
    -   The Role must be [assigned and granted permission to your Service Account](https://cloud.google.com/iam/docs/manage-access-service-accounts).
    -   JSON key credentials for your Service Account. When [creating a key for your Service Account](https://cloud.google.com/iam/docs/keys-create-delete), select **JSON**, and a key file in JSON format will automatically download to your local machine.

-   An existing **Google Cloud Storage bucket** with:

    -   Access control set to “Fine-grained”
    -   Bucket name
    -   Project number
    -   Region ID

-   If using Architecture 1, your Google VM instance needs to be deployed to the same region and VPC as the Cloud Storage bucket. [Private Google Access](https://cloud.google.com/vpc/docs/private-google-access) must be enabled at the subnet level within the VPC.

-   An **existing Linode Object Storage bucket** with:

    -   Bucket name
    -   Access key
    -   Secret key
    -   Region ID and endpoint URL

    {{< note title="Object Storage Access Keys" >}}
    When creating Object Storage access keys, it is a best practice to limit individual bucket access by region along with read/write permissions. See: [Manage access keys](https://techdocs.akamai.com/cloud-computing/docs/manage-access-keys)
    {{< /note >}}

## Migration Steps

### Initiating the Data Migration

1.  On the instance running rclone, configure rclone to communicate with your source Google Cloud Storage bucket and your target Linode Object Storage bucket.

    To view the location of the rclone config file, run:

    ```command
    rclone config file
    ```

    If the file does not exist yet, you should see output similar to the following:

    ```output
    Configuration file doesn't exist, but rclone will use this path:
    /home/user/.config/rclone/rclone.conf
    ```

1.  Using the text editor of your choice, add the following configuration to your config file. Replace the following fields with your own corresponding provider and bucket values. Save your changes when complete:

    **GCS**
    -   {{< placeholder "PROJECT-ID" >}}: The project number associated with your Service Account key. This can be found in your downloaded JSON key file and is labeled `project_id`.
    -   {{< placeholder "JSON-KEY-CREDENTIALS" >}}: The entire contents of the downloaded JSON key file, including the open and close brackets. **Important:** The JSON contents must be contained to a single line in the file, or an error will occur.

    **Linode Object Storage**
    -   {{< placeholder "LINODE-ACCESS-KEY" >}}: Your Linode Object Storage access key
    -   {{< placeholder "LINODE-SECRET-KEY" >}}: Your Linode Object Storage secret key
    -   {{< placeholder "us-lax-1" >}}: The region ID for your Linode Object Storage bucket

    ```file
    [gcs]
    type = google cloud storage
    anonymous = false
    project_number = {{< placeholder "PROJECT-ID" >}}
    service_account_credentials = { {{< placeholder "JSON-KEY-CREDENTIALS" >}} }

    [linode]
    type = s3
    provider = Ceph
    access_key_id = {{< placeholder "LINODE-ACCESS-KEY" >}}
    secret_access_key = {{< placeholder "LINODE-SECRET-KEY" >}}
    endpoint = {{< placeholder "us-lax-1" >}}.linodeobjects.com
    acl = private
    ```

    {{< note title="Rclone Providers" >}}
    The lines `[gcs]` and `[linode]` define the remote providers for your source and target endpoints, respectively. See [Supported Providers](https://rclone.org/#providers) for a complete list of supported rclone providers.
    {{< /note >}}

1.  Confirm connectivity to Google Cloud Storage using your defined remote provider, `gcs`:

    ```command
    rclone lsd gcs:
    ```

    If successful, you should see a list of available buckets:

    ```output
              -1 2024-08-30 09:10:47        -1 gcs-bucket-name
    ```

1.  Confirm connectivity to Linode Object Storage using the other defined remote provider, `linode`:

    ```command
    rclone lsd linode:
    ```

    Similar to above, you should see a list of available buckets:

    ```output
              -1 2024-08-28 14:46:47        -1 linode-bucket-name
    ```

1.  Run the rclone copy command to initiate the migration.

    Replace {{< placeholder "gcs-bucket-name" >}} and {{< placeholder "linode-bucket-name" >}} with the names of your Google Cloud Storage and Linode Object Storage buckets, respectively. Replace {{< placeholder "USERNAME" >}} and {{< placeholder "PASSWORD" >}} with the username and password you want to use to access the rclone WebUI.

    If using Architecture 2, also include the `--bind ::0` flag to write data from your Compute Instance to your Object Storage bucket using IPv6:

    ```command
    rclone copy gcs:{{< placeholder "gcs-bucket-name" >}}/ linode:{{< placeholder "linode-bucket-name" >}}/ --transfers 50 --rc --rc-addr=0.0.0.0:5572 --log-file=rclone.log --log-level=ERROR --rc-web-gui --rc-user {{< placeholder "USERNAME" >}} --rc-pass {{< placeholder "PASSWORD" >}}
    ```

#### Rclone Copy Command Breakdown

-   `gcs:gcs-bucket-name/`: The Google Cloud remote provider and source Cloud Storage bucket. Including the slash at the end informs the `copy` command to include everything within the bucket.

-   `linode:linode-bucket-name/`: The Linode remote provider and target Object Storage bucket.

-   `--transfers 50`: The `transfer` flag tells rclone how many items to transfer in parallel. Defaults to a value of 4. `50` here speeds up the transfer process by moving up to 50 items in parallel at a given time.

    Your `transfers` value may be different depending on how many objects you are transferring, and you may need to experiment to find the value that works best for your use case. High enough values may result in bandwidth limits being reached. Increasing this value also increases the CPU usage used by rclone.

-   `--rc`: Stands for “remote control”. The `rc` option deploys the http listen server for remote requests.

-   `--rc-addr=0.0.0.0:5572`: Specifies the web address and port number used to access the WebUI GUI. `0.0.0.0` instructs the remote to listen on all IPv4 addresses, and `5572` is the default port number used by rclone to access the WebUI.

-   `--log-file=rclone.log`: The file where rclone writes logs. This file is created in the working directory from where the `copy` command is run.

-   `--log-level=ERROR`: The type of logs to be written to your log file. `ERROR` here specifies only errors are written to the `rclone.log` file.

-   `--rc-web-gui`: Serves the WebUI GUI on the default rclone port (5572).

-    `--rc-user {{< placeholder "USERNAME" >}} and --rc-pass {{< placeholder "PASSWORD" >}}`: The username and password used to access the WebUI GUI.

{{< note title="Using the htpasswd flag" >}}
An alternative to the `--rc-user` and `--rc-pass` combination is the `--rc-htpasswd` flag. This creates a `htpasswd` file containing a generated username and password combination you can use to log into the rclone WebUI. See [Remote controlling rclone with its API](https://rclone.org/rc/#rc-htpasswd-path)
{{< /note >}}

-   `--bind ::0` (for use with Architecture 2): Tells rclone to write data via IPv6. Note that writing data over IPv6 from a Linode instance to an Object Storage bucket in the same region is free of charge.

#### Optional Flags

-   `--tpslimit {{< placeholder "XXX" >}}` : Specifies the number of HTTP transactions per second. For larger transfers, it is considered a best practice to set the `tpslimit` below the infrastructure requests per second (rps) limit. Should an rps limit be reached, a 503 `SlowDown` error may result.

    **Example:** If the infrastructure’s requests per second limit is 750 rps, set the tpslimit to 725:

    ```command
    --tpslimit {{< placeholder "725" >}}
    ```

### Monitoring the Migration

To monitor the status of the `rclone copy` command above, you can access the rclone WebUI GUI from a web browser.

1.  In a web browser window, navigate to your instance’s address over port 5572. Replace {{< placeholder "IP-ADDRESS" >}} with the IPv4 address of your instance:

    ```command
    http://{{< placeholder "IP-ADDRESS" >}}:5572
    ```

1.  When prompted, enter the username and password you specified with the `--rc-user` and `--rc-pass` flags:

    ![Rclone-WebUI-Login](Rclone-WebUI-Login.jpg)

1.  Once logged in, you should see active running jobs along with multiple monitoring statistics, including: job status, throughput and speed, bandwidth max speed, total objects transferred, amount of data transferred, and more.

    ![Rclone-global-stats](Rclone-global-stats.jpg)

    ![Rclone-speed](Rclone-speed.jpg)

1.  The WebUI will disconnect automatically when the copy job is complete.

## Verify the Migration

You can compare the number of objects in both your source and target buckets along with the total size of the buckets to verify full completion of the copy job.

### From the Command Line

**Google Cloud Storage:**

```command
rclone size gcs:gcs-bucket-name/
```

```output
Total objects: 87.275k (87275)
Total size: 647.612 GiB (695368455398 Byte)
```

**Linode Object Storage:**

```command
rclone size linode:linode-bucket-name/
```

```output
Total objects: 87.275k (87275)
Total size: 647.612 GiB (695368455398 Byte)
```

### From a Browser

Alternatively, you can compare the number of objects and total bucket sizes from the Google Cloud Management Console and Cloud Manager on Akamai:

**Google Cloud Management Console:**

-   Navigate to **Cloud Storage**
-   Select the source bucket name
-   Click the **Observability** tab
-   Select a timeframe and see **Total storage by object state**
-   To see the total number of objects, add the **Object Count** Storage widget to your Observability dashboard

**Cloud Manager:**

-   Navigate to **Object Storage**
-   Find your target bucket name
-   See the **Size** column for the total bucket size and the **Objects** column for the total number of objects

## Next Steps

There are several next steps to consider after a successful object storage migration:

-   **Change over your object storage endpoints to your new target bucket.** For example, if you have backups or logs being sent to your old source bucket, edit your jobs to point to the new bucket endpoints.

-   **Edit your configurations to match your new object storage credentials.** In addition to changing the target endpoints for your workloads, your access keys and secret keys need to be updated to your new Linode Object Storage keys.

-   **Confirm the changeover is functioning as expected.** Allow some time to make sure your updated workloads and jobs are interacting successfully with Linode Object Storage. Once you confirm everything is working as expected, you can safely delete the original source bucket and its contents.

-   **Take any additional steps to update your system for S3 compatibility.** You may need to make additional internal configuration changes to ensure your system is set up to communicate using S3 protocol. See Google’s documentation for [interoperability with other storage providers](https://cloud.google.com/storage/docs/interoperability).