---
slug: install-subversion-on-ubuntu-24-04
title: "Install Subversion on Ubuntu 24.04"
title_meta: "Install Subversion on Ubuntu 24.04"
description: "Step-by-step guide for installing Subversion on Ubuntu 24.04 with contributor-safe practices"
authors: ["Diana Hoober"]
contributors: ["Diana Hoober"]
published: 2025-09-29
modified: 2025-09-29
keywords: ["Subversion", "Ubuntu 24.04", "installation", "version control system", "contributor-safe", "apache"]
license: "[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/)"
---

Subversion (SVN) is a centralized version control system used to track changes in files and directories. While Git has become the dominant tool for distributed workflows, Subversion remains widely used in legacy systems, enterprise environments, and collaborative documentation projects.

## Before You Begin

This guide outlines multiple installation paths for Apache Subversion (SVN) on Ubuntu 24.04, tailored to real-world contributor scenarios. It skips long configuration dumps in favor of modular steps with links to deeper resources to support a clean starting point.

## System Prerequisites

Root or sudo permissions are required for installing packages, configuring Apache, and managing repository permissions.

- Ubuntu 24.04 LTS system (fresh or upgraded)
- Internet access
- Optional: Apache (`apache2`) if serving SVN over HTTP/WebDAV
  - **Fresh install:** Apache must be installed explicitly using `sudo apt install apache2`.
  - **Upgraded system:** Apache may already be present; validate and restart as needed.
    ```
    sudo systemctl restart apache2
    apache2ctl -M | grep dav_svn
    ```

### Subversion Components by Role

| **Role**                                           | **Required Components**                      | **Use Case**                                                                 |
|----------------------------------------------------|----------------------------------------------|------------------------------------------------------------------------------|
| Client-only user connecting to an external server  | `subversion`                                 | Accesses a remote repository to checkout, update, and commit changes        |
| User hosting a repository for others               | `subversion`, `libapache2-mod-svn`, `apache2` | Hosts a Subversion server others can access; may also use client locally    |
| Team of developers working locally                 | `subversion`, `libapache2-mod-svn`, `apache2` | Hosts and accesses repository on same machine; supports multi-user workflow |

Contributor-Safe Notes
•	The client-only setup is lean and ideal for contributors who don’t need to host anything.
•	The server setup requires Apache modules (mod_dav_svn) and configuration for access control.
•	The local team setup is useful for small groups sharing a single machine or LAN-based repo.

## Choose Your Path

Follow the installation path that matches your needs:

- **Path A: [Client-Only Setup](#client-only-setup)** - You need to connect to an existing remote Subversion repository. Install only the `svn` client.

- **Path B: [Fresh Server Installation](#fresh-server-installation)** - You're setting up a new Subversion server with Apache for your team. Install Apache, Subversion, and mod_dav_svn.

- **Path C: [Upgrade from Ubuntu 22.04](#upgrade-from-ubuntu-2204)** - You're upgrading your system and need to validate or reconfigure existing SVN setup.

- **Path D: [Restore or Migrate Server](#restore-or-migrate-a-local-svn-server)** - You're restoring from backup or migrating to a new server. (Advanced - consider as separate guide)

Each path is self-contained. Choose one and follow it from start to finish.

## Install Apache Web Server (Optional)

If you're using Apache to serve Subversion repositories over HTTP:
```
    sudo apt update
    sudo apt install apache2 libapache2-mod-svn
    sudo systemctl enable apache2
    sudo systemctl start apache2
```

{{< note >}}
If you're using SSH access only, you can skip Apache and the `libapache2-mod-svn` package.
{{< /note >}}

To confirm Apache is running:
```
    systemctl status apache2
```
If you see `active (running)`, you're ready to configure the repo path in Step 3.

## Install or Update Subversion

To install Subversion and its required packages on Ubuntu 22.04 or later:
```
    sudo apt update
    sudo apt install subversion
```
## Client-Only Setup

For contributors who need to interact with an existing Subversion repository hosted elsewhere.

**Install the SVN Client**
```
    sudo apt update
    sudo apt install subversion
```
There is no need to install Apache or create local repositories--this setup is for accessing remote SVN servers only.

### Common Remote Access Patterns

**HTTPS-based access**:
```
    svn checkout https://your domain.com/svn/project
    svn update
```

**SSH-based access**:
```
    svn checkout svn+ssh://youruser@yourdomain.com/var/svn/project
```
SSH access may require key setup and permissions. For HTTPS, ensure credentials are valid and the server supports WebDAV.

### Validate Client Setup

```
    svn --version
```

You should see the installed version and supported protocols.

**External Reference**

For deeper usage examples and command options, refer to:

[Subversion Quick Start](https://subversion.apache.org/quick-start.html)
[SVN Book - Remote Access](https://svnbook.red-bean.com/en/1.7/svn.serverconfig.html)

## Fresh Server Installation

For users starting from a clean system with no prior SVN setup. Install required packages:

```
    sudo apt update
    sudo add-apt-repository universe
    sudo apt install subversion apache2 libapache2-mod-svn
    sudo systemctl restart apache2
```

**Create a new repository**

```
    sudo mkdir -p /var/svn/project
    sudo svnadmin create /var/svn/project
    sudo chown -R www-data:www-data /var/svn/project
```

For a minimal Apache configuration, edit `/etc/apache2/mods-enabled/dav_svn.conf` and add this block:

```
<Location /svn>
  DAV svn
  SVNParentPath /var/svn
  AuthType Basic
  AuthName "SVN Repository"
  AuthUserFile /etc/apache2/dav_svn.passwd
  Require valid-user
</Location>
```

If the file already contains a `<Location>` block, review it before adding this to avoid conflicts.

Then create a user:

```
    sudo htpasswd -cm /etc/apache2/dav_svn.passwd yourusername
```

{{< note >}}
This creates the first user for SVN access via Apache. This user is authenticated for Apache access but is not an SVN administrator by default. To grant admin privileges, configure access controls in your `authz` file or assign filesystem ownership. To add more users later, rerun the command without the `-c` flag:
```

    sudo htpasswd -m /etc/apache2/dav_svn.passwd anotheruser
```
{{< /note >}}

Restart Apache again:

```
    sudo systemctl restart apache2
```

### Validate Setup

```
    svn --version
    apache2ctl -M | grep dav_svn
```

You should see `dav_svn_module` listed.

## Upgrade from Ubuntu 22.04

For those who are upgrading their system and retaining or reconfiguring an existing SVN setup.

**Upgrade the OS**

Run the Ubuntu release upgrade tool:

```
    sudo apt update
    sudo do-release-upgrade
```

This upgrades your system to Ubuntu 24.04 LTS. Follow prompts and reboot when complete.

**Reinstall or Validate SVN and Apache**

After reboot, run:

```
    sudo apt update
    sudo apt install subversion apache2 libapache2-mod-svn
```

If Apache was already installed, this ensure the SVN module is present and compatible.

**Restart Apache and Confirm Module**

```
    sudo systemctl restart apache2
    apache2ctl -M | grep dav_svn
```

You should see `dav-svn-module` listed.

### Validate Existing Repositories

If you had repositories before the upgrade:
```
    sudo chown -R www-data:www-data /var/svn
    svnadmin verify /var/svn/project
```
Then, reapply ownership and verify integrity. No need to recreate repositories unless corruption is detected.

### Optional: Recheck Apache Configuration

Open `/etc/apache2/mods-enabled/dav_svn.conf` and confirm paths and permissions. If unchanged, no edits are needed.

## Restore or Migrate a Local SVN Server

Whether you're restoring from backup or migrating to a new server, start by preparing the destination system.

### Step 1: Prepare the Target System

- Install Subversion and required system packages (see Install or Update section).

- *Optional: Create a dedicated SVN admin user for ownership and SSH access.*

```
    sudo useradd -m -s /usr/bin/git-shell svnuser
```

{{< note >}}
This SVN admin is a dedicated user for managing repositories--not a system administrator. You can define their access level using `authz` rules or filesystem permissions.
{{< /note >}}

- Create a placeholder repo directory (e.g., /srv/svn/projectname) if restoring from filesystem snapshot or hotcopy.
- Ensure correct file ownership
```
    chown -R svnuser:svnuser /srv/svn
```
before restoring data.

- *If migrating to a new server*, confirm that the hostname, IP, and firewall rules match your intended access method (e.g., HTTP or SSH).
- *If restoring to a shared machine*, set group ownership and permissions carefully:

    ```
    chown -R svnuser:devteam /srv/svn
    chmod -R g+rw /srv/svn
    ```

    Consider setting `umask 002` for collaborative edits.

- *If using Apache*, ensure `mod_dav_svn` is installed and enabled before restoring. You’ll re-map the repo path in Step 3 (Validate Restore and Server Setup).

### Step 2: Restore from Backup

Choose the restore method that matches your backup format. All methods assume the target system is prepared (see Step 1 Prepare the Target System).

**Option A: Restore from .dump File**

```
    svnadmin create /srv/svn/projectname
    svnadmin load /srv/svn/projectname < /path/to/backup.dump
```

Creates a fresh repo and loads historical data.
Preserves commit history and UUID unless overridden.

**Option B: Restore from Hotcopy**

```
    cp -r /path/to/hotcopy /srv/svn/projectname
```

This is the fastest method if source and target OS match.
Preserves hooks, config, and UUID.

**Option C: Restore from Filesystem Snapshot**

Mount or extract snapshot to `/srv/svn/projectname`.
Validate file integrity and permissions post-restore.

**Footnotes:**

If restoring to a new server, confirm that the repo UUID matches expected value:

```
    svnlook uuid /srv/svn/projectname
```

    If needed, override with:

```
    svnadmin setuuid /srv/svn/projectname NEW-UUID
```

If using Apache, ensure svn.conf or httpd.conf maps to the restored path:

```
    SVNPath /srv/svn/projectname
```

If restoring to a shared machine, reapply group ownership:

```
    chown -R svnuser:devteam /srv/svn/projectname
    chmod -R g+rw /srv/svn/projectname
```

### Step 3: Validate Restore and Server Setup

After restoring the repository, confirm that the server is ready to serve it—whether via local access, Apache, or SSH.

#### Local Validation (No Apache Required)

```
    svn info file:///srv/svn/projectname
```

- Confirms that the repo is readable and intact.
- Shows UUID, revision count, and last changed date.

#### Apache Validation (If HTTP Access Is Configured)

```
    svn info http://yourserver/svn/projectname
```

- Confirms that Apache is serving the repo correctly.
- Requires correct `SVNPath` mapping and authentication setup.

#### SSH Validation (If Using `svn+ssh://`)

```
    svn info svn+ssh://yourserver/srv/svn/projectname
```

- Confirms shell access and repo visibility via SSH.
- Requires SSH key setup and shell access to `svnserve`.

**Footnotes**

*If* `svn info` fails, check file permissions and ownership:

```
    ls -la /srv/svn/projectname
```

- Ensure `svnuser` has read/write access.

*If Apache returns 403 or 404, check*:

    - `SVNPath` or `SVNParentPath` in `svn.conf`
    - `.htpasswd` and `<Location>` block syntax
    - Apache error logs: `journalctl -u apache2` or `tail -f /var/log/apache2/error.log`

*If SSH fails*, confirm:

    - SSH public key is in `~/.ssh/authorized_keys` on the server
    - `svnserve` is installed and accessible
    - Shell access is allowed for the target user

### Step 4: Reconfigure Apache or SSH Access

After restoring the repository, update your access configuration to reflect the new server paths, users, or hostname.

Update Apache Config for Apache (HTTP Access):

Edit your Subversion config file (e.g., `/etc/apache2/sites-available/svn.conf`):

```
<Location /svn/projectname>
  DAV svn
  SVNPath /srv/svn/projectname
  AuthType Basic
  AuthName "SVN Project"
  AuthUserFile /etc/apache2/dav_svn.passwd
  Require valid-user
</Location>
```
#### Restart Apache

```
    sudo systemctl restart apache2
```

#### Validate

```
    svn info http://yourserver/svn/projectname
```

## SSH (svn+ssh:// Access)

**Footnotes**

*SSH Setup for Contributors*

To enable `svn+ssh://` access, each contributor must:

1. Generate an SSH key pair (if they don’t already have one):

```
    ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. Copy their public key to the server:

```
    ssh-copy-id username@yourserver
```

    Or manually append to `~/.ssh/authorized_keys`.

3. Confirm shell access and repo visibility:

```
    ssh username@yourserver
    svn info /srv/svn/projectname
```

4. Use the correct access URL:

```
    svn checkout svn+ssh://yourserver/srv/svn/projectname
```

- Optional: Restrict the `svn` user’s shell for security:

```
    useradd -m -s /usr/bin/git-shell svnuser
```

5. Confirm `svnserve` is Installed
    which svnserve

*Set Up SSH Access*

Ensure your contributor’s public key is in `~/.ssh/authorized_keys` on the server.

**Launch `svnserve` (Optional Daemon Mode)**

```
    svnserve -d -r /srv/svn
```

**Validate**

```
    svn info svn+ssh://yourserver/srv/svn/projectname
```

**Footnotes**

- *If migrating to a new hostname*, contributors may need to run:

```
    svn switch --relocate OLD_URL NEW_URL
```

  This updates local working copies without re-checkout.

- *If using Apache*, confirm that `mod_dav_svn` is enabled:

```
    sudo a2enmod dav
    sudo a2enmod dav_svn
```

- *If using SSH*, consider creating a dedicated svn user with restricted shell access for security:

```
    useradd -m -s /usr/bin/git-shell svnuser
```

### Step 5: Contributor Validation and Local Checkout

Once the server is restored and access is configured, contributors should validate access and update their local working copies.

**Fresh Checkout**

```
    svn checkout http://yourserver/svn/projectname
or
    svn checkout svn+ssh://yourserver/srv/svn/projectname
```

    - Ensures clean sync with the restored repo.
    - Validates authentication and access method.

**Relocate Existing Working Copy**

If the repo URL changed (e.g., new hostname or protocol), contributors can run:

```
    svn switch --relocate OLD_URL NEW_UR
```

Avoids full re-checkout.

Preserves local changes and history.

**Footnotes**

- *If contributors report UUID mismatch*, they may need to re-checkout or ask the repository administrator to override the UUID using:

```
    svnadmin setuuid /srv/svn/projectname NEW-UUID
```

- *If using SSH*, ensure contributors have shell access and are using the correct repo path. You can validate with:

```
    svn info svn+ssh://yourserver/srv/svn/projectname
```

- *If using Apache*, confirm that `.htpasswd` is updated and that contributors are using the correct realm name.

#### Verify the Required Packages by Role

| **Role**                          | **Packages to Install**                              | **Purpose**                                                                 |
|-----------------------------------|-------------------------------------------------------|------------------------------------------------------------------------------|
| Client-only user                  | `subversion`                                          | Provides the `svn` client for interacting with remote repositories          |
| Server host (Apache-based)        | `subversion`, `apache2`, `libapache2-mod-svn`         | Hosts a Subversion repo via Apache; enables HTTP access and user control    |
| Local team (shared machine setup) | `subversion`, `apache2`, `libapache2-mod-svn`         | Supports both hosting and local access for multi-user collaboration         |

## Troubleshooting

### Common Errors and Contributor-Safe Resets

| **Error Message**                  | **Likely Cause**                                      | **Contributor-Safe Fix**                                                                 |
|-----------------------------------|--------------------------------------------------------|-------------------------------------------------------------------------------------------|
| `403 Forbidden` (Apache)          | Missing or misconfigured `.htpasswd` or `<Location>` block | Check `AuthUserFile`, realm name, and restart Apache. Validate with `svn info`.          |
| `404 Not Found` (Apache)          | Incorrect `SVNPath` or repo missing                    | Confirm repo path exists and matches Apache config. Restart Apache.                      |
| `svn: E170013`                    | Authentication failure or unreachable server           | Check credentials, SSH key setup, or Apache status. Try `svn info` with full URL.        |
| `svn: E155000`                    | Working copy mismatch or corrupted local state         | Run `svn cleanup`, or re-checkout if needed.                                             |
| `svn: E155007`                    | Path is not a working copy                             | Confirm you're inside a valid working copy. Use `svn info` or `svn status`.              |
| UUID mismatch                     | Repo was recreated or restored with a different UUID   | Use `svnadmin setuuid` to match expected UUID, or re-checkout with updated URL.          |
| `svnserve` not found              | SSH access fails due to missing binary                 | Install `subversion` on server and confirm `svnserve` is in `$PATH`.                     |
| Permission denied (SSH)          | SSH key missing or wrong user                          | Re-add public key to `authorized_keys`, confirm shell access, and test with `ssh`.       |

## References

- If contributors are unsure of whether to re-checkout or relocate, recommend:
    svn switch --relocate OLD_URL NEW_URL

This preserves local changes and avoids unnecessary resets.

- If Apache logs are unclear, use these commands for more information:
    journalctl -u apache2
    tail -f /var/log/apache2/error.log

- If SSH access is flaky, validate with:
    ssh -v username@yourserver

### 🔗 Additional Resources

| **Topic**                      | **Resource**                                                                 | **Why It’s Useful**                                                                 |
|-------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Subversion Admin Guide        | [Apache Subversion Documentation](https://subversion.apache.org/docs/)     | Searchable documentation index                   |
| Apache + SVN Integration      | [httpd, the Apache HTTP Server](https://svnbook.red-bean.com/en/1.7/svn.serverconfig.httpd.html) | How Apache serves SVN repos via mod_dav_svn                    |
| `svnserve` Usage              | [SVNserve Overview](https://svnbook.red-bean.com/en/1.7/svn.serverconfig.svnserve.html) | Detailed guide to advanced daemon configuration, access control, and SSH tunneling configuration                           |
