#!/bin/bash

### BEGIN INIT INFO                                                                                                                     
# Provides:          php-fastcgi                                                                                                        
# Required-Start:    $remote_fs $syslog                                                                                                 
# Required-Stop:     $remote_fs $syslog                                                                                                 
# Default-Start:     2 3 4 5                                                                                                            
# Default-Stop:      0 1 6                                                                                                              
# Short-Description: Start daemon at boot time                                                                                          
# Description:       Enable service provided by daemon.                                                                                 
### END INIT INFO                                                                                                                       



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

PHP_SCRIPT=/usr/bin/php-fastcgi
RETVAL=0
case "$1" in
    start)
      sudo -u $FASTCGI_USER $PHP_SCRIPT
      RETVAL=$?
  ;;
    stop)
      killall -9 php5-cgi
      RETVAL=$?
  ;;
    restart)
      killall -9 php5-cgi
      sudo -u $FASTCGI_USER $PHP_SCRIPT
      RETVAL=$?
  ;;
    *)
      echo "Usage: php-fastcgi {start|stop|restart}"
      exit 1
  ;;
esac      
exit $RETVAL
