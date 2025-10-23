#!/bin/bash

### BEGIN INIT INFO
# Provides:          confluence
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the confluence wiki system
# Description:       starts the confluence wiki system
### END INIT INFO

CONFLUENCE_START="/usr/local/confluence/confluence-3.3.1-std/bin/startup.sh"
CONFLUENCE_STOP="/usr/local/confluence/confluence-3.3.1-std/bin/shutdown.sh"
CONFLUENCE_USER="confluence"
RETVAL=0

case "$1" in
    start)
        su - $CONFLUENCE_USER -c $CONFLUENCE_START
        RETVAL=$?
        ;;
    stop)
        su - $CONFLUENCE_USER -c $CONFLUENCE_STOP
        RETVAL=$?
        ;;
    restart)
        su - $CONFLUENCE_USER -c $CONFLUENCE_STOP
        su - $CONFLUENCE_USER -c $CONFLUENCE_START
        RETVAL=$?
        ;;
    *)
        echo "Usage: confluence {start|stop|restart}"
        exit 1
        ;;
esac
exit $RETVAL
