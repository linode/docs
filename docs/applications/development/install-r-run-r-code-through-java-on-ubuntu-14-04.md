---
author:
    name: Linode Community
    email: docs@linode.com
description: 'Set up and configure R software at your linode Server(i.e. Ubuntu 14.04) to develop, test, and run Java applications to execute R code'
keywords: 'R,rjava,forecast'
license: '[CC BY-ND 3.0](http://creativecommons.org/licenses/by-nd/3.0/us/)'
published: 'Sunday, December 27th, 2015'
modified: Sunday, December 27th, 2015
modified_by:
    name: Linode
title: 'How to install R and run R code throigh Java on Ubuntu 14.04'
contributor:
    name: Shilong Zhuang
    link: https://github.com/huojianxixi
external_resources:
 - '[Talking R through Java](http://www.r-bloggers.com/talking-r-through-java/)'
---

*This is a Linode Community guide. [Write for us](/docs/contribute) and earn $250 per published guide.*

<hr>


This guide walks through you how to install R on Ubuntu 14.04 by linode server and run the Java code to execute the R code with a forecast example. [R](https://www.r-project.org/about.html) is a free software environment for statistical computing and graphics. If you are R fans and want to know how to use Java to execute R code on Ubuntu linux server, then try to read this guide you would know:

1. How to install R in linode linux server
2. How to configure Java for R code in linux server
3. An example to run forecast R code through Java in the linux server

## Before You Begin

1. Make sure you login with a **sudo user**, otherwise you should use **root** in case. 
2. Ensure you are already have installed Java, try `java -version` and `javac -version`, you can find the below result for sure.
	root@localhost:/# java -version
	java version "1.8.0_45"
	Java(TM) SE Runtime Environment (build 1.8.0_45-b14)
	Java HotSpot(TM) 64-Bit Server VM (build 25.45-b02, mixed mode)
	root@localhost:/# javac -version
	javac 1.8.0_45

{: .note}
>
> The above that mentioned `1.8.0_45` may be different from your Java version.

3. Update your system:
	sudo apt-get update


## Install the R

1. sudo apt-get install r-base

{: .note}
>
>If you are still looking for the detailed information about installing R with Ubuntu, please see [official website](https://cran.r-project.org/bin/linux/ubuntu/)

2. Type `R` on the shell and if you can see R console over there, then R has been installed successfully on your machine.


## Install rJava and set up the environment variable


1. Enter `R` in the terminal, then

2. Enter 
	install.packages("rJava",contriburl="http://cran.rstudio.com/src/contrib/")

3. If you found there show you the message that said the install failed and you probably should type `R CMD javareconf` as well

4. Then re-enter the below command, then everything should be done.
	install.packages("rJava",contriburl="http://cran.rstudio.com/src/contrib/")

5. Configure environment variables

	export PATH=$JAVA_HOME/bin:/usr/lib/R/bin:/usr/lib/R/site-library/rJava/jri:$PATH
	export R_HOME=/usr/lib/R
	export LD_LIBRARY_PATH=/usr/lib/R/lib:$LD_LIBRARY_PATH
	export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:/usr/lib/R/site-library/rJava/jri/:$CLASSPATH

The above command will work for this session only, but you will need to be added to all system users especially when server reboots, so for the **Bourne shell**, create a new file called `/etc/profile.d/r.sh`

{: .file-excerpt}
/etc/profile.d/r.sh
:   ~~~ ini

	if ! echo ${PATH} | grep -q /usr/lib/R/bin ; then
   	export PATH=/usr/lib/R/bin:${PATH}
	fi
	if ! echo ${PATH} | grep -q /usr/lib/R/site-library/rJava/jri ; then
	   export PATH=/usr/lib/R/site-library/rJava/jri:${PATH}
	fi
	export R_HOME=/usr/lib/R
	export LD_LIBRARY_PATH=/usr/lib/R/lib:/usr/lib/R/site-library/rJava/jri
	export CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:/usr/lib/R/site-library/rJava/jri/
	~~~

Now rJava is available to everyone in system. You can try to go the linode manager and click the reboot button if needed.

## Install forecast package in R

1. Enter `R` in the terminal, then

2. Enter 
	install.packages("forecast",contriburl="http://cran.rstudio.com/src/contrib/")

{: .note}
>
> Forecast is a mathematical analysis package that used for forecast analysis task, which including a very typical forecast method called **HoltWinter**.

### In the following I would like to introduce how to create the java code as well as to run the code on the Ubuntu system.

## Create Java code and test running java to execute R code

1. Switch to tmp folder:
	cd /tmp

2. Create a destination folder called 'rJava`:
	mkdir rJava

3. Switch to destination folder:
	cd rJava

4. Create a new folder called `lib` and go to there
	mkdir lib && cd lib

5. Use curl commond to download three necessary jar from the given web urls
	curl -O https://www.rforge.net/JRI/files/JRI.jar
	curl -O https://www.rforge.net/JRI/files/JRIEngine.jar
	curl -O https://www.rforge.net/JRI/files/REngine.jar

6. Switch to `/tmp/rJava` and create a new folder called `src`:
	cd .. & mkdir src 

7. Go to `src` and create a new folder called `com`
	cd src && mkdir com

8. Go to `com` and create a new folder called `linode`
	cd com && mkdir linode

9. Go to `linode` and create a new folder called `core`
	cd linode && mkdir core

10. Go to `core` and create a new Java file called `ForeCastTest.java`
	cd core && touch ForeCastTest.java

11 Edit `ForeCastTest.java` and add the following code
	vi ForeCastTest.java && press key `i`

  
	package com.linode.core;

    	import org.rosuda.JRI.REXP;
    	import org.rosuda.JRI.Rengine;

   	 public class ForeCastTest {
		public static void main(String[] args) {
		   	Rengine re = new  Rengine(new      String[] { "--linode" }, false, null);
			System.out.println("Rengine created, waiting for R");
			if (!re.waitForR()) {
				System.out.println("Cannot load R");
				return;
			}
			re.eval("search_index <- c(48, 40, 34, 43, 31, 39, 46, 26, 33, 34, 28, "
					+ "50, 50, 35, 36, 33, 35, 33, 32, 28, 33, 19, 27, 26, 18, 20, "
					+ "21, 19, 20, 19, 27, 19, 22, 26, 21, 24, 22, 21, 41, 34, 38, "
					+ "45, 33, 36, 35, 46, 45, 39, 49, 53, 59, 48, 54, 57, 79, 57, "
					+ "51, 40, 43, 39, 49, 45, 48, 24, 34, 33, 33, 35, 26, 25, 24, "
					+ "46, 48, 52, 59, 64, 70, 62, 73, 66, 68, 69, 72, 82, 77)");
			re.eval("search_index <- ts(search_index, frequency = 12, start = c(2010,1))");
			re.eval("search_fit <- HoltWinters(search_index);");
			re.eval("library(forecast);");
			re.eval("search_forecast <- forecast.HoltWinters(search_fit, h=12)");
			REXP fs = re.eval("search_forecast_mean <- search_forecast$mean");
			double[] forecast = fs.asDoubleArray();
			for (int i = 0; i < forecast.length; i++) {
				    System.out.println(forecast[i]);
			}
			re.end();
	   	}
      
       	}


{: .note}
>
>Java code can let you get the forecast numbers array and being printed at the terminal 

Press key `Esc` and enter `:wq!` then you saved the code file in the path `/tmp/rJava/src/com/linode/core`

12. Go back to path /tmp/rJava

13. Run javac to complie the code and run java to execute the code
	javac -Djava.ext.dirs=./lib -d bin ./src/com/linode/core/ForeCastTest.java
	java -Djava.ext.dirs=./lib/ -cp ./bin/ com.linode.core.ForeCastTest

Then you should get the result like:

	WARNING: unknown option '--linode'

	Rengine created, waiting for R
		80.6096339671016
	84.89743519227414
	76.3263686975101
	80.43586329594373
	77.45603860345817
	84.85325841244783
	76.32807705648534
	72.97131835709561
	72.26713408530733
	73.2517476226272
	81.95698991067903
	83.42939526922046

## More Information

This is really a general start for using Java for R on linux. You may wish to consult the following resources for additional information on this topic. Also, please explore more and let me know if you want to run R code through Java on linux to create dynamic application.

1. [Install R on other linux machines](http://www.jason-french.com/blog/2013/03/11/installing-r-in-linux/)

2. [Using R to Power Analytics In Java Apps](https://vizbuzz.wordpress.com/2015/01/27/using-r-to-power-analytics-in-java-apps/)


#### Just a by the way, please don't include this for currrent topic.
It looks like from this https://www.linode.com/docs/applications/development/java-development-wildfly-centos-7, I don't think these 4 commands can work out very well, since I assumed that
`sudo alternatives --install` should be converted to `sudo update-alternatives --install` or something like that, please review the following if they are really typos.Thank you!!

	sudo alternatives --install /usr/bin/jar jar /opt/jdk1.8.0_45/bin/jar 2
	sudo alternatives --install /usr/bin/javac javac /opt/jdk1.8.0_45/bin/javac 2
	sudo alternatives --set jar /opt/jdk1.8.0_45/bin/jar
	sudo alternatives --set javac /opt/jdk1.8.0_45/bin/javac