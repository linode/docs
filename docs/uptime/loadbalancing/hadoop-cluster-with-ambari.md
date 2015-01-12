---Launching A Hadoop Cluster On Linode Using Ambari---

#What Is Ambari ?
Everyone knows, installing & managing a hadoop cluster is not easy, especially in VPS environments.
So the solution is Apache Ambari. Ambari is a project aimed at making Hadoop management easier by 
developing software for provisioning, managing, and monitoring Hadoop clusters.
Ambari provides an intuitive, easy-to-use Hadoop management web UI backed by its RESTful APIs.

---------------------

#Getting Started
1.Launch a linode with at least 4GB of RAM (lets call it ‘linode1’)
2.Then deploy a CentOS 6.5 Distribution to it(CentOS7 is currently not supported)
3.Now SSH into the server
  Since there were no SSH keys added, so you will not find any ‘.ssh’ directory here, you’ll have to create them. 

4.To create the .ssh directory
	mkdir ~/.ssh

5.Change it’s permission to 700
	chmod 700 ~/.ssh

6.Now to generate the SSH keys
	cd ~/.ssh
	ssh-keygen -t rsa

  save it as id_rsa

7.Rename the public key ‘id_rsa.pub’ to ‘authorized_keys’
	mv id_rsa.pub authorized_keys

8.Copy and save the private key in a text file on your local machine, we’ll need it later
	cat id_rsa
	
9.Now update the system
	yum update
	
10.Turn off iptables
	chkconfig iptables off
	service iptables stop
	
11.Turn on ntpd
	chkconfig ntpd on
	service ntpd start
	
	
---------------------

	
#Cloning The Servers/Linodes
1.Shutdown the server from your linode control panel
2.Create another linode but do not deploy any distribution yet(lets call it 'linode2')
3.Go back to your old linode(linode1) and click on clone
4.Select the configuration as well as the swap and disk
5.And select the new linode and clone it
6.Do it 5 more times and wait until the cloning gets completed
7.After that, boot all the servers

 so now we have a total of 7 servers/linodes
  linode1(main controller node)
  linode2(slave node)
  linode3(slave node)
  linode4(slave node)
  linode5(slave node)
  linode6(slave node)
  linode7(slave node)
  
---------------------  
  

#Installing Ambari Server
Now, once again SSH into linode1(main controller node)
Now we need to add the Ambari repo, install Ambari & set it up


1.Downlod the repo 
Choose any version of Ambari that you'd like to install-

version 1.4.3.38(used in this tutorial)
	wget http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.4.3.38/ambari.repo
	
version 1.5.1(recommended)
	wget http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.5.1/ambari.repo
	
version 1.7.0(experimental)
	wget http://public-repo-1.hortonworks.com/ambari/centos6/1.x/updates/1.7.0/ambari.repo


2.Setup the Repo
	
	cp ambari.repo /etc/yum.repos.d

	yum repolist

3.Install Ambari
	yum install ambari-server

4.Setup Ambari(just accept the default values and continue)
	ambari-server setup

5.Start Ambari server
	ambari-server start
	

---------------------	
	
	
#Installing The Hadoop Cluster
1.Now open any web browser and open this-

	http://$IP-of-main-controller-node$:8080

	eg; http://106.185.49.236:8080


2.Login using the default credentials
	username- admin
	password- admin
[![Login](/images/650/image1.png)](/images/original/image1.PNG)


3.Give any name to your cluster
[![name your cluster](/images/650/image2.png)](/images/original/image2.PNG)


4.Select the hadoop stack version
[![select hadoop stack](/images/650/image3.png)](/images/original/image3.PNG)


5.From your linode control panel, copy the public hostnames of all the 6 slave servers
(linode2,linode3,linode4,linode5,linode6,linode7)
[![linode hostname](/images/650/image4.png)](/images/original/image4.PNG)


6.Paste all the hostnames here and then provide the private key that we saved earlier on our local machine
[![provide hostnames & private key](/images/650/image5.png)](/images/original/image5.PNG)


7.Wait until the installation gets completed
[![installing](/images/650/image6.png)](/images/original/image6.PNG)
[![installed](/images/650/image7.png)](/images/original/image7.PNG)


8.Choose services, you can exclude any service(s) that you don't want in your cluster
[![choose services](/images/650/image8.png)](/images/original/image8.PNG)


9.Assign master servers, you can leave it as default to let it assign them automatically
[![assign masters](/images/650/image9.png)](/images/original/image9.PNG)


10.Assign slaves and clients, you can leave it as default too
[![assign slaves & clients](/images/650/image10.png)](/images/original/image10.PNG)


11.Setup database password for hive
[![setup hive DB password](/images/650/image11.png)](/images/original/image11.PNG)


12.Setup passwords for oozie and nagios too
[![setup nagios admin password & email](/images/650/image12.png)](/images/original/image12.PNG)


13Confirm everything then hit deploy
[![deploy it](/images/650/image13.png)](/images/original/image13.PNG)


14.Wait for the installation to complete
[![wait for it to complete](/images/650/image14.png)](/images/original/image14.PNG)
[![completed](/images/650/image15.png)](/images/original/image15.PNG)

15.Now you will be redirected to the ambari dashboard, from here you can manage the cluster very easily
[![dashboard](/images/650/image16.png)](/images/original/image16.PNG)


---------------------

#For more info
[Apache Hadoop](http://hadoop.apache.org)
[Apache Ambari](http://ambari.apache.org)
[Ambari Wiki](https://cwiki.apache.org/confluence/display/AMBARI/Ambari)
[Cloning Linodes](https://www.linode.com/docs/migrate-to-linode/disk-images/disk-images-and-configuration-profiles/)
[Automating Server Builds](https://www.linode.com/docs/server-builds)