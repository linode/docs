#!/usr/bin/env bash

# $1 = CURRENT_GATEWAY
# $2 = NODE_NUMBER

GATEWAY_IPS=('10.8.0.1' '10.8.1.1')
NODE_IP_PREFIX='10.8.'
NODE_IP_SUFFIXES=('0.11' '0.12' '1.13' '1.14')

# Make some network configuration changes.
cp /etc/systemd/network/05-eth0.network /etc/systemd/network/04-eth0.network
echo -e "[Route]\nGateway=${GATEWAY_IPS[$1]}\nGatewayOnLink=true" >> /etc/systemd/network/04-eth0.network

systemctl restart systemd-networkd.service

# Update the APT package repository and install some useful tools.
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -yq nftables iperf netcat traceroute jq python3 iptables-persistent netfilter-persistent

# Install NPM.
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
#export NVM_DIR=\"$HOME/.nvm\"
#[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
#[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
source ~/.nvm/nvm.sh
nvm install node

# Set up the example application.
cd /usr/local/example-app
npm install
cd ~/
sed -i "s,node,$(which node)," /lib/systemd/system/example-app.service

# Install MongoDB.
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt-get update
apt-get install -yq mongodb-org

# Adjust the permissions for the MongoDB cluster keyfile.
chmod 400 /opt/mongo/mongo-keyfile
chown mongodb:mongodb /opt/mongo/mongo-keyfile

# Configure MongoDB.
for i in "${!NODE_IP_SUFFIXES[@]}"; do
    echo "${NODE_IP_PREFIX}${NODE_IP_SUFFIXES[$i]} mongo-repl-$((i+1))" >> /etc/hosts
done
sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 localhost\,mongo-repl-${2}," /etc/mongod.conf

systemctl start mongod
systemctl enable mongod

if [ $2 == '1' ]; then
    mongosh admin --eval "db.getSiblingDB('admin').createUser({user: 'admin', pwd: 'MONGODB_ADMIN_PASSWORD', roles: ['root']})"
fi

cat >>/etc/mongod.conf <<EOF
replication:
   replSetName: "rs0"

security:
  keyFile: /opt/mongo/mongo-keyfile
EOF

systemctl restart mongod

systemctl daemon-reload
systemctl start example-app
systemctl enable example-app

