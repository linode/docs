---
author:
  name: Sergey Bulavintsev
  email: bulavintsev.sergey@gmail.com
description: 'Salt SSH will allow you to manage your minions without having to install salt-minion agent. Learn how to configure and use Salt SSH in this simple tutorial'
keywords: 'Saltstack, salt, salt-ssh, roster'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Wednesday, July 25, 2017'
modified: 'Tuesday, August 15th, 2017'
modified_by:
  name: Linode
title: 'Configuring and Using Salt SSH to Manage Your Linodes'
contributor:
  name: Sergey Bulavintsev
---

#Introduction
Salt-ssh allows you to execute Salt commands or states without installing a salt-minion package.
This allows Salt to work similarly to Ansible, where master is pushing updates to the minions.
During execution, salt-ssh will copy necessary files to the target system via ssh to the `/tmp` folder, execute command or state and clean up salt temporary files.
Be aware that Salt SSH is slower than standard Salt with ZeroMQ because it it working via SSH.


#Before You Begin

1.  This guide assumes that you're using rpm based (CentOS, RedHat, Oracle Enterprise Linux) system.

2.  Make sure that you have salt and salt-ssh packages installed on your master. You may check if these packages are installed by executing:

        $rpm -q salt
        $rpm -q salt-ssh

    {: .note}
    >
    > For detailed instruction on how to set up SaltStack repo, please refer to [SaltStack installation](https://www.linode.com/docs/applications/configuration-management/install-and-configure-salt-master-and-minion-servers)

3.  Your minions must have Python installed. Without Python installed on minions, you will only be able to run salt-ssh in raw mode. If you're running any modern version of CentOS/RedHat, you should already have Python installed on your systems. In raw mode, you execute a raw shell command and cannot use execution modules or apply salt states.

4.  You must have at least one master server and one minion (client).

##Set up Salt Roster file

Roster file contains information on target systems, connection details and credentials, which will be used for connection.
Default location for roster file is `/etc/salt/roster`.

   {: .note}
   >
   > Roster file is configured on master server.

1.  Open the file `/etc/salt/roster` with your editor of choice and add following lines to define client systems:

    This is an example of minimal host definition

    {: .file }
    /etc/salt/roster
    :  ~~~ config
    linode1:
         host: <IPADDRESS OR HOSTNAME>
         user: <username>
         passwd: <password>
       ~~~

    {: .note}
    >
    > Roster file keeps data in yaml format so be careful with the amount of spaces you use.

2.  To set up access to minion using private key. If you already have your public key installed on minion and you have private key on master, add following lines:
    {: .file }
    /etc/salt/roster
    :  ~~~ config
    #This is an example of minimal host definition using private key:
    linode1:
        host: <IPADDRESS OR HOSTNAME>
        user: <username>
        priv: /<username_home_folder>/.ssh/id_rsa
       ~~~

    {: .note}
    >
    > Using ssh keys is much more safer way to access your minions, as you can avoid storing password in plaintext.
 
3.  To set up connection to minion as a regular user, you will have to add a few extra lines.In this case Salt will leverage privileges via sudo. Just set sudo value to True in host definition like in the example below. You may also have to add tty option if `/etc/sudoers` on your minion is configured with requiretty option:

    {: .file-excerpt}
    /etc/salt/roster
    :  ~~~ config
    linode1:
        host: <IPADDRESS OR HOSTNAME>
        user: <username>
        passwd: <password>
        sudo: True
        tty: True
       ~~~

4.  Check that master server have access to client using salt-ssh command:

        [root@master ~]# salt-ssh linode1 test.ping

    You should see output similar to:

        linode1:
            True

    {: .note}
    >
    > Permissions leverage via sudo works only if NOPASSWD option is set up for the user, which will be used to connect to the minion, in `/etc/sudoers`.
    > More information on roster files can be found at [Roster files documentation](https://docs.saltstack.com/en/latest/topics/ssh/roster.html#ssh-roster)

##Remote Command Execution via Salt SSH

1.  You can execute any command on you minions via `cmd` execution module:

        [root@master ~]# salt-ssh linode1 cmd.run "du -sh /root"
            linode1:
                15M /root

2.  Salt SSH supports globbing and PCRE regular expressions. For example, if you would like to execute command on all minions, which names are starting from "linode":

        [root@master ~]# salt-ssh "linode*" cmd.run 'uname -r'
        linode1:
            3.10.0-229.1.2.el7.x86_64
        linode2:
            2.6.32-573.3.1.el6.x86_64

    {: .note}
    >
    > Salt SSH execute commands concurrently with a default of 25 max simultaneous connections.

3.  It is possible to use any execution module with Salt SSH. With help of execution modules, we can easily install packages, control services, gather system information and many many more:

        [root@master ~]# salt-ssh linode1 pkg.install iftop
        linode1:
            ----------
            iftop:
            ----------
            new:
                1.0-0.14.pre4.el7
            old:

        [root@master ~]# salt-ssh linode1 service.restart httpd
            linode1:
                True

        [root@master ~]# salt-ssh linode1 disk.percent /var
            linode1:
                22%

    {: .note}
    >
    > Full list of execution modules is available at [Execution modules documentation](https://docs.saltstack.com/en/latest/ref/modules/all/index.html).

##Installing Salt-Minion Remotely via Salt SSH

An interesting use case for Salt SSH is automating installation of salt-minion using a simple Salt state.

1.  Create directory which will contain your state:

        [root@master ~]# mkdir /srv/salt/install_salt_minion

2.  Open `/srv/salt/install_salt_minion/init.sls` file and declare your state:

    {: .file-excerpt}
    /srv/salt/install_salt_minion/init.sls
    :   ~~~ config
        # This is a state which will install salt-minion on your hosts using Salt SSH
        # It will install SaltStack repo, install salt-minion from that repo, enable and start salt-minion service and
        # declare master in /etc/salt/minion file
        salt-minion:
            # Install SaltStack repo for RHEL/Centos systems
            pkgrepo.managed:
                - name: salt-latest
                - humanname: SaltStack Latest Release Channel for RHEL/Centos $releasever
                - baseurl: https://repo.saltstack.com/yum/redhat/$releasever/$basearch/latest
                - gpgkey: https://repo.saltstack.com/yum/redhat/$releasever/$basearch/latest/SALTSTACK-GPG-KEY.pub
                - gpgcheck: 1
                - enabled: 1
            # Install salt-minion package and all it's dependencies.
            pkg:
                - installed
                # Require that SaltStack repo is set up before installing salt-minion.
                - require:
                    - pkgrepo: salt-latest
            # Start and enable salt-minion daemon.
            service:
                - running
                - enable: True
                # Require that salt-minion package is installed before starting daemon
                - require:
                    - pkg: salt-minion
                # Restart salt-minion daemon if /etc/salt/minion file is changed
                - watch:
                    - file: /etc/salt/minion

        # Configure Salt master in conf file
        /etc/salt/minion:
            file.managed:
                # File will contain only one line
                - contents:
                    - master: <IPADDRESS OR HOSTNAME>
        ~~~

3.  To apply this state, run following command:

        [root@master salt]#  salt-ssh linode2 state.apply install_salt_minion

4.  Check that minion's key is pending for acceptance by using `salt-key` command:

        [root@master salt]# salt-key -l un
        Unaccepted Keys:
            linode2

5.  To complete minion's configuration, accept its public key by:

        [root@master salt]# salt-key -a linode2

    Once minion key is accepted, minion is fully configured and ready for command execution.
