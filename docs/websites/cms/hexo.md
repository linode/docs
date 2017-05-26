---
author:
  name: darkshell
  email: byujiang@gmail.com
description: 'Installing Hexo - a blog platform in Linode'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'

title: 'Build Your Own Hexo Blog on Linode'
contributor:
  name: darkshell
  link: github.com/darkshell
  external_resources:
  - '[Hexo](https://hexo.io)'
---

## Introduction
[Hexo](https://hexo.io) is a very beautiful static blog platform with so many plugins and themes. You can write your post with markdown, markup or so, publish your posts and deploy your site easily as pushing to a git repo.

Installing hexo and deploy your blog is very easy. In this toturial, we use centos 7 and nginx as our platorm.
## Installing Nodejs and Nginx
On a clean centos 7, we start with update the system at first,

	yum update && yum install nginx nodejs
	systemctl enable firewalld
	systemctl enable nginx
	systemctl start firewalld
	systemctl start nginx
	firewall-cmd --permanent --add-service=http
	firewall-cmd --reload

If `epel` repo not installed, we should install it first,

	yum install epel-release && yum update

For simplification, we may need to create a new user named `hexo` or else, and addint it to group `nginx` and group `wheel` for convenience,

	useradd -d /home/hexo -m -U -r -s /bin/bash hexo
	usermod -aG nginx hexo
	usermod -aG nginx wheel
	passwd hexo
	chown -R hexo:nginx /home/hexo
	chmod -R 770 /home/hexo

## Installing Hexo

Switch to user `hexo`, and install hexo as following,

	su hexo - && cd ~
	mkdir -p ~/web/hexo
	sudo npm install -g hexo-cli hexo-server
	cd web && hexo init hexo
	cd hexo && npm install --save

And now, you can now write your firs post like this,

	hexo new "helloworld"

0r write a new draft

	hexo new draft 'hello'

The specific grammer of writing post via hexo can be found at [https://hexo.io](https://hexo.io).

After writing a post, you can generate the html files which lie in ~/web/hexo/public directory, and now we have our static blog.

## Configuring nginx to serve hexo

Creating a server block for our hexo blog,

	server {
	listen 80;
	listen [::]:80;

	server_name example.com, www.example.com

	error_page 404 /404/;
	location / {
		root /home/hexo/web/hexo/public;
		index index.html;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $http_host;
		}
	}

Saving as `hexo.conf` and move it to `/etc/nginx/conf.d/`, and restart nginx

	sudo mv hexo.conf /etc/nginx/conf.d
	sudo systemctl restart nginx

If everything right, visit `http://example.com` and we will see our hexo blog.

## Writing Locally and Deploying to Server

It's not convenient to writing blog on the server, so we could writing posts on the local system, and push it to the server using git.

First, create a bare repo on the server,

	mkdir -p /home/hexo/web/git && cd /home/hexo/web/git
	git init --bare example
	cd example/hooks/

Create a bash file `post-recieve`, and paste the following,

	#!/bin/bash

	deploy_to_dir="/home/hexo/web/git/hexo"

	GIT_WORK_TREE=$deploy_to_dir git checkout -f master
	echo "DEPLOY: master copied to $deploy_to_dir"

	hexo_dir="/home/hexo/web/hexo/"

	cd $hexo_dir

	ln -sf $deploy_to_dir/themes $hexo_dir/
	ln -sf $deploy_to_dir/source $hexo_dir/
	ln -sf $deploy_to_dir/scaffolds $hexo_dir/
	ln -sf $deploy_to_dir/_config.yml $hexo_dir/

	hexo g

	if [[ $? == 0 ]]; then
	echo "Congratulations! Your blog		has been correctly deployed"
	else
	echo "Unfortunately your blog is not been deployed correctly"
	fi

On the local system, builing a hexo blog as above under `/home/user/Sites/hexo` for example,
and then initialize the directory to a git repo,

	cd /home/user/Sites/hexo
	git init
	git remote add origin ssh://hexo@server_addr:~/web/git/exmaple

Aftering finishing one post, we can commit and push it to the server to automatically generate the static files,

	git add . && git commit -m "new post"
	git push origin master

Now enjoy yourself with the hexo blog!!!
