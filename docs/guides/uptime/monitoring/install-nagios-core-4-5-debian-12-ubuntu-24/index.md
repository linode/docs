---
slug: nagios-monitoring-debian-ubuntu
title: "Install Nagios Core on Debian 12 and Ubuntu 22.04"
description: "This guide walks you through installing and configuring Nagios Core Debian 12 and Ubuntu 22.04 to monitor system resources and services."
authors: ["D Hoober"]
contributors: ["D Hoober"]
published: 2025-08-31
keywords: ['nagios', 'nagios Core','monitoring','debian 12','ubuntu 22.04', "server health", "nagios plugins']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Nagios Core Documentation](https://assets.nagios.com/downloads/nagioscore/docs/nagioscore/4/en/index.html)'
- '[Nagios Plugins](https://nagios-plugins.org/)'
- '[Nagios Installation Guide](https://support.nagios.com/kb/article/nagios-core-installing-nagios-core-from-source-96.html)'

relations:
    platform:
        key: install-nagios-monitoring
        keywords:
            - distribution: Debian 12 & Ubuntu 22.04
---

Nagios is an open-source monitoring tool widely used for tracking server uptime, service health, and infrastructure performance, with status reporting through a web interface.

This guide covers installation of Nagios Core 4, including updated packages, authentication practices, and contributor-friendly formatting on an Akamai Compute Instance (formerly Linode) running Debian or Ubuntu. If you are replacing another monitoring tool, see the instructions in the [**Before You Begin** section below](#before-you-begin). Configuration files define what is monitored and when alerts are triggered.

On Debian 12 and Ubuntu 22.04, the Nagios dashboard is typically accessible at `http://<your-server-ip>/nagios4`. Older systems may use `/nagios` instead. This guide assumes the default path used by the `nagios4` package.

## Before You Begin

You should have:

- An Akamai Compute Instance (formerly Linode) running Debian 12 or Ubuntu 22.04
- A non-root user with `sudo` privileges
- LAMP stack installed (Linux, Apache, MariaDB/MySQL, PHP). Install and configure a LAMP (Linux, Apache, MySQL, and PHP) stack.
    [How to Install and Configure a LAMP Stack](https://techdocs.akamai.com/get-started-cloud-computing/docs/install-lamp-api)
- Firewall configured to allow HTTP/HTTPS access

If you are switching from another monitoring system (e.g., Zabbix, Prometheus, Icinga), prior to installation:

- **Stop and disable the previous service**: Use `systemctl stop` and `systemctl disable` to prevent conflicts.
- **Remove conflicting packages**: Check for overlapping plugins or agents that may interfere with Nagios.
- **Clean up legacy configuration files**: Look in `/etc/`, `/usr/local/`, and `/var/log/` for residual files from previous tools.
- **Review firewall and port settings**: Nagios may require different ports than your previous tool (e.g., 5666, 80/443).
- **Backup any relevant data**: If you're migrating alerts or host definitions, preserve what you need before uninstalling.

## System Preparation

Update your system:

    sudo apt update && sudo apt upgrade -y

Install the required packages for Apache, MariaDB, and PHP:

    sudo apt install apache2 mariadb-server php libapache2-mod-php php-mysql -y

## Create Nagios User and Group

 Creating a dedicated `nagios` user and `nagcmd` user group ensures that Nagios runs securely and can execute commands via the web interface:

    sudo useradd nagios
    sudo groupadd nagcmd

Add the user and Apache2 user to the `nagcmd` user group:

    sudo usermod -aG nagcmd nagios && sudo usermod -aG nagcmd www-data

## Install Nagios and Plugins

You can use a one-liner install:

    sudo apt install nagios4 nagios-plugins-contrib monitoring-plugins nagios-nrpe-plugin -y

If it fails, look for clues in the terminal output:

    apt search nagios

- Missing package: One of the listed packages may not be available in your distro's repositories.

Or any of these common issues:

- Permission issues: If you're not using `sudo`, you might see permission denied.
- Network: A broken internet connection or unreachable mirror can cause download failures.
- Broken dependencies: If your system has conflicting packages or unmet dependencies, `apt` will usually suggest a fix. Then isolate the problem by installing packages one at a time:
    sudo apt install nagios4
    sudo apt install nagios-plugins-contrib
    sudo apt install monitoring-plugins
    sudo apt install nagios-nrpe-plugin
Then you can tell which package is causing issues.

## Configure Apache Authentication

Nagios authentication can be configured at varying levels of complexity. Use the basic setup shown below, and move on to the advanced configuration if you find your environment requires group-based access, IPv6 support or broader directory matching.

This configuration enforces dual-layer access control for Nagios: users must authenticate via Digest credentials and originate from explicitly allowed IP addresses. The `cmd.cgi` block restricts command execution to authenticated users--by default, only `nagiosadmin` user you'll create below--ensuring that system-level actions are gated by both identity and network trust. Changes to the `<Files>` section further ensure only users with explicit permissions can send commands via the Nagios interface.

1. Create A Digest-authenticated user

    Using the `-c ` flag creates the file if it doesn't exist.

        sudo htdigest -c /etc/nagios4/htdigest.users "Nagios4" nagiosadmin

1. Update Apache Configuration

    Open `/etc/nagios4/apache2/conf` in your preferred editor and make the following changes:

        Inside `<DirectoryMatch>` block:

1. Comment out the IP-based access line (optional if using firewall rules):

        #Require ip ::1/128 fc00::/7 fe80::/10 10.0.0.0/8 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.168.0.0.16

    IP filtering is often handled at the network level. This line can be commented out unless you're relying solely on Apache for access control.

1. Simplified Access Control for `cmd.cgi`

    This configuration enforces authentication and IP-based filtering for the Nagios command interface using a streamlined `<Files "cmd.cgi">` block. It's designed for clarity and ease of setup, especially for contributors who don't need group-based access or multi-realm authentication.

    Edit /etc/nagios4/apache2.conf:

    <Files "cmd.cgi">

        AuthType Digest
        AuthName "Nagios4"
        AuthDigestProvider file
        AuthUserFile "/etc/nagios4/htdigest.users"
        Require valid-user
        Allow from 127.0.0.1 <your-trusted-ip>
    </Files>

    {{< caution >}}

    Replace <your-trusted-ip> with your actual IP address. Avoid hardcoding contributor IPs in PRs.

    {{< /caution >}}

    For advanced scenarios--such as managing access by user groups, supporting IPv6 ranges, or customizing multiple directory paths--refer to the full [Advanced Apache](#advanced-apache-configuration) configuration example below.

1. Enable Apache Modules and Restart

    Enable require modules:

        sudo a2enmod rewrite cgi auth_digest authz_groupfile

1. Restart Apache:

        sudo systemctl restart apache2

## Advanced Apache Configuration

Use this version if you need group-based access, IPv6 support, and broader directory matching across multiple Nagios paths.

1. Update `<DirectoryMatch>` Block

    <DirectoryMatch (/usr/share/nagios4/htdocs|/usr/lib/cgi-bin/nagios4|/etc/nagios4/stylesheets)>

        #Require ip ::1/128 fc00::/7 fe80::/10 10.0.0.0/8 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.168.0.0/16
        <Files "cmd.cgi">
            AuthDigestDomain "Nagios4"
            AuthDigestProvider file
            AuthUserFile "/etc/nagios4/htdigest.users"
            AuthGroupFile "/etc/group"
            AuthName "Nagios4"
            AuthType Digest
            Allow from 127.0.0.1 198.51.100.0
            #Require all granted
            Require valid-user
        </Files>
    </DirectoryMatch>

    {{< note >}}

    Replace `198.51.100.0` with the IP address(es) you trust. You can find your current IP by running `who` or checking your SSH session details.

    {{< /note>}}

1. Enable Nagios CGI Authentication

    Open `/etc/nagios4/cgi.cfg`, and set:

        use-authentication=1

1. Enable Apache Modules and Restart

        sudo a2enmod rewrite

        sudo a2enmod cgi

        sudo a2enmod auth_digest

        sudo a2enmod authz_groupfile

    {{< note>}}

Restart the Apache service to apply changes:

    sudo systemctl restart apache2

{{< /note >}}

## Monitor Hosts and Services

- Use the left sidebar in Nagios to view Hosts and Services.
- Add new hosts by editing files in `/etc/nagios4/conf.d/`.
- Restart Nagios after changes:

        sudo systemctl restart nagios4

## Access Nagios

1. After installation, navigate to your Nagios dashboard by opening a browser and visiting:

    http://<your-server-ip>/nagios4

    {{< note >}}

    On Debian 12 and Ubuntu 22.04, the default path is `/nagios4`.
    If you're referencing older guides or maintaining legacy systems, the path may be `/nagios`.

    {{< /note >}}

    You'll be prompted to log in using the credentials set during installation.

1. After logging into the Nagios web interface above, you can view system status by navigating to:

    /nagios/cgi-bin/status.cgi

    This endpoint powers the **Host and Service Overview**, showing real-time health for all configured hosts and services.

    {{< note >}}

    In the left-hand menu, look for **Host Detail** or **Service Detail** to access this view directly.

    {{< /note >}}

1. To explore more detailed metrics or troubleshoot specific alerts:

    - Use the **Service Detail** view to inspect individual service checks, including last check time, status output, and retry attempts.
    - Click on any host name in the **Host Detail** view to drill down to associated services, notifications, and performance graphs (if enabled).

1. If you've configured email notifications or escalation policies, you can verify their status under:

    /nagios/cgi-bin/extinfo.cgi?type=3

    This endpoint displays *Notification Commands* and *Contact Groups*, helping you confirm that alerts are routed correctly.

    {{< note >}}

    For security, ensure your Nagios dashboard is only accessible over a secure connection (HTTPS) and protected by strong credentials. Consider restricting access via firewall rules or VPN.

    {{< /note >}}

1. Verify Installation

    After confirming the web interface loads at

    - `systemctl status nagios4` to confirm the service is running
    - `tail -n 20 /var/log/nagios4/nagios.log` to check recent activity
    - `nagios4 -v /etc/nagios4/nagios.cfg` to validate config syntax

    A clean output looks like:

        Total Warnings: 0
        Total Errors: 0

    {{< note >}}

    If you see errors, Nagios will point to the specific file and line number. Fix those before restarting the service.

    {{< /note >}}

## Next Steps

- Explore [Nagios plugins](https://nagios-plugins.org/)
- Configure [email alerts](https://support.nagios.com/kb/article/how-to-configure-email-notifications-in-nagios-xi-1036.html) via mailutils or msmtp
- Set up remote monitoring with [NRPE or SNMP](https://www.thomas-krenn.com/en/wiki/Icinga_NRPE_Plugin_how-to)
- Consider integrating with [Deploy Prometheus and Grafana through the Linode Marketplace](https://www.linode.com/docs/marketplace-docs/guides/prometheus-grafana/) for visualization

## Contributor Notes

- This guide installs Nagios using distro packages for stability and ease of maintenance. For source builds or advanced tuning, refer to [Nagios Core Docs](https://library.nagios.com/products/nagios-core/documentation/).
- Apache config uses Digest auth for improved security over Basic; contributors integrating with SSO or reverse proxies may adapt this as needed.
- Replace hardcoded IP addresses with variables or placeholders (`$HOST_IP`, `$MONITOR_IP`) when adapting for templated onboarding or automation.
- YAML metadata follows [Akamai Docs standards](https://www.linode.com/docs/guides/writing-for-linode/) for consistency and contributor clarity; `aliases` preserve SEO continuity and support legacy redirects.
