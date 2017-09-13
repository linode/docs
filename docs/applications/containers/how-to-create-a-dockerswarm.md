How to create a Docker Swarm

You can’t toss a rock into a crowd of IT admins without hitting someone who’s worked with Docker. If you’re one of those who has, you understand how powerful they can be and how easy Docker makes it to deploy containers. But did you know you can easily scale up the power of Docker by creating a cluster of Docker hosts, called a Docker Swarm? Unlike some of the competition, the process of creating such a cluster of Nodes is really simple with Docker. All you need is one machine to serve as a Docker Swarm Manager and a few Docker hosts to join the Swarm as Nodes.

I’m going to walk you the process of setting up a Docker Swarm Manager and then connect Nodes for scalable container roll out. It should be noted that you can manage this on your Linode. What it will require is to have multiple Linodes running (preferably all in the same location). Let’s say you have three Linodes running. For the sake of simplicity, I will name them:

Linode-Manager
Linode-Node-A
Linode-Node-B

These do not have to be making use of the same operating system, but must each have Docker installed and running. I will be demonstrating with a Ubuntu 16.04 Manager and Nodes. With that said, let’s build our Manager.

Creating the Docker Swarm Manager
The Docker Swarm Manager’s purpose is to receive commands on behalf of the cluster and assign containers to nodes. The Swarm Manager uses the Raft Consensus Algorithm to manage a Swarm state. The Raft Consensus Algorithm ensures that all manager nodes that are in charge of managing and scheduling tasks in a cluster are storing the same, consistent state. This means, should failure occur, any single node can assume the tasks and restore a stable state.
If you’re looking for high-availability, you can create multiple Swarm Managers. In our case, we are only going to create a single manager.
Creating the swarm on your manager can be done with a single command. Do note that you will have to use your Linode public-facing IP address. To find our your public-facing IP address, log into your Linode account, click on the Linode to be used as the Manager, and click Remote access. The IP address you will use for remote access will be the same address used in the command to set up your Manager.
The command to initialize the manager is:
docker swarm init --advertise-addr PUBLIC_IP
Where PUBLIC_IP is that actual public IP address for the Linode that hosts your Docker Swarm Manager. After you issue that command, Docker will do you a big favor by reporting the command necessary for the Nodes to join the Swarm (Figure 1). 
Figure 1
swarm_1.jpg
The Docker Swarm Manager is now up and running.
Congrats, your Docker Swarm Manager is up and running and ready to be joined.
To verify that your Swarm is running and active, issue the command docker info. Within the output, you should see Swarm: Active (Figure 2).
Figure 2
swarm_2.jpg
Joining Nodes to Manager
At this point, you should already know how to join the Node to the Manager (by way of the docker swarm init command output). The structure of the join command is:
docker swarm join --token TOKEN PUBLIC_IP:2377
Where TOKEN is the long sting of characters presented to you when you initialized the Swarm and PUBLIC_IP is the public-facing IP address of your Swarm Manager Linode. If you can’t remember the token, you can always issue the command (on the Manager):
docker swarm join-token manager
The above command will output the same information as did the original Swarm init command.
To join the Node to the Swarm issue the command:
docker swarm join --token TOKEN IP:2377
Where TOKEN is the token displayed when you created the Manager and IP is the IP address of the Swarm Manager. You should immediately see that the node joined the  swarm as a worker (Figure 3).
Figure 3
swarm_3.jpg
The Node has joined the Swarm. You now have a very small Docker Swarm cluster, consisting of one Manager and one Node. You can follow the same steps above to join as many Nodes to the Swarm as you like.
Back at the Manager, if you issue the command docker nodes ls, you will see your Manager and any joined Nodes listed (Figure 4).
Figure 4
swarm_4.jpg
Our Manager and Node listed.
Deploying a service
With our active nodes, it is now possible to deploy a service. This process will be handled from the Docker swarm manager. I’ll demonstrate by deploying an NGINX container on the Swarm. Go back to the terminal on the Docker Swarm Manager server and create an nginx webserver service with the command:
docker service create -p 80:80 --name my_web nginx
The above command will deploy the NGINX container (named my_web) on a single node. Let’s say you have joined three Nodes to our manager. If that’s the case, you can scale that service to all three Nodes with the command:
docker service scale my_web=3
Head over to your Node and issue the command docker ps -a and you’ll see that the service has been deployed to the node (Figure 5).
Figure 5
swarm_5.jpg
The my_web service has reached the nodes.
Should you want to stop the my_web service, all you have to do is issue the command:
docker service remove my_web
Just Scratchiexng the Surface
There is so much more that can be done with Docker Swarm, but this will get you started on the right foot. Make sure you master the above concepts before moving on to more complex matters (such as rolling updates, mesh routing, and more). And don’t forget, you can also use tools like Shipyard to help manage your Docker Swarm (making it actually quite a bit easier to work with). Before you give Swarm management a go with Shipyard, make sure you first understand the basics of deploying a Swarm cluster.


