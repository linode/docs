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

					onSuccess({
						title: article.title.rendered,
						content: content,
						author: author,
						date: dateGMT,
						dateStr: dateFormat(dateGMT),
						modified: modifiedGMT,
						modifiedStr: dateFormat(modifiedGMT),
						image: embedded && embedded['wp:featuredmedia'] ? embedded['wp:featuredmedia'][0] : null
					});
				})
				.catch((err) => {
					onError(err);
				});
		};

		return {
			status: { ok: true },
			data: { article: {} },

			init: function() {
				var self = this;
				let pathname = decodeURIComponent(window.location.pathname);
				let match = pathname.match(/docs\/blog\/(.+)/);
				match = match.slice(1, match.length);

				if (match.length < 1) {
					return;
				}

				let slugOrObjectPath = match[0].replace(/\/$/, '');

				var url;

				if (slugOrObjectPath.includes('/')) {
					url = `https://www.linode.com/wp-json/wp/v2/${slugOrObjectPath}/`;
				} else {
					url = `https://www.linode.com/wp-json/wp/v2/posts?slug=${slugOrObjectPath}&_embed=1`;
				}

				var onSuccess = (article) => {
					self.data.article = article;
				};

				fetchArticle(url, onSuccess, (err) => {
					self.status.ok = false;
					self.status.message = `Failed to get ${url}`;
					console.log(err);
				});

				self.status.ok = true;
			}
		};
	};
})(lnArticleController);
