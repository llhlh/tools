import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import zh from './locales/zh.json'

const STORAGE_KEY = 'time-tool-lang'

function storedLanguage(): string {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'en' || v === 'zh') return v
  } catch {
    /* ignore */
  }
  const nav = navigator.language.toLowerCase()
  return nav.startsWith('zh') ? 'zh' : 'en'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    zh: { translation: zh },
  },
  lng: storedLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export function persistLanguage(lng: string) {
  try {
    localStorage.setItem(STORAGE_KEY, lng)
  } catch {
    /* ignore */
  }
}

export { STORAGE_KEY }
export default i18n
