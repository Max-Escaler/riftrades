import React from 'react';
import { TextField, InputAdornment, IconButton, Box } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { useSearch } from '../../hooks/useSearch';
import SearchDropdown from './SearchDropdown';

/**
 * SearchInput Component
 * Main search interface with input field and dropdown
 */
const SearchInput = ({
    label = 'Search',
    placeholder = 'Type to search...',
    items = [],
    value = '',
    onChange,
    onSelect,
    disabled = false,
    fullWidth = true,
    placement = 'bottom',
    autoFocus = false
}) => {
    const {
        isOpen,
        highlightedIndex,
        filteredItems,
        inputRef,
        dropdownRef,
        handleFocus,
        handleBlur,
        handleInputChange,
        handleSelect,
        handleKeyDown,
        handleClear,
        setHighlightedIndex
    } = useSearch({
        items,
        onSelect,
        inputValue: value,
        onInputChange: onChange,
        disabled
    });

    return (
        <Box sx={{ position: 'relative', width: fullWidth ? '100%' : 'auto' }}>
            <TextField
                inputRef={inputRef}
                label={label}
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                fullWidth={fullWidth}
                autoFocus={autoFocus}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="action" sx={{ fontSize: '1.25rem' }} />
                        </InputAdornment>
                    ),
                    endAdornment: value && !disabled ? (
                        <InputAdornment position="end">
                            <IconButton
                                size="small"
                                onClick={handleClear}
                                edge="end"
                                aria-label="clear search"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <ClearIcon sx={{ fontSize: '1.1rem' }} />
                            </IconButton>
                        </InputAdornment>
                    ) : null
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: disabled ? 'rgba(0, 0, 0, 0.02)' : '#ffffff',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: disabled ? 'rgba(0, 0, 0, 0.23)' : 'rgba(99, 102, 241, 0.5)'
                            }
                        },
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#6366f1',
                                borderWidth: '2px'
                            }
                        }
                    },
                    '& .MuiInputLabel-root': {
                        '&.Mui-focused': {
                            color: '#6366f1'
                        }
                    }
                }}
            />
            
            <SearchDropdown
                key={`search-${value}-${filteredItems.length}`}
                isOpen={isOpen}
                items={filteredItems}
                highlightedIndex={highlightedIndex}
                searchTerm={value}
                onSelect={handleSelect}
                onHighlight={setHighlightedIndex}
                dropdownRef={dropdownRef}
                placement={placement}
            />
        </Box>
    );
};

export default SearchInput;


