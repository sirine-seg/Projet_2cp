import React, { useState, useEffect } from 'react';

export default function DurationInput({ value = '', onChange }) {
    const [weeks, setWeeks] = useState('');

    // Parse initial value (assuming value is just a number/string of weeks)
    useEffect(() => {
        const parsedWeeks = parseInt(value, 10);
        setWeeks(isNaN(parsedWeeks) ? '' : parsedWeeks.toString());
    }, [value]);

    const handleChange = (e) => {
        const newVal = e.target.value;
        // Allow empty for deletion
        if (newVal.trim() === '') {
            setWeeks('');
            if (onChange) {
                onChange('');
            }
            return;
        }
        // Validate input as number
        const intVal = parseInt(newVal, 10);
        if (!isNaN(intVal) && intVal >= 0) {
            setWeeks(intVal.toString());
            if (onChange) {
                onChange(intVal.toString());
            }
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <label className="block text-sm">Weeks</label>
            <input
                type="number"
                min={0}
                placeholder="Number of weeks"
                value={weeks}
                onChange={handleChange}
                className="border rounded p-2 w-24"
            />
        </div>
    );
}