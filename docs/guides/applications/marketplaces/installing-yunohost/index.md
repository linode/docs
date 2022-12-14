---
slug: installing-yunohost
author:
  name: Linode Community
  email: docs@linode.com
description: "YunoHost provides an operating system for simplifying self-hosting and server administration. YunoHost can install applications, provision users, control services, and more, and everything is within a straightforward web interface. Learn all you need to install and get started with YunoHost in this tutorial."
og_description: "YunoHost provides an operating system for simplifying self-hosting and server administration. YunoHost can install applications, provision users, control services, and more, and everything is within a straightforward web interface. Learn all you need to install and get started with YunoHost in this tutorial."
keywords: ['yunohost install','yunohost apps','yunohost alternative']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-12-14
modified_by:
  name: Nathaniel Stickman
title: "How to Install and Use YunoHost"
h1_title: "How to Install and Use YunoHost"
contributor:
  name: Nathaniel Stickman
  link: https://github.com/nasanos
external_resources:
- '[YunoHost Documentation](https://yunohost.org/en?q=%2Fdocs)'
- '[TechRepublic: What Is YunoHost, and How Do You Install It?](https://www.techrepublic.com/article/install-yunohost/)'
---

YunoHost is a platform designed to make self-hosting and server administration more accessible and streamlined. With YunoHost, you can set up your server, install applications, administer users, and more, all through a convenient web interface.

This tutorial guides you through installing YunoHost on a base Debian server and outlines the steps to start using your new self-hosting solution.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance running Debian 11 or higher. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Optionally, create a domain name and configure it with the Linode DNS Manager. See our [DNS Manager - Get Started](/docs/products/networking/dns-manager/get-started/) guide for instructions on adding a domain to Linode and using the Linode name servers with the domain registrar.

    Be sure to also add an [A and AAA record](/docs/products/networking/dns-manager/guides/a-record/) pointing to the remote IP address of your Compute Instance.

{{< note >}}
The steps in this guide require root privileges. Be sure to run the steps below as `root`. For more information on privileges, see our [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## What Is YunoHost?

[YunoHost](https://yunohost.org/#/) is technically an operating system, based on Debian. The aim of YunoHost is to simplify the process of self-hosting and administering a Linux server.

One of its most notable features for accomplishing this is a marketplace of open-source applications. With YunoHost, you can conveniently install and manage these applications from a centralized web interface. And YunoHost features single-sign on (SSO), so users can easily move between applications.

The applications available in the YunoHost "marketplace" range from system and development tools to social media and publication platforms.

YunoHost also has numerous other features for server administration beyond installing applications. YunoHost can manage user accounts and includes an full-stack email service. YunoHost can manage your server's SSL certification, and you can monitor and engage with running services and firewalls through its web interface.

### YunoHost vs Cloudron

YunoHost operates similarly to Cloudron, another tool offering an application marketplace and simplifying system administration. So why choose YunoHost over Cloudron?

Both tools promote an open-source ethos, but YunoHost operates on a more totally open-source model. Cloudron offers a free and a premium tier, limiting some features like number of applications and restricting others like email services to the premium tier. YunoHost, by contrast, does not have any feature limits or paid services, operating fully on a libre model.

Cloudron shines for its part in having a more polished and simplified presentation though. The setup for YunoHost can be more complicated, and its interface may not be as clear for some users at the outset.

Linode offers a streamlined Cloudron deployment through the Linode Marketplace, and you can learn more about Cloudron and its deployment process through its [marketplace page](https://www.linode.com/marketplace/apps/cloudron/cloudron/).

## How to Install YunoHost

YunoHost can be installed on a Compute Instance running a base Debian 11 (or higher). You do not need to install any other software or make any other configuration changes. The post-installation script for YunoHost handles everything necessary to configure and secure your server.

1. Connect to your Debian instance as the `root` user. You can do so either through SSH or the Lish console within the Linode Cloud Manager.

1. By default, your system's firewall should be disabled. However, if it is enabled, ensure it allows connections on the HTTPS port (`443`).

    With UFW, the standard tool for managing firewalls on Debian, you can open the port with the following commands:

    ```command
    ufw allow https
    ufw reload
    ```

1. Use the following commands to install YunoHost. The first command ensures that the prerequisite packages are installed. The second executes the YunoHost installation script:

    ```command
    apt install curl ca-certificates
    curl https://install.yunohost.org | bash
    ```

    ```output
    [...]

    [ OK ] YunoHost installation completed !
    ===========================================================================
    You should now proceed with Yunohost post-installation. This is where you will
    be asked for :
      - the main domain of your server ;
      - the administration password.

    You can perform this step :
      - from the command line, by running 'yunohost tools postinstall' as root
      - or from your web browser, by accessing :
        - https://192.0.2.0/ (global IP, if you're on a VPS)

    If this is your first time with YunoHost, it is strongly recommended to take
    time to read the administator documentation and in particular the sections
    'Finalizing your setup' and 'Getting to know YunoHost'. It is available at
    the following URL : https://yunohost.org/admindoc
    ===========================================================================
    ```

1. Complete the post-installation setup as instructed by the output from the installation script. You can do so either from the command line or from your browser.

    {{< note >}}
The YunoHost post-installation setup requires that you provide a domain name. You can bypass purchasing and configuring an actual domain by entering a dummy domain, such as `no.domain`. But be aware that doing so may affect the behavior of some applications.
    {{< /note >}}

    - To complete post-installation via your browser, navigate to the URL indicated in the output of your installation script. This should be an HTTPS address with your system's remote IP address. So, if your system's remote IP address is `192.0.2.0`, you would navigate to `https://192.0.2.0/`.

    Follow along with the prompts to configure your domain name and administrator password for the YunoHost instance.

    ![YunoHost administrator interface for post-installation set up](yunohost-post-install.png)

    - To complete post-installation from the command line, issue the following command on the system, still while logged in as the `root` user:

        ```command
        yunohost tools postinstall
        ```

    You are prompted to enter a domain name for your server and to create an administrator password. The post-installation script then runs through its configuration steps.

        ```output
        Main domain: example.com
        New administration password: ********
        Confirm new administration password: ********

        [...]

        Success! YunoHost is now configured
        Warning: The post-install completed! To finalize your setup, please consider:
            - adding a first user through the 'Users' section of the webadmin (or 'yunohost user create <username>' in command-line);
            - diagnose potential issues through the 'Diagnosis' section of the webadmin (or 'yunohost diagnosis run' in command-line);
            - reading the 'Finalizing your setup' and 'Getting to know YunoHost' parts in the admin documentation: https://yunohost.org/admindoc.
        ```

{{< note >}}
The post-installation setup alters your Linode's SSH configuration. To connect to your Linode via SSH after the setup, use the `admin` user and the password you created during the setup process.

For instance, if your Linode's remote IP address is `192.0.2.0`:

```command
ssh admin@192.0.2.0
```

You can also connect via the domain name you configured during setup, assuming you have configured the DNS for the domain. Using the `example.com` domain from the example above:

``` command
ssh admin@example.com
```

{{< /note >}}

## How to Get Started with YunoHost

With YunoHost installed, you can log into it and start developing your self-hosted server. YunoHost has two interfaces, one for the administrator and one for users. Each is covered below, giving you a sense of what you can do through these interfaces.

To make your server fully operational, you should start by installing an SSL certificate and adding a user. You can find the steps for both of these in the section on the administrator interface below.

### Administrator Interface

The administrator interface is accessible by navigating in a web browser to the `/yunohost/admin` path of your server's addresses. So, with the example above, you could reach the administrator interface by navigating to either:

- `https://192.0.2.0/yunohost/admin`
- `https:/example.com/yunohost/admin`

The interface then requires you to log in using the administrator password you created during the post-installation step above.

Once you have logged into the administrator interface, you have access to tools for managing users, domains, applications, and server processes.

![YunoHost administrator interface after login](yunohost-admin-main.png)

These next few sections walk you through some of the most useful tasks, including deploying an application to the server. The first two tasks covered here, installing an SSL certificate and creating a user, are highly recommended before doing anything else.

#### Installing an SSL Certificate

The YunoHost instance starts with a self-signed certificate. However, most modern web browsers throw a security warning to users visiting any website with self-signed certificates. For that reason, you should start out by retrieving a free certificate signed by Let's Encrypt.

1. Select the **Domains** option from the YunoHost administrator interface main page.

1. Select the entry for the domain name you added during the post-installation setup. In the example above, this was `example.com`.

1. Select the **SSL Certificate** option toward the bottom of this page.

1. Select **Install a Let's Encrypt certificate**, and select **OK** to the prompt to start the installation process.

1. Once the process completes, you should see a confirmation of the successful installation.

![Successful installation of an SSL certificate in the YunoHost administrator interface](yunohost-admin-ssl.png)

#### Create a User

The post-installation setup created administrator credentials for your YunoHost instance. However, YunoHost requires you to create at least one user account for many operations, including installing applications.

Later, such users engage with your installed applications. Each gets an email address automatically. And YunoHost acts as an SSO portal for users to log in once and access many of your applications seamlessly.

1. Select the **Users** option from the YunoHost administrator interface main page.

1. Select **New User** from the upper right of the user page.

1. Input a username, name, and password for the new user. YunoHost automatically creates an email address for the new user based on the username.

    This example creates a user with the username `exampleuser`. The example setup's domain name is `example.com`, so the user creation automatically generates an email address of `exampleuser@example.com` for the new user.

1. Select **Save** to complete the user creation.

![Creating a user from the YunoHost administrator interface](yunohost-admin-user.png)

{{< note >}}
YunoHost includes a full email stack, but be aware that Linode restricts outbound emails for newer Linode accounts. This is in order to prevent spam from being sent from the platform.

Learn more, including how to have the restriction removed, in our blog post [A New Policy to Help Fight Spam](https://www.linode.com/blog/linode/a-new-policy-to-help-fight-spam/).
{{< /note >}}

#### Install an Application

One of the most remarkable functions of YunoHost is its ability to simply install server applications from its web interface. Navigating its marketplace of open-source tools, you can select an application and, within a few clicks, have it running on your server.

1. Select the **Applications** option from the YunoHost administrator interface main page.

1. Select **Install** from the upper right of the applications page.

1. Navigate the list of applications to find one you would like to install. Applications presented with gold stars by their names are considered well-integrated with YunoHost, and these are probably the best applications to start with.

    This example selects the [Mastodon](https://joinmastodon.org/) application, a microblogging platform that is part of the Fediverse. You can find Mastodon in YunoHost under the *Social media* category.

    ![Navigating the social media applications available on YunoHost](yunohost-admin-apps.png)

1. Select the **Install** button from the card of the application you have chosen to install.

1. Adjust the parameters in the installation form to fit your needs. You need to select a user as an administrator for the new application, and for this you can use the user created above.

1. Select **Install** to start the installation process.

    ![Installation progress for an application from YunoHost](yunohost-admin-install-app.png)

1. Once the installation is complete, you can find the application listed on the applications page of your YunoHost administrator interface.

Once your application is installed, it is ready to use. Your YunoHost users automatically have the ability to sign into the new application through the YunoHost user portal. The next section, on the user interface, shows how you can use the portal to access the application you just installed.

### User Portal

With a YunoHost user created, you can now access the user portal. The user portal provides an SSO hub for your users, where they can sign in and navigate to different installed applications.

There are two main ways of accessing the user portal.

- The **User interface** button at the upper right of the administrator interface

- The `/yunohost/sso` path of your server's address, so either `https://192.0.2.0/yunohost/sso` or `https://example.com/yunohost/sso` following the examples above

Most users access the interface through the second option, via the server address.

The portal prompts you for user credentials to log in. Here you can use the credentials you entered where creating the `exampleuser` through the administrator interface.

![The login screen for the YunoHost user portal](yunohost-user-login.png)

Once logged in, you can see a gallery of installed applications. Selecting one of these takes you to the application's interface. And for applications that support the feature, YunoHost uses SSO to automatically log the user in.

![The main page of the YunoHost user portal](yunohost-user-main.png)

Following the application installation example from above, you should see an icon here for the Mastodon application. Selecting this directs you to your Mastodon instance and automatically logs you in as your current YunoHost user,`exampleuser`.

[![A Mastodon instance installed with YunoHost and logged into using SSO](mastodon-yunohost_small.png)](mastodon-yunohost.png)

## Conclusion

YunoHost has much to offer as an interface for simplifying self-hosting and server administration. The features covered here provide you with everything you need to get off to a solid start with YunoHost. And many use cases do not need much else than this.

YunoHost additionally has a suite of documentation and resources to help you push your setup further should you be interested. The YunoHost documentation, linked below, covers administration, application listing, and links to community resources.
