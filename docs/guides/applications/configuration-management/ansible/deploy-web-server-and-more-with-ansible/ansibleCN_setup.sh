#! /bin/bash

# This is the script to run to setup an Ansible control plane.

# remove unused ports

apt update
apt upgrade -y

hostnamectl set-hostname CtlPlane

# Secure ssh a bit with no root login and no x11 forwarding
sed -in 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sed -in 's/X11Forwarding yes/X11Forwarding no/' /etc/ssh/sshd_config
# This is needed to configure the Worker Nodes?
sed -in 's/#   StrictHostKeyChecking ask/StrictHostKeyChecking no/' /etc/ssh/ssh_config

echo "##########################################################"
echo "# Installing Software                                    #"
echo "##########################################################"
# Install Software
# ==================================================================================================== 
apt install git -y
apt install tmux -y
apt install lynx -y
apt install sshpass -y
apt install ansible -y
apt install fail2ban -y
apt install net-tools -y
apt install python3-pip -y
pip3 install passlib

# Configure Software
# ==================================================================================================== 
# fail2ban
# ========
systemctl enable fail2ban.service
systemctl start fail2ban.service
# ufw
# ========
ufw allow openssh
ufw enable
ufw status

echo "##########################################################"
echo "# Creating limited user                                  #"
echo "##########################################################"
echo ""
echo "Please enter prefered username: "
read USERNAME
# create limited user and give sudo privileges
useradd -m -G sudo -s /bin/bash $USERNAME
passwd $USERNAME

mv ansibleWK_setup.sh myplaybook.yml /home/$USERNAME

# Create passwordless sudo for user $USERNAME
# ** add file in /etc/sudoers.d/
echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/10-user-$USERNAME
chmod 440 /etc/sudoers.d/10-user-$USERNAME
visudo -c

# run the below to create an ssh key for the user
mkdir /home/$USERNAME/.ssh
ssh-keygen -t rsa -b 2048 -f /home/$USERNAME/.ssh/id_rsa -q -N ''

# set file permissions for the user
chown -R $USERNAME:$USERNAME /home/$USERNAME/.ssh
chown $USERNAME:$USERNAME /home/$USERNAME/myplaybook.yml

echo "##########################################################"
echo "# Dunzo. Poke around if you like.  I reccomend a reboot. #"
echo "##########################################################"
