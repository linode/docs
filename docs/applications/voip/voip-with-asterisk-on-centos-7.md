---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Installing Asterisk 13 on CentOS 7'
keywords: 'list,of,keywords,and key phrases'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Tuesday, August 18th, 2015'
modified: Tuesday, August 18th, 2015
modified_by:
    name: Linode
title: 'Asterisk on CentOS 7'
contributor:
    name: Nick Rahl
---


#Asterisk 13 on CentOS 7

Asterisk is an open source Private Branch Exchange (PBX) server that uses Session Initiation Protocol (SIP) to route and manage telephone calls. Notable features include customer service queues, music on hold, conference calling and call recording, among many others.
For more information on Asterisk and what it can do, check out the Asterisk website, listed in the addition resources block at the end of this article.

This guide covers the steps necessary to provision a new Linode as a dedicated Asterisk server for your home or office.


##Add a new Linode

Creating a new Linode is covered in the [Getting Started Guide](/docs/getting-started), but there are a few things to consider when deploying a Linode for use with Asterisk.

###Choosing a Data Center

For best call quality, you'll want to select the data center that is geographically closest to your home or office. You should *not* select the Atlanta center, however, as the Atlanta DC blocks ports which are required to run a SIP server.
The port blocking in Atlanta is unfortunately beyond Linode's control. This guide was written using the Newark, NJ data center, and calls are working correctly.

###How big of a Linode do I need?

Asterisk is very efficient when it comes to system resources, but it is unfortunately very difficult to say exactly what your specific hardware requirements will be in a general purpose installation guide.
Some setups will require CPU intensive processes on each line such as echo cancellation or data compression, while other systems, may just pass-thru the audio data without any modification at all.

As a point of reference, a 1GB Linode should be able to handle an office with 10-20 concurrent calls using a non-compressed codec and depending on the type of processing required on each channel.
Using a Linode to host Asterisk gives you the ability to scale up hardware as your demands grow, so you may want to start with a 1GB Linode, then check your system resource usage once you have a few phone configured.


###Why CentOS?

The last decision you'll need to make is which OS to install on your Linode.
We're using CentOS because it's the officially recommended OS of the Asterisk project, and is required if you want official Asterisk support. This guide is based on CentOS 7.5.

###Deploy It!

With these things in mind, follow the steps in the [Getting Started Guide](/docs/getting-started) to deploy a new Linode with CentOS 7. Don't forget to boot it up, then set a hostname and a timezone.


##Secure your Linode (Asterisk Style)

Now that you've got your new Linode created in a nearby data center and pre-installed with CentOS, it's time to make your Linode more secure and to prepare it for Asterisk installation.
This guide assumes that you have a clean Linode and have not done anything on it yet, aside from setting a hostname and timezone.
The basic steps for securing a Linode are covered in the [Security Guide](/docs/security/securing-your-server). Since there's a few things different for an Asterisk server, we'll cover all of the steps with their Asterisk
variation here very briefly. If you'd like to know more about these basic security steps or need additional clarification, you can review the official [Linode Security Guide](/docs/security/securing-your-server).


{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


###Create a non-root User

1. Log-in to your Linode via SSH.

    ssh root@xx.xx.xx.xxx

2. Type `yes` if you get a message that reads,

    The authenticity of host [Server IP] can't be established. Are you sure you want to continue connecting (yes/no)?

3. Add a new user by entering the following command. Replace `exampleuser` with your desired username:

    adduser exampleuser

4. Set the password for your new user by entering the following command. Again replace `exampleuser` with your desired username:

    passwd exampleuser

5. You will now need to edit your sudoers file to grant your new user the correct permissions. Enter the following commands one at a time to open your sudoers file for editing:

    export EDITOR=nano
    visudo

6. Find the line that reads:

    ## Allow root to run any commands anywhere
    root     ALL=(ALL)         ALL

7. And add a new line below it, substituting `exampleuser` with your username:

    exampleuser          ALL=(ALL)         ALL

8. Press **CTRL+X**, then **Y**, then **ENTER** to save and exit.


9. Test that you can login by opening a new terminal and attempting to log in as the new user you just created.

    ssh exampleuser@xx.xx.xx.xxx

10. If all went well, you should now be logged in. Test that you can also use sudo by running the command:

    sudo ls

It will prompt you for your password again, and you should now be at a prompt which reads:

    [root@localhost exampleuser]#



###Secure SSH with Key Pairs


For increased security, we'll be using a private/public key pair for ssh authentication instead of a password.
If you don't know how to create an SSH key pair, please refer to the [Public Key Authentication Guide](/docs/security/use-public-key-authentication-with-ssh).

1. After creating your key, run the following commands on your Linode, one at a time:

    cd /home/exampleuser/
    sudo mkdir .ssh
    sudo nano .ssh/authorized_keys

2. Paste in your newly created public key then press **CTRL+X**, then **Y**, then **ENTER** to save and exit.

3. Modify the permissions on the public key by entering the following commands, one at a time on your Linode. Replace `example_user` with your username:

    sudo chown -R exampleuser:exampleuser .ssh
    sudo chmod 700 .ssh
    sudo chmod 600 .ssh/authorized_keys

4. Test that you can login by opening a new terminal and attempting to login:

    ssh exampleuser@xx.xx.xx.xxx

If all went well, you should now be logged in without getting a password prompt.



###Lock Down SSH Settings
Asterisk Servers are often targets for toll fraud. To help make it harder for would be hackers, we'll disable some of the more obvious attack vectors like root logins and password authentication.

1. Open the SSH configuration file for editing by entering the following command:

    sudo nano /etc/ssh/sshd_config

2. Change the `PasswordAuthentication` setting to `no` as shown below. Verify that the line is uncommented by removing the `#` in front of the line, if there is one:

    PasswordAuthentication no

3. Change the `PermitRootLogin` setting to `no` as shown below:

    PermitRootLogin no

4. Uncomment and change the port to an alternate number, for example `8050`. Make up a number of your choosing that is between `6000` and `10000`.

    Port 8050

5. Save the changes to the SSH configuration file by pressing **CTRL+X**, then **Y**, then **ENTER** to save and exit.

6. Restart the SSH service to load the new configuration:

    sudo systemctl restart sshd

7. Test that you can login by opening a new terminal and attempting to login (replace `8050` with the port number you chose):

    ssh exampleuser@xx.xx.xx.xxx -p8050


###Firewall for Asterisk

We'll be using iptables to secure our Linode against unwanted traffic. The Linode firewall configuration in the [Security Guide](/docs/security/securing-your-server) is a good starting point for *web servers*,
but it is not appropriate for an Asterisk phone server as Asterisk uses a different set of ports. Asterisk uses the SIP protocol for voice communications. If you want to hear the person on the other end of the phone,
you're going to need to open a range of ports that Asterisk will use for voice data packets as well as call signaling.

If this is a fresh Linode, you shouldn't have any firewall rules configured yet.

1. Run the command:

    sudo iptables -L


It should show an empty rule table which looks like:

    Chain INPUT (policy ACCEPT)
    target      prot opt source                    destination

    Chain FORWARD (policy ACCEPT)
    target      prot opt source                    destination

    Chain OUTPUT (policy ACCEPT)
    target      prot opt source                    destination


2. Create a file on your Linode that will store the rules. This file will be used to activate the firewall with your desired rules every time the Linode boots, so you're never running without firewall protection.

    sudo nano /etc/iptables.firewall.rules

3. Paste in the following rules:


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
    -A INPUT -p tcp -m state --state NEW --dport 8050 -j ACCEPT

    # SIP on UDP port 5060. Used for signals such as "hang up"
    -A INPUT -p udp -m udp --dport 5060 -j ACCEPT

    # IAX2- the IAX protocol - comment out if you don't plan to use IAX
    # -A INPUT -p udp -m udp --dport 4569 -j ACCEPT

    # IAX - old IAX protocol, uncomment if needed for legacy systems.
    # -A INPUT -p udp -m udp --dport 5036 -j ACCEPT

    # RTP - the media stream - you can change this in /etc/asterisk/rtp.conf
    -A INPUT -p udp -m udp --dport 10000:20000 -j ACCEPT

    # MGCP - if you use media gateway control protocol in your configuration
    -A INPUT -p udp -m udp --dport 2727 -j ACCEPT


    # Uncomment these lines if you plan to use FreePBX to manage Asterisk, or host websites on this Linode (not recommended)
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


4. If you don't plan to operate a web server, delete the lines with port 80 and 443. If you do need a web sever, uncomment those lines (by removing the `#` sign in front of them).
Hosting a website on a separate Linode is recommended over trying to run Asterisk and a web sever on the same machine.

5. Leave IAX commented out unless you know you need it. IAX is "Inter Asteresk Exchange" and was meant to allow multiple Asterisk servers to communicate with one another.
Some VOIP trunking providers use this, but most use SIP. Unless your VOIP provider requires it or you are running multiple Asterisk servers, you probably won't need IAX or IAX2.

6. Finally, make sure that no spaces occur at the beginnings of lines. Leading spaces will cause the configuration loading to fail.

7. Press **CTRL+X**, then **Y**, then **ENTER** to save and exit.


###Start Firewall at Boot

CentOS 7 does not come with the iptables-services pre-installed. You will need to install it so that your firewall is automatically loaded at boot.

1. Run each command below, one at a time:

    sudo yum install -y iptables-services
    sudo systemctl enable iptables
    sudo systemctl start iptables

2. Load your firewall rules with:

    sudo iptables-restore < /etc/iptables.firewall.rules

3. Recheck your Linode’s firewall rules by entering the following command:

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


4. To save this as your current rule set, enter the following command:

    /usr/libexec/iptables/iptables.init save

5. In a new terminal, make sure you can login. Don't forget to set the custom port you setup in your ssh command:

    ssh exampleuser@xx.xx.xx.xxx -p8050


##Final Preparations

First, lets check that selinux is disabled. It should be disabled by default on CentOS 7, but since Asterisk installation will fail if its on, let's double check to be sure.

1. Run the command:

    cat /etc/selinux/config

2. In the output, look for a line that reads:

    SELINUX=disabled

3. If it says anything else, you'll need to turn it by editing `/etc/selinux/config` by typing:

    nano /etc/selinux/config

then change the line to read

    SELINUX=disabled

4. Save the changes by pressing **CTRL+X**, then **Y**, then **ENTER** to save and exit.

5. Install updated packages with:

    sudo yum update -y

6. Finally, reboot your Linode by typing:

    reboot



##Install Dependencies

Before we can install Asterisk proper, we'll need to install a few dependencies first. Run the following command (all as one line) to install Asterisk's package dependencies:

    sudo yum install -y epel-release dmidecode gcc-c++ ncurses-devel libxml2-devel make wget openssl-devel newt-devel kernel-devel sqlite-devel libuuid-devel gtk2-devel jansson-devel binutils-devel


###Install Pjproject

Pjproject is Asterisk's new SIP channel driver. It should provide improved call clarity and performance over older drivers.
Since pjproject has been moved to its own project, you'll need to install the pjproject driver first, before installing Asterisk.

First, lets create a directory that we can work in while we compile software. Make sure you are running as a regular user, not as root for these next steps.

1. Run this command, substituting in your username, to create a directory that we can work in:

    mkdir /home/username/build

2. Switch to that directory:

    cd /home/username/build

3. Use wget to fetch the pj sip fdriver source code:

    wget http://www.pjsip.org/release/2.3/pjproject-2.3.tar.bz2

4. Extract it with:

    tar -jxvf pjproject-2.3.tar.bz2

5. Change to the newly created directory:

    cd pjproject-2.3

6. Prepare the software to be compiled with the following command:

    ./configure CFLAGS="-DNDEBUG -DPJ_HAS_IPV6=1" --prefix=/usr --libdir=/usr/lib64 --enable-shared --disable-video --disable-sound --disable-opencore-amr

You should not see any error messages.

7. Run each of the following commands one at a time, and check the very end of the output for anything that indicates an error:

    make dep
    make

No errors? Good! Now we need to install the actual packages, which requires root permissions.

8. Run these commands, one at a time:

    sudo make install
    sudo ldconfig

9. Finally, check for proper installation of the libraries with:

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



###Who's your DAHDI?


DAHDI, an acronym for *Digium/Asterisk Hardware Device Interface*, is the kernel module that controls telephone interface cards- physical cards that goes inside the computer case
which allow asterisk to connect to traditional phone networks. This type of card is usually used when adding Asterisk to an existing call center that uses older technology.
Since it's not possible to add physical cards to a virtual machine (and the need to actually do so is very rare anyway) you probably won't need the DAHDI driver installed.

There is one exception however- if you plan to host conference calls on your Asterisk box where more than one person can join a conference room, DAHDI also provides the required timing source for this feature to work.

Since installing the module doesn't do any harm and is rather simple to do, its probably a good idea to install it anyway unless you know for certain you will never need conferencing functionality.
If you don't want conferencing, you can skip ahead to the [Installing Asterisk](#InstallingAsterisk) section.


####Install the Vanilla CentOS Kernel

Since DAHDI is a Kernel module it needs Kernel headers in order to compile.
Unfortunately, the Linode supplied Kernel is a different version than the headers supplied in the CentOS repository, so we'll need to tell our Linode to use the vanilla CentOS Kernel instead of the Linode version.

Since detailed instruction on [Running a Distribution-Supplied Kernel](/docs/tools-reference/custom-kernels-distros/run-a-distributionsupplied-kernel-with-pvgrub) are already available, we'll just briefly cover the required steps.

{: .caution}
>
>You should not attempt to replace the Kernel on a system that is currently in production!

1. Install the latest Kernel on your Linode with:

    yum install kernel.x86_64 -y

It should tell you what version its installing, such as:

    kernel-3.10.0-229.11.1.el7.x86_64

2. When installation is done, run:

    ls  -lah /boot

In the output, find the files that looks like:

    vmlinuz-3.10.0-229.11.1.el7.x86_64

and

    initramfs-3.10.0-229.11.1.el7.x86_64.img


The numbers may be slightly different. Copy these names to your clipboard or write them down.

3. Next, create a file named `/boot/grub/menu.lst`:

    nano /boot/grub/menu.lst

Paste in the following, adjusting the title, kernel, and initrd lines to reflect the actual file name you wrote down above:

    timeout 5
    title CentOS (3.10.0-229.11.1.el7.x86_64)
    root (hd0)
    kernel /boot/vmlinuz-3.10.0-229.11.1.el7.x86_64 root=/dev/xvda
    initrd /boot/initramfs-3.10.0-229.11.1.el7.x86_64.img


4. Save the changes by pressing **CTRL+X**, then **Y**, then **ENTER** to save and exit.

5. Now, login to your Linode dashboard. Click `Linodes` then select your Linode from the list. Select the link to `Create a new Configuration Profile`.

6. Give your profile a name, in this case we'll call it `Asterisk Kernel`.

7. In the `Kernel` drop down, choose `pv-grub-x86_64`.

8. Under `Block Device Assignment`, for `xvda`, select `CentOS 7`. For `xvdb`, select `swap`.

9. Down below, make sure the chosen root device is `xvda`.

10. Leave all other settings as they are, and click `save`.

You should return to the configuration page and will have a new profile.

11. Click the radio button next to `Asterisk Kernel` then click `reboot`.

12. Once your Linode has rebooted, login via SSH and issue the following command:

    uname -a

You should see output similar to the following, indicating that you're running the native kernel:

    Linux li1241-19 3.10.0-229.11.1.el7.x86_64 #1 SMP Thu Aug 6 01:06:18 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux



###Build DAHDI

With the new Kernel in place, you're now ready to build DAHDI.

1. Switch back to your build directory:

    cd /home/username/build

2. Then download the latest DAHDI (version 2.10.2 at the time of this writing):

    wget http://downloads.asterisk.org/pub/telephony/dahdi-linux-complete/dahdi-linux-complete-current.tar.gz

3. Untar the file:

    tar -zxvf dahdi-linux-complete-current.tar.gz

4. Then switch to the new directory:

    cd dahdi-linux-complete-2.10.2+2.10.2/


{: .note}
>
>Your version may be different, so substitute `2.10.2` with the version that was extracted.


5. Build DAHDI with:

    make

6. Then install it by entering:

    sudo make install

Followed by:

    sudo make config



##Installing Asterisk


We're now ready to install Asterisk 13, the current Long Term Support Release of Asterisk at the time of this writing.

###Get the Source

1. Switch back to your build directory:

    cd /home/username/build

2. Then download the latest version of Asterisk 13 using the command:

    wget http://downloads.asterisk.org/pub/telephony/asterisk/asterisk-13-current.tar.gz

3. Untar the file:

    tar -zxvf asterisk-13-current.tar.gz

4. Then switch to the directory (substitute `13.5.0` for the actual version number)

    cd asterisk-13.5.0


###Enable MP3 Support

If you want to be able to use MP3 files with asterisk for Music on Hold, you'll need to install a few dependencies.

1. Install subversion with:

    sudo yum install svn

2. Then run:

    contrib/scripts/get_mp3_source.sh


###Configure and Build Asterisk

We're now ready to build Asterisk

1. Run the `configure` script to prepare the Asterisk source code for compiling:

    ./configure --libdir=/usr/lib64

Keep an eye out for any missing dependences. There shouldn't be any though, since we've installed all of the prerequisites we needed.

2. Start the build process with the command:

    make menuselect

After a short while, you should get a menu on screen that allows you to configure the features you want to build asterisk with.

3. If you want to use the MP3 format with Music on Hold, you should select `Add-Ons`, then use the right arrow to move to the right-hand list. Navigate to `format_mp3` and press enter to select it.

4. You might also want to select addition sound packages and music on hold packs on the left menu and enable the wav format of them for your desired language. (ie. use the `EN` package for English)

5. Press **F12** to save and exit.

6. Finally, let's compile Asterisk! Run the command:

    make

... Then grab yourself a cup of coffee. This could take a while. When it's done, you should get a message that says, "Asterisk Build Complete".

7. Install Asterisk on the system by running:

    sudo make install

8. Install sample configuration files with:

    sudo make samples

9. Configure Asterisk to start itself automatically on boot. This can be done by running the command:

    sudo make config


###Try it Out

Congratulations! You now have a working Asterisk phone server. Let's fire up Asterisk and make sure it runs.

1. Start Asterisk by typing:

    sudo service asterisk start

2. Once Asterisk is running you can connect to it by running the command:

    asterisk -rvv

You should get a prompt with the current version number.

3. Type the command:

    core show help

To see a list of possible commands.

4. To disconnect type:

    exit

Once disconnected, Asterisk continues to run in the background.

##Next Steps

Now that you have an Asterisk server running on your Linode, it's time to connect some phones, add extensions, and configure the various options that are available with Asterisk. For detailed instructions, check out
the Asterisk Project's guide to [Configuring Asterisk](https://wiki.asterisk.org/wiki/display/AST/Basic+PBX+Functionality).




