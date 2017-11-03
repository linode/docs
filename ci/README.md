Running on a virtual environment is recommended.

Navigate to project root directory. Install pip requirments:

    `pip install -r ci/requirements.txt`

Start the Hugo development server:

    `gulp dev`

Start scrapy to check for 404s. Output results in a csv file:

    `scrapy runspider docs404.py -t csv -o result.csv`

Run the test environment. Python 3 is required.

    `python -m pytest`


