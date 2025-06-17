import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';
import { useDarkMode } from '../context/DarkModeContext';

export default function ProjectCalendar({ events }) {
  const [date, setDate] = useState(new Date());
  const { darkMode } = useDarkMode();

  // Group events by date for easier display
  const eventsByDate = events?.reduce((acc, event) => {
    const eventDate = new Date(event.date).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  const selectedDateEvents = events?.filter(event => 
    isSameDay(new Date(event.date), date)
  );

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toDateString();
    const dayEvents = eventsByDate?.[dateStr] || [];
    
    return (
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        {dayEvents.length > 0 && (
          <div className={`h-1 w-1 rounded-full ${
            darkMode ? 'bg-blue-400' : 'bg-blue-500'
          }`}></div>
        )}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toDateString();
    const hasEvents = eventsByDate?.[dateStr]?.length > 0;
    
    return hasEvents ? 'has-events' : null;
  };

  return (
    <div className={`rounded-lg shadow-md p-4 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-semibold mb-4 ${
        darkMode ? 'text-white' : 'text-gray-800'
      }`}>
        Project Calendar
      </h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className={`border-0 rounded-lg shadow-sm ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white'
            }`}
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <h3 className={`text-lg font-medium mb-3 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {format(date, 'MMMM d, yyyy')}
          </h3>
          
          {selectedDateEvents?.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className={`p-3 border rounded-lg ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className={`font-medium ${
                        darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className={`text-sm mt-1 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {event.description}
                        </p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'milestone' 
                        ? darkMode 
                          ? 'bg-purple-900/20 text-purple-200' 
                          : 'bg-purple-100 text-purple-800'
                        : darkMode 
                          ? 'bg-red-900/20 text-red-200' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  {event.project && (
                    <div className={`mt-2 text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Project: {event.project.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              No events scheduled for this day
            </p>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 400px;
          border: none;
        }
        .react-calendar__navigation button {
          color: ${darkMode ? '#fff' : '#1f2937'};
          background: none;
          font-size: 1rem;
          font-weight: 500;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: ${darkMode ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff'};
        }
        .react-calendar__tile {
          color: ${darkMode ? '#fff' : '#1f2937'};
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: ${darkMode ? 'rgba(59, 130, 246, 0.2)' : '#f0f9ff'};
        }
        .react-calendar__tile--now {
          background-color: ${darkMode ? 'rgba(59, 130, 246, 0.3)' : '#f0f9ff'};
        }
        .react-calendar__tile--active {
          background-color: ${darkMode ? '#3b82f6' : '#3b82f6'} !important;
          color: white !important;
        }
        .react-calendar__month-view__days__day--weekend {
          color: ${darkMode ? '#f87171' : '#dc2626'};
        }
        .react-calendar__tile.has-events {
          position: relative;
        }
        .react-calendar__tile.has-events::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          background-color: ${darkMode ? '#60a5fa' : '#3b82f6'};
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}