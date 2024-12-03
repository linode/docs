---
slug: migrate-from-azure-disk-storage-to-linode-block-storage
title: "Migrate From Azure Disk Storage to Linode Block Storage"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Linode"]
contributors: ["Linode"]
published: 2024-11-18
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

This guide describes the process of migrating a single volume from Azure Disk Storage to Linode Block Storage using the rsync file synchronization utility. This guide does not cover migrating operating system disks from Azure Disk Storage. Instead, it focuses on migrating data disks.

## Linode Block Storage vs. Azure Disk Storage

When you first create an Azure Virtual Machine, Azure Disk Storage creates a managed disk for the operating system. One or more managed disks can also be created with the Azure Disk Storage service for temporary files and for persistent data disks.

Like Azure Disk Storage, Linode Block Storage also provides block-level storage volumes used with VMs. Unlike Azure Disk Storage, Linode Block Storage is generally used for persistent data, not OS/boot disks or temporary data. These other roles are fulfilled by a Linode compute instance's bundled disk, which is stored on the same host as the compute instance. Linode's bundled disk storage is also more suitable for applications that feature high disk operations, like high-traffic databases.

## Migration Considerations

The following are important time, cost, and security considerations you should keep in mind when migrating your Azure Disk Storage drives to Linode Block Storage.

### Migration Time Estimates

The time it takes to migrate a data disk is a function of the data stored on that disk, which can be substantial for larger migrations. To determine how much data is stored on your disk, run the `df` command from your Azure VM:

```command {title="SSH session with Azure VM"}
df -h
```

Your data disk should appear, and the `Used` column shows how much data is stored on the disk:

```output
df -h
Filesystem      Size  Used Avail Use% Mounted on
/dev/sdc1        20G  4.4G   16G  23% /datadrive
```

TODO: advise on bandwidth testing

### Migration Egress Costs

The cost to migrate a data disk is a function of the data stored on that disk, which can be substantial for larger migrations. These costs are incurred as egress fees when the data leaves the Azure platform and are billed by Azure. Review the [Migration Time Estimates](#migration-time-estimates) section for help with determining how much data is stored on the disk. Please review the Azure documentation for assistance with calculating this amount.

Inbound traffic sent to your Linode instance and Block Storage volume have no fees incurred on the Linode platform.

### Security and Firewalls

Files should be migrated over an encrypted connection. Rsync supports using SSH as its transport protocol, which is encrypted.

Your Azure and Linode firewall settings should be configured to allow SSH traffic between the two instances. After the migration is performed, you may wish to close access to SSH between the Linode instance and Azure virtual machine.

## Block Storage Migration Workflow Diagram

TODO: fill in diagram

## Block Storage Migration Instructions

### Prerequisites and Assumptions

This guide assumes that you have an Azure virtual machine and an attached data disk on the Azure Disk Storage service. The assumed filesystem path for the Azure data disk is `/datadrive`, and the username for the Azure virtual machine is `azureuser`.

### Prepare a Linode Block Storage Volume

1. To transfer data to a Linode Block Storage volume, it must first be attached to a Linode instance. You may create a new Linode instance for the purpose of this migration ([Create a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/create-a-compute-instance)). Alternatively, you can use an existing Linode instance for the migration.

    {{< note >}}
    If you create an instance to use for this migration, you may wish to delete it after the migration is complete. Deleting an instance that has an attached volume does not delete the volume.
    {{< /note >}}

1. Follow the [Add volumes](https://techdocs.akamai.com/cloud-computing/docs/manage-block-storage-volumes#add-volumes) product documentation to create and attach a new volume to the Linode instance. This volume should have a capacity equal to or higher than the total data stored on the source Azure disk. Review the [Migration Time Estimates](#migration-time-estimates) section for help with determining how much data is stored on the disk.

    When creating the volume, the Linode Cloud Manager displays instructions for how to create a filesystem on the new volume and then mount it. Make a note of the filesystem path that it is mounted under (e.g. `/mnt/your-volume-name`).

### Configure Firewalls

In this guide, the rsync command is run from a Linode instance and connects to an Azure virtual machine. This means that the Azure VM should accept inbound SSH traffic (port 22). You may also wish to specifically add the IP address of the Linode instance to the allow list for inbound traffic of the Azure VM.

Linux distributions (on both Linode instances and Azure virtual machines) can have software firewalls configured inside the instance. The following guides describe some software firewalls that your instances may use:

- [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/)
- [How to Configure a Firewall with UFW](/docs/guides/configure-firewall-with-ufw/)
- [A Tutorial for Controlling Network Traffic with iptables](/docs/guides/control-network-traffic-with-iptables/)

You may also configure cloud firewalls to control traffic before it arrives at your computing instance. The [Linode Cloud Firewalls](https://techdocs.akamai.com/cloud-computing/docs/cloud-firewall/) product documentation describes how to configure these rules. The [Comparing Cloud Firewalls to Linux firewall software](https://techdocs.akamai.com/cloud-computing/docs/comparing-cloud-firewalls-to-linux-firewall-software) guide further describes the difference between network firewalls and software firewalls. Microsoft Azure's product documentation describes how to configure Azure network firewalls.

### Configure SSH Key Pair

This guide uses SSH public key authentication for the rsync connection. You must have a public-private key pair installed on the Linode instance and Azure virtual machine. The [Generate an SSH Key Pair](/docs/guides/use-public-key-authentication-with-ssh/#generate-an-ssh-key-pair) section of the [SSH Public Key Authentication](/docs/guides/use-public-key-authentication-with-ssh/) guide describes how to create a key pair.

This guide assumes the public and private keys are named `id_rsa.pub` and `id_rsa`, but you may wish to choose a different name.

- The *public key* should be uploaded to the Azure virtual machine. It should be appended to a new line of the `authorized_keys` file of the user on the Azure VM (e.g. `/home/azureuser/.ssh/authorized_keys).

- The *private key* should be uploaded to the Linode instance. It should be uploaded to the `.ssh/` directory of the user on the Linode instance (e.g. `/home/linodeuser/.ssh/`). It should have permissions set to `600`:

    ```command {title="SSH session with Linode instance"}
    chmod 600 /home/linodeuser/.ssh/id_rsa/
    ```

### Initiate the Migration

These instructions implement two recommended practices:

- Running rsync in a persistent process

- Sending output and errors to log files

Migrations can take a long time, so having them run independently of your SSH session is important. This guide uses `tmux` to create a terminal session that persists between SSH connections. By sending output and errors to log files, you can keep a record of any migration failures that may happen.

1. Install `tmux`: [Installing tmux](https://github.com/tmux/tmux/wiki/Installing#installing-tmux).

1. Create a new tmux session. This session is used to initiate the migration, and it will persist between SSH sessions. This is important for large/long-running migrations. This command creates a session with name `block-storage-migration`:

    ```command {title="SSH session with Linode instance"}
    tmux new -s block-storage-migration
    ```

    After running this command, the tmux session is immediately activated in your terminal.

1. Run the following commands to start migrating the contents of your Azure data disk to your Linode block storage volume:

    ```command {title="SSH session with Linode instance (bs-migration tmux session)"}
    echo "\n\nInitiating migration $(date)\n---"  | tee -a bs-migration-logs.txt bs-migration-errors.txt >/dev/null

    rsync -chavzP --stats -e "ssh -i /home/linodeuser/.ssh/id_rsa" azureuser@{{< placeholder "AZURE_VM_IP" >}}:/datadrive/ /mnt/linode-block-storage-volume 1>>~/bs-migration-logs.txt 2>>~/bs-migration-errors.txt
    ```

    Be sure to replace these values:

    - `/home/linodeuser/.ssh/id_rsa`: The name and location of the private key
    - `azureuser`: The name of the user on the Azure VM
    - `AZURE_VM_IP`: The IP address of the Azure VM
    - `/datadrive/`: The directory the Azure data disk is mounted under
    - `/mnt/linode-block-storage-volume`: The directory your Linode volume is mounted under

    {{< note >}}
    You may be prompted to accept the host key of the Azure VM if it is the first time that the Linode has connected to it.
    {{< /note >}}

    The first `echo` appends a message to the log files. Here's a detailed explanation of the key flags and parameters used in the `rsync` command:

    - `-c`: Tells rsync to use checksum comparison for file differences. Normally, rsync uses file size and modification time to decide if files need to be updated, but -c forces it to compute checksums, which is slower but can be more accurate if you want to be sure that files match exactly.

    - `-h`: Human-readable output, which makes file sizes (like transfer statistics) easier to read by using units like KB and MB, rather than raw byte counts.

    - `-a`: Archive mode. This is equivalent to specifying: `-rlptgoD`. The result of the `-a` flag is a complete, near-exact copy of the source directory:

        - `-r`: Recursively copy directories

        - `-l`: Preserve symbolic links

        - `-p`: Retain file permissions

        - `-t`: Keep timestamps

        - `-g`: Preserve group ownership

        - `-o`: Maintain file ownership

        - `-D`: Retain device files and special files

    - `-v`: Verbose mode. This makes rsync output more detailed information about what it is doing, which is helpful for monitoring the progress of a large transfer or troubleshooting.

    - `-z`: Compression. This enables compression during data transfer, which can save bandwidth and speed up the transfer if the network connection is relatively slow.

    - `-P`: Combines two other flags:

        - `--progress`, which displays progress information for each file transfer.

        - `--partial`, which keeps partially transferred files if the transfer is interrupted, allowing it to resume more easily next time.

    - `--stats`: Provides detailed statistics at the end of the transfer, such as total bytes transferred, transfer speed, and file counts.

    - `-e "ssh -i /home/linodeuser/.ssh/id_rsa"`: Specifies a remote shell (SSH) with an identity key file for authentication.

    - `azureuser@AZURE_VM_IP:/datadrive/`: This specifies the source directory you're syncing from:

        - `azureuser`: The username on the remote server.

        - `AZURE_VM_IP`: The IP address of the remote server.

        - `/datadrive/`: The path on the remote server that you want to sync. The trailing slash (/) means rsync will copy the contents of /datadrive, rather than creating a /datadrive directory in the target.

        - `/mnt/linode-block-storage-volume`: The destination directory on the local machine where rsync will copy the files to. In this case, it will create an exact copy of /datadrive contents here.

### Monitor the Migration

Because the stdout and stderr streams were redirected to log files, the rsync command will not produce output in the terminal. Follow these steps to inspect and monitor the contents of the logs:

1. To avoid interrupting the rsync process, *detach* from the tmux session by entering this sequence of keystrokes: `CTRL-b` followed by `d`. You are returned to the SSH session that created the tmux session:

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

    Enter `CTRL-c` to stop `tail`.

1.  You can re-enter the tmux session with the `tmux attach` command:

    ```command {title="SSH session with Linode instance"}
    tmux attach -t block-storage-migration
    ```

    {{< note >}}
    Review the [tmux guide](/docs/guides/persistent-terminal-sessions-with-tmux/) for help with other tmux commands.
    {{< /note >}}

### Verify the Migration

To verify that rsync has synced all the files as expected, re-run the command with the `--dry-run –stats` flags:

```command {title="SSH session with Linode instance"}
rsync -chavzP --stats --dry-run -e "ssh -i /path/to/your_azure_vm_key.pem" azureuser@13.93.147.88:/datadrive/ /mnt/linode-bs
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

After the migration is complete, you may determine that the Azure VM and Linode instance no logner need to communicate. You can close traffic between these servers by doing the following:

- Remove the firewall access granted in the [Configure Firewalls](#configure-firewalls) section

- Revoke the SSH key used for the transfer. This is done by removing the SSH public key that was referenced from the `/home/azureuser/.ssh/authorized_keys` file on the Azure VM.