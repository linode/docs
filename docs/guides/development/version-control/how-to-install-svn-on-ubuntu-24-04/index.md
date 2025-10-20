---
slug: how-to-install-svn-on-ubuntu-24-04
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

This guide outlines multiple installation paths for Apache Subversion (SVN) on Ubuntu 24.04, and is tailored to the real-world contributor scenario for **Fresh Server Installation**. It skips long configuration dumps in favor of modular steps with links to deeper resources to support a clean starting point.

## System Prerequisites

Root or sudo permissions are required for installing packages, configuring Apache, and managing repository permissions.

- Ubuntu 24.04 LTS system (fresh or upgraded). To verify:

```command
    lsb_release -a
```
 Expected output should show "Ubuntu 24.04 LTS"

- Internet access
- Optional: Apache (`apache2`) if you plan to serve SVN over HTTP/WebDAV
- Fresh systems will need to install Apache (covered in the installation steps below).
- Upgraded systems may already have Apache installed.

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

## Client-Only Setup (Path A)

For contributors who need to interact with an existing Subversion repository hosted elsewhere.

**Install the SVN Client**

```command
    sudo apt update
    sudo apt install subversion
```
There is no need to install Apache or create local repositories--this setup is for accessing remote SVN servers only.

**Validate Client Setup**

```command
    svn --version
```
You should see the installed version (1.14.3 on Ubuntu 24.04) and supported protocols including `ra_svn` (svn://), `ra_local` (file://), and `ra_serf` (http:// and https://).

### Common Remote Access Patterns

**HTTPS-based access**:

```command
    svn checkout https://your domain.com/svn/project svn update
```

**SSH-based access**:

```command
    svn checkout svn+ssh://youruser@yourdomain.com/var/svn/project
```

{{< note >}}
- HTTPS access requires valid credentials, and the remote server must support WebDAV
- SSH access requires proper SSH key setup and file system permissions on the remote server
- On first connection, you'll be prompted to accept the server certificate (HTTPS) or host key (SSH)
{{< /note >}}

**External References**

For examples of more complex usage and server configuration details:

- [Subversion Quick Start](https://subversion.apache.org/quick-start.html)
- [SVN Book - Remote Access](https://svnbook.red-bean.com/en/1.7/svn.serverconfig.html)

## Fresh Server Installation (Path B)

For users starting from a clean system with no prior SVN setup.

**Install required packages**:

```command
    sudo apt update
    sudo add-apt-repository universe
    sudo apt install subversion apache2 libapache2-mod-svn
```

Pressing `[ENTER]` when prompted confirms that you want to add the universe repository.
For further details about what is installed, see the [Apache Subversion documentation](https://subversion.apache.org/docs/).

**Verify the Installation**

```command
    svn --version
    apache2 -v
```

Expected versions for Ubuntu 24.04: Subversion 1.14.x and Apache 2.4.x. If the versions differ verify you're on Ubuntu 24.04 with `lsb_release -a`.

**Enable and start Apache**:

```command
    sudo systemctl enable apache2
    sudo systemctl start apache2
```

**Verify Apache is running**

```command
    systemctl status apache2
```

You should see `active (running)`.

{{< note >}}
If you're using SSH access only, you can skip installing Apache and the `libapache2-mod-svn` package.
{{< /note >}}

**Create Your First Repository**

The following steps create a basic Subversion repository to verify your installation and demonstrate core functionality. This example uses `/var/svn/project` as the repository path and configures Apache to serve it over HTTP with basic authentication.

```command
    sudo mkdir -p /var/svn/project
    sudo svnadmin create /var/svn/project
    sudo chown -R www-data:www-data /var/svn/project
```

This creates a project folder, initializes it as an SVN repository by creating the internal structure (conf/, db/, hooks/, locks/ folders), and sets ownership of the repository directory and its contents which allows Apache to be able to:

-  Read the repository files
-  Write to the repository (when changes are committed)
-  And, access the db/, locks/, and other folders.

**Verify the Repository Structure and Ownership**

After each command:

```command
    ls -la /var/svn/project
```

You'll see these directories: `conf/`, `db/`, `hooks/`, `locks/` and owned by `www-data:www-data`.

For a minimal Apache configuration, open `/etc/apache2/mods-enabled/dav_svn.conf` in a text editor:

```command
    sudo nano /etc/apache2/mods-enabled/dav_svn.conf
```
and add this block to the end of the file:

```command
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

{{< note >}}
Alternatively, you can create a separate configuration file at `/etc/apache2/conf-available/svn.conf` with this content and enable it using `sudo a2enconf svn`, which keeps your custom configuration separate from the default module settings. Some recent guides recommend creating a separate config file to keep the default module config clean and make your custom configuration easier to manage.
{{< /note >}}

Then create your first SVN user for HTTP authentication (replace 'yourusername'with the name you want to use):

```command
    sudo htpasswd -c /etc/apache2/dav_svn.passwd yourusername
```

After running the command, you are prompted to:

1. Enter a password (choose a strong password and be sure to record it for future use).
2. Re-enter the password to confirm.

This will be used to authenticate access to your SVN repository using the web browser or HTTP clients.

{{< note >}}
The `-c` flag creates a new password file. **Use it only for the first user** - it will overwrite any existing file. To add additional users, omit the `-c` flag:

```command
    sudo htpasswd -m /etc/apache2/dav_svn.passwd anotheruser
```
You are again prompted to enter and confirm a password for the new user. If you are creating this account for another person, you can either:

    - Set a temporary password and communicate it securely to them (they cannot change it themselves via `htpasswd`).
    - Ask them to provide you with their desired password to enter during creation.

Unlike system accounts, there is no built-in "force password change on first login" mechanism for HTTP Basic Authentication. Users cannot change their own passwords - only administrators with server access can update passwords using the `htpasswd` command.

By default, `htpasswd` uses bcrypt encryption (more secure than the older `-m` MD5 option).

**Important:** These credentials are for SVN/Apache HTTP authentication only and are separate from system user accounts. Users created here can access the SVN repository but cannot log into the server itself.
{{< /note >}}

Restart Apache:

```command
    sudo systemctl restart apache2
```

### Validate Setup

Verify that SVN and the Apache module is loaded:

**Check SVN version**

```command
    svn --version
```

You should see the Subversion version information (e.g., version 1.14.3) along with available repository access modules.

**Verify that the Apache DAV SVN module is loaded:**

```command
    apache2ctl -M | grep dav_svn
```

You should see `dav_svn_module` in the output.

**Test repository access**

Open your web browser and navigate to :

    http://your-server-ip/svn/project

You should:

1. Be prompted for authentication (username and password you created).
2. Enter the credentials yiou created with 'htpasswd'.
3. See a page displaying **"project - Revision 0: /"** with "Powered by Apache Subversion

The repository will show Revision 0 because it's empty - no files have been committed yet. This is normal and confirms your setup is working correctly.

**Troubleshooting**

If you encounter issues:
- **404 Not Found**: Verify your Apache configuration in `/etc/apache2/mods-enabled/dav_svn.conf` contains the `<Location /svn>` block and restart Apache
- **403 Forbidden**: Check repository ownership with `ls -la /var/svn/project` - it should be owned by `www-data:www-data`
- **Authentication fails**: Verify the password file exists at `/etc/apache2/dav_svn.passwd` and check Apache error logs: `tail -20 /var/log/apache2/error.log`
- **500 Internal Server Error**: Run `apache2ctl configtest` to check for configuration syntax errors

## Upgrade from Ubuntu 22.04 (Path C)

For those who are upgrading their system and retaining or reconfiguring an existing SVN setup.

**Before You Start**

Document your current SVN configuration before upgrading. Run these commands and save the output:

```command
    svn --version
    ls -la /var/svn/
    cat /etc/apache2/mods-enabled/dav_svn.conf
```
{{< note >}}
Record the SVN version (typically **1.14.1** on Ubuntu 22.04). You'll compare this after the upgrade to confirm the update to version 1.14.3 on Ubuntu 24.04. If you have custom configurations in your `dav_svn.conf` file, consider backing up the file:

```command
    sudo cp /etc/apache2/mods-enabled/dav_svn.conf/ root/dav_svn.conf.backup
```
{{< /note >}}

**Prepare the System**

Ensure all packages are up to date and reboot if necessary:

```command
    sudo apt update && sudo apt upgrade -y
```
If the system indicates a reboot is required (common after kernel updates), reboot your system now:

```command
    sudo reboot
```
Wait for the system to restart and reconnect before proceeding.

**Upgrade the OS**

Ensure your system is current, then run the Ubuntu release upgrade tool:

```command
    sudo apt update
    sudo do-release-upgrade
```

The upgrade process will:

- Download and install Ubuntu 24.04 packages (this may take 30-60 minutes)
- Prompt you about configuration files multiple times during the upgrade
  - For **Apache files** (`apache2.conf`, `000-default.conf`, `dav_svn.conf`): Choose **"keep your current version"** or press `N` to preserve your SVN configuration
  - For **SSH files** (`sshd_config`): Choose **"keep your current version"** to maintain access
  - For other system files (like `grub`): The default is usually to keep your current version - press Enter to accept
  - **General rule**: When in doubt, keep your current version to preserve your working configuration
- Prompt you about service restarts - accept the defaults
- Require a reboot when complete

**Important:** When the upgrade completes, reboot your system:

```command
    sudo reboot
```

Wait for the system to come back online before proceeding to the next step.

**After reboot: Validate the Upgrade**

Once the system restarts, log back in and verify you're on Ubuntu 24.04:

```command
    lsb_release -a
```

You should see **Ubuntu 24.04.3 LTS**.

**Verify SVN Upgraded Successfully**

Check the SVN version:

```command
    svn --version
```

You should see **version 1.14.3** (upgraded from 1.14.1 on Ubuntu 22.04).

**Confirm Apache SVN Module**

Verify the Apache SVN module is still loaded:

```command
    apache2ctl -M | grep dav_svn
```

You should see `dav_svn_module (shared)` listed.

**Validate Existing Repositories**

Verify your repository integrity and permissions:

```command
    ls -la /var/svn/testproject
    svnadmin verify /var/svn/testproject
```

The repository structure should be intact with `www-data:www-data` ownership. If permissions were changed during upgrade, restore them:

```command
    sudo chown -R www-data:www-data /var/svn
```

**Test Repository Access**

Open your browser and navigate to:

http://your-server-ip/svn/testproject

You should be able to authenticate and see your repository, now powered by Subversion 1.14.3.

### Troubleshooting Post-Upgrade Issues

**If Apache fails to start after upgrade:**

Check for module conflicts:

```command
    systemctl status apache2
```

If you see errors about missing PHP modules (e.g., `libphp8.1.so`), disable the problematic module:

```
    sudo a2dismod php8.1
    sudo systemctl restart apache2
```

**If SVN or Apache issues persist:**

Reinstall the packages:

```command
    sudo apt update
    sudo apt install --reinstall subversion apache2 libapache2-mod-svn
    sudo systemctl restart apache2
```

Verify the SVN module is loaded:

```command
    apache2ctl -M | grep dav_svn
```

## Restore or Migrate a Local SVN Server (Path D)

Whether you're restoring from backup or migrating to a new server, start by preparing the destination system.

### Step 1: Prepare the Target System

- Install Subversion and required system packages (see Install or Update section).

- *Optional: Create a dedicated SVN admin user for ownership and SSH access.*

```command
    sudo useradd -m -s /usr/bin/bin/bash svnuser
```

{{< note >}}
This SVN admin is a dedicated user for managing repositories-not a system administrator. You can define their access level using `authz` rules or filesystem permissions.
{{< /note >}}

- Create a placeholder repo directory (e.g., /srv/svn/projectname) if restoring from filesystem snapshot or hotcopy.
- Ensure correct file ownership before restoring data.

```command
    sudo chown -R svnuser:svnuser /srv/svn
```

- *If migrating to a new server*, confirm that the hostname, IP, and firewall rules match your intended access method (e.g., HTTP or SSH).
- *If restoring to a shared machine*, set group ownership and permissions carefully:

```command
    sudo chown -R svnuser:devteam /srv/svn
    sudo chmod -R g+rw /srv/svn
```

Consider setting `umask 002` for collaborative edits.

- *If using Apache*, ensure `mod_dav_svn` is installed and enabled before restoring. You’ll re-map the repo path in Step 3 (Validate Restore and Server Setup).

### Step 2: Restore from Backup

Choose the restore method that matches your backup format. All methods assume the target system is prepared (see Step 1: Prepare the Target System).

**Option A: Restore from .dump File**

```command
    svnadmin create /srv/svn/projectname
    svnadmin load /srv/svn/projectname < /path/to/backup.dump
```

- Creates a fresh repo and loads historical data.
- Preserves commit history and UUID unless overridden.

**Option B: Restore from Hotcopy**

```command
    cp -r /path/to/hotcopy /srv/svn/projectname
```

- This is the fastest method if source and target OS match.
- Preserves hooks, config, and UUID.

**Option C: Restore from Filesystem Snapshot**

- Mount or extract snapshot to `/srv/svn/projectname`.
- Validate file integrity and permissions post-restore.

**Additional Steps:**

- If restoring to a new server, confirm that the repo UUID matches expected value:

```command
    svnlook uuid /srv/svn/projectname
```

- If needed, override with:

```command
    svnadmin setuuid /srv/svn/projectname NEW-UUID
```

- If using Apache, ensure svn.conf or httpd.conf maps to the restored path:

```command
    SVNPath /srv/svn/projectname
```

- If restoring to a shared machine, reapply group ownership:

```command
    sudo chown -R svnuser:devteam /srv/svn/projectname
    sudo chmod -R g+rw /srv/svn/projectname
```

### Step 3: Validate Restore and Server Setup

After restoring the repository, confirm that the server is ready to serve it—whether via local access, Apache, or SSH.

#### Local Validation (No Apache Required)

```command
    svn info file:///srv/svn/projectname
```

- Confirms that the repo is readable and intact.
- Shows UUID, revision count, and last changed date.

#### Apache Validation (If HTTP Access Is Configured)

```command
    svn info http://yourserver/svn/projectname
```

- Confirms that Apache is serving the repo correctly.
- Requires correct `SVNPath` mapping and authentication setup.

#### SSH Validation (If Using `svn+ssh://`)

```command
    svn info svn+ssh://yourserver/srv/svn/projectname
```

- Confirms shell access and repo visibility via SSH.
- Requires SSH key setup and shell access to the repository path.

**Troubleshooting**

*If* `svn info` fails, check file permissions and ownership:

```command
    ls -la /srv/svn/projectname
```

- Ensure `svnuser` has read/write access.

*If Apache returns 403 or 404, check*:

    - `SVNPath` or `SVNParentPath` in `svn.conf`
    - `.htpasswd` and `<Location>` block syntax
    - Apache error logs: `journalctl -u apache2` or `tail -f /var/log/apache2/error.log`

*If SSH fails*, confirm:

    - SSH public key is in `~/.ssh/authorized_keys` on the server
    - Shell access is allowed for the target user
    - User has filesystem permissions to access the repository path

### Step 4: Reconfigure Apache or SSH Access

After restoring the repository, update your access configuration to reflect the new server paths, users, or hostname.

#### Option A: Configure Apache for HTTP Access

Edit your Subversion config file (e.g., `/etc/apache2/sites-available/svn.conf`):

```command
<Location /svn/projectname>
    DAV svn
    SVNPath /srv/svn/projectname
    AuthType Basic
    AuthName "SVN Project"
    AuthUserFile /etc/apache2/dav_svn.passwd
    Require valid-user
</Location>
```
Restart Apache:

```command
    sudo systemctl restart apache2
```

Validate Apache Access:

```command
    svn info http://yourserver/svn/projectname
```

#### Option B: Configure SSH Access

For `svn+ssh://` access, ensure proper permissions and validate connectivity:

1. Confirm contributors have SSH access to the server
2. Set filesystem permissions for the repository:

```command
    sudo chown -R svnuser:devteam /srv/svn/projectname
    sudo chmod -R g+rw /srv/svn/projectname
```

3. Validate SSH access:

```command
    svn info svn+ssh://yourserver/srv/svn/projectname
```

### Step 5: Contributor Validation and Local Checkout

Once the server is restored and access is configured, contributors should validate access and update their local working copies.

**Fresh Checkout**

```command
    svn checkout http://yourserver/svn/projectname
```
Or for SSH:

```command
    svn checkout svn+ssh://yourserver/srv/svn/projectname
```

- Ensures clean sync with the restored repo.
- Validates authentication and access method.

**Relocate Existing Working Copy**

If the repo URL changed (e.g., new hostname or protocol), contributors can run:

```command
    svn switch --relocate OLD_URL NEW_URL
```

- Avoids full re-checkout.
- Preserves local changes and history.

**Additional Notes**

- *If contributors report UUID mismatch*, they may need to re-checkout or ask the repository administrator to override the UUID using:

```command
    svnadmin setuuid /srv/svn/projectname NEW-UUID
```

- *If using SSH*, ensure contributors have shell access and are using the correct repo path. You can validate with:

```command
    svn info svn+ssh://yourserver/srv/svn/projectname
```

- *If using Apache*, confirm that `.htpasswd` is updated and that contributors are using the correct realm name.

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
| Permission denied (SSH)          | SSH key missing or wrong user                          | Re-add public key to `authorized_keys`, confirm shell access, and test with `ssh`.       |

## References

- If contributors are unsure of whether to re-checkout or relocate, recommend:

```command
     svn switch --relocate OLD_URL NEW_URL
```

This preserves local changes and avoids unnecessary resets.

- If Apache logs are unclear, use these commands for more information:

  ```command
      journalctl -u apache2
      tail -f /var/log/apache2/error.log
```

- If SSH access is flaky, validate with:

```command
    ssh -v username@yourserver
```

### Additional Resources

| **Topic**                      | **Resource**                                                                 | **Why It’s Useful**                                                                 |
|-------------------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| Subversion Admin Guide        | [Apache Subversion Documentation](https://subversion.apache.org/docs/)     | Searchable documentation index                   |
| Apache + SVN Integration      | [httpd, the Apache HTTP Server](https://svnbook.red-bean.com/en/1.7/svn.serverconfig.httpd.html) | How Apache serves SVN repos via mod_dav_svn                    |
