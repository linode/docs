#!/bin/bash

what=$1
done=false
file="go.mod"

 function trimGoMod {
     sed -i '' -e '$ d' $file;
 }

if test "$#" -ge 2; then
    done=true
fi

if [[ $what == "theme" ]]; then
    line='replace github.com/bep/linodedocs => ../linodedocs'
    if $done; then
        trimGoMod
    else
        echo $line >> $file
        hugo server --ignoreVendorPaths "github.com/bep/**"
    fi
fi

