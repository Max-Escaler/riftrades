import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeMode must be used within a ThemeModeProvider');
    }
    return context;
};

// Light theme
const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#a855f7',
            light: '#c084fc',
            dark: '#9333ea',
            contrastText: '#ffffff',
        },
        success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
        },
        error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
        },
        warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
        },
        info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
        },
        background: {
            default: '#f5f3ff',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1625',
            secondary: '#4c4359',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 100%)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
                colorPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                },
                colorSuccess: {
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                },
            },
        },
    },
});

// Dark theme
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8',
            light: '#a5b4fc',
            dark: '#6366f1',
            contrastText: '#0f0f23',
        },
        secondary: {
            main: '#c084fc',
            light: '#d8b4fe',
            dark: '#a855f7',
            contrastText: '#0f0f23',
        },
        success: {
            main: '#34d399',
            light: '#6ee7b7',
            dark: '#10b981',
        },
        error: {
            main: '#f87171',
            light: '#fca5a5',
            dark: '#ef4444',
        },
        warning: {
            main: '#fbbf24',
            light: '#fcd34d',
            dark: '#f59e0b',
        },
        info: {
            main: '#60a5fa',
            light: '#93c5fd',
            dark: '#3b82f6',
        },
        background: {
            default: '#0f0f23',
            paper: '#1a1a2e',
        },
        text: {
            primary: '#f0f0f5',
            secondary: '#a0a0b0',
        },
    },
    typography: {
        fontFamily: '"Outfit", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '10px 24px',
                    boxShadow: 'none',
                },
                contained: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    borderRadius: 8,
                },
                colorPrimary: {
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
                },
                colorSuccess: {
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

export const ThemeModeProvider = ({ children }) => {
    // Check for saved preference or system preference
    const getInitialMode = () => {
        const saved = localStorage.getItem('riftrades-theme-mode');
        if (saved) {
            return saved;
        }
        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    };

    const [mode, setMode] = useState(getInitialMode);

    // Save preference to localStorage
    useEffect(() => {
        localStorage.setItem('riftrades-theme-mode', mode);
    }, [mode]);

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
    };

    const theme = useMemo(() => {
        return mode === 'dark' ? darkTheme : lightTheme;
    }, [mode]);

    const value = {
        mode,
        setMode,
        toggleMode,
        theme,
        isDark: mode === 'dark'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;

