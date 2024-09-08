import { createI18n } from 'vue-i18n'
import {LANG_VALUE} from '@/common/enum'
import zhHans from './zh-Hans'
import en from './en'
const i18n = createI18n({
    legacy: false,
    locale: getLanguage(),
    messages: {
        [LANG_VALUE.Zh]: zhHans,
        [LANG_VALUE.En]: en
    }
})

export function getLanguage(){
    const chooseLanguage = localStorage.getItem('lang')
    if(chooseLanguage) return chooseLanguage
    const language = navigator.language.toLowerCase()
    const locales = [LANG_VALUE.En, LANG_VALUE.Zh]
    for(let locale of locales){
        if(language.indexOf(locale)>-1){
            return locale
        }
        return LANG_VALUE.Zh
    }
}

export default i18n