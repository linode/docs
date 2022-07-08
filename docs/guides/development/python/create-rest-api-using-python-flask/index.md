---
slug: create-restful-api-using-python-and-flask
author:
  name: Chelsea Troy
description: 'In this guide, you learn how to create a REST API using Python and Flask. The example API serves up information about programming languages.'
keywords: ['python flask api']
tags: ['python']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2021-09-24
modified_by:
  name: Linode
title: "Create a RESTful API Using Python and Flask"
h1_title: "How to Create a RESTful API Using Python and Flask"
enable_h1: true
contributor:
  name: Chelsea Troy
  link: https://twitter.com/HeyChelseaTroy
---

[Flask](https://flask.palletsprojects.com/en/2.0.x/) is a Python micro-framework for building web applications and web APIs. The framework provides pared-down core functionality, however, it is highly extensible. This guide shows you how to use Flask to build a REST API that serves up information about different programming languages. The data information exposed by the API can also be referred to as a *resource*. The API’s data comes from [Hillel Wayne’s research](https://www.hillelwayne.com/post/influential-dead-languages/) on influential programming languages. At the end of the guide, you have an API that allows clients to complete the following:

- GET all programming languages stored in the API
- GET a specific instance of a programming language
- Filter the programming language resources based on the publication year field
- POST, PUT, and DELETE a programming language instance

{{< note >}}
GET, POST, PUT, and DELETE are [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) used to perform an action on a resource.
{{</ note >}}

## How to Create REST API Endpoints with Flask

The REST protocol gives clients access to resources stored in a database and allows clients to perform operations on the stored data. The operations are known as *CRUD operations* (create, read, update, and delete). The following sections show you how to create the CRUD operations for your Flask web API.

### Install Flask

{{< note >}}
This section makes use of the [virtualenv](https://pypi.org/project/virtualenv/) tool to create a virtual environment on your system. Follow the installation steps in our [How to Create a Python Virtual Environment](/docs/guides/create-a-python-virtualenv-on-debian-10/) guide if you do not have virtualenv installed on your computer.
{{</ note >}}

- Create a directory to store your Flask web application and move into the directory.

        mkdir example_app && cd example_app

- Inside the `example_app` directory, create a new file named `prog_lang_app.py`.

        mkdir example_app && cd example_app
        touch prog_lang_app.py

- Create and activate a virtual environment using the following command:

        python3 -m venv venv
        . venv/bin/activate

In order to run a Flask server, you install Flask first using the [Python Package Index (pip)](/docs/guides/how-to-create-a-private-python-package-repository/). Use the following command to install Flask:

    pip install flask

### Create the List Endpoint in Flask

RESTful services typically have two endpoints used to retrieve (GET) resources. One endpoint *lists* all resources or filters them according to some criterion. The second endpoint retrieves the *details* of a specific resource based on a unique identifier. In this section, you create two endpoints to GET resources from your API. This section may refer to these endpoints as the `list` and `details` endpoints.

{{< note >}}
All the steps in this section edit the same file, `prog_lang_app.py`.
{{</ note >}}

- In your preferred text editor, open the `prog_lang_app.py` file and add the following lines:

    {{< file "prog_lang_app.py" >}}
from flask import Flask
app = Flask(__name__)
    {{< /file >}}

    These lines import Flask, and instantiate the app. You can instantiate the class `Flask` and assign it to a variable (traditionally, this variable is named `app`)

    {{< note >}}
Although RESTful APIs typically access data from a database, this tutorial does not cover the [details of integrating with a database](https://flask.palletsprojects.com/en/2.0.x/tutorial/database/).
    {{</ note >}}

- Create a small in-memory data store (Python dictionary) to store the data related to programming languages. Place this code underneath the import and app instantiation lines.

    {{< file >}}
...
in_memory_datastore = {
   "COBOL" : {"name": "COBOL", "publication_year": 1960, "contribution": "record data"},
   "ALGOL" : {"name": "ALGOL", "publication_year": 1958, "contribution": "scoping and nested functions"},
   "APL" : {"name": "APL", "publication_year": 1962, "contribution": "array processing"},
}
    {{< /file >}}

    The code creates the `in_memory_datastore` nested dictionary with entries for three programming language. Each programming language dictionary has keys for its name, the approximate year it was published, and its contributions to modern programming languages.

- Create the `list` endpoint with the code in the example below. Below the `in-memory datastore` dictionary, a rudimentary list endpoint fetches all the programming language resources and displays them as JSON.

    {{< note >}}
RESTful APIs are generally organized around a resource. A resource refers to the database records that an API gives clients access to. In the case of this tutorial, the resource is an instance of a programming language.
    {{</ note >}}

    {{< file "prog_lang_app.py" >}}
...
@app.get('/programming_languages')
def list_programming_languages():
   return {"programming_languages":list(in_memory_datastore.values())}
    {{< /file >}}

    Requests can be sent to the `/programming_languages` URL using the GET HTTP verb. The request should be sent without any parameters. This endpoint fetches all the records in the datastore. It returns a JSON object with the key `programming_languages`. This key points to all the records and is represented as an array.

    {{< note >}}
There are two reasons to put the list into an object with a label, rather than returning the raw array.

1. *Maintainability*: an object provides the freedom to add more attributes to the return body later. For example, suppose you wanted to return a count of the objects in the database. You cannot add a count attribute to a raw array, but you can add a count attribute to an enclosing JSON object with one key that points to an array. This is especially useful in APIs that allow clients to filter sections of data or to request aggregate metrics for the data or sections of data.

1. *Security*: ten years ago, browsers didn't guard against malicious actors redefining the JSON array and obtaining access to raw JSON array payloads. It’s all patched now, but the programming community keeps on wrapping arrays in objects because of the maintainability benefit.
    {{< /note >}}

- Start the app to view the data returned by the `list` programming languages endpoint. Navigate to the directory where you stored the app. Then, run the following commands:

        export FLASK_APP=prog_lang_app.py
        flask run

- Open a browser and visit `http://127.0.0.1:5000/` to access the app running locally on your computer.

- Visit `http://127.0.0.1:5000/programming_languages` in the browser to view the JSON object containing the contents of the datastore you created.

### Create the Detail Endpoint in Flask

The next step is to add an endpoint to retrieve a specific programming language resource from the datastore. The `details` endpoint has an interpolated variable in the endpoint string called `programming_language_id`. This variable allows you to query for a specific item in your datastore. The `id` refers to the index in the list related to a specific instance of a programming language resource. This presents a problem once clients can delete items from the datastore. This is fixed in a later section.

- Update the `prog_lang_app.py` file to add the code that creates your app's detail endpoint. This code goes underneath the code for listing the programming languages:

    {{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages/<programming_language_name>')
def get_programming_language(programming_language_name):
   return in_memory_datastore[programming_language_name]
    {{< /file >}}

- Run the app and visit `http://127.0.0.1:5000/programming_languages/COBOL` in your browser. You should see a similar output returned by your API.

    {{< output >}}
{"contribution":"record data","name":"COBOL","publication_year":1960}
    {{< /output >}}

### Add Filters to the List Endpoint

Update the `prog_lang_app.py` file's `in_memory_datastore` dictionary with a few more programming language entries. Increasing the size of the datastore provides you with more data to filter. In this section, you add code to filter the `list` endpoint using a specific date range.

- Open the `prog_lang_app.py` file and edit the `in_memory_datastore` to add the additional entries.

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

- Now, you can add the code to allow clients to filter on the `publication_year` parameter. First, add the `Flask.request` object to your `prog_lang_app.py` file's import statement as shown below:

    {{< file "prog_lang_app.py" >}}
from flask import Flask, request
app = Flask(__name__)
...
    {{< /file >}}

- Next, change the `list_programming_languages()` function to act upon the query parameters `before_year` and `after_year`.

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

    Clients can now filter the programming languages with two query parameters: `before_year` and `after_year`. Flask automatically treats all parameters passed to a routed function (besides interpolated path parameters) as query parameters. If a client does not pass any query parameters, the default start year of `0` and the default end year of `30,000` automatically capture all languages.

    The resulting objects go through a filter that picks out only the ones with a `publication_year` between the `before_year` and the `after_year`. A request without those query parameters continues to deliver all of the programming languages.

### Build a Create Endpoint

So far, all the endpoints expect clients to use the GET HTTP verb to make their requests. In this section, you write the code to support the POST HTTP verb. The `create` endpoint expects a POST verb as well as a request body. The request body is a payload of data that specifies the attributes of the new resource that the client wants to add. In this case, those attributes are sent as a JSON object. These attributes include the `name`, `publication_year`, and `contribution` of the programming language being added.

- To use the same route in your API with different request verbs, write your code under the same annotation. Then, use conditional logic to route the request to the correct place. To do this, edit your `prog_lang_app.py` file to remove the `@app.get` annotation and modify it as shown below:

    {{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages', methods=['GET', 'POST'])
def programming_languages_route():
   if request.method == 'GET':
       return list_programming_languages()
   elif request.method == "POST":
       return create_programming_language(request.get_json(force=True))
    {{< /file >}}

- Now, add the new `create_programming_language` method below `list_programming_languages()` method:

    {{< file "prog_lang_app.py" >}}
...
def create_programming_language(new_lang):
   language_name = new_lang['name']
   in_memory_datastore[language_name] = new_lang
   return new_lang

    {{< /file >}}

- The two helper functions handle listing programming languages, in the case of a GET request. In the case of a POST request, the second helper function creates a new programming language resource. Use cURL to create a programming language on the command line:

        curl -X POST http://127.0.0.1:5000/programming_languages
            -H 'Content-Type: application/json'
            -d '{"name": "Java", "publication_year": 1995, "contribution": "Object-oriented programming language."}'

- Once you have created the new resource, make a GET request to `http://127.0.0.1:5000/programming_languages`.

        curl http://127.0.0.1:5000/programming_languages

    Notice that a resource for `Java` is returned in the JSON object.

### Create the Update Endpoint

To update a resource, you send a PUT request with a request body to the URL of the record you want to update. To achieve this you, use a similar tactic to the one you used in the previous section.

- Remove the `@app.route` annotation and the `get_programming_language()` function. Replace them with the following code:

    {{< file "prog_lang_app.py" >}}
...
@app.route('/programming_languages/<programming_language_name>', methods=['GET', 'PUT'])
def programming_language_route(programming_language_name):
   if request.method == 'GET':
       return get_programming_language(programming_language_name)
   elif request.method == "PUT":
       return update_programming_language(programming_language_name, request.get_json(force=True))
    {{< /file >}}

- Now, add the new `update_programming_language()` function below the `get_programming_language()` function:

    {{< file "prog_lang_app.py" >}}
...
def update_programming_language(lang_name, new_lang_attributes):
   lang_getting_update = in_memory_datastore[lang_name]
   lang_getting_update.update(new_lang_attributes)
   return lang_getting_update
    {{< /file >}}

- To test your new endpoint, send a request to it to update an existing resource. For example, send a request using Postman similar to the following:

        curl -X PUT http://127.0.0.1:5000/programming_languages/Java
            -H 'Content-Type: application/json'
            -d '{"contribution": "The JVM"}'

- Send a GET request to the `list` endpoint to view the update made to the Java contribution you issued in your PUT request.

        curl http://127.0.0.1:5000/programming_languages

### Create the Delete Record Endpoint

The endpoint to delete a record is similar to the update endpoint. The difference is the HTTP verb that you use. RESTful services conventionally use a DELETE verb for the delete endpoint.

- Update your `@app.route` annotation to include the `DELETE` method, as shown below:

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

    Notice the addition of `DELETE` is passed to the method's parameter in the annotation.

- Next, add the `delete_programming_language()` function below the `update_programming_language()` function:

    {{< file "prog_lang_app.py" >}}
...
def delete_programming_language(lang_name):
   deleting_lang = in_memory_datastore[lang_name]
   del in_memory_datastore[lang_name]
   return deleting_lang
    {{< /file >}}

- To delete a resource, use your preferred request client and issue the following request:

        curl -X DELETE http://127.0.0.1:5000/programming_languages/COBOL

    The return value is the COBOL JSON object. A visit to the `List` endpoint reveals that COBOL is no longer in the list of languages.

You can view the entirety of the app in [the example `prog_lang_app.txt` file](prog_lang_app.txt). This file contains all endpoints created in this guide. Flask includes many specialized options in addition to the basics covered in this guide. Refer to [Flask’s official documentation](https://flask.palletsprojects.com/en/2.0.x/) to learn how to enhance the API created in this tutorial.
