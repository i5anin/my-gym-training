import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import ruLocale from 'vuetify/lib/locale/ru' // импортируйте русскую локализацию

const savedTheme = localStorage.getItem('theme')
const isDark =
  savedTheme === 'dark' ||
  (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

// Расширьте объект ruLocale, добавив свои строки локализации
const ru = { ...ruLocale }

const vuetify = createVuetify({
  lang: {
    locales: { ru },
    current: 'ru',
  },
  theme: {
    defaultTheme: savedTheme || (isDark ? 'dark' : 'light'),
    themes: {
      light: {
        colors: { primary: '#1867C0', secondary: '#5CBBF6' },
      },
      dark: {
        dark: true,
        variables: {},
        colors: { primary: '#1867C0', secondary: '#5CBBF6' },
      },
    },
  },
})

export default vuetify
