#!/bin/bash

MYPATH=$1

find "$MYPATH" -name *.jpg -exec basename {} \; > /tmp/patterns
find "$MYPATH" -name *.png -exec basename {} \; >> /tmp/patterns
find "$MYPATH" -name *.gif -exec basename {} \; >> /tmp/patterns

for p in $(cat /tmp/patterns); do
    grep -R $p "$MYPATH" > /dev/null || echo $p;
done
