This guide shows you how to set up your own TeamSpeak 3 server on a Linode running Ubuntu/Debian. 

{: .note }
> Unlicensed use of TeamSpeak 3 allows you to run one virtual server with up to 32 slots.

##Prerequisites

1.  Create a seperate user account for your TeamSpeak 3 server. Remember to pick a strong password:

        sudo adduser ts3
        
2.  Login to your new user account:

        sudo login ts3
        
##Installation

1.  Create directory for TeamSpeak 3 and change the current directory:

        mkdir teamspeak3
        cd teamspeak3/
        
2.  Download the [most recent version](http://dl.4players.de/ts/releases/) of TeamSpeak 3:

        wget http://dl.4players.de/ts/releases/3.0.11.3/teamspeak3-server_linux-amd64-3.0.11.3.tar.gz
{: .note }
> If your Linode runs on a 32-bit kernel, download the x86 version of TeamSpeak 3 instead.
>
>     wget http://dl.4players.de/ts/releases/3.0.11.3/teamspeak3-server_linux-x86-3.0.11.3.tar.gz

3.  Unpack the .tar.gz archive you have just downloaded and remove it afterwords:

        tar -xzvf teamspeak3-server_linux*.tar.gz
        rm teamspeak3-server_linux*.tar.gz
        
  The files are now located in a subdirectory called `teamspeak3-server_linux-amd64`
  
  {: .note }
> If you happen to be in posession of a TeamSpeak 3 license, you may move your `licensekey.dat` to `teamspeak3-server_linux-amd64`.

4.  Run TeamSpeak 3 to trigger initial configuration:

        ./ts3server_startscript.sh start
   
   Now that you have started TeamSpeak 3 for the first time, the server will output relevant information for the administrator:
   
        
        
        ------------------------------------------------------------------
                              I M P O R T A N T
        ------------------------------------------------------------------
                       Server Query Admin Account created
                 loginname= "serveradmin", password= "V8Tg5nqK"
        ------------------------------------------------------------------
        
        
        ------------------------------------------------------------------
                              I M P O R T A N T
        ------------------------------------------------------------------
              ServerAdmin privilege key created, please use it to gain
              serveradmin rights for your virtualserver. please
              also check the doc/privilegekey_guide.txt for details.
        
               token=Tuxe6Ok+t2a7cqySMR7FgDxPmJ4cySqDe5cbLRp+
        ------------------------------------------------------------------
        
  Write down loginname, password and token, which will be needed in order to configurate your TeamSpeak 3 server.
  
5. Congratulations! You now have successfully installed TeamSpeak 3 on your Linode. You can use the startscript inside your TeamSpeak 3 folder to start, stop or restart your TeamSpeak 3 server:

 Start:

        ./ts3server_startscript.sh start
        
 Stop:

        ./ts3server_startscript.sh stop
        
 Restart:

        ./ts3server_startscript.sh restart
        
##Configuration

1.  Run TeamSpeak 3 Client and connect to your server (use your Linode's IP adress). 

2.  After connecting, you will be promted to enter a ServerAdmin privilege key/token, which you had written down after you started TeamSpeak 3 for the first time.
  ![ts3_1.png](/docs/assets/ts3_1.png)
  
3.  You can now configure your TeamSpeak 3 Server within your TS3 Client.
  ![ts3_2.png](/docs/assets/ts3_2.png)
  
##Set up autostart script (Optional)

Having to manually start your TeamSpeak 3 server each time your Liode reboots isn't very practical and can be quite annoying, especially if reboots happen unexpectedly. That's why it's recommended to use an autostart script:

1.  First, create an empty file for our script in `/etc/init.d`. Use an editor of your choice, in this case we use `nano`:
        
        sudo nano /etc/init.d/teamspeak3 
        
2.  Paste this script into your editor and modify the variables `USER` (user running TeamSpeak3) and `DR` (path to TeamSpeak 3 directory containing startscripts). If you  followed this guide precisely, you won't need to change them:

        #!/bin/sh
        
        ### BEGIN INIT INFO
        # Provides: 		teamspeak3
        # Required-Start: 	$local_fs $network
        # Required-Stop:	$local_fs $network
        # Default-Start: 	2 3 4 5
        # Default-Stop: 	0 1 6
        # Description: 		Teamspeak 3 Server
        ### END INIT INFO
         
        USER="ts3"
        DR="/home/ts3/teamspeak3/teamspeak3-server_linux-amd64"
         
        case "$1" in
        start)
        su $USER -c "${DR}/ts3server_startscript.sh start"
        ;;
        stop)
        su $USER -c "${DR}/ts3server_startscript.sh stop"
        ;;
        restart)
        su $USER -c "${DR}/ts3server_startscript.sh restart"
        ;;
        status)
        su $USER -c "${DR}/ts3server_startscript.sh status"
        ;;
        *)
        echo "Usage: {start|stop|restart|status}" >&2
        exit 1
        ;;
        esac
        exit 0

  Save and exit using CTRL-X and Y.
  
3.  Make the script executable:
        
        sudo chmod 755 /etc/init.d/teamspeak3
        
4.  Define the script as autostart:
      
        sudo update-rc.d teamspeak3 defaults
        
  TeamSpeak 3 will now automatically start each time your Linode reboots.