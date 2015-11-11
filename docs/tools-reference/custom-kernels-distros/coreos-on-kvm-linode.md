---
author:
  email: muh.muhten@gmail.com
  name: Michael Zuo
description: 'How to install CoreOS on your KVM Linode.'
keywords: 'coreos,custom distro,custom distribution,kvm'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Monday, November 9th, 2015'
modified_by:
  name: Michael Zuo
published: 'Monday, November 9th, 2015'
title: Run a Custom Distro on a KVM Linode
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

[CoreOS](https://coreos.com/) is a container-centric Linux distribution designed for clustered systems running in the cloud. The host system itself provides the minimal functionality, with user applications running inside containers.

This guide details installing CoreOS on your KVM Linode. If you're currently running a Xen Linode, you can [upgrade](/docs/platform/kvm#how-to-enable-kvm), but it is currently not possible to install CoreOS on a Xen Linode.

This method of installing CoreOS creates a partition table on the disk image, which is incompatible with the Backups service. See [Caveats](#caveats) for more details.

## Before you begin

{: .note}
> These instructions perform **destructive** operations on your Linode. You should not attempt to install CoreOS on a Linode with data you'd like to keep. You may wish to [use a second Linode and transfer your data after installation](/docs/security/recovering-from-a-system-compromise#using-a-second-linode).

You should prepare a [CoreOS-style cloud-config file](https://coreos.com/os/docs/latest/cloud-config.html) with authentication details. This is because CoreOS by default configures no way to log in except by supplying an option to the kernel command line.

At minimum, you should have an `authorized_keys` file available.

## Prepare the Linode

1. From the [Linode Manager](https://manager.linode.com/), create a new Linode.

2. Under the *Disks* section of the Linode Dashboard, click on **Create a new Disk**:

    [![Create a new disk](/docs/assets/custom-distro-new-disk_small.png)](/docs/assets/custom-distro-new-disk.png)

3. Label your new disk image and choose an appropriate size. You will probably need to allocate at least **5 GB**. Set the *Type* to **unformatted / raw**.
  
    [![Specify disk name and size](/docs/assets/coreos-disk-image.png)](/docs/assets/coreos-disk-image.png)

   If you're not sure how big your disk image needs to be, you may wish to choose a small size so that you can grow the disk later. You will not be able to shrink the disk image.

4. Return to the *Linode Dashboard*, and select the **Rescue** tab. Check to make sure the disk image you created is set as `/dev/sda`, then click the **Reboot into Rescue Mode** button. Your Linode will now boot into the Finnix recovery image. Use the [Lish](/docs/networking/using-the-linode-shell-lish) shell to access your Linode.

## Collect the installation files

{: .note}
> These commands should be run from a root prompt under Finnix through Lish.

CoreOS can be installed using a self-contained [script](https://github.com/coreos/init/blob/master/bin/coreos-install) which automates the task of downloading an appropriate release image and copying it to disk.

1. In order to securely download this script, it's recommended to install the appropriate CA certificates from the Debian repositories.

        apt-get update
        apt-get install ca-certificates

2. Now download the script from GitHub and mark it executable:

        wget https://raw.githubusercontent.com/coreos/init/master/bin/coreos-install
        chmod +x coreos-install

3. You may wish to read the options available to install CoreOS:

        ./coreos-install -h

Now you will want to copy your cloud-config file to your Linode. It's probably most easy to simply `cat > cloud-config.yml` and paste into your Lish shell.  However, if you prefer, you can run the following command to start the SSH server to securely copy your cloud-config file. (Note that you will need to set up access credentials, e.g. SSH keys or a password, separately.)

        service ssh start

## Install CoreOS to disk

1. Run `coreos-install` on your disk image:

        ./coreos-install -v -d /dev/sda -c path/to/cloud-config.yml

   You can also supply any other options (see `coreos-install -h`). If you do not want verbose output, you can leave out the `-v` flag.

2. ADVANCED: at this point, you can modify the image by mounting `/dev/sda9`.  For example, if you have not provided a cloud-config file, you can add an
`authorized_keys` for the `core` user as follows:

        mount /dev/sda9
        cat > /media/sda9/home/core/.ssh/authorized_keys <<EOF
        # ... ssh keys ...  EOF

3. Power off your Linode.

        shutdown -h now

## Configure your Linode to boot CoreOS

1. Return to the *Linode Dashboard*, and under *Dashboard* select **Create a new Configuration Profile**.

2. Under *Boot Settings*, click on the *Kernel* drop-down menu and select **Direct Disk**. Since CoreOS is installed with its own partition table and MBR, we cannot use the Linode-provided kernels.

3. Under *Block Device Assignment*, set */dev/sda* to the CoreOS disk image you created and installed CoreOS to.

    [![Configuration profile](/docs/assets/coreos-config-profile.png)](/docs/assets/coreos-config-profile.png)

4. All other settings can be left in their default state.

5. Return to the *Linode Dashboard*, select the new configuration profile, and click **Reboot**

## Logging in to your Linode running CoreOS

1. With Lish open, you should see your Linode booting into CoreOS, finishing with a list of SSH host keys and a login prompt, something similar to:

        This is li1010-4 (Linux x86_64 4.1.7-coreos-r1) 22:19:29
        SSH host key: 36:b5:e9:cd:8b:74:e9:52:fd:54:b1:30:78:af:f2:11 (DSA)
        SSH host key: 13:fe:66:49:35:35:5e:64:ae:4f:64:65:e2:98:8a:d4 (ED25519)
        SSH host key: 60:97:2c:b3:bf:2b:42:71:11:42:93:ff:ba:9f:ca:07 (RSA)
        eth0: 45.33.64.4 2600:3c03::f03c:91ff:fea8:7abf

        li1010-4 login: 

2. You should now be able to access your Linode via SSH. You should confirm that the host keys match the first time you log in, to reduce your risk from MITM attack.

## Caveats

When using this method, the CoreOS installer creates a partition table on the disk image, which will interfere with the Backups service, as the disk image will not be directly mountable. Unlike the case with most partitioned images, you *will* be able to resize the disk image holding a CoreOS system; however, it can only grow, not shrink. CoreOS will resize its root partition to fill the disk on next boot.
