#!/usr/bin/env bash

# Dump a backup of the database
sudo -i -u postgres bash <<EOF
pg_dump -Fc mayan > /tmp/mayan-data.dump
EOF
echo "Mayan database dumped."

# Copy the backup to the object storage instance
rclone copyto /tmp/mayan-data.dump linodes3:cbdms-object-storage/backups/mayan-data-$(date +%Y%m%d-%H%M%S).dump
echo "Database dump uploaded to object storage."
rm /tmp/mayan-data.dump
echo "Temporary dump file removed."
