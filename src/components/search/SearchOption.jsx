import React, { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { getCardGradient, highlightMatch } from '../../utils/searchUtils';
import { useThemeMode } from '../../contexts/ThemeContext.jsx';
import { usePriceType } from '../../contexts/PriceContext.jsx';
import { CardThumbnail } from '../ui/CardImagePreview.jsx';

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
 * Renders an individual search result option - full width, compact design
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
    
    // Get set name and image URL
    const setName = option.setName || option.card?._setName || '';
    const imageUrl = option.card?.imageUrl || '';
    
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
                px: 1.5,
                py: 0.75,
                cursor: 'pointer',
                background: (isHighlighted || isHovered) ? gradient.backgroundHover : gradient.background,
                transition: 'all 0.15s ease',
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
                gap: 1,
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            {/* Card thumbnail - smaller */}
            <CardThumbnail 
                imageUrl={imageUrl} 
                alt={option.label} 
                size={28}
            />
            
            {/* Card info: name and set - takes remaining space */}
            <Box sx={{ 
                flex: 1,
                minWidth: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 0
            }}>
                {/* Card name */}
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.75,
                    minWidth: 0
                }}>
                    <Typography
                        component="span"
                        sx={{
                            fontSize: '0.8rem',
                            fontWeight: isHighlighted || isHovered ? 600 : 500,
                            color: isDark ? '#e8f4f8' : '#0a2540',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: 1.3
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
                                    padding: segment.highlight ? '1px 3px' : '0',
                                    borderRadius: segment.highlight ? '2px' : '0'
                                }}
                            >
                                {segment.text}
                            </span>
                        ))}
                    </Typography>
                    
                    {/* Card Type Badge - inline, smaller */}
                    {cardType && (
                        <Chip
                            label={cardType}
                            size="small"
                            sx={{
                                height: '16px',
                                fontSize: '0.55rem',
                                fontWeight: 600,
                                backgroundColor: isDark 
                                    ? 'rgba(212, 168, 83, 0.25)' 
                                    : 'rgba(26, 90, 122, 0.12)',
                                color: isDark ? '#e5c078' : '#1a5a7a',
                                border: isDark 
                                    ? '1px solid rgba(212, 168, 83, 0.4)' 
                                    : '1px solid rgba(26, 90, 122, 0.25)',
                                '& .MuiChip-label': {
                                    px: 0.5,
                                    py: 0
                                },
                                flexShrink: 0
                            }}
                        />
                    )}
                </Box>
                
                {/* Set name - smaller, subtle text */}
                {setName && (
                    <Typography
                        component="span"
                        sx={{
                            fontSize: '0.65rem',
                            fontWeight: 400,
                            color: isDark ? 'rgba(160, 196, 212, 0.6)' : 'rgba(26, 74, 110, 0.5)',
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
            
            {/* Price - right aligned */}
            <Typography
                component="span"
                sx={{
                    fontSize: '0.75rem',
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
