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
    killproc $prog -Q
    retval=$?
    echo
    [ $retval -eq 0 ] && rm -f $lockfile
    return $retval
}

restart() {
    configtest || return $?
    stop
    start
}

reload() {
    configtest || return $?
    echo -n $"Reloading $prog: "
    killproc $prog -HUP
    RETVAL=$?
    echo
}

force_reload() {
    restart
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
    restart|configtest)
        $1
        ;;
    reload)
        rh_status_q || exit 7
        $1
        ;;
    force-reload)
        force_reload
        ;;
    status)
        rh_status
        ;;
    condrestart|try-restart)
        rh_status_q || exit 0
        ;;
    *)
        echo $"Usage: $0 {start|stop|status|restart}"
        exit 2
esac
