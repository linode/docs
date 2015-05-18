Converting An Arch Linux Linode to BTRFS

You have heard about all the things [btrfs](https://btrfs.wiki.kernel.org) can bring you - instant low-overhead snapshots, CoW, built-in raid and LVM, etc. Unfortunately, using btrfs in Linode it isn't as simple as selecting it from a list.

There are a few problems with building a Linode that uses BTRFS. First, Linode doesn't offer images using btrfs. Additionally, the version of pv-grub used by Linode can't boot from btrfs even if the image was there. There is good news though! Following this guide, you can switch an existing node from ext# to btrfs in a smooth and relatively painless process. Just 10 easy steps!

All you need is enough remaining disk quota to temporarily double your root fs size and the ability to take some downtime. (It is possible to do an in-place conversion, but that is out of scope for this guide.)

This process will focus on Arch Linux, but the basic methods are the same for any distribution.

{: .note }
> **WARNING**: Be very careful following these steps, as you are making very deep and potentially invasive changes to your node. **Data loss is possible.** At the end, some things may not work as expected. Linode does not explicitly support btrfs yet, so after this conversion "magic" features such as backups or volume resizing may not work. Fortunately, if you follow the steps carefully, you can always revert back to your existing system disks.

# Step 1: Backup

You may be great with backups and not need to take a new backup of your system, but while this procedure is set up to be cautious and protective of your system the possibility always exists that **you may lose data**. So grab your favorite tool and back up anything and everything you value, just in case.

# Step 2: Install and Activate BTRFS Tools

To use btrfs, you need the tools. They are available in the `btrfs-progs` package, so that is the first thing to install. This will create the necessary initrd hooks and add the btrfs support programs to the node.

`````
# pacman -Sy btrfs-progs
`````

# Step 3: Enable pv-grub and btrfs

This conversion requires you to use pv-grub instead of the existing linode kernels. If you are already using pv-grub, you can probably skip some of these steps but read them carefully.

## Prepare the Kernel
The first part of this process is to ensure the kernel is set up and, while we are here, add btrfs support to the initrd.

Log into your Linode and open `/etc/mkinitcpio.conf` in your favorite editor. Ensure the hooks and modules lines are both configured for btrfs. For example:

`````
MODULES="btrfs"
HOOKS="base udev autodetect modconf block filesystems keyboard fsck btrfs"
`````

Now it is time to reinstall the kernel - this will ensure that the initrd is created with the new settings: (The output below has been heavily abridged.)

`````
# pacman -Sy linux
 ...
warning: linux-3.18.6-1 is up to date -- reinstalling
...
:: Proceed with installation? [Y/n]
...
>> Generating initial ramdisk, using mkinitcpio.  Please wait...
==> Image generation successful
`````

## Configure pv-grub

If you do not have a pv-grub configuration file already, you will need to create one. For Arch Linux, this is very simple. Create the `/boot/grub` directory with `mkdir /boot/grub` and then create a simple text file in `/boot/grub/menu.lst` with the following content:
`````
timeout 15

title           Arch Linux
root            (hd0)
kernel          /boot/vmlinuz-linux root=/dev/xvda ro
initrd          /boot/initramfs-linux.img

title           Arch Linux Fallback
root            (hd0)
kernel          /boot/mlinuz-linux root=/dev/xvda ro
initrd          /boot/initramfs-linux-fallback.img
`````

## Test pv-grub
Edit the configuration profile for your Linode and select the "pv-grub" kernel. [![Boot Settings](/docs/assets/pv-grub.png)](/docs/assets/pv-grub.png)

To be sure everything is working, reboot your Linode and ensure that it boots correctly. If you connect to the console in time, you should see the standard Grub boot menu.

[![GRUB Menu](/docs/assets/grub-menu.png)](/docs/assets/grub-menu.png)

Either way, you can tell by running `uname -a` and confirming that it matches the kernel version installed by Arch instead of the Linode kernel.

[![Uname Output](/docs/assets/uname.png)](/docs/assets/uname.png)

# Step 4: New Disk Images

Since pv-grub does not support btrfs, you will need to create a new 'boot' volume. (If you have been using Linux for a long time, you may remember a similar process with Lilo.)

Simply log into the [Linode Manager](https://manager.linode.com) and select your node. From the node dashboard, select **Create a new disk**.

For more details, read [this library document](https://www.linode.com/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles#creating-a-blank-disk).

## Boot Disk
The first disk to be created is going to be mounted under /boot, to hold the pv-grub configuration and bootable kernels.

The disk name can be anything you like, but to keep it simple you may wish to call it "Boot". It should be ext4 and doesn't need to be larger than 512M.

[![Boot Disk](/docs/assets/newdisk-boot.png)](/docs/assets/newdisk-boot.png)

## New Root Disk

Now it is time to create a new disk image to hold the data from your root filesystem. (For this guide, call it "BTRFS Root".) The filesystem type should be **unformatted/raw** and the size must be larger than the used space your existing root device. (You can use the `df -h /` command to find out how much space is in use on the root filesystem.)

{: .note }
> **Note:** This size will be the final size of your device, so make it as large as you are likely to need.

[![Root Disk](/docs/assets/newdisk-root.png)](/docs/assets/newdisk-root.png)

# Step 5: Enter Rescue Mode

The next few steps are all done from Rescue mode. From the node page, select **Rescue** and attach the devices as follows:

- **xvda**: Boot
- **xvdb**: Old root (probably called something like "Arch Linux 2013.06 Disk Image")
- **xvdc**: BTRFS Root
- **xvdd**: None

[![Rescue Mode](/docs/assets/rescuemode.png)](/docs/assets/rescuemode.png)

For more information on rescue mode, check out [this article](https://www.linode.com/docs/troubleshooting/rescue-and-rebuild/#booting-into-rescue-mode).

# Step 6: Mount the Old Root Volume

Once the rescue image is running, the next step is to open the console and mount the root volume.

From the console, create 2 directories under `/mnt`: `oldroot` and `btrfsroot`.

````` .sh
# mkdir /mnt/oldroot /mnt/btrfsroot
`````

Then, mount the old root device under `/mnt/oldroot`. We are mounting it read-only for safety, since we will not need to write to it.

````` .sh
# mount /dev/xvdb /mnt/oldroot -o ro
`````


# Step 7: Create the BTRFS Filesystem
{: .note }
> Be **very** careful to use the correct volume name here. If you attached them as listed above, the empty disk will be `xvdc`. BTRFS will try to detect any existing filesystems and abort, but that is not a guarantee of safety.

````` .sh
# mkfs.btrfs /dev/xvdc
`````

If this does not throw any errors, you are now the proud owner of a new (empty) btrfs volume!

# Step 8: Sync Data
Now it is time to mount the new btrfs root device and copy the data. Start by mounting it to /mnt/btrfsroot:

````` .sh
# mount -t btrfs /dev/xvdc /mnt/btrfsroot
`````

To save a step later, we will also mount the new 'boot' volume:

````` .sh
# mkdir /mnt/btrfsroot/boot
# mount /dev/xvda /mnt/btrfsroot/boot
`````

[![BTRFS Setup](/docs/assets/btrfs-prep.png)](/docs/assets/btrfs-prep.png)

The data copy is very straightforward. First, run it in noop mode to verify that it is going to do the correct thing:

````` .sh
# rsync -Pavlx --delete -n /mnt/oldroot/ /mnt/btrfsroot
`````

You should see all of your files go by. (There may be a lot of them.) It should not show any deletions or errors, and the files should start with their correct names. If it looks wrong, double-check the command you ran. (For example, if they start with "oldroot" you have your trailing / in the wrong place.)

[![Rsync Output](/docs/assets/rescue-rsync-noop.png)](/docs/assets/rescue-rsync-noop.png)

If the output looks correct and there are no errors, run the full sync by removing the `-n`:

````` .sh
# rsync -Pavlx --delete /mnt/oldroot/ /mnt/btrfsroot
`````

This will copy all of the data from your old root filesystem to the new one.

Congratulations, you are almost done! Just a couple of final steps.

[![Rsync Finished](/docs/assets/rescue-rsync-done.png)](/docs/assets/rescue-rsync-done.png)


# Step 9: Fix Boot
Since pv-grub doesn't understand btrfs, the menu.lst you created earlier is wrong. (Not only wrong, but in the wrong place. Grub will see /boot as the main filesystem, and so it expects all of the paths and files to reside under /boot/boot.)

Additionally, the entries in `/etc/fstab` that tells the system what to mount is incorrect. So there are a couple of fixes that need to be applied before the system will boot correctly.

## PV-Grub is Confused
PV-Grub doesn't understand btrfs, and will not search as many locations for a configuration as 'normal' grub does. (It only searches `/boot/grub/menu.lst`.) Because of these limitations, it will not find the existing configuration. In addition, everything listed in the configuration needs to have the `/boot` stripped off. This is easy to fix.

Since grub is looking for a configuration at `/boot/boot/grub/menu.lst`, the first step is to move our configuration file there.

````` .sh
# cd /mnt/btrfsroot/boot
# mkdir boot
# mv grub boot
`````

[![Rescue-Grubfix](/docs/assets/rescue-grubfix.png)](/docs/assets/rescue-grubfix.png)

Now that there is a config where pv-grub will find it, it is time to update it. At this stage, there are two things wrong with the old file. First, according to grub the files are under /, not /boot. Second, in the next step you are going to change your root device.

You can edit the file by hand, but if you are using the basic one from this guide you can just replace it with this: (Remember that the file is currently in `/mnt/btrfsroot/boot/boot/grub`. Once the system is running, it will be in `/boot/boot/grub`.)

`````
timeout 15

title           Arch Linux
root            (hd0)
kernel          /vmlinuz-linux root=/dev/xvdb ro
initrd          /initramfs-linux.img

title           Arch Linux Rescue
root            (hd0)
kernel          /vmlinuz-linux root=/dev/xvdb ro
initrd          /initramfs-linux-fallback.img
`````

This will let pv-grub find the kernels and initrds that are stored in `/boot`.

[![menu.lsg](/docs/assets/rescue-grubmenu.png)](/docs/assets/rescue-grubmenu.png)

## Update fstab
Since you have moved things around and created a new volume, you will need to make changes to the fstab.

Open `/mnt/btrfsroot/etc/fstab` in your favorite editor. The first change is to add `/boot` so that it gets mounted properly. Add this line near the bottom of the file:

`/dev/xvda /boot ext4 defaults,relatime 0 1`

Next, the root volume is now btrfs on `/dev/xvdb`, so update that line accordingly:

`/dev/xvdb / btrfs defaults,relatime 0 1`

Finally, if you have a swap volume it will also need to be updated:

`/dev/xvdc none swap defaults 0 0`

If you are using the default Arch image, it will look like this:

[![FSTAB](/docs/assets/rescue-fstab.png)](/docs/assets/rescue-fstab.png)

# Step 10: Rearrange the Devices
This is the last step before booting the new system. Return to the Linode Manager and select 'edit' next to your configuration profile.

[![Profiles](/docs/assets/manager-profiles.png)](/docs/assets/manager-profiles.png)


Edit the `Block Device Assignment` section to attach the volumes as follows:

- xvda: Boot
- xvdb: BTRFS Root
- xvdc: Swap Image (if you have one)

[![Block Device Assignment](/docs/assets/profile-settings.png)](/docs/assets/profile-settings.png)

# Step 11: Reboot
You are done! When you reboot the system, it should boot cleanly to the new btrfs root. If anything goes terribly wrong, you can put the old root volume back as xvda (and swap as xvdb) and try again.

Once you are certain that the system is working, you can delete the old root volume to save quota.

If you are new to btrfs, you should definitely check out the [excellent wiki](https://btrfs.wiki.kernel.org/index.php/Main_Page) and learn about some of the features and tools available.
