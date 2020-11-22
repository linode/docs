//usr/bin/env go run -mod=readonly "$0" "$@"; exit "$?"
package main

import (
	"log"

	"github.com/alexflint/go-arg"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/opt"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
)

var (
	version = "v0.6"
)

const (
	defaultAppID = "KGUN8FAIPF"
	index        = "linode-documentation-sections"
)

type config struct {
	Filters string `arg:"required" help:"filter to delete by (see https://www.algolia.com/doc/api-reference/api-methods/delete-by/)"`
	AppKey  string `arg:"env:ALGOLIA_ADMIN_API_KEY"`
	AppID   string `arg:"env:ALGOLIA_APP_ID"`
}

func (config) Version() string {
	return "clean_linode_sections_index " + version
}

// This programs deletes rows in the sections mapping index matching the given filters.
//
// Usage:
//
//     ALGOLIA_ADMIN_API_KEY=<mysecret> clean_linode_sections_index --filters section:docs
//
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

	client := search.NewClient(cfg.AppID, cfg.AppKey)

	index := client.InitIndex(index)

	log.Printf("DeleteBy %q", cfg.Filters)

	res, err := index.DeleteBy(opt.Filters(cfg.Filters))
	if err != nil {
		log.Fatal(err)
	}

	if err := res.Wait(); err != nil {
		log.Fatal(err)
	}

	log.Println("Done.")
}
