import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en';
import zh from './zh';
import th from './th';
// import tc from './tc';
import elementEnLocale from 'element-ui/lib/locale/lang/en'
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'
import elementThLocale from 'element-ui/lib/locale/lang/th'
import ElementLocale from 'element-ui/lib/locale'

Vue.use(VueI18n)
ElementLocale.i18n((key, value) => i18n.t(key, value));

const messages = {
  en: {
    ...en,
    ...elementEnLocale,
  },
  zh: {
    ...zh,
    ...elementZhLocale,
  },
  th: {
    ...th,
    ...elementThLocale,
  },
  // tc: {
  //     ...tc
  // }
}

const i18n = new VueI18n({
  locale: localStorage.getItem("language") || window.setting.lang, // set locale
  messages, // set locale messages
  silentTranslationWarn: true,
})

export default i18n
