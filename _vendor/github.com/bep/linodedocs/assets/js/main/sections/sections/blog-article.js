var lnArticleController = {};

(function(ctx) {
	'use strict';

	var debug =
		(typeof LN_DEBUG !== 'undefined' && LN_DEBUG) || 0
			? console.log.bind(console, '[blog-article]')
			: function() {};

	ctx.New = function(searchConfig) {
		if (!searchConfig) {
			throw 'lnArticleController.New: must provide searchConfig';
		}

		const router = lnCreateHref.New(searchConfig);
		const dispatcher = lnSearchEventDispatcher.New();

		const fetchArticle = function(url, onSuccess, onError) {
			debug('fetch', url);
			fetch(url, {})
				.then((response) => {
					if (!response.ok) {
						throw response;
					}
					return response.json();
				})
				.then((data) => {
					debug('fetched data', data);

					let article = Array.isArray(data) ? data[0] : data;
					if (!article) {
						throw 'article not found';
					}

					// eslint-disable-next-line no-underscore-dangle
					let embedded = article._embedded;
					let author = embedded && embedded.author ? embedded.author[0] : null;

					// Convert to local links if possible.
					let urlTransformer = function(match, p1, p2) {
						if (p2.startsWith('https://www.linode.com/docs')) {
							return match.replace('https://www.linode.com/docs', '/docs');
						}
						let m = p2.match(/linode\.com\/\d{4}\/\d{2}\/\d{2}\/(.*)\//);
						if (m) {
							return `<a href="/docs/blog/article/?slug=${m[1]}"`;
						}

						return match;
					};

					let content = article.content.rendered.replace(
						/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1/g,
						urlTransformer
					);

					let dateFormat = function(d) {
						var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
						return new Intl.DateTimeFormat('en', options).format(d);
					};

					let dateGMT = new Date(article.date_gmt + 'Z');
					let modifiedGMT = new Date(article.modified_gmt + 'Z');
					let wpMetaString = article.yoast_head.substring(article.yoast_head.indexOf('<title>'));

					onSuccess({
						title: article.title.rendered,
						linkTitle: article.title.rendered,
						link: article.link,
						href: window.location.pathname,
						content: content,
						author: author,
						date: dateGMT,
						dateStr: dateFormat(dateGMT),
						modified: modifiedGMT,
						modifiedStr: dateFormat(modifiedGMT),
						image: embedded && embedded['wp:featuredmedia'] ? embedded['wp:featuredmedia'][0] : null,
						metaString: wpMetaString,
						section: article.section,
						kind: 'page',
						type: 'wpArticle' // Discriminator that tells this apart from the Hugo articles. Do not change.
					});
				})
				.catch((err) => {
					onError(err);
				});
		};

		return {
			status: { code: 200 },
			data: { article: {} },

			init: function() {
				var self = this;
				let pathname = decodeURIComponent(window.location.pathname);
				let match = pathname.match(/docs\/content\/(.+)\/(.+)/);
				if (!match) {
					return;
				}
				match = match.slice(1, match.length);

				if (match.length < 2) {
					return;
				}

				let contentType = match[0].replace('resource', 'content').replace('post', 'posts');
				let slug = match[1].replace(/\/$/, '');

				var url = `https://www.linode.com/wp-json/wp/v2/${contentType}?slug=${slug}&_embed=1`;

				var onSuccess = (article) => {
					dispatcher.sendPageInfo(article);

					self.data.article = article;

					let div = document.createElement('div');
					div.innerHTML = article.metaString;

					// Set SEO metadata in <head>
					for (let i in div.childNodes) {
						let el = div.childNodes[i];
						if (/(META|TITLE)/.test(el.nodeName)) {
							document.head.appendChild(el);
						}
					}
					if (article.link) {
						let cannonical = document.createElement('link');
						cannonical.setAttribute('rel', 'canonical');
						cannonical.setAttribute('href', article.link);
						document.head.appendChild(cannonical);
					}
				};

				fetchArticle(url, onSuccess, (err) => {
					self.status.code = 500;
					self.status.message = `Failed to get resource.`;
					console.warn(err);
				});

				self.status.code = 200;
			}
		};
	};
})(lnArticleController);
