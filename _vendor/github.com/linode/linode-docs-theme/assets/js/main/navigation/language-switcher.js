'use strict';

import { getCurrentLangFromLocation, setIsTranslating } from '../helpers';

var debug = 0 ? console.log.bind(console, '[language-switcher]') : function () {};

export function newLanguageSwitcherController(weglot_api_key) {
	debug('newLanguageSwitcherController');
	let isWeglotInitialized = false;
	const initAndSwitchTo = function (self) {
		let lang = self.currentLang;
		self.$store.nav.lang = lang;
		setTimeout(() => {
			if (!isWeglotInitialized) {
				isWeglotInitialized = true;
				Weglot.on('initialized', () => {
					Weglot.switchTo(lang);
				});
				initWeglot(weglot_api_key);
				return;
			}
		}, 600);
		Weglot.switchTo(lang);
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
				// To a full refresh to make sure all links etc. gets updatedd.
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

			onTurboRender: function () {
				debug('onTurboRender', isWeglotInitialized);
				// Avoid loading Weglot if it's English.
				if (!this.isDefaultLanguage()) {
					isWeglotInitialized = false;
					initAndSwitchTo(this);
				}
			},
		};
	};
}

function initWeglot(apiKey) {
	debug('initWeglot');
	// Initialization of Weglot.
	// Note that Weglot checks for the presence of window.Turbolinks (we now use Turbo),
	// so set a dummy window variable to signal that.
	// We need to do this on every page load.
	window.Turbolinks = true;
	Weglot.initialize({
		api_key: apiKey,
		hide_switcher: true,
	});
}
