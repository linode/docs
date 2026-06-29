#!/bin/sh

if [ `grep -c "nginx" /etc/passwd` = "1" ]; then 
   FASTCGI_USER=nginx
elif [ `grep -c "www-data" /etc/passwd` = "1" ]; then 
   FASTCGI_USER=www-data
elif [ `grep -c "http" /etc/passwd` = "1" ]; then 
   FASTCGI_USER=http
else 
# Set the FASTCGI_USER variable below to the user that 
# you want to run the php-fastcgi processes as

FASTCGI_USER=
fi

/usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -C 6 -u $FASTCGI_USER -f /usr/bin/php5-cgi
