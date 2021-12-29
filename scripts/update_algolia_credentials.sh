#!/bin/bash

sedi () {
    sed --version >/dev/null 2>&1 && sed -i -- "$@" || sed -i "" "$@"
}

sedi "s/app_id = \".*\"/app_id = \"$ALGOLIA_APP_ID\"/g" '../config.toml'
sedi "s/api_key = \".*\"/app_id = \"$ALGOLIA_SEARCH_API_KEY\"/g" '../config.toml'