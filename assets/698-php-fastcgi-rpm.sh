#!/bin/sh
/usr/bin/spawn-fcgi -a 127.0.0.1 -p 9000 -C 6 -u nginx -g nginx -f /usr/bin/php-cgi