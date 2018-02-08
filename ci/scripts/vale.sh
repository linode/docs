#!/bin/bash

go get github.com/ValeLint/vale
vale --glob='*.{md}' docs
