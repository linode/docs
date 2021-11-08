function! example-plugin#DisplayTime(...)
    if a:0 > 0 && (a:1 == "d" || a:1 == "t")
        if a:1 == "d"
            echo strftime("%b %d")
        elseif a:1 == "t"
            echo strftime("%H:%M")
        endif
    else
        echo strftime("%b %d %H:%M")
    endif
endfunction


" Starts a section for Python 3 code.
python3 << EOF
# Imports Python modules to be used by the plugin.
import vim
import json, requests

# Sets up variables for the HTTP requests the
# plugin makes to fetch word definitions from
# the Wiktionary dictionary.
request_headers = { "accept": "application/json" }
request_base_url = "https://en.wiktionary.org/api/rest_v1/page/definition/"
request_url_options = "?redirect=true"

# Fetches available definitions for a given word.
def get_word_definitions(word_to_define):
    response = requests.get(request_base_url + word_to_define + request_url_options, headers=request_headers)

    if (response.status_code != 200):
        print(response.status_code + ": " + response.reason)
        return

    definition_json = json.loads(response.text)

    for definition_item in definition_json["en"]:
        print(definition_item["partOfSpeech"])

        for definition in definition_item["definitions"]:
            print(" - " + definition["definition"])
EOF

" Calls the Python 3 function.
function! example-plugin#DefineWord()
    let cursorWord = expand('<cword>')
    python3 get_word_definitions(vim.eval('cursorWord'))
endfunction

function! example-plugin#AspellCheck()
    let cursorWord = expand('<cword>')
    let aspellSuggestions = system("echo '" . cursorWord . "' | aspell -a")
    let aspellSuggestions = substitute(aspellSuggestions, "& .* 0:", "", "g")
    let aspellSuggestions = substitute(aspellSuggestions, ", ", "\n", "g")
    echo aspellSuggestions
endfunction
