from flask import Flask, request

app = Flask(__name__)

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

@app.route('/programming_languages', methods=['GET', 'POST'])
def programming_languages_route():
   if request.method == 'GET':
       return list_programming_languages()
   elif request.method == "POST":
       return create_programming_language(request.get_json(force=True))

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

def create_programming_language(new_lang):
   language_name = new_lang['name']
   in_memory_datastore[language_name] = new_lang
   return new_lang

@app.route('/programming_languages/<programming_language_name>', methods=['GET', 'PUT', 'DELETE'])
def programming_language_route(programming_language_name):
   if request.method == 'GET':
       return get_programming_language(programming_language_name)
   elif request.method == "PUT":
       return update_programming_language(programming_language_name, request.get_json(force=True))
   elif request.method == "DELETE":
       return delete_programming_language(programming_language_name)

def get_programming_language(programming_language_name):
   return in_memory_datastore[programming_language_name]

def update_programming_language(lang_name, new_lang_attributes):
   lang_getting_update = in_memory_datastore[lang_name]
   lang_getting_update.update(new_lang_attributes)
   return lang_getting_update

def delete_programming_language(lang_name):
   deleting_lang = in_memory_datastore[lang_name]
   del in_memory_datastore[lang_name]
   return deleting_lang
