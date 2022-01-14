export function addLangToLinks(lang, container) {
    if(!container) {
        return
    }
	let links = container.querySelectorAll('a');
	for (let i = 0; i < links.length; i++) {
		let link = links[i];
        

		let href = link.getAttribute('href');
		link.setAttribute('href', addLangToHref(href, lang));
	}
}

export function addLangToHref(href, lang) {
	if (!(href && href.startsWith('https://www.linode.com'))) {
		return href;
	}
	let url = new URL(href);
	let pathExcludeRe = /(\/docs\/|\/community\/questions\/|\/wp-content\/)/;
	if (pathExcludeRe.test(url.pathname)) {
		return href;
	}

	return href.replace(url.pathname, `/${lang}${url.pathname}`);
}
