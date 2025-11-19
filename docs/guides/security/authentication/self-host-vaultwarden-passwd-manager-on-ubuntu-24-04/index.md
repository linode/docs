---
slug: self-host-vaultwarden-passwd-manager-on-ubuntu-24-04
title: "Self-Hosting Vaultwarden Password Manager on Ubuntu 24.04"
title_meta: "Self-Hosting Vaultwarden Password Manager"
description: 'This guide provides prerequisites and a walkthrough for installing and using Vaultwarden on Ubuntu 24.04'
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-10-10
keywords: ['vaultwarden','bitwarden','password manager', 'install vaultwarden', 'open source password management', 'self-hosted', 'lightweight', 'Ubuntu 24.04', 'bitwarden replacement', 'bitwarden compatible']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

This guide walks you through deploying Vaultwarden—a lightweight, Bitwarden-compatible password manager—using Docker and Nginx on Ubuntu 24.04 LTS. It’s designed for clarity, validation, and long-term maintainability, with a focus on predictable behavior and user trust.

## About This Deployment

This setup uses:

- Vaultwarden: A secure, self-hosted password manager
- Docker Compose: To manage Vaultwarden as a container
- Nginx: A reverse proxy that handles HTTPS and websocket support

Why this matters: Vaultwarden doesn’t handle HTTPS on its own. Nginx ensures secure, encrypted access to your web vault and offers predictable behavior across environments.

### Prerequisites

Before starting, ensure your server is secure and ready:

- Ubuntu 24.04 LTS installed and configured
- Root or sudo access to the server
- A registered domain name with DNS records pointing to your server
- Docker Engine with Docker Compose plugin (V2) installed
- Nginx installed (we'll configure it later to reverse proxy Vaultwarden)

## Before You Begin

These steps are introduced in our [Get Started](/docs/products/platform/get-started/) guide. They are included here for clarity and contributor safety.

### For Testing and Configuration

Set up your compute instance (Ubuntu 24.04 LTS) with a recognizable hostname and accurate timezone. While Vaultwarden functions without these settings, they help ensure consistent logging and system behavior especially if you're running multiple services or collaborating with others.

Set the hostname:

```command
sudo hostnamectl set-hostname vaultwarden-test
```
Replace`vaultwarden-test` with the environment name you want.

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
Operating System: Ubuntu 24.04 LTS
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
- Use a reverse proxy like Nginx to enable HTTPS and route traffic to Vaultwarden.

{{< note >}}
If you configure a firewall, opening ports 80 and 443 allow HTTP/HTTPS traffic to Vaultwarden or the reverse proxy. DNS records should point to the public [IPv4 and IPv6 Addresses](https://techdocs.akamai.com/cloud-computing/docs/managing-ip-addresses-on-a-compute-instance) of the compute instance. For help with setting up a domain refer to [Overview of DNS and DNS records](/docs/guides/dns-overview/) and [DNS Manager](https://techdocs.akamai.com/cloud-computing/docs/dns-manager).
{{< /note >}}

{{< important >}}
When setting up or starting a production system, you may see the message: **"Enable ESM Apps to receive additional future security updates."** It means your system may be eligible for extended security updates. To understand and benefit from this coverage, see [Ubuntu's official ESM documentation](https://documentation.ubuntu.com/pro-client/en/docs/explanations/about_esm/).
{{< /important >}}

## Prerequisite Support for Containerized Services

To self-host Vaultwarden, we’ll first prepare your Ubuntu 24.04 compute instance to run containerized applications. This setup ensures your system is ready to deploy Vaultwarden cleanly and securely.

### Update system packages

Before installing anything new, update your system to ensure all packages are current:

```command
sudo apt update
sudo apt upgrade -y
```
If prompted about a modified configuration file (e.g., `sshd_config`), choose to keep the local version unless you're intentionally resetting to the package maintainer's defaults. This preserves your current access settings and avoids unexpected changes. Ensures compatibility and security before installing new components.

{{< note >}}
If the commands complete without errors and you see confirmation messages like `Setting up [package]`, or `Restarting services...`, your system is up to date and ready for the next step.
{{< /note >}}

### Understand Docker Compatibility on Ubuntu 24.04

Ubuntu 24.04 uses the new codename `noble`, which may not yet be fully supported by Docker's official stable repository. This can cause issues when trying to install Docker CE using standard package commands.

{{< important >}}
Running `sudo apt update` and `sudo apt upgrade -y` **does not install Docker-CE** or prepare your system to use it. Attempting to install `docker-ce` without first adding Dockers' repository will result in:

```command
Package 'docker-ce' has no installation candidate
```

Installing `docker.io` from Ubuntu's default repository may appear to work, but it lacks the modern Compose plugin and may cause compatibility issues with Vaultwarden's setup.
{{< /important >}}

{{< warning >}}
If you're using Ubuntu 24.04, expect potential friction when installing Docker CE. This is due to upstream repository timing--not a misstep on your part or a flaw in this guide.
{{< /warning >}}

### What This Guide Uses

This guide uses **Docker CE** for full compatibility with Vaultwarden's containerized deployment and walks you through:

- Adding Docker's official repository (with `noble` codename)
- Installing Docker CE and its plugins
- Removing legacy packages like `docker.io` if present

This ensures a clean, modern setup that aligns with Vaultwarden's current architecture and avoids silent conflicts--especially when integrating with a reverse proxy like Nginx.

##  Install Docker CE and Compose Plugin

### Prerequisite Support for Containerized Services

To self-host Vaultwarden, we’ll first prepare your Ubuntu 24.04 compute instance to run containerized applications. This setup ensures your system is ready to deploy Vaultwarden cleanly and securely.

#### Update system packages

Before installing anything new, update your system to ensure all packages are current:

```command
sudo apt update
sudo apt upgrade -y
```
If prompted about a modified configuration file (e.g., `sshd_config`), choose to keep the local version unless you're intentionally resetting to the package maintainer's defaults. This preserves your current access settings and avoids unexpected changes. Ensures compatibility and security before installing new components.

{{< note >}}
If the commands complete without errors and you see confirmation messages like `Setting up [package]`, or `Restarting services...`, your system is up to date and ready for the next step.
{{< /note >}}

#### Understand Docker Compatibility on Ubuntu 24.04

Ubuntu 24.04 uses the new codename `noble`, which may not yet be fully supported by Docker's official stable repository. This can cause issues when trying to install Docker CE using standard package commands.

{{< important >}}
Running `sudo apt update` and `sudo apt upgrade -y` **does not install Docker-CE** or prepare your system to use it. Attempting to install `docker-ce` without first adding Dockers' repository will result in:

```command
Package 'docker-ce' has no installation candidate
```

Installing `docker.io` from Ubuntu's default repository may appear to work, but it lacks the modern Compose plugin and may cause compatibility issues with Vaultwarden's setup.
{{< /important >}}

{{< warning >}}
If you're using Ubuntu 24.04, expect potential friction when installing Docker CE. This is due to upstream repository timing--not a misstep on your part or a flaw in this guide.
{{< /warning >}}

#### What This Guide Uses

This guide uses **Docker CE** for full compatibility with Vaultwarden's containerized deployment and walks you through:

- Adding Docker's official repository (with `noble` codename)
- Installing Docker CE and its plugins
- Removing legacy packages like `docker.io` if present

This ensures a clean, modern setup that aligns with Vaultwarden's current architecture and avoids silent conflicts--especially when integrating with a reverse proxy like Nginx.

Vaultwarden runs inside Docker containers, so you’ll need to install Docker CE (Community Edition) and its Compose plugin. This section walks you through a validated setup for Ubuntu 24.04 (noble), including repository configuration and plugin installation.

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
This adds Docker’s stable channel for Ubuntu 24.04 (noble) to your system’s sources.

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
While the Compose plugin is usually installed alongside Docker CE, some environments—especially minimal or cloud-based ones—may omit it. To confirm it's available, run: ```command
docker compose version
```
If you see an error or "unknown command," install the plugin with:
```command
sudo apt install docker-compose-plugin
```
{{< /note >}}

To validate:

After installation, run `docker --version`. You should see something like `Docker version 28.5.2`. This confirms that Docker was successfully installed and is ready to use. To validate, run `docker compose version` and you should see something like `Docker Compose version v2.40.3`.

If both `docker --version` and `docker compose version` return expected output, your system is ready to deploy Vaultwarden with full container support.

Step 7: How to Remove Legacy Docker Packages (if applicable)

If you previously installed docker.io, and need to remove it to avoid silent conflicts:
```command
sudo apt purge docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin docker-ce-rootless-extras
```
This ensures a clean environment for Vaultwarden and modern Compose workflows.

{{< important >}}
If you installed docker.io earlier, remove it with:
```command
sudo apt purge docker.io
```
Then follow the steps above (step 6) to install Docker CE. This guide is designed to help you recover safely and proceed with confidence.
{{< /important >}}

If both `docker --version` and `docker compose version` return expected output, you're ready to deploy Vaultwarden. No further Docker configuration is needed.

## Enable HTTPS and Reverse Proxy with Nginx (Recommended for Production)

If you plan to access Vaultwarden over the internet, configuring a reverse proxy and enabling HTTPS are essential. We'll use Nginx—a modern web server that automatically provisions TLS certificates via Let's Encrypt and securely routes traffic to backend services like Vaultwarden.

Nginx offers predictable behavior across environments and is widely used in self-hosted deployments. It's especially reliable when paired with Docker.

### Why Nginx?

Vaultwarden doesn’t handle HTTPS on its own, so a reverse proxy is essential. While earlier guides used Caddy, this update pivots to Nginx for stability, transparency, and ease of validation.

Why Nginx is the Better Fit

- Predictable behavior across Docker and systemd environments
- Clear error messages and extensive community support
- Manual TLS setup via Certbot or custom certificates—more control, fewer surprises
- Widely used in self-hosted deployments, especially for password managers and secure apps
- Compatible with Vaultwarden’s websocket and admin interface

### Install and Configure NGINX (Reverse Proxy for Vaultwarden)

Vaultwarden doesn’t handle HTTPS on its own, so we’ll use Nginx to securely route traffic and enable TLS. This setup ensures encrypted access to your password vault and isolates Vaultwarden from direct exposure.

Step 1: Install NGINX
```command
sudo apt update
sudo apt install nginx -y
```
If the install completes without errors, Nginx is now available as a system service.

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

Replace your-domain.com with your actual domain name. This configuration forwards all traffic to Vaultwarden running on localhost.

Step 3:Configure Vaultwarden Environment Variables

This ensures Vaultwarden knows its domain and admin token. Change to the Vaultwarden directory if you are not already there:
```command
cd /home/your-username/vaultwarden
```
Then open the .env file:
```command
sudo nano .env
```
And paste this into the`.env` file:
```command
# Use your actual domain name here
DOMAIN=http://your-domain.com
ADMIN_TOKEN=your-secure-token
```
Then restart Vaultwarden:
```command
docker compose down
docker compose up -d
```

Step 4: Start the Vaultwarden Container

```command
docker compose up -d
```

Confirm Admin Access and Prepare for Configuration

If the container starts successfully and no warnings appear, Vaultwarden is now running in the background.

To access the admin interface, open a browser and go to:

- If using a domain name:
`http://your-domain.com/admin`

-If using your server's IP address directly(and not yet behind NGINX):
`http//your server-ip:3012/admin

You should see a login field prompting you to enter your ADMIN_TOKEN—the same value defined in your `.env` file or `docker-compose.yml`.

{{< note >}}
This token is required to access the admin interface. Store it securely in a password manager like 1Password, Bitwarden, or another tool you trust. Label it clearly (e.g., "Vaultwarden Admin Token") so you can find it later.
{{< /note >}}

Once logged in, you’ll see configuration options for registration, email delivery, two-factor authentication, and more.

{{< note >}}
This guide does not prescribe specific settings. Vaultwarden provides inline guidance for each option, and your choices should reflect your own security needs and usage patterns.

Once saved, settings in the admin panel override any environment variables you previously set. It’s recommended to finalize your configuration here and avoid duplication. However, at this point, Vaultwarden is operational and the admin interface is accessible. You do not need to configure settings immediately—Vaultwarden will run with its defaults. You may proceed with NGINX setup to enable secure access via your domain name. Configuration can be completed later, based on your needs. Close the tab and return by visiting:
```command
http://your-domain.com/admin
```
or,
```command
http://your-server-ip:3012/admin
```
depending on whether NGINX is configured yet. (If you intend to shut down your compute instance, be sure to return to stop Vaultwarden first.)
{{< /note >}}

Step 5: Enable the NGINX Proxy Configuration

Now that Vaultwarden is running and the admin interface is accessible, it’s time to configure NGINX as a reverse proxy. This allows Vaultwarden to be accessed securely via your domain name (e.g., https://your-domain.com) instead of a raw IP and port.

```command
sudo ln -s /etc/nginx/sites-available/vaultwarden /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
If `nginx -t` returns **“syntax is ok”** and **“test is successful,”** your proxy is active.

Validation Check:

After running `sudo nginx -t`, look for both confirmation lines. If they appear, your proxy configuration is valid and ready to reload. If not, NGINX will point to the error line--fix it before proceeding.

{{< note >}}
If you see a warning about a deprecated `version:` line in your `docker-compose.yml`, it’s safe to remove it. Docker Compose now infers behavior automatically.
{{< /note >}}

Final Verification:

- Visit http://your-domain.com in a browser. You should see the Vaultwarden login screen.
- If not, check:
- `docker ps` -- confirm Vaultwarden is running
- `sudo journalctl -u nginx` -- review logs for errors
```
{{< note >}}
If the Vaultwarden login screen appears and no errors are shown in `journalctl` your HTTPS proxy setup is complete.
{{< /note >}}

Step 6: Enable HTTPS with Certbot

Once Vaultwarden is accessible via HTTP, you can optionally enable HTTPS for secure access.

HTTPS Setup with Cerbot (Requires DNS):
```command
sudo certbot --nginx -d your-domain.com
```
Certbot will:
- Prompt you for an email address and agreement to terms.
- Automatically configure TLS for NGINX
- Set up automatic certificate renewal

{{< note >}}
Before running Certbot, ensure your domain's DNS records point to your server's public IP. You can verify this with a DNS lookup to or by running`dig your-domain.com+short`.
{{< /note >}}

If Certbot completes successfully and reloads NGINX, HTTPS is now active. You can access Vaultwarden securely fia`https//your-domain.com`.

Step 7: Recovery: Fix Redirect Loop

If HTTPS access fails or redirects endlessly, don’t panic. This is often caused by a mismatch between Vaultwarden’s internal domain setting and NGINX’s proxy configuration. You can recover—step by step.

To fix Vaultwarden’s .env file open your .env file:
```command
sudo nano .env
```
Update the `DOMAIN` line to use HTTPS:
```env
DOMAIN=https://your-domain.com
```
Then restart Vaultwarden:
```command
docker compose down
docker compose up -d
```
Confirm NGINX is proxying HTTPS

If you used a separate config file (e.g., /etc/nginx/sites-available/vaultwarden), ensure it includes:

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

Then restart NGINX:
```command
sudo systemctl restart nginx
```

Retest:
```command
curl -v https://your-domain.com
```
If you see HTML output from Vaultwarden, the issue is resolved.

## Deploy Vaultwarden with Docker Compose

With Docker CE and the Compose plugin installed and validated, you're ready to deploy Vaultwarden using Docker Compose. This section walks through creating the configuration, launching the container, and verifying the setup.

1. Create a directory for Vaultwarden

This keeps your deployment organized and isolated.
```command
mkdir ~/vaultwarden
cd ~/vaultwarden
```

2. Create a `docker-compose.yml` file

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
This configuration exposes Vaultwarden on host port 3012 (mapped to port 80 inside the container) and stores its data in a local `vw-data` folder. This leaves port 80 for use by Nginx reverse proxy traffic without conflicts. You can customize ports or add environment variables--such as SMTP, admin tokens, or HTTPS--later in the setup.
{{< /note >}}

3. Start Vaultwarden
```command
docker compose up -d
```

This launches Vaultwarden to run in the background. You can now check status via your server’s IP address or domain name.

4. Verify the container is running
```command
docker ps
docker logs vaultwarden
```
You should see output like:
```output
CONTAINER ID    IMAGE                        STATUS       PORTS
abc123          vaultwarden/server:latest    Up           0.0.0.0:80->80/tcp
```
{{< note >}}
If `docker ps` shows your Vaultwarden container as "Up" and `docker logs vaultwarden` shows no errors, your deployment is successful.
{{< /note >}}

## Updating Vaultwarden

It is good to check for updates often to ensure you have the latest solutions. Subscribe to the [Vaultwarden GitHub releases](https://github.com/dani-garcia/vaultwarden/releases) to stay informed (be sure to read what is being updated). To update Vaultwarden to the latest version:

1. Navigate to your compose directory:
```command
cd ~/vaultwarden
```

2. Pull the latest image and recreate the container:
```command
docker compose pull
```
3. Stop the running container:
```command
docker compose down
```
4. Recreate and start the updated container:
```command
docker compose up -d
```
This downloads the newest version and restarts Vaultwarden with minimal downtime.

{{< note >}}
**See a warning?** Docker Compose may show warnings about deprecated keys or ignored attributes. These usually don't affect functionality. For example, you might see:

WARN[0000] /root/vaultwarden/docker-compose.yml: the attribute version is obsolete, it will be ignored, please remove it to avoid potential confusion

This means the `version:` line in your `docker-compose.yml` file is no longer needed. You can safely delete it—Docker Compose now auto-detects the format and doesn’t require a version declaration.

For details, see the Docker [Compose file reference](https://docs.docker.com/reference/compose-file/) to know what's safe to ignore and what might need attention.
{{< /note >}}

## Optional: Set an Admin Token

Vaultwarden supports an admin interface for managing users and settings. To enable it:

1. Generate a secure admin token:

You can use openssl or any password generator:
```command
openssl rand -base64 32
```

2. Add the token to your Compose file

Open your `docker-compose.yml` file and find the `environment:` section under the `vaultwarden` service. Then add this line:

```command
ADMIN_TOKEN: your_generated_token_here
```
Your updated section should look like this:

```
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

Replace `your_generated_token_here` with the secure admin token you created using `openssl rand -base64 32`.

3. Restart the container
```command
docker compose down
docker compose up -d
```
If the admin interface loads and accepts your token, your configuration is complete. You can now manage Vaultwarden setting securely.

{{< note >}}
Keep your admin token secure. Anyone with access to it can modify Vaultwarden settings.
{{< /note >}}

Final Validation Checklist

- [ ] Vaultwarden is running and bound to 127.0.0.1:3012 (host->container:80)
- [ ] NGINX is installed and configured to proxy to Vaultwarden
- [ ] TLS is enabled via Certbot (optional but recommended)
- [ ] You can access Vaultwarden securely via your domain 'https://your-domain'

## Security Hardening

Reinforce your Vaultwarden instance against common threats--even before DNS is active:

### Disable Unused Endpoints

If you don't need the admin interface:
- Set`ADMIN_TOKEN` to an empty string or omit it entirely in `docker-compose.yml`
- Or disable it via environment variable:
```command
environment:
  - ADMIN_TOKEN=
```
- Use a strong admin token if enabling the admin interface
- Restrict access via firewall or NGINX rules
- Consider fail2ban or rate limiting for brute-force protection

Vaultwarden is lightweight but powerful — with a few simple tweaks, you can significantly reduce your attack surface.

## Backup Strategy

Vaultwarden stores all critical data in the  directory. This includes your encrypted vault, configuration files, and any attachments. To ensure resilience and peace of mind:

- Back up the entire volume regularly.
- Use tools like `rsync`, `cron`, or a cloud sync service to automate backups.
- Store at least one copy offsite (e.g., cloud storage or external drive).
- Avoid relying solely on VM snapshots—they’re more fragile and harder to restore.
- Restoring is simple: stop the container, reattach the backed-up volume, and restart. No database recovery steps are needed:
```command
docker stop vaultwarden
```
Replace the`/vw-data/` volume with your backup (if your backup is a folder):
```command
sudo cp -r /path/to/backup/* /vw-data/
```
If your backup is a tarball:
```command
sudo tar -xvzf vaultwarden-backup.tar.gz -C /vw-data/
```
If using `restic` or another encrypted tool, `decrypt and restore to /vw-data/`.

Ensure correct permissions:
```command
chown -R 1000:1000/vw-data/
```
`1000:1000` is the default UID/GID Vaultwarden uses. Adjust if your container uses a different user.

Restart the container:
```command
docker start vaultwarden
```
Your secrets remain safe as long as `/vw-data/` is backed up. Vaultwarden picks up restored data automatically and is designed to be lightweight and resilient, with straightforward restore procedures.

For practical guidance on backup and restore strategies, see:
[Vaultwarden Backup and Restore – Memos for Admins Vaultwarden part 4/4: Backup and Restore | Memos for Admins](https://www.memosforadmins.com/post/vaultwarden4/).
Or, explore the official GitHub Wiki on Vaultwarden backups:
[Backing up your vault - dani-garcia/vaultwarden GitHub Wiki](https://github-wiki-see.page/m/dani-garcia/vaultwarden/wiki/Backing-up-your-vault).

## Update Hygiene

The official [Vaultwarden update guide](https://github-wiki-see.page/m/dani-garcia/vaultwarden/wiki/Updating-the-vaultwarden-image) confirms this exact process for safely updating Vaultwarden and Docker, and recommends checking for updates monthly.

- Use the following safe update sequence:
```command
docker pull vaultwarden/server:latest
docker stop vaultwarden
docker rm vaultwarden
docker run -d --name vaultwarden
  -v /vw-data/:/data/
  -p 80:80 vaultwarden/server:latest
```
- `-v /vw-data/:/data`ensures persistent data is preserved.
- `-p 80:80` maps container port80 to host port 80, which is standard unless you've customized it (e.g., using HTTPS or reverse proxy).

Your data is preserved via the mounted volume.

{{< note >}}
Updates are safe and simple — just make sure your data volume is mounted correctly, and you’re good to go.
{{< /note >}}

## Optional Enhancements

Once your core Vaultwarden setup is stable, consider these upgrades to improve performance, security, and flexibility:

- **Enable WebSocket support** (`-p 3012:3012`) for real-time sync between clients and the server.
- **Add two-factor authentication (2FA)** via Vaultwarden’s admin panel to strengthen account protection.
- **Integrate with a VPN or private DNS** to isolate traffic and enhance privacy.
- **Consider switching to Caddy as a reverse proxy** for automatic HTTPS and simplified certificate management.

Vaultwarden is flexible — enhance it in ways that fit your workflow and threat model.
