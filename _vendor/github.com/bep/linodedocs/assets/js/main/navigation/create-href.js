var lnCreateHref = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[router]') : function() {};

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnCreateHref.New: must provide searchConfig';
		}

		const SECTIONS_BASEPATH = '/docs/sections/';
		const BLOG_BASEPATH = '/docs/blog/';

		return {
			sectionsFromPath: function() {
				let pathname = decodeURIComponent(window.location.pathname);
				let match = pathname.match(/sections\/(.+)/);
				if (!match) {
					return null;
				}

				match = match.slice(1, match.length);

				let path = match[0].replace(/\/$/, '');
				return path.split('/');
			},
			hrefSection: function(key) {
				let parts = key.split(' > ');
				if ((parts.length > 1 && parts[0] === 'products') || parts[0] === 'api') {
					// TODO(bep)
					return `/docs/${parts.join('/')}/`;
				}
				return `${SECTIONS_BASEPATH}${parts.join('/').toLowerCase()}/`;
			},
			hrefEntry: function(hit) {
				if (!hit.section.startsWith('blog')) {
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
