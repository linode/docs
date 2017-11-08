---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Deploy Django Applications Using uWSGI and Nginx on Ubuntu 14.04'
keywords: ["django", "uwsgi", "nginx", "python"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-11-25
modified_by:
  name: Sergey Pariev
published: 2015-11-25
title: 'Deploy Django Applications Using uWSGI and Nginx on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
aliases: ['websites/nginx/deploy-a-django-application-using-uwsgi-and-nginx-on-ubuntu-14-04/','websites/nginx/deploy-django-applications-using-uwsgi-and-nginx-on-ubuntu-14-04/']
external_resources:
  - '[Writing your first Django app Tutorial](https://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)'
  - '[virtualenvwrapper Documentation](https://virtualenvwrapper.readthedocs.org/en/latest/)'
  - '[WSGI/Python Quickstart Guide](https://uwsgi-docs.readthedocs.org/en/latest/WSGIquickstart.html)'
  - '[nginx Configuration](/docs/websites/nginx/how-to-configure-nginx)'
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Django](https://www.djangoproject.com/) is a high-level Python Web framework that encourages rapid development and clean, pragmatic design. This guide provides an introduction to deploying Django applications using [uWSGI](https://uwsgi-docs.readthedocs.org/) and [nginx](https://www.nginx.com/) on Ubuntu 14.04.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use an example account named `django`. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create the `django` user, harden SSH access and remove unnecessary network services. You may need to create additional firewall rules for your specific application.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Install nginx, Python Tools and uWSGI

1.  Install the system packages required for nginx, the SQLite Python bindings, and managing Python Tools:

        sudo apt-get install build-essential nginx python-dev python-pip python-sqlite sqlite

    {{< note >}}
If your application uses another database, skip installing `python-sqlite` and `sqlite`.
{{< /note >}}

4.  Install [virtualenv](https://virtualenv.pypa.io/en/latest/) and [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/):

        sudo pip install virtualenv virtualenvwrapper

    `virtualenv` and `virtualenvwrapper` are tools to create isolated Python environments. They help better manage application dependencies, versions and permissions. For `virtualenvwrapper` to function correctly, run the following commands:

        echo "export WORKON_HOME=~/Env" >> ~/.bashrc
        echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

3.  Activate `virtualenvwrapper` in the current session:

        source ~/.bashrc

4.  Install uWSGI using `pip`:

        sudo pip install uwsgi

## Set up a Sample Django Application

1.  Be sure that you're in the `django` user's home directory and create the virtual environment for the application:

        cd /home/django && mkvirtualenv sample

    After executing this command your prompt will change to something like `(sample)django@example.com:~$` indicating that you are using the sample virtual environment. To quit the virtual environment, enter `deactivate`.

2.  Install the Django framework:

        pip install Django

3.  Create the new Django application *sample*, located at `/home/django/sample`:

        django-admin.py startproject sample

4.  Switch to the Django application's directory and initialize SQLite database:

        cd ~/sample && ./manage.py migrate

5.  When running Django with nginx, it's necessary to configure Django to put all static assets in your application's `static` folder. Specify its location in `settings.py`:

        echo 'STATIC_ROOT = os.path.join(BASE_DIR, "static/")' >> sample/settings.py

6.  Run the following command to move all static assets into the directory mentioned above:

        ./manage.py collectstatic

7.  Start a development server to test the sample application:

        ./manage.py runserver 0.0.0.0:8080

    Visit `http://example.com:8080` in your browser to confirm that the sample application is set up correctly and working. You should see the Django test page:

    [![Django test page.](/docs/assets/django-test-page-small.png)](/docs/assets/django-test-page.png)

    Then stop development server with **Ctrl-C**.

## Configure uWSGI

1.  Create a directory with uWSGI configuration files:

        sudo mkdir -p /etc/uwsgi/sites

2.  Create configuration file `sample.ini` with the following contents:

    {{< file "/etc/uwsgi/sites/sample.ini" ini >}}
[uwsgi]
project = sample
base = /home/django

chdir = %(base)/%(project)
home = %(base)/Env/%(project)
module = %(project).wsgi:application

master = true
processes = 2

socket = %(base)/%(project)/%(project).sock
chmod-socket = 664
vacuum = true

{{< /file >}}


3.  Create an Upstart job for uWSGI:

    {{< file "/etc/init/uwsgi.conf" aconf >}}
description "uWSGI"
start on runlevel [2345]
stop on runlevel [06]
respawn

env UWSGI=/usr/local/bin/uwsgi
env LOGTO=/var/log/uwsgi.log

exec $UWSGI --master --emperor /etc/uwsgi/sites --die-on-term --uid django --gid www-data --logto $LOGTO

{{< /file >}}


    This job will start uWSGI in *Emperor* mode, meaning that it will monitor `/etc/uwsgi/sites` directory and will spawn instances (*vassals*) for each configuration file it finds. Whenever a config file is changed, the emperor will automatically restart its vassals.

4.  Start the `uwsgi` service:

        sudo service uwsgi start

## Configure nginx

1.  Remove the default nginx site configuration:

        sudo rm /etc/nginx/sites-enabled/default

2.  Create an nginx site configuration file for your Django application:

    {{< file "/etc/nginx/sites-available/sample" aconf >}}
server {
    listen 80;
    server_name example.com;

    location = /favicon.ico { access_log off; log_not_found off; }
    location /static/ {
        root /home/django/sample;
    }

    location / {
        include         uwsgi_params;
        uwsgi_pass      unix:/home/django/sample/sample.sock;
    }
}

{{< /file >}}



3.  Create a symlink to nginx's `sites-enabled` directory to enable your site configuration file:

        sudo ln -s /etc/nginx/sites-available/sample /etc/nginx/sites-enabled

4.  Check nginx's configuration and restart it:

        sudo service nginx configtest && sudo service nginx restart

5.  You should now be able to reach your Django application by visiting your Linode's hostname or IP address on port 80 in your browser.
