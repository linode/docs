---
author:
  name: Linode Community
  email: docs@linode.com
contributor:
  name: Damaso Sanoja
  link: https://twitter.com/damasosanoja
description: 'This guide shows how to set up a remote development environment on your Linode. You can then connect to it from a remote device such as a tablet or laptop.'
keywords: 'docker,container,portainer,linode,remote devices'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-12-05
modified: 2017-12-05
modified_by:
  name: Linode
title: 'Use a Linode for Web Development on Remote Devices'
external_resources:
 - '[Docker Docs](http://docs.docker.com/)'
 - '[Portainer](https://portainer.io/)'
---


This guide will walk you through the necessary steps to configure your Linode as an efficient remote development environment. You will then connect to this environment using a tablet and edit a simple web application using `ssh` and a text editor.

## Local vs. Remote

A local development environment is much faster, more powerful, and more comfortable than a device like a tablet. However, there are also drawbacks associated with local development:

* You rely on your Workstation OS. That means you will need several Virtual Machines to overcome that limitation which brings us to the next point.
* No matter how powerful is your machine, resources are finite, depending on your project's complexity that could be a problem.
* A development environment that relies on a powerful desktop, a local NAS, multi-monitor setup, full size keyboard and mouse is by no means portable. You can use a good laptop to gain some freedom, but then you sacrifice CPU power and internal storage that could hinder your ability to run specific projects.
* Last but not least, if your Workstation fails your entire development process stops.

However, a simple remote development environment has its own disadvantages:

* Most on-line development environments have certain limitations on the frameworks you can use.
* Speed could be an issue too, especially if your project requires compiling large amounts of code.
* You won't be able to reproduce the exact production environment.
* Folders structure, assets location and most customizations are not possible, you should adapt your workflow to the chosen provider philosophy.
* Finally, cost could be a real issue since bigger plans increase your expense by a large amount.

### Solution: the Hybrid Approach

If working locally isn't the best solution but neither is an online environment then what is the alternative? The answer is a hybrid solution.

* Interoperability between a desktop, a laptop or a tablet with total transparency.
* Operating System agnostic. Linux, macOS, Windows, Android, iOS.
* Comfort even while working on a remote device like a tablet.
* Flexibility to recreate any production scenario, but also workflow flexibility to adapt to any power-user.
* Security and data integrity.
* Ability to scale power and storage on demand.
* Low cost.

By using Docker, you can ensure that your development is fully portable: containers can be run on a Linode for remote development, but can easily be ported to a local environment if necessary. This guide will use [Portainer](https://portainer.io/) to manage the Docker environment, to make it easier to work with containers from a remote device.


## Prepare the Remote Environment

### Install Docker

{{< section file="/shortguides/docker/install_docker_ce.md" >}}

### Install Portainer

The easiest way to install Portainer is by deploying the official image.


1. Create a volume for storing persistent data:

        docker volume create portainer_data

2. Run your container in detached mode.

        docker run -d -p 9000:9000 \
        --name portainer --restart unless-stopped \
        -v /var/run/docker.sock:/var/run/docker.sock \
        -v portainer_data:/data portainer/portainer


The `-v /var/run/docker.sock:/var/run/docker.sock` option allows the Docker container to communicate with host Docker environment. `-v portainer_data:/data portainer/portainer` mounts the previously created Portainer data volume.

4. Point your browser to http://192.0.2.0:9000, replacing `192.0.2.0` with the IP address or FQDN of your workstation Linode. You should see a screen similar to this:

    ![Portainer Login Screen](/docs/assets/webdev-remote-devices/linode-on-remote-devices-01.png)

5. After registering your `admin` user you will be asked about the type of connection you are using: **Local** or **Remote**. Since you will run your containers from the same Linode choose Local:

    ![Portainer Connection Type](/docs/assets/webdev-remote-devices/linode-on-remote-devices-02.png)

6. If everything goes as expected you will be presented with Portainer Dashboard.

    ![Portainer Dashboard](/docs/assets/webdev-remote-devices/linode-on-remote-devices-03.png)

{{< note >}}
By default your connection with Portainer GUI is not encrypted. If you need to use SSL then you must install the corresponding certificates on your Linode and pass their location to the Docker container upon start. For more information please read how to [Secure Portainer using SSL](https://portainer.readthedocs.io/en/stable/deployment.html#secure-portainer-using-ssl) in the Portainer official documentation.
{{< /note >}}

### Set Up nginx Directory

In the next section you will mount a directory on your Linode to an nginx Docker container. Create this directory now:

      mkdir -p ~/nginx/html

## Connect from a Remote Device

With everything set up it's time to work with your remote development environment. This guide will test your Web Development Environment using a simple Nginx container.

### Install a Container from a Tablet

1. Open your browser and point it to the address: http://192.0.2.0:9000 from Portainer Dashboard Sidebar navigate to **App Templates** menu.

    ![Portainer App Templates](/docs/assets/webdev-remote-devices/linode-on-remote-devices-04.png)

2. In the Application templates list click on **Nginx** to install the container.

    ![Portainer Templates List](/docs/assets/webdev-remote-devices/linode-on-remote-devices-05.png)

3. You will see the Configuration screen from where you can name your container, choose a Docker network and even determine access control (useful for teams).

    ![Portainer Templates List](/docs/assets/webdev-remote-devices/linode-on-remote-devices-06.png)

5. Deploy your container when ready by hitting the corresponding button. The Nginx image will download automatically, after that will be available for future deployments instantly. You will be directed to the **Containers** menu from where you can manage your containers. By default new containers will run on build.

    ![Portainer Containers Menu](/docs/assets/webdev-remote-devices/linode-on-remote-devices-09.png)

6. Check your installation pointing your browser to the assigned port http://<Linode IP or FQDN>:32769.

    ![Ngix welcome page](/docs/assets/webdev-remote-devices/linode-on-remote-devices-10.png)

### Use Portainer to Manage your Containers

1. Navigate to the **Containers** menu on the left Sidebar and check the box close to the `web-01` container you just created. Notice you now have many options available to manage this container.

    ![Portainer Containers management](/docs/assets/webdev-remote-devices/linode-on-remote-devices-25.png)

2. You can | start | stop | kill | restart | pause | resume | remove | the selected container is the same manner as you use `docker` from the terminal. You can also edit `web-01` container by clicking on its name.

3. Remove `web-01` container by touching the **Remove** button, and select to automatically remove non-persistent volumes.

    ![Portainer Remove Container](/docs/assets/webdev-remote-devices/linode-on-remote-devices-26.png)

### Bind Volumes to your Container

1. From the **App Templates** menu select again Nginx.

2. Disable access control and click on **Show advanced options**. On the Volume mapping section touch the **Bind** button for the container's `/usr/share/nginx/html` and set the host to `/home/username/nginx/html`.

    ![Portainer Bind Container](/docs/assets/webdev-remote-devices/linode-on-remote-devices-27.png)

### Connect to your Linode host using JuiceSSH

1. Open JuiceSSH and then select **Connections** from the main dashboard.

    ![JuiceSSH Dashboard](/docs/assets/webdev-remote-devices/linode-on-remote-devices-11.png)

    ![JuiceSSH Dashboard](/docs/assets/webdev-remote-devices/linode-on-remote-devices-12.png)

2. Add a new identity by swiping right to **Identities** menu and then touching the **+** sign.

    ![JuiceSSH New Identity](/docs/assets/webdev-remote-devices/linode-on-remote-devices-13.png)

3. Enter a nickname, and then fill in the Linode username and password (make sure you choose an account that has sudo access).

    ![JuiceSSH Identity creation](/docs/assets/webdev-remote-devices/linode-on-remote-devices-14.png)

4. You can also create a private SSH key for more secure access. Once you have connected to your Linode you can use `ssh-copy-id` to transfer the public key to the server.

5. Touch the check button on top right to save the identity.

    ![JuiceSSH Save Identity](/docs/assets/webdev-remote-devices/linode-on-remote-devices-16.png)

6. If you created an SSH key, you can export the public key by long-pressing the identity name in the Identities menu. Coose **Export Public Key** from the pop-up menu.

    ![JuiceSSH Export SSH Key](/docs/assets/webdev-remote-devices/linode-on-remote-devices-17.png)

7. Swipe left to the **Connections** menu and create a new connection by touching the **+** sign.

    ![JuiceSSH New Connection](/docs/assets/webdev-remote-devices/linode-on-remote-devices-19.png)

8. Assign a Nickname to your connection, fill in the Linode IP address or FQDN and save your connection touching the check mark on top right.

    ![JuiceSSH Connection Settings](/docs/assets/webdev-remote-devices/linode-on-remote-devices-20.png)

9. Touch the connection name to open an ssh connection to your Linode.

10. Check your Nginx container from JuiceSSH.

        sudo docker ps

11. You can stop, remove and perform any docker command just like you always do. As you had noticed at the top of the virtual keyboard you have some shortcuts pre-defined for ease of use. So if you need to use a **Ctrl+C** then you just need to touch the **CTRL** shortcut and then touch **c** letter.

    ![JuiceSSH Keyboard](/docs/assets/webdev-remote-devices/linode-on-remote-devices-24.png)

12. Navigate to the volume you bound to the container:

        cd nginx/html

13. Create a test HTML file:

        echo "<html><p>Hello World</p></html>" >> index.html

14. Point your browser to the Nginx server (you can check the port that nginx is listening on from the Portainer console). Any edits you make from your tablet's SSH connection will be rendered to the browser, allowing you to work on this Nginx project from your tablet.

### Edit Files Using QuickEdit

1. Editing simple config files with  is not hard. But if you are serious about working remotely from your tablet then you will need a text editor capable of syntax highlighting among other things. Open QuickEdit and allow it to access photos, media, and files on your device.

    ![Open QuickEdit](/docs/assets/webdev-remote-devices/linode-on-remote-devices-29.png)

2. By default you will see a blank file. Touch the menu icon on top left.

    ![Menu QuickEdit](/docs/assets/webdev-remote-devices/linode-on-remote-devices-30.png)

3. Select the **Storage Manager** from the menu.

4. Now you need to create a new connection, touch the **+** button on lower right, when prompted choose FTP/FTPS/SFTP and then SFTP

    ![New Connection QuickEdit](/docs/assets/webdev-remote-devices/linode-on-remote-devices-32.png)

5. Enter your Linode IP address or FQDN, desired label, username and select an authentication mode (you can use either password or SSH keys).

6. Browse to the location where you saved the `id_rsa` Private Key (during JuiceSSH configuration) and select it. When ready save the connection.

7. Touch your Linode connection and you will be forwarded to your remote directory structure. Find your Nginx bind mount and open the `test.json` file.


## Conclusion

 You now have a basic but powerful setup that allows you to work from any device with an Internet connection. Let's check the initial objectives:

 * Interoperability between a Desktop, a laptop or a Tablet with total transparency. The current configuration allows you to manage your containers from a web GUI and connect to your server through any SSH Client.
 * Centralized assets management, available from any device with an Internet connection. The use of ownClud allows you to use your assets from any device.
 * Operating System agnostic. Linux, macOS, Windows, Android, iOS. The procedure explained in this guide can be reproduced in any Operating System.
 * Comfort even while working on a remote device like a Tablet. The use of QuickEdit, JuiceSSH, ownCloud and Linode Manager brings you the comfort of native Android (or iOS) applications, on the other hand, using Portainer vastly simplifies the containers managment.
 * Flexibility to recreate any production scenario, but also workflow flexibility to adapt to any power-user. This is achieved though the use of Docker.
 * Security and data integrity. Using a remote Linode allows you to host your information in a stable and reliable cloud platform.
 * Ability to scale power and storage on demand. Through the Linode Manager you can resize your host or us Docker Swarm to connect additional Linodes on demand.

## Next Steps

The main limitation of a tablet or Chromebook is its storage capacity. An efficient way to set up a centralized storage space is by using OwnCloud on a Linode with [block storage](https://linode.com/docs/platform/how-to-use-block-storage-with-your-linode/). This way you can host all your archives, dotfiles, scripts, images and more in a scalable Linode. An additional benefit is the possibility to connect external storages like Dropbox, Google Drive or OneDrive. OwnCloud has native applications for Android and iOS so managing your assets won't be a problem. You can install and configure ownCloud by following our [guide](https://www.linode.com/docs/applications/cloud-storage/install-and-configure-owncloud-on-ubuntu-16-04)
