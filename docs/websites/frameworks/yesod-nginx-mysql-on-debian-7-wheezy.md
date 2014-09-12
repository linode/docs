---
author: 
  name: Si-Qi Liu
  email: liusq@tsinghua.edu.cn
description: 'Installing the web framework Yesod with the server Nginx and MySQL on Debian 7'
keywords: 'yesod, nginx, mysql, debian 7'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
alias:
modified: Tuesday, September 2nd, 2014
modified_by:
  name: Joseph Dooley
published: Tuesday, September 2nd, 2014
title: 'Yesod, Nginx, and MySQL on Debian 7(Wheezy)'
---

This is a Linode Community guide by author Si-Qi Liu. [Write for us](/docs/contribute) and earn $100 per published guide.

Yesod is a web framework based on the purely functional programming language Haskell. It is designed for productive development of type-safe, RESTful, and high
performance web applications. This guide describes the required process for deploying Yesod and Nginx web server with MySQL database on Debian 7 (Wheezy).

#Set the Hostname

Before you begin installing and configuring the components described in this guide, please make sure you've followed our instructions for setting your hostname.
Issue the following commands to make sure it is set properly:

    hostname
    hostname -f

The first command should show your short hostname, and the second should show your fully qualified domain name (FQDN).

#Install Required Packages

Update your system's repository database and upgrade the system:

    sudo apt-get update
    sudo apt-get upgrade

Issue the following command to install packages required by Yesod:

	sudo apt-get install haskell-platform libpcre3-dev libmysqlclient-dev

The two `lib*-dev` packages are required by the Haskell module `mysql`. If you would like to use SQLite, then you don't need to install them.

Obviously, you also need Nginx and MySQL, please check
[Websites with Nginx on Debian 7 (Wheezy)](/docs/websites/nginx/websites-with-nginx-on-debian-7-wheezy)
and
[Using MySQL Relational Databases on Debian 7 (Wheezy)](/docs/databases/mysql/using-mysql-relational-databases-on-debian-7-wheezy)
for their installation guides.

#Install Yesod

Yesod is a large project, which depend on a lot of other packages. We will use *cabal* to manage all of them. Cabal is the package manager for the Haskell
community's central package archive *Hackage*. Because all packages on Hackage are maintained by the community, the dependency relations are not well protected,
so you will probably meet the so-called "cabal dependency hell" problem.

To avoid such problem, the maintainer of Yesod give us a metapackage named *yesod-platform*. The version numbers of its dependencies are fixed, so you won't
meet the "hell". On the other hand, fixed version numbers may cause other problems, especially when you also use cabal to manage other large projects (such
as pandoc, a Haskell library for converting markup formats). The solution for this problem is very simple: if you have several large projects to manage, create new
users for each of them, and then install them into their users' home folder.

So let us create a new user. We name it "yesod":

    sudo adduser yesod

Switch to it.

    su - yesod

Add the path variable for the programs installed by cabal.

    echo PATH=\$HOME/.cabal/bin:\$PATH >> .bashrc
    source .bashrc

Create the *.cabal* folder, and download the latest package list from *hackage.haskell.org*.

    cabal update

Upgrade *cabal-install* first. The *cabal-install* package offered by the *haskell-platform* package of Debian 7 doesn't have the "sandbox" feature, which is very
useful for Yesod, so we need to upgrade it.

    cabal install cabal-install

Logout and su again, then check whether the new cabal is in use

    exit
    su - yesod
    cabal --version

The version should be greater than 1.20.

Upgrade *alex* and *happy*. They are "flex and bison" for Haskell. The *language-javascript* package, which is required by Yesod, depend on higher versions
of them, so we need to upgrade them.

    cabal install alex happy

Now we can install the *yesod-platform* package and its friend *yesod-bin*.

    cabal install --reorder-goals --max-backjumps=-1 yesod-platform yesod-bin

If your Linode doesn't have enough memory, cabal may complain that it can not resolve the dependency relations. You can tell it the answer for Debian 7 directly:

    cabal install --reorder-goals --max-backjumps=-1 yesod-platform-1.2.10 yesod-bin-1.2.10.2

It may take about 20 minutes to compile everything, so you can have a cup of tea now. When it finishes, you Yesod platform has been succsesfully installed.

#Use Yesod

To develop your Yesod site, issue the following command to construct a scaffold first.

    yesod init

You will be asked the name of your project, and the database you want to use. I suppose the name you give is "myblog", and the answer for the second question
is "mysql". 

Enter the folder created by *yesod*

    cd myblog

Issue the following command to initialize the sandbox. The sandbox feature ensure that the dependencies of your site are installed *into* the folder where you site
located, so *cabal* won't destroy the packages installed in */home/yesod/.cabal*. You can develop several sites simultaneously, and don't need to worry about the
"cabal dependency hell".

    cabal sandbox init

If you get an error here, your *cabal* is probably not the latest one. Please upgrade it.

Then install the packages required by your project in the sandbox

    cabal install --enable-tests . --reorder-goals  --max-backjumps=-1 yesod-platform yesod-bin

If cabal complain again about the memory, give it the version numbers explicitly like above. If it reports that mysql is fail to install, it is probably that
you don't have "libpcre3-dev" and "libmysqlclient-dev" in your Debian 7. Instal them, and run the above command again. If everything goes well, after another
20 minutes, your site's scaffold will be compiled succesfully.

#Working with MySQL

Before testing the scaffold of your site, you need create a user and several databases in MySQL. The configuratioin file of your project for MySQL is located
at *config/mysql.yml*, you can modify it, using your own host, port, username, password, databases, and so on. The default username, password, and database for
development are same with the name of your project, so they are "myblog" in this guide. We also need three databases "myblog_test", "myblog_staging",
and "myblog_production" for different aims. You can follow the guide
[Using MySQL Relational Databases on Debian 7 (Wheezy)](/docs/databases/mysql/using-mysql-relational-databases-on-debian-7-wheezy)
to create user, databases, and assign the user to the databases.

When the MySQL user and databases are ready, you can issue the following command to start you project:

    yesod devel

Please wait for a while for compilation, then you can see the scaffold of your site at [*http://localhost:3000/*](http://localhost:3000/).
Next, you can go on to use yesod, and develop your site.

#Deploy to Nginx

When you finish the development of your site, you can deploy it to a certain web server. We choose Nginx in this guide, which is also recommended in
[The Yesod Book](http://www.yesodweb.com/book).

First you need to prepare the files to be deployed. Issue the following command in the folder */home/yesod/myblog*:

    cabal clean && cabal configure && cabal build

Then copy *dist/build/myblog/myblog* and the config folder and the static folder to some where you plan to place your site. We assume you place them in
*/home/yesod/deploy*. Make sure this fold can be accessed by nginx.

    chmod 755 /home/yesod
    mkdir ../deploy
    cp dist/build/myblog/myblog ../deploy
    cp -R static ../deploy
    cp -R config ../deploy

Enter */home/yesod/deploy*, modify the file *config/settings.yml*, replace the variable *approot* in section *Production* by your FQDN.

    The last three lines of modified /home/yesod/deploy/config/settings.yml:
        Production:
          approot: "http://www.yoursite.com"
          <<: *defaults

You can also use other virtual host name here, like *myblog.yoursite.com*. Just make sure it is same with the one you give to nginx. Then issue

     ./myblog Production --port 3000

Your site is online now.

The last step is to configure nginx. Create the file */etc/nginx/sites-available/myblog*

    server {
        listen 80;
        server_name www.yoursite.com;
        location / {
            proxy_pass http://127.0.0.1:3000;
        }
        location /static {
            root /home/yesod/deploy;
            expires max;
        }
    }

Link it into */etc/nginx/sites-enabled*, and restart nginx

    sudo ln -s /etc/nginx/sites-available/myblog /etc/nginx/sites-enabled
    sudo service nginx restart

You can check it at *http://www.yoursite.com/* now.

One can also configure Nginx to run Yesod in FastCGI  mode, which is not covered here. You can check
[the corresponding chapter in The Yesod Book](http://www.yesodweb.com/book/deploying-your-webapp>)
for details.

The installation and configuration of Yesod working with Nginx and MySQL are finished.


#More Information

You may wish to consult the following resources for additional information on this topic:

- [Hakell Platform](http://www.haskell.org/platform/)
- [Haskell Wiki for *cabal-install*](http://www.haskell.org/haskellwiki/Cabal-Install)
- [Information for *yesod-platform*](http://hackage.haskell.org/package/yesod-platform)
- [Yesod Quick Start Guide](http://www.yesodweb.com/page/quickstart)
- [The Chapter on Deployment of the Yesod Book](http://www.yesodweb.com/book/deploying-your-webapp)






