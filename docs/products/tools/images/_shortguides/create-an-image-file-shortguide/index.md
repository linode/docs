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

#### Compressing the Image File

After the image file has been created, it needs to be compressed using the gzip utility.

-   **Linux and macOS**: Run the following command, replacing *[file.img.gz]* with the file name of your image. See [Archiving and Compressing files with GNU Tar and GNU Zip](/docs/guides/archiving-and-compressing-files-with-gnu-tar-and-gnu-zip/) for additional information on gzip.

        gzip [file.img] [file.img.gz]

-   **Windows**: Use a third party tool that supports gzip compression, such as [7-Zip](https://www.7-zip.org/).

#### Determining the Uncompressed File Size

Knowing the *uncompressed* size of an image file is helpful for planning the storage requirements of Linodes deployed using that image. This information also ensures you stay within the [limits of the Images service](/docs/products/tools/images/#limits). The best way to determine the uncompressed size of a gzip archive is to uncompress that archive and then examine its file size. Alternatively, use the zcat utility by run the following command, replacing *[file.img.gz]* with the file name of your image.

    zcat [file.img.gz] | wc -c