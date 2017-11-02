#!/bin/sh
#
# Confluence start/stop script.
#
# chkconfig: - 85 15
# description: Confluence is a wiki system.

# Source function library.
. /etc/rc.d/init.d/functions

case "$1" in
    start)
        su - confluence -c /usr/local/confluence/confluence-3.3.1-std/bin/startup.sh
        retval=$?
        ;;

    stop)
        su - confluence -c /usr/local/confluence/confluence-3.3.1-std/bin/shutdown.sh
        retval=$?
        ;;

    restart)
        su - confluence -c /usr/local/confluence/confluence-3.3.1-std/bin/shutdown.sh
        su - confluence -c /usr/local/confluence/confluence-3.3.1-std/bin/startup.sh
        ;;

esac
exit $retval
