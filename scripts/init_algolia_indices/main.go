//usr/bin/env go run -mod=readonly "$0" "$@"; exit "$?"
package main

import (
	"os"
	"log"
	"fmt"
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/pelletier/go-toml"
	"github.com/pelletier/go-toml/query"
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
	IndexSuffix string `help:"The suffix that is currently being used for the Algolia indices in config.toml. For example, for an index named 'linode-documentation-development-preview', the suffix is '-development-preview'). This is used to map the non-suffixed index names from algolia_settings.json to the current configuration."`
	AppKey    string `arg:"env:ALGOLIA_ADMIN_API_KEY"`
	AppID     string `arg:"env:ALGOLIA_APP_ID"`
}

func (config) Version() string {
	return "init_algolia_indices " + version
}

type algoliaIndex struct {
	name    string // The name of the index in Algolia.
}

// This program uploads settings for each index in config.toml. If corresponding settings
// exist in algolia_settings.json, then those will be used. Otherwise, the default values
// for the search.Settings type will be used.
//
// Usage:
//
//     ALGOLIA_ADMIN_API_KEY=<mysecret> init_algolia_indices
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

	// Load saved settings into memory
    jsonFile, err := os.Open("../../algolia_settings.json")
    if err != nil {
        fmt.Println(err)
    }
    defer jsonFile.Close()

    byteValue, _ := ioutil.ReadAll(jsonFile)
	var algoliaSettings map[string]search.Settings
    json.Unmarshal([]byte(byteValue), &algoliaSettings)

	// Load config.toml, iterate through index configs. Upload the corresponding saved settings
	// for each index in the config file to Algolia. Uploading the settings for index will
	// passively create that index in Algolia if it doesn't exist already.
	configToml, _ := toml.LoadFile("../../config.toml")

	metaIndex := configToml.Get("params.search_config.meta_index").(string)
	index := client.InitIndex(metaIndex)
	metaIndexNameWithoutSuffix := strings.Replace(metaIndex, cfg.IndexSuffix, "", -1)
	if _, err := index.SetSettings(algoliaSettings[metaIndexNameWithoutSuffix]); err == nil {
		log.Println("Uploaded settings for index " + metaIndex)
	}

	indexConfigs, _ := query.CompileAndExecute("$.params.search_config.sections[:]", configToml)
	for _, indexConfig := range indexConfigs.Values() {
		log.Println()
		for _, indexType := range [2]string{"index", "index_by_pubdate"} {
			indexName := indexConfig.(*toml.Tree).Get(indexType)
			if indexName != nil {
				log.Println("Uploading settings for " + indexType + " in search_config " + indexConfig.(*toml.Tree).Get("name").(string))

				index := client.InitIndex(indexName.(string))
				indexNameWithoutSuffix := strings.Replace(indexName.(string), cfg.IndexSuffix, "", -1)
				indexSettings, ok := algoliaSettings[indexNameWithoutSuffix]

				if ok {
					// This block does some work to add the user's index suffix to the
					// 'replicas' and 'primary' settings
					replicas := indexSettings.Replicas.Get()
					replicasWithSuffix := replicas
					for i, replica := range replicas {
						if !strings.Contains(replica, cfg.IndexSuffix) {
							replicasWithSuffix[i] = replica + cfg.IndexSuffix
						}
					}
					indexSettings.Replicas = opt.Replicas(replicasWithSuffix...)

					primary := indexSettings.Primary.Get()
					if len(primary) > 0 && !strings.Contains(primary, cfg.IndexSuffix) {
						primary = primary + cfg.IndexSuffix
					}
					indexSettings.Primary = opt.Primary(primary)
				} else {
					log.Println("    No settings found for index " + indexNameWithoutSuffix + " in algolia_settings.json, using default settings instead.")
				}
				if _, err := index.SetSettings(indexSettings); err == nil {
					log.Println("    Uploaded settings for index " + indexName.(string) + " with settings from " + indexNameWithoutSuffix + " in algolia_settings.json.")
				} else {
					log.Println(err)
				}
			} else {
				log.Println("Can't find " + indexType + " in search_config " + indexConfig.(*toml.Tree).Get("name").(string))
			}
		}
	}
}
