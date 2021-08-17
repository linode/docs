---
# Shortguide: How to create an image file

headless: true
show_on_rss_feed: false
---

Creating a custom image file is typically a complex process intended for advanced system administrators. In most cases, users will be better suited creating a custom image directly from an existing Linode (see [Capture an Image](/docs/products/tools/images/guides/capture-an-image/)) or through the Linode Packer Builder (see [How to Use the Linode Packer Builder](/docs/guides/how-to-use-linode-packer-builder/)). These two methods ensure maximum compatibility with Linode and are easier to follow for a novice user.

If you do intend on creating a custom image file to upload, here are a few methods to get you started. Depending on how you obtain or generate the image, the image or image file may need further configuration so it can be used with the Image Upload feature on Linode. Keep in mind all of the requirements and considerations listed above.

- **Existing Image:** Use a compatible image from your own on-premise environment, existing cloud provider, or through an online repository (such as a distribution's official image repository).
- **Packer:** Use Packer's [QEMU Builder](https://www.packer.io/docs/builders/qemu) to automate the creation of custom images. Within the `.json` configuration file for your image, set `"accelerator": "kvm"` and `"format": "raw"`. If running Packer inside of a virtual machine, the hypervisor needs to support nested virtualization.
- **`dd`:** Install and configure an operating system on a local, remote, or virtualized system and create a disk image using the `dd` command-line tool.
- **QEMU disk image utility:** Use the [QEMU disk image utility](https://qemu-project.gitlab.io/qemu/tools/qemu-img.html) to create the image.

After the image file has been created, it needs to be compressed using gzip. See [Archiving and Compressing files with GNU Tar and GNU Zip](/docs/guides/archiving-and-compressing-files-with-gnu-tar-and-gnu-zip/).


{{< note >}}
If the uncompressed image file is larger than 4GB, the gzip utility will not be able to accurately output the uncompressed file size. If you would like to determine the uncompressed file size, either uncompress the gzip archive or run the following command, replacing *[file.img.gz]* with the file name of your image.

    zcat [file.img.gz] | wc -c
{{< /note >}}