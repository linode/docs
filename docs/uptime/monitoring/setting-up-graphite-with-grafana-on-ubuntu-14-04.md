---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Setting up Graphite with Grafana on Ubuntu 14.04'
keywords: 'graphite,grafana'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: 'Tuesday, November 3rd, 2015'
modified_by:
  name: Sergey Pariev
published: 'Tuesday, November 3rd, 2015'
title: 'Setting up Graphite with Grafana on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Installing Graphite](http://graphite.readthedocs.org/en/latest/install.html)'
  - '[Configuring Carbon](http://graphite.readthedocs.org/en/latest/config-carbon.html)'
  - '[Installing Grafana on Debian/Ubuntu](http://docs.grafana.org/installation/debian/)'
  - '[Adding Graphite data source to Grafana](http://docs.grafana.org/datasources/graphite/)'
---

[Graphite](http://graphite.readthedocs.org/en/latest/index.html) is an enterprise-scale monitoring tool that runs well on cheap hardware. It stores numeric time-series data and renders graphs of this data on demand. This guide provides an introduction to installation and basic setup of Graphite together with [Grafana](http://grafana.org/) - leading open source application for visualizing large-scale measurement data - on Ubuntu 14.04 LTS.

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
>In this guide `example.com` will be used as a domain name, and `graphite` as a name of non-root user. Substitute your own FQDN and username accordingly.


## Install Apache, Python tools and Graphite

1.  Install the system packages required for installing and using Graphite:

        sudo apt-get install build-essential python-dev apache2 libapache2-mod-wsgi libpq-dev python-psycopg2

2.  Install system packages for Graphite:

        sudo apt-get install graphite-web graphite-carbon

	You will be asked by installer should Carbon database files be removed on uninstall. It's better to answer 'No' here, you can always remove the files later (they are located in `/var/lib/graphite/whisper`).

## Configure Carbon

1.  Configure storage settings for test metrics: using `sudo` and your favorite text editor add the following lines to file `/etc/carbon/storage-schemas.conf` after `[carbon]` section but before `[default_1min_for_1day]` section:

{: .file-excerpt}
/etc/carbon/storage-schemas.conf
:   ~~~ conf
	[test]
	pattern = ^test\.
	retentions = 5s:3h,1m:1d
    ~~~

	This file describes retention policies which Graphite will use for configured metrics. `pattern` is the regular expression to match against metric name, and `retentions` is comma-separated list of `frequency`:`history` value pairs.

	Section `[test]` you've just added will match all metrics starting with `test` and will save data with 5 second frequency for 3 hours, and data with 1 minute frequency for 1 day.

{: .note}
>
>`[test]` section is for testing purposes only and can be safely skipped.

	Also, `[carbon]` section describes policies for internal Carbon metrics, and `[default_1min_for_1day]` section contains default settings, which will be used if none of previous patterns are matched.

	For more information on how to configure Carbon storage see [relevant section of Graphite documentation](http://graphite.readthedocs.org/en/latest/config-carbon.html#storage-schemas-conf).

2.  Configure aggregation settings by copying defaut aggregation configuration to `/etc/carbon`:

		sudo cp /usr/share/doc/graphite-carbon/examples/storage-aggregation.conf.example /etc/carbon/storage-aggregation.conf

	`storage-aggregation.conf` describes aggregation policies Carbon uses to produce less detailed metrics, such as `1m:1d` retention in `[test]` section added on previous step. By default, only average of metric values is taken, which will result in data loss, if, for example, maximum and minimum values are needed. For this reason `[min]`,`[max]` and `[sum]` sections are added in the configuration file.

	For more information on how to configure Carbon aggregation see [relevant section of Graphite documentation](http://graphite.readthedocs.org/en/latest/config-carbon.html#storage-aggregation-conf).

3.  Enable carbon-cache to run on boot: edit file `/etc/default/graphite-carbon` and change value for `CARBON_CACHE_ENABLED` to `true`

{: .file-excerpt}
/etc/default/graphite-carbon
:   ~~~ conf
	CARBON_CACHE_ENABLED=true
    ~~~

4. Start carbon-cache service:

		sudo service carbon-cache start


## Install PostgreSQL and prepare databases for graphite-web and Grafana

1.  Install PostgreSQL database for graphite-web application using [PostgreSQL installation guide](docs/databases/postgresql/ubuntu-12-04-precise-pangolin).

2.  As `postgres` user create database user for graphite-web app:

		createuser graphite --pwprompt

	You will be asked to provide password for the new user. After that, create databases `graphite` and `grafana` with `graphite` user as owner:

		createdb -O graphite graphite
		createdb -O graphite grafana


## Set up graphite-web application

1.  Open graphite-web configuration file `/etc/graphite/local_settings.py` with `sudo` and make the changes described below.

2.	Find the `DATABASES` dictionary definition and update it with settings for PostgreSQL database created earlier:

{: .file-excerpt}
/etc/graphite/local_settings.py
:   ~~~ py
	DATABASES = {
		'default': {
			'NAME': 'graphite',
			'ENGINE': 'django.db.backends.postgresql_psycopg2',
			'USER': 'graphite',
			'PASSWORD': 'graphiteuserpassword',
			'HOST': '127.0.0.1',
			'PORT': ''
		}
	}
    ~~~

3.	Add the following lines to the end of the file:

{: .file-excerpt}
/etc/graphite/local_settings.py
:   ~~~ py
	USE_REMOTE_USER_AUTHENTICATION = True
	TIME_ZONE = 'Your/Timezone'
	SECRET_KEY = 'somelonganduniquesecretstring'
    ~~~

where TIME_ZONE is your time zone, which will be used in graphs (for possible values see TZ column value in [this timezones list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)), and SECRET_KEY is an long and unique string used as salt when hashing passwords.

4.	Save your changes.

5.  Initialize graphite-web database with command

		sudo graphite-manage syncdb

	You will be asked to create superuser account, which will be used to access graphite-web interface.


## Configure Apache for graphite-web application

1.  Copy graphite-web apache config file into apache `sites-available` directory:

		sudo cp /usr/share/graphite-web/apache2-graphite.conf /etc/apache2/sites-available

2.  Change graphite-web port from 80 to 8080 (port 80 will be used for Grafana later on). To do this, open file `/etc/apache2/sites-available/apache2-graphite.conf` and change line

		<VirtualHost *:80>
to

		<VirtualHost *:8080>

3.  Make sure Apache listens on port 8080 - edit file `/etc/apache2/ports.conf` and add line `Listen 8080` after `Listen 80`.

{: .file-excerpt}
/etc/apache2/ports.conf
:   ~~~ conf
	Listen 80
	Listen 8080
    ~~~

4.  Disable default apache site to avoid conflicts:

		sudo a2dissite 000-default

5.  Enable graphite-web virtual site:

		sudo a2ensite apache2-graphite

6.  Apply changes with command

		sudo service apache2 reload

Now you should be able to access `http://<your_server_name_or_ip>:8080` in browser and see Graphite home page.


## Feed sample data

1.  Send some test metrics by executing the following command several times with 5-6 second intervals:

		echo "test.count 4 `date +%s`" | nc -q0 127.0.0.1 2003

	Now refresh Graphite home page and you should see new `test.count` metric in the tree on the left:

![Graphite test metric](/docs/assets/graphite_test_metric.png)

## Install and configure Grafana

1.  With `sudo` edit file `/etc/apt/sources.list` and add the following line:

{: .file-excerpt}
/etc/apt/sources.list
:   ~~~ conf
	deb https://packagecloud.io/grafana/stable/debian/ wheezy main
    ~~~

2.  Add the [Package Cloud](https://packagecloud.io/grafana) key to install signed packages.

		curl https://packagecloud.io/gpg.key | sudo apt-key add -

3.  Update apt settings and install Grafana:

		sudo apt-get update
		sudo apt-get install grafana

4.  Now configure Grafana to use PostgreSQL database created earlier. With `sudo` edit file `/etc/grafana/grafana.ini` and fill in proper database configuration in `[database]` section:

{: .file-excerpt}
/etc/grafana/grafana.ini
:   ~~~ conf
	[database]
    # Either "mysql", "postgres" or "sqlite3", it's your choice
	type = postgres
	host = 127.0.0.1:5432
	name = grafana
	user = graphite
	password = graphiteuserpassword
    ~~~

5.  Also in `/etc/grafana/grafana.ini` configure domain and root_url, and set more secure admin password and secret key:

{: .file-excerpt}
/etc/grafana/grafana.ini
:   ~~~ conf
	[server]
    protocol = http
	http_addr = 127.0.0.1
	http_port = 3000
	domain = example.com
	enforce_domain = true
	root_url = %(protocol)s://%(domain)s/

	[security]
	admin_user = admin
	admin_password = SecureAdminPass
	secret_key = somelongrandomstringkey
    ~~~

6.  Enable proxy modules for Apache reverse proxying to work:

		sudo a2enmod proxy
		sudo a2enmod proxy_http
		sudo a2enmod xml2enc

7.  Create apache site configuration file `/etc/apache2/sites-available/apache2-grafana.conf` to proxy requests to Grafana, with the following content (remember to change `example.com` to your own domain name):

{: .file}
/etc/apache2/sites-available/apache2-grafana.conf
:   ~~~ conf
	<VirtualHost *:80>
	 ProxyPreserveHost On
	 ProxyPass / http://127.0.0.1:3000/
	 ProxyPassReverse / http://127.0.0.1:3000/
	 ServerName example.com
	</VirtualHost>
	~~~

7.  Enable grafana site configuration with

		sudo a2ensite apache2-grafana

8.  Configure Grafana to run at the boot time and start service.

		sudo update-rc.d grafana-server defaults 95 10
		sudo service grafana-server start

9.  Restart apache2 to pick up new modules and configuration changes.

		sudo service apache2 restart

	At this point, you should be able to open `http://<your_domain>/` in browser and see Grafana login page.

## Add Graphite data source to Grafana

1.  Log in into Grafana using `admin` credentials you specified in configuration file.

2.  Click on `Data Sources` and select `Add new`. Fill in all the fields as shown in the picture below:

![Add Data Source dialog](/docs/assets/graphite_grafana_data_source.png)

Click `Save` to create new Data Source.

3.  Create new dashboard by clicking at the `Home` button and then at `+ New`:

![Create new dashboard](/docs/assets/graphite_grafana_new_dashboard.png)

4.  Add Graph panel to the newly created dashboard:

![Create new graph panel](/docs/assets/graphite_grafana_new_graph.png)

5.  Edit Graph panel properties:

![Edit graph panel](/docs/assets/graphite_grafana_edit_graph.png)


6.  In the Graph panel properties dialog click on `select metric` and choose `test` and then `count` to add test metric:

![Add test metric to the panel](/docs/assets/graphite_grafana_edit_graph_add_metric.png)


