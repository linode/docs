// TODO(bep) I understand that this does not look ... ideal, but this should be easily improved once (next Hugo)
// we get proper import resolution etc. for Hugo Modules in js.Build.
var lnWeglotApiKey = '{{ site.Params.weglot_api_key }}';
var lnSearchConfig = {{ site.Params.search_config | jsonify | safeJS }};

lnSearchConfig.findSectionsBySearchResults = function(results) {
    var self = this;
    var sections = [];
    results.forEach((result) => {
        let sectionConfig = self.sections.find((s) => {
            if (s.index !== result.index && s.index_by_pubdate != result.index) {
                return false;
            }
            if (s.filters) {
                // We have some sections that share the same index.
                return result.params.endsWith(encodeURIComponent(s.filters));
            }
            return true;
        });

        if (!sectionConfig) {
            throw `no index ${result.index} found`;
        }
        
        sections.push(sectionConfig);
    });

    return sections;
};


