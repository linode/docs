#!/bin/bash

# Usage:
#    ./generate_permanent_redirects_for_nginx.sh
#
# Or, optionally:
#    BASE_URL=<base URL of site> ./generate_permanent_redirects_for_nginx.sh
#
# BASE_URL is set to '{{ base_url }}' by default in the script, but you can
# override this value by setting it as an environment variable. The value of
# '{{ base_url }}' is used so that it can be updated by Salt pillar on the
# web boxes. If you are running this script to create a new redirects.conf
# on the web boxes, then use this default value.
#
# This script iterates through the public/ folder and searches for any pages
# created from Hugo's `aliases` frontmatter. It generates an NGINX permanent
# rewrite rule that will serve a 301 redirect for requests on the page.
# Without this rule, the page would serve a browser-based redirect.
#
# These rewrite rules are appended to a redirects.conf file that is placed
# in the root of the docs repo. You will then need to copy this file to the
# NGINX server that will serve the website.

set -eo pipefail

[[ -z "$BASE_URL" ]] && { BASE_URL='{{ base_url }}'; }

> ../redirects.conf

egrep -R '<title>(https:\/\/.*\/)<\/title>' ../public | while read -r line ; do
    # Gets the path (relative to the base URL) that the redirect should point to
    # Example: /guides/how-to-install-mariadb-on-centos-7/
    redirect_target_path="/$(echo $line | egrep -o '<title>https:\/\/.*\/<\/title>' | cut -c 36- | rev | cut -c 9- | rev)"
    # Gets the path that the redirect is done from
    # Example: /docs/databases/mariadb/how-to-install-mariadb-on-centos-7/
    redirect_from_path="/docs$(echo $line | cut -d ':' -f 1 | cut -c 10- | rev | cut -c 11- | rev)"

    echo "rewrite ^$redirect_from_path?$ $BASE_URL$redirect_target_path permanent;" >> ../redirects.conf
done