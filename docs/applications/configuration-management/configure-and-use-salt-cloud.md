---
author:
  name: Sergey Bulavintsev
  email: bulavintsev.sergey@gmail.com
description: 'This guide shows how to install, configure and use Salt Cloud'
keywords: 'SaltStack, Salt, salt-cloud'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Friday, October 27, 2017'
modified: Wednesday, November 1, 2017
modified_by:
    name: Linode
title: 'Configure and use Salt Cloud'
contributor:
  name: Sergey Bulavintsev
---

*This is a Linode Community guide. If you're an expert on something for which we need a guide, you too can [get paid to write for us](/docs/contribute).*

---

## Introduction to Salt Cloud

[Salt Cloud](https://docs.saltstack.com/en/latest/topics/cloud/) is a configuration management tool that allows users to provision systems on cloud/hypervisors.
As Salt Cloud is part of Salt, the two are tightly integrated. For example, the default behaviour of Salt Cloud is to install Salt on all provisioned systems. This allows you to easily put systems into desired state during provisioning.
Also, Salt Cloud allows you to gather information on your systems and manage their lifecycle through a CLI.
Salt Cloud supports Linode as a provider out of the box. You do not have to install any additional plugins.
This guide will provide instructions on installing Salt Cloud and configuring it to work with Linode. You will also find out how to use Salt Cloud for managing complex environments.

## Before You Begin

1.  You will need a management server, which will be used to create and manage your linode servers. You can host management server on Linode, use any other server or even your laptop. The only condition is that it is capable of installing and executing Salt Cloud.

2.  This guide assumes that Salt Cloud will be installed together with Salt master server.

3.  Generate API key to access Linode API. This key will be used by Salt Cloud to manage your instances. Use [API key](https://www.linode.com/docs/platform/api/api-key) guide to do this. Make sure to keep your API key safe.

4.  Your management server must have access to the Linode API (non-proxy internet access).

## Install Salt, Salt Cloud via bootstrap script.

The recommended way to install Salt Cloud is to use Salt Bootstrap script. This script will install salt, salt-cloud packages and all required dependencies. This script has large variety of supported options. Run script with `-h` option to check them or refer to [Salt Bootstrap Guide](https://docs.saltstack.com/en/latest/topics/tutorials/salt_bootstrap.html) for detailed instructions.

1. Download the Salt bootstrap script via curl:

        curl -o bootstrap-salt.sh -L https://bootstrap.saltstack.com

2. Use the `-L` option of Salt bootstrap script to install Salt and Salt Cloud.

        sh bootstrap-salt.sh -L

    {: .note}
    >
    > You will require root privileges to execute this script.

## Configure Salt Cloud

1.  Set up provider configuration.

    First, configure access to the Linode API. Edit file `/etc/salt/cloud.providers.d/linode.conf` with your text editor of choice. First string in this file is name of your provider configuration. Salt Cloud will use it during operations with instances in CLI. Due to this use short and reasonable name (or abbreviation like `li`). You can also specify multiple linode providers for managing multiple accounts. Linode requires the default root password for the new servers to be set. This password needs to be eight characters and contain lowercase, uppercase, and numbers.

    {: .file-excerpt}
    /etc/salt/cloud.providers.d/linode.conf
    :  ~~~ config
    linode-provider:
        apikey: <Your API key>
        password: <Default password for the new instances>
        driver: linode
       ~~~

    {: .note}
    >
    > All configuration files stores data in YAML format. Be careful with indentation - use only spaces and not tabs. Each level of indentation is usually separated with 2 spaces.

2. Test access to Linode API

    Execute the following command from your master to test access to the Linode API:

       salt-cloud --list-locations linode-provider

    If you have set up connection to Linode properly, you will see output similar to:

{:.output}
~~~
linode_provider:
    ----------
    linode:
        ----------
        Atlanta, GA, USA:
            ----------
            ABBR:
                atlanta
            DATACENTERID:
                4
            LOCATION:
                Atlanta, GA, USA
~~~

3. List available locations, images and sizes

    Before creating new instances, you have to specify instance size(amount of system memory, cpu and storage), location(physical location of datacenter) and image(operating system).
    You can obtain this information by executing following commands:

    *  Get available locations:

            salt-cloud --list-locations linode-provider

    *   Get available sizes:

            salt-cloud --list-sizes linode-provider

    *   Get available images:

            salt-cloud --list-images linode-provider

4. Set up profile configuration

    Next step is to create an instance profile. In this profile you describe a server which will be created in your Linode account. Minimal configuration should include provider, size, image and location.
    For this example, create an instance with minimal size, using CentOS 7 image, located in London.
    Open `/etc/salt/cloud.profiles.d/linode-london-1024.conf` and paste the following:

    {: .file-excerpt}
    /etc/salt/cloud.profiles.d/linode-london-1024.conf
    :  ~~~ config
    linode_1024:
        provider: linode-provider
        size: Linode 1024
        image: CentOS 7
        location: London, England, UK
       ~~~

    {: .note}
    >
    > You can use one file for all profiles, or use one file per instance profile. All files from `/etc/salt/cloud.profiles.d/` are read during execution.

    By default, Salt Cloud will install Salt Minion on all provisioned servers. Let us pass master hostname to deploy script. This will allow provisioned systems to connect to the master. To do this, set the default master configuration for all provisioned systems. Edit `/etc/salt/cloud.conf.d/master.conf` and paste the following content, replacing `saltmaster.example.com` with the IP address or domain name of your master server:

    {: .file-excerpt}
    /etc/salt/cloud.conf.d/master.conf
    :  ~~~ config
    minion:
        master: saltmaster.example.com
       ~~~

    Another option is to set this parameter for specific instance profile:

    {: .file-excerpt}
    /etc/salt/cloud.profiles.d/linode-london-1024.conf
    :  ~~~ config
    linode_1024_with_master:
    provider: linode-provider
        size: Linode 1024
        image: CentOS 7
        location: London, England, UK
        minion:
            master: mymaster.example.com
       ~~~

    Finally, let us set up [SSH key authentication](https://www.linode.com/docs/security/use-public-key-authentication-with-ssh) for your instance. To do this during provisioning set up profile as following, replacing the `ssh_pubkey` and `ssh_key_file` with key information for an ssh key on your master server:

    {: .file-excerpt}
    /etc/salt/cloud.profiles.d/linode-london-1024.conf
    :  ~~~ config
    linode_1024_with_ssh_key:
        provider: linode-provider
        size: Linode 1024
        image: CentOS 7
        location: London, England, UK
        ssh_pubkey: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKHEOLLbeXgaqRQT9NBAopVz366SdYc0KKX33vAnq+2R user@host
        ssh_key_file: ~/.ssh/id_ed25519
       ~~~

    {: .note}
    >
    > Please notice that if your master server is located behind a firewall, you will have to open ports 4505-4506 in [firewall](https://docs.saltstack.com/en/latest/topics/tutorials/firewall.html). Depending on your network configuration, you may have to set up port forwarding for these ports.

## Using salt-cloud

### Create Linode instances

With this configuration complete, creating new instances in Linode requires just a single command:

    salt-cloud -p linode_1024 linode1

Creating the instance and installing salt-minion on it might take some time. When deployment is finished, you will see following summary:

{:.output}
~~~
linode1:
    ----------
    deployed:
        True
    id:
        <ID>
    image:
        CentOS 7
    name:
        linode1
    private_ips:
    public_ips:
        - <ip_address>
    size:
        Linode 1024
    state:
        Running
~~~

You can connect to this instance using user `root` and the default password specified in the config file.

To create multiple servers in one command type the following:

    salt-cloud -p linode_1024 linode1 linode2

{: .note}
>
> Instance names, which you provide in the command above is Linode labels. They are used to manage instances internally and they aren not connected to instance hostname. Linode labels may only contain ASCII letters or numbers, dashes, and underscores; must begin and end with letters or numbers, and be at least three characters in length.

Normally when creating Linode instances they are executed serially. You can use `salt-cloud` command with `-P` option to create instances in parallel allowing for deployment.

    salt-cloud -P -p linode_1024 linode1 linode2

Finally, if you do not want to install Salt Minion on provisioned server, you can run `salt-cloud` with `--no-deploy` option.

    salt-cloud -p linode_1024 --no-deploy linode3

Salt cloud will generate error message, but instance will be created:

{:.output}
~~~
linode3:
    ----------
    Error:
        ----------
        No Deploy:
            'deploy' is not enabled. Not deploying.
~~~


### Destroy Linode instance

1.  To destroy a Linode instance, execute `salt-cloud` with `-d` option:

        salt-cloud -d linode1

2.  Confirm the deletion when prompted, and the server will be destroyed in a couple of seconds.

### Get information about running instances

There are a couple of options to get information about instances are available.

1. Gather partial information by executing `salt-cloud` with the `-Q` option:

        salt-cloud -Q

2.  Get full information about instances using -F option:

        salt-cloud -F

3.  Configure a selective query. In order to do this, edit `/etc/salt/cloud.conf.d/query.conf` and paste in fields which you would like to select:

    {: .file-excerpt}
    /etc/salt/cloud.conf.d/query.conf
    :  ~~~ config
  query.selection:
        - image
        - size
       ~~~

4.  Execute selective query using `-S` option:

        salt-cloud -S

    Output:

    {:.output}
    ~~~
        linode3:
            ----------
            image:
                CentOS
            size:
                1024
    ~~~

## Performing actions on instances

Actions are features that applied to a specific instance and thus require an instance name to be passed in.
Currently, the following actions are supported with Linode:

    * show_instance
    * start
    * stop

For example, to stop a running linode1 instance, execute `salt-cloud` command with `-a` option and `stop` command:

      salt-cloud -a stop linode1


## Using cloud map files to manage complex environments

When you are scaling up, creating and destroying servers one-by-one becoming cumbersome. To solve this problem, you can use cloud map files. Cloud maps assigns profiles to a list of  instances. During execution Salt Cloud will try to bring state of these instances into agreement with the map file. New instances will be created, and existing instances will remain unmodified.

### Configure cloud map

This example cloud map will define two instances: linode_web and linode_db. Both these instances will use profile linode_1024, which we defined earlier.

1.  Edit `/etc/salt/cloud.conf.d/linode.map` and paste in following:

    {: .file-excerpt}
    /etc/salt/cloud.conf.d/linode.map
    :  ~~~ config
    linode_1024:
        - linode_web
        - linode_db
       ~~~

{: .note}
> Cloud map file allows you to define instances from several Linode accounts or even from different provider. Please check the [cloud map](https://docs.saltstack.com/en/latest/topics/cloud/map.html) for an in-depth guide.

2.  To create instances from cloud map file, execute salt-cloud with `-m` option and point to cloud map file.

        salt-cloud -m /etc/salt/cloud.maps.d/linode.map

3.  Salt cloud will ask you to confirm the target configuration:

    {:.output}
    ~~~
    The following virtual machines are set to be created:
        linode_web
        linode_db

    Proceed? [N/y] y
    ... proceeding
    .  .  .
    ~~~

{: .note}
>
> To create instances in parallel, use `-P` option with cloud map files just like with regular provisioning.

### Delete instances created by cloud map files

If an existing instance is removed from the cloud map file, it will remain running. To delete instances created by map files, you have several options:

* Delete a single or multiple instances, by specifying their names:

    salt-cloud -d linode_web linode_db

* Delete all instances, described in map file:

    salt-cloud -d -m /etc/salt/cloud.conf.d/linode.map

* Allow Salt Cloud to destroy every instance, not described in map file. SaltStack considers that deleting such instances is very dangerous. Due to that such behaviour is disabled by default and you have to enable it. In order to do this:

  1. Modify `/etc/salt/cloud` and add following:

      {: .file-excerpt}
      /etc/salt/cloud
      :  ~~~ config
      enable_hard_maps: True
         ~~~

  2. Execute salt-cloud, passing `--hard` as an option:

        salt-cloud -d -m /etc/salt/cloud.maps.d/linode.map

  3. Confirm the deletion when prompted.
