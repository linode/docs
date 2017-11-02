---
author:
    name: Karthik Shiraly
    email: docs@linode.com
description: 'Turbocharge your WordPress blog search using Solr search engine.'
keywords: ["wordpress", "search", "solr", "ubuntu", "debian"]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
contributor:
    name: Karthik Shiraly
    link: https://twitter.com/pathbreaksoft
modified: 2015-04-03
modified_by:
    name: James Stewart
published: 2015-04-03
title: 'Turbocharge Your WordPress Search Using Solr'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>

The standard search that is built into WordPress does not provide the best search experience you can offer your visitors, given its inability to suggest search phrases, catch typos, understand word variations, organize and filter results, and index documents for search results. *Full text search engines* often offer these features and **Apache Solr** is a free, open-source option that does.

In this guide, you will learn how to install Java, install and configure Solr on Ubuntu 14.x or Debian 7.x, and integrate it into your WordPress blog using the WPSolr plugin.

{{< note >}}
This guide is written for a non-root user. Commands that require elevated privileges are prefixed with `sudo`. If you're not familiar with the `sudo` command, you can check our [Users and Groups](/docs/tools-reference/linux-users-and-groups) guide.
{{< /note >}}

## Prerequisites

-   WordPress must be already installed and configured. If you have not yet installed WordPress, follow the [Manage Web Content with WordPress](/docs/websites/cms/manage-web-content-with-wordpress) guide.

-   Much of this guide assumes that Solr is being installed on the same server as WordPress; however, Solr can be installed on a second server for security or scalibility reasons. Alternate steps are provided should Solr be installed on a second server.


## Install Java

Since Solr is a Java web application, it requires a *Java Runtime Environment (JRE)*.

1.  Check if Java is already installed on your server using the following commands:

        whereis java
        java -version

    If Java is already installed, it will output the path of the executable Java file and the Java version that is being run. Skip to the [next step](#install-unzip-curl-and-php5-curl).

2.  Install the `openjdk-7-jre-headless` package:

        sudo apt-get install openjdk-7-jre-headless

3.  After the JRE is installed, test it by checking the version:

        java -version

    If it's working correctly, it should produce similar output:

        java version "1.7.0_75"
        OpenJDK Runtime Environment (IcedTea 2.5.4) (7u75-2.5.4-1~deb7u1)
        OpenJDK 64-Bit Server VM (build 24.75-b04, mixed mode)


## Install unzip, curl and php5-curl

1.  Install the `unzip`, `curl`, and `php5-curl` packages:

        sudo apt-get install unzip curl php5-curl

2.  Restart the HTTP server where WordPress is hosted:

        sudo service apache2 restart

## Install and Configure Solr

### Download and Install Solr

1.  Open the [Solr download site](http://www.apache.org/dyn/closer.cgi/lucene/solr/) in your browser.

2.  Apache will provide a download link based on location:

    [![Selecting an Apache download mirror site](/docs/assets/wpsolr_select_apache_mirror_resized.png)](/docs/assets/wpsolr_select_apache_mirror.png)

3.  Click the link to open a page of Solr releases:

    [![List of Solr releases](/docs/assets/wpsolr_mirror_directory_listing_resized.png)](/docs/assets/wpsolr_mirror_directory_listing.png)

4.  Click on the highest available 4.x version to see the files in that release:

    {{< note >}}
Since Solr 5.x is still in beta, its configuration procedures are different from 4.x, and WPSolr is not yet compatible with the 5.x release.
{{< /note >}}

    ![Solr release directory listing](/docs/assets/wpsolr_directory_files.png)

5.  Copy the link address for the non-source `.tgz` file.

6.  On your Linode, download that file into your home directory using the `wget` command:

        cd ~
        wget http://apache.bytenet.in/lucene/solr/4.10.4/solr-4.10.4.tgz

7.  Install Solr under the `/opt` directory:

        sudo tar -C /opt -xzvf solr-4.10.4.tgz


### Install WPSolr Configuration Files

For Solr to index blog posts, it needs to know the structure of the blog data. This structure is described in Solr configuration files.

1.  WPSolr provides ready-made configuration files on their website.
Visit the [WPSolr website](http://wpsolr.com/releases/) and get the link address of the latest WPSolr release for your Solr version:

    [![WPSolr Configuration Download](/docs/assets/wpsolr_wpsolr_config_download_resized.png)](/docs/assets/wpsolr_wpsolr_config_download.png)

    The copied address will look similar to `http://wpsolr.com/?wpdmdl=2064`.

2.  On the server where Solr is installed, use the `wget` command to download the file from copied address and save it as `wpsolr_config.zip`.

        wget -O wpsolr_config.zip http://wpsolr.com/?wpdmdl=2064


3.  Extract `wpsolr_config.zip`:

        unzip wpsolr_config.zip


4.  Copy `schema.xml` and `solrconfig.xml` into `/opt/solr-4.10.4/example/solr/collection1/conf`. Back up the original files before copying:

        sudo cp /opt/solr-4.10.4/example/solr/collection1/conf/schema.xml /opt/solr-4.10.4/example/solr/collection1/conf/schema.xml.original
        sudo cp /opt/solr-4.10.4/example/solr/collection1/conf/solrconfig.xml  /opt/solr-4.10.4/example/solr/collection1/conf/solrconfig.xml.original
        sudo cp schema.xml  /opt/solr-4.10.4/example/solr/collection1/conf/
        sudo cp solrconfig.xml  /opt/solr-4.10.4/example/solr/collection1/conf/



### Change the IP Address and Port of Solr (Optional)

By default, Solr listens for search requests on all IP addresses at port 8983. For security reasons, you may wish to change the IP address and/or port it listens on. It is also recommended that only WordPress be able to query Solr.

1.  First, make a back up of `/opt/solr-4.10.4/example/etc/jetty.xml`. Then, open the file in a text editor:

        sudo cp /opt/solr-4.10.4/example/etc/jetty.xml /opt/solr-4.10.4/example/etc/jetty.xml.backup

2.  Locate the section where listening host and port are set:

    {{< file-excerpt "/opt/solr-4.10.4/example/etc/jetty.xml" >}}
<!--
    <Call name="addConnector">
      <Arg>
          <New class="org.eclipse.jetty.server.nio.SelectChannelConnector">
            <Set name="host"><SystemProperty name="jetty.host" /></Set>
            <Set name="port"><SystemProperty name="jetty.port" default="8983"/></Set>
            <Set name="maxIdleTime">50000</Set>
            <Set name="Acceptors">2</Set>
            <Set name="statsOn">false</Set>
            <Set name="confidentialPort">8443</Set>
            <Set name="lowResourcesConnections">5000</Set>
            <Set name="lowResourcesMaxIdleTime">5000</Set>
          </New>
      </Arg>
    </Call>
-->

{{< /file-excerpt >}}


3.  Set the appropriate listening IP address:

    -   If Solr is on the **same** server as WordPress, replace `<Set name="host"><SystemProperty name="jetty.host" /></Set>` with:

            <Set name="host">localhost</Set>

    -   If Solr is on a **different** server from WordPress, replace `<Set name="host"><SystemProperty name="jetty.host" /></Set>` with:

            <Set name="host">123.45.67.89</Set>

        Replace `123.45.67.89` with your own private IP or FQDN.


### Create a User Account and User Group for Solr

For security purposes, Solr should run with its own user account and group.

{{< note >}}
The following commands should be run on the server where **Solr** is installed.
{{< /note >}}

1.  Create a group named `solr`:

        sudo addgroup --system solr


2.  Create a user named `solr`:

        sudo adduser --system --ingroup solr --home /opt/solr-4.10.4 --shell /bin/sh --disabled-password --disabled-login solr


3.  Transfer ownership of the Solr directory to the user `solr`:

        sudo chown -R solr:solr /opt/solr-4.10.4


### Configure Solr as a Startup Service

{{< note >}}
Run the following commands on the server where **Solr** is installed.
{{< /note >}}

1.  Use a text editor to create a new script `/etc/init.d/solr`.  Alternatively, you can download it from [this link](/docs/assets/solr):

        sudo nano /etc/init.d/solr

2.  Copy the following text into the editor, save and close it:

    {{< note >}}
If using a different version of Solr, change the `JETTY_HOME=/opt/solr-4.10.4/example` line to match the installed version.
{{< /note >}}

    {{< file "/etc/init.d/solr" >}}
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
JETTY_HOME=/opt/solr-4.10.4/example
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

{{< /file >}}


3.  After saving the script, run the following commands:

        sudo chmod ugo+x /etc/init.d/solr
        sudo update-rc.d  solr defaults
        sudo update-rc.d  solr enable
        sudo service solr start


## Test Solr

Run the following command on the server where Solr is installed:

    curl http://localhost:8983/solr/collection1/select

If it shows similar output, Solr is installed and configured correctly:

    <?xml version="1.0" encoding="UTF-8"?>
    <response>
    <lst name="responseHeader"><int name="status">0</int><int name="QTime">1</int><lst name="params"/></lst><result name="response" numFound="0" start="0"></result>
    </response>

If Solr is installed on a different server from WordPress, repeat the test from the WordPress server by sending a request to the Solr server:

	curl http://HOSTNAME-OR-IP-OF-SOLR-SERVER:8983/solr/collection1/select


## Install and Configure WPSolr

### Install the WPSolr Plugin

1.  Install the [WPSolr](https://wordpress.org/plugins/wpsolr-search-engine/) WordPress plugin, either through your WordPress admin console or by downloading the files into your `plugins/` directory.


2.  On the **Plugins** page, activate the plugin named **Enterprise Search in seconds**:

    [![Activate WPSolr plugin](/docs/assets/wpsolr_activate_wpsolr_plugin_resized.png)](/docs/assets/wpsolr_activate_wpsolr_plugin.png)

3.  WordPress then displays a *plugin activated* message and adds a **WPSOLR** menu item to the sidebar:

    [![After WPSolr activation](/docs/assets/wpsolr_after_plugin_activation_resized.png)](/docs/assets/wpsolr_after_plugin_activation.png)


### Configure WPSolr Plugin

1.  Open WPSolr page:

    [![WPSolr admin page](/docs/assets/wpsolr_open_wpsolr_admin_resized.png)](/docs/assets/wpsolr_open_wpsolr_admin.png)

2.  Click on the button **I uploaded my 2 compatible configuration files to my Solr core**:

    ![WPSolr first configuration](/docs/assets/wpsolr_wpsolr_solr_config_tab_firsttime.png)


3.  On the next page, select **Self Hosted** option:

    [![WPSolr Hosting tab](/docs/assets/wpsolr_wpsolr_hosting_tab_resized.png)](/docs/assets/wpsolr_wpsolr_hosting_tab.png)

4.  When selecting **Self Hosted**, the plugin prompts you to enter details about the Solr server:

    [![WPSolr self hosting settings](/docs/assets/wpsolr_wpsolr_hosting_tab_settings_resized.png)](/docs/assets/wpsolr_wpsolr_hosting_tab_settings.png)

    -   **Solr Host**: This should be the same value as the host typed in `/opt/solr-4.10.4/example/etc/jetty.xml`. If Solr is installed on same server as WordPress, enter `localhost`. If Solr is installed on a different server, enter the same IP address or hostname.

    -   **Solr Port**: This should be the same value as the port typed in `/opt/solr-4.10.4/example/etc/jetty.xml`.

    -   **Solr Path**: Set this value to `/solr/collection1`, the default Solr core. The Solr server can run multiple Solr cores, each core serving a different set of search data. For more information on Solr cores, go through the [Solr Core wiki](https://wiki.apache.org/solr/CoreAdmin).

5.  Press the **Check Solr Status, then Save** button. If everything is set correctly, it will show a green tick mark.

6.  Click on the **Solr Options** tab:

    [![WPSolr Indexing Options](/docs/assets/wpsolr_wpsolr_indexing_options_resized.png)](/docs/assets/wpsolr_wpsolr_indexing_options.png)

    -   **Post types to be indexed**: Selecting all of them is recommended. **Post** indexes all blog posts, **page** all pages (such as about pages), and **attachment** all documents (such as PDFs and DOC files).

    -   **Custom taxonomies to be indexed**: Generally there is no need to enter anything here; however, if Wordpress has been customized to organize blog posts in ways other than categories and tags, enter the name of the taxonomy here.

    -   **Custom fields to be indexed**: Generally there is no need to select anything here.

    -   **Index Comments**: Select this if you want search results to include comments. This is suitable only for blogs where comments add some value to the post and are rigorously moderated.

    -   **Exclude Items**: If you want some posts or pages to be excluded from search results, enter their IDs here.

7.  Press the **Save Options** button.

8.  Open the **Solr Options > Result Options** page:

    [![WPSolr Result Options](/docs/assets/wpsolr_wpsolr_result_options_resized.png)](/docs/assets/wpsolr_wpsolr_result_options.png)

    -   **Display Suggestions (Did you mean?)**: Recommended. If selected, Solr will suggest alternate search phrases if it doesn't find any matches for the entered search phrase:

        ![WPSolr Suggestions](/docs/assets/wpsolr_search_results_did_you_mean_small.png)

    -   **Display number of results and current page**: Recommended. This is useful for paginating search results.

    -   **Replace default WordPress search**: Recommended. This replaces the default WordPress search box with one that uses Solr to show autocompletion suggestions.

    -   **No. of results per page**: Configures how many search results should be shown per page.

    -   **No. of values to be displayed by facets**: Facets refer to the filters that Solr shows to enable visitors to shortlist from search results. This value is the maximum number of values shown for each facet. For example, in the image below, this value has been set to 5 so that the *Tags* facet shows a maximum of 5 tag filters.

        ![Facet count](/docs/assets/wpsolr_search_results_facet_count.png)

9.  Press the **Save Options** button.

10. Next, open the **Solr Options > Facets Options** page:

    [![WPSolr Facet Options](/docs/assets/wpsolr_wpsolr_facet_options_resized.png)](/docs/assets/wpsolr_wpsolr_facet_options.png)

    Press the green "+" buttons to add a facet. The ones added here are shown as filters in the search results page. Generally, *categories* and *tags* are enough, but if the blog has multiple contributors or custom taxonomies, you may also want to add these values as additional facets.

    [![WPSolr Faceting](/docs/assets/wpsolr_search_results_facets_resized.png)](/docs/assets/wpsolr_search_results_facets.png)

11. Go to the **Solr Operations** tab and click the **Synchronize Wordpress with my Solr index** button.

    {{< note >}}
Whenever you publish a new post or page or attachment, this button must be selected for the new pages to be indexed.
{{< /note >}}

    ![Solr Operations](/docs/assets/wpsolr_wpsolr_solr_operations.png)

    After the operation has completed, the same page displays how many documents were indexed.


## Testing the New Search

The following steps will be completed while on your blog.

1.  Test **autocompletion** by beginning to type a word you know is in one of your blog posts. As you are typing, the search box should display some suggestions in a dropdown:

    ![Autocompletion](/docs/assets/wpsolr_search_box_suggestions.png)

2.  Test **search results** by entering a search phrase. Matching results should be displayed:

    [![Search Results](/docs/assets/wpsolr_search_results_resized.png)](/docs/assets/wpsolr_search_results.png)

3.  Test **autocorrection suggestions** by entering a word with some spelling mistakes or a word that does not occur in any of your blog posts. It should show *Did you mean* suggestions:

    [![Did you mean suggestions](/docs/assets/wpsolr_search_results_did_you_mean_resized.png)](/docs/assets/wpsolr_search_results_did_you_mean.png)


4. Test the  **document search** by creating and publishing some test posts with added file attachments (such as PDFs). Update the search data, then search for a phrase that you know occurs in your attachment. It should display matches inside those attachments:

    [![Document search results](/docs/assets/wpsolr_search_results_from_doc_pdf_resized.png)](/docs/assets/wpsolr_search_results_from_doc_pdf.png)


## Location of Search Data

Search engine data is stored in the `/opt/solr-4.10.4/example/solr/collection1/data` directory.

## Back Up or Restore Search Data

If you have a data backup procedure for your server, you can back up search data by including the `/opt/solr-4.10.4/example/solr/collection1/data` directory in the backup.

The backing up of search data is not critical, since it can always be recreated from the WordPress database. However, for very large blogs with thousands of posts and attachments, backing up and restoring search data will be much faster than recreating it. Overall, when migrating or merging a blog from another WordPress server, the recommended approach is to *recreate* the search data.

After a migration or merger, go to the **Solr Operations** option located at the WPSOLR plugin section of your administration panel and press the **Synchronize Wordpress with my Solr index** to recreate the search data.

