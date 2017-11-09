---
deprecated: true
author:
  name: Alex Fornuto
  email: afornuto@linode.com
description: 'Use uWSGI to Deploy Python Application Servers in Conjunction with Nginx.'
keywords: ["uwsgi", "wsgi", "nginx", "python", "ubuntu", "install uwsgi", "deploy python applications with nginx", "virtual host"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['web-servers/nginx/python-uwsgi/ubuntu-12-04-precise-pangolin/','websites/nginx/wsgi-using-uwsgi-and-nginx-on-ubuntu-12-04-precise-pangolin/index.cfm/','websites/nginx/wsgi-using-uwsgi-and-nginx-on-ubuntu-12-04-precise-pangolin/','websites/nginx/how-to-install-uwsgi-with-nginx-on-ubuntu-12-04-precise-pangolin/','websites/nginx/use-uwsgi-to-deploy-Python-apps-with-nginx-on-ubuntu-12-04/']
modified: 2012-11-13
modified_by:
  name: Linode
published: 2012-11-13
title: 'Use uWSGI to deploy Python apps with Nginx on Ubuntu 12.04'
---

The uWSGI server provides a non-FastCGI method for deploying Python applications with the nginx web server. In coordination with nginx, uWSGI offers great stability, flexibility, and performance. However, to deploy applications with uWSGI and nginx, you must compile nginx manually with the included uwsgi module.

# Prerequisites

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for [setting your hostname](/docs/getting-started#setting-the-hostname). Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

You should also make sure your system is up to date. Enter the following commands, one by one, and install any available updates:

    apt-get update
    apt-get upgrade

# Installing uWSGI and Configuring Nginx

To get started, you'll install uWSGI and other packages, and then configure nginx. Here's how:

1.  Begin by installing uWSGI and nginx from the Ubuntu repository:

        apt-get install nginx-full uwsgi uwsgi-plugin-python

2.  Create a virtual host file by entering the following command, replacing `example.com` with your domain name:

        nano /etc/nginx/sites-available/example.com

3.  Using the virtual host configuration below as a guide, create your configuration file.

    {{< file "/etc/nginx/sites-available/example.com" nginx >}}
server {
        listen          80;
        server_name     $hostname;
        access_log /srv/www/example.com/logs/access.log;
        error_log /srv/www/example.com/logs/error.log;

        location / {
            #uwsgi_pass      127.0.0.1:9001;
            uwsgi_pass      unix:///run/uwsgi/app/example.com/example.com.socket;
            include         uwsgi_params;
            uwsgi_param     UWSGI_SCHEME $scheme;
            uwsgi_param     SERVER_SOFTWARE    nginx/$nginx_version;

        }

        location /static {
            root   /srv/www/example.com/public_html/static/;
            index  index.html index.htm;

        }

}

{{< /file >}}

4.  Link the virtual host file to sites-enabled by entering the following command, replacing `example.com` with your domain name:

        ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/example.com

5.  Depending on your configuration, you may wish to remove the link to the default virtual host by entering the following command:

        rm /etc/nginx/sites-enabled/default

6.  Create directories for your website's data by entering the following commands, one by one, replacing `example.com` with your domain name:

        mkdir -p /srv/www/example.com/public_html/static
        mkdir  /srv/www/example.com/application
        mkdir  /srv/www/example.com/logs

All requests to URLs ending in `/static` will be served directly from the `/srv/www/example.com/public_html/static` directory.

# Configuring uWSGI

Now, we need to configure uWSGI. Here's how:

1.  Create the uWSGI config file by entering the following command, replacing `example.com` with your domain name:

        nano /etc/uwsgi/apps-available/example.com.xml

2.  Using the configuration below as a guide, create your configuration file.

    {{< file "/etc/uwsgi/apps-available/example.com.xml" xml >}}
<uwsgi>
    <plugin>python</plugin>
    <socket>/run/uwsgi/app/example.com/example.com.socket</socket>
    <pythonpath>/srv/www/example.com/application/</pythonpath>
    <app mountpoint="/">

        <script>wsgi_configuration_module</script>

    </app>
    <master/>
    <processes>4</processes>
    <harakiri>60</harakiri>
    <reload-mercy>8</reload-mercy>
    <cpu-affinity>1</cpu-affinity>
    <stats>/tmp/stats.socket</stats>
    <max-requests>2000</max-requests>
    <limit-as>512</limit-as>
    <reload-on-as>256</reload-on-as>
    <reload-on-rss>192</reload-on-rss>
    <no-orphans/>
    <vacuum/>
</uwsgi>

{{< /file >}}


3.  Link the configuration to apps-enabled by entering the following command, replacing `example.com` with your domain name:

        ln -s /etc/uwsgi/apps-available/example.com.xml /etc/uwsgi/apps-enabled/example.com.xml

4.  If you want to deploy a "Hello World" application, insert the following code into the `/srv/www/example.com/application/wsgi_configuration_module.py` file:

    {{< file "/srv/www/example.com/application/wsgi\\_configuration\\_module.py" python >}}
import os
import sys

sys.path.append('/srv/www/example.com/application')

os.environ['PYTHON_EGG_CACHE'] = '/srv/www/example.com/.python-egg'

def application(environ, start_response):
    status = '200 OK'
    output = 'Hello World!'

    response_headers = [('Content-type', 'text/plain'),
                    ('Content-Length', str(len(output)))]
    start_response(status, response_headers)

    return [output]

{{< /file >}}

5.  Restart uWSGI with the command:

        service uwsgi restart

6.  Restart the web server by issuing the following command:

        service nginx restart

You can test by pointing a web browser to your domian. If you see `Hello World!` than you have successfully configured your Linode for uWSGI with Nginx!

# Additional Application Servers

If the Python application you've deployed requires more application resources than a single Linode instance can provide, all of the methods for deploying a uWSGI application server are easily scaled to rely on multiple uSWGI instances. These instances run on additional Linodes with the request load balanced using nginx's `upstream` capability. See our documentation of [proxy and software load balancing with nginx](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer) for more information. For a basic example configuration, see the following example:

{{< file-excerpt "nginx configuration" nginx >}}
upstream uwsgicluster {
     server 127.0.0.1:9001;
     server 192.168.100.101:9001;
     server 192.168.100.102:9001;
     server 192.168.100.103:9001;
     server 192.168.100.104:9001;
}

server {
    listen   80;
    server_name www.example.com example.com;
    access_log /srv/www/example.com/logs/access.log;
    error_log /srv/www/example.com/logs/error.log;

    location / {
        include        uwsgi_params;
        uwsgi_pass     uwsgicluster;
    }

    location /static {
        root   /srv/www/example.com/public_html/static/;
        index  index.html index.htm;
    }
}

{{< /file-excerpt >}}


In this example, we create the `uwsgicluster` upstream, which has five components. One runs on the local interface, and four run on the local network interface of distinct Linodes (the `192.168.` addresses or the private "back-end" network). The application servers that run on those dedicated application servers are identical to the application servers described above. However, the application server process must be configured to bind to the appropriate network interface to be capable of responding to requests.

# More Information

You may wish to consult the following resources for additional information on this topic. While these are provided in the hope that they will be useful, please note that we cannot vouch for the accuracy or timeliness of externally hosted materials.

- [Installing Nginx on Ubuntu 12.04 (Precise Pangolin)](/docs/websites/apache/apache-2-web-server-on-ubuntu-12-04-lts-precise-pangolin)
- [Deploy a LEMP Server on Ubuntu 12.04 (Precise Pangolin)](/docs/lemp-guides/ubuntu-12-04-precise-pangolin)
- [Configure nginx Proxy Servers](/docs/uptime/loadbalancing/how-to-use-nginx-as-a-front-end-proxy-server-and-software-load-balancer)
