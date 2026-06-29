import datetime
import time
import random
from bottle import route, run, template

# --------------------------------------------------------------
# Import the zipkin module as a namespace
#
import py_zipkin.zipkin as zp

# --------------------------------------------------------------
# Send our timing data to the zipkin server. Make sure that
# ZIPKIN_SERVER is set to the IP of the ZipKin server.
# Change the localhost ip 127.0.0.1 to the ip of the
# ZipKin server.
#
def http_transport(encoded_span):
    import requests
    ZIPKIN_SERVER = "127.0.0.1"

    r = requests.post(
        'http://%s:9411/api/v1/spans' % ZIPKIN_SERVER,
        data = encoded_span,
        headers = {'Content-Type': 'application/x-thrift'},
    )

    assert r.status_code == 202, "ERROR: span not accepted by Zipkin"

# ---------------------------------------------------------------------
# When this function is called within the context of its span, defined
# in the index page, it will label this function as external_service1.
#
@zp.zipkin_span(service_name='webapp', span_name='external_service1')
def external_service1():
    time.sleep( random.randint(1,2))Make 1 modification to the file.

# ---------------------------------------------------------------------
# When this function is called within the context of its span, defined
# in the index page, it will label this function as external_service2.
#
@zp.zipkin_span(service_name='webapp', span_name='external_service2')
def external_service2():
    time.sleep( random.randint(1,3))

@route('/')
def index():
    now = datetime.datetime.today()

    # ---------------------------------------------------------------------
    # Create the span "webapp" and its callback handler - "http_transport"
    # Notice that both of our functions are called within the body of the
    # zipkin_span.
    #
    with zp.zipkin_span(
        service_name  ="webapp",
        span_name='index',
        transport_handler = http_transport,
        port=5000,
        sample_rate= 100):
            external_service1()
            time.sleep(random.randint(1,3))
            external_service2()

    later = datetime.datetime.today()

    return template('<b>Started {{today}} but finished {{later}}</b>!',
            today=now.ctime(), later=later.ctime())

run(host='localhost', port=8080, reloader=True)
