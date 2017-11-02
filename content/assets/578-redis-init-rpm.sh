#!/bin/sh
#
# redis this script starts and stops the mongodb daemon
#
# chkconfig: - 85 15
# description: redis is a non-relational database storage system. 
# processname: redis
# config: /opt/redis/redis.conf
# binary: /opt/redis/redis-server

PATH=/opt/redis:/sbin:/bin:/usr/sbin:/usr/bin
NAME=redis

test -x $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting Redis... "
        su - redis -c "/opt/redis/redis-server /opt/redis/redis.conf"
        ;;
  stop)
        echo -n "Stopping Redis"
        killall /opt/redis/redis-server
        ;;
      *)
            N=/etc/init.d/$NAME
            echo "Usage: $N {start|stop}" >&2
            exit 1
            ;;
    esac

    exit 0
