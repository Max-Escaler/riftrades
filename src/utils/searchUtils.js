/**
 * Search Utilities for Riftbound
 * Helper functions for card searching and filtering
 */

/**
 * Filter card options based on search input
 * @param {Array} options - Array of card option objects
 * @param {string} searchTerm - Search string
 * @param {number} limit - Maximum number of results to return
 * @returns {Array} Filtered options
 */
export const filterCardOptions = (options, searchTerm, limit = 10) => {
    if (!searchTerm || searchTerm.trim() === '') {
        return options.slice(0, Math.min(limit, 20));
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Filter options that contain the search term
    const filtered = options.filter(option => {
        const label = option.label?.toLowerCase() || '';
        return label.includes(term);
    });

    // Sort with priority: exact match > starts with > contains
    const sorted = filtered.sort((a, b) => {
        const aLabel = a.label?.toLowerCase() || '';
        const bLabel = b.label?.toLowerCase() || '';
        
        // Check for exact match
        const aExact = aLabel === term;
        const bExact = bLabel === term;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Check for starts with
        const aStarts = aLabel.startsWith(term);
        const bStarts = bLabel.startsWith(term);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        // Both contain but don't start with - sort alphabetically
        return aLabel.localeCompare(bLabel);
    });

    return sorted.slice(0, limit);
};

/**
 * Highlight matching text in a string
 * @param {string} text - Original text
 * @param {string} searchTerm - Term to highlight
 * @returns {Array} Array of text segments with highlight flags
 */
export const highlightMatch = (text, searchTerm) => {
    if (!searchTerm || !text) {
        return [{ text, highlight: false }];
    }

    const term = searchTerm.toLowerCase();
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(term);

    if (index === -1) {
        return [{ text, highlight: false }];
    }

    const segments = [];
    
    if (index > 0) {
        segments.push({ text: text.slice(0, index), highlight: false });
    }
    
    segments.push({ 
        text: text.slice(index, index + searchTerm.length), 
        highlight: true 
    });
    
    if (index + searchTerm.length < text.length) {
        segments.push({ 
            text: text.slice(index + searchTerm.length), 
            highlight: false 
        });
    }

    return segments;
};

/**
 * Get gradient style based on card rarity/type
 * Adapted for Riftbound card types with teal/gold theme
 * @param {string} subTypeName - Card's subTypeName field (foil type)
 * @param {string} rarity - Card's rarity field
 * @param {boolean} isDark - Whether dark mode is active
 * @returns {Object} Object with background and backgroundHover properties
 */
export const getCardGradient = (subTypeName, rarity = '', isDark = false) => {
    const subType = (subTypeName || '').toLowerCase();
    const rarityLower = (rarity || '').toLowerCase();
    
    // Foil variants - gold shimmer theme for Riftbound
    if (subType.includes('foil') || subType.includes('holo')) {
        if (isDark) {
            return {
                background: 'linear-gradient(135deg, #1a3a4a 0%, #2a4a3a 20%, #3a4a2a 40%, #4a3a2a 60%, #3a2a4a 80%, #1a3a4a 100%)',
                backgroundHover: 'linear-gradient(135deg, #2a4a5a 0%, #3a5a4a 20%, #4a5a3a 40%, #5a4a3a 60%, #4a3a5a 80%, #2a4a5a 100%)'
            };
        }
        return {
            background: 'linear-gradient(135deg, #e8f4f8 0%, #f0f8e8 20%, #f8f4e0 40%, #f8e8d8 60%, #f0e0f0 80%, #e8f4f8 100%)',
            backgroundHover: 'linear-gradient(135deg, #d0e8f0 0%, #e0f0d8 20%, #f0e8d0 40%, #f0d8c8 60%, #e8d0e8 80%, #d0e8f0 100%)'
        };
    }
    
    // Premium/special variants - gold accent
    if (subType.includes('premium') || subType.includes('special')) {
        return {
            background: 'linear-gradient(135deg, #0a2540 0%, #1a4a6e 50%, #d4a853 100%)',
            backgroundHover: 'linear-gradient(135deg, #0d3050 0%, #2a5a7e 50%, #e5c078 100%)'
        };
    }
    
    // Normal cards - teal theme
    if (isDark) {
        return {
            background: 'linear-gradient(135deg, #0d3050 0%, #0a2540 100%)',
            backgroundHover: 'linear-gradient(135deg, #1a4a6e 0%, #0d3050 100%)'
        };
    }
    return {
        background: 'linear-gradient(135deg, #ffffff 0%, #e8f4f8 100%)',
        backgroundHover: 'linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%)'
    };
};

/**
 * Debounce function for search input
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};
