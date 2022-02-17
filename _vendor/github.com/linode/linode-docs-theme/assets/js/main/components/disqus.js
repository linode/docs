('use strict');

var debug = 0 ? console.log.bind(console, '[disqus]') : function() {};

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

export function newDisqus(disqusShortname, page) {
	window.disqus_shortname = disqusShortname;
	window.disqus_identifier = page.permalink;
	window.disqus_url = page.permalink;
	window.disqus_config = function() {
		this.language = 'en';
	};

	return {
		page: page,
		// Avoid using the name init(), which is also automatically invoked by AlpineJS.
		// We need to call it explicitly to make it run after AlpineJS has updated the DOM.
		initDisqus: function() {
			this.$nextTick(() => {
				if (!loadScript(disqusShortname)) {
					// The script tag already exists.
					// This is a navigation via Turbolinks so just do a DISQUS.reset.
					reset(this.page);
				}
			});
		}
	};
}
