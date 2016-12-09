---
author:
    name: Eriol Pole
    email: eriolpole@protonmail.ch
description: 'Installing Freeswitch 1.6 on CentOS 7'
keywords: 'freeswitch 1.6, centos 7, open source, VoIP, SIP, H263, H264, IVR, API, skypopen, H.323, SCCP'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, December  9th, 2016'
title: 'How to Install Freeswitch 1.6 on CentOS 7'
contributor:
    name: Eriol Pole
    email: eriolpole@protonmail.ch
---

## Introduction

Following this guide you will be able to install freeswitch on centos 7 and test its PBX functionality. 

Freeswitch is a free telephony platform that operates under a free software license [Mozilla Public License](https://www.mozilla.org/en-US/MPL/) . Its core library is libfreeswitch and it can be used as a stand-alone application or integrated with other projects. It can be used as a PBX Telefony Server or Soft Switch Server capable of handling thousandas of concurrent calls.

Use can use freeswitch for building a PBX Telefony Server with all of its feautes ( connecting internat phones, IVR, integrating with PSTN networks, configuring VoIP providers, sip trunking etc ), integrating it with other open source web application to built an open source voip switch ( including billing, configuring providers and customers)

{: .note}
>
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide. 

## Before You Begin

1. Be sure that your CentOS 7 Linode Server is up and runing.
2. Check your user and make sure that you are root:

    `whoami`

 If you see that you are root than go on:

    `root`
	
 If not take sudo privileges by executing the following command:

    `sudo su`
	
 Follow by your root password.

{: .note}
>
> Check centos [User and Group Management Tools](https://www.centos.org/docs/5/html/Deployment_Guide-en-US/s1-users-tools.html) and [How To Become Root](https://wiki.centos.org/TipsAndTricks/BecomingRoot)
	
3. Make sure to check that the server ip up to date byt excuting the following command: 

 `yum -y update`

4. Disable SELinux: Navigate to `/etc/selinux/config` and modify it as below:

    {: .file-excerpt}
    /etc/selinux/config
    :   ~~~ config
        SELINUX=disabled
        ~~~

{: .note}
>
> To edit a file in centos please use vi and follow  [Vi Guide] (https://www.cs.colostate.edu/helpdocs/vi.html)

5. Reboot your server:

 `reboot`


## Install Base Packages

1. Install Development Tools

`yum -y groupinstall "Development tools"`

2. Enable Epel Repository

`yum -y install epel-release`

3. Enable Freeswitch Repository

`rpm -Uvh http://files.freeswitch.org/freeswitch-release-1-6.noarch.rpm`

4. Update

`yum update`

## Install Freeswitch

1. Install dependencies for freeswitch

`yum install -y git gcc-c++ autoconf automake libtool wget python ncurses-devel zlib-devel libjpeg-devel openssl-devel e2fsprogs-devel sqlite-devel libcurl-devel pcre-devel speex-devel ldns-devel libedit-devel libxml2-devel libyuv-devel opus-devel libvpx-devel libvpx2* libdb4* libidn-devel unbound-devel libuuid-devel lua-devel libsndfile-devel yasm-devel`

2. Navigate to `/usr/local/src`

`cd /usr/local/src`

3. Clone freeswitch version 1.6 from git 

`git clone https://freeswitch.org/stash/scm/fs/freeswitch.git`

4. Navigate to `/usr/local/src/freeswitch`

`cd /usr/local/src/freeswitch`

5. Execute bootstrap.sh

`./bootstrap.sh -j`

6. Enable mod_xml_curl, mod_xml_cdr, mod_perl (If you want to use calling card features)

`sed -i "s#\#xml_int/mod_xml_curl#xml_int/mod_xml_curl#g" /usr/local/src/freeswitch/modules.conf`
`sed -i "s#\#mod_xml_cdr#mod_xml_cdr#g" /usr/local/src/freeswitch/modules.conf`

{: .note}
>
> To add a module use have to remove the "#" comment character at the begining of the line. To remove a module we have to add the "#" comment character. 

7. Compile

`./configure`

8. Install Freeswitch with sound files

`make`
`make install`
`make cd-sounds-install`
`make cd-moh-install`

9. Install mod_perl ( Optional )

`sed -i "s#\#languages/mod_perl#languages/mod_perl#g" /usr/local/src/freeswitch/modules.conf`
`./configure`
`make mod_perl-install`

10. Create symbolic links for Freeswitch executables

`ln -s /usr/local/freeswitch/bin/freeswitch /usr/local/bin/freeswitch`
`ln -s /usr/local/freeswitch/bin/fs_cli /usr/local/bin/fs_cli`

11. Reboot server 

`reboot`

## Try It

We are now on a working freeswitch paltform. Let's make some test to be sure that it works.

1. Check freeswitch status

`service freeswitch status`

2. Enter to freeswitch cli

`fs_cli`

3. Exit freeswithc cli

`/exit` 

or 

`/quit` 

or 

"ctrl + d "

4. Start freeswitch service

`service freeswitch start`

or 

`/etc/init.d/freeswitch start`

5. Stop freeswitch service

`service freeswitch stop`

or 

`/etc/init.d/freeswitch stop`

6. Type /help <enter> to see a list of commands

`/help`

## What to do Next ?!

1. Configure sip accounts using the freeswitch documentation

[Configuring SIP](https://wiki.freeswitch.org/wiki/Configuring_SIP)
[Sofia SIP](http://wiki.freeswitch.org/wiki/Sofia-SIP)


2. Securing freeswitch

[Secure Freeswitch](https://freeswitch.org/confluence/display/FREESWITCH/Security)
[SIP TLS](https://wiki.freeswitch.org/wiki/SIP_TLS)
