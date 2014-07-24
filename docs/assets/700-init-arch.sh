#!/bin/bash

# uwsgi - Use uwsgi to run python and wsgi web apps.
#
# description: Use uwsgi to run python and wsgi web apps.
# processname: uwsgi

daemon_name=uwsgi
bin="/usr/bin/uwsgi"

. /etc/rc.conf
. /etc/rc.d/functions
. /etc/conf.d/$daemon_name

daemon_user=http
daemon_options="-s 127.0.0.1:9001 -M 4 -t 30 -A 4 -p 4 -d /var/log/$daemon_name.log --pidfile /var/run/$daemon_name.pid --pythonpath $PYTHONPATH --module $MODULE"

get_pid() {
    if [ -f /var/run/$daemon_name.pid ]; then
        echo `cat /var/run/$daemon_name.pid`
    fi
}   

case "$1" in
  start)
        stat_busy "Starting $daemon_name daemon"

        PID=$(get_pid)
        if [ -z "$PID" ]; then
            [ -f /var/run/$daemon_name.pid ] && rm -f /var/run/$daemon_name.pid
        # RUN
        touch /var/run/$daemon_name.pid                                         
        chown $daemon_user /var/run/$daemon_name.pid

        sudo -u $daemon_user $bin $daemon_options
        if [ $? -gt 0 ]; then
            stat_fail
            exit 1
        else
            add_daemon $daemon_name
            stat_done
        fi
        else
            stat_fail
            exit 1
        fi
        ;;
  stop)
        stat_busy "Stopping $daemon_name daemon"
        PID=$(get_pid)
        # KILL
        [ ! -z "$PID" ] && kill -s 3 $PID &> /dev/null
        #
        if [ $? -gt 0 ]; then
            stat_fail
            exit 1
        else
            rm -f /var/run/$daemon_name.pid &> /dev/null
            rm_daemon $daemon_name
            stat_done
        fi
        ;;
  reload)
        stat_busy "Reloading $daemon_name daemon"
        PID=$(get_pid)
        # KILL
        [ ! -z "$PID" ] && kill -s 1 $PID &> /dev/null
        #
        if [ $? -gt 0 ]; then
            stat_fail
            exit 1
        else
            stat_done
        fi
        ;;
  force-reload)
        stat_busy "Reloading $daemon_name daemon"
        PID=$(get_pid)
        # KILL
        [ ! -z "$PID" ] && kill -s 15 $PID &> /dev/null
        #
        if [ $? -gt 0 ]; then
            stat_fail
            exit 1
        else
            stat_done
        fi
        ;;
  restart)
        $0 stop
        sleep 3
        $0 start
        ;;
      *)    
            N=/etc/rc.d/$daemon_name
            echo "sage: $N {start|stop|restart|reload|force-reload}" >&2
            exit 1
            ;;
    esac
    exit 0
