//usr/bin/env go run -mod=readonly "$0" "$@"; exit "$?"
package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"path/filepath"

	"github.com/alexflint/go-arg"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
)

var (
	version = "v0.6"
)

const (
	defaultAppID = "KGUN8FAIPF"
)

type config struct {
	SourceDir string `arg:"required" help:"filesystem path to read files relative from (e.g. /public)"`
	IndexSuffix string `default:"" help:"suffix to append to index names in Algolia"`
	AppKey    string `arg:"env:ALGOLIA_ADMIN_API_KEY"`
	AppID     string `arg:"env:ALGOLIA_APP_ID"`
}

func (config) Version() string {
	return "update_linode_docs_search_indices " + version
}

type algoliaIndex struct {
	name    string // The name of the index in Algolia.
	source  string // Path to JSON relative to /public.
	replace bool   // Whether to replace all existing content.
}

// This programs updates the Algolia indices defined below.
//
// Usage:
//
//     ALGOLIA_ADMIN_API_KEY=<mysecret> update_linode_docs_search_indices --sourcedir ../../public
//
// Also note that you need to build the site with Hugo first.
func main() {
	log.SetPrefix("algolia: ")
	log.SetFlags(log.Flags() &^ (log.Ldate | log.Ltime))

	var cfg config

	p := arg.MustParse(&cfg)

	if cfg.AppKey == "" {
		p.Fail("An Algolia admin API key must be provided either in the ALGOLIA_ADMIN_API_KEY OS environment variable or in --appkey.")

	}
	if cfg.AppID == "" {
		cfg.AppID = defaultAppID
	}

	indices := []algoliaIndex{
		algoliaIndex{
			name:    "linode-documentation" + cfg.IndexSuffix,
			source:  "index.json",
			replace: true,
		},
		algoliaIndex{
			name: "linode-documentation-sections" + cfg.IndexSuffix,

			source: "data/sections/index.json",
			// This index is shared between Hugo and WordPress,
			// and we cannot wipe the existing content,
			// but it's a mapping index, so having some old unused rows
			// there does not matter.
			// TODO(bep) figure out a way to clear out unused rows.

			replace: false,
		},
		algoliaIndex{
			name:    "linode-documentation-api" + cfg.IndexSuffix,
			source:  "api/index.json",
			replace: true,
		},
	}

	client := search.NewClient(cfg.AppID, cfg.AppKey)

	for _, indexData := range indices {

		data, err := ioutil.ReadFile(filepath.Join(cfg.SourceDir, indexData.source))
		if err != nil {
			log.Fatal(err)
		}

		var items []map[string]interface{}
		if err := json.Unmarshal(data, &items); err != nil {
			log.Fatal(err)
		}

		if len(items) == 0 {
			log.Fatalf("No data found for index %q, abort.", indexData.name)
		}

		log.Printf("Update %q with %d rows...\n", indexData.name, len(items))

		index := client.InitIndex(indexData.name)

		if indexData.replace {
			res, err := index.ReplaceAllObjects(items)
			if err != nil {
				log.Fatal(err)
			}

			if err := res.Wait(); err != nil {
				log.Fatal(err)
			}

		} else {
			groups, err := index.SaveObjects(items)
			if err != nil {
				log.Fatal(err)
			}

			for _, res := range groups.Responses {
				if err := res.Wait(); err != nil {
					log.Fatal(err)
				}
			}
		}

	}

	log.Println("Done.")
}
