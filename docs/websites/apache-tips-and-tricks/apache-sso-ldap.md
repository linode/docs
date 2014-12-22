
1. Introduction

This article gives an overview of the process involved in configuring Apache 2.4 for SSO with mod_auth_form, mod_session and LDAP. The SSO is completly managed on the Apache side without any involvement from the backend application(s).

Big focus of this setup is given to the security hence all client-server traffic will be SSL/TLS encrypted. The Apache hosts will be SSL enabled and the user's login credentials collected by the login form and included in the secure session cookies will be encrypted. The access control, authentication and authorization, will be centralized and provided via LDAP. In case you want to setup something similar but don't have LDAP available you can easily switch to Apache Basic file provided authentication instead.

We assume multiple applications running under different domains, in this case site1.mydomain.com and site2.mydomain.com, and we want to be able to log into all of them only once. Both hosts will share common session cookie we set for ".mydomain.com" domain,  meaning we only need to login to one of the domains to gain access to all of them. This also means in case we log out from one of the domains, the session cookie will expire and we'll get logged off from all of them.

This is a working example tested on Ubuntu 14.04.1 LTS with Apache 2.4.7-1ubuntu4.1 and openssl 1.0.1f-1ubuntu2.7. All commands are given for the root user.


2. Setup

2.1 Install Apache

# aptitude install apache2 apache2-utils


2.2 Enable the needed modules

# a2enmod ssl
# a2enmod rewrite
# a2enmod authnz_ldap
# a2enmod session
# a2enmod session_crypto 
# a2enmod session_cookie
# a2enmod auth_form 
# a2enmod request 
# a2enmod headers
# service apache2 restart


2.3 Create the virtual hosts

Each of the sites will have its own document root:

# mkdir /var/www/html2 /var/www/html3

We also cereate new configuration for each of the sites by adding the following to the /etc/apache2/sites-available/000-default-ssl.conf file:

<VirtualHost *:443>
	DocumentRoot /var/www/html2
	ServerName  site1.mydomain.com
	ServerAlias www.site1.mydomain.com
	ServerAdmin root@localhost
	ErrorLog ${APACHE_LOG_DIR}/error2.log
	CustomLog ${APACHE_LOG_DIR}/access2.log combined
	ErrorDocument 401 /login.html
	LogLevel debug mod_rewrite.c:trace3
	Include conf-available/my-ssl.conf
</VirtualHost>

<VirtualHost *:443>
	DocumentRoot /var/www/html3
	ServerName  site2.mydomain.com
	ServerAlias www.site2.mydomain.com
	ServerAdmin root@localhost
	ErrorLog ${APACHE_LOG_DIR}/error3.log
	CustomLog ${APACHE_LOG_DIR}/access3.log combined
	ErrorDocument 401 /login.html
	LogLevel debug mod_rewrite.c:trace3
	Include conf-available/my-ssl.conf
</VirtualHost>

We point each of the hosts to the SSL configuration file via the Include directive. Just to mention here, after finished with testing it is a good idea to change the LogLevel from debug to something more reasonable like warn for example by replacing:

LogLevel debug mod_rewrite.c:trace3

with

LogLevel warn


2.4 Setup SSL

Next we create the SSL configuration file /etc/apache2/conf-available/my-ssl.conf with the folowing content:

SSLEngine on
SSLCompression off
SSLProtocol all -SSLv2 -SSLv3
SSLHonorCipherOrder on
SSLCipherSuite "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 \
				EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 \
				EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES \
				!MD5 !EXP !PSK !SRP !DSS"
SSLCertificateFile /etc/apache2/ssl.crt/star_mydomain_com.pem
SSLCertificateKeyFile /etc/apache2/ssl.crt/star_mydomain_com.key
SSLCertificateChainFile /etc/apache2/ssl.crt/AuthChainCA.crt

<FilesMatch "\.(cgi|shtml|phtml|php|pl)$">
    SSLOptions +StdEnvVars
</FilesMatch>

SetEnvIf User-Agent ".*MSIE [2-6].*" \
nokeepalive ssl-unclean-shutdown \
downgrade-1.0 force-response-1.0

SetEnvIf User-Agent ".*MSIE [7-9].*" \
ssl-unclean-shutdown

This assumes we have valid SSL and CA certificates signed by an official authority and placed under /etc/apache2/ssl.crt directory. In case of self signed ones, please replace the paths in the SSLCertificate* directives appropriately. Also note we have only left TLS1.x protocols enabled and force usage of some more secure cipher suits via SSLHonorCipherOrder directive.

In case we prefer to enable this configuration and make it valid server vise, we can run:

# a2enconf my-ssl
# service apache2 reload

and omit the Include directive from the virtual hosts above.


2.5 Redirect all HTTP traffic to HTTPS

For security reasons we want the whole traffic to go via SSL only. By default the catch all HTTP virtual host on Debian/Ubuntu lives in the /etc/apache2/sites-enabled/000-default.conf file. Replace the content of this file with the one given below:
 
<VirtualHost *:80>
	ServerAdmin root@localhost
	DocumentRoot /var/www/html
	RewriteEngine On
	RewriteCond %{HTTPS} !=on
	RewriteRule ^(.*)$ https://%{HTTP_HOST}$1

	LogLevel debug
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

Now is the moment to test our configuration by running:

# apache2ctl configtest

If this comand returns with "Syntax OK" we can proceed and restart Apache:

# service apache2 restart

If not then some troubleshoting is in order based on the error output.

Now, assuming we have a working DNS that correctly resolvs our domain names to the Apache server private or public IP, if we go to http://site[12].mydomain.com we should get redirected to https.


2.6 Configure the SSO

2.6.1 LDAP

This is the crucial step in the configuration. Apache will use LDAP module to authenticate and authorize the user before granting the access and creating session. Setup and configuration of the LDAP server is out of scope here so I'll just give an overview of the DN's in the directory relevant for our setup:

dn: dc=mydomain,dc=com
dn: ou=Users,dc=mydomain,dc=com
dn: ou=Groups,dc=mydomain,dc=com
dn: cn=admin-users,ou=Groups,dc=mydomain,dc=com
dn: uid=name.surname,ou=Users,dc=mydomain,dc=com
dn: cn=ldapuser,ou=Users,dc=encompasshost,dc=com

The base of the search will be the user's uid parameter. In the authentication phase we check if the user exists and his password matches the supplied credentials via Apache. In the authorization phase we check if the user is member of the admin-users group. This is the valid Apache configuration we need to include in our virtual hosts:  

AuthLDAPURL "ldap://ldap1.mydomain.com ldap2.mydomain.com:389/ou=Users,dc=mydomain,dc=com?uid" STARTTLS
AuthLDAPBindDN cn=ldapuser,ou=Users,dc=mydomain,dc=com
AuthLDAPBindPassword password
AuthLDAPGroupAttribute memberUid
AuthLDAPGroupAttributeIsDN off
Require ldap-group cn=admin-users,ou=Groups,dc=mydomain,dc=com
Require valid-user
Satisfy all

Note that I'm pointing to two LDAP servers I have running in replication mode. Change the AuthLDAPURL directive accordingly in case of single server but for production it is always good practice to provide redundancy so we don't lock our users out in case of LDAP outage. The connection will use STARTTLS so we don't send the credentials in clear text. If the Apache and LDAP server(s) are in the same protected subnet STARTTLS will probably not be of any use and can be omitted.

Also note the existance of the ldapuser which we use to bind to the LDAP server with since the anonymous browsing in the directory is of course not permited. This user has been setup with appropriate read only privilages in the LDAP server using ACL's. 

2.6.2 SSO

Finally we wrap up the above LDAP settings in mod_auth_form and mod_session/mod_session_cookie directives that we add at the end of the site1 virtual host:

<VirtualHost *:443>
...
# If no session cookie go to login page
RewriteEngine On
RewriteCond %{HTTP_COOKIE} !^.*session=.*
RewriteRule . /login.html [L]

# Login the user and send session cookie
<Location /dologin>
	SetHandler form-login-handler
	AuthName "AUTHENTICATION site1"
	AuthType form
	AuthFormProvider ldap
	AuthFormAuthoritative on
	AuthLDAPURL "ldap://ldap1.mydomain.com ldap2.mydomain.com:389/ou=Users,dc=mydomain,dc=com?uid" STARTTLS
	AuthLDAPBindDN cn=ldapuser,ou=Users,dc=mydomain,dc=com
	AuthLDAPBindPassword password
	AuthLDAPGroupAttribute memberUid
	AuthLDAPGroupAttributeIsDN off
	Require ldap-group cn=admin-users,ou=Groups,dc=mydomain,dc=com
	Require valid-user
	Satisfy all

	Session On
	SessionCookieName session path=/;domain=.mydomain.com;httponly;secure;version=1;
	SessionCryptoPassphrase secret
</Location>

<Location /login.html>
	Require all granted
</Location>

<Location /logout>
	SetHandler form-logout-handler
	AuthName "AUTHENTICATION site1" 
	AuthFormLogoutLocation https://site1.mydomain.com/loggedout.html
	Session On
	SessionMaxAge 1
	SessionCookieName session path=/;domain=.mydomain.com;httponly;secure;version=1;
	SessionCryptoPassphrase secret
</Location>

</VirtualHost>

The login form will be presented by /login.html page (relative path to the hosts's DocumentRoot). The login it self will be handled by the /dologin location where we set form-login-handler and set the session cookie. The session cookie is set to the mydomain.com domain and is encrypted with the supplied passphrase. To enable the users to log out of a particular session, we configure a page to be handled by the form-logout-handler. Any attempt to access this URL will cause the username and password to be removed from the current session, effectively logging the user out. We will also set the SessionMaxAge directive to 1, causing the session to expire almost immediatelly in the browser.

This is the content of the relevant html pages:
 
# cat /var/www/html2/login.html 
<html>
<head><title>Test Login</title></head>
<body>

<form method="POST" action="https://site1.mydomain.com/dologin.html">
    Username: <input type="text" name="httpd_username" value="" />
    Password: <input type="password" name="httpd_password" value="" />
    <input type="submit" name="login" value="Login" />
    <input type="hidden" name="httpd_location" value="https://site1.mydomain.com/index.html" />
	<input type="hidden" name="httpd_method" value="POST" />
</form>

</body>
</html>

# cat /var/www/html2/loggedout.html
<html>
<head><title>Test Login</title></head>
<body>
<span>You've been logged out from site1!&nbsp;<a href="https://site1.mydomain.com/login.html">Login back</a></span>
</body>
</html>

# cat /var/www/html2/index.html
<html>
<head><title>Test Login</title></head>
<body>
<span>Welcome to site1 site!&nbsp;<a href="https://site1.mydomain.com/logout">Logout</a></span>
</body>
</html>

For the second virtual host the configuration is exactly the same except we replace site1 with site2 and the html pages will be under /var/www/html3 directory.


3. Testing

Navigate to https://site1.mydomain.com and login with your username and password you have set in the LDAP (or password files if you want). After successful login open another tab and navigate to https://site2.mydomain.com. You will immediately access the home page without any login prompt.
 

