# Django Api Guide

Django REST framework is a powerful and flexible toolkit for building Web API's. Its browsable API is one of the features that make it superior to other frameworks. 

### Requirements

REST framework requires the following:

 * Python 
 * Django 

### Installation
Installing DRF is as simple as:

```sh 

pip install djangorestframework

```
## How Django Rest framework works

The following are the building blocks that make up the Django Framework.

### Serializers
Serializers allow querysets and model instances to be converted to native Python datatypes that can then be easily rendered into JSON, XML or other content types.

Let's assume we have a  Product model instance as shown below:

```sh

from django.db import models
from django.contrib.postgres.fields import JSONField


class Product(models.Model):
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    name = models.CharField(max_length=300, unique=True, db_index=True)

    def __str__(self):
        return "{}".format(self.name)

    def __unicode__(self):
        return unicode(self.__str__())

```

The serializer class for the Product model will be;

```sh 

class ProductSerializer(serializers.ModelSerializer):


class Meta:
    model = Product
    fields = ('id','price', 'name')
    
```

The ``ModelSerializer`` class lets you automatically create a Serializer class with fields that correspond to the Model fields.

We can now use ProductSerializer to serialize a product or list of products.

```sh 

serializer = ProductSerializer(product)
serializer.data

#result

{'name': 'samsung Note phone', 'price': '$600'}

```

### Responses and requests.

The django rest Request module is an advanced version of the HTTP module because it allows for flexible request parsing and request authentication.
While the normal standard HTTP uses ``request.POST`` to parse data, DRF used ``request.data`` DRF request object works for  'POST', 'PUT' and 'PATCH' methods.

The DRF Response class allows you to return content that can be rendered into multiple content types, JSON or XML depending on the clients reference.

The response object is used to render content as requested by a client as shown below.

```sh 

return Response(data)

```

### Class-based Views
REST framework provides an APIView class, which subclasses Django's View class.This class works well with the Request instances and also catches exceptions accordingly.

Let's create a view for viewing products.

```sh 

from rest_framework.views import APIView
from rest_framework.response import Response
from product.models import Product

class ListProducts(APIView):
    """
    View to list all products in the system.
    """

    def get(self, request, format=None):
        """
        Return a list of all products.
        """
        products = [product.name for product in User.Product.all()]
        return Response(products)
```

### Viewsets and routers

ViewSet classes provide operations such as read, or update, and not method handlers such as get or put.
Let's create a viewset for viewing our products.

```sh 

from rest_framework import viewsets

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    This viewset automatically provides `list` and `detail` actions.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

```

ViewSet classes also handle  URLs via the use of Routers. All we need is to register the viewsets with a router and it does the rest.

```sh 

from django.conf.urls import url, include
from products import views
from rest_framework.routers import DefaultRouter

#Create a router and register our viewsets with it.

router = DefaultRouter()
router.register(r'products', views.ProductViewSet)

```


The API URLs are now determined automatically by the router.
Additionally, we include the login URLs for the browsable API.

```sh

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^api-prod/', include('rest_framework.urls', namespace='rest_framework'))
]

```

### Permissions and Authentication
DRF handles authentication and permissions for you so you don't have to build an authentication system from scratch.
Django provides support through the ``django.contrib.auth`` and ``django.contrib.sessions`` applications. These applications should be included in the settings file as shown below.

```sh

INSTALLED_APPS = [
    
    'django.contrib.admin',
    'django.contrib.auth',
    ...
]
```

Django also provides views for handling user authentication methods like login, logout, and password reset.


To improve authentication, DRF provides permission packages to ensure only authorized people are able to access certain views.


Permission are first checked before any view is run. If permission check fails an ``exceptions.PermissionDenied`` or ``exceptions.NotAuthenticated`` exception will be raised.
Here is how a typical view with permission looks like:

```sh

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes((IsAuthenticated, ))
def permission(request, format=None):
    result = {
        'success': 'request allowed'
    }
    return Response(result)

```

### Relationships and hyperlinked APIs.
The HyperlinkedModelSerializer is a type of ModelSerializer  that represents relationships to other model instances with hyperlinks instead of primary key values. Using our Product model, here is how we write a hyperlinked serializer.

```sh

#models.py
class ProductCategory(models.Model):
    name = models.CharField(max_length=100, unique=True, db_index=True)
    
class Product(models.Model):
    category = models.ForeignKey(
        ProductCategory, related_name="_related_category", on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    name = models.CharField(max_length=300, unique=True, db_index=True)
    

#serializers.py

class ProductCategorySerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = ProductCategory
        fields = ('name')


class ProductSerializer(serializers.HyperlinkedModelSerializer):

    category = ProductCategorySerializer()

    class Meta:
        model = Product
        fields = ('id', 'category', 'price', 'name')

```


### Client libraries and schemas
A schema is a machine-readable document that describes the available API endpoints, their URLs, and what operations they support.

Available schemas are the Core API and Core API client.

Here is how to install the core API and Core API client:

```sh

pip install coreapi
pip install coreapi-cli

```

## Building a REST API with Django Rest Framework.
In this tutorial, we are going to build a simple eCommerce API.The API should have the ability to:

* Create a product
* View products
* Update and delete a product.


### Requirements

* Django
* Python


Let's get started.

Create a directory where you will keep your project and also create a virtual environment to install the project dependencies.

```sh

mkdir myprojects
cd myprojects
virtual venv

```

Activate virtual environment

```sh
source venv/bin/activate
```

Install Django.

```sh

pip install django

```

This will install the latest version of Django which is 1.11 at the time of writing this tutorial.

Create Django project.

```sh

django-admin startproject ecommerceapp

```

Install DRF using pip.

```sh

pip install djangorestframework

```
 Let's go ahead add rest_framework to the list of installed apps in  settings file.

```sh

#django_project/ecommerceapp/settings.py

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # add here
    'rest_framework', 
]

```

Create the store application.

```sh

cd ecommerceapp
django-admin.py startapp store

```

Add the store application to the list of installed apps in the ``settings.py`` file.

```sh

#django_project/ecommerceapp/settings.py

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework', 
    'store', # add here
]

```
Now the store application has integrated with the rest of the project.


Setting up Database for an eCommerce project.
We are going to use PostgreSQL database because its more stable.

#### Create Database and User

Create database ``ecommerce`` and assign a user.
Switch over to the Postgres account on your machine by typing:

```sh
sudo su postgres
```
Access a Postgres prompt: 
```sh
psql
```
Create database

```sh
CREATE DATABASE ecommerce;
```
Create role
```sh
CREATE ROLE linode  WITH LOGIN PASSWORD 'asdfgh';
```
Grant access to the the user ``linode``

```sh
GRANT ALL PRIVILEGES ON DATABASE bucketlist TO linode;
```
Install the psycopg2 package that will allow us to use the database we configured:

```sh
pip install psycopg2
```
Edit the currently configured SQLite database and use the Postgres database.

```sh
. . .

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'ecommerce',
        'USER': 'linode',
        'PASSWORD': 'asdfgh',
        'HOST': 'localhost',
        'PORT': '',
    }
}

. . .
```

#### Creating  models

In the store directory, there is a ``models.py`` file, let's create models for our products.

```sh
from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Products(models.Model):
    price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True)
    name = models.CharField(max_length=300)
    decription = models.CharField(max_length=1000)
    removed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(auto_now=True, editable=False)

    def __str__(self):
        """Return a readable object of the model instance."""
        return "{}".format(self.name)


```
#### Migrations.
Migrations provide a way of updating your database schema every time your models change without losing data.

Create an initial migration for our products model, and sync the database for the first time.

```sh

python manage.py make migrations products
python manage.py migrate

```

### Serializing models
As we mentioned in the beginning of this tutorial, serializers provide a way of changing data to a form that is easier understand, like JSON or XML. Deserialization does the opposite which is converting data to a form that can be saved to the database.

In the store app directory, create a file ``serializers.py`` and add the following code.

```sh

from rest_framework import serializers
from .models import Products


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Products
        fields = ('id', 'name', 'price', 'decription')
      

```


Here we are using the ``ModelSerializer`` class provided by Django.
The ``created`` and ``updated`` fields are set to ``editable== False``, so by default, they are read_only_fields.


### Writing the Views
Open ecommerceapp/store/views.py and start writing your views. We want to be able to add, view products, update and delete a product. 

```sh

from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import ProductSerializer
from rest_framework import generics
from rest_framework.response import Response
from .models import Products

# Create your views here.

class ProductsCreateView(generics.ListCreateAPIView):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer

```

The ``ProductsCreateView`` allows us to be able to view and add new products.


### Configuring URLs
URL's enables us to interact with our API's.
Create a file ``urls.py`` in your store directory. Add the following to it.

```sh

from django.conf.urls import url
from .views import ProductsCreateView


urlpatterns = [

    url(r'^products_list/$', ProductsCreateView.as_view()),

]
```

Run pplication
Now issue the runserver command ``python manage.py runserver`` , navigate to ``http://127.0.0.1:8000/products/``.As you can see you can be able to view all products as well as add new products to your store.

#### Update and delete products
Let's create a view that enables us to delete and update products.

```sh

from rest_framework import generics


class ProductsDetailsView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Products.objects.all()
    serializer_class = ProductSerializer
```

The ``RetrieveUpdateDestroyAPIView`` we have used is a generic view that provides support for 'get, put, patch and delete method handlers.
Update url's  as shown and don't forget to import the relevant views.

```sh

    from .views import ProductsCreateView, ProductsDetailsView

        urlpatterns = [
           .....

         url(r'^products_list/(?P<pk>[0-9]+)/$', ProductsDetailsView.as_view()),

    ]

```


Now navigate to ``http://127.0.0.1:8000/store/products_list/1/`` and you should be able to update the details of the given product or delete it altogether

#### Adding a Product



#### Viewing Products


#### Deleting and Updating a Product

























 

