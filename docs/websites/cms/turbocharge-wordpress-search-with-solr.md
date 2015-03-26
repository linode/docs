---
author:
  name: Linode Community
  email: docs@linode.com
description: 'Turbocharge your WordPress blog search using Solr search engine.'
keywords: 'wordpress,search,solr,ubuntu,debian'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
contributor:
    name: Karthik Shiraly
modified: Thursday, March 26, 2015
modified_by:
  name: James Stewart
published: 'Thursday, March 26, 2015'
title: 'Turbocharge your WordPress blog search using Solr search engine'
---

#Introduction
The standard search that is built into WordPress does not really provide a great search experience to your visitors.  For example:

+ It does not suggest useful search phrases while your visitor is typing a search phrase.

+ It doesn't catch any inadvertent typos in a search phrase or suggest corrections.

+ It doesn't understand word variations. For example, if your posts have the word *motivation* but your visitor searches for *motivate*, WordPress does not show those posts in search results.

+ It doesn't help visitors organize and filter search results. This is a problem if your WordPress is a shopping site or a book site or other content heavy site that needs categorization and filtering of results.

+ If your WordPress hosts documents  such as business proposals, financial statements, or design documents in PDF,  Word, Excel or other common format, standard search doesn't search inside those documents.

You can overcome all these shortcomings using a piece of software known as a *full text search engine*. **Apache Solr** is one of the most powerful, mature and configurable full text search engines available, with an [excellent pedigree](http://en.wikipedia.org/wiki/Apache_Solr#History) and [good enterprise adoption](http://lucidworks.com/blog/who-uses-lucenesolr/). Best of all, it's free and open source!

In this guide, you will learn how to install Java, install and configure Solr on Ubuntu or Debian, and integrate it into your WordPress blog using the WPSolr plugin.

Let's get started!

# Prerequisites
+ This article is written for Debian 7.x and Ubuntu 14.x. Some steps may not work on older OS versions.

+ WordPress is already installed and configured. If you are installing WordPress newly, follow the [Manage Web Content with WordPress guide](https://www.linode.com/docs/websites/cms/manage-web-content-with-wordpress).

+ Most of this guide assumes that Solr is being installed on the same server as WordPress. However, for scalability or security reasons, you may want to install Solr on a second server. This is doable, and if any special actions need to be taken for such a distributed installation, the guide mentions them in appropriate sections.

+ This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.


## Install Java

Since Solr is a java web application, it requires a *JRE (Java Runtime Environment)* to be installed. Oracle's JRE or OpenJDK's JRE are the most common. 

First, check if java is already installed on your server using the following commands. If they don't show the path of java executable or its version, then java is not installed. If they do show the correct information, then you can skip the rest of this section and proceed to next section.

    whereis java
    java -version

In this guide, you'll learn how to install OpenJDK 7 JRE. OpenJDK 8 JRE too is fine, if it's available in update packages. If you prefer Oracle's JRE, follow installation instructions on [Oracle's JRE download site](http://www.oracle.com/technetwork/articles/javase/index-jsp-138363.html).

1. Install the package **openjdk-7-jre-headless** from update packages:

        sudo apt-get install openjdk-7-jre-headless

    “openjdk-7-jre” package is also acceptable, but it unnecessarily consumes about 3 times the disk space as the headless version.

2. After JRE is installed, test it by typing this:

        java -version


    If it's working correctly, it should produce output like this:

        java version "1.7.0_75"
        OpenJDK Runtime Environment (IcedTea 2.5.4) (7u75-2.5.4-1~deb7u1)
        OpenJDK 64-Bit Server VM (build 24.75-b04, mixed mode)


## Install unzip, curl and php5-curl
1. Install the **unzip** package to help us extract downloaded files later on.

        sudo apt-get install unzip

2. Install the **curl** and **php5-curl** package required by the WPSolr plugin.

        sudo apt-get install curl php5-curl



3. It's recommended to restart the HTTP server on which WordPress is hosted after installing curl and php5-curl.
To restart an apache server after installing curl:

        sudo service apache2 restart

# Install and Configure Solr

## Download Solr
For downloading the latest Solr package, follow these steps:

1. Open [Solr download site](http://www.apache.org/dyn/closer.cgi/lucene/solr/) in your browser.

2. You will see a link similar to the one shown below from where you can download Solr. The link may be different for you depending on your country and location.


    [![Selecting an Apache download mirror site](/docs/assets/wpsolr_select_apache_mirror_resized.png)](/docs/assets/wpsolr_select_apache_mirror.png)


3. Click the link to open a page where all Solr releases are listed:


    [![List of Solr releases](/docs/assets/wpsolr_mirror_directory_listing_resized.png)](/docs/assets/wpsolr_mirror_directory_listing.png)

4. Click on the highest available 4.x version, to see the files in that release:
    {: .note}
    > Since Solr 5.x is still in beta, its configuration procedures are quite different from 4.x and WPSolr is not yet compatible with it, it is recommended to not install 5.x but only the highest available 4.x version.

    ![Solr release directory listing](/docs/assets/wpsolr_directory_files.png)

5. Copy the link address of the file named **solr-&lt;version&gt;.tgz**.

6. On your server, download that file into your home directory using **wget** command and paste the link address. For example:


        wget http://apache.bytenet.in/lucene/solr/4.10.3/solr-4.10.3.tgz


## Install Solr

We will install solr under the /opt directory, since that's where add-on softwares are normally installed.

    sudo tar -C /opt -xzvf solr-4.10.3.tgz

This will install all files from the archive into /opt/solr-4.10.3 directory. 


## Install WPSolr configuration files

For Solr to index blog posts, it needs to know the structure of the blog data. This structure is described in Solr configuration files.

1. WPSolr provides ready-made configuration files on their website. 
Visit the [WPSolr website](http://wpsolr.com/releases/) and get the link address of the latest WPSolr release for your Solr version, as shown below:

    [![WPSolr Configuration Download](/docs/assets/wpsolr_wpsolr_config_download_resized.png)](/docs/assets/wpsolr_wpsolr_config_download.png)

2. The copied address will look something like [http://wpsolr.com/?wpdmdl=2064](http://wpsolr.com/?wpdmdl=2064).

3. Next, in the ssh session to the Linode server where you're installing Solr, use wget command to download the  file from copied address and save it as **wpsolr_config.zip**.

        wget -O wpsolr_config.zip &lt;copied-url&gt;

    For example:

        wget -O wpsolr_config.zip  http://wpsolr.com/?wpdmdl=2064


4. Extract wpsolr_config.zip:

        unzip wpsolr_config.zip


5. Copy two of the extracted files – **schema.xml** and **solrconfig.xml** - into **/opt/solr-4.10.3/example/solr/collection1/conf**. Backup the original files before copying.

        # Backup the original config files
        sudo cp /opt/solr-4.10.3/example/solr/collection1/conf/schema.xml /opt/solr-4.10.3/example/solr/collection1/conf/schema.xml.original

        sudo cp /opt/solr-4.10.3/example/solr/collection1/conf/solrconfig.xml  /opt/solr-4.10.3/example/solr/collection1/conf/solrconfig.xml.original

        # And replace them with WPSolr's files.
        sudo cp schema.xml  /opt/solr-4.10.3/example/solr/collection1/conf/

        sudo cp solrconfig.xml  /opt/solr-4.10.3/example/solr/collection1/conf/



## Change IP address and port of Solr (optional)

By default, Solr listens for search requests on all IP addresses at port 8983. 

For security reasons, you may wish to change the IP address and/or port it listens on.  It's recommended that only your WordPress be able to query Solr, and prevent external parties from doing so.

The listening IP address and port are configured by changing **/opt/solr-4.10.3/example/etc/jetty.xml**. 

1. First, take a backup of it. 
    Then open it with a text editor like nano or vi. 

        sudo cp /opt/solr-4.10.3/example/etc/jetty.xml /opt/solr-4.10.3/example/etc/jetty.xml.backup

        sudo nano /opt/solr-4.10.3/example/etc/jetty.xml

2. Locate the section where listening host and port are set (highlighted below).

    ![Editing jetty.xml](/docs/assets/wpsolr_editing_jetty_xml.png)

3. Depending on whether you wish to install Solr on the same server as WordPress or a different one, an appropriate listening IP address should be set:

    + **If Solr is on same server as WordPress:**

        Find this line:

	        <Set name="host"><SystemProperty name="jetty.host" /></Set>

	    and change the value to localhost, as shown below:
	
            <Set name="host">localhost</Set>



  
    + **If Solr is on different server from WordPress:**

        Find this line:

	        <Set name="host"><SystemProperty name="jetty.host" /></Set>

	    and change the value to the private IP address or FQDN hostname of Solr server, as shown below:
	
            <Set name="host">192.168.12.3</Set>


## Create user account and user group for Solr

For server security, we will configure Solr to run with its own user account and group, so that we can keep a tight control on what resources it can read and write.

Run the following commands on the server where Solr is being installed.

1. Create a group named **solr**:

        sudo addgroup --system solr


2. Create a user named **solr**:

        sudo adduser --system --ingroup solr --home /opt/solr-4.10.3 --shell /bin/sh --disabled-password --disabled-login solr


3. Transfer ownership of installed Solr directory to this new user named **solr**:

        sudo chown -R solr:solr /opt/solr-4.10.3


## Configure Solr as a startup service

Run the following commands on the server where Solr is being installed.

1. Use a text editor to create a new script named solr under **/etc/init.d**:

        sudo nano /etc/init.d/solr

2. Copy this text into the editor, save it and close it:

    {: .note}
    > You may have to change the line "JETTY_HOME=/opt/solr-4.10.3/example" to match the Solr version you have downloaded and installed.

    {:.file }
    /etc/init.d/solr
    : ~~~ conf
      #!/bin/sh -e
      #
      # /etc/init.d/solr -- startup script for Apache Solr
      #
      #
      ### BEGIN INIT INFO
      # Provides:          solr
      # Required-Start:    $local_fs $remote_fs $network
      # Required-Stop:     $local_fs $remote_fs $network
      # Should-Start:      $named
      # Should-Stop:       $named
      # Default-Start:     2 3 4 5
      # Default-Stop:      0 1 6
      # Short-Description: Start Solr
      # Description:       Start Apache Solr jetty server
      ### END INIT INFO

      PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
      NAME=solr
      DESC="Solr search engine"
      JETTY_HOME=/opt/solr-4.10.3/example
      START_JAR="$JETTY_HOME/start.jar"

      if [ `id -u` -ne 0 ]; then
              echo "You need root privileges to run this script"
              exit 1
      fi

      # Make sure jetty is started with system locale
      if [ -r /etc/default/locale ]; then
              . /etc/default/locale
              export LANG
      fi

      . /lib/lsb/init-functions

      if [ -r /etc/default/rcS ]; then
              . /etc/default/rcS
      fi
            
      # Run Jetty as this user ID (default: jetty)
      # Set this to an empty string to prevent Jetty from starting automatically
      SOLR_USER=solr

      SOLR_GROUP=solr

      export JAVA="/usr/bin/java"

      # Extra options to pass to the JVM
      # Set java.awt.headless=true if JAVA_OPTIONS is not set so the
      # Xalan XSL transformer can work without X11 display on JDK 1.4+
      # It also sets the maximum heap size to 256M to deal with most cases.
      JAVA_OPTIONS="-Djava.awt.headless=true"

      # Timeout in seconds for the shutdown of all webapps
      JETTY_SHUTDOWN=30

      JETTY_STOP_PORT=17935
      JETTY_STOP_KEY=stopsolr
      JETTY_ARGS="-Djetty.home=$JETTY_HOME -DSTOP.PORT=$JETTY_STOP_PORT -DSTOP.KEY=$JETTY_STOP_KEY"

      # Define other required variables
      PIDFILE="/var/run/$NAME.pid"
      WEBAPPDIR="$JETTY_HOME/webapps"

      ##################################################
      # Do the action
      ##################################################
      case "$1" in
        start)
              log_daemon_msg "Starting $DESC." "$NAME"
              if start-stop-daemon --quiet --test --start --pidfile "$PIDFILE" \
                              --user "$SOLR_USER" --group "$SOLR_GROUP" --startas "$JAVA" > /dev/null; then

                      if [ -f $PIDFILE ] ; then
                              log_warning_msg "$PIDFILE exists, but solr was not running. Ignoring $PIDFILE"
                      fi

                      start-stop-daemon --start --pidfile "$PIDFILE" --chuid "$SOLR_USER:$SOLR_GROUP" \
                          --chdir "$JETTY_HOME" --background --make-pidfile --startas $JAVA -- \
                          $JAVA_OPTIONS $JETTY_ARGS -jar $START_JAR --daemon

                      log_daemon_msg "$DESC started" "$NAME"

                      sleep 5
                      if start-stop-daemon --test --start --pidfile "$PIDFILE" \
                              --user $SOLR_USER --group $SOLR_GROUP  --startas "$JAVA" > /dev/null; then
                              log_end_msg 1
                      else
                              log_end_msg 0
                      fi

              else
                      log_warning_msg "(already running)."
                      log_end_msg 0
                      exit 1
              fi
              ;;

        stop)
              log_daemon_msg "Stopping $DESC." "$NAME"

              if start-stop-daemon --quiet --test --start --pidfile "$PIDFILE" \
                      --user "$SOLR_USER" --group "$SOLR_GROUP" --startas "$JAVA" > /dev/null; then
                      if [ -x "$PIDFILE" ]; then
                              log_warning_msg "(not running but $PIDFILE exists)."
                      else
                              log_warning_msg "(not running)."
                      fi
              else
                      start-stop-daemon --quiet --stop \
                              --pidfile "$PIDFILE" --user "$SOLR_USER" --group "$SOLR_GROUP" \
                              --startas $JAVA -- $JAVA_OPTIONS $JETTY_ARGS -jar $START_JAR --stop > /dev/null

                      while ! start-stop-daemon --quiet --test --start \
                                --pidfile "$PIDFILE" --user "$SOLR_USER" --group "$SOLR_GROUP" \
                                --startas "$JAVA" > /dev/null; do
                              sleep 1
                              log_progress_msg "."
                              JETTY_SHUTDOWN=`expr $JETTY_SHUTDOWN - 1` || true
                              if [ $JETTY_SHUTDOWN -ge 0 ]; then
                                      start-stop-daemon --oknodo --quiet --stop \
                                              --pidfile "$PIDFILE" --user "$SOLR_USER" --group "$SOLR_GROUP" \
                                              --startas $JAVA -- $JAVA_OPTIONS $JETTY_ARGS -jar $START_JAR --stop
                              else
                                      log_progress_msg " (killing) "
                                      start-stop-daemon --stop --signal 9 --oknodo \
                                              --quiet --pidfile "$PIDFILE" \
                                              --user "$SOLR_USER" --group "$SOLR_GROUP"
                              fi
                      done
                      rm -f "$PIDFILE"
                      log_daemon_msg "$DESC stopped." "$NAME"
                      log_end_msg 0
              fi
              ;;

        status)
              if start-stop-daemon --quiet --test --start --pidfile "$PIDFILE" \
                      --user "$SOLR_USER" --group "$SOLR_GROUP" --startas "$JAVA" > /dev/null; then

                      if [ -f "$PIDFILE" ]; then
                          log_success_msg "$DESC is not running, but pid file exists."
                              exit 1
                      else
                          log_success_msg "$DESC is not running."
                              exit 3
                      fi
              else
                      log_success_msg "$DESC is running with pid `cat $PIDFILE`"
              fi
              ;;

        restart|force-reload)
              if ! start-stop-daemon --quiet --test --start --pidfile "$PIDFILE" \
                      --user "$SOLR_USER" --group "$SOLR_GROUP" --startas "$JAVA" > /dev/null; then
                      $0 stop $*
                      sleep 1
              fi
              $0 start $*
              ;;

        try-restart)
              if start-stop-daemon --quiet --test --start --pidfile "$PIDFILE" \
                      --user "$SOLR_USER" --group "$SOLR_GROUP" --startas "$JAVA" > /dev/null; then
                      $0 start $*
              fi
              ;;

        *)
            log_success_msg "Usage: $0 {start|stop|restart|force-reload|try-restart|status}"
              exit 1
              ;;
      esac

      exit 0
      ~~~

3. After saving the script, run these commands on the server where Solr is being installed:

        sudo chmod ugo+x /etc/init.d/solr

        sudo update-rc.d  solr defaults

        sudo update-rc.d  solr enable

        sudo service solr start


# Test Solr

Run the following command on the server where Solr is being installed.

    curl http://localhost:8983/solr/collection1/select 

If it shows output like this, Solr is installed and configured correctly:

    <?xml version="1.0" encoding="UTF-8"?>
    <response>
        <lst name="responseHeader">
            <int name="status">0</int>
            <int name="QTime">8</int>
            <lst name="params"/>
        </lst>
        <result name="response" numFound="0" start="0"></result>
    </response>


If Solr is installed on a different server from WordPress, repeat the test from the WordPress server machine by sending a request to the Solr server machine:

	curl http://HOSTNAME-OR-IP-OF-SOLR-SERVER:8983/solr/collection1/select


## Install WPSolr plugin

1. Go to the plugin's page at [https://wordpress.org/plugins/wpsolr-search-engine/](https://wordpress.org/plugins/wpsolr-search-engine/) and copy its link address as shown below:

    [![WPSolr plugin link](/docs/assets/wpsolr_wpsolr_plugin_link_resized.png)](/docs/assets/wpsolr_wpsolr_plugin_link.png)

2. Next, in the ssh session to the Linode server where you're installing Solr, use **wget** command to download the plugin file from copied address.

        wget <copied-url>

    For example:

        wget https://downloads.wordpress.org/plugin/wpsolr-search-engine.1.8.zip

3. Extract the zip file:

        unzip wpsolr-search-engine.1.8.zip

4. Move the extracted plugin directory to WordPress plugins directory:

    + On Debian:

            mv wpsolr-search-engine /var/www/wordpress/wp-content/plugins/

    + On Ubuntu:
 
            mv wpsolr-search-engine /var/www/html/wordpress/wp-content/plugins/

5. Next, log into WordPress Administration page and go to **Installed Plugins** page:

    [![Installed Plugins](/docs/assets/wpsolr_admin_goto_plugins_resized.png)](/docs/assets/wpsolr_admin_goto_plugins.png)

6. In the **Plugins** page, activate the plugin named **Enterprise Search in seconds**:

    [![Activate WPSolr plugin](/docs/assets/wpsolr_activate_wpsolr_plugin_resized.png)](/docs/assets/wpsolr_activate_wpsolr_plugin.png)

7. WordPress then displays a **plugin activated** message and adds a **WPSOLR** menu item to the sidebar:

    [![After WPSolr activation](/docs/assets/wpsolr_after_plugin_activation_resized.png)](/docs/assets/wpsolr_after_plugin_activation.png)


## Configure WPSolr plugin

1. Open WPSolr plugin page.

    [![WPSolr admin page](/docs/assets/wpsolr_open_wpsolr_admin_resized.png)](/docs/assets/wpsolr_open_wpsolr_admin.png)

2. Click on the button **I uploaded my 2 compatible configuration files to my Solr core**:

    ![WPSolr first configuration](/docs/assets/wpsolr_wpsolr_solr_config_tab_firsttime.png)


3. In the next page, select **Self Hosted** option:

    [![WPSolr Hosting tab](/docs/assets/wpsolr_wpsolr_hosting_tab_resized.png)](/docs/assets/wpsolr_wpsolr_hosting_tab.png)

4. On selecting **Self Hosted**, the plugin prompts you to enter details about your Solr server:

    [![WPSolr self hosting settings](/docs/assets/wpsolr_wpsolr_hosting_tab_settings_resized.png)](/docs/assets/wpsolr_wpsolr_hosting_tab_settings.png)

    + **Solr Host**

        + This should be the same value as the host you typed in /etc/jetty.xml.

        + If Solr is installed on same server as WordPress, enter localhost.

        + If Solr is installed on a different server, enter the same IP address or hostname that you typed in /etc/jetty.xml.


    + **Solr Port**

        + This should be the same value as the port you typed in /etc/jetty.xml.


    + **Solr Path**


        + Set this value to **/solr/collection1**, since we are using the default Solr core. However, this is configurable since a Solr server can run multiple Solr cores, each core serving a different set of search data. For more information on Solr cores, go through the [Solr Core wiki](https://wiki.apache.org/solr/CoreAdmin).

5. Press the **Check Solr Status, then Save** button. If everything is set correctly, it'll show a green tick mark.

6. The plugin then takes you to the **Indexing Options** page:

    [![WPSolr Indexing Options](/docs/assets/wpsolr_wpsolr_indexing_options_resized.png)](/docs/assets/wpsolr_wpsolr_indexing_options.png)

    + **Post types to be Indexed**

        + It's recommended to select all of them. 

        + **post**: Select this to search in all blog posts.

        + **page**: Select this to search pages. If the only pages in your blog are things like About page or Contact page, then you probably don't want to select this to avoid polluting the search results with irrelevant data.

        + **attachment**: Select this if you want Solr to search in PDF, DOC, XLS and other attachments.

    + **Custom taxonomies to be indexed** [Advanced option] 

        Generally there is no need to enter anything here. However, if your Wordpress has been customized to organize blog posts in ways other than categories and tags, then you should enter the name of the taxonomy here.


    + **Custom fields to be indexed** [Advanced option] 

        Generally there is no need to select anything here. 


    + **Index Comments**

        Select this if you want search results to include matching comments. This is suitable only for blogs where comments generally add some value to the post and are rigorously moderated.


    + **Exclude Items** [Advanced option] 

        If you want some posts or pages to be excluded from search results, enter their IDs here. 

        For example, if you want all pages except **About** page to be included in search results, enter the page ID of **About** page here.

7. Press the **Save Options** button.

8. Next, open the **Solr Options > Result Options** page:

    [![WPSolr Result Options](/docs/assets/wpsolr_wpsolr_result_options_resized.png)](/docs/assets/wpsolr_wpsolr_result_options.png)

    + **Display Suggestions (Did you mean?)**

        Recommended. If you select this, Solr will suggest alternate search phrases if it doesn't find any matches for entered search phrase, as shown below:

        ![WPSolr Suggestions](/docs/assets/wpsolr_search_results_did_you_mean_small.png)

    + **Display number of results and current page**

        Recommended. This is useful for paginating search results. 

    + **Replace default WordPress search**

        Recommended. This replaces the default WordPress search box with one that uses Solr to show autocompletion suggestions.

    + **No. of results per page**
  
        Configure how many search results should be shown per page.

    + **No. of values to be displayed by facets**

        Facets refer to the filters that Solr shows to enable visitors to shortlist from search results. 

        This value is the maximum number of values shown for each facet.

        For example, in the image below, this value has been set to 5 so that the Tags facet shows a maximum of 5 tag filters.
        ![Facet count](/docs/assets/wpsolr_search_results_facet_count.png)

9. Press the **Save Options** button.

10. Next, open the **Solr Options > Facets Options** page:

    [![WPSolr Facet Options](/docs/assets/wpsolr_wpsolr_facet_options_resized.png)](/docs/assets/wpsolr_wpsolr_facet_options.png)

    + Press the little green "+" buttons to add a facet. The ones added here are shown as filters in the search results page.
 
    + Generally, **categories** and **tags** are enough. 

    + If the blog has multiple contributors, you may also want to add **author** as a facet.

    + If the blog has custom taxonomies other than categories and tags, you may want to add them too as facets.

    + In the example below, Author, Categories and Tags are shown as filters since only those three have been added as facets:

    [![WPSolr Faceting](/docs/assets/wpsolr_search_results_facets_resized.png)](/docs/assets/wpsolr_search_results_facets.png)

11. Next, go to **Solr Operations** tab and click the **Load documents incrementally in the Solr index** button. 

    Whenever you publish a new post or page or attachment, come to this page and click this button to update the search data.

    ![Solr Operations](/docs/assets/wpsolr_wpsolr_solr_operations.png)

    After the operation has completed, the same page displays how many documents were indexed.


## Testing the new search

Now visit your blog site and refresh the page.

1. **Test autocompletion**

    Start typing a word you know is in one of your blog posts. As you are typing, the search box should display some suggestions in a dropdown, as shown below:
    
    ![Autocompletion](/docs/assets/wpsolr_search_box_suggestions.png)


2. **Test search results**

    Enter some search phrase. Matching results should be displayed as shown below.

    [![Search Results](/docs/assets/wpsolr_search_results_resized.png)](/docs/assets/wpsolr_search_results.png)


3. **Test autocorrection suggestions**

    Enter a word with some spelling mistakes, or a word that does not occur in any of your blog posts. It should show useful **Did you mean** suggestions, as shown below:

    [![Did you mean suggestions](/docs/assets/wpsolr_search_results_did_you_mean_resized.png)](/docs/assets/wpsolr_search_results_did_you_mean.png)


4. **Test document search**

    + Create some test posts, add PDF / DOC / XLS / other file attachments to them, and publish them.

    + Update the search data by opening **WordPress Admin > WPSOLR > Solr Operations** and clicking **Load documents incrementally in the Solr index**.  It should display count of newly published posts.

    + Now go to the blog site and enter a search phrase which you know occurs in your PDF, DOC, XLS or other attachment. It should display matches inside those attachments, as shown below:

        [![Document search results](/docs/assets/wpsolr_search_results_from_doc_pdf_resized.png)](/docs/assets/wpsolr_search_results_from_doc_pdf.png)


## Updating the search engine

Whenever you publish a new post, go to **Administration dashboard > WPSOLR > Solr Operations** and press the **Load documents incrementally in the Solr index** button to update the search engine with new post.

## Location of search data

Search engine data is stored in **/opt/solr-4.10.3/example/solr/collection1/data** directory. 

## Backup or restore search data

If you have a data backup procedure for your server, you can optionally backup search data too by including **/opt/solr-4.10.3/example/solr/collection1/data** directory in the backup. 

Generally, backup of search data is not critical, since it can always be recreated from the WordPress database. However, for very large blogs with thousands of posts and attachments, backing up and restoring search data will be much faster than recreating it newly.

On the other hand, when migrating or merging a blog from another WordPress server, the recommended approach is to *recreate* search data newly. 

After a migration or merger, go to **Administration dashboard > WPSOLR > Solr Operations** and press the **Load documents incrementally in the Solr index** to recreate all the search data.

