import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "./custom-datepicker.css";

const DateInput = ({ label, selectedDate, setSelectedDate }) => {
  return (
    <div className="w-fit">
      <h2 className="flex flex-col items-start text-sm font-poppins font-medium text-[#202124] text-[1rem] mb-1 ml-0.25rem">{label}</h2>
      <div className="relative w-full">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="flex flex-col items-start w-full py-3 px-4 border border-white rounded-[0.5rem] text-[1rem] font-regular font-poppins bg-white resize-none focus:outline-0 focus:ring-0 shadow-md"
          placeholderText="Choisissez une date"
        />
      </div>
    </div>
  );
};

export default DateInput;