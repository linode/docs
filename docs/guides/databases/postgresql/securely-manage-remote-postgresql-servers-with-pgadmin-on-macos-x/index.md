---
slug: securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x
title: "Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X"
title_meta: "Connect to Remote PostgreSQL Servers with pgAdmin on Mac"
description: "Use the Open-source PgAdmin Program to Securely Manage Remote PostgreSQL Databases from a Mac OS X Workstation."
authors: ["Linode"]
contributors: ["Linode"]
published: 2010-04-30
modified: 2024-11-21
keywords: ["pgadmin", "mac os x", "postgresql gui", "manage postgresql databases", "ssh tunnel"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['/databases/postgresql/pgadmin-macos-x/','/databases/postgresql/securely-manage-remote-postgresql-servers-with-pgadmin-on-macos-x/']
external_resources:
 - '[pgAdmin Documentation](http://www.pgadmin.org/docs/)'
 - '[PostgreSQL Documentation](http://www.postgresql.org/docs/)'
tags: ["database","postgresql"]
---

![Securely Manage Remote PostgreSQL Servers with pgAdmin on Mac OS X](Securely_Manage_Remote_PostgreSQL_Servers_with_pgAdmin_on_Mac_OS_X_smg.jpg)

pgAdmin is a free, open-source PostgreSQL database administration GUI for Microsoft Windows, Apple Mac OS X and Linux systems. It offers excellent capabilities with regard to database server information retrieval, development, testing, and ongoing maintenance. This guide will help you get up and running with pgAdmin on Mac OS X, providing secure access to remote PostgreSQL databases.

## Before You Begin

1.  If you have not already done so, create a Linode account and Compute Instance. See our [Getting Started with Linode](/docs/products/platform/get-started/) and [Creating a Compute Instance](/docs/products/compute/compute-instances/guides/create/) guides.

1.  Follow our [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to update your system. You may also wish to set the timezone, configure your hostname, create a limited user account, and harden SSH access.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Linux Users and Groups](/docs/guides/linux-users-and-groups/) guide.
{{< /note >}}

1. Install PostgreSQL on your Linode using one of the [PostgreSQL installation guides](/docs/databases/postgresql/).

## Install pgAdmin

1.  Visit the [pgAdmin download page](https://www.pgadmin.org/download/pgadmin-4-macos/) to obtain the most recent version of the program. Save the installer to your desktop and launch it. Read the license agreement and click the "Agree" to continue.

    ![pgAdmin on Mac OS X installer license agreement dialog](pg-admin-tos.png)

1.  After the program is installed, you'll see a pgAdmin icon in a Finder window. You may drag this to your Applications folder or your dock.

1.  Start the pgAdmin interface.

    ![pgAdmin on Mac OS X menu bar icon menu](pg-admin-welcome.png)

    A welcome page is displayed in the pgAdmin interface.


## Use pgAdmin

1. Open **pgAdmin 4**.
2. In the **Quick Links** section click **Add New Server**
3. Under the **General** tab:
   - Enter a name for your server connection. For example, `Linode PostgreSQL`.
4. Go to the **Connection** tab:
   - **Hostname/address**: `localhost`.
     The SSH tunnel redirects this to the Linode server.
   - **Port**: The PostgreSQL port on your Linode, typically `5432`.
   - **Maintenance Database**: `postgres` or your database name.
   - **Username**: Your PostgreSQL username. For example, `postgres`.
   - **Password**: The password for your PostgreSQL user.
5. Go to the **"SSH Tunnel"** tab:
   - **Use SSH tunneling**: Enable this option.
   - **Tunnel host**: Your Linode's IP address.
   - **Tinnel port**: `22` . The default SSH port is `22`.
   - **Username**: Your SSH username for the Linode instance.
   - **Authentication**: Choose `Identity file` if you are using an SSH key, or `Password` for password-based authentication.
   - **Identity file**: If you are using an SSH key, browse and select the private key file.
   - **Password**: If you are using password-based authentication, enter your SSH password.
6. Click **Save** to create the server connection.

### Verify Connection

1. After saving the configuration, right-click your new server in **pgAdmin** and select **Connect**.
2. If the connection is successful, you should see your databases listed in the **Servers** panel.

### Troubleshooting

- **SSH Access Issues**:
  Ensure your Linode firewall allows port `22`.

- **PostgreSQL Bind Address**:
  1. Check the PostgreSQL `postgresql.conf` file to confirm it's listening on `127.0.0.1` or `localhost`.
  Update `listen_addresses` if necessary:
  ```conf
  listen_addresses = 'localhost'
  ```
  1. Restart PostgreSQL after making changes:
  ```bash
  sudo systemctl restart postgresql
  ```
- **Firewall**:
Ensure PostgreSQL's port (5432) is open for local connections.

