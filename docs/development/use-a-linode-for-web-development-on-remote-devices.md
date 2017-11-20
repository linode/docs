---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Damaso Sanoja
  link: https://twitter.com/damasosanoja
description: '.'
keywords: 'docker,container,compose,portainer,linode,remote devices'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: ''
modified:
modified_by:
  name: Linode
title: 'Use a Linode for Web Development on Remote Devices'
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Docker Hub](https://hub.docker.com/)'
---


This guide will walk you through the necessary steps to configure your Linode as an efficient Web Development environment to work from remote devices.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  Update your system (this example uses Ubuntu 16.04):

        apt update && apt upgrade

{: .note}
> The steps in this guide require root privileges. Be sure to run the steps below as `root` or with the `sudo` prefix. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Changing Paradigms Local vs. Remote

You may ask, do I need a remote development environment? A local development environment is much faster, powerful and especially more comfortable than a device like a Tablet. That could be true in most cases, but there are also many drawbacks associated with local development:

* You rely on your Workstation OS. That means you will need several Virtual Machines to overcome that limitation which brings us to the next point.
* No matter how powerful is your machine, resources are finite, depending on your project's complexity that could be a problem.
* A development environment that relies on a powerful desktop, a local NAS, multi-monitor setup, full size keyboard and mouse is by no means portable. You can use a good laptop to gain some freedom, but then you sacrifice CPU power and internal storage that could hinder your ability to run specific projects.
* Last but not least, if your Workstation fails your entire development process stops.

The above means then that it is much better to work in a SaaS on-line environment? Let's do the same and summarize the disadvantages:

* Most on-line development environments have certain limitations related with the framework you can use.
* Speed could be an issue too, especially if your project requires compiling large amounts of code.
* You won't be able to reproduce the exact production environment.
* Folders structure, assets location and most customizations are not possible, you should adapt your workflow to the chosen provider philosophy.
* Finally, cost could be a real issue since bigger plans increase your expense by a large amount.

## The Optimal Solution: the Hybrid Approach

If working locally isn't the best solution but neither is an on-line environment then what is the alternative? The answer is an hybrid solution, the best of both worlds. What would be the expectations for an ideal development environment?

* Interoperability between a Desktop, a laptop or a Tablet with total transparency.
* Centralized assets management, available from any device with an Internet connection.
* Operating System agnostic. Linux, macOS, Windows, Android, iOS.
* Comfort even while working on a remote device like a Tablet.
* Flexibility to recreate any production scenario, but also workflow flexibility to adapt to any power-user.
* Security and data integrity.
* Ability to scale power and storage on demand.
* Low cost.

## Linode to the Rescue

A properly configured Linode offers you all the benefits of the hybrid environment. This section will explain one of the many approaches you can implement to meet the proposed goals.

### Server Side Tools and Technologies

**Storage:** The main limitation of a Tablet device is it's storage capacity. That's why you need to setup a solution that brings you the ability to access all your assets from one central location. An efficient way to achieve it is using OwnCloud because you can host all your archives, dotfiles, scripts, images and more in a scalable Linode. An additional benefit is the possibility to connect external storages like Dropbox, Google Drive or OneDrive. OwnCloud have native applications for Android and iOS so managing your assets won't be a problem. You can install and configure ownCloud following our [guide](https://www.linode.com/docs/applications/cloud-storage/install-and-configure-owncloud-on-ubuntu-16-04)

**Git Version Control:** Today's web development advances won't be possible without the aid of VCS. There're many Git services available like GitHub, BitBucket, GitLab and others. You can learn more about Git and how to configure it on your Linode reading our [Getting Started with Git](https://www.linode.com/docs/development/version-control/how-to-configure-git) guide.

**Docker:** At the heart of the remote development solution is Docker which brings the ability to create almost any container environment needed for web development and production. To install Docker on your Linode please read our guide [How to Install Docker and Pull Images for Container Deployment](https://www.linode.com/docs/applications/containers/how-to-install-docker-and-pull-images-for-container-deployment) and for even more scalability you can read [How to Create a Docker Swarm Manager and Nodes on Linode](https://www.linode.com/docs/applications/containers/how-to-create-a-docker-swarm-manager-and-nodes-on-linode). You can also install Docker Compose to make complex deployments even easier.

**Portainer:** In order to ease the management of your Docker ecosystem the Portainer application will be used. Working from a Tablet even with a bluetooth keyboard is not comfortable, especially when you need to enter Docker commands that includes many options and flags. That's why this solution gives you great value and the option of using the touchscreen instead of the command line.

### Client Side Software and Tools

For the purpose of this guide the client will be a modern Android Tablet, similar applications can be found for iOS.

**SSH Client:** There are lots of free SSH Clients on the Android market. This guide will use JuiceSSH because it works fast and flawlessly with Linode servers.

**IDE:** Besides the terminal emulator a good IDE is a must for any developer. Similar to the SSH Client there are many options available both free and paid. This guide will use QuickEdit for its built-in ability to connect directly with Linode servers as well as other cloud services.

**ownCloud Client:** The native application for ownCloud allows you to manage the service and also create, edit and share files stored in it. It's a paid application but there is an open Beta version that is free.

**ES File Explorer:** This great application has many useful features including basic file editing and SFTP connection.

**Linode Manager:** The official Linode application brings you total control over your Linode Cloud. You can expect the full functionality of the web version at the grasp of your hand.

## Preparing your Remote Environment

The proposed remote development topology consists in two Linodes, one exclusively hosting ownCloud and the other running the Docker containers.

Both Linodes are flexible enough to grow on demand independently:

* The ownCloud server can use [Block Storage](https://www.linode.com/docs/platform/how-to-use-block-storage-with-your-linode) if more capacity is needed. That allows you to keep safe all your valuable data in one central location accessible from any device.
* You Docker Linode can be resized on-demand or can be part of a Docker Swarm if you need even more power.

### Installing Portainer

The easier way to start using Portainer is deploying the official image.

1. Connect to your (Docker) Linode via SSH from your local computer.

2. Create a volume for safekeeping persistent data:

        sudo docker volume create portainer_data

3. Run your container in detached mode.

        sudo docker run -d -p 9000:9000 \
        --name portainer --restart unless-stopped \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v portainer_data:/data portainer/portainer

`--name portainer`: assign a name for your container.
`-p 9000:9000`: uses the port 9000 for client connection.
`--restart unless-stopped`: auto-start on Linode boot.
`-v /var/run/docker.sock:/var/run/docker.sock`: allows docker container to communicate with host Docker environment.
`-v portainer_data:/data portainer/portainer`: mounts Portainer persistent data volume.

4. Point your browser to http://<Linode IP address or FQDN>:9000 you should be a screen similar to this:

![Portainer Login Screen](linode-on-remote-devices-01.png)

5. After registering your `admin` user you will be asked about the type of connection you are using: **Local** or **Remote**. Since you will run your containers from the same Linode choose **Local**:

![Portainer Connection Type](linode-on-remote-devices-02.png)

6. If everything goes as expected you will be presented with Portainer Dashboard.

![Portainer Dashboard](linode-on-remote-devices-03.png)

{: .note}
>
>By default your connection with Portainer GUI is not encrypted, if you need to use SSL then you must install the corresponding Certificates on your Linode and pass their location to the Docker container upon start. For more information please read the official documentation [Secure Portainer using SSL](https://portainer.readthedocs.io/en/stable/deployment.html#secure-portainer-using-ssl).

### Installing Docker Compose

As mentioned in the previous section, Docker Compose simplifies complex deployments because it reduce the amount of command line inputs, thus gaining more comfort especially from a Tablet. Installing Compose is very straight forward:

1. Download the latest version of Compose from the project repository at the time of this writing **1.17.1**.

        sudo curl -L https://github.com/docker/compose/releases/download/1.17.1/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose

2. Give the binary executable permissions.

        chmod +x /usr/local/bin/docker-compose

3. Check installation.

        sudo docker-compose --version

4. Now you can design any custom container based framework and deploy it from your Tablet running from your project's directory:

        sudo docker-compose up

## Working from your remote device

With everything setup it's time to work with your remote development environment. Hosting your containers on a Linode allows you to work in any project of your choice. You can develop a LAMP stack, program using Golang, Python, Ruby, NodeJS or use a full webstack like MeanJS. This guide will test your Web Development Environment using a simple Nginx container.

### Install a new Container from your Tablet

1. Open your browser and point it to the address: http://<Linode IP address or FQDN>:9000 from Portainer Dashboard Sidebar navigate to **App Templates** menu.

    ![Portainer App Templates](linode-on-remote-devices-04.png)

2. In the Application templates list click on **Nginx** to install the container.

    ![Portainer Templates List](linode-on-remote-devices-05.png)

3. You will see the Configuration screen from where you can name your container, choose a Docker network and even determine access control (useful for teams).

    ![Portainer Templates List](linode-on-remote-devices-06.png)

4. In case you need to customize your container you can click on **Show advanced options**.

    ![Portainer Container Advanced Options](linode-on-remote-devices-07.png)

    ![Portainer Container Advanced Options](linode-on-remote-devices-08.png)

5. Deploy your container when ready by hitting the corresponding button. The Nginx image will download automatically, after that will be available for future deployments instantly. You will be directed to the **Containers** menu from where you can manage your containers. By default new containers will run on build.

    ![Portainer Containers Menu](linode-on-remote-devices-09.png)

6. Check your installation pointing your browser to the assigned port http://<Linode IP or FQDN>:32769.

    ![Ngix welcome page](linode-on-remote-devices-10.png)

### Use Portainer to Manage your Containers

1. Navigate to the **Containers** menu on the left Sidebar and check the box close to the `web-01` container you just created. Notice you now have many options available to manage this container.

    ![Portainer Containers management](linode-on-remote-devices-25.png)

2. You can | start | stop | kill | restart | pause | resume | remove | the selected container is the same manner as you use `docker` from the terminal. You can also edit `web-01` container by clicking on its name.

3. Remove `web-01` container by touching the **Remove** button, and select to automatically remove non-persistent volumes.

    ![Portainer Remove Container](linode-on-remote-devices-26.png)

### Bind Volumes to your Container

1. From the **Add Templates** menu select again Nginx.

2. Disable access control and click on **Show advanced options**. On the Volume mapping section touch the **Bind** button for the container's `/usr/share/nginx/html` and select a host directory to bind to. If the directory doesn't exists on the host it will be created, but be warned that folder's ownership will belong to `root` user in that case.

    ![Portainer Bind Container](linode-on-remote-devices-27.png)

### Connect to your Linode host using JuiceSSH

1. Open JuiceSSH from the Main Dashboard select **Connections**.

    ![JuiceSSH Dashboard](linode-on-remote-devices-11.png)

    ![JuiceSSH Dashboard](linode-on-remote-devices-12.png)

2. Add a new Identity by swiping right to **Identities** menu and then touching the **+** sign.

    ![JuiceSSH New Identity](linode-on-remote-devices-13.png)

3. Enter a Nickname, and then fill in the Linode `sudo` username. If you are following the recommended security settings for your Linode you will need a SSH key for remote connections. Touch the **SET (OPTIONAL)** Private Key button, from there you can import or paste an existing key or create a new one from your device. It's advisable to have unique keys for each device so a new key will be generated.

    ![JuiceSSH Identity creation](linode-on-remote-devices-14.png)

    ![JuiceSSH SSH Key generation](linode-on-remote-devices-15.png)

4. Once your key is generated touch the check button on top right to save the identity.

    ![JuiceSSH Save Identity](linode-on-remote-devices-16.png)

5. From the Identities menu long-press your recently created identity a pop-up will appear, choose **Export Public Key**

    ![JuiceSSH Export SSH Key](linode-on-remote-devices-17.png)

6. Save the file using **ES Note Editor** to a know location and then transfer the `id_rsa.pub` key via USB to your local computer. Don't forget the Keys location because you will need it for others applications connecting to your Linode. Repeat the same procedure to save `id_rsa` Private key.

    ![JuiceSSH Save Key](linode-on-remote-devices-18.png)

7. From your local computer connect to your Linode server and paste the JuiceSSH Public Key in `~/.ssh/authorized_keys`. Don't forget to restart your `sshd` service.

8. Next swipe left to **Connections** menu and create a new connection by touching the **+** sign.

    ![JuiceSSH New Connection](linode-on-remote-devices-19.png)

9. Assign a Nickname to your connection, fill in the Linode IP address or FQDN and save your connection touching the check mark on top right.

    ![JuiceSSH Connection Settings](linode-on-remote-devices-20.png)

10. That's it! Touch the connection and you will enter almost instantly on your remote Linode Server!

    ![JuiceSSH Connection Menu](linode-on-remote-devices-21.png)

    ![JuiceSSH Linode Terminal](linode-on-remote-devices-22.png)

11. Let's check your Nginx container from JuiceSSH.

        sudo docker ps

    ![JuiceSSH Docker ps](linode-on-remote-devices-23.png)

12. You can stop, remove and perform any docker command just like you always do. As you had noticed at the top of the virtual keyboard you have some shortcuts pre-defined for ease of use. So if you need to use a **Ctrl+C** then you just need to touch the **CTRL** shortcut and then touch **c** letter.

    ![JuiceSSH Keyboard](linode-on-remote-devices-24.png)

13. Change to the recently created Nginx bind.

    cd /nginx/html

14. Create a test JSON file. You can include anything you want. You will need to use `sudo` because the directory is owned by `root`.

{: .file}
      /home/<user>/nginx/html/test.json
      :   ~~~ json
          ["This", "is a test", "from remote device"]
          ~~~



15. Point your browser to the Nginx server using the adequate port assigned during build (or use your custom port if you manually configured it). http://<Linode IP address or FQDN>:<assigned port>

    ![Ngix Output](linode-on-remote-devices-28.png)

16. As you can see you can now work on this Nginx project from your Tablet using JuiceSSH.

### Edit files using QuickEdit

1. Editing simple config files using `nano` is not hard. But if you are serious about working remotely from your Tablet then you will need a Text Editor capable of syntax highlighting among other things. Open QuickEdit and allow it to access photos, media, and files on your device.

    ![Open QuickEdit](linode-on-remote-devices-29.png)

2. By default you will see a blank file. Touch the menu icon on top left.

    ![Menu QuickEdit](linode-on-remote-devices-30.png)

3. Select the **Storage Manager** from the menu.

    ![Storage Manager QuickEdit](linode-on-remote-devices-31.png)

4. Now you need to create a new connection, touch the **+** button on lower right, when prompted choose FTP/FTPS/SFTP and then SFTP

    ![New Connection QuickEdit](linode-on-remote-devices-32.png)

    ![SFTP QuickEdit](linode-on-remote-devices-33.png)

5. Enter your Linode IP address or FQDN, desired label, `sudo` username and select **Key file** Mode.

    ![SFTP Configuration QuickEdit](linode-on-remote-devices-34.png)

6. Browse to the location where you saved the `id_rsa` Private Key (during JuiceSSH configuration) and select it. When ready save the connection.

    ![Storage Manager Connections QuickEdit](linode-on-remote-devices-35.png)

7. Touch your Linode connection and you will be forwarded to your remote directory structure. Find your Nginx bind mount and open the `test.json` file.

    ![Open json QuickEdit](linode-on-remote-devices-36.png)

    ![test.json json QuickEdit](linode-on-remote-devices-37.png)

8. That's it. You configured your QuickEdit application now you can open any file and work with over 50 different programming languages.

{: .note}
>
>Please be aware that if you try to edit and save this particular file you will get an error. This is due to file permissions, because the folder was created by the root user. You can change directory permissions to match the `sudo` user or you can simply create your working directory before deploying the container.

## Reviewing the desired Objectives

 Up to this point you have a basic but powerful setup that allows you to work from any device with an Internet connection. Let's check the initial objectives:

 * Interoperability between a Desktop, a laptop or a Tablet with total transparency. The current configuration allows you to manage your containers from a web GUI and connect to your server through any SSH Client.
 * Centralized assets management, available from any device with an Internet connection. The use of ownClud allows you to use your assets from any device.
 * Operating System agnostic. Linux, macOS, Windows, Android, iOS. The procedure explained in this guide can be reproduced in any Operating System.
 * Comfort even while working on a remote device like a Tablet. The use of QuickEdit, JuiceSSH, ownCloud and Linode Manager brings you the comfort of native Android (or iOS) applications, on the other hand, using Portainer vastly simplifies the containers managment.
 * Flexibility to recreate any production scenario, but also workflow flexibility to adapt to any power-user. This is achieved though the use of Docker and Docker Compose.
 * Security and data integrity. Using a remote Linode allows you to host your information in a stable and reliable cloud platform.
 * Ability to scale power and storage on demand. Through Linode Manager you can resize your host or us Docker Swarm to connect additional Linodes on demand.
 * Low cost. Using Linode you obtain the best value.
