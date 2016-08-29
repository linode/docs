---
author:
  name: Karthik Shiraly
  email: docs@linode.com
description: 'Deploy Storm cluster on Linode cloud for real-time analytics on streaming datasets.'
keywords: 'storm,analytics,big data,zookeeper'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Thursday, March 24th, 2016'
modified: Thursday, March 24th, 2016
modified_by:
  name: Linode
title: 'Big Data in the Linode cloud - Part 1: Streaming Data Processing using Apache Storm'
contributor:
  name: Karthik Shiraly
  link: https://github.com/pathbreak
  external_resources:
- '[Apache Storm project website](http://storm.apache.org/)'
- '[Apache Storm documentation](http://storm.apache.org/documentation.html)'
- '[Storm - Distributed and Fault-Tolerant Real-time Computation](http://www.infoq.com/presentations/Storm-Introduction)'

---

## Introduction

[Apache Storm](http://storm.apache.org/) is a big data technology that enables software, data and infrastructure engineers in startups and large enterprises to process high velocity, high volume data in real time and extract useful information. Any project that involves processing of high velocity data streams in real time can benefit from it.

Some use cases where Storm is a good solution:

-   Twitter data analytics (for example, trend prediction or sentiment analysis)
-   Stock market analysis
-   Analysis of server logs
-   IoT sensor data processing


This article describes how to create Storm clusters on the Linode cloud using a set of shell scripts that use Linode's powerful Application Programming Interfaces (APIs) to programmatically create and configure large clusters. The deployed architecture will look like this:

![Architecture](/docs/assets/storm-architecture-650px.png)

*Zookeeper* is a critical distributed systems technology that Storm depends on for functioning correctly.

## Target Audience

This article is targeted at

-   Software Engineers, Data Engineers and Data Scientists interested in using Storm clusters for processing real-time data.

-   Infrastructure Engineers, System Administrators and DevOps Professionals tasked with deploying and managing real-time data processing infrastructure.

## Before You Begin

### OS requirements

+   This article assumes that the workstation used for initial setup of Cluster Manager Linode is running Ubuntu 14.04 LTS or Debian 8. Other versions, distributions or OSes have not been tested. 

+   After initial setup, any SSH capable workstation can be used for logging into the Cluster Manager Linode or cluster nodes.

+   The Cluster Manager Linode can have either Ubuntu 14.04 LTS or Debian 8 installed.

+   A Zookeeper or Storm cluster can have either Ubuntu 14.04 LTS or Debian 8 installed on its nodes. Its distribution need not be the same one as the one installed on the Cluster Manager Linode managing it.

### Get a Linode API Key

Follow the steps in [Generating an API Key](/docs/platform/api/api-key) and save the shown key securely, because it has to be entered into configuration files in upcoming steps.

If the key expires or is removed, remember to create a new one and update the *api_env_linode.conf* API environment configuration file on Cluster Manager Linode. More about this in the next section, [Setup the Cluster Manager Linode](#setup-the-cluster-manager-linode).

## Setup the Cluster Manager Linode

The first step is setting up a central *Cluster Manager* linode to store details of all Storm clusters, and enable authorized employees to create, manage or access those clusters. 

You can set up multiple Cluster Manager nodes if necessary to satisfy organizational or security needs. For example, two departments can each have its own Cluster Manager to manage its respective clusters and keep data access restricted to its own members.

1.  The scripts talk to Linode's API using Python. Install Git, Python 2.7 and curl on your Ubuntu 14.04 LTS or Debian 8 workstation:

        you@workstation$ sudo apt-get install python2.7 curl git

2.  Download the project git repository:

        you@workstation$ git clone "https://github.com/pathbreak/storm-linode"
        you@workstation$ cd storm-linode
        you@workstation$ git checkout $(git tag -l "release*" | head -n1)


3.  Make them executable:

        you@workstation$ chmod +x *.sh *.py
    
    
4.  Make a working copy of the API environment configuration file:

        you@workstation$ cp api_env_example.conf api_env_linode.conf
    
5.  Open api_env_linode.conf in an editor, and set `LINODE_KEY` to the API key previously created (see [Get a Linode API key](#get-a-linode-api-key) ).

        you@workstation$ nano -Y sh api_env_linode.conf

        ...
        export LINODE_KEY=Enter your API key here
        ...    
    
    Save and close the editor.
    
6.  Open cluster_manager.sh in an editor and change these configuration settings to customize where and how the Cluster Manager Linode is created:

        you@workstation$ nano -Y sh cluster_manager.sh
 
    -   `ROOT_PASSWORD`
    
        Root user's password for the Cluster Manager linode.
    
        Set this to a strong lengthy password of your choice with a mix of characters. Linode requires root password to contain at least 2 or more of these 4 character types – lower case characters, upper case characters, numeric characters and symbolic characters. 

        If you have spaces in your password, make sure the entire password is enclosed in double quotes.

        If you have double quotes, dollar characters or backslashes in your password, prefix each of them with a backslash (`\`).
        
    -   `PLAN_ID`

        The default value of `1` creates Cluster Manager Linode as a 2GB node, the least expensive plan. This is usually good enough.

        But if you want a higher configuration linode, run this command to see a list of all available plans and their IDs:
        
            you@workstation$ source ./api_env_linode.conf
            you@workstation$ ./linode_api.py plans
            
    -   `DATACENTER`
    
        The Linode datacenter where Cluster Manager linode is created.

        Set it to the ID of the datacenter that is nearest to your location, to reduce network delays. 

        It's also recommended to create the cluster manager node in the same datacenter where the images and cluster nodes will be created, so that it can communicate with them using low latency private IP addresses and save on networking quota costs.

        You can get the list of datacenters and their IDs with this command:
        
            you@workstation$ source ./api_env_linode.conf
            you@workstation$ ./linode_api.py datacenters table
            
    -   `DISTRIBUTION`

        This is the ID of the OS to install on Cluster Manager linode. 
        
        It's recommended to use Ubuntu 14.04 or Debian 8 because the scripts have been tested only with those two OSes.
        
        The default value of 124 selects Ubuntu 14.04 LTS 64-bit.

        For other available Ubuntu distributions, run these commands:
        
            you@workstation$ source ./api_env_linode.conf
            
            you@workstation$ ./linode_api.py distributions "ubuntu" table
            
            you@workstation$ ./linode_api.py distributions "debian" table
    
    -   `KERNEL`
    
        This is the ID of the Linux kernel to install on Cluster Manager linode.

        The default value of 138 always selects the latest 64-bit Linux kernel available from Linode.

        For list of available kernels, run this command:
        
            you@workstation$ source ./api_env_linode.conf
            you@workstation$ ./linode_api.py kernels "" table

        For listing only kernels that match a particular version, use a regular expression filter. For example, this command shows only kernels with the string “4.1.” in their labels.
        
            you@workstation$ source ./api_env_linode.conf
            you@workstation$ ./linode_api.py kernels "4\.1\." table    
            
    -   `DISABLE_SSH_PASSWORD_AUTHENTICATION`
    
        Disables SSH password authentication and allows only key based SSH authentication for Cluster Manager linode. Password authentication is considered less secure, and is hence disabled by default.

        `yes` (default) - disables password authentication and enables only key based authentication.
        
        `no` - enables both key based and password authentication.
        
7.  Save all changes to cluster_manager.sh and close the editor.

8.  Now, create and setup the Cluster Manager Linode with this command:

        you@workstation$ ./cluster_manager.sh create-linode api_env_linode.conf
        
    When installation completes, you should see output like this:
    
    ![Cluster Manager creation](/docs/assets/storm-clustermgr-creation-2.png)
    
    Note down the public IP address of the Cluster Manager Linode. You will need this in future whenever you want to log into the cluster manager to create or manage clusters.

9.  **Security Overview**

    This section explains the security configuration created by the installation script to help you keep your clusters secure from both external and internal malicious parties.

    {: .caution}
    >
    > Since access to the cluster manager provides access to all Storm and Zookeeper clusters and any sensitive data they are processing, its security configuration should be considered critical, and access should be as restricted as possible.
    
    The script creates three users on the Cluster Manager Linode, and generates authentication keypairs for all of them on your workstation, as shown in this illustration:
    
    [![Security Overview](/docs/assets/storm-clustermgrkeys-650px.png)](/docs/assets/storm-clustermgrkeys.png)
    
    -   *$HOME/.ssh/clustermgrroot* is the private key for Cluster Manager Linode's *root* user.
    
        Access to this user should be as restricted as possible.
    
    -   *$HOME/.ssh/clustermgr* is the private key for Cluster Manager Linode's *clustermgr* user. 
        
        This is a privileged administrative user who can create and manage Storm or Zookeeper clusters.
        
        Access to this user should be as restricted as possible.
        
    -   *$HOME/.ssh/clustermgrguest* is the private key for Cluster Manager Linode's *clustermgrguest* user. 
        
        This is an unprivileged user for use by anybody who need information about Storm clusters, but not the ability to manage them. These are typically developers, who need to know a cluster's client node IP address to submit topologies to it.
        
    -   SSH password authentication to the cluster manager is disabled by default. It is recommended to leave  it like that.
    
        However, if you want to enable password authentication for just *clustermgrguest* users for convenience, log in as root and append the following line to the *end* of /etc/ssh/sshd_config:
	
            ...
            Match User clustermgrguest
		      PasswordAuthentication yes

        and restart ssh service:
	        
            root@localhost:~# service ssh restart


10. Log in to the Cluster Manager Node as its `root` user:

        you@workstation$ ssh -i ~/.ssh/clustermgrroot root@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
 
    Sometimes this may fail with an error: 
    
        Agent admitted failure to sign using the key
        Permission denied (publickey).
    
    If you see that error, repeat the command as follows:
    
        you@workstation$ SSH_AUTH_SOCK=0 ssh -i ~/.ssh/clustermgrroot root@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
    
11. Change its host name to something more descriptive. Here, we are changing it to *clustermgr*:

        root@localhost:~# sed -i -r "s/127.0.1.1.*$/127.0.1.1\tclustermgr/" /etc/hosts
        root@localhost:~# echo clustermgr > /etc/hostname
        root@localhost:~# hostname clustermgr
        
12. Set passwords for *clustermgr* and *clustermgrguest* users:

        root@clustermgr:~# passwd clustermgr
        <Enter a secure password>
        <Reenter the same secure password>

        root@clustermgr:~# passwd clustermgrguest
        <Enter a secure password>
        <Reenter the same secure password>

    Any administrator logging in as *clustermgr* user should know this password because they may be asked to enter the password when attempting a privileged command.

13. Delete *cluster_manager.sh* from root user's directory and close the SSH session:

        root@clustermgr:~# rm cluster_manager.sh
        root@clustermgr:~# exit

14. Now, log back in to the Cluster Manager Linode - this time as *clustermgr* user - using its public IP address and the private key for *clustermgr* user:

        you@workstation$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE

    Sometimes this may fail with an error: 
    
        Agent admitted failure to sign using the key
        Permission denied (publickey).
    
    If you see that error, repeat the command as follows:
     
        you@workstation$ SSH_AUTH_SOCK=0 ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE

15. Make a working copy of *api_env_example.conf* as *api_env_linode.conf*:

        clustermgr@clustermgr:~$ cd storm-linode
        clustermgr@clustermgr:~/storm-linode$ cp api_env_example.conf api_env_linode.conf

16. Open *api_env_linode.conf* in an editor.

    Set LINODE_KEY to the API key previously created.
    
    Set CLUSTER_MANAGER_NODE_PASSWORD to the password for *clustermgr* user.

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh api_env_linode.conf

        ...
        export LINODE_KEY=[Enter your API key here]
        export CLUSTER_MANAGER_NODE_PASSWORD=[Enter password of clusermgr user]
        ...
        
    Save those changes and close the editor.

17. **The Cluster Manager linode is now ready to create Apache Storm clusters.**

18. Any sysadmin / devops / developer who should manage the clusters should get their public keys added to */home/clustermgr/.ssh/authorized_keys* so that they can SSH to the Cluster Manager Linode as user *clustermgr*. 

## Create a Storm Cluster

Creating a new Storm cluster involves four main steps, most of which are necessary only the very first time and can be skipped while creating subsequent clusters.

### 1. Create a Zookeeper Image

A *Zookeeper Image* is a master disk with all necessary Zookeeper softwares and libraries installed. 

Creating a Zookeeper Image:

-   ... enables quick creation of a Zookeeper cluster by simply cloning it to create as many nodes as required, each a perfect copy of the image. 

-   ... ensures that OS packages and third party software packages are identical on all nodes, and prevent version mismatch errors.

-   ... reduces network usage, because downloads and updates are executed only once when preparing the image instead of repeating them on each node.

{: .note}
>If a Zookeeper image already exists, this step is not mandatory. Multiple Zookeeper clusters can share the same Zookeeper image. 
>In fact it's a good idea to keep the number of images low because Linode provides only 10 GB for image storage.
>
>For creating an image, you should have `clustermgr` authorization to the Cluster Manager Linode.

The steps to create a Zookeeper image are:

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Decide on a unique name for the new image. In this example, we'll call it `zk-image1`.

    The name should follow these convenctions...
    
        -   Alphabets, digits, hyphens, underscores only
        -   No spaces
        -   No other special characters
        -   Cannot be empty

    The name should be unique because it is possible that in future, you may want to create additional Zookeeper images  with different configurations.

3.  Create configuration directory for the new image using `new-image-conf` command:

        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh new-image-conf zk-image1
        
4.  List the directory to see a newly created subdirectory named `zk-image1` and under it, the files that make up the image configuration:

        clustermgr@clustermgr:~/storm-linode$ ls zk-image1 
        
        log4j.properties  zk-image1.conf  zk-supervisord.conf  zoo.cfg

5.  *image-name.conf* (for example, *zk-image1.conf* here) is the main image configuration file, and the one you'll be modifying the most. Its properties are described further down.  

    The other files are secondary configuration files. They contain reasonable default values, but you can always open them in an editor like nano, and modify them to suit your environment and expected workloads:  

    -   **zoo.cfg**
    
        This is the primary Zookeeper configuration file. 
        
        See the official [Zookeeper Configuration Parameters documentation](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_configuration)  for details on what parameters can be customized. 
        
        It's not necessary to enter the cluster's node list in this file. That's done automatically by the script during cluster creation.
   
    -   **log4j.properties**
    
        Customize the default logging levels for Zookeeper components. You can also customize these at a node level later  when cluster is created.

    -   **zk-supervisord.conf**
    
        The Zookeeper daemon is run under supervision, so that if it shuts down unexpectedly, it's automatically restarted by Supervisord. 
        
        There is nothing much to customize here, but review the [Supervisord Configuration documentation](http://supervisord.org/configuration.html) if you do want to customize it.
   

6.  Open the image configuration file (in this example, `./zk-image1/zk-image1.conf`) in an editor:

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh ./zk-image1/zk-image1.conf

7.  Enter or edit values of configuration properties as required. Properties that should be mandatorily entered are marked as **REQUIRED**:

    -   `DISTRIBUTION_FOR_IMAGE`
    
        Specify either Ubuntu 14.04 or Debian 8 distribution to use for this image. 
        
        {: .caution}
        >The scripts have not been tested on any other versions or distributions.

        All nodes of all clusters created from this image will have this same distribution.
        
        Default is 124 corresponding to Ubuntu 14.04 LTS 64-bit. For Debian 8 64-bit, set it to 140.
        
        The value can be either the numeric distribution ID or the distribution label. The command below lists all available Ubuntu distributions provided by Linode:
        
            clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh distributions api_env_linode.conf ubuntu
        
    -   `LABEL_FOR_IMAGE`
    
        A friendly label for the image to help you differentiate it from other images.
        
    -   `KERNEL_FOR_IMAGE`
    
        The kernel version provided by Linode to use in this image. This can either be the kernel ID or label. You can get a list of all available kernels with this command:

            clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh kernels api_env_linode.conf

        You can also provide a regular expression filter. For example, this command lists all the kernels which have version "4.1" in their labels:

            clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh kernels api_env_linode.conf "4\.1.*"
            
        Default value is 138 corresponding to the latest 64-bit kernel provided by Linode.

    -   `DATACENTER_FOR_IMAGE`
    
        The preferred Linode datacenter where this image should be created. 
        
        This can be any Linode datacenter, but cluster creation is faster if the image is created in the same datacenter where cluster will be created. It's also recommended to create the image in the same datacenter as the Cluster Manager Linode. Select a datacenter that is geographically close to your premises, to reduce network delays.
        
        The value can either be the datacenter's ID or location or abbreviation. You can get a list of all datacenters using:

            clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf 

    -   `IMAGE_ROOT_PASSWORD` **REQUIRED**
        
        The default root user password baked into the image. All nodes of any clusters created from this image will have this as the root password, unless it's overridden in a cluster's configuration file.
        
        Ensure this is a really strong password. Linode validation rules requires it to contain at least two of these four character classes: lower case letters, upper case letters, numbers, punctuation.
        
    -   `IMAGE_ROOT_SSH_PUBLIC_KEY` and `IMAGE_ROOT_SSH_PRIVATE_KEY`
    
        The keypair files for SSH public key authentication as root user. Any user who logs in with this private key  will be authenticated as root.
        
        By default, cluster_manager.sh setup would have already created a keypair named clusterroot and clusterroot.pub under /home/clustermgr/.ssh/.
        
        If you wish to replace them with your own keypair, select a descriptive filename for this new keypair (example: "myclusterroot"), generate them using `ssh-keygen` as described in the [Appendix](#appendix-generating-ssh-keypairs), and set their full paths here.
        
    -   `IMAGE_DISABLE_SSH_PASSWORD_AUTHENTICATION`
    
        Default value: `yes` (recommended)
        
        If this is `yes`, password based SSH authentication is disabled. Any user who wishes to log in via SSH into any cluster node created from this image should have the correct SSH private key. This improves the cluster's security.
        
        If this is `no`, password based SSH authentication is enabled, and both password and key based authentication are available on all nodes created from this image. Allowing password based SSH authentication reduces the cluster's security.
        
    -   `IMAGE_ADMIN_USER`
    
        Often, administrators or developers may have to log in to the cluster nodes for maintenance or troubleshooting. 
        
        Instead of logging in as root users, it's better to log in as a non-root but privileged user.
        
        The script creates a privileged user with this name in the image (and as a consequence, in all cluster nodes based on this image).
        
    -   `IMAGE_ADMIN_PASSWORD` **REQUIRED**
    
        Password for `IMAGE_ADMIN_USER`.
        
    -   `IMAGE_ADMIN_SSH_AUTHORIZED_KEYS`
    
        A file which contains public keys of all personnel authorized to log in to cluster nodes as IMAGE_ADMIN_USER. 
        
        This file should be in the same format as the standard SSH *authorized_keys* file. All the entries in this file are appended to the image's authorized_keys file, and get inherited into all nodes based on this image.
        
        By default, cluster_manager.sh setup creates a new 'clusteradmin' keypair, and this variable is set to the path of the public key. 
        
        You can either retain this generated keypair and distribute the generated private key file /home/clustermgr/.ssh/clusteradmin to authorized personnel. 
        
        Or you can do the reverse – collect public keys of authorized personnel and append them to /home/clustermgr/.ssh/clusteradmin.pub.

    -   `IMAGE_DISK_SIZE`
    
        The size of the image disk in MB. 
        
        Default value of 5000MB is good enough, since it's just a minimal OS distribution, with Java and Zookeeper software installed.
        
    -   `UPGRADE_OS`
    
        If `yes`, the distribution is updated and upgraded before installing any software. Recommended to leave it as `yes`, to avoid any installation complications.
        
    -   `INSTALL_ZOOKEEPER_DISTRIBUTION`
    
        The Zookeeper version to install. By default, cluster_manager.sh setup has already downloaded version 3.4.6.
        
        If you wish to install a different version, download it manually and change this variable.
        
        *Note*: These scripts have not been tested for any version other than 3.4.6.

    -   `ZOOKEEPER_INSTALL_DIRECTORY`
    
        The directory where Zookeeper will be installed on the image (and therefore, on all cluster nodes created from this image).
        
        Default value: /opt
        
    -   `ZOOKEEPER_USER`
    
        The username under which Zookeeper daemon runs. This is a security feature to avoid privilege escalation by exploiting some vulnerability in the Zookeeper daemon. 
        
        Default value: zk
        
    -   `ZOOKEEPER_MAX_HEAP_SIZE`
    
        The maximum java heap size for the JVM hosting the Zookeeper daemon. 
        
        The value can be either a percentage, or a fixed value. 
        
        If the fixed value is not suffixed with any character, it is interpreted as bytes. 
        
        If it is suffixed with one of [k|K|m|M|g|G], it is interpreted as kilobytes, megabytes or gigabytes respectively.
        
        Do not set this too low. That can result in out of memory errors, and cause data losses or delays in the Storm cluster.
        
        Do not set this too high either, to avoid squeezing the memory available for OS and other processes and result in disk thrashing, which badly affects zookeeper performance.

        Default value: 75%, which means at most 75% of the Linode's RAM can be reserved for the JVM, and remaining 25% for the rest of the OS and other processes.

    -   `ZOOKEEPER_MIN_HEAP_SIZE`
    
        The minimum java heap size to commit for the JVM hosting the Zookeeper daemon. 
        
        The value can be either a percentage, or a fixed value. 
        
        If the fixed value is not suffixed with any character, it is interpreted as bytes. 
        
        If it is suffixed with one of [k|K|m|M|g|G], it is interpreted as kilobytes, megabytes or gigabytes respectively.
        
        If this value is lower than `ZOOKEEPER_MAX_HEAP_SIZE`, only this value memory is *committed*, and additional memory upto `ZOOKEEPER_MAX_HEAP_SIZE` is allocated only when the JVM requests it from OS. This can lead to memory allocation delays during operation. So do not set it too low.
        
        This value should never be more than `ZOOKEEPER_MAX_HEAP_SIZE`. If it is, the Zookeeper daemon will not even start.
        
        Default value: 75%, which means 75% of the Linode's RAM is committed – not just reserved - to the JVM and unavailable to any other process. 

8.  Save the changes and close the editor.

9.  Create the image using `create-image` command, specifying the newly created image name and API environment file:

        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh create-image zk-image1 api_env_linode.conf
        
    If the image is created successfully,  the output will look something like this towards the end:
    
        ....
        Deleting the temporary linode xxxxxx

        Finished creating Zookeeper template image yyyyyy


    {: .note}
    >
    > During this process, a short lived 2GB linode is created and deleted. This will entail a small cost in the monthly invoice and trigger an event notification email to be sent to the address you have registered with Linode. This is perfectly normal.

### 2. Create a Zookeeper Cluster

{: .note}
>
>    If a Zookeeper cluster already exists, this step is not mandatory. Multiple Storm clusters can share the same Zookeeper cluster. 
>
>    For creating a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

In this section, you will learn how to create a new Zookeeper cluster in which every node is a replica of an existing Zookeeper image. If you have not created any Zookeeper images, do so first by following [Create a Zookeeper image](#create-a-zookeeper-image).

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Decide on a unique name for the new cluster. In this example, we'll call it `zk-cluster1`.

    The name should follow these naming conventions...
    
        -   Maximum 25 characters in length 
        -   Alphabets, digits, hyphens, underscores only
        -   No spaces
        -   No other special characters
        -   Cannot be empty

    The name should be unique because it is possible that in future, you may want to create additional Zookeeper clusters for other projects.

3.  Create configuration directory for the new cluster using `new-cluster-conf` command:

        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh new-cluster-conf zk-cluster1
        
4.  List the directory to see a newly created subdirectory named `zk-cluster1` and under it, the files that make up the cluster configuration:

        clustermgr@clustermgr:~/storm-linode$ ls zk-cluster1 
        
        zk-cluster1.conf

5.  *cluster-name.conf* (for example, *zk-cluster1.conf* here) is the main cluster configuration file, and the one you'll be modifying the most. Its properties are described next.  

6.  Open the cluster configuration file (in this example, `./zk-cluster1/zk-cluster1.conf`) in an editor:

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh ./zk-cluster1/zk-cluster1.conf

7.  Enter or edit values of configuration properties as required. Properties that should be mandatorily entered or changed from their default values are marked as **REQUIRED**:

    -   `DATACENTER_FOR_CLUSTER`
    
        The preferred Linode datacenter where the nodes of this cluster should be created. All nodes of a cluster have to be in the same datacenter; they cannot span multiple datacenters.
        
        This can be any Linode datacenter, but cluster creation may be faster if it is created in the same datacenter where image and Cluster Manager Linode are created.  It is recommended to select a datacenter that is geographically close to your premises to reduce network delays.
        
        The value can either be the datacenter's ID or location or abbreviation. You can get a list of all datacenters using:
        
            clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf 
        
    -   `CLUSTER_SIZE`
    
        The types and number of nodes that constitute this cluster. 

        Syntax is: 
        
        `plan:count   plan:count ....`

        where a `plan` is one of `2GB | 4GB| ....| 120GB` (see [Linode plans](/pricing) for all plans) and count is the number of nodes with that plan.
        
        Examples: 
        
        -   For a cluster with three 4GB nodes:
           
            CLUSTER_SIZE="4GB:3"

        -   For a cluster with three nodes of different plans:
        
            CLUSTER_SIZE="2GB:1 4GB:1 8GB:1"

        Total number of nodes in a Zookeeper cluster *should* be an odd number. 
        
        Although cluster can have nodes of different plans, it's recommended to use the same plan for all nodes. 
        
        Avoid very large clusters. A cluster with 3-9 nodes is good enough for most use cases. 11-19 nodes would be considered "large". Anything more than 19 nodes would probably be counterproductive, because Zookeeper will slow down all the Storm clusters that depend on it.
        
        Size the cluster carefully, because as of version 3.4.6, Zookeeper does not support dynamically expanding it. The only way to resize would be to take it down and create a new cluster. This will cause downtime for Storm clusters that rely on this Zookeeper cluster.
        
    -   `ZK_IMAGE_CONF` **REQUIRED**
    
        Path of the Zookeeper image directory to use as a template for creating nodes of this cluster. Every node's disk will be a replica of this image.
        
        The path can either be an absolute path, or a path that is relative to this cluster configuration directory.
        
        Examples:
        
        ZK_IMAGE_CONF=/home/clustermgr/storm-linode/zk-image1

        or
        
        ZK_IMAGE_CONF=../zk-image1

    -   `NODE_DISK_SIZE`
    
        Size of each node's disk in MB. It should be at least as large as the selected image's disk.

    -   `NODE_ROOT_PASSWORD`
    
        (Optional) Specify a root password for the nodes. 
        
        If this is empty, the root password will be the `IMAGE_ROOT_PASSWORD` in image configuration file.

    -   `NODE_ROOT_SSH_PUBLIC_KEY` and `NODE_ROOT_SSH_PRIVATE_KEY`
    
        (Optional) Specify a SSH public key file and private key file for root user authentication. 
        
        If this is empty, the keys will be the keys specified in image configuration file.
        
        If you wish to override the default with your own keypair, select a descriptive filename for this new keypair (example: *zkcluster1root*), generate them using `ssh-keygen` as described in the [Appendix](#appendix-generating-ssh-keypairs), and set their full paths here.

    -   `PUBLIC_HOST_NAME_PREFIX`
    
        Every linode in the cluster has a *public IP address*, which can be reached from anywhere on the Internet, and a *private IP address*, which can be reached only from other nodes of the same user inside the same datacenter.
        
        Accordingly, every node is given a *public hostname* that resolves to its public IP address. If the cluster manager node is in a different Linode datacenter from the cluster nodes, it uses the public hostnames and public IP addresses to communicate with cluster nodes.

    -   `PRIVATE_HOST_NAME_PREFIX`
    
        Every linode in the cluster is given a *private hostname* that resolves to its private IP address. All the nodes of a cluster communicate with one another through their private hostnames. 
        
        This is also the actual hostname set for the node using the host's hostname command and saved in /etc/hostname. 

    -   `CLUSTER_MANAGER_USES_PUBLIC_IP`
    
        {: .caution}
        >
        > It's very important to set this correctly to avoid critical cluster creation failures.
        
        Set it to `false` if the cluster manager node is located in the *same* Linode datacenter as the cluster nodes.
        This is the recommended value and is also the default.
        
        Change to `true` only if the cluster manager node is located in a *different* Linode datacenter from the cluster nodes.

    -   `ZOOKEEPER_LEADER_CONNECTION_PORT`
    
        The port used by a Zookeeper node to connect its followers to the leader. When a new leader is elected, a follower opens a TCP connection to the leader at this port. 
        
        There's no real need to change this, unless you are customizing the firewall for security purposes.

        Default: 2888


    -   `ZOOKEEPER_LEADER_ELECTION_PORT`
    
        The port used for Zookeeper leader election during quorum. 
        
        There's no need to change this, unless you are customizing the firewall for security purposes.
        
        Default: 3888

    -   `IPTABLES_V4_RULES_TEMPLATE`
    
        Absolute or relative path of the IPv4 iptables firewall rules file. 
        
        Modify this if you want to customize the firewall configuration.
        
        Default: `../template-zk-iptables-rules.v4`

    -   `IPTABLES_V6_RULES_TEMPLATE`
    
        Absolute or relative path of the IPv6 iptables firewall rules file.
        
        IPv6 is completely disabled on all nodes, and no services listen on IPv6 addresses.
        
        Modify this if you want to customize the firewall configuration.
        
        Default: `../template-zk-iptables-rules.v6`

8.  Save the changes and close the editor.

9.  Create the cluster using the `create` command:

        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh create zk-cluster1  api_env_linode.conf

    If the cluster is created successfully,  a success message is printed:
    
        ...
        Zookeeper cluster successfully created
        
        clustermgr@clustermgr:~/storm-linode$


10.  Details of the created cluster can be viewed using `describe` command:

        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh describe zk-cluster1

11.  Cluster nodes are shutdown soon after creation. They are restarted only when any of the Storm clusters is starting up.

### 3. Create a Storm Image

A *Storm Image* is a master disk with all necessary Storm softwares and libraries already installed. 

Creating a Storm Image:

-   ... enables quick creation of a Storm cluster by simply cloning it to create as many nodes as required, each a perfect copy of the image. 

-   ... ensures that OS packages and third party software packages are identical on all nodes, and prevent version mismatch errors.

-   ... reduces network usage, because downloads and updates are executed only once when preparing the image instead of repeating them on each node.

{: .note}
>
>If a Storm image already exists, this step is not mandatory. Multiple Storm clusters can share the same Storm image. 
>In fact it's a good idea to keep the number of images low because Linode provides only 10 GB for image storage.
>
>For creating an image, you should have `clustermgr` authorization to the Cluster Manager Linode.

The steps to create a Storm image are:

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Decide on a unique name for the new image. In this example, we'll call it `storm-image1`.

    The name should follow these naming conventions...
    
        -   Alphabets, digits, hyphens, underscores only
        -   No spaces
        -   No other special characters
        -   Cannot be empty


    The name should be unique because it is possible that in future, you may want to create additional Storm images  with different configurations.

3.  Create configuration directory for the new image using `new-image-conf` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh new-image-conf storm-image1
        
4.  List the directory to see a newly created subdirectory named `storm-image1` and under it, the files that make up the image configuration:

        clustermgr@clustermgr:~/storm-linode$ ls storm-image1 
        
        storm-image1.conf  template-storm-supervisord.conf  template-storm.yaml

5.  *image-name.conf* (for example, *storm-image1.conf* here) is the main image configuration file, and the one you'll be modifying the most. Its properties are described further down.  

    The other files are secondary configuration files. They contain reasonable default values, but you can always open them in an editor like nano, and modify them to suit your environment and expected workloads:  

    -   **template-storm.yaml**
    
        The Storm configuration file.
        
        See the official [Storm Configuration](http://storm.apache.org/documentation/Configuration.html) documentation for details on what parameters can be customized.
        
    -   **template-storm-supervisord.conf**
    
        The Storm daemon is run under supervision, so that if it shuts down unexpectedly, it's automatically restarted by Supervisord. 
        
        There is nothing much to customize here, but review the [Supervisord Configuration documentation](http://supervisord.org/configuration.html) if you do want to customize it.
   

6.  Open the image configuration file (in this example, `./storm-image1/storm-image1.conf`) in an editor:

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh ./storm-image1/storm-image1.conf

7.  Enter or edit values of configuration properties as required. Properties that should be mandatorily entered are marked as **REQUIRED**:

    -   `DISTRIBUTION_FOR_IMAGE`
    
        Specify either Ubuntu 14.04 or Debian 8 distribution to use for this image. 
        
        {: .caution}
        >The scripts have not been tested on any other versions or distributions.

        All nodes of all clusters created from this image will have this same distribution.
        
        Default is 124 corresponding to Ubuntu 14.04 LTS 64-bit. For Debian 8 64-bit, set it to 140.
        
        The value can be either the numeric distribution ID or the distribution label. The command below lists all available Ubuntu distributions provided by Linode:
        
            clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh distributions api_env_linode.conf ubuntu
        
    -   `LABEL_FOR_IMAGE`
    
        A friendly label for the image to help you differentiate it from other images.
        
    -   `KERNEL_FOR_IMAGE`
    
        The kernel version provided by Linode to use in this image. This can either be the kernel ID or label. You can get a list of all available kernels with this command:

            clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh kernels api_env_linode.conf

        You can also provide a regular expression filter. For example, this command lists all the kernels which have version "4.1" in their labels:
        
            clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh kernels api_env_linode.conf "4\.1.*"
            
        Default value is 138 corresponding to the latest 64-bit kernel provided by Linode.

    -   `DATACENTER_FOR_IMAGE`
    
        The preferred Linode datacenter where this image should be created. 
        
        This can be any Linode datacenter, but cluster creation is faster if the image is created in the same datacenter where cluster will be created. It's also recommended to create the image in the same datacenter as the Cluster Manager Linode. Select a datacenter that is geographically close to your premises, to reduce network delays.
        
        The value can either be the datacenter's ID or location or abbreviation. You can get a list of all datacenters using:

            clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh datacenters api_env_linode.conf 

    -   `IMAGE_ROOT_PASSWORD` **REQUIRED**
    
        The default root user password baked into the image. All nodes of any clusters created from this image will have this as the root password, unless it's overridden in a cluster's configuration file.
        
        Ensure this is a really strong password. Linode validation rules requires it to contain at least two of these four character classes: lower case letters, upper case letters, numbers, punctuation.
        
    -   `IMAGE_ROOT_SSH_PUBLIC_KEY` and `IMAGE_ROOT_SSH_PRIVATE_KEY`
    
        The keypair files for SSH public key authentication as root user. Any user who logs in with this private key  will be authenticated as root.
        
        By default, cluster_manager.sh setup would have already created a keypair named clusterroot and clusterroot.pub under /home/clustermgr/.ssh/.
        
        If you wish to replace them with your own keypair, select a descriptive filename for this new keypair (example: "myclusterroot"), generate them using `ssh-keygen` as described in the [Appendix](#appendix-generating-ssh-keypairs), and set their full paths here.
        
    -   `IMAGE_DISABLE_SSH_PASSWORD_AUTHENTICATION`
    
        Default value: `yes` (recommended)
        
        If this is `yes`, password based SSH authentication is disabled. Any user who wishes to log in via ssh into any cluster node created from this image should have the correct SSH private key. This improves the cluster's security.
        
        If this is `no`, password based SSH authentication is enabled, and both password and key based authentication are available on all nodes created from this image. Allowing password based SSH authentication reduces the cluster's security.
        
    -   `IMAGE_ADMIN_USER`
    
        Often, administrators or developers may have to log in to the cluster nodes for maintenance or troubleshooting. 
        
        Instead of logging in as root users, it's better to log in as a non-root but privileged user.
        
        The script creates a privileged user with this name in the image (and as a consequence, in all cluster nodes based on this image).
        
    -   `IMAGE_ADMIN_PASSWORD` **REQUIRED**
    
        Password for `IMAGE_ADMIN_USER`.
        
    -   `IMAGE_ADMIN_SSH_AUTHORIZED_KEYS`
    
        A file which contains public keys of all personnel authorized to log in to cluster nodes as IMAGE_ADMIN_USER. 
        
        This file should be in the same format as the standard SSH *authorized_keys* file. All the entries in this file are appended to the image's authorized_keys file, and get inherited into all nodes based on this image.
        
        By default, cluster_manager.sh setup creates a new 'clusteradmin' keypair, and this variable is set to the path of the public key. 
        
        You can either retain this generated keypair and distribute the generated private key file /home/clustermgr/.ssh/clusteradmin to authorized personnel. 
        
        Or you can do the reverse – collect public keys of authorized personnel and append them to /home/clustermgr/.ssh/clusteradmin.pub.

    -   `IMAGE_DISK_SIZE`
    
        The size of the image disk in MB. 
        
        Default value of 5000MB is good enough, since it's just a minimal OS distribution, with Java and Storm software installed.
        
    -   `UPGRADE_OS`
    
        If `yes`, the distribution is updated and upgraded before installing any software. Recommended to leave it as `yes`, to avoid any installation complications.
        
    -   `INSTALL_STORM_DISTRIBUTION`
    
        The Storm version to install. By default, cluster_manager.sh setup has already downloaded version 0.9.5.
        
        If you wish to install a different version, download it manually and change this variable.
        
        *Note*: These scripts have not been tested for any version other than 0.9.5.

    -   `STORM_INSTALL_DIRECTORY`
    
        The directory where Storm will be installed on the image (and therefore, on all cluster nodes created from this image).
        
        Default value: /opt
        
    -   `STORM_YAML_TEMPLATE`
    
        The path of the template storm.yaml configuration file to install in the image.
        
        By default, it points to the template-storm.yaml file under image directory.
        
        Administrator can either customize this YAML file before creating the image, or set this variable to point to any other storm.yaml of their choice.
        
    -   `STORM_USER`
    
        The username under which Storm daemon runs. 
        
        This is a security feature to avoid privilege escalation by exploiting some vulnerability in the Storm daemon.
        
        Default username: storm
        
    -   `SUPERVISORD_TEMPLATE_CONF`
    
        The path of the template supervisor configuration file to install in the image.
        
        By default, it points to the template-storm-supervisord.conf file under image directory.
        
        Administrator can modify this file before creating the image, or set this variable to point to any other storm-supervisord.conf of their choice.

8.  Save the changes and close the editor.

9.  Create the image using `create-image` command, specifying the newly created image name and API environment file:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh create-image  storm-image1 api_env_linode.conf
        
    If the image is created successfully,  the output will look something like this towards the end:
    
        ....
        Deleting the temporary linode xxxxxx

        Finished creating Storm template image yyyyyy


    {: .note}
    >
    > During this process, a short lived 2GB linode is created and deleted. This will entail a small cost in the monthly invoice and trigger an event notification email to be sent to the address you have registered with Linode. This is perfectly normal.

### 4. Create a Storm Cluster

{: .note}
>
>    For creating a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

In this section, you will learn how to create a new Storm cluster in which every node is a replica of an existing Storm image. If you have not created any Storm images, do so first by following [Create a Storm image](#create-a-storm-image).

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Decide on a unique name for the new cluster. In this example, we'll call it `storm-cluster1`.

    The name should follow these naming conventions...
    
        -   Maximum 25 characters in length 
        -   Alphabets, digits, hyphens, underscores only
        -   No spaces
        -   No other special characters
        -   Cannot be empty

    The name should be unique because it is possible that in future, you may want to create additional Storm clusters for other projects.

3.  Create configuration directory for the new cluster using `new-cluster-conf` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh new-cluster-conf storm-cluster1
        
4.  List the directory to see a newly created subdirectory named `storm-cluster1` and under it, the files that make up the cluster configuration:

        clustermgr@clustermgr:~/storm-linode$ ls storm-cluster1 
        
        storm-cluster1.conf

5.  *cluster-name.conf* (for example, *storm-cluster1.conf* here) is the main cluster configuration file, and the one you'll be modifying the most. Its properties are described next.  

6.  Open the cluster configuration file (in this example, `./storm-cluster1/storm-cluster1.conf`) in an editor:

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh ./storm-cluster1/storm-cluster1.conf

7.  Enter or edit values of configuration properties as required. Properties that should be mandatorily entered or changed from their default values are marked as **REQUIRED**:


    -   `DATACENTER_FOR_CLUSTER`
    
        The preferred Linode datacenter where the nodes of this cluster should be created. All nodes of a cluster have to be in the same datacenter; they cannot span multiple datacenters.
        
        This should be the same datacenter as the Zookeeper cluster it'll use.
        
        The value can either be the datacenter's ID or location or abbreviation. You can get a list of all datacenters using:
        
            clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh datacenters api_env_linode.conf 
        
    -   `NIMBUS_NODE`
    
        This variable specifies the Linode plan to use for the Nimbus node, which is responsible for distributing and coordinating a Storm topology to supervisor nodes.
        
        It should be one of `2GB | 4GB| ....| 120GB` (see [Linode plans](/pricing) for all plans).
        
        Default: 2GB, but a more powerful plan is strongly recommended for Nimbus.
        
    -   `SUPERVISOR_NODES`
    
        Supervisor nodes are the workhorses that execute the spouts and bolts that make up a Storm topology. 
        
        The size and number of supervisor nodes should be decided based on how many topologies the cluster should run concurrently, and the computational complexities of their spouts and bolts.

        Syntax is: 
        `plan:count plan:count ....`

        where a `plan` is one of `2GB | 4GB| ....| 120GB` (see [Linode plans](/pricing) for all plans) and count is the number of supervisor nodes with that plan.
        
        Although a cluster can have supervisor nodes of different plans, it's recommended to use the same plan for all nodes.
        
        The number of supervisor nodes can be increased later on using the `add-nodes` command (see [Expand Cluster](#expand-a-storm-cluster) ).

        Examples: 
        
        -   Create three 4GB nodes:
        
            SUPERVISOR_NODES="4GB:3"

        -   Create six nodes with different plans:

            SUPERVISOR_NODES="2GB:2 4GB:2 8GB:2"
    
    -   `CLIENT_NODE`
    
        The client node of a cluster is used to submit topologies to it and monitor it.
        
        It should be one of `2GB | 4GB| ....| 120GB` (see [Linode plans](/pricing) for all plans).
        
        Default: 2GB
        
    -   `STORM_IMAGE_CONF` **REQUIRED**
    
        Path of the Storm image directory to use as a template for creating nodes of this cluster. Every node's disk will be a replica of this image.
        
        The path can either be an absolute path, or a path that is relative to this cluster configuration directory.
        
        Examples:
        
        STORM_IMAGE_CONF=/home/clustermgr/storm-linode/storm-image1

        or
        
        STORM_IMAGE_CONF=../storm-image1

    -   `NODE_DISK_SIZE`
    
        Size of each node's disk in MB. It should be at least as large as the selected image's disk.

    -   `NODE_ROOT_PASSWORD`
    
        (Optional) Specify a root password for the nodes. 
        
        If this is empty, the root password will be the `IMAGE_ROOT_PASSWORD` in image configuration file.

    -   `NODE_ROOT_SSH_PUBLIC_KEY` and `NODE_ROOT_SSH_PRIVATE_KEY`
    
        (Optional) Specify a SSH public key file and private key file for root user authentication. 
        
        If this is empty, the keys will be the keys specified in image configuration file.
        
        If you wish to override the default with your own keypair, select a descriptive filename for this new keypair (example: *stormcluster1root*), generate them using `ssh-keygen` as described in the [Appendix](#appendix-generating-ssh-keypairs), and set their full paths here.

    -   `NIMBUS_NODE_PUBLIC_HOSTNAME`, `SUPERVISOR_NODES_PUBLIC_HOSTNAME_PREFIX` and  `CLIENT_NODES_PUBLIC_HOSTNAME_PREFIX`
    
        Every linode in the cluster has a *public IP address*, which can be reached from anywhere on the Internet, and a *private IP address*, which can be reached only from other nodes of the same user inside the same datacenter.
        
        Accordingly, every node is given a *public hostname* that resolves to its public IP address. If the cluster manager node is in a different Linode datacenter from the cluster nodes, it uses the public hostnames and public IP addresses to communicate with cluster nodes.

    -   `NIMBUS_NODE_PRIVATE_HOSTNAME`, `SUPERVISOR_NODES_PRIVATE_HOSTNAME_PREFIX` and  `CLIENT_NODES_PRIVATE_HOSTNAME_PREFIX`
    
        Every linode in the cluster is given a *private hostname* that resolves to its private IP address. All the nodes of a cluster communicate with one another through their private hostnames. 
        
        This is also the actual hostname set for the node using the host's hostname command and saved in /etc/hostname. 

    -   `CLUSTER_MANAGER_USES_PUBLIC_IP`
    
        {: .caution}
        >
        > It's very important to set this correctly to avoid critical cluster creation failures.
        
        Set it to `false` if the cluster manager node is located in the *same* Linode datacenter as the cluster nodes.
        This is the recommended value and is also the default.
        
        Change to `true` only if the cluster manager node is located in a *different* Linode datacenter from the cluster nodes.

    -   `ZOOKEEPER_CLUSTER` **REQUIRED**
    
        Path of the Zookeeper cluster directory to be used by this Storm cluster.
        
        This can be either an absolute path or a relative path that is relative to this Storm cluster configuration directory.

        Examples:
        
        ZOOKEEPER_CLUSTER=/home/clustermgr/storm-linode/zk-cluster1
        
        or 
        
        ZOOKEEPER_CLUSTER=../zk-cluster1
        

    -   `IPTABLES_V4_RULES_TEMPLATE`
    
        Absolute or relative path of the IPv4 iptables firewall rules file applied to Nimbus and Supervisor nodes.
        
        Modify this if you want to customize their firewall configuration.
        
        Default: `../template-storm-iptables-rules.v4`
        
    -   `IPTABLES_CLIENT_V4_RULES_TEMPLATE`
    
        Absolute or relative path of the IPv4 iptables firewall rules file applied to Client node. Since the client node hosts a cluster monitoring web server and should be accessible to administrators and developers, its rules are different from those of other nodes.
        
        Modify this if you want to customize its firewall configuration.
        
        Default: `../template-storm-client-iptables-rules.v4`

    -   `IPTABLES_V6_RULES_TEMPLATE`
    
        Absolute or relative path of the IPv6 iptables firewall rules file followed for all nodes, including client node.
        
        IPv6 is completely disabled on all nodes, and no services listen on IPv6 addresses.
        
        Modify this if you want to customize the firewall configuration.
        
        Default: `../template-storm-iptables-rules.v6`

8.  Save the changes and close the editor.

9.  Create the cluster using the `create` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh create storm-cluster1  api_env_linode.conf

    If the cluster is created successfully,  a success message is printed:
    
        ...
        Storm cluster successfully created
        
        clustermgr@clustermgr:~/storm-linode$


10.  Details of the created cluster can be viewed using `describe` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh describe storm-cluster1

11.  Cluster nodes are shutdown soon after creation. Learn how to start the cluster in the next section.

## Start a Storm Cluster

{: .note}
>
>For starting a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Start a Storm cluster using the `start` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh start <cluster-name> api_env_linode.conf
    
    Example:
    
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh start storm-cluster1 api_env_linode.conf

3.  The script will automatically start the required Zookeeper cluster too if required.

4.  If cluster is being started for the very first time, see how to [authorize users to monitor a Storm cluster](#monitor-a-storm-cluster).

## Monitor a Storm Cluster

Every Storm cluster's client node runs a Storm UI web application for monitoring that cluster, but it can be accessed only from whitelisted workstations. 

The next two sections explain how to whitelist workstations and monitor a cluster.

### 1. Whitelist Workstations to Monitor a Storm Cluster

{: .note}
>
>For whitelisting, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode

2.  Open the `<your-cluster>/<your-cluster>-client-user-whitelist.ipsets` file (example: storm-cluster1/storm-cluster1-client-user-whitelist.ipsets) file in an editor:

        clustermgr@clustermgr:~/storm-linode$ nano -Y sh storm-cluster1/storm-cluster1-client-user-whitelist.ipsets

3.  The file is an [ipsets](http://ipset.netfilter.org/ipset.man.html) list of whitelisted IP addresses (or any other attributes supported by  ipsets). 

4.  It consists of one master ipset and multiple child ipsets that list whitelisted machines by IP addresses or other attributes such as MAC IDs.

5.  The master ipset is named *[your-cluster]-uwls*. By default, it's completely empty which means nobody is authorized.

    [![Master ipset](/docs/assets/storm-user-whitelist-1-650px.png)](/docs/assets/storm-user-whitelist-1.png)

6.  To whitelist an IP address:

    -   uncomment the line that creates the *[your-cluster]-ipwl* ipset
    
    -   add the IP address under it
    
    -   add *[your-cluster]-ipwl* to the master ipset *[your-cluster]-uwls*
    
    These additions are highlighted below:

    [![Whitelist entries](/docs/assets/storm-user-whitelist-2-650px.png)](/docs/assets/storm-user-whitelist-2.png)
    
    {: .note}
    >
    > Any IP address that is being included in the file should be a *public facing IP* address of the network.
    > For example, company networks often assign local addresses like 10.x.x.x or  192.x.x.x addresses to employee workstations, which are then NATted to a public IP address while sending requests outside the company network.
    > Since the cluster client node is in the Linode cloud outside your company network, it will see monitoring requests as arriving from this public IP address. So it's the public IP address that should be whitelisted.

7.  Any number or type of additional ipsets can be created, as long as they are added to the master ipset.

    See the [**Set Types** section in the ipset manual](http://ipset.netfilter.org/ipset.man.html#lbAS) for available types of ipsets.
    
    Note that some of the types listed in the manual may not be available on the client node because the ipset version installed on it using Ubuntu or Debian package manager is likely to be an older version.

8.  Enter all required ipsets, save the file and close the editor.

9.  Activate the new ipsets on cluster client node with `update-user-whitelist` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh update-user-whitelist storm-cluster1
        
10.  Log in to the client node from the Cluster Manager Linode, and verify that the new ipsets have been configured correctly:

        clustermgr@clustermgr:~/storm-linode$ ssh -i ~/.ssh/clusterroot root@storm-cluster1-private-client1
        ...
        root@storm-cluster1-private-client1:~# ipset list
        root@storm-cluster1-private-client1:~# exit
        
    You should see output similar to this (in addition to other ipsets not shown in this image):
    
    ![ipset output](/docs/assets/storm-user-whitelist-3.png)
    
11.  Get the public IP address of client node. This IP address should be passed on to employees authorized to access the Storm UI monitoring web application:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh describe storm-cluster1
        
12.  Finally, verify that the Storm UI web application is accessible from whitelisted workstations by opening `http://public-IP-of-client-node` on each one of them. 

    The Storm UI web application looks like this:
    
    [![Storm UI](/docs/assets/storm-ui-650px.png)](/docs/assets/storm-ui-large.png)

### 2. Monitor a Storm Cluster using Storm UI

Storm UI monitoring can be accessed at `http://public-IP-of-client-node` but only from a whitelisted workstation.

See [Whitelist Workstations to Monitor a Storm Cluster](#whitelist-workstations-to-monitor-a-storm-cluster) to understand how to whitelist a workstation.

On a whitelisted workstation, execute these steps to monitor a cluster:

1.  First, you have to find out the *public IP address* of the client node of the target Storm cluster.

    If you are authorized to log in to the cluster manager node as `clustermgr` user, log in that way and get the public IP address using `describe` command.
    
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh describe storm-cluster1

    Otherwise, you should be authorized to log in to the cluster manager node as `clustermgrguest` user.  Log in that way and get the public IP address using `cluster_info.sh`.
    
        you@workstation:~$ ssh -i ~/.ssh/id_rsa clustermgrguest@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgrguest@clustermgr:~$ cd storm-linode
        
        # Get the list of all clusters:
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh list
        
        # Get info for one of the clusters:
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh info <one_of_the_listed_clusters>

2.  Open the Storm UI web application at `http://public-IP-of-client-node` in a browser.

3.  Storm UI displays the list of topologies and the list of supervisors executing them:

    [![Storm UI monitoring](/docs/assets/storm-ui-monitor-650px.png)](/docs/assets/storm-ui-monitor.png)
    
4.  If the cluster is executing any topologies, they are listed under the **Topology summary** section. 

    Click on a topology to access its statistics, supervisor node logs, or actions like killing that topology.

## Test a New Storm Cluster

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key: 

        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Get the private IP address (this is preferred for security and cost reasons, but public IP address too works)  of the client node of the target cluster.        

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh describe storm-cluster1

3.  Log in to the client node as its `IMAGE_ADMIN_USER` user (default value : `clusteradmin`, configured in the Storm image configuration file) via ssh using an authorized private key: 

        clustermgr@clustermgr:~$ ssh -i ~/.ssh/clusteradmin clusteradmin@<client-node-ip-address>

4.  Run the following command to start the pre-installed word count example topology:

        clusteradmin@storm-cluster1-private-client1:~$ cd /opt/apache-storm-0.9.5/bin

        clusteradmin@storm-cluster1-private-client1:/opt/apache-storm-0.9.5/bin$ ./storm jar ../examples/storm-starter/storm-starter-topologies-0.9.5.jar storm.starter.WordCountTopology "wordcount" 

5.  A successful submission should produce output that looks like this:

        clusteradmin@storm-cluster1-private-client1:/opt/apache-storm-0.9.5/bin$ ./storm jar ../examples/storm-starter/storm-starter-topologies-0.9.5.jar storm.starter.WordCountTopology "wordcount" 
        
        Running: java -client -Dstorm.options= -Dstorm.home=/opt/apache-storm-0.9.5 -Dstorm.log.dir=/var/log/storm -Djava.library.path=/usr/local/lib:/opt/local/lib:/usr/lib -Dstorm.conf.file= -cp /opt/apache-storm-0.9.5/lib/disruptor-2.10.1.jar:/opt/apache-storm-0.9.5/lib/minlog-1.2.jar:/opt/apache-storm-0.9.5/lib/commons-io-2.4.jar:/opt/apache-storm-0.9.5/lib/clj-time-0.4.1.jar:/opt/apache-storm-0.9.5/lib/clout-1.0.1.jar:/opt/apache-storm-0.9.5/lib/ring-devel-0.3.11.jar:/opt/apache-storm-0.9.5/lib/tools.macro-0.1.0.jar:/opt/apache-storm-0.9.5/lib/ring-jetty-adapter-0.3.11.jar:/opt/apache-storm-0.9.5/lib/jetty-util-6.1.26.jar:/opt/apache-storm-0.9.5/lib/commons-exec-1.1.jar:/opt/apache-storm-0.9.5/lib/tools.cli-0.2.4.jar:/opt/apache-storm-0.9.5/lib/objenesis-1.2.jar:/opt/apache-storm-0.9.5/lib/jetty-6.1.26.jar:/opt/apache-storm-0.9.5/lib/ring-servlet-0.3.11.jar:/opt/apache-storm-0.9.5/lib/storm-core-0.9.5.jar:/opt/apache-storm-0.9.5/lib/hiccup-0.3.6.jar:/opt/apache-storm-0.9.5/lib/clojure-1.5.1.jar:/opt/apache-storm-0.9.5/lib/commons-codec-1.6.jar:/opt/apache-storm-0.9.5/lib/servlet-api-2.5.jar:/opt/apache-storm-0.9.5/lib/compojure-1.1.3.jar:/opt/apache-storm-0.9.5/lib/json-simple-1.1.jar:/opt/apache-storm-0.9.5/lib/commons-logging-1.1.3.jar:/opt/apache-storm-0.9.5/lib/math.numeric-tower-0.0.1.jar:/opt/apache-storm-0.9.5/lib/asm-4.0.jar:/opt/apache-storm-0.9.5/lib/commons-lang-2.5.jar:/opt/apache-storm-0.9.5/lib/clj-stacktrace-0.2.2.jar:/opt/apache-storm-0.9.5/lib/kryo-2.21.jar:/opt/apache-storm-0.9.5/lib/logback-classic-1.0.13.jar:/opt/apache-storm-0.9.5/lib/slf4j-api-1.7.5.jar:/opt/apache-storm-0.9.5/lib/reflectasm-1.07-shaded.jar:/opt/apache-storm-0.9.5/lib/ring-core-1.1.5.jar:/opt/apache-storm-0.9.5/lib/joda-time-2.0.jar:/opt/apache-storm-0.9.5/lib/logback-core-1.0.13.jar:/opt/apache-storm-0.9.5/lib/snakeyaml-1.11.jar:/opt/apache-storm-0.9.5/lib/carbonite-1.4.0.jar:/opt/apache-storm-0.9.5/lib/tools.logging-0.2.3.jar:/opt/apache-storm-0.9.5/lib/core.incubator-0.1.0.jar:/opt/apache-storm-0.9.5/lib/chill-java-0.3.5.jar:/opt/apache-storm-0.9.5/lib/jgrapht-core-0.9.0.jar:/opt/apache-storm-0.9.5/lib/jline-2.11.jar:/opt/apache-storm-0.9.5/lib/commons-fileupload-1.2.1.jar:/opt/apache-storm-0.9.5/lib/log4j-over-slf4j-1.6.6.jar:../examples/storm-starter/storm-starter-topologies-0.9.5.jar:/opt/apache-storm-0.9.5/conf:/opt/apache-storm-0.9.5/bin -Dstorm.jar=../examples/storm-starter/storm-starter-topologies-0.9.5.jar storm.starter.WordCountTopology wordcount 
        
        1038 [main] INFO  backtype.storm.StormSubmitter - Jar not uploaded to master yet. Submitting jar... 
        1061 [main] INFO  backtype.storm.StormSubmitter - Uploading topology jar ../examples/storm-starter/storm-starter-topologies-0.9.5.jar to assigned location: /var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar 
        Start uploading file '../examples/storm-starter/storm-starter-topologies-0.9.5.jar' to '/var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar' (3248678 bytes) 
        [==================================================] 3248678 / 3248678 
        File '../examples/storm-starter/storm-starter-topologies-0.9.5.jar' uploaded to '/var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar' (3248678 bytes) 
        1260 [main] INFO  backtype.storm.StormSubmitter - Successfully uploaded topology jar to assigned location: /var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar 
        1261 [main] INFO  backtype.storm.StormSubmitter - Submitting topology wordcount in distributed mode with conf {"topology.workers":3,"topology.debug":true} 
        2076 [main] INFO  backtype.storm.StormSubmitter - Finished submitting topology: wordcount 
        
        clusteradmin@storm-cluster1-private-client1:/opt/apache-storm-0.9.5/bin$

5.  Verify that the topology is running correctly by [monitoring the cluster from Storm UI](#monitor-a-storm-cluster).

## Start a New Topology

Software developers of your company should perform these steps to start a new topology on one of your Linode Storm clusters:

{: .note}
>
> +   The developer should have `clusteradmin` (or `clusterroot`) authorization to log in to the client node of the target Storm cluster.
>
> +    (Optionally) To get the IP address of client node, the developer should have `clustermgrguest` (or `clustermgrroot`) authorization to log in to the Cluster Manager Linode. If the IP address is known by other methods, this authorization is not required.

1.  Develop the spouts and bolts that make up the topology.

2.  Package them along with all the third party classes on which they depend into a single JAR (Java Archive). 

3.  If multiple clusters are deployed, select the target Storm cluster to run the topology on.

4.  Get the public IP address of the client node of the target cluster. See [cluster description](#describe-a-storm-cluster) for details on how to do this.

5.  Transfer the topology JAR to client node:

        you@workstation:~$ scp -i ~/.ssh/<private_key> <topology-jar-path> clusteradmin@<public-ip-of-client-node>:<topology-jar>

6.  Log in to the client node as `clusteradmin`:
        
        you@workstation:~$ ssh -i ~/.ssh/<private_key> clusteradmin@<public-ip-of-client-node>

7.  Submit the topology to the cluster:

        clusteradmin@storm-cluster1-private-client1:~$ cd /opt/apache-storm-0.9.5/bin

        clusteradmin@storm-cluster1-private-client1:/opt/apache-storm-0.9.5/bin$ ./storm jar ~/<topology-jar>.jar <main-class> "<name-of-topology>" 

8.  [Monitor the execution of the new topology.](#monitor-a-storm-cluster-using-storm-ui)

## Other Storm Cluster Operations

### 1. Expand a Storm Cluster

If the supervisor nodes of a Storm cluster are overloaded with too many topologies or CPU intensive jobs, it may help to dynamically add more supervisor nodes to take up some of the load.

{: .note}
>
>For expanding a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Decide on the number of additional nodes and their plans.

2.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        

3.  Expand the cluster using `add-nodes` command, specifying the plans and counts for the new nodes:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh add-nodes <cluster-name> api_env_linode.conf <new-nodes>

    Example 1: Add three new 4GB supervisor nodes to storm-cluster1:
    
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh add-nodes storm-cluster1  api_env_linode.conf "4GB:3"

    Example 2: Add a 2GB and two 4GB supervisor nodes to storm-cluster1: 
    
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh add-nodes storm-cluster1  api_env_linode.conf "2GB:1 4GB:2"
        
### 2. Describe a Storm Cluster

A user with `clustermgr` authorization can use `describe` command to describe a Storm cluster:

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `describe` command:

        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh describe <target-cluster-name>

A user with only `clustermgrguest` authorization can use `cluster_info.sh` to describe a Storm cluster.

1.  Log in to the Cluster Manager Linode as `clustermgrguest` via SSH using either an authorized private key...
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgrguest clustermgrguest@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
    ... or using the `clustermgrguest` user's password, if password authentication has been enabled for clustermgrguest:
        
        you@workstation:~$ ssh clustermgrguest@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        <Enter password>

2.  Execute the `list` and `info` commands:

        clustermgrguest@clustermgr:~$ cd storm-linode
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh list
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh info <target_cluster>

### 3. Stop a Storm Cluster

Stopping a Storm cluster stops all topologies executing on that cluster, stops Storm daemons on all nodes, and shuts down all nodes. 

The cluster can be restarted later. 

The nodes will still incur Linode's hourly charges even when stopped.

{: .note}
>
>For stopping a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
       
2.  Execute the `stop` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh stop <target-cluster-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh stop storm-cluster1 api_env_linode.conf


### 4. Destroy a Storm Cluster

Destroying a Storm cluster permanently deletes all nodes of that cluster and their data. They will no longer incur hourly charges.

{: .note}
>
>For destroying a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `destroy` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh destroy <target-cluster-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh destroy storm-cluster1 api_env_linode.conf

### 5. Run a Command on all Nodes of a Storm Cluster

You can run a command - such as to install a package or download an Internet resource - on all nodes of a Storm cluster.

The command will be executed as root user on each node.

{: .note}
>
>You should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `run` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh run <target-cluster-name> "<cmds"

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh run storm-cluster1 "apt-get update"

### 6. Copy Files to all Nodes of a Storm Cluster

You can copy one or more files from cluster manager node to all nodes of a Storm cluster.

The files will be copied as root user on each node.

{: .note}
>
>You should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Upload files from workstation to cluster manager node.

        you@workstation:~$ scp -i ~/.ssh/clustermgr <local-files> clustermgr@<cluster-manager-IP>:.

2.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
3.  Execute the `cp` command, giving the destination directory on each node and the list of local files to copy:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh cp <target-cluster-name> <target-directory> <local-files>

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh cp storm-cluster1 "." "~/*.data"

### 7. Delete a Storm Image

{: .note}
>
>For deleting an image, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `delete-image` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh delete-image <target-image-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./storm-cluster-linode.sh delete-image storm-image1 api_env_linode.conf

## Zookeeper Cluster Operations

### 1. Describe a Zookeeper Cluster

A user with `clustermgr` authorization can use `describe` command to describe a Zookeeper cluster:

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `describe` command:

        clustermgr@clustermgr:~/storm-linode$ ./zookeepercluster-linode.sh describe <target-cluster-name>

A user with only `clustermgrguest` authorization can use `cluster_info.sh` to describe a Zookeeper cluster.

1.  Log in to the Cluster Manager Linode as `clustermgrguest` via SSH using an authorized private key...
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgrguest clustermgrguest@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
     or using the `clustermgrguest` user's password, if password authentication has been enabled for clustermgrguest:
        
        you@workstation:~$ ssh clustermgrguest@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        <Enter password>

2.  Execute the `list` and `info` commands:

        clustermgrguest@clustermgr:~$ cd storm-linode
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh list
        clustermgrguest@clustermgr:~/storm-linode$ ./cluster_info.sh info <target_cluster>

### 2. Stop a Zookeeper Cluster

Stopping a Zookeeper cluster cleanly stops the Zookeeper daemon on all nodes, and shuts down all nodes. 

The cluster can be restarted later. 

The nodes still incur Linode's hourly charges even when stopped.

{: .caution}
>
>Do not stop a Zookeeper cluster while any Storm clusters that depend on it are running. It may result in data loss.

{: .note}
>
>For stopping a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `stop` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh stop <target-cluster-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh stop zk-cluster1 api_env_linode.conf
         
### 3. Destroy a Zookeeper Cluster

Destroying a Zookeeper cluster permanently deletes all nodes of that cluster and their data. They will no longer incur hourly charges.

{: .caution}
>
>Do not destroy a Zookeeper cluster while any Storm clusters that depend on it are running. It may result in data loss.

{: .note}
>
>For destroying a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `destroy` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh destroy <target-cluster-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh destroy zk-cluster1 api_env_linode.conf

### 4. Run a Command on all Nodes of a Zookeeper Cluster

You can run a command - such as to install a package or download an Internet resource - on all nodes of a Zookeeper cluster.

The command will be executed as root user on each node.

{: .note}
>
>You should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `run` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh run <target-cluster-name> "<cmds>"

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh run zk-cluster1 "apt-get update"
        
### 5. Copy Files to all Nodes of a Zookeeper Cluster

You can copy one or more files from cluster manager node to all nodes of a Zookeeper cluster.

The files will be copied as root user on each node.

{: .note}
>
>You should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Upload files from workstation to cluster manager node.

        you@workstation:~$ scp -i ~/.ssh/clustermgr <local-files> clustermgr@<cluster-manager-IP>:.

2.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
3.  Execute the `cp` command, giving the destination directory on each node and the list of local files to copy:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh cp <target-cluster-name> <target-directory> <local-files>

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh cp zk-cluster1 "." "~/*.data"

### 6. Delete a Zookeeper Image

{: .note}
>
>For deleting an image, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` via ssh using an authorized private key:
        
        you@workstation:~$ ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        
        clustermgr@clustermgr:~$ cd storm-linode
        
2.  Execute the `delete-image` command:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh delete-image <target-image-name> api_env_linode.conf

     Example:
        
        clustermgr@clustermgr:~/storm-linode$ ./zookeeper-cluster-linode.sh delete-image zk-image1 api_env_linode.conf

## Appendix – Generating SSH Keypairs

+   Start the `ssh-keygen` key generator interactive tool:

        clustermgr@clustermgr:~$ ssh-keygen -t rsa -b 4096
        Generating public/private rsa key pair. 
        ...

+   Next, it prompts you to enter a path for the private key file: 

        Enter file in which to save the key (/home/clustermgr/.ssh/id_rsa):

    The directory can always be /home/clustermgr/.ssh/

    The filename should be appropriate to the current step in the cluster creation workflow. 
    It's recommended to generate separate keys for each step.

    For example, 
    
	+   for the root user SSH key, filename can be */home/clustermgr/.ssh/clusterroot*

	+   for the admin user SSH key, filename cab\n be */home/clustermgr/.ssh/clusteradmin*

+   Next, it prompts you to enter a passphrase for the private key:

        Enter passphrase (empty for no passphrase):

    Normally, a passphrase is a good idea, but it requires that you either enter the passphrase every time the key is used by the script (which is extremely inconvenient), or enter it once at start up using ssh-add. For convenience, we suggest you leave the passphrase disabled by just pressing **ENTER** key.

    It then prompts you to re-enter the passphrase. 

        Enter same passphrase again:

    Just press **ENTER** key again.

+   The tool then generates the keys and saves them in two files:
    +   Private key file is */home/clustermgr/.ssh/[private-key-filename]* where [private-key-filename] is the filename entered in ssh-keygen.
    
    +   Corresponding public key file is the same filename but with an additional “.pub” extension, such as */home/clustermgr/.ssh/[private-key-filename].pub* where <private-key-filename> is the filename entered in ssh-keygen.
