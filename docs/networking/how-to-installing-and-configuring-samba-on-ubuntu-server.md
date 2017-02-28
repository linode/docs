---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Samba is is a program that can bridge the complexity of the various Linux operating system platforms (UNIX) with a Windows machine that is run in a computer network'
keywords: 'samba, linux, ftp, smb, file sharing, network, lan'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Weekday, Month 00th, 2016'
modified: Weekday, Month 00th, 2016
modified_by:
  name: Linode
title: 'How To Installing And Configuring Samba On Ubuntu Server'
contributor:
  name: Yudhi Pratama Tanjung
  link: https://www.twitter.com/yptanjung/
  external_resources:
- '- [Samba Documentation](https://www.samba.org/samba/docs/)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.* 
<hr>

[Samba](https://www.samba.org/) is a program that can bridge the complexity of the various Linux operating system platforms (UNIX) with a Windows machine that is run in a computer network. Samba is an application from UNIX and Linux, known as SMB (Service Message Block) protocol. Many operating systems such as Windows and OS / 2, which uses SMB to create a client / server network. Samba protocol allows the server Linux / UNIX to communicate with client machines that use the Windows OS in a single network.
  
## Before You Begin
Please update your server with commands from your shell :

    sudo apt-get update
    sudo apt-get upgrade

## Installing Samba
    sudo su
    apt-get install samba -y 
    
## Configuring On Samba Server


1.  Create a folder to be shared with the client computer. As an example I will create a folder `/myfolder` in the `/home` folder.

        mkdir /home/myfolder

2.  Change folder permission to **777**.

        chmod 777 /home/myfolder

3.	Configuring file **smb.conf** in `/etc/samba/`.

        nano /etc/samba/smb.conf


4.	And then add the script below :
    
        {: .file}
        /srv/terraria/config.txt
        :   ~~~ conf
            [data_server]
            path = /home/myfolder/
            browseable = yes
            read only = no
            guest ok = yes
            writeable = yes 
            ~~~

    For Your Information :

    `[data_server]`  =  folder name that will appear when sharing.
    
    `path` = the location of a shared folder.
    
    `browseable = yes` means the folder can be browsed
    
    `read only = no` means the folder is not only read.
    
    `guest ok = yes` means for user service, there is a guest account, so no need to enter a password while the `guest ok = no` means a request requires authentication of users registered / no account Guest.
    
    `writeable` = `yes` meaning that the folder can be written or edited.

5.	Restart samba service.

        service smbd restart

## Configuring On Samba Client

On the client side, if we want to add a folder on the share, we need to do the following:
1.	Create a folder to put the folder will be shared (**myclientfolder**). 

        mkdir /mnt/myclientfolder

2.	Then mounting another computer folder to your computer.

        mount -t cifs //ip-address-server-samba/myfolder /mnt/myclientfolder -o password=

3.	To disconnect the folder that had been mounted, please type the command:
        
        umount /mnt/myclientfolder

## More Information
You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.
   
- [Samba Documentation](https://www.samba.org/samba/docs/)