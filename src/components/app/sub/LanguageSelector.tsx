import React from "react"
import {Select} from "antd"
import {Error} from "../../error/Error"
import {useTranslation} from "react-i18next"


export const LanguageSelector: React.FC = () => {
    const {t, i18n} = useTranslation(['main'])


    const changeLanguage = (selected: string) => {
        switch (selected) {
            case "en":
            case "pl":
                i18n.changeLanguage(selected)
                break
            default:
                throw Error("Unsupported language")
        }
    }

    return (
        <>
            <Select
                style={{width: 60, marginLeft: 'auto'}}
                onChange={changeLanguage}
                defaultValue={'en'}
                options={[
                    {value: 'en', label: 'EN'},
                    {value: 'pl', label: 'PL'}
                ]}
            />
        </>
    )
}