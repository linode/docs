---
slug: dropbox
description: 'Installing and configuration Dropbox on a Linode'
keywords: ["Dropbox", "debian", "centos", "fedora", "ubuntu", "headless", "storage", "cloud storage"]
tags: ["ubuntu", "debian", "centos", "fedora"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/applications/cloud-storage/dropbox/','/web-applications/cloud-storage/dropbox/debian-7.4/']
modified: 2015-06-29
modified_by:
    name: Linode
published: 2014-04-30
title: 'Installing and Configuring Dropbox'
authors: ["Linode"]
---

![Installing and Configuring Dropbox](installing-and-configuring-dropbox.png "Installing and Configuring Dropbox")

Dropbox allows for the storage of your documents, files, videos, and photographs. Whatever you choose to store will be available on the Dropbox website, as well as any computers, phones, or servers you have the Dropbox application installed.

Prior to setting up Dropbox on your Linode it is recommended to follow the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide. You will need a [Dropbox account](https://www.dropbox.com/). Dropbox can be used on Debian, Ubuntu, and any Red Hat Enterprise Linux-based OS.

## Installing Dependencies

When installing Dropbox on the latest modern Distros, the installation of a few dependencies are required before proceeding. Enter the corresponding command for the distro you are using to install these dependencies:

**Debian and Ubuntu**

    sudo apt install libc6 libglapi-mesa libxdamage1 libxfixes3 libxcb-glx0 libxcb-dri2-0 libxcb-dri3-0 libxcb-present0 libxcb-sync1 libxshmfence1 libxxf86vm1

**CentOS**

    yum install tar wget libglapi libXext libXdamage libxshmfence libXxf86vm



## Installing and Configuring Dropbox

1.  Download and install the Dropbox package:

        cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -

2.  Start the Dropbox daemon:

        ~/.dropbox-dist/dropboxd &

3.  You will receive a message stating that the computer is not linked to your Dropbox account:

        This computer isn't linked to any Dropbox account...
        Please visit https://www.dropbox.com/cli_xxxxxxx to link this device.

    Copy the unique URL. Do not copy the one above.

4.  Paste the address above into a web browser and log in to your Dropbox account. You should see the following message in your browser:

        Your computer was successfully linked to your account

    The terminal window on your Linode will show the following message:

        This computer is now linked to Dropbox. Welcome User


## Testing the Link

Any files made within your `Dropbox` directory on your Linode will also be added to Dropbox.

1.  Navigate to your Dropbox folder:

        cd ~/Dropbox

2.  Echo text into a new file:

        echo "testing...." > dropbox-test.txt

3.  Open your Dropbox account in your web browser. `dropbox-test.txt` can now be found in your files!

Congratulations! Your Linode is now configured to run Dropbox.


