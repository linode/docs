---
author:
    name: Karthik Shiraly
    email: docs@linode.com
description: 'Deploy Storm cluster on Linode cloud for real-time analytics on streaming datasets.'
keywords: ["storm", "analytics", "big data", "zookeeper"]
license: '[CC BY-ND 4.0](http://creativecommons.org/licenses/by-nd/4.0/)'
published: 2016-10-25
modified: 2017-06-21
modified_by:
    name: Phil Zona
title: 'Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm'
contributor:
    name: Karthik Shiraly
    link: https://github.com/pathbreak
external_resources:
- '[Apache Storm project website](http://storm.apache.org/)'
- '[Apache Storm documentation](https://storm.apache.org/releases/current/index.html)'
- '[Storm - Distributed and Fault-Tolerant Real-time Computation](http://www.infoq.com/presentations/Storm-Introduction)'
image: https://www.linode.com/docs/assets/big_data_linode_cloud.png
---

[Apache Storm](http://storm.apache.org/) is a big data technology that enables software, data, and infrastructure engineers to process high velocity, high volume data in real time and extract useful information. Any project that involves processing high velocity data streams in real time can benefit from it.

[Zookeeper](https://zookeeper.apache.org/) is a critical distributed systems technology that Storm depends on to function correctly.

![Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm](/docs/assets/big_data_linode_cloud.png "Big Data in the Linode Cloud: Streaming Data Processing with Apache Storm")

Some use cases where Storm is a good solution:

-  Twitter data analytics (for example, trend prediction or sentiment analysis)
-  Stock market analysis
-  Analysis of server logs
-  Internet of Things (IoT) sensor data processing

This guide explains how to create Storm clusters on the Linode cloud using a set of shell scripts that use Linode's Application Programming Interface (APIs) to programmatically create and configure large clusters. The scripts are all provided by the author of this guide via [GitHub repository](https://github.com/pathbreak/storm-linode). This application stack could also benefit from large amounts of disk space, so consider using our [Block Storage](/docs/platform/how-to-use-block-storage-with-your-linode) service with this setup.

{{< caution >}}
External resources are outside of our control, and can be changed and/or modified without our knowledge. Always review code from third party sites yourself before executing.
{{< /caution >}}

 The deployed architecture will look like this:

![Architecture of the Completed Cluster](/docs/assets/storm_zookeeper_architecture_900.png "Deployed Cluster Architecture")

&nbsp;

From an application standpoint, the flow of data is depicted below:

![Storm Topology and Deployment](/docs/assets/storm_topology_900.png "Storm Topology and Deployment")

The application flow begins, from the client side, with the Storm client, which provides a user interface. This contacts a *Nimbus* node, which is central to the operation of the Storm cluster. The Nimbus node gets the current state of the cluster, including a list of the supervisor nodes and *topologies* from the Zookeeper cluster. The Storm cluster's supervisor nodes constantly update their states to the Zookeeper nodes, which ensure that the system remains synced.

The method by which Storm handles and processes data is called a *topology*. A topology is a network of components that perform individual operations, and is made up of *spouts*, which are sources of data, and *bolts*, which accept the incoming data and perform operations such as running functions or transformations. The data itself, called a *stream* in Storm terminology, comes in the form of unbounded sequences of tuples.

This guide will explain how to configure a working Storm cluster and its Zookeeper nodes, but it will not provide information on how to develop custom topologies for data processing. For more information on creating and deploying Storm topologies, see the [Apache Storm tutorial](https://storm.apache.org/releases/current/Tutorial.html).

## Before You Begin

### OS Requirements

-  This article assumes that the workstation used for the initial setup of the cluster manager Linode is running Ubuntu 14.04 LTS or Debian 8. This can be your local computer, or another Linode acting as your remote workstation. Other distributions and operating systems have not been tested.
-  After the initial setup, any SSH capable workstation can be used to log in to the cluster manager Linode or cluster nodes.
-  The cluster manager Linode can have either Ubuntu 14.04 LTS or Debian 8 installed.
-  A Zookeeper or Storm cluster can have either Ubuntu 14.04 LTS or Debian 8 installed on its nodes. Its distribution does not need to be the same one as the one installed on the cluster manager Linode.

{{< note >}}
The steps in this guide and in the bash scripts referenced require root privileges. Be sure to run the steps below as `root`. For more information on privileges, see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

### Naming Conventions

Throughout this guide, we will use the following names as examples that refer to the images and clusters we will be creating:

-  `zk-image1` - Zookeeper image
-  `zk-cluster1` - Zookeeper cluster
-  `storm-image1` - Storm image
-  `storm-cluster1` - Storm cluster

These are the names we'll use, but you are welcome to choose your own when creating your own images and clusters. This guide will use these names in all example commands, so be sure to substitute your own names where applicable.

### Get a Linode API Key

Follow the steps in [Generating an API Key](/docs/platform/api/api-key) and save your key securely. It will be entered into configuration files in upcoming steps.

If the key expires or is removed, remember to create a new one and update the `api_env_linode.conf` API environment configuration file on the cluster manager Linode. This will be explained further in the next section.

## Set Up the Cluster Manager

The first step is setting up a central *Cluster Manager* to store details of all Storm clusters, and enable authorized users to create, manage or access those clusters. This can be a local workstation or a Linode, but in this guide will be a Linode.

1.  The scripts used in this guide communicate with Linode's API using Python. On your workstation, install Git, Python 2.7 and curl:

        sudo apt-get install python2.7 curl git

2.  Download the project git repository:

        git clone "https://github.com/pathbreak/storm-linode"
        cd storm-linode
        git checkout $(git describe $(git rev-list --tags='release*' --max-count=1))

3.  Make the shell and Python scripts executable:

        chmod +x *.sh *.py

4.  Make a working copy of the API environment configuration file:

        cp api_env_example.conf api_env_linode.conf

5.  Open `api_env_linode.conf` in a text editor, and set `LINODE_KEY` to the API key previously created (see [Get a Linode API key](#get-a-linode-api-key)).

    {{< file-excerpt "~/storm-linode/api_env_linode.conf" >}}
export LINODE_KEY=fnxaZ5HMsaImTTRO8SBtg48...

{{< /file-excerpt >}}


6.  Open `~/storm-linode/cluster_manager.sh` in a text editor and change the following configuration settings to customize where and how the Cluster Manager Linode is created:

    -  `ROOT_PASSWORD`:
        This will be the root user's password on the Cluster Manager Linode and is **required** to create the node. Set this to a secure password of your choice. Linode requires the root password to contain at least 2 of these 4 character types:

        *  lower case characters
        *  upper case characters
        *  numeric characters
        *  symbolic characters

        If you have spaces in your password, make sure the entire password is enclosed in double quotes (`"`). If you have double quotes, dollar characters or backslashes in your password, escape each of them with a backslash (`\`).

    -  `PLAN_ID`:
        The default value of `1` creates the Cluster Manager Linode as a 2GB node, the smallest plan. This is usually sufficient. However, if you want a more powerful Linode, use the following commands to see a list of all available plans and their IDs:

            source ~/storm-linode/api_env_linode.conf
            ~/storm-linode/linode_api.py plans

        {{< note >}}
You only need to run `source` on this file once in a single terminal session, unless you make changes to it.
{{< /note >}}

    -  `DATACENTER`:
        This specifies the Linode datacenter where the Cluster Manager Linode is created. Set it to the ID of the datacenter that is nearest to your location, to reduce network latency. It's also recommended to create the cluster manager node in the same datacenter where the images and cluster nodes will be created, so that it can communicate with them using low latency private IP addresses and reduce data transfer usage.

        To view the list of datacenters and their IDs:

            source ~/storm-linode/api_env_linode.conf
            ~/storm-linode/linode_api.py datacenters table

    -  `DISTRIBUTION`:
        This is the ID of the distribution to install on the Cluster Manager Linode. This guide has been tested only on Ubuntu 14.04 or Debian 8; other distributions are not supported.

        The default value of `124` selects Ubuntu 14.04 LTS 64-bit. If you'd like to use Debian 8 instead, change this value to `140`.

        {{< note >}}
The values represented in this guide are current as of publication, but are subject to change in the future. You can run `~/storm-linode/linode_api.py distributions` to see a list of all available distributions and their values in the API.
{{< /note >}}

    -  `KERNEL`:
        This is the ID of the Linux kernel to install on the Cluster Manager Linode. The default value of `138` selects the latest 64-bit Linux kernel available from Linode. It is recommended not to change this setting.

    -  `DISABLE_SSH_PASSWORD_AUTHENTICATION`:
        This disables SSH password authentication and allows only key-based SSH authentication for the Cluster Manager Linode. Password authentication is considered less secure, and is hence disabled by default. To enable password authentication, you can change this value to `no`.

    {{< note >}}
The options shown in this section are generated by the `linode_api.py` script, and differ slightly from the options shown using the Linode CLI tool. Do not use the Linode CLI tool to configure your Manager Node.
{{< /note >}}

    When you've finished making changes, save and close the editor.

7.  Now, create and set up the Cluster Manager Linode:

        ./cluster_manager.sh create-linode api_env_linode.conf

    Once the node is created, you should see output like this:

    ![Cluster Manager creation](/docs/assets/storm-clustermgr-creation-2.png)

    Note the public IP address of the Cluster Manager Linode. You will need this when you log into the cluster manager to create or manage clusters.

8.  The `cluster_manager.sh` script we ran in the previous step creates three users on the Cluster Manager Linode, and generates authentication keypairs for all of them on your workstation, as shown in this illustration:

    ![Security Overview](/docs/assets/storm_clustermgrkeys_900.png)

    -  `~/.ssh/clustermgrroot` is the private key for Cluster Manager Linode's *root* user. Access to this user's credentials should be as restricted as possible.

    -  `~/.ssh/clustermgr` is the private key for the Cluster Manager Linode's *clustermgr* user. This is a privileged administrative user who can create and manage Storm or Zookeeper clusters. Access to this user's credentials should be as restricted as possible.

    -  `~/.ssh/clustermgrguest` is the private key for Cluster Manager Linode's *clustermgrguest* user. This is an unprivileged user for use by anybody who need information about Storm clusters, but not the ability to manage them. These are typically developers, who need to know a cluster's client node IP address to submit topologies to it.

    SSH password authentication to the cluster manager is disabled by default. It is recommended to leave the default setting. However, if you want to enable password authentication for just *clustermgrguest* users for convenience, log in  to the newly created cluster manager as `root` and append the following line to the **end** of `/etc/ssh/sshd_config`:

    {{< file-excerpt "/etc/ssh/sshd_config" aconf >}}
Match User clustermgrguest
  PasswordAuthentication yes

{{< /file-excerpt >}}


    Restart the SSH service to enable this change:

        service ssh restart

    {{< caution >}}
Since access to the cluster manager provides access to all Storm and Zookeeper clusters and any sensitive data they are processing, its security configuration should be considered critical, and access should be as restrictive as possible.
{{< /caution >}}

9.  Log in to the cluster manager Linode as the `root` user, using the public IP address shown when you created it:

        ssh -i ~/.ssh/clustermgrroot root@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE

10.  Change the hostname to something more descriptive. Here, we are changing it to *clustermgr*, but you may substitute a different name if you like:

         sed -i -r "s/127.0.1.1.*$/127.0.1.1\tclustermgr/" /etc/hosts
         echo clustermgr > /etc/hostname
         hostname clustermgr

11.  Set passwords for the *clustermgr* and *clustermgrguest* users:

         passwd clustermgr
         passwd clustermgrguest

        Any administrator logging in as the *clustermgr* user should know this password because they will be asked to enter the password when attempting a privileged command.

12.  Delete `cluster_manager.sh` from root user's directory and close the SSH session:

         rm cluster_manager.sh
         exit

13.  Log back in to the Cluster Manager Linode - this time as *clustermgr* user - using its public IP address and the private key for *clustermgr* user:

         ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE

14.  Navigate to your `storm-linode` directory and make a working copy of `api_env_example.conf`. In this example, we'll call it `api_env_linode.conf`:

         cd storm-linode
         cp api_env_example.conf api_env_linode.conf

15.  Open the newly created `api_env_linode.conf` in a text editor and set `LINODE_KEY` to your API key. Set `CLUSTER_MANAGER_NODE_PASSWORD` to the password you set for the *clustermgr* user in Step 11.

        {{< file-excerpt "~/storm-linode/api_env_linode.conf" aconf >}}
export LINODE_KEY=fnxaZ5HMsaImTTRO8SBtg48...
...
export CLUSTER_MANAGER_NODE_PASSWORD=changeme

{{< /file-excerpt >}}


            Save your changes and close the editor.

16.  The cluster manager Linode is now ready to create Apache Storm clusters. Add the public keys of anyone who will manage the clusters to `/home/clustermgr/.ssh/authorized_keys`, so that they can connect via SSH to the Cluster Manager Linode as user `clustermgr`.

## Create a Storm Cluster

Creating a new Storm cluster involves four main steps, some of which are necessary only the first time and can be skipped when creating subsequent clusters.

### Create a Zookeeper Image

A *Zookeeper image* is a master disk image with all necessary Zookeeper softwares and libraries installed. We'll create our using [Linode Images](/docs/platform/linode-images) The benefits of using a Zookeeper image include:

-  Quick creation of a Zookeeper cluster by simply cloning it to create as many nodes as required, each a perfect copy of the image
-  Distribution packages and third party software packages are identical on all nodes, preventing version mismatch errors
-  Reduced network usage, because downloads and updates are executed only once when preparing the image instead of repeating them on each node

{{< note >}}
If a Zookeeper image already exists, this step is not mandatory. Multiple Zookeeper clusters can share the same Zookeeper image. In fact, it's a good idea to keep the number of images low because image storage is limited to 10GB.

When creating an image, you should have `clustermgr` authorization to the Cluster Manager Linode.
{{< /note >}}

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Choose a unique name for your image and create a configuration directory for the new image using the `new-image-conf` command. In this example, we'll call our new image `zk-image1`:

        ./zookeeper-cluster-linode.sh new-image-conf zk-image1

    This creates a directory named `zk-image1` containing the files that make up the image configuration:

    -  **zk-image1.conf** - This is the main image configuration file, and the one you'll be modifying the most. Its properties are described in the next step. This file is named `zk-image1.conf` in our example, but if you chose a different image name, yours may vary.

    -  **zoo.cfg** - This is the primary Zookeeper configuration file. See the official [Zookeeper Configuration Parameters documentation](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_configuration) for details on what parameters can be customized. It's not necessary to enter the cluster's node list in this file. That's done automatically by the script during cluster creation.

    -  **log4j.properties** - This file sets the default logging levels for Zookeeper components. You can also customize these at the node level when a cluster is created.

    -  **zk-supervisord.conf** - The Zookeeper daemon is run under supervision so that if it shuts down unexpectedly, it's automatically restarted by Supervisord. There is nothing much to customize here, but you can refer to the [Supervisord Configuration documentation](http://supervisord.org/configuration.html) if you want to learn more about the options.

3.  Open the image configuration file (in this example, `./zk-image1/zk-image1.conf`) in a text editor. Enter or edit values of configuration properties as required. Properties that *must* be entered or changed from their default values are marked as **REQUIRED**:

    -  `DISTRIBUTION_FOR_IMAGE`

        Specify either Ubuntu 14.04 or Debian 8 to use for this image. This guide has *not* been tested on any other versions or distributions.

        All nodes of all clusters created from this image will have this distribution. The default value is `124` corresponding to Ubuntu 14.04 LTS 64-bit. For Debian 8 64-bit, change this value to `140`.

        {{< note >}}
The values represented in this guide are current as of publication, but are subject to change in the future. You can run `~/storm-linode/linode_api.py distributions` to see a list of all available distributions and their values in the API.
{{< /note >}}

        <br>

    -  `LABEL_FOR_IMAGE`

        A label to help you differentiate this image from others. This name will be shown if you edit or view your images in the Linode Manager.

        <br>

    -  `KERNEL_FOR_IMAGE`

        The kernel version provided by Linode to use in this image. The default value is `138`, corresponding to the latest 64-bit kernel provided by Linode. It is recommended that you leave this as the default setting.

        <br>

    -  `DATACENTER_FOR_IMAGE`

        The Linode datacenter where this image will be created. This can be any Linode datacenter, but cluster creation is faster if the image is created in the same datacenter where the cluster will be created. It's also recommended to create the image in the same datacenter as the Cluster Manager Linode. Select a datacenter that is geographically close to your premises, to reduce network latency. If left unchanged, the Linode will be created in the Newark data center.

        This value can either be the datacenter's ID or location or abbreviation. To see a list of all datacenters:

            ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf

        <br>

    -  `IMAGE_ROOT_PASSWORD` - **REQUIRED**

        The default root user password for the image. All nodes of any clusters created from this image will have this as the root password, unless it's overridden in a cluster's configuration file.

        <br>

    -  `IMAGE_ROOT_SSH_PUBLIC_KEY` and `IMAGE_ROOT_SSH_PRIVATE_KEY`

        The keypair files for SSH public key authentication as root user. Any user who logs in with this private key can be authenticated as `root`.

        By default, the `cluster_manager.sh` setup has already created a keypair named `clusterroot` and `clusterroot.pub` under `~/.ssh/`. If you wish to replace these with your own keypair, you may create your own keys and set their full paths here.

        <br>

    -  `IMAGE_DISABLE_SSH_PASSWORD_AUTHENTICATION`

        This disables SSH password authentication and allows only key based SSH authentication for the cluster nodes. Password authentication is considered less secure, and is hence disabled by default. To enable password authentication, you can change this value to `no`.

        <br>

    -  `IMAGE_ADMIN_USER`

        Administrators or developers may have to log in to the cluster nodes for maintenance. Instead of logging in as root users, it's better to log in as a privileged non-root user. The script creates a privileged user with this name in the image (and in all cluster nodes based on this image).

        <br>

    -  `IMAGE_ADMIN_PASSWORD` - **REQUIRED**

        Sets the password for the `IMAGE_ADMIN_USER`.

        <br>

    -  `IMAGE_ADMIN_SSH_AUTHORIZED_KEYS`

        A file that contains public keys of all personnel authorized to log in to cluster nodes as `IMAGE_ADMIN_USER`. This file should be in the same format as the standard SSH *authorized_keys* file. All the entries in this file are appended to the image's `authorized_keys` file, and get inherited into all nodes based on this image.

        By default, the `cluster_manager.sh` setup creates a new `clusteradmin` keypair, and this variable is set to the path of the public key. You can either retain this generated keypair and distribute the generated private key file `~/.ssh/clusteradmin` to authorized personnel. Alternatively, you can collect public keys of authorized personnel and append them to `~/.ssh/clusteradmin.pub`.

        <br>

    -  `IMAGE_DISK_SIZE`

        The size of the image disk in MB. The default value of 5000MB is generally sufficient, since the installation only consists of the OS with Java and Zookeeper software installed.

        <br>

    -  `UPGRADE_OS`

        If `yes`, the distribution's packages are updated and upgraded before installing any software. It is recommended to leave the default setting to avoid any installation or dependency issues.

        <br>

    -  `INSTALL_ZOOKEEPER_DISTRIBUTION`

        The Zookeeper version to install. By default, `cluster_manager.sh` has already downloaded version 3.4.6. If you wish to install a different version, download it manually and change this variable. However, it is recommended to leave the default value as this guide has not been tested against other versions.

        <br>

    -  `ZOOKEEPER_INSTALL_DIRECTORY`

        The directory where Zookeeper will be installed on the image (and on all cluster nodes created from this image).

        <br>

    -  `ZOOKEEPER_USER`

        The username under which the Zookeeper daemon runs. This is a security feature to avoid privilege escalation by exploiting some vulnerability in the Zookeeper daemon.

        <br>

    -  `ZOOKEEPER_MAX_HEAP_SIZE`

        The maximum Java heap size for the JVM hosting the Zookeeper daemon. This value can be either a percentage, or a fixed value. If the fixed value is not suffixed with any character, it is interpreted as bytes. If it is suffixed with `K`, `M`, or `G`, it is interpreted as kilobytes, megabytes or gigabytes, respectively.

        If this is too low, it may result in out of memory errors, and cause data losses or delays in the Storm cluster. If it is set too high, the memory for the OS and its processes will be limited, resulting in disk thrashing, which will have a significant negative impact on Zookeeper's performance.

        The default value is 75%, which means at most 75% of the Linode's RAM can be reserved for the JVM, and remaining 25% for the rest of the OS and other processes. It is *strongly* recommended not to change this default setting.

        <br>

    -  `ZOOKEEPER_MIN_HEAP_SIZE`

        The minimum Java heap size to commit for the JVM hosting the Zookeeper daemon. This value can be either a percentage, or a fixed value. If the fixed value is not suffixed with any character, it is interpreted as bytes. If it is suffixed with `K`, `M`, or `G`, it is interpreted as kilobytes, megabytes, or gigabytes, respectively.

        If this value is lower than `ZOOKEEPER_MAX_HEAP_SIZE`, this amount of memory is *committed*, and additional memory up to `ZOOKEEPER_MAX_HEAP_SIZE` is allocated only when the JVM requests it from OS. This can lead to memory allocation delays during operation. So do not set it too low.

        This value should never be more than `ZOOKEEPER_MAX_HEAP_SIZE`. If it is, the Zookeeper daemon will not start.

        The default value is 75%, which means 75% of the Linode's RAM is committed – not just reserved - to the JVM and unavailable to any other process. It is *strongly* recommended not to change this default setting.

    When you've finished making changes, save and close the editor.

4.  Create the image using `create-image` command, specifying the name of the newly created image and the API environment file:

        ./zookeeper-cluster-linode.sh create-image zk-image1 api_env_linode.conf

    If the image is created successfully, the output will look something like this at the end:

        Deleting the temporary linode xxxxxx

        Finished creating Zookeeper template image yyyyyy

    If the process fails, ensure that you do not already have an existing Linode with the same name in the Linode Manager. If you do, delete it and run the command again, or recreate this image with a different name.

    {{< note >}}
During this process, a temporary, short-lived 2GB Linode is created and deleted. This will entail a small cost in your monthly invoice and trigger an event notification email to be sent to the address you have registered with Linode. This is expected behavior.
{{< /note >}}

### Create a Zookeeper Cluster

In this section, you will learn how to create a new Zookeeper cluster in which every node is a replica of an existing Zookeeper image. If you have not already created a Zookeeper image, do so first by following [Create a Zookeeper image](#create-a-zookeeper-image).

{{< note >}}
If a Zookeeper cluster already exists, this step is not mandatory. Multiple Storm clusters can share the same Zookeeper cluster.

When creating a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.
{{< /note >}}

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Choose a unique name for your cluster and create a configuration directory using the `new-cluster-conf` command. In this example, we'll call our new cluster configuration `zk-cluster1`:

        ./zookeeper-cluster-linode.sh new-cluster-conf zk-cluster1

    This creates a directory named `zk-cluster1` that contains the main configuration file, `zk-cluster1.conf`, which will be described in the next step. If you chose a different name when you ran the previous command, your directory and configuration file will be named accordingly.

3.  Open the newly created `zk-cluster1.conf` file and make changes as described below. Properties that must be entered or changed from their default values are marked as **REQUIRED**:

    -  `DATACENTER_FOR_CLUSTER`

        The Linode datacenter where the nodes of this cluster will be created. All nodes of a cluster have to be in the same datacenter; they cannot span multiple datacenters since they will use private network traffic to communicate.

        This can be any Linode datacenter, but cluster creation may be faster if it is created in the same datacenter where the image and Cluster Manager Linode are created. It is recommended to select a datacenter that is geographically close to your premises to reduce network latency.

        This value can either be the datacenter's ID or location or abbreviation. To see a list of all datacenters:

            ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf

        <br>

    -  `CLUSTER_SIZE`

        The types and number of nodes that constitute this cluster. The syntax is:

        `plan:count plan:count ... `

        A `plan` is one of `2GB | 4GB | ... | 120GB` (see [Linode plans](https://linode.com/pricing) for all plans) and `count` is the number of nodes with that plan.

        Examples:

        -  For a cluster with three 4GB nodes:

                CLUSTER_SIZE="4GB:3"

        -  For a cluster with three nodes of different plans:

                CLUSTER_SIZE="2GB:1 4GB:1 8GB:1"

        The total number of nodes in a Zookeeper cluster **must** be an odd number. Although cluster can have nodes of different plans, it's recommended to use the same plan for all nodes. It is recommended to avoid very large clusters. A cluster with 3-9 nodes is sufficient for most use cases. 11-19 nodes would be considered "large". Anything more than 19 nodes would be counterproductive, because at that point, Zookeeper would slow down all the Storm clusters that depend on it.

        Size the cluster carefully, because as of version 3.4.6, Zookeeper does not support dynamic expansion. The only way to resize would be to take it down and create a new cluster, creating downtime for any Storm clusters that depend on it.

        <br>

    -  `ZK_IMAGE_CONF` - **REQUIRED**

        Path of the Zookeeper image directory or configuration file to use as a template for creating nodes of this cluster. Every node's disk will be a replica of this image.

        The path can either be an absolute path, or a path that is relative to the cluster configuration directory. Using our example, the absolute path would be `/home/clustermgr/storm-linode/zk-image1` and the relative path would be `../zk-image1`.

        <br>

    -  `NODE_DISK_SIZE`

        Size of each node's disk in MB. This must be at least as large as the selected image's disk, otherwise the image will not copy properly.

        <br>

    -  `NODE_ROOT_PASSWORD`

        Optionally, you can specify a root password for the nodes. If this is empty, the root password will be the `IMAGE_ROOT_PASSWORD` in the image configuration file.

        <br>

    -  `NODE_ROOT_SSH_PUBLIC_KEY` and `NODE_ROOT_SSH_PRIVATE_KEY`

        Optionally, you can specify a custom SSH public key file and private key file for root user authentication. If this is empty, the keys will be the keys specified in image configuration file.

        If you wish to specify your own keypair, select a descriptive filename for this new keypair (example: *zkcluster1root*), generate them using `ssh-keygen`, and set their full paths here.

        <br>

    -  `PUBLIC_HOST_NAME_PREFIX`

        Every Linode in the cluster has a *public IP address*, which can be reached from anywhere on the Internet, and a *private IP address*, which can be reached only from other nodes of the same user inside the same datacenter.

        Accordingly, every node is given a *public hostname* that resolves to its public IP address. Each node's public hostname will use this value followed by a number (for example, `public-host1`, `public-host2`, etc.) If the cluster manager node is in a different Linode datacenter from the cluster nodes, it uses the public hostnames and public IP addresses to communicate with cluster nodes.

        <br>

    -  `PRIVATE_HOST_NAME_PREFIX`

        Every Linode in the cluster is given a *private hostname* that resolves to its private IP address. Each node's private hostname will use this value followed by a number (for example, private-host1, private-host2, etc.). All the nodes of a cluster communicate with one another through their private hostnames. This is also the actual hostname set for the node using the host's `hostname` command and saved in `/etc/hostname`.

        <br>

    -  `CLUSTER_MANAGER_USES_PUBLIC_IP`

        Set this value to `false` if the cluster manager node is located in the *same* Linode datacenter as the cluster nodes. This is the recommended value. Change to `true` **only** if the cluster manager node is located in a *different* Linode datacenter from the cluster nodes.

        {{< caution >}}
It's important to set this correctly to avoid critical cluster creation failures.
{{< /caution >}}

        <br>

    -  `ZOOKEEPER_LEADER_CONNECTION_PORT`

        The port used by a Zookeeper node to connect its followers to the leader. When a new leader is elected, each follower opens a TCP connection to the leader at this port. There's no need to change this unless you plan to customize the firewall.

        <br>

    -  `ZOOKEEPER_LEADER_ELECTION_PORT`

        The port used for Zookeeper leader election during quorum. There's no need to change this, unless you plan to customize the firewall.

        <br>

    -  `IPTABLES_V4_RULES_TEMPLATE`

        Absolute or relative path of the IPv4 iptables firewall rules file. Modify this if you plan to customize the firewall configuration.

        <br>


    -  `IPTABLES_V6_RULES_TEMPLATE`

        Absolute or relative path of the IPv6 iptables firewall rules file. IPv6 is completely disabled on all nodes, and no services listen on IPv6 addresses. Modify this if you plan to customize the firewall configuration.

    When you've finished making changes, save and close the editor.

4.  Create the cluster using the `create` command:

        ./zookeeper-cluster-linode.sh create zk-cluster1 api_env_linode.conf

    If the cluster is created successfully, a success message is printed:

        Zookeeper cluster successfully created

    Details of the created cluster can be viewed using the `describe` command:

        ./zookeeper-cluster-linode.sh describe zk-cluster1

    Cluster nodes are shut down soon after creation. They are started only when any of the Storm clusters starts.

### Create a Storm Image

A *Storm image* is a master disk with all necessary Storm software and libraries downloaded and installed. The benefits of creating a Storm image include:

-  Quick creation of a Storm cluster by simply cloning it to create as many nodes as required, each a perfect copy of the image
-  Distribution packages and third party software packages are identical on all nodes, and prevent version mismatch errors
-  Reduced network usage, because downloads and updates are executed only once when preparing the image, instead of repeating them on each node

{{< note >}}
If a Storm image already exists, this step is not mandatory. Multiple Storm clusters can share the same Zookeeper image. In fact, it's a good idea to keep the number of images low because image storage is limited to 10GB.

When creating an image, you should have `clustermgr` authorization to the Cluster Manager Linode.
{{< /note >}}

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Choose a unique name for your image and create a configuration directory for the new image using `new-image-conf` command. In this example, we'll call our new image `storm-image1`:

        ./storm-cluster-linode.sh new-image-conf storm-image1

    This creates a directory named `storm-image1` containing the files that make up the image configuration:

    -  **storm-image1.conf** - This is the main image configuration file, and the one you'll be modifying the most. Its properties are described in later steps.

    The other files are secondary configuration files. They contain reasonable default values, but you can always open them in an editor and modify them to suit your needs:

    -  **template-storm.yaml** - The Storm configuration file. See the official [Storm Configuration](http://storm.apache.org/documentation/Configuration.html) documentation for details on what parameters can be customized.

    -  **template-storm-supervisord.conf** - The Storm daemon is run under supervision so that if it shuts down unexpectedly, it's automatically restarted by Supervisord. There is nothing much to customize here, but review the [Supervisord Configuration documentation](http://supervisord.org/configuration.html) if you do want to customize it.

3.  Open the image configuration file (in this example, `~/storm-linode/storm-image1/storm-image1.conf`) in a text editor. Enter or edit the values of configuration properties as required. Properties that must be entered or changed from their default values are marked as **REQUIRED**:

    -  `DISTRIBUTION_FOR_IMAGE`

        Specify either Ubuntu 14.04 or Debian 8 to use for this image. This guide has *not* been tested on any other versions or distributions.

        All nodes of all clusters created from this image will have this distribution. The default value is `124` corresponding to Ubuntu 14.04 LTS 64-bit. For Debian 8 64-bit, change this value to `140`.

        {{< note >}}
The values represented in this guide are current as of publication, but are subject to change in the future. You can run `~/storm-linode/linode_api.py distributions` to see a list of all available distributions and their values in the API.
{{< /note >}}

        <br>

    -  `LABEL_FOR_IMAGE`

        A label to help you differentiate this image from others. This name will be shown if you edit or view your images in the Linode Manager.

        <br>

    -  `KERNEL_FOR_IMAGE`

        The kernel version provided by Linode to use in this image. The default value is `138` corresponding to the latest 64-bit kernel provided by Linode. It is recommended that you leave this as the default setting.

        <br>

    -  `DATACENTER_FOR_IMAGE`

        The Linode datacenter where this image will be created. This can be any Linode datacenter, but cluster creation is faster if the image is created in the same datacenter where the cluster will be created. It's also recommended to create the image in the same datacenter as the Cluster Manager Linode. Select a datacenter that is geographically close to you to reduce network latency.

        This value can either be the datacenter's ID or location or abbreviation. To see a list of all datacenters:

            ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf

        <br>

    -  `IMAGE_ROOT_PASSWORD` - **REQUIRED**

        The default root user password for the image. All nodes of any clusters created from this image will have this as the root password, unless it's overridden in a cluster's configuration file.

        <br>

    -  `IMAGE_ROOT_SSH_PUBLIC_KEY` and `IMAGE_ROOT_SSH_PRIVATE_KEY`

        The keypair files for SSH public key authentication as root user. Any user who logs in with this private key can be authenticated as root.

        By default, the `cluster_manager.sh` setup has already created a keypair named `clusterroot` and `clusterroot.pub` under `~/.ssh/`. If you wish to replace them with your own keypair, you may create your own keys and set their full paths here.

        <br>

    -  `IMAGE_DISABLE_SSH_PASSWORD_AUTHENTICATION`

        This disables SSH password authentication and allows only key based SSH authentication for the cluster nodes. Password authentication is considered less secure, and is hence disabled by default. To enable password authentication, you can change this value to `no`.

        <br>

    -  `IMAGE_ADMIN_USER`

        Administrators or developers may have to log in to the cluster nodes for maintenance. Instead of logging in as root users, it's better to log in as a privileged non-root user. The script creates a privileged user with this name in the image (and in all cluster nodes based on this image).

        <br>

    -   `IMAGE_ADMIN_PASSWORD` - **REQUIRED**

        Sets the password for the `IMAGE_ADMIN_USER`.

        <br>

    -  `IMAGE_ADMIN_SSH_AUTHORIZED_KEYS`

        A file that contains public keys of all personnel authorized to log in to cluster nodes as `IMAGE_ADMIN_USER`. This file should be in the same format as the standard SSH *authorized_keys* file. All the entries in this file are appended to the image's `authorized_keys` file, and get inherited into all nodes based on this image.

        By default, the `cluster_manager.sh` setup creates a new `clusteradmin` keypair, and this variable is set to the path of the public key. You can either retain this generated keypair and distribute the generated private key file `~/.ssh/clusteradmin` to authorized personnel. Alternatively, you can collect public keys of authorized personnel and append them to `~/.ssh/clusteradmin.pub`.

        <br>

    -  `IMAGE_DISK_SIZE`

        The size of the image disk in MB. The default value of 5000MB is generally sufficient, since the installation only consists of the OS with Java and Storm software installed.

        <br>

    -  `UPGRADE_OS`

        If `yes`, the distribution's packages are updated and upgraded before installing any software. It is recommended to leave the default setting to avoid any installation or dependency issues.

        <br>

    -  `INSTALL_STORM_DISTRIBUTION`

        The Storm version to install. By default, the `cluster_manager.sh` setup has already downloaded version 0.9.5. If you wish to install a different version, download it manually and change this variable. However, it is recommended to leave the default value as this guide has not been tested against other versions.

        <br>

    -  `STORM_INSTALL_DIRECTORY`

        The directory where Storm will be installed on the image (and on all cluster nodes created from this image).

        <br>

    -  `STORM_YAML_TEMPLATE`

        The path of the template `storm.yaml` configuration file to install in the image. By default, it points to the `template-storm.yaml` file under the image directory. Administrators can either customize this YAML file before creating the image, or set this variable to point to another `storm.yaml` of their choice.

        <br>

    -  `STORM_USER`

        The username under which the Storm daemon runs. This is a security feature to avoid privilege escalation by exploiting some vulnerability in the Storm daemon.

        <br>

    -  `SUPERVISORD_TEMPLATE_CONF`

        The path of the template supervisor configuration file to install in the image. By default, it points to the `template-storm-supervisord.conf` file in the Storm image directory. Administrators can modify this file before creating the image, or set this variable to point to any other `storm-supervisord.conf` file of their choice.

    Once you've made changes, save and close the editor.

4.  Create the image using the `create-image` command, specifying the name of the newly created image and the API environment file:

        ./storm-cluster-linode.sh create-image storm-image1 api_env_linode.conf

    If the image is created successfully, the output will look something like this towards the end:

        ....
        Deleting the temporary linode xxxxxx

        Finished creating Storm template image yyyyyy

    If the process fails, ensure that you do not already have an existing Storm image with the same name in the Linode Manager. If you do, delete it and run the command again, or recreate this image with a different name.

    {{< note >}}
During this process, a short-lived 2GB linode is created and deleted. This will entail a small cost in the monthly invoice and trigger an event notification email to be sent to the address you have registered with Linode. This is expected behavior.
{{< /note >}}

### Create a Storm Cluster

In this section, you will learn how to create a new Storm cluster in which every node is a replica of an existing Storm image. If you have not created any Storm images, do so first by following [Create a Storm image](#create-a-storm-image).

{{< note >}}
When creating a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.
{{< /note >}}

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Choose a unique name for your cluster and create a configuration directory using the `new-cluster-conf` command. In this example, we'll call our new cluster configuration `storm-cluster1`:

        ./storm-cluster-linode.sh new-cluster-conf storm-cluster1

    This creates a directory named `storm-cluster1` that contains the main configuration file, `storm-cluster1.conf`, which will be described in the next step. If you chose a different name when you ran the previous command, your directory and configuration file will be named accordingly.

3.  Open the newly created `storm-cluster1.conf` file and make changes as described below. Properties that must be entered or changed from their default values are marked as **REQUIRED**:

    -  `DATACENTER_FOR_CLUSTER`

        The Linode datacenter where the nodes of this cluster will be created. All nodes of a cluster have to be in the same datacenter; they cannot span multiple datacenters since they will use private network traffic to communicate.

        This can be any Linode datacenter, but cluster creation may be faster if it is created in the same datacenter where the image and Cluster Manager Linode are created. It is recommended to select a datacenter that is geographically close to your premises to reduce network latency.

        This value can either be the datacenter's ID or location or abbreviation. To see a list of all datacenters:

            ./zookeeper-cluster-linode.sh datacenters api_env_linode.conf

        <br>

    -  `NIMBUS_NODE`

        This specifies the Linode plan to use for the Nimbus node, which is responsible for distributing and coordinating a Storm topology to supervisor nodes.

        It should be one of `2GB | 4GB | ... | 120GB` (see [Linode plans](https://linode.com/pricing) for all plans). The default size is 2GB, but a larger plan is strongly recommended for the Nimbus node.

        <br>

    -  `SUPERVISOR_NODES`

        Supervisor nodes are the workhorses that execute the spouts and bolts that make up a Storm topology.

        The size and number of supervisor nodes should be decided based on how many topologies the cluster should run concurrently, and the computational complexities of their spouts and bolts. The syntax is:

        `plan:count plan:count ... `

        A `plan` is one of `2GB | 4GB| ....| 120GB` (see [Linode plans](https://linode.com/pricing) for all plans) and `count` is the number of supervisor nodes with that plan. Although a cluster can have supervisor nodes of different sizes, it's recommended to use the same plan for all nodes.

        The number of supervisor nodes can be increased later using the `add-nodes` command (see [Expand Cluster](#expand-a-storm-cluster)).

        Examples:

        -  Create three 4GB nodes:

               SUPERVISOR_NODES="4GB:3"

        -  Create six nodes with three different plans:

               SUPERVISOR_NODES="2GB:2 4GB:2 8GB:2"

        <br>

    -  `CLIENT_NODE`

        The client node of a cluster is used to submit topologies to it and monitor it. This should be one of `2GB | 4GB | ... | 120GB` (see [Linode plans](https://linode.com/pricing) for all plans). The default value of 2GB is sufficient for most use cases.

        <br>

    -  `STORM_IMAGE_CONF` - **REQUIRED**

        Path of the Storm image directory or configuration file to use as a template for creating nodes of this cluster. Every node's disk will be a replica of this image.

        The path can either be an absolute path, or a path that is relative to this cluster configuration directory. Using our example, the absolute path would be `/home/clustermgr/storm-linode/storm-image1` and the relative path would be `../storm-image1`.

        <br>

    -  `NODE_DISK_SIZE`

        Size of each node's disk in MB. This must be at least as large as the selected image's disk, otherwise the image will not copy properly.

        <br>

    -  `NODE_ROOT_PASSWORD`

        Optionally, you can specify a root password for the nodes. If this is empty, the root password will be the `IMAGE_ROOT_PASSWORD` in the image configuration file.

        <br>

    -  `NODE_ROOT_SSH_PUBLIC_KEY` and `NODE_ROOT_SSH_PRIVATE_KEY`

        Optionally, you can specify a custom SSH public key file and private key file for root user authentication. If this is empty, the keys will be the keys specified in image configuration file.

        If you wish to specify your own keypair, select a descriptive filename for this new keypair (example: *zkcluster1root*), generate them using `ssh-keygen`, and set their full paths here.

        <br>

    -  `NIMBUS_NODE_PUBLIC_HOSTNAME`, `SUPERVISOR_NODES_PUBLIC_HOSTNAME_PREFIX` and  `CLIENT_NODES_PUBLIC_HOSTNAME_PREFIX`

        Every Linode in the cluster has a *public IP address*, which can be reached from anywhere on the Internet, and a *private IP address*, which can be reached only from other nodes of the same user inside the same datacenter.

        Accordingly, every node is given a *public hostname* that resolves to its public IP address. Each node's public hostname will use this value followed by a number (for example, `public-host1`, `public-host2`, etc.) If the cluster manager node is in a different Linode datacenter from the cluster nodes, it uses the public hostnames and public IP addresses to communicate with cluster nodes.

        <br>

    -  `NIMBUS_NODE_PRIVATE_HOSTNAME`, `SUPERVISOR_NODES_PRIVATE_HOSTNAME_PREFIX` and  `CLIENT_NODES_PRIVATE_HOSTNAME_PREFIX`

        Every Linode in the cluster is given a *private hostname* that resolves to its private IP address. Each node's private hostname will use this value followed by a number (for example, private-host1, private-host2, etc.). All the nodes of a cluster communicate with one another through their private hostnames. This is also the actual hostname set for the node using the host's `hostname` command and saved in `/etc/hostname`.

        <br>

    -  `CLUSTER_MANAGER_USES_PUBLIC_IP`

        Set this value to `false` if the cluster manager node is located in the *same* Linode datacenter as the cluster nodes. This is the recommended value and is also the default. Change to `true` **only** if the cluster manager node is located in a *different* Linode datacenter from the cluster nodes.

        {{< caution >}}
It's important to set this correctly to avoid critical cluster creation failures.
{{< /caution >}}

        <br>

    -  `ZOOKEEPER_CLUSTER` - **REQUIRED**

        Path of the Zookeeper cluster directory to be used by this Storm cluster.

        This can be either an absolute path or a relative path that is relative to this Storm cluster configuration directory. Using our example, the absolute path would be `/home/clustermgr/storm-linode/zk-cluster1`, and the relative path would be `../zk-cluster1`.

        <br>

    -  `IPTABLES_V4_RULES_TEMPLATE`

        Absolute or relative path of the IPv4 iptables firewall rules file applied to Nimbus and Supervisor nodes. Modify this if you plan to customize their firewall configuration.

        <br>

    -  `IPTABLES_CLIENT_V4_RULES_TEMPLATE`

        Absolute or relative path of the IPv4 iptables firewall rules file applied to Client node. Since the client node hosts a cluster monitoring web server and should be accessible to administrators and developers, its rules are different from those of other nodes. Modify this if you plan to customize its firewall configuration.

        Default: `../template-storm-client-iptables-rules.v4`

        <br>

    -  `IPTABLES_V6_RULES_TEMPLATE`

        Absolute or relative path of the IPv6 iptables firewall rules file followed for all nodes, including client node. IPv6 is completely disabled on all nodes, and no services listen on IPv6 addresses. Modify this if you plan to customize the firewall configuration.

    When you've finished making changes, save and close the editor.

4.  Create the cluster using the `create` command:

        ./storm-cluster-linode.sh create storm-cluster1 api_env_linode.conf

    If the cluster is created successfully, a success message is printed:

        Storm cluster successfully created

    Details of the created cluster can be viewed using the `describe` command:

        ./storm-cluster-linode.sh describe storm-cluster1

    Cluster nodes are shut down soon after creation.

## Start a Storm Cluster

This section will explain how to start a Storm cluster. Doing so will also start any Zookeeper clusters on which it depends, so they do not need to be started separately.

{{< note >}}
When starting a cluster, you should have `clustermgr` authorization to the Cluster Manager Linode.
{{< /note >}}

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Start the Storm cluster using the `start` command. This example uses the `storm-cluster1` naming convention from above, but if you chose a different name you should replace it in the command:

        ./storm-cluster-linode.sh start storm-cluster1 api_env_linode.conf

3.  If cluster is being started for the very first time, see the next section for how to [authorize users to monitor a Storm cluster](#monitor-a-storm-cluster).

## Monitor a Storm Cluster

Every Storm cluster's client node runs a Storm UI web application for monitoring that cluster, but it can be accessed only from whitelisted workstations.

The next two sections explain how to whitelist workstations and monitor a cluster from the web interface.

### Whitelist Workstations to Monitor a Storm Cluster

When performing the steps in this section, you should have `clustermgr` authorization to the Cluster Manager Linode.

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Open the `your-cluster/your-cluster-client-user-whitelist.ipsets` file (using our example from above, `storm-cluster1/storm-cluster1-client-user-whitelist.ipsets`) file in a text editor.

    This file is an [ipsets](http://ipset.netfilter.org/ipset.man.html) list of whitelisted IP addresses. It consists of one master ipset and multiple child ipsets that list whitelisted machines by IP addresses or other attributes such as MAC IDs.

    The master ipset is named *your-cluster-uwls*. By default, it's completely empty, which means nobody is authorized.

    [![Master ipset](/docs/assets/storm-user-whitelist-1-650px.png)](/docs/assets/storm-user-whitelist-1.png "An empty ipset list")

3.  To whitelist an IP address:

    -  Uncomment the line that creates the *your-cluster-ipwl* ipset
    -  Add the IP address under it
    -  Add *your-cluster-ipwl* to the master ipset *your-cluster-uwls*

    These additions are highlighted below:

    [![Whitelist entries](/docs/assets/storm-user-whitelist-2-650px.png)](/docs/assets/storm-user-whitelist-2.png)

    {{< note >}}
Any IP address that is being included in the file should be a *public facing IP* address of the network.
For example, company networks often assign local addresses like 10.x.x.x or 192.x.x.x addresses to employee workstations, which are then NATted to a public IP address while sending requests outside the company network.
Since the cluster client node is in the Linode cloud outside your company network, it will see monitoring requests as arriving from this public IP address. So it's the public IP address that should be whitelisted.
{{< /note >}}

4.  Any number or type of additional ipsets can be created, as long as they are added to the master ipset.

    See the **Set Types** section in the [ipset manual](http://ipset.netfilter.org/ipset.man.html#lbAS) for available types of ipsets. Note that some of the types listed in the manual may not be available on the client node because the ipset version installed on it using Ubuntu or Debian package manager is likely to be an older version.

5.  Enter all required ipsets, save the file, and close the editor.

6.  Activate the new ipsets with the `update-user-whitelist` command:

        ./storm-cluster-linode.sh update-user-whitelist storm-cluster1

7.  Log in to the client node from the Cluster Manager Linode:

        ssh -i ~/.ssh/clusterroot root@storm-cluster1-private-client1

    Verify that the new ipsets have been configured correctly:

        ipset list

    You should see output similar to the following (in addition to custom ipsets if you added them, and the ipsets for the Storm and Zookeeper cluster nodes):

    [![ipset output](/docs/assets/storm-user-whitelist-3.png)](/docs/assets/storm-user-whitelist-3.png)

    Disconnect from the client node and navigate back to the `storm-linode` directory on the cluster manager node:

        exit

8.  From the cluster manager node, get the public IP address of the client node. This IP address should be provided to users authorized to access the Storm UI monitoring web application. To show the IP addresses, use the `describe` command:

        ./storm-cluster-linode.sh describe storm-cluster1

9.  Finally, verify that the Storm UI web application is accessible by opening `http://public-IP-of-client-node` in a web browser on each whitelisted workstation. You should see the Storm UI web application, which looks like this:

    [![Storm UI](/docs/assets/storm-ui-650px.png)](/docs/assets/storm-ui-large.png)

    The Storm UI displays the list of topologies and the list of supervisors executing them:

    [![Storm UI monitoring](/docs/assets/storm-ui-monitor-650px.png)](/docs/assets/storm-ui-monitor.png)

    If the cluster is executing any topologies, they are listed under the **Topology summary** section. Click on a topology to access its statistics, supervisor node logs, or actions such as killing that topology.

## Test a New Storm Cluster

1.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

2.  Get the private IP address of the client node of the target cluster. This is preferred for security and to minimize impact on the data transfer quota, but the public IP address works as well:

        ./storm-cluster-linode.sh describe storm-cluster1

3.  Log in to the client node as its `IMAGE_ADMIN_USER` user (the default is `clusteradmin`, configured in the Storm image configuration file) via SSH using an authorized private key:

        ssh -i ~/.ssh/clusteradmin clusteradmin@192.168.42.13

4.  Run the following commands to start the preinstalled word count example topology:

        cd /opt/apache-storm-0.9.5/bin
        ./storm jar ../examples/storm-starter/storm-starter-topologies-0.9.5.jar storm.starter.WordCountTopology "wordcount"

5.  A successful submission should produce output similar to this:

        Running: java -client -Dstorm.options= -Dstorm.home=/opt/apache-storm-0.9.5 -Dstorm.log.dir=/var/log/storm -Djava.library.path=/usr/local/lib:/opt/local/lib:/usr/lib -Dstorm.conf.file= -cp /opt/apache-storm-0.9.5/lib/disruptor-2.10.1.jar:/opt/apache-storm-0.9.5/lib/minlog-1.2.jar:/opt/apache-storm-0.9.5/lib/commons-io-2.4.jar:/opt/apache-storm-0.9.5/lib/clj-time-0.4.1.jar:/opt/apache-storm-0.9.5/lib/clout-1.0.1.jar:/opt/apache-storm-0.9.5/lib/ring-devel-0.3.11.jar:/opt/apache-storm-0.9.5/lib/tools.macro-0.1.0.jar:/opt/apache-storm-0.9.5/lib/ring-jetty-adapter-0.3.11.jar:/opt/apache-storm-0.9.5/lib/jetty-util-6.1.26.jar:/opt/apache-storm-0.9.5/lib/commons-exec-1.1.jar:/opt/apache-storm-0.9.5/lib/tools.cli-0.2.4.jar:/opt/apache-storm-0.9.5/lib/objenesis-1.2.jar:/opt/apache-storm-0.9.5/lib/jetty-6.1.26.jar:/opt/apache-storm-0.9.5/lib/ring-servlet-0.3.11.jar:/opt/apache-storm-0.9.5/lib/storm-core-0.9.5.jar:/opt/apache-storm-0.9.5/lib/hiccup-0.3.6.jar:/opt/apache-storm-0.9.5/lib/clojure-1.5.1.jar:/opt/apache-storm-0.9.5/lib/commons-codec-1.6.jar:/opt/apache-storm-0.9.5/lib/servlet-api-2.5.jar:/opt/apache-storm-0.9.5/lib/compojure-1.1.3.jar:/opt/apache-storm-0.9.5/lib/json-simple-1.1.jar:/opt/apache-storm-0.9.5/lib/commons-logging-1.1.3.jar:/opt/apache-storm-0.9.5/lib/math.numeric-tower-0.0.1.jar:/opt/apache-storm-0.9.5/lib/asm-4.0.jar:/opt/apache-storm-0.9.5/lib/commons-lang-2.5.jar:/opt/apache-storm-0.9.5/lib/clj-stacktrace-0.2.2.jar:/opt/apache-storm-0.9.5/lib/kryo-2.21.jar:/opt/apache-storm-0.9.5/lib/logback-classic-1.0.13.jar:/opt/apache-storm-0.9.5/lib/slf4j-api-1.7.5.jar:/opt/apache-storm-0.9.5/lib/reflectasm-1.07-shaded.jar:/opt/apache-storm-0.9.5/lib/ring-core-1.1.5.jar:/opt/apache-storm-0.9.5/lib/joda-time-2.0.jar:/opt/apache-storm-0.9.5/lib/logback-core-1.0.13.jar:/opt/apache-storm-0.9.5/lib/snakeyaml-1.11.jar:/opt/apache-storm-0.9.5/lib/carbonite-1.4.0.jar:/opt/apache-storm-0.9.5/lib/tools.logging-0.2.3.jar:/opt/apache-storm-0.9.5/lib/core.incubator-0.1.0.jar:/opt/apache-storm-0.9.5/lib/chill-java-0.3.5.jar:/opt/apache-storm-0.9.5/lib/jgrapht-core-0.9.0.jar:/opt/apache-storm-0.9.5/lib/jline-2.11.jar:/opt/apache-storm-0.9.5/lib/commons-fileupload-1.2.1.jar:/opt/apache-storm-0.9.5/lib/log4j-over-slf4j-1.6.6.jar:../examples/storm-starter/storm-starter-topologies-0.9.5.jar:/opt/apache-storm-0.9.5/conf:/opt/apache-storm-0.9.5/bin -Dstorm.jar=../examples/storm-starter/storm-starter-topologies-0.9.5.jar storm.starter.WordCountTopology wordcount

        1038 [main] INFO  backtype.storm.StormSubmitter - Jar not uploaded to master yet. Submitting jar...
        1061 [main] INFO  backtype.storm.StormSubmitter - Uploading topology jar ../examples/storm-starter/storm-starter-topologies-0.9.5.jar to assigned location: /var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar
        Start uploading file '../examples/storm-starter/storm-starter-topologies-0.9.5.jar' to '/var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar' (3248678 bytes)
        [==================================================] 3248678 / 3248678
        File '../examples/storm-starter/storm-starter-topologies-0.9.5.jar' uploaded to '/var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar' (3248678 bytes)
        1260 [main] INFO  backtype.storm.StormSubmitter - Successfully uploaded topology jar to assigned location: /var/lib/storm/nimbus/inbox/stormjar-3a9e3c47-88c3-44c2-9084-046f31e57668.jar
        1261 [main] INFO  backtype.storm.StormSubmitter - Submitting topology wordcount in distributed mode with conf {"topology.workers":3,"topology.debug":true}
        2076 [main] INFO  backtype.storm.StormSubmitter - Finished submitting topology: wordcount

5.  Verify that the topology is running correctly by opening the Storm UI in a web browser. The "wordcount" topology should be visible in the **Topology Summary** section.

The above instructions will use the sample "wordcount" topology, which doesn't provide a visible output to show the results of the operations it is running. However, this topology simply counts words in generated sentences, so the number under "Emitted" is the actual word count.

For a more practical test, feel free to download another topology, such as the [Reddit Comment Sentiment Analysis Topology](https://github.com/pathbreak/reddit-sentiment-storm), which outputs a basic list of threads within given subreddits, based upon which have the most positive and negative comments over time. If you do choose to download a third party topology, be sure it is from a trustworthy source and that you download it to the correct directory.

## Start a New Topology

If you or a developer have created a topology, perform these steps to start a new topology on one of your Linode Storm clusters:

{{< note >}}
The developer should have `clusteradmin` (or `clusterroot`) authorization to log in to the client node of the target Storm cluster.

Optionally, to get the IP address of client node, the developer should have `clustermgrguest` (or `clustermgrroot`) authorization to log in to the Cluster Manager Linode. If the IP address is known by other methods, this authorization is not required.
{{< /note >}}

1.  Package your topology along with all the third party classes on which they depend into a single JAR (Java Archive) file.

2.  If multiple clusters are deployed, select the target Storm cluster to run the topology on. Get the public IP address of the client node of the target cluster. See [cluster description](#describe-a-storm-cluster) for details on how to do this.

3.  Transfer the topology JAR from your local workstation to client node:

        scp -i ~/.ssh/private-key local-topology-path clusteradmin@public-ip-of-client-node:topology-jar

    Substitute `private-key` for the private key of the Storm client, `local-topology-path` for the local filepath of the JAR file, `PUBLIC-IP-OF-CLIENT-NODE` for the IP address of the Storm client, and `topology-jar` for the filepath you'd like to use to store the topology on the client node.

4.  Log in to the client node as `clusteradmin`, substituting the appropriate values:

        ssh -i ~/.ssh/private-key clusteradmin@PUBLIC-IP-OF-CLIENT-NODE

5.  Submit the topology to the cluster:

        cd /opt/apache-storm-0.9.5/bin
        ./storm jar topology-jar.jar main-class arguments-for-topology

    Substitute `topology-jar.jar` for the path of the JAR file you wish to submit, `main-class` with the main class of the topology, and `arguments-for-topology` for the arguments accepted by the topology's main class.

6.  [Monitor the execution of the new topology.](#monitor-a-storm-cluster)

{{< note >}}
The Storm UI will show only information on the topology's execution, not the actual data it is processing. The data, including its output destination, is handled in the topology's JAR files.
{{< /note >}}

## Other Storm Cluster Operations

In this section, we'll cover additional operations to manage your Storm cluster once it's up and running.

All commands in this section should be performed from the `storm-linode` directory on the cluster manager Linode. You will need `clustermgr` privileges unless otherwise specified.

### Expand a Storm Cluster

If the supervisor nodes of a Storm cluster are overloaded with too many topologies or other CPU-intensive jobs, it may help to add more supervisor nodes to alleviate some of the load.

Expand the cluster using the `add-nodes` command, specifying the plans and counts for the new nodes. For example, to add three new 4GB supervisor nodes to a cluster named `storm-cluster1`:

    ./storm-cluster-linode.sh add-nodes storm-cluster1 api_env_linode.conf "4GB:3"

Or, to add a 2GB and two 4GB supervisor nodes to `storm-cluster1`:

    ./storm-cluster-linode.sh add-nodes storm-cluster1 api_env_linode.conf "2GB:1 4GB:2"

This syntax can be used to add an arbitrary number of different nodes to an existing cluster.

### Describe a Storm Cluster

A user with `clustermgr` authorization can use `describe` command to describe a Storm cluster:

    ./storm-cluster-linode.sh describe storm-cluster1

A user with only `clustermgrguest` authorization can use `cluster_info.sh` to describe a Storm cluster using `list` to get a list of names of all clusters, and the `info` command to describe a given cluster. When using the `info` command, you must also specify the cluster's name:

    ./cluster_info.sh list
    ./cluster_info.sh info storm-cluster1

### Stop a Storm Cluster

Stopping a Storm cluster stops all topologies executing on that cluster, stops Storm daemons on all nodes, and shuts down all nodes. The cluster can be restarted later. Note that the nodes **will** still incur hourly charges even when stopped.

To stop a Storm cluster, use the `stop` command:

    ./storm-cluster-linode.sh stop storm-cluster1 api_env_linode.conf

### Destroy a Storm Cluster

Destroying a Storm cluster permanently deletes all nodes of that cluster *and their data*. They will no longer incur hourly charges.

To destroy a Storm cluster, use the `destroy` command:

    ./storm-cluster-linode.sh destroy storm-cluster1 api_env_linode.conf

### Run a Command on all Nodes of a Storm Cluster

You can run a command (for example, to install a package or download a resource) on all nodes of a Storm cluster. This is also useful when updating and upgrading software or changing file permissions. Be aware that when using this method, the command will be executed as `root` on each node.

To execute a command on all nodes, use the `run` command, specifying the cluster name and the commands to be run. For example, to update your package repositories on all nodes in `storm-cluster1`:

    ./storm-cluster-linode.sh run storm-cluster1 "apt-get update"

### Copy Files to all Nodes of a Storm Cluster

You can copy one or more files from the cluster manager node to all nodes of a Storm cluster. The files will be copied as the `root` user on each node, so keep this in mind when copying files that need specific permissions.

1.  If the files are not already on your cluster manager node, you will first need to copy them from your workstation. Substitute `local-file` for the name or path of the file on your local machine, and `PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE` for the IP address of the cluster manager node. You can also specify a different filepath and substitute it for `~`:

        scp -i ~/.ssh/clustermgr local-files clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE:~

2.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

3.  Execute the `cp` command, specifying the destination directory on each node and the list of local files to copy:

        ./storm-cluster-linode.sh cp target-cluster-name "target-directory" "local-files"

    Remember to specify the target directory _before_ the list of source files (this is the reverse of regular `cp` or `scp` commands).

    For example, if your topology requires data files named "*.data" for processing, you can copy them to `root` user's home directory on all cluster nodes with:

        ./storm-cluster-linode.sh cp storm-cluster1 "~" "~/*.data"

### Delete a Storm Image

To delete a Storm image, use the `delete-image` command:

    ./storm-cluster-linode.sh delete-image storm-image1 api_env_linode.conf

Note that this command will delete the image, but not any clusters that were created from it.

## Zookeeper Cluster Operations

In this section, we'll cover additional operations to manage your Zookeeper cluster once it's up and running.

All commands in this section should be performed from the `storm-linode` directory on the cluster manager Linode. You will need `clustermgr` privileges unless otherwise specified.

### Describe a Zookeeper Cluster

A user with `clustermgr` authorization can use the `describe` command to describe a Zookeeper cluster:

    ./zookeepercluster-linode.sh describe zk-cluster1

A user with only `clustermgrguest` authorization can use `cluster_info.sh` to describe a Zookeeper cluster using `list` to get a list of names of all clusters, and the `info` command to describe a given cluster. When using the `info` command, you must specify the cluster's name:

    ./cluster_info.sh list
    ./cluster_info.sh info zk-cluster1

### Stop a Zookeeper Cluster

Stopping a Zookeeper cluster cleanly stops the Zookeeper daemon on all nodes, and shuts down all nodes. The cluster can be restarted later. Note that the nodes **will** still incur Linode's hourly charges when stopped.

{{< caution >}}
Do not stop a Zookeeper cluster while any Storm clusters that depend on it are running. This may result in data loss.
{{< /caution >}}

To stop a cluster, use the `stop` command:

    ./zookeeper-cluster-linode.sh stop zk-cluster1 api_env_linode.conf

### Destroy a Zookeeper Cluster

Destroying a Zookeeper cluster permanently deletes all nodes of that cluster and their data. Unlike a Linode that is only shut down, destroyed or deleted Linodes no longer incur hourly charges.

{{< caution >}}
Do not destroy a Zookeeper cluster while any Storm clusters that depend on it are running. It may result in data loss.
{{< /caution >}}

To destroy a cluster, use the `destroy` command:

    ./zookeeper-cluster-linode.sh destroy zk-cluster1 api_env_linode.conf

### Run a Command on all Nodes of a Zookeeper Cluster

You can run a command on all nodes of a Zookeeper cluster at once. This can be useful when updating and upgrading software, downloading resources, or changing permissions on new files. Be aware that when using this method, the command will be executed as `root` on each node.

To execute a command on all nodes, use the `run` command, specifying the cluster name and the commands to be run. For example, to update your package repositories on all nodes:

    ./zookeeper-cluster-linode.sh run zk-cluster1 "apt-get update"

### Copy Files to all Nodes of a Zookeeper Cluster

You can copy one or more files from the cluster manager node to all nodes of a Storm cluster. The files will be copied as the `root` user on each node, so keep this in mind when copying files that need specific permissions.

1.  If the files are not already on your cluster manager node, you will first need to copy them from your workstation. Substitute `local-file` for the name or path of the file on your local machine, and `cluster-manager-IP` for the IP address of the cluster manager node. You can also specify a different filepath and substitute it for `~`:

        scp -i ~/.ssh/clustermgr local-files clustermgr@cluster-manager-IP:~

2.  Log in to the Cluster Manager Linode as `clustermgr` and navigate to the `storm-linode` directory:

        ssh -i ~/.ssh/clustermgr clustermgr@PUBLIC-IP-OF-CLUSTER-MANAGER-LINODE
        cd storm-linode

3.  Execute the `cp` command, specifying the destination directory on each node and the list of local files to copy:

        ./zookeeper-cluster-linode.sh cp target-cluster-name "target-directory" "local-files"

    Remember to specify the target directory _before_ the list of source files (this is the reverse of regular `cp` or `scp` commands).

    For example, if your cluster requires data files named "*.data" for processing, you can copy them to `root` user's home directory on all cluster nodes with:

        ./zookeeper-cluster-linode.sh cp zk-cluster1 "~" "~/*.data"

### Delete a Zookeeper Image

To delete a Zookeeper image, execute the `delete-image` command:

    ./zookeeper-cluster-linode.sh delete-image zk-image1 api_env_linode.conf

Note that this command will delete the image, but not any clusters that were created from it.
