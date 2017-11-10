---
author:
  name: Linode
  email: docs@linode.com
description: 'Instructions for configuring your Linode to run a native distribution-supplied kernel with PV-GRUB.'
keywords: ["pv-grub", "pvgrub", "custom linux kernel", "custom linode"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['platform/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub/', 'custom-instances/pv-grub-howto/']
modified: 2014-08-20
modified_by:
  name: James Stewart
published: 2009-09-09
title: 'Run a Distribution-Supplied Kernel with PV-GRUB'
deprecated: true
---

{{< caution >}}
This guide is for legacy Xen Linodes. For newer Linodes, consult our guide on how to [Run a Distribution-Supplied Kernel](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel).
{{< /caution >}}

PV-GRUB makes it possible to run your own kernel on your Linode, instead of using a host-supplied kernel. This is useful in cases where you'd like to enable specific kernel features, or you'd prefer to handle kernel upgrades directly.

If you'd like to run a custom distro on your Linode in combination with PV-GRUB, please follow our [Custom Distro](/docs/tools-reference/custom-kernels-distros/install-a-custom-distribution-on-a-linode/) guide before taking these steps.

Before you get started, make sure you follow the steps outlined in our [Getting Started](/docs/getting-started) guide. Your Linode needs to be in a functional state. These steps should be performed as `root` on your Linode, via an SSH session.

## Ubuntu 13.04 (Raring)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 13.04, uninstall `grub2`, and install `grub`:

        apt-get install linux-image-virtual
        apt-get purge grub2 grub-pc
        apt-get install grub
        mkdir /boot/grub
        update-grub

    When you are asked which devices you would like to install `grub` on, leave all listed devices unchecked and select `Ok` to continue. When you are asked whether you would like to continue without installing GRUB, answer `yes`. When you are asked to confirm removal of GRUB 2 from `/boot/grub`, answer `yes`. When you are asked whether you would like a `menu.lst` file generated for you, answer `yes`.

3.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 3


{{< /file-excerpt >}}


4.  Change it to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 10


{{< /file-excerpt >}}


5.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro


{{< /file-excerpt >}}


6.  Change it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=/dev/xvda console=hvc0 ro quiet


{{< /file-excerpt >}}


7.  Next, locate the line containing `groot` that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0,0)


{{< /file-excerpt >}}


8.  Change it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0)


{{< /file-excerpt >}}


9.  Issue the following command to update `grub`:

        update-grub

10. Next, open the file `/etc/init/hvc0.conf` and verify that it matches the following excerpt:

    {{< file "/etc/init/hvc0.conf" >}}
# hvc0 - getty
#
# This service maintains a getty on hvc0 from the point the system is
# started until it is shut down again.

start on stopped rc RUNLEVEL=[2345]
stop on runlevel [!2345]

respawn
exec /sbin/getty -8 38400 hvc0


{{< /file >}}


11. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Ubuntu you have deployed (32-bit or 64-bit).
12. Make sure the root device is specified as **xvda**.
13. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
14. Save your changes by clicking **Save Profile** at the bottom of the page.
15. Reboot your Linode from the **Dashboard** tab.
16. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating that you're running the native kernel:

        Linux li63-119 3.8.0-29-generic #42-Ubuntu SMP Tue Aug 13 19:40:39 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

## Ubuntu 12.04 (Precise)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 12.04, uninstall `grub2`, and install `grub`:

        apt-get install linux-virtual
        apt-get purge grub2 grub-pc
        apt-get install grub
        update-grub

    When you are asked which devices you would like to install `grub` on, leave all listed devices unchecked and select `Ok` to continue. When you are asked whether you would like to continue without installing GRUB, answer `yes`. When you are asked to confirm removal of GRUB 2 from `/boot/grub`, answer `yes`. When you are asked whether you would like a `menu.lst` file generated for you, answer `yes`.

3.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 3


{{< /file-excerpt >}}


4.  Edit the file to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 10


{{< /file-excerpt >}}


5.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro


{{< /file-excerpt >}}


6.  Edit it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
kopt=root=/dev/xvda console=hvc0 ro quiet


{{< /file-excerpt >}}


7.  Next, locate the line containing "groot" that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0,0)


{{< /file-excerpt >}}


8.  Change it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0)


{{< /file-excerpt >}}


9.  Issue the following command to update `grub`:

        update-grub

10. Next, open the file "/etc/init/hvc0.conf" and verify that it matches the following excerpt:

    {{< file "/etc/init/hvc0.conf" >}}
# hvc0 - getty
#
# This service maintains a getty on hvc0 from the point the system is
# started until it is shut down again.

start on stopped rc RUNLEVEL=[2345]
stop on runlevel [!2345]

respawn
exec /sbin/getty -8 38400 hvc0


{{< /file >}}


11. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Ubuntu you have deployed (32-bit or 64-bit).
12. Make sure the root device is specified as **xvda**.
13. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
14. Save your changes by clicking **Save Profile** at the bottom of the page.
15. Reboot your Linode from the **Dashboard** tab.
16. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux localhost 3.2.0-52-virtual #78-Ubuntu SMP Fri Jul 26 16:45:00 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux


## Ubuntu 10.04 LTS (Lucid)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Ubuntu 10.04 LTS, uninstall `grub2`, and install `grub`:

        apt-get install linux-virtual
        apt-get purge grub2 grub-pc
        rm -f /boot/grub/*
        apt-get install grub
        update-grub

    When you are asked whether you would like to continue without installing GRUB, answer `yes`. When you are asked to confirm removal of GRUB 2 from `/boot/grub`, answer `yes`. When you are asked whether you would like a `menu.lst` file generated for you, answer `yes.`

3.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {{< file "/boot/grub/menu.lst" >}}
timeout 3


{{< /file >}}


4.  Edit this line to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {{< file "/boot/grub/menu.lst" >}}
timeout 10


{{< /file >}}


5.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {{< file "/boot/grub/menu.lst" >}}
# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro


{{< /file >}}


6.  Change it to match the following excerpt:

    {{< file "/boot/grub/menu.lst" >}}
# kopt=root=/dev/xvda console=hvc0 ro quiet


{{< /file >}}


7.  Next, locate the line containing `groot` that resembles the following excerpt:

    {{< file "/boot/grub/menu.lst" >}}
# groot=de400b9f-2578-488e-8664-250a8455a6fc


{{< /file >}}


8.  Change it to match the following excerpt:

    {{< file "/boot/grub/menu.lst" >}}
# groot=(hd0)


{{< /file >}}


9.  Issue the following command to update `grub`:

        update-grub

10. Create the file `/etc/init/hvc0.conf` with the following contents:

    {{< file "/etc/init/hvc0.conf" >}}
# hvc0 - getty
#
# This service maintains a getty on hvc0 from the point the system is
# started until it is shut down again.

start on stopped rc RUNLEVEL=[2345]
stop on runlevel [!2345]

respawn
exec /sbin/getty -8 38400 hvc0


{{< /file >}}


11. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Ubuntu you have deployed (32-bit or 64-bit).
12. Make sure the root device is specified as **xvda**.
13. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
14. Save your changes by clicking **Save Profile** at the bottom of the page.
15. Reboot your Linode from the **Dashboard** tab.
16. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li263-140 2.6.32-31-generic-pae #61-Ubuntu SMP Fri Apr 8 20:00:13 UTC 2011 i686 GNU/Linux


## Debian 7 (Wheezy) / Debian 8 (Jessie)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Debian 7, along with the `grub` bootloader package:

    **32-bit Debian:** :

        apt-get install linux-image-686-pae
        mkdir /boot/grub
        apt-get install grub-legacy

    **64-bit Debian:** :

        apt-get install linux-image-amd64
        mkdir /boot/grub
        apt-get install grub-legacy

3.  Issue the following commands to generate an initial `/boot/grub/menu.lst` file:

        grub-set-default 1
        update-grub

4.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 5


{{< /file-excerpt >}}


5.  Change it to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future.

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 10


{{< /file-excerpt >}}


6.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro


{{< /file-excerpt >}}


7.  Change it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=/dev/xvda console=hvc0 ro quiet


{{< /file-excerpt >}}


8.  Next, locate the line containing `groot=` and verify that it matches the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0)


{{< /file-excerpt >}}


9.  Issue the following command to update `grub`:

        update-grub

10. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Debian you have deployed (32-bit or 64-bit).
11. Make sure the root device is specified as **xvda**.
12. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
13. Save your changes by clicking **Save Profile** at the bottom of the page.
14. Reboot your Linode from the **Dashboard** tab.
15. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li263-140 2.6.32-5-xen-686 #1 SMP Wed May 18 09:43:15 UTC 2011 i686 GNU/Linux


## Debian 6 (Squeeze)

1.  Update your package repositories and upgrade your installed packages by issuing the following commands:

        apt-get update
        apt-get upgrade --show-upgraded

2.  Issue the following commands to install the default kernel for Debian 6, along with the `grub` bootloader package:

    **32-bit Debian:** :

        apt-get install linux-image-xen-686
        mkdir /boot/grub
        apt-get install grub-legacy

    **64-bit Debian:** :

        apt-get install linux-image-xen-amd64
        mkdir /boot/grub
        apt-get install grub-legacy

3.  Issue the following commands to generate an initial `/boot/grub/menu.lst` file:

        grub-set-default 1
        update-grub

4.  Edit the `/boot/grub/menu.lst` file as follows. As noted in the file, please do not uncomment entries that begin with the `#` character. First, locate the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 5


{{< /file-excerpt >}}


5.  Change it to match the following excerpt. This will give you a bit of additional time at boot to select your desired kernel, in case you feel the need to go back to an older one in the future:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
timeout 10


{{< /file-excerpt >}}


6.  Next, locate the line containing `kopt` that resembles the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=UUID=de400b9f-2578-488e-8664-250a8455a6fc ro


{{< /file-excerpt >}}


7.  Change it to match the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# kopt=root=/dev/xvda console=hvc0 ro quiet


{{< /file-excerpt >}}


8.  Next, locate the line containing `groot=` and verify that it matches the following excerpt:

    {{< file-excerpt "/boot/grub/menu.lst" >}}
# groot=(hd0)


{{< /file-excerpt >}}


9.  Issue the following command to update `grub`:

        update-grub

10. In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the kernel, depending on the version of Debian you have deployed (32-bit or 64-bit).
11. Make sure the root device is specified as **xvda**.
12. In the **Filesystem/Boot Helpers** section, disable the **Distro Helper** option.
13. Save your changes by clicking **Save Profile** at the bottom of the page.
14. Reboot your Linode from the **Dashboard** tab.
15. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li263-140 2.6.32-5-xen-686 #1 SMP Wed May 18 09:43:15 UTC 2011 i686 GNU/Linux

## CentOS 6 and Newer

1.  Make sure your package repositories and installed packages are up to date by issuing the following command:

        yum update

2.  Run the following command to identify the kernel your CentOS system has provided:

        uname -a

3.  This command should provide output similar to that shown below:

        Linux li63-119 2.6.32-358.14.1.el6.x86_64 #1 SMP Tue Jul 16 23:51:20 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

4.  Make a note of the kernel you're currently using (`2.6.32-358.14.1.el6.x86_64` in our example). You will be replacing it with the kernel shown in the configuration below.

5.  Issue the following command to install the default kernel for CentOS6:

    **32-bit CentOS:** :

        yum install kernel-PAE.i686

    **64-bit CentOS:** :

        yum install kernel.x86_64

6.  Create a file named `/boot/grub/menu.lst` with the following contents. Adjust the `title`, `kernel`, and `initrd` lines to reflect the actual file names found in the `/boot/` directory.

    {{< file "/boot/grub/menu.lst" >}}
timeout 5
title CentOS (2.6.32-431.23.3.el6.x86_64)
    root (hd0)
    kernel /boot/vmlinuz-2.6.32-431.23.3.el6.x86_64 root=/dev/xvda
    initrd /boot/initramfs-2.6.32-431.23.3.el6.x86_64.img

{{< /file >}}


7.  In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the **Kernel**, depending on the version of CentOS you have deployed (32-bit or 64-bit).
8.  Make sure the root device is specified as **xvda**.
9.  Save your changes by clicking **Save Profile** at the bottom of the page.
10.  Reboot your Linode from the **Dashboard** tab.
11. Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li63-119 2.6.32-358.14.1.el6.x86_64 #1 SMP Tue Jul 16 23:51:20 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

## CentOS 5

[Warren Togami](http://togami.com/) was kind enough to provide a script to automate getting a native CentOS 5 kernel up and running, including with SELinux support. We will use this script in the following instructions.

1.  Issue the following commands as `root` to retrieve and run the script:

        wget -O selinux.sh http://www.linode.com/docs/assets/542-centos5-native-kernel-selinux-enforcing.sh
        chmod +x selinux.sh
        ./selinux.sh

2.  Once the script has finished, edit your Linode's configuration profile. Change the **Kernel** to **pv-grub-x86\_32** or **pv-grub-x86\_64**, depending on which version of CentOS (32-bit or 64-bit) you're running.
3.  Set the **Distro Helper** and **Automount devtmpfs** options to **No**.
4.  Click the **Save Changes** button.
5.  Reboot your Linode from the **Dashboard** tab.
6.  Once your Linode has rebooted, log in via SSH and issue the following command:

        restorecon -Rv /

7.  Your Linode should now be running a native CentOS 5 kernel. You can verify this by issuing the following command:

        uname -a

    You should see output similar to the following:

        Linux li181-194 2.6.18-194.26.1.el5xen #1 SMP Tue Nov 9 14:13:46 EST 2010 i686 i686 i386 GNU/Linux

## Fedora 17

1.  Make sure your package repositories and installed packages are up to date by issuing the following command:

        yum update

2.  Issue the following command to install the default kernel for Fedora 13:

    **32-bit Fedora:** :

        yum install kernel-PAE.i686

    **64-bit Fedora:** :

        yum install kernel.x86_64

3.  Create a file named `/boot/grub/menu.lst` with the following contents. Adjust the `title`, `kernel`, and `initrd` lines to reflect the actual file names found in the `/boot/` directory.

    {{< file "/boot/grub/menu.lst" >}}
timeout 5

title Fedora 17, kernel 3.9.10-100.fc17.x86\_64 root (hd0) kernel /boot/vmlinuz-3.9.10-100.fc17.x86\_64 root=/dev/xvda ro quiet initrd /boot/initramfs-3.9.10-100.fc17.x86\_64.img

{{< /file >}}


4.  In the Linode Manager, edit your Linode's configuration profile to use either **pv-grub-x86\_32** or **pv-grub-x86\_64** as the **Kernel**, depending on the version of Fedora you have deployed (32-bit or 64-bit).
5.  Make sure the root device is specified as **xvda**.
6.  Save your changes by clicking **Save Profile** at the bottom of the page.
7.  Reboot your Linode from the **Dashboard** tab.
8.  Once your Linode has rebooted, log in via SSH and issue the following command:

        uname -a

    You should see output similar to the following, indicating you're running the native kernel:

        Linux li63-119 3.9.10-100.fc17.x86_64 #1 SMP Sun Jul 14 01:31:27 UTC 2013 x86_64 x86_64 x86_64 GNU/Linux

Note that if you later install an updated kernel, you'll need to add an entry for it to your `menu.lst` file. By default, the first kernel in the list will be booted.
