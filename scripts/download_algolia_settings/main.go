//usr/bin/env go run -mod=readonly "$0" "$@"; exit "$?"
package main

import (
	"log"
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/pelletier/go-toml"
	"github.com/pelletier/go-toml/query"
	"github.com/alexflint/go-arg"
	"github.com/algolia/algoliasearch-client-go/v3/algolia/search"
)

var (
	version = "v0.5"
)

const (
	defaultAppID = "KGUN8FAIPF"
)

type config struct {
	AppKey    string `arg:"env:ALGOLIA_ADMIN_API_KEY"`
	AppID     string `arg:"env:ALGOLIA_APP_ID"`
}

func (config) Version() string {
	return "download_algolia_settings " + version
}

// This program downloads the settings for some of the Algolia indices in config.toml
// to algolia_settings.json in the project's root. This will download settings for any
// index that has download_settings=true set in config.toml. Basically, this is any
// index that doesn't represent content from another Linode property (like linode.com or
// the community site), plus the sections index.
//
// Run this and check algolia_settings.json into version control whenever the settings of
// the production indices change. algolia_settings.json will be used to initalize indices
// in scripts/init_algolia_indices.
//
// Usage:
//
//     ALGOLIA_ADMIN_API_KEY=<mysecret> download_algolia_settings --sourcedir ../../public
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

	configToml, _ := toml.LoadFile("../../config.toml")
	indices := []string{configToml.Get("params.search_config.meta_index").(string)}

	sectionsQuery, _ := query.Compile("$.params.search_config.sections[?(ifDownloadSettings)]")
	sectionsQuery.SetFilter("ifDownloadSettings", func(node interface{}) bool{
		if tree, ok := node.(*toml.Tree); ok {
			return tree.Has("download_settings") && tree.Get("download_settings").(bool)
		}
		return false // reject all other node types
	})

	for _, indexConfig := range sectionsQuery.Execute(configToml).Values() {
		for _, indexType := range [2]string{"index", "index_by_pubdate"} {
			indexName := indexConfig.(*toml.Tree).Get(indexType)
			if indexName != nil {
				indices = append(indices, indexName.(string))
			}
		}
	}

	log.Println("Saving settings to algolia_settings.json for indices: " + strings.Join(indices, ", "))

	settings := make(map[string]search.Settings)
	for _, indexName := range indices {
		index := client.InitIndex(indexName)
		indexSettings, _ := index.GetSettings()

		settings[indexName] = indexSettings
	}

	file, _ := json.MarshalIndent(settings, "", " ")
	_ = ioutil.WriteFile("../../algolia_settings.json", file, 0644)
}
