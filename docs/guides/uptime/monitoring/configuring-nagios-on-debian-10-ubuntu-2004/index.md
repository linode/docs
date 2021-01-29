---
slug: configuring-nagios-on-debian-10-ubuntu-2004
author:
  name: Linode Community
  email: docs@linode.com
description: 'In this guide, learn how to configure email alerts and IRC status updates for Nagios. Nagios is a popular server monitoring tool, and these instructions help you get more out of it on both Debian 10 and Ubuntu 20.04.'
og_description: 'In this guide, learn how to configure email alerts and IRC status updates for Nagios. Nagios is a popular server monitoring tool, and these instructions help you get more out of it on both Debian 10 and Ubuntu 20.04.'
keywords: ['nagios','monitoring','debian 10','ubuntu 20.04']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-01-28
modified_by:
  name: Linode
title: "Configuring Nagios Alerts on Debian 10 and Ubuntu 20.04"
h1_title: "Configuring Nagios Alerts on Debian 10 and Ubuntu 20.04"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[Van Heusden: nagircbot](https://www.vanheusden.com/nagircbot/)'
relations:
    platform:
        key: configure-nagios
        keywords:
            - distribution: Debian 10 & Ubuntu 20.04
---

[Nagios](https://www.nagios.com/products/nagios-core/), a popular tool for monitoring servers, comes with a robust web interface to help you effectively manage your server. Its dashboard makes it relatively easy to check in on the hosts and services running on your machine and quickly apprise yourself of any issues.

However, you can get even more out of Nagios by setting it up to deliver alerts and notifications when you need them. This guide provides instructions for setting up email alerts from Nagios and configuring regular status updates via *Internet Relay Chat* (IRC).

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started/) guide, and complete the steps for setting your Linode's hostname and timezone.

1.  This guide uses `sudo` wherever possible. Complete the sections of our article on [Securing Your Server](/docs/security/securing-your-server/) to create a standard user account, harden SSH access, and remove unnecessary network services.

1. Install and configure Nagios. Follow the steps in the [Install Nagios 4 on Ubuntu and Debian 8](/docs/guides/install-nagios-4-on-ubuntu-debian-8/) guide, selecting the most appropriate distribution for you from the dropdown.

    Alternatively, the official Nagios [installation guide](https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html) provides steps for installing Nagios from source code on a wide range of Linux distributions.

1.  Update your system:

        sudo apt update && sudo apt upgrade

1. Replace `example.com` throughout this guide with your machine's domain name, and replace `fqdn.example.com` with your machine's fully qualified domain name (FQDN).

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/tools-reference/linux-users-and-groups/) guide.
{{< /note >}}

## Set Up Nagios Email Alerts

{{< content "email-warning-shortguide" >}}

{{< note >}}
This guide also provides instructions for configuring local emails, which are not subject to the above restriction. Under this configuration, emails are only delivered to users on the same machine as Nagios.
{{< /note >}}

### Install Email Services

1. Install packages for handling emails:

        sudo apt install mailutils postfix

    You should be prompted for information about your mail server configuration. If you are not or if you need to re-enter the information, you can run the following command after the installation has finished:

        sudo dpkg-reconfigure postfix

    Select **Internet Site**.

    ![Postfix configuration type](postfix-config-type.png "Postfix configuration type")

    Enter the domain name to be used for your email addresses. This may be either your machine's fully qualified domain name (FQDN) or base domain name. It can be `localhost` if you are configuring Postfix for local emails only.

    ![Postfix system mail name](postfix-system-mail-name.png "Postfix system mail name")

    Provide the username of your primary user on the machine.

    ![Entering primary user for Postfix](postfix-primary-user.png "Entering primary user for Postfix")

    When prompted for destinations for which to accept mail, you can leave the field blank to only accept emails directed to the system mail name. If you have a domain name configured and want to ensure that emails are accepted for a wider range of domains, you can enter the following: `localhost, example.com, fqdn.example.com, mail.example.com, localhost.example.com`.

    ![Postfix accepted destinations](postfix-accepted-destinations.png "Postfix accepted destinations")

    Use the default values on the remaining steps. Choose **No** to synchronous updates. Enter `127.0.0.0/8 [::ffff:127.0.0.0]/104 [::1]/128` for local network, `0` for the mailbox limit, and `+` for the local inbox extension character. Select **all** for the Internet protocols.

    You can, alternatively, follow the [Configure Postfix to Send Email Using External SMTP Servers](/docs/guides/postfix-smtp-debian7/) or the [Configure Postfix to Send Mail Using Gmail and Google Apps on Debian or Ubuntu](/docs/guides/configure-postfix-to-send-mail-using-gmail-and-google-apps-on-debian-or-ubuntu/) guide. Doing so sets up Postfix to send emails via an external SMTP provider or a Gmail account, respectively.

1. Test the email configuration with the following command; replace `example-user` with the username of a local user that you can log in as:

        echo "Body of the test email." | mail -s "Test Email" example-user@localhost

    Log in as `example-user`, and run the `mail` command. Verify that the user received the test email.

    You can use a similar command as the one above to test outbound emails. Replace `example-user@localhost` with an external email address to which you have access.

### Configure Nagios

1. Using your preferred text editor, open the Nagios commands configuration file, located at `/etc/nagios4/objects/commands.cfg`. Identify the command definitions for `notify-host-by-email` and `notify-service-by-email`. For each, verify that the location of the `mail` binary is `/usr/bin/mail`, as in the following example:

    {{< file "/etc/nagios4/objects/commands.cfg" >}}
# 'notify-host-by-email' command definition
define command{
        command_name    notify-host-by-email
        command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\nHost: $HOSTNAME$\nState: $HOSTSTATE$\nAddress: $HOSTADDRESS$\nInfo: $HOSTOUTPUT$\n\nDate/Time: $LONGDATETIME$\n" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Host Alert: $HOSTNAME$ is $HOSTSTATE$ **" $CONTACTEMAIL$
        }

# 'notify-service-by-email' command definition
define command{
        command_name    notify-service-by-email
        command_line    /usr/bin/printf "%b" "***** Nagios *****\n\nNotification Type: $NOTIFICATIONTYPE$\n\nService: $SERVICEDESC$\nHost: $HOSTALIAS$\nAddress: $HOSTADDRESS$\nState: $SERVICESTATE$\n\nDate/Time: $LONGDATETIME$\n\nAdditional Info:\n\n$SERVICEOUTPUT$\n" | /usr/bin/mail -s "** $NOTIFICATIONTYPE$ Service Alert: $HOSTALIAS$/$SERVICEDESC$ is $SERVICESTATE$ **" $CONTACTEMAIL$
        }
    {{< /file >}}

1. Open the Nagios contacts configuration file, located at `/etc/nagios4/objects/contacts.cfg`. Identify the `nagiosadmin` contact definition, and, in the email field, enter the email address at which you would like to receive Nagios notifications.

    You can configure Nagios to send notifications to a local mailbox using `example-user@localhost`, where `example-user` is the local user you want to receive Nagios alerts.

1. Open the Nagios templates configuration file, located at `/etc/nagios/objects/templates.cfg`. Identify the `generic-host` host definition, and ensure that it has the following line:

    {{< file "/etc/nagios4/objects/templates.cfg" >}}
contact_groups      admins
    {{< /file >}}

    Likewise, identify the `generic-service` service definition, and ensure that the same line is present.

1. Restart the Nagios service:

        sudo systemctl restart nagios4
### Test Nagios Email Alerts

You can use the following steps to verify that Nagios is delivering alerts by email.

1. In a web browser, navigate to your Nagios interface, and log in as the `nagiosadmin` user.

1. Select **Services** from the menu on the left, and select any of the services for which notifications are not disabled.

1. Choose the **Send custom service notification** option from the **Service Commands** menu on the right. Enter a comment, and select **Commit**.

1. Check the email inbox that you configured Nagios to send notifications to, and verify that you received your custom notification.

    If your Nagios alerts are sent to a local user, log in as that user, and use the `mail` command to check the user's inbox.

## Set Up Nagios IRC Alerts

This guide uses [NagIRCBot](https://www.vanheusden.com/nagircbot/), an application designed to routinely read Nagios's status information and post updates to an Internet Relay Chat (IRC) channel.

### Build and Install NagIRCBot

1. Install the requisites for building NagIRCBot:

        sudo apt install build-essential libssl-dev

1. Navigate to the NagIRCBot [release page](https://www.vanheusden.com/nagircbot/), and identify the latest version. Replace `0.0.33` in the following examples with the version you find.

1. In the `/opt` directory, download the package containing the files needed to build the bot; extract the files, and change into the resulting directory:

        cd /opt
        sudo wget http://www.vanheusden.com/nagircbot/nagircbot-0.0.33.tgz
        sudo tar -zxvf /opt/nagircbot-0.0.33.tgz
        cd nagircbot-0.0.33

1. Build the NagIRCBot application:

        sudo make
        sudo make install

### Run and Test NagIRCBot

1. Use a version of the following command to start NagIRCBot:

        sudo nagircbot -f /var/lib/nagios4/status.dat -s irc.example.com:6667 -c \#example-channel -C -n nagircbot -u nagircbot-username -U NagIRCBot-Name -I 900

    Replace `irc.example.com` with the hostname of the IRC network or `localhost` for a local IRC network. Replace `nagircbot`, `nagircbot-username`, and `NagIRCBot-Name` with the nickname, username, and real name, respectively, to be used for the bot. Replace `nagios-status` with the name of the channel to which the bot posts its status updates. Change the `900` as needed; it defines how frequently, in seconds, the bot checks and sends Nagios status information.

1. Connect to the IRC channel, and verify that you are receiving status updates at the expected interval.

1. By default, NagIRCBot must be re-initiated using the command described above after each system reboot. Refer to the [Use systemd to Start a Linux Service at Boot](/docs/guides/start-service-at-boot/) or the [Schedule Tasks with Cron](/docs/guides/schedule-tasks-with-cron/) guide for instructions on how to schedule tasks to run automatically.

