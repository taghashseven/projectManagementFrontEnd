import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format, isSameDay } from 'date-fns';

export default function ProjectCalendar({ events }) {
  const [date, setDate] = useState(new Date());
  
  // Group events by date for easier display
  const eventsByDate = events?.reduce((acc, event) => {
    const eventDate = new Date(event.date).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    
    const dateStr = date.toDateString();
    const dayEvents = eventsByDate?.[dateStr] || [];
    
    return (
      <div className="absolute top-0 left-0 right-0 flex justify-center">
        {dayEvents.length > 0 && (
          <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
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

  const selectedDateEvents = events

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Project Calendar</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <Calendar
            onChange={setDate}
            value={date}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="border-0 rounded-lg shadow-sm"
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-medium mb-3">
            {format(date, 'MMMM d, yyyy')}
          </h3>
          
          {selectedDateEvents?.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      {event.description && (
                        <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      event.type === 'milestone' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  {event.project && (
                    <div className="mt-2 text-xs text-gray-500">
                      Project: {event.project.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No events scheduled for this day</p>
          )}
        </div>
      </div>
      
      <style jsx global>{`
        .react-calendar {
          width: 100%;
          max-width: 400px;
        }
        .react-calendar__tile--now {
          background-color: #f0f9ff;
        }
        .react-calendar__tile--active {
          background-color: #3b82f6;
          color: white;
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
          background-color: #3b82f6;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}