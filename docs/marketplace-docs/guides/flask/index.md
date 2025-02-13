---
title: "Deploy Flask through the Linode Marketplace"
description: "Learn how to deploy Flask, a quick and light-weight web framework for Python, through the Linode Marketplace."
published: 2020-03-11
modified: 2025-02-12
keywords: ['flask','python','marketplace']
tags: ["linode platform","python","marketplace","cloud-manager"]
image: Flask_oneclickapps.png
external_resources:
- '[Flask Quickstart](https://flask.palletsprojects.com/en/1.1.x/quickstart/)'
- '[Flask SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)'
aliases: ['/products/tools/marketplace/guides/flask/','/platform/marketplace/how-to-deploy-flask-with-marketplace-apps/', '/platform/one-click/how-to-deploy-flask-with-one-click-apps/','/guides/how-to-deploy-flask-with-one-click-apps/','/guides/how-to-deploy-flask-with-marketplace-apps/','/guides/flask-marketplace-app/']
authors: ["Akamai"]
contributors: ["Akamai"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
---

[Flask](https://flask.palletsprojects.com/en/1.1.x/) is a quick and light-weight web framework for Python that includes several utilities and libraries you can use to create a web application. It is designed to make getting started quick and easy, with the ability to scale up to support more complex applications.

## Deploying a Marketplace App

{{% content "deploy-marketplace-apps-shortguide" %}}

{{% content "marketplace-verify-standard-shortguide" %}}

{{< note >}}
**Estimated deployment time:** Flask should be fully installed within 2-5 minutes after the Compute Instance has finished provisioning.
{{< /note >}}

## Configuration Options

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

## Flask options

{{% content "marketplace-required-limited-user-fields-shortguide" %}}
- **Email address** *(required)*: Enter the email address to use for generating the SSL certificates.

{{% content "marketplace-custom-domain-fields-shortguide" %}}

{{% content "marketplace-special-character-limitations-shortguide" %}}


### Obtain the Credentials

Once the app is deployed, you need to obtain the credentials from the server.

To obtain credentials:

1.  Log in to your new Compute Instance using one of the methods below:

    - **Lish Console**: Log in to Cloud Manager, click the **Linodes** link in the left menu, and select the Compute Instance you just deployed. Click **Launch LISH Console**. Log in as the `root` user. To learn more, see [Using the Lish Console](/docs/products/compute/compute-instances/guides/lish/).
    - **SSH**: Log in to your Compute Instance over SSH using the `root` user. To learn how, see [Connecting to a Remote Server Over SSH](/docs/guides/connect-to-server-over-ssh/).

1.  Run the following command to access the credentials file:

    ```command
    cat /home/$USERNAME/.credentials
    ```

This returns passwords that were automatically generated when the instance was deployed. Save them. Once saved, you can safely delete the file.

## Getting Started After Deployment

To get started:

1.  Open a web browser and navigate to the domain you entered when creating the instance: `https://domain.tld`. If you didn't enter a domain, use your Compute Instance's default rDNS domain (`192-0-2-1.ip.linodeusercontent.com`). To learn more on viewing the rDNS value, see [Managing IP Addresses](/docs/products/compute/compute-instances/guides/manage-ip-addresses/). Make sure to use the `https` prefix in the URL to access the website securely.

1. The deployment ships with a sample application, but you can review the flask app and it's components below:

* The sample project can be found in /var/www/flask_project
* The Gunicorn systemd service can be found in /etc/systemd/system/gunicorn.service
* The Gunicorn socket is located at /tmp/gunicorn.sock

### Installed Software

In addition to installing Flask, this Marketplace app installs and configures software to support running Flask in a production environment. Below is a list of the installed software:

- The [NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) web server is installed with a basic NGINX configuration, located in `/etc/nginx/sites-enabled/$DOMAIN`. The $DOMAIN will be the domain entered during deployment or the default rDNS address that comes with each instance.
- An sample Flask application is downloaded to your Linode's `/var/www/flask_project` directory. 

- [Gunicorn](https://gunicorn.org/), a Python WSGI (web server gateway interface) HTTP Server for UNIX, is installed and running. It is used to forward requests from your NGINX web server to your Flask application.

{{< note >}}
Many configuration files can be overwritten to support a new configuration instead of deleted outright. For more information on the default configuration, see our [Flask Installation Guide](/docs/guides/flask-and-gunicorn-on-ubuntu/) and the [Installed Software Section](/docs/marketplace-docs/guides/flask/#installed-software) of this guide.
{{< /note >}}

### Next Steps

{{% content "marketplace-update-note-shortguide" %}}

Now that you are familiar with all the software installed on your Linode with the Flask Marketplace app, you can explore the following steps:

- [Connect to your Linode via SSH](/docs/products/compute/compute-instances/guides/set-up-and-secure/#connect-to-the-instance). You will need your Linode's root password to proceed. You can explore the installed programs and update any configurations as needed. Consider following the steps in the [Setting Up and Securing a Compute Instance](/docs/products/compute/compute-instances/guides/set-up-and-secure/) guide to continue hardening your Linode's security.
- Read through our [Deploy a Flask Application on Ubuntu](/docs/guides/flask-and-gunicorn-on-ubuntu/) guide, which takes a deeper dive into the example Flask app that is deployed by the Marketplace app.
- Visit our [Create a GIS Application using Flask, Stadia Maps, and MongoDB](/docs/guides/how-to-create-a-gis-app-using-flask-stadia-maps-and-mongodb/) guide to learn how to create your own GIS application.
- Consult our [How To Create an OAuth App with the Linode Python API Library](/docs/guides/create-an-oauth-app-with-the-python-api-library/) to learn how to develop a Flask app using Linode's API to automate creating Linode resources.
