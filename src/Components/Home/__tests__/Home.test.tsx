import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import {Home} from '../Home';
import {GlobalSettingsContext} from '../../App/App';

test('renders home page component', () => {

    render(
        <GlobalSettingsContext.Provider value={{theme: {isDark: false}}}>
            <BrowserRouter>
                <Home/>
            </BrowserRouter>
        </GlobalSettingsContext.Provider>
    );

    const element = screen.getByText(/home.title/i)
    expect(element).toBeInTheDocument()
});