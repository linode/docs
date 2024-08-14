---
# Shortguide: Details the optional fields related to creating a limited user account on a Marketplace App.

headless: true
show_on_rss_feed: false
authors: ["Akamai"]
---

#### Limited User (Optional)

You can optionally fill out the following fields to automatically create a limited user for your new Compute Instance. This is recommended for most deployments as an additional security measure. This account will be assigned to the *sudo* group, which provides elevated permission when running commands with the `sudo` prefix.

- **Limited sudo user:** Enter your preferred username for the limited user.
- **Password for the limited user:** Enter a *strong* password for the new user.
- **SSH public key for the limited user:** If you wish to login as the limited user through public key authentication (without entering a password), enter your public key here. See [Creating an SSH Key Pair and Configuring Public Key Authentication on a Server](/docs/guides/use-public-key-authentication-with-ssh/) for instructions on generating a key pair.
- **Disable root access over SSH:** To block the root user from logging in over SSH, select *Yes* (recommended). You can still switch to the root user once logged in and you can also log in as root through [Lish](/docs/products/compute/compute-instances/guides/lish/).