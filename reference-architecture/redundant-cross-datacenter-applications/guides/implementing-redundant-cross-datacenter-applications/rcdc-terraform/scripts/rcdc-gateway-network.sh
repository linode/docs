#!/usr/bin/env bash

# $1 = CURRENT_GATEWAY
# $2 = OTHER_GATEWAY

# Get the gateway's IP address for use later.
GATEWAY_IP="10.8.$1.0"
OTHER_GATEWAY_IP="10.8.$2.0"
ETH0_IP="10.8.$1.1"
ETH1_IP="10.8.$1.2"
WIREGUARD_NETWORK_IP="10.254.8.$(($1+1))"

# Set up networkd.
cp /etc/systemd/network/05-eth0.network /etc/systemd/network/04-eth0.network
echo "IPForward=true" >> /etc/systemd/network/04-eth0.network
echo -e "\n[Route]\nGateway=0.0.0.0\nGatewayOnLink=true" >> /etc/systemd/network/04-eth0.network
systemctl restart systemd-networkd.service

# Update APT repositories and install necessary/useful software.
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -yq nftables keepalived wireguard iperf netcat traceroute jq python3 iptables-persistent netfilter-persistent

# Instantiate iptables rules for port forwarding and masquerading.
iptables -A FORWARD -j ACCEPT
iptables -t nat -s ${GATEWAY_IP}/24 -A POSTROUTING -j MASQUERADE
iptables -t nat -A POSTROUTING -o eth0 -m mark ! --mark 42 -j MASQUERADE
iptables-save | sudo tee /etc/iptables/rules.v4
systemctl restart netfilter-persistent

# Configure keepalive.
cat >/etc/keepalived/keepalived.conf <<EOF
vrrp_instance nat_gateway_ipv4 {
    state MASTER
    interface eth1
    virtual_router_id 44
    priority 100
    advert_int 1
    virtual_ipaddress {
        ${ETH0_IP}
    }
}
EOF
systemctl restart keepalived.service

# Provision the Wireguard configuration.
wg genkey | tee /etc/systemd/network/wg.private_key
chmod 0644 /etc/systemd/network/wg.private_key && chown :systemd-network /etc/systemd/network/wg.private_key
cat /etc/systemd/network/wg.private_key | wg pubkey | tee /etc/systemd/network/wg.public_key
chmod 0644 /etc/systemd/network/wg.public_key

cat >/etc/systemd/network/99-wg0.netdev<<EOF
[NetDev]
Name=wg0
Kind=wireguard
Description=wireguard tunnel wg0
MTUBytes = 1400

[WireGuard]
ListenPort=51820
PrivateKeyFile=/etc/systemd/network/wg.private_key
FirewallMark=42

EOF

cat >/etc/systemd/network/99-wg0.network<<EOF
[Match]
Name=wg0

[Network]
Address=${WIREGUARD_NETWORK_IP}/24

[Route]
Destination=${OTHER_GATEWAY_IP}/24
Scope=link

EOF

systemctl restart systemd-networkd.service

# Install and set up the NGINX proxy.
apt-get install -yq nginx

ln -s /etc/nginx/sites-available/rcdc-gateway.conf /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

systemctl restart nginx

