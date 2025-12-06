import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Chip, 
    Button,
    Tooltip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    ToggleButtonGroup,
    ToggleButton
} from '@mui/material';
import { 
    Warning as WarningIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { formatCurrency } from "../../utils/helpers.js";
import { usePriceType } from "../../contexts/PriceContext.jsx";
import { useThemeMode } from "../../contexts/ThemeContext.jsx";

const TradeSummary = ({ 
    haveList, 
    wantList, 
    haveTotal, 
    wantTotal, 
    diff, 
    isLandscape = false,
    clearURLTradeData,
    urlTradeData,
    hasLoadedFromURL
}) => {
    const { priceType, setPriceType, priceSource, setPriceSource } = usePriceType();
    const { isDark } = useThemeMode();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const handlePriceTypeChange = (event, newPriceType) => {
        if (newPriceType !== null) {
            setPriceType(newPriceType);
        }
    };

    const handlePriceSourceChange = (event, newPriceSource) => {
        if (newPriceSource !== null) {
            setPriceSource(newPriceSource);
        }
    };

    // Format currency based on price source
    const formatPrice = (amount) => {
        if (priceSource === 'cardmarket') {
            return new Intl.NumberFormat('de-DE', {
                style: 'currency',
                currency: 'EUR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }).format(amount);
        }
        return formatCurrency(amount);
    };

    const handleClearTradeData = () => {
        clearURLTradeData();
        setShowClearConfirm(false);
    };

    const formatAge = (ageInDays) => {
        if (ageInDays < 1) return 'less than a day';
        if (ageInDays < 7) return `${Math.round(ageInDays)} day${Math.round(ageInDays) !== 1 ? 's' : ''}`;
        if (ageInDays < 30) return `${Math.round(ageInDays / 7)} week${Math.round(ageInDays / 7) !== 1 ? 's' : ''}`;
        return `${Math.round(ageInDays / 30)} month${Math.round(ageInDays / 30) !== 1 ? 's' : ''}`;
    };

    // Common toggle button styles - Riftbound teal/gold
    const toggleButtonSx = {
        '& .MuiToggleButton-root': {
            px: { xs: 0.75, sm: 1 },
            py: { xs: 0.25, sm: 0.5 },
            fontSize: { xs: '0.65rem', sm: '0.7rem' },
            textTransform: 'none',
            border: isDark ? '1px solid rgba(58, 154, 186, 0.4)' : '1px solid rgba(26, 90, 122, 0.3)',
            color: isDark ? '#5abada' : '#1a5a7a',
            '&.Mui-selected': {
                backgroundColor: isDark ? '#3a9aba' : '#1a5a7a',
                color: isDark ? '#0a2540' : '#ffffff',
                '&:hover': {
                    backgroundColor: isDark ? '#5abada' : '#0d4560'
                }
            },
            '&:hover': {
                backgroundColor: isDark ? 'rgba(58, 154, 186, 0.15)' : 'rgba(26, 90, 122, 0.08)'
            }
        }
    };

    // Theme-aware colors - Riftbound palette
    const textColor = isDark ? '#e8f4f8' : '#0a2540';
    const bgGradient = isLandscape 
        ? (isDark ? 'linear-gradient(180deg, #0d3050 0%, #0a2540 100%)' : 'linear-gradient(180deg, #ffffff 0%, #e8f4f8 100%)')
        : (isDark ? 'linear-gradient(90deg, #0a2540 0%, #0d3050 50%, #0a2540 100%)' : 'linear-gradient(90deg, #e8f4f8 0%, #ffffff 50%, #e8f4f8 100%)');

    return (
        <>
        <Box sx={{
            display: 'flex',
            flexDirection: isLandscape ? 'column' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
            p: isLandscape ? 2.5 : 0,
            background: bgGradient,
            borderTop: isLandscape ? 'none' : `3px solid #d4a853`,
            borderBottom: isLandscape ? 'none' : `3px solid #d4a853`,
            borderRadius: isLandscape ? 3 : 0,
            border: isLandscape ? `2px solid ${isDark ? 'rgba(212, 168, 83, 0.3)' : 'rgba(26, 90, 122, 0.15)'}` : 'none',
            width: isLandscape ? '280px' : '100%',
            minWidth: isLandscape ? '280px' : 'auto',
            maxWidth: isLandscape ? '320px' : '100%',
            boxSizing: 'border-box',
            boxShadow: isLandscape ? '0 8px 24px rgba(10, 37, 64, 0.2)' : '0 4px 12px rgba(10, 37, 64, 0.1)'
        }}>
            {/* Price Source & Type Selectors - Landscape mode (stacked) */}
            {isLandscape && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    py: 1.5,
                    borderBottom: `2px solid ${isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.1)'}`,
                    width: '100%'
                }}>
                    {/* Price Source: TCGPlayer vs CardMarket */}
                    <ToggleButtonGroup
                        value={priceSource}
                        exclusive
                        onChange={handlePriceSourceChange}
                        size="small"
                        sx={toggleButtonSx}
                    >
                        <ToggleButton value="tcgplayer" aria-label="TCGPlayer prices (USD)">
                            🇺🇸 TCGPlayer
                        </ToggleButton>
                        <ToggleButton value="cardmarket" aria-label="CardMarket prices (EUR)">
                            🇪🇺 CardMarket
                        </ToggleButton>
                    </ToggleButtonGroup>
                    
                    {/* Price Type: Market vs Low */}
                    <ToggleButtonGroup
                        value={priceType}
                        exclusive
                        onChange={handlePriceTypeChange}
                        size="small"
                        sx={toggleButtonSx}
                    >
                        <ToggleButton value="market" aria-label="market/trend price">
                            {priceSource === 'cardmarket' ? 'Trend' : 'Market'}
                        </ToggleButton>
                        <ToggleButton value="low" aria-label="low price">
                            Low
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            )}

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isLandscape ? 1 : 2,
                px: isLandscape ? 1 : { xs: 0.5, sm: 0.75, md: 1 },
                py: isLandscape ? 1 : { xs: 0.25, sm: 0.5, md: 0.75 },
                flexDirection: isLandscape ? 'column' : 'row'
            }}>
                <Typography variant="h6" sx={{ 
                    fontWeight: 'medium', 
                    color: textColor, 
                    fontSize: isLandscape ? '0.75rem' : { xs: '0.8rem', sm: '0.9rem' },
                    textAlign: 'center'
                }}>
                    My {haveList.length} cards
                </Typography>
                <Chip 
                    label={formatPrice(haveTotal.toFixed(2))} 
                    color="primary" 
                    variant="filled" 
                    size={isLandscape ? 'small' : 'medium'}
                />
            </Box>

            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isLandscape ? 1 : 1,
                px: isLandscape ? 2 : { xs: 1 },
                py: isLandscape ? 2 : { xs: 0.75 },
                background: isDark 
                    ? 'linear-gradient(135deg, #0a2540 0%, #0d3050 100%)' 
                    : 'linear-gradient(135deg, #ffffff 0%, #f0f8fa 100%)',
                borderTop: isLandscape ? 'none' : `2px solid ${isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.1)'}`,
                borderBottom: isLandscape ? 'none' : `2px solid ${isDark ? 'rgba(212, 168, 83, 0.2)' : 'rgba(26, 90, 122, 0.1)'}`,
                borderRadius: isLandscape ? 2 : 0,
                mx: isLandscape ? 0 : 0,
                my: isLandscape ? 1 : 0,
                flexDirection: isLandscape ? 'column' : 'row',
                flexWrap: 'wrap',
                boxShadow: isLandscape ? '0 2px 8px rgba(10, 37, 64, 0.1)' : 'none'
            }}>
                {/* Price Source & Type Selectors - Portrait mode */}
                {!isLandscape && (
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                        mr: 1
                    }}>
                        {/* Price Source: TCGPlayer vs CardMarket */}
                        <ToggleButtonGroup
                            value={priceSource}
                            exclusive
                            onChange={handlePriceSourceChange}
                            size="small"
                            sx={toggleButtonSx}
                        >
                            <ToggleButton value="tcgplayer" aria-label="TCGPlayer prices (USD)">
                                🇺🇸 TCG
                            </ToggleButton>
                            <ToggleButton value="cardmarket" aria-label="CardMarket prices (EUR)">
                                🇪🇺 CM
                            </ToggleButton>
                        </ToggleButtonGroup>
                        
                        {/* Price Type: Market vs Low */}
                        <ToggleButtonGroup
                            value={priceType}
                            exclusive
                            onChange={handlePriceTypeChange}
                            size="small"
                            sx={toggleButtonSx}
                        >
                            <ToggleButton value="market" aria-label="market/trend price">
                                {priceSource === 'cardmarket' ? 'Trend' : 'Market'}
                            </ToggleButton>
                            <ToggleButton value="low" aria-label="low price">
                                Low
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                )}

                {/* Difference section - centered */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isLandscape ? 1 : 2,
                    flexDirection: isLandscape ? 'column' : 'row',
                    justifyContent: 'center',
                    flexGrow: !isLandscape ? 1 : 'none'
                }}>
                    <Typography variant="h6" sx={{ 
                        fontWeight: 'bold', 
                        color: textColor, 
                        fontSize: isLandscape ? '0.75rem' : { xs: '0.8rem' },
                        textAlign: 'center'
                    }}>
                        Difference
                    </Typography>
                    <Chip
                        label={diff > 0 ? `+${formatPrice(diff.toFixed(2))}` : formatPrice(diff.toFixed(2))}
                        color={diff > 0 ? 'primary' : diff < 0 ? 'success' : 'default'}
                        variant="filled"
                        size={isLandscape ? 'small' : 'medium'}
                    />
                </Box>

                {/* Clear Button - on the right side for portrait mode */}
                {!isLandscape && hasLoadedFromURL && urlTradeData && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        ml: 1
                    }}>
                        <Tooltip title="Clear loaded trade data from URL">
                            <IconButton
                                size="small"
                                onClick={() => setShowClearConfirm(true)}
                                sx={{ color: 'warning.main', p: 0.5 }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}

                {/* Clear Button for landscape mode - below difference */}
                {isLandscape && hasLoadedFromURL && urlTradeData && (
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mt: 1
                    }}>
                        <Tooltip title="Clear loaded trade data from URL">
                            <IconButton
                                size="small"
                                onClick={() => setShowClearConfirm(true)}
                                sx={{ color: 'warning.main', p: 0.5 }}
                            >
                                <ClearIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </Box>

            {/* Their Cards Summary */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: isLandscape ? 1 : 2,
                px: isLandscape ? 1 : { xs: 0.5, sm: 0.75, md: 1 },
                py: isLandscape ? 1 : { xs: 0.25, sm: 0.5, md: 0.75 },
                flexDirection: isLandscape ? 'column' : 'row'
            }}>
                <Typography variant="h6" sx={{ 
                    fontWeight: 'medium', 
                    color: textColor, 
                    fontSize: isLandscape ? '0.75rem' : { xs: '0.8rem', sm: '0.9rem' },
                    textAlign: 'center'
                }}>
                    Their {wantList.length} cards
                </Typography>
                <Chip 
                    label={formatPrice(wantTotal.toFixed(2))} 
                    color="success" 
                    variant="filled" 
                    size={isLandscape ? 'small' : 'medium'}
                />
            </Box>

            {/* URL Age Warning */}
            {urlTradeData && urlTradeData.ageInDays > 7 && (
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: isLandscape ? 1 : { xs: 0.5, sm: 0.75, md: 1 },
                    py: 0.5,
                    backgroundColor: isDark ? 'rgba(212, 168, 83, 0.2)' : '#fff3cd',
                    borderTop: `1px solid ${isDark ? 'rgba(212, 168, 83, 0.3)' : '#ffeaa7'}`,
                    borderBottom: `1px solid ${isDark ? 'rgba(212, 168, 83, 0.3)' : '#ffeaa7'}`
                }}>
                    <WarningIcon fontSize="small" sx={{ color: isDark ? '#e5c078' : '#856404' }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#e5c078' : '#856404', fontSize: '0.7rem' }}>
                        Trade data is {formatAge(urlTradeData.ageInDays)} old
                    </Typography>
                </Box>
            )}
        </Box>

        {/* Clear Confirmation Dialog */}
        <Dialog open={showClearConfirm} onClose={() => setShowClearConfirm(false)}>
            <DialogTitle>Clear Loaded Trade Data?</DialogTitle>
            <DialogContent>
                <Typography>
                    This will clear the trade data that was loaded from the URL and remove the URL parameters.
                    Your current trade will remain but won't be linked to the shared URL anymore.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowClearConfirm(false)}>Cancel</Button>
                <Button onClick={handleClearTradeData} color="warning" variant="contained">
                    Clear
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default TradeSummary;
