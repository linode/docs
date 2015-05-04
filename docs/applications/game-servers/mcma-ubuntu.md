McMyAdmin is a leader in the Minecraft server control panel industry. Used by more than 75000 servers worldwide, it is a easy, secure, and simple way to control your minecraft server. This guide will explain how to prepare your Linode, install Mono, and install, then configure, McMyAdmin.

## Prerequisites

Have the following items before you begin:

- A [Minecraft](http://minecraft.net) account.

- An up-to-date Linode running Ubuntu 14.04. We suggest you follow our [Getting Started](/docs/getting-started) guide for help configuring your Linode.

- OPTIONAL: A [McMyAdmin License Key](https://www.mcmyadmin.com/#/getpro) to remove all restrictions and nag screens from the software.

{: .note }
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Preparing your Linode

McMyAdmin has linux support, but was originally written for Windows, therefore, we need to download a few extra libraries in order to run McMyAdmin.


1.  Update the system:
```
sudo apt-get update && sudo apt-get upgrade
```
2.  Install screen, Java, and other packages required for proper operation:
```
sudo apt-get install screen python-software-properties default-jre unzip
```

If you have a firewall running on your Linode, add exceptions for McMyAdmin and Minecraft:
```
sudo iptables -A INPUT -p udp- m udp --sport 8080 --dport 1025:65355 -j ACCEPT
sudo iptables -A INPUT -p udp -m udp --sport 25565 --dport 1025:65355 -j ACCEPT
```

{: .note }
> If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these port ranges to your `/etc/iptables.firewall.rules` file.

## Install McMyAdmin

1.  From your user's home folder, download McMyAdmin into its own directory:


```
mkdir mcmyadmin
cd mcmyadmin
wget http://mcmyadmin.com/Downloads/MCMA2_glibc25.zip
```

2.  Extract the package and remove the archive file:


```
unzip MCMA2_glibc25.zip
rm MCMA2_glibc25.zip
```

3.  Install the linux libraries.

```
cd /usr/local
sudo wget http://mcmyadmin.com/Downloads/etc.zip
sudo unzip etc.zip
sudo rm etc.zip
```
4.  Create a startup script. 

```
cd ~/mcmyadmin
touch start.sh
nano start.sh
```
It should contain the following text:
```
screen -dmS mcmyadmin ./MCMA2_Linux_x86_64
```
Finally, make the script executable.
```
chmod 755 start.sh
```

5.  Move back to the McMyAdmin directory and start it up for the first time:

```
cd ~/mcmyadmin
./MCMA2_Linux_x86_64 -setpass `YourPasswordHere`
```


You will see the following text appear on your screen:

```
McMyAdmin Updater - 2.2.0.0                                                                                                                                             
                                                                                                                                                                        
The updater will download and install McMyAdmin to the current directory:                                                                                               
/home/linode/mcmyadmin).                                                                                                                                          
                                                                                                                                                                        
Continue? [y/n] :   
```
Answer yes to continue.

If all goes well, you will see text similar to the following:

```
McMyAdmin Updater - 2.2.0.0          
Downloading latest McMyAdmin release...                                                                                                                                 
Download: [####################] 100% (1583089 / 1583089 bytes)                                                                                                         
Download Complete                                                                                                                                                       
                                                                                                                                                                        
Extracting files...                                                                                                                                                     
Extracting: [####################] 100% (81 / 81 Files)Extraction Complete                                                                                                     
                                                                                                                                                                        
Running in 64-bit mode.                                                                                                                                                 
Notice  : Detecting System...                                                                                                                                           
Notice  : No virtualized environment detected.                                                                                                                          
Notice  : Linux Distribution: Ubuntu                                                                                                                                    
Notice  : Detection complete.                                                                                                                                           
Warning : No Minecraft configuration file found (Normal on a first start)                                                                                               
Notice  : Detected Java runtime version 1.7.0                                                                                                                           
Notice  : Checking for Minecraft Server updates...                                                                                                                      
Notice  : Updating Minecraft server...                                                                                                                                  
Notice  : Downloading latest Minecraft server...                                                                                                                        
Noticead: Download complete.%                                                                                                                                           
Notice  : Download successful!                                                                                                                                          
Notice  : Starting McMyAdmin Personal v2.5.4.0                                                                                                                          
Warning : No saved group information was found. Loading Defaults.                                                                                                       
Notice  : Upgraded 4 legacy groups                                                                                                                                      
Notice  : No saved schedule was found. Loading Defaults.                                                                                                                
Notice  : Checking for updates...                                                                                                                                       
Notice  : Starting webserver...                                                                                                                                         
Notice  : Checking for Minecraft Server updates...                                                                                                                      
Notice  : McMyAdmin has started and is ready for use.                                                                                                                   
Notice  : This is the first time McMyAdmin has been started.                                                                                                            
Notice  : You must complete the first-start wizard via the web interface.
```

##Configuring McMyAdmin

1.  To begin configuration, navigate in a web browser to :

```
http://YourLinodeIP:8080
```

2.  You should see a screen similar to this:

[![MCMA login screen](/docs/assets/MCMA-ubuntu-resized.png)](/docs/assets/MCMA-ubuntu.png)
3.  Login using the username *admin* and the password you provided.


{: .note }
> If the password you provided is too weak, MCMA will ask you to change it.

4. Next, go to the configuration tab. Here, you can choose the settings you want for your server.   

5. Finally, head over to the about tab, then the updates tab. If you have a license key, enter it here.

## OPTIONAL: Making the server start on boot.

1.  To have McMyAdmin start on boot, open your user’s crontab.

```
crontab -e
```
You will see the following:

```
no crontab for linode - using an empty one

Select an editor.  To change later, run 'select-editor'.
  1. /bin/ed
  2. /bin/nano        <---- easiest
  3. /usr/bin/vim.basic
  4. /usr/bin/vim.tiny

Choose 1-4 [2]: 
```
Press **ENTER** and `nano` will open.


2.  Add the following contents to the file:

```
@reboot cd ~/mcmyadmin && screen -dmS mcmyadmin ./MCMA2_Linux_x86_64
```
Once you have done this, press **CONTROL + X** on your keyboard. Nano will show the following:
```    
Save modified buffer (ANSWERING "No" WILL DESTROY CHANGES) ?                                                                                                            
 Y Yes
 N No           ^C Cancel
```
Press **Y** and `nano` will exit.

##Using the Server

1.  Now that your server is installed and configured, it can be launched by running the `start.sh` script from the `~/mcmyadmin` directory. Please note that if your current working directory is not `~/mcmyadmin/` the game will fail to start:

        cd ~/mcmyadmin/
        ./start_dst.sh

    {: .caution}
    >Do not press the **CONTROL + C** keys while in the console unless you want to stop the server.

2.  To detach from the screen session running the server console, press these two key combinations in succession:

    **CONTROL + A**<br>
    **CONTROL + D**

3.  To bring the console back, type the following command:

        screen -r

4.  To stop the server, bring back the console and press **CONTROL + C**.

## Entering The Server

Now that you have installed and configured McMyAdmin you have your very own Minecraft server for you and your friends to play on. Your users can access the server by opening the server list and clicking Direct Connect, entering your server’s IP, and clicking **Connect**.
