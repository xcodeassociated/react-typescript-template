import React from 'react';
import {render, screen} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import {Home} from '../Home';

test('renders home page component', () => {
    render(
        <BrowserRouter>
            <Home/>
        </BrowserRouter>
    );

    const element = screen.getByText(/home page/i)
    expect(element).toBeInTheDocument()
});