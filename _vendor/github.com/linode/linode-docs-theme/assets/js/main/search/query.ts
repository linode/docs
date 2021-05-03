import { normalizeSpace } from '../helpers/index';

interface Query {
	// May be set to identify the target _view.
	// Is not a part of any search filter.
	_view: string;

	// qv holds the free text query usually fetched from the search input box.
	qv: string;

	// q returns qv if set, else an empty string.
	readonly q: string;

	// sections to query, all if empty.
	sections: string[];

	// facet filters.
	filters: Map<string, string[]>;

	// setNonEmptyFrom sets non empty values (query or slices) from other to this query.
	setNonEmptyFrom(other: Query);

	// eq reports whether other is deeply equal (has the same filters etc.) to this query.
	eq(other: Query): boolean;

	// addFilter adds value to the slice of filters with key.
	addFilter(key: string, value: string);

	// hasFilter reports whether a filter (e.g. tags) is set.
	hasFilter(): boolean;

	// hasQ reports whether a text guery is set.
	hasQ(): boolean;

	// isAnyFilterSet reports whether a filter or text guery is set (an empty text query is considered valid).
	isAnyFilterSet(): boolean;

	// isFiltered reports whether a filter or a non-empty text guery is set.
	isFiltered(): boolean;

	// isSectionEnabled reports whether the given section (e.g. `guides`) is enabled.
	isSectionEnabled(section: string): boolean;
}

const setQueryValues = function(q: Query, key: string, values: string[]) {
	switch (key) {
		case 'sections':
			q.sections = values;
			break;
		default:
			q.filters.set(key, values);
	}
};

export const newQuery = function(): Query {
	return {
		_view: '',
		qv: null, // So we can distinguish it from a blank search.
		get q() {
			return this.qv === null ? '' : this.qv;
		},
		sections: [],
		filters: new Map<string, string[]>(),

		setNonEmptyFrom(other: Query) {
			if (other.qv !== null) {
				this.qv = other.qv;
			}

			if (other.sections.length > 0) {
				this.sections = other.sections;
			}

			if (other.filters.size > 0) {
				this.filters = other.filters;
			}
		},

		eq(other: Query): boolean {
			if (this === other) {
				return true;
			}
			if (this._view !== other._view) {
				return false;
			}
			if (this.qv !== other.qv) {
				return false;
			}
			if (this.sections.length !== other.sections.length) {
				return false;
			}
			if (this.filters.size !== other.filters.size) {
				return false;
			}
			for (let key in this.filters) {
				if (!other.filters.has(key)) {
					return false;
				}

				let v1 = this.filters.get(key);
				let v2 = other.filters.get(key);
				if (v1.length !== v2.length) {
					return false;
				}
				for (let filter in v1) {
					if (v2.indexOf(filter) === -1) {
						return false;
					}
				}
			}

			for (let section in this.sections) {
				if (other.sections.indexOf(section) === -1) {
					return false;
				}
			}

			return true;
		},

		addFilter(key: string, value: string) {
			if (this.filters.has(key)) {
				this.filters.get(key).push(value);
			} else {
				this.filters.set(key, [ value ]);
			}
		},

		hasFilter() {
			return this.filters.size > 0;
		},

		hasQ() {
			return this.qv !== null;
		},

		isAnyFilterSet() {
			return this.hasQ() || this.hasFilter();
		},

		isFiltered() {
			return (this.hasQ() && this.q !== '') || this.hasFilter();
		},

		isSectionEnabled(section: string) {
			return this.sections.length === 0 || this.sections.includes(section);
		}
	};
};

export class QueryHandler {
	// Configuration
	facetMapping: Record<string, Set<string>>;

	constructor(sectionsConfig: Record<string, any>[]) {
		this.facetMapping = {};
		for (let section of sectionsConfig) {
			let s = new Set<string>();
			if (section.filtering_facets) {
				section.filtering_facets.forEach((ff: { name: string }) => {
					s.add(ff.name);
				});
			}
			this.facetMapping[section.name] = s;
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
				case '_view':
					q._view = v;
					break;
				case 'q':
					q.qv = normalizeSpace(v);
					break;
				default:
					setQueryValues(q, k, v.split(','));
			}
		});
		return q;
	}

	queryFromRecord(r: Record<string, string | string[]>): Query {
		let q = newQuery();
		for (let k in r) {
			let v = r[k];
			switch (k) {
				case '_view':
					if (typeof v === 'string') {
						q._view = v;
					}
					break;
				case 'q':
					if (typeof v === 'string') {
						q.qv = normalizeSpace(v);
					} else {
						throw `unkown filter key ${k}`;
					}
					break;
				default:
					let values = typeof v === 'string' ? [ v ] : v;
					setQueryValues(q, k, values);
			}
		}
		return q;
	}

	queryToQueryString(q: Query): string {
		var queryString = `q=${encodeURIComponent(q.q)}`;
		if (q._view !== '') {
			queryString += `&_view=${encodeURIComponent(q._view)}`;
		}

		if (q.sections.length > 0) {
			queryString = queryString.concat(`&sections=${encodeURIComponent(q.sections.join(','))}`);
		}

		q.filters.forEach((values, key) => {
			// Throw away any irrelevant filters.
			let isRelevant =
				q.sections.length === 0 ||
				q.sections.findIndex((section) => {
					return this.facetMapping[section].has(key);
				}) !== -1;
			if (isRelevant) {
				queryString = queryString.concat(`&${key}=${encodeURIComponent(values.join(',').toLowerCase())}`);
			}
		});

		return queryString;
	}

	queryToQueryForSection(q: Query, section: string): Query {
		let clone = this.queryToQuery(q);
		clone.sections = [ section ];
		return clone;
	}

	queryToQuery(q: Query): Query {
		let clone = newQuery();
		clone.qv = q.qv;
		clone.sections = [ ...q.sections ];
		q.filters.forEach((values, key) => {
			clone.filters.set(key, [ ...values ]);
		});
		return clone;
	}

	filtersPerSection(q: Query): Map<string, string[]> {
		let m = new Map<string, string[]>();
		for (let section in this.facetMapping) {
			let sectionFilters = [];
			let mappings = this.facetMapping[section];
			q.filters.forEach((value, key) => {
				if (mappings.has(key)) {
					sectionFilters.push(`${key}:${value}`);
				}
			});
			m.set(section, sectionFilters);
		}
		return m;
	}
}
