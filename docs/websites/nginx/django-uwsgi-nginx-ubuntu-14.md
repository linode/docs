---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Django and uWSGI with Nginx on Ubuntu 14.04'
keywords: 'django,uwsgi,nginx,django apps'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Monday, October 12th, 2015'
modified_by:
  name: Sergey Pariev
published: 'Friday, October 9th, 2015'
title: 'Django and uWSGI with Nginx on Ubuntu 14.04 LTS (Trusty)'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Writing your first Django app Tutorial](https://docs.djangoproject.com/en/dev/intro/tutorial01/#intro-tutorial01)'
  - '[virtualenvwrapper Documentation](https://virtualenvwrapper.readthedocs.org/en/latest/)'
  - '[WSGI/Python Quickstart Guide](https://uwsgi-docs.readthedocs.org/en/latest/WSGIquickstart.html)'
  - '[Nginx Configuration](/docs/websites/nginx/basic-nginx-configuration)'
---

[Django](https://www.djangoproject.com/) is a high-level Python Web framework that encourages rapid development and clean, pragmatic design. This guide provides an introduction to deploying Django applications using [uWSGI](https://uwsgi-docs.readthedocs.org/) and [Nginx](https://www.nginx.com/) on Ubuntu 14.04.

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Prerequisites

1.  Follow the [Getting Started](/docs/getting-started) and [Securing Your Server](/docs/security/securing-your-server) guides, and [set the Linode's hostname](/docs/getting-started#setting-the-hostname).

    To check the hostname run:

        hostname
        hostname -f

    The first command should show the short hostname, and the second should show the fully qualified domain name (FQDN).

2.  Update the system:

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>In this guide `example.com` will be used as a domain name, and `django` as a name of non-root user. Substitute your own FQDN and username accordingly.


## Install Nginx, Python tools and uWSGI

1.  Install the system packages required for installing and using Python tools:

        sudo apt-get install build-essential python-dev python-pip

2.  Install system packages for Nginx:

        sudo apt-get install nginx

3.  Additionally, install `sqlite` package and python bindings for sqlite. It will be used for the sample Django application. If your application uses another database, feel free to skip this step.

	    sudo apt-get install sqlite python-sqlite

4.  Install [virtualenv](https://virtualenv.pypa.io/en/latest/) and [virtualenvwrapper](http://virtualenvwrapper.readthedocs.org/en/latest/):

        sudo pip install virtualenv virtualenvwrapper

	`virtualenv` and `virtualenvwrapper` are tools to create isolated Python environments. They help to better manage application dependencies, versions and permissions.

	For `virtualenvwrapper` to function correctly, run the following commands:

		echo "export WORKON_HOME=~/Env" >> ~/.bashrc
		echo "source /usr/local/bin/virtualenvwrapper.sh" >> ~/.bashrc

	After that, run `source ~/.bashrc` to activate virtualenvwrapper in the current session.

5.  Install uWSGI using `pip`:

		sudo pip install uwsgi

## Set up sample Django application

1.  Switch to the home directory and create virtual environment for the application with `mkvirtualenv`:

		cd /home/django && mkvirtualenv sample

	After executing this command your prompt will change to something like `(sample)django@example.com:~$` indicating that you are using sample virtual environment. To quit virtual environment, use `deactivate`.

2.  Install Django framework:

        pip install Django

3.  Create new Django application with the command:

        django-admin.py startproject sample

    This will create a `sample` directory in your home directory.

4.  Switch to application directory with `cd sample` and run the following command to initialize SQLite database:

		./manage.py migrate

5.  Open file `sample/settings.py` with your favorite text editor and add this line to the bottom of the file:

{: .file-excerpt}
sample/settings.py
:   ~~~ py
    STATIC_ROOT = os.path.join(BASE_DIR, "static/")
    ~~~

	This will configure Django to put all static assets into specified directory, which is needed when running with Nginx.

6.  Run the following command to put static assets into directory mentioned above:

		./manage.py collectstatic

7.  Start development server to test sample application:

		./manage.py runserver 0.0.0.0:8080

	Visit http://example.com:8080 in your browser to confirm that application is set up correctly and working. Stop development server with **Ctrl-C**.

## Configure uWSGI

1.  Create directory with uWSGI configuration files:

		sudo mkdir -p /etc/uwsgi/sites

2.  Using `sudo` create configuration file `sample.ini` with the following contents:

{: .file}
/etc/uwsgi/sites/sample.ini
:   ~~~ ini
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
    ~~~

3.  With `sudo` create an Upstart script for uWSGI:

{: .file}
/etc/init/uwsgi.conf
:   ~~~ conf
	description "uWSGI"
	start on runlevel [2345]
	stop on runlevel [06]
	respawn

	env UWSGI=/usr/local/bin/uwsgi
	env LOGTO=/var/log/uwsgi.log

	exec $UWSGI --master --emperor /etc/uwsgi/sites --die-on-term --uid django --gid www-data --logto $LOGTO
    ~~~

This script will start uWSGI in "Emperor" mode.  In this mode it will monitor `/etc/uwsgi/site` directory and will spawn instances (vassals) for each configuration file it finds. Whenever a config file is changed, the emperor will automatically restart the vassal.

4. Start `uwsgi` service:

		sudo service uwsgi start

## Configure Nginx

1.  Create Nginx site configuration file `/etc/nginx/sites-available/sample` using `sudo`:

{: .file}
/etc/nginx/sites-available/sample
:   ~~~ conf
	server {
		listen 80;
		server_name example.com;

	    location = /favicon.ico { access_log off; log_not_found off; }
		location /static/ {
			root /home/user/sample;
		}

        location / {
			include         uwsgi_params;
			uwsgi_pass      unix:/home/django/sample/sample.sock;
		}
	}
	~~~

2.  Link newly created configuration file to `sites-enabled` directory to enable it:

		sudo ln -s /etc/nginx/sites-available/sample /etc/nginx/sites-enabled

3.  Check Nginx configuration and restart Nginx:

		sudo service nginx configtest
		sudo service nginx restart

	You should now be able to reach Django application by visiting http://example.com in your browser.
