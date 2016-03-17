---
author:
	name: Michael Jalloh
	email: michaeljalloh19@gmail.com
description: 'This guide is to help in deploying a flask web app using uWSGI and Nginx in Ubuntu 14.04'
keywords: 'flask, uwsgi, ubuntu 14.04'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)]'
created: Tuesday, March 16, 2015
created by: 
	name: Michael Jalloh
	link: https://twitter.com/michaeljalloh19
alais: ['websites/nginx/deploying-a-flask-app-with-uwsgi-and-nginx-on-ubuntu-14.04/']

title: How to deploy a flask app with uWSGI and Nginx in Ubuntu 14.04
---

*This is a Linode Community guide. Write for us and earn $250 per published guide.*
<hr>

[Flask](http://flask.pocoo.org/) is a microframework for Python based on Werkzeug, Jinja 2. This guide provides and introduction into deploying a Flask application using [uWSGI](https://uwsgi-docs.readthedocs.org/en/latest/) and [Nginx](https://www.nginx.com/) on Ubuntu 14.04.


## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section

3.  Update your system.

        sudo apt-get update && sudo apt-get upgrade

{: .note}
>
>This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Building Our Flask App

### Setting Up Our Environment

1. Lets install `pip` to be able to download install python package easily and install vim too. We also need to install `python-dev` because its needed by uwsgi when compiling:
	sudo apt-get install python-dev python-pip vim

2. We are going to install `virtualenv` with pip and then create a virtual environment to hold our flask app
	sudo pip install virtualenv 
	mkdir flask_app
	virtualenv flask_app

3. Now `cd` into the flask_app directory and activate the virtual environment:
	cd flask_app
	source bin/activate
	
4. Now that the virtual environment is activated we will install `flask` and uwsgi:
	pip install flask
	pip install uwsgi

### Building Our App
1. Create a new directory name app and create a file called `app.py`:
	mkdir app
	cd app
	vim app.py

2. Now lets write the flask app:
	{: .file}
	/flask_app/app/app.py
	:	~~~ py
		from flask impor Flask
		
		application = Flask(__name__)
		
		@application.route("/")
		def index():
			res = '''<h2>Hello<h2><br>
				I'm a flask app'''
			return res
		
		if __name__ == '__main__':
			application.run(host='0.0.0.0', port=5000)
		~~~

3. Now lets test our app if it working:
	python app.py

4. Open your browser and enter the ip address of your server followed by `:5000`. You should see the `Hello` message.

5. Close the flask app by type `CTRL-C`
### Create the UWSGI script

1. Create another file called wsgi.py in the app directory:
	{: .file}
	/flask_app/app/wsgi.py
	:	~~~ py
		from app import application

		if __name__ =='__main__':
			application.run()
		~~~
2. Test the wsgi.py file:
	uwsgi --socket '0.0.0.0:5000' --protocol=http -w wsgi.py

3. Open your browser and enter the ip address of your server followed by `:5000`

4. Now close the uwsgi instance by press `CTRL-C`

5. Deactivate the virtaul environment:
	deactivate


### Create an Upstart Script for the App

1. Create a uwsgi configuration script, name it `app.ini`:
	vim app.ini

2. Now write this in the script:
	{: .file}
	/flask_app/app/app.ini
	:	~~~ ini
		[uwsgi]
		module = wsgi

		master = true
		processes = 5
		
		socket = app.sock
		chmod-socket = 660
		vacuum = true

		die-on-term = true
		~~~
3. close it and save it.

4. Create another script but this time in the `/etc/init folder. This will be our upstart script:
	vim /etc/init/app.conf

5. Write into it:
	{: .file}
	/etc/init/app.conf
	:	~~~ conf
		description "uWSGI server instance to serve the flask app"
		
		start on runlevel [2345]
		stop on runlevel [!2345]

		setuid `user`
		setgid www-data

		env PATH=/home/`user`/flask_app/bin/
		chdir /home/`user`/flask_app/app/
		exec uwsgi --ini app.ini
		~~~
6. Save the file. That's all the configuration for the flask app. Now lets move on the Nginx

## Installing and Configuring Nginx

### Install Nginx

1. Start by installing Nginx:
	sudo apt-get install nginx nginx-common

2. When the installation is done. Open a browser and enter your server ip address. You will be greeted by the Nginx welcome page

### Configuring Nginx to server our flask app.

1. Create a file in `/etc/nginx/sites-available/` name the file `app`:
	sudo vim /etc/nginx/sites-available/app

2. Write into it:
	{: .file}
	/etc/nginx/sites-available/app
	:	~~~
		server {
			listen 80;
			server_name `your_server_ip_address`;
			
			location / {
					include uwsgi_params;
					uwsgi_pass unix:/home/`user`/flask_app/app/app.sock;
				   }
			}
		~~~
3. Now close the file and then create a synlink to nginx's `sites-enabled` 
	sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled

4. Start the app uwsgi instance:
	sudo start app

5. Restart Nginx:
	sudo service nginx restart


	
