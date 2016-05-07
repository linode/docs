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

Have you ever wanted to create a docker image from a running operating system? Following some very simple Docker commands you will be able to export a container to a tar file, transfer it to a different server, import the tar into a Docker image, tag the image, and finally run it.

{: .caution }
> Before attempting any commands shown below make sure that you have a backup of your data!

1.  To create a tar of the current operating system you are going to want to change into your root or home directory

        cd /home/user
        cd /root/

2.  Then issue the following command:

    IF YOU HAVE ANY FOLDER THAT YOU DO NOT WANT TO BACKUP MAKE SURE TO ADD THEM TO THE COMMAND using the 

      --exclude=/donotbackthisup 
      tar -cvpzf serverbackup.tar.gz --exclude=/serverbackup.tar.gz  --one-file-system /


3. Depending the speed of your server and the size of the system you are backing up the time to complete the task will vary. If you are making a copy of your server and it is only running a decent sized webserver you can expect it to be close to 8 gigabytes. Once this is finished you want to the make sure that Docker is installed on the server or computer that you want to transfer the tar to. If it is all setup and ready to go, then you can continue with the tutorial. If not, you may want to check out the following tutorial:
  [Installing Docker On Ubuntu](https://docs.docker.com/engine/installation/linux/ubuntulinux/)'

4.  Once you have the tar image on your new system you can import it by changing to the directory containing the tar file and running the following command:

```
	cd /home/<dockerimagedir>/
	docker import serverbackup.tar
```

4.	 When you type this docker will list all of the current images you have installed into your docker system. You are going to want to find the one with the most recent date and it should be named <none> we are going to want to change the name of it so we are going to make a docker tag:

`	docker tag containerid <dockerusername>/<serverbackup>:latest`

5.	Once this is completed you will be able to run your image. A sample Docker run command for webserver image could be:

`	docker run -i -t -p 80:80 -p 443:443 -p 6789:22 <hentron>/<serverbackup> /bin/bash`

6.  This command will run the Docker container within the terminal and allow the user to kill the server by just typing exit in the terminal when they are in the root directory. If the port forwarding is setup up correctly you should be able to access your website via http and https as well as ssh through ports 80 for http, 443 for https, and 6789 for ssh.

## Troubleshooting:

1. If you get an error that looks like this :  
	```
	* Restarting web server apache2                                         [fail]
 		* The apache2 configtest failed.
		Output of config test was:
		mktemp: failed to create directory via template '/var/lock/apache2.XXXXXXXXXX': No such file or 		directory
		chmod: missing operand after '755'
		Try 'chmod --help' for more information.
```

    Try this:
    
`	sudo mkdir /run/lock
`
2. If you try to ssh into your server and that doesn't work, try this:

```
	sudo service ssh restart
	sudo service mysql restart
```

4.	If you try to access the ip or web address and there is no connection, try this:
	
```
	sudo service apache2 restart
	sudo service mysql restart
```

5. If the service that you want to use is not working just try restarting it.



<hr>
