---
slug: create-limited-developer-account
author:
  name: Edward Angert
  email: docs@linode.com
description: Shows how to create an account with access restrictions for developers and maintainers.
keywords: ["accounts", "passwords", "linode manager", "manager", "security"]
tags: ["ssh","linode platform","drupal","security","mysql","wordpress"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2018-07-26
modified_by:
  name: Linode
published: 2018-07-26
title: Create an Account for a Developer to Work on Your Linode
aliases: ['/platform/create-limited-developer-account/']
---

One of the most powerful features of Linode's unmanaged service is the amount of control Linode users have over their account and the software installed on their systems. If you're a business owner that does not have expertise with installing or maintaining software on Linux, or if you do have experience with Linux but don't have the time to set up a new server, then contracting with a developer or administrator is a popular way to get your services up and running.

## What to Keep Track of when Hiring a Developer

When you hire someone to work on your Linode, there are a variety of ways to grant access to your Linode account, the Linodes on it, and the system and applications on your Linodes. Recording which of these credentials you've shared is important in the event that you need to end your contract with your developer.

This guide explains and answers some of the most frequently asked questions about account access. The sections are separated in order of granularity, starting with service-level access at the top, and working towards application-specific access.

For security and privacy, [Linode Support](/docs/guides/support/) is not able to troubleshoot issues related to users and application access. Instead, Linode offers an in-house [Professional Services](https://www.linode.com/products/pro-services/) team that can be hired to help with projects.

{{< note >}}
The following sections include commands that show how to manipulate credentials on your Linodes, and these commands use `exampleUser` in place of your users' names. Replace `exampleUser` with whatever you would like to name your users.
{{< /note >}}

## Linode Account Access

Access to the Linode Manager provides high-level methods for controlling your Linodes and Linode billing, including but not limited to: powering Linodes down, powering them on, removing Linodes, and adding Linodes. The Linode Manager does not have interfaces for manipulating the files and software on your systems--instead, that access is governed by service-specific credentials outlined in the next sections.

### Who Has Access to My Linode Account?

Log in to the Linode Manager and navigate to the [**Users and Permissions**](https://cloud.linode.com/account/users) section of the **Account** tab. You may be prompted to reauthenticate your password. This section will display all of your Linode account's users.

If you're not sure whether you're logged in as the account administrator, look for a `No` in the **Restricted** column of your username's row in the User Manager.

### Add a User to the Linode Account

Keep your account administrator credentials secret. When hiring an external individual or agency to work on your site or application, create a *restricted* user and assign specific access to the account. Learn more about how to manage users and permissions and how to recover a lost username in our [Accounts and Passwords](/docs/platform/accounts-and-passwords/#users-and-permissions) guide.

Useful *Global Grants* for a limited access user might include the ability to:

* Add a [NodeBalancer](/docs/products/networking/nodebalancers/).
* Add [Longview](/longview/) clients.
* Use the [DNS Manager](/docs/products/networking/dns-manager/) to add domains.
* Create [StackScripts](/docs/products/tools/stackscripts/).
* Create [Images](/docs/products/tools/images/).
* Add [Block Storage Volumes](/docs/products/storage/block-storage/).

### Revoke a User's Access to the Linode Account

1.  If you suspect that the user may have access to the Linode Manager password, [change that first](/docs/platform/manager/accounts-and-passwords/#changing-your-linode-manager-password).

1.  Log in to the [Linode Manager](https://cloud.linode.com/) and click [**Users and Permissions**](https://cloud.linode.com/account/users) in the **Account** tab. You may be prompted to reauthenticate your password.

1.  Locate the user in the Username column, and click the three dots and select **Delete** to remove the user. Click **Delete** to confirm deletion.

## SSH Logins

The primary method for directly administering files and software on a Linode is through SSH. SSH is a service running on your Linode which listens for and accepts remote terminal connections, and once a connection is opened a user can issue commands to your server. **Your Linode's SSH users are not the same as your Linode Manager users.**

For the steps in this section, [connect to your Linode via SSH](/docs/guides/set-up-and-secure/#connect-to-the-instance/) to log in to the system as `root`, which is the primary administrative (and most powerful) user on every Linux system. Alternatively, you can login as non-root user with *sudo* (i.e. administrative) permissions.

{{< note >}}
If you don't remember your root password, [reset it through the Manager](/docs/platform/accounts-and-passwords/#resetting-your-linode-manager-password).
{{</ note >}}

### Who Has SSH Access to Your Linode?

Use `getent` to display the list of users. Keep in mind that some applications create Linux users as part of their normal operation, and those users will be listed here too.

    getent passwd

### Add an SSH User

[Create a limited Linux user account](/docs/guides/set-up-and-secure/#add-a-limited-user-account) on your Linode. Set a unique and secure password for this user.

### Create a User Group with Specific Permissions

As an optional alternative to setting permissions for each user, create a limited privilege user group that can be reused and combined with other groups if needed.

1.  Add the group. Replace `devGroup` in these examples to a group name you'll remember:

        groupadd devGroup

1.  Add the user to the group and specify a new home directory for the user:

        usermod -g devGroup -d /var/www/html/example.com exampleUser

### Restrict a User to a Specific Directory

If your user should only have access to a specific directory and its subdirectories, for example `/var/www/html/example.com/`, use `chroot` *jails*, as described in the [Advanced SSH Security](/docs/security/advanced-ssh-server-security/#chroot-users) guide.

### Restrict a User to SFTP Only

For some applications, a user may only need to transfer files to or from the server. In this case, create a user that can transfer files through SFTP but that can't access the server with SSH.

{{< caution >}}
The steps in this section disable a user's SSH access. Do not follow the steps in this section for any user who needs SSH access.
{{< /caution >}}

Consult our guide to configure this using [SFTP jails on Debian or Ubuntu](/docs/guides/limiting-access-with-sftp-jails-on-debian-and-ubuntu/).

1.  Change the `sftp` subsystem line and add a `Match Group sftpOnly` section in `sshd_config`:

    {{< file "/etc/ssh/sshd_config" >}}
...
Subsystem sftp internal-sftp
...
Match Group sftpOnly
    ChrootDirectory %h
    X11Forwarding no
    AllowTcpForwarding no
    ForceCommand internal-sftp
{{< /file >}}

1.  Create an `sftpOnly` group that will only have SFTP access:

        groupadd sftpOnly

1.  Add a user to the group and disable their SSH access. Change both the user name and home directory:

        usermod -g sftpOnly -d /home/exampleUser -s /sbin/nologin exampleUser

1.  Restart the SSH service:

        systemctl restart ssh

1.  Change the ownership of the directory the user should have access to:

        chown -R exampleUser:sftpOnly /var/www/html/example.com

The user can now `sftp` to the system and transfer files to and from the specified directory.

### Revoke Access for an SSH User

To revoke access to an SSH user, change the password for that user:

    passwd exampleUser

In addition to password authentication, a user may rely on [public key authentication](/docs/guides/set-up-and-secure/#harden-ssh-access) to connect via SSH. For any users that you would like to revoke access on, you should also check for the presence of a public key.

These public keys are listed as line in a text file in the user's home directory named `/home/exampleUser/.ssh/authorized_keys`. To see which keys are present, run:

    cat /home/exampleUser/.ssh/authorized_keys

The output will resemble the following:

{{< output >}}
ssh-rsa MIIEpQIBAAKCAQEAqOT7+bo5YUnzmBJYifL5b/VrLhHNjI0Sjm0miyZ4HocvSjIJ+Kx1nWP1LjDG0wt6gimXjRrfPCykHFyJwdZO69dK/gJ0GdcejWtC1sJBCSvI9TISXISLBNXr5rLHedhR2wFOJTRkKTquHP5dw2o5UNBBMyuM0wfkv5ggw8ShecIuO6xCw7yYQIg66BIe2G5toL6uasVOBjvJv5iKWKQNx1sf5ICfDJdVjQojtfHiPAyufidAjm4qO4/jOyfTTncu5+IEJCk12YpO66H3COJwbjPcRXlAcHM4CrBdTb8TmYmmStetY5Lmso++OaD4QjlO2TrhIXjoXDccU7/1BpkdpnPiapPuGKlWYa1vLEeUoIYV6NC9rxJCiYd/V//rBupYt4hkbSAbKl3o24gl1qOw/U7p+yelAZmDVWQCqOOdz3RttXyO/MoET9v0z2+1/57/gxLpHdsrPli7SeyrWMax18GM8DyfjVG5DFxYb/V0uTeew3xVzwXL+OnRdfnIsliSPXkmv15Yqbh10AEarK0EjfHR/VOMEgozrRoL8g9t4Yt5xhiWpbG9wk/EKfj3eaVg2AssQcw6IhzsaS5Kj4qr6aj3I6nx4fhTGUdfvmGqRETR8Hcyg7cDZId9qXve5PVxtxE2ROoszpTLkls+rL7L6+e2y9qfO4Np1ssTWz8495QPojjoMUnMIm6ZTVALjudn+eQ== user@example.com
{{</ output >}}

Each SSH public key entry will begin with `ssh-rsa` and end with a corresponding email address (e.g. `user@example.com`).

To remove a public key, edit the `authorized_keys` file and remove the corresponding line. `nano` is a simple text editor in Linux that can be used to do this:

    nano /home/exampleUser/.ssh/authorized_keys

Use the cursor keys to navigate the file, enter `CTRL-O` to save the file, and enter `CTRL-X` to exit the editor.

If you instead want to fully remove the file, run:

    rm /home/exampleUser/.ssh/authorized_keys

{{< caution >}}
Files removed in this way can't be easily restored.
{{< /caution >}}

## Add or Remove WordPress Users

If your site runs WordPress, add a user with the appropriate permissions.

WordPress user roles are useful for authors and content contributors, but might not be enough for a developer to work on the site. If you don't feel comfortable sharing the existing administrator account credentials, create an administrator account.

1.  Log in to your WordPress admin, typically through `www.example.com/wp-admin` (where `example.com` is your site).

1.  Click **Users**, then **All users** to view a list of current users.

1.  To add a user:

    1.  Click **Add New**, enter the information, and for *Role*, select **Administrator**.
    1.  Click **Add New User**

    To revoke privileges or delete a user:

    1.  Click the check box next to the user's thumbnail.
    1.  To change the role:

        * Select a different role in **Change role to...**, then click **Change**.

        To delete the user:

        * Click **Bulk Actions**, select **Delete**, then click **Apply**. Click **Confirm Deletion** to delete the user.

## Add and Manage Drupal Users

Drupal's main administrator account is the **User 1** account. This account serves as the *root* user and can create other users with different *permissions* and *roles*.

Create a new user with administrative-level permissions to grant someone the necessary access to maintain your Drupal site.

1.  Log in to the Drupal admin (this may be through your site's `www.example.com/admin`), and click **Manage**, then **People** in the Admin menu.

1.  To create a user with administrative privileges, click **Add user** and fill out the information on the page that follows. Select the **Administrator** role when prompted.

To view a list of permissions allowed to the Administrator role, return to the **People** page and click **Permissions**.

### Configure Drupal Roles

If you don't feel comfortable granting the full list of administrative privileges, create a new Role that can be reused and applied to many users.

1.  Select the **Roles** tab, then click **Add role** and give the role an appropriate name on the next page. Click **Save** to return to the Roles list.

1.  To assign permissions to the new role, click the **Permissions** tab and locate the new role's column on the right.

1.  Create a new user as shown above and select the new role when prompted in Step 2.

### Remove a Drupal User or Revoke User Permissions

1.  Log in to the site's Drupal admin (this may be through your site's `www.example.com/admin`), and click **Manage**, then **People** in the Admin menu.

1.  Click **Edit** in the *Operations* column of the user's name.

1.  Change the role, or click **Cancel account** and then choose what should happen with the user's content of the page that follows.

    Once cancelled, the user will appear in the User List with a *Blocked* status.

## MySQL/MariaDB Database Access

In the background of most web servers is a database that keeps track of users, pages, and other information. The database is configured before a content management system (CMS) like WordPress or Drupal is installed.

While some systems allow the Linux root user to circumvent root database login, you may need to know the SQL root user's password for these steps.

### Log in to MySQL

1.  [SSH to your Linode](/docs/guides/set-up-and-secure/#connect-to-the-instance) as a user with sudo privileges.

1.  Connect to MySQL with `sudo`:

        sudo mysql -u root

### View Existing MySQL Database Users

To display users and their passwords:

    SELECT User, Host, Password FROM mysql.user;

### View Existing MySQL Databases

While logged in to MySQL:

    SELECT DATABASE();

### Change a MySQL or MariaDB User's Password

While logged in to MySQL:

1.  Use `FLUSH PRIVILEGES` before making changes:

        FLUSH PRIVILEGES;

1.  Set a new password for the user:

        ALTER USER 'exampleUser'@'localhost' IDENTIFIED BY 'newPassword';

    If using MariaDB, use the `SET PASSWORD` command:

        SET PASSWORD FOR 'exampleUser' = PASSWORD('newPassword');

### Remove a MySQL User

While logged in to MySQL:

    DROP USER 'exampleUser'@'localhost';

If using MariaDB:

    DROP USER exampleUser;

### Add a New MySQL User

Add a new user and grant them access to a specific database. If you are using a CMS and are concerned about access, update SSH login information. You do not need to create a new user, but it might help to update the database password. See the [Change WordPress Database Password in MySQL](#change-the-wordpress-database-password-in-mysql) section for more information.

While logged in to MySQL:

    CREATE USER 'exampleUser'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON databaseName.* TO 'exampleUser';

### Change the WordPress Database Password in MySQL

{{< caution >}}
This section changes the WordPress database password itself; not any WordPress user. This may affect your WordPress installation.
{{< /caution >}}

If you are only trying to change a WordPress user's login information, see the [WordPress Users](#wordpress-users) section. It is rare that anyone should need to modify the database password except in the case of a WordPress migration. Otherwise, it is not likely that you need to follow this section.

1.  Use the previous sections to log in to MySQL and find the WordPress database name and user. Replace `wordpress` and `wpuser` in this example with the appropriate names, and `newPassword` with a new secure password:

        ALTER USER 'wpuser'@'localhost' IDENTIFIED BY 'newPassword';
        FLUSH PRIVILEGES;
        quit

    If using MariaDB, use the `SET PASSWORD` command:

        SET PASSWORD FOR 'wpuser' = PASSWORD('newPassword');

1.  Edit your site's `wp-config.php` to reflect the changes:

    {{< file "/var/www/html/example.com/public_html/wp-config.php" php >}}
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress');

/** MySQL database username */
define('DB_USER', 'wpuser');

/** MySQL database password */
define('DB_PASSWORD', 'newPassword');

/** MySQL hostname */
define('DB_HOST', 'localhost');
{{< /file >}}
