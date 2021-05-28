---
# Shortguide: shows you how to reset the root password on a Linode.

headless: true
show_on_rss_feed: false
---

If you can't remember the password for the `root` user on a Linode, use the Linode Cloud Manager to reset it. Here's how:

1.  Click the **Linodes** link in the sidebar.
1.  Select a Linode by clicking its label. The Linode's details page appears.
1.  Click **Power Off** at the top of the details page to turn off your Linode if it is powered on. Ensure the Linode displays its status as "OFFLINE" before proceeding.
1.  Click the **Settings** tab underneath the detail page Summary.
1.  Under the **Reset Root Password** panel, select your primary disk from the **Disk** menu.
1.  Enter a new password for the `root` user in the **Password** field.
1.  Click **Save**. The Linode's dashboard appears.
1.  Click **Power On** to turn on your Linode.

Now you can use the new `root` user password to log in to your Linode. See [Connecting to Your Linode via SSH](/docs/guides/getting-started/#connect-to-your-linode-via-ssh) for more information about connecting. If you are unable to connect with the `root` credentials via SSH, try connecting with [Lish](/docs/guides/using-the-linode-shell-lish/) instead. If you are able to connect via Lish but not SSH, you may need to troubleshoot your SSH configuration and firewall rules.
