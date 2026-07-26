/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				cyber: {
					bg: '#0B0F19',
					card: '#151D30',
					border: '#30363D',
					cyan: '#00D4FF',
					indigo: '#6C5CE7',
					text: '#E6EDF3',
					muted: '#8B949E'
				}
			},
			fontFamily: {
				display: ['"Plus Jakarta Sans"', 'sans-serif'],
				body: ['Inter', 'sans-serif'],
				mono: ['"JetBrains Mono"', 'monospace']
			}
		},
	},
	plugins: [],
}
