---
# Shortguide: Details the optional fields related to creating a limited user account on a Marketplace App.

headless: true
show_on_rss_feed: false
---

#### Custom Domain (Optional)

If you wish to automatically configure a custom domain, you first need to configure your domain to use Linode's name servers. This is typically accomplished directly through your registrar. See [Use Linode’s Name Servers with Your Domain](/docs/products/networking/dns-manager/guides/authoritative-name-servers/). Once that is finished, you can fill out the following fields for the Marketplace App:

- **Linode API Token:** If you wish to use the Linode's [DNS Manager](/docs/products/networking/dns-manager/) to manage DNS records for your custom domain, create a Linode API *Personal Access Token* on your account with Read/Write access to *Domains*. If this is provided along with the subdomain and domain fields (outlined below), the installation attempts to create DNS records via the Linode API. See [Get an API Access Token](/docs/products/tools/api/guides/manage-api-tokens/). If you do not provide this field, you need to manually configure your DNS records through your DNS provider and point them to the IP address of the new instance.
- **Subdomain:** The subdomain you wish to use, such as *www* for `www.example.com`.
- **Domain:** The domain name you wish to use, such as *example.com*.