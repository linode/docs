var lnDisqus = {};

(function(ctx, window) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0 ? console.log.bind(console, '[disqus]') : function() {};

	const reset = function(page) {
		debug('reset', page);
		DISQUS.reset({
			reload: true,
			config: function() {
				this.page.identifier = page.permalink;
				this.page.url = page.permalink;
				this.page.title = page.title;
				this.language = 'en';
			}
		});
	};

	ctx.New = function(disqusShortname, page) {
		window.disqus_shortname = disqusShortname;
		window.disqus_identifier = page.permalink;
		window.disqus_url = page.permalink;
		window.disqus_config = function() {
			this.language = 'en';
		};

		return {
			page: page,
			loaded: false,
			init: function() {
				debug('init', this.page);
				this.loaded = true;
				if (window.DISQUS) {
					reset(this.page);
				}
			}
		};
	};
})(lnDisqus, window);
