---
slug: Best-practice-for-kubernetes-security
author:
  name: Saka-Aiyedun Segun
  email: Sege.timz12@gmail.com
description: 'This guide covers best practices for Kubernetes that can be implemented when deploying to a cluster to keep your infrastructure secure'  
og_description: 'The container orchestration tool Kubernetes is a complicated cloud-native solution. Securing a Kubernetes cluster can be difficult for both software engineers and those just getting started. This guide will go through best practices for developers to utilize to secure and improve their Kubernetes cluster productivity'
keywords: ['Containers','kubernetes', 'Security', 'permissions']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-09-24
modified_by:
  name: Linode
title: "Best Practices for Kubernetes Security"
h1_title: "Kubernetes Security Best Practices To Secure Your Cluster. "
enable_h1: true
contributor:
  name: Saka-Aiyedun Segun
  link: 
  - https://github.com/segunjkf
  - https://twitter.com/kaytheog
external_resources:
- '[Snyk](https://snyk.io/)'
- '[Sysdig](https://sysdig.com/)'
- '[Weave](https://www.weave.works/)'
- '[Calico](https://projectcalico.docs.tigera.io/getting-started/Kubernetes/)'
- '[Istio](https://istio.io/latest/about/service-mesh/)'
- '[Linkerd]((https://linkerd.io/)'
- '[Hashicorp Vault](https://www.vaultproject.io/use-cases/Kubernetes)'
- '[Kasten k-10](https://www.kasten.io/product/)'
- '[Audit Policy](https://Kubernetes.io/docs/tasks/debug/debug-cluster/audit/#audit-policy)'
- '[Portworx](https://portworx.com/Kubernetes-disaster-recovery/)'
- '[Velero](https://velero.io/)'
aliases: [/kubernetes.io/docs/setup/best-practices/]
---

So you have a Kubernetes cluster and you want to keep your cluster secure, or you are just getting started and want to do things correctly. Securing a Kubernetes cluster can be difficult for both experienced software developers and those just getting started. To keep Kubernetes workloads secure, especially in production, key architectural weaknesses and platform dependencies must be addressed by following security best practices.

This guide will discuss 10 Kubernetes' best practices and how to implement these practices to secure and improve your Kubernetes cluster productivity and security.

## Scan Images for Vulnerabilities

Deploying an application is the primary purpose of provisioning a Kubernetes cluster. Workload security in Kubernetes begins before workloads are deployed within the cluster; it starts with the creation of an application image in the CI/CD pipeline; creating a secure image is the first step toward securing your cluster. When creating your application image, avoid utilizing codes from untrusted registries or libraries to reduce the possibility of viruses or backdoors. You should also avoid using unverified operating system packages in your container images since they can contain backdoors. [Snyk](https://snyk.io/) and [Sysdig](https://sysdig.com/) are two tools that can help you scan images. These scanning tools maintain a database of known vulnerabilities that are updated regularly, so scan your image regularly with them. By incorporating these tools into your CI/CD process, you can archive it.

It is possible for new vulnerabilities to be discovered after the CI/CD pipeline has scanned your image, so some vulnerabilities may still be missed. An image scanning function is included in an image registry, such as Docker image registry. Make sure to always scan images in the registry.

## Avoid Running your Container as a Root user or with Privileges

When your image has a vulnerability and the container is running with privileges, an attacker can easily exploit it to gain access to the host or Kubernetes work node. Therefore, when creating your image, you should create a service user and run the application using that user rather than root.

{{< file "Dockerfile" >}}
 create group and user

RUN groupadd -r myapp && useradd -g myapp my app

 set ownership and permissions
RUN chown -R myapp:myapp /app

switch to user
USER myapp

CMD node index.js
{{< /file >}}

This example above establishes a group and adds a user to it, while also running the application as the created user rather than the root user.

Even if you avoid running your application as a root user, it is possible that your Kubernetes manifest file can be misconfigured as a result of executing as the root user or allowing privilege escalation. The example below provides a Kubernetes manifest file demonstrating how to create a Pod that runs as a non-root user or with privileges.

{{< file "non_root_user.yaml" yaml >}}
   apiVersion: v1                                                        apiVersion: v1
   Kind: Pod                                                             Kind: Pod
   Metadata:                                                             Metadata:
          Name: my-app                                                      Name: my-app
   Spec:                                                                 Spec:
      securityContext:                                                      securityContext:
          runAsUser:1000                                                        allowPrivilegeEscalation: False
{{< /file >}}

Even if the attacker gains access to your container, this will make it difficult for the attacker to get out of the container or use the container privileges to access sensitive data in the cluster.

## User and Permission Management with Role-Based Access Control (RBAC)

After your application is safely deployed to the cluster, user authentication and authorization are the next steps to securing your cluster. Who has access to the cluster and what permissions do they have. In the event of an attack or if you want to manage the permissions that your cluster users have, you must handle user authentication and authorization. With these user profiles, what can the attacker do if they gain access to them, and what permissions do they have? It is now important to manage users and permissions and keep privileges as restrictive as possible.

You can use RBAC to determine who has access to the Kubernetes API and what rights they have. Normally, RBAC is enabled by default on Kubernetes 1.6 and later (later on some hosted Kubernetes providers). Because Kubernetes mixes authorization controllers, enabling RBAC necessitates the deactivation of the traditional Attribute Based Access Control (ABAC). When using RBAC, namespace-specific rights should be preferred over cluster-wide permissions. Even when debugging, do not give cluster administrator privileges. Granting access only when necessary for your specific situation is safer.

Using RBAC will manage external users for authentication and authorization, but what about the inside of the cluster?

## Make use of Network Policies or a Service Mesh

By default, each Pod in Kubernetes can freely communicate with any other Pod in the cluster. This means that if an attacker gains access to one Pod, they can also gain access to the other Pods in the cluster. When deploying microservice applications to a Kubernetes cluster, not all Pods communicate with each other. By creating network rules in the Kubernetes network layer, you can control which Pods can communicate with each other and which Pods can receive traffic. This is possible using the network policy, a Kubernetes resource. The network policy for a database with configured ingress and egress is shown below, with the ingress mapped to a front-end application.
{{< file "network-policy.yaml" yaml >}}
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  PodSelector:
    matchLabels:
      role: db
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - ipBlock:
            cidr: 172.17.0.0/16
            except:
              - 172.17.1.0/24
        - namespaceSelector:
            matchLabels:
              project: myproject
        - PodSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 6379
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/24
      ports:
        - protocol: TCP
          port: 5978
{{< /file >}}

In this set-up, even if the attacker gains access to one of the Pods, they will not be able to obtain access to all other Pods that may be running sensitive applications or storing sensitive data. Also, be aware that the network policy resource is really implemented by a Kubernetes network plug-in such as [Weave](https://www.weave.works/) or [Calico](https://projectcalico.docs.tigera.io/getting-started/Kubernetes/) that you deploy in a cluster. At the network level, network policies define communication rules, but to specify these rules at the service or application level, which is more logical, you should use a service mesh such as [Istio](https://istio.io/latest/about/service-mesh/) or [Linkerd](https://linkerd.io/). Isto, for instance, allows you to specify logical communication rules between services, which are then managed or checked by the proxies that it uses.

## Communication should be encrypted

In a cluster, Pod communications are unencrypted by default, so an attacker can view all of the internal communication information in plain text if they gain access to the cluster. But with service mesh like Istio, you can enable mutual TLS (mTLS) between services in addition to defining service rules. If an attacker gains access to your cluster and sees the traffic, they won't be able to read it, since all communications are encrypted. In order to increase the security of your cluster, encrypting internal cluster communication is a good security practice.

## Secure secret data

Secrets are used to store sensitive data such as passwords, tokens, credentials, or secret tokens. By using secrets in Kubernetes, Pods can be securely initialized with artifacts like keys, passwords, tokens, etc. When a Pod starts up, it normally needs to gain access to its secrets. By default, Kubernetes saves secrets unencrypted. They are base64 encoded, so anyone with access to the secrets can decode the base64 and read the secrets. As a result, if an attacker gains access to the cluster, the secrets can be easily accessed and decrypted. Secrets can be protected in a variety of ways in Kubernetes. You can use Kubernetes' own encryption configuration resource options.
However, there is still an issue with this method because you must still maintain the encryption key and store it securely, although various third-party programs can be used for this, such as [Hashicorp Vault](https://www.vaultproject.io/use-cases/Kubernetes). Vault can be used to Secrets will be securely stored and managed by the vault, which will actually take over storage and management.

## Secure Etcd

All Kubernetes configurations and secrets are stored in a key-value store method in etcd, so Kubernetes uses etcd to store and track the changes to its configurations. Each update is saved in the ectd store, and any changes made directly to the ectd will affect the cluster. An attacker can bypass the API server if they gain access to the etcd and update the etcd directly, which results in Kubernetes resources being updated, which is equivalent to having unlimited access to the whole cluster. You should therefore place your etcd behind a firewall and only allow the API server to access it. Additionally, the entire etcd should be encrypted, so even an attacker with access cannot read it.

## Automated Backup and Restore System

Your cluster contains sensitive data, including etcd, which holds your cluster's configuration data and application data from your database. A data leak or loss is one of the most serious security issues that an organization can face. In recent years, attackers have become more adept at gaining access to an organization's data, erasing or leaking it, and then demanding a ransom to recover it, which is bad for business. You must have a good backup and restoration solution for your cluster in place that periodically backs up your data and stores it safely so that you can use it in the event of a disaster to recover your data. [Kasten k-10](https://www.kasten.io/product/) is a Kubernetes native tool for configuring automated backup and restore. In order to ensure security, the Kasten k-10 has all the tools in place to securely transport and store backup data. A malicious attacker may also attempt to corrupt your existing backup, preventing you from recovering your data. Kasten offers an immutable backup solution, which means that backend data cannot be altered or removed.

## Audit Logs

Enable Kubernetes audit logs and monitor them for fraudulent behaviour and suspicious API calls. Kubernetes can preserve detailed records of cluster activities. Potential security vulnerabilities are detected in audit logs nearly instantly. An attacker, for example, attempting to brute force a password can generate authentication and authorization logs. If they occur repeatedly, there could be a security risk. Audit logs are disabled by default; to enable them, utilize the Kubernetes [Audit Policy](https://Kubernetes.io/docs/tasks/debug/debug-cluster/audit/#audit-policy), which allows administrators to configure one of four audit levels: None. Events that match this criterion should not be logged. Metadata. Request metadata, such as the requesting user, timestamp, resource, and verb, should be logged. Request. Log event metadata as well as the requested content but not the response body. This does not apply to requests for non-resources. RequestResponse. Keep track of event metadata, requests, and response bodies. This does not apply to requests for non-resources.

## Disaster Recovery

A robust disaster recovery plan and process are essential in case an attacker compromises your cluster and corrupts it. In the event that your Kubernetes cluster suffers an attack or just a zone outage, what will be your recovery plan? You need to devise a strategy for restoring the backup data, and your application should be up and running in no time. In the case of an attack, you require tools to restore the cluster to its original state using the most recent backup. Such tools include [Kasten K-10](https://www.kasten.io/product/), [Portworx](https://portworx.com/Kubernetes-disaster-recovery/), and [Velero](https://velero.io/).

## Conclusion

Kubernetes provides numerous choices for creating a secure deployment. There is no one-size-fits-all solution that can be utilized everywhere. Although Kubernetes offers built-in security, it requires proper configuration to function properly. Security begins with the selection of secure architecture and basic container images during the design process. Scanning tools can then be used to monitor the build process and identify any vulnerabilities or misconfigurations before the container is deployed. Finally, runtime monitoring tools aid in keeping track of running containers.

Even if you follow all best practices, continuous scanning of the infrastructure and applications is required to decrease the chance of an attack. Containers can contain obsolete packages that have publicly documented vulnerabilities, so it is always best to scan and update the packages.

Continuous security vulnerability scanning will aid in this endeavour. There are open-source projects for identifying vulnerabilities. To update the application, use Kubernetes' rolling update functionality. This will update the most recent image.
