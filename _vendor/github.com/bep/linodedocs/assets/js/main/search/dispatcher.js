var lnSearchEventDispatcher = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[dispatcher]') : function() {};

	ctx.New = function() {
		let sendEvent = function(name, data, el = document) {
			var event = new CustomEvent(name, {
				bubbles: true,
				detail: data
			});
			el.dispatchEvent(event);
		};

		const events = {
			// Events used to communicate with other search widgets.

			// Event that triggers a new search query.
			EVENT_SEARCH_TRIGGER: 'search:trigger',

			// Apply facet filters to the search query.
			EVENT_FACETFILTERS: 'search:facetfilters',

			// Event with the current main search result.
			// Receivers can asumme that a filter (e.g. the main query) has changed.
			EVENT_SEARCHRESULT: 'search:results',

			// Event with the initial blank search result.
			EVENT_SEARCHRESULT_BLANK: 'search:results-blank',

			// Event that register a named search to be refreshed on any filter changes..
			EVENT_SUBSCRIBE: 'search:subscribe',

			// Event that sends the current explorer data set.
			EVENT_SEARCHEXPLORER_DATA: 'search:explorer-data',

			// Event that toggles the open state on a node in the explorer accordeon.
			// $event.detail will contain a data container with the node and its open state.
			EVENT_SEARCHEXPLORER_TOGGLE_NODE: 'search:toggle-node',

			// Event that triggers a search update for a node in the explorer accordeon.
			EVENT_SEARCHEXPLORER_SEARCH_NODE: 'search:node'
		};

		return {
			search: function(opts) {
				debug('search', opts);
				sendEvent(events.EVENT_SEARCH_TRIGGER, {
					regularSearch: true,
					query: opts.query,
					event: events.EVENT_SEARCHRESULT
				});
			},
			searchBlank: function() {
				debug('searchBlank');
				sendEvent(events.EVENT_SEARCH_TRIGGER, { event: events.EVENT_SEARCHRESULT_BLANK });
			},
			searchNode: function(detail) {
				debug('searchNode', detail);
				sendEvent(events.EVENT_SEARCHEXPLORER_SEARCH_NODE, detail, document);
			},
			subscribe: function(name, opts, toEvent) {
				debug('subscribe', name, 'with', opts, 'to', toEvent);
				sendEvent(events.EVENT_SUBSCRIBE, {
					name: name,
					opts: opts,
					event: toEvent
				});
			},
			applyFacetFilters: function(filters) {
				debug('applyFacetFilters', filters);
				sendEvent(events.EVENT_FACETFILTERS, filters);
			},

			broadCastSearchResult: function(searchresult, to) {
				debug('broadCastSearchResult', searchresult, '=>', to);
				let events = Array.isArray(to) ? to : [ to ];
				events.forEach((e) => {
					sendEvent(e, searchresult);
				});
			},

			broadCastFilteredSearchResult: function(searchresult, toEvent) {
				debug('broadCastFilteredSearchResult', searchresult, 'to', toEvent);
				sendEvent(toEvent, searchresult);
			},

			toggleExplorerNode: function(detail, el = document) {
				debug('toggleExplorerNode', detail, el === document);
				sendEvent(events.EVENT_SEARCHEXPLORER_TOGGLE_NODE, detail, el);
			},

			broadcastExplorerData: function(detail, el = document) {
				debug('broadcastExplorerData', detail, el === document);
				sendEvent(events.EVENT_SEARCHEXPLORER_DATA, detail, el);
			},

			events: events
		};
	};
})(lnSearchEventDispatcher);
