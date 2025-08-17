"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";
import { searchCities } from "@/lib/cities";

export default function CityAutocomplete({ value, onChange, placeholder, className = "" }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      const results = searchCities(query);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setShowSuggestions(false);
        setIsFocused(false);
        inputRef.current?.blur();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setQuery(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (city) => {
    setQuery(city.name);
    onChange(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="font-semibold text-red-600 bg-red-50 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getInputBorderClass = () => {
    if (isFocused) return "border-red-500 ring-2 ring-red-500";
    if (showSuggestions) return "border-red-400";
    return "border-gray-300";
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className={`relative border rounded-lg transition-all duration-200 ${getInputBorderClass()}`}>
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow click events
            setTimeout(() => setIsFocused(false), 150);
          }}
          placeholder={placeholder}
          className={`w-full h-12 pl-10 pr-12 bg-transparent outline-none ${className}`}
          autoComplete="off"
        />
        
        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        
        {/* Dropdown indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            showSuggestions ? 'rotate-180' : ''
          }`} />
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          <div className="px-3 py-2 border-b border-gray-100 bg-gray-50">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {suggestions.length} kota ditemukan
            </div>
          </div>
          
          {suggestions.map((city, index) => (
            <div
              key={`${city.name}-${city.province}`}
              onClick={() => handleSuggestionClick(city)}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                index === selectedIndex
                  ? "bg-red-50 border-l-4 border-l-red-500"
                  : "hover:bg-gray-50 border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {highlightMatch(city.name, query)}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {city.province}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showSuggestions && query.length >= 2 && suggestions.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl">
          <div className="px-4 py-6 text-center">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <div className="text-gray-500 font-medium">Tidak ada kota yang ditemukan</div>
            <div className="text-sm text-gray-400 mt-1">
              Coba cari dengan kata kunci yang berbeda
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!query && !isFocused && (
        <div className="mt-2 text-xs text-gray-400">
          Mulai ketik untuk mencari kota di Indonesia
        </div>
      )}
    </div>
  );
}
