#!/bin/sh

# php-fastcgi - Use php-fastcgi to run php applications
#
# chkconfig: - 85 15
# description: Use php-fastcgi to run php applications
# processname: php-fastcgi

if [ `grep -c "nginx" /etc/passwd` = "1" ]; then 
   OWNER=nginx
elif [ `grep -c "www-data" /etc/passwd` = "1" ]; then 
   OWNER=www-data
elif [ `grep -c "http" /etc/passwd` = "1" ]; then 
   OWNER=http
else 
# Set the OWNER variable below to the user that 
# you want to run the php-fastcgi processes as

OWNER=
fi

PATH=/sbin:/bin:/usr/sbin:/usr/bin
DAEMON=/usr/bin/php-fastcgi

NAME=php-fastcgi
DESC=php-fastcgi

test -x $DAEMON || exit 0

# Include php-fastcgi defaults if available
if [ -f /etc/default/php-fastcgi ] ; then
	. /etc/default/php-fastcgi
fi

set -e

case "$1" in
  start)
	echo -n "Starting $DESC: "
	sudo -u $OWNER $DAEMON
	echo "$NAME."
	;;
  stop)
	echo -n "Stopping $DESC: "
	killall -9 php-cgi
	echo "$NAME."
	;;
  restart)
	echo -n "Restarting $DESC: "
	killall -9 php-cgi
	sleep 1
	sudo -u $OWNER $DAEMON
	echo "$NAME."
	;;
      *)
	    N=/etc/init.d/$NAME
	    echo "Usage: $N {start|stop|restart}" >&2
	    exit 1
	    ;;
    esac
    exit 0
