---
slug: nagios-monitoring-debian-ubuntu
title: "Install Nagios Core on Debian 12 and Ubuntu 22.04"
description: "This guide walks you through installing and configuring Nagios Core Debian 12 and Ubuntu 22.04 to monitor system resources and services."
authors: ["D Hoober"]
contributors: ["D Hoober"]
published: 2025-08-31
keywords: ["nagios", "nagios Core", "monitoring", "debian 12", "ubuntu 22.04", "server health", "nagios plugins"]
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

- A Compute Instance (formerly Linode) running Debian 12 or Ubuntu 22.04
- A non-root user with `sudo` privileges
- LAMP stack installed (Linux, Apache, MariaDB/MySQL, PHP). Install and configure a LAMP (Linux, Apache, MySQL, and PHP) stack.
    [How to Install and Configure a LAMP Stack](https://techdocs.akamai.com/get-started-cloud-computing/docs/install-lamp-api)
- Firewall configured to allow HTTP/HTTPS access
   Ensure your instance allows inbound traffic on ports **80 (HTTP)** and **443 (HTTPS)**. If you're using a local firewall like **UFW** (Uncomplicated Firewall), run:
       sudo ufw allow 80/tcp
       sudo ufw allow 443/tcp
       
- If your instance is hosted in a cloud environment (e.g., Linode, AWS, GCP), check the *cloud firewall or security group settings and confirm that these ports are open to the public.

This step is required to access the nagios web interface after installation.

If you are switching from another monitoring system (e.g., Zabbix, Prometheus, Icinga), prior to installation:

- **Stop and disable the previous service**: Use `systemctl stop` and `systemctl disable` to prevent conflicts.
- **Remove conflicting packages**: Check for overlapping plugins or agents that may interfere with Nagios.
- **Clean up legacy configuration files**: Look in `/etc/`, `/usr/local/`, and `/var/log/` for residual files from previous tools.
- **Review firewall and port settings**: Nagios may require different ports than your previous tool (e.g., 5666, 80/443).
- **Backup any relevant data**: If you're migrating alerts or host definitions, preserve what you need before uninstalling.

## System Preparation

If this command fails or your SSH connection times out, your instance may have booted without an IPv4address. This is a known edge case in Ubuntu 22.04 cloud images. Before installing Nagios, ensure your compute instance is fully online and has received an IPv4 address. This is required for package updates, SSH access, and alert configuration.
Note: If you see only inet6 entries and no inet (IPv4) address, then see [IPv4](https://github.com/linode/docs/pull/7325/files#ipv4-recovery-guide). Once this is resolved, update your system with the previous commands.

Before installing Nagios, ensure your compute instance is fully online and has received an IPv4 address. This is required for package updates, SSH access, and alert configuration.

Update your system:

    sudo apt update && sudo apt upgrade -y

## Create Nagios User and Group

 Creating a dedicated `nagios` user and `nagcmd` user group ensures that Nagios runs securely and can execute commands via the web interface:

    sudo useradd nagios
    sudo groupadd nagcmd

Adding both the `nagios` service user and Apache2 web server user to the `nagcmd` user group makes it possible for Nagios to securely execute commands via the web interface. This step aligns with least-privilege principles--granting only the necessary access for command execution while maintaining separation between service and interface roles:

    sudo usermod -aG nagcmd nagios && sudo usermod -aG nagcmd www-data

## Install Nagios and Plugins

For a simpler install you can use Debian's package manager, [HowtoForge's guide for Debian 12](https://www.howtoforge.com/nagios-debian-12/#google_vignette) which walks you through the APT-based setup, including:
- Prerequisites
- Installing Nagios on Debian
- Nagios Configuration Files and Directories
- Enable Nagios Authentication
- Setting up Apache Basic Auth for Nagios for Nagios
- Accessing Nagios Installation with Authentication Enabled
- Conclusion
This method doesn't use manual compilation and is ideal for quick deployments. Once installed, return to [Nagios Alert Setup on Debian 12 and Ubuntu 22.04](guides\uptime\monitoring\monitor-and-configure-nagios-alerts-on-debian-12-ubuntu-22-04\index.md) to configure alerts.

### Verify it's running:
    systemctl status nagios
If installation fails or a package isn't found, check the terminal output for clues. Then run:

    apt search nagios
    
 ### Check Nagios Version
    
To confirm the installed version:
    
    /usr/sbin/nagios4 --version
        
This validates the correct package was installed and is useful when comparing behavior across environments or debugging version-specific issues.


Common issues and how to resolve them:
 - **Missing package**: One or more packages may not be available in your distro's repositories. Double-check your `/etc/apt/sources.list` and run `sudo apt update` to refresh the cache.    

 - **Permission denied**: If you didn't use `sudo`, the install will fail. Always run `apt` commands with elevated privileges.
- **Network**: A broken internet connection or unreachable mirror can prevent downloads. Try pinging a known host or switching mirrors.
- **Broken dependencies**: If your system has conflicting packages or unmet dependencies, `apt` usually suggests a fix. To isolate the problem, install packages one at a time:
    sudo apt install nagios4
    sudo apt install nagios-plugins-contrib
    sudo apt install monitoring-plugins
    sudo apt install nagios-nrpe-plugin
Then you can tell which package is causing issues.
Use this checklist to confirm your install steps or isolate issues during setup.

{{< details "Quick Troubleshooting Checklist" >}}
- [ ] Refresh package cache: `sudo apt update`
- [ ] Search for Nagios packages: `apt search nagios`
- [ ] Fix broken dependencies: `sudo apt --fix-broken install`
- [ ] Resolve APT lock errors: remove lock files if no other process is running
- [ ] Check for missing packages in `/etc/apt/sources.list`
- [ ] Use `sudo` for all install commands
- [ ] Verify network connectivity or switch mirrors
- [ ] Install packages one at a time to isolate issues:
  - `sudo apt install nagios4`
  - `sudo apt install nagios-plugins-contrib`
  - `sudo apt install monitoring-plugins`
  - `sudo apt install nagios-nrpe-plugin`
{{< /details >}}

## Advanced Apache Configuration

Use this version if you are managing group-based multi-access, enforcing IPv6 restrictions, or customizing Nagios interface paths. For simpler setups, refer to the basic configuration [Configure Apache Authentication](#configure-apache-authentication) section above.

1. Update `<DirectoryMatch>` Block

    <DirectoryMatch "^(/usr/share/nagios4/htdocs|/usr/lib/cgi-bin/nagios4|/etc/nagios4/stylesheets)">

        #Require ip ::1/128 fc00::/7 fe80::/10 10.0.0.0/8 127.0.0.0/8 169.254.0.0/16 172.16.0.0/12 192.168.0.0/16
        <Files "cmd.cgi">
            AuthDigestDomain "Nagios4"
            AuthDigestProvider file
            AuthUserFile "/etc/nagios4/htdigest.users"
            AuthGroupFile "/etc/group"
            AuthName "Nagios4"
            AuthType Digest
            Require from 127.0.0.1 198.51.100.0
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


1. Restart the Apache service to apply changes:

    sudo systemctl restart apache2


## Monitor Hosts and Services

- Use the left sidebar in Nagios to view Hosts and Services.
- Add new hosts by editing configuration files in:
        `/etc/nagios4/conf.d/`
         
- After making changes, validate your configuration before restarting:
        sudo nagios4 -v /etc/nagios4/nagios.cfg
        
If errors appear, Nagios will point to the specific file and line number. Fix those *before* restarting.

- Restart Nagios after changes:

        sudo systemctl restart nagios4

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
