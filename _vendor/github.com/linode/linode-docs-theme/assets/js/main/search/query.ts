import { normalizeSpace } from '../helpers/index';

export interface Query {
	// Holds the current page number.
	// Starts at 0.
	p: number;

	// q holds the free text query usually fetched from the search input box.
	q: string;

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

const setQueryValues = function(q: Query, key: string, values: string[]) {
	// Legacy values.
	if (key === 'sections' || key === 'section.lvl0') {
		key = 'docType';
	}

	switch (key) {
		default:
			q.filters.set(key, values);
	}
};

export const newQuery = function(): Query {
	return {
		p: 0,
		q: '',
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
			return this.q || this.hasFilter();
		}
	};
};

export class QueryHandler {
	constructor() {}

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
				case 'q':
					q.q = normalizeSpace(v);
					break;
				default:
					setQueryValues(q, k, v.split(','));
			}
		});
		return q;
	}

	queryToQueryString(q: Query): string {
		var queryString = `q=${encodeURIComponent(q.q)}`;

		if (q.p) {
			queryString = queryString.concat(`&p=${q.p}`);
		}

		q.filters.forEach((values, key) => {
			queryString = queryString.concat(`&${key}=${encodeURIComponent(values.join(',').toLowerCase())}`);
		});

		return queryString;
	}
}
