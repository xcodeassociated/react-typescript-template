import React from "react"
import styled from "styled-components"
import {useTranslation} from "react-i18next"

const HomeWrapper = styled.div`
  @media (max-width: 800px) {
  }
`

export const Home: React.FC = () => {
    const {t} = useTranslation(['main'])

    return (

        <HomeWrapper>
            <h1>
                <p>{t(`home.title`, {ns: ['main']})}</p>
            </h1>
            <h3>
                <p>{t(`home.details`, {ns: ['main']})}</p>
            </h3>
        </HomeWrapper>
    )
}