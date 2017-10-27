# About the Author
#### Name:  
Chris Piccini
#### Email:  
cpiccini11@gmail.com

# Introduction
The purpose of this guide is to allow you to create and run python virtual environments in your Ubuntu 16.10 linode.  A Python Virtual environment or `virtualenv` is a tool to create an isolated Python environment within your VPS.  This can be extremely powerful as you can create a virtual environment and install all python executables/packages to it, and it will have no dependencies outside of your created virtual environment.



## Before You Begin

1.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](https://www.linode.com/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. Do **not** follow the Configure a Firewall section yet--this guide includes firewall rules specifically for an OpenVPN server.

2.  Update your system:

        sudo apt-get update
        
> Notes:  
> 1.  This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you’re not familiar with the `sudo` command, see the [Users and Groups](https://www.linode.com/docs/tools-reference/linux-users-and-groups) guide.
> 2.  Replace each instance of `testuser` in this guide with your custom user account.

## Installing Virtual Environment
1.  Run this command to install Python's virtual environment.
        
        sudo apt install virtualenv
        
2.  You will see a message asking if you want to continue.  
        
        Do you want to continue? [Y/n]
        
3.  Input Y and hit enter
        
        Y
        
## Create New Directory in Home
1.  Navigate to your users home directory.

        cd /home/testuser

2.  Create directory named *python-environments*

        mkdir python-environments
        
3.  Access the newly created directory by entering below command, then proceed to next section.

        cd python-environments

## Create a Virtual Envrionment in Python3
1.  Enter command to create a virtual environment in Python 3 with the environment name of *env*
        
        virtualenv -p python3 env
        
2.  Validate that environment is installed with python3.
        
        ls env/lib
        
## Activate Environment
1.  Enter command to activate the newly created virtual environment.
        
        source env/bin/activate

Now that the environment is active, you can install executables and packages only to this virtual environment.

## Deactivate Environment.
1.  Enter command in an active virtual environment to deactivate virtual environment.
        
        deactivate
        
        
# Finished!
      
        


