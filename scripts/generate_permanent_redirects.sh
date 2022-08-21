#!/bin/bash

# Usage:
#    OBJ_ACCESS_KEY=<an OBJ access key> OBJ_SECRET_KEY=<an OBJ secret key> DEPLOY_SUFFIX=-suffix-for-obj-bucket-name ./generate_permanent_redirects.sh
#
# This script iterates through the public/ folder and searches for any pages
# created from Hugo's `aliases` frontmatter. It then applies the
# `x-amz-website-redirect-location` S3 header to that page in object storage.
# This header will serve a 301 redirect for requests on the page. Without this
# header, the page would serve a browser-based redirect.
#
# The script assumes that you have already synced the public/ folder to the
# object storage bucket.
#
# The name of the object storage bucket will be of the form
# `linodedocs$DEPLOY_SUFFIX`, where `DEPLOY_SUFFIX` is passed as an environment
# variable. For example, setting `DEPLOY_SUFFIX=-latestrelease` will deploy to
# our production Object Storage bucket, which is `linodedocs-latestrelease`, in
# the us-east cluster.

set -euo pipefail

[[ -z "${OBJ_ACCESS_KEY}" ]] && { echo "Please specify OBJ_ACCESS_KEY env variable"; exit 1; }
[[ -z "${OBJ_SECRET_KEY}" ]] && { echo "Please specify OBJ_SECRET_KEY env variable"; exit 1; }
[[ -z "${DEPLOY_SUFFIX}" ]] && { echo "Please specify DEPLOY_SUFFIX env variable"; exit 1; }

egrep -R '<!DOCTYPE html><html><head><title>(https:\/\/.*\/)<\/title><link rel="canonical" href="(https:\/\/.*\/)"\/><meta name="robots" content="noindex"><meta charset="utf-8" \/><meta http-equiv="refresh" content="0; url=(https:\/\/.*\/)" \/><\/head><\/html>' ../public | while read -r line ; do
    # Gets just the relative path that the redirect should point to
    # Example: /docs/databases/mariadb/how-to-install-mariadb-on-centos-7/
    redirect_target_path="$(echo $line | egrep -o '<title>https:\/\/.*\/<\/title>' | cut -c 30- | rev | cut -c 9- | rev)"
    # Gets the file that the redirect is done from
    # Example: /guides/how-to-install-mariadb-on-centos-7/index.html
    redirect_from_path="$(echo $line | cut -d ':' -f 1 | cut -c 10-)"

    echo "Redirecting /docs$redirect_from_path to $redirect_target_path"
    s3cmd --config=$(pwd)/.s3cfg --access_key=$OBJ_ACCESS_KEY --secret_key=$OBJ_SECRET_KEY put --no-mime-magic --acl-public --no-preserve --add-header=x-amz-website-redirect-location:$redirect_target_path ../public$redirect_from_path s3://linodedocs$DEPLOY_SUFFIX/docs$redirect_from_path
done