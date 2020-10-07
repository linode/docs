var lnCreateHref = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[router]') : function() {};

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnCreateHref.New: must provide searchConfig';
		}

		const SECTIONS_BASEPATH = '/docs/';
		const BLOG_BASEPATH = '/docs/blog/';

		return {
			sectionsFromPath: function() {
				let pathname = decodeURIComponent(window.location.pathname).replace(/^\/|\/$/g, '');
				let sections = pathname.split('/').slice(1);
				return sections;
			},
			hrefSection: function(key) {
				let parts = key.split(' > ');
				return `${SECTIONS_BASEPATH}${parts.join('/').toLowerCase()}/`;
			},
			hrefEntry: function(hit) {
				if (hit.section && !hit.section.startsWith('blog')) {
					let objectID = hit.objectID.replace('#', '/');
					return `${BLOG_BASEPATH}${objectID}/`;
				}

				let urlParts = hit.url.split('/');
				let slug = urlParts.pop() || urlParts.pop();
				return `${BLOG_BASEPATH}${slug}/`;
			}
		};
	};
})(lnCreateHref);
