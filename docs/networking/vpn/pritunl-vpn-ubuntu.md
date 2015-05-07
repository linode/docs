# Easy VPN Management with Pritunl on Ubuntu.


Pritunl is a very powerful, open source, VPN management panel that uses the OpenVPN standard. This gives it the flexibility, security, and power of OpenVPN, while making it extremely easy to use. This guide will show you how to install, configure, and connect to Pritunl.

## Prerequisites

Have the following items before you begin:

- An up-to-date Linode running Ubuntu 14.04. We suggest you follow our [Getting Started](/docs/getting-started) guide for help configuring your Linode.


- OPTIONAL: A Pritunl License Key to remove all restrictions and nag screens from the software. This can be purchased within the program.

{: .note }
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the sudo command, reference the [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.

## Preparing your Linode

Pritunl is a VPN server. Due to the fact that it uses the OpenVPN standard, we don’t need any special libraries. Everything will get installed automatically.


1.  Update the system:
```
sudo apt-get update && sudo apt-get upgrade
```
2.  Add Pritunl’s APT repository and update the package lists:
```
sudo add-apt-repository -y ppa:pritunl && sudo apt-get update
```

If you have a firewall running on your Linode, add exceptions for Pritunl’s Web UI and server:
```
sudo iptables -A INPUT -p udp- m udp --sport 9700 --dport 1025:65355 -j ACCEPT
sudo iptables -A INPUT -p tcp m tcp --sport 9700 --dport 1025:65355 -j ACCEPT
sudo iptables -A INPUT -p `your protocol here` -m `your protocol here` --sport `your port here` --dport 1025:65355 -j ACCEPT
```

{: .note }
> If you've configured your firewall according to our [Securing Your Server](/docs/security/securing-your-server) guide, be sure to add these port ranges to your `/etc/iptables.firewall.rules` file.

## Install Pritunl

1.  Using apt-get, install python-software-properties and Pritunl

```
sudo apt-get install python-software-properties pritunl
```

2.  Navigate to the install wizard:

Open a web browser on your computer. Navigate to `https://YourLinodeIP:9700`
You will see a screen similar to this:


[![Pritunl DB setup screen](/docs/assets/pritunl-db-setup-resized.png)](/docs/assets/pritunl-db-setup.png)


3.  Connect to the database.

The Installer has already populated the mongoDB uri. If it looks correct, you can just click **Save**.
Alternatively you may enter a any valid MongoDB uri to use as the database for Pritunl.

##Configuring Pritunl

1.  To begin configuration, login with the following information :

**Username:** *pritunl*
**Password:** *pritunl*

2.  You should see a screen similar to this:

[![Pritunl setup screen](/docs/assets/pritunl-setup-resized.png)](/docs/assets/pritunl-setup.png)
3.  Fill out the Initial Setup form shown.

{: .note }
> The SMTP settings are not required and will not do anything without a license.
> If you have a license, Click on the **Upgrade to Premium** button on the upper right, and use the form to enter your license.

4. Next, go to the users tab. Here, you will create your Organizations and users.
Begin by clicking **Add Organization** and entering a name.
Next, click **Add User** and add a user to the organization you just created.


5. Next, head over to the Servers tab. Click **Add server**. You will see a screen like this:
[![Pritunl server setup screen](/docs/assets/pritunl-server-setup-resized.png)](/docs/assets/pritunl-server-setup.png)

If you have a firewall, make sure that the **Port** and **Protocol** fields match what you entered into the rules previously. 
The rest of the configuration is up to you.


6. Finally, click the **Attach Organization** button. Attach the organization to the server. 

##Connecting to the Server

To connect to your server, you can use any OpenVPN compatible client. For Android or iOS, you can use the free **OpenVPN Connect** app available in the [Google Play](https://play.google.com) or [iOS App Store](http://itunes.apple.com). For Linux, there is an official client available for Ubuntu and Arch Linux. Windows and Mac users can use any OpenVPN client. 


To get your keys, you have two options:
Next to your username, there is a Online/Offline indicator. Next to that, there are two buttons. One with a link icon, and another with a download icon.


The download icon will download the keyfiles as a **TAR** file. 
The link icon will display a link that you can give to your users to download their key. These links unique to the user as well as temporary and expire after they have been used or 24 hours. Whichever comes first.