---
slug: install-nagios-on-centos-8
title: "How to Install Nagios on CentOS 8"
description: "Nagios offers a robust server-monitoring system, complete with built-in interface and alert system. Learn how to install Nagios on your CentOS 8 and similar systems."
keywords: ['install nagios centos','nagios centos tutorial','install nagios on rocky linux']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
authors: ['Nathaniel Stickman']
published: 2023-06-21
modified_by:
  name: Linode
external_resources:
- '[Nagios Library: Nagios Core Documentation](https://library.nagios.com/library/products/nagios-core/documentation/)'
- '[Nagios Documentation: Nagios Core 4 Documentation](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/)'
relations:
    platform:
        key: install-nagios-monitoring
        keywords:
            - distribution: CentOS 8
---

[Nagios](https://www.nagios.com/products/nagios-core/) offers a popular and powerful tool for server monitoring. With a built-in dashboard, alert and notification capabilities, and a range of plugins, Nagios can meet most needs.

Learn how to get started with Nagios on CentOS, AlmaLinux, and Rocky Linux in this tutorial. Follow along to install a Nagios instance and start navigating what it has to offer.

## Before You Begin

1. If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/guides/getting-started/) and [Creating a Compute Instance](/docs/guides/creating-a-compute-instance/) guides.

1. Follow our [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

## How to Install Nagios

While Nagios is generally available from most system's package managers, the recommended installation is from source. Installations from package managers tend to have hidden configuration needs, and lack documentation and support.

This tutorial outlines the source installation process.

While the steps in this tutorial focus on CentOS Stream 8, they should also work on AlmaLinux and Rocky Linux.

### Preparing the System

In addition to the steps in the [Before You Begin](/docs/guides/install-nagios-on-centos-8/#before-you-begin) section above, Nagios has a few more installation prerequisites.

1.  First, set SELinux to permissive mode. This limits SELinux to issuing warnings rather than rules enforcement.

    ```command
    sudo sed -i 's/SELINUX=.*/SELINUX=permissive/g' /etc/selinux/config
    ```

    ```command
    sudo setenforce 0
    ```

    Learn more about SELinux in our guides [Getting Started with SELinux on CentOS 8](/docs/guides/a-beginners-guide-to-selinux-on-centos-8/) and [Changing SELinux Modes](/docs/guides/how-to-change-selinux-modes/).

1.  Typically, CentOS and similar RHEL-based systems use Firewalld for managing firewall rules. Use the following commands to open the server's HTTP and HTTPS ports and then reload Firewalld:

    ```command
    sudo firewall-cmd --zone=public --add-service=http --permanent
    sudo firewall-cmd --zone=public --add-service=https --permanent
    sudo firewall-cmd --reload
    ```

    See more on using Firewalld in our guide [Configure a Firewall with Firewalld](/docs/guides/introduction-to-firewalld-on-centos/).

1.  Install the prerequisite packages for the Nagios installation:

    ```command
    sudo dnf install gcc glibc glibc-common make gettext automake autoconf gd gd-devel perl net-snmp net-snmp-utils openssl-devel epel-release wget tar
    ```

    ```command
    sudo dnf --enablerepo=powertools,epel install perl-Net-SNMP
    ```

### Setting Up the LAMP Stack

Nagios uses a LAMP stack for its base application and to serve its monitoring interface. Learn more about LAMP stacks, as well as how to set them up, in our guide [Installing a LAMP Stack on CentOS 8](/docs/guides/how-to-install-a-lamp-stack-on-centos-8/).

However, Nagios only needs to install two parts of the LAMP stack: the Apache Web Server and PHP. The following steps just set up these necessary parts.

1.  Install the Apache Web Server:

    ```command
    sudo dnf install httpd
    ```

1.  Start and enable the Apache Web Server:

    ```command
    sudo systemctl start httpd
    sudo systemctl enable httpd
    ```

1.  Install PHP:

    ```command
    sudo dnf install php php-cli
    ```

### Downloading and Installing Nagios

1.  Download and extract the Nagios Core and Nagios plugins packages. You could go to the [Nagios Core releases page](https://github.com/NagiosEnterprises/nagioscore/releases/latest) and the [Nagios Plugins releases page](https://github.com/nagios-plugins/nagios-plugins/releases/latest) to manually copy the link to the latest packages for each. However, the cURL commands below expedite this, automatically pulling the latest release of each.

    ```command
    cd /tmp
    curl -s https://api.github.com/repos/NagiosEnterprises/nagioscore/releases/latest \
    | grep "browser_download_url.*nagios.*.tar.gz\"" \
    | tail -n 1 \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -O nagios-core.tar.gz -qi -
    curl -s https://api.github.com/repos/nagios-plugins/nagios-plugins/releases/latest \
    | grep "browser_download_url.*nagios-plugins.*.tar.gz\"" \
    | tail -n 1 \
    | cut -d : -f 2,3 \
    | tr -d \" \
    | wget -O nagios-plugins.tar.gz -qi -
    tar xzvf nagios-core.tar.gz
    tar xzvf nagios-plugins.tar.gz
    ```

1.  Change into the Nagios Core directory. You may have to adjust this command depending on the directory the Nagios Core package extracted in the step above.

    ```command
    cd nagios-4.*/
    ```

1.  Compile the Nagios source files:

    ```command
    sudo ./configure
    sudo make all
    ```

1.  Run the script to create the Nagios user and user group and add the `apache` group to the `nagios` user:

    ```command
    sudo make install-groups-users
    sudo usermod -aG nagios apache
    ```

1.  Install Nagios from the compiled files:

    ```command
    sudo make install
    ```

1.  Install the Nagios service, command mode, and default configurations. The last command restarts the Apache service for its configuration changes to take effect.

    ```command
    sudo make install-daemoninit
    sudo make install-commandmode
    sudo make install-config
    sudo make install-webconf
    sudo systemctl restart httpd
    ```

1.  Add the `nagiosadmin` user account via `htpasswd`. Running this command prompts you to create a password for the new user account. This is the user you use to log into the Nagios interface.

    ```command
    sudo htpasswd -c /usr/local/nagios/etc/htpasswd.users nagiosadmin
    ```

1.  Start up and enable the Nagios service:

    ```command
    sudo systemctl start nagios
    sudo systemctl enable nagios
    ```

1.  Change into the directory for the Nagios plugins:

    ```command
    cd /tmp/nagios-plugins-*/
    ```

1.  Compile and install the Nagios plugins:

    ```command
    sudo ./configure
    sudo make
    sudo make install
    ```

## How to Start Using Nagios

With the new Nagios instance installed and running, access the Nagios interface from a web browser. Navigate to the path `/nagios` on your system's public IP address or configured domain.

For example, if your public IP is `192.0.2.0`, then you would navigate to `http://192.0.2.0/nagios`. Alternatively, if your domain name is `example.com`, you would navigate to `example.com/nagios`.

{{< note >}}
Learn more about setting up a domain name for your system through the Linode DNS Manager with our guide [DNS Manager - Get Started](/docs/products/networking/dns-manager/get-started/). While other DNS managers can set up a domain name, Linode's provides added convenience. Regardless, this guide can serve as a general introduction to the process.
{{< /note >}}

The browser should prompt for a login. Use the `nagiosadmin` username and the password configured with the `htpasswd` command above. Once logged in, you should arrive at the Nagios dashboard:

[![Nagios monitoring dashboard](nagios-dashboard_small.png)](nagios-dashboard.png)

The interface provides access to a wide range of monitoring tasks. Get an overview of hosts monitored by your Nagios instance on the **Hosts** page:

[![Nagios dashboard listing monitored hosts](nagios-hosts_small.png)](nagios-hosts.png)

At present, this only has one host, `localhost`. More hosts can be added, either by setting up Nagios to [monitor publicly-available services](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/monitoring-publicservices.html) or setting up [NRPE](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/monitoring-linux.html).

Another useful page to start out with is **Services**, which shows the services running for all hosts that Nagios is monitoring:

[![Nagios dashboard listing monitored services](nagios-services_small.png)](nagios-services.png)

## Conclusion

Now you have your own Nagios instance running. Exploring the dashboard's myriad options can provide a good idea of Nagios's capabilities. Take a look at the Nagios Core documentation linked below to continue exploring and make the most out of your instance.