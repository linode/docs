---
author:
  name: Sergey Bulavintsev
  email: bulavintsev.sergey@gmail.com
description: 'Learn how to configure and use Salt SSH in this simple tutorial'
keywords: ["Saltstack", " salt", " salt-ssh"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-07-25
modified: 2017-08-15
modified_by:
  name: Linode
title: 'Configure and Use Salt SSH to Manage Your Linodes'
contributor:
  name: Sergey Bulavintsev
---

# Introduction to Salt SSH

Salt SSH allows you to execute Salt commands, or states, without installing a salt-minion package.

During execution, Salt SSH will copy necessary files to the target system's `/tmp` folder with SSH, then execute commands, and finally clean up Salt temporary files.

Please note: Because it uses SSH, Salt SSH is slower than standard Salt with ZeroMQ.


# Before You Begin

1.  This guide assumes that you're using an rpm-based system (CentOS, RedHat, Oracle Enterprise Linux) .

2.  Make sure that you have the `salt` and `salt-ssh` packages installed on your master. Check if these packages are installed:

        $rpm -q salt
        $rpm -q salt-ssh

    {{< note >}}
For detailed instruction on how to set up SaltStack repo, please refer to the [Salt Stack Installation Guide](https://www.linode.com/docs/applications/configuration-management/install-and-configure-salt-master-and-minion-servers)
{{< /note >}}

3.  Your minions must have Python installed. Without Python installed on minions, you will only be able to run Salt SSH in raw mode. In raw mode, a raw shell command cannot use execution modules or apply Salt states. If you're running a modern version of CentOS/RedHat, you already have Python installed on your systems

4.  You must have at least one master server and one minion (client).

## Set Up Salt Roster File

The Roster file contains target system information, connection details and credentials.
The Default location for the Roster file is: `/etc/salt/roster`.

   {{< note >}}
The Roster file is configured on the master server.
{{< /note >}}

1.  Open `/etc/salt/roster` with an editor. Define the client systems, by adding the following lines to the file:

    This is an example of minimal host definition

    {{< file "/etc/salt/roster" aconf >}}
linode1:
     host: <IPADDRESS OR HOSTNAME>
     user: <username>
     passwd: <password>

{{< /file >}}


    {{< note >}}
The Roster file stores data in YAML format. Do not add unnecessary spaces to the config file.
{{< /note >}}

2.  If you have a public key stored on the minion, and a private key on the master system, you can configure access to a minion using a private key. For public key authentication, add the following lines to the Roster file:

    {{< file "/etc/salt/roster" aconf >}}
#This is an example of minimal host definition using private key:
linode1:
    host: <IPADDRESS OR HOSTNAME>
    user: <username>
    priv: /<username_home_folder>/.ssh/id_rsa

{{< /file >}}


    {{< note >}}
Using SSH keys is the safest way to access your minions because passwords are not being stored in plain text.
{{< /note >}}

3.  To set up connection to a minion as a regular user, you have to configure a few files. In this case Salt will leverage privileges via sudo. In order to use sudo, set `sudo: True` in the `host definition` section of the Roster file. By default sudo will only work when the real user is logged in over TTY. You can overcome this in two ways:

    **a.** Disable the TTY check by commenting a line in the sudoers file on your minion:

    {{< file-excerpt "/etc/sudoers" aconf >}}
# Defaults requiretty

{{< /file-excerpt >}}


    **b.** Force TTY allocation by setting the `tty: True` option in your Roster file:

    {{< file-excerpt "/etc/salt/roster" aconf >}}
linode1:
    host: <IPADDRESS OR HOSTNAME>
    user: <username>
    passwd: <password>
    sudo: True
    tty: True

{{< /file-excerpt >}}


    {{< note >}}
Permissions leverage via sudo works only if the NOPASSWD option is set up for the user that is connecting to the minion in `/etc/sudoers`.
More information on Roster files can be found in the [Roster files documentation](https://docs.saltstack.com/en/latest/topics/ssh/roster.html#ssh-roster).
{{< /note >}}

4.  Check that the master server has access to the client using the `salt-ssh` command:

        [root@master ~]# salt-ssh linode1 test.ping

    The output should be:

        linode1:
            True

    {{< note >}}
If SSH keys weren't deployed, you may receive the `The host key needs to be accepted, to auto accept run salt-ssh with the -i flag:` message. In this case just run `salt-ssh` with -i flag. This key will let Salt automatically accept a minion's public key. This has to be done only once, during the initial SSH keys exchange.
{{< /note >}}

## Remote Command Execution via Salt SSH

1.  You can execute any command on your minions via the `cmd` execution module:

        [root@master ~]# salt-ssh linode1 cmd.run "du -sh /root"
            linode1:
                15M /root

2.  Salt SSH supports globbing and PCRE regular expressions. For example, if you would like to execute command on all minions, whose names contain "linode":

        [root@master ~]# salt-ssh "linode*" cmd.run 'uname -r'
        linode1:
            3.10.0-229.1.2.el7.x86_64
        linode2:
            2.6.32-573.3.1.el6.x86_64

    {{< note >}}
Salt SSH executes commands concurrently, the default-maximum is 25 simultaneous connections.
{{< /note >}}

3.  It is possible to use any execution module with Salt SSH. With execution modules, you can install packages, control services, gather system information, and much more.

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

    {{< note >}}
A full list of execution modules is available at [Execution modules documentation](https://docs.saltstack.com/en/latest/ref/modules/all/index.html).
{{< /note >}}

## Install Salt-Minion Remotely via Salt SSH

An interesting use case for Salt SSH is automating the installation of `salt-minion` using a simple Salt state.

1.  Create the directory which will contain your state:

        [root@master ~]# mkdir /srv/salt/install_salt_minion

2.  Open the `/srv/salt/install_salt_minion/init.sls` file and declare your state:

    {{< file-excerpt "/srv/salt/install_salt_minion/init.sls" aconf >}}
# This is a state which will install salt-minion on your hosts using Salt SSH
# It will install the SaltStack repo, install salt-minion from that repo, enable and start the salt-minion service and
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
    # Install the salt-minion package and all its dependencies.
    pkg:
        - installed
        # Require that SaltStack repo is set up before installing salt-minion.
        - require:
            - pkgrepo: salt-latest
    # Start and enable the salt-minion daemon.
    service:
        - running
        - enable: True
        # Require that the salt-minion package is installed before starting daemon
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

{{< /file-excerpt >}}


3.  To apply this state, run the following command:

        [root@master salt]#  salt-ssh linode2 state.apply install_salt_minion

4.  Check that minion's key is pending for acceptance by using the `salt-key` command:

        [root@master salt]# salt-key -l un
        Unaccepted Keys:
            linode2

5.  To complete the minion's configuration, accept its public key:

        [root@master salt]# salt-key -a linode2

    Once the minion key is accepted, the minion is fully configured and ready for command execution.
