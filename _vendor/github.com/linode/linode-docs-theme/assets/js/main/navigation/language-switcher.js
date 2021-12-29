'use strict';

var debug = 0 ? console.log.bind(console, '[language-switcher]') : function() {};

export function newLanguageSwitcherController(weglot_api_key) {
	let isWeglotInitialized = false;
	const initAndSwitchTo = function(self) {
		let lang = self.currentLang;
		self.$store.nav.lang = lang;
		if (!isWeglotInitialized) {
			isWeglotInitialized = true;
			Weglot.on('initialized', () => {
				Weglot.switchTo(lang);
			});
			initWeglot(weglot_api_key);
			return;
		}
		Weglot.switchTo(lang);
	};

	// This needs to be a function to get the $persist binded.
	return function() {
		return {
			show: true,
			open: false,
			currentLang: this.$persist('en'),
			languages: [ { lang: 'en', name: 'English' }, { lang: 'es', name: 'Español' } ],

			init: function() {
				if (!this.isDefaultLanguage()) {
					this.$nextTick(() => {
						initAndSwitchTo(this);
					});
				}
			},

			switchLanguage: function(lang) {
				if (lang === this.currentLang) {
					return;
				}
				this.currentLang = lang;
				initAndSwitchTo(this);
			},

			currentLanguage: function() {
				return this.languages.find((element) => {
					return element.lang === this.currentLang;
				});
			},

			isDefaultLanguage: function() {
				return this.currentLang === 'en';
			},

			onTurboBeforeRender: function() {
				// Avoid loading Weglot if it's English.
				if (!this.isDefaultLanguage()) {
					isWeglotInitialized = false;
					initAndSwitchTo(this);
				}
			}
		};
	};
}

function initWeglot(apiKey) {
	// Initialization of Weglot.
	// Note that Weglot checks for the presence of window.Turbolinks (we now use Turbo),
	// so set a dummy window variable to signal that.
	// We need to do this on every page load.
	window.Turbolinks = true;
	Weglot.initialize({
		api_key: apiKey,
		hide_switcher: true,
		switchers: [
			{
				styleOpt: {
					fullname: true,
					withname: true,
					is_dropdown: true,
					with_flags: true,
					invert_flags: true
				},
				sibling: null
			}
		]
	});
}
