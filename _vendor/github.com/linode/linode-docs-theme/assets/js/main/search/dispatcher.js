'use strict';

var debug = 0 ? console.log.bind(console, '[dispatcher]') : function() {};

export function newDispatcher() {
	let sendEvent = function(name, data, el = document) {
		var event = new CustomEvent(name, {
			bubbles: true,
			detail: data
		});
		el.dispatchEvent(event);
	};

	const events = {
		// Events used to communicate with other search widgets.

		// Event broadcasted when the search system is ready.
		EVENT_SEARCH_READY: 'search:ready',

		// Event that triggers a new search query.
		EVENT_SEARCH_QUERY: 'search:query',

		// Event that signals the opening/close of the search experience (e.g. the close of the input box).
		EVENT_SEARCH_TOGGLE: 'search:toggle',

		// Apply search filters to the search query.
		EVENT_SEARCHFILTER: 'search:filter',

		// Event with the current main search result.
		// Receivers can asume that a filter (e.g. the main query) has changed.
		EVENT_SEARCHRESULT: 'search:results',

		// Event with the initial blank search result.
		EVENT_SEARCHRESULT_BLANK: 'search:results-blank',

		// Event sent for any kind of search.
		EVENT_SEARCHRESULT_ANY: 'search:results-any',

		// Event with the initial data structure. This will not contain any Algolia search results,
		// but may contain other metadata.
		EVENT_SEARCHRESULT_INITIAL: 'search:results-initial',

		// Event that register a named search to be refreshed on any filter changes..
		EVENT_SUBSCRIBE: 'search:subscribe',

		// Event that triggers a search update for nodes in the explorer accordeon.
		EVENT_SEARCHEXPLORER_SEARCH_NODES: 'search:nodes'
	};

	return {
		searchReady: function() {
			debug('searchReady');
			sendEvent(events.EVENT_SEARCH_READY, {});
		},
		searchToggle: function(show) {
			debug('searchToggle');
			sendEvent(events.EVENT_SEARCH_TOGGLE, show);
		},
		searchQuery: function(query, executeSearch = true) {
			debug('searchQuery');
			sendEvent(events.EVENT_SEARCH_QUERY, {
				event: events.EVENT_SEARCHRESULT,
				query: query,
				executeSearch: executeSearch
			});
		},
		searchBlank: function() {
			debug('searchBlank');
			sendEvent(events.EVENT_SEARCH_QUERY, { event: events.EVENT_SEARCHRESULT_BLANK });
		},
		searchNodes: function(detail) {
			debug('searchNodes', detail);
			sendEvent(events.EVENT_SEARCHEXPLORER_SEARCH_NODES, detail, document);
		},
		// A standalone search is a search that has nothing to do with the global
		// filtering. Therefore the result can be safely cached and reused.
		searchStandalone: function(requests, toEvent) {
			debug('searchStandalone', requests);
			sendEvent(events.EVENT_SEARCH_QUERY, {
				requests: requests,
				event: toEvent
			});
		},
		subscribe: function(name, opts, toEvent) {
			debug('subscribe', name, 'with', opts, 'to', toEvent);
			sendEvent(events.EVENT_SUBSCRIBE, {
				name: name,
				opts: opts,
				event: toEvent
			});
		},

		// filters can either be an object ({ filters: { q: "Apache" }}) or an encoded query string (q=Apache)).
		applySearchFilters: function(filters) {
			debug('applySearchFilters', filters);
			sendEvent(events.EVENT_SEARCHFILTER, filters);
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

		sendPageInfo: function(pageInfo) {
			debug('sendPageInfo', pageInfo);
			sendEvent('ln:page-info', pageInfo);
		},

		events: events
	};
}
