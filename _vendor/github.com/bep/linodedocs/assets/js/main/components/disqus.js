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

	const loadScript = function(shortName) {
		const scriptID = 'disqus-embed';
		var script = document.getElementById(scriptID);
		if (script) {
			script.setAttribute('data-timestamp', +new Date());
			return false;
		}

		script = document.createElement('script');
		script.src = `//${shortName}.disqus.com/embed.js`;
		script.setAttribute('id', scriptID);
		{
			script.setAttribute('data-timestamp', +new Date());
		}
		script.async = true;
		(document.head || document.body).appendChild(script);

		return true;
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
			init: function() {
				if (!loadScript(disqusShortname)) {
					// The scrip tag already exist.
					// This is a navigation via Turbolinks so just do a DISQUS.reset.
					reset(this.page);
				}
			}
		};
	};
})(lnDisqus, window);
