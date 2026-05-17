import i18n, { type InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr';
import en from './locales/en';
import sw from './locales/sw';
import ar from './locales/ar';

const options: InitOptions = {
  resources: { fr, en, sw, ar },
  fallbackLng: 'fr',
  lng: localStorage.getItem('language') || 'fr',
  interpolation: {
    escapeValue: false,
  },
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: 'language',
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(options);

i18n.services.formatter?.add('currency', (value: unknown, lng: string | undefined) => {
  if (typeof value !== 'number') return String(value);
  const locale = lng === 'ar' ? 'ar-MA' : lng === 'sw' ? 'sw-KE' : lng === 'en' ? 'en-US' : 'fr-FR';
  const currency = lng === 'ar' ? 'MAD' : lng === 'sw' ? 'KES' : lng === 'en' ? 'USD' : 'EUR';
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
});

i18n.services.formatter?.add('date', (value: unknown, lng: string | undefined) => {
  if (!value) return '';
  const locale = lng === 'ar' ? 'ar-MA' : lng === 'sw' ? 'sw-KE' : lng === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(value as string));
});

export default i18n;
