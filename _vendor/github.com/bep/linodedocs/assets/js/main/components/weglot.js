(function() {
	var weglotInit = function() {
		Weglot.initialize({
			api_key: lnWeglotApiKey, // see loader/load.js
			switchers: [
				{
					styleOpt: {
						fullname: true,
						withname: true,
						is_dropdown: true,
						with_flags: true,
						invert_flags: true
					},
					target: 'div.weglot-nav',
					sibling: null
				}
			]
		});

		Weglot.on('initialized', function() {
			console.log('Weglot Initialized.');
		});

		Weglot.on('languageChanged', function() {
			var currentLang = Weglot.getCurrentLang();
			console.log('Language changed to ' + currentLang);
			if (currentLang == 'es') {
				//$('.library-github').after(
				//"<blockquote id='translation' class='cloud_manager_link'><strong class='callout-title'>Traducciones al Español</strong><div>Estamos traduciendo nuestros guías y tutoriales al Español. Es posible que usted esté viendo una traducción generada automáticamente. Estamos trabajando con traductores profesionales para verificar las traducciones de nuestro sitio web. Este proyecto es un trabajo en curso.</div></blockquote>"
				//);
			} else if (currentLang == 'en') {
				//$('#translation').remove();
			}
		});
	};

	weglotInit();
})();
