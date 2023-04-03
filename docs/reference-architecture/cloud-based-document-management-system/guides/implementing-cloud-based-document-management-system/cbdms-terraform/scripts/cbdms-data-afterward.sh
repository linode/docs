#!/usr/bin/env bash

# Create a Bucardo database
sudo -i -u postgres bash <<EOF
psql -c "create database bucardo with owner = bucardo;"
EOF

# Provide the Bucardo configuration file
cat > ~/.bucardorc <<EOF
dbhost=10.8.0.3
dbname=bucardo
dbport=5432
dbuser=bucardo
EOF

# Clone the database contents from 10.8.0.3 to 10.8.0.4 after the Mayan deployment
pg_dump -U bucardo -h 10.8.0.3 -d mayan | psql -U bucardo -h 10.8.0.4 -d mayan

# Install Bucardo
apt install -yq bucardo

# Run the Bucardo setup steps
bucardo install --batch
bucardo add db mayandb1 dbhost="10.8.0.3" dbport="5432" dbname="mayan" dbuser="bucardo"
bucardo add db mayandb2 dbhost="10.8.0.4" dbport="5432" dbname="mayan" dbuser="bucardo"
bucardo add all tables db=mayandb1 --relgroup=mayanrelgroup
bucardo add dbgroup mayandbgroup mayandb1:source mayandb2:source
bucardo add sync mayandbsync dbs=mayandbgroup conflict_strategy=bucardo_latest relgroup=mayanrelgroup

# Start Bucardo
bucardo restart
