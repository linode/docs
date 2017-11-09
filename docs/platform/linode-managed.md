---
author:
  name: Linode
  email: docs@linode.com
description: How to configure service monitoring with Linode Managed.
keywords: ["linode managed", "service monitoring"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['linode-managed/', 'uptime/linode-managed']
modified: 2014-05-10
modified_by:
  name: Zack Buhman
published: 2013-02-12
title: Linode Managed
---

[Linode Managed](https://www.linode.com/managed/) is a 24/7 incident response service. This robust, multi-homed monitoring system distributes monitoring checks to ensure that your servers remain online and available at all times. Linode Managed can monitor any service or software stack reachable over TCP or HTTP. Once you add a service to Linode Managed, we'll monitor it for connectivity, response, and total request time. This guide shows you how to start monitoring your services with Linode Managed.

## Getting Started

First, you'll need to [sign up for Linode Managed](https://www.linode.com/managed/). Once Linode Managed is enabled for your account, you'll see the **Managed** tab when you log in to the Linode Manager, as shown below. You'll use this interface to interact with Linode Managed and monitor your servers.

[![The Linode Managed interface.](/docs/assets/1198-managed_overview.png)](/docs/assets/1198-managed_overview.png)

1.  **History:** Review the historical availability of your monitored services at a glance. If any of your services were unavailable at any time within the past 10 days, you will see those outages here.
2.  **Monitoring:** Add new services that will be monitored by Linode Managed, and check the status of the services you have already added. You can also edit, temporarily disable, and remove services.
3.  **Contacts:** Add information for individuals that should be contacted when an incident is detected.
4.  **Credentials:** Access Linode's public SSH key to install it on your server, and add the credentials for your monitored services.
5.  **Issues and Notifications:** Open support tickets are displayed here.
6.  **Service Status:** See which of your services are currently up and down.
7.  **Graphs:** Monitor the combined network traffic, CPU usage, and IO operations of all of your Linodes.

### Initial Configuration Checklist

You'll need to perform several of the tasks outlined in this guide to start using Linode Managed:

1.  Verify that your servers are responding to ping ICMP echo requests.
2.  [Install Linode's public SSH key on all of your servers.](#adding-the-public-key)
3.  [Add credentials for the services you want to monitor.](#adding-service-credentials)
4.  [Specify contacts and groups.](#contacts)
5.  [Add services to be monitored.](#adding-a-new-service)

Once you've completed these steps, you'll have successfully configured Linode Managed.

 {{< note >}}
Misconfiguration of Linode Managed could prevent us from properly monitoring your services, resolving incidents when they are detected, or contacting you when an incident is detected.
{{< /note >}}

## Credentials

To take full advantage of Linode Managed, you should upload *credentials* to your server and the Linode Manager website. This will allow our support staff to log in to your servers and access your services when an issue is detected.

### Adding the Public Key

Linode provides a public SSH key that you can add to your server. Install the key, and our support staff will be able to log in to your server as `root` or another user. This is an important component of the Linode Managed service - you should add Linode's public key to all of your servers.

First, copy the public key to your computer's clipboard. Here's how:

1.  Log in to the [Linode Manager](https://manager.linode.com).
2.  Click the **Managed** tab.
3.  Click the **Credentials** tab. The webpage shown below appears.

    [![The Linode Managed credential interface.](/docs/assets/1196-managed_credential3.png)](/docs/assets/1196-managed_credential3.png)

4.  Copy Linode's public key to your clipboard.

Now that you've copied the public key, you need to install it on your server. There are two ways to install the public key: As the `root` user, or as another non-root user.

#### Installing as Root

Installing the public SSH key for the `root` user is the easiest way to add Linode's public key to your server. However, if your server's SSH configuration doesn't allow *root login*, you may want to skip to the next section to add the public key to another user's account.

Here's how to install Linode's SSH key for the `root` user:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#connect-to-your-linode-via-ssh).
2.  Log in as `root` by entering the following command:

        su

    {{< note >}}
If you followed the instructions in the [Securing Your Server](/docs/securing-your-server) guide to disable root login via SSH, you will need to reenable that feature to install the public key for the `root` user. Follow [these instructions](/docs/security/securing-your-server/#ssh-daemon-options) to edit the `sshd_config` file and reenable root login via SSH.
{{< /note >}}

3.  Open the `authorized_keys` file for editing by entering the following command:

        nano /root/.ssh/authorized_keys

4.  Paste Linode's public key in to the file.
5.  Save the changes to the `authorized_keys` file by pressing **Control-X**, and then **Y**.

You have successfully added Linode's public key for the `root` user. Repeat this process on every Linode you want to monitor with Linode Managed.

#### Installing as Another User

You can also install Linode's public SSH key for another non-root user. This allows you to disable SSH *root login* and still allow our support staff to log in to your servers.

Here's how to install Linode's SSH key as a non-root user:

1.  Open a terminal window and [log in to your Linode via SSH](/docs/getting-started#connect-to-your-linode-via-ssh).
2.  If you haven't already created a non-root user on your server, you should do so now. See [Adding a New User](/docs/security/securing-your-server/#add-a-limited-user-account) for instructions. Make sure you add the user to the admin group.
3.  Open the `sudoers` file for editing by entering the following command:

        sudo visudo

4.  Type `i` to enter *insert mode*.
5.  In the *User privilege specification* section of the file, add the following line, replacing `example_user` with your user name:

    {{< file "/etc/sudoers" >}}
User privilege specification example_user ALL=(ALL) NOPASSWD: ALL
{{< /file >}}

6.  Press **Esc** to exit insert mode.
7.  Type `:wq` to save and quit the file.
8.  Add the [Managed public key](/docs/platform/linode-managed/#adding-the-public-key) to the `/home/user/.ssh/authorized_keys` file for this user.
9.  Add this user to the [Account Credentials](/docs/platform/linode-managed/#adding-service-credentials) list.

    {{< note >}}
Make sure this user is not in any groups that are in `/etc/sudoers`, as this may override the passwordless sudo setting.
{{< /note >}}

You have successfully added Linode's public key for the user. Repeat this process on every Linode you want to monitor with Linode Managed.

### Specifying Linode SSH Settings

To allow our support staff to log in to your servers when an issue is detected, you'll need to specify the SSH settings for each of your Linodes. Here's how to add the SSH settings to Linode Managed:

1.  From the **Managed** tab, click the **Linodes** tab. The webpage shown below appears.

    [![The Linode SSH settings interface.](/docs/assets/1301-ssh_settings1.png)](/docs/assets/1301-ssh_settings1.png)

2.  From the **SSH Access** menu, select **Enabled**. If this setting is selected, the Linode Managed team will log in to your server when an issue is detected.
3.  Enter a username in the **SSH User** field. The specified user needs to have Linode's public SSH key installed. For instructions, see [Adding the Public Key](#adding-the-public-key).
4.  From the **SSH IP** menu, select a public IP address that the Linode Managed team can use to reach your Linode via SSH.
5.  In the **SSH Port** field, enter the Linode's SSH port. The default port is 22.
6.  Repeat steps 1-5 for all of your other Linodes.
7.  Click **Update settings** to save your settings.

You have successfully added the SSH settings for your Linodes. The Linode Managed team can now log in to your servers when an issue is detected.

### Adding Service Credentials

Many of the services running on your server can only be accessed with the appropriate username and password combination. To provide Linode's staff with access to those services, you should add *credentials* for the services to Linode Managed. All credentials are securely stored in our encrypted database.

Here's how to add a service credential to Linode Managed:

1.  From the **Managed** tab, click the **Credentials** tab. The webpage shown below appears.

    [![The Linode Managed credential interface.](/docs/assets/1191-managed_credential1.png)](/docs/assets/1191-managed_credential1.png)

2.  Select the **Add an Account Credential** link. The webpage shown below appears.

    [![The Linode Managed credential interface.](/docs/assets/1192-managed_credential2.png)](/docs/assets/1192-managed_credential2.png)

3.  In the **Label** field, enter a descriptive name for the credential. For example, if you are entering the MySQL `root` password, you might enter "MySQL Root".
4.  In the **Optional User Name** field, enter a username for the credential.
5.  In the **Password/Passphrase** field, enter the password or passphrase for the credential.
6.  Click **Save Changes**.

You have successfully added the credential to Linode Managed. You'll select the credential later, when you add a new service to be monitored.

## Contacts

Linode Managed allows you to specify *contacts* that will be contacted if an issue is detected with one of your services. Contacts are categorized in to groups and linked to specific services. The idea is to create separate groups for the administrators responsible for your different services and systems. For example, you could add all of your database administrators to a group called *DBAs* and then link that group to your MySQL service. That way, when Linode Managed detects an issue with MySQL, all of your database administrators will be notified at the same time.

Here's how to add a contact to Linode Managed:

1.  From the **Managed** tab, click the **Contacts** tab. The webpage shown below appears.

    [![The Linode Managed contacts interface.](/docs/assets/1188-managed_contacts1.png)](/docs/assets/1188-managed_contacts1.png)

2.  Select the **Add a Contact** link. The webpage shown below appears.

    [![The Linode Managed contacts interface.](/docs/assets/1190-managed_contacts2-1.png)](/docs/assets/1190-managed_contacts2-1.png)

3.  In the **Name** field, enter the individual's name.
4.  In the **Email** field, enter the individual's email address.
5.  Enter the individual's phone numbers in the **Phone 1** and **Phone 2** fields. We may call the individual if we need additional information to troubleshoot an issue on your servers.
6.  In the **Group** field, enter a group name. As described at the beginning of this section, groups can hold multiple contacts. Ideally, you'll combine all of the individuals responsible for a particular service or system into one group.

    {{< note >}}
This is a required field, so even if you're the only user on the account, you'll still need to create a group for yourself.
{{< /note >}}

7.  Click **Save Changes**.

You have successfully added an contact to Linode Managed. You'll select the contact groups later, when you add a new service to be monitored.

## Services

Linode Managed monitors the *services* running on your Linodes. Setting up services is an essential step in the configuration process - Linode Managed can't monitor anything until you add services to be monitored.

### Adding a New Service

Here's how to add a new service to Linode Managed:

1.  From the **Managed** tab, click the **Monitoring** tab. The webpage shown below appears.

    [![The Linode Managed monitoring interface.](/docs/assets/1184-addservice1-2.png)](/docs/assets/1184-addservice1-2.png)

2.  Select the **Add a Service to Monitor** link. The webpage shown below appears.

    [![Adding a new service to be monitoring.](/docs/assets/1183-addservice2.png)](/docs/assets/1183-addservice2.png)

3.  Enter a label for your service in the **Label** field. Being descriptive will help our team fix the service if it becomes unavailable.
4.  *Optional:* Select a group name from the **Consult with** menu to ensure that Linode can contact you or members of your team if we need help fixing this service.
5.  From the **Monitor Type** menu, select **URL** to monitor a website or **TCP Connection** to monitor a service running on your Linode.
6.  If you selected **URL** from the **Monitor Type** menu, enter a URL in the **URL** field. If you selected **TCP Connection** enter the TCP address and, optionally, a port number in the **TCP** field.
7.  *Optional:* Enter a string in the **Response body match** field to automatically check for the string in the URL or TCP response.
8.  In the **Response timeout** field, enter the time (in seconds) for the request to timeout if it does not receive a response.
9.  In the **Notes** field, add any notes or additional information about this service. The more information we have about the service and how it's configured, the more likely it is that our staff will be able to resolve any issues that may arise.
10. *Optional:* Select this checkbox to indicate that you have [copied Linode's public SSH key to your server](#adding-the-public-key). This step is optional, but highly recommended. If you do not copy our public key to your server, we will not be able to log in and troubleshoot issues.
11. Select a credential from the **Link a Credential** menu. See [these instructions to learn how to add a credential for a service](#adding-service-credentials).

    {{< note >}}
You can select and save more than one credential for a service.
{{< /note >}}

12. Click **Save Changes** to start monitoring the service.

You have successfully added a service to Linode Managed. We'll start monitoring the service in a couple minutes.

### Looking at an Example Service

To help you get started, we've provided an example service monitoring configuration for the Apache web server. In this examine, Linode Managed will continuously monitor the URL provided to verify that the service is responding correctly. This is a great way to monitor the availability of a website.

[![An example Linode Managed service.](/docs/assets/1197-managed_example.png)](/docs/assets/1197-managed_example.png)

Here are the example values:

-   **Label:** We entered a descriptive name for the service ("Apache") instead of something generic, like "Web Server." Make your labels as descriptive and specific as possible so that our support staff can quickly respond to incidents.
-   **Consult with:** This is the group of individuals that will be contacted if an issue is detected with the service. [Click here](#contacts) to learn more about creating contacts and groups.
-   **Monitor type:** We selected *URL* to monitor a website hosted on our server.
-   **URL / TCP Address:** Since we selected *URL*, we entered the IP address of our server, which returns our website. You could also enter a domain name in this field.
-   **Response body match:** Linode Managed will attempt to reach the web server at the IP address we provided earlier, and then it will perform a string match against the value provided in this field. In this case, Linode Managed looks for the string "It works!" - the service check fails if the match fails.
-   **Response timeout:** In this case, the service check fails if a response is not received within 10 seconds.
-   **Notes:** You should provide information about what the service does and suggestions about how we may be able to fix the service.
-   **Credentials:** No credentials are needed for Apache. For services that do require credentials, see [our instructions](#adding-service-credentials) to learn how to add them.

### Temporarily Disabling Service Monitoring

Since Linode Managed continuously monitors your services for availability, you should temporarily disable monitoring for a service that you plan to modify. For example, you should disable monitoring for the Apache web server before modifying the Apache configuration file and restarting the service. Here's how to temporarily disable service monitoring:

1.  From the **Managed** tab, click the **Monitoring** tab.
2.  Find the service that you want to temporarily disable, and then select the **Disable** link. The dashboard will indicate that service's monitoring status is **Disabled**, as shown below.

    [![Adding a new service to be monitoring.](/docs/assets/1186-disableservice1-2.png)](/docs/assets/1186-disableservice1-2.png)

The service is now temporarily disabled. Linode Managed won't resume monitoring this service until you reenable monitoring, as described in the next section.

### Reenabling Disabled Services

When you're finished modifying the service, you'll need to reenable monitoring. Here's how to reenable monitoring for a disabled service:

1.  From the **Managed** tab, click the **Monitoring** tab.
2.  Find the disabled service, and then select the **Enable** link. The dashboard will indicate that the service's status is **Pending**, as shown below.

    [![Adding a new service to be monitoring.](/docs/assets/1187-pending1.png)](/docs/assets/1187-pending1.png)

Linode Managed is now monitoring the service again. The service will be checked in a couple minutes - if it's available, the dashboard will indicate that the service's status is **OK**.

### Removing Services

If you decide to remove or stop using a service on your Linode that is being monitored, you should also remove the service from Linode Managed. For example, you should remove the Apache service from Linode Managed if you decide to start using Linode as a dedicated database server. Here's how to remove services from Linode Managed so that they are no longer monitored:

1.  From the **Managed** tab, click the **Monitoring** tab.
2.  Find the service that you want to remove, and then select the **Remove** link.

Linode Managed has stopped actively monitoring the service.
