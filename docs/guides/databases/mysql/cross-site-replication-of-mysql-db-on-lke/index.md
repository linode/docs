---
slug: cross-site-replication-of-mysql-db-on-lke
title: "Cross Site Replication of Mysql Db on Lke"
description: "Two to three sentences describing your guide."
og_description: "Optional two to three sentences describing your guide when shared on social media. If omitted, the `description` parameter is used within social links."
authors: ["Akamai"]
contributors: ["Akamai"]
published: 2026-03-02
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

**Cross site replication of MySQL DB on LKE** 

The \[redacted team\] and the \[redacted team\] has been involved in deploying a \[redacted customer service\] in production for \[redacted customer\]. The \[redacted customer API\] was required to  read the user credentials on a MySQL DB and upon authentication, the \[redacted customer API\] should update the Akamai EdgeDNS  with the latest IP on \[redacted device\]. 

As part of the deployment, one of the challenges was to make the service available across 2 LKE regions (New Jersey and Atlanta) deployed on 2 LKE clusters with Akamai GTM load  balancing the traffic between the two sites with 50/50 split. We needed to have MySQL replication across both the  regions so that the \[redacted customer API\] reads the latest version of the DB. Please feel free to read through the linked page for \[redacted customer service\] above to get an idea about how the \[redacted customer API\] works. Here I am going to talk about the cross-site  MySQL replication on 2 LKE clusters deployed in New Jersey and Atlanta.  

Overview of MySQL Replication Across Two Sites 

In this setup, we have two sites, New Jersey (site-1)and Atlanta (site-2), each with a MySQL StatefulSet deployed  with three replicas. The MySQL instances within each site are configured for replication among themselves.  Additionally, we have deployed Skupper to facilitate site-to-site replication, enabling MySQL instances across the  two sites to replicate data securely and efficiently.  

Skupper is a layer-7 service multi-cluster interconnection service. Skupper enables secure communication across  Kubernetes clusters by defining an ad-hoc virtual networking router. Skupper does not introduce a cluster-wide  interconnection but just for a specific set of namespaces. Skupper implements multi-cluster services in namespaces  exposed in the Skupper network. When a service is exposed, Skupper creates particular endpoints, making them  available on the entire cluster. 

![][image1]Components of the Setup 

MySQL StatefulSet on site-1: 

 \- New Jersey site has MySQL instances (mysql-0, mysql-1, mysql-2) with internal replication configured among  these three replicas. mysql-0 is the primary instance and mysql-1, mysql-2 are the secondary instances ensuring  the copy of the data in the primary instance 


![][image2]

 \- mysql-proxy Pods (NJ): These are intermediary services that manage the replication traffic from NJ to Atlanta.  They ensure that the write operations occurring in NJ are correctly propagated to the MySQL replicas in Atlanta. 

MySQL services on site-1 

![][image3]

mysql-proxy is a headless service acting as an intermediary between MySQL clients and the actual MySQL Pods.  Its handling requests such as reads and writes, balancing them across multiple MySQL instances. This service is  also involved in routing replication traffic to/from another site while being used in conjunction with Skupper.  

mysql-read is the ClusterIP service focused on distributing read traffic across multiple replicas on the same site.  

MySQL StatefulSets on site-2: 

 \- Atlanta has its own set of MySQL instances (mysql-0, mysql-1, mysql-2) under a StatefulSet. Additionally, there  is another StatefulSet (mysql-site-b) with three MySQL replicas (mysql-site-b-0, mysql-site-b-1, mysql-site-b-2).  They are designed to handle internal replication within site-2 itself, independently of the data being replicated  from site-1. 

 

![][image4]  
These three MySQL Pods (mysql-0, mysql-1, mysql-2) on site-2 Atlanta are configured to serve as replicas that  receive and process write requests forwarded from site-1 New Jersey. The setup ensures that any data changes  made in site-1 are replicated in these Pods, keeping site-2’s data synchronized with site-1. These pods in site-2 are  critical for maintaining a copy of site-1’s data. By receiving write requests from site-1, they ensure that site-2 has an  up-to-date replica of the data, which is essential for scenarios such as disaster recovery or load balancing between  sites. 

MySQL services on site-2 

![][image5]

mysql is a headless service associated with Skupper to route replication traffic to site-2 

mysql-read is a ClusterIP service that allows the application to write to the DB  

mysql-site-b is again a headless service that takes care of replication amongst the DB instances on site-2  

Skupper Components: 

 \- Skupper Router: Acts as the core component of the virtual network, enabling secure communication between  the services across the sites. 

 \- Skupper Service Controller: Manages the services exposed via Skupper, ensuring that the correct routing and  discovery happen between the sites. 

 \- Skupper Prometheus: Used for monitoring traffic and performance within the Skupper network. ![][image6]How data replicates across the mysql instances   
ConfigMap for mysql.conf 

| `apiVersion: v1  kind: ConfigMap  metadata:   name: mysql   labels:   app: mysql   app.kubernetes.io/name: mysql  data:   primary.cnf: |   # config on the primary.   [mysqld]   log-bin   replica.cnf: |   # config only on replicas.   [mysqld]   super-read-only   slave_net_timeout = 3600` |
| :---- |

This ConfigMap lets us customize the settings for the primary MySQL server and its replicas separately. We want  the primary server to send replication logs to the replicas, and the replicas to block any direct write operations that  don't come through replication. 

mysql service

| `apiVersion: v1  kind: Service  metadata:   name: mysql   labels:   app: mysql   app.kubernetes.io/name: mysql  spec:   ports:   - name: mysql   port: 3306   clusterIP: None   selector:   app: mysql  ---  # Client service for connecting to any MySQL instance for reads.  # For writes, connect to the primary: mysql-0.mysql.  apiVersion: v1  kind: Service  metadata:   name: mysql-read   labels:   app: mysql   app.kubernetes.io/name: mysql   readonly: "true"  spec:   ports:   - name: mysql   port: 3306   - name: mysql-rep   port: 3307   selector:   app: mysql` |
| :---- |

The headless service acts as a registry for the DNS entries that the StatefulSet creates for each Pod within the set.  Since this service is named mysql, the Pods can be accessed by resolving `<pod-name>.mysql` from any other  Pod in the same LKE cluster and namespace. 

The client service named mysql-read, is a standard service with its own cluster IP that balances connections across  all MySQL Pods that are marked as Ready. This includes both the primary MySQL server and all replicas. 

The read queries should utilize the mysql-read client service and to also take the load off the primary replica. For  write operations, client applications should connect directly to the primary MySQL Pod using its DNS entry provided  by the headless service, as there is only one primary MySQL instance. 

init container for initializing mysql configuration 

| `apiVersion: apps/v1  kind: StatefulSet  metadata:   name: mysql  spec:   replicas: 3   serviceName: mysql   selector:   matchLabels:   app: mysql   app.kubernetes.io/name: mysql   template:   metadata:   labels:   app: mysql   app.kubernetes.io/name: mysql   spec:   initContainers:   - name: init-mysql   image: mysql:5.7   command:   - bash   - "-c"   - |   set -ex   [[ $HOSTNAME =~ -([0-9]+)$ ]] || exit 1   ordinal=${BASH_REMATCH[1]}   echo [mysqld] > /mnt/conf.d/server-id.cnf   echo server-id=$((100 + $ordinal)) >> /mnt/conf.d/server-id.cnf   if [[ $ordinal -eq 0 ]]; then   cp /mnt/config-map/primary.cnf /mnt/conf.d/   else   cp /mnt/config-map/replica.cnf /mnt/conf.d/   fi   volumeMounts:   - name: conf   mountPath: /mnt/conf.d   - name: config-map   mountPath: /mnt/config-map`  |
| :---- |

The `init-mysql` init container configures each MySQL Pod in the StatefulSet with a unique server ID, which is  essential for MySQL replication. It assigns the primary configuration (`primary.cnf`) to the first Pod (`mysql-0`)  and the replica configuration (`replica.cnf`) to all other Pods. This ensures that the primary Pod acts as the  primary instance in the replication setup, while the others function as replicas.  
init container for clone-mysql 

|  ``- name: clone-mysql   image: gcr.io/google-samples/xtrabackup:1.0   command:   - bash   - "-c"   - |   set -ex   [[ -d /var/lib/mysql/mysql ]] && exit 0   [[ `hostname` =~ -([0-9]+)$ ]] || exit 1   ordinal=${BASH_REMATCH[1]}   [[ $ordinal -eq 0 ]] && exit 0   ncat --recv-only mysql-$(($ordinal-1)).mysql 3307 | xbstream -x -C /var/lib/mysql  xtrabackup --prepare --target-dir=/var/lib/mysql    volumeMounts:   - name: mysql-data   mountPath: /var/lib/mysql   subPath: mysql   - name: conf   mountPath: /etc/mysql/conf.d`` |
| :---- |

The above init container `clone-mysql`, handles cloning on a replica Pod when it starts up on an empty  PersistentVolume. It copies all existing data from another running Pod, ensuring the replica’s state is consistent  enough to begin replication from the primary server. 

Since MySQL doesn’t have a built-in feature for this, the process uses Percona XtraBackup, a popular open-source  tool. However, the cloning process can impact the source MySQL server’s performance. To reduce this impact on  the primary server, the script directs each Pod to clone from the Pod with the next lower ordinal index. This strategy  works because the StatefulSet controller ensures Pod N is Ready before starting Pod N+1 

init container for xtrabackup

| ``- name: xtrabackup   image: gcr.io/google-samples/xtrabackup:1.0   command:   - bash   - "-c"   - |   # Enable error handling and command echoing for debugging   set -ex      # Change to the MySQL data directory   cd /var/lib/mysql      # Check if 'xtrabackup_slave_info' exists and is non-empty   if [[ -f xtrabackup_slave_info && "x$(<xtrabackup_slave_info)" != "x" ]]; then   # Extract the slave replication information and remove trailing semicolon   cat xtrabackup_slave_info | sed -E 's/;$//g' > change_master_to.sql.in   # Clean up by removing 'xtrabackup_slave_info' and 'xtrabackup_binlog_info'   rm -f xtrabackup_slave_info xtrabackup_binlog_info   # If 'xtrabackup_slave_info' does not exist but 'xtrabackup_binlog_info' does   elif [[ -f xtrabackup_binlog_info ]]; then   # Extract the binlog position information   [[ `cat xtrabackup_binlog_info` =~ ^(.*?)[[:space:]]+(.*?)$ ]] || exit 1   # Clean up by removing 'xtrabackup_binlog_info' and 'xtrabackup_slave_info'   rm -f xtrabackup_binlog_info xtrabackup_slave_info   # Prepare the replication change command using the extracted binlog info   echo "CHANGE MASTER TO MASTER_LOG_FILE='${BASH_REMATCH[1]}',\   MASTER_LOG_POS=${BASH_REMATCH[2]}" > change_master_to.sql.in   fi   # If the 'change_master_to.sql.in' file was created (from either of the above cases)  if [[ -f change_master_to.sql.in ]]; then   # Wait for MySQL to be ready and accepting connections   echo "Waiting for mysqld to be ready (accepting connections)"   until mysql -h 127.0.0.1 -u root -p$MYSQL_ROOT_PASSWORD -e "SELECT 1"; do sleep 1; done     # Initialize replication from the cloned position using the extracted replication info  echo "Initializing replication from clone position"   mysql -h 127.0.0.1 -u root -p$MYSQL_ROOT_PASSWORD \   -e "$(<change_master_to.sql.in), \   MASTER_HOST='mysql-0.mysql.default.svc.cluster.local', \   MASTER_USER='root', \   MASTER_PASSWORD='$MYSQL_ROOT_PASSWORD', \   MASTER_CONNECT_RETRY=10; \   START SLAVE;" || exit 1      # Rename the replication command file to indicate it has been processed   mv change_master_to.sql.in change_master_to.sql.orig   fi   # Start a netcat listener on port 3307, streaming xtrabackup data   exec ncat --listen --keep-open --send-only --max-conns=3 3307 -c \   "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root -- password=$MYSQL_ROOT_PASSWORD"`` |
| :---- |

The `xtrabackup` is a sidecar container that checks the cloned data to see if MySQL replication needs to be set up  on the replica. If it does, it waits for MySQL to be ready, then runs the commands to start replication using the  details from the clone files. 

Once a replica starts replicating, it remembers its primary server and reconnects automatically if the server restarts  or the connection is lost. Since replicas use the stable DNS name `mysql-0.mysql` to find the primary server, they  can still connect even if the server gets a new IP address.  
After starting replication, the `xtrabackup` container stays available to serve any other Pods that need to clone  data, ensuring it's ready if the StatefulSet scales up or if a Pod needs to redo the clone after losing its storage 

Snippet from mysql statefulset on site-2 

| `apiVersion: apps/v1  kind: StatefulSet  metadata:   name: mysql-read   namespace: default  spec:   replicas: 3   serviceName: mysql-read   selector:   matchLabels:   app: mysql-read   template:   metadata:   labels:   app: mysql-read   spec:   initContainers:   - name: init-mysql   image: mysql:5.7   command:   - bash   - "-c"   - |   set -ex   # Skip the clone if data already exists.   if [[ -d /var/lib/mysql/mysql ]]; then   exit 0   fi   # Extract ordinal index from hostname (e.g., mysql-read-0, mysql-read-1).   if [[ $HOSTNAME =~ -([0-9]+)$ ]]; then   ordinal=${BASH_REMATCH[1]}   else   exit 1   fi   # If this is the primary Pod (ordinal 0), clone from the secondary Pod (mysql-read-1).  if [[ $ordinal -eq 0 ]]; then   ncat --recv-only mysql-read-1.mysql-read.default.svc.cluster.local 3307 | xbstream -x -C /var /lib/mysql   # Prepare the backup to make it ready for use.   xtrabackup --prepare --target-dir=/var/lib/mysql   exit 0   fi   # For other Pods, clone from the previous Pod in the StatefulSet (e.g., mysql-read-1 clones from mysql read-0).   ncat --recv-only mysql-read-$(($ordinal-1)).mysql-read.default.svc.cluster.local 3307 | xbstream -x -C  /var/lib/mysql   # Prepare the backup to make it ready for use.   xtrabackup --prepare --target-dir=/var/lib/mysql` |
| :---- |

The init-mysql container on site-1 primarily focused on setting up a unique server ID for each MySQL Pod and  configuring whether it should act as a primary server or a replica based on its ordinal index. It used the ordinal index  to assign configuration files (primary or replica) to each Pod, based on whether it was the first Pod (`mysql-0`) or a  subsequent Pod (`mysql-1`, `mysql-2`, etc.). 

The init-mysql container on site-2 is focused on ensuring that each MySQL Pod starts with a consistent data state  by cloning data from mysql pods mysql-0, mysql-1 and mysql-2 configured as part of the skupper link, which in-turn  is replicating data from mysql-proxy-0, mysql-proxy1 and mysql-proxy-2 on site-1. It ensures that if its starting on an  empty PersistentVolume, it uses Percona XtraBackup to clone and prepare the MySQL data directory. 

How to setup Skupper 

Install skupper on both the sites 

| `curl https://skupper.io/install.sh | sh` |
| :---- |

| `site-1:  skupper init --site-name site-1 --enable-flow-collector --ingress loadbalancer  skupper token create ~/site-1.token  skupper link create ~/site-2.token  skupper expose statefulset/mysql --headless --port 3306 --port 3307` |
| :---- |

| `site-2:  skupper init --site-name site-2 --enable-console --enable-flow-collector --ingress loadbalancer skupper token create ~/site-2.token  skupper link create ~/site-1.token` |
| :---- |

After creating token on site-1, 

 \-please make sure to create token on site-2, , on site-1 create the link 

 \-create a link with the \~/site-1 token on site-2 

 \-go to site \-1 , create link with site \-2 token  

 \-expose statefulset on site \-1 

How the Setup Works 

Intra-Site Replication:  
Within Site-1 and Site-2: Each MySQL StatefulSet operates independently, with replication configured internally  among the three replicas using Percona xtrabackup. The mysql-0 Pod acts as the primary, with mysql-1 and mysql 2 set up as replicas. This internal replication ensures data consistency within each site. 

Site-to-Site Replication with Skupper: 

\- Skupper's Role: Skupper creates a secure, encrypted communication layer between site-1 and site-2, effectively  linking the two Kubernetes clusters as if they were part of the same virtual network. This allows services in one site  to discover and communicate with services in the other site. 

\- Service Exposure: The MySQL service in site-1 is exposed via Skupper, making it accessible from site-2. The  mysql-proxy in Site-1 is configured to route replication traffic to site-2's MySQL instances. 

Replication Traffic Flow: 

\- Write Operations: When a write operation occurs on the primary MySQL instance in site-1, the mysql-proxy  intercepts this operation. Instead of only replicating the change within site-1, the proxy also forwards the replication  traffic to the MySQL replicas in site-2. 

\- Skupper Routing: The Skupper router ensures that the replication traffic is securely transmitted across sites. The  traffic from the mysql-proxy in site-1 is routed through the Skupper network to reach the MySQL replicas (mysql-site b-0, mysql-site-b-1, mysql-site-b-2) in site-2. 

Inter-Site Consistency: 

\- Data Propagation: The replication setup ensures that all changes made in site-1 are propagated to site-2. This  allows site-2 to maintain an up-to-date copy of the data present in site-1, effectively synchronizing the two sites. 

\- Fault Tolerance: In the event of a failure in site-1, site-2 can continue to serve data, ensuring high availability. 

The integration of MySQL replication with Skupper provides a robust solution for multi-site data synchronization.  Skupper’s secure and efficient routing enables the MySQL instances in site-1 and site-2 to replicate data as if they  were on the same network. The use of mysql-proxy further optimizes the replication process, ensuring that write  operations in one site are accurately and promptly reflected in the other. This setup enhances data resilience and  availability across geographically distributed sites. 

References: 

1\.    
NoIP DDNS repo \- https://bits.linode.com/shichand/DDNS   
2\.    
Run a Replicated Stateful Application: https://kubernetes.io/docs/tasks/run-application/run-replicated-stateful application/ 

3\.    
Percona xtrabackup for MySQL: https://docs.percona.com/percona-xtrabackup/2.4/index.html 4\.    
Skupper intro \- https://github.com/skupperproject/skupper-example-hello-world   
5\.    
CNCF \- https://www.cncf.io/blog/2021/04/12/simplifying-multi-clusters-in-kubernetes/