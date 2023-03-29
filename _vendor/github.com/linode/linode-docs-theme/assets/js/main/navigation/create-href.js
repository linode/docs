'use strict';

import { sanitizeHTML } from '../helpers';

var debug = 0 ? console.log.bind(console, '[router]') : function () {};

export function newCreateHref(searchConfig) {
	if (!searchConfig) {
		throw 'newCreateHref: must provide searchConfig';
	}

	const SECTIONS_BASEPATH = '/docs/';

	return {
		sectionsFromPath: function () {
			let pathname = decodeURIComponent(window.location.pathname).replace(/^\/|\/$/g, '');
			pathname = sanitizeHTML(pathname);
			let sections = pathname.split('/').slice(1);
			return sections;
		},
		hrefSection: function (key) {
			if (key == 'community') {
				// We don't have any list page for the community section.
				return '';
			}
			let parts = key.split(' > ');

			if (parts.length > 1 && parts[0] === 'taxonomies') {
				parts = parts.slice(1);
			}
			return `${SECTIONS_BASEPATH}${parts.join('/').toLowerCase()}/`;
		},
	};
}
