## About Django

Django is a great web application development framework for the perfectionist with deadlines built in python programming language. It provides a very good structure and common methods that help to do the heavy lifting when writing web applications.

If you have never used django before and are looking for an installation guide on your **Ubuntu 14.04 LTS** then you are in the right place. In this article we will teach you how to setup a very simple django development environment step by step.

## Some Tools We Need

There are many different ways to install the django framework in Ubuntu. In order to stay updated with the latest python development industry standards we need to install a few tools before getting Django up and running on our machine.

The first tool is called `pip` which is a very practical python package managment system widely used by python developers all over the world. I mainly use `pip` to install packages for my python projects, generate dependencies of a project and also uninstall different python packages from my machine when they are no longer required.

Before installing `pip` we higly recommend to our users to update the package index on their machine with the help of the command shown below.

    sudo apt-get update

The following command can be used to install the `pip` python package manager inside `Ubuntu 14.04 LTS`.

    sudo apt-get install python-pip

Now we can easily install python packages on our `Ubuntu 14.04 LTS` machine by following the syntax shown below.

    pip install name-of-python-package-here
But we do not recommend installing packages yet! Python developers use another tool during the development of their python projects.

This tool is called `virtualenv`. It is really useful as it helps to manage dependency conflicts of different python projects on the same machine. In short words the tool `virtualenv` helps to create isolated virtual environments where you can develop without any worries about package conflicts.

To install `virtualenv` on `Ubuntu 14.04 LTS` the following command can be used.

    sudo pip install vitualenv

What is the next step? Do we need to make use of the tool `virtualenv`? 

## Create A Virtual Environment For Your Project

`virtualenv` can be easily used to create isolated virtual environments for your python projects.

For example to create a virtual environment under the name of `venv1` the following command can be used.

    virtualenv venv1
In order to work on an isolated environment it needs to be activated. The following command does it for you.

    source venv1/bin/activate
But working with `virtualenv` is a bit annoying as there are many different commands you need to remember and type on your terminal emulator.

The best solution is to install and use `virtualenvwrapper` which makes working with python virtual environments very easy. Once you have finished installing and configuring `virtualenvwrapper` working on a virtual environment is as easy as typing the following command.

    workon venv1

Now that `pip` and `virtualenv` tools are available on your machine it is time to install and configure `virtualenvwrapper`.

To install `virtualenvwrapper` use `pip` like shown below.

    pip install virtualenvwrapper
There are a few steps you need to follow in order to do this properly. On your command prompt run the following command.

    source /usr/local/bin/virtualenvwrapper.sh
All virtual environments you create will be available inside the directory ` ~/.virtualenvs`.

If you want to keep your virtual environments inside another directory then use the following commands like shown in the official documentation of the `virtualenvwrapper`.

     export WORKON_HOME=~/Name-Of-DIrectory-Here
     mkdir -p $WORKON_HOME
     source /usr/local/bin/virtualenvwrapper.sh


I like to keep my virtual environments inside `~/.virtualenvs`. My projects are inside `~/projects`.

To create a virtual environment just use the command `mkvirtualenv` like shown below.

    mkvirtualenv linodevenv

The following output is displayed on my terminal when executing the above command.

    New python executable in linodevenv/bin/python
    Installing setuptools, pip...done.

To work on the virtual environment `linodevenv` use the following command.

    workon linodevenv

Once the virtual environment has been activated your command propmpt will change. Mine looks like shown below.

    (linodevenv)oltjano@baby:~/Desktop$

As you can see from the output shown above `linodevenv` is the name of the virtual environment we created.

## Install Django

Inside the virtual environment use the command `which python` to see the python executable you are using.

    which python

The above command produces the following output on my machine. Depending on the name of your directory for the virtual environments you will get a different output, but structured in a very similar way.

    /home/oltjano/.virtualenvs/linodevenv/bin/python

The above output is telling us that the python executeable being used is inside the virtual environment which in this case is `linodevenv`.

Deactivate the virtual environment with the command `deactivate`.

    deactivate

Remove the virtual environment `linodevenv` with the help of the following command.

    rmvirtualenv linodevenv
The reason why we decided to remove `linodevenv` is because we did not choose the version of python we want to use inside the virtual envrionment we created.

It can be done with the following command.

    mkvirtualenv -p /usr/bin/python-version-here
    
In a project I am working on we use `python3.2`. To run the project I create a special environment for it.

    mkvirtualenv -p /usr/bin/python3.2 linodevenv

The above command produces the following output.

    Running virtualenv with interpreter /usr/bin/python3.2
    New python executable in linodevenv/bin/python3.2
    Also creating executable in linodevenv/bin/python
    Installing setuptools, pip...done
The command prompt will look similar to mine.

    (linodevenv)oltjano@baby:~/Desktop$

You can use any python version required by your project. The installation of django is very easy.

Just run the following command.

    pip installl django

 The above command produces the following output.
 
     (linodevenv)oltjano@baby:~/Desktop$ pip install django
     You are using pip version 6.0.7, however version 6.0.8        is available.
    You should consider upgrading via the 'pip install --upgrade pip' command.
    Collecting django
    Downloading Django-1.7.6-py2.py3-none-any.whl (7.4MB)
    100% |################################| 7.4MB 40kB/s 
    Installing collected packages: django

    Successfully installed django-1.7.6
To install a different version of django than the default one specify the version like shown below.

    pip install Django==1.0.4
It is up to you which version of python and django you want to use for your projects. Our mission is to help how to install them.


##Conclusion

Knowledge on tools such as `virtualenv`  and `virtualenvwrapper`is a must for a python developer. In this article I showed you how to install django on `Ubuntu 14.04 LTS` and also how to setup a very basic django development environment.


