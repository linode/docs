---
author:
  name: Phil Zona
  email: docs@linode.com
description: 'How to configure a highly available web server stack'
keywords: ["high availability", "web server", "failover", " "]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2016-07-12
modified: 2017-06-07
modified_by:
  name: Angel Guarisma
title: 'Host a Website with High Availability'
external_resources:
- '[GlusterFS](https://www.gluster.org/)'
- '[Galera Cluster](https://galeracluster.com/)'
- '[Apache Web Server](https://httpd.apache.org/)'
- '[Keepalived](http://www.keepalived.org/)'
- '[XtraBackup](https://www.percona.com/doc/percona-xtrabackup/2.4/index.html)'
---

When deploying a website or application, one of the most important elements to consider is availability, or the period of time for which your content is accessible to users. High availability is a term used to describe server setups that eliminate single points of failure by offering redundancy, monitoring, and failover. This ensures that even if one component of your web stack goes down, the content will still be accessible.

In this guide, we'll explain how to host a highly available website with Wordpress. However, you can use this setup to serve other types of content as well. This guide is intended to be a tutorial on the setup of such a system. For more information on how each element in the high availability stack functions, refer to our [introduction to high availability](/docs/websites/introduction-to-high-availability).

## Before You Begin

1.  We will be using a total of nine nodes, or servers, all running CentOS 7, and all within the same datacenter. You can create them all in the beginning, or as you follow along. Either way, familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting the hostname and timezone for each Linode you create.

2.  You should also be familiar with our [Securing Your Server](/docs/security/securing-your-server) guide, and follow best security practices as you create your servers. Do not create firewall rules yet, as we'll be handling that step in our guide.

3.  The Linodes we will create during this guide will use the following hostname conventions:

    *   File system nodes - `gluster1`, `gluster2`, `gluster3`
    *   Database nodes - `galera1`, `galera2`, `galera3`
    *   Application nodes - `app1`, `app2`, `app3`

    You can call your nodes anything you like, but try to keep the naming consistent for organizational purposes. When you see one of the above names, be sure to substitute the hostname you configured for the corresponding node.

4.  To create a private network among your Linodes, you'll need a [private IP address](/docs/networking/remote-access#adding-private-ip-addresses) for each.

5.  Remember to update each Linode's package repositories before attempting to install software:

        yum update

{{< note >}}
Most steps in this guide require root privileges. Be sure you're entering the commands as root, or using `sudo` if you're using a limited user account. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## GlusterFS

Our first step in creating a high-availability setup is to install and configure a file system using GlusterFS. In this section, we'll be using three 2GB Linodes named `gluster1`, `gluster2`, and `gluster3`.

Edit the `/etc/hosts` file on each Linode to match the following, substituting your own private IP addresses, fully qualified domain names, and host names:

{{< file-excerpt "/etc/hosts" >}}
192.168.1.2    gluster1.yourdomain.com    gluster1
192.168.3.4    gluster2.yourdomain.com    gluster2
192.168.5.6    gluster3.yourdomain.com    gluster3

{{< /file-excerpt >}}


### Install GlusterFS

These steps should be run on each file system node in your cluster.

{{< caution >}}
GlusterFS generates a UUID upon installation. Do not clone a single Linode to replicate your GlusterFS installation; it must be installed separately on each node.
{{< /caution >}}

1.  Add the `centos-release-gluster37` repository, which will allow you to install the GlusterFS server edition package:

        yum install epel-release
        yum install centos-release-gluster37
        yum install glusterfs-server

    {{< note >}}
When installing `glusterfs-server`, you may be prompted to verify a GPG key from the CentOS Storage SIG repository. Before running the third command, you can manually import the GPG key:

rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage
{{< /note >}}

2.  Start the GlusterFS daemon:

        systemctl start glusterd

### Configure GlusterFS

1.  Create a *trusted storage pool*. A storage pool is a trusted network of file servers that will communicate to share data. You only need to run this command on one of your nodes. We'll use `gluster1` in this example, probing each of the other nodes we want to add to our storage pool:

        gluster peer probe gluster2
        gluster peer probe gluster3

2.  On each Linode, create a directory to store the files to be replicated. We'll use `/data/example-volume`, but you can create this directory wherever you like, and with a name of your choosing:

        mkdir -p /data/example-volume

3. Create a distributed replicated volume. This step needs to be done on only one of the nodes in your pool. In this example, we're using the hostname and volume name configuration we used above, so replace those names with the ones you chose:

        gluster volume create example-volume replica 3 gluster1:/data/example-volume gluster2:/data/example-volume gluster3:/data/example-volume force

4.  Start the volume to enable replication among servers in your pool. Replace `example-volume` with the name you chose:

        gluster volume start example-volume

    You can check the configuration by running `gluster volume info`. If everything is working correctly, the output should resemble the following. Check that each brick is listed here:

        Volume Name: example-volume
        Type: Replicate
        Volume ID: 1b5ce8e2-2e1e-4207-b8c9-b704ef8a6ebc
        Status: Started
        Number of Bricks: 1 x 3 = 3
        Transport-type: tcp
        Bricks:
        Brick1: gluster1:/data/example-volume
        Brick2: gluster2:/data/example-volume
        Brick3: gluster3:/data/example-volume
        Options Reconfigured:
        performance.readdir-ahead: on

### Add Firewall Rules

Run the following commands on each Linode in your pool.

1.  Start `firewalld`:

        systemctl start firewalld

2.  Add firewall rules that allow GlusterFS service to communicate between your trusted servers. Replace the IP addresses below with the private IP addresses of your hosts:

        firewall-cmd --zone=internal --add-service=glusterfs --permanent
        firewall-cmd --zone=internal --add-source=192.168.1.2/32 --permanent
        firewall-cmd --zone=internal --add-source=192.168.3.4/32 --permanent
        firewall-cmd --zone=internal --add-source=192.168.5.6/32 --permanent

    {{< note >}}
In the Linode Manger, you may notice that the netmask for your private IP addresses is /17. Firewalld does not recognize this, so a /32 prefix should be used instead.
{{< /note >}}

3.  Reload your firewall configuration:

        firewall-cmd --reload

4.  Enable the `firewalld` and `glusterd` services to have them start automatically upon booting:

        systemctl enable firewalld glusterd

### Test Replication

This section will explain how to test file replication between servers in your pool. Testing in this manner should not be done in a live production environment.

1.  Mount the volume on one of your hosts. In this example, we'll use `gluster1`, but you can use any file system node:

        mount -t glusterfs gluster1:/example-volume /mnt

2.  Create an empty file called `test` within `/mnt`, where we mounted the volume. Do **not** write directly to `/data/example-volume` or its subdirectories.

        touch /mnt/test

3.  From your other file system nodes, check the contents of your volume:

        ls /data/example-volume

    If replication is working properly, the `test` file you created on the mounted volume should now show up on your other hosts.

4.  Remember to delete the test file from `/mnt` (on the same host used to create it) and unmount the volume before using GlusterFS in production:

        rm /mnt/test
        umount /mnt

## Galera with XtraDB

Now that we have a replicated file system, we can begin to set up our database cluster. In this section, we'll be using a cluster of Percona XtraDB database servers with Galera replication.

We'll use three 2GB Linodes with hostnames `galera1`, `galera2`, and `galera3` as our database nodes. Create these now if you have not already, and edit the `/etc/hosts` file on each to add the following, replacing the private IP addresses, fully qualified domain names, and hostnames of your database nodes:

{{< file-excerpt "/etc/hosts" >}}
192.168.1.2    galera1.yourdomain.com    galera1
192.168.3.4    galera2.yourdomain.com    galera2
192.168.5.6    galera3.yourdomain.com    galera3

{{< /file-excerpt >}}


{{< note >}}
You will need an additional private IP address for one of your database nodes, as we'll be using it as a *floating IP* for failover in a later section. To request an additional private IP address, you'll need to [contact support](/docs/platform/support/).
{{< /note >}}

### Install Galera and XtraDB

1.  Remove the `mysql-libs` package from each node:

        yum remove mysql-libs

2.  Install the following packages on each database node:

        yum install epel-release
        yum install https://www.percona.com/redir/downloads/percona-release/redhat/0.1-4/percona-release-0.1-4.noarch.rpm
        yum install Percona-XtraDB-Cluster-56 Percona-XtraDB-Cluster-shared-56

    {{< note >}}
When installing `Percona-XtraDB-Cluster-56` and `Percona-XtraDB-Cluster-shared-56`, you will be prompted to verify a GPG key from the Percona repository. Before running the third command, you can manually import the GPG key:

rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-CentOS-SIG-Storage
{{< /note >}}

### Configure Your Galera Cluster

We will configure the cluster to use XtraBackup for *state snapshot transfer* (SST), which is a more efficient way of syncing data between database nodes than other alternatives like `rsync` or `mysqldump`.

1.  Make the following changes to `/etc/my.cnf` on each of your database nodes:

    {{< file-excerpt "/etc/my.cnf" aconf >}}
[mysqld]
bind_address                   = 0.0.0.0

...

wsrep_cluster_address          = gcomm://galera1,galera2,galera3 #use your hostnames here
wsrep_provider                 = /usr/lib64/galera3/libgalera_smm.so
wsrep_slave_threads            = 8
wsrep_cluster_name             = Cluster
wsrep_node_name                = galera1

...

wsrep_node_address             = 192.168.x.x

...

wsrep_sst_method               = xtrabackup-v2
wsrep_sst_auth                 = sstuser:password

{{< /file-excerpt >}}


    The values for `wsrep_node_name` and `wsrep_node_address` should be configured individually for each node, using the private IP address for that node and its hostname. The rest of the lines should match on all your database nodes.

    In the line beginning with `wsrep_sst_auth`, replace `password` with a secure password of your choosing and keep it in a safe place. It will be needed later.

    {{< note >}}
The `xtrabackup-v2` service accesses the database as `sstuser`, authenticating using `password` to log into MySQL to grab backup locks for replication.
{{< /note >}}

2.  On your first database node, start MySQL as the primary component in your cluster. This process is known as *bootstrapping*; this tells the database node to start as the primary component that the other nodes in the cluster will use as a reference point when they join the cluster and sync their data:

        systemctl start mysql@bootstrap

    This command should be run only when bringing up a cluster for the first time, *not* for reconnecting nodes to an existing cluster.

3.  On the first node, enter your MySQL shell:

        mysql

    Create a database user and enable replication. Replace `password` with the password you set in Step 1:

        CREATE USER 'sstuser'@'localhost' IDENTIFIED BY 'password';
        GRANT RELOAD, LOCK TABLES, PROCESS, REPLICATION CLIENT ON *.* TO 'sstuser'@'localhost';
        FLUSH PRIVILEGES;

4.  On your other nodes, start MySQL normally to have them join the cluster:

        systemctl start mysql

   {{< note >}}
If you want to learn more about `xtrabackup` privileges their [documentation](https://www.percona.com/doc/percona-xtrabackup/2.4/using_xtrabackup/privileges.html) is a good place to start.
{{< /note >}}

### Test Database Replication

Now that your database nodes are configured, we can test to make sure they've all joined the cluster and are replicating properly.

1.  Enter the MySQL shell on any database node, using the `mysql` command. Run the following command in MySQL to check the status of your cluster:

        SHOW STATUS LIKE 'wsrep_cluster%';

    If your cluster has been configured properly, your output should resemble the following, showing the expected value of `3` for `wsrep_cluster_size`, and `wsrep_cluster_status` should show `Primary`:

        +--------------------------+--------------------------------------+
        | Variable_name            | Value                                |
        +--------------------------+--------------------------------------+
        | wsrep_cluster_conf_id    | 3                                    |
        | wsrep_cluster_size       | 3                                    |
        | wsrep_cluster_state_uuid | a3dab288-3275-11e6-a26f-42e24e1d7125 |
        | wsrep_cluster_status     | Primary                              |
        +--------------------------+--------------------------------------+
        4 rows in set (0.00 sec)

    {{< note >}}
If you add or remove nodes to and from the cluster in the future, you may notice the value for `wsrep_cluster_conf_id` increases each time. This value is the number of changes the cluster's configuration has gone through, and does not directly affect functionality. The above value of `3` is only an example.
{{< /note >}}

2.  Create a test database:

        CREATE DATABASE testdb;

3.  On a different database node, enter the `mysql` cli and check whether you can see the database you created:

        SHOW DATABASES;

    This should output a table that includes the `testdb` database, confirming that the databases are synchronized:

        +--------------------+
        | Database           |
        +--------------------+
        | information_schema |
        | mysql              |
        | performance_schema |
        | test               |
        | testdb             |
        +--------------------+
        4 rows in set (0.00 sec)

    You can run the same command on any other database nodes to check that replication is occurring across the entire cluster.

4.  Exit the MySQL CLI on all nodes:

        quit

### Secure MySQL

For greater security, run the MySQL secure installation from **one** of your nodes:

    mysql_secure_installation

This will display a series of prompts that will allow you to set your MySQL root user password, remove anonymous users, disable remote root login, remove a default test database, and reload privileges. Additional details on each item will be provided in the prompts. After reading each prompt, it is recommended that you answer *yes* to all of the questions for a secure installation.

### Add Firewall Rules

Run the following commands on each database node.

1.  Create and edit `/etc/firewalld/services/galera.xml` to match the following:

    {{< file "/etc/firewalld/services/galera.xml" >}}
<?xml version="1.0" encoding="utf-8"?>
<service>
  <short>Galera Replication</short>
  <description>Galera Master-Master Replication and State Transfer</description>
  <port protocol="tcp" port="4567"/>
  <port protocol="tcp" port="4568"/>
  <port protocol="tcp" port="4444"/>
</service>

{{< /file >}}


2.  Start `firewalld`:

        systemctl start firewalld

3.  Add firewall rules that allow Galera and MySQL service to communicate between your trusted servers. Replace the IP addresses below with the private IP addresses of your database nodes:

        firewall-cmd --zone=internal --add-service=mysql --permanent
        firewall-cmd --zone=internal --add-service=galera --permanent
        firewall-cmd --zone=internal --add-source=192.168.1.2/32 --permanent
        firewall-cmd --zone=internal --add-source=192.168.3.4/32 --permanent
        firewall-cmd --zone=internal --add-source=192.168.5.6/32 --permanent

    {{< note >}}
In the Linode Manger, you may notice that the netmask for your private IP addresses is /17. Firewalld does not recognize this, so a /32 prefix should be used instead.
{{< /note >}}

4.  Reload your firewall configuration and enable the `firewalld` service to start automatically on boot:

        firewall-cmd --reload
        systemctl enable firewalld

## Apache Servers

With file system and database clusters set up, you'll now need web servers to deliver your sites or applications. For our application nodes, we'll use three 2GB Linodes with the hostnames `app1`, `app2`, and `app3`.

Before you start, edit the `/etc/hosts` file on each application node to include the private IP address and hostname for each application node and for the file system nodes we set up previously:

{{< file-excerpt "/etc/hosts" aconf >}}
192.168.0.1    app1.yourdomain.com        app1
192.168.2.3    app2.yourdomain.com        app2
192.168.4.5    app3.yourdomain.com        app3

192.168.1.2    gluster1.yourdomain.com    gluster1
192.168.3.4    gluster2.yourdomain.com    gluster2
192.168.5.6    gluster3.yourdomain.com    gluster3

{{< /file-excerpt >}}


### Install Apache

Install the Apache HTTPD web server package on each of your three application nodes:

    yum install httpd

At this point, you may also tune your Apache instances to optimize performance based on your site or application's needs. This step is optional, however, and is beyond the scope of this guide. Check [Tuning Your Apache Server](/docs/websites/apache-tips-and-tricks/tuning-your-apache-server) for more information.

### Add Firewall Rules

Run the following commands to start your firewall, enable it on boot, and configure firewall rules to allow web traffic on port 80. To enable HTTPS traffic, run the third command again, substituting `https` for `http`, before reloading the rules:

    systemctl start firewalld
    systemctl enable firewalld
    firewall-cmd --permanent --add-service=http
    firewall-cmd --reload

### Allow Private Traffic to GlusterFS Nodes

To allow our application servers to communicate with the networked file system, we'll need to add firewall rules to the file system nodes. On each of your GlusterFS nodes, enter the following commands, substituting the private IP address of each application node:

    firewall-cmd --zone=internal --add-source=192.168.0.1/32 --permanent
    firewall-cmd --zone=internal --add-source=192.168.2.3/32 --permanent
    firewall-cmd --zone=internal --add-source=192.168.4.5/32 --permanent

After these rules have been set, reload the firewall rules on each file system node:

    firewall-cmd --reload

### Mount the Gluster Filesystem

Next, we'll mount the Gluster volume on our application servers. The steps in this section should be performed on each Apache server node.

1.  Install `glusterfs-fuse`:

        yum install glusterfs-fuse

2.  Add the following line to `/etc/fstab`, substituting your own GlusterFS hostnames for `gluster1`, `gluster2` and `gluster3`, and your volume name for `example-volume` if appropriate:

    {{< file-excerpt "/etc/fstab" aconf >}}
gluster1:/example-volume  /srv/www  glusterfs defaults,_netdev,backup-volfile-servers=gluster2:gluster3 0 0

{{< /file-excerpt >}}


3.  Create the `/srv/www/` directory and mount the volume to it:

        mkdir /srv/www
        mount /srv/www

4.  Set the document root to `/srv/www` so that Apache serves content from the Gluster volume. Edit your `welcome.conf` file to match the following:

    {{< file "/etc/httpd/conf.d/welcome.conf" aconf >}}
<VirtualHost *:80>
    DocumentRoot "/srv/www"
    <Directory /srv/www>
        Require all granted
        Options Indexes FollowSymLinks Multiviews
    </Directory>
</VirtualHost>

{{< /file >}}


5.  Start the Apache server:

        systemctl start httpd

6.  You may also want to enable Apache to start on boot, although this is optional:

        systemctl enable httpd

### Test Your Configuration

Your Apache servers should now be capable of serving files and applications from your Gluster volume. To test whether everything is connected properly, you can create a test file and check whether it's accessible by all of your application servers. On any one of your application nodes, create a blank file in the directory where you mounted your volume:

    touch /srv/www/testfile

In a web browser, enter the public IP address of any of your Apache servers. You should see a page titled "Index of /" with a list consisting of `testfile`. Make sure that the same list is visible when using the public IP of all of your Apache servers.

To test redundancy of your file system, you can stop the Gluster daemon on your `gluster1` node:

    systemctl stop glusterd

Follow the above steps again, creating another test file and checking whether it is visible from your application nodes' public IPs. Because the GlusterFS volume is replicated and distributed, and we set backup volumes for our Apache servers, taking down one GlusterFS node should not affect the accessibility of your files.

When you're finished, be sure to remove the test files. Do this for any additional test files you created as well:

    rm /srv/www/testfile

Remember to bring `gluster1`'s Gluster daemon back up before continuing:

    systemctl start glusterd

## Keepalived

So far, we've successfully configured a redundant web stack, with three layers of nodes performing a series of tasks. Gluster automatically handles monitoring, and we configured the failover for the file system nodes in our application nodes' `/etc/fstab` files. Next, we'll use keepalived to handle database failover.

Keepalived is a routing service that can be used to monitor and fail over components in a high availability configuration. In this section, you will be using the additional private IP address, or *floating IP* from your database node to fail over to the others if one should go down. A floating IP address is one that can be assigned to a different node if needed. If you didn't request an additional private IP in the Galera section, [contact support](https://www.linode.com/docs/platform/support/) and do so before continuing.

We've added the floating IP address to `galera1`, but in practice, it can be configured to any of your database nodes.

No additional Linodes will be created in this section, and all configuration will be done on your database nodes. Before you begin, install `keepalived` on all of your database nodes:

    yum install keepalived

{{< caution >}}
Make sure that [Network Helper](https://www.linode.com/docs/platform/network-helper) is turned **OFF** on your database nodes before proceeding.
{{< /caution >}}

### Configure IP Failover

First, we'll configure IP failover on `galera2` and `galera3` to take on the floating IP address from `galera1` in the event that it fails.

1.  Go to the **Remote Access** tab in the Linode Manager for `galera2`, and click "IP Failover" under your public IP addresses.

2.  You'll see a menu listing all of the Linodes on your account. Check the box corresponding to the new private IP address for `galera1`, which we will now refer to as the floating IP address, and click **Save Changes**.

3.  Repeat the above steps to configure IP failover for `galera3` as well. Make sure to select the same IP address.

### Configure Keepalived

1.  Edit the following line in your `/etc/sysconfig/keepalived` file on all database nodes, adding `-P` to enable virtual router redundancy protocol:

    {{< file-excerpt "/etc/sysconfig/keepalived" aconf >}}
KEEPALIVED_OPTIONS="-D -P"

{{< /file-excerpt >}}


2.  On all database nodes, back up `keepalived.conf`:

        mv /etc/keepalived/keepalived.conf /etc/keepalived/keepalived.conf.backup

3.  On all database nodes, replace the original file with the following:

    {{< file "/etc/keepalived/keepalived.conf" aconf >}}
! Configuration File for keepalived
global_defs {
    notification_email {
    }

    router_id LVS_DBCLUSTER
}

vrrp_script chk_pxc {
    script "/usr/bin/clustercheck clustercheck example_password 0"
    interval 15
    fall 4
    rise 2
}

vrrp_instance VI_1 {
    state BACKUP
    nopreempt
    interface eth0
    virtual_router_id 51
    priority 50
    advert_int 1
    track_interface {
        eth0
    }
    track_script {
        chk_pxc
    }
    authentication {
        auth_type PASS
        auth_pass example_password
    }
    unicast_src_ip  192.168.0.1
    unicast_peer {
    192.168.2.3
    192.168.4.5
    }

    virtual_ipaddress {
    192.168.9.9/17
    }
    notify_master "/bin/echo 'now master' > /tmp/keepalived.state"
    notify_backup "/bin/echo 'now backup' > /tmp/keepalived.state"
    notify_fault "/bin/echo 'now fault' > /tmp/keepalived.state"
}

{{< /file >}}


    In the lines beginning with `script` and `auth_pass`, change `example_password` to a secure password of your choosing. In the `virtual_ipaddress` block, replace `192.168.9.9` with the floating IP address you configured previously. Be sure to include the `/17` netmask on this line. These sections, and the rest of the file, should be the same on all database nodes.

    In the line beginning with `unicast_src_ip`, change `192.168.0.1` to the private IP address of the node you are configuring. In the `unicast_peer` block, change the IP addresses to the private IP addresses of the other two nodes. Note that these sections will be slightly different depending on which node you are configuring.

4.  Open the MySQL shell using the password set when we [secured MySQL](#secure-mysql):

        mysql -u root -p

5.  Create the user `clustercheck`, replacing `example_password` with the password configured in step 3:

        GRANT USAGE ON *.* to 'clustercheck'@'localhost' IDENTIFIED BY 'example_password';
        FLUSH PRIVILEGES;

    This step only needs to be done on one database node. Once complete, exit the MySQL CLI using `quit`.

6.  On all of your database nodes, add the following entry to your firewall configuration, within the `<zone>` block:

    {{< file-excerpt "/etc/firewalld/zones/internal.xml" xml >}}
<rule>
    <protocol value="vrrp" />
    <accept />
</rule>

{{< /file-excerpt >}}


7.  Reload your firewall rules:

        firewall-cmd --reload

8.  Start the `keepalived` service and enable it to load at boot time:

        systemctl start keepalived
        systemctl enable keepalived

9.  Reboot each of your three database nodes to bring up the failover configuration. It is important to do this one at a time, otherwise you may bring down the entire cluster, in which case you would need to bootstrap MySQL and add each node to the cluster again.

Congratulations! You've successfully installed and configured keepalived. Your database nodes will now be able to fail over if one goes down, ensuring high availability.

## Nodebalancer

The final step in creating a highly available website or application is to load balance traffic to the application servers. In this step, we'll use a NodeBalancer to distribute traffic between the application servers to ensure that no single server gets overloaded. NodeBalancers are highly available by default, and do not constitute a single point of failure.

For instructions on how to install this component, follow our guide on [getting started with NodeBalancers](/docs/platform/nodebalancer/getting-started-with-nodebalancers). Be sure to use the *private* IP addresses of your application servers when adding nodes to your backend.

{{< note >}}
Nodebalancers are an add-on service. Be aware that adding a Nodebalancer will create an additional monthly charge to your account. Please see our [Billing and Payments](/docs/platform/billing-and-payments#additional-linode-services) guide for more information.
{{< /note >}}

## Wordpress (Optional)

If you're installing WordPress to manage your new highly available website, we'll explain how to do so here. If you're using your cluster to serve a custom application, website, or for another purpose, you may skip this section.

1.  Install the MariaDB package on all three of your application nodes. This provides a MySQL client from which to read and write to your Galera cluster:

        yum install mariadb

2.  On one of your database nodes, enter the MySQL shell with the `mysql -u root -p` command. From there, enter the following to allow communication with your database nodes. Replace `password` with a secure password of your choosing:

        CREATE DATABASE wordpress;
        CREATE USER'wordpress'@'%' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON wordpress.* TO 'wordpress'@'%';
        FLUSH PRIVILEGES;

3.  On all of your application servers, install PHP and the necessary dependencies:

        yum install php php-mysql php-gd

4.  Restart Apache on each of your application nodes:

        systemctl restart httpd

5.  On *just one* of your application servers, install the latest version of Wordpress into `/srv/www` and extract it:

        cd /srv/www
        wget http://wordpress.org/latest.tar.gz
        tar -xvf latest.tar.gz

    Optionally, you can create a backup of your original Wordpress archive in case you need to reinstall it at a later time:

        mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz

6.  On all of your application servers, change ownership of the `/srv/www` directory to the Apache user:

        chown -R apache:apache /srv/www

7.  Restart Apache on all of your application servers:

        systemctl restart httpd

8.  In a web browser, navigate to the IP address of one of your application nodes (or the NodeBalancer) to access the Wordpress admin panel. Use `wordpress` as the database name and user name, enter the password you configured in Step 2, and enter your floating IP address as the database host. For additional WordPress setup instruction, see our guide on [Installing and Configuring WordPress](/docs/websites/cms/how-to-install-and-configure-wordpress#configure-wordpress).

Congratulations! You've successfully configured a highly available Wordpress site, and you're ready to start publishing content. For more information, feel free to reference our [Wordpress configuration guide](/docs/websites/cms/how-to-install-and-configure-wordpress).

## DNS Records

The NodeBalancer in the above system directs all incoming traffic to the application servers. As such, its IP address will be the one you should use when configuring your DNS records. To find this information, visit the **NodeBalancers** tab in the Linode Manager and look in the "IP Address" section.

For more information on DNS configuration, refer to our [introduction to DNS records](/docs/networking/dns/dns-records-an-introduction) and our guide on how to use the [DNS Manager](/docs/networking/dns/dns-manager-overview).

## Configuration Management

Because a high availability configuration involves so many different components, you may want to consider additional software to help you manage the cluster and create new nodes when necessary. For more information on the options available for managing your nodes, see our guides on [Salt](https://www.linode.com/docs/applications/salt/install-salt), [Chef](https://www.linode.com/docs/applications/chef/beginners-guide-chef), [Puppet](https://www.linode.com/docs/applications/puppet/set-up-puppet-master-agent), and [Ansible](https://www.linode.com/docs/applications/ansible/getting-started-with-ansible). You can also refer to our guide on [Automating Server Builds](https://www.linode.com/docs/platform/automating-server-builds) for an overview of how to choose a solution that is right for you.

