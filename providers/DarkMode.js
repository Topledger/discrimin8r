import React, { useState } from 'react';
import { DarkModeContext } from '../context/DarkMode';

export const DarkModeProvider = ({ children }) => {

    const [isDarkMode, setIsDarkMode] = useState(false);

    const updateDarkMode = (darkMode) => {
        console.log(darkMode)
    }

    return (
        <DarkModeContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
                updateDarkMode
            }}
        >
            {children}
        </DarkModeContext.Provider>
    );
}; 