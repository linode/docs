#Nginx Tuning and Performance

Nginx powers over 40% of the busiest websites in the world.  It is well known for its use in both high performance load balancing and caching static and dynamic web content.  Today we are going to talk about some of the best "bang for your buck" performance optimizations that one can make to an NGINX server in order to speed up delivery of content to your end users.

## Worker Modifications
The easiest thing to set in your configuration is the right number of workers and connections. 

#### Worker Processes
You want to set <code>worker_processes 1;</code> if you have a lower traffic site where nginx, a database, and a web application all run on the same server.

If you have a higher traffic site or a dedicated instance for nginx, you want to set to one worker per CPU core like so: <code>worker_processes auto;</code>

If you'd like to set this manually, you can utilize 
<code>grep ^processor /proc/cpuinfo | wc -l</code>
To find the number of processes that your computer can handle.

#### Worker Connections
The worker connections option
<code> worker_connections</code> 
sets the maximum number of connections that can be processed at one time by each worker process. By default, the worker connection limit is 512, but many systems can handle more.  The appropriate sizing can be discovered through testing; as it is variable based on the type of traffic NGINX is handling.  We can also find out the server's core limitations with ulimit:
<pre>
	<code>➜  ~  ulimit -n
	65536</code>
</pre>

We can also <code>use epoll</code>, a scalable I/O event notification mechanism to trigger on events and make sure that we utilize I/O to the best of our ability.

Lastly, we can utilize the <code>multi_accept</code> in order for a worker to accept all new connections at one time.

Our events function should look something like this if we set it up properly:

<pre>
	<code>events {
		    worker_connections 66536;
		    use epoll;
		    multi_accept on;
	}</code>
</pre>

## HTTP and TCP Optimizations

#### Keep Alive
Keep alive allows us to incur fewer reconnections from the browser This is controlled by the <code>keepalive_timeout</code> and <code>keepalive_requests</code> setting. 
<code>sendfile</code> optimizes serving static files from the file system, like your logo.
<code>tcp_nodelay</code> allows NGINX make TCP send these multiple buffers as individual packets
<code>tcp_nopush</code> optimizes the amount of data sent down the wire at once by activating the TCP_CORK option within the TCP stack.  TCP_CORK blocks the data until the packet reaches the MSS, which equals to the MTU minus the 40 or 60 bytes of the IP header.

<pre>
	<code>keepalive_timeout 65;
	keepalive_requests 100000;
	sendfile on;
	tcp_nopush on;
	tcp_nodelay on;</code>
</pre>

#### Buffer Size
Making tweaks to the buffer size can be advantageous. If the buffer sizes are too low, then Nginx will write to a temporary file.  This will cause for excessive disk I/O.

<code>client_body_buffer_size</code> handles the client buffer size.  Most client buffers are coming from POST method form submissions. 128k is normally a good choice for this setting.

<code>client_max_body_size</code> Sets the max body buffer size. If the size in a request exceeds the configured value, the 413 (Request Entity Too Large) error is returned to the client. For reference, browsers cannot correctly display 413 errors properly. Setting size to 0 disables checking of client request body size. 

<code>client_header_buffer_size</code> handles the client header size. 1k is usally a sane choice for this by default

<code>large_client_header_buffers</code> shows the maximum number and size of buffers for large client headers. 4 headers with 4k buffers should be sufficient here.

<code>output_buffers</code> sets the number and size of the buffers used for reading a response from a disk.  If possible, the transmission of client data will be postponed until nginx has at least size bytes of data to send. The zero value disables postponing data transmission.





<pre>
	<code>client_body_buffer_size    128k;
	client_max_body_size       10m;
	client_header_buffer_size    1k;
	large_client_header_buffers  4 4k;
	output_buffers   1 32k;
    postpone_output  1460;</code>
</pre>

#### Connection Queue
We can change some directives in the in the <code>/etc/sysctl.conf</code> file in order to set the size of a linux queue for connections and buckets.   updating the <code>net.core.somaxconn</code> and <code>net.ipv4.tcp_max_tw_buckets</code> changes the size of the queue for connections waiting for acceptance by NGINX.  If there are error messages in the kernel log, increase the value until errors stop.
<pre>
	<code>net.core.somaxconn = 65536
	net.ipv4.tcp_max_tw_buckets = 1440000</code>
</pre>

Packets can be buffered in the network card before being handed to the CPU by setting the max backlog with the net.core.netdev_max_backlog tag
<code>net.core.netdev_max_backlog = 65536</code>
Consult the network card documentation for advice on changing this value.

#### Timeouts
Timeouts can also drastically improve performance.

<code>client_body_timeout</code> sends directives for the time a server will wait for a **body** to be sent
<code>client_header_timeout</code> sends directives for the time a server will wait for a **header** body to be sent directives are responsible for the time a server will wait for a client body or client header to be sent after request. If neither a body or header is sent, the server will issue a 408 error or Request time out.
<code>sent_timeout</code>Specifies the response timeout to the client. This timeout does not apply to the entire transfer but, rather, only between two subsequent client-read operations. Thus, if the client has not read any data for this amount of time, then nginx shuts down the connection.

<pre>
	<code>client_header_timeout  3m;
	client_body_timeout    3m;
	send_timeout           3m;</code>
</pre>

#### Static Asset Serving
If your site serves static assets (think CSS/JS/Static Images) - NGINX can cache these files for a short period of time.  Adding this within your configuration block tells nginx to cache 1000 files for 30 seconds, excluding any files that haven't been accessed in 20 seconds, and only files that have 5 times or more. If you aren't deploying frequently you can safely bump up these numbers higher.

<pre>
	<code>open_file_cache max=1000 inactive=20s;
	open_file_cache_valid 30s;
	open_file_cache_min_uses 5;
	open_file_cache_errors off;</code>
</pre>

You can also cache via a particular location if you'd like as well.  Caching files for a long time is smart, especially if the files have a versioning control system delivered by the build process or CMS.
<pre>
	<code>location ~* .(woff|eot|ttf|svg|mp4|webm|jpg|jpeg|png|gif|ico|css|js)$ {
			expires 365d;
	}</code>
</pre>

#### Gzipping Content

For content that is plain text; NGINX can use GZIP compression to serve back these assets compressed to the client.  Modern web browsers will accept GZIP compression - this will shave bytes off of each request that comes in for plain text assets. The list below is a "safe" list of compressible content types; however, you probably only want to enable the content types that you are utilizing within your web application.

<pre>
	<code>gzip on;
	gzip_min_length 1000;
	gzip_types: text/html application/x-javascript text/css application/javascript text/javascript text/plain text/xml application/json application/vnd.ms-fontobject application/x-font-opentype application/x-font-truetype application/x-font-ttf application/xml font/eot font/opentype font/otf image/svg+xml image/vnd.microsoft.icon;
	gzip_disable "MSIE [1-6]\.";</code>
</pre>

## Filesystem Optimizations
These filesystem operations get Improve system memory management, and can be added in <code>/etc/sysctl.conf</code>

####Ephemeral Ports

When NGINX is acting as a proxy, each connection to an upstream server uses a temporary, or ephemeral port.

The IPv4 local port range defines a port range value.  A common setting is 
<code>net.ipv4.ip_local_port_range 1024 65000</code>

The TCP FIN timeout belays the amount of time a port must be inactive before it can reused for another connection. The default is often 60 seconds, but can normally be safely reduced to 30 or even 15 seconds.

<code>net.ipv4.tcp_fin_timeout 15</code> 

#### Scale TCP Window 

The TCP window scale option is an option to increase the receive window size allowed in Transmission Control Protocol above its former maximum value of 65,535 bytes. This TCP option, along with several others, is defined in IETF RFC 1323 which deals with long fat networks.  It can be defined with the <code>net.ipv4.tcp_window_scaling = 1</code> tag.

#### Backlog Packets Before Drop.
The <code>net.ipv4.tcp_max_syn_backlog</code> determines a number of packets to keep in backlog before the kernel starts dropping them.  A sane value is
<code>net.ipv4.tcp_max_syn_backlog = 3240000</code>

#### Close connecetion on Missing Client Response
<code>reset_timedout_connection on;</code> allows the server to close the connection after a client stops responding. This therein frees up socket-associated memory.

#### File Descriptors
File descriptors are operating system resources used to handle things such as connections and open files.  NGINX can use up to two file descriptors per connection. For example, if it is proxying, there is generally one file descriptor for the client connection and another for the connection to the proxied server, though this ratio is much lower if HTTP keepalives are used. For a system serving a large number of connections, these settings may need to be adjusted:

<code>sys.fs.file_max</code> defines the system wide limit for file descriptors.
<code>nofile</code> defines the user file descriptor limit, set in the <code>/etc/security/limits.conf</code> file.
<pre>
	<code>soft nofile 4096
	hard nofile 4096</code>
</pre>
#### Error Logs
<code>error_log logs/error.log warn;</code> Defines the location and the different severity levels written to the error log. Setting a certain log level will cause all messages of the specified and more severe log levels to be logged. For example, the default level error will cause error, crit, alert, and emerg messages to be logged. If this parameter is omitted then error is used by default.

* emerg - Emergency situations where the system is in an unusable state.
* alert - Severe situation where action is needed promptly.
* crit - Important problems that need to be addressed.
* error - An Error has occurred. Something was unsuccessful.
* warn - Something out of the ordinary happened, but not a cause for concern.
* notice - Something normal, but worth noting has happened.
* info - An informational message that might be nice to know.
* debug - Debugging information that can be useful to pinpoint where a problem is occurring.

Access logs use the log_format directive to configure a format of logged messages, as well as the access_log directive to specify the location of the log and the format.

<pre>
	<code>http {
		log_format compression '$remote_addr - $remote_user [$time_local] '
		'"$request" $status $body_bytes_sent '
		'"$http_referer" "$http_user_agent" "$gzip_ratio"';
		    server {
		        gzip on;
		        access_log /spool/logs/nginx-access.log compression;
		    }
	}</code>
</pre>

#### Conditional Logging
Conditional Logging can be completed if the system administrator only wants to log certain requests.  The example below excludes logging for both 2XX and 3XX HTTP status codes:

<pre>
	<code>map $status $loggable {
		~^[23]  0;
		default 1;
	}</code>
</pre>

#### Activity Monitoring
One can also set up a Activity Monitoring to see JSON responses for real-time activity monitoring.  With the following configuration, the webpage status.html located at /usr/share/nginx/html can be requested by the URL http://127.0.0.1/status.html.

## Systemwide Updates:

#### /etc/sysctl.conf
<pre>
	<code>net.core.somaxconn = 65536
	net.ipv4.tcp_max_tw_buckets = 1440000
	net.ipv4.ip_local_port_range 1024 65000
	net.ipv4.tcp_fin_timeout 15
	net.ipv4.tcp_window_scaling = 1	
	net.ipv4.tcp_max_syn_backlog = 3240000
	</code>
</pre>

#### /etc/security/limits.conf
<pre>
	<code>soft nofile 4096
    hard nofile 4096</code>
</pre>

## Summing it up in one nginx.conf file:
<pre>
<code>pid /var/run/nginx.pid;
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
}</code>
</pre>
