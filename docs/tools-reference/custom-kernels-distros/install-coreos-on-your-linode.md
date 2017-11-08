---
deprecated: true
author:
  name: Linode Community
  email: docs@linode.com
description: 'CoreOS is a container-centric Linux distribution designed for clustered systems running in the cloud. This guide details installing CoreOS on a KVM Linode.'
keywords: ["coreos", "custom", "finnix", "lish", "kvm"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-01-07
modified: 2016-01-08
modified_by:
  name: Linode
title: Install CoreOS on Your Linode
contributor:
  name: Michael Zuo
  link:
  external_resources:
  - '[CoreOS official documentation pages](https://coreos.com/docs/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

{{< note >}}
CoreOS Container Linux is now available for deployment from the Linode Manager.
{{< /note >}}

[CoreOS](https://coreos.com/) is a container-centric Linux distribution designed for clustered systems running in the cloud. With user applications running inside containers, the host system itself provides minimal functionality. This guide details installing CoreOS on a **KVM** Linode. If you're running a Xen Linode, you can [upgrade](/docs/platform/kvm-reference/#how-to-enable-kvm), but it is currently not possible to install CoreOS on a Xen Linode.

CoreOS is not officially supported by Linode so there are limitations to using it in comparision to the Linux images provided in the Linode Manager.

*   The CoreOS installer will create a partition table on the disk image which will interfere with the [Linode Backup](/docs/platform/backup-service) service because the disk image will not be directly mountable.

*   Unlike the case with most partitioned images, you *will* be able to resize the disk image holding a CoreOS system; however, it can only grow, not shrink. CoreOS will resize its root partition to fill the disk on next boot.

{{< caution >}}
These instructions perform **destructive** operations on your Linode! You should not attempt to install CoreOS on a Linode with data you want to preserve. You may wish to [use a second Linode](/docs/security/recovering-from-a-system-compromise#using-a-second-linode) and transfer your data after installation.
{{< /caution >}}

## Before You Begin

CoreOS configures no default way to log in except by supplying an option to the kernel command line. You should prepare a [cloud-config file](https://coreos.com/os/docs/latest/cloud-config.html) with authentication details for your first login. Should you forego this option, you can always add an SSH key through Lish after installation.


## Prepare the Linode

1. From the [Linode Manager](https://manager.linode.com/), create a new Linode.

2. Under the **Disks** section of the Linode Dashboard, click on **Create a new Disk**:

    [![Create a new disk](/docs/assets/custom-distro-new-disk_small.png)](/docs/assets/custom-distro-new-disk.png)

3. Label your new disk image and choose an appropriate size. You will probably need to allocate at least **5 GB**. Set the **Type** to **unformatted / raw**.

    [![Specify disk name and size](/docs/assets/coreos-disk-image-small.png)](/docs/assets/coreos-disk-image.png)

   If you're not sure how big your disk image needs to be, you may wish to choose a small size so that you can grow the disk later. You will not be able to shrink the disk image after it has been generated.

4. Return to the **Linode Dashboard** and select the **Rescue** tab. Check to make sure the CoreOS disk image you created is set as `/dev/sda` and all other selectable devices set to **--None--**, then click the **Reboot into Rescue Mode** button. Your Linode will now boot into the Finnix recovery image.

    [![Set /dev/sda to CoreOS disk image](/docs/assets/coreos-device-identifier-small.png)](/docs/assets/coreos-device-identifier.png)

5.  Use [Lish](/docs/networking/using-the-linode-shell-lish) to access your Linode. From the **Remote Access** tab, go to the bottom of the page and under **Console Access**, click the link to the right of **Lish via SSH** to open an SSH connection in the local system's terminal.

## Collect Installation Files

{{< note >}}
These commands should be run from a root prompt under Finnix through Lish.
{{< /note >}}

CoreOS can be installed using a self-contained [script](https://github.com/coreos/init/blob/master/bin/coreos-install) which automates the task of downloading an appropriate release image and copying it to disk.

1.  In order to securely download this script, it's recommended to install the appropriate CA certificates from the Debian repositories:

        apt-get update
        apt-get install ca-certificates

2.  Now download the installation script from GitHub and mark it executable:

        wget https://raw.githubusercontent.com/coreos/init/master/bin/coreos-install
        chmod +x coreos-install

    You may wish to read the options available to install CoreOS:

        ./coreos-install -h

### Cloud-Config File

The easiest way to copy your cloud-config file to your Linode is to simply `cat > cloud-config.yml` and paste into a text editor in your Lish shell. At minimum, you should have an [authorized key](https://coreos.com/os/docs/latest/cloud-config.html#ssh_authorized_keys) for SSH access as shown below.

{{< file "/cloud-config.yml" aconf >}}
ssh_authorized_keys:
  - "example_public_ssh_key"

{{< /file >}}


## Install CoreOS to disk

1.  Run `coreos-install` on your disk image:

        ./coreos-install -v -d /dev/sda -c cloud-config.yml

    {{< note >}}
You can also supply any other options (see `coreos-install -h`). If you do not want verbose output, you can leave out the `-v` flag.
{{< /note >}}

2.  ADVANCED: At this point, you can modify the image by mounting `/dev/sda9`. For example, you can make additions to your cloud-config file, you can add an `authorized_keys` for the `core` user as follows:

        mount /dev/sda9
        cat > /media/sda9/home/core/.ssh/authorized_keys <<EOF
        # ... ssh keys ...  EOF

3.  Power off your Linode.

        shutdown -h now

## Configure your Linode to boot CoreOS

1.  Return to the **Linode Dashboard** and under **Dashboard** select **Create a new Configuration Profile**.

2.  Since CoreOS is installed with its own partition table and MBR, we cannot use the Linode-provided kernels. Under **Boot Settings**, click on the **Kernel** drop-down menu and select **Direct Disk**.

3.  Under **Block Device Assignment**, set **/dev/sda** to the CoreOS disk image you created and installed CoreOS to.

    [![Configuration profile](/docs/assets/coreos-config-profile.png)](/docs/assets/coreos-config-profile.png)

4.  All other settings can be left in their default state. Click **Save Changes**.

5.  Return to the **Linode Dashboard**, select the new configuration profile and click **Reboot**

## Log in to CoreOS

1.  With Lish open, you should see your Linode booting into CoreOS, finishing with a list of SSH host keys and a login prompt, something similar to:

        This is li1010-4 (Linux x86_64 4.1.7-coreos-r1) 22:19:29
        SSH host key: 36:b5:e9:cd:8b:74:e9:52:fd:54:b1:30:78:af:f2:11 (DSA)
        SSH host key: 13:fe:66:49:35:35:5e:64:ae:4f:64:65:e2:98:8a:d4 (ED25519)
        SSH host key: 60:97:2c:b3:bf:2b:42:71:11:42:93:ff:ba:9f:ca:07 (RSA)
        eth0: 203.0.113.0 2001:db8:0:123::1

        li1010-4 login:

2.  You should now be able to access your Linode via SSH. If you did not specify a user in the cloud-config file, CoreOS's default user is `core`. You should confirm that the host keys match the first time you log in, to reduce your risk from MITM attack.
