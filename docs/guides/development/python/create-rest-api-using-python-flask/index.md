---
slug: create-rest-api-using-python-flask
author:
  name: Linode Community
  email: docs@linode.com
description: 'Two to three sentences describing your guide.'
og_description: 'Two to three sentences describing your guide when shared on social media.'
keywords: ['list','of','keywords','and key phrases']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-08-17
modified_by:
  name: Linode
title: "Create a RESTful API Using Python and Flask"
h1_title: "How to Create a RESTful API Using Python and Flask"
enable_h1: true
contributor:
  name: Chelsea Troy
  link: https://twitter.com/HeyChelseaTroy
---

[Flask](https://flask.palletsprojects.com/en/2.0.x/) is a micro-framework used to create a Python-powered web API. Rather than prescribing a structure for an app, it provides the minimum toolset. It allows developers to build up whatever server structure they want, piece by piece. This guide shows you how to  use Flask to build a REST API that serves up information about programming languages. The API’s data comes [courtesy of Hillel Wayne’s research](https://www.hillelwayne.com/post/influential-dead-languages/) on influential programming languages. At the end of the guide, you will have an API that allows clients to complete the following:

- List all the programming languages
- Get a specific programming language
- Filter the languages based on publication year
- Create, update, and delete a programming language instance

## How to Create REST API Endpoints with Flask

The REST protocol gives clients access to the information stored on a database and allows them to perform actions on the stored data. Those are known as *CRUD operations*, which stands for *create*, *read*, *update*, and *destroy*. The following sections show you how to create the CRUD operations for your Flask web API.

### Install Flask

In order to run a Flask server you install Flask first using the Python Package Index (pip). Use the following command to install Flask:

    pip install flask

Create a directory for your app to live in. Inside that directory create a new file. In this example, the file is called `prog_lang_app.py`, but it can have any name:

  mkdir example_app && cd example_app
  touch prog_lang_app.py

### Create the List Endpoint in Flask

RESTful services typically have two endpoints for reading operations: the list and detail endpoints. A list endpoint retrieves all the API's records or filters them according to some criterion. A detail endpoint fetches a specific record based on a unique identifier. In this section you create the list endpoint for your API.

Open the `prog_lang_app.py` file, import flask, and instantiate the app. You can instantiate the class `Flask` and assign it to a name (traditionally, `app`).

{{< file "prog_lang_app.py" >}}
from flask import Flask
app = Flask(__name__)
{{< /file >}}

Although RESTful APIs typically accesses data from a database, this tutorial does not cover the [details of integrating with a database](https://flask.palletsprojects.com/en/2.0.x/tutorial/database/). Instead, create a small in-memory data store (Python dictionary) in your app with the content in the example file below. Place this code underneath the import and app instantiation lines.

{{< file >}}
...
in_memory_datastore = {
   "COBOL" : {"name": "COBOL", "publication_year": 1960, "contribution": "record data"},
   "ALGOL" : {"name": "ALGOL", "publication_year": 1958, "contribution": "scoping and nested functions"},
   "APL" : {"name": "APL", "publication_year": 1962, "contribution": "array processing"},
}
{{< /file >}}

The data records three attributes for each programming language: its name, the approximate year it was published, and its contributions to modern programming languages.

Below the in-memory datastore, you write a rudimentary list endpoint that fetches all the records in the database and displays them as JSON. RESTful APIs are generally organized around a resource. A resource refers to the database records that an API gives clients access to. In the case of this tutorial, the resource is an instance of a programming language.

Create the list endpoint with the code in the example below.

{{< file "prog_lang_app.py" >}}
...
@app.get('/programming_languages')
def list_programming_languages():
   return {"programming_languages":list(in_memory_datastore.values())}
{{< /file >}}

Requests can be sent to the `/programming_languages` URL using the GET HTTP verb. The request should be sent without any parameters. This endpoint fetches all the records in the datastore. It returns a JSON object with the key “programming_languages” that points to the records, represented as an array.

{{< note >}}
There are two reasons to put the list into an object with a label, rather than returning the raw array.. The first reason is a maintainability reason: an object provides the freedom to add more attributes to the return body later. For example, suppose you wanted to return a count of the objects in the database. You cannot add a count attribute to a raw array, but you can add a count attribute to an enclosing JSON object with one key that points to an array. This is especially useful in APIs that allow clients to filter sections of data or to request aggregate metrics for the data or sections of data. The historical reason you don’t do it is a security reason. Ten years ago, browsers didn't guard against malicious actors redefining the JSON array and obtaining access to raw JSON array payloads. It’s all patched now, but the programming community keeps on wrapping arrays in objects because of the maintainability benefit.
{{< /note >}}

Start the app to view the data returned by the list programming languages endpoint. Navigate to the directory where you stored the app. Then, run the following commands:

        export FLASK_APP=prog_lang_app.py
        flask run

Open a browser and visit `http://127.0.0.1:5000/` to access the app running locally on your computer.

Visit http://127.0.0.1:5000/programming_languages in the browser to view the JSON object containing the contents of the datastore you created.

### Create the Detail Endpoint in Flask

The next step is to add an endpoint to retrieve a specific programming language from the datastore. This endpoint has an interpolated variable in the endpoint string called `programming_language_id`. This variable allows you to query for a specific item in your datastore. The `id` refers to the index in the list related to a specific instance of a programming language resource. This presents a problem once clients can delete items from the datastore; you can fix it later.

Update the `prog_lang_app.py` file to add the code that creates your app's detail endpoint. This code goes underneath the code for listing the programming languages:

{{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages/<programming_language_name>')
def get_programming_language(programming_language_name):
   return in_memory_datastore[programming_language_name]
{{< /file >}}

Running the app and visit http://127.0.0.1:5000/programming_languages/COBOL in your browser. You should see a similar output returned by your API:

{{< output >}}
{"contribution":"record data","name":"COBOL","publication_year":1960}
{{< /output >}}

### Add Filters to the List Endpoint

Update the `prog_lang_app.py` file's dictionary with a few more programming language entries. Increasing the size of the datastore provides you with more data to filter. In this section you add code to filter the List endpoint using a specific date range.

Open the `prog_lang_app.py` file and edit the `in_memory_datastore` to add the additional keys:

{{< file "prog_lang_app.py" >}}
...
in_memory_datastore = {
   "COBOL": {"name": "COBOL", "publication_year": 1960, "contribution": "record data"},
   "ALGOL": {"name": "ALGOL", "publication_year": 1958, "contribution": "scoping and nested functions"},
   "APL": {"name": "APL", "publication_year": 1962, "contribution": "array processing"},
   "BASIC": {"name": "BASIC", "publication_year": 1964, "contribution": "runtime interpretation, office tooling"},
   "PL": {"name": "PL", "publication_year": 1966, "contribution": "constants, function overloading, pointers"},
   "SIMULA67": {"name": "SIMULA67", "publication_year": 1967,
                "contribution": "class/object split, subclassing, protected attributes"},
   "Pascal": {"name": "Pascal", "publication_year": 1970,
              "contribution": "modern unary, binary, and assignment operator syntax expectations"},
   "CLU": {"name": "CLU", "publication_year": 1975,
           "contribution": "iterators, abstract data types, generics, checked exceptions"},
}
...
{{< /file >}}

Now, you can add the code to allow clients to filter on the `publication_year` parameter. First, add the `Flask.request` object to your `prog_lang_app.py` file's import statement as shown below:

{{< file "prog_lang_app.py" >}}
from flask import Flask, request
app = Flask(__name__)
...
{{< /file >}}

Next, change the `list_programming_languages()` function to act upon the query parameters `before_year` and `after_year`.

{{< file "prog_lang_app.py" >}}
...
@app.get('/programming_languages')
def list_programming_languages():
   before_year = request.args.get('before_year') or '30000'
   after_year = request.args.get('after_year') or '0'
   qualifying_data = list(
       filter(
           lambda pl: int(before_year) > pl['publication_year'] > int(after_year),
           in_memory_datastore.values()
       )
   )

   return {"programming_languages": qualifying_data}

{{< /file >}}

Clients can now filter the programming languages with two query parameters: `before_year` and `after_year`. Flask automatically treats all parameters passed to a routed function, besides interpolated path parameters, as query parameters. If a client does not pass any query parameters, the default start year of `0` and the default end year of `30,000` automatically captures all languages.

The resulting objects go through a filter that picks out only the ones with a `publication_year` between the `before_year` and the `after_year`. A request without those query parameters continues to deliver all of the programming languages.

### Build a Create Endpoint

So far, all the endpoints expect clients to use the GET HTTP verb to make their requests. In this section, you write the code to support the POST HTTP verb. The create endpoint expects a POST verb as well as a request body. The request body is a payload of data that specifies the attributes of the new resource that the client wants to add. In this case, those attributes are sent as a JSON object. These attributes include the `name`, `publication_year`, and `contribution` of the programming language being added.

To use the same route in your API with different request verbs, write your code under the same annotation. Then, use conditional logic to route the request to the correct place. To do this, edit your `prog_lang_app.py` file to remove the `@app.get` annotation and modify it as show below:

{{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages', methods=['GET', 'POST'])
def programming_languages_route():
   if request.method == 'GET':
       return list_programming_languages()
   elif request.method == "POST":
       return create_programming_language(request.get_json(force=True))
{{< /file >}}

Now, add the new `create_programming_language` method below the following method below `list_programming_languages()` method:

{{< file "prog_lang_app.py" >}}
...
def create_programming_language(new_lang):
   language_name = new_lang['name']
   in_memory_datastore[language_name] = new_lang
   return new_lang

{{< /file >}}

The two helper functions handle listing programming languages, in the case of a get request. In the case of a POST request, the second helper function creates a new programming language resource. Use [Postman](https://www.postman.com/) or a similar request client to create a programming language with a request like the following:

    POST http://127.0.0.1:5000/programming_languages
    Request Body: {"name": "Java", "publication_year": 1995, "contribution": "Awesome coffee cup logo"}

Once you have created the new resource, make a GET request to `http://127.0.0.1:5000/programming_languages`. Notice that a resource for Java is returned in the JSON object.

### Create the Update Endpoint

To update a resource, you send a PUT request with a request body to the URL of the record you want to update. To achieve this you, use a similar tactic to the one you used in the previous section. Remove the the `@app.rout` annotation and the `get_programming_language()` function. Replace them with the following code:

{{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages/<programming_language_name>', methods=['GET', 'PUT'])
def programming_language_route(programming_language_name):
   if request.method == 'GET':
       return get_programming_language(programming_language_name)
   elif request.method == "PUT":
       return update_programming_language(programming_language_name, request.get_json(force=True))
{{< /file >}}

Now, add the new `update_programming_language()` function below the `get_programming_language()` function:

{{< file "prog_lang_app.py" >}}
...
def update_programming_language(lang_name, new_lang_attributes):
   lang_getting_update = in_memory_datastore[lang_name]
   lang_getting_update.update(new_lang_attributes)
   return lang_getting_update
{{< /file >}}

To test your new endpoint, send a request to it to update an existing resource. For example, send a request using Postman similar the to the following:

    PUT http://127.0.0.1:5000/programming_languages/Java
    Request Body: {"contribution": "The JVM"}

Send a GET request to the list endpoint to view the update to the Java contribution you issued in your PUT request.

### Create the Delete Record Endpoint

The endpoint to delete a record is similar to the update endpoint. The difference is the HTTP verb that you use. RESTful services conventionally use a DELETE verb for the delete endpoint.

Update your `@app.route` annotation to include the `DELETE` method, as shown below:

{{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages/<programming_language_name>', methods=['GET', 'PUT', 'DELETE'])
def programming_language_route(programming_language_name):
   if request.method == 'GET':
       return get_programming_language(programming_language_name)
   elif request.method == "PUT":
       return update_programming_language(programming_language_name, request.get_json(force=True))
   elif request.method == "DELETE":
       return delete_programming_language(programming_language_name)
{{< /file >}}

Notice the addition of `DELETE` is passed to the methods parameter in the annotation.

Next, add the `delete_programming_language()` function below the `update_programming_language()` function:

{{< file "prog_lang_app.py" >}}
...
def delete_programming_language(lang_name):
   deleting_lang = in_memory_datastore[lang_name]
   del in_memory_datastore[lang_name]
   return deleting_lang
{{< /file >}}

To delete a resource, use your preferred request client and issue the following request:

    DELETE http://127.0.0.1:5000/programming_languages/COBOL

The return value is the COBOL JSON object. A visit to the list endpoint reveals that COBOL is no longer in the list of languages.

You can view the entirety of the app in the example `prog_lang_app.py`file. This file contains the Create, Update, and Destroy endpoints. Flask includes many specialized options in addition to the basics covered in this guide. Refer to [Flask’s official documentation](https://flask.palletsprojects.com/en/2.0.x/) to learn how to enhance the API created in this tutorial.

