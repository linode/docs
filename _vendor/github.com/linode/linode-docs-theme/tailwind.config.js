/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-process-env */
const theme = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const customform = require('@tailwindcss/forms');
const { letterSpacing } = require('tailwindcss/defaultTheme');

// Colors
/*
Palette (as a reference from Invisionn:

brand: #02B159
titlecolor: #32363B
textcolor: #5E6065
divider: #EAEAEB
basicGray: #A9AAB0

Grays:

500: '#D9DBE1', // Darker gray border.
700: '#616266', // Dropdown text.


*/
const colorBrand = 'var(--color-brand)'; // Green;
const colorTitle = 'var(--color-title)'; // Dark gray text, e.g. title.;
const colorBodyText = 'var(--color-body-text)'; // Lighter gray, body text etc.;
const colorLightGray = '#edf2f7'; // Code background etc.
const colorBasicGray = '#A9AAB0'; // Slightly darker than body, used for byline text etc.
const colorDivider = 'var(--color-divider)'; // Light gray border.

// Define them here so we can reference them in the configuration.
const blues = {
	100: '#EBF8FF',
	300: '#90CDF4',
	500: '#4299E1',
	700: '#2B6CB0'
};

const grays = {
	100: '#f7fafc',
	200: colorLightGray,
	300: '#e2e8f0',
	400: colorBasicGray,
	500: '#D9DBE1', // Darker gray border.
	600: colorBodyText,
	700: '#616266', // Dropdown text.
	800: colorTitle,
	900: '#1a202c'
};

const greens = {
	50: '#F2FBF7',
	100: '#E6F7EE',
	200: '#C0ECD6',
	300: '#9AE0BD',
	400: '#4EC88B',
	500: '#02B159',
	600: '#029F50',
	700: '#016A35',
	800: '#015028',
	900: '#01351B'
};

const oranges = {
	400: '#F6AD55',
	600: '#DD6B20'
};

const reds = {
	100: '#FEE2E2',
	300: '#FCA5A5',
	400: '#F87171',
	500: '#EF4444',
	600: '#DC2626',
	700: '#B91C1C'
};
// Screen sizes
const maxWidthXl = 1280;
const maxWidthLg = 992;
const maxWidthMd = 768;
const maxWidthSm = 640;

// Utils
const round = (num) => num.toFixed(7).replace(/(\.[0-9]+?)0+$/, '$1').replace(/\.0$/, '');
const rem = (px) => `${round(px / 16)}rem`;
const em = (px, base) => `${round(px / base)}em`;
const px = (px) => `${px}px`;

module.exports = {
	purge: {
		enabled: process.env.HUGO_ENVIRONMENT === 'production',
		mode: 'all',
		preserveHtmlElements: false,
		// TODO1 form
		content: [ './hugo_stats.json' ],
		// Re. x-cloak: hugo_stats.json does not contain attribute name/values (coming in upcoming Hugo).
		// th: fixed in latest Hugo.
		// The /type/ is for @tailwindcss/forms plugin (Hugo does not currently record attribute values).
		safelist: [ 'pl-1', 'pl-3', 'x-cloak', 'th', /^level-|^is-/, /type/ ],
		options: {
			defaultExtractor: (content) => {
				let els = JSON.parse(content).htmlElements;
				els = els.tags.concat(els.classes, els.ids);

				// Transition classes used in JS only.
				els = els.concat(
					'transition-transform transition-opacity ease-out duration-500 sm:duration-700'.split(' ')
				);
				els = els.concat('opacity-0 transform mobile:-translate-x-8 sm:-translate-y-8'.split(' '));
				els = els.concat('opacity-100 transform mobile:translate-x-0 sm:translate-y-0'.split(' '));

				return els;
			}
		}
	},
	corePlugins: {
		container: false
	},
	plugins: [
		function({ addComponents }) {
			addComponents({
				// See https://github.com/tailwindlabs/tailwindcss/issues/1102
				'.container': {
					width: '100%',
					paddingLeft: '1rem',
					paddingRight: '1rem',
					maxWidth: '860px',

					'@screen tablet': {
						paddingLeft: '1.5rem',
						paddingRight: '1.5rem'
					},

					'@screen lg': {
						paddingLeft: '2rem',
						paddingRight: '2rem'
					}
				}
			});
		},
		customform,
		typography
	],
	variants: {
		backgroundColor: [ 'first', 'odd', 'responsive', 'hover', 'focus' ],
		textColor: [ 'responsive', 'hover', 'focus', 'group-hover' ],
		visibility: [ 'hover', 'group-hover' ],
		opacity: [ 'group-hover' ]
	},
	important: '#ln-docs',
	theme: {
		extend: {
			spacing: {
				'1-5': '0.375rem',
				'2-5': '0.625rem',
				'7': '1.75rem',
				'9': '2.25rem',
				'14': '3.5rem',
				'18': '4.5rem',
				'36': '9rem',
				'62': '15.5rem',
				// For images
				'14/9': '62.99%',
				'16/9': '56.25%',
				'20/9': '45.20%',
				'30/9': '30.13%'
			},
			maxWidth: {
				xxs: '8rem;'
			},
			colors: {
				brand: colorBrand, // Explorer icons highlight etc.
				backgroundcolor: '#FAFAFC', // Body background etc.
				titlecolor: colorTitle, // Titles etc.
				basicgray: colorBasicGray, // Light text, explorer counter.
				textcolor: colorBodyText, // Body text.
				divider: colorDivider, // Borders.
				selected: '#F2F2F7', // Selected item.
				icongray: '#737373',

				blue: blues,
				gray: grays,
				green: greens,
				orange: oranges,
				red: reds
			},
			fontFamily: {
				sans: [ 'Source Sans Pro', ...theme.fontFamily.sans ],
				mono: [ 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace' ]
			},
			typography: {
				// See https://github.com/tailwindcss/typography/blob/master/src/styles.js
				DEFAULT: {
					css: {
						color: colorBodyText,
						fontWeight: '400',
						lineHeight: '1.5',
						strong: {
							fontWeight: '600'
						},
						a: {
							color: colorBrand,
							textDecoration: 'none'
						},
						strong: {
							color: false,
							fontWeight: '600'
						},
						h1: {
							color: colorTitle,
							fontWeight: '400',
							marginBottom: '1rem'
						},
						h2: {
							color: colorTitle,
							fontWeight: '600',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h3: {
							color: colorTitle,
							fontWeight: '600',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h4: {
							color: colorTitle,
							fontWeight: '600',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						blockquote: {
							fontWeight: '400',
							fontStyle: 'normal',
							color: colorBodyText,
							borderLeftWidth: '0.25rem',
							borderLeftColor: grays[300],
							quotes: null,
							marginTop: '1em',
							marginBottom: '1em'
						},
						'blockquote p:first-of-type::before': {
							content: ''
						},
						'blockquote p:last-of-type::after': {
							content: ''
						},
						code: {
							color: colorBodyText,
							backgroundColor: colorLightGray,
							fontWeight: '400',
							padding: '0.2em',
							margin: 0,
							fontSize: em(16, 18),
							borderRadius: '3px'
						},
						'pre code': {
							color: 'inherit',
							fontSize: 'inherit',
							letterSpacing: '1px'
						},
						'code::before': {
							content: ''
						},
						'code::after': {
							content: ''
						},
						pre: {
							fontSize: em(14, 16),
							lineHeight: round(24 / 14),
							marginTop: '1em',
							marginBottom: '1em',
							borderRadius: rem(6),
							paddingTop: '1em',
							paddingRight: '1em',
							paddingBottom: '1em',
							paddingLeft: '1em'
						},

						'ul > li::before': {
							backgroundColor: '#cbd5e0'
						},

						'ol > li::before': {
							color: '#71809D'
						},

						// new margins
						p: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						ol: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						ul: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						li: {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li p': {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li > *:first-child': {
							marginTop: '0px'
						},
						'> ul > li > *:last-child': {
							marginBottom: '0px'
						},
						'> ol > li > *:first-child': {
							marginTop: '0px'
						},
						'> ol > li > *:last-child': {
							marginBottom: '0px'
						},
						'ul ul, ul ol, ol ul, ol ol': {
							marginTop: '1em',
							marginBottom: '1em'
						},
						hr: {
							marginTop: '2em',
							marginBottom: '2em'
						},
						table: {
							width: 'auto'
						},
						'thead th': {
							color: colorBodyText,
							textAlign: 'left'
						}
					}
				},
				sm: {
					css: {
						fontSize: rem(16),
						lineHeight: '1.5',
						h1: {
							fontSize: '2em',
							lineHeight: '1.25',
							marginBottom: '1rem'
						},
						h2: {
							fontSize: '1.5em',
							lineHeight: '1.25',
							letterSpacing: '-0.38px',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h3: {
							fontSize: '1.25em',
							lineHeight: '1.25',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h4: {
							fontSize: '1em',
							lineHeight: '1.25',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						'thead tr th': {
							paddingLeft: '1rem',
							paddingRight: '1rem',
							paddingBottom: '0.75rem'
						},
						td: {
							padding: '1rem'
						},
						'tbody td:first-child': {
							paddingLeft: 0
						},
						'tbody td:last-child': {
							paddingRight: 0
						},
						'thead th:first-child': {
							paddingLeft: 0
						},
						'thead th:last-child': {
							paddingRight: '0'
						},
						'thead th': {
							fontSize: rem(16)
						},
						table: {
							fontSize: rem(16),
							lineHeight: round(24 / 16)
						},

						// new margins
						p: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						blockquote: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						pre: {
							marginTop: '1em',
							marginBottom: '1em',
							paddingTop: '1em',
							paddingRight: '1em',
							paddingBottom: '1em',
							paddingLeft: '1em'
						},
						ol: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						ul: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						li: {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li p': {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li > *:first-child': {
							marginTop: '0px'
						},
						'> ul > li > *:last-child': {
							marginBottom: '0px'
						},
						'> ol > li > *:first-child': {
							marginTop: '0px'
						},
						'> ol > li > *:last-child': {
							marginBottom: '0px'
						},
						'ul ul, ul ol, ol ul, ol ol': {
							marginTop: '1em',
							marginBottom: '1em'
						},
						hr: {
							marginTop: '2em',
							marginBottom: '2em'
						}
					}
				},
				lg: {
					css: {
						fontSize: rem(16),
						lineHeight: '1.5',
						h1: {
							fontSize: '2em',
							lineHeight: '1.25',
							marginBottom: '1rem'
						},
						h2: {
							fontSize: '1.5em',
							lineHeight: '1.25',
							letterSpacing: '-0.5px',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h3: {
							fontSize: '1.25em',
							lineHeight: '1.25',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						h4: {
							fontSize: '1em',
							lineHeight: '1.25',
							marginTop: '1.5em',
							marginBottom: '1rem'
						},
						table: {
							fontSize: rem(16),
							lineHeight: round(24 / 16)
						},
						'tbody td:first-child': {
							paddingLeft: rem(21)
						},
						'tbody td:last-child': {
							paddingRight: rem(21)
						},
						'thead th': {
							fontSize: rem(16)
						},

						// new margins
						p: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						blockquote: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						pre: {
							fontSize: em(16, 18),
							marginTop: '1em',
							marginBottom: '1em',
							paddingTop: '1em',
							paddingRight: '1em',
							paddingBottom: '1em',
							paddingLeft: '1em'
						},
						ol: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						ul: {
							marginTop: '1em',
							marginBottom: '1em'
						},
						li: {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li p': {
							marginTop: '.5em',
							marginBottom: '.5em'
						},
						'> ul > li > *:first-child': {
							marginTop: '0px'
						},
						'> ul > li > *:last-child': {
							marginBottom: '0px'
						},
						'> ol > li > *:first-child': {
							marginTop: '0px'
						},
						'> ol > li > *:last-child': {
							marginBottom: '0px'
						},
						'ul ul, ul ol, ol ul, ol ol': {
							marginTop: '1em',
							marginBottom: '1em'
						},
						hr: {
							marginTop: '2em',
							marginBottom: '2em'
						}
					}
				}
			}
		},
		screens: {
			// eslint-disable-next-line lines-around-comment
			/* Mobile: 0px … 767px
			   Tablet: 768px … 991px
			   Desktop: 992px … :infinity:
			*/
			xl: px(maxWidthXl),
			lg: px(maxWidthLg), // Desktop
			md: px(maxWidthMd),
			sm: px(maxWidthSm),
			small: { max: '991px' }, // Common term for mobile, tablets etc. They are small.
			tablet: { min: '768px', max: '991px' },
			mobile: { max: '767px' }
		},
		fontSize: {
			xxs: '0.65625rem',
			xs: '0.75rem',
			sm: '0.85714rem',
			base: '1rem',
			lg: [ '1.125rem', { letterSpacing: '-0.01111111em', lineHeight: '1.333333em' } ],
			xl: [ '1.25rem', { letterSpacing: '-0.011111111em', lineHeight: '1.333333em' } ],
			'2': [ '2rem', { letterSpacing: '-0.02em', lineHeight: '1.2em' } ],
			'2xl': [ '1.5rem', { letterSpacing: '-0.02em', lineHeight: '1.2em' } ],
			'3': [ '1.7142857rem', { letterSpacing: '-0.016666666666667em', lineHeight: '1.333333em' } ],
			'3xl': [ '2rem', { letterSpacing: '-0.015625em', lineHeight: '1.2em' } ],
			'4xl': [ '2.25rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ],
			'5xl': [ '3rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ],
			'6xl': [ '4rem', { letterSpacing: '-.03125em', lineHeight: '1.2em' } ]
		},
		letterSpacing: {
			tighter: '-.05em',
			tight: '-.03125em',
			normal: '0'
		}
	}
};
