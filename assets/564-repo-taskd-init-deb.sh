#! /bin/sh

### BEGIN INIT INFO
# Provides:          repod-taskd
# Required-Start:    $all
# Required-Stop:     $all
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts girocco daemon taskd
# Description:       starts girocco taskd daemon using start-stop-daemon
### END INIT INFO

PATH=/sbin:/bin:/usr/sbin:/usr/bin:/srv/repo/bin
NAME=repo-taskd
DAEMON=/srv/repo/bin/taskd/taskd.pl
DAEMONDIR=/srv/repo/bin/taskd
DESC=repo-taskd
PIDFILE=/srv/repo/taskd.pid
test -x $DAEMON || exit 0

set -e

case "$1" in
  start)
        echo -n "Starting $DESC: "
        start-stop-daemon --start --quiet --make-pidfile --pidfile $PIDFILE --background \
                 -c repo:repo --chdir $DAEMONDIR --exec $DAEMON
        echo "$NAME."
        ;;
  stop) 
        echo -n "Stopping $DESC: "
        start-stop-daemon --stop --quiet --pidfile $PIDFILE &&
        rm $PIDFILE;
        echo "$NAME."
        ;;
  restart)
        echo -n "Restarting $DESC: "
        start-stop-daemon --stop --quiet --pidfile $PIDFILE &&
        rm $PIDFILE;
        sleep 2
        start-stop-daemon --start --quiet --make-pidfile --pidfile $PIDFILE --background \
                -c repo:repo --chdir $DAEMONDIR --exec $DAEMON
        echo "$NAME."
        ;;
      *)    
            N=/etc/init.d/$NAME
            echo "Usage: $N {start|stop|restart}" >&2
            exit 1
            ;;
    esac
    
    exit 0
