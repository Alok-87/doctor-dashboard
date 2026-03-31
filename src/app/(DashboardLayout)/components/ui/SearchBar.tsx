import React, { useState, useEffect, useRef } from 'react';
import { medicinSearch } from '../../../../../redux/medicine/medicineThunks';
import { MedicineResponse } from '../../../../../redux/medicine/types';
import { Input } from '../ui/input';
import { FaSearch } from 'react-icons/fa';
import Spinner from './Spinner';
import { useAppSelector, useAppDispatch } from '../../../../../redux/store/hook';

interface SearchBarProps {
    onSelect: (medicine: MedicineResponse) => void;
    disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, disabled }) => {
    const dispatch = useAppDispatch();
    const { searchedMedicines, loading: isSearching } = useAppSelector((state) => state.medicine);
    const [query, setQuery] = useState('');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const [selectionMade, setSelectionMade] = useState(false);
    const searchBarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectionMade || disabled) {
            setSelectionMade(false);
            return;
        }

        const handler = setTimeout(() => {
            if (query.length > 2) {
                dispatch(medicinSearch(query));
                setDropdownOpen(true);
            } else {
                setDropdownOpen(false);
            }
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [query, dispatch, selectionMade, disabled]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (medicine: any) => {
        if (disabled) return;
        if (medicine) {
            onSelect(medicine);
            setQuery('');
            setDropdownOpen(false);
            setSelectionMade(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;
        if (isDropdownOpen) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) =>
                    prevIndex < searchedMedicines.length - 1 ? prevIndex + 1 : prevIndex
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setHighlightedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < searchedMedicines.length) {
                    handleSelect(searchedMedicines[highlightedIndex]);
                }
            }
        }
    };

    return (
        <div className="relative w-full" ref={searchBarRef}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="Search for medicines..."
                    value={query}
                    onChange={(e) => {
                        if (disabled) return;
                        setQuery(e.target.value);
                        setSelectionMade(false);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full"
                    disabled={disabled}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isSearching ? <Spinner size="sm" /> : <FaSearch className="text-gray-400" />}
                </div>
            </div>
            {isDropdownOpen && searchedMedicines.length > 0 && !disabled && (
                <div className="absolute z-10 mt-1 w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <ul className="py-1">
                        {searchedMedicines.map((medicine: any, index: number) => (
                            <li
                                key={medicine.id}
                                className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                                    highlightedIndex === index ? 'bg-gray-200 dark:bg-zinc-600' : 'hover:bg-gray-100 dark:hover:bg-zinc-700'
                                } ${index !== searchedMedicines.length - 1 ? 'border-b border-gray-200 dark:border-zinc-700' : ''}`}
                                onClick={() => handleSelect(medicine)}
                                onMouseEnter={() => setHighlightedIndex(index)}
                            >
                                {medicine.product_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;