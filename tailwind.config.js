const twtype = require('@tailwindcss/typography');
const twforms = require('@tailwindcss/forms');

module.exports = {
  content: ["./src/**/*.{html,js,njk,md}"],
  theme: {
    container: {
			center: true,
			padding: {
				DEFAULT: '.8rem',
				sm: '1.5rem'
			  },
			screens: {
				sm: "100%",
				md: "100%",
				lg: "1140px",
				xl: "1380px",
				"2xl": "1540px"
			}
		},
    extend: {
		backgroundImage: theme => ({
			'home-cover': "url('/assets/images/mast/home.jpg')",
		}),
		maxWidth: {
			xxs: '200px',
		},
		fontFamily: {
			sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			heading: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			serif: ['Rasa', 'ui-serif', 'Georgia', 'serif'],
		},
      	colors: {
			brand: {
				light: '#F3F3F3',
				bright: '#525252',
				DEFAULT: '#000000',
				dark: '#000000',
				darker: '#000000',
				border: '#D9D9D9',
			},
			subtle: {
					DEFAULT: '#F3F3F3',
					dark: '#e5e5e5'
				},
			accent: '#A61E22',
		},
    },
  },

  plugins: [ twtype, twforms ]
}