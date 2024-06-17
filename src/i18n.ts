import i18next from "i18next"
import {initReactI18next} from "react-i18next"
import translationEnglish from "./locale/en_US.json"
import translationPolish from "./locale/pl_PL.json"


export type Language = {
    value: 'en' | 'pl'
}

const resources = {
    en: {
        main: translationEnglish,
    },
    pl: {
        main: translationPolish,
    }
}

i18next
    .use(initReactI18next)
    .init({
        resources,
        debug: false,
        lng: 'en',
        react: {
            bindI18n: 'loaded languageChanged',
            bindI18nStore: 'added',
            useSuspense: true,
        },
    })

export default i18next
