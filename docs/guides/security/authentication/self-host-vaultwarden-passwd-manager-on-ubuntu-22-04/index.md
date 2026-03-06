---
slug: self-host-vaultwarden-passwd-manager-on-ubuntu-22-04
title: "Self-Hosting Vaultwarden Password Manager on Ubuntu 22.04"
title_meta: "Self-Hosting Vaultwarden Password Manager"
description: 'This guide provides prerequisites and a walkthrough for installing and using Vaultwarden on Ubuntu 22.04'
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-10-10
keywords: ['vaultwarden','bitwarden','password manager', 'install vaultwarden', 'open source password management', 'self-hosted', 'lightweight', 'Ubuntu 22.04', 'bitwarden replacement', 'bitwarden compatible']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide walks you through deploying Vaultwarden—a lightweight, Bitwarden-compatible password manager—using Docker and NGINX on Ubuntu 22.04 LTS. It’s designed for clarity, validation, and long-term maintainability, with a focus on predictable behavior and user trust.

## About This Deployment

This setup uses:

- Vaultwarden: A secure, self-hosted password manager
- Docker Compose: To manage Vaultwarden as a container
- NGINX: A reverse proxy that handles HTTPS and websocket support

Why this matters: Vaultwarden doesn’t handle HTTPS on its own. NGINX ensures secure, encrypted access to your web vault and offers predictable behavior across environments.

### Prerequisites

Before starting, ensure your server is secure and ready:

- Ubuntu 22.04 LTS installed and configured
- Root or sudo access to the server
- A registered domain name with DNS records pointing to your server
- Docker Engine with Docker Compose plugin (V2) installed
- NGINX installed (we'll configure it later to reverse proxy Vaultwarden)

## Before You Begin

These steps are introduced in our [Get Started](/docs/products/platform/get-started/) and [Cloud Manager](https://techdocs.akamai.com/cloud-computing/docs/overview-of-cloud-manager) guides. The steps are included here for clarity and contributor safety.

### For Testing and Configuration

Set up your compute instance (Ubuntu 22.04 LTS) with a recognizable hostname and accurate timezone. While Vaultwarden functions without these settings, they help ensure consistent logging and system behavior especially if you're running multiple services or collaborating with others.

Set the hostname:

```command
sudo hostnamectl set-hostname vaultwarden-test
```
Replace`vaultwarden-test` with the environment name you want.

{{< note>}}
If you already set a hostname when preparing your Compute Instance (i.e., in the "Set Up and Secure" guide), you do not need to change it again here.
{{< /Note>}}

Set the timezone:

List available timezones:
```command
timedatectl list-timezones
```
Then set your timezone (e.g., for Pacific Time):

```command
sudo timedatectl set-timezone America/Los_Angeles
```
Verify your settings:

```command
hostnamectl
timedatectl
```
Expected output similar to:
```output
Static hostname: vaultserver
Operating System: Ubuntu 22.04 LTS
Architecture: x86-64

Local time: Wed 2025-11-05 09:45:00 PST
System clock synchronized: yes
NTP service: active
Time zone: America/Los_Angeles (PST, -0800)
```

{{< note >}}
If your hostname appears as expected and the time is synchronized with NTP, your system is correctly aligned to support Vaultwarden’s authentication, logging, and network configuration. No further changes are needed at this stage.
{{< /note >}}

### For Production Use

- Follow the [Set Up and Secure a Compute Instance](https://techdocs.akamai.com/cloud-computing/docs/set-up-and-secure-a-compute-instance) guide to harden your server.
- Configure a firewall and open ports 80 and 443.
- Register a Fully Qualified Domain Name (FQDN) and [Set Up A and AAAA DNS Records](/docs/guides/dns-overview/#a-and-aaaa) see note below.
- Use a reverse proxy like NGINX to enable HTTPS and route traffic to Vaultwarden.

{{< note >}}
If you configure a firewall, opening ports 80 and 443 allow HTTP/HTTPS traffic to Vaultwarden or the reverse proxy. DNS records should point to the public [IPv4 and IPv6 Addresses](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance) of the compute instance. For help with setting up a domain refer to [Overview of DNS and DNS records](/docs/guides/dns-overview/) and [DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager).
{{< /note >}}

{{< note >}}
When setting up or starting a production system, you may see the message: **"Enable ESM Apps to receive additional future security updates."** It means your system may be eligible for extended security updates. To understand and benefit from this coverage, see [Ubuntu's official ESM documentation](https://documentation.ubuntu.com/pro-client/en/docs/explanations/about_esm/).
{{< /note >}}

##  Install Docker CE and Compose Plugin

### Prerequisite Support for Containerized Services

To self-host Vaultwarden after preparing your Ubuntu 22.04 compute instance to run containerized applications, this setup ensures your system is ready to deploy Vaultwarden cleanly and securely.

#### Update system packages

Before installing anything new, update your system to ensure all packages are current:

```command
sudo apt update
sudo apt upgrade -y
```
If prompted about a modified configuration file (e.g., `sshd_config`), choose to keep the local version unless you're intentionally resetting to the package maintainer's defaults. This preserves your current access settings and avoids unexpected changes. This also ensures compatibility and security before installing new components.

{{< note >}}
If the commands complete without errors and you see confirmation messages like `Setting up [package]`, or `Restarting services...`, your system is up to date and ready for the next step.
{{< /note >}}

#### Understand Docker Compatibility on Ubuntu 22.04

Ubuntu 22.04 uses the new codename `noble`, which may not yet be fully supported by Docker's official stable repository. This can cause issues when trying to install Docker CE using standard package commands.

{{< note >}}
Running `sudo apt update` and `sudo apt upgrade -y` **does not install Docker-CE** or prepare your system to use it. Attempting to install `docker-ce` without first adding Dockers' repository will result in:

```command
Package 'docker-ce' has no installation candidate
```

Installing `docker.io` from Ubuntu's default repository may appear to work, but it lacks the modern Compose plugin and may cause compatibility issues with Vaultwarden's setup.

If you're using Ubuntu 22.04, expect potential friction when installing Docker CE. This is due to upstream repository timing--not a misstep on your part or a flaw in this guide.
{{< /note >}}

#### What This Guide Uses

This guide uses **Docker CE** for full compatibility with Vaultwarden's containerized deployment and walks you through:

- Adding Docker's official repository (with `noble` codename)
- Installing Docker CE and its plugins

This ensures a clean, modern setup that aligns with Vaultwarden's current architecture and avoids silent conflicts--especially when integrating with a reverse proxy like NGINX.

Vaultwarden runs inside Docker containers, so you’ll need to install Docker CE (Community Edition) and its Compose plugin. This section walks you through a validated setup for Ubuntu 22.04 (noble), including repository configuration and plugin installation.

If Docker has been previously installed on this system, you may need to remove older packages. See Step 7 for cleanup.

Step 1: Install Required Dependencies
```command
sudo apt install ca-certificates curl gnupg
```
These packages allow your system to securely fetch and verify Docker’s repository and GPG key.

Step 2: Create Docker Keyring Directory
```command
sudo install -m 0755 -d /etc/apt/keyrings
```
This directory stores trusted keys used to verify Docker packages.

Step 3: Add Docker’s GPG Key
```command
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```
This ensures Docker packages are signed and verified before installation.

Step 4: Add Docker’s Official Repository
```command
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
This adds Docker’s stable channel for Ubuntu 22.04 (noble) to your system’s sources.

Step 5: Update Package Index
```command
sudo apt update
```
Validation Check

If everything is configured correctly, sudo apt update shows several Get: lines followed by All packages are up to date. This confirms that Docker’s repository is active and ready for use.

Step 6: Install Docker CE and Plugins
```command
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```
This installs Docker CE, its CLI tools, and the modern Compose plugin (docker compose).

{{< note >}}
While the Compose plugin is usually installed alongside Docker CE, some environments—especially minimal or cloud-based ones—may omit it. To confirm it's available, run:
```command
docker compose version
```
If you see an error or "unknown command," install the plugin with:
```command
sudo apt install docker-compose-plugin
```
{{< /note >}}

To validate:

After installation, run `docker --version`. You should see something like `Docker version 28.5.2`. This confirms that Docker was successfully installed and is ready to use. To validate, run `docker compose version` and you should see the version `Docker Compose version v2.40.3`.

If both `docker --version` and `docker compose version` return expected output, your system is ready to deploy Vaultwarden with full container support.

Step 7: How to Remove Legacy Docker Packages (if applicable)

If you previously installed docker.io, remove it with:
```command
sudo apt purge docker.io
```
If you installed older Docker CE packages, remove them with:
```command
sudo apt purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```
This ensures a clean environment for Vaultwarden and modern Compose workflows.Then follow the steps above (step 6) to install Docker CE. This guide is designed to help you recover safely and proceed with confidence.

If both `docker --version` and `docker compose version` return expected output, you're ready to deploy Vaultwarden, no further Docker configuration is needed.

## Deploy Vaultwarden with Docker Compose

With Docker CE and the Compose plugin installed and validated, you're ready to deploy Vaultwarden using Docker Compose. This section creates the working directory, defines the container configuration, launches the service, and verifies that it is running correctly.

Step 1. Create a directory for Vaultwarden

This keeps your deployment organized and isolated.
```command
mkdir ~/vaultwarden
cd ~/vaultwarden
```

Step 2. Create a `docker-compose.yml` file

This file defines the Vaultwarden service and its configuration.
```command
sudo nano docker-compose.yml
```

Paste the following content into the file:

```command
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - 127.0.0.1:3012:80
    volumes:
     - ./vw-data:/data
    environment:
      WEBSOCKET_ENABLED: true
```

{{< note >}}
This configuration exposes Vaultwarden on host port 3012 mapped to port 80 inside the container. This leaves port 80 available for NGINX to use as a reverse proxy. Vaultwarden's data is stored in the local `vw-data` directory. Additional environment variables--such as SMTP settings or an admin token--can be added later.
{{< /note >}}

Step 3. Start Vaultwarden
```command
docker compose up -d
```

This launches Vaultwarden to run in the background.

Step 4. Verify the container is running
```command
docker ps
docker logs vaultwarden
```
You should see output like:
```output
CONTAINER ID    IMAGE                        STATUS       PORTS
abc123          vaultwarden/server:latest    Up           0.0.0.0:80->80/tcp
```

If `docker ps` shows your container as "Up" and `docker logs vaultwarden` shows no errors, your deployment is successful.

## Updating Vaultwarden

Checking for updates often ensures you receive the latest security fixes and improvements. Subscribe to the [Vaultwarden GitHub releases](https://github.com/dani-garcia/vaultwarden/releases) to stay informed about new versions (be sure to read what is being updated before applying it). To update Vaultwarden to the latest version:

1. Navigate to your compose directory
```command
cd ~/vaultwarden
```
This is the directory containing your `docker-compose.yml` file.

2. Pull the latest image
```command
docker compose pull
```
This downloads the newest version of the Vaultwarden container image.

3. Stop the running container:
```command
docker compose down
```
This cleanly stops the current Vaultwarden instance.

4. Recreate and start the updated container:
```command
docker compose up -d
```
Vaultwarden will restart using the updated image with minimal downtime.

{{< note >}}
**See a warning?** Docker Compose may show warnings about deprecated keys or ignored attributes. These usually don't affect functionality. For example, you might see:

`WARN[0000] /root/vaultwarden/docker-compose.yml: the attribute version is obsolete, it will be ignored, please remove it to avoid potential confusion`

This means the `version:` line in your `docker-compose.yml` file is no longer needed. You can safely delete it—Docker Compose now auto-detects this file format.

For details, see the Docker [Compose file reference](https://docs.docker.com/reference/compose-file/) to know what's safe to ignore and what might need attention.
{{< /note >}}

## Optional: Set an Admin Token

Vaultwarden supports an admin interface for managing users and settings. To enable it you must define an admin token in your Docker Compose Configuratio.:

Step 1. Generate a secure admin token

You can use openssl or any password generator:
```command
openssl rand -base64 32
```

Step 2. Add the token to your Compose file

Open your `docker-compose.yml` file and find the `environment:` section under the `vaultwarden` service. Add this line:

```command
ADMIN_TOKEN: your_generated_token_here
```
Your updated section should look like this:

```command

services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: unless-stopped
    ports:
      - "127.0.0.1:3012:80"
    volumes:
      - ./vw-data:/data
    environment:
      WEBSOCKET_ENABLED: true
      ADMIN_TOKEN: your_generated_token_here
```

Replace `your_generated_token_here` with the secure admin token you created.

Step 3. Restart the container
```command
docker compose down
docker compose up -d
```
Once the container restarts, you can access the admin interface at:
```
http://your-server-ip:3012/admin
```
(or via your domain after NGINX is configured).

Enter your admin token to log in and manage Vaultwarden settings.

{{< note >}}
Keep your admin token secure. Anyone with access to it can modify Vaultwarden settings.
{{< /note >}}

Final Validation Checklist

- [ ] Vaultwarden is running and bound to 127.0.0.1:3012
- [ ] NGINX is installed and configured to proxy to Vaultwarden
- [ ] TLS is enabled via Certbot (recommended)
- [ ] You can access Vaultwarden securely via `https://your-domain`

## Enable HTTPS and Reverse Proxy with NGINX (Recommended for Production)

If you plan to access Vaultwarden over the internet, configuring a reverse proxy and enabling HTTPS are essential. We'll use NGINX—a modern web server that automatically provisions TLS certificates via Let's Encrypt and securely routes traffic to backend services like Vaultwarden.

NGINX offers predictable behavior across environments and is widely used in self-hosted deployments. It's especially reliable when paired with Docker.

### Why NGINX?

Vaultwarden doesn’t handle HTTPS on its own, so a reverse proxy is essential. While earlier guides used Caddy, this update pivots to NGINX for stability, transparency, and ease of validation.

Why NGINX is the Better Fit:

- Predictable behavior across Docker and systemd environments
- Clear error messages and extensive community support
- Manual TLS setup via Certbot or custom certificates—more control, fewer surprises
- Widely used in self-hosted deployments, especially for password managers and secure apps
- Compatible with Vaultwarden’s websocket and admin interface

### Install and Configure NGINX (Reverse Proxy for Vaultwarden)

NGINX securely routes traffic, enables TLS, and ensures encrypted access to your password vault; this isolates Vaultwarden from direct exposure.

Step 1: Install NGINX
```command
sudo apt update
sudo apt install nginx -y
```
If the install completes without errors, NGINX is now available as a system service.

Step 2: Configure NGINX as a Reverse Proxy

Create a new configuration file for Vaultwarden:
```command
sudo nano /etc/nginx/sites-available/vaultwarden
```
Paste the following content:
```command
# Vaultwarden reverse proxy configuration
# Replace 'your-domain-name' with your actual domain
# Ensure Vaultwarden is bound to 127.0.0.1:80 or update proxy_pass accordingly

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Replace `your-domain.com` with your actual domain name. This configuration forwards all traffic to Vaultwarden running locally on port 80.

Step 3: Enable the NGINX Proxy Configuration

```command
sudo ln -s /etc/nginx/sites-available/vaultwarden /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
**Validation Check**

After running `sudo nginx -t`, look for:

- syntax is ok
- test is successful

If errors appear, NGINX will point to the exact line to fix.

**Final Verification

- Visit`http://your-domain.com` in a browser.

You should see the Vaultwarden login screen.

If not, check:
- `docker ps`--confirm Vaultwarden is running.
- `sudo journalctl -u nginx`--review NGINX logs for errors.

Step 4: Enable HTTPS with Certbot

Once Vaultwarden is accessible via HTTP, you can enable HTTPS for secure access.
```command
sudo certbot --nginx -d your-domain.com
```
Certbot will:

- Prompt you for an email address
- Request agreement to terms
- Automatically configure TLS for NGINX
- Set up certificate renewal

**DNS Requirement**
Before running Certbot, ensure your domain's DNS A record points to your server's public IP. You can verify this with:
```command
dig your-domain.com +short
```

Once Certbot completes successfully and reloads NGINX, HTTPS is now active.

You can now access Vaultwarden securely via:
```
https//your-domain.com
```

Step 5: Recovery--Fix Redirect Loop

If HTTPS access fails or redirects endlessly, the issue is usually a mismatch between:

- Vaultwarden’s internal `DOMAIN` setting
- NGINX’s proxy configuration.

**Fix**

Update Vaultwarden’s .env file to use HTTPS:
```command
sudo nano /home/your-username/vaultwarden/.env
```

Change:
```env
DOMAIN=https://your-domain.com
```
Restart Vaultwarden:
```command
docker compose down
docker compose up -d
```
Once Vaultwarden restarts, NGINX should proxy HTTPS correctly.

## Security Hardening

Strengthening your Vaultwarden deployment reduces exposure to common threats and ensures your password vault remains protected. These recommendations apply after Vaultwarden is deployed and NGINX is configured.

**Restrict or Disable the Admin Interface**

The admin interface is powerful and should be protected carefully

- If you do not need the admin interface, remove the `ADMIN_TOKEN` line from your `docker-compose.yml` or set it to an empty value:
```command
environment:
  ADMIN_TOKEN=
```
If you do use the admin interface:

- Use a long, random token generated with openssl rand -base64 32.
- Restrict access to /admin using firewall rules or NGINX allow/deny directives.
- Avoid exposing the admin interface to the public internet unless absolutely necessary.

Limit Exposure Through NGINX

- Ensure Vaultwarden is only reachable through NGINX by keeping it bound to 127.0.0.1.
- Use HTTPS exclusively once Certbot is configured.
- Consider adding rate limiting to reduce brute force attempts:

limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;

Strengthen the Host Environment

- Keep your system updated (sudo apt update && sudo apt upgrade).
- Use a firewall (UFW or similar) to allow only required ports:
  - o	22 (SSH)
  - o	80 (HTTP)
  - o	443 (HTTPS)
- Consider installing Fail2ban to block repeated failed login attempts at the NGINX layer.

Protect Docker Data

- Ensure the vw-data directory is readable only by the user running Docker.
- Back up the vw-data directory regularly; it contains all Vaultwarden data.

## Backup Strategy

Vaultwarden stores all critical data in the `vw-data` directory. This includes your encrypted vault, configuration files, and any attachments. Protecting this directory ensures you can recover your vault quickly and reliably.

*What to Back Up

- The entire `vw-data` directory (your persistent volume)
- Any custom configuration files you've added (rare)
- Optional: your `docker-compose.yml` file for convenience

Vaultwarden does**not** require database dumps or special export procedures. The data directory *is* the vault.

How to Back Up

Use any backup method you prefer:

- rsync for incremental backups
- cron for scheduled automation
- Cloud sync (encrypted) for offsite redundancy
- Encrypted backup tools like restic or borg

A simple example using rsync:
```command
rsync -av ~/vaultwarden/vw-data/ /path/to/backup/location/
```

**Restoring from a Backup**

Step 1. Stop the container
```command
docker compose down
```

Step 2. Restore your backup

If your backup is a folder:
```command
sudo cp -r /path/to/backup/* ~/vaultwarden/vw-data/
```

If your backup is a tarball:
```command
sudo tar -xvzf vaultwarden-backup.tar.gz -C ~/vaultwarden/vw-data/
```

If using an encrypted backup tool, decrypt and restore into ~/vaultwarden/vw-data/.

Step 3. Fix permissions
```command
sudo chown -R 1000:1000 ~/vaultwarden/vw-data/
```
Step 4. Restart Vaultwarden
```command
docker compose up -d
```

Vaultwarden will automatically detect the restored data and start normally. No database migrations or manual recovery steps are required.

Backup Best Practices

- Keep at least one offsite backup (cloud or external drive).
- Test your restore process occasionally to ensure backups are valid.
- Avoid relying solely on VM snapshots—they are brittle and tied to the VM’s lifecycle.
- Encrypt offsite backups to protect sensitive data.

Additional Resources

- [Vaultwarden Backup and Restore – Memos for Admins Vaultwarden part 4/4: Backup and Restore | Memos for Admins](https://www.memosforadmins.com/post/vaultwarden4/)
- [Backing up your vault - dani-garcia/vaultwarden GitHub Wiki](https://github-wiki-see.page/m/dani-garcia/vaultwarden/wiki/Backing-up-your-vault)

## Optional Enhancements

Once your core Vaultwarden setup is stable, you can extend it with additional features that improve security, privacy, and usability.

- **Confirm WebSocket support** — already enabled in your Compose file via WEBSOCKET_ENABLED: true, allowing real time sync between clients and the server.
- **Enable two factor authentication (2FA)** through the admin interface to strengthen account protection.
- **Integrate with a VPN or private DNS** to isolate traffic and improve privacy, especially for self hosted environments.
- **Consider alternative reverse proxies** such as Caddy if you prefer automatic HTTPS and simplified certificate management. This requires replacing the NGINX configuration rather than adding to it.

Vaultwarden is flexible — choose enhancements that align with your workflow and security needs.
