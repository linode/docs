---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide shows how to use an existing machine learning model as part of a production application. A pre-trained model is included as an API endpoint for a Flask app.'
keywords: 'machine learning,big data,python,keras,flask'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, October 9th, 2017'
modified: Tuesday, October 10th, 2017
modified_by:
  name: Linode
title: 'Use a Machine Learning Model in Production'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Link Title 2](http://www.example.net)'
---

Developing, training, and tuning a machine learning model for a particular problem, such as natural language processing (NLP) or image recognition, requires time and resources, and often involves using powerful processors to train the model on huge datasets. However, once the model is working well, using it to generate predictions on new data is a much simpler and less computationally expensive process. The only difficulty is in how to move the model from its development environment into a production app.

This guide will show you how to create a simple Flask API that will use machine learning to identify handwritten digits. The API will use a simple deep learning model trained on the famous MNIST dataset.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services. 

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


## Getting a Model

Training complicated models on large datasets is usually done on specialized machines with powerful GPUs (graphical processing units, chips that were originally developed for video games). In order to focus on the deployment process, this guide will quickly build a simple model on a manageable dataset, so that it can be trained quickly even on a laptop or basic Linode.

### MNIST Database

The MNIST database contains 70,000 images of handwritten digits (for comparison, the ImageNet database, commonly used in machine learning applications, has more than 10 million images). Each image has been preprocessed and labeled. For more detail about MNIST, see the [official project documentation](http://yann.lecun.com/exdb/mnist/). 

### Deep Learning Model with Keras

Keras is a deep learning library for Python. It provides an object-oriented interface that can work with a variety of deep learning frameworks, such as Theano and Tensorflow. 

1.  Create a Python script for your model, either on your local machine or in the home directory of your Linode:
    
    {:.file}
    ~/mnist_model.py
    :   ~~~ 
        from keras.models import Sequential
        from keras.layers import Dense, Dropout, Activation, Flatten
        from keras.layers import Convolution2D, MaxPooling2D
        from keras.utils import np_utils
        from keras.datasets import mnist

        (X_train, y_train), (X_test, y_test) = mnist.load_data()
        X_train = X_train.reshape(X_train.shape[0],1,28,28)
        X_test  = X_test.reshape(X_test.shape[0],1,28,28)
        ~~~
        
    


