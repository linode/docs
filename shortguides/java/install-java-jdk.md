1.  Install `software-properties-common`:

		sudo apt install software-properties-common

2.  Add the Oracle PPA repository:

		sudo apt-add-repository ppa:webupd8team/java

3.  Update your system:

		sudo apt update

4.  Install the Oracle JDK. To install the Java 9 JDK, change `java8` to `java9` in the command:

		sudo apt install oracle-java8-installer

5.  Check your Java version:

		java -version
