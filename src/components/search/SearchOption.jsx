import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getCardGradient, highlightMatch } from '../../utils/searchUtils';
import { useThemeMode } from '../../contexts/ThemeContext.jsx';
import { usePriceType } from '../../contexts/PriceContext.jsx';

/**
 * Format a card type into a cleaner display name
 */
const formatCardType = (subTypeName) => {
    if (!subTypeName) return null;
    
    const type = subTypeName.toLowerCase();
    
    // Return clean labels for different types
    if (type.includes('pack foil')) return 'Pack Foil';
    if (type.includes('nexus night')) return 'Nexus Night';
    if (type.includes('foil')) return 'Foil';
    if (type.includes('promo')) return 'Promo';
    if (type.includes('normal')) return null; // Don't show badge for normal cards
    
    // Return the original if it's something else
    return subTypeName;
};

/**
 * SearchOption Component
 * Renders an individual search result option with gradient support
 */
const SearchOption = ({ 
    option, 
    isHighlighted = false,
    searchTerm = '',
    onClick,
    onMouseEnter
}) => {
    const { isDark } = useThemeMode();
    const { priceSource } = usePriceType();
    const [isHovered, setIsHovered] = useState(false);
    const gradient = getCardGradient(option.subTypeName, '', isDark);
    const textSegments = highlightMatch(option.label, searchTerm);
    
    // Get the card type badge
    const cardType = formatCardType(option.subTypeName);
    
    // Get set name
    const setName = option.setName || option.card?._setName || '';
    
    // Get price from card object
    const price = option.card?.marketPrice || option.card?.lowPrice || 0;
    
    // Format price based on price source
    const formatPrice = (amount) => {
        if (priceSource === 'cardmarket') {
            const cmPrice = option.card?.cardmarketTrend || option.card?.cardmarketLow || 0;
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(cmPrice);
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(amount);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <Box
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                px: 2,
                py: 1,
                cursor: 'pointer',
                background: (isHighlighted || isHovered) ? gradient.backgroundHover : gradient.background,
                transition: 'all 0.2s ease',
                borderBottom: isDark 
                    ? '1px solid rgba(58, 154, 186, 0.1)' 
                    : '1px solid rgba(26, 90, 122, 0.08)',
                '&:last-child': {
                    borderBottom: 'none'
                },
                '&:hover': {
                    background: gradient.backgroundHover
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5
            }}
        >
            {/* Left side: Card name, set name, and type badge */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                minWidth: 0,
                flex: 1,
                gap: 0.25
            }}>
                {/* Card name row */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    minWidth: 0
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            fontSize: { xs: '0.85rem', sm: '0.9rem' },
                            fontWeight: isHighlighted || isHovered ? 600 : 500,
                            color: isDark ? '#e8f4f8' : '#0a2540',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}
                    >
                        {textSegments.map((segment, index) => (
                            <span
                                key={index}
                                style={{
                                    fontWeight: segment.highlight ? 700 : 'inherit',
                                    backgroundColor: segment.highlight 
                                        ? (isDark ? 'rgba(212, 168, 83, 0.3)' : 'rgba(26, 90, 122, 0.15)')
                                        : 'transparent',
                                    padding: segment.highlight ? '2px 4px' : '0',
                                    borderRadius: segment.highlight ? '3px' : '0'
                                }}
                            >
                                {segment.text}
                            </span>
                        ))}
                    </Typography>
                    
                    {/* Card Type Badge */}
                    {cardType && (
                        <Chip
                            label={cardType}
                            size="small"
                            sx={{
                                height: '18px',
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                backgroundColor: isDark 
                                    ? 'rgba(212, 168, 83, 0.25)' 
                                    : 'rgba(26, 90, 122, 0.12)',
                                color: isDark ? '#e5c078' : '#1a5a7a',
                                border: isDark 
                                    ? '1px solid rgba(212, 168, 83, 0.4)' 
                                    : '1px solid rgba(26, 90, 122, 0.25)',
                                '& .MuiChip-label': {
                                    px: 0.75
                                },
                                flexShrink: 0
                            }}
                        />
                    )}
                </Box>
                
                {/* Set name - smaller, subtle text */}
                {setName && (
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.7rem',
                            fontWeight: 400,
                            color: isDark ? 'rgba(160, 196, 212, 0.7)' : 'rgba(26, 74, 110, 0.6)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.2
                        }}
                    >
                        {setName}
                    </Typography>
                )}
            </Box>
            
            {/* Right side: Price */}
            <Typography
                variant="body2"
                sx={{
                    fontSize: { xs: '0.8rem', sm: '0.85rem' },
                    fontWeight: 600,
                    color: isDark ? '#5abada' : '#1a5a7a',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                }}
            >
                {formatPrice(price)}
            </Typography>
        </Box>
    );
};

export default SearchOption;
