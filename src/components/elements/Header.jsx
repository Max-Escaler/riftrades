import { AppBar, Toolbar, Typography, Box, IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { formatTimestamp } from "../../utils/helpers.js";
import { useThemeMode } from "../../contexts/ThemeContext.jsx";

const Header = ({ lastUpdatedTimestamp }) => {
    const { isDark, toggleMode } = useThemeMode();

    return (
        <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
                background: 'linear-gradient(135deg, #0a2540 0%, #0d3050 50%, #1a4a6e 100%)',
                borderBottom: '3px solid #d4a853',
                boxShadow: '0 4px 20px rgba(10, 37, 64, 0.5)'
            }}
        >
            <Toolbar sx={{
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 1, sm: 1.25, md: 1.75 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Spacer for balance */}
                <Box sx={{ width: 40 }} />

                {/* Center content */}
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexGrow: 1
                }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 800,
                            fontSize: { xs: '1.4rem', sm: '1.75rem', md: '2rem' },
                            background: 'linear-gradient(135deg, #e5c078 0%, #d4a853 50%, #b8892e 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '0.02em',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                        }}
                    >
                        ⚔️ Riftrades
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            mt: 0.5,
                            opacity: 0.9,
                            fontWeight: 500,
                            color: '#a0c4d4'
                        }}
                    >
                        Prices last updated: {lastUpdatedTimestamp ? formatTimestamp(lastUpdatedTimestamp) : 'Loading...'}
                    </Typography>
                </Box>

                {/* Dark mode toggle */}
                <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
                    <IconButton
                        onClick={toggleMode}
                        sx={{
                            color: '#d4a853',
                            '&:hover': {
                                backgroundColor: 'rgba(212, 168, 83, 0.15)',
                            }
                        }}
                    >
                        {isDark ? <LightMode /> : <DarkMode />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
