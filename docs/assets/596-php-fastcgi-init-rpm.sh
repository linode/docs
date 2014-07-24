#!/bin/sh
#
# php-fastcgi - Use PHP as a FastCGI process via nginx.
#
# chkconfig: - 85 15
# description: Use PHP as a FastCGI process via nginx.
# processname: php-fastcgi
# pidfile: /var/run/php-fastcgi.pid

# Source function library.
. /etc/rc.d/init.d/functions

# Source networking configuration.
. /etc/sysconfig/network

# Check that networking is up.
[ "$NETWORKING" = "no" ] && exit 0

phpfastcgi="/usr/bin/php-fastcgi"
prog=$(basename php-cgi)

lockfile=/var/lock/subsys/php-fastcgi

start() {
    [ -x $phpfastcgi ] || exit 5
    echo -n $"Starting $prog: "
    daemon $phpfastcgi
    retval=$?
    echo
    [ $retval -eq 0 ] && touch $lockfile
    return $retval
}

stop() {
    echo -n $"Stopping $prog: "
    killproc $prog
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    stop
    start
}

rh_status() {
    status $prog
}

rh_status_q() {
    rh_status >/dev/null 2>&1
}

case "$1" in
    start)
        rh_status_q && exit 0
        $1
        ;;
    stop)
        rh_status_q || exit 0
        $1
        ;;
    restart)
        $1
        ;;
    status)
        rh_status
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart}"
        exit 2
esac
