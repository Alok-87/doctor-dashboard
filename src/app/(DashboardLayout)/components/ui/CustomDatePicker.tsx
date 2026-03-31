'use client';

import React, { useState, useRef, useEffect, JSX } from 'react';

interface CustomDatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  anchor?: 'top' | 'bottom';
  minDate?: Date; // ✅ NEW: Minimum selectable date
}

type DatePickerView = 'year' | 'month' | 'day';

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  placeholder,
  anchor: propAnchor = 'bottom',
  minDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<DatePickerView>('day');
  const [displayDate, setDisplayDate] = useState(value || new Date());
  const [yearRangeStart, setYearRangeStart] = useState(1990);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dynamicAnchor, setDynamicAnchor] = useState<'top' | 'bottom'>(propAnchor);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;
      const minHeightOfDatePicker = 300;

      if (spaceBelow < minHeightOfDatePicker && spaceAbove > minHeightOfDatePicker) {
        setDynamicAnchor('top');
      } else {
        setDynamicAnchor('bottom');
      }
    } else if (!isOpen) {
      setDynamicAnchor(propAnchor);
    }
  }, [isOpen, propAnchor]);

  const handleYearSelect = (year: number) => {
    const newDate = new Date(displayDate);
    newDate.setFullYear(year);
    setDisplayDate(newDate);
    setCurrentView('month');
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(displayDate);
    newDate.setMonth(month);
    setDisplayDate(newDate);
    setCurrentView('day');
  };

  const handleDaySelect = (day: number) => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const selectedDate = new Date(year, month, day, 12, 0, 0);

    // ✅ Prevent selecting a date before minDate
    if (minDate && selectedDate < new Date(minDate.setHours(0, 0, 0, 0))) return;

    onChange(selectedDate);
    setIsOpen(false);
  };

  const renderYearView = () => {
    const years = Array.from({ length: 12 }, (_, i) => yearRangeStart + i);
    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <button type="button" onClick={() => setYearRangeStart((prev) => prev - 12)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft />
          </button>
          <span className="font-semibold">
            {yearRangeStart} - {yearRangeStart + 11}
          </span>
          <button type="button" onClick={() => setYearRangeStart((prev) => prev + 12)} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {years.map((year) => (
            <button
              type="button"
              key={year}
              className={`p-2 rounded hover:bg-gray-200 ${displayDate.getFullYear() === year ? 'bg-blue-500 text-white' : ''
                }`}
              onClick={() => handleYearSelect(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const months = Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'short' })
    );

    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <button type="button" onClick={() => setCurrentView('year')} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft />
          </button>
          <span className="font-semibold">{displayDate.getFullYear()}</span>
          <div />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {months.map((month, idx) => (
            <button
              type="button"
              key={month}
              className={`p-2 rounded hover:bg-gray-200 ${displayDate.getMonth() === idx ? 'bg-blue-500 text-white' : ''
                }`}
              onClick={() => handleMonthSelect(idx)}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDayOfMonth.getDay();

    const days: JSX.Element[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const thisDate = new Date(year, month, i, 12, 0, 0);
      const isDisabled = minDate ? thisDate < new Date(minDate.setHours(0, 0, 0, 0)) : false;
      const isSelected =
        value &&
        value.getFullYear() === year &&
        value.getMonth() === month &&
        value.getDate() === i;
      const isToday = new Date().toDateString() === new Date(year, month, i).toDateString();

      days.push(
        <button
          type="button"
          key={i}
          disabled={isDisabled}
          className={`p-2 rounded text-center transition ${isDisabled ? 'text-gray-400 cursor-not-allowed opacity-60' : 'hover:bg-gray-200'
            } ${isSelected ? 'bg-blue-500 text-white' : ''} ${isToday && !isSelected ? 'border border-blue-500' : ''
            }`}
          onClick={() => !isDisabled && handleDaySelect(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="p-2">
        <div className="flex justify-between items-center mb-2">
          <button
            type="button"
            onClick={() => setDisplayDate(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronLeft />
          </button>
          <span className="font-semibold">
            {displayDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button
            type="button"
            onClick={() => setDisplayDate(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <ChevronRight />
          </button>
        </div>
        <div className="grid grid-cols-7 text-xs font-medium text-center text-gray-500 mb-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">{days}</div>
      </div>
    );
  };

  return (
    <div className="relative" ref={pickerRef}>
      <input
        type="text"
        placeholder={placeholder}
        value={value ? value.toLocaleDateString() : ''}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setCurrentView('day');
        }}
        readOnly
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ref={inputRef}
      />
      {isOpen && (
        <div
          className={`min-w-[270px] absolute z-10 bg-white border border-gray-300 rounded shadow-lg ${dynamicAnchor === 'top'
              ? 'bottom-[calc(100%+6px)]'
              : 'top-[calc(100%+6px)]'
            }`}
        >
          <div className="flex justify-between items-center p-2 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setCurrentView('year')}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              {displayDate.getFullYear()}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('month')}
              className="px-2 py-1 rounded hover:bg-gray-100"
            >
              {displayDate.toLocaleString('default', { month: 'long' })}
            </button>
          </div>
          {currentView === 'year' && renderYearView()}
          {currentView === 'month' && renderMonthView()}
          {currentView === 'day' && renderDayView()}
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;

// SVG Icons
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
