---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Installing Asterisk 13 on CentOS 7'
keywords: ["asterisk 13", "centos 7", "centos", "open source", "private branch exchange", "pbx", "asterisk pbx", "sip", "session initiation protocol", "sip protocol", "IP PBX systems", "VoIP gateways"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2015-09-30
modified: 2015-09-30
modified_by:
    name: Linode
title: 'How to Install Asterisk on CentOS 7'
contributor:
    name: Nick Rahl
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

----

![How to Install Asterisk on CentOS 7](/docs/assets/how-to-install-asterisk-on-centos-7.jpg "How to Install Asterisk on CentOS 7")

## What is Asterisk?

Asterisk is an open source *private branch exchange* (PBX) server that uses *Session Initiation Protocol* (SIP) to route and manage telephone calls. Notable features include customer service queues, music on hold, conference calling, and call recording, among others.

This guide covers the steps necessary to provision a new CentOS 7 Linode as a dedicated Asterisk server for your home or office.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Before You Begin

1.  Create a CentOS 7 Linode in your closest datacenter (barring Atlanta, which does not currently support SIP servers). A 2GB Linode is enough to handle 10-20 concurrent calls using a non-compressed codec, depending on the processing required on each channel.

2.  Ensure you have followed the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides to prepare your server. **Do not** following the section to set up a firewall.

3.  Edit `/etc/selinux/config` to ensure SELinux is disabled:

    {{< file-excerpt "/etc/selinux/config" aconf >}}
SELINUX=disabled

{{< /file-excerpt >}}


4.  Update your packages:

        sudo yum update

5.  Reboot your Linode:

        reboot

### Configuring iptables

iptables will be used to secure the Linode against unwanted traffic. The Linode should not have any firewall rules configured.

1.  Check for current firewall rules:

        sudo iptables -L


    It should show an empty rule table:

        Chain INPUT (policy ACCEPT)
        target      prot opt source                    destination

        Chain FORWARD (policy ACCEPT)
        target      prot opt source                    destination

        Chain OUTPUT (policy ACCEPT)
        target      prot opt source                    destination


2.  Create `/etc/iptables.firewall.rules` using your preferred text editor. This file will be used to activate the firewall with the desired rules every time the Linode boots.

    {{< file "/etc/iptables.firewall.rules" aconf >}}
*filter

#  Allow all loopback (lo0) traffic and drop all traffic to 127/8 that doesn't use lo0
-A INPUT -i lo -j ACCEPT
-A INPUT -d 127.0.0.0/8 -j REJECT

#  Accept all established inbound connections
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

#  Allow all outbound traffic - you can modify this to only allow certain traffic
-A OUTPUT -j ACCEPT

#  Allow SSH connections
#
#  The -dport number should be the same port number you set in sshd_config, ie 8050
#
-A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT

# SIP on UDP port 5060, 5061 for secure signaling. Used for signals such as "hang up"
-A INPUT -p udp -m udp --dport 5060 -j ACCEPT
-A INPUT -p udp -m udp --dport 5061 -j ACCEPT

# IAX2- the IAX protocol - comment out if you don't plan to use IAX
# -A INPUT -p udp -m udp --dport 4569 -j ACCEPT

# IAX - old IAX protocol, uncomment if needed for legacy systems.
# -A INPUT -p udp -m udp --dport 5036 -j ACCEPT

# RTP - the media stream - you can change this in /etc/asterisk/rtp.conf
-A INPUT -p udp -m udp --dport 10000:20000 -j ACCEPT

# MGCP - if you use media gateway control protocol in your configuration
-A INPUT -p udp -m udp --dport 2727 -j ACCEPT


# Uncomment these lines if you plan to use FreePBX to manage Asterisk
# -A INPUT -p tcp --dport 80 -j ACCEPT
# -A INPUT -p tcp --dport 443 -j ACCEPT

#  Allow ping
-A INPUT -p icmp --icmp-type echo-request -j ACCEPT

#  Log iptables denied calls
-A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7

#  Drop all other inbound - default deny unless explicitly allowed policy
-A INPUT -j DROP
-A FORWARD -j DROP

COMMIT

{{< /file >}}


    {{< note >}}
Leave IAX commented out unless you know you need it. IAX is "Inter-Asterisk Exchange" and was meant to allow multiple Asterisk servers to communicate with one another. Some VOIP trunking providers use this, but most use SIP. Unless your VOIP provider requires it or you are running multiple Asterisk servers, you probably won't need IAX or IAX2.
{{< /note >}}

### Start Firewall at Boot

CentOS 7 does not come with the `iptables-services` pre-installed, it will have to be installed so the firewall can load at boot.

1.  Install `iptables-services`, then enable and start it:

        sudo yum install -y iptables-services
        sudo systemctl enable iptables
        sudo systemctl start iptables

2.  Load the firewall rules:

        sudo iptables-restore < /etc/iptables.firewall.rules

3.  Recheck the Linode’s firewall rules:

        sudo iptables -L

    Your output should now look like this:

        Chain INPUT (policy ACCEPT)
        target      prot opt source                    destination
        ACCEPT      all  --  anywhere                 anywhere
        REJECT      all  --  anywhere                 loopback/8              reject-with icmp-port-unreachable
        ACCEPT      all  --  anywhere                 anywhere                 state RELATED,ESTABLISHED
        ACCEPT      tcp  --  anywhere                 anywhere                 state NEW tcp dpt:8050
        ACCEPT      udp  --  anywhere                 anywhere                 udp dpt:sip
        ACCEPT      udp  --  anywhere                 anywhere                 udp dpt:iax
        ACCEPT      udp  --  anywhere                 anywhere                 udp dpts:ndmp:dnp
        ACCEPT      udp  --  anywhere                 anywhere                 udp dpt:mgcp-callagent
        ACCEPT      icmp --  anywhere                 anywhere                 icmp echo-request
        LOG          all  --  anywhere                 anywhere                 limit: avg 5/min burst 5 LOG level debug prefix "iptables denied: "
        DROP         all  --  anywhere                 anywhere

        Chain FORWARD (policy ACCEPT)
        target      prot opt source                    destination
        DROP         all  --  anywhere                 anywhere

        Chain OUTPUT (policy ACCEPT)
        target      prot opt source                    destination
        ACCEPT      all  --  anywhere                 anywhere

4.  Save this ruleset:

        /usr/libexec/iptables/iptables.init save

5.  In a new terminal, make sure you can log in:

        ssh exampleuser@xx.xx.xx.xxx


## Installing Dependencies

A number of dependencies will be to be installed prior to installing Asterisk. To install them run:

    sudo yum install -y epel-release dmidecode gcc-c++ ncurses-devel libxml2-devel make wget openssl-devel newt-devel kernel-devel sqlite-devel libuuid-devel gtk2-devel jansson-devel binutils-devel


### Installing PJPROJECT

PJPROJECT is Asterisk's SIP channel driver. It should provide improved call clarity and performance over older drivers.

1.  As a non-root user, create a directory to work from:

        mkdir ~/build

2.  Switch to that directory:

        cd ~/build

3.  Use `wget` to fetch the PJSIP fdriver source code:

        wget http://www.pjsip.org/release/2.3/pjproject-2.3.tar.bz2

4.  Extract it:

        tar -jxvf pjproject-2.3.tar.bz2

5.  Change to the newly created directory:

        cd pjproject-2.3

6.  Prepare the software to be compiled:

        ./configure CFLAGS="-DNDEBUG -DPJ_HAS_IPV6=1" --prefix=/usr --libdir=/usr/lib64 --enable-shared --disable-video --disable-sound --disable-opencore-amr

    You should not see any error messages.

7.  Ensure that all dependencies are in place:

        make dep
        make

8.  Install the packages:

        sudo make install
        sudo ldconfig

9.  Ensure the libraries have been properly installed:

        sudo ldconfig -p | grep pj

    You should get output that looks like:

        libpjsua2.so.2 (libc6,x86-64) => /lib64/libpjsua2.so.2
        libpjsua2.so (libc6,x86-64) => /lib64/libpjsua2.so
        libpjsua.so.2 (libc6,x86-64) => /lib64/libpjsua.so.2
        libpjsua.so (libc6,x86-64) => /lib64/libpjsua.so
        libpjsip.so.2 (libc6,x86-64) => /lib64/libpjsip.so.2
        libpjsip.so (libc6,x86-64) => /lib64/libpjsip.so
        libpjsip-ua.so.2 (libc6,x86-64) => /lib64/libpjsip-ua.so.2
        libpjsip-ua.so (libc6,x86-64) => /lib64/libpjsip-ua.so
        libpjsip-simple.so.2 (libc6,x86-64) => /lib64/libpjsip-simple.so.2
        libpjsip-simple.so (libc6,x86-64) => /lib64/libpjsip-simple.so
        libpjnath.so.2 (libc6,x86-64) => /lib64/libpjnath.so.2
        libpjnath.so (libc6,x86-64) => /lib64/libpjnath.so
        libpjmedia.so.2 (libc6,x86-64) => /lib64/libpjmedia.so.2
        libpjmedia.so (libc6,x86-64) => /lib64/libpjmedia.so
        libpjmedia-videodev.so.2 (libc6,x86-64) => /lib64/libpjmedia-videodev.so.2
        libpjmedia-videodev.so (libc6,x86-64) => /lib64/libpjmedia-videodev.so
        libpjmedia-codec.so.2 (libc6,x86-64) => /lib64/libpjmedia-codec.so.2
        libpjmedia-codec.so (libc6,x86-64) => /lib64/libpjmedia-codec.so
        libpjmedia-audiodev.so.2 (libc6,x86-64) => /lib64/libpjmedia-audiodev.so.2
        libpjmedia-audiodev.so (libc6,x86-64) => /lib64/libpjmedia-audiodev.so
        libpjlib-util.so.2 (libc6,x86-64) => /lib64/libpjlib-util.so.2
        libpjlib-util.so (libc6,x86-64) => /lib64/libpjlib-util.so
        libpj.so.2 (libc6,x86-64) => /lib64/libpj.so.2
        libpj.so (libc6,x86-64) => /lib64/libpj.so


### (Optional) Installing DAHDI

DAHDI, or *Digium/Asterisk Hardware Device Interface*, is the kernel module that controls telephone interface cards. This type of card is usually used when adding Asterisk to an existing call center that uses older technology.
Since it's not possible to add physical cards to a virtual machine you probably won't need the DAHDI driver installed.

There is one exception: If you plan to host conference calls on your Asterisk box where more than one person can join a conference room, DAHDI also provides the required timing source for this feature to work.


#### Install the Vanilla CentOS Kernel

Since DAHDI is a kernel module it needs kernel headers in order to compile. The Linode-supplied kernel is a different version than the headers supplied in the CentOS repository, so we'll need to switch to the distribution-supplied kernel.

Follow the instructions at [Run a Distribution-Supplied Kernel on a XEN Linode](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub) or [Run a Distribution-Supplied Kernel on a KVM Linode](/docs/tools-reference/custom-kernels-distros/run-a-distribution-supplied-kernel-with-kvm) before continuing with the next steps.

{{< caution >}}
You should not attempt to replace the Kernel on a system that is currently in production.
{{< /caution >}}

#### Build DAHDI

With the new Kernel in place, you're now ready to build DAHDI.

1.  Switch back to your build directory:

        cd ~/build

2.  Download the latest version of DAHDI (version 2.10.2 at the time of this writing):

        wget http://downloads.asterisk.org/pub/telephony/dahdi-linux-complete/dahdi-linux-complete-current.tar.gz

3.  Untar the file:

        tar -zxvf dahdi-linux-complete-current.tar.gz

4.  Switch to the new directory:

        cd dahdi-linux-complete-2.10.2+2.10.2/


    {{< note >}}
Your version may be different, so substitute `2.10.2` with the version that was extracted.
{{< /note >}}

5.  Build DAHDI:

        make

6.  Install DAHDI:

        sudo make install
        sudo make config


## Installing Asterisk

We're now ready to install Asterisk 13, the current long-term support release of Asterisk.

### Installing Asterisk from Source

1.  Switch to the build directory:

        cd ~/build

2.  Download the latest version of Asterisk 13:

        wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-13-current.tar.gz

3.  Untar the file:

        tar -zxvf asterisk-13-current.tar.gz

4.  Switch to the new Asterisk directory, replacing `13.5.0` if needed:

        cd asterisk-13.5.0


### Enable MP3 Support

To use MP3 files for Music on Hold, some dependencies will need to be installed.

1.  Install Subversion:

        sudo yum install svn

2.  Run:

        contrib/scripts/get_mp3_source.sh


### Configure and Build Asterisk

1.  Run the `configure` script to prepare the Asterisk source code for compiling:

        ./configure --libdir=/usr/lib64

        If there are any missing dependencies, install them.

2.  Start the build process:

        make menuselect

    After a short while, you should get a menu on screen that allows you to configure the features you want to build.

3.  If you want to use the MP3 format with Music on Hold, you should select `Add-Ons`, then use the right arrow to move to the right-hand list. Navigate to `format_mp3` and press enter to select it.

4.  Select addition sound packages and Music on Hold packs on the left menu, and enable the wav format for your desired language. (ie. use the `EN` package for English.)

5.  Press **F12** to save and exit.

6.  Compile Asterisk:

        make

7.  Install Asterisk on the system:

        sudo make install

8.  Install sample configuration files:

        sudo make samples

9.  Configure Asterisk to start itself automatically on boot:

        sudo make config


### Try it Out

Congratulations! You now have a working Asterisk phone server. Let's fire up Asterisk and make sure it runs.

1.  Start Asterisk:

        sudo service asterisk start

2.  Connect to Asterisk:

        asterisk -rvv

    You should get a prompt with the current version number.

3.  To see a list of possible commands:

        core show help

4.  To disconnect type:

        exit

    Once disconnected, Asterisk continues to run in the background.

## Next Steps

Now that you have an Asterisk server running on your Linode, it's time to connect some phones, add extensions, and configure the various options that are available with Asterisk. For detailed instructions, check out
the Asterisk Project's guide to [Configuring Asterisk](https://wiki.asterisk.org/wiki/display/AST/Basic+PBX+Functionality).

{{< caution >}}
When running a phone system on a remote server such as a Linode, it's always good practice to secure the signaling data with TLS and the audio portion of calls using SRTP to prevent eavesdropping. Once you have a working dial-plan, be sure to follow the [Secure Calling Guide](https://wiki.asterisk.org/wiki/display/AST/Secure+Calling) to encrypt your communications.
{{< /caution >}}
