#!/bin/sh

wget=/usr/bin/wget

TARGET_DIRECTORY="/home/example-user/service-worker-example/imgs"

mkdir -p "${TARGET_DIRECTORY}"

$wget "https://tile.loc.gov/storage-services/service/pnp/jpd/02700/02798v.jpg" -O "${TARGET_DIRECTORY}/cat-1.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/pga/07100/07149v.jpg" -O "${TARGET_DIRECTORY}/cat-2.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/cph/3c00000/3c00000/3c00100/3c00170v.jpg" -O "${TARGET_DIRECTORY}/cat-3.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/ppmsca/51500/51533v.jpg" -O "${TARGET_DIRECTORY}/cat-4.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/hec/21500/21589v.jpg" -O "${TARGET_DIRECTORY}/cat-5.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/npcc/09700/09707v.jpg" -O "${TARGET_DIRECTORY}/cat-6.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/ds/04000/04037v.jpg" -O "${TARGET_DIRECTORY}/cat-7.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/cph/3b00000/3b06000/3b06200/3b06249r.jpg" -O "${TARGET_DIRECTORY}/cat-8.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/pga/05000/05046v.jpg" -O "${TARGET_DIRECTORY}/cat-9.jpg"
$wget "https://tile.loc.gov/storage-services/service/pnp/cph/3c20000/3c20000/3c20400/3c20459v.jpg" -O "${TARGET_DIRECTORY}/cat-10.jpg"
