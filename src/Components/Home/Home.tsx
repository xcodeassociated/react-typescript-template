import React from "react";
import styled from "styled-components";

const HomeWrapper = styled.div`
  font-size: 32px;
  @media (max-width: 800px) {
  }
`;

interface HomeProps {
}

export const Home: React.FC<HomeProps> = () => {

    return (
        <>
            <HomeWrapper>
                <p>
                    home page
                </p>
            </HomeWrapper>
        </>
    )
}