---
author:
  name: Luis Cortés
  email: docs@linode.com
description: 'This guide shows you how to use Zipkin in a docker container for the purpose of tracking systems to collect and search timing data in order to identify latency problems on your websites.'
keywords: 'zipkin, docker, tracking'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: Wednesday, October 4, 2017
modified_by:
  name: Luis Cortés
published: 'Wednesday, October 4, 2017'
title: 'Zipkin Server Configuration Using Docker and Mysql'
external_resources:
 - '[Official ZipKin Documentation](http://zipkin.io/)'
---

## What is Zipkin?

[Zipkin](http://zipkin.io/) is a "catch all" for capturing timing data, a centralized repository, and a microweb server to allow you to display and search through spans and traces of your distributed programs or websites.

One of the ways we can configure Zipkin is by [deploying it in a Docker container](http://zipkin.io/pages/quickstart). By using this approach, we can match the latest version of Zipkin by just pulling down the latest images. Isolate the docker service and dependencies to just the container(s). Chose where we want our data to persist. And most importantly, spend our time focused on our real primary task of data analysis of the programs/websites this server is monitoring.

## Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone. This guide will use the hostname 'zipkinhost'.

2. This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access, and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet. This guide includes firewall rules specifically for a Zipkin server.

3. Assuming you know how to instrument a Zipkin client machine or have walked through our [Set Up a Zipkin Server with Sample Website Tracking](/docs/uptime/set-up-a-zipkin-server-with-sample-website-tracking) guide.

4. You will need an analyst system (laptop or workstation) with a web browser. This system will be used to view the traces/spans in the Zipkin server through the Zipkin provided webservice.

While Zipkin can be installed on a variety of distributions, this guide uses Fedora 26 in the examples to configure both the server and client Linodes. Remember to adjust any distribution-specific commands, and replace the example IPs, `192.0.2.0`, `198.51.100.0`, `203.0.113.0` with the IP addresses of your Zipkin server, webserver, and analyst machine, respectively.

## The Target Scenario

Our main task is how to setup a Zipkin server with mysql so that it running with mysql and the spans/traces are persisted on the host file system.

## Zipkin Server Configuration

### Install Package Dependencies

1. Log into your Zipkin host machine. Then make sure your Fedora 26 OS is up to date:

        sudo dnf update && sudo dnf upgrade

2. **Install docker and docker-compose.**  These 2 applications are all we need to pull new images and run our Zipkin service. To be clear, we will end up running 3 containers: one for the Zipkin server, one for mysql and for dependencies. This is a standard configuration provided by the creator of the docker containers. You can customize your own, but we are focusing on quick instead of custom today.

        sudo dnf install docker docker-compose

3. Install git, so that we can use it to download the necessary Zipkin **docker-compose yaml** files:

        sudo dnf install git

4. Use git to retrieve the Zipkin docker-compose yaml files at [openzipkin/docker-zipkin](https://github.com/openzipkin/docker-zipkin). This is one of the powerful features of docker, these files hold all the system level configuration we need to run several different types of Zipkin system level configurations like: Zipkin with mysql, Zipkin with elasticsearch, or Zipkin with Kakfa, etc. Let's make a copy of the github directory in your home directory.

        cd ~
        git clone https://github.com/openzipkin/docker-zipkin.git

5. (Optional) If you are a mysql admin, you're probably at home with using mysqldump. The docker philosophy is to run services in containers, so don't get all excited when we install mysql on the host. All we really need is the mysqldump command:

        sudo dnf install mysql

### Docker Service Setup

The docker service will manage your containers. The containers host Zipkin services and your mysql server. One of the containers contains your span/trace data, which you want to make sure persists on your file system.

![host layout](/docs/assets/zipkin_docker_host_layout.png)

Docker will be in charge of starting and stopping these services automatically when the host system is rebooted. It will help us map the ports from the container to the host's ports and it will manage how to export the mysql database files onto the host system. It can check to see if the container has failed and restart it for us too. The host is in charge of running the actual docker service and setting the firewall correctly.

Notice that the Zipkin container will expose port 9411 for its service, and the mysql container will expose port 3306. We will use the docker-compose yaml files to forward port 9411 to the host's port 9411, so that the external world will have access to our container's service.

1. Enable the docker service:

        sudo systemctl enable docker

2. Start the docker service:

        sudo systemctl start docker

### Zipkin Server Firewall Concepts

Limit the exposure of our Zipkin server to just our analyst and client machines to avoid the server being compromised.

The default Fedora 26 firewall rules block all ports as a safety precaution. Create a new firewall zone to handle the Zipkin services without exposing too much of the system:

Our goal is to set up the Zipkin Server for:

* Thrift service: receiving data from clients
* Web service: showing searches of time data
* lock down access to only our web and analyst machines.

Note: both of the Zipkin services use the same port 9411/tcp.

#### Firewall Steps for Zipkin Server

1. Create a new zone in our firewall called **zipkin** (all lowercase as Linux is case sensitive).

        sudo firewall-cmd --new-zone=zipkin --permanent

2. Reload the firewall so you can refresh your zone list.

        sudo firewall-cmd --reload

3. Add a client machine real world IP. This is the IP of your instrumented client machine. You should have at least 1 to provide span/trace data.

        sudo firewall-cmd --zone=zipkin --add-source=198.51.100.0/32  --permanent

4. Add an analyst machine real world IP (If you forget to define any source IPs, then you will effectly have no filtering on your IPs. In other words you need at least 1 source IP to start filtering on IPs. If there are no source IPs defined, any machine can connect to your server.)

        sudo firewall-cmd --zone=zipkin --add-source=203.0.113.0/32  --permanent

5. Open a port through your firewall.

        sudo firewall-cmd --zone=zipkin --add-port=9411/tcp  --permanent

6. (Optional) Since we may want to access our machine from the analyst machine, it may be a good idea to add an ssh port.

        sudo firewall-cmd --zone=zipkin --add-service=ssh --permanent

7. Reload your firewall rules to activate them in your new zone.

        sudo firewall-cmd --reload

8. View your new zone like so:

        sudo firewall-cmd --zone=zipkin --list-all

### Docker-Compose Configuration

The **docker-compose yml** files will control which system configuration we can use. We are going to select a mysql configuration for storage.

1. Copy the mysql docker-compose yaml file to your home directory and rename it docker-init.yml as we are going to need to make a few changes:

        cd ~
        cp docker-zipkin/docker-compose.yml docker-init.yml

2. We will now tailor our docker-init.yml by adding a few commands.

    For the mysql container section in the docker-init.yml, we are going to export the mysql data directory, forward the mysql port to the host, and add the restart command so that this service is automatically restarted if it goes down.

    ![Mysql container section changes](/docs/assets/zipkin/zipkin_docker_mysql.png)

    For the Zipkin container section in the docker-init.yml, we are going to make sure the port 9411 is forwarded to the host machine and add the restart command so that this service is automatically restarted if it goes down.

    ![Zipkin container section changes](/docs/assets/zipkin/zipkin_docker_zipkin.png)

    For the dependencies container, we uncomment the JAVA_OPTS and set it to at least 512M. This setting is optimized for a 1G Linode; however, if in the future this container needs more memory, you can increase this value. Add a restart command to the end of this section and after all the sections, we will need to specify our volumes.

    ![dependencies container section changes](/docs/assets/zipkin/zipkin_docker_dep.png)

3. You can now update your Zipkin docker images by performing a **docker pull** command. This will check the web for the images we need (the first time), and all other times it will update the images to the latest version if need be.

        docker-compose -f docker-init.yml pull

4. Run your docker services by using the **docker-compose up** command. Conversely there is also a **docker-compose down** command that can be used to shutdown your Zipkin services.

        docker-compose -f docker-init.yml up -d

Notice the **-d** at the end of the command, this is to **detach** the container. Now it is running as its own process. In fact, if we just left the machine, it would continue to run. Even if we rebooted the machine, it would run when the docker service started it, because we did not explicitly issue a **docker-compose down** command. Just for reference, to shutdown the Zipkin services:

        docker-compose -f docker-init.yml down

### Backup Span/Trace Data

There are 2 different backup methods: using Mysql way, and using sysadmin.

#### Mysql Backup

1. Ensure that the MySQL service is running on a container. You can check this with a `docker ps` command. The `docker ps` command displays the active containers:

      {:.output}
        ~~~
        CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS              PORTS                              NAMES
        023d14e6193d        openzipkin/zipkin-dependencies   "crond -f"               3 days ago          Up 3 days                                              dependencies
        ee0c255b7765        openzipkin/zipkin                "/bin/sh -c 'test ..."   3 days ago          Up 3 days           9410/tcp, 0.0.0.0:9411->9411/tcp   zipkin
        43f659b36f17        openzipkin/zipkin-mysql          "/bin/sh -c /mysql..."   3 days ago          Up 3 days           0.0.0.0:3306->3306/tcp             mysql
        ~~~

2. If it isn't running, make sure you start the Zipkin services with a **docker-compose up** command first. Then issue the mysqldump with the following parameters from your Zipkin host machine.

        mysqldump --protocol=tcp -A -pzipkin -uzipkin > ~/database.bak

    This command will dump the entire mysql database from your msql container into the file called database.bak in your home directory. Alternatively, you can just dump your Zipkin span/trace data with:

        mysqldump --protocol=tcp -pzipkin -uzipkin zipkin > ~/db_zipkin.bak

#### Sys Admin Backup

We can just zip or tar the exported database files on the host system. Since we don't know if the container is writing information to these files at any given time, we need to make sure that the container is stopped.

1. We can check the status with a **docker ps** command or just perform a **docker down** command.

        docker-compose -f docker-init.yml down

  After the **docker down** command, we can perform a **docker ps** command and see that there are no containers running. That should look like this:

  {:.output}
    ~~~
    CONTAINER ID        IMAGE                            COMMAND                  CREATED             STATUS              PORTS                              NAMES
    ~~~


2. At this point, we can create a zip backup of your files. The db files will be prepended with the name of your user. If you are running as root it would be **root_dbfiles**, but running as root is not recommended.

        sudo zip -r ~/db_files.zip /var/lib/docker/volumes/<USER>_dbfiles/

3. Remember to start your Zipkin services if they are still needed. They will not restart even on a reboot because we have explicitly shut them down.

#### Testing the Zipkin Service

1. Easiest way to do this is by clicking on your web browser on your analyst machine. Log into your analyst machine, bring up your browser, and type in the following URL:

        http://192.0.2.0:9411/zipkin/

    If you see the Zipkin web page, you're done.

2. If you don't see a webpage, log into the Zipkin host machine, and make sure your containers are up by running either `docker ps` command or `docker-compose up` command. If the containers are not all running, it is possible that your Linode has run out of memory.

3. Make sure your firewall port is open by typing:

        sudo firewall-cmd --add-port 9411/tcp --permanent

4. At this point, what might have happened is that we added the wrong IP address of our analyst machine. We can check this by loginning into our analyst machine. If our analyst machine is a Fedora workstation, we can install **nmap** and perform a network port status check to our Zipkin host machine like so:

        sudo dnf install -y nmap
        nmap 192.0.2.0 -p 9411 -Pn

  A good return has an **open** for the STATE of the port, anything else and we probably don't have the right analyst machine IP address in our firewall rules:

{:.output}
~~~
Starting Nmap 7.40 ( https://nmap.org ) at 2017-09-24 18:34 MDT
Nmap scan report for zipkin (192.0.2.0)
Host is up (0.10s latency).
PORT     STATE SERVICE
9411/tcp open  unknown
~~~

  Review your firewall rules and try again.
