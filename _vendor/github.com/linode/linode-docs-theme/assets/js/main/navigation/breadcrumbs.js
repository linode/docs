'use strict';

import { newCreateHref } from './create-href';

var debug = 0 ? console.log.bind(console, '[breadcrumbs]') : function () {};

export function newBreadcrumbsController(searchConfig) {
	if (!searchConfig) {
		throw 'newBreadcrumbsController: must provide searchConfig';
	}
	const hrefFactory = newCreateHref(searchConfig);

	return {
		data: {
			breadcrumbs: {
				sections: [],
			},
		},
		breadCrumbsCreated: false,
		init: function () {
			this.$nextTick(() => {
				this.$store.search.withBlank((result) => {
					let parts = hrefFactory.sectionsFromPath();
					let sections = [];
					let sectionKeys = [];
					for (let i = 0; i < parts.length; i++) {
						let section = parts[i];
						sectionKeys.push(section.toLowerCase());
						let key = sectionKeys.join(' > ');
						let sm = result.getSectionMeta(key);
						if (sm) {
							sections.push(sm);
						} else {
							// Just show a link to the home page in the breadcrumbs.
							// This is mostly a misspelled URL.
							// We could create a path based on the location,
							// as we do sanitize in sectionsFromPath,
							// but let's not open up to potential XSS attacks.
							sections.length = 0;
							break;
						}
					}

					this.data.breadcrumbs.sections = sections;
				});
			});
		},
	};
}
