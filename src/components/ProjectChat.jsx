import { useState } from 'react';
import { useDarkMode } from '../context/DarkModeContext';

export default function ProjectChat({ projectId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { darkMode } = useDarkMode();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: 'You',
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Project Discussion
      </h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-2">
        {messages.length === 0 ? (
          <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No messages yet. Start the discussion!
          </div>
        ) : (
          messages.map(message => (
            <div key={message.id} className="flex">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium mr-3 ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-600'
              }`}>
                {message.sender.charAt(0)}
              </div>
              <div className="flex-1">
                <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {message.sender}
                  </p>
                  <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {message.text}
                  </p>
                </div>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="flex mt-auto">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <button
          type="submit"
          className={`px-4 py-2 rounded-r-lg ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Send
        </button>
      </form>
    </div>
  );
}