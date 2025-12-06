import React, { useState } from 'react';
import { 
    Box, 
    Modal, 
    IconButton, 
    CircularProgress,
    Fade
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useThemeMode } from '../../contexts/ThemeContext.jsx';

/**
 * Get higher resolution image URL from TCGPlayer CDN
 * @param {string} imageUrl - Original image URL (usually 200w)
 * @param {string} size - Desired size: 'thumbnail' (200w), 'medium' (400w), 'large' (original)
 */
export const getImageUrl = (imageUrl, size = 'medium') => {
    if (!imageUrl) return null;
    
    switch (size) {
        case 'thumbnail':
            return imageUrl.replace(/_\d+w\.jpg$/, '_200w.jpg');
        case 'medium':
            return imageUrl.replace(/_\d+w\.jpg$/, '_400w.jpg');
        case 'large':
            // Remove the size suffix for full resolution
            return imageUrl.replace(/_\d+w\.jpg$/, '.jpg');
        default:
            return imageUrl;
    }
};

/**
 * Small thumbnail component for card lists
 */
export const CardThumbnail = ({ imageUrl, alt, size = 40, onClick }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const { isDark } = useThemeMode();

    if (!imageUrl || error) {
        return (
            <Box
                sx={{
                    width: size,
                    height: size * 1.4,
                    borderRadius: 1,
                    backgroundColor: isDark ? 'rgba(58, 154, 186, 0.1)' : 'rgba(26, 90, 122, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                }}
            >
                <Box
                    sx={{
                        width: '60%',
                        height: '60%',
                        borderRadius: 0.5,
                        backgroundColor: isDark ? 'rgba(58, 154, 186, 0.2)' : 'rgba(26, 90, 122, 0.15)'
                    }}
                />
            </Box>
        );
    }

    return (
        <Box
            onClick={onClick}
            sx={{
                width: size,
                height: size * 1.4,
                borderRadius: 1,
                overflow: 'hidden',
                flexShrink: 0,
                cursor: onClick ? 'pointer' : 'default',
                position: 'relative',
                boxShadow: isDark 
                    ? '0 2px 4px rgba(0, 0, 0, 0.3)' 
                    : '0 2px 4px rgba(10, 37, 64, 0.15)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': onClick ? {
                    transform: 'scale(1.05)',
                    boxShadow: isDark 
                        ? '0 4px 8px rgba(0, 0, 0, 0.5)' 
                        : '0 4px 8px rgba(10, 37, 64, 0.25)'
                } : {}
            }}
        >
            {!loaded && (
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isDark ? 'rgba(13, 48, 80, 0.5)' : 'rgba(232, 244, 248, 0.5)'
                    }}
                >
                    <CircularProgress size={16} sx={{ color: isDark ? '#5abada' : '#1a5a7a' }} />
                </Box>
            )}
            <img
                src={getImageUrl(imageUrl, 'thumbnail')}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    opacity: loaded ? 1 : 0,
                    transition: 'opacity 0.2s ease'
                }}
            />
        </Box>
    );
};

/**
 * Hover preview component - shows larger image on hover
 */
export const CardHoverPreview = ({ imageUrl, alt, children, placement = 'right' }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const { isDark } = useThemeMode();

    if (!imageUrl) {
        return children;
    }

    return (
        <Box
            onMouseEnter={() => setShowPreview(true)}
            onMouseLeave={() => {
                setShowPreview(false);
                setLoaded(false);
            }}
            sx={{ position: 'relative', display: 'inline-flex', width: '100%' }}
        >
            {children}
            
            <Fade in={showPreview} timeout={200}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        [placement === 'right' ? 'left' : 'right']: '100%',
                        transform: 'translateY(-50%)',
                        ml: placement === 'right' ? 1 : 0,
                        mr: placement === 'left' ? 1 : 0,
                        zIndex: 1400,
                        pointerEvents: 'none',
                        display: showPreview ? 'block' : 'none'
                    }}
                >
                    <Box
                        sx={{
                            width: 180,
                            height: 252,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: isDark 
                                ? '0 8px 24px rgba(0, 0, 0, 0.6)' 
                                : '0 8px 24px rgba(10, 37, 64, 0.3)',
                            border: `2px solid ${isDark ? '#d4a853' : '#1a5a7a'}`,
                            backgroundColor: isDark ? '#0d3050' : '#ffffff',
                            position: 'relative'
                        }}
                    >
                        {!loaded && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isDark ? '#0d3050' : '#e8f4f8'
                                }}
                            >
                                <CircularProgress size={32} sx={{ color: isDark ? '#d4a853' : '#1a5a7a' }} />
                            </Box>
                        )}
                        <img
                            src={getImageUrl(imageUrl, 'medium')}
                            alt={alt}
                            onLoad={() => setLoaded(true)}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: loaded ? 1 : 0,
                                transition: 'opacity 0.2s ease'
                            }}
                        />
                    </Box>
                </Box>
            </Fade>
        </Box>
    );
};

/**
 * Full-screen modal for viewing card image
 */
export const CardImageModal = ({ open, onClose, imageUrl, cardName }) => {
    const [loaded, setLoaded] = useState(false);
    const { isDark } = useThemeMode();

    const handleClose = () => {
        setLoaded(false);
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Fade in={open}>
                <Box
                    sx={{
                        position: 'relative',
                        outline: 'none',
                        maxWidth: '90vw',
                        maxHeight: '90vh'
                    }}
                >
                    {/* Close button */}
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            top: -40,
                            right: 0,
                            color: '#ffffff',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    
                    {/* Card image container */}
                    <Box
                        sx={{
                            borderRadius: 3,
                            overflow: 'hidden',
                            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
                            border: `3px solid ${isDark ? '#d4a853' : '#1a5a7a'}`,
                            backgroundColor: isDark ? '#0d3050' : '#ffffff',
                            position: 'relative'
                        }}
                    >
                        {!loaded && (
                            <Box
                                sx={{
                                    width: 300,
                                    height: 420,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isDark ? '#0d3050' : '#e8f4f8'
                                }}
                            >
                                <CircularProgress size={48} sx={{ color: isDark ? '#d4a853' : '#1a5a7a' }} />
                            </Box>
                        )}
                        <img
                            src={getImageUrl(imageUrl, 'large')}
                            alt={cardName}
                            onLoad={() => setLoaded(true)}
                            style={{
                                maxWidth: '80vw',
                                maxHeight: '80vh',
                                objectFit: 'contain',
                                display: loaded ? 'block' : 'none'
                            }}
                        />
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default { CardThumbnail, CardHoverPreview, CardImageModal, getImageUrl };

