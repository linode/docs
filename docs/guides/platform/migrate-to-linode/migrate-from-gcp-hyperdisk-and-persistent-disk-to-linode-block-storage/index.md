---
slug: migrate-from-gcp-hyperdisk-and-persistent-disk-to-linode-block-storage
title: "Migrate from GCP Hyperdisk and Persistent Disk to Linode Block Storage"
description: "Learn how to migrate data from a Hyperdisk or Persistent Disk on Google Cloud Platform to a Linode Block Storage Volume."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2025-03-07
keywords: ['migrate','gcp hyperdisk','gcp persistent disk','linode block storage']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide describes the process of migrating a single disk from Google Cloud Platform's (GCP) Hyperdisk or Persistent Disk services to Linode Block Storage using the rsync file synchronization utility. This guide focuses on migrating secondary persistent data storage disks rather than migrating the boot disk of a Google Compute Engine instance.

## Block Storage Migration Workflow Diagram

![GCP Hyperdisk and Persistent Disk to Linode Block Storage Migration Workflow Diagram](gcp-block-storage-migration-workflow.svg?diagram-description-id=gcp-linode-bs-migration)

1. The rsync command is run from a Linode instance and connects to a Google Compute Engine instance.

2. The Compute Engine instance sends data on the Hyperdisk or Persistent Disk to a Block Storage Volume attached to the Linode instance via an established rsync connection.

    2a. Egress costs for the migrated data are measured when the data leaves the GCP platform. These costs are billed by Google.

{#gcp-linode-bs-migration .large-diagram}

## Linode Block Storage vs. GCP Hyperdisk and Persistent Disk

Hyperdisk and Persistent Disk are Google's persistent network-attached block storage services. They have different performance characteristics and are available to different tiers of Compute Engine instances, but otherwise serve the similar functions as a block storage device.

When a Google Compute Engine instance is first created, Google creates a boot disk on the Hyperdisk or Persistent Disk services. This disk is attached to the instance and contains the operating system. One or more secondary disks can also be created with theses services for temporary files and for persistent data.

Like Hyperdisk and Persistent Disk, Linode Block Storage also provides block-level storage volumes to be used with virtual machines. Unlike Hyperdisk and Persistent Disk, Linode Block Storage is generally used for persistent data rather than operating system, boot disks, or temporary data. These other roles are fulfilled by a Linode instance's bundled disk, which is stored on the same host as the Compute Instance. Linode's bundled disk storage is also more suitable for applications that feature high disk operations, like high-traffic databases.

## Migration Considerations

The following are important time, cost, and security considerations to keep in mind when migrating your Hyperdisks and Persistent Disks to Linode Block Storage.

### Migration Time Estimates

The time it takes to migrate a disk is a function of the data stored on that disk, which can be substantial for larger migrations. To determine how much data is stored on your disk, run the `df` command from your Compute Engine instance:

```command {title="SSH session with Google Compute Engine instance"}
df -h
```

Your data disk should appear, and the `Used` column shows how much data is stored on the disk. In this example, the filesystem location for the disk is `/dev/sdb/`, but your location may be different:

```output
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdb        20G  4.4G   16G  23% /mnt/disks/data
```

Bandwidth for the transfer can vary according to different factors, including:

- Outbound bandwidth limits for your Compute Engine instance
- Geographic distance between the Compute Engine instance and the Linode instance
- Disk operation limits

When planning your migration, consider performing a bandwidth test between the two locations first. Then, use the observed bandwidth from the test to calculate the estimated migration time for the disk.

Utilities like [iperf](/docs/guides/install-iperf-to-diagnose-network-speed-in-linux/) can be useful for performing this type of bandwidth measurement. Alternatively, you can create a test file on the Compute Engine instance, migrate it following the [instructions](#block-storage-migration-instructions) in this guide, and then view the bandwidth reported by rsync's output.

You can use the `dd` command to generate a sample 1GB test file:

```command {title="SSH session with Google Compute Engine instance"}
sudo dd if=/dev/zero of=/mnt/disks/data/dummyfile bs=1M count=1024
```

### Migration Egress Costs

The cost to migrate a disk is a function of the data stored on that disk, which can be substantial for larger migrations. These costs are incurred as egress fees when the data leaves GCP and are billed by Google. Review the [Migration Time Estimates](#migration-time-estimates) section for help with determining how much data is stored on the disk, and review the Data Transfer pricing in [Google's Compute Engine pricing documentation](https://cloud.google.com/network-tiers/pricing) for assistance with calculating this amount.

{{< note >}}
Egress costs for migrations out of GCP *may* be waived by Google. Review this [GCP documentation](https://cloud.google.com/exit-cloud?hl=en) for more information on this scenario.
{{< /note >}}

Inbound traffic sent to your Linode instance and Block Storage Volume have no fees incurred on the Akamai Cloud platform.

### Security and Firewalls

For data security reasons, files should be migrated over an encrypted connection. Rsync supports using SSH as its transport protocol, which is encrypted by default.

Both your Compute Engine and Akamai Cloud firewall settings should be configured to allow SSH traffic between the two instances. After the migration is performed, you may wish to close access to SSH between the Linode instance and Compute Engine instance.

## Block Storage Migration Instructions

### Prerequisites and Assumptions

This guide assumes that you have a Compute Engine instance running Linux. The guide also assumes you have a secondary Hyperdisk or Persistent Disk volume attached to the instance in addition to the instance's boot disk. The assumed filesystem path for the volume is `/mnt/disks/data`, and the username for the Compute Engine instance is `gcpuser`.

### Prepare a Linode Block Storage Volume

1. To transfer data to a Linode Block Storage volume, it must first be attached to a Linode instance. You may create a new Linode instance for the purpose of this migration ([Create a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance)). Alternatively, you can use an existing Linode instance for the migration.

    {{< note >}}
    If you create an instance to use for this migration, you may wish to delete it after the migration is complete. Deleting an instance that has an attached volume does not delete the volume.
    {{< /note >}}

1. Follow the [Add volumes](https://techdocs.akamai.com/cloud-computing/docs/manage-block-storage-volumes#add-volumes) product documentation to create and attach a new volume to the Linode instance. This volume should have a capacity equal to or higher than the total data stored on the source Hyperdisk or Persistent Disk volume. Review the [Migration Time Estimates](#migration-time-estimates) section for help with determining how much data is stored on the volume.

    When creating the volume, Cloud Manager displays instructions for how to create a filesystem on the new volume and then mount it. Make a note of the filesystem path that it is mounted under (e.g. `/mnt/linode-block-storage-volume`).

### Configure Firewalls

In this guide, the rsync command is run from a Linode instance and connects to a Compute Engine instance. This means that the Compute Engine instance should accept inbound SSH traffic (port 22). You may also wish to specifically add the IP address of the Linode instance to the allow list for inbound traffic of the Compute Engine instance.

Linux distributions (on both Linode instances and Compute Engine instances) can have software firewalls configured inside the instance. The following guides describe some software firewalls that your instances may use:

- [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/)
- [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/)
- [A Tutorial for Controlling Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/)

You may also configure Cloud Firewalls to control traffic before it arrives at your Linode instance. Our [Cloud Firewall](https://techdocs.akamai.com/cloud-computing/docs/cloud-firewall/) product documentation describes how to configure these rules. The [Comparing Cloud Firewalls to Linux firewall software](https://techdocs.akamai.com/cloud-computing/docs/comparing-cloud-firewalls-to-linux-firewall-software) guide further describes the difference between network firewalls and software firewalls. [GCP's product documentation](https://cloud.google.com/security/products/firewall?hl=en) describes how to configure cloud firewalls for Compute Engine instances.

### Configure SSH Key Pair

This guide uses SSH public key authentication for the rsync connection. You must have a public and private key pair installed on the Linode instance and Compute Engine instance. The [Generate an SSH Key Pair](/docs/guides/use-public-key-authentication-with-ssh/#generate-an-ssh-key-pair) section of the [SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/) guide describes how to create and use a key pair.

This guide assumes the public and private keys are named `id_rsa.pub` and `id_rsa`, but your keys may have different names depending on the type of key pair you are using.

- The *public key* should be uploaded to the Compute Engine instance. It should be appended to a new line of the `authorized_keys` file of the user on the Compute Engine instance (e.g. `/home/gcpuser/.ssh/authorized_keys`).

- The *private key* should be located on the Linode instance. It should be uploaded to the `.ssh/` directory of the user on the Linode instance (e.g. `/home/linodeuser/.ssh/`) and have permissions set to `600`:

    ```command {title="SSH session with Linode instance"}
    chmod 600 /home/linodeuser/.ssh/id_rsa
    ```

### Initiate the Migration

These instructions implement two recommended practices:

- Running rsync in a persistent process

- Sending output and errors to log files

Migrations can take a long time, so having them run independently of your SSH session is important. This guide uses `tmux` to create a terminal session that persists between SSH connections. By sending output and errors to log files, you can keep a record of any migration failures that may happen.

Review our [tmux guide](/docs/guides/persistent-terminal-sessions-with-tmux/) for help with other tmux commands.

1. Install the `tmux` utility on your Linode instance using the official tmux instructions: [Installing tmux](https://github.com/tmux/tmux/wiki/Installing#installing-tmux).

1. Create a new tmux session named `block-storage-migration`. This session is used to initiate the migration:

    ```command {title="SSH session with Linode instance"}
    tmux new -s block-storage-migration
    ```

    After running this command, the tmux session is immediately activated in your terminal.

1. Run the following commands to start migrating the contents of your Hyperdisk or Persistent Disk volume to your Linode Block Storage Volume:

    ```command {title="SSH session with Linode instance (bs-migration tmux session)"}
    echo "\n\nInitiating migration $(date)\n---"  | tee -a bs-migration-logs.txt bs-migration-errors.txt >/dev/null

    rsync -chavzP --stats -e "ssh -i /home/linodeuser/.ssh/id_rsa" {{< placeholder "gcpuser" >}}@{{< placeholder "COMPUTE_ENGINE_INSTANCE_IP" >}}:/mnt/disks/data/ /mnt/linode-block-storage-volume 1>>~/bs-migration-logs.txt 2>>~/bs-migration-errors.txt
    ```

    Replace the following values with the actual values from your Compute Engine instance and Linode instance:

    - `/home/linodeuser/.ssh/id_rsa`: The name and location of the private key on your Linode instance
    - `{{< placeholder "gcpuser" >}}`: The name of the user on the Compute Engine instance
    - `{{< placeholder "COMPUTE_ENGINE_INSTANCE_IP" >}}`: The IP address of the Compute Engine instance
    - `/mnt/disks/data/`: The directory under which the Hyperdisk or Persistent Disk volume is mounted
    - `/mnt/linode-block-storage-volume`: The directory under which your Linode volume is mounted

    {{< note >}}
    You may be prompted to accept the host key of the Compute Engine instance if it is the first time that the Linode has connected to it.
    {{< /note >}}

    **Command breakdown**:

    The first `echo` appends a message to the log files. Below is a detailed explanation of the key flags and parameters used in the `rsync` command:

    - `-c`: Tells rsync to use checksum comparison for file differences. Normally, rsync uses file size and modification time to decide if files need to be updated, but `-c` forces it to compute checksums. This is slower but can be more accurate if you want to be sure that files match exactly.

    - `-h`: Human-readable output, which makes file sizes like transfer statistics easier to read by using units like KB and MB, rather than raw byte counts.

    - `-a`: Archive mode. This is equivalent to specifying: `-rlptgoD`. The result of the `-a` flag is a complete, near-exact copy of the source directory:

        - `-r`: Recursively copy directories

        - `-l`: Preserve symbolic links

        - `-p`: Retain file permissions

        - `-t`: Keep timestamps

        - `-g`: Preserve group ownership

        - `-o`: Maintain file ownership

        - `-D`: Retain device files and special files

    - `-v`: Verbose mode. This makes rsync output more detailed information about what it is doing, and can be helpful for monitoring the progress of a large transfer or troubleshooting.

    - `-z`: Compression. This enables compression during data transfer, which can save bandwidth and speed up the transfer if the network connection is relatively slow.

    - `-P`: Combines two other flags:

        - `--progress`, which displays progress information for each file transfer.

        - `--partial`, which keeps partially transferred files if the transfer is interrupted, allowing it to resume more easily next time.

    - `--stats`: Provides detailed statistics at the end of the transfer, such as total bytes transferred, transfer speed, and file counts.

    - `-e "ssh -i /home/linodeuser/.ssh/id_rsa"`: Specifies a remote shell (SSH) with an identity key file for authentication.

    - `{{< placeholder "gcpuser" >}}@{{< placeholder "COMPUTE_ENGINE_INSTANCE_IP" >}}:/mnt/disks/data/`: This specifies the source directory you're syncing from:

        - `{{< placeholder "gcpuser" >}}`: The username on the remote server.

        - `{{< placeholder "COMPUTE_ENGINE_INSTANCE_IP" >}}`: The IP address of the remote server.

        - `/mnt/disks/data/`: The path on the remote server that you want to sync. The trailing slash (/) means rsync will copy the contents of /mnt/disks/data, rather than creating a /mnt/disks/data directory in the target.

        - `/mnt/linode-block-storage-volume`: The destination directory on the local machine where rsync will copy the files to. In this case, it will create an exact copy of /mnt/disks/data contents here.

### Monitor the Migration

Because the stdout and stderr streams were redirected to log files, the rsync command will not produce output in the terminal. Follow these steps to inspect and monitor the contents of the logs:

1. To avoid interrupting the rsync process, *detach* from the tmux session by entering the following sequence of keystrokes: <kbd>Ctrl</kbd> + <kbd>B</kbd> followed by <kbd>D</kbd>. You are returned to the SSH session that created the tmux session:

    ```output
    [detached (from session block-storage-migration)]
    ```

1.  Use `tail -f` to inspect the log and error files and monitor any new output from them:

    ```command {title="SSH session with Linode instance"}
    tail -f block-storage-migration-logs.txt
    ```

    ```command {title="SSH session with Linode instance"}
    tail -f block-storage-migration-errors.txt
    ```

    Enter <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop `tail`.

1.  You can re-enter the tmux session with the `tmux attach` command:

    ```command {title="SSH session with Linode instance"}
    tmux attach -t block-storage-migration
    ```

### Verify the Migration

To verify that rsync has synced all the files as expected, re-run the `rsync` command with the `--dry-run –-stats` flags, replacing the same values as before:

```command {title="SSH session with Linode instance"}
rsync -chavzP --stats --dry-run -e "ssh -i /home/gcpuser/.ssh/id_rsa" {{< placeholder "gcpuser" >}}@{{< placeholder "COMPUTE_ENGINE_INSTANCE_IP" >}}:/mnt/disks/data/ /mnt/linode-block-storage-volume
```

If the output displays files yet to be transferred, then rsync did not fully replicate the files in the destination directory. A previous successful rsync transfer should result in the following output. Note that the number of created, deleted, and transferred files are zero:

```output
receiving incremental file list

Number of files: 2 (reg: 1, dir: 1)
Number of created files: 0
Number of deleted files: 0
Number of regular files transferred: 0
Total file size: 10.49M bytes
Total transferred file size: 0 bytes
Literal data: 0 bytes
Matched data: 0 bytes
File list size: 84
File list generation time: 0.003 seconds
File list transfer time: 0.000 seconds
Total bytes sent: 20
Total bytes received: 95

sent 20 bytes  received 95 bytes  230.00 bytes/sec
total size is 10.49M  speedup is 91,180.52 (DRY RUN)
```

### Cleanup after Migration

After the migration is complete, you may determine that the Compute Engine instance and Linode instance no longer need to communicate. You can close traffic between these servers by doing the following:

- Remove the firewall access granted in the [Configure Firewalls](#configure-firewalls) section

- Revoke the SSH key used for the transfer. This is done by removing the SSH public key that was referenced from the `/home/gcpuser/.ssh/authorized_keys` file on the Compute Engine instance.