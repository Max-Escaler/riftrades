import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import CardList from './CardList.jsx';

const CardPanel = ({ 
    allCards, 
    title, 
    cards, 
    cardOptions, 
    inputValue, 
    onInputChange, 
    onAddCard, 
    onRemoveCard, 
    onUpdateQuantity,
    isMobile, 
    totalColor = 'primary',
    disabled = false,
    isLandscape = false
}) => {
    return (
        <Paper 
            elevation={isLandscape ? 3 : 0}
            sx={{ 
                flex: 1,
                width: '100%',
                maxWidth: '100%',
                minHeight: isLandscape ? '400px' : { xs: '250px', sm: '300px', md: '350px' },
                p: isLandscape ? 3 : { xs: 1.5, sm: 2, md: 2.5 },
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                borderRadius: isLandscape ? 3 : 0,
                border: isLandscape ? '2px solid rgba(99, 102, 241, 0.1)' : '1px solid rgba(99, 102, 241, 0.15)',
                borderTop: isLandscape ? '2px solid rgba(99, 102, 241, 0.1)' : '4px solid #6366f1',
                boxSizing: 'border-box',
                background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
                boxShadow: isLandscape 
                    ? '0 8px 24px rgba(99, 102, 241, 0.12)' 
                    : '0 2px 8px rgba(99, 102, 241, 0.08)',
                '&:hover': {
                    boxShadow: isLandscape 
                        ? '0 12px 32px rgba(99, 102, 241, 0.18)' 
                        : '0 4px 12px rgba(99, 102, 241, 0.12)',
                    transform: isLandscape ? 'translateY(-2px)' : 'none',
                    borderTopColor: '#a855f7'
                }
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: { xs: 1.5, sm: 2, md: 2.5, lg: 3, xl: 3.5 },
                transition: 'all 0.3s ease',
                width: '100%',
                pb: 1.5,
                borderBottom: '2px solid rgba(99, 102, 241, 0.1)'
            }}>
                <Typography 
                    variant="h6" 
                    sx={{ 
                        fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem', lg: '1.5rem', xl: '1.65rem' },
                        fontWeight: 700,
                        color: '#1a1625',
                        letterSpacing: '-0.01em',
                        transition: 'font-size 0.3s ease'
                    }}
                >
                    {title}
                </Typography>
            </Box>
            
            {/* List of Added Cards with Search Input */}
            <CardList
                allCards={allCards}
                cards={cards}
                onRemoveCard={onRemoveCard}
                onUpdateQuantity={onUpdateQuantity}
                isMobile={isMobile}
                cardOptions={cardOptions}
                inputValue={inputValue}
                onInputChange={onInputChange}
                onAddCard={onAddCard}
                title={title}
                disabled={disabled}
            />
        </Paper>
    );
};

export default CardPanel;

