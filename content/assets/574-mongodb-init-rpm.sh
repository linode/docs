#! /bin/sh
#
# mongodb – this script starts and stops the mongodb daemon
#
# chkconfig: - 85 15
# description: MongoDB is a non-relational database storage system. 
# processname: mongodb
# config: /opt/config/mongodb
# pidfile: /opt/mongodb/mongo.pid

PATH=/opt/mongodb/bin:/sbin:/bin:/usr/sbin:/usr/bin
NAME=mongodb

test -x $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting MongoDB... "
        su - mongodb -c "/opt/bin/mongodb-start"
        ;;
  stop)
        echo -n "Stopping MongoDB"
        /opt/bin/mongodb-stop
        ;;
      *)
            N=/etc/init.d/$NAME
            echo "Usage: $N {start|stop}" >&2
            exit 1
            ;;
    esac

    exit 0
