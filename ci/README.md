Running on a virtual environment is recommended.

Install pip requirments:

    `pip install -r requirements.txt`

Start the Hugo development server. Runs on `localhost:1313/docs/` by default:

    `hugo server`

Run the test environment from the root directory. Python 3 is required.

    `python -m pytest`

To use multiple cores when running tests, add `-n` (2 is enough for current tests):

    `python -m pytest -n <Additional Cores>`

