---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Determine which kernel version your Linode is running and update it to the latest available.'
keywords: ['kernel','upgrade']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-16
modified: 2018-11-08
modified_by:
  name: Linode
title: "How to Update your Linode's Existing Kernel"
contributor:
  name: Linode
promo_default: false
---
![How to Update your Linode's Existing Kernel](update-your-kernel.png "How to Update your Linode's Existing Kernel")

This guide is about updating your Linode's current kernel to a newer version. For information on how to change which kind of kernel your Linode runs, check out the [How to Change your Linode's Kernel](/docs/platform/how-to-change-your-linodes-kernel/) guide.

## Which Kernel Am I Running?

Your Linode is capable of running one of three kinds of kernels:

-   An upstream kernel that is maintained and provided by your Linux distribution's authors (this is also referred to as the distribution-supplied kernel).

-   The Linode kernel. Linode maintains an up-to-date kernel: Linode's engineering team monitors for new versions of the Linux kernel and then packages them for users shortly after they are available. These kernels are not installed on your filesystem--instead, the Linode Manager supplies them to your system when it boots.

    {{< note >}}
A version history for Linode's kernel is available [here](https://www.linode.com/kernels).
{{< /note >}}

-   A kernel that you compile from source.

The steps needed to update your kernel vary depending on the type of kernel you are running. To find out which type you're using, [SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) into your Linode and run the following command:

    uname -r

If your output contains `linode` in the version tag, then you are running the [Linode kernel](#update-your-linode-kernel):

{{< output >}}
4.14.12-x86_64-linode92
{{</ output >}}

If your output contains `generic` in the version tag, then you are probably running a [distribution-supplied kernel](#update-your-distribution-supplied-kernel):

{{< output >}}
44.15.0-29-generic
{{</ output >}}

## Update Your Linode Kernel with Linode's Cloud Manager

1.  Select the Linode from the *Dashboard* and click the **Advanced** tab.

1. Find your current *Configuration*, click on the corresponding ellipses (**...**) menu and select **Edit**.

1.  Scroll to the *Boot Settings* section.

1.  Select **Latest 64 bit** from the *Kernel* dropdown and click **Submit** to save the changes (if you need a 32-bit kernel, select **Latest 32 bit**).

1.  Reboot the Linode to boot into the new kernel and verify the kernel version:

        uname -r

    {{< output >}}
4.17.15-x86_64-linode115
{{< /output >}}

<!-- ## Update your Linode Kernel

1. Log in to the Linode Manager.

1. Navigate to the Linode's Dashboard and edit the configuration profile.

1. Under **Boot Settings**, select **Latest 64 Bit** and click **Save Changes**.

1. Reboot your Linode and verify the kernel version:

        uname -r

    {{< output >}}
4.17.15-x86_64-linode115
{{< /output >}} -->

## Update your Distribution-Supplied Kernel

If you boot your Linode using the GRUB2 or Direct Disk boot setting, your kernel is supplied by your distribution’s maintainers, not Linode. If you’ve compiled your own kernel, download a new set of kernel sources and recompile.

Update your kernel to the latest available version using the distribution’s package manager:

**CentOS**

    sudo yum update kernel

**Debian**

    sudo apt-get update
    sudo apt-get upgrade linux-base

**Ubuntu**

    sudo apt-get update
    sudo apt-get upgrade linux-generic

Reboot the Linode. When it comes back up, use the command `uname -r` to verify which version you are running. It's recommend that you compare your new kernel version against the patched version given in your distribution’s security bulletin: [CentOS](https://access.redhat.com/errata/#/?q=rhsa-2018&p=1&sort=portal_publication_date%20desc&rows=10); [Debian](https://security-tracker.debian.org/tracker/); [Ubuntu](https://people.canonical.com/~ubuntu-security/cve/).

<!-- ## Update Your Kernel with the Linode API

[Visit the API docs](https://developers.linode.com/api/v4#operation/getLinodeConfig) for more information.

To update your kernel to the latest version through the API, use the Linode’s `{linodeId}` and `{configId}`.

1.  Retrieve the Linode’s information:

        curl -H "Authorization: Bearer $TOKEN" https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

1.  Change the kernel to `linode/latest-64bit`:

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "kernel": "linode/latest-64bit"}' https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

1.  Confirm the change using the command in Step 1.

-->
