---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide shows how to use an existing deep learning model as part of a production application. A pre-trained model is included as an API endpoint for a Flask app.'
keywords: 'deep learning,big data,python,keras,flask,machine learning,neural networks'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 'Monday, October 9th, 2017'
modified: Tuesday, October 10th, 2017
modified_by:
  name: Linode
title: 'Putting Your Deep Learning Model into Production'
external_resources:
- '[Link Title 1](http://www.example.com)'
- '[Fast AI Deep Learning Course](http://course.fast.ai/)'
---

Developing, training, and tuning a deep learning model for a particular problem, such as natural language processing (NLP) or image recognition, requires time and resources, and often involves using powerful processors to train the model on huge datasets. However, once the model is working well, using it to generate predictions on new data is a much simpler and less computationally expensive process. The only difficulty is in how to move the model from its development environment into a production app.

This guide will show you how to create a simple Flask API that will use machine learning to identify handwritten digits. The API will use a simple deep learning model trained on the famous MNIST dataset.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Your Linode should also have Apache installed and configured before beginning this guide. Complete the first section of our [How to Install a LAMP Stack on Ubuntu 16.04](/docs/web-servers/lamp/install-lamp-stack-on-ubuntu-16-04) guide.

4.  Update your system:

        sudo apt-get update && sudo apt-get upgrade


## Set Up a Python Virtual Environment

You will be using Python both to create a model and to deploy the model to a Flask API. It is a good idea to set up virtual environments for each purpose, so that any changes you make to your Python configuration won't affect the rest of your system.

1.  Install `pip`:

        apt install python-pip

2.  Use `pip` to install `virtualenv` so that you can create a virtual environment:

        pip install virtualenv

3.  Create and activate a new virtual environment:

        virtualenv deeplearning
        source deeplearning/bin/activate

    If these commands are successful, your terminal prompt will now be prefaced by `(deeplearning)`.

4.  Install dependencies inside the virtual environment:

        pip install keras tensorflow h5py


{:.note}
> The scripts in this guide are written in Python 2.7, but should also work on Python 3. In addition, if you would like to experiment with the model, you may want to use a Jupyter notebook. See our [Install a Jupyter Notebook Server](ihttps://www.linode.com/docs/applications/big-data/install-a-jupyter-notebook-server-on-a-linode-behind-an-apache-reverse-proxy) guide for more details.


## Prepare a Model

Training complicated models on large datasets is usually done on specialized machines with powerful GPUs (graphical processing units). In order to focus on the deployment process, this guide will quickly build a simple model on a manageable dataset, so that it can be trained quickly even on a laptop or basic Linode.

### MNIST Database

Training a computer to recognize handwritten numbers was an important task in early machine learning; this kind of classifier is used by many organizations, including the U.S. Post Office, to automate the input of information. A famous dataset used for this task is the MNIST database, which contains 70,000 images of handwritten digits (for comparison, the ImageNet database, commonly used in machine learning applications, has more than 10 million images). Each 28x28 pixel image consists of a single digit that has been preprocessed and labeled. For more information about MNIST, see the [official project documentation](http://yann.lecun.com/exdb/mnist/).

Many different models, from simple linear classifiers to complicated neural networks, have been trained on MNIST. Currently, the best models are able to achieve an error rate of only 0.21%. This guide will use a simpler CNN (convolutional neural network) that can achieve an accuracy of about 97%.

### Create a Deep Learning Model with Keras

Keras is a deep learning library for Python. It provides an object-oriented interface that can work with a variety of deep learning frameworks, including Theano and Tensorflow.

Since developing and training a deep learning model is beyond the scope of this tutorial, the code is provided below without explanation. The model is taken from Elite Data Science's excellent [tutorial](https://elitedatascience.com/keras-tutorial-deep-learning-in-python); if you don't have a background in deep learning and are interested in learning more, you can complete that tutorial and then skip to the next section of this guide.

{:.note}
> This model is simple enough, and the data set small enough, that the script can be run on a Linode or on your local machine. However, training with  a computer without a GPU will still take at least ten minutes. If you would prefer to skip this step, a pre-trained model can be downloaded by running the command `curl -O XXXXX`.


1.  Create a directory for the model:

        mkdir ~/models && cd ~/models

2.  Create a Python script to build and train your model:

    {:.file}
    ~/models/mnist_model.py
    :   ~~~
        from keras.models import Sequential
        from keras.layers import Dense, Dropout, Activation, Flatten
        from keras.layers import Convolution2D, MaxPooling2D
        from keras.utils import np_utils
        from keras.datasets import mnist

        (X_train, y_train), (X_test, y_test) = mnist.load_data()
        X_train = X_train.reshape(X_train.shape[0],1,28,28)
        X_test  = X_test.reshape(X_test.shape[0],1,28,28)
        X_train = X_train.astype('float32')
        X_test = X_test.astype('float32')
        X_train /= 255
        X_test /= 255

        Y_train = np_utils.to_categorical(y_train, 10)
        Y_test = np_utils.to_categorical(y_test, 10)

        model = Sequential()

        model.add(Convolution2D(32,(3,3),activation='relu',input_shape=(1,28,28),dim_ordering='th'))
        model.add(MaxPooling2D(pool_size=(2,2)))
        model.add(Dropout(0.25))
        model.add(Flatten())
        model.add(Dense(128, activation='relu'))
        model.add(Dropout(0.5))
        model.add(Dense(10, activation='softmax'))
        model.compile(loss='categorical_crossentropy',
                      optimizer='adam',
                      metrics=['accuracy'])

        model.fit(X_train, Y_train,
                  batch_size=32, nb_epoch=5, verbose=1)

        model.save('my_model.h5')
        ~~~

3.  Run the script:

        python ./mnist_model.py

    If the script executes successfully, you should see the `my_model.h5` file in the `models` directory. The `model.save()` command in Keras allows you to save both the model architecture and the trained weights.


## Flask API

Fortunately, once a model has been trained, using it to generate predictions is much simpler and less resource-intensive. In this section you will build a simple Python API with Flask. The API will have a single endpoint: it will accept POST requests with an image attached, then use the model you saved in the previous section to identify the handwritten digit in the image.

1.  Create a directory for the Flask API:

        mkdir -p /var/www/FlaskAPI/FlaskAPI

2.  Create and activate a new virtual environment:

        sudo virtualenv flaskenv
        source flaskenv/bin/activate

3.  Install dependencies for the AOI:

        pip install keras tensorflow h5py pillow numpy flask

4.  Copy the pre-trained model to the root of the Flask app:

        cp ~/models/my_model.h5 /var/www/FlaskAPI/FlaskAPI

5.  Create `/var/www/FlaskAPI/FlaskAPI/api.py` in a text editor and add the following content:

    {:.file}
    /var/www/FlaskAPI/FlaskAPI/api.py
    : ~~~
      from flask import Flask, jsonify, request
      import numpy as np
      import PIL
      from PIL import Image
      from keras.models import load_model

      app = Flask(__name__)

      model = load_model('/var/www/FlaskAPI/FlaskAPI/my_model.h5')

      @app.route('/predict', methods=["POST"])
      def predict_image():
              # Preprocess the image so that it matches the training input
              image = request.files['file']
              image = Image.open(image)
              image = np.asarray(image.resize((28,28)))
              image = image.reshape(1,1,28,28)

              # Use the loaded model to generate a prediction.
              pred = model.predict(image)

              # Prepare and send the response.
              digit = np.argmax(pred)
              prediction = {'digit':digit}
              return jsonify(prediction)

      if __name__ == "__main__":
              app.run()
      ~~~

    This time, the only module you need to import from Keras is `load_model`, which reads `my_model.h5` and loads the model and weights. Once the model is loaded, the `predict()` function will generate a set of probabilities for each of the numbers from 0-9, indicating the likelihood that the digit in the image matches each number. Using the `argmax` function from the Numpy libary chooses the number with the highest probability: the number that the model thinks is the most likely match.

    The format of the inputs to the model must be exactly the same as the images used in training. The training images were 28x28 pixel greyscale images, represented as an array of floats with the shape (1,28,28) (color images would have been (3,28,28)). This means that any image you submit to the model must be resized to this exact shape. This preprocessing can be done on either the client-side or server-side, but for simplicity the example api above handles the processing.

## Set Up Virtual Hosting

The Apache server should already be running on your Linode. This section will show you how to set up a virtual host on the server for your Flask API.

1.  Install the `mod_wsgi` mod for Apache:

        apt install libapache2-mod-wsgi python-dev

2.  Enable the mod:

        a2enmod wsgi

3.  Create a `wsgi` file with settings for your app:

    {:.file}
    /var/www/FlaskAPI/FlaskAPI/flaskapi.wsgi
    :  ~~~
       #!/usr/bin/python
       import sys
       sys.path.insert(0,"/var/www/FlaskAPI/")

       from FlaskAPI import app as application
       ~~~

4.  Configure a virtual host for your app. Create `FlaskAPI.conf` in Apache's `sites-available` directory and add the following content:

    {:.file}
    /etc/apache2/sites-available/FlaskAPI.conf
    :   ~~~
        <VirtualHost *:80>
        ServerName example.com
        ServerAdmin admin@example.com
        WSGIScriptAlias / /var/www/FlaskAPI/flaskapp.wsgi
        <Directory /var/www/FlaskAPI/FlaskAPI/>
            Order allow,deny
            Allow from all
        </Directory>
        Alias /static /var/www/FlaskAPI/FlaskAPI/static
        <Directory /var/www/FlaskAPI/FlaskAPI/static/>
            Order allow,deny
            Allow from all
        </Directory>
        ErrorLog ${APACHE_LOG_DIR}/error.log
        LogLevel warn
        CustomLog ${APACHE_LOG_DIR}/access.log combined
         </VirtualHost>
        ~~~

5.  Restart Apache:

        systemctl restart apache2
