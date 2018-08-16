---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Update Your Linux Kernel'
keywords: ['kernel','upgrade']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-16
modified: 2018-08-16
modified_by:
  name: Linode
title: "How to Update Your Linux Kernel"
contributor:
  name: Linode
---

## Verify Your Kernel Version

1.  [SSH](/docs/getting-started/#connect-to-your-linode-via-ssh) into your Linode and run the following command:

        uname -r

    If your output contains `linode` in the version tag, then you are running the [Linode Kernel](#update-your-linode-kernel):

    {{< output >}}
    4.14.12-x86_64-linode92
    {{</ output >}}

    If your output contains `generic` in the version tag, then you are running a [distribution-supplied Kernel](#update-your-distribution-supplied-kernel):

    {{< output >}}
    44.15.0-29-generic
    {{</ output >}}

<!-- ## Update Your Linode Kernel with Linode's Cloud Manager

1.  Select the Linode from the *Dashboard*

1.  Click the **Settings** tab and expand the **Advanced Configurations** section.

1.  Click **Add Linode Configuration**, add a label, and scroll to the *Boot Settings* section.

1.  Select **Latest 64 bit (4.17.15-x86_64-linode115)** from the *Kernel* dropdown.

1.  Configure Block Device Assignments as needed and click **Submit** to save the changes.

1.  Reboot the Linode to boot into the new kernel. -->

## Update Your Linode Kernel

1. Log in to the Linode Manager.

1. Navigate to the Linode's Dashboard and edit the configuration profile.

1. Under **Boot Settings**, select **Latest 64 Bit (4.17.15-x86_64-linode115)** and click **Save Changes**.

1. Reboot your Linode and verify the kernel version:

        uname -r

    {{< output >}}
4.17.15-x86_64-linode115
{{< /output >}}

## Update Your Distribution-Supplied Kernel

If you boot your Linode using the **GRUB2** or Direct Disk boot setting, your kernel is supplied by your distribution’s maintainers, not Linode. If you’ve compiled your own kernel, you’ll need to recompile using the `4.17.15` or later source code.

Update your kernel to the latest available version using the distribution’s package manager:

**CentOS**

    sudo yum update kernel

**Debian**

    sudo apt-get update
    sudo apt-get upgrade linux-base

**Ubuntu**

    sudo apt-get update
    sudo apt-get upgrade

Reboot the Linode. When it comes back up, use the command `uname -r` to verify you are running the new kernel against the patched version given in your distribution’s security bulletin: [CentOS](https://access.redhat.com/errata/#/?q=rhsa-2018&p=1&sort=portal_publication_date%20desc&rows=10); [Debian](https://security-tracker.debian.org/tracker/); [Ubuntu](https://people.canonical.com/~ubuntu-security/cve/).

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
