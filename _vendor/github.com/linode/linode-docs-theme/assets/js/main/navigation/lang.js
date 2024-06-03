const linodeDotCom = 'https://www.linode.com';

export function addLangToLinks(lang, container) {
	if (!container) {
		return;
	}
	let links = container.querySelectorAll('a');
	for (let i = 0; i < links.length; i++) {
		let link = links[i];

		let href = link.getAttribute('href');
		if (!href || href.startsWith(`${linodeDotCom}/${lang}/`)) {
			// Language already present.
			continue;
		}
		let hrefWithLang = addLangToHref(href, lang);
		if (href === hrefWithLang) {
			continue;
		}
		link.setAttribute('href', hrefWithLang);
	}
}

export function addLangToHref(href, lang) {
	if (!(href && href.startsWith(`${linodeDotCom}`))) {
		return href;
	}
	let url = new URL(href);
	let pathExcludeRe = /(\/docs\/|\/community\/questions\/|\/wp-content\/)/;
	if (pathExcludeRe.test(url.pathname)) {
		return href;
	}

	if (url.pathname == '/') {
		return `${href}${lang}/`;
	}

	return href.replace(url.pathname, `/${lang}${url.pathname}`);
}
