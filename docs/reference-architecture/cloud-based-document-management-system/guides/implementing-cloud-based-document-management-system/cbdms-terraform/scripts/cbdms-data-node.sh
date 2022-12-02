#!/usr/bin/env bash
# $1: Current data node number
# $2: Linode Object Storage access key
# $3: Linode Object Storage secret key
# $4: Linode Object Storage region

# Install Postgres
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt update
apt -yq install postgresql postgresql-plperl-15

# Configure Postgres for Mayan
sudo -i -u postgres bash <<EOF
psql -c "create user mayanuser with password 'mayandbpass';"
psql -c "create database mayan with owner = mayanuser;"
EOF

# Configure Postgres for access
PG_CONF_LOCATION=/etc/$(pg_lsclusters -h | awk '{print $6}' | sed 's,\(/var/lib/\)\(.*\),\2,')/postgresql.conf
PG_HBA_LOCATION=/etc/$(pg_lsclusters -h | awk '{print $6}' | sed 's,\(/var/lib/\)\(.*\),\2,')/pg_hba.conf
sed -i "s/#\(listen_addresses = \)'localhost'/\1'*'/" $PG_CONF_LOCATION
sed -i 's,\(# Database administrative login by Unix domain socket\),\1\nhost    all             bucardo         10.8.0.3/24             trust\nhost    all             bucardo         10.8.0.4/24             trust\n,' $PG_HBA_LOCATION
echo 'host    all             all             10.8.0.100/24           md5' >> $PG_HBA_LOCATION
echo 'host    mayan           mayanuser       10.8.0.1/24             md5' >> $PG_HBA_LOCATION
echo 'host    mayan           mayanuser       10.8.0.2/24             md5' >> $PG_HBA_LOCATION
systemctl restart postgresql

# Add a Bucardo user to Postgres
sudo -i -u postgres bash <<EOF
psql -c "create user bucardo with superuser password 'bucardopassword';"
EOF

# Set up a password file for Postgres
echo "10.8.0.3:5432:bucardo:bucardo:bucardopassword" >> ~/.pgpass
echo "10.8.0.3:5432:mayan:mayanuser:mayandbpass" >> ~/.pgpass
echo "10.8.0.4:5432:mayan:mayanuser:mayandbpass" >> ~/.pgpass
chmod 0600 ~/.pgpass

# Install and set up keepalived for failover
apt install -yq keepalived
mkdir -p /etc/keepalived
cat > /etc/keepalived/keepalived.conf <<EOF
vrrp_instance Instance1 {
    state $(if [ $1 == 3 ]; then echo "MASTER"; else echo "BACKUP"; fi)
    interface eth1
    virtual_router_id 10
    priority $(if [ $1 == 3 ]; then echo "100"; else echo "50"; fi)
    advert_int 1
    authentication {
        auth_type PASS
        auth_pass keepalivepassword
    }
    virtual_ipaddress {
        10.8.0.100/24
    }
}
EOF
systemctl restart keepalived

# Install rclone
apt install -yq rclone

# Set up the rclone configuration
mkdir -p ~/.config/rclone
cat > ~/.config/rclone/rclone.conf <<EOF
[linodes3]
type = s3
env_auth = false
acl = private
access_key_id = $2
secret_access_key = $3
region = $4-1
endpoint = $4-1.linodeobjects.com
EOF

# Give the rclone backup script executable permissions, and add it as a cron job
chmod +x /usr/local/bin/cbdms-data-backup.sh
(crontab -l; echo "59 23 * * * /usr/local/bin/cbdms-data-backup.sh") | crontab -

# Download the postgres_exporter for Prometheus
curl -s https://api.github.com/repos/prometheus-community/postgres_exporter/releases/latest \
  | grep "browser_download_url.*postgres_exporter-.*linux-amd64.tar.gz" \
  | cut -d : -f 2,3 \
  | tr -d \" \
  | wget -qi -
tar xvfz postgres_exporter-*.tar.gz
mv postgres_exporter*-amd64/postgres_exporter /usr/local/bin/
rm -r postgres_exporter*-amd64
rm postgres_exporter*-amd64.tar.gz

# Add a user for the postgres_exporter
sudo -i -u postgres bash <<EOF
psql -c "create user prometheus with superuser password 'prometheuspass';"
EOF

# Start the postgres_exporter service
systemctl daemon-reload
systemctl start postgres_exporter
systemctl enable postgres_exporter
