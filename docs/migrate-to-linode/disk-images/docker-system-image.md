---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Have you ever wanted to create a Docker Image from a linux operating system that is still online? By following some very simple Docker commands you will be able to export a container to a tar file, transfer it to a different server, import the tar into a Docker Image, tag the image, and finally run it.'
keywords: 'Docker, Modular Server, Ubuntu, Make a Linux System image using Docker, Use Docker to Make a Full Linux System Image'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: ''
modified: Friday, May 6th, 2016
modified_by:
  name: Alex Fornuto
title: 'How to make a Linux System Docker Image'
contributor:
  name: Henry Rendler
  link: https://github.com/hentronnumerouno
external_resources:
 - '[Taring Your System](https://help.ubuntu.com/community/BackupYourSystem/TAR)'
 - '[Tagging Docker Images](https://docs.docker.com/mac/step_six/)'
 - '[Docker Docs](https://docs.docker.com/)'
--- 

Have you ever wanted to create a docker image from a running operating system? Following some very simple Docker commands you will be able to export a container to a tar file, transfer it to a different server, import the tar file into a Docker image, tag the image, and finally run it.


#### Before attempting any commands shown below make sure that you have a backup of your data!

To create a tar of the current operating system you are going to want to change into your root or home directory. You also want to make sure that you have enough storage space on your server to store the image. 

        cd /home/user
        cd /root/


If there is a folder that you do no want to backup make sure you include its path in the command below. You also want to exclude the tar you are creating from the tar source. For example, if your tar file was going to be stored in /home/john/files you would enter: 

      tar -cvpzf serverbackup.tar.gz --exclude=/home/john/files  --one-file-system /
      
      tar -cvpzf serverbackup.tar.gz --exclude=/serverbackup.tar.gz  --one-file-system /


 Depending the speed of your server and the size of the system you are backing up the time to complete the task will vary. If you are making a copy of your server and it is only running a decent sized webserver you can expect it to be close to 8 gigabytes. Once this is finished you want to the make sure that Docker is installed on the server or computer that you want to transfer the tar to. If it is all setup and ready to go, then you can continue with the tutorial. If not, you may want to check out the following tutorial:
  [Installing Docker On Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntulinux/)'

Once you have the tar image on your new system you can import it by changing to the directory containing the tar file and running the following command:

	cd /home/<dockerimagedir>/
	docker import serverbackup.tar 

 When you type this docker will list all of the current images you have installed into your docker system. You are going to want to find the one with the most recent date and it should be named <none> we are going to want to change the name of it so we are going to make a docker tag:

	docker tag containerid <dockerusername>/<serverbackup>:latest


Once this is completed you will be able to run your image. A sample Docker run command for webserver image could be:

	docker run -i -t -p 80:80 -p 443:443 -p 6789:22 <hentron>/<serverbackup> /bin/bash

This command will run the Docker container within the terminal and allow the user to kill the server by just typing exit in the terminal when they are in the root directory. If the port forwarding is setup up correctly you should be able to access your website via http and https as well as ssh through ports 80 for http, 443 for https, and 6789 for ssh.

### Troubleshooting:

If you get an error that looks like this after restarting apache2 :  

	* Restarting web server apache2                                         [fail]
 		* The apache2 configtest failed.
		Output of config test was:
		mktemp: failed to create directory via template '/var/lock/apache2.XXXXXXXXXX': No such file or 		directory
		chmod: missing operand after '755'
		Try 'chmod --help' for more information.

Try this:
    
	sudo mkdir /run/lock

If you try to ssh into your server and that doesn't work, try this:

	sudo service ssh restart
	sudo service mysql restart


If you try to access the ip or web address and there is no connection, try this:
	
	sudo service apache2 restart
	sudo service mysql restart


####If the service that you want to use is not working just try restarting it.
