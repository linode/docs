#!/bin/sh

### BEGIN INIT INFO
# Provides:          mongodb
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts mongodb database system 
# Description:       starts mongodb using basic start scripts
### END INIT INFO

PATH=/opt/mongodb/bin:/sbin:/bin:/usr/sbin:/usr/bin
NAME=mongodb

test -x $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting $DESC: "

        start-stop-daemon --start --user mongodb -c mongodb:mongodb \
            --startas /opt/bin/mongodb-start

        echo "$NAME."
        ;;
  stop)
        echo -n "Stopping $DESC: "

        start-stop-daemon --stop --exec /opt/mongodb/bin/mongod -c mongodb:mongodb \
            /opt/bin/mongodb-stop
        
        echo "$NAME."
        ;;
      *)
            N=/etc/init.d/$NAME
            echo "Usage: $N {start|stop}" >&2
            exit 1
            ;;
    esac

    exit 0
