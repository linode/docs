//usr/bin/env go run -mod=readonly "$0" "$@"; exit "$?"
package main

import (
	"os"
	"log"
	"strings"
	"io"

	"github.com/alexflint/go-arg"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/opt"
)

var (
	version = "v0.5"
)

const (
	defaultAppID = "KGUN8FAIPF"
)

type config struct {
	SourceDir string `arg:"required" help:"filesystem path to read files relative from (e.g. /public)"`
	AppKey    string `arg:"env:ALGOLIA_SEARCH_API_KEY"`
	AppID     string `arg:"env:ALGOLIA_APP_ID"`
}

func (config) Version() string {
	return "generate_wp_section_pages " + version
}

type algoliaIndex struct {
	name    string // The name of the index in Algolia.
}

// This program will query the sections index in Algolia for blog, marketplace, and apps.
// For each sections record, it will copy public/sections/index.html to a corresponding location in
// public/. For example, for the Blog > CMS record in the sections index, public/blog/cms/index.html
// will be created. This is used to statically create section pages, where each page then dynamically
// queries Algolia to display the section contents.
//
// **NOTE**: this script is not currently being used, and would require other adjustments to the
// theme to support if we were to start using it again.
//
// Usage:
//
//     ALGOLIA_SEARCH_API_KEY=<mysecret> generate_wp_section_pages --sourcedir ../../public
//
// Also note that you need to build the site with Hugo first.
func main() {
	log.SetPrefix("algolia: ")
	log.SetFlags(log.Flags() &^ (log.Ldate | log.Ltime))

	var cfg config

	p := arg.MustParse(&cfg)

	if cfg.AppKey == "" {
		p.Fail("An Algolia search API key must be provided either in the ALGOLIA_SEARCH_API_KEY OS environment variable or in --appkey.")

	}
	if cfg.AppID == "" {
		cfg.AppID = defaultAppID
	}

	sectionsIndex := algoliaIndex{
		name:    "linode-docs-sections-bep",
	}

	sections := []string{"marketplace", "blog", "resources"}

	client := search.NewClient(cfg.AppID, cfg.AppKey)
	index := client.InitIndex(sectionsIndex.name)

	for _, section := range sections {

		res, err := index.Search("", opt.Filters("section:" + section))
		if err != nil {
			log.Fatal(err)
		}

		for _, hit := range res.Hits {
			objectIDComponents := strings.Split(hit["objectID"].(string), ">")
			for i, component := range objectIDComponents {
				objectIDComponents[i] = strings.Trim(strings.ToLower(component), " ")
			}

			destinationDir := cfg.SourceDir + "/" + strings.Join(objectIDComponents, "/")
			err := os.MkdirAll(destinationDir, 0755)
			if err != nil {
				log.Fatal(err)
			}

			from, err := os.Open(cfg.SourceDir + "/sections/index.html")
			if err != nil {
				log.Fatal(err)
			}
			defer from.Close()

			to, err := os.OpenFile(destinationDir + "/index.html", os.O_RDWR|os.O_CREATE, 0755)
			if err != nil {
				log.Fatal(err)
			}
			defer to.Close()

			_, err = io.Copy(to, from)
			if err != nil {
				log.Fatal(err)
			}
		}
	}

	log.Println("Done.")
}
