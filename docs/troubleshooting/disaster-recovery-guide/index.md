---
author:
  name: Linode
  email: docs@linode.com
description: 'Troubleshooting steps to access your Linode after maintenance has been applied to your host'
keywords: ['linux','reboot','lish']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2018-07-27
modified: 2018-07-27
modified_by:
  name: Linode
title: "Acessing Your Linode After Maintenance"
---
If you are having issues accessing your Linode after maintenance has been applied to your host, here are a few troubleshooting steps to follow:


## Is the Linode Powered On?
The first place to start is to make sure that your Linode is booted.

1. Log in to the Linode Manager. On the [*Linodes*](https://manager.linode.com/linodes) page, under the *Status* column look for *Running* as the status of your Linode.

1. If your Linode's status displays *Powered Off*, click on the *Dashboard* link. Under the *Dashboard* section, click on the grey `Boot` button to boot your Linode.

1. Once the Linode has booted, its *Server Status* should display *Running*

## Restore SSH Access with Lish

If you have ensured that your Linode is booted, but do not have SSH access, you can use Lish to access your Linode via SSH and continue any necessary troubleshooting steps.

1. Log into the Linode Manager and click on the *Dashboard* link for your Linode.

1. Click on the *Remote Access* tab. Under the *Console Access* section, click on the *Launch Lish Console* link.  This will launch the Lish Console via your browser window. You will be prompted to enter your Linode user and password.

The [Using a Linode Shell Guide](/docs/platform/manager/using-the-linode-shell-lish/) contains more information on Lish.

{{< note >}}
Lish is and out-of-band management tool, so you can use your root login credentials, if needed.
{{</ note >}}

## Network Helper

Your Linode's Network Helper automatically deposits a static networking configuration in to your Linode at boot. This means you don't have to worry about altering your network configuration. To enable the Network Helper:

1. Log into the Linode Manager and click on the *Dashboard* link for your Linode.

1. Under *Configuration Profiles*, click the *Edit* link for the profile you want to adjust.

1. On the Configuration Profile page, scroll to the *Filesystem/Boot Helpers* section and toggle *Yes* next to *Auto-configure Networking*.

1. Click on *Save Changes*, then reboot your Linode.

For more information, refer to the [Network Helper](/docs/platform/network-helper/) guide.

## Checking Interfaces/Networking

Once you've rebooted your Linode and have SSH access via Lish, determine if a Linode's networking interfaces have been configured and brought up properly.

1. Print out the contents of the network interfaces file to view the applied configuration from the Network Helper:

    **Debian / Ubuntu**

        cat /etc/network/interfaces

    **CentOs**

        cat /etc/sysconfig/network-scripts/ifcfg-eth0


1. Check the status of the networking service on the Linode:

    **Debian / Ubuntu**

        systemctl status networking.service

    **CentOs**

        systemctl status -l  network.service

1. To display all available ethernet interfaces, ip addresses and property information:

        ip a

1. List all of the route entries in the Kernel:

        ip r

## Failed to Raise Network Error Message Troubleshooting

While you were checking interfaces / networking on your Linode, you may have encountered the following error message:

    [FAILED] Failed to start Raise network interfaces. See 'systemctl status networking.service' for details.

This section provides some troubleshooting steps for specific errors you may have encountered when checking interfaces / networking on your Linode.

### Was Your Interface Renamed?

When viewing the output of the `interfaces` file, if you notice your interfaces have been renamed to something other than `eth0` (for example, `ensp`) this may be due to the latest version of systemd (226-1+ as of writing this guide).  The latest version of systemd uses [Predictable Network Interface Names](https://www.freedesktop.org/wiki/Software/systemd/PredictableNetworkInterfaceNames/).

1. You can disable the use of Predictable Network Interface Names with the following command:

    ln -s /dev/null /etc/systemd/network/99-default.link

1. You will need to reboot your Linode for the changes to take effect.


### Iptables

1. Check the status of the networking service on the Linode:

        sudo systemctl status networking.service -l

2. The `journalctl` command can be used to query the contents of the systemd journal. This command will show the last 20 messages for the networking unit.

        sudo journalctl -u networking --no-pager | tail -20

      If the networking journal entry output contains a similar line, there could be a firewall issue on the Linode:

        Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: failed to exec /etc/network/if- Apr 06 01:03:17 xlauncher ifup[6359]: run-parts: /etc/network/if-up.d/iptables e

1. Move the iptables file to your home directory to temporarily disable the firewall.

        sudo mv /etc/network/if-up.d/iptables ~

1. The `ifup -a` and `ifdown -a` commands will execute all scripts defined within the `/etc/network/if*.d` directories and bring the network interface down and then back up.

        ifdown -a && ifup -a

      You will need to manually reenable the firewall and restore the moved iptables file after running the commands. You can use the full output of the `sudo systemctl status networking.service -l` to determine if the failure is happening when executing the `etc/network/if-up.d/iptables` file or within the rules of the iptables. The exec codes provided in the output will help you determine which of the two is the source of failure.

      See the [Control Network Traffic with Iptables](https://linode.com/docs/security/firewalls/control-network-traffic-with-iptables/) guide for more information.

### SendMail

If you have SendMail installed, and saw the `Failed to start Raise network interfaces` error message, the following commands will help you troubleshoot the issue.

1. Check the status of the networking service on the Linode:

        sudo systemctl status networking.service -l

1. The `ifup -a` and `ifdown -a` commands will execute all scripts defined within the `/etc/network/if*.d` directories.

        ifdown -a && ifup -a

    If after running those commands you encounter the following error, a SendMail version update may be at fault.

        /etc/network/if-up.d/sendmail: 44: .: Can't open /usr/share/sendmail/dynamic run-parts: /etc/network/if-up.d/sendmail exited with return code 2

    This issue is related to a known [SendMail bug](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=873978) found in SendMail version 8.15.2-8 and fixed in version 8.15.2-9. `/etc/network/if-up.d/sendmail` calls for `/usr/share/sendmail/dynamic`, which may not exist as a result of the broken SendMail update or SendMail not cleaning itself up after removal of Sendmail.

1. To resolve the described SendMail issue, move the `sendmail` file to the home directory:

      sudo mv /etc/network/if-up.d/sendmail ~

1. The `ifup -a` and `ifdown -a` commands will execute all scripts defined within the `/etc/network/if*.d` directories and bring the network interface down and then back up:

        ifdown -a && ifup -a

    - If you do not need to continue using SendMail, you can remove the SendMail if-up script from the home directory:

            rm ~/sendmail

    - If you need to continue using SendMail, you may want to consider reinstalling SendMail or do further research before modifying the SendMail if-up script.


## Did All of your Services Start After Reboot?

When troubleshooting it is helpful to determine which services are running on your Linode.

1. Run the following command to view all network connections with their corresponding address, state, PID and name

        sudo netstat -plntu

1. To display all units of type service that the system manager knows about:

        systemctl list-units --type=service

1. To view a list of the state of all the services controlled by the system:

        service --status-all

### Restarting Services

If you expect a service to be running, but it is displayed as not running try restarting the service with the `sudo systemctl restart servicename` command, replacing `servicename` with the name of the service you'd like to restart. Below is a list of commands to restart the most common services on a Linode:

**Apache**

- Debian and Ubuntu:

        sudo service apache2 restart

- Fedora and CentOS:

        sudo service httpd restart

**Nginx**

    sudo service nginx restart

**MySQL**

    sudo service mysqld restart

**SSH**

    sudo systemctl restart sshd.service

## Still Unable to Connect

If you have tried all the steps listed above and still cannot connect to your Linode, you may still be running into issues with your firewall.

1. Display your iptables ruleset:

        sudo iptables-save

If you are unable to determine a specific rule that is causing issues with your firewall, flush your rules and start over:

1. Create a temporary backup of your current iptables:

        sudo iptables-save > /tmp/iptables.txt

1. Set the INPUT, FORWARD and OUTPUT packet policies as ACCEPT:

        sudo iptables -P INPUT ACCEPT
        sudo iptables -P FORWARD ACCEPT
        sudo iptables -P OUTPUT ACCEPT

1. Flush the `nat` table that is consulted when a packet that  creates  a  new  connection  is  encountered:

        sudo iptables -t nat -F

1. Flush the `mangle` table that is used for specialized packet alteration:

        sudo iptables -t mangle -F

1. Flush all the chains in the table:

        sudo iptables -F

1. Delete every non-builtin chain in the table:

        sudo iptables -X

    You can now begin rebuilding your firewall rules. See [Control Network Traffic with iptables](https://www.linode.com/docs/security/firewalls/control-network-traffic-with-iptables/) for more instructions.

- You may want to consult the [Reboot Survival Guide](/docs/uptime/reboot-survival-guide/) for steps on preparing a Linode for any future maintenance.

- For information on Linode Manager tools that can assist you in resolving unlikely system accidents and unplanned events, see the [Rescue and Rebuild](/docs/troubleshooting/rescue-and-rebuild/) guide.