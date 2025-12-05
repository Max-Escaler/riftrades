import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { formatTimestamp } from "../../utils/helpers.js";

const Header = ({ lastUpdatedTimestamp }) => {
    return (
        <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                borderBottom: '3px solid rgba(236, 72, 153, 0.5)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)'
            }}
        >
            <Toolbar sx={{
                px: { xs: 1, sm: 2, md: 3 },
                py: { xs: 1, sm: 1.25, md: 1.75 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
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
                            background: 'linear-gradient(135deg, #ffffff 0%, #fce7f3 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '0.02em',
                            textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        🌀 Riftrades
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            mt: 0.5,
                            opacity: 0.95,
                            fontWeight: 500,
                            color: 'white'
                        }}
                    >
                        Prices last updated: {lastUpdatedTimestamp ? formatTimestamp(lastUpdatedTimestamp) : 'Loading...'}
                    </Typography>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;


