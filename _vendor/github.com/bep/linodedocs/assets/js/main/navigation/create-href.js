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
		const WP_CONTENT_BASEPATH = '/docs/content/';

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
				let urlParts = hit.url.split('/');
				let contentType = hit.objectID.split('#').shift().replace('content', 'resource');
				let slug = urlParts.pop() || urlParts.pop();
				return `${WP_CONTENT_BASEPATH}${contentType}/${slug}/`;
			}
		};
	};
})(lnCreateHref);
