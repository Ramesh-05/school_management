import React from 'react';
import RcCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export type CalendarAltProps = {
  value: Date | null;
  onChange: (value: Date) => void;
  className?: string;
};

export function CalendarAlt({ value, onChange, className }: CalendarAltProps) {
  return (
    <div className={className}>
      <RcCalendar
        value={value ?? new Date()}
        onChange={(val) => {
          if (val instanceof Date) {
            onChange(val);
          }
        }}
        prev2Label={null}
        next2Label={null}
      />
    </div>
  );
}

export default CalendarAlt;


