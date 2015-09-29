Learn in this guide how to setup the very popular web server [Nginx](https://en.wikipedia.org/wiki/Nginx) as a high speed load balancer for multiple backend servers serving the actual content.  
This guide is part of a [series about load balancing](link back to an overview of all load balancing related guides should go in here). If you have not yet checked out the introduction to load balancing and like to learn more about it I highly suggest you go and read it first.

{: .note}
>
> This guide is based around the Debian/Ubuntu platform so watch out if you'd like to use your favorite Linux distribution.

{: .note}
>
>The steps required in this guide require root privileges. Be sure to run the steps below as **root** or with the `sudo` prefix. For more information on privileges see our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
 
In this guide we will take the easiest approach to load balancing by just simply load balancing a static html file. The rednering of a html file coming from the backend servers is just a proof of concept. Having a dynmaic web framework running with it or tuning Nginx to do certain things is beyond the scope of this guide. This guide is intended to make you understand the concept of load balancing by giving a concrete example, there are good guides about Nginx already available in the [Linode library](https://www.linode.com/docs/websites/nginx/).


## Prerequisites
1. Setup the Linode that'll act as your load-balancer for the other Linodes (or other server somewhere else) as specified in the [Getting Started](https://www.linode.com/docs/getting-started) and [Securing Your Server](https://www.linode.com/docs/security/securing-your-server/) guides.

2. Ensure that your firewall (either iptables, ufw or your favorite firewall) is setup in a way that it wont block any of the TCP ports you'll need for the web service you want to load balance (in our example case that'll be TCP port 80 or 443).

3. Have [Nginx installed and running on your Linode](https://linode.com/docs/websites/nginx/) that will act as the load balancer. Once it's installed and running fine you should be able to type the public IP address into your webbrowser and see the default welcome page that comes with every Nginx installation.

4. Have at least one backend server to test your configuration running a http server of your choise (will be Nginx in this example).

 
 ## Load balancing
 Now that you have a working copy of Nginx running on your Linode lets get started with actually load balancing.
 
 Your load balancer has to be able to resolve your backend servers IP addresses. To access the backend servers you have two choises.
 
 1. the public static IP address
 2. private network IP within Linodes network.
 
 
 {: .note}
 >
 > You can mix and match the private network IPs and public static IPs the way you feel like. The only important thing is that the load balancer needs to be able to directly resolve the IPs. 
 
 For this guide we will use the public IP address since we are later able to easily connect to the server directly in oder to check on it for testing.
 
 ## Setting the reverse proxy
 First we want to create a config file for the domain we want to load balance. We will do that by creating a new text based file with `nano /etc/nginx/sites-available/example.com.conf`  

In this configuration file we will firstly define the backend server(s) with the help of the upstream module:

{: .file-excerpt}
/etc/nginx/sites-available/example.com.conf
:	~~~ conf
	upstream backend {
		server yourfirstbackendip;
		serer yoursecondbackendip;
		}
	~~~

{: .note}
>
> You can also set DNS resolveable domain names for the servers, which then might resolve to multiple servers. The sky is the limit here really.

After that (in the file) we put the server context to make Nginx listen on port 80 and then send it off to the backend servers.

{: .file-excerpt}
/etc/nginx/sites-available/example.com.conf
:	~~~
	server {
	listen 80;
	listen [::]:80;
	
	server_name example.com
	
	location / {
		proxy_pass http://backend;
		proxy_set_header Host $host;
		proxy_set_header X-Remote-IP $remote_addr;
		}
	}
	~~~

This will make Nginx listen on Port 80 on all networks, and proxy anything coming in (http://example.com/) to your defined backend via the http protocol. This is why your backend servers need to run a http server as well but these could be any http server and doesn't has to be Nginx as well. This is why it is very easy to support legacy servers as well as the newest, fanciest and fastest servers out there. If it understands the protocol you are using it is supported by your stack automatically.

You can now save the new config file and create a symlink to sites-enabled by typing

`ln -s /etc/nginx/sites-available/example.com.conf /etc/nginx/sites-enabled/example.com.conf`

Next we want to run a quick configuration test using 

`service nginx configtest`

and once it completes with no errors restart Nginx so that the new website will be available.

`service nginx restart`


## Setting the backend

Now that we have the frontend part up and running lets focus on the backend part.


As before we create the config file for our domain and create a server context in it.

{: .file}
/etc/nginx/sites-available/example.com.conf
:	~~~
	server {
	listen 80;
	listen [::]:80;
	
	server_name example.com;
	
	root /var/www/example.com;
	
	index index.html;
	
	}
	
	~~~

As you might have noticed we have linked the root path to a folder that might not exist yet, so before restarting Nginx lets create the folder and the test index file.

	`mkdir /var/www/example.com/html`
	
 	`nano /var/www/example.com/html/index.html`
	 
Place this simple html in the index.html file just as a proof of concept:

{: .file}
/var/www/example.com/html
:	~~~
	<!DOCTPE HTML>
	<html>
	<body>
	<h1>yay load balancing</h1>
	</body>
	</html>
	~~~
	

Now that the directory and index file exists nginx shouldn't yell at us when restarting it. Go ahead and restart it now:

	`service nginx restart`

Repeat these steps on all your other backend servers but maybe change the h1 tag to some other text so that you can actually see the load balancing algorithm in action. Everytime you refresh the website it should go to the next server in the server array, and therefore should return a slightly different website.


## Notes

If you want to keep using the public IP addresses on your backend server but don't want to expose the regular ports you could easily change it in the config file on the backends to whatever ports you want to use, you have to then change the upstream module in the load balancer config file and just place the port you chose and add it to the end to the 

{: .file-excerpt}
/etc/nginx/sites-available/example.com.conf
:   ~~~
	...  
	server yourfirstbackendip:8080  
	...
	~~~

(We have here chosen to use port 8080 for the backend, you can pick any port you want though. Just remember to let your load balancer access it by allowing incoming traffic through the firewall on port 8080 on your backend servers.


## More information

You can if you wanted to look at the excelent guides about Nginx that already exists in order to learn how to further tune Nginx or add other functionality. Nginx themselfes also provide good documentation about their webserver.

* [Nginx guides in the Linode library](https://linode.com/docs/websites/nginx/)
* [Nginx website](https://www.nginx.com/)
* [Load balancing example by Nginx](https://www.nginx.com/resources/admin-guide/load-balancer/) (Slightly different approach to the load balancing setup)
* [Other posts in the load balancing series](link has to go in here)