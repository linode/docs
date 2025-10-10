#!/bin/bash

pid=`ps -o pid,command ax | grep mongod | awk '!/awk/ && !/grep/ {print $1}'`;
if [ "${pid}" != "" ]; then
    kill -2 ${pid};
fi
