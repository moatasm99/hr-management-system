import type { Config } from 'tailwindcss'

export default <Config>{
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // User requested Primary Color: #5B00BC
                primary: {
                    50: '#F4EFFF',
                    100: '#E6D6FF',
                    200: '#D1B0FF',
                    300: '#B580FF',
                    400: '#9340FF',
                    500: '#7A00FF',
                    600: '#5B00BC', // The requested color
                    700: '#4C009E',
                    800: '#3E0080',
                    900: '#320066',
                    950: '#1D003E',
                },
                // Override indigo to match primary since app uses indigo classes heavily
                indigo: {
                    50: '#F4EFFF',
                    100: '#E6D6FF',
                    200: '#D1B0FF',
                    300: '#B580FF',
                    400: '#9340FF',
                    500: '#7A00FF',
                    600: '#5B00BC',
                    700: '#4C009E',
                    800: '#3E0080',
                    900: '#320066',
                    950: '#1D003E',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    },
    plugins: [],
}
