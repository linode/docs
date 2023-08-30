'use strict';

var debug = 0 ? console.log.bind(console, '[promo-codes]') : function () {};

export function newPromoCodesController(isTest) {
	let endpoint = 'https://www.linode.com/wp-json/linode/v1/promo-data';
	if (isTest) {
		// localhost or Netlify.
		// Use local resource to work around CORS issues.
		endpoint = '/docs/wptestjson/promo-data.json';
		// This only ever set in dev/test environments.
		if (window.__api_shouldfail) {
			endpoint = '/docs/wptestjson/promo-data-fail.json';
		}
	}
	debug('isTest:', isTest, 'endpoint:', endpoint);

	return {
		data: {
			foo: 'bar',
			code: {},
		},
		signupURL: function (withPromo) {
			const baseURL = 'https://login.linode.com/signup';
			let promo = this.promoCode();
			if (withPromo && promo) {
				return baseURL + '?promo=' + promo;
			}
			return baseURL;
		},
		promoCode: function () {
			if (this.data.code.promo_code) {
				return this.data.code.promo_code;
			}
			return '';
		},
		init: async function () {
			const response = await fetch(endpoint);
			if (response.ok) {
				let codes = await response.json();
				this.data.code = codes.docs;
				debug('init code docs:', this.data);
			}
		},
	};
}
