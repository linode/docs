## Installing/Configuring Oracle XE 11g on Ubuntu 14

This document assumes your don't have direct root privileges while following the steps below.

### Pre Oracle XE 11g Installation Steps

1. You'll first need to get a copy of Oracle XE. This can be done by going to the [Oracle XE download page](http://www.oracle.com/technetwork/database/database-technologies/express-edition/downloads/index.html) and downloading the correct zip file for your install, in this case you will need the Linux version.

2. Next you will need to upload the Oracle XE file you just downloaded to your server, this can be done using [WinSCP](https://winscp.net/eng/download.php).

3. Once you have the file on your server, go to the directory you uploaded to, for now I'm going to assume it was uploaded to /home/ubuntu/.
        
        cd /home/ubuntu

4. Now you need to unzip the file Oracle XE file.

        unzip oracle-xe-11.2.0-1.0.x86_64.rpm.zip

5. Before going any further, there are a couple of packages that are needed, these are alien, libaio1 and unixodbc. To install these you can run the following command.
        
        sudo apt-get install alien libaio1 unixodbc

{: .note}
>
>Sometimes the alien package might not be available so to fix this run the follow oommands to install the alien package.
        
        sudo add-apt-repository "deb http://archive.ubuntu.com/ubuntu $(lsb_release -sc) main universe"
        sudo apt-get update
        sudo apt-get install alien

6. Now we need to go into the directory that was created when we unzipped the Oracle XE file.

        cd ./Disk1

7. Next we need to convert the download and unzipped RPM file to the DEB format that is used by Ubuntu.

        sudo alien --scripts -d oracle-xe-11.2.0-1.0.x86_64.rpm

8. After that has completed we need to create a chkconfig script and populate the file. So first we will create the file.
        
        sudo pico /sbin/chkconfig

    And now we will populate the file with the below content, once you paste this into your file, press CTRL+O and then ENTER to save the file changes. Then press CTRL+X to exit out of the editor.

    {: .file}
    /sbin/chkconfig
    :   ~~~ conf
        #!/bin/bash 
        # Oracle 11gR2 XE installer chkconfig hack for Ubuntu 
        file=/etc/init.d/oracle-xe 
        if [[ ! `tail -n1 $file | grep INIT` ]]; then 
            echo >> $file 
            echo '### BEGIN INIT INFO' >> $file 
            echo '# Provides: OracleXE' >> $file 
            echo '# Required-Start: $remote_fs $syslog' >> $file 
            echo '# Required-Stop: $remote_fs $syslog' >> $file 
            echo '# Default-Start: 2 3 4 5' >> $file 
            echo '# Default-Stop: 0 1 6' >> $file 
            echo '# Short-Description: Oracle 11g Express Edition' >> $file 
            echo '### END INIT INFO' >> $file 
        fi 
        update-rc.d oracle-xe defaults 80 01
        ~~~

9. We now need to make sure that the correct file permissions are set for the file we just created, we can do this be running the following command.

        sudo chmod 755 /sbin/chkconfig

10. Next we need to create another file, this time the file will store the kernel parameters which are required for Oracle XE to run. So first create the new file.

        sudo pico /etc/sysctl.d/60-oracle.conf

    And now like before we will populate the file we just created by copying the below contents into the file, once you paste this into your file, press CTRL+O and then ENTER to save the file changes. Then press CTRL+X to exit out of the editor.

    {: .file}
    /etc/sysctl.d/60-oracle.conf
    :   ~~~ conf
        # Oracle 11g XE kernel parameters  
        fs.file-max=6815744   
        net.ipv4.ip_local_port_range=9000 65000   
        kernel.sem=250 32000 100 128  
        kernel.shmmax=536870912
        ~~~

11. Now we need to load the new kernel parameters.

        sudo service procps start

12. We can now verify the new parameters are loaded by using the following command.

        sudo sysctl -q fs.file-max

13. Now we need to set up /dev/shm mount point for Oracle. Once again we are creating a new file and will then populate the file.

        sudo pico /etc/rc2.d/S01shm_load

    Now we will populate the file with the below content, once again we need to save the new changes, press CTRL+O and then ENTER to save the file changes. Then press CTRL+X to exit out of the editor.

    {: .file}
    /etc/rc2.d/S01shm_load
    :   ~~~ conf
        #!/bin/sh 
        case "$1" in 
        start) 
            mkdir /var/lock/subsys 2>/dev/null 
            touch /var/lock/subsys/listener 
            rm /dev/shm 2>/dev/null 
            mkdir /dev/shm 2>/dev/null 
        *) 
            echo error 
            exit 1 
            ;;
        esac
        ~~~

14. Again have to make sure that the file permissions on the newly created file are correct, we can do this by running the following command.

        sudo chmod 755 /etc/rc2.d/S01shm_load

15. Next we need to make sure a couple of dependencies are set for Oracle so that we don't come across any issues on the installation.

        sudo ln -s /usr/bin/awk /bin/awk
        sudo mkdir /var/lock/subsys
        sudo touch /var/lock/subsys/listener

16. Now we need to reboot the server to make sure all changes have taken affect.

        sudo shutdown -r now


### Installing Oracle XE 11g

So now onto the part as to why your here in the first place, installing Oracle XE 11g on Ubuntu 14. Once again if you just follow the below steps and throughout the steps there are additional informational bits about some errors that you might see along the way and how to get fix them.

1. So now that we've logged onto the server we need to go to the directory where we created our Oracle .deb file.

        cd /home/ubuntu/Disk1/

2. Now we're going to run the actual install of Oracle with the following command.

        sudo dpkg --install oracle-xe_11.2.0-2_amd64.deb

3. Once that has completed we need to create a directory that is required for the Oracle install.

        sudo mkdir -p /var/lock/subsys

4. The next bit is where issues occur, this is were we configure the Oracle installation. You will be asked to supply some information here, most of it you can leave as default, just the SYS and SYSTEM password will need to be set.

{: .note}
>
>A strong password is recommended with at least 8 characters in length with upper and lower case characters and numbers at a minimum.

        sudo /etc/init.d/oracle-xe configure

{: .note}
>
>If the configuration fails you need to do this before running the configure process again.
>    * rm -rf /etc/sysconfig/oracle-xe 
>    * ps -ef | grep oracle 
>    * Get the PID of the tnslsnr process and use the next command to kill the process by replacing the 'xxxx' with the process ID 
>    * sudo kill -9 xxxx

{: .note}
>
>If you have issues with the database configuration failing, check the shmmax setting below. 
>    * sudo grep -n ".*" /proc/sys/kernel/shmm
>
> Steps on how to change the shmmax value if required.
>    * sudo vi /etc/sysctl.d/60-oracle.conf 
>        * Update the 'shmmax' to: kernel.shmmax=33554432 
>    * Save and exit 
>    * sudo service procps start

{: .note}
>
>If you come across a shared memory issue where Oracle says that it can't find shared memory, you can set it with the following commands. A minimum of 1GB is recommended.
>    * rm -rf /dev/shm 
>    * mkdir /dev/shm 
>    * mount -t tmpfs shmfs -o size=4096m /dev/shm

5. Setup environment variables by editing your .bashrc file: 

        pico ~/.bashrc

6. Next you will want to start the Oracle service

        sudo service oracle-xe start

7. Add user to group dba using the command.

        sudo usermod -a -G dba ubuntu


### Initial Setup of Oracle XE 11g after Installation

1. Oracle is now started so we need to log into the database. Using the password you set when you ran the configure command previously.

        sqlplus sys as sysdba

2. Create a user account in Oracle using the below command. In this command you will need to replace the lowercase username and password with the relevant values you want to setup.

        CREATE USER username IDENTIFIED BY password; 

3. Now you need to grant your new user access to login into the database. Once again you will need to replace the lowercase username with the new username you just created.

        GRANT CONNECT, RESOURCE TO username;

4. Now exit your database by running.

        EXIT;

5. Now you can login into the database with your newly created user.

        sqlplus