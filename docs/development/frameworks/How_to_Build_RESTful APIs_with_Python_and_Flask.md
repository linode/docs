---
author:
  name: Onwuka Gideon
  email: dongidomed@gmail.com
description: 'This guide will show you how to build a RESTful API using Flask - python framework'
keywords: ["development", "python", "API", "flask", "REST", ""]
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
aliases: ['applications/development/frameworks']
published: 2017-04-14
title: How to
external_resources:
  - [Flask](http://flask.pocoo.org)
  - [Flask-restful extension](http://flask-restful.readthedocs.io)
---

# How to Build RESTful APIs with Python and Flask

Flask is a Python-based microframework that enables you to quickly build web applications; the “micro” in microframework simply means Flask aims to keep the core simple but [extensible](http://flask.pocoo.org/docs/0.12/foreword/#what-does-micro-mean).

This guide will walk you through building a Restful APi with Flask coupled with other extensions like Flask-RESTful etc. At the end, you build a simple Commenting API. The API will have endpoints that can be used to `add category`, `view categories`, `add comments` and `view comments`.

  :light: Flask does not come out of the box with all the extension needed to buld this API. However there are lot's of extension that can be pluged into Flask to enable you build our awesome applications.

Below are the endpoints that we'll be created at the end of this guide:

- GET  - /api/Category - Retrieve all the stored categories
- POST - /api/Category - Add new category

- GET  - /api/Comment -  Retrieve all the stored comments
- POST - /api/Comment -  Add new comment

## Before You Begin

- Make sure you have [Python3.x](https://www.python.org) installed on your system.

- We'll use [PostgreSQL](https://www.postgresql.org) database for this tutorial. Install Postgres database if you don't have it already.

- Make sure [virtualenv](http://docs.python-guide.org/en/latest/dev/virtualenvs/#lower-level-virtualenv) is installed on your system.


## Step 0: Setting up the application

- First, Create the structure of the app anywhere on your system:

```
project/
├── app.py
├── migrate.py
├── Model.py
├── requirements.txt
├── resources
│   └── Hello.py
└── run.py
```

- Then open up your command prompt and CD into the app root folder - `project`.

- Now, create and activate a [virtual environment](http://docs.python-guide.org/en/latest/dev/virtualenvs/#lower-level-virtualenv).

  virtualenv is a tool to create isolated Python environments. virtualenv creates a folder which contains all the necessary executables to use the packages that a Python project would need.

Creates virtual environment

```
python3.6 -m venv env
```

Activates the virtual environment

```
source env/bin/activate
```

Add the folowing extensions to `requirements.txt`:

```
flask
flask_restful
flask_script
flask_migrate
marshmallow
flask_sqlalchemy
flask_marshmallow
marshmallow-sqlalchemy
psycopg2
```

The above file contains all python extensions the API will need.

- [flask](http://flask.pocoo.org) - This is a microframework for Python

- [flask_restful](https://flask-restful.readthedocs.io/) - This is an extension for Flask that adds support for quickly building REST APIs.

- [flask_script](https://flask-script.readthedocs.io/) - This is extension provides support for writing external scripts in Flask.

- [flask_migrate](https://flask-migrate.readthedocs.io) - This is an extension that handles SQLAlchemy database migrations for Flask applications using Alembic.

- [marshmallow](https://marshmallow.readthedocs.io/) - This is an ORM/ODM/framework-agnostic library for converting complex datatypes, such as objects, to and from native Python datatypes. We'll use this for validation.

- [flask_sqlalchemy](http://flask-sqlalchemy.pocoo.org) - This is an extension for Flask that adds support for SQLAlchemy.

- [flask_marshmallow](https://flask-marshmallow.readthedocs.io) - This is an ntegration layer for Flask and marshmallow (an object serialization/deserialization library) that adds additional features to marshmallow.

- [marshmallow-sqlalchemy](https://marshmallow-sqlalchemy.readthedocs.io) - This adds additional features to marshmallow.

- [psycopg](http://initd.org/psycopg/) - This is a PostgreSQL adapter for the Python programming language.


## Step 1: Install all dependencies:

From your terminal, make sure you are in the root folder of the project then run the below command:

```
pip install -r requirements.txt
```

This will download and install all the extensions inside `requirements.txt`

## Step 3: Set app config

Add the following code to `config.py`:

```python
import os

# You need to replace the next values with the appropriate values for your configuration
basedir = os.path.abspath(os.path.dirname(__file__))
SQLALCHEMY_ECHO = False
SQLALCHEMY_TRACK_MODIFICATIONS = True
SQLALCHEMY_DATABASE_URI = "postgresql://username:password@localhost/database_name"
```

We have defined the configuration that the API will be using. We are also using postgreSQL database. You can use any database type that you prefer, you just have to modify the value accordingly.

example: if you want to use SQLite, this how this line should be:

```
SQLALCHEMY_DATABASE_URI = "sqlite:///app.db"
```

  Make sure you change the above settings with the appropriate values for your configuration.

## Step 1: Create the API entry point

Add the following code to `app.py`:

```python
from flask import Blueprint
from flask_restful import Api
from resources.Hello import Hello

api_bp = Blueprint('api', __name__)
api = Api(api_bp)

# Route
api.add_resource(Hello, '/Hello')
```
Here we imported `Blueprint` from flask, and also `Api` from flask_restful. The imported `Api` will add some functionality to flask which will help us to add routes and simplify some process.

`api_bp = Blueprint('api', __name__)` - created a Blueprint which we'll register to the app later.

`api.add_resource(Hello, '/Hello')` - creates a route - `/Hello`. add_resource has two parameter - `Hello` and `/Hello`.
`Hello` is the class we have imported and `/Hello` is the route we defined for that Resource. 

Now let's create the `Hello` class mentioned above. Add the follwowing code to - `resource/Hello.py`:

```python
from flask_restful import Resource


class Hello(Resource):
    def get(self):
        return {"message": "Hello, World!"}
```

In the Hello class, we have a defined a function - `get`. This means that any GET Request on the `/Hello` endpoint will be hitting that function.

So if you need a POST method, you should have something like:

```python
    def post(self):
        return {"message": "Hello, World!"}
```

Finally, add the following code to `run.py`:

```python
from flask import Flask


def create_app(config_filename):
    app = Flask(__name__)
    app.config.from_object(config_filename)
    
    from app import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    return app


if __name__ == "__main__":
    app = create_app("config")
    app.run(debug=True)
```

## Step 2: Starting the Server

From your terminal, make sure you are on the root folder of the app then run this command:

```
python run.py
```

If everything goes fine at this point, you should have an output like the below:

```
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 136-695-873
```

Now, Visit the URL(http://127.0.0.1:5000/api/Hello), you should see an output as below:

```
{
    "hello": "world"
}
```
Awesome! :smile:

## Step 3: Creating Models.

Up next is to write our models. Flask provides developers with the power and flexibility of the SQL Alchemy ORM to manage and query the application data. ORM stands for Object Relational Mapper, it is a tool that allows developers to store and retrieve data using object oriented approaches and solving the object-relational impedance mismatch.

Also, Flask-SQLAlchemy is an extension that provides support for SQLAlchemy ORM in the Flask framework.


In the - `Model.py` file, add the following code to it:

```python
from flask import Flask
from marshmallow import Schema, fields, pre_load, validate
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy


ma = Marshmallow()
db = SQLAlchemy()


class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    comment = db.Column(db.String(250), nullable=False)
    creation_date = db.Column(db.TIMESTAMP, server_default=db.func.current_timestamp(), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id', ondelete='CASCADE'), nullable=False)
    category = db.relationship('Category', backref=db.backref('comments', lazy='dynamic' ))

    def __init__(self, comment, category_id):
        self.comment = comment
        self.category_id = category_id


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)

    def __init__(self, name):
        self.name = name


class CategorySchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)


class CommentSchema(ma.Schema):
    id = fields.Integer(dump_only=True)
    category_id = fields.Integer(required=True)
    comment = fields.String(required=True, validate=validate.Length(1))
    creation_date = fields.DateTime()
```

Here, we have two models - `Comment` and `Category` class. These Class defines our table structure.
`__tablename__ = 'categories'` is used to declare the table name associated with that Model.

We've also defined columns for our table using eg:

```
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), unique=True, nullable=False)
```

The `id` and `name` are the columns for the table and the the value after the `=` defines column structure. You can read more on creating table schema [here](http://docs.sqlalchemy.org/en/latest/orm/tutorial.html#create-a-schema)

Moving on, the `CategorySchema` and `CommentSchema` are used for validation. In there, we have defined some rules( eg: `required=True`). You can read more [here](https://flask-marshmallow.readthedocs.io/en/latest/)


## Step 4: Running migrations

Create a new file - `migrate.py` in the root folder of the app. Then add the following code to it:

```python
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from Model import db
from run import create_app

app = create_app('config')

migrate = Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)


if __name__ == '__main__':
    manager.run()
```
Here, we have created a command for running migration from the command prompt.

### Migrations

Migrations are like version control for your database, allowing your team to easily modify and share the application's database schema. If you have ever had to tell a teammate to manually add a column to their local database schema, you've faced the problem that database migrations solve. In this tutorial, we are using a flask extension - flask migrate to acheive this.

- Run migrations initialization, using the db init command as follows:

```
  python migrate.py db init
```

```
  Creating directory /home/dongido/Desktop/pylinone/migrations ... done
  Creating directory /home/dongido/Desktop/pylinone/migrations/versions ... done
  Generating /home/dongido/Desktop/pylinone/migrations/alembic.ini ... done
  Generating /home/dongido/Desktop/pylinone/migrations/README ... done
  Generating /home/dongido/Desktop/pylinone/migrations/env.py ... done
  Generating /home/dongido/Desktop/pylinone/migrations/script.py.mako ... done
  Please edit configuration/connection/logging settings in '/home/dongido/Desktop/pylinone/migrations/alembic.ini' before
  proceeding.
```

The script also generated a new migrations sub-folder within the folder with a versions subfolder and many other files.

Run the second script that populates the migration script with the detected changes in the
models. In this case, it is the first time we populate the migration script, and therefore, the
migration script will generate the tables that will persist our two models: Category and Comment:

Run the migration:

```
python migrate.py db migrate
```

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.autogenerate.compare] Detected added table 'category'
INFO  [alembic.autogenerate.compare] Detected added table 'comment'
  Generating /home/dongido/Desktop/pylinone/migrations/versions/015c8b601c6b_.py ... done
```

- Then apply the migration to the database. Run the upgrade command:

- Run the upgrade command:

python migrate.py db upgrade

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 015c8b601c6b, empty message
```

  Each time the database models change repeat the `migrate` and `upgrade` commands. 

## Step 5: Add resources

Create a new file `resources/Comment.py`. This will take care of all Comments related Logic.

```python
from flask import jsonify, request
from flask_restful import Resource
from Model import db, Comment, Category, CommentSchema

comments_schema = CommentSchema(many=True)
comment_schema = CommentSchema()

class CommentResource(Resource):
    def get(self):
        comments = Comment.query.all()
        comments = comments_schema.dump(comments).data
        return comments

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = comment_schema.load(json_data)
        if errors:
            return {"status": "error", "data": errors}, 422
        category_id = Category.query.filter_by(id=data['category_id']).first()
        if not category_id:
            return {'status': 'error', 'message': 'comment category not found'}, 400
        comment = Comment(
            category_id=data['category_id'], 
            comment=data['comment']
            )
        db.session.add(comment)
        db.session.commit()

        result = comment_schema.dump(comment).data

        return {'status': "success", 'data': result}, 201
```
 
Also,  Create a new file `resources/Category.py`. This will take care of all Category related Logic.

```python
from flask import request
from flask_restful import Resource
from Model import db, Category, CategorySchema

categories_schema = CategorySchema(many=True)
category_schema = CategorySchema()

class CategoryResource(Resource):
    def get(self):
        categories = Category.query.all()
        categories = categories_schema.dump(categories).data
        return categories

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = category_schema.load(json_data)
        pprint(errors)
        if errors:
            return errors, 422
        category = Category.query.filter_by(name=data['name']).first()
        if category:
            return {'message': 'Category already exists'}, 400
        category = Category(
            name=json_data['name']on] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 015c8b601c6b, empty message
```

## Step 5: Add resources

Create a new file `resources/Comment.py`. This will take care of all Comments related Logic.

```python
from flask import jsonify, request
from flask_restf ul import Resource
from Model import db, Comment, Category, CommentSchema

comments_schema = CommentSchema(many=True)
comment_schema = CommentSchema()

class CommentResource(Resource):
    def get(self):
        comments = Comment.query.all()
        comments = comments_schema.dump(comments).data
        return {"status":"success", "data":comments}, 200

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = comment_schema.load(json_data)
        if errors:
            return {"status": "error", "data": errors}, 422
        category_id = Category.query.filter_by(id=data['category_id']).first()
        if not category_id:
            return {'status': 'error', 'message': 'comment category not found'}, 400
        comment = Comment(
            category_id=data['category_id'], 
            comment=data['comment']
            )
        db.session.add(comment)
        db.session.commit()

        result = comment_schema.dump(comment).data

        return {'status': "success", 'data': result}, 201
```
 
Also,  Create a new file `resources/Category.py`. This will take care of all Category related Logic.

```python
from flask import request
from flask_restful import Resource
from Model import db, Category, CategorySchema

categories_schema = CategorySchema(many=True)
category_schema = CategorySchema()

class CategoryResource(Resource):
    def get(self):
        categories = Category.query.all()
        categories = categories_schema.dump(categories).data
        return {'status': 'success', 'data': categories}, 200

    def post(self):
        json_data = request.get_json(force=True)
        if not json_data:
               return {'message': 'No input data provided'}, 400
        # Validate and deserialize input
        data, errors = category_schema.load(json_data)
        pprint(errors)
        if errors:
            return errors, 422
        category = Category.query.filter_by(name=data['name']).first()
        if category:
            return {'message': 'Category already exists'}, 400
        category = Category(
            name=json_data['name']
            )

        db.session.add(category)
        db.session.commit()

        result = category_schema.dump(category).data

        return { "status": 'success', 'data': result}
```


Finaly, Import these resources to `app.py`. Update `app.py` exactly as below:

```python
from flask import Blueprint
from flask_restful import Api
from resources.Hello import Hello
from resources.Comment import CommentResource
from resources.Category import CategoryResource


api_bp = Blueprint('api', __name__)
api = Api(api_bp)

# Routes

api.add_resource(Hello, '/Hello')
api.add_resource(CategoryResource, '/Category')
api.add_resource(CommentResource, '/Comment')
```

## Step 6: Test Enpoints

We now have the following endpoints available:

 * POST - http://127.0.0.1:5000/api/category - for adding categories.

![Creating Cetegories](../../assets/how_to_build_restful_apis_using_flask/how_to_build_restful_apis_using_flask_creating_categories.png)

 * GET  -  http://127.0.0.1:5000/api/category - for listing categories.

![Listing Cetegories](../../assets/how_to_build_restful_apis_using_flask/how_to_build_restful_apis_using_flask_listing_categories.png)

 * POST - http://127.0.0.1:5000/api/comment - for adding comment.

![Creating Comment](../../assets/how_to_build_restful_apis_using_flask/how_to_build_restful_apis_using_flask_creating_comment.png)

 * GET  -  http://127.0.0.1:5000/api/comment - for listing comments.

![Listing Comment](../../assets/how_to_build_restful_apis_using_flask/how_to_build_restful_apis_in_flask_listing_comments.png)