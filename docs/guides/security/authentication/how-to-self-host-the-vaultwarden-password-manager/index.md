---
slug: how-to-self-host-the-vaultwarden-password-manager
author:
  name: Tyler Langlois
description: "Bitwarden is an open source password management application that can be self-hosted. This guide shows how to run an instance of the vaultwarden project."
keywords: ["bitwarden self hosted", "free self hosted password manager", "self hosted password manager open source"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-02-19
modified_by:
  name: Linode
title: "How to Self-Host the vaultwarden Password Manager"
h1_title: "Self-Hosting the vaultwarden Password Manager"
enable_h1: true
tags: ["ubuntu", "security", "web applications", "docker"]
contributor:
  name: Tyler Langlois
  link: https://tjll.net
aliases: ["security/authentication/self-hosted-password-management-with-bitwarden-rs/", "/guides/how-to-self-host-the-bitwarden-rs-password-manager/", "security/authentication/how-to-self-host-the-bitwarden-rs-password-manager/"]
---

The [Vaultwarden](https://github.com/dani-garcia/vaultwarden) project (formerly known as bitwarden_rs) provides a lightweight, single-process, API-compatible service alternative to [Bitwarden](https://bitwarden.com/). [Vaultwarden](https://bitwarden.com/) is an open source password management application that can be self-hosted and run on your infrastructure. By running the vaultwarden service, you can use Bitwarden browser extensions and mobile applications backed by your server.

{{< note >}}
By self-hosting your password manager, you are assuming responsibility for the security and resiliency of sensitive information stored within Vaultwarden. Before storing important information and credentials within the application, ensure that you are confident with the security of the server. Also, take the necessary backup measures mentioned in this tutorial.
{{< /note >}}

## In this Guide

This guide uses the official Vaultwarden [Docker image](https://github.com/dani-garcia/vaultwarden/wiki/Which-container-image-to-use). A reverse proxy ([Caddy](https://caddyserver.com/)) is configured in front of the Docker container. This provides TLS termination for both the web-based vault interface and the websocket server.

This configuration of Vaultwarden also uses the default SQL backend for the application (sqlite3). The SQL datastore for vaultwarden contains the user data of the application and is therefore the primary concern for a backup scheme. Backing up this datastore ensures that sensitive data stored within Vaultwarden is saved in the event of a data loss scenario.

This guide references the latest version of the Vaultwarden Docker image that is available, which is 1.19 at the time of writing. As part of regular maintenance, follow the [upgrade instructions](https://github.com/dani-garcia/vaultwarden/wiki/Updating-the-vaultwarden-image) provided by the project regularly. Following these instructions ensures your deployment is up to date with current upstream releases. This also ensures that any relevant security updates are applied to the application.

Ubuntu 20.04 is the distribution used in this guide. Generally speaking, any Linux distribution that supports running Docker containers should be equally compatible with the steps explained in this guide.

### Before You Begin

1. Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting the hostname and timezone.

1. Follow the [Setting Up and Securing a Compute Instance](/docs/guides/set-up-and-secure/) guide in order to harden the Linode against malicious users. This step is important to ensure Vaultwarden is secured.

   {{< note >}}
If you choose to configure a firewall, remember to open ports 80 and 443 for the Caddy server. The [Configure a Firewall](/docs/guides/set-up-and-secure/#configure-a-firewall) section of the guide outlines different firewall software options.
{{</ note >}}

1. Make sure you have registered a Fully Qualified Domain Name (FQDN) and set up [A and AAAA](/docs/guides/dns-records-an-introduction/#a-and-aaaa) DNS records that point to the public [IPv4 and IPv6 addresses](/docs/guides/managing-ip-addresses/) of the Linode. Consult the [DNS Records: An Introduction](/docs/guides/dns-records-an-introduction/) and [DNS Manager](/docs/guides/dns-manager/) guides for help with setting up a domain. A proper domain name is important to acquire a certificate for HTTPS connectivity.

## Install Docker

1. Uninstall any potentially previously-installed packages.

        sudo apt-get remove docker docker-engine docker.io containerd runc

   If `apt-get` indicates that no packages were found, continue to the next step.

1. Install package prerequisites for compatibility with the upstream Docker repository.

        sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common

1. Add the official Docker GPG repository key.

        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

1. Add the Docker upstream repository.

        sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

1. Update the `apt` package cache.

        sudo apt-get update

1. Install the required Docker packages.

        sudo apt-get install docker-ce docker-ce-cli containerd.io

1. Start and enable the `docker` daemon.

        sudo systemctl enable --now docker

1. Confirm that you can run `docker` commands. The following command should return without errors and show zero running containers.

        sudo docker ps

## Install vaultwarden

This section outlines how to download the Vaultwarden Docker image, setup volume persistence, and manage the Docker container.

1. Pull the Vaultwarden image.

        sudo docker pull vaultwarden/server:latest

1. Select the desired file system path to store application data. In this guide, the path `/srv/vaultwarden` is used. Create the directory if necessary, and enforce strict permissions for the root user only.

        sudo mkdir /srv/vaultwarden
        sudo chmod go-rwx /srv/vaultwarden

1. Create the Docker container for Vaultwarden.

        sudo docker run -d --name vaultwarden -v /srv/vaultwarden:/data -e WEBSOCKET_ENABLED=true -p 127.0.0.1:8080:80 -p 127.0.0.1:3012:3012 --restart on-failure vaultwarden/server:latest

    This command uses the following flags to establish a persistent container to serve the Vaultwarden application:

    - `-d` daemonizes the container to run in the background.
    - Using `--name vaultwarden` gives the container a human-readable name. To avoid the need to reference the running container by a temporary identifier.
    - By passing the host path `/srv/vaultwarden` to the volume (`-v`) flag, data is persisted outside of the container whenever it is stopped.
    - The environment variable `WEBSOCKET_ENABLED` enables the extra websocket server for Vaultwarden.
    - Each `-p` flag forwards the respective host ports to the container (port 8080 for the main Vaultwarden web service and port 3012 for websocket traffic). Normal HTTP and HTTPS ports are served with Caddy.
    - `--restart=on-failure` ensures that the container remains up in the event of container failure or host restart.

   As part of these steps, note that the container listens for traffic on the local loopback interface (`127.0.0.1`) and _not_ a publicly reachable IP address. This is to ensure that any traffic originating from outside the host must connect to the Caddy server, which enforces encrypted TLS connections.

## Configure Caddy as a Reverse Proxy

External clients communicate with Caddy, which manages reverse proxying websocket traffic. Caddy also provisions and renews TLS certificates through Let's Encrypt automatically. The caddy images come in many flavors, each designed for a specific use case.

caddy:&lt;version&gt;

This is the de facto image. If you are unsure about your needs, you probably want to use this one. It is designed to be used both as a throw away container. To mount source code and start the container to start the app. Also, as the base to build other images using this.



1. Pull the Caddy image.

        sudo docker pull caddy:2

1. Create the following Caddyfile. Be sure to replace `example.com` with the name of the domain that you set up in the [Before You Begin](#before-you-begin) section of this guide, and confirm that the domain points to the IP address of the Linode. This domain serves the web interface for Vaultwarden hosted and secured by Caddy's automatic TLS.

   {{< file "/etc/Caddyfile" caddy >}}
example.com {
  encode gzip

  # The negotiation endpoint is also proxied to Rocket
  reverse_proxy /notifications/hub/negotiate 0.0.0.0:80

  # Notifications redirected to the websockets server
  reverse_proxy /notifications/hub 0.0.0.0:3012

  # Send all other traffic to the regular Vaultwarden endpoint
  reverse_proxy 0.0.0.0:80
}
{{< /file >}}

   {{< note >}}
The site name you choose in this file must match the desired URL that Vaultwarden is served under. When navigating to the web interface later in this guide, ensure that you type the same hostname chosen in this configuration file (in this example, `example.com`).
{{</ note >}}


1. Prepare a directory for Caddy in `/etc` to store state information such as Let's Encrypt certificates.

        sudo mkdir /etc/caddy
        sudo chmod go-rwx /etc/caddy

1. Start another Docker container to run a persistent `caddy` daemon.

        sudo docker run -d -p 80:80 -p 443:443 --name caddy -v /etc/Caddyfile:/etc/caddy/Caddyfile -v /etc/caddy:/root/.local/share/caddy --restart on-failure caddy:2

1. View the logs of the Caddy container in order to confirm that a Let's Encrypt certificate has been provisioned for the chosen domain.

        sudo docker logs caddy

   There are likely to be many logs that are returned from this command. Take a moment to read through the logs to verify that lines similar to the following are included in your log output. These lines indicate that certificate provisioning has been successful.


   {{< output >}}
{"level":"info","ts":1634144042.9741306,"msg":"using provided configuration","config_file":"/etc/caddy/Caddyfile","config_adapter":"caddyfile"}
{"level":"warn","ts":1634144042.9749222,"msg":"input is not formatted with 'caddy fmt'","adapter":"caddyfile","file":"/etc/caddy/Caddyfile","line":2}
{"level":"info","ts":1634144042.9756303,"logger":"admin","msg":"admin endpoint started","address":"tcp/localhost:2019","enforce_origin":false,"origins":["127.0.0.1:2019","localhost:2019","[::1]:2019"]}
{"level":"info","ts":1634144042.975767,"logger":"http","msg":"server is listening only on the HTTPS port but has no TLS connection policies; adding one to enable TLS","server_name":"srv0","https_port":443}
{"level":"info","ts":1634144042.9757824,"logger":"http","msg":"enabling automatic HTTP->HTTPS redirects","server_name":"srv0"}
{"level":"info","ts":1634144042.9760253,"logger":"tls.cache.maintenance","msg":"started background certificate maintenance","cache":"0xc00030b960"}
{"level":"info","ts":1634144042.976342,"logger":"http","msg":"enabling automatic TLS certificate management","domains":["example.com"]}
{"level":"info","ts":1634144042.9765563,"msg":"autosaved config (load with --resume flag)","file":"/config/caddy/autosave.json"}
{"level":"info","ts":1634144042.9765673,"msg":"serving initial configuration"}
{"level":"info","ts":1634144042.9765913,"logger":"tls","msg":"cleaning storage unit","description":"FileStorage:/data/caddy"}
{"level":"info","ts":1634144042.9766064,"logger":"tls","msg":"finished cleaning storage units"}
{"level":"info","ts":1634144042.9772124,"logger":"tls.obtain","msg":"acquiring lock","identifier":"example.com"}
{"level":"info","ts":1634144042.9790497,"logger":"tls.obtain","msg":"lock acquired","identifier":"example.com"}
{"level":"info","ts":1634144046.9010673,"logger":"tls.issuance.acme","msg":"waiting on internal rate limiter","identifiers":["example.com"],"ca":"https://acme-v02.api.letsencrypt.org/directory","account":""}
{"level":"info","ts":1634144046.9011092,"logger":"tls.issuance.acme","msg":"done waiting on internal rate limiter","identifiers":["example.com"],"ca":"https://acme-v02.api.letsencrypt.org/directory","account":""}
{"level":"info","ts":1634144055.8619049,"logger":"tls.issuance.acme.acme_client","msg":"trying to solve challenge","identifier":"example.com","challenge_type":"http-01","ca":"https://acme-v02.api.letsencrypt.org/directory"}
{{< /output >}}

   If you find any log lines similar to the following, which indicate failure, double check that the server is reachable from the chosen domain.

   {{< output >}}
{"level":"info","example.com","ca":"https://acme-v02.api.letsencrypt.org/directory","account":"msg": "Unable to deactivate the authorization: <url>}
{"level":"error","example.com","msg":"failed to obtain certificate: acme: Error -> One or more domains had a problem"}
{{< /output >}}

   In order to avoid rate limiting problems, you should stop the `caddy` server if you find any certificate provisioning issues with `sudo docker stop caddy`. You may start the server again with `sudo docker start caddy` after resolving any issues found in the aforementioned container logs.

## Initial Setup

1. Navigate to the chosen domain in a local web browser (in this tutorial, `example.com`). Verify that the browser renders the Bitwarden web vault login page, and that the page is served over TLS/SSL.

   ![Bitwarden Login](bitwarden_rs_login.png "Bitwarden Login")

   If you see the login page, congratulations! Vaultwarden is running and operational. The first step in using the password manager is to create an account. Do so by clicking on the **Create Account** button on the login page.

   {{< note >}}
Remember to navigate to the same name configured in your `Caddyfile` defined in the previous section of this guide. A mismatched hostname in your browser can cause TLS errors.
{{</ note >}}

1. A new page appears with several fields.

   ![Bitwarden Account Creation](bitwarden_rs_create_account.png "Bitwarden Account Creation")

   Fill each field with the appropriate information, choosing a strong and secure master password.

   {{< note >}}
Although a user email is required at time of registration, by default, the deployment of Vaultwarden cannot send email without additional configuration. If you would like to configure SMTP in order to enable Vaultwarden to send email, follow [these instructions on the Vaultwarden wiki](https://github.com/dani-garcia/vaultwarden/wiki/SMTP-configuration). Use SMTP information from an SMTP provider when following the instructions.
{{< /note >}}

1. After registering, the system redirects you to the login screen. Log in with the credentials. The web vault view appears.

   ![Bitwarden Web Vault](bitwarden_web_vault.png "Bitwarden Web Vault")

   At this point, the vaultwarden installation is functional.

### Disable Anonymous User Sign Up

As an additional security precaution, you may elect to disable user registration. This is recommended on servers that are publicly reachable to avoid abuse of the service.

1. Stop the running Vaultwarden container and remove it.

        sudo docker stop vaultwarden
        sudo docker rm vaultwarden

1. Start a new vaultwarden container, but with the `SIGNUPS_ALLOWED` environment variable set to `false`.

        sudo docker run -d --name vaultwarden -v /srv/vaultwarden:/data -e WEBSOCKET_ENABLED=true -e SIGNUPS_ALLOWED=false -p 127.0.0.1:8080:80 -p 127.0.0.1:3012:3012 --restart on-failure vaultwarden/server:latest

1. If you attempt to create a new account after these changes, the following error appears on the account creation page.

   ![Bitwarden Registration Error](bitwarden_rs_signup_error.png "Bitwarden Registration Error")

   This deployment of Vaultwarden does not permit any additional user registrations. You may still want to invite users without needing to change the Vaultwarden container environment variable flags. This is possible by following the upstream documentation to [enable the admin panel](https://github.com/dani-garcia/vaultwarden/wiki/Enabling-admin-page). The administrator panel provides user invitation functionality.

## Backup Vaultwarden SQLite Database

Before relying on this service for any important data, you should take additional steps to safeguard the data stored within Vaultwarden. Encrypted data is stored within a flat file sqlite3 database. In order to reliably backup this data, you should *not* simply copy the file. Instead, use the sqlite3 `.backup` command. This command ensures that the database is in a consistent state when the backup is taken.

1. Review the [Backing Up Your Data](/docs/guides/backing-up-your-data/) guide in order to determine the best location to store the backups. In this example, a local file system path is used.

    {{< note >}}
In a more resilient setup, these local backups should be replicated onto another service or host to guard against single-host failure.
{{< /note >}}

1. Install the `sqlite3` package, which provides the `sqlite3` command for the backup script.

        sudo apt-get install sqlite3

1. Create a directory for backups.

        sudo mkdir /srv/backup
        sudo chmod go-rwx /srv/backup

1. Create the following systemd service.

   {{< file "/etc/systemd/system/vaultwarden-backup.service" ini >}}
[Unit]
Description=backup the vaultwarden sqlite database

[Service]
Type=oneshot
WorkingDirectory=/srv/backup
ExecStart=/usr/bin/env sh -c 'sqlite3 /srv/vaultwarden/db.sqlite3 ".backup backup-$(date -Is | tr : _).sq3"'
ExecStart=/usr/bin/find . -type f -mtime +30 -name 'backup*' -delete
{{< /file >}}

   This service unit creates a timestamped file and cleans up any backups older than 30 days.

1. To take an initial backup and verify the systemd service works, start the backup service.

        sudo systemctl start vaultwarden-backup.service

1. Verify that a backup file is present:

        sudo ls -l /srv/backup/

   This command returns with one backup sqlite3 file.

   {{< output >}}
total 136
-rw-r--r-- 1 root root 139264 Feb 24 18:16 backup-2020-02-24T18_16_50-07_00.sq3
{{< /output >}}

1. To schedule regular backups using this backup service unit, create the following systemd timer unit.

   {{< file "/etc/systemd/system/vaultwarden-backup.timer" ini >}}
[Unit]
Description=schedule vaultwarden backups

[Timer]
OnCalendar=04:00
Persistent=true

[Install]
WantedBy=multi-user.target
{{< /file >}}

   This schedules the backup to occur at 4:00 in the time zone set for the Linode. You may alter this time to trigger at a desired time of day.

   {{< note >}}
The `Persistent=true` line instructs systemd to fire the timer if the timer was unable to trigger at its previous target time. For example, this could happen if the system was being rebooted.
{{</ note >}}

1. Start and enable this timer unit.

        sudo systemctl enable vaultwarden-backup.timer
        sudo systemctl start vaultwarden-backup.timer

1. Finally, to view the timer's next execution time, check the status of the timer.

        systemctl status vaultwarden-backup.timer

   You should see output similar to the following:


   {{< output >}}
● vaultwarden-backup.timer - schedule vaultwarden backups
  Loaded: loaded (/etc/systemd/system/vaultwarden-backup.timer; enabled; vendor preset: enabled)
  Active: active (waiting) since Mon 2020-02-24 22:09:44 MST; 7s ago
  Trigger: Tue 2020-02-25 04:00:00 MST; 5h 50min left
{{< /output >}}

   This indicates that a backup is taken in 5 hours and 50 minutes.

{{< caution >}}
Ensure that the backups are kept on a volume or host independent of the Linode in case of a disaster recover recovery scenario. Consider using [Linode Block Storage](/docs/products/storage/block-storage/) as one potential solution for permanent backup storage and archival.
{{< /caution >}}

## Using Vaultwarden

vaultwarden provides a compatible API for many [Bitwarden apps and browser extensions](https://bitwarden.com/). In order to configure these applications to use a hosted instance, you may need to configure the mobile application or browser extension. Specifically, you may need to enter a custom domain and API endpoint:

1. As an example, this is the initial login screen for the Firefox Bitwarden browser extension. In order to configure a custom server, click the gear in the upper left corner.

   ![Bitwarden Extension Configuration](bitwarden_browser_extension_login.png "Bitwarden Extension Configuration")

1. On the next page, type your custom domain under the **Server URL** field, such as `https://example.com`. Similar steps can be taken on the iOS and Android mobile applications. Edit the settings of the application before login to use a custom Server URL, and you can log in to a custom instance of Vaultwarden.

## Additional Reading

With Vaultwarden running securely over TLS and regularly backed up, you may choose to follow [additional documentation provided by the Vaultwarden project](https://github.com/dani-garcia/vaultwarden/wiki). This documentation helps add more functionality to your installation. Some of these features include:

- [Support for U2F authentication](https://github.com/dani-garcia/vaultwarden/wiki/Enabling-U2F-authentication)
- [SMTP configuration to support sending emails](https://github.com/dani-garcia/vaultwarden/wiki/SMTP-configuration) for features like account creation invitation.
