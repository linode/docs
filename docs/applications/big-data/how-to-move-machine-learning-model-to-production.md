---
author:
  name: Jared Kobos
  email: docs@linode.com
description: 'This guide shows how to use an existing deep learning model as part of a production application. A pre-trained model is included as an API endpoint for a Flask app.'
keywords: ["deep learning", "big data", "python", "keras", "flask", "machine learning", "neural networks"]
og_description: 'Use an pre-trained deep learning model as part of a production application.'
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2017-10-09
modified: 2017-10-10
modified_by:
  name: Linode
title: 'How to Move Your Machine Learning Model to Production'
external_resources:
- '[Miniconda](https://conda.io/miniconda.html)'
- '[Keras Documentation](https://keras.io/)'
- '[Fast AI Deep Learning Course](http://course.fast.ai/)'
- '[TensorFlow Tutorials](https://www.tensorflow.org/tutorials/)'
---

![How to Move Your Machine Learning Model to Production](/docs/assets/machine-learning/Machine_Learning_Model.jpg)

Developing, training, and tuning a deep learning model for a particular problem, such as natural language processing (NLP) or image recognition, requires time and resources. It also often involves using powerful processors to train the model on large datasets. However, once the model is working well, using it to generate predictions on new data is much simpler and less computationally expensive. The only difficulty is in moving the model from its development environment into a production app.

This guide will show you how to create a simple Flask API that will use machine learning to identify handwritten digits. The API will use a simple deep learning model trained on the famous MNIST dataset.

## Before You Begin

1.  Familiarize yourself with our [Getting Started](/docs/getting-started) guide and complete the steps for setting your Linode's hostname and timezone.

2.  This guide will use `sudo` wherever possible. Complete the sections of our [Securing Your Server](/docs/security/securing-your-server) to create a standard user account, harden SSH access and remove unnecessary network services.

3.  Update your system:

        sudo apt-get update && sudo apt-get upgrade

This guide uses Ubuntu 16.04 in the examples. Modify the commands as needed for your distribution. The scripts in this guide are written in Python 3, but should also work on Python 2.

## Set Up a Python Virtual Environment

You will be using Python both to create a model and to deploy the model to a Flask API. It is a good idea to set up virtual environments for each purpose, so that any changes you make to your Python configuration won't affect the rest of your system.

1.  Download and install Miniconda, a lightweight version of Anaconda. Follow the instructions in the terminal and allow Anaconda to add a PATH location to `.bashrc`:

        wget https://repo.continuum.io/miniconda/Miniconda3-latest-Linux-x86_64.sh
        bash Anaconda3-5.0.0.1-Linux-x86_64.sh
        source .bashrc

2.  Create and activate a new Python virtual environment:

        conda create -n deeplearning python
        source activate deeplearning

    If these commands are successful, your terminal prompt will now be prefaced with `(deeplearning)`.

3.  Install dependencies inside the virtual environment:

        conda install keras tensorflow h5py pillow flask numpy

### Test it on Jupyter

If you would like to experiment with the model, you may want to use a Jupyter notebook. See our [Install a Jupyter Notebook Server](/docs/applications/big-data/install-a-jupyter-notebook-server-on-a-linode-behind-an-apache-reverse-proxy) guide for more details.

## Prepare a Model

Training complicated models on large datasets is usually done on specialized machines with powerful GPUs (Graphical Processing Units). In order to focus on the deployment process, this guide will quickly build a simple model on a manageable dataset, so that it can be trained quickly even on a laptop or basic Linode.

### MNIST Database

Training a computer to recognize handwritten numbers was an important task in early machine learning. This kind of classifier is used by many organizations, including the U.S. Post Office, to automate the input and processing of information. A famous dataset used for this task is the MNIST database, which contains 70,000 images of handwritten digits (for comparison, the ImageNet database, commonly used in machine learning applications, has more than 10 million images). Each 28x28 pixel image consists of a single digit that has been preprocessed and labeled. For more information about MNIST, see the [official site](http://yann.lecun.com/exdb/mnist/).

Many different models, from simple linear classifiers to complicated neural networks, have been trained on MNIST. Currently, the best models are able to achieve an [error rate of only 0.21%](https://en.wikipedia.org/wiki/MNIST_database). This guide will use a simple CNN (Convolutional Neural Network) that can achieve an accuracy of about 97%.

### Create a Deep Learning Model with Keras

Keras is a deep learning library for Python. It provides an object-oriented interface that can work with a variety of deep learning frameworks, including Theano and Tensorflow.

Since developing and training a deep learning model is beyond the scope of this tutorial, the code below is provided without explanation. The model is a simplified version of the example from [Elite Data Science's excellent tutorial](https://elitedatascience.com/keras-tutorial-deep-learning-in-python). If you don't have a background in deep learning and are interested in learning more, you can complete that tutorial and then skip to the [Flask API](#flask-api) section of this guide.

{{< note >}}
This model is simple enough, and the data set small enough, that the script can be run on a Linode or on your local machine. However, using a computer without a GPU will still take at least ten minutes. If you would prefer to skip this step, a pre-trained model can be downloaded by running the command `wget https://github.com/linode/docs-scripts/raw/master/hosted_scripts/my_model.h5`

Older versions of Keras require deleting optimizer weights in the pre-trained model. If the pre-trained model is downloaded from GitHub, the script below checks and removes optimizer weights.

import h5py
with h5py.File('my_model.h5', 'r+') as f:
if 'optimizer_weights' in f.keys():
del f['optimizer_weights']
f.close()
{{< /note >}}

1.  Create a directory for the model:

        mkdir ~/models && cd ~/models

2.  Create a Python script to build and train your model:

    {{< file "~/models/mnist_model.py" >}}
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

{{< /file >}}


3.  Run the script:

        python ./mnist_model.py

    There may be a warning message as shown below from a pip or conda installation which means installing from source could offer superior performance.

    {{< output >}}
The TensorFlow library wasn't compiled to use SSE4.1 instructions, but these are available on your machine and could speed up CPU computations.
{{< /output >}}

    If the script executes successfully, you should see the `my_model.h5` file in the `models` directory. The `model.save()` command in Keras allows you to save both the model architecture and the trained weights.

## Flask API

Once a model has been trained, using it to generate predictions is much simpler. In this section you will build a simple Python API with Flask. The API will have a single endpoint: it will accept POST requests with an image attached, then use the model you saved in the previous section to identify the handwritten digit in the image.

1.  Create a directory for the Flask API:

        sudo mkdir -p /var/www/flaskapi/flaskapi && cd /var/www/flaskapi/flaskapi

2.  Copy the pre-trained model to the root of the Flask app:

        sudo cp ~/models/my_model.h5 /var/www/flaskapi/flaskapi

3.  Create `/var/www/flaskapi/flaskapi/__init__.py` in a text editor and add the following:

    {{< file "/var/www/flaskapi/flaskapi/\\__init__.py" >}}
from flask import Flask, jsonify, request
import numpy as np
import PIL
from PIL import Image
from keras.models import load_model

app = Flask(__name__)

model = load_model('/var/www/flaskapi/flaskapi/my_model.h5')

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
        prediction = {'digit':int(digit)}
        return jsonify(prediction)

if __name__ == "__main__":
        app.run()

{{< /file >}}


    This time, the only module you need to import from Keras is `load_model`, which reads `my_model.h5` and loads the model and weights. Once the model is loaded, the `predict()` function will generate a set of probabilities for each of the numbers from 0-9, indicating the likelihood that the digit in the image matches each number. The `argmax` function from the Numpy library returns the number with the highest probability: the number that the model thinks is the most likely match.

    The format of the inputs to the model must be exactly the same as the images used in training. The training images were 28x28 pixel greyscale images, represented as an array of floats with the shape (1,28,28) (color images would have been (3,28,28)). This means that any image you submit to the model must be resized to this exact shape. This preprocessing can be done on either the client-side or server-side, but for simplicity the example API above handles the processing.

## Install mod_wsgi
Apache modules are typically installed with the system installation of Apache. However, `mod_wsgi` can be installed within Python in order to use the appropriate virtual environment.

1.  Install Apache and development headers:

        sudo apt install apache2-dev apache2

2.  Install `mod_wsgi` as a Python module for Apache:

        wget https://pypi.python.org/packages/aa/43/f851abaad631aee69206e29cebf9f8bf0ddb9c22dbd6e583f1f8f44e6d43/mod_wsgi-4.5.20.tar.gz
        tar -xvf mod_wsgi-4.5.20.tar.gz
        cd mod_wsgi-4.5.20
        python setup.py install

3.  Use `mod_wsgi-express` to find the installation path:

        mod_wsgi-express module-config

    The output should be similar to:

    {{< output >}}
LoadModule wsgi_module "/home/linode/miniconda3/envs/deeplearning/lib/python3.6/site-packages/mod_wsgi-4.5.20-py3.6-linux-x86_64.egg/mod_wsgi/server/mod_wsgi-py36.cpython-36m-x86_64-linux-gnu.so"
WSGIPythonHome "/home/linode/miniconda3/envs/deeplearning"
{{< /output >}}

4.  Create a `wsgi.load` file in the Apache `mods-available` directory. Copy the `LoadModule` directive from above and paste it into the file:

    {{< file "/etc/apache2/mods-available/wsgi.load" >}}
LoadModule wsgi_module "/home/linode/miniconda3/envs/deeplearning/lib/python3.6/site-packages/mod_wsgi-4.5.20-py3.6-linux-x86_64.egg/mod_wsgi/server/mod_wsgi-py36.cpython-36m-x86_64-linux-gnu.so"

{{< /file >}}


5.  Enable the mod:

        a2enmod wsgi

## Set Up Virtual Hosting for Flask API

1.  Create a `flaskapi.wsgi` file with settings for your app:

    {{< file "/var/www/flaskapi/flaskapi/flaskapi.wsgi" >}}
#!/usr/bin/python
import sys
sys.path.insert(0,"/var/www/flaskapi/")

from flaskapi import app as application

{{< /file >}}


2.  Configure a virtual host for your app. Create `flaskapi.conf` in Apache's `sites-available` directory and add the following content, replacing `example.com` with your Linode's public IP address. For the `WSGIDaemonProcess` directive, set the Python home path to the output of `mod_wsgi-express module-config` under `WSGIPythonHome`:

    {{< file "/etc/apache2/sites-available/flaskapi.conf" >}}
<Directory /var/www/flaskapi/flaskapi>
  Require all granted
</Directory>
<VirtualHost *:80>
  ServerName example.com
  ServerAdmin admin@example.com
  WSGIDaemonProcess flaskapi python-home=/home/linode/miniconda3/envs/deeplearning
  WSGIScriptAlias / /var/www/flaskapi/flaskapi/flaskapi.wsgi
  ErrorLog /var/www/html/example.com/logs/error.log
  CustomLog /var/www/html/example.com/logs/access.log combined
</VirtualHost>

{{< /file >}}


3.  Create a `logs` directory:

        sudo mkdir -p /var/www/html/example.com/logs

4.  Activate the new site and restart Apache:

        sudo a2dissite 000-default.conf
        sudo a2ensite flaskapi.conf
        sudo systemctl restart apache2

## Test the API

Your API endpoint should now be ready to accept POST requests with an image attached. In theory the API should be able to identify any image of an isolated handwritten digit. However, in order to obtain accurate predictions, the preprocessing steps used by the MNIST researchers should be replicated on every image submitted to the model. This would include calculating the center of pixel density and using that to center the digit within the image, as well as applying anti-aliasing. In order to quickly test the API, you can use `curl` to submit an image from the MNIST test set.

1.  Right click and download the image below onto your local machine:

    ![MNIST 7](/docs/assets/machine-learning/7.png "MNIST 7")

2.  From your local machine, use `curl` to POST the image to your API. Replace the IP address with the public IP address of your Linode, and provide the absolute path to the downloaded image in place of `/path/to/7.png`:

        curl -F 'file=@/path/to/7.png' 192.0.2.0/predict

    If successful, you will receive a JSON response that correctly identifies the digit in the image:

    {{< output >}}
{ 'digit' : 7 }
{{< /output >}}

    The first request may appear to take some time because `mod_wsgi` uses lazy loading of the Flask application.

## Next Steps

Most production machine learning solutions involve a longer pipeline than demonstrated in this guide. For example, you could add a different endpoint with a deep learning classifier for identifying digits in a larger image. Each detected digit would then be passed to the `/predict` endpoint, so that your application could interpret a series of handwritten digits, such as a phone number, for example.

The API produced in this guide also lacks many features that a real-world application would need, including error handling and dealing with bulk image requests. To make the service more useful, the full preprocessing used by MNIST should be applied to each image.

In addition, images submitted to the API could be used as a source of data to further train and refine your model. In this case, you could configure the API to copy each submitted image, along with the model's prediction, to a database for later analysis. See the links in **More Information** if you are interested in these topics.

