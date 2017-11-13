---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Fine tune nginx for maximum performance'
keywords: ["nginx", "performance", "tuning", "optimize", "web servers"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['websites/nginx/configure-nginx-for-optimized-performance/']
published: 2015-09-09
modified: 2015-09-09
modified_by:
    name: Linode
title: 'How to Configure nginx for Optimized Performance'
contributor:
    name: Bob Strecansky
    link: https://github.com/bobstrecansky
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

nginx is known for its use in both high performance load balancing, and caching static and dynamic web content.  This guide aims to provide assistance in determining the best performance optimizations to make to an nginx server in order to speed up delivery of content to your end users.

![How to Configure nginx for Optimized Performance](/docs/assets/configure-nginx-for-optimized-performance.png "How to Configure nginx for Optimized Performance")

If you're unfamiliar with how nginx works, we suggest reading [How to Configure nginx](/docs/websites/nginx/how-to-configure-nginx) first.


## Worker Modifications

The easiest thing to set in your configuration is the right number of workers and connections.

### Worker Processes

In `/etc/nginx/nginx.conf`, set `worker_processes 1;` if you have a lower traffic site where nginx, a database, and a web application all run on the same server.

If you have a higher traffic site or a dedicated instance for nginx, set one worker per CPU core: `worker_processes auto;`

If you'd like to set this manually, you can utilize `grep ^processor /proc/cpuinfo | wc -l` to find the number of processes that the server can handle.


### Worker Connections

The option `worker_connections` sets the maximum number of connections that can be processed at one time by each worker process. By default, the worker connection limit is 512, but many systems can handle more.

The appropriate sizing can be discovered through testing, as it is variable based on the type of traffic nginx is handling.  The system's core limitations can also be find through using `ulimit`:

	ulimit -n

It will output a number as a result:

	65536

You can also set `use epoll`, a scalable I/O event notification mechanism to trigger on events and make sure that I/O is utilized to the best of its ability.

Lastly, you can utilize `multi_accept` in order for a worker to accept all new connections at one time.

The `events` function should look something like this when configured:


{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
events {
	worker_connections 65536;
	use epoll;
	multi_accept on;
}


{{< /file-excerpt >}}



## HTTP and TCP Optimizations

### Keep Alive

Keep alive allows for fewer reconnections from the browser. Remember to place these settings inside the http {} directive.

- 	`keepalive_timeout` and `keepalive_requests` control the keep alive settings.

-	`sendfile` optimizes serving static files from the file system, like logos.

-	`tcp_nodelay` allows nginx to make TCP send multiple buffers as individual packets.

-	`tcp_nopush` optimizes the amount of data sent down the wire at once by activating the *TCP_CORK* option within the TCP stack. TCP_CORK blocks the data until the packet reaches the MSS, which is equal to the MTU minus the 40 or 60 bytes of the IP header.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
keepalive_timeout 65;
keepalive_requests 100000;
sendfile on;
tcp_nopush on;
tcp_nodelay on;


{{< /file-excerpt >}}



### Buffer Size

Making tweaks to the buffer size can be advantageous. If the buffer sizes are too low, then nginx will write to a temporary file. This will cause for excessive disk I/O. Remember to place these settings inside the http {} directive.

-	`client_body_buffer_size` handles the client buffer size.  Most client buffers are coming from POST method form submissions. 128k is normally a good choice for this setting.

-	`client_max_body_size` sets the max body buffer size. If the size in a request exceeds the configured value, the 413 (Request Entity Too Large) error is returned to the client. For reference, browsers cannot correctly display 413 errors. Setting size to 0 disables checking of client request body size.

-	`client_header_buffer_size` handles the client header size. 1k is usually a sane choice for this by default.

-	`large_client_header_buffers` shows the maximum number and size of buffers for large client headers. 4 headers with 4k buffers should be sufficient here.

-	`output_buffers` sets the number and size of the buffers used for reading a response from a disk.  If possible, the transmission of client data will be postponed until nginx has at least the set size of bytes of data to send. The zero value disables postponing data transmission.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
client_body_buffer_size      128k;
client_max_body_size         10m;
client_header_buffer_size    1k;
large_client_header_buffers  4 4k;
output_buffers               1 32k;
postpone_output              1460;


{{< /file-excerpt >}}



### Connection Queue

Some directives in the in the `/etc/sysctl.conf` file can be changed in order to set the size of a Linux queue for connections and buckets.  Updating the `net.core.somaxconn` and `net.ipv4.tcp_max_tw_buckets` changes the size of the queue for connections waiting for acceptance by nginx.  If there are error messages in the kernel log, increase the value until errors stop.

{{< file-excerpt "/etc/sysctl.conf" aconf >}}
net.core.somaxconn = 65536
net.ipv4.tcp_max_tw_buckets = 1440000


{{< /file-excerpt >}}


Packets can be buffered in the network card before being handed to the CPU by setting the max backlog with the `net.core.netdev_max_backlog` tag. Consult the network card documentation for advice on changing this value.


### Timeouts

Timeouts can also drastically improve performance. Remember to place these settings inside the http {} directive.

-	`client_body_timeout` sends directives for the time a server will wait for a **body** to be sent.

-	`client_header_timeout` sends directives for the time a server will wait for a **header** body to be sent.  These directives are responsible for the time a server will wait for a client body or client header to be sent after request. If neither a body or header is sent, the server will issue a 408 error or Request time out.

-	`send_timeout` specifies the response timeout to the client. This timeout does not apply to the entire transfer but, rather, only between two subsequent client-read operations. Thus, if the client has not read any data for this amount of time, then nginx shuts down the connection.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
client_header_timeout  3m;
client_body_timeout    3m;
send_timeout           3m;


{{< /file-excerpt >}}



### Static Asset Serving

If your site serves static assets (such as CSS/JavaScript/images), nginx can cache these files for a short period of time.  Adding this within your configuration block tells nginx to cache 1000 files for 30 seconds, excluding any files that haven't been accessed in 20 seconds, and only files that have been accessed at least 5 times in that timeframe. If you aren't deploying frequently you can safely bump up these numbers higher. Remember to place these settings inside the http {} directive.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 5;
open_file_cache_errors off;


{{< /file-excerpt >}}


You can also cache via a particular location.  Caching files for a long time is beneficial, especially if the files have a version control system delivered by the build process or CMS. This should be placed in the virtual host configuration or main configuration (e.g: /etc/nginx/sites-available/default)

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
location ~* .(woff|eot|ttf|svg|mp4|webm|jpg|jpeg|png|gif|ico|css|js)$ {
	expires 365d;
}


{{< /file-excerpt >}}



### Gzipping Content

For content that is plain text, nginx can use gzip compression to serve back these assets compressed to the client.  Modern web browsers will accept gzip compression and this will shave bytes off of each request that comes in for plain text assets. The list below is a "safe" list of compressible content types; however, you only want to enable the content types that you are utilizing within your web application. Remember to place these settings inside the http {} directive.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
gzip on;
gzip_min_length 1000;
gzip_types text/html application/x-javascript text/css application/javascript text/javascript text/plain text/xml application/json application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/xml font/eot font/opentype font/otf image/svg+xml image/vnd.microsoft.icon;
gzip_disable "MSIE [1-6]\.";


{{< /file-excerpt >}}



## Filesystem Optimizations

These file system operations improve system memory management, and can be added in `/etc/sysctl.conf`.

### Ephemeral Ports

When nginx is acting as a proxy, each connection to an upstream server uses a temporary, or ephemeral, port.

The IPv4 local port range defines a port range value.  A common setting is `net.ipv4.ip_local_port_range = 1024 65000`.

The TCP FIN timeout belays the amount of time a port must be inactive before it can reused for another connection. The default is often 60 seconds, but can normally be safely reduced to 30 or even 15 seconds:

{{< file-excerpt "/etc/sysctl.conf" >}}
net.ipv4.tcp_fin_timeout = 15


{{< /file-excerpt >}}



### Scale TCP Window

The TCP window scale option is an option to increase the receive window size allowed in Transmission Control Protocol above its former maximum value of 65,535 bytes. This TCP option, along with several others, is defined in IETF RFC 1323 which deals with long fat networks.  It can be defined with the `net.ipv4.tcp_window_scaling = 1` tag.


### Backlog Packets Before Drop

The `net.ipv4.tcp_max_syn_backlog` determines a number of packets to keep in the backlog before the kernel starts dropping them.  A sane value is `net.ipv4.tcp_max_syn_backlog = 3240000`.


### Close connection on Missing Client Response

`reset_timedout_connection on;` allows the server to close the connection after a client stops responding. This frees up socket-associated memory. Remember to place this setting inside the http {} directive.


### File Descriptors

File descriptors are operating system resources used to handle things such as connections and open files.  nginx can use up to two file descriptors per connection. For example, if it is proxying, there is generally one file descriptor for the client connection and another for the connection to the proxied server, though this ratio is much lower if HTTP keep alives are used. For a system serving a large number of connections, these settings may need to be adjusted.

`sys.fs.file_max` defines the system wide limit for file descriptors. `nofile` defines the user file descriptor limit, set in the `/etc/security/limits.conf` file.

{{< file-excerpt "/etc/security/limits.conf" aconf >}}
soft nofile 4096
hard nofile 4096


{{< /file-excerpt >}}


### Error Logs

`error_log logs/error.log warn;` defines the location and the different severity levels written to the error log. Setting a certain log level will cause all messages from that log level and higher to be logged. For example, the `default` level error will cause `error`, `crit`, `alert`, and `emerg` messages to be logged. If this parameter is omitted, then `error` is used by default.

-	**`emerg`:** Emergency situations where the system is in an unusable state.

-	**`alert`:** Severe situation where action is needed promptly.

-	**`crit`:** Important problems that need to be addressed.

-	**`error`:** An Error has occurred. Something was unsuccessful.

-	**`warn`:**	Something out of the ordinary happened, but not a cause for concern.

-	**`notice`:** Something normal, but worth noting has happened.

-	**`info`:**	An informational message that might be nice to know.

-	**`debug`:** Debugging information that can be useful to pinpoint where a problem is occurring.

Access logs with the `log_format` directive to configure a format of logged messages, as well as the `access_log` directive to specify the location of the log and the format.

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
http {
	log_format compression '$remote_addr - $remote_user [$time_local] ' '"$request" $status $body_bytes_sent ' '"$http_referer" "$http_user_agent" "$gzip_ratio"';
	server {
		gzip on;
		access_log /spool/logs/nginx-access.log compression;
	}
}


{{< /file-excerpt >}}



### Conditional Logging

Conditional logging can be completed if the system administrator only wants to log certain requests.  The example below excludes logging for both 2XX and 3XX HTTP status codes:

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
map $status $loggable {
	~^[23]  0;
	default 1;
}


{{< /file-excerpt >}}



### Turning off Logging Completely

Logging can be turned off completely if you have an alternative logging methodology or if you don't care about logging any of the requests to the server.  Turning off logging can be performed with the following server directives

{{< file-excerpt "/etc/nginx/nginx.conf" aconf >}}
server {
    listen       80;
    server_name  example.com;
    access_log  off;
    error_log off;
}


{{< /file-excerpt >}}



### Activity Monitoring

One can also set up activity monitoring to see JSON responses in real-time.  With the following configuration, the webpage `status.html` located at `/usr/share/nginx/html` can be requested by the URL `http://127.0.0.1/status.html`.

You could also utilize [Linode Longview](https://github.com/linode/longview) in order to view these collections.  Longview is a system level statistics collection and graphing service, powered by the Longview open source software agent that can be installed onto any Linux system. The Longview agent collects system statistics and sends them to Linode, where the data is stored and presented it in beautiful and meaningful ways.


## Example Files

Several tweaks have now been made across three files to improve nginx performance on your system. Full snippets of the files are included below.

### sysctl.conf

{{< file-excerpt "/etc/sysctl.conf" aconf >}}
net.core.somaxconn = 65536
net.ipv4.tcp_max_tw_buckets = 1440000
net.ipv4.ip_local_port_range = 1024 65000
net.ipv4.tcp_fin_timeout = 15
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_max_syn_backlog = 3240000


{{< /file-excerpt >}}


### limits.conf

{{< file-excerpt "/etc/security/limits.conf" aconf >}}
soft nofile 4096
   hard nofile 4096


{{< /file-excerpt >}}


### nginx.conf

{{< file-excerpt "nginx.conf" aconf >}}
pid /var/run/nginx.pid;
worker_processes  2;

events {
	worker_connections   65536;
	use epoll;
	multi_accept on;
}

http {
	keepalive_timeout 65;
	keepalive_requests 100000;
	sendfile         on;
	tcp_nopush       on;
	tcp_nodelay      on;

	client_body_buffer_size    128k;
	client_max_body_size       10m;
	client_header_buffer_size    1k;
	large_client_header_buffers  4 4k;
	output_buffers   1 32k;
	postpone_output  1460;

	client_header_timeout  3m;
	client_body_timeout    3m;
	send_timeout           3m;

	open_file_cache max=1000 inactive=20s;
	open_file_cache_valid 30s;
	open_file_cache_min_uses 5;
	open_file_cache_errors off;

	gzip on;
	gzip_min_length  1000;
	gzip_buffers     4 4k;
	gzip_types       text/html application/x-javascript text/css application/javascript text/javascript text/plain text/xml application/json application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/xml font/eot font/opentype font/otf image/svg+xml image/vnd.microsoft.icon;
	gzip_disable "MSIE [1-6]\.";

	# [ debug | info | notice | warn | error | crit | alert | emerg ]
	error_log  /var/log/nginx.error_log  warn;

	log_format main      '$remote_addr - $remote_user [$time_local]  '
	  '"$request" $status $bytes_sent '
	  '"$http_referer" "$http_user_agent" '
 		'"$gzip_ratio"';

	log_format download  '$remote_addr - $remote_user [$time_local]  '
	  '"$request" $status $bytes_sent '
	  '"$http_referer" "$http_user_agent" '
 		'"$http_range" "$sent_http_content_range"';

	map $status $loggable {
		~^[23]  0;
		default 1;
	}

	server {
		listen        127.0.0.1;
		server_name   127.0.0.1;
		root         /var/www/html;
		access_log   /var/log/nginx.access_log  main;

		location / {
			proxy_pass         http://127.0.0.1/;
			proxy_redirect     off;
			proxy_set_header   Host             $host;
			proxy_set_header   X-Real-IP        $remote_addr;
			proxy_set_header  X-Forwarded-For  $proxy_add_x_forwarded_for;
			proxy_connect_timeout      90;
			proxy_send_timeout         90;
			proxy_read_timeout         90;
			proxy_buffer_size          4k;
			proxy_buffers              4 32k;
			proxy_busy_buffers_size    64k;
			proxy_temp_file_write_size 64k;
			proxy_temp_path            /etc/nginx/proxy_temp;
		}

		location ~* .(woff|eot|ttf|svg|mp4|webm|jpg|jpeg|png|gif|ico|css|js)$ {
			expires 365d;
		}
	}
}


{{< /file-excerpt >}}

