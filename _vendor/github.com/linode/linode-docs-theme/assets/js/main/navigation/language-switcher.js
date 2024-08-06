'use strict';

import { getCurrentLangFromLocation } from '../helpers/helpers';

var debug = 0 ? console.log.bind(console, '[language-switcher]') : function () {};

export function newLanguageSwitcherController(weglot_api_key) {
	debug('newLanguageSwitcherController');
	const initAndSwitchTo = function (self) {
		let lang = self.currentLang;
		self.$store.nav.lang = lang;
		setTimeout(() => {
			// We navigate with Turbo, but we need to initialize Weglot on each
			// page load.
			Weglot.initialized = false;
			Weglot.on('initialized', () => {
				debug('Weglot initialized');
				Weglot.switchTo(lang);
			});
			initWeglot(weglot_api_key);
		}, 600);
	};

	// This needs to be a function to get the $persist binded.
	return function () {
		return {
			show: true,
			open: false,
			currentLang: this.$persist('en'),
			languages: [
				{ lang: 'en', name: 'English' },
				{ lang: 'es', name: 'Español' },
			],

			init: function () {
				console.log('init language');
				const langParam = getCurrentLangFromLocation();
				if (langParam) {
					this.currentLang = langParam;
				}

				if (!this.isDefaultLanguage()) {
					this.$nextTick(() => {
						initAndSwitchTo(this);
					});
				}
			},

			switchLanguage: function (lang) {
				if (!lang || lang === this.currentLang) {
					return;
				}
				// Do a full refresh to make sure all links etc. gets updatedd.
				if (window.location.search.includes('lang=')) {
					window.location.search = `lang=${lang}`;
				} else {
					window.location.search += `&lang=${lang}`;
				}
			},

			currentLanguage: function () {
				return this.languages.find((element) => {
					return element.lang === this.currentLang;
				});
			},
			languageIDs: function (prefix) {
				//A string of language IDs prefixed with the given prefix separated by spaces.
				let s = '';
				for (let i = 0; i < this.languages.length; i++) {
					s += prefix + this.languages[i].lang;
					if (i < this.languages.length - 1) {
						s += ' ';
					}
				}
				return s;
			},
			isDefaultLanguage: function () {
				return this.currentLang === 'en';
			},
		};
	};
}

function initWeglot(apiKey) {
	debug('initWeglot');
	// Initialization of Weglot.
	Weglot.initialize({
		api_key: apiKey,
		hide_switcher: true,
	});
}
