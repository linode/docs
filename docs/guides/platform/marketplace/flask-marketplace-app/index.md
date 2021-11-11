---
slug: flask-marketplace-app
author:
  name: Linode Community
  email: docs@linode.com
description: "Learn how to deploy Flask, a quick and light-weight web framework for Python, through the Linode Marketplace."
keywords: ['flask','python','marketplace']
tags: ["linode platform","python","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified: 2021-09-16
modified_by:
  name: Linode
title: "Deploying Flask through the Linode Marketplace"
image: Flask_oneclickapps.png
contributor:
  name: Linode
external_resources:
- '[Flask Quickstart](https://flask.palletsprojects.com/en/1.1.x/quickstart/)'
- '[Flask SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)'
aliases: ['/platform/marketplace/how-to-deploy-flask-with-marketplace-apps/', '/platform/one-click/how-to-deploy-flask-with-one-click-apps/','/guides/how-to-deploy-flask-with-marketplace-apps/']
---

[Flask](https://flask.palletsprojects.com/en/1.1.x/) is a quick and light-weight web framework for Python that includes several utilities and libraries you can use to create a web application. It is designed to make getting started quick and easy, with the ability to scale up to support more complex applications.

## Deploying the Flask Marketplace App

{{< content "deploy-marketplace-apps-shortguide">}}

**Software installation should complete within 2-5 minutes after the Linode has finished provisioning.**

## Configuration Options

For advice on filling out the remaining options on the **Create a Linode** form, see [Getting Started > Create a Linode](/docs/guides/getting-started/#create-a-linode). That said, some options may be limited or recommended based on this Marketplace App:

- **Supported distributions:** Debian 10
- **Recommended minimum plan:** All plan types and sizes can be used.

## Getting Started after Deployment

### Installed Software

In addition to installing Flask, this Marketplace app installs and configures software to support running Flask in a production environment. Below is a list of the installed software:

- The [NGINX](/docs/guides/getting-started-with-nginx-part-1-installation-and-basic-setup/) web server is installed with a basic NGINX configuration, located in `/etc/nginx/sites-enabled/flask_app`, and listening on your Linode's IP address.
- An example Flask application is downloaded to your Linode's `/home/flask_app_project` directory. If you visit your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/), you will see the example Flask application running and serving boiler plate blog content.
- Your example Flask application's environment will be configured with basic settings located in the `/etc/config.json` file.
- [Gunicorn](https://gunicorn.org/), a Python WSGI (web server gateway interface) HTTP Server for UNIX, is installed and running. It is used to forward requests from your NGINX web server to your Flask application.
- [Supervisor](http://supervisord.org/), a client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems, is installed and running on your Linode. Its configuration file can be found in the following location, `/etc/supervisor/conf.d/flask_app.conf`.
- The example Flask app's logs can be found in the following locations, `var/log/flask_app/flask_app.out.log` and `/var/log/flask_app/flask_app.err.log`

### Next Steps

{{< content "marketplace-update-note-shortguide">}}

Now that you are familiar with all the software installed on your Linode with the Flask Marketplace app, you can explore the following steps:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed. You can explore the installed programs and update any configurations as needed. Consider following the steps in the [Securing Your Server](/docs/security/securing-your-server/) guide to continue hardening your Linode's security.
- Read through our [Deploy a Flask Application on Ubuntu](/docs/development/python/flask-and-gunicorn-on-ubuntu/) guide, which takes a deeper dive into the example Flask app that is deployed by the Marketplace app.
- Visit our [Create a GIS Application using Flask, Stadia Maps, and MongoDB](/docs/development/python/how-to-create-a-gis-app-using-flask-stadia-maps-and-mongodb/) guide to learn how to create your own GIS application.
- Consult our [How To Create an OAuth App with the Linode Python API Library](/docs/platform/api/how-to-create-an-oauth-app-with-the-linode-python-api-library/) to learn how to develop a Flask app using Linode's API to automate creating Linode resources.
