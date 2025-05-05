import React from 'react';

function InfoCard({ label, value, bgColorClass, textColorClass = 'text-black' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg shadow-sm p-6 ${bgColorClass}`}>
      <p className={`text-lg font-medium ${textColorClass} text-center`}>{label}</p>
      <p className={`text-2xl font-bold ${textColorClass} text-center`}>{value}</p>
    </div>
  );
}

export default InfoCard;