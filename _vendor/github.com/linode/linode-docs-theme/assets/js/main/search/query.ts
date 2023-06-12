import { isTopResultsPage } from '.';
import { normalizeSpace } from '../helpers/index';

export interface Query {
	// Holds the current page number.
	// Starts at 0.
	p: number;

	// lndq holds the free text query usually fetched from the search input box.
	lndq: string;

	// facet filters.
	filters: Map<string, string[]>;

	// addFilter adds value to the slice of filters with key.
	addFilter(key: string, value: string);

	// Returns the filters ready to be used in a Algolia query.
	toFacetFilters(): string[];

	// hasFilter reports whether a filter (e.g. tags) is set.
	hasFilter(): boolean;

	// isFiltered reports whether a filter or a non-empty text guery is set.
	isFiltered(): boolean;
}

// Only used to validate query parameters.
const filterAttributes = [ 'docType', 'category', 'tags', 'authors' ];

const setQueryValues = function(q: Query, key: string, values: string[]) {
	// Legacy values.
	if (key === 'sections' || key === 'section.lvl0') {
		key = 'docType';
	}
	if (filterAttributes.includes(key)) {
		q.filters.set(key, values);
	}
};

export const newQuery = function(): Query {
	return {
		p: 0,
		lndq: '',
		filters: new Map<string, string[]>(),

		addFilter(key: string, value: string) {
			if (this.filters.has(key)) {
				this.filters.get(key).push(value);
			} else {
				this.filters.set(key, [ value ]);
			}
		},

		toFacetFilters(): string[] {
			// In Algolia, every value within the main bracket is interpreted as a conjunction (AND),
			// nested arrays gets to be disjunctive (OR).
			// So we put each filter in the top level array (AND) as an array with filter values.
			let filters = [];
			this.filters.forEach((values, key) => {
				let filterGroup = [];
				values.forEach((value) => {
					filterGroup.push(`${key}:${value}`);
				});
				filters.push(filterGroup);
			});
			return filters;
		},

		hasFilter() {
			return this.filters.size > 0;
		},

		isFiltered() {
			return this.lndq || this.hasFilter();
		}
	};
};

export class QueryHandler {
	constructor() {}

	isQueryParam(k: string): boolean {
		switch (k) {
			case 'p':
				return true;
			case 'lndq':
				return true;
			default:
				return filterAttributes.includes(k);
		}
	}

	queryFromLocation(): Query {
		if (!window.location.search) {
			return newQuery();
		}
		return this.queryFromString(window.location.search.slice(1));
	}

	queryFromString(s: string): Query {
		let q = newQuery();
		new URLSearchParams(s).forEach((v, k) => {
			switch (k) {
				case 'p':
					q.p = parseInt(v, 10);
					if (q.p < 0) {
						q.p = 0;
					}
					break;
				case 'lndq':
					q.lndq = normalizeSpace(v);
					break;
				case 'q':
					if (isTopResultsPage()) {
						// legacy
						q.lndq = normalizeSpace(v);
					}
					break;
				default:
					setQueryValues(q, k, v.split(','));
			}
		});
		return q;
	}

	queryAndLocationToQueryString(q: Query): string {
		let search = '';
		let currentURL = new URL(window.location.toString());

		// Preserve non-search-related query params.
		currentURL.searchParams.forEach((v, k) => {
			if (!this.isQueryParam(k)) {
				search = addTrailingAnd(search);
				search += `${k}=${v}`;
			}
		});

		let queryString = this.queryToQueryString(q);

		if (!queryString) {
			return search;
		}


		if (search) {
			queryString += '&' + search;
		}

		return queryString;
	}

	queryToQueryString(q: Query): string {
		let queryString = '';
		if (q.lndq) {
			queryString = `lndq=${encodeURIComponent(q.lndq)}`;
		}

		if (q.p) {
			queryString = addTrailingAnd(queryString);
			queryString = queryString.concat(`p=${q.p}`);
		}

		q.filters.forEach((values, key) => {
			queryString = addTrailingAnd(queryString);
			queryString = queryString.concat(`${key}=${encodeURIComponent(values.join(',').toLowerCase())}`);
		});

		return queryString;
	}
}

function addTrailingAnd(s: string) {
	if (s && !s.endsWith('&')) {
		s += '&';
	}
	return s;
}
