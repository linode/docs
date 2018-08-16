---
author:
  name: Linode Community
  email: docs@linode.com
description: 'How to Update Your Kernel'
keywords: ['kernel','upgrade']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-08-16
modified: 2018-08-16
modified_by:
  name: Linode
title: "How to Update a Your Kernel"
contributor:
  name: Linode
---

## Verify Your Kernel Version

1. SSH into your Linode and run the following command:

        root@localhost:~# uname -r

    If your output contains `linode` in the version tag, then you are running the [Linode Kernel](/docs/security/update-kernel/#update-your-linode-kernel):

    {{< output >}}
    4.14.12-x86_64-linode92
    {{</ output >}}

    If your output contains `generic` in the version tag, then you are running a [distribution-supplied Kernel](/docs/security/update-kernel/#update-your-distribution-supplied-kernel):

    {{< output >}}
    44.15.0-29-generic
    {{</ output >}}

<!-- ## Update Your Linode Kernel with Linode's Cloud Manager

1. Select your Linode from the *Dashboard*

1. Click on the **Settings** tab and expand the **Advanced Configurations** section.

1. Click on the **Add Linode Configuration** link and scroll to the *Boot Settings* section.

1. Select **Latest 64 Bit (4.17.15-x86_64-linode115)** from the *Kernel* dropdown -->

## Update Your Linode Kernel

1. Log in to the Linode Manager.

1. Navigate to your Linode's dashboard and edit your configuration profile.

1. Under **Boot Settings**, select **Latest 64 Bit (4.17.15-x86_64-linode115)** and click on **Save Changes**.

1. Reboot your Linode and verify your kernel version:

        root@localhost:~# uname -r
        4.17.15-x86_64-linode115

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

Reboot your system. When it comes back up, use the command `uname -r` to verify you are running the new kernel against the patched version given in your distribution’s security bulletin; [CentOS](https://access.redhat.com/errata/#/?q=rhsa-2018&p=1&sort=portal_publication_date%20desc&rows=10), [Debian](https://security-tracker.debian.org/tracker/), [Ubuntu](https://people.canonical.com/~ubuntu-security/cve/).

<!-- ## Update Your Kernel with the Linode API

1. To update your kernel to the latest version through the API, use the Linode’s `{linodeId}` and `{configId}`:

        curl -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -X PUT -d '{
            "kernel": "linode/latest-64bit"}' https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}

    Visit the API docs for more information: https://developers.linode.com/api/v4#operation/getLinodeConfig

    - To get the Linode’s information:

            curl -H "Authorization: Bearer $TOKEN" https://api.linode.com/v4/linode/instances/{linodeId}/configs/{configId}-->

