---
title: "Deploy Ruby on Rails through the Linode Marketplace"
description: "This guide provides you with installation and configuration instructions for deploying Ruby on Rails using the Lindoe One-Click Apps Marketplace."
published: 2020-03-11
modified: 2025-06-03
keywords: ['ruby on rails','marketplace', 'marketplace apps']
tags: ["ruby","linode platform","marketplace","cloud-manager"]
image: RubyonRails_oneclickapps.png
external_resources:
 - '[Ruby on Rails Documentation](https://guides.rubyonrails.org/)'
 - '[Securing Rails Applications](https://guides.rubyonrails.org/security.html)'
 - '[Configuring Rails Applications](https://guides.rubyonrails.org/configuring.html)'
aliases: ['/products/tools/marketplace/guides/ruby-on-rails/','/platform/marketplace/deploying-ruby-on-rails-with-marketplace-apps/', '/platform/one-click/deploying-ruby-on-rails-with-one-click-apps/','/guides/deploying-ruby-on-rails-with-one-click-apps/', '/guides/deploying-ruby-on-rails-with-marketplace-apps/','/guides/ruby-on-rails-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
marketplace_app_id: 609048
marketplace_app_name: "Ruby on Rails"
---

[Ruby on Rails](http://rubyonrails.org/) is a server-side web application framework that allows web designers and developers to implement dynamic, fully featured web applications.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Ruby on Rails should be fully installed within 5-10 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Ubuntu 24.04 LTS
- **Recommended minimum plan:** For best results, 4GB Dedicated CPU or Shared Compute instance for Ruby on Rails.

### Ruby on Rails Options

- **Rails Application name** *(required)*: The name for your rails application.
- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-required-limited-user-fields-shortguide" %}}

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}

### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain the credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started after Deployment
### Access Ruby on Rails

The Ruby on Rails Marketplace App is running [Nginx](https://www.nginx.com/), [Ruby](https://www.ruby-lang.org/en/), [Rails](https://rubyonrails.org/), [Puma](https://github.com/puma/puma), and [Mise](https://github.com/jdx/mise). Once deployed, a sample page should be running on your FQDN (if applicable) or the Compute Instance's Reverse DNS address.

### Accessing the Ruby on Rails App through the Command Line

The Ruby on Rails sample application can be found within `/var/www/$APPNAME` directory.

1.  Log in to your Compute Instance via [SSH](/docs/guides/connect-to-server-over-ssh/) or [Lish](/docs/products/compute/compute-instances/guides/lish/).

1.  Navigate to the directory in which the application is stored:

        cd /var/www/$APPNAME


### Viewing the Ruby on Rails App through a Web Browser

Open your web browser and navigate to `https://[domain]/`, where *[domain]* can be replaced with the custom domain you entered during deployment or your Compute Instance's rDNS domain (such as `192-0-2-1.ip.linodeusercontent.com`). See the [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/) guide for information on viewing rDNS.

## Software Included

| **Software** | **Description** |
|:--------------|:------------|
| **Ruby** | Object-Oriented programming language |
| **Rails** | Web application framework |
| **NGINX** | Web server and reverse proxy |
| **Puma** | Web server specifically designed to run Ruby/Rails applications |
| **Mise** | Modern version manager |

{{% content "marketplace-update-note-shortguide" %}}