import requests
import sys

def test_urls(edge_cases):
    hasErrors = False
    for edge in edge_cases:
        r =  requests.get(edge)
        if r.status_code == 404:
            print("Manual URL 404 test:",edge, "returned a 404")
            hasErrors = True
    if hasErrors:
        sys.exit(1)
    else:
        print("No 404s were found from manual test")

def main():
    edge_cases = ['http://localhost:1313/docs/contribute/thankyou']
    test_urls(edge_cases)

main()