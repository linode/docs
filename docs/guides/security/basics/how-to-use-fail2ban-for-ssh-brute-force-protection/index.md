---
slug: how-to-use-fail2ban-for-ssh-brute-force-protection
description: "Fail2Ban is an intrusion prevention framework that protects Linux systems and servers from brute-force attacks. Learn how it can do the same for SSH."
keywords: ["using fail2ban for SSH brute-force protection", "brute-force protection with fail2ban"]
tags: ["monitoring","security"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2020-10-13
modified_by:
  name: Linode
published: 2020-10-13
title: "Using Fail2Ban for SSH Brute-force Protection"
title_meta: "How to Use Fail2Ban for SSH Brute-force Protection"
image: fail2ban_bruteforceprotection.png
aliases: ['/security/basics/how-to-use-fail2ban-for-ssh-brute-force-protection/']
authors: ["Hackersploit"]
---

Fail2Ban is an intrusion prevention framework written in Python that protects Linux systems and servers from brute-force attacks. You can setup Fail2Ban to provide brute-force protection for SSH on your server. This ensures that your server is secure from brute-force attacks. It also allows you to monitor the strength of the attacks in regards to the number of authentication attempts that are being made.

Brute-force attacks can be extremely powerful and may result in thousands of failed authentication attempts per day. It is therefore vital to understand how to protect your server from these attacks and how to block IP addresses. Fail2Ban allows you to automate the process of blocking brute-force attacks by limiting the number of failed authentication attempts a user can make before being blocked. This is extremely useful for servers that have user accounts that utilize passwords for remote authentication as opposed to SSH key-pair authentication.

## Before You Begin

{{< note respectIndent=false >}}
This guide uses Ubuntu, but the commands are similar for other systems.
{{< /note >}}

1.  Complete the [Getting Started](/docs/products/platform/get-started/) guide.

1.  Follow the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to create a standard user account, and harden SSH access, but do not create a basic firewall.

1.  Log into your Linode via SSH and update and upgrade.

        sudo apt update && sudo apt upgrade

{{< note respectIndent=false >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## Installing And Configuring Fail2Ban

Fail2Ban is free to use and can be installed through most of the popular package managers.

1.  Install Fail2Ban by running the following command:

        sudo apt-get install fail2ban

1.  To ensure that Fail2ban runs on system startup, use the following command:

        sudo systemctl enable fail2ban.service

After the installation is complete, you can begin configuring Fail2Ban to set up a jail for your SSH server. The Fail2Ban configuration files are located in the `/etc/fail2ban` directory, as shown in the output below.

{{< output >}}
/etc/fail2ban$ ls -alps
total 68
 4 drwxr-xr-x  6 root root  4096 Oct 12 18:21 ./
 4 drwxr-xr-x 94 root root  4096 Oct 12 18:21 ../
 4 drwxr-xr-x  2 root root  4096 Oct 12 18:21 action.d/
 4 -rw-r--r--  1 root root  2334 Jan 18  2018 fail2ban.conf
 4 drwxr-xr-x  2 root root  4096 Apr  4  2018 fail2ban.d/
 4 drwxr-xr-x  3 root root  4096 Oct 12 18:21 filter.d/
24 -rw-r--r--  1 root root 22897 Jan 18  2018 jail.conf
 4 drwxr-xr-x  2 root root  4096 Oct 12 18:21 jail.d/
 4 -rw-r--r--  1 root root   645 Jan 18  2018 paths-arch.conf
 4 -rw-r--r--  1 root root  2827 Jan 18  2018 paths-common.conf
 4 -rw-r--r--  1 root root   573 Jan 18  2018 paths-debian.conf
 4 -rw-r--r--  1 root root   738 Jan 18  2018 paths-opensuse.conf
{{</ output >}}

Fail2Ban uses the default configuration in the `jail.conf` file. However, it is not recommended to use the default configuration files as they can be overwritten by newer updates to the Fail2Ban package. The preferred approach to creating configurations for a particular service is by creating a new configuration file in the `/etc/fail2ban` directory with the `.local` extension.

{{< note respectIndent=false >}}
A Fail2ban jail is a configuration file that contains filters or arguments that protect your system or a particular service
{{< /note >}}

## Creating SSH Jails With Fail2Ban

1.  Begin by creating a new file within the same directory called `jail.local`. You can then add the necessary security configurations for the sshd jail.

        sudo nano /etc/fail2ban/jail.local

1.  You can explore the options that Fail2Ban provides to customize the security and blocking of the SSH service.

    Fail2Ban Configuration Options:

    | Configurations | Function |
    |----------------|----------|
    | enabled | Jail status (true/false) - This enables or disables the jail |
    | port | Port specification |
    | filter | Service specific filter (Log filter) |
    | logpath | What log to use |
    | maxretry | Number of attempts to make before a ban |
    | findtime | Amount of time between failed login attempts |
    | bantime | Number of seconds an IP is banned for |
    | ignoreip | IP to be allowed |

1.  With the information in table above you can create the `jail.local` configuration for OpenSSH server (sshd). Once you have entered the configuration options, the values used in this guide example are listed in the sample file below.

    {{< note respectIndent=false >}}
You can customize the Fail2Ban configuration options and values as per your security requirements.
{{< /note >}}

    {{< file "/etc/fail2ban/jail.local" >}}
[sshd]
enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
findtime = 300
bantime = 3600
ignoreip = 127.0.0.1
{{</ file >}}

    {{< note respectIndent=false >}}
You can disable a Fail2Ban jail by setting the enabled configuration to false
{{< /note >}}

1.  After you have specified the configuration options and their respective values, save the file and restart the Fail2Ban service with the following command:

        sudo systemctl restart fail2ban.service

1.  After restarting the OpenSSH server service, Fail2Ban uses this new configuration and the jail for the sshd service is activated and runs.

1.  You can now test this functionality by re-enabling `PasswordAuthentication` in the OpenSSH Configuration file found in `/etc/ssh/sshd_config`. Do this by changing the value from `no` to `yes` using the text editor of your choice. Make sure these lines are uncommented.

    {{< file "/etc/ssh/sshd_config" >}}
#To disable tunneled clear text passwords, change to no here!
PasswordAuthentication yes
PermitEmptyPasswords no
{{</ file >}}

    This allows users to use passwords for authentication in addition to SSH key-pairs. Fail2Ban automatically detects brute-force attempts on SSH and blocks the users automatically. This greatly improves the security of both password based authentication and the server and is useful for user accounts that do not have administrator privileges.

## Testing Fail2Ban

1.  To test this, create a new user account, let's call it `dev`.

1.  Attempt to log into the `dev` account with an incorrect password three times.

1.  After three failed attempts you are blocked from authentication for an hour.

    {{< output >}}
ssh dev@192.168.1.107
dev@192.168.1.107's password:
Permission denied, please try again.
dev@192.168.1.107's password:
Permission denied, please try again.
dev@192.168.1.107's password:
dev@192.168.1.107: Permission denied (publickey,password).
ssh dev@192.168.1.107
dev@192.168.1.107's password:
Permission denied, please try again.
dev@192.168.1.107's password:
Connection closed by 192.168.1.107 port 22
sh dev@192.168.1.107
ssh: connect to host 192.168.1.107 port 22: Connection refused
{{</ output >}}

    As you can see in the output above, after three consecutive failed attempts, Fail2Ban actively blocks the SSH connection. After three consecutive failed attempts the connection times out and the user is blocked for the specified time. If you try connecting again within the blocked period, you get a “Connection refused” error and are not able to establish an SSH connection to the server.

    This demonstrates the power and robust nature of Fail2Ban and how it can be used to create elegant and effective firewalls for services like SSH. You can customize your service jails to meet your security requirements and easily implement new configuration options.

1.  After implementing and testing Fail2Ban you can now take a look at how to monitor and analyze the various failed authentication attempts and blocked IP’s with the Fail2Ban-client.

## Monitoring With Fail2Ban-Client

One of Fail2Ban's greatest advantages is that it allows you to actively monitor all the failed authentication attempts and the various IP addresses that have been blocked. This information helps you understand the scale of attacks you are facing and the geolocation of the attacks by analyzing the origins of the IP addresses.

1.  You can use the Fail2Ban-client tool to check the status of Fail2Ban and the active jails. This can be done by running the following command:

        sudo fail2ban-client status

    {{< output >}}
Status
|- Number of jail:	1
`- Jail list:	sshd
{{</ output >}}

    As shown in the output above, the active jail list is displayed with the names of the respective jails. In the case above you can see that the sshd jail is active.

1.  To view the status and information regarding a particular jail like sshd, you can use the following command:

        sudo fail2ban-client status sshd

    {{< output >}}
Status for the jail: sshd
|- Filter
|  |- Currently failed:	1
|  |- Total failed:	4
|  `- File list:	/var/log/auth.log
`- Actions
   |- Currently banned:	1
   |- Total banned:	1
   `- Banned IP list:	192.168.1.101
{{</ output >}}

    The output above shows you the status and information regarding the sshd jail. You can see that you have four total failed authentication attempts and one banned IP address. This is helpful as it can alert you to potential targeted attacks.

You have successfully been able to set up, implement, test, and analyze Fail2Ban for brute-force protection. You have completed setting up your remote authentication security.

## Next Steps

For more detailed information on Fail2Ban, including setting up email alerts and writing regular expressions to filter and parse log files, see the [Using Fail2ban to Secure Your Server - A Tutorial](/docs/products/compute/compute-instances/guides/set-up-and-secure/#use-fail2ban-for-ssh-login-protection) guide.
