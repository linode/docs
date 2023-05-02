---
slug: linux-dump-and-restore-commands
title: "Quick Guide to the Linux Dump and Restore Commands"
description: 'This guide gives an overview of the "dump" and "restore" commands in Linux. It covers their basic functionalities, usage, and options, including dump levels, compression, and debug/verbose modes.'
keywords: ['install dump', 'dump levels', 'dump targets', 'perform full backup', 'compress backup', 'restore backup']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ["John Mueller"]
published: 2023-05-02
modified_by:
  name: Linode
external_resources:
- '[Dump command in Linux](https://www.geeksforgeeks.org/dump-command-in-linux-with-examples/)'
- '[Restore command in Linux](https://www.geeksforgeeks.org/restore-command-in-linux-with-examples/)'
---

Data is the most important asset that a business has, so it’s important to know how to protect it from damage and recover it when damage occurs. The Linux dump command provides the first part of the equation by allowing data backup to another location. You can also configure a drive to automatically back itself up using the `<dump>` column entry in the `/etc/fstab` file used to perform automatic mounting of disk drives. However, performing manual backups helps to maintain up-to-date backups and provides an additional layer of protection during system updates, and as part of new application installations. The `restore` command is the second part of the equation. It allows copying data from a stored location to the production system, in either the original or chosen secondary location.

Backups can reside on any device that allows you to write to it. This includes tape drives, USB drives, and cloud storage, among other options. The drive need not be available at all times; it only needs to be accessible when you want to perform a backup or restore. In fact, there are advantages, such as resistance to hacker attacks, that make offline storage approaches appealing. The drive can be located remotely, reducing susceptibility to natural disasters or other events. This guide explains both the `dump` and `restore` commands so that you can perform those tasks manually.

## What Is a Dump and Why Do You Need to Do It?

A dump is simply a backup of data. There are several types of backup and each has a particular purpose:

- **Full**: Everything on a volume is backed up, even if it doesn’t require a backup currently because it hasn’t been changed since the last backup.

- **Differential**: Every file that has changed on the volume since the last full backup is backed up. There is just one differential backup file that contains only the changes from the last full backup.

- **Incremental**: Every file that has changed on the volume since the last incremental backup at a specific level. A discussion of levels appears later in the guide.


## Install Dump

You can obtain a list of dump options whenever you want by typing `dump` and pressing **Enter** at the command prompt. You may find that dump isn’t actually available on your system. To install "dump", use the following command:

```command
sudo apt install -y dump
```

Once the installation is complete, you can verify that "dump" is installed by running the following command:

```command
dump -h
```

This should display the help menu for "dump", indicating that it is installed successfully.


### Understanding the Dump Levels

The dump "levels" refer to the different levels of backups that can be performed using the "dump" command. The dump level controls how the backup is made. A dump level of -0 (zero) performs a full backup of the system. Anything above -0 creates an incremental backup of the same or lower level. Incremental backups only backup new or modified files, not all of the files. A differential backup is a special case of incremental backup. You generally use level -9 to create a differential backup and you create just one differential backup between full backups. A five-day discrete incremental backup scheme, with each backup representing one day, is outlined below:


- **Day 1**: Use a -0 level backup to backup all of the files.
- **Day 2**: Use a -1 level backup to backup the files that have changed since the last full backup.
- **Day 3**: Use a -2 level backup to backup the files that have changed since Day 2.
- **Day 4**: Use a -3 level backup to backup the files that have changed since Day 3.
- **Day 5**: Use a -4 level backup to backup the files that have changed since Day 4.

Some backup schemes can become complex. A [cumulative incremental backup](https://docs.oracle.com/cd/E19683-01/806-4073/bkupconcepts-3/index.html), where each backup represents all of the changes since the last full backup, relies on a -0 backup of each month to provide a full backup. Each day after that, until the last day of the cycle, uses a -9 backup so that the backup is always based on the full backup, rather than the previous day’s backup. The last day uses a -5 backup to end that week’s backups.

### An Overview of Dump Targets

The `-f file` option controls where the contents of your system are dumped. The dump is oriented toward the use of tape backup, which may seem antiquated in the day of excessively cheap hard drives and even cheaper online storage but is still in extensive use. The default target, if you don’t specify one, is `/dev/tape`. The use of tape backup is why you often see backup scripts pointed to the `/dev/st0` device, which is the first tape drive connected to a machine. The current technology relies on [Linear Tape-Open (LTO) tape drives](https://www.lto.org/what-is-lto/) because they’re inexpensive, extremely reliable, movable, and easy to secure. However, many people are now saying that [LTO tape drives should be replaced with HDD technology](https://blog.benjojo.co.uk/post/lto-tape-backups-for-linux-nerds), or possibly cloud storage. The fact is that you can use the `-f file` option to redirect the backup files anywhere, including a file on the current system hard drive. The biggest issue is that the device needs to be available, and the connection needs to be reliable before you begin the backup.

## Determine Which Files Require Backup

Dump provides two methods of determining which files to backup:

- **dump -W**: Provides a list of file systems that need to be dumped as found in `/var/lib/dumpdates` and `/etc/fstab`. This includes any mounted file systems. You see a listing of the most recent dump date and level. In addition, you see which file systems, not individual directories, or files, should be dumped.

- **dump -w**: Performs the same task as the `-W` option, except the focus is on the `/etc/mtab` and `/etc/fstab` file content.


## Start a Backup

The initial backup you perform is always a full backup, upon which subsequent backups are based.


### Perform a Full Backup

If you have a tape mounted to `/dev/tape` all you need to start a full backup is the `dump` command followed by the file system revealed by `dump -W`. In most cases, you want more control by including the level and the dump target. Consequently, a minimal full `dump` command typically looks like `dump -0 -f /dev/st0 /dev/sda`, where `-0` indicates a full backup, `-f` points to the location of the backup device, and `/dev/sda` is the file system to backup.

Some options aren’t used much anymore. For example, the `-a` option (write data until an end-of-media signal occurs) is the default, so you don’t have to specify it. Modern tape drives do supply an end-of-media signal, so anything like the `-b`, `-B`, `-c`, and `-d` options, which relate to older tape drives specifically, aren’t really necessary.

One option you need to always add to a backup is `-u`, which tells dump to update the `/var/lib/dumpdates` file. Otherwise, the backup isn’t recorded and `dump -W` doesn’t indicate that a backup was made. In addition, add the `-A` option with the name of a catalog file to use. This makes it easier to restore files later. The catalog file makes it possible for the `restore` command to find files later. Consequently, if you have a backup location mounted to `/myBackup`, then create a full backup using the command like this: `dump -0 -f /myBackup/10182022 -A /myBackup/10182022.cat -u dev/sda`.


### Back Up Only Changed Files

An incremental or differential backup occurs after a full backup. The main difference is controlling the level so that the backups are made correctly. Change the `dump` command you use for a full backup to include a new dump level like this: `dump -9 -f /myBackup/10192022 -A /myBackup/10192022.cat -u dev/sda`.

### Exclude Files From a Backup

You can exclude a *file* from a backup using the -e option, but to do so you must know what inode number to use. An *inode* is a data structure that stores information about a file, such as the access mode (read, write, execute permissions), ownership, file type, file size, group, and a number of links. Use the stat command to obtain the inode number for a particular file. For example, `stat /myData/test.txt` obtains the inode number for the test.txt file in the `/myData` directory.

Another way to get the inode number is using the ls command with the `-il` option. This is the best way to obtain the inode numbers for the files in an entire directory. For example, `ls -il /myData` would obtain the inode numbers for all of the entries in the `/myData` directory. The `-e` option accepts a comma-separated list of the inodes that you don’t want to appear as part of the backup.

### Compress a Backup

Data compression for the `dump` command depends on [zlib](https://zlib.net/). The default compression level for dump is 2, but you can use values between 1 and 9. Use the `-z` option to change the data compression. For example, `-z9` provides the maximum compression available. Additional data compression makes it possible to store more information on your backup media, but at the cost of both backup and restore time.


## Restore a Backup

When data becomes damaged, is accidentally deleted, or simply needs to be retrieved, you need to perform a restoration option using the `restore` command. The package name may vary depending on the Linux distribution you are using. For example, on **Ubuntu** and **Debian** systems, you can install the "restore" package using the following command:

```command
sudo apt install restore
```

### Debugging a Restore

If errors are reported while attempting to use a backup file, sometimes you can figure out what is going on by using debug mode (the` -d` option), which provides a considerable amount of information over the standard restore mode commands. For example, using the `restore -t -f /myBackup/10192022 ./root/test` command only prints out the files located in the `./root/test` directory of backup `10192022`. However, using `restore -d -t -f /myBackup/10192022 ./root/test` instead prints out the internal structure of the backup file.


### Verbose Mode

Using verbose mode for `restore` command tells you what is happening in more detail than normal. It differs from debug mode because you aren’t looking at the internals of the file, but rather what restore is doing in more detail. Debug mode helps identify issues with the backup file, while verbose mode assists in identifying issues with the `restore` command's interaction with the debug file. A typical verbose mode command might look like this: `restore -v -t -f /myBackup/10192022 ./root/test`, where the `-v` option specifies verbose mode.


## Back up a Dump to a Block Storage Volume

Dumping data to a block storage volume allows you to store the backup data separately from your local hard drive, providing additional storage space and flexibility. If you have a dump stored in a block storage volume and you need to restore or repair a Linode, you can attach the block storage volume to the new Linode and use it for data recovery or restoration purposes. If your local hard drive is running out of space or if the backup data becomes too large, you can easily store the dump on a block storage volume, which can typically be resized to accommodate growing data. To back up a dump to a block storage volume in Linux, you can follow the steps below:

1. Create a block storage volume on your Linux system. This can typically be done using a command-line tool such as `fdisk`, `parted`, or `mkfs`. Make sure you know the device path of the block storage volume, such as `/dev/sdb` or `/dev/xvdf`.

1. Mount the block storage volume to a mount point in your Linux file system. You can do this using the mount command. For example, if you want to mount the block storage volume at the directory `/mnt/backup`, you can use the following command:

    ```command
    sudo mount /dev/sdb /mnt/backup
    ```

    Replace `/dev/sdb` with the device path of your block storage volume, and `/mnt/backup` with the desired mount point.

1. Prepare the dump of the data you want to back up. This can typically be done using `dump` command. For example, if you want to create a dump of a directory called `/data` and save it to a file called `backup.dump`, you can use the following command:

    ```command
    sudo dump -0uf /mnt/backup/backup.dump /data
    ```

    This creates a level-0 dump of the `/data` directory and saves it to the block storage volume mounted at `/mnt/backup`.

1. Verify its integrity using the `restore` command. For example, you can use the `ls` command to check the file size of the dump using the following command:

    ```command
    ls -lh /mnt/backup/backup.dump
    ```

    If the file size matches the size of the data you backed up, then the backup was successful.

1. Unmount the block storage volume using the following `umount` command:

    ```command
    sudo umount /mnt/backup
    ```


## Conclusion

This guide takes you through the basics of using the `dump` and `restore` commands with Linux. These simple utilities make creating and restoring backups quite easy and you can do a great deal with them, especially as part of scripting scenarios. Experiment with these utilities to get the full benefit.
