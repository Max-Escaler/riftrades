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
 * Adapted for Riftbound card types
 * @param {string} subTypeName - Card's subTypeName field (foil type)
 * @param {string} rarity - Card's rarity field
 * @returns {Object} Object with background and backgroundHover properties
 */
export const getCardGradient = (subTypeName, rarity = '') => {
    const subType = (subTypeName || '').toLowerCase();
    const rarityLower = (rarity || '').toLowerCase();
    
    // Foil variants - cosmic/ethereal theme
    if (subType.includes('foil') || subType.includes('holo')) {
        return {
            background: 'linear-gradient(135deg, #e8e0ff 0%, #fff0f5 20%, #e0f5ff 40%, #f0ffe0 60%, #ffe0f0 80%, #e8e0ff 100%)',
            backgroundHover: 'linear-gradient(135deg, #d8d0ff 0%, #ffe0e8 20%, #d0e8ff 40%, #e0ffd0 60%, #ffd0e0 80%, #d8d0ff 100%)'
        };
    }
    
    // Premium/special variants
    if (subType.includes('premium') || subType.includes('special')) {
        return {
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
            backgroundHover: 'linear-gradient(135deg, #4f46e5 0%, #9333ea 50%, #db2777 100%)'
        };
    }
    
    // Normal cards - clean gradient
    return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f8ff 100%)',
        backgroundHover: 'linear-gradient(135deg, #f8f8ff 0%, #f0f0ff 100%)'
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

