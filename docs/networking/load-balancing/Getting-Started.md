If you have already followed the guides to setup a [LAMP stack](https://www.linode.com/docs/websites/lamp/) or any other [web service stack](https://www.linode.com/docs/websites) and now get a lot of traffic or want a more agile and [redundant server infrastructure](http://furbo.org/2015/01/22/fear-china/) for possible future events load-balancing might be a inevitable thing you will have to wrap your head around.

## Kurzgesagt: Load-Balancing
Load-Balancing is the active distribution of incoming traffic from only having one server who receives, analises and computes said traffic to having one server who receives and analises the traffic but distributes the computational, the heavy lifting, part to multiple other/backend server (also called a reverse proxy).

### How does it work
Load balancing in of itself works quite simply. Your domains DNS records points a client of your web service (of any kind e.g. website/restful API) to your load balancers public IP address. The client then attempts to connect to said the webserver. Your load balancer acts similar to a webserver, it establishes the connection with the client, looks at the request, possibly analises it and makes decisions based on it. Those decisions are mainly what backend server to pick from it's array of servers and forwards the traffic to that server. This webserver then proccesses the request and responds with whatever task it was given (e.g. a website when connecting on port 80/443).
The best thing about load balancers is that you can experiment with backend servers since load balancers don't care what kind of OS you are running or what kind of webserver, SQL server or application framework as long as they understand the request forwarded to them by the load balancer.

### Possible usecases
There are lots of different reasons, for almost every setup, why one would possibly decide to pay for another server and maintain it.

1. You might want a redundant setup. Multiple server could fail or create maintenance problems but your web service wouldn't go down with the servers. You could within minutes spawn new servers, deploy to them and put them in the server array and your users/customers would never notice any interruption in your service whilst you have time to focus on the servers that gave you a headache in the first place. You and your service could also come [under attack](http://furbo.org/2015/01/22/fear-china/). Spawning more servers is a way to mitigate these kinds of attacks since they usually don't last very long.

2. You might have a website creating enough traffic so that you would have to pay for a huge server but your budget doesn't yet allow it. With a load balancer you can sneak right between hosting tiers and into your budget sweet spot. You wouldn't have to worry about hosting bills and can focus on growing your business.

3. Load Blanacing is the very definition of [scalability and agility](https://medium.com/message/how-paper-magazines-web-engineers-scaled-kim-kardashians-back-end-sfw-6367f8d37688). You only have a couple of readers on your website today, but maybe your banging analysis of a particular cities startup culture gets featured in Wall Street Journal, New York Times, The Verge, iMore, Hackernews, Designernews and/or other big websites and all of a sudden the entire internet is holding your server hostage demanding to read this article. Your webserver will be dead within seconds. But if you use a load balancer you can spawn new servers instantly, deploy to them and add them to the server array quickly. That way your website will be back online whilst the demand for your website is still high.  

{: .note}
: ~~~
Also: Linode bills by the hour. After the huge demand of your website you can slowly remove the servers you added in the emergency from your array and wont have to worry about a hugely increased hosting bill.
~~~

4. Use your resources more efficiently! Does your web service (e.g. a basic website) contain static assets  (images/css/javascript)? Put that on a basic linode and combine it with a caching server and start saving money. You can define, with some reverse proxies, routes similar to routing in a dynamic web framework like PHP or Ruby on Rails in order to have dedicated servers for those tasks. All under the same user facing domain. This way you can scale easily and independently without worring about breaking everything else.

There are certainly though up- and downsides to load balancing, of which you should be aware before tearing down your existing infrastructure and starting from scratch or investing too much into it even though it might not be right for you.
 
### Benefits
1. Agility. Easily upgrade servers without 0 downtime.

2. Redundancy. Perform health checks on servers (maybe even forced ones due to Linode hardware repairs) with 0 downtime.

3. Scalability. Easily deal with huge traffic spikes or get into your hosting bill sweet spot without any compromises.

### Drawbacks
1. More infrastructure to maintain. There are more servers you have to monitor. You might have to change your monitoring strategy.

2. More possible vulnerabilities. If a new critical vulnerability like Heartbleed is released every single server has to be checked and upgraded.


## Tools at hand
To setup a load balanced web service we first have to choose what kind of load balancing (e.g. what load balancing algorithm) we want and which tools offer those. In this series of guides we will take a look at 3 load balancer, what kind of advantages they offer and what kind of disadvantages.

### Nginx 
Nginx started it's life as a reverse proxy and then later became the popular web server we now know and love. Basic load balancing can be easily achieved with it, though not all features are available to the community edition, some are only available to Nginx Plus.

Nginx currently supports 6 protcols

* HTTP
* HTTPS
* FastCGI
* uwsgi
* SCGI
* memcached

and four load balancing algorithms

* round-robin -> picks the first backend server for the first request and then cycles through the server array.

* least-connected -> picks the backend server with the least active connections.

* least-time -> Will pick the server with the lowest average latency and the least active connections.

* ip-hash -> picks the backend server based on a hash of the clients IP address.

Nginx is a very robust and capable load balancer if you mainly want to balance HTTP traffic of any kind. (This is understandable due to it not being a dedicated reverse proxy anymore) If you are already familiar with Nginx everything about setting it up as reverse proxy will feel like home.



### LVS/ipvsadm 
LVS stands for Linux Virtual Server and is part of the Linux kernel as of version 2.6.28-rc3 (November 2nd 2008). It's a very capable load balancer and will probably meet your needs. ipvsadm is the command line tool with which LVS is configured and monitored. Both are great and very mature.

LVS basically supports any protocol that runs on TCP/UDP ports. The only downside that comes with this flexibity is that there is no way of defining routes to specific servers/content. The only feature you get is load balancing  multiple backend servers. LVS is therefore the most basic of the three balancers shown here but should not be underestimated.

LVS supports a big amount of balancing algorithsms. These are the most important ones it offers:

* round-robin (rr) -> picks the first backend server for the first request and then cycles through the server array.

* weighted round-robin (wrr) -> same as round robin but weights can be assigned to the backend servers to make them more important over others. If more connections are incoming than the weight of the most important server the others are picked in a round robin fashion.

* least-connected (lc) -> picks the server with the least connections out of the array.

* weighted least-connected (wlc) -> same as least-connections but also considers the servers weights.

* shorted expected delay (sed) -> picks the server out of the array with the fasted expected response time.

* never queue (nq) -> picks the first server in the array that is idling.
If no idle server is available it applies the shortest expected delay algorithm.

LVS offers many many more options to configure. If you want to take a quick look at all of them check out the [ipvsadm man page](http://linux.die.net/man/8/ipvsadm). They are defined with `-s or --scheduler`.


### HAProxy
HAProxy is a very complex load balancer with lots of possible configuration options. This is like the spaceshuttle of the load balancers but don't worry you don't have to be a rocket scientist to set it up, if you want to go crazy with the configuration though this load balancer will happily expose all it's glory to you. (If you want full control over everything, this is what you want)

HAProxy will accept any TCP port connections and connects your user with your specified backend server. If you only want to balance HTTP traffic you can set it in HTTP mode. Even though you would expect it from this feature rich load balancer HAProxy will not be able to help you load balance anything coming over IP packets (that is not TCP) or UDP based protocls.

HAProxy features, similar like LVS, an impressive list of load-balancing algorithms:

* round-robin -> picks the first backend server for the first request and then cycles through the server array.

* static-rr -> exactly as round robin but checks on the backend servers weights first

* least-connected -> picks the server with the least connections out of the array.

* header -> checks the HTTP header field and check against defined routes.
Good for checking against for example static content (images/css/javascript) or for specific versions of a JSON API (https:// www.domain.com/api/v2/login).

* first -> the very first backend server in the array that is available will be picked.



## Where to go from here

After now reading this little intro into load-balancing your web service you should probably be able to pick a load balancer that suits your needs and read it's dedicated guide.

* Load balancing with Nginx

* Load balancing with LVS & ipvsadm

* Load balancing with HAProxy


### Advanced

* Securing your load balancing stack

* Create a similar secure stack to Google/Facebook/Twitter
 
 ## More information
 
There are great other alternatives to Nginx, LVS and HAProxy but this selection solves the same problem in interesting different ways. They are all designed to handle different tasks better than the others and optimized in different ways. Therefore the selection gives a great overview over available load balancer solutions. If these do not solve your problems you can start here and learn a little about load balancers or ask your favorite search enginge for other alternatives.

* [Nginx website](https://www.nginx.com)

* [LVS website](http://www.linuxvirtualserver.org)

* [HAProxy website](http://www.haproxy.org)