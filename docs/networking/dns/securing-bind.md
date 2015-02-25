---
author:
  name: 
  email: 
description: ''
keywords: ''
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
modified: Monday, January 26, 2015
modified_by:
  name:
published: ''
title: Securing your DNS server from DDoS
---

##Introduction

Running a DNS server these days with prevailing DDoS attacks is a real challenge. A simple DNS amplification attack can hinder the entire infrastructure of both the target and the attacking chain participants.

In this article, we will see how to secure your BIND DNS server against a DDoS attack. Please note that this topic assumes that you are a part of the DNS attack and not the ultimate target.

Firstly, lets discuss about the much hyped term- Recursion in a DNS server.

##Recursion - What is it ?


When you have recursion enabled and if an external host queries your DNS regarding the records of a zone, for example '*domain.com*', your DNS server is obliged to reply to the query with an answer. If your DNS server does not have these records in its zone files or even in its cache, it would query other server's on behalf of the host which made the request until an answer is obtained.

By default, your DNS server would be called as an open resolver, which means it would accept recursive queries from all external locations. 

##Risk in enabling recursion !

Leaving your DNS as an Open resolver can be be very risky, as basically anyone can attack your service by sending random domain queries to your DNS and can cause your server to become extremely busy and clog up the services. We refer to this sort of attacks as DDoS attacks.

Another case can be when you become a part in a wider DDoS amplification attack where the queries would be to
a specific domain with the aim of attacking it. Your DNS server might be 1 in thousands of machines which queries the DNS servers around the globe checking for the records of a single and targeted domain. This sort of amplification attacks becomes a headache because the client machine which is attacking your DNS server can send a very small query and receive a very big result. Attackers can use this to "amplify" their available bandwidth by spoofing the sender address in the request. This way, they can repeatedly send small requests to DNS servers, which then return very large responses to the victim's server (since the DNS client address has been spoofed).

In both these cases, when you are attacked or when you are a part of an attacking chain, your infrastructure gets affected and your valid queries and services gets affected to a greater extent.

So, how to stop this ? As the basic step, you might consider about disabling recursion.

You can do this by editing the BIND configuration file at 
**/etc/named.conf** and change the line

*recursion yes;*

to

*recursion no;*

However, what would this mean to a DNS server which is acting as a recursive or caching NS for an organization, which has to reply to all the queries directed at it ? It is not feasible to disable recursion for such a DNS server. 

We can use another feature of BIND, that is to restrict recursion to some client IP's.
Instead of specifying recursion as no, you can configure recursion as follows :

*allow-recursion {192.168.2.0/24;};*

The above syntax when given in **/etc/named.conf** will mean that the IP range 192.168.2.0/24 can only perform recursive queries and rest of the IP's looking for a recursive query/response will get dropped.

Next, what if you have a large specified range of trusted IP's and they send too many recursive requests to your DNS server ? What can be the solution here ?

##Solution :

In the newer versions of BIND, from BIND 9.9.x, you have a feature called RRL ( Response Rate Limiting ) which helps to mitigate DNS denial-of-service attacks by reducing the rate at which authoritative servers respond to high volumes of malicious queries. Since the version of BIND which comes along with CentOS 6.x is 9.8, you do not have the option of setting up RRL.

However, you can avail few of the iptables rules to prevent the rate of packets hitting your server. The droplets from digitalocean comes with the kernel module '*xt_recent*' which makes it possible to configure iptables to limit the number of packets which your DNS server would have to respond to.


> Note : It is recommend only to implement these when you feel your recursive NS is hit with lots of queries.

###Step 1 - lets create a new iptables chain and call it as 'DNSquery'


    iptables -N DNSquery
 


### Step 2 - lets move all the packets received at port 53 to the new chain, which we just created.

`iptables -A INPUT -p udp --dport 53 -j DNSquery` 

### Step 3 -  create a new db and call it as DNSPK which would capture and store the packets being received at the chain DNSquery

    iptables -A DNSquery -m recent --set --name DNSPK --rsource 

### Step 4- With the help of recent module, we will rate limit the number of packets with a desired time frame.

    iptables -A DNSquery -m recent --update --seconds 5 --hitcount 15 --name DNSPK --rsource -j DROP

The above rule implies to drop every packets after the 15th one in a time-frame of 5 seconds. You can edit
the number after **seconds** paramter to change the time-frame or the number after **hitcount** paramter to change the number of packets to be allowed before dropping.

Save iptables and restart the service

    /etc/init.d/iptables save
    /etc/init.d/iptables restart

Using the above iptables rules can be a big relief when your DNS server is under a DDoS attack.

You can monitor your network activity in real time using any tools such as tcpdump. The following command will analyze your incoming and outgoing data-packets for 30s and log the details to a file at **/var/log/traffic.log**

    /usr/sbin/tcpdump -n > /var/log/traffic.log & sleep 30s && pkill -HUP -f /usr/sbin/tcpdump


##Conclusion :

We have just now seen how to use iptables to successfully mitigate DDoS attacks against a DNS server. Basically they capture the packets being received at the port 53 and rate limit it. You can use these rules to rate-limit the packets received for other services as well.

You just have to edit the port in the iptables rule given in step 2. For example, if you wish to rate-limit the packets being received at the port 80, change the rule at step 2 to :

`iptables -A INPUT -p udp --dport 80 -j DNSquery` 


Availing the default firewall iptables can be a great relief when your server is getting lots of unwanted traffic, be it to any services !






​
