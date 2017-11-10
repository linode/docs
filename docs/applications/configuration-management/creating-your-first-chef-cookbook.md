---
author:
  name: Elle Krout
  email: ekrout@linode.com
description: 'Learn how to create Chef cookbooks by creating a LAMP stack in Chef'
keywords: ["chef", "automation", "cookbooks", "opscode", "lamp", "lamp stack", "beginner", "server automation"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/chef/creating-your-first-chef-cookbook/']
modified: 2015-06-10
modified_by:
  name: Elle Krout
published: 2015-06-10
title: Creating Your First Chef Cookbook
external_resources:
 - '[Chef](http://www.chef.io)'
---

Cookbooks are one of the key components in Chef. They describe the *desired state* of your nodes, and allow Chef to push out the changes needed to achieve this state. Creating a cookbook can seem like an arduous task at first, given the sheer amount of options provided and areas to configure, so in this guide we will walk through the creation of one of the first things people often learn to configure: A LAMP stack.

![Creating Your First Chef Cookbook](/docs/assets/creating-your-first-chef-cookbook.png)

Prior to using this guide, be sure to set up Chef with the [Setting Up a Chef Server, Workstation, and Node](/docs/applications/chef/setting-up-chef-ubuntu-14-04) guide, and, if needed, review the [Beginner's Guide to Chef](/docs/applications/chef/beginners-guide-chef).

{{< note >}}
This guide assumes all nodes are using Ubuntu 14.04. Recipes can be adapted for use on multiple systems, but that is outside the scope of this guide.
{{< /note >}}

## Create the Cookbook

1. From your workstation, move to your chef-repo:

        cd chef-repo

2.  Create the cookbook. In this instance the cookbook is titled `lamp-stack`:

        knife cookbook create lamp-stack

3.  Move to your cookbook's newly-created directory:

        cd cookbooks/lamp-stack

4.  If you list the files located in the newly-created cookbook, you will see that a number of directories and files have been created:

        attributes    definitions  libraries    providers  recipes    templates
        CHANGELOG.md  files        metadata.rb  README.md  resources

    For more information about these directories see the [Beginner's Guide to Chef](/docs/applications/chef/beginners-guide-chef).


## default.rb

The `default.rb` file in `recipes` contains the "default" recipe resources.

Because each section of the LAMP stack (Apache, MySQL, and PHP) will have its own recipe, the `default.rb` file is used to prepare your servers.

1.  From within your `lamp-stack` directory, navigate to the `recipes` folder:

        cd recipes

2.  Open `default.rb` and add the Ruby command below, which will run system updates:

    {{< file "~/chef-repo/cookbooks/lamp-stack/recipe/default.rb" ruby >}}
#
# Cookbook Name:: lamp-stack
# Recipe:: default
#
#

execute "update-upgrade" do
  command "apt-get update && apt-get upgrade -y"
  action :run
end

{{< /file >}}


    Recipes are comprised of a series of *resources*. In this case, the *execute* resource is used, which calls for a command to be executed once. The `apt-get update && apt-get upgrade -y` commands are defined in the `command` section, and the `action` is set to `:run` the commands.

    This is one of the simpler Chef recipes to write, and a good way to start out. Any other start-up procedures that you deem important can be added to the file by mimicking the above code pattern.

3.  To test the recipe, add the LAMP stack cookbook to the Chef server:

        knife cookbook upload lamp-stack

4.  Add the recipe to your chosen node's run *list*, replacing `nodename` with your node's name:

        knife node run_list add nodename "recipe[lamp-stack]"

    Because this is the default recipe, the recipe name does not need to be defined after `lamp-stack` in the code above.

5.  Access your chosen node and run the *chef-client*:

        chef-client

    It should output a successful Chef run. If not, review your code for any errors, usually defined in the output of the chef-client run.


## Apache

### Install and Enable

1.  Create a new file under `/recipes` called `apache.rb`. This will contain all of your Apache configuration information.

2.  Open the file, and define the *package* resource to install Apache:

    {{< file "~/chef-repo/cookbooks/lamp-stack/apache.rb" ruby >}}
package "apache2" do
  action :install
end

{{< /file >}}


    Again, this is a very basic recipe. The *package* resource calls to a package (apache2). This value must be a legitimate package name. The action is *install* because Apache is being installed in this step. There is no need for additional values to run the install.

3.  Apache will also need to be set to turn on at reboot, and start. In the same file, add the additional lines of code:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/apache.rb" ruby >}}
service "apache2" do
  action [:enable, :start]
end

{{< /file-excerpt >}}


    This uses the *service* resource, which calls on the Apache service; the *enable* action enables it upon startup, whereas *start* will start Apache.

    Save and close the `apache.rb` file.

4.  To test the Apache recipe, update the LAMP Stack recipe on the server:

        knife cookbook upload lamp-stack

5.  Add the recipe to a node's run-list, replaceing `nodename` with your chosen node's name:

        knife node run_list add nodename "recipe[lamp-stack::apache]"

    Because this is not the `default.rb` recipe the recipe name, *apache*, must be appended to the recipe value.

6.  From that **node**, run the chef-client:

        chef-client

    If the recipe fails due to a syntax error, Chef will note it during the output.

7.  After a successful chef-client run, check to see if Apache is running:

        service apache2 status

    It should say that apache2 is running.

    {{< note >}}
Repeat steps 5-7 to upload the cookbook and run chef-client as needed through the rest of this guide to ensure your recipes are working properly and contain no errors. Remember to replace the recipe name in the run list code when adding a new recipe.
{{< /note >}}

### Configure Virtual Hosts

After the initial installation Apache needs to be configured, starting with its virtual hosts files. This configuration is based off of the [LAMP Server on Ubuntu 14.04](/docs/websites/lamp/lamp-server-on-ubuntu-14-04) guide.

1.  Because multiple websites may need to be configured, Chef's attributes feature will be used to define certain aspects of the virtual hosts file(s). Open a `default.rb` file under the `attributes` directory in your cookbook.

2.  Within `default.rb`, create the default values of the cookbook:

    {{< file "~/chef-repo/cookbooks/lamp-stack/attributes/default.rb" ruby >}}
default["lamp-stack"]["sites"]["example.com"] = { "port" => 80, "servername" => "example.com", "serveradmin" => "webmaster@example.com" }

{{< /file >}}


    The prefix *default* defines that these are the normal values to be used in the *lamp-stack* where the *site* *example.com* will be called upon. This can be seen as a hierarchy: Under the cookbook itself are the site(s), which are then defined by their URL.

    The following values in the array (defined by curly brackets) are the values that will be used to configure the virtual hosts file. Apache will be set to listen on port 80, and use the listed values for its server name, and administrator email.

    Should you have more than one available website or URL (for example, *example.org*), this syntax should be mimicked for the second URL:

    {{< file "~/chef-repo/cookbooks/lamp-stack/attributes/default.rb" ruby >}}
default["lamp-stack"]["sites"]["example.com"] = { "port" => 80, "servername" => "example.com", "serveradmin" => "webmaster@example.com" }
default["lamp-stack"]["sites"]["example.org"] = { "port" => 80, "servername" => "example.org", "serveradmin" => "webmaster@example.org" }

{{< /file >}}


3.  Return to your `apache.rb` file under `recipes` to call the attributes that were just defined. Do this with the *node* resource:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
#Install & enable Apache

package "apache2" do
  action :install
end

service "apache2" do
  action [:enable, :start]
end


# Virtual Hosts Files

node["lamp-stack"]["sites"].each do |sitename, data|
end

{{< /file-excerpt >}}


    This calls in the values under `["lamp-stack"]["sites"]`. Code added to this block will be generated for *each* value, which is defined by the word *sitename*. The *data* value calls the values that are listed in the array of each *sitename* attribute.

4.  Within the node resource, define a document root. This root will be used to define the public HTML files, and any log files that will be generated:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/apache.rb" ruby >}}
node["lamp-stack"]["sites"].each do |sitename, data|
  document_root = "/var/www/html/#{sitename}"
end

{{< /file-excerpt >}}


5.  However, this does not create the directory itself. To do so, the *directory* resource should be used, with a *true* recursive value so all directories leading up to the `sitename` will be created. A permissions value of `0755` will allow for the file owner to have full access to the directory, while group and regular users will have read and execute privileges:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/apache.rb" ruby >}}
node["lamp-stack"]["sites"].each do |sitename, data|
  document_root = "/var/www/html/#{sitename}"

  directory document_root do
    mode "0755"
    recursive true
  end

end

{{< /file-excerpt >}}


6.  The template feature will be used to generate the needed virtual hosts files. From the main directory of your lamp-stack cookbook navigate to *templates*, and then *default*:

        cd ~/chef-repo/cookbooks/lamp-stack/templates/default

7.  Create a virtual hosts file called `virtualhosts.erb`. Instead of inputting the true values, use Ruby variables. Ruby variables are identified by `<%= @brackets %>` around them and the `@` symbol. Note the variable names you use, they will need to be defined in the recipe file:

    {{< file "~/chef-repo/cookbooks/lamp-stack/templates/default/virtualhosts.erb" erb >}}
<VirtualHost *:<%= @port %>>
        ServerAdmin <%= @serveradmin %>
        ServerName <%= @servername %>
        ServerAlias www.<%= @servername %>
        DocumentRoot <%= @document_root %>/public_html
        ErrorLog <%= @document_root %>/logs/error.log
        <Directory <%= @document_root %>/public_html>
                Require all granted
        </Directory>
</VirtualHost>

{{< /file >}}


    {{< note >}}
Some variables should look familiar. They were created in step 2, when naming default attributes.
{{< /note >}}

8.  Return to the `apache.rb` recipe. In the space after the *directory* resource, use the *template* resource to call upon the template file just created:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
#Virtual Hosts Files

node["lamp-stack"]["sites"].each do |sitename, data|
  document_root = "/var/www/html/#{sitename}"

  directory document_root do
    mode "0755"
    recursive true
  end

  template "/etc/apache2/sites-available/#{sitename}.conf" do
    source "virtualhosts.erb"
    mode "0644"
    variables(
      :document_root => document_root,
      :port => data["port"],
      :serveradmin => data["serveradmin"],
      :servername => data["servername"]
    )
  end

end

{{< /file-excerpt >}}


    The name of the template resource should be the location where the virtual host file is placed on the nodes. The `source` is the name of the template file. Mode `0644` gives the owner read and write privileges, and everyone else read privileges. The values defined in the `variables` section are taken from the attributes file, and are the same values that are called upon in the template.

9.  The sites now need to be enabled in Apache, and the server restarted. This *only* should occur if there are changes to the virtual hosts, so the `notifies` value should be added to the *template* resource. What `notifies` does is notify Chef when things have changed, and **only then** runs the commands:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
template "/etc/apache2/sites-available/#{sitename}.conf" do
  source "virtualhosts.erb"
  mode "0644"
  variables(
    :document_root => document_root,
    :port => data["port"],
    :serveradmin => data["serveradmin"],
    :servername => data["servername"]
  )
  notifies :restart, "service[apache2]"
end

{{< /file-excerpt >}}


    The `notifies` command names the `:action` to be committed, then the resource, and resource name in square brackets.

10. `notifies` can also call on `execute` commands, which will run `a2ensite`and enable the sites we've made virtual hosts files for. Add the following `execute` command **above** the *template* resource code to create the `a2ensite` script:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
directory document_root do
  mode "0755"
  recursive true
end

execute "enable-sites" do
  command "a2ensite #{sitename}"
  action :nothing
end

template "/etc/apache2/sites-available/#{sitename}.conf" do

{{< /file-excerpt >}}


    The `action :nothing` directive means the resource will wait to be called on. Add it to the *template* resource code to use it, **above** the previous `notifies` line:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
notifies :run, "execute[enable-sites]"

{{< /file-excerpt >}}


11. The paths referenced in the virtual hosts files need to be created. Once more, this is done with the *directory* resource, and should be added before the final `end` tag:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
directory "/var/www/html/#{sitename}/public_html" do
  action :create
end

directory "/var/www/html/#{sitename}/logs" do
  action :create
end

{{< /file-excerpt >}}



### Apache Configuration

With the virtual hosts files configured and your website enabled, you next want to configure Apache to efficiently run on your servers. Do this by enabling and configuring a multi-processing module (MPM), and editing `apache2.conf`.

The MPMs are all located in the `mods_available` directory of Apache. In this example the *event* MPM will be used, located at `/etc/apache2/mods-available/mpm_event.conf`. If we were planning on deploying to nodes of varying size we would create a template file to replace the original, which would allow for more customization of specific variables. In this instance, a *cookbook file* will be used to edit the file.

Cookbook files are static documents that are run against the document in the same locale on your servers -- if any changes are made, it makes a backup of the original file and replaces it with the new one.

1.  To create a cookbook file navigate to `files/default` from your cookbook's main directory.

        cd ~/chef-repo/cookbooks/lamp-stack/files/default/

2.  Create a file called `mpm_event.conf` and copy the MPM event configuration into it, changing any needed values:

    {{< file "~/chef-repo/cookbooks/lamp-stack/files/default/mpm_event.conf" aconf >}}
<IfModule mpm_event_module>
        StartServers        2
        MinSpareThreads     6
        MaxSpareThreads     12
        ThreadLimit         64
        ThreadsPerChild     25
        MaxRequestWorkers   25
        MaxConnectionsPerChild  3000
</IfModule>

{{< /file >}}


3.  Return to `apache.rb`, and use the *cookbook_file* resource to call the file we just created. Because the MPM will need to be enabled, we'll use the `notifies` command again, this time to execute `a2enmod mpm_event`. Add this to the *end* of the `apache.rb` file:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
execute "enable-event" do
  command "a2enmod mpm_event"
  action :nothing
end

cookbook_file "/etc/apache2/mods-available/mpm_event.conf" do
  source "mpm_event.conf"
  mode "0644"
  notifies :run, "execute[enable-event]"
end

{{< /file-excerpt >}}


4.  Within the `apache2.conf` the `KeepAlive` value should be set to `off`, which is the only change made within the file. This can be altered through templates or cookbook files, although in this instance a simple `sed` command will be used, paired with the *execute* resource:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/apache.rb" ruby >}}
execute "keepalive" do
  command "sed -i 's/KeepAlive On/KeepAlive Off/g' /etc/apache2/apache2.conf"
  action :run
end

{{< /file-excerpt >}}


    Your `apache.rb` is now finished! An example of the final file is located [here](/docs/assets/apache.rb).


## MySQL

### Download the MySQL Library

1.  The Chef Supermarket has an OpsCode-maintained [MySQL cookbook](https://supermarket.chef.io/cookbooks/mysql) that sets up MySQL lightweight resources/providers (LWRPs) to be used. Download and install the cookbook:

        knife cookbook site install mysql

    This will also install any and all dependencies required to use the cookbook. These dependencies include the `smf` and `yum-mysql-community` cookbooks, which in turn depend on the `rbac` and `yum` cookbooks.

2.  Upload these cookbooks to the server:

        knife cookbook upload mysql --include-dependencies

3.  From the main directory of your LAMP stack cookbook, open the `metadata.rb` file and add a dependency to the MySQL cookbook:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/metadata.rb" >}}
depends          'mysql', '~> 6.0'

{{< /file-excerpt >}}


    {{< note >}}
Check the MySQL Cookbook's [Supermarket page](https://supermarket.chef.io/cookbooks/mysql) to ensure this is the latest version.
{{< /note >}}

### Create and Encrypt Your MySQL Password

Chef contains a feature knows as *data bags*. Data bags store information, and can be encrypted to store passwords, and other sensitive data.

1.  Generate a secret key:

        openssl rand -base64 512 > ~/chef-repo/.chef/encrypted_data_bag_secret

2.  Upload this key to your node's `/etc/chef` directory, either manually by `scp` (an example can be found in the [Setting Up Chef](/docs/applications/chef/setting-up-chef-ubuntu-14-04#add-the-rsa-private-keys) guide), or through the use of a recipe and cookbook file.

3.  Create a `mysql` data bag that will contain the file `rtpass.json` for the root password:

        knife data bag create mysql rtpass.json --secret-file ~/chef-repo/.chef/encrypted_data_bag_secret

    You will be asked to edit the `rtpass.json` file:

    {{< file "~/chef-repo/data_bags/mysql/rtpass.json" json >}}
{
  "id": "rtpass2.json",
  "password": "password123"
}

{{< /file >}}


    Replace `password123` with a secure password.

4.  Confirm that the `rtpass.json` file was created:

        knife data bag show mysql

    It should output `rtpass.json`. To ensure that is it encrypted run:

        knife data bag show mysql rtpass.json

    The output will be unreadable due to encryption, and should resemble:

        WARNING: Encrypted data bag detected, but no secret provided for decoding.  Displaying encrypted data.
        id:       rtpass.json
        password:
          cipher:         aes-256-cbc
          encrypted_data: wpEAb7TGUqBmdB1TJA/5vyiAo2qaRSIF1dRAc+vkBhQ=

          iv:             E5TbF+9thH9amU3QmGxWmw==

          version:        1
        user:
          cipher:         aes-256-cbc
          encrypted_data: VLA00Wrnh9DrZqDcytvo0HQUG0oqI6+6BkQjHXp6c0c=

          iv:             6V+3ROpW9RG+/honbf/RUw==

          version:        1


### Set Up MySQL

With the MySQL library downloaded and an encrypted root password prepared, you can now set up the recipe to download and configure MySQL.

1.  Open a new file in `recipes` called `mysql.rb` and define the data bag that will be used:

    {{< file "~/chef-repo/cookbooks/lamp-stack/recipes/mysql.rb" ruby >}}
mysqlpass = data_bag_item("mysql", "rtpass.json")

{{< /file >}}


2.  Thanks to the LWRPs provided through the MySQL cookbook, the initial installation and database creation for MySQL can be done in one resource:

    {{< file "~/chef-repo/cookbooks/lamp-stack/recipes/mysql.rb" ruby >}}
mysqlpass = data_bag_item("mysql", "rtpass.json")

mysql_service "mysqldefault" do
  initial_root_password mysqlpass["password"]
  action [:create, :start]
end

{{< /file >}}


    `mysqldefault` is the name of the MySQL service for this container. The `inital_root_password` calls to the value defined in the text above, while the action creates the database and starts the MySQL service.

    {{< note >}}
When running MySQL from your nodes you will need to define the socket:

mysql -S /var/run/mysqldefault/mysqld.sock -p
{{< /note >}}

## PHP

1.  Under the recipes directory create a new file, `php.rb`. The commands below will install PHP and all the required packages for working with Apache and MySQL:

    {{< file "~/chef-repo/cookbooks/lamp-stack/recipes/php.rb" ruby >}}
package "php5" do
  action :install
end

package "php-pear" do
  action :install
end

package "php-mysql" do
  action :install
end

{{< /file >}}


2.  For easy configuration the `php.ini` file will be created and used as a cookbook file, much like the MPM module above. You can either:

     - Add the PHP recipe, run the chef-client, and copy the file from a node (located in `/etc/php5/apache2/php.ini`), or:
     - Copy it from [here](/docs/assets/chef_php.ini). The file should be moved to the `chef-repo/cookbooks/lamp-stack/files/default/` directory. This can also be turned into a template, if that better suits your configuration.

3.  `php.ini` is a large file. Search and edit the following values to best suit your Linodes. The values suggested below are for 2GB Linodes:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/files/default/php.ini" php >}}
max_execution_time = 30
memory_limit = 128M
error_reporting = E_COMPILE_ERROR|E_RECOVERABLE_ERROR|E_ERROR|E_CORE_ERROR
display_errors = Off
log_errors = On
error_log = /var/log/php/error.log
register_globals = Off
max_input_time = 30

{{< /file-excerpt >}}


4.  Return to `php.rb` and add the cookbook file to the recipe:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/php.rb" ruby >}}
cookbook_file "/etc/php5/apache2/php.ini" do
  source "php.ini"
  mode "0644"
  notifies :restart, "service[apache2]"
end

{{< /file-excerpt >}}


5.  Because of the changes made to `php.ini`, a `/var/log/php` directory needs to be made and its ownership set to the Apache user. This is done through a `notifies` command and *execute* resource, as done previously:

    {{< file-excerpt "~/chef-repo/cookbooks/lamp-stack/recipes/php.rb" ruby >}}
execute "chownlog" do
  command "chown www-data /var/log/php"
  action :nothing
end

directory "/var/log/php" do
  action :create
  notifies :run, "execute[chownlog]"
end

{{< /file-excerpt >}}


    The PHP recipe is now done! View an example of the `php.rb` file [here](/docs/assets/php.rb).

6. Ensure that your Chef server contains the updated cookbook, and your node's run list is up-to-date:

        knife cookbook upload lamp-stack
        knife node run_list add nodename "recipe[lamp-stack],recipe[lamp-stack::apache],recipe[lamp-stack::mysql],recipe[lamp-stack::php]"

Congratulations! You have just created a LAMP Stack cookbook. Through this guide, you should have learned to use the execute, package, service, node, directory, template, cookbook_file, and mysql_service resources within a recipe, as well as download and use LWRPs, create encrypted data bags, upload/update your cookbooks to the server, and use attributes, templates, and cookbook files, giving you a strong basis in Chef and cookbook creation for future projects.
