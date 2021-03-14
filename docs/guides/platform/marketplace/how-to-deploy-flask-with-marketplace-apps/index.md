---
slug: how-to-deploy-flask-with-marketplace-apps
author:
  name: Linode Community
  email: docs@linode.com
description: 'Flask is a quick and light-weight web framework for Python that includes several utilities and libraries you can use to create a web application. Deploy a Flask app on Linode with Marketplace Apps.'
og_description: 'Flask is a quick and light-weight web framework for Python that includes several utilities and libraries you can use to create a web application. Deploy a Flask app on Linode with Marketplace Apps.'
keywords: ['flask','python','marketplace']
tags: ["linode platform","python","marketplace","cloud-manager"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2020-03-11
modified_by:
  name: Linode
title: "How to Deploy Flask with Marketplace Apps"
h1_title: "Deploying Flask with Marketplace Apps"
image: feature.png
contributor:
  name: Linode
external_resources:
- '[Flask Quickstart](https://flask.palletsprojects.com/en/1.1.x/quickstart/)'
- '[Flask SQLAlchemy Documentation](https://flask-sqlalchemy.palletsprojects.com/en/2.x/)'
aliases: ['/platform/marketplace/how-to-deploy-flask-with-marketplace-apps/', '/platform/one-click/how-to-deploy-flask-with-one-click-apps/']
---
[Flask](https://flask.palletsprojects.com/en/1.1.x/) is a quick and light-weight web framework for Python that includes several utilities and libraries you can use to create a web application. It is designed to make getting started quick and easy, with the ability to scale up to support more complex applications.

### Deploy a Flask Marketplace App

{{< content "deploy-marketplace-apps">}}

### Linode Options

After providing the app specific options, provide configurations for your Linode server:

| **Configuration** | **Description** |
|:--------------|:------------|
| **Select an Image** | Debian 9 is currently the only image supported by Flask Marketplace Apps, and it is pre-selected on the Linode creation page. *Required*. |
| **Region** | The region where you would like your Linode to reside. In general, it's best to choose a location that's closest to you. For more information on choosing a DC, review the [How to Choose a Data Center](/docs/platform/how-to-choose-a-data-center) guide. You can also generate [MTR reports](/docs/networking/diagnostics/diagnosing-network-issues-with-mtr/) for a deeper look at the network routes between you and each of our data centers. *Required*. |
| **Linode Plan** | Your Linode's [hardware resources](/docs/platform/how-to-choose-a-linode-plan/#hardware-resource-definitions). Flask is lightweight and does not require high system resources. You can select any Linode plan that will support the amount of site traffic you expect for your Flask app. You can always [resize your Linode](/docs/platform/disk-images/resizing-a-linode/) to a different plan later if you feel you need to increase or decrease your system resources. *Required*. |
| **Linode Label** | The name for your Linode, which must be unique between all of the Linodes on your account. This name will be how you identify your server in the Cloud Manager’s Dashboard. *Required*. |
| **Add Tags** | A tag to help organize and group your Linode resources. [Tags](/docs/quick-answers/linode-platform/tags-and-groups/) can be applied to Linodes, Block Storage Volumes, NodeBalancers, and Domains. |
| **Root Password** | The primary administrative password for your Linode instance. This password must be provided when you log in to your Linode via SSH. The password must meet the complexity strength validation requirements for a strong password. Your root password can be used to perform any action on your server, so make it long, complex, and unique. *Required*. |

When you've provided all required Linode Options, click on the **Create** button. **Your Flask app will complete installation anywhere between 2-5 minutes after your Linode has finished provisioning**.

## Getting Started after Deployment
### Installed Software

In addition to installing Flask, this Marketplace app installs and configures software to support running Flask in a production environment. Below is a list of the installed software:

- The [NGINX](/docs/web-servers/nginx/nginx-installation-and-basic-setup/) web server is installed with a basic NGINX configuration, located in `/etc/nginx/sites-enabled/flask_app`, and listening on your Linode's IP address.
- An example Flask application is downloaded to your Linode's `/home/flask_app_project` directory. If you visit your [Linode's IP address](/docs/quick-answers/linode-platform/find-your-linodes-ip-address/), you will see the example Flask application running and serving boiler plate blog content.
- Your example Flask application's environment will be configured with basic settings located in the `/etc/config.json` file.
- [Gunicorn](https://gunicorn.org/), a Python WSGI (web server gateway interface) HTTP Server for UNIX, is installed and running. It is used to forward requests from your NGINX web server to your Flask application.
- [Supervisor](http://supervisord.org/), a client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems, is installed and running on your Linode. Its configuration file can be found in the following location, `/etc/supervisor/conf.d/flask_app.conf`.
- The example Flask app's logs can be found in the following locations, `var/log/flask_app/flask_app.out.log` and `/var/log/flask_app/flask_app.err.log`

### Next Steps

{{< content "marketplace-update-note">}}

Now that you are familiar with all the software installed on your Linode with the Flask Marketplace app, you can explore the following steps:

- [Connect to your Linode via SSH](/docs/getting-started/#connect-to-your-linode-via-ssh). You will need your Linode's root password to proceed. You can explore the installed programs and update any configurations as needed. Consider following the steps in the [Securing Your Server](/docs/security/securing-your-server/) guide to continue hardening your Linode's security.
- Read through our [Deploy a Flask Application on Ubuntu](/docs/development/python/flask-and-gunicorn-on-ubuntu/) guide, which takes a deeper dive into the example Flask app that is deployed by the Marketplace app.
- Visit our [Create a GIS Application using Flask, Stadia Maps, and MongoDB](/docs/development/python/how-to-create-a-gis-app-using-flask-stadia-maps-and-mongodb/) guide to learn how to create your own GIS application.
- Consult our [How To Create an OAuth App with the Linode Python API Library](/docs/platform/api/how-to-create-an-oauth-app-with-the-linode-python-api-library/) to learn how to develop a Flask app using Linode's API to automate creating Linode resources.
