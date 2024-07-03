import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calender.css'; // Adjust if needed for your styles


export default function Calender({ Email }) {
  const [value, setValue] = useState(new Date());
  const [leaveData, setLeaveData] = useState({
    PresentDays: [],
    AbsentDays: [],
    LeavesDays: [],
    Holidays:[]
  });

  const NHolidays = [
    '2024-01-01',
    '2024-01-26',
    '2024-03-25',
    '2024-06-17',
    '2024-08-15',
    '2024-10-02',
    '2024-10-12',
    '2024-11-01',
    '2024-12-25',
  ];

  useEffect(() => {
    const fetchLeaveData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/calendar/${Email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        if (data && data.calendarData) {
          const { PresentDays=[]} = data.calendarData[0] || {};
          const { AbsentDays =[]} = data.calendarData[1] || {};
          const { LeavesDays =[]} = data.calendarData[2] || {};
          
          console.log( PresentDays);
          console.log(AbsentDays);
          console.log(LeavesDays);

  
          setLeaveData({
            PresentDays: PresentDays.map(day => parseDateString(day)),  // Convert string dates to Date objects
            AbsentDays: AbsentDays.map(day => parseDateString(day)),
            LeavesDays: LeavesDays.map(day => parseDateString(day)),
            Holidays: NHolidays.map(day => new Date(day))
      
          });
         
        }
      } catch (err) {
        console.error('Error fetching leave data:', err);
      }
    };

    if (Email) {
      fetchLeaveData();
    }
    
  }, [Email]);

  const parseDateString = (dateString) => {
    const [day, month, year] = dateString.split(':').map(Number);
    return new Date(year, month - 1, day); // month - 1 because months are zero-based in Date object
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate()  &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') { 
      
      if (leaveData.AbsentDays.some(day => isSameDay(day, date))) {
        return 'absent';
        
      }
      
     
      if (leaveData.PresentDays.some(day => isSameDay(day, date))) {
        return 'present';
      }
    
      if (leaveData.LeavesDays.some(day => isSameDay(day, date))) {
        return 'leavesTaken';
      }
      if (leaveData.Holidays.some(day => isSameDay(day, date))) {
        return 'holiday';
      }
     
  };
  return null;
}
  

  return (
    <div>
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={tileClassName}
        // style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}
      />
    </div>
  );

}