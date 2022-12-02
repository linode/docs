#!/usr/bin/env bash

# $1: Storage access key
# $2: Storage secret key
# $3: Storage region name
# $4: Domain name
# $5: Linode API key
# $6: Email address for SSL certificate
# $7: Current node number

if [ $7 == 1 ]; then
    OTHER_NODE_NUMBER=2
else
    OTHER_NODE_NUMBER=1
fi

# Install Docker and Docker Compose
apt install -yq ca-certificates curl gnupg lsb-release
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt update
apt install -yq docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Download the Mayan Docker Compose files
mkdir ~/mayan-docker
cd ~/mayan-docker
curl https://gitlab.com/mayan-edms/mayan-edms/-/raw/master/docker/docker-compose.yml -O
curl https://gitlab.com/mayan-edms/mayan-edms/-/raw/master/docker/.env -O

# Adjust the Mayan configuration
sed -i '/MAYAN_PIP_INSTALLS/d' .env
sed -i '/MAYAN_DOCUMENTS_STORAGE_BACKEND/d' .env
sed -i '/MAYAN_DOCUMENTS_STORAGE_BACKEND_ARGUMENTS/d' .env
sed -i 's/"80:8000"/"8080:8000"/' docker-compose.yml

echo 'MAYAN_PIP_INSTALLS="django-storages boto3"' >> .env
echo 'MAYAN_DOCUMENTS_FILE_STORAGE_BACKEND="storages.backends.s3boto3.S3Boto3Storage"' >> .env
echo "MAYAN_DOCUMENTS_FILE_STORAGE_BACKEND_ARGUMENTS={'access_key': '$1', 'bucket_name': 'cbdms-object-storage', 'default_acl': 'private', 'endpoint_url': 'https://cbdms-object-storage.$3-1.linodeobjects.com', 'secret_key': '$2'}" >> .env

# Decouple Mayan from Postgres
sed -i "s/# \(MAYAN_DATABASE_HOST=\)/\1\"10.8.0.100\"/" .env
sed -i 's/# \(MAYAN_DATABASE_NAME=\)/\1"mayan"/' .env
sed -i 's/# \(MAYAN_DATABASE_PASSWORD=\)/\1"mayandbpass"/' .env
sed -i 's/# \(MAYAN_DATABASE_USER=\)/\1"mayanuser"/' .env
sed -i 's/,postgresql//' .env
sed -i 's/postgresql:5432 //' .env

# Start up Mayan
docker compose --project-name mayan up --detach

# Install and configure NGINX
apt install -yq nginx
sed -i "s/<DOMAIN_NAME>/$4" /etc/nginx/sites-available/cbdms-app.conf
ln -s /etc/nginx/sites-available/cbdms-app.conf /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
systemctl restart nginx

# Install Cerbot
snap install core; snap refresh core
apt remove -yq certbot
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
snap set certbot trust-plugin-with-root=ok
snap install certbot-dns-linode

# Prepare the dns_linode configuration
mkdir -p ~/.secrets/certbot
echo "dns_linode_key = $5" > ~/.secrets/certbot/linode.ini
echo "dns_linode_version = 4" >> ~/.secrets/certbot/linode.ini
chmod 600 ~/.secrets/certbot/linode.ini

# Execute Certbot
certbot certonly --dns-linode --dns-linode-credentials ~/.secrets/certbot/linode.ini --non-interactive --agree-tos -d $4 -m $6
sed -i "s,listen 80;,listen 443 ssl;\n    ssl_certificate /etc/letsencrypt/live/$4/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/$4/privkey.pem;," /etc/nginx/sites-available/cbdms-app.conf

# Set up the profile for Unison
sed -i "s/<SERVER_ADDRESS>/10.8.0.$OTHER_NODE_NUMBER/" ~/.unison/cbdms-app-unison.prf
sed -i "s/<DOMAIN_NAME>/$4/" ~/.unison/cbdms-app-unison.prf

# Install Unison
curl -s https://api.github.com/repos/bcpierce00/unison/releases/latest \
  | grep "browser_download_url.*unison-v.*x86_64.linux.tar.gz" \
  | tail -n 1 \
  | cut -d : -f 2,3 \
  | tr -d \" \
  | wget -qi -
mkdir unison
tar xvfz unison-v*x86_64.linux.tar.gz -C unison
cp unison/bin/unison /usr/bin
cp unison/bin/unison-fsmonitor /usr/bin
rm -r unison
rm unison-v*x86_64.linux.tar.gz

# Add the other node as a known host to let Unison start up
ssh-keyscan -H 10.8.0.$OTHER_NODE_NUMBER >> ~/.ssh/known_hosts

# Download and start the node_exporter for Prometheus
curl -s https://api.github.com/repos/prometheus/node_exporter/releases/latest \
  | grep "browser_download_url.*node_exporter-.*linux-amd64.tar.gz" \
  | cut -d : -f 2,3 \
  | tr -d \" \
  | wget -qi -
tar xvfz node_exporter-*.tar.gz
mv node_exporter*-amd64/node_exporter /usr/local/bin/
rm -r node_exporter*-amd64
rm node_exporter*-amd64.tar.gz

# Apply the services
systemctl daemon-reload

systemctl restart nginx

systemctl start cbdms_unison
systemctl enable cbdms_unison

systemctl start node_exporter
systemctl enable node_exporter

