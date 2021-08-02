#!/bin/bash

chroot_directory="$HOME/chroot_jail"

executable_list=("/bin/bash" "/bin/echo" "/bin/ls" "/bin/rm" "/bin/touch")

for executable in ${executable_list[@]}; do
    cp -v "$executable" "$chroot_directory/bin"

    for dependency in $(ldd "$executable" | grep -E -o "/lib.*\.[0-9]"); do
        cp -v --parents "$dependency" "$chroot_directory"
    done
done
