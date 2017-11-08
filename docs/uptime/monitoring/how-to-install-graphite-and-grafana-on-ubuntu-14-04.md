---
author:
    name: Linode Community
    email: docs@linode.com
description: 'This guide provides an introduction to the installation and basic setup of Graphite together with Grafana on Ubuntu 14.04.'
keywords: ["graphite", "grafana", "monitor", "monitoring", "monitoring tool", "analytics"]
aliases: ['deploy-graphite-with-grafana-on-ubuntu-14-04/','uptime/monitoring/deploy-graphite-with-grafana-on-ubuntu-14-04/']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
modified: 2015-12-02
modified_by:
  name: Sergey Pariev
published: 2015-12-02
title: 'Deploy Graphite with Grafana on Ubuntu 14.04'
contributor:
  name: Sergey Pariev
  link: https://twitter.com/spariev
external_resources:
  - '[Installing Graphite](http://graphite.readthedocs.org/en/latest/install.html)'
  - '[Configuring Carbon](http://graphite.readthedocs.org/en/latest/config-carbon.html)'
  - '[Installing Grafana on Debian/Ubuntu](http://docs.grafana.org/installation/debian/)'
  - '[Adding Graphite data source to Grafana](http://docs.grafana.org/datasources/graphite/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*
<hr>

![Graphite with Grafana](/docs/assets/how-to-install-graphite-and-grafana-on-ubuntu-14-04/Deploy_Graphite_smg.jpg)

# Set Up Graphite Monitoring Software with Grafana on Ubuntu

[Graphite](http://graphite.readthedocs.org/en/latest/index.html) is an enterprise-level monitoring tool renowned for performing well on systems with limited resources. It stores numeric time-series data and renders graphs of this data on demand. This guide provides an introduction to the installation and basic setup of Graphite together with [Grafana](http://grafana.org/), a popular open source application for visualizing large-scale measurement data, on Ubuntu 14.04.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible from an example account named `graphite`. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) guide to create the `graphite` user, harden SSH access, remove unnecessary network services and set up a firewall. You may need to create additional firewall rules for your specific application.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


## Install Apache, Python Tools and Graphite

1.  Install the system packages required for working with Graphite:

        sudo apt-get install build-essential graphite-web graphite-carbon python-dev apache2 libapache2-mod-wsgi libpq-dev python-psycopg2

	During the installation of `graphite-carbon`, you will be asked if you want to remove the whisper database files should you ever uninstall Graphite. Answer **No** to this prompt. You can always remove the files later (which are located in `/var/lib/graphite/whisper`).

## Configure Carbon

1.  Configure the retention rate for test metrics by adding a `[test]` block to Carbon's `storage-schemas.conf` file. *This step is given for testing purposes only and can be safely skipped if you have no use to generate test metrics.*

	The retention times given below will save data every 5 seconds for 3 hours, and a separate set of data from that aggregated sample every 1 minute for 1 day.

	{{< file-excerpt "/etc/carbon/storage-schemas.conf" aconf >}}
[carbon]
pattern = ^carbon\.
retentions = 60:90d

[test]
pattern = ^test\.
retentions = 5s:3h,1m:1d

[default_1min_for_1day]
pattern = .*
retentions = 60s:1d


{{< /file-excerpt >}}


	For more information on how to configure Carbon storage, see the section [storage-schemas.conf](http://graphite.readthedocs.org/en/latest/config-carbon.html#storage-schemas-conf) in Graphite's documentation.

2.  Copy the default aggregation configuration to `/etc/carbon` so we can configure our own settings:

		sudo cp /usr/share/doc/graphite-carbon/examples/storage-aggregation.conf.example /etc/carbon/storage-aggregation.conf

	`storage-aggregation.conf` describes aggregation policies Carbon uses to produce less detailed metrics, such as the 1m:1d retention in the [test] block added above. By default, only the average metric value is taken, which will result in data loss when, for example, you need maximum and minimum values. For this reason, `[min]`,`[max]` and `[sum]` sections are found in the configuration file.

3.  Enable Carbon's cache to run on boot:

	{{< file-excerpt "/etc/default/graphite-carbon" aconf >}}
CARBON_CACHE_ENABLED=true


{{< /file-excerpt >}}


4. Start the Carbon cache service:

		sudo service carbon-cache start


## Install and Configure PostgreSQL

1.  Install PostgreSQL for the graphite-web application:

		sudo apt-get install postgresql

2.  Change to the `postgres` user and create a database user for Graphite:

		su - postgres
		createuser graphite --pwprompt

	You will be asked to provide a password for the new database user. After that, create the databases `graphite` and `grafana` with the system's `graphite` user as the owner:

		createdb -O graphite graphite
		createdb -O graphite grafana

3.  When finished configuring the PostgreSQL databases, change back to the `graphite` user:

		su - graphite

## Configure Graphite

1.  Update Graphite's `DATABASES` dictionary definition with the settings for the PostgreSQL database created earlier:

	{{< file-excerpt "/etc/graphite/local_settings.py" py >}}
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


{{< /file-excerpt >}}


2.	Also add the following lines to the end of the file:

	{{< file-excerpt "/etc/graphite/local_settings.py" py >}}
USE_REMOTE_USER_AUTHENTICATION = True
TIME_ZONE = 'Your/Timezone'
SECRET_KEY = 'somelonganduniquesecretstring'


{{< /file-excerpt >}}


	*   TIME_ZONE is your Linode's time zone, which will be used in graphs. For possible values, run `timedatectl` or see the *TZ* column in [Wikipedia's timezone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).

	*   SECRET_KEY is a long and unique string used as a salt when hashing passwords.

3.  Initialize the database with:

		sudo graphite-manage syncdb

4.  Then answer the prompts to create a superuser account which will be used to access Graphite's web interface.


## Configure Apache for Graphite

1.  Copy Graphite's Apache config template into Apache's `sites-available` directory:

		sudo cp /usr/share/graphite-web/apache2-graphite.conf /etc/apache2/sites-available

2.  Change Graphite's port from 80 to 8080 (port 80 will be used for Grafana later).

	{{< file "/etc/apache2/sites-available/apache2-graphite.conf" aconf >}}
<VirtualHost *:8080>


{{< /file >}}


3.  Make sure Apache is listening on port 8080. Add `Listen 8080` after `Listen 80` in `ports.conf`:

	{{< file-excerpt "/etc/apache2/ports.conf" aconf >}}
Listen 80
Listen 8080


{{< /file-excerpt >}}


4.  Disable the default Apache site to avoid conflicts:

		sudo a2dissite 000-default

5.  Enable Graphite's virtual site:

		sudo a2ensite apache2-graphite

6.  Reload Apache to apply the changes:

		sudo service apache2 reload

	Now you should be able to access Graphite by going to your Linode's hostname or IP address using port 8080 in a web browser (ex: `example_domain.com:8080`). You'll see the Graphite landing page as shown below:

	![Graphite landing page](/docs/assets/graphite_landing_page.png)

## Create Sample Data

1.  Generate some test metrics with the following command:

		for i in 4 6 8 16 2; do echo "test.count $i `date +%s`" | nc -q0 127.0.0.1 2003; sleep 6; done

2.  Wait for the command prompt to be returned. Refresh the page and you should see a new `test.count` metric in the tree on the left:

	![Graphite test metric](/docs/assets/graphite_test_metric.png)

## Install and Configure Grafana

1.  Add Grafana's repository to `sources.list`:

		echo 'deb https://packagecloud.io/grafana/stable/debian/ wheezy main' |  sudo tee -a /etc/apt/sources.list

2.  Add the [Package Cloud](https://packagecloud.io/grafana) key to install signed packages:

		curl https://packagecloud.io/gpg.key | sudo apt-key add -

3.  Update apt and install Grafana:

		sudo apt-get update && sudo apt-get install grafana

4.  Configure Grafana to use the PostgreSQL database created earlier:

	{{< file-excerpt "/etc/grafana/grafana.ini" aconf >}}
[database]
  	# Either "mysql", "postgres" or "sqlite3", it's your choice
type = postgres
host = 127.0.0.1:5432
name = grafana
user = graphite
password = graphiteuserpassword


{{< /file-excerpt >}}


5.  Also in `/etc/grafana/grafana.ini`, configure the `domain` and `root_url`, and set a strong admin password and secret key:

	{{< file-excerpt "/etc/grafana/grafana.ini" aconf >}}
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


{{< /file-excerpt >}}


6.  Enable proxy modules for Apache reverse proxying to work:

		sudo a2enmod proxy proxy_http xml2enc

7.  Create an Apache site configuration file to proxy requests to Grafana. Remember to change `example.com` to your own domain:

	{{< file "/etc/apache2/sites-available/apache2-grafana.conf" aconf >}}
<VirtualHost *:80>
	ProxyPreserveHost On
	ProxyPass / http://127.0.0.1:3000/
	ProxyPassReverse / http://127.0.0.1:3000/
	ServerName example.com
</VirtualHost>


{{< /file >}}


7.  Enable Grafana's site configuration with:

		sudo a2ensite apache2-grafana

8.  Configure Grafana to run after boot and then start service:

		sudo update-rc.d grafana-server defaults 95 10
		sudo service grafana-server start

9.  Restart Apache to load the new modules and configuration changes:

		sudo service apache2 restart

	At this point, you should be able to open your Linode's domain or IP address in a browser to see Grafana's login page.


## Add a Graphite Data Source to Grafana

1.  Log in into Grafana using the `admin` credentials you specified in `grafana.ini` above.

2.  Click on **Data Sources** and select **Add new**. Fill in all the fields as shown in the screenshot below:

	![Add Data Source dialog](/docs/assets/graphite_grafana_data_source.png)

	Click **Save** to create the new Data Source.

3.  Now, before creating a graph, add more test data for the `test.count` metric by again running:

		for i in 4 6 8 16 2; do echo "test.count $i `date +%s`" | nc -q0 127.0.0.1 2003; sleep 6; done

4.  Create a new dashboard by clicking the **Home** button and then **+ New**:

	![Create new dashboard](/docs/assets/graphite_grafana_new_dashboard.png)

5.  Add a Graph panel to the newly created dashboard:

	![Create new graph panel](/docs/assets/graphite_grafana_new_graph.png)

6.  Edit the Graph panel properties by clicking the tab with the words **no title (click here)**. Then click **Edit**:

	![Edit graph panel](/docs/assets/graphite_grafana_edit_graph.png)

7.  Make sure the **graphite** data source you've created is chosen in the dropdown box at the bottom right (marked as 1 in the screenshot below). In the dropdown at the top right corner (marked as 2), choose **Last 15 minutes**.

	Click **select metric**. Choose **test** and then **count** (marked as 3) to add the test metric you previously created. At this point, the sample data should appear on the graph.

	Finally, click the **Save** button (marked as 4) to save the dashboard you just created.

	![Add test metric to the panel](/docs/assets/graphite_grafana_edit_graph_add_metric.png)
