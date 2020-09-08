// Having these JS config files here is unfortunate,
// see https://github.com/gohugoio/hugo/issues/7635
const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
	// eslint-disable-next-line no-process-env
	plugins: [ tailwind, ...(process.env.HUGO_ENVIRONMENT === 'production' ? [ autoprefixer ] : []) ]
};
