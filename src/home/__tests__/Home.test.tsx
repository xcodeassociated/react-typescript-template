import React from 'react';
import { render, screen } from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import { Home } from '../Home';

test('renders home page component', () => {
    render(
        <React.StrictMode>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        </React.StrictMode>
    );

    const element = screen.getByText(/home page/i);
    expect(element).toBeInTheDocument();
});