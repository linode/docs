#!/bin/bash

# This is the script to run in order to setup Ansible managed nodes.

apt update
apt upgrade -y

# Secure ssh a bit with no root login and no x11 forwarding.
sed -in 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -in 's/X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
sed -in 's/#PubkeyAuthentication/PubkeyAuthentication/' /etc/ssh/sshd_config

apt install fail2ban -y
systemctl enable fail2ban.service
systemctl start fail2ban.service

echo "##########################################################"
echo "# Creating limited user                                  #"
echo "##########################################################"

echo "\nPlease enter prefered username: "
read USERNAME
# create limited user and give sudo privileges
useradd -m -G sudo -s /bin/bash $USERNAME
passwd $USERNAME

# Create passwordless sudo execution for user $USERNAME
# ** add file in /etc/sudoers.d/
echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/10-user-$USERNAME
chmod 440 /etc/sudoers.d/10-user-$USERNAME
visudo -c

echo "##########################################################"
echo "# Dunzo. Poke around if you like.  I reccomend a reboot. #"
echo "##########################################################"
