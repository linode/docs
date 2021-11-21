'use strict';

import { newCreateHref } from './create-href';

var debug = 0 ? console.log.bind(console, '[breadcrumbs]') : function() {};

export function newBreadcrumbsController(searchConfig) {
	if (!searchConfig) {
		throw 'newBreadcrumbsController: must provide searchConfig';
	}
	const hrefFactory = newCreateHref(searchConfig);

	return {
		data: {
			breadcrumbs: {
				sections: []
			}
		},
		breadCrumbsCreated: false,
		init: function() {
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
							// Missing metadata, fall back to the defaults, which should be good enough for these WordPress sections.
							sections.push({
								href: hrefFactory.hrefSection(key),
								linkTitle: section
							});
						}
					}

					this.data.breadcrumbs.sections = sections;
				});
			});
		}
	};
}
