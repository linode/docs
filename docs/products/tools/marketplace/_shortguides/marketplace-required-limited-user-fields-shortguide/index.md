---
# Shortguide: Details the fields related to creating a required limited user account on a Marketplace App.

headless: true
show_on_rss_feed: false
---

#### Required Limited Sudo User

It is required to fill out the following fields to automatically create a limited sudo user, with a strong generated password for your new Compute Instance. This account will be assigned to the *sudo* group, which provides elevated permissions when running commands with the `sudo` prefix. 

- **Limited sudo user:** Enter your preferred username for the limited user. *No Capital Letters, Spaces, or Special Characters* 

{{< note type="warning" title="Locating The Generated Sudo Password">}}
A password is generated for the limited user and stored in a `.credentials` file in their home directory, along with application specific passwords. This can be viewed by running: `cat /home/$USERNAME/.credentials`

We recommend adding an [account SSH key](/docs/products/platform/accounts/guides/manage-ssh-keys/) for the Cloud Manager user that is deploying the instance, and selecting that user as an `authorized_user` in the API or by selecting that option in the Cloud Manager. Their SSH pubkey will be assigned to _both_ root and the required limited user.
{{< /note >}}

- **Disable root access over SSH:** To block the root user from logging in over SSH, select *Yes* (recommended). You can still switch to the root user once logged in, and you can also log in as root through [Lish](/docs/products/compute/compute-instances/guides/lish/).

{{< note type="warning" title="Accessing The Instance Without SSH">}}
If you disable root access for your deployment and do not provide a valid Account SSH Key assigned to the `authorized_user`, you will need to login as the root user via the [Lish console](/docs/products/compute/compute-instances/guides/lish/) and run `cat /home/$USERNAME/.credentials` to view the generated password for the required limited user. 
{{< /note >}}