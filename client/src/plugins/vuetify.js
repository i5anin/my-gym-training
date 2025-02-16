import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { ru } from 'vuetify/locale' // ✅ Правильный импорт русской локализации

const savedTheme = localStorage.getItem('theme')
const isDark =
  savedTheme === 'dark' ||
  (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)

const vuetify = createVuetify({
  locale: {
    locale: 'ru', // ✅ Устанавливаем русский язык по умолчанию
    fallback: 'ru', // ✅ Если что-то не переведено — остаётся русский
    messages: { ru }, // ✅ Передаём объект локализации
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
