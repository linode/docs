---
description: "This guide covers how to configure Keepalived with a simple health check and enable it to control lelastic, a simple BGP daemon created for the Linode platform."
keywords: ['IP failover','keepalived','elastic IP']
published: 2022-10-19
modified: 2022-11-28
modified_by:
  name: Linode
title: "Use Keepalived Health Checks with BGP-based Failover"
aliases: ['/guides/keepalived-with-bgp-failover/']
authors: ["Linode"]
---

[Keepalived](https://linux.die.net/man/8/keepalived) is one of the most commonly used applications that implements VRRP, a networking protocol that manages IP address assignment and ARP-based failover. It can be configured with additional health checks, such as checking the status of a service or running a custom script. When one of these health checks detects an issue, the instance changes to a fault state and failover is triggered. During these state transitions, additional task can be performed through custom scripts.

The Linode platform is currently undergoing [network infrastructure upgrades](/docs/products/compute/compute-instances/guides/network-infrastructure-upgrades/), which affects IP address assignment and failover. Once this upgrade occurs for the data center and hardware that your Compute Instances reside on, VRRP software like Keepalived can no longer directly manage failover. However, other features of Keepalived can still be used. For instance, Keepalived can continue to run health checks or VRRP scripts. It can then be configured to interact with whichever BGP daemon your system is using to manage IP address assignment and failover.

This guide covers how to configure Keepalived with a simple health check and enable it to control [lelastic](https://github.com/linode/lelastic), a BGP daemon created for the Linode platform.

{{< note >}}
If you are migrating to BGP-based failover and currently have health checks configured with Keepalived, you can modify the steps in this guide to include your own settings.
{{< /note >}}

## Configure IP Sharing and BGP Failover

Before continuing, IP Sharing and BGP failover must be properly configured on both Compute Instances. To do this, follow the [Configuring Failover on a Compute Instance](/docs/products/compute/compute-instances/guides/failover/) guide, which walks you through the process of configuring failover with lelastic. If you decide to use a tool other than lelastic, you will need to make modifications to some of the commands or code examples provided in some of the following sections.

## Install and Configure Keepalived

This section covers installing the keepalived software from your distribution's repository. See [Installing Keepalived](https://keepalived.readthedocs.io/en/latest/installing_keepalived.html) on the official documentation if you prefer to install it from source.

1. Log in to your Compute Instance over SSH. See [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/) for assistance.

1. Install keepalived by following the instructions for your system's distribution.

    **Ubuntu and Debian:**

    ```command
    sudo apt update && sudo apt upgrade
    sudo apt install keepalived
    ```

    **CentOS 8 Stream, CentOS/RHL 8 (including derivatives such as AlmaLinux 8 and Rocky Linux 8), Fedora:**

    ```command
    sudo dnf upgrade
    sudo dnf install keepalived
    ```

    **CentOS 7:**

    ```command
    sudo yum update
    sudo yum install keepalived
    ```

1. Create and edit a new keepalived configuration file.

    ```command
    sudo nano /etc/keepalived/keepalived.conf
    ```

1. Enter the following settings for your configuration into this file. Use the example below as a starting point, replacing each item below with the appropriate values for your Compute Instance. For more configuration options, see [Configuration Options](/docs/products/compute/compute-instances/guides/failover-legacy-keepalived/#configuration-options).

    - *$password*: A secure password to use for this keepalived configuration instance. The same password must be used for each Compute Instance you configure.

    - *$ip-a*: The IP address of this Compute Instance.

    - *$ip-b*: The IP address of the other Compute Instance.

    - *$ip-shared*: The Shared IP address.

    ```file {title="/etc/keepalived/keepalived.conf"}
    vrrp_instance example_instance {
        state BACKUP
        nopreempt
        interface eth0
        virtual_router_id 10
        priority 100
        advert_int 1
        authentication {
            auth_type PASS
            auth_pass $password
        }
        unicast_src_ip $ip-a
        unicast_peer {
            $ip-b
        }
        virtual_ipaddress {
            $ip-shared/32
        }
    }
    ```

    In the above configuration file, the state is set to *BACKUP* and the parameter `nopreempt` is included. When each Compute Instance uses these settings, failover is sticky. This means the Shared IP address remains routed to a Compute Instance until it enters a *FAULT* state, even if it is lower priority than the other Compute Instance. If you wish to prioritize one instance over the other, remove the `nopreempt` parameter, set one of the Compute Instances to a *MASTER* state, and adjust the `PRIORITY` parameter as desired.

1. Enable and start the keepalived service.

    ```command
    sudo systemctl enable keepalived
    sudo systemctl start keepalived
    ```

1. Perform these steps again on the other Compute Instance you would like to configure.

## Create the Notify Script

Keepalived can be configured to run *notification scripts* when the instance changes state (such as when entering a *MASTER*, *BACKUP* ,or *FAULT* state). These scripts can perform any action and are commonly used to interact with a service or modify network configuration files. For this guide, the scripts are used to update a log file and start or stop the BGP daemon that controls BGP failover on your Compute Instance.

1. Create and edit the notify script.

    ```command
    sudo nano /etc/keepalived/notify.sh
    ```

1. Copy and paste the following bash script into the newly created file. If you wish to control a BGP daemon other than lelastic, replace `sudo systemctl restart lelastic` and `sudo systemctl stop lelastic` with the appropriate commands for your service.

    ```file {title="/etc/keepalived/notify.sh"}
    #!/bin/bash

    keepalived_log='/tmp/keepalived.state'
    function check_state {
            local state=$1
            cat << EOF >> $keepalived_log
    ===================================
    Date:  $(date +'%d-%b-%Y %H:%M:%S')
    [INFO] Now $state

    EOF
            if [[ "$state" == "Master" ]]; then
                    sudo systemctl restart lelastic
            else
                    sudo systemctl stop lelastic
            fi
    }

    function main {
            local state=$1
            case $state in
            Master)
                    check_state Master;;
            Backup)
                    check_state Backup;;
            Fault)
                    check_state Fault;;
            *)
                    echo "[ERR] Provided arguement is invalid"
            esac
    }
    main $1
    ```

1. Make the file executable.

    ```command
    sudo chmod +x /etc/keepalived/notify.sh
    ```

1. Modify the keepalived configuration files so that the notify script is used for each state change.

    ```file {title="/etc/keepalived/keepalived.conf"}
    vrrp_instance example_instance {
        ...
        notify_master "/etc/keepalived/notify.sh Master"
        notify_backup "/etc/keepalived/notify.sh Backup"
        notify_fault "/etc/keepalived/notify.sh Fault"
    }
    ```

1. Restart your BGP daemon and keepalived.

    ```command
    sudo systemctl restart lelastic
    sudo systemctl restart keepalived
    ```

1. View the log file to see if it was properly created and updated. If the notification script was successfully used, this log file should have an accurate timestamp and the current state of the instance.

    ```command
    cat /tmp/keepalived.state
    ```

    ```output
    ===================================
    Date:  14-Oct-2022 14:30:54
    [INFO] Now Master
    ```

## Configure the Health Check (VRRP Script)

The next step is to configure Keepalived with a health check so that it can failover if it ever detects an issue. This is the primary reason you may want to use Keepalived alongside a BGP daemon. Keepalived can be configured to track a file (`track_file`), track a process (`track_process`), or run a custom script so that you can preform more complex health checks. When using a script, like is shown in this example, the script should return a `0` to indicate success and return any other value to indicate a failure. When a failure is detected, the state is changed to *FAULT* and the notify script runs.

This guide helps you configure a custom script that detects if a file is present or not. If the file is present, the script returns a 1 to indicate a failure.

1. Create and edit the health check script.

    ```command
    sudo nano /etc/keepalived/check.sh
    ```

1. Copy the following script and paste it into the file.

    ```file {title="/etc/keepalived/check.sh"}
    #!/bin/bash

    trigger='/etc/keepalived/trigger.file'
    if [ -f $trigger ]; then
      exit 1
    else
      exit 0
    fi
    ```

1. Make the file executable.

    ```command
    sudo chmod +x /etc/keepalived/failover.sh
    ```

1. Update the keepalived configuration file to define the VRRP script and enable your VRRP instance to use the script. The *interval* determines how often the script is run, *fall* determines how many times the script must return a failure before the state is changed to *FAULT*, and *rise* determines how many times a success is returned before the instance goes back to a *BACKUP* or *MASTER* state.

    ```file {title="/etc/keepalived/keepalived.conf"}
    vrrp_script check_for_file {
        script "/etc/keepalived/check.sh"
        interval 5
        fall 2
        rise 2
    }
    vrrp_instance example_instance {
        ...
        track_script {
            check_for_file
        }
        ...
    }
    ```

1. Restart your BGP daemon and keepalived.

    ```command
    sudo systemctl restart lelastic
    sudo systemctl restart keepalived
    ```

1. To test this health check, create the trigger file on whichever Compute Instance is in a  *MASTER* state.

    ```command
    touch /etc/keepalived/trigger.file
    ```

1. Check the log file on that Compute Instance to make sure it enters a *FAULT* state. Once it does, check the log file on the other Compute Instance to verify that it enters a *MASTER* state.

    ```command
    tail -F /tmp/keepalived.state
    ```

    ```output
    ===================================
    Date:  14-Oct-2022 14:30:54
    [INFO] Now Master
    ```

## Additional Recommended Security Settings

By default, Keepalived attempts to run the scripts using a *keepalived_script* user. If that doesn't exist, it uses the *root* user. Since running these scripts as the root user introduces many security concerns, this section discusses creating the *keepalived_script* user.

1. Create a limited user account called *keepalived_script*. Since it is never used to log in, that feature can be disabled.

    ```command
    sudo useradd -r -s /sbin/nologin -M keepalived_script
    ```

1. Edit the `sudoers` file.

    ```command
    visudo /etc/sudoers
    ```

1. Within this file, grant permission for the new user to restart and stop the BGP daemon. The example below uses lelastic.

    ```file {title="/etc/sudoers"}
    # User privilege specification
    root    ALL=(ALL:ALL) ALL
    keepalived_script ALL=(ALL:ALL) NOPASSWD: /usr/bin/systemctl restart lelastic, /usr/bin/systemctl stop lelastic
    ```

1. Update the ownership of the `/etc/keepalived` directory (and all of the files within it).

    ```command
    sudo chown -R keepalived_script:keepalived_script /etc/keepalived
    ```

1. Once again, edit the Keepalived configuration file and paste the following snippet to the top of that file.

    ```file {title="/etc/keepalived/keepalived.conf"}
    global_defs {
        enable_script_security
    }
    ...
    ```

## Example Configuration Files

The links below contain complete working configuration files along with the specified example IP addresses. Please review them if you would like to see all of the recommended settings for each Compute Instance combined into a single file.

- **Shared IP:** 203.0.113.57 (configured on the loopback interface)
- **Compute Instance A:** 192.0.2.173 ([keepalived.conf](keepalived.conf.a))
- **Compute Instance B:** 198.51.100.49 ([keepalived.conf](keepalived.conf.b))